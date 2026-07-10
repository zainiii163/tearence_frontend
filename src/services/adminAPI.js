import api from './api';

// Base URL for admin endpoints
const ADMIN_BASE = '/admin';

// Admin Dashboard API
export const getAdminDashboard = async () => {
  try {
    const response = await api.get(`${ADMIN_BASE}/dashboard`);
    return response.data;
  } catch (error) {
    console.error('Error fetching admin dashboard:', error);
    throw error;
  }
};

// Featured Adverts Admin API
export const getFeaturedAdverts = async (params = {}) => {
  try {
    const response = await api.get(`${ADMIN_BASE}/featured-adverts`, { params });
    return response.data;
  } catch (error) {
    console.error('Error fetching featured adverts:', error);
    throw error;
  }
};

export const createFeaturedAdvert = async (data) => {
  try {
    const response = await api.post(`${ADMIN_BASE}/featured-adverts`, data);
    return response.data;
  } catch (error) {
    console.error('Error creating featured advert:', error);
    throw error;
  }
};

export const updateFeaturedAdvert = async (id, data) => {
  try {
    const response = await api.put(`${ADMIN_BASE}/featured-adverts/${id}`, data);
    return response.data;
  } catch (error) {
    console.error('Error updating featured advert:', error);
    throw error;
  }
};

export const deleteFeaturedAdvert = async (id) => {
  try {
    const response = await api.delete(`${ADMIN_BASE}/featured-adverts/${id}`);
    return response.data;
  } catch (error) {
    console.error('Error deleting featured advert:', error);
    throw error;
  }
};

export const approveFeaturedAdvert = async (id) => {
  try {
    const response = await api.post(`${ADMIN_BASE}/featured-adverts/${id}/approve`);
    return response.data;
  } catch (error) {
    console.error('Error approving featured advert:', error);
    throw error;
  }
};

export const rejectFeaturedAdvert = async (id, reason) => {
  try {
    const response = await api.post(`${ADMIN_BASE}/featured-adverts/${id}/reject`, { reason });
    return response.data;
  } catch (error) {
    console.error('Error rejecting featured advert:', error);
    throw error;
  }
};

export const getFeaturedAdvertStatistics = async () => {
  try {
    const response = await api.get(`${ADMIN_BASE}/featured-adverts/statistics`);
    return response.data;
  } catch (error) {
    console.error('Error fetching featured advert statistics:', error);
    throw error;
  }
};

// Promoted Adverts Admin API
export const getPromotedAdvertsDashboard = async () => {
  try {
    const response = await api.get(`${ADMIN_BASE}/promoted-adverts/dashboard`);
    return response.data;
  } catch (error) {
    console.error('Error fetching promoted adverts dashboard:', error);
    throw error;
  }
};

export const getPromotedAdvertAnalytics = async (advertId) => {
  try {
    const response = await api.get(`${ADMIN_BASE}/promoted-adverts/${advertId}/analytics`);
    return response.data;
  } catch (error) {
    console.error('Error fetching promoted advert analytics:', error);
    throw error;
  }
};

export const bulkApprovePromotedAdverts = async (advertIds) => {
  try {
    const response = await api.post(`${ADMIN_BASE}/promoted-adverts/bulk-approve`, { advert_ids: advertIds });
    return response.data;
  } catch (error) {
    console.error('Error bulk approving promoted adverts:', error);
    throw error;
  }
};

export const bulkRejectPromotedAdverts = async (advertIds) => {
  try {
    const response = await api.post(`${ADMIN_BASE}/promoted-adverts/bulk-reject`, { advert_ids: advertIds });
    return response.data;
  } catch (error) {
    console.error('Error bulk rejecting promoted adverts:', error);
    throw error;
  }
};

// Sponsored Adverts Admin API
export const getSponsoredAdvertsDashboardStats = async () => {
  try {
    const response = await api.get(`${ADMIN_BASE}/sponsored-adverts/dashboard-stats`);
    return response.data;
  } catch (error) {
    console.error('Error fetching sponsored adverts dashboard stats:', error);
    throw error;
  }
};

export const approveSponsoredAdvert = async (id) => {
  try {
    const response = await api.post(`${ADMIN_BASE}/sponsored-adverts/${id}/approve`);
    return response.data;
  } catch (error) {
    console.error('Error approving sponsored advert:', error);
    throw error;
  }
};

export const rejectSponsoredAdvert = async (id) => {
  try {
    const response = await api.post(`${ADMIN_BASE}/sponsored-adverts/${id}/reject`);
    return response.data;
  } catch (error) {
    console.error('Error rejecting sponsored advert:', error);
    throw error;
  }
};

export const toggleSponsoredAdvertActive = async (id) => {
  try {
    const response = await api.post(`${ADMIN_BASE}/sponsored-adverts/${id}/toggle-active`);
    return response.data;
  } catch (error) {
    console.error('Error toggling sponsored advert active status:', error);
    throw error;
  }
};

export const updateSponsoredAdvertTier = async (id, tier) => {
  try {
    const response = await api.post(`${ADMIN_BASE}/sponsored-adverts/${id}/update-tier`, { tier });
    return response.data;
  } catch (error) {
    console.error('Error updating sponsored advert tier:', error);
    throw error;
  }
};

// Properties Admin API
export const getPropertiesDashboard = async () => {
  try {
    const response = await api.get(`${ADMIN_BASE}/properties/dashboard`);
    return response.data;
  } catch (error) {
    console.error('Error fetching properties dashboard:', error);
    throw error;
  }
};

export const getPropertiesAnalytics = async () => {
  try {
    const response = await api.get(`${ADMIN_BASE}/properties/analytics`);
    return response.data;
  } catch (error) {
    console.error('Error fetching properties analytics:', error);
    throw error;
  }
};

export const approveProperty = async (id) => {
  try {
    const response = await api.post(`${ADMIN_BASE}/properties/${id}/approve`);
    return response.data;
  } catch (error) {
    console.error('Error approving property:', error);
    throw error;
  }
};

export const rejectProperty = async (id, reason) => {
  try {
    const response = await api.post(`${ADMIN_BASE}/properties/${id}/reject`, { reason });
    return response.data;
  } catch (error) {
    console.error('Error rejecting property:', error);
    throw error;
  }
};

export const togglePropertyActive = async (id) => {
  try {
    const response = await api.post(`${ADMIN_BASE}/properties/${id}/toggle-active`);
    return response.data;
  } catch (error) {
    console.error('Error toggling property active status:', error);
    throw error;
  }
};

export const bulkApproveProperties = async (propertyIds) => {
  try {
    const response = await api.post(`${ADMIN_BASE}/properties/bulk-approve`, { property_ids: propertyIds });
    return response.data;
  } catch (error) {
    console.error('Error bulk approving properties:', error);
    throw error;
  }
};

export const bulkRejectProperties = async (propertyIds) => {
  try {
    const response = await api.post(`${ADMIN_BASE}/properties/bulk-reject`, { property_ids: propertyIds });
    return response.data;
  } catch (error) {
    console.error('Error bulk rejecting properties:', error);
    throw error;
  }
};

// Events Admin API
export const getEventsDashboard = async () => {
  try {
    const response = await api.get(`${ADMIN_BASE}/events/dashboard`);
    return response.data;
  } catch (error) {
    console.error('Error fetching events dashboard:', error);
    throw error;
  }
};

export const getEventsAnalytics = async () => {
  try {
    const response = await api.get(`${ADMIN_BASE}/events/analytics`);
    return response.data;
  } catch (error) {
    console.error('Error fetching events analytics:', error);
    throw error;
  }
};

export const approveEvent = async (id) => {
  try {
    const response = await api.post(`${ADMIN_BASE}/events/${id}/approve`);
    return response.data;
  } catch (error) {
    console.error('Error approving event:', error);
    throw error;
  }
};

export const rejectEvent = async (id, reason) => {
  try {
    const response = await api.post(`${ADMIN_BASE}/events/${id}/reject`, { reason });
    return response.data;
  } catch (error) {
    console.error('Error rejecting event:', error);
    throw error;
  }
};

export const toggleEventActive = async (id) => {
  try {
    const response = await api.post(`${ADMIN_BASE}/events/${id}/toggle-active`);
    return response.data;
  } catch (error) {
    console.error('Error toggling event active status:', error);
    throw error;
  }
};

export const setEventFeatured = async (id) => {
  try {
    const response = await api.post(`${ADMIN_BASE}/events/${id}/set-featured`);
    return response.data;
  } catch (error) {
    console.error('Error setting event as featured:', error);
    throw error;
  }
};

export const setEventSponsored = async (id) => {
  try {
    const response = await api.post(`${ADMIN_BASE}/events/${id}/set-sponsored`);
    return response.data;
  } catch (error) {
    console.error('Error setting event as sponsored:', error);
    throw error;
  }
};

// Venues Admin API
export const getVenues = async (params = {}) => {
  try {
    const response = await api.get(`${ADMIN_BASE}/events/venues`, { params });
    return response.data;
  } catch (error) {
    console.error('Error fetching venues:', error);
    throw error;
  }
};

export const approveVenue = async (id) => {
  try {
    const response = await api.post(`${ADMIN_BASE}/events/venues/${id}/approve`);
    return response.data;
  } catch (error) {
    console.error('Error approving venue:', error);
    throw error;
  }
};

export const rejectVenue = async (id, reason) => {
  try {
    const response = await api.post(`${ADMIN_BASE}/events/venues/${id}/reject`, { reason });
    return response.data;
  } catch (error) {
    console.error('Error rejecting venue:', error);
    throw error;
  }
};

// System Health API
export const getSystemHealth = async () => {
  try {
    const response = await api.get(`${ADMIN_BASE}/sponsored-adverts/system-health`);
    return response.data;
  } catch (error) {
    console.error('Error fetching system health:', error);
    throw error;
  }
};

// Export Reports API
export const exportFeaturedAdverts = async (params = {}) => {
  try {
    const response = await api.get(`${ADMIN_BASE}/featured-adverts/export`, { 
      params,
      responseType: 'blob'
    });
    return response.data;
  } catch (error) {
    console.error('Error exporting featured adverts:', error);
    throw error;
  }
};

export const exportPromotedAdverts = async (params = {}) => {
  try {
    const response = await api.get(`${ADMIN_BASE}/promoted-adverts/export`, { 
      params,
      responseType: 'blob'
    });
    return response.data;
  } catch (error) {
    console.error('Error exporting promoted adverts:', error);
    throw error;
  }
};

export const exportSponsoredAdverts = async (params = {}) => {
  try {
    const response = await api.get(`${ADMIN_BASE}/sponsored-adverts/export`, { 
      params,
      responseType: 'blob'
    });
    return response.data;
  } catch (error) {
    console.error('Error exporting sponsored adverts:', error);
    throw error;
  }
};

export const exportProperties = async (params = {}) => {
  try {
    const response = await api.get(`${ADMIN_BASE}/properties/export`, { 
      params,
      responseType: 'blob'
    });
    return response.data;
  } catch (error) {
    console.error('Error exporting properties:', error);
    throw error;
  }
};

export const exportEvents = async (params = {}) => {
  try {
    const response = await api.get(`${ADMIN_BASE}/events/export`, { 
      params,
      responseType: 'blob'
    });
    return response.data;
  } catch (error) {
    console.error('Error exporting events:', error);
    throw error;
  }
};

// Utility function to handle file downloads
export const downloadFile = (blob, filename) => {
  const url = window.URL.createObjectURL(blob);
  const link = document.createElement('a');
  link.href = url;
  link.download = filename;
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  window.URL.revokeObjectURL(url);
};

// Error handling wrapper
export const handleAdminApiError = (error) => {
  if (error.response?.status === 401) {
    localStorage.removeItem('token');
    localStorage.removeItem('refresh_token');
    localStorage.removeItem('customer_id');
    localStorage.removeItem('userDetail');
    window.location.href = '/Login';
    throw new Error('Authentication expired. Please log in again.');
  }
  
  if (error.response?.status === 403) {
    throw new Error('Access denied. Admin privileges required.');
  }
  
  if (error.response?.status === 422) {
    const validationErrors = error.response.data?.errors;
    if (validationErrors) {
      const firstError = Object.values(validationErrors)[0][0];
      throw new Error(firstError);
    }
  }
  
  throw error;
};
