const sharp = require('sharp');
const path = require('path');
const fs = require('fs');

const ASSETS_DIR = path.join(__dirname, '..', 'site', 'assets');

async function optimizeImages() {
  console.log('🖼️ Gerando degraus otimizados de imagens para mobile via Sharp...');

  // 1. Hero Food 480px (LCP Candidate)
  console.log('1. Gerando hero-food-480.webp...');
  await sharp(path.join(ASSETS_DIR, 'hero-food-1600.webp'))
    .resize(480)
    .webp({ quality: 82, effort: 6 })
    .toFile(path.join(ASSETS_DIR, 'hero-food-480.webp'));

  // 2. Texture Wood Table 480px (Mobile hero background)
  console.log('2. Gerando texture-wood-table-480.webp...');
  await sharp(path.join(ASSETS_DIR, 'texture-wood-table-1600.webp'))
    .resize(480)
    .webp({ quality: 80, effort: 6 })
    .toFile(path.join(ASSETS_DIR, 'texture-wood-table-480.webp'));

  // 3. Bolinho 500px
  console.log('3. Gerando bolinho-500.webp...');
  await sharp(path.join(ASSETS_DIR, 'bolinho-800.webp'))
    .resize(500)
    .webp({ quality: 82, effort: 6 })
    .toFile(path.join(ASSETS_DIR, 'bolinho-500.webp'));

  // 4. Polaroids 400px (exibição real 170-205px)
  const polaroids = [
    'chef-arms-crossed',
    'buffet-salada',
    'chef-merengue',
    'buffet-quentes',
    'chef-blue-ext',
    'buffet-torresmo',
    'sobremesas'
  ];

  for (const name of polaroids) {
    console.log(`4. Gerando ${name}-400.webp...`);
    const src = path.join(ASSETS_DIR, `${name}-600.webp`);
    if (fs.existsSync(src)) {
      await sharp(src)
        .resize(400)
        .webp({ quality: 80, effort: 6 })
        .toFile(path.join(ASSETS_DIR, `${name}-400.webp`));
    }
  }

  console.log('✅ Todos os degraus móveis de imagem foram gerados com sucesso!');
}

optimizeImages().catch(err => {
  console.error('❌ Falha:', err);
  process.exit(1);
});
