-- Pix automático (D-PAG-01) e pedido de tempo esgotado na hora (D-TRN-16). 24/10/2026.
BEGIN;
SET ROLE xadrez_owner;

-- jogador pede a conferência do relógio do SEU jogo (sem esperar a rotina de 1 min)
CREATE OR REPLACE FUNCTION public.tournament_claim_timeout(p_game_id text) RETURNS text
LANGUAGE plpgsql SECURITY DEFINER SET search_path = public AS $f$
DECLARE v_user uuid := auth.uid(); g games; tg record;
BEGIN
  IF v_user IS NULL THEN RAISE EXCEPTION 'login required'; END IF;
  SELECT * INTO g FROM games WHERE id = p_game_id;
  IF g.id IS NULL OR g.tournament_match_id IS NULL THEN RAISE EXCEPTION 'not a tournament game'; END IF;
  IF v_user NOT IN (g.white_user_id, g.black_user_id) THEN RAISE EXCEPTION 'only players'; END IF;
  IF g.status <> 'active' OR g.time_control <= 0 THEN RETURN g.status; END IF;
  SELECT * INTO tg FROM xadrez_rt.tempo_gasto(g.id);
  IF tg.lances >= 2 AND (CASE WHEN tg.vez = 'w' THEN tg.brancas ELSE tg.pretas END) + extract(epoch FROM now() - tg.ultimo) > g.time_control THEN
    PERFORM xadrez_rt.encerrar_jogo(g.id, CASE WHEN tg.vez = 'w' THEN 'black_wins' ELSE 'white_wins' END, 'tempo');
    RETURN 'finished';
  END IF;
  RETURN 'active';
END $f$;

-- relógio oficial (o site mostra o mesmo tempo que o servidor usa para decidir)
CREATE OR REPLACE FUNCTION public.tournament_game_clock(p_game_id text)
RETURNS TABLE(white_left numeric, black_left numeric, turn text, last_move_at timestamptz, moves int, server_now timestamptz)
LANGUAGE plpgsql STABLE SECURITY DEFINER SET search_path = public AS $f$
DECLARE g games; tg record;
BEGIN
  SELECT * INTO g FROM games WHERE id = p_game_id;
  IF g.id IS NULL OR g.tournament_match_id IS NULL OR auth.uid() IS NULL THEN RETURN; END IF;
  SELECT * INTO tg FROM xadrez_rt.tempo_gasto(g.id);
  RETURN QUERY SELECT greatest(0, g.time_control - tg.brancas), greatest(0, g.time_control - tg.pretas), tg.vez, tg.ultimo, tg.lances, now();
END $f$;

-- preço e situação do pagamento (o criador vê o seu; o admin vê todos)
CREATE OR REPLACE FUNCTION public.tournament_price() RETURNS numeric LANGUAGE sql STABLE SECURITY DEFINER
SET search_path = public AS $f$ SELECT valor::numeric FROM xadrez_rt.config WHERE chave = 'preco_torneio'; $f$;

CREATE OR REPLACE FUNCTION public.tournament_payment_status(p_tournament_id uuid)
RETURNS TABLE(paid boolean, status text, valor numeric, qr_code text, qr_code_base64 text, expira_em timestamptz, pago_em timestamptz)
LANGUAGE sql STABLE SECURITY DEFINER SET search_path = public AS $f$
  SELECT t.paid, p.status, p.valor, CASE WHEN p.status = 'pendente' THEN p.qr_code END,
         CASE WHEN p.status = 'pendente' THEN p.qr_code_base64 END, p.expira_em, p.pago_em
    FROM tournaments t
    LEFT JOIN LATERAL (SELECT * FROM xadrez_rt.pagamentos x WHERE x.tournament_id = t.id ORDER BY criado_em DESC LIMIT 1) p ON true
   WHERE t.id = p_tournament_id AND (t.creator_id = auth.uid() OR is_admin());
$f$;

-- servidor: dados para criar a cobrança (só criador, torneio aberto e não pago) e a cobrança reaproveitável
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
  SELECT * INTO p FROM xadrez_rt.pagamentos WHERE tournament_id = t.id AND status = 'pendente' AND expira_em > now() + interval '2 minutes'
   ORDER BY criado_em DESC LIMIT 1;
  SELECT email INTO e FROM auth.users WHERE id = t.creator_id;
  RETURN jsonb_build_object('pago', false, 'existente', to_jsonb(p), 'valor', (SELECT valor FROM xadrez_rt.config WHERE chave = 'preco_torneio'),
    'validade_min', (SELECT valor FROM xadrez_rt.config WHERE chave = 'pix_validade_min'), 'email', e, 'nome', t.name);
END $f$;

CREATE OR REPLACE FUNCTION xadrez_rt.pix_registrar(p_tournament_id uuid, p_provedor_id text, p_valor numeric, p_qr text,
  p_qr64 text, p_expira timestamptz, p_bruto jsonb) RETURNS void
LANGUAGE sql SECURITY DEFINER SET search_path = public AS $f$
  INSERT INTO xadrez_rt.pagamentos (tournament_id, provedor_id, valor, qr_code, qr_code_base64, expira_em, bruto)
  VALUES (p_tournament_id, p_provedor_id, p_valor, p_qr, p_qr64, p_expira, p_bruto)
  ON CONFLICT (provedor_id) DO NOTHING;
$f$;

-- confirmação (webhook ou conferência periódica): idempotente; só libera se o valor bate e o torneio está aberto
CREATE OR REPLACE FUNCTION xadrez_rt.pix_confirmar(p_provedor_id text, p_status text, p_valor numeric, p_bruto jsonb) RETURNS text
LANGUAGE plpgsql SECURITY DEFINER SET search_path = public AS $f$
DECLARE p xadrez_rt.pagamentos; t tournaments;
BEGIN
  SELECT * INTO p FROM xadrez_rt.pagamentos WHERE provedor_id = p_provedor_id FOR UPDATE;
  IF p.id IS NULL THEN RETURN 'desconhecido'; END IF;
  UPDATE xadrez_rt.pagamentos SET bruto = coalesce(p_bruto, bruto), atualizado_em = now() WHERE id = p.id;
  IF p_status = 'approved' THEN
    IF p_valor IS DISTINCT FROM p.valor THEN
      PERFORM xadrez_rt.evento('pix_valor_divergente', p.tournament_id, NULL, NULL, jsonb_build_object('esperado', p.valor, 'pago', p_valor, 'id', p_provedor_id));
      RETURN 'valor_divergente';
    END IF;
    IF p.status = 'pago' THEN RETURN 'ja_pago'; END IF;
    UPDATE xadrez_rt.pagamentos SET status = 'pago', pago_em = now() WHERE id = p.id;
    SELECT * INTO t FROM tournaments WHERE id = p.tournament_id FOR UPDATE;
    IF t.status = 'open' AND NOT t.paid THEN
      UPDATE tournaments SET paid = true, paid_at = now() WHERE id = t.id;
      PERFORM xadrez_rt.evento('pago_pix', t.id, NULL, NULL, jsonb_build_object('id', p_provedor_id, 'valor', p_valor));
      RETURN 'liberado';
    END IF;
    PERFORM xadrez_rt.evento('pix_pago_torneio_fechado', t.id, NULL, NULL, jsonb_build_object('id', p_provedor_id, 'status', t.status));
    RETURN 'pago_sem_liberar';
  ELSIF p_status IN ('cancelled','rejected','expired') AND p.status = 'pendente' THEN
    UPDATE xadrez_rt.pagamentos SET status = CASE p_status WHEN 'expired' THEN 'expirado' WHEN 'rejected' THEN 'falhou' ELSE 'cancelado' END WHERE id = p.id;
    RETURN 'encerrado';
  ELSIF p_status IN ('refunded','charged_back') THEN
    UPDATE xadrez_rt.pagamentos SET status = 'estornado' WHERE id = p.id;
    RETURN 'estornado';
  END IF;
  RETURN 'sem_mudanca';
END $f$;

CREATE OR REPLACE FUNCTION xadrez_rt.pix_pendentes() RETURNS SETOF text LANGUAGE sql STABLE SECURITY DEFINER
SET search_path = public AS $f$
  SELECT provedor_id FROM xadrez_rt.pagamentos WHERE status = 'pendente' AND provedor_id IS NOT NULL
     AND criado_em > now() - interval '2 days' ORDER BY criado_em DESC LIMIT 30;
$f$;

-- torneio pago e cancelado antes de começar: o servidor pede o estorno
CREATE OR REPLACE FUNCTION xadrez_rt.pix_para_estornar() RETURNS SETOF text LANGUAGE sql STABLE SECURITY DEFINER
SET search_path = public AS $f$
  SELECT p.provedor_id FROM xadrez_rt.pagamentos p JOIN tournaments t ON t.id = p.tournament_id
   WHERE p.status = 'pago' AND t.status = 'cancelled' AND coalesce(t.current_round, 0) = 0
     AND coalesce(t.cancel_reason, '') <> 'admin_sem_estorno' LIMIT 10;
$f$;
CREATE OR REPLACE FUNCTION xadrez_rt.pix_estornado(p_provedor_id text) RETURNS void LANGUAGE sql SECURITY DEFINER
SET search_path = public AS $f$
  UPDATE xadrez_rt.pagamentos SET status = 'estornado', atualizado_em = now() WHERE provedor_id = p_provedor_id AND status = 'pago';
$f$;

GRANT EXECUTE ON FUNCTION xadrez_rt.pix_preparar(uuid, uuid), xadrez_rt.pix_registrar(uuid, text, numeric, text, text, timestamptz, jsonb),
  xadrez_rt.pix_confirmar(text, text, numeric, jsonb), xadrez_rt.pix_pendentes(), xadrez_rt.pix_para_estornar(),
  xadrez_rt.pix_estornado(text) TO xadrez_rt;

RESET ROLE;
COMMIT;
