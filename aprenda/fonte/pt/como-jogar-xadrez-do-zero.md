---
id: jogar-do-zero
titulo: Como Jogar Xadrez do Zero: Guia Completo para Iniciantes
titulo_seo: Como Jogar Xadrez do Zero: Guia Completo para Iniciantes
descricao: Aprenda a jogar xadrez do zero em 5 passos: o tabuleiro, o movimento de cada peça, lances especiais, xeque-mate e como praticar. Guia gratuito em português.
nivel: iniciante
ordem: 10
publicado: 2026-05-11
atualizado: 2026-10-26
tags: [como jogar xadrez, xadrez para iniciantes, aprender xadrez, xadrez do zero, tutorial xadrez]
ensina: [Montagem do tabuleiro, Movimento das peças, Lances especiais, Xeque-mate, Empate]
jogar: 1
relacionados: [tabuleiro-e-notacao, como-as-pecas-se-movem, lances-especiais, principios-de-abertura]
---
Para jogar xadrez, você precisa saber cinco coisas: como montar o tabuleiro de 64 casas, como cada uma das seis peças se move, os três lances especiais (roque, en passant e promoção), o que é xeque-mate — o objetivo do jogo — e como uma partida pode empatar. As Brancas sempre começam, e cada jogador faz um lance por vez. Este guia explica os cinco passos com diagramas, para você jogar a primeira partida hoje, direto no navegador.

## 1. O tabuleiro: 64 casas, claras e escuras {#tabuleiro}

O xadrez é jogado em um tabuleiro quadrado de **8 por 8 casas**, totalizando 64 casas que alternam entre claras e escuras. Cada jogador começa com 16 peças: 8 peões na fileira da frente (a 2ª das Brancas, a 7ª das Pretas) e, atrás deles, uma torre em cada canto, depois cavalo, bispo, dama e rei (na ordem).

Uma regra simples para montar o tabuleiro: a **casa do canto direito de cada jogador deve ser clara**. E a dama sempre começa na **casa da sua própria cor** — a dama branca numa casa clara, a dama preta numa casa escura.

As **fileiras** são as linhas horizontais (numeradas de 1 a 8) e as **colunas**, as verticais (letras de **a** a **h**). Esse sistema permite [descrever qualquer lance com precisão](artigo:tabuleiro-e-notacao): "peão para e4" significa mover o peão para a coluna e, fileira 4.

O jogador das peças brancas **sempre joga primeiro**. Depois, os jogadores alternam um lance de cada vez.

```tabuleiro
fen: rnbqkbnr/pppppppp/8/8/8/8/PPPPPPPP/RNBQKBNR w KQkq - 0 1
casas: h1 a8 d1:verde d8:verde
legenda: A posição inicial. As casas dos cantos à direita de cada jogador (h1 e a8) são claras, e cada dama começa na casa da sua cor (d1 e d8).
```

## 2. Como cada peça se move {#pecas}

Aqui está o coração do xadrez. Não pule esta parte — [entender como cada peça se move](artigo:como-as-pecas-se-movem) é metade do caminho para jogar bem.

:::peca ♟ Peão
Anda **uma casa para frente**. Na primeira vez que cada peão se move, ele pode avançar duas casas (à sua escolha). Captura na **diagonal, uma casa para frente**. O peão é a única peça que se move diferente de como captura.

<small>Curiosidade: se o peão chegar até a última fileira do tabuleiro, ele é promovido a dama, torre, bispo ou cavalo (quase sempre uma dama).</small>
:::

:::peca ♜ Torre
Move em **linha reta**, horizontal ou vertical, quantas casas quiser. Não pode pular outras peças. Captura da mesma forma que se move.

<small>Dica: torres ficam muito poderosas em colunas abertas (sem peões pelo caminho).</small>
:::

:::peca ♝ Bispo
Move em **diagonal**, quantas casas quiser. Cada bispo fica preso à cor da casa em que começou: o que sai de uma casa clara só anda por casas claras, e o que sai de uma escura, só por escuras.

<small>Por isso o par de bispos (controlando as duas cores) é considerado uma pequena vantagem.</small>
:::

:::peca ♛ Dama
A peça mais poderosa do jogo. Combina os movimentos da torre e do bispo: anda em **linha reta ou em diagonal**, quantas casas quiser, em qualquer direção.

<small>Vale aproximadamente [9 pontos](artigo:valor-das-pecas). Perder a dama cedo costuma decidir a partida.</small>
:::

:::peca ♞ Cavalo
Move em **"L"**: duas casas em uma direção e mais uma na perpendicular (ou o contrário). É a única peça do jogo que **pula sobre outras peças**.

<small>O cavalo é mestre dos "garfos": ataques duplos onde duas peças adversárias são ameaçadas ao mesmo tempo.</small>
:::

:::peca ♚ Rei
Move **uma casa em qualquer direção**. Não pode mover-se para uma casa atacada por uma peça adversária. O rei é a peça mais importante — se ele levar xeque-mate, você perde (o rei nunca é capturado).

<small>Proteja o rei com o roque (veja a próxima seção). No final do jogo, o rei se torna uma peça ativa.</small>
:::

## 3. Lances especiais (roque, en passant, promoção) {#especiais}

### Roque

O [roque](artigo:lances-especiais) é um lance que move o rei e uma das torres ao mesmo tempo. Serve para colocar o rei em segurança e ativar a torre. Há dois tipos: **roque pequeno** (ou curto, do lado do rei) e **roque grande** (ou longo, do lado da dama).

Para fazer o roque, quatro condições precisam ser verdadeiras:

- Nem o rei nem a torre envolvida podem ter se movido antes.
- Não pode haver peças entre o rei e a torre.
- O rei não pode estar em xeque.
- O rei não pode passar por uma casa atacada nem terminar numa casa atacada.

```tabuleiro
fen: r3k2r/pppq1ppp/2npbn2/4p3/4P3/2NPBN2/PPPQ1PPP/R3K2R w KQkq - 0 1
setas: e1g1 h1f1
legenda: Roque pequeno das Brancas: o rei vai de e1 para g1 e a torre de h1 salta para f1.
```

### En passant (captura "de passagem")

Se um peão adversário sai da casa inicial avançando duas casas e para ao lado do seu peão, você pode capturá-lo **no lance seguinte**, como se ele tivesse avançado apenas uma casa. É uma regra que muita gente nunca aprendeu.

```tabuleiro
fen: rnbqkbnr/ppp1p1pp/8/3pPp2/8/8/PPPP1PPP/RNBQKBNR w KQkq f6 0 3
setas: e5f6
casas: f5:vermelha
legenda: En passant: as Pretas acabaram de jogar f7–f5. O peão de e5 captura indo para f6 e o peão de f5 sai do tabuleiro.
```

### Promoção

Quando seu peão chega à última fileira do tabuleiro, ele é promovido a outra peça da sua escolha (dama, torre, bispo ou cavalo). Na prática, quase sempre se escolhe a dama, por ser a peça mais forte. É possível ter mais de uma dama no tabuleiro graças à promoção.

## 4. Xeque, xeque-mate e empate {#xeque-mate}

### Xeque

Quando o rei está sob ataque direto de uma peça adversária, dizemos que ele está em **xeque**. Você é obrigado a sair do xeque imediatamente. Existem três formas de fazer isso:

1. Mover o rei para uma casa segura.
2. Bloquear o ataque com outra peça (não funciona contra cavalo, pois ele pula).
3. Capturar a peça que está dando xeque.

### Xeque-mate

Se o rei está em xeque e **nenhuma das três opções acima é possível**, é xeque-mate. Fim da partida. Quem deu o xeque-mate venceu.

O [xeque-mate](artigo:xeque-mate-e-afogamento) é o objetivo final do xadrez. Não importa quantas peças cada lado tem: ganhar uma dama de vantagem não vale nada se você não conseguir dar o xeque-mate.

```exercicio
fen: 6k1/5ppp/8/8/8/8/5PPP/R5K1 w - - 0 1
enunciado: Sua vez, de Brancas: dê **xeque-mate em 1 lance**.
tipo: mate
solucao: a1a8
dica: O rei preto está preso atrás dos próprios peões. Que peça sua pode chegar à última fileira?
explicacao: 1.Ta8# (a torre vai para a8; o "#" indica mate) — a torre dá xeque na 8ª fileira e o rei não tem fuga: f7, g7 e h7 estão ocupadas pelos próprios peões, e f8 e h8 continuam atacadas pela torre. É o [mate do corredor](artigo:mate-do-corredor).
```

### Empate (afogamento e outros)

Nem toda partida termina com vencedor. Existem [várias formas de empatar](artigo:empates):

- **Afogamento (stalemate)**: o jogador da vez não está em xeque, mas não tem nenhum lance legal possível.
- **Acordo entre os jogadores**: ambos concordam em empatar.
- **Regra dos 50 lances**: nenhum peão se moveu nem houve captura nos últimos 50 lances de cada jogador.
- **Repetição tripla**: a mesma posição se repete três vezes.
- **Material insuficiente**: nenhum dos lados tem peças suficientes para dar mate (por exemplo, rei contra rei).

## 5. Como praticar e evoluir {#pratica}

Aprender as regras é só o começo. O xadrez é um jogo que se aprimora com a prática. Algumas sugestões para os primeiros meses:

- **Jogue todo dia, mesmo que pouco**. Dez minutos diários valem mais que duas horas por semana.
- **Comece contra o computador**. Você pode pausar, pensar e refazer lances sem pressão. Quando estiver mais à vontade, passe para partidas contra outras pessoas.
- **[Reveja suas partidas perdidas](artigo:analisar-partidas)**. A maior parte do aprendizado vem dos erros.
- **Aprenda [algumas aberturas básicas](artigo:aberturas-para-iniciantes)**. Não precisa decorar variantes longas. Saber controlar o centro e desenvolver as peças já é suficiente para os primeiros 10 lances.
- **Resolva exercícios de tática**. [Garfo](artigo:garfo), [cravada](artigo:cravada) e [ataque descoberto](artigo:ataque-descoberto) são padrões que aparecem o tempo todo.

:::dica
**💡 Dica honesta:** não tente decorar todas as aberturas do zero. Foque em [*princípios*](artigo:principios-de-abertura) (controle do centro, desenvolvimento, segurança do rei) e em *tática*. Isso leva você muito mais longe nos primeiros seis meses.
:::

:::pratique Pronto para a primeira partida?
Abra o jogo, escolha **🎓 Aprendiz** no menu de dificuldade e faça as 12 lições interativas, que ensinam cada peça e cada conceito na prática. Sem cadastro, direto no navegador.
:::

## Perguntas frequentes {#faq "Perguntas frequentes"}

### Quem começa no xadrez?

As Brancas. Elas sempre fazem o primeiro lance, e depois os jogadores se alternam, um lance de cada vez. Num torneio, quem fica com as Brancas é definido por sorteio ou pelo emparceiramento.

### Como montar o tabuleiro de xadrez?

Cada jogador fica com uma casa clara no canto à sua direita. Na primeira fileira de cada lado vão as torres nos cantos, os cavalos ao lado delas, depois os bispos e, no meio, a dama e o rei; a dama fica na casa da sua cor (a branca em d1, casa clara; a preta em d8, casa escura). Os oito peões ocupam a fileira da frente. [Veja o passo a passo](artigo:tabuleiro-e-notacao#posicao).

### Dá para aprender xadrez sozinho?

Sim. As regras se aprendem lendo e praticando; depois, jogar contra o computador num nível fácil e revisar as próprias partidas é um bom caminho para evoluir sem professor. A trilha do [Aprenda](/aprenda) segue essa ordem, do iniciante ao avançado.

## Para onde ir agora {#proximos}

Este guia é a lição 1 da trilha. As próximas lições aprofundam cada parte, nesta ordem:

1. [O tabuleiro e a notação](artigo:tabuleiro-e-notacao): como ler lances como `e4` e `Cf3`.
2. [Como as peças se movem](artigo:como-as-pecas-se-movem), com exercícios para cada peça.
3. [Xeque, xeque-mate e afogamento](artigo:xeque-mate-e-afogamento) e [os lances especiais](artigo:lances-especiais).
4. [Os princípios de abertura](artigo:principios-de-abertura), para jogar bem os primeiros lances.

Terminado o nível Iniciante, a trilha segue para as [táticas](artigo:taticas) (garfo, cravada, ataque descoberto) e, depois, para a estratégia e os finais.
