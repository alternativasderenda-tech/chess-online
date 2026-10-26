// GERADO por aprenda/gerador/gerar.js a partir de servidor/motor/motor-gerado.js (extraído do index.html) e
// servidor/motor/xadrez.js — NÃO EDITAR À MÃO. Mesmas regras do jogo: o exercício aceita/recusa lance como o jogo.
// fonte: 122ca2b5d5445dc5
(function () {
'use strict';
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
const M = { isWhite, isBlack, colorOf, row, col, sq, inBounds, generateMoves, isAttacked, findKing, inCheck, makeMove };
function legais(e) {
  return M.generateMoves(e.turn, e.board, e.castling, e.ep)
    .filter(m => !M.inCheck(e.turn, M.makeMove(m, e.board, e.castling).board));
}
const igual = (a, b) => a.from === b.from && a.to === b.to
  && String(a.promo || '').toLowerCase() === String(b.promo || '').toLowerCase();
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
function fim(e) {
  if (legais(e).length === 0) {
    return M.inCheck(e.turn, e.board) ? { tipo: 'mate', vencedor: e.turn === 'w' ? 'b' : 'w' } : { tipo: 'afogamento' };
  }
  if (e.half >= 100) return { tipo: '50lances' };
  if (materialInsuficiente(e.board)) return { tipo: 'material' };
  return null;
}
function lerFen(fen) {
  const partes = String(fen || '').trim().split(/\s+/);
  if (partes.length < 2 || partes.length > 6) throw new Error('o FEN precisa de 2 a 6 campos (posição, vez, roque, en passant, meio-lances, lance); tem ' + partes.length);
  const pos = partes[0], vez = partes[1], roque = partes[2] || '-', ep = partes[3] || '-';
  const meio = partes[4] === undefined ? '0' : partes[4], lance = partes[5] === undefined ? '1' : partes[5];
  const linhas = pos.split('/');
  if (linhas.length !== 8) throw new Error('a posição precisa de 8 fileiras separadas por "/" (tem ' + linhas.length + ')');
  const board = new Array(64).fill(null);
  for (let r = 0; r < 8; r++) {
    let c = 0;
    for (const ch of linhas[r]) {
      if (ch >= '1' && ch <= '8') c += Number(ch);
      else if ('prnbqkPRNBQK'.indexOf(ch) >= 0) { if (c < 8) board[r * 8 + c] = ch; c++; }
      else throw new Error('caractere inválido "' + ch + '" na fileira ' + (8 - r));
    }
    if (c !== 8) throw new Error('a fileira ' + (8 - r) + ' tem ' + c + ' casas (precisa de 8)');
  }
  if (vez !== 'w' && vez !== 'b') throw new Error('a vez tem de ser "w" ou "b" (veio "' + vez + '")');
  if (roque !== '-' && !/^K?Q?k?q?$/.test(roque)) throw new Error('roque inválido "' + roque + '" (use KQkq, um subconjunto, ou -)');
  let epSq = -1;
  if (ep !== '-') {
    if (!/^[a-h][36]$/.test(ep)) throw new Error('casa de en passant inválida "' + ep + '" (tem de estar na 3ª ou 6ª fileira, ou -)');
    epSq = (8 - Number(ep[1])) * 8 + (ep.charCodeAt(0) - 97);
  }
  if (!/^\d+$/.test(meio) || !/^\d+$/.test(lance) || Number(lance) < 1) throw new Error('contadores de lance inválidos ("' + meio + '" "' + lance + '")');
  return {
    board, turn: vez,
    castling: { K: roque.indexOf('K') >= 0, Q: roque.indexOf('Q') >= 0, k: roque.indexOf('k') >= 0, q: roque.indexOf('q') >= 0 },
    ep: epSq, half: Number(meio), full: Number(lance),
  };
}
window.XadrezMotor = { legais, jogar, fim, igual, lerFen, inCheck: M.inCheck };
})();
