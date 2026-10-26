---
id: calculo
titulo: "Calculation in Chess: Candidate Moves and Visualization"
titulo_seo: Chess Calculation and Visualization | Chess Online
descricao: How to calculate variations in chess: pick candidate moves, start with checks, captures and threats, evaluate the final position and train your visualization.
nivel: avancado
ordem: 40
publicado: 2026-10-26
atualizado: 2026-10-26
tags: [chess calculation, candidate moves, visualization, checks captures threats, tree of variations, how to calculate]
jogar: 4
relacionados: [sacrificios, planos-meio-jogo, rotina-de-treino]
ensina: [Candidate moves, Checks captures and threats, Tree of variations, Visualization]
---
Calculating in chess means predicting a sequence of moves in your head — a **variation** — and evaluating the position it leads to, without touching the pieces. Strong players follow a four-step method: list the **candidate moves**, starting with the forcing ones (**checks, captures and threats**); calculate each candidate until the position is quiet; **evaluate** that position; and only then compare and choose. **Visualization** is the skill that supports all of this: seeing the board as it will be, not as it is.

## Candidate moves: what's worth calculating {#candidatos}

A typical middlegame position has 30 to 40 legal moves. Nobody calculates them all. The first step is to choose two to four **candidates**: the moves that deserve a deep look. The idea of listing candidates before calculating, and of organizing calculation as a tree, became famous through Alexander Kotov's book *Think Like a Grandmaster*.

The safest way to avoid missing the decisive move is to look, in this order, for:

1. **Checks.** They restrict your opponent's replies the most.
2. **Captures.** They change the material balance and usually demand an immediate answer.
3. **Threats.** Moves that create a mating threat or threaten to win material.

Make the same list **for your opponent**. Many calculation errors come from one of their checks or captures that you didn't consider.

```tabuleiro
fen: 4rrk1/ppqb1ppp/2n1p3/b2pP3/3P3P/2PB1N2/1P3PP1/R1BQ1RK1 w - - 0 1
setas: d3h7:vermelha f3g5:amarela d1c2:amarela
legenda: Three candidates for White: Bxh7+ (check and capture), Ng5 and Qc2 (threats against h7). The most forcing one comes first.
```

In this position, the most forcing candidate is 1.Bxh7+: it's a check and a capture, and Black has only two replies: 1...Kxh7 or 1...Kh8. Calculating it first, you find that it wins — it's the Greek gift, analyzed in [classic sacrifices](artigo:sacrificios).

## The tree of variations {#arvore}

Each candidate opens a branch, and each reply by your opponent opens smaller branches. Two rules keep the tree from exploding:

- **Calculate each branch only once.** Go to the end of one line, evaluate, and move on to the next. Jumping between branches without finishing any is the fastest way to get lost.
- **Assume your opponent's best reply**, not the one you'd like them to play. If a line only works against a weak move, it doesn't work.

### Where to stop and how to evaluate

Stop when the position is **quiet**: no checks, no pending captures and no immediate threats. Stopping in the middle of an exchange is one of the most common mistakes — the piece you "won" may be recaptured on the next move.

To evaluate the final position, use the usual criteria: material, king safety, piece activity and pawn structure.

## Counting attackers and defenders {#contar}

Before capturing on a contested square, count how many pieces attack it and how many defend it. But counting isn't enough: the **order** and the **value** of the pieces matter.

```tabuleiro
fen: r2q1rk1/p3bppp/4pn2/3p4/8/2N2B2/PPPQ1PPP/3R1RK1 w - - 0 1
setas: c3d5 f3d5 d2d5
casas: d5:vermelha e6 f6 d8
legenda: The d5 pawn is attacked four times (Nc3, Bf3, Qd2 and Rd1, lined up) and defended three times (the e6 pawn, Nf6 and Qd8).
```

Four attackers against three defenders looks like an edge. But the first defender is a pawn: after 1.Nxd5 exd5 2.Bxd5 Nxd5 3.Qxd5 Qxd5 4.Rxd5, White ends up a piece down for two pawns. Defending with cheap pieces and attacking with expensive ones loses the exchange.

## Visualization: seeing what isn't on the board yet {#visualizacao}

Calculation depends on "seeing" where the pieces are three or four moves later. Typical visualization errors are:

- **Ghost pieces:** forgetting that a piece has left its square (so the square is now free) or that a piece has been captured.
- **Lines that open:** when a piece moves out of the way, a rook, bishop or queen behind it starts attacking. That's how discovered checks work.
- **Backward moves:** retreats and sideways moves are the easiest to overlook, both yours and your opponent's.

```tabuleiro
fen: 4rr2/ppqb1ppk/2n1p3/b2pP1N1/3P3P/2P5/1P3PP1/R1BQ1RK1 b - - 1 2
setas: c1h6:amarela d1h5:azul
legenda: Visualization drill: this is the position after 1.Bxh7+ Kxh7 2.Ng5+, starting from the first diagram. Try to rebuild it in your head before looking.
```

:::dica
**💡 Tip:** to train visualization, solve the exercises on this site **without moving the pieces** until you have the whole line in your head. Only then play the solution on the interactive board.
:::

## Calculation in practice: how much time to spend {#pratica}

Calculating costs clock time, and time is limited. A sensible split:

- **Critical positions** (sacrifices, trades that lead to endgames, exposed kings) deserve deep calculation.
- **Quiet positions** call for more evaluation and less calculation: lean on strategic principles and save time for later.
- **Do a final blunder check** before touching a piece: "what are my opponent's checks, captures and threats after my move?". That one question prevents most losing moves.

## Typical calculation errors {#erros}

Almost every calculation error falls into one of these categories:

- **Missing the in-between move.** You calculate an "obvious" exchange, but instead of recapturing your opponent first gives a check or makes a bigger threat. In every line, ask: are they really forced to reply the way I imagine?
- **Stopping too early.** The line ends with you "winning a piece", but a capture or a check is still pending.
- **Calculating only what you want.** Looking at the defense that's convenient for you instead of the strongest one. Flip the board in your mind and look for their best move.
- **Trusting lines that are too long.** The longer the line, the bigger the chance of a visualization slip somewhere in the middle. When a line runs past five or six moves, double-check the first ones.

## Exercises

```exercicio
fen: r2r2k1/pp4pp/2p1b3/q5N1/8/1Q6/PPP3PP/2B2RK1 w - - 0 1
enunciado: Calculate with forcing moves only. White to play and **mate in 4**.
tipo: mate
lances: 4
solucao: b3e6 g8h8 g5f7 h8g8 f7d8 g8h8 e6e8
dica: Start with a capture that gives check. After that, the knight gives checks and opens lines for the queen.
explicacao: 1.Qxe6+ Kh8 2.Nf7+ Kg8 3.Nxd8+ (discovered check from the queen) Kh8 4.Qe8#. Every black reply is forced, and the f1 rook takes f8 away from the king. 3.Nh6+ also leads to mate, but it takes longer.
```

```exercicio
fen: 4kb1r/p2n1ppp/4q3/6B1/1Q6/8/PPP2PPP/3R2K1 w - - 0 1
enunciado: White to play and **mate in 2**. Before moving, list the checks.
tipo: mate
lances: 2
solucao: b4b8 d7b8 d1d8
dica: The d7 knight is the only piece stopping the rook from landing on d8.
explicacao: 1.Qb8+! Nxb8 2.Rd8#. The sacrifice deflects the d7 knight, the rook comes in on the d-file and the g5 bishop protects d8 and covers e7.
```

## Frequently asked questions {#faq}

### How can I calculate better in chess?
List two to four candidates, starting with checks, captures and threats; calculate each one until the position is quiet; evaluate; and only then compare.

### What are candidate moves?
The moves in a position that deserve a deep calculation. Choosing them well saves time and keeps you from missing the decisive move.

### How far should I calculate?
Until the position is quiet, with no checks, pending captures or immediate threats. In critical positions, go deeper; in quiet ones, evaluate more and calculate less.

### How do I train visualization?
Solve exercises without moving the pieces, rebuild positions in your head after a few moves, and gradually increase the number of moves you calculate before checking.
