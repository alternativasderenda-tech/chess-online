---
id: espeto
titulo: Skewer in Chess: the Tactic That Goes Through a Piece
titulo_seo: Skewer in Chess: What It Is and How to Use It | Chess Online
descricao: What a skewer is in chess, skewer vs pin, the skewer with check and the classic rook-endgame trick. With 3 interactive puzzles to practise.
nivel: intermediario
ordem: 25
publicado: 2026-10-26
atualizado: 2026-10-26
tags: [skewer, chess skewer, x-ray, chess tactics, pin and skewer, rook endgame]
jogar: 2
relacionados: [taticas, cravada, garfo, mate-do-corredor]
ensina: [Skewer, Absolute skewer, Relative skewer]
---
A **skewer** is an attack along a line against a valuable piece which, when it steps out of the way, exposes another piece standing behind it. It is the reverse of a pin: in a pin the front piece is worth less and does not want to move; in a skewer the front piece is worth more and is forced to move, giving up the one behind.

## How a skewer works {#como-funciona "How a skewer works"}

Like the pin, the skewer is the work of the long-range pieces: **bishop, rook and queen**. There are three pieces on the same line:

1. the **skewering piece**, which attacks;
2. the **front piece**, the more valuable one, which must move;
3. the **back piece**, which is left exposed and gets captured.

The name comes from the kebab skewer: one attack runs through both pieces. You will sometimes hear it called an **X-ray**, although that term usually describes a slightly different idea (a piece exerting influence *through* another one).

```tabuleiro
fen: 4q3/8/8/4k3/8/8/5PPP/4R1K1 b - - 0 1
setas: e1e5:vermelha e5e8
casas: e5:vermelha e8
legenda: The e1 rook checks the king on e5. Once the king leaves the file, the rook takes the queen on e8.
```

## Absolute skewer: the king in front {#absoluto "Absolute skewer"}

When the front piece is the **king**, the skewer comes with check. Your opponent has no choice: the king must leave the line, and the piece behind falls. This is the strongest form of skewer, because there is no counter-attacking defence, unless the check can be blocked by a protected piece.

```tabuleiro
fen: 7r/8/5k2/8/3B4/8/5PPP/6K1 b - - 0 1
setas: d4f6:vermelha f6h8
casas: f6:vermelha h8
legenda: The d4 bishop checks the king on f6. Behind the king, on the same diagonal, is the h8 rook.
```

## Relative skewer {#relativo "Relative skewer"}

When the front piece is the queen or a rook, there is no check, and your opponent can try something else: protect the back piece, counter-attack or trade. Even so, a relative skewer usually wins material, especially when the skewering piece is protected.

```tabuleiro
fen: 6rk/8/8/3q4/8/1B6/P4PPP/6K1 b - - 0 1
setas: b3d5:vermelha d5g8
casas: d5:vermelha g8
legenda: The b3 bishop, protected by the a2 pawn, attacks the queen on d5. If she leaves the diagonal, the bishop takes the g8 rook.
```

## Skewer vs pin {#espeto-x-cravada "Skewer vs pin"}

| | Pin | Skewer |
|---|---|---|
| Front piece | worth **less** | worth **more** |
| What it does | stays stuck | is forced to move |
| Who loses material | the front piece (or the back one, if the front moves) | the back piece |
| Pieces that do it | bishop, rook, queen | bishop, rook, queen |

An easy way to remember it: in a [pin](artigo:cravada), the stuck piece is the one in front; in a skewer, the victim is the one behind.

## The rook-endgame trick {#final-de-torre "The rook-endgame trick"}

Skewers are everywhere in rook endgames. The typical case: White's rook stands in front of its own pawn (on a8, with the pawn on a7), and Black's rook is behind the pawn on the a-file. If Black's king is on the wrong square, White has a shot: the rook leaves a8 for h8, and if Black's rook grabs the pawn, White's rook checks along the seventh rank and wins the rook with a skewer.

With Black's king on g7 or h7 the trick fails, because the king covers h7 (or is already standing there). That is why the defender in this kind of ending should keep the king on those squares. The last puzzle in this article shows the winning version.

:::dica
**💡 Tip:** whenever your opponent's king and a valuable piece share a line with empty squares between them, look for a check along that line. This works for skewers and pins alike.
:::

## Where to look for skewers {#onde-procurar "Where to look"}

Skewers appear in very recognisable situations. It is worth checking each of them whenever they come up:

- **Kings in the centre in the endgame.** Once the queens are off, the king becomes an active piece and walks around the board. That is great for the endgame, but it exposes the king to checks along a line with a rook or a passed pawn behind it.
- **Open long diagonals.** A bishop on b2 or g2 (or b7 and g7) sees across the whole board. King and queen on the same long diagonal are an invitation.
- **Pieces at both ends of the same rank.** Rooks and kings on the same rank with no pawns in between are classic targets for rook or queen skewers.
- **Pawns about to promote.** A skewer can also win a freshly promoted queen: if your opponent promotes on a square lined up with their own king, a rook or bishop can give check and take the new queen from behind.

A good way to train your eye is, after each of your opponent's moves, to trace the lines coming out of their king and see what stands behind.

## How to avoid skewers {#defesa "How to avoid"}

- **Do not line up your king and valuable pieces** on open diagonals, files or ranks, especially in the endgame, when the king walks around the centre.
- **Protect the back piece** when the alignment cannot be avoided: a skewer gains little if the back piece is defended.
- **Keep a block ready:** a piece that can interpose on the check defuses an absolute skewer.

:::pratique Practise skewers now
Play an endgame against the computer and watch the open lines. At Medium level the enemy king often ends up lined up with pieces in the endgame.
:::

## Skewer puzzles {#exercicios "Puzzles"}

```exercicio
fen: 7q/pp6/6p1/4k2p/8/7P/PP1B2P1/1K1R4 w - - 0 1
enunciado: White to move **wins the queen** with a skewer.
solucao: d2c3 e5e6 c3h8
dica: The king on e5 and the queen on h8 are on the same long diagonal.
explicacao: 1.Bc3+ checks the king along the a1–h8 diagonal. The king must leave it, and 2.Bxh8 takes the queen.
```

```exercicio
fen: 8/p5p1/5p2/3k3r/8/1P4P1/5P1P/R5K1 w - - 0 1
enunciado: White to move **wins the rook** with a skewer.
solucao: a1a5 d5e6 a5h5
dica: Black's king and rook are on the same rank. The a-file is open.
explicacao: 1.Ra5+ checks along the fifth rank. The king moves away, and 2.Rxh5 takes the undefended rook.
```

```exercicio
fen: R7/P4k2/8/8/8/1P3K2/8/r7 w - - 0 1
enunciado: Rook endgame. White to move **wins Black's rook**.
solucao: a8h8 a1a7 h8h7 f7e6 h7a7
dica: White's rook is in the way of its own pawn. What if it leaves a8 for a square from which it can check along the seventh rank?
explicacao: 1.Rh8! threatens to promote. If 1...Rxa7, 2.Rh7+ is a skewer: the king leaves the seventh rank and 3.Rxa7 wins the rook. If Black does not take the pawn, 2.a8=Q wins just the same.
```

## Frequently asked questions {#faq "FAQ"}

### What is the difference between a skewer and a pin?

In a pin the front piece is worth less and stays stuck; in a skewer the front piece is worth more and is forced to move, leaving the back piece to be captured.

### Which pieces can skewer?

The bishop, rook and queen, the only pieces that attack along lines.

### Are a skewer and an X-ray the same thing?

Many players use the words interchangeably. Strictly speaking, "X-ray" describes a piece exerting influence *through* another (for example, a rook defending a square behind an enemy rook), while the skewer is the blow that forces the front piece to move.

### Where do skewers show up most?

In endgames, when the kings come out to the centre and get lined up with rooks and queens. See also the overview of [chess tactics](artigo:taticas).
