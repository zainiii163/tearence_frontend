import api from '../api';
import toast from 'react-hot-toast';

const authService = {
  // Login user
  login: async (credentials) => {
    try {
      const response = await api.post('/auth/web-login', credentials);
      
      if (response.data.success && response.data.data.access_token) {
        // Store token in localStorage
        localStorage.setItem('token', response.data.data.access_token);
        localStorage.setItem('user', JSON.stringify(response.data.data.user));
        
        toast.success('Login successful!');
        return response.data.data;
      } else {
        throw new Error(response.data.message || 'Login failed');
      }
    } catch (error) {
      toast.error(error.response?.data?.message || 'Login failed');
      throw error;
    }
  },

  // Register user
  register: async (userData) => {
    try {
      const response = await api.post('/auth/register', userData);
      
      if (response.data.success) {
        toast.success('Registration successful! Please login.');
        return response.data.data;
      } else {
        throw new Error(response.data.message || 'Registration failed');
      }
    } catch (error) {
      toast.error(error.response?.data?.message || 'Registration failed');
      throw error;
    }
  },

  // Logout user
  logout: async () => {
    try {
      // Call logout endpoint if available
      await api.post('/auth/logout');
    } catch (error) {
      // Continue with local logout even if API call fails
      console.warn('Logout API call failed:', error);
    } finally {
      // Clear local storage
      localStorage.removeItem('token');
      localStorage.removeItem('user');
      
      toast.success('Logged out successfully');
      
      // Redirect to login page
      window.location.href = '/login';
    }
  },

  // Get current user
  getCurrentUser: () => {
    try {
      const user = localStorage.getItem('user');
      return user ? JSON.parse(user) : null;
    } catch (error) {
      console.error('Error parsing user data:', error);
      return null;
    }
  },

  // Get authentication token
  getToken: () => {
    return localStorage.getItem('token');
  },

  // Check if user is authenticated
  isAuthenticated: () => {
    const token = localStorage.getItem('token');
    const user = localStorage.getItem('user');
    return !!(token && user);
  },

  // Refresh user data
  refreshUserData: async () => {
    try {
      const response = await api.get('/auth/me');
      
      if (response.data.success) {
        localStorage.setItem('user', JSON.stringify(response.data.data));
        return response.data.data;
      }
    } catch (error) {
      console.error('Failed to refresh user data:', error);
      // If refresh fails, logout the user
      authService.logout();
    }
  },

  // Update user profile
  updateProfile: async (userData) => {
    try {
      const response = await api.put('/auth/profile', userData);
      
      if (response.data.success) {
        // Update stored user data
        localStorage.setItem('user', JSON.stringify(response.data.data));
        toast.success('Profile updated successfully!');
        return response.data.data;
      }
    } catch (error) {
      toast.error(error.response?.data?.message || 'Failed to update profile');
      throw error;
    }
  },

  // Change password
  changePassword: async (passwordData) => {
    try {
      const response = await api.put('/auth/password', passwordData);
      
      if (response.data.success) {
        toast.success('Password changed successfully!');
        return response.data.data;
      }
    } catch (error) {
      toast.error(error.response?.data?.message || 'Failed to change password');
      throw error;
    }
  },

  // Request password reset
  requestPasswordReset: async (email) => {
    try {
      const response = await api.post('/auth/forgot-password', { email });
      
      if (response.data.success) {
        toast.success('Password reset link sent to your email!');
        return response.data.data;
      }
    } catch (error) {
      toast.error(error.response?.data?.message || 'Failed to send reset link');
      throw error;
    }
  },

  // Reset password
  resetPassword: async (token, passwordData) => {
    try {
      const response = await api.post(`/auth/reset-password/${token}`, passwordData);
      
      if (response.data.success) {
        toast.success('Password reset successfully!');
        return response.data.data;
      }
    } catch (error) {
      toast.error(error.response?.data?.message || 'Failed to reset password');
      throw error;
    }
  },

  // Verify email
  verifyEmail: async (token) => {
    try {
      const response = await api.post(`/auth/verify-email/${token}`);
      
      if (response.data.success) {
        toast.success('Email verified successfully!');
        return response.data.data;
      }
    } catch (error) {
      toast.error(error.response?.data?.message || 'Failed to verify email');
      throw error;
    }
  },

  // Resend verification email
  resendVerificationEmail: async () => {
    try {
      const response = await api.post('/auth/resend-verification');
      
      if (response.data.success) {
        toast.success('Verification email sent!');
        return response.data.data;
      }
    } catch (error) {
      toast.error(error.response?.data?.message || 'Failed to send verification email');
      throw error;
    }
  },
};

export default authService;
