// scripts/inject-critical.js
// Injeta o conteúdo de site/critical.css dentro do <style id="critical-css"> do index.html
const fs = require('fs');
const path = require('path');

const critPath = path.join(__dirname, '..', 'site', 'critical.css');
const htmlPath = path.join(__dirname, '..', 'site', 'index.html');

const crit = fs.readFileSync(critPath, 'utf8').trim();
let html = fs.readFileSync(htmlPath, 'utf8');

const before = html.length;
html = html.replace(
  /<style id="critical-css">[\s\S]*?<\/style>/,
  '<style id="critical-css">' + crit + '<\/style>'
);

if (html.length === before && !html.includes(crit.substring(0, 50))) {
  console.error('AVISO: bloco <style id="critical-css"> não encontrado no HTML!');
  process.exit(1);
}

fs.writeFileSync(htmlPath, html, 'utf8');
console.log('OK — Critical CSS injetado. Tamanho:', crit.length, 'chars');
