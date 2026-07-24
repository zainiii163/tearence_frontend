import api from '../api';

export const twoFactorAPI = {
  status: async () => {
    const res = await api.get('/auth/2fa/status');
    return res.data;
  },
  setup: async () => {
    const res = await api.post('/auth/2fa/setup');
    return res.data;
  },
  confirm: async (code) => {
    const res = await api.post('/auth/2fa/confirm', { code });
    return res.data;
  },
  disable: async ({ password, code }) => {
    const res = await api.post('/auth/2fa/disable', { password, code });
    return res.data;
  },
  verifyLogin: async ({ pending_token, code }) => {
    const res = await api.post('/auth/2fa/verify-login', { pending_token, code });
    return res.data;
  },
};

export const dashboardInsightsAPI = {
  get: async () => {
    const res = await api.get('/dashboard/insights');
    return res.data;
  },
};

export default twoFactorAPI;
