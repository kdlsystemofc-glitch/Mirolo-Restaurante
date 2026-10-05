const { chromium } = require('playwright');
const path = require('path');
const fs = require('fs');

const FILE_URL = `file://${path.resolve('site/index.html').replace(/\\/g, '/')}`;
const SCREENSHOTS_DIR = path.join(__dirname, '..', 'screenshots', 'motion');
fs.mkdirSync(SCREENSHOTS_DIR, { recursive: true });

async function testSectionMotion(sectionId, sectionSelector) {
  console.log(`\n🎬 Validando animações da seção: ${sectionId}...`);
  const browser = await chromium.launch();
  const page = await browser.newPage();
  await page.setViewportSize({ width: 1440, height: 900 });

  const consoleErrors = [];
  page.on('console', msg => {
    if (msg.type() === 'error') consoleErrors.push(msg.text());
  });
  page.on('pageerror', err => consoleErrors.push(err.message));

  await page.goto(FILE_URL, { waitUntil: 'load' });

  // 1. Captura de quadros da entrada
  console.log('1. Capturando quadros-chave da entrada...');
  await page.waitForTimeout(150);
  await page.screenshot({ path: path.join(SCREENSHOTS_DIR, `${sectionId}_frame_early.png`) });
  await page.waitForTimeout(400);
  await page.screenshot({ path: path.join(SCREENSHOTS_DIR, `${sectionId}_frame_mid.png`) });
  await page.waitForTimeout(1200); // Assentamento completo
  const settledShot = path.join(SCREENSHOTS_DIR, `${sectionId}_settled.png`);
  await page.screenshot({ path: settledShot });

  // 2. Teste de navegação rápida (pular/voltar)
  console.log('2. Testando navegação rápida (scroll rápido)...');
  await page.evaluate(() => window.scrollTo(0, document.body.scrollHeight));
  await page.waitForTimeout(150);
  await page.evaluate(() => window.scrollTo(0, 0));
  await page.waitForTimeout(300);

  // Verificar se algum elemento da seção ficou preso com opacity < 0.9 ou display:none
  const stuckElements = await page.evaluate((selector) => {
    const section = document.querySelector(selector);
    if (!section) return ['Seção não encontrada'];
    const issues = [];
    section.querySelectorAll('[data-reveal]').forEach(el => {
      const style = window.getComputedStyle(el);
      const opacity = parseFloat(style.opacity);
      const visibility = style.visibility;
      if (opacity < 0.85 || visibility === 'hidden') {
        issues.push(`${el.tagName}.${el.className} preso com opacity=${opacity}`);
      }
    });
    return issues;
  }, sectionSelector);

  console.log('Verificação de elementos presos:', stuckElements.length === 0 ? 'NENHUM (100% visíveis)' : stuckElements);
  if (stuckElements.length > 0) {
    throw new Error('Elementos presos detectados: ' + stuckElements.join(', '));
  }

  // 3. Teste de empilhamento / stacking context
  console.log('3. Testando empilhamento de camadas...');
  const zIndices = await page.evaluate((selector) => {
    const sec = document.querySelector(selector);
    const surface = sec.querySelector('.hero__table-surface, .ripped-divider, .cookbook');
    if (!surface) return 'OK';
    const style = window.getComputedStyle(surface);
    return { zIndex: style.zIndex, transform: style.transform };
  }, sectionSelector);
  console.log('Camadas contínuas preservadas:', zIndices);

  if (consoleErrors.length > 0) {
    throw new Error('Erros de console detectados: ' + consoleErrors.join(', '));
  }

  await browser.close();
  console.log(`✅ Seção ${sectionId} APROVADA na auditoria de motion!`);
}

// Se executado diretamente
const section = process.argv[2] || '01-hero';
const selector = process.argv[3] || '#hero';

testSectionMotion(section, selector).catch(err => {
  console.error('❌ Falha:', err);
  process.exit(1);
});
