const { chromium } = require('playwright');
const path = require('path');
const FILE_URL = `file://${path.join(__dirname, '../site/index.html').replace(/\\/g, '/')}`;

async function check() {
  const browser = await chromium.launch();
  for (const w of [1024, 390]) {
    const page = await browser.newPage();
    await page.setViewportSize({ width: w, height: 768 });
    await page.goto(FILE_URL, { waitUntil: 'networkidle' });

    const overflowing = await page.evaluate((vpWidth) => {
      const results = [];
      document.querySelectorAll('*').forEach(el => {
        const r = el.getBoundingClientRect();
        // Check if element causes scrollWidth to exceed clientWidth
        if (r.right > vpWidth) {
          results.push({
            tag: el.tagName,
            class: el.className,
            id: el.id,
            right: Math.round(r.right),
            excess: Math.round(r.right - vpWidth)
          });
        }
      });
      return results;
    }, w);

    console.log(`\n=== Width: ${w}px (Found ${overflowing.length} overflowing elements) ===`);
    overflowing.forEach(o => console.log(`  <${o.tag} class="${o.class}"> -> right: ${o.right}px (+${o.excess}px)`));

    await page.close();
  }
  await browser.close();
}

check().catch(console.error);
