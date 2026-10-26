'use strict';
/** Textos de interface do Aprenda, por idioma. O conteúdo dos artigos vem de aprenda/fonte/<idioma>/. */

const SITE = 'https://xadrezonline.app';

const NIVEIS = ['iniciante', 'intermediario', 'avancado', 'dicas'];

const T = {
  pt: {
    lang: 'pt-BR', og: 'pt_BR', marca: 'Xadrez Online', base: '/aprenda', inicio: '/', torneios: '/torneios',
    pasta: 'aprenda', busca: '/aprenda/busca.json',
    menu: { jogar: 'Jogar', aprenda: 'Aprenda', torneios: 'Torneios', outro: 'EN', outroTitulo: 'Read in English', rotulo: 'Menu principal' },
    trilha: 'Aprenda',
    nivel: { iniciante: 'Iniciante', intermediario: 'Intermediário', avancado: 'Avançado', dicas: 'Dicas' },
    nivelDesc: {
      iniciante: 'Do zero: as peças, as regras e as primeiras ideias para jogar sua primeira partida.',
      intermediario: 'Táticas, planos e finais básicos para começar a ganhar com consistência.',
      avancado: 'Estratégia, cálculo e técnica para quem já domina o básico.',
      dicas: 'Formatos, hábitos e conselhos práticos para evoluir mais rápido.',
    },
    nivelEmBreve: 'Novos guias deste nível em breve.',
    minLeitura: n => `${n} min de leitura`,
    atualizado: d => `Atualizado em ${d}`,
    publicado: d => `Publicado em ${d}`,
    sumario: 'Neste guia',
    proximo: 'Próximo passo',
    proximoFim: 'Você chegou ao fim da trilha. Volte ao índice para revisar ou escolher outro tema.',
    verTodos: 'Ver todos os guias',
    fimTorneio: u => `Ou teste o que aprendeu num <a href="${u}">torneio</a>.`,
    licaoDe: (n, m) => `Lição ${n} de ${m}`,
    pratique: 'Pratique agora',
    pratiqueTexto: 'Jogue contra o computador e aplique o que acabou de aprender. Sem cadastro, direto no navegador.',
    pratiqueBotao: n => `▶ Jogar contra a IA (${n})`,
    dificuldade: { 1: 'Fácil', 2: 'Médio', 3: 'Difícil', 4: 'Expert' },
    relacionados: 'Leia também',
    rodape: { jogar: 'Jogar', aprenda: 'Aprenda', torneios: 'Torneios', privacidade: 'Política de Privacidade', termos: 'Termos de Uso', contato: 'Contato' },
    privacidade: '/privacidade', termos: '/termos',
    indice: {
      titulo: 'Aprenda Xadrez: Curso Gratuito do Zero ao Avançado',
      tituloSeo: 'Aprenda Xadrez: Curso Gratuito | Xadrez Online',
      h1: 'Aprenda Xadrez',
      descricao: 'Curso de xadrez gratuito em português: regras, movimentos, táticas, aberturas, finais e estratégia, em uma trilha do iniciante ao avançado.',
      lead: n => `Curso de xadrez gratuito com ${n} lições em português, em 4 níveis — Iniciante, Intermediário, Avançado e Dicas —, do primeiro lance ao jogo avançado, com diagramas e exercícios interativos. Nunca jogou? Comece pela lição 1 e siga a ordem.`,
      comece: 'Comece aqui: lição 1 →',
      jogar: 'ou jogue uma partida',
      buscaRotulo: 'Buscar nos guias',
      buscaPlaceholder: 'Buscar: garfo, roque, mate…',
      buscaNada: 'Nenhum guia encontrado. Tente "mate", "abertura" ou veja a trilha abaixo.',
      buscaLimpar: 'Limpar busca',
      buscaUm: '1 guia encontrado',
      buscaN: n => `${n} guias encontrados`,
      licao: 'Lição',
    },
    ex: {
      exercicio: 'Exercício', dica: 'Dica', solucao: 'Solução', verSolucao: 'Ver solução', mostrarDica: 'Mostrar dica',
      recomecar: 'Recomeçar', explicacao: 'Por quê',
    },
    pagina404: {
      titulo: 'Página não encontrada', texto: 'O endereço que você abriu não existe (ou mudou de lugar).',
      jogar: 'Jogar xadrez', aprenda: 'Aprenda xadrez', torneios: 'Torneios',
    },
    meses: ['janeiro', 'fevereiro', 'março', 'abril', 'maio', 'junho', 'julho', 'agosto', 'setembro', 'outubro', 'novembro', 'dezembro'],
    data: (a, m, d, M) => `${Number(d)} de ${M[m - 1]} de ${a}`,
  },
  en: {
    lang: 'en', og: 'en_US', marca: 'Chess Online', base: '/en/learn', inicio: '/en', torneios: '/en/tournaments',
    pasta: 'en/learn', busca: '/en/learn/search.json',
    menu: { jogar: 'Play', aprenda: 'Learn', torneios: 'Tournaments', outro: 'PT', outroTitulo: 'Ler em português', rotulo: 'Main menu' },
    trilha: 'Learn',
    nivel: { iniciante: 'Beginner', intermediario: 'Intermediate', avancado: 'Advanced', dicas: 'Tips' },
    nivelDesc: {
      iniciante: 'From scratch: the pieces, the rules and the first ideas to play your first game.',
      intermediario: 'Tactics, plans and basic endgames to start winning consistently.',
      avancado: 'Strategy, calculation and technique for players who know the basics.',
      dicas: 'Formats, habits and practical advice to improve faster.',
    },
    nivelEmBreve: 'New guides for this level coming soon.',
    minLeitura: n => `${n} min read`,
    atualizado: d => `Updated ${d}`,
    publicado: d => `Published ${d}`,
    sumario: 'In this guide',
    proximo: 'Next step',
    proximoFim: 'You reached the end of the path. Go back to the index to review or pick another topic.',
    verTodos: 'See all guides',
    fimTorneio: u => `Or put what you learned to the test in a <a href="${u}">tournament</a>.`,
    licaoDe: (n, m) => `Lesson ${n} of ${m}`,
    pratique: 'Practice now',
    pratiqueTexto: 'Play against the computer and apply what you just learned. No sign-up, right in your browser.',
    pratiqueBotao: n => `▶ Play the AI (${n})`,
    dificuldade: { 1: 'Easy', 2: 'Medium', 3: 'Hard', 4: 'Expert' },
    relacionados: 'Read next',
    rodape: { jogar: 'Play', aprenda: 'Learn', torneios: 'Tournaments', privacidade: 'Privacy Policy', termos: 'Terms of Use', contato: 'Contact' },
    privacidade: '/en/privacy', termos: '/en/terms',
    indice: {
      titulo: 'Learn Chess: a Free Course from Beginner to Advanced',
      tituloSeo: 'Learn Chess: Free Course | Chess Online',
      h1: 'Learn Chess',
      descricao: 'A free chess course: rules, piece moves, tactics, openings, endgames and strategy, in one path from beginner to advanced.',
      lead: n => `A free chess course with ${n} lessons in 4 levels — Beginner, Intermediate, Advanced and Tips — from your first move to advanced play, with diagrams and interactive exercises. Never played? Start with lesson 1 and follow the order.`,
      comece: 'Start here: lesson 1 →',
      jogar: 'or play a game',
      buscaRotulo: 'Search the guides',
      buscaPlaceholder: 'Search: fork, castling, mate…',
      buscaNada: 'No guide found. Try "checkmate", "opening" or browse the path below.',
      buscaLimpar: 'Clear search',
      buscaUm: '1 guide found',
      buscaN: n => `${n} guides found`,
      licao: 'Lesson',
    },
    ex: {
      exercicio: 'Exercise', dica: 'Hint', solucao: 'Solution', verSolucao: 'Show solution', mostrarDica: 'Show hint',
      recomecar: 'Restart', explicacao: 'Why',
    },
    pagina404: {
      titulo: 'Page not found', texto: 'The address you opened does not exist (or has moved).',
      jogar: 'Play chess', aprenda: 'Learn chess', torneios: 'Tournaments',
    },
    meses: ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'],
    data: (a, m, d, M) => `${M[m - 1]} ${Number(d)}, ${a}`,
  },
};

function dataPorExtenso(iso, idioma) {
  const [a, m, d] = iso.split('-').map(Number);
  const t = T[idioma];
  return t.data(a, m, d, t.meses);
}

module.exports = { T, SITE, NIVEIS, dataPorExtenso };
