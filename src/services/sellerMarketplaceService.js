import api from './api';

/**
 * Marketplace seller earnings (product sales → seller share after platform fee).
 */
const sellerMarketplaceService = {
  async getEarnings() {
    const { data } = await api.get('/seller/earnings');
    return data?.data || data;
  },

  async getPayouts() {
    const { data } = await api.get('/seller/payouts');
    return data?.data || data || [];
  },

  async requestPayout(payload) {
    const { data } = await api.post('/seller/payouts', payload);
    if (data?.success === false) {
      throw new Error(data?.message || 'Payout request failed');
    }
    return data;
  },
};

export default sellerMarketplaceService;
