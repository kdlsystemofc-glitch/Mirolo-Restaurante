const sharp = require('sharp');
const path = require('path');
const fs = require('fs');

async function testHeroTable() {
  const foodPath = path.join(__dirname, '../design/plates/plate-hero-perspective.jpg');
  const meta = await sharp(foodPath).metadata();
  console.log('Original photo:', meta.width, 'x', meta.height);

  // 1. Let's sample a clean tileable section of the wood planks from the photo
  // The top area (y: 0 to 180) across the photo is clean horizontal wood grain
  const woodCrop = await sharp(foodPath)
    .extract({ left: 0, top: 0, width: meta.width, height: 200 })
    .toBuffer();

  // Resize and tile the wood to 1920x572
  const wideWood = await sharp(woodCrop)
    .resize(1920, 572, { fit: 'cover' })
    .toBuffer();

  // Create horizontal feathering mask for the food photo (1024x572)
  // Transparent at x: 0..80, Opaque at 80..944, Transparent at 944..1024
  // NO vertical oval mask! The table at the bottom and top stays 100% solid!
  const maskWidth = meta.width;
  const maskHeight = meta.height;
  const maskBuffer = Buffer.alloc(maskWidth * maskHeight * 4);

  for (let y = 0; y < maskHeight; y++) {
    for (let x = 0; x < maskWidth; x++) {
      let alpha = 255;
      // Soft horizontal feathering at extreme edges
      if (x < 100) {
        alpha = Math.round(255 * (x / 100));
      } else if (x > maskWidth - 100) {
        alpha = Math.round(255 * ((maskWidth - x) / 100));
      }
      const idx = (y * maskWidth + x) * 4;
      maskBuffer[idx] = 255;     // R
      maskBuffer[idx + 1] = 255; // G
      maskBuffer[idx + 2] = 255; // B
      maskBuffer[idx + 3] = alpha; // A
    }
  }

  // Apply alpha mask to the food image
  const rawFood = await sharp(foodPath).raw().toBuffer({ resolveWithObject: true });
  const rgbaFood = Buffer.alloc(maskWidth * maskHeight * 4);
  for (let i = 0; i < maskWidth * maskHeight; i++) {
    rgbaFood[i * 4] = rawFood.data[i * 3];
    rgbaFood[i * 4 + 1] = rawFood.data[i * 3 + 1];
    rgbaFood[i * 4 + 2] = rawFood.data[i * 3 + 2];
    rgbaFood[i * 4 + 3] = maskBuffer[i * 4 + 3];
  }

  const featheredFood = await sharp(rgbaFood, {
    raw: { width: maskWidth, height: maskHeight, channels: 4 }
  }).png().toBuffer();

  // Composite feathered food onto the wide wood background
  const composite1920 = await sharp(wideWood)
    .composite([
      {
        input: featheredFood,
        left: Math.round((1920 - maskWidth) / 2),
        top: 0
      }
    ])
    .png()
    .toFile('screenshots/test-unified-hero-1920.png');

  console.log('✅ Composite 1920 generated');
}

testHeroTable().catch(console.error);
