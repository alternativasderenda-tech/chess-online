---
id: empates
titulo: "Draws in Chess: Every Way a Game Can Be Drawn"
titulo_seo: "Draws in Chess: All the Rules | Chess Online"
descricao: Every way a chess game can be drawn under FIDE rules — agreement, stalemate, threefold repetition, the 50-move rule and insufficient material.
nivel: iniciante
ordem: 60
publicado: 2026-10-26
atualizado: 2026-10-26
tags: [draw in chess, stalemate, threefold repetition, 50-move rule, insufficient material, perpetual check]
jogar: 2
relacionados: [xeque-mate-e-afogamento, mates-basicos, finais-de-peao, regras, ritmos-de-jogo]
ensina: [Stalemate, Threefold repetition, The 50-move rule, Insufficient material, Perpetual check]
---
A **draw** in chess is a result where neither player wins: each gets half a point. Under [FIDE rules](artigo:regras#empates), a game is drawn by **agreement between the players**, by **stalemate**, by **threefold repetition** of the same position, by the **50-move rule**, or when neither side can deliver checkmate anymore, as with **insufficient material**. Knowing these rules helps the winning side avoid letting victory slip away, and helps the losing side find a way to save the game.

## 1. Draw by agreement {#acordo "1. Agreement"}

This is the simplest one: one player offers a draw and the other accepts. In an over-the-board game, the correct way is to make your move, offer the draw, and only then press your clock. Your opponent can accept, decline out loud, or simply decline by making a move.

Some tournaments ban agreed draws before a certain move number, to prevent "grandmaster draws" with no real fight. Online, you offer a draw with a button.

## 2. Stalemate {#afogamento "2. Stalemate"}

If the player to move is **not in check** and has **no legal move**, the game is drawn on the spot. It's the draw that most often catches beginners off guard, because it usually happens when one side has a huge advantage.

```tabuleiro
fen: k7/P7/K7/8/8/8/8/8 b - - 0 1
casas: a8:amarela b8:vermelha b7:vermelha
legenda: Black to move, but there's no move: b8 is attacked by the a7-pawn, b7 by the white king, the a7-pawn is protected by the white king, and the black king isn't in check. Stalemate.
```

This is a classic: with [king and a- (or h-) pawn against a king](artigo:finais-de-peao), once the defending king reaches the corner, there's often no way to win. More in [check, checkmate and stalemate](artigo:xeque-mate-e-afogamento).

## 3. Insufficient material {#material "3. Insufficient material"}

Under the [FIDE Laws of Chess](https://handbook.fide.com/chapter/E012023), the game ends in a draw when the position is **dead**: no sequence of legal moves could let either side deliver checkmate. The most common cases:

- **King vs. king.**
- **King and bishop vs. king.**
- **King and knight vs. king.**
- **King and bishop vs. king and bishop**, with both bishops on the same color.

```tabuleiro
fen: 8/8/4k3/8/8/2B5/8/4K3 w - - 0 1
legenda: King and bishop vs. king: no checkmate position is possible. The game is a draw.
```

One case trips people up: with **two knights** against a lone king, you can't *force* mate, but a mate is still possible if the defender blunders. So the game doesn't end by itself; it usually ends in a draw by agreement or by the 50-move rule.

## 4. Threefold repetition {#repeticao "4. Threefold repetition"}

If the **same position** occurs **three times** in a game, the player to move can claim a draw. "Same position" means the same pieces on the same squares, with the same player to move and the same castling and en passant rights. The repetitions **don't have to be consecutive**.

Under FIDE rules, a threefold repetition has to be **claimed**; if the same position appears **five times**, the draw is automatic. Online, the system usually handles this for you.

### Perpetual check

**Perpetual check** isn't a separate rule: it's when one player keeps giving check and the other can't escape. Since the positions repeat, the game ends in a draw by repetition (or by agreement). It's the classic rescue for a player who's down material but has an active queen near the enemy king. See an example in the first exercise below.

## 5. The 50-move rule {#regra-50 "5. The 50-move rule"}

If both players make **50 moves each** with no **capture** and no **pawn move**, either player can claim a draw. After 75 moves each under the same conditions, the draw is automatic.

The rule exists so nobody can play on forever in a position where no progress is being made. In practice, it matters in endgames: the winning side needs to know the mating method (see [basic checkmates](artigo:mates-basicos)) so they don't run out of moves.

## 6. Time runs out, but no mate is possible {#tempo "6. Time and material"}

In games with a clock, running out of time loses. But there's an exception: if your opponent **can't possibly checkmate** you (for example, if they only have a king left), the game is drawn instead. For more on time controls, see [classical, rapid, blitz and bullet](artigo:ritmos-de-jogo).

## When a draw is a good result {#bom-resultado "When a draw is good"}

Drawing isn't the same as giving up. In a tournament, half a point from a lost position is half a point more in the standings. So it pays to keep two opposite attitudes in mind:

- **When you're winning**, avoid the draw: watch out for stalemate, don't let your opponent's queen give perpetual check to your king, and convert your advantage before the 50-move rule comes into play.
- **When you're losing**, look for a draw before resigning: a perpetual check, a forced stalemate, trading off the last piece your opponent could mate with. Plenty of "lost" games end in a draw because the defender kept looking.

The exercises below train both sides.

## Exercises {#exercicios "Exercises"}

```exercicio
fen: 6k1/6p1/5p2/8/8/1q6/2r1QPPP/6K1 w - - 0 1
enunciado: White is a rook down and the queen is attacked. Find the checks that save the game with **perpetual check**.
tipo: tatica
solucao: e2e8 g8h7 e8h5
dica: Start with a check along the 8th rank. Where can the black king go? And from there, what's the next check?
explicacao: 1.Qe8+ Kh7 2.Qh5+ Kg8 3.Qe8+ — the black king has only one square after each check, and Black's pieces can't block. White keeps repeating the checks and the game is drawn by repetition.
```

```exercicio
fen: k7/p2Q4/P6r/8/8/8/6PP/1R4NK b - - 0 1
enunciado: Black is lost: White is threatening mate. But the black king has no moves at all. Find the move that saves the game.
tipo: tatica
solucao: h6h2
dica: If Black's rook disappears from the board, Black has no legal moves. How can you force White to take it?
explicacao: 1...Rxh2+! — the white king has to capture (2.Kxh2), because g1 and g2 are occupied by White's own pieces. After that, Black has no move and isn't in check: stalemate, and the game is a draw.
```

```exercicio
fen: 5K1k/Q7/8/8/8/8/8/8 w - - 0 1
enunciado: Now the other way around: White is winning. Deliver **mate in 1** without stalemating the black king.
tipo: mate
lances: 1
solucao: a7g7
dica: Which square next to the black king is protected by the white king?
explicacao: 1.Qg7# — the queen checks from right next to the king, protected by the king on f8. By contrast, 1.Qf7?? takes away all the black king's squares without giving check: stalemate.
```

## Frequently asked questions {#faq "FAQ"}

### What are the ways a chess game can be drawn?

Agreement between the players, stalemate, threefold repetition, the 50-move rule and a dead position (insufficient material). It's also a draw when a player runs out of time but the opponent has no way to checkmate.

### Is king and rook vs. king a draw?

No. King and rook vs. king is a win, just like king and queen vs. king. King and bishop, or king and knight, against a lone king are draws.

### What is perpetual check?

A series of checks the king can't escape. Since the position keeps repeating, the game is drawn.

### Do the three repetitions have to be in a row?

No. The same position just has to occur three times in the game, with the same player to move and the same castling and en passant rights.

### How much is a draw worth in a tournament?

Usually half a point for each player (a win is worth 1 and a loss 0).

:::pratique Practice endgames against the computer
Play the computer on Medium. When you're winning, watch out for stalemate; when you're losing, look for a perpetual check before you resign.
:::
