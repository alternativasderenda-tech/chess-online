---
id: ataque-descoberto
titulo: Ataque Descoberto e Xeque Duplo no Xadrez
titulo_seo: Ataque Descoberto e Xeque Duplo | Xadrez Online
descricao: O que é ataque descoberto, xeque descoberto e xeque duplo no xadrez, por que o xeque duplo é a tática mais forçante e 4 exercícios interativos.
nivel: intermediario
ordem: 30
publicado: 2026-10-26
atualizado: 2026-10-26
tags: [ataque descoberto, xeque descoberto, xeque duplo, tática de xadrez, bateria]
jogar: 2
relacionados: [taticas, garfo, desvio-e-sobrecarga, sacrificios, calculo]
ensina: [Ataque descoberto, Xeque descoberto, Xeque duplo]
---
O **ataque descoberto** acontece quando uma peça se move e, ao sair do caminho, abre a linha de outra peça de longo alcance (bispo, torre ou dama) que estava atrás dela. Se a linha aberta ataca o rei, é um **xeque descoberto**. Se a peça que se moveu também dá xeque, o rei recebe dois xeques ao mesmo tempo: é o **xeque duplo**, a tática mais forçante do xadrez.

## Como funciona o ataque descoberto {#como-funciona "Como funciona"}

O ataque descoberto precisa de duas peças da mesma cor alinhadas com um alvo:

1. uma **peça de trás**, de longo alcance, apontando para o alvo;
2. uma **peça da frente**, que bloqueia essa linha e vai se mover.

O segredo é que o lance da peça da frente cria **duas ameaças de uma vez**: a ameaça revelada pela peça de trás e o que a própria peça da frente fizer (capturar, dar xeque, atacar outra peça). O adversário só responde a uma delas.

```tabuleiro
fen: 3q2k1/5ppp/8/8/8/3B4/5PPP/3R2K1 w - - 0 1
setas: d3h7 d1d8:vermelha
casas: d8:vermelha
legenda: O bispo de d3 está na frente da torre de d1. Se ele sair com 1.Bxh7+, a torre passa a atacar a dama de d8, e as Pretas precisam primeiro cuidar do xeque.
```

## Xeque descoberto {#xeque-descoberto "Xeque descoberto"}

Quando a peça de trás aponta para o **rei**, qualquer lance da peça da frente dá xeque. Isso dá uma liberdade enorme: a peça da frente pode capturar algo protegido, ir para uma casa atacada ou buscar uma peça longe, porque o adversário terá de responder ao xeque antes de qualquer coisa.

```tabuleiro
fen: r3k3/8/8/8/4B3/8/5PPP/4R1K1 w - - 0 1
setas: e4a8 e1e8:vermelha
casas: e8:vermelha a8
legenda: Com 1.Bxa8+, o bispo captura a torre de a8 e abre a coluna e: a torre de e1 dá xeque descoberto.
```

## Xeque duplo {#xeque-duplo "Xeque duplo"}

No xeque duplo, a peça que se move **também** dá xeque. O rei fica atacado por duas peças ao mesmo tempo, e isso muda as regras do jogo para o defensor:

- não dá para **capturar** os dois atacantes com um lance só;
- não dá para **bloquear** duas linhas com uma peça só;
- a única defesa é **mover o rei**.

Por isso o xeque duplo é tão perigoso: se o rei não tiver casa livre, é mate, mesmo que as peças que dão xeque estejam soltas.

```tabuleiro
fen: 4k3/8/5N2/8/8/8/5PPP/4R1K1 b - - 0 1
setas: e1e8:vermelha f6e8:vermelha
casas: e8:vermelha
legenda: Depois de Cf6+, o rei de e8 recebe xeque da torre e do cavalo ao mesmo tempo. Só o rei pode se mexer.
```

## Baterias: como preparar o golpe {#baterias "Baterias"}

Quando duas peças da mesma cor estão alinhadas na mesma linha, forma-se uma **bateria**. Uma bateria com uma peça própria na frente é um ataque descoberto esperando para acontecer. Na prática:

- **Torre ou dama atrás de um cavalo ou bispo**, apontando para o rei ou para a dama adversária, é o desenho mais comum.
- **Bispo atrás de um cavalo** numa diagonal longa (por exemplo, bispo em b2 e cavalo em e5, apontando para h8) gera xeques descobertos e duplos muito fortes.
- Procure também **baterias do adversário**: a peça da frente dele pode sair a qualquer momento.

:::dica
**💡 Dica:** quando tiver um xeque descoberto disponível, não se apresse. Pergunte "qual é o lance mais forte da peça da frente?". Muitas vezes ela pode capturar a dama, dar um segundo xeque ou ir buscar algo do outro lado do tabuleiro.
:::

## O moinho {#moinho "O moinho"}

O caso mais espetacular de xeque descoberto é o **moinho**. Ele acontece quando uma torre e um bispo (ou uma dama) se revezam nos xeques contra um rei encurralado:

1. a torre dá xeque direto e o rei só tem uma casa;
2. o rei vai para essa casa, que está na linha do bispo;
3. a torre sai capturando alguma peça com **xeque descoberto** do bispo;
4. o rei volta para a casa anterior, e a torre retorna dando xeque direto.

A cada volta, a torre come uma peça, e o adversário não pode fazer nada além de mexer o rei para lá e para cá. O desenho típico é o rei preto entre g8 e h8, um bispo branco na grande diagonal e uma torre branca na sétima fileira. Quando você vir esse desenho, [conte quantas peças a torre consegue recolher](artigo:calculo) antes de sair.

## Erros comuns {#erros "Erros comuns"}

- **Usar o xeque descoberto cedo demais.** A peça da frente só tem uma chance de se mover com o xeque. Se ela não ganhar nada, o adversário sai do xeque e a bateria acaba.
- **Esquecer a peça da frente.** Muita gente só olha para a ameaça revelada. Às vezes o melhor é a peça da frente capturar a dama do adversário enquanto ele cuida do xeque.
- **Ignorar a bateria do adversário** só porque há uma peça dele no meio da linha.

## Como se defender {#defesa "Como se defender"}

- **Fique atento às linhas que apontam para o seu rei e a sua dama**, mesmo quando há uma peça adversária no meio: essa peça pode sair a qualquer lance.
- **Quebre a bateria** atacando ou trocando a peça da frente antes que ela se mova.
- **Deixe casas de fuga para o rei.** Contra o xeque duplo, ter para onde ir é a única defesa.

:::pratique Treine o ataque descoberto agora
Jogue contra o computador procurando formar baterias com torre e bispo. No nível Médio ele nem sempre percebe a peça que vai sair da frente.
:::

## Exercícios de ataque descoberto {#exercicios "Exercícios"}

```exercicio
fen: rnbqkb1r/pppp2pp/8/8/4N3/8/PPPP1PPP/R1B1R1K1 w - - 0 1
enunciado: Brancas jogam e dão **mate em 1** com um xeque duplo.
tipo: mate
lances: 1
solucao: e4d6
dica: Se o cavalo sair de e4, a torre de e1 dá xeque. Para qual casa ele deve ir para dar xeque também?
explicacao: 1.Cd6# é xeque duplo: a torre ataca pela coluna e e o cavalo ataca de d6. O rei não tem casa: d8 e f8 estão ocupadas, d7 tem um peão, e7 é atacada pela torre e f7 pelo cavalo.
```

```exercicio
fen: r4rk1/pp3ppp/2pqbn2/8/8/2NB4/PPP2PPP/R2Q1RK1 w - - 0 1
enunciado: Brancas jogam e **ganham a dama** com um ataque descoberto.
solucao: d3h7 g8h7 d1d6
dica: A dama branca e a dama preta estão na mesma coluna, com o seu bispo no meio.
explicacao: 1.Bxh7+ captura um peão com xeque e abre a coluna d. As Pretas precisam cuidar do rei (1...Rxh7, ou 1...Cxh7) e 2.Dxd6 captura a dama.
```

```exercicio
fen: r2q1r1k/pp5p/2p3p1/4N3/8/8/PBP2PPP/R4RK1 w - - 0 1
enunciado: Brancas jogam e dão **mate em 2**. O bispo de b2 já mira o rei.
tipo: mate
lances: 2
solucao: e5f7 h8g8 f7h6
dica: Um lance do cavalo dá xeque duplo. Depois, ele mesmo fecha a rede.
explicacao: 1.Cf7+ é xeque duplo (bispo de b2 e cavalo de f7): o rei só tem g8. Então 2.Ch6# — o cavalo dá xeque, o bispo controla g7 e h8, o cavalo cobre f7 e as outras casas estão ocupadas.
```

```exercicio
fen: rnb1kb1r/pp3ppp/2p5/4q3/4n3/3Q4/PPPB1PPP/2KR1BNR w kq - 0 9
enunciado: Uma das miniaturas mais famosas da história (Réti x Tartakower, Viena, 1910). Brancas jogam e dão **mate em 3**.
tipo: mate
lances: 3
solucao: d3d8 e8d8 d2g5 d8c7 g5d8
dica: A torre de d1 e o bispo de d2 formam uma bateria. Para ela disparar, o rei preto precisa estar em d8.
explicacao: 9.Dd8+!! Rxd8 (forçado) 10.Bg5+ é xeque duplo: bispo de g5 e torre de d1. Se 10...Re8, 11.Td8#. Na partida veio 10...Rc7 11.Bd8#.
```

## Perguntas frequentes {#faq "Perguntas frequentes"}

### Qual a diferença entre ataque descoberto e xeque descoberto?

O ataque descoberto é qualquer ataque revelado quando uma peça sai da frente de outra. Se o alvo revelado for o rei, ele se chama xeque descoberto.

### Por que o xeque duplo é tão forte?

Porque a única defesa é mover o rei. Não dá para capturar nem bloquear dois atacantes com um lance só, então o xeque duplo funciona mesmo quando as peças que o dão estão desprotegidas.

### Quais peças podem fazer o ataque descoberto?

A peça de trás tem de ser de longo alcance: bispo, torre ou dama. A peça da frente pode ser qualquer uma, inclusive um peão ou o rei.

### Como treinar?

Resolva exercícios e, nas partidas, procure linhas que apontam para o rei ou a dama adversária com uma peça sua no meio. O mapa geral está em [táticas de xadrez](artigo:taticas).
