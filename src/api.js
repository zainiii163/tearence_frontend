import axios from "axios";

// Use environment variable for API URL, fallback to local proxy
// For localhost development, create .env file in root directory with:
// REACT_APP_API_BASE_URL=http://localhost:8000/api/v1
const baseURL = process.env.REACT_APP_API_BASE_URL || 'https://api.worldwideadverts.info/api/v1';

// Create axios instance for internal use
let apiInstance;

// Log which API we're using in development
if (process.env.NODE_ENV === 'development') {
  console.info(`[API] Using base URL: ${baseURL}`);
  if (!process.env.REACT_APP_API_BASE_URL) {
    console.info(`[API] Using proxy for development. Restart server after changing setupProxy.js`);
  }
}

export const server = async () => {
  try {
    // Mock data helper removed - using real API endpoints only

    // Create axios instance with default config
    apiInstance = axios.create({
      baseURL,
      timeout: 20000,
      headers: {
        "Content-Type": "application/json",
        "Accept": "application/json"
      },
      // CORS configuration
      withCredentials: false, // Don't send credentials for cross-origin requests
      crossdomain: true, // Enable cross-domain requests
      mode: 'cors' // Explicitly set CORS mode
    });

    // Request interceptor - add JWT token to requests
    apiInstance.interceptors.request.use(
      (config) => {
        // Remove Content-Type header for FormData to let browser set it with boundary
        if (config.data instanceof FormData) {
          delete config.headers['Content-Type'];
        }

        // Get JWT token from localStorage
        const token = localStorage.getItem('token');
        if (token) {
          config.headers.Authorization = `Bearer ${token}`;
          if (process.env.NODE_ENV === 'development' && process.env.REACT_APP_API_DEBUG === 'true') {
            console.log('API Request:', config.method?.toUpperCase(), config.url, 'with token:', token.substring(0, 20) + '...');
          }
        } else if (process.env.NODE_ENV === 'development' && process.env.REACT_APP_API_DEBUG === 'true') {
          console.log('API Request:', config.method?.toUpperCase(), config.url, 'NO TOKEN');
        }
        return config;
      },
      (error) => {
        return Promise.reject(error);
      }
    );

    // Response interceptor for error handling and token refresh
    apiInstance.interceptors.response.use(
      (response) => {
        // Only log in development mode
        if (process.env.NODE_ENV === 'development' && process.env.REACT_APP_API_DEBUG === 'true') {
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
            ? fullUrl.split('/api/')[1] // Extract path after /api/
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
              const refreshResponse = await refreshInstance.post('/auth/refresh');
              const newToken = refreshResponse.data?.token || refreshResponse.data?.access_token;
              
              if (newToken) {
                localStorage.setItem('token', newToken);
                // Also save new refresh token if provided
                if (refreshResponse.data?.refresh_token) {
                  localStorage.setItem('refresh_token', refreshResponse.data.refresh_token);
                }
                originalRequest.headers.Authorization = `Bearer ${newToken}`;
                return apiInstance(originalRequest);
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
                localStorage.removeItem('token');
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
              localStorage.removeItem('token');
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
          
          // Handle 404s - use mock data fallbacks for public endpoints only
          if (status === 404) {
            const isUserDashboardEndpoint = /\/my-(adverts|vehicles|profile|jobs|books|services|banners|ads)/.test(url)
              || url.includes('job-seekers/my-profile');

            if (isUserDashboardEndpoint) {
              return Promise.reject({
                message: 'Endpoint not found: ' + url,
                status: 404,
                is404: true,
                silent: true,
              });
            }

            if (process.env.NODE_ENV === 'development') {
              console.debug('API endpoint not found:', url);
            }

            return Promise.reject({
              message: 'Endpoint not found: ' + url,
              status: 404,
              is404: true,
            });
          }
          
          // Handle 500 Internal Server Error - preserve auth state
          if (status === 500) {
            console.error('Server Error (500) - preserving auth state:', {
              url,
              message: errorData?.message || 'Internal server error',
              timestamp: new Date().toISOString()
            });
            
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
          const suppressCorsLog = process.env.REACT_APP_DISABLE_CORS_WARNINGS === 'true';
          if (process.env.NODE_ENV === 'development' && !suppressCorsLog) {
            // Log once — repeated 15s timeouts spam the console and look like the app is broken
            if (!window.__wwaNetworkHintLogged) {
              window.__wwaNetworkHintLogged = true;
              console.warn(
                'API unreachable (Laravel may be down). Start: php artisan serve --host=127.0.0.1 --port=8000'
              );
            }
          }
          
          return Promise.reject({ 
            message: "Network error. Please check your connection and ensure CORS is configured on the backend.", 
            status: 0,
            isCORSError: true
          });
        } else {
          // Error in request setup
          if (process.env.NODE_ENV === 'development') {
            console.error('Request Setup Error:', error.message);
          }
          return Promise.reject({ message: error.message || "An unexpected error occurred.", status: 0 });
        }
      }
    );

    return apiInstance;
  } catch (e) {
    console.error("Error creating axios instance:", e);
    throw e;
  }
};

const api = {
  get: async (url, params) => (await server()).get(url, params),
  post: async (url, params, config) => (await server()).post(url, params, config),
  put: async (url, params, config) => (await server()).put(url, params, config),
  patch: async (url, params, config) => (await server()).patch(url, params, config),
  delete: async (url, params, config) => (await server()).delete(url, params, config),
  // Axios-compatible; used by services that call api.request({ url, method, data })
  request: async (config) => (await server()).request(config),
};

// Debug helper functions - add to window for console access
if (typeof window !== 'undefined') {
  window.debugAuth = () => {
    const token = localStorage.getItem('token');
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
    localStorage.setItem('token', token);
    console.log('Test token set:', token.substring(0, 50) + '...');
    window.debugAuth();
  };

  window.clearTokens = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('refresh_token');
    console.log('All tokens cleared');
    window.debugAuth();
  };

  // Helper function to check if token is expiring soon
  window.checkTokenExpiry = () => {
    const token = localStorage.getItem('token');
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

// ==================== API SERVICES ====================

// Affiliates Hub API
export const affiliatesAPI = {
  // Get all affiliate categories
  getCategories: async () => {
    const response = await api.get('/affiliates/categories');
    return response.data;
  },

  // Get business offers
  getBusinessOffers: async (params = {}) => {
    const response = await api.get('/affiliates/business-offers', { params });
    return response.data;
  },

  // Get user affiliate posts
  getUserPosts: async (params = {}) => {
    const response = await api.get('/affiliates/user-posts', { params });
    return response.data;
  },

  // Create business offer
  createBusinessOffer: async (offerData) => {
    const formData = new FormData();
    Object.keys(offerData).forEach(key => {
      if (key !== 'promotional_assets') {
        formData.append(key, offerData[key]);
      }
    });
    
    if (offerData.promotional_assets) {
      offerData.promotional_assets.forEach((file, index) => {
        formData.append(`promotional_assets[${index}]`, file);
      });
    }
    
    const response = await api.post('/affiliates/business-offers', formData, {
      headers: { 'Content-Type': 'multipart/form-data' }
    });
    return response.data;
  },

  // Apply to promote business offer
  applyToPromote: async (offerId, applicationData) => {
    const response = await api.post(`/affiliates/business-offers/${offerId}/apply`, applicationData);
    return response.data;
  },

  // Track click
  trackClick: async (data) => {
    const response = await api.get('/affiliates/track-click', { params: data });
    return response.data;
  },

  // Get analytics
  getAnalytics: async (type, id) => {
    const response = await api.get(`/affiliates/analytics/${type}/${id}`);
    return response.data;
  },

  // Get platform statistics
  getStats: async () => {
    const response = await api.get('/affiliates/stats');
    return response.data;
  }
};

// Events API
export const eventsAPI = {
  // Get all events
  getEvents: async (params = {}) => {
    const response = await api.get('/events', { params });
    return response.data;
  },

  // Get single event
  getEvent: async (id) => {
    const response = await api.get(`/events/${id}`);
    return response.data;
  },

  // Create event
  createEvent: async (eventData) => {
    const formData = new FormData();
    Object.keys(eventData).forEach(key => {
      if (key !== 'banner_image' && key !== 'gallery_images') {
        formData.append(key, eventData[key]);
      }
    });
    
    if (eventData.banner_image) {
      formData.append('banner_image', eventData.banner_image);
    }
    
    if (eventData.gallery_images) {
      eventData.gallery_images.forEach((image, index) => {
        formData.append(`gallery_images[${index}]`, image);
      });
    }
    
    const response = await api.post('/events', formData, {
      headers: { 'Content-Type': 'multipart/form-data' }
    });
    return response.data;
  },

  // Update event
  updateEvent: async (id, eventData) => {
    const response = await api.put(`/events/${id}`, eventData);
    return response.data;
  },

  // Delete event
  deleteEvent: async (id) => {
    const response = await api.delete(`/events/${id}`);
    return response.data;
  },

  // Get categories
  getCategories: async () => {
    const response = await api.get('/events/categories');
    return response.data;
  }
};

// Funding Projects API
export const fundingAPI = {
  // Get all projects with filtering and sorting
  getProjects: async (params = {}) => {
    const response = await api.get('/funding-projects', { params });
    return response.data;
  },

  // Get form metadata
  getMetadata: async () => {
    const response = await api.get('/funding-projects/metadata');
    return response.data;
  },

  // Get featured projects
  getFeaturedProjects: async () => {
    const response = await api.get('/funding-projects/featured');
    return response.data;
  },

  // Get trending projects
  getTrendingProjects: async () => {
    const response = await api.get('/funding-projects/trending');
    return response.data;
  },

  // Get projects ending soon
  getEndingSoonProjects: async () => {
    const response = await api.get('/funding-projects/ending-soon');
    return response.data;
  },

  // Get single project details
  getProject: async (id) => {
    const response = await api.get(`/funding-projects/${id}`);
    return response.data;
  },

  // Create new project
  createProject: async (projectData) => {
    const formData = new FormData();
    
    Object.keys(projectData).forEach(key => {
      if (key !== 'cover_image' && key !== 'additional_images' && key !== 'identity_document' && key !== 'documents') {
        formData.append(key, projectData[key]);
      }
    });
    
    if (projectData.cover_image) {
      formData.append('cover_image', projectData.cover_image);
    }
    
    if (projectData.additional_images) {
      projectData.additional_images.forEach((image, index) => {
        formData.append(`additional_images[${index}]`, image);
      });
    }
    
    if (projectData.identity_document) {
      formData.append('identity_document', projectData.identity_document);
    }
    
    if (projectData.documents) {
      projectData.documents.forEach((doc, index) => {
        formData.append(`documents[${index}]`, doc);
      });
    }
    
    const response = await api.post('/funding-projects', formData, {
      headers: { 'Content-Type': 'multipart/form-data' }
    });
    return response.data;
  },

  // Update project
  updateProject: async (id, projectData) => {
    const response = await api.put(`/funding-projects/${id}`, projectData);
    return response.data;
  },

  // Delete project
  deleteProject: async (id) => {
    const response = await api.delete(`/funding-projects/${id}`);
    return response.data;
  }
};

// Vehicles API
export const vehiclesAPI = {
  // Get all vehicles with filtering and sorting
  getVehicles: async (params = {}) => {
    const queryParams = new URLSearchParams();
    
    // Pagination
    if (params?.page) queryParams.append("page", params.page);
    if (params?.per_page) queryParams.append("per_page", params.per_page);
    
    // Filters
    if (params?.category) queryParams.append("category", params.category);
    if (params?.make) queryParams.append("make", params.make);
    if (params?.model) queryParams.append("model", params.model);
    if (params?.year) queryParams.append("year", params.year);
    if (params?.fuel_type) queryParams.append("fuel_type", params.fuel_type);
    if (params?.transmission) queryParams.append("transmission", params.transmission);
    if (params?.body_type) queryParams.append("body_type", params.body_type);
    if (params?.country) queryParams.append("country", params.country);
    if (params?.city) queryParams.append("city", params.city);
    if (params?.min_price) queryParams.append("min_price", params.min_price);
    if (params?.max_price) queryParams.append("max_price", params.max_price);
    if (params?.min_mileage) queryParams.append("min_mileage", params.min_mileage);
    if (params?.max_mileage) queryParams.append("max_mileage", params.max_mileage);
    if (params?.verified_sellers) queryParams.append("verified_sellers", params.verified_sellers);
    
    // Search
    if (params?.search) queryParams.append("search", params.search);
    
    // Sorting
    if (params?.sort_by) queryParams.append("sort_by", params.sort_by);
    
    const url = queryParams.toString() 
      ? `/vehicles?${queryParams.toString()}`
      : `/vehicles`;
    
    const response = await api.get(url);
    return response.data;
  },

  // Get vehicle categories
  getCategories: async () => {
    const response = await api.get('/vehicle-categories');
    return response.data;
  },

  // Get single vehicle
  getVehicle: async (id) => {
    const response = await api.get(`/vehicles/${id}`);
    return response.data;
  },

  // Create vehicle advert
  createVehicle: async (vehicleData) => {
    const formData = new FormData();
    Object.keys(vehicleData).forEach(key => {
      if (key !== 'images' && key !== 'video') {
        formData.append(key, vehicleData[key]);
      }
    });
    
    if (vehicleData.images) {
      vehicleData.images.forEach((image, index) => {
        formData.append(`images[${index}]`, image);
      });
    }
    
    if (vehicleData.video) {
      formData.append('video', vehicleData.video);
    }
    
    const response = await api.post('/vehicles', formData, {
      headers: { 'Content-Type': 'multipart/form-data' }
    });
    return response.data;
  },

  // Update vehicle
  updateVehicle: async (id, vehicleData) => {
    const response = await api.put(`/vehicles/${id}`, vehicleData);
    return response.data;
  },

  // Delete vehicle
  deleteVehicle: async (id) => {
    const response = await api.delete(`/vehicles/${id}`);
    return response.data;
  }
};

// Jobs API
export const jobsAPI = {
  // Get all jobs with filtering
  getJobs: async (params = {}) => {
    const response = await api.get('/jobs', { params });
    return response.data;
  },

  // Get single job
  getJob: async (id) => {
    const response = await api.get(`/jobs/${id}`);
    return response.data;
  },

  // Create job posting
  createJob: async (jobData) => {
    const response = await api.post('/jobs', jobData);
    return response.data;
  },

  // Update job
  updateJob: async (id, jobData) => {
    const response = await api.put(`/jobs/${id}`, jobData);
    return response.data;
  },

  // Delete job
  deleteJob: async (id) => {
    const response = await api.delete(`/jobs/${id}`);
    return response.data;
  },

  // Get job categories
  getCategories: async () => {
    const response = await api.get('/jobs/categories');
    return response.data;
  },

  // Apply for job
  applyForJob: async (jobId, applicationData) => {
    const formData = new FormData();
    Object.keys(applicationData).forEach(key => {
      if (key !== 'resume' && key !== 'cover_letter') {
        formData.append(key, applicationData[key]);
      }
    });
    
    if (applicationData.resume) {
      formData.append('resume', applicationData.resume);
    }
    
    if (applicationData.cover_letter) {
      formData.append('cover_letter', applicationData.cover_letter);
    }
    
    const response = await api.post(`/jobs/${jobId}/apply`, formData, {
      headers: { 'Content-Type': 'multipart/form-data' }
    });
    return response.data;
  }
};

// Services API
export const servicesAPI = {
  // Get all services
  getServices: async (params = {}) => {
    const response = await api.get('/v1/services', { params });
    return response.data;
  },

  // Get single service
  getService: async (id) => {
    const response = await api.get(`/v1/services/${id}`);
    return response.data;
  },

  // Create service
  createService: async (serviceData) => {
    const formData = new FormData();
    Object.keys(serviceData).forEach(key => {
      if (key !== 'portfolio_images' && key !== 'video_file') {
        formData.append(key, serviceData[key]);
      }
    });
    
    if (serviceData.portfolio_images) {
      serviceData.portfolio_images.forEach((image, index) => {
        formData.append(`portfolio_images[${index}]`, image);
      });
    }
    
    if (serviceData.video_file) {
      formData.append('video_file', serviceData.video_file);
    }
    
    const response = await api.post('/v1/services', formData, {
      headers: { 'Content-Type': 'multipart/form-data' }
    });
    return response.data;
  },

  // Update service
  updateService: async (id, serviceData) => {
    const response = await api.put(`/v1/services/${id}`, serviceData);
    return response.data;
  },

  // Delete service
  deleteService: async (id) => {
    const response = await api.delete(`/v1/services/${id}`);
    return response.data;
  },

  // Get service categories
  getCategories: async () => {
    const response = await api.get('/v1/services/categories');
    return response.data;
  }
};

// Property API
export const propertyAPI = {
  // Get all properties
  getProperties: async (params = {}) => {
    const response = await api.get('/property', { params });
    return response.data;
  },

  // Get single property
  getProperty: async (id) => {
    const response = await api.get(`/property/${id}`);
    return response.data;
  },

  // Create property listing
  createProperty: async (propertyData) => {
    const formData = new FormData();
    Object.keys(propertyData).forEach(key => {
      if (key !== 'images' && key !== 'video_tour') {
        formData.append(key, propertyData[key]);
      }
    });
    
    if (propertyData.images) {
      propertyData.images.forEach((image, index) => {
        formData.append(`images[${index}]`, image);
      });
    }
    
    if (propertyData.video_tour) {
      formData.append('video_tour', propertyData.video_tour);
    }
    
    const response = await api.post('/property', formData, {
      headers: { 'Content-Type': 'multipart/form-data' }
    });
    return response.data;
  },

  // Update property
  updateProperty: async (id, propertyData) => {
    const response = await api.put(`/property/${id}`, propertyData);
    return response.data;
  },

  // Delete property
  deleteProperty: async (id) => {
    const response = await api.delete(`/property/${id}`);
    return response.data;
  },

  // Get property categories
  getCategories: async () => {
    const response = await api.get('/property/categories');
    return response.data;
  }
};

// Banner Adverts API
export const bannerAPI = {
  // Get all banners
  getBanners: async (params = {}) => {
    const response = await api.get('/banners', { params });
    return response.data;
  },

  // Get single banner
  getBanner: async (id) => {
    const response = await api.get(`/banners/${id}`);
    return response.data;
  },

  // Create banner
  createBanner: async (bannerData) => {
    const formData = new FormData();
    Object.keys(bannerData).forEach(key => {
      if (key !== 'banner_file') {
        formData.append(key, bannerData[key]);
      }
    });
    
    if (bannerData.banner_file) {
      formData.append('banner_file', bannerData.banner_file);
    }
    
    const response = await api.post('/banners', formData, {
      headers: { 'Content-Type': 'multipart/form-data' }
    });
    return response.data;
  },

  // Update banner
  updateBanner: async (id, bannerData) => {
    const response = await api.put(`/banners/${id}`, bannerData);
    return response.data;
  },

  // Delete banner
  deleteBanner: async (id) => {
    const response = await api.delete(`/banners/${id}`);
    return response.data;
  },

  // Get banner categories
  getCategories: async () => {
    const response = await api.get('/banners/categories');
    return response.data;
  }
};

// Universal Adverts API (for general adverts)
export const advertsAPI = {
  // Get all adverts with filtering
  getAdverts: async (params = {}) => {
    const response = await api.get('/adverts', { params });
    return response.data;
  },

  // Get single advert
  getAdvert: async (id) => {
    const response = await api.get(`/adverts/${id}`);
    return response.data;
  },

  // Create advert
  createAdvert: async (advertData) => {
    const formData = new FormData();
    Object.keys(advertData).forEach(key => {
      if (key !== 'images') {
        formData.append(key, advertData[key]);
      }
    });
    
    if (advertData.images) {
      advertData.images.forEach((image, index) => {
        formData.append(`images[${index}]`, image);
      });
    }
    
    const response = await api.post('/adverts', formData, {
      headers: { 'Content-Type': 'multipart/form-data' }
    });
    return response.data;
  },

  // Update advert
  updateAdvert: async (id, advertData) => {
    const response = await api.put(`/adverts/${id}`, advertData);
    return response.data;
  },

  // Delete advert
  deleteAdvert: async (id) => {
    const response = await api.delete(`/adverts/${id}`);
    return response.data;
  },

  // Get categories
  getCategories: async () => {
    const response = await api.get('/adverts/categories');
    return response.data;
  },

  // Promotion upgrade
  upgradePromotion: async (id, promotionData) => {
    const response = await api.post(`/adverts/${id}/promotion`, promotionData);
    return response.data;
  }
};

// Upsell API
export const upsellAPI = {
  // Get available upsell plans
  getPlans: async (category) => {
    const response = await api.get(`/upsells/plans${category ? `?category=${category}` : ''}`);
    return response.data;
  },

  // Purchase upsell
  purchaseUpsell: async (upsellData) => {
    const response = await api.post('/upsells/purchase', upsellData);
    return response.data;
  },

  // Get user upsells
  getUserUpsells: async () => {
    const response = await api.get('/upsells/user');
    return response.data;
  }
};

// Featured Adverts API
export const featuredAdvertsAPI = {
  // Get all featured adverts
  getAdverts: async (params = {}) => {
    const response = await api.get('/featured-adverts', { params });
    return response.data;
  },

  // Get single advert
  getAdvert: async (id) => {
    const response = await api.get(`/featured-adverts/${id}`);
    return response.data;
  },

  // Create advert
  createAdvert: async (advertData) => {
    const formData = new FormData();
    Object.keys(advertData).forEach(key => {
      if (key !== 'images') {
        formData.append(key, advertData[key]);
      }
    });
    
    if (advertData.images) {
      advertData.images.forEach((image, index) => {
        formData.append(`images[${index}]`, image);
      });
    }
    
    const response = await api.post('/featured-adverts', formData, {
      headers: { 'Content-Type': 'multipart/form-data' }
    });
    return response.data;
  },

  // Update advert
  updateAdvert: async (id, advertData) => {
    const response = await api.put(`/featured-adverts/${id}`, advertData);
    return response.data;
  },

  // Delete advert
  deleteAdvert: async (id) => {
    const response = await api.delete(`/featured-adverts/${id}`);
    return response.data;
  },

  // Get categories
  getCategories: async () => {
    const response = await api.get('/featured-adverts/categories');
    return response.data;
  }
};

// Sponsored Adverts API
export const sponsoredAPI = {
  // Get all sponsored adverts
  getAdverts: async (params = {}) => {
    const response = await api.get('/sponsored-adverts', { params });
    return response.data;
  },

  // Get single advert
  getAdvert: async (id) => {
    const response = await api.get(`/sponsored-adverts/${id}`);
    return response.data;
  },

  // Create advert
  createAdvert: async (advertData) => {
    const formData = new FormData();
    Object.keys(advertData).forEach(key => {
      if (key !== 'images') {
        formData.append(key, advertData[key]);
      }
    });
    
    if (advertData.images) {
      advertData.images.forEach((image, index) => {
        formData.append(`images[${index}]`, image);
      });
    }
    
    const response = await api.post('/sponsored-adverts', formData, {
      headers: { 'Content-Type': 'multipart/form-data' }
    });
    return response.data;
  },

  // Update advert
  updateAdvert: async (id, advertData) => {
    const response = await api.put(`/sponsored-adverts/${id}`, advertData);
    return response.data;
  },

  // Delete advert
  deleteAdvert: async (id) => {
    const response = await api.delete(`/sponsored-adverts/${id}`);
    return response.data;
  },

  // Get categories
  getCategories: async () => {
    const response = await api.get('/sponsored-adverts/categories');
    return response.data;
  },

  // Get seller profile
  getSellerProfile: async (id) => {
    const response = await api.get(`/sponsored-adverts/seller/${id}`);
    return response.data;
  },

  // Contact seller
  contactSeller: async (id, message) => {
    const response = await api.post(`/sponsored-adverts/seller/${id}/contact`, { message });
    return response.data;
  },

  // Get advert analytics
  getAdvertAnalytics: async (id) => {
    const response = await api.get(`/sponsored-adverts/${id}/analytics`);
    return response.data;
  },

  // Track sponsored event
  trackEvent: async (data) => {
    const response = await api.post('/sponsored-adverts/track', data);
    return response.data;
  },

  // Save advert
  saveAdvert: async (id) => {
    const response = await api.post(`/sponsored-adverts/${id}/save`);
    return response.data;
  },

  // Get live activity
  getLiveActivity: async () => {
    const response = await api.get('/sponsored-adverts/activity');
    return response.data;
  },

  // Additional functions needed by sponsored-adverts page
  createSponsoredAdvert: async (advertData) => {
    return this.createAdvert(advertData);
  },

  getHomepageStats: async () => {
    const response = await api.get('/sponsored-adverts/homepage-stats');
    return response.data;
  },

  getSponsoredCategories: async () => {
    return this.getCategories();
  },

  getAllSponsoredAdverts: async (params = {}) => {
    return this.getAdverts(params);
  },

  getFeaturedAdverts: async (params = {}) => {
    const response = await api.get('/sponsored-adverts/featured', { params });
    return response.data;
  },

  getAdvertsByCategory: async (category, params = {}) => {
    const response = await api.get(`/sponsored-adverts/category/${category}`, { params });
    return response.data;
  },

  getSavedAdverts: async (params = {}) => {
    const response = await api.get('/sponsored-adverts/saved', { params });
    return response.data;
  },

  searchSponsoredAdverts: async (query, params = {}) => {
    const response = await api.get('/sponsored-adverts/search', { 
      params: { q: query, ...params } 
    });
    return response.data;
  },

  trackSponsoredEvent: async (data) => {
    return this.trackEvent(data);
  }
};

// Venues API
export const venuesAPI = {
  // Get all venues
  getVenues: async (params = {}) => {
    const response = await api.get('/venues', { params });
    return response.data;
  },

  // Get single venue
  getVenue: async (id) => {
    const response = await api.get(`/venues/${id}`);
    return response.data;
  },

  // Create venue
  createVenue: async (venueData) => {
    const formData = new FormData();
    Object.keys(venueData).forEach(key => {
      if (key !== 'images') {
        formData.append(key, venueData[key]);
      }
    });
    
    if (venueData.images) {
      venueData.images.forEach((image, index) => {
        formData.append(`images[${index}]`, image);
      });
    }
    
    const response = await api.post('/venues', formData, {
      headers: { 'Content-Type': 'multipart/form-data' }
    });
    return response.data;
  },

  // Update venue
  updateVenue: async (id, venueData) => {
    const response = await api.put(`/venues/${id}`, venueData);
    return response.data;
  },

  // Delete venue
  deleteVenue: async (id) => {
    const response = await api.delete(`/venues/${id}`);
    return response.data;
  },

  // Get categories
  getCategories: async () => {
    const response = await api.get('/venues/categories');
    return response.data;
  }
};
