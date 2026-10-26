---
id: mate-do-pastor
titulo: Four-Move Checkmate: the Scholar's Mate
titulo_seo: Four-Move Checkmate: the Scholar's Mate | Chess Online
descricao: Learn the Scholar's Mate: the most famous four-move checkmate in chess. How to deliver it, how to defend against it, and why it only works against beginners.
nivel: iniciante
ordem: 40
publicado: 2026-05-11
atualizado: 2026-10-26
tags: [four move checkmate, scholar's mate, four move mate, fast checkmate, two move checkmate, three move checkmate]
jogar: 1
relacionados: [principios-de-abertura, erros-de-iniciante, mate-do-corredor, mates-basicos]
ensina: [Scholar's Mate, Defending against the Scholar's Mate, Fool's Mate]
---
Scholar's Mate is the best-known four-move checkmate in chess: 1.e4 e5 2.Bc4 Nc6 3.Qh5 Nf6?? 4.Qxf7#. The queen and bishop team up against f7, the square that only Black's king defends at the start of the game. It only works against players who don't know the trap: defend f7 in time — for example with 3...g6 or 3...Qe7 — and White's early queen becomes a target.

## The Scholar's Mate sequence (move by move) {#sequencia "The Scholar's Mate sequence"}

You're playing White. The idea is to attack the f7 square — the weakest point in Black's position at the start, because it's defended only by the king.

### Move 1: 1.e4 e5

You push the central pawn. Your opponent copies you. A normal opening move.

### Move 2: 2.Bc4 Nc6

Your bishop comes out to c4, aiming directly at the f7 square. Black develops a knight (a natural move).

### Move 3: 3.Qh5 Nf6??

You bring the queen out to h5. Now the queen and the bishop are **both aiming at f7**. If your opponent doesn't notice the threat and plays any random move (like 3...Nf6, attacking the queen), you deliver mate on the next move.

### Move 4: 4.Qxf7# (checkmate)

The queen captures on f7, protected by the c4 bishop, and gives check. The king **has nowhere to run**: d8 and f8 are occupied by Black's own queen and bishop, d7 by Black's pawn, and e7 is covered by White's queen. And the king can't take the queen, because the c4 bishop defends her.

:::aviso
**⚠️ Important:** this mate only works if your opponent *fails to defend* the f7 square and plays 3...Nf6 (or another move that doesn't defend f7). Against any alert player, the mate **doesn't happen** — and you've still [wasted time with an exposed queen](artigo:principios-de-abertura#dama).
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
- **[Beginners ignore the opponent's threats](artigo:erros-de-iniciante#ameaca).** The opponent sees the move 3.Qh5 and focuses on developing their own pieces, without asking "what are my opponent's pieces threatening?".

## How to defend against and neutralize the Scholar's Mate {#defender "How to defend (and shut it down)"}

The correct defense is simple and comes in several forms. The most solid one is:

### Main defense: 3...g6

When White plays 3.Qh5, the best response is **3...g6** — attacking the queen with a pawn. Now the queen has to move away, Black gains time to develop, and the immediate threat is over. Watch out: White often follows up with 4.Qf3, hitting f7 again. Answer **4...Nf6**, which blocks the f-file and develops a piece.

### Alternative defense: 3...Qe7

The black queen goes to e7, defending f7. It works, but it's less elegant because it gets in the way of development (the bishop on f8 gets stuck).

### Defense on move 2: 2...Nf6

If you know your opponent likes the Scholar's Mate, you can play **2...Nf6** on the second move instead of 2...Nc6. The knight attacks the e4 pawn and forces White to defend, disrupting the plan.

:::dica
**💡 General defensive rule:** on every move, ask yourself: "*What is my opponent threatening?*". If a threatening piece moves close to your king, defend immediately. Beginners lose because they forget to ask this.
:::

## Similar traps: Légal's Mate and the Fool's Mate {#variantes "Similar traps"}

### Légal's Mate

Another classic trap: White gives up the queen (Black's bishop takes it on d1) but mates with the minor pieces. Example:

`1.e4 e5 2.Nf3 d6 3.Bc4 Bg4 4.Nc3 g6? 5.Nxe5! Bxd1?? 6.Bxf7+ Ke7 7.Nd5#`

It works because Black grabs the queen and doesn't see they're caught in a mating net.

### Fool's Mate

The fastest possible checkmate, in just **2 moves**. It only happens if White plays two absurd moves in a row:

`1.f3 e5 2.g4?? Qh4#`

Practically impossible in real games. But it's an interesting curiosity: the fastest checkmate theoretically possible. It's the answer to the question "what is the fastest checkmate in chess?".

## Why you should NOT rely on the Scholar's Mate {#aviso "Why you shouldn't rely on it"}

After a few weeks of playing, every opponent knows how to defend against the Scholar's Mate. If you try it against someone more experienced, this is what will happen:

1. The opponent plays 3...g6 and your queen is forced to retreat.
2. You've spent moves on your queen (3.Qh5 and the retreat, such as 4.Qf3 or 4.Qe2) while your opponent developed.
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


## Frequently asked questions {#faq "FAQ"}

### How do you defend against Scholar's Mate?

Cover f7 before the queen gets there. After 1.e4 e5 2.Bc4 Nc6 3.Qh5, both 3...g6 (which also hits the queen) and 3...Qe7 hold everything; if the queen comes to f3 instead of h5, 3...Nf6 blocks the f-file. [See the defense move by move](artigo:mate-do-pastor#defender).

### What is the fastest checkmate in chess?

Fool's Mate, in 2 moves: 1.f3 e5 2.g4 Qh4#. It only happens when White weakens the diagonals around their own king all at once.

### Does Scholar's Mate work against experienced players?

No. Anyone who knows the threat covers f7 with a natural move, and the player who brought the queen out early loses time running from attacks. Against beginners, knowing how to defend it is worth more than relying on it.

## What comes next

The Scholar's Mate shows what happens when one side brings the queen out early and the other ignores threats. The next step is learning to play the opening properly: the [opening principles](artigo:principios-de-abertura). For more mating patterns, see [basic checkmates](artigo:mates-basicos) and the [back-rank mate](artigo:mate-do-corredor).
