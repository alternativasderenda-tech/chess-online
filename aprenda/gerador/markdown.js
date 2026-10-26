'use strict';
/**
 * Markdown do Aprenda — subconjunto pequeno e ESTRITO (D-APR-02), sem dependência:
 *   blocos:  ## / ### / #### título {#id "rótulo no sumário"} · parágrafo · listas (- * 1.) com aninhamento por recuo ·
 *            tabela com | · > citação · --- · ```código``` · ```tabuleiro``` · ```exercicio``` ·
 *            :::dica · :::aviso · :::caixa Título · :::peca ♞ Cavalo · :::pratique Título (vai para o bloco "Pratique agora" do fim)
 *   inline:  **negrito** · *itálico* / _itálico_ · `código` · [texto](url) · [texto](artigo:<id>#ancora) ·
 *            \* escapa · tags permitidas: <small> <kbd> <sub> <sup> <em> <strong> <br>
 * HTML cru fora dessa lista é escapado (vira texto) — o Markdown nunca injeta script.
 * Erros vêm com o número da linha do arquivo .md.
 */

const esc = s => String(s).replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;');

const TAGS_OK = /<\/?(?:small|kbd|sub|sup|em|strong)>|<br\s*\/?>/g;

function semAcento(s) { return s.normalize('NFD').replace(/[̀-ͯ]/g, ''); }
function slugTitulo(s) {
  return semAcento(String(s)).toLowerCase().replace(/<[^>]+>/g, '').replace(/[^a-z0-9]+/g, '-').replace(/^-+|-+$/g, '') || 'secao';
}

/** inline → HTML. ctx.link(href, linha) devolve o href final (ou lança erro). */
function inline(txt, ctx, linha) {
  const guarda = [];
  const ph = h => '\u0000' + (guarda.push(h) - 1) + '\u0000';
  let s = String(txt);
  s = s.replace(/\\([\\`*_[\]()#|<>!-])/g, (_, c) => ph(esc(c)));
  s = s.replace(/`([^`]+)`/g, (_, c) => ph('<code>' + esc(c) + '</code>'));
  s = s.replace(TAGS_OK, t => ph(t.replace(/<br\s*\/?>/, '<br>')));
  s = s.replace(/\[([^\]]+)\]\(([^)\s]+)\)/g, (_, texto, href) => {
    const final = ctx.link ? ctx.link(href, linha) : href;
    const externo = /^https?:\/\//.test(final);
    return ph('<a href="' + esc(final) + '"' + (externo ? ' rel="noopener"' : '') + '>') + texto + ph('</a>');
  });
  s = esc(s);
  s = s.replace(/\*\*(?=\S)([\s\S]*?\S)\*\*/g, '<strong>$1</strong>');
  s = s.replace(/(^|[^*\w])\*(?=[^\s*])([^*]*?[^\s*])\*(?!\*)/g, '$1<em>$2</em>');
  s = s.replace(/(^|[\s(\u0000])_(?=\S)([^_]*?\S)_(?=$|[\s).,;:!?\u0000])/g, '$1<em>$2</em>');
  for (let k = 0; k < 3 && s.includes('\u0000'); k++) s = s.replace(/\u0000(\d+)\u0000/g, (_, n) => guarda[Number(n)]);
  return s;
}

const RE = {
  cerca: /^```\s*([\w-]*)\s*$/,
  container: /^:::\s*([\w-]+)\s*(.*)$/,
  fimContainer: /^:::\s*$/,
  titulo: /^(#{1,6})\s+(.*?)\s*$/,
  hr: /^(?:-{3,}|\*{3,})\s*$/,
  item: /^( *)([-*]|\d+[.)])\s+(.*)$/,
  citacao: /^>\s?(.*)$/,
  separadorTabela: /^\s*\|?\s*:?-{2,}:?\s*(\|\s*:?-{2,}:?\s*)*\|?\s*$/,
};
const recuo = l => l.match(/^ */)[0].length;
const vazia = l => !l || !l.trim();

function iniciaBloco(l, prox) {
  return RE.cerca.test(l) || RE.container.test(l) || RE.fimContainer.test(l) || RE.titulo.test(l) || RE.hr.test(l)
    || RE.citacao.test(l) || RE.item.test(l) || (l.trim().startsWith('|') && prox !== undefined && RE.separadorTabela.test(prox));
}

function celulas(l) {
  let t = l.trim();
  if (t.startsWith('|')) t = t.slice(1);
  if (t.endsWith('|') && !t.endsWith('\\|')) t = t.slice(0, -1);
  const r = []; let atual = '';
  for (let k = 0; k < t.length; k++) {
    if (t[k] === '\\' && t[k + 1] === '|') { atual += '\\|'; k++; continue; }
    if (t[k] === '|') { r.push(atual.trim()); atual = ''; continue; }
    atual += t[k];
  }
  r.push(atual.trim());
  return r;
}

/**
 * linhas: [{ t: texto, n: número da linha no arquivo }]. Devolve [{ tipo, html, interno? }].
 * ctx: { link, bloco(tipo, linhas, n) → html, erro(msg, n), titulos[], pratique, ids:Set }
 */
function blocos(linhas, ctx) {
  const out = [];
  let i = 0;
  while (i < linhas.length) {
    const { t: l, n } = linhas[i];
    if (vazia(l)) { i++; continue; }

    let m = RE.cerca.exec(l);
    if (m) {
      const info = m[1];
      const corpo = [];
      i++;
      while (i < linhas.length && !/^```\s*$/.test(linhas[i].t)) corpo.push(linhas[i++]);
      if (i >= linhas.length) ctx.erro('bloco ``` aberto e nunca fechado', n);
      i++;
      if (info === 'tabuleiro' || info === 'exercicio') out.push({ tipo: info, html: ctx.bloco(info, corpo, n) });
      else out.push({ tipo: 'pre', html: '<pre><code>' + esc(corpo.map(x => x.t).join('\n')) + '</code></pre>' });
      continue;
    }

    m = RE.container.exec(l);
    if (m) {
      const tipo = m[1], args = m[2].trim();
      const corpo = [];
      let prof = 1;
      i++;
      while (i < linhas.length) {
        if (RE.container.test(linhas[i].t)) prof++;
        else if (RE.fimContainer.test(linhas[i].t) && --prof === 0) break;
        corpo.push(linhas[i++]);
      }
      if (i >= linhas.length) ctx.erro(':::' + tipo + ' aberto e nunca fechado (feche com uma linha só com :::)', n);
      i++;
      const dentro = blocos(corpo, ctx).map(b => b.html).join('\n');
      if (tipo === 'dica') out.push({ tipo, html: '<div class="tip">' + dentro + '</div>' });
      else if (tipo === 'aviso') out.push({ tipo, html: '<div class="warning">' + dentro + '</div>' });
      else if (tipo === 'peca') {
        const [glifo, ...nome] = args.split(/\s+/);
        if (!glifo || !nome.length) ctx.erro(':::peca precisa de glifo e nome, ex.: ":::peca ♞ Cavalo"', n);
        out.push({ tipo, html: '<div class="box"><span class="glyph" aria-hidden="true">' + esc(glifo) + '</span><span class="label">' + inline(nome.join(' '), ctx, n) + '</span>\n' + dentro + '</div>' });
      } else if (tipo === 'caixa') {
        out.push({ tipo, html: '<div class="box">' + (args ? '<span class="label">' + inline(args, ctx, n) + '</span>\n' : '') + dentro + '</div>' });
      } else if (tipo === 'pratique') {
        if (ctx.pratique) ctx.erro('só pode haver um :::pratique por artigo', n);
        ctx.pratique = { titulo: args ? inline(args, ctx, n) : '', html: dentro };
      } else ctx.erro('container desconhecido ":::' + tipo + '" (use dica, aviso, caixa, peca ou pratique)', n);
      continue;
    }
    if (RE.fimContainer.test(l)) { ctx.erro('::: de fechamento sem abertura', n); i++; continue; }

    m = RE.titulo.exec(l);
    if (m) {
      const nivel = m[1].length;
      if (nivel === 1) ctx.erro('# (h1) não pode ser usado no corpo: o título do artigo vem do front matter', n);
      if (nivel > 4) ctx.erro('use no máximo #### (h4)', n);
      let texto = m[2], id = null, rotulo = null;
      const a = /\s*\{#([a-z0-9-]+)(?:\s+"([^"]*)")?\}\s*$/.exec(texto);
      if (a) { id = a[1]; rotulo = a[2] || null; texto = texto.slice(0, a.index); }
      if (!id) { id = slugTitulo(texto); let k = 2; while (ctx.ids.has(id)) id = slugTitulo(texto) + '-' + k++; }
      else if (ctx.ids.has(id)) ctx.erro('id de título repetido "#' + id + '"', n);
      ctx.ids.add(id);
      const html = inline(texto, ctx, n);
      if (nivel === 2) ctx.titulos.push({ id, html, rotulo: rotulo ? inline(rotulo, ctx, n) : html.replace(/^\d+\.\s+/, '') });
      out.push({ tipo: 'h' + nivel, html: `<h${nivel} id="${id}">${html}</h${nivel}>` });
      i++;
      continue;
    }

    if (RE.hr.test(l)) { out.push({ tipo: 'hr', html: '<hr>' }); i++; continue; }

    if (l.trim().startsWith('|') && i + 1 < linhas.length && RE.separadorTabela.test(linhas[i + 1].t)) {
      const cab = celulas(l);
      i += 2;
      const corpo = [];
      while (i < linhas.length && linhas[i].t.trim().startsWith('|')) corpo.push(linhas[i++]);
      const th = cab.map(c => '<th>' + inline(c, ctx, n) + '</th>').join('');
      const trs = corpo.map(r => {
        const cs = celulas(r.t);
        if (cs.length !== cab.length) ctx.erro('linha da tabela com ' + cs.length + ' colunas (o cabeçalho tem ' + cab.length + ')', r.n);
        return '<tr>' + cs.map(c => '<td>' + inline(c, ctx, r.n) + '</td>').join('') + '</tr>';
      }).join('\n');
      out.push({ tipo: 'table', html: '<div class="tabela-rolagem"><table class="tabela">\n<thead><tr>' + th + '</tr></thead>\n<tbody>\n' + trs + '\n</tbody>\n</table></div>' });
      continue;
    }

    if (RE.citacao.test(l)) {
      const corpo = [];
      while (i < linhas.length && RE.citacao.test(linhas[i].t)) { corpo.push({ t: RE.citacao.exec(linhas[i].t)[1], n: linhas[i].n }); i++; }
      out.push({ tipo: 'blockquote', html: '<blockquote>' + blocos(corpo, ctx).map(b => b.html).join('\n') + '</blockquote>' });
      continue;
    }

    m = RE.item.exec(l);
    if (m) { const r = lista(linhas, i, ctx); out.push(r.bloco); i = r.i; continue; }

    // parágrafo
    const par = [l.trim()];
    i++;
    while (i < linhas.length && !vazia(linhas[i].t) && !iniciaBloco(linhas[i].t, linhas[i + 1] && linhas[i + 1].t)) par.push(linhas[i++].t.trim());
    const html = inline(par.join(' '), ctx, n);
    if (/^<small>[\s\S]*<\/small>$/.test(html) && !/<\/small>[\s\S]*<small>/.test(html)) out.push({ tipo: 'small', html });
    else out.push({ tipo: 'p', html: '<p>' + html + '</p>', interno: html });
  }
  return out;
}

function lista(linhas, i, ctx) {
  const m0 = RE.item.exec(linhas[i].t);
  const base = m0[1].length;
  const ordenada = /\d/.test(m0[2]);
  const inicio = ordenada ? parseInt(m0[2], 10) : 1;
  const itens = [];
  let solta = false, atual = null, conteudo = 0, vaziaAntes = false;
  while (i < linhas.length) {
    const { t, n } = linhas[i];
    const m = RE.item.exec(t);
    if (m && m[1].length === base) {
      if (/\d/.test(m[2]) !== ordenada) break;
      if (vaziaAntes && atual) solta = true;
      atual = [{ t: m[3], n }];
      itens.push(atual);
      conteudo = m[1].length + m[2].length + 1;
      vaziaAntes = false; i++; continue;
    }
    if (vazia(t)) {
      let k = i + 1;
      while (k < linhas.length && vazia(linhas[k].t)) k++;
      if (k >= linhas.length) { i = k; break; }
      const prox = linhas[k].t, mp = RE.item.exec(prox);
      if ((mp && mp[1].length === base && /\d/.test(mp[2]) === ordenada) || recuo(prox) > base) {
        atual.push({ t: '', n }); vaziaAntes = true; i++; continue;
      }
      break;
    }
    if (recuo(t) > base) { atual.push({ t: t.slice(Math.min(recuo(t), conteudo)), n }); i++; continue; }
    if (!vaziaAntes && !iniciaBloco(t, linhas[i + 1] && linhas[i + 1].t)) { atual.push({ t: t.trim(), n }); i++; continue; }
    break;
  }
  const lis = itens.map(it => {
    const bs = blocos(it, ctx);
    const temVazia = it.some((x, k) => k > 0 && vazia(x.t));
    if (!solta && !temVazia) return '<li>' + bs.map(b => b.tipo === 'p' ? b.interno : b.html).join('\n') + '</li>';
    return '<li>' + bs.map(b => b.html).join('\n') + '</li>';
  }).join('\n');
  const tag = ordenada ? 'ol' : 'ul';
  const attr = ordenada && inicio !== 1 ? ` start="${inicio}"` : '';
  return { bloco: { tipo: tag, html: `<${tag}${attr}>\n${lis}\n</${tag}>` }, i };
}

/** md (sem o front matter) → { html, titulos, pratique }. primeiraLinha = nº da linha do corpo no arquivo. */
function renderizar(md, ctx, primeiraLinha = 1) {
  const linhas = md.replace(/\r\n/g, '\n').split('\n').map((t, k) => ({ t: t.replace(/\t/g, '    '), n: k + primeiraLinha }));
  ctx.titulos = []; ctx.ids = ctx.ids || new Set(); ctx.pratique = null;
  const bs = blocos(linhas, ctx);
  // 1º parágrafo antes de qualquer título = abertura (lead)
  const k = bs.findIndex(b => b.tipo !== 'tabuleiro');
  if (k >= 0 && bs[k].tipo === 'p') bs[k].html = '<p class="lead">' + bs[k].interno + '</p>';
  return { html: bs.map(b => b.html).join('\n'), titulos: ctx.titulos, pratique: ctx.pratique };
}

/** texto puro de um HTML (para tempo de leitura e busca) */
function textoPuro(html) {
  return html.replace(/<svg[\s\S]*?<\/svg>/g, ' ').replace(/<script[\s\S]*?<\/script>/g, ' ').replace(/<[^>]+>/g, ' ')
    .replace(/&nbsp;/g, ' ').replace(/&amp;/g, '&').replace(/&lt;/g, '<').replace(/&gt;/g, '>').replace(/&quot;/g, '"')
    .replace(/\s+/g, ' ').trim();
}

module.exports = { renderizar, inline, esc, textoPuro, slugTitulo, semAcento };
