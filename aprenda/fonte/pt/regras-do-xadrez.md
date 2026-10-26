---
id: regras
titulo: As Regras Oficiais do Xadrez (FIDE) Explicadas
titulo_seo: Regras do Xadrez: as Regras Oficiais da FIDE Explicadas
descricao: Todas as regras oficiais do xadrez segundo a FIDE, explicadas em português brasileiro: como cada peça se move, regras especiais, fim de partida, empates e mais.
nivel: iniciante
ordem: 20
publicado: 2026-05-11
atualizado: 2026-10-26
tags: [regras do xadrez, regras oficiais xadrez, regras fide, xeque mate regras, regras xadrez para iniciantes]
jogar: 0
relacionados: [como-as-pecas-se-movem, lances-especiais, xeque-mate-e-afogamento, empates, ritmos-de-jogo]
ensina: [Regras oficiais da FIDE, Fim de partida, Empates]
---
As regras do xadrez são as [Leis do Xadrez da FIDE](https://handbook.fide.com/chapter/E012023), a Federação Internacional de Xadrez. Em resumo: cada jogador começa com 16 peças num tabuleiro de 64 casas, as Brancas fazem o primeiro lance, os dois se alternam, um lance de cada vez, e vence quem der xeque-mate no rei adversário. A partida também pode terminar por desistência, por tempo esgotado ou empatada — por acordo, afogamento, repetição tripla, regra dos 50 lances ou material insuficiente. Este guia resume todas as regras oficiais em linguagem simples.

## 1. O tabuleiro e a posição inicial {#tabuleiro}

O xadrez é jogado em um [tabuleiro de 64 casas](artigo:tabuleiro-e-notacao) (8x8), com cores alternadas. **A casa do canto direito de cada jogador deve ser clara**. As peças começam nas duas primeiras fileiras de cada lado.

Ordem das peças na primeira fileira (da coluna a para a coluna h):

- Torre — Cavalo — Bispo — Dama — Rei — Bispo — Cavalo — Torre

**A dama sempre começa na casa da sua própria cor**: a dama branca numa casa clara, a dama preta numa casa escura. Os peões ocupam a fileira da frente (a 2ª das Brancas, a 7ª das Pretas). O jogador das peças brancas joga primeiro.

```tabuleiro
fen: rnbqkbnr/pppppppp/8/8/8/8/PPPPPPPP/RNBQKBNR w KQkq - 0 1
casas: e1 e8 d1:verde d8:verde
legenda: Posição inicial: o rei e a dama ocupam o centro da primeira fileira, e a dama fica na casa da sua cor.
```

## 2. Movimentos das peças {#movimentos}

O movimento de cada peça, com diagramas e exercícios, está em [como as peças se movem](artigo:como-as-pecas-se-movem). Para consulta rápida:

| Peça | Como anda | Como captura |
|---|---|---|
| Rei | 1 casa em qualquer direção, nunca para casa atacada | Igual ao movimento |
| Dama | Linha reta ou diagonal, quantas casas quiser | Igual ao movimento |
| Torre | Linha reta (coluna ou fileira), quantas casas quiser | Igual ao movimento |
| Bispo | Diagonal, quantas casas quiser; fica sempre na mesma cor | Igual ao movimento |
| Cavalo | Em "L" (2 + 1); é a única peça que salta | Igual ao movimento |
| Peão | 1 casa para a frente (2 na primeira vez); nunca recua | 1 casa na diagonal, para a frente |

Fora do roque, em que a torre passa por cima do rei, só o cavalo pula outras peças. Nenhuma peça captura peça da própria cor.

## 3. Lances especiais {#especiais}

### Roque

O rei e uma torre se movem juntos: o rei avança duas casas em direção à torre e a torre pula para o outro lado do rei. Existe o **roque pequeno** (ou curto, do lado do rei, o mais comum) e o **roque grande** (ou longo, do lado da dama).

[Condições para fazer o roque](artigo:lances-especiais):

- O rei e a torre escolhida não podem ter se movido antes.
- Não pode haver peças entre o rei e a torre.
- O rei não pode estar em xeque.
- O rei não pode passar por uma casa atacada nem terminar em uma.

```tabuleiro
fen: r3k2r/pppq1ppp/2npbn2/4p3/4P3/2NPBN2/PPPQ1PPP/R3K2R b KQkq - 0 1
setas: e8c8 a8d8
legenda: Roque grande das Pretas: o rei vai de e8 para c8 e a torre de a8 para d8.
```

### En passant (captura "de passagem")

Se um peão adversário sai da casa inicial avançando duas casas e para ao lado do seu peão, você pode capturá-lo no lance seguinte, como se ele tivesse avançado apenas uma casa. **Só vale no lance imediatamente seguinte** — se você não capturar, perde o direito.

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

O rei está sob ataque direto. Você é obrigado a sair do xeque: fugindo com o rei, capturando a peça que dá xeque ou bloqueando (detalhes em [xeque, xeque-mate e afogamento](artigo:xeque-mate-e-afogamento)).

### Xeque-mate

O rei está em xeque e **nenhuma das três saídas é possível**. A partida acaba. Quem deu o xeque-mate venceu.

### Desistência

Um jogador pode desistir a qualquer momento. Geralmente isso acontece quando o jogador percebe que vai perder e quer poupar tempo. A desistência conta como vitória do adversário.

## 5. Tipos de empate {#empates}

### Afogamento (stalemate)

O jogador da vez não está em xeque, mas não tem nenhum lance legal possível. A partida termina em empate. Essa é uma das regras mais importantes do final de jogo — você pode ter dama de vantagem mas, se [afogar o rei adversário](artigo:xeque-mate-e-afogamento), a partida termina empatada.

```tabuleiro
fen: 7k/5Q2/6K1/8/8/8/8/8 b - - 0 1
casas: h8:vermelha
legenda: Afogamento: as Pretas jogam, não estão em xeque e não têm nenhum lance legal. A partida termina empatada.
```

### Acordo entre os jogadores

Os dois jogadores podem concordar em empatar a qualquer momento. Em torneios oficiais, há regras adicionais sobre quando isso é permitido.

### Regra dos 50 lances

Se cada jogador fizer 50 lances sem captura nem movimento de peão, [o jogador da vez pode pedir o empate](artigo:empates); com 75 lances, o empate é automático. A regra existe para impedir partidas infinitas em finais sem progresso.

### Repetição tripla

Se a mesma posição se repete três vezes na partida (com o mesmo jogador na vez de jogar), pode-se pedir empate. Não precisam ser repetições consecutivas. Se a mesma posição aparecer cinco vezes, o empate é automático.

### Material insuficiente

Quando nenhum dos lados tem peças suficientes para dar xeque-mate, a partida termina em empate automaticamente. Exemplos:

- Rei contra rei.
- Rei contra rei e bispo.
- Rei contra rei e cavalo.
- Rei e bispo contra rei e bispo, quando os bispos estão na mesma cor.

## 6. Regras de tempo e relógio {#relogio}

Em partidas com relógio, cada jogador tem um tempo total. Quando o tempo acaba, o jogador perde — a não ser que o adversário não consiga dar mate por nenhuma sequência de lances legais (por exemplo, se só lhe restar o rei); nesse caso, é empate. Os ritmos da FIDE são:

- **Clássico:** 60 minutos ou mais para cada jogador.
- **Rápido:** mais de 10 e menos de 60 minutos.
- **Blitz:** 10 minutos ou menos.

Na conta da FIDE, o incremento conta 60 vezes: 10+5 vale 10 min + 60 × 5 s = 15 minutos, e é rápido. O **bullet** (menos de 3 minutos) não é uma categoria da FIDE; é um ritmo dos sites.

Veja o artigo dedicado em [Xadrez Clássico, Rápido, Blitz e Bullet](artigo:ritmos-de-jogo).

## 7. Conduta e etiqueta {#etiqueta}

Algumas regras menos conhecidas mas igualmente válidas:

- **Peça tocada, peça jogada.** Em torneios, se você toca em uma peça sua, é obrigado a movê-la (se houver um lance legal). Se toca em uma peça adversária, é obrigado a capturá-la (idem).
- **Lance só termina quando você solta a peça.** Antes disso, você ainda pode mudar para outra casa legal da mesma peça.
- **Não pode consultar livros, computador ou outras pessoas** durante a partida em torneio oficial.
- **Não pode falar com o adversário** além do necessário (saudação, oferecer empate, abandonar).

:::dica
**💡 Em jogos online:** a regra "peça tocada, peça jogada" não se aplica: o lance só conta quando você o completa. Mas as regras de tempo e dos lances especiais valem da mesma forma.
:::

## Perguntas frequentes {#faq "Perguntas frequentes"}

### Quantas peças cada jogador tem?

Dezesseis: oito peões, duas torres, dois cavalos, dois bispos, uma dama e um rei.

### O que acontece quando o tempo acaba?

Perde quem deixou o tempo acabar — a menos que o adversário não tenha como dar xeque-mate com nenhuma sequência de lances legais; nesse caso, a partida é empate (Leis da FIDE, artigo 6.9).

### "Peça tocada, peça jogada" é regra oficial?

É. Pelo artigo 4.3 das Leis da FIDE, quem tem a vez e toca de propósito numa peça sua precisa movê-la, se ela tiver lance legal; se tocar numa peça adversária, precisa capturá-la, se puder. Para só ajeitar uma peça na casa, é preciso avisar antes, dizendo "ajusto".

### Posso ter duas damas?

Pode. Pela promoção, um peão que chega à última fileira pode virar dama mesmo que a dama original ainda esteja no tabuleiro. [Veja como funciona a promoção](artigo:lances-especiais#promocao).

:::pratique Coloque as regras em prática
O botão abaixo abre o jogo no modo **🎓 Aprendiz**: são 12 lições interativas que ensinam cada regra na prática.
:::
