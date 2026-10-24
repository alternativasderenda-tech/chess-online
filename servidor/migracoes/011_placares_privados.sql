-- TRN-SEG-05 (baixo, gauntlet r2): a policy "scores readable by all" (USING true) entregava a qualquer visitante
-- session_id, fingerprint, suspicion_score e os contadores do antitrapaça. O site só lê placares do próprio jogador
-- (conferência, "Minhas partidas", minhas vitórias no torneio) e o admin lê todos; os rankings públicos saem de
-- funções SECURITY DEFINER (ranking_fastest, ranking_wins, tournament_leaderboard...), que não dependem da policy.
BEGIN;
SET ROLE xadrez_owner;

DROP POLICY IF EXISTS "scores readable by all" ON public.scores;
DROP POLICY IF EXISTS "scores readable by owner or admin" ON public.scores;
CREATE POLICY "scores readable by owner or admin" ON public.scores FOR SELECT TO authenticated
  USING (user_id = auth.uid() OR is_admin());

RESET ROLE;
COMMIT;
