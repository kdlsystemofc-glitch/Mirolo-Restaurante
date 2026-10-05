const sharp = require('sharp');
const path = require('path');

async function buildSeamlessTable() {
  const srcPath = path.join(__dirname, '../design/plates/plate-hero-perspective.jpg');
  const meta = await sharp(srcPath).metadata();
  
  // 1. Extract clean wood sample from top-left of the table
  const woodSample = await sharp(srcPath)
    .extract({ left: 0, top: 0, width: 80, height: meta.height })
    .toBuffer();

  const woodSampleRight = await sharp(srcPath)
    .extract({ left: meta.width - 80, top: 0, width: 80, height: meta.height })
    .toBuffer();

  console.log('Wood samples extracted');
}

buildSeamlessTable();
