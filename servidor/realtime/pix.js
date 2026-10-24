'use strict';
/**
 * Pix automático pelo Mercado Pago (D-PAG-01). Rotas (atrás do Caddy):
 *   POST /functions/v1/pix-cobranca   { tournament_id }   → cria ou reaproveita a cobrança (só o criador ou admin)
 *   POST /pagamentos/mp                                    → webhook do Mercado Pago (assinatura x-signature conferida)
 *   POST /functions/v1/pix-simular    { tournament_id }   → SÓ no ambiente de teste sem credencial: simula o pagamento
 * O webhook nunca é tomado como verdade: o servidor consulta GET /v1/payments/{id} e só libera com status `approved` e o
 * valor exato (xadrez_rt.pix_confirmar). A rotina reconsulta as cobranças pendentes (webhook perdido) e pede o estorno
 * de torneio pago cancelado antes de começar.
 * Ambiente: MP_ACCESS_TOKEN, MP_WEBHOOK_SECRET, PUBLIC_URL, AMBIENTE ('teste' | 'oficial').
 */
const crypto = require('node:crypto');

const MP = 'https://api.mercadopago.com';
const TOKEN = process.env.MP_ACCESS_TOKEN || '';
const SEGREDO_WEBHOOK = process.env.MP_WEBHOOK_SECRET || '';
const PUBLICO = process.env.PUBLIC_URL || '';
const SIMULADO = !TOKEN && process.env.AMBIENTE === 'teste';

function corpoJson(req, limite = 8 * 1024) {
  return new Promise((ok, falha) => {
    let n = 0; const partes = [];
    req.on('data', c => { n += c.length; if (n > limite) { falha(new Error('corpo grande demais')); req.destroy(); } else partes.push(c); });
    req.on('end', () => { try { ok(partes.length ? JSON.parse(Buffer.concat(partes).toString('utf8')) : {}); } catch { falha(new Error('JSON inválido')); } });
    req.on('error', falha);
  });
}
const responder = (res, st, o) => { res.writeHead(st, { 'content-type': 'application/json', 'cache-control': 'private, no-store' }); res.end(JSON.stringify(o)); };

async function mp(metodo, caminho, corpo, idem) {
  const r = await fetch(MP + caminho, {
    method: metodo,
    headers: { Authorization: 'Bearer ' + TOKEN, 'Content-Type': 'application/json', ...(idem ? { 'X-Idempotency-Key': idem } : {}) },
    body: corpo ? JSON.stringify(corpo) : undefined,
    signal: AbortSignal.timeout(15000),
  });
  const j = await r.json().catch(() => ({}));
  if (!r.ok) throw new Error(`Mercado Pago ${r.status}: ${(j && (j.message || j.error)) || 'erro'}`);
  return j;
}

/** data no formato que o Mercado Pago aceita (com fuso de Brasília) */
function dataMp(d) {
  const b = new Date(d.getTime() - 3 * 3600_000).toISOString().replace('Z', '');
  return b.slice(0, 23) + '-03:00';
}

// limite simples por usuário (cria cobrança no máximo 6 vezes por 10 min)
const ritmo = new Map();
function dentroDoRitmo(chave) {
  const agora = Date.now(); const l = (ritmo.get(chave) || []).filter(t => agora - t < 600_000);
  if (l.length >= 6) return false;
  l.push(agora); ritmo.set(chave, l); return true;
}

/** x-signature: "ts=...,v1=..." ; manifesto "id:<data.id>;request-id:<x-request-id>;ts:<ts>;" com HMAC-SHA256 */
function assinaturaValida(req, dataId) {
  if (!SEGREDO_WEBHOOK) return false;
  const partes = Object.fromEntries(String(req.headers['x-signature'] || '').split(',').map(s => s.trim().split('=')));
  const reqId = String(req.headers['x-request-id'] || '');
  if (!partes.ts || !partes.v1 || !dataId) return false;
  const id = /^[a-z0-9]+$/i.test(dataId) ? dataId.toLowerCase() : dataId;
  const manifesto = `id:${id};request-id:${reqId};ts:${partes.ts};`;
  const esperado = crypto.createHmac('sha256', SEGREDO_WEBHOOK).update(manifesto).digest('hex');
  return esperado.length === partes.v1.length && crypto.timingSafeEqual(Buffer.from(esperado), Buffer.from(partes.v1));
}

module.exports = function criarPix({ pool, verificar }) {
  async function confirmarPeloProvedor(id) {
    const p = await mp('GET', '/v1/payments/' + encodeURIComponent(id));
    const r = await pool.query('select xadrez_rt.pix_confirmar($1, $2, $3, $4) r',
      [String(p.id), p.status, p.transaction_amount, JSON.stringify({ status: p.status, status_detail: p.status_detail, date_approved: p.date_approved, valor: p.transaction_amount })]);
    return r.rows[0].r;
  }

  async function cobranca(req, res) {
    const claims = verificar((req.headers.authorization || '').replace(/^Bearer\s+/i, ''));
    if (!claims || claims.role !== 'authenticated') return responder(res, 401, { error: 'login required' });
    let corpo; try { corpo = await corpoJson(req); } catch (e) { return responder(res, 400, { error: e.message }); }
    const tid = String(corpo.tournament_id || '');
    if (!/^[0-9a-f-]{36}$/.test(tid)) return responder(res, 400, { error: 'tournament_id inválido' });
    const prep = (await pool.query('select xadrez_rt.pix_preparar($1, $2) j', [tid, claims.sub])).rows[0].j;
    if (prep.erro) return responder(res, prep.erro === 'not_found' ? 404 : 409, { error: prep.erro });
    if (prep.pago) return responder(res, 200, { status: 'pago' });
    const e = prep.existente;
    if (e) return responder(res, 200, { status: 'pendente', valor: Number(e.valor), qr_code: e.qr_code, qr_code_base64: e.qr_code_base64, expira_em: e.expira_em, simulado: String(e.provedor_id).startsWith('sim-') });
    if (!dentroDoRitmo(claims.sub)) return responder(res, 429, { error: 'muitas tentativas; aguarde alguns minutos' });
    const valor = Number(prep.valor);
    const expira = new Date(Date.now() + Number(prep.validade_min || 30) * 60_000);
    let id, qr, qr64, bruto;
    if (SIMULADO) {
      id = 'sim-' + crypto.randomUUID();
      qr = '00020126SIMULADO-AMBIENTE-DE-TESTE-' + id.slice(4, 12);
      qr64 = null; bruto = { simulado: true };
    } else if (TOKEN) {
      const p = await mp('POST', '/v1/payments', {
        transaction_amount: valor, description: `Torneio de xadrez: ${String(prep.nome).slice(0, 60)}`, payment_method_id: 'pix',
        payer: { email: prep.email }, date_of_expiration: dataMp(expira), external_reference: tid,
        notification_url: PUBLICO ? PUBLICO + '/pagamentos/mp' : undefined,
      }, 'trn-' + tid + '-' + Math.floor(Date.now() / 600_000));
      const td = (p.point_of_interaction && p.point_of_interaction.transaction_data) || {};
      id = String(p.id); qr = td.qr_code; qr64 = td.qr_code_base64; bruto = { status: p.status, id: p.id };
    } else {
      return responder(res, 503, { error: 'Pix indisponível no momento' });
    }
    await pool.query('select xadrez_rt.pix_registrar($1, $2, $3, $4, $5, $6, $7)', [tid, id, valor, qr, qr64, expira.toISOString(), JSON.stringify(bruto)]);
    return responder(res, 200, { status: 'pendente', valor, qr_code: qr, qr_code_base64: qr64, expira_em: expira.toISOString(), simulado: SIMULADO });
  }

  async function webhook(req, res) {
    const u = new URL(req.url, 'http://x');
    let corpo = {}; try { corpo = await corpoJson(req, 32 * 1024); } catch { /* corpo é opcional: o id vem na URL */ }
    const dataId = u.searchParams.get('data.id') || (corpo.data && corpo.data.id && String(corpo.data.id)) || '';
    const tipo = u.searchParams.get('type') || corpo.type || '';
    if (!assinaturaValida(req, dataId)) { console.error('[pix] webhook com assinatura inválida', dataId); return responder(res, 401, { error: 'assinatura' }); }
    responder(res, 200, { ok: true });       // responde já; a conferência é no servidor do Mercado Pago
    if (tipo !== 'payment' || !/^\d+$/.test(dataId)) return;
    try { console.log('[pix] webhook', dataId, await confirmarPeloProvedor(dataId)); } catch (e) { console.error('[pix] webhook', dataId, e.message); }
  }

  async function simular(req, res) {
    if (!SIMULADO) return responder(res, 404, {});
    const claims = verificar((req.headers.authorization || '').replace(/^Bearer\s+/i, ''));
    if (!claims || claims.role !== 'authenticated') return responder(res, 401, { error: 'login required' });
    let corpo; try { corpo = await corpoJson(req); } catch (e) { return responder(res, 400, { error: e.message }); }
    const prep = (await pool.query('select xadrez_rt.pix_preparar($1, $2) j', [String(corpo.tournament_id || ''), claims.sub])).rows[0].j;
    if (!prep.existente) return responder(res, 409, { error: 'sem cobrança pendente' });
    const r = await pool.query('select xadrez_rt.pix_confirmar($1, $2, $3, $4) r', [prep.existente.provedor_id, 'approved', prep.existente.valor, '{"simulado":true}']);
    return responder(res, 200, { resultado: r.rows[0].r });
  }

  async function rotina() {
    if (!TOKEN && !SIMULADO) return;
    for (const x of (await pool.query('select xadrez_rt.pix_pendentes() id')).rows) {
      if (String(x.id).startsWith('sim-')) continue;
      try { const r = await confirmarPeloProvedor(x.id); if (r !== 'sem_mudanca') console.log('[pix] conferência', x.id, r); }
      catch (e) { console.error('[pix] conferência', x.id, e.message); }
    }
    for (const x of (await pool.query('select xadrez_rt.pix_para_estornar() id')).rows) {
      if (String(x.id).startsWith('sim-')) { await pool.query('select xadrez_rt.pix_estornado($1)', [x.id]); continue; }
      try { await mp('POST', `/v1/payments/${x.id}/refunds`, {}, 'estorno-' + x.id); await pool.query('select xadrez_rt.pix_estornado($1)', [x.id]); console.log('[pix] estorno', x.id); }
      catch (e) { console.error('[pix] estorno', x.id, e.message); }
    }
  }

  async function rota(req, res) {
    const p = req.url.split('?')[0];
    if (req.method !== 'POST') return false;
    try {
      if (p === '/functions/v1/pix-cobranca') { await cobranca(req, res); return true; }
      if (p === '/pagamentos/mp') { await webhook(req, res); return true; }
      if (p === '/functions/v1/pix-simular') { await simular(req, res); return true; }
    } catch (e) {
      console.error('[pix]', p, e.message);
      if (!res.headersSent) responder(res, 502, { error: 'falha ao falar com o Mercado Pago; tente de novo' });
      return true;
    }
    return false;
  }
  return { rota, rotina, modo: SIMULADO ? 'simulado' : TOKEN ? 'mercadopago' : 'desligado' };
};
module.exports.assinaturaValida = assinaturaValida;
module.exports.dataMp = dataMp;
