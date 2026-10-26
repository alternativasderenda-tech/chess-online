---
id: finais-de-torre
titulo: "Finais de Torre: as Posições de Lucena e Philidor"
titulo_seo: Finais de Torre: Lucena e Philidor | Xadrez Online
descricao: Aprenda as duas posições que todo jogador precisa saber nos finais de torre — Lucena (construir a ponte) e Philidor (torre na 3ª fileira) — com exercícios.
nivel: avancado
ordem: 30
publicado: 2026-10-26
atualizado: 2026-10-26
tags: [finais de torre, posição de lucena, posição de philidor, construir a ponte, final torre e peão, finais de xadrez]
jogar: 3
relacionados: [finais-de-peao, mates-basicos, estrutura-de-peoes, rotina-de-treino]
ensina: [Posição de Lucena, Posição de Philidor, Construir a ponte, Defesa na 3ª fileira]
---
Finais de torre são os finais mais frequentes do xadrez, e quase toda a teoria deles se apoia em duas posições de torre e peão contra torre. A **posição de Lucena** é a vitória-modelo: o lado com o peão ganha "construindo a ponte", isto é, usando a própria torre como escudo contra os xeques. A **posição de Philidor** é o empate-modelo: o lado mais fraco segura o jogo com a torre na sua **3ª fileira**, impedindo o rei adversário de avançar, e depois dá xeques por trás. Quem domina as duas sabe, em segundos, se deve forçar uma troca ou fugir dela.

## Por que estudar finais de torre primeiro {#por-que}

As torres são as últimas peças a sair de jogo. Em partidas de torneio, os finais com uma torre para cada lado são os mais comuns de todos. E são traiçoeiros: uma diferença de um peão nem sempre basta para ganhar, e um único lance passivo pode transformar um empate em derrota.

A boa notícia é que você não precisa decorar centenas de posições. Basta entender três ideias:

1. **Atividade vale mais do que material.** Uma torre ativa, que ataca peões e dá xeques, costuma compensar um peão a menos. Uma torre passiva, presa à defesa, perde.
2. **O rei cortado é o rei que não defende.** Se a sua torre [separa o rei adversário](artigo:mates-basicos#torre) do peão por uma coluna ou fileira inteira, você está jogando com um rei a mais.
3. **Lucena e Philidor são os pontos de chegada.** Quase todo final de torre e peão contra torre termina em uma das duas. Saber qual delas está no horizonte orienta cada lance.

## A posição de Lucena: construir a ponte {#lucena}

A posição de Lucena tem quatro ingredientes: o peão na 7ª fileira (que não seja de torre), o rei do atacante na casa de promoção, à frente do peão, o rei defensor cortado a pelo menos uma coluna de distância e a torre defensora dando xeques pelo lado. O nome homenageia o espanhol Luis Ramírez de Lucena, autor de um dos primeiros livros impressos de xadrez, embora a posição não apareça no livro dele.

```tabuleiro
fen: 3K4/3P1k2/8/8/8/8/2r5/4R3 w - - 0 1
setas: e1e7
casas: d8 d7 f7
legenda: Posição de Lucena: rei branco em d8, peão em d7 e rei preto cortado pela torre na coluna e. Brancas jogam e ganham.
```

O problema das Brancas é que o rei está preso em d8. Se ele sair, a torre preta começa a dar xeques e o rei não tem onde se esconder. A solução tem três tempos:

1. **Afastar o rei preto mais uma coluna** com um xeque: 1.Tf1+ Rg7.
2. **Levar a torre para a 4ª fileira**: 2.Tf4!. Este é o lance-chave. A torre não ataca nada, só se prepara para ser o escudo.
3. **Tirar o rei e bloquear o xeque com a torre**: o rei sai, os xeques chegam, e no momento certo a torre se interpõe.

Uma sequência típica é 2...Tc1 3.Re7 Te1+ 4.Rd6 Td1+ 5.Re6 Te1+ 6.Rd5 Td1+ 7.Td4!. Agora a torre branca em d4 corta o xeque e protege o rei, e o peão vai coroar. A torre na 4ª fileira foi a "ponte" por onde o rei atravessou.

```tabuleiro
fen: 8/3P2k1/8/3K4/3R4/8/8/3r4 b - - 0 1
setas: d4d1:vermelha
casas: d4:verde d7
legenda: A ponte construída: depois de 7.Td4, a torre branca bloqueia os xeques pela coluna d e o peão coroa.
```

:::dica
**💡 Dica:** por que a 4ª fileira? Porque o rei precisa descer até a 5ª fileira para escapar dos xeques, e a torre tem de estar logo abaixo dele para se interpor. Com a torre na 4ª, rei em d5 e torre em d4 fecham a coluna.
:::

## A posição de Philidor: a defesa na 3ª fileira {#philidor}

A posição de Philidor é a resposta defensiva. Leva o nome de François-André Danican Philidor, o grande jogador francês do século XVIII, que a analisou. O rei defensor está na casa de promoção do peão (ou bem à frente dele) e a torre defensora fica na **3ª fileira, contando a partir do lado dela** — para as Pretas, a 6ª fileira do tabuleiro.

```tabuleiro
fen: 4k3/7R/1r6/3KP3/8/8/8/8 w - - 0 1
setas: b6g6
casas: c6:vermelha d6:vermelha e6:vermelha
legenda: Posição de Philidor: a torre preta em b6 controla a 6ª fileira e o rei branco não consegue avançar.
```

A ideia é simples: enquanto o peão estiver na 5ª fileira, a torre preta proíbe o rei branco de pisar na 6ª. Sem o rei, o peão não avança com segurança. Se as Brancas jogarem e6 para abrir caminho ao rei, a torre muda de função imediatamente: vai para a 1ª fileira e passa a dar **xeques por trás**.

```tabuleiro
fen: 4k3/7R/4P3/3K4/8/8/8/1r6 w - - 0 1
setas: b1b5:azul
casas: e6
legenda: Depois de 1.e6 Tb1: o peão em e6 não protege mais o rei branco, que fica exposto aos xeques pela coluna e pela fileira.
```

Com o peão em e6, o rei branco perdeu o único abrigo que tinha: a casa à frente do próprio peão está ocupada. A torre preta dá xeque atrás de xeque e o rei não consegue se esconder. É empate.

:::aviso
**⚠️ Cuidado:** depois de e6, voltar a torre para a 8ª fileira (Tb8) **perde**. A torre tem de ir para longe, para a 1ª ou 2ª fileira, de onde tem distância para dar xeques. Torre perto do rei inimigo não dá xeque, só leva garfo.
:::

## O erro clássico: a defesa passiva {#defesa-passiva}

Muitos jogadores sabem que "[o rei tem de ficar na frente do peão](artigo:finais-de-peao)" e acham que isso basta. Não basta. Se a torre defensora ficar na 8ª fileira e o rei atacante chegar à 6ª, a torre perde a distância para os xeques e a defesa desmorona. Por isso a ordem da Philidor importa: **primeiro a torre na 3ª fileira, só depois os xeques por trás**.

Há posições em que o defensor demorou e ainda tem um último recurso: um xeque lateral que empurra o rei de volta e recupera a 3ª fileira. O segundo exercício abaixo mostra exatamente isso.

## Exercícios

```exercicio
fen: 8/3P4/8/3K2k1/5R2/8/8/3r4 w - - 0 1
enunciado: Lucena em andamento. As Pretas acabaram de dar xeque em d1 e o rei preto ataca a torre de f4. Brancas jogam e ganham.
solucao: f4d4
dica: A torre já está na 4ª fileira. Qual é o único lance que defende o rei e salva a torre ao mesmo tempo?
explicacao: 1.Td4! constrói a ponte: a torre bloqueia o xeque, sai do ataque do rei preto e o peão coroa em seguida. Segundo a base de finais, todos os lances de rei apenas empatam (e Rc4 chega a perder): só a ponte ganha.
```

```exercicio
fen: 1r2k3/7R/3K4/4P3/8/8/8/8 b - - 0 1
enunciado: As Pretas deixaram a torre na 8ª fileira e o rei branco já chegou a d6. Pretas jogam e empatam — só há um lance.
solucao: b8b6
dica: A torre precisa voltar para a 6ª fileira, e com tempo.
explicacao: 1...Tb6+! dá xeque e reocupa a 6ª fileira. O rei branco é expulso dela e a torre preta volta a controlá-la: é a defesa de Philidor de novo. Qualquer outro lance perde, porque com o rei branco instalado na 6ª e a torre preta colada na 8ª não há distância para os xeques.
```

## Regras práticas para levar ao tabuleiro {#regras}

- **Corte o rei.** No ataque, use a torre para separar o rei defensor do peão. Com o rei adversário cortado e o peão avançado, o caminho para a Lucena está aberto.
- **Torre atrás do peão passado.** Atrás do peão (o seu ou o do adversário), a torre ganha força a cada avanço. Na frente dele, perde.
- **Na defesa, ative antes de sofrer.** Coloque a torre na 3ª fileira enquanto o rei adversário ainda não chegou. Quando o peão avançar, troque para os xeques por trás.
- **Conte as colunas antes de trocar peças.** Se a troca leva a uma Lucena, ótimo. Se leva a uma Philidor, o adversário empata com facilidade.

:::pratique Treine finais contra a IA
Monte uma Lucena ou uma Philidor numa partida contra o computador e jogue as duas posições até executar a ponte e os xeques por trás sem pensar.
:::

## Perguntas frequentes {#faq}

### Toda torre e peão contra torre é empate?
Não. Com o rei defensor na frente do peão e a torre ativa, normalmente é empate (Philidor). Com o rei defensor cortado e o rei atacante à frente do próprio peão na 7ª, normalmente é vitória (Lucena).

### O que é "construir a ponte"?
É o método de Lucena: levar a torre à 4ª fileira, tirar o rei da frente do peão e, quando os xeques chegarem, interpor a torre para proteger o rei.

### Em qual fileira fica a torre na defesa de Philidor?
Na 3ª fileira do defensor (a 6ª do tabuleiro, quando são as Pretas que defendem). Depois que o peão avança para essa fileira, a torre vai para trás e dá xeques.

### Por que a defesa passiva na 8ª fileira perde?
Porque, com o rei atacante na 6ª fileira, a torre fica sem distância para dar xeques e o rei defensor é empurrado para fora da frente do peão.
