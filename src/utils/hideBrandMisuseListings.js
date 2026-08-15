/**
 * Hide example/test Buy & Sell posts that advertise with the WWA brand.
 * Clive: using World Wide Adverts as a listing is a brand killer.
 */
const BRAND_TITLE_RE = /world\s*wide\s*adverts|worldwideadverts|\bwwa\b/i;
const BRAND_ASSET_RE = /wwalogo|wwa-logo|wwaLogo/i;
const TEST_TITLE_RE = /^(test|example|sample|demo)(\s|$)/i;

function listingText(item) {
  if (!item || typeof item !== 'object') return '';
  return [
    item.title,
    item.name,
    item.brand,
    item.seller?.name,
    item.user?.name,
    item.company_name,
  ]
    .filter(Boolean)
    .join(' ');
}

function listingImages(item) {
  if (!item) return '';
  try {
    return JSON.stringify(
      item.images ||
        item.image ||
        item.main_image ||
        item.image_url ||
        item.thumbnail_url ||
        item.media ||
        ''
    );
  } catch {
    return '';
  }
}

export function isBrandMisuseListing(item) {
  const text = listingText(item);
  const title = String(item?.title || item?.name || '');
  if (BRAND_TITLE_RE.test(title)) return true;
  if (TEST_TITLE_RE.test(title.trim()) && BRAND_TITLE_RE.test(text)) return true;
  if (BRAND_ASSET_RE.test(listingImages(item))) return true;
  return false;
}

export function withoutBrandMisuseListings(items = []) {
  if (!Array.isArray(items)) return [];
  return items.filter((item) => !isBrandMisuseListing(item));
}
