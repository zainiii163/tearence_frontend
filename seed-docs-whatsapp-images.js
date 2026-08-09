/**
 * Upload docs WhatsApp / stock-docs images as REAL ImagesAdvert records on the live API.
 * Usage: node seed-docs-whatsapp-images.js
 *
 * On the server you can also run:
 *   php artisan db:seed --class=DocsWhatsAppImagesSeeder
 */
const fs = require('fs');
const path = require('path');
const { Blob } = require('buffer');

const API_BASE = process.env.REACT_APP_API_URL || 'https://api.worldwideadverts.info/api/v1';

const DOCS_DIR = path.join(__dirname, 'docs');
const PUBLIC_STOCK = path.join(__dirname, 'public', 'images', 'stock-docs');
const BACKEND_ASSETS = path.join(
  __dirname,
  '..',
  'WWA-backend-New_main',
  'database',
  'seeders',
  'assets',
  'docs-whatsapp-images'
);

const LOGIN_CANDIDATES = [
  { email: 'shihab@worldwideadverts.info', password: 'Admin@123' },
  { email: 'rizky@worldwideadverts.info', password: 'admin123' },
  { email: 'vikas@worldwideadverts.info', password: 'Admin@123' },
];

const SAMPLES = [
  {
    stockFile: 'stock-01.jpeg',
    file: 'WhatsApp Image 2026-08-03 at 1.25.02 AM (1).jpeg',
    title: 'Industrial Yard with Yellow Cable Coils',
    description:
      'Outdoor stock photo of a secure industrial yard behind black mesh fencing, with bright yellow coiled utility piping, no-parking bollards, and an asphalt access road under an overcast sky.',
    image_category: 'business',
    tags: ['industrial', 'utility', 'yellow-cable', 'fencing', 'commercial'],
    promotion_tier: 'featured',
  },
  {
    stockFile: 'stock-02.jpeg',
    file: 'WhatsApp Image 2026-08-03 at 1.25.02 AM.jpeg',
    title: 'Commercial Storage Yard Stock Photo',
    description:
      'Stock image of a commercial storage and utility yard with fencing, outdoor equipment, and open asphalt surfaces.',
    image_category: 'business',
    tags: ['storage', 'commercial', 'yard', 'industrial'],
    promotion_tier: 'promoted',
  },
  {
    stockFile: 'stock-03.jpeg',
    file: 'WhatsApp Image 2026-08-03 at 1.25.03 AM (1).jpeg',
    title: 'Warehouse Units 43-47 with Loading Bays',
    description:
      'Modern multi-unit warehouse terrace with numbered blue roller shutters (units 43-47), delivery van, and red waste bins on a wide asphalt forecourt.',
    image_category: 'real_estate',
    tags: ['warehouse', 'units', 'loading-bay', 'property'],
    promotion_tier: 'featured',
  },
  {
    stockFile: 'stock-04.jpeg',
    file: 'WhatsApp Image 2026-08-03 at 1.25.03 AM (2).jpeg',
    title: 'Industrial Estate Forecourt',
    description: 'Wide view of an industrial estate forecourt and commercial buildings under soft daylight.',
    image_category: 'real_estate',
    tags: ['industrial-estate', 'forecourt', 'property'],
    promotion_tier: 'promoted',
  },
  {
    stockFile: 'stock-05.jpeg',
    file: 'WhatsApp Image 2026-08-03 at 1.25.03 AM (3).jpeg',
    title: 'Business Park Exterior Stock Shot',
    description: 'Exterior photograph of a business park / light industrial premises with parking area.',
    image_category: 'business',
    tags: ['business-park', 'exterior', 'parking'],
    promotion_tier: 'standard',
  },
  {
    stockFile: 'stock-06.jpeg',
    file: 'WhatsApp Image 2026-08-03 at 1.25.03 AM (4).jpeg',
    title: 'M61 Roadside with Pylon and Industrial Site',
    description:
      'Roadside stock photo near the M61 with painted road markings, electricity pylon, digital speed sign, and industrial buildings under clear sky.',
    image_category: 'travel',
    tags: ['motorway', 'M61', 'pylon', 'roadside'],
    promotion_tier: 'featured',
  },
  {
    stockFile: 'stock-07.jpeg',
    file: 'WhatsApp Image 2026-08-03 at 1.25.03 AM (5).jpeg',
    title: 'Road and Infrastructure Landscape',
    description: 'Outdoor landscape showing road infrastructure and nearby commercial development.',
    image_category: 'travel',
    tags: ['road', 'infrastructure', 'landscape'],
    promotion_tier: 'standard',
  },
  {
    stockFile: 'stock-08.jpeg',
    file: 'WhatsApp Image 2026-08-03 at 1.25.03 AM (6).jpeg',
    title: 'Commercial Premises Stock Photo',
    description: 'Stock photograph of commercial premises and surrounding grounds.',
    image_category: 'real_estate',
    tags: ['premises', 'commercial', 'property'],
    promotion_tier: 'standard',
  },
  {
    stockFile: 'stock-09.jpeg',
    file: 'WhatsApp Image 2026-08-03 at 1.25.03 AM (7).jpeg',
    title: 'Outdoor Industrial Site View',
    description: 'Outdoor view of an industrial site with fencing, vehicles, and commercial buildings.',
    image_category: 'business',
    tags: ['industrial', 'site', 'outdoor'],
    promotion_tier: 'promoted',
  },
  {
    stockFile: 'stock-10.jpeg',
    file: 'WhatsApp Image 2026-08-03 at 1.25.03 AM.jpeg',
    title: 'Warehouse and Yard Complex',
    description: 'Stock image of a warehouse and yard complex with open hardstanding.',
    image_category: 'real_estate',
    tags: ['warehouse', 'yard', 'logistics'],
    promotion_tier: 'featured',
  },
];

function resolveImagePath(sample) {
  const candidates = [
    path.join(PUBLIC_STOCK, sample.stockFile),
    path.join(DOCS_DIR, sample.file),
    path.join(BACKEND_ASSETS, sample.file),
  ];
  for (const candidate of candidates) {
    if (fs.existsSync(candidate)) return candidate;
  }
  throw new Error(`Missing file for: ${sample.title}`);
}

async function login() {
  for (const credentials of LOGIN_CANDIDATES) {
    const response = await fetch(`${API_BASE}/auth/web-login`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json', Accept: 'application/json' },
      body: JSON.stringify(credentials),
    });
    const data = await response.json().catch(() => ({}));
    const token =
      data?.data?.access_token ||
      data?.access_token ||
      data?.token ||
      data?.data?.token;
    if (response.ok && token) {
      console.log(`Logged in as ${credentials.email}`);
      return { token, user: data?.data?.user || data?.user || {} };
    }
    console.warn(`Login failed for ${credentials.email}:`, data?.message || response.status);
  }
  throw new Error('Unable to authenticate. Run php artisan db:seed --class=DocsWhatsAppImagesSeeder on the server.');
}

async function uploadImage(filePath) {
  const buffer = fs.readFileSync(filePath);
  const formData = new FormData();
  formData.append('image', new Blob([buffer], { type: 'image/jpeg' }), path.basename(filePath));

  const response = await fetch(`${API_BASE}/images-adverts/upload`, {
    method: 'POST',
    headers: { Accept: 'application/json' },
    body: formData,
  });
  const data = await response.json();
  if (!response.ok || !data?.data?.path) {
    throw new Error(`Upload failed: ${JSON.stringify(data)}`);
  }
  return data.data;
}

async function createAdvert(token, user, sample, uploaded) {
  const payload = {
    title: sample.title,
    description: sample.description,
    short_description: sample.description.slice(0, 140),
    main_image: uploaded.path,
    images: [uploaded.path],
    thumbnail: uploaded.path,
    width: uploaded.width,
    height: uploaded.height,
    orientation: uploaded.orientation || 'landscape',
    color_type: 'color',
    image_category: sample.image_category,
    tags: sample.tags,
    license_type: 'royalty_free',
    standard_price: 9.99,
    extended_price: 29.99,
    exclusive_price: 199.99,
    currency: 'GBP',
    contact_name: [user.first_name, user.last_name].filter(Boolean).join(' ') || 'WWA Admin',
    contact_email: user.email || 'support@worldwideadverts.info',
    agreed_to_terms: true,
    promotion_tier: sample.promotion_tier || 'featured',
    is_verified_creator: true,
  };

  const response = await fetch(`${API_BASE}/images-adverts`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      Accept: 'application/json',
      Authorization: `Bearer ${token}`,
    },
    body: JSON.stringify(payload),
  });
  const data = await response.json();
  if (!response.ok || !data?.data?.id) {
    throw new Error(`Create failed: ${JSON.stringify(data.errors || data.message || data)}`);
  }
  return data.data;
}

async function verifyAdvert(token, id) {
  const response = await fetch(`${API_BASE}/images-adverts/${id}/verify`, {
    method: 'POST',
    headers: {
      Accept: 'application/json',
      Authorization: `Bearer ${token}`,
    },
  });
  if (!response.ok) {
    const data = await response.json().catch(() => ({}));
    console.warn(`Verify warning for ${id}:`, data?.message || response.status);
  }
}

async function main() {
  const { token, user } = await login();
  let ok = 0;
  for (const sample of SAMPLES) {
    try {
      const filePath = resolveImagePath(sample);
      console.log(`Uploading: ${sample.title}`);
      const uploaded = await uploadImage(filePath);
      const created = await createAdvert(token, user, sample, uploaded);
      if (created.verification_status !== 'verified') {
        await verifyAdvert(token, created.id);
      }
      console.log(`OK id=${created.id} slug=${created.slug}`);
      ok += 1;
    } catch (err) {
      console.error(`FAIL ${sample.title}:`, err.message);
    }
  }
  console.log(`Done. ${ok}/${SAMPLES.length} real images published.`);
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
