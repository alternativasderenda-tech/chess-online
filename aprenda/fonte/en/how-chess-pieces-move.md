---
id: como-as-pecas-se-movem
titulo: How Chess Pieces Move
titulo_seo: "How Chess Pieces Move: A Beginner's Guide | Chess Online"
descricao: How each chess piece moves — king, queen, rook, bishop, knight and pawn — and how each one captures, with diagrams and exercises for beginners.
nivel: iniciante
ordem: 15
publicado: 2026-10-26
atualizado: 2026-10-26
tags: [how chess pieces move, chess piece movement, how does the bishop move, how does the rook move, how pawns capture]
jogar: 1
relacionados: [tabuleiro-e-notacao, movimento-do-cavalo, valor-das-pecas, lances-especiais]
ensina: [King movement, Queen movement, Rook movement, Bishop movement, Pawn movement]
---
In chess, each of the six pieces moves in its own way: the **rook** moves in straight lines (files and ranks), the **bishop** moves along diagonals, the **queen** combines both, the **king** moves one square in any direction, the **knight** jumps in an "L" shape, and the **pawn** moves forward and captures diagonally. Every piece except the knight stops when another piece is in the way, and every piece captures by landing on the enemy piece's square.

## Rules that apply to every piece {#geral "Rules for every piece"}

Before going piece by piece, three general rules:

- **Capturing means taking the square.** A piece captures an enemy piece by moving onto its square; the captured piece leaves the board. Nobody jumps over a piece to capture it, as in checkers.
- **No jumping over pieces.** Rooks, bishops, queens, kings and pawns can't pass through other pieces. Only the knight jumps.
- **You can't capture your own pieces**, and no move may leave your own king in check (under attack).

Each player starts with 16 pieces: 1 king, 1 queen, 2 rooks, 2 bishops, 2 knights and 8 pawns. If you're not sure where each one goes, see [the chessboard and notation](artigo:tabuleiro-e-notacao).

## The rook {#torre "The rook"}

The **rook** moves any number of squares in a straight line — forward, backward or sideways — always along the file or rank it stands on. In the middle of an empty board it reaches 14 squares.

```tabuleiro
fen: k7/8/8/8/3R4/8/8/7K w - - 0 1
setas: d4d8 d4d1 d4a4 d4h4
legenda: The rook on d4 controls the whole d-file and the whole 4th rank.
```

Rooks love open files (files with no pawns) and are essential in the endgame. They also take part in castling, a special move with the king.

## The bishop {#bispo "The bishop"}

The **bishop** moves any number of squares diagonally. That's why it never changes color: a bishop that starts on a light square spends the whole game on light squares. Each player has one light-squared and one dark-squared bishop.

```tabuleiro
fen: k7/8/8/8/3B4/8/8/7K w - - 0 1
setas: d4a7 d4h8 d4a1 d4g1
legenda: The bishop on d4 controls both diagonals that run through it (13 squares).
```

## The queen {#dama "The queen"}

The **queen** is the most powerful piece: she moves like a rook **and** like a bishop, any number of squares in a straight line or diagonally. From the center of an empty board she reaches 27 squares.

```tabuleiro
fen: k7/8/8/8/3Q4/8/8/7K w - - 0 1
setas: d4d8 d4d1 d4a4 d4h4 d4a7 d4h8 d4a1 d4g1
legenda: The queen on d4 adds the rook's lines to the bishop's diagonals.
```

:::aviso
**⚠️ Watch out:** because she's so valuable, the queen shouldn't come out too early. She becomes a target, and your opponent gains time by attacking her while developing their own pieces.
:::

## The king {#rei "The king"}

The **king** moves **one square** in any direction. He's the most important piece: if he's attacked and has no way out, it's checkmate and the game is over. That's why the king can **never** move to a square the opponent attacks, and the two kings can never stand on neighboring squares.

```tabuleiro
fen: k7/8/8/8/3K4/8/8/8 w - - 0 1
casas: c5 d5 e5 c4 e4 c3 d3 e3
legenda: The king on d4 can move to any of the 8 neighboring squares.
```

The king also castles together with a rook (see the [special moves](artigo:lances-especiais)).

## The knight {#cavalo "The knight"}

The **knight** moves in an "L": two squares in one direction and then one to the side. It's the only piece that **jumps** over others, which is why it can move on the very first turn. It has its own lesson: [how the knight moves](artigo:movimento-do-cavalo).

## The pawn {#peao "The pawn"}

The **pawn** is the simplest piece and the one with the most fine print:

- **It only moves forward**, one square at a time. It never goes back.
- **On its first move**, it may advance one or two squares.
- **It captures diagonally**, one square ahead. It's the only piece that captures differently from the way it moves.
- **It's blocked** by any piece directly in front of it — friend or foe.

```tabuleiro
fen: k7/8/8/3p1n2/4P3/8/3P4/7K w - - 0 1
setas: e4d5:vermelha e4f5:vermelha d2d4
legenda: The pawn on e4 can capture on d5 or f5 (red arrows). The d2-pawn hasn't moved yet, so it can advance one or two squares.
```

When a pawn reaches the last rank it's **promoted**: it becomes a queen, rook, bishop or knight, the player's choice. There's also the *en passant* capture. Both rules are covered in [the special moves](artigo:lances-especiais).

## Attacking and defending {#atacar-defender "Attacking and defending"}

Two words come up all the time in chess:

- A piece **attacks** a square (or an enemy piece) when it could move there on its next turn. The rook on d4 in the first diagram attacks every square on the d-file and the 4th rank.
- A piece is **defended** (or *protected*) when another piece of the same color could capture whatever takes it. If your opponent captures a defended piece, they lose their own piece right after.

A piece that's attacked and not defended is **hanging**: your opponent can take it for free. Once you know how each piece moves, start looking at the board this way: what's attacked, what's defended and what's hanging. It's the first step toward not losing pieces — and toward [winning your opponent's](artigo:garfo).

## Quick summary {#resumo "Summary"}

| Piece | How it moves | Can it jump? |
|---|---|---|
| King | 1 square in any direction | No |
| Queen | Straight lines and diagonals, any distance | No |
| Rook | Straight lines (files and ranks) | No |
| Bishop | Diagonals | No |
| Knight | "L" shape (2 + 1) | Yes |
| Pawn | 1 square forward (2 on its first move); captures diagonally | No |

## Exercises {#exercicios "Exercises"}

Put it into practice. Tap (or click) the piece, then the destination square.

```exercicio
fen: 6k1/5ppp/8/8/8/8/5PPP/R5K1 w - - 0 1
enunciado: White's rook can deliver **mate in 1**. Find the move.
tipo: mate
lances: 1
solucao: a1a8
dica: The rook can run all the way up the a-file. Can the black king escape to the 7th rank?
explicacao: 1.Ra8# — the rook goes up the a-file and attacks the king along the 8th rank. Black's own pawns on f7, g7 and h7 take away the king's escape squares, and nothing can block.
```

```exercicio
fen: k7/8/1K6/8/8/8/4Q3/8 w - - 0 1
enunciado: Now it's the queen's turn. Deliver **mate in 1**.
tipo: mate
lances: 1
solucao: e2e8
dica: The white king already covers a7 and b7. You need to attack the king and cover b8.
explicacao: 1.Qe8# — the queen goes up the e-file and gives check along the 8th rank, also covering b8. The squares a7 and b7 are taken by the white king.
```

```exercicio
fen: k7/8/2n1r3/8/3P4/8/8/7K w - - 0 1
enunciado: One pawn move attacks two black pieces at once. Which one?
tipo: tatica
solucao: d4d5
dica: Pawns capture diagonally. Where does it need to go to attack both c6 and e6?
explicacao: 1.d5! — the pawn threatens to capture the knight on c6 and the rook on e6. No black piece can take it, and Black can't save both: White wins material.
```

## Frequently asked questions {#faq "FAQ"}

### What is the strongest chess piece?

The queen, because she combines the rook's and the bishop's moves. The king is the most important piece, but not the strongest.

### Can a pawn move backward?

No. Pawns only move forward. All the other pieces can go back.

### Can a pawn move two squares at any time?

No. Only on that pawn's first move. After that it moves one square at a time.

### Which piece can jump over other pieces?

Only the knight. All the others stop when a piece is in the way.

### Can a bishop change color?

No. Since it only moves diagonally, it always stays on squares of the same color.

:::pratique Practice the moves
Play the computer on Easy. Before each move, look at where each of your pieces can go — and where your opponent's pieces can go.
:::
