// GERADO por servidor/motor/extrair.js a partir do index.html — NÃO EDITAR À MÃO.
// getBestMove do site (regra de escolha da IA) = 0d175d6f58718b23; xadrez.js replica essa regra.
'use strict';
const PIECE_VALUES = { p: 100, n: 320, b: 330, r: 500, q: 900, k: 20000 };

const PST = {
  p: [
    0,  0,  0,  0,  0,  0,  0,  0,
    50, 50, 50, 50, 50, 50, 50, 50,
    10, 10, 20, 30, 30, 20, 10, 10,
    5,  5, 10, 25, 25, 10,  5,  5,
    0,  0,  0, 20, 20,  0,  0,  0,
    5, -5,-10,  0,  0,-10, -5,  5,
    5, 10, 10,-20,-20, 10, 10,  5,
    0,  0,  0,  0,  0,  0,  0,  0
  ],
  n: [
    -50,-40,-30,-30,-30,-30,-40,-50,
    -40,-20,  0,  0,  0,  0,-20,-40,
    -30,  0, 10, 15, 15, 10,  0,-30,
    -30,  5, 15, 20, 20, 15,  5,-30,
    -30,  0, 15, 20, 20, 15,  0,-30,
    -30,  5, 10, 15, 15, 10,  5,-30,
    -40,-20,  0,  5,  5,  0,-20,-40,
    -50,-40,-30,-30,-30,-30,-40,-50
  ],
  b: [
    -20,-10,-10,-10,-10,-10,-10,-20,
    -10,  0,  0,  0,  0,  0,  0,-10,
    -10,  0, 10, 10, 10, 10,  0,-10,
    -10,  5,  5, 10, 10,  5,  5,-10,
    -10,  0, 10, 10, 10, 10,  0,-10,
    -10, 10, 10, 10, 10, 10, 10,-10,
    -10,  5,  0,  0,  0,  0,  5,-10,
    -20,-10,-10,-10,-10,-10,-10,-20
  ],
  r: [
    0,  0,  0,  0,  0,  0,  0,  0,
    5, 10, 10, 10, 10, 10, 10,  5,
    -5,  0,  0,  0,  0,  0,  0, -5,
    -5,  0,  0,  0,  0,  0,  0, -5,
    -5,  0,  0,  0,  0,  0,  0, -5,
    -5,  0,  0,  0,  0,  0,  0, -5,
    -5,  0,  0,  0,  0,  0,  0, -5,
    0,  0,  0,  5,  5,  0,  0,  0
  ],
  q: [
    -20,-10,-10, -5, -5,-10,-10,-20,
    -10,  0,  0,  0,  0,  0,  0,-10,
    -10,  0,  5,  5,  5,  5,  0,-10,
    -5,  0,  5,  5,  5,  5,  0, -5,
    0,  0,  5,  5,  5,  5,  0, -5,
    -10,  5,  5,  5,  5,  5,  0,-10,
    -10,  0,  5,  0,  0,  0,  0,-10,
    -20,-10,-10, -5, -5,-10,-10,-20
  ],
  k: [
    -30,-40,-40,-50,-50,-40,-40,-30,
    -30,-40,-40,-50,-50,-40,-40,-30,
    -30,-40,-40,-50,-50,-40,-40,-30,
    -30,-40,-40,-50,-50,-40,-40,-30,
    -20,-30,-30,-40,-40,-30,-30,-20,
    -10,-20,-20,-20,-20,-20,-20,-10,
    20, 20,  0,  0,  0,  0, 20, 20,
    20, 30, 10,  0,  0, 10, 30, 20
  ],
  k_end: [
    -50,-40,-30,-20,-20,-30,-40,-50,
    -30,-20,-10,  0,  0,-10,-20,-30,
    -30,-10, 20, 30, 30, 20,-10,-30,
    -30,-10, 30, 40, 40, 30,-10,-30,
    -30,-10, 30, 40, 40, 30,-10,-30,
    -30,-10, 20, 30, 30, 20,-10,-30,
    -30,-30,  0,  0,  0,  0,-30,-30,
    -50,-30,-30,-30,-30,-30,-30,-50
  ]
};
function isWhite(p) { return p && p === p.toUpperCase(); }
function isBlack(p) { return p && p === p.toLowerCase(); }
function colorOf(p) { return isWhite(p) ? 'w' : 'b'; }
function row(sq) { return sq >> 3; }
function col(sq) { return sq & 7; }
function sq(r, c) { return r * 8 + c; }
function inBounds(r, c) { return r >= 0 && r < 8 && c >= 0 && c < 8; }
function generateMoves(color, boardState, castl, ep) {
  const moves = [];
  const isW = color === 'w';

  for (let i = 0; i < 64; i++) {
    const p = boardState[i];
    if (!p || colorOf(p) !== color) continue;
    const r = row(i), c = col(i);
    const type = p.toLowerCase();

    if (type === 'p') {
      const dir = isW ? -1 : 1;
      const startRow = isW ? 6 : 1;
      const promoRow = isW ? 0 : 7;
      // Forward
      const f1 = sq(r + dir, c);
      if (inBounds(r + dir, c) && !boardState[f1]) {
        if (r + dir === promoRow) {
          ['q','r','b','n'].forEach(pp => moves.push({ from: i, to: f1, promo: isW ? pp.toUpperCase() : pp }));
        } else {
          moves.push({ from: i, to: f1 });
        }
        // Double
        if (r === startRow) {
          const f2 = sq(r + 2*dir, c);
          if (!boardState[f2]) moves.push({ from: i, to: f2 });
        }
      }
      // Captures
      for (const dc of [-1, 1]) {
        if (!inBounds(r + dir, c + dc)) continue;
        const t = sq(r + dir, c + dc);
        if (boardState[t] && colorOf(boardState[t]) !== color) {
          if (r + dir === promoRow) {
            ['q','r','b','n'].forEach(pp => moves.push({ from: i, to: t, promo: isW ? pp.toUpperCase() : pp }));
          } else {
            moves.push({ from: i, to: t });
          }
        }
        // En passant
        if (t === ep) {
          moves.push({ from: i, to: t, ep: true });
        }
      }
    }

    if (type === 'n') {
      for (const [dr, dc] of [[-2,-1],[-2,1],[-1,-2],[-1,2],[1,-2],[1,2],[2,-1],[2,1]]) {
        const nr = r+dr, nc = c+dc;
        if (!inBounds(nr, nc)) continue;
        const t = sq(nr, nc);
        if (!boardState[t] || colorOf(boardState[t]) !== color) moves.push({ from: i, to: t });
      }
    }

    if (type === 'b' || type === 'q') {
      for (const [dr, dc] of [[-1,-1],[-1,1],[1,-1],[1,1]]) {
        for (let s = 1; s < 8; s++) {
          const nr = r+dr*s, nc = c+dc*s;
          if (!inBounds(nr, nc)) break;
          const t = sq(nr, nc);
          if (boardState[t]) {
            if (colorOf(boardState[t]) !== color) moves.push({ from: i, to: t });
            break;
          }
          moves.push({ from: i, to: t });
        }
      }
    }

    if (type === 'r' || type === 'q') {
      for (const [dr, dc] of [[-1,0],[1,0],[0,-1],[0,1]]) {
        for (let s = 1; s < 8; s++) {
          const nr = r+dr*s, nc = c+dc*s;
          if (!inBounds(nr, nc)) break;
          const t = sq(nr, nc);
          if (boardState[t]) {
            if (colorOf(boardState[t]) !== color) moves.push({ from: i, to: t });
            break;
          }
          moves.push({ from: i, to: t });
        }
      }
    }

    if (type === 'k') {
      for (const [dr, dc] of [[-1,-1],[-1,0],[-1,1],[0,-1],[0,1],[1,-1],[1,0],[1,1]]) {
        const nr = r+dr, nc = c+dc;
        if (!inBounds(nr, nc)) continue;
        const t = sq(nr, nc);
        if (!boardState[t] || colorOf(boardState[t]) !== color) moves.push({ from: i, to: t });
      }
      // Castling
      if (isW && i === 60) {
        if (castl.K && boardState[61] === null && boardState[62] === null && boardState[63] === 'R') {
          if (!isAttacked(60, 'b', boardState) && !isAttacked(61, 'b', boardState) && !isAttacked(62, 'b', boardState))
            moves.push({ from: 60, to: 62, castle: 'K' });
        }
        if (castl.Q && boardState[59] === null && boardState[58] === null && boardState[57] === null && boardState[56] === 'R') {
          if (!isAttacked(60, 'b', boardState) && !isAttacked(59, 'b', boardState) && !isAttacked(58, 'b', boardState))
            moves.push({ from: 60, to: 58, castle: 'Q' });
        }
      }
      if (!isW && i === 4) {
        if (castl.k && boardState[5] === null && boardState[6] === null && boardState[7] === 'r') {
          if (!isAttacked(4, 'w', boardState) && !isAttacked(5, 'w', boardState) && !isAttacked(6, 'w', boardState))
            moves.push({ from: 4, to: 6, castle: 'k' });
        }
        if (castl.q && boardState[3] === null && boardState[2] === null && boardState[1] === null && boardState[0] === 'r') {
          if (!isAttacked(4, 'w', boardState) && !isAttacked(3, 'w', boardState) && !isAttacked(2, 'w', boardState))
            moves.push({ from: 4, to: 2, castle: 'q' });
        }
      }
    }
  }

  return moves;
}

function isAttacked(sq, byColor, boardState) {
  const r = row(sq), c = col(sq);
  const isW = byColor === 'w';

  // Pawn attacks
  const pDir = isW ? 1 : -1;
  for (const dc of [-1, 1]) {
    const pr = r + pDir, pc = c + dc;
    if (inBounds(pr, pc)) {
      const p = boardState[pr * 8 + pc];
      if (p && p.toLowerCase() === 'p' && colorOf(p) === byColor) return true;
    }
  }

  // Knight
  for (const [dr, dc] of [[-2,-1],[-2,1],[-1,-2],[-1,2],[1,-2],[1,2],[2,-1],[2,1]]) {
    const nr = r+dr, nc = c+dc;
    if (inBounds(nr, nc)) {
      const p = boardState[nr*8+nc];
      if (p && p.toLowerCase() === 'n' && colorOf(p) === byColor) return true;
    }
  }

  // Bishop/Queen diagonals
  for (const [dr, dc] of [[-1,-1],[-1,1],[1,-1],[1,1]]) {
    for (let s = 1; s < 8; s++) {
      const nr = r+dr*s, nc = c+dc*s;
      if (!inBounds(nr, nc)) break;
      const p = boardState[nr*8+nc];
      if (p) {
        if (colorOf(p) === byColor && (p.toLowerCase() === 'b' || p.toLowerCase() === 'q')) return true;
        break;
      }
    }
  }

  // Rook/Queen lines
  for (const [dr, dc] of [[-1,0],[1,0],[0,-1],[0,1]]) {
    for (let s = 1; s < 8; s++) {
      const nr = r+dr*s, nc = c+dc*s;
      if (!inBounds(nr, nc)) break;
      const p = boardState[nr*8+nc];
      if (p) {
        if (colorOf(p) === byColor && (p.toLowerCase() === 'r' || p.toLowerCase() === 'q')) return true;
        break;
      }
    }
  }

  // King
  for (const [dr, dc] of [[-1,-1],[-1,0],[-1,1],[0,-1],[0,1],[1,-1],[1,0],[1,1]]) {
    const nr = r+dr, nc = c+dc;
    if (inBounds(nr, nc)) {
      const p = boardState[nr*8+nc];
      if (p && p.toLowerCase() === 'k' && colorOf(p) === byColor) return true;
    }
  }

  return false;
}

function findKing(color, boardState) {
  const k = color === 'w' ? 'K' : 'k';
  for (let i = 0; i < 64; i++) if (boardState[i] === k) return i;
  return -1;
}

function inCheck(color, boardState) {
  const kSq = findKing(color, boardState);
  return kSq >= 0 && isAttacked(kSq, color === 'w' ? 'b' : 'w', boardState);
}

function makeMove(move, boardState, castl) {
  const newBoard = [...boardState];
  const newCastl = { ...castl };
  let captured = newBoard[move.to];
  let newEp = -1;

  if (move.ep) {
    const epCapSq = move.to + (colorOf(newBoard[move.from]) === 'w' ? 8 : -8);
    captured = newBoard[epCapSq];
    newBoard[epCapSq] = null;
  }

  if (move.castle) {
    if (move.castle === 'K') { newBoard[61] = newBoard[63]; newBoard[63] = null; }
    if (move.castle === 'Q') { newBoard[59] = newBoard[56]; newBoard[56] = null; }
    if (move.castle === 'k') { newBoard[5] = newBoard[7]; newBoard[7] = null; }
    if (move.castle === 'q') { newBoard[3] = newBoard[0]; newBoard[0] = null; }
  }

  const piece = newBoard[move.from];
  newBoard[move.to] = move.promo || piece;
  newBoard[move.from] = null;

  // Update castling rights
  if (piece === 'K') { newCastl.K = false; newCastl.Q = false; }
  if (piece === 'k') { newCastl.k = false; newCastl.q = false; }
  if (move.from === 63 || move.to === 63) newCastl.K = false;
  if (move.from === 56 || move.to === 56) newCastl.Q = false;
  if (move.from === 7 || move.to === 7) newCastl.k = false;
  if (move.from === 0 || move.to === 0) newCastl.q = false;

  // En passant square
  if (piece && piece.toLowerCase() === 'p' && Math.abs(row(move.from) - row(move.to)) === 2) {
    newEp = sq((row(move.from) + row(move.to)) / 2, col(move.from));
  }

  return { board: newBoard, castling: newCastl, enPassant: newEp, captured };
}
function evaluate(boardState, castlState) {
  let score = 0;
  let whiteQueens = 0, blackQueens = 0;
  let whitePieces = 0, blackPieces = 0;

  for (let i = 0; i < 64; i++) {
    const p = boardState[i];
    if (!p) continue;
    const type = p.toLowerCase();
    if (type === 'q') { if (isWhite(p)) whiteQueens++; else blackQueens++; }
    if (type !== 'k' && type !== 'p') { if (isWhite(p)) whitePieces++; else blackPieces++; }
  }

  const endgame = whiteQueens === 0 && blackQueens === 0 || (whitePieces <= 1 && blackPieces <= 1);

  for (let i = 0; i < 64; i++) {
    const p = boardState[i];
    if (!p) continue;
    const type = p.toLowerCase();
    const val = PIECE_VALUES[type] || 0;
    const pstTable = (type === 'k' && endgame) ? PST.k_end : PST[type];
    const idx = isWhite(p) ? i : (56 - (row(i) * 8) + col(i));
    const pstVal = pstTable ? pstTable[idx] : 0;

    if (isWhite(p)) {
      score += val + pstVal;
    } else {
      score -= val + pstVal;
    }
  }

  return score;
}

function orderMoves(moves, boardState) {
  return moves.map(m => {
    let score = 0;
    const target = boardState[m.to];
    const piece = boardState[m.from];
    if (target) {
      score += 10 * PIECE_VALUES[target.toLowerCase()] - PIECE_VALUES[piece.toLowerCase()];
    }
    if (m.promo) score += PIECE_VALUES[m.promo.toLowerCase()];
    return { move: m, score };
  }).sort((a, b) => b.score - a.score).map(x => x.move);
}

function minimax(boardState, castlState, epSq, depth, alpha, beta, maximizing) {
  const color = maximizing ? 'w' : 'b';
  const pseudo = generateMoves(color, boardState, castlState, epSq);
  const legal = pseudo.filter(m => {
    const r = makeMove(m, boardState, castlState);
    return !inCheck(color, r.board);
  });

  if (legal.length === 0) {
    if (inCheck(color, boardState)) return maximizing ? -99999 + (4-depth) : 99999 - (4-depth);
    return 0; // Stalemate
  }

  if (depth === 0) return evaluate(boardState, castlState);

  const ordered = orderMoves(legal, boardState);

  if (maximizing) {
    let best = -Infinity;
    for (const m of ordered) {
      const r = makeMove(m, boardState, castlState);
      const val = minimax(r.board, r.castling, r.enPassant, depth - 1, alpha, beta, false);
      best = Math.max(best, val);
      alpha = Math.max(alpha, val);
      if (beta <= alpha) break;
    }
    return best;
  } else {
    let best = Infinity;
    for (const m of ordered) {
      const r = makeMove(m, boardState, castlState);
      const val = minimax(r.board, r.castling, r.enPassant, depth - 1, alpha, beta, true);
      best = Math.min(best, val);
      beta = Math.min(beta, val);
      if (beta <= alpha) break;
    }
    return best;
  }
}
const GETBESTMOVE_SHA = '0d175d6f58718b23';
module.exports = { PIECE_VALUES, PST, isWhite, isBlack, colorOf, row, col, sq, inBounds, generateMoves, isAttacked,
  findKing, inCheck, makeMove, evaluate, orderMoves, minimax, GETBESTMOVE_SHA };
