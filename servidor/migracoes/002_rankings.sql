-- Rankings globais (gauntlet dos torneios, 24/10/2026) — servidor/DECISOES.md D-TRN-14.
-- ranking_wins e ranking_my_position contavam TODO placar (inclusive 'cheater'; com a fila nova contariam 'pendente' e
-- 'rejeitado'): só placar 'normal' conta. "Mais rápido" só com tempo medido ao vivo (timed_live; placares antigos,
-- de antes da conferência, ficam como estavam — timed_live nulo).
BEGIN;
SET ROLE xadrez_owner;

CREATE OR REPLACE FUNCTION public.ranking_wins(p_difficulty smallint, p_limit integer DEFAULT 50)
RETURNS TABLE(rank_pos bigint, username text, wins bigint, user_id uuid)
LANGUAGE sql STABLE SECURITY DEFINER SET search_path = public AS $f$
  WITH w AS (
    SELECT s.user_id, max(s.username) AS username, count(*) AS wins
      FROM scores s
     WHERE s.difficulty = p_difficulty AND s.status = 'normal'
     GROUP BY s.user_id)
  SELECT rank() OVER (ORDER BY wins DESC), username, wins, user_id FROM w ORDER BY wins DESC, username LIMIT least(p_limit, 200);
$f$;

CREATE OR REPLACE FUNCTION public.ranking_fastest(p_difficulty smallint, p_limit integer DEFAULT 50)
RETURNS TABLE(rank_pos bigint, username text, best_seconds integer, user_id uuid, session_id text, source_tournament_id uuid, source_tournament_name text)
LANGUAGE sql STABLE SECURITY DEFINER SET search_path = public AS $f$
  WITH b AS (
    SELECT DISTINCT ON (s.user_id) s.user_id, s.username, s.player_seconds, s.session_id, s.tournament_id
      FROM scores s
     WHERE s.difficulty = p_difficulty AND s.status = 'normal' AND coalesce(s.timed_live, true)
     ORDER BY s.user_id, s.player_seconds ASC, s.created_at ASC)
  SELECT rank() OVER (ORDER BY b.player_seconds ASC), b.username, b.player_seconds, b.user_id, b.session_id, b.tournament_id, t.name
    FROM b LEFT JOIN tournaments t ON t.id = b.tournament_id
   ORDER BY b.player_seconds ASC LIMIT least(p_limit, 200);
$f$;

CREATE OR REPLACE FUNCTION public.ranking_my_position(p_difficulty smallint, p_user_id uuid)
RETURNS TABLE(fastest_position bigint, fastest_best_seconds integer, wins_position bigint, wins_total bigint)
LANGUAGE sql STABLE SECURITY DEFINER SET search_path = public AS $f$
  WITH a AS (
    SELECT s.user_id, min(s.player_seconds) FILTER (WHERE coalesce(s.timed_live, true)) AS best_seconds, count(*) AS wins
      FROM scores s WHERE s.difficulty = p_difficulty AND s.status = 'normal' GROUP BY s.user_id),
  r AS (
    SELECT a.*, rank() OVER (ORDER BY a.best_seconds ASC NULLS LAST) AS fp, rank() OVER (ORDER BY a.wins DESC) AS wp FROM a)
  SELECT r.fp, r.best_seconds, r.wp, r.wins FROM r WHERE r.user_id = p_user_id;
$f$;

RESET ROLE;
COMMIT;
