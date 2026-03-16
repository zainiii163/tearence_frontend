// Property API Service
// Handles all API calls for the Property System

const API_BASE_URL = process.env.REACT_APP_API_URL || '/api/v1';

class PropertyApiService {
  constructor() {
    this.baseURL = API_BASE_URL;
    this.token = localStorage.getItem('authToken') || null;
  }

  // Helper method to get headers
  getHeaders(includeAuth = false) {
    const headers = {
      'Content-Type': 'application/json',
    };

    if (includeAuth && this.token) {
      headers['Authorization'] = `Bearer ${this.token}`;
    }

    return headers;
  }

  // Helper method to handle API responses
  async handleResponse(response) {
    if (!response.ok) {
      const error = await response.json().catch(() => ({}));
      throw new Error(error.message || `HTTP error! status: ${response.status}`);
    }
    return response.json();
  }

  // Properties Endpoints

  // Get all properties with filters
  async getProperties(params = {}) {
    const queryString = new URLSearchParams(params).toString();
    const url = `${this.baseURL}/properties${queryString ? `?${queryString}` : ''}`;
    
    const response = await fetch(url, {
      method: 'GET',
      headers: this.getHeaders(),
    });

    return this.handleResponse(response);
  }

  // Get featured properties
  async getFeaturedProperties() {
    const response = await fetch(`${this.baseURL}/properties/featured`, {
      method: 'GET',
      headers: this.getHeaders(),
    });

    return this.handleResponse(response);
  }

  // Get promoted properties
  async getPromotedProperties() {
    const response = await fetch(`${this.baseURL}/properties/promoted`, {
      method: 'GET',
      headers: this.getHeaders(),
    });

    return this.handleResponse(response);
  }

  // Get sponsored properties
  async getSponsoredProperties() {
    const response = await fetch(`${this.baseURL}/properties/sponsored`, {
      method: 'GET',
      headers: this.getHeaders(),
    });

    return this.handleResponse(response);
  }

  // Get single property by ID
  async getProperty(id) {
    const response = await fetch(`${this.baseURL}/properties/${id}`, {
      method: 'GET',
      headers: this.getHeaders(),
    });

    return this.handleResponse(response);
  }

  // Create new property (authenticated)
  async createProperty(propertyData) {
    const formData = new FormData();
    
    // Append all property data
    Object.keys(propertyData).forEach(key => {
      if (key === 'additional_images' && Array.isArray(propertyData[key])) {
        propertyData[key].forEach(file => {
          formData.append('additional_images[]', file);
        });
      } else if (key === 'specifications' || key === 'amenities' || key === 'location_highlights' || key === 'transport_links') {
        formData.append(key, JSON.stringify(propertyData[key]));
      } else if (propertyData[key] !== null && propertyData[key] !== undefined) {
        formData.append(key, propertyData[key]);
      }
    });

    const response = await fetch(`${this.baseURL}/properties`, {
      method: 'POST',
      headers: this.getHeaders(true).filter(h => h.key !== 'Content-Type'), // Let browser set multipart boundary
      body: formData,
    });

    return this.handleResponse(response);
  }

  // Update property (authenticated)
  async updateProperty(id, propertyData) {
    const response = await fetch(`${this.baseURL}/properties/${id}`, {
      method: 'PUT',
      headers: this.getHeaders(true),
      body: JSON.stringify(propertyData),
    });

    return this.handleResponse(response);
  }

  // Delete property (authenticated)
  async deleteProperty(id) {
    const response = await fetch(`${this.baseURL}/properties/${id}`, {
      method: 'DELETE',
      headers: this.getHeaders(true),
    });

    return this.handleResponse(response);
  }

  // Get my properties (authenticated)
  async getMyProperties() {
    const response = await fetch(`${this.baseURL}/properties/my-properties`, {
      method: 'GET',
      headers: this.getHeaders(true),
    });

    return this.handleResponse(response);
  }

  // Save/unsave property (authenticated)
  async toggleSaveProperty(id) {
    const response = await fetch(`${this.baseURL}/properties/${id}/save`, {
      method: 'POST',
      headers: this.getHeaders(true),
    });

    return this.handleResponse(response);
  }

  // Get saved properties (authenticated)
  async getSavedProperties() {
    const response = await fetch(`${this.baseURL}/properties/saved-properties`, {
      method: 'GET',
      headers: this.getHeaders(true),
    });

    return this.handleResponse(response);
  }

  // Contact agent
  async contactAgent(propertyId, contactData) {
    const response = await fetch(`${this.baseURL}/properties/${propertyId}/contact-agent`, {
      method: 'POST',
      headers: this.getHeaders(),
      body: JSON.stringify(contactData),
    });

    return this.handleResponse(response);
  }

  // Track property event
  async trackPropertyEvent(propertyId, eventType, metadata = {}) {
    const response = await fetch(`${this.baseURL}/properties/${propertyId}/track-event`, {
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
    const response = await fetch(`${this.baseURL}/properties/data/categories`, {
      method: 'GET',
      headers: this.getHeaders(),
    });

    return this.handleResponse(response);
  }

  // Get property types
  async getPropertyTypes() {
    const response = await fetch(`${this.baseURL}/properties/data/property-types`, {
      method: 'GET',
      headers: this.getHeaders(),
    });

    return this.handleResponse(response);
  }

  // Get commercial types
  async getCommercialTypes() {
    const response = await fetch(`${this.baseURL}/properties/data/commercial-types`, {
      method: 'GET',
      headers: this.getHeaders(),
    });

    return this.handleResponse(response);
  }

  // Get land types
  async getLandTypes() {
    const response = await fetch(`${this.baseURL}/properties/data/land-types`, {
      method: 'GET',
      headers: this.getHeaders(),
    });

    return this.handleResponse(response);
  }

  // Get planning permissions
  async getPlanningPermissions() {
    const response = await fetch(`${this.baseURL}/properties/data/planning-permissions`, {
      method: 'GET',
      headers: this.getHeaders(),
    });

    return this.handleResponse(response);
  }

  // Get view types
  async getViewTypes() {
    const response = await fetch(`${this.baseURL}/properties/data/view-types`, {
      method: 'GET',
      headers: this.getHeaders(),
    });

    return this.handleResponse(response);
  }

  // Authentication methods
  setToken(token) {
    this.token = token;
    localStorage.setItem('authToken', token);
  }

  clearToken() {
    this.token = null;
    localStorage.removeItem('authToken');
  }

  // Utility method to build search parameters
  buildSearchParams(filters) {
    const params = {};
    
    if (filters.search) params.search = filters.search;
    if (filters.propertyTypes && filters.propertyTypes.length > 0) {
      params.property_types = filters.propertyTypes.join(',');
    }
    if (filters.category) params.category = filters.category;
    if (filters.minPrice) params.min_price = filters.minPrice;
    if (filters.maxPrice) params.max_price = filters.maxPrice;
    if (filters.location) params.location = filters.location;
    if (filters.bedrooms) params.bedrooms = filters.bedrooms;
    if (filters.bathrooms) params.bathrooms = filters.bathrooms;
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
