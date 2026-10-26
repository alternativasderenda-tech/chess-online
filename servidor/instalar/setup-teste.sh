#!/bin/bash
# Ambiente de TESTE do xadrez (novo.xadrezonline.app): banco `xadrez_teste` (cópia do oficial), segredo de JWT próprio
# (token do teste não vale no oficial), GoTrue/PostgREST/tempo real próprios em outras portas, site em
# /opt/xadrez/site-teste. Mesmos papéis do banco (são do cluster). Idempotente; `--recriar-banco` refaz a cópia.
set -euo pipefail
X=/opt/xadrez
. $X/etc/segredos.env

# ---------- segredos do teste (JWT e chaves próprios)
T=$X/etc/teste.env
if [ ! -f $T ]; then
  ( umask 077; echo "JWT_SECRET=$(openssl rand -hex 32)" > $T )
  JWT_SECRET=$(grep '^JWT_SECRET=' $T | cut -d= -f2) node -e "
const c=require('crypto'); const s=process.env.JWT_SECRET; const now=Math.floor(Date.now()/1000);
const b=o=>Buffer.from(JSON.stringify(o)).toString('base64url');
const jwt=role=>{const h=b({alg:'HS256',typ:'JWT'}), p=b({iss:'xadrez-teste',role,iat:now,exp:now+10*365*86400}); return h+'.'+p+'.'+c.createHmac('sha256',s).update(h+'.'+p).digest('base64url');};
console.log('ANON_KEY='+jwt('anon')); console.log('SERVICE_KEY='+jwt('service_role'));" >> $T
  chown root:xadrez $T; chmod 640 $T; echo "segredos do teste gerados"
fi

# ---------- banco: cópia do oficial (dono e permissões preservados; papéis são do cluster)
existe=$(sudo -u postgres psql -X -At -c "select 1 from pg_database where datname='xadrez_teste'")
if [ "${1:-}" = "--recriar-banco" ] && [ "$existe" = "1" ]; then
  systemctl stop xadrez-teste-auth xadrez-teste-rest xadrez-teste-rt 2>/dev/null || true
  sudo -u postgres psql -X -q -c "DROP DATABASE xadrez_teste WITH (FORCE)"; existe=""
fi
if [ "$existe" != "1" ]; then
  sudo -u postgres psql -X -q -c "CREATE DATABASE xadrez_teste"
  sudo -u postgres pg_dump -d xadrez | sudo -u postgres psql -X -q -v ON_ERROR_STOP=1 -d xadrez_teste >/dev/null
  sudo -u postgres psql -X -q -d xadrez_teste <<'SQL'
REVOKE ALL ON DATABASE xadrez_teste FROM PUBLIC;
GRANT CONNECT ON DATABASE xadrez_teste TO authenticator, supabase_auth_admin, xadrez_rt;
ALTER DATABASE xadrez_teste SET search_path = "$user", public, extensions;
SQL
  echo "banco xadrez_teste copiado do oficial"
fi

# ---------- wrappers do teste
cat > $X/bin/teste-auth-run.sh <<'SH'
#!/bin/bash
set -a; . /opt/xadrez/etc/gotrue.env; . /opt/xadrez/etc/segredos.env
[ -f /opt/xadrez/etc/google.env ] && . /opt/xadrez/etc/google.env
. /opt/xadrez/etc/teste.env; set +a
export PORT=9909 API_EXTERNAL_URL=https://novo.xadrezonline.app/auth/v1 GOTRUE_SITE_URL=https://novo.xadrezonline.app
export GOTRUE_URI_ALLOW_LIST='https://novo.xadrezonline.app/**'
export GOTRUE_EXTERNAL_GOOGLE_REDIRECT_URI=https://novo.xadrezonline.app/auth/v1/callback
export DATABASE_URL="postgres://supabase_auth_admin:${PG_AUTH_ADMIN}@127.0.0.1:5432/xadrez_teste?search_path=auth&sslmode=disable"
export GOTRUE_JWT_SECRET="$JWT_SECRET"
exec /opt/xadrez/bin/gotrue serve
SH
cat > $X/bin/teste-rest-run.sh <<'SH'
#!/bin/bash
set -a; . /opt/xadrez/etc/segredos.env; . /opt/xadrez/etc/teste.env; set +a
export PGRST_DB_URI="postgres://authenticator:${PG_AUTHENTICATOR}@127.0.0.1:5432/xadrez_teste?sslmode=disable"
export PGRST_DB_SCHEMAS=public PGRST_DB_ANON_ROLE=anon PGRST_DB_EXTRA_SEARCH_PATH=public,extensions
export PGRST_JWT_SECRET="$JWT_SECRET" PGRST_DB_POOL=3 PGRST_SERVER_HOST=127.0.0.1 PGRST_SERVER_PORT=3211
export PGRST_DB_MAX_ROWS=5000 PGRST_LOG_LEVEL=warn
unset PG_AUTHENTICATOR PG_AUTH_ADMIN PG_RT JWT_SECRET SERVICE_KEY ANON_KEY
exec /opt/xadrez/bin/postgrest
SH
cat > $X/bin/teste-rt-run.sh <<'SH'
#!/bin/bash
set -a; . /opt/xadrez/etc/segredos.env; [ -f /opt/xadrez/etc/ga.env ] && . /opt/xadrez/etc/ga.env
. /opt/xadrez/etc/teste.env; set +a
[ -f /opt/xadrez/etc/mp-teste.env ] && { set -a; . /opt/xadrez/etc/mp-teste.env; set +a; }
[ -f /opt/xadrez/etc/smtp-teste.env ] && { set -a; . /opt/xadrez/etc/smtp-teste.env; set +a; }
export PORT=3212 PG_DB=xadrez_teste GA_SA_FILE=/opt/xadrez/etc/ga-sa.json AMBIENTE=teste PUBLIC_URL=https://novo.xadrezonline.app
unset PG_AUTHENTICATOR PG_AUTH_ADMIN SERVICE_KEY ANON_KEY
cd /opt/xadrez/realtime-teste && exec /usr/bin/node server.js
SH
chmod 755 $X/bin/teste-*-run.sh
# o tempo real do teste roda o código da pasta realtime-teste (o desenvolvimento entra aqui antes do oficial)
if [ ! -d $X/realtime-teste ]; then cp -a $X/realtime $X/realtime-teste; fi
if [ ! -d $X/site-teste ]; then cp -a $X/site $X/site-teste; fi

unidade() {  # nome descricao exec
  cat > /etc/systemd/system/$1.service <<U
[Unit]
Description=$2
After=network.target postgresql.service
[Service]
User=xadrez
Group=xadrez
WorkingDirectory=/opt/xadrez
ExecStart=$3
Restart=on-failure
RestartSec=3
MemoryMax=120M
MemoryHigh=100M
CPUQuota=40%
TasksMax=64
NoNewPrivileges=true
ProtectSystem=strict
ProtectHome=true
PrivateTmp=true
[Install]
WantedBy=multi-user.target
U
}
unidade xadrez-teste-auth "Xadrez TESTE: login" "/opt/xadrez/bin/teste-auth-run.sh"
unidade xadrez-teste-rest "Xadrez TESTE: API" "/opt/xadrez/bin/teste-rest-run.sh"
unidade xadrez-teste-rt "Xadrez TESTE: tempo real" "/opt/xadrez/bin/teste-rt-run.sh"
systemctl daemon-reload
systemctl enable --now xadrez-teste-auth xadrez-teste-rest xadrez-teste-rt >/dev/null 2>&1
systemctl restart xadrez-teste-auth xadrez-teste-rest xadrez-teste-rt
sleep 4; systemctl is-active xadrez-teste-auth xadrez-teste-rest xadrez-teste-rt
echo "TESTE OK"
