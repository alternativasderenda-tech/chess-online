---
id: como-as-pecas-se-movem
titulo: Como as Peças de Xadrez se Movem
titulo_seo: Como as Peças de Xadrez se Movem | Xadrez Online
descricao: Como se move cada peça do xadrez — rei, dama, torre, bispo, cavalo e peão — e como cada uma captura, com diagramas e exercícios para iniciantes.
nivel: iniciante
ordem: 15
publicado: 2026-10-26
atualizado: 2026-10-26
tags: [como as peças de xadrez se movem, movimento das peças, como mexe o bispo, como anda a torre, como o peão captura]
jogar: 1
relacionados: [tabuleiro-e-notacao, movimento-do-cavalo, valor-das-pecas, lances-especiais]
ensina: [Movimento do rei, Movimento da dama, Movimento da torre, Movimento do bispo, Movimento do peão]
---
No xadrez, cada uma das seis peças se move de um jeito: a **torre** anda em linha reta (colunas e fileiras), o **bispo** anda nas diagonais, a **dama** junta os dois movimentos, o **rei** anda uma casa em qualquer direção, o **cavalo** salta em "L" e o **peão** avança para a frente e captura na diagonal. Todas as peças, menos o cavalo, param quando encontram outra peça no caminho, e todas capturam ocupando a casa da peça adversária.

## Regras que valem para todas as peças {#geral "Regras que valem para todas"}

Se você nunca jogou, o [guia para jogar xadrez do zero](artigo:jogar-do-zero) mostra a partida inteira em cinco passos; aqui o foco é o movimento de cada peça.

Antes de ver peça por peça, três regras gerais:

- **Capturar é ocupar.** Uma peça captura a adversária indo para a casa dela; a peça capturada sai do tabuleiro. Ninguém "pula e come", como nas damas.
- **Não se atravessa peças.** Torre, bispo, dama, rei e peão não passam por cima de nada. Só o cavalo salta.
- **Não se captura peça da própria cor**, e nenhum lance pode deixar o próprio rei em xeque (atacado).

Cada jogador começa com 16 peças: 1 rei, 1 dama, 2 torres, 2 bispos, 2 cavalos e 8 peões. Se ainda não sabe onde cada uma fica, veja [o tabuleiro e a notação](artigo:tabuleiro-e-notacao).

## A torre {#torre "A torre"}

A **torre** se move quantas casas quiser em linha reta, para a frente, para trás ou para os lados — sempre pela coluna ou pela fileira em que está. No meio de um tabuleiro vazio, ela alcança 14 casas.

```tabuleiro
fen: k7/8/8/8/3R4/8/8/7K w - - 0 1
setas: d4d8 d4d1 d4a4 d4h4
legenda: A torre em d4 controla toda a coluna d e toda a fileira 4.
```

As torres ficam mais fortes em colunas abertas (sem peões) e são essenciais no final da partida. Elas também participam do roque, um lance especial com o rei.

## O bispo {#bispo "O bispo"}

O **bispo** se move quantas casas quiser na diagonal. Por isso ele nunca muda de cor: o bispo que começa numa casa clara passa a partida inteira em casas claras. Cada jogador tem um bispo de casas claras e um de casas escuras.

```tabuleiro
fen: k7/8/8/8/3B4/8/8/7K w - - 0 1
setas: d4a7 d4h8 d4a1 d4g1
legenda: O bispo em d4 controla as duas diagonais que passam por ele (13 casas).
```

## A dama {#dama "A dama"}

A **dama** (também chamada de rainha) é a peça mais poderosa: ela se move como torre **e** como bispo, quantas casas quiser, em linha reta ou na diagonal. Do centro de um tabuleiro vazio, ela alcança 27 casas.

```tabuleiro
fen: k7/8/8/8/3Q4/8/8/7K w - - 0 1
setas: d4d8 d4d1 d4a4 d4h4 d4a7 d4h8 d4a1 d4g1
legenda: A dama em d4 soma as linhas da torre e as diagonais do bispo.
```

:::aviso
**⚠️ Cuidado:** por ser tão valiosa, a dama não deve sair cedo demais. Ela vira alvo, e o adversário ganha tempo atacando-a enquanto desenvolve as próprias peças.
:::

## O rei {#rei "O rei"}

O **rei** anda **uma casa** em qualquer direção. Ele é a peça mais importante: se ficar atacado sem saída, é xeque-mate e a partida acaba. Por isso o rei **nunca** pode ir para uma casa atacada pelo adversário, e os dois reis nunca ficam em casas vizinhas.

```tabuleiro
fen: k7/8/8/8/3K4/8/8/8 w - - 0 1
casas: c5 d5 e5 c4 e4 c3 d3 e3
legenda: O rei em d4 pode ir para qualquer uma das 8 casas vizinhas.
```

O rei também participa do roque, junto com a torre (veja os [lances especiais](artigo:lances-especiais)).

## O cavalo {#cavalo "O cavalo"}

O **cavalo** se move em "L": duas casas numa direção e uma para o lado. É a única peça que **salta** por cima das outras, e por isso pode sair já no primeiro lance da partida. Ele tem um artigo só dele: [como o cavalo se move](artigo:movimento-do-cavalo).

## O peão {#peao "O peão"}

O **peão** é a peça mais simples e a mais cheia de detalhes:

- **Anda só para a frente**, uma casa por vez. Nunca volta.
- **No primeiro movimento**, pode avançar uma ou duas casas.
- **Captura na diagonal**, uma casa à frente. É a única peça que captura de um jeito diferente de como anda.
- **Fica bloqueado** se houver qualquer peça na casa da frente — dele ou do adversário.

```tabuleiro
fen: k7/8/8/3p1n2/4P3/8/3P4/7K w - - 0 1
setas: e4d5:vermelha e4f5:vermelha d2d4
legenda: O peão de e4 pode capturar em d5 ou f5 (setas vermelhas). O peão de d2, que ainda não se moveu, pode avançar uma ou duas casas.
```

Quando chega à última fileira, o peão é **promovido**: vira dama, torre, bispo ou cavalo, à escolha do jogador. Há ainda a captura *en passant*. As duas regras estão nos [lances especiais](artigo:lances-especiais).

## Atacar e defender {#atacar-defender "Atacar e defender"}

Duas palavras aparecem o tempo todo no xadrez:

- Uma peça **ataca** uma casa (ou uma peça adversária) quando poderia ir até ela no próximo lance (o peão é a exceção: ataca as duas casas na diagonal à frente, mas só anda para a frente). A torre em d4 do primeiro diagrama ataca todas as casas da coluna d e da fileira 4.
- Uma peça está **defendida** (ou *protegida*) quando outra peça da mesma cor poderia capturar quem a capturasse. Se o adversário toma uma peça defendida, perde a dele em seguida.

Uma peça atacada e sem defesa está **solta** (ou *pendurada*): o adversário pode levá-la de graça. Quando você aprender o movimento de cada peça, comece a olhar o tabuleiro dessa forma: o que está atacado, o que está defendido e o que está solto. É o primeiro passo para não perder peças e para [ganhar as do adversário](artigo:garfo).

## Resumo dos movimentos {#resumo "Resumo"}

| Peça | Como anda | Pode saltar? |
|---|---|---|
| Rei | 1 casa em qualquer direção | Não |
| Dama | Linha reta e diagonal, quantas casas quiser | Não |
| Torre | Linha reta (coluna e fileira) | Não |
| Bispo | Diagonal | Não |
| Cavalo | Em "L" (2 + 1) | Sim |
| Peão | 1 casa para a frente (2 na primeira vez); captura na diagonal | Não |

## Exercícios {#exercicios "Exercícios"}

Use o que você aprendeu: um exercício de bispo, um de dama e um de peão. Toque (ou clique) na peça e depois na casa de destino.

```exercicio
fen: 6bk/7p/8/8/8/B7/8/6K1 w - - 0 1
enunciado: O bispo das Brancas pode dar **mate em 1**. Encontre o lance.
tipo: mate
lances: 1
solucao: a3b2
dica: O bispo de a3 anda pelas casas escuras. Qual diagonal leva direto ao rei preto?
explicacao: 1.Bb2# — o bispo entra na grande diagonal a1–h8 e dá xeque em h8. O rei não tem fuga: g8 e h7 estão ocupadas pelas próprias peças pretas, e g7 também está na diagonal do bispo. O bispo preto anda nas casas claras e não consegue se colocar no caminho.
```

```exercicio
fen: k7/8/1K6/8/8/8/4Q3/8 w - - 0 1
enunciado: Agora a dama. Dê **mate em 1**.
tipo: mate
lances: 1
solucao: e2e8
dica: O rei branco já cobre a7 e b7. Falta atacar o rei e cobrir b8.
explicacao: 1.De8# — a dama sobe a coluna e e dá xeque pela 8ª fileira, cobrindo também b8. As casas a7 e b7 estão tomadas pelo rei branco.
```

```exercicio
fen: k7/8/2n1r3/8/3P4/8/8/7K w - - 0 1
enunciado: Um lance de peão ataca duas peças pretas ao mesmo tempo. Qual?
tipo: tatica
solucao: d4d5
dica: O peão captura na diagonal. Para onde ele precisa ir para atacar c6 e e6?
explicacao: 1.d5! — o peão ameaça capturar o cavalo de c6 e a torre de e6. Nenhuma peça preta pode capturá-lo, e as Pretas não conseguem salvar as duas: as Brancas ganham material.
```

## Perguntas frequentes {#faq "Perguntas frequentes"}

### Qual é a peça mais forte do xadrez?

A dama, porque combina o movimento da torre e o do bispo. O rei é a mais importante, mas não a mais forte.

### O peão pode andar para trás?

Não. O peão só anda para a frente. As outras peças podem voltar.

### O peão pode andar duas casas a qualquer momento?

Não. Só no primeiro movimento de cada peão. Depois, ele anda uma casa por vez.

### Qual peça pode pular as outras?

Só o cavalo. Todas as outras param quando encontram uma peça no caminho.

### O bispo pode mudar de cor?

Não. Como ele só anda na diagonal, fica sempre em casas da mesma cor.

:::pratique Pratique os movimentos
Jogue contra o computador no nível Fácil. Antes de cada lance, olhe para onde cada peça sua pode ir — e para onde vão as do adversário.
:::
