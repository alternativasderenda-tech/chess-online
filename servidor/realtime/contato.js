'use strict';
/**
 * Formulário de contato (D-CON-01…07). Rotas:
 *   GET  /functions/v1/contato  → { token }  horário assinado; o envio só vale de 3 s a 24 h depois dele
 *   POST /functions/v1/contato  { nome, email, assunto, mensagem, link?, idioma, token, site_web }
 *        Authorization: Bearer <token da sessão> (opcional) → grava o user_id
 * Respostas JSON: 200 { ok: true } · 400/413/422 { ok: false, erro, campo? } · 429 { ok: false, erro: 'limite' }.
 * Anti-spam sem captcha: honeypot `site_web` (preenchido = "ok" falso, nada gravado), tempo mínimo de preenchimento,
 * limite de tentativas por IP na memória, limites por IP / e-mail / geral no banco (xadrez_rt.contato_gravar) e no
 * máximo 3 links na mensagem. O IP só vira HMAC com sal secreto. NUNCA registrar em log o conteúdo da mensagem.
 * Aviso por e-mail opcional: com SMTP_HOST e SMTP_FROM no ambiente (SMTP_PORT, SMTP_USER, SMTP_PASS, SMTP_TO), manda
 * para SMTP_TO (padrão contato@xadrezonline.app) com Reply-To de quem escreveu. Sem SMTP, só grava.
 */
const crypto = require('node:crypto');

const ASSUNTOS = {
  duvida: { pt: 'Dúvida', en: 'Question' },
  sugestao: { pt: 'Sugestão', en: 'Suggestion' },
  problema: { pt: 'Problema no site', en: 'Site problem' },
  pagamento: { pt: 'Pagamento / estorno de torneio', en: 'Tournament payment / refund' },
  parceria: { pt: 'Parceria / imprensa', en: 'Partnership / press' },
  outro: { pt: 'Outro', en: 'Other' },
};
const COM_LINK = new Set(['problema', 'pagamento']);
const MIN_MS = 3000, MAX_MS = 24 * 3600_000;
const LIM = { nome: 100, email: 254, mensagem: 4000, mensagemMin: 10, link: 500, links: 3 };
const CORPO_MAX = 24 * 1024;
// tentativas (inclusive as recusadas) por IP na memória: barra rajada antes de tocar o banco
const TENTATIVAS = 20, JANELA_MS = 10 * 60_000;

const RE_EMAIL = /^[^\s@<>()[\]\\,;:"]{1,64}@(?=.{1,253}$)[A-Za-z0-9](?:[A-Za-z0-9-]{0,61}[A-Za-z0-9])?(?:\.[A-Za-z0-9](?:[A-Za-z0-9-]{0,61}[A-Za-z0-9])?)*\.[A-Za-z]{2,63}$/;
// controle, bidi (direção do texto) e similares saem de todo campo; quebra de linha só fica na mensagem
const RE_CONTROLE = /[\u0000-\u0008\u000B\u000C\u000E-\u001F\u007F​‪-‮⁦-⁩﻿]/g;

function limpar(v, { linhas = false } = {}) {
  if (typeof v !== 'string') return '';
  let s = v.normalize('NFC').replace(/\r\n?/g, '\n').replace(RE_CONTROLE, '');
  if (!linhas) s = s.replace(/[\n\t]+/g, ' ');
  return s.trim();
}

function ipDe(req) {
  // o Caddy é o único proxy e põe o IP real no FIM do X-Forwarded-For (o que o navegador mandar fica antes)
  const xff = String(req.headers['x-forwarded-for'] || '').split(',').map(s => s.trim()).filter(Boolean);
  const ip = xff.length ? xff[xff.length - 1] : (req.socket.remoteAddress || '');
  return ip.replace(/^::ffff:/, '');
}

function linkValido(s) {
  try {
    const u = new URL(s);
    return (u.protocol === 'https:' || u.protocol === 'http:') && (u.hostname === 'xadrezonline.app' || u.hostname.endsWith('.xadrezonline.app'));
  } catch { return false; }
}

// corpo acima do limite: descarta o excesso e responde 413 no fim (cortar a conexão no meio deixa o navegador sem
// resposta); acima de 1 MB corta mesmo
function corpoJson(req) {
  return new Promise((ok, falha) => {
    let n = 0; const partes = [];
    const erro = (msg, status) => { const e = new Error(msg); e.status = status; return e; };
    req.on('data', c => {
      n += c.length;
      if (n <= CORPO_MAX) partes.push(c);
      else if (n > 1024 * 1024) { falha(erro('grande', 413)); req.destroy(); }
    });
    req.on('end', () => {
      if (n > CORPO_MAX) return falha(erro('grande', 413));
      try { ok(JSON.parse(Buffer.concat(partes).toString('utf8') || '{}')); } catch { falha(erro('json', 400)); }
    });
    req.on('error', falha);
  });
}

const responder = (res, st, o) => {
  res.writeHead(st, { 'content-type': 'application/json', 'cache-control': 'private, no-store' });
  res.end(JSON.stringify(o));
};

module.exports = function criarContato({ pool, verificar, segredo, ambiente }) {
  // chaves derivadas do segredo do ambiente (nada novo para guardar): uma assina o horário, outra é o sal do IP
  const chaveTempo = crypto.createHmac('sha256', segredo).update('xadrez-contato-tempo-v1').digest();
  const salIp = crypto.createHmac('sha256', segredo).update('xadrez-contato-ip-v1').digest();
  const assinar = ts => crypto.createHmac('sha256', chaveTempo).update(String(ts)).digest('base64url').slice(0, 32);
  const novoToken = () => { const ts = Date.now(); return ts + '.' + assinar(ts); };
  const hashIp = ip => crypto.createHmac('sha256', salIp).update(ip).digest('hex');

  /** idade do token em ms, ou null se não for nosso */
  function idade(token) {
    const m = /^(\d{13})\.([A-Za-z0-9_-]{32})$/.exec(String(token || ''));
    if (!m) return null;
    const esperado = Buffer.from(assinar(m[1])), veio = Buffer.from(m[2]);
    if (esperado.length !== veio.length || !crypto.timingSafeEqual(esperado, veio)) return null;
    return Date.now() - Number(m[1]);
  }

  const tentativas = new Map();
  function dentroDoRitmo(chave) {
    const agora = Date.now();
    const l = (tentativas.get(chave) || []).filter(t => agora - t < JANELA_MS);
    if (l.length >= TENTATIVAS) { tentativas.set(chave, l); return false; }
    l.push(agora); tentativas.set(chave, l);
    if (tentativas.size > 5000) tentativas.delete(tentativas.keys().next().value);
    return true;
  }

  // ---------- aviso por e-mail (opcional)
  let transporte = null;
  function smtp() {
    if (!process.env.SMTP_HOST || !process.env.SMTP_FROM) return null;
    if (!transporte) {
      const nodemailer = require('nodemailer');   // só carrega se houver SMTP
      const porta = Number(process.env.SMTP_PORT || 587);
      transporte = nodemailer.createTransport({
        host: process.env.SMTP_HOST, port: porta, secure: porta === 465, requireTLS: porta !== 465,
        auth: process.env.SMTP_USER ? { user: process.env.SMTP_USER, pass: process.env.SMTP_PASS || '' } : undefined,
        connectionTimeout: 10_000, greetingTimeout: 10_000, socketTimeout: 20_000,
      });
    }
    return transporte;
  }
  async function avisar(id, c) {
    let t;
    try { t = smtp(); } catch (e) { console.error('[contato] SMTP indisponível:', e.message); return; }
    if (!t) return;
    const assunto = ASSUNTOS[c.assunto].pt;
    const quando = new Date().toLocaleString('pt-BR', { timeZone: 'America/Sao_Paulo', dateStyle: 'short', timeStyle: 'short' });
    const site = process.env.PUBLIC_URL || 'https://xadrezonline.app';
    const texto = [
      `Nova mensagem pelo formulário de contato (${site}/contato).`, '',
      `Nome: ${c.nome}`, `E-mail: ${c.email}`, `Assunto: ${assunto}`,
      ...(c.link ? [`Link: ${c.link}`] : []),
      `Idioma da página: ${c.idioma === 'en' ? 'inglês' : 'português'}`,
      `Conta: ${c.userId ? c.userId + ' (estava logado)' : 'visitante (sem login)'}`,
      `Recebida em: ${quando} (Brasília)`, `Id: ${id}`, '',
      'Mensagem:', '----------------------------------------', c.mensagem, '----------------------------------------', '',
      `Para responder, responda este e-mail (o Reply-To é o de quem escreveu). Painel: ${site}/admin`,
    ].join('\n');
    try {
      await t.sendMail({
        from: process.env.SMTP_FROM,
        to: process.env.SMTP_TO || 'contato@xadrezonline.app',
        replyTo: { name: c.nome, address: c.email },
        subject: `[Contato${ambiente === 'teste' ? ' TESTE' : ''}] ${assunto} — ${c.nome}`,
        text: texto,
      });
      console.log('[contato] aviso enviado', id);
    } catch (e) {
      console.error('[contato] aviso por e-mail falhou', id, e.code || '', String(e.message || '').slice(0, 200));
    }
  }

  async function enviar(req, res) {
    const ip = ipDe(req);
    if (!dentroDoRitmo(ip)) return responder(res, 429, { ok: false, erro: 'limite' });
    let corpo;
    try { corpo = await corpoJson(req); } catch (e) { return responder(res, e.status || 400, { ok: false, erro: e.status === 413 ? 'grande' : 'formato' }); }
    if (!corpo || typeof corpo !== 'object' || Array.isArray(corpo)) return responder(res, 400, { ok: false, erro: 'formato' });

    // honeypot: robô preencheu o campo invisível → "ok" igual ao verdadeiro, nada gravado, nada avisado
    if (typeof corpo.site_web === 'string' && corpo.site_web.trim()) {
      console.log('[contato] descartado (honeypot)');
      return responder(res, 200, { ok: true });
    }
    const t = idade(corpo.token);
    if (t === null || t > MAX_MS || t < -5000) return responder(res, 422, { ok: false, erro: 'token', token: novoToken() });
    if (t < MIN_MS) return responder(res, 422, { ok: false, erro: 'rapido' });

    const idioma = corpo.idioma === 'en' ? 'en' : 'pt';
    const nomeBruto = typeof corpo.nome === 'string' ? corpo.nome : '';
    const nome = limpar(nomeBruto);
    const email = limpar(corpo.email);
    const assunto = typeof corpo.assunto === 'string' ? corpo.assunto : '';
    const mensagem = limpar(corpo.mensagem, { linhas: true });
    const linkBruto = COM_LINK.has(assunto) ? limpar(corpo.link) : '';
    const erro = (erro, campo) => responder(res, 400, { ok: false, erro, campo });
    if (!nome) return erro('nome', 'nome');
    if (nome.length > LIM.nome) return erro('nome_longo', 'nome');
    if (!email) return erro('email', 'email');
    if (email.length > LIM.email || !RE_EMAIL.test(email)) return erro('email_invalido', 'email');
    if (!Object.hasOwn(ASSUNTOS, assunto)) return erro('assunto', 'assunto');
    if (mensagem.length < LIM.mensagemMin) return erro('mensagem_curta', 'mensagem');
    if (mensagem.length > LIM.mensagem) return erro('mensagem_longa', 'mensagem');
    if (((mensagem.match(/https?:\/\/|www\./gi) || []).length) > LIM.links) return erro('links', 'mensagem');
    if (linkBruto && (linkBruto.length > LIM.link || !linkValido(linkBruto))) return erro('link', 'link');

    // logado: o token da sessão (opcional) liga a mensagem à conta; token inválido ou vencido = visitante
    const claims = verificar((req.headers.authorization || '').replace(/^Bearer\s+/i, ''));
    const userId = claims && claims.role === 'authenticated' && /^[0-9a-f-]{36}$/i.test(String(claims.sub || '')) ? claims.sub : null;

    const r = await pool.query('select xadrez_rt.contato_gravar($1, $2, $3, $4, $5, $6, $7, $8) j',
      [nome, email, assunto, mensagem, linkBruto || null, userId, ip ? hashIp(ip) : null, idioma]);
    const j = r.rows[0].j;
    if (j.erro) {
      console.log('[contato] limite', j.erro);
      return responder(res, 429, { ok: false, erro: 'limite', motivo: j.erro });
    }
    console.log('[contato] recebida', j.id, assunto, idioma, userId ? 'logado' : 'visitante');
    responder(res, 200, { ok: true });
    avisar(j.id, { nome, email, assunto, mensagem, link: linkBruto, idioma, userId });
  }

  async function rota(req, res) {
    if (req.url.split('?')[0] !== '/functions/v1/contato') return false;
    try {
      if (req.method === 'GET') responder(res, 200, { token: novoToken() });
      else if (req.method === 'POST') await enviar(req, res);
      else responder(res, 405, { ok: false, erro: 'metodo' });
    } catch (e) {
      console.error('[contato] falha:', e.message);   // e.message vem do banco/rede, nunca do texto da mensagem
      if (!res.headersSent) responder(res, 500, { ok: false, erro: 'falha' });
    }
    return true;
  }
  return { rota, aviso: () => (process.env.SMTP_HOST && process.env.SMTP_FROM ? 'smtp ' + process.env.SMTP_HOST : 'desligado') };
};
module.exports.ASSUNTOS = ASSUNTOS;
