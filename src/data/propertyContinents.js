import { getWorldCountriesByRegion } from './worldCountries';

/**
 * Browse-by-region taxonomy for Property / Business / Jobs.
 * Country lists come from the canonical worldwide ISO list (flags + forms).
 */
const REGION_META = [
  {
    id: 'europe',
    name: 'Europe',
    lat: 50.5,
    lng: 10,
    zoom: 4,
    bounds: [[35, -12], [71, 40]],
    marketChange: 2.8,
    avgPriceLabel: '€312k',
  },
  {
    id: 'north-america',
    name: 'North America',
    lat: 39.8,
    lng: -98.5,
    zoom: 3.5,
    bounds: [[14, -130], [72, -52]],
    marketChange: -1.4,
    avgPriceLabel: '$385k',
  },
  {
    id: 'asia',
    name: 'Asia',
    lat: 34,
    lng: 100,
    zoom: 3.2,
    bounds: [[-10, 60], [55, 145]],
    marketChange: 4.1,
    avgPriceLabel: '$268k',
  },
  {
    id: 'middle-east',
    name: 'Middle East',
    lat: 25,
    lng: 45,
    zoom: 4,
    bounds: [[12, 32], [42, 60]],
    marketChange: 3.6,
    avgPriceLabel: '$410k',
  },
  {
    id: 'africa',
    name: 'Africa',
    lat: 2,
    lng: 20,
    zoom: 3,
    bounds: [[-38, -18], [38, 52]],
    marketChange: 1.9,
    avgPriceLabel: '$145k',
  },
  {
    id: 'south-america',
    name: 'South America',
    lat: -15,
    lng: -58,
    zoom: 3.2,
    bounds: [[-56, -82], [13, -34]],
    marketChange: -0.8,
    avgPriceLabel: '$165k',
  },
  {
    id: 'oceania',
    name: 'Oceania',
    lat: -28,
    lng: 145,
    zoom: 3,
    bounds: [[-52, 110], [5, 180]],
    marketChange: 2.2,
    avgPriceLabel: 'A$520k',
  },
];

export const PROPERTY_CONTINENTS = REGION_META.map((region) => ({
  ...region,
  countries: getWorldCountriesByRegion(region.id),
}));

export const getContinentById = (id) =>
  PROPERTY_CONTINENTS.find((c) => c.id === String(id || '').toLowerCase()) || null;

export const getContinentByName = (name) => {
  const q = String(name || '').toLowerCase();
  return PROPERTY_CONTINENTS.find((c) => c.name.toLowerCase() === q || c.id === q) || null;
};

export const countryToSlug = (country) =>
  String(country || '')
    .trim()
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-|-$/g, '');

export const findCountryBySlug = (slug) => {
  const s = String(slug || '').toLowerCase();
  for (const continent of PROPERTY_CONTINENTS) {
    const match = continent.countries.find((c) => countryToSlug(c) === s);
    if (match) return { country: match, continent };
  }
  return null;
};
