# Aprenda — como escrever e publicar

As páginas de `aprenda/` e `en/learn/` são **geradas**. Não edite o HTML: edite a fonte em Markdown e rode o gerador.
Decisões em `servidor/DECISOES.md` (D-APR-01…12).

```
aprenda/fonte/pt/<slug>.md      ← artigo em português  → /aprenda/<slug>
aprenda/fonte/en/<slug>.md      ← o mesmo artigo em inglês → /en/learn/<slug>
aprenda/gerador/                ← gerador (Node puro, sem npm install)
aprenda/post.css, aprenda/aprenda.js   ← estilo e JS (escritos à mão)
```

Gerados (versionados, não editar): `aprenda/*.html`, `en/learn/*.html`, `aprenda/busca.json`,
`en/learn/search.json`, `aprenda/motor.js`, `aprenda/img/<pt|en>/*.png`, `404.html`, `sitemap.xml` e o trecho
marcado do `sw.js`.

## Comandos

```bash
node aprenda/gerador/gerar.js               # valida e gera tudo (e desenha as prévias que mudaram)
node aprenda/gerador/gerar.js --conferir    # só confere: sai 1 se algo gerado estiver velho ou com erro
node aprenda/gerador/gerar.js --sem-imagens # gera sem desenhar as prévias (o --conferir vai acusar)
```

As prévias (og:image, 1200×630) são desenhadas pelo Chrome com `playwright-core`. O gerador procura em
`PLAYWRIGHT_CORE`, no `require` normal, em `C:/tmp/pw-harness/node_modules/playwright-core` e no npm global; o
Chrome em `CHROME_PATH` ou no caminho padrão do Windows. Sem eles, as páginas são geradas e só as imagens ficam
pendentes.

## Criar um artigo

1. Escolha um `id` curto (comum aos dois idiomas) e um slug por idioma — o slug é o nome do arquivo e vira a URL.
   **Nunca renomeie o slug de um artigo publicado** (a URL muda; o gerador acusa o HTML antigo como órfão).
2. Crie `aprenda/fonte/pt/<slug-pt>.md` e `aprenda/fonte/en/<slug-en>.md`. **Os dois** são obrigatórios
   (falta de tradução é erro).
3. Rode `node aprenda/gerador/gerar.js`, confira no navegador e publique (abaixo).

### Front matter

```yaml
---
id: garfo-de-cavalo                 # liga pt ↔ en (a-z, 0-9, hífen)
titulo: O Garfo de Cavalo           # h1, og:title; <title> se não houver titulo_seo
titulo_seo: O Garfo de Cavalo no Xadrez | Xadrez Online   # opcional; aviso se o <title> passar de 60
descricao: Texto da meta description, entre 50 e 160 caracteres (fora disso dá aviso).
nivel: intermediario                # iniciante | intermediario | avancado | dicas
ordem: 20                           # posição na trilha dentro do nível (use dezenas: sobra espaço para inserir)
publicado: 2026-11-02
atualizado: 2026-11-02              # vira o lastmod do sitemap e o dateModified
tags: [garfo, cavalo, tática]       # busca, keywords, article:tag
jogar: 2                            # dificuldade sugerida no "Pratique agora": 1 Fácil, 2 Médio, 3 Difícil, 4 Expert
relacionados: [movimento-do-cavalo] # opcional (ids); sem ele, o gerador escolhe 3 vizinhos de trilha
ensina: [Garfo, Ataque duplo]       # opcional: "teaches" do JSON-LD (padrão: as tags)
capa: <FEN>                         # opcional: diagrama da prévia (padrão: 1º tabuleiro, senão 1º exercício)
rascunho: true                      # opcional: valida, mas não publica (vale para os dois idiomas)
---
```

`nivel`, `ordem`, `jogar` e `rascunho` têm de ser iguais no pt e no en. A trilha é Iniciante → Intermediário →
Avançado → Dicas e, dentro do nível, pela `ordem`. "Próximo passo" é o artigo seguinte da trilha.

### Corpo (Markdown)

- O **1º parágrafo** vira a abertura (`lead`); o sumário sai dos `##` (com 2 ou mais).
- Títulos: `## Texto`, `### Texto`, `#### Texto`. `#` é proibido (o h1 vem do `titulo`).
  Âncora e rótulo do sumário opcionais: `## 1. O movimento em L {#movimento "O movimento em L"}`.
- `**negrito**`, `*itálico*`, `` `código` ``, listas `-` e `1.` (aninhe com recuo), tabelas com `|`, `> citação`, `---`.
- HTML só estas tags: `<small> <kbd> <sub> <sup> <em> <strong> <br>`. O resto vira texto.
- Links: `[texto](artigo:<id>)` ou `[texto](artigo:<id>#ancora)` (resolve para a URL do idioma), `[x](/torneios)`,
  `[x](#ancora)`, `[x](https://…)`. Link interno quebrado, âncora inexistente ou artigo inexistente = **erro**.
- Caixas:

```
:::dica
**💡 Dica:** texto.
:::

:::aviso
**⚠️ Cuidado:** texto.
:::

:::caixa 1.e4 e5 2.Cf3 Cc6 3.Bc4
Explicação.

<small>Nota pequena.</small>
:::

:::peca ♞ Cavalo
Move em "L"…
:::

:::pratique Treine o garfo agora
Texto do bloco "Pratique agora" (vai para o fim da página, com o botão para jogar na dificuldade `jogar`).
:::
```

## Diagrama

````
```tabuleiro
fen: r1bqkb1r/pppp1Qpp/2n2n2/4p3/2B1P3/8/PPPP1PPP/RNB1K1NR b KQkq - 0 4
setas: c4f7:azul e2e4
casas: e8:vermelha f7
virar: nao
legenda: A posição final depois de 4.Dxf7#.
```
````

- `fen` (obrigatório): FEN completo (os 2 últimos campos podem faltar). Tem de ser **legal**: 1 rei de cada cor, sem
  peão na 1ª/8ª, o lado que não joga fora de xeque, roque e en passant coerentes. Para ilustrar uma peça sozinha,
  ponha os dois reis num canto.
- `setas`: `de`+`para` (`e2e4`), cor opcional `:verde` (padrão) `:vermelha` `:azul` `:amarela`.
- `casas`: casas destacadas, cor opcional (padrão `amarela`).
- `virar: sim` mostra o tabuleiro do lado das Pretas.
- Vira SVG inline com `role="img"` e `aria-label` descrevendo a posição (peças, vez, destaques e setas).

## Exercício

````
```exercicio
fen: r1bqkb1r/pppp1ppp/2n2n2/4p2Q/2B1P3/8/PPPP1PPP/RNB1K1NR w KQkq - 4 4
enunciado: Depois de 1.e4 e5 2.Bc4 Cc6 3.Dh5 Cf6??, as Brancas dão **mate em 1**.
tipo: mate
lances: 1
solucao: h5f7
dica: Qual peão preto só é defendido pelo rei?
explicacao: 4.Dxf7# — a dama captura com a proteção do bispo de c4.
```
````

- `solucao`: lances em **UCI** (`e2e4`, `g1f3`, `e7e8q`), alternando quem resolve e o adversário, e terminando em
  lance de quem resolve. Ex.: `d5c7 e8e7 c7a8` — o 2º lance é a resposta do adversário, jogada sozinha pelo widget.
- No **último** lance, alternativas com `|`: `d1h5|d1f3`.
- `tipo: mate` (com `lances: N` opcional) exige que a linha termine em xeque-mate; o widget também aceita qualquer
  outro lance que dê mate no último passo. Para N ≤ 2 o gerador prova se o mate é forçado (aviso se não for, ou se
  houver mate mais curto). `tipo: tatica` (padrão) aceita só os lances da solução.
- Quem resolve é o lado da vez no FEN; com as Pretas o tabuleiro vira sozinho (`virar:` força).
- Sem JS: diagrama estático + dica e solução em `<details>`. Com JS: tabuleiro de toque/clique, "Mostrar dica",
  "Ver solução", "Recomeçar"; lance legal fora da solução = "tente de novo"; ilegal = recusado.

## O que o gerador valida

| Erro (não gera nada) | Aviso (gera e avisa) |
|---|---|
| FEN ilegal; lance ilegal; mate que não fecha; solução que termina no adversário | `<title>` > 60 caracteres |
| falta de tradução; `nivel`/`ordem`/`jogar` diferentes entre pt e en | descrição fora de 50–160 |
| link interno, âncora ou `artigo:` quebrado; `relacionados` inexistente | mate em N não forçado / há mate mais curto |
| campo obrigatório faltando; `ordem` repetida no nível; slug ou id inválido | diagramas/exercícios diferentes entre pt e en |
| `motor-gerado.js` velho em relação ao `index.html`; motor do navegador divergente | campo de front matter desconhecido |
| HTML órfão em `aprenda/` ou `en/learn/` (com o `--conferir`) | |

O motor do navegador (`aprenda/motor.js`) é gerado de `servidor/motor/motor-gerado.js` (que é extraído do
`index.html`) e de `servidor/motor/xadrez.js`; o gerador roda o arquivo gerado e confere perft com o motor do servidor.

## Publicar

```bash
node aprenda/gerador/gerar.js
git add aprenda en sitemap.xml sw.js 404.html && git commit
bash servidor/publicar-site.sh teste     # https://novo.xadrezonline.app (noindex)
bash servidor/publicar-site.sh oficial   # só depois de conferir no teste
```

O `publicar-site.sh` roda `gerar.js --conferir` antes de empacotar e recusa publicar se algo estiver velho.
`aprenda/fonte/`, `aprenda/gerador/` e este README não vão para o servidor.

Páginas fixas do sitemap (jogo, torneios, termos, privacidade): `PAGINAS_FIXAS` em `aprenda/gerador/gerar.js` —
atualize o `lastmod` quando a página mudar.
