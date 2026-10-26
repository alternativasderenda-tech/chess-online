---
id: movimento-do-cavalo
titulo: Como o Cavalo se Move no Xadrez: o L, o Salto e o Garfo
titulo_seo: Como o Cavalo se Move no Xadrez: o L, o Salto e o Garfo
descricao: Tudo sobre o movimento do cavalo no xadrez: o L, por que ele pula peças, garfos, padrões táticos e como dominar a peça mais imprevisível do tabuleiro.
nivel: iniciante
ordem: 30
publicado: 2026-05-11
atualizado: 2026-10-26
tags: [como o cavalo se move, movimento cavalo xadrez, cavalo xadrez L, garfo cavalo, xeque com cavalo]
jogar: 1
relacionados: [como-as-pecas-se-movem, garfo, valor-das-pecas, taticas]
ensina: [Movimento do cavalo, Garfo de cavalo, Cavalo bom e cavalo ruim]
---
O cavalo se move em "L": anda duas casas em linha reta, na horizontal ou na vertical, e depois uma casa para o lado. É a única peça que, no movimento normal, salta por cima das outras, e a cada lance ele passa para uma casa de cor diferente. No centro do tabuleiro, o cavalo ataca até 8 casas; num canto, só 2. Este guia mostra o movimento, por que ele pula, o garfo e os padrões táticos que fazem do cavalo uma peça tão perigosa.

## 1. O movimento em L {#movimento}

O cavalo se move em forma de "L". Mais precisamente: **duas casas em uma direção (horizontal ou vertical) e uma casa na direção perpendicular**. Ou o contrário: uma casa em uma direção e duas na perpendicular. As duas formas valem.

De qualquer casa do tabuleiro, o cavalo tem no máximo **8 destinos possíveis**:

- 2 acima + 1 à esquerda
- 2 acima + 1 à direita
- 2 abaixo + 1 à esquerda
- 2 abaixo + 1 à direita
- 2 à esquerda + 1 acima
- 2 à esquerda + 1 abaixo
- 2 à direita + 1 acima
- 2 à direita + 1 abaixo

Nos cantos do tabuleiro, o cavalo tem só **2 movimentos**, e no resto da borda, 3 ou 4. Por isso o ditado em inglês *a knight on the rim is dim* ("cavalo na borda é cavalo apagado"). No canto ou na borda, o cavalo perde grande parte do seu poder.

No centro, o cavalo tem o máximo de 8 destinos. Por isso a recomendação clássica: **desenvolver os cavalos para c3, f3, c6 ou f6** nos primeiros lances.

```tabuleiro
fen: 7k/8/8/8/4N3/8/8/K7 w - - 0 1
casas: c3:verde c5:verde d2:verde d6:verde f2:verde f6:verde g3:verde g5:verde
legenda: No centro, o cavalo de e4 alcança 8 casas.
```

```tabuleiro
fen: 7k/8/8/8/8/8/8/N5K1 w - - 0 1
casas: b3:verde c2:verde
legenda: No canto, o cavalo de a1 só tem 2 casas.
```

## 2. Por que o cavalo pula peças (a regra única) {#pulo "Por que o cavalo pula peças"}

O cavalo é a **única peça do xadrez que pula sobre outras peças**. Não importa o que esteja entre ele e o destino — peças amigas, peças inimigas, qualquer coisa. O cavalo aterrissa direto na casa final.

Isso muda completamente as opções táticas:

- O cavalo consegue atacar peças **através** de uma parede de peões.
- É a única peça que pode dar xeque com peões e peças **na frente** do rei adversário.
- Não é bloqueável — você não pode "interpor" uma peça entre o cavalo e o destino dele.

A consequência prática: em posições **fechadas** (muitos peões trancados), o cavalo costuma ser mais forte que o bispo. Em posições **abertas** (poucos peões), o bispo geralmente leva vantagem.

## 3. A regra da cor: o cavalo alterna a cada lance {#cor "A regra da cor: cavalo alterna sempre"}

O cavalo **sempre muda a cor da casa** em que está. Se ele está numa casa clara, o próximo lance o leva para uma casa escura. E vice-versa.

Por quê? O "L" sempre soma 3 casas (2 + 1), e cada passo de uma casa troca a cor. Três trocas de cor terminam na cor oposta.

Consequências práticas:

- Para ir de uma casa clara a outra casa clara, o cavalo precisa de um número **par** de lances (2, 4…); para ir a uma casa escura, de um número **ímpar** (1, 3…).
- Por isso o cavalo nunca consegue "perder um lance": ele não volta à mesma casa em 3 lances. Em finais, isso decide se ele chega a tempo.
- Uma casa vizinha (como e4 → e5) parece perto, mas o cavalo precisa de 3 lances para chegar lá.

## 4. Valor e força do cavalo {#valor}

O cavalo vale cerca de 3 peões, o mesmo que o bispo (veja o [valor das peças](artigo:valor-das-pecas)), mas os dois **brilham em posições diferentes**: o cavalo nas fechadas, o bispo nas abertas. Trocar um cavalo por um bispo (ou vice-versa) é decisão posicional, não material.

## 5. O garfo: a tática mais famosa do cavalo {#garfo}

O **[garfo](artigo:garfo)** (em inglês, *fork*) é quando uma peça ataca duas peças adversárias ao mesmo tempo. O cavalo é o rei dos garfos no xadrez, porque o movimento em L permite ataques em direções que outras peças não conseguem.

### Exemplo: o ataque duplo

Imagine o cavalo branco em e5. Dali ele ataca c6, d7, f7, g6, g4, f3, d3 e c4. Se duas peças adversárias valiosas estiverem em duas dessas casas (digamos, dama e torre), o adversário só consegue salvar uma, e o cavalo captura a outra no lance seguinte. Quando o garfo pega rei, dama e torre de uma vez, ele se chama **garfo de família**.

### Garfo real (com xeque)

Quando o cavalo ataca o **rei adversário ao mesmo tempo que uma peça importante** (dama, torre, bispo), o adversário é obrigado a sair do xeque primeiro — e perde a peça atacada.

:::dica
**💡 Dica de defesa:** em todo lance, antes de jogar, olhe onde o cavalo adversário pode aterrissar nos próximos 2 lances. Pense: "se ele saltar para essa casa, ele ataca o quê?". Iniciantes perdem muito material por não fazer essa pergunta.
:::

```exercicio
fen: 2q3k1/5ppp/8/3N4/8/8/5PPP/6K1 w - - 0 1
enunciado: Brancas jogam e ganham material com um **garfo de cavalo**.
solucao: d5e7 g8f8 e7c8
dica: Procure uma casa de onde o cavalo ataque o rei e a dama ao mesmo tempo.
explicacao: 1.Ce7+ dá xeque e ataca a dama de c8 no mesmo lance. O rei é obrigado a sair do xeque (1...Rf8, atacando o cavalo, ou 1...Rh8), e 2.Cxc8 leva a dama. O cavalo ainda tem casas para voltar ao jogo.
```

## 6. Cavalo bom e cavalo ruim {#bom-mau}

Um cavalo é considerado **bom** quando:

- Está em uma casa central (d4, d5, e4, e5 ou casas próximas).
- Não pode ser expulso por peões adversários.
- Tem várias casas de destino possíveis.
- Ataca peças adversárias ou casas importantes.

Um cavalo é **ruim** quando:

- Está em a1, a8, h1 ou h8 (canto).
- Está bloqueado por peças próprias.
- Pode ser facilmente expulso por um peão adversário.
- Não consegue chegar em casas relevantes da posição.

Em jogo, o ideal é ficar com o seu cavalo bom contra o [bispo ruim](artigo:bispos) do adversário — um bispo travado pelos próprios peões. Por isso, não troque o seu cavalo bom pelo bispo ruim dele: deixe o adversário com a peça ruim. Esse tipo de detalhe decide finais.

## 7. Dicas práticas para usar bem o cavalo {#dicas}

1. **Cavalos antes dos bispos.** Na abertura, [desenvolva o cavalo primeiro](artigo:principios-de-abertura) (em c3 ou f3 para Brancas; c6 ou f6 para Pretas).
2. **Procure pontos fortes.** Casas que nenhum peão adversário consegue atacar são chamadas de "pontos fortes". Um cavalo num ponto forte avançado pode valer quase tanto quanto uma torre.
3. **Em posições fechadas, valorize seus cavalos.** Não troque um cavalo por um bispo se o jogo está fechado — o cavalo é melhor.
4. **Cuidado com cavalos na borda.** Um cavalo em a4, a5, h4 ou h5 controla só 4 casas e pode ser expulso por um peão, perdendo tempo.
5. **Aprenda os padrões de garfo.** Treine pelo menos 20-30 garfos de cavalo em puzzles. Eles aparecem em quase toda partida.

:::pratique Treine o cavalo na prática
Jogue contra o computador e foque em usar bem os cavalos. Tente fazer um garfo em cada partida — é um treino que rende muito.
:::

## Curiosidades sobre o cavalo

- Na notação em português o cavalo é **C**; em inglês, **N** (de *knight*, porque o K é do rei).
- Existe um problema matemático famoso chamado "passeio do cavalo": o cavalo precisa visitar todas as 64 casas exatamente uma vez. Já foi resolvido de várias formas.
- Um cavalo sozinho não consegue dar xeque-mate em um rei pelado. Precisa de pelo menos rei + cavalo + bispo (e mesmo assim é um dos finais mais difíceis).
- Os saltos do cavalo são os mais fáceis de esquecer no cálculo. Por isso vale treinar a visão dele.

## Perguntas frequentes {#faq "Perguntas frequentes"}

### Quantas casas o cavalo ataca?

Depende de onde ele está: até 8 casas no centro do tabuleiro, 6, 4 ou 3 perto das bordas e só 2 num canto. Por isso o cavalo costuma render mais no centro.

### O cavalo pode pular as peças?

Pode. Ele salta por cima de peças das duas cores; só não pode terminar o lance numa casa ocupada por uma peça da própria cor.

### O cavalo vale mais que o bispo?

Em pontos, os dois valem 3. Na prática, o cavalo costuma ser melhor em posições fechadas, com muitos peões travados, e o bispo, em posições abertas. [Veja o valor de cada peça](artigo:valor-das-pecas).
