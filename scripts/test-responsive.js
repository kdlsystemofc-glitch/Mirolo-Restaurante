// scripts/test-responsive.js
const { chromium } = require('playwright');
const path = require('path');
const fs = require('fs');

const ROOT = path.join(__dirname, '..');
const SCREENSHOTS_DIR = path.join(ROOT, 'screenshots', 'responsive');
fs.mkdirSync(SCREENSHOTS_DIR, { recursive: true });

const FILE_URL = `file://${path.join(ROOT, 'site', 'index.html').replace(/\\/g, '/')}`;

const VIEWPORTS = [
  { name: '2560x1440_ultrawide', width: 2560, height: 1440 },
  { name: '1920x1080_fhd',       width: 1920, height: 1080 },
  { name: '1440x900_macbook',    width: 1440, height: 900  },
  { name: '1366x768_laptop',     width: 1366, height: 768  },
  { name: '1280x720_hd',         width: 1280, height: 720  },
  { name: '1024x768_ipad_land',  width: 1024, height: 768  },
  { name: '768x1024_ipad_port',  width: 768,  height: 1024 },
  { name: '430x932_iphone_max',  width: 430,  height: 932  },
  { name: '390x844_iphone_std',  width: 390,  height: 844  },
  { name: '360x740_android',     width: 360,  height: 740  },
  { name: '320x568_iphone_se',   width: 320,  height: 568  },
  { name: '844x390_mobile_land', width: 844,  height: 390  }
];

async function runResponsiveTests() {
  const browser = await chromium.launch({
    args: ['--allow-file-access-from-files']
  });
  const results = [];

  for (const vp of VIEWPORTS) {
    const page = await browser.newPage();
    const consoleErrors = [];

    page.on('console', msg => {
      if (msg.type() === 'error') consoleErrors.push(msg.text());
    });
    page.on('pageerror', err => consoleErrors.push(err.message));

    await page.setViewportSize({ width: vp.width, height: vp.height });
    await page.goto(FILE_URL, { waitUntil: 'networkidle' });

    // 1. Verificar rolagem horizontal da página
    const scrollInfo = await page.evaluate(() => {
      const docEl = document.documentElement;
      const body = document.body;
      const scrollWidth = Math.max(docEl.scrollWidth, body.scrollWidth);
      const clientWidth = docEl.clientWidth;
      const hasHorizontalScroll = scrollWidth > clientWidth;
      return { scrollWidth, clientWidth, hasHorizontalScroll };
    });

    // 2. Verificar alvos de toque interativos (mínimo 44x44px)
    const tapTargets = await page.evaluate(() => {
      const interactives = Array.from(document.querySelectorAll('a, button, input, select'));
      return interactives.map(el => {
        const rect = el.getBoundingClientRect();
        return {
          tag: el.tagName,
          text: (el.textContent || '').trim().substring(0, 30),
          width: Math.round(rect.width),
          height: Math.round(rect.height),
          valid: rect.width >= 44 && rect.height >= 44
        };
      });
    });

    // 3. Capturar screenshot completo
    const shotPath = path.join(SCREENSHOTS_DIR, `${vp.name}.png`);
    await page.screenshot({ path: shotPath, fullPage: true });

    const failedTargets = tapTargets.filter(t => !t.valid);

    const report = {
      viewport: vp.name,
      width: vp.width,
      height: vp.height,
      horizontalScroll: scrollInfo.hasHorizontalScroll,
      scrollDiff: scrollInfo.scrollWidth - scrollInfo.clientWidth,
      consoleErrors: consoleErrors.length,
      tapTargetIssues: failedTargets,
      screenshot: shotPath
    };

    results.push(report);

    const statusIcon = (!report.horizontalScroll && report.consoleErrors === 0 && failedTargets.length === 0) ? '✅' : '⚠️';
    console.log(`${statusIcon} ${vp.name} (${vp.width}x${vp.height}): Scroll H: ${report.horizontalScroll ? 'FALHOU (+' + report.scrollDiff + 'px)' : 'OK'} | Erros: ${report.consoleErrors} | Touch targets <44px: ${failedTargets.length}`);

    await page.close();
  }

  // 4. Teste específico: Zoom de texto a 200%
  console.log('\n🔍 Testando zoom de texto a 200%...');
  const zoomPage = await browser.newPage();
  await zoomPage.setViewportSize({ width: 1280, height: 800 });
  await zoomPage.goto(FILE_URL, { waitUntil: 'networkidle' });
  await zoomPage.evaluate(() => {
    document.documentElement.style.fontSize = '200%';
  });
  const zoomScroll = await zoomPage.evaluate(() => {
    return document.documentElement.scrollWidth > document.documentElement.clientWidth;
  });
  const zoomShot = path.join(SCREENSHOTS_DIR, 'zoom_200.png');
  await zoomPage.screenshot({ path: zoomShot, fullPage: true });
  console.log(`Zoom 200% Scroll H: ${zoomScroll ? 'FALHOU' : 'OK'}`);
  await zoomPage.close();

  // 5. Teste específico: Prefers-reduced-motion e Prefers-color-scheme
  console.log('\n🔍 Testando prefers-reduced-motion e prefers-color-scheme: dark...');
  const darkPage = await browser.newPage({
    colorScheme: 'dark',
    reducedMotion: 'reduce'
  });
  await darkPage.setViewportSize({ width: 1280, height: 800 });
  await darkPage.goto(FILE_URL, { waitUntil: 'networkidle' });
  const darkShot = path.join(SCREENSHOTS_DIR, 'dark_reduced_motion.png');
  await darkPage.screenshot({ path: darkShot, fullPage: true });
  console.log('✅ Dark mode & Reduced motion capturado.');
  await darkPage.close();

  await browser.close();

  // Salvar relatório JSON
  fs.writeFileSync(path.join(ROOT, 'screenshots', 'responsive-report.json'), JSON.stringify(results, null, 2));
  console.log('\n📄 Relatório salvo em screenshots/responsive-report.json');
}

runResponsiveTests().catch(err => {
  console.error('Erro nos testes responsivos:', err);
  process.exit(1);
});
