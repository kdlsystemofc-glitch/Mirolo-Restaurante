const https = require('https');
const fs = require('fs');
const path = require('path');

const FONTS_DIR = path.join(__dirname, '..', 'site', 'fonts');
// Clean existing files
if (fs.existsSync(FONTS_DIR)) {
  fs.readdirSync(FONTS_DIR).forEach(f => fs.unlinkSync(path.join(FONTS_DIR, f)));
} else {
  fs.mkdirSync(FONTS_DIR, { recursive: true });
}

const UA = 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36';

function fetchUrl(url) {
  return new Promise((resolve, reject) => {
    https.get(url, { headers: { 'User-Agent': UA } }, (res) => {
      if (res.statusCode >= 300 && res.statusCode < 400 && res.headers.location) {
        return fetchUrl(res.headers.location).then(resolve).catch(reject);
      }
      if (res.statusCode !== 200) {
        return reject(new Error(`Failed to fetch ${url}, status: ${res.statusCode}`));
      }
      const chunks = [];
      res.on('data', c => chunks.push(c));
      res.on('end', () => resolve(Buffer.concat(chunks)));
      res.on('error', reject);
    }).on('error', reject);
  });
}

async function run() {
  console.log('📦 Baixando fontes WOFF2 locais estritamente para subconjuntos latin e latin-ext...');
  const cssUrl = 'https://fonts.googleapis.com/css2?family=Cormorant+Garamond:wght@700&family=Great+Vibes&family=Lato:wght@400;700&display=swap';

  const cssBuffer = await fetchUrl(cssUrl);
  const cssText = cssBuffer.toString('utf8');

  // Quebrar por blocos @font-face precedidos pelo comentário do subconjunto
  const blocks = cssText.split(/(?=\/\*\s*[a-z\-]+\s*\*\/)/i);
  const localCss = [];
  const downloadedFiles = new Set();

  for (const block of blocks) {
    const subsetMatch = block.match(/\/\*\s*([a-z\-]+)\s*\*\//i);
    const subset = subsetMatch ? subsetMatch[1].toLowerCase() : 'all';

    // Apenas subconjuntos relevantes para o Português
    if (subset !== 'latin' && subset !== 'latin-ext') {
      continue;
    }

    const familyMatch = block.match(/font-family:\s*['"]?([^'";]+)['"]?/);
    const weightMatch = block.match(/font-weight:\s*([0-9]+)/);
    const styleMatch = block.match(/font-style:\s*([a-zA-Z]+)/);
    const urlMatch = block.match(/url\((https:\/\/[^)]+\.woff2)\)/);
    const unicodeMatch = block.match(/unicode-range:\s*([^;]+);/);

    if (familyMatch && urlMatch) {
      const family = familyMatch[1].trim();
      const weight = weightMatch ? weightMatch[1].trim() : '400';
      const style = styleMatch ? styleMatch[1].trim() : 'normal';
      const woff2Url = urlMatch[1];
      const unicodeRange = unicodeMatch ? unicodeMatch[1].trim() : '';

      const cleanFamily = family.toLowerCase().replace(/\s+/g, '-');
      const filename = `${cleanFamily}-${weight}-${subset}.woff2`;
      const filePath = path.join(FONTS_DIR, filename);

      if (!downloadedFiles.has(filename)) {
        console.log(`Baixando [${subset}] ${filename}...`);
        const fontData = await fetchUrl(woff2Url);
        fs.writeFileSync(filePath, fontData);
        downloadedFiles.add(filename);
      }

      localCss.push(`/* ${subset} */
@font-face {
  font-family: '${family}';
  font-style: ${style};
  font-weight: ${weight};
  font-display: swap;
  src: url('fonts/${filename}') format('woff2');
  ${unicodeRange ? `unicode-range: ${unicodeRange};` : ''}
}`);
    }
  }

  const outCss = path.join(__dirname, '..', 'site', 'fonts.css');
  fs.writeFileSync(outCss, localCss.join('\n\n') + '\n');
  console.log(`\n✅ ${downloadedFiles.size} arquivos WOFF2 baixados com sucesso em site/fonts/`);
  console.log(`✅ site/fonts.css gerado.`);
}

run().catch(err => {
  console.error('❌ Falha:', err);
  process.exit(1);
});
