---
id: jogar-do-zero
titulo: How to Play Chess for Beginners: Complete Guide
titulo_seo: How to Play Chess for Beginners: Complete Guide (2026) | Chess Online
descricao: Learn how to play chess from scratch in 5 steps: the board, how each piece moves, special moves, checkmate, and how to practice. A free beginner's guide.
nivel: iniciante
ordem: 10
publicado: 2026-05-11
atualizado: 2026-10-26
tags: [how to play chess, chess for beginners, learn chess, chess rules, chess from scratch, chess tutorial]
jogar: 1
relacionados: []
---
If you've never played chess before, this guide is the perfect place to start. In 5 steps, you'll get to know the board, learn how each piece moves, discover the special moves, understand what checkmate is, and walk away with a practical path to start playing today — right in your browser, with nothing to download.

## 1. The board: 64 light and dark squares {#tabuleiro}

Chess is played on a square board of **8 by 8 squares**, making 64 squares in total that alternate between light and dark. Each player starts with 16 pieces: 8 pawns on the second rank and, behind them on the first rank, a rook in each corner, then a knight, a bishop, the queen, and the king (in that order).

A simple rule for setting up the board: the **square in each player's right-hand corner must be white** (light). And the queen always starts on a **square of her own color** — white queen on a white square, black queen on a black square.

The horizontal lines are called **ranks** (numbered 1 to 8) and the vertical lines are called **files** (letters A to H). This system lets you describe any move precisely: "pawn to E4" means moving the pawn to file E, rank 4.

The player with the white pieces **always moves first**. After that, the players alternate, one move at a time.

```tabuleiro
fen: rnbqkbnr/pppppppp/8/8/8/8/PPPPPPPP/RNBQKBNR w KQkq - 0 1
casas: h1 a8 d1:verde d8:verde
legenda: The starting position. Each player's right-hand corner square (h1 and a8) is light, and each queen starts on her own color (d1 and d8).
```

## 2. How each piece moves {#pecas}

This is the heart of chess. Don't skip this part — understanding how each piece moves is half the battle when it comes to playing well.

:::peca ♟ Pawn
Moves **one square forward**. On its first move, it can advance two squares (your choice). It captures **diagonally, one square forward**. The pawn is the only piece that moves differently from how it captures.

<small>Fun fact: if a pawn reaches the last rank of the board, it is promoted to any other piece (almost always a queen).</small>
:::

:::peca ♜ Rook
Moves in a **straight line**, horizontally or vertically, as many squares as you like. It cannot jump over other pieces. It captures the same way it moves.

<small>Tip: rooks become very powerful on open files (with no pawns in the way).</small>
:::

:::peca ♝ Bishop
Moves **diagonally**, as many squares as you like. Each bishop is stuck on the color of the square it started on: the one that begins on a light square only travels on light squares, and vice versa.

<small>That's why having the bishop pair (controlling both colors) is considered a small advantage.</small>
:::

:::peca ♛ Queen
The most powerful piece in the game. She combines the rook's and the bishop's moves: she travels in a **straight line or diagonally**, as many squares as you like, in any direction.

<small>She's worth roughly 9 points. Losing your queen early often decides the game.</small>
:::

:::peca ♞ Knight
Moves in an **"L" shape**: two squares in one direction and one more at a right angle (or the other way around). It is the only piece in the game that **jumps over other pieces**.

<small>The knight is a master of the "fork": double attacks where two enemy pieces are threatened at the same time.</small>
:::

:::peca ♚ King
Moves **one square in any direction**. It cannot move to a square attacked by an enemy piece. The king is the most important piece — if it falls, you lose.

<small>Protect the king with castling (see the next section). In the endgame, the king becomes an active piece.</small>
:::

## 3. Special moves (castling, en passant, promotion) {#especiais}

### Castling

Castling is a move that shifts the king and one of the rooks at the same time. It serves to bring the king to safety and activate the rook. There are two types: **kingside castling** (the king's side) and **queenside castling** (the queen's side).

To castle, three conditions must all be true:

- Neither the king nor the rook involved may have moved before.
- There can be no pieces between the king and the rook.
- The king cannot be in check and cannot pass through an attacked square.

```tabuleiro
fen: r3k2r/pppq1ppp/2npbn2/4p3/4P3/2NPBN2/PPPQ1PPP/R3K2R w KQkq - 0 1
setas: e1g1 h1f1
legenda: White castles kingside: the king goes from e1 to g1 and the rook jumps from h1 to f1.
```

### En passant ("in passing" capture)

If an enemy pawn advances two squares on its first move and ends up next to your pawn, you can capture it **on the very next move**, as if it had advanced only one square. It's a rule a lot of people never learn.

```tabuleiro
fen: rnbqkbnr/ppp1p1pp/8/3pPp2/8/8/PPPP1PPP/RNBQKBNR w KQkq f6 0 3
setas: e5f6
casas: f5:vermelha
legenda: En passant: Black has just played f7–f5. The e5 pawn captures by moving to f6, and the f5 pawn leaves the board.
```

### Promotion

When your pawn reaches the last rank of the board, it is promoted to another piece of your choice (queen, rook, bishop, or knight). In practice, players almost always choose the queen, since it's the strongest piece. Thanks to promotion, you can even have more than one queen on the board.

## 4. Check, checkmate, and draws {#xeque-mate}

### Check

When the king is under direct attack from an enemy piece, we say it is in **check**. You are required to get out of check immediately. There are three ways to do it:

1. Move the king to a safe square.
2. Block the attack with another piece (this doesn't work against a knight, since it jumps).
3. Capture the piece that is giving check.

### Checkmate

If the king is in check and **none of the three options above is possible**, it's checkmate. The game is over. Whoever delivered the checkmate wins.

Checkmate is the ultimate goal of chess. It doesn't matter how many pieces each side has: being a queen up is worth nothing if you can't deliver checkmate.

```exercicio
fen: 6k1/5ppp/8/8/8/8/5PPP/R5K1 w - - 0 1
enunciado: Your move, as White: deliver **checkmate in 1**.
tipo: mate
solucao: a1a8
dica: The black king is trapped behind its own pawns. Which of your pieces can reach the back rank?
explicacao: 1.Ra8# — the rook gives check on the 8th rank and the king has no escape: f7, g7 and h7 are blocked by its own pawns, and f8 and h8 are still covered by the rook. This is the "back-rank mate".
```

### Draws (stalemate and others)

Not every game ends with a winner. There are several ways to draw:

- **Stalemate**: the player to move is not in check but has no legal move available.
- **Agreement between the players**: both agree to a draw.
- **The 50-move rule**: no pawn has moved and no capture has been made for 50 consecutive moves.
- **Threefold repetition**: the same position occurs three times.
- **Insufficient material**: neither side has enough pieces to deliver mate (for example, king versus king).

## 5. How to practice and improve {#pratica}

Learning the rules is just the beginning. Chess is a game you get better at through practice. Here are a few suggestions for your first few months:

- **Play every day, even if just a little**. Ten minutes a day are worth more than two hours once a week.
- **Start against the computer**. You can pause, think, and replay moves without pressure. Once you feel more comfortable, move on to games against other people.
- **Review the games you lose**. Most of the learning comes from your mistakes.
- **Learn a few basic openings**. You don't need to memorize long variations. Knowing how to control the center and develop your pieces is already enough for the first 10 moves.
- **Solve tactics puzzles**. The fork, the pin, and the discovered attack are patterns that show up all the time.

:::dica
**💡 Honest tip:** don't try to memorize every opening from scratch. Focus on *principles* (controlling the center, development, king safety) and on *tactics*. That will take you much further in your first six months.
:::

:::pratique Ready for your first game?
Use our **Apprentice mode**, with 12 interactive lessons that teach every piece and every concept hands-on. No sign-up. No installation. Right in your browser.
:::

## Next steps

Once you're comfortable with the rules, it's worth getting to know:

- The most common openings (the Italian Game, the Sicilian Defense, the Queen's Gambit).
- Mating patterns (back-rank mate, Scholar's Mate, ladder mate).
- Basic endgames (king and queen versus king, king and rook versus king, the passed pawn).
- Middlegame principles (active pieces, weaknesses in the opponent's camp, favorable exchanges).

We'll be publishing dedicated guides on each of these topics soon, right here in [/en/learn](/en/learn). If you'd like to catch the next ones, bookmark the site and come back often.
