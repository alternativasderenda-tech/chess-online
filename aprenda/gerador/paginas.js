'use strict';
/** Modelos HTML do Aprenda: artigo, índice e 404. Tudo estático; JS só para exercício e busca. */
const { T, SITE, NIVEIS, dataPorExtenso } = require('./textos');
const { esc } = require('./markdown');

const ORG = { '@type': 'Organization', name: 'Xadrez Online', url: SITE + '/', logo: { '@type': 'ImageObject', url: SITE + '/icon-512.png' } };
const jsonLd = obj => '<script type="application/ld+json">\n' + JSON.stringify(obj, null, 2).replace(/</g, '\\u003c') + '\n</script>';

const FONTES = '<link rel="preconnect" href="https://fonts.googleapis.com">\n'
  + '<link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>\n'
  + '<link rel="stylesheet" href="https://fonts.googleapis.com/css2?family=Playfair+Display:wght@400;700&family=Inter:wght@300;400;500;600;700&display=swap">';

/** cabeçalho/menu do site. atual = 'aprenda' | null; outro = URL da mesma página no outro idioma */
function topo(idioma, outro, atual = 'aprenda') {
  const t = T[idioma];
  const outroIdioma = idioma === 'pt' ? 'en' : 'pt-BR';
  const cur = k => (atual === k ? ' aria-current="page"' : '');
  return `<a class="pular" href="#conteudo">${idioma === 'pt' ? 'Pular para o conteúdo' : 'Skip to content'}</a>
<header class="site-top">
  <a class="marca" href="${t.inicio}">♚ ${t.marca}</a>
  <nav class="menu" aria-label="${t.menu.rotulo}">
    <a href="${t.inicio}">${t.menu.jogar}</a>
    <a href="${t.base}"${cur('aprenda')}>${t.menu.aprenda}</a>
    <a href="${t.torneios}">${t.menu.torneios}</a>
    <a class="idioma" href="${outro}" hreflang="${outroIdioma}" lang="${outroIdioma}" title="${t.menu.outroTitulo}">${t.menu.outro}</a>
  </nav>
</header>`;
}

function rodape(idioma) {
  const t = T[idioma], r = t.rodape;
  return `<footer class="site">
  <a href="${t.inicio}">${r.jogar}</a> •
  <a href="${t.base}">${r.aprenda}</a> •
  <a href="${t.torneios}">${r.torneios}</a> •
  <a href="${t.privacidade}">${r.privacidade}</a> •
  <a href="${t.termos}">${r.termos}</a> •
  <a href="mailto:alternativasderenda@gmail.com">${r.contato}</a>
</footer>`;
}

function cabecaComum({ idioma, titulo, descricao, canonical, pt, en, keywords, css, robots, og, extra = '' }) {
  const t = T[idioma];
  return `<!DOCTYPE html>
<html lang="${t.lang}">
<head>
<meta charset="UTF-8">
<meta name="viewport" content="width=device-width, initial-scale=1.0">
<title>${esc(titulo)}</title>
<meta name="description" content="${esc(descricao)}">
${keywords ? `<meta name="keywords" content="${esc(keywords)}">\n` : ''}<meta name="robots" content="${robots || 'index, follow, max-snippet:-1, max-image-preview:large'}">
<meta name="theme-color" content="#1a1a2e">
${canonical ? `<link rel="canonical" href="${canonical}">\n` : ''}${pt ? `<link rel="alternate" hreflang="pt-BR" href="${pt}">
<link rel="alternate" hreflang="en" href="${en}">
<link rel="alternate" hreflang="x-default" href="${pt}">\n` : ''}<link rel="icon" href="/icon-192.png">
${FONTES}
<link rel="stylesheet" href="${css}">
${og || ''}${extra}</head>`;
}

function metaSocial({ idioma, tipo, titulo, descricao, url, imagem, imagemAlt, extra = '' }) {
  const t = T[idioma];
  return `<meta property="og:type" content="${tipo}">
<meta property="og:title" content="${esc(titulo)}">
<meta property="og:description" content="${esc(descricao)}">
<meta property="og:url" content="${url}">
<meta property="og:site_name" content="${t.marca}">
<meta property="og:locale" content="${t.og}">
<meta property="og:locale:alternate" content="${idioma === 'pt' ? T.en.og : T.pt.og}">
<meta property="og:image" content="${imagem}">
<meta property="og:image:width" content="1200">
<meta property="og:image:height" content="630">
<meta property="og:image:alt" content="${esc(imagemAlt)}">
${extra}<meta name="twitter:card" content="summary_large_image">
<meta name="twitter:title" content="${esc(titulo)}">
<meta name="twitter:description" content="${esc(descricao)}">
<meta name="twitter:image" content="${imagem}">
<meta name="twitter:image:alt" content="${esc(imagemAlt)}">
`;
}

const selo = (idioma, nivel) => `<span class="selo nivel-${nivel}">${T[idioma].nivel[nivel]}</span>`;

/**
 * a: { idioma, id, slug, url, fm, corpo, titulos, pratique, minutos, palavras, temExercicio, imagem, proximo, relacionados[], traducao }
 * ativos: { css, js, motor } com ?v=
 */
function artigo(a, ativos) {
  const t = T[a.idioma], fm = a.fm;
  const url = SITE + a.url;
  const urlPt = SITE + (a.idioma === 'pt' ? a.url : a.traducao.url);
  const urlEn = SITE + (a.idioma === 'en' ? a.url : a.traducao.url);
  const tituloSeo = fm.titulo_seo || fm.titulo;
  const nivelNome = t.nivel[fm.nivel];
  const imagem = SITE + '/' + a.imagem;
  const og = metaSocial({
    idioma: a.idioma, tipo: 'article', titulo: fm.titulo, descricao: fm.descricao, url, imagem,
    imagemAlt: fm.titulo + ' — ' + nivelNome,
    extra: `<meta property="article:published_time" content="${fm.publicado}">
<meta property="article:modified_time" content="${fm.atualizado}">
<meta property="article:section" content="${esc(nivelNome)}">
${(fm.tags || []).map(g => `<meta property="article:tag" content="${esc(g)}">`).join('\n')}${(fm.tags || []).length ? '\n' : ''}`,
  });
  const curso = { '@type': 'Course', '@id': SITE + t.base + '#curso', name: t.indice.titulo, url: SITE + t.base };
  const ld = [
    {
      '@context': 'https://schema.org',
      '@type': ['Article', 'LearningResource'],
      '@id': url + '#artigo',
      headline: fm.titulo,
      name: fm.titulo,
      description: fm.descricao,
      url,
      mainEntityOfPage: url,
      image: { '@type': 'ImageObject', url: imagem, width: 1200, height: 630 },
      datePublished: fm.publicado,
      dateModified: fm.atualizado,
      inLanguage: t.lang,
      author: { '@type': 'Organization', name: 'Xadrez Online', url: SITE + '/' },
      publisher: ORG,
      educationalLevel: nivelNome,
      teaches: fm.ensina && fm.ensina.length ? fm.ensina : (fm.tags || []),
      learningResourceType: a.temExercicio ? (a.idioma === 'pt' ? ['Guia', 'Exercício interativo'] : ['Guide', 'Interactive exercise']) : (a.idioma === 'pt' ? 'Guia' : 'Guide'),
      keywords: (fm.tags || []).join(', '),
      timeRequired: 'PT' + a.minutos + 'M',
      wordCount: a.palavras,
      isAccessibleForFree: true,
      isPartOf: curso,
    },
    {
      '@context': 'https://schema.org',
      '@type': 'BreadcrumbList',
      itemListElement: [
        { '@type': 'ListItem', position: 1, name: t.marca, item: SITE + t.inicio },
        { '@type': 'ListItem', position: 2, name: t.trilha, item: SITE + t.base },
        { '@type': 'ListItem', position: 3, name: fm.titulo, item: url },
      ],
    },
  ];
  // a outra língua do mesmo artigo
  ld[0][a.idioma === 'pt' ? 'workTranslation' : 'translationOfWork'] = { '@id': SITE + a.traducao.url + '#artigo' };

  const head = cabecaComum({
    idioma: a.idioma, titulo: tituloSeo, descricao: fm.descricao, canonical: url, pt: urlPt, en: urlEn,
    keywords: (fm.tags || []).join(', '), css: ativos.css, og,
    extra: ld.map(jsonLd).join('\n') + '\n',
  });

  const sumario = a.titulos.length >= 2
    ? `<nav class="toc" aria-labelledby="toc-titulo">
  <p class="toc-h" id="toc-titulo">${t.sumario}</p>
  <ol>
${a.titulos.map(h => `    <li><a href="#${h.id}">${h.rotulo}</a></li>`).join('\n')}
  </ol>
</nav>`
    : '';
  let corpo = a.corpo;
  if (sumario) {
    const k = corpo.startsWith('<p class="lead">') ? corpo.indexOf('</p>') + 4 : 0;
    corpo = corpo.slice(0, k) + (k ? '\n' : '') + sumario + '\n' + corpo.slice(k);
  }

  const dif = fm.jogar;
  const jogarUrl = t.inicio + '?ia=' + dif;
  const pr = a.pratique;
  const blocoPratique = `<section class="cta" aria-labelledby="pratique-titulo">
  <p class="cta-sobre">${t.pratique}</p>
  <h2 id="pratique-titulo">${pr && pr.titulo ? pr.titulo : t.pratique}</h2>
  ${pr && pr.html ? pr.html : `<p>${t.pratiqueTexto}</p>`}
  <a href="${jogarUrl}" class="cta-btn">${t.pratiqueBotao(t.dificuldade[dif])}</a>
</section>`;

  const prox = a.proximo;
  const blocoProximo = prox
    ? `<section class="proximo" aria-labelledby="proximo-titulo">
  <h2 id="proximo-titulo" class="fim-h">${t.proximo}</h2>
  <a class="card" href="${prox.url}">
    <span class="card-num" aria-hidden="true">${prox.posicao}</span>
    <span class="card-corpo">
      <span class="card-meta">${selo(a.idioma, prox.fm.nivel)} · ${t.minLeitura(prox.minutos)}</span>
      <span class="card-titulo">${esc(prox.fm.titulo)}</span>
      <span class="card-desc">${esc(prox.fm.descricao)}</span>
    </span>
  </a>
</section>`
    : `<section class="proximo" aria-labelledby="proximo-titulo">
  <h2 id="proximo-titulo" class="fim-h">${t.proximo}</h2>
  <p>${t.proximoFim} <a href="${t.base}">${t.verTodos}</a></p>
</section>`;

  const blocoRel = a.relacionados.length
    ? `<nav class="related" aria-labelledby="rel-titulo">
  <h2 id="rel-titulo" class="fim-h">${t.relacionados}</h2>
  <ul>
${a.relacionados.map(r => `    <li><a href="${r.url}">${esc(r.fm.titulo)}</a> ${selo(a.idioma, r.fm.nivel)}</li>`).join('\n')}
  </ul>
</nav>`
    : '';

  const scripts = a.temExercicio
    ? `<script src="${ativos.motor}" defer></script>\n<script src="${ativos.js}" defer></script>\n`
    : '';

  return `${head}
<body>
${topo(a.idioma, a.traducao.url)}
<main class="container" id="conteudo">
  <nav class="crumbs" aria-label="${a.idioma === 'pt' ? 'Você está em' : 'Breadcrumb'}">
    <a href="${t.inicio}">${t.marca}</a><span class="sep" aria-hidden="true">›</span><a href="${t.base}">${t.trilha}</a><span class="sep" aria-hidden="true">›</span><span aria-current="page">${esc(fm.titulo)}</span>
  </nav>
  <article>
    <header class="art-cab">
      <h1>${esc(fm.titulo)}</h1>
      <p class="meta">${selo(a.idioma, fm.nivel)}<span class="meta-item">⏱ ${t.minLeitura(a.minutos)}</span><span class="meta-item"><time datetime="${fm.atualizado}">${t.atualizado(dataPorExtenso(fm.atualizado, a.idioma))}</time></span></p>
    </header>
${corpo}
  </article>
  <div class="fim">
${blocoProximo}
${blocoPratique}
${blocoRel}
  </div>
</main>
${rodape(a.idioma)}
${scripts}</body>
</html>
`;
}

/** índice: lista = artigos do idioma em ordem de trilha (com posicao, minutos) */
function indice(idioma, lista, ativos, imagem, lastmod) {
  const t = T[idioma], I = t.indice;
  const url = SITE + t.base;
  const outro = idioma === 'pt' ? T.en.base : T.pt.base;
  const og = metaSocial({ idioma, tipo: 'website', titulo: I.titulo, descricao: I.descricao, url, imagem: SITE + '/' + imagem, imagemAlt: I.titulo });
  const ld = [
    {
      '@context': 'https://schema.org',
      '@type': 'Course',
      '@id': url + '#curso',
      name: I.titulo,
      description: I.descricao,
      url,
      inLanguage: t.lang,
      provider: ORG,
      isAccessibleForFree: true,
      dateModified: lastmod,
      educationalLevel: NIVEIS.filter(n => lista.some(a => a.fm.nivel === n)).map(n => t.nivel[n]),
      teaches: [...new Set(lista.flatMap(a => (a.fm.ensina && a.fm.ensina.length ? a.fm.ensina : [])))],
      hasPart: lista.map(a => ({ '@type': 'LearningResource', '@id': SITE + a.url + '#artigo', name: a.fm.titulo, url: SITE + a.url, educationalLevel: t.nivel[a.fm.nivel] })),
      hasCourseInstance: { '@type': 'CourseInstance', courseMode: 'online', courseWorkload: 'PT' + lista.reduce((s, a) => s + a.minutos, 0) + 'M' },
      offers: { '@type': 'Offer', category: 'Free', price: 0, priceCurrency: idioma === 'pt' ? 'BRL' : 'USD' },
    },
    {
      '@context': 'https://schema.org',
      '@type': 'ItemList',
      name: I.titulo,
      itemListOrder: 'https://schema.org/ItemListOrderAscending',
      numberOfItems: lista.length,
      itemListElement: lista.map((a, k) => ({ '@type': 'ListItem', position: k + 1, url: SITE + a.url, name: a.fm.titulo })),
    },
    {
      '@context': 'https://schema.org',
      '@type': 'BreadcrumbList',
      itemListElement: [
        { '@type': 'ListItem', position: 1, name: t.marca, item: SITE + t.inicio },
        { '@type': 'ListItem', position: 2, name: t.trilha, item: url },
      ],
    },
  ];
  const head = cabecaComum({
    idioma, titulo: I.tituloSeo, descricao: I.descricao, canonical: url, pt: SITE + T.pt.base, en: SITE + T.en.base,
    css: ativos.css, og, extra: ld.map(jsonLd).join('\n') + '\n',
  });
  const card = a => `      <li><a class="card" href="${a.url}">
        <span class="card-num" aria-hidden="true">${a.posicaoNivel}</span>
        <span class="card-corpo">
          <span class="card-meta">${selo(idioma, a.fm.nivel)} · ${I.licao} ${a.posicaoNivel} · ${t.minLeitura(a.minutos)}</span>
          <h3 class="card-titulo">${esc(a.fm.titulo)}</h3>
          <span class="card-desc">${esc(a.fm.descricao)}</span>
        </span>
      </a></li>`;
  const secoes = NIVEIS.map(n => {
    const doNivel = lista.filter(a => a.fm.nivel === n);
    return `  <section class="nivel" id="${n}" aria-labelledby="nivel-${n}">
    <h2 id="nivel-${n}">${selo(idioma, n)} <span>${t.nivel[n]}</span></h2>
    <p class="nivel-desc">${t.nivelDesc[n]}</p>
${doNivel.length ? `    <ol class="cards">\n${doNivel.map(card).join('\n')}\n    </ol>` : `    <p class="em-breve">${t.nivelEmBreve}</p>`}
  </section>`;
  }).join('\n');
  return `${head}
<body>
${topo(idioma, outro)}
<main class="container largo" id="conteudo">
  <header class="indice-cab">
    <h1>${I.h1}</h1>
    <p class="lead">${I.lead}</p>
    <a href="${t.inicio}" class="cta-btn">${I.jogar}</a>
  </header>
  <nav class="niveis" aria-label="${idioma === 'pt' ? 'Níveis' : 'Levels'}">
${NIVEIS.map(n => `    <a href="#${n}">${t.nivel[n]}</a>`).join('\n')}
  </nav>
  <div class="busca" id="busca" data-indice="${t.busca}" hidden>
    <label for="busca-campo">${I.buscaRotulo}</label>
    <input type="search" id="busca-campo" placeholder="${I.buscaPlaceholder}" autocomplete="off" spellcheck="false">
    <p class="busca-status" id="busca-status" role="status" aria-live="polite"
       data-nada="${esc(I.buscaNada)}" data-um="${esc(I.buscaUm)}" data-n="${esc(I.buscaN('{n}'))}"></p>
    <ol class="cards" id="busca-res" hidden></ol>
  </div>
  <div id="trilha">
${secoes}
  </div>
</main>
${rodape(idioma)}
<script src="${ativos.js}" defer></script>
</body>
</html>
`;
}

/** 404 bilíngue (servida pelo handle_errors do Caddy em qualquer caminho: tudo com endereço absoluto) */
function pagina404(ativos) {
  const P = T.pt.pagina404, E = T.en.pagina404;
  const head = cabecaComum({
    idioma: 'pt', titulo: P.titulo + ' · ' + E.titulo + ' | Xadrez Online', descricao: P.texto,
    css: ativos.css, robots: 'noindex, follow',
  });
  return `${head}
<body>
<header class="site-top">
  <a class="marca" href="/">♚ Xadrez Online</a>
</header>
<main class="container erro404" id="conteudo">
  <p class="erro-codigo" aria-hidden="true">404</p>
  <div class="erro-lados">
    <section>
      <h1>${P.titulo}</h1>
      <p>${P.texto}</p>
      <ul class="erro-links">
        <li><a class="cta-btn" href="/">♟ ${P.jogar}</a></li>
        <li><a href="/aprenda">${P.aprenda}</a></li>
        <li><a href="/torneios">${P.torneios}</a></li>
      </ul>
    </section>
    <section lang="en">
      <h2>${E.titulo}</h2>
      <p>${E.texto}</p>
      <ul class="erro-links">
        <li><a class="cta-btn" href="/en">♟ ${E.jogar}</a></li>
        <li><a href="/en/learn">${E.aprenda}</a></li>
        <li><a href="/en/tournaments">${E.torneios}</a></li>
      </ul>
    </section>
  </div>
</main>
</body>
</html>
`;
}

module.exports = { artigo, indice, pagina404, topo, rodape, selo };
