---
id: movimento-do-cavalo
titulo: How the Knight Moves in Chess: The Definitive Guide
titulo_seo: How the Knight Moves in Chess: The Definitive Guide | Chess Online
descricao: How the knight moves in chess: the L-shape, why it jumps over pieces, forks, tactical patterns and how to master the board's most unpredictable piece.
nivel: iniciante
ordem: 30
publicado: 2026-05-11
atualizado: 2026-10-26
tags: [how the knight moves, knight movement chess, knight L-shape, knight fork, check with knight]
jogar: 1
relacionados: [como-as-pecas-se-movem, garfo, valor-das-pecas, taticas]
---
The knight is the most special piece in chess: it moves in an "L", jumps over other pieces and follows a unique pattern that confuses beginners — yet devastates in the right hands. This guide shows how the knight moves, why it is so powerful and the tactical patterns every player needs to know.

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

In the corners of the board, the knight has only **2 moves**. Hence the saying: "a knight on the rim is dim". A knight in the corner is a weak piece, losing most of its power.

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

An intriguing observation: the knight **always alternates the color of the square it sits on**. If it stands on a light square, its next move goes to a dark square. And vice versa.

Why? Because the L-shaped move always changes the parity of the rank + file sum. It's a geometric property of the board.

Practical consequences:

- If you want to reach a specific square in *N* moves, the color of the square must be compatible with the parity of *N*.
- In endgames, it's important to know: the knight needs at least 2 moves to "keep" the same color.
- There are situations where the knight simply cannot reach a square in a single move, even when it is sitting "nearby".

## 4. The value and strength of the knight {#valor}

In the traditional count of [piece values](artigo:valor-das-pecas):

- **Pawn:** 1 point
- **Knight:** 3 points
- **Bishop:** 3 points
- **Rook:** 5 points
- **Queen:** 9 points

Knight and bishop are worth the same (3), but **they are useful in different situations**. The knight shines in closed positions; the bishop in open positions. Trading a knight for a bishop (or vice versa) is a positional decision, not a material one.

## 5. The fork: the knight's most famous tactic {#garfo}

A **[fork](artigo:garfo)** is when a single piece attacks two enemy pieces at the same time. The knight is the king of forks in chess, because the L-shaped move enables attacks in directions no other piece can manage.

### Classic example: the family fork

Imagine a white knight on e5. From there, it attacks c6, d7, f7, g6, g4, f3, d3 and c4. If two important enemy pieces stand on two of those squares (say, the queen and a rook), the knight captures one and the other is still under threat.

### Royal fork (with check)

When the knight attacks the **enemy king at the same time as an important piece** (queen, rook, bishop), the opponent is forced to escape the check first — and loses the attacked piece. This is every beginner's nightmare.

:::dica
**💡 Defense tip:** on every move, before you play, look at where the enemy knight can land over the next 2 moves. Ask yourself: "if it jumps to that square, what does it attack?". Beginners lose a lot of material by never asking that question.
:::

```exercicio
fen: r3k3/pp3ppp/8/3N4/8/8/PPP2PPP/6K1 w - - 0 1
enunciado: White to move wins material with a **knight fork**.
solucao: d5c7 e8e7 c7a8
dica: Look for a square where the knight attacks the king and the rook at the same time.
explicacao: 1.Nc7+ gives check and attacks the a8 rook in the same move. The king has to get out of check, and the knight takes the rook.
```

## 6. Good knight vs bad knight {#bom-mau}

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

In play, it's common to trade your good knight for the opponent's [bad bishop](artigo:bispos). That kind of small trade decides games.

## 7. Practical tips for using the knight well {#dicas}

1. **Knights before bishops.** In the opening, [develop the knight first](artigo:principios-de-abertura) (to c3 or f3 for White; c6 or f6 for Black).
2. **Look for outposts.** Squares that no enemy pawn can attack are called "outposts". A knight on an advanced outpost is worth as much as a rook.
3. **In closed positions, treasure your knights.** Don't trade a knight for a bishop if the game is closed — the knight is better.
4. **Beware of knights on the rim.** If your knight is on a4, a5, h4 or h5, it's in a dangerous zone — it can be driven away and lose a lot of time.
5. **Learn the fork patterns.** Train at least 20-30 knight forks in puzzles. They show up in almost every game.

:::pratique Practice the knight for real
Play against the computer and focus on using your knights well. Try to land a fork in every game — it's an exercise that pays off a lot.
:::

## Knight trivia

- In algebraic notation the knight is written as **N**, short for *knight*.
- There is a famous mathematical problem called the "knight's tour": the knight must visit all 64 squares exactly once. It has been solved in many different ways.
- A lone knight cannot deliver checkmate to a bare king. You need at least king + knight + bishop (and even then it is one of the hardest endgames).
- In tournaments, the knight is the piece opponents tend to **forget to calculate**. That's why training your knight vision gives you a real competitive edge.
