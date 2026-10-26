---
id: cravada
titulo: Cravada no Xadrez: Absoluta, Relativa e Como Explorar
titulo_seo: Cravada no Xadrez: Absoluta e Relativa | Xadrez Online
descricao: O que é a cravada no xadrez, a diferença entre cravada absoluta e relativa, como atacar a peça cravada e como se soltar. Com 3 exercícios interativos.
nivel: intermediario
ordem: 20
publicado: 2026-10-26
atualizado: 2026-10-26
tags: [cravada, cravada no xadrez, cravada absoluta, cravada relativa, peça cravada, tática de xadrez]
jogar: 2
relacionados: [taticas, espeto, garfo, gambito-da-dama-e-london, abertura-italiana]
ensina: [Cravada, Cravada absoluta, Cravada relativa]
---
A **cravada** acontece quando uma peça atacada não pode (ou não deve) sair do lugar, porque atrás dela, na mesma linha, está uma peça mais valiosa. Se a peça de trás é o rei, a cravada é **absoluta** e mover a peça da frente é ilegal; se é a dama, uma torre ou outra peça, a cravada é **relativa** e mover é permitido, mas custa caro.

## Como funciona a cravada {#como-funciona "Como funciona"}

Só três peças conseguem cravar: **bispo, torre e dama**, as peças de longo alcance. A cravada sempre envolve três personagens na mesma linha (diagonal, coluna ou fileira):

1. a **peça que crava**, que ataca;
2. a **peça cravada**, que fica no meio;
3. a **peça protegida**, que está atrás e é mais valiosa.

A peça cravada continua no tabuleiro, mas fica quase paralisada: não pode sair da linha sem expor o que está atrás. Em muitos casos ela também deixa de defender as casas que defendia antes.

## Cravada absoluta {#absoluta "Cravada absoluta"}

Quando a peça de trás é o **rei**, a regra do xadrez proíbe mover a peça cravada para fora da linha, porque isso deixaria o próprio rei em xeque. É por isso que se chama absoluta: não há escolha.

```tabuleiro
fen: r1bqkbnr/ppp2ppp/2np4/1B2p3/4P3/5N2/PPPP1PPP/RNBQK2R w KQkq - 0 4
setas: b5e8:vermelha
casas: c6 e8:vermelha
legenda: Depois de 1.e4 e5 2.Cf3 Cc6 3.Bb5 d6, o cavalo de c6 está cravado: atrás dele, na diagonal, está o rei de e8.
```

Nessa posição, o cavalo de c6 não pode se mexer de jeito nenhum. Uma cravada absoluta é o momento ideal para atacar a peça cravada com algo mais barato, por exemplo um peão: ela não tem como fugir.

## Cravada relativa {#relativa "Cravada relativa"}

Quando a peça de trás é a **dama**, uma torre ou outra peça valiosa, mover a peça cravada é legal. A pergunta é se vale a pena.

```tabuleiro
fen: rnbqkb1r/ppp2ppp/4pn2/3p2B1/2PP4/2N5/PP2PPPP/R2QKBNR b KQkq - 3 4
setas: g5d8
casas: f6 d8
legenda: Depois de 1.d4 d5 2.c4 e6 3.Cc3 Cf6 4.Bg5, o cavalo de f6 está cravado na dama de d8. Ele pode se mexer, mas a dama ficaria exposta ao bispo.
```

A cravada relativa engana muita gente, porque às vezes a peça "cravada" sai mesmo assim, com um golpe maior. O exemplo clássico é a **armadilha do elefante**, [nessa mesma abertura](artigo:gambito-da-dama-e-london):

:::caixa 4...Cbd7 5.cxd5 exd5 6.Cxd5? Cxd5! 7.Bxd8 Bb4+ 8.Dd2 Bxd2+ 9.Rxd2 Rxd8
As Brancas acharam que o cavalo de f6 estava preso e capturaram em d5. Mas ele saiu, entregando a dama, e o xeque de bispo em b4 recuperou tudo. No fim, as Pretas ficam com uma peça a mais por um peão.

<small>Moral: cravada relativa não é absoluta. Antes de contar com ela, confira se o adversário não tem um xeque ou uma ameaça maior.</small>
:::

## Como explorar uma cravada {#explorar "Como explorar uma cravada"}

Encontrou uma peça cravada? Estas são as formas mais comuns de lucrar com ela:

- **Ataque a peça cravada com algo mais barato.** Um peão que ataca um cavalo cravado no rei ganha o cavalo, porque ele não pode fugir.
- **Acumule atacantes.** Como a peça cravada não pode fugir, você tem tempo de trazer mais atacantes do que ela tem defensores.
- **Lembre que ela não defende de verdade.** Uma peça cravada no rei não pode capturar fora da linha da cravada, então as casas que ela "protegia" ficam livres.

```tabuleiro
fen: 6k1/5pp1/6N1/8/2B5/8/5PPP/6K1 b - - 0 1
setas: c4g8:vermelha
casas: f7 g6
legenda: O peão de f7 está cravado pelo bispo de c4. Ele não pode capturar o cavalo de g6, que fica tranquilo numa casa que parecia vigiada.
```

## Cravadas típicas da abertura {#abertura "Cravadas na abertura"}

Muitas aberturas populares giram em torno de uma cravada, e conhecê-las ajuda a não cair em armadilhas:

- **Bb5 contra o cavalo de c6** (Ruy Lopez): vira cravada absoluta quando o peão de d7 sai do caminho; antes disso, o bispo apenas ataca o cavalo.
- **Bg5 contra o cavalo de f6**: cravada relativa, com a dama em d8 atrás. Aparece em várias aberturas de 1.d4.
- **Bb4 contra o cavalo de c3**: a versão das Pretas, por exemplo na Defesa Nimzo-Índia (1.d4 Cf6 2.c4 e6 3.Cc3 Bb4).
- **...Bg4 contra o cavalo de f3**: cravada relativa na dama de d1, comum em muitas defesas.

Nenhuma dessas cravadas ganha material sozinha. Elas criam pressão: a peça cravada fica menos útil, e qualquer descuido (um peão que avança, uma peça que se soma ao ataque) pode decidir a partida. Um erro comum de quem sofre a cravada é tentar quebrá-la a qualquer preço com ...h6 e ...g5 (ou h3 e g4): às vezes funciona, mas os peões avançados enfraquecem o próprio rei.

## Como se livrar de uma cravada {#defesa "Como se livrar"}

- **Tire a peça de trás da linha.** Se o rei ou a dama saem da linha, a cravada desaparece.
- **Coloque uma peça no meio.** Interpor outra peça entre a que crava e a cravada também quebra a cravada, desde que a nova peça não fique em perigo.
- **Ataque quem crava.** Um peão que expulsa o bispo (como ...a6 contra Bb5, ou ...h6 contra Bg5) resolve muitos casos.
- **Previna:** evite deixar rei e dama na mesma diagonal ou coluna com uma peça só no meio.

:::dica
**💡 Dica:** a cravada é prima do [espeto](artigo:espeto). Na cravada, a peça da frente vale menos; no espeto, a da frente vale mais. Aprender um ajuda a enxergar o outro.
:::

:::pratique Treine a cravada agora
Jogue contra o computador e procure peças do adversário alinhadas com o rei ou a dama. No nível Médio essas cravadas aparecem com frequência desde a abertura.
:::

## Exercícios de cravada {#exercicios "Exercícios"}

```exercicio
fen: 6rk/ppq2pp1/8/8/8/8/PBPQ1PPP/5RK1 w - - 0 1
enunciado: Brancas jogam e dão **mate em 1**. O peão de g7 parece proteger tudo.
tipo: mate
lances: 1
solucao: d2h6
dica: Olhe a diagonal que sai do bispo de b2 e termina no rei de h8.
explicacao: 1.Dh6# — o peão de g7 está cravado pelo bispo de b2 e não pode capturar a dama. O rei não tem casa: g8 está ocupada pela torre e h7 é atacada pela dama.
```

```exercicio
fen: r3kb1r/pp1q1ppp/4pn2/8/8/2N5/PPP2PPP/R1B1KB1R w KQkq - 0 1
enunciado: Brancas jogam e **ganham a dama** com uma cravada.
solucao: f1b5 d7b5 c3b5
dica: A dama de d7 e o rei de e8 estão na mesma diagonal.
explicacao: 1.Bb5 crava a dama no rei. Ela não pode sair da diagonal, e o bispo está protegido pelo cavalo de c3. O melhor que as Pretas conseguem é 1...Dxb5 2.Cxb5: dama por bispo.
```

```exercicio
fen: r1bqkb1r/pp3ppp/2pp4/4n3/8/3B4/PPP2PPP/RNBQR1K1 w kq - 0 1
enunciado: Brancas jogam e **ganham uma peça** atacando a peça cravada.
solucao: f2f4 d8e7 f4e5
dica: O cavalo de e5 está na coluna e, entre a torre de e1 e o rei de e8. Ele não pode fugir.
explicacao: 1.f4 ataca o cavalo cravado com um peão. As Pretas podem defendê-lo (1...De7), mas não salvá-lo: 2.fxe5 dxe5 e as Brancas ganham um cavalo por um peão.
```

## Perguntas frequentes {#faq "Perguntas frequentes"}

### Qual a diferença entre cravada absoluta e relativa?

Na absoluta, a peça de trás é o rei, e mover a peça cravada para fora da linha é ilegal. Na relativa, a peça de trás é outra (em geral a dama ou uma torre), e mover é legal, mas costuma perder material.

### Quais peças podem cravar?

Só bispo, torre e dama, porque só elas atacam ao longo de linhas. Cavalo, peão e rei não cravam.

### A peça cravada ainda dá xeque?

Sim. Uma peça cravada continua controlando as casas que ataca: o rei adversário não pode entrar nelas, e ela pode até dar xeque. O que ela não pode é sair da linha da cravada se isso expuser o próprio rei.

### Como treinar a cravada?

Resolva exercícios e, nas partidas, procure peças adversárias alinhadas com o rei ou a dama. Veja também o mapa geral das [táticas de xadrez](artigo:taticas).
