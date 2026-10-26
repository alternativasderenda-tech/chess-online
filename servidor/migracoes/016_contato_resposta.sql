-- Resposta pelo painel (D-CON-08, 26/10/2026): o admin escreve no /admin, o tempo real confere que é admin, envia pelo
-- SMTP do servidor (remetente contato@xadrezonline.app) e grava cada resposta em xadrez_rt.contato_resposta (schema
-- PRIVADO). O registro nasce 'enviando' ANTES do envio e vira 'enviada' ou 'falhou' depois: um envio interrompido no
-- meio fica visível, nunca some. Enviada = a mensagem vira 'respondida'. Admin lê o histórico por admin_contato_respostas.
-- Idempotente.
BEGIN;
SET ROLE xadrez_owner;

CREATE TABLE IF NOT EXISTS xadrez_rt.contato_resposta (
  id           uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  contato_id   uuid NOT NULL REFERENCES xadrez_rt.contato(id) ON DELETE CASCADE,
  criado_em    timestamptz NOT NULL DEFAULT now(),
  autor        uuid REFERENCES auth.users(id) ON DELETE SET NULL,
  para         text NOT NULL CHECK (length(para) BETWEEN 3 AND 254),
  texto        text NOT NULL CHECK (length(texto) BETWEEN 1 AND 8000),
  situacao     text NOT NULL DEFAULT 'enviando' CHECK (situacao IN ('enviando','enviada','falhou')),
  enviada_em   timestamptz,
  erro         text CHECK (erro IS NULL OR length(erro) <= 300)
);
CREATE INDEX IF NOT EXISTS contato_resposta_contato ON xadrez_rt.contato_resposta (contato_id, criado_em);
CREATE INDEX IF NOT EXISTS contato_resposta_criado ON xadrez_rt.contato_resposta (criado_em DESC);
REVOKE ALL ON xadrez_rt.contato_resposta FROM PUBLIC, anon, authenticated, service_role;

-- início: só o server.js (papel xadrez_rt) chama, DEPOIS de conferir que o autor é admin. Devolve os dados da mensagem
-- para montar o e-mail. Limite: 60 respostas/h no total (um token de admin vazado não vira disparador de e-mail).
CREATE OR REPLACE FUNCTION xadrez_rt.contato_resposta_iniciar(p_contato uuid, p_autor uuid, p_texto text) RETURNS jsonb
LANGUAGE plpgsql SECURITY DEFINER SET search_path = public AS $f$
DECLARE c xadrez_rt.contato; v_id uuid;
BEGIN
  PERFORM pg_advisory_xact_lock(hashtext('xadrez_rt.contato_resposta'));
  IF p_texto IS NULL OR length(btrim(p_texto)) = 0 OR length(p_texto) > 8000 THEN RETURN jsonb_build_object('erro', 'texto'); END IF;
  SELECT * INTO c FROM xadrez_rt.contato WHERE id = p_contato;
  IF NOT FOUND THEN RETURN jsonb_build_object('erro', 'nao_encontrada'); END IF;
  IF (SELECT count(*) FROM xadrez_rt.contato_resposta WHERE criado_em > now() - interval '1 hour') >= 60 THEN
    RETURN jsonb_build_object('erro', 'limite');
  END IF;
  INSERT INTO xadrez_rt.contato_resposta (contato_id, autor, para, texto)
  VALUES (c.id, CASE WHEN EXISTS (SELECT 1 FROM auth.users WHERE id = p_autor) THEN p_autor END, c.email, p_texto)
  RETURNING id INTO v_id;
  RETURN jsonb_build_object('id', v_id, 'nome', c.nome, 'email', c.email, 'assunto', c.assunto, 'mensagem', c.mensagem,
                            'idioma', c.idioma, 'criado_em', c.criado_em);
END $f$;
REVOKE EXECUTE ON FUNCTION xadrez_rt.contato_resposta_iniciar(uuid, uuid, text) FROM PUBLIC, anon, authenticated, service_role;
GRANT EXECUTE ON FUNCTION xadrez_rt.contato_resposta_iniciar(uuid, uuid, text) TO xadrez_rt;

-- fim: grava o resultado do envio; enviada → a mensagem passa a 'respondida' (spam continua spam)
CREATE OR REPLACE FUNCTION xadrez_rt.contato_resposta_concluir(p_id uuid, p_ok boolean, p_erro text) RETURNS void
LANGUAGE plpgsql SECURITY DEFINER SET search_path = public AS $f$
DECLARE v_contato uuid;
BEGIN
  UPDATE xadrez_rt.contato_resposta
     SET situacao = CASE WHEN p_ok THEN 'enviada' ELSE 'falhou' END,
         enviada_em = CASE WHEN p_ok THEN now() END,
         erro = CASE WHEN p_ok THEN NULL ELSE left(p_erro, 300) END
   WHERE id = p_id AND situacao = 'enviando'
  RETURNING contato_id INTO v_contato;
  IF p_ok AND v_contato IS NOT NULL THEN
    UPDATE xadrez_rt.contato SET status = 'respondida', respondida_em = coalesce(respondida_em, now())
     WHERE id = v_contato AND status = 'nova';
  END IF;
END $f$;
REVOKE EXECUTE ON FUNCTION xadrez_rt.contato_resposta_concluir(uuid, boolean, text) FROM PUBLIC, anon, authenticated, service_role;
GRANT EXECUTE ON FUNCTION xadrez_rt.contato_resposta_concluir(uuid, boolean, text) TO xadrez_rt;

-- admin: histórico de respostas (o painel junta às mensagens pelo contato_id). Quem não é admin recebe lista vazia.
CREATE OR REPLACE FUNCTION public.admin_contato_respostas()
RETURNS TABLE(id uuid, contato_id uuid, criado_em timestamptz, autor_email text, para text, texto text, situacao text,
  enviada_em timestamptz, erro text)
LANGUAGE sql STABLE SECURITY DEFINER SET search_path = public AS $f$
  SELECT r.id, r.contato_id, r.criado_em, u.email::text, r.para, r.texto, r.situacao, r.enviada_em, r.erro
    FROM xadrez_rt.contato_resposta r LEFT JOIN auth.users u ON u.id = r.autor
   WHERE is_admin()
   ORDER BY r.criado_em
   LIMIT 3000;
$f$;

RESET ROLE;
COMMIT;
