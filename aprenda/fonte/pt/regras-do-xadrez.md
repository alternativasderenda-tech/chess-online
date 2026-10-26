---
id: regras
titulo: As Regras Oficiais do Xadrez (FIDE) Explicadas
titulo_seo: As Regras Oficiais do Xadrez (FIDE) Explicadas | Xadrez Online
descricao: Todas as regras oficiais do xadrez segundo a FIDE, explicadas em português brasileiro: como cada peça se move, regras especiais, fim de partida, empates e mais.
nivel: iniciante
ordem: 20
publicado: 2026-05-11
atualizado: 2026-10-26
tags: [regras do xadrez, regras oficiais xadrez, regras fide, xeque mate regras, regras xadrez para iniciantes]
jogar: 1
relacionados: [jogar-do-zero, aberturas-para-iniciantes, mate-do-pastor, ritmos-de-jogo]
---
Este é o resumo completo das regras oficiais do xadrez segundo a FIDE (Federação Internacional de Xadrez), traduzido para uma linguagem acessível. Tudo o que você precisa saber para jogar conforme o padrão internacional, sem precisar ler o regulamento original de 60 páginas.

## 1. O tabuleiro e a posição inicial {#tabuleiro}

O xadrez é jogado em um tabuleiro de 64 casas (8x8), com cores alternadas. **A casa do canto direito de cada jogador deve ser branca**. As peças começam nas duas primeiras fileiras de cada lado.

Ordem das peças na primeira fileira (de A para H):

- Torre — Cavalo — Bispo — Dama — Rei — Bispo — Cavalo — Torre

**A dama sempre começa na casa da sua própria cor**: dama branca em casa branca, dama preta em casa preta. Os peões ocupam toda a segunda fileira. O jogador das peças brancas joga primeiro.

```tabuleiro
fen: rnbqkbnr/pppppppp/8/8/8/8/PPPPPPPP/RNBQKBNR w KQkq - 0 1
casas: e1 e8 d1:verde d8:verde
legenda: Posição inicial: o rei e a dama ocupam o centro da primeira fileira, e a dama fica na casa da sua cor.
```

## 2. Movimentos das peças {#movimentos}

Cada peça tem um movimento próprio. Veja o resumo:

:::peca ♟ Peão
Anda uma casa para frente. No primeiro lance, pode avançar duas casas. Captura na diagonal, uma casa para frente. Não anda para trás.
:::

:::peca ♜ Torre
Anda em linha reta (horizontal ou vertical), quantas casas quiser. Captura na casa de destino. Não pula peças.
:::

:::peca ♝ Bispo
Anda em diagonal, quantas casas quiser. Cada bispo sempre fica preso à cor inicial.
:::

:::peca ♛ Dama
Combina os movimentos da torre e do bispo. Move em qualquer direção, em linha reta ou diagonal, quantas casas quiser.
:::

:::peca ♞ Cavalo
Move em "L": duas casas em uma direção e mais uma na perpendicular. É a única peça que pula sobre outras peças.
:::

:::peca ♚ Rei
Move uma casa em qualquer direção. Não pode mover-se para uma casa atacada por uma peça adversária.
:::

## 3. Jogadas especiais {#especiais}

### Roque

O rei e uma torre se movem juntos: o rei avança duas casas em direção à torre e a torre pula para o outro lado do rei. Existe roque curto (lado do rei, mais comum) e roque longo (lado da dama).

Condições para fazer o roque:

- O rei e a torre escolhida não podem ter se movido antes.
- Não pode haver peças entre o rei e a torre.
- O rei não pode estar em xeque.
- O rei não pode passar por uma casa atacada nem terminar em uma.

```tabuleiro
fen: r3k2r/pppq1ppp/2npbn2/4p3/4P3/2NPBN2/PPPQ1PPP/R3K2R b KQkq - 0 1
setas: e8c8 a8d8
legenda: Roque longo das Pretas: o rei vai de e8 para c8 e a torre de a8 para d8.
```

### En passant (captura "de passagem")

Se um peão adversário avança duas casas no primeiro lance e fica ao lado do seu peão, você pode capturá-lo na jogada seguinte, como se ele tivesse avançado apenas uma casa. **Só vale no lance imediatamente seguinte** — se você não capturar, perde o direito.

```tabuleiro
fen: rnbqkbnr/ppp1p1pp/8/3pPp2/8/8/PPPP1PPP/RNBQKBNR w KQkq f6 0 3
setas: e5f6
casas: f5:vermelha
legenda: En passant: depois de f7–f5, o peão de e5 captura em f6 e o peão de f5 é retirado.
```

### Promoção do peão

Quando seu peão chega à última fileira do tabuleiro (8ª para Brancas, 1ª para Pretas), ele **obrigatoriamente** se transforma em outra peça da sua escolha (dama, torre, bispo ou cavalo). Pode haver mais de uma dama no tabuleiro graças à promoção.

## 4. Fim de partida {#fim}

### Xeque

O rei está sob ataque direto. Você é obrigado a sair do xeque imediatamente, de uma das três formas:

1. Mover o rei para uma casa segura.
2. Bloquear o ataque com outra peça (não funciona contra cavalo, que pula).
3. Capturar a peça que está dando xeque.

### Xeque-mate

O rei está em xeque e **nenhuma das três opções acima é possível**. A partida acaba. Quem deu o xeque-mate venceu.

### Desistência

Um jogador pode desistir a qualquer momento. Geralmente isso acontece quando o jogador percebe que vai perder e quer poupar tempo. A desistência conta como vitória do adversário.

## 5. Tipos de empate {#empates}

### Afogamento (stalemate)

O jogador da vez não está em xeque, mas não tem nenhuma jogada legal possível. A partida termina em empate. Essa é uma das regras mais importantes do final de jogo — você pode ter dama de vantagem mas, se afogar o rei adversário, o jogo termina empate.

```tabuleiro
fen: 7k/5Q2/6K1/8/8/8/8/8 b - - 0 1
casas: h8:vermelha
legenda: Afogamento: as Pretas jogam, não estão em xeque e não têm nenhum lance legal. A partida termina empatada.
```

### Acordo entre os jogadores

Os dois jogadores podem concordar em empatar a qualquer momento. Em torneios oficiais, há regras adicionais sobre quando isso é permitido.

### Regra dos 50 lances

Se passam 50 lances consecutivos sem captura nem movimento de peão, qualquer jogador pode pedir empate. A regra existe para impedir partidas infinitas em finais sem progresso.

### Repetição tripla

Se a mesma posição se repete três vezes na partida (com o mesmo jogador na vez de jogar), pode-se pedir empate. Não precisam ser repetições consecutivas.

### Material insuficiente

Quando nenhum dos lados tem peças suficientes para dar xeque-mate, a partida termina em empate automaticamente. Exemplos:

- Rei contra rei.
- Rei contra rei e bispo.
- Rei contra rei e cavalo.
- Rei e bispo contra rei e bispo, quando os bispos estão na mesma cor.

## 6. Regras de tempo e relógio {#relogio}

Em partidas com relógio, cada jogador tem um tempo total. Quando o tempo acaba, o jogador perde — a não ser que o adversário não tenha peças suficientes para dar mate (caso em que é empate). Os principais formatos são:

- **Clássico:** 60 minutos ou mais para cada lado.
- **Rápido:** 10 a 60 minutos.
- **Blitz:** 3 a 10 minutos.
- **Bullet:** menos de 3 minutos.

Veja o artigo dedicado em [Xadrez Clássico, Rápido, Blitz e Bullet](artigo:ritmos-de-jogo).

## 7. Conduta e etiqueta {#etiqueta}

Algumas regras menos conhecidas mas igualmente válidas:

- **Peça tocada, peça jogada.** Em torneios, se você toca em uma peça sua, é obrigado a movê-la (se houver um lance legal). Se toca em uma peça adversária, é obrigado a capturá-la (idem).
- **Lance só termina quando você solta a peça.** Antes disso, você ainda pode mudar para outra casa legal da mesma peça.
- **Não pode consultar livros, computador ou outras pessoas** durante a partida em torneio oficial.
- **Não pode falar com o adversário** além do necessário (saudação, oferecer empate, abandonar).

:::dica
**💡 Aviso para jogos online:** as regras de "peça tocada, peça jogada" não se aplicam em partidas pela internet — o lance só conta quando você confirma. Mas as regras de tempo e de movimentos especiais valem da mesma forma.
:::

:::pratique Coloque as regras em prática
Pratique no Xadrez Online com o modo Aprendiz: 12 lições interativas que ensinam cada regra na prática.
:::
