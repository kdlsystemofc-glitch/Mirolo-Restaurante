const fs = require('fs');
const path = require('path');

function simpleMinify(code) {
  return code
    // Remove single line comments (preserve URLs)
    .replace(/(^|[^\:])\/\/.*$/gm, '$1')
    // Remove multiline comments
    .replace(/\/\*[\s\S]*?\*\//g, '')
    // Remove excessive whitespace
    .replace(/\s+/g, ' ')
    .replace(/\s*([\{\}\(\)\=\+\-\*\/\:\,\;\<\>\!\|])\s*/g, '$1')
    .trim();
}

const jsDir = path.join(__dirname, '../site/js');

const loaderSrc = fs.readFileSync(path.join(jsDir, 'motion-loader.js'), 'utf8');
fs.writeFileSync(path.join(jsDir, 'motion-loader.min.js'), simpleMinify(loaderSrc), 'utf8');
console.log('✅ motion-loader.min.js gerado');

const coreSrc = fs.readFileSync(path.join(jsDir, 'motion-core.js'), 'utf8');
fs.writeFileSync(path.join(jsDir, 'motion-core.min.js'), simpleMinify(coreSrc), 'utf8');
console.log('✅ motion-core.min.js gerado');
