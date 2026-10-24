-- Gauntlet dos torneios, rodada 2 — regras e pagamento (servidor/DECISOES.md D-TRN-31..33, D-PAG-07..10). 24/10/2026.
BEGIN;
SET ROLE xadrez_owner;

-- TRN-REG-02 (alto, resto): em ranking de IA andando, o organizador só decide pedido PENDENTE; quem já foi aprovado
-- não pode mais ser recusado (era como tirar o líder e escolher o campeão)
CREATE OR REPLACE FUNCTION public.set_participant_status(p_participant_id uuid, p_status participant_status)
RETURNS tournament_participants LANGUAGE plpgsql SECURITY DEFINER SET search_path = public AS $f$
DECLARE v_user uuid := auth.uid(); p tournament_participants; t tournaments; n int; v_row tournament_participants;
BEGIN
  IF v_user IS NULL THEN RAISE EXCEPTION 'login required'; END IF;
  IF p_status NOT IN ('approved','rejected') THEN RAISE EXCEPTION 'status must be approved or rejected'; END IF;
  SELECT * INTO p FROM tournament_participants WHERE id = p_participant_id;
  IF p.id IS NULL THEN RAISE EXCEPTION 'not found'; END IF;
  SELECT * INTO t FROM tournaments WHERE id = p.tournament_id FOR UPDATE;
  IF t.creator_id <> v_user AND NOT is_admin() THEN RAISE EXCEPTION 'only creator/admin'; END IF;
  IF NOT (t.status = 'open' OR (t.format = 'ai' AND t.status = 'active' AND now() < t.ends_at)) THEN
    RAISE EXCEPTION 'tournament already started';
  END IF;
  IF t.status = 'active' AND p.status <> 'pending' THEN RAISE EXCEPTION 'after the start only pending requests can be decided'; END IF;
  IF p.status = 'left' THEN RAISE EXCEPTION 'participant left'; END IF;
  IF p_status = 'approved' AND p.status <> 'approved' THEN
    SELECT count(*) INTO n FROM tournament_participants WHERE tournament_id = t.id AND status = 'approved';
    IF n >= t.capacity THEN RAISE EXCEPTION 'tournament full'; END IF;
  END IF;
  UPDATE tournament_participants SET status = p_status WHERE id = p.id RETURNING * INTO v_row;
  RETURN v_row;
END $f$;

-- TRN-REG-07 (baixo, resto): a mesma partida registrada várias vezes AO MESMO TEMPO passava pelo EXISTS; agora o índice
-- único decide (o segundo INSERT espera o primeiro e falha)
CREATE UNIQUE INDEX IF NOT EXISTS scores_fingerprint_unica ON public.scores (user_id, difficulty, fingerprint)
  WHERE fingerprint IS NOT NULL AND status IN ('normal','pendente');

CREATE OR REPLACE FUNCTION public.register_ai_score(p_session_id text, p_difficulty smallint, p_username text,
  p_client_mouse_movements integer DEFAULT 0, p_client_drag_count integer DEFAULT 0, p_client_click_count integer DEFAULT 0,
  p_client_idle_periods integer DEFAULT 0, p_client_keyboard_events integer DEFAULT 0, p_client_undo_count integer DEFAULT 0,
  p_client_validated boolean DEFAULT false, p_client_player_seconds integer DEFAULT NULL, p_tournament_id uuid DEFAULT NULL)
RETURNS jsonb LANGUAGE plpgsql SECURITY DEFINER SET search_path = public AS $f$
DECLARE
  v_user uuid := auth.uid(); v_existente uuid; t tournaments; n int; desfeitos int; v_ini timestamptz; v_fim timestamptz;
  v_susp int := 0; v_status text := 'pendente'; v_id uuid; v_fp text; v_restricao text;
BEGIN
  IF v_user IS NULL THEN RAISE EXCEPTION 'authentication required'; END IF;
  SELECT id INTO v_existente FROM scores WHERE session_id = p_session_id LIMIT 1;
  IF v_existente IS NOT NULL THEN RETURN jsonb_build_object('success', true, 'score_id', v_existente, 'idempotent', true); END IF;
  IF p_difficulty < 1 OR p_difficulty > 4 THEN RAISE EXCEPTION 'invalid difficulty: %', p_difficulty; END IF;
  IF char_length(coalesce(p_username, '')) > 60 THEN RAISE EXCEPTION 'username too long'; END IF;
  SELECT count(*), count(*) FILTER (WHERE undone), min(created_at), max(created_at),
         md5(string_agg(from_sq || '-' || to_sq || coalesce(promotion, ''), ',' ORDER BY move_number))
    INTO n, desfeitos, v_ini, v_fim, v_fp
    FROM ai_game_moves WHERE session_id = p_session_id AND user_id = v_user;
  IF n = 0 THEN RAISE EXCEPTION 'no moves found for session %', p_session_id; END IF;
  IF desfeitos > 0 THEN RAISE EXCEPTION 'game with undone moves does not count'; END IF;
  IF EXISTS (SELECT 1 FROM scores WHERE user_id = v_user AND difficulty = p_difficulty AND fingerprint = v_fp AND status IN ('normal','pendente')) THEN
    RAISE EXCEPTION 'this exact game was already registered';
  END IF;
  IF p_tournament_id IS NOT NULL THEN
    SELECT * INTO t FROM tournaments WHERE id = p_tournament_id;
    IF t.id IS NULL THEN RAISE EXCEPTION 'tournament not found'; END IF;
    IF t.format <> 'ai' THEN RAISE EXCEPTION 'tournament is not AI format'; END IF;
    IF t.status NOT IN ('open','active') THEN RAISE EXCEPTION 'tournament not accepting scores'; END IF;
    IF t.difficulty IS NOT NULL AND t.difficulty <> p_difficulty THEN RAISE EXCEPTION 'difficulty does not match tournament'; END IF;
    IF v_ini < t.starts_at THEN RAISE EXCEPTION 'game started before the tournament'; END IF;
    IF t.ends_at IS NOT NULL AND v_fim > t.ends_at THEN RAISE EXCEPTION 'game finished after the tournament ended'; END IF;
    IF now() > t.ends_at + interval '10 minutes' THEN RAISE EXCEPTION 'tournament has ended'; END IF;
    IF NOT EXISTS (SELECT 1 FROM tournament_participants WHERE tournament_id = t.id AND user_id = v_user AND status = 'approved') THEN
      RAISE EXCEPTION 'you are not an approved participant of this tournament';
    END IF;
  END IF;
  IF n >= 15 THEN
    IF p_client_mouse_movements < 30 THEN v_susp := v_susp + 3; ELSIF p_client_mouse_movements < 100 THEN v_susp := v_susp + 1; END IF;
    IF p_client_idle_periods = 0 THEN v_susp := v_susp + 2; END IF;
  END IF;
  IF n >= 25 THEN
    IF p_client_drag_count = 0 THEN v_susp := v_susp + 1; END IF;
    IF p_client_keyboard_events = 0 THEN v_susp := v_susp + 1; END IF;
  END IF;
  IF v_susp >= 5 THEN v_status := 'cheater'; END IF;
  BEGIN
    INSERT INTO scores (user_id, username, difficulty, player_seconds, session_id, status, suspicion_score, client_validated,
                        mouse_movements, drag_count, click_count, idle_periods, keyboard_events, undo_count, total_game_ms, tournament_id, fingerprint)
    VALUES (v_user, left(coalesce(nullif(trim(p_username), ''), xadrez_rt.nome(v_user)), 60), p_difficulty,
            greatest(1, extract(epoch FROM v_fim - v_ini)::int), p_session_id, v_status, v_susp, false,
            p_client_mouse_movements, p_client_drag_count, p_client_click_count, p_client_idle_periods, p_client_keyboard_events,
            p_client_undo_count, (extract(epoch FROM v_fim - v_ini) * 1000)::int, p_tournament_id, v_fp)
    RETURNING id INTO v_id;
  EXCEPTION WHEN unique_violation THEN
    GET STACKED DIAGNOSTICS v_restricao = CONSTRAINT_NAME;
    IF v_restricao = 'scores_fingerprint_unica' THEN RAISE EXCEPTION 'this exact game was already registered'; END IF;
    SELECT id INTO v_existente FROM scores WHERE session_id = p_session_id LIMIT 1;      -- mesma sessão enviada 2x ao mesmo tempo
    IF v_existente IS NULL THEN RAISE; END IF;
    RETURN jsonb_build_object('success', true, 'score_id', v_existente, 'idempotent', true);
  END;
  IF v_status = 'pendente' THEN PERFORM pg_notify('xadrez_conferir', v_id::text); END IF;
  RETURN jsonb_build_object('success', true, 'score_id', v_id, 'idempotent', false, 'status', v_status, 'suspicion_score', v_susp);
END $f$;

-- TRN-REG-11 (médio): ranking encerrado conta só o que foi conferido até o fechamento — um veredito que sai depois
-- não muda mais a classificação (e o campeão gravado continua sendo o 1º da tabela)
CREATE OR REPLACE FUNCTION public.tournament_leaderboard(p_tournament_id uuid, p_token text DEFAULT NULL)
RETURNS TABLE(user_id uuid, user_name text, wins integer, best_seconds integer)
LANGUAGE plpgsql STABLE SECURITY DEFINER SET search_path = public AS $f$
DECLARE t tournaments;
BEGIN
  SELECT * INTO t FROM tournaments WHERE id = p_tournament_id;
  IF t.id IS NULL OR NOT xadrez_rt.pode_ver(p_tournament_id, p_token) THEN RAISE EXCEPTION 'tournament not found'; END IF;
  IF t.format <> 'ai' THEN RAISE EXCEPTION 'leaderboard only for ai format'; END IF;
  RETURN QUERY
  WITH s AS (
    SELECT s.user_id, s.player_seconds, s.timed_live, s.created_at FROM scores s
     WHERE s.tournament_id = p_tournament_id AND s.status = 'normal'
       AND (t.status <> 'finished' OR t.finished_at IS NULL OR coalesce(s.server_checked_at, s.created_at) <= t.finished_at)),
  agg AS (
    SELECT p.user_id, p.user_name, count(s.user_id)::int AS wins,
           min(s.player_seconds) FILTER (WHERE s.timed_live)::int AS best,
           max(s.created_at) AS ultima,
           (SELECT min(x.created_at) FROM s x WHERE x.user_id = p.user_id AND x.timed_live
               AND x.player_seconds = min(s.player_seconds) FILTER (WHERE s.timed_live)) AS quando_best
      FROM tournament_participants p LEFT JOIN s ON s.user_id = p.user_id
     WHERE p.tournament_id = p_tournament_id AND p.status = 'approved'
     GROUP BY p.user_id, p.user_name)
  SELECT agg.user_id, agg.user_name, agg.wins, agg.best FROM agg
   ORDER BY CASE WHEN t.criterion = 'fastest_win' THEN agg.best END ASC NULLS LAST,
            CASE WHEN t.criterion = 'fastest_win' THEN agg.quando_best END ASC NULLS LAST,
            agg.wins DESC, agg.ultima ASC NULLS LAST, agg.best ASC NULLS LAST, agg.user_name;
END $f$;

-- TRN-PIX-16 (médio): eliminatória começa no mínimo 60 min depois de criada; o Pix vence 10 min antes do início
-- (validade = min(45, início − agora − 10) e nunca abaixo dos 30 min que o Mercado Pago exige)
CREATE OR REPLACE FUNCTION xadrez_rt.validar_inicio() RETURNS trigger LANGUAGE plpgsql AS $f$
BEGIN
  IF NEW.format = 'pvp_bracket' AND NEW.starts_at < now() + interval '60 minutes' THEN
    RAISE EXCEPTION 'starts_at must be at least 60 minutes from now';
  END IF;
  RETURN NEW;
END $f$;

CREATE OR REPLACE FUNCTION xadrez_rt.pix_preparar(p_tournament_id uuid, p_user uuid) RETURNS jsonb
LANGUAGE plpgsql SECURITY DEFINER SET search_path = public AS $f$
DECLARE t tournaments; p xadrez_rt.pagamentos; e text; v_val int;
BEGIN
  SELECT * INTO t FROM tournaments WHERE id = p_tournament_id FOR UPDATE;
  IF t.id IS NULL OR (t.creator_id <> p_user AND NOT EXISTS (SELECT 1 FROM admin_users WHERE user_id = p_user)) THEN
    RETURN jsonb_build_object('erro', 'not_found');
  END IF;
  IF t.paid THEN RETURN jsonb_build_object('pago', true); END IF;
  IF t.status <> 'open' THEN RETURN jsonb_build_object('erro', 'not_open'); END IF;
  v_val := coalesce((SELECT valor::int FROM xadrez_rt.config WHERE chave = 'pix_validade_min'), 45);
  IF t.format = 'pvp_bracket' THEN
    v_val := least(v_val, floor(extract(epoch FROM t.starts_at - now() - interval '10 minutes') / 60)::int);
    IF v_val < 30 THEN RETURN jsonb_build_object('erro', 'starts_too_soon'); END IF;
  END IF;
  IF t.format = 'ai' AND t.ends_at < now() + interval '1 hour' THEN RETURN jsonb_build_object('erro', 'starts_too_soon'); END IF;
  SELECT * INTO p FROM xadrez_rt.pagamentos WHERE tournament_id = t.id AND status = 'pendente' AND expira_em > now() + interval '2 minutes'
   ORDER BY criado_em DESC LIMIT 1;
  SELECT email INTO e FROM auth.users WHERE id = t.creator_id;
  RETURN jsonb_build_object('pago', false, 'existente', CASE WHEN p.id IS NULL THEN NULL ELSE to_jsonb(p) END,
    'anteriores', (SELECT coalesce(jsonb_agg(provedor_id), '[]') FROM xadrez_rt.pagamentos
                    WHERE tournament_id = t.id AND status = 'pendente' AND (p.id IS NULL OR id <> p.id)),
    'valor', (SELECT valor FROM xadrez_rt.config WHERE chave = 'preco_torneio'),
    'validade_min', v_val, 'email', e, 'nome', t.name);
END $f$;

-- pagamento: não libera eliminatória a menos de 10 min do início (vai para o estorno, e a tela explica); aviso
-- assinado de pagamento desconhecido vira `pix_orfao` (TRN-PIX-15), uma vez por pagamento
CREATE OR REPLACE FUNCTION xadrez_rt.pix_confirmar(p_provedor_id text, p_status text, p_valor numeric, p_bruto jsonb) RETURNS text
LANGUAGE plpgsql SECURITY DEFINER SET search_path = public AS $f$
DECLARE p xadrez_rt.pagamentos; t tournaments;
BEGIN
  SELECT * INTO p FROM xadrez_rt.pagamentos WHERE provedor_id = p_provedor_id FOR UPDATE;
  IF p.id IS NULL THEN
    IF NOT EXISTS (SELECT 1 FROM xadrez_rt.eventos WHERE tipo = 'pix_orfao' AND detalhe->>'id' = p_provedor_id) THEN
      PERFORM xadrez_rt.evento('pix_orfao', (SELECT id FROM tournaments WHERE id::text = p_bruto->>'ref'), NULL, NULL,
        jsonb_build_object('id', p_provedor_id, 'status', p_status, 'pago', p_valor, 'ref', p_bruto->>'ref'));
    END IF;
    RETURN 'desconhecido';
  END IF;
  UPDATE xadrez_rt.pagamentos SET bruto = coalesce(p_bruto, bruto), atualizado_em = now() WHERE id = p.id;
  IF p_status = 'approved' THEN
    IF p_valor IS DISTINCT FROM p.valor THEN
      PERFORM xadrez_rt.evento('pix_valor_divergente', p.tournament_id, NULL, NULL, jsonb_build_object('esperado', p.valor, 'pago', p_valor, 'id', p_provedor_id));
      RETURN 'valor_divergente';
    END IF;
    IF p.status IN ('pago','estornado','estorno_falhou') THEN RETURN 'ja_pago'; END IF;
    UPDATE xadrez_rt.pagamentos SET status = 'pago', pago_em = now() WHERE id = p.id;     -- inclusive se estava expirado/cancelado
    SELECT * INTO t FROM tournaments WHERE id = p.tournament_id FOR UPDATE;
    IF t.status = 'open' AND NOT t.paid AND t.format = 'pvp_bracket' AND t.starts_at < now() + interval '10 minutes' THEN
      PERFORM xadrez_rt.evento('pix_pago_tarde', t.id, NULL, NULL, jsonb_build_object('id', p_provedor_id, 'inicio', t.starts_at));
      RETURN 'pago_tarde';                          -- vai para o estorno (pix_para_estornar)
    END IF;
    IF t.status = 'open' AND NOT t.paid THEN
      UPDATE tournaments SET paid = true, paid_at = now() WHERE id = t.id;
      PERFORM xadrez_rt.evento('pago_pix', t.id, NULL, NULL, jsonb_build_object('id', p_provedor_id, 'valor', p_valor));
      RETURN 'liberado';
    END IF;
    PERFORM xadrez_rt.evento('pix_pago_sem_liberar', t.id, NULL, NULL, jsonb_build_object('id', p_provedor_id, 'status', t.status, 'ja_pago', t.paid));
    RETURN 'pago_sem_liberar';
  ELSIF p_status IN ('cancelled','rejected','expired') AND p.status = 'pendente' THEN
    UPDATE xadrez_rt.pagamentos SET status = CASE p_status WHEN 'expired' THEN 'expirado' WHEN 'rejected' THEN 'falhou' ELSE 'cancelado' END WHERE id = p.id;
    RETURN 'encerrado';
  ELSIF p_status IN ('refunded','charged_back') THEN
    UPDATE xadrez_rt.pagamentos SET status = 'estornado' WHERE id = p.id;
    IF p_status = 'charged_back' THEN PERFORM xadrez_rt.evento('pix_contestado', p.tournament_id, NULL, NULL, jsonb_build_object('id', p_provedor_id)); END IF;
    RETURN 'estornado';
  END IF;
  RETURN 'sem_mudanca';
END $f$;

-- TRN-PIX-17 (médio): reconsulta só o que ainda pode ser pago (o MP só tira de `pendente` com cancelled/expired, e aí
-- não paga mais). Dentro da validade: todo minuto; depois do vencimento, espaçado (5 min na 1ª hora, 30 min no 1º dia,
-- 2 h até o 3º dia) — `atualizado_em` marca a última consulta
CREATE OR REPLACE FUNCTION xadrez_rt.pix_pendentes() RETURNS SETOF text LANGUAGE sql STABLE SECURITY DEFINER
SET search_path = public AS $f$
  SELECT provedor_id FROM xadrez_rt.pagamentos
   WHERE provedor_id IS NOT NULL AND NOT provedor_id LIKE 'sim-%' AND status = 'pendente'
     AND criado_em > now() - interval '3 days'
     AND (expira_em > now() OR atualizado_em < now() - CASE WHEN now() < expira_em + interval '1 hour' THEN interval '5 minutes'
                                                             WHEN now() < expira_em + interval '1 day' THEN interval '30 minutes'
                                                             ELSE interval '2 hours' END)
   ORDER BY criado_em DESC LIMIT 50;
$f$;

-- TRN-PIX-19 (baixo): estorno com espera crescente (na hora, depois 1, 5, 15 e 60 min) e "em andamento" no MP
-- (contingência do Pix) espera 30 min sem contar tentativa. Pago tarde (TRN-PIX-16) também é estornado.
CREATE OR REPLACE FUNCTION xadrez_rt.pix_para_estornar() RETURNS SETOF text LANGUAGE sql STABLE SECURITY DEFINER
SET search_path = public AS $f$
  SELECT p.provedor_id FROM xadrez_rt.pagamentos p JOIN tournaments t ON t.id = p.tournament_id
   WHERE p.status = 'pago' AND p.tentativas_estorno < 5 AND (
         (t.status = 'cancelled' AND t.cancelled_before_start)
      OR (t.status = 'open' AND NOT t.paid)
      OR EXISTS (SELECT 1 FROM xadrez_rt.pagamentos o WHERE o.tournament_id = p.tournament_id AND o.id <> p.id
                  AND o.status IN ('pago','estornado','estorno_falhou') AND o.pago_em < p.pago_em))
     AND (CASE WHEN p.erro_estorno LIKE 'em andamento%' THEN p.atualizado_em < now() - interval '30 minutes'
               WHEN p.tentativas_estorno = 0 THEN true
               ELSE p.atualizado_em < now() - (ARRAY[1, 5, 15, 60])[p.tentativas_estorno] * interval '1 minute' END)
   LIMIT 10;
$f$;
CREATE OR REPLACE FUNCTION xadrez_rt.pix_estorno_em_andamento(p_provedor_id text) RETURNS void
LANGUAGE sql SECURITY DEFINER SET search_path = public AS $f$
  UPDATE xadrez_rt.pagamentos SET erro_estorno = 'em andamento no Mercado Pago', atualizado_em = now() WHERE provedor_id = p_provedor_id;
$f$;
GRANT EXECUTE ON FUNCTION xadrez_rt.pix_estorno_em_andamento(text) TO xadrez_rt;

-- admin: id do pagamento no MP em todo detalhe (TRN-PIX-19); Pix pago depois da confirmação manual (TRN-PIX-18)
CREATE OR REPLACE FUNCTION public.admin_payment_problems()
RETURNS TABLE(tipo text, tournament_id uuid, tournament_name text, valor numeric, status text, detalhe text, desde timestamptz)
LANGUAGE sql STABLE SECURITY DEFINER SET search_path = public AS $f$
  SELECT * FROM (
    SELECT 'estorno_pendente'::text, p.tournament_id, t.name, p.valor, p.status,
           'Pix ' || p.provedor_id || ' — tentativas: ' || p.tentativas_estorno || coalesce(' — ' || p.erro_estorno, ''), p.pago_em
      FROM xadrez_rt.pagamentos p JOIN tournaments t ON t.id = p.tournament_id
     WHERE p.status = 'pago' AND p.tentativas_estorno < 5 AND (
           (t.status = 'cancelled' AND t.cancelled_before_start)
        OR (t.status = 'open' AND NOT t.paid)
        OR EXISTS (SELECT 1 FROM xadrez_rt.pagamentos o WHERE o.tournament_id = p.tournament_id AND o.id <> p.id
                    AND o.status IN ('pago','estornado','estorno_falhou') AND o.pago_em < p.pago_em))
    UNION ALL
    SELECT 'estorno_falhou', p.tournament_id, t.name, p.valor, p.status, 'Pix ' || p.provedor_id || coalesce(' — ' || p.erro_estorno, ''), p.atualizado_em
      FROM xadrez_rt.pagamentos p JOIN tournaments t ON t.id = p.tournament_id WHERE p.status = 'estorno_falhou'
    UNION ALL
    SELECT 'pago_sem_liberar', p.tournament_id, t.name, p.valor, t.status::text, 'Pix ' || p.provedor_id || ' pago, torneio não liberado', p.pago_em
      FROM xadrez_rt.pagamentos p JOIN tournaments t ON t.id = p.tournament_id
     WHERE p.status = 'pago' AND NOT t.paid AND NOT (t.status = 'open' OR (t.status = 'cancelled' AND t.cancelled_before_start))
    UNION ALL
    SELECT 'pago_apos_confirmacao_manual', p.tournament_id, t.name, p.valor, p.status,
           'Pix ' || p.provedor_id || ' pago depois da confirmação manual', p.pago_em
      FROM xadrez_rt.pagamentos p JOIN tournaments t ON t.id = p.tournament_id
     WHERE p.status = 'pago' AND t.paid AND t.paid_at < p.pago_em AND p.pago_em > now() - interval '30 days'
       AND NOT EXISTS (SELECT 1 FROM xadrez_rt.pagamentos o WHERE o.tournament_id = p.tournament_id AND o.id <> p.id
                        AND o.status IN ('pago','estornado','estorno_falhou') AND o.pago_em < p.pago_em)
    UNION ALL
    SELECT e.tipo, e.tournament_id, t.name, (e.detalhe->>'pago')::numeric, NULL, e.detalhe::text, e.em
      FROM xadrez_rt.eventos e LEFT JOIN tournaments t ON t.id = e.tournament_id
     WHERE e.tipo IN ('pix_valor_divergente','pix_orfao','pix_contestado') AND e.em > now() - interval '30 days'
    UNION ALL
    SELECT 'erro_rotina', e.tournament_id, t.name, NULL, e.detalhe->>'etapa', e.detalhe->>'erro', e.em
      FROM xadrez_rt.eventos e LEFT JOIN tournaments t ON t.id = e.tournament_id
     WHERE e.tipo = 'erro_tick' AND e.em > now() - interval '2 days'
  ) x WHERE is_admin() ORDER BY 7 DESC NULLS LAST;
$f$;

-- tela do Pix: diz se o último pagamento chegou tarde (pago, torneio não liberado, vai voltar)
DROP FUNCTION IF EXISTS public.tournament_payment_status(uuid);
CREATE OR REPLACE FUNCTION public.tournament_payment_status(p_tournament_id uuid)
RETURNS TABLE(paid boolean, status text, valor numeric, qr_code text, qr_code_base64 text, expira_em timestamptz, pago_em timestamptz, server_now timestamptz)
LANGUAGE sql STABLE SECURITY DEFINER SET search_path = public AS $f$
  SELECT t.paid, p.status, p.valor, CASE WHEN p.status = 'pendente' THEN p.qr_code END,
         CASE WHEN p.status = 'pendente' THEN p.qr_code_base64 END, p.expira_em, p.pago_em, now()
    FROM tournaments t
    LEFT JOIN LATERAL (SELECT * FROM xadrez_rt.pagamentos x WHERE x.tournament_id = t.id ORDER BY criado_em DESC LIMIT 1) p ON true
   WHERE t.id = p_tournament_id AND (t.creator_id = auth.uid() OR is_admin());
$f$;

-- TRN-REG-11: o ranking espera a fila de conferência acabar (a conferência tem 2 tentativas de 15 min, D-TRN-26); se
-- algo travar, fecha 3 h depois do fim e registra — o que for conferido depois não entra (tournament_leaderboard)
CREATE OR REPLACE FUNCTION xadrez_rt.tick() RETURNS jsonb LANGUAGE plpgsql SECURITY DEFINER SET search_path = public AS $f$
DECLARE r record; tg record; feitos jsonb := '{}'::jsonb; n int; venc uuid; presentes int; g games; lances int;
BEGIN
  IF NOT pg_try_advisory_xact_lock(7442001) THEN RETURN jsonb_build_object('ocupado', true); END IF;   -- TRN-REG-10
  n := 0;
  FOR r IN SELECT gm.id, gm.time_control FROM games gm
            WHERE gm.status = 'active' AND gm.tournament_match_id IS NOT NULL AND gm.time_control > 0 LOOP
    SELECT * INTO tg FROM xadrez_rt.tempo_gasto(r.id);
    CONTINUE WHEN tg.lances < 2;
    IF (CASE WHEN tg.vez = 'w' THEN tg.brancas ELSE tg.pretas END) + extract(epoch FROM now() - tg.ultimo) > r.time_control THEN
      BEGIN
        PERFORM xadrez_rt.encerrar_jogo(r.id, CASE WHEN tg.vez = 'w' THEN 'black_wins' ELSE 'white_wins' END, 'tempo'); n := n + 1;
      EXCEPTION WHEN OTHERS THEN PERFORM xadrez_rt.evento_erro('tempo', NULL, NULL, r.id, SQLERRM);
      END;
    END IF;
  END LOOP;
  feitos := feitos || jsonb_build_object('tempo', n);

  n := 0;
  FOR r IN SELECT m.* FROM tournament_matches m JOIN tournaments t ON t.id = m.tournament_id
            WHERE t.status = 'active' AND m.status IN ('pending','in_progress') AND m.deadline_at < now() LOOP
    BEGIN
      IF r.player1_id IS NULL OR r.player2_id IS NULL THEN
        PERFORM xadrez_rt.decidir_partida(r.id, coalesce(r.player1_id, r.player2_id), 'walkover', 'bye'); n := n + 1;
        CONTINUE;
      END IF;
      g := NULL; lances := 0;
      IF r.game_id IS NOT NULL THEN SELECT * INTO g FROM games WHERE id = r.game_id; SELECT count(*) INTO lances FROM moves WHERE game_id = r.game_id; END IF;
      IF lances >= 2 THEN CONTINUE; END IF;
      IF lances = 1 THEN venc := g.white_user_id;
      ELSE
        presentes := (r.present_p1_at IS NOT NULL)::int + (r.present_p2_at IS NOT NULL)::int;
        IF presentes = 1 THEN venc := CASE WHEN r.present_p1_at IS NOT NULL THEN r.player1_id ELSE r.player2_id END;
        ELSIF presentes = 2 AND g.id IS NOT NULL THEN venc := g.black_user_id;
        ELSE venc := CASE WHEN random() < 0.5 THEN r.player1_id ELSE r.player2_id END;
        END IF;
      END IF;
      IF g.id IS NOT NULL AND g.status = 'active' THEN
        UPDATE games SET status = 'abandoned', result = 'abandoned', end_reason = 'wo_prazo', ended_at = now() WHERE id = g.id;
      END IF;
      PERFORM xadrez_rt.decidir_partida(r.id, venc, 'walkover',
        CASE WHEN lances = 1 THEN 'wo_sem_resposta'
             WHEN (r.present_p1_at IS NOT NULL)::int + (r.present_p2_at IS NOT NULL)::int = 1 THEN 'wo_ausencia'
             WHEN g.id IS NOT NULL THEN 'wo_brancas_nao_jogaram' ELSE 'wo_sorteio' END);
      n := n + 1;
    EXCEPTION WHEN OTHERS THEN PERFORM xadrez_rt.evento_erro('wo', r.tournament_id, r.id, r.game_id, SQLERRM);
    END;
  END LOOP;
  feitos := feitos || jsonb_build_object('wo', n);

  n := 0;
  FOR r IN SELECT id FROM tournaments WHERE format = 'pvp_bracket' AND status = 'open' AND paid AND starts_at <= now() LOOP
    BEGIN PERFORM xadrez_rt.iniciar_chave(r.id); n := n + 1;
    EXCEPTION WHEN OTHERS THEN PERFORM xadrez_rt.evento_erro('inicio', r.id, NULL, NULL, SQLERRM); END;
  END LOOP;
  feitos := feitos || jsonb_build_object('iniciados', n);

  UPDATE tournaments SET status = 'active' WHERE format = 'ai' AND status = 'open' AND paid AND starts_at <= now();
  n := 0;
  FOR r IN SELECT t.id, EXISTS (SELECT 1 FROM scores s WHERE s.tournament_id = t.id AND s.status = 'pendente') AS com_fila
             FROM tournaments t WHERE t.format = 'ai' AND t.status IN ('open','active') AND t.ends_at + interval '10 minutes' < now() LOOP
    CONTINUE WHEN r.com_fila AND (SELECT ends_at FROM tournaments WHERE id = r.id) + interval '3 hours' > now();
    BEGIN
      IF r.com_fila THEN PERFORM xadrez_rt.evento('ranking_fechado_com_fila', r.id, NULL, NULL, NULL); END IF;
      PERFORM xadrez_rt.encerrar_ranking(r.id); n := n + 1;
    EXCEPTION WHEN OTHERS THEN PERFORM xadrez_rt.evento_erro('ranking', r.id, NULL, NULL, SQLERRM); END;
  END LOOP;
  feitos := feitos || jsonb_build_object('rankings', n);

  UPDATE xadrez_rt.pagamentos SET status = 'expirado', atualizado_em = now()
   WHERE status = 'pendente' AND provedor_id LIKE 'sim-%' AND expira_em < now();
  RETURN feitos;
END $f$;

RESET ROLE;
COMMIT;
