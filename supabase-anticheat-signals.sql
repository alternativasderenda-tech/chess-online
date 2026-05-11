-- =========================================================
-- Anti-cheat passive signals — Xadrez Online
-- Rode este SQL no Supabase Dashboard → SQL Editor
-- =========================================================

-- Adiciona colunas de comportamento e status na tabela scores
alter table scores
  add column if not exists status text not null default 'normal'
    check (status in ('normal', 'cheater')),
  add column if not exists mouse_movements int,
  add column if not exists drag_count int,
  add column if not exists click_count int,
  add column if not exists idle_periods int,
  add column if not exists move_time_variance_ms int,
  add column if not exists total_game_ms int,
  add column if not exists keyboard_events int,
  add column if not exists suspicion_score int;

-- Index pra consultas administrativas filtrando por status
create index if not exists idx_scores_status on scores(status);

-- Comentario explicativo das colunas
comment on column scores.status is 'Classificacao automatica: normal ou cheater (heuristica de comportamento)';
comment on column scores.mouse_movements is 'Total de eventos mousemove durante a partida';
comment on column scores.drag_count is 'Numero de movimentos feitos por drag & drop';
comment on column scores.click_count is 'Numero de movimentos feitos por click';
comment on column scores.idle_periods is 'Numero de intervalos >5s entre eventos (humano pausa, bot nao)';
comment on column scores.move_time_variance_ms is 'Desvio padrao do tempo entre lances (bot tem variancia baixa)';
comment on column scores.total_game_ms is 'Duracao total da partida';
comment on column scores.keyboard_events is 'Eventos de teclado (humano usa scroll, ESC, alt-tab)';
comment on column scores.suspicion_score is 'Pontuacao de suspeita (0 a 12). status=cheater se >=5';
