#!/bin/bash
# Publica o lado servidor do xadrez: migrações pendentes (servidor/migracoes/NNN_*.sql, registradas em
# xadrez_rt.migracoes), o tempo real (servidor/realtime) e o motor (servidor/motor), e reinicia só o serviço do ambiente.
#   bash servidor/publicar-servidor.sh teste     → banco xadrez_teste, /opt/xadrez/realtime-teste, xadrez-teste-rt
#   bash servidor/publicar-servidor.sh oficial   → banco xadrez,       /opt/xadrez/realtime,       xadrez-rt
# Antes do oficial: rodar o teste do motor e publicar/testar no ambiente de teste.
set -euo pipefail
AMB=${1:-}; case "$AMB" in
  teste)   DB=xadrez_teste; DIR=/opt/xadrez/realtime-teste; SVC=xadrez-teste-rt; PORTA=3212 ;;
  oficial) DB=xadrez;       DIR=/opt/xadrez/realtime;       SVC=xadrez-rt;       PORTA=3202 ;;
  *) echo "uso: publicar-servidor.sh teste|oficial"; exit 2 ;; esac
PERFIL=ew-prod; REGIAO=sa-east-1; INSTANCIA=i-0ea7b1e475c5a590b; BUCKET=energiawatt-backups-801664113979
cd "$(git rev-parse --show-toplevel)"
node servidor/motor/extrair.js --conferir
if [ "$AMB" = oficial ] && [ -n "$(git status --porcelain -- servidor)" ]; then echo "servidor/ tem alterações sem commit"; exit 1; fi
timeout 30 aws sts get-caller-identity --profile $PERFIL --region $REGIAO >/dev/null || { echo "rode: aws login --profile $PERFIL --region $REGIAO"; exit 1; }
REV=$(git rev-parse --short HEAD)
TMP=$(mktemp -d)
mkdir -p "$TMP/p/realtime/motor" "$TMP/p/migracoes"
cp servidor/realtime/server.js servidor/realtime/conferidor.js servidor/realtime/package.json "$TMP/p/realtime/"
cp servidor/motor/xadrez.js servidor/motor/motor-gerado.js "$TMP/p/realtime/motor/"
cp servidor/migracoes/*.sql "$TMP/p/migracoes/"
tar czf "$TMP/s.tgz" -C "$TMP/p" .
aws s3 cp "$TMP/s.tgz" "s3://$BUCKET/xadrez/servidor_$REV.tgz" --profile $PERFIL --region $REGIAO --only-show-errors
rm -rf "$TMP"
CMD="set -e; T=/var/tmp/xsrv; rm -rf \$T; mkdir -p \$T; aws s3 cp s3://$BUCKET/xadrez/servidor_$REV.tgz \$T/s.tgz --region $REGIAO --only-show-errors;
tar xzf \$T/s.tgz -C \$T; chmod -R a+rX \$T;
sudo -u postgres psql -X -q -d $DB -c 'CREATE SCHEMA IF NOT EXISTS xadrez_rt; CREATE TABLE IF NOT EXISTS xadrez_rt.migracoes (nome text PRIMARY KEY, aplicada_em timestamptz NOT NULL DEFAULT now())';
for f in \$(ls \$T/migracoes/*.sql | sort); do n=\$(basename \$f);
  if [ -z \"\$(sudo -u postgres psql -X -At -d $DB -c \"select 1 from xadrez_rt.migracoes where nome='\$n'\")\" ]; then
    sudo -u postgres psql -X -q -v ON_ERROR_STOP=1 -d $DB -f \$f 2>&1 | grep -v NOTICE || true;
    sudo -u postgres psql -X -q -v ON_ERROR_STOP=1 -d $DB -c \"insert into xadrez_rt.migracoes (nome) values ('\$n')\"; echo migracao \$n aplicada; fi; done;
sudo -u postgres psql -X -q -d $DB -c \"NOTIFY pgrst, 'reload schema'\";
mkdir -p $DIR/motor; install -m 644 \$T/realtime/server.js \$T/realtime/conferidor.js \$T/realtime/package.json $DIR/;
install -m 644 \$T/realtime/motor/*.js $DIR/motor/;
cd $DIR && npm install --omit=dev --no-audit --no-fund --loglevel=error >/dev/null;
systemctl restart $SVC; sleep 3; systemctl is-active $SVC; curl -s -m 5 http://127.0.0.1:$PORTA/xrt/saude; echo; rm -rf \$T; echo publicado $REV em $AMB"
J=$(python -c "import json,sys;print(json.dumps({'commands':[sys.argv[1]],'executionTimeout':['600']}))" "$CMD")
ID=$(aws ssm send-command --instance-ids $INSTANCIA --document-name AWS-RunShellScript --parameters "$J" \
  --profile $PERFIL --region $REGIAO --query Command.CommandId --output text)
until S=$(aws ssm get-command-invocation --command-id "$ID" --instance-id $INSTANCIA --profile $PERFIL --region $REGIAO \
  --query Status --output text 2>/dev/null) && [ "$S" != InProgress ] && [ "$S" != Pending ]; do sleep 3; done
aws ssm get-command-invocation --command-id "$ID" --instance-id $INSTANCIA --profile $PERFIL --region $REGIAO \
  --query "[Status,StandardOutputContent,StandardErrorContent]" --output text
aws s3 rm "s3://$BUCKET/xadrez/servidor_$REV.tgz" --profile $PERFIL --region $REGIAO --only-show-errors
