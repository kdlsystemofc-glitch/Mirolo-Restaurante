// scripts/test-motion-experience.js
const { chromium } = require('playwright');
const path = require('path');

(async () => {
  const browser = await chromium.launch({ args: ['--allow-file-access-from-files'] });
  const page = await browser.newPage();
  await page.setViewportSize({ width: 1440, height: 900 });

  const errors = [];
  page.on('console', msg => {
    if (msg.type() === 'error') errors.push(msg.text());
    else console.log('[PAGE]', msg.text());
  });
  page.on('pageerror', err => errors.push(err.message));

  console.log('Navegando para o site...');
  await page.goto('file:///' + path.resolve('site/index.html').replace(/\\/g, '/'));
  
  // Aguarda animação de abertura do Hero
  await page.waitForTimeout(1500);

  // Captura o Hero animado
  await page.screenshot({ path: 'screenshots/motion_hero_animated.png' });
  console.log('✅ Screenshot Hero animado salvo');

  // Verifica estado do motion no window
  const motionState = await page.evaluate(() => {
    return {
      active: !!window.MiroloMotion,
      state: window.MiroloMotion ? window.MiroloMotion.getState() : null,
      lenisAttached: !!(window.MiroloMotion && window.MiroloMotion.getState().lenis)
    };
  });
  console.log('Estado do Motion:', motionState);

  // Testa scroll suave até a Seção 2 e Seção 3
  console.log('Rolando até Seção 2...');
  await page.evaluate(() => {
    const lenis = window.MiroloMotion?.getState()?.lenis;
    const el = document.querySelector('#bolinho');
    if (lenis && el) lenis.scrollTo(el, { duration: 1.2 });
    else if (el) el.scrollIntoView({ behavior: 'smooth' });
  });
  await page.waitForTimeout(1500);
  await page.screenshot({ path: 'screenshots/motion_secao2.png' });
  console.log('✅ Screenshot Seção 2 salvo');

  console.log('Rolando até Seção 3 (Buffet / Polaroids)...');
  await page.evaluate(() => {
    const lenis = window.MiroloMotion?.getState()?.lenis;
    const el = document.querySelector('#buffet');
    if (lenis && el) lenis.scrollTo(el, { duration: 1.2 });
    else if (el) el.scrollIntoView({ behavior: 'smooth' });
  });
  await page.waitForTimeout(1500);
  await page.screenshot({ path: 'screenshots/motion_secao3.png' });
  console.log('✅ Screenshot Seção 3 salvo');

  console.log('Rolando até Seção 4 (Depoimentos)...');
  await page.evaluate(() => {
    const lenis = window.MiroloMotion?.getState()?.lenis;
    const el = document.querySelector('#depoimentos');
    if (lenis && el) lenis.scrollTo(el, { duration: 1.2 });
    else if (el) el.scrollIntoView({ behavior: 'smooth' });
  });
  await page.waitForTimeout(1500);
  await page.screenshot({ path: 'screenshots/motion_secao4.png' });
  console.log('✅ Screenshot Seção 4 salvo');

  // Testar hover e 3D tilt na polaroid
  const firstPolaroid = page.locator('.polaroid').first();
  if (await firstPolaroid.count() > 0) {
    const box = await firstPolaroid.boundingBox();
    if (box) {
      await page.mouse.move(box.x + box.width * 0.2, box.y + box.height * 0.2);
      await page.waitForTimeout(400);
      const style = await firstPolaroid.evaluate(el => el.getAttribute('style'));
      console.log('Estilo da Polaroid após hover:', style);
    }
  }

  // Rolando até o rodapé
  await page.evaluate(() => window.scrollTo(0, document.body.scrollHeight));
  await page.waitForTimeout(800);
  await page.screenshot({ path: 'screenshots/motion_footer.png' });
  console.log('✅ Screenshot Footer salvo');

  console.log('Total de erros de console:', errors.length);
  if (errors.length) console.log('Erros:', errors);

  await browser.close();
})();
