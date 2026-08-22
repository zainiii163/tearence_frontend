const filamentBase = () =>
  (
    process.env.REACT_APP_ADMIN_URL ||
    process.env.REACT_APP_API_URL?.replace(/\/api\/v1\/?$/, '') ||
    'https://api.worldwideadverts.info'
  ).replace(/\/$/, '');

export const FILAMENT_BASE_URL = filamentBase();
export const FILAMENT_TEAMS_URL = `${filamentBase()}/admin/teams-roles`;
export const FILAMENT_AFFILIATE_PAYOUTS_URL = `${filamentBase()}/admin/affiliate-payouts`;
export const FILAMENT_SELLER_PAYOUTS_URL = `${filamentBase()}/admin/seller-payouts`;
export const FILAMENT_CRYPTO_PAYMENTS_URL = `${filamentBase()}/admin/crypto-payments`;
export const FILAMENT_CATEGORY_MONEY_URL = `${filamentBase()}/admin/category-money`;
export const FILAMENT_ADVERTS_LIFECYCLE_URL = `${filamentBase()}/admin/adverts-lifecycle`;

export const FILAMENT_LOGIN_ACTIVITY_URL = `${filamentBase()}/admin/login-logs`;

export default {
  FILAMENT_BASE_URL,
  FILAMENT_TEAMS_URL,
  FILAMENT_AFFILIATE_PAYOUTS_URL,
  FILAMENT_SELLER_PAYOUTS_URL,
  FILAMENT_CRYPTO_PAYMENTS_URL,
  FILAMENT_CATEGORY_MONEY_URL,
  FILAMENT_ADVERTS_LIFECYCLE_URL,
  FILAMENT_LOGIN_ACTIVITY_URL,
};
