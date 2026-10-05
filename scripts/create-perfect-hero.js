const sharp = require('sharp');
const path = require('path');
const fs = require('fs');

async function createPerfectHero() {
  console.log('🪵 Gerando nova mesa unificada inspirada fielmente no modelo de referência...');

  const foodSrc = path.join(__dirname, '../design/plates/plate-hero-perspective.jpg');
  const foodMeta = await sharp(foodSrc).metadata();

  // 1. Amostrar tábua de madeira limpa superior do plate-hero (y: 0 a 80, sem pratos)
  // para criar a extensão contínua de madeira no tom exato da foto
  const cleanWoodStrip = await sharp(foodSrc)
    .extract({ left: 0, top: 0, width: foodMeta.width, height: 90 })
    .toBuffer();

  // Gerar fundo de bancada contínua 1600x480 no tom idêntico ao prato
  const woodTable1600 = await sharp(cleanWoodStrip)
    .resize(1600, 480, { fit: 'fill' })
    .modulate({ brightness: 1.02, saturation: 1.05 })
    .webp({ quality: 90 })
    .toFile(path.join(__dirname, '../site/assets/texture-wood-table-1600.webp'));

  const woodTable800 = await sharp(cleanWoodStrip)
    .resize(800, 240, { fit: 'fill' })
    .modulate({ brightness: 1.02, saturation: 1.05 })
    .webp({ quality: 88 })
    .toFile(path.join(__dirname, '../site/assets/texture-wood-table-800.webp'));

  const woodTable480 = await sharp(cleanWoodStrip)
    .resize(480, 200, { fit: 'fill' })
    .modulate({ brightness: 1.02, saturation: 1.05 })
    .webp({ quality: 85 })
    .toFile(path.join(__dirname, '../site/assets/texture-wood-table-480.webp'));

  console.log('✅ Nova textura de madeira unificada gerada para 1600, 800 e 480.');

  // 2. Processar a imagem de comida (hero-food):
  // Não usar máscara oval! As bordas laterais suavizam de forma suave na madeira idêntica
  // O topo e o rodapé da foto permanecem 100% contínuos com a bancada.
  const w = foodMeta.width;
  const h = foodMeta.height;
  const rawFood = await sharp(foodSrc).raw().toBuffer({ resolveWithObject: true });
  const rgbaBuffer = Buffer.alloc(w * h * 4);

  for (let y = 0; y < h; y++) {
    for (let x = 0; x < w; x++) {
      let alpha = 255;
      // Fade suave apenas nas pontas extremas horizontais (onde a madeira se estende)
      if (x < 120) {
        alpha = Math.round(255 * Math.pow(x / 120, 1.2));
      } else if (x > w - 120) {
        alpha = Math.round(255 * Math.pow((w - x) / 120, 1.2));
      }
      const idx = (y * w + x) * 4;
      const srcIdx = (y * w + x) * 3;
      rgbaBuffer[idx] = rawFood.data[srcIdx];
      rgbaBuffer[idx + 1] = rawFood.data[srcIdx + 1];
      rgbaBuffer[idx + 2] = rawFood.data[srcIdx + 2];
      rgbaBuffer[idx + 3] = alpha;
    }
  }

  const processedFood = sharp(rgbaBuffer, {
    raw: { width: w, height: h, channels: 4 }
  });

  // Salvar degraus responsivos da foto de comida assentada naturalmente
  await processedFood.clone()
    .resize(1600, Math.round(1600 * (h / w)))
    .webp({ quality: 90 })
    .toFile(path.join(__dirname, '../site/assets/hero-food-1600.webp'));

  await processedFood.clone()
    .resize(1200, Math.round(1200 * (h / w)))
    .webp({ quality: 88 })
    .toFile(path.join(__dirname, '../site/assets/hero-food-1200.webp'));

  await processedFood.clone()
    .resize(800, Math.round(800 * (h / w)))
    .webp({ quality: 85 })
    .toFile(path.join(__dirname, '../site/assets/hero-food-800.webp'));

  await processedFood.clone()
    .resize(480, Math.round(480 * (h / w)))
    .webp({ quality: 85 })
    .toFile(path.join(__dirname, '../site/assets/hero-food-480.webp'));

  console.log('✅ Novos degraus de hero-food gerados com transição lateral orgânica.');
}

createPerfectHero().catch(console.error);
