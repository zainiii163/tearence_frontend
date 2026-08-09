/**
 * Resolve whether the signed-in user is a basic (buyer) or business (poster) account.
 * Prefers the type chosen on Login (localStorage), then API user_type.
 */

export const ACCOUNT_TYPE_BASIC = 'basic';
export const ACCOUNT_TYPE_BUSINESS = 'business';

function normalizeAccountType(raw) {
  const normalized = String(raw || '').toLowerCase().trim();
  if (normalized === 'business' || normalized === 'seller' || normalized === 'company') {
    return ACCOUNT_TYPE_BUSINESS;
  }
  if (normalized === 'basic' || normalized === 'personal' || normalized === 'buyer' || normalized === 'customer') {
    return ACCOUNT_TYPE_BASIC;
  }
  return null;
}

export function resolveAccountType(userDetail, fallback = ACCOUNT_TYPE_BASIC) {
  const fromLogin =
    typeof window !== 'undefined'
      ? normalizeAccountType(localStorage.getItem('wwa_login_account_type'))
      : null;
  if (fromLogin) return fromLogin;

  const fromApi = normalizeAccountType(
    userDetail?.user_type ||
      userDetail?.data?.user_type ||
      userDetail?.account_type ||
      userDetail?.data?.account_type
  );
  if (fromApi) return fromApi;

  return fallback === ACCOUNT_TYPE_BUSINESS ? ACCOUNT_TYPE_BUSINESS : ACCOUNT_TYPE_BASIC;
}

export function isBusinessAccount(userDetail) {
  return resolveAccountType(userDetail) === ACCOUNT_TYPE_BUSINESS;
}

export function isBasicAccount(userDetail) {
  return resolveAccountType(userDetail) === ACCOUNT_TYPE_BASIC;
}

/** Default dashboard entry after login / navbar Dashboard click */
export function getDashboardHomePath(accountType) {
  if (accountType === ACCOUNT_TYPE_BUSINESS) {
    return '/dashboard?mode=selling';
  }
  return '/dashboard?mode=buying';
}

export function persistAccountType(accountType) {
  try {
    localStorage.setItem('wwa_login_account_type', accountType);
    localStorage.setItem(
      'wwa_dashboard_mode',
      accountType === ACCOUNT_TYPE_BUSINESS ? 'selling' : 'buying'
    );
  } catch {
    /* ignore */
  }
}
