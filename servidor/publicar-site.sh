#!/bin/bash
# Publica o site do xadrez no servidor próprio (substitui o deploy da Vercel).
# Empacota os arquivos versionados do site (sem servidor/, supabase*, vercel.json), envia pelo bucket de cargas e troca
# /opt/xadrez/site de uma vez (a versão anterior fica em /opt/xadrez/site.ant para voltar com um mv).
#
# Pré-requisitos: AWS CLI com o perfil ew-prod (aws login --profile ew-prod --region sa-east-1) e git.
# Uso (na raiz do repositório, na branch servidor-proprio): bash servidor/publicar-site.sh
set -euo pipefail
PERFIL=ew-prod; REGIAO=sa-east-1; INSTANCIA=i-0ea7b1e475c5a590b; BUCKET=energiawatt-backups-801664113979
cd "$(git rev-parse --show-toplevel)"
[ -z "$(git status --porcelain -- . ':!servidor')" ] || { echo "Há alterações sem commit no site: faça o commit antes."; exit 1; }
timeout 30 aws sts get-caller-identity --profile $PERFIL --region $REGIAO >/dev/null \
  || { echo "Sessão AWS vencida: rode  aws login --profile $PERFIL --region $REGIAO"; exit 1; }
REV=$(git rev-parse --short HEAD)
TMP=$(mktemp -d)
git ls-files | grep -v -E '^(servidor/|supabase/|supabase-.*\.sql$|vercel\.json$|\.gitignore$)' > "$TMP/lista"
tar czf "$TMP/site.tar.gz" -T "$TMP/lista"
aws s3 cp "$TMP/site.tar.gz" "s3://$BUCKET/xadrez/site_$REV.tar.gz" --profile $PERFIL --region $REGIAO --only-show-errors
rm -rf "$TMP"
CMD="set -e; aws s3 cp s3://$BUCKET/xadrez/site_$REV.tar.gz /var/tmp/xadrez-site.tar.gz --region $REGIAO --only-show-errors;
N=/opt/xadrez/site.novo; rm -rf \$N; mkdir -p \$N; tar xzf /var/tmp/xadrez-site.tar.gz -C \$N; chmod -R a+rX \$N;
rm -rf /opt/xadrez/site.ant; mv /opt/xadrez/site /opt/xadrez/site.ant; mv \$N /opt/xadrez/site; rm -f /var/tmp/xadrez-site.tar.gz;
echo \$(date -u +%FT%TZ) $REV > /opt/xadrez/site/.versao; echo publicado $REV"
J=$(python -c "import json,sys;print(json.dumps({'commands':[sys.argv[1]]}))" "$CMD")
ID=$(aws ssm send-command --instance-ids $INSTANCIA --document-name AWS-RunShellScript --parameters "$J" \
  --profile $PERFIL --region $REGIAO --query Command.CommandId --output text)
until S=$(aws ssm get-command-invocation --command-id "$ID" --instance-id $INSTANCIA --profile $PERFIL --region $REGIAO \
  --query Status --output text 2>/dev/null) && [ "$S" != InProgress ] && [ "$S" != Pending ]; do sleep 3; done
aws ssm get-command-invocation --command-id "$ID" --instance-id $INSTANCIA --profile $PERFIL --region $REGIAO \
  --query "[Status,StandardOutputContent,StandardErrorContent]" --output text
aws s3 rm "s3://$BUCKET/xadrez/site_$REV.tar.gz" --profile $PERFIL --region $REGIAO --only-show-errors
curl -s -o /dev/null -w "xadrezonline.app: %{http_code}\n" https://xadrezonline.app/
