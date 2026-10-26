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
relacionados: [jogar-do-zero, aberturas-para-iniciantes, mate-do-pastor, ritmos-de-jogo]
---
This is a complete summary of the official rules of chess according to FIDE (the International Chess Federation), translated into plain, accessible language. Everything you need to know to play by the international standard, without having to read the original 60-page rulebook.

## 1. The board and the starting position {#tabuleiro}

Chess is played on a board of 64 squares (8x8) in alternating colors. **The square in each player's right-hand corner must be white**. The pieces start on the first two ranks on each side.

Order of the pieces on the first rank (from A to H):

- Rook — Knight — Bishop — Queen — King — Bishop — Knight — Rook

**The queen always starts on a square of its own color**: the white queen on a white square, the black queen on a black square. The pawns fill the entire second rank. The player with the white pieces moves first.

```tabuleiro
fen: rnbqkbnr/pppppppp/8/8/8/8/PPPPPPPP/RNBQKBNR w KQkq - 0 1
casas: e1 e8 d1:verde d8:verde
legenda: Starting position: the king and queen stand in the middle of the first rank, and the queen goes on her own color.
```

## 2. How the pieces move {#movimentos}

Each piece has its own way of moving. Here is the summary:

:::peca ♟ Pawn
Moves one square forward. On its first move, it may advance two squares. It captures diagonally, one square forward. It never moves backward.
:::

:::peca ♜ Rook
Moves in a straight line (horizontally or vertically), as many squares as it likes. It captures on the destination square. It cannot jump over other pieces.
:::

:::peca ♝ Bishop
Moves diagonally, as many squares as it likes. Each bishop always stays on its starting color.
:::

:::peca ♛ Queen
Combines the moves of the rook and the bishop. It moves in any direction, in a straight line or diagonally, as many squares as it likes.
:::

:::peca ♞ Knight
Moves in an "L" shape: two squares in one direction and one more square perpendicular to it. It is the only piece that can jump over other pieces.
:::

:::peca ♚ King
Moves one square in any direction. It cannot move onto a square attacked by an enemy piece.
:::

## 3. Special moves {#especiais}

### Castling

The king and one rook move together: the king moves two squares toward the rook, and the rook jumps to the other side of the king. There is kingside castling (the king's side, the more common one) and queenside castling (the queen's side).

Conditions for castling:

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

If an enemy pawn advances two squares on its first move and ends up beside your pawn, you may capture it on your next move as if it had advanced only one square. **It is only valid on the very next move** — if you don't capture, you lose the right.

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

The king is under direct attack. You are required to escape check immediately, in one of three ways:

1. Move the king to a safe square.
2. Block the attack with another piece (this doesn't work against a knight, which jumps).
3. Capture the piece giving check.

### Checkmate

The king is in check and **none of the three options above is possible**. The game is over. Whoever delivered the checkmate has won.

### Resignation

A player may resign at any moment. This usually happens when the player realizes the game is lost and wants to save time. A resignation counts as a win for the opponent.

## 5. Types of draw {#empates}

### Stalemate

The player to move is not in check but has no legal move available. The game ends in a draw. This is one of the most important endgame rules — you can be up a whole queen, but if you stalemate the opponent's king, the game ends in a draw.

```tabuleiro
fen: 7k/5Q2/6K1/8/8/8/8/8 b - - 0 1
casas: h8:vermelha
legenda: Stalemate: Black is to move, is not in check and has no legal move. The game is a draw.
```

### Draw by agreement

The two players can agree to a draw at any moment. In official tournaments, there are additional rules about when this is allowed.

### The fifty-move rule

If 50 consecutive moves go by with no capture and no pawn move, either player can claim a draw. The rule exists to prevent endless games in endgames that make no progress.

### Threefold repetition

If the same position occurs three times during the game (with the same player to move), a draw can be claimed. The repetitions do not have to be consecutive.

### Insufficient material

When neither side has enough pieces to deliver checkmate, the game ends in a draw automatically. Examples:

- King against king.
- King against king and bishop.
- King against king and knight.
- King and bishop against king and bishop, when the bishops are on the same color.

## 6. Time and clock rules {#relogio}

In games played with a clock, each player has a total amount of time. When a player's time runs out, that player loses — unless the opponent doesn't have enough pieces to deliver mate (in which case it's a draw). The main formats are:

- **Classical:** 60 minutes or more per side.
- **Rapid:** 10 to 60 minutes.
- **Blitz:** 3 to 10 minutes.
- **Bullet:** less than 3 minutes.

See the dedicated article on [Classical, Rapid, Blitz and Bullet Chess](artigo:ritmos-de-jogo).

## 7. Conduct and etiquette {#etiqueta}

A few lesser-known but equally valid rules:

- **Touch-move.** In tournaments, if you touch one of your own pieces, you must move it (if there is a legal move). If you touch an enemy piece, you must capture it (same idea).
- **A move is only complete when you release the piece.** Before that, you can still move it to another legal square with the same piece.
- **You may not consult books, a computer or other people** during a game in an official tournament.
- **You may not talk to your opponent** beyond what is necessary (a greeting, offering a draw, resigning).

:::dica
**💡 Note for online games:** the touch-move rule does not apply in games played over the internet — a move only counts when you confirm it. But the time rules and special moves apply in exactly the same way.
:::

:::pratique Put the rules into practice
Practice on Chess Online with Learner mode: 12 interactive lessons that teach each rule hands-on.
:::
