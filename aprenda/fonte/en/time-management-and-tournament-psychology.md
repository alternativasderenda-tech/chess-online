---
id: relogio-e-psicologia
titulo: "Chess Clock and Psychology: Time and Nerves"
titulo_seo: Chess Time Management and Psychology | Chess Online
descricao: How to manage your time on the chess clock, avoid time trouble, control your nerves and how to play when you're winning or losing a chess game.
nivel: avancado
ordem: 50
publicado: 2026-10-26
atualizado: 2026-10-26
tags: [chess clock, time management, time trouble, chess psychology, nerves, stalemate, chess tournament]
jogar: 3
relacionados: [ritmos-de-jogo, empates, finais-de-peao, calculo, rotina-de-treino]
ensina: [Time management, Avoiding time trouble, Handling nerves, Playing when winning and when losing]
---
Time management in chess means budgeting your clock across the phases of the game, saving minutes for the critical moments, and keeping your nerves in check so you don't blunder under pressure. In practice, it means **budgeting your time** across the phases of the game and spending more at critical moments, **avoiding time trouble** (running short of time near the end), **controlling your nerves** with a fixed thinking routine, and **changing your attitude depending on the score on the board**: when winning, simplify and cut out counterplay; when losing, complicate and look for resources such as stalemate. Many games aren't decided by the best move but by the first mistake made under pressure.

## How to budget your time {#tempo}

Each time control calls for a different budget (see [time controls](artigo:ritmos-de-jogo)), but the logic is the same:

- **Opening:** play what you know quickly. Spending ten minutes on a theory move you've already studied is time you'll miss in the endgame.
- **Middlegame:** this is where time should be invested, especially in **critical positions** — when sacrifices are in the air, when a trade decides what kind of endgame you get, when the plan changes.
- **Endgame:** keep a reserve. Endgames demand precision, and many results change in the last moves.

One question helps you decide how long to think: **does this move change the nature of the position?** If it doesn't (an obvious recapture, a natural developing move), play it. If it does (trading queens, opening the center, sacrificing), stop and calculate.

:::dica
**💡 Tip:** use your opponent's time too. While they think, assess the position in broad terms and prepare your candidates — without calculating deeply a line that depends on a move they haven't made yet.
:::

## Time trouble: how to avoid it and how to survive it {#zeitnot}

Time trouble is when you have little time left for many moves. Time-trouble mistakes are rarely about knowledge: they're hurried moves made without a blunder check.

To **avoid** it:

1. Don't hunt for the perfect move in positions that don't demand precision. "Good enough" is enough.
2. Don't recalculate the same line. If you've already decided it's bad, drop it.
3. Use the increment: in time controls with an increment, every move you play gives you time back.

To **survive** it when it comes:

- **Simplify**: trade pieces if the position allows, keep your king safe and avoid complications.
- **Do only the essential check**: your opponent's checks, captures and threats after your move.
- **Know the basic endgames by heart.** [Opposition](artigo:finais-de-peao#oposicao), [Lucena and Philidor](artigo:finais-de-torre) must come out without calculation, because there won't be time to calculate.

```tabuleiro
fen: 8/8/3k4/8/3K4/3P4/8/8 b - - 0 1
casas: d4 d6
legenda: Opposition: with the kings face to face and Black to move, the black king must give way, and White wins. This kind of position has to come out "by heart" in time trouble.
```

## Nerves and mistakes {#nervosismo}

Every player gets nervous. What sets experienced players apart is a **routine** that works even with a racing heart:

- **Before the game:** arrive early, know the time control and the tournament rules, and have your opening decided.
- **During the game:** follow the same process for every move — opponent's threats, candidates, calculation, final check. The routine fills the space that anxiety would take.
- **Breathe** before important moves. It sounds too simple, but it helps you slow down.
- **After a mistake:** the position has changed, and only the position matters. Assess it as if it were a new one. The move right after a mistake is one of the most dangerous in the game, because it's often played in anger or in a hurry.

## How to play when you're winning {#vantagem}

When you're winning, the goal is to **reduce risk**, not to win in the prettiest way.

```tabuleiro
fen: 5rk1/5qpp/8/8/8/8/5QPP/R4RK1 w - - 0 1
setas: f2f7
legenda: A rook up, trading queens (Qxf7+) removes almost all of Black's counterplay.
```

- **Trade pieces, not pawns.** Every piece trade reduces your opponent's counterplay; you need the pawns to win the endgame.
- **Cut out counterplay** before pushing forward: ask what your opponent wants to do and stop it (prophylaxis).
- **Don't rush.** If the position is winning, it will still be winning next move. Safe moves are worth more than fast ones.
- **Watch out for [stalemate](artigo:xeque-mate-e-afogamento#afogamento)** in very lopsided endgames.

```tabuleiro
fen: 7k/8/5KQ1/8/8/8/8/8 b - - 0 1
casas: h8:vermelha g8 g7 h7
legenda: Stalemate: Black is not in check and has no legal move. It's a draw — half a point thrown away by haste.
```

## How to play when you're losing {#desvantagem}

When you're losing, the goal is to **create practical problems**:

- **Keep pieces on the board** and avoid trades that make life simple for your opponent.
- **Complicate**: messy positions demand calculation, and calculation burns time and breeds mistakes.
- **Look for drawing resources**: fortresses, opposite-colored bishops, perpetual check and stalemate.
- **Don't resign too early.** Many lost games have been saved because the opponent relaxed.

The first exercise below shows a classic resource for the side that's lost: the "desperado" rook, which keeps giving checks because capturing it produces stalemate.

## Draw offers {#empate}

A [draw offer](artigo:empates#acordo) is also a psychological decision. Under FIDE rules, it should be made **after making your move and before pressing the clock**. A few practical guidelines:

- **Offer a draw when the position justifies it**, not to escape the tension. An equal, simplified position is a good moment; a position where you're worse may be a bad one, because the offer reveals insecurity.
- **When you receive an offer, evaluate the position, not your opponent.** Ask whether you have real winning chances without serious risk of losing.
- **Consider the tournament situation**, but don't let it replace your assessment of the board.

:::pratique Play with a clock
Play the computer with a fixed time budget and note how much you spent on the opening, middlegame and endgame. The goal is to reach the endgame with time in hand.
:::

## Exercises

```exercicio
fen: 6r1/Q7/8/8/8/5K2/7p/7k b - - 0 1
enunciado: Black has a rook against a queen, and the black king has no moves. Black to play and draw.
solucao: g8g3|g8f8
dica: If the rook disappears, Black has no legal moves left.
explicacao: 1...Rg3+! If 2.Kxg3, it's stalemate. If the king runs, the rook keeps checking, always offering itself where taking it stalemates the black king. 1...Rf8+ works on the same idea. According to the endgame tablebase, these are the only drawing moves.
```

```exercicio
fen: 4k3/8/8/8/8/8/4P3/4K3 w - - 0 1
enunciado: Time trouble, and you're left with a king-and-pawn ending. White to play and win.
solucao: e1d2|e1f2
dica: Before pushing the pawn, the king goes in front of it.
explicacao: 1.Kd2! (or 1.Kf2) walks the king in front of the pawn, toward the key squares d4, e4 and f4. After 1...Kd7 2.Kd3 (or 2.Ke3), the white king reaches one of them before the black king does. Pushing the pawn first (1.e3? or 1.e4?) lets the black king settle in front of it, and it's a draw; 1.Kd1? and 1.Kf1? also draw. According to the endgame tablebase, only the two king moves forward win.
```

## Frequently asked questions {#faq}

### How do I avoid running out of time in chess?
Play the opening you know quickly, invest time only in critical positions, don't recalculate lines you've already rejected, and use the increment when the time control has one.

### What should I do in time trouble?
Simplify, keep your king safe, check your opponent's checks, captures and threats, and play the basic endgames without calculating.

### How do I control my nerves during a game?
Have a fixed routine for every move, breathe before important decisions and, after a mistake, assess the new position without dwelling on what happened.

### How should I play when I'm winning?
Trade pieces, cut out your opponent's counterplay, don't rush, and watch out for stalemate.

### And when I'm losing?
Keep the pieces on, complicate the position and look for drawing resources such as perpetual check, fortresses and stalemate.
