'use strict';
/**
 * Thread separada (worker_threads) que confere vitórias contra a IA (D-TRN-02/12): reproduzir uma partida no nível
 * Expert custa 1–2 min de CPU e não pode travar o tempo real. Recebe { id, lances, dificuldade } e devolve o veredito.
 */
const { parentPort } = require('node:worker_threads');
const X = require('./motor/xadrez');

/**
 * lances gravados ao vivo (um a um) × enviados de uma vez depois do login (D-TRN-11). O envio em lote grava todos com o
 * MESMO horário exato (um só INSERT, mesmo now() da transação); ao vivo, cada lance é uma requisição e tem horário
 * próprio — mesmo quem joga em menos de 1 s por lance. (Antes: "segundos distintos ≥ metade" tirava do "mais rápido"
 * justamente quem joga rápido.)
 */
function aoVivo(lances) {
  if (lances.length < 4) return false;
  const horarios = new Set(lances.map(l => String(l.created_at)));
  return horarios.size >= Math.ceil(lances.length * 0.9);
}

parentPort.on('message', ({ id, lances, dificuldade }) => {
  const t0 = Date.now();
  let r;
  try {
    if (lances.some(l => l.undone)) r = { ok: false, motivo: 'lance_desfeito' };
    else r = X.conferirPartidaIA(lances, dificuldade);
  } catch (e) { r = { ok: false, motivo: 'erro_conferencia', erro: String(e && e.message || e) }; }
  const vivo = aoVivo(lances);
  parentPort.postMessage({ id, ok: !!r.ok, motivo: r.motivo || null, segundos: r.ok && vivo ? r.segundosJogador : null,
                           aoVivo: vivo, ms: Date.now() - t0 });
});
