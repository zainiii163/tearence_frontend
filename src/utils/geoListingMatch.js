import {
  countryToSlug,
  getContinentById,
} from '../data/propertyContinents';

/**
 * Shared geo matching for business / jobs listings (same taxonomy as property).
 */
export const listingLocationHaystack = (item = {}) =>
  [
    item.country,
    item.location,
    item.city,
    item.region,
    item.state,
    item.business_address,
    item.address,
    item.company_location,
    item.desired_location,
  ]
    .filter(Boolean)
    .join(' ')
    .toLowerCase();

export const matchesCountryName = (item, countryName, { keepUnknown = false } = {}) => {
  if (!countryName) return true;
  const hay = listingLocationHaystack(item);
  if (!hay) return keepUnknown;
  const q = String(countryName).toLowerCase();
  const slug = countryToSlug(countryName);
  return hay.includes(q) || hay.includes(slug.replace(/-/g, ' '));
};

export const matchesContinentRegion = (item, continent, { keepUnknown = true } = {}) => {
  if (!continent) return true;
  const countries = (continent.countries || []).map((c) => String(c).toLowerCase());
  const hay = listingLocationHaystack(item);
  if (!hay) return keepUnknown;
  return countries.some((c) => hay.includes(c));
};

export const resolveContinent = (continentId) => getContinentById(continentId);
