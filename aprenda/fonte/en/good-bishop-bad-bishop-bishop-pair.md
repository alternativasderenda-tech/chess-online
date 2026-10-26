---
id: bispos
titulo: "Good Bishop, Bad Bishop and the Bishop Pair"
titulo_seo: Good Bishop, Bad Bishop, Bishop Pair | Chess Online
descricao: What good and bad bishops are, why the bishop pair is an advantage, when a bishop is worth more than a knight, and how to handle opposite-colored bishops.
nivel: avancado
ordem: 20
publicado: 2026-10-26
atualizado: 2026-10-26
tags: [good bishop, bad bishop, bishop pair, bishop vs knight, opposite colored bishops, chess strategy]
jogar: 3
relacionados: [estrategia-posicional, estrutura-de-peoes, valor-das-pecas, finais-de-peao]
ensina: [Good and bad bishops, Bishop pair, Bishop versus knight, Opposite-colored bishops]
---
A **good bishop** is one whose own pawns are fixed on squares of the opposite color, leaving its diagonals open; a **bad bishop** is one stuck behind its own pawns, fixed on squares of its color. The **bishop pair** — having both bishops against bishop and knight, or against two knights — is a recognized advantage, especially in open positions, because together the two bishops control squares of both colors. These three ideas explain many of the trading decisions in the middlegame and the endgame.

## Why square color matters {#cor}

A bishop spends the whole game on squares of a single color. That has a direct consequence: **your own** pawns on that color block its path, while pawns on the other color don't get in its way at all. Since fixed pawns don't move, the pawn structure decides, for a long time, whether your bishop will be a strong piece or a "tall pawn".

The practical rule follows from that: **put your pawns on the opposite color of your bishop**. That way bishop and pawns complement each other — the pawns control squares of one color and the bishop those of the other.

## Good bishop and bad bishop {#bom-ruim}

```tabuleiro
fen: 5k2/3b1p2/p3p1p1/1p1pP2p/1P1P1P1P/2P3P1/4BK2/8 w - - 0 1
casas: d5:vermelha e6:vermelha b5:vermelha d7:vermelha e2:verde
legenda: Good bishop versus bad bishop: White's pawns stand on dark squares and the light-squared white bishop has open diagonals. Black's pawns stand on light squares and lock in the bishop on d7.
```

In this diagram every black pawn stands on a light square, the same color as the d7 bishop. The black bishop attacks nothing and spends the game defending its own pawns. The white bishop, on the other hand, has free squares to maneuver and sees Black's light-square pawns as targets: b5 and h5 are already in its sights.

Note that "bad" describes the bishop's relationship with its pawns, not its immediate usefulness. A bad bishop can be an important defender; the trouble is that it can almost never attack.

What to do with a bad bishop:

1. **Trade it**, ideally for your opponent's good bishop or for a strong knight.
2. **Get it outside the pawn chain.** A bad bishop placed in front of its pawns (for example on g4 or b5) can be quite active.
3. **Change the structure** with a pawn break that frees its diagonals.

## The bishop pair {#par}

Two bishops together don't share the weakness of a lone bishop: they control squares of both colors. In open positions, with clear diagonals, they sweep from one wing to the other in a single move, cut off the enemy king and dominate knights.

```tabuleiro
fen: 2r2rk1/pp3ppp/2n1b3/8/8/1P1B4/PB3PPP/2R2RK1 w - - 0 1
setas: b2g7:azul d3h7:azul
legenda: The bishop pair in an open position: the bishops on b2 and d3 aim at Black's castled king along the a1-h8 and b1-h7 diagonals.
```

How to **use** the bishop pair:

- **Open the position.** Pawn breaks and pawn trades favor the bishops.
- **Trade the other pieces**, not the bishops. In an endgame with pawns on both wings, the bishop pair is often decisive.
- **Take squares away from the knights** with pawn advances, so they never find an outpost.

How to **fight** the bishop pair:

- **Keep the position closed**, with pawn chains that block the diagonals.
- **Trade off one of the bishops** as soon as you can.
- **Plant a knight on an outpost**, where no pawn can attack it.

## Bishop versus knight {#bispo-cavalo}

A bishop and a knight are each [worth about three pawns](artigo:valor-das-pecas), but they shine in different positions:

| Situation | Usually better |
| --- | --- |
| Open position, few pawn chains | Bishop |
| Pawns on both wings, endgame | Bishop |
| Closed position, locked chains | Knight |
| An outpost is available | Knight |
| Opponent's pawns fixed on the bishop's color | Knight, if the bishop is bad |

This table explains many "strange" trades by strong players: giving up the bishop pair to close the position, or trading a good knight for a bishop that looked harmless.

## Opposite-colored bishops {#cores-opostas}

When each side has a single bishop and they travel on different colors, they never confront each other. That has a double effect:

- **In the endgame**, they are the best drawing chance for the side that is pawns down: the defender blockades the pawns on squares of its own bishop's color, and the enemy bishop can't drive it away.
- **In the middlegame**, they favor the attacker: the attacker's bishop works on squares the defending bishop can't protect, as if it were an extra piece.

```tabuleiro
fen: 8/8/2b1k3/8/4PP2/2B1K3/8/8 w - - 0 1
casas: e5 f5:verde e4 f4
legenda: Opposite-colored bishops: even two pawns up and with White to move, the endgame tablebase confirms a draw. Black's king and bishop watch the squares the pawns need.
```

## How to tell whether your bishop is good {#teste}

A quick test: count your **fixed** pawns — the ones that can no longer advance — and see what color they stand on.

- If most of them are on **the same color** as your bishop, it tends to be bad. Think about trading it, putting it in front of the pawns or changing the structure.
- If most of them are on **the opposite color**, it tends to be good. Keep it and look to open its diagonals.
- If the pawns are still mobile, the bishop can still improve: when deciding where to fix your pawns, think about the bishop that will remain.

The same test works for your opponent's bishop. Fixing their pawns on their bishop's color — for example, by blockading them with yours — turns a reasonable bishop into a bad one.

## Exercises

```exercicio
fen: 2kr3r/pp1nqpbp/2n1p1p1/8/5B2/2N2Q2/PPP2PPP/3R1BK1 w - - 0 1
enunciado: White's bishop pair aims at the black king on both colors. White to play and **mate in 2**.
tipo: mate
lances: 2
solucao: f3c6 b7c6 f1a6
dica: The f4 bishop already covers b8 and c7. Open the other bishop's diagonal to the king.
explicacao: 1.Qxc6+! bxc6 2.Ba6#. The two bishops criss-cross the escape routes: the f4 bishop covers b8 and c7, the a6 bishop gives check and covers b7, and Black's own knight and rook block d7 and d8. This is Boden's mate.
```

```exercicio
fen: 8/8/3k4/PK6/3B4/8/8/8 b - - 0 1
enunciado: White has a bishop and a rook pawn, but the bishop is dark-squared and the promotion square, a8, is light. Black to play and draw — only one move saves the game.
solucao: d6c7
dica: Run for the corner the bishop doesn't control.
explicacao: 1...Kc7! heads for b8 and a8. With the black king in the corner, the dark-squared bishop can never drive it out of a8, and the a-pawn can't promote. According to the endgame tablebase, every other move loses.
```

## Frequently asked questions {#faq}

### What is a bad bishop in chess?
A bishop whose own pawns are fixed on squares of its color. It gets stuck behind them and has little mobility.

### Is the bishop pair worth more than bishop and knight?
In open positions and in endgames with pawns on both wings, usually yes. In closed positions the advantage shrinks or disappears.

### Bishop or knight: which is better?
It depends on the structure. Bishops prefer open positions and pawns on both wings; knights prefer closed positions and outposts.

### Why are opposite-colored bishop endgames so drawish?
Because the defender blockades the pawns on squares of its own bishop's color, and the attacker's bishop has no way to contest those squares.

### What is the "wrong-colored bishop"?
A bishop that doesn't control the promotion square of a [rook pawn](artigo:finais-de-peao#peao-da-torre). Against it, a defending king that reaches the corner draws.
