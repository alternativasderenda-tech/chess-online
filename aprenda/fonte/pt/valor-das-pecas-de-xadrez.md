---
id: valor-das-pecas
titulo: "Valor das Peças de Xadrez: Quanto Vale Cada Uma"
titulo_seo: Valor das Peças de Xadrez | Xadrez Online
descricao: Quanto vale cada peça do xadrez — peão 1, cavalo 3, bispo 3, torre 5 e dama 9 — e como usar esses pontos para decidir trocas e capturas.
nivel: iniciante
ordem: 32
publicado: 2026-10-26
atualizado: 2026-10-26
tags: [valor das peças de xadrez, quanto vale cada peça, pontos das peças, qualidade no xadrez, trocas no xadrez]
jogar: 1
relacionados: [como-as-pecas-se-movem, taticas, erros-de-iniciante, principios-de-abertura, bispos]
ensina: [Valor relativo das peças, Trocas de peças, Ganhar a qualidade]
---
No xadrez, cada peça tem um valor aproximado em pontos, medido em peões: **peão = 1, cavalo = 3, bispo = 3, torre = 5 e dama = 9**. O rei não tem valor em pontos, porque perdê-lo é perder a partida. Esses números não fazem parte das regras; são uma ferramenta para comparar trocas e decidir, em segundos, se uma captura vale a pena.

## A tabela de valores {#tabela "A tabela de valores"}

| Peça | Valor (em peões) |
|---|---|
| Peão | 1 |
| Cavalo | 3 |
| Bispo | 3 |
| Torre | 5 |
| Dama | 9 |
| Rei | sem valor: não pode ser trocado |

Essa escala é a que aparece na maioria dos manuais. Alguns autores dão um pouquinho a mais ao bispo do que ao cavalo, mas para quem está começando a regra é simples: **cavalo e bispo valem o mesmo**.

Somando tudo, cada lado começa com **39 pontos**: 8 peões (8) + 2 cavalos (6) + 2 bispos (6) + 2 torres (10) + 1 dama (9).

```tabuleiro
fen: rnbqkbnr/pppppppp/8/8/8/8/PPPPPPPP/RNBQKBNR w KQkq - 0 1
casas: d1:verde d8:verde a1:azul h1:azul a8:azul h8:azul
legenda: Na posição inicial cada lado tem 39 pontos. As damas (verde) valem 9; as torres (azul), 5 cada.
```

## Por que cada peça vale o que vale {#por-que "Por que esses valores"}

O valor vem, principalmente, de **quantas casas a peça controla** e de quanto ela ajuda a dar mate.

- **Peão (1):** anda uma casa e só para a frente. É a unidade de medida. Mas cuidado: um peão perto da promoção pode valer muito mais, porque está a um passo de virar dama.
- **Cavalo (3):** salta por cima das peças e é ótimo em posições fechadas, mas é lento para atravessar o tabuleiro.
- **Bispo (3):** cobre diagonais longas e é forte em posições abertas, mas só enxerga casas de uma cor. Por isso **[o par de bispos](artigo:bispos)** (os dois juntos) costuma ser uma pequena vantagem.
- **Torre (5):** controla colunas e fileiras inteiras. Com rei e torre já se força o mate contra o rei sozinho.
- **Dama (9):** soma torre e bispo. Ela vale quase o mesmo que duas torres (10).

Se quiser rever como cada uma anda, veja [como as peças se movem](artigo:como-as-pecas-se-movem).

## Como usar os pontos nas trocas {#trocas "Como usar nas trocas"}

Uma **troca** acontece quando você captura uma peça e o adversário captura outra de volta. A pergunta é sempre: *quem saiu ganhando em pontos?*

- **Troca equilibrada:** bispo por cavalo (3 por 3), torre por torre (5 por 5).
- **Troca boa:** você entrega um cavalo (3) e leva uma torre (5). Você ganhou 2 pontos.
- **Troca ruim:** você entrega a dama (9) e leva só uma torre (5). Perdeu 4 pontos.

```tabuleiro
fen: r1bqkbnr/1ppp1ppp/p1B5/4p3/4P3/5N2/PPPP1PPP/RNBQK2R b KQkq - 0 4
setas: d7c6:azul
legenda: 1.e4 e5 2.Cf3 Cc6 3.Bb5 a6 4.Bxc6: o bispo branco capturou o cavalo, e as Pretas recapturam (por exemplo, 4...dxc6). Bispo por cavalo: troca equilibrada, 3 por 3.
```

### Ganhar "a qualidade"

Uma expressão que você vai ouvir muito: **ganhar a qualidade** é trocar uma peça menor (cavalo ou bispo, 3) por uma torre (5). A diferença é de 2 pontos, e em geral já é uma vantagem séria. "Perder a qualidade" é o contrário.

### Conte antes de capturar

Antes de capturar uma peça defendida, conte:

1. Quantas peças suas atacam a casa?
2. Quantas peças do adversário a defendem?
3. Se as capturas forem até o fim, quem fica com mais pontos?

Se você captura com uma peça barata e o adversário recaptura com uma barata, o saldo é o que importa. Capturar um peão defendido com a dama, por exemplo, quase sempre é um erro: você ganha 1 e perde 9.

:::dica
**💡 Dica:** capture primeiro com a peça **de menor valor**. Se a recaptura vier, você perde o mínimo possível.
:::

## Como acompanhar o material durante a partida {#contar "Acompanhar o material"}

Você não precisa somar 39 pontos a cada lance. É mais fácil comparar **o que já saiu do tabuleiro**: se você capturou um bispo e um peão (4 pontos) e perdeu um cavalo (3), está 1 ponto à frente.

Com essa conta em mente, a estratégia muda conforme o placar:

- **Se você está à frente em material**, troque peças (sem perder mais nada). Com menos peças no tabuleiro, a vantagem pesa mais, e o adversário tem menos chances de reagir.
- **Se você está atrás**, evite trocas e procure complicar: ataques ao rei e [ameaças táticas](artigo:taticas) são a sua chance de recuperar o que perdeu.

Essa regra simples — à frente, troque; atrás, complique — vale do iniciante ao mestre.

## Quando os pontos enganam {#excecoes "Quando os pontos enganam"}

Os pontos são um guia, não uma lei. Algumas situações mudam a conta:

- **Xeque-mate vale mais que tudo.** Entregar a dama para dar mate é o melhor lance do tabuleiro.
- **Peças ativas valem mais.** Um cavalo no centro, atacando, vale mais que uma torre presa no canto.
- **[Peão passado](artigo:estrutura-de-peoes) avançado.** Um peão na 7ª fileira, prestes a promover, pode valer mais que uma peça.
- **Segurança do rei.** Às vezes vale entregar material para abrir o rei adversário.

Mesmo assim, enquanto você está aprendendo, a regra prática é: **não entregue material sem uma razão concreta**. Perder peças "à toa" é um dos [erros mais comuns de iniciantes](artigo:erros-de-iniciante).

## Exercícios {#exercicios "Exercícios"}

Em todos, a pergunta é a mesma: qual lance ganha mais pontos?

```exercicio
fen: k7/8/8/3n1r2/4P3/8/8/7K w - - 0 1
enunciado: O peão de e4 pode capturar o cavalo ou a torre. Qual captura vale mais?
tipo: tatica
solucao: e4f5
dica: Cavalo vale 3, torre vale 5. Alguma das duas está defendida?
explicacao: 1.exf5 — nenhuma das duas peças está defendida, então leve a mais valiosa: a torre (5 pontos) em vez do cavalo (3).
```

```exercicio
fen: r2r2k1/5ppp/8/7b/8/7P/5PP1/3Q2K1 w - - 0 1
enunciado: A dama branca pode capturar a torre de d8 ou o bispo de h5. Escolha a captura certa.
tipo: tatica
solucao: d1h5
dica: A torre de d8 está defendida pela outra torre. E o bispo?
explicacao: 1.Dxh5! — o bispo não tem defesa, e as Brancas ganham 3 pontos. Já 1.Dxd8+? Txd8 entrega a dama (9) por uma torre (5): perda de 4 pontos.
```

```exercicio
fen: r4rk1/p1p2ppp/4b3/8/8/8/PPP2PBP/4R1K1 w - - 0 1
enunciado: As Brancas podem **ganhar a qualidade**. Encontre o lance.
tipo: tatica
solucao: g2a8
dica: Olhe a diagonal longa do bispo de g2.
explicacao: 1.Bxa8 Txa8 — o bispo (3) captura a torre (5) e, mesmo com a recaptura, as Brancas saem com 2 pontos a mais. Cuidado com 1.Txe6?, que entrega a torre (5) pelo bispo (3) depois de 1...fxe6.
```

## Perguntas frequentes {#faq "Perguntas frequentes"}

### Quanto vale cada peça no xadrez?

Peão 1, cavalo 3, bispo 3, torre 5 e dama 9. O rei não tem valor em pontos.

### O bispo vale mais que o cavalo?

Para quem está começando, os dois valem 3. O bispo costuma ser um pouco melhor em posições abertas e o cavalo, em posições fechadas; e ter os dois bispos é uma pequena vantagem.

### Quanto vale o rei?

O rei não tem valor em pontos, porque não pode ser capturado nem trocado: quando ele não tem como escapar do ataque, é xeque-mate e a partida acaba.

### Os pontos decidem quem ganha?

Não. Ganha quem dá xeque-mate (ou quando o adversário abandona ou perde no tempo). Os pontos só ajudam a avaliar trocas: quem tem mais material costuma ter mais chances.

### O que é "ganhar a qualidade"?

É trocar um cavalo ou um bispo (3 pontos) por uma torre (5 pontos), ganhando 2 pontos na troca.

:::pratique Pratique contando material
Jogue contra o computador no nível Fácil e, a cada captura, some os pontos de cada lado. Tente terminar a partida com mais material do que começou à frente.
:::
