-- D-TRN-28 (complemento): o código do convite (share_token) ainda chegava ao inscrito com o compartilhamento desligado
-- por dois caminhos — list_my_tournaments e a leitura direta da tabela pela API (regra de leitura da tabela). Achado
-- pelo agente da página (24/10/2026). A coluna sai da leitura direta (privilégio por coluna); quem pode ter o código
-- recebe pelas funções (get_tournament, list_my_tournaments, get_tournament_by_token para quem já tem o código).
BEGIN;
REVOKE SELECT ON public.tournaments FROM anon, authenticated;
DO $$
DECLARE cols text;
BEGIN
  SELECT string_agg(quote_ident(column_name), ', ' ORDER BY ordinal_position) INTO cols
    FROM information_schema.columns WHERE table_schema = 'public' AND table_name = 'tournaments' AND column_name <> 'share_token';
  EXECUTE format('GRANT SELECT (%s) ON public.tournaments TO anon, authenticated', cols);
END $$;

SET ROLE xadrez_owner;
CREATE OR REPLACE FUNCTION public.list_my_tournaments()
RETURNS TABLE(id uuid, name text, creator_id uuid, creator_name text, format tournament_format, visibility tournament_visibility,
              status tournament_status, paid boolean, capacity integer, participant_count integer, starts_at timestamptz,
              ends_at timestamptz, share_token text, role text)
LANGUAGE sql STABLE SECURITY DEFINER SET search_path = public AS $f$
  SELECT t.id, t.name, t.creator_id, t.creator_name, t.format, t.visibility, t.status, t.paid, t.capacity,
         (SELECT count(*)::int FROM tournament_participants p WHERE p.tournament_id = t.id AND p.status = 'approved'),
         t.starts_at, t.ends_at,
         CASE WHEN t.creator_id = auth.uid() OR is_admin() OR t.participants_can_share THEN t.share_token END,
         CASE WHEN t.creator_id = auth.uid() THEN 'creator' ELSE 'participant' END
    FROM tournaments t
   WHERE t.creator_id = auth.uid()
      OR EXISTS (SELECT 1 FROM tournament_participants p WHERE p.tournament_id = t.id AND p.user_id = auth.uid())
   ORDER BY t.starts_at;
$f$;
RESET ROLE;
COMMIT;
