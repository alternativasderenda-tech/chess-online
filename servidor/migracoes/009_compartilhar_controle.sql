-- Controle de compartilhamento pelo organizador (pedido do dono, 24/10/2026 — D-TRN-28).
-- "Inscritos podem compartilhar" (padrão: sim). Desligado: o código do convite (share_token) só vai ao criador e ao
-- admin — inscritos não recebem o código nem o botão. Em torneio público só esconde o botão (a página é pública).
-- "Gerar novo link de convite" troca o código: o link antigo (que quem entrou pelo convite já conhece) para de valer.
BEGIN;
SET ROLE xadrez_owner;

ALTER TABLE public.tournaments ADD COLUMN IF NOT EXISTS participants_can_share boolean NOT NULL DEFAULT true;

CREATE OR REPLACE FUNCTION public.set_tournament_sharing(p_tournament_id uuid, p_participants_can_share boolean)
RETURNS boolean LANGUAGE plpgsql SECURITY DEFINER SET search_path = public AS $f$
DECLARE t tournaments;
BEGIN
  IF auth.uid() IS NULL THEN RAISE EXCEPTION 'login required'; END IF;
  SELECT * INTO t FROM tournaments WHERE id = p_tournament_id FOR UPDATE;
  IF t.id IS NULL OR (t.creator_id <> auth.uid() AND NOT is_admin()) THEN RAISE EXCEPTION 'only creator/admin'; END IF;
  UPDATE tournaments SET participants_can_share = coalesce(p_participants_can_share, true) WHERE id = t.id;
  RETURN coalesce(p_participants_can_share, true);
END $f$;

CREATE OR REPLACE FUNCTION public.rotate_tournament_link(p_tournament_id uuid) RETURNS text
LANGUAGE plpgsql SECURITY DEFINER SET search_path = public AS $f$
DECLARE t tournaments; novo text;
BEGIN
  IF auth.uid() IS NULL THEN RAISE EXCEPTION 'login required'; END IF;
  SELECT * INTO t FROM tournaments WHERE id = p_tournament_id FOR UPDATE;
  IF t.id IS NULL OR (t.creator_id <> auth.uid() AND NOT is_admin()) THEN RAISE EXCEPTION 'only creator/admin'; END IF;
  IF t.status IN ('finished','cancelled') THEN RAISE EXCEPTION 'tournament already closed'; END IF;
  novo := substr(translate(gen_random_uuid()::text, '-', ''), 1, 16);
  UPDATE tournaments SET share_token = novo WHERE id = t.id;
  PERFORM xadrez_rt.evento('link_trocado', t.id, NULL, NULL, NULL);
  RETURN novo;
END $f$;

-- get_tournament: o código vai ao inscrito só se o organizador permitir; devolve também o ajuste
DROP FUNCTION IF EXISTS public.get_tournament(uuid, text);
CREATE OR REPLACE FUNCTION public.get_tournament(p_tournament_id uuid, p_token text DEFAULT NULL)
RETURNS TABLE(id uuid, name text, description text, prize_description text, creator_id uuid, creator_name text,
              format tournament_format, visibility tournament_visibility, status tournament_status, capacity integer,
              starts_at timestamptz, ends_at timestamptz, paid boolean, difficulty smallint, criterion tournament_criterion,
              round_deadline_hours integer, total_rounds integer, current_round integer, time_control_seconds integer,
              winner_id uuid, winner_name text, finished_at timestamptz, cancel_reason text, participant_count integer,
              share_token text, created_at timestamptz, participants_can_share boolean, can_share boolean)
LANGUAGE sql STABLE SECURITY DEFINER SET search_path = public AS $f$
  WITH x AS (
    SELECT t.*, (t.creator_id = auth.uid() OR is_admin()) AS dono,
           EXISTS (SELECT 1 FROM tournament_participants p WHERE p.tournament_id = t.id AND p.user_id = auth.uid() AND p.status = 'approved') AS inscrito
      FROM tournaments t WHERE t.id = p_tournament_id AND xadrez_rt.pode_ver(p_tournament_id, p_token))
  SELECT x.id, x.name, x.description, x.prize_description, x.creator_id, x.creator_name, x.format, x.visibility, x.status, x.capacity,
         x.starts_at, x.ends_at, x.paid, x.difficulty, x.criterion, x.round_deadline_hours, x.total_rounds, x.current_round,
         x.time_control_seconds, x.winner_id,
         (SELECT p.user_name FROM tournament_participants p WHERE p.tournament_id = x.id AND p.user_id = x.winner_id),
         x.finished_at, x.cancel_reason,
         (SELECT count(*)::int FROM tournament_participants p WHERE p.tournament_id = x.id AND p.status = 'approved'),
         CASE WHEN x.dono OR (x.inscrito AND x.participants_can_share)
                OR (x.participants_can_share AND p_token IS NOT NULL AND p_token = x.share_token) THEN x.share_token END,
         x.created_at, x.participants_can_share,
         -- pode mostrar o botão Compartilhar: organizador/admin sempre; inscrito se permitido; visitante de torneio público
         (x.dono OR (x.inscrito AND x.participants_can_share)
          OR (x.visibility IN ('public','approval') AND x.participants_can_share AND NOT x.inscrito))
    FROM x;
$f$;

RESET ROLE;
COMMIT;
