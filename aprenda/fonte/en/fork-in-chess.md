---
id: garfo
titulo: Fork in Chess: the Double Attack That Wins Material
titulo_seo: Fork in Chess: What It Is and How to Use It | Chess Online
descricao: What a fork is in chess, why the knight is the king of forks, pawn and queen forks, plus 4 interactive puzzles to practice the double attack.
nivel: intermediario
ordem: 15
publicado: 2026-10-26
atualizado: 2026-10-26
tags: [fork, chess fork, double attack, knight fork, pawn fork, chess tactics]
jogar: 2
relacionados: [taticas, movimento-do-cavalo, cravada, desvio-e-sobrecarga, valor-das-pecas]
ensina: [Fork, Double attack, Royal fork]
---
A **fork** is a move in which a single piece attacks two (or more) enemy pieces at the same time. Your opponent can only rescue one of them per move, so the other one is left to be captured. It is the most common tactical pattern in chess and, for players who are starting to win games, the most profitable one to learn.

## What is a fork {#o-que-e "What is a fork"}

Every fork has the same three ingredients:

1. **An attacking piece** that lands on a square from which it sees two targets.
2. **Two targets** that cannot both be protected with a single move.
3. **A safe forking square**: if the forking piece can simply be captured for free, the fork is worthless.

You will also hear the term **double attack**. The difference is small: "fork" usually describes one piece hitting two others, while "double attack" is the general name for any move that creates two threats at once, including a mate threat combined with an attack on a piece.

When one of the targets is the **king**, the fork becomes even stronger. Your opponent has to get out of check first and has no time to save the other piece. A fork that hits king and queen together is called a **royal fork**.

## The knight, king of forks {#cavalo "The knight, king of forks"}

Any piece can fork, but the knight is the specialist, for two reasons:

- **It jumps.** Nothing standing in between can block the attack.
- **Nobody hits back.** A piece attacked by a knight never attacks that knight in return, unless it is another knight. A queen forked by your knight cannot just take it.

```tabuleiro
fen: 4k3/1b3ppp/3N4/8/8/8/5PPP/6K1 b - - 0 1
setas: d6e8:vermelha d6b7
casas: e8:vermelha b7
legenda: The knight on d6 checks the king on e8 and attacks the bishop on b7. The king steps out of check and the bishop falls.
```

A geometry tip that makes knight forks easier to spot: **every square a knight attacks is the same color** (the opposite color of the square it stands on). So whenever your opponent's king and queen sit on squares of the same color, it is worth looking for a knight square that reaches both.

To review the L-shaped move, see [how the knight moves](artigo:movimento-do-cavalo#garfo).

## Pawn forks {#peao "Pawn forks"}

The pawn is [the cheapest unit on the board](artigo:valor-das-pecas), which makes a pawn fork devastating: any piece it attacks is worth more than the pawn. A pawn that steps forward and hits two pieces diagonally usually wins one of them, even if the pawn is captured afterwards.

```tabuleiro
fen: 6k1/ppp2ppp/3b1n2/4P3/3P4/8/PPP2PPP/6K1 b - - 0 1
setas: e5d6 e5f6
casas: d6 f6
legenda: The e5 pawn, protected by the d4 pawn, attacks the bishop on d6 and the knight on f6. One of them is lost.
```

Notice the classic setup: two enemy pieces side by side, one square apart, in front of a pawn that can advance. A bishop and knight developed to d6 and f6 (or c6 and e6) are frequent victims.

## Queen, bishop and rook forks {#outras-pecas "Queen, bishop and rook forks"}

The **queen** forks in eight directions, so she shows up in plenty of double attacks, especially with check. The catch is her value: if one of the targets is defended and can capture her, the fork backfires.

```tabuleiro
fen: 4k2r/p4ppp/8/8/Q6n/8/P4PPP/6K1 b k - 0 1
setas: a4e8:vermelha a4h4
casas: e8:vermelha h4
legenda: Qa4+ checks along the diagonal and hits the h4 knight along the rank. No black piece can block on b5, c6 or d7: once the king moves, the queen takes the knight.
```

Watch out: if the target on the rank were a rook, it would simply take the queen. Before forking with your queen, check that neither target can capture her.

The **bishop** forks along diagonals (for example king and rook on the same long diagonal), and the **rook** forks along ranks and files, which is very common in endgames when it hits two pawns or a king and a loose piece. Even the **king** forks in the endgame, when it reaches two undefended pieces.

## How to find forks in your games {#como-encontrar "How to find forks"}

Forks do not appear out of nowhere: they grow out of **loose** (undefended) pieces and **badly placed** ones. Before each move, run this quick checklist:

1. **Which enemy pieces are undefended?** They are the natural targets.
2. **Are the king and queen lined up, or on the same square color?** Look for a knight square, a diagonal or a rank that reaches both.
3. **Can one of my pieces reach a square that hits two targets?** Check that the square is safe.
4. **Can I force a piece onto a forking square?** Sometimes a sacrifice with check drags the king exactly where you want it (see [deflection and decoy](artigo:desvio-e-sobrecarga)).

:::dica
**💡 Tip:** forks matter on defense too. Before you move, ask "where can their knight jump next?". Many forks could have been avoided with that one question.
:::

## How to defend against a fork {#defesa "How to defend"}

- **Prevent it:** do not leave your king and queen a knight's jump away from the same square, and avoid loose pieces.
- **Counter with a check:** if the fork has already landed, look for a check or a bigger threat before giving up the piece.
- **Save the more valuable piece** and, if possible, make your opponent pay something for the other one.

:::pratique Practice forks now
Play against the computer and try to land at least one fork per game. At Medium level it leaves pieces loose often enough for you to practice.
:::

## Fork puzzles {#exercicios "Puzzles"}

Tap (or click) a piece and then its destination square. The puzzles go from easier to harder.

```exercicio
fen: 5rk1/pp3ppp/2q5/3N4/8/8/PP3PPP/3R2K1 w - - 0 1
enunciado: White to move **wins the queen** with a knight fork.
solucao: d5e7 g8h8 e7c6
dica: Find a square where the knight gives check and attacks the queen at the same time.
explicacao: 1.Ne7+ is a royal fork: check to the king on g8 and an attack on the queen on c6. The king only has h8, and the knight takes the queen.
```

```exercicio
fen: r5k1/p1q3p1/7p/8/8/8/PP1Q2PP/5RK1 w - - 0 1
enunciado: White to move **wins the rook** with a queen double attack.
solucao: d2d5 g8h7 d5a8
dica: The king on g8 and the rook on a8 sit at the ends of two diagonals that cross in the center of the board.
explicacao: 1.Qd5+ checks along the d5–g8 diagonal and attacks the a8 rook along the d5–a8 diagonal. Once the king moves, 2.Qxa8.
```

```exercicio
fen: 6k1/ppp2ppp/8/2r1n3/8/2PP4/1P2BPPP/5RK1 w - - 0 1
enunciado: White to move **wins a piece** with a pawn fork.
solucao: d3d4 c5d5 d4e5
dica: The rook and knight stand side by side on the 5th rank, one square apart.
explicacao: 1.d4 attacks the rook on c5 and the knight on e5. Black's best is to save the rook with tempo (1...Rd5, hitting the pawn), but after 2.dxe5 Rxe5 White is a piece up for a pawn.
```

```exercicio
fen: r1bq2k1/ppp2pp1/3p4/6N1/8/8/PPP3P1/1KBR3R w - - 0 1
enunciado: White to move **wins the queen**. First, bring the king to the right square.
solucao: h1h8 g8h8 g5f7 h8g8 f7d8
dica: A rook sacrifice with check forces the king to h8. Which fork appears then?
explicacao: 1.Rh8+! Kxh8 (forced) 2.Nxf7+ forks the king on h8 and the queen on d8. After 2...Kg8 3.Nxd8, White has traded a rook for queen and pawn.
```

## Frequently asked questions {#faq "FAQ"}

### Are a fork and a double attack the same thing?

Almost. Every fork is a double attack, but "double attack" also covers moves with two threats coming from different sources, such as a mate threat combined with an attack on the queen.

### Which piece forks the most?

The knight, because it jumps and because no piece it attacks can hit back, except another knight. The queen and the pawn come next.

### What is a royal fork?

A fork that attacks the king and the queen at the same time. Since the king must get out of check, the queen is almost always lost.

### How do I practice forks?

Solve short puzzles every day and, in your own games, ask before each move which enemy pieces are loose. Then move on to the [pin](artigo:cravada), the next pattern in the course.
