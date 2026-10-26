'use strict';
/** Textos de interface do Aprenda, por idioma. O conteúdo dos artigos vem de aprenda/fonte/<idioma>/. */

const SITE = 'https://xadrezonline.app';

const NIVEIS = ['iniciante', 'intermediario', 'avancado', 'dicas'];

/** assuntos do formulário de contato: os MESMOS códigos e textos de servidor/realtime/contato.js (ASSUNTOS) */
const ASSUNTOS_CONTATO = [
  ['duvida', 'Dúvida', 'Question'], ['sugestao', 'Sugestão', 'Suggestion'], ['problema', 'Problema no site', 'Site problem'],
  ['pagamento', 'Pagamento / estorno de torneio', 'Tournament payment / refund'],
  ['parceria', 'Parceria / imprensa', 'Partnership / press'], ['outro', 'Outro', 'Other'],
];
const EMAIL_CONTATO = 'contato@xadrezonline.app';

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
    voltarTrilha: (u1, base) => `Volte para a trilha: <a href="${u1}">comece pela lição 1</a> ou <a href="${base}">veja todos os guias</a>.`,
    fimTorneio: u => `Ou teste o que aprendeu num <a href="${u}">torneio</a>.`,
    licaoDe: (n, m) => `Lição ${n} de ${m}`,
    pratique: 'Pratique agora',
    pratiqueTexto: 'Jogue contra o computador e aplique o que acabou de aprender. Sem cadastro, direto no navegador.',
    pratiqueBotao: n => `▶ Jogar contra a IA (${n})`,
    pratiqueTutorial: '▶ Abrir o modo 🎓 Aprendiz',
    dificuldade: { 1: 'Fácil', 2: 'Médio', 3: 'Difícil', 4: 'Expert' },
    relacionados: 'Leia também',
    rodape: { jogar: 'Jogar', aprenda: 'Aprenda', torneios: 'Torneios', privacidade: 'Política de Privacidade', termos: 'Termos de Uso', contato: 'Contato' },
    privacidade: '/privacidade', termos: '/termos', contato: '/contato',
    paginaContato: {
      titulo: 'Contato | Xadrez Online',
      h1: 'Fale com a gente',
      descricao: 'Fale com o Xadrez Online: dúvidas, sugestões, problemas no site ou com o pagamento de um torneio. Respondemos por e-mail.',
      lead: 'Dúvida, sugestão, problema no site ou com o pagamento de um torneio? Escreva aqui: respondemos por e-mail.',
      prefere: 'Prefere e-mail? Escreva para',
      semJs: 'O formulário precisa de JavaScript ligado. Escreva direto para',
      nome: 'Seu nome', email: 'Seu e-mail', emailDica: 'É por ele que vamos responder.',
      assunto: 'Assunto', escolha: 'Escolha o assunto…',
      link: 'Link do torneio ou da partida', opcional: '(opcional)',
      linkDica: 'Copie o endereço da página do torneio ou da partida: ajuda a achar o caso mais rápido.',
      mensagem: 'Mensagem', hp: 'Não preencha este campo',
      enviar: 'Enviar mensagem',
      privacidade: 'Usamos seus dados só para responder. Veja a <a href="/privacidade">Política de Privacidade</a>.',
      okTitulo: 'Mensagem enviada ✓', outra: 'Enviar outra mensagem', voltar: 'Voltar ao jogo',
    },
    indice: {
      titulo: 'Aprenda Xadrez: Curso Gratuito do Zero ao Avançado',
      tituloSeo: 'Aprenda Xadrez: Curso Gratuito | Xadrez Online',
      h1: 'Aprenda Xadrez',
      descricao: 'Curso de xadrez gratuito em português: regras, movimentos, táticas, aberturas, finais e estratégia, em uma trilha do iniciante ao avançado.',
      lead: n => `Curso de xadrez gratuito: ${n} lições em 4 níveis, do primeiro lance ao jogo avançado, com diagramas e exercícios interativos.`,
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
    voltarTrilha: (u1, base) => `Back to the path: <a href="${u1}">start with lesson 1</a>, or <a href="${base}">see all guides</a>.`,
    fimTorneio: u => `Or put what you learned to the test in a <a href="${u}">tournament</a>.`,
    licaoDe: (n, m) => `Lesson ${n} of ${m}`,
    pratique: 'Practice now',
    pratiqueTexto: 'Play against the computer and apply what you just learned. No sign-up, right in your browser.',
    pratiqueBotao: n => `▶ Play the AI (${n})`,
    pratiqueTutorial: '▶ Open 🎓 Beginner mode',
    dificuldade: { 1: 'Easy', 2: 'Medium', 3: 'Hard', 4: 'Expert' },
    relacionados: 'Read next',
    rodape: { jogar: 'Play', aprenda: 'Learn', torneios: 'Tournaments', privacidade: 'Privacy Policy', termos: 'Terms of Use', contato: 'Contact' },
    privacidade: '/en/privacy', termos: '/en/terms', contato: '/en/contact',
    paginaContato: {
      titulo: 'Contact us | Chess Online',
      h1: 'Contact us',
      descricao: 'Contact Chess Online: questions, suggestions, problems with the site or with a tournament payment. We reply by email.',
      lead: 'A question, a suggestion, a problem with the site or with a tournament payment? Write to us here: we reply by email.',
      prefere: 'Prefer email? Write to',
      semJs: 'The form needs JavaScript turned on. Write directly to',
      nome: 'Your name', email: 'Your email', emailDica: 'We will reply to this address.',
      assunto: 'Subject', escolha: 'Choose a subject…',
      link: 'Link to the tournament or game', opcional: '(optional)',
      linkDica: 'Copy the address of the tournament or game page: it helps us find the case faster.',
      mensagem: 'Message', hp: 'Do not fill in this field',
      enviar: 'Send message',
      privacidade: 'We only use your data to reply. See the <a href="/en/privacy">Privacy Policy</a>.',
      okTitulo: 'Message sent ✓', outra: 'Send another message', voltar: 'Back to the game',
    },
    indice: {
      titulo: 'Learn Chess: a Free Course from Beginner to Advanced',
      tituloSeo: 'Learn Chess: Free Course | Chess Online',
      h1: 'Learn Chess',
      descricao: 'A free chess course: rules, piece moves, tactics, openings, endgames and strategy, in one path from beginner to advanced.',
      lead: n => `A free chess course: ${n} lessons in 4 levels, from your first move to advanced play, with diagrams and interactive exercises.`,
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

module.exports = { T, SITE, NIVEIS, dataPorExtenso, ASSUNTOS_CONTATO, EMAIL_CONTATO };
