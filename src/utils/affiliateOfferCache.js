import { extractListItems } from './apiResponseHelpers';

const CACHE_KEY = 'wwa_affiliate_business_offers_v1';
const CACHE_TTL_MS = 5 * 60 * 1000;

function readStore() {
  try {
    const raw = sessionStorage.getItem(CACHE_KEY);
    if (!raw) return { at: 0, byId: {} };
    const parsed = JSON.parse(raw);
    return {
      at: Number(parsed.at) || 0,
      byId: parsed.byId && typeof parsed.byId === 'object' ? parsed.byId : {},
    };
  } catch {
    return { at: 0, byId: {} };
  }
}

function writeStore(store) {
  try {
    sessionStorage.setItem(CACHE_KEY, JSON.stringify(store));
  } catch {
    /* ignore quota */
  }
}

export function cacheBusinessOffers(offers = []) {
  if (!Array.isArray(offers) || !offers.length) return;
  const store = readStore();
  const next = { ...store.byId };
  offers.forEach((offer) => {
    if (offer?.id == null) return;
    const id = String(offer.id).replace(/^business-/, '');
    next[id] = { ...offer, id: Number(id) || offer.id };
  });
  writeStore({ at: Date.now(), byId: next });
}

export function getCachedBusinessOffer(id) {
  const offerId = String(id || '').replace(/^business-/, '');
  if (!offerId) return null;
  const store = readStore();
  if (Date.now() - store.at > CACHE_TTL_MS) return store.byId[offerId] || null;
  return store.byId[offerId] || null;
}

export function unwrapBusinessOffersResponse(response) {
  const items = extractListItems(response);
  cacheBusinessOffers(items);
  return items;
}
