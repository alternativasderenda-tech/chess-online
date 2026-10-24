-- Pix que sobrou (conferência do inglês, 24/10/2026): cancelar um torneio não pago (ou liberá-lo por outro caminho, como
-- a confirmação manual do admin) deixava o pedido do Mercado Pago pendente e PAGÁVEL até vencer. A rotina passa a
-- cancelá-lo no MP; se ele for pago no meio do caminho, o pagamento cai no estorno como sempre (D-PAG-13).
BEGIN;
SET ROLE xadrez_owner;

CREATE OR REPLACE FUNCTION xadrez_rt.pix_para_cancelar() RETURNS SETOF text LANGUAGE sql STABLE SECURITY DEFINER
SET search_path = public AS $f$
  SELECT p.provedor_id FROM xadrez_rt.pagamentos p JOIN tournaments t ON t.id = p.tournament_id
   WHERE p.status = 'pendente' AND p.provedor_id IS NOT NULL AND NOT p.provedor_id LIKE 'sim-%'
     AND p.expira_em > now() AND (t.status = 'cancelled' OR t.paid)
   LIMIT 20;
$f$;
GRANT EXECUTE ON FUNCTION xadrez_rt.pix_para_cancelar() TO xadrez_rt;

RESET ROLE;
COMMIT;
