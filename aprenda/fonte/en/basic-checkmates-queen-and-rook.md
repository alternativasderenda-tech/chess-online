---
id: mates-basicos
titulo: Basic Checkmates with Queen and Rook
titulo_seo: "Basic Checkmates: Queen and Rook | Chess Online"
descricao: How to checkmate a lone king with king and queen, king and rook, or two rooks, step by step and without stalemating. With exercises for beginners.
nivel: iniciante
ordem: 55
publicado: 2026-10-26
atualizado: 2026-10-26
tags: [basic checkmates, queen checkmate, rook checkmate, two rook checkmate, ladder mate, how to checkmate]
jogar: 1
relacionados: [xeque-mate-e-afogamento, empates, finais-de-peao, finais-de-torre, mate-do-corredor]
ensina: [Two-rook checkmate, King and queen checkmate, King and rook checkmate]
---
The **basic checkmates** are the techniques for mating an opponent who has only a king left: **king and queen vs. king**, **king and rook vs. king**, and **two rooks vs. king**. All three are guaranteed wins as long as you know the method: drive the enemy king to the edge of the board and mate it there, without falling into stalemate. With correct play, the queen mate takes at most 10 moves and the rook mate at most 16, from any position.

## The common idea: drive the king to the edge {#ideia "The common idea"}

In the middle of the board, a lone king has up to 8 squares to run to. On the edge it has at most 5; in the corner, only 3. That's why every basic mate follows the same script:

1. **Shrink the enemy king's space**, as if it were inside a box that keeps getting smaller.
2. **Bring your own king** to help (in the queen and rook mates it's essential).
3. **Mate on the edge**, checking before every move that your opponent still has a legal move.

Step 3 is the most important. If the enemy king runs out of moves **without being in check**, it's stalemate and the game is a draw. Review the difference in [check, checkmate and stalemate](artigo:xeque-mate-e-afogamento).

## Two-rook checkmate: the ladder {#escada "Two-rook checkmate (the ladder)"}

This is the easiest one, and it doesn't even need your king. The rooks take turns, like the rungs of a ladder:

1. One rook **cuts off** a rank (the enemy king can't cross it).
2. The other gives **check** on the next rank, pushing the king back one more rank.
3. Repeat until the king reaches the last rank; the final check is mate.

```tabuleiro
fen: R3k3/1R6/8/8/8/8/8/6K1 b - - 3 2
setas: a8e8:vermelha
casas: e8:vermelha
legenda: The end of the ladder: the rook on b7 covers the whole 7th rank and the rook on a8 checks along the 8th. Checkmate.
```

:::dica
**💡 Tip:** if the enemy king walks up to one of your rooks to attack it, move that rook to the **far side** of the board and carry on with the ladder.
:::

## King and queen checkmate {#dama "King and queen checkmate"}

The queen can't mate on her own; she needs the king's help. The simplest method:

1. **Put the queen a knight's move away from the enemy king.** That builds a "box" around it without giving check.
2. **Shadow the king**: every time it moves, move the queen to keep the same distance, and the box shrinks until the king is stuck on the edge.
3. **Once the king is on the edge, stop squeezing with the queen** and bring your own king over.
4. **Deliver mate**: either with the queen right next to the enemy king, protected by your king, or along the edge with your king covering the squares in front.

```tabuleiro
fen: 4k3/4Q3/3K4/8/8/8/8/8 b - - 1 1
casas: e8:vermelha
legenda: Queen mate: the queen on e7, right next to the black king and protected by the white king, covers every escape square.
```

:::aviso
**⚠️ Beware of stalemate.** With the enemy king cornered, almost any "tight" queen move takes away its squares without giving check. Once it's down to two or three squares, bring your king over before moving the queen again.
:::

## King and rook checkmate {#torre "King and rook checkmate"}

The rook needs the king too, and the process takes a little longer:

1. **[Cut the king off](artigo:finais-de-torre) with the rook**: put it on a file or rank the king can't cross.
2. **Bring your king** in front of the enemy king, with one square between them. This standoff, where the kings face each other and neither can step forward, is called **[opposition](artigo:finais-de-peao)**.
3. **When the kings are in opposition, check with the rook**: the enemy king is pushed back one rank (or file).
4. **If the kings aren't face to face yet, bring your king closer.** When it's one step from the opposition, make a **waiting move** with the rook, staying on the cut-off line. The enemy king either steps into the opposition and gets checked, or backs away and you follow it with your king.
5. Repeat until you reach the edge. The final check comes with the kings face to face.

```tabuleiro
fen: 8/8/2k5/8/8/8/3R4/4K3 w - - 0 1
setas: d2d8:vermelha
legenda: The rook on d2 cuts off the d-file: the black king can't cross over to the d- to h-files. Now the white king walks up.
```

```tabuleiro
fen: 3k3R/8/3K4/8/8/8/8/8 b - - 1 1
setas: h8d8:vermelha
casas: d8:vermelha
legenda: The rook mate: the kings face each other (opposition), the white king covers c7, d7 and e7, and the rook checks along the 8th rank.
```

:::dica
**💡 Tip:** keep the rook **far away** from the enemy king. If the king gets close and your king isn't protecting the rook, slide it to the other end of the same line.
:::

## What about the 50-move rule? {#regra-50 "What about the 50-move rule?"}

If 50 moves pass on each side with no capture and no pawn move, the game can be declared a draw (see [draws in chess](artigo:empates)). The basic mates fit comfortably within that limit — but only if you have a method. Shuffling pieces around without a plan is the most common way to run out of moves.

## Exercises {#exercicios "Exercises"}

```exercicio
fen: 4k3/8/3K1Q2/8/8/8/8/8 w - - 0 1
enunciado: King and queen vs. king. Deliver **mate in 1**.
tipo: mate
lances: 1
solucao: f6e7
dica: The queen can stand right next to the black king, as long as your king protects her.
explicacao: 1.Qe7# — the queen checks from right beside the king and is protected by the king on d6. She covers d8, f8, d7 and f7, and the black king can't take her.
```

```exercicio
fen: 3k4/8/3K4/8/8/8/8/7R w - - 0 1
enunciado: The kings are in opposition. Deliver **mate in 1** with the rook.
tipo: mate
lances: 1
solucao: h1h8
dica: The white king already covers c7, d7 and e7. All you need is a check along the back rank.
explicacao: 1.Rh8# — the rook checks along the 8th rank, and the squares on the 7th rank are covered by the white king.
```

```exercicio
fen: 8/4k3/R7/8/8/8/8/1R4K1 w - - 0 1
enunciado: Two rooks vs. king. Use the ladder and deliver **mate in 2**.
tipo: mate
lances: 2
solucao: b1b7 e7e8 a6a8
dica: The rook on a6 already cuts off the 6th rank. Use the other one to push the king back one more rank.
explicacao: 1.Rb7+ (the king must go to the 8th rank) Ke8 2.Ra8# — the rook on b7 covers the 7th rank and the rook on a8 mates along the 8th. If the king goes to d8 or f8 instead, the mate is the same.
```

```exercicio
fen: 3k4/8/2K5/8/7R/8/8/8 w - - 0 1
enunciado: King and rook vs. king. White has **mate in 2**.
tipo: mate
lances: 2
solucao: h4e4 d8c8 e4e8
dica: First cut off the black king's escape toward the kingside. It will have only one square left.
explicacao: 1.Re4! Kc8 (the only move) 2.Re8# — the rook takes away e7 and e8; the black king is forced to c8, and the check along the 8th rank is mate because b7, c7 and d7 are covered by the white king.
```

## Frequently asked questions {#faq "FAQ"}

### Can you checkmate with just a king and rook?

Yes. King and rook vs. king is always a win, using the method of cutting the king off and using the opposition.

### How many moves does the queen mate take?

With perfect play, at most 10 moves from any position. In practice beginners take a few more, and that's fine.

### Why did my opponent end up stalemated?

Because their king wasn't in check and had no legal move. It usually happens when the queen squeezes the king in the corner too tightly. Bring your king over before taking away the last square.

### Can you checkmate with king and bishop, or king and knight?

No. A lone bishop or a lone knight (plus the king) can't checkmate, and the game is a draw by insufficient material. With **bishop and knight** together mate is possible, but it's much harder.

### Do I need my king for the two-rook mate?

No. Two rooks can mate on their own, taking turns giving check like the rungs of a ladder.

:::pratique Drill the endgame against the computer
Play the computer on Easy and, once you're well ahead in material, trade pieces and try to deliver the queen or rook mate with the method from this lesson.
:::
