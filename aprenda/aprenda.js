/* Aprenda — exercício interativo e busca do índice (D-APR-04). Sem dependência.
 * O exercício usa window.XadrezMotor (aprenda/motor.js, GERADO do motor do jogo): legalidade idêntica à do jogo.
 * Sem JS a página já mostra o diagrama estático, a dica e a solução em <details>. */
(function () {
  'use strict';
  var EN = (document.documentElement.lang || '').slice(0, 2) === 'en';
  var T = EN ? {
    vez: function (c) { return 'Your move: ' + c + ' to play.'; }, brancas: 'White', pretas: 'Black',
    certo: 'Correct! Keep going…', resolvido: 'Solved! ✓', errado: 'Not that move — try again.', ilegal: 'That move is not legal.',
    respondeu: function (l) { return 'Opponent played ' + l + '. Your move.'; },
    mostrando: 'Solution:', dica: 'Show hint', solucao: 'Show solution', recomecar: 'Restart', tabuleiro: 'Exercise board',
    vazia: 'empty', pecas: { K: 'white king', Q: 'white queen', R: 'white rook', B: 'white bishop', N: 'white knight', P: 'white pawn',
      k: 'black king', q: 'black queen', r: 'black rook', b: 'black bishop', n: 'black knight', p: 'black pawn' },
    nomes: { k: 'King', q: 'Queen', r: 'Rook', b: 'Bishop', n: 'Knight', p: 'Pawn' },
    licao: 'Lesson', min: function (n) { return n + ' min read'; }, erroBusca: 'Search is unavailable right now.'
  } : {
    vez: function (c) { return 'Sua vez: jogam as ' + c + '.'; }, brancas: 'Brancas', pretas: 'Pretas',
    certo: 'Isso! Continue…', resolvido: 'Resolvido! ✓', errado: 'Não é esse lance — tente de novo.', ilegal: 'Esse lance não é legal.',
    respondeu: function (l) { return 'O adversário jogou ' + l + '. Sua vez.'; },
    mostrando: 'Solução:', dica: 'Mostrar dica', solucao: 'Ver solução', recomecar: 'Recomeçar', tabuleiro: 'Tabuleiro do exercício',
    vazia: 'vazia', pecas: { K: 'rei branco', Q: 'dama branca', R: 'torre branca', B: 'bispo branco', N: 'cavalo branco', P: 'peão branco',
      k: 'rei preto', q: 'dama preta', r: 'torre preta', b: 'bispo preto', n: 'cavalo preto', p: 'peão preto' },
    nomes: { k: 'Rei', q: 'Dama', r: 'Torre', b: 'Bispo', n: 'Cavalo', p: 'Peão' },
    licao: 'Lição', min: function (n) { return n + ' min de leitura'; }, erroBusca: 'A busca não está disponível agora.'
  };
  var GLIFO = { k: '♚', q: '♛', r: '♜', b: '♝', n: '♞', p: '♟' };
  var COLS = 'abcdefgh';
  function nome(i) { return COLS[i & 7] + (8 - (i >> 3)); }
  function uci(m) { return nome(m.from) + nome(m.to) + (m.promo ? m.promo.toLowerCase() : ''); }
  function corDe(p) { return p === p.toUpperCase() ? 'w' : 'b'; }
  function el(tag, cls, txt) { var e = document.createElement(tag); if (cls) e.className = cls; if (txt != null) e.textContent = txt; return e; }

  // ------------------------------------------------------------------ exercício
  function Exercicio(fig, X) {
    var dados = JSON.parse(fig.querySelector('.ex-dados').textContent);
    var e0 = X.lerFen(dados.fen);
    var virar = !!dados.virar;
    var dicaEl = fig.querySelector('.ex-dica p');
    var linhaEl = fig.querySelector('.ex-linha');
    var explEl = fig.querySelector('.ex-explicacao');
    var estado, passo, sel, ult, ocupado, fim, marcas = {};
    var timers = [];

    fig.querySelectorAll('details').forEach(function (d) { d.hidden = true; });
    var tabDiv = fig.querySelector('.ex-tab');
    tabDiv.textContent = '';
    var grade = el('div', 'tab-int');
    grade.setAttribute('role', 'group');
    grade.setAttribute('aria-label', T.tabuleiro);
    var casas = [];
    for (var k = 0; k < 64; k++) {
      var linhaTela = k >> 3, colTela = k & 7;
      var i = virar ? (7 - linhaTela) * 8 + (7 - colTela) : k;
      var b = el('button', 'casa ' + (((i >> 3) + (i & 7)) % 2 === 0 ? 'clara' : 'escura'));
      b.type = 'button';
      b.dataset.i = i;
      casas[i] = b;
      grade.appendChild(b);
    }
    tabDiv.appendChild(grade);
    var status = el('p', 'ex-status');
    status.setAttribute('role', 'status');
    status.setAttribute('aria-live', 'polite');
    var acoes = el('div', 'ex-acoes');
    var bDica = el('button', null, T.dica), bSol = el('button', null, T.solucao), bRec = el('button', null, T.recomecar);
    [bDica, bSol, bRec].forEach(function (x) { x.type = 'button'; acoes.appendChild(x); });
    var texto = el('div', 'ex-texto');
    texto.hidden = true;
    tabDiv.parentNode.insertBefore(status, tabDiv.nextSibling);
    status.parentNode.insertBefore(acoes, status.nextSibling);
    acoes.parentNode.insertBefore(texto, acoes.nextSibling);

    function msg(t, tipo) { status.textContent = t; status.className = 'ex-status' + (tipo ? ' ' + tipo : ''); }
    function vezTxt() { return T.vez(estado.turn === 'w' ? T.brancas : T.pretas); }
    function mostrarTexto(nos) {
      texto.textContent = '';
      nos.forEach(function (n) { if (n) { var p = el('p'); p.innerHTML = n.innerHTML; texto.appendChild(p); } });
      texto.hidden = false;
    }

    function desenhar() {
      var alvos = {};
      if (sel !== null) X.legais(estado).forEach(function (m) { if (m.from === sel) alvos[m.to] = true; });
      for (var i = 0; i < 64; i++) {
        var b = casas[i], p = estado.board[i];
        b.textContent = '';
        if (p) { var s = el('span', 'peca ' + (corDe(p) === 'w' ? 'b' : 'p'), GLIFO[p.toLowerCase()] + '︎'); s.setAttribute('aria-hidden', 'true'); b.appendChild(s); }
        var linhaTela = virar ? 7 - (i >> 3) : i >> 3, colTela = virar ? 7 - (i & 7) : i & 7;
        if (colTela === 0) { var f = el('span', 'coord f', String(8 - (i >> 3))); f.setAttribute('aria-hidden', 'true'); b.appendChild(f); }
        if (linhaTela === 7) { var c = el('span', 'coord c', COLS[i & 7]); c.setAttribute('aria-hidden', 'true'); b.appendChild(c); }
        b.setAttribute('aria-label', nome(i) + ', ' + (p ? T.pecas[p] : T.vazia));
        b.classList.toggle('sel', sel === i);
        b.classList.toggle('alvo', !!alvos[i] && !p);
        b.classList.toggle('alvo-cap', !!alvos[i] && !!p);
        b.classList.toggle('ult', !!ult && (ult.from === i || ult.to === i));
        b.classList.toggle('dica-casa', marcas.dica === i);
        b.classList.toggle('errada', !!marcas.erro && (marcas.erro.from === i || marcas.erro.to === i));
        b.setAttribute('aria-pressed', sel === i ? 'true' : 'false');
      }
      grade.setAttribute('aria-disabled', ocupado || fim ? 'true' : 'false');
      bDica.disabled = fim || ocupado;
      bSol.disabled = ocupado;
    }

    function limparTimers() { timers.forEach(clearTimeout); timers = []; }
    function reiniciar() {
      limparTimers();
      estado = e0; passo = 0; sel = null; ult = null; ocupado = false; fim = false; marcas = {};
      texto.hidden = true;
      msg(vezTxt());
      desenhar();
    }
    function lanceDe(u) { return X.legais(estado).filter(function (m) { return uci(m) === u; })[0]; }
    function ehMate(e) { return X.legais(e).length === 0 && X.inCheck(e.turn, e.board); }
    function descreve(m, antes) { var p = antes.board[m.from]; return T.nomes[p.toLowerCase()] + ' ' + nome(m.from) + '–' + nome(m.to); }
    function aplicar(m) { estado = X.jogar(estado, m); ult = m; sel = null; marcas = {}; }
    function resolvido() {
      fim = true;
      msg(T.resolvido, 'ok');
      mostrarTexto([linhaEl, explEl]);
      desenhar();
    }

    function tentar(m) {
      var esperados = dados.sol[passo];
      var ultimo = passo === dados.sol.length - 1;
      var ok = esperados.indexOf(uci(m)) >= 0;
      if (!ok && ultimo && dados.tipo === 'mate' && ehMate(X.jogar(estado, m))) ok = true;   // outro mate também vale
      if (!ok) {
        marcas = { erro: m }; sel = null;
        msg(T.errado, 'erro');
        desenhar();
        timers.push(setTimeout(function () { if (marcas.erro === m) { marcas = {}; desenhar(); } }, 900));
        return;
      }
      aplicar(m);
      passo++;
      if (passo >= dados.sol.length) { resolvido(); return; }
      ocupado = true;
      msg(T.certo, 'ok');
      desenhar();
      timers.push(setTimeout(function () {
        var antes = estado, r = lanceDe(dados.sol[passo][0]);
        aplicar(r);
        passo++;
        ocupado = false;
        msg(T.respondeu(descreve(r, antes)));
        desenhar();
      }, 600));
    }

    grade.addEventListener('click', function (ev) {
      var b = ev.target.closest('.casa');
      if (!b || ocupado || fim) return;
      var i = Number(b.dataset.i), p = estado.board[i];
      if (sel === null || (p && corDe(p) === estado.turn && i !== sel)) {
        if (p && corDe(p) === estado.turn) { sel = i; marcas = {}; desenhar(); }
        return;
      }
      if (i === sel) { sel = null; desenhar(); return; }
      var cands = X.legais(estado).filter(function (m) { return m.from === sel && m.to === i; });
      if (!cands.length) { sel = null; msg(T.ilegal, 'erro'); desenhar(); return; }
      var esperado = dados.sol[passo].join(' ');
      var m = cands.filter(function (x) { return esperado.indexOf(uci(x)) >= 0; })[0]
        || cands.filter(function (x) { return !x.promo || x.promo.toLowerCase() === 'q'; })[0] || cands[0];
      tentar(m);
    });
    bRec.addEventListener('click', reiniciar);
    bDica.addEventListener('click', function () {
      if (fim || ocupado) return;
      var m = lanceDe(dados.sol[passo][0]);
      marcas = { dica: m ? m.from : -1 };
      mostrarTexto([dicaEl]);
      desenhar();
    });
    bSol.addEventListener('click', function () {
      reiniciar();
      ocupado = true;
      desenhar();
      dados.sol.forEach(function (alts, k) {
        timers.push(setTimeout(function () {
          aplicar(lanceDe(alts[0]));
          if (k === dados.sol.length - 1) {
            ocupado = false; fim = true;
            msg(T.mostrando);
            mostrarTexto([linhaEl, explEl]);
          }
          desenhar();
        }, 450 + k * 750));
      });
    });
    reiniciar();
  }

  function iniciarExercicios() {
    var figs = document.querySelectorAll('figure[data-exercicio]');
    if (!figs.length || !window.XadrezMotor) return;
    figs.forEach(function (f) {
      try { Exercicio(f, window.XadrezMotor); } catch (e) { if (window.console) console.error('exercício', e); }
    });
  }

  // ------------------------------------------------------------------ busca do índice
  function iniciarBusca() {
    var caixa = document.getElementById('busca');
    if (!caixa || !window.fetch) return;
    var campo = document.getElementById('busca-campo');
    var st = document.getElementById('busca-status');
    var res = document.getElementById('busca-res');
    var trilha = document.getElementById('trilha');
    var lista = null, promessa = null, timer = null;
    caixa.hidden = false;
    function norm(s) { return String(s || '').normalize('NFD').replace(/[̀-ͯ]/g, '').toLowerCase(); }
    function carregar() {
      if (!promessa) {
        promessa = fetch(caixa.getAttribute('data-indice')).then(function (r) { if (!r.ok) throw new Error(r.status); return r.json(); })
          .then(function (j) {
            lista = j.map(function (d) {
              d._t = norm(d.t); d._g = norm(d.g); d._d = norm(d.d);
              d._tudo = norm([d.t, d.d, d.g, d.h, d.nr, d.x].join(' '));
              return d;
            });
          });
        promessa.catch(function () { promessa = null; });
      }
      return promessa;
    }
    function cartao(d) {
      var li = el('li'), a = el('a', 'card');
      a.href = d.u;
      var num = el('span', 'card-num', String(d.p)); num.setAttribute('aria-hidden', 'true');
      var corpo = el('span', 'card-corpo');
      var meta = el('span', 'card-meta');
      meta.appendChild(el('span', 'selo nivel-' + d.n, d.nr));
      meta.appendChild(document.createTextNode(' · ' + T.licao + ' ' + d.p + ' · ' + T.min(d.m)));
      corpo.appendChild(meta);
      corpo.appendChild(el('h3', 'card-titulo', d.t));
      corpo.appendChild(el('span', 'card-desc', d.d));
      a.appendChild(num); a.appendChild(corpo); li.appendChild(a);
      return li;
    }
    function buscar() {
      var q = norm(campo.value).trim();
      if (!q) { res.hidden = true; res.textContent = ''; trilha.hidden = false; st.textContent = ''; return; }
      carregar().then(function () {
        if (norm(campo.value).trim() !== q) return;
        var termos = q.split(/\s+/);
        var achados = [];
        lista.forEach(function (d) {
          for (var k = 0; k < termos.length; k++) if (d._tudo.indexOf(termos[k]) < 0) return;
          var s = 0;
          termos.forEach(function (t) { if (d._t.indexOf(t) >= 0) s += 10; if (d._g.indexOf(t) >= 0) s += 5; if (d._d.indexOf(t) >= 0) s += 3; });
          achados.push({ d: d, s: s });
        });
        achados.sort(function (a, b) { return b.s - a.s; });
        res.textContent = '';
        achados.forEach(function (x) { res.appendChild(cartao(x.d)); });
        st.textContent = achados.length === 0 ? st.getAttribute('data-nada') : achados.length === 1 ? st.getAttribute('data-um') : st.getAttribute('data-n').replace('{n}', achados.length);
        res.hidden = achados.length === 0;
        trilha.hidden = true;
      }).catch(function () { st.textContent = T.erroBusca; });
    }
    campo.addEventListener('focus', function () { carregar().catch(function () {}); });
    campo.addEventListener('input', function () { clearTimeout(timer); timer = setTimeout(buscar, 120); });
    campo.addEventListener('search', buscar);
    var q0 = new URLSearchParams(location.search).get('q');
    if (q0) { campo.value = q0; buscar(); }
  }

  function iniciar() { iniciarExercicios(); iniciarBusca(); }
  if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', iniciar); else iniciar();
})();
