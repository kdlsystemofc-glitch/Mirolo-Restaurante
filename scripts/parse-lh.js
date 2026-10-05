const fs = require('fs');
const lh = JSON.parse(fs.readFileSync('screenshots/lighthouse-mobile.json', 'utf8'));

console.log('=== PONTUAÇÕES LIGHTHOUSE MOBILE ===');
Object.keys(lh.categories).forEach(cat => {
  console.log(lh.categories[cat].title + ': ' + Math.round(lh.categories[cat].score * 100));
});

console.log('\n=== OPORTUNIDADES (OPPORTUNITIES) ===');
const audits = lh.audits;
const opportunities = [];

for (const key in audits) {
  const a = audits[key];
  if (a.details && a.details.type === 'opportunity' && (a.numericValue > 0 || (a.details.overallSavingsBytes && a.details.overallSavingsBytes > 0))) {
    opportunities.push({
      id: key,
      title: a.title,
      description: a.description,
      savingsMs: Math.round(a.numericValue || 0),
      savingsBytes: a.details.overallSavingsBytes || 0,
      displayValue: a.displayValue || ''
    });
  }
}

opportunities.sort((a, b) => b.savingsBytes - a.savingsBytes || b.savingsMs - a.savingsMs);
console.log('Top opportunities found:');
opportunities.slice(0, 5).forEach((op, idx) => {
  console.log((idx + 1) + '. ' + op.title + ' — ' + (op.displayValue || (op.savingsBytes ? Math.round(op.savingsBytes/1024) + ' KiB' : op.savingsMs + ' ms')));
});

console.log('\n=== AUDITORIAS NÃO PERFEITAS (SCORE < 1) ===');
const nonPerfect = [];
for (const key in audits) {
  const a = audits[key];
  if (a.score !== null && a.score < 1 && a.scoreDisplayMode !== 'notApplicable' && a.scoreDisplayMode !== 'informative') {
    nonPerfect.push({
      id: key,
      title: a.title,
      score: a.score,
      displayValue: a.displayValue || ''
    });
  }
}
nonPerfect.forEach(np => {
  console.log('- ' + np.title + ' (score: ' + np.score + ') ' + np.displayValue);
});
