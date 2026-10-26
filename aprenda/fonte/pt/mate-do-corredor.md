---
id: mate-do-corredor
titulo: Mate do Corredor: o Xeque-mate na Última Fileira
titulo_seo: Mate do Corredor: Como Dar e Como Evitar | Xadrez Online
descricao: O que é o mate do corredor, por que o rei preso atrás dos peões é tão vulnerável, como dar esse mate, como evitá-lo e 4 exercícios interativos.
nivel: intermediario
ordem: 40
publicado: 2026-10-26
atualizado: 2026-10-26
tags: [mate do corredor, mate na última fileira, xeque-mate, luft, tática de xadrez]
jogar: 2
relacionados: [taticas, desvio-e-sobrecarga, xeque-mate-e-afogamento, erros-de-iniciante, mates-basicos]
ensina: [Mate do corredor, Fraqueza da última fileira, Luft]
---
O **mate do corredor** é o [xeque-mate](artigo:xeque-mate-e-afogamento) dado por uma torre ou uma dama na última fileira do adversário, quando o rei está preso atrás dos próprios peões e não tem para onde fugir. É um dos mates mais comuns em partidas reais, em todos os níveis, porque nasce de uma posição perfeitamente normal: o rei roqueado com os três peões intactos na frente.

## Como funciona o mate do corredor {#como-funciona "Como funciona"}

Imagine o rei preto roqueado em g8, com os peões em f7, g7 e h7. Esses peões protegem o rei de ataques pela frente, mas também **fecham a saída**: o rei não consegue subir para a sétima fileira. Se uma torre ou dama branca chegar à oitava fileira com xeque, e nenhuma peça preta puder capturá-la ou se colocar no caminho, é mate.

```tabuleiro
fen: 4R1k1/5ppp/8/8/8/8/5PPP/6K1 b - - 0 1
setas: e8g8:vermelha
casas: g8:vermelha f7 g7 h7
legenda: Te8#. O rei de g8 está preso pelos próprios peões, e a torre controla a oitava fileira inteira.
```

O nome vem da imagem: o rei fica preso num "corredor" estreito, a última fileira, e a torre fecha o corredor de uma ponta à outra. Em inglês ele se chama *back-rank mate*.

## Os três ingredientes {#ingredientes "Os três ingredientes"}

Para o mate do corredor funcionar, três coisas precisam acontecer ao mesmo tempo:

1. **O rei sem casa de fuga** na fileira da frente, normalmente por causa dos próprios peões.
2. **Uma peça pesada** (torre ou dama) que consiga chegar à última fileira com xeque.
3. **Nenhum defensor** que possa capturar essa peça ou bloquear o xeque.

O terceiro ponto é onde mora a tática. Muitas vezes a última fileira está defendida, mas por uma peça só. Aí entram a troca e o sacrifício: você elimina ou desvia o defensor e a fileira fica aberta.

```tabuleiro
fen: 3r2k1/5ppp/8/8/8/8/5PPP/4R1K1 w - - 0 1
setas: e1e8 d8e8:azul
casas: d8 e8
legenda: Aqui a torre de d8 guarda a última fileira: se 1.Te8+, as Pretas respondem 1...Txe8. Para dar mate, as Brancas precisariam de um segundo atacante.
```

## Conte atacantes e defensores {#contar "Conte atacantes e defensores"}

A regra prática é contar. Quantas peças suas podem chegar à última fileira? Quantas peças do adversário a defendem? Se você tem **mais atacantes que defensores**, costuma haver mate: as trocas vão eliminando os defensores um a um, e o último atacante entra com xeque-mate.

Às vezes vale a pena entregar a dama para abrir o caminho. Se o único defensor da última fileira é uma torre, um sacrifício de dama que a obrigue a capturar pode deixar a fileira livre para a sua torre. Esse tipo de golpe é um caso de [desvio e sobrecarga](artigo:desvio-e-sobrecarga).

## Por que esse mate é tão comum {#por-que "Por que é tão comum"}

O mate do corredor [pega jogadores de todos os níveis](artigo:erros-de-iniciante) por três motivos:

- **A posição que o causa é a mais normal do xadrez.** Roque pequeno, peões de f, g e h no lugar: é exatamente o que os livros de abertura recomendam. Ninguém sente que está correndo perigo.
- **A ameaça vem de longe.** Uma torre do outro lado do tabuleiro, numa coluna aberta, não parece perigosa até o momento em que chega à última fileira.
- **A defesa costuma estar a cargo de uma peça só.** Quando a única torre que guarda a fileira também precisa defender um peão ou uma coluna, ela fica [sobrecarregada](artigo:desvio-e-sobrecarga#sobrecarga), e basta uma troca para a fileira ficar vazia.

Por isso, mesmo quando a sua posição parece tranquila, vale a pergunta: "se uma torre dele chegar à minha última fileira agora, eu consigo capturá-la ou bloquear o xeque?". Se a resposta for não, é hora de pensar na janela para o rei.

## Como evitar o mate do corredor {#evitar "Como evitar"}

A defesa clássica é abrir uma **janela** para o rei, que muitos jogadores chamam pelo nome alemão: **luft** ("ar"). Basta avançar um dos peões da frente do rei, em geral o peão da torre (h3 para as Brancas, h6 para as Pretas).

```tabuleiro
fen: 6k1/5pp1/7p/8/8/8/5PPP/4R1K1 w - - 0 1
setas: e1e8
casas: h7:verde
legenda: Com o peão em h6, o rei ganhou a casa h7. Se 1.Te8+, 1...Rh7 e não há mate.
```

Outras formas de se proteger:

- **Mantenha uma torre na última fileira** enquanto as peças pesadas do adversário estiverem no tabuleiro.
- **Não deixe uma única peça com a tarefa de guardar a fileira** e mais alguma outra coisa: ela vira alvo de sobrecarga.
- **Abra a janela na hora certa**: com calma, num momento em que o lance de peão não enfraqueça demais o roque.

:::aviso
**⚠️ Cuidado:** o mate do corredor costuma aparecer quando a partida parece tranquila, depois de trocas, com as damas e torres ainda no tabuleiro. É justamente quando ninguém espera.
:::

:::pratique Treine o mate do corredor agora
Jogue contra o computador e repare se o rei dele tem casa de fuga. Quando não tiver, procure levar uma torre à última fileira com mais atacantes do que defensores.
:::

## Exercícios do mate do corredor {#exercicios "Exercícios"}

```exercicio
fen: 2r3k1/pp3ppp/8/8/8/1q4P1/5P1P/2R1R1K1 w - - 0 1
enunciado: Brancas jogam e dão **mate em 1**.
tipo: mate
lances: 1
solucao: c1c8
dica: A torre de c8 é a única peça que guarda a oitava fileira. E se ela sumir com xeque?
explicacao: 1.Txc8# — a torre captura o único defensor da última fileira, e o rei continua preso pelos próprios peões. 1.Te8+? não funciona: 1...Txe8.
```

```exercicio
fen: 2rr2k1/pp3ppp/8/8/8/6P1/P2R1P1P/3R2K1 w - - 0 1
enunciado: Brancas jogam e dão **mate em 2**. Conte atacantes e defensores da casa d8.
tipo: mate
lances: 2
solucao: d2d8 c8d8 d1d8
dica: As duas torres brancas atacam d8. Quantas peças pretas defendem essa casa?
explicacao: Duas torres brancas atacam d8 e só a torre de c8 a defende. 1.Txd8+ Txd8 2.Txd8#.
```

```exercicio
fen: 2r3k1/pp3ppp/8/7q/3Q4/6P1/P4P1P/3R2K1 w - - 0 1
enunciado: Brancas jogam e dão **mate em 2**. Vale a pena entregar a dama.
tipo: mate
lances: 2
solucao: d4d8 c8d8 d1d8
dica: A torre de c8 é a única peça que defende a oitava fileira. Obrigue-a a sair de c8.
explicacao: 1.Dd8+!! obriga 1...Txd8 (o rei não tem casa e nada bloqueia). Com a torre fora de c8, 2.Txd8# fecha o corredor.
```

```exercicio
fen: 2r3k1/pp3ppp/8/2q5/8/4Q3/P4PPP/2R3K1 b - - 0 1
enunciado: Agora você joga de Pretas e dá **mate em 2**. O rei branco também não tem janela.
tipo: mate
lances: 2
solucao: c5c1 e3c1 c8c1
dica: A torre de c1 é a única defensora da primeira fileira, e a dama de e3 a protege.
explicacao: 1...Dxc1+! 2.Dxc1 Txc1#. Se 2.De1, 2...Dxe1# também é mate. A coluna c dobrada (dama e torre) vence o único defensor.
```

## Perguntas frequentes {#faq "Perguntas frequentes"}

### O que é mate do corredor?

É o xeque-mate dado por uma torre ou dama na última fileira, com o rei preso atrás dos próprios peões e sem nenhuma peça que capture o atacante ou bloqueie o xeque.

### Como evitar o mate do corredor?

Abrindo uma janela para o rei (por exemplo, h3 ou h6), mantendo uma torre na última fileira enquanto houver torres e damas do adversário e não deixando uma peça só com a tarefa de defender a fileira.

### Abrir a janela cedo demais é ruim?

Pode ser. Um lance de peão na frente do roque cria casas fracas. Por isso muitos jogadores esperam o momento em que a ameaça na última fileira começa a ficar real, em geral no meio-jogo depois das primeiras trocas.

### O mate do corredor acontece com a dama?

Sim. A dama funciona como uma torre na última fileira e, além disso, pode chegar lá pelas diagonais. Para revisar outros padrões, volte ao mapa das [táticas de xadrez](artigo:taticas).
