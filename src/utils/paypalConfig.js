/**
 * Shared PayPal env helpers — sandbox-aware authentic checkout.
 */
import api from '../api';

let cachedConfig = null;
let configPromise = null;

export const getPayPalClientId = () => {
  const id = (process.env.REACT_APP_PAYPAL_CLIENT_ID || '').trim();
  if (!id || id === 'YOUR_PAYPAL_CLIENT_ID') return '';
  return id;
};

export const isPayPalConfigured = () => Boolean(getPayPalClientId());

/**
 * Client id for PayPalButtons.
 * Prefers REACT_APP_PAYPAL_CLIENT_ID; falls back to "sb" (PayPal sandbox demo).
 */
export const resolvePayPalClientId = () => getPayPalClientId() || 'sb';

export const isPayPalSandboxDemo = () => !getPayPalClientId();

/** Load mode/client_id/mock from API so FE matches server sandbox settings. */
export const fetchPayPalConfig = async (force = false) => {
  if (cachedConfig && !force) return cachedConfig;
  if (configPromise && !force) return configPromise;

  configPromise = api
    .get('/paypal/config')
    .then((res) => {
      const data = res?.data?.data || res?.data || {};
      cachedConfig = {
        client_id: data.client_id || resolvePayPalClientId(),
        mode: data.mode || 'sandbox',
        currency: data.currency || 'USD',
        configured: Boolean(data.configured),
        mock: Boolean(data.mock),
        sandbox: data.sandbox !== false && data.mode !== 'live',
      };
      return cachedConfig;
    })
    .catch(() => {
      cachedConfig = {
        client_id: resolvePayPalClientId(),
        mode: process.env.REACT_APP_PAYPAL_MODE || 'sandbox',
        currency: 'USD',
        configured: isPayPalConfigured(),
        mock: !isPayPalConfigured(),
        sandbox: true,
      };
      return cachedConfig;
    })
    .finally(() => {
      configPromise = null;
    });

  return configPromise;
};

export default {
  getPayPalClientId,
  isPayPalConfigured,
  resolvePayPalClientId,
  isPayPalSandboxDemo,
  fetchPayPalConfig,
};
