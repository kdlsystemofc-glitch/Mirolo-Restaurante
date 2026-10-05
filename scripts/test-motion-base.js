const { chromium } = require('playwright');
const path = require('path');

const FILE_URL = `file://${path.resolve('site/index.html').replace(/\\/g, '/')}`;

async function testMotionBase() {
  console.log('🧪 Iniciando teste da FASE 1: Base Global de Motion...');
  const browser = await chromium.launch();

  // Teste 1: Execução Padrão (Full / High Quality em Desktop)
  console.log('\n1. Testando carregamento e inicialização padrão (file://)...');
  const page = await browser.newPage();
  const consoleErrors = [];
  page.on('console', msg => {
    if (msg.type() === 'error') consoleErrors.push(msg.text());
  });
  page.on('pageerror', err => consoleErrors.push(err.message));

  await page.setViewportSize({ width: 1440, height: 900 });
  await page.goto(FILE_URL, { waitUntil: 'load' });

  // Aguardar 200ms para loader diferido executar
  await page.waitForTimeout(300);

  const motionState = await page.evaluate(() => {
    if (!window.MiroloMotion) return null;
    return window.MiroloMotion.getState();
  });

  console.log('Estado do MiroloMotion:', motionState);
  if (!motionState || !motionState.initialized) {
    throw new Error('MiroloMotion não foi inicializado corretamente!');
  }
  if (consoleErrors.length > 0) {
    throw new Error('Erros de console detectados: ' + consoleErrors.join(', '));
  }
  console.log('✅ Carregamento e inicialização padrão: APROVADO');

  // Teste 2: Pausar e Retomar
  console.log('\n2. Testando API de pausa/retomada...');
  const pauseTest = await page.evaluate(() => {
    window.MiroloMotion.pause();
    const paused = document.documentElement.getAttribute('data-motion-paused') === 'true';
    window.MiroloMotion.resume();
    const resumed = document.documentElement.getAttribute('data-motion-paused') === null;
    return { paused, resumed };
  });
  console.log('Teste de pausa/retomada:', pauseTest);
  if (!pauseTest.paused || !pauseTest.resumed) {
    throw new Error('Falha no teste de pausa e retomada!');
  }
  console.log('✅ Pausa e retomada: APROVADO');
  await page.close();

  // Teste 3: prefers-reduced-motion
  console.log('\n3. Testando prefers-reduced-motion: reduce...');
  const reducedPage = await browser.newPage({
    reducedMotion: 'reduce'
  });
  await reducedPage.setViewportSize({ width: 1440, height: 900 });
  await reducedPage.goto(FILE_URL, { waitUntil: 'load' });
  await reducedPage.waitForTimeout(300);

  const reducedState = await reducedPage.evaluate(() => {
    return window.MiroloMotion.getState();
  });
  console.log('Estado com reducedMotion:', reducedState);
  if (reducedState.mode !== 'reduced') {
    throw new Error('Esperava mode=reduced mas obteve: ' + reducedState.mode);
  }
  console.log('✅ Modo Reduced Motion: APROVADO');
  await reducedPage.close();

  // Teste 4: Regressão de layout em telas representativas
  console.log('\n4. Testando estabilidade de layout e ausência de rolagem horizontal...');
  for (const w of [2560, 1440, 1024, 768, 390, 320]) {
    const p = await browser.newPage();
    await p.setViewportSize({ width: w, height: 800 });
    await p.goto(FILE_URL, { waitUntil: 'networkidle' });
    await p.waitForTimeout(200);

    const hasScroll = await p.evaluate(() => {
      const doc = document.documentElement;
      const body = document.body;
      return Math.max(doc.scrollWidth, body.scrollWidth) > doc.clientWidth;
    });

    console.log(`Tela ${w}px: Rolagem H = ${hasScroll ? 'FALHOU' : 'OK'}`);
    if (hasScroll) throw new Error(`Rolagem horizontal detectada em ${w}px!`);
    await p.close();
  }
  console.log('✅ Regressão de layout: APROVADO');

  await browser.close();
  console.log('\n🎉 TODOS OS TESTES DA FASE 1 PASSARAM COM SUCESSO!');
}

testMotionBase().catch(err => {
  console.error('❌ Falha nos testes da Fase 1:', err);
  process.exit(1);
});
