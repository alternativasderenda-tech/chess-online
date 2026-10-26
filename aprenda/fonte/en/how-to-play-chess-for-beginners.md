---
id: jogar-do-zero
titulo: How to Play Chess for Beginners: Complete Guide
titulo_seo: How to Play Chess for Beginners: Complete Guide
descricao: Learn how to play chess from scratch in 5 steps: the board, how each piece moves, special moves, checkmate, and how to practice. A free beginner's guide.
nivel: iniciante
ordem: 10
publicado: 2026-05-11
atualizado: 2026-10-26
tags: [how to play chess, chess for beginners, learn chess, chess from scratch, chess tutorial]
ensina: [Setting up the board, How the pieces move, Special moves, Checkmate, Draws]
jogar: 1
relacionados: [tabuleiro-e-notacao, como-as-pecas-se-movem, lances-especiais, principios-de-abertura]
---
To play chess, you need to know five things: how to set up the 64-square board, how each of the six pieces moves, the three special moves (castling, en passant and promotion), what checkmate is — the goal of the game — and how a game can end in a draw. White always moves first, and the players take turns, one move each. This guide walks through the five steps with diagrams so you can play your first game today, right in your browser.

## 1. The board: 64 light and dark squares {#tabuleiro}

Chess is played on a square board of **8 by 8 squares**, making 64 squares in total that alternate between light and dark. Each player starts with 16 pieces: 8 pawns on the front rank (White's 2nd, Black's 7th) and, behind them, a rook in each corner, then a knight, a bishop, the queen, and the king (in that order).

A simple rule for setting up the board: the **square in each player's right-hand corner must be light**. And the queen always starts on a **square of her own color** — White's queen on a light square, Black's queen on a dark square.

The horizontal lines are called **ranks** (numbered 1 to 8) and the vertical lines are called **files** (letters **a** to **h**). This system lets you [describe any move precisely](artigo:tabuleiro-e-notacao): "pawn to e4" means moving the pawn to the e-file, 4th rank.

The player with the white pieces **always moves first**. After that, the players alternate, one move at a time.

```tabuleiro
fen: rnbqkbnr/pppppppp/8/8/8/8/PPPPPPPP/RNBQKBNR w KQkq - 0 1
casas: h1 a8 d1:verde d8:verde
legenda: The starting position. Each player's right-hand corner square (h1 and a8) is light, and each queen starts on her own color (d1 and d8).
```

## 2. How each piece moves {#pecas}

This is the heart of chess. Don't skip this part — [understanding how each piece moves](artigo:como-as-pecas-se-movem) is half the battle when it comes to playing well.

:::peca ♟ Pawn
Moves **one square forward**. On its first move, it can advance two squares (your choice). It captures **diagonally, one square forward**. The pawn is the only piece that moves differently from how it captures.

<small>Fun fact: if a pawn reaches the last rank of the board, it is promoted to a queen, rook, bishop or knight (almost always a queen).</small>
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

<small>She's worth roughly [9 points](artigo:valor-das-pecas). Losing your queen early often decides the game.</small>
:::

:::peca ♞ Knight
Moves in an **"L" shape**: two squares in one direction and one more at a right angle (or the other way around). It is the only piece in the game that **jumps over other pieces**.

<small>The knight is a master of the "fork": double attacks where two enemy pieces are threatened at the same time.</small>
:::

:::peca ♚ King
Moves **one square in any direction**. It cannot move to a square attacked by an enemy piece. The king is the most important piece — if it's checkmated, you lose (the king is never actually captured).

<small>Protect the king with castling (see the next section). In the endgame, the king becomes an active piece.</small>
:::

## 3. Special moves (castling, en passant, promotion) {#especiais}

### Castling

[Castling](artigo:lances-especiais) is a move that shifts the king and one of the rooks at the same time. It serves to bring the king to safety and activate the rook. There are two types: **kingside castling** (also called short castling) and **queenside castling** (long castling).

To castle, four conditions must all be true:

- Neither the king nor the rook involved may have moved before.
- There can be no pieces between the king and the rook.
- The king cannot be in check.
- The king cannot pass through or land on an attacked square.

```tabuleiro
fen: r3k2r/pppq1ppp/2npbn2/4p3/4P3/2NPBN2/PPPQ1PPP/R3K2R w KQkq - 0 1
setas: e1g1 h1f1
legenda: White castles kingside: the king goes from e1 to g1 and the rook jumps from h1 to f1.
```

### En passant ("in passing" capture)

If an enemy pawn advances two squares from its starting square and lands next to your pawn, you can capture it **on the very next move**, as if it had advanced only one square. It's a rule a lot of people never learn.

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

[Checkmate](artigo:xeque-mate-e-afogamento) is the ultimate goal of chess. It doesn't matter how many pieces each side has: being a queen up is worth nothing if you can't deliver checkmate.

```exercicio
fen: 6k1/5ppp/8/8/8/8/5PPP/R5K1 w - - 0 1
enunciado: Your move, as White: deliver **checkmate in 1**.
tipo: mate
solucao: a1a8
dica: The black king is trapped behind its own pawns. Which of your pieces can reach the back rank?
explicacao: 1.Ra8# (the rook goes to a8; "#" means mate) — the rook gives check on the 8th rank and the king has no escape: f7, g7 and h7 are blocked by its own pawns, and f8 and h8 are still covered by the rook. This is the [back-rank mate](artigo:mate-do-corredor).
```

### Draws (stalemate and others)

Not every game ends with a winner. There are [several ways to draw](artigo:empates):

- **Stalemate**: the player to move is not in check but has no legal move available.
- **Agreement between the players**: both agree to a draw.
- **The 50-move rule**: no pawn has moved and no capture has been made in the last 50 moves by each player.
- **Threefold repetition**: the same position occurs three times.
- **Insufficient material**: neither side has enough pieces to deliver mate (for example, king versus king).

## 5. How to practice and improve {#pratica}

Learning the rules is just the beginning. Chess is a game you get better at through practice. Here are a few suggestions for your first few months:

- **Play every day, even if just a little**. Ten minutes a day is worth more than two hours once a week.
- **Start against the computer**. You can pause, think, and replay moves without pressure. Once you feel more comfortable, move on to games against other people.
- **[Review the games you lose](artigo:analisar-partidas)**. Most of the learning comes from your mistakes.
- **Learn [a few basic openings](artigo:aberturas-para-iniciantes)**. You don't need to memorize long variations. Knowing how to control the center and develop your pieces is already enough for the first 10 moves.
- **Solve tactics puzzles**. The [fork](artigo:garfo), the [pin](artigo:cravada), and the [discovered attack](artigo:ataque-descoberto) are patterns that show up all the time.

:::dica
**💡 Honest tip:** don't try to memorize every opening from scratch. Focus on [*principles*](artigo:principios-de-abertura) (controlling the center, development, king safety) and on *tactics*. That will take you much further in your first six months.
:::

:::pratique Ready for your first game?
Open the game, pick **🎓 Beginner** in the difficulty menu and work through the 12 interactive lessons, which teach every piece and every concept hands-on. No sign-up, right in your browser.
:::

## Frequently asked questions {#faq "FAQ"}

### Who moves first in chess?

White. White always makes the first move, and then the players alternate, one move at a time. In a tournament, colors are decided by a draw of lots or by the pairing system.

### How do you set up a chessboard?

Each player has a light square in the right-hand corner. On each side's back rank, the rooks go in the corners, the knights next to them, then the bishops, with the queen and king in the middle; the queen goes on her own color (White's on d1, a light square; Black's on d8, a dark square). The eight pawns fill the rank in front. [See it step by step](artigo:tabuleiro-e-notacao#posicao).

### Can you learn chess on your own?

Yes. You can learn the rules by reading and practicing; after that, playing the computer on an easy level and reviewing your own games is a good way to improve without a coach. The [Learn](/en/learn) path follows that order, from beginner to advanced.

## Where to go next {#proximos}

This guide is lesson 1 of the path. The next lessons go deeper into each part, in this order:

1. [The board and notation](artigo:tabuleiro-e-notacao): how to read moves like `e4` and `Nf3`.
2. [How the pieces move](artigo:como-as-pecas-se-movem), with exercises for each piece.
3. [Check, checkmate and stalemate](artigo:xeque-mate-e-afogamento) and [the special moves](artigo:lances-especiais).
4. [The opening principles](artigo:principios-de-abertura), to play your first moves well.

Once you finish the Beginner level, the path moves on to [tactics](artigo:taticas) (fork, pin, discovered attack) and then to strategy and endgames.
