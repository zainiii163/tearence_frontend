/**
 * Upload docs WhatsApp images to live Images & Media API.
 * Usage: node seed-docs-whatsapp-images.js
 */
const fs = require('fs');
const path = require('path');

const API_BASE = process.env.REACT_APP_API_URL || 'https://api.worldwideadverts.info/api/v1';
const DOCS_DIR = path.join(__dirname, 'docs');
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
    file: 'WhatsApp Image 2026-08-03 at 1.25.02 AM.jpeg',
    title: 'Industrial Yard with Yellow Cable Coils',
    description:
      'Outdoor stock photo of a secure industrial yard behind black mesh fencing, with bright yellow coiled utility piping, no-parking bollards, and an asphalt access road under an overcast sky.',
    image_category: 'business',
    tags: ['industrial', 'utility', 'yellow-cable', 'fencing', 'commercial'],
  },
  {
    file: 'WhatsApp Image 2026-08-03 at 1.25.02 AM (1).jpeg',
    title: 'Commercial Storage Yard Stock Photo',
    description:
      'Stock image of a commercial storage and utility yard with fencing, outdoor equipment, and open asphalt surfaces.',
    image_category: 'business',
    tags: ['storage', 'commercial', 'yard', 'industrial'],
  },
  {
    file: 'WhatsApp Image 2026-08-03 at 1.25.03 AM.jpeg',
    title: 'Warehouse Units 43-47 with Loading Bays',
    description:
      'Modern multi-unit warehouse terrace with numbered blue roller shutters (units 43-47), delivery van, and red waste bins on a wide asphalt forecourt.',
    image_category: 'real_estate',
    tags: ['warehouse', 'units', 'loading-bay', 'property'],
  },
  {
    file: 'WhatsApp Image 2026-08-03 at 1.25.03 AM (1).jpeg',
    title: 'Industrial Estate Forecourt',
    description: 'Wide view of an industrial estate forecourt and commercial buildings under soft daylight.',
    image_category: 'real_estate',
    tags: ['industrial-estate', 'forecourt', 'property'],
  },
  {
    file: 'WhatsApp Image 2026-08-03 at 1.25.03 AM (2).jpeg',
    title: 'Business Park Exterior Stock Shot',
    description: 'Exterior photograph of a business park / light industrial premises with parking area.',
    image_category: 'business',
    tags: ['business-park', 'exterior', 'parking'],
  },
  {
    file: 'WhatsApp Image 2026-08-03 at 1.25.03 AM (3).jpeg',
    title: 'M61 Roadside with Pylon and Industrial Site',
    description:
      'Roadside stock photo near the M61 with painted road markings, electricity pylon, digital speed sign, and industrial buildings under clear sky.',
    image_category: 'travel',
    tags: ['motorway', 'M61', 'pylon', 'roadside'],
  },
  {
    file: 'WhatsApp Image 2026-08-03 at 1.25.03 AM (4).jpeg',
    title: 'Road and Infrastructure Landscape',
    description: 'Outdoor landscape showing road infrastructure and nearby commercial development.',
    image_category: 'travel',
    tags: ['road', 'infrastructure', 'landscape'],
  },
  {
    file: 'WhatsApp Image 2026-08-03 at 1.25.03 AM (5).jpeg',
    title: 'Commercial Premises Stock Photo',
    description: 'Stock photograph of commercial premises and surrounding grounds.',
    image_category: 'real_estate',
    tags: ['premises', 'commercial', 'property'],
  },
  {
    file: 'WhatsApp Image 2026-08-03 at 1.25.03 AM (6).jpeg',
    title: 'Outdoor Industrial Site View',
    description: 'Outdoor view of an industrial site with fencing, vehicles, and commercial buildings.',
    image_category: 'business',
    tags: ['industrial', 'site', 'outdoor'],
  },
  {
    file: 'WhatsApp Image 2026-08-03 at 1.25.03 AM (7).jpeg',
    title: 'Warehouse and Yard Complex',
    description: 'Stock image of a warehouse and yard complex with open hardstanding.',
    image_category: 'real_estate',
    tags: ['warehouse', 'yard', 'logistics'],
  },
];

function resolveImagePath(sample) {
  const candidates = [
    path.join(DOCS_DIR, sample.file),
    path.join(BACKEND_ASSETS, sample.file),
  ];
  for (const candidate of candidates) {
    if (fs.existsSync(candidate)) return candidate;
  }
  throw new Error(`Missing file: ${sample.file}`);
}

async function login() {
  for (const credentials of LOGIN_CANDIDATES) {
    const response = await fetch(`${API_BASE}/auth/web-login`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json', Accept: 'application/json' },
      body: JSON.stringify(credentials),
    });
    const data = await response.json().catch(() => ({}));
    const token = data?.token || data?.access_token || data?.data?.token;
    if (response.ok && token) {
      console.log(`Logged in as ${credentials.email}`);
      return { token, user: data.user || data.data?.user || {} };
    }
  }
  throw new Error('Login failed for all admin candidates');
}

async function uploadOne(token, user, sample) {
  const filePath = resolveImagePath(sample);
  const blob = new Blob([fs.readFileSync(filePath)], { type: 'image/jpeg' });
  const form = new FormData();
  form.append('image', blob, path.basename(filePath));

  const uploadRes = await fetch(`${API_BASE}/images-adverts/upload`, {
    method: 'POST',
    headers: { Authorization: `Bearer ${token}`, Accept: 'application/json' },
    body: form,
  });
  const uploadJson = await uploadRes.json();
  if (!uploadRes.ok) throw new Error(uploadJson.message || 'Upload failed');

  const upload = uploadJson.data || uploadJson;
  const payload = {
    title: sample.title,
    description: sample.description,
    short_description: sample.description.slice(0, 140),
    main_image: upload.path,
    images: [upload.path],
    thumbnail: upload.path,
    width: upload.width,
    height: upload.height,
    orientation: upload.orientation || 'landscape',
    color_type: 'color',
    image_category: sample.image_category,
    tags: sample.tags,
    license_type: 'royalty_free',
    standard_price: 9.99,
    extended_price: 29.99,
    exclusive_price: 199.99,
    currency: 'GBP',
    promotion_tier: 'featured',
    contact_name: [user.first_name, user.last_name].filter(Boolean).join(' ') || 'WWA Admin',
    contact_email: user.email || 'admin@worldwideadverts.info',
    agreed_to_terms: true,
    media_type: 'image',
  };

  const createRes = await fetch(`${API_BASE}/images-adverts`, {
    method: 'POST',
    headers: {
      Authorization: `Bearer ${token}`,
      Accept: 'application/json',
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(payload),
  });
  const createJson = await createRes.json();
  if (!createRes.ok) throw new Error(JSON.stringify(createJson.errors || createJson.message || createJson));

  const id = createJson.data?.id;
  if (id && createJson.data?.verification_status !== 'verified') {
    await fetch(`${API_BASE}/images-adverts/${id}/verify`, {
      method: 'POST',
      headers: { Authorization: `Bearer ${token}`, Accept: 'application/json' },
    });
  }

  console.log(`OK: ${sample.title}`);
}

async function main() {
  const { token, user } = await login();
  for (const sample of SAMPLES) {
    try {
      await uploadOne(token, user, sample);
    } catch (err) {
      console.error(`FAIL ${sample.title}:`, err.message);
    }
  }
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
