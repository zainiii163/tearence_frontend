/**
 * Shared PayPal env helpers — authentic checkout only (no dummy/test bypass).
 */
export const getPayPalClientId = () => {
  const id = (process.env.REACT_APP_PAYPAL_CLIENT_ID || '').trim();
  if (!id || id === 'YOUR_PAYPAL_CLIENT_ID') return '';
  return id;
};

/** True when a real client id is set (not the PayPal "sb" demo placeholder alone unless env sets it). */
export const isPayPalConfigured = () => Boolean(getPayPalClientId());

/**
 * Client id passed to PayPalButtons.
 * Prefers REACT_APP_PAYPAL_CLIENT_ID; falls back to PayPal sandbox demo id "sb"
 * so the real PayPal UI still appears in local/dev when credentials are missing.
 */
export const resolvePayPalClientId = () => getPayPalClientId() || 'sb';

export const isPayPalSandboxDemo = () => !getPayPalClientId();
