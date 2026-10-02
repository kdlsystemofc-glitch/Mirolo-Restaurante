// scripts/convert-assets.js
// Converts images from IMAGENS/ and design/plates/ to WebP at 800px and 1600px into site/assets/
const sharp = require('sharp');
const fs = require('fs');
const path = require('path');

const ROOT = path.join(__dirname, '..');
const ASSETS_DIR = path.join(ROOT, 'site', 'assets');

// Guarantee output dir exists
fs.mkdirSync(ASSETS_DIR, { recursive: true });

// Slot manifest — maps slot name -> source file -> output basename
const SLOTS = [
  // [slot, srcRelative, outBasename]
  ['logo',              'design/plates/ajuste C.jpg',                                              'logo'],
  ['hero-food',         'design/plates/plate 1.jpg',                                               'hero-food'],
  ['bolinho',           'design/plates/plate 2.jpg',                                               'bolinho'],
  ['chef-merengue',     'imagens/imgi_13_426473415_18293013925156792_2849356420887757564_n.jpg',   'chef-merengue'],
  ['chef-fachada-open', 'imagens/imgi_35_624208552_18076400957615897_6605636491068263743_n.jpg',   'chef-fachada-open'],
  ['chef-arms-crossed', 'imagens/imgi_41_623358524_18100918831677251_8316788417836461602_n.jpg',   'chef-arms-crossed'],
  ['chef-blue-ext',     'imagens/imgi_18_432929647_18296247661156792_3109168439601538929_n.jpg',   'chef-blue-ext'],
  ['chef-merengue2',    'imagens/imgi_57_361169282_18264153472156792_2624378100428075689_n.jpg',   'chef-merengue2'],
  ['buffet-salada',     'imagens/imgi_21_625107992_18108351715731418_7739018170723431962_n.jpg',   'buffet-salada'],
  ['buffet-quentes',    'imagens/imgi_43_623294700_17990538785916250_2897129099803608199_n.jpg',   'buffet-quentes'],
  ['salao-interior',    'imagens/imgi_28_627351638_18110683411659322_5985189417989454614_n.jpg',   'salao-interior'],
  ['fachada',           'imagens/imgi_22_625161118_18095033722763031_1602180985124637657_n.jpg',   'fachada'],
  ['sobremesas',        'imagens/imgi_40_626416011_18084567193942648_8403504670851462413_n.jpg',   'sobremesas'],
  ['feijoada-bandeja',  'design/plates/ajuste b.jpg',                                              'feijoada-bandeja'],
  ['prato-feijoada',    'imagens/imgi_54_367987946_18268671025156792_4376307858334298288_n.jpg',   'prato-feijoada'],
  ['prato-montado',     'imagens/imgi_56_365745621_18267495133156792_2806336237399416339_n.jpg',   'prato-montado'],
  ['buffet-torresmo',   'imagens/imgi_30_622094764_18070333856164671_8247170188791487313_n.jpg',   'buffet-torresmo'],
];

const WIDTHS = [800, 1600];
const results = [];

async function convertSlot([slot, srcRel, outBase]) {
  const srcPath = path.join(ROOT, srcRel);
  if (!fs.existsSync(srcPath)) {
    console.warn(`⚠️  MISSING: ${srcRel} (slot: ${slot})`);
    results.push({ slot, status: 'MISSING', src: srcRel });
    return;
  }

  // Logo: keep as PNG (preserves transparency channel)
  if (slot === 'logo') {
    const outPath = path.join(ASSETS_DIR, `${outBase}.png`);
    await sharp(srcPath).png().toFile(outPath);
    console.log(`✅ logo → ${outBase}.png`);
    results.push({ slot, status: 'OK', files: [`${outBase}.png`], src: srcRel });
    return;
  }

  const files = [];
  for (const w of WIDTHS) {
    const outName = `${outBase}-${w}.webp`;
    const outPath = path.join(ASSETS_DIR, outName);
    await sharp(srcPath)
      .resize(w, null, { withoutEnlargement: true })
      .webp({ quality: 82 })
      .toFile(outPath);
    files.push(outName);
    console.log(`✅ ${slot} ${w}px → ${outName}`);
  }
  results.push({ slot, status: 'OK', files, src: srcRel });
}

(async () => {
  for (const slot of SLOTS) {
    await convertSlot(slot);
  }

  // Write assets.md
  let md = `# assets.md — Inventário de imagens\n\n`;
  md += `Gerado em ${new Date().toISOString()}\n\n`;
  md += `| Slot | Status | Arquivo fonte | Saída |\n`;
  md += `|------|--------|---------------|-------|\n`;
  for (const r of results) {
    const files = r.files ? r.files.join(', ') : '—';
    const note = r.src.includes('plates') ? ' *(plate gerado ou ajuste)*' : ' *(foto real)*';
    md += `| ${r.slot} | ${r.status} | ${r.src}${note} | ${files} |\n`;
  }
  md += `\n## Notas\n`;
  md += `- Imagens de plates (plate 1, plate 2) recriadas por IA — confirmar com o cliente antes de publicar.\n`;
  md += `- Ajuste B (feijoada-bandeja) e Ajuste C (logo) recriados por IA — confirmar com o cliente antes de publicar.\n`;
  md += `- Fotos do Instagram ainda contêm logo/endereço sobrepostos nas versões originais — usar apenas as versões em site/assets (cropped via sharp).\n`;
  fs.writeFileSync(path.join(ROOT, 'site', 'assets.md'), md, 'utf8');
  console.log('\n📄 assets.md gerado em site/assets.md');

  const missing = results.filter(r => r.status === 'MISSING');
  if (missing.length) {
    console.log('\n🚨 Slots sem arquivo:');
    missing.forEach(m => console.log(`  - ${m.slot}: ${m.src}`));
  } else {
    console.log('\n✅ Todos os slots convertidos com sucesso.');
  }
})();
