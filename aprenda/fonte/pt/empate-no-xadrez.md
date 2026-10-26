---
id: empates
titulo: "Empate no Xadrez: Todas as Formas de Empatar"
titulo_seo: "Empate no Xadrez: Todas as Regras | Xadrez Online"
descricao: Todas as formas de empate no xadrez pela FIDE — acordo, afogamento, repetição tripla, regra dos 50 lances e material insuficiente — com exercícios.
nivel: iniciante
ordem: 60
publicado: 2026-10-26
atualizado: 2026-10-26
tags: [empate no xadrez, afogamento, repetição tripla, regra dos 50 lances, material insuficiente, xeque perpétuo]
jogar: 2
relacionados: [xeque-mate-e-afogamento, mates-basicos, finais-de-peao, regras, ritmos-de-jogo]
ensina: [Afogamento, Repetição tripla, Regra dos 50 lances, Material insuficiente, Xeque perpétuo]
---
Um **empate** no xadrez é o resultado em que nenhum jogador vence: cada um recebe meio ponto. Pelas [regras da FIDE](artigo:regras#empates), a partida empata por **acordo entre os jogadores**, por **afogamento**, por **repetição tripla** da mesma posição, pela **regra dos 50 lances** ou quando nenhum lado consegue mais dar xeque-mate, como no caso de **material insuficiente**. Conhecer essas regras ajuda quem está ganhando a não deixar a vitória escapar, e quem está perdendo a encontrar uma salvação.

## 1. Empate por acordo {#acordo "1. Acordo"}

É o jeito mais simples: um jogador propõe o empate e o outro aceita. Numa partida presencial, o correto é fazer o seu lance, propor o empate e só então apertar o relógio. O adversário pode aceitar, recusar com palavras ou simplesmente recusar jogando o lance dele.

Alguns torneios proíbem acordos antes de um certo número de lances, para evitar "empates de salão". Online, a proposta é feita por um botão.

## 2. Afogamento {#afogamento "2. Afogamento"}

Se o jogador da vez **não está em xeque** e **não tem nenhum lance legal**, a partida termina empatada na hora. É o empate que mais pega iniciantes de surpresa, porque costuma acontecer quando um lado tem enorme vantagem.

```tabuleiro
fen: k7/P7/K7/8/8/8/8/8 b - - 0 1
casas: a8:amarela b8:vermelha b7:vermelha
legenda: As Pretas jogam e não têm lance: b8 é atacada pelo peão de a7, b7 pelo rei branco, o peão de a7 está protegido pelo rei branco, e o rei preto não está em xeque. Afogamento.
```

Este exemplo é clássico: com [rei e peão da coluna a (ou h) contra rei](artigo:finais-de-peao), quando o rei adversário chega ao canto, muitas vezes não há como vencer. Veja mais em [xeque, xeque-mate e afogamento](artigo:xeque-mate-e-afogamento).

## 3. Material insuficiente {#material "3. Material insuficiente"}

Pelas [Leis do Xadrez da FIDE](https://handbook.fide.com/chapter/E012023), a partida termina empatada quando a posição fica **morta**: nenhuma sequência de lances legais permitiria a qualquer um dos lados dar xeque-mate. Os casos mais comuns:

- **Rei contra rei.**
- **Rei e bispo contra rei.**
- **Rei e cavalo contra rei.**
- **Rei e bispo contra rei e bispo**, com os dois bispos em casas da mesma cor.

```tabuleiro
fen: 8/8/4k3/8/8/2B5/8/4K3 w - - 0 1
legenda: Rei e bispo contra rei: não existe nenhuma posição de mate possível. A partida termina empatada.
```

Atenção a um caso que confunde: com **dois cavalos** contra o rei sozinho, não se consegue *forçar* o mate, mas um mate ainda é possível se o defensor errar. Por isso a partida não termina sozinha; ela costuma acabar empatada por acordo ou pela regra dos 50 lances.

## 4. Repetição tripla {#repeticao "4. Repetição tripla"}

Se a **mesma posição** aparecer **três vezes** na partida, o jogador da vez pode pedir o empate. "Mesma posição" quer dizer: as mesmas peças nas mesmas casas, com o mesmo jogador a mover e os mesmos direitos de roque e de captura en passant. As repetições **não precisam ser seguidas**.

Pelas regras da FIDE, na repetição tripla o empate precisa ser **pedido**; se a mesma posição aparecer **cinco vezes**, o empate é automático. Online, o sistema costuma cuidar disso sozinho.

### O xeque perpétuo

O **xeque perpétuo** não é uma regra separada: é quando um jogador dá xeques sem parar e o adversário não consegue escapar deles. Como as posições se repetem, a partida acaba empatada por repetição (ou por acordo). É a salvação clássica de quem está perdendo material, mas tem uma dama ativa perto do rei adversário. Veja um exemplo no primeiro exercício abaixo.

## 5. Regra dos 50 lances {#regra-50 "5. Regra dos 50 lances"}

Se os dois jogadores fizerem **50 lances cada** sem nenhuma **captura** e sem nenhum **movimento de peão**, a partida pode ser declarada empatada a pedido de um jogador. Depois de 75 lances de cada lado nas mesmas condições, o empate é automático.

A regra existe para que ninguém fique jogando para sempre numa posição sem progresso. Na prática, ela importa em finais: quem está ganhando precisa conhecer o método de mate (veja os [mates básicos](artigo:mates-basicos)) para não estourar o limite.

## 6. Tempo esgotado sem material para o mate {#tempo "6. Tempo e material"}

Em partidas com relógio, quem deixa o tempo acabar perde. Mas há uma exceção: se o adversário **não tiver como dar mate** de jeito nenhum (por exemplo, se ele só tiver o rei), a partida termina empatada. Sobre os ritmos de jogo, veja [clássico, rápido, blitz e bullet](artigo:ritmos-de-jogo).

## Quando o empate é um bom resultado {#bom-resultado "Quando o empate é bom"}

Empatar não é o mesmo que desistir. Num torneio, meio ponto numa partida perdida é meio ponto a mais na tabela. Por isso vale guardar duas atitudes opostas:

- **Quem está ganhando** precisa evitar o empate: cuidado com o afogamento, não deixe a dama adversária dar xeque perpétuo no seu rei e converta a vantagem antes que a regra dos 50 lances apareça.
- **Quem está perdendo** deve procurar o empate antes de abandonar: um xeque perpétuo, um afogamento forçado, trocar a última peça com que o adversário poderia dar mate. Muitas partidas "perdidas" terminam empatadas porque o defensor continuou procurando.

Os exercícios a seguir treinam os dois lados.

## Exercícios {#exercicios "Exercícios"}

```exercicio
fen: 6k1/6p1/5p2/8/8/1q6/2r1QPPP/6K1 w - - 0 1
enunciado: As Brancas estão com uma torre a menos e a dama atacada. Encontre os xeques que salvam a partida com **xeque perpétuo**.
tipo: tatica
solucao: e2e8 g8h7 e8h5
dica: Comece com um xeque pela 8ª fileira. Para onde o rei preto pode ir? E de lá, qual é o próximo xeque?
explicacao: 1.De8+ Rh7 2.Dh5+ Rg8 3.De8+ — o rei preto só tem uma casa a cada xeque, e as peças pretas não conseguem se colocar no caminho. As Brancas repetem os xeques e a partida empata por repetição.
```

```exercicio
fen: k7/p2Q4/P6r/8/8/8/6PP/1R4NK b - - 0 1
enunciado: As Pretas estão perdidas: as Brancas ameaçam mate. Mas o rei preto não tem nenhum lance. Encontre o lance que salva a partida.
tipo: tatica
solucao: h6h2
dica: Se a torre preta sumir do tabuleiro, as Pretas ficam sem lances legais. Como obrigar as Brancas a capturá-la?
explicacao: 1...Txh2+! — o rei branco é obrigado a capturar (2.Rxh2), porque g1 e g2 estão ocupadas pelas próprias peças. Depois disso, as Pretas não têm nenhum lance e não estão em xeque: é afogamento, e a partida empata.
```

```exercicio
fen: 5K1k/Q7/8/8/8/8/8/8 w - - 0 1
enunciado: Agora o contrário: as Brancas estão ganhando. Dê **mate em 1** e não afogue o rei preto.
tipo: mate
lances: 1
solucao: a7g7
dica: Qual casa perto do rei preto está protegida pelo rei branco?
explicacao: 1.Dg7# — a dama dá xeque colada no rei, protegida pelo rei de f8. Já 1.Df7?? tira todas as casas do rei preto sem dar xeque: afogamento.
```

## Perguntas frequentes {#faq "Perguntas frequentes"}

### Quais são as formas de empate no xadrez?

Acordo entre os jogadores, afogamento, repetição tripla da posição, regra dos 50 lances e posição morta (material insuficiente). Também há empate quando um jogador fica sem tempo e o adversário não tem como dar mate.

### Rei e torre contra rei é empate?

Não. Rei e torre contra rei é vitória, assim como rei e dama contra rei. Empatam rei e bispo, ou rei e cavalo, contra rei sozinho.

### O que é xeque perpétuo?

É uma série de xeques da qual o rei não consegue escapar. Como a posição se repete, a partida empata.

### Na repetição tripla, as posições precisam ser seguidas?

Não. Basta a mesma posição aparecer três vezes na partida, com o mesmo jogador a mover e os mesmos direitos de roque e en passant.

### Quanto vale um empate num torneio?

Normalmente meio ponto para cada jogador (a vitória vale 1 e a derrota, 0).

:::pratique Pratique finais com o computador
Jogue contra o computador no nível Médio. Quando estiver ganhando, cuidado com o afogamento; quando estiver perdendo, procure um xeque perpétuo antes de abandonar.
:::
