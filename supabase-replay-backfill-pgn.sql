-- =========================================================
-- Backfill de replay: partida-xadrez-20260515-FACIL-00.20.pgn
-- Roda no Supabase Dashboard -> SQL Editor
-- =========================================================
-- Jogo (do PGN):
--   1. e4 a5  2. Bb5 Nh6  3. d4 f6  4. Bxh6 gxh6  5. Qh5#  1-0
--   Brancas = Voce (jogador) / Pretas = Computador (IA)
--   Dificuldade Facil / Data 2026-05-15
--
-- Como o replay funciona: ele reconstroi o jogo a partir dos
-- lances em ai_game_moves (ordenados por move_number) e exige
-- pelo menos 1 lance da IA (is_ai_move = true). Partidas antigas
-- so' guardavam os 5 lances do jogador — por isso nao da' replay.
-- Este script regrava os 9 meios-lances completos.
--
-- O session_id nao esta no PGN. Como essa partida e' a 1a colocada
-- do ranking Facil (jogador "Ogaiht"), o bloco abaixo acha o score
-- pegando a partida Facil MAIS RAPIDA do Ogaiht e regrava os
-- lances ligados a ele.
--
-- PRE-REQUISITO: supabase-replay.sql ja' precisa ter rodado
-- (cria a coluna is_ai_move e faz ranking_fastest devolver
-- session_id, necessario pro botao de replay aparecer).

do $$
declare
  v_session text;
  v_user    uuid;
  v_secs    int;
  v_uname   text;
  v_found   int;
begin
  -- Confere que existe exatamente 1 usuario "Ogaiht" em Facil.
  select count(distinct user_id) into v_found
  from scores
  where difficulty = 1 and username ilike '%ogaiht%';

  if v_found = 0 then
    raise exception
      'Nenhum score do "Ogaiht" em Facil. Confira o nome exato no ranking e ajuste o ilike.';
  elsif v_found > 1 then
    raise exception
      'Mais de um usuario com "Ogaiht" no nome — ambiguo. Rode: select distinct user_id, username from scores where difficulty=1 and username ilike ''%%ogaiht%%'';';
  end if;

  -- Pega a partida Facil mais rapida do Ogaiht = a do PGN (#1 do ranking).
  select session_id, user_id, player_seconds, username
    into v_session, v_user, v_secs, v_uname
  from scores
  where difficulty = 1 and username ilike '%ogaiht%'
  order by player_seconds asc
  limit 1;

  raise notice 'Partida de "%": session_id=% / player_seconds=%s', v_uname, v_session, v_secs;

  -- Limpa os lances antigos dessa session (jogos antigos so'
  -- tinham os 5 do jogador, com move_number 1..5).
  delete from ai_game_moves where session_id = v_session;

  -- Regrava os 9 meios-lances completos (jogador + IA).
  -- from_sq/to_sq sao indices 0..63: 0=a8, 63=h1, sq = (8-rank)*8 + file.
  insert into ai_game_moves
    (user_id, session_id, move_number, from_sq, to_sq, promotion, notation, difficulty, is_ai_move)
  values
    (v_user, v_session, 1, 52, 36, null, 'e4',   1, false),  -- 1. e4    (e2->e4)
    (v_user, v_session, 2,  8, 24, null, 'a5',   1, true),   -- 1... a5  (a7->a5)
    (v_user, v_session, 3, 61, 25, null, 'Bb5',  1, false),  -- 2. Bb5   (f1->b5)
    (v_user, v_session, 4,  6, 23, null, 'Nh6',  1, true),   -- 2... Nh6 (g8->h6)
    (v_user, v_session, 5, 51, 35, null, 'd4',   1, false),  -- 3. d4    (d2->d4)
    (v_user, v_session, 6, 13, 21, null, 'f6',   1, true),   -- 3... f6  (f7->f6)
    (v_user, v_session, 7, 58, 23, null, 'Bxh6', 1, false),  -- 4. Bxh6  (c1->h6, bispo de casa escura)
    (v_user, v_session, 8, 14, 23, null, 'gxh6', 1, true),   -- 4... gxh6(g7->h6)
    (v_user, v_session, 9, 59, 31, null, 'Qh5#', 1, false);  -- 5. Qh5#  (d1->h5)

  raise notice 'Backfill OK: 9 lances gravados para a session %.', v_session;
end $$;
