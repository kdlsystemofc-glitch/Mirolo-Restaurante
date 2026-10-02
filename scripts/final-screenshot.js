// scripts/final-screenshot.js
// Captures final full page screenshots at 1440, 768, and 390px
const { chromium } = require('playwright');
const path = require('path');
const fs = require('fs');

const ROOT = path.join(__dirname, '..');
const SCREENSHOTS = path.join(ROOT, 'screenshots');
fs.mkdirSync(SCREENSHOTS, { recursive: true });

const FILE = `file://${path.join(ROOT, 'site', 'index.html').replace(/\\/g, '/')}`;
const WIDTHS = [1440, 768, 390];

async function run() {
  const browser = await chromium.launch();
  for (const w of WIDTHS) {
    const page = await browser.newPage();
    await page.setViewportSize({ width: w, height: 900 });
    await page.goto(FILE, { waitUntil: 'networkidle' });

    const outPath = path.join(SCREENSHOTS, `final_full_${w}.png`);
    await page.screenshot({ path: outPath, fullPage: true });
    console.log(`📸 Saved final full page at ${w}px -> ${outPath}`);
    await page.close();
  }
  await browser.close();
  console.log('✅ All final screenshots captured.');
}

run();
