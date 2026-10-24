'use strict';
/**
 * Sessão de jogador FICTÍCIO para testar o site no AMBIENTE DE TESTE (novo.xadrezonline.app) sem login Google.
 * Roda no servidor com o teste.env carregado; cria (ou reaproveita) o usuário `<nome>@teste.invalid` no banco
 * xadrez_teste e imprime o JSON da sessão do supabase-js (chave do localStorage: "sb-novo-auth-token").
 * O token só vale no teste (segredo de JWT próprio do ambiente). Uso:
 *   node testes/sessao-teste.js Ana [--admin]
 */
const crypto = require('node:crypto');
const { execFileSync } = require('node:child_process');
const nome = (process.argv[2] || 'Teste').replace(/[^A-Za-z0-9]/g, '').slice(0, 20) || 'Teste';
const admin = process.argv.includes('--admin');
const SEGREDO = process.env.JWT_SECRET;
if (!SEGREDO) { console.error('carregue /opt/xadrez/etc/teste.env'); process.exit(2); }
const sql = q => execFileSync('sudo', ['-u', 'postgres', 'psql', '-X', '-At', '-v', 'ON_ERROR_STOP=1', '-d', 'xadrez_teste', '-c', q], { encoding: 'utf8' }).trim();
if (sql('select current_database()') !== 'xadrez_teste') process.exit(3);
const email = `ui-${nome.toLowerCase()}@teste.invalid`;
let id = sql(`select id from auth.users where email = '${email}'`);
if (!id) {
  id = crypto.randomUUID();
  sql(`insert into auth.users (id, instance_id, aud, role, email, raw_app_meta_data, raw_user_meta_data, created_at, updated_at, is_sso_user, is_anonymous)
       values ('${id}', '00000000-0000-0000-0000-000000000000', 'authenticated', 'authenticated', '${email}', '{"provider":"google"}',
               '{"full_name":"${nome} (teste)","name":"${nome} (teste)"}', now(), now(), false, false)`);
}
if (admin) sql(`insert into admin_users (user_id) values ('${id}') on conflict do nothing`);
const agora = Math.floor(Date.now() / 1000);
const b = o => Buffer.from(JSON.stringify(o)).toString('base64url');
const h = b({ alg: 'HS256', typ: 'JWT' });
const p = b({ sub: id, role: 'authenticated', aud: 'authenticated', email, iat: agora, exp: agora + 8 * 3600,
  user_metadata: { full_name: `${nome} (teste)`, name: `${nome} (teste)` }, app_metadata: { provider: 'google' } });
const token = h + '.' + p + '.' + crypto.createHmac('sha256', SEGREDO).update(h + '.' + p).digest('base64url');
console.log(JSON.stringify({
  access_token: token, token_type: 'bearer', expires_in: 8 * 3600, expires_at: agora + 8 * 3600, refresh_token: 'teste-sem-refresh',
  user: { id, aud: 'authenticated', role: 'authenticated', email, app_metadata: { provider: 'google' },
          user_metadata: { full_name: `${nome} (teste)`, name: `${nome} (teste)` }, created_at: new Date().toISOString() },
}));
