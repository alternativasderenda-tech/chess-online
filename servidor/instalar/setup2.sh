#!/bin/bash
# Xadrez no EC2 — etapa 2: configuração do GoTrue, migrações do schema auth, funções auth.* iguais às do Supabase de
# origem, papel dono (xadrez_owner), usuários (auth.users/identities) e o schema public com os dados. Não imprime segredos.
# Uso: setup2.sh <dir com public_completo.sql e auth_usuarios.sql>
set -euo pipefail
X=/opt/xadrez; D=$1
. $X/etc/segredos.env

# ---------- GoTrue: configuração sem segredo + wrapper que injeta os segredos
cat > $X/etc/gotrue.env <<'ENV'
GOTRUE_API_HOST=127.0.0.1
PORT=9999
API_EXTERNAL_URL=https://xadrezonline.app/auth/v1
GOTRUE_SITE_URL=https://xadrezonline.app
GOTRUE_URI_ALLOW_LIST=https://novo.xadrezonline.app/**,https://xadrezonline.app/**
GOTRUE_DB_DRIVER=postgres
GOTRUE_DB_NAMESPACE=auth
GOTRUE_DB_MIGRATIONS_PATH=/opt/xadrez/auth-migrations
GOTRUE_DB_MAX_POOL_SIZE=5
GOTRUE_JWT_EXP=3600
GOTRUE_JWT_AUD=authenticated
GOTRUE_JWT_DEFAULT_GROUP_NAME=authenticated
GOTRUE_JWT_ADMIN_ROLES=service_role
GOTRUE_DISABLE_SIGNUP=false
GOTRUE_EXTERNAL_EMAIL_ENABLED=false
GOTRUE_EXTERNAL_PHONE_ENABLED=false
GOTRUE_MAILER_AUTOCONFIRM=true
GOTRUE_EXTERNAL_GOOGLE_ENABLED=false
GOTRUE_LOG_LEVEL=info
ENV
chown root:xadrez $X/etc/gotrue.env; chmod 640 $X/etc/gotrue.env
cat > $X/bin/gotrue-run.sh <<'SH'
#!/bin/bash
# lê a configuração e os segredos (root:xadrez 640) e executa o GoTrue
set -a; . /opt/xadrez/etc/gotrue.env; . /opt/xadrez/etc/segredos.env
[ -f /opt/xadrez/etc/google.env ] && . /opt/xadrez/etc/google.env
set +a
export DATABASE_URL="postgres://supabase_auth_admin:${PG_AUTH_ADMIN}@127.0.0.1:5432/xadrez?search_path=auth&sslmode=disable"
export GOTRUE_JWT_SECRET="$JWT_SECRET"
exec /opt/xadrez/bin/gotrue "$@"
SH
chmod 755 $X/bin/gotrue-run.sh

# ---------- migrações do schema auth (como o usuário xadrez, que lê os segredos pelo grupo)
cd $X && sudo -u xadrez $X/bin/gotrue-run.sh migrate 2>&1 | tail -3

# ---------- funções auth.* exatamente como no Supabase de origem (leem request.jwt.claims, que o PostgREST 16 usa)
sudo -u postgres psql -X -q -v ON_ERROR_STOP=1 -d xadrez <<'SQL'
CREATE OR REPLACE FUNCTION auth.uid() RETURNS uuid LANGUAGE sql STABLE AS $f$
  select coalesce(nullif(current_setting('request.jwt.claim.sub', true), ''),
                  (nullif(current_setting('request.jwt.claims', true), '')::jsonb ->> 'sub'))::uuid $f$;
CREATE OR REPLACE FUNCTION auth.role() RETURNS text LANGUAGE sql STABLE AS $f$
  select coalesce(nullif(current_setting('request.jwt.claim.role', true), ''),
                  (nullif(current_setting('request.jwt.claims', true), '')::jsonb ->> 'role'))::text $f$;
CREATE OR REPLACE FUNCTION auth.email() RETURNS text LANGUAGE sql STABLE AS $f$
  select coalesce(nullif(current_setting('request.jwt.claim.email', true), ''),
                  (nullif(current_setting('request.jwt.claims', true), '')::jsonb ->> 'email'))::text $f$;
CREATE OR REPLACE FUNCTION auth.jwt() RETURNS jsonb LANGUAGE sql STABLE AS $f$
  select coalesce(nullif(current_setting('request.jwt.claim', true), ''),
                  nullif(current_setting('request.jwt.claims', true), ''))::jsonb $f$;
GRANT EXECUTE ON FUNCTION auth.uid(), auth.role(), auth.email(), auth.jwt() TO PUBLIC;
-- dono das tabelas do jogo (como o "postgres" do Supabase: não é superusuário)
DO $$ BEGIN
  IF NOT EXISTS (SELECT 1 FROM pg_roles WHERE rolname='xadrez_owner') THEN CREATE ROLE xadrez_owner NOLOGIN; END IF;
END $$;
ALTER SCHEMA public OWNER TO xadrez_owner;
GRANT USAGE ON SCHEMA auth TO xadrez_owner;
GRANT SELECT, REFERENCES ON auth.users TO xadrez_owner;
GRANT USAGE ON SCHEMA extensions TO xadrez_owner;
SQL

# ---------- usuários do login (5 contas Google) — só se ainda não importados
if [ "$(sudo -u postgres psql -X -At -d xadrez -c 'select count(*) from auth.users')" = "0" ]; then
  sudo -u postgres psql -X -q -v ON_ERROR_STOP=1 -d xadrez --single-transaction -f $D/auth_usuarios.sql
fi
sudo -u postgres psql -X -At -d xadrez -c "select 'usuarios', count(*) from auth.users" -c "select 'identidades', count(*) from auth.identities"

# ---------- schema public + dados, como xadrez_owner (só se ainda não restaurado)
if [ "$(sudo -u postgres psql -X -At -d xadrez -c "select count(*) from pg_tables where schemaname='public'")" = "0" ]; then
  sed -e '/^CREATE SCHEMA public;$/d' -e '/^COMMENT ON SCHEMA public /d' \
      -e '/FOR ROLE supabase_admin/d' -e 's/FOR ROLE postgres IN SCHEMA public/FOR ROLE xadrez_owner IN SCHEMA public/' \
      -e '/ TO supabase_admin;$/d' -e '/ TO dashboard_user;$/d' -e '/ OWNER TO /d' \
      $D/public_completo.sql > $D/public_restaurar.sql
  { echo 'SET ROLE xadrez_owner;'; cat $D/public_restaurar.sql; } | sudo -u postgres psql -X -q -v ON_ERROR_STOP=1 -d xadrez --single-transaction
fi
sudo -u postgres psql -X -At -F' | ' -d xadrez \
  -c "select 'games', count(*) from games" -c "select 'moves', count(*) from moves" -c "select 'scores', count(*) from scores" \
  -c "select 'ai_game_moves', count(*) from ai_game_moves" -c "select 'tournaments', count(*) from tournaments" \
  -c "select 'funcoes', count(*) from pg_proc p join pg_namespace n on n.oid=p.pronamespace where n.nspname='public'" \
  -c "select 'policies', count(*) from pg_policies where schemaname='public'"
echo "ETAPA2 OK"
