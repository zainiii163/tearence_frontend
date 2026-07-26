// Property API Service
// Handles all API calls for the Property System

const API_BASE_URL = process.env.REACT_APP_API_BASE_URL?.replace(/\/v1$/, '') || 'https://api.worldwideadverts.info/api';

class PropertyApiService {
  constructor() {
    this.baseURL = API_BASE_URL;
    this.token = localStorage.getItem('token') || null;
  }

  // Helper method to get headers
  getHeaders(includeAuth = false) {
    const headers = {
      'Content-Type': 'application/json',
    };

    if (includeAuth) {
      const token = localStorage.getItem('token');
      if (token) {
        headers['Authorization'] = `Bearer ${token}`;
      }
    }

    return headers;
  }

  // Helper method to handle API responses
  async handleResponse(response) {
    if (!response.ok) {
      let errorData = {};
      try {
        errorData = await response.json();
        console.error('API Error Response:', errorData);
      } catch (e) {
        // If JSON parsing fails, try to get text
        try {
          const text = await response.text();
          errorData = { message: text || `HTTP error! status: ${response.status}` };
        } catch (_) {
          errorData = { message: `HTTP error! status: ${response.status}` };
        }
      }
      throw new Error(errorData.message || errorData.error || `HTTP error! status: ${response.status}`);
    }
    return response.json();
  }

  // Properties Endpoints

  // Get all properties with filters
  async getProperties(params = {}) {
    try {
      const queryString = new URLSearchParams(params).toString();
      const url = `${this.baseURL}/v1/properties${queryString ? `?${queryString}` : ''}`;

      const response = await fetch(url, {
        method: 'GET',
        headers: this.getHeaders(),
      });

      const result = await this.handleResponse(response);

      // Handle Laravel pagination format
      if (result.data && Array.isArray(result.data)) {
        return {
          data: result.data,
          meta: {
            current_page: result.current_page || 1,
            last_page: result.last_page || 1,
            per_page: result.per_page || 12,
            total: result.total || result.data.length
          }
        };
      }

      return { data: result.data || [], meta: {} };
    } catch (error) {
      console.error('Failed to fetch properties from API:', error);
      throw error;
    }
  }

  // Get featured properties (optional country / local IP targeting)
  async getFeaturedProperties(params = {}) {
    const query = new URLSearchParams();
    if (params.country) query.set('country', params.country);
    if (params.local) query.set('local', '1');
    if (params.per_page) query.set('per_page', String(params.per_page));
    const qs = query.toString();
    const response = await fetch(
      `${this.baseURL}/v1/properties/featured${qs ? `?${qs}` : ''}`,
      {
        method: 'GET',
        headers: this.getHeaders(),
      }
    );

    return this.handleResponse(response);
  }

  // Resolve visitor country from IP (backend Location / GeoIP)
  async getGeoLocation() {
    const response = await fetch(`${this.baseURL}/v1/properties/geo`, {
      method: 'GET',
      headers: this.getHeaders(),
    });
    return this.handleResponse(response);
  }

  // Get promoted properties
  async getPromotedProperties() {
    const response = await fetch(`${this.baseURL}/v1/properties/promoted`, {
      method: 'GET',
      headers: this.getHeaders(),
    });

    return this.handleResponse(response);
  }

  // Get sponsored properties
  async getSponsoredProperties() {
    const response = await fetch(`${this.baseURL}/v1/properties/sponsored`, {
      method: 'GET',
      headers: this.getHeaders(),
    });

    return this.handleResponse(response);
  }

  // Get single property by ID
  async getProperty(id) {
    const response = await fetch(`${this.baseURL}/v1/properties/${id}`, {
      method: 'GET',
      headers: this.getHeaders(),
    });

    return this.handleResponse(response);
  }

  // Create new property (authenticated)
  async createProperty(propertyData) {
    // propertyData is already FormData, pass it directly
    const formData = propertyData;

    // Get fresh token from localStorage
    const token = localStorage.getItem('token');
    if (!token) {
      throw new Error('Authentication required. Please log in first.');
    }

    const response = await fetch(`${this.baseURL}/v1/properties`, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${token}`,
        // Don't set Content-Type - browser sets it with multipart boundary
      },
      body: formData,
    });

    return this.handleResponse(response);
  }

  // Update property (authenticated) — multipart for full form edits
  async updatePropertyForm(id, formData) {
    const token = localStorage.getItem('token');
    if (!token) {
      throw new Error('Authentication required. Please log in first.');
    }

    if (!(formData instanceof FormData)) {
      return this.updateProperty(id, formData);
    }

    formData.append('_method', 'PUT');
    const response = await fetch(`${this.baseURL}/v1/properties/${id}`, {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${token}`,
      },
      body: formData,
    });

    return this.handleResponse(response);
  }

  // Update property (authenticated)
  async updateProperty(id, propertyData) {
    const response = await fetch(`${this.baseURL}/v1/properties/${id}`, {
      method: 'PUT',
      headers: this.getHeaders(true),
      body: JSON.stringify(propertyData),
    });

    return this.handleResponse(response);
  }

  // Delete property (authenticated)
  async deleteProperty(id) {
    const response = await fetch(`${this.baseURL}/v1/properties/${id}`, {
      method: 'DELETE',
      headers: this.getHeaders(true),
    });

    return this.handleResponse(response);
  }

  // Get my properties (authenticated)
  async getMyProperties() {
    const response = await fetch(`${this.baseURL}/v1/properties/my-properties`, {
      method: 'GET',
      headers: this.getHeaders(true),
    });

    return this.handleResponse(response);
  }

  // Save/unsave property (authenticated)
  async toggleSaveProperty(id) {
    const response = await fetch(`${this.baseURL}/v1/properties/${id}/save`, {
      method: 'POST',
      headers: this.getHeaders(true),
    });

    return this.handleResponse(response);
  }

  // Get saved properties (authenticated)
  async getSavedProperties() {
    const response = await fetch(`${this.baseURL}/v1/properties/saved-properties`, {
      method: 'GET',
      headers: this.getHeaders(true),
    });

    return this.handleResponse(response);
  }

  // Contact agent - get contact information
  async contactAgent(propertyId) {
    const response = await fetch(`${this.baseURL}/v1/properties/${propertyId}/contact-agent`, {
      method: 'POST',
      headers: this.getHeaders(),
    });

    return this.handleResponse(response);
  }

  // Track property event
  async trackPropertyEvent(propertyId, eventType, metadata = {}) {
    const response = await fetch(`${this.baseURL}/v1/properties/${propertyId}/track-event`, {
      method: 'POST',
      headers: this.getHeaders(),
      body: JSON.stringify({
        event_type: eventType,
        metadata,
      }),
    });

    return this.handleResponse(response);
  }

  // Property Data Endpoints

  // Get property categories
  async getCategories() {
    const response = await fetch(`${this.baseURL}/v1/properties/data/categories`, {
      method: 'GET',
      headers: this.getHeaders(),
    });

    return this.handleResponse(response);
  }

  // Get property types
  async getPropertyTypes() {
    const response = await fetch(`${this.baseURL}/v1/properties/data/property-types`, {
      method: 'GET',
      headers: this.getHeaders(),
    });

    return this.handleResponse(response);
  }

  // Get commercial types
  async getCommercialTypes() {
    const response = await fetch(`${this.baseURL}/v1/properties/data/commercial-types`, {
      method: 'GET',
      headers: this.getHeaders(),
    });

    return this.handleResponse(response);
  }

  // Get land types
  async getLandTypes() {
    const response = await fetch(`${this.baseURL}/v1/properties/data/land-types`, {
      method: 'GET',
      headers: this.getHeaders(),
    });

    return this.handleResponse(response);
  }

  // Get planning permissions
  async getPlanningPermissions() {
    const response = await fetch(`${this.baseURL}/v1/properties/data/planning-permissions`, {
      method: 'GET',
      headers: this.getHeaders(),
    });

    return this.handleResponse(response);
  }

  // Get view types
  async getViewTypes() {
    const response = await fetch(`${this.baseURL}/v1/properties/data/view-types`, {
      method: 'GET',
      headers: this.getHeaders(),
    });

    return this.handleResponse(response);
  }

  // Aliases used by hooks
  async saveProperty(id) { return this.toggleSaveProperty(id); }
  async trackEvent(propertyId, payload = {}) {
    return this.trackPropertyEvent(propertyId, payload.event_type || 'view', payload);
  }

  // Authentication methods
  setToken(token) {
    this.token = token;
    localStorage.setItem('token', token);
  }

  clearToken() {
    this.token = null;
    localStorage.removeItem('token');
  }

  // Utility method to build search parameters
  buildSearchParams(filters) {
    const params = {};
    
    if (filters.search) params.search = filters.search;
    if (filters.propertyTypes && filters.propertyTypes.length > 0) {
      params.property_type = filters.propertyTypes.join(',');
    }
    if (filters.category) params.category = filters.category;
    if (filters.minPrice) params.min_price = filters.minPrice;
    if (filters.maxPrice) params.max_price = filters.maxPrice;
    if (filters.country) params.country = filters.country;
    if (filters.continent) params.continent = filters.continent;
    if (filters.location) params.location = filters.location;
    if (filters.city) params.city = filters.city;
    if (filters.bedrooms) params.min_bedrooms = filters.bedrooms;
    if (filters.bathrooms) params.min_bathrooms = filters.bathrooms;
    if (filters.features && filters.features.length > 0) {
      params.features = filters.features.join(',');
    }
    if (filters.sort) params.sort = filters.sort;
    if (filters.page) params.page = filters.page;
    if (filters.perPage) params.per_page = filters.perPage;

    return params;
  }
}

// Create singleton instance
const propertyApi = new PropertyApiService();

export default propertyApi;
