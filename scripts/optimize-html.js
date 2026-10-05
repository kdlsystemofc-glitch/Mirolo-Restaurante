const fs = require('fs');
const path = require('path');
const { execSync } = require('child_process');

const SITE_DIR = path.join(__dirname, '..', 'site');
const HTML_FILE = path.join(SITE_DIR, 'index.html');
const CRITICAL_CSS_FILE = path.join(SITE_DIR, 'critical.css');

function optimizeHtml() {
  console.log('⚡ Aplicando SEO local completo e otimizações em site/index.html...');

  // Recupera o HTML completo original e íntegro do commit 568d89e3d
  let html = execSync('git show 568d89e3d:site/index.html', { encoding: 'utf8' });
  const criticalCss = fs.readFileSync(CRITICAL_CSS_FILE, 'utf8').trim();

  // 1. Bloco de Cabeçalho Completo com SEO Local, Open Graph, Twitter Cards, JSON-LD, Favicons e CSS Crítico
  const fullHeadBlock = `  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Mirolo Restaurante — O Almoço com Alma de Domingo | SBC</title>
  <meta name="description" content="Restaurante self-service por kg com comida caseira em São Bernardo do Campo. R. Esperico, 60 - Jardim do Mar. Segunda a sábado das 11:30 às 15:00. Tel: (11) 2758-2354.">
  <meta name="robots" content="index, follow">
  <meta name="theme-color" content="#3C2212">
  <meta name="author" content="Mirolo Restaurante">

  <!-- Metadados de SEO Local (Geolocalização SBC - Jardim do Mar) -->
  <meta name="geo.region" content="BR-SP">
  <meta name="geo.placename" content="São Bernardo do Campo">
  <meta name="geo.position" content="-23.693444;-46.554167">
  <meta name="ICBM" content="-23.693444, -46.554167">

  <!-- Favicons e Web App Manifest -->
  <link rel="icon" type="image/x-icon" href="favicon.ico">
  <link rel="icon" type="image/png" sizes="32x32" href="favicon-32x32.png">
  <link rel="icon" type="image/png" sizes="16x16" href="favicon-16x16.png">
  <link rel="apple-touch-icon" sizes="180x180" href="apple-touch-icon.png">
  <link rel="manifest" href="site.webmanifest">

  <!-- URL Canônica (Aguardando domínio final configurado em seo.config.json):
       Ao apontar o domínio oficial em produção, descomente a linha abaixo: -->
  <!-- <link rel="canonical" href="https://www.mirolorestaurante.com.br/"> -->

  <!-- Open Graph / Facebook / WhatsApp (1200x630) -->
  <meta property="og:type" content="restaurant.restaurant">
  <meta property="og:locale" content="pt_BR">
  <meta property="og:site_name" content="Mirolo Restaurante">
  <meta property="og:title" content="Mirolo Restaurante — O Almoço com Alma de Domingo">
  <meta property="og:description" content="Self-service por quilo com comida caseira de verdade em São Bernardo do Campo. R. Esperico, 60 - Jardim do Mar. Buffet variado e sobremesa cortesia.">
  <meta property="og:image" content="assets/og-image.jpg">
  <meta property="og:image:secure_url" content="assets/og-image.jpg">
  <meta property="og:image:type" content="image/jpeg">
  <meta property="og:image:width" content="1200">
  <meta property="og:image:height" content="630">
  <meta property="og:image:alt" content="Mirolo Restaurante — Feijoada na panela de barro com torresmo e bolinhos de espinafre sobre mesa rústica">
  <!-- Descomente og:url ao configurar o domínio oficial em seo.config.json: -->
  <!-- <meta property="og:url" content="https://www.mirolorestaurante.com.br/"> -->

  <!-- Twitter Card -->
  <meta name="twitter:card" content="summary_large_image">
  <meta name="twitter:title" content="Mirolo Restaurante — O Almoço com Alma de Domingo">
  <meta name="twitter:description" content="Self-service por quilo com comida caseira de verdade em São Bernardo do Campo. R. Esperico, 60 - Jardim do Mar. Buffet variado e sobremesa cortesia.">
  <meta name="twitter:image" content="assets/og-image.jpg">
  <meta name="twitter:image:alt" content="Mirolo Restaurante — Feijoada na panela de barro e buffet variado em São Bernardo do Campo">

  <!-- Preload de Fontes Críticas Acima da Dobra (WOFF2 Local) -->
  <link rel="preload" href="fonts/cormorant-garamond-700-latin.woff2" as="font" type="font/woff2" crossorigin>
  <link rel="preload" href="fonts/lato-400-latin.woff2" as="font" type="font/woff2" crossorigin>

  <!-- Preload do Candidato LCP com Media Queries Responsivas -->
  <link rel="preload" as="image"
        href="assets/hero-food-800.webp"
        imagesrcset="assets/hero-food-480.webp 480w, assets/hero-food-800.webp 800w, assets/hero-food-1200.webp 1200w, assets/hero-food-1600.webp 1600w"
        imagesizes="(max-width: 600px) 100vw, (max-width: 1024px) 80vw, 880px"
        fetchpriority="high">
  <link rel="preload" as="image" href="assets/texture-wood-table-480.webp" type="image/webp" media="(max-width: 768px)">

  <!-- Dados Estruturados Schema.org (JSON-LD) — Tipo: Restaurant
       Conformidade com CLIENTE.md e Diretrizes de Busca do Google:
       1. Dados confirmados: nome, telefone, endereço, geolocalização e horários do almoço.
       2. Preço: O valor 'R$ 40-60' é uma estimativa de clientes no Google Maps. Como o modelo do restaurante é buffet por quilo e não há tabela de preço fixo no CLIENTE.md, não foi publicado como definitivo.
       3. Avaliações: A nota 4.8 com 615 reviews é originária do Google Maps (terceiros). aggregateRating não é autodeclarado para cumprir as diretrizes contra 'self-serving reviews' do Google.
       4. Domínio e URLs: Usam o placeholder configurado em seo.config.json.
  -->
  <script type="application/ld+json">
  {
    "@context": "https://schema.org",
    "@type": "Restaurant",
    "name": "Mirolo Restaurante",
    "description": "Restaurante self-service por quilo com culinária caseira em São Bernardo do Campo. Especialidades incluem feijoada completa, torresmo sequinho, bolinho de espinafre artesanal e sobremesa cortesia.",
    "image": [
      "assets/og-image.jpg",
      "assets/hero-food-1600.webp"
    ],
    "telephone": "+55-11-2758-2354",
    "servesCuisine": [
      "Brasileira",
      "Comida Caseira",
      "Self-service por quilo",
      "Bufê"
    ],
    "address": {
      "@type": "PostalAddress",
      "streetAddress": "R. Esperico, 60",
      "addressLocality": "São Bernardo do Campo",
      "addressRegion": "SP",
      "postalCode": "09750-310",
      "addressCountry": "BR"
    },
    "geo": {
      "@type": "GeoCoordinates",
      "latitude": -23.693444,
      "longitude": -46.554167
    },
    "openingHoursSpecification": [
      {
        "@type": "OpeningHoursSpecification",
        "dayOfWeek": [
          "Monday",
          "Tuesday",
          "Wednesday",
          "Thursday",
          "Friday",
          "Saturday"
        ],
        "opens": "11:30",
        "closes": "15:00"
      }
    ],
    "acceptsReservations": "True",
    "hasDriveThroughService": false,
    "amenityFeature": [
      {
        "@type": "LocationFeatureSpecification",
        "name": "Refeição no local",
        "value": true
      },
      {
        "@type": "LocationFeatureSpecification",
        "name": "Retirada na porta",
        "value": true
      },
      {
        "@type": "LocationFeatureSpecification",
        "name": "Entrega sem contato",
        "value": true
      }
    ]
  }
  </script>

  <!-- CSS Crítico Inline (Zero Render-Blocking) -->
  <style id="critical-css">${criticalCss}</style>

  <!-- Folha de Estilos Completa Assíncrona (Non-Blocking) -->
  <link rel="preload" href="style.min.css" as="style" onload="this.onload=null;this.rel='stylesheet'">
  <noscript><link rel="stylesheet" href="style.min.css"></noscript>`;

  // Substitui todo o cabeçalho inicial (do charset até o fechamento de links CSS)
  html = html.replace(
    /<meta charset="UTF-8">[\s\S]*?<!-- CSS -->[\s\S]*?<link rel="stylesheet" href="style\.css">/,
    fullHeadBlock
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

  // 7. Adicionar h2 semântico acessível no rodapé para completar a hierarquia lógica
  html = html.replace(
    '<div class="container footer__inner">',
    '<div class="container footer__inner">\n\n        <!-- Título de seção acessível para leitores de tela e robôs de busca -->\n        <h2 class="visually-hidden">Localização, Horário e Reservas</h2>'
  );

  // 8. Usar script motion-loader minificado
  html = html.replace('js/motion-loader.js', 'js/motion-loader.min.js');

  fs.writeFileSync(HTML_FILE, html);
  console.log(`✅ site/index.html gerado com sucesso com SEO completo! Total de linhas: ${html.split('\n').length}`);
}

optimizeHtml();
