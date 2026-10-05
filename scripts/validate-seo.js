const fs = require('fs');
const html = fs.readFileSync('site/index.html', 'utf8');

const h1s = [...html.matchAll(/<h1[^>]*>([\s\S]*?)<\/h1>/gi)].map(m => m[1].replace(/<[^>]+>/g, '').trim());
const h2s = [...html.matchAll(/<h2[^>]*>([\s\S]*?)<\/h2>/gi)].map(m => m[1].replace(/<[^>]+>/g, '').trim());
console.log('H1 count:', h1s.length, h1s);
console.log('H2 count:', h2s.length, h2s);

const imgs = [...html.matchAll(/<img\s+([^>]+)>/gi)].map(m => {
  const attrs = m[1];
  const src = (attrs.match(/src=["']([^"']+)["']/) || [])[1];
  const alt = (attrs.match(/alt=["']([^"']*)["']/) || [])[1];
  return { src, alt };
});

console.log('Images total:', imgs.length);
console.log('Images missing alt or empty:', imgs.filter(i => !i.alt));
