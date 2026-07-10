import api from './api';

// For local development, we'll use the local backend
const getApiInstance = () => {
  if (process.env.NODE_ENV === 'development') {
    // Create local instance for development
    const localApi = require('axios').default.create({
      baseURL: process.env.REACT_APP_API_BASE_URL || 'https://api.worldwideadverts.info/api',
      headers: {
        'Content-Type': 'application/json',
        'Accept': 'application/json',
      },
      withCredentials: false,
    });
    
    // Add token if available
    const token = localStorage.getItem('token');
    if (token) {
      localApi.defaults.headers.Authorization = `Bearer ${token}`;
    }
    
    return localApi;
  }
  return api;
};

class EventsApi {
  constructor() {
    this.baseEndpoint = '/events';
  }

  // Get all events with filters and pagination
  async getEvents(params = {}) {
    try {
      const apiInstance = getApiInstance();
      const response = await apiInstance.get(this.baseEndpoint, { params });
      return response.data;
    } catch (error) {
      console.error('Failed to fetch events:', error);
      throw error;
    }
  }

  // Get featured events
  async getFeaturedEvents() {
    try {
      const apiInstance = getApiInstance();
      const response = await apiInstance.get(`${this.baseEndpoint}/featured`);
      return response.data;
    } catch (error) {
      console.error('Failed to fetch featured events:', error);
      throw error;
    }
  }

  // Get event categories
  async getEventCategories() {
    try {
      const apiInstance = getApiInstance();
      const response = await apiInstance.get(`${this.baseEndpoint}/categories`);
      return response.data;
    } catch (error) {
      console.error('Failed to fetch event categories:', error);
      throw error;
    }
  }

  // Get single event by slug
  async getEventBySlug(slug) {
    try {
      const apiInstance = getApiInstance();
      const response = await apiInstance.get(`${this.baseEndpoint}/${slug}`);
      return response.data;
    } catch (error) {
      console.error('Failed to fetch event:', error);
      throw error;
    }
  }

  // Create new event (requires authentication)
  async createEvent(eventData) {
    try {
      const apiInstance = getApiInstance();
      const response = await apiInstance.post(this.baseEndpoint, eventData);
      return response.data;
    } catch (error) {
      console.error('Failed to create event:', error);
      throw error;
    }
  }

  // Update event (requires authentication)
  async updateEvent(id, eventData) {
    try {
      const apiInstance = getApiInstance();
      const response = await apiInstance.put(`${this.baseEndpoint}/${id}`, eventData);
      return response.data;
    } catch (error) {
      console.error('Failed to update event:', error);
      throw error;
    }
  }

  // Delete event (requires authentication)
  async deleteEvent(id) {
    try {
      const apiInstance = getApiInstance();
      const response = await apiInstance.delete(`${this.baseEndpoint}/${id}`);
      return response.data;
    } catch (error) {
      console.error('Failed to delete event:', error);
      throw error;
    }
  }

  // Get current user's events (requires authentication)
  async getMyEvents(params = {}) {
    try {
      const apiInstance = getApiInstance();
      const response = await apiInstance.get(`${this.baseEndpoint}/my-events`, { params });
      return response.data;
    } catch (error) {
      console.error('Failed to fetch my events:', error);
      throw error;
    }
  }

  // Upload event images (requires authentication)
  async uploadEventImages(images) {
    try {
      const apiInstance = getApiInstance();
      const formData = new FormData();
      images.forEach((image, index) => {
        formData.append(`images[${index}]`, image);
      });

      const response = await apiInstance.post(`${this.baseEndpoint}/upload-images`, formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });
      return response.data;
    } catch (error) {
      console.error('Failed to upload event images:', error);
      throw error;
    }
  }

  // Helper method to format event data for submission
  formatEventData(formData) {
    const formattedData = {
      title: formData.title,
      category: formData.category,
      date_time: formData.date_time,
      country: formData.country,
      city: formData.city,
      venue_name: formData.venue_name || null,
      ticket_price: formData.price_type === 'paid' ? parseFloat(formData.ticket_price) : null,
      price_type: formData.price_type,
      description: formData.description,
      schedule: formData.schedule || null,
      age_restrictions: formData.age_restrictions || null,
      dress_code: formData.dress_code || null,
      expected_attendance: formData.expected_attendance ? parseInt(formData.expected_attendance) : null,
      ticket_link: formData.ticket_link || null,
      contact_email: formData.contact_email,
      social_links: formData.social_links ? JSON.parse(formData.social_links) : null,
      images: formData.images || null,
      video_link: formData.video_link || null,
      promotion_tier: formData.promotion_tier || 'standard',
      venue_id: formData.venue_id || null,
      venue_services: formData.venue_services || null,
    };

    // Remove null values
    Object.keys(formattedData).forEach(key => {
      if (formattedData[key] === null || formattedData[key] === '') {
        delete formattedData[key];
      }
    });

    return formattedData;
  }

  // Helper method to validate event data
  validateEventData(formData) {
    const errors = {};

    if (!formData.title || formData.title.trim().length === 0) {
      errors.title = 'Title is required';
    }

    if (!formData.category) {
      errors.category = 'Category is required';
    }

    if (!formData.date_time) {
      errors.date_time = 'Date and time is required';
    } else if (new Date(formData.date_time) <= new Date()) {
      errors.date_time = 'Event date must be in the future';
    }

    if (!formData.country || formData.country.trim().length === 0) {
      errors.country = 'Country is required';
    }

    if (!formData.city || formData.city.trim().length === 0) {
      errors.city = 'City is required';
    }

    if (!formData.price_type) {
      errors.price_type = 'Price type is required';
    } else if (formData.price_type === 'paid' && (!formData.ticket_price || parseFloat(formData.ticket_price) < 0)) {
      errors.ticket_price = 'Valid ticket price is required for paid events';
    }

    if (!formData.description || formData.description.trim().length === 0) {
      errors.description = 'Description is required';
    }

    if (!formData.contact_email) {
      errors.contact_email = 'Contact email is required';
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.contact_email)) {
      errors.contact_email = 'Valid email address is required';
    }

    return {
      isValid: Object.keys(errors).length === 0,
      errors
    };
  }
}

export default new EventsApi();
