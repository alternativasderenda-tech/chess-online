# Edge Function: ga-stats

Busca métricas do Google Analytics 4 e retorna pro painel `/admin`.

## Setup completo (15-20 min)

### Parte 1 — Google Cloud Console (criar service account)

1. **Acesse**: [console.cloud.google.com](https://console.cloud.google.com) (logado com `alternativasderenda@gmail.com`)

2. **Cria/seleciona um projeto** — pode ser o mesmo do OAuth (provavelmente "Xadrez" ou similar)

3. **Habilita a Google Analytics Data API**:
   - Menu lateral → **APIs & Services → Library**
   - Busca por "Google Analytics Data API"
   - Clica **Enable**

4. **Cria uma Service Account**:
   - Menu lateral → **IAM & Admin → Service Accounts**
   - Clica **+ CREATE SERVICE ACCOUNT** no topo
   - **Nome**: `ga-stats-reader` (ou qualquer outro)
   - **Description**: "Lê métricas do GA pro painel admin"
   - Clica **CREATE AND CONTINUE**
   - Pula a parte de "Grant access" (deixa em branco) → **CONTINUE** → **DONE**

5. **Gera a chave JSON**:
   - Na lista de service accounts, clica na que você acabou de criar
   - Aba **KEYS** → **ADD KEY** → **Create new key** → **JSON** → **CREATE**
   - Vai baixar um arquivo `.json` com a credential. **Guarda em local seguro.**

6. **Anota dois valores do JSON baixado**:
   - `client_email` (algo como `ga-stats-reader@seu-projeto.iam.gserviceaccount.com`)
   - `private_key` (começa com `-----BEGIN PRIVATE KEY-----` e termina com `-----END PRIVATE KEY-----\n`)

### Parte 2 — Google Analytics (dar permissão pra service account)

7. **Vai pra GA4**: [analytics.google.com](https://analytics.google.com)
   - Seleciona a propriedade do `xadrezonline.vercel.app`
   - Engrenagem (bottom-left) → **Property settings → Property Access Management**
   - **+ → Add users**
   - Cola o `client_email` da service account
   - Role: **Viewer**
   - Desmarca "Notify by email" (não precisa)
   - **ADD**

8. **Pega o Property ID**:
   - Ainda em GA4 → engrenagem → **Property settings**
   - No topo, vai aparecer **PROPERTY ID** (número, tipo `123456789`)
   - Copia esse número

### Parte 3 — Supabase (deploy da Edge Function + secrets)

#### Opção A — Via Dashboard (mais fácil, recomendado)

9. Vai em [supabase.com/dashboard](https://supabase.com/dashboard) → seu projeto
10. **Edge Functions** no menu lateral → **Deploy a new function**
11. Nome: `ga-stats`
12. Cola o conteúdo de [`index.ts`](./index.ts) inteiro
13. **Deploy function**

#### Opção B — Via CLI

```bash
# Instala CLI (uma vez)
npm install -g supabase

# No diretorio do projeto chess-vercel/
supabase login
supabase link --project-ref qkgclyldbbgbfjgyoeej
supabase functions deploy ga-stats
```

### Parte 4 — Configurar secrets

No Supabase Dashboard → Edge Functions → seu projeto → **Manage secrets** (ou via CLI):

Adiciona estas 3 variáveis:

| Nome | Valor |
|---|---|
| `GA_SA_EMAIL` | O `client_email` do JSON (passo 6) |
| `GA_SA_PRIVATE_KEY` | A `private_key` inteira do JSON (incluindo `-----BEGIN...` e `-----END...`) |
| `GA_PROPERTY_ID` | O número do passo 8 |

⚠️ **Atenção com a `private_key`**:
- No JSON ela aparece com `\n` literal (escapado).
- Quando você cola no Supabase Dashboard, pode colar como está — minha função normaliza pra `\n` real automaticamente.

### Parte 5 — Testar

Vai pra `https://xadrezonline.vercel.app/admin` (logado como admin) → deve carregar a seção "Google Analytics" com seus dados.

Se der erro, abre o Console (F12) e me passa a mensagem.

## Métricas que a função retorna

```json
{
  "totals": {
    "activeUsers": "...",       // usuários únicos 28d
    "newUsers": "...",          // novos 28d
    "sessions": "...",          // sessões 28d
    "screenPageViews": "...",   // pageviews 28d
    "averageSessionDuration": "..."
  },
  "daily": [                    // últimos 14 dias
    { "date": "20260512", "activeUsers": "12", "sessions": "18" },
    ...
  ],
  "pages": [                    // top 10 páginas 7d
    { "pagePath": "/", "screenPageViews": "150", "activeUsers": "45" },
    ...
  ],
  "events": [                   // top 15 eventos 7d (new_game, score_registered, etc)
    { "eventName": "new_game", "eventCount": "234" },
    ...
  ],
  "sources": [                  // top 10 origens 7d
    { "sessionSource": "google", "sessions": "80", "activeUsers": "65" },
    ...
  ],
  "devices": [                  // mobile/desktop/tablet 28d
    { "deviceCategory": "mobile", "activeUsers": "120", "sessions": "180" },
    ...
  ],
  "countries": [                // top 10 países 28d
    { "country": "Brazil", "activeUsers": "180" },
    ...
  ]
}
```

## Custo

- **Supabase Edge Functions**: free tier inclui 500k invocações/mês (vai sobrar muito)
- **Google Analytics Data API**: free, 25k tokens/dia (cada call usa ~7-10 tokens)

## Segurança

- A função verifica que o caller tem JWT válido **E** está em `admin_users`
- Service account JSON nunca sai do servidor (não vai pro client)
- CORS aberto pra qualquer origem porque a verificação de admin é robusta
