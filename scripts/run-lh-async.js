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
  '.svg': 'image/svg+xml'
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
  const reportPath = path.join(__dirname, '..', 'screenshots', 'lighthouse-mobile.json');

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
      process.exit(code);
    });
  });

  lh.on('error', (err) => {
    console.error('Failed to start Lighthouse:', err);
    server.close(() => process.exit(1));
  });
});
