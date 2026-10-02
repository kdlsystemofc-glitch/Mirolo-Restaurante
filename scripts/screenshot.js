// scripts/screenshot.js
// Usage: node scripts/screenshot.js <sectionName>
// sectionName: hero | bolinho | buffet | depoimentos | footer | all
const { chromium } = require('playwright');
const path = require('path');
const fs = require('fs');

const ROOT = path.join(__dirname, '..');
const SCREENSHOTS = path.join(ROOT, 'screenshots');
fs.mkdirSync(SCREENSHOTS, { recursive: true });

const FILE = `file://${path.join(ROOT, 'site', 'index.html').replace(/\\/g, '/')}`;
const WIDTHS = [1440, 390];

const SECTION_CONFIG = {
  hero: {
    selector: '#hero',
    prevSelector: null
  },
  bolinho: {
    selector: '#bolinho',
    prevSelector: '#hero'
  },
  buffet: {
    selector: '#buffet',
    prevSelector: '#bolinho'
  },
  depoimentos: {
    selector: '#depoimentos',
    prevSelector: '#buffet'
  },
  footer: {
    selector: '#footer-main',
    prevSelector: '#depoimentos'
  }
};

const target = process.argv[2] || 'all';

async function run() {
  const browser = await chromium.launch();
  const list = target === 'all' ? Object.keys(SECTION_CONFIG) : [target];

  for (const name of list) {
    const cfg = SECTION_CONFIG[name];
    if (!cfg) continue;

    for (const w of WIDTHS) {
      const page = await browser.newPage();
      await page.setViewportSize({ width: w, height: 900 });
      await page.goto(FILE, { waitUntil: 'networkidle' });

      // 1. Isolated section
      const el = page.locator(cfg.selector);
      if (await el.count() > 0) {
        await el.screenshot({
          path: path.join(SCREENSHOTS, `${name}_${w}_isolated.png`)
        });
        console.log(`📸 ${name} ${w}px isolated saved`);
      }

      // 2. Full page
      await page.screenshot({
        path: path.join(SCREENSHOTS, `${name}_${w}_full.png`),
        fullPage: true
      });
      console.log(`📸 ${name} ${w}px full saved`);

      // 3. Seam / transition with previous section
      if (cfg.prevSelector) {
        try {
          const prevBox = await page.locator(cfg.prevSelector).boundingBox();
          const currBox = await page.locator(cfg.selector).boundingBox();
          if (prevBox && currBox) {
            const clipY = Math.max(0, currBox.y - 250);
            const clipH = Math.min(500, currBox.y + 250 - clipY);
            await page.screenshot({
              path: path.join(SCREENSHOTS, `${name}_${w}_seam.png`),
              clip: {
                x: 0,
                y: clipY,
                width: w,
                height: clipH
              }
            });
            console.log(`📸 ${name} ${w}px seam saved`);
          }
        } catch (err) {
          console.warn(`Seam screenshot error: ${err.message}`);
        }
      }

      await page.close();
    }
  }

  await browser.close();
  console.log('Done with screenshots.');
}

run();
