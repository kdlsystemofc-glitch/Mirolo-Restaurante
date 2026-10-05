const { chromium } = require('playwright');
const path = require('path');
const fs = require('fs');

const VIDEO_DIR = path.join(__dirname, '..', 'screenshots', 'video');
fs.mkdirSync(VIDEO_DIR, { recursive: true });

const FILE_URL = `file://${path.resolve('site/index.html').replace(/\\/g, '/')}`;

async function recordMotionCoherence() {
  console.log('🎥 Iniciando gravação de vídeo e validação de coerência rítmica...');
  const browser = await chromium.launch();
  const context = await browser.newContext({
    recordVideo: {
      dir: VIDEO_DIR,
      size: { width: 1440, height: 900 }
    },
    viewport: { width: 1440, height: 900 }
  });

  const page = await context.newPage();
  await page.goto(FILE_URL, { waitUntil: 'load' });

  // 1. Pausa no topo para visualizar entrada suave do Hero
  console.log('1. Capturando entrada do Hero...');
  await page.waitForTimeout(1200);

  // 2. Rolagem suave progressiva simulando leitura humana (seção por seção)
  console.log('2. Rolando suavemente pela página...');
  const scrollSteps = [
    { target: 600,  label: 'Transição Hero -> Bolinho', wait: 1200 },
    { target: 1200, label: 'O Caderno Secreto (Bolinho)', wait: 1400 },
    { target: 1800, label: 'O Buffet Colorido (Polaroids)', wait: 1500 },
    { target: 2400, label: 'Prova Social Afetiva (Depoimentos)', wait: 1400 },
    { target: 3000, label: 'Rodapé (Footer)', wait: 1000 }
  ];

  for (const step of scrollSteps) {
    console.log(`  -> Rolando até: ${step.label} (${step.target}px)`);
    await page.evaluate((y) => {
      window.scrollTo({ top: y, behavior: 'smooth' });
    }, step.target);
    await page.waitForTimeout(step.wait);
  }

  // 3. Teste do Botão de Pausa em tempo de execução
  console.log('3. Testando clique no botão de pausa...');
  const pauseBtn = await page.$('[data-motion-toggle]');
  if (pauseBtn) {
    await pauseBtn.click();
    await page.waitForTimeout(800); // Pausado
    const isPaused = await page.evaluate(() => document.documentElement.getAttribute('data-motion-paused') === 'true');
    console.log('  Estado pausado:', isPaused ? 'SIM' : 'NÃO');

    // Retomar
    await pauseBtn.click();
    await page.waitForTimeout(800); // Retomado
    const isResumed = await page.evaluate(() => document.documentElement.getAttribute('data-motion-paused') === null);
    console.log('  Estado retomado:', isResumed ? 'SIM' : 'NÃO');
  }

  // 4. Rolagem de retorno ao topo
  console.log('4. Rolando de volta ao topo...');
  await page.evaluate(() => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  });
  await page.waitForTimeout(1500);

  // Finalizar e salvar vídeo
  await page.close();
  await context.close();
  await browser.close();

  // Renomear vídeo gravado para nome canônico
  const files = fs.readdirSync(VIDEO_DIR).filter(f => f.endsWith('.webm'));
  if (files.length > 0) {
    const latest = files[files.length - 1];
    const targetPath = path.join(VIDEO_DIR, 'motion-coherence.webm');
    if (path.join(VIDEO_DIR, latest) !== targetPath) {
      if (fs.existsSync(targetPath)) fs.unlinkSync(targetPath);
      fs.renameSync(path.join(VIDEO_DIR, latest), targetPath);
    }
    console.log(`✅ Gravação de vídeo concluída: ${targetPath}`);
  }

  console.log('🎉 Auditoria de coerência rítmica concluída com sucesso!');
}

recordMotionCoherence().catch(err => {
  console.error('❌ Falha na gravação:', err);
  process.exit(1);
});
