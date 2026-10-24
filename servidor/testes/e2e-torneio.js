'use strict';
/**
 * Teste ponta a ponta dos torneios no AMBIENTE DE TESTE (banco xadrez_teste), com jogadores fictícios.
 * Roda NO SERVIDOR (como root): usa a API do teste (PostgREST :3211) com tokens dos jogadores fictícios, como o site, e
 * o psql (postgres) só para preparar cenário e conferir o banco. Nunca toca o banco oficial (aborta se PG_DB ≠ teste).
 *   cd /opt/xadrez/realtime-teste && set -a && . /opt/xadrez/etc/teste.env && set +a && node testes/e2e-torneio.js
 */
const assert = require('node:assert/strict');
const crypto = require('node:crypto');
const { execFileSync } = require('node:child_process');
const X = require('../motor/xadrez');

const API = 'http://127.0.0.1:3211';
const DB = 'xadrez_teste';
const SEGREDO = process.env.JWT_SECRET;
if (!SEGREDO) { console.error('rode com o teste.env carregado'); process.exit(2); }

function sql(q) {
  return execFileSync('sudo', ['-u', 'postgres', 'psql', '-X', '-At', '-v', 'ON_ERROR_STOP=1', '-d', DB, '-c', q], { encoding: 'utf8' }).trim();
}
if (sql('select current_database()') !== 'xadrez_teste') throw new Error('banco errado');
const jwt = claims => {
  const b = o => Buffer.from(JSON.stringify(o)).toString('base64url');
  const h = b({ alg: 'HS256', typ: 'JWT' }), p = b({ ...claims, exp: Math.floor(Date.now() / 1000) + 3600 });
  return h + '.' + p + '.' + crypto.createHmac('sha256', SEGREDO).update(h + '.' + p).digest('base64url');
};
const espera = ms => new Promise(r => setTimeout(r, ms));

// ---------- jogadores fictícios (e-mail @teste.invalid, apagados no fim)
const PREFIXO = 'e2e' + Date.now().toString(36);
function criarJogador(nome) {
  const id = crypto.randomUUID();
  const email = `${PREFIXO}-${nome.toLowerCase()}@teste.invalid`;
  sql(`insert into auth.users (id, instance_id, aud, role, email, raw_app_meta_data, raw_user_meta_data, created_at, updated_at, is_sso_user, is_anonymous)
       values ('${id}', '00000000-0000-0000-0000-000000000000', 'authenticated', 'authenticated', '${email}', '{"provider":"google"}',
               '{"full_name":"${nome} ${PREFIXO.slice(-4)}"}', now(), now(), false, false)`);
  const token = jwt({ sub: id, role: 'authenticated', aud: 'authenticated', email });
  return { id, nome, token };
}
async function api(u, metodo, caminho, corpo, extra = {}) {
  const r = await fetch(API + caminho, {
    method: metodo,
    headers: { 'Content-Type': 'application/json', Authorization: 'Bearer ' + u.token, Prefer: 'return=representation', ...extra },
    body: corpo === undefined ? undefined : JSON.stringify(corpo),
  });
  const txt = await r.text();
  let j; try { j = txt ? JSON.parse(txt) : null; } catch { j = txt; }
  return { ok: r.ok, status: r.status, j, erro: !r.ok ? (j && j.message) || txt : null };
}
const rpc = (u, fn, args = {}) => api(u, 'POST', '/rpc/' + fn, args);

let falhas = 0;
async function caso(nome, fn) {
  const t0 = Date.now();
  try { await fn(); console.log(`ok    ${nome} (${Date.now() - t0} ms)`); }
  catch (e) { falhas++; console.log(`FALHA ${nome}: ${e.message}`); }
}
async function aguardar(desc, fn, ms = 15000) {
  const fim = Date.now() + ms;
  while (Date.now() < fim) { const v = await fn(); if (v) return v; await espera(400); }
  throw new Error('esperei demais: ' + desc);
}

// ---------- cenário
const admin = criarJogador('Admin');
sql(`insert into admin_users (user_id) values ('${admin.id}')`);
const org = criarJogador('Organizadora');
const J = ['Ana', 'Bruno', 'Carla', 'Davi', 'Eva'].map(criarJogador);
const intruso = criarJogador('Intruso');

async function criarTorneioPago(dono, campos) {
  const base = { p_name: 'Torneio ' + PREFIXO, p_description: 'teste', p_prize: 'medalha', p_capacity: 8,
    p_starts_at: new Date(Date.now() + 3600_000).toISOString(), p_ends_at: null, p_difficulty: null, p_criterion: null,
    p_round_deadline_hours: 2, p_time_control_seconds: 300, p_format: 'pvp_bracket', p_visibility: 'public', ...campos };
  const r = await rpc(dono, 'create_tournament', base);
  assert.ok(r.ok, 'create_tournament: ' + r.erro);
  const c = await rpc(admin, 'confirm_tournament_payment', { p_tournament_id: r.j.id });
  assert.ok(c.ok, 'confirm: ' + c.erro);
  return r.j;
}
async function jogarLances(jogo, brancas, pretas, lances) {
  for (let i = 0; i < lances.length; i++) {
    const u = i % 2 === 0 ? brancas : pretas;
    const [f, t] = lances[i];
    const r = await api(u, 'POST', '/moves', { game_id: jogo, move_number: i + 1, player_color: i % 2 === 0 ? 'w' : 'b', from_sq: f, to_sq: t });
    if (!r.ok) return r;
  }
  return { ok: true };
}
const sq = n => (8 - Number(n[1])) * 8 + (n.charCodeAt(0) - 97);
const L = s => s.split(' ').map(m => [sq(m.slice(0, 2)), sq(m.slice(2, 4))]);
const MATE_DO_PASTOR = L('e2e4 e7e5 f1c4 b8c6 d1h5 g8f6 h5f7');      // Brancas dão mate no 7º lance
const quem = (m, id) => [m.player1_id, m.player2_id].includes(id);

(async () => {
  let T, partidas;

  await caso('criar chaveamento pago e inscrever 5 (1 rejeitado tenta voltar)', async () => {
    T = await criarTorneioPago(org, { p_visibility: 'approval' });
    for (const u of [...J, intruso]) { const r = await rpc(u, 'join_tournament', { p_tournament_id: T.id }); assert.ok(r.ok, u.nome + ': ' + r.erro); }
    const ps = (await rpc(org, 'get_tournament_participants', { p_tournament_id: T.id })).j;
    for (const p of ps) {
      const st = p.user_id === intruso.id ? 'rejected' : 'approved';
      const r = await rpc(org, 'set_participant_status', { p_participant_id: p.id, p_status: st });
      assert.ok(r.ok, r.erro);
    }
    // nomes de verdade (não 'Jogador'/'Anônimo'): o dono das funções precisa ler auth.users (migração 005)
    assert.ok(ps.every(p => p.user_name && !/^(Jogador|Anônimo)$/.test(p.user_name)), 'nome caiu no padrão: ' + ps.map(p => p.user_name).join(', '));
    assert.notEqual(sql(`select creator_name from tournaments where id = '${T.id}'`), 'Jogador');
    const volta = await rpc(intruso, 'join_tournament', { p_tournament_id: T.id });
    assert.equal(volta.ok, false, 'rejeitado conseguiu se reinscrever');
  });

  await caso('ataque: jogador inicia o torneio / força resultado / cria jogo ligado à partida', async () => {
    assert.equal((await rpc(J[0], 'start_bracket_tournament', { p_tournament_id: T.id })).ok, false);
  });

  await caso('iniciar: 5 inscritos → 3 rodadas, 3 passagens diretas, 1 partida', async () => {
    const r = await rpc(org, 'start_bracket_tournament', { p_tournament_id: T.id });
    assert.ok(r.ok, r.erro);
    assert.equal(r.j.total_rounds, 3);
    partidas = (await rpc(J[0], 'get_tournament_matches', { p_tournament_id: T.id })).j;
    assert.equal(partidas.filter(m => m.round === 1).length, 4);
    assert.equal(partidas.filter(m => m.reason === 'bye').length, 3);
  });

  let jogo, brancas, pretas, m1;
  await caso('sala: só cria o jogo com os DOIS presentes; intruso não abre', async () => {
    m1 = partidas.find(m => m.round === 1 && m.status === 'pending');
    const [a, b] = [J.find(u => u.id === m1.player1_id), J.find(u => u.id === m1.player2_id)];
    assert.equal((await rpc(intruso, 'tournament_match_start_game', { p_match_id: m1.id })).ok, false);
    const r1 = await rpc(a, 'tournament_match_start_game', { p_match_id: m1.id });
    assert.ok(r1.ok && r1.j === null, 'com um só presente não deveria criar jogo: ' + JSON.stringify(r1.j));
    const r2 = await rpc(b, 'tournament_match_start_game', { p_match_id: m1.id });
    assert.ok(r2.ok && typeof r2.j === 'string', r2.erro);
    jogo = r2.j;
    const g = (await api(a, 'GET', `/games?id=eq.${jogo}&select=white_user_id,black_user_id,status`)).j[0];
    brancas = J.find(u => u.id === g.white_user_id); pretas = J.find(u => u.id === g.black_user_id);
  });

  await caso('ataque: jogador marca o próprio jogo de torneio como vencido / cria jogo falso ligado à partida', async () => {
    const r = await api(brancas, 'PATCH', `/games?id=eq.${jogo}`, { status: 'finished', result: 'white_wins' });
    assert.equal(r.ok, false, 'conseguiu mudar o resultado');
    const f = await api(brancas, 'POST', '/games', { id: 'FAKE' + PREFIXO.slice(-2).toUpperCase(), white_user_id: brancas.id, status: 'active', tournament_match_id: m1.id, time_control: 300, current_turn: 'w' });
    assert.equal(f.ok, false, 'conseguiu criar jogo ligado à partida');
    assert.equal((await rpc(brancas, 'record_match_result', { p_match_id: m1.id, p_winner_id: brancas.id })).ok, false, 'jogador forçou resultado');
  });

  await caso('ataque: lance fora da vez e fora de ordem', async () => {
    const r = await api(pretas, 'POST', '/moves', { game_id: jogo, move_number: 1, player_color: 'b', from_sq: sq('e7'), to_sq: sq('e5') });
    assert.equal(r.ok, false);
    const r2 = await api(brancas, 'POST', '/moves', { game_id: jogo, move_number: 3, player_color: 'w', from_sq: sq('e2'), to_sq: sq('e4') });
    assert.equal(r2.ok, false);
  });

  await caso('xeque-mate de verdade: o juiz do servidor encerra e o chaveamento avança', async () => {
    const r = await jogarLances(jogo, brancas, pretas, MATE_DO_PASTOR);
    assert.ok(r.ok, r.erro);
    const g = await aguardar('juiz encerrar', async () => (await api(brancas, 'GET', `/games?id=eq.${jogo}&select=status,result,end_reason`)).j.find(x => x.status === 'finished'));
    assert.deepEqual([g.result, g.end_reason], ['white_wins', 'xeque_mate']);
    const ms = (await rpc(brancas, 'get_tournament_matches', { p_tournament_id: T.id })).j;
    assert.equal(ms.find(m => m.id === m1.id).winner_id, brancas.id);
    assert.equal(ms.filter(m => m.round === 2).length, 2, 'rodada 2 não criada');
  });

  await caso('lance ilegal: quem jogou perde (juiz)', async () => {
    const m = (await rpc(J[0], 'get_tournament_matches', { p_tournament_id: T.id })).j.find(x => x.round === 2 && x.status === 'pending');
    const [a, b] = [[...J].find(u => u.id === m.player1_id), [...J].find(u => u.id === m.player2_id)];
    await rpc(a, 'tournament_match_start_game', { p_match_id: m.id });
    const g = (await rpc(b, 'tournament_match_start_game', { p_match_id: m.id })).j;
    const gg = (await api(a, 'GET', `/games?id=eq.${g}&select=white_user_id`)).j[0];
    const w = gg.white_user_id === a.id ? a : b, bl = w === a ? b : a;
    const r = await jogarLances(g, w, bl, L('e2e4 e7e5 e1e3'));       // rei anda 2 casas: ilegal
    assert.ok(r.ok, r.erro);
    const fim = await aguardar('juiz', async () => (await api(a, 'GET', `/games?id=eq.${g}&select=status,result,end_reason`)).j.find(x => x.status === 'finished'));
    assert.deepEqual([fim.result, fim.end_reason], ['black_wins', 'lance_ilegal']);
  });

  await caso('desistência só do próprio jogador; adversário não desiste por ele', async () => {
    const m = (await rpc(J[0], 'get_tournament_matches', { p_tournament_id: T.id })).j.find(x => x.round === 2 && x.status === 'pending');
    const [a, b] = [J.find(u => u.id === m.player1_id), J.find(u => u.id === m.player2_id)];
    await rpc(a, 'tournament_match_start_game', { p_match_id: m.id });
    const g = (await rpc(b, 'tournament_match_start_game', { p_match_id: m.id })).j;
    assert.equal((await rpc(intruso, 'tournament_resign', { p_game_id: g })).ok, false);
    const r = await rpc(a, 'tournament_resign', { p_game_id: g });
    assert.ok(r.ok, r.erro);
    const mm = (await rpc(a, 'get_tournament_matches', { p_tournament_id: T.id })).j.find(x => x.id === m.id);
    assert.equal(mm.winner_id, b.id);
  });

  await caso('final com empate → desempate (cores invertidas) → Armageddon (empate = Pretas)', async () => {
    const m = await aguardar('final', async () => (await rpc(J[0], 'get_tournament_matches', { p_tournament_id: T.id })).j.find(x => x.round === 3));
    const [a, b] = [J.find(u => u.id === m.player1_id), J.find(u => u.id === m.player2_id)];
    await rpc(a, 'tournament_match_start_game', { p_match_id: m.id });
    let g = (await rpc(b, 'tournament_match_start_game', { p_match_id: m.id })).j;
    const cores = [];
    for (let i = 0; i < 3; i++) {
      const gg = sql(`select white_user_id from games where id = '${g}'`);
      cores.push(gg);
      sql(`select xadrez_rt.encerrar_jogo('${g}', 'draw', 'material')`);          // empate (o juiz já é testado acima)
      if (i < 2) g = sql(`select game_id from tournament_matches where id = '${m.id}'`);
    }
    assert.notEqual(cores[0], cores[1], 'desempate não inverteu as cores');
    const fim = sql(`select g.result || '|' || g.end_reason || '|' || (t.winner_id = g.black_user_id) from games g join tournament_matches mm on mm.game_id = g.id join tournaments t on t.id = mm.tournament_id where mm.id = '${m.id}'`);
    assert.equal(fim, 'black_wins|material_armageddon|true');
    assert.equal(sql(`select status || '|' || (winner_id is not null) from tournaments where id = '${T.id}'`), 'finished|true');
  });

  await caso('W.O. pela rotina: prazo vencido, só um abriu a sala → ele vence', async () => {
    const T2 = await criarTorneioPago(org, {});
    for (const u of J.slice(0, 2)) await rpc(u, 'join_tournament', { p_tournament_id: T2.id });
    await rpc(org, 'start_bracket_tournament', { p_tournament_id: T2.id });
    const m = (await rpc(J[0], 'get_tournament_matches', { p_tournament_id: T2.id })).j[0];
    await rpc(J[1], 'tournament_match_start_game', { p_match_id: m.id });
    sql(`update tournament_matches set deadline_at = now() - interval '1 minute' where id = '${m.id}'`);
    sql('select xadrez_rt.tick()');
    const r = sql(`select (winner_id = '${J[1].id}') || '|' || reason from tournament_matches where id = '${m.id}'`);
    assert.equal(r, 'true|wo_ausencia');
  });

  await caso('tempo esgotado pela rotina (relógio do servidor)', async () => {
    const T3 = await criarTorneioPago(org, {});
    for (const u of J.slice(0, 2)) await rpc(u, 'join_tournament', { p_tournament_id: T3.id });
    await rpc(org, 'start_bracket_tournament', { p_tournament_id: T3.id });
    const m = (await rpc(J[0], 'get_tournament_matches', { p_tournament_id: T3.id })).j[0];
    await rpc(J[0], 'tournament_match_start_game', { p_match_id: m.id });
    const g = (await rpc(J[1], 'tournament_match_start_game', { p_match_id: m.id })).j;
    const w = sql(`select white_user_id from games where id = '${g}'`) === J[0].id ? J[0] : J[1];
    const bl = w === J[0] ? J[1] : J[0];
    await jogarLances(g, w, bl, L('e2e4 e7e5 g1f3'));
    sql(`update moves set created_at = created_at - interval '10 minutes' where game_id = '${g}' and move_number = 3`);  // vez das Pretas há 10 min
    sql(`update moves set created_at = created_at - interval '10 minutes' where game_id = '${g}' and move_number < 3`);
    sql('select xadrez_rt.tick()');
    assert.equal(sql(`select result || '|' || end_reason from games where id = '${g}'`), 'white_wins|tempo');
  });

  await caso('torneio por link: sem o código não entra; com o código entra', async () => {
    const T4 = await criarTorneioPago(org, { p_visibility: 'link' });
    assert.equal((await rpc(J[2], 'join_tournament', { p_tournament_id: T4.id })).ok, false);
    const r = await rpc(J[2], 'join_tournament', { p_tournament_id: T4.id, p_token: T4.share_token });
    assert.ok(r.ok, r.erro);
  });

  await caso('corrida de vagas: 6 inscrições simultâneas em torneio de 4 vagas', async () => {
    const T5 = await criarTorneioPago(org, { p_capacity: 4 });
    const extras = [criarJogador('X1'), criarJogador('X2')];
    await Promise.all([...J, ...extras].slice(0, 6).map(u => rpc(u, 'join_tournament', { p_tournament_id: T5.id })));
    assert.equal(sql(`select count(*) from tournament_participants where tournament_id = '${T5.id}' and status = 'approved'`), '4');
  });

  // ---------- ranking contra a IA
  let TA;
  await caso('ranking de IA: vitória legítima jogada ao vivo é aceita pela conferência', async () => {
    TA = await criarTorneioPago(org, { p_format: 'ai', p_difficulty: 1, p_criterion: 'fastest_win',
      p_starts_at: new Date(Date.now() + 2000).toISOString(), p_ends_at: new Date(Date.now() + 3600_000).toISOString(), p_round_deadline_hours: null });
    await rpc(J[0], 'join_tournament', { p_tournament_id: TA.id });
    await rpc(J[1], 'join_tournament', { p_tournament_id: TA.id });
    await espera(2500);
    // partida: jogador = melhor lance a profundidade 3; IA = candidato sorteado (profundidade 1), lances gravados ao vivo
    let vit = null;
    for (let tent = 0; tent < 30 && !vit; tent++) {
      let e = X.inicial(); const ls = [];
      for (let ply = 0; ply < 160 && !X.fim(e); ply++) {
        const c = e.turn === 'b' ? X.candidatosIA(e, 1) : X.candidatosIA(e, 3);
        const m = c[Math.floor(Math.random() * c.length)];
        ls.push(m); e = X.jogar(e, m);
      }
      const f = X.fim(e);
      if (f && f.tipo === 'mate' && f.vencedor === 'w') vit = ls;
    }
    assert.ok(vit, 'não gerei vitória');
    const sessao = 'aig-' + PREFIXO;
    for (let i = 0; i < vit.length; i++) {
      const r = await api(J[0], 'POST', '/ai_game_moves', { user_id: J[0].id, session_id: sessao, move_number: i + 1, from_sq: vit[i].from,
        to_sq: vit[i].to, promotion: vit[i].promo || null, difficulty: 1, is_ai_move: i % 2 === 1 });
      assert.ok(r.ok, r.erro);
      await espera(i % 2 === 0 ? 1100 : 150);                    // jogador "pensa", IA responde rápido
    }
    const s = await rpc(J[0], 'register_ai_score', { p_session_id: sessao, p_difficulty: 1, p_username: 'Ana', p_tournament_id: TA.id,
      p_client_mouse_movements: 200, p_client_idle_periods: 3, p_client_drag_count: 5, p_client_keyboard_events: 2 });
    assert.ok(s.ok, s.erro);
    assert.equal(s.j.status, 'pendente');
    const st = await aguardar('conferência', async () => { const v = sql(`select status || '|' || coalesce(timed_live::text,'') from scores where id = '${s.j.score_id}'`); return v.startsWith('pendente') ? null : v; }, 60000);
    assert.equal(st, 'normal|true');
  });

  await caso('ranking de IA: vitória forjada (3 lances) é rejeitada e não pontua', async () => {
    const sessao = 'aig-forja-' + PREFIXO;
    for (const [i, [f, t]] of L('e2e4 e7e5 d1h5').entries()) {
      await api(J[1], 'POST', '/ai_game_moves', { user_id: J[1].id, session_id: sessao, move_number: i + 1, from_sq: f, to_sq: t, difficulty: 1, is_ai_move: i % 2 === 1 });
    }
    const s = await rpc(J[1], 'register_ai_score', { p_session_id: sessao, p_difficulty: 1, p_username: 'Bruno', p_tournament_id: TA.id,
      p_client_validated: true, p_client_player_seconds: 1 });
    assert.ok(s.ok, s.erro);
    const st = await aguardar('conferência', async () => { const v = sql(`select status || '|' || coalesce(reject_reason,'') from scores where id = '${s.j.score_id}'`); return v.startsWith('pendente') ? null : v; }, 30000);
    assert.match(st, /^rejeitado\|(nao_terminou|lance_da_ia_impossivel)$/);
    const lb = (await rpc(J[1], 'tournament_leaderboard', { p_tournament_id: TA.id })).j;
    assert.equal(lb[0].user_id, J[0].id, 'forjado entrou na classificação');
    assert.equal(lb.find(x => x.user_id === J[1].id).wins, 0);
  });

  await caso('ranking de IA encerra sozinho no fim, com o campeão gravado', async () => {
    sql(`update tournaments set ends_at = now() - interval '11 minutes' where id = '${TA.id}'`);
    sql('select xadrez_rt.tick()');
    assert.equal(sql(`select status || '|' || (winner_id = '${J[0].id}') from tournaments where id = '${TA.id}'`), 'finished|true');
  });

  // ---------- Pix (modo simulado do ambiente de teste) e assinatura do webhook
  const RT = 'http://127.0.0.1:3212';
  const post = async (u, caminho, corpo) => {
    const r = await fetch(RT + caminho, { method: 'POST', headers: { 'Content-Type': 'application/json', ...(u ? { Authorization: 'Bearer ' + u.token } : {}) }, body: JSON.stringify(corpo) });
    return { status: r.status, j: await r.json().catch(() => null) };
  };
  await caso('Pix: só o criador gera a cobrança; a mesma é reaproveitada; o pagamento libera o torneio', async () => {
    const r = await rpc(org, 'create_tournament', { p_name: 'Pix ' + PREFIXO, p_description: null, p_prize: 'troféu', p_format: 'pvp_bracket',
      p_visibility: 'public', p_capacity: 4, p_starts_at: new Date(Date.now() + 3600_000).toISOString(), p_ends_at: null, p_difficulty: null,
      p_criterion: null, p_round_deadline_hours: 2, p_time_control_seconds: 300 });
    assert.ok(r.ok, r.erro);
    assert.equal((await post(intruso, '/functions/v1/pix-cobranca', { tournament_id: r.j.id })).status, 404, 'intruso gerou cobrança');
    assert.equal((await post(null, '/functions/v1/pix-cobranca', { tournament_id: r.j.id })).status, 401);
    const c1 = await post(org, '/functions/v1/pix-cobranca', { tournament_id: r.j.id });
    assert.equal(c1.status, 200, JSON.stringify(c1.j));
    assert.equal(c1.j.status, 'pendente');
    assert.ok(c1.j.qr_code && c1.j.simulado);
    const c2 = await post(org, '/functions/v1/pix-cobranca', { tournament_id: r.j.id });
    assert.equal(c2.j.qr_code, c1.j.qr_code, 'gerou outra cobrança em vez de reaproveitar');
    const st = (await rpc(org, 'tournament_payment_status', { p_tournament_id: r.j.id })).j[0];
    assert.deepEqual([st.paid, st.status], [false, 'pendente']);
    assert.equal((await rpc(intruso, 'tournament_payment_status', { p_tournament_id: r.j.id })).j.length, 0, 'intruso viu o pagamento');
    const s = await post(org, '/functions/v1/pix-simular', { tournament_id: r.j.id });
    assert.equal(s.j.resultado, 'liberado');
    assert.equal(sql(`select paid from tournaments where id = '${r.j.id}'`), 't');
    assert.equal((await post(org, '/functions/v1/pix-cobranca', { tournament_id: r.j.id })).j.status, 'pago');
  });
  await caso('aviso do Mercado Pago falso (sem assinatura / assinatura falsa / formato antigo) não muda nenhum pagamento', async () => {
    const antes = sql(`select count(*) || '|' || coalesce(sum(case when status = 'pago' then 1 else 0 end), 0) from xadrez_rt.pagamentos`);
    for (const [url, h] of [['/pagamentos/mp?data.id=123&type=payment', {}],
                            ['/pagamentos/mp?data.id=123&type=payment', { 'x-signature': 'ts=1,v1=' + 'a'.repeat(64), 'x-request-id': 'r1' }],
                            ['/pagamentos/mp?topic=payment&id=999', {}]]) {
      const r = await fetch(RT + url, { method: 'POST', body: '{}', headers: h });
      assert.equal(r.status, 200, 'o MP reenviaria sem fim');
    }
    await espera(500);
    assert.equal(sql(`select count(*) || '|' || coalesce(sum(case when status = 'pago' then 1 else 0 end), 0) from xadrez_rt.pagamentos`), antes);
  });
  await caso('compartilhar: /t/<id> mostra a prévia do torneio público; privado só com o código; desconhecido vai para a lista', async () => {
    const T6 = await criarTorneioPago(org, { p_name: 'Copa Prévia ' + PREFIXO });
    const pub = await (await fetch(RT + '/t/' + T6.id, { headers: { host: 'novo.xadrezonline.app' } })).text();
    assert.match(pub, /og:title" content="Inscrições abertas: Copa Prévia/);
    assert.ok(pub.includes('/torneios?id=' + T6.id), 'não redireciona para a página do torneio');
    const T7 = await criarTorneioPago(org, { p_name: 'Privado ' + PREFIXO, p_visibility: 'link' });
    assert.doesNotMatch(await (await fetch(RT + '/t/' + T7.id)).text(), /Privado/, 'privado vazou pelo id');
    assert.match(await (await fetch(RT + '/t/' + T7.share_token)).text(), /Privado/);
    const nada = await (await fetch(RT + '/t/' + '0'.repeat(16))).text();
    assert.ok(nada.includes('/torneios"') || nada.includes('/torneios\\"'), 'código desconhecido deveria ir para a lista');
  });

  // ---------- limpeza: some tudo que o teste criou (partida ↔ jogo se referenciam: desfazer o vínculo antes)
  const DOS = `(select id from auth.users where email like '${PREFIXO}-%')`;
  sql(`update tournament_matches set game_id = null where tournament_id in (select id from tournaments where creator_id in ${DOS})`);
  sql(`delete from moves where game_id in (select id from games where white_user_id in ${DOS} or black_user_id in ${DOS})`);
  sql(`delete from games where white_user_id in ${DOS} or black_user_id in ${DOS}`);
  sql(`delete from tournaments where creator_id in ${DOS}`);
  sql(`delete from scores where user_id in ${DOS}`);
  sql(`delete from ai_game_moves where user_id in ${DOS}`);
  sql(`delete from auth.users where email like '${PREFIXO}-%'`);
  console.log(falhas ? `\n${falhas} FALHA(S)` : '\ntudo ok');
  process.exit(falhas ? 1 : 0);
})().catch(e => { console.error(e); process.exit(1); });
