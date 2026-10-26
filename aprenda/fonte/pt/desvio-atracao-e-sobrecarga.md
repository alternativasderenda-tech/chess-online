---
id: desvio-e-sobrecarga
titulo: Desvio, Atração e Sobrecarga no Xadrez
titulo_seo: Desvio, Atração e Sobrecarga no Xadrez | Xadrez Online
descricao: Desvio, atração e sobrecarga no xadrez: como tirar um defensor do lugar, puxar o rei para uma casa ruim e explorar uma peça com tarefas demais.
nivel: intermediario
ordem: 35
publicado: 2026-10-26
atualizado: 2026-10-26
tags: [desvio, atração, sobrecarga, deflexão, tática de xadrez, mate sufocado]
jogar: 3
relacionados: [taticas, garfo, mate-do-corredor, ataque-descoberto]
ensina: [Desvio, Atração, Sobrecarga]
---
**Desvio**, **atração** e **sobrecarga** são táticas que atacam os defensores em vez dos alvos. No desvio, você obriga uma peça defensora a sair da casa onde ela trabalha. Na atração, você obriga uma peça adversária (quase sempre o rei) a ir para uma casa ruim. Na sobrecarga, você explora uma peça que tem duas tarefas ao mesmo tempo e não consegue cumprir as duas.

## Por que atacar os defensores {#por-que "Por que atacar os defensores"}

Nas táticas básicas, como o [garfo](artigo:garfo) e a [cravada](artigo:cravada), você ataca diretamente o que quer ganhar. Mas muitas vezes o alvo está bem defendido. Aí a pergunta muda de "o que eu ataco?" para "**quem defende isso, e como eu tiro essa peça do caminho?**".

As três táticas deste artigo respondem a essa pergunta. Elas costumam vir com um **sacrifício** ou uma troca forçada: você entrega alguma coisa para que a peça adversária seja obrigada a se mover, e o golpe principal vem logo em seguida.

## Sobrecarga: a peça com trabalho demais {#sobrecarga "Sobrecarga"}

Uma peça está **sobrecarregada** quando defende duas coisas ao mesmo tempo. Se você atacar uma delas e a peça defensora capturar, a outra fica sem proteção.

```tabuleiro
fen: 6k1/3q1ppp/8/1b3n2/8/5Q2/5PPP/1R4K1 w - - 0 1
setas: b1b5 f3f5 d7b5:azul d7f5:azul
casas: d7:vermelha
legenda: A dama de d7 defende o bispo de b5 e o cavalo de f5. Depois de 1.Txb5 Dxb5 2.Dxf5, as Brancas ganham material.
```

Para encontrar sobrecargas, conte: para cada peça defensora do adversário, **quantas coisas ela protege?** Se a resposta for duas ou mais, há uma tática no ar. As peças sobrecarregadas mais comuns são a dama e as torres que guardam a última fileira.

## Desvio: tirar o defensor da casa {#desvio "Desvio"}

No **desvio** (em inglês, *deflection*), você força o defensor a sair do lugar com uma captura, uma troca ou um xeque. A diferença para a sobrecarga é sutil: na sobrecarga o defensor tem duas tarefas; no desvio, você simplesmente o obriga a ir embora, e o que ele protegia cai.

```tabuleiro
fen: 5rk1/5ppp/5n2/6N1/4P3/7Q/5PPP/6K1 w - - 0 1
setas: e4e5 f6h7:azul h3h7
casas: h7:vermelha f6
legenda: O cavalo de f6 é o defensor de h7. Com 1.e5, o peão ataca o cavalo: se ele deixar de defender h7, vem 2.Dxh7#.
```

O desvio mais comum é a troca com xeque: você captura uma peça que está protegida pelo defensor, ele é obrigado a recapturar, e a casa que ele vigiava fica livre.

Um parente próximo do desvio é a **eliminação do defensor**: em vez de obrigar o defensor a sair, você simplesmente o captura, mesmo que isso custe material (por exemplo, entregar uma torre por um cavalo). Se o que ele defendia vale mais do que você entregou, ou se a captura abre caminho para um mate, a troca compensa.

## Atração: puxar a peça para a casa ruim {#atracao "Atração"}

Na **atração** (em inglês, *decoy*), em vez de tirar uma peça de onde ela está, você a **puxa** para uma casa específica, onde ela vai sofrer um garfo, um espeto ou um mate. O alvo mais comum é o rei, atraído por um sacrifício com xeque.

```tabuleiro
fen: 1k2q3/1pp2ppp/3p4/1N6/8/8/5PPP/R5K1 w - - 0 1
setas: a1a8:vermelha b5c7
casas: a8 c7
legenda: 1.Ta8+! Rxa8 (forçado) puxa o rei para a8, e 2.Cxc7+ garfa o rei e a dama de e8.
```

O exemplo mais famoso de atração é o **mate sufocado**: a dama se sacrifica numa casa vizinha ao rei, uma torre adversária é obrigada a capturá-la e acaba tampando a última saída do próprio rei. O cavalo dá o mate. Você vai resolver um desses no último exercício.

:::dica
**💡 Dica:** quando um golpe "quase funciona", pergunte qual peça adversária está estragando o seu plano. Se você conseguir desviá-la, atraí-la ou sobrecarregá-la, o golpe passa a funcionar.
:::

## Passo a passo: como pensar {#passo-a-passo "Passo a passo"}

Essas táticas são mais difíceis de enxergar que um garfo, porque o primeiro lance quase nunca parece bom: muitas vezes é uma troca que perde tempo ou um sacrifício. Um roteiro ajuda:

1. **Encontre o alvo.** O que você gostaria de capturar, ou onde gostaria de dar mate?
2. **Liste os defensores.** Quais peças adversárias impedem o golpe? Se só uma impede, ela é a chave.
3. **Conte as tarefas dessa peça.** Se ela já defende outra coisa, você pode ter uma sobrecarga: ataque a outra coisa.
4. **Procure lances forçantes contra ela.** Uma captura que ela precise recapturar, um xeque que a obrigue a se mexer, um sacrifício numa casa que só ela pode ocupar.
5. **Verifique a resposta.** Depois do seu lance, o adversário é mesmo obrigado a responder como você quer? Se ele tiver uma alternativa tranquila, a tática não funciona.

O último passo é o que separa a tática de uma aposta. Nos exercícios abaixo, a resposta do adversário é forçada ou é a melhor que ele tem.

## Como se defender {#defesa "Como se defender"}

- **Não deixe uma peça só defendendo duas coisas.** Distribua as tarefas entre várias peças.
- **Desconfie dos sacrifícios com xeque**: antes de capturar, pergunte para onde a captura leva a sua peça.
- **Cuide da última fileira.** Torres e damas que a defendem costumam ser as primeiras vítimas de sobrecarga; uma "janela" para o rei (um peão avançado na frente dele) alivia essa tarefa. Veja o [mate do corredor](artigo:mate-do-corredor).

:::pratique Treine desvio e sobrecarga agora
Jogue contra o computador no nível Difícil e, a cada lance dele, pergunte quais peças dele estão defendendo duas coisas. É um ótimo exercício de visão tática.
:::

## Exercícios {#exercicios "Exercícios"}

```exercicio
fen: 3r2k1/ppq2ppp/8/3b4/8/6P1/QP3P1P/4R1K1 w - - 0 1
enunciado: Brancas jogam e **ganham uma peça**. A torre de d8 tem trabalho demais.
solucao: a2d5
dica: A torre de d8 defende o bispo de d5 e também a oitava fileira.
explicacao: 1.Dxd5! ganha o bispo, porque 1...Txd5?? deixaria a oitava fileira sem defesa: 2.Te8#. A torre estava sobrecarregada.
```

```exercicio
fen: 4r1k1/pp1q1ppp/8/8/2Pn4/7P/PP3QP1/4R1K1 w - - 0 1
enunciado: Brancas jogam e **ganham uma peça** desviando o defensor.
solucao: e1e8 d7e8 f2d4
dica: Quem defende o cavalo de d4? Faça essa peça ir para outro lugar.
explicacao: A dama de d7 é a única defensora do cavalo. 1.Txe8+ Dxe8 obriga a dama a recapturar em e8, longe da coluna d, e 2.Dxd4 ganha o cavalo. Começar com 1.Dxd4? seria um erro: 1...Txe1+ ganharia a torre branca.
```

```exercicio
fen: r4r1k/pp4pp/1q5N/8/2Q5/8/PP3PPP/6K1 w - - 0 1
enunciado: Brancas jogam e dão **mate em 2** com uma atração.
tipo: mate
lances: 2
solucao: c4g8 f8g8 h6f7
dica: O rei preto não pode capturar em g8, porque o cavalo de h6 vigia essa casa. Quem pode?
explicacao: 1.Dg8+!! obriga 1...Txg8 (o rei não pode capturar). A torre atraída para g8 tampa a última casa do rei, e 2.Cf7# é o mate sufocado.
```

## Perguntas frequentes {#faq "Perguntas frequentes"}

### Qual a diferença entre desvio e atração?

No desvio, você tira um defensor da casa onde ele está. Na atração, você puxa uma peça adversária para uma casa específica, onde ela vai sofrer o golpe.

### O que é uma peça sobrecarregada?

É uma peça que defende duas coisas ao mesmo tempo. Basta atacar uma delas: se a peça sobrecarregada capturar, a outra fica sem proteção.

### O que é mate sufocado?

É o mate dado por um cavalo num rei cercado pelas próprias peças, sem nenhuma casa livre. Muitas vezes ele nasce de uma atração com sacrifício de dama.

### Essas táticas são para qual nível?

Elas são o passo seguinte depois de garfo, cravada e espeto. Exigem calcular dois ou três lances, por isso aparecem no fim da trilha de [táticas de xadrez](artigo:taticas).
