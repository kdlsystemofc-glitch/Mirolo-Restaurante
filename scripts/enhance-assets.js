const sharp = require('sharp');
const path = require('path');
const fs = require('fs');

async function processImages() {
  const root = path.join(__dirname, '..');
  const assetsDir = path.join(root, 'site', 'assets');

  // 1. Process new Hero Perspective Plate
  for (const w of [800, 1600]) {
    await sharp(path.join(root, 'design/plates/plate-hero-perspective.jpg'))
      .resize(w, null, { withoutEnlargement: true })
      .webp({ quality: 88 })
      .toFile(path.join(assetsDir, `hero-food-${w}.webp`));
    console.log(`Updated hero-food-${w}.webp`);
  }

  // 2. Process Recipe Sketch Plate
  for (const w of [500, 800]) {
    await sharp(path.join(root, 'design/plates/plate-recipe-sketch.jpg'))
      .resize(w, null, { withoutEnlargement: true })
      .webp({ quality: 88 })
      .toFile(path.join(assetsDir, `recipe-sketch-${w}.webp`));
    console.log(`Created recipe-sketch-${w}.webp`);
  }

  // 3. Process and color-grade Buffet Photos (Cropping watermark at bottom and boosting vibrance)
  const buffetSources = [
    { in: 'imagens/imgi_21_625107992_18108351715731418_7739018170723431962_n.jpg', out: 'buffet-salada' },
    { in: 'imagens/imgi_13_426473415_18293013925156792_2849356420887757564_n.jpg', out: 'chef-merengue' },
    { in: 'imagens/imgi_43_623294700_17990538785916250_2897129099803608199_n.jpg', out: 'buffet-quentes' },
    { in: 'imagens/imgi_18_432929647_18296247661156792_3109168439601538929_n.jpg', out: 'chef-blue-ext' },
    { in: 'imagens/imgi_30_622094764_18070333856164671_8247170188791487313_n.jpg', out: 'buffet-torresmo' },
    { in: 'imagens/imgi_40_626416011_18084567193942648_8403504670851462413_n.jpg', out: 'sobremesas' },
    { in: 'imagens/imgi_41_623358524_18100918831677251_8316788417836461602_n.jpg', out: 'chef-arms-crossed' },
    { in: 'imagens/imgi_57_361169282_18264153472156792_2624378100428075689_n.jpg', out: 'chef-merengue2' }
  ];

  for (const item of buffetSources) {
    const srcPath = path.join(root, item.in);
    const meta = await sharp(srcPath).metadata();
    
    // Crop 10% from bottom to cleanly eliminate the watermark and keep the food prominent
    const cropH = Math.round(meta.height * 0.88);
    const cropW = Math.round(meta.width * 0.96);
    const left = Math.round((meta.width - cropW) / 2);

    for (const w of [600, 800]) {
      await sharp(srcPath)
        .extract({ left: left, top: 0, width: cropW, height: cropH })
        .modulate({ brightness: 1.06, saturation: 1.25 })
        .resize(w, w, { fit: 'cover' })
        .webp({ quality: 86 })
        .toFile(path.join(assetsDir, `${item.out}-${w}.webp`));
    }
    console.log(`Processed & enhanced ${item.out}`);
  }
}

processImages().then(() => console.log('All image processing complete!'));
