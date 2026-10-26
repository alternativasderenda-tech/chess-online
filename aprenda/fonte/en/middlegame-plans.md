---
id: planos-meio-jogo
titulo: "Middlegame Plans: How to Make a Plan in Chess"
titulo_seo: Middlegame Plans in Chess | Chess Online
descricao: How to make a middlegame plan: evaluate the position, attack on the wing where you're stronger, control open files, use outposts and the minority attack.
nivel: avancado
ordem: 25
publicado: 2026-10-26
atualizado: 2026-10-26
tags: [chess plan, middlegame, open files, outpost, minority attack, seventh rank, opposite-side castling]
jogar: 3
relacionados: [estrategia-posicional, estrutura-de-peoes, gambito-da-dama-e-london, defesa-siciliana, calculo]
ensina: [How to make a plan, Attacking on the right wing, Open files, Outposts, Minority attack]
---
A middlegame plan is a medium-term goal — attack the king, take over a file, fix a weak pawn, plant a knight on an outpost — chosen from your evaluation of the position. To build one, you identify each side's weaknesses and strengths, decide **which wing to play on** (as a rule, where you already have more space, more pieces or a target) and then regroup your pieces to carry it out. Without a plan, your moves become reactions to your opponent; with one, every move has a job.

## The four steps of a plan {#passos}

1. **Evaluate.** Take inventory of the position: pawn structure, weak squares, good and bad pieces, king safety. (See [positional strategy](artigo:estrategia-posicional).)
2. **Pick a target.** A weak pawn, a square, a file, the king. A concrete target beats "attacking".
3. **Regroup.** Bring your pieces to where the target is. Often that means improving your worst piece first.
4. **Execute and re-evaluate.** Every piece or pawn trade changes the position. A plan isn't a contract: when the structure changes, the plan may change too.

:::dica
**💡 Tip:** write the plan in one sentence before looking for moves: "trade the dark-squared bishops and attack d6", "double rooks on the c-file and invade on c7". If it doesn't fit in one sentence, it probably isn't a plan yet.
:::

## Attack on the wing where you're stronger {#ala}

The most useful rule of middlegame strategy: **play on the wing where you are stronger**. Stronger means more space, more pieces nearby or a fixed target. When the center is closed, the rule becomes even clearer, because pieces can't cross the board quickly, and the game turns into a race between the two sides' attacks.

```tabuleiro
fen: r1bq1rk1/pppn1pbp/3p1np1/3Pp3/2P1P3/2N2N2/PP2BPPP/R1BQ1RK1 b - - 0 9
setas: f6e8:azul f7f5:vermelha c4c5:verde
casas: d5 e4 d6 e5
legenda: King's Indian structure with a closed center: Black prepares ...f5 on the kingside (after moving the f6 knight), and White aims for c4-c5 on the queenside.
```

The pawn chains point the way. Here, Black's d6-e5 chain points to the kingside, and that's where Black attacks, with ...f5. White's d5-e4 chain points to the queenside, and that's where White advances, with c4-c5. Whoever wastes time on the "wrong" wing usually arrives late to the race.

The same goes for [**opposite-side castling**](artigo:defesa-siciliana#dragao): with the kings on different wings, pawns become battering rams. Pushing pawns at the enemy king doesn't weaken your own king, and speed decides. In that kind of attack, a tempo is worth more than a pawn.

## Open files and the seventh rank {#colunas}

Rooks only come alive on open or half-open files. A classic plan has three stages:

1. **Occupy the open file** with a rook.
2. **Double the rooks** (or queen and rook) so the opponent can't contest it.
3. **Invade** the seventh or eighth rank, where rooks attack pawns and confine the king.

Two rooks on the seventh rank are so strong that they often force mate or a perpetual check on their own. The second exercise shows it.

## Outposts and maneuvers {#postos}

An outpost is a square in the enemy camp that no enemy pawn can attack. Planting a knight there, supported by a pawn, is often worth more than a pawn. Very often the whole plan is a **maneuver**: taking a piece, in three or four moves, to its ideal square.

```tabuleiro
fen: r1b2rk1/2q1bppp/p2p1n2/npp1p3/3PP3/2P2N1P/PPBN1PP1/R1BQR1K1 b - - 2 12
setas: d2f1 f1g3
casas: f5 h5
legenda: Closed Ruy Lopez after 12.Nbd2: the white knight follows the route d2-f1-g3, from where it eyes f5 and h5, near Black's castled king.
```

In this Ruy Lopez position, the d2 knight has no future where it stands. The Nd2-f1-g3 (or -e3) maneuver brings it closer to the kingside, where White usually attacks. Three "slow" moves, each with a purpose.

## The minority attack {#minoria}

[The minority attack](artigo:gambito-da-dama-e-london#recusado) is a classic structural plan: advancing **two pawns against three** on the wing where you're in the minority, in order to trade them and leave your opponent with a weak pawn.

```tabuleiro
fen: r1bq1rk1/pp1n1ppp/2p2n2/3p4/1P1P4/2NBPN2/P1Q2PPP/1R3RK1 w - - 0 1
setas: b4b5
casas: c6:vermelha b7 a7
legenda: Queen's Gambit Exchange Variation structure: with b4-b5 White attacks c6. After bxc6 bxc6, the c6 pawn is weak.
```

After b5 and the trade on c6, Black is left with a backward pawn on c6 or an isolated pawn on d5, targets for White's pieces for many moves. It's a slow plan, but a very hard one to neutralize.

## Improve your worst piece and think about your opponent's plan {#pior-peca}

When no big plan suggests itself, there are two paths that almost never fail.

The first is to **improve your worst piece**. Find the piece that does the least: a bishop stuck behind its pawns, a knight on the rim, a rook still sitting in its corner. Bringing it to an active square, even if it takes several moves, improves the whole position, because the pieces start working together.

The second is **prophylaxis**: before carrying out your plan, ask what your opponent's plan is and whether a single move can stop it. Sometimes a pawn advance that takes a square away from an enemy knight, or a rook that occupies the file before theirs does, is worth more than an "active" move.

Both paths have something in common: they don't require deep calculation, just a good reading of the position. That's why they're so useful when the clock is ticking.

## Exercises

```exercicio
fen: 2r3k1/5ppp/p7/1p6/8/P7/1P1R1PPP/3R2K1 w - - 0 1
enunciado: White has doubled rooks on the open d-file. White to play and **mate in 2**.
tipo: mate
lances: 2
solucao: d2d8 c8d8 d1d8
dica: Black's back rank is defended by a single rook.
explicacao: 1.Rd8+! Rxd8 2.Rxd8#. The black rook is forced to capture and the second white rook comes in with mate: the black king has no flight square because its own pawns block f7, g7 and h7.
```

```exercicio
fen: r4rk1/1RR3pp/p7/8/8/8/5PPP/6K1 w - - 0 1
enunciado: Two white rooks on the seventh rank. White to play and **mate in 3**.
tipo: mate
lances: 3
solucao: c7g7 g8h8 g7h7 h8g8 b7g7
dica: Start by taking the g7 pawn with check.
explicacao: 1.Rxg7+ Kh8 (the only move) 2.Rxh7+ Kg8 3.Rbg7#. The rooks protect each other on the seventh rank and the black king has nowhere to go: the f8 rook blocks its only escape.
```

## Frequently asked questions {#faq}

### What is a plan in chess?
A medium-term goal, chosen from your evaluation of the position, that guides your choice of moves: attack the king, take over a file, fix a weak pawn, occupy an outpost.

### Which wing should I attack on?
The wing where you have more space, more pieces or a target. With a closed center, attack in the direction your pawn chain points.

### What is the minority attack?
Advancing two pawns against three on the wing where you are in the minority, to trade them off and leave your opponent with a weak pawn, usually on c6 or d5.

### Why are rooks on the seventh rank so strong?
Because they attack pawns still on their starting squares and trap the king on the back rank. Two rooks on the seventh often force mate or perpetual check.
