-- Formulário de contato (D-CON-01…07, 26/10/2026): mensagens em xadrez_rt.contato (schema PRIVADO — o PostgREST não o
-- expõe), gravadas só pelo tempo real (papel xadrez_rt) por xadrez_rt.contato_gravar, que também aplica os limites
-- (por IP, por e-mail e geral, com trava para envios simultâneos). O IP nunca é guardado: só um HMAC com sal secreto,
-- apagado depois de 30 dias. Admin lê e marca pelas RPCs admin_contatos / admin_contato_marcar (conferem is_admin()).
-- Idempotente.
BEGIN;
SET ROLE xadrez_owner;

CREATE TABLE IF NOT EXISTS xadrez_rt.contato (
  id             uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  criado_em      timestamptz NOT NULL DEFAULT now(),
  nome           text NOT NULL CHECK (length(nome) BETWEEN 1 AND 100),
  email          text NOT NULL CHECK (length(email) BETWEEN 3 AND 254),
  assunto        text NOT NULL CHECK (assunto IN ('duvida','sugestao','problema','pagamento','parceria','outro')),
  mensagem       text NOT NULL CHECK (length(mensagem) BETWEEN 1 AND 4000),
  link           text CHECK (link IS NULL OR length(link) <= 500),
  user_id        uuid REFERENCES auth.users(id) ON DELETE SET NULL,
  ip_hash        text,                       -- HMAC-SHA256 do IP com sal secreto (nunca o IP); apagado após 30 dias
  idioma         text NOT NULL DEFAULT 'pt' CHECK (idioma IN ('pt','en')),
  status         text NOT NULL DEFAULT 'nova' CHECK (status IN ('nova','respondida','spam')),
  respondida_em  timestamptz,
  nota_admin     text CHECK (nota_admin IS NULL OR length(nota_admin) <= 2000)
);
CREATE INDEX IF NOT EXISTS contato_criado ON xadrez_rt.contato (criado_em DESC);
CREATE INDEX IF NOT EXISTS contato_ip ON xadrez_rt.contato (ip_hash, criado_em) WHERE ip_hash IS NOT NULL;
CREATE INDEX IF NOT EXISTS contato_email ON xadrez_rt.contato (lower(email), criado_em);
CREATE INDEX IF NOT EXISTS contato_status ON xadrez_rt.contato (status, criado_em DESC);
-- o privilégio padrão do xadrez_owner (herdado do Supabase) concede ALL a anon/authenticated: tirar, mesmo com o schema
-- fechado (defesa em profundidade). O tempo real não precisa da tabela: só da função abaixo.
REVOKE ALL ON xadrez_rt.contato FROM PUBLIC, anon, authenticated, service_role;

-- gravação: só o server.js (papel xadrez_rt) chama, depois de validar os campos, o honeypot e o tempo mínimo
CREATE OR REPLACE FUNCTION xadrez_rt.contato_gravar(p_nome text, p_email text, p_assunto text, p_mensagem text,
  p_link text, p_user uuid, p_ip_hash text, p_idioma text) RETURNS jsonb
LANGUAGE plpgsql SECURITY DEFINER SET search_path = public AS $f$
DECLARE v_id uuid;
BEGIN
  -- envios simultâneos não passam juntos pela contagem (D-CON-03)
  PERFORM pg_advisory_xact_lock(hashtext('xadrez_rt.contato'));
  IF (SELECT count(*) FROM xadrez_rt.contato WHERE criado_em > now() - interval '1 hour') >= 200 THEN
    RETURN jsonb_build_object('erro', 'limite_geral');
  END IF;
  IF p_ip_hash IS NOT NULL AND (SELECT count(*) FROM xadrez_rt.contato
       WHERE ip_hash = p_ip_hash AND criado_em > now() - interval '1 hour') >= 5 THEN
    RETURN jsonb_build_object('erro', 'limite_ip');
  END IF;
  IF (SELECT count(*) FROM xadrez_rt.contato WHERE lower(email) = lower(p_email) AND criado_em > now() - interval '1 hour') >= 3 THEN
    RETURN jsonb_build_object('erro', 'limite_email');
  END IF;
  INSERT INTO xadrez_rt.contato (nome, email, assunto, mensagem, link, user_id, ip_hash, idioma)
  VALUES (p_nome, p_email, p_assunto, p_mensagem, nullif(p_link, ''),
          CASE WHEN EXISTS (SELECT 1 FROM auth.users WHERE id = p_user) THEN p_user END, p_ip_hash, p_idioma)
  RETURNING id INTO v_id;
  -- o hash do IP só serve aos limites (1 h): some depois de 30 dias
  UPDATE xadrez_rt.contato SET ip_hash = NULL WHERE ip_hash IS NOT NULL AND criado_em < now() - interval '30 days';
  RETURN jsonb_build_object('id', v_id);
END $f$;
REVOKE EXECUTE ON FUNCTION xadrez_rt.contato_gravar(text, text, text, text, text, uuid, text, text) FROM PUBLIC, anon, authenticated, service_role;
GRANT EXECUTE ON FUNCTION xadrez_rt.contato_gravar(text, text, text, text, text, uuid, text, text) TO xadrez_rt;

-- admin: lista (novas primeiro). Quem não é admin recebe lista vazia.
CREATE OR REPLACE FUNCTION public.admin_contatos(p_status text DEFAULT NULL)
RETURNS TABLE(id uuid, criado_em timestamptz, nome text, email text, assunto text, mensagem text, link text,
  user_id uuid, conta_email text, idioma text, status text, respondida_em timestamptz, nota_admin text)
LANGUAGE sql STABLE SECURITY DEFINER SET search_path = public AS $f$
  SELECT c.id, c.criado_em, c.nome, c.email, c.assunto, c.mensagem, c.link, c.user_id, u.email::text, c.idioma, c.status,
         c.respondida_em, c.nota_admin
    FROM xadrez_rt.contato c LEFT JOIN auth.users u ON u.id = c.user_id
   WHERE is_admin() AND (p_status IS NULL OR c.status = p_status)
   ORDER BY (c.status = 'nova') DESC, c.criado_em DESC
   LIMIT 1000;
$f$;

-- admin: marca como respondida / spam / nova e grava a nota (p_status ou p_nota nulos = não mexe)
CREATE OR REPLACE FUNCTION public.admin_contato_marcar(p_id uuid, p_status text DEFAULT NULL, p_nota text DEFAULT NULL)
RETURNS text LANGUAGE plpgsql SECURITY DEFINER SET search_path = public AS $f$
DECLARE v_status text;
BEGIN
  IF NOT is_admin() THEN RAISE EXCEPTION 'admin only'; END IF;
  IF p_status IS NOT NULL AND p_status NOT IN ('nova','respondida','spam') THEN RAISE EXCEPTION 'invalid status'; END IF;
  UPDATE xadrez_rt.contato SET
         status = coalesce(p_status, status),
         respondida_em = CASE WHEN p_status = 'respondida' THEN coalesce(respondida_em, now())
                              WHEN p_status = 'nova' THEN NULL ELSE respondida_em END,
         nota_admin = CASE WHEN p_nota IS NULL THEN nota_admin ELSE nullif(left(btrim(p_nota), 2000), '') END
   WHERE id = p_id
  RETURNING status INTO v_status;
  IF v_status IS NULL THEN RAISE EXCEPTION 'not found'; END IF;
  RETURN v_status;
END $f$;

RESET ROLE;
COMMIT;
