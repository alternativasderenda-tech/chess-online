-- =========================================================
-- Anti-cheat v2: comparacao intra-usuario + undo tracking
-- Roda no Supabase Dashboard → SQL Editor
-- =========================================================

-- Nova coluna: contagem de undo (botao Desfazer)
alter table scores add column if not exists undo_count int;

-- Atualiza a function register_ai_score com nova heuristica:
-- compara o score atual com o historico do usuario nos niveis
-- menores. Ideia: humano demora MAIS no Expert que no Dificil.
-- Quem inverte (mais rapido no Expert) e' bot.

create or replace function register_ai_score(
  p_session_id text,
  p_difficulty smallint,
  p_username text,
  p_client_mouse_movements int default 0,
  p_client_drag_count int default 0,
  p_client_click_count int default 0,
  p_client_idle_periods int default 0,
  p_client_keyboard_events int default 0,
  p_client_undo_count int default 0
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
  v_baseline_count int;
  v_baseline_avg_sec numeric;
  v_baseline_avg_mouse numeric;
  v_baseline_avg_variance numeric;
begin
  if v_user_id is null then
    raise exception 'authentication required';
  end if;

  if p_difficulty < 1 or p_difficulty > 4 then
    raise exception 'invalid difficulty: %', p_difficulty;
  end if;

  -- Range temporal real da sessao
  select min(created_at), max(created_at), count(*)
    into v_first_ts, v_last_ts, v_move_count
  from ai_game_moves
  where session_id = p_session_id and user_id = v_user_id;

  if v_move_count is null or v_move_count = 0 then
    raise exception 'no moves found for session %', p_session_id;
  end if;

  v_total_ms := (extract(epoch from (v_last_ts - v_first_ts)) * 1000)::bigint;
  v_player_seconds := greatest(1, (v_total_ms / 1000)::int);

  -- Variancia dos intervalos entre lances
  with intervals as (
    select extract(epoch from (created_at - lag(created_at) over (order by move_number))) * 1000 as gap_ms
    from ai_game_moves
    where session_id = p_session_id and user_id = v_user_id
  )
  select coalesce(stddev_pop(gap_ms), 0)::int into v_variance_ms
  from intervals
  where gap_ms is not null;

  -- ============== HEURISTICAS BASE (server + client) ==============

  -- Server-side timing (untamperavel):
  if v_move_count >= 10 and v_variance_ms < 1500 then v_suspicion := v_suspicion + 3;
  elsif v_move_count >= 10 and v_variance_ms < 3000 then v_suspicion := v_suspicion + 1;
  end if;
  if v_move_count >= 15 and v_total_ms > 0
     and (v_move_count::float / (v_total_ms::float / 60000.0)) > 30 then
    v_suspicion := v_suspicion + 2;
  end if;

  -- Client-side (tamperavel):
  if v_move_count >= 15 then
    if p_client_mouse_movements < 30 then v_suspicion := v_suspicion + 3;
    elsif p_client_mouse_movements < 100 then v_suspicion := v_suspicion + 1;
    end if;
    if p_client_idle_periods = 0 then v_suspicion := v_suspicion + 2; end if;
  end if;
  if v_move_count >= 25 then
    if p_client_drag_count = 0 then v_suspicion := v_suspicion + 1; end if;
    if p_client_keyboard_events = 0 then v_suspicion := v_suspicion + 1; end if;
    -- Humano normalmente clica em Desfazer pelo menos uma vez por partida longa
    if p_client_undo_count = 0 then v_suspicion := v_suspicion + 2; end if;
  end if;

  -- ============== NOVO: COMPARACAO INTRA-USUARIO ==============
  -- Aplica apenas ao Expert (dificuldade 4). Usa as outras dificuldades
  -- ja registradas pelo usuario como baseline humano.
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
      and difficulty < 4              -- so niveis menores
      and (status = 'normal' or status is null)  -- inclui scores antigos sem status
      and player_seconds is not null;

    if v_baseline_count >= 3 then
      -- Expert mais rapido que media dos niveis menores: ALTAMENTE suspeito
      -- (humano demora mais no nivel dificil, nao menos)
      if v_baseline_avg_sec is not null and v_player_seconds < v_baseline_avg_sec then
        v_suspicion := v_suspicion + 3;
      end if;
      -- Mouse no Expert muito menor que media nos outros niveis
      if v_baseline_avg_mouse is not null and v_baseline_avg_mouse > 100
         and p_client_mouse_movements < (v_baseline_avg_mouse * 0.4) then
        v_suspicion := v_suspicion + 2;
      end if;
      -- Variancia muito mais baixa que historico: mudou de cadencia (bot?)
      if v_baseline_avg_variance is not null and v_baseline_avg_variance > 3000
         and v_variance_ms < (v_baseline_avg_variance * 0.4) then
        v_suspicion := v_suspicion + 2;
      end if;
    elsif v_baseline_count = 0 then
      -- Usuario nunca ganhou nivel menor mas ja' esta no Expert: leve suspeita
      -- (jogador real teria pelo menos 1 vitoria em nivel mais facil)
      v_suspicion := v_suspicion + 2;
    end if;
  end if;

  if v_suspicion >= 5 then v_status := 'cheater'; end if;

  insert into scores (
    user_id, username, difficulty, player_seconds, session_id,
    status, suspicion_score,
    mouse_movements, drag_count, click_count,
    idle_periods, keyboard_events, undo_count,
    move_time_variance_ms, total_game_ms
  ) values (
    v_user_id, p_username, p_difficulty, v_player_seconds, p_session_id,
    v_status, v_suspicion,
    p_client_mouse_movements, p_client_drag_count, p_client_click_count,
    p_client_idle_periods, p_client_keyboard_events, p_client_undo_count,
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
    'server_move_count', v_move_count,
    'baseline_count', v_baseline_count,
    'baseline_avg_sec', v_baseline_avg_sec
  );
end;
$$;

grant execute on function register_ai_score(text, smallint, text, int, int, int, int, int, int) to authenticated;


-- =========================================================
-- BONUS: reclassificar scores antigos baseado no novo criterio
-- =========================================================
-- Roda isso UMA VEZ pra atualizar status de scores Expert ja
-- existentes usando a nova heuristica intra-usuario.

with user_baselines as (
  select
    user_id,
    count(*) as baseline_count,
    avg(player_seconds) as baseline_avg_sec
  from scores
  where difficulty < 4
    and player_seconds is not null
    and (status = 'normal' or status is null)
  group by user_id
)
update scores s
set status = case
    when (
      -- usuario tem 3+ vitorias em niveis menores e Expert e' mais rapido
      coalesce(ub.baseline_count, 0) >= 3
      and s.player_seconds < ub.baseline_avg_sec
    ) then 'cheater'
    when (
      -- usuario nunca ganhou nivel menor mas tem Expert
      coalesce(ub.baseline_count, 0) = 0
    ) then 'cheater'
    else coalesce(s.status, 'normal')
  end,
  suspicion_score = coalesce(s.suspicion_score, 0) + case
    when coalesce(ub.baseline_count, 0) >= 3 and s.player_seconds < ub.baseline_avg_sec then 3
    when coalesce(ub.baseline_count, 0) = 0 then 2
    else 0
  end
from user_baselines ub
where s.difficulty = 4
  and s.user_id = ub.user_id;
