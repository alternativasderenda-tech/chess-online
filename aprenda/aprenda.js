/* Aprenda — exercício interativo e busca do índice (D-APR-04, D-APR-13…16). Sem dependência.
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
    instrucao: 'Use the arrow keys to move and Enter to select. You can also click, tap or drag the pieces.',
    toque: 'Tap a piece, then a square (or drag it).',
    vazia: 'empty', pecas: { K: 'white king', Q: 'white queen', R: 'white rook', B: 'white bishop', N: 'white knight', P: 'white pawn',
      k: 'black king', q: 'black queen', r: 'black rook', b: 'black bishop', n: 'black knight', p: 'black pawn' },
    nomes: { k: 'King', q: 'Queen', r: 'Rook', b: 'Bishop', n: 'Knight', p: 'Pawn' },
    promoTitulo: 'Choose the promotion piece',
    promoErrada: { q: 'A queen', r: 'A rook', b: 'A bishop', n: 'A knight' },
    promoErradaFim: ' doesn’t solve it here — choose another promotion piece.',
    licao: 'Lesson', min: function (n) { return n + ' min read'; }, erroBusca: 'Search is unavailable right now.',
    noNivel: function (n) { return ' — ' + n + ' only'; }
  } : {
    vez: function (c) { return 'Sua vez: jogam as ' + c + '.'; }, brancas: 'Brancas', pretas: 'Pretas',
    certo: 'Isso! Continue…', resolvido: 'Resolvido! ✓', errado: 'Não é esse lance — tente de novo.', ilegal: 'Esse lance não é legal.',
    respondeu: function (l) { return 'O adversário jogou ' + l + '. Sua vez.'; },
    mostrando: 'Solução:', dica: 'Mostrar dica', solucao: 'Ver solução', recomecar: 'Recomeçar', tabuleiro: 'Tabuleiro do exercício',
    instrucao: 'Use as setas para escolher a casa e Enter para selecionar. Também dá para clicar, tocar ou arrastar as peças.',
    toque: 'Toque na peça e depois na casa (ou arraste).',
    vazia: 'vazia', pecas: { K: 'rei branco', Q: 'dama branca', R: 'torre branca', B: 'bispo branco', N: 'cavalo branco', P: 'peão branco',
      k: 'rei preto', q: 'dama preta', r: 'torre preta', b: 'bispo preto', n: 'cavalo preto', p: 'peão preto' },
    nomes: { k: 'Rei', q: 'Dama', r: 'Torre', b: 'Bispo', n: 'Cavalo', p: 'Peão' },
    promoTitulo: 'Escolha a peça da promoção',
    promoErrada: { q: 'A dama', r: 'A torre', b: 'O bispo', n: 'O cavalo' },
    promoErradaFim: ' não resolve aqui — escolha outra peça na promoção.',
    licao: 'Lição', min: function (n) { return n + ' min de leitura'; }, erroBusca: 'A busca não está disponível agora.',
    noNivel: function (n) { return ' — só ' + n; }
  };
  var GLIFO = { k: '♚', q: '♛', r: '♜', b: '♝', n: '♞', p: '♟' };
  var PROMO = ['q', 'r', 'b', 'n'];   // ordem do seletor: Dama, Torre, Bispo, Cavalo
  var COLS = 'abcdefgh';
  function nome(i) { return COLS[i & 7] + (8 - (i >> 3)); }
  function uci(m) { return nome(m.from) + nome(m.to) + (m.promo ? m.promo.toLowerCase() : ''); }
  function corDe(p) { return p === p.toUpperCase() ? 'w' : 'b'; }
  function el(tag, cls, txt) { var e = document.createElement(tag); if (cls) e.className = cls; if (txt != null) e.textContent = txt; return e; }
  function glifo(p) { var s = el('span', 'peca ' + (corDe(p) === 'w' ? 'b' : 'p'), GLIFO[p.toLowerCase()] + '︎'); s.setAttribute('aria-hidden', 'true'); return s; }

  // ------------------------------------------------------------------ exercício
  function Exercicio(fig, X) {
    var dados = JSON.parse(fig.querySelector('.ex-dados').textContent);
    var e0 = X.lerFen(dados.fen);
    var virar = !!dados.virar;
    var dicaEl = fig.querySelector('.ex-dica p');
    var linhaEl = fig.querySelector('.ex-linha');
    var explEl = fig.querySelector('.ex-explicacao');
    var estado, passo, sel, ult, ocupado, fim, marcas = {};
    var foco = null;          // casa com tabindex=0 (roving tabindex: uma parada de Tab por tabuleiro)
    var promo = null;         // seletor de promoção aberto: { caixa, fundo, de }
    var arr = null;           // arrasto em curso
    var ignorarClique = false;
    var timers = [];

    fig.querySelectorAll('details').forEach(function (d) { d.hidden = true; });
    var tabDiv = fig.querySelector('.ex-tab');
    tabDiv.textContent = '';
    var grade = el('div', 'tab-int');
    grade.setAttribute('role', 'group');
    grade.setAttribute('aria-label', T.tabuleiro);
    var enun = fig.querySelector('.ex-enunciado');
    var instr = el('p', 'sr-only', T.instrucao);
    instr.id = (fig.id || 'ex') + '-instrucao';
    var descr = [instr.id];
    if (enun) { if (!enun.id) enun.id = (fig.id || 'ex') + '-enunciado'; descr.unshift(enun.id); }
    grade.setAttribute('aria-describedby', descr.join(' '));
    var casas = [], tela = [];   // casas[i] (0 = a8 … 63 = h1) e tela[k] (ordem na tela, já virada)
    for (var k = 0; k < 64; k++) {
      var linhaTela = k >> 3, colTela = k & 7;
      var i = virar ? (7 - linhaTela) * 8 + (7 - colTela) : k;
      var b = el('button', 'casa ' + (((i >> 3) + (i & 7)) % 2 === 0 ? 'clara' : 'escura'));
      b.type = 'button';
      b.dataset.i = i;
      b.dataset.k = k;
      b.tabIndex = -1;
      casas[i] = b;
      tela[k] = b;
      grade.appendChild(b);
    }
    tabDiv.appendChild(grade);
    tabDiv.appendChild(instr);
    // LAY-widget-25: em tela de toque o arrasto vertical rola a página; a dica visível ensina o toque-toque. Fica FORA
    // de .ex-tab (LAY-widget-28: dentro, mudava a altura de que o seletor de promoção depende) e não se repete ao remontar
    var velhaDica = fig.querySelector('.ex-instr-toque');
    if (velhaDica) velhaDica.remove();
    tabDiv.insertAdjacentElement('afterend', el('p', 'ex-instr-toque', T.toque));
    var status = el('p', 'ex-status');
    status.setAttribute('role', 'status');
    status.setAttribute('aria-live', 'polite');
    var acoes = el('div', 'ex-acoes');
    var bDica = el('button', null, T.dica), bSol = el('button', null, T.solucao), bRec = el('button', null, T.recomecar);
    [bDica, bSol, bRec].forEach(function (x) { x.type = 'button'; acoes.appendChild(x); });
    var texto = el('div', 'ex-texto');
    texto.setAttribute('aria-live', 'polite');
    texto.setAttribute('aria-atomic', 'true');
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
    function minha(i) { var p = estado.board[i]; return !!p && corDe(p) === estado.turn; }
    function focoPadrao() {
      if (sel !== null) return sel;
      for (var k = 0; k < 64; k++) if (minha(Number(tela[k].dataset.i))) return Number(tela[k].dataset.i);
      return Number(tela[0].dataset.i);
    }

    function desenhar() {
      var alvos = {};
      if (sel !== null) X.legais(estado).forEach(function (m) { if (m.from === sel) alvos[m.to] = true; });
      if (foco === null) foco = focoPadrao();
      var livre = !ocupado && !fim && !promo;
      for (var i = 0; i < 64; i++) {
        var b = casas[i], p = estado.board[i];
        b.textContent = '';
        if (p) b.appendChild(glifo(p));
        var linhaTela = virar ? 7 - (i >> 3) : i >> 3, colTela = virar ? 7 - (i & 7) : i & 7;
        if (colTela === 0) { var f = el('span', 'coord f', String(8 - (i >> 3))); f.setAttribute('aria-hidden', 'true'); b.appendChild(f); }
        if (linhaTela === 7) { var c = el('span', 'coord c', COLS[i & 7]); c.setAttribute('aria-hidden', 'true'); b.appendChild(c); }
        b.setAttribute('aria-label', nome(i) + ', ' + (p ? T.pecas[p] : T.vazia));
        b.tabIndex = i === foco ? 0 : -1;
        b.classList.toggle('minha', livre && minha(i));
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
    function focar(i) {
      foco = i;
      for (var j = 0; j < 64; j++) casas[j].tabIndex = j === i ? 0 : -1;
      casas[i].focus();
    }

    function limparTimers() { timers.forEach(clearTimeout); timers = []; }
    function reiniciar() {
      limparTimers();
      fecharPromocao(false);
      estado = e0; passo = 0; sel = null; ult = null; ocupado = false; fim = false; marcas = {}; foco = null;
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
        // promoção na casa certa, mas com a peça errada: diz que o problema é a peça (o peão continua selecionado)
        var pecaErrada = !!m.promo && esperados.some(function (u) { return u.slice(0, 4) === uci(m).slice(0, 4); });
        marcas = { erro: m };
        sel = pecaErrada ? m.from : null;
        msg(pecaErrada ? T.promoErrada[m.promo.toLowerCase()] + T.promoErradaFim : T.errado, 'erro');
        desenhar();
        timers.push(setTimeout(function () { if (marcas.erro === m) { marcas = {}; desenhar(); } }, 900));
        return;
      }
      aplicar(m);
      foco = m.to;
      passo++;
      if (passo >= dados.sol.length) { resolvido(); return; }
      ocupado = true;
      msg(T.certo, 'ok');
      desenhar();
      timers.push(setTimeout(function () {
        var antes = estado, r = lanceDe(dados.sol[passo][0]);
        var san = dados.san && dados.san[passo];
        aplicar(r);
        passo++;
        ocupado = false;
        msg(T.respondeu(san || descreve(r, antes)));
        desenhar();
      }, 600));
    }

    // ---------------- promoção: seletor D/T/B/C sobre a coluna da casa de chegada
    function fecharPromocao(cancelar) {   // cancelar (Esc ou toque fora): desfaz a seleção e devolve o foco ao peão
      if (!promo) return;
      var de = promo.de;
      promo.caixa.remove(); promo.fundo.remove();
      promo = null;
      if (cancelar) sel = null;
      desenhar();
      if (cancelar) focar(de);
    }
    function abrirPromocao(cands, para) {
      fecharPromocao(false);
      var k = Number(casas[para].dataset.k), lin = k >> 3, col = k & 7;
      var desce = lin < 4;   // casa de chegada no alto da tela: as opções descem; embaixo: sobem
      var fundo = el('div', 'promo-fundo');
      var caixa = el('div', 'promo' + (desce ? '' : ' sobe'));
      caixa.setAttribute('role', 'dialog');
      caixa.setAttribute('aria-modal', 'true');
      caixa.setAttribute('aria-label', T.promoTitulo);
      caixa.style.left = (col * 12.5) + '%';
      caixa.style.top = ((desce ? lin : lin - 3) * 12.5) + '%';
      var botoes = [];
      PROMO.forEach(function (x) {
        var m = cands.filter(function (c) { return c.promo && c.promo.toLowerCase() === x; })[0];
        if (!m) return;
        var bt = el('button', 'promo-op');
        bt.type = 'button';
        bt.setAttribute('aria-label', T.nomes[x]);
        bt.appendChild(glifo(m.promo));
        bt.addEventListener('click', function () { fecharPromocao(false); tentar(m); focar(foco !== null ? foco : m.to); });
        caixa.appendChild(bt);
        botoes.push(bt);
      });
      fundo.addEventListener('click', function () { fecharPromocao(true); });
      caixa.addEventListener('keydown', function (ev) {
        var j = botoes.indexOf(document.activeElement);
        if (ev.key === 'Escape') { ev.preventDefault(); ev.stopPropagation(); fecharPromocao(true); return; }
        var d = 0, baixo = desce ? 1 : -1;   // com a lista invertida na tela (sobe), "para baixo" volta na ordem D, T, B, C
        if (ev.key === 'ArrowDown') d = baixo;
        else if (ev.key === 'ArrowUp') d = -baixo;
        else if (ev.key === 'ArrowRight') d = 1;
        else if (ev.key === 'ArrowLeft') d = -1;
        else if (ev.key === 'Tab') d = ev.shiftKey ? -1 : 1;   // o foco não sai do seletor enquanto ele está aberto
        else if (ev.key === 'Home') { ev.preventDefault(); botoes[0].focus(); return; }
        else if (ev.key === 'End') { ev.preventDefault(); botoes[botoes.length - 1].focus(); return; }
        if (!d) return;
        ev.preventDefault();
        botoes[(j + d + botoes.length) % botoes.length].focus();
      });
      promo = { caixa: caixa, fundo: fundo, de: sel };
      tabDiv.appendChild(fundo);
      tabDiv.appendChild(caixa);
      desenhar();
      botoes[0].focus();
    }

    // ---------------- lance a partir da casa selecionada (clique, teclado ou arrasto)
    function jogarPara(i, silencioso) {   // silencioso: arrasto de toque que termina em casa ilegal só desfaz a seleção
      var cands = X.legais(estado).filter(function (m) { return m.from === sel && m.to === i; });
      if (!cands.length) { sel = null; if (!silencioso) msg(T.ilegal, 'erro'); desenhar(); return; }
      if (cands.length > 1) { abrirPromocao(cands, i); return; }   // só a promoção tem mais de um lance de/para
      tentar(cands[0]);
    }
    function escolher(i) {
      if (ocupado || fim || promo) return;
      foco = i;
      var p = estado.board[i];
      if (sel === null || (p && corDe(p) === estado.turn && i !== sel)) {
        if (p && corDe(p) === estado.turn) { sel = i; marcas = {}; }
        desenhar();
        return;
      }
      if (i === sel) { sel = null; desenhar(); return; }
      jogarPara(i);
    }

    grade.addEventListener('click', function (ev) {
      if (ignorarClique) return;
      var b = ev.target.closest('.casa');
      if (b) escolher(Number(b.dataset.i));
    });

    // teclado: setas movem o foco na grade (na ordem da tela, já virada); Home/End vão ao começo/fim da fileira
    grade.addEventListener('keydown', function (ev) {
      var b = ev.target.closest && ev.target.closest('.casa');
      if (!b || ev.altKey || ev.metaKey) return;
      var k = Number(b.dataset.k), lin = k >> 3, col = k & 7;
      if (ev.key === 'ArrowRight') col = Math.min(7, col + 1);
      else if (ev.key === 'ArrowLeft') col = Math.max(0, col - 1);
      else if (ev.key === 'ArrowDown') lin = Math.min(7, lin + 1);
      else if (ev.key === 'ArrowUp') lin = Math.max(0, lin - 1);
      else if (ev.key === 'Home') { col = 0; if (ev.ctrlKey) lin = 0; }
      else if (ev.key === 'End') { col = 7; if (ev.ctrlKey) lin = 7; }
      else if (ev.key === 'Escape' && sel !== null) { ev.preventDefault(); sel = null; desenhar(); return; }
      else return;
      ev.preventDefault();
      focar(Number(tela[lin * 8 + col].dataset.i));
    });

    // arrastar (mouse, toque e caneta): só começa depois de 6 px; sem movimento, quem age é o clique.
    // No toque (LAY-widget-21), a peça da vez tem touch-action: pan-y: o gesto vertical rola a página (o navegador
    // manda pointercancel) e só o horizontal/diagonal arrasta; a peça já selecionada (.sel) arrasta em qualquer direção.
    grade.addEventListener('pointerdown', function (ev) {
      if (ev.pointerType === 'mouse' && ev.button !== 0) return;
      var b = ev.target.closest('.casa');
      if (!b || ocupado || fim || promo) return;
      var i = Number(b.dataset.i);
      if (!minha(i)) return;
      arr = { i: i, x: ev.clientX, y: ev.clientY, id: ev.pointerId, fantasma: null, toque: ev.pointerType === 'touch', jaSel: sel === i };
    });
    grade.addEventListener('pointermove', function (ev) {
      if (!arr || ev.pointerId !== arr.id) return;
      if (!arr.fantasma) {
        var dx = Math.abs(ev.clientX - arr.x), dy = Math.abs(ev.clientY - arr.y);
        if (dx + dy < 6) return;
        if (arr.toque && !arr.jaSel && dy > dx) { arr = null; return; }   // gesto de rolar sobre a peça: não é lance
        try { grade.setPointerCapture(ev.pointerId); } catch (e) { /* sem captura, segue com os eventos da grade */ }
        sel = arr.i; foco = arr.i; marcas = {};
        desenhar();
        var orig = casas[arr.i].querySelector('.peca');
        var f = glifo(estado.board[arr.i]);
        f.className += ' fantasma';
        f.style.fontSize = getComputedStyle(orig).fontSize;
        document.body.appendChild(f);
        arr.fantasma = f;
        casas[arr.i].classList.add('arrastando');
      }
      ev.preventDefault();
      arr.fantasma.style.transform = 'translate(' + ev.clientX + 'px,' + ev.clientY + 'px) translate(-50%,-50%)';
    });
    function soltar(ev, cancelado) {
      if (!arr || ev.pointerId !== arr.id) return;
      var a = arr; arr = null;
      if (!a.fantasma) return;   // não arrastou: o click resolve
      a.fantasma.remove();
      var desfaz = a.toque && !a.jaSel;   // toque que não vira lance some sem deixar seleção nem mensagem
      casas[a.i].classList.remove('arrastando');
      ignorarClique = true;
      setTimeout(function () { ignorarClique = false; }, 0);
      var alvo = cancelado ? null : document.elementFromPoint(ev.clientX, ev.clientY);
      var b = alvo && alvo.closest ? alvo.closest('.casa') : null;
      if (!b || !grade.contains(b) || Number(b.dataset.i) === a.i || ocupado || fim) {   // solta fora ou na mesma casa: fica selecionada (no toque, desfaz)
        if (desfaz && sel === a.i) sel = null;
        desenhar(); return;
      }
      foco = Number(b.dataset.i);
      jogarPara(Number(b.dataset.i), a.toque);
    }
    grade.addEventListener('pointerup', function (ev) { soltar(ev, false); });
    grade.addEventListener('pointercancel', function (ev) { soltar(ev, true); });

    bRec.addEventListener('click', reiniciar);
    bDica.addEventListener('click', function () {
      if (fim || ocupado) return;
      fecharPromocao(false);
      if (status.classList.contains('erro')) msg(vezTxt());   // o "tente de novo" não fica ao lado da dica
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
            msg(T.mostrando + ' ' + linhaEl.textContent.trim());
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
  // sem acento e sem maiúscula; apóstrofo e hífen somem ("queen's" = "queens", "xeque-mate" = "xequemate", e
  // "xeque mate" acha os dois porque cada termo é procurado como trecho); grafia britânica = americana
  var BRIT = [[/defence/g, 'defense'], [/centre/g, 'center'], [/colour/g, 'color'], [/practis/g, 'practic'], [/analys/g, 'analyz'], [/recognis/g, 'recogniz']];
  function norm(s) {
    var t = String(s || '').normalize('NFD').replace(/[̀-ͯ]/g, '').toLowerCase()
      .replace(/['’‘`´]/g, '').replace(/[-‐‑]/g, '').replace(/[–—]/g, ' ');
    BRIT.forEach(function (r) { t = t.replace(r[0], r[1]); });
    return t;
  }

  function iniciarBusca() {
    var caixa = document.getElementById('busca');
    if (!caixa || !window.fetch) return;
    var campo = document.getElementById('busca-campo');
    var st = document.getElementById('busca-status');
    var res = document.getElementById('busca-res');
    var limpar = document.getElementById('busca-limpar');
    var trilha = document.getElementById('trilha');
    var niveis = document.querySelector('.niveis');
    var lista = null, promessa = null, timer = null, nivel = null;
    caixa.hidden = false;
    function carregar() {
      if (!promessa) {
        promessa = fetch(caixa.getAttribute('data-indice')).then(function (r) { if (!r.ok) throw new Error(r.status); return r.json(); })
          .then(function (j) {
            lista = j.map(function (d) {
              d._t = norm(d.t); d._g = norm(d.g); d._d = norm(d.d); d._u = norm(d.u);
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
      var num = el('span', 'card-num', d.p ? String(d.p) : '💡'); num.setAttribute('aria-hidden', 'true');
      var corpo = el('span', 'card-corpo');
      var meta = el('span', 'card-meta');
      meta.appendChild(el('span', 'selo nivel-' + d.n, d.nr));
      meta.appendChild(document.createTextNode(' · ' + (d.p ? T.licao + ' ' + d.p + ' · ' : '') + T.min(d.m)));
      corpo.appendChild(meta);
      corpo.appendChild(el('h3', 'card-titulo', d.t));
      corpo.appendChild(el('span', 'card-desc', d.d));
      a.appendChild(num); a.appendChild(corpo); li.appendChild(a);
      return li;
    }
    function nomeNivel(n) { var a = niveis && niveis.querySelector('a[href="#' + n + '"]'); return a ? a.textContent : n; }
    function marcarNiveis() {
      if (!niveis) return;
      niveis.querySelectorAll('a').forEach(function (a) {
        if (nivel && a.getAttribute('href') === '#' + nivel) a.setAttribute('aria-current', 'true'); else a.removeAttribute('aria-current');
      });
    }
    // a busca fica na URL (?q=…&nivel=…): Voltar de um resultado devolve a mesma lista
    function guardarUrl() {
      if (!window.history || !history.replaceState) return;
      var p = new URLSearchParams(location.search);
      p.delete('q'); p.delete('nivel');
      if (campo.value.trim()) { p.set('q', campo.value.trim()); if (nivel) p.set('nivel', nivel); }
      var qs = p.toString();
      try { history.replaceState(history.state, '', location.pathname + (qs ? '?' + qs : '') + location.hash); } catch (e) { /* file:// etc. */ }
    }
    function buscar() {
      var q = norm(campo.value).trim();
      guardarUrl();
      if (!q) {
        res.hidden = true; res.textContent = ''; trilha.hidden = false; st.textContent = '';
        if (limpar) limpar.hidden = true;
        if (nivel) { nivel = null; marcarNiveis(); }
        return;
      }
      carregar().then(function () {
        if (norm(campo.value).trim() !== q) return;
        var termos = q.split(/\s+/);
        var achados = [];
        lista.forEach(function (d) {
          if (nivel && d.n !== nivel) return;
          for (var k = 0; k < termos.length; k++) if (d._tudo.indexOf(termos[k]) < 0) return;
          var s = 0;
          termos.forEach(function (t) { if (d._t.indexOf(t) >= 0) s += 10; if (d._g.indexOf(t) >= 0) s += 5; if (d._d.indexOf(t) >= 0) s += 3; if (d._u.indexOf(t) >= 0) s += 4; });   // endereço desempata (SEO-R2-02)
          achados.push({ d: d, s: s });
        });
        achados.sort(function (a, b) { return b.s - a.s; });
        res.textContent = '';
        achados.forEach(function (x) { res.appendChild(cartao(x.d)); });
        var txt = achados.length === 0 ? st.getAttribute('data-nada') : achados.length === 1 ? st.getAttribute('data-um') : st.getAttribute('data-n').replace('{n}', achados.length);
        st.textContent = txt + (nivel && achados.length ? T.noNivel(nomeNivel(nivel)) : '');
        res.hidden = achados.length === 0;
        trilha.hidden = achados.length > 0;   // nada achado: a trilha continua à vista, como diz a mensagem
        if (limpar) limpar.hidden = false;
      }).catch(function () { st.textContent = T.erroBusca; });
    }
    // pílulas de nível: sem busca, são âncoras para a seção; com busca, filtram os resultados (2º toque tira o filtro)
    if (niveis) niveis.addEventListener('click', function (ev) {
      var a = ev.target.closest('a');
      if (!a || !norm(campo.value).trim()) return;
      ev.preventDefault();
      var n = a.getAttribute('href').slice(1);
      nivel = nivel === n ? null : n;
      marcarNiveis();
      buscar();
    });
    if (limpar) limpar.addEventListener('click', function () { campo.value = ''; buscar(); campo.focus(); });
    campo.addEventListener('focus', function () { carregar().catch(function () {}); });
    campo.addEventListener('input', function () { clearTimeout(timer); timer = setTimeout(buscar, 120); });
    campo.addEventListener('search', buscar);
    campo.addEventListener('keydown', function (ev) { if (ev.key === 'Escape' && campo.value) { campo.value = ''; buscar(); } });
    var p0 = new URLSearchParams(location.search);
    var q0 = p0.get('q'), n0 = p0.get('nivel');
    if (n0 && niveis && niveis.querySelector('a[href="#' + n0.replace(/[^a-z]/g, '') + '"]')) nivel = n0;
    if (q0) { campo.value = q0; marcarNiveis(); buscar(); } else nivel = null;
  }

  function iniciar() { iniciarExercicios(); iniciarBusca(); }
  if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', iniciar); else iniciar();
})();
