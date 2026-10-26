---
id: regras
titulo: The Official Rules of Chess (FIDE) Explained
titulo_seo: The Official Rules of Chess (FIDE) Explained | Chess Online
descricao: All the official rules of chess according to FIDE, explained in plain English: how each piece moves, special moves, how games end, draws and more.
nivel: iniciante
ordem: 20
publicado: 2026-05-11
atualizado: 2026-10-26
tags: [chess rules, official chess rules, fide rules, checkmate rules, chess rules for beginners]
jogar: 1
relacionados: [como-as-pecas-se-movem, lances-especiais, xeque-mate-e-afogamento, empates, ritmos-de-jogo]
ensina: [FIDE Laws of Chess, How a game ends, Draws]
---
The rules of chess are the [FIDE Laws of Chess](https://handbook.fide.com/chapter/E012023), set by the International Chess Federation. In short: each player starts with 16 pieces on a 64-square board, White moves first, the players alternate one move at a time, and whoever checkmates the opponent's king wins. A game can also end by resignation, by running out of time, or in a draw — by agreement, stalemate, threefold repetition, the 50-move rule or insufficient material. This guide sums up all the official rules in plain language.

## 1. The board and the starting position {#tabuleiro}

Chess is played on a [board of 64 squares](artigo:tabuleiro-e-notacao) (8x8) in alternating colors. **The square in each player's right-hand corner must be light**. The pieces start on the first two ranks on each side.

Order of the pieces on the first rank (from the a-file to the h-file):

- Rook — Knight — Bishop — Queen — King — Bishop — Knight — Rook

**The queen always starts on a square of her own color**: White's queen on a light square, Black's queen on a dark square. The pawns fill the front rank (White's 2nd, Black's 7th). The player with the white pieces moves first.

```tabuleiro
fen: rnbqkbnr/pppppppp/8/8/8/8/PPPPPPPP/RNBQKBNR w KQkq - 0 1
casas: e1 e8 d1:verde d8:verde
legenda: Starting position: the king and queen stand in the middle of the first rank, and the queen goes on her own color.
```

## 2. How the pieces move {#movimentos}

How each piece moves, with diagrams and exercises, is covered in [how chess pieces move](artigo:como-as-pecas-se-movem). For quick reference:

| Piece | How it moves | How it captures |
|---|---|---|
| King | 1 square in any direction, never onto an attacked square | Same as it moves |
| Queen | Straight line or diagonal, as many squares as you like | Same as it moves |
| Rook | Straight line (file or rank), as many squares as you like | Same as it moves |
| Bishop | Diagonal, as many squares as you like; always stays on the same color | Same as it moves |
| Knight | In an "L" (2 + 1); the only piece that jumps | Same as it moves |
| Pawn | 1 square forward (2 on its first move); never moves back | 1 square diagonally forward |

Only the knight jumps over other pieces. No piece can capture a piece of its own color.

## 3. Special moves {#especiais}

### Castling

The king and one rook move together: the king moves two squares toward the rook, and the rook jumps to the other side of the king. There is **kingside castling** (also called short castling, the more common one) and **queenside castling** (long castling).

[Conditions for castling](artigo:lances-especiais):

- Neither the king nor the chosen rook may have moved earlier in the game.
- There must be no pieces between the king and the rook.
- The king must not be in check.
- The king must not pass through a square that is attacked, nor end up on one.

```tabuleiro
fen: r3k2r/pppq1ppp/2npbn2/4p3/4P3/2NPBN2/PPPQ1PPP/R3K2R b KQkq - 0 1
setas: e8c8 a8d8
legenda: Black castles queenside: the king goes from e8 to c8 and the rook from a8 to d8.
```

### En passant (the "in passing" capture)

If an enemy pawn advances two squares from its starting square and lands beside your pawn, you may capture it on your next move as if it had advanced only one square. **It is only valid on the very next move** — if you don't capture, you lose the right.

```tabuleiro
fen: rnbqkbnr/ppp1p1pp/8/3pPp2/8/8/PPPP1PPP/RNBQKBNR w KQkq f6 0 3
setas: e5f6
casas: f5:vermelha
legenda: En passant: after f7–f5, the e5 pawn captures on f6 and the f5 pawn is removed.
```

### Pawn promotion

When your pawn reaches the last rank of the board (the 8th for White, the 1st for Black), it **must** be turned into another piece of your choice (queen, rook, bishop or knight). Thanks to promotion, there can be more than one queen on the board.

## 4. How a game ends {#fim}

### Check

The king is under direct attack. You must get out of check: by moving the king, capturing the checking piece, or blocking (details in [check, checkmate and stalemate](artigo:xeque-mate-e-afogamento)).

### Checkmate

The king is in check and **none of those three escapes is possible**. The game is over. Whoever delivered the checkmate has won.

### Resignation

A player may resign at any moment. This usually happens when the player realizes the game is lost and wants to save time. A resignation counts as a win for the opponent.

## 5. Types of draw {#empates}

### Stalemate

The player to move is not in check but has no legal move available. The game ends in a draw. This is one of the most important endgame rules — you can be up a whole queen, but if you [stalemate the opponent's king](artigo:xeque-mate-e-afogamento), the game ends in a draw.

```tabuleiro
fen: 7k/5Q2/6K1/8/8/8/8/8 b - - 0 1
casas: h8:vermelha
legenda: Stalemate: Black is to move, is not in check and has no legal move. The game is a draw.
```

### Draw by agreement

The two players can agree to a draw at any moment. In official tournaments, there are additional rules about when this is allowed.

### The fifty-move rule

If each player makes 50 moves with no capture and no pawn move, [the player to move can claim a draw](artigo:empates); after 75 moves, the draw is automatic. The rule exists to prevent endless games in endgames that make no progress.

### Threefold repetition

If the same position occurs three times during the game (with the same player to move), a draw can be claimed. The repetitions do not have to be consecutive. If the same position appears five times, the draw is automatic.

### Insufficient material

When neither side has enough pieces to deliver checkmate, the game ends in a draw automatically. Examples:

- King against king.
- King against king and bishop.
- King against king and knight.
- King and bishop against king and bishop, when the bishops are on the same color.

## 6. Time and clock rules {#relogio}

In games played with a clock, each player has a total amount of time. When a player's time runs out, that player loses — unless the opponent cannot checkmate by any series of legal moves (for example, if they only have a king left); in that case, it's a draw. FIDE's time controls are:

- **Classical:** 60 minutes or more per player.
- **Rapid:** more than 10 and less than 60 minutes.
- **Blitz:** 10 minutes or less.

In FIDE's count the increment is multiplied by 60: 10+5 counts as 15 minutes, so it's rapid. **Bullet** (under 3 minutes) isn't a FIDE category; it's an online-site pace.

See the dedicated article on [Classical, Rapid, Blitz and Bullet Chess](artigo:ritmos-de-jogo).

## 7. Conduct and etiquette {#etiqueta}

A few lesser-known but equally valid rules:

- **Touch-move.** In tournaments, if you touch one of your own pieces, you must move it (if there is a legal move). If you touch an enemy piece, you must capture it (same idea).
- **A move is only complete when you release the piece.** Before that, you can still move it to another legal square with the same piece.
- **You may not consult books, a computer or other people** during a game in an official tournament.
- **You may not talk to your opponent** beyond what is necessary (a greeting, offering a draw, resigning).

:::dica
**💡 In online games:** the touch-move rule doesn't apply: a move only counts once you complete it. But the time rules and the special moves apply in exactly the same way.
:::

## Frequently asked questions {#faq "FAQ"}

### How many pieces does each player have?

Sixteen: eight pawns, two rooks, two knights, two bishops, one queen and one king.

### What happens when a player runs out of time?

The player whose time ran out loses — unless the opponent cannot checkmate by any possible series of legal moves, in which case the game is a draw (FIDE Laws, Article 6.9).

### Is "touch-move" an official rule?

Yes. Under Article 4.3 of the FIDE Laws, a player whose turn it is and who deliberately touches one of their own pieces must move it, if it has a legal move; touching an opponent's piece means capturing it, if possible. To straighten a piece on its square, you must say "I adjust" (or "j'adoube") first.

### Can you have two queens?

Yes. Through promotion, a pawn that reaches the last rank can become a queen even while the original queen is still on the board. [See how promotion works](artigo:lances-especiais#promocao).

:::pratique Put the rules into practice
Open the game and pick **🎓 Beginner** in the difficulty menu: 12 interactive lessons that teach each rule hands-on.
:::
