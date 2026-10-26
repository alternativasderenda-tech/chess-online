'use strict';
/**
 * Imagem de prévia (og:image) 1200×630 por artigo: título + nível + diagrama (D-APR-07).
 * O PNG é desenhado pelo Chrome (playwright-core) a partir de um HTML; o MANIFESTO (aprenda/gerador/imagens.json)
 * guarda o sha256 desse HTML. O --conferir compara só o manifesto (PNG não é byte-a-byte reprodutível entre máquinas):
 * mudou título, nível, diagrama ou o modelo → o hash muda → a imagem está velha.
 */
const fs = require('node:fs');
const path = require('node:path');
const crypto = require('node:crypto');
const { execSync } = require('node:child_process');
const { esc } = require('./markdown');

const LARG = 1200, ALT = 630;

/** spec: { titulo, nivel (rótulo), corNivel, marca, svg, idioma, rodape } */
function html(spec) {
  return `<!DOCTYPE html><html lang="${spec.idioma}"><head><meta charset="UTF-8">
<link rel="stylesheet" href="https://fonts.googleapis.com/css2?family=Playfair+Display:wght@700&family=Inter:wght@500;600;700&display=swap">
<style>
*{margin:0;padding:0;box-sizing:border-box}
html,body{width:${LARG}px;height:${ALT}px;overflow:hidden}
body{font-family:Inter,system-ui,sans-serif;color:#e8e8e8;background:#1a1a2e;
 background-image:radial-gradient(ellipse at 15% 60%,#1e2a4a 0%,transparent 55%),radial-gradient(ellipse at 85% 10%,#2a1e3e 0%,transparent 55%);
 display:flex;align-items:center;gap:56px;padding:0 64px}
.txt{flex:1;display:flex;flex-direction:column;gap:26px;min-width:0}
.marca{font-family:'Playfair Display',serif;font-size:34px;color:#e2b96f;font-weight:700}
.selo{align-self:flex-start;font-size:24px;font-weight:700;letter-spacing:1.5px;text-transform:uppercase;padding:8px 18px;border-radius:999px;
 color:${spec.corNivel};border:2px solid ${spec.corNivel};background:rgba(255,255,255,0.04)}
h1{font-family:'Playfair Display',serif;font-size:${spec.titulo.length > 60 ? 50 : spec.titulo.length > 40 ? 58 : 66}px;line-height:1.12;color:#fff;
 display:-webkit-box;-webkit-line-clamp:4;-webkit-box-orient:vertical;overflow:hidden}
.rod{font-size:24px;color:#97a6b5;font-weight:500}
.tab{width:470px;height:470px;flex:none;border-radius:10px;overflow:hidden;box-shadow:0 18px 50px rgba(0,0,0,0.55),0 0 0 6px rgba(226,185,111,0.35)}
.tab svg{width:100%;height:100%;display:block}
</style></head><body>
<div class="txt">
  <div class="marca">♚ ${esc(spec.marca)}</div>
  <div class="selo">${esc(spec.nivel)}</div>
  <h1>${esc(spec.titulo)}</h1>
  <div class="rod">${esc(spec.rodape)}</div>
</div>
<div class="tab">${spec.svg}</div>
</body></html>`;
}

const hash = s => crypto.createHash('sha256').update(s).digest('hex').slice(0, 20);

function acharPlaywright() {
  const tentativas = [process.env.PLAYWRIGHT_CORE, 'playwright-core', 'C:/tmp/pw-harness/node_modules/playwright-core'];
  try { tentativas.push(path.join(execSync('npm root -g', { encoding: 'utf8', stdio: ['ignore', 'pipe', 'ignore'] }).trim(), 'playwright-core')); } catch { /* sem npm */ }
  for (const t of tentativas.filter(Boolean)) {
    try { return require(t); } catch { /* próxima */ }
  }
  return null;
}
function acharChrome() {
  const c = [process.env.CHROME_PATH, 'C:/Program Files/Google/Chrome/Application/chrome.exe', 'C:/Program Files (x86)/Google/Chrome/Application/chrome.exe',
    '/usr/bin/google-chrome', '/usr/bin/chromium', '/Applications/Google Chrome.app/Contents/MacOS/Google Chrome'];
  return c.find(p => p && fs.existsSync(p)) || undefined;
}

/**
 * pedidos: [{ arquivo (relativo à raiz), html }]. manifesto: { arquivo: hash }.
 * Desenha só o que mudou. Devolve { feitos, pendentes, erro }.
 */
async function desenhar(raiz, pedidos, manifesto) {
  const faltam = pedidos.filter(p => manifesto[p.arquivo] !== hash(p.html) || !fs.existsSync(path.join(raiz, p.arquivo)));
  if (!faltam.length) return { feitos: [], pendentes: [] };
  const pw = acharPlaywright();
  if (!pw) return { feitos: [], pendentes: faltam.map(p => p.arquivo), erro: 'playwright-core não encontrado (defina PLAYWRIGHT_CORE=<caminho>/playwright-core)' };
  const browser = await pw.chromium.launch({ executablePath: acharChrome(), headless: true });
  const feitos = [];
  try {
    const page = await browser.newPage({ viewport: { width: LARG, height: ALT }, deviceScaleFactor: 1 });
    for (const p of faltam) {
      await page.setContent(p.html, { waitUntil: 'networkidle' });
      await page.evaluate(() => document.fonts.ready);
      const destino = path.join(raiz, p.arquivo);
      fs.mkdirSync(path.dirname(destino), { recursive: true });
      await page.screenshot({ path: destino, type: 'png' });
      manifesto[p.arquivo] = hash(p.html);
      feitos.push(p.arquivo);
    }
  } finally { await browser.close(); }
  return { feitos, pendentes: [] };
}

module.exports = { html, hash, desenhar, LARG, ALT };
