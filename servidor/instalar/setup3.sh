#!/bin/bash
# Xadrez no EC2 — etapa 3: chaves anon/service (JWT HS256 com o segredo do GoTrue), gatilho do tempo real, PostgREST,
# servidor de tempo real e os três serviços systemd com teto de memória/CPU. Testes locais no fim. Não imprime segredos.
# Uso: setup3.sh <dir com server.js>
set -euo pipefail
X=/opt/xadrez; D=$1
. $X/etc/segredos.env

# ---------- servidor de tempo real (ws + pg)
install -m 644 $D/server.js $X/realtime/server.js
cd $X/realtime
[ -f package.json ] || cat > package.json <<'J'
{ "name": "xadrez-realtime", "private": true, "type": "commonjs", "dependencies": {} }
J
npm install --omit=dev --no-audit --no-fund --loglevel=error ws@8.22.0 pg@8.23.1 >/dev/null
node -e "require('ws'); require('pg'); console.log('ws/pg ok')"

# ---------- chaves no padrão do Supabase (anon pública, service_role secreta), 10 anos
if ! grep -q '^ANON_KEY=' $X/etc/segredos.env; then
  JWT_SECRET="$JWT_SECRET" node -e "
const c=require('crypto'); const s=process.env.JWT_SECRET; const now=Math.floor(Date.now()/1000);
const b=o=>Buffer.from(JSON.stringify(o)).toString('base64url');
const jwt=role=>{const h=b({alg:'HS256',typ:'JWT'}), p=b({iss:'xadrez',role,iat:now,exp:now+10*365*86400}); return h+'.'+p+'.'+c.createHmac('sha256',s).update(h+'.'+p).digest('base64url');};
console.log('ANON_KEY='+jwt('anon')); console.log('SERVICE_KEY='+jwt('service_role'));" >> $X/etc/segredos.env
  echo "chaves geradas"
fi

# ---------- gatilho: lance novo e partida alterada avisam o tempo real (só tabela, operação e ids)
sudo -u postgres psql -X -q -v ON_ERROR_STOP=1 -d xadrez <<'SQL'
CREATE SCHEMA IF NOT EXISTS xadrez_rt AUTHORIZATION xadrez_owner;
REVOKE ALL ON SCHEMA xadrez_rt FROM PUBLIC;
SET ROLE xadrez_owner;
CREATE OR REPLACE FUNCTION xadrez_rt.avisar() RETURNS trigger LANGUAGE plpgsql AS $f$
BEGIN
  PERFORM pg_notify('xadrez_rt', json_build_object('t', TG_TABLE_NAME, 'op', TG_OP, 'id', to_jsonb(NEW) ->> 'id',
    'g', to_jsonb(NEW) ->> 'game_id')::text);
  RETURN NULL;
END $f$;
DROP TRIGGER IF EXISTS xadrez_rt_moves ON public.moves;
CREATE TRIGGER xadrez_rt_moves AFTER INSERT ON public.moves FOR EACH ROW EXECUTE FUNCTION xadrez_rt.avisar();
DROP TRIGGER IF EXISTS xadrez_rt_games ON public.games;
CREATE TRIGGER xadrez_rt_games AFTER UPDATE ON public.games FOR EACH ROW EXECUTE FUNCTION xadrez_rt.avisar();
SQL

# ---------- wrappers (segredos só no ambiente do processo)
cat > $X/bin/postgrest-run.sh <<'SH'
#!/bin/bash
set -a; . /opt/xadrez/etc/segredos.env; set +a
export PGRST_DB_URI="postgres://authenticator:${PG_AUTHENTICATOR}@127.0.0.1:5432/xadrez?sslmode=disable"
export PGRST_DB_SCHEMAS=public PGRST_DB_ANON_ROLE=anon PGRST_DB_EXTRA_SEARCH_PATH=public,extensions
export PGRST_JWT_SECRET="$JWT_SECRET" PGRST_DB_POOL=5 PGRST_SERVER_HOST=127.0.0.1 PGRST_SERVER_PORT=3201
export PGRST_DB_MAX_ROWS=5000 PGRST_LOG_LEVEL=warn
unset PG_AUTHENTICATOR PG_AUTH_ADMIN PG_RT JWT_SECRET SERVICE_KEY ANON_KEY
exec /opt/xadrez/bin/postgrest
SH
cat > $X/bin/realtime-run.sh <<'SH'
#!/bin/bash
set -a; . /opt/xadrez/etc/segredos.env; [ -f /opt/xadrez/etc/ga.env ] && . /opt/xadrez/etc/ga.env; set +a
[ -f /opt/xadrez/etc/mp.env ] && { set -a; . /opt/xadrez/etc/mp.env; set +a; }
export PORT=3202 GA_SA_FILE=/opt/xadrez/etc/ga-sa.json AMBIENTE=oficial PUBLIC_URL=https://xadrezonline.app
unset PG_AUTHENTICATOR PG_AUTH_ADMIN SERVICE_KEY ANON_KEY
cd /opt/xadrez/realtime && exec /usr/bin/node server.js
SH
chmod 755 $X/bin/postgrest-run.sh $X/bin/realtime-run.sh

# ---------- systemd: cada serviço com teto próprio (o EnergiaWATT não sente se o xadrez travar)
unidade() {  # nome descricao exec memoria
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
MemoryMax=$4
MemoryHigh=$5
CPUQuota=60%
TasksMax=64
NoNewPrivileges=true
ProtectSystem=strict
ProtectHome=true
PrivateTmp=true
[Install]
WantedBy=multi-user.target
U
}
unidade xadrez-auth "Xadrez: login (GoTrue v2.197.0)" "/opt/xadrez/bin/gotrue-run.sh serve" 160M 130M
unidade xadrez-rest "Xadrez: API (PostgREST v16.5)" "/opt/xadrez/bin/postgrest-run.sh" 160M 130M
unidade xadrez-rt "Xadrez: tempo real (websocket)" "/opt/xadrez/bin/realtime-run.sh" 160M 130M
systemctl daemon-reload
systemctl enable --now xadrez-auth xadrez-rest xadrez-rt >/dev/null 2>&1
systemctl restart xadrez-auth xadrez-rest xadrez-rt
sleep 4
systemctl is-active xadrez-auth xadrez-rest xadrez-rt

# ---------- testes locais
echo "auth: $(curl -s -m 5 http://127.0.0.1:9999/health | head -c 120)"
echo "rest scores: $(curl -s -m 5 -H "apikey: $ANON_KEY" -H "Authorization: Bearer $ANON_KEY" 'http://127.0.0.1:3201/scores?select=id&limit=2' | head -c 120)"
echo "rest games (anon nao ve): $(curl -s -m 5 -H "Authorization: Bearer $ANON_KEY" 'http://127.0.0.1:3201/games?select=id&limit=1' | head -c 60)"
echo "rest rpc ranking: $(curl -s -m 5 -X POST -H "Authorization: Bearer $ANON_KEY" -H 'Content-Type: application/json' -d '{}' 'http://127.0.0.1:3201/rpc/ranking_wins' | head -c 160)"
echo "rt: $(curl -s -m 5 http://127.0.0.1:3202/xrt/saude)"
ps -o rss=,comm= -u xadrez | awk '{printf "%s %d MB\n", $2, $1/1024}'
echo "ETAPA3 OK"
