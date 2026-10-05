const sharp = require('sharp');
const path = require('path');
const fs = require('fs');

async function generateSeamlessHero() {
  const foodSrc = path.join(__dirname, '../design/plates/plate-hero-perspective.jpg');
  const foodMeta = await sharp(foodSrc).metadata();
  console.log('Food metadata:', foodMeta.width, foodMeta.height);

  // We want to create a wide canvas (1600x572 and 1920x572) where:
  // - The food photo is centered (or 1024 wide in the center)
  // - The left side (0 to ~300) is filled with the exact wood texture from the left of the photo
  // - The right side is filled with the exact wood texture from the right of the photo
  // - The transitions are feathered seamlessly so it is ONE continuous photograph of a wide table!

  // Sample left wood (x: 0 to 120)
  const leftWood = await sharp(foodSrc)
    .extract({ left: 0, top: 0, width: 100, height: foodMeta.height })
    .toBuffer();

  // Sample right wood (x: 924 to 1024)
  const rightWood = await sharp(foodSrc)
    .extract({ left: 924, top: 0, width: 100, height: foodMeta.height })
    .toBuffer();

  console.log('Wood samples ready');
}

generateSeamlessHero().catch(console.error);
