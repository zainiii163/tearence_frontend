// JWT Token Management for Books Adverts System

/**
 * Get authentication token from localStorage
 */
export const getAuthToken = () => {
  return localStorage.getItem('token');
};

/**
 * Save authentication token to localStorage
 */
export const setAuthToken = (token) => {
  localStorage.setItem('token', token);
};

/**
 * Remove authentication token from localStorage
 */
export const removeAuthToken = () => {
  localStorage.removeItem('token');
};

/**
 * Check if user is authenticated
 */
export const isAuthenticated = () => {
  return !!getAuthToken();
};
