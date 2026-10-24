-- O dono das tabelas e das funções do xadrez (xadrez_owner) precisa ler auth.users (nome de quem cria/se inscreve).
-- auth.users tem RLS ligado (migração do GoTrue) e o xadrez_owner não passava por ela: xadrez_rt.nome() e as funções
-- antigas caíam em 'Jogador'/'Anônimo'. No Supabase o dono equivalente (postgres) tem BYPASSRLS. xadrez_owner é
-- NOLOGIN: só age dentro das funções SECURITY DEFINER. Achado pela revisão da página de torneios (24/10/2026).
ALTER ROLE xadrez_owner BYPASSRLS;
