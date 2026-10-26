---
id: finais-de-torre
titulo: "Rook Endgames: the Lucena and Philidor Positions"
titulo_seo: "Rook Endgames: Lucena and Philidor | Chess Online"
descricao: Learn the two positions every player must know in rook endgames — Lucena (building a bridge) and Philidor (rook on the third rank) — with exercises.
nivel: avancado
ordem: 30
publicado: 2026-10-26
atualizado: 2026-10-26
tags: [rook endgames, lucena position, philidor position, building a bridge, rook and pawn endgame, chess endgames]
jogar: 3
relacionados: [estrutura-de-peoes, calculo, rotina-de-treino]
ensina: [Lucena position, Philidor position, Building a bridge, Third-rank defense]
---
Rook endgames are the most common endgames in chess, and nearly all of their theory rests on two rook-and-pawn-versus-rook positions. The **Lucena position** is the model win: the side with the pawn wins by "building a bridge", using its own rook as a shield against checks. The **Philidor position** is the model draw: the weaker side holds by keeping its rook on its **third rank**, so the enemy king cannot advance, and then checking from behind. Once you know both, you can tell in seconds whether to go for a trade or avoid it.

## Why study rook endgames first {#por-que}

Rooks are the last pieces to leave the board. In tournament games, endgames with one rook each are the most common of all. They are also treacherous: an extra pawn is often not enough to win, and a single passive move can turn a draw into a loss.

The good news is that you don't need to memorize hundreds of positions. Three ideas take you a long way:

1. **Activity beats material.** An active rook that attacks pawns and gives checks often makes up for a missing pawn. A passive rook tied to defense loses.
2. **A cut-off king is a king that can't defend.** If your rook separates the enemy king from the pawn by a whole file or rank, you are effectively playing with an extra king.
3. **Lucena and Philidor are the destinations.** Almost every rook-and-pawn-versus-rook ending ends up in one of them. Knowing which one is on the horizon guides every move.

## The Lucena position: building a bridge {#lucena}

The Lucena position has four ingredients: the pawn on the seventh rank (not a rook pawn), the attacking king on the promotion square in front of it, the defending king cut off by at least one file, and the defending rook checking from the side. It is named after the Spaniard Luis Ramírez de Lucena, author of one of the first printed chess books, although the position does not actually appear in his book.

```tabuleiro
fen: 3K4/3P1k2/8/8/8/8/2r5/4R3 w - - 0 1
setas: e1e7
casas: d8 d7 f7
legenda: The Lucena position: White king on d8, pawn on d7, Black king cut off by the rook on the e-file. White to play and win.
```

White's problem is that the king is stuck on d8. As soon as it steps out, the black rook starts checking and the king has nowhere to hide. The solution comes in three steps:

1. **Push the black king one more file away** with a check: 1.Rf1+ Kg7.
2. **Bring the rook to the fourth rank**: 2.Rf4!. This is the key move. The rook attacks nothing; it just gets ready to become the shield.
3. **Walk the king out and block the check with the rook**: the king steps out, the checks arrive, and at the right moment the rook interposes.

A typical line is 2...Rc1 3.Ke7 Re1+ 4.Kd6 Rd1+ 5.Ke6 Re1+ 6.Kd5 Rd1+ 7.Rd4!. The white rook on d4 now blocks the check and shields the king, and the pawn will promote. The rook on the fourth rank was the "bridge" the king crossed.

```tabuleiro
fen: 8/3P2k1/8/3K4/3R4/8/8/3r4 b - - 0 1
setas: d4d1:vermelha
casas: d4:verde d7
legenda: The bridge is built: after 7.Rd4 the white rook blocks the checks on the d-file and the pawn promotes.
```

:::dica
**💡 Tip:** why the fourth rank? Because the king has to come down to the fifth rank to escape the checks, and the rook must sit right below it to interpose. With the rook on the fourth, king on d5 and rook on d4 close the file.
:::

## The Philidor position: the third-rank defense {#philidor}

The Philidor position is the defensive answer. It is named after François-André Danican Philidor, the great 18th-century French player who analyzed it. The defending king sits on the pawn's promotion square (or right in front of the pawn), and the defending rook stands on **its own third rank** — for Black, that is the sixth rank of the board.

```tabuleiro
fen: 4k3/7R/1r6/3KP3/8/8/8/8 w - - 0 1
setas: b6g6
casas: c6:vermelha d6:vermelha e6:vermelha
legenda: The Philidor position: the black rook on b6 controls the sixth rank and the white king cannot advance.
```

The idea is simple: as long as the pawn is on the fifth rank, the black rook forbids the white king from stepping onto the sixth. Without the king's support, the pawn can't advance safely. If White plays e6 to make room for the king, the rook switches jobs at once: it drops to the first rank and starts **checking from behind**.

```tabuleiro
fen: 4k3/7R/4P3/3K4/8/8/8/1r6 w - - 0 1
setas: b1b5:azul
casas: e6
legenda: After 1.e6 Rb1: the pawn on e6 no longer shelters the white king, which is exposed to checks along the file and the rank.
```

With the pawn on e6, the white king has lost the only shelter it had: the square in front of its own pawn is now occupied. The black rook gives check after check and the king can't hide. It's a draw.

:::aviso
**⚠️ Careful:** after e6, bringing the rook back to the eighth rank (Rb8) **loses**. The rook must go far away, to the first or second rank, where it has room to check. A rook close to the enemy king doesn't give checks; it gets forked.
:::

## The classic mistake: passive defense {#defesa-passiva}

Many players know that "the king must stay in front of the pawn" and think that is enough. It isn't. If the defending rook stays on the eighth rank and the attacking king reaches the sixth, the rook loses the distance it needs for checks and the defense collapses. That is why the order in the Philidor matters: **first the rook on the third rank, only later the checks from behind**.

Sometimes the defender is late and still has one last resource: a side check that pushes the king back and regains the third rank. The second exercise below shows exactly that.

## Exercises

```exercicio
fen: 8/3P4/8/3K2k1/5R2/8/8/3r4 w - - 0 1
enunciado: A Lucena in progress. Black has just checked on d1 and the black king is attacking the rook on f4. White to play and win.
solucao: f4d4
dica: The rook is already on the fourth rank. Which single move shields the king and saves the rook at the same time?
explicacao: 1.Rd4! builds the bridge: the rook blocks the check, escapes the black king's attack, and the pawn promotes next. According to the endgame tablebase, every king move only draws (and Kc4 even loses): only the bridge wins.
```

```exercicio
fen: 1r2k3/7R/3K4/4P3/8/8/8/8 b - - 0 1
enunciado: Black left the rook on the eighth rank and the white king has already reached d6. Black to play and draw — there is only one move.
solucao: b8b6
dica: The rook has to get back to the sixth rank, and with tempo.
explicacao: 1...Rb6+! gives check and reoccupies the sixth rank. The white king is driven off it and the black rook controls it again: it's the Philidor defense once more. Every other move loses, because with the white king settled on the sixth and the black rook glued to the eighth, there is no room for checks.
```

## Practical rules to take to the board {#regras}

- **Cut off the king.** When attacking, use your rook to separate the defending king from the pawn. With the enemy king cut off and the pawn advanced, the road to the Lucena is open.
- **Rooks belong behind passed pawns.** Behind a passed pawn (yours or your opponent's), the rook gains strength with every advance. In front of it, it loses strength.
- **On defense, get active before you suffer.** Put the rook on the third rank while the enemy king hasn't arrived yet. When the pawn advances, switch to checks from behind.
- **Count files before trading pieces.** If the trade leads to a Lucena, great. If it leads to a Philidor, your opponent draws easily.

:::pratique Practice endgames against the AI
Set up a Lucena or a Philidor in a game against the computer and play both positions until you can build the bridge and check from behind without thinking.
:::

## Frequently asked questions {#faq}

### Is every rook-and-pawn versus rook ending a draw?
No. With the defending king in front of the pawn and an active rook, it is usually a draw (Philidor). With the defending king cut off and the attacking king in front of its own pawn on the seventh, it is usually a win (Lucena).

### What does "building a bridge" mean?
It's the Lucena method: bring the rook to the fourth rank, walk the king out from in front of the pawn and, when the checks come, interpose the rook to shield the king.

### Which rank does the rook use in the Philidor defense?
The defender's third rank (the sixth rank of the board when Black is defending). Once the pawn advances to that rank, the rook goes to the back and checks from behind.

### Why does passive defense on the eighth rank lose?
Because with the attacking king on the sixth rank, the rook has no room to give checks and the defending king gets pushed away from the front of the pawn.
