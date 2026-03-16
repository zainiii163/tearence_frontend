const fs = require('fs');
const content = fs.readFileSync('src/Pages/AffiliateDashboard.jsx', 'utf8');

// Simple bracket matching check
let openDivs = 0;
let openFragments = 0;

for (let i = 0; i < content.length; i++) {
  const char = content[i];
  const next2 = content.substr(i, 2);
  const next3 = content.substr(i, 3);
  
  if (next3 === '<div') openDivs++;
  if (next2 === '</') openDivs--;
  if (next3 === '<>') openFragments++;
  if (next3 === '</>') openFragments--;
}

console.log('Open divs:', openDivs);
console.log('Open fragments:', openFragments);

if (openDivs !== 0) {
  console.log('ERROR: Unclosed div elements');
} else if (openFragments !== 0) {
  console.log('ERROR: Unclosed fragment elements');
} else {
  console.log('JSX structure appears balanced');
}
