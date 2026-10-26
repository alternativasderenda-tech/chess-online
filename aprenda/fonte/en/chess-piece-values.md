---
id: valor-das-pecas
titulo: "Chess Piece Values: How Much Each Piece Is Worth"
titulo_seo: Chess Piece Values Explained | Chess Online
descricao: How much each chess piece is worth — pawn 1, knight 3, bishop 3, rook 5, queen 9 — and how to use those points to judge trades and captures.
nivel: iniciante
ordem: 32
publicado: 2026-10-26
atualizado: 2026-10-26
tags: [chess piece values, how much is each chess piece worth, chess points, winning the exchange, chess trades]
jogar: 1
relacionados: [como-as-pecas-se-movem, movimento-do-cavalo, erros-de-iniciante, principios-de-abertura]
ensina: [Relative piece values, Trading pieces, Winning the exchange]
---
In chess, each piece has an approximate value in points, measured in pawns: **pawn = 1, knight = 3, bishop = 3, rook = 5 and queen = 9**. The king has no point value, because losing it means losing the game. These numbers aren't part of the rules; they're a tool for comparing trades and deciding, in seconds, whether a capture is worth it.

## The value chart {#tabela "The value chart"}

| Piece | Value (in pawns) |
|---|---|
| Pawn | 1 |
| Knight | 3 |
| Bishop | 3 |
| Rook | 5 |
| Queen | 9 |
| King | no value: it can never be traded |

This is the scale you'll find in most chess books. Some authors rate the bishop a touch higher than the knight, but for beginners the rule is simple: **knights and bishops are worth the same**.

Add it all up and each side starts with **39 points**: 8 pawns (8) + 2 knights (6) + 2 bishops (6) + 2 rooks (10) + 1 queen (9).

```tabuleiro
fen: rnbqkbnr/pppppppp/8/8/8/8/PPPPPPPP/RNBQKBNR w KQkq - 0 1
casas: d1:verde d8:verde a1:azul h1:azul a8:azul h8:azul
legenda: In the starting position each side has 39 points. The queens (green) are worth 9; the rooks (blue), 5 each.
```

## Why each piece is worth what it is {#por-que "Why these values"}

A piece's value comes mostly from **how many squares it controls** and how much it helps deliver checkmate.

- **Pawn (1):** moves one square, forward only. It's the unit of measure. But careful: a pawn close to promotion can be worth far more, because it's one step from becoming a queen.
- **Knight (3):** jumps over pieces and shines in closed positions, but it's slow to cross the board.
- **Bishop (3):** covers long diagonals and is strong in open positions, but it only sees squares of one color. That's why **the bishop pair** (both bishops together) is usually a small advantage.
- **Rook (5):** controls whole files and ranks. King and rook alone can already force checkmate against a lone king.
- **Queen (9):** rook plus bishop in one piece. She's worth nearly as much as two rooks (10).

If you want a refresher on how each piece moves, see [how chess pieces move](artigo:como-as-pecas-se-movem).

## Using points to judge trades {#trocas "Judging trades"}

A **trade** happens when you capture a piece and your opponent captures one back. The question is always: *who came out ahead in points?*

- **Even trade:** bishop for knight (3 for 3), rook for rook (5 for 5).
- **Good trade:** you give a knight (3) and get a rook (5). You're up 2 points.
- **Bad trade:** you give your queen (9) and only get a rook (5). You're down 4.

```tabuleiro
fen: r1bqkbnr/1ppp1ppp/p1B5/4p3/4P3/5N2/PPPP1PPP/RNBQK2R b KQkq - 0 4
setas: d7c6:azul
legenda: 1.e4 e5 2.Nf3 Nc6 3.Bb5 a6 4.Bxc6: White's bishop took the knight and Black recaptures (for example, 4...dxc6). Bishop for knight: an even trade, 3 for 3.
```

### Winning "the exchange"

You'll hear this phrase a lot: **winning the exchange** means giving a minor piece (knight or bishop, 3) for a rook (5). The difference is 2 points, and it's usually a serious advantage. "Losing the exchange" is the opposite.

### Count before you capture

Before capturing a defended piece, count:

1. How many of your pieces attack the square?
2. How many of your opponent's pieces defend it?
3. If all the captures happen, who ends up with more points?

If you capture with a cheap piece and your opponent recaptures with a cheap piece, the balance is what matters. Taking a defended pawn with your queen, for example, is almost always a mistake: you win 1 and lose 9.

:::dica
**💡 Tip:** capture with your **least valuable** piece first. If a recapture comes, you lose as little as possible.
:::

## Keeping track of material during a game {#contar "Keeping track of material"}

You don't need to add up 39 points every move. It's easier to compare **what has already left the board**: if you've captured a bishop and a pawn (4 points) and lost a knight (3), you're 1 point ahead.

With that count in mind, your strategy changes with the score:

- **If you're ahead in material**, trade pieces (without losing anything else). With fewer pieces on the board, your advantage weighs more and your opponent has fewer chances to fight back.
- **If you're behind**, avoid trades and look for complications: attacks on the king and tactical threats are your chance to win back what you lost.

This simple rule — ahead, trade; behind, complicate — holds from beginner to master level.

## When the points mislead {#excecoes "When the points mislead"}

Points are a guide, not a law. Some situations change the math:

- **Checkmate beats everything.** Giving up your queen to deliver mate is the best move on the board.
- **Active pieces are worth more.** A centralized, attacking knight is worth more than a rook stuck in the corner.
- **Advanced passed pawns.** A pawn on the 7th rank, about to promote, can be worth more than a piece.
- **King safety.** Sometimes it's worth giving material to rip open the enemy king.

Still, while you're learning, the practical rule is: **don't give away material without a concrete reason**. Losing pieces for nothing is one of the [most common beginner mistakes](artigo:erros-de-iniciante).

## Exercises {#exercicios "Exercises"}

The question is the same every time: which move wins the most points?

```exercicio
fen: k7/8/8/3n1r2/4P3/8/8/7K w - - 0 1
enunciado: The e4-pawn can take the knight or the rook. Which capture is worth more?
tipo: tatica
solucao: e4f5
dica: A knight is worth 3, a rook 5. Is either of them defended?
explicacao: 1.exf5 — neither piece is defended, so take the more valuable one: the rook (5 points) instead of the knight (3).
```

```exercicio
fen: r2r2k1/5ppp/8/7b/8/7P/5PP1/3Q2K1 w - - 0 1
enunciado: White's queen can take the rook on d8 or the bishop on h5. Pick the right capture.
tipo: tatica
solucao: d1h5
dica: The rook on d8 is defended by the other rook. What about the bishop?
explicacao: 1.Qxh5! — the bishop is undefended and White wins 3 points. By contrast, 1.Qxd8+? Rxd8 gives up the queen (9) for a rook (5): a 4-point loss.
```

```exercicio
fen: r4rk1/p1p2ppp/4b3/8/8/8/PPP2PBP/4R1K1 w - - 0 1
enunciado: White can **win the exchange**. Find the move.
tipo: tatica
solucao: g2a8
dica: Look down the long diagonal from the bishop on g2.
explicacao: 1.Bxa8 Rxa8 — the bishop (3) takes the rook (5), and even after the recapture White is 2 points up. Beware of 1.Rxe6?, which gives a rook (5) for the bishop (3) after 1...fxe6.
```

## Frequently asked questions {#faq "FAQ"}

### How many points is each chess piece worth?

Pawn 1, knight 3, bishop 3, rook 5 and queen 9. The king has no point value.

### Is a bishop worth more than a knight?

For beginners, both are worth 3. The bishop tends to be slightly better in open positions and the knight in closed ones, and having both bishops is a small advantage.

### How much is the king worth?

The king has no point value because it can never be captured or traded: when it has no escape from attack, it's checkmate and the game is over.

### Do points decide who wins?

No. You win by checkmate (or when your opponent resigns or runs out of time). Points just help you judge trades: the side with more material usually has better chances.

### What does "winning the exchange" mean?

Trading a knight or bishop (3 points) for a rook (5 points), gaining 2 points in the deal.

:::pratique Practice counting material
Play the computer on Easy and, after every capture, add up the points for each side. Try to finish the game further ahead in material than you started.
:::
