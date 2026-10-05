const http = require('http');
const fs = require('fs');
const path = require('path');
const { spawn } = require('child_process');

const SITE_DIR = path.join(__dirname, '..', 'site');
const PORT = 3000;

const MIME_TYPES = {
  '.html': 'text/html; charset=utf-8',
  '.css': 'text/css; charset=utf-8',
  '.js': 'application/javascript; charset=utf-8',
  '.json': 'application/json',
  '.png': 'image/png',
  '.jpg': 'image/jpeg',
  '.jpeg': 'image/jpeg',
  '.webp': 'image/webp',
  '.svg': 'image/svg+xml',
  '.woff2': 'font/woff2',
  '.ico': 'image/x-icon',
  '.webmanifest': 'application/manifest+json'
};

const server = http.createServer((req, res) => {
  let reqPath = req.url.split('?')[0];
  if (reqPath === '/') reqPath = '/index.html';
  const filePath = path.join(SITE_DIR, reqPath);

  if (fs.existsSync(filePath) && fs.statSync(filePath).isFile()) {
    const ext = path.extname(filePath).toLowerCase();
    res.writeHead(200, { 'Content-Type': MIME_TYPES[ext] || 'application/octet-stream' });
    fs.createReadStream(filePath).pipe(res);
  } else {
    res.writeHead(404);
    res.end('Not found');
  }
});

server.listen(PORT, '127.0.0.1', () => {
  console.log(`Server listening at http://127.0.0.1:${PORT}`);
  const reportPath = path.join(__dirname, '..', 'screenshots', 'lighthouse-mobile-optimized.json');

  const args = [
    '--yes',
    'lighthouse',
    `http://127.0.0.1:${PORT}/`,
    '--output=json',
    `--output-path=${reportPath}`,
    '--only-categories=performance,accessibility,best-practices,seo',
    '--form-factor=mobile',
    '--screenEmulation.mobile=true',
    '--chrome-flags=--headless=new --no-sandbox --disable-dev-shm-usage'
  ];

  console.log('Spawning Lighthouse asynchronously...');
  const lh = spawn('npx.cmd', args, { stdio: 'inherit', shell: true });

  lh.on('close', (code) => {
    console.log(`Lighthouse process exited with code ${code}`);
    server.close(() => {
      console.log('Server stopped.');
      if (fs.existsSync(reportPath)) {
        try {
          const rep = JSON.parse(fs.readFileSync(reportPath, 'utf8'));
          const p = Math.round(rep.categories.performance.score * 100);
          const a = Math.round(rep.categories.accessibility.score * 100);
          const b = Math.round(rep.categories['best-practices'].score * 100);
          const s = Math.round(rep.categories.seo.score * 100);
          const fcp = rep.audits['first-contentful-paint'] ? rep.audits['first-contentful-paint'].displayValue : 'N/A';
          const lcp = rep.audits['largest-contentful-paint'] ? rep.audits['largest-contentful-paint'].displayValue : 'N/A';
          const tbt = rep.audits['total-blocking-time'] ? rep.audits['total-blocking-time'].displayValue : 'N/A';
          const cls = rep.audits['cumulative-layout-shift'] ? rep.audits['cumulative-layout-shift'].displayValue : 'N/A';
          console.log('\n📊 === LIGHTHOUSE RESULTADOS OTIMIZADOS ===');
          console.log(`Performance:    ${p}`);
          console.log(`Accessibility:  ${a}`);
          console.log(`Best Practices: ${b}`);
          console.log(`SEO:            ${s}`);
          console.log(`FCP: ${fcp} | LCP: ${lcp} | TBT: ${tbt} | CLS: ${cls}`);
        } catch (e) {
          console.error('Erro ao ler relatório Lighthouse:', e);
        }
      }
      process.exit(code);
    });
  });

  lh.on('error', (err) => {
    console.error('Failed to start Lighthouse:', err);
    server.close(() => process.exit(1));
  });
});
