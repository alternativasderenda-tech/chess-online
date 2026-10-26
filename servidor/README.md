# Xadrez no servidor próprio (desde 24/10/2026)

O `xadrezonline.app` saiu da Vercel + Supabase (o Supabase gratuito pausava por inatividade) e roda no EC2 do
EnergiaWATT (`i-0ea7b1e475c5a590b`, sa-east-1, IP `177.71.245.107`), isolado do site que já estava lá.

## Como está montado (`/opt/xadrez`, usuário Linux `xadrez`)

| Peça | O quê | Porta (só 127.0.0.1) | Serviço systemd |
|---|---|---|---|
| Banco | Postgres do servidor, banco `xadrez` (cópia do Supabase: schema, 38 funções, 13 policies, dados, usuários) | 5432 | `postgresql` |
| Login | GoTrue **v2.197.0** (o mesmo programa do Supabase Auth), Google OAuth do projeto "Xadrez" no Google Cloud | 9999 | `xadrez-auth` |
| API | PostgREST **v16.5** (o mesmo do Supabase): `supa.from()` e `supa.rpc()` do site funcionam sem mudança | 3201 | `xadrez-rest` |
| Tempo real | `servidor/realtime/server.js` (Node, ws + pg): lances, partida e broadcast (revanche, reações) | 3202 | `xadrez-rt` |
| Site | arquivos estáticos em `/opt/xadrez/site`, servidos pelo Caddy | — | `caddy` |

O Caddy (`/etc/caddy/xadrez.caddy`, incluído no fim do Caddyfile) atende `xadrezonline.app` e `novo.xadrezonline.app`
(o `www` redireciona) e encaminha `/rest/v1/*` → PostgREST, `/auth/v1/*` → GoTrue, `/xrt` → tempo real.

**Isolamento do EnergiaWATT:** cada serviço tem `MemoryMax=160M` e `CPUQuota=60%`; os papéis do banco do xadrez
(`authenticator`, `supabase_auth_admin`, `xadrez_rt`) são recusados pelo `pg_hba.conf` nos bancos `energiadata` e
`postgres`; as tabelas pertencem a `xadrez_owner` (sem login, não é superusuário — como o `postgres` do Supabase).

**Segredos** ficam só no servidor (`/opt/xadrez/etc/segredos.env` e `google.env`, root:xadrez 640): senhas do banco,
segredo do JWT e o Client Secret do Google. A chave `SUPABASE_ANON` no HTML é pública (como era a do Supabase).

## Diferenças no site em relação à `master`

- `SUPABASE_URL = location.origin` (API, login e tempo real no próprio domínio) e a chave anon nova.
- `rt.js` substitui `supa.channel()`/`supa.removeChannel()` pelo websocket próprio (mesma API para o jogo).
- `sw.js` não intercepta `/rest`, `/auth`, `/functions`, `/xrt` (antes ficavam em outro domínio) — cache `xadrez-v14`.

A `master` continua sendo a versão da Vercel/Supabase (volta de segurança). **Não fazer merge desta branch na
`master` enquanto a Vercel publicar a `master`**: o site da Vercel tentaria a API no próprio domínio.

## Publicar uma mudança do site

```bash
git checkout servidor-proprio
# editar, commit
bash servidor/publicar-site.sh
```

## Reinstalar do zero (só em caso de servidor novo)

`servidor/instalar/setup1.sh` (usuário, binários com sha256, segredos, banco, pg_hba) → `setup2.sh <dir do dump>`
(GoTrue, schema auth, usuários, schema public) → `setup3.sh <dir do server.js>` (chaves, gatilho do tempo real,
serviços) → `caddy-xadrez.sh` (bloco do Caddy, valida antes de recarregar). O Google precisa de
`/opt/xadrez/etc/google.env` (`GOTRUE_EXTERNAL_GOOGLE_*`).

## Painel de estatísticas do /admin (`/functions/v1/ga-stats`)

Porte da Edge Function do Supabase, dentro do `server.js` (mesma resposta, mesmos 7 relatórios do GA4; resultado
guardado 5 min). Só responde a quem está em `public.admin_users`. Chave da conta de serviço `ga-stats-reader`
(projeto "Xadrez" no Google Cloud) em `/opt/xadrez/etc/ga-sa.json`; propriedade em `/opt/xadrez/etc/ga.env`
(`GA_PROPERTY_ID=`). A organização bloqueia criar chave de conta de serviço por padrão
(`iam.disableServiceAccountKeyCreation`): para gerar outra, liberar a política só no projeto e reativar depois.

## Formulário de contato (`/contato`, `/en/contact` → `POST /functions/v1/contato`)

As mensagens ficam em `xadrez_rt.contato` (migração 015) e aparecem no /admin ("Mensagens de contato"). Decisões:
D-CON-01…07 em `DECISOES.md`. O código é `servidor/realtime/contato.js`; a página é gerada por `aprenda/gerador`
(com o JS em `/contato.js`).

**Aviso por e-mail (opcional).** Sem configuração, o servidor só grava. Para receber cada mensagem em
`contato@xadrezonline.app` (com Reply-To de quem escreveu), crie `/opt/xadrez/etc/smtp.env` (root:xadrez 640):

```
SMTP_HOST=smtp.gmail.com
SMTP_PORT=465
SMTP_USER=<conta que envia>
SMTP_PASS=<senha de app da conta>
SMTP_FROM=Xadrez Online <conta que envia>
# SMTP_TO=contato@xadrezonline.app   (padrão)
```

e acrescente ao `/opt/xadrez/bin/realtime-run.sh`, logo abaixo da linha do `mp.env`:

```
[ -f /opt/xadrez/etc/smtp.env ] && { set -a; . /opt/xadrez/etc/smtp.env; set +a; }
```

Depois `systemctl restart xadrez-rt`; o log mostra `Contato: aviso por e-mail smtp <host>`. No teste o arquivo é
`smtp-teste.env` (linha equivalente em `teste-rt-run.sh`); sem ele o teste não manda e-mail. Porta 465 = TLS direto,
587 = STARTTLS obrigatório (a AWS bloqueia a 25 de saída). Falha de envio vai para o log (`[contato] aviso por e-mail
falhou <id>`) e não perde a mensagem: ela já está no banco.

**Resposta pelo painel (D-CON-08, migração 016).** O "Responder" do /admin manda pelo mesmo SMTP, de `SMTP_FROM`,
para quem escreveu. Para sair como `contato@xadrezonline.app` pelo Gmail, o endereço tem de estar confirmado em
Gmail → Configurações → Contas e importação → "Enviar e-mail como" (servidor `smtp.gmail.com`, o próprio Gmail e a
senha de app); sem isso o Gmail troca o remetente pela conta. Aí `SMTP_FROM=Xadrez Online <contato@xadrezonline.app>`.
Cada resposta fica em `xadrez_rt.contato_resposta` (`enviando` → `enviada`/`falhou`); enviada marca a mensagem como
respondida. Limite: 60 respostas por hora.
