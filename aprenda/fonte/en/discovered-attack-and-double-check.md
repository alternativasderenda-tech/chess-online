---
id: ataque-descoberto
titulo: Discovered Attack and Double Check in Chess
titulo_seo: Discovered Attack and Double Check | Chess Online
descricao: What a discovered attack, a discovered check and a double check are in chess, why double check is the most forcing tactic, plus 4 interactive puzzles.
nivel: intermediario
ordem: 30
publicado: 2026-10-26
atualizado: 2026-10-26
tags: [discovered attack, discovered check, double check, chess tactics, battery]
jogar: 2
relacionados: [taticas, garfo, desvio-e-sobrecarga, sacrificios, calculo]
ensina: [Discovered attack, Discovered check, Double check]
---
A **discovered attack** happens when a piece moves and, by stepping out of the way, opens the line of another long-range piece (bishop, rook or queen) standing behind it. If the opened line hits the king, it is a **discovered check**. If the piece that moved gives check as well, the king is attacked twice at once: that is a **double check**, the most forcing tactic in chess.

## How a discovered attack works {#como-funciona "How it works"}

A discovered attack needs two pieces of the same colour lined up with a target:

1. a long-range **back piece**, aimed at the target;
2. a **front piece**, which blocks that line and is about to move.

The secret is that the front piece's move creates **two threats at once**: the one revealed by the back piece, and whatever the front piece does itself (capture, check, attack something else). Your opponent can only deal with one of them.

```tabuleiro
fen: 3q2k1/5ppp/8/8/8/3B4/5PPP/3R2K1 w - - 0 1
setas: d3h7 d1d8:vermelha
casas: d8:vermelha
legenda: The d3 bishop stands in front of the d1 rook. If it leaves with 1.Bxh7+, the rook now attacks the queen on d8, and Black has to deal with the check first.
```

## Discovered check {#xeque-descoberto "Discovered check"}

When the back piece is aimed at the **king**, any move of the front piece gives check. That brings huge freedom: the front piece can capture something defended, land on an attacked square or grab a piece far away, because your opponent must answer the check before anything else.

```tabuleiro
fen: r3k3/8/8/8/4B3/8/5PPP/4R1K1 w - - 0 1
setas: e4a8 e1e8:vermelha
casas: e8:vermelha a8
legenda: With 1.Bxa8+, the bishop takes the a8 rook and opens the e-file: the e1 rook gives a discovered check.
```

## Double check {#xeque-duplo "Double check"}

In a double check, the piece that moves **also** gives check. The king is attacked by two pieces at once, and that changes the rules for the defender:

- you cannot **capture** both attackers with one move;
- you cannot **block** two lines with one piece;
- the only defence is to **move the king**.

That is why double check is so dangerous: if the king has no free square, it is mate, even when the checking pieces are hanging.

```tabuleiro
fen: 4k3/8/5N2/8/8/8/5PPP/4R1K1 b - - 0 1
setas: e1e8:vermelha f6e8:vermelha
casas: e8:vermelha
legenda: After Nf6+, the king on e8 is in check from the rook and the knight at the same time. Only the king can move.
```

## Batteries: setting up the blow {#baterias "Batteries"}

When two pieces of the same colour are lined up on the same line, they form a **battery**. A battery with one of your own pieces in front is a discovered attack waiting to happen. In practice:

- **A rook or queen behind a knight or bishop**, aimed at the enemy king or queen, is the most common setup.
- **A bishop behind a knight** on a long diagonal (for example, bishop on b2 and knight on e5, aimed at h8) produces very strong discovered and double checks.
- Watch for your **opponent's batteries** too: their front piece can step aside at any moment.

:::dica
**💡 Tip:** when a discovered check is available, do not rush. Ask "what is the strongest move for the front piece?". Often it can take the queen, give a second check or grab something on the other side of the board.
:::

## The windmill {#moinho "The windmill"}

The most spectacular use of discovered check is the **windmill**. It happens when a rook and a bishop (or queen) take turns checking a cornered king:

1. the rook gives a direct check and the king has only one square;
2. the king steps to that square, which lies on the bishop's line;
3. the rook moves away capturing a piece, with a **discovered check** from the bishop;
4. the king goes back to its previous square, and the rook returns with a direct check.

On every turn of the windmill the rook eats a piece, and the defender can do nothing but shuffle the king back and forth. The typical picture is Black's king between g8 and h8, a white bishop on the long diagonal and a white rook on the seventh rank. When you see it, [count how many pieces the rook can collect](artigo:calculo) before it stops.

## Common mistakes {#erros "Common mistakes"}

- **Cashing in the discovered check too early.** The front piece only gets one chance to move with check. If it wins nothing, your opponent gets out of check and the battery is gone.
- **Forgetting the front piece.** Many players only look at the revealed threat. Sometimes the best move is for the front piece to take the enemy queen while the opponent deals with the check.
- **Ignoring your opponent's battery** just because one of their pieces is in the middle of the line.

## How to defend {#defesa "How to defend"}

- **Watch the lines aimed at your king and queen**, even when an enemy piece is in the way: that piece can step aside on any move.
- **Break the battery** by attacking or trading the front piece before it moves.
- **Give your king escape squares.** Against a double check, having somewhere to go is the only defence.

:::pratique Practise discovered attacks now
Play against the computer and try to build batteries with rook and bishop. At Medium level it does not always notice the piece about to step aside.
:::

## Discovered attack puzzles {#exercicios "Puzzles"}

```exercicio
fen: rnbqkb1r/pppp2pp/8/8/4N3/8/PPPP1PPP/R1B1R1K1 w - - 0 1
enunciado: White to move gives **mate in 1** with a double check.
tipo: mate
lances: 1
solucao: e4d6
dica: If the knight leaves e4, the e1 rook gives check. Where should it go to give check as well?
explicacao: 1.Nd6# is a double check: the rook attacks along the e-file and the knight attacks from d6. The king has no square: d8 and f8 are occupied, d7 holds a pawn, e7 is covered by the rook and f7 by the knight.
```

```exercicio
fen: r4rk1/pp3ppp/2pqbn2/8/8/2NB4/PPP2PPP/R2Q1RK1 w - - 0 1
enunciado: White to move **wins the queen** with a discovered attack.
solucao: d3h7 g8h7 d1d6
dica: The two queens are on the same file, with your bishop in between.
explicacao: 1.Bxh7+ grabs a pawn with check and opens the d-file. Black must deal with the king (1...Kxh7, or 1...Nxh7) and 2.Qxd6 takes the queen.
```

```exercicio
fen: r2q1r1k/pp5p/2p3p1/4N3/8/8/PBP2PPP/R4RK1 w - - 0 1
enunciado: White to move gives **mate in 2**. The b2 bishop is already aimed at the king.
tipo: mate
lances: 2
solucao: e5f7 h8g8 f7h6
dica: One knight move gives double check. Then the knight closes the net itself.
explicacao: 1.Nf7+ is a double check (the b2 bishop and the f7 knight): the king only has g8. Then 2.Nh6# — the knight gives check, the bishop covers g7 and h8, the knight covers f7 and the other squares are occupied.
```

```exercicio
fen: rnb1kb1r/pp3ppp/2p5/4q3/4n3/3Q4/PPPB1PPP/2KR1BNR w kq - 0 9
enunciado: One of the most famous miniatures in history (Réti vs Tartakower, Vienna, 1910). White to move gives **mate in 3**.
tipo: mate
lances: 3
solucao: d3d8 e8d8 d2g5 d8c7 g5d8
dica: The d1 rook and the d2 bishop form a battery. For it to fire, Black's king has to be on d8.
explicacao: 9.Qd8+!! Kxd8 (forced) 10.Bg5+ is a double check: the g5 bishop and the d1 rook. If 10...Ke8, 11.Rd8#. The game went 10...Kc7 11.Bd8#.
```

## Frequently asked questions {#faq "FAQ"}

### What is the difference between a discovered attack and a discovered check?

A discovered attack is any attack revealed when a piece steps out from in front of another. If the revealed target is the king, it is called a discovered check.

### Why is double check so strong?

Because the only defence is to move the king. You cannot capture or block two attackers with one move, so a double check works even when the checking pieces are undefended.

### Which pieces can make a discovered attack?

The back piece must be a long-range one: bishop, rook or queen. The front piece can be anything, even a pawn or the king.

### How do I practise?

Solve puzzles and, in your games, look for lines aimed at the enemy king or queen with one of your own pieces in the way. The big picture is in [chess tactics explained](artigo:taticas).
