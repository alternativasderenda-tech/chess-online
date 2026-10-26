---
id: taticas
titulo: Táticas de Xadrez: o Guia dos Padrões que Ganham Partidas
titulo_seo: Táticas de Xadrez: Guia dos Padrões Básicos | Xadrez Online
descricao: O que são táticas de xadrez, os padrões que todo jogador precisa conhecer (garfo, cravada, espeto, ataque descoberto, mate do corredor) e como treinar.
nivel: intermediario
ordem: 10
publicado: 2026-10-26
atualizado: 2026-10-26
tags: [táticas de xadrez, tática de xadrez, padrões táticos, garfo, cravada, espeto, exercícios de xadrez]
jogar: 2
relacionados: [garfo, cravada, calculo, sacrificios, analisar-partidas]
ensina: [Táticas de xadrez, Padrões táticos, Cálculo]
---
**Tática de xadrez** é uma sequência curta de lances, quase sempre forçada, que ganha material ou dá [xeque-mate](artigo:xeque-mate-e-afogamento) aproveitando um ponto fraco concreto da posição adversária. Ela se apoia em poucos **padrões** que se repetem o tempo todo: o garfo, a cravada, o espeto, o ataque descoberto, o desvio e o mate do corredor. Quem aprende a reconhecer esses padrões passa a ganhar peças e partidas que antes deixava escapar.

## Tática x estratégia {#tatica-x-estrategia "Tática x estratégia"}

A **estratégia** responde à pergunta "o que eu quero fazer nesta posição?": melhorar uma peça, atacar um peão fraco, abrir uma coluna. A **tática** responde a "o que eu consigo ganhar agora?". Ela trabalha com lances concretos, que se calculam do começo ao fim.

As duas andam juntas. Uma boa estratégia cria posições em que as táticas aparecem; uma tática bem calculada transforma a vantagem em material ou em mate. Mas, para quem está saindo do nível iniciante, a tática pesa muito mais: a maioria das partidas entre jogadores de clube é decidida por uma peça que ficou solta ou por um golpe que um dos lados não viu.

## Os padrões que você precisa conhecer {#padroes "Os padrões"}

| Padrão | A ideia em uma frase | Artigo |
|---|---|---|
| Garfo | uma peça ataca duas ao mesmo tempo | [Garfo](artigo:garfo) |
| Cravada | a peça atacada não pode sair porque protege outra mais valiosa | [Cravada](artigo:cravada) |
| Espeto | a peça valiosa da frente sai e a de trás cai | [Espeto](artigo:espeto) |
| Ataque descoberto | uma peça sai da frente e revela o ataque de outra | [Ataque descoberto](artigo:ataque-descoberto) |
| Desvio e sobrecarga | você ataca o defensor em vez do alvo | [Desvio e sobrecarga](artigo:desvio-e-sobrecarga) |
| Mate do corredor | xeque-mate na última fileira, com o rei preso pelos peões | [Mate do corredor](artigo:mate-do-corredor) |

A ordem da tabela é a ordem sugerida de estudo: cada padrão usa ideias do anterior.

### Garfo

O garfo é o ataque duplo: uma peça atinge duas peças adversárias e só uma pode ser salva. O cavalo é o especialista, mas peões, damas e até o rei dão garfos.

```tabuleiro
fen: 3qk2r/5Npp/8/8/2B5/8/2Q2PPP/6K1 b k - 0 1
setas: f7d8 f7h8
casas: d8 h8
legenda: O cavalo de f7, protegido pelo bispo de c4, ataca a dama de d8 e a torre de h8 ao mesmo tempo.
```

### Cravada

Na cravada, uma peça de longo alcance (bispo, torre ou dama) ataca uma peça que não pode sair do lugar, porque atrás dela há algo [mais valioso](artigo:valor-das-pecas). Se for o rei, mover a peça cravada é ilegal.

```tabuleiro
fen: 4k3/8/2n5/1B6/8/8/5PPP/6K1 w - - 0 1
setas: b5e8:vermelha
casas: c6 e8:vermelha
legenda: O cavalo de c6 está cravado: atrás dele, na diagonal do bispo de b5, está o rei de e8.
```

### Espeto

O espeto é a cravada ao contrário: a peça da frente vale mais, é obrigada a sair, e a de trás é capturada. O espeto com xeque é o mais forte.

```tabuleiro
fen: 8/8/R2k3r/8/8/8/5PPP/6K1 b - - 0 1
setas: a6d6:vermelha d6h6
casas: d6:vermelha h6
legenda: A torre de a6 dá xeque no rei de d6. Quando o rei sair da sexta fileira, a torre captura a torre de h6.
```

### Ataque descoberto

Uma peça sai da frente de outra e revela um ataque. Se o ataque revelado for ao rei, é xeque descoberto; se a peça que saiu também dá xeque, é xeque duplo, a tática mais forçante que existe.

```tabuleiro
fen: 3q4/5pkp/6p1/8/3N4/8/5PPP/3R2K1 w - - 0 1
setas: d4f5 d1d8:vermelha
casas: d4 d8
legenda: O cavalo de d4 está na frente da torre de d1. Com 1.Cf5+ (ou 1.Ce6+), ele sai dando xeque e a torre passa a atacar a dama de d8: as Pretas cuidam do rei e perdem a dama.
```

### Desvio, atração e sobrecarga

Quando o alvo está bem defendido, ataque o defensor: desvie-o com uma troca ou um xeque, atraia o rei para uma casa ruim ou explore uma peça que defende duas coisas ao mesmo tempo.

```tabuleiro
fen: 6k1/3q1ppp/8/1b3n2/8/5Q2/5PPP/1R4K1 w - - 0 1
setas: b1b5 f3f5 d7b5:azul d7f5:azul
casas: d7:vermelha
legenda: A dama de d7 defende o bispo de b5 e o cavalo de f5. Depois de 1.Txb5 Dxb5 2.Dxf5, as Brancas ganham material.
```

### Mate do corredor

O rei roqueado atrás dos três peões não tem para onde ir. Uma torre ou dama na última fileira, sem defensor que a capture ou bloqueie, dá mate.

```tabuleiro
fen: 3Q2k1/5ppp/8/8/8/8/5PPP/6K1 b - - 0 1
setas: d8g8:vermelha
casas: g8:vermelha
legenda: Dd8#. O rei de g8 está preso pelos próprios peões.
```

## Como enxergar táticas na partida {#como-enxergar "Como enxergar táticas"}

Táticas aparecem quando a posição tem um ponto fraco. Os sinais mais comuns são:

- **Peças soltas** (sem defesa). Há um ditado conhecido em inglês: *loose pieces drop off*, "peças soltas caem".
- **Rei exposto** ou sem casa de fuga.
- **Peças alinhadas** na mesma diagonal, coluna ou fileira, prontas para cravadas e espetos.
- **Peças sobrecarregadas**, que defendem duas coisas ao mesmo tempo.

Antes de cada lance, faça a varredura **xeques, capturas e ameaças**: olhe primeiro todos os xeques possíveis, depois todas as capturas, depois os lances que criam ameaças. É nessa ordem que os golpes costumam aparecer, porque são os lances que limitam as respostas do adversário.

:::dica
**💡 Dica:** faça a mesma varredura do ponto de vista do adversário. Metade da tática é ver o golpe do outro antes que ele aconteça.
:::

## Como treinar táticas {#treinar "Como treinar"}

1. **Resolva exercícios curtos todos os dias.** Quinze minutos por dia rendem mais do que duas horas no fim de semana.
2. **Estude um padrão de cada vez**, na ordem da tabela acima, e só avance quando os exercícios do padrão ficarem fáceis.
3. **Calcule antes de mexer.** No exercício, só toque na peça quando tiver [a linha inteira na cabeça](artigo:calculo), inclusive a melhor resposta do adversário.
4. **Jogue partidas** e, depois de cada uma, [procure as táticas que você e o adversário perderam](artigo:analisar-partidas).
5. **Siga um plano.** Para encaixar as táticas numa rotina semanal com finais, aberturas e análise, veja [como treinar xadrez](artigo:rotina-de-treino).

Se ainda perde peças por descuido, revise antes os [erros comuns de iniciantes](artigo:erros-de-iniciante).

:::pratique Treine táticas agora
Jogue contra o computador no nível Médio. Ele erra o suficiente para deixar táticas no tabuleiro, e a cada partida você vai reconhecê-las mais rápido.
:::

## Exercícios para começar {#exercicios "Exercícios"}

Um exercício de quatro dos seis padrões; os outros estão nos artigos de [ataque descoberto](artigo:ataque-descoberto#exercicios) e [desvio e sobrecarga](artigo:desvio-e-sobrecarga#exercicios). Toque (ou clique) na peça e depois na casa de destino.

```exercicio
fen: 6k1/p2r1p1p/1p4p1/8/4N3/8/PP3PPP/6K1 w - - 0 1
enunciado: Brancas jogam e **ganham a torre** com um garfo.
solucao: e4f6 g8g7 f6d7
dica: Procure uma casa de onde o cavalo dê xeque e ataque a torre de d7.
explicacao: 1.Cf6+ dá xeque no rei e ataca a torre. O rei sai e 2.Cxd7 captura a torre.
```

```exercicio
fen: 4k3/pp3ppp/8/8/4q3/5N2/PP3KPP/R7 w - - 0 1
enunciado: Brancas jogam e **ganham a dama** com uma cravada.
solucao: a1e1 e4e1 f2e1|f3e1
dica: A dama de e4 e o rei de e8 estão na mesma coluna.
explicacao: 1.Te1 crava a dama no rei. Ela não pode sair da coluna e, se capturar a torre, 2.Rxe1 (ou 2.Cxe1) recupera: dama por torre.
```

```exercicio
fen: q7/5p2/2k3p1/8/8/3B4/5PPP/6K1 w - - 0 1
enunciado: Brancas jogam e **ganham a dama** com um espeto.
solucao: d3e4 c6d6 e4a8
dica: O rei de c6 e a dama de a8 estão na mesma diagonal.
explicacao: 1.Be4+ dá xeque no rei pela diagonal. O rei sai e 2.Bxa8 captura a dama que estava atrás dele.
```

```exercicio
fen: 6k1/pp3ppp/8/n7/8/8/5PPP/3Q2K1 w - - 0 1
enunciado: Brancas jogam e dão **mate em 1**.
tipo: mate
lances: 1
solucao: d1d8
dica: O rei preto está preso pelos próprios peões.
explicacao: 1.Dd8# é o mate do corredor: a dama controla a oitava fileira e nenhuma peça preta pode bloquear ou capturar.
```

## Perguntas frequentes {#faq "Perguntas frequentes"}

### Qual a diferença entre tática e estratégia no xadrez?

A estratégia define os planos de longo prazo; a tática é a sequência curta e concreta de lances que ganha material ou dá mate. A estratégia cria a posição, a tática colhe o resultado.

### Qual tática aprender primeiro?

O garfo, por ser o padrão mais frequente. Depois a cravada e o espeto, que são parecidos, e em seguida o ataque descoberto, o desvio e o mate do corredor.

### Quantos exercícios de tática fazer por dia?

Não existe um número mágico. O que funciona é a regularidade: alguns exercícios por dia, resolvidos com calma e calculando a linha inteira, valem mais do que muitos resolvidos no chute.

### Tática é só para jogadores avançados?

Não. Táticas simples, como o garfo de cavalo e o mate do corredor, decidem partidas desde o primeiro mês de jogo. Quanto antes você aprender os padrões, mais cedo começa a ganhar material.
