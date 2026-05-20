-- =========================================================
-- Replay: grava lances da IA + ranking_fastest com session_id
-- Roda no Supabase Dashboard → SQL Editor
-- =========================================================
-- Pra permitir replay completo de partidas vs IA, agora gravamos
-- TAMBEM os lances da IA em ai_game_moves (antes so' os do
-- jogador). Coluna is_ai_move distingue os dois.
--
-- O anti-cheat (register_ai_score) continua usando SO os lances
-- do jogador (is_ai_move = false) pros calculos de timing.

-- 1) Nova coluna: distingue lance do jogador (false) do da IA (true)
alter table ai_game_moves add column if not exists is_ai_move boolean default false;

-- 2) register_ai_score: filtra is_ai_move = false nos calculos de
--    anti-cheat (variancia e contagem de lances do jogador)
create or replace function register_ai_score(
  p_session_id text,
  p_difficulty smallint,
  p_username text,
  p_client_mouse_movements int default 0,
  p_client_drag_count int default 0,
  p_client_click_count int default 0,
  p_client_idle_periods int default 0,
  p_client_keyboard_events int default 0,
  p_client_undo_count int default 0,
  p_client_validated boolean default false,
  p_client_player_seconds int default null
)
returns jsonb
language plpgsql
security definer
set search_path = public
as $$
declare
  v_user_id uuid := auth.uid();
  v_first_ts timestamptz;
  v_last_ts timestamptz;
  v_move_count int;
  v_total_ms bigint;
  v_player_seconds int;
  v_variance_ms int;
  v_suspicion int := 0;
  v_status text := 'normal';
  v_inserted_id uuid;
  v_existing_id uuid;
  v_baseline_count int;
  v_baseline_avg_sec numeric;
  v_baseline_avg_mouse numeric;
  v_baseline_avg_variance numeric;
begin
  if v_user_id is null then
    raise exception 'authentication required';
  end if;

  select id into v_existing_id
  from scores
  where session_id = p_session_id
  limit 1;

  if v_existing_id is not null then
    return jsonb_build_object(
      'success', true,
      'score_id', v_existing_id,
      'idempotent', true,
      'message', 'score already registered for this session'
    );
  end if;

  if p_difficulty < 1 or p_difficulty > 4 then
    raise exception 'invalid difficulty: %', p_difficulty;
  end if;

  -- Range temporal: min/max de TODOS os lances (jogo completo)
  -- Contagem: SO' os lances do jogador (anti-cheat foi calibrado assim)
  select min(created_at), max(created_at),
         count(*) filter (where is_ai_move = false)
    into v_first_ts, v_last_ts, v_move_count
  from ai_game_moves
  where session_id = p_session_id and user_id = v_user_id;

  if v_move_count is null or v_move_count = 0 then
    raise exception 'no moves found for session %', p_session_id;
  end if;

  v_total_ms := (extract(epoch from (v_last_ts - v_first_ts)) * 1000)::bigint;
  v_player_seconds := greatest(1, (v_total_ms / 1000)::int);

  if p_client_validated then
    if p_client_player_seconds is not null and p_client_player_seconds > 0 then
      v_player_seconds := p_client_player_seconds;
      v_total_ms := p_client_player_seconds::bigint * 1000;
    end if;
  else
    if p_client_player_seconds is not null
       and p_client_player_seconds > 0
       and p_client_player_seconds <= (v_total_ms / 1000 + 5) then
      v_player_seconds := p_client_player_seconds;
    end if;
  end if;

  -- Variancia: gaps entre lances CONSECUTIVOS DO JOGADOR (ignora IA)
  with player_moves as (
    select created_at, move_number
    from ai_game_moves
    where session_id = p_session_id and user_id = v_user_id
      and is_ai_move = false
  ),
  intervals as (
    select extract(epoch from (created_at - lag(created_at) over (order by move_number))) * 1000 as gap_ms
    from player_moves
  )
  select coalesce(stddev_pop(gap_ms), 0)::int into v_variance_ms
  from intervals
  where gap_ms is not null;

  if not p_client_validated then
    if v_move_count >= 10 and v_variance_ms < 1500 then v_suspicion := v_suspicion + 3;
    elsif v_move_count >= 10 and v_variance_ms < 3000 then v_suspicion := v_suspicion + 1;
    end if;
    if v_move_count >= 15 and v_total_ms > 0
       and (v_move_count::float / (v_total_ms::float / 60000.0)) > 30 then
      v_suspicion := v_suspicion + 2;
    end if;
  else
    v_suspicion := v_suspicion + 1;
  end if;

  if v_move_count >= 15 then
    if p_client_mouse_movements < 30 then v_suspicion := v_suspicion + 3;
    elsif p_client_mouse_movements < 100 then v_suspicion := v_suspicion + 1;
    end if;
    if p_client_idle_periods = 0 then v_suspicion := v_suspicion + 2; end if;
  end if;
  if v_move_count >= 25 then
    if p_client_drag_count = 0 then v_suspicion := v_suspicion + 1; end if;
    if p_client_keyboard_events = 0 then v_suspicion := v_suspicion + 1; end if;
    if p_client_undo_count = 0 then v_suspicion := v_suspicion + 2; end if;
  end if;

  if p_difficulty = 4 then
    select
      count(*),
      avg(player_seconds),
      avg(coalesce(mouse_movements, 0)) filter (where mouse_movements is not null),
      avg(coalesce(move_time_variance_ms, 0)) filter (where move_time_variance_ms is not null)
    into
      v_baseline_count, v_baseline_avg_sec, v_baseline_avg_mouse, v_baseline_avg_variance
    from scores
    where user_id = v_user_id
      and difficulty < 4
      and (status = 'normal' or status is null)
      and player_seconds is not null;

    if v_baseline_count >= 3 then
      if v_baseline_avg_sec is not null and v_player_seconds < v_baseline_avg_sec then
        v_suspicion := v_suspicion + 3;
      end if;
      if v_baseline_avg_mouse is not null and v_baseline_avg_mouse > 100
         and p_client_mouse_movements < (v_baseline_avg_mouse * 0.4) then
        v_suspicion := v_suspicion + 2;
      end if;
      if v_baseline_avg_variance is not null and v_baseline_avg_variance > 3000
         and v_variance_ms < (v_baseline_avg_variance * 0.4) then
        v_suspicion := v_suspicion + 2;
      end if;
    elsif v_baseline_count = 0 then
      v_suspicion := v_suspicion + 2;
    end if;
  end if;

  if v_suspicion >= 5 then v_status := 'cheater'; end if;

  insert into scores (
    user_id, username, difficulty, player_seconds, session_id,
    status, suspicion_score, client_validated,
    mouse_movements, drag_count, click_count,
    idle_periods, keyboard_events, undo_count,
    move_time_variance_ms, total_game_ms
  ) values (
    v_user_id, p_username, p_difficulty, v_player_seconds, p_session_id,
    v_status, v_suspicion, p_client_validated,
    p_client_mouse_movements, p_client_drag_count, p_client_click_count,
    p_client_idle_periods, p_client_keyboard_events, p_client_undo_count,
    v_variance_ms, v_total_ms::int
  )
  returning id into v_inserted_id;

  return jsonb_build_object(
    'success', true,
    'score_id', v_inserted_id,
    'idempotent', false,
    'status', v_status,
    'suspicion_score', v_suspicion,
    'client_validated', p_client_validated,
    'server_total_ms', v_total_ms,
    'server_variance_ms', v_variance_ms,
    'server_move_count', v_move_count,
    'player_seconds', v_player_seconds
  );
end;
$$;

grant execute on function register_ai_score(text, smallint, text, int, int, int, int, int, int, boolean, int) to authenticated;

-- 3) ranking_fastest: agora retorna tambem o session_id da melhor
--    partida de cada usuario (pra permitir replay dela)
drop function if exists ranking_fastest(smallint, int);

create function ranking_fastest(
  p_difficulty smallint,
  p_limit int default 50
)
returns table (
  rank_pos bigint,
  username text,
  best_seconds int,
  user_id uuid,
  session_id text
)
language sql
stable
security definer
set search_path = public
as $$
  with ranked_games as (
    select
      s.user_id,
      s.username,
      s.player_seconds,
      s.session_id,
      row_number() over (partition by s.user_id order by s.player_seconds asc) as rn
    from scores s
    where s.difficulty = p_difficulty
  )
  select
    rank() over (order by g.player_seconds asc) as rank_pos,
    g.username,
    g.player_seconds as best_seconds,
    g.user_id,
    g.session_id
  from ranked_games g
  where g.rn = 1
  order by g.player_seconds asc
  limit p_limit;
$$;

grant execute on function ranking_fastest(smallint, int) to anon, authenticated;
