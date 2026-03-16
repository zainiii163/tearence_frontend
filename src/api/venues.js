// Venues API Service
import axios from 'axios';

const API_BASE_URL = process.env.REACT_APP_API_URL || 'https://api.worldwideadverts.info/api/v1';

// Create axios instance with default config
const apiClient = axios.create({
  baseURL: API_BASE_URL,
  timeout: 30000,
  headers: {
    'Content-Type': 'application/json',
    'Accept': 'application/json',
  },
  // CORS configuration
  withCredentials: false, // Don't send credentials for cross-origin requests
  crossdomain: true, // Enable cross-domain requests
  mode: 'cors' // Explicitly set CORS mode
});

// Add auth token to requests
apiClient.interceptors.request.use((config) => {
  const token = localStorage.getItem('authToken');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

// Venues API endpoints
export const venuesAPI = {
  // Get all venues with filtering and pagination
  getAllVenues: async (params = {}) => {
    const response = await apiClient.get('/venues', { params });
    return response.data;
  },

  // Get featured venues
  getFeaturedVenues: async (params = {}) => {
    const response = await apiClient.get('/venues/featured', { params });
    return response.data;
  },

  // Get venue types
  getVenueTypes: async () => {
    const response = await apiClient.get('/venues/types');
    return response.data;
  },

  // Get venue amenities
  getVenueAmenities: async () => {
    const response = await apiClient.get('/venues/amenities');
    return response.data;
  },

  // Get single venue by slug
  getVenueBySlug: async (slug) => {
    const response = await apiClient.get(`/venues/${slug}`);
    return response.data;
  },

  // Get single venue by ID
  getVenueById: async (id) => {
    const response = await apiClient.get(`/venues/${id}`);
    return response.data;
  },

  // Create new venue
  createVenue: async (venueData) => {
    const response = await apiClient.post('/venues', venueData);
    return response.data;
  },

  // Create venue with images
  createVenueWithImages: async (venueData) => {
    const formData = new FormData();
    
    // Add all venue fields
    Object.keys(venueData).forEach(key => {
      if (key === 'images' && Array.isArray(venueData[key])) {
        venueData[key].forEach((image, index) => {
          formData.append(`images[${index}]`, image);
        });
      } else if (key === 'floor_plan' && venueData[key]) {
        formData.append('floor_plan', venueData[key]);
      } else if (venueData[key] !== null && venueData[key] !== undefined) {
        formData.append(key, venueData[key]);
      }
    });

    const response = await apiClient.post('/venues', formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    });
    return response.data;
  },
  uploadVenueImages: async (formData) => {
    const response = await apiClient.post('/venues/upload-images', formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    });
    return response.data;
  },

  // Upload floor plan
  uploadFloorPlan: async (formData) => {
    const response = await apiClient.post('/venues/upload-floor-plan', formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    });
    return response.data;
  },

  // Update venue
  updateVenue: async (id, venueData) => {
    const response = await apiClient.put(`/venues/${id}`, venueData);
    return response.data;
  },

  // Delete venue
  deleteVenue: async (id) => {
    const response = await apiClient.delete(`/venues/${id}`);
    return response.data;
  },

  // Get user's venues
  getMyVenues: async (params = {}) => {
    const response = await apiClient.get('/venues/my-venues', { params });
    return response.data;
  },

  // Search venues
  searchVenues: async (query, params = {}) => {
    const response = await apiClient.get('/venues', {
      params: { search: query, ...params },
    });
    return response.data;
  },

  // Get venues by type
  getVenuesByType: async (venueType, params = {}) => {
    const response = await apiClient.get('/venues', {
      params: { venue_type: venueType, ...params },
    });
    return response.data;
  },

  // Get venues by location
  getVenuesByLocation: async (city, country, params = {}) => {
    const response = await apiClient.get('/venues', {
      params: { city, country, ...params },
    });
    return response.data;
  },

  // Get venues by capacity
  getVenuesByCapacity: async (minCapacity, maxCapacity, params = {}) => {
    const response = await apiClient.get('/venues', {
      params: { min_capacity: minCapacity, max_capacity: maxCapacity, ...params },
    });
    return response.data;
  },

  // Get venues by price range
  getVenuesByPriceRange: async (minPrice, maxPrice, params = {}) => {
    const response = await apiClient.get('/venues', {
      params: { min_price: minPrice, max_price: maxPrice, ...params },
    });
    return response.data;
  },

  // Get venues by amenities
  getVenuesByAmenities: async (amenities, params = {}) => {
    const response = await apiClient.get('/venues', {
      params: { amenities, ...params },
    });
    return response.data;
  },

  // Check venue availability
  checkVenueAvailability: async (id, date, time) => {
    const response = await apiClient.get(`/venues/${id}/availability`, {
      params: { date, time },
    });
    return response.data;
  },

  // Promote venue
  promoteVenue: async (id, promotionData) => {
    const response = await apiClient.post(`/venues/${id}/promote`, promotionData);
    return response.data;
  },

  // Get venue statistics
  getVenueStats: async (id) => {
    const response = await apiClient.get(`/venues/${id}/stats`);
    return response.data;
  },

  // Save/unsave venue
  saveVenue: async (id) => {
    const response = await apiClient.post(`/venues/${id}/save`);
    return response.data;
  },

  unsaveVenue: async (id) => {
    const response = await apiClient.delete(`/venues/${id}/save`);
    return response.data;
  },

  // Get saved venues
  getSavedVenues: async (params = {}) => {
    const response = await apiClient.get('/venues/saved', { params });
    return response.data;
  },

  // Contact venue owner
  contactVenueOwner: async (id, messageData) => {
    const response = await apiClient.post(`/venues/${id}/contact`, messageData);
    return response.data;
  },

  // Report venue
  reportVenue: async (id, reportData) => {
    const response = await apiClient.post(`/venues/${id}/report`, reportData);
    return response.data;
  },

  // Share venue
  shareVenue: async (id, shareData) => {
    const response = await apiClient.post(`/venues/${id}/share`, shareData);
    return response.data;
  },

  // Get venue reviews
  getVenueReviews: async (id, params = {}) => {
    const response = await apiClient.get(`/venues/${id}/reviews`, { params });
    return response.data;
  },

  // Add venue review
  addVenueReview: async (id, reviewData) => {
    const response = await apiClient.post(`/venues/${id}/reviews`, reviewData);
    return response.data;
  },

  // Get venue booking calendar
  getVenueBookingCalendar: async (id, params = {}) => {
    const response = await apiClient.get(`/venues/${id}/calendar`, { params });
    return response.data;
  },
};

export default venuesAPI;
