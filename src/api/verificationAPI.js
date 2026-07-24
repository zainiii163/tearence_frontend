import api from '../api';

/**
 * Live verification API — /api/v1/verification/*
 */
const verificationAPI = {
  sendEmailOtp: async (email) => {
    const response = await api.post('/verification/email/send', { email });
    return response.data;
  },

  verifyEmailOtp: async (email, code) => {
    const response = await api.post('/verification/email/verify', { email, code });
    return response.data;
  },

  sendPhoneOtp: async (phone, country = '') => {
    const response = await api.post('/verification/phone/send', { phone, country });
    return response.data;
  },

  verifyPhoneOtp: async (phone, code) => {
    const response = await api.post('/verification/phone/verify', { phone, code });
    return response.data;
  },

  verifyCompany: async ({ companyNumber, vatNumber, country }) => {
    const response = await api.post('/verification/company/check', {
      company_registration_number: companyNumber,
      vat_number: vatNumber,
      country,
    });
    return response.data;
  },
};

export default verificationAPI;
