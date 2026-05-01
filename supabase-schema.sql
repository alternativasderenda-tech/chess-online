-- =========================================================
-- Schema do Ranking — Xadrez Online
-- Rode este SQL no Supabase Dashboard → SQL Editor
-- =========================================================

create table if not exists scores (
  id uuid primary key default gen_random_uuid(),
  user_id uuid references auth.users(id) on delete cascade not null,
  username text not null,
  difficulty smallint not null check (difficulty between 1 and 4),
  player_seconds int not null check (player_seconds > 0),
  created_at timestamptz default now()
);

create index if not exists idx_scores_difficulty on scores(difficulty);
create index if not exists idx_scores_diff_time on scores(difficulty, player_seconds asc);
create index if not exists idx_scores_user on scores(user_id);

alter table scores enable row level security;

drop policy if exists "scores readable by all" on scores;
create policy "scores readable by all"
  on scores for select
  using (true);

drop policy if exists "users can insert own scores" on scores;
create policy "users can insert own scores"
  on scores for insert
  with check (auth.uid() = user_id);

-- (sem policy de update/delete = ninguém edita score depois de inserido)
