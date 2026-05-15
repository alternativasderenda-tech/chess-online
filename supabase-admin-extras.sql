-- =========================================================
-- Admin extras: partidas iniciadas por dia (line chart)
-- Roda no Supabase Dashboard → SQL Editor
-- =========================================================
-- Diferente do admin_stats_daily (que conta SCORES registrados),
-- esta funcao conta SESSOES INICIADAS — ou seja, qualquer partida
-- onde houve pelo menos 1 lance, independente do jogador
-- ter ganho ou registrado o score.
--
-- Suporta filtro por dificuldade (1=Facil, 2=Medio, 3=Dificil,
-- 4=Expert) ou null = todas as dificuldades 1-4.

create or replace function admin_games_started_daily(
  days_back int default 14,
  filter_difficulty smallint default null
)
returns table (dia date, games bigint)
language sql
security definer
stable
set search_path = public
as $$
  with session_starts as (
    -- Cada session_id e' uma partida. Pega a dificuldade e o
    -- primeiro lance (= momento que a partida comecou).
    select
      session_id,
      max(difficulty) as difficulty,
      min(created_at) as first_move_at
    from ai_game_moves
    where created_at > now() - (days_back || ' days')::interval
      and difficulty is not null
    group by session_id
  )
  select
    (first_move_at at time zone 'America/Sao_Paulo')::date as dia,
    count(*)::bigint as games
  from session_starts
  where is_admin()
    and (filter_difficulty is null or difficulty = filter_difficulty)
  group by 1
  order by 1;
$$;

grant execute on function admin_games_started_daily(int, smallint) to authenticated;
