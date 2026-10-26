---
id: movimento-do-cavalo
titulo: How the Knight Moves in Chess: the L, the Jump and the Color
titulo_seo: How the Knight Moves in Chess: the L, the Jump and the Color
descricao: How the knight moves in chess: the L-shape, why it jumps over pieces, forks, tactical patterns and how to master the board's most unpredictable piece.
nivel: iniciante
ordem: 30
publicado: 2026-05-11
atualizado: 2026-10-26
tags: [how the knight moves, knight movement chess, knight L-shape, knight fork, check with knight]
jogar: 1
relacionados: [como-as-pecas-se-movem, garfo, valor-das-pecas, taticas]
ensina: [How the knight moves, Knight forks, Good and bad knights]
---
The knight moves in an "L": two squares in a straight line, horizontally or vertically, and then one square to the side. It is the only piece that jumps over other pieces in its normal move, and every time it moves it lands on a square of the opposite color. In the center of the board a knight attacks up to 8 squares; in a corner, only 2. This guide covers the move, why the knight jumps, the fork and the tactical patterns that make it so dangerous.

## 1. The L-shaped move {#movimento}

The knight moves in the shape of an "L". More precisely: **two squares in one direction (horizontal or vertical) and one square in the perpendicular direction**. Or the other way around: one square in one direction and two in the perpendicular. Both forms are valid.

From any square on the board, the knight has a maximum of **8 possible destinations**:

- 2 up + 1 to the left
- 2 up + 1 to the right
- 2 down + 1 to the left
- 2 down + 1 to the right
- 2 to the left + 1 up
- 2 to the left + 1 down
- 2 to the right + 1 up
- 2 to the right + 1 down

In the corners of the board, the knight has only **2 moves**, and along the rest of the edge, 3 or 4. Hence the saying: "a knight on the rim is dim". In the corner or on the edge, the knight loses most of its power.

In the center, the knight has its full 8 destinations. That's the reason for the classic recommendation: **develop the knights to c3, f3, c6 or f6** in the opening moves.

```tabuleiro
fen: 7k/8/8/8/4N3/8/8/K7 w - - 0 1
casas: c3:verde c5:verde d2:verde d6:verde f2:verde f6:verde g3:verde g5:verde
legenda: In the center, the knight on e4 reaches 8 squares.
```

```tabuleiro
fen: 7k/8/8/8/8/8/8/N5K1 w - - 0 1
casas: b3:verde c2:verde
legenda: In the corner, the knight on a1 has only 2 squares.
```

## 2. Why the knight jumps over pieces (the unique rule) {#pulo "Why the knight jumps over pieces"}

The knight is the **only piece in chess that jumps over other pieces**. It doesn't matter what stands between it and its destination — friendly pieces, enemy pieces, anything at all. The knight lands directly on the final square.

This completely changes the tactical options:

- The knight can attack pieces **through** a wall of pawns.
- It is the only piece that can deliver check with pawns and pieces **standing in front of** the enemy king.
- It cannot be blocked — you can't "interpose" a piece between the knight and its destination.

The practical consequence: in **closed** positions (lots of locked pawns), the knight is usually stronger than the bishop. In **open** positions (few pawns), the bishop generally has the edge.

## 3. The color rule: the knight alternates with every move {#cor "The color rule: the knight always alternates"}

The knight **always changes the color of its square**. If it stands on a light square, its next move takes it to a dark square. And vice versa.

Why? The "L" always covers 3 squares (2 + 1), and every one-square step changes color: three changes land on the opposite color.

Practical consequences:

- To go from a light square to another light square, the knight needs an **even** number of moves (2, 4…); to reach a dark square, an **odd** number (1, 3…).
- That's why a knight can never "lose a move": it can't return to the same square in 3 moves. In endgames, this decides whether it arrives in time.
- A neighboring square (like e4 → e5) looks close, but the knight needs 3 moves to get there.

## 4. The value and strength of the knight {#valor}

A knight is worth about 3 pawns, the same as a bishop (see [chess piece values](artigo:valor-das-pecas)), but the two **shine in different positions**: the knight in closed ones, the bishop in open ones. Trading a knight for a bishop (or vice versa) is a positional decision, not a material one.

## 5. The fork: the knight's most famous tactic {#garfo}

A **[fork](artigo:garfo)** is when a single piece attacks two enemy pieces at the same time. The knight is the king of forks in chess, because the L-shaped move enables attacks in directions no other piece can manage.

### Example: the double attack

Imagine a white knight on e5. From there it attacks c6, d7, f7, g6, g4, f3, d3 and c4. If two valuable enemy pieces stand on two of those squares (say, the queen and a rook), your opponent can save only one, and the knight takes the other next move. When a fork hits the king, queen and rook at once, it's called a **family fork**.

### Royal fork (with check)

When the knight attacks the **enemy king at the same time as an important piece** (queen, rook, bishop), the opponent is forced to escape the check first — and loses the attacked piece.

:::dica
**💡 Defense tip:** on every move, before you play, look at where the enemy knight can land over the next 2 moves. Ask yourself: "if it jumps to that square, what does it attack?". Beginners lose a lot of material by never asking that question.
:::

```exercicio
fen: 2q3k1/5ppp/8/3N4/8/8/5PPP/6K1 w - - 0 1
enunciado: White to move wins material with a **knight fork**.
solucao: d5e7 g8f8 e7c8
dica: Look for a square where the knight attacks the king and the queen at the same time.
explicacao: 1.Ne7+ gives check and attacks the queen on c8 in the same move. The king must get out of check (1...Kf8, hitting the knight, or 1...Kh8), and 2.Nxc8 takes the queen. The knight still has squares to get back into play.
```

## 6. Good knights and bad knights {#bom-mau}

A knight is considered **good** when:

- It stands on a central square (d4, d5, e4, e5 or nearby squares).
- It cannot be driven away by enemy pawns.
- It has several possible destination squares.
- It attacks enemy pieces or important squares.

A knight is **bad** when:

- It stands on a1, a8, h1 or h8 (the corner).
- It is blocked in by its own pieces.
- It can easily be driven away by an enemy pawn.
- It can't reach the squares that matter in the position.

In practice, the ideal is to keep your good knight against your opponent's [bad bishop](artigo:bispos) — a bishop hemmed in by its own pawns. So don't trade your good knight for their bad bishop: leave them stuck with the bad piece. Details like this decide endgames.

## 7. Practical tips for using the knight well {#dicas}

1. **Knights before bishops.** In the opening, [develop the knight first](artigo:principios-de-abertura) (to c3 or f3 for White; c6 or f6 for Black).
2. **Look for outposts.** Squares that no enemy pawn can attack are called "outposts". A knight on an advanced outpost can be worth almost as much as a rook.
3. **In closed positions, treasure your knights.** Don't trade a knight for a bishop if the game is closed — the knight is better.
4. **Beware of knights on the rim.** A knight on a4, a5, h4 or h5 controls only 4 squares and can be driven away by a pawn, losing time.
5. **Learn the fork patterns.** Train at least 20-30 knight forks in puzzles. They show up in almost every game.

:::pratique Practice the knight for real
Play against the computer and focus on using your knights well. Try to land a fork in every game — it's an exercise that pays off a lot.
:::

## Knight trivia

- In English notation the knight is written as **N** (for *knight*, since K is taken by the king).
- There is a famous mathematical problem called the "knight's tour": the knight must visit all 64 squares exactly once. It has been solved in many different ways.
- King and knight can't mate a lone king, and two knights can't force it. Knight **and** bishop can, but it's one of the hardest endgames.
- Knight jumps are the easiest moves to overlook when calculating. That's why it pays to train your knight vision.

## Frequently asked questions {#faq "FAQ"}

### How many squares does a knight attack?

It depends on where it stands: up to 8 squares in the center, 6, 4 or 3 near the edges, and only 2 in a corner. That is why knights usually do more in the center.

### Can the knight jump over pieces?

Yes. It jumps over pieces of both colors; it just can't end its move on a square occupied by a piece of its own color.

### Is a knight worth more than a bishop?

In points, both are worth 3. In practice, the knight tends to be better in closed positions with lots of locked pawns, and the bishop in open positions. [See what each piece is worth](artigo:valor-das-pecas).
