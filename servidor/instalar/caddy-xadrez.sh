#!/bin/bash
# instala o bloco do xadrez no Caddy com validação e volta automática
set -euo pipefail
install -m 644 /var/tmp/xadrez.caddy /etc/caddy/xadrez.caddy
C=/etc/caddy/Caddyfile
if ! grep -q '^import /etc/caddy/xadrez.caddy' $C; then
  cp -p $C $C.bak-xadrez-$(date +%Y%m%d%H%M)
  printf '\n# xadrez online (bloco próprio, arquivo separado)\nimport /etc/caddy/xadrez.caddy\n' >> $C
fi
if caddy validate --config $C --adapter caddyfile >/var/tmp/caddy-validate.log 2>&1; then
  systemctl reload caddy && echo "caddy: validado e recarregado"
else
  tail -5 /var/tmp/caddy-validate.log
  B=$(ls -t $C.bak-xadrez-* 2>/dev/null | head -1); [ -n "$B" ] && cp -p $B $C
  echo "ERRO: configuração inválida, Caddyfile restaurado"; exit 1
fi
