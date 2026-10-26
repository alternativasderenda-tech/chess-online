---
id: mate-do-corredor
titulo: Back-Rank Mate: Checkmate on the Last Rank
titulo_seo: Back-Rank Mate in Chess: Deliver and Avoid It | Chess Online
descricao: What a back-rank mate is, why a king trapped behind its pawns is so vulnerable, how to deliver this mate, how to avoid it, plus 4 interactive puzzles.
nivel: intermediario
ordem: 40
publicado: 2026-10-26
atualizado: 2026-10-26
tags: [back-rank mate, back rank, checkmate, luft, chess tactics]
jogar: 2
relacionados: [taticas, desvio-e-sobrecarga, xeque-mate-e-afogamento, erros-de-iniciante, mates-basicos]
ensina: [Back-rank mate, Back-rank weakness, Luft]
---
A **back-rank mate** is a [checkmate](artigo:xeque-mate-e-afogamento) delivered by a rook or queen on the opponent's last rank, when the king is trapped behind its own pawns with nowhere to run. It is one of the most common mates in real games, at every level, because it grows out of a perfectly normal position: a castled king with its three pawns untouched in front of it.

## How the back-rank mate works {#como-funciona "How it works"}

Picture Black's king castled on g8, with pawns on f7, g7 and h7. Those pawns shield the king from attacks from the front, but they also **block the exit**: the king cannot step up to the seventh rank. If a white rook or queen reaches the eighth rank with check, and no black piece can capture it or step in the way, it is mate.

```tabuleiro
fen: 4R1k1/5ppp/8/8/8/8/5PPP/6K1 b - - 0 1
setas: e8g8:vermelha
casas: g8:vermelha f7 g7 h7
legenda: Re8#. The g8 king is boxed in by its own pawns, and the rook controls the whole eighth rank.
```

The idea is that the king is stuck in a narrow corridor, the last rank, and the rook seals it from one end to the other.

## The three ingredients {#ingredientes "The three ingredients"}

For a back-rank mate to work, three things must happen at once:

1. **The king has no escape square** on the rank in front, usually because of its own pawns.
2. **A heavy piece** (rook or queen) can reach the last rank with check.
3. **No defender** can capture that piece or block the check.

The third point is where the tactics live. Often the back rank is defended, but by a single piece. That is where trades and sacrifices come in: you remove or deflect the defender and the rank is open.

```tabuleiro
fen: 3r2k1/5ppp/8/8/8/8/5PPP/4R1K1 w - - 0 1
setas: e1e8 d8e8:azul
casas: d8 e8
legenda: Here the d8 rook guards the back rank: if 1.Re8+, Black answers 1...Rxe8. To mate, White would need a second attacker.
```

## Count attackers and defenders {#contar "Count attackers and defenders"}

The practical rule is to count. How many of your pieces can reach the last rank? How many enemy pieces defend it? If you have **more attackers than defenders**, there is usually a mate: the trades remove the defenders one by one, and the last attacker lands with checkmate.

Sometimes it pays to give up the queen to clear the way. If the only defender of the back rank is a rook, a queen sacrifice that forces it to capture can leave the rank open for your rook. That kind of blow is a case of [deflection and overloading](artigo:desvio-e-sobrecarga).

## Why this mate is so common {#por-que "Why it is so common"}

The back-rank mate [catches players of every level](artigo:erros-de-iniciante) for three reasons:

- **The position that causes it is the most normal one in chess.** Kingside castling, f-, g- and h-pawns at home: exactly what opening books recommend. Nobody feels in danger.
- **The threat comes from far away.** A rook on the other side of the board, on an open file, does not look dangerous until the moment it lands on the last rank.
- **The defense is usually left to a single piece.** When the only rook guarding the rank also has to defend a pawn or a file, it becomes [overloaded](artigo:desvio-e-sobrecarga#sobrecarga), and a single trade leaves the rank empty.

So even when your position looks calm, it is worth asking: "if one of their rooks reached my back rank right now, could I capture it or block the check?". If the answer is no, it is time to think about a window for your king.

## How to avoid a back-rank mate {#evitar "How to avoid it"}

The classic defense is to open a **window** for the king, often called by its German name: **luft** ("air"). Just push one of the pawns in front of the king, usually the rook's pawn (h3 for White, h6 for Black).

```tabuleiro
fen: 6k1/5pp1/7p/8/8/8/5PPP/4R1K1 w - - 0 1
setas: e1e8
casas: h7:verde
legenda: With the pawn on h6, the king has gained the h7 square. If 1.Re8+, 1...Kh7 and there is no mate.
```

Other ways to stay safe:

- **Keep a rook on the back rank** while your opponent's heavy pieces are still on the board.
- **Do not leave a single piece in charge of guarding the rank** and something else as well: it becomes an overloading target.
- **Make luft at the right moment**: calmly, at a time when the pawn move does not weaken your castled position too much.

:::aviso
**⚠️ Careful:** back-rank mates tend to show up when the game looks quiet, after some trades, with queens and rooks still on the board. That is exactly when nobody expects them.
:::

:::pratique Practice the back-rank mate now
Play against the computer and check whether its king has an escape square. When it does not, try to bring a rook to the last rank with more attackers than defenders.
:::

## Back-rank mate puzzles {#exercicios "Puzzles"}

```exercicio
fen: 2r3k1/pp3ppp/8/8/8/1q4P1/5P1P/2R1R1K1 w - - 0 1
enunciado: White to move gives **mate in 1**.
tipo: mate
lances: 1
solucao: c1c8
dica: The c8 rook is the only piece guarding the eighth rank. What if it disappears with check?
explicacao: 1.Rxc8# — the rook takes the back rank's only defender, and the king is still boxed in by its own pawns. 1.Re8+? fails to 1...Rxe8.
```

```exercicio
fen: 2rr2k1/pp3ppp/8/8/8/6P1/P2R1P1P/3R2K1 w - - 0 1
enunciado: White to move gives **mate in 2**. Count the attackers and defenders of d8.
tipo: mate
lances: 2
solucao: d2d8 c8d8 d1d8
dica: Both white rooks attack d8. How many black pieces defend that square?
explicacao: Two white rooks attack d8 and only the c8 rook defends it. 1.Rxd8+ Rxd8 2.Rxd8#.
```

```exercicio
fen: 2r3k1/pp3ppp/8/7q/3Q4/6P1/P4P1P/3R2K1 w - - 0 1
enunciado: White to move gives **mate in 2**. Giving up the queen is worth it.
tipo: mate
lances: 2
solucao: d4d8 c8d8 d1d8
dica: The c8 rook is the only piece guarding the eighth rank. Force it to leave c8.
explicacao: 1.Qd8+!! forces 1...Rxd8 (the king has no square and nothing can block). With the rook gone from c8, 2.Rxd8# seals the corridor.
```

```exercicio
fen: 2r3k1/pp3ppp/8/2q5/8/4Q3/P4PPP/2R3K1 b - - 0 1
enunciado: Now you play Black and give **mate in 2**. White's king has no window either.
tipo: mate
lances: 2
solucao: c5c1 e3c1 c8c1
dica: The c1 rook is the only defender of the first rank, and the e3 queen protects it.
explicacao: 1...Qxc1+! 2.Qxc1 Rxc1#. If 2.Qe1, 2...Qxe1# is mate as well. The doubled heavy pieces on the c-file (queen and rook) overpower the single defender.
```

## Frequently asked questions {#faq "FAQ"}

### What is a back-rank mate?

A checkmate delivered by a rook or queen on the last rank, with the king trapped behind its own pawns and no piece able to capture the attacker or block the check.

### How do I avoid a back-rank mate?

Open a window for the king (for example h3 or h6), keep a rook on the back rank while the opponent still has rooks and queens, and never leave a single piece solely in charge of defending the rank.

### Is making luft too early a bad idea?

It can be. A pawn move in front of the castled king creates weak squares. That is why many players wait for the moment the back-rank threat starts to become real, usually in the middlegame after the first trades.

### Can the back-rank mate be delivered by the queen?

Yes. The queen works like a rook on the last rank and can also get there along the diagonals. To review other patterns, go back to the overview of [chess tactics](artigo:taticas).
