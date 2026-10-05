const sharp = require('sharp');
const path = require('path');
const fs = require('fs');

async function processTextures() {
  console.log('🔄 Processando novas texturas...');

  // 1. Textura de linho cru para o fundo geral
  const linhoSrc = path.join(__dirname, '../design/plates/plate-textura-linho.jpg');
  const linhoOut = path.join(__dirname, '../site/assets/texture-linen.webp');

  await sharp(linhoSrc)
    .webp({ quality: 85 })
    .toFile(linhoOut);
  console.log('✅ Linho gerado:', linhoOut);

  // 2. Textura da bancada de madeira limpa
  const woodSrc = path.join(__dirname, '../design/plates/crop-table-clean.png');
  const wood1600 = path.join(__dirname, '../site/assets/texture-wood-table-1600.webp');
  const wood800 = path.join(__dirname, '../site/assets/texture-wood-table-800.webp');

  await sharp(woodSrc)
    .resize(1600, 480, { fit: 'fill' })
    .webp({ quality: 88 })
    .toFile(wood1600);
  console.log('✅ Madeira 1600 gerada:', wood1600);

  await sharp(woodSrc)
    .resize(800, 240, { fit: 'fill' })
    .webp({ quality: 85 })
    .toFile(wood800);
  console.log('✅ Madeira 800 gerada:', wood800);

  console.log('🎉 Todas as novas texturas foram processadas com sucesso!');
}

processTextures().catch(err => {
  console.error('Erro ao processar texturas:', err);
  process.exit(1);
});
