---
id: analisar-partidas
titulo: Como Analisar Suas Partidas de Xadrez
descricao: Um método em 6 passos para revisar suas partidas de xadrez, achar o erro decisivo, entender por que ele aconteceu e transformar derrotas em evolução.
nivel: intermediario
ordem: 70
publicado: 2026-10-26
atualizado: 2026-10-26
tags: [analisar partidas, análise de xadrez, erro decisivo, revisar partidas, replay, como melhorar no xadrez, momento crítico]
jogar: 2
relacionados: [taticas, calculo, relogio-e-psicologia, rotina-de-treino, erros-de-iniciante]
ensina: [Análise de partidas, Erro decisivo, Momento crítico, Checklist de lances]
---
Analisar uma partida de xadrez é revê-la lance a lance, depois que ela acabou, para descobrir onde a avaliação mudou: o momento em que uma posição boa ou igual virou perdida. O objetivo não é listar todos os erros, mas achar o **erro decisivo** e entender **por que** você o cometeu, seja uma ameaça que não viu, uma conta errada, um plano ruim ou a pressão do relógio. É o hábito que mais separa quem melhora de quem só acumula partidas.

## Por que analisar, e por que logo depois de jogar {#por-que "Por que analisar"}

Jogar muitas partidas sem revisar é repetir os mesmos erros mais rápido. A análise transforma cada derrota numa lição concreta, e cada vitória apertada num alerta.

Faça a revisão **logo depois da partida**, enquanto você ainda lembra do que estava pensando. Esse é o dado mais valioso: o motor mostra o lance certo, mas só você sabe por que escolheu o errado.

## O método em 6 passos {#metodo "O método em 6 passos"}

### 1. Recupere os lances

Sem os lances, não há análise. Anote a partida num caderno ou num arquivo. No Xadrez Online, ao fim de cada partida, o botão **Ver Replay** abre uma barra com os controles ⏮ ◀ ▶ ⏭: você volta ao início e avança lance a lance. No ranking, na aba **Vitória mais rápida**, as partidas dos três primeiros de cada nível também têm o botão de replay, um bom material para ver como jogadores fortes venceram.

### 2. Reveja primeiro sem motor

Passe pela partida inteira **sem ajuda do computador** e marque:

- os lances em que você pensou muito tempo;
- os momentos em que o material mudou;
- os lances em que você mudou de plano ou se sentiu perdido.

Para cada marca, escreva em uma frase o que você pensava na hora. Só depois confira com o motor.

### 3. Ache o momento crítico e o erro decisivo

**Momento crítico** é uma posição em que a escolha importa muito: há um lance bom e vários ruins, ou uma decisão que muda o tipo de partida (trocar damas, abrir o centro, ir para o final). O **erro decisivo** é o lance depois do qual a partida não tinha mais salvação. Os dois costumam estar perto um do outro: em muitas partidas, tudo se decide em dois ou três lances.

Uma dica prática: procure o **último momento em que a posição ainda era defensável**. O lance seguinte é, quase sempre, o erro decisivo.

### 4. Classifique o erro

Dê um nome ao erro. Os tipos mais comuns:

- **[Tático](artigo:taticas):** você não viu uma ameaça, um garfo, uma cravada, um xeque.
- **De [cálculo](artigo:calculo):** você viu a ideia, mas errou a conta no fim da variante.
- **Estratégico:** plano errado, troca ruim, peça mal colocada por muitos lances.
- **De tempo:** pouco tempo no relógio levou a um lance apressado.
- **Psicológico:** relaxou quando estava ganhando, ou se desesperou quando estava perdendo.

Depois de algumas semanas, os nomes se repetem. É aí que você descobre [o que treinar](artigo:rotina-de-treino).

### 5. Use o motor para confirmar, não para pensar por você

O motor diz **qual** lance era melhor, não **por quê**. Para cada erro que ele apontar, tente explicar a ideia do lance certo com as suas palavras. Se não conseguir, jogue a variante no tabuleiro até entender. Uma avaliação que você não entende não ensina nada.

### 6. Registre uma lição

Feche cada análise com uma frase: "na posição X, eu devia ter feito Y, porque Z". Guarde as frases num caderno de erros e releia antes de jogar. Uma lição por partida, durante meses, vale mais que dez partidas revisadas pela metade.

## O checklist que evita o erro decisivo {#checklist "O checklist de cada lance"}

Boa parte dos erros decisivos falha num [teste simples](artigo:erros-de-iniciante#habito), que vale fazer **antes** de cada lance na partida e **em cada lance suspeito** na análise:

1. **Xeques:** quais xeques o adversário tem depois do meu lance?
2. **Capturas:** quais peças minhas ficam atacadas ou sem defesa?
3. **Ameaças:** o que o último lance do adversário quer fazer?

Os três exemplos abaixo mostram erros que esse checklist teria evitado.

## Exemplo 1: o erro que não é o primeiro {#exemplo-abertura "Exemplo 1: na abertura"}

Depois de 1.e4 e5 2.Cf3 f6?, as Pretas já jogaram mal: o lance enfraquece o rei e tira a melhor casa do cavalo de g8. Mas a partida ainda não está perdida. O momento crítico vem depois de 3.Cxe5!.

```tabuleiro
fen: rnbqkbnr/pppp2pp/5p2/4N3/4P3/8/PPPP1PPP/RNBQKB1R b KQkq - 0 3
setas: d8e7 f6e5:vermelha
legenda: Depois de 3.Cxe5, o momento crítico: 3...De7 limita o prejuízo; 3...fxe5? é o erro decisivo.
```

Aqui, 3...De7 ataca o cavalo e, por trás dele, o peão e4. Depois de 4.Cf3 Dxe4+ 5.Be2, as Pretas recuperam o peão, ainda que atrasadas no desenvolvimento. Já o natural 3...fxe5? abre a diagonal e8–h5 para a dama branca.

```exercicio
fen: rnbqkbnr/pppp2pp/8/4p3/4P3/8/PPPP1PPP/RNBQKB1R w KQkq - 0 4
enunciado: As Pretas acabam de jogar 3...fxe5?. Puna o erro: ache o xeque que ganha material.
solucao: d1h5 g7g6 h5e5
dica: A diagonal entre h5 e e8 ficou aberta. Depois do xeque, procure um ataque duplo.
explicacao: 4.Dh5+! g6 5.Dxe5+ — a dama dá xeque e ataca a torre de h8 ao mesmo tempo. Se 4...Re7, 5.Dxe5+ Rf7 6.Bc4+ e o rei preto fica exposto a um ataque muito forte.
```

A lição para quem perdeu com as Pretas não é "não jogue 2...f6", que é o erro óbvio. É "antes de capturar, confira os xeques do adversário", o passo 1 do checklist.

## Exemplo 2: o erro escondido num lance natural {#exemplo-tatica "Exemplo 2: o lance natural"}

Na Defesa Petrov, depois de 1.e4 e5 2.Cf3 Cf6 3.Cxe5 Cxe4? (o certo é 3...d6), as Brancas jogam 4.De2!, atacando o cavalo de e4.

```tabuleiro
fen: rnbqkb1r/pppp1ppp/8/4N3/4n3/8/PPPPQPPP/RNB1KB1R b KQkq - 1 4
setas: d8e7 e2e4:vermelha
legenda: Depois de 4.De2, a dama ataca o cavalo de e4. Se ele sair da coluna e, o cavalo branco de e5 fica livre para dar xeque descoberto.
```

A melhor defesa é 4...De7, que custa só um peão: 5.Dxe4 d6 6.d4 dxe5 7.dxe5. O recuo natural do cavalo, porém, perde a partida.

```exercicio
fen: rnbqkb1r/pppp1ppp/5n2/4N3/8/8/PPPPQPPP/RNB1KB1R w KQkq - 2 5
enunciado: As Pretas recuaram 4...Cf6??. Brancas jogam e ganham a dama.
solucao: e5c6
dica: O cavalo de e5 está na frente da dama, na coluna do rei preto. Para onde ele pode ir para atacar outra peça?
explicacao: 5.Cc6+! — xeque descoberto da dama de e2, e o cavalo ataca a dama de d8. As Pretas têm de sair do xeque e perdem a dama.
```

Repare que 3...Cxe4 foi um erro, mas o **erro decisivo** foi 4...Cf6. Na análise, separar os dois é importante: o primeiro é um problema de teoria de abertura; o segundo, de checklist.

## Exemplo 3: o erro decisivo num final {#exemplo-final "Exemplo 3: no final"}

Nos finais, o erro decisivo costuma ser silencioso: um lance de rei que parece igual aos outros. Nesta posição, as Pretas têm a vez e só um lance empata.

```exercicio
fen: 8/8/4k3/8/3K4/4P3/8/8 b - - 0 1
enunciado: Pretas jogam e empatam. Qual é o único lance?
solucao: e6d6
dica: Pense em oposição: fique frente a frente com o rei branco e deixe a vez para ele.
explicacao: 1...Rd6! toma a oposição e o rei branco não consegue avançar. Qualquer outro lance perde: por exemplo, 1...Re7? 2.Rd5! ou 2.Re5!, e o rei branco chega a uma casa-chave do peão (d5, e5 ou f5).
```

```tabuleiro
fen: 8/4k3/8/8/3K4/4P3/8/8 w - - 1 2
setas: d4d5 d4e5
legenda: Depois do erro 1...Re7?, as Brancas ganham com 2.Rd5 ou 2.Re5: o rei chega a uma casa-chave e o peão vai promover.
```

Na revisão, um erro assim só aparece se você conhece a técnica. É por isso que estudar [finais de rei e peão](artigo:finais-de-peao) melhora também a sua análise.

## Erros comuns ao analisar {#erros-comuns "Erros comuns ao analisar"}

- **Ligar o motor no primeiro lance.** Você vê setas e números, mas não aprende o que estava errado no seu raciocínio.
- **Analisar só as derrotas.** Vitórias apertadas também têm erros decisivos que o adversário não puniu.
- **Culpar só o último erro.** O lance que perdeu a dama pode ser consequência de uma posição ruim criada dez lances antes.
- **Revisar e não registrar.** Sem uma lição anotada, a análise se perde até a próxima partida.
- **Ignorar o relógio.** Se o erro veio com pouco tempo, o problema pode ser a [gestão do tempo](artigo:relogio-e-psicologia), não o xadrez. Escolher o [ritmo de jogo](artigo:ritmos-de-jogo) certo para treinar também ajuda.

:::pratique Jogue, revise e jogue de novo
Jogue uma partida contra o computador, use o Ver Replay ao fim e aplique os 6 passos. Depois, jogue de novo a mesma abertura e veja se a lição ficou.
:::

## Perguntas frequentes {#faq "Perguntas frequentes"}

### Quanto tempo devo gastar analisando uma partida?

Para partidas rápidas, de 10 a 15 minutos bastam: ache o momento crítico, o erro decisivo e registre a lição. Partidas longas merecem uma revisão mais detalhada.

### Devo usar o motor de xadrez?

Sim, mas só depois da sua própria revisão. Use-o para confirmar o que você achou e para encontrar o que passou despercebido, sempre tentando entender a ideia do lance que ele sugere.

### Como achar o erro decisivo?

Procure o último momento em que a posição ainda era defensável. O lance seguinte quase sempre é o erro decisivo. No motor, é onde a avaliação despenca.

### Como ver o replay das minhas partidas no Xadrez Online?

Ao fim de cada partida, clique em Ver Replay e use os botões para avançar ou voltar lance a lance. No ranking, as três vitórias mais rápidas de cada nível também têm replay.
