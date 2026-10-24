#!/bin/bash
# Virada do xadrezonline.app para o servidor próprio: domínio principal no Caddy (www redireciona), login com o
# endereço principal. Rodar só com o DNS do domínio já apontando para este servidor.
set -euo pipefail
for h in xadrezonline.app www.xadrezonline.app; do
  ip=$(getent ahostsv4 $h | awk 'NR==1{print $1}')
  [ "$ip" = "177.71.245.107" ] || { echo "DNS de $h ainda em $ip: abortado"; exit 1; }
done
sed -i 's#^API_EXTERNAL_URL=.*#API_EXTERNAL_URL=https://xadrezonline.app/auth/v1#; s#^GOTRUE_SITE_URL=.*#GOTRUE_SITE_URL=https://xadrezonline.app#' /opt/xadrez/etc/gotrue.env
sed -i 's#^GOTRUE_EXTERNAL_GOOGLE_REDIRECT_URI=.*#GOTRUE_EXTERNAL_GOOGLE_REDIRECT_URI=https://xadrezonline.app/auth/v1/callback#' /opt/xadrez/etc/google.env
bash /var/tmp/caddy-xadrez.sh
systemctl restart xadrez-auth; sleep 3; systemctl is-active xadrez-auth
echo "VIRADA OK"
