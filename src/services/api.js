import axios from "axios";
import requestQueue from "./requestQueue";

// Base configuration
const baseURL = process.env.REACT_APP_API_URL || "https://api.worldwideadverts.info/api/v1";

// Create axios instance
const apiInstance = axios.create({
  baseURL,
  headers: {
    "Content-Type": "application/json",
    "Accept": "application/json",
  },
  // CORS configuration
  withCredentials: false, // Don't send credentials for cross-origin requests
  crossdomain: true, // Enable cross-domain requests
  mode: 'cors' // Explicitly set CORS mode
});

// Request interceptor to add Bearer token
apiInstance.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('jwt_token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    
    // Log requests in development
    if (process.env.NODE_ENV === 'development') {
      console.log(`🚀 API Request: ${config.method?.toUpperCase()} ${config.url}`, {
        headers: config.headers,
        data: config.data,
        params: config.params
      });
    }
    
    return config;
  },
  (error) => {
    console.error('❌ Request Error:', error);
    return Promise.reject(error);
  }
);

// Response interceptor to handle 401 errors and other responses
apiInstance.interceptors.response.use(
  (response) => {
    // Log successful responses in development
    if (process.env.NODE_ENV === 'development') {
      console.log(`✅ API Response: ${response.config.method?.toUpperCase()} ${response.config.url}`, {
        status: response.status,
        data: response.data
      });
    }
    return response;
  },
  async (error) => {
    // Handle 401 Unauthorized errors
    if (error.response?.status === 401) {
      console.log('🔒 401 Unauthorized - Redirecting to login');
      localStorage.removeItem('jwt_token');
      localStorage.removeItem('refresh_token');
      
      // Only redirect if not already on login page
      if (!window.location.pathname.includes('/login') && !window.location.pathname.includes('/Login')) {
        window.location.href = '/Login';
      }
    }
    
    // Handle network/CORS errors - queue the request for retry
    if (!error.response) {
      console.error('🌐 Network/CORS Error:', error.message);
      
      // Check if it's a CORS error
      if (error.message.includes('CORS') || error.message.includes('Network Error')) {
        console.error('🔥 CORS Issue Detected:', {
          message: 'CORS configuration issue on the backend',
          solution: 'Ensure backend allows requests from your domain',
          baseURL: baseURL
        });
        
        // Queue the request for retry when connection is restored
        if (!error.config._isRetry) {
          const requestId = requestQueue.enqueue(error.config);
          console.log(`📦 Request queued for retry: ${requestId}`);
        }
      }
    }
    
    // Log all errors in development
    if (process.env.NODE_ENV === 'development') {
      console.error(`❌ API Error: ${error.config?.method?.toUpperCase()} ${error.config?.url}`, {
        status: error.response?.status,
        message: error.message,
        data: error.response?.data
      });
    }
    
    return Promise.reject(error);
  }
);

export default apiInstance;
