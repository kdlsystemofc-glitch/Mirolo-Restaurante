/**
 * scripts/build-hero-bg.js
 *
 * Gera o background do hero:
 *  - Redimensiona plate-hero-perspective.jpg para 1600×600 (landscape banner)
 *  - Adiciona fade horizontal SUTIL apenas nas bordas laterais (últimos 8%)
 *    para fundir com o fundo da madeira (cor #5C3A1E)
 *  - Salva em múltiplos breakpoints: 1600, 1200, 800, 480
 *
 * NÃO faz fade vertical — não existe seam em cima ou embaixo.
 */

const sharp = require('sharp');
const path  = require('path');
const fs    = require('fs');

const SRC  = path.join(__dirname, '..', 'design', 'plates', 'plate-hero-perspective.jpg');
const DEST = path.join(__dirname, '..', 'site', 'assets');

const BREAKPOINTS = [
  { suffix: '1600', w: 1600, h: 620 },
  { suffix: '1200', w: 1200, h: 465 },
  { suffix: '800',  w: 800,  h: 310 },
  { suffix: '480',  w: 480,  h: 260 },
];

// fade lateral: nos últimos `pct`% de cada lado, vai de opaco→transparente
const FADE_PCT = 0.05; // 5% em cada lado

async function buildHeroBackground() {
  fs.mkdirSync(DEST, { recursive: true });

  for (const bp of BREAKPOINTS) {
    const { suffix, w, h } = bp;

    // 1. Redimensionar + crop centrado
    const raw = await sharp(SRC)
      .resize(w, h, { fit: 'cover', position: 'center' })
      .ensureAlpha()
      .raw()
      .toBuffer({ resolveWithObject: true });

    const { data, info } = raw;
    const { width, height, channels } = info;
    const fadePixels = Math.round(width * FADE_PCT);

    // 2. Aplicar fade lateral de alpha (horizontal apenas)
    for (let y = 0; y < height; y++) {
      for (let x = 0; x < width; x++) {
        const idx = (y * width + x) * channels;
        let alpha = data[idx + 3];

        if (x < fadePixels) {
          // lado esquerdo: 0→1 do pixel 0→fadePixels
          alpha = Math.round(alpha * (x / fadePixels));
        } else if (x > width - 1 - fadePixels) {
          // lado direito: 1→0
          alpha = Math.round(alpha * ((width - 1 - x) / fadePixels));
        }

        data[idx + 3] = alpha;
      }
    }

    // 3. Salvar como WebP
    const out = path.join(DEST, `hero-bg-${suffix}.webp`);
    await sharp(data, { raw: { width, height, channels } })
      .webp({ quality: 88, effort: 4 })
      .toFile(out);

    const size = fs.statSync(out).size;
    console.log(`✅ hero-bg-${suffix}.webp — ${w}×${h} — ${(size / 1024).toFixed(0)} KiB`);
  }

  console.log('\nDone. Use como background-image da .hero__table-surface.');
}

buildHeroBackground().catch(e => { console.error(e); process.exit(1); });
