import api from "../api";

const analyticsService = {
  getRevenueAnalytics: async (params) => {
    const queryParams = new URLSearchParams();
    if (params?.start_date) queryParams.append("start_date", params.start_date);
    if (params?.end_date) queryParams.append("end_date", params.end_date);
    if (params?.group_by) queryParams.append("group_by", params.group_by);

    return await api.get(`/v1/analytics/revenue?${queryParams.toString()}`);
  },

  getJobAnalytics: async (params) => {
    const queryParams = new URLSearchParams();
    if (params?.start_date) queryParams.append("start_date", params.start_date);
    if (params?.end_date) queryParams.append("end_date", params.end_date);

    return await api.get(`/v1/analytics/jobs?${queryParams.toString()}`);
  },

  getCandidateAnalytics: async (params) => {
    const queryParams = new URLSearchParams();
    if (params?.start_date) queryParams.append("start_date", params.start_date);
    if (params?.end_date) queryParams.append("end_date", params.end_date);

    return await api.get(`/v1/analytics/candidates?${queryParams.toString()}`);
  },

  getUpsellAnalytics: async (params) => {
    const queryParams = new URLSearchParams();
    if (params?.start_date) queryParams.append("start_date", params.start_date);
    if (params?.end_date) queryParams.append("end_date", params.end_date);

    return await api.get(`/v1/analytics/upsells?${queryParams.toString()}`);
  },

  getOverviewAnalytics: async () => {
    return await api.get("/v1/analytics/overview");
  },

  /**
   * Get user post analytics
   * @param {Object} [params] - Query parameters
   * @param {string} [params.start_date] - Start date
   * @param {string} [params.end_date] - End date
   * @param {number} [params.listing_id] - Specific listing ID
   * @returns {Promise} User post analytics data
   */
  getUserPostAnalytics: async (params = {}) => {
    const queryParams = new URLSearchParams();
    if (params.start_date) queryParams.append("start_date", params.start_date);
    if (params.end_date) queryParams.append("end_date", params.end_date);
    if (params.listing_id) queryParams.append("listing_id", params.listing_id);
    
    const url = queryParams.toString()
      ? `/v1/analytics/user-posts?${queryParams.toString()}`
      : `/v1/analytics/user-posts`;
    
    return await api.get(url);
  },

  /**
   * Track analytics event
   * @param {Object} eventData - Event data
   * @param {number} eventData.listing_id - Listing ID
   * @param {string} eventData.event_type - Event type (view, click, favorite, share, contact, application)
   * @param {Object} [eventData.metadata] - Additional metadata
   * @returns {Promise} Tracking confirmation
   */
  trackEvent: async (eventData) => {
    return await api.post("/v1/analytics/track-event", eventData);
  },

  // Get user analytics
  getUserAnalytics: async (params = {}) => {
    const { period = '30d', metrics = [] } = params;
    const queryParams = new URLSearchParams({ period });
    if (metrics.length > 0) queryParams.append('metrics', metrics.join(','));
    
    return await api.get(`/v1/analytics/user?${queryParams.toString()}`);
  },

  // Get admin analytics
  getAdminAnalytics: async (params = {}) => {
    const { period = '30d', category } = params;
    const queryParams = new URLSearchParams({ period });
    if (category) queryParams.append('category', category);
    
    return await api.get(`/v1/analytics/admin?${queryParams.toString()}`);
  },

  // Get listing analytics
  getListingAnalytics: async (listingId, params = {}) => {
    const { period = '30d', metrics = [] } = params;
    const queryParams = new URLSearchParams({ period });
    if (metrics.length > 0) queryParams.append('metrics', metrics.join(','));
    
    return await api.get(`/v1/analytics/listing/${listingId}?${queryParams.toString()}`);
  },

  // Get business analytics
  getBusinessAnalytics: async (businessId, params = {}) => {
    const { period = '30d', metrics = [] } = params;
    const queryParams = new URLSearchParams({ period });
    if (metrics.length > 0) queryParams.append('metrics', metrics.join(','));
    
    return await api.get(`/v1/analytics/business/${businessId}?${queryParams.toString()}`);
  },

  // Get affiliate analytics
  getAffiliateAnalytics: async (params = {}) => {
    const { period = '30d', affiliate_id } = params;
    const queryParams = new URLSearchParams({ period });
    if (affiliate_id) queryParams.append('affiliate_id', affiliate_id);
    
    return await api.get(`/v1/analytics/affiliate?${queryParams.toString()}`);
  },

  // Get traffic analytics
  getTrafficAnalytics: async (params = {}) => {
    const { period = '30d', source, medium } = params;
    const queryParams = new URLSearchParams({ period });
    if (source) queryParams.append('source', source);
    if (medium) queryParams.append('medium', medium);
    
    return await api.get(`/v1/analytics/traffic?${queryParams.toString()}`);
  },

  // Get real-time analytics
  getRealTimeAnalytics: async () => {
    return await api.get('/v1/analytics/realtime');
  },

  // Export analytics data
  exportAnalytics: async (params = {}) => {
    const { 
      report_type, 
      period = '30d', 
      format = 'csv', 
      filters = {} 
    } = params;
    
    return await api.post('/v1/analytics/export', {
      report_type,
      period,
      format,
      filters
    }, {
      responseType: 'blob'
    });
  },

  // Get analytics dashboard summary
  getDashboardSummary: async (params = {}) => {
    const { period = '30d', user_type } = params;
    const queryParams = new URLSearchParams({ period });
    if (user_type) queryParams.append('user_type', user_type);
    
    return await api.get(`/v1/analytics/dashboard?${queryParams.toString()}`);
  },
};

export default analyticsService;


