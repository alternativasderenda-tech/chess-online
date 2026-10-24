'use strict';
// Testes do motor no servidor: node servidor/motor/teste.js
const assert = require('node:assert/strict');
const { execFileSync } = require('node:child_process');
const path = require('node:path');
const X = require('./xadrez');
const M = X.M;

let falhas = 0;
function caso(nome, fn) {
  const t0 = Date.now();
  try { fn(); console.log(`ok   ${nome} (${Date.now() - t0} ms)`); }
  catch (e) { falhas++; console.log(`FALHA ${nome}: ${e.message}`); }
}

caso('motor-gerado.js em dia com o index.html', () => {
  execFileSync(process.execPath, [path.join(__dirname, 'extrair.js'), '--conferir'], { stdio: 'pipe' });
});
caso('regra de escolha da IA (getBestMove) igual à replicada em xadrez.js', () => {
  assert.equal(M.GETBESTMOVE_SHA, X.GETBESTMOVE_CONFERIDO, 'getBestMove mudou no site: revise candidatosIA/MARGEM_IA');
});

function deFen(fen) {
  const [pos, vez, roque, ep] = fen.split(' ');
  const board = new Array(64).fill(null);
  let i = 0;
  for (const ch of pos) { if (ch === '/') continue; if (ch >= '1' && ch <= '8') i += Number(ch); else board[i++] = ch; }
  const epSq = ep === '-' ? -1 : (8 - Number(ep[1])) * 8 + (ep.charCodeAt(0) - 97);
  return { board, turn: vez, castling: { K: roque.includes('K'), Q: roque.includes('Q'), k: roque.includes('k'), q: roque.includes('q') }, ep: epSq, half: 0, full: 1 };
}
function perft(e, d) {
  if (d === 0) return 1;
  let n = 0;
  for (const m of X.legais(e)) n += perft(X.jogar(e, m), d - 1);
  return n;
}
caso('perft da posição inicial (20 / 400 / 8.902 / 197.281)', () => {
  const e = X.inicial();
  assert.deepEqual([1, 2, 3, 4].map(d => perft(e, d)), [20, 400, 8902, 197281]);
});
caso('perft Kiwipete (48 / 2.039 / 97.862) — roque, en passant, promoção, cravadas', () => {
  const e = deFen('r3k2r/p1ppqpb1/bn2pnp1/3PN3/1p2P3/2N2Q1p/PPPBBPPP/R3K2R w KQkq -');
  assert.deepEqual([1, 2, 3].map(d => perft(e, d)), [48, 2039, 97862]);
});
caso('perft posição 3 (14 / 191 / 2.812 / 43.238) — en passant com cravada', () => {
  const e = deFen('8/2p5/3p4/KP5r/1R3p1k/8/4P1P1/8 w - -');
  assert.deepEqual([1, 2, 3, 4].map(d => perft(e, d)), [14, 191, 2812, 43238]);
});

// partida simulada: "jogador" = melhor lance a profundidade 3; IA = candidato sorteado a profundidade 1 (como o site)
function simular(semente, dif = 1) {
  let s = semente;
  const rnd = () => { s = (s * 1103515245 + 12345) & 0x7fffffff; return s / 0x7fffffff; };
  let e = X.inicial();
  const lances = [];
  const t0 = Date.parse('2026-10-24T12:00:00Z');
  for (let ply = 0; ply < 160 && !X.fim(e); ply++) {
    const daIA = e.turn === 'b';
    const c = daIA ? X.candidatosIA(e, dif) : X.candidatosIA(e, 3);
    const m = c[Math.floor(rnd() * c.length)];
    lances.push({ from_sq: m.from, to_sq: m.to, promotion: m.promo || null, is_ai_move: daIA, created_at: new Date(t0 + ply * 7000).toISOString() });
    e = X.jogar(e, m);
  }
  return { lances, fim: X.fim(e) };
}
let vitoria = null;
caso('acha uma vitória do jogador contra a IA fácil em partida simulada', () => {
  for (let sem = 1; sem < 40 && !vitoria; sem++) {
    const r = simular(sem);
    if (r.fim && r.fim.tipo === 'mate' && r.fim.vencedor === 'w') vitoria = r.lances;
  }
  assert.ok(vitoria, 'nenhuma das 39 simulações terminou em vitória das Brancas');
});
caso('vitória legítima é aceita, com o tempo do jogador pelos horários', () => {
  const r = X.conferirPartidaIA(vitoria, 1);
  assert.equal(r.ok, true, JSON.stringify(r));
  assert.equal(r.corJogador, 'w');
  assert.ok(r.segundosJogador > 0);
});
caso('fraude: 1 lance só', () => { assert.equal(X.conferirPartidaIA(vitoria.slice(0, 1), 1).ok, false); });
caso('fraude: partida cortada antes do mate', () => {
  assert.equal(X.conferirPartidaIA(vitoria.slice(0, -2), 1).motivo, 'nao_terminou');
});
caso('fraude: lance ilegal no meio', () => {
  const l = vitoria.map(x => ({ ...x })); l[2] = { ...l[2], to_sq: 0 };
  assert.match(X.conferirPartidaIA(l, 1).motivo, /ilegal|impossivel/);
});
caso('fraude: IA "erra de propósito" (lance legal fora dos candidatos)', () => {
  // na abertura a IA fácil (margem 80) aceita quase tudo: procura o 1º lance da IA em que existe lance legal proibido
  let e = X.inicial();
  for (let i = 0; i < vitoria.length; i++) {
    const l = vitoria[i];
    if (l.is_ai_move) {
      const ruim = X.legais(e).find(m => !X.candidatosIA(e, 1).some(c => X.igual(c, m)));
      if (ruim) {
        const forjada = [...vitoria.slice(0, i), { ...l, from_sq: ruim.from, to_sq: ruim.to, promotion: ruim.promo || null }, ...vitoria.slice(i + 1)];
        assert.deepEqual([X.conferirPartidaIA(forjada, 1).motivo, X.conferirPartidaIA(forjada, 1).lance], ['lance_da_ia_impossivel', i + 1]);
        return;
      }
    }
    e = X.jogar(e, { from: l.from_sq, to: l.to_sq, promo: l.promotion || undefined });
  }
  assert.fail('nenhuma posição da partida com lance proibido para a IA');
});
caso('fraude: dificuldade declarada maior que a jogada (Expert com a IA fácil)', () => {
  assert.equal(X.conferirPartidaIA(vitoria, 4).ok, false);
});
caso('fraude: lance da IA marcado como do jogador', () => {
  const l = vitoria.map(x => ({ ...x })); l[1] = { ...l[1], is_ai_move: false };
  assert.equal(X.conferirPartidaIA(l, 1).motivo, 'alternancia');
});

caso('conferência rápida da IA dá o MESMO veredito que os candidatos do site (todas as jogadas, 4 níveis, 60 posições)', () => {
  let s2 = 7; const rnd = () => { s2 = (s2 * 1103515245 + 12345) & 0x7fffffff; return s2 / 0x7fffffff; };
  let difs = 0, n = 0;
  for (let jogo = 0; jogo < 6; jogo++) {
    let e = X.inicial();
    for (let ply = 0; ply < 40 && !X.fim(e); ply++) {
      const leg = X.legais(e);
      if (ply % 4 === 3) {
        const dif = 1 + (jogo % 3);                       // 1..3 (o 4 é caro demais para a suíte; coberto abaixo)
        const cand = X.candidatosIA(e, dif);
        for (const m of leg) { n++; if (X.lanceDaIAValido(e, dif, m) !== cand.some(c => X.igual(c, m))) difs++; }
      }
      e = X.jogar(e, leg[Math.floor(rnd() * leg.length)]);
    }
  }
  assert.equal(difs, 0, `${difs} de ${n} lances com veredito diferente`);
});
caso('conferência rápida = candidatos também no Expert (2 posições de meio-jogo) e é mais barata', () => {
  let e = X.inicial();
  for (const [f, t] of [[52, 36], [12, 28], [62, 45], [1, 18], [61, 34], [6, 21]]) e = X.jogar(e, { from: f, to: t });
  const t0 = Date.now(); const cand = X.candidatosIA(e, 4); const tCand = Date.now() - t0;
  const t1 = Date.now(); let difs = 0;
  for (const m of X.legais(e)) if (X.lanceDaIAValido(e, 4, m) !== cand.some(c => X.igual(c, m))) difs++;
  const tRap = (Date.now() - t1) / X.legais(e).length;
  assert.equal(difs, 0);
  console.log(`      Expert: candidatos ${tCand} ms; conferência rápida ${tRap.toFixed(0)} ms por lance`);
});
console.log(falhas ? `\n${falhas} FALHA(S)` : '\ntudo ok');
process.exit(falhas ? 1 : 0);
