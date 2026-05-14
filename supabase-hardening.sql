-- =========================================================
-- Hardening: fecha bypass de INSERT + detecta "scores sem jogo"
-- Roda no Supabase Dashboard → SQL Editor
-- =========================================================
-- Problema: usuario logado conseguia inserir score falso direto
-- na tabela scores (pulando register_ai_score e sua validacao).
--
-- Defesa:
-- 1) Remove a policy de INSERT direto → unica porta vira a
--    register_ai_score (security definer), que ja valida que
--    existe jogo de verdade em ai_game_moves.
-- 2) Adiciona status 'hacker' + funcoes pra detectar/sinalizar
--    scores cujo session_id nao tem lances correspondentes
--    (= placar sem jogo = fabricado).

-- ============== 1. Fecha o bypass de INSERT direto ==============
-- register_ai_score e' security definer, entao continua funcionando
-- (security definer ignora RLS). So o INSERT direto do client morre.
drop policy if exists "users can insert own scores" on scores;

-- ============== 2. Adiciona status 'hacker' ==============
alter table scores drop constraint if exists scores_status_check;
alter table scores add constraint scores_status_check
  check (status in ('normal', 'cheater', 'hacker'));

-- ============== 3. RPC: lista scores orfaos (read-only) ==============
-- Score "orfao" = tem session_id preenchido mas nenhum lance
-- correspondente em ai_game_moves. Placar sem jogo = fraude.
-- (session_id NULL e' legacy/pre-tracking, NAO conta como orfao)
create or replace function admin_orphan_scores()
returns table (
  score_id uuid,
  user_id uuid,
  username text,
  difficulty smallint,
  player_seconds int,
  status text,
  created_at timestamptz,
  session_id text
)
language sql
security definer
stable
set search_path = public
as $$
  select
    s.id, s.user_id, s.username, s.difficulty,
    s.player_seconds, s.status, s.created_at, s.session_id
  from scores s
  where is_admin()
    and s.session_id is not null
    and not exists (
      select 1 from ai_game_moves m where m.session_id = s.session_id
    )
  order by s.created_at desc;
$$;

grant execute on function admin_orphan_scores() to authenticated;

-- ============== 4. RPC: sinaliza orfaos como 'hacker' ==============
-- Marca status='hacker' nos scores orfaos. NAO deleta nada — o score
-- continua no ranking, so' fica identificado. Retorna quem foi pego.
create or replace function admin_flag_orphan_scores()
returns table (
  flagged_user_id uuid,
  flagged_username text,
  score_id uuid,
  difficulty smallint,
  player_seconds int,
  created_at timestamptz
)
language plpgsql
security definer
set search_path = public
as $$
begin
  if not is_admin() then
    raise exception 'forbidden: not admin';
  end if;

  return query
  update scores s
  set status = 'hacker'
  where s.session_id is not null
    and s.status <> 'hacker'
    and not exists (
      select 1 from ai_game_moves m where m.session_id = s.session_id
    )
  returning s.user_id, s.username, s.id, s.difficulty, s.player_seconds, s.created_at;
end;
$$;

grant execute on function admin_flag_orphan_scores() to authenticated;

-- ============== 5. RPC: lista usuarios "hacker" conhecidos ==============
-- Resumo por usuario de quantos scores 'hacker' cada um tem
create or replace function admin_hacker_users()
returns table (
  user_id uuid,
  username text,
  hacker_scores bigint,
  total_scores bigint,
  first_flagged timestamptz,
  last_flagged timestamptz
)
language sql
security definer
stable
set search_path = public
as $$
  select
    s.user_id,
    max(s.username) as username,
    count(*) filter (where s.status = 'hacker')::bigint as hacker_scores,
    count(*)::bigint as total_scores,
    min(s.created_at) filter (where s.status = 'hacker') as first_flagged,
    max(s.created_at) filter (where s.status = 'hacker') as last_flagged
  from scores s
  where is_admin()
  group by s.user_id
  having count(*) filter (where s.status = 'hacker') > 0
  order by hacker_scores desc;
$$;

grant execute on function admin_hacker_users() to authenticated;
