// Authentication Error Handler Utility
// Provides centralized error handling for auth-related API calls

import { validateToken } from './tokenValidator';

export const handleAuthError = (error, context = 'Unknown') => {
  console.error(`🚫 Authentication error in ${context}:`, error);
  
  // Enhanced error logging
  const errorInfo = {
    context,
    message: error.message,
    status: error.status,
    hasToken: !!localStorage.getItem('token'),
    tokenPreview: localStorage.getItem('token')?.substring(0, 20) + '...',
    timestamp: new Date().toISOString()
  };
  
  console.error('🔍 Error Details:', errorInfo);
  
  // Check if it's a definite auth failure
  const isDefiniteAuthFailure = error.message?.includes('Unauthenticated') ||
                               error.message?.includes('Invalid token') ||
                               error.message?.includes('Token expired') ||
                               error.message?.includes('Authentication failed') ||
                               error.status === 401;
  
  if (isDefiniteAuthFailure) {
    console.warn(`🧹 Clearing auth state due to definite failure in ${context}`);
    clearAuthState();
    return { shouldRedirect: true, errorType: 'definite' };
  }
  
  // For other errors, preserve auth state
  console.log(`💾 Preserving auth state for non-definite error in ${context}`);
  return { shouldRedirect: false, errorType: 'indefinite' };
};

export const clearAuthState = () => {
  localStorage.removeItem('token');
  localStorage.removeItem('refresh_token');
  localStorage.removeItem('user');
  localStorage.removeItem('customer_id');
  
  // Clear API cache
  Object.keys(localStorage).forEach(key => {
    if (key.startsWith('api_cache_')) {
      localStorage.removeItem(key);
    }
  });
  
  console.log('🧹 Auth state cleared');
};

export const safeAuthCall = async (authFunction, context = 'Unknown') => {
  // First validate token before making any auth call
  const tokenValidation = validateToken();
  if (!tokenValidation.valid) {
    console.warn(`⚠️ Token validation failed in ${context}:`, tokenValidation.reason);
    handleAuthError({ message: tokenValidation.reason, status: 401 }, context);
    throw new Error(tokenValidation.reason);
  }
  
  try {
    console.log(`🔐 Making safe auth call in ${context}`);
    const result = await authFunction();
    console.log(`✅ Auth call successful in ${context}`);
    return result;
  } catch (error) {
    const errorHandling = handleAuthError(error, context);
    
    if (errorHandling.shouldRedirect) {
      // Only redirect for definite auth failures
      window.location.href = '/login';
    }
    
    throw error;
  }
};

export const createSafeAuthDispatcher = (dispatch, authAction, context) => {
  return async (...args) => {
    try {
      return await safeAuthCall(() => dispatch(authAction(...args)).unwrap(), context);
    } catch (error) {
      // Error already handled by safeAuthCall, just re-throw
      throw error;
    }
  };
};

// React hook for safe auth calls
export const useSafeAuth = () => {
  const dispatch = useDispatch(); // This would need to be imported
  
  const safeGetUserDetails = createSafeAuthDispatcher(
    dispatch, 
    getUserDetails, // This would need to be imported
    'getUserDetails'
  );
  
  const safeCheckAuth = createSafeAuthDispatcher(
    dispatch,
    checkAuth, // This would need to be imported
    'checkAuth'
  );
  
  return {
    safeGetUserDetails,
    safeCheckAuth,
    safeAuthCall
  };
};

export default {
  handleAuthError,
  clearAuthState,
  safeAuthCall,
  createSafeAuthDispatcher
};
