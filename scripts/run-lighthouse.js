const http = require('http');
const fs = require('fs');
const path = require('path');
const { execSync } = require('child_process');

const SITE_DIR = path.join(__dirname, '..', 'site');
const PORT = 3000;

// Simple static server for site
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

server.listen(PORT, async () => {
  console.log(`Server running at http://localhost:${PORT}`);
  const reportDir = path.join(__dirname, '..', 'screenshots');
  const reportPath = path.join(reportDir, 'lighthouse-mobile.json');

  try {
    console.log('Running Lighthouse mobile audit...');
    const cmd = `npx --yes lighthouse http://localhost:${PORT} --output=json --output-path="${reportPath}" --only-categories=performance,accessibility,best-practices,seo --form-factor=mobile --screenEmulation.mobile=true --chrome-flags="--headless"`;
    execSync(cmd, { stdio: 'inherit' });
    console.log('Lighthouse audit completed successfully!');
  } catch (err) {
    console.error('Error executing lighthouse:', err.message);
  } finally {
    server.close();
    console.log('Server stopped.');
  }
});
