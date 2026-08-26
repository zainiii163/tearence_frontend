/**
 * Shared Stripe env helpers — card checkout via PaymentProcessor.
 */
import api from '../api';

let cachedConfig = null;
let configPromise = null;

export const getStripePublishableKey = () => {
  const key = (process.env.REACT_APP_STRIPE_PUBLISHABLE_KEY || '').trim();
  if (!key || key.includes('xxx') || key.includes('YOUR_')) return '';
  return key;
};

/** Load publishable key / mock from API so FE matches server. */
export const fetchStripeConfig = async (force = false) => {
  if (cachedConfig && !force) return cachedConfig;
  if (configPromise && !force) return configPromise;

  configPromise = api
    .get('/stripe/config')
    .then((res) => {
      const data = res?.data?.data || res?.data || {};
      cachedConfig = {
        enabled: data.enabled !== false,
        mock: Boolean(data.mock),
        publishable_key: data.publishable_key || getStripePublishableKey(),
        currency: data.currency || 'USD',
        configured: Boolean(data.configured),
        message: data.message || '',
      };
      return cachedConfig;
    })
    .catch(() => {
      const key = getStripePublishableKey();
      cachedConfig = {
        enabled: true,
        mock: !key,
        publishable_key: key,
        currency: 'USD',
        configured: Boolean(key),
        message: key ? '' : 'Stripe mock (no publishable key)',
      };
      return cachedConfig;
    })
    .finally(() => {
      configPromise = null;
    });

  return configPromise;
};

export default {
  getStripePublishableKey,
  fetchStripeConfig,
};
