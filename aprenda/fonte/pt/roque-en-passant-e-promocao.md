---
id: lances-especiais
titulo: "Roque, En Passant e Promoção: os Lances Especiais"
titulo_seo: Roque, En Passant e Promoção | Xadrez Online
descricao: Como funcionam os três lances especiais do xadrez — roque, captura en passant e promoção do peão — com as condições da FIDE, diagramas e exercícios.
nivel: iniciante
ordem: 36
publicado: 2026-10-26
atualizado: 2026-10-26
tags: [roque, en passant, promoção do peão, roque pequeno, roque grande, lances especiais do xadrez]
jogar: 1
relacionados: [como-as-pecas-se-movem, regras, tabuleiro-e-notacao, principios-de-abertura]
ensina: [Roque, Captura en passant, Promoção do peão]
---
O xadrez tem três lances especiais, que fogem do movimento normal das peças: o **roque**, em que rei e torre se movem juntos num só lance; a captura **en passant**, em que um peão captura outro que acabou de avançar duas casas ao seu lado; e a **promoção**, em que o peão que chega à última fileira vira dama, torre, bispo ou cavalo. Os três são perfeitamente legais e aparecem com frequência, então todo iniciante precisa conhecê-los.

## Roque {#roque "Roque"}

O **roque** é o único lance em que um jogador move duas peças de uma vez: o rei e uma torre. Ele serve para duas coisas: **proteger o rei**, tirando-o do centro, e **ativar a torre**, levando-a para perto do meio do tabuleiro.

Existem dois roques:

- **Roque pequeno** (ou curto, do lado do rei), anotado **O-O**: o rei anda duas casas em direção à torre de h1 (de e1 para g1) e a torre passa por cima dele, para f1.
- **Roque grande** (ou longo, do lado da dama), anotado **O-O-O**: o rei anda duas casas em direção à torre de a1 (de e1 para c1) e a torre vai para d1.

Para as Pretas é igual, na 8ª fileira: e8–g8 com a torre em f8, ou e8–c8 com a torre em d8.

```tabuleiro
fen: r3k2r/pppppppp/8/8/8/8/PPPPPPPP/R3K2R w KQkq - 0 1
setas: e1g1 h1f1 e1c1:azul a1d1:azul
legenda: Roque pequeno (verde): rei de e1 para g1 e torre de h1 para f1. Roque grande (azul): rei de e1 para c1 e torre de a1 para d1.
```

### Quando o roque é permitido

Pelas [regras oficiais da FIDE](artigo:regras#especiais), você só pode rocar se **todas** as condições abaixo forem verdadeiras:

1. O rei **nunca se moveu** na partida.
2. A torre do roque **nunca se moveu**.
3. Não há **nenhuma peça** entre o rei e essa torre.
4. O rei **não está em xeque** naquele momento.
5. O rei **não passa** por uma casa atacada pelo adversário.
6. O rei **não termina** numa casa atacada (isso seria se colocar em xeque).

Repare que as três últimas condições falam do **rei**. A torre pode estar atacada, e no roque grande ela pode passar por uma casa atacada (b1 ou b8).

Se o rei já se moveu, o direito de rocar se perde para sempre, dos dois lados. Se só uma torre se moveu, você perde o roque daquele lado. Já um xeque ou uma peça no caminho só impedem o roque **naquele momento**.

:::aviso
**⚠️ Cuidado:** em partidas presenciais, comece o roque **pelo rei**. Se você tocar primeiro a torre, as regras não deixam rocar naquele lance. No tabuleiro deste site, basta mover o rei duas casas, e a torre vem sozinha.
:::

### Erros comuns com o roque

- **Rocar tarde demais.** Esperar muito deixa o rei no centro justamente quando as colunas se abrem. Por isso [rocar cedo](artigo:principios-de-abertura#roque) é um dos princípios de abertura.
- **Rocar para dentro do ataque.** Se o adversário já tem peças e peões apontados para um lado do tabuleiro, levar o rei para lá pode ser pior do que esperar. Olhe antes para onde o rei vai.
- **Mexer o rei "só um pouquinho".** Um único passo do rei, mesmo que ele volte para e1, faz você perder o direito de rocar pelo resto da partida.

## Captura en passant {#en-passant "Captura en passant"}

*En passant* é francês e quer dizer "de passagem". É uma captura que só o peão pode fazer, e só em uma situação:

1. Seu peão está na sua **5ª fileira** (para as Brancas, a fileira 5; para as Pretas, a fileira 4).
2. Um peão adversário, numa **coluna vizinha**, avança **duas casas** a partir da casa inicial e para **ao lado** do seu.
3. **No lance imediatamente seguinte**, seu peão pode capturá-lo como se ele tivesse andado só uma casa: você vai para a casa por onde ele "passou", e o peão adversário sai do tabuleiro.

```tabuleiro
fen: k7/8/8/3Pp3/8/8/8/7K w - e6 0 1
setas: d5e6
casas: e5:vermelha e6:verde
legenda: As Pretas acabaram de jogar e7–e5, passando ao lado do peão branco de d5. As Brancas podem capturar en passant: o peão vai para e6 e o peão de e5 sai do tabuleiro.
```

A regra existe por causa do avanço de duas casas: sem ela, um peão poderia "passar escondido" pela casa que o peão vizinho ataca. A captura en passant **não é obrigatória**, mas, se você não a fizer no lance seguinte, perde o direito.

Na notação, escreve-se como uma captura normal de peão, com a casa de chegada: `dxe6`, às vezes com `e.p.` no fim.

## Promoção {#promocao "Promoção"}

Quando um peão chega à última fileira (a 8ª para as Brancas, a 1ª para as Pretas), ele é **promovido**: no mesmo lance, é trocado por uma **dama, torre, bispo ou cavalo da mesma cor**, à escolha do jogador. Ele não pode virar rei nem continuar peão.

```tabuleiro
fen: k7/4P3/8/8/8/8/8/7K w - - 0 1
setas: e7e8
casas: e8:verde
legenda: O peão de e7 avança para e8 e é promovido. Na notação: e8=D se virar dama.
```

Dois detalhes que surpreendem iniciantes:

- **A escolha não depende das peças capturadas.** Você pode ter duas damas (ou mais) ao mesmo tempo, mesmo que a primeira ainda esteja no tabuleiro.
- **A nova peça já age naquele lance.** Se a dama promovida der xeque, é xeque na hora.

Quase sempre se escolhe a dama, a peça mais forte. Promover a outra peça é a **subpromoção**: um cavalo, por exemplo, pode dar um xeque que a dama não daria, e uma torre ou um bispo podem evitar um afogamento.

:::dica
**💡 Dica:** um peão sem nenhum peão adversário à sua frente, nem na mesma coluna nem nas colunas vizinhas, é um **peão passado**. Ele é perigoso justamente porque pode correr para a promoção. No final da partida, empurrar um peão passado costuma decidir o jogo.
:::

## Exercícios {#exercicios "Exercícios"}

```exercicio
fen: r1bqk1nr/pppp1ppp/2n5/2b1p3/2B1P3/5N2/PPPP1PPP/RNBQK2R w KQkq - 4 4
enunciado: Depois de 1.e4 e5 2.Cf3 Cc6 3.Bc4 Bc5, as Brancas podem rocar. Faça o **roque pequeno** (4.O-O).
tipo: tatica
solucao: e1g1
dica: Mova o rei duas casas em direção à torre de h1.
explicacao: 4.O-O — o rei vai de e1 para g1 e a torre, de h1 para f1. O rei fica protegido pelos peões f2, g2 e h2, e a torre fica pronta para entrar no jogo.
```

```exercicio
fen: 8/4N3/7p/R2pP2k/8/6K1/8/8 w - d6 0 1
enunciado: As Pretas acabaram de jogar ...d7–d5. As Brancas dão **mate em 1** com um lance especial.
tipo: mate
lances: 1
solucao: e5d6
dica: A torre de a5 está presa atrás de dois peões na 5ª fileira. Um único lance tira os dois do caminho.
explicacao: 1.exd6 e.p.# — o peão de e5 captura en passant: vai para d6 e o peão de d5 sai do tabuleiro. A 5ª fileira se abre e a torre de a5 dá xeque no rei de h5. As casas g4 e h4 estão com o rei branco, g6 com o cavalo e g5 com a torre; h6 está ocupada pelo próprio peão preto.
```

```exercicio
fen: 3k4/5P2/2K5/8/8/8/8/8 w - - 0 1
enunciado: Promova o peão e dê **mate em 1**. Atenção à escolha da peça.
tipo: mate
lances: 1
solucao: f7f8q
dica: O rei branco cobre c7 e d7. A peça nova precisa dar xeque e também cobrir e7.
explicacao: 1.f8=D# — a dama dá xeque pela 8ª fileira e cobre e7 pela diagonal; c7 e d7 estão com o rei branco. Uma torre (1.f8=T+) também daria xeque, mas o rei escaparia por e7.
```

## Perguntas frequentes {#faq "Perguntas frequentes"}

### Posso rocar depois de levar xeque?

Sim, desde que o rei não tenha se movido. Levar xeque não tira o direito de rocar; só não dá para rocar **enquanto** se está em xeque.

### Posso rocar se a torre estiver atacada?

Sim. As restrições de casa atacada valem só para o rei: a casa de onde ele sai, a que ele atravessa e a de chegada.

### O en passant é obrigatório?

Não. Mas ele só pode ser feito no lance imediatamente seguinte ao avanço de duas casas do peão adversário.

### Posso ter duas damas?

Sim. Você pode promover um peão a dama mesmo que a dama original ainda esteja no tabuleiro.

### O peão pode ser promovido a rei?

Não. As opções são dama, torre, bispo ou cavalo.

:::pratique Pratique os lances especiais
Jogue contra o computador no nível Fácil, faça o roque cedo e fique de olho em chances de captura en passant e de promoção.
:::
