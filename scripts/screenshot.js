// scripts/screenshot.js
// Usage: node scripts/screenshot.js [sectionId]
// sectionId: hero | bolinho | buffet | depoimentos | footer | full
// Captures section + full page at 1440 and 390px, saves to screenshots/

const { chromium } = require('playwright');
const path = require('path');
const fs = require('fs');

const ROOT = path.join(__dirname, '..');
const SCREENSHOTS = path.join(ROOT, 'screenshots');
fs.mkdirSync(SCREENSHOTS, { recursive: true });

const FILE = `file://${path.join(ROOT, 'site', 'index.html').replace(/\\/g, '/')}`;
const WIDTHS = [1440, 390];

const SECTIONS = {
  hero:         '#hero',
  bolinho:      '#bolinho',
  buffet:       '#buffet',
  depoimentos:  '#depoimentos',
  footer:       '#footer-main',
  full:         null,
};

const target = process.argv[2] || 'full';
const selector = SECTIONS[target];

(async () => {
  const browser = await chromium.launch();
  const stamp = new Date().toISOString().replace(/[:.]/g, '-').slice(0, 19);

  for (const width of WIDTHS) {
    const page = await browser.newPage();
    await page.setViewportSize({ width, height: 900 });
    await page.goto(FILE, { waitUntil: 'networkidle' });

    // Full page always
    await page.screenshot({
      path: path.join(SCREENSHOTS, `${stamp}_full_${width}.png`),
      fullPage: true,
    });
    console.log(`📸 full page ${width}px saved`);

    // Section if requested
    if (selector) {
      try {
        const el = page.locator(selector);
        await el.screenshot({
          path: path.join(SCREENSHOTS, `${stamp}_${target}_${width}.png`),
        });
        console.log(`📸 ${target} ${width}px saved`);
      } catch (e) {
        console.warn(`⚠️ Could not screenshot ${selector}: ${e.message}`);
      }
    }

    await page.close();
  }

  await browser.close();
  console.log('✅ Done. Screenshots in ./screenshots/');
})();
