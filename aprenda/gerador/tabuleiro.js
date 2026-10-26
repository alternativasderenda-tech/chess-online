'use strict';
/**
 * Diagrama de tabuleiro em SVG inline (sem imagem externa, sem id — vários na mesma página não colidem).
 * Peças = os mesmos glifos Unicode do jogo (♚♛♜♝♞♟, cor por preenchimento), casas nas cores do jogo
 * (#f0d9b5 / #b58863). U+FE0E pede a forma de texto: sem ele o iOS desenha ♟ como emoji.
 */
const { nomeCasa, indiceCasa } = require('./posicao');

const LADO = 60;              // casa, em unidades do viewBox (8 × 60 = 480)
const CLARA = '#f0d9b5';
const ESCURA = '#b58863';
const COORD_CLARA = '#6b4a2b';    // coordenada na casa clara: 5,8:1 (e sobre o contorno claro, em casa destacada)
const COORD_ESCURA = '#1a1a2e';   // coordenada na casa escura: 5,4:1 sobre a casa, 12,4:1 sobre o contorno
const GLIFO = { k: '♚', q: '♛', r: '♜', b: '♝', n: '♞', p: '♟' };
const VS15 = '︎';
const FONTE_PECAS = "'Segoe UI Symbol','Noto Sans Symbols 2','DejaVu Sans','Apple Symbols',sans-serif";

/** cores das marcações: nome no Markdown (pt ou en) → [cor da seta, cor da casa] */
const CORES = {
  verde: ['#15781b', 'rgba(21,120,27,0.45)'],
  vermelha: ['#c62828', 'rgba(220,40,40,0.5)'],
  azul: ['#1f5fbf', 'rgba(40,110,220,0.45)'],
  amarela: ['#d99400', 'rgba(255,215,0,0.55)'],
};
const SINONIMOS = { green: 'verde', red: 'vermelha', blue: 'azul', yellow: 'amarela', vermelho: 'vermelha', amarelo: 'amarela' };
const corDe = nome => CORES[SINONIMOS[nome] || nome] ? (SINONIMOS[nome] || nome) : null;

const NOMES = {
  pt: { k: 'Rei', q: 'Dama', r: 'Torre', b: 'Bispo', n: 'Cavalo', p: 'peão', w: 'Brancas', b_: 'Pretas',
    vezW: 'Jogam as Brancas', vezB: 'Jogam as Pretas', inicial: 'Posição inicial', destaque: 'casas destacadas', setas: 'setas',
    diagrama: 'Diagrama' },
  en: { k: 'King', q: 'Queen', r: 'Rook', b: 'Bishop', n: 'Knight', p: 'pawn', w: 'White', b_: 'Black',
    vezW: 'White to move', vezB: 'Black to move', inicial: 'Starting position', destaque: 'highlighted squares', setas: 'arrows',
    diagrama: 'Diagram' },
};

const INICIAL = 'rnbqkbnr/pppppppp/8/8/8/8/PPPPPPPP/RNBQKBNR';
const colocacao = board => {
  let s = '';
  for (let r = 0; r < 8; r++) {
    let vazio = 0;
    for (let c = 0; c < 8; c++) {
      const p = board[r * 8 + c];
      if (!p) { vazio++; continue; }
      if (vazio) { s += vazio; vazio = 0; }
      s += p;
    }
    if (vazio) s += vazio;
    if (r < 7) s += '/';
  }
  return s;
};

/**
 * texto para leitor de tela: "Brancas: Rei g1, Dama h5, peões a2, b2. Pretas: …. Jogam as Brancas."
 * extras.legenda: texto da legenda que vem antes — se ela já diz "posição inicial", não repete (LAY-diagrama-12)
 */
function descrever(estado, idioma, extras = {}) {
  const N = NOMES[idioma] || NOMES.pt;
  const frases = [];
  if (colocacao(estado.board) === INICIAL) {
    const sem = t => String(t || '').normalize('NFD').replace(/[̀-ͯ]/g, '').toLowerCase();
    if (!sem(extras.legenda).includes(sem(N.inicial))) frases.push(N.inicial + '.');
  } else {
    const lados = [];
    for (const cor of ['w', 'b']) {
      const grupos = [];
      for (const t of ['k', 'q', 'r', 'b', 'n', 'p']) {
        const ch = cor === 'w' ? t.toUpperCase() : t;
        const casas = [];
        estado.board.forEach((p, i) => { if (p === ch) casas.push(nomeCasa(i)); });
        if (!casas.length) continue;
        if (t === 'p') grupos.push((casas.length > 1 ? (idioma === 'en' ? 'pawns ' : 'peões ') : N.p + ' ') + casas.join(', '));
        else grupos.push(N[t] + ' ' + casas.join(', '));
      }
      lados.push((cor === 'w' ? N.w : N.b_) + ': ' + grupos.join(', ') + '.');
    }
    frases.push(...lados);
  }
  frases.push((estado.turn === 'w' ? N.vezW : N.vezB) + '.');
  if (extras.casas && extras.casas.length) frases.push(cap(N.destaque) + ': ' + extras.casas.map(c => c.casa).join(', ') + '.');
  if (extras.setas && extras.setas.length) frases.push(cap(N.setas) + ': ' + extras.setas.map(s => s.de + '→' + s.para).join(', ') + '.');
  return frases.join(' ');
}
const cap = s => s.charAt(0).toUpperCase() + s.slice(1);

const esc = s => String(s).replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;');

/** posição (coluna, fileira na tela) da casa i, considerando o tabuleiro virado */
function naTela(i, virar) {
  const r = i >> 3, c = i & 7;
  return virar ? { x: (7 - c) * LADO, y: (7 - r) * LADO } : { x: c * LADO, y: r * LADO };
}

function seta(de, para, cor, virar) {
  const a = naTela(indiceCasa(de), virar), b = naTela(indiceCasa(para), virar);
  const x1 = a.x + LADO / 2, y1 = a.y + LADO / 2, x2 = b.x + LADO / 2, y2 = b.y + LADO / 2;
  const dx = x2 - x1, dy = y2 - y1, len = Math.hypot(dx, dy);
  const ux = dx / len, uy = dy / len, nx = -uy, ny = ux;
  const haste = 5.5, cabeca = 15, comp = 22;     // meia-largura da haste, meia-largura e comprimento da ponta
  const ini = 8;                                  // afasta o começo do centro da casa de origem
  const fx = x2 - ux * 6, fy = y2 - uy * 6;       // ponta um pouco antes do centro
  const bx = fx - ux * comp, by = fy - uy * comp; // base da ponta
  const sx = x1 + ux * ini, sy = y1 + uy * ini;
  const pts = [
    [sx + nx * haste, sy + ny * haste], [bx + nx * haste, by + ny * haste], [bx + nx * cabeca, by + ny * cabeca],
    [fx, fy], [bx - nx * cabeca, by - ny * cabeca], [bx - nx * haste, by - ny * haste], [sx - nx * haste, sy - ny * haste],
  ].map(([x, y]) => x.toFixed(1) + ',' + y.toFixed(1)).join(' ');
  return `<polygon points="${pts}" fill="${CORES[cor][0]}" fill-opacity="0.82"/>`;
}

/**
 * SVG do tabuleiro. opcoes: { setas: [{de,para,cor}], casas: [{casa,cor}], virar, idioma, rotulo, classe }
 * `rotulo` (aria-label) já pronto; se faltar, sai de descrever().
 */
function svg(estado, opcoes = {}) {
  const virar = !!opcoes.virar;
  const idioma = opcoes.idioma || 'pt';
  const partes = [], coords = [], pecas = [], setas = [];
  for (let i = 0; i < 64; i++) {
    const { x, y } = naTela(i, virar);
    const clara = ((i >> 3) + (i & 7)) % 2 === 0;
    partes.push(`<rect x="${x}" y="${y}" width="${LADO}" height="${LADO}" fill="${clara ? CLARA : ESCURA}"/>`);
  }
  for (const c of opcoes.casas || []) {
    const { x, y } = naTela(indiceCasa(c.casa), virar);
    partes.push(`<rect x="${x}" y="${y}" width="${LADO}" height="${LADO}" fill="${CORES[c.cor][1]}"/>`);
  }
  // coordenadas, como no Lichess: fileiras na coluna da esquerda, colunas na fileira de baixo. Depois dos destaques
  // e com contorno claro: legíveis sobre verde/vermelho/azul/amarelo. 15/480 = 11 px num diagrama de 358 px (D-APR-17)
  for (let k = 0; k < 8; k++) {
    const fileira = virar ? k + 1 : 8 - k;           // de cima para baixo
    const coluna = virar ? 'hgfedcba'[k] : 'abcdefgh'[k];
    const corFileira = k % 2 === 0 ? COORD_CLARA : COORD_ESCURA;   // casa da esquerda na linha k: clara quando k é par
    const corColuna = k % 2 === 0 ? COORD_ESCURA : COORD_CLARA;    // casa de baixo na coluna k: escura quando k é par
    coords.push(`<text x="3" y="${k * LADO + 15}" fill="${corFileira}">${fileira}</text>`);
    coords.push(`<text x="${(k + 1) * LADO - 3}" y="${8 * LADO - 4}" text-anchor="end" fill="${corColuna}">${coluna}</text>`);
  }
  for (let i = 0; i < 64; i++) {
    const p = estado.board[i];
    if (!p) continue;
    const { x, y } = naTela(i, virar);
    const branca = p === p.toUpperCase();
    const g = GLIFO[p.toLowerCase()] + VS15;
    pecas.push(branca
      ? `<text x="${x + LADO / 2}" y="${y + LADO / 2 + 2}" class="pb" fill="#fff" stroke="#1a1a1a" stroke-width="1.6" paint-order="stroke">${g}</text>`
      : `<text x="${x + LADO / 2}" y="${y + LADO / 2 + 2}" class="pp" fill="#1a1a1a" stroke="#1a1a1a" stroke-width="0.6">${g}</text>`);
  }
  for (const s of opcoes.setas || []) setas.push(seta(s.de, s.para, s.cor, virar));
  const rotulo = opcoes.rotulo || descrever(estado, idioma, opcoes);
  return `<svg class="${opcoes.classe || 'tab'}" viewBox="0 0 ${8 * LADO} ${8 * LADO}" role="img" aria-label="${esc(rotulo)}" xmlns="http://www.w3.org/2000/svg">`
    + `<g>${partes.join('')}</g>`
    + `<g font-family="Inter,system-ui,sans-serif" font-size="15" font-weight="700" stroke="${CLARA}" stroke-width="3" stroke-linejoin="round" paint-order="stroke">${coords.join('')}</g>`
    + `<g font-family="${FONTE_PECAS}" font-size="48" text-anchor="middle" dominant-baseline="central">${pecas.join('')}</g>`
    + setas.join('')
    + '</svg>';
}

module.exports = { svg, descrever, corDe, CORES, NOMES, colocacao, INICIAL };
