-- =========================================================
-- Ranking v2: 1 linha por usuario + posicao do proprio usuario
-- Roda no Supabase Dashboard → SQL Editor
-- =========================================================
-- Problema: a aba 'Vitoria mais rapida' mostrava cada partida
-- individual. Um jogador que joga muito ocupava todos os 50
-- lugares sozinho.
--
-- Fix: ranking agora e' 1 linha por usuario (melhor tempo /
-- total de vitorias). Mais 1 RPC pra calcular a posicao do
-- proprio usuario mesmo fora do top 50.
--
-- Estas funcoes sao publicas (qualquer um ve o ranking) — nao
-- exigem is_admin().

-- Ranking de vitoria mais rapida: 1 linha por usuario (melhor tempo)
-- Obs: 'position' e' palavra reservada no Postgres — usamos rank_pos.
create or replace function ranking_fastest(
  p_difficulty smallint,
  p_limit int default 50
)
returns table (
  rank_pos bigint,
  username text,
  best_seconds int,
  user_id uuid
)
language sql
stable
security definer
set search_path = public
as $$
  with best_per_user as (
    select
      s.user_id,
      max(s.username) as username,
      min(s.player_seconds) as best_seconds
    from scores s
    where s.difficulty = p_difficulty
    group by s.user_id
  )
  select
    rank() over (order by best_seconds asc) as rank_pos,
    username,
    best_seconds,
    user_id
  from best_per_user
  order by best_seconds asc
  limit p_limit;
$$;

grant execute on function ranking_fastest(smallint, int) to anon, authenticated;

-- Ranking de mais vitorias: 1 linha por usuario (total de vitorias)
create or replace function ranking_wins(
  p_difficulty smallint,
  p_limit int default 50
)
returns table (
  rank_pos bigint,
  username text,
  wins bigint,
  user_id uuid
)
language sql
stable
security definer
set search_path = public
as $$
  with wins_per_user as (
    select
      s.user_id,
      max(s.username) as username,
      count(*) as wins
    from scores s
    where s.difficulty = p_difficulty
    group by s.user_id
  )
  select
    rank() over (order by wins desc) as rank_pos,
    username,
    wins,
    user_id
  from wins_per_user
  order by wins desc
  limit p_limit;
$$;

grant execute on function ranking_wins(smallint, int) to anon, authenticated;

-- Posicao do proprio usuario nas duas modalidades (mesmo fora do top 50)
create or replace function ranking_my_position(
  p_difficulty smallint,
  p_user_id uuid
)
returns table (
  fastest_position bigint,
  fastest_best_seconds int,
  wins_position bigint,
  wins_total bigint
)
language sql
stable
security definer
set search_path = public
as $$
  with agg as (
    select
      s.user_id,
      min(s.player_seconds) as best_seconds,
      count(*) as wins
    from scores s
    where s.difficulty = p_difficulty
    group by s.user_id
  ),
  ranked as (
    select
      a.user_id,
      a.best_seconds,
      a.wins,
      rank() over (order by a.best_seconds asc) as fastest_pos,
      rank() over (order by a.wins desc) as wins_pos
    from agg a
  )
  select
    r.fastest_pos,
    r.best_seconds,
    r.wins_pos,
    r.wins
  from ranked r
  where r.user_id = p_user_id;
$$;

grant execute on function ranking_my_position(smallint, uuid) to authenticated;
