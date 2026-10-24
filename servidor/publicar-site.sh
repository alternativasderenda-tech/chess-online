#!/bin/bash
# Publica o site do xadrez no servidor próprio (substitui o deploy da Vercel).
# Empacota os arquivos versionados do site (sem servidor/, supabase*, vercel.json), envia pelo bucket de cargas e troca
# /opt/xadrez/site de uma vez (a versão anterior fica em /opt/xadrez/site.ant para voltar com um mv).
#
# Pré-requisitos: AWS CLI com o perfil ew-prod (aws login --profile ew-prod --region sa-east-1) e git.
# Uso (na raiz do repositório, branch servidor-proprio):
#   bash servidor/publicar-site.sh teste    → novo.xadrezonline.app (aceita alterações ainda sem commit)
#   bash servidor/publicar-site.sh oficial  → xadrezonline.app (exige tudo commitado)
# A chave anon NÃO está no HTML: o /config.js é gerado no servidor com a chave do ambiente.
set -euo pipefail
AMB=${1:-}; case "$AMB" in teste) DIR=/opt/xadrez/site-teste; ENVF=/opt/xadrez/etc/teste.env; URL=https://novo.xadrezonline.app/ ;;
  oficial) DIR=/opt/xadrez/site; ENVF=/opt/xadrez/etc/segredos.env; URL=https://xadrezonline.app/ ;;
  *) echo "uso: publicar-site.sh teste|oficial"; exit 2 ;; esac
PERFIL=ew-prod; REGIAO=sa-east-1; INSTANCIA=i-0ea7b1e475c5a590b; BUCKET=energiawatt-backups-801664113979
cd "$(git rev-parse --show-toplevel)"
if [ "$AMB" = oficial ]; then
  [ -z "$(git status --porcelain -- . ':!servidor')" ] || { echo "Há alterações sem commit no site: faça o commit antes."; exit 1; }
fi
timeout 30 aws sts get-caller-identity --profile $PERFIL --region $REGIAO >/dev/null \
  || { echo "Sessão AWS vencida: rode  aws login --profile $PERFIL --region $REGIAO"; exit 1; }
REV=$(git rev-parse --short HEAD)$([ -n "$(git status --porcelain)" ] && echo -sujo)
TMP=$(mktemp -d)
git ls-files --cached --others --exclude-standard | grep -v -E '^(servidor/|supabase/|supabase-.*\.sql$|vercel\.json$|\.gitignore$)' > "$TMP/lista"
tar czf "$TMP/site.tar.gz" -T "$TMP/lista"
aws s3 cp "$TMP/site.tar.gz" "s3://$BUCKET/xadrez/site_$REV.tar.gz" --profile $PERFIL --region $REGIAO --only-show-errors
rm -rf "$TMP"
CMD="set -e; aws s3 cp s3://$BUCKET/xadrez/site_$REV.tar.gz /var/tmp/xadrez-site.tar.gz --region $REGIAO --only-show-errors;
N=$DIR.novo; rm -rf \$N; mkdir -p \$N; tar xzf /var/tmp/xadrez-site.tar.gz -C \$N;
A=\$(grep -m1 '^ANON_KEY=' $ENVF | cut -d= -f2-); printf \"window.XADREZ_CONFIG = { anon: '%s', ambiente: '%s' };\n\" \"\$A\" $AMB > \$N/config.js;
chmod -R a+rX \$N; rm -rf $DIR.ant; [ -d $DIR ] && mv $DIR $DIR.ant; mv \$N $DIR; rm -f /var/tmp/xadrez-site.tar.gz;
echo \$(date -u +%FT%TZ) $REV $AMB > $DIR/.versao; echo publicado $REV em $AMB"
J=$(python -c "import json,sys;print(json.dumps({'commands':[sys.argv[1]]}))" "$CMD")
ID=$(aws ssm send-command --instance-ids $INSTANCIA --document-name AWS-RunShellScript --parameters "$J" \
  --profile $PERFIL --region $REGIAO --query Command.CommandId --output text)
until S=$(aws ssm get-command-invocation --command-id "$ID" --instance-id $INSTANCIA --profile $PERFIL --region $REGIAO \
  --query Status --output text 2>/dev/null) && [ "$S" != InProgress ] && [ "$S" != Pending ]; do sleep 3; done
aws ssm get-command-invocation --command-id "$ID" --instance-id $INSTANCIA --profile $PERFIL --region $REGIAO \
  --query "[Status,StandardOutputContent,StandardErrorContent]" --output text
aws s3 rm "s3://$BUCKET/xadrez/site_$REV.tar.gz" --profile $PERFIL --region $REGIAO --only-show-errors
curl -s -o /dev/null -w "xadrezonline.app: %{http_code}\n" https://xadrezonline.app/
