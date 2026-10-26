---
id: sacrificios
titulo: "Classic Chess Sacrifices: Bxh7+ and the Exchange"
titulo_seo: Classic Chess Sacrifices Explained | Chess Online
descricao: How the classic attacking sacrifices work — Bxh7+ (the Greek gift), the smothered mate and the exchange sacrifice — and how to tell whether one of them works.
nivel: avancado
ordem: 35
publicado: 2026-10-26
atualizado: 2026-10-26
tags: [chess sacrifice, greek gift, bxh7 sacrifice, exchange sacrifice, smothered mate, king attack]
jogar: 3
relacionados: [taticas, calculo, desvio-e-sobrecarga, mate-do-corredor, ataque-descoberto]
ensina: [Greek gift sacrifice, Exchange sacrifice, Smothered mate, Attacking the castled king]
---
A sacrifice is the voluntary surrender of material in return for something worth more: a checkmate, an attack your opponent can't contain, or a lasting positional advantage. The classic sacrifices — such as **Bxh7+**, known as the **Greek gift**, and the **exchange sacrifice** (a rook for a minor piece) — keep recurring because they grow out of the same structures. If you know each pattern and its conditions, you'll spot it at the board and, just as important, you'll know when it does **not** work.

## Calculated versus speculative sacrifices {#tipos}

Not all sacrifices are alike. It helps to separate two kinds:

- **Calculated:** you can see to the end. The sacrifice is followed by a forced sequence (checks, captures, mating threats) and you know you'll win the material back with interest or deliver mate. The Bxh7+ in this article is that kind.
- **Speculative or positional:** you can't see a concrete end, but you judge that the compensation — an exposed enemy king, more active pieces, a wrecked pawn structure — is worth the material. Exchange sacrifices are usually of this kind.

The first demands calculation. The second demands judgment. Both demand [pattern](artigo:taticas) knowledge, because nobody calculates from scratch an idea they have never seen.

## The Greek gift: Bxh7+ {#bxh7}

The Greek gift is the most famous attack against a kingside-castled king. The bishop takes on h7 with check, the king recaptures, the knight jumps to g5 with check and the queen comes in along the h-file.

```tabuleiro
fen: 4rrk1/ppqb1ppp/2n1p3/b2pP3/3P3P/2PB1N2/1P3PP1/R1BQ1RK1 w - - 0 1
setas: d3h7:vermelha f3g5 d1h5
casas: h7:vermelha
legenda: Model position for the Greek gift. White plays Bxh7+, Ng5+ and Qh5.
```

Before you sacrifice, check the **conditions**. In this model position all of them are present:

1. **The bishop on d3 aims at h7**, and the h7 pawn is defended only by the king.
2. **There is no black knight on f6.** White's e5 pawn takes that square away; a knight on f6 would guard h7 and h5.
3. **The knight reaches g5 safely.** Black has no dark-squared bishop to take it, and the h4 pawn supports it.
4. **The queen arrives fast** on the h-file: d1 to h5 in one move.
5. **The escape squares are covered:** the c1 bishop sits behind the knight on the diagonal to h6, ready for a [discovered check](artigo:ataque-descoberto), and the h4 pawn can advance with check.

The main line is 1.Bxh7+! Kxh7 2.Ng5+, and now the black king has four squares. None of them saves it:

- **2...Kg8 3.Qh5** — mate on h7 can't be stopped. We checked it with the engine: every black reply allows 4.Qh7#, because the f8 rook has no square (e8 is occupied) and the g5 knight covers f7.
- **2...Kh8 3.Qh5+ Kg8 4.Qh7#.**
- **2...Kg6 3.h5+!** — if 3...Kf5, then 4.g4#. If 3...Kh6, 4.Qg4 threatens a discovered check with the knight, and mate follows within a few moves.
- **2...Kh6 3.Nxe6+** — a discovered check from the c1 bishop. The knight on e6 also hits the queen on c7, and 4.Nxc7 wins it.

```tabuleiro
fen: 4rr2/ppqb1ppk/2n1p3/b2pP1N1/3P3P/2P5/1P3PP1/R1BQ1RK1 b - - 1 2
setas: d1h5:azul c1h6:amarela
casas: g8 h8 g6 h6
legenda: After 1.Bxh7+ Kxh7 2.Ng5+: the black king has four squares and all of them lose.
```

What if Black declines the bishop with 1...Kh8? Then White can simply retreat with 2.Bd3: a pawn up, with Black's castled position opened. A sacrifice whose worst case is winning a pawn is an excellent deal.

:::aviso
**⚠️ Careful:** change a single piece and the sacrifice can fail. With a black knight on f6, a black bishop on e7 (which takes on g5) or the white queen far from the h-file, Bxh7+ usually just gives away a piece. Check the conditions before, not after.
:::

## Queen sacrifices that end in mate {#dama}

The most spectacular sacrifices give up the queen, and they almost always follow known mating patterns:

- **Smothered mate:** the queen offers itself on g8 (or next to the king), a rook is forced to capture and plugs the last flight square, and the knight mates a king boxed in by its own pieces.
- **Anastasia's mate:** with a knight on e7 covering g8 and g6, the queen takes on h7, the king recaptures and a rook mates along the h-file.
- **Back-rank [deflection](artigo:desvio-e-sobrecarga):** the queen is given up to remove the only defender of the [eighth rank](artigo:mate-do-corredor), and the rook comes in with mate.

The exercises below feature two of these patterns. In every one of them, the sacrifice works only because **every move is forced**: check, forced capture, mate.

## The exchange sacrifice {#qualidade}

"The exchange" is the difference between a rook and a minor piece. Sacrificing the exchange means giving a rook for a bishop or a knight. On the point count you lose about two, but the rook is not always the most useful piece in the position. The most common reasons:

- **Wrecking the king's pawn cover.** In the [Sicilian](artigo:defesa-siciliana#dragao), ...Rxc3 is a classic: after bxc3, White's queenside castled position is left with doubled, isolated pawns, and the e4 pawn loses a defender.
- **Eliminating a key piece**, such as the knight that defends the king or the bishop that controls the squares of one color.
- **Gaining pawns and initiative:** the exchange often comes back with a pawn or two and very active pieces.

```tabuleiro
fen: 2r2rk1/pp1bppbp/3p1np1/q3n3/3NP1PP/1BN1BP2/PPPQ4/1K1R3R b - - 0 1
setas: c8c3:vermelha
casas: c3:vermelha e4
legenda: Sicilian model position: ...Rxc3 gives up the exchange to break White's queenside pawns and weaken e4.
```

Exchange sacrifices are usually positional: there is no mate in sight, and the evaluation depends on how long the compensation lasts. Former world champion Tigran Petrosian became famous for exchange sacrifices of this kind, played to neutralize his opponent's play.

## How to decide whether a sacrifice works {#decidir}

Before giving up material, ask these questions in this order:

1. **How many attackers and how many defenders?** Count the pieces taking part in the attack and the ones that can defend the king within two or three moves.
2. **Are the moves forcing?** Checks and captures limit the replies and make calculation possible. Quiet moves give your opponent time.
3. **What if they decline?** Many sacrifices can be declined. Calculate the refusal too.
4. **What is the worst case?** If it goes wrong, do you lose a piece and the game, or are you left with compensation?

:::dica
**💡 Tip:** when you can't calculate to the end, compare the worst case of the sacrifice with the best case of the quiet move. If the quiet move leads to a position with no prospects, the risk may be worth it.
:::

## Exercises

```exercicio
fen: 4rrk1/ppqb1ppp/2n1p3/b2pP3/3P3P/2PB1N2/1P3PP1/R1BQ1RK1 w - - 0 1
enunciado: The model position. Which move starts the decisive attack?
solucao: d3h7
dica: The h7 pawn is defended only by the king, and the knight can reach g5 with check.
explicacao: 1.Bxh7+! Kxh7 2.Ng5+ and Black loses in every line: 2...Kg8 3.Qh5 and 4.Qh7#; 2...Kh8 3.Qh5+ Kg8 4.Qh7#; 2...Kg6 3.h5+ with mate; 2...Kh6 3.Nxe6+ wins the queen. Declining with 1...Kh8 leaves White a pawn up after 2.Bd3.
```

```exercicio
fen: r3r2k/pp1b2pp/2pq3N/8/2Q5/2P5/PP3PPP/R4RK1 w - - 0 1
enunciado: White to play and **mate in 2** with a queen sacrifice.
tipo: mate
lances: 2
solucao: c4g8 e8g8 h6f7
dica: The knight on h6 guards g8. Who is forced to capture there?
explicacao: 1.Qg8+! Rxg8 (the king can't capture, because the h6 knight guards g8) 2.Nf7#. That's the smothered mate: the king is boxed in by its own pieces.
```

```exercicio
fen: 3r3k/ppq1N1pp/2p5/5R2/8/7Q/PPP2PPP/6K1 w - - 0 1
enunciado: White to play and **mate in 2**.
tipo: mate
lances: 2
solucao: h3h7 h8h7 f5h5
dica: The knight on e7 covers g8 and g6. Open the h-file.
explicacao: 1.Qxh7+! Kxh7 2.Rh5#. The e7 knight takes g8 and g6 away from the king, and the rook mates on the h-file — Anastasia's mate.
```

## Frequently asked questions {#faq}

### Why is Bxh7+ called the Greek gift?
The name alludes to the Trojan horse, the "gift from the Greeks": the bishop on offer hides an attack.

### When does Bxh7+ fail?
When there is a defender on f6, when Black can capture the knight on g5, when the white queen can't reach the h-file, or when the black king has a safe escape via f8 or g6.

### What does sacrificing the exchange mean?
Giving a rook for a minor piece (bishop or knight). In return you aim to wreck the king's pawn cover, eliminate a key piece, or win pawns and the initiative.

### How should I train sacrifices?
Solve mating-pattern and king-attack exercises, always calculating the most stubborn defense — including declining the sacrifice.
