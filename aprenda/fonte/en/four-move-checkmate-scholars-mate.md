---
id: mate-do-pastor
titulo: Four-Move Checkmate: the Scholar's Mate
titulo_seo: Four-Move Checkmate: the Scholar's Mate (How to Deliver It and How to Defend) | Chess Online
descricao: Learn the Scholar's Mate: the most famous four-move checkmate in chess. How to deliver it, how to defend against it, and why it only works against beginners.
nivel: iniciante
ordem: 40
publicado: 2026-05-11
atualizado: 2026-10-26
tags: [four move checkmate, scholar's mate, four move mate, fast checkmate, two move checkmate, three move checkmate]
jogar: 1
relacionados: [jogar-do-zero, aberturas-para-iniciantes, regras, movimento-do-cavalo]
---
There is a classic checkmate that works in just 4 moves against unsuspecting beginners. It is called the *Scholar's Mate*. I'll teach you how to deliver it, how to defend against it, and why you shouldn't rely on it to win.

## The Scholar's Mate sequence (move by move) {#sequencia "The Scholar's Mate sequence"}

You're playing White. The idea is to attack the f7 square — the weakest point in Black's position at the start, because it's defended only by the king.

### Move 1: 1.e4 e5

You push the central pawn. Your opponent copies you. A normal opening move.

### Move 2: 2.Bc4 Nc6

Your bishop comes out to c4, aiming directly at the f7 square. Black develops a knight (a natural move).

### Move 3: 3.Qh5 Nf6??

You bring the queen out to h5. Now the queen and the bishop are **both aiming at f7**. If your opponent doesn't notice the threat and plays any random move (like 3...Nf6, attacking the queen), you get the mate on the next move.

### Move 4: 4.Qxf7# (checkmate)

The queen captures on f7. The f7 pawn was defended only by the king, so only the queen could capture it while being protected. The queen on f7 attacks the king (check), and the king **has nowhere to run**: g8 is occupied by the knight from f6 (which moved away), e7 is occupied by the bishop, and the king can't capture the queen because it's protected by the bishop on c4.

:::aviso
**⚠️ Important:** this mate only works if your opponent *fails to defend* the f7 square and plays 3...Nf6 (or another move that doesn't defend f7). Against any alert player, the mate **doesn't happen** — and you've still wasted time with an exposed queen.
:::

```tabuleiro
fen: r1bqkb1r/pppp1Qpp/2n2n2/4p3/2B1P3/8/PPPP1PPP/RNB1K1NR b KQkq - 0 4
setas: c4f7:azul
casas: e8:vermelha f7
legenda: The final position after 4.Qxf7#: the queen attacks the king and is protected by the bishop on c4.
```

## Why the Scholar's Mate works {#por-que "Why it works"}

It works for three combined reasons:

- **f7 is Black's natural weak point.** At the start, only the king defends that pawn.
- **Two attackers on the same square.** The queen on h5 and the bishop on c4 attack f7 at the same time.
- **Beginners ignore the opponent's threats.** The opponent sees the move 3.Qh5 and focuses on developing their own pieces, without asking "what are my opponent's pieces threatening?".

## How to defend against and neutralize the Scholar's Mate {#defender "How to defend (and shut it down)"}

The correct defense is simple and comes in several forms. The most solid one is:

### Main defense: 3...g6

When White plays 3.Qh5, the best response is **3...g6** — attacking the queen with a pawn. Now the queen has to retreat (or go to a risky square), you still have your pieces developed, and the threat is over.

### Alternative defense: 3...Qe7

The black queen goes to e7, defending f7. It works, but it's less elegant because it gets in the way of development (the bishop on f8 gets stuck).

### Defense on move 2: 2...Nf6

If you know your opponent likes the Scholar's Mate, you can play **2...Nf6** on the second move instead of 2...Nc6. The knight attacks the e4 pawn and forces White to defend, disrupting the plan.

:::dica
**💡 General defensive rule:** on every move, ask yourself: "*What is my opponent threatening?*". If a threatening piece moves close to your king, defend immediately. Beginners lose because they forget to ask this.
:::

## Similar variations: the Légal Trap and the Fool's Mate {#variantes "Similar variations"}

### Légal Trap

Another classic trap: White sacrifices the queen for a knight, but delivers mate with the minor pieces. Example:

`1.e4 e5 2.Nf3 d6 3.Bc4 Bg4 4.Nc3 g6?? 5.Nxe5 Bxd1?? 6.Bxf7+ Ke7 7.Nd5#`

It works because Black gets dazzled by the "queen sacrifice" and doesn't see they're caught in a mating net.

### Fool's Mate

The fastest possible checkmate, in just **2 moves**. It only happens if White plays two absurd moves in a row:

`1.f3 e5 2.g4?? Qh4#`

Practically impossible in real games. But it's an interesting curiosity: the fastest checkmate theoretically possible.

## What about a two-move checkmate? {#mate-em-2}

As shown above, the Fool's Mate is the two-move checkmate. It depends entirely on your opponent playing two bad moves. In real games it virtually never happens — but it's the answer to the question "what is the fastest checkmate in chess?".

## Why you should NOT rely on the Scholar's Mate {#aviso "Why you shouldn't rely on it"}

After a few weeks of playing, every opponent knows how to defend against the Scholar's Mate. If you try it against someone more experienced, this is what will happen:

1. The opponent plays 3...g6 and your queen is forced to retreat.
2. You've wasted two moves shuffling the queen around (1.Bc4 and 2.Qh5).
3. The opponent has developed pieces and holds the advantage.
4. The rest of the game turns into a tiring struggle where you're behind.

The lesson: learn the Scholar's Mate so you can **defend** against it, not to use it as your main strategy. Players who rely on "traps" against beginners never improve.

:::pratique Practice the Scholar's Mate (and how to defend against it)
Practice both the attack and the defense against the computer. Use the Easy level to try the mate, and the Medium level to train the defense.
:::

## Exercises: deliver the mate yourself {#exercicios "Exercises"}

Now it is your turn. Tap (or click) a piece and then its destination square.

```exercicio
fen: r1bqkb1r/pppp1ppp/2n2n2/4p2Q/2B1P3/8/PPPP1PPP/RNB1K1NR w KQkq - 4 4
enunciado: After 1.e4 e5 2.Bc4 Nc6 3.Qh5 Nf6??, White gives **mate in 1**.
tipo: mate
solucao: h5f7
dica: Which black pawn is defended only by the king?
explicacao: 4.Qxf7# — the queen captures on f7 protected by the c4 bishop; the king can neither take her nor run.
```

```exercicio
fen: rnbqkbnr/pppp1ppp/8/4p3/6P1/5P2/PPPPP2P/RNBQKBNR b KQkq g3 0 2
enunciado: Now you play Black. After 1.f3 e5 2.g4??, give **mate in 1** (the Fool's Mate).
tipo: mate
solucao: d8h4
dica: The f- and g-pawns opened a diagonal to the white king.
explicacao: 2...Qh4# — the queen checks along the h4–e1 diagonal, no white piece can step in on g3 or f2, and the king has no free square.
```


## What comes next

Once you master the Scholar's Mate (attack and defense), the next step is to learn more advanced checkmate patterns:

- **Back-rank mate:** the enemy king trapped on the first rank, the rook delivers mate.
- **Ladder mate:** two rooks work together, pushing the king to the edge.
- **Queen and bishop mate:** in a simplified endgame.
- **Knight and bishop mate:** the hardest of the basic mates — it requires technique.
