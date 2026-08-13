/**
 * Per-dashboard-section sub-options (sidebar children + in-page tabs).
 * Listing sections share Overview | Table | Create.
 */

export const LISTING_SUBS = [
  { id: 'overview', label: 'Overview' },
  { id: 'table', label: 'Table' },
  { id: 'create', label: 'Create' },
];

/** Tabs that use the standard listing sub-nav */
export const LISTING_SECTION_TAB_IDS = new Set([
  'buy-sell',
  'ads',
  'jobs',
  'books',
  'services',
  'properties',
  'vehicles',
  'events-venues',
  'resorts-travel',
  'funding',
  'donations',
  'store',
  'business',
  'sponsored',
  'featured',
  'banners',
  'templates',
]);

/** Special sections with their own children */
export const SECTION_SUBNAV = {
  affiliates: [
    { id: 'selling', label: 'Seller programs' },
    { id: 'links', label: 'Link ads' },
    { id: 'promoting', label: 'Promoting' },
    { id: 'earnings', label: 'Earnings' },
    { id: 'money', label: 'Sales & payouts' },
    { id: 'adverts', label: 'Adverts & expiry' },
  ],
  commerce: [
    { id: 'purchases', label: 'My purchases' },
    { id: 'sales', label: 'My sales' },
    { id: 'earnings', label: 'Seller earnings' },
  ],
  purchases: [{ id: 'table', label: 'My purchases' }],
  jobseeker: [
    { id: 'overview', label: 'Overview' },
    { id: 'create', label: 'Create / edit profile' },
  ],
};

export function getSectionSubItems(tabId, { isBusinessUser = true } = {}) {
  if (tabId === 'affiliates') {
    if (!isBusinessUser) {
      return [
        { id: 'promoting', label: 'Promoting' },
        { id: 'earnings', label: 'Earnings' },
      ];
    }
    return SECTION_SUBNAV.affiliates;
  }
  if (tabId === 'commerce') {
    if (!isBusinessUser) {
      return [{ id: 'purchases', label: 'My purchases' }];
    }
    return SECTION_SUBNAV.commerce;
  }
  if (SECTION_SUBNAV[tabId]) return SECTION_SUBNAV[tabId];
  if (LISTING_SECTION_TAB_IDS.has(tabId)) return LISTING_SUBS;
  return [];
}

export function defaultSubForTab(tabId, { isBusinessUser = true } = {}) {
  const items = getSectionSubItems(tabId, { isBusinessUser });
  if (!items.length) return null;
  if (tabId === 'affiliates') return isBusinessUser ? 'selling' : 'promoting';
  if (tabId === 'commerce') return 'purchases';
  return items[0].id;
}

export function sectionHasSubNav(tabId) {
  return LISTING_SECTION_TAB_IDS.has(tabId) || Boolean(SECTION_SUBNAV[tabId]);
}
