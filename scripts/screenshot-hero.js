// scripts/screenshot-hero.js
// Tira screenshots focados no hero em 3 viewports para verificação rápida
const { chromium } = require('playwright');
const path = require('path');
const fs = require('fs');

const ROOT = path.join(__dirname, '..');
const OUT = path.join(ROOT, 'screenshots');
fs.mkdirSync(OUT, { recursive: true });

const FILE_URL = `file://${path.join(ROOT, 'site', 'index.html').replace(/\\/g, '/')}`;

const VIEWPORTS = [
  { name: 'desktop_1440', width: 1440, height: 900 },
  { name: 'tablet_768',   width: 768,  height: 1024 },
  { name: 'mobile_390',   width: 390,  height: 844 },
];

(async () => {
  const browser = await chromium.launch({ args: ['--allow-file-access-from-files'] });
  
  for (const vp of VIEWPORTS) {
    const page = await browser.newPage();
    await page.setViewportSize({ width: vp.width, height: vp.height });
    await page.goto(FILE_URL, { waitUntil: 'networkidle' });
    await page.waitForTimeout(800);
    
    // Full page screenshot
    const full = path.join(OUT, `hero_full_${vp.name}.png`);
    await page.screenshot({ path: full, fullPage: true });
    
    // Above-fold only
    const fold = path.join(OUT, `hero_fold_${vp.name}.png`);
    await page.screenshot({ path: fold, fullPage: false });
    
    console.log(`OK: ${vp.name}`);
    await page.close();
  }
  
  await browser.close();
  console.log('\nScreenshots salvos em:', OUT);
})();
