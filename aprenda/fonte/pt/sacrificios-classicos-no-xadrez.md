---
id: sacrificios
titulo: "Sacrifícios Clássicos no Xadrez: Bxh7+ e Qualidade"
titulo_seo: "Sacrifícios no Xadrez: Grego e Qualidade | Xadrez Online"
descricao: Como funcionam os sacrifícios clássicos de ataque — o Bxh7+ (sacrifício grego), o mate sufocado e o sacrifício de qualidade — e como saber se um deles funciona.
nivel: avancado
ordem: 35
publicado: 2026-10-26
atualizado: 2026-10-26
tags: [sacrifício no xadrez, sacrifício grego, bxh7, sacrifício de qualidade, mate sufocado, mate abafado, ataque ao rei]
jogar: 3
relacionados: [taticas, calculo, desvio-e-sobrecarga, mate-do-corredor, ataque-descoberto]
ensina: [Sacrifício grego, Sacrifício de qualidade, Mate sufocado, Ataque ao rei roqueado]
---
Um sacrifício é a entrega voluntária de material em troca de algo que vale mais: um mate, um ataque que o adversário não consegue conter ou uma vantagem posicional duradoura. Os sacrifícios clássicos — como o **Bxh7+**, conhecido como **sacrifício grego**, e o **sacrifício de qualidade** (torre por peça menor) — se repetem há séculos porque nascem das mesmas estruturas. Quem conhece os padrões e as condições de cada um sabe reconhecê-los na hora e, mais importante, sabe quando eles **não** funcionam.

## Sacrifício calculado e sacrifício especulativo {#tipos}

Nem todo sacrifício é igual. Vale separar dois tipos:

- **Calculado:** você enxerga até o fim. Depois da entrega vem uma sequência forçada (xeques, capturas, ameaças de mate) e você sabe que recupera o material com juros ou dá mate. O Bxh7+ deste artigo é desse tipo.
- **Especulativo ou posicional:** você não vê um fim concreto, mas avalia que a compensação — rei inimigo exposto, peças mais ativas, estrutura de peões destruída — vale o material. O sacrifício de qualidade costuma ser desse tipo.

O primeiro exige cálculo. O segundo exige julgamento. Os dois exigem conhecer os [padrões](artigo:taticas), porque ninguém calcula do zero uma ideia que nunca viu.

## O sacrifício grego: Bxh7+ {#bxh7}

O sacrifício grego é o mais famoso ataque contra o roque pequeno. O bispo captura em h7 com xeque, o rei recaptura, o cavalo salta para g5 com xeque e a dama entra pela coluna h.

```tabuleiro
fen: 4rrk1/ppqb1ppp/2n1p3/b2pP3/3P3P/2PB1N2/1P3PP1/R1BQ1RK1 w - - 0 1
setas: d3h7:vermelha f3g5 d1h5
casas: h7:vermelha
legenda: Posição-modelo do sacrifício grego. Brancas jogam: Bxh7+, Cg5+ e Dh5.
```

Antes de sacrificar, confira as **condições**. Nesta posição-modelo todas estão presentes:

1. **O bispo de d3 mira h7** e o peão de h7 só é defendido pelo rei.
2. **Não há cavalo preto em f6.** O peão branco de e5 tira essa casa das Pretas; um cavalo em f6 defenderia h7 e h5.
3. **O cavalo chega a g5 em segurança.** O bispo preto de casas escuras está longe, em a5, e não alcança g5; além disso, o peão de h4 apoia o cavalo.
4. **A dama chega rápido** à coluna h: de d1 para h5 em um lance.
5. **As casas de fuga estão vigiadas:** o bispo de c1 fica atrás do cavalo na diagonal até h6, pronto para um [xeque descoberto](artigo:ataque-descoberto), e o peão de h4 pode avançar com xeque.

A linha principal é 1.Bxh7+! Rxh7 2.Cg5+, e agora o rei preto tem quatro casas. Nenhuma salva:

- **2...Rg8** — mate em dois lances; resolva no primeiro exercício abaixo.
- **2...Rh8 3.Dh5+ Rg8 4.Dh7#.**
- **2...Rg6 3.h5+!** — se 3...Rf5, então 4.g4#. Se 3...Rh6, 4.Cxe6+ é xeque descoberto do bispo de c1 e, como na linha seguinte, 5.Cxc7 ganha a dama.
- **2...Rh6 3.Cxe6+** — xeque descoberto do bispo de c1. O cavalo em e6 ainda ataca a dama em c7, e 4.Cxc7 ganha a dama.

```tabuleiro
fen: 4rr2/ppqb1ppk/2n1p3/b2pP1N1/3P3P/2P5/1P3PP1/R1BQ1RK1 b - - 1 2
setas: c1h6:amarela
casas: g8 h8 g6 h6
legenda: Depois de 1.Bxh7+ Rxh7 2.Cg5+: o rei preto tem quatro casas e todas perdem.
```

E se as Pretas recusarem o bispo com 1...Rh8? Então as Brancas podem simplesmente recuar com 2.Bd3: ficam com um peão a mais e o roque preto aberto. Um sacrifício que, no pior caso, ganha um peão é um ótimo negócio.

:::aviso
**⚠️ Cuidado:** troque uma única peça e o sacrifício pode falhar. Com um cavalo preto em f6, um bispo preto em e7 (que captura em g5) ou a dama branca longe da coluna h, o Bxh7+ costuma só entregar uma peça. Confira as condições antes, não depois.
:::

## Sacrifícios de dama que terminam em mate {#dama}

Os sacrifícios mais espetaculares entregam a dama, e quase sempre seguem padrões conhecidos de mate:

- **Mate sufocado** (ou abafado), que você viu em [desvio e atração](artigo:desvio-e-sobrecarga#atracao): a dama se oferece em g8 (ou na casa ao lado do rei), uma torre é obrigada a capturar e tapa a última casa de fuga; o cavalo dá mate num rei cercado pelas próprias peças.
- **Mate de Anastácia:** com um cavalo em e7 vigiando g8 e g6, a dama captura em h7, o rei recaptura e uma torre dá mate pela coluna h.
- **[Desvio](artigo:desvio-e-sobrecarga) na última fileira:** a dama se entrega para tirar o único defensor da [8ª fileira](artigo:mate-do-corredor) e a torre entra com mate.

Os exercícios abaixo trazem dois desses padrões. Em todos, o sacrifício só funciona porque **cada lance é forçado**: xeque, captura obrigatória, mate.

## O sacrifício de qualidade {#qualidade}

"Qualidade" é a diferença entre uma torre e uma peça menor. Sacrificar a qualidade é entregar uma torre por um bispo ou um cavalo. Na contagem de pontos você perde cerca de dois, mas a torre nem sempre é a peça mais útil da posição. Os motivos mais comuns:

- **Destruir a estrutura de peões do rei.** Na [Siciliana](artigo:defesa-siciliana#dragao), o lance ...Txc3 é clássico: depois de bxc3, o roque grande das Brancas fica com peões dobrados e isolados, e o peão de e4 perde um defensor.
- **Eliminar uma peça-chave**, como o cavalo que defende o roque ou o bispo que controla as casas de uma cor.
- **Ganhar peões e iniciativa:** muitas vezes a qualidade volta acompanhada de um ou dois peões e de peças muito ativas.

```tabuleiro
fen: 2r2rk1/pp1bppbp/3p1np1/q3n3/3NP1PP/1BN1BP2/PPPQ4/1K1R3R b - - 0 1
setas: c8c3:vermelha
casas: c3:vermelha e4
legenda: Posição-modelo da Siciliana: ...Txc3 entrega a qualidade para quebrar os peões do roque grande e enfraquecer e4.
```

O sacrifício de qualidade costuma ser posicional: não há mate à vista, e a avaliação depende de quanto a compensação dura. O ex-campeão mundial Tigran Petrosian ficou famoso por sacrifícios de qualidade desse tipo, feitos para neutralizar o jogo do adversário.

## Como decidir se o sacrifício funciona {#decidir}

Antes de entregar material, faça estas perguntas, nesta ordem:

1. **Quantos atacantes e quantos defensores?** Conte as peças que participam do ataque e as que podem defender o rei em dois ou três lances.
2. **Os lances são forçados?** Xeques e capturas limitam as respostas e deixam o cálculo possível. Lances quietos dão tempo ao adversário.
3. **E se ele não aceitar?** Muitos sacrifícios podem ser recusados. Calcule a recusa também.
4. **Qual é o pior cenário?** Se der errado, você perde uma peça e a partida, ou fica com compensação?

:::dica
**💡 Dica:** quando não conseguir calcular até o fim, compare o pior cenário do sacrifício com o melhor cenário do lance tranquilo. Se o lance tranquilo leva a uma posição sem perspectivas, o risco pode valer a pena.
:::

:::pratique Procure o Bxh7+
Jogue de Brancas contra o computador com estruturas de peão em e5 e confira as cinco condições do sacrifício grego antes de entregar o bispo.
:::

## Exercícios

```exercicio
fen: 4rrk1/ppqb1pp1/2n1p3/b2pP1N1/3P3P/2P5/1P3PP1/R1BQ1RK1 w - - 2 3
enunciado: Depois de 1.Bxh7+ Rxh7 2.Cg5+ Rg8, as Brancas dão **mate em 2** — e o primeiro lance não é xeque.
tipo: mate
lances: 2
solucao: d1h5 f7f5 h5h7
dica: O cavalo de g5 já vigia h7 e f7. Falta trazer a dama para a coluna h.
explicacao: 3.Dh5! ameaça 4.Dh7#, e não há defesa: a torre de f8 não tem casa (e8 está ocupada), f7 é vigiada pelo cavalo e nenhuma peça preta chega a h7 a tempo. Por exemplo, 3...f5 4.Dh7#. O motor confirma: qualquer lance preto permite o mate.
```

```exercicio
fen: r3r2k/pp1b2pp/2pq4/6N1/2Q5/2P5/PP4PP/5RK1 w - - 0 1
enunciado: Brancas jogam e dão **mate em 4**. Todos os lances são xeques. Você já conhece o fim deste golpe de [desvio e atração](artigo:desvio-e-sobrecarga#atracao); agora encontre o começo.
tipo: mate
lances: 4
solucao: g5f7 h8g8 f7h6 g8h8 c4g8 e8g8 h6f7
dica: Comece com o cavalo. O xeque duplo vem logo depois, e a dama se entrega no fim.
explicacao: 1.Cf7+ Rg8 2.Ch6+ (xeque duplo: cavalo e dama) Rh8 (f8 é vigiada pela torre de f1) 3.Dg8+! Txg8 (o rei não pode capturar, porque o cavalo de h6 protege g8) 4.Cf7#. É o mate sufocado completo, conhecido como legado de Philidor: o rei termina cercado pelas próprias peças.
```

```exercicio
fen: 3r3k/ppq1N1pp/2p5/5R2/8/7Q/PPP2PPP/6K1 w - - 0 1
enunciado: Brancas jogam e dão **mate em 2**.
tipo: mate
lances: 2
solucao: h3h7 h8h7 f5h5
dica: O cavalo de e7 vigia g8 e g6. Abra a coluna h.
explicacao: 1.Dxh7+! Rxh7 2.Th5#. O cavalo de e7 tira as casas g8 e g6 do rei, e a torre dá mate pela coluna h — o mate de Anastácia.
```

## Perguntas frequentes {#faq}

### Por que o Bxh7+ se chama sacrifício grego?
O nome alude ao cavalo de Troia, o "presente dos gregos": o bispo oferecido esconde um ataque.

### Quando o Bxh7+ não funciona?
Quando há um defensor em f6, quando as Pretas podem capturar o cavalo em g5, quando a dama branca não chega à coluna h ou quando o rei preto tem uma fuga segura por f8 ou g6.

### O que é sacrificar a qualidade?
É entregar uma torre por uma peça menor (bispo ou cavalo). Em troca, busca-se destruir a estrutura de peões do rei, eliminar uma peça-chave ou ganhar peões e iniciativa.

### Como treinar sacrifícios?
Resolva exercícios de padrões de mate e de ataque ao rei, sempre calculando a defesa mais resistente — inclusive a recusa do sacrifício.
