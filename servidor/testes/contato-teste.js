'use strict';
/**
 * Teste do formulário de contato (D-CON-*) no AMBIENTE DE TESTE, pelo caminho real (Caddy → tempo real do teste):
 * validação, honeypot, tempo mínimo, limites (IP, e-mail, tentativas), RPCs do admin e o bloqueio da tabela pela API.
 * Roda NO SERVIDOR (como root) com o teste.env carregado; aborta fora do banco xadrez_teste. Tudo o que cria
 * (mensagens e usuários `ct-*@teste.invalid`) é apagado no fim, mesmo com falha.
 *   set -a && . /opt/xadrez/etc/teste.env && set +a && node contato-teste.js
 */
const assert = require('node:assert/strict');
const crypto = require('node:crypto');
const { execFileSync } = require('node:child_process');

const SITE = 'https://novo.xadrezonline.app';
const API = SITE + '/functions/v1/contato';
const DB = 'xadrez_teste';
const SEGREDO = process.env.JWT_SECRET, ANON = process.env.ANON_KEY;
if (!SEGREDO || !ANON) { console.error('rode com o teste.env carregado'); process.exit(2); }
const sql = q => execFileSync('sudo', ['-u', 'postgres', 'psql', '-X', '-At', '-v', 'ON_ERROR_STOP=1', '-d', DB, '-c', q], { encoding: 'utf8' }).trim();
if (sql('select current_database()') !== DB) throw new Error('banco errado');
const jwt = claims => {
  const b = o => Buffer.from(JSON.stringify(o)).toString('base64url');
  const h = b({ alg: 'HS256', typ: 'JWT' }), p = b({ ...claims, exp: Math.floor(Date.now() / 1000) + 3600 });
  return h + '.' + p + '.' + crypto.createHmac('sha256', SEGREDO).update(h + '.' + p).digest('base64url');
};
const espera = ms => new Promise(r => setTimeout(r, ms));
const MARCA = 'MARCA-' + crypto.randomBytes(6).toString('hex');   // não pode aparecer no log
const usuarios = [];
function criarUsuario(nome, admin) {
  const id = crypto.randomUUID(), email = `ct-${nome}@teste.invalid`;
  sql(`insert into auth.users (id, instance_id, aud, role, email, raw_app_meta_data, raw_user_meta_data, created_at, updated_at, is_sso_user, is_anonymous)
       values ('${id}', '00000000-0000-0000-0000-000000000000', 'authenticated', 'authenticated', '${email}', '{"provider":"google"}',
               '{"full_name":"${nome} (ct)"}', now(), now(), false, false)`);
  if (admin) sql(`insert into admin_users (user_id) values ('${id}')`);
  usuarios.push(id);
  return { id, email, token: jwt({ sub: id, role: 'authenticated', aud: 'authenticated', email }) };
}
function limpar() {
  sql(`delete from xadrez_rt.contato where email like 'ct-%@teste.invalid'`);
  if (usuarios.length) {
    const ids = usuarios.map(i => `'${i}'`).join(',');
    sql(`delete from admin_users where user_id in (${ids})`);
    sql(`delete from auth.users where id in (${ids})`);
  }
}

let ok = 0;
async function caso(nome, fn) { await fn(); ok++; console.log('ok  ', nome); }
async function post(corpo, extra = {}) {
  const r = await fetch(API, { method: 'POST', headers: { 'content-type': 'application/json', ...extra }, body: typeof corpo === 'string' ? corpo : JSON.stringify(corpo) });
  return { st: r.status, j: await r.json().catch(() => ({})) };
}
async function rest(caminho, { token, metodo = 'GET', corpo, cab = {} } = {}) {
  const r = await fetch(SITE + '/rest/v1/' + caminho, { method: metodo, headers: { apikey: ANON, Authorization: 'Bearer ' + (token || ANON),
    'content-type': 'application/json', ...cab }, body: corpo ? JSON.stringify(corpo) : undefined });
  const t = await r.text();
  let j; try { j = JSON.parse(t); } catch { j = t; }
  return { st: r.status, j };
}
const linhas = email => Number(sql(`select count(*) from xadrez_rt.contato where email = '${email}'`));

(async () => {
  limpar();
  const inicio = new Date().toISOString();
  const token = (await (await fetch(API)).json()).token;
  assert.match(token, /^\d{13}\.[A-Za-z0-9_-]{32}$/);
  const base = (email, extra = {}) => ({ nome: 'Contato Teste', email, assunto: 'duvida', mensagem: 'Mensagem de teste ' + MARCA, idioma: 'pt', token, site_web: '', ...extra });

  await caso('envio rápido demais (< 3 s) → 422 rapido, nada gravado', async () => {
    const r = await post(base('ct-rapido@teste.invalid'));
    assert.equal(r.st, 422); assert.equal(r.j.erro, 'rapido'); assert.equal(linhas('ct-rapido@teste.invalid'), 0);
  });
  await espera(3200);

  await caso('envio válido anônimo → 200, gravado sem user_id, IP só como hash', async () => {
    const r = await post(base('ct-anon@teste.invalid', { assunto: 'pagamento', link: SITE + '/torneios?id=teste' }));
    assert.equal(r.st, 200); assert.deepEqual(r.j, { ok: true });
    const [uid, ip, link, st, idioma] = sql(`select coalesce(user_id::text,'-'), ip_hash, link, status, idioma from xadrez_rt.contato where email = 'ct-anon@teste.invalid'`).split('|');
    assert.equal(uid, '-'); assert.match(ip, /^[0-9a-f]{64}$/); assert.equal(link, SITE + '/torneios?id=teste'); assert.equal(st, 'nova'); assert.equal(idioma, 'pt');
  });

  const user = criarUsuario('user'), admin = criarUsuario('admin', true);
  await caso('envio válido logado (token da sessão) → 200, user_id gravado', async () => {
    const r = await post(base('ct-logado@teste.invalid', { idioma: 'en', assunto: 'sugestao' }), { authorization: 'Bearer ' + user.token });
    assert.equal(r.st, 200);
    assert.equal(sql(`select user_id from xadrez_rt.contato where email = 'ct-logado@teste.invalid'`), user.id);
  });
  await caso('token de sessão inválido = visitante (não erro)', async () => {
    const r = await post(base('ct-tokenruim@teste.invalid'), { authorization: 'Bearer abc.def.ghi' });
    assert.equal(r.st, 200);
    assert.equal(sql(`select coalesce(user_id::text,'-') from xadrez_rt.contato where email = 'ct-tokenruim@teste.invalid'`), '-');
  });
  await caso('honeypot preenchido → 200 {ok:true} igual, nada gravado', async () => {
    const r = await post(base('ct-robo@teste.invalid', { site_web: 'http://spam.example' }));
    assert.equal(r.st, 200); assert.deepEqual(r.j, { ok: true }); assert.equal(linhas('ct-robo@teste.invalid'), 0);
  });
  await caso('e-mail inválido → 400 email_invalido', async () => {
    const r = await post(base('ct-semdominio@'));
    assert.equal(r.st, 400); assert.equal(r.j.erro, 'email_invalido'); assert.equal(r.j.campo, 'email');
  });
  await caso('mensagem com 4.001 caracteres → 400 mensagem_longa', async () => {
    const r = await post(base('ct-longa@teste.invalid', { mensagem: 'x'.repeat(4001) }));
    assert.equal(r.st, 400); assert.equal(r.j.erro, 'mensagem_longa'); assert.equal(linhas('ct-longa@teste.invalid'), 0);
  });
  await caso('corpo gigante (200 KB) → 413 grande', async () => {
    const r = await post(base('ct-gigante@teste.invalid', { mensagem: 'x'.repeat(200_000) }));
    assert.equal(r.st, 413); assert.equal(r.j.erro, 'grande');
  });
  await caso('assunto fora da lista → 400 assunto', async () => {
    const r = await post(base('ct-assunto@teste.invalid', { assunto: 'phishing' }));
    assert.equal(r.st, 400); assert.equal(r.j.erro, 'assunto');
  });
  await caso('4 links na mensagem → 400 links', async () => {
    const r = await post(base('ct-links@teste.invalid', { mensagem: 'veja http://a.com https://b.com www.c.com https://d.com' }));
    assert.equal(r.st, 400); assert.equal(r.j.erro, 'links');
  });
  await caso('link de outro domínio → 400 link', async () => {
    const r = await post(base('ct-linkfora@teste.invalid', { assunto: 'problema', link: 'https://golpe.example/torneio' }));
    assert.equal(r.st, 400); assert.equal(r.j.erro, 'link');
  });
  await caso('horário assinado falso → 422 token com um novo', async () => {
    const r = await post(base('ct-falso@teste.invalid', { token: '1700000000000.' + 'A'.repeat(32) }));
    assert.equal(r.st, 422); assert.equal(r.j.erro, 'token'); assert.match(r.j.token, /^\d{13}\./);
  });
  await caso('limite por e-mail (3/h) → 429 limite_email', async () => {
    for (let i = 0; i < 3; i++) sql(`insert into xadrez_rt.contato (nome, email, assunto, mensagem, ip_hash) values ('x', 'ct-repetido@teste.invalid', 'outro', 'semeado pelo teste', 'outro-ip-${i}')`);
    const r = await post(base('ct-repetido@teste.invalid'));
    assert.equal(r.st, 429); assert.equal(r.j.motivo, 'limite_email'); assert.equal(linhas('ct-repetido@teste.invalid'), 3);
  });
  await caso('limite por IP (5/h): 6º envio → 429 limite_ip, inclusive com X-Forwarded-For forjado', async () => {
    // já gravados deste IP: anon, logado, tokenruim = 3
    for (const n of ['ip4', 'ip5']) assert.equal((await post(base(`ct-${n}@teste.invalid`))).st, 200);
    const r = await post(base('ct-ip6@teste.invalid'));
    assert.equal(r.st, 429); assert.equal(r.j.motivo, 'limite_ip'); assert.equal(linhas('ct-ip6@teste.invalid'), 0);
    const f = await post(base('ct-ip7@teste.invalid'), { 'x-forwarded-for': '203.0.113.' + (1 + Math.floor(Math.random() * 200)) });
    assert.equal(f.st, 429); assert.equal(f.j.motivo, 'limite_ip');
  });
  await caso('tentativas por IP (20 em 10 min, também as recusadas) → 429 sem tocar o banco', async () => {
    let n = 0, r;
    do { r = await post(base('ct-rajada@teste.invalid', { assunto: 'x' })); n++; } while (r.st === 400 && n < 30);
    assert.equal(r.st, 429); assert.equal(r.j.erro, 'limite'); assert.equal(r.j.motivo, undefined);
    console.log('     (barrado na tentativa', n, 'desta rajada)');
  });

  const idAnon = sql(`select id from xadrez_rt.contato where email = 'ct-anon@teste.invalid'`);
  await caso('admin lista (novas primeiro) e vê a conta de quem estava logado', async () => {
    const r = await rest('rpc/admin_contatos', { token: admin.token, metodo: 'POST', corpo: { p_status: null } });
    assert.equal(r.st, 200);
    const nossos = r.j.filter(c => c.email.startsWith('ct-'));
    assert.ok(nossos.length >= 5);
    const primeiraNaoNova = r.j.findIndex(c => c.status !== 'nova');
    assert.ok(primeiraNaoNova === -1 || r.j.slice(primeiraNaoNova).every(c => c.status !== 'nova'));
    assert.equal(r.j.find(c => c.email === 'ct-logado@teste.invalid').conta_email, user.email);
    assert.equal(r.j.find(c => c.id === idAnon).ip_hash, undefined);
  });
  await caso('admin marca respondida (+nota), spam, nova', async () => {
    let r = await rest('rpc/admin_contato_marcar', { token: admin.token, metodo: 'POST', corpo: { p_id: idAnon, p_status: 'respondida', p_nota: 'respondi por e-mail' } });
    assert.equal(r.st, 200); assert.equal(r.j, 'respondida');
    assert.equal(sql(`select status || '|' || (respondida_em is not null) || '|' || nota_admin from xadrez_rt.contato where id = '${idAnon}'`), 'respondida|true|respondi por e-mail');
    r = await rest('rpc/admin_contatos', { token: admin.token, metodo: 'POST', corpo: { p_status: 'respondida' } });
    assert.ok(r.j.length >= 1 && r.j.every(c => c.status === 'respondida'));
    r = await rest('rpc/admin_contato_marcar', { token: admin.token, metodo: 'POST', corpo: { p_id: idAnon, p_status: 'spam' } });
    assert.equal(r.j, 'spam');
    assert.equal(sql(`select nota_admin from xadrez_rt.contato where id = '${idAnon}'`), 'respondi por e-mail');   // nota nula = não mexe
    r = await rest('rpc/admin_contato_marcar', { token: admin.token, metodo: 'POST', corpo: { p_id: idAnon, p_status: 'nova', p_nota: '' } });
    assert.equal(sql(`select status || '|' || (respondida_em is null) || '|' || coalesce(nota_admin, '-') from xadrez_rt.contato where id = '${idAnon}'`), 'nova|true|-');
    r = await rest('rpc/admin_contato_marcar', { token: admin.token, metodo: 'POST', corpo: { p_id: idAnon, p_status: 'apagada' } });
    assert.equal(r.st, 400); assert.match(JSON.stringify(r.j), /invalid status/);
  });
  await caso('não-admin logado: lista vazia e marcar recusado', async () => {
    let r = await rest('rpc/admin_contatos', { token: user.token, metodo: 'POST', corpo: { p_status: null } });
    assert.equal(r.st, 200); assert.deepEqual(r.j, []);
    r = await rest('rpc/admin_contato_marcar', { token: user.token, metodo: 'POST', corpo: { p_id: idAnon, p_status: 'spam' } });
    assert.equal(r.st, 400); assert.match(JSON.stringify(r.j), /admin only/);
  });
  await caso('anônimo (chave anon): lista vazia e marcar recusado', async () => {
    let r = await rest('rpc/admin_contatos', { metodo: 'POST', corpo: {} });
    assert.equal(r.st, 200); assert.deepEqual(r.j, []);
    r = await rest('rpc/admin_contato_marcar', { metodo: 'POST', corpo: { p_id: idAnon, p_status: 'spam' } });
    assert.ok(r.st >= 400); assert.equal(sql(`select status from xadrez_rt.contato where id = '${idAnon}'`), 'nova');
  });
  await caso('anônimo NÃO lê xadrez_rt.contato pela API (nem pedindo o schema) nem chama a gravação', async () => {
    const tentativas = [
      await rest('contato?select=*'),
      await rest('contato?select=*', { cab: { 'Accept-Profile': 'xadrez_rt' } }),
      await rest('contato?select=*', { token: user.token, cab: { 'Accept-Profile': 'xadrez_rt' } }),
      await rest('rpc/contato_gravar', { metodo: 'POST', corpo: { p_nome: 'x', p_email: 'ct-api@teste.invalid', p_assunto: 'outro', p_mensagem: 'pela api', p_link: null, p_user: null, p_ip_hash: null, p_idioma: 'pt' } }),
      await rest('rpc/contato_gravar', { metodo: 'POST', cab: { 'Content-Profile': 'xadrez_rt' }, corpo: { p_nome: 'x', p_email: 'ct-api@teste.invalid', p_assunto: 'outro', p_mensagem: 'pela api', p_link: null, p_user: null, p_ip_hash: null, p_idioma: 'pt' } }),
    ];
    for (const t of tentativas) { assert.ok(t.st >= 400, JSON.stringify(t)); assert.ok(!Array.isArray(t.j)); }
    console.log('     respostas:', tentativas.map(t => t.st + ' ' + (t.j.code || '')).join(' · '));
    assert.equal(linhas('ct-api@teste.invalid'), 0);
  });
  await caso('o texto da mensagem não aparece no log do tempo real', async () => {
    const minutos = Math.ceil((Date.now() - Date.parse(inicio)) / 60_000) + 1;
    const log = execFileSync('journalctl', ['-u', 'xadrez-teste-rt', '--since', `-${minutos} min`, '--no-pager', '-o', 'cat'], { encoding: 'utf8' });
    assert.ok(log.includes('[contato] recebida'), 'o log deveria ter as linhas do contato');
    assert.ok(!log.includes(MARCA), 'o texto da mensagem apareceu no log');
    assert.ok(!log.includes('ct-anon@teste.invalid'), 'o e-mail apareceu no log');
  });
})().then(() => { limpar(); console.log(`\n${ok} casos ok · mensagens e usuários de teste apagados (restam ${sql(`select count(*) from xadrez_rt.contato where email like 'ct-%@teste.invalid'`)})`); },
  e => { limpar(); console.error('FALHOU:', e.message); process.exit(1); });
