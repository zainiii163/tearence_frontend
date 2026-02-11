import axios from "axios";

// Use environment variable for API URL, fallback to production
// For localhost development, create .env file in root directory with:
// REACT_APP_API_BASE_URL=http://localhost:8000/api
const baseURL = process.env.REACT_APP_API_BASE_URL || "https://api.worldwideadverts.info/api";

// Log which API we're using in development
if (process.env.NODE_ENV === 'development') {
  console.info(`[API] Using base URL: ${baseURL}`);
  if (!process.env.REACT_APP_API_BASE_URL) {
    console.info(`[API] Tip: Create .env file with REACT_APP_API_BASE_URL=http://localhost:8000/api to use local backend`);
  }
}

export const server = async () => {
  try {
    // Debug function to check current auth state
    const debugAuth = () => {
      const token = localStorage.getItem('jwt_token');
      const refreshToken = localStorage.getItem('refresh_token');
      console.log('=== AUTH DEBUG ===');
      console.log('JWT Token exists:', !!token);
      console.log('JWT Token length:', token?.length || 0);
      console.log('JWT Token preview:', token ? token.substring(0, 50) + '...' : 'null');
      console.log('Refresh Token exists:', !!refreshToken);
      console.log('LocalStorage keys:', Object.keys(localStorage));
      console.log('==================');
    };

    const axiosInstance = axios.create({
      baseURL,
      headers: {
        "cache-control": "no-cache, private",
        "Content-Type": "application/json",
        "Accept": "application/json",
      },
      withCredentials: false, // Disable credentials for JWT-based auth
      // For localhost development, ensure cookies work across ports
      // Note: This requires the backend to have proper CORS configuration
    });

    // Request interceptor - add JWT token to requests
    axiosInstance.interceptors.request.use(
      (config) => {
        // Get JWT token from localStorage
        const token = localStorage.getItem('jwt_token');
        if (token) {
          config.headers.Authorization = `Bearer ${token}`;
          console.log('API Request:', config.method?.toUpperCase(), config.url, 'with token:', token.substring(0, 20) + '...');
        } else {
          console.log('API Request:', config.method?.toUpperCase(), config.url, 'NO TOKEN');
          // Debug: Check what's actually in localStorage
          debugAuth();
        }
        return config;
      },
      (error) => {
        return Promise.reject(error);
      }
    );

    // Response interceptor for error handling and token refresh
    axiosInstance.interceptors.response.use(
      (response) => {
        // Only log in development mode (skip logging mock responses from 404 handling)
        if (process.env.NODE_ENV === 'development' && !response.config?._isMockResponse) {
          console.log('API Response:', {
            status: response.status,
            url: response.request?.responseURL || response.config?.url,
            data: response.data
          });
        }
        return response;
      },
      async (error) => {
        if (error.response) {
          const status = error.response.status;
          const errorData = error.response.data;
          const originalRequest = error.config;
          
          // Extract URL - could be full URL or relative path
          const fullUrl = error.request?.responseURL || error.config?.url || 'unknown';
          // Normalize to relative path for easier matching (remove base URL if present)
          const url = fullUrl.includes('/api/') 
            ? fullUrl.split('/api')[1] // Extract path after /api
            : fullUrl; // Already a relative path
          
          // Handle token refresh for 401 errors (except for auth endpoints)
          if (status === 401 && !originalRequest._retry && !url.includes('/auth/')) {
            originalRequest._retry = true;
            
            try {
              // Create a separate axios instance for refresh that doesn't require auth
              const refreshInstance = axios.create({
                baseURL,
                headers: {
                  "Content-Type": "application/json",
                  "Accept": "application/json",
                },
                withCredentials: false,
              });
              
              // Add refresh token if available (different from access token)
              const refreshToken = localStorage.getItem('refresh_token');
              if (refreshToken) {
                refreshInstance.defaults.headers.Authorization = `Bearer ${refreshToken}`;
              }
              
              // Attempt to refresh the token - use POST method for JWT refresh
              const refreshResponse = await refreshInstance.post('/v1/auth/refresh');
              const newToken = refreshResponse.data?.token || refreshResponse.data?.access_token;
              
              if (newToken) {
                localStorage.setItem('jwt_token', newToken);
                // Also save new refresh token if provided
                if (refreshResponse.data?.refresh_token) {
                  localStorage.setItem('refresh_token', refreshResponse.data.refresh_token);
                }
                originalRequest.headers.Authorization = `Bearer ${newToken}`;
                return axiosInstance(originalRequest);
              }
            } catch (refreshError) {
              console.error('Token refresh failed:', refreshError);
              
              // Handle different refresh error scenarios
              const refreshStatus = refreshError.response?.status;
              
              if (refreshStatus === 500) {
                console.log('Backend refresh endpoint error - preserving token');
                return Promise.reject({
                  message: "Authentication service temporarily unavailable",
                  status: 500,
                  isRefreshError: true,
                  preserveAuth: true
                });
              }
              
              if (refreshStatus === 401) {
                console.log('Refresh token expired or invalid - clearing all tokens');
                // Clear both tokens when refresh token is invalid
                localStorage.removeItem('jwt_token');
                localStorage.removeItem('refresh_token');
                
                // Mark original request as failed due to refresh expiry
                return Promise.reject({
                  message: "Session expired. Please login again.",
                  status: 401,
                  isRefreshError: true,
                  refreshExpired: true
                });
              }
              
              // For other refresh failures (network, 429, etc.), preserve tokens
              console.log('Refresh failed with non-critical error - preserving tokens');
              return Promise.reject({
                message: "Token refresh failed. Please try again.",
                status: refreshStatus || 0,
                isRefreshError: true,
                preserveAuth: true
              });
            }
          }
          
          // Handle 401 Unauthorized - only clear token for definite auth failures
          if (status === 401) {
            const errorData = error.response?.data;
            const errorMessage = errorData?.message || '';
            
            // Skip 401 handling for refresh errors that are already handled above
            if (originalRequest._retry && error.isRefreshError) {
              return Promise.reject(error);
            }
            
            // Check if this is a refresh token expiry scenario
            const isRefreshExpired = error.refreshExpired;
            
            // Only clear token for definite authentication failures
            // Don't clear for server errors, network issues, or temporary problems
            const isDefiniteAuthFailure = errorMessage.includes('Unauthenticated') || 
                                        errorMessage.includes('Invalid token') ||
                                        errorMessage.includes('Token expired') ||
                                        errorMessage.includes('Authentication failed') ||
                                        isRefreshExpired;
            
            if (isDefiniteAuthFailure) {
              console.log('Definite auth failure - clearing token');
              localStorage.removeItem('jwt_token');
              localStorage.removeItem('refresh_token');
            } else {
              console.log('Ambiguous 401 error - preserving token for stability');
              // Don't clear token for ambiguous errors that might be server issues
            }
            
            // Only redirect for critical user actions, not for background checks
            const isCriticalAction = url.includes('/post/') || url.includes('/my-') || url.includes('/dashboard');
            const isAuthEndpoint = url.includes('/auth/') || url.includes('login') || url.includes('register');
            const isWebCheck = url.includes('/web-check'); // Don't redirect on web-check failures
            const isChatPolling = url.includes('/chat/unread-count'); // Don't redirect on chat polling failures
            const isLoginPage = window.location.pathname === '/Login' || window.location.pathname === '/login';
            
            if (isCriticalAction && !isAuthEndpoint && !isLoginPage && !isWebCheck && !isChatPolling && isDefiniteAuthFailure) {
              console.log('Critical auth failure - redirecting to login');
              if (window.location.pathname !== '/Login') {
                window.location.href = '/Login';
              }
            } else {
              console.log('Non-critical or ambiguous auth error - preserving UI state');
            }
          }
          
          // Handle 429 Too Many Requests - rate limiting
          if (status === 429) {
            // Return a rejected promise with a user-friendly message
            // Don't log as error in console since it's expected behavior
            return Promise.reject({
              message: "Too many requests. Please wait a moment and try again.",
              status: 429,
              retryAfter: error.response?.headers?.['retry-after'] || 60,
              response: error.response,
            });
          }
          
          // Handle expected 404s gracefully - return mock success response instead of rejecting
          // These endpoints may not be implemented yet on the backend
          // Even though they're in the API collection, the backend may not have them deployed yet
          const expected404Endpoints = [
            '/job-alert',        // GET /v1/job-alert - may not be deployed yet
            '/dashboard/admin',  // GET /v1/dashboard/admin - may not be deployed yet
            '/job-upsell',       // GET /v1/job-upsell - may not be deployed yet
            '/candidate-upsell', // GET /v1/candidate-upsell - may not be deployed yet
            '/listing/my-listing', // GET /v1/listing/my-listing - may not be deployed yet
            '/chat/conversations', // GET /v1/chat/conversations - may not be deployed yet
            '/chat/unread-count',  // GET /v1/chat/unread-count - may not be deployed yet
            '/business/my-business', // GET /v1/business/my-business - may not be deployed yet
            '/store/my-store'    // GET /v1/store/my-store - may not be deployed yet
          ];
          
          // Check if this is an expected 404 endpoint
          // Handle URLs with query parameters (e.g., /v1/job-alert?is_active=true)
          const isExpected404 = status === 404 && expected404Endpoints.some(endpoint => {
            // Extract base path from URL (remove query params for matching)
            const basePath = url.split('?')[0];
            // Check if URL includes the endpoint (works with or without query params)
            return basePath.includes(endpoint) || url.includes(endpoint);
          });
          
          if (isExpected404) {
            // Return a mock successful response with empty data instead of rejecting
            // This prevents console errors and allows the app to gracefully degrade
            let mockData = [];
            
            // Set appropriate empty data structure based on endpoint type
            if (url.includes('dashboard')) {
              mockData = {}; // Dashboard returns object
            } else if (url.includes('unread-count')) {
              mockData = { count: 0 }; // Unread count should have count property
            } else if (url.includes('business/my-business')) {
              mockData = {}; // Business endpoint returns object
            } else if (url.includes('store/my-store')) {
              mockData = {}; // Store endpoint returns object
            } else {
              mockData = []; // Most endpoints return arrays
            }
            
            // Log info in development (not as error) so developers know endpoint isn't available
            if (process.env.NODE_ENV === 'development') {
              console.info(`[API] Endpoint ${url} returned 404 - returning mock data. Set REACT_APP_API_BASE_URL in .env to point to your local backend.`);
            }
            
            const mockResponse = {
              data: {
                status: 'Success',
                message: 'Endpoint not available',
                data: mockData
              },
              status: 200,
              statusText: 'OK',
              headers: error.response?.headers || {},
              config: {
                ...error.config,
                _isMockResponse: true // Flag to skip logging this mock response
              }
            };
            return Promise.resolve(mockResponse);
          }
          
          // Handle 500 Internal Server Error - preserve auth state
          if (status === 500) {
            console.error('Server Error (500) - preserving auth state:', {
              url,
              message: errorData?.message || 'Internal server error',
              timestamp: new Date().toISOString()
            });
            
            // For specific endpoints with known backend issues, return mock data instead of error
            const problematicEndpoints = [
              '/dashboard/user' // Known database schema issue (missing user_id column)
            ];
            
            const isProblematicEndpoint = problematicEndpoints.some(endpoint => {
              const basePath = url.split('?')[0];
              return basePath.includes(endpoint) || url.includes(endpoint);
            });
            
            if (isProblematicEndpoint) {
              console.info(`[API] Endpoint ${url} has known backend issue - returning mock data`);
              
              let mockData = {};
              if (url.includes('dashboard')) {
                mockData = {
                  my_listings: [],
                  candidate_profile: null,
                  job_alerts: [],
                  stats: {
                    total_listings: 0,
                    active_listings: 0,
                    total_views: 0,
                    total_applications: 0
                  },
                  featured_jobs: [],
                  recommended_jobs: [],
                  affiliate_links: [],
                  recent_activities: []
                };
              }
              
              const mockResponse = {
                data: {
                  status: 'Success',
                  message: 'Using fallback data due to backend issue',
                  data: mockData
                },
                status: 200,
                statusText: 'OK',
                headers: error.response?.headers || {},
                config: {
                  ...error.config,
                  _isMockResponse: true
                }
              };
              return Promise.resolve(mockResponse);
            }
            
            // For other 500 errors, NEVER clear auth state - it's always a server issue
            // Return a more user-friendly error message
            return Promise.reject({ 
              message: "Server is temporarily unavailable. Please try again later.", 
              status: 500, 
              response: error.response,
              isServerError: true,
              preserveAuth: true
            });
          }
          
          // Handle 502, 503, 504 Gateway/Service errors - preserve auth state
          if (status >= 502 && status <= 504) {
            console.error(`Server Error (${status}) - preserving auth state:`, {
              url,
              message: errorData?.message || 'Service unavailable',
              timestamp: new Date().toISOString()
            });
            
            return Promise.reject({ 
              message: "Service is temporarily unavailable. Please try again later.", 
              status: status, 
              response: error.response,
              isServerError: true,
              preserveAuth: true
            });
          }
          
          // Handle other errors in development, but skip expected 404s (already handled above)
          if (process.env.NODE_ENV === 'development' && status !== 404) {
            console.error('API Error:', {
              status,
              url,
              message: errorData?.message || error.message,
              data: errorData
            });
          }
          
          // Handle different error response formats for non-expected 404s
          if (errorData?.message) {
            return Promise.reject({ 
              message: errorData.message, 
              status: status || errorData.status, 
              data: errorData.data,
              exception: errorData.exception,
              response: error.response,
            });
          } else if (typeof errorData === 'string') {
            return Promise.reject({ message: errorData, status, response: error.response });
          } else {
            return Promise.reject({ ...errorData, status, response: error.response });
          }
        } else if (error.request) {
          // Request made but no response received
          if (process.env.NODE_ENV === 'development') {
            console.error('Network Error - No response received:', error.config?.url);
          }
          return Promise.reject({ message: "Network error. Please check your connection.", status: 0 });
        } else {
          // Error in request setup
          if (process.env.NODE_ENV === 'development') {
            console.error('Request Setup Error:', error.message);
          }
          return Promise.reject({ message: error.message || "An unexpected error occurred.", status: 0 });
        }
      }
    );

    return axiosInstance;
  } catch (e) {
    console.error("Error creating axios instance:", e);
    throw e;
  }
};

const api = {
  get: async (url, params) => (await server()).get(url, params),
  post: async (url, params) => (await server()).post(url, params),
  put: async (url, params) => (await server()).put(url, params),
  delete: async (url, params) => (await server()).delete(url, params),
};

// Debug helper functions - add to window for console access
if (typeof window !== 'undefined') {
  window.debugAuth = () => {
    const token = localStorage.getItem('jwt_token');
    const refreshToken = localStorage.getItem('refresh_token');
    console.log('=== AUTH DEBUG ===');
    console.log('JWT Token exists:', !!token);
    console.log('JWT Token length:', token?.length || 0);
    console.log('JWT Token preview:', token ? token.substring(0, 50) + '...' : 'null');
    console.log('Refresh Token exists:', !!refreshToken);
    console.log('LocalStorage keys:', Object.keys(localStorage));
    console.log('==================');
    return { token, refreshToken };
  };

  window.setTestToken = (token) => {
    localStorage.setItem('jwt_token', token);
    console.log('Test token set:', token.substring(0, 50) + '...');
    window.debugAuth();
  };

  window.clearTokens = () => {
    localStorage.removeItem('jwt_token');
    localStorage.removeItem('refresh_token');
    console.log('All tokens cleared');
    window.debugAuth();
  };

  // Helper function to check if token is expiring soon
  window.checkTokenExpiry = () => {
    const token = localStorage.getItem('jwt_token');
    if (!token) {
      console.log('No JWT token found');
      return null;
    }

    try {
      const payload = JSON.parse(atob(token.split('.')[1]));
      const expirationTime = payload.exp * 1000;
      const currentTime = Date.now();
      const timeUntilExpiry = expirationTime - currentTime;
      const minutesUntilExpiry = Math.floor(timeUntilExpiry / (1000 * 60));
      
      console.log('Token expiry info:', {
        expirationTime: new Date(expirationTime),
        currentTime: new Date(currentTime),
        minutesUntilExpiry,
        isExpiringSoon: minutesUntilExpiry < 5
      });
      
      return {
        expirationTime,
        currentTime,
        minutesUntilExpiry,
        isExpiringSoon: minutesUntilExpiry < 5
      };
    } catch (e) {
      console.error('Error parsing token:', e);
      return null;
    }
  };
}

export default api;
