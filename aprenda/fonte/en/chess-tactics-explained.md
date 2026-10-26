---
id: taticas
titulo: Chess Tactics Explained: the Patterns That Win Games
titulo_seo: Chess Tactics Explained: the Basic Patterns | Chess Online
descricao: What chess tactics are, the patterns every player needs to know (fork, pin, skewer, discovered attack, back-rank mate) and how to practice them.
nivel: intermediario
ordem: 10
publicado: 2026-10-26
atualizado: 2026-10-26
tags: [chess tactics, tactical patterns, fork, pin, skewer, chess puzzles]
jogar: 2
relacionados: [garfo, cravada, calculo, sacrificios, analisar-partidas]
ensina: [Chess tactics, Tactical patterns, Calculation]
---
A **chess tactic** is a short, usually forcing sequence of moves that wins material or delivers [checkmate](artigo:xeque-mate-e-afogamento) by exploiting a concrete weakness in the opponent's position. Tactics rest on a handful of **patterns** that come up again and again: the fork, the pin, the skewer, the discovered attack, deflection and the back-rank mate. Once you learn to recognize them, you start winning pieces and games that used to slip away.

## Tactics vs strategy {#tatica-x-estrategia "Tactics vs strategy"}

**Strategy** answers the question "what do I want to do in this position?": improve a piece, attack a weak pawn, open a file. **Tactics** answer "what can I win right now?". They deal with concrete moves that you calculate from start to finish.

The two go hand in hand. Good strategy creates positions where tactics appear; a well-calculated tactic turns an advantage into material or mate. But for players leaving the beginner stage, tactics matter far more: most games between club players are decided by a piece left hanging or a blow one side did not see.

## The patterns you need to know {#padroes "The patterns"}

| Pattern | The idea in one sentence | Article |
|---|---|---|
| Fork | one piece attacks two at once | [Fork](artigo:garfo) |
| Pin | the attacked piece cannot move because it shields a more valuable one | [Pin](artigo:cravada) |
| Skewer | the valuable front piece moves away and the one behind falls | [Skewer](artigo:espeto) |
| Discovered attack | a piece steps aside and reveals another piece's attack | [Discovered attack](artigo:ataque-descoberto) |
| Deflection and overloading | you attack the defender instead of the target | [Deflection and overloading](artigo:desvio-e-sobrecarga) |
| Back-rank mate | checkmate on the last rank, with the king trapped by its pawns | [Back-rank mate](artigo:mate-do-corredor) |

The order of the table is the suggested study order: each pattern builds on ideas from the previous one.

### Fork

The fork is the double attack: one piece hits two enemy pieces and only one can be saved. The knight is the specialist, but pawns, queens and even the king fork too.

```tabuleiro
fen: 3qk2r/5Npp/8/8/2B5/8/2Q2PPP/6K1 b k - 0 1
setas: f7d8 f7h8
casas: d8 h8
legenda: The f7 knight, protected by the c4 bishop, attacks the queen on d8 and the rook on h8 at the same time.
```

### Pin

In a pin, a long-range piece (bishop, rook or queen) attacks a piece that cannot move, because something [more valuable](artigo:valor-das-pecas) stands behind it. If that is the king, moving the pinned piece is illegal.

```tabuleiro
fen: 4k3/8/2n5/1B6/8/8/5PPP/6K1 w - - 0 1
setas: b5e8:vermelha
casas: c6 e8:vermelha
legenda: The c6 knight is pinned: behind it, on the b5 bishop's diagonal, stands the king on e8.
```

### Skewer

The skewer is a pin in reverse: the front piece is worth more, is forced to move, and the one behind is captured. A skewer with check is the strongest kind.

```tabuleiro
fen: 8/8/R2k3r/8/8/8/5PPP/6K1 b - - 0 1
setas: a6d6:vermelha d6h6
casas: d6:vermelha h6
legenda: The a6 rook checks the king on d6. When the king leaves the sixth rank, the rook takes the rook on h6.
```

### Discovered attack

A piece steps out from in front of another and reveals an attack. If the revealed attack hits the king, it is a discovered check; if the piece that moved also gives check, it is a double check, the most forcing tactic there is.

```tabuleiro
fen: 3q4/5pkp/6p1/8/3N4/8/5PPP/3R2K1 w - - 0 1
setas: d4f5 d1d8:vermelha
casas: d4 d8
legenda: The d4 knight stands in front of the d1 rook. With 1.Nf5+ (or 1.Ne6+) it steps away with check and the rook now attacks the queen on d8: Black deals with the king and loses the queen.
```

### Deflection, decoy and overloading

When the target is well defended, go after the defender: deflect it with a trade or a check, lure the king onto a bad square, or exploit a piece that defends two things at once.

```tabuleiro
fen: 6k1/3q1ppp/8/1b3n2/8/5Q2/5PPP/1R4K1 w - - 0 1
setas: b1b5 f3f5 d7b5:azul d7f5:azul
casas: d7:vermelha
legenda: The d7 queen defends both the bishop on b5 and the knight on f5. After 1.Rxb5 Qxb5 2.Qxf5, White wins material.
```

### Back-rank mate

A king castled behind its three pawns has nowhere to go. A rook or queen on the last rank, with no defender to capture or block it, delivers mate.

```tabuleiro
fen: 3Q2k1/5ppp/8/8/8/8/5PPP/6K1 b - - 0 1
setas: d8g8:vermelha
casas: g8:vermelha
legenda: Qd8#. The g8 king is trapped by its own pawns.
```

## How to spot tactics in your games {#como-enxergar "How to spot tactics"}

Tactics appear when a position has a weak point. The most common signs are:

- **Loose pieces** (undefended). There is a well-known saying: *loose pieces drop off*.
- **An exposed king**, or one with no escape square.
- **Pieces lined up** on the same diagonal, file or rank, ready for pins and skewers.
- **Overloaded pieces**, defending two things at the same time.

Before each move, scan for **checks, captures and threats**: look at every possible check first, then every capture, then the moves that create threats. That is the order in which combinations usually appear, because those are the moves that limit your opponent's replies.

:::dica
**💡 Tip:** run the same scan from your opponent's point of view. Half of tactics is seeing the other side's blow before it lands.
:::

## How to practice tactics {#treinar "How to practice"}

1. **Solve short puzzles every day.** Fifteen minutes a day beats two hours on the weekend.
2. **Study one pattern at a time**, in the order of the table above, and only move on when that pattern's puzzles feel easy.
3. **Calculate before you touch.** In a puzzle, only move a piece once [the whole line is in your head](artigo:calculo), including your opponent's best reply.
4. **Play games** and, after each one, [look for the tactics you and your opponent missed](artigo:analisar-partidas).
5. **Follow a plan.** To fit tactics into a weekly routine with endgames, openings and analysis, see [how to improve at chess](artigo:rotina-de-treino).

If you still drop pieces by accident, review [common beginner mistakes](artigo:erros-de-iniciante) first.

:::pratique Practice tactics now
Play against the computer at Medium level. It makes enough mistakes to leave tactics on the board, and with every game you will spot them faster.
:::

## Puzzles to get started {#exercicios "Puzzles"}

One puzzle each for four of the six patterns; the other two are in [discovered attack](artigo:ataque-descoberto#exercicios) and [deflection and overloading](artigo:desvio-e-sobrecarga#exercicios). Tap (or click) a piece and then its destination square.

```exercicio
fen: 6k1/p2r1p1p/1p4p1/8/4N3/8/PP3PPP/6K1 w - - 0 1
enunciado: White to move **wins the rook** with a fork.
solucao: e4f6 g8g7 f6d7
dica: Find a square where the knight gives check and attacks the d7 rook.
explicacao: 1.Nf6+ checks the king and attacks the rook. The king moves and 2.Nxd7 takes the rook.
```

```exercicio
fen: 4k3/pp3ppp/8/8/4q3/5N2/PP3KPP/R7 w - - 0 1
enunciado: White to move **wins the queen** with a pin.
solucao: a1e1 e4e1 f2e1|f3e1
dica: The queen on e4 and the king on e8 are on the same file.
explicacao: 1.Re1 pins the queen to the king. She cannot leave the file and, if she takes the rook, 2.Kxe1 (or 2.Nxe1) recaptures: queen for rook.
```

```exercicio
fen: q7/5p2/2k3p1/8/8/3B4/5PPP/6K1 w - - 0 1
enunciado: White to move **wins the queen** with a skewer.
solucao: d3e4 c6d6 e4a8
dica: The king on c6 and the queen on a8 are on the same diagonal.
explicacao: 1.Be4+ checks the king along the diagonal. The king moves and 2.Bxa8 takes the queen that was behind it.
```

```exercicio
fen: 6k1/pp3ppp/8/n7/8/8/5PPP/3Q2K1 w - - 0 1
enunciado: White to move gives **mate in 1**.
tipo: mate
lances: 1
solucao: d1d8
dica: Black's king is trapped by its own pawns.
explicacao: 1.Qd8# is a back-rank mate: the queen controls the eighth rank and no black piece can block or capture.
```

## Frequently asked questions {#faq "FAQ"}

### What is the difference between tactics and strategy in chess?

Strategy sets the long-term plans; tactics are the short, concrete sequences of moves that win material or deliver mate. Strategy builds the position, tactics cash in.

### Which tactic should I learn first?

The fork, because it is the most frequent pattern. Then the pin and the skewer, which are related, followed by the discovered attack, deflection and the back-rank mate.

### How many tactics puzzles should I do per day?

There is no magic number. What works is consistency: a few puzzles a day, solved calmly while calculating the whole line, are worth more than many solved by guessing.

### Are tactics only for advanced players?

No. Simple tactics such as the knight fork and the back-rank mate decide games from the very first month. The sooner you learn the patterns, the sooner you start winning material.
