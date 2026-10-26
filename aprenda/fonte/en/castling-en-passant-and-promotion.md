---
id: lances-especiais
titulo: Castling, En Passant and Promotion Explained
titulo_seo: Castling, En Passant and Promotion | Chess Online
descricao: How the three special moves in chess work — castling, en passant and pawn promotion — with the FIDE conditions, diagrams and exercises for beginners.
nivel: iniciante
ordem: 36
publicado: 2026-10-26
atualizado: 2026-10-26
tags: [castling, en passant, pawn promotion, kingside castling, queenside castling, special moves in chess]
jogar: 1
relacionados: [como-as-pecas-se-movem, regras, tabuleiro-e-notacao, principios-de-abertura]
ensina: [Castling, En passant capture, Pawn promotion]
---
Chess has three special moves that break the pieces' normal movement: **castling**, where the king and a rook move together in a single turn; the **en passant** capture, where a pawn captures an enemy pawn that has just advanced two squares beside it; and **promotion**, where a pawn that reaches the last rank becomes a queen, rook, bishop or knight. All three are perfectly legal and come up often, so every beginner needs to know them.

## Castling {#roque "Castling"}

**Castling** is the only move in which a player moves two pieces at once: the king and a rook. It does two jobs: it **gets the king to safety**, away from the center, and it **activates the rook**, bringing it toward the middle of the board.

There are two kinds:

- **Kingside castling** (short castling), written **O-O**: the king moves two squares toward the h1-rook (from e1 to g1) and the rook hops over it to f1.
- **Queenside castling** (long castling), written **O-O-O**: the king moves two squares toward the a1-rook (from e1 to c1) and the rook goes to d1.

Black does exactly the same on the 8th rank: e8–g8 with the rook to f8, or e8–c8 with the rook to d8.

```tabuleiro
fen: r3k2r/pppppppp/8/8/8/8/PPPPPPPP/R3K2R w KQkq - 0 1
setas: e1g1 h1f1 e1c1:azul a1d1:azul
legenda: Kingside castling (green): king from e1 to g1, rook from h1 to f1. Queenside castling (blue): king from e1 to c1, rook from a1 to d1.
```

### When you're allowed to castle

Under FIDE rules, you may castle only if **all** of these are true:

1. The king **has never moved** during the game.
2. The rook you're castling with **has never moved**.
3. There are **no pieces** between the king and that rook.
4. The king is **not in check** right now.
5. The king does **not pass through** a square attacked by the opponent.
6. The king does **not land** on an attacked square (that would be moving into check).

Notice that the last three conditions are all about the **king**. The rook may be under attack, and in queenside castling it may pass over an attacked square (b1 or b8).

Once the king has moved, castling is gone for good, on both sides. If only one rook has moved, you lose castling on that side. A check or a piece in the way only stops castling **for that moment**.

:::aviso
**⚠️ Watch out:** in over-the-board games, start castling **with the king**. If you touch the rook first, the rules don't let you castle on that move. On this site's board, just move the king two squares and the rook follows on its own.
:::

### Common castling mistakes

- **Castling too late.** Waiting too long leaves the king in the center just as the files open up.
- **Castling into an attack.** If your opponent already has pieces and pawns aimed at one side of the board, taking your king there can be worse than waiting. Look first at where the king is going.
- **Moving the king "just a little".** A single king step, even if it returns to e1 later, costs you the right to castle for the rest of the game.

## En passant {#en-passant "En passant"}

*En passant* is French for "in passing". It's a capture only pawns can make, and only in one situation:

1. Your pawn stands on your **5th rank** (rank 5 for White, rank 4 for Black).
2. An enemy pawn on a **neighboring file** advances **two squares** from its starting square and lands **right beside** yours.
3. **On the very next move**, your pawn may capture it as if it had moved only one square: you move to the square it "passed through", and the enemy pawn is removed.

```tabuleiro
fen: k7/8/8/3Pp3/8/8/8/7K w - e6 0 1
setas: d5e6
casas: e5:vermelha e6:verde
legenda: Black has just played e7–e5, slipping past White's pawn on d5. White can capture en passant: the pawn moves to e6 and the pawn on e5 is removed.
```

The rule exists because of the two-square advance: without it, a pawn could "sneak past" the square that the neighboring pawn attacks. Capturing en passant is **not mandatory**, but if you don't do it on the very next move, the chance is gone.

In notation it's written like a normal pawn capture, with the arrival square: `dxe6`, sometimes followed by `e.p.`.

## Promotion {#promocao "Promotion"}

When a pawn reaches the last rank (the 8th for White, the 1st for Black), it's **promoted**: as part of the same move, it's replaced by a **queen, rook, bishop or knight of the same color**, whichever the player chooses. It can't become a king or stay a pawn.

```tabuleiro
fen: k7/4P3/8/8/8/8/8/7K w - - 0 1
setas: e7e8
casas: e8:verde
legenda: The e7-pawn advances to e8 and is promoted. In notation: e8=Q if it becomes a queen.
```

Two details that surprise beginners:

- **Your choice doesn't depend on captured pieces.** You can have two queens (or more) at once, even if your original queen is still on the board.
- **The new piece acts right away.** If the new queen gives check, it's check immediately.

Almost everyone picks a queen, the strongest piece. Choosing anything else is called **underpromotion**: a knight, for example, can give a check a queen couldn't, and a rook or bishop can avoid stalemate.

:::dica
**💡 Tip:** a pawn with no enemy pawns ahead of it, on its own file or the neighboring files, is a **passed pawn**. It's dangerous precisely because it can run for promotion. In the endgame, pushing a passed pawn often decides the game.
:::

## Exercises {#exercicios "Exercises"}

```exercicio
fen: r1bqk1nr/pppp1ppp/2n5/2b1p3/2B1P3/5N2/PPPP1PPP/RNBQK2R w KQkq - 4 4
enunciado: After 1.e4 e5 2.Nf3 Nc6 3.Bc4 Bc5, White can castle. Play **kingside castling** (4.O-O).
tipo: tatica
solucao: e1g1
dica: Move the king two squares toward the rook on h1.
explicacao: 4.O-O — the king goes from e1 to g1 and the rook from h1 to f1. The king is now sheltered by the f2, g2 and h2 pawns, and the rook is ready to join the game.
```

```exercicio
fen: 8/4N3/7p/R2pP2k/8/6K1/8/8 w - d6 0 1
enunciado: Black has just played ...d7–d5. White has **mate in 1** with a special move.
tipo: mate
lances: 1
solucao: e5d6
dica: The rook on a5 is stuck behind two pawns on the 5th rank. One move clears both out of the way.
explicacao: 1.exd6 e.p.# — the e5-pawn captures en passant: it moves to d6 and the d5-pawn is removed. The 5th rank opens and the rook on a5 checks the king on h5. The white king covers g4 and h4, the knight covers g6 and the rook covers g5; h6 is blocked by Black's own pawn.
```

```exercicio
fen: 3k4/5P2/2K5/8/8/8/8/8 w - - 0 1
enunciado: Promote the pawn and deliver **mate in 1**. Pay attention to which piece you choose.
tipo: mate
lances: 1
solucao: f7f8q
dica: The white king covers c7 and d7. The new piece must give check and also cover e7.
explicacao: 1.f8=Q# — the queen checks along the 8th rank and covers e7 diagonally; c7 and d7 are covered by the white king. A rook (1.f8=R+) would also give check, but the king would escape to e7.
```

## Frequently asked questions {#faq "FAQ"}

### Can I castle after I've been in check?

Yes, as long as your king hasn't moved. Being checked doesn't take away your right to castle; you just can't castle **while** you're in check.

### Can I castle if my rook is attacked?

Yes. The attacked-square restrictions only apply to the king: the square it starts on, the one it crosses and the one it lands on.

### Is en passant mandatory?

No. But it can only be played on the move immediately after the enemy pawn's two-square advance.

### Can I have two queens?

Yes. You can promote to a queen even if your original queen is still on the board.

### Can a pawn promote to a king?

No. The options are queen, rook, bishop or knight.

:::pratique Practice the special moves
Play the computer on Easy, castle early, and keep an eye out for en passant chances and pawns that can promote.
:::
