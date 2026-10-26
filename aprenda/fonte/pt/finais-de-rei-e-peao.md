---
id: finais-de-peao
titulo: Finais de Rei e Peão: Oposição, Quadrado e Rei Ativo
descricao: Como jogar finais de rei e peão: oposição, casas-chave, regra do quadrado, peão da torre, peão passado e rei ativo, com exercícios conferidos.
nivel: intermediario
ordem: 65
publicado: 2026-10-26
atualizado: 2026-10-26
tags: [finais de peão, final de rei e peão, oposição, regra do quadrado, casas-chave, peão passado, zugzwang, finais de xadrez]
jogar: 3
relacionados: [finais-de-torre, mates-basicos, empates, calculo, analisar-partidas]
ensina: [Oposição, Casas-chave, Regra do quadrado, Peão passado, Rei ativo]
---
Um final de rei e peão é a fase da partida em que só restam reis e peões no tabuleiro. O resultado depende de três ideias: a **oposição** (quem tem de ceder passagem quando os reis ficam frente a frente), a **regra do quadrado** (se um rei alcança um peão passado sem ajuda) e a **atividade do rei**, que no final deixa de ser alvo e vira peça de ataque. Quem domina essas ideias calcula finais de peão com precisão em vez de adivinhar.

## Por que os finais de peão são tão exatos {#exatos "Por que são exatos"}

Com tão pouco material, cada tempo decide. Um lance de rei para o lado errado transforma vitória em empate, e vice-versa. Duas consequências práticas:

- **Trocar peças para chegar a um final de peões é uma decisão sem volta.** Antes de trocar a última peça, [calcule](artigo:calculo) o final de peões até o fim.
- **O zugzwang aparece o tempo todo.** Zugzwang é a situação em que o lado que tem a vez preferiria não jogar, porque qualquer lance piora a posição. Nos finais de peão, ele é a arma principal.

## O rei ativo {#rei-ativo "O rei ativo"}

No meio-jogo, o rei se esconde. No final, sem damas e com poucas peças, ele é uma peça forte: ataca peões, escolta o próprio peão passado e bloqueia os do adversário. A regra prática é simples: **quando as damas saem, o rei vai para o centro**. Em muitos finais de peão, quem chega primeiro com o rei ao centro ou aos peões adversários ganha.

## Rei e peão contra rei: as casas-chave {#casas-chave "Casas-chave"}

O final mais básico é rei e peão contra rei. A pergunta é sempre a mesma: o rei atacante consegue chegar a uma **casa-chave**? Se chegar, o peão promove, seja quem for a vez.

- Para um peão das colunas c, d, e ou f na **2ª, 3ª ou 4ª fileira**, as casas-chave são as **três casas duas fileiras à frente** dele.
- Para um peão dessas colunas na **5ª ou 6ª fileira**, são as **seis casas uma e duas fileiras à frente**.
- Peões de cavalo na 6ª fileira e peões de torre têm exceções. O caso do peão de torre está mais abaixo.

```tabuleiro
fen: 4k3/8/8/8/4P3/4K3/8/8 w - - 0 1
casas: d6:verde e6:verde f6:verde
legenda: Com o peão em e4, as casas-chave são d6, e6 e f6. Aqui o rei preto está perto o bastante para defendê-las, e a posição é empate, seja quem for a vez.
```

O defensor faz o contrário: mantém o rei **na frente do peão** e impede o acesso às casas-chave. A ferramenta para isso, dos dois lados, é a oposição.

## A oposição {#oposicao "A oposição"}

Dois reis estão em **oposição** quando ficam na mesma coluna (ou fileira) com uma casa entre eles. Como os reis não podem ficar lado a lado, quem tem a vez precisa sair da frente e deixar o outro passar. Por isso se diz que **tem a oposição o lado que NÃO tem a vez**.

```tabuleiro
fen: 8/3k4/8/3K4/3P4/8/8/8 b - - 0 1
setas: d5c6 d5e6
casas: d6
legenda: Os reis estão em oposição em d5 e d7. Com a vez das Pretas, o rei preto tem de ceder passagem, e o branco entra em c6 ou e6. Se fosse a vez das Brancas, seria empate.
```

O atacante usa a oposição para avançar; o defensor, para segurar. Também existe a oposição a distância (três ou cinco casas entre os reis), que segue a mesma lógica: quem não tem a vez está em vantagem.

```exercicio
fen: 8/4k3/8/8/4PK2/8/8/8 w - - 0 1
enunciado: Brancas jogam e ganham. Só um lance funciona.
solucao: f4e5
dica: Coloque o rei na frente do peão, frente a frente com o rei preto, e deixe a vez para as Pretas.
explicacao: 1.Re5! toma a oposição. As Pretas têm de sair da frente: se 1...Rd7, 2.Rf6 chega à casa-chave f6; se 1...Rf7, 2.Rd6. Qualquer outro lance, como 1.e5?, entrega a oposição às Pretas e empata.
```

```exercicio
fen: 8/4k3/8/8/4K3/4P3/8/8 b - - 0 1
enunciado: Pretas jogam e empatam. Só um lance salva.
solucao: e7e6
dica: Fique na frente do peão e deixe a vez para o rei branco.
explicacao: 1...Re6! toma a oposição. Se 2.Rd4, 2...Rd6; se 2.Rf4, 2...Rf6. O rei branco nunca chega a d5, e5 ou f5, as casas-chave do peão em e3. Qualquer outro lance perde: o rei branco ganha a oposição e chega a uma casa-chave.
```

## A regra do quadrado {#quadrado "A regra do quadrado"}

Quando o peão corre sozinho e o rei dele está longe, não é preciso calcular lance a lance. Use a **regra do quadrado**:

1. Trace um quadrado com um lado indo do peão até a casa de promoção.
2. Se o rei defensor está dentro dele, ou entra nele com o próprio lance, alcança o peão.
3. Se não consegue entrar, o peão promove.

:::aviso
**⚠️ Cuidado com o lance duplo:** um peão na casa inicial pode andar duas casas. Para traçar o quadrado, conte-o como se já estivesse uma fileira à frente.
:::

```tabuleiro
fen: 8/8/8/7k/2P5/8/8/7K w - - 0 1
setas: c4c8
casas: c4 g4 g8 c8
legenda: O quadrado do peão c4 vai de c4 a g8. Com a vez das Brancas, 1.c5 encolhe o quadrado e o rei preto fica fora: o peão promove. Com a vez das Pretas, 1...Rg5 (ou g4, g6) entra no quadrado e o rei alcança o peão.
```

```exercicio
fen: 8/8/8/P7/4k3/8/8/7K b - - 0 1
enunciado: Pretas jogam e empatam. O rei branco está longe demais para ajudar.
solucao: e4d5
dica: Desenhe o quadrado do peão a5. Que casa ao alcance do rei preto fica dentro dele?
explicacao: 1...Rd5! entra no quadrado a5–d5–d8–a8. Depois de 2.a6 Rc6 3.a7 Rb7, o peão cai. Qualquer outro lance deixa o rei fora do quadrado, e o peão promove.
```

## O peão da torre: o empate do canto {#peao-da-torre "O peão da torre"}

O peão da torre (colunas a e h) é a grande exceção. Se o rei defensor chega ao canto de promoção, a partida é empate, mesmo com o rei atacante bem colocado: ou o rei atacante não consegue tirar o defensor do canto, ou o defensor fica afogado.

```tabuleiro
fen: k7/8/PK6/8/8/8/8/8 w - - 0 1
casas: a8:vermelha
legenda: Peão de torre com o rei preto no canto: empate, seja quem for a vez. Se o peão avança para a7, o rei preto fica afogado ou volta para a8.
```

Na prática: se você está com o peão de torre, impeça o rei adversário de chegar ao canto. Se está defendendo, corra para o canto.

## Peão passado e peão passado distante {#peao-passado "Peão passado"}

Um **peão passado** é o que não tem peões adversários à frente, nem na própria coluna nem nas vizinhas. Nada além do rei e das peças pode pará-lo. Duas ideias valem ouro:

- **Peão passado distante:** um peão passado longe dos outros peões é uma isca. Enquanto o rei adversário vai capturá-lo, o seu rei ataca os peões do outro lado do tabuleiro.
- **Ruptura:** às vezes, com peões frente a frente, um sacrifício abre caminho e cria um peão passado do nada. É o tema do exercício abaixo.

```exercicio
fen: 8/ppp3k1/8/PPP5/8/8/8/6K1 w - - 0 1
enunciado: Brancas jogam e ganham. Os reis estão longe e só um lance de peão funciona.
solucao: b5b6 c7b6 a5a6 b7a6 c5c6
dica: Sacrifique o peão do meio. Depois de cada captura, empurre o peão que ficou sem bloqueio.
explicacao: 1.b6! cxb6 2.a6! bxa6 3.c6 e o peão c promove: o rei preto não alcança. Se 1...axb6, 2.c6! bxc6 3.a6, e agora é o peão a que corre. Qualquer outro primeiro lance dá tempo ao rei preto (1...Rf6), e a ruptura deixa de funcionar.
```

## Como pensar num final de peões {#metodo "Como pensar"}

1. **Conte os tempos.** Quantos lances cada peão precisa para promover? Quem chega primeiro?
2. **Procure a oposição.** Se os reis estão perto, quem tem a vez é quem perde terreno.
3. **Aplique o quadrado.** Antes de calcular, veja se o rei alcança o peão.
4. **Ative o rei.** Na dúvida, aproxime o rei do centro e dos peões.

Ao revisar suas partidas, os finais de peão são um ótimo lugar para achar o erro decisivo, porque quase sempre há um único lance certo. Veja o método em [como analisar suas partidas](artigo:analisar-partidas).

:::pratique Treine finais contra o computador
Jogue uma partida e tente trocar peças até chegar a um final de peões. No nível Difícil, cada tempo errado é punido, o melhor jeito de fixar a oposição e o quadrado.
:::

## Perguntas frequentes {#faq "Perguntas frequentes"}

### O que é oposição no xadrez?

É quando os dois reis ficam na mesma coluna ou fileira com uma casa entre eles. Quem não tem a vez "tem a oposição", porque o outro rei é obrigado a ceder passagem.

### O que é a regra do quadrado?

É um atalho para saber se um rei alcança um peão passado: se o rei está dentro do quadrado entre o peão e a casa de promoção (ou entra nele com o lance), ele alcança.

### Rei e peão contra rei é sempre vitória?

Não. Com o rei defensor na frente do peão e a oposição bem usada, muitas posições são empate. O peão de torre empata quase sempre que o rei defensor chega ao canto.

### O que é zugzwang?

É a situação em que o lado que joga preferiria passar a vez, porque todo lance piora a posição. Nos finais de peão, ele decide boa parte das partidas.
