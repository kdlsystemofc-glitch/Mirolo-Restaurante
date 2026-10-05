const { chromium } = require('playwright');
const http = require('http');
const fs = require('fs');
const path = require('path');
const { execSync } = require('child_process');

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

server.listen(PORT, '127.0.0.1', async () => {
  console.log(`Server running at http://127.0.0.1:${PORT}`);
  
  // Launch Playwright browser with remote debugging port
  console.log('Launching Playwright Chromium on port 9222...');
  const browser = await chromium.launch({
    args: ['--remote-debugging-port=9222']
  });

  const reportPath = path.join(__dirname, '..', 'screenshots', 'lighthouse-mobile.json');

  try {
    console.log('Running Lighthouse via remote port 9222...');
    const cmd = `npx --yes lighthouse http://127.0.0.1:${PORT}/ --port=9222 --output=json --output-path="${reportPath}" --only-categories=performance,accessibility,best-practices,seo --form-factor=mobile --screenEmulation.mobile=true`;
    execSync(cmd, { stdio: 'inherit' });
    console.log('Lighthouse finished successfully!');
  } catch (err) {
    console.error('Lighthouse execution error:', err.message);
  } finally {
    await browser.close();
    server.close();
    console.log('Cleaned up browser and server.');
  }
});
