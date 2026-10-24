'use strict';
/**
 * Tempo real do xadrez (substitui o Supabase Realtime no que o jogo usa):
 *  - "postgres_changes": INSERT em public.moves e UPDATE em public.games. Um gatilho no banco faz pg_notify('xadrez_rt')
 *    com a tabela e o id; aqui a linha é lida COMO o jogador (papel do token + request.jwt.claims), então as mesmas
 *    regras de acesso (RLS) do PostgREST valem para o que chega pelo websocket.
 *  - "broadcast": mensagem de um jogador para os outros do mesmo canal (revanche, reações), sem eco para quem enviou.
 * Protocolo (JSON por mensagem), cliente → servidor:
 *   {t:'join', ref, topic, pg:[{event, table, filter}]}  {t:'leave', topic}  {t:'bc', ref, topic, event, payload}
 *   {t:'token', token}
 * servidor → cliente: {t:'ok', ref} {t:'erro', ref, msg} {t:'pg', topic, table, event, new} {t:'bc', topic, event, payload}
 * O token (JWT HS256 do GoTrue, ou a chave anon) vai na URL (?token=) e pode ser trocado com {t:'token'}.
 */
const http = require('node:http');
const crypto = require('node:crypto');
const { WebSocketServer } = require('ws');
const { Client, Pool } = require('pg');

const PORTA = Number(process.env.PORT || 3202);
const SEGREDO = process.env.JWT_SECRET;
const DB = { host: '127.0.0.1', port: 5432, database: process.env.PG_DB || 'xadrez', user: 'xadrez_rt', password: process.env.PG_RT };
if (!SEGREDO || !DB.password) { console.error('JWT_SECRET/PG_RT ausentes'); process.exit(2); }

const MAX_CONEXOES = 400, MAX_CANAIS = 10, MAX_MSG = 16 * 1024, MAX_MSGS_POR_10S = 60;
const TABELAS = { moves: 'INSERT', games: 'UPDATE' };   // o que o gatilho avisa

/** JWT HS256: devolve as claims ou null (assinatura, alg e validade). */
function verificar(token) {
  if (typeof token !== 'string') return null;
  const p = token.split('.');
  if (p.length !== 3) return null;
  try {
    const cab = JSON.parse(Buffer.from(p[0], 'base64url'));
    if (cab.alg !== 'HS256') return null;
    const esperado = crypto.createHmac('sha256', SEGREDO).update(p[0] + '.' + p[1]).digest();
    const assinatura = Buffer.from(p[2], 'base64url');
    if (assinatura.length !== esperado.length || !crypto.timingSafeEqual(assinatura, esperado)) return null;
    const c = JSON.parse(Buffer.from(p[1], 'base64url'));
    if (c.exp && c.exp * 1000 < Date.now()) return null;
    if (!['anon', 'authenticated'].includes(c.role)) return null;
    return c;
  } catch { return null; }
}

/** filtro do Supabase "coluna=eq.valor" → {col, val}; só o que o jogo usa. */
function filtro(f) {
  const m = /^([a-z_]+)=eq\.(.+)$/.exec(f || '');
  return m ? { col: m[1], val: m[2] } : null;
}

const pool = new Pool({ ...DB, max: 3, idleTimeoutMillis: 30000 });
/** a linha como o jogador a vê (RLS), ou null */
async function linhaComo(claims, tabela, id) {
  const c = await pool.connect();
  try {
    await c.query('begin');
    await c.query(`set local role ${claims.role === 'authenticated' ? 'authenticated' : 'anon'}`);
    await c.query(`select set_config('request.jwt.claims', $1, true)`, [JSON.stringify(claims)]);
    const r = await c.query(`select row_to_json(t) j from public.${tabela} t where t.id = $1`, [id]);
    await c.query('commit');
    return r.rows[0]?.j ?? null;
  } catch (e) {
    await c.query('rollback').catch(() => {});
    console.error('[linhaComo]', tabela, e.message);
    return null;
  } finally { c.release(); }
}

const canais = new Map();   // topic → Set(ws)

// jogadores de cada partida (cache curto) — para autorizar broadcast no canal "game-<id>"
const jogadoresCache = new Map();
async function jogadorDoCanal(ws, topic) {
  const mt = /^game-([A-Za-z0-9]{4,16})$/.exec(topic);
  if (!mt || ws.claims.role !== 'authenticated' || !ws.claims.sub) return null;
  let c = jogadoresCache.get(mt[1]);
  if (!c || Date.now() - c.em > 30_000) {
    const r = await pool.query('select * from xadrez_rt.jogadores_do_jogo($1)', [mt[1]]);
    c = { em: Date.now(), j: r.rows[0] || null };
    jogadoresCache.set(mt[1], c);
    if (jogadoresCache.size > 2000) jogadoresCache.delete(jogadoresCache.keys().next().value);
  }
  if (!c.j) return null;
  if (c.j.white === ws.claims.sub) return { nome: c.j.white_name };
  if (c.j.black === ws.claims.sub) return { nome: c.j.black_name };
  return null;
}
const enviar = (ws, m) => { if (ws.readyState === 1) ws.send(JSON.stringify(m)); };

async function aoNotificar(msg) {
  if (msg.channel === 'xadrez_conferir') { enfileirar(msg.payload); return; }
  let n;
  try { n = JSON.parse(msg.payload); } catch { return; }
  if (n.t === 'moves' && n.g) juizTorneio(n.g);       // D-TRN-01: o servidor acompanha o jogo de torneio lance a lance
  const evento = TABELAS[n.t];
  if (!evento || n.op !== evento) return;
  const cache = new Map();   // claims (papel+sub) → linha
  for (const [topic, socks] of canais) {
    for (const ws of socks) {
      const subs = ws.canais.get(topic)?.pg ?? [];
      for (const s of subs) {
        if (s.table !== n.t || (s.event !== '*' && s.event !== evento)) continue;
        const f = filtro(s.filter);
        if (s.filter && !f) continue;
        const valorDaNotificacao = f ? (f.col === 'id' ? n.id : f.col === 'game_id' ? n.g : undefined) : null;
        if (f && String(valorDaNotificacao) !== f.val) continue;
        const chave = `${ws.claims.role}:${ws.claims.sub ?? ''}`;
        if (!cache.has(chave)) cache.set(chave, linhaComo(ws.claims, n.t, n.id));
        const linha = await cache.get(chave);
        if (linha) enviar(ws, { t: 'pg', topic, table: n.t, event: evento, new: linha });
      }
    }
  }
}

async function escutar() {
  const c = new Client(DB);
  c.on('notification', m => { aoNotificar(m).catch(e => console.error('[notify]', e.message)); });
  let refeito = false;
  const refazer = motivo => { if (refeito) return; refeito = true; console.error('[listen] reconectando:', motivo); c.end().catch(() => {}); setTimeout(escutar, 3000); };
  c.on('error', e => refazer(e.message));
  c.on('end', () => refazer('conexão encerrada'));
  try { await c.connect(); await c.query('listen xadrez_rt'); await c.query('listen xadrez_conferir'); console.log('escutando xadrez_rt e xadrez_conferir'); }
  catch (e) { refazer(e.message); }
}

// ---------- /functions/v1/ga-stats: o painel do /admin (porte da Edge Function do Supabase, mesma resposta).
// Só admin (linha em public.admin_users, lida como o próprio usuário). Conta de serviço do GA em GA_SA_FILE (JSON),
// propriedade em GA_PROPERTY_ID. Token do Google reaproveitado por ~55 min; relatório guardado por 5 min.
const GA = { sa: null, token: null, tokenAte: 0, cache: null, cacheAte: 0 };
function gaConta() {
  if (GA.sa === null) {
    try { GA.sa = JSON.parse(require('node:fs').readFileSync(process.env.GA_SA_FILE || '', 'utf8')); } catch { GA.sa = false; }
  }
  return GA.sa || null;
}
async function gaToken(sa) {
  if (GA.token && Date.now() < GA.tokenAte) return GA.token;
  const b = o => Buffer.from(JSON.stringify(o)).toString('base64url');
  const agora = Math.floor(Date.now() / 1000);
  const corpo = b({ alg: 'RS256', typ: 'JWT' }) + '.' + b({ iss: sa.client_email, scope: 'https://www.googleapis.com/auth/analytics.readonly',
    aud: 'https://oauth2.googleapis.com/token', iat: agora, exp: agora + 3600 });
  const jwt = corpo + '.' + crypto.sign('RSA-SHA256', Buffer.from(corpo), sa.private_key).toString('base64url');
  const r = await fetch('https://oauth2.googleapis.com/token', { method: 'POST', headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
    body: 'grant_type=urn:ietf:params:oauth:grant-type:jwt-bearer&assertion=' + jwt });
  const j = await r.json();
  if (!j.access_token) throw new Error('GA token exchange failed: ' + (j.error_description || j.error || r.status));
  GA.token = j.access_token; GA.tokenAte = Date.now() + 55 * 60_000;
  return GA.token;
}
const RELATORIOS = {
  totals: { metrics: ['activeUsers', 'newUsers', 'sessions', 'screenPageViews', 'averageSessionDuration'].map(name => ({ name })),
    dateRanges: [{ startDate: '28daysAgo', endDate: 'today' }], limit: 1 },
  daily: { dimensions: [{ name: 'date' }], metrics: [{ name: 'activeUsers' }, { name: 'sessions' }],
    dateRanges: [{ startDate: '13daysAgo', endDate: 'today' }], orderBys: [{ dimension: { dimensionName: 'date' } }], limit: 14 },
  pages: { dimensions: [{ name: 'pagePath' }], metrics: [{ name: 'screenPageViews' }, { name: 'activeUsers' }],
    dateRanges: [{ startDate: '7daysAgo', endDate: 'today' }], orderBys: [{ metric: { metricName: 'screenPageViews' }, desc: true }], limit: 10 },
  events: { dimensions: [{ name: 'eventName' }], metrics: [{ name: 'eventCount' }],
    dateRanges: [{ startDate: '7daysAgo', endDate: 'today' }], orderBys: [{ metric: { metricName: 'eventCount' }, desc: true }], limit: 15 },
  sources: { dimensions: [{ name: 'sessionSource' }], metrics: [{ name: 'sessions' }, { name: 'activeUsers' }],
    dateRanges: [{ startDate: '7daysAgo', endDate: 'today' }], orderBys: [{ metric: { metricName: 'sessions' }, desc: true }], limit: 10 },
  devices: { dimensions: [{ name: 'deviceCategory' }], metrics: [{ name: 'activeUsers' }, { name: 'sessions' }],
    dateRanges: [{ startDate: '28daysAgo', endDate: 'today' }] },
  countries: { dimensions: [{ name: 'country' }], metrics: [{ name: 'activeUsers' }],
    dateRanges: [{ startDate: '28daysAgo', endDate: 'today' }], orderBys: [{ metric: { metricName: 'activeUsers' }, desc: true }], limit: 10 },
};
function linhasGa(rel) {
  const d = (rel.dimensionHeaders || []).map(h => h.name), m = (rel.metricHeaders || []).map(h => h.name);
  return (rel.rows || []).map(r => {
    const o = {};
    (r.dimensionValues || []).forEach((v, i) => { o[d[i]] = v.value; });
    (r.metricValues || []).forEach((v, i) => { o[m[i]] = v.value; });
    return o;
  });
}
async function ehAdmin(claims) {
  if (claims.role !== 'authenticated' || !claims.sub) return false;
  const c = await pool.connect();
  try {
    await c.query('begin');
    await c.query('set local role authenticated');
    await c.query(`select set_config('request.jwt.claims', $1, true)`, [JSON.stringify(claims)]);
    const r = await c.query('select 1 from public.admin_users where user_id = auth.uid()');
    await c.query('commit');
    return r.rowCount > 0;
  } catch (e) { await c.query('rollback').catch(() => {}); console.error('[ga-stats admin]', e.message); return false; }
  finally { c.release(); }
}
async function gaStats(req, res) {
  const json = (st, o) => { res.writeHead(st, { 'content-type': 'application/json', 'cache-control': 'private, no-store' }); res.end(JSON.stringify(o)); };
  const claims = verificar((req.headers.authorization || '').replace(/^Bearer\s+/i, ''));
  if (!claims) return json(401, { error: 'invalid auth' });
  if (!(await ehAdmin(claims))) return json(403, { error: 'forbidden: not admin' });
  const sa = gaConta(), prop = process.env.GA_PROPERTY_ID;
  if (!sa || !prop) return json(500, { error: 'GA credentials not configured', hint: 'GA_SA_FILE e GA_PROPERTY_ID no servidor (/opt/xadrez/etc).' });
  if (GA.cache && Date.now() < GA.cacheAte) return json(200, GA.cache);
  try {
    const token = await gaToken(sa);
    const nomes = Object.keys(RELATORIOS);
    const rels = await Promise.all(nomes.map(async n => {
      const r = await fetch(`https://analyticsdata.googleapis.com/v1beta/properties/${prop}:runReport`, {
        method: 'POST', headers: { Authorization: 'Bearer ' + token, 'Content-Type': 'application/json' }, body: JSON.stringify(RELATORIOS[n]) });
      if (!r.ok) throw new Error('GA report failed: ' + (await r.text()).slice(0, 300));
      return r.json();
    }));
    const out = {};
    nomes.forEach((n, i) => { out[n] = linhasGa(rels[i]); });
    out.totals = out.totals[0] || {};
    out.fetched_at = new Date().toISOString();
    GA.cache = out; GA.cacheAte = Date.now() + 5 * 60_000;
    return json(200, out);
  } catch (e) { console.error('[ga-stats]', e.message); return json(500, { error: e.message }); }
}

let pix = null;   // criado depois do pool e do verificar (abaixo)

// ---------- /t/<código>: link curto de compartilhamento com a prévia (Open Graph) que WhatsApp/Facebook/X leem — essas
// redes não rodam o JavaScript da página. Quem abre é levado na hora para a página do torneio.
const escHtml = s => String(s ?? '').replace(/[&<>"']/g, c => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c]));
const dataBr = d => d ? new Date(d).toLocaleDateString('pt-BR', { timeZone: 'America/Sao_Paulo', day: '2-digit', month: '2-digit' })
  + ' às ' + new Date(d).toLocaleTimeString('pt-BR', { timeZone: 'America/Sao_Paulo', hour: '2-digit', minute: '2-digit' }) : '';
async function compartilhar(req, res) {
  const codigo = req.url.split('?')[0].split('/')[2];
  const r = await pool.query('select xadrez_rt.torneio_para_compartilhar($1) j', [codigo]);
  const t = r.rows[0]?.j;
  const host = process.env.PUBLIC_URL || 'https://xadrezonline.app';   // nunca do cabeçalho Host (manipulável)
  const destino = !t ? host + '/torneios' : t.token ? `${host}/torneios?t=${encodeURIComponent(t.token)}` : `${host}/torneios?id=${t.id}`;
  let titulo = 'Torneios de xadrez online', desc = 'Crie ou entre num torneio de xadrez e jogue com a galera.';
  if (t) {
    const fmt = t.formato === 'ai' ? 'Ranking contra o computador' : 'Eliminatória entre jogadores';
    if (t.status === 'finished' && t.campeao) { titulo = `🏆 ${t.campeao} venceu o torneio ${t.nome}`; desc = `${fmt} · prêmio: ${t.premio}`; }
    else if (t.status === 'active') { titulo = `Torneio ${t.nome} — em andamento`; desc = `${fmt} · ${t.inscritos} jogadores · prêmio: ${t.premio}`; }
    else if (t.status === 'cancelled') { titulo = `Torneio ${t.nome} (cancelado)`; }
    else { titulo = `Inscrições abertas: ${t.nome}`; desc = `${fmt} · começa ${dataBr(t.inicio)} · ${t.inscritos}/${t.vagas} vagas · prêmio: ${t.premio}`; }
  }
  const html = `<!doctype html><html lang="pt-BR"><head><meta charset="utf-8"><title>${escHtml(titulo)}</title>
<meta name="viewport" content="width=device-width,initial-scale=1">
<meta property="og:type" content="website"><meta property="og:site_name" content="Xadrez Online">
<meta property="og:title" content="${escHtml(titulo)}"><meta property="og:description" content="${escHtml(desc)}">
<meta property="og:url" content="${escHtml(host + req.url.split('?')[0])}"><meta property="og:image" content="${host}/icon-512.png">
<meta property="og:image:width" content="512"><meta property="og:image:height" content="512">
<meta name="twitter:card" content="summary"><meta name="description" content="${escHtml(desc)}">
<meta name="robots" content="noindex"><link rel="canonical" href="${escHtml(destino)}">
<meta http-equiv="refresh" content="0;url=${escHtml(destino)}"></head>
<body><p><a href="${escHtml(destino)}">${escHtml(titulo)}</a></p><script>location.replace(${JSON.stringify(destino)})</script></body></html>`;
  res.writeHead(200, { 'content-type': 'text/html; charset=utf-8', 'cache-control': 'public, max-age=300' });
  res.end(html);
}
const servidor = http.createServer(async (req, res) => {
  if (pix && await pix.rota(req, res)) return;
  if (req.method === 'GET' && /^\/t\/[A-Za-z0-9-]{12,40}\/?$/.test(req.url.split('?')[0])) { compartilhar(req, res).catch(() => { res.writeHead(500); res.end(); }); return; }
  if (req.url === '/xrt/saude') { res.writeHead(200, { 'content-type': 'application/json' }); res.end(JSON.stringify({ ok: true, conexoes: wss.clients.size })); return; }
  if (req.url.split('?')[0] === '/functions/v1/ga-stats' && req.method === 'POST') { gaStats(req, res).catch(() => { res.writeHead(500); res.end(); }); return; }
  res.writeHead(404); res.end();
});
const wss = new WebSocketServer({ noServer: true, maxPayload: MAX_MSG });

servidor.on('upgrade', (req, socket, head) => {
  const u = new URL(req.url, 'http://x');
  if (u.pathname !== '/xrt' || wss.clients.size >= MAX_CONEXOES) { socket.destroy(); return; }
  const claims = verificar(u.searchParams.get('token'));
  if (!claims) { socket.write('HTTP/1.1 401 Unauthorized\r\n\r\n'); socket.destroy(); return; }
  wss.handleUpgrade(req, socket, head, ws => { ws.claims = claims; wss.emit('connection', ws); });
});

wss.on('connection', ws => {
  ws.canais = new Map();
  ws.vivo = true;
  ws.janela = { inicio: Date.now(), n: 0 };
  ws.on('pong', () => { ws.vivo = true; });
  ws.on('message', bruto => {
    const agora = Date.now();
    if (agora - ws.janela.inicio > 10000) ws.janela = { inicio: agora, n: 0 };
    if (++ws.janela.n > MAX_MSGS_POR_10S) { ws.close(1008, 'muitas mensagens'); return; }
    let m;
    try { m = JSON.parse(bruto); } catch { return; }
    const topic = typeof m.topic === 'string' ? m.topic.slice(0, 120) : null;
    if (m.t === 'token') {
      const c = verificar(m.token);
      if (c) ws.claims = c; else enviar(ws, { t: 'erro', ref: m.ref, msg: 'token inválido' });
    } else if (m.t === 'join' && topic) {
      if (!ws.canais.has(topic) && ws.canais.size >= MAX_CANAIS) { enviar(ws, { t: 'erro', ref: m.ref, msg: 'canais demais' }); return; }
      const pg = (Array.isArray(m.pg) ? m.pg : []).slice(0, 5)
        .filter(s => s && TABELAS[s.table] && (s.schema ?? 'public') === 'public')
        .map(s => ({ table: s.table, event: s.event ?? '*', filter: typeof s.filter === 'string' ? s.filter.slice(0, 200) : null }));
      ws.canais.set(topic, { pg });
      if (!canais.has(topic)) canais.set(topic, new Set());
      canais.get(topic).add(ws);
      enviar(ws, { t: 'ok', ref: m.ref });
    } else if (m.t === 'leave' && topic) {
      ws.canais.delete(topic);
      canais.get(topic)?.delete(ws);
      if (canais.get(topic)?.size === 0) canais.delete(topic);
    } else if (m.t === 'bc' && topic && ws.canais.has(topic) && typeof m.event === 'string') {
      // TRN-SEG-03: só quem JOGA a partida transmite no canal dela; remetente vem do token, não do navegador
      jogadorDoCanal(ws, topic).then(j => {
        if (!j) { enviar(ws, { t: 'erro', ref: m.ref, msg: 'só os jogadores da partida' }); return; }
        const p = (m.payload && typeof m.payload === 'object' && !Array.isArray(m.payload)) ? { ...m.payload } : {};
        p.sender_id = ws.claims.sub; p.sender_name = j.nome;
        if (m.event === 'rematch') p.initiator = ws.claims.sub;
        const corpo = JSON.stringify(p);
        if (corpo.length > 2000) { enviar(ws, { t: 'erro', ref: m.ref, msg: 'mensagem grande demais' }); return; }
        for (const outro of canais.get(topic) ?? []) if (outro !== ws) enviar(outro, { t: 'bc', topic, event: m.event.slice(0, 60), payload: p });
        enviar(ws, { t: 'ok', ref: m.ref });
      }).catch(() => enviar(ws, { t: 'erro', ref: m.ref, msg: 'falha' }));
    }
  });
  ws.on('close', () => {
    for (const topic of ws.canais.keys()) {
      canais.get(topic)?.delete(ws);
      if (canais.get(topic)?.size === 0) canais.delete(topic);
    }
  });
});

// conexão morta sai em até 60 s (o Caddy e as redes móveis derrubam socket parado)
setInterval(() => {
  for (const ws of wss.clients) {
    if (!ws.vivo) { ws.terminate(); continue; }
    ws.vivo = false;
    ws.ping();
  }
}, 30000).unref();

// ---------- torneios: juiz das partidas, conferência das vitórias contra a IA e rotina (D-TRN-01/02/04/12)
const path = require('node:path');
const { Worker } = require('node:worker_threads');
const X = require('./motor/xadrez');

// juiz: reproduz o jogo de torneio com o motor do site; lance ilegal perde; mate/afogamento/50 lances/material encerram
const juizPendente = new Map();
function juizTorneio(gameId) {
  clearTimeout(juizPendente.get(gameId));
  juizPendente.set(gameId, setTimeout(() => { juizPendente.delete(gameId); julgar(gameId).catch(e => console.error('[juiz]', gameId, e.message)); }, 250));
}
async function encerrarJogo(g, resultado, motivo) {
  await pool.query('select xadrez_rt.encerrar_jogo($1, $2, $3)', [g, resultado, motivo]);
  console.log('[juiz]', g, resultado, motivo);
}
async function julgar(gameId) {
  const r = await pool.query('select xadrez_rt.jogo_torneio($1) j', [gameId]);
  const d = r.rows[0]?.j;
  if (!d || d.game.status !== 'active') return;
  // TRN-REG-04: a partida acaba no PRIMEIRO fim (mate, afogamento, 50 lances, material); lance enviado depois não conta
  let e = X.inicial();
  let f = null;
  for (const l of d.lances) {
    f = X.fim(e);
    if (f) break;
    const prox = X.jogar(e, { from: l.from_sq, to: l.to_sq, promo: l.promotion || undefined });
    if (!prox) return encerrarJogo(gameId, l.player_color === 'w' ? 'black_wins' : 'white_wins', 'lance_ilegal');
    e = prox;
  }
  if (!f) f = X.fim(e);
  if (!f) return;
  if (f.tipo === 'mate') return encerrarJogo(gameId, f.vencedor === 'w' ? 'white_wins' : 'black_wins', 'xeque_mate');
  return encerrarJogo(gameId, 'draw', f.tipo);
}

// conferência das vitórias contra a IA em DUAS filas (threads separadas): Fácil/Médio nunca esperam atrás de uma Expert
// (TRN-UX-04: um Fácil de 37 ms esperou 9 min). Falha ou estouro de tempo: uma nova tentativa; na 2ª, rejeita com motivo.
const filas = { leve: { ids: new Set(), ocupada: false, w: null }, pesada: { ids: new Set(), ocupada: false, w: null } };
const tentativas = new Map();
function threadDe(f) {
  if (!f.w) {
    f.w = new Worker(path.join(__dirname, 'conferidor.js'));
    f.w.on('error', e => { console.error('[conferidor] thread caiu:', e.message); f.w = null; });
    f.w.on('exit', () => { f.w = null; });
  }
  return f.w;
}
async function enfileirar(id) {
  if (!/^[0-9a-f-]{36}$/.test(String(id))) return;
  if (filas.leve.ids.has(id) || filas.pesada.ids.has(id)) return;
  const r = await pool.query("select (j->'score'->>'difficulty')::int dif from (select xadrez_rt.placar_para_conferir($1) j) x", [id]).catch(() => ({ rows: [] }));
  const dif = r.rows[0]?.dif;
  if (!dif) return;
  const f = dif >= 3 ? filas.pesada : filas.leve;
  f.ids.add(String(id));
  proximoPlacar(f);
}
async function proximoPlacar(f) {
  if (f.ocupada || !f.ids.size) return;
  const id = f.ids.values().next().value;
  f.ids.delete(id);
  f.ocupada = true;
  try {
    const r = await pool.query('select xadrez_rt.placar_para_conferir($1) j', [id]);
    const d = r.rows[0]?.j;
    if (d) {
      const w = threadDe(f);
      let v;
      try {
        v = await new Promise((ok, falha) => {
          const t = setTimeout(() => { w.terminate(); falha(new Error('conferência passou de 15 min')); }, 15 * 60_000);
          w.once('message', m => { clearTimeout(t); ok(m); });
          w.postMessage({ id, lances: d.lances, dificuldade: d.score.difficulty });
        });
      } catch (e) {
        const n = (tentativas.get(id) || 0) + 1;
        tentativas.set(id, n);
        console.error('[conferidor]', id, e.message, 'tentativa', n);
        v = n >= 2 ? { ok: false, motivo: 'nao_foi_possivel_conferir', segundos: null, aoVivo: false, ms: 0 } : null;
      }
      if (v) {
        await pool.query('select xadrez_rt.veredito_placar($1, $2, $3, $4, $5)', [id, v.ok, v.motivo, v.segundos, v.aoVivo]);
        tentativas.delete(id);
        console.log(`[conferidor] ${id} ${v.ok ? 'ok' : 'rejeitado (' + v.motivo + ')'} ${v.ms} ms${v.aoVivo ? '' : ' (não ao vivo)'}`);
      }
    }
  } catch (e) { console.error('[conferidor]', id, e.message); }
  f.ocupada = false;
  setImmediate(() => proximoPlacar(f));
}

// rotina a cada minuto: W.O., tempo, início de chave, encerramento de ranking, Pix vencido + reconferências
async function rotina() {
  try {
    const r = await pool.query('select xadrez_rt.tick() j');
    if (Object.values(r.rows[0].j).some(v => v > 0)) console.log('[rotina]', JSON.stringify(r.rows[0].j));
    for (const x of (await pool.query('select xadrez_rt.placares_pendentes() id')).rows) enfileirar(x.id);
    for (const x of (await pool.query('select xadrez_rt.jogos_torneio_ativos() id')).rows) juizTorneio(x.id);
  } catch (e) { console.error('[rotina]', e.message); }
}
setInterval(rotina, 60_000).unref();
setTimeout(rotina, 5_000).unref();

pix = require('./pix')({ pool, verificar });
console.log('Pix:', pix.modo);
setInterval(() => pix.rotina().catch(e => console.error('[pix] rotina', e.message)), 60_000).unref();

escutar();
servidor.listen(PORTA, '127.0.0.1', () => console.log(`tempo real do xadrez em 127.0.0.1:${PORTA}`));
