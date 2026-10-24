-- Gauntlet dos torneios, rodada 1 — regras, pagamento e acesso público (DECISOES.md D-TRN-21..27, D-PAG-02..05). 24/10/2026.
BEGIN;
SET ROLE xadrez_owner;

ALTER TABLE public.tournaments ADD COLUMN IF NOT EXISTS cancelled_before_start boolean NOT NULL DEFAULT false;
ALTER TABLE public.scores ADD COLUMN IF NOT EXISTS fingerprint text;
CREATE INDEX IF NOT EXISTS scores_fingerprint ON public.scores (user_id, difficulty, fingerprint) WHERE fingerprint IS NOT NULL;
ALTER TABLE xadrez_rt.pagamentos ADD COLUMN IF NOT EXISTS tentativas_estorno int NOT NULL DEFAULT 0;
ALTER TABLE xadrez_rt.pagamentos ADD COLUMN IF NOT EXISTS erro_estorno text;
ALTER TABLE xadrez_rt.pagamentos DROP CONSTRAINT IF EXISTS pagamentos_status_check;
ALTER TABLE xadrez_rt.pagamentos ADD CONSTRAINT pagamentos_status_check
  CHECK (status IN ('pendente','pago','expirado','cancelado','estornado','falhou','estorno_falhou'));
UPDATE xadrez_rt.config SET valor = '45' WHERE chave = 'pix_validade_min';     -- TRN-PIX-01: o MP exige ≥ 30 min da emissão

-- TRN-REG-01: jogo criado (1º ou desempate) ganha 20 min para começar, mesmo perto/depois do prazo da rodada
CREATE OR REPLACE FUNCTION xadrez_rt.criar_jogo(p_match uuid, p_white uuid, p_black uuid) RETURNS text
LANGUAGE plpgsql SECURITY DEFINER SET search_path = public AS $f$
DECLARE m tournament_matches; t tournaments; v_id text; chars text := 'ABCDEFGHJKLMNPQRSTUVWXYZ23456789'; tent int := 0;
BEGIN
  SELECT * INTO m FROM tournament_matches WHERE id = p_match;
  SELECT * INTO t FROM tournaments WHERE id = m.tournament_id;
  LOOP
    tent := tent + 1; v_id := '';
    FOR i IN 1..6 LOOP v_id := v_id || substr(chars, 1 + floor(random() * length(chars))::int, 1); END LOOP;
    EXIT WHEN NOT EXISTS (SELECT 1 FROM games WHERE id = v_id);
    IF tent > 20 THEN RAISE EXCEPTION 'não consegui gerar id de jogo'; END IF;
  END LOOP;
  INSERT INTO games (id, white_user_id, black_user_id, white_username, black_username, status, time_control,
                     current_turn, tournament_match_id, started_at)
  VALUES (v_id, p_white, p_black,
          coalesce((SELECT user_name FROM tournament_participants WHERE tournament_id = t.id AND user_id = p_white), 'Brancas'),
          coalesce((SELECT user_name FROM tournament_participants WHERE tournament_id = t.id AND user_id = p_black), 'Pretas'),
          'active', t.time_control_seconds, 'w', m.id, now());
  UPDATE tournament_matches SET game_id = v_id, status = 'in_progress',
         deadline_at = greatest(coalesce(deadline_at, now()), now() + interval '20 minutes') WHERE id = p_match;
  PERFORM xadrez_rt.evento('jogo_criado', t.id, m.id, v_id, jsonb_build_object('brancas', p_white, 'pretas', p_black, 'desempate', m.tiebreaks));
  RETURN v_id;
END $f$;

-- erro repetido da rotina: registra uma vez por hora (TRN-REG-10)
CREATE OR REPLACE FUNCTION xadrez_rt.evento_erro(p_etapa text, p_t uuid, p_m uuid, p_g text, p_erro text) RETURNS void
LANGUAGE plpgsql SECURITY DEFINER SET search_path = public AS $f$
BEGIN
  IF NOT EXISTS (SELECT 1 FROM xadrez_rt.eventos WHERE tipo = 'erro_tick' AND em > now() - interval '1 hour'
                  AND tournament_id IS NOT DISTINCT FROM p_t AND match_id IS NOT DISTINCT FROM p_m AND detalhe->>'erro' = p_erro) THEN
    PERFORM xadrez_rt.evento('erro_tick', p_t, p_m, p_g, jsonb_build_object('etapa', p_etapa, 'erro', p_erro));
  END IF;
END $f$;

-- início com menos de 2: cancelado ANTES de começar (o Pix é estornado)
CREATE OR REPLACE FUNCTION xadrez_rt.iniciar_chave(p_t uuid) RETURNS void LANGUAGE plpgsql SECURITY DEFINER
SET search_path = public AS $f$
DECLARE t tournaments; jog uuid[]; n int; rodadas int; tam int; byes int; i int; pos int := 0; a uuid; b uuid;
BEGIN
  SELECT * INTO t FROM tournaments WHERE id = p_t FOR UPDATE;
  IF t.status <> 'open' OR t.format <> 'pvp_bracket' THEN RETURN; END IF;
  SELECT array_agg(user_id ORDER BY random()) INTO jog FROM tournament_participants WHERE tournament_id = t.id AND status = 'approved';
  n := coalesce(array_length(jog, 1), 0);
  IF n < 2 THEN
    UPDATE tournaments SET status = 'cancelled', cancel_reason = 'menos_de_2_inscritos', cancelled_before_start = true, finished_at = now() WHERE id = t.id;
    PERFORM xadrez_rt.evento('cancelado', t.id, NULL, NULL, jsonb_build_object('motivo', 'menos_de_2_inscritos', 'inscritos', n));
    RETURN;
  END IF;
  rodadas := ceil(log(2, n::numeric))::int; tam := power(2, rodadas)::int; byes := tam - n; i := 1;
  WHILE pos < tam / 2 LOOP
    pos := pos + 1; a := jog[i];
    IF byes > 0 THEN b := NULL; byes := byes - 1; i := i + 1; ELSE b := jog[i + 1]; i := i + 2; END IF;
    INSERT INTO tournament_matches (tournament_id, round, slot, player1_id, player2_id, status, deadline_at, winner_id, finished_at, reason)
    VALUES (t.id, 1, pos, a, b, CASE WHEN b IS NULL THEN 'walkover'::match_status ELSE 'pending'::match_status END,
            now() + make_interval(hours => t.round_deadline_hours), CASE WHEN b IS NULL THEN a END, CASE WHEN b IS NULL THEN now() END,
            CASE WHEN b IS NULL THEN 'bye' END);
  END LOOP;
  UPDATE tournaments SET status = 'active', current_round = 1, total_rounds = rodadas WHERE id = t.id;
  PERFORM xadrez_rt.evento('iniciado', t.id, NULL, NULL, jsonb_build_object('inscritos', n, 'rodadas', rodadas, 'byes', tam - n));
  PERFORM xadrez_rt.avancar(t.id);
END $f$;

-- TRN-REG-06: empate na classificação → quem chegou primeiro (não a ordem alfabética)
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
     WHERE s.tournament_id = p_tournament_id AND s.status = 'normal'),
  agg AS (
    SELECT p.user_id, p.user_name, count(s.user_id)::int AS wins,
           min(s.player_seconds) FILTER (WHERE s.timed_live)::int AS best,
           max(s.created_at) AS ultima,                                              -- quando chegou ao nº de vitórias
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

-- TRN-REG-02/05/07: ranking de IA — partida tem de ser jogada DENTRO do período; a mesma partida não conta duas vezes
CREATE OR REPLACE FUNCTION public.register_ai_score(p_session_id text, p_difficulty smallint, p_username text,
  p_client_mouse_movements integer DEFAULT 0, p_client_drag_count integer DEFAULT 0, p_client_click_count integer DEFAULT 0,
  p_client_idle_periods integer DEFAULT 0, p_client_keyboard_events integer DEFAULT 0, p_client_undo_count integer DEFAULT 0,
  p_client_validated boolean DEFAULT false, p_client_player_seconds integer DEFAULT NULL, p_tournament_id uuid DEFAULT NULL)
RETURNS jsonb LANGUAGE plpgsql SECURITY DEFINER SET search_path = public AS $f$
DECLARE
  v_user uuid := auth.uid(); v_existente uuid; t tournaments; n int; desfeitos int; v_ini timestamptz; v_fim timestamptz;
  v_susp int := 0; v_status text := 'pendente'; v_id uuid; v_fp text;
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
  INSERT INTO scores (user_id, username, difficulty, player_seconds, session_id, status, suspicion_score, client_validated,
                      mouse_movements, drag_count, click_count, idle_periods, keyboard_events, undo_count, total_game_ms, tournament_id, fingerprint)
  VALUES (v_user, left(coalesce(nullif(trim(p_username), ''), xadrez_rt.nome(v_user)), 60), p_difficulty,
          greatest(1, extract(epoch FROM v_fim - v_ini)::int), p_session_id, v_status, v_susp, false,
          p_client_mouse_movements, p_client_drag_count, p_client_click_count, p_client_idle_periods, p_client_keyboard_events,
          p_client_undo_count, (extract(epoch FROM v_fim - v_ini) * 1000)::int, p_tournament_id, v_fp)
  RETURNING id INTO v_id;
  IF v_status = 'pendente' THEN PERFORM pg_notify('xadrez_conferir', v_id::text); END IF;
  RETURN jsonb_build_object('success', true, 'score_id', v_id, 'idempotent', false, 'status', v_status, 'suspicion_score', v_susp);
END $f$;

-- TRN-REG-02 / TRN-PIX-09: criador cancela só ANTES de começar (eliminatória sem rodada; ranking antes do starts_at);
-- depois, só admin. Estorno só para cancelado antes de começar.
CREATE OR REPLACE FUNCTION public.cancel_tournament(p_tournament_id uuid) RETURNS tournaments
LANGUAGE plpgsql SECURITY DEFINER SET search_path = public AS $f$
DECLARE v_user uuid := auth.uid(); t tournaments; antes boolean;
BEGIN
  IF v_user IS NULL THEN RAISE EXCEPTION 'login required'; END IF;
  SELECT * INTO t FROM tournaments WHERE id = p_tournament_id FOR UPDATE;
  IF t.id IS NULL THEN RAISE EXCEPTION 'not found'; END IF;
  IF t.status NOT IN ('open','active') THEN RAISE EXCEPTION 'tournament already closed'; END IF;
  antes := (t.format = 'pvp_bracket' AND t.status = 'open' AND t.current_round = 0) OR (t.format = 'ai' AND now() < t.starts_at);
  IF NOT is_admin() THEN
    IF t.creator_id <> v_user THEN RAISE EXCEPTION 'only creator/admin'; END IF;
    IF NOT antes THEN RAISE EXCEPTION 'only admin can cancel after start'; END IF;
  END IF;
  UPDATE games SET status = 'abandoned', result = 'abandoned', end_reason = 'torneio_cancelado', ended_at = now()
   WHERE status = 'active' AND tournament_match_id IN (SELECT id FROM tournament_matches WHERE tournament_id = t.id);
  UPDATE tournaments SET status = 'cancelled', cancel_reason = CASE WHEN is_admin() AND t.creator_id <> v_user THEN 'admin' ELSE 'criador' END,
                         cancelled_before_start = antes, finished_at = now() WHERE id = t.id RETURNING * INTO t;
  PERFORM xadrez_rt.evento('cancelado', t.id, NULL, NULL, jsonb_build_object('por', v_user, 'antes_de_comecar', antes));
  RETURN t;
END $f$;

-- TRN-PIX-07: eliminatória marcada para daqui a menos de 30 min não dá tempo de pagar e inscrever
CREATE OR REPLACE FUNCTION xadrez_rt.validar_inicio() RETURNS trigger LANGUAGE plpgsql AS $f$
BEGIN
  IF NEW.format = 'pvp_bracket' AND NEW.starts_at < now() + interval '30 minutes' THEN
    RAISE EXCEPTION 'starts_at must be at least 30 minutes from now';
  END IF;
  RETURN NEW;
END $f$;
DROP TRIGGER IF EXISTS validar_inicio ON public.tournaments;
CREATE TRIGGER validar_inicio BEFORE INSERT ON public.tournaments FOR EACH ROW EXECUTE FUNCTION xadrez_rt.validar_inicio();

-- Pix: cobrança só se ainda dá tempo; pagamento atrasado (expirado/cancelado) ainda é reconhecido; duplicado é estornado
CREATE OR REPLACE FUNCTION xadrez_rt.pix_preparar(p_tournament_id uuid, p_user uuid) RETURNS jsonb
LANGUAGE plpgsql SECURITY DEFINER SET search_path = public AS $f$
DECLARE t tournaments; p xadrez_rt.pagamentos; e text;
BEGIN
  SELECT * INTO t FROM tournaments WHERE id = p_tournament_id FOR UPDATE;
  IF t.id IS NULL OR (t.creator_id <> p_user AND NOT EXISTS (SELECT 1 FROM admin_users WHERE user_id = p_user)) THEN
    RETURN jsonb_build_object('erro', 'not_found');
  END IF;
  IF t.paid THEN RETURN jsonb_build_object('pago', true); END IF;
  IF t.status <> 'open' THEN RETURN jsonb_build_object('erro', 'not_open'); END IF;
  IF t.format = 'pvp_bracket' AND t.starts_at < now() + interval '10 minutes' THEN RETURN jsonb_build_object('erro', 'starts_too_soon'); END IF;
  IF t.format = 'ai' AND t.ends_at < now() + interval '1 hour' THEN RETURN jsonb_build_object('erro', 'starts_too_soon'); END IF;
  SELECT * INTO p FROM xadrez_rt.pagamentos WHERE tournament_id = t.id AND status = 'pendente' AND expira_em > now() + interval '2 minutes'
   ORDER BY criado_em DESC LIMIT 1;
  SELECT email INTO e FROM auth.users WHERE id = t.creator_id;
  RETURN jsonb_build_object('pago', false, 'existente', CASE WHEN p.id IS NULL THEN NULL ELSE to_jsonb(p) END,
    'anteriores', (SELECT coalesce(jsonb_agg(provedor_id), '[]') FROM xadrez_rt.pagamentos
                    WHERE tournament_id = t.id AND status = 'pendente' AND (p.id IS NULL OR id <> p.id)),
    'valor', (SELECT valor FROM xadrez_rt.config WHERE chave = 'preco_torneio'),
    'validade_min', (SELECT valor FROM xadrez_rt.config WHERE chave = 'pix_validade_min'), 'email', e, 'nome', t.name);
END $f$;

CREATE OR REPLACE FUNCTION xadrez_rt.pix_confirmar(p_provedor_id text, p_status text, p_valor numeric, p_bruto jsonb) RETURNS text
LANGUAGE plpgsql SECURITY DEFINER SET search_path = public AS $f$
DECLARE p xadrez_rt.pagamentos; t tournaments;
BEGIN
  SELECT * INTO p FROM xadrez_rt.pagamentos WHERE provedor_id = p_provedor_id FOR UPDATE;
  IF p.id IS NULL THEN
    PERFORM xadrez_rt.evento('pix_orfao', NULL, NULL, NULL, jsonb_build_object('id', p_provedor_id, 'status', p_status, 'valor', p_valor));
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
    IF t.status = 'open' AND NOT t.paid THEN
      UPDATE tournaments SET paid = true, paid_at = now() WHERE id = t.id;
      PERFORM xadrez_rt.evento('pago_pix', t.id, NULL, NULL, jsonb_build_object('id', p_provedor_id, 'valor', p_valor));
      RETURN 'liberado';
    END IF;
    PERFORM xadrez_rt.evento('pix_pago_sem_liberar', t.id, NULL, NULL, jsonb_build_object('id', p_provedor_id, 'status', t.status, 'ja_pago', t.paid));
    RETURN 'pago_sem_liberar';                      -- vai para o estorno (pix_para_estornar)
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

-- reconsulta: pendentes E expirados/cancelados recentes (um Pix pago no último minuto, com o webhook perdido, não fica preso)
CREATE OR REPLACE FUNCTION xadrez_rt.pix_pendentes() RETURNS SETOF text LANGUAGE sql STABLE SECURITY DEFINER
SET search_path = public AS $f$
  SELECT provedor_id FROM xadrez_rt.pagamentos
   WHERE provedor_id IS NOT NULL AND NOT provedor_id LIKE 'sim-%'
     AND (status = 'pendente' OR (status IN ('expirado','cancelado') AND expira_em > now() - interval '2 days'))
     AND criado_em > now() - interval '3 days'
   ORDER BY criado_em DESC LIMIT 50;
$f$;

-- estorno: torneio cancelado antes de começar, ou pagamento a mais (outro Pix do mesmo torneio já tinha liberado)
CREATE OR REPLACE FUNCTION xadrez_rt.pix_para_estornar() RETURNS SETOF text LANGUAGE sql STABLE SECURITY DEFINER
SET search_path = public AS $f$
  SELECT p.provedor_id FROM xadrez_rt.pagamentos p JOIN tournaments t ON t.id = p.tournament_id
   WHERE p.status = 'pago' AND p.tentativas_estorno < 5 AND (
         (t.status = 'cancelled' AND t.cancelled_before_start)
      OR EXISTS (SELECT 1 FROM xadrez_rt.pagamentos o WHERE o.tournament_id = p.tournament_id AND o.id <> p.id
                  AND o.status IN ('pago','estornado','estorno_falhou') AND o.pago_em < p.pago_em))
   LIMIT 10;
$f$;
CREATE OR REPLACE FUNCTION xadrez_rt.pix_estorno_falhou(p_provedor_id text, p_erro text) RETURNS void
LANGUAGE plpgsql SECURITY DEFINER SET search_path = public AS $f$
BEGIN
  UPDATE xadrez_rt.pagamentos SET tentativas_estorno = tentativas_estorno + 1, erro_estorno = left(p_erro, 300), atualizado_em = now(),
         status = CASE WHEN tentativas_estorno + 1 >= 5 THEN 'estorno_falhou' ELSE status END
   WHERE provedor_id = p_provedor_id;
END $f$;

-- simulado vence na hora; o real só é dado por vencido pela reconsulta (o pagamento pode ter caído no último minuto)
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

  -- TRN-REG-02: ranking de IA fica "em andamento" no início; fecha 10 min depois do fim (tolerância do envio) e sem fila
  UPDATE tournaments SET status = 'active' WHERE format = 'ai' AND status = 'open' AND paid AND starts_at <= now();
  n := 0;
  FOR r IN SELECT t.id FROM tournaments t WHERE t.format = 'ai' AND t.status IN ('open','active') AND t.ends_at + interval '10 minutes' < now()
            AND NOT EXISTS (SELECT 1 FROM scores s WHERE s.tournament_id = t.id AND s.status = 'pendente' AND s.created_at > now() - interval '30 minutes') LOOP
    BEGIN PERFORM xadrez_rt.encerrar_ranking(r.id); n := n + 1;
    EXCEPTION WHEN OTHERS THEN PERFORM xadrez_rt.evento_erro('ranking', r.id, NULL, NULL, SQLERRM); END;
  END LOOP;
  feitos := feitos || jsonb_build_object('rankings', n);

  UPDATE xadrez_rt.pagamentos SET status = 'expirado', atualizado_em = now()
   WHERE status = 'pendente' AND provedor_id LIKE 'sim-%' AND expira_em < now();
  RETURN feitos;
END $f$;

-- ranking em andamento continua aceitando inscrição até o fim (antes só 'open')
CREATE OR REPLACE FUNCTION public.join_tournament(p_tournament_id uuid, p_token text DEFAULT NULL)
RETURNS tournament_participants LANGUAGE plpgsql SECURITY DEFINER SET search_path = public AS $f$
DECLARE v_user uuid := auth.uid(); t tournaments; n int; st participant_status; atual tournament_participants; v_row tournament_participants;
BEGIN
  IF v_user IS NULL THEN RAISE EXCEPTION 'login required'; END IF;
  SELECT * INTO t FROM tournaments WHERE id = p_tournament_id FOR UPDATE;
  IF t.id IS NULL OR NOT t.paid THEN RAISE EXCEPTION 'tournament not found'; END IF;
  IF t.visibility = 'link' AND p_token IS DISTINCT FROM t.share_token AND NOT is_admin() THEN RAISE EXCEPTION 'tournament not found'; END IF;
  IF NOT (t.status = 'open' OR (t.format = 'ai' AND t.status = 'active')) THEN RAISE EXCEPTION 'tournament not open'; END IF;
  IF t.format = 'ai' AND t.ends_at < now() THEN RAISE EXCEPTION 'tournament has ended'; END IF;
  IF t.creator_id = v_user THEN RAISE EXCEPTION 'creator cannot join own tournament'; END IF;
  SELECT * INTO atual FROM tournament_participants WHERE tournament_id = t.id AND user_id = v_user;
  IF atual.status = 'rejected' THEN RAISE EXCEPTION 'your registration was rejected by the organizer'; END IF;
  IF atual.status IN ('pending','approved') THEN RETURN atual; END IF;
  SELECT count(*) INTO n FROM tournament_participants WHERE tournament_id = t.id AND status IN ('pending','approved');
  IF n >= t.capacity THEN RAISE EXCEPTION 'tournament full'; END IF;
  st := CASE t.visibility WHEN 'approval' THEN 'pending'::participant_status ELSE 'approved'::participant_status END;
  INSERT INTO tournament_participants (tournament_id, user_id, user_name, status)
  VALUES (t.id, v_user, coalesce(xadrez_rt.nome(v_user), 'Jogador'), st)
  ON CONFLICT (tournament_id, user_id) DO UPDATE SET status = excluded.status, joined_at = now()
  RETURNING * INTO v_row;
  RETURN v_row;
END $f$;

-- TRN-UX-02: a página de um torneio aberta por quem NÃO entrou (link de divulgação) mostra o torneio listado
CREATE OR REPLACE FUNCTION public.get_tournament(p_tournament_id uuid, p_token text DEFAULT NULL)
RETURNS TABLE(id uuid, name text, description text, prize_description text, creator_id uuid, creator_name text,
              format tournament_format, visibility tournament_visibility, status tournament_status, capacity integer,
              starts_at timestamptz, ends_at timestamptz, paid boolean, difficulty smallint, criterion tournament_criterion,
              round_deadline_hours integer, total_rounds integer, current_round integer, time_control_seconds integer,
              winner_id uuid, winner_name text, finished_at timestamptz, cancel_reason text, participant_count integer,
              share_token text, created_at timestamptz)
LANGUAGE sql STABLE SECURITY DEFINER SET search_path = public AS $f$
  SELECT t.id, t.name, t.description, t.prize_description, t.creator_id, t.creator_name, t.format, t.visibility, t.status, t.capacity,
         t.starts_at, t.ends_at, t.paid, t.difficulty, t.criterion, t.round_deadline_hours, t.total_rounds, t.current_round,
         t.time_control_seconds, t.winner_id,
         (SELECT p.user_name FROM tournament_participants p WHERE p.tournament_id = t.id AND p.user_id = t.winner_id),
         t.finished_at, t.cancel_reason,
         (SELECT count(*)::int FROM tournament_participants p WHERE p.tournament_id = t.id AND p.status = 'approved'),
         CASE WHEN t.creator_id = auth.uid() OR is_admin() OR (p_token IS NOT NULL AND p_token = t.share_token)
                OR EXISTS (SELECT 1 FROM tournament_participants p WHERE p.tournament_id = t.id AND p.user_id = auth.uid() AND p.status = 'approved')
              THEN t.share_token END,
         t.created_at
    FROM tournaments t
   WHERE t.id = p_tournament_id AND xadrez_rt.pode_ver(p_tournament_id, p_token);
$f$;

-- TRN-PIX-04: o que está com problema no dinheiro e na rotina, para o admin ver numa tela (sem psql)
CREATE OR REPLACE FUNCTION public.admin_payment_problems()
RETURNS TABLE(tipo text, tournament_id uuid, tournament_name text, valor numeric, status text, detalhe text, desde timestamptz)
LANGUAGE sql STABLE SECURITY DEFINER SET search_path = public AS $f$
  SELECT * FROM (
    SELECT 'estorno_pendente'::text, p.tournament_id, t.name, p.valor, p.status,
           coalesce('tentativas: ' || p.tentativas_estorno || coalesce(' — ' || p.erro_estorno, ''), ''), p.pago_em
      FROM xadrez_rt.pagamentos p JOIN tournaments t ON t.id = p.tournament_id
     WHERE p.provedor_id IN (SELECT xadrez_rt.pix_para_estornar())
    UNION ALL
    SELECT 'estorno_falhou', p.tournament_id, t.name, p.valor, p.status, coalesce(p.erro_estorno, ''), p.atualizado_em
      FROM xadrez_rt.pagamentos p JOIN tournaments t ON t.id = p.tournament_id WHERE p.status = 'estorno_falhou'
    UNION ALL
    SELECT 'pago_sem_liberar', p.tournament_id, t.name, p.valor, t.status::text, 'Pix pago, torneio não liberado', p.pago_em
      FROM xadrez_rt.pagamentos p JOIN tournaments t ON t.id = p.tournament_id
     WHERE p.status = 'pago' AND NOT t.paid
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

-- compartilhar (pedido do dono, 24/10/2026): prévia do link /t/<código> — por id só torneio listado; por código do convite, o privado
CREATE OR REPLACE FUNCTION xadrez_rt.torneio_para_compartilhar(p_codigo text) RETURNS jsonb
LANGUAGE sql STABLE SECURITY DEFINER SET search_path = public AS $f$
  SELECT jsonb_build_object('id', t.id, 'nome', t.name, 'premio', t.prize_description, 'formato', t.format, 'status', t.status,
           'inicio', t.starts_at, 'fim', t.ends_at, 'dificuldade', t.difficulty, 'criterio', t.criterion, 'vagas', t.capacity,
           'inscritos', (SELECT count(*) FROM tournament_participants p WHERE p.tournament_id = t.id AND p.status = 'approved'),
           'campeao', (SELECT p.user_name FROM tournament_participants p WHERE p.tournament_id = t.id AND p.user_id = t.winner_id),
           'token', CASE WHEN t.share_token = p_codigo THEN t.share_token END)
    FROM tournaments t
   WHERE t.paid AND ((t.share_token = p_codigo AND length(p_codigo) >= 12)
      OR (p_codigo ~ '^[0-9a-f-]{36}$' AND t.id::text = p_codigo AND t.visibility IN ('public','approval')))
   LIMIT 1;
$f$;

GRANT EXECUTE ON FUNCTION xadrez_rt.pix_estorno_falhou(text, text), xadrez_rt.evento_erro(text, uuid, uuid, text, text),
  xadrez_rt.torneio_para_compartilhar(text) TO xadrez_rt;

RESET ROLE;
COMMIT;
