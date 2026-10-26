---
id: tabuleiro-e-notacao
titulo: Tabuleiro de Xadrez e Notação: Como Ler os Lances
titulo_seo: Tabuleiro de Xadrez e Notação Algébrica | Xadrez Online
descricao: Como montar o tabuleiro de xadrez, o que são colunas, fileiras e casas, e como ler e escrever lances na notação algébrica, com exemplos e exercícios.
nivel: iniciante
ordem: 12
publicado: 2026-10-26
atualizado: 2026-10-26
tags: [tabuleiro de xadrez, notação de xadrez, notação algébrica, coordenadas do tabuleiro, como anotar partida de xadrez]
jogar: 1
relacionados: [jogar-do-zero, como-as-pecas-se-movem, regras, lances-especiais]
ensina: [Tabuleiro de xadrez, Coordenadas das casas, Notação algébrica]
---
O tabuleiro de xadrez é um quadrado de 64 casas (8 × 8), alternadamente claras e escuras, e a **notação algébrica** é o sistema que dá um nome a cada casa — uma letra de **a** a **h** para a coluna e um número de **1** a **8** para a fileira — para que qualquer lance possa ser escrito, como `e4` ou `Cf3`. Com essas duas ideias você consegue montar o jogo do jeito certo, ler livros e artigos e acompanhar qualquer partida. Se você nunca jogou, comece por [como jogar xadrez do zero](artigo:jogar-do-zero).

## Como posicionar o tabuleiro {#posicao "Como posicionar o tabuleiro"}

O primeiro cuidado é girar o tabuleiro do jeito certo. A regra é curta: **a casa do canto direito, perto de cada jogador, é clara**. Se ela ficou escura, gire o tabuleiro 90 graus.

Depois, as peças:

- **Fileira de trás** (da esquerda para a direita, do ponto de vista das Brancas): torre, cavalo, bispo, dama, rei, bispo, cavalo, torre.
- **Fileira da frente:** os oito peões.
- **A dama começa na casa da própria cor:** dama branca em casa clara, dama preta em casa escura. O rei fica ao lado dela.

As Brancas sempre fazem o primeiro lance.

```tabuleiro
fen: rnbqkbnr/pppppppp/8/8/8/8/PPPPPPPP/RNBQKBNR w KQkq - 0 1
casas: h1:verde a8:verde d1 d8
legenda: Posição inicial. Os cantos h1 e a8, à direita de cada jogador, são casas claras; as damas (d1 e d8) estão na casa da sua cor.
```

:::dica
**💡 Dica:** se a dama branca estiver numa casa escura, o tabuleiro está girado ou o rei e a dama foram trocados de lugar. Confira antes de começar.
:::

## Colunas, fileiras e diagonais {#coordenadas "Colunas, fileiras e diagonais"}

Para falar de uma casa, usamos três palavras:

- **Coluna:** cada linha vertical. São oito, chamadas de **a** a **h**, da esquerda para a direita do ponto de vista das Brancas.
- **Fileira:** cada linha horizontal. São oito, numeradas de **1** a **8**, começando do lado das Brancas.
- **Diagonal:** uma sequência de casas da mesma cor que se tocam pelos cantos, como a1–h8.

O nome de uma casa é a letra da coluna seguida do número da fileira. A casa onde a coluna **e** cruza a fileira **4** é a **e4**. Cada casa tem um nome só, e ele não muda quando você joga com as Pretas: a casa e4 continua sendo e4, mesmo que, do seu lado, ela pareça estar "de cabeça para baixo".

```tabuleiro
fen: k7/8/8/8/8/8/8/7K w - - 0 1
casas: e1 e2 e3 e5 e6 e7 e8 a4:azul b4:azul c4:azul d4:azul f4:azul g4:azul h4:azul e4:verde
legenda: A coluna e (amarela) cruza a fileira 4 (azul) na casa e4 (verde).
```

Algumas regiões do tabuleiro também têm nome:

- **Centro:** as quatro casas d4, e4, d5 e e5. Quem controla o centro costuma ter mais espaço.
- **Flanco do rei:** as colunas e a h, onde o rei começa.
- **Flanco da dama:** as colunas a a d, onde a dama começa.

## A notação algébrica {#notacao "A notação algébrica"}

A notação algébrica é o padrão oficial da FIDE (a Federação Internacional de Xadrez) e é a que você encontra em livros, sites e torneios. Cada lance é escrito com **a letra da peça + a casa de chegada**.

As letras das peças em português são:

| Peça | Letra | Exemplo |
|---|---|---|
| Rei | R | Re2 |
| Dama | D | Dh5 |
| Torre | T | Td1 |
| Bispo | B | Bc4 |
| Cavalo | C | Cf3 |
| Peão | (nenhuma) | e4 |

O peão não tem letra: `e4` quer dizer "um peão vai para e4". Em inglês as letras mudam (K, Q, R, B, N), mas as casas são as mesmas, então uma partida anotada em qualquer idioma continua legível.

### Os símbolos

- **x** — captura: `Bxf7` (o bispo captura em f7). Na captura de peão, escreve-se a coluna de onde ele saiu: `exd5`.
- **+** — xeque: `Dh5+`.
- **#** — xeque-mate: `Dxf7#`.
- **O-O** — roque pequeno (ou curto, do lado do rei); **O-O-O** — roque grande (ou longo, do lado da dama).
- **=D** — promoção: `e8=D` (o peão chega em e8 e vira dama).
- **e.p.** — captura *en passant* (opcional).

### Numeração dos lances

Os lances são numerados aos pares: cada número cobre um lance das Brancas e a resposta das Pretas. Por isso escrevemos `1.e4 e5 2.Cf3 Cc6`: no lance 1, as Brancas jogaram e4 e as Pretas, e5. Quando o texto mostra só o lance das Pretas, usa reticências: `2...Cc6`. Quando se fala em "mate em 1" ou "mate em 2", contam-se só os lances de quem dá o mate.

```tabuleiro
fen: r1bqkbnr/pppp1ppp/2n5/4p3/4P3/5N2/PPPP1PPP/RNBQKB1R w KQkq - 2 3
setas: g1f3 b8c6:azul
legenda: Depois de 1.e4 e5 2.Cf3 Cc6: o cavalo branco foi de g1 para f3 e o preto, de b8 para c6.
```

### Quando duas peças podem ir à mesma casa

Às vezes dois cavalos (ou duas torres) podem chegar à mesma casa. Aí acrescentamos a **coluna** de onde a peça sai; se a coluna for a mesma, a **fileira**:

- `Cbd2` — o cavalo da coluna **b** vai para d2 (e não o de f3).
- `T1e2` — a torre da fileira **1** vai para e2.

```tabuleiro
fen: rnbqkb1r/ppp2ppp/4pn2/3p4/3P4/4PN2/PPP2PPP/RNBQKB1R w KQkq - 0 4
setas: b1d2 f3d2:vermelha
casas: d2
legenda: Os dois cavalos brancos podem ir para d2. Cbd2 é o de b1; Cfd2 seria o de f3.
```

### Sinais de comentário

Livros e análises usam sinais depois do lance: **!** (bom lance), **!!** (lance brilhante), **?** (erro), **??** (erro grave), **!?** (interessante) e **?!** (duvidoso). Eles são opinião de quem comenta, não fazem parte da regra.

## Por que vale a pena aprender a notação {#por-que "Por que vale a pena aprender"}

- **Você consegue estudar.** Todo livro, artigo e vídeo de xadrez usa notação. Inclusive os outros artigos deste site, como [as regras do xadrez](artigo:regras).
- **Você consegue rever suas partidas.** Anotar o que aconteceu é o primeiro passo para descobrir onde errou.
- **Em torneios presenciais, anotar é obrigatório** nas partidas de ritmo lento. A súmula (a folha de anotação) é o registro oficial do jogo.

:::aviso
**⚠️ Cuidado:** um erro comum é trocar coluna e fileira, escrevendo "4e" em vez de "e4". A letra vem sempre primeiro.
:::

## Exercícios {#exercicios "Exercícios"}

Leia o lance pedido e faça-o no tabuleiro. Toque (ou clique) na peça e depois na casa de destino.

```exercicio
fen: rnbqkbnr/pppp1ppp/8/4p3/4P3/8/PPPP1PPP/RNBQKBNR w KQkq e6 0 2
enunciado: A partida começou com 1.e4 e5. Jogue o lance **2.Cf3**.
tipo: tatica
solucao: g1f3
dica: "C" é o cavalo. Qual cavalo branco alcança a casa f3?
explicacao: 2.Cf3 — o cavalo sai de g1 e chega a f3, atacando o peão de e5. É um dos lances mais jogados nesta posição.
```

```exercicio
fen: rnbqkbnr/ppp1pppp/8/3p4/4P3/8/PPPP1PPP/RNBQKBNR w KQkq d6 0 2
enunciado: Depois de 1.e4 d5, jogue **2.exd5**.
tipo: tatica
solucao: e4d5
dica: O "e" diz de qual coluna o peão sai; o "x" diz que é captura; "d5" é a casa da captura.
explicacao: 2.exd5 — o peão da coluna e captura o peão preto em d5, andando uma casa na diagonal, como todo peão faz ao capturar.
```

```exercicio
fen: k7/8/8/4R3/8/8/8/4R1K1 w - - 0 1
enunciado: As duas torres brancas podem ir para e3. Jogue **T1e3**.
tipo: tatica
solucao: e1e3
dica: As torres estão na mesma coluna, então a letra não basta: o número "1" indica a fileira de onde a torre sai.
explicacao: 1.T1e3 — é a torre da 1ª fileira (a de e1). A de e5 também chegaria a e3 (seria 1.T5e3); como as duas estão na coluna e, a notação usa o número da fileira.
```

## Perguntas frequentes {#faq "Perguntas frequentes"}

### Qual é o lado certo do tabuleiro de xadrez?

O tabuleiro está certo quando a casa do canto direito de cada jogador é clara. Para as Brancas, essa casa é h1.

### Qual a diferença entre coluna e fileira?

Coluna é a linha vertical (letras a a h). Fileira é a linha horizontal (números 1 a 8). O nome da casa junta as duas: primeiro a letra, depois o número.

### O que significa "x", "+" e "#" na notação?

"x" indica captura, "+" indica xeque e "#" indica xeque-mate.

### Por que o cavalo é "C" e o rei é "R"?

São as iniciais em português. Como "R" já é o rei, a torre ficou com "T". Em inglês, o cavalo é "N" (*knight*), porque o "K" é do rei (*king*).

### Preciso anotar minhas partidas online?

Não. O site registra os lances sozinho. Mas saber ler a notação ajuda a rever as partidas e a estudar.

:::pratique Pratique lendo o tabuleiro
Jogue uma partida contra o computador no nível Fácil e tente dizer em voz alta o nome de cada lance, como "e4" ou "Cf3", antes de jogá-lo.
:::

Para continuar, veja [como as peças se movem](artigo:como-as-pecas-se-movem) e, depois, os [lances especiais](artigo:lances-especiais), que têm notação própria.
