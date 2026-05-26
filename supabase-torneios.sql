-- =========================================================
-- Torneios — Xadrez Online
-- Rode no Supabase Dashboard → SQL Editor
-- Pré-requisitos: scores, admin_users, is_admin() já existem
-- =========================================================

-- Auto-migração: se uma execução anterior criou a coluna 'position'
-- (que é palavra reservada do PG), renomeia pra 'slot'.
do $$ begin
  if exists (
    select 1 from information_schema.columns
     where table_schema = 'public'
       and table_name = 'tournament_matches'
       and column_name = 'position'
  ) then
    alter table tournament_matches rename column "position" to slot;
  end if;
end $$;

-- ===================== ENUMS =====================
do $$ begin
  create type tournament_format as enum ('ai', 'pvp_bracket');
exception when duplicate_object then null; end $$;

do $$ begin
  create type tournament_visibility as enum ('public', 'approval', 'link');
exception when duplicate_object then null; end $$;

do $$ begin
  create type tournament_status as enum ('open', 'active', 'finished', 'cancelled');
exception when duplicate_object then null; end $$;

do $$ begin
  create type tournament_criterion as enum ('most_wins', 'fastest_win');
exception when duplicate_object then null; end $$;

do $$ begin
  create type participant_status as enum ('pending', 'approved', 'rejected', 'left');
exception when duplicate_object then null; end $$;

do $$ begin
  create type match_status as enum ('pending', 'in_progress', 'finished', 'walkover');
exception when duplicate_object then null; end $$;


-- ===================== TABELAS =====================

create table if not exists tournaments (
  id uuid primary key default gen_random_uuid(),
  creator_id uuid not null references auth.users(id) on delete cascade,
  creator_name text not null,
  name text not null,
  description text,
  prize_description text not null,
  format tournament_format not null,
  visibility tournament_visibility not null,
  status tournament_status not null default 'open',
  capacity int not null check (capacity in (4, 8, 16, 32)),
  starts_at timestamptz not null,
  ends_at timestamptz,
  share_token text unique,
  paid boolean not null default false,
  paid_at timestamptz,
  -- AI ranking
  difficulty smallint,
  criterion tournament_criterion,
  -- PvP bracket
  round_deadline_hours int,
  total_rounds int,
  current_round int not null default 0,
  created_at timestamptz not null default now()
);

create index if not exists idx_tournaments_open_listed
  on tournaments (starts_at)
  where status = 'open' and paid = true and visibility in ('public', 'approval');
create index if not exists idx_tournaments_creator on tournaments(creator_id);
create index if not exists idx_tournaments_token on tournaments(share_token);

create table if not exists tournament_participants (
  id uuid primary key default gen_random_uuid(),
  tournament_id uuid not null references tournaments(id) on delete cascade,
  user_id uuid not null references auth.users(id) on delete cascade,
  user_name text not null,
  status participant_status not null default 'pending',
  joined_at timestamptz not null default now(),
  unique (tournament_id, user_id)
);

create index if not exists idx_tparticipants_t on tournament_participants(tournament_id);
create index if not exists idx_tparticipants_user on tournament_participants(user_id);

create table if not exists tournament_matches (
  id uuid primary key default gen_random_uuid(),
  tournament_id uuid not null references tournaments(id) on delete cascade,
  round int not null,
  slot int not null,
  player1_id uuid references auth.users(id) on delete set null,
  player2_id uuid references auth.users(id) on delete set null,
  winner_id uuid references auth.users(id) on delete set null,
  status match_status not null default 'pending',
  deadline_at timestamptz,
  game_pgn text,
  finished_at timestamptz,
  created_at timestamptz not null default now(),
  unique (tournament_id, round, slot)
);

create index if not exists idx_tmatches_t_round on tournament_matches(tournament_id, round);


-- ===================== RLS =====================

alter table tournaments enable row level security;
alter table tournament_participants enable row level security;
alter table tournament_matches enable row level security;

-- Tournaments: logado vê pagos (público OU aprovação), próprio criador vê os seus,
-- participante vê os que está. Modo 'link' fica oculto (só via share_token).
drop policy if exists "tournaments visible" on tournaments;
create policy "tournaments visible" on tournaments for select
  to authenticated
  using (
    auth.uid() is not null and (
      (paid = true and visibility in ('public', 'approval'))
      or creator_id = auth.uid()
      or exists (
        select 1 from tournament_participants p
        where p.tournament_id = tournaments.id and p.user_id = auth.uid()
      )
      or is_admin()
    )
  );

-- Participantes: cada um vê os próprios; criador do torneio vê todos; admin vê tudo
drop policy if exists "participants visible" on tournament_participants;
create policy "participants visible" on tournament_participants for select
  to authenticated
  using (
    auth.uid() is not null and (
      user_id = auth.uid()
      or exists (
        select 1 from tournaments t
        where t.id = tournament_participants.tournament_id
          and (t.creator_id = auth.uid()
               or (t.paid = true and t.visibility in ('public', 'approval')))
      )
      or is_admin()
    )
  );

-- Matches: visíveis se o torneio é visível pro usuário
drop policy if exists "matches visible" on tournament_matches;
create policy "matches visible" on tournament_matches for select
  to authenticated
  using (
    auth.uid() is not null and exists (
      select 1 from tournaments t
      where t.id = tournament_matches.tournament_id
        and (
          (t.paid = true and t.visibility in ('public', 'approval'))
          or t.creator_id = auth.uid()
          or exists (
            select 1 from tournament_participants p
            where p.tournament_id = t.id and p.user_id = auth.uid()
          )
          or is_admin()
        )
    )
  );

-- (sem policy de insert/update/delete direto — tudo passa pelas RPCs)


-- ===================== RPCs =====================

-- create_tournament
create or replace function create_tournament(
  p_name text,
  p_description text,
  p_prize text,
  p_format tournament_format,
  p_visibility tournament_visibility,
  p_capacity int,
  p_starts_at timestamptz,
  p_ends_at timestamptz,
  p_difficulty smallint,
  p_criterion tournament_criterion,
  p_round_deadline_hours int
)
returns tournaments
language plpgsql
security definer
set search_path = public
as $$
declare
  v_user uuid := auth.uid();
  v_name text;
  v_token text;
  v_total_rounds int;
  v_row tournaments;
begin
  if v_user is null then raise exception 'login required'; end if;
  if p_capacity not in (4, 8, 16, 32) then
    raise exception 'capacity must be 4, 8, 16 or 32';
  end if;
  if char_length(coalesce(p_name, '')) < 3 then
    raise exception 'name too short';
  end if;
  if char_length(coalesce(p_prize, '')) < 1 then
    raise exception 'prize required';
  end if;

  if p_format = 'ai' then
    if p_difficulty is null or p_criterion is null or p_ends_at is null then
      raise exception 'ai format requires difficulty, criterion and ends_at';
    end if;
    if p_ends_at <= p_starts_at then
      raise exception 'ends_at must be after starts_at';
    end if;
    v_total_rounds := null;
  else
    if p_round_deadline_hours is null or p_round_deadline_hours < 1 then
      raise exception 'pvp_bracket requires round_deadline_hours >= 1';
    end if;
    v_total_rounds := case p_capacity
      when 4 then 2 when 8 then 3 when 16 then 4 when 32 then 5
    end;
  end if;

  select coalesce(raw_user_meta_data->>'full_name', raw_user_meta_data->>'name', email)
    into v_name from auth.users where id = v_user;

  -- Token curto: 12 chars hex do gen_random_uuid (evita dep do pgcrypto)
  v_token := substr(translate(gen_random_uuid()::text, '-', ''), 1, 12);

  insert into tournaments (
    creator_id, creator_name, name, description, prize_description,
    format, visibility, capacity, starts_at, ends_at,
    share_token, paid,
    difficulty, criterion,
    round_deadline_hours, total_rounds
  ) values (
    v_user, coalesce(v_name, 'Anônimo'), p_name, p_description, p_prize,
    p_format, p_visibility, p_capacity, p_starts_at, p_ends_at,
    v_token, false,
    case when p_format = 'ai' then p_difficulty end,
    case when p_format = 'ai' then p_criterion end,
    case when p_format = 'pvp_bracket' then p_round_deadline_hours end,
    v_total_rounds
  ) returning * into v_row;

  return v_row;
end;
$$;

grant execute on function create_tournament(text, text, text, tournament_format, tournament_visibility, int, timestamptz, timestamptz, smallint, tournament_criterion, int) to authenticated;


-- confirm_tournament_payment (admin manual enquanto não tem Pix automático)
create or replace function confirm_tournament_payment(p_tournament_id uuid)
returns tournaments
language plpgsql
security definer
set search_path = public
as $$
declare v_row tournaments;
begin
  if not is_admin() then raise exception 'admin only'; end if;
  update tournaments
     set paid = true, paid_at = now()
   where id = p_tournament_id
   returning * into v_row;
  if v_row.id is null then raise exception 'tournament not found'; end if;
  return v_row;
end;
$$;

grant execute on function confirm_tournament_payment(uuid) to authenticated;


-- list_open_tournaments (públicos + aprovação; modo 'link' fica oculto)
create or replace function list_open_tournaments()
returns table (
  id uuid,
  name text,
  description text,
  creator_id uuid,
  creator_name text,
  prize_description text,
  format tournament_format,
  visibility tournament_visibility,
  capacity int,
  participant_count int,
  starts_at timestamptz,
  ends_at timestamptz,
  difficulty smallint,
  criterion tournament_criterion,
  round_deadline_hours int
)
language sql
stable
security definer
set search_path = public
as $$
  select t.id, t.name, t.description, t.creator_id, t.creator_name, t.prize_description,
         t.format, t.visibility, t.capacity,
         (select count(*)::int from tournament_participants p
            where p.tournament_id = t.id and p.status = 'approved') as participant_count,
         t.starts_at, t.ends_at, t.difficulty, t.criterion, t.round_deadline_hours
    from tournaments t
   where t.status = 'open'
     and t.paid = true
     and t.visibility in ('public', 'approval')
   order by t.starts_at asc;
$$;

grant execute on function list_open_tournaments() to authenticated;


-- list_my_tournaments (criados + participo)
create or replace function list_my_tournaments()
returns table (
  id uuid,
  name text,
  creator_id uuid,
  creator_name text,
  format tournament_format,
  visibility tournament_visibility,
  status tournament_status,
  paid boolean,
  capacity int,
  participant_count int,
  starts_at timestamptz,
  ends_at timestamptz,
  share_token text,
  role text  -- 'creator' ou 'participant'
)
language sql
stable
security definer
set search_path = public
as $$
  select t.id, t.name, t.creator_id, t.creator_name, t.format, t.visibility, t.status, t.paid,
         t.capacity,
         (select count(*)::int from tournament_participants p
            where p.tournament_id = t.id and p.status = 'approved') as participant_count,
         t.starts_at, t.ends_at, t.share_token,
         case when t.creator_id = auth.uid() then 'creator' else 'participant' end as role
    from tournaments t
   where t.creator_id = auth.uid()
      or exists (
        select 1 from tournament_participants p
         where p.tournament_id = t.id and p.user_id = auth.uid()
      )
   order by t.starts_at asc;
$$;

grant execute on function list_my_tournaments() to authenticated;


-- get_tournament_by_token (acesso via link compartilhado)
create or replace function get_tournament_by_token(p_token text)
returns tournaments
language sql
stable
security definer
set search_path = public
as $$
  select * from tournaments
   where share_token = p_token
     and paid = true
   limit 1;
$$;

grant execute on function get_tournament_by_token(text) to authenticated;


-- join_tournament
create or replace function join_tournament(p_tournament_id uuid)
returns tournament_participants
language plpgsql
security definer
set search_path = public
as $$
declare
  v_user uuid := auth.uid();
  v_name text;
  v_t tournaments;
  v_count int;
  v_st participant_status;
  v_row tournament_participants;
begin
  if v_user is null then raise exception 'login required'; end if;

  select * into v_t from tournaments where id = p_tournament_id;
  if v_t.id is null then raise exception 'tournament not found'; end if;
  if not v_t.paid then raise exception 'tournament not paid yet'; end if;
  if v_t.status <> 'open' then raise exception 'tournament not open'; end if;
  if v_t.creator_id = v_user then raise exception 'creator cannot join own tournament'; end if;

  select count(*) into v_count from tournament_participants
   where tournament_id = p_tournament_id and status in ('pending', 'approved');
  if v_count >= v_t.capacity then raise exception 'tournament full'; end if;

  v_st := case v_t.visibility
    when 'approval' then 'pending'::participant_status
    else 'approved'::participant_status
  end;

  select coalesce(raw_user_meta_data->>'full_name', raw_user_meta_data->>'name', email)
    into v_name from auth.users where id = v_user;

  insert into tournament_participants (tournament_id, user_id, user_name, status)
    values (p_tournament_id, v_user, coalesce(v_name, 'Anônimo'), v_st)
    on conflict (tournament_id, user_id) do update
      set status = excluded.status,
          joined_at = now()
    returning * into v_row;

  return v_row;
end;
$$;

grant execute on function join_tournament(uuid) to authenticated;


-- leave_tournament (jogador desiste enquanto aberto)
create or replace function leave_tournament(p_tournament_id uuid)
returns void
language plpgsql
security definer
set search_path = public
as $$
declare
  v_user uuid := auth.uid();
  v_t tournaments;
begin
  if v_user is null then raise exception 'login required'; end if;
  select * into v_t from tournaments where id = p_tournament_id;
  if v_t.status <> 'open' then raise exception 'cannot leave after start'; end if;
  update tournament_participants set status = 'left'
   where tournament_id = p_tournament_id and user_id = v_user;
end;
$$;

grant execute on function leave_tournament(uuid) to authenticated;


-- set_participant_status (criador aprova/rejeita pendentes)
create or replace function set_participant_status(p_participant_id uuid, p_status participant_status)
returns tournament_participants
language plpgsql
security definer
set search_path = public
as $$
declare
  v_user uuid := auth.uid();
  v_p tournament_participants;
  v_t tournaments;
begin
  if v_user is null then raise exception 'login required'; end if;
  if p_status not in ('approved', 'rejected') then
    raise exception 'status must be approved or rejected';
  end if;
  select * into v_p from tournament_participants where id = p_participant_id;
  if v_p.id is null then raise exception 'participant not found'; end if;
  select * into v_t from tournaments where id = v_p.tournament_id;
  if v_t.creator_id <> v_user and not is_admin() then
    raise exception 'only creator can approve/reject';
  end if;
  update tournament_participants set status = p_status
   where id = p_participant_id
   returning * into v_p;
  return v_p;
end;
$$;

grant execute on function set_participant_status(uuid, participant_status) to authenticated;


-- get_tournament_participants
create or replace function get_tournament_participants(p_tournament_id uuid)
returns table (
  id uuid,
  user_id uuid,
  user_name text,
  status participant_status,
  joined_at timestamptz
)
language sql
stable
security definer
set search_path = public
as $$
  select id, user_id, user_name, status, joined_at
    from tournament_participants
   where tournament_id = p_tournament_id
   order by joined_at asc;
$$;

grant execute on function get_tournament_participants(uuid) to authenticated;


-- tournament_leaderboard (formato ranking AI)
-- Scores válidos = mesmo difficulty + dentro da janela + status='normal' (anti-cheat)
create or replace function tournament_leaderboard(p_tournament_id uuid)
returns table (
  user_id uuid,
  user_name text,
  wins int,
  best_seconds int
)
language plpgsql
stable
security definer
set search_path = public
as $$
declare v_t tournaments;
begin
  select * into v_t from tournaments where id = p_tournament_id;
  if v_t.id is null then raise exception 'tournament not found'; end if;
  if v_t.format <> 'ai' then raise exception 'leaderboard only for ai format'; end if;

  return query
  select p.user_id, p.user_name,
         coalesce(count(s.id)::int, 0) as wins,
         min(s.player_seconds)::int as best_seconds
    from tournament_participants p
    left join scores s
      on s.user_id = p.user_id
     and s.difficulty = v_t.difficulty
     and coalesce(s.status, 'normal') = 'normal'
     and s.created_at >= v_t.starts_at
     and s.created_at <= coalesce(v_t.ends_at, now())
   where p.tournament_id = p_tournament_id
     and p.status = 'approved'
   group by p.user_id, p.user_name
   order by
     case when v_t.criterion = 'most_wins' then 0 else 1 end,
     wins desc,
     best_seconds asc nulls last;
end;
$$;

grant execute on function tournament_leaderboard(uuid) to authenticated;


-- start_bracket_tournament (cria rodada 1 com pareamento aleatório)
create or replace function start_bracket_tournament(p_tournament_id uuid)
returns tournaments
language plpgsql
security definer
set search_path = public
as $$
declare
  v_user uuid := auth.uid();
  v_t tournaments;
  v_players uuid[];
  v_n int;
  v_i int := 1;
  v_pos int := 0;
  v_row tournaments;
begin
  if v_user is null then raise exception 'login required'; end if;
  select * into v_t from tournaments where id = p_tournament_id;
  if v_t.id is null then raise exception 'tournament not found'; end if;
  if v_t.creator_id <> v_user and not is_admin() then raise exception 'only creator'; end if;
  if v_t.format <> 'pvp_bracket' then raise exception 'not a bracket tournament'; end if;
  if v_t.status <> 'open' then raise exception 'tournament not open'; end if;

  select array_agg(user_id order by random()) into v_players
    from tournament_participants
   where tournament_id = p_tournament_id and status = 'approved';

  v_n := coalesce(array_length(v_players, 1), 0);
  if v_n < 2 then raise exception 'need at least 2 approved participants'; end if;

  while v_i <= v_n loop
    v_pos := v_pos + 1;
    insert into tournament_matches (
      tournament_id, round, slot, player1_id, player2_id, status, deadline_at,
      winner_id, finished_at
    ) values (
      p_tournament_id, 1, v_pos,
      v_players[v_i],
      case when v_i + 1 <= v_n then v_players[v_i + 1] else null end,
      case when v_i + 1 <= v_n then 'pending'::match_status else 'walkover'::match_status end,
      now() + (v_t.round_deadline_hours || ' hours')::interval,
      case when v_i + 1 > v_n then v_players[v_i] else null end,
      case when v_i + 1 > v_n then now() else null end
    );
    v_i := v_i + 2;
  end loop;

  update tournaments
     set status = 'active', current_round = 1
   where id = p_tournament_id
   returning * into v_row;

  return v_row;
end;
$$;

grant execute on function start_bracket_tournament(uuid) to authenticated;


-- record_match_result (jogador ou criador reporta resultado; avança bracket)
create or replace function record_match_result(
  p_match_id uuid,
  p_winner_id uuid,
  p_pgn text default null
)
returns tournament_matches
language plpgsql
security definer
set search_path = public
as $$
declare
  v_user uuid := auth.uid();
  v_m tournament_matches;
  v_t tournaments;
  v_total int;
  v_done int;
  v_winners uuid[];
  v_i int := 1;
  v_pos int := 0;
begin
  if v_user is null then raise exception 'login required'; end if;
  select * into v_m from tournament_matches where id = p_match_id;
  if v_m.id is null then raise exception 'match not found'; end if;
  if v_m.status = 'finished' or v_m.status = 'walkover' then
    raise exception 'match already finished';
  end if;
  if p_winner_id is null or p_winner_id not in (v_m.player1_id, v_m.player2_id) then
    raise exception 'winner must be one of the players';
  end if;

  select * into v_t from tournaments where id = v_m.tournament_id;
  if v_user not in (coalesce(v_m.player1_id, '00000000-0000-0000-0000-000000000000'::uuid),
                    coalesce(v_m.player2_id, '00000000-0000-0000-0000-000000000000'::uuid))
     and v_t.creator_id <> v_user
     and not is_admin() then
    raise exception 'not allowed';
  end if;

  update tournament_matches
     set winner_id = p_winner_id,
         game_pgn = p_pgn,
         status = 'finished',
         finished_at = now()
   where id = p_match_id
   returning * into v_m;

  -- Rodada terminou?
  select count(*) into v_total from tournament_matches
   where tournament_id = v_t.id and round = v_t.current_round;
  select count(*) into v_done from tournament_matches
   where tournament_id = v_t.id and round = v_t.current_round
     and status in ('finished', 'walkover');

  if v_total = v_done then
    if v_t.current_round >= v_t.total_rounds then
      update tournaments set status = 'finished' where id = v_t.id;
    else
      select array_agg(winner_id order by slot) into v_winners
        from tournament_matches
       where tournament_id = v_t.id and round = v_t.current_round;
      while v_i <= coalesce(array_length(v_winners, 1), 0) loop
        v_pos := v_pos + 1;
        insert into tournament_matches (
          tournament_id, round, slot, player1_id, player2_id, status, deadline_at
        ) values (
          v_t.id, v_t.current_round + 1, v_pos,
          v_winners[v_i],
          case when v_i + 1 <= array_length(v_winners, 1) then v_winners[v_i + 1] else null end,
          'pending',
          now() + (v_t.round_deadline_hours || ' hours')::interval
        );
        v_i := v_i + 2;
      end loop;
      update tournaments set current_round = current_round + 1 where id = v_t.id;
    end if;
  end if;

  return v_m;
end;
$$;

grant execute on function record_match_result(uuid, uuid, text) to authenticated;


-- get_tournament_matches
create or replace function get_tournament_matches(p_tournament_id uuid)
returns table (
  id uuid,
  round int,
  slot int,
  player1_id uuid,
  player1_name text,
  player2_id uuid,
  player2_name text,
  winner_id uuid,
  status match_status,
  deadline_at timestamptz,
  game_pgn text,
  finished_at timestamptz
)
language sql
stable
security definer
set search_path = public
as $$
  select m.id, m.round, m.slot,
         m.player1_id, p1.user_name,
         m.player2_id, p2.user_name,
         m.winner_id, m.status, m.deadline_at, m.game_pgn, m.finished_at
    from tournament_matches m
    left join tournament_participants p1
      on p1.tournament_id = m.tournament_id and p1.user_id = m.player1_id
    left join tournament_participants p2
      on p2.tournament_id = m.tournament_id and p2.user_id = m.player2_id
   where m.tournament_id = p_tournament_id
   order by m.round asc, m.slot asc;
$$;

grant execute on function get_tournament_matches(uuid) to authenticated;


-- finalize_ranking_tournament (encerra ranking AI manualmente)
create or replace function finalize_ranking_tournament(p_tournament_id uuid)
returns tournaments
language plpgsql
security definer
set search_path = public
as $$
declare
  v_user uuid := auth.uid();
  v_t tournaments;
  v_row tournaments;
begin
  if v_user is null then raise exception 'login required'; end if;
  select * into v_t from tournaments where id = p_tournament_id;
  if v_t.id is null then raise exception 'not found'; end if;
  if v_t.creator_id <> v_user and not is_admin() then raise exception 'only creator/admin'; end if;
  if v_t.format <> 'ai' then raise exception 'only ai format'; end if;
  update tournaments set status = 'finished' where id = p_tournament_id returning * into v_row;
  return v_row;
end;
$$;

grant execute on function finalize_ranking_tournament(uuid) to authenticated;


-- cancel_tournament
create or replace function cancel_tournament(p_tournament_id uuid)
returns tournaments
language plpgsql
security definer
set search_path = public
as $$
declare
  v_user uuid := auth.uid();
  v_t tournaments;
  v_row tournaments;
begin
  if v_user is null then raise exception 'login required'; end if;
  select * into v_t from tournaments where id = p_tournament_id;
  if v_t.id is null then raise exception 'not found'; end if;
  if v_t.creator_id <> v_user and not is_admin() then raise exception 'only creator/admin'; end if;
  update tournaments set status = 'cancelled'
   where id = p_tournament_id and status in ('open', 'active')
   returning * into v_row;
  return v_row;
end;
$$;

grant execute on function cancel_tournament(uuid) to authenticated;


-- =========================================================
-- ADMIN: lista torneios aguardando confirmação de pagamento
-- =========================================================
create or replace function admin_list_pending_tournaments()
returns table (
  id uuid,
  name text,
  creator_id uuid,
  creator_name text,
  prize_description text,
  format tournament_format,
  visibility tournament_visibility,
  capacity int,
  starts_at timestamptz,
  created_at timestamptz
)
language sql
stable
security definer
set search_path = public
as $$
  select id, name, creator_id, creator_name, prize_description,
         format, visibility, capacity, starts_at, created_at
    from tournaments
   where is_admin()
     and paid = false
     and status = 'open'
   order by created_at desc;
$$;

grant execute on function admin_list_pending_tournaments() to authenticated;

-- =========================================================
-- FIM
-- =========================================================
