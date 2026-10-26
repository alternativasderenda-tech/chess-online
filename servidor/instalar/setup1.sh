#!/bin/bash
# Xadrez no EC2 — etapa 1: usuário Linux, binários (com sha256), segredos, banco `xadrez` e isolamento do energiadata.
# Idempotente. Não imprime segredos.
set -euo pipefail
X=/opt/xadrez
id xadrez >/dev/null 2>&1 || useradd --system --home-dir $X --shell /usr/sbin/nologin xadrez
install -d -o root -g root -m 755 $X $X/bin $X/site $X/realtime
install -d -o root -g xadrez -m 750 $X/etc

# ---------- binários (GoTrue v2.197.0 = a versão das migrações do Supabase de origem; PostgREST v16.5)
T=/var/tmp/xadrez-pkg; rm -rf $T; mkdir -p $T; cd $T
baixa() {  # repo tag asset destino
  curl -fsSL -m 300 -o "$4" "https://github.com/$1/releases/download/$2/$3"
  esperado=$(curl -fsSL -m 60 "https://api.github.com/repos/$1/releases/tags/$2" | python3 -c "
import json,sys
for a in json.load(sys.stdin)['assets']:
    if a['name']=='$3': print((a.get('digest') or '').replace('sha256:',''))")
  obtido=$(sha256sum "$4" | cut -d' ' -f1)
  if [ -z "$esperado" ]; then echo "AVISO: release sem digest para $3 (sha256 $obtido)"; elif [ "$esperado" != "$obtido" ]; then echo "ERRO: sha256 de $3 não confere"; exit 1; else echo "ok sha256 $3"; fi
}
baixa supabase/auth v2.197.0 auth-v2.197.0-x86.tar.gz auth.tar.gz
baixa PostgREST/postgrest v16.5 postgrest-v16.5-linux-static-x86-64.tar.xz postgrest.tar.xz
tar xzf auth.tar.gz; tar xJf postgrest.tar.xz
install -m 755 auth $X/bin/gotrue
install -m 755 postgrest $X/bin/postgrest
rm -rf $X/auth-migrations; cp -r migrations $X/auth-migrations; chmod -R a+rX $X/auth-migrations
$X/bin/postgrest --version | head -1
cd /; rm -rf $T

# ---------- segredos (gerados aqui; só root e o grupo xadrez leem)
S=$X/etc/segredos.env
if [ ! -f $S ]; then
  ( umask 077
    { echo "PG_AUTHENTICATOR=$(openssl rand -hex 24)"; echo "PG_AUTH_ADMIN=$(openssl rand -hex 24)";
      echo "PG_RT=$(openssl rand -hex 24)"; echo "JWT_SECRET=$(openssl rand -hex 32)"; } > $S )
  chown root:xadrez $S; chmod 640 $S; echo "segredos gerados"
fi
. $S

# ---------- papéis (globais no cluster; espelham o Supabase de origem) e o banco
sudo -u postgres psql -X -q -v ON_ERROR_STOP=1 <<SQL
DO \$\$ BEGIN
  IF NOT EXISTS (SELECT 1 FROM pg_roles WHERE rolname='anon') THEN CREATE ROLE anon NOLOGIN; END IF;
  IF NOT EXISTS (SELECT 1 FROM pg_roles WHERE rolname='authenticated') THEN CREATE ROLE authenticated NOLOGIN; END IF;
  IF NOT EXISTS (SELECT 1 FROM pg_roles WHERE rolname='service_role') THEN CREATE ROLE service_role NOLOGIN BYPASSRLS; END IF;
  IF NOT EXISTS (SELECT 1 FROM pg_roles WHERE rolname='authenticator') THEN CREATE ROLE authenticator LOGIN NOINHERIT; END IF;
  IF NOT EXISTS (SELECT 1 FROM pg_roles WHERE rolname='supabase_auth_admin') THEN CREATE ROLE supabase_auth_admin LOGIN NOINHERIT; END IF;
  IF NOT EXISTS (SELECT 1 FROM pg_roles WHERE rolname='xadrez_rt') THEN CREATE ROLE xadrez_rt LOGIN NOINHERIT; END IF;
END \$\$;
ALTER ROLE authenticator PASSWORD '$PG_AUTHENTICATOR' CONNECTION LIMIT 15;
ALTER ROLE supabase_auth_admin PASSWORD '$PG_AUTH_ADMIN' CONNECTION LIMIT 10;
ALTER ROLE xadrez_rt PASSWORD '$PG_RT' CONNECTION LIMIT 10;   # oficial + teste: até 4 cada (pool 3 + LISTEN)
GRANT anon, authenticated, service_role TO authenticator;
GRANT anon, authenticated TO xadrez_rt;
ALTER ROLE supabase_auth_admin SET search_path = auth;
SELECT 'CREATE DATABASE xadrez' WHERE NOT EXISTS (SELECT 1 FROM pg_database WHERE datname='xadrez') \gexec
SQL

sudo -u postgres psql -X -q -v ON_ERROR_STOP=1 -d xadrez <<'SQL'
REVOKE ALL ON DATABASE xadrez FROM PUBLIC;
GRANT CONNECT ON DATABASE xadrez TO authenticator, supabase_auth_admin, xadrez_rt;
GRANT CREATE ON DATABASE xadrez TO supabase_auth_admin;
CREATE SCHEMA IF NOT EXISTS auth AUTHORIZATION supabase_auth_admin;
GRANT USAGE ON SCHEMA auth TO anon, authenticated, service_role, postgres;
CREATE SCHEMA IF NOT EXISTS extensions;
CREATE EXTENSION IF NOT EXISTS pgcrypto WITH SCHEMA extensions;
CREATE EXTENSION IF NOT EXISTS "uuid-ossp" WITH SCHEMA extensions;
GRANT USAGE ON SCHEMA extensions TO anon, authenticated, service_role;
ALTER DATABASE xadrez SET search_path = "$user", public, extensions;
SQL

# ---------- isolamento: os papéis do xadrez não entram no banco do EnergiaWATT (nem no postgres)
H=/etc/postgresql/18/main/pg_hba.conf
if ! grep -q '^# xadrez: isolamento' $H; then
  cp -p $H $H.bak-xadrez-$(date +%Y%m%d%H%M)
  python3 - "$H" <<'PY'
import sys
p = sys.argv[1]
linhas = open(p).read().split('\n')
i = next(k for k, l in enumerate(linhas) if l.strip() and not l.lstrip().startswith('#'))
novas = ['# xadrez: isolamento — os papéis do xadrez nunca entram no banco do EnergiaWATT nem no postgres']
for db in ('energiadata', 'postgres'):
    for end in ('127.0.0.1/32', '::1/128'):
        novas.append(f'host    {db}    authenticator,supabase_auth_admin,xadrez_rt    {end}    reject')
    novas.append(f'local   {db}    authenticator,supabase_auth_admin,xadrez_rt    reject')
open(p, 'w').write('\n'.join(linhas[:i] + novas + linhas[i:]))
PY
  erros=$(sudo -u postgres psql -X -At -c "select count(*) from pg_hba_file_rules where error is not null")
  if [ "$erros" != "0" ]; then cp -p $(ls -t $H.bak-xadrez-* | head -1) $H; echo "ERRO no pg_hba: restaurado"; exit 1; fi
  systemctl reload postgresql
  echo "pg_hba: isolamento aplicado"
fi
sudo -u postgres psql -X -At -c "select datname from pg_database where datname='xadrez'"
echo "ETAPA1 OK"
