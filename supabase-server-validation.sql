-- =========================================================
-- Caminho 2: validacao server-side via timestamps reais
-- Rode no Supabase Dashboard → SQL Editor
-- =========================================================

-- Tabela que registra cada lance do jogador contra IA com
-- timestamp do servidor (untamperavel pelo client)
create table if not exists ai_game_moves (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users(id) on delete cascade,
  session_id text not null,
  move_number int not null,
  from_sq smallint not null,
  to_sq smallint not null,
  promotion text,
  notation text,
  difficulty smallint,
  created_at timestamptz default now()
);

create index if not exists idx_aigm_session on ai_game_moves(session_id, move_number);
create index if not exists idx_aigm_user_time on ai_game_moves(user_id, created_at);

alter table ai_game_moves enable row level security;

drop policy if exists "users read own ai moves" on ai_game_moves;
create policy "users read own ai moves"
  on ai_game_moves for select
  using (auth.uid() = user_id);

drop policy if exists "users insert own ai moves" on ai_game_moves;
create policy "users insert own ai moves"
  on ai_game_moves for insert
  with check (auth.uid() = user_id);

-- Adiciona session_id na tabela scores pra rastreabilidade
alter table scores add column if not exists session_id text;
create index if not exists idx_scores_session on scores(session_id);


-- =========================================================
-- Stored function: registra o score com validacao server-side
-- =========================================================
-- Aceita session_id + sinais client-side. Usa o DB pra calcular:
--   - total_game_ms (do min/max created_at dos lances)
--   - move_time_variance_ms (do desvio padrao dos intervalos)
--   - player_seconds (recomputado, nao confia no client)
-- Mistura com sinais do client (mouse, drag, click — tampperaveis)
-- pra computar suspicion_score e status.
--
-- Vantagem: bot nao consegue mentir sobre TIMING dos lances.
-- Pra falsificar tempo, teria que de fato esperar entre cada move.

create or replace function register_ai_score(
  p_session_id text,
  p_difficulty smallint,
  p_username text,
  p_client_mouse_movements int default 0,
  p_client_drag_count int default 0,
  p_client_click_count int default 0,
  p_client_idle_periods int default 0,
  p_client_keyboard_events int default 0
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
begin
  -- Auth obrigatorio
  if v_user_id is null then
    raise exception 'authentication required';
  end if;

  -- Valida dificuldade
  if p_difficulty < 1 or p_difficulty > 4 then
    raise exception 'invalid difficulty: %', p_difficulty;
  end if;

  -- Pega range temporal real da sessao a partir do DB
  select min(created_at), max(created_at), count(*)
    into v_first_ts, v_last_ts, v_move_count
  from ai_game_moves
  where session_id = p_session_id and user_id = v_user_id;

  -- Sem moves no DB pra essa session: trapaca obvia (cliente forjou)
  if v_move_count is null or v_move_count = 0 then
    raise exception 'no moves found for session %', p_session_id;
  end if;

  -- Calcula tempo total real
  v_total_ms := (extract(epoch from (v_last_ts - v_first_ts)) * 1000)::bigint;
  v_player_seconds := greatest(1, (v_total_ms / 1000)::int);

  -- Calcula variancia dos intervalos entre lances do jogador
  -- (em ms, usa desvio padrao populacional)
  with intervals as (
    select extract(epoch from (created_at - lag(created_at) over (order by move_number))) * 1000 as gap_ms
    from ai_game_moves
    where session_id = p_session_id and user_id = v_user_id
  )
  select coalesce(stddev_pop(gap_ms), 0)::int into v_variance_ms
  from intervals
  where gap_ms is not null;

  -- Heuristica de suspeita (mistura server-side com client)
  -- Server-side (untamperavel):
  if v_move_count >= 10 and v_variance_ms < 1500 then v_suspicion := v_suspicion + 3;
  elsif v_move_count >= 10 and v_variance_ms < 3000 then v_suspicion := v_suspicion + 1;
  end if;
  -- Velocidade absurda: >30 lances por minuto sustentados
  if v_move_count >= 15 and v_total_ms > 0
     and (v_move_count::float / (v_total_ms::float / 60000.0)) > 30 then
    v_suspicion := v_suspicion + 2;
  end if;

  -- Client-side (tamperavel mas ainda util):
  if v_move_count >= 15 then
    if p_client_mouse_movements < 30 then v_suspicion := v_suspicion + 3;
    elsif p_client_mouse_movements < 100 then v_suspicion := v_suspicion + 1;
    end if;
    if p_client_idle_periods = 0 then v_suspicion := v_suspicion + 2; end if;
  end if;
  if v_move_count >= 25 then
    if p_client_drag_count = 0 then v_suspicion := v_suspicion + 1; end if;
    if p_client_keyboard_events = 0 then v_suspicion := v_suspicion + 1; end if;
  end if;

  if v_suspicion >= 5 then v_status := 'cheater'; end if;

  -- Insere score com valores server-derived (timing) + client (mouse etc)
  insert into scores (
    user_id, username, difficulty, player_seconds, session_id,
    status, suspicion_score,
    mouse_movements, drag_count, click_count,
    idle_periods, keyboard_events,
    move_time_variance_ms, total_game_ms
  ) values (
    v_user_id, p_username, p_difficulty, v_player_seconds, p_session_id,
    v_status, v_suspicion,
    p_client_mouse_movements, p_client_drag_count, p_client_click_count,
    p_client_idle_periods, p_client_keyboard_events,
    v_variance_ms, v_total_ms::int
  )
  returning id into v_inserted_id;

  return jsonb_build_object(
    'success', true,
    'score_id', v_inserted_id,
    'status', v_status,
    'suspicion_score', v_suspicion,
    'server_total_ms', v_total_ms,
    'server_variance_ms', v_variance_ms,
    'server_move_count', v_move_count
  );
end;
$$;

-- Permite chamar a function por qualquer authenticated user
grant execute on function register_ai_score(text, smallint, text, int, int, int, int, int) to authenticated;
