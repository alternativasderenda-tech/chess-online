/*
 * Tempo real do xadrez no servidor próprio: substitui supa.channel / supa.removeChannel do supabase-js pelo websocket
 * /xrt, mantendo a mesma API que o jogo usa — .on('postgres_changes', {event, schema, table, filter}, cb),
 * .on('broadcast', {event}, cb), .subscribe(), .send({type:'broadcast', event, payload}) e removeChannel(canal).
 * Uma conexão só para todos os canais, com reconexão e retorno aos canais. O token é o da sessão do login (ou a chave
 * anon) e é trocado quando a sessão muda.
 */
(function () {
  function instalar(supa, chaveAnon) {
    var ws = null, aberto = false, tentativas = 0, refSeq = 0, fila = [], canais = {}, espera = {};
    function token() {
      return supa.auth.getSession().then(function (r) {
        return (r && r.data && r.data.session && r.data.session.access_token) || chaveAnon;
      }).catch(function () { return chaveAnon; });
    }
    function mandar(m) {
      if (aberto && ws && ws.readyState === 1) ws.send(JSON.stringify(m)); else fila.push(m);
    }
    function conectar() {
      token().then(function (t) {
        var proto = location.protocol === 'https:' ? 'wss:' : 'ws:';
        ws = new WebSocket(proto + '//' + location.host + '/xrt?token=' + encodeURIComponent(t));
        ws.onopen = function () {
          aberto = true; tentativas = 0;
          Object.keys(canais).forEach(function (k) { if (canais[k].ativo) mandar(canais[k].msgJoin()); });
          var f = fila; fila = []; f.forEach(mandar);
        };
        ws.onmessage = function (e) {
          var m; try { m = JSON.parse(e.data); } catch (x) { return; }
          if ((m.t === 'ok' || m.t === 'erro') && espera[m.ref]) { espera[m.ref](m.t === 'ok' ? 'ok' : 'error'); delete espera[m.ref]; return; }
          var c = canais[m.topic]; if (!c) return;
          if (m.t === 'pg') c.pg.forEach(function (s) {
            if (s.table === m.table && (s.event === '*' || s.event === m.event)) {
              try { s.cb({ schema: 'public', table: m.table, eventType: m.event, new: m.new, commit_timestamp: new Date().toISOString() }); } catch (x) { console.error(x); }
            }
          });
          if (m.t === 'bc') c.bc.forEach(function (s) {
            if (s.event === m.event) { try { s.cb({ type: 'broadcast', event: m.event, payload: m.payload }); } catch (x) { console.error(x); } }
          });
        };
        ws.onclose = function () {
          aberto = false; ws = null;
          if (!Object.keys(canais).length) return;   // sem canal, só reconecta quando alguém assinar
          var ms = Math.min(15000, 500 * Math.pow(2, tentativas++));
          setTimeout(conectar, ms);
        };
      });
    }
    function garantir() { if (!ws) conectar(); }
    supa.auth.onAuthStateChange(function (_ev, sessao) {
      mandar({ t: 'token', token: (sessao && sessao.access_token) || chaveAnon });
    });

    function Canal(nome) { this.topic = nome; this.pg = []; this.bc = []; this.ativo = false; }
    Canal.prototype.on = function (tipo, opcoes, cb) {
      opcoes = opcoes || {};
      if (tipo === 'postgres_changes') this.pg.push({ event: opcoes.event || '*', schema: opcoes.schema || 'public', table: opcoes.table, filter: opcoes.filter || null, cb: cb });
      else if (tipo === 'broadcast') this.bc.push({ event: opcoes.event, cb: cb });
      return this;
    };
    Canal.prototype.msgJoin = function () {
      return { t: 'join', ref: String(++refSeq), topic: this.topic, pg: this.pg.map(function (s) { return { event: s.event, schema: s.schema, table: s.table, filter: s.filter }; }) };
    };
    Canal.prototype.subscribe = function (cb) {
      this.ativo = true; canais[this.topic] = this; garantir();
      var m = this.msgJoin();
      if (cb) espera[m.ref] = function (st) { cb(st === 'ok' ? 'SUBSCRIBED' : 'CHANNEL_ERROR'); };
      mandar(m);
      return this;
    };
    Canal.prototype.send = function (m) {
      var self = this;
      return new Promise(function (resolve) {
        if (!m || m.type !== 'broadcast') { resolve('error'); return; }
        var ref = String(++refSeq);
        espera[ref] = resolve;
        setTimeout(function () { if (espera[ref]) { delete espera[ref]; resolve('timed out'); } }, 10000);
        mandar({ t: 'bc', ref: ref, topic: self.topic, event: m.event, payload: m.payload });
      });
    };
    Canal.prototype.unsubscribe = function () {
      this.ativo = false;
      if (canais[this.topic] === this) { delete canais[this.topic]; mandar({ t: 'leave', topic: this.topic }); }
      return Promise.resolve('ok');
    };
    supa.channel = function (nome) { return new Canal(nome); };
    supa.removeChannel = function (c) { return c && c.unsubscribe ? c.unsubscribe() : Promise.resolve('ok'); };
    return supa;
  }
  window.xadrezRealtime = instalar;
})();
