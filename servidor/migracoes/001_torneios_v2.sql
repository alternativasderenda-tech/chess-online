-- Torneios v2 (gauntlet "faça a magia", 24/10/2026) — ver servidor/DECISOES.md §2 (D-TRN-*, D-PAG-*).
-- Aplicar como superusuário (postgres) no banco do ambiente: psql -d xadrez_teste -f 001_torneios_v2.sql
-- Idempotente. Tudo o que é interno (rotina, conferência, pagamento) fica no schema PRIVADO xadrez_rt, que o
-- PostgREST não expõe (db-schemas=public). No schema public, toda função nova nasce executável por anon/authenticated
-- (privilégio padrão herdado do Supabase): cada RPC pública confere quem chama.
BEGIN;

-- ---------------------------------------------------------------- estrutura
CREATE SCHEMA IF NOT EXISTS xadrez_rt AUTHORIZATION xadrez_owner;
REVOKE ALL ON SCHEMA xadrez_rt FROM PUBLIC;
GRANT USAGE ON SCHEMA xadrez_rt TO xadrez_rt;

SET ROLE xadrez_owner;

ALTER TABLE public.tournaments ADD COLUMN IF NOT EXISTS winner_id uuid REFERENCES auth.users(id) ON DELETE SET NULL;
ALTER TABLE public.tournaments ADD COLUMN IF NOT EXISTS finished_at timestamptz;
ALTER TABLE public.tournaments ADD COLUMN IF NOT EXISTS cancel_reason text;
ALTER TABLE public.tournament_matches ADD COLUMN IF NOT EXISTS present_p1_at timestamptz;   -- abriu a sala
ALTER TABLE public.tournament_matches ADD COLUMN IF NOT EXISTS present_p2_at timestamptz;
ALTER TABLE public.tournament_matches ADD COLUMN IF NOT EXISTS tiebreaks int NOT NULL DEFAULT 0; -- desempates jogados
ALTER TABLE public.tournament_matches ADD COLUMN IF NOT EXISTS reason text;    -- como foi decidida
ALTER TABLE public.scores ADD COLUMN IF NOT EXISTS reject_reason text;
ALTER TABLE public.scores ADD COLUMN IF NOT EXISTS server_checked_at timestamptz;
ALTER TABLE public.scores ADD COLUMN IF NOT EXISTS timed_live boolean;      -- lances gravados ao vivo (tempo vale)
ALTER TABLE public.ai_game_moves ADD COLUMN IF NOT EXISTS undone boolean NOT NULL DEFAULT false;

-- placar: 'pendente' (na fila de conferência) e 'rejeitado' (não passou na reprodução)
ALTER TABLE public.scores DROP CONSTRAINT IF EXISTS scores_status_check;
ALTER TABLE public.scores ADD CONSTRAINT scores_status_check
  CHECK (status = ANY (ARRAY['normal','cheater','hacker','pendente','rejeitado']));

-- pagamentos (privado)
CREATE TABLE IF NOT EXISTS xadrez_rt.pagamentos (
  id                 uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  tournament_id      uuid NOT NULL REFERENCES public.tournaments(id) ON DELETE CASCADE,
  provedor           text NOT NULL DEFAULT 'mercadopago',
  provedor_id        text UNIQUE,                 -- id do pagamento no Mercado Pago
  valor              numeric(10,2) NOT NULL,
  status             text NOT NULL DEFAULT 'pendente' CHECK (status IN ('pendente','pago','expirado','cancelado','estornado','falhou')),
  qr_code            text,
  qr_code_base64     text,
  expira_em          timestamptz,
  pago_em            timestamptz,
  criado_em          timestamptz NOT NULL DEFAULT now(),
  atualizado_em      timestamptz NOT NULL DEFAULT now(),
  bruto              jsonb
);
CREATE INDEX IF NOT EXISTS pagamentos_torneio ON xadrez_rt.pagamentos (tournament_id, criado_em DESC);
CREATE TABLE IF NOT EXISTS xadrez_rt.config (chave text PRIMARY KEY, valor text NOT NULL);
INSERT INTO xadrez_rt.config VALUES ('preco_torneio', '1.00'), ('pix_validade_min', '30') ON CONFLICT DO NOTHING;
-- registro do que a rotina fez (auditoria e prova nos testes)
CREATE TABLE IF NOT EXISTS xadrez_rt.eventos (
  id bigserial PRIMARY KEY, em timestamptz NOT NULL DEFAULT now(), tipo text NOT NULL, tournament_id uuid,
  match_id uuid, game_id text, detalhe jsonb
);
GRANT SELECT, INSERT, UPDATE ON xadrez_rt.pagamentos TO xadrez_rt;
GRANT SELECT ON xadrez_rt.config TO xadrez_rt;
GRANT SELECT, INSERT ON xadrez_rt.eventos TO xadrez_rt;
GRANT USAGE ON SEQUENCE xadrez_rt.eventos_id_seq TO xadrez_rt;

-- ---------------------------------------------------------------- D-TRN-01: jogo de torneio só pelo servidor
CREATE OR REPLACE FUNCTION xadrez_rt.proteger_jogo_torneio() RETURNS trigger LANGUAGE plpgsql AS $f$
BEGIN
  IF current_user NOT IN ('anon', 'authenticated') THEN RETURN NEW; END IF;   -- funções do servidor passam
  IF TG_OP = 'INSERT' THEN
    IF NEW.tournament_match_id IS NOT NULL THEN RAISE EXCEPTION 'jogo de torneio só é criado pelo servidor'; END IF;
    RETURN NEW;
  END IF;
  IF OLD.tournament_match_id IS NULL AND NEW.tournament_match_id IS NULL THEN RETURN NEW; END IF;
  IF NEW.tournament_match_id IS DISTINCT FROM OLD.tournament_match_id OR NEW.status IS DISTINCT FROM OLD.status
     OR NEW.result IS DISTINCT FROM OLD.result OR NEW.white_user_id IS DISTINCT FROM OLD.white_user_id
     OR NEW.black_user_id IS DISTINCT FROM OLD.black_user_id OR NEW.ended_at IS DISTINCT FROM OLD.ended_at
     OR NEW.end_reason IS DISTINCT FROM OLD.end_reason OR NEW.time_control IS DISTINCT FROM OLD.time_control
     OR NEW.started_at IS DISTINCT FROM OLD.started_at OR NEW.id IS DISTINCT FROM OLD.id THEN
    RAISE EXCEPTION 'o resultado de jogo de torneio é decidido pelo servidor';
  END IF;
  RETURN NEW;
END $f$;
DROP TRIGGER IF EXISTS proteger_jogo_torneio ON public.games;
CREATE TRIGGER proteger_jogo_torneio BEFORE INSERT OR UPDATE ON public.games
  FOR EACH ROW EXECUTE FUNCTION xadrez_rt.proteger_jogo_torneio();

-- lance de jogo de torneio: só com o jogo ativo, na vez certa e na ordem; fim de jogo do cliente é ignorado
CREATE OR REPLACE FUNCTION xadrez_rt.conferir_lance_torneio() RETURNS trigger LANGUAGE plpgsql SECURITY DEFINER
SET search_path = public AS $f$
DECLARE g games; ultimo int;
BEGIN
  SELECT * INTO g FROM games WHERE id = NEW.game_id;
  IF g.tournament_match_id IS NULL THEN RETURN NEW; END IF;
  IF g.status <> 'active' THEN RAISE EXCEPTION 'partida encerrada'; END IF;
  SELECT coalesce(max(move_number), 0) INTO ultimo FROM moves WHERE game_id = NEW.game_id;
  IF NEW.move_number <> ultimo + 1 THEN RAISE EXCEPTION 'lance fora de ordem (esperado %)', ultimo + 1; END IF;
  IF NEW.player_color <> (CASE WHEN NEW.move_number % 2 = 1 THEN 'w' ELSE 'b' END) THEN RAISE EXCEPTION 'não é a sua vez'; END IF;
  NEW.is_game_over := false; NEW.game_result := NULL; NEW.created_at := now();
  RETURN NEW;
END $f$;
DROP TRIGGER IF EXISTS conferir_lance_torneio ON public.moves;
CREATE TRIGGER conferir_lance_torneio BEFORE INSERT ON public.moves
  FOR EACH ROW EXECUTE FUNCTION xadrez_rt.conferir_lance_torneio();

-- o gatilho antigo (dava a vitória a quem marcasse o próprio jogo como terminado) sai
DROP TRIGGER IF EXISTS trg_games_finished_to_tournament ON public.games;

-- ---------------------------------------------------------------- helpers internos
CREATE OR REPLACE FUNCTION xadrez_rt.evento(p_tipo text, p_t uuid, p_m uuid, p_g text, p_det jsonb DEFAULT NULL)
RETURNS void LANGUAGE sql SECURITY DEFINER SET search_path = public AS $f$
  INSERT INTO xadrez_rt.eventos (tipo, tournament_id, match_id, game_id, detalhe) VALUES (p_tipo, p_t, p_m, p_g, p_det);
$f$;

CREATE OR REPLACE FUNCTION xadrez_rt.nome(p_user uuid) RETURNS text LANGUAGE sql STABLE SECURITY DEFINER
SET search_path = public AS $f$
  SELECT coalesce(raw_user_meta_data->>'full_name', raw_user_meta_data->>'name', split_part(email, '@', 1), 'Jogador')
    FROM auth.users WHERE id = p_user;
$f$;

-- cria o jogo de uma partida (1º jogo ou desempate). Cores: sorteio no 1º; invertidas no desempate.
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
  UPDATE tournament_matches SET game_id = v_id, status = 'in_progress' WHERE id = p_match;
  PERFORM xadrez_rt.evento('jogo_criado', t.id, m.id, v_id, jsonb_build_object('brancas', p_white, 'pretas', p_black, 'desempate', m.tiebreaks));
  RETURN v_id;
END $f$;

-- D-TRN-05: avança o chaveamento quando a rodada atual inteira está decidida; fecha o torneio na final
CREATE OR REPLACE FUNCTION xadrez_rt.avancar(p_t uuid) RETURNS void LANGUAGE plpgsql SECURITY DEFINER
SET search_path = public AS $f$
DECLARE t tournaments; total int; feitos int; vencedores uuid[]; i int := 1; pos int := 0;
BEGIN
  SELECT * INTO t FROM tournaments WHERE id = p_t FOR UPDATE;          -- serializa: duas partidas no mesmo instante
  IF t.format <> 'pvp_bracket' OR t.status <> 'active' THEN RETURN; END IF;
  SELECT count(*), count(*) FILTER (WHERE status IN ('finished','walkover')) INTO total, feitos
    FROM tournament_matches WHERE tournament_id = t.id AND round = t.current_round;
  IF total = 0 OR total <> feitos THEN RETURN; END IF;
  SELECT array_agg(winner_id ORDER BY slot) INTO vencedores FROM tournament_matches
   WHERE tournament_id = t.id AND round = t.current_round;
  IF array_length(vencedores, 1) = 1 THEN                               -- a rodada era a final
    UPDATE tournaments SET status = 'finished', winner_id = vencedores[1], finished_at = now() WHERE id = t.id;
    PERFORM xadrez_rt.evento('campeao', t.id, NULL, NULL, jsonb_build_object('vencedor', vencedores[1]));
    RETURN;
  END IF;
  WHILE i <= array_length(vencedores, 1) LOOP
    pos := pos + 1;
    INSERT INTO tournament_matches (tournament_id, round, slot, player1_id, player2_id, status, deadline_at)
    VALUES (t.id, t.current_round + 1, pos, vencedores[i], vencedores[i + 1], 'pending',
            now() + make_interval(hours => t.round_deadline_hours));
    i := i + 2;
  END LOOP;
  UPDATE tournaments SET current_round = current_round + 1 WHERE id = t.id;
  PERFORM xadrez_rt.evento('rodada', t.id, NULL, NULL, jsonb_build_object('rodada', t.current_round + 1));
END $f$;

-- decide a partida (vencedor) e avança
CREATE OR REPLACE FUNCTION xadrez_rt.decidir_partida(p_match uuid, p_vencedor uuid, p_status match_status, p_motivo text)
RETURNS void LANGUAGE plpgsql SECURITY DEFINER SET search_path = public AS $f$
DECLARE m tournament_matches;
BEGIN
  SELECT * INTO m FROM tournament_matches WHERE id = p_match FOR UPDATE;
  IF m.status IN ('finished','walkover') THEN RETURN; END IF;
  IF p_vencedor IS NULL OR p_vencedor NOT IN (m.player1_id, m.player2_id) THEN RAISE EXCEPTION 'vencedor não é jogador da partida'; END IF;
  UPDATE tournament_matches SET winner_id = p_vencedor, status = p_status, reason = p_motivo, finished_at = now() WHERE id = p_match;
  PERFORM xadrez_rt.evento('partida_decidida', m.tournament_id, m.id, m.game_id, jsonb_build_object('vencedor', p_vencedor, 'motivo', p_motivo));
  PERFORM xadrez_rt.avancar(m.tournament_id);
END $f$;

-- D-TRN-01/06: encerra um jogo de torneio com o resultado conferido pelo servidor. Empate → desempate com cores
-- invertidas; no 3º jogo (2º desempate) é Armageddon: empate = vitória das Pretas.
CREATE OR REPLACE FUNCTION xadrez_rt.encerrar_jogo(p_game text, p_result text, p_motivo text) RETURNS void
LANGUAGE plpgsql SECURITY DEFINER SET search_path = public AS $f$
DECLARE g games; m tournament_matches; venc uuid;
BEGIN
  SELECT * INTO g FROM games WHERE id = p_game FOR UPDATE;
  IF g.id IS NULL OR g.status <> 'active' OR g.tournament_match_id IS NULL THEN RETURN; END IF;
  IF p_result NOT IN ('white_wins','black_wins','draw') THEN RAISE EXCEPTION 'resultado inválido'; END IF;
  SELECT * INTO m FROM tournament_matches WHERE id = g.tournament_match_id FOR UPDATE;
  IF p_result = 'draw' AND m.tiebreaks >= 2 THEN p_result := 'black_wins'; p_motivo := p_motivo || '_armageddon'; END IF;
  UPDATE games SET status = 'finished', result = p_result, end_reason = p_motivo, ended_at = now() WHERE id = p_game;
  PERFORM xadrez_rt.evento('jogo_encerrado', m.tournament_id, m.id, p_game, jsonb_build_object('resultado', p_result, 'motivo', p_motivo));
  IF m.status IN ('finished','walkover') THEN RETURN; END IF;
  IF p_result = 'draw' THEN
    UPDATE tournament_matches SET tiebreaks = tiebreaks + 1 WHERE id = m.id;
    PERFORM xadrez_rt.criar_jogo(m.id, g.black_user_id, g.white_user_id);          -- cores invertidas
    RETURN;
  END IF;
  venc := CASE p_result WHEN 'white_wins' THEN g.white_user_id ELSE g.black_user_id END;
  PERFORM xadrez_rt.decidir_partida(m.id, venc, 'finished', p_motivo);
END $f$;

-- D-TRN-05: início do chaveamento com o número REAL de inscritos; byes resolvidos na hora
CREATE OR REPLACE FUNCTION xadrez_rt.iniciar_chave(p_t uuid) RETURNS void LANGUAGE plpgsql SECURITY DEFINER
SET search_path = public AS $f$
DECLARE t tournaments; jog uuid[]; n int; rodadas int; tam int; byes int; i int; pos int := 0; a uuid; b uuid;
BEGIN
  SELECT * INTO t FROM tournaments WHERE id = p_t FOR UPDATE;
  IF t.status <> 'open' OR t.format <> 'pvp_bracket' THEN RETURN; END IF;
  SELECT array_agg(user_id ORDER BY random()) INTO jog FROM tournament_participants
   WHERE tournament_id = t.id AND status = 'approved';
  n := coalesce(array_length(jog, 1), 0);
  IF n < 2 THEN
    UPDATE tournaments SET status = 'cancelled', cancel_reason = 'menos_de_2_inscritos', finished_at = now() WHERE id = t.id;
    PERFORM xadrez_rt.evento('cancelado', t.id, NULL, NULL, jsonb_build_object('motivo', 'menos_de_2_inscritos', 'inscritos', n));
    RETURN;
  END IF;
  rodadas := ceil(log(2, n::numeric))::int;
  tam := power(2, rodadas)::int;
  byes := tam - n;
  -- os byes vão para os primeiros sorteados: cada par i = (jog[2i-1], jog[2i]) com bye quando faltam adversários
  i := 1;
  WHILE pos < tam / 2 LOOP
    pos := pos + 1;
    a := jog[i];
    IF byes > 0 THEN b := NULL; byes := byes - 1; i := i + 1; ELSE b := jog[i + 1]; i := i + 2; END IF;
    INSERT INTO tournament_matches (tournament_id, round, slot, player1_id, player2_id, status, deadline_at, winner_id, finished_at, reason)
    VALUES (t.id, 1, pos, a, b,
            CASE WHEN b IS NULL THEN 'walkover'::match_status ELSE 'pending'::match_status END,
            now() + make_interval(hours => t.round_deadline_hours),
            CASE WHEN b IS NULL THEN a END, CASE WHEN b IS NULL THEN now() END, CASE WHEN b IS NULL THEN 'bye' END);
  END LOOP;
  UPDATE tournaments SET status = 'active', current_round = 1, total_rounds = rodadas WHERE id = t.id;
  PERFORM xadrez_rt.evento('iniciado', t.id, NULL, NULL, jsonb_build_object('inscritos', n, 'rodadas', rodadas, 'byes', tam - n));
  PERFORM xadrez_rt.avancar(t.id);     -- rodada só de byes (não acontece com tam/2 pares e n>=2, mas é barato)
END $f$;

-- D-TRN-08: encerra ranking de IA e grava o campeão pelo critério (só placares conferidos)
CREATE OR REPLACE FUNCTION xadrez_rt.encerrar_ranking(p_t uuid) RETURNS void LANGUAGE plpgsql SECURITY DEFINER
SET search_path = public AS $f$
DECLARE t tournaments; venc uuid;
BEGIN
  SELECT * INTO t FROM tournaments WHERE id = p_t FOR UPDATE;
  IF t.format <> 'ai' OR t.status NOT IN ('open','active') THEN RETURN; END IF;
  SELECT user_id INTO venc FROM public.tournament_leaderboard(p_t) WHERE wins > 0 LIMIT 1;
  UPDATE tournaments SET status = 'finished', winner_id = venc, finished_at = now() WHERE id = t.id;
  PERFORM xadrez_rt.evento('campeao', t.id, NULL, NULL, jsonb_build_object('vencedor', venc, 'criterio', t.criterion));
END $f$;

-- ---------------------------------------------------------------- D-TRN-04: rotina (chamada a cada minuto pelo servidor)
-- Relógio de torneio pelos horários do servidor (D-TRN-01): o 1º lance de cada lado não conta (como no Lichess).
CREATE OR REPLACE FUNCTION xadrez_rt.tempo_gasto(p_game text, OUT brancas numeric, OUT pretas numeric, OUT vez text, OUT ultimo timestamptz, OUT lances int)
LANGUAGE sql STABLE SECURITY DEFINER SET search_path = public AS $f$
  WITH l AS (
    SELECT move_number, player_color, created_at, lag(created_at) OVER (ORDER BY move_number) AS antes
      FROM moves WHERE game_id = p_game)
  SELECT coalesce(sum(extract(epoch FROM created_at - antes)) FILTER (WHERE player_color = 'w' AND move_number > 2), 0),
         coalesce(sum(extract(epoch FROM created_at - antes)) FILTER (WHERE player_color = 'b' AND move_number > 2), 0),
         CASE WHEN coalesce(max(move_number), 0) % 2 = 0 THEN 'w' ELSE 'b' END,
         max(created_at), coalesce(max(move_number), 0)::int
    FROM l;
$f$;

CREATE OR REPLACE FUNCTION xadrez_rt.tick() RETURNS jsonb LANGUAGE plpgsql SECURITY DEFINER SET search_path = public AS $f$
DECLARE r record; tg record; feitos jsonb := '{}'::jsonb; n int; venc uuid; presentes int; g games;
BEGIN
  -- 1) tempo esgotado em jogo de torneio (os dois podem ter saído do site)
  n := 0;
  FOR r IN SELECT gm.id, gm.time_control, gm.white_user_id, gm.black_user_id FROM games gm
            WHERE gm.status = 'active' AND gm.tournament_match_id IS NOT NULL AND gm.time_control > 0 LOOP
    SELECT * INTO tg FROM xadrez_rt.tempo_gasto(r.id);
    CONTINUE WHEN tg.lances < 2;                                         -- antes do 1º lance de cada lado: prazo da rodada
    IF (CASE WHEN tg.vez = 'w' THEN tg.brancas ELSE tg.pretas END) + extract(epoch FROM now() - tg.ultimo) > r.time_control THEN
      BEGIN
        PERFORM xadrez_rt.encerrar_jogo(r.id, CASE WHEN tg.vez = 'w' THEN 'black_wins' ELSE 'white_wins' END, 'tempo');
        n := n + 1;
      EXCEPTION WHEN OTHERS THEN PERFORM xadrez_rt.evento('erro_tick', NULL, NULL, r.id, jsonb_build_object('etapa', 'tempo', 'erro', SQLERRM));
      END;
    END IF;
  END LOOP;
  feitos := feitos || jsonb_build_object('tempo', n);

  -- 2) D-TRN-07: prazo da rodada vencido sem a partida ter começado de verdade (cada lado ao menos 1 lance)
  n := 0;
  FOR r IN SELECT m.* FROM tournament_matches m JOIN tournaments t ON t.id = m.tournament_id
            WHERE t.status = 'active' AND m.status IN ('pending','in_progress') AND m.deadline_at < now() LOOP
    BEGIN
    IF r.player1_id IS NULL OR r.player2_id IS NULL THEN       -- partida fantasma (chaveamento antigo): passagem direta
      PERFORM xadrez_rt.decidir_partida(r.id, coalesce(r.player1_id, r.player2_id), 'walkover', 'bye');
      n := n + 1;
      CONTINUE;
    END IF;
    g := NULL;
    IF r.game_id IS NOT NULL THEN SELECT * INTO g FROM games WHERE id = r.game_id; END IF;
    IF g.id IS NOT NULL AND (SELECT count(*) FROM moves WHERE game_id = g.id) >= 2 THEN CONTINUE; END IF;  -- em andamento: o relógio decide
    IF g.id IS NOT NULL AND (SELECT count(*) FROM moves WHERE game_id = g.id) = 1 THEN
      venc := g.white_user_id;                                           -- Brancas jogaram, Pretas não responderam
    ELSE
      presentes := (r.present_p1_at IS NOT NULL)::int + (r.present_p2_at IS NOT NULL)::int;
      IF presentes = 1 THEN venc := CASE WHEN r.present_p1_at IS NOT NULL THEN r.player1_id ELSE r.player2_id END;
      ELSIF presentes = 2 AND g.id IS NOT NULL THEN venc := g.black_user_id;   -- os dois na sala, Brancas não jogaram
      ELSE venc := CASE WHEN random() < 0.5 THEN r.player1_id ELSE r.player2_id END;
      END IF;
    END IF;
    IF g.id IS NOT NULL AND g.status = 'active' THEN
      UPDATE games SET status = 'abandoned', result = 'abandoned', end_reason = 'wo_prazo', ended_at = now() WHERE id = g.id;
    END IF;
    PERFORM xadrez_rt.decidir_partida(r.id, venc, 'walkover',
      CASE WHEN g.id IS NOT NULL AND (SELECT count(*) FROM moves WHERE game_id = g.id) = 1 THEN 'wo_sem_resposta'
           WHEN (r.present_p1_at IS NOT NULL)::int + (r.present_p2_at IS NOT NULL)::int = 1 THEN 'wo_ausencia'
           WHEN g.id IS NOT NULL THEN 'wo_brancas_nao_jogaram' ELSE 'wo_sorteio' END);
    n := n + 1;
    EXCEPTION WHEN OTHERS THEN PERFORM xadrez_rt.evento('erro_tick', r.tournament_id, r.id, r.game_id, jsonb_build_object('etapa', 'wo', 'erro', SQLERRM));
    END;
  END LOOP;
  feitos := feitos || jsonb_build_object('wo', n);

  -- 3) chaveamento chega à data de início: começa sozinho (o criador pode começar antes)
  n := 0;
  FOR r IN SELECT id FROM tournaments WHERE format = 'pvp_bracket' AND status = 'open' AND paid AND starts_at <= now() LOOP
    BEGIN PERFORM xadrez_rt.iniciar_chave(r.id); n := n + 1; EXCEPTION WHEN OTHERS THEN PERFORM xadrez_rt.evento('erro_tick', r.id, NULL, NULL, jsonb_build_object('etapa', 'inicio', 'erro', SQLERRM)); END;
  END LOOP;
  feitos := feitos || jsonb_build_object('iniciados', n);

  -- 4) ranking de IA vencido: encerra quando não há placar na fila de conferência
  n := 0;
  FOR r IN SELECT t.id FROM tournaments t WHERE t.format = 'ai' AND t.status IN ('open','active') AND t.ends_at < now()
            AND NOT EXISTS (SELECT 1 FROM scores s WHERE s.tournament_id = t.id AND s.status = 'pendente') LOOP
    BEGIN PERFORM xadrez_rt.encerrar_ranking(r.id); n := n + 1; EXCEPTION WHEN OTHERS THEN PERFORM xadrez_rt.evento('erro_tick', r.id, NULL, NULL, jsonb_build_object('etapa', 'ranking', 'erro', SQLERRM)); END;
  END LOOP;
  feitos := feitos || jsonb_build_object('rankings', n);

  -- 5) cobrança Pix vencida
  UPDATE xadrez_rt.pagamentos SET status = 'expirado', atualizado_em = now() WHERE status = 'pendente' AND expira_em < now();
  RETURN feitos;
END $f$;

-- usados pelo servidor (papel xadrez_rt); nunca pela API pública
GRANT EXECUTE ON FUNCTION xadrez_rt.tick(), xadrez_rt.encerrar_jogo(text, text, text), xadrez_rt.evento(text, uuid, uuid, text, jsonb),
  xadrez_rt.tempo_gasto(text) TO xadrez_rt;

-- ---------------------------------------------------------------- RPCs públicas (cada uma confere quem chama)
-- o antigo `_advance_bracket`, o antigo gatilho e a função de W.O. manual ficam sem uso: tirar da API
REVOKE EXECUTE ON FUNCTION public._advance_bracket(uuid) FROM PUBLIC, anon, authenticated, service_role;
REVOKE EXECUTE ON FUNCTION public._games_finished_to_tournament() FROM PUBLIC, anon, authenticated, service_role;
CREATE OR REPLACE FUNCTION public.tournament_apply_walkovers(p_tournament_id uuid) RETURNS integer
LANGUAGE sql SECURITY DEFINER SET search_path = public AS $f$
  SELECT 0;   -- D-TRN-04: a rotina do servidor aplica W.O. sozinha; mantida só para a tela antiga não quebrar
$f$;

CREATE OR REPLACE FUNCTION public.create_tournament(p_name text, p_description text, p_prize text, p_format tournament_format,
  p_visibility tournament_visibility, p_capacity integer, p_starts_at timestamptz, p_ends_at timestamptz, p_difficulty smallint,
  p_criterion tournament_criterion, p_round_deadline_hours integer, p_time_control_seconds integer DEFAULT 600)
RETURNS tournaments LANGUAGE plpgsql SECURITY DEFINER SET search_path = public AS $f$
DECLARE v_user uuid := auth.uid(); v_row tournaments;
BEGIN
  IF v_user IS NULL THEN RAISE EXCEPTION 'login required'; END IF;
  IF p_capacity NOT IN (4, 8, 16, 32) THEN RAISE EXCEPTION 'capacity must be 4, 8, 16 or 32'; END IF;
  IF char_length(coalesce(trim(p_name), '')) NOT BETWEEN 3 AND 80 THEN RAISE EXCEPTION 'name must have 3 to 80 characters'; END IF;
  IF char_length(coalesce(trim(p_prize), '')) NOT BETWEEN 1 AND 200 THEN RAISE EXCEPTION 'prize must have 1 to 200 characters'; END IF;
  IF char_length(coalesce(p_description, '')) > 1000 THEN RAISE EXCEPTION 'description too long'; END IF;
  IF p_starts_at IS NULL OR p_starts_at < now() - interval '5 minutes' THEN RAISE EXCEPTION 'starts_at must be in the future'; END IF;
  IF (SELECT count(*) FROM tournaments WHERE creator_id = v_user AND NOT paid AND status = 'open') >= 5 THEN
    RAISE EXCEPTION 'too many unpaid tournaments';
  END IF;
  IF p_format = 'ai' THEN
    IF p_difficulty NOT BETWEEN 1 AND 4 OR p_criterion IS NULL OR p_ends_at IS NULL THEN
      RAISE EXCEPTION 'ai format requires difficulty (1-4), criterion and ends_at';
    END IF;
    IF p_ends_at <= p_starts_at THEN RAISE EXCEPTION 'ends_at must be after starts_at'; END IF;
    IF p_ends_at > p_starts_at + interval '60 days' THEN RAISE EXCEPTION 'ranking can last at most 60 days'; END IF;
  ELSE
    IF p_round_deadline_hours IS NULL OR p_round_deadline_hours NOT BETWEEN 1 AND 168 THEN
      RAISE EXCEPTION 'pvp_bracket requires round_deadline_hours between 1 and 168';
    END IF;
    -- D-TRN-01: partida de torneio sempre com relógio (sem relógio uma partida podia ficar aberta para sempre)
    IF p_time_control_seconds NOT IN (300, 600, 900, 1800) THEN RAISE EXCEPTION 'time_control_seconds must be 300, 600, 900 or 1800'; END IF;
    IF p_round_deadline_hours * 3600 < p_time_control_seconds * 2 + 1800 THEN
      RAISE EXCEPTION 'round deadline too short for this time control';
    END IF;
  END IF;
  INSERT INTO tournaments (creator_id, creator_name, name, description, prize_description, format, visibility, capacity,
                           starts_at, ends_at, share_token, paid, difficulty, criterion, round_deadline_hours, total_rounds,
                           time_control_seconds)
  VALUES (v_user, coalesce(xadrez_rt.nome(v_user), 'Jogador'), trim(p_name), nullif(trim(p_description), ''), trim(p_prize),
          p_format, p_visibility, p_capacity, p_starts_at, CASE WHEN p_format = 'ai' THEN p_ends_at END,
          substr(translate(gen_random_uuid()::text, '-', ''), 1, 16), false,
          CASE WHEN p_format = 'ai' THEN p_difficulty END, CASE WHEN p_format = 'ai' THEN p_criterion END,
          CASE WHEN p_format = 'pvp_bracket' THEN p_round_deadline_hours END, NULL,
          CASE WHEN p_format = 'pvp_bracket' THEN p_time_control_seconds ELSE 600 END)
  RETURNING * INTO v_row;
  RETURN v_row;
END $f$;

-- D-TRN-09: inscrição — rejeitado não volta; link exige o código; vaga conferida com o torneio travado
DROP FUNCTION IF EXISTS public.join_tournament(uuid);
CREATE OR REPLACE FUNCTION public.join_tournament(p_tournament_id uuid, p_token text DEFAULT NULL)
RETURNS tournament_participants LANGUAGE plpgsql SECURITY DEFINER SET search_path = public AS $f$
DECLARE v_user uuid := auth.uid(); t tournaments; n int; st participant_status; atual tournament_participants; v_row tournament_participants;
BEGIN
  IF v_user IS NULL THEN RAISE EXCEPTION 'login required'; END IF;
  SELECT * INTO t FROM tournaments WHERE id = p_tournament_id FOR UPDATE;
  IF t.id IS NULL OR NOT t.paid THEN RAISE EXCEPTION 'tournament not found'; END IF;
  IF t.visibility = 'link' AND p_token IS DISTINCT FROM t.share_token AND NOT is_admin() THEN RAISE EXCEPTION 'tournament not found'; END IF;
  IF t.status <> 'open' THEN RAISE EXCEPTION 'tournament not open'; END IF;
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

CREATE OR REPLACE FUNCTION public.leave_tournament(p_tournament_id uuid) RETURNS void
LANGUAGE plpgsql SECURITY DEFINER SET search_path = public AS $f$
DECLARE v_user uuid := auth.uid(); t tournaments;
BEGIN
  IF v_user IS NULL THEN RAISE EXCEPTION 'login required'; END IF;
  SELECT * INTO t FROM tournaments WHERE id = p_tournament_id FOR UPDATE;
  IF t.id IS NULL THEN RAISE EXCEPTION 'not found'; END IF;
  IF t.status <> 'open' OR (t.format = 'pvp_bracket' AND t.current_round > 0) THEN RAISE EXCEPTION 'cannot leave after start'; END IF;
  UPDATE tournament_participants SET status = 'left' WHERE tournament_id = t.id AND user_id = v_user AND status IN ('pending','approved');
END $f$;

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
  IF t.status <> 'open' THEN RAISE EXCEPTION 'tournament already started'; END IF;
  IF p.status = 'left' THEN RAISE EXCEPTION 'participant left'; END IF;
  IF p_status = 'approved' AND p.status <> 'approved' THEN
    SELECT count(*) INTO n FROM tournament_participants WHERE tournament_id = t.id AND status = 'approved';
    IF n >= t.capacity THEN RAISE EXCEPTION 'tournament full'; END IF;
  END IF;
  UPDATE tournament_participants SET status = p_status WHERE id = p.id RETURNING * INTO v_row;
  RETURN v_row;
END $f$;

CREATE OR REPLACE FUNCTION public.start_bracket_tournament(p_tournament_id uuid) RETURNS tournaments
LANGUAGE plpgsql SECURITY DEFINER SET search_path = public AS $f$
DECLARE v_user uuid := auth.uid(); t tournaments;
BEGIN
  IF v_user IS NULL THEN RAISE EXCEPTION 'login required'; END IF;
  SELECT * INTO t FROM tournaments WHERE id = p_tournament_id;
  IF t.id IS NULL THEN RAISE EXCEPTION 'tournament not found'; END IF;
  IF t.creator_id <> v_user AND NOT is_admin() THEN RAISE EXCEPTION 'only creator'; END IF;
  IF t.format <> 'pvp_bracket' THEN RAISE EXCEPTION 'not a bracket tournament'; END IF;
  IF NOT t.paid THEN RAISE EXCEPTION 'tournament not paid'; END IF;
  IF t.status <> 'open' THEN RAISE EXCEPTION 'tournament not open'; END IF;
  IF (SELECT count(*) FROM tournament_participants WHERE tournament_id = t.id AND status = 'approved') < 2 THEN
    RAISE EXCEPTION 'need at least 2 approved participants';
  END IF;
  PERFORM xadrez_rt.iniciar_chave(t.id);
  SELECT * INTO t FROM tournaments WHERE id = p_tournament_id;
  RETURN t;
END $f$;

-- abrir a sala: marca presença (conta para o W.O.) e cria o jogo quando os DOIS estiverem presentes
CREATE OR REPLACE FUNCTION public.tournament_match_start_game(p_match_id uuid) RETURNS text
LANGUAGE plpgsql SECURITY DEFINER SET search_path = public AS $f$
DECLARE v_user uuid := auth.uid(); m tournament_matches; t tournaments;
BEGIN
  IF v_user IS NULL THEN RAISE EXCEPTION 'login required'; END IF;
  SELECT * INTO m FROM tournament_matches WHERE id = p_match_id FOR UPDATE;
  IF m.id IS NULL THEN RAISE EXCEPTION 'match not found'; END IF;
  IF v_user NOT IN (m.player1_id, m.player2_id) THEN RAISE EXCEPTION 'somente os jogadores da partida podem abrir a sala'; END IF;
  IF m.status NOT IN ('pending','in_progress') THEN RAISE EXCEPTION 'match not active'; END IF;
  SELECT * INTO t FROM tournaments WHERE id = m.tournament_id;
  IF t.status <> 'active' THEN RAISE EXCEPTION 'tournament not active'; END IF;
  IF v_user = m.player1_id AND m.present_p1_at IS NULL THEN UPDATE tournament_matches SET present_p1_at = now() WHERE id = m.id; m.present_p1_at := now(); END IF;
  IF v_user = m.player2_id AND m.present_p2_at IS NULL THEN UPDATE tournament_matches SET present_p2_at = now() WHERE id = m.id; m.present_p2_at := now(); END IF;
  IF m.game_id IS NOT NULL THEN RETURN m.game_id; END IF;
  IF m.present_p1_at IS NULL OR m.present_p2_at IS NULL THEN RETURN NULL; END IF;   -- esperando o adversário
  IF random() < 0.5 THEN RETURN xadrez_rt.criar_jogo(m.id, m.player1_id, m.player2_id); END IF;
  RETURN xadrez_rt.criar_jogo(m.id, m.player2_id, m.player1_id);
END $f$;

-- desistência: só o próprio jogador (D-TRN-01)
CREATE OR REPLACE FUNCTION public.tournament_resign(p_game_id text) RETURNS void
LANGUAGE plpgsql SECURITY DEFINER SET search_path = public AS $f$
DECLARE v_user uuid := auth.uid(); g games;
BEGIN
  IF v_user IS NULL THEN RAISE EXCEPTION 'login required'; END IF;
  SELECT * INTO g FROM games WHERE id = p_game_id;
  IF g.id IS NULL OR g.tournament_match_id IS NULL THEN RAISE EXCEPTION 'not a tournament game'; END IF;
  IF v_user NOT IN (g.white_user_id, g.black_user_id) THEN RAISE EXCEPTION 'only players can resign'; END IF;
  PERFORM xadrez_rt.encerrar_jogo(g.id, CASE WHEN v_user = g.white_user_id THEN 'black_wins' ELSE 'white_wins' END, 'desistencia');
END $f$;

-- D-TRN-03: forçar resultado — criador/admin, torneio ativo, vencedor é jogador da partida
CREATE OR REPLACE FUNCTION public.record_match_result(p_match_id uuid, p_winner_id uuid, p_pgn text DEFAULT NULL)
RETURNS tournament_matches LANGUAGE plpgsql SECURITY DEFINER SET search_path = public AS $f$
DECLARE v_user uuid := auth.uid(); m tournament_matches; t tournaments;
BEGIN
  IF v_user IS NULL THEN RAISE EXCEPTION 'login required'; END IF;
  SELECT * INTO m FROM tournament_matches WHERE id = p_match_id;
  IF m.id IS NULL THEN RAISE EXCEPTION 'match not found'; END IF;
  SELECT * INTO t FROM tournaments WHERE id = m.tournament_id;
  IF t.creator_id <> v_user AND NOT is_admin() THEN RAISE EXCEPTION 'only creator/admin'; END IF;
  IF t.status <> 'active' THEN RAISE EXCEPTION 'tournament not active'; END IF;
  IF m.status IN ('finished','walkover') THEN RAISE EXCEPTION 'match already decided'; END IF;
  IF p_winner_id IS NULL OR p_winner_id NOT IN (m.player1_id, m.player2_id) THEN RAISE EXCEPTION 'winner must be a player of the match'; END IF;
  IF m.game_id IS NOT NULL THEN
    UPDATE games SET status = 'abandoned', result = 'abandoned', end_reason = 'decidido_pelo_organizador', ended_at = now()
     WHERE id = m.game_id AND status = 'active';
  END IF;
  PERFORM xadrez_rt.decidir_partida(m.id, p_winner_id, 'finished', 'organizador');
  SELECT * INTO m FROM tournament_matches WHERE id = p_match_id;
  RETURN m;
END $f$;

CREATE OR REPLACE FUNCTION public.cancel_tournament(p_tournament_id uuid) RETURNS tournaments
LANGUAGE plpgsql SECURITY DEFINER SET search_path = public AS $f$
DECLARE v_user uuid := auth.uid(); t tournaments;
BEGIN
  IF v_user IS NULL THEN RAISE EXCEPTION 'login required'; END IF;
  SELECT * INTO t FROM tournaments WHERE id = p_tournament_id FOR UPDATE;
  IF t.id IS NULL THEN RAISE EXCEPTION 'not found'; END IF;
  IF NOT is_admin() THEN
    IF t.creator_id <> v_user THEN RAISE EXCEPTION 'only creator/admin'; END IF;
    IF t.status <> 'open' OR (t.format = 'pvp_bracket' AND t.current_round > 0) THEN RAISE EXCEPTION 'only admin can cancel after start'; END IF;
  END IF;
  IF t.status NOT IN ('open','active') THEN RAISE EXCEPTION 'tournament already closed'; END IF;
  UPDATE games SET status = 'abandoned', result = 'abandoned', end_reason = 'torneio_cancelado', ended_at = now()
   WHERE status = 'active' AND tournament_match_id IN (SELECT id FROM tournament_matches WHERE tournament_id = t.id);
  UPDATE tournaments SET status = 'cancelled', cancel_reason = CASE WHEN is_admin() AND t.creator_id <> v_user THEN 'admin' ELSE 'criador' END,
                         finished_at = now() WHERE id = t.id RETURNING * INTO t;
  PERFORM xadrez_rt.evento('cancelado', t.id, NULL, NULL, jsonb_build_object('por', v_user));
  RETURN t;
END $f$;

CREATE OR REPLACE FUNCTION public.finalize_ranking_tournament(p_tournament_id uuid) RETURNS tournaments
LANGUAGE plpgsql SECURITY DEFINER SET search_path = public AS $f$
DECLARE v_user uuid := auth.uid(); t tournaments;
BEGIN
  IF v_user IS NULL THEN RAISE EXCEPTION 'login required'; END IF;
  SELECT * INTO t FROM tournaments WHERE id = p_tournament_id;
  IF t.id IS NULL THEN RAISE EXCEPTION 'not found'; END IF;
  IF t.creator_id <> v_user AND NOT is_admin() THEN RAISE EXCEPTION 'only creator/admin'; END IF;
  IF t.format <> 'ai' THEN RAISE EXCEPTION 'only ai format'; END IF;
  IF t.status NOT IN ('open','active') THEN RAISE EXCEPTION 'tournament already closed'; END IF;
  IF EXISTS (SELECT 1 FROM scores WHERE tournament_id = t.id AND status = 'pendente') THEN
    RAISE EXCEPTION 'there are games still being checked; try again in a minute';
  END IF;
  PERFORM xadrez_rt.encerrar_ranking(t.id);
  SELECT * INTO t FROM tournaments WHERE id = p_tournament_id;
  RETURN t;
END $f$;

-- D-TRN-02/08: classificação só com placar conferido; "mais rápido" ordena pelo melhor tempo (só tempo ao vivo)
CREATE OR REPLACE FUNCTION public.tournament_leaderboard(p_tournament_id uuid)
RETURNS TABLE(user_id uuid, user_name text, wins integer, best_seconds integer)
LANGUAGE plpgsql STABLE SECURITY DEFINER SET search_path = public AS $f$
DECLARE t tournaments;
BEGIN
  SELECT * INTO t FROM tournaments WHERE id = p_tournament_id;
  IF t.id IS NULL THEN RAISE EXCEPTION 'tournament not found'; END IF;
  IF t.format <> 'ai' THEN RAISE EXCEPTION 'leaderboard only for ai format'; END IF;
  RETURN QUERY
  SELECT p.user_id, p.user_name,
         count(s.id)::int AS wins,
         min(s.player_seconds) FILTER (WHERE s.timed_live)::int AS best_seconds
    FROM tournament_participants p
    LEFT JOIN scores s ON s.user_id = p.user_id AND s.tournament_id = p_tournament_id AND s.status = 'normal'
   WHERE p.tournament_id = p_tournament_id AND p.status = 'approved'
   GROUP BY p.user_id, p.user_name
   ORDER BY
     CASE WHEN t.criterion = 'fastest_win' THEN min(s.player_seconds) FILTER (WHERE s.timed_live) END ASC NULLS LAST,
     count(s.id) DESC,
     min(s.player_seconds) FILTER (WHERE s.timed_live) ASC NULLS LAST,
     p.user_name;
END $f$;

-- visibilidade: participantes e partidas só de torneio que o chamador pode ver
CREATE OR REPLACE FUNCTION xadrez_rt.pode_ver(p_t uuid) RETURNS boolean LANGUAGE sql STABLE SECURITY DEFINER
SET search_path = public AS $f$
  SELECT EXISTS (SELECT 1 FROM tournaments t WHERE t.id = p_t AND (
    (t.paid AND t.visibility IN ('public','approval','link'))   -- link: quem tem o id veio pelo link (uuid não se adivinha)
    OR t.creator_id = auth.uid() OR is_admin()
    OR EXISTS (SELECT 1 FROM tournament_participants p WHERE p.tournament_id = t.id AND p.user_id = auth.uid())));
$f$;
CREATE OR REPLACE FUNCTION public.get_tournament_participants(p_tournament_id uuid)
RETURNS TABLE(id uuid, user_id uuid, user_name text, status participant_status, joined_at timestamptz)
LANGUAGE sql STABLE SECURITY DEFINER SET search_path = public AS $f$
  SELECT p.id, p.user_id, p.user_name, p.status, p.joined_at FROM tournament_participants p
   WHERE p.tournament_id = p_tournament_id AND xadrez_rt.pode_ver(p_tournament_id)
     AND (p.status = 'approved' OR p.user_id = auth.uid()
          OR EXISTS (SELECT 1 FROM tournaments t WHERE t.id = p_tournament_id AND (t.creator_id = auth.uid() OR is_admin())))
   ORDER BY p.joined_at;
$f$;
DROP FUNCTION IF EXISTS public.get_tournament_matches(uuid);
CREATE OR REPLACE FUNCTION public.get_tournament_matches(p_tournament_id uuid)
RETURNS TABLE(id uuid, round integer, slot integer, player1_id uuid, player1_name text, player2_id uuid, player2_name text,
              winner_id uuid, status match_status, deadline_at timestamptz, game_pgn text, finished_at timestamptz,
              game_id text, reason text, tiebreaks integer, present_p1_at timestamptz, present_p2_at timestamptz)
LANGUAGE sql STABLE SECURITY DEFINER SET search_path = public AS $f$
  SELECT m.id, m.round, m.slot, m.player1_id, p1.user_name, m.player2_id, p2.user_name, m.winner_id, m.status,
         m.deadline_at, m.game_pgn, m.finished_at, m.game_id, m.reason, m.tiebreaks, m.present_p1_at, m.present_p2_at
    FROM tournament_matches m
    LEFT JOIN tournament_participants p1 ON p1.tournament_id = m.tournament_id AND p1.user_id = m.player1_id
    LEFT JOIN tournament_participants p2 ON p2.tournament_id = m.tournament_id AND p2.user_id = m.player2_id
   WHERE m.tournament_id = p_tournament_id AND xadrez_rt.pode_ver(p_tournament_id)
   ORDER BY m.round, m.slot;
$f$;

CREATE OR REPLACE FUNCTION public.get_tournament_by_token(p_token text) RETURNS tournaments
LANGUAGE sql STABLE SECURITY DEFINER SET search_path = public AS $f$
  SELECT * FROM tournaments WHERE share_token = p_token AND paid AND length(coalesce(p_token, '')) >= 12 LIMIT 1;
$f$;

-- confirmação manual do admin continua (fallback do Pix automático); torneio cancelado não volta a ser pago
CREATE OR REPLACE FUNCTION public.confirm_tournament_payment(p_tournament_id uuid) RETURNS tournaments
LANGUAGE plpgsql SECURITY DEFINER SET search_path = public AS $f$
DECLARE v_row tournaments;
BEGIN
  IF NOT is_admin() THEN RAISE EXCEPTION 'admin only'; END IF;
  UPDATE tournaments SET paid = true, paid_at = coalesce(paid_at, now()) WHERE id = p_tournament_id AND status = 'open'
  RETURNING * INTO v_row;
  IF v_row.id IS NULL THEN RAISE EXCEPTION 'tournament not found or not open'; END IF;
  PERFORM xadrez_rt.evento('pago_manual', v_row.id, NULL, NULL, NULL);
  RETURN v_row;
END $f$;

-- D-TRN-10: desfazer lance numa partida contra a IA marca os lances desfeitos (a partida sai do ranking/torneio)
CREATE OR REPLACE FUNCTION public.ai_game_undo(p_session_id text, p_count integer) RETURNS void
LANGUAGE plpgsql SECURITY DEFINER SET search_path = public AS $f$
BEGIN
  IF auth.uid() IS NULL THEN RETURN; END IF;
  UPDATE ai_game_moves SET undone = true
   WHERE id IN (SELECT id FROM ai_game_moves WHERE session_id = p_session_id AND user_id = auth.uid() AND NOT undone
                ORDER BY move_number DESC LIMIT greatest(0, least(p_count, 4)));
END $f$;

-- D-TRN-02/10/11/12: vitória contra a IA nasce PENDENTE; o servidor reproduz a partida e decide (normal/rejeitado).
-- O tempo do navegador (p_client_player_seconds / p_client_validated) deixa de valer; heurística de "não desfez lance"
-- sai (desfazer agora tira a partida do ranking). Assinatura mantida (o site chama com estes parâmetros).
DROP FUNCTION IF EXISTS public.register_ai_score(text, smallint, text, integer, integer, integer, integer, integer);
CREATE OR REPLACE FUNCTION public.register_ai_score(p_session_id text, p_difficulty smallint, p_username text,
  p_client_mouse_movements integer DEFAULT 0, p_client_drag_count integer DEFAULT 0, p_client_click_count integer DEFAULT 0,
  p_client_idle_periods integer DEFAULT 0, p_client_keyboard_events integer DEFAULT 0, p_client_undo_count integer DEFAULT 0,
  p_client_validated boolean DEFAULT false, p_client_player_seconds integer DEFAULT NULL, p_tournament_id uuid DEFAULT NULL)
RETURNS jsonb LANGUAGE plpgsql SECURITY DEFINER SET search_path = public AS $f$
DECLARE
  v_user uuid := auth.uid(); v_existente uuid; t tournaments; n int; desfeitos int; v_ini timestamptz; v_fim timestamptz;
  v_susp int := 0; v_status text := 'pendente'; v_id uuid;
BEGIN
  IF v_user IS NULL THEN RAISE EXCEPTION 'authentication required'; END IF;
  SELECT id INTO v_existente FROM scores WHERE session_id = p_session_id LIMIT 1;
  IF v_existente IS NOT NULL THEN RETURN jsonb_build_object('success', true, 'score_id', v_existente, 'idempotent', true); END IF;
  IF p_difficulty < 1 OR p_difficulty > 4 THEN RAISE EXCEPTION 'invalid difficulty: %', p_difficulty; END IF;
  IF char_length(coalesce(p_username, '')) > 60 THEN RAISE EXCEPTION 'username too long'; END IF;
  IF p_tournament_id IS NOT NULL THEN
    SELECT * INTO t FROM tournaments WHERE id = p_tournament_id;
    IF t.id IS NULL THEN RAISE EXCEPTION 'tournament not found'; END IF;
    IF t.format <> 'ai' THEN RAISE EXCEPTION 'tournament is not AI format'; END IF;
    IF t.status NOT IN ('open','active') THEN RAISE EXCEPTION 'tournament not accepting scores'; END IF;
    IF t.difficulty IS NOT NULL AND t.difficulty <> p_difficulty THEN RAISE EXCEPTION 'difficulty does not match tournament'; END IF;
    IF now() < t.starts_at THEN RAISE EXCEPTION 'tournament has not started yet'; END IF;
    IF t.ends_at IS NOT NULL AND now() > t.ends_at + interval '10 minutes' THEN RAISE EXCEPTION 'tournament has ended'; END IF;
    IF NOT EXISTS (SELECT 1 FROM tournament_participants WHERE tournament_id = t.id AND user_id = v_user AND status = 'approved') THEN
      RAISE EXCEPTION 'you are not an approved participant of this tournament';
    END IF;
  END IF;
  SELECT count(*), count(*) FILTER (WHERE undone), min(created_at), max(created_at) INTO n, desfeitos, v_ini, v_fim
    FROM ai_game_moves WHERE session_id = p_session_id AND user_id = v_user;
  IF n = 0 THEN RAISE EXCEPTION 'no moves found for session %', p_session_id; END IF;
  IF desfeitos > 0 THEN RAISE EXCEPTION 'game with undone moves does not count (D-TRN-10)'; END IF;
  -- sinais de comportamento (só agravam; a reprodução da partida é que decide)
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
                      mouse_movements, drag_count, click_count, idle_periods, keyboard_events, undo_count, total_game_ms, tournament_id)
  VALUES (v_user, left(coalesce(nullif(trim(p_username), ''), xadrez_rt.nome(v_user)), 60), p_difficulty,
          greatest(1, extract(epoch FROM v_fim - v_ini)::int), p_session_id, v_status, v_susp, false,
          p_client_mouse_movements, p_client_drag_count, p_client_click_count, p_client_idle_periods, p_client_keyboard_events,
          p_client_undo_count, (extract(epoch FROM v_fim - v_ini) * 1000)::int, p_tournament_id)
  RETURNING id INTO v_id;
  IF v_status = 'pendente' THEN PERFORM pg_notify('xadrez_conferir', v_id::text); END IF;
  RETURN jsonb_build_object('success', true, 'score_id', v_id, 'idempotent', false, 'status', v_status, 'suspicion_score', v_susp);
END $f$;

-- fila de conferência (servidor): lances da sessão e veredito
CREATE OR REPLACE FUNCTION xadrez_rt.placar_para_conferir(p_score uuid) RETURNS jsonb
LANGUAGE sql STABLE SECURITY DEFINER SET search_path = public AS $f$
  SELECT jsonb_build_object('score', to_jsonb(s), 'lances', coalesce((
    SELECT jsonb_agg(jsonb_build_object('move_number', m.move_number, 'from_sq', m.from_sq, 'to_sq', m.to_sq, 'promotion', m.promotion,
                                        'is_ai_move', m.is_ai_move, 'created_at', m.created_at, 'undone', m.undone) ORDER BY m.move_number)
      FROM ai_game_moves m WHERE m.session_id = s.session_id AND m.user_id = s.user_id), '[]'::jsonb))
    FROM scores s WHERE s.id = p_score AND s.status = 'pendente';
$f$;
CREATE OR REPLACE FUNCTION xadrez_rt.placares_pendentes() RETURNS SETOF uuid
LANGUAGE sql STABLE SECURITY DEFINER SET search_path = public AS $f$
  SELECT id FROM scores WHERE status = 'pendente' ORDER BY created_at LIMIT 50;
$f$;
CREATE OR REPLACE FUNCTION xadrez_rt.veredito_placar(p_score uuid, p_ok boolean, p_motivo text, p_segundos integer, p_ao_vivo boolean)
RETURNS void LANGUAGE plpgsql SECURITY DEFINER SET search_path = public AS $f$
BEGIN
  UPDATE scores SET status = CASE WHEN p_ok THEN 'normal' ELSE 'rejeitado' END, reject_reason = CASE WHEN p_ok THEN NULL ELSE p_motivo END,
                    player_seconds = CASE WHEN p_ok AND p_segundos IS NOT NULL THEN p_segundos ELSE player_seconds END,
                    timed_live = CASE WHEN p_ok THEN p_ao_vivo ELSE timed_live END, server_checked_at = now()
   WHERE id = p_score AND status = 'pendente';
END $f$;

-- jogo de torneio para o servidor reproduzir (D-TRN-01)
CREATE OR REPLACE FUNCTION xadrez_rt.jogo_torneio(p_game text) RETURNS jsonb
LANGUAGE sql STABLE SECURITY DEFINER SET search_path = public AS $f$
  SELECT jsonb_build_object('game', to_jsonb(g), 'lances', coalesce((
    SELECT jsonb_agg(jsonb_build_object('move_number', m.move_number, 'player_color', m.player_color, 'from_sq', m.from_sq,
                                        'to_sq', m.to_sq, 'promotion', m.promotion, 'created_at', m.created_at) ORDER BY m.move_number)
      FROM moves m WHERE m.game_id = g.id), '[]'::jsonb))
    FROM games g WHERE g.id = p_game AND g.tournament_match_id IS NOT NULL;
$f$;
CREATE OR REPLACE FUNCTION xadrez_rt.jogos_torneio_ativos() RETURNS SETOF text
LANGUAGE sql STABLE SECURITY DEFINER SET search_path = public AS $f$
  SELECT id FROM games WHERE status = 'active' AND tournament_match_id IS NOT NULL;
$f$;
GRANT EXECUTE ON FUNCTION xadrez_rt.placar_para_conferir(uuid), xadrez_rt.placares_pendentes(),
  xadrez_rt.veredito_placar(uuid, boolean, text, integer, boolean), xadrez_rt.jogo_torneio(text), xadrez_rt.jogos_torneio_ativos() TO xadrez_rt;

RESET ROLE;
COMMIT;
