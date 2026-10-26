#!/usr/bin/env node
'use strict';
/**
 * Gerador do Aprenda (D-APR-01). Fonte: aprenda/fonte/<pt|en>/<slug>.md. Gera, a partir dela e do motor do jogo:
 *   aprenda/<slug>.html · en/learn/<slug>.html · aprenda/index.html · en/learn/index.html
 *   aprenda/busca.json · en/learn/search.json · aprenda/motor.js · 404.html · sitemap.xml · lista de cache do sw.js
 *   contato.html · en/contact.html (formulário de contato, D-CON-05; JS em /contato.js, escrito à mão)
 *   aprenda/img/<pt|en>/<slug>.png (prévia 1200×630, só o que mudou; manifesto em aprenda/gerador/imagens.json)
 *
 *   node aprenda/gerador/gerar.js                 → valida e (re)gera tudo
 *   node aprenda/gerador/gerar.js --conferir      → só confere: sai 1 se algo gerado estiver velho ou se houver erro
 *   node aprenda/gerador/gerar.js --sem-imagens   → gera sem desenhar as prévias (o --conferir vai acusar as velhas)
 *
 * Erro (FEN ilegal, lance ilegal, mate que não fecha, link quebrado, falta de tradução…) = sai 1 sem escrever nada.
 * Aviso (título > 60, descrição fora de 50–160, mate não forçado…) = só imprime.
 */
const fs = require('node:fs');
const path = require('node:path');
const crypto = require('node:crypto');
const vm = require('node:vm');
const { execFileSync } = require('node:child_process');

const P = require('./posicao');
const TB = require('./tabuleiro');
const MD = require('./markdown');
const PG = require('./paginas');
const IMG = require('./imagens');
const { T, SITE, NIVEIS, dataPorExtenso } = require('./textos');
const X = P.X;

const RAIZ = path.join(__dirname, '..', '..');
const ARGS = process.argv.slice(2);
const CONFERIR = ARGS.includes('--conferir');
const SEM_IMAGENS = ARGS.includes('--sem-imagens');
const IDIOMAS = ['pt', 'en'];

/** Páginas do site fora do Aprenda, para o sitemap. lastmod: ATUALIZAR À MÃO quando a página mudar de conteúdo. */
const PAGINAS_FIXAS = [
  { pt: '/', en: '/en', lastmod: '2026-10-26', changefreq: 'weekly', priority: '1.0' },
  { pt: '/torneios', en: '/en/tournaments', lastmod: '2026-10-26', changefreq: 'daily', priority: '0.8' },
  { pt: '/privacidade', en: '/en/privacy', lastmod: '2026-10-26', changefreq: 'yearly', priority: '0.3' },
  { pt: '/termos', en: '/en/terms', lastmod: '2026-10-26', changefreq: 'yearly', priority: '0.3' },
  { pt: '/contato', en: '/en/contact', lastmod: '2026-10-26', changefreq: 'yearly', priority: '0.3' },
];
/** Service worker (D-APR-08): só o núcleo é pré-carregado; artigo entra no cache quando é aberto (network-first). */
const SW_VERSAO = 'xadrez-v16';
const SW_FIXOS = ['/', '/index.html', '/manifest.json', '/icon-192.png', '/icon-512.png', '/privacidade', '/termos', '/torneios', '/en/tournaments'];
const COR_NIVEL = { iniciante: '#9be09b', intermediario: '#6fa8e2', avancado: '#e59a9a', dicas: '#e2b96f' };
const RESERVADOS = new Set(['index', 'busca', 'search', 'post', 'motor', 'aprenda', 'img', 'fonte', 'gerador', 'readme']);

const erros = [], avisos = [];
const onde = (arq, linha) => arq + (linha ? ':' + linha : '');
const erro = (arq, linha, msg) => erros.push(onde(arq, linha) + ': ' + msg);
const aviso = (arq, linha, msg) => avisos.push(onde(arq, linha) + ': ' + msg);
const sha = s => crypto.createHash('sha256').update(s).digest('hex');
const rel = p => path.relative(RAIZ, p).split(path.sep).join('/');
const ler = p => fs.readFileSync(path.join(RAIZ, p), 'utf8').replace(/\r\n/g, '\n');

// ---------------------------------------------------------------- front matter
const CAMPOS = {
  id: 'texto', titulo: 'texto', titulo_seo: 'texto', descricao: 'texto', nivel: 'texto', ordem: 'numero',
  publicado: 'data', atualizado: 'data', tags: 'lista', jogar: 'numero', relacionados: 'lista', ensina: 'lista',
  capa: 'texto', rascunho: 'bool',
};
const OBRIGATORIOS = ['id', 'titulo', 'descricao', 'nivel', 'ordem', 'publicado', 'atualizado', 'tags', 'jogar'];
const tiraAspas = s => (/^"[\s\S]*"$/.test(s) || /^'[\s\S]*'$/.test(s) ? s.slice(1, -1) : s);
const dataOk = s => /^\d{4}-\d{2}-\d{2}$/.test(s) && !isNaN(Date.parse(s + 'T00:00:00Z')) && new Date(s + 'T00:00:00Z').toISOString().startsWith(s);

function lerFonte(txt, arq) {
  const t = txt.replace(/^\uFEFF/, '').replace(/\r\n/g, '\n');
  if (!t.startsWith('---\n')) { erro(arq, 1, 'falta o front matter: o arquivo tem de começar com uma linha "---"'); return null; }
  const fim = t.indexOf('\n---', 3);
  if (fim < 0 || !/^\n---\s*(\n|$)/.test(t.slice(fim, fim + 6) + '\n')) { erro(arq, 1, 'front matter sem a linha "---" de fechamento'); return null; }
  const cab = t.slice(4, fim).split('\n');
  const fm = {};
  cab.forEach((l, k) => {
    const n = k + 2;
    if (!l.trim() || l.trim().startsWith('#')) return;
    const m = /^([a-z_]+):\s*(.*)$/.exec(l);
    if (!m) { erro(arq, n, 'linha do front matter fora do formato "campo: valor"'); return; }
    const [, chave, bruto] = m;
    const tipo = CAMPOS[chave];
    if (!tipo) { aviso(arq, n, 'campo desconhecido "' + chave + '" (ignorado)'); return; }
    if (chave in fm) erro(arq, n, 'campo "' + chave + '" repetido');
    const v = bruto.trim();
    if (tipo === 'texto') fm[chave] = tiraAspas(v);
    else if (tipo === 'numero') { if (!/^\d+$/.test(v)) erro(arq, n, chave + ' tem de ser um número inteiro'); fm[chave] = Number(v); }
    else if (tipo === 'data') { if (!dataOk(v)) erro(arq, n, chave + ' tem de ser uma data AAAA-MM-DD válida (veio "' + v + '")'); fm[chave] = v; }
    else if (tipo === 'bool') { if (!/^(true|false|sim|nao|não)$/.test(v)) erro(arq, n, chave + ' tem de ser true ou false'); fm[chave] = /^(true|sim)$/.test(v); }
    else if (tipo === 'lista') {
      if (!/^\[.*\]$/.test(v)) { erro(arq, n, chave + ' tem de ser uma lista: [a, b, c]'); fm[chave] = []; return; }
      fm[chave] = v.slice(1, -1).split(',').map(x => tiraAspas(x.trim())).filter(Boolean);
    }
  });
  const fimLinha = t.indexOf('\n', fim + 1);
  const corpo = fimLinha < 0 ? '' : t.slice(fimLinha + 1);
  const linhaCorpo = t.slice(0, fimLinha + 1).split('\n').length;
  return { fm, corpo, linhaCorpo };
}

// ---------------------------------------------------------------- carga e validação das fontes
const artigos = [];
const porId = { pt: {}, en: {} };
for (const idioma of IDIOMAS) {
  const dir = path.join(RAIZ, 'aprenda', 'fonte', idioma);
  if (!fs.existsSync(dir)) { erro(rel(dir), 0, 'pasta de fontes não existe'); continue; }
  for (const nome of fs.readdirSync(dir).filter(f => f.endsWith('.md')).sort()) {
    const arq = rel(path.join(dir, nome));
    const slug = nome.slice(0, -3);
    if (!/^[a-z0-9]+(?:-[a-z0-9]+)*$/.test(slug)) { erro(arq, 0, 'nome do arquivo (slug) só com a-z, 0-9 e hífen'); continue; }
    if (RESERVADOS.has(slug)) { erro(arq, 0, 'slug reservado: ' + slug); continue; }
    const f = lerFonte(fs.readFileSync(path.join(dir, nome), 'utf8'), arq);
    if (!f) continue;
    const fm = f.fm;
    for (const c of OBRIGATORIOS) if (fm[c] === undefined || fm[c] === '') erro(arq, 0, 'falta o campo obrigatório "' + c + '"');
    if (fm.nivel && !NIVEIS.includes(fm.nivel)) erro(arq, 0, 'nivel "' + fm.nivel + '" inválido (use ' + NIVEIS.join(' | ') + ')');
    if (fm.jogar !== undefined && !(fm.jogar >= 0 && fm.jogar <= 4)) erro(arq, 0, 'jogar tem de ser 0 (modo Aprendiz), 1 (Fácil), 2 (Médio), 3 (Difícil) ou 4 (Expert)');
    if (fm.ordem !== undefined && fm.ordem < 1) erro(arq, 0, 'ordem tem de ser ≥ 1');
    if (fm.publicado && fm.atualizado && fm.atualizado < fm.publicado) erro(arq, 0, 'atualizado (' + fm.atualizado + ') antes de publicado (' + fm.publicado + ')');
    if (fm.id && !/^[a-z0-9]+(?:-[a-z0-9]+)*$/.test(fm.id)) erro(arq, 0, 'id só com a-z, 0-9 e hífen');
    const tituloFinal = fm.titulo_seo || fm.titulo || '';
    if (tituloFinal.length > 60) aviso(arq, 0, `<title> com ${tituloFinal.length} caracteres (> 60): "${tituloFinal}"`);
    if (fm.descricao && (fm.descricao.length < 50 || fm.descricao.length > 160)) aviso(arq, 0, `descricao com ${fm.descricao.length} caracteres (fora de 50–160)`);
    if (!fm.tags || !fm.tags.length) erro(arq, 0, 'tags vazias');
    const a = {
      idioma, slug, arq, fm, corpo: f.corpo, linhaCorpo: f.linhaCorpo, rascunho: !!fm.rascunho,
      url: T[idioma].base + '/' + slug, saida: T[idioma].pasta + '/' + slug + '.html',
      imagem: 'aprenda/img/' + idioma + '/' + slug + '.png',
    };
    if (fm.id) {
      if (porId[idioma][fm.id]) erro(arq, 0, 'id "' + fm.id + '" repetido (também em ' + porId[idioma][fm.id].arq + ')');
      else porId[idioma][fm.id] = a;
    }
    artigos.push(a);
  }
}

// tradução: todo id existe nos dois idiomas, com o mesmo lugar na trilha
for (const idioma of IDIOMAS) {
  const outro = idioma === 'pt' ? 'en' : 'pt';
  for (const [id, a] of Object.entries(porId[idioma])) {
    const b = porId[outro][id];
    if (!b) { erro(a.arq, 0, `falta a tradução: nenhum aprenda/fonte/${outro}/*.md com id "${id}"`); continue; }
    a.traducao = b;
    if (idioma === 'pt') for (const c of ['nivel', 'ordem', 'jogar', 'rascunho']) {
      if (String(a.fm[c]) !== String(b.fm[c])) erro(a.arq, 0, `${c} diferente da tradução (${a.fm[c]} × ${b.fm[c]} em ${b.arq})`);
    }
  }
}

// trilha: nível, depois ordem (sem empate de ordem dentro do nível)
const trilha = {};
for (const idioma of IDIOMAS) {
  const lista = artigos.filter(a => a.idioma === idioma && !a.rascunho && a.fm.id)
    .sort((x, y) => NIVEIS.indexOf(x.fm.nivel) - NIVEIS.indexOf(y.fm.nivel) || x.fm.ordem - y.fm.ordem);
  const vistos = {};
  for (const a of lista) {
    const k = a.fm.nivel + '/' + a.fm.ordem;
    if (vistos[k]) erro(a.arq, 0, `ordem ${a.fm.ordem} repetida no nível ${a.fm.nivel} (também em ${vistos[k].arq})`);
    vistos[k] = a;
  }
  lista.forEach((a, k) => {   // posicaoNivel/totalNivel: a numeração que o leitor vê em todo lugar (índice, artigo, próximo passo)
    const doNivel = lista.filter(b => b.fm.nivel === a.fm.nivel);
    a.posicao = k + 1; a.posicaoNivel = doNivel.indexOf(a) + 1; a.totalNivel = doNivel.length;
    // Dicas não são uma sequência, e um nível de 1 artigo também não: nada de "Lição 1 de 1" (LAY-trilha-23)
    a.numerada = a.fm.nivel !== 'dicas' && doNivel.length > 1;
    a.inicioTrilha = lista[0].url;
  });
  trilha[idioma] = lista;
}

// endereços que existem (para conferir links internos)
const urlsSite = new Set(['/', '/en', '/aprenda', '/en/learn']);
for (const p of PAGINAS_FIXAS) { urlsSite.add(p.pt); urlsSite.add(p.en); }
for (const a of artigos) if (!a.rascunho) urlsSite.add(a.url);
function caminhoExiste(p) {
  const limpo = p.replace(/\/+$/, '') || '/';
  if (urlsSite.has(limpo)) return true;
  const f = path.join(RAIZ, limpo.slice(1));
  return fs.existsSync(f) && fs.statSync(f).isFile();
}

// ---------------------------------------------------------------- blocos especiais
function lerChaves(linhas, a, n0, permitidas, tipo) {
  const k = {};
  for (const { t, n } of linhas) {
    if (!t.trim() || t.trim().startsWith('#')) continue;
    const m = /^\s*([a-z_]+)\s*:\s*(.*)$/.exec(t);
    if (!m) { erro(a.arq, n, `linha do bloco ${tipo} fora do formato "chave: valor"`); continue; }
    if (!permitidas.includes(m[1])) { erro(a.arq, n, `chave "${m[1]}" desconhecida no bloco ${tipo} (use ${permitidas.join(', ')})`); continue; }
    k[m[1]] = m[2].trim();
    k['_' + m[1]] = n;
  }
  return k;
}
const simNao = v => /^(sim|true|yes|s)$/i.test(String(v || ''));

function marcacoes(a, n, setasTxt, casasTxt) {
  const setas = [], casas = [];
  for (const tok of (setasTxt || '').split(/[\s,]+/).filter(Boolean)) {
    const m = /^([a-h][1-8])-?([a-h][1-8])(?::([a-z]+))?$/.exec(tok);
    const cor = m && (m[3] ? TB.corDe(m[3]) : 'verde');
    if (!m || !cor) { erro(a.arq, n, `seta "${tok}" inválida (ex.: e2e4 ou e2e4:vermelha; cores: verde, vermelha, azul, amarela)`); continue; }
    if (m[1] === m[2]) { erro(a.arq, n, `seta "${tok}" começa e termina na mesma casa`); continue; }
    setas.push({ de: m[1], para: m[2], cor });
  }
  for (const tok of (casasTxt || '').split(/[\s,]+/).filter(Boolean)) {
    const m = /^([a-h][1-8])(?::([a-z]+))?$/.exec(tok);
    const cor = m && (m[2] ? TB.corDe(m[2]) : 'amarela');
    if (!m || !cor) { erro(a.arq, n, `casa "${tok}" inválida (ex.: f7 ou f7:vermelha)`); continue; }
    casas.push({ casa: m[1], cor });
  }
  return { setas, casas };
}

/** texto puro de HTML inline: "<strong>mate em 1</strong>." vira "mate em 1 ." — tira o espaço antes da pontuação */
const semEspacoAntesDePonto = s => String(s).replace(/\s+([.,;:!?…])/g, '$1').replace(/\s+/g, ' ').trim();

function blocoTabuleiro(a, corpo, n, ctx) {
  const k = lerChaves(corpo, a, n, ['fen', 'setas', 'casas', 'virar', 'legenda'], 'tabuleiro');
  if (!k.fen) { erro(a.arq, n, 'bloco tabuleiro sem "fen:"'); return ''; }
  const r = P.posicaoLegal(k.fen);
  if (r.erro) { erro(a.arq, k._fen, r.erro); return ''; }
  const { setas, casas } = marcacoes(a, n, k.setas, k.casas);
  const virar = simNao(k.virar);
  a.fens.push('t:' + k.fen.split(/\s+/)[0]);
  if (!a.capa) a.capa = { estado: r.estado, setas, casas, virar };
  const legendaHtml = k.legenda ? MD.inline(k.legenda, ctx, k._legenda) : '';
  // legenda + descrição sem ".." (legenda que já termina em ponto) e sem repetir "Posição inicial" (LAY-diagrama-12)
  const leg = k.legenda ? semEspacoAntesDePonto(MD.textoPuro(legendaHtml)) : '';
  const rotulo = (leg ? (/[.!?…]$/.test(leg) ? leg : leg + '.') + ' ' : '') + TB.descrever(r.estado, a.idioma, { setas, casas, legenda: leg });
  return `<figure class="diagrama">${TB.svg(r.estado, { setas, casas, virar, idioma: a.idioma, rotulo })}${k.legenda ? `<figcaption>${legendaHtml}</figcaption>` : ''}</figure>`;
}

function blocoExercicio(a, corpo, n, ctx) {
  const t = T[a.idioma];
  const k = lerChaves(corpo, a, n, ['fen', 'enunciado', 'solucao', 'dica', 'tipo', 'lances', 'explicacao', 'virar'], 'exercicio');
  for (const c of ['fen', 'enunciado', 'solucao', 'dica']) if (!k[c]) erro(a.arq, n, `bloco exercicio sem "${c}:"`);
  if (!k.fen || !k.solucao) return '';
  const tipo = k.tipo || 'tatica';
  if (!['mate', 'tatica'].includes(tipo)) { erro(a.arq, k._tipo, 'tipo tem de ser "mate" ou "tatica"'); return ''; }
  const r = P.posicaoLegal(k.fen);
  if (r.erro) { erro(a.arq, k._fen, r.erro); return ''; }
  const e0 = r.estado;
  if (!X.legais(e0).length) { erro(a.arq, k._fen, 'a posição do exercício já terminou (sem lances legais)'); return ''; }
  const tokens = k.solucao.split(/\s+/).filter(Boolean);
  if (tokens.length % 2 === 0) { erro(a.arq, k._solucao, `a solução tem de terminar num lance de quem resolve (número ímpar de lances; veio ${tokens.length})`); return ''; }
  let e = e0;
  const principais = [];
  const feitos = [];
  for (let i = 0; i < tokens.length; i++) {
    const alts = tokens[i].split('|');
    const quem = i % 2 === 0 ? 'de quem resolve' : 'do adversário';
    if (alts.length > 1 && i !== tokens.length - 1) { erro(a.arq, k._solucao, `alternativas com "|" só no último lance (lance ${i + 1}: "${tokens[i]}")`); return ''; }
    const legais = [];
    for (const alt of alts) {
      const l = P.lerUci(alt, e.turn);
      if (!l) { erro(a.arq, k._solucao, `lance ${i + 1} "${alt}" não está em UCI (ex.: e2e4, g1f3, e7e8q)`); return ''; }
      const m = P.acharLegal(e, l);
      if (!m) {
        erro(a.arq, k._solucao, `lance ${i + 1} (${quem}) "${alt}" é ILEGAL` + (feitos.length ? ` depois de ${feitos.join(' ')}` : ' na posição inicial do exercício'));
        return '';
      }
      legais.push(m);
    }
    if (tipo === 'mate' && i === tokens.length - 1) {
      legais.forEach((m, j) => { if (!P.ehMate(X.jogar(e, m))) erro(a.arq, k._solucao, `"mate": o último lance "${alts[j]}" não dá xeque-mate` + (feitos.length ? ` (depois de ${feitos.join(' ')})` : '')); });
    }
    principais.push(legais[0]);
    feitos.push(alts[0]);
    e = X.jogar(e, legais[0]);
  }
  const nJog = (tokens.length + 1) / 2;
  if (k.lances && Number(k.lances) !== nJog) erro(a.arq, k._lances, `lances: ${k.lances}, mas a solução tem ${nJog} lance(s) de quem resolve`);
  if (tipo !== 'mate' && k.lances) aviso(a.arq, k._lances, '"lances" só tem efeito com tipo: mate');
  if (tipo === 'mate' && nJog <= 2) {
    if (!P.mateForcado(e0, nJog)) aviso(a.arq, k._solucao, `o mate em ${nJog} não é forçado: o adversário tem defesa melhor que a linha dada`);
    else if (nJog === 2 && P.mateForcado(e0, 1)) aviso(a.arq, k._solucao, 'há mate em 1 nesta posição (o exercício pede mate em 2)');
  }
  const linha = P.linhaSan(e0, principais, a.idioma);
  const ultAlts = tokens[tokens.length - 1].split('|');
  let linhaHtml = MD.esc(linha);
  if (ultAlts.length > 1) {
    let eAnt = e0;
    principais.slice(0, -1).forEach(m => { eAnt = X.jogar(eAnt, m); });
    const outros = ultAlts.slice(1).map(u => P.san(eAnt, P.acharLegal(eAnt, P.lerUci(u, eAnt.turn)), a.idioma));
    linhaHtml += ' <span class="ex-alt">(' + (a.idioma === 'pt' ? 'ou ' : 'or ') + outros.map(MD.esc).join(', ') + ')</span>';
  }
  a.fens.push('e:' + k.fen.split(/\s+/)[0]);
  if (!a.capaEx) a.capaEx = { estado: e0, setas: [], casas: [], virar: k.virar ? simNao(k.virar) : e0.turn === 'b' };
  const num = ++a.exercicios;
  const rot = t.ex.exercicio + ' ' + num;
  const virar = k.virar ? simNao(k.virar) : e0.turn === 'b';
  const enunciadoHtml = MD.inline(k.enunciado || '', ctx, k._enunciado);
  // san: cada lance da linha principal na notação do artigo ("1...Txd8"), para o widget narrar a resposta do adversário (LAY-widget-14)
  const sans = [];
  let eSan = e0;
  for (const m of principais) { sans.push(eSan.full + (eSan.turn === 'w' ? '.' : '...') + P.san(eSan, m, a.idioma)); eSan = X.jogar(eSan, m); }
  const dados = { fen: k.fen, sol: tokens.map(x => x.split('|')), san: sans, tipo, virar };
  const enun = semEspacoAntesDePonto(MD.textoPuro(enunciadoHtml));
  const rotulo = rot + ': ' + (/[.!?…:]$/.test(enun) ? enun : enun + '.') + ' ' + TB.descrever(e0, a.idioma);
  return `<figure class="exercicio" id="exercicio-${num}" data-exercicio>
<figcaption><span class="ex-rotulo">${rot}</span> <span class="ex-enunciado">${enunciadoHtml}</span></figcaption>
<div class="ex-tab">${TB.svg(e0, { idioma: a.idioma, virar, rotulo })}</div>
<details class="ex-dica"><summary>${t.ex.dica}</summary><p>${MD.inline(k.dica || '', ctx, k._dica)}</p></details>
<details class="ex-solucao"><summary>${t.ex.verSolucao}</summary><p class="ex-linha"><strong>${linhaHtml}</strong></p>${k.explicacao ? `<p class="ex-explicacao">${MD.inline(k.explicacao, ctx, k._explicacao)}</p>` : ''}</details>
<script type="application/json" class="ex-dados">${JSON.stringify(dados).replace(/</g, '\\u003c')}</script>
</figure>`;
}

// ---------------------------------------------------------------- renderiza os artigos
const ancorasPendentes = [];
for (const a of artigos) {
  a.fens = []; a.exercicios = 0; a.capa = null; a.capaEx = null;
  const locais = [];
  const ctx = {
    erro: (msg, n) => erro(a.arq, n, msg),
    link: (href, n) => {
      if (href.startsWith('artigo:')) {
        const [id, anc] = href.slice(7).split('#');
        const alvo = porId[a.idioma][id];
        if (!alvo) { erro(a.arq, n, `link para artigo inexistente "${id}" (não há id "${id}" em aprenda/fonte/${a.idioma}/)`); return '#'; }
        if (alvo.rascunho && !a.rascunho) erro(a.arq, n, `link para o rascunho "${id}"`);
        if (anc) ancorasPendentes.push({ a, alvo, anc, n });
        return alvo.url + (anc ? '#' + anc : '');
      }
      if (href.startsWith('#')) { locais.push({ anc: href.slice(1), n }); return href; }
      if (/^(https?:\/\/|mailto:)/.test(href)) return href;
      if (href.startsWith('/')) {
        const [p, anc] = href.split('#');
        const caminho = p.split('?')[0];
        if (!caminhoExiste(caminho)) erro(a.arq, n, `link interno quebrado "${href}" (para artigo, prefira artigo:<id>)`);
        const alvo = artigos.find(x => x.url === caminho.replace(/\/+$/, ''));
        if (alvo && anc) ancorasPendentes.push({ a, alvo, anc, n });
        return href;
      }
      erro(a.arq, n, `link "${href}" não reconhecido (use artigo:<id>, /caminho, #ancora ou https://)`);
      return href;
    },
    bloco: (tipo, corpo, n) => (tipo === 'tabuleiro' ? blocoTabuleiro(a, corpo, n, ctx) : blocoExercicio(a, corpo, n, ctx)),
  };
  ctx.ids = new Set(['conteudo', 'toc-titulo', 'proximo-titulo', 'pratique-titulo', 'rel-titulo']);
  const r = MD.renderizar(a.corpo, ctx, a.linhaCorpo);
  for (const l of locais) if (!ctx.ids.has(l.anc)) erro(a.arq, l.n, `âncora "#${l.anc}" não existe neste artigo`);
  a.html = r.html; a.titulos = r.titulos; a.pratique = r.pratique; a.ids = ctx.ids;
  // perguntas frequentes (h2#faq, cada h3 + a resposta até o próximo h3) para o JSON-LD FAQPage: o mesmo texto da página
  const secFaq = (r.html.match(/<h2 id="faq"[^>]*>[\s\S]*?(?=<h2 |$)/) || [''])[0];
  a.faq = [...secFaq.matchAll(/<h3[^>]*>([\s\S]*?)<\/h3>([\s\S]*?)(?=<h3|$)/g)]
    .map(([, q, resp]) => ({ q: semEspacoAntesDePonto(MD.textoPuro(q)), r: semEspacoAntesDePonto(MD.textoPuro(resp)) })).filter(x => x.q && x.r);
  const texto = MD.textoPuro(r.html);
  a.texto = texto;
  a.palavras = texto.split(/\s+/).filter(Boolean).length;
  a.minutos = Math.max(1, Math.round(a.palavras / 200));
  a.temExercicio = a.exercicios > 0;
  if (a.fm.capa) {
    const c = P.posicaoLegal(a.fm.capa);
    if (c.erro) erro(a.arq, 0, 'capa: ' + c.erro); else a.capa = { estado: c.estado, setas: [], casas: [], virar: false };
  }
  if (!a.capa) a.capa = a.capaEx || { estado: P.lerFen('rnbqkbnr/pppppppp/8/8/8/8/PPPPPPPP/RNBQKBNR w KQkq - 0 1'), setas: [], casas: [], virar: false };
}
for (const p of ancorasPendentes) if (!p.alvo.ids || !p.alvo.ids.has(p.anc)) erro(p.a.arq, p.n, `âncora "#${p.anc}" não existe em ${p.alvo.arq}`);

// mesmos diagramas/exercícios nas duas línguas (aviso: tradução pode ter ficado para trás)
for (const a of artigos.filter(x => x.idioma === 'pt' && x.traducao)) {
  const x = a.fens.slice().sort().join(','), y = a.traducao.fens.slice().sort().join(',');
  if (x !== y) aviso(a.arq, 0, `diagramas/exercícios diferentes da tradução ${a.traducao.arq} (pt: ${a.fens.length}, en: ${a.traducao.fens.length})`);
}

// próximo passo e relacionados
for (const idioma of IDIOMAS) {
  const lista = trilha[idioma];
  lista.forEach((a, k) => {
    a.proximo = lista[k + 1] || null;
    const ids = a.fm.relacionados || [];
    a.relacionados = [];
    for (const id of ids) {
      const r = porId[idioma][id];
      if (!r) erro(a.arq, 0, `relacionados: artigo "${id}" não existe em ${idioma}`);
      else if (r === a) erro(a.arq, 0, 'relacionados: o artigo aponta para si mesmo');
      else if (!r.rascunho && r !== a.proximo) a.relacionados.push(r);   // o próximo passo já aparece logo acima (LAY-fim-16)
    }
    if (!ids.length) {   // automático: vizinhos de trilha do mesmo nível, depois os demais
      a.relacionados = lista.filter(b => b !== a && b !== a.proximo)
        .sort((x, y) => (x.fm.nivel !== a.fm.nivel) - (y.fm.nivel !== a.fm.nivel) || Math.abs(x.posicao - a.posicao) - Math.abs(y.posicao - a.posicao))
        .slice(0, 3);
    }
  });
}

// ---------------------------------------------------------------- motor do navegador (gerado do motor do jogo)
function motorNavegador() {
  const MG = require('../../servidor/motor/motor-gerado.js');
  const fns = ['isWhite', 'isBlack', 'colorOf', 'row', 'col', 'sq', 'inBounds', 'generateMoves', 'isAttacked', 'findKing', 'inCheck', 'makeMove'];
  const fonte = ler('servidor/motor/motor-gerado.js') + ler('servidor/motor/xadrez.js');
  return [
    '// GERADO por aprenda/gerador/gerar.js a partir de servidor/motor/motor-gerado.js (extraído do index.html) e',
    '// servidor/motor/xadrez.js — NÃO EDITAR À MÃO. Mesmas regras do jogo: o exercício aceita/recusa lance como o jogo.',
    `// fonte: ${sha(fonte).slice(0, 16)}`,
    '(function () {',
    "'use strict';",
    ...fns.map(f => MG[f].toString()),
    `const M = { ${fns.join(', ')} };`,
    X.legais.toString(),
    'const igual = ' + X.igual.toString() + ';',
    X.jogar.toString(),
    X.materialInsuficiente.toString(),
    X.fim.toString(),
    P.lerFen.toString(),
    'window.XadrezMotor = { legais, jogar, fim, igual, lerFen, inCheck: M.inCheck };',
    '})();',
    '',
  ].join('\n').replace(/\r\n/g, '\n');   // toString() copia o fim de linha da fonte (CRLF num checkout com autocrlf): sem isto o --conferir nunca bate
}

/** o motor gerado roda e concorda com o do servidor (perft 2 da inicial e todas as posições dos exercícios) */
function testarMotor(codigo) {
  const janela = {};
  try { vm.runInNewContext(codigo, { window: janela }, { filename: 'aprenda/motor.js' }); }
  catch (e) { erro('aprenda/motor.js', 0, 'motor gerado não roda: ' + e.message); return; }
  const Mn = janela.XadrezMotor;
  const perft = (Mx, e, d) => (d === 0 ? 1 : Mx.legais(e).reduce((s, m) => s + perft(Mx, Mx.jogar(e, m), d - 1), 0));
  const ini = Mn.lerFen('rnbqkbnr/pppppppp/8/8/8/8/PPPPPPPP/RNBQKBNR w KQkq - 0 1');
  if (perft(Mn, ini, 2) !== 400) erro('aprenda/motor.js', 0, 'perft(2) da posição inicial ≠ 400 no motor do navegador');
  for (const a of artigos) {
    for (const m of a.html.matchAll(/<script type="application\/json" class="ex-dados">([\s\S]*?)<\/script>/g)) {
      const d = JSON.parse(m[1]);
      if (perft(Mn, Mn.lerFen(d.fen), 2) !== perft(X, P.lerFen(d.fen), 2)) erro(a.arq, 0, 'motor do navegador diverge do servidor na posição ' + d.fen);
    }
  }
}

// ---------------------------------------------------------------- saídas
const saidas = new Map();   // caminho relativo → conteúdo
const ativo = (url, conteudo) => url + '?v=' + sha(conteudo).slice(0, 10);

if (!erros.length) {
  try { execFileSync(process.execPath, [path.join(RAIZ, 'servidor/motor/extrair.js'), '--conferir'], { stdio: 'pipe' }); }
  catch { erro('servidor/motor/motor-gerado.js', 0, 'desatualizado em relação ao index.html: rode node servidor/motor/extrair.js'); }
}

for (const f of ['aprenda/post.css', 'aprenda/aprenda.js', 'contato.js']) if (!fs.existsSync(path.join(RAIZ, f))) erro(f, 0, 'arquivo estático (escrito à mão) não existe');
if (!erros.length) {
  for (const f of ['aprenda/aprenda.js', 'contato.js']) {
    try { new vm.Script(ler(f), { filename: f }); } catch (e) { erro(f, 0, 'erro de sintaxe: ' + e.message); }
  }
}

const imagensPedidas = [];
if (!erros.length) {
  const motor = motorNavegador();
  try { new vm.Script(motor, { filename: 'aprenda/motor.js' }); } catch (e) { erro('aprenda/motor.js', 0, 'erro de sintaxe no motor gerado: ' + e.message); }
  testarMotor(motor);
  saidas.set('aprenda/motor.js', motor);
  const ativos = {
    css: ativo('/aprenda/post.css', ler('aprenda/post.css')),
    js: ativo('/aprenda/aprenda.js', ler('aprenda/aprenda.js')),
    motor: ativo('/aprenda/motor.js', motor),
    contato: ativo('/contato.js', ler('contato.js')),
  };

  for (const a of artigos.filter(x => !x.rascunho)) {
    const html = PG.artigo({
      idioma: a.idioma, url: a.url, fm: a.fm, corpo: a.html, titulos: a.titulos, pratique: a.pratique, minutos: a.minutos,
      palavras: a.palavras, temExercicio: a.temExercicio, imagem: a.imagem, proximo: a.proximo, relacionados: a.relacionados,
      traducao: a.traducao, posicaoNivel: a.posicaoNivel, totalNivel: a.totalNivel, numerada: a.numerada, inicioTrilha: a.inicioTrilha, faq: a.faq,
    }, ativos);
    saidas.set(a.saida, html);
    const t = T[a.idioma];
    imagensPedidas.push({
      arquivo: a.imagem,
      html: IMG.html({
        idioma: t.lang, titulo: a.fm.titulo, nivel: t.nivel[a.fm.nivel], corNivel: COR_NIVEL[a.fm.nivel], marca: t.marca,
        rodape: 'xadrezonline.app' + t.base + ' · ' + t.minLeitura(a.minutos),
        svg: TB.svg(a.capa.estado, { ...a.capa, idioma: a.idioma, rotulo: a.fm.titulo }),
      }),
    });
  }

  for (const idioma of IDIOMAS) {
    const t = T[idioma];
    const lista = trilha[idioma];
    const lastmod = lista.reduce((m, a) => (a.fm.atualizado > m ? a.fm.atualizado : m), '2026-05-21');
    const imgIndice = 'aprenda/img/' + idioma + '/index.png';
    saidas.set(t.pasta + '/index.html', PG.indice(idioma, lista, ativos, imgIndice, lastmod));
    imagensPedidas.push({
      arquivo: imgIndice,
      html: IMG.html({
        idioma: t.lang, titulo: t.indice.titulo, nivel: idioma === 'pt' ? 'Curso gratuito' : 'Free course', corNivel: '#e2b96f', marca: t.marca,
        rodape: 'xadrezonline.app' + t.base,
        svg: TB.svg(P.lerFen('rnbqkbnr/pppppppp/8/8/8/8/PPPPPPPP/RNBQKBNR w KQkq - 0 1'), { idioma, rotulo: t.indice.titulo }),
      }),
    });
    const busca = lista.map(a => ({
      u: a.url, t: a.fm.titulo, d: a.fm.descricao, n: a.fm.nivel, nr: t.nivel[a.fm.nivel], p: a.numerada ? a.posicaoNivel : 0, m: a.minutos,
      g: (a.fm.tags || []).join(' · '), h: a.titulos.map(h => MD.textoPuro(h.html)).join(' · '), x: a.texto.slice(0, 600),
    }));
    saidas.set(idioma === 'pt' ? 'aprenda/busca.json' : 'en/learn/search.json', '[\n' + busca.map(b => JSON.stringify(b)).join(',\n') + '\n]\n');
  }

  saidas.set('404.html', PG.pagina404(ativos));
  saidas.set('contato.html', PG.paginaContato('pt', ativos));
  saidas.set('en/contact.html', PG.paginaContato('en', ativos));

  // sitemap
  const urlXml = (loc, lastmod, changefreq, priority, pt, en) => `  <url>
    <loc>${SITE}${loc}</loc>
    <lastmod>${lastmod}</lastmod>
    <changefreq>${changefreq}</changefreq>
    <priority>${priority}</priority>
    <xhtml:link rel="alternate" hreflang="pt-BR" href="${SITE}${pt}"/>
    <xhtml:link rel="alternate" hreflang="en" href="${SITE}${en}"/>
    <xhtml:link rel="alternate" hreflang="x-default" href="${SITE}${pt}"/>
  </url>`;
  const sm = ['<?xml version="1.0" encoding="UTF-8"?>',
    '<!-- GERADO por aprenda/gerador/gerar.js — NÃO EDITAR À MÃO (páginas fixas: PAGINAS_FIXAS no gerador) -->',
    '<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9"',
    '        xmlns:xhtml="http://www.w3.org/1999/xhtml">'];
  for (const p of PAGINAS_FIXAS) for (const loc of [p.pt, p.en]) sm.push(urlXml(loc, p.lastmod, p.changefreq, p.priority, p.pt, p.en));
  const lastIdx = Math.max(...IDIOMAS.map(i => trilha[i].reduce((m, a) => (a.fm.atualizado > m ? a.fm.atualizado : m), '2026-05-21')).map(d => Date.parse(d)));
  const lmIdx = new Date(lastIdx).toISOString().slice(0, 10);
  for (const loc of [T.pt.base, T.en.base]) sm.push(urlXml(loc, lmIdx, 'weekly', '0.9', T.pt.base, T.en.base));
  for (const a of trilha.pt) for (const x of [a, a.traducao]) sm.push(urlXml(x.url, x.fm.atualizado, 'monthly', '0.8', a.url, a.traducao.url));
  sm.push('</urlset>', '');
  saidas.set('sitemap.xml', sm.join('\n'));

  // service worker: só o trecho entre as marcas
  const assets = [...SW_FIXOS, T.pt.base, T.en.base, ativos.css, ativos.js, ativos.motor];
  const cacheNome = SW_VERSAO + '-' + sha(JSON.stringify(assets)).slice(0, 8);
  const trecho = ['// >>> gerado por aprenda/gerador/gerar.js (D-APR-08) — não editar entre as marcas',
    `const CACHE_NAME = '${cacheNome}';`,
    'const ASSETS = [',
    ...assets.map((u, k) => `  '${u}'${k < assets.length - 1 ? ',' : ''}`),
    '];',
    '// <<< fim do trecho gerado'].join('\n');
  const sw = ler('sw.js');
  const reMarcas = /\/\/ >>> gerado por aprenda\/gerador[\s\S]*?\/\/ <<< fim do trecho gerado/;
  const reAntigo = /const CACHE_NAME = [^\n]*\nconst ASSETS = \[[\s\S]*?\];/;
  if (reMarcas.test(sw)) saidas.set('sw.js', sw.replace(reMarcas, trecho));
  else if (reAntigo.test(sw)) saidas.set('sw.js', sw.replace(reAntigo, trecho));
  else erro('sw.js', 0, 'não achei o trecho CACHE_NAME/ASSETS para substituir');
}

// ---------------------------------------------------------------- relatório, escrita / conferência
for (const w of avisos) console.log('aviso  ' + w);
if (erros.length) {
  for (const e of erros) console.error('ERRO   ' + e);
  console.error(`\n${erros.length} erro(s): nada foi ${CONFERIR ? 'conferido' : 'gerado'}.`);
  process.exit(1);
}

// órfãos: HTML no Aprenda que nenhuma fonte gera (artigo renomeado/apagado deixa o antigo para trás)
const orfaos = [];
for (const pasta of ['aprenda', 'en/learn']) {
  for (const f of fs.readdirSync(path.join(RAIZ, pasta)).filter(x => x.endsWith('.html'))) {
    if (!saidas.has(pasta + '/' + f)) orfaos.push(pasta + '/' + f);
  }
}
const imgsPedidas = new Set(imagensPedidas.map(p => p.arquivo));
const imgsOrfas = [];
for (const idioma of IDIOMAS) {
  const d = path.join(RAIZ, 'aprenda/img', idioma);
  if (fs.existsSync(d)) for (const f of fs.readdirSync(d)) if (!imgsPedidas.has('aprenda/img/' + idioma + '/' + f)) imgsOrfas.push('aprenda/img/' + idioma + '/' + f);
}
const MANIFESTO = path.join(__dirname, 'imagens.json');
const manifesto = fs.existsSync(MANIFESTO) ? JSON.parse(fs.readFileSync(MANIFESTO, 'utf8')) : {};
const manifestoTexto = m => JSON.stringify(Object.fromEntries(Object.entries(m).filter(([k]) => imgsPedidas.has(k)).sort()), null, 2) + '\n';

const atual = p => (fs.existsSync(path.join(RAIZ, p)) ? fs.readFileSync(path.join(RAIZ, p), 'utf8').replace(/\r\n/g, '\n') : null);

if (CONFERIR) {
  const velhos = [...saidas].filter(([p, c]) => atual(p) !== c).map(([p]) => p);
  const imgVelhas = imagensPedidas.filter(p => manifesto[p.arquivo] !== IMG.hash(p.html) || !fs.existsSync(path.join(RAIZ, p.arquivo))).map(p => p.arquivo);
  const problemas = [...velhos.map(p => 'desatualizado: ' + p), ...imgVelhas.map(p => 'imagem velha: ' + p),
    ...orfaos.map(p => 'órfão (nenhuma fonte gera): ' + p), ...imgsOrfas.map(p => 'imagem órfã: ' + p)];
  if (problemas.length) {
    for (const p of problemas) console.error('  ' + p);
    console.error(`\nAprenda desatualizado (${problemas.length}): rode  node aprenda/gerador/gerar.js`);
    process.exit(1);
  }
  console.log(`Aprenda em dia: ${artigos.length} fontes, ${saidas.size} arquivos gerados e ${imagensPedidas.length} imagens conferidos` + (avisos.length ? ` (${avisos.length} aviso(s))` : ''));
  process.exit(0);
}

(async () => {
  let escritos = 0;
  for (const [p, c] of saidas) {
    if (atual(p) === c) continue;
    fs.mkdirSync(path.dirname(path.join(RAIZ, p)), { recursive: true });
    fs.writeFileSync(path.join(RAIZ, p), c);
    escritos++;
    console.log('gerado  ' + p);
  }
  for (const f of imgsOrfas) { fs.unlinkSync(path.join(RAIZ, f)); delete manifesto[f]; console.log('apagada ' + f); }
  if (orfaos.length) {
    for (const o of orfaos) console.error('ERRO   órfão: ' + o + ' — nenhuma fonte gera este arquivo (apague-o ou crie a fonte; se a URL mudou, pense no redirecionamento)');
  }
  let pend = [];
  if (SEM_IMAGENS) pend = imagensPedidas.filter(p => manifesto[p.arquivo] !== IMG.hash(p.html)).map(p => p.arquivo);
  else {
    const r = await IMG.desenhar(RAIZ, imagensPedidas, manifesto);
    for (const f of r.feitos) console.log('imagem  ' + f);
    pend = r.pendentes;
    if (r.erro) console.error('aviso  imagens: ' + r.erro);
  }
  const mt = manifestoTexto(manifesto);
  if (!fs.existsSync(MANIFESTO) || fs.readFileSync(MANIFESTO, 'utf8') !== mt) fs.writeFileSync(MANIFESTO, mt);
  if (pend.length) console.error(`aviso  ${pend.length} imagem(ns) de prévia sem desenhar: ${pend.join(', ')}`);
  console.log(`\n${artigos.length} fontes · ${escritos} arquivo(s) escrito(s) de ${saidas.size} · ${avisos.length} aviso(s)`);
  if (orfaos.length) process.exit(1);
})().catch(e => { console.error(e); process.exit(1); });
