/**
 * Travel continents — same geography as Property (Leaflet focus), travel-oriented stats.
 */
import { PROPERTY_CONTINENTS } from './propertyContinents';

const TRAVEL_STATS = {
  europe: { marketChange: 3.2, avgPriceLabel: '$120/night' },
  'north-america': { marketChange: 1.8, avgPriceLabel: '$150/night' },
  asia: { marketChange: 4.5, avgPriceLabel: '$60/night' },
  'middle-east': { marketChange: 2.9, avgPriceLabel: '$140/night' },
  africa: { marketChange: 2.1, avgPriceLabel: '$70/night' },
  'south-america': { marketChange: 1.4, avgPriceLabel: '$80/night' },
  oceania: { marketChange: 2.6, avgPriceLabel: '$130/night' },
};

export const TRAVEL_CONTINENTS = PROPERTY_CONTINENTS.map((c) => ({
  ...c,
  ...(TRAVEL_STATS[c.id] || {}),
}));

export const getTravelContinentById = (id) =>
  TRAVEL_CONTINENTS.find((c) => c.id === String(id || '').toLowerCase()) || null;
