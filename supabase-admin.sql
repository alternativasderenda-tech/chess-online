-- =========================================================
-- Painel de Admin — Xadrez Online
-- Rode no Supabase Dashboard → SQL Editor
-- =========================================================

-- Tabela de admins (usuarios com acesso ao painel /admin)
create table if not exists admin_users (
  user_id uuid primary key references auth.users(id) on delete cascade,
  added_at timestamptz default now()
);

-- IMPORTANTE: substitua o UUID pelo seu user_id real (auth.users)
-- Pra descobrir: select id, email from auth.users where email = 'alternativasderenda@gmail.com';
-- Depois rode (com o ID correto):
-- insert into admin_users (user_id) values ('SEU_UUID_AQUI') on conflict do nothing;

insert into admin_users (user_id) values ('6b3de972-20bb-446a-9c28-5562c1b2d4dc')
on conflict (user_id) do nothing;

-- Helper: checa se usuario logado e' admin
create or replace function is_admin()
returns boolean
language sql
security definer
stable
set search_path = public
as $$
  select exists(select 1 from admin_users where user_id = auth.uid());
$$;

grant execute on function is_admin() to authenticated;

-- RLS: admin pode ler ai_game_moves de qualquer usuario (pra analytics)
drop policy if exists "admin can read all ai_game_moves" on ai_game_moves;
create policy "admin can read all ai_game_moves"
  on ai_game_moves for select
  using (is_admin());

-- RLS: admin_users so' visivel pelo proprio admin
alter table admin_users enable row level security;

drop policy if exists "admins can read admin_users" on admin_users;
create policy "admins can read admin_users"
  on admin_users for select
  using (auth.uid() = user_id or is_admin());


-- ===================== RPCs DE ESTATISTICAS =====================

-- Overview: contagens gerais
create or replace function admin_stats_overview()
returns jsonb
language sql
security definer
stable
set search_path = public
as $$
  select jsonb_build_object(
    'total_scores', (select count(*) from scores),
    'unique_users', (select count(distinct user_id) from scores),
    'total_ai_games', (select count(distinct session_id) from ai_game_moves),
    'total_online_games', (select count(*) from games),
    'online_finished', (select count(*) from games where status = 'finished'),
    'online_abandoned', (select count(*) from games where status = 'abandoned'),
    'online_active', (select count(*) from games where status = 'active'),
    'cheater_scores', (select count(*) from scores where status = 'cheater'),
    'normal_scores', (select count(*) from scores where status = 'normal'),
    'client_validated_scores', (select count(*) from scores where client_validated = true),
    'last_7d_scores', (select count(*) from scores where created_at > now() - interval '7 days'),
    'last_24h_scores', (select count(*) from scores where created_at > now() - interval '24 hours')
  )
  where is_admin();
$$;

grant execute on function admin_stats_overview() to authenticated;

-- Stats por dificuldade
create or replace function admin_stats_by_difficulty()
returns table (
  difficulty smallint,
  total bigint,
  cheaters bigint,
  client_validated bigint,
  avg_seconds int,
  best_seconds int
)
language sql
security definer
stable
set search_path = public
as $$
  select
    s.difficulty,
    count(*)::bigint as total,
    count(*) filter (where s.status = 'cheater')::bigint as cheaters,
    count(*) filter (where s.client_validated = true)::bigint as client_validated,
    avg(s.player_seconds)::int as avg_seconds,
    min(s.player_seconds)::int as best_seconds
  from scores s
  where is_admin()
  group by s.difficulty
  order by s.difficulty;
$$;

grant execute on function admin_stats_by_difficulty() to authenticated;

-- Atividade diaria dos ultimos 14 dias
create or replace function admin_stats_daily(days_back int default 14)
returns table (dia date, scores bigint)
language sql
security definer
stable
set search_path = public
as $$
  select
    (created_at at time zone 'America/Sao_Paulo')::date as dia,
    count(*)::bigint as scores
  from scores
  where is_admin()
    and created_at > now() - (days_back || ' days')::interval
  group by 1
  order by 1 desc;
$$;

grant execute on function admin_stats_daily(int) to authenticated;

-- Top jogadores (por total de scores normais)
create or replace function admin_top_players(lim int default 20)
returns table (
  user_id uuid,
  username text,
  total_scores bigint,
  best_difficulty smallint,
  last_played timestamptz
)
language sql
security definer
stable
set search_path = public
as $$
  select
    s.user_id,
    max(s.username) as username,
    count(*)::bigint as total_scores,
    max(s.difficulty) as best_difficulty,
    max(s.created_at) as last_played
  from scores s
  where is_admin()
    and s.status = 'normal'
  group by s.user_id
  order by total_scores desc
  limit lim;
$$;

grant execute on function admin_top_players(int) to authenticated;
