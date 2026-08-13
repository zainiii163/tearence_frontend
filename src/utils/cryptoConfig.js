/**
 * Crypto checkout config (site-wide — all products via PaymentProcessor).
 */
import api from '../api';

let cached = null;
let inflight = null;

export async function fetchCryptoConfig(force = false) {
  if (!force && cached) return cached;
  if (!force && inflight) return inflight;

  inflight = api
    .get('/crypto/config')
    .then((res) => {
      cached = res?.data || { enabled: false };
      return cached;
    })
    .catch(() => {
      cached = { enabled: false, mock: false };
      return cached;
    })
    .finally(() => {
      inflight = null;
    });

  return inflight;
}

export default { fetchCryptoConfig };
