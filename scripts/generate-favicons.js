const sharp = require('sharp');
const path = require('path');
const fs = require('fs');

const SITE_DIR = path.join(__dirname, '..', 'site');
const LOGO_SRC = path.join(SITE_DIR, 'assets', 'logo.png');

function createIco(pngImages) {
  const header = Buffer.alloc(6);
  header.writeUInt16LE(0, 0);
  header.writeUInt16LE(1, 2);
  header.writeUInt16LE(pngImages.length, 4);

  let offset = 6 + (pngImages.length * 16);
  const dirEntries = [];
  const imageBuffers = [];

  for (const img of pngImages) {
    const entry = Buffer.alloc(16);
    entry.writeUInt8(img.width >= 256 ? 0 : img.width, 0);
    entry.writeUInt8(img.height >= 256 ? 0 : img.height, 1);
    entry.writeUInt8(0, 2);
    entry.writeUInt8(0, 3);
    entry.writeUInt16LE(1, 4);
    entry.writeUInt16LE(32, 6);
    entry.writeUInt32LE(img.buffer.length, 8);
    entry.writeUInt32LE(offset, 12);
    dirEntries.push(entry);
    imageBuffers.push(img.buffer);
    offset += img.buffer.length;
  }

  return Buffer.concat([header, ...dirEntries, ...imageBuffers]);
}

async function generateFavicons() {
  console.log('🎨 Gerando conjunto completo de favicons e manifest...');

  const trimmedLogo = await sharp(LOGO_SRC).trim().toBuffer();

  // Helper para criar ícone sobre fundo redondo ou quadrado acolhedor
  async function makeIcon(size, paddingRatio = 0.15, bgHex = null) {
    const innerSize = Math.round(size * (1 - paddingRatio * 2));
    const resizedLogo = await sharp(trimmedLogo)
      .resize(innerSize, innerSize, { fit: 'inside' })
      .toBuffer();

    let base = sharp({
      create: {
        width: size,
        height: size,
        channels: 4,
        background: bgHex ? bgHex : { r: 0, g: 0, b: 0, alpha: 0 }
      }
    });

    return base
      .composite([{ input: resizedLogo, gravity: 'center' }])
      .png()
      .toBuffer();
  }

  const p16 = await makeIcon(16, 0.05);
  const p32 = await makeIcon(32, 0.08);
  const p48 = await makeIcon(48, 0.10);
  const p180 = await makeIcon(180, 0.12, { r: 247, g: 239, b: 225, alpha: 1 }); // #F7EFE1 para Apple Touch
  const p192 = await makeIcon(192, 0.12, { r: 247, g: 239, b: 225, alpha: 1 });
  const p512 = await makeIcon(512, 0.12, { r: 247, g: 239, b: 225, alpha: 1 });

  fs.writeFileSync(path.join(SITE_DIR, 'favicon-16x16.png'), p16);
  fs.writeFileSync(path.join(SITE_DIR, 'favicon-32x32.png'), p32);
  fs.writeFileSync(path.join(SITE_DIR, 'apple-touch-icon.png'), p180);
  fs.writeFileSync(path.join(SITE_DIR, 'android-chrome-192x192.png'), p192);
  fs.writeFileSync(path.join(SITE_DIR, 'android-chrome-512x512.png'), p512);

  // Favicon.ico multi-resolução (16x16, 32x32, 48x48)
  const icoBuffer = createIco([
    { width: 16, height: 16, buffer: p16 },
    { width: 32, height: 32, buffer: p32 },
    { width: 48, height: 48, buffer: p48 }
  ]);
  fs.writeFileSync(path.join(SITE_DIR, 'favicon.ico'), icoBuffer);

  // site.webmanifest
  const manifest = {
    name: "Mirolo Restaurante — O Almoço com Alma de Domingo",
    short_name: "Mirolo",
    description: "Restaurante self-service por quilo com comida caseira em São Bernardo do Campo.",
    start_url: "/",
    display: "standalone",
    background_color: "#F7EFE1",
    theme_color: "#3C2212",
    icons: [
      {
        src: "android-chrome-192x192.png",
        sizes: "192x192",
        type: "image/png"
      },
      {
        src: "android-chrome-512x512.png",
        sizes: "512x512",
        type: "image/png"
      }
    ]
  };

  fs.writeFileSync(
    path.join(SITE_DIR, 'site.webmanifest'),
    JSON.stringify(manifest, null, 2),
    'utf8'
  );

  console.log('✅ Favicons e site.webmanifest gerados com sucesso em site/!');
}

generateFavicons().catch(err => {
  console.error('❌ Falha:', err);
  process.exit(1);
});
