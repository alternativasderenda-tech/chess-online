---
id: cravada
titulo: Pin in Chess: Absolute, Relative and How to Exploit It
titulo_seo: Pin in Chess: Absolute and Relative Pins | Chess Online
descricao: What a pin is in chess, the difference between absolute and relative pins, how to attack a pinned piece and how to break free. With 3 interactive puzzles.
nivel: intermediario
ordem: 20
publicado: 2026-10-26
atualizado: 2026-10-26
tags: [pin, chess pin, absolute pin, relative pin, pinned piece, chess tactics]
jogar: 2
relacionados: [taticas, espeto, garfo, gambito-da-dama-e-london, abertura-italiana]
ensina: [Pin, Absolute pin, Relative pin]
---
A **pin** happens when an attacked piece cannot (or should not) move, because a more valuable piece stands behind it on the same line. If the piece behind is the king, the pin is **absolute** and moving the front piece is illegal; if it is the queen, a rook or another piece, the pin is **relative**: moving is allowed, but it costs material.

## How a pin works {#como-funciona "How a pin works"}

Only three pieces can pin: the **bishop, rook and queen**, the long-range pieces. A pin always involves three pieces on the same line (diagonal, file or rank):

1. the **pinning piece**, which attacks;
2. the **pinned piece**, stuck in the middle;
3. the **shielded piece** behind it, which is worth more.

The pinned piece stays on the board, but it is nearly paralysed: it cannot leave the line without exposing what is behind it. Very often it also stops defending the squares it used to cover.

## Absolute pin {#absoluta "Absolute pin"}

When the piece behind is the **king**, the rules forbid moving the pinned piece off the line, because that would leave your own king in check. That is why it is called absolute: there is no choice.

```tabuleiro
fen: r1bqkbnr/ppp2ppp/2np4/1B2p3/4P3/5N2/PPPP1PPP/RNBQK2R w KQkq - 0 4
setas: b5e8:vermelha
casas: c6 e8:vermelha
legenda: After 1.e4 e5 2.Nf3 Nc6 3.Bb5 d6, the knight on c6 is pinned: the king on e8 is right behind it on the diagonal.
```

In this position the c6 knight cannot move at all. An absolute pin is the perfect moment to attack the pinned piece with something cheaper, such as a pawn: it has nowhere to run.

## Relative pin {#relativa "Relative pin"}

When the piece behind is the **queen**, a rook or another valuable piece, moving the pinned piece is legal. The question is whether it pays.

```tabuleiro
fen: rnbqkb1r/ppp2ppp/4pn2/3p2B1/2PP4/2N5/PP2PPPP/R2QKBNR b KQkq - 3 4
setas: g5d8
casas: f6 d8
legenda: After 1.d4 d5 2.c4 e6 3.Nc3 Nf6 4.Bg5, the f6 knight is pinned to the queen on d8. It may move, but the queen would be left hanging to the bishop.
```

Relative pins fool a lot of players, because sometimes the "pinned" piece moves anyway, with a bigger blow. The classic example is the **Elephant Trap**, in [this very opening](artigo:gambito-da-dama-e-london):

:::caixa 4...Nbd7 5.cxd5 exd5 6.Nxd5? Nxd5! 7.Bxd8 Bb4+ 8.Qd2 Bxd2+ 9.Kxd2 Kxd8
White thought the f6 knight was stuck and grabbed the d5 pawn. But the knight moved, giving up the queen, and the bishop check on b4 won everything back. In the end Black is a piece up for a pawn.

<small>Lesson: a relative pin is not an absolute one. Before relying on it, make sure your opponent has no check or bigger threat.</small>
:::

## How to exploit a pin {#explorar "How to exploit a pin"}

Found a pinned piece? These are the most common ways to cash in:

- **Attack the pinned piece with something cheaper.** A pawn attacking a knight pinned to the king wins the knight, because it cannot escape.
- **Pile up.** Since the pinned piece cannot run away, you have time to bring more attackers than it has defenders.
- **Remember it does not really defend.** A piece pinned to the king cannot capture off the line of the pin, so the squares it seemed to "guard" are free.

```tabuleiro
fen: 6k1/5pp1/6N1/8/2B5/8/5PPP/6K1 b - - 0 1
setas: c4g8:vermelha
casas: f7 g6
legenda: The f7 pawn is pinned by the bishop on c4. It cannot capture the knight on g6, which sits safely on a square that looked guarded.
```

## Typical opening pins {#abertura "Opening pins"}

Many popular openings revolve around a pin, and knowing them helps you avoid traps:

- **Bb5 against the c6 knight** (Ruy Lopez): it becomes an absolute pin once the d7 pawn moves out of the way; before that, the bishop simply attacks the knight.
- **Bg5 against the f6 knight**: a relative pin, with the queen on d8 behind. It shows up in many 1.d4 openings.
- **Bb4 against the c3 knight**: Black's version, for example in the Nimzo-Indian Defense (1.d4 Nf6 2.c4 e6 3.Nc3 Bb4).
- **...Bg4 against the f3 knight**: a relative pin against the queen on d1, common in many defenses.

None of these pins wins material on its own. They create pressure: the pinned piece becomes less useful, and any slip (a pawn advance, another piece joining the attack) can decide the game. A common mistake by the side being pinned is to break the pin at any cost with ...h6 and ...g5 (or h3 and g4): sometimes it works, but the advanced pawns weaken their own king.

## How to break a pin {#defesa "How to break a pin"}

- **Move the piece behind.** If the king or queen steps off the line, the pin disappears.
- **Put a piece in between.** Interposing another piece between the pinner and the pinned piece also breaks the pin, as long as the new piece is not in danger.
- **Attack the pinning piece.** A pawn kicking the bishop away (like ...a6 against Bb5, or ...h6 against Bg5) solves many cases.
- **Prevent it:** avoid leaving your king and queen on the same diagonal or file with only one piece in between.

:::dica
**💡 Tip:** the pin is a close relative of the [skewer](artigo:espeto). In a pin, the front piece is worth less; in a skewer, the front piece is worth more. Learning one helps you see the other.
:::

:::pratique Practice pins now
Play against the computer and look for enemy pieces lined up with the king or queen. At Medium level these pins appear often, right from the opening.
:::

## Pin puzzles {#exercicios "Puzzles"}

```exercicio
fen: 6rk/ppq2pp1/8/8/8/8/PBPQ1PPP/5RK1 w - - 0 1
enunciado: White to move gives **mate in 1**. The g7 pawn seems to cover everything.
tipo: mate
lances: 1
solucao: d2h6
dica: Look at the diagonal that starts at the b2 bishop and ends at the king on h8.
explicacao: 1.Qh6# — the g7 pawn is pinned by the b2 bishop and cannot take the queen. The king has no square: g8 is occupied by the rook and h7 is covered by the queen.
```

```exercicio
fen: r3kb1r/pp1q1ppp/4pn2/8/8/2N5/PPP2PPP/R1B1KB1R w KQkq - 0 1
enunciado: White to move **wins the queen** with a pin.
solucao: f1b5 d7b5 c3b5
dica: The queen on d7 and the king on e8 are on the same diagonal.
explicacao: 1.Bb5 pins the queen to the king. She cannot leave the diagonal, and the bishop is protected by the c3 knight. The best Black can do is 1...Qxb5 2.Nxb5: queen for bishop.
```

```exercicio
fen: r1bqkb1r/pp3ppp/2pp4/4n3/8/3B4/PPP2PPP/RNBQR1K1 w kq - 0 1
enunciado: White to move **wins a piece** by attacking the pinned piece.
solucao: f2f4 d8e7 f4e5
dica: The knight on e5 stands on the e-file, between the e1 rook and the e8 king. It cannot run.
explicacao: 1.f4 attacks the pinned knight with a pawn. Black can defend it (1...Qe7) but not save it: 2.fxe5 dxe5 and White has won a knight for a pawn.
```

## Frequently asked questions {#faq "FAQ"}

### What is the difference between an absolute and a relative pin?

In an absolute pin the piece behind is the king, and moving the pinned piece off the line is illegal. In a relative pin the piece behind is something else (usually the queen or a rook): moving is legal but usually loses material.

### Which pieces can pin?

Only the bishop, rook and queen, because only they attack along lines. Knights, pawns and kings cannot pin.

### Does a pinned piece still give check?

Yes. A pinned piece still controls the squares it attacks: the enemy king cannot step onto them, and it can even give check. What it cannot do is leave the line of the pin if that would expose its own king.

### How do I practice pins?

Solve puzzles and, in your games, look for enemy pieces lined up with the king or queen. See also the overview of [chess tactics](artigo:taticas).
