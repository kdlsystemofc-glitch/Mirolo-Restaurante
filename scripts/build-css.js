const fs = require('fs');
const path = require('path');

const SITE_DIR = path.join(__dirname, '..', 'site');

function minifyCss(css) {
  return css
    // Remover comentários
    .replace(/\/\*[\s\S]*?\*\//g, '')
    // Remover quebras de linha e espaços extras
    .replace(/\r?\n|\r/g, '')
    .replace(/\s+/g, ' ')
    // Remover espaços ao redor de seletores e pontuações
    .replace(/\s*([\{\}\:\;\,])\s*/g, '$1')
    // Remover ponto e vírgula antes do fechamento de bloco
    .replace(/;\}/g, '}')
    .trim();
}

async function buildCss() {
  console.log('🎨 Compilando e otimizando CSS...');

  const fontsCss = fs.readFileSync(path.join(SITE_DIR, 'fonts.css'), 'utf8');
  let tokensCss = fs.readFileSync(path.join(SITE_DIR, 'tokens.css'), 'utf8');
  const resetCss = fs.readFileSync(path.join(SITE_DIR, 'reset.css'), 'utf8');
  let styleCss = fs.readFileSync(path.join(SITE_DIR, 'style.css'), 'utf8');
  const lenisCss = fs.readFileSync(path.join(SITE_DIR, 'vendor', 'lenis.css'), 'utf8');

  // Remover @import do Google Fonts em tokens.css (usamos fonts.css local!)
  tokensCss = tokensCss.replace(/@import\s+url\([^)]+\);?/g, '');

  // Montar CSS Completo
  const fullCss = [
    fontsCss,
    tokensCss,
    resetCss,
    styleCss,
    lenisCss
  ].join('\n\n');

  const minifiedFull = minifyCss(fullCss);
  fs.writeFileSync(path.join(SITE_DIR, 'style.min.css'), minifiedFull);
  console.log(`✅ site/style.min.css gerado (${Math.round(minifiedFull.length / 1024)} KiB)`);

  // Extrair Critical CSS (Above the fold: Fonts + Tokens + Reset + Hero)
  // O Hero vai até o início da seção 02 (.bolinho)
  const heroIndex = styleCss.indexOf('§ 02 — O CADERNO SECRETO');
  const heroCss = heroIndex !== -1 ? styleCss.substring(0, heroIndex) : styleCss;

  const criticalRaw = [
    fontsCss,
    tokensCss,
    resetCss,
    heroCss
  ].join('\n\n');

  const minifiedCritical = minifyCss(criticalRaw);
  fs.writeFileSync(path.join(SITE_DIR, 'critical.css'), minifiedCritical);
  console.log(`✅ site/critical.css gerado (${Math.round(minifiedCritical.length / 1024)} KiB)`);
}

buildCss().catch(err => {
  console.error('❌ Falha na compilação do CSS:', err);
  process.exit(1);
});
