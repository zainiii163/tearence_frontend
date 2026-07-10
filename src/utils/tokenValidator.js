// Token validation utility
export const validateToken = () => {
  const token = localStorage.getItem('token');
  
  if (!token) {
    return {
      valid: false,
      reason: 'No token found',
      action: 'Login required'
    };
  }
  
  // Basic token format validation (JWT)
  const parts = token.split('.');
  if (parts.length !== 3) {
    return {
      valid: false,
      reason: 'Invalid JWT format',
      action: 'Login required'
    };
  }
  
  try {
    // Decode payload to check expiration
    const payload = JSON.parse(atob(parts[1]));
    const now = Math.floor(Date.now() / 1000);
    
    if (payload.exp && payload.exp < now) {
      return {
        valid: false,
        reason: 'Token expired',
        action: 'Login required',
        expiredAt: new Date(payload.exp * 1000).toISOString()
      };
    }
    
    return {
      valid: true,
      reason: 'Token appears valid',
      expiresAt: payload.exp ? new Date(payload.exp * 1000).toISOString() : 'Unknown',
      userId: payload.sub || payload.id || payload.user_id
    };
    
  } catch (error) {
    return {
      valid: false,
      reason: 'Cannot decode token payload',
      action: 'Login required',
      error: error.message
    };
  }
};

export const refreshTokenIfNeeded = async () => {
  const validation = validateToken();
  
  if (!validation.valid) {
    console.warn('Token validation failed:', validation);
    return false;
  }
  
  // Check if token expires within next 5 minutes
  if (validation.expiresAt !== 'Unknown') {
    const expiresAt = new Date(validation.expiresAt);
    const fiveMinutesFromNow = new Date(Date.now() + 5 * 60 * 1000);
    
    if (expiresAt < fiveMinutesFromNow) {
      console.log('Token expires soon, attempting refresh...');
      try {
        // Import Api dynamically to avoid circular dependencies
        const { default: Api } = await import('../api');
        const response = await Api.post('auth/refresh');
        
        if (response.data?.access_token) {
          localStorage.setItem('token', response.data.access_token);
          console.log('✅ Token refreshed successfully');
          return true;
        }
      } catch (error) {
        console.error('❌ Token refresh failed:', error);
        return false;
      }
    }
  }
  
  return true;
};

export default {
  validateToken,
  refreshTokenIfNeeded
};
