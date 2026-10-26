---
id: jogar-do-zero
titulo: Como Jogar Xadrez do Zero: Guia Completo para Iniciantes
titulo_seo: Como Jogar Xadrez do Zero: Guia Completo para Iniciantes (2026)
descricao: Aprenda a jogar xadrez do zero em 5 passos: o tabuleiro, o movimento de cada peça, jogadas especiais, xeque-mate e como praticar. Guia gratuito em português.
nivel: iniciante
ordem: 10
publicado: 2026-05-11
atualizado: 2026-10-26
tags: [como jogar xadrez, xadrez para iniciantes, aprender xadrez, regras do xadrez, xadrez do zero, tutorial xadrez]
jogar: 1
relacionados: []
---
Se você nunca jogou xadrez, este guia é o ponto de partida ideal. Em 5 passos, você vai entender o tabuleiro, aprender como cada peça se move, conhecer as jogadas especiais, saber o que é xeque-mate e ter um caminho prático para começar a jogar hoje mesmo — direto do navegador, sem precisar baixar nada.

## 1. O tabuleiro: 64 casas, claras e escuras {#tabuleiro}

O xadrez é jogado em um tabuleiro quadrado de **8 por 8 casas**, totalizando 64 casas que alternam entre claras e escuras. Cada jogador começa com 16 peças: 8 peões na segunda fileira e, atrás deles, na primeira fileira, uma torre em cada canto, depois cavalo, bispo, dama e rei (na ordem).

Uma regra simples para montar o tabuleiro: a **casa do canto direito de cada jogador deve ser branca** (clara). E a dama sempre começa na **casa da sua própria cor** — dama branca em casa branca, dama preta em casa preta.

As linhas horizontais são chamadas de **fileiras** (numeradas de 1 a 8) e as linhas verticais de **colunas** (letras de A a H). Esse sistema permite descrever qualquer jogada com precisão: "peão para E4" significa mover o peão para a coluna E, fileira 4.

O jogador das peças brancas **sempre joga primeiro**. Depois, os jogadores alternam um lance de cada vez.

```tabuleiro
fen: rnbqkbnr/pppppppp/8/8/8/8/PPPPPPPP/RNBQKBNR w KQkq - 0 1
casas: h1 a8 d1:verde d8:verde
legenda: A posição inicial. As casas dos cantos à direita de cada jogador (h1 e a8) são claras, e cada dama começa na casa da sua cor (d1 e d8).
```

## 2. Como cada peça se move {#pecas}

Aqui está o coração do xadrez. Não pule esta parte — entender como cada peça se move é metade do caminho para jogar bem.

:::peca ♟ Peão
Anda **uma casa para frente**. No primeiro lance, pode avançar duas casas (à sua escolha). Captura na **diagonal, uma casa para frente**. O peão é a única peça que se move diferente de como captura.

<small>Curiosidade: se o peão chegar até a última fileira do tabuleiro, ele é promovido a qualquer outra peça (quase sempre uma dama).</small>
:::

:::peca ♜ Torre
Move em **linha reta**, horizontal ou vertical, quantas casas quiser. Não pode pular outras peças. Captura da mesma forma que se move.

<small>Dica: torres ficam muito poderosas em colunas abertas (sem peões pelo caminho).</small>
:::

:::peca ♝ Bispo
Move em **diagonal**, quantas casas quiser. Cada bispo fica preso à cor da casa em que começou: o que sai da casa branca só anda por casas brancas, e vice-versa.

<small>Por isso o par de bispos (controlando as duas cores) é considerado uma pequena vantagem.</small>
:::

:::peca ♛ Dama
A peça mais poderosa do jogo. Combina os movimentos da torre e do bispo: anda em **linha reta ou em diagonal**, quantas casas quiser, em qualquer direção.

<small>Vale aproximadamente 9 pontos. Perder a dama cedo costuma decidir a partida.</small>
:::

:::peca ♞ Cavalo
Move em **"L"**: duas casas em uma direção e mais uma na perpendicular (ou o contrário). É a única peça do jogo que **pula sobre outras peças**.

<small>O cavalo é mestre dos "garfos": ataques duplos onde duas peças adversárias são ameaçadas ao mesmo tempo.</small>
:::

:::peca ♚ Rei
Move **uma casa em qualquer direção**. Não pode mover-se para uma casa atacada por uma peça adversária. O rei é a peça mais importante — se ele cair, você perde.

<small>Proteja o rei com o roque (veja a próxima seção). No final do jogo, o rei se torna uma peça ativa.</small>
:::

## 3. Jogadas especiais (roque, en passant, promoção) {#especiais}

### Roque

O roque é uma jogada que move o rei e uma das torres ao mesmo tempo. Serve para colocar o rei em segurança e ativar a torre. Há dois tipos: **roque curto** (lado do rei) e **roque longo** (lado da dama).

Para fazer o roque, três condições precisam ser verdadeiras:

- Nem o rei nem a torre envolvida podem ter se movido antes.
- Não pode haver peças entre o rei e a torre.
- O rei não pode estar em xeque nem passar por uma casa atacada.

```tabuleiro
fen: r3k2r/pppq1ppp/2npbn2/4p3/4P3/2NPBN2/PPPQ1PPP/R3K2R w KQkq - 0 1
setas: e1g1 h1f1
legenda: Roque curto das Brancas: o rei vai de e1 para g1 e a torre de h1 salta para f1.
```

### En passant (captura "de passagem")

Se um peão adversário avança duas casas no primeiro lance e fica ao lado do seu peão, você pode capturá-lo **na jogada seguinte**, como se ele tivesse avançado apenas uma casa. É uma regra que muita gente nunca aprendeu.

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

O xeque-mate é o objetivo final do xadrez. Não importa quantas peças cada lado tem: ganhar uma dama de vantagem não vale nada se você não conseguir dar o xeque-mate.

```exercicio
fen: 6k1/5ppp/8/8/8/8/5PPP/R5K1 w - - 0 1
enunciado: Sua vez, de Brancas: dê **xeque-mate em 1 lance**.
tipo: mate
solucao: a1a8
dica: O rei preto está preso atrás dos próprios peões. Que peça sua pode chegar à última fileira?
explicacao: 1.Ta8# — a torre dá xeque na 8ª fileira e o rei não tem fuga: f7, g7 e h7 estão ocupadas pelos próprios peões, e f8 e h8 continuam atacadas pela torre. É o "mate do corredor".
```

### Empate (afogamento e outros)

Nem toda partida termina com vencedor. Existem várias formas de empatar:

- **Afogamento (stalemate)**: o jogador da vez não está em xeque, mas não tem nenhuma jogada legal possível.
- **Acordo entre os jogadores**: ambos concordam em empatar.
- **Regra dos 50 lances**: nenhum peão se moveu nem houve captura por 50 lances consecutivos.
- **Repetição tripla**: a mesma posição se repete três vezes.
- **Material insuficiente**: nenhum dos lados tem peças suficientes para dar mate (por exemplo, rei contra rei).

## 5. Como praticar e evoluir {#pratica}

Aprender as regras é só o começo. O xadrez é um jogo que se aprimora com a prática. Algumas sugestões para os primeiros meses:

- **Jogue todo dia, mesmo que pouco**. Dez minutos diários valem mais que duas horas por semana.
- **Comece contra o computador**. Você pode pausar, pensar e refazer jogadas sem pressão. Quando estiver mais à vontade, passe para partidas contra outras pessoas.
- **Reveja suas partidas perdidas**. A maior parte do aprendizado vem dos erros.
- **Aprenda algumas aberturas básicas**. Não precisa decorar variantes longas. Saber controlar o centro e desenvolver as peças já é suficiente para os primeiros 10 lances.
- **Resolva exercícios de tática**. Garfo, cravada e ataque descoberto são padrões que aparecem o tempo todo.

:::dica
**💡 Dica honesta:** não tente decorar todas as aberturas do zero. Foque em *princípios* (controle do centro, desenvolvimento, segurança do rei) e em *tática*. Isso te leva muito mais longe nos primeiros seis meses.
:::

:::pratique Pronto para a primeira partida?
Use o nosso **modo Aprendiz**, com 12 lições interativas que ensinam cada peça e cada conceito na prática. Sem cadastro. Sem instalação. Direto no navegador.
:::

## Próximos passos

Quando você já estiver confortável com as regras, vale a pena conhecer:

- As aberturas mais comuns (Abertura Italiana, Defesa Siciliana, Gambito da Dama).
- Padrões de mate (mate do corredor, mate do pastor, mate em escada).
- Finais básicos (rei e dama contra rei, rei e torre contra rei, peão passado).
- Princípios de meio-jogo (peças ativas, fraquezas no campo adversário, troca vantajosa).

Vamos publicar guias específicos sobre cada um desses temas em breve, aqui no [/aprenda](/aprenda). Se quiser receber os próximos, salve o site nos favoritos e volte sempre.
