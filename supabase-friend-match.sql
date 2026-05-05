-- =========================================================
-- Schema do Friend Match — Xadrez Online
-- Rode este SQL no Supabase Dashboard → SQL Editor
-- DEPOIS habilite Realtime: Database → Replication → marque tabelas
--   `games` e `moves`
-- =========================================================

create table if not exists games (
  id text primary key,
  white_user_id uuid references auth.users(id) on delete set null,
  black_user_id uuid references auth.users(id) on delete set null,
  white_username text,
  black_username text,
  status text not null default 'waiting'
    check (status in ('waiting', 'active', 'finished', 'abandoned')),
  result text
    check (result is null or result in ('white_wins', 'black_wins', 'draw', 'abandoned')),
  end_reason text,
  time_control int not null default 600,
  current_turn text not null default 'w' check (current_turn in ('w', 'b')),
  created_at timestamptz default now(),
  started_at timestamptz,
  ended_at timestamptz
);

create index if not exists idx_games_status on games(status);
create index if not exists idx_games_white on games(white_user_id);
create index if not exists idx_games_black on games(black_user_id);

create table if not exists moves (
  id uuid primary key default gen_random_uuid(),
  game_id text references games(id) on delete cascade not null,
  move_number int not null,
  player_color text not null check (player_color in ('w', 'b')),
  from_sq smallint not null,
  to_sq smallint not null,
  promotion text,
  notation text,
  white_time_remaining int,
  black_time_remaining int,
  is_game_over boolean default false,
  game_result text,
  created_at timestamptz default now()
);

create index if not exists idx_moves_game on moves(game_id, move_number);

-- ============ Row Level Security ============

alter table games enable row level security;
alter table moves enable row level security;

-- games: qualquer um autenticado le (para entrar via link)
drop policy if exists "games readable by all auth" on games;
create policy "games readable by all auth"
  on games for select
  using (auth.role() = 'authenticated');

-- games: qualquer autenticado cria (pode ser white OU black)
drop policy if exists "auth users can create games" on games;
create policy "auth users can create games"
  on games for insert
  with check (
    auth.uid() = white_user_id
    or auth.uid() = black_user_id
  );

-- games: jogadores da partida podem atualizar; OU qualquer autenticado
-- pode "claim" um slot vazio se a partida estiver aguardando.
-- with check garante que apos o update o usuario seja um dos jogadores.
drop policy if exists "players can update own games" on games;
drop policy if exists "players can update own games or join as black" on games;
drop policy if exists "players can update or join open game" on games;
create policy "players can update or join open game"
  on games for update
  using (
    auth.uid() = white_user_id
    or auth.uid() = black_user_id
    or (status = 'waiting' and (white_user_id is null or black_user_id is null))
  )
  with check (
    auth.uid() = white_user_id
    or auth.uid() = black_user_id
  );

-- moves: qualquer autenticado le (para o oponente receber via realtime)
drop policy if exists "moves readable by all auth" on moves;
create policy "moves readable by all auth"
  on moves for select
  using (auth.role() = 'authenticated');

-- moves: insere se for jogador da game e estiver na vez correta
drop policy if exists "players can insert own moves" on moves;
create policy "players can insert own moves"
  on moves for insert
  with check (
    exists (
      select 1 from games g
      where g.id = game_id
        and (
          (player_color = 'w' and g.white_user_id = auth.uid())
          or
          (player_color = 'b' and g.black_user_id = auth.uid())
        )
    )
  );
