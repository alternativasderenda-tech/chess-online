'use strict';
/**
 * Posições e lances do Aprenda sobre o motor REAL do jogo (servidor/motor/xadrez.js → motor-gerado.js, extraído do
 * index.html). Tabuleiro: 64 casas, 0 = a8 … 63 = h1, casa vazia = null (o roque do motor compara com `=== null`).
 *
 * `lerFen` é autocontida de propósito: o gerador copia o texto dela (Function.prototype.toString) para o
 * aprenda/motor.js do navegador — não pode usar nada de fora do próprio corpo.
 */
const X = require('../../servidor/motor/xadrez');
const M = X.M;

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

const COLUNAS = 'abcdefgh';
const nomeCasa = i => COLUNAS[i & 7] + (8 - (i >> 3));
const indiceCasa = n => (8 - Number(n[1])) * 8 + (n.charCodeAt(0) - 97);
const ehCasa = n => /^[a-h][1-8]$/.test(n);

/** Problemas de legalidade de uma posição já lida (lista vazia = legal). */
function problemasDaPosicao(e) {
  const p = [];
  const b = e.board;
  const conta = ch => b.filter(x => x === ch).length;
  if (conta('K') !== 1) p.push('precisa de exatamente 1 rei branco (tem ' + conta('K') + ')');
  if (conta('k') !== 1) p.push('precisa de exatamente 1 rei preto (tem ' + conta('k') + ')');
  for (let i = 0; i < 8; i++) if ((b[i] || '').toLowerCase() === 'p' || (b[56 + i] || '').toLowerCase() === 'p') p.push('peão na 1ª ou 8ª fileira (' + nomeCasa(b[i] && b[i].toLowerCase() === 'p' ? i : 56 + i) + ')');
  for (const cor of ['w', 'b']) {
    const pecas = b.filter(x => x && M.colorOf(x) === cor);
    const peoes = pecas.filter(x => x.toLowerCase() === 'p').length;
    const nome = cor === 'w' ? 'Brancas' : 'Pretas';
    if (pecas.length > 16) p.push(nome + ' com mais de 16 peças');
    if (peoes > 8) p.push(nome + ' com mais de 8 peões');
    const extra = { q: 1, r: 2, b: 2, n: 2 };
    let promovidas = 0;
    for (const t of Object.keys(extra)) promovidas += Math.max(0, pecas.filter(x => x.toLowerCase() === t).length - extra[t]);
    if (promovidas > 8 - peoes) p.push(nome + ': peças promovidas demais para ' + peoes + ' peões');
  }
  if (p.length) return p;   // sem os dois reis o resto não faz sentido
  const fora = e.turn === 'w' ? 'b' : 'w';
  if (M.inCheck(fora, b)) p.push('o lado que NÃO joga (' + (fora === 'w' ? 'Brancas' : 'Pretas') + ') está em xeque');
  const c = e.castling;
  if (c.K && !(b[60] === 'K' && b[63] === 'R')) p.push('roque K sem rei em e1 e torre em h1');
  if (c.Q && !(b[60] === 'K' && b[56] === 'R')) p.push('roque Q sem rei em e1 e torre em a1');
  if (c.k && !(b[4] === 'k' && b[7] === 'r')) p.push('roque k sem rei em e8 e torre em h8');
  if (c.q && !(b[4] === 'k' && b[0] === 'r')) p.push('roque q sem rei em e8 e torre em a8');
  if (e.ep >= 0) {
    const fileira = e.ep >> 3;   // 2 = 6ª fileira, 5 = 3ª
    const ok = e.turn === 'w'
      ? fileira === 2 && !b[e.ep] && !b[e.ep - 8] && b[e.ep + 8] === 'p'
      : fileira === 5 && !b[e.ep] && !b[e.ep + 8] && b[e.ep - 8] === 'P';
    if (!ok) p.push('en passant ' + nomeCasa(e.ep) + ' impossível (precisa do peão que acabou de andar 2 casas, com a casa de passagem vazia)');
  }
  if (e.half > 100) p.push('contador de meio-lances acima de 100');
  return p;
}

/** Lê e confere; devolve { estado } ou { erro } (mensagem pronta). */
function posicaoLegal(fen) {
  let e;
  try { e = lerFen(fen); } catch (err) { return { erro: 'FEN inválido "' + fen + '": ' + err.message }; }
  const p = problemasDaPosicao(e);
  if (p.length) return { erro: 'posição ilegal "' + fen + '": ' + p.join('; ') };
  return { estado: e };
}

/** "e7e8q" → { from, to, promo } (promo na cor de quem joga, como o site) ou null */
function lerUci(txt, turn) {
  const m = /^([a-h][1-8])([a-h][1-8])([qrbn])?$/.exec(String(txt).trim());
  if (!m) return null;
  const r = { from: indiceCasa(m[1]), to: indiceCasa(m[2]) };
  if (m[3]) r.promo = turn === 'w' ? m[3].toUpperCase() : m[3];
  return r;
}
const uci = m => nomeCasa(m.from) + nomeCasa(m.to) + (m.promo ? m.promo.toLowerCase() : '');

/** o lance legal completo (com castle/ep) que corresponde a {from,to,promo}, ou null */
function acharLegal(e, l) { return X.legais(e).find(x => X.igual(x, l)) || null; }

const LETRAS = {
  pt: { k: 'R', q: 'D', r: 'T', b: 'B', n: 'C' },
  en: { k: 'K', q: 'Q', r: 'R', b: 'B', n: 'N' },
};

function ehMate(e) { return X.legais(e).length === 0 && M.inCheck(e.turn, e.board); }

/** Notação algébrica (SAN) do lance legal `m` na posição `e`, com as letras do idioma. */
function san(e, m, idioma) {
  const L = LETRAS[idioma] || LETRAS.pt;
  const p = e.board[m.from];
  const tipo = p.toLowerCase();
  let s;
  if (m.castle) s = m.castle.toLowerCase() === 'k' ? 'O-O' : 'O-O-O';
  else {
    const captura = !!e.board[m.to] || !!m.ep;
    if (tipo === 'p') {
      s = (captura ? COLUNAS[m.from & 7] + 'x' : '') + nomeCasa(m.to) + (m.promo ? '=' + L[m.promo.toLowerCase()] : '');
    } else {
      const rivais = X.legais(e).filter(x => x.to === m.to && x.from !== m.from && e.board[x.from] === p);
      let d = '';
      if (rivais.length) {
        if (!rivais.some(x => (x.from & 7) === (m.from & 7))) d = COLUNAS[m.from & 7];
        else if (!rivais.some(x => (x.from >> 3) === (m.from >> 3))) d = String(8 - (m.from >> 3));
        else d = nomeCasa(m.from);
      }
      s = L[tipo] + d + (captura ? 'x' : '') + nomeCasa(m.to);
    }
  }
  const prox = X.jogar(e, m);
  if (M.inCheck(prox.turn, prox.board)) s += ehMate(prox) ? '#' : '+';
  return s;
}

/** "1.Dxf7#" / "1...Dh4# 2.…" — numera a partir do estado inicial */
function linhaSan(e0, lances, idioma) {
  let e = e0;
  const partes = [];
  lances.forEach((m, k) => {
    const s = san(e, m, idioma);
    if (e.turn === 'w') partes.push(e.full + '.' + s);
    else partes.push(k === 0 ? e.full + '...' + s : s);
    e = X.jogar(e, m);
  });
  return partes.join(' ');
}

/** o lado que joga força mate em ≤ n lances? (busca completa; só para n ≤ 2 — custo cresce rápido) */
function mateForcado(e, n) {
  for (const m of X.legais(e)) {
    const p = X.jogar(e, m);
    const resp = X.legais(p);
    if (resp.length === 0) { if (M.inCheck(p.turn, p.board)) return true; continue; }
    if (n > 1 && resp.every(r => mateForcado(X.jogar(p, r), n - 1))) return true;
  }
  return false;
}

module.exports = { lerFen, problemasDaPosicao, posicaoLegal, lerUci, uci, acharLegal, san, linhaSan, ehMate, mateForcado, nomeCasa, indiceCasa, ehCasa, LETRAS, X, M };
