import { useSelector } from 'react-redux';
import { useNavigate, useLocation } from 'react-router-dom';
import { useEffect, useState } from 'react';

/**
 * Custom hook to handle authentication redirects for posting forms
 * 
 * Usage:
 * const { requireAuth, isAuthenticated } = useAuthRedirect();
 * 
 * // In your component:
 * const handlePostClick = () => {
 *   requireAuth('/your-posting-route', 'You must be logged in to create a listing.');
 * };
 */
export const useAuthRedirect = () => {
  const { logIn, token } = useSelector((store) => store.auth);
  const navigate = useNavigate();
  const location = useLocation();
  const [redirectMessage, setRedirectMessage] = useState('');

  // More flexible authentication check - accept either logIn state OR token presence
  const isAuthenticated = logIn === true || token;

  /**
   * Require authentication before accessing a route
   * @param {string} targetRoute - The route to redirect to after login
   * @param {string} message - Custom message to show on login page
   */
  const requireAuth = (targetRoute, message = 'You must be logged in to create a listing.') => {
    console.log('🔐 requireAuth called');
    console.log('🔐 isAuthenticated:', isAuthenticated);
    console.log('🔐 targetRoute:', targetRoute);
    console.log('🔐 message:', message);
    
    if (!isAuthenticated) {
      console.log('🔐 User not authenticated, redirecting to login');
      // Store the intended destination and message in sessionStorage
      sessionStorage.setItem('authRedirect', targetRoute);
      sessionStorage.setItem('authMessage', message);
      
      // Navigate to login with redirect info
      navigate('/Login', { 
        state: { 
          from: targetRoute,
          message: message 
        } 
      });
      return false;
    }
    
    console.log('🔐 User already authenticated, allowing access');
    return true;
  };

  /**
   * Check if user should be redirected after login
   * @returns {string|null} The redirect route or null
   */
  const getRedirectAfterLogin = () => {
    // Check sessionStorage first (highest priority)
    const sessionRedirect = sessionStorage.getItem('authRedirect');
    if (sessionRedirect) {
      sessionStorage.removeItem('authRedirect');
      return sessionRedirect;
    }

    // Check location state (from React Router)
    if (location.state?.from) {
      return location.state.from;
    }

    // Check URL parameters
    const params = new URLSearchParams(location.search);
    const redirectParam = params.get('redirect');
    if (redirectParam) {
      return redirectParam;
    }

    return null;
  };

  /**
   * Get the authentication message to display
   * @returns {string} The message or default
   */
  const getAuthMessage = () => {
    // Check sessionStorage first
    const sessionMessage = sessionStorage.getItem('authMessage');
    if (sessionMessage) {
      sessionStorage.removeItem('authMessage');
      return sessionMessage;
    }

    // Check location state
    if (location.state?.message) {
      return location.state.message;
    }

    // Check URL parameters
    const params = new URLSearchParams(location.search);
    const messageParam = params.get('message');
    if (messageParam) {
      return messageParam;
    }

    return 'You must be logged in to access this page.';
  };

  /**
   * Clear any stored redirect information
   */
  const clearRedirect = () => {
    sessionStorage.removeItem('authRedirect');
    sessionStorage.removeItem('authMessage');
  };

  return {
    isAuthenticated,
    requireAuth,
    getRedirectAfterLogin,
    getAuthMessage,
    clearRedirect,
    redirectMessage
  };
};

/**
 * Higher-order component wrapper for protecting posting form routes
 * 
 * Usage:
 * <ProtectedPostingRoute>
 *   <YourPostingForm />
 * </ProtectedPostingRoute>
 */
export const ProtectedPostingRoute = ({ children, message }) => {
  const { requireAuth } = useAuthRedirect();
  const location = useLocation();

  useEffect(() => {
    // Check authentication on component mount
    const currentPath = location.pathname + location.search;
    requireAuth(currentPath, message || 'You must be logged in to create a listing.');
  }, [location.pathname, location.search]);

  // Only render children if authenticated (redirect happens in requireAuth)
  const { isAuthenticated } = useAuthRedirect();
  
  if (!isAuthenticated) {
    return null; // Will redirect via requireAuth
  }

  return children;
};

/**
 * Hook for posting form buttons to handle authentication
 * 
 * Usage:
 * const { handlePostClick } = usePostingAuth('/post-vehicles');
 * 
 * <button onClick={handlePostClick}>Post Vehicle</button>
 */
export const usePostingAuth = (postRoute, customMessage) => {
  const { requireAuth, isAuthenticated } = useAuthRedirect();
  const navigate = useNavigate();

  const handlePostClick = () => {
    if (requireAuth(postRoute, customMessage)) {
      // User is authenticated, navigate to posting form
      navigate(postRoute);
    }
  };

  return {
    handlePostClick,
    isAuthenticated
  };
};

export default useAuthRedirect;
