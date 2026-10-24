-- pix_preparar: sem cobrança anterior, to_jsonb(registro vazio) virava um objeto com tudo nulo e o servidor achava que
-- já havia cobrança (devolvia QR vazio). Achado pelo e2e (24/10/2026).
BEGIN;
SET ROLE xadrez_owner;
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
  RETURN jsonb_build_object('pago', false, 'existente', CASE WHEN p.id IS NULL THEN NULL ELSE to_jsonb(p) END,
    'valor', (SELECT valor FROM xadrez_rt.config WHERE chave = 'preco_torneio'),
    'validade_min', (SELECT valor FROM xadrez_rt.config WHERE chave = 'pix_validade_min'), 'email', e, 'nome', t.name);
END $f$;
RESET ROLE;
COMMIT;
