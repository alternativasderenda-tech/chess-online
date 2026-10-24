# Decisões do xadrezonline.app (ADR)

**Contrato (vale para quem revisa, audita ou altera):** leia antes de sugerir. Contradizer é permitido, mas diga
**qual item** e **por quê**, com medição nova — decisão registrada não é dogma, é ônus de prova. Repetir item de
"Aberto de propósito" não conta como achado. Decisão nova entra **no mesmo commit** que a implementa.

## 1. Infraestrutura (24/10/2026)

| ID | Decisão | Motivo / medição |
|---|---|---|
| D-INF-01 | Sair do Supabase/Vercel para o EC2 do EnergiaWATT, com GoTrue v2.197.0 + PostgREST v16.5 + tempo real próprio | Supabase gratuito pausava; dono não quer custo extra. Ver `servidor/README.md` |
| D-INF-02 | Ambiente de TESTE em `novo.xadrezonline.app`: banco `xadrez_teste`, segredo de JWT próprio, serviços próprios (portas 9909/3211/3212), `noindex` | Testar torneio com jogadores fictícios sem sujar o oficial. Medido: token do teste → PGRST301 no oficial e vice-versa |
| D-INF-03 | A chave anon sai do HTML: `/config.js` gerado no servidor por ambiente (`publicar-site.sh teste|oficial`) | O mesmo HTML serve os dois ambientes |

## 2. Torneios — gauntlet "faça a magia" (24/10/2026, meta 9)

Dimensões: **segurança/integridade** (ataques reproduzidos), **regras e mecânica** (torneios simulados com jogadores
fictícios), **layout/UX** (desktop e celular), **pagamento Pix** (Mercado Pago: fluxo, webhook, falhas). Nota-alvo: 9
em cada dimensão, zero achado crítico/alto aberto. Foco: torneio; o resto do app só entra se o torneio depender dele.

### Regras (o que o torneio É)

| ID | Decisão | Motivo |
|---|---|---|
| D-TRN-01 | **Resultado de partida de torneio só pelo servidor.** O cliente não grava `status`/`result`/`tournament_match_id` de jogo de torneio (gatilho recusa); só insere lances (o banco confere ordem e vez). Um juiz no servidor reproduz cada lance com o motor do site e encerra: xeque-mate, afogamento, 50 lances, material insuficiente; lance ilegal = derrota de quem jogou; tempo esgotado pelos horários do servidor (rotina ou `tournament_claim_timeout`); desistência só pelo próprio jogador (`tournament_resign`) | Auditoria: qualquer logado criava um jogo ligado à partida alheia e se dava a vitória (gatilho não conferia os jogadores) |
| D-TRN-02 | **Vitória contra a IA conferida no servidor** com o MESMO motor do site (extraído do `index.html`): lances do jogador legais, cada lance gravado como da IA tem de estar entre os que a IA escolheria (mesma margem), e a partida tem de terminar em mate a favor do jogador. Sem isso o placar fica `rejeitado` e não conta | Auditoria: 1 lance = "vitória" de 1 s; `p_client_validated` deixava o navegador ditar o tempo |
| D-TRN-03 | `record_match_result` ("forçar resultado") só para o criador e o admin, só com torneio ativo, e o vencedor tem de ser um dos dois jogadores da partida | Jogador se dava a vitória sem jogar |
| D-TRN-04 | **Agendador no servidor** (a cada minuto): W.O. por prazo, avanço de rodada, encerramento de ranking de IA vencido, expiração de cobrança Pix | Nada rodava sozinho; dependia de alguém abrir a página |
| D-TRN-05 | **Chaveamento pelo número real de inscritos** no início: rodadas = ⌈log₂ n⌉; passagens diretas (byes) resolvidas na hora; `capacity` só limita inscrição | 32 vagas com 2 inscritos geravam 5 rodadas fantasmas |
| D-TRN-06 | **Empate no chaveamento:** desempate automático com cores invertidas e o mesmo tempo; no 3º jogo, *Armageddon* (empate = vitória das Pretas) | Regra padrão de xadrez; nada fica preso esperando o criador |
| D-TRN-07 | **W.O. por prazo:** vence quem jogou (fez lance) ou entrou na sala; se nenhum dos dois apareceu, sorteio registrado (`wo_sorteio`) | O critério "mais lances, senão jogador 1" favorecia sempre o jogador 1 |
| D-TRN-08 | Campeão gravado no torneio (`winner_id`, `finished_at`); ranking de IA encerra sozinho no `ends_at` e grava o campeão pelo critério | Prêmio era só texto, sem registro de quem ganhou |
| D-TRN-09 | Inscrição: rejeitado não volta sozinho; torneio por link exige o `share_token`; vaga conferida com o torneio travado (`for update`) | Reinscrição de rejeitado, corrida de capacidade, torneio privado aberto a quem tivesse o id |

| D-TRN-10 | **Desfazer lance tira a partida do ranking e do torneio** (o site avisa antes). A heurística antiga que somava suspeita a quem NÃO desfazia lance sai | O desfazer não apaga os lances gravados: a partida deixa de ser reproduzível no servidor |
| D-TRN-11 | **Tempo do jogador = soma dos intervalos (horário do servidor) entre o lance anterior e cada lance dele** — o tempo da IA pensando não conta. Partida jogada antes do login (lances enviados de uma vez — todos com o mesmo horário exato) conta vitória, mas não vale para "vitória mais rápida"; critério: ≥ 90% dos lances com horário próprio | O `p_client_validated` deixava o navegador ditar o tempo |
| D-TRN-12 | Conferência de partida da IA numa **fila em segundo plano** no servidor; o placar fica "conferindo" até sair o veredito | Medido (PC local): conferir 1 lance da IA custa 8 ms (fácil) … ~2 s (expert) no meio-jogo; uma partida expert inteira, 1–2 min de CPU |
| D-TRN-13 | O motor do servidor é o do site, EXTRAÍDO (`servidor/motor/extrair.js` → `motor-gerado.js`); `node servidor/motor/teste.js` falha se o site mudar e o servidor não | Mesmas regras dos dois lados. Medido: perft da posição inicial (20/400/8.902/197.281), Kiwipete (48/2.039/97.862) e posição 3 (14/191/2.812/43.238) batem — o gerador de lances do site está correto |

| D-TRN-14 | Rankings globais (`ranking_wins`, `ranking_my_position`) contam só placar `normal`; "mais rápido" só com tempo ao vivo (`timed_live`; placares antigos, nulos, continuam) | Achado na leitura: as duas funções contavam TODO placar, inclusive `cheater` (migração 002) |
| D-TRN-15 | Sala da partida: abrir marca presença; o jogo só é criado com os DOIS presentes. Prazo da rodada vale para COMEÇAR (cada lado ao menos 1 lance); jogo em andamento é decidido pelo relógio, nunca por W.O. | W.O. de partida em andamento punia quem estava jogando |
| D-TRN-16 | Relógio do torneio pelos horários do servidor; o 1º lance de cada lado não consome tempo (como no Lichess); tempo esgotado = derrota, decidido pela rotina mesmo com os dois fora do site. Torneio de chaveamento sempre com relógio (5/10/15/30 min) e prazo de rodada ≥ 2×tempo + 30 min | Partida "sem tempo" podia ficar aberta para sempre |
| D-TRN-17 | Tudo o que é interno fica no schema PRIVADO `xadrez_rt` (o PostgREST só expõe `public`); no `public`, função nova nasce executável por anon/authenticated (privilégio padrão herdado do Supabase) — cada RPC confere quem chama | Medido em `pg_default_acl`: `xadrez_owner` concede EXECUTE/ALL a anon e authenticated por padrão |

### Pagamento

| ID | Decisão | Motivo |
|---|---|---|
| D-PAG-01 | Pix automático pelo **Mercado Pago** (escolha do dono, 24/10/2026): cobrança criada pelo servidor (QR + copia-e-cola na tela), confirmação pelo webhook (assinatura `x-signature` conferida) **e** consulta à API (`GET /v1/payments/{id}`: status `approved` e valor exato); conferência periódica de pendentes no agendador cobre webhook perdido; idempotente por `payment_id` | Pagamento de madrugada liberava só quando o admin acordasse; taxa percentual (cobrança de R$ 1 não é engolida) |

## 3. Armadilhas de medição

- **PostgREST guarda a lista de funções em cache:** função nova ou com assinatura nova dá "Could not find the function … in the schema cache" até `NOTIFY pgrst, 'reload schema'` (o `publicar-servidor.sh` faz). Custou 3 falhas falsas no 1º e2e.
- **PL/pgSQL: `IF x <> CASE … THEN … END THEN`** corta a condição no 1º `THEN` → "syntax error at end of input". CASE dentro de IF vai entre parênteses.
- **Saída do SSM com "→"** quebra o AWS CLI no Windows (charmap): exportar `PYTHONIOENCODING=utf-8 PYTHONUTF8=1` antes do `rodar.sh`.
- **Dono sem BYPASSRLS:** `auth.users` tem RLS (migração do GoTrue); o `xadrez_owner` não lia ninguém e todo nome novo virava 'Jogador'/'Anônimo' — também no oficial (papel é do cluster). No Supabase o `postgres` tem BYPASSRLS. Migração 005. O e2e só conferia ids, não nomes — agora confere.
- **Teste e2e:** `servidor/testes/e2e-torneio.js` roda NO servidor contra o banco de teste (aborta em outro banco), com jogadores fictícios `@teste.invalid` apagados no fim. 1ª rodada completa: 17/17.

## 4. Aberto de propósito

- Ranking global de IA: placares antigos (antes de D-TRN-02) continuam valendo — não há como revalidar partidas sem
  os lances da IA gravados com a regra nova.
