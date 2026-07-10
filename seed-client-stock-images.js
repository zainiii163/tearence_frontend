/**
 * Upload client test stock images to the live WWA API.
 * Usage: node seed-client-stock-images.js
 */
const fs = require('fs');
const path = require('path');

const API_BASE = process.env.REACT_APP_API_URL || 'https://api.worldwideadverts.info/api/v1';
const BACKEND_ASSETS = path.join(__dirname, '..', 'WWA-backend-New_main', 'database', 'seeders', 'assets', 'client-stock-images');

const LOGIN_CANDIDATES = [
  { email: 'shihab@worldwideadverts.info', password: 'Admin@123' },
  { email: 'rizky@worldwideadverts.info', password: 'admin123' },
  { email: 'vikas@worldwideadverts.info', password: 'Admin@123' },
];

const SAMPLES = [
  {
    file: 'client-stock-image-1.png',
    assetMatch: 'c6b94e93',
    title: 'Open Road Junction Under Cloudy Sky',
    description:
      'Wide landscape stock photo of a paved road junction with trees, street lighting, and dramatic cloudy skies. Ideal for property, transport, and commercial projects.',
    image_category: 'real_estate',
    tags: ['road', 'junction', 'landscape', 'property', 'outdoor'],
    promotion_tier: 'featured',
  },
  {
    file: 'client-stock-image-2.png',
    assetMatch: '10.14.22_PM-3536710f',
    title: 'Paved Intersection with Street Lights',
    description:
      'Outdoor stock image of a quiet paved intersection with street lights, greenery, and open sky. Suitable for real estate, classifieds, and editorial use.',
    image_category: 'real_estate',
    tags: ['intersection', 'street', 'parking', 'commercial', 'landscape'],
    promotion_tier: 'promoted',
  },
  {
    file: 'client-stock-image-3.png',
    assetMatch: '10.14.22_PM__1_',
    title: 'Industrial Yard Entrance with Fencing',
    description:
      'Stock photograph of an industrial yard entrance with metal fencing, asphalt surfaces, and landscaped trees under a bright cloudy sky.',
    image_category: 'business',
    tags: ['industrial', 'fence', 'yard', 'business', 'commercial'],
    promotion_tier: 'standard',
  },
];

function resolveImagePath(sample) {
  const backendFile = path.join(BACKEND_ASSETS, sample.file);
  if (fs.existsSync(backendFile)) {
    return backendFile;
  }

  const cursorAssets = path.join(
    process.env.USERPROFILE || '',
    '.cursor',
    'projects',
    'd-live-WWA-Frontend-New-main',
    'assets'
  );

  if (fs.existsSync(cursorAssets)) {
    const match = fs.readdirSync(cursorAssets).find((name) => name.includes(sample.assetMatch));
    if (match) {
      return path.join(cursorAssets, match);
    }
  }

  throw new Error(`Image not found for ${sample.title}`);
}

async function login() {
  for (const credentials of LOGIN_CANDIDATES) {
    const response = await fetch(`${API_BASE}/auth/web-login`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json', Accept: 'application/json' },
      body: JSON.stringify(credentials),
    });

    const data = await response.json().catch(() => ({}));

    if (response.ok && data?.data?.access_token) {
      console.log(`Logged in as ${credentials.email}`);
      return data.data.access_token;
    }
  }

  throw new Error('Unable to authenticate against the live API. Run the backend seeder on the server instead.');
}

async function uploadImage(filePath) {
  const buffer = fs.readFileSync(filePath);
  const formData = new FormData();
  formData.append('image', new Blob([buffer], { type: 'image/png' }), path.basename(filePath));

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

async function createAdvert(token, sample, uploaded) {
  const payload = {
    title: sample.title,
    description: sample.description,
    short_description: sample.description.slice(0, 140),
    main_image: uploaded.path,
    images: [uploaded.path],
    thumbnail: uploaded.path,
    width: uploaded.width,
    height: uploaded.height,
    orientation: uploaded.orientation,
    color_type: 'color',
    image_category: sample.image_category,
    tags: sample.tags,
    license_type: 'royalty_free',
    standard_price: 9.99,
    extended_price: 29.99,
    exclusive_price: 199.99,
    currency: 'GBP',
    contact_name: 'WWA Admin',
    contact_email: 'support@worldwideadverts.info',
    agreed_to_terms: true,
    promotion_tier: sample.promotion_tier,
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
    throw new Error(`Create advert failed: ${JSON.stringify(data)}`);
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

  const data = await response.json();
  if (!response.ok) {
    throw new Error(`Verify failed: ${JSON.stringify(data)}`);
  }

  return data;
}

async function main() {
  console.log(`Using API: ${API_BASE}`);
  const token = await login();

  for (const sample of SAMPLES) {
    const filePath = resolveImagePath(sample);
    console.log(`Uploading ${sample.title}...`);
    const uploaded = await uploadImage(filePath);
    const advert = await createAdvert(token, sample, uploaded);
    await verifyAdvert(token, advert.id);
    console.log(`Verified image advert #${advert.id}: ${sample.title}`);
  }

  const listResponse = await fetch(`${API_BASE}/images-adverts?per_page=5`);
  const listData = await listResponse.json();
  const total = listData?.data?.total ?? listData?.data?.data?.length ?? 'unknown';
  console.log(`Done. Live images count: ${total}`);
}

main().catch((error) => {
  console.error(error.message);
  process.exit(1);
});
