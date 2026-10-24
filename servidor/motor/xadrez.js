'use strict';
/**
 * Regras de xadrez no servidor (D-TRN-01/02), sobre o motor EXTRAÍDO do site (motor-gerado.js): o servidor confere com
 * exatamente as mesmas regras que o navegador usa. Tabuleiro: 64 casas, índice 0 = a8 … 63 = h1 (como no site).
 * Lance: { from, to, promo } — promo é a letra da peça na cor de quem promove ('Q' branco, 'q' preto), como no site.
 */
const M = require('./motor-gerado');

/** Margem de aceitação da IA por dificuldade — cópia da regra de getBestMove do site (o teste confere a impressão). */
const MARGEM_IA = { 1: 80, 2: 35, 3: 15, 4: 10 };
const GETBESTMOVE_CONFERIDO = '0d175d6f58718b23';   // atualizar junto com a regra abaixo se o site mudar

function inicial() {
  const board = new Array(64).fill(null);
  let i = 0;
  for (const ch of 'rnbqkbnr/pppppppp/8/8/8/8/PPPPPPPP/RNBQKBNR') {
    if (ch === '/') continue;
    if (ch >= '1' && ch <= '8') i += Number(ch); else board[i++] = ch;
  }
  return { board, turn: 'w', castling: { K: true, Q: true, k: true, q: true }, ep: -1, half: 0, full: 1 };
}

function legais(e) {
  return M.generateMoves(e.turn, e.board, e.castling, e.ep)
    .filter(m => !M.inCheck(e.turn, M.makeMove(m, e.board, e.castling).board));
}

const igual = (a, b) => a.from === b.from && a.to === b.to
  && String(a.promo || '').toLowerCase() === String(b.promo || '').toLowerCase();

/** aplica um lance legal (como o executeMove do site); devolve o estado novo ou null se o lance não é legal */
function jogar(e, lance) {
  const m = legais(e).find(x => igual(x, lance));
  if (!m) return null;
  const r = M.makeMove(m, e.board, e.castling);
  const peaoOuCaptura = !!r.captured || (r.board[m.to] && r.board[m.to].toLowerCase() === 'p');
  return {
    board: r.board, castling: r.castling, ep: r.enPassant, turn: e.turn === 'w' ? 'b' : 'w',
    half: peaoOuCaptura ? 0 : e.half + 1, full: e.turn === 'b' ? e.full + 1 : e.full, ultimo: m,
  };
}

function materialInsuficiente(board) {
  const p = { w: [], b: [] };
  for (let i = 0; i < 64; i++) if (board[i]) p[M.colorOf(board[i])].push(board[i].toLowerCase());
  if (p.w.length === 1 && p.b.length === 1) return true;
  if (p.w.length === 1 && p.b.length === 2 && (p.b.includes('b') || p.b.includes('n'))) return true;
  if (p.b.length === 1 && p.w.length === 2 && (p.w.includes('b') || p.w.includes('n'))) return true;
  return false;
}

/** fim de jogo na MESMA ordem do site: mate/afogamento, 50 lances, material insuficiente; null = continua */
function fim(e) {
  if (legais(e).length === 0) {
    return M.inCheck(e.turn, e.board) ? { tipo: 'mate', vencedor: e.turn === 'w' ? 'b' : 'w' } : { tipo: 'afogamento' };
  }
  if (e.half >= 100) return { tipo: '50lances' };
  if (materialInsuficiente(e.board)) return { tipo: 'material' };
  return null;
}

/** lances que a IA do site pode escolher nesta posição (mesma busca e mesma margem de getBestMove) */
function candidatosIA(e, dificuldade) {
  const depth = Number(dificuldade);
  const leg = legais(e);
  if (!leg.length) return [];
  const max = e.turn === 'w';
  const pontuados = M.orderMoves(leg, e.board).map(m => {
    const r = M.makeMove(m, e.board, e.castling);
    return { m, val: M.minimax(r.board, r.castling, r.enPassant, depth - 1, -Infinity, Infinity, !max) };
  });
  let melhor = pontuados[0].val;
  for (const s of pontuados) if (max ? s.val > melhor : s.val < melhor) melhor = s.val;
  const margem = MARGEM_IA[depth] || 15;
  return pontuados.filter(s => (max ? s.val >= melhor - margem : s.val <= melhor + margem)).map(s => s.m);
}

/**
 * Confere uma partida contra a IA (D-TRN-02). `lances`: em ordem de move_number, cada um { from_sq, to_sq, promotion,
 * is_ai_move, created_at }. Vale só se: alternância correta (quem joga é o jogador ou a IA conforme a cor), todo lance
 * legal, todo lance da IA entre os candidatos da IA, e a partida termina em MATE a favor do jogador (sem lance depois).
 * Tempo do jogador = soma dos intervalos (horário do servidor) entre o lance anterior e cada lance do jogador.
 */
function conferirPartidaIA(lances, dificuldade) {
  if (!Array.isArray(lances) || lances.length < 2) return { ok: false, motivo: 'sem_lances' };
  const corJogador = lances[0].is_ai_move ? 'b' : 'w';   // quem fez o 1º lance (as Brancas)
  let e = inicial();
  let segundos = 0;
  for (let i = 0; i < lances.length; i++) {
    const l = lances[i];
    if (fim(e)) return { ok: false, motivo: 'lance_depois_do_fim', lance: i + 1 };
    const daIA = e.turn !== corJogador;
    if (!!l.is_ai_move !== daIA) return { ok: false, motivo: 'alternancia', lance: i + 1 };
    const lance = { from: l.from_sq, to: l.to_sq, promo: l.promotion || undefined };
    if (daIA && !candidatosIA(e, dificuldade).some(c => igual(c, lance))) return { ok: false, motivo: 'lance_da_ia_impossivel', lance: i + 1 };
    const prox = jogar(e, lance);
    if (!prox) return { ok: false, motivo: 'lance_ilegal', lance: i + 1 };
    if (!daIA && i > 0 && l.created_at && lances[i - 1].created_at) {
      segundos += Math.max(0, (new Date(l.created_at) - new Date(lances[i - 1].created_at)) / 1000);
    }
    e = prox;
  }
  const f = fim(e);
  if (!f || f.tipo !== 'mate' || f.vencedor !== corJogador) return { ok: false, motivo: f ? 'fim_' + f.tipo : 'nao_terminou' };
  return { ok: true, corJogador, lances: lances.length, segundosJogador: Math.max(1, Math.round(segundos)) };
}

module.exports = { inicial, legais, jogar, fim, candidatosIA, conferirPartidaIA, materialInsuficiente, igual, MARGEM_IA, GETBESTMOVE_CONFERIDO, M };
