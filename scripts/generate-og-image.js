const sharp = require('sharp');
const path = require('path');
const fs = require('fs');

const ASSETS_DIR = path.join(__dirname, '..', 'site', 'assets');
const OUTPUT_JPG = path.join(ASSETS_DIR, 'og-image.jpg');
const OUTPUT_WEBP = path.join(ASSETS_DIR, 'og-image.webp');

async function generateOgImage() {
  console.log('🎨 Gerando imagem Open Graph / Twitter Card (1200x630)...');

  // 1. Redimensionar foto de feijoada / comida caseira para cobrir 1200x630
  const bgBuffer = await sharp(path.join(ASSETS_DIR, 'hero-food-1600.webp'))
    .resize(1200, 630, { fit: 'cover', position: 'center' })
    .toBuffer();

  // 2. Redimensionar o logo branco oficial
  const logoBuffer = await sharp(path.join(ASSETS_DIR, 'logo-white.png'))
    .resize(140, 140)
    .toBuffer();

  // 3. Gerar overlay SVG com gradiente protetor de contraste e tipografia de alto impacto
  const svgOverlay = `
  <svg width="1200" height="630" viewBox="0 0 1200 630" xmlns="http://www.w3.org/2000/svg">
    <defs>
      <!-- Gradiente escuro da esquerda para a direita para legibilidade do texto -->
      <linearGradient id="scrim" x1="0" y1="0" x2="1" y2="0">
        <stop offset="0%" stop-color="#1A0D06" stop-opacity="0.94" />
        <stop offset="45%" stop-color="#23140C" stop-opacity="0.82" />
        <stop offset="75%" stop-color="#23140C" stop-opacity="0.35" />
        <stop offset="100%" stop-color="#23140C" stop-opacity="0.15" />
      </linearGradient>
      <!-- Borda decorativa interna -->
      <filter id="shadow" x="-10%" y="-10%" width="120%" height="120%">
        <feDropShadow dx="0" dy="4" stdDeviation="6" flood-color="#000000" flood-opacity="0.6" />
      </filter>
    </defs>

    <!-- Fundo gradiente -->
    <rect width="1200" height="630" fill="url(#scrim)" />

    <!-- Borda decorativa refinada de 16px ao redor da imagem -->
    <rect x="20" y="20" width="1160" height="590" fill="none" stroke="#C8882A" stroke-width="2" stroke-opacity="0.45" rx="4" />

    <!-- Tag superior de categoria -->
    <g transform="translate(70, 210)">
      <rect x="0" y="0" width="280" height="34" rx="17" fill="#8F361F" />
      <text x="140" y="22" font-family="'Lato', Arial, sans-serif" font-size="14" font-weight="700" fill="#FFFDF9" text-anchor="middle" letter-spacing="1.5">
        SELF-SERVICE POR KG
      </text>
    </g>

    <!-- Título Principal com alto contraste -->
    <text x="70" y="295" font-family="'Georgia', serif" font-size="52" font-weight="700" fill="#FFFDF9" filter="url(#shadow)">
      Mirolo Restaurante
    </text>

    <!-- Subtítulo afetivo -->
    <text x="70" y="355" font-family="'Georgia', serif" font-size="32" font-style="italic" fill="#E4CBAB">
      O Almoço com Alma de Domingo
    </text>

    <!-- Linha divisória de detalhe -->
    <line x1="70" y1="385" x2="480" y2="385" stroke="#C8882A" stroke-width="2" opacity="0.6" />

    <!-- Ícone de localização vetorial e endereço -->
    <g transform="translate(70, 410)">
      <path d="M7 0C3.13 0 0 3.13 0 7c0 5.25 7 13 7 13s7-7.75 7-13c0-3.87-3.13-7-7-7zm0 9.5c-1.38 0-2.5-1.12-2.5-2.5s1.12-2.5 2.5-2.5 2.5 1.12 2.5 2.5-1.12 2.5-2.5 2.5z" fill="#C8882A" />
      <text x="24" y="14" font-family="'Lato', Arial, sans-serif" font-size="20" font-weight="700" fill="#F7EFE1">
        R. Esperico, 60 • Jardim do Mar, São Bernardo do Campo
      </text>
    </g>
    <text x="70" y="460" font-family="'Lato', Arial, sans-serif" font-size="18" fill="#E4CBAB">
      Segunda a Sábado das 11:30 às 15:00 • Tel: (11) 2758-2354
    </text>

    <!-- Selo de destaque: Sobremesa Cortesia -->
    <g transform="translate(70, 500)">
      <rect x="0" y="0" width="360" height="42" rx="4" fill="#3C2212" stroke="#C8882A" stroke-width="1.5" />
      <text x="180" y="27" font-family="'Lato', Arial, sans-serif" font-size="16" font-weight="700" fill="#F6E9A8" text-anchor="middle" letter-spacing="1">
        ✦ BUFFET VARIADO &amp; SOBREMESA CORTESIA
      </text>
    </g>
  </svg>
  `;

  const svgBuffer = Buffer.from(svgOverlay);

  // 4. Compositar tudo junto
  const finalImage = sharp(bgBuffer)
    .composite([
      { input: svgBuffer, top: 0, left: 0 },
      { input: logoBuffer, top: 50, left: 70 }
    ]);

  // Salvar JPEG universal (máxima compatibilidade com Facebook, WhatsApp, Twitter, LinkedIn)
  await finalImage
    .clone()
    .jpeg({ quality: 88, mozjpeg: true })
    .toFile(OUTPUT_JPG);

  // Salvar WebP também
  await finalImage
    .clone()
    .webp({ quality: 88, effort: 6 })
    .toFile(OUTPUT_WEBP);

  const jpgStats = fs.statSync(OUTPUT_JPG);
  console.log(`✅ og-image.jpg gerado com sucesso: ${OUTPUT_JPG} (${Math.round(jpgStats.size / 1024)} KiB, 1200x630)`);
}

generateOgImage().catch(err => {
  console.error('❌ Falha ao gerar OG image:', err);
  process.exit(1);
});
