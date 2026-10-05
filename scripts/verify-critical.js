// Verifica o critical CSS injetado no index.html
const fs = require('fs');
const h = fs.readFileSync('site/index.html', 'utf8');

// Extrair bloco critical-css
const match = h.match(/<style id="critical-css">([\s\S]*?)<\/style>/);
if (!match) { console.log('BLOCO NAO ENCONTRADO'); process.exit(1); }

const c = match[1];
console.log('Tamanho critical inline:', c.length);
console.log('mask-image oval?', c.includes('radial-gradient(ellipse at 50%') ? 'SIM (PROBLEMA!)' : 'NAO (ok)');
console.log('inset 0 10px 22px?', c.includes('inset 0 10px 22px') ? 'SIM (PROBLEMA!)' : 'NAO (ok)');
console.log('background-color #5A341A?', c.includes('#5A341A') ? 'SIM (ok)' : 'NAO (verificar)');
console.log('backdrop-filter tape?', c.includes('backdrop-filter:blur(0.8px)') ? 'SIM (PROBLEMA!)' : 'NAO (ok)');
console.log('scroll-behavior:smooth html?', c.includes('scroll-behavior:smooth') && !c.includes('prefers-reduced-motion') ? 'VERIFICAR' : 'NAO (ok)');
console.log('box-shadow:none table-surface?', c.includes('box-shadow:none') ? 'SIM (ok)' : 'NAO (verificar)');
