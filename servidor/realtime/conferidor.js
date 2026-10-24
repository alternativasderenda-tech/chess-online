'use strict';
/**
 * Thread separada (worker_threads) que confere vitórias contra a IA (D-TRN-02/12): reproduzir uma partida no nível
 * Expert custa 1–2 min de CPU e não pode travar o tempo real. Recebe { id, lances, dificuldade } e devolve o veredito.
 */
const { parentPort } = require('node:worker_threads');
const X = require('./motor/xadrez');

/** lances gravados ao vivo (um a um) × enviados de uma vez depois do login (D-TRN-11) */
function aoVivo(lances) {
  if (lances.length < 4) return false;
  const segundos = new Set(lances.map(l => Math.floor(new Date(l.created_at).getTime() / 1000)));
  return segundos.size >= Math.ceil(lances.length / 2);
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
