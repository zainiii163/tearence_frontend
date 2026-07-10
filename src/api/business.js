import axios from 'axios';

const API_BASE_URL = process.env.REACT_APP_API_BASE_URL || process.env.REACT_APP_API_URL || 'https://api.worldwideadverts.info/api/v1';

// Get auth token from localStorage
const getAuthHeader = () => {
  const token = localStorage.getItem('token');
  return token ? { Authorization: `Bearer ${token}` } : {};
};

// Get all businesses
export const getAllBusinesses = async (params = {}) => {
  try {
    const response = await axios.get(`${API_BASE_URL}/business`, {
      params,
      headers: getAuthHeader()
    });
    return response.data;
  } catch (error) {
    console.error('Error fetching businesses:', error);
    throw error;
  }
};

// Get business by ID
export const getBusinessById = async (id) => {
  try {
    const response = await axios.get(`${API_BASE_URL}/business/${id}`, {
      headers: getAuthHeader()
    });
    return response.data;
  } catch (error) {
    console.error('Error fetching business:', error);
    throw error;
  }
};

// Get business by slug
export const getBusinessBySlug = async (slug) => {
  try {
    const response = await axios.get(`${API_BASE_URL}/business/${slug}`, {
      headers: getAuthHeader()
    });
    return response.data;
  } catch (error) {
    console.error('Error fetching business by slug:', error);
    throw error;
  }
};

// Get business by customer ID
export const getBusinessByCustomerId = async (customerId) => {
  try {
    const response = await axios.get(`${API_BASE_URL}/business/${customerId}/detail`, {
      headers: getAuthHeader()
    });
    return response.data;
  } catch (error) {
    console.error('Error fetching business by customer ID:', error);
    throw error;
  }
};

// Get current user's business
export const getMyBusiness = async () => {
  try {
    const response = await axios.get(`${API_BASE_URL}/business/my-business`, {
      headers: getAuthHeader()
    });
    return response.data;
  } catch (error) {
    console.error('Error fetching my business:', error);
    throw error;
  }
};

// Create new business
export const createBusiness = async (businessData) => {
  try {
    // businessData can be either FormData or JSON object
    const isFormData = businessData instanceof FormData;
    
    // Log the data being sent for debugging
    if (isFormData) {
      console.log('Creating business with FormData:');
      for (let [key, value] of businessData.entries()) {
        console.log(`${key}:`, value);
      }
    } else {
      console.log('Creating business with JSON:', businessData);
    }
    
    const response = await axios.post(`${API_BASE_URL}/business`, businessData, {
      headers: {
        ...getAuthHeader(),
        ...(isFormData ? {} : { 'Content-Type': 'application/json' })
      }
    });
    return response.data;
  } catch (error) {
    console.error('Error creating business:', error);
    console.error('Error response:', error.response?.data);
    throw error;
  }
};

// Update business
export const updateBusiness = async (id, businessData) => {
  try {
    // businessData can be either FormData or JSON object
    const isFormData = businessData instanceof FormData;
    const response = await axios.put(`${API_BASE_URL}/business/${id}`, businessData, {
      headers: {
        ...getAuthHeader(),
        ...(isFormData ? {} : { 'Content-Type': 'application/json' })
      }
    });
    return response.data;
  } catch (error) {
    console.error('Error updating business:', error);
    throw error;
  }
};

// Delete business
export const deleteBusiness = async (id) => {
  try {
    const response = await axios.delete(`${API_BASE_URL}/business/${id}`, {
      headers: getAuthHeader()
    });
    return response.data;
  } catch (error) {
    console.error('Error deleting business:', error);
    throw error;
  }
};

// Search businesses
export const searchBusinesses = async (searchParams) => {
  try {
    const response = await axios.get(`${API_BASE_URL}/business`, {
      params: searchParams,
      headers: getAuthHeader()
    });
    return response.data;
  } catch (error) {
    console.error('Error searching businesses:', error);
    throw error;
  }
};

// Get business categories
export const getBusinessCategories = async () => {
  try {
    const response = await axios.get(`${API_BASE_URL}/category?is_parent=yes`, {
      headers: getAuthHeader()
    });
    return response.data;
  } catch (error) {
    console.error('Error fetching business categories:', error);
    throw error;
  }
};
