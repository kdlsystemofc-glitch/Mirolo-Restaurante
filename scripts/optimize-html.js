const fs = require('fs');
const path = require('path');
const { execSync } = require('child_process');

const SITE_DIR = path.join(__dirname, '..', 'site');
const HTML_FILE = path.join(SITE_DIR, 'index.html');
const CRITICAL_CSS_FILE = path.join(SITE_DIR, 'critical.css');

function optimizeHtml() {
  console.log('⚡ Restaurando base limpa e aplicando otimizações em site/index.html...');

  // Recupera o HTML completo original e íntegro do commit 568d89e3d
  let html = execSync('git show 568d89e3d:site/index.html', { encoding: 'utf8' });
  const criticalCss = fs.readFileSync(CRITICAL_CSS_FILE, 'utf8').trim();

  // 1. Substituir bloco <head> de fontes e CSS
  const headPreloadBlock = `  <!-- Preload de Fontes Críticas Acima da Dobra (WOFF2 Local) -->
  <link rel="preload" href="fonts/cormorant-garamond-700-latin.woff2" as="font" type="font/woff2" crossorigin>
  <link rel="preload" href="fonts/lato-400-latin.woff2" as="font" type="font/woff2" crossorigin>

  <!-- Preload do Candidato LCP com Media Queries Responsivas -->
  <link rel="preload" as="image"
        href="assets/hero-food-800.webp"
        imagesrcset="assets/hero-food-480.webp 480w, assets/hero-food-800.webp 800w, assets/hero-food-1200.webp 1200w, assets/hero-food-1600.webp 1600w"
        imagesizes="(max-width: 600px) 100vw, (max-width: 1024px) 80vw, 880px"
        fetchpriority="high">
  <link rel="preload" as="image" href="assets/texture-wood-table-480.webp" type="image/webp" media="(max-width: 768px)">

  <!-- CSS Crítico Inline (Zero Render-Blocking) -->
  <style id="critical-css">${criticalCss}</style>

  <!-- Folha de Estilos Completa Assíncrona (Non-Blocking) -->
  <link rel="preload" href="style.min.css" as="style" onload="this.onload=null;this.rel='stylesheet'">
  <noscript><link rel="stylesheet" href="style.min.css"></noscript>`;

  html = html.replace(
    /<!-- Preconnect fonts -->[\s\S]*?<!-- CSS -->[\s\S]*?<link rel="stylesheet" href="style\.css">/,
    headPreloadBlock
  );

  // 2. Otimizar foto Hero Food (LCP) com srcset e degraus
  const originalHeroPicture = `<picture>
            <source media="(min-width: 800px)" srcset="assets/hero-food-1600.webp" type="image/webp">
            <img src="assets/hero-food-800.webp"
                 alt="Feijoada completa servida na panela de barro com torresmo e bolinhos de espinafre sobre mesa de madeira rústica"
                 loading="eager"
                 fetchpriority="high"
                 width="800" height="450">
          </picture>`;

  const optimizedHeroPicture = `<picture>
            <source media="(min-width: 1025px)" srcset="assets/hero-food-1600.webp" type="image/webp">
            <source media="(min-width: 601px)" srcset="assets/hero-food-1200.webp 1200w, assets/hero-food-800.webp 800w" sizes="(max-width: 1024px) 80vw, 880px" type="image/webp">
            <img src="assets/hero-food-800.webp"
                 srcset="assets/hero-food-480.webp 480w, assets/hero-food-800.webp 800w, assets/hero-food-1200.webp 1200w, assets/hero-food-1600.webp 1600w"
                 sizes="(max-width: 600px) 100vw, (max-width: 1024px) 80vw, 880px"
                 alt="Feijoada completa servida na panela de barro com torresmo e bolinhos de espinafre sobre mesa de madeira rústica"
                 fetchpriority="high"
                 decoding="async"
                 width="800" height="450">
          </picture>`;

  if (!html.includes(originalHeroPicture)) {
    throw new Error('Não encontrou o bloco original de hero-food picture');
  }
  html = html.replace(originalHeroPicture, optimizedHeroPicture);

  // 3. Otimizar foto Bolinho na Seção 02
  const originalBolinhoPicture = `<picture>
                  <source media="(min-width: 800px)" srcset="assets/bolinho-1600.webp" type="image/webp">
                  <img src="assets/bolinho-800.webp"
                       alt="Bolinhos de espinafre quentes e fumegantes, servidos na tábua de madeira"
                       loading="lazy"
                       width="600" height="600">
                </picture>`;

  const optimizedBolinhoPicture = `<picture>
                  <source media="(min-width: 800px)" srcset="assets/bolinho-1600.webp" type="image/webp">
                  <img src="assets/bolinho-500.webp"
                       srcset="assets/bolinho-500.webp 500w, assets/bolinho-800.webp 800w, assets/bolinho-1600.webp 1600w"
                       sizes="(max-width: 768px) 90vw, 420px"
                       alt="Bolinhos de espinafre quentes e fumegantes, servidos na tábua de madeira"
                       loading="lazy"
                       decoding="async"
                       width="600" height="600">
                </picture>`;

  if (!html.includes(originalBolinhoPicture)) {
    throw new Error('Não encontrou o bloco original de bolinho picture');
  }
  html = html.replace(originalBolinhoPicture, optimizedBolinhoPicture);

  // 4. Otimizar receita rascunho (peeking-sketch) com loading lazy
  const originalSketch = `<img src="assets/recipe-sketch-500.webp"
               alt="Rascunho de receitas com ingredientes desenhados"
               width="280" height="380">`;
  const optimizedSketch = `<img src="assets/recipe-sketch-500.webp"
               alt="Rascunho de receitas com ingredientes desenhados"
               loading="lazy"
               decoding="async"
               width="280" height="380">`;

  if (!html.includes(originalSketch)) {
    throw new Error('Não encontrou o bloco original de recipe-sketch');
  }
  html = html.replace(originalSketch, optimizedSketch);

  // 5. Otimizar fotos Polaroids da Seção 03 (trocar -600.webp por -400.webp + decoding async)
  html = html.replace(/chef-arms-crossed-600\.webp/g, 'chef-arms-crossed-400.webp');
  html = html.replace(/buffet-salada-600\.webp/g, 'buffet-salada-400.webp');
  html = html.replace(/chef-merengue-600\.webp/g, 'chef-merengue-400.webp');
  html = html.replace(/buffet-quentes-600\.webp/g, 'buffet-quentes-400.webp');
  html = html.replace(/chef-blue-ext-600\.webp/g, 'chef-blue-ext-400.webp');
  html = html.replace(/buffet-torresmo-600\.webp/g, 'buffet-torresmo-400.webp');
  html = html.replace(/sobremesas-600\.webp/g, 'sobremesas-400.webp');

  html = html.replace(/loading="lazy" width="300" height="300"/g, 'loading="lazy" decoding="async" width="200" height="200"');

  // 6. Adicionar landmark <main id="main-content"> em torno das seções centrais
  html = html.replace(
    /<!-- ═══════════════════════════════════════════════\s+SEÇÃO 02 — O CADERNO SECRETO/,
    '<main id="main-content">\n\n  <!-- ═══════════════════════════════════════════════\n       SEÇÃO 02 — O CADERNO SECRETO'
  );
  html = html.replace(
    /<\/section>\s+<!-- ═══════════════════════════════════════════════\s+SEÇÃO 05 — FOOTER/,
    '</section>\n\n  </main><!-- /#main-content -->\n\n  <!-- ═══════════════════════════════════════════════\n       SEÇÃO 05 — FOOTER'
  );

  // 7. Usar script motion-loader minificado
  html = html.replace('js/motion-loader.js', 'js/motion-loader.min.js');

  fs.writeFileSync(HTML_FILE, html);
  console.log(`✅ site/index.html restaurado e otimizado com sucesso! Total de linhas: ${html.split('\n').length}`);
}

optimizeHtml();
