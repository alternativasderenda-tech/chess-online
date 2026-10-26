---
id: tabuleiro-e-notacao
titulo: The Chessboard and Chess Notation Explained
titulo_seo: Chessboard and Chess Notation Explained | Chess Online
descricao: How to set up a chessboard, what files, ranks and squares are, and how to read and write moves in algebraic notation, with examples and exercises.
nivel: iniciante
ordem: 12
publicado: 2026-10-26
atualizado: 2026-10-26
tags: [chessboard, chess notation, algebraic notation, chessboard coordinates, how to write chess moves]
jogar: 1
relacionados: [jogar-do-zero, como-as-pecas-se-movem, regras, lances-especiais]
ensina: [Chessboard setup, Square coordinates, Algebraic notation]
---
A chessboard is a square of 64 squares (8 × 8) in alternating light and dark colors, and **algebraic notation** is the system that gives every square a name — a letter from **a** to **h** for the file and a number from **1** to **8** for the rank — so that any move can be written down, like `e4` or `Nf3`. With these two ideas you can set up the game correctly, read books and articles, and follow any game. If you've never played, start with [how to play chess for beginners](artigo:jogar-do-zero).

## How to set up the board {#posicao "How to set up the board"}

First, turn the board the right way. The rule is short: **the corner square on each player's right-hand side is light** ("light on the right"). If it's dark, rotate the board 90 degrees.

Then the pieces:

- **Back rank** (left to right, from White's side): rook, knight, bishop, queen, king, bishop, knight, rook.
- **Second rank:** the eight pawns.
- **The queen starts on her own color:** the white queen on a light square, the black queen on a dark one. The king stands next to her.

White always moves first.

```tabuleiro
fen: rnbqkbnr/pppppppp/8/8/8/8/PPPPPPPP/RNBQKBNR w KQkq - 0 1
casas: h1:verde a8:verde d1 d8
legenda: The starting position. The corners h1 and a8, on each player's right, are light squares; the queens (d1 and d8) stand on their own color.
```

:::dica
**💡 Tip:** if the white queen is on a dark square, either the board is turned the wrong way or the king and queen have swapped places. Check before you start.
:::

## Files, ranks and diagonals {#coordenadas "Files, ranks and diagonals"}

To talk about a square, chess players use three words:

- **File:** a vertical line of squares. There are eight, named **a** to **h**, from left to right as White sees the board.
- **Rank:** a horizontal line of squares. There are eight, numbered **1** to **8**, starting from White's side.
- **Diagonal:** a line of same-colored squares that touch at the corners, such as a1–h8.

A square's name is its file letter followed by its rank number. Where the **e**-file meets the **4**th rank is the square **e4**. Every square has exactly one name, and it doesn't change when you play Black: e4 is still e4, even if from your side of the board it looks upside down.

```tabuleiro
fen: k7/8/8/8/8/8/8/7K w - - 0 1
casas: e1 e2 e3 e5 e6 e7 e8 a4:azul b4:azul c4:azul d4:azul f4:azul g4:azul h4:azul e4:verde
legenda: The e-file (yellow) crosses the 4th rank (blue) on the square e4 (green).
```

Some areas of the board have names too:

- **The center:** the four squares d4, e4, d5 and e5. Whoever controls the center usually gets more space.
- **Kingside:** the e- to h-files, where the king starts.
- **Queenside:** the a- to d-files, where the queen starts.

## Algebraic notation {#notacao "Algebraic notation"}

Algebraic notation is FIDE's official standard (FIDE is the International Chess Federation), and it's what you'll see in books, on websites and at tournaments. Each move is written as **the piece letter + the destination square**.

The piece letters in English are:

| Piece | Letter | Example |
|---|---|---|
| King | K | Ke2 |
| Queen | Q | Qh5 |
| Rook | R | Rd1 |
| Bishop | B | Bc4 |
| Knight | N | Nf3 |
| Pawn | (none) | e4 |

Pawns get no letter: `e4` means "a pawn moves to e4". The knight is **N** because K is already taken by the king. Other languages use other letters (in Portuguese a knight is C and a queen is D), but the squares are always the same, so a game written in any language stays readable.

### The symbols

- **x** — capture: `Bxf7` (the bishop captures on f7). For pawn captures you write the file the pawn came from: `exd5`.
- **+** — check: `Qh5+`.
- **#** — checkmate: `Qxf7#`.
- **O-O** — kingside (short) castling; **O-O-O** — queenside (long) castling.
- **=Q** — promotion: `e8=Q` (the pawn reaches e8 and becomes a queen).
- **e.p.** — an *en passant* capture (optional).

### Move numbers

Moves are numbered in pairs: each number covers one White move and Black's reply. That's why we write `1.e4 e5 2.Nf3 Nc6`: on move 1, White played e4 and Black played e5. When a text shows only Black's move, it uses an ellipsis: `2...Nc6`. When a puzzle says "mate in 1" or "mate in 2", it counts only the moves of the side delivering mate.

```tabuleiro
fen: r1bqkbnr/pppp1ppp/2n5/4p3/4P3/5N2/PPPP1PPP/RNBQKB1R w KQkq - 2 3
setas: g1f3 b8c6:azul
legenda: After 1.e4 e5 2.Nf3 Nc6: the white knight went from g1 to f3, and the black one from b8 to c6.
```

### When two pieces can reach the same square

Sometimes two knights (or two rooks) can go to the same square. Then you add the **file** the piece is leaving from; if both are on the same file, you add the **rank**:

- `Nbd2` — the knight on the **b**-file goes to d2 (not the one on f3).
- `R1e2` — the rook on the **1**st rank goes to e2.

```tabuleiro
fen: rnbqkb1r/ppp2ppp/4pn2/3p4/3P4/4PN2/PPP2PPP/RNBQKB1R w KQkq - 0 4
setas: b1d2 f3d2:vermelha
casas: d2
legenda: Both white knights can go to d2. Nbd2 is the knight from b1; Nfd2 would be the one from f3.
```

### Annotation marks

Books and analysis add marks after a move: **!** (good move), **!!** (brilliant move), **?** (mistake), **??** (blunder), **!?** (interesting) and **?!** (dubious). They're the annotator's opinion, not part of the rules.

## Why notation is worth learning {#por-que "Why it's worth learning"}

- **You can study.** Every chess book, article and video uses notation — including the other lessons on this site, such as [the rules of chess](artigo:regras).
- **You can review your games.** Writing down what happened is the first step to finding where things went wrong.
- **At over-the-board tournaments, recording the moves is mandatory** in slower games. The scoresheet is the official record of the game.

:::aviso
**⚠️ Watch out:** a common mistake is swapping file and rank, writing "4e" instead of "e4". The letter always comes first.
:::

## Exercises {#exercicios "Exercises"}

Read the move and play it on the board. Tap (or click) the piece, then the destination square.

```exercicio
fen: rnbqkbnr/pppp1ppp/8/4p3/4P3/8/PPPP1PPP/RNBQKBNR w KQkq e6 0 2
enunciado: The game started 1.e4 e5. Play **2.Nf3**.
tipo: tatica
solucao: g1f3
dica: "N" is the knight. Which white knight can reach f3?
explicacao: 2.Nf3 — the knight leaves g1 and lands on f3, attacking the pawn on e5. It's one of the most popular moves in this position.
```

```exercicio
fen: rnbqkbnr/ppp1pppp/8/3p4/4P3/8/PPPP1PPP/RNBQKBNR w KQkq d6 0 2
enunciado: After 1.e4 d5, play **2.exd5**.
tipo: tatica
solucao: e4d5
dica: The "e" tells you which file the pawn comes from, "x" means a capture, and "d5" is where the capture happens.
explicacao: 2.exd5 — the e-pawn captures the black pawn on d5, moving one square diagonally, as every pawn does when it captures.
```

```exercicio
fen: k7/8/8/4R3/8/8/8/4R1K1 w - - 0 1
enunciado: Both white rooks can go to e3. Play **R1e3**.
tipo: tatica
solucao: e1e3
dica: The rooks are on the same file, so a letter won't do: the "1" tells you which rank the rook comes from.
explicacao: 1.R1e3 — it's the rook on the 1st rank (the one on e1). The e5 rook could also reach e3 (that would be 1.R5e3); since both are on the e-file, the notation uses the rank number.
```

## Frequently asked questions {#faq "FAQ"}

### Which way does a chessboard go?

The board is set up correctly when the corner square on each player's right is light. For White, that square is h1.

### What's the difference between a file and a rank?

A file is a vertical line (letters a to h). A rank is a horizontal line (numbers 1 to 8). A square's name combines them: letter first, then number.

### What do "x", "+" and "#" mean in chess notation?

"x" means a capture, "+" means check and "#" means checkmate.

### Why is the knight "N" and not "K"?

Because "K" is already used for the king. Using N (the sound in "knight") avoids any confusion.

### Do I need to write down my moves when playing online?

No. The site records every move for you. But being able to read notation helps you review your games and study.

:::pratique Practice reading the board
Play a game against the computer on Easy and try to say each move out loud, like "e4" or "Nf3", before you play it.
:::

To keep going, see [how the chess pieces move](artigo:como-as-pecas-se-movem) and then the [special moves](artigo:lances-especiais), which have their own notation.
