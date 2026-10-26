/* Formulário de contato (/contato e /en/contact, D-CON-05). Escrito à mão; a página é gerada por aprenda/gerador.
 * Fala com POST /functions/v1/contato (servidor/realtime/contato.js). Logado: preenche nome e e-mail e manda o token
 * da sessão do supabase-js (o servidor grava o user_id). Os códigos de erro são os do servidor. */
(function () {
  'use strict';
  var EN = (document.documentElement.lang || '').slice(0, 2) === 'en';
  var EMAIL = 'contato@xadrezonline.app';
  var MAX = 4000, MIN = 10, MAX_LINKS = 3;
  var SUPA_JS = 'https://cdn.jsdelivr.net/npm/@supabase/supabase-js@2/dist/umd/supabase.min.js';
  var COM_LINK = { problema: 1, pagamento: 1 };
  var M = EN ? {
    nome: 'Please type your name.',
    nome_longo: 'Your name can have up to 100 characters.',
    email: 'Please type your email: that is where we will reply.',
    email_invalido: 'This email does not look right. Please check it (e.g. name@gmail.com).',
    assunto: 'Please choose a subject.',
    mensagem_curta: 'Please write your message (at least 10 characters).',
    mensagem_longa: 'Your message can have up to 4,000 characters.',
    links: 'To prevent spam, the message can have at most 3 links.',
    link: 'Use the address of a xadrezonline.app page (the tournament or the game), or leave it blank.',
    rapido: 'Whoa, that was fast! Wait a few seconds and send it again.',
    limite: 'You have sent too many messages in a short time. Try again in an hour, or write to ' + EMAIL + '.',
    limite_geral: 'We are receiving too many messages right now. Try again later, or write to ' + EMAIL + '.',
    grande: 'The message is too big. Shorten it and try again.',
    rede: 'We could not send it right now (no connection, or the server is down). Try again in a moment, or write to ' + EMAIL + '.',
    falha: 'Something went wrong on our side. Try again in a moment, or write to ' + EMAIL + '.',
    corrija: 'Please check the highlighted field.',
    enviando: 'Sending…',
    conta: function (n) { return 'You are signed in as ' + n + ': your message will be linked to your account.'; },
    ok: function (n, e) { return 'Thank you, ' + n + '! We got your message and will reply to ' + e + '. If you don’t see our answer in a few days, check your spam folder.'; },
    restam: function (n) { return n + ' characters left.'; },
    limiteAtingido: 'You reached the 4,000-character limit.',
    num: function (n) { return n.toLocaleString('en-US'); }
  } : {
    nome: 'Escreva seu nome.',
    nome_longo: 'O nome pode ter até 100 caracteres.',
    email: 'Escreva seu e-mail: é por ele que vamos responder.',
    email_invalido: 'Esse e-mail não parece certo. Confira (ex.: nome@gmail.com).',
    assunto: 'Escolha um assunto.',
    mensagem_curta: 'Escreva sua mensagem (pelo menos 10 caracteres).',
    mensagem_longa: 'A mensagem pode ter até 4.000 caracteres.',
    links: 'Para evitar spam, a mensagem pode ter no máximo 3 links.',
    link: 'Use o endereço de uma página do xadrezonline.app (do torneio ou da partida), ou deixe em branco.',
    rapido: 'Opa, rápido demais! Espere alguns segundos e envie de novo.',
    limite: 'Você enviou muitas mensagens em pouco tempo. Tente de novo daqui a uma hora ou escreva para ' + EMAIL + '.',
    limite_geral: 'Estamos recebendo muitas mensagens agora. Tente de novo mais tarde ou escreva para ' + EMAIL + '.',
    grande: 'A mensagem ficou grande demais. Encurte o texto e tente de novo.',
    rede: 'Não deu para enviar agora (sem conexão ou servidor fora do ar). Tente de novo em instantes ou escreva para ' + EMAIL + '.',
    falha: 'Algo deu errado do nosso lado. Tente de novo em instantes ou escreva para ' + EMAIL + '.',
    corrija: 'Confira o campo destacado.',
    enviando: 'Enviando…',
    conta: function (n) { return 'Você está conectado como ' + n + ': a mensagem fica ligada à sua conta.'; },
    ok: function (n, e) { return 'Obrigado, ' + n + '! Recebemos sua mensagem e vamos responder no e-mail ' + e + '. Se a resposta não aparecer em alguns dias, confira a caixa de spam.'; },
    restam: function (n) { return 'Restam ' + n + ' caracteres.'; },
    limiteAtingido: 'Você chegou ao limite de 4.000 caracteres.',
    num: function (n) { return n.toLocaleString('pt-BR'); }
  };
  var RE_EMAIL = /^[^\s@<>()[\]\\,;:"]{1,64}@(?=.{1,253}$)[A-Za-z0-9](?:[A-Za-z0-9-]{0,61}[A-Za-z0-9])?(?:\.[A-Za-z0-9](?:[A-Za-z0-9-]{0,61}[A-Za-z0-9])?)*\.[A-Za-z]{2,63}$/;

  var $ = function (id) { return document.getElementById(id); };
  var form = $('contato-form');
  if (!form || !window.fetch) return;   // sem fetch: fica a página com o e-mail (mailto)
  var campos = { nome: $('c-nome'), email: $('c-email'), assunto: $('c-assunto'), link: $('c-link'), mensagem: $('c-mensagem') };
  var botao = $('c-enviar'), erroGeral = $('c-erro'), contador = $('c-contador'), avisoContador = $('c-contador-aviso');
  var campoLink = $('c-campo-link'), ok = $('c-ok');
  var token = null, tokenEm = 0, enviando = false;

  function linkValido(s) {
    try {
      var u = new URL(s);
      return (u.protocol === 'https:' || u.protocol === 'http:') && (u.hostname === 'xadrezonline.app' || /\.xadrezonline\.app$/.test(u.hostname));
    } catch (e) { return false; }
  }

  // ---------- horário assinado (o servidor recusa envio feito menos de 3 s depois dele)
  function pedirToken() {
    return fetch('/functions/v1/contato', { cache: 'no-store' }).then(function (r) { return r.json(); })
      .then(function (j) { if (j && j.token) { token = j.token; tokenEm = Date.now(); } }).catch(function () {});
  }
  var esperar = function (ms) { return new Promise(function (ok) { setTimeout(ok, ms); }); };

  // ---------- sessão do site (supabase-js no localStorage): só carrega a biblioteca se houver uma
  var clientePromessa = null;
  function temSessao() {
    try {
      for (var i = 0; i < localStorage.length; i++) if (/^sb-.+-auth-token$/.test(localStorage.key(i) || '')) return true;
    } catch (e) { /* armazenamento bloqueado */ }
    return false;
  }
  function carregar(src) {
    return new Promise(function (ok, falha) {
      var s = document.createElement('script'); s.src = src; s.onload = ok; s.onerror = falha; document.head.appendChild(s);
    });
  }
  function cliente() {
    if (!clientePromessa) {
      clientePromessa = (temSessao() ? Promise.resolve()
        .then(function () { return window.XADREZ_CONFIG ? null : carregar('/config.js'); })
        .then(function () { return window.supabase ? null : carregar(SUPA_JS); })
        .then(function () { return window.supabase.createClient(location.origin, window.XADREZ_CONFIG.anon); })
        : Promise.resolve(null)).catch(function () { return null; });
    }
    return clientePromessa;
  }
  function sessao() {
    return cliente().then(function (c) {
      if (!c) return null;
      return c.auth.getSession().then(function (r) { return (r && r.data && r.data.session) || null; }).catch(function () { return null; });
    });
  }

  // ---------- campos
  function mostrarLink() {
    var com = !!COM_LINK[campos.assunto.value];
    campoLink.hidden = !com;
  }
  function atualizarContador() {
    var n = campos.mensagem.value.length;
    contador.textContent = M.num(n) + ' / ' + M.num(MAX);
    contador.classList.toggle('perto', n >= MAX - 200);
    var aviso = n >= MAX ? M.limiteAtingido : n >= MAX - 200 ? M.restam(M.num(MAX - n)) : '';
    if (aviso !== avisoContador.textContent) avisoContador.textContent = aviso;
  }
  function erroCampo(nome, msg) {
    var el = campos[nome], p = $('c-' + nome + '-erro');
    if (!el || !p) return;
    p.textContent = msg || '';
    if (msg) el.setAttribute('aria-invalid', 'true'); else el.removeAttribute('aria-invalid');
  }
  function limparErros() {
    Object.keys(campos).forEach(function (k) { erroCampo(k, ''); });
    erroGeral.textContent = '';
  }
  function dados() {
    var assunto = campos.assunto.value;
    return {
      nome: campos.nome.value.trim(), email: campos.email.value.trim(), assunto: assunto,
      link: COM_LINK[assunto] ? campos.link.value.trim() : '', mensagem: campos.mensagem.value.trim(),
      site_web: $('c-site').value, idioma: EN ? 'en' : 'pt'
    };
  }
  function validar(d) {
    var e = [];
    if (!d.nome) e.push(['nome', 'nome']); else if (d.nome.length > 100) e.push(['nome', 'nome_longo']);
    if (!d.email) e.push(['email', 'email']); else if (d.email.length > 254 || !RE_EMAIL.test(d.email)) e.push(['email', 'email_invalido']);
    if (!d.assunto) e.push(['assunto', 'assunto']);
    if (d.link && (d.link.length > 500 || !linkValido(d.link))) e.push(['link', 'link']);
    if (d.mensagem.length < MIN) e.push(['mensagem', 'mensagem_curta']);
    else if (d.mensagem.length > MAX) e.push(['mensagem', 'mensagem_longa']);
    else if ((d.mensagem.match(/https?:\/\/|www\./gi) || []).length > MAX_LINKS) e.push(['mensagem', 'links']);
    return e;
  }
  function mostrarErros(lista) {
    lista.forEach(function (x) { erroCampo(x[0], M[x[1]]); });
    erroGeral.textContent = M.corrija;
    var primeiro = campos[lista[0][0]];
    if (primeiro) primeiro.focus();
  }

  function postar(d, sess) {
    var cab = { 'Content-Type': 'application/json' };
    if (sess && sess.access_token) cab.Authorization = 'Bearer ' + sess.access_token;
    var corpo = Object.assign({ token: token }, d);
    return fetch('/functions/v1/contato', { method: 'POST', headers: cab, body: JSON.stringify(corpo), cache: 'no-store' })
      .then(function (r) {
        return r.json().catch(function () { return {}; }).then(function (j) { return { status: r.status, j: j || {} }; });
      });
  }

  function ocupado(sim) {
    enviando = sim;
    botao.disabled = sim;
    botao.setAttribute('aria-busy', sim ? 'true' : 'false');
    botao.textContent = sim ? M.enviando : botao.dataset.rotulo;
  }

  function sucesso(d) {
    form.hidden = true;
    $('c-ok-texto').textContent = M.ok(d.nome, d.email);
    ok.hidden = false;
    $('c-ok-titulo').focus();
    window.scrollTo({ top: 0 });
  }

  form.addEventListener('submit', function (ev) {
    ev.preventDefault();
    if (enviando) return;
    limparErros();
    var d = dados();
    var errosCampos = validar(d);
    if (errosCampos.length) { mostrarErros(errosCampos); return; }
    ocupado(true);
    // sem horário assinado (pedido falhou) ou recém-pedido: pede/espera o mínimo antes de enviar
    (token ? Promise.resolve() : pedirToken())
      .then(function () { var falta = 3100 - (Date.now() - tokenEm); return falta > 0 ? esperar(falta) : null; })
      .then(function () { return sessao(); })
      .then(function (sess) {
        return postar(d, sess).then(function (r) {
          // horário vencido (página aberta há mais de 24 h) ou inválido: o servidor manda outro; reenvia uma vez
          if (r.status === 422 && r.j.erro === 'token' && r.j.token) {
            token = r.j.token; tokenEm = Date.now();
            return esperar(3100).then(function () { return postar(d, sess); });
          }
          return r;
        });
      })
      .then(function (r) {
        ocupado(false);
        if (r.j.ok) { sucesso(d); return; }
        var cod = r.j.erro;
        if (r.status === 429) { erroGeral.textContent = r.j.motivo === 'limite_geral' ? M.limite_geral : M.limite; return; }
        if (r.status === 413) { erroGeral.textContent = M.grande; return; }
        if (r.j.campo && campos[r.j.campo] && M[cod]) { mostrarErros([[r.j.campo, cod]]); return; }
        erroGeral.textContent = M[cod] && cod !== 'token' ? M[cod] : M.falha;
      })
      .catch(function () { ocupado(false); erroGeral.textContent = M.rede; });
  });

  $('c-outra').addEventListener('click', function () {
    campos.mensagem.value = ''; campos.link.value = ''; atualizarContador();
    ok.hidden = true; form.hidden = false;
    token = null; pedirToken();
    campos.mensagem.focus();
  });
  campos.assunto.addEventListener('change', function () { mostrarLink(); erroCampo('assunto', ''); });
  campos.mensagem.addEventListener('input', atualizarContador);
  ['nome', 'email', 'link', 'mensagem'].forEach(function (k) {
    campos[k].addEventListener('input', function () { if (campos[k].hasAttribute('aria-invalid')) erroCampo(k, ''); });
  });

  // ---------- início: o formulário só aparece com JS (sem JS fica o e-mail)
  botao.dataset.rotulo = botao.textContent;
  var q = new URLSearchParams(location.search);
  var qa = q.get('assunto');
  if (qa && campos.assunto.querySelector('option[value="' + qa.replace(/[^a-z]/g, '') + '"]')) campos.assunto.value = qa;
  var ql = q.get('link');
  if (ql && linkValido(ql)) campos.link.value = ql.slice(0, 500);
  mostrarLink();
  atualizarContador();
  form.hidden = false;
  pedirToken();
  sessao().then(function (s) {
    if (!s || !s.user) return;
    var u = s.user, md = u.user_metadata || {};
    var nome = (md.full_name || md.name || '').trim();
    if (nome && !campos.nome.value) campos.nome.value = nome.slice(0, 100);
    if (u.email && !campos.email.value) campos.email.value = u.email;
    var conta = $('c-conta');
    conta.textContent = M.conta(nome || u.email || '');
    conta.hidden = false;
  });
})();
