---
id: analisar-partidas
titulo: How to Analyze Your Chess Games
descricao: A 6-step method for reviewing your chess games, finding the decisive mistake, understanding why it happened and turning losses into progress.
nivel: intermediario
ordem: 70
publicado: 2026-10-26
atualizado: 2026-10-26
tags: [analyze chess games, chess analysis, decisive mistake, game review, replay, how to improve at chess, critical moment]
jogar: 2
relacionados: [taticas, calculo, relogio-e-psicologia, rotina-de-treino, erros-de-iniciante]
ensina: [Game analysis, Decisive mistake, Critical moment, Blunder check]
---
Analyzing a chess game means going back over it move by move, after it's finished, to find where the evaluation changed: the moment a good or equal position turned into a lost one. The goal isn't to list every mistake but to find the **decisive mistake** and understand **why** you made it, whether it was a threat you missed, a miscalculation, a bad plan or clock pressure. It's the habit that most separates players who improve from players who just pile up games.

## Why analyze, and why right after playing {#por-que "Why analyze"}

Playing lots of games without reviewing them just means repeating the same mistakes faster. Analysis turns every loss into a concrete lesson, and every narrow win into a warning.

Review the game **right after you finish**, while you still remember what you were thinking. That's the most valuable data you have: the engine shows the right move, but only you know why you chose the wrong one.

## The 6-step method {#metodo "The 6-step method"}

### 1. Get the moves back

No moves, no analysis. Write the game down in a notebook or a file. On Chess Online, at the end of every game the **Watch Replay** button opens a bar with ⏮ ◀ ▶ ⏭ controls, so you can jump to the start and step through move by move. In the leaderboard, under **Fastest win**, the games of the top three at each level also have a replay button, which is good material for seeing how strong players won.

### 2. Go through it without an engine first

Play through the whole game **without computer help** and mark:

- the moves where you spent a long time thinking;
- the moments when material changed hands;
- the moves where you changed plans or felt lost.

For each mark, write one sentence about what you were thinking at the time. Only then check with the engine.

### 3. Find the critical moment and the decisive mistake

A **critical moment** is a position where the choice really matters: there's one good move and several bad ones, or a decision that changes the type of game (trading queens, opening the center, going into an endgame). The **decisive mistake** is the move after which the game could no longer be saved. The two usually sit close together: most games are decided in two or three moves.

A practical tip: look for the **last moment the position was still defensible**. The next move is almost always the decisive mistake.

### 4. Classify the mistake

Give the mistake a name. The most common types:

- **[Tactical](artigo:taticas):** you missed a threat, a fork, a pin, a check.
- **[Calculation](artigo:calculo):** you saw the idea but got the count wrong at the end of the line.
- **Strategic:** the wrong plan, a bad trade, a piece left on a poor square for many moves.
- **Time:** low clock time led to a rushed move.
- **Psychological:** you relaxed when winning, or panicked when losing.

After a few weeks, the names start repeating. That's when you find out [what to train](artigo:rotina-de-treino).

### 5. Use the engine to confirm, not to think for you

The engine tells you **which** move was better, not **why**. For every mistake it flags, try to explain the idea behind the right move in your own words. If you can't, play the line out on the board until you get it. An evaluation you don't understand teaches you nothing.

### 6. Write down one lesson

Finish each review with one sentence: "in position X, I should have played Y, because Z." Keep these sentences in a mistakes notebook and reread them before you play. One lesson per game, over months, is worth more than ten half-reviewed games.

## The checklist that prevents the decisive mistake {#checklist "The blunder check"}

A large share of decisive mistakes fail one [simple test](artigo:erros-de-iniciante#habito), worth running **before** every move in a game and **on every suspicious move** during analysis:

1. **Checks:** what checks does my opponent have after my move?
2. **Captures:** which of my pieces will be attacked or left undefended?
3. **Threats:** what does my opponent's last move want to do?

The three examples below show mistakes this checklist would have prevented.

## Example 1: the mistake that isn't the first one {#exemplo-abertura "Example 1: the opening"}

After 1.e4 e5 2.Nf3 f6?, Black has already played badly: the move weakens the king and takes the best square away from the g8 knight. But the game isn't lost yet. The critical moment comes after 3.Nxe5!.

```tabuleiro
fen: rnbqkbnr/pppp2pp/5p2/4N3/4P3/8/PPPP1PPP/RNBQKB1R b KQkq - 0 3
setas: d8e7 f6e5:vermelha
legenda: After 3.Nxe5, the critical moment: 3...Qe7 limits the damage; 3...fxe5? is the decisive mistake.
```

Here 3...Qe7 hits the knight and, behind it, the e4 pawn. After 4.Nf3 Qxe4+ 5.Be2, Black wins the pawn back, though behind in development. The natural 3...fxe5?, however, opens the e8-h5 diagonal for White's queen.

```exercicio
fen: rnbqkbnr/pppp2pp/8/4p3/4P3/8/PPPP1PPP/RNBQKB1R w KQkq - 0 4
enunciado: Black has just played 3...fxe5?. Punish it: find the check that wins material.
solucao: d1h5 g7g6 h5e5
dica: The diagonal between h5 and e8 is now open. After the check, look for a double attack.
explicacao: 4.Qh5+! g6 5.Qxe5+ — the queen gives check and hits the h8 rook at the same time. If 4...Ke7, 5.Qxe5+ Kf7 6.Bc4+ and Black's king is exposed to a very strong attack.
```

The lesson for whoever lost with Black isn't "don't play 2...f6"; that's the obvious mistake. It's "before capturing, check your opponent's checks", step 1 of the checklist.

## Example 2: the mistake hidden in a natural move {#exemplo-tatica "Example 2: the natural move"}

In the Petrov Defense, after 1.e4 e5 2.Nf3 Nf6 3.Nxe5 Nxe4? (the right move is 3...d6), White plays 4.Qe2!, attacking the e4 knight.

```tabuleiro
fen: rnbqkb1r/pppp1ppp/8/4N3/4n3/8/PPPPQPPP/RNB1KB1R b KQkq - 1 4
setas: d8e7 e2e4:vermelha
legenda: After 4.Qe2, the queen attacks the e4 knight. If it leaves the e-file, White's e5 knight is free to give a discovered check.
```

The best defense is 4...Qe7, which only costs a pawn: 5.Qxe4 d6 6.d4 dxe5 7.dxe5. The natural knight retreat, though, loses the game.

```exercicio
fen: rnbqkb1r/pppp1ppp/5n2/4N3/8/8/PPPPQPPP/RNB1KB1R w KQkq - 2 5
enunciado: Black has retreated 4...Nf6??. White to play and win the queen.
solucao: e5c6
dica: The e5 knight stands in front of the queen, on the black king's file. Where can it go to attack another piece?
explicacao: 5.Nc6+! — a discovered check from the queen on e2, and the knight attacks the queen on d8. Black has to get out of check and loses the queen.
```

Notice that 3...Nxe4 was a mistake, but the **decisive mistake** was 4...Nf6. In your analysis it's important to tell them apart: the first is an opening theory problem; the second is a checklist problem.

## Example 3: the decisive mistake in an endgame {#exemplo-final "Example 3: the endgame"}

In endgames, the decisive mistake tends to be quiet: a king move that looks just like the others. In this position Black is to move and only one move draws.

```exercicio
fen: 8/8/4k3/8/3K4/4P3/8/8 b - - 0 1
enunciado: Black to play and draw. What's the only move?
solucao: e6d6
dica: Think opposition: stand face to face with White's king and leave it to move.
explicacao: 1...Kd6! takes the opposition and White's king can't advance. Every other move loses: for example, 1...Ke7? 2.Kd5! or 2.Ke5!, and White's king reaches a key square of the pawn (d5, e5 or f5).
```

```tabuleiro
fen: 8/4k3/8/8/3K4/4P3/8/8 w - - 1 2
setas: d4d5 d4e5
legenda: After the mistake 1...Ke7?, White wins with 2.Kd5 or 2.Ke5: the king reaches a key square and the pawn will promote.
```

A mistake like this only shows up in your review if you know the technique. That's why studying [king and pawn endgames](artigo:finais-de-peao) also makes your analysis better.

## Common mistakes when analyzing {#erros-comuns "Common analysis mistakes"}

- **Switching the engine on at move one.** You see arrows and numbers but learn nothing about what went wrong in your thinking.
- **Only analyzing losses.** Narrow wins also contain decisive mistakes your opponent failed to punish.
- **Blaming only the last mistake.** The move that dropped the queen may be the result of a bad position created ten moves earlier.
- **Reviewing without writing anything down.** Without a recorded lesson, the analysis is gone by the next game.
- **Ignoring the clock.** If the mistake came with little time left, the problem may be [time management](artigo:relogio-e-psicologia), not chess. Choosing the right [time control](artigo:ritmos-de-jogo) to train with helps too.

:::pratique Play, review, play again
Play a game against the computer, use Watch Replay at the end and apply the 6 steps. Then play the same opening again and see whether the lesson stuck.
:::

## Frequently asked questions {#faq "FAQ"}

### How long should I spend analyzing a game?

For fast games, 10 to 15 minutes is enough: find the critical moment and the decisive mistake, and write down the lesson. Long games deserve a more detailed review.

### Should I use a chess engine?

Yes, but only after your own review. Use it to confirm what you found and to catch what you missed, always trying to understand the idea behind the move it suggests.

### How do I find the decisive mistake?

Look for the last moment the position was still defensible. The next move is almost always the decisive mistake. In the engine, it's where the evaluation drops off a cliff.

### How do I watch the replay of my games on Chess Online?

At the end of every game, click Watch Replay and use the buttons to step forward or back move by move. In the leaderboard, the three fastest wins at each level also have a replay.
