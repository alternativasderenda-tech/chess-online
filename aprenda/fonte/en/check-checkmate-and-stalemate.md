---
id: xeque-mate-e-afogamento
titulo: "Check, Checkmate and Stalemate: the Difference"
titulo_seo: Check, Checkmate and Stalemate | Chess Online
descricao: What check, checkmate and stalemate mean in chess, the three ways to get out of check, and why stalemate is a draw, with exercises for beginners.
nivel: iniciante
ordem: 34
publicado: 2026-10-26
atualizado: 2026-10-26
tags: [check, checkmate, stalemate, how to get out of check, difference between checkmate and stalemate]
jogar: 1
relacionados: [regras, mates-basicos, empates, ataque-descoberto, como-as-pecas-se-movem]
ensina: [Check, Checkmate, Stalemate]
---
**Check** means the king is under attack by an enemy piece; the player must get the king out of attack on their very next move. **Checkmate** is a check with no way out: the game ends and the player who delivered it wins. **Stalemate** is when the player to move is **not in check** but has no legal move at all: the game ends in a draw. The difference between checkmate and stalemate decides a lot of beginner games, so it's worth getting it right.

## What is check {#xeque "What is check"}

A piece gives **check** when it attacks the enemy king — that is, when it could capture the king on the next move. The king is never actually captured: the rules force the player in check to deal with it immediately.

```tabuleiro
fen: 4k3/8/8/8/8/8/8/4R1K1 b - - 0 1
setas: e1e8:vermelha
casas: e8:vermelha d8:verde d7:verde f7:verde f8:verde
legenda: The rook on e1 checks the black king down the e-file. The king has four escape squares (green): d8, d7, f7 and f8.
```

### The three ways out of check

There are only three possible answers to a check. Remember them as **move, capture or block**:

1. **Move:** step the king to a square that isn't attacked.
2. **Capture:** take the checking piece (with the king or any other piece).
3. **Block** (or *interpose*): put a piece between the king and the attacker. This doesn't work against a knight check, since the knight jumps, or when the attacker is right next to the king.

If none of the three is possible, it's checkmate.

:::aviso
**⚠️ Watch out:** you **can't** make any move that leaves your own king in check. That includes [moving a piece that is shielding your king](artigo:cravada) from an attack. In an online game, the system simply won't accept the move.
:::

### Double check

Sometimes two pieces give check at the same time. That's a **[double check](artigo:ataque-descoberto)**. Since one move can't capture or block two attackers, the only way out is to **move the king**.

### Do I have to say "check"?

No. Under the official FIDE rules (FIDE is the International Chess Federation), announcing check isn't required. It's a common habit among friends, but it isn't part of the rules.

## What is checkmate {#xeque-mate "What is checkmate"}

**Checkmate** (or just **mate**) is the goal of chess. It's a check where the king can't escape, the attacker can't be captured and the attack can't be blocked. When it happens, the game ends on the spot and whoever delivered mate wins, no matter how much material each side has.

```tabuleiro
fen: 4R1k1/5ppp/8/8/8/8/5PPP/6K1 b - - 1 1
setas: e8g8:vermelha
casas: g8:vermelha
legenda: Checkmate. The rook attacks the king along the 8th rank; Black's own pawns take away the escape squares, and nothing can capture the rook or block.
```

To check whether a check is mate, ask three questions, in this order:

1. Does the king have a free square that isn't attacked?
2. Can any piece capture the checking piece?
3. Can any piece step in between?

Three "no" answers = checkmate.

## What is stalemate {#afogamento "What is stalemate"}

**Stalemate** happens when it's a player's turn, their king is **not in check**, and they have **no legal move** — not with the king, and not with any other piece. Under FIDE rules, the game ends immediately in a **draw**.

```tabuleiro
fen: k7/8/1Q6/8/8/8/8/7K b - - 0 1
casas: a8:amarela a7:vermelha b7:vermelha b8:vermelha
legenda: Black to move, but there's no move: the king on a8 isn't in check, and a7, b7 and b8 are all covered by the queen. Stalemate: a draw.
```

It feels unfair to the side with the queen, but that's the rule. Stalemate is the classic trap for the player who's winning: with a big advantage, it's easy to take away every square from the enemy king **without giving check**, and throw away a certain win.

:::dica
**💡 Tip:** when your opponent has only a king left (or pieces that can't move), ask yourself before every move: "after this, will they still have a legal move?" If the answer is no and your move isn't check, it's stalemate.
:::

## Is giving check always good? {#xeque-bom "Is giving check always good?"}

No. Many beginners check whenever they can, but a check without a plan often just pushes the enemy king to a better square and leaves your piece exposed. Before giving check, ask:

- **Does the check win something?** For example, it [attacks the king and another piece at once](artigo:garfo), or forces the king onto a worse square.
- **Is the checking piece safe?** A check with a piece that can be captured is just a quick way to lose it.
- **Is there something better?** Sometimes a quiet move that takes away the king's escape squares sets up a mate that a hasty check would spoil.

On the other side, when you're **in** check, don't just pick the first way out you see. Compare all three options (move, capture, block) and choose the one that leaves your position best, as in the first exercise below.

## Check, checkmate and stalemate side by side {#comparacao "Comparison"}

| Situation | Is the king attacked? | Any legal move? | Result |
|---|---|---|---|
| Check | Yes | Yes | The game goes on |
| Checkmate | Yes | No | The player who mated wins |
| Stalemate | No | No | Draw |

Stalemate is only one way to draw. The others (agreement, repetition, the 50-move rule, insufficient material) are covered in [draws in chess](artigo:empates).

## Exercises {#exercicios "Exercises"}

```exercicio
fen: r3Q1k1/5pp1/3b3p/8/8/8/5PPP/6K1 b - - 0 1
enunciado: Black is in check. They can move the king, block with the bishop or capture. What's the best way out?
tipo: tatica
solucao: a8e8
dica: Moving or blocking leaves White's queen on the board. What about capturing?
explicacao: 1...Rxe8 — the rook on a8 takes the checking queen. Moving (1...Kh7) or blocking (1...Bf8) also gets out of check, but leaves White a whole queen up.
```

```exercicio
fen: 7k/5K2/8/8/8/8/8/1Q6 w - - 0 1
enunciado: White has **mate in 1**. Careful: several queen moves here are stalemate.
tipo: mate
lances: 1
solucao: b1h1
dica: The white king already takes g7 and g8 away from the black king. The queen has to give check, not just box the king in.
explicacao: 1.Qh1# — the queen checks down the h-file and the black king has nowhere to go. A move like 1.Qg6?? takes away the king's squares without giving check: Black has no move, and it's stalemate.
```

```exercicio
fen: r4rk1/ppp2ppp/2n5/7Q/8/3B4/PPP2PPP/R5K1 w - - 0 1
enunciado: Queen and bishop team up. Find the **mate in 1**.
tipo: mate
lances: 1
solucao: h5h7
dica: The bishop on d3 is aiming at a square next to the black king.
explicacao: 1.Qxh7# — the queen takes on h7, protected by the bishop on d3. The king can't take her, h8 is also covered by the queen, f8 is blocked by Black's own rook, and f7 and g7 by Black's pawns.
```

## Frequently asked questions {#faq "FAQ"}

### What's the difference between checkmate and stalemate?

In checkmate the king is attacked and can't escape: the player who mated wins. In stalemate the king is **not** attacked, but the player has no legal move: the game is a draw.

### Is stalemate a win or a draw?

A draw, under the official FIDE rules.

### How do you get out of check?

Three ways: move the king, capture the checking piece, or block the line with another piece. Against a double check, only moving the king works.

### Can a king give check?

Not directly. A king can never stand next to the other king, because it would be walking into check. So the king doesn't give check on its own, but it's a huge help in delivering mate by covering escape squares.

### Can I put myself in check on purpose?

No. A move that leaves your own king in check is illegal and won't be accepted.

:::pratique Practice mating without stalemating
Play the computer on Easy and, once you're well ahead, watch the enemy king's squares before every move.
:::

To drill the mates that come up most often at the end of a game, see [basic checkmates with queen and rook](artigo:mates-basicos).
