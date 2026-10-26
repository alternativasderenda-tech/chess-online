---
id: xeque-mate-e-afogamento
titulo: "Xeque, Xeque-Mate e Afogamento: a Diferença"
titulo_seo: Xeque, Xeque-Mate e Afogamento | Xadrez Online
descricao: O que é xeque, o que é xeque-mate e o que é afogamento no xadrez, as três formas de sair do xeque e por que o afogamento é empate, com exercícios.
nivel: iniciante
ordem: 34
publicado: 2026-10-26
atualizado: 2026-10-26
tags: [xeque, xeque-mate, afogamento, rei afogado, como sair do xeque, diferença entre xeque-mate e afogamento]
jogar: 1
relacionados: [regras, mates-basicos, empates, ataque-descoberto, como-as-pecas-se-movem]
ensina: [Xeque, Xeque-mate, Afogamento]
---
**Xeque** é quando o rei está sendo atacado por uma peça adversária; o jogador é obrigado a livrar o rei do ataque já no lance seguinte. **Xeque-mate** é um xeque do qual não há saída: a partida acaba e quem deu o mate vence. **Afogamento** é quando o jogador da vez **não está em xeque**, mas não tem nenhum lance legal: a partida acaba empatada. A diferença entre mate e afogamento decide muitas partidas de iniciantes, então vale a pena entender bem.

## O que é xeque {#xeque "O que é xeque"}

Uma peça dá **xeque** quando ataca o rei adversário, ou seja, quando poderia capturá-lo no lance seguinte. O rei nunca é capturado de verdade: a regra obriga o jogador em xeque a resolver o problema imediatamente.

```tabuleiro
fen: 4k3/8/8/8/8/8/8/4R1K1 b - - 0 1
setas: e1e8:vermelha
casas: e8:vermelha d8:verde d7:verde f7:verde f8:verde
legenda: A torre de e1 dá xeque no rei preto pela coluna e. O rei tem quatro casas de fuga (verde): d8, d7, f7 e f8.
```

### As três formas de sair do xeque

Diante de um xeque, só existem três respostas possíveis. Lembre-se delas como **fugir, capturar ou bloquear**:

1. **Fugir:** mover o rei para uma casa que não esteja atacada.
2. **Capturar:** tomar a peça que está dando xeque (com o rei ou com outra peça).
3. **Bloquear** (ou *interpor*): colocar uma peça entre o rei e a peça atacante. Isso não funciona contra o xeque de cavalo, que salta, nem quando a peça atacante está colada no rei.

Se nenhuma das três for possível, é xeque-mate.

:::aviso
**⚠️ Cuidado:** você **não pode** fazer nenhum lance que deixe o seu próprio rei em xeque. Isso inclui [mover uma peça que está protegendo o rei](artigo:cravada) de um ataque. Num jogo online, o sistema simplesmente não aceita o lance.
:::

### Xeque duplo

Às vezes duas peças dão xeque ao mesmo tempo. É o **[xeque duplo](artigo:ataque-descoberto)**. Como não dá para capturar ou bloquear duas peças com um lance só, a única saída é **mover o rei**.

### Preciso dizer "xeque"?

Não. Nas [regras oficiais da FIDE](artigo:regras) (a Federação Internacional de Xadrez), anunciar o xeque não é obrigatório. Entre amigos é costume, mas não faz parte da regra.

## O que é xeque-mate {#xeque-mate "O que é xeque-mate"}

O **xeque-mate** (ou só **mate**) é o objetivo do xadrez. É um xeque em que o rei não consegue fugir, a peça atacante não pode ser capturada e o ataque não pode ser bloqueado. Quando isso acontece, a partida termina imediatamente, e quem deu o mate vence, não importa quanto material cada lado tenha.

```tabuleiro
fen: 4R1k1/5ppp/8/8/8/8/5PPP/6K1 b - - 1 1
setas: e8g8:vermelha
casas: g8:vermelha
legenda: Xeque-mate. A torre ataca o rei pela 8ª fileira; os próprios peões pretos tiram as casas de fuga, e nada pode capturar a torre ou bloquear.
```

Para conferir se um xeque é mate, faça as três perguntas, nesta ordem:

1. O rei tem alguma casa livre e não atacada?
2. Alguma peça pode capturar quem está dando xeque?
3. Alguma peça pode se colocar no caminho?

Três "não" = xeque-mate.

## O que é afogamento {#afogamento "O que é afogamento"}

O **afogamento** (também chamado de *rei afogado*, ou *stalemate* em inglês) acontece quando é a vez de um jogador, o rei dele **não está em xeque**, e ele **não tem nenhum lance legal** — nem com o rei, nem com qualquer outra peça. Pelas regras da FIDE, a partida termina imediatamente **empatada**.

```tabuleiro
fen: k7/8/1Q6/8/8/8/8/7K b - - 0 1
casas: a8:amarela a7:vermelha b7:vermelha b8:vermelha
legenda: As Pretas jogam, mas não têm lance: o rei em a8 não está em xeque, e as casas a7, b7 e b8 estão atacadas pela dama. É afogamento: empate.
```

Isso parece injusto para quem tem a dama, mas é a regra. O afogamento é a grande armadilha de quem está ganhando: com muita vantagem, é fácil tirar todas as casas do rei adversário **sem dar xeque**, e jogar fora uma vitória certa.

:::dica
**💡 Dica:** quando o adversário só tiver o rei (ou peças que não podem se mover), antes de cada lance pergunte: "depois disso, ele ainda vai ter um lance?". Se a resposta for não e o lance não for xeque, é afogamento.
:::

## Dar xeque é sempre bom? {#xeque-bom "Dar xeque é sempre bom?"}

Não. Muitos iniciantes dão xeque sempre que podem, mas um xeque sem plano costuma só empurrar o rei adversário para uma casa melhor e deixar a sua peça exposta. Antes de dar xeque, pergunte:

- **O xeque ganha alguma coisa?** Por exemplo, [ataca o rei e outra peça ao mesmo tempo](artigo:garfo), ou obriga o rei a ir para uma casa pior.
- **A peça que dá xeque fica segura?** Um xeque com uma peça que pode ser capturada é só uma forma rápida de perdê-la.
- **Existe algo melhor?** Às vezes um lance tranquilo, que tira as casas de fuga do rei, prepara um mate que o xeque apressado estragaria.

Do outro lado, quando você **leva** um xeque, não escolha a primeira saída que aparecer. Compare as três opções (fugir, capturar, bloquear) e fique com a que deixa a sua posição melhor, como no primeiro exercício abaixo.

## Xeque, mate e afogamento lado a lado {#comparacao "Comparação"}

| Situação | O rei está atacado? | Há lance legal? | Resultado |
|---|---|---|---|
| Xeque | Sim | Sim | A partida continua |
| Xeque-mate | Sim | Não | Vitória de quem deu o mate |
| Afogamento | Não | Não | Empate |

O afogamento é só uma das formas de empate. As outras (acordo, repetição, regra dos 50 lances, material insuficiente) estão em [empate no xadrez](artigo:empates).

## Exercícios {#exercicios "Exercícios"}

```exercicio
fen: r3Q1k1/5pp1/3b3p/8/8/8/5PPP/6K1 b - - 0 1
enunciado: As Pretas estão em xeque. Elas podem fugir com o rei, bloquear com o bispo ou capturar. Qual é a melhor saída?
tipo: tatica
solucao: a8e8
dica: Fugir ou bloquear deixa a dama branca no tabuleiro. E capturar?
explicacao: 1...Txe8 — a torre de a8 captura a dama que dava xeque. Fugir (1...Rh7) ou bloquear (1...Bf8) também saem do xeque, mas deixam as Brancas com a dama a mais.
```

```exercicio
fen: 7k/5K2/8/8/8/8/8/1Q6 w - - 0 1
enunciado: As Brancas dão **mate em 1**. Cuidado: vários lances de dama aqui dão afogamento.
tipo: mate
lances: 1
solucao: b1h1
dica: O rei branco já tira g7 e g8 do rei preto. A dama precisa dar xeque, não só cercar.
explicacao: 1.Dh1# — a dama dá xeque pela coluna h, e o rei preto não tem para onde ir. Já um lance como 1.Dg6?? tira as casas do rei sem dar xeque: as Pretas não têm lance, e é afogamento.
```

```exercicio
fen: r4rk1/ppp2ppp/2n5/7Q/8/3B4/PPP2PPP/R5K1 w - - 0 1
enunciado: Dama e bispo trabalham juntos. Encontre o **mate em 1**.
tipo: mate
lances: 1
solucao: h5h7
dica: O bispo de d3 mira uma casa perto do rei preto.
explicacao: 1.Dxh7# — a dama captura em h7 com a proteção do bispo de d3. O rei não pode capturá-la, h8 também está atacada pela dama, f8 está ocupada pela própria torre, e f7 e g7, pelos peões pretos.
```

## Perguntas frequentes {#faq "Perguntas frequentes"}

### Qual a diferença entre xeque-mate e afogamento?

No xeque-mate o rei está atacado e não tem saída: quem deu o mate vence. No afogamento o rei **não** está atacado, mas o jogador não tem nenhum lance legal: a partida empata.

### Afogamento é vitória ou empate?

Empate, pelas [Leis do Xadrez da FIDE](https://handbook.fide.com/chapter/E012023).

### Quais são as formas de sair do xeque?

Três: fugir com o rei, capturar a peça que dá xeque ou bloquear o caminho com outra peça. No xeque duplo, só fugir funciona.

### O rei pode dar xeque?

Não diretamente. Um rei nunca pode ficar ao lado do outro, porque estaria se colocando em xeque. Por isso o rei não dá xeque sozinho, mas ajuda muito a dar mate, cobrindo as casas de fuga.

### Posso me colocar em xeque de propósito?

Não. Um lance que deixa o próprio rei em xeque é ilegal e não é aceito.

:::pratique Pratique dar mate sem afogar
Jogue contra o computador no nível Fácil e, quando ficar com muita vantagem, preste atenção às casas do rei adversário antes de cada lance.
:::

Para treinar os mates que mais aparecem no fim da partida, veja os [mates básicos com dama e torre](artigo:mates-basicos).
