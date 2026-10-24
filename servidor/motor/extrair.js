'use strict';
/**
 * Extrai o motor de xadrez do index.html para o servidor (D-TRN-02): o MESMO código que o navegador roda — gerador de
 * lances, xeque, makeMove, avaliação, minimax — copiado sem reescrever, para o servidor conferir lances e a escolha da
 * IA com as mesmas regras. Gera servidor/motor/motor-gerado.js. O teste `node servidor/motor/teste.js` falha se o
 * index.html mudar e o gerado ficar velho, ou se a regra de escolha da IA (getBestMove) mudar sem atualizar xadrez.js.
 *
 *   node servidor/motor/extrair.js            → (re)gera
 *   node servidor/motor/extrair.js --conferir → só confere (sai 1 se estiver velho)
 */
const fs = require('node:fs');
const path = require('node:path');
const crypto = require('node:crypto');

const RAIZ = path.join(__dirname, '..', '..');
const SAIDA = path.join(__dirname, 'motor-gerado.js');

/** trecho entre a 1ª linha que começa com `inicio` e a linha anterior à que começa com `fim` */
function trecho(linhas, inicio, fim) {
  const i = linhas.findIndex(l => l.startsWith(inicio));
  if (i < 0) throw new Error('não achei: ' + inicio);
  const j = linhas.findIndex((l, k) => k > i && l.startsWith(fim));
  if (j < 0) throw new Error('não achei o fim: ' + fim);
  return linhas.slice(i, j).join('\n').trimEnd();
}

function gerar() {
  const html = fs.readFileSync(path.join(RAIZ, 'index.html'), 'utf8').replace(/\r\n/g, '\n');
  const linhas = html.split('\n');
  const partes = [
    trecho(linhas, 'const PIECE_VALUES', 'let board = [];'),
    trecho(linhas, 'function isWhite(p)', 'function generateMoves('),
    trecho(linhas, 'function generateMoves(', 'function getLegalMoves('),
    trecho(linhas, 'function evaluate(', 'function getBestMove('),
  ];
  const melhor = trecho(linhas, 'function getBestMove(', '// ======================== GAME LOGIC');
  const impressao = crypto.createHash('sha256').update(melhor).digest('hex').slice(0, 16);
  return [
    '// GERADO por servidor/motor/extrair.js a partir do index.html — NÃO EDITAR À MÃO.',
    `// getBestMove do site (regra de escolha da IA) = ${impressao}; xadrez.js replica essa regra.`,
    "'use strict';",
    ...partes,
    `const GETBESTMOVE_SHA = '${impressao}';`,
    'module.exports = { PIECE_VALUES, PST, isWhite, isBlack, colorOf, row, col, sq, inBounds, generateMoves, isAttacked,',
    '  findKing, inCheck, makeMove, evaluate, orderMoves, minimax, GETBESTMOVE_SHA };',
    '',
  ].join('\n');
}

const novo = gerar();
if (process.argv.includes('--conferir')) {
  const atual = fs.existsSync(SAIDA) ? fs.readFileSync(SAIDA, 'utf8').replace(/\r\n/g, '\n') : '';
  if (atual !== novo) { console.error('motor-gerado.js está desatualizado em relação ao index.html: rode node servidor/motor/extrair.js'); process.exit(1); }
  console.log('motor-gerado.js em dia com o index.html');
} else {
  fs.writeFileSync(SAIDA, novo);
  console.log('gerado', SAIDA, novo.split('\n').length, 'linhas');
}
