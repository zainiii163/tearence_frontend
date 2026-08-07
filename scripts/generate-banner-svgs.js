/**
 * Generates sellable SVG banner size packs for each WWA banner category.
 * Run: node scripts/generate-banner-svgs.js
 */
const fs = require('fs');
const path = require('path');

const outDir = path.join(__dirname, '../public/img/banners/marketplace');
fs.mkdirSync(outDir, { recursive: true });

const categories = [
  { slug: 'real-estate', name: 'Real Estate', headline: 'Find Your Next Home', cta: 'View Listings', c1: '#1e3a8a', c2: '#3b82f6' },
  { slug: 'vehicles', name: 'Vehicles', headline: 'Drive the Deal', cta: 'Browse Cars', c1: '#7f1d1d', c2: '#ef4444' },
  { slug: 'travel-resorts', name: 'Travel & Resorts', headline: 'Escape Today', cta: 'Book Now', c1: '#065f46', c2: '#14b8a6' },
  { slug: 'jobs-recruitment', name: 'Jobs & Recruitment', headline: 'Hire Top Talent', cta: 'Post a Job', c1: '#92400e', c2: '#f59e0b' },
  { slug: 'books-authors', name: 'Books & Authors', headline: 'Stories That Sell', cta: 'Discover', c1: '#4c1d95', c2: '#8b5cf6' },
  { slug: 'services', name: 'Services', headline: 'Pros You Trust', cta: 'Get Quotes', c1: '#155e75', c2: '#06b6d4' },
  { slug: 'events', name: 'Events', headline: 'Fill Every Seat', cta: 'Promote Event', c1: '#9d174d', c2: '#ec4899' },
  { slug: 'food-hospitality', name: 'Food & Hospitality', headline: 'Taste the Buzz', cta: 'Reserve', c1: '#9a3412', c2: '#f97316' },
  { slug: 'fashion-beauty', name: 'Fashion & Beauty', headline: 'Style That Converts', cta: 'Shop Look', c1: '#86198f', c2: '#d946ef' },
  { slug: 'tech-electronics', name: 'Tech & Electronics', headline: 'Next-Gen Gear', cta: 'Explore Tech', c1: '#0f172a', c2: '#0ea5e9' },
  { slug: 'health-wellness', name: 'Health & Wellness', headline: 'Feel Better Daily', cta: 'Learn More', c1: '#14532d', c2: '#22c55e' },
  { slug: 'business-finance', name: 'Business & Finance', headline: 'Grow With Confidence', cta: 'Start Now', c1: '#1e3a5f', c2: '#ca8a04' },
];

const sizes = [
  { key: 'leaderboard', w: 728, h: 90, titleScale: 22, subScale: 12 },
  { key: 'rectangle', w: 300, h: 250, titleScale: 20, subScale: 12 },
  { key: 'billboard', w: 970, h: 250, titleScale: 36, subScale: 16 },
];

function escapeXml(s) {
  return String(s).replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;');
}

function svgFor(cat, size) {
  const { w, h, titleScale, subScale } = size;
  const isTall = h >= 200 && w <= 400;
  const pad = isTall ? 20 : 24;
  const ctaY = isTall ? h - 36 : h / 2 + 8;
  const titleY = isTall ? 56 : h / 2 - 8;
  const brandY = isTall ? 28 : 22;

  return `<?xml version="1.0" encoding="UTF-8"?>
<svg xmlns="http://www.w3.org/2000/svg" width="${w}" height="${h}" viewBox="0 0 ${w} ${h}" role="img" aria-label="${escapeXml(cat.name)} banner">
  <defs>
    <linearGradient id="g" x1="0%" y1="0%" x2="100%" y2="100%">
      <stop offset="0%" stop-color="${cat.c1}"/>
      <stop offset="100%" stop-color="${cat.c2}"/>
    </linearGradient>
  </defs>
  <rect width="${w}" height="${h}" fill="url(#g)"/>
  <circle cx="${w - 40}" cy="20" r="80" fill="#ffffff" fill-opacity="0.08"/>
  <circle cx="30" cy="${h - 10}" r="60" fill="#ffffff" fill-opacity="0.06"/>
  <text x="${pad}" y="${brandY}" fill="#ffffff" fill-opacity="0.85" font-family="Segoe UI, Helvetica, Arial, sans-serif" font-size="11" font-weight="600" letter-spacing="1">WORLDWIDE ADVERTS</text>
  <text x="${pad}" y="${titleY}" fill="#ffffff" font-family="Georgia, Times New Roman, serif" font-size="${titleScale}" font-weight="700">${escapeXml(cat.headline)}</text>
  ${isTall ? `<text x="${pad}" y="${titleY + 28}" fill="#ffffff" fill-opacity="0.9" font-family="Segoe UI, Helvetica, Arial, sans-serif" font-size="${subScale}">${escapeXml(cat.name)} · Paid banner pack</text>` : ''}
  <rect x="${pad}" y="${ctaY - 18}" rx="6" ry="6" width="${Math.min(140, w - pad * 2)}" height="28" fill="#ffffff"/>
  <text x="${pad + 14}" y="${ctaY + 1}" fill="${cat.c1}" font-family="Segoe UI, Helvetica, Arial, sans-serif" font-size="12" font-weight="700">${escapeXml(cat.cta)}</text>
</svg>`;
}

let count = 0;
for (const cat of categories) {
  for (const size of sizes) {
    const file = path.join(outDir, `${cat.slug}-${size.key}.svg`);
    fs.writeFileSync(file, svgFor(cat, size), 'utf8');
    count += 1;
  }
}

console.log(`Wrote ${count} SVG banners to ${outDir}`);
