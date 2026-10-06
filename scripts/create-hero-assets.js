// scripts/create-hero-assets.js
const sharp = require('sharp');
const fs = require('fs');
const path = require('path');

async function createAssets() {
  console.log('Criando assets isolados do Hero...');

  // 1. Red Stamp SOBREMESA CORTESIA
  const stampSvg = `
<svg width="280" height="130" viewBox="0 0 280 130" xmlns="http://www.w3.org/2000/svg">
  <rect x="6" y="6" width="268" height="118" rx="3" fill="none" stroke="#A8231E" stroke-width="4.5" stroke-dasharray="10 5" opacity="0.92"/>
  <rect x="14" y="14" width="252" height="102" rx="2" fill="none" stroke="#A8231E" stroke-width="2" opacity="0.85"/>
  <text x="140" y="58" font-family="'Cormorant Garamond', Georgia, serif" font-size="28" font-weight="700" fill="#A8231E" text-anchor="middle" letter-spacing="3">SOBREMESA</text>
  <text x="140" y="98" font-family="'Cormorant Garamond', Georgia, serif" font-size="32" font-weight="700" fill="#A8231E" text-anchor="middle" letter-spacing="4">CORTESIA</text>
</svg>
`;

  await sharp(Buffer.from(stampSvg))
    .png()
    .toFile('site/assets/hero-stamp-cortesia.png');
  console.log('✅ hero-stamp-cortesia.png gerado');

  // 2. Right Note Card: "Receita do chef"
  const noteSvg = `
<svg width="420" height="560" viewBox="0 0 420 560" xmlns="http://www.w3.org/2000/svg">
  <!-- Washi tape at top -->
  <polygon points="130,4 290,1 285,32 125,35" fill="#E8DCB8" opacity="0.88" />

  <!-- White lined paper background -->
  <polygon points="12,30 408,24 402,548 18,552" fill="#FFFDF9" filter="drop-shadow(0 4px 12px rgba(40,20,10,0.18))"/>
  
  <!-- Subtle lines -->
  <g stroke="rgba(180, 195, 215, 0.45)" stroke-width="1.2">
    <line x1="30" y1="130" x2="390" y2="130" />
    <line x1="30" y1="175" x2="390" y2="175" />
    <line x1="30" y1="220" x2="390" y2="220" />
    <line x1="30" y1="265" x2="390" y2="265" />
    <line x1="30" y1="310" x2="390" y2="310" />
    <line x1="30" y1="355" x2="390" y2="355" />
    <line x1="30" y1="400" x2="390" y2="400" />
    <line x1="30" y1="445" x2="390" y2="445" />
    <line x1="30" y1="490" x2="390" y2="490" />
  </g>

  <!-- Title in script -->
  <text x="50" y="105" font-family="'Great Vibes', 'Brush Script MT', cursive" font-size="46" fill="#3A2010">Receita do chef</text>
  <line x1="50" y1="114" x2="280" y2="114" stroke="#8F361F" stroke-width="2" opacity="0.6"/>

  <!-- List items -->
  <g font-family="'Lato', sans-serif" font-size="21" font-weight="400" fill="#4A3425">
    <text x="50" y="168">– 1 dose de amor</text>
    <text x="50" y="213">– 1 toque de carinho</text>
    <text x="50" y="258">– Bolinho de espinafre</text>
    <text x="50" y="303">– Sobremesa caseira</text>
  </g>

  <!-- Pencil sketches of ingredients (garlic, onion, mushroom) at bottom right -->
  <g stroke="#6A5A4A" stroke-width="1.5" fill="none" opacity="0.55">
    <!-- Mushroom -->
    <path d="M 310,380 C 310,360 345,360 345,380 Z" />
    <path d="M 322,380 L 322,398 L 333,398 L 333,380" />
    <!-- Garlic -->
    <path d="M 360,400 C 350,380 370,365 375,360 C 380,365 400,380 390,400 C 380,410 370,410 360,400 Z" />
    <line x1="375" y1="360" x2="375" y2="350" />
  </g>
</svg>
`;

  await sharp(Buffer.from(noteSvg))
    .png()
    .toFile('site/assets/hero-note-right-transparent.png');
  console.log('✅ hero-note-right-transparent.png gerado');

  // 3. Responsive WebP versions for dishes
  const dishes = await sharp('site/assets/hero-dishes-transparent.png');
  const dMeta = await dishes.metadata();

  const dishSizes = [
    { name: '1200', w: Math.min(1129, dMeta.width) },
    { name: '800',  w: 800 },
    { name: '500',  w: 500 }
  ];

  for (const s of dishSizes) {
    const h = Math.round(s.w * (dMeta.height / dMeta.width));
    await sharp('site/assets/hero-dishes-transparent.png')
      .resize(s.w, h, { kernel: 'lanczos3' })
      .webp({ quality: 92, alphaQuality: 95 })
      .toFile(`site/assets/hero-dishes-${s.name}.webp`);
    console.log(`✅ hero-dishes-${s.name}.webp gerado (${s.w}x${h})`);
  }

  // 4. Responsive WebP for left note
  await sharp('site/assets/hero-note-left-transparent.png')
    .resize(400)
    .webp({ quality: 92 })
    .toFile('site/assets/hero-note-left.webp');
  console.log('✅ hero-note-left.webp gerado');

  // 5. Responsive WebP for right note
  await sharp('site/assets/hero-note-right-transparent.png')
    .resize(400)
    .webp({ quality: 92 })
    .toFile('site/assets/hero-note-right.webp');
  console.log('✅ hero-note-right.webp gerado');

  // 6. Responsive WebP for stamp
  await sharp('site/assets/hero-stamp-cortesia.png')
    .webp({ quality: 95 })
    .toFile('site/assets/hero-stamp-cortesia.webp');
  console.log('✅ hero-stamp-cortesia.webp gerado');

  console.log('\nTodos os assets isolados foram gerados com sucesso!');
}

createAssets().catch(console.error);
