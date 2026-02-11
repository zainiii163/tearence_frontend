import Api from "../api";

export default false
  ? {
      message: "You are Offline. Please! turn on the internet",
    }
  : {
      getAffiliateList: (position, skip, limit) => {
        return Api.get(`v1/affiliate?skip=${skip}&limit=${limit}`);
      },
      getAffiliateListTop: () => {
        return Api.get(`v1/affiliate?position=top`);
      },
      createAffiliate: (payload) => {
        return Api.post(`v1/affiliate`, payload);
      },
      updateAffiliate: (id, formData) => {
        return Api.put(`v1/affiliate/${id}`, formData);
      },
      deleteAffiliate: (id) => {
        return Api.delete(`v1/affiliate/${id}`);
      },
      getMyAffiliate: (skip, limit) => {
        return Api.get(`v1/affiliate/my-affiliate?skip=${skip}&limit=${limit}`);
      },
      // New referral and earnings tracking endpoints
      getReferralStats: (period) => {
        return Api.get(`v1/affiliate/referral-stats?period=${period}`);
      },
      getEarnings: (period, status) => {
        return Api.get(`v1/affiliate/earnings?period=${period}&status=${status}`);
      },
      getReferralLink: () => {
        return Api.get(`v1/affiliate/referral-link`);
      },
      trackClick: (referralCode, targetUrl) => {
        return Api.post(`v1/affiliate/track-click`, { referralCode, targetUrl });
      },
      trackConversion: (referralCode, amount, orderId) => {
        return Api.post(`v1/affiliate/track-conversion`, { referralCode, amount, orderId });
      },
      getTopPerformingLinks: (period) => {
        return Api.get(`v1/affiliate/top-links?period=${period}`);
      },
      getTierInfo: () => {
        return Api.get(`v1/affiliate/tier-info`);
      },
      submitAffiliateApplication: (applicationData) => {
        return Api.post(`v1/affiliate/apply`, applicationData);
      },
      getAffiliatePrograms: (category, skip, limit) => {
        return Api.get(`v1/affiliate/programs?category=${category}&skip=${skip}&limit=${limit}`);
      },
      joinAffiliateProgram: (programId) => {
        return Api.post(`v1/affiliate/join-program`, { programId });
      },
      getMyReferrals: (skip, limit) => {
        return Api.get(`v1/affiliate/my-referrals?skip=${skip}&limit=${limit}`);
      },
      exportEarningsReport: (period, format) => {
        return Api.get(`v1/affiliate/export-earnings?period=${period}&format=${format}`, {
          responseType: 'blob'
        });
      }
    };
