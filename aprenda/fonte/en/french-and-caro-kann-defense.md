---
id: francesa-e-caro-kann
titulo: French and Caro-Kann Defense: Plans and Lines
descricao: The French and Caro-Kann side by side: Advance, Winawer, Classical, Exchange and Panov, each side's plans and which of the two to choose against 1.e4.
nivel: intermediario
ordem: 55
publicado: 2026-10-26
atualizado: 2026-10-26
tags: [french defense, caro-kann, advance variation, winawer, tarrasch, exchange variation, panov attack, chess openings]
jogar: 2
relacionados: [defesa-siciliana, estrutura-de-peoes, bispos, gambito-da-dama-e-london, preparacao-de-aberturas]
---
The French Defense (**1.e4 e6**) and the Caro-Kann (**1.e4 c6**) are the two most popular solid defenses against 1.e4. In both, Black prepares ...d5 to challenge the e4 pawn on move two and relies on a sturdy [pawn structure](artigo:estrutura-de-peoes) rather than immediate tactics. The key difference is the light-squared bishop: in the French it stays locked behind the e6 pawn; in the Caro-Kann it gets out first, to f5 or g4.

## What the two have in common {#em-comum "What they share"}

After 1.e4 e6 2.d4 d5 or 1.e4 c6 2.d4 d5, White has to decide what to do with the attacked e4 pawn. There are three routes, and they show up in both defenses:

- **Advance (3.e5):** gains space and closes the center.
- **Defend (3.Nc3 or 3.Nd2):** keeps the tension; Black often trades with ...dxe4.
- **Exchange (3.exd5):** simplifies and opens the game.

That's why it pays to study them together: the plans rhyme, and knowing one helps you understand the other.

## French Defense {#francesa "French Defense"}

### Advance Variation: 3.e5

```tabuleiro
fen: rnbqkbnr/ppp2ppp/4p3/3pP3/3P4/8/PPP2PPP/RNBQKBNR b KQkq - 0 3
setas: c7c5 f7f6
casas: d4:vermelha e5:vermelha
legenda: The French Advance after 3.e5: Black attacks the pawn chain with ...c5 (at the base) and ...f6 (at the head).
```

With 3.e5, White grabs space on the kingside. Black's golden rule is to **attack the pawn chain**: ...c5 against the base (d4) and later ...f6 against the head (e5). The main line goes **3...c5 4.c3 Nc6 5.Nf3 Qb6**, with knight, queen and c5 pawn all piling up on d4.

The French's chronic problem is the **[c8 bishop](artigo:bispos)**, stuck behind e6. Black often deals with it through ...b6 and ...Ba6, trading it for White's good bishop, or leaves it on defensive duty until the position opens up.

### Winawer: 3.Nc3 Bb4

```tabuleiro
fen: rnbqk1nr/pp3ppp/4p3/2ppP3/3P4/P1P5/2P2PPP/R1BQKBNR b KQkq - 0 6
casas: c3:vermelha c2:vermelha g7
legenda: Winawer after 3.Nc3 Bb4 4.e5 c5 5.a3 Bxc3+ 6.bxc3: White has doubled pawns and the bishop pair; the dark squares around Black's king are weakened.
```

The **Winawer** is the sharpest line of the French. After **4.e5 c5 5.a3 Bxc3+ 6.bxc3**, both sides have clear trumps:

- **White:** the bishop pair, space, and the dark squares on Black's kingside now that the f8 bishop is gone. 7.Qg4, hitting g7, is the most direct try.
- **Black:** doubled white pawns to target (c3), queenside play with ...Ne7, ...Qc7 or ...Qa5, and a solid center.

### Classical, Tarrasch and Exchange

- **Classical (3.Nc3 Nf6):** after 4.Bg5, Black develops with ...Be7. After 4.e5 (the Steinitz Variation), the f6 knight is kicked and the game resembles the Advance.
- **Tarrasch (3.Nd2):** the knight can't be pinned by ...Bb4. The reply 3...c5 often leads to positions where Black has an isolated pawn on d5.
- **Exchange Variation (3.exd5 exd5):** a symmetrical structure and a free c8 bishop. It usually leads to a quiet game.

### Advance trap: the queen that forgets about b5

In the Advance, Black wants to win the d4 pawn. But if White's bishop is already on d3, capturing twice on d4 opens the b5-e8 diagonal for a check with a [discovered attack](artigo:ataque-descoberto).

```exercicio
fen: r1b1kbnr/pp3ppp/4p3/3pP3/3q4/3B4/PP3PPP/RNBQK2R w KQkq - 0 9
enunciado: After 5...Qb6 6.Bd3 cxd4 7.cxd4 Nxd4? 8.Nxd4 Qxd4??, White wins the queen. How?
solucao: d3b5 c8d7 d1d4
dica: White's queen on d1 and Black's queen on d4 share the d-file. Which piece can step out of the way with check?
explicacao: 9.Bb5+! — the bishop gives check and opens the d-file for the queen on d1. Whatever Black does (9...Bd7, 9...Ke7 or 9...Kd8), 10.Qxd4 follows.
```

## Caro-Kann {#caro-kann "Caro-Kann"}

### Classical: 3.Nc3 dxe4 4.Nxe4 Bf5

```tabuleiro
fen: rn1qkbnr/pp2pppp/2p5/5b2/3PN3/8/PPP2PPP/R1BQKBNR w KQkq - 1 5
setas: c8f5:azul
legenda: Classical Caro-Kann after 4...Bf5: the bishop gets out before ...e6, which is exactly the Caro-Kann's edge over the French.
```

Black develops the bishop with tempo on the e4 knight. The main line runs **5.Ng3 Bg6 6.h4 h6 7.Nf3 Nd7 8.h5 Bh7 9.Bd3 Bxd3 10.Qxd3**. The h-pawn advance gains space and pushes the bishop back. White often castles queenside, while Black finishes development with ...e6, ...Ngf6 and ...Be7 or ...Bd6. It's a solid position with comfortable endgames for Black.

Another option is **4...Nd7**, preparing ...Ngf6 without allowing a trade that doubles Black's pawns. Watch the move order, though, as the exercise below shows.

### Advance Variation: 3.e5 Bf5

```tabuleiro
fen: rn1qkbnr/pp2pppp/2p5/3pPb2/3P4/8/PPP2PPP/RNBQKBNR w KQkq - 1 4
setas: c6c5
legenda: Caro-Kann Advance after 3.e5 Bf5: the bishop sits outside the pawn chain, and the ...c5 break comes later.
```

Here the contrast with the French is plain to see: the bishop comes out **before** ...e6. Black then plays ...e6 and hits the chain with ...c5, even though that spends two tempi on the c-pawn (c6 and c5). White chooses between calm development (4.Nf3 and 5.Be2) and aggressive tries like 4.h4, which go after the f5 bishop.

### Exchange and the Panov-Botvinnik Attack

- **Exchange Variation (3.exd5 cxd5 4.Bd3):** a calm position with slow plans for both sides.
- **Panov-Botvinnik Attack (3.exd5 cxd5 4.c4):** White hits d5 with the c-pawn and often reaches positions with an **isolated pawn on d4** and active pieces.

### Caro-Kann trap: smothered mate on d6

After 4...Nd7 5.Qe2, the natural 5...Ngf6?? loses on the spot. The d7 knight takes away a flight square from the king and, as soon as the e4 knight moves, the queen on e2 pins the e7 pawn along the e-file.

```exercicio
fen: r1bqkb1r/pp1npppp/2p2n2/8/3PN3/8/PPP1QPPP/R1B1KBNR w KQkq - 2 6
enunciado: After 3.Nc3 dxe4 4.Nxe4 Nd7 5.Qe2 Ngf6??, White has **mate in 1**.
tipo: mate
lances: 1
solucao: e4d6
dica: Once the e4 knight moves, the e-file opens and the e7 pawn is pinned. Where does the knight give check?
explicacao: 6.Nd6# — the e7 pawn can't capture because it's pinned, and the king is hemmed in by its own pieces (d8, d7, e7, f7 and f8). A smothered mate.
```

:::dica
**💡 For Black:** after 4...Nd7 5.Qe2, play 5...e6 or 5...Ndf6. The move 5.Qe2 is rare: besides setting the trap, it blocks the f1 bishop.
:::

## French or Caro-Kann? Who each one suits {#qual-escolher "Which to choose"}

| If you prefer... | Choose |
| --- | --- |
| Counterattack and unbalanced positions | French (Winawer) |
| A solid structure and a good bishop | Caro-Kann |
| Playing against the pawn chain in the Advance | Both (with ...c5) |
| Quiet endgames and little forcing theory | Caro-Kann |

Both suit players who want a solid repertoire against 1.e4 without the theory load of the [Sicilian Defense](artigo:defesa-siciliana). The French is a bit more ambitious and the c8 bishop is the price; the Caro-Kann is calmer, and its cost is a little passivity early on.

:::pratique Test your defense against 1.e4
Play Black against the computer, alternating 1...e6 and 1...c6. After a few games you'll feel which structure suits you better.
:::

## Frequently asked questions {#faq "FAQ"}

### Is the Caro-Kann passive?

It's solid, not passive. Black accepts a little less space early on in exchange for a structure without weaknesses and comfortable endgames.

### What's the biggest problem in the French Defense?

The c8 bishop, locked behind the e6 pawn. Much of Black's planning revolves around activating it or trading it off.

### What should White play against these defenses?

The Advance is the simplest choice against both: the plan (space and defending the pawn chain) is clear and it avoids a lot of theory.

### Can I play both the French and the Caro-Kann?

You can, but while you're building a repertoire it's better to pick one and stick with it for months. The structures are similar, so studying one helps with the other.
