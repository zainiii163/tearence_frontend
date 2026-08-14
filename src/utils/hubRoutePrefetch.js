/**
 * Prefetch marketplace hub route chunks so category clicks feel instant.
 * Maps homepage hub routes → the same dynamic imports used in App.jsx.
 */

const loaders = {
  '/buy-sell': () => import('../Pages/buy-sell'),
  '/business': () => import('../Pages/BusinessPage'),
  '/services': () => import('../Pages/ServicesPage'),
  '/property': () => import('../Pages/property/index'),
  '/jobs': () => import('../Pages/jobs'),
  '/software': () => import('../Pages/software'),
  '/events-venues': () => import('../Pages/events-venues'),
  '/adverts': () => import('../Pages/AdvertsHubPage'),
  '/paid-adverts': () => import('../Pages/PaidAdvertsPage'),
  '/sponsored-adverts': () => import('../Pages/sponsored-adverts'),
  '/promoted-adverts': () => import('../Pages/promoted-adverts'),
  '/banner-adverts': () => import('../Pages/banner-adverts'),
  '/featured-adverts': () => import('../Pages/featured'),
  '/funding': () => import('../Pages/funding'),
  '/stores': () => import('../Pages/StoresPage'),
  '/store/wwa-atelier': () => import('../Pages/ExampleStorePage'),
  '/books': () => import('../Pages/books'),
  '/vehicles': () => import('../Pages/vehicles'),
  '/donations': () => import('../Pages/DonationsPage'),
  '/images': () => import('../Pages/images'),
  '/classifieds-ads': () => import('../Pages/ClassifiedAdsPage'),
  '/affiliates': () => import('../Pages/AffiliatesAdsPage'),
  '/affiliates/marketplace': () => import('../Pages/AffiliatesMarketplacePage'),
  '/affiliates/courses': () => import('../Pages/AffiliatesCoursesPage'),
  '/resorts-travel': () => import('../Pages/resorts-travel'),
  '/businesses-for-sale': () => import('../Pages/InvestingPage'),
};

const warmed = new Set();

const normalizePath = (route) => {
  if (!route || typeof route !== 'string') return null;
  const path = route.split('?')[0].split('#')[0].replace(/\/+$/, '') || '/';
  return path;
};

/** Warm the JS chunk for a hub route (safe to call repeatedly). */
export const prefetchHubRoute = (route) => {
  const path = normalizePath(route);
  if (!path || warmed.has(path)) return;

  const loader = loaders[path];
  if (!loader) return;

  warmed.add(path);
  try {
    const pending = loader();
    if (pending && typeof pending.catch === 'function') {
      pending.catch(() => {
        warmed.delete(path);
      });
    }
  } catch {
    warmed.delete(path);
  }
};

export default prefetchHubRoute;
