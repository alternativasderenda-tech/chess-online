-- Gauntlet dos torneios, rodada 1 — segurança (servidor/DECISOES.md D-TRN-18..20). 24/10/2026.
BEGIN;
SET ROLE xadrez_owner;

-- TRN-SEG-01 (alto): o navegador escolhia o horário (created_at) de cada lance contra a IA e forjava "1 segundo".
-- Agora o horário é do servidor, a ordem é conferida na gravação e o lance não nasce desfeito.
CREATE OR REPLACE FUNCTION xadrez_rt.conferir_lance_ia() RETURNS trigger LANGUAGE plpgsql SECURITY DEFINER
SET search_path = public AS $f$
DECLARE ultimo int;
BEGIN
  NEW.created_at := now();
  NEW.undone := false;
  IF current_user IN ('anon', 'authenticated') THEN
    IF NEW.user_id IS DISTINCT FROM auth.uid() THEN RAISE EXCEPTION 'lance de outro usuário'; END IF;
  END IF;
  SELECT coalesce(max(move_number), 0) INTO ultimo FROM ai_game_moves WHERE session_id = NEW.session_id AND user_id = NEW.user_id;
  IF NEW.move_number <> ultimo + 1 THEN RAISE EXCEPTION 'lance fora de ordem (esperado %)', ultimo + 1; END IF;
  IF NEW.move_number > 600 THEN RAISE EXCEPTION 'partida longa demais'; END IF;
  IF EXISTS (SELECT 1 FROM scores WHERE session_id = NEW.session_id) THEN RAISE EXCEPTION 'partida já registrada'; END IF;
  RETURN NEW;
END $f$;
DROP TRIGGER IF EXISTS conferir_lance_ia ON public.ai_game_moves;
CREATE TRIGGER conferir_lance_ia BEFORE INSERT ON public.ai_game_moves FOR EACH ROW EXECUTE FUNCTION xadrez_rt.conferir_lance_ia();

-- TRN-SEG-04 (médio): cota de placares por jogador (a conferência Expert custa 1–2 min de CPU)
CREATE OR REPLACE FUNCTION xadrez_rt.cota_placares() RETURNS trigger LANGUAGE plpgsql SECURITY DEFINER
SET search_path = public AS $f$
BEGIN
  IF (SELECT count(*) FROM scores WHERE user_id = NEW.user_id AND status = 'pendente') >= 3 THEN
    RAISE EXCEPTION 'aguarde a conferência das suas vitórias anteriores';
  END IF;
  IF (SELECT count(*) FROM scores WHERE user_id = NEW.user_id AND created_at > now() - interval '1 hour') >= 30 THEN
    RAISE EXCEPTION 'limite de 30 vitórias registradas por hora';
  END IF;
  RETURN NEW;
END $f$;
DROP TRIGGER IF EXISTS cota_placares ON public.scores;
CREATE TRIGGER cota_placares BEFORE INSERT ON public.scores FOR EACH ROW EXECUTE FUNCTION xadrez_rt.cota_placares();

-- TRN-SEG-02 (médio): torneio por link — participantes, partidas e classificação só com o código (ou para quem já
-- participa/criou/admin). Chamada interna (rotina, sem token de usuário) continua liberada.
DROP FUNCTION IF EXISTS xadrez_rt.pode_ver(uuid);
CREATE OR REPLACE FUNCTION xadrez_rt.pode_ver(p_t uuid, p_token text DEFAULT NULL) RETURNS boolean
LANGUAGE sql STABLE SECURITY DEFINER SET search_path = public AS $f$
  -- chamada interna: conexão aberta pela rotina do servidor (papel xadrez_rt) ou pelo postgres — nunca pela API
  -- (o PostgREST conecta como `authenticator`, com ou sem token de usuário)
  SELECT session_user IN ('xadrez_rt', 'postgres')
      OR EXISTS (SELECT 1 FROM tournaments t WHERE t.id = p_t AND (
           (t.paid AND t.visibility IN ('public','approval'))
        OR (t.paid AND t.visibility = 'link' AND p_token IS NOT NULL AND p_token = t.share_token)
        OR t.creator_id = auth.uid() OR is_admin()
        OR EXISTS (SELECT 1 FROM tournament_participants p WHERE p.tournament_id = t.id AND p.user_id = auth.uid())));
$f$;

DROP FUNCTION IF EXISTS public.get_tournament_participants(uuid);
CREATE OR REPLACE FUNCTION public.get_tournament_participants(p_tournament_id uuid, p_token text DEFAULT NULL)
RETURNS TABLE(id uuid, user_id uuid, user_name text, status participant_status, joined_at timestamptz)
LANGUAGE sql STABLE SECURITY DEFINER SET search_path = public AS $f$
  SELECT p.id, p.user_id, p.user_name, p.status, p.joined_at FROM tournament_participants p
   WHERE p.tournament_id = p_tournament_id AND xadrez_rt.pode_ver(p_tournament_id, p_token)
     AND (p.status = 'approved' OR p.user_id = auth.uid()
          OR EXISTS (SELECT 1 FROM tournaments t WHERE t.id = p_tournament_id AND (t.creator_id = auth.uid() OR is_admin())))
   ORDER BY p.joined_at;
$f$;

DROP FUNCTION IF EXISTS public.get_tournament_matches(uuid);
CREATE OR REPLACE FUNCTION public.get_tournament_matches(p_tournament_id uuid, p_token text DEFAULT NULL)
RETURNS TABLE(id uuid, round integer, slot integer, player1_id uuid, player1_name text, player2_id uuid, player2_name text,
              winner_id uuid, status match_status, deadline_at timestamptz, game_pgn text, finished_at timestamptz,
              game_id text, reason text, tiebreaks integer, present_p1_at timestamptz, present_p2_at timestamptz)
LANGUAGE sql STABLE SECURITY DEFINER SET search_path = public AS $f$
  SELECT m.id, m.round, m.slot, m.player1_id, p1.user_name, m.player2_id, p2.user_name, m.winner_id, m.status,
         m.deadline_at, m.game_pgn, m.finished_at, m.game_id, m.reason, m.tiebreaks, m.present_p1_at, m.present_p2_at
    FROM tournament_matches m
    LEFT JOIN tournament_participants p1 ON p1.tournament_id = m.tournament_id AND p1.user_id = m.player1_id
    LEFT JOIN tournament_participants p2 ON p2.tournament_id = m.tournament_id AND p2.user_id = m.player2_id
   WHERE m.tournament_id = p_tournament_id AND xadrez_rt.pode_ver(p_tournament_id, p_token)
   ORDER BY m.round, m.slot;
$f$;

DROP FUNCTION IF EXISTS public.tournament_leaderboard(uuid);
CREATE OR REPLACE FUNCTION public.tournament_leaderboard(p_tournament_id uuid, p_token text DEFAULT NULL)
RETURNS TABLE(user_id uuid, user_name text, wins integer, best_seconds integer)
LANGUAGE plpgsql STABLE SECURITY DEFINER SET search_path = public AS $f$
DECLARE t tournaments;
BEGIN
  SELECT * INTO t FROM tournaments WHERE id = p_tournament_id;
  IF t.id IS NULL OR NOT xadrez_rt.pode_ver(p_tournament_id, p_token) THEN RAISE EXCEPTION 'tournament not found'; END IF;
  IF t.format <> 'ai' THEN RAISE EXCEPTION 'leaderboard only for ai format'; END IF;
  RETURN QUERY
  SELECT p.user_id, p.user_name, count(s.id)::int, min(s.player_seconds) FILTER (WHERE s.timed_live)::int
    FROM tournament_participants p
    LEFT JOIN scores s ON s.user_id = p.user_id AND s.tournament_id = p_tournament_id AND s.status = 'normal'
   WHERE p.tournament_id = p_tournament_id AND p.status = 'approved'
   GROUP BY p.user_id, p.user_name
   ORDER BY CASE WHEN t.criterion = 'fastest_win' THEN min(s.player_seconds) FILTER (WHERE s.timed_live) END ASC NULLS LAST,
            count(s.id) DESC, min(s.player_seconds) FILTER (WHERE s.timed_live) ASC NULLS LAST, p.user_name;
END $f$;

-- encerrar_ranking chamava a classificação de 1 argumento
CREATE OR REPLACE FUNCTION xadrez_rt.encerrar_ranking(p_t uuid) RETURNS void LANGUAGE plpgsql SECURITY DEFINER
SET search_path = public AS $f$
DECLARE t tournaments; venc uuid;
BEGIN
  SELECT * INTO t FROM tournaments WHERE id = p_t FOR UPDATE;
  IF t.format <> 'ai' OR t.status NOT IN ('open','active') THEN RETURN; END IF;
  SELECT user_id INTO venc FROM public.tournament_leaderboard(p_t, NULL) WHERE wins > 0 LIMIT 1;
  UPDATE tournaments SET status = 'finished', winner_id = venc, finished_at = now() WHERE id = t.id;
  PERFORM xadrez_rt.evento('campeao', t.id, NULL, NULL, jsonb_build_object('vencedor', venc, 'criterio', t.criterion));
END $f$;

-- tempo real (TRN-SEG-03): o servidor confere se quem manda "revanche"/"reação" joga a partida
CREATE OR REPLACE FUNCTION xadrez_rt.jogadores_do_jogo(p_game text) RETURNS TABLE(white uuid, black uuid, white_name text, black_name text)
LANGUAGE sql STABLE SECURITY DEFINER SET search_path = public AS $f$
  SELECT white_user_id, black_user_id, white_username, black_username FROM games WHERE id = p_game;
$f$;
GRANT EXECUTE ON FUNCTION xadrez_rt.jogadores_do_jogo(text) TO xadrez_rt;

RESET ROLE;
COMMIT;
