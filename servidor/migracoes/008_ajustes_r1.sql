-- Ajustes depois das correções da rodada 1 (achados pelos agentes de tela). 24/10/2026.
BEGIN;
SET ROLE xadrez_owner;

-- ranking de IA com aprovação: quem pede para entrar depois do início ficava pendente para sempre ("já começou")
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
  IF p.status = 'left' THEN RAISE EXCEPTION 'participant left'; END IF;
  IF p_status = 'approved' AND p.status <> 'approved' THEN
    SELECT count(*) INTO n FROM tournament_participants WHERE tournament_id = t.id AND status = 'approved';
    IF n >= t.capacity THEN RAISE EXCEPTION 'tournament full'; END IF;
  END IF;
  UPDATE tournament_participants SET status = p_status WHERE id = p.id RETURNING * INTO v_row;
  RETURN v_row;
END $f$;

-- W.O.: se o vencedor calculado não for um dos dois jogadores (jogo ligado à partida errada — visto só em dado de teste
-- montado à mão), vale o sorteio entre os dois em vez de travar a partida (erro repetido a cada minuto)
CREATE OR REPLACE FUNCTION xadrez_rt.decidir_partida(p_match uuid, p_vencedor uuid, p_status match_status, p_motivo text)
RETURNS void LANGUAGE plpgsql SECURITY DEFINER SET search_path = public AS $f$
DECLARE m tournament_matches; v uuid := p_vencedor; mot text := p_motivo;
BEGIN
  SELECT * INTO m FROM tournament_matches WHERE id = p_match FOR UPDATE;
  IF m.status IN ('finished','walkover') THEN RETURN; END IF;
  IF v IS NULL OR v NOT IN (m.player1_id, m.player2_id) THEN
    IF p_status <> 'walkover' THEN RAISE EXCEPTION 'vencedor não é jogador da partida'; END IF;
    v := CASE WHEN m.player2_id IS NULL OR random() < 0.5 THEN coalesce(m.player1_id, m.player2_id) ELSE m.player2_id END;
    mot := 'wo_sorteio';
    PERFORM xadrez_rt.evento('wo_vencedor_invalido', m.tournament_id, m.id, m.game_id, jsonb_build_object('calculado', p_vencedor, 'motivo', p_motivo));
  END IF;
  UPDATE tournament_matches SET winner_id = v, status = p_status, reason = mot, finished_at = now() WHERE id = p_match;
  PERFORM xadrez_rt.evento('partida_decidida', m.tournament_id, m.id, m.game_id, jsonb_build_object('vencedor', v, 'motivo', mot));
  PERFORM xadrez_rt.avancar(m.tournament_id);
END $f$;

RESET ROLE;
COMMIT;
