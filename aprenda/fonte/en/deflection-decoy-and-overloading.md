---
id: desvio-e-sobrecarga
titulo: Deflection, Decoy and Overloading in Chess
titulo_seo: Deflection, Decoy and Overloading in Chess | Chess Online
descricao: Deflection, decoy and overloading in chess: how to drive a defender away, lure the king onto a bad square and exploit a piece with too many jobs.
nivel: intermediario
ordem: 35
publicado: 2026-10-26
atualizado: 2026-10-26
tags: [deflection, decoy, overloading, overloaded piece, chess tactics, smothered mate]
jogar: 3
relacionados: [taticas, garfo, mate-do-corredor, sacrificios, calculo]
ensina: [Deflection, Decoy, Overloading]
---
**Deflection**, **decoy** and **overloading** are tactics that attack the defenders instead of the targets. In a deflection, you force a defending piece to leave the square where it does its job. In a decoy, you force an enemy piece (usually the king) onto a bad square. In an overload, you exploit a piece that has two jobs at once and cannot do both.

## Why attack the defenders {#por-que "Why attack the defenders"}

In the basic tactics, such as the [fork](artigo:garfo) and the [pin](artigo:cravada), you attack what you want to win directly. But often the target is well defended. Then the question changes from "what do I attack?" to "**who defends it, and how do I get that piece out of the way?**".

The three tactics in this article answer that question. They usually come with a **[sacrifice](artigo:sacrificios)** or a forced trade: you give something up so the enemy piece is obliged to move, and the main blow follows right after.

## Overloading: the piece with too much work {#sobrecarga "Overloading"}

A piece is **overloaded** when it defends two things at the same time. Attack one of them, and if the defender captures, the other one is left unprotected.

```tabuleiro
fen: 6k1/3q1ppp/8/1b3n2/8/5Q2/5PPP/1R4K1 w - - 0 1
setas: b1b5 f3f5 d7b5:azul d7f5:azul
casas: d7:vermelha
legenda: The d7 queen defends both the bishop on b5 and the knight on f5. After 1.Rxb5 Qxb5 2.Qxf5, White wins material.
```

To find overloads, count: for each enemy defender, **how many things does it protect?** If the answer is two or more, there is a tactic in the air. The most commonly overloaded pieces are the queen and the rooks guarding the back rank.

## Deflection: driving the defender away {#desvio "Deflection"}

In a **deflection**, you force the defender off its square with a capture, a trade or a check. The difference from an overload is subtle: in an overload the defender has two jobs; in a deflection you simply make it leave, and whatever it was protecting falls.

```tabuleiro
fen: 5rk1/5ppp/5n2/6N1/4P3/7Q/5PPP/6K1 w - - 0 1
setas: e4e5 f6h7:azul h3h7
casas: h7:vermelha f6
legenda: The f6 knight is the defender of h7. With 1.e5, the pawn attacks the knight: if it stops guarding h7, 2.Qxh7# follows.
```

The most common deflection is a trade with check: you capture a piece protected by the defender, it has to recapture, and the square it was watching is left free.

A close relative of deflection is **removing the defender**: instead of forcing the defender to leave, you simply capture it, even if that costs material (for example, giving a rook for a knight). If what it was defending is worth more than what you gave, or if the capture opens the way to mate, the trade pays off.

## Decoy: luring a piece onto a bad square {#atracao "Decoy"}

In a **decoy**, instead of driving a piece away, you **lure** it onto a specific square, where it will suffer a fork, a skewer or a mate. The most common target is the king, drawn in by a sacrifice with check.

```tabuleiro
fen: 1k2q3/1pp2ppp/3p4/1N6/8/8/5PPP/R5K1 w - - 0 1
setas: a1a8:vermelha b5c7
casas: a8 c7
legenda: 1.Ra8+! Kxa8 (forced) lures the king to a8, and 2.Nxc7+ forks the king and the queen on e8.
```

The most famous decoy of all is the **smothered mate**: the queen sacrifices itself next to the king, an enemy rook is forced to capture and ends up blocking the king's last escape square. The knight delivers mate. You will solve one of these in the last puzzle.

:::dica
**💡 Tip:** when a combination "almost works", ask which enemy piece is spoiling your plan. If you can deflect it, decoy it or overload it, the combination starts working.
:::

## Step by step: how to think {#passo-a-passo "Step by step"}

These tactics are harder to spot than a fork, because the first move rarely looks good: it is often a trade that seems to waste time, or a sacrifice. A checklist helps:

1. **Find the target.** What would you like to capture, or where would you like to mate?
2. **List the defenders.** Which enemy pieces stop the blow? If only one does, it is the key.
3. **Count that piece's jobs.** If it already defends something else, you may have an overload: attack the other thing.
4. **Look for forcing moves against it.** A capture it must recapture, a check that makes it move, a sacrifice on a square only it can occupy.
5. **Check the reply.** After your move, is your opponent really forced to answer the way you want? If there is a quiet alternative, the tactic does not work.

That last step is what separates a tactic from a gamble. In the puzzles below, the opponent's reply is either forced or the best one available.

## How to defend {#defesa "How to defend"}

- **Do not let one piece defend two things.** Spread the jobs among several pieces.
- **Be suspicious of sacrifices with check**: before capturing, ask where the capture takes your piece.
- **Look after your back rank.** Rooks and queens guarding it are usually the first victims of overloading; a "window" for the king (a pawn pushed in front of it) lightens that job. See the [back-rank mate](artigo:mate-do-corredor).

:::pratique Practise deflection and overloading now
Play against the computer at Hard level and, after each of its moves, ask which of its pieces are defending two things. It is a great tactical vision drill.
:::

## Puzzles {#exercicios "Puzzles"}

```exercicio
fen: 3r2k1/ppq2ppp/8/3b4/8/6P1/QP3P1P/4R1K1 w - - 0 1
enunciado: White to move **wins a piece**. The rook on d8 has too much work.
solucao: a2d5
dica: The d8 rook defends the bishop on d5 and also the eighth rank.
explicacao: 1.Qxd5! wins the bishop, because 1...Rxd5?? would leave the eighth rank undefended: 2.Re8#. The rook was overloaded.
```

```exercicio
fen: 4r1k1/pp1q1ppp/8/8/2Pn4/7P/PP3QP1/4R1K1 w - - 0 1
enunciado: White to move **wins a piece** by deflecting the defender.
solucao: e1e8 d7e8 f2d4
dica: Who defends the knight on d4? Make that piece go somewhere else.
explicacao: The d7 queen is the knight's only defender. 1.Rxe8+ Qxe8 forces the queen to recapture on e8, away from the d-file, and 2.Qxd4 wins the knight. Starting with 1.Qxd4? would be a mistake: 1...Rxe1+ would win White's rook.
```

```exercicio
fen: r4r1k/pp4pp/1q5N/8/2Q5/8/PP3PPP/6K1 w - - 0 1
enunciado: White to move gives **mate in 2** with a decoy.
tipo: mate
lances: 2
solucao: c4g8 f8g8 h6f7
dica: Black's king cannot capture on g8, because the h6 knight covers that square. Who can?
explicacao: 1.Qg8+!! forces 1...Rxg8 (the king cannot capture). The rook lured to g8 blocks the king's last square, and 2.Nf7# is the smothered mate.
```

## Frequently asked questions {#faq "FAQ"}

### What is the difference between deflection and decoy?

In a deflection, you drive a defender away from its square. In a decoy, you lure an enemy piece onto a specific square where it will be hit.

### What is an overloaded piece?

A piece that defends two things at once. Attack one of them: if the overloaded piece captures, the other is left unprotected.

### What is a smothered mate?

A mate delivered by a knight against a king surrounded by its own pieces, with no free square. It often comes from a decoy with a queen sacrifice.

### What level are these tactics for?

They are the next step after forks, pins and skewers. They require [calculating two or three moves ahead](artigo:calculo), which is why they come near the end of the [chess tactics](artigo:taticas) track.
