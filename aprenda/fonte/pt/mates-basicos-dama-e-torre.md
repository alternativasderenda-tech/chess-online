---
id: mates-basicos
titulo: "Mates Básicos: Dama e Torre Contra o Rei"
titulo_seo: Mates Básicos com Dama e Torre | Xadrez Online
descricao: Como dar xeque-mate com rei e dama, com rei e torre e com duas torres contra o rei sozinho, passo a passo, sem cair no afogamento. Com exercícios.
nivel: iniciante
ordem: 55
publicado: 2026-10-26
atualizado: 2026-10-26
tags: [mates básicos, mate de dama, mate de torre, mate com duas torres, mate da escada, como dar xeque-mate]
jogar: 1
relacionados: [xeque-mate-e-afogamento, empates, finais-de-peao, finais-de-torre, mate-do-corredor]
ensina: [Mate com duas torres, Mate com rei e dama, Mate com rei e torre]
---
Os **mates básicos** são as técnicas para dar xeque-mate quando o adversário ficou só com o rei: **rei e dama contra rei**, **rei e torre contra rei** e **duas torres contra rei**. Os três são vitórias garantidas, desde que você saiba o método: empurrar o rei adversário até a borda do tabuleiro e dar o mate ali, sem cair no afogamento. Com jogo correto, o mate de dama sai em no máximo 10 lances e o de torre em no máximo 16, de qualquer posição.

## A ideia comum: levar o rei para a borda {#ideia "A ideia comum"}

No meio do tabuleiro, um rei sozinho tem até 8 casas para fugir. Na borda, tem no máximo 5; no canto, só 3. Por isso todo mate básico segue o mesmo roteiro:

1. **Diminua o espaço** do rei adversário, como se ele estivesse numa caixa que vai encolhendo.
2. **Traga o seu rei** para ajudar (no mate de dama e no de torre ele é indispensável).
3. **Dê o mate na borda**, conferindo antes de cada lance se o adversário ainda tem um lance legal.

O passo 3 é o mais importante. Se o rei adversário ficar sem lances **sem estar em xeque**, é afogamento, e a partida termina empatada. Releia a diferença em [xeque, xeque-mate e afogamento](artigo:xeque-mate-e-afogamento).

## Mate com duas torres: a escada {#escada "Mate com duas torres (escada)"}

É o mais fácil e não precisa do rei. As torres se revezam, como degraus de uma escada:

1. Uma torre **corta** uma fileira (o rei adversário não pode atravessá-la).
2. A outra dá **xeque** na fileira seguinte, empurrando o rei mais uma fileira para trás.
3. Repita até o rei chegar à última fileira, e o último xeque é mate.

```tabuleiro
fen: R3k3/1R6/8/8/8/8/8/6K1 b - - 3 2
setas: a8e8:vermelha
casas: e8:vermelha
legenda: O fim da escada: a torre de b7 tira toda a 7ª fileira e a de a8 dá xeque pela 8ª. Xeque-mate.
```

:::dica
**💡 Dica:** se o rei adversário chegar perto de uma torre para atacá-la, leve essa torre para o **outro lado** do tabuleiro, bem longe, e continue a escada.
:::

## Mate com rei e dama {#dama "Mate com rei e dama"}

A dama sozinha não dá mate; ela precisa da ajuda do rei. O método mais simples:

1. **Coloque a dama a um salto de cavalo do rei adversário.** Assim ela fecha uma "caixa" em volta dele, sem dar xeque.
2. **Acompanhe o rei**: cada vez que ele se mexe, mova a dama mantendo a mesma distância, e a caixa diminui até o rei ficar preso na borda.
3. **Quando o rei estiver na borda, pare de apertar com a dama** e traga o seu rei para perto.
4. **Dê o mate**: com a dama colada no rei adversário e protegida pelo seu rei, ou na própria borda, com o seu rei tirando as casas da frente.

```tabuleiro
fen: 4k3/4Q3/3K4/8/8/8/8/8 b - - 1 1
casas: e8:vermelha
legenda: Mate com dama: a dama em e7, colada no rei preto e protegida pelo rei branco, cobre todas as casas de fuga.
```

:::aviso
**⚠️ Cuidado com o afogamento.** Com o rei adversário encurralado no canto, quase todo lance "apertado" da dama tira as casas dele sem dar xeque. Quando ele só tiver duas ou três casas, traga o seu rei antes de mexer de novo a dama.
:::

## Mate com rei e torre {#torre "Mate com rei e torre"}

A torre também precisa do rei, e o processo é um pouco mais longo:

1. **[Corte o rei](artigo:finais-de-torre) com a torre**: coloque-a numa coluna ou fileira que ele não possa atravessar.
2. **Traga o seu rei** para ficar de frente para o rei adversário, com uma casa entre os dois. Essa posição, em que os reis se encaram e nenhum pode avançar, chama-se **[oposição](artigo:finais-de-peao)**.
3. **Quando os reis estiverem em oposição, dê xeque com a torre**: o rei adversário é empurrado uma fileira (ou coluna) para trás.
4. **Se os reis ainda não estão frente a frente, aproxime o seu rei.** Quando ele estiver a um passo da oposição, faça um **lance de espera** com a torre, sem sair da linha que corta o rei. Aí o rei adversário ou entra na oposição e leva o xeque, ou se afasta, e você o acompanha com o rei.
5. Repita até a borda. O xeque final é dado com os reis frente a frente.

```tabuleiro
fen: 8/8/2k5/8/8/8/3R4/4K3 w - - 0 1
setas: d2d8:vermelha
legenda: A torre em d2 corta a coluna d: o rei preto não pode passar para as colunas d a h. Agora o rei branco se aproxima.
```

```tabuleiro
fen: 3k3R/8/3K4/8/8/8/8/8 b - - 1 1
setas: h8d8:vermelha
casas: d8:vermelha
legenda: O mate de torre: os reis frente a frente (oposição), o rei branco cobre c7, d7 e e7, e a torre dá xeque pela 8ª fileira.
```

:::dica
**💡 Dica:** mantenha a torre **longe** do rei adversário. Se ele chegar perto dela e o seu rei não a estiver protegendo, mude a torre para o outro lado da mesma linha.
:::

## E a regra dos 50 lances? {#regra-50 "E a regra dos 50 lances?"}

Se passarem 50 lances de cada lado sem nenhuma captura e sem nenhum movimento de peão, a partida pode ser declarada empatada (veja [empate no xadrez](artigo:empates)). Os mates básicos cabem com folga nesse limite, mas só se você tiver um método. Mexer as peças sem plano é o jeito mais comum de não conseguir dar o mate a tempo.

## Exercícios {#exercicios "Exercícios"}

```exercicio
fen: 7k/8/6K1/8/8/8/8/5Q2 w - - 0 1
enunciado: Rei e dama contra rei. Dê **mate em 1**.
tipo: mate
lances: 1
solucao: f1f8
dica: O seu rei já tira g7 e h7. A dama precisa dar xeque pela última fileira.
explicacao: 1.Df8# — a dama dá xeque pela 8ª fileira e cobre g8; g7 e h7 estão com o rei branco. É o mate "na borda", com o seu rei tirando as casas da frente.
```

```exercicio
fen: 8/8/8/8/8/5K1k/8/R7 w - - 0 1
enunciado: Os reis estão em oposição. Dê **mate em 1** com a torre.
tipo: mate
lances: 1
solucao: a1h1
dica: O rei branco já cobre g2, g3 e g4. Basta dar xeque pela coluna h.
explicacao: 1.Th1# — a torre dá xeque pela coluna h, e as casas da coluna g estão com o rei branco.
```

```exercicio
fen: 8/3k4/7R/8/8/8/8/K5R1 w - - 0 1
enunciado: Duas torres contra o rei. Use a escada e dê **mate em 2**.
tipo: mate
lances: 2
solucao: g1g7 d7d8 h6h8
dica: A torre de h6 já corta a 6ª fileira. Com a outra, empurre o rei mais uma fileira.
explicacao: 1.Tg7+ (o rei vai para a 8ª fileira) Rd8 2.Th8# — a torre de g7 cobre a 7ª fileira e a de h8 dá mate pela 8ª. Se o rei for para c8 ou e8, o mate é o mesmo. Cuidado com 1.Th7+?: ele solta a 6ª fileira e o rei escapa.
```

```exercicio
fen: 3k4/8/2K5/8/7R/8/8/8 w - - 0 1
enunciado: Rei e torre contra rei. As Brancas dão **mate em 2**.
tipo: mate
lances: 2
solucao: h4e4 d8c8 e4e8
dica: Primeiro corte a fuga do rei preto para o lado do rei. Ele só vai ter uma casa.
explicacao: 1.Te4! Rc8 (o único lance) 2.Te8# — a torre tira e7 e e8; o rei preto é obrigado a ir para c8, e o xeque pela 8ª fileira é mate, porque b7, c7 e d7 estão com o rei branco.
```

## Perguntas frequentes {#faq "Perguntas frequentes"}

### Dá para dar mate só com rei e torre?

Sim. Rei e torre contra rei é sempre vitória, com o método de cortar o rei e usar a oposição.

### Quantos lances leva o mate de dama?

Com jogo perfeito, no máximo 10 lances a partir de qualquer posição. Na prática, iniciantes levam um pouco mais, e tudo bem.

### Por que meu adversário ficou afogado?

Porque o rei dele não estava em xeque e não tinha nenhum lance legal. Isso costuma acontecer quando a dama aperta demais o rei no canto. Traga o seu rei antes de fechar a última casa.

### Dá para dar mate com rei e bispo, ou rei e cavalo?

Não. Um bispo ou um cavalo sozinhos (com o rei) não conseguem dar mate, e a partida é empate por material insuficiente. Com **bispo e cavalo** juntos o mate é possível, mas é bem mais difícil.

### Preciso do meu rei no mate de duas torres?

Não. As duas torres dão mate sozinhas, revezando os xeques como numa escada.

:::pratique Treine o final contra o computador
Jogue contra o computador no nível Fácil e, quando ficar com muito material a mais, troque as peças e tente dar o mate de dama ou de torre usando o método deste artigo.
:::
