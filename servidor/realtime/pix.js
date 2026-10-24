'use strict';
/**
 * Pix automático pelo Mercado Pago, API de Orders (D-PAG-01/11 — a API de Payments está sendo descontinuada). Rotas:
 *   POST /functions/v1/pix-cobranca   { tournament_id }   → cria ou reaproveita a cobrança (só o criador ou admin)
 *   POST /pagamentos/mp                                    → webhook do Mercado Pago (assinatura x-signature conferida)
 *   POST /functions/v1/pix-simular    { tournament_id }   → SÓ no ambiente de teste sem credencial: simula o pagamento
 * O webhook nunca é tomado como verdade: o servidor consulta GET /v1/orders/{id} e só libera com o pedido `processed`
 * e o valor exato (xadrez_rt.pix_confirmar, que fala a língua antiga: approved/cancelled/expired/refunded/charged_back). A rotina reconsulta as cobranças pendentes (webhook perdido) e pede o estorno
 * de torneio pago cancelado antes de começar.
 * Ambiente: MP_ACCESS_TOKEN, MP_WEBHOOK_SECRET, PUBLIC_URL, AMBIENTE ('teste' | 'oficial').
 */
const crypto = require('node:crypto');

const MP = 'https://api.mercadopago.com';
const TOKEN = process.env.MP_ACCESS_TOKEN || '';
const SEGREDO_WEBHOOK = process.env.MP_WEBHOOK_SECRET || '';
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

async function mp(metodo, caminho, corpo, idem, extras) {
  const r = await fetch(MP + caminho, {
    method: metodo,
    headers: { Authorization: 'Bearer ' + TOKEN, 'Content-Type': 'application/json', ...(idem ? { 'X-Idempotency-Key': idem } : {}), ...(extras || {}) },
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

/** status do pedido (Orders) → o vocabulário de pix_confirmar. Pedido sem pagamento ainda (action_required, created,
 *  processing) → 'pending' (sem mudança). Valor pago: o do pagamento Pix do pedido. */
function situacaoDoPedido(o) {
  const pg = (o.transactions && o.transactions.payments && o.transactions.payments[0]) || {};
  const st = o.status, det = o.status_detail;
  let status = 'pending';
  if (st === 'processed') status = 'approved';                         // accredited ou partially_refunded
  else if (st === 'refunded') status = 'refunded';
  else if (st === 'charged_back') status = 'charged_back';
  else if (st === 'canceled') status = det === 'expired' ? 'expired' : 'cancelled';
  else if (st === 'failed') status = det === 'expired' ? 'expired' : 'rejected';
  const valor = Number(pg.paid_amount ?? pg.amount ?? o.total_paid_amount ?? o.total_amount);
  return { status, valor, pg };
}

module.exports = function criarPix({ pool, verificar }) {
  async function confirmarPeloProvedor(id) {
    const o = await mp('GET', '/v1/orders/' + encodeURIComponent(id));
    const { status, valor } = situacaoDoPedido(o);
    const r = await pool.query('select xadrez_rt.pix_confirmar($1, $2, $3, $4) r',
      [String(o.id), status, valor, JSON.stringify({ status: o.status, status_detail: o.status_detail, valor, ref: o.external_reference, atualizado: o.last_updated_date })]);
    return r.rows[0].r;
  }

  async function cobranca(req, res) {
    const claims = verificar((req.headers.authorization || '').replace(/^Bearer\s+/i, ''));
    if (!claims || claims.role !== 'authenticated') return responder(res, 401, { error: 'login required' });
    let corpo; try { corpo = await corpoJson(req); } catch (e) { return responder(res, 400, { error: e.message }); }
    const tid = String(corpo.tournament_id || '');
    if (!/^[0-9a-f-]{36}$/.test(tid)) return responder(res, 400, { error: 'tournament_id inválido' });
    const prep = (await pool.query('select xadrez_rt.pix_preparar($1, $2) j', [tid, claims.sub])).rows[0].j;
    if (prep.erro) return responder(res, prep.erro === 'not_found' ? 404 : 409, { error: prep.erro,
      mensagem: prep.erro === 'starts_too_soon' ? 'O torneio começa (ou termina) cedo demais para pagar e receber inscrições: ajuste a data.' : undefined });
    if (prep.pago) return responder(res, 200, { status: 'pago' });
    const e = prep.existente;
    if (e) return responder(res, 200, { status: 'pendente', valor: Number(e.valor), qr_code: e.qr_code, qr_code_base64: e.qr_code_base64, expira_em: e.expira_em, simulado: String(e.provedor_id).startsWith('sim-') });
    if (!dentroDoRitmo(claims.sub)) return responder(res, 429, { error: 'muitas tentativas; aguarde alguns minutos' });
    const valor = Number(prep.valor);
    const expira = new Date(Date.now() + Number(prep.validade_min || 30) * 60_000);
    let id, qr, qr64, bruto;
    // TRN-PIX-02: Pix anterior perto de vencer — cancela no Mercado Pago antes de gerar outro (se ainda assim for pago, o
    // segundo pagamento vira "a mais" e é estornado pela rotina)
    for (const ant of prep.anteriores || []) {
      if (String(ant).startsWith('sim-') || !TOKEN) continue;
      try { await mp('POST', '/v1/orders/' + encodeURIComponent(ant) + '/cancel', undefined, 'cancelar-' + ant); await confirmarPeloProvedor(ant); }
      catch (e) { console.error('[pix] cancelar anterior', ant, e.message); }
    }
    let expiraEm = expira;
    if (SIMULADO) {
      id = 'sim-' + crypto.randomUUID();
      qr = '00020126SIMULADO-AMBIENTE-DE-TESTE-' + id.slice(4, 12);
      qr64 = null; bruto = { simulado: true };
    } else if (TOKEN) {
      // o aviso vai para a URL configurada no painel do MP (Webhooks › Order); a validade é uma duração ISO 8601
      const minutos = Math.max(30, Number(prep.validade_min || 30));
      const o = await mp('POST', '/v1/orders', {
        type: 'online', processing_mode: 'automatic', external_reference: tid,
        total_amount: valor.toFixed(2), payer: { email: prep.email },
        transactions: { payments: [{ amount: valor.toFixed(2), payment_method: { id: 'pix', type: 'bank_transfer' }, expiration_time: `PT${minutos}M` }] },
      }, 'trn-' + tid + '-' + Math.floor(Date.now() / 600_000));
      const pm = (o.transactions && o.transactions.payments && o.transactions.payments[0] && o.transactions.payments[0].payment_method) || {};
      id = String(o.id); qr = pm.qr_code; qr64 = pm.qr_code_base64; bruto = { status: o.status, status_detail: o.status_detail, id: o.id };
      expiraEm = new Date(Date.now() + minutos * 60_000);
      const venc = o.transactions.payments[0].date_of_expiration || o.transactions.payments[0].expiration_date;
      if (venc && !Number.isNaN(Date.parse(venc))) expiraEm = new Date(venc);
    } else {
      return responder(res, 503, { error: 'Pix indisponível no momento' });
    }
    await pool.query('select xadrez_rt.pix_registrar($1, $2, $3, $4, $5, $6, $7)', [tid, id, valor, qr, qr64, expiraEm.toISOString(), JSON.stringify(bruto)]);
    return responder(res, 200, { status: 'pendente', valor, qr_code: qr, qr_code_base64: qr64, expira_em: expiraEm.toISOString(), simulado: SIMULADO });
  }

  // TRN-PIX-06: o Mercado Pago manda o formato novo (data.id + x-signature) e o antigo (topic/id, sem assinatura).
  // Nenhum conteúdo do aviso é tomado como verdade: a ÚNICA ação é reconsultar o pagamento na API do Mercado Pago, e só
  // se ele for nosso. Por isso o aviso sem assinatura também recebe 200 (senão o MP reenvia sem fim); a assinatura vale
  // como registro. Reconsulta limitada a 1 a cada 10 s por pagamento.
  const ultimaConsulta = new Map();
  async function webhook(req, res) {
    const u = new URL(req.url, 'http://x');
    let corpo = {}; try { corpo = await corpoJson(req, 32 * 1024); } catch { /* opcional */ }
    const dataId = u.searchParams.get('data.id') || u.searchParams.get('id') || (corpo.data && corpo.data.id && String(corpo.data.id)) || (corpo.resource && String(corpo.resource).split('/').pop()) || '';
    const tipo = u.searchParams.get('type') || u.searchParams.get('topic') || corpo.type || corpo.topic || '';
    const assinado = assinaturaValida(req, dataId);
    responder(res, 200, { ok: true });
    if (!/order|payment/.test(tipo) || !/^[A-Za-z0-9]{1,40}$/.test(dataId)) return;
    if (Date.now() - (ultimaConsulta.get(dataId) || 0) < 10_000) return;
    ultimaConsulta.set(dataId, Date.now());
    if (ultimaConsulta.size > 5000) ultimaConsulta.delete(ultimaConsulta.keys().next().value);
    const nosso = (await pool.query('select 1 from xadrez_rt.pagamentos where provedor_id = $1', [dataId]).catch(() => ({ rows: [] }))).rows.length;
    // TRN-PIX-15: pagamento que não é nosso só é consultado com aviso ASSINADO (vira `pix_orfao` para o admin);
    // sem assinatura, ignorado (senão qualquer um faria o servidor consultar ids aleatórios)
    if (!nosso && !assinado) return;
    try { console.log('[pix] aviso', dataId, assinado ? 'assinado' : 'sem assinatura', await confirmarPeloProvedor(dataId)); }
    catch (e) { console.error('[pix] aviso', dataId, e.message); }
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

  // TRN-PIX-17: com o MP lento, uma rotina pode passar de 1 min; a seguinte não começa por cima (contaria estorno em dobro)
  let rodando = false;
  async function rotina() {
    if ((!TOKEN && !SIMULADO) || rodando) return;
    rodando = true;
    try { await umaRodada(); } finally { rodando = false; }
  }
  async function umaRodada() {
    for (const x of (await pool.query('select xadrez_rt.pix_pendentes() id')).rows) {
      if (String(x.id).startsWith('sim-')) continue;
      try { const r = await confirmarPeloProvedor(x.id); if (r !== 'sem_mudanca') console.log('[pix] conferência', x.id, r); }
      catch (e) { console.error('[pix] conferência', x.id, e.message); }
    }
    for (const x of (await pool.query('select xadrez_rt.pix_para_estornar() id')).rows) {
      if (String(x.id).startsWith('sim-')) { await pool.query('select xadrez_rt.pix_estornado($1)', [x.id]); continue; }
      try {
        // estorno pode já ter acontecido (em andamento que concluiu, ou devolvido pelo painel do MP com o aviso perdido)
        if ((await confirmarPeloProvedor(x.id)) === 'estornado') { console.log('[pix] estorno já feito', x.id); continue; }
        // estorno total do pedido: corpo vazio. A resposta não é tomada como verdade — reconsulta o pedido: `refunded`
        // é estorno feito; qualquer outra coisa é estorno aceito ainda em andamento (Pix em contingência, banco lento)
        await mp('POST', `/v1/orders/${encodeURIComponent(x.id)}/refund`, undefined, 'estorno-' + x.id);
        if ((await confirmarPeloProvedor(x.id)) === 'estornado') { console.log('[pix] estorno', x.id); continue; }
        await pool.query('select xadrez_rt.pix_estorno_em_andamento($1)', [x.id]); console.log('[pix] estorno em andamento', x.id);
      }
      catch (e) { console.error('[pix] estorno', x.id, e.message); await pool.query('select xadrez_rt.pix_estorno_falhou($1, $2)', [x.id, e.message]).catch(() => {}); }
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
