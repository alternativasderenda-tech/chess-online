---
id: finais-de-peao
titulo: "King and Pawn Endgames: Opposition, Square, Active King"
descricao: How to play king and pawn endgames: opposition, key squares, the rule of the square, rook pawns, passed pawns and the active king, with checked exercises.
nivel: intermediario
ordem: 65
publicado: 2026-10-26
atualizado: 2026-10-26
tags: [pawn endgames, king and pawn endgame, opposition, rule of the square, key squares, passed pawn, zugzwang, chess endgames]
jogar: 3
relacionados: [finais-de-torre, mates-basicos, empates, calculo, analisar-partidas]
ensina: [Opposition, Key squares, Rule of the square, Passed pawn, Active king]
---
A king and pawn endgame is the stage of the game where only kings and pawns are left on the board. The result hinges on three ideas: the **opposition** (who has to give way when the kings stand face to face), the **rule of the square** (whether a king can catch a passed pawn on its own) and **king activity**, because in the endgame the king stops being a target and becomes an attacking piece. Once you master these ideas, you can calculate pawn endgames precisely instead of guessing.

## Why pawn endgames are so exact {#exatos "Why they're exact"}

With so little material, every tempo counts. One king move in the wrong direction turns a win into a draw, or the other way around. Two practical consequences:

- **Trading down into a pawn endgame can't be undone.** Before you trade off the last piece, [calculate](artigo:calculo) the pawn ending all the way through.
- **Zugzwang is everywhere.** Zugzwang is a position where the side to move would rather pass, because every move makes things worse. In pawn endgames it's the main weapon.

## The active king {#rei-ativo "The active king"}

In the middlegame the king hides. In the endgame, with the queens gone and few pieces left, it's a strong piece: it attacks pawns, escorts its own passed pawn and blockades the opponent's. The practical rule is simple: **once the queens come off, the king heads for the center**. In many pawn endgames, whoever gets the king to the center or to the enemy pawns first wins.

## King and pawn vs king: key squares {#casas-chave "Key squares"}

The most basic ending is king and pawn against king. The question is always the same: can the attacking king reach a **key square**? If it does, the pawn promotes no matter whose move it is.

- For a pawn on the c-, d-, e- or f-file on the **2nd, 3rd or 4th rank**, the key squares are the **three squares two ranks in front** of it.
- For such a pawn on the **5th or 6th rank**, they are the **six squares one and two ranks in front**.
- Knight pawns on the 6th rank and rook pawns have exceptions. The rook pawn case is covered further down.

```tabuleiro
fen: 4k3/8/8/8/4P3/4K3/8/8 w - - 0 1
casas: d6:verde e6:verde f6:verde
legenda: With the pawn on e4, the key squares are d6, e6 and f6. Here Black's king is close enough to guard them, and the position is a draw whoever is to move.
```

The defender does the opposite: keeps the king **in front of the pawn** and denies access to the key squares. The tool for this, on both sides, is the opposition.

## The opposition {#oposicao "The opposition"}

Two kings are in **opposition** when they stand on the same file (or rank) with one square between them. Since kings can't stand next to each other, the side to move has to step aside and let the other king through. That's why we say **the side NOT to move has the opposition**.

```tabuleiro
fen: 8/3k4/8/3K4/3P4/8/8/8 b - - 0 1
setas: d5c6 d5e6
casas: d6
legenda: The kings are in opposition on d5 and d7. With Black to move, the black king has to give way and White's king gets in on c6 or e6. If it were White's move, it would be a draw.
```

The attacker uses the opposition to advance; the defender uses it to hold. There's also distant opposition (three or five squares between the kings), which follows the same logic: the side not to move has the edge.

```exercicio
fen: 8/4k3/8/8/4PK2/8/8/8 w - - 0 1
enunciado: White to play and win. Only one move works.
solucao: f4e5
dica: Put the king in front of the pawn, face to face with Black's king, and leave Black to move.
explicacao: 1.Ke5! takes the opposition. Black has to step aside: if 1...Kd7, 2.Kf6 reaches the key square f6; if 1...Kf7, 2.Kd6. Any other move, such as 1.e5?, hands the opposition to Black and draws.
```

```exercicio
fen: 8/4k3/8/8/4K3/4P3/8/8 b - - 0 1
enunciado: Black to play and draw. Only one move saves the game.
solucao: e7e6
dica: Stay in front of the pawn and leave White's king to move.
explicacao: 1...Ke6! takes the opposition. If 2.Kd4, 2...Kd6; if 2.Kf4, 2...Kf6. White's king never reaches d5, e5 or f5, the key squares for a pawn on e3. Any other move loses: White's king gains the opposition and reaches a key square.
```

## The rule of the square {#quadrado "The rule of the square"}

When the pawn runs on its own and its king is far away, you don't need to calculate move by move. Use the **rule of the square**:

1. Draw a square with one side running from the pawn to its promotion square.
2. If the defending king is inside it, or can step into it on its move, it catches the pawn.
3. If it can't get in, the pawn queens.

:::aviso
**⚠️ Watch the double step:** a pawn on its starting square can move two squares. When you draw the square, count it as if it were already one rank further up.
:::

```tabuleiro
fen: 8/8/8/7k/2P5/8/8/7K w - - 0 1
setas: c4c8
casas: c4 g4 g8 c8
legenda: The square of the c4 pawn runs from c4 to g8. With White to move, 1.c5 shrinks the square and leaves Black's king outside: the pawn queens. With Black to move, 1...Kg5 (or g4, g6) steps into the square and the king catches the pawn.
```

```exercicio
fen: 8/8/8/P7/4k3/8/8/7K b - - 0 1
enunciado: Black to play and draw. White's king is too far away to help.
solucao: e4d5
dica: Draw the square of the a5 pawn. Which square within the black king's reach is inside it?
explicacao: 1...Kd5! steps into the a5-d5-d8-a8 square. After 2.a6 Kc6 3.a7 Kb7, the pawn falls. Any other move leaves the king outside the square, and the pawn queens.
```

## The rook pawn: the corner draw {#peao-da-torre "The rook pawn"}

The rook pawn (a- and h-files) is the big exception. If the defending king reaches the promotion corner, the game is a draw even with the attacking king well placed: either the attacking king can't drive the defender out of the corner, or the defender ends up stalemated.

```tabuleiro
fen: k7/8/PK6/8/8/8/8/8 w - - 0 1
casas: a8:vermelha
legenda: Rook pawn with the black king in the corner: a draw, whoever is to move. If the pawn advances to a7, Black's king is either stalemated or goes back to a8.
```

In practice: if you have the rook pawn, keep the enemy king away from the corner. If you're defending, run for the corner.

## Passed pawns and the outside passed pawn {#peao-passado "Passed pawns"}

A **passed pawn** has no enemy pawns in front of it, either on its own file or on the neighboring files. Only the king and pieces can stop it. Two ideas are worth their weight in gold:

- **The outside passed pawn:** a passed pawn far from the other pawns is a decoy. While the enemy king goes off to capture it, your king attacks the pawns on the other side of the board.
- **The breakthrough:** sometimes, with pawns facing each other, a sacrifice clears the way and creates a passed pawn out of nowhere. That's the theme of the exercise below.

```exercicio
fen: 8/ppp3k1/8/PPP5/8/8/8/6K1 w - - 0 1
enunciado: White to play and win. The kings are far away and only one pawn move works.
solucao: b5b6 c7b6 a5a6 b7a6 c5c6
dica: Sacrifice the middle pawn. After each capture, push the pawn that's no longer blocked.
explicacao: 1.b6! cxb6 2.a6! bxa6 3.c6 and the c-pawn queens: Black's king can't catch it. If 1...axb6, 2.c6! bxc6 3.a6, and now the a-pawn runs. In general, a slower first move gives Black's king time to come closer (1...Kf6), and the breakthrough may no longer work.
```

## How to think in a pawn endgame {#metodo "How to think"}

1. **Count the tempi.** How many moves does each pawn need to promote? Who gets there first?
2. **Look for the opposition.** When the kings are close, the side to move is the one that gives ground.
3. **Apply the square.** Before calculating, check whether the king can catch the pawn.
4. **Activate the king.** When in doubt, bring it toward the center and the pawns.

When you review your games, pawn endgames are a great place to find the decisive mistake, because there's almost always a single correct move. See the method in [how to analyze your chess games](artigo:analisar-partidas).

:::pratique Practice endgames against the computer
Play a game and try to trade down into a pawn endgame. On Hard, every wasted tempo gets punished, which is the best way to make the opposition and the square stick.
:::

## Frequently asked questions {#faq "FAQ"}

### What is the opposition in chess?

It's when the two kings stand on the same file or rank with one square between them. The side not to move "has the opposition", because the other king is forced to give way.

### What is the rule of the square?

It's a shortcut for telling whether a king can catch a passed pawn: if the king is inside the square between the pawn and its promotion square (or can step into it on its move), it catches the pawn.

### Is king and pawn vs king always a win?

No. With the defending king in front of the pawn and the opposition used correctly, many positions are drawn. A rook pawn is almost always a draw if the defending king reaches the corner.

### What is zugzwang?

It's a position where the side to move would rather pass, because every move makes things worse. In pawn endgames it decides a large share of games.
