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

-- TRN-PIX-22: a chave de idempotência da cobrança passa a ser "torneio + nº da cobrança" (não mais uma janela de 10 min,
-- que devolvia o pedido já cancelado como "Pix novo"); a mesma tentativa repetida (resposta perdida) continua idempotente
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
    'validade_min', v_val, 'email', e, 'nome', t.name,
    'n_cobrancas', (SELECT count(*) FROM xadrez_rt.pagamentos WHERE tournament_id = t.id));
END $f$;

RESET ROLE;
COMMIT;
