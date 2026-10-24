-- TRN-REG-12 (alto, gauntlet r3): o organizador encerrava o ranking de IA quando quisesse e escolhia o campeão (o líder
-- do momento). O ranking fecha sozinho no fim (D-TRN-32); encerrar antes é só do admin, depois do início, com evento.
-- Antes do início não há o que encerrar: é cancelar (cancel_tournament). 24/10/2026.
BEGIN;
SET ROLE xadrez_owner;

CREATE OR REPLACE FUNCTION public.finalize_ranking_tournament(p_tournament_id uuid) RETURNS tournaments
LANGUAGE plpgsql SECURITY DEFINER SET search_path = public AS $f$
DECLARE v_user uuid := auth.uid(); t tournaments;
BEGIN
  IF v_user IS NULL THEN RAISE EXCEPTION 'login required'; END IF;
  SELECT * INTO t FROM tournaments WHERE id = p_tournament_id;
  IF t.id IS NULL THEN RAISE EXCEPTION 'not found'; END IF;
  IF NOT is_admin() THEN RAISE EXCEPTION 'only admin can end a ranking early'; END IF;
  IF t.format <> 'ai' THEN RAISE EXCEPTION 'only ai format'; END IF;
  IF t.status NOT IN ('open','active') THEN RAISE EXCEPTION 'tournament already closed'; END IF;
  IF now() < t.starts_at THEN RAISE EXCEPTION 'ranking has not started; cancel it instead'; END IF;
  IF EXISTS (SELECT 1 FROM scores WHERE tournament_id = t.id AND status = 'pendente') THEN
    RAISE EXCEPTION 'there are games still being checked; try again in a minute';
  END IF;
  PERFORM xadrez_rt.evento('ranking_encerrado_pelo_admin', t.id, NULL, NULL,
    jsonb_build_object('admin', v_user, 'fim_previsto', t.ends_at));
  PERFORM xadrez_rt.encerrar_ranking(t.id);
  SELECT * INTO t FROM tournaments WHERE id = p_tournament_id;
  RETURN t;
END $f$;

RESET ROLE;
COMMIT;
