import { getStorageAssetUrl } from './jobsHelpers';

/** Build multipart FormData for BooksAdvertController store/update */
export function buildBookFormData(data) {
  const formData = new FormData();

  const append = (key, value) => {
    if (value === undefined || value === null || value === '') return;
    formData.append(key, value);
  };

  const scalarFields = [
    'book_type', 'title', 'subtitle', 'description', 'short_description',
    'author_name', 'author_bio', 'language', 'genre', 'format', 'price',
    'currency', 'country', 'publisher', 'publication_date', 'isbn', 'pages',
    'age_range', 'series_name', 'edition', 'location_address', 'latitude',
    'longitude', 'trailer_video_url', 'upsell_tier',
  ];

  scalarFields.forEach((key) => {
    if (key === 'currency' && data[key]) {
      formData.append(key, String(data[key]).toUpperCase());
      return;
    }
    if (key === 'isbn') {
      append(key, normalizeIsbn(data[key]));
      return;
    }
    append(key, data[key]);
  });

  if (data.agreed_to_terms !== undefined) {
    formData.append('agreed_to_terms', data.agreed_to_terms ? '1' : '0');
  } else {
    formData.append('agreed_to_terms', '1');
  }
  if (data.verified_author !== undefined) {
    formData.append('verified_author', data.verified_author ? '1' : '0');
  }

  if (data.cover_image instanceof File) {
    formData.append('cover_image', data.cover_image);
  }
  if (data.author_photo instanceof File) {
    formData.append('author_photo', data.author_photo);
  }

  if (Array.isArray(data.additional_images)) {
    data.additional_images.forEach((file) => {
      if (file instanceof File) formData.append('additional_images[]', file);
    });
  }

  if (Array.isArray(data.sample_files)) {
    data.sample_files.forEach((file) => {
      if (file instanceof File) formData.append('sample_files[]', file);
    });
  }

  if (Array.isArray(data.author_social_links)) {
    data.author_social_links.forEach((url, i) => append(`author_social_links[${i}]`, url));
  } else if (data.author_social_links && typeof data.author_social_links === 'object') {
    Object.entries(data.author_social_links).forEach(([platform, url]) => {
      if (url) append(`author_social_links[${platform}]`, url);
    });
  }

  if (Array.isArray(data.purchase_links)) {
    data.purchase_links.forEach((link, i) => {
      if (link?.platform) append(`purchase_links[${i}][platform]`, link.platform);
      if (link?.url) append(`purchase_links[${i}][url]`, link.url);
    });
  }

  return formData;
}

export const BOOK_GENRES = [
  'Fiction', 'Non-Fiction', 'Romance', 'Mystery', 'Sci-Fi', 'Biography',
  'History', 'Self-Help', 'Business', 'Programming', 'Fantasy', 'Thriller',
  'Education', 'Textbook', 'Children',
];

export const BOOK_TYPES = [
  { value: 'fiction', label: 'Fiction' },
  { value: 'non-fiction', label: 'Non-Fiction' },
  { value: 'children', label: 'Children' },
  { value: 'poetry', label: 'Poetry' },
  { value: 'academic', label: 'Academic' },
  { value: 'self-help', label: 'Self-Help' },
  { value: 'business', label: 'Business' },
  { value: 'other', label: 'Other' },
];

export const BOOK_CURRENCIES = ['USD', 'GBP', 'EUR', 'JPY', 'CAD', 'AUD'];

/** ISO 3166-1 alpha-2 codes accepted by StoreBookRequest (ea_countries) */
export const BOOK_COUNTRIES = [
  { code: 'US', name: 'United States' },
  { code: 'GB', name: 'United Kingdom' },
  { code: 'CA', name: 'Canada' },
  { code: 'AU', name: 'Australia' },
  { code: 'DE', name: 'Germany' },
  { code: 'FR', name: 'France' },
  { code: 'IT', name: 'Italy' },
  { code: 'ES', name: 'Spain' },
  { code: 'NL', name: 'Netherlands' },
  { code: 'IN', name: 'India' },
  { code: 'JP', name: 'Japan' },
  { code: 'CN', name: 'China' },
  { code: 'BR', name: 'Brazil' },
  { code: 'MX', name: 'Mexico' },
  { code: 'ZA', name: 'South Africa' },
  { code: 'AE', name: 'United Arab Emirates' },
  { code: 'PK', name: 'Pakistan' },
  { code: 'NG', name: 'Nigeria' },
  { code: 'KE', name: 'Kenya' },
];

export const BOOK_FORMATS = [
  { value: 'paperback', label: 'Paperback' },
  { value: 'hardcover', label: 'Hardcover' },
  { value: 'ebook', label: 'E-book' },
  { value: 'audiobook', label: 'Audiobook' },
];

export const BOOK_LANGUAGES = ['English', 'Spanish', 'French', 'German', 'Arabic', 'Chinese', 'Japanese'];

/** Backend StoreBookRequest: nullable, digits/X/hyphens only, max 20 */
export const ISBN_PATTERN = /^[0-9Xx-]+$/;

export function normalizeIsbn(value) {
  const trimmed = String(value || '').trim();
  if (!trimmed) return '';
  return ISBN_PATTERN.test(trimmed) ? trimmed : '';
}

export function isValidIsbn(value) {
  const trimmed = String(value || '').trim();
  if (!trimmed) return true;
  return ISBN_PATTERN.test(trimmed) && trimmed.length <= 20;
}

/** Resolve cover URL from API path or accessor field */
export function getBookCoverUrl(bookOrPath) {
  if (!bookOrPath) return null;
  if (typeof bookOrPath === 'string') {
    return getStorageAssetUrl(bookOrPath);
  }
  return getStorageAssetUrl(bookOrPath.cover_image_url || bookOrPath.cover_image);
}

/** Resolve additional gallery image (path string or { path, url } object) */
export function getBookMediaUrl(image) {
  if (!image) return null;
  if (typeof image === 'string') {
    return image.startsWith('http') ? image : getStorageAssetUrl(image);
  }
  const path = image.url || image.path;
  if (!path) return null;
  return path.startsWith('http') ? path : getStorageAssetUrl(path);
}
