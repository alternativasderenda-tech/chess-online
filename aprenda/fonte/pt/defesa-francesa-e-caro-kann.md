---
id: francesa-e-caro-kann
titulo: Defesa Francesa e Caro-Kann: Planos e Variantes
descricao: Defesa Francesa e Caro-Kann lado a lado: Avanço, Winawer, Clássica, Trocas e Panov, os planos de cada lado e qual das duas escolher contra 1.e4.
nivel: intermediario
ordem: 55
publicado: 2026-10-26
atualizado: 2026-10-26
tags: [defesa francesa, caro-kann, variante do avanço, winawer, tarrasch, variante das trocas, ataque panov, aberturas de xadrez]
jogar: 2
relacionados: [defesa-siciliana, estrutura-de-peoes, bispos, gambito-da-dama-e-london, preparacao-de-aberturas]
ensina: [Defesa Francesa, Caro-Kann, Variante do Avanço, Winawer, Ataque Panov-Botvinnik]
---
A Defesa Francesa (**1.e4 e6**) e a Caro-Kann (**1.e4 c6**) são as duas defesas sólidas mais populares contra 1.e4. Nas duas, as Pretas preparam ...d5 para contestar o peão e4 já no segundo lance e apostam numa [estrutura de peões](artigo:estrutura-de-peoes) firme em vez de jogo tático imediato. A diferença central está no bispo das casas claras: na Francesa, ele fica preso atrás do peão e6; na Caro-Kann, ele sai antes, para f5 ou g4.

## O que as duas têm em comum {#em-comum "O que têm em comum"}

Depois de 1.e4 e6 2.d4 d5 ou 1.e4 c6 2.d4 d5, as Brancas precisam decidir o que fazer com o peão e4 atacado. Há três caminhos, e eles se repetem nas duas defesas:

- **Avançar (3.e5):** ganha espaço e fecha o centro.
- **Defender (3.Cc3 ou 3.Cd2):** mantém a tensão; muitas vezes as Pretas trocam com ...dxe4.
- **Trocar (3.exd5):** simplifica e abre o jogo.

Por isso vale estudar as duas juntas: os planos se parecem, e você entende melhor uma conhecendo a outra.

## Defesa Francesa {#francesa "Defesa Francesa"}

### Variante do Avanço: 3.e5

```tabuleiro
fen: rnbqkbnr/ppp2ppp/4p3/3pP3/3P4/8/PPP2PPP/RNBQKBNR b KQkq - 0 3
setas: c7c5 f7f6
casas: d4:vermelha e5:vermelha
legenda: A Francesa, Variante do Avanço, depois de 3.e5: as Pretas atacam a cadeia de peões com ...c5 (na base) e ...f6 (na ponta).
```

Com 3.e5, as Brancas ganham espaço no flanco do rei. A regra de ouro das Pretas é **atacar a cadeia de peões**: ...c5 contra a base (d4) e, mais tarde, ...f6 contra a ponta (e5). A linha principal segue **3...c5 4.c3 Cc6 5.Cf3 Db6**: cavalo, dama e peão c5 somam pressão contra d4.

O problema crônico da Francesa é o **[bispo de c8](artigo:bispos)**, preso atrás de e6. As Pretas costumam resolver isso com ...b6 e ...Ba6, trocando-o pelo bispo de casas claras das Brancas (o de f1), ou deixando-o na defesa até abrir a posição.

### Winawer: 3.Cc3 Bb4

```tabuleiro
fen: rnbqk1nr/pp3ppp/4p3/2ppP3/3P4/P1P5/2P2PPP/R1BQKBNR b KQkq - 0 6
casas: c3:vermelha c2:vermelha g7
legenda: Winawer depois de 3.Cc3 Bb4 4.e5 c5 5.a3 Bxc3+ 6.bxc3: as Brancas ficam com peões dobrados e o par de bispos; as casas escuras perto do rei preto ficam fracas.
```

A **Winawer** é a linha mais aguda da Francesa. Depois de **4.e5 c5 5.a3 Bxc3+ 6.bxc3**, cada lado tem trunfos claros:

- **Brancas:** o [par de bispos](artigo:bispos#par) (os dois bispos contra bispo e cavalo), espaço e as casas escuras do flanco do rei preto sem o bispo de f8. O lance 7.Dg4, atacando g7, é o mais direto.
- **Pretas:** peões dobrados brancos para atacar (c3), jogo no flanco da dama com ...Ce7, ...Dc7 ou ...Da5, e uma estrutura central sólida.

### Clássica, Tarrasch e Trocas

- **Clássica (3.Cc3 Cf6):** depois de 4.Bg5, as Pretas desenvolvem com ...Be7. Com 4.e5 (Variante Steinitz), o cavalo de f6 é expulso e a posição lembra o Avanço.
- **Tarrasch (3.Cd2):** o cavalo evita a cravada da Winawer (...Bb4 e ...Bxc3+, que dobra os peões brancos); se as Pretas jogarem ...Bb4 mesmo assim, c3 expulsa o bispo. A resposta 3...c5 costuma levar a posições com [peão isolado](artigo:estrutura-de-peoes#isolado) (um peão sem peões vizinhos da mesma cor nas colunas ao lado) em d5 para as Pretas.
- **Variante das Trocas (3.exd5 exd5):** estrutura simétrica, e o bispo de c8 fica livre. Costuma dar jogo tranquilo.

### Armadilha do Avanço: a dama que se esquece de b5

No Avanço, as Pretas querem ganhar o peão d4. Mas, se o bispo branco já está em d3, capturar duas vezes em d4 abre a diagonal b5–e8 para um xeque com [ataque descoberto](artigo:ataque-descoberto).

```exercicio
fen: r1b1kbnr/pp3ppp/4p3/3pP3/3q4/3B4/PP3PPP/RNBQK2R w KQkq - 0 9
enunciado: Depois de 5...Db6 6.Bd3 cxd4 7.cxd4 Cxd4? 8.Cxd4 Dxd4??, as Brancas ganham a dama. Como?
solucao: d3b5
dica: A dama branca de d1 e a dama preta de d4 estão na mesma coluna. Qual peça pode sair do caminho dando xeque?
explicacao: 9.Bb5+! — o bispo dá xeque e abre a coluna d para a dama de d1. Contra 9...Re7 ou 9...Rd8, vem 10.Dxd4. Contra 9...Bd7, primeiro 10.Bxd7+ Rxd7 e só então 11.Dxd4: capturar a dama direto (10.Dxd4?) permitiria 10...Bxb5.
```

## Caro-Kann {#caro-kann "Caro-Kann"}

### Clássica: 3.Cc3 dxe4 4.Cxe4 Bf5

```tabuleiro
fen: rn1qkbnr/pp2pppp/2p5/5b2/3PN3/8/PPP2PPP/R1BQKBNR w KQkq - 1 5
setas: c8f5:azul
legenda: Caro-Kann Clássica depois de 4...Bf5: o bispo sai antes de ...e6, que é exatamente a vantagem da Caro-Kann sobre a Francesa.
```

As Pretas desenvolvem o bispo com ganho de tempo sobre o cavalo de e4. A linha principal segue **5.Cg3 Bg6 6.h4 h6 7.Cf3 Cd7 8.h5 Bh7 9.Bd3 Bxd3 10.Dxd3**. O avanço do peão h ganha espaço e faz o bispo recuar. As Brancas costumam fazer o roque grande, enquanto as Pretas completam o desenvolvimento com ...e6, ...Cgf6 e ...Be7 ou ...Bd6. É uma posição sólida, com finais confortáveis para as Pretas.

Outra opção é **4...Cd7**, que prepara ...Cgf6 sem permitir a troca que dobra os peões pretos. Mas atenção à ordem de lances, como mostra o exercício abaixo.

### Variante do Avanço: 3.e5 Bf5

```tabuleiro
fen: rn1qkbnr/pp2pppp/2p5/3pPb2/3P4/8/PPP2PPP/RNBQKBNR w KQkq - 1 4
setas: c6c5
legenda: Caro-Kann, Variante do Avanço, depois de 3.e5 Bf5: o bispo fica fora da cadeia de peões e a ruptura ...c5 vem mais tarde.
```

Aqui a diferença para a Francesa é visível: o bispo sai **antes** de ...e6. As Pretas depois jogam ...e6 e atacam a cadeia com ...c5, mesmo gastando dois tempos com o peão c (c6 e c5). As Brancas escolhem entre o desenvolvimento calmo (4.Cf3 e 5.Be2) e lances agressivos como 4.h4, que tentam caçar o bispo de f5.

### Trocas e Ataque Panov-Botvinnik

- **Variante das Trocas (3.exd5 cxd5 4.Bd3):** posição calma, com planos lentos dos dois lados.
- **Ataque Panov-Botvinnik (3.exd5 cxd5 4.c4):** as Brancas atacam d5 com o peão c e chegam com frequência a posições com **peão isolado em d4**, com jogo ativo de peças.

### Armadilha da Caro-Kann: o mate sufocado em d6

Depois de 4...Cd7 5.De2, o lance natural 5...Cgf6?? perde na hora. O cavalo de d7 tira uma casa de fuga do rei e, assim que o cavalo de e4 sai, a dama de e2 crava o peão e7 na coluna e.

```exercicio
fen: r1bqkb1r/pp1npppp/2p2n2/8/3PN3/8/PPP1QPPP/R1B1KBNR w KQkq - 3 6
enunciado: Depois de 3.Cc3 dxe4 4.Cxe4 Cd7 5.De2 Cgf6??, as Brancas dão **mate em 1**.
tipo: mate
lances: 1
solucao: e4d6
dica: Quando o cavalo de e4 sai, a coluna e se abre e o peão e7 fica cravado. Em que casa o cavalo dá xeque?
explicacao: 6.Cd6# — o peão e7 não pode capturar porque está cravado, e o rei está cercado pelas próprias peças (d8, d7, e7, f7 e f8). É um mate sufocado.
```

:::dica
**💡 Para as Pretas:** depois de 4...Cd7 5.De2, jogue 5...e6 ou 5...Cdf6. O lance 5.De2 é raro: além de armar a armadilha, ele bloqueia o bispo de f1.
:::

## Francesa ou Caro-Kann? Para quem é cada uma {#qual-escolher "Qual escolher"}

| Você prefere... | Escolha |
| --- | --- |
| Contra-ataque e posições desequilibradas | Francesa (Winawer) |
| Estrutura sólida e um bom bispo | Caro-Kann |
| Jogar contra a cadeia de peões no Avanço | As duas (com ...c5) |
| Finais tranquilos e pouca teoria forçada | Caro-Kann |

As duas servem para quem quer um repertório sólido contra 1.e4 sem a quantidade de teoria da [Defesa Siciliana](artigo:defesa-siciliana). A Francesa é um pouco mais ambiciosa e o bispo de c8 cobra o preço; a Caro-Kann é mais tranquila e o seu custo é um pouco de passividade no começo.

:::pratique Teste a sua defesa contra 1.e4
Jogue de Pretas contra o computador, alternando 1...e6 e 1...c6. Depois de algumas partidas, você vai sentir qual estrutura combina mais com você.
:::

## Perguntas frequentes {#faq "Perguntas frequentes"}

### A Caro-Kann é passiva?

Ela é sólida, não passiva. As Pretas aceitam um pouco menos de espaço no começo em troca de uma estrutura sem fraquezas e de finais confortáveis.

### Qual é o maior problema da Defesa Francesa?

O bispo de c8, preso atrás do peão e6. Boa parte dos planos pretos gira em torno de ativá-lo ou trocá-lo.

### Qual variante as Brancas devem escolher contra essas defesas?

O Avanço é a escolha mais simples para começar contra as duas: o plano (espaço e defesa da cadeia de peões) é claro e evita muita teoria.

### Dá para jogar a Francesa e a Caro-Kann ao mesmo tempo?

Dá, mas, para quem está construindo o repertório, é melhor escolher uma e jogá-la por meses. As estruturas se parecem, e o estudo de uma ajuda a outra.
