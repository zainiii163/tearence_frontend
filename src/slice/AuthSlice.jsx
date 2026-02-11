import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import AuthServices from "../services/AuthServices";

// For JWT-based authentication, we store tokens in localStorage
// The authentication state will be determined by API calls and token presence
const getInitialState = () => {
  // Check if we have a valid JWT token in localStorage
  const token = localStorage.getItem('jwt_token');
  
  // If no token exists, user is definitely logged out
  if (!token) {
    return {
      loading: false,
      userInfo: null,
      authError: null,
      authMessage: null,
      logIn: false,
      userDetail: null,
      customerId: null,
      token: null,
    };
  }
  
  // If token exists, start with logged out state until verification
  // This prevents showing logged in state without proper validation
  return {
    loading: false,
    userInfo: null,
    authError: null,
    authMessage: null,
    logIn: false, // Always start as false, will be updated by getUserDetails
    userDetail: null,
    customerId: null,
    token: token, // Keep token for validation
  };
};

const initialState = getInitialState();

export const signIn = createAsyncThunk(
  "v1/auth/login",
  async ({ formData }, { rejectWithValue }) => {
    try {
      const res = await AuthServices.signIn(formData);
      return res.data;
    } catch (error) {
      // Handle API error response format: {status: "Error", message: "...", data: null}
      const errorMessage = error?.response?.data?.message || error?.message || "Login failed. Please check your credentials.";
      return rejectWithValue({ message: errorMessage });
    }
  }
);
export const signUp = createAsyncThunk(
  "v1/auth/register",
  async ({ formData }) => {
    const res = await AuthServices.signUp(formData);
    return res.data;
  }
);

export const logOut = createAsyncThunk("auth/logout", async () => {
  const res = await AuthServices.logOut();
  return res.data;
});

export const forgotPassword = createAsyncThunk(
  "auth/forgotPassword",
  async ({ email }) => {
    const res = await AuthServices.forgotPassword({ email });
    return res.data;
  }
);

export const checkAuth = createAsyncThunk(
  "auth/checkAuth",
  async (_, { rejectWithValue }) => {
    try {
      const res = await AuthServices.checkAuth();
      return res.data;
    } catch (error) {
      console.error('checkAuth error:', error);
      return rejectWithValue({ message: "Not authenticated" });
    }
  }
);

export const getUserDetails = createAsyncThunk(
  "auth/getUserDetails",
  async (_, { rejectWithValue }) => {
    try {
      const res = await AuthServices.getUserDetails();
      return res.data;
    } catch (error) {
      console.error('getUserDetails error:', error);
      const errorMessage = error?.response?.data?.message || error?.message || "Failed to fetch user profile";
      return rejectWithValue({ message: errorMessage });
    }
  }
);

export const updateUserDetails = createAsyncThunk(
  "auth/updateUserDetails",
  async ({ id, payload }) => {
    const res = await AuthServices.updateUserDetails(id, payload);
    return res.data;
  }
);
export const updateUserAvatar = createAsyncThunk(
  "auth/updateUserAvatar",
  async ({ id, payload }) => {
    const res = await AuthServices.updateUserAvatar(id, payload);
    return res.data;
  }
);
export const resetPassword = createAsyncThunk(
  "auth/resetPassword",
  async (payload) => {
    const res = await AuthServices.resetPassword(payload);
    return res.data;
  }
);
const handleError = (state, action) => {
  state.loading = false;
  console.error(action.error.message, action.error);
  state.authError = action.error.message;
  
  // Enhanced error handling - only clear auth state for definite auth failures
  const errorMessage = action.error?.message || '';
  const isServerError = action.error?.isServerError || action.error?.preserveAuth;
  const isNetworkError = action.error?.status === 0 || errorMessage.includes('Network');
  
  // Only clear auth state for definite authentication failures
  if (errorMessage.includes('Unauthenticated') || 
      errorMessage.includes('Invalid token') ||
      errorMessage.includes('Token expired') ||
      errorMessage.includes('Authentication failed')) {
    console.warn('Definite auth failure in slice - clearing auth state');
    state.logIn = false;
    state.userDetail = null;
    state.customerId = null;
    state.token = null;
    localStorage.removeItem('jwt_token');
    localStorage.removeItem('refresh_token');
    localStorage.removeItem("customer_id");
    localStorage.removeItem("userDetail");
  } else if (isServerError || isNetworkError) {
    console.warn('Server/Network error in slice - preserving auth state');
    // Don't clear auth state for server/network issues
  } else {
    console.warn('Unknown error in slice - preserving auth state as precaution');
    // When in doubt, preserve auth state
  }
};

const authSlice = createSlice({
  name: "auth",
  initialState,
  reducers: {
    clearAuthErrorAndMessage: (state) => {
      state.authError = null;
      state.authMessage = null;
    },
    // Handle rehydration from redux-persist
    setRehydrated: (state, action) => {
      const { logIn, userDetail, customerId, token } = action.payload || {};
      if (logIn !== undefined) state.logIn = logIn;
      if (userDetail !== undefined) state.userDetail = userDetail;
      if (customerId !== undefined) state.customerId = customerId;
      if (token !== undefined) state.token = token;
      // Also restore token in localStorage if provided
      if (token && !localStorage.getItem('jwt_token')) {
        localStorage.setItem('jwt_token', token);
      }
    },
    // Clear JWT token and auth state
    clearToken: (state) => {
      state.token = null;
      state.logIn = false;
      state.userDetail = null;
      state.customerId = null;
      localStorage.removeItem('jwt_token');
      localStorage.removeItem("customer_id");
      localStorage.removeItem("userDetail");
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(signIn.pending, (state) => {
        state.loading = true;
      })
      .addCase(signIn.fulfilled, (state, action) => {
        console.log('=== SIGN IN FULFILLED ===');
        console.log('Full payload:', action.payload);
        console.log('Payload keys:', Object.keys(action.payload || {}));
        console.log('Payload type:', typeof action.payload);
        
        // For JWT-based auth, store the token and user data
        const token = action.payload?.token || action.payload?.access_token;
        const refreshToken = action.payload?.refresh_token;
        const userData = action.payload?.user || action.payload?.data;
        
        console.log('Token extraction:', { 
          token: token ? 'EXISTS' : 'MISSING',
          refreshToken: refreshToken ? 'EXISTS' : 'MISSING',
          userData: userData ? 'EXISTS' : 'MISSING',
          tokenValue: token ? token.substring(0, 50) + '...' : 'null'
        });
        
        if (token) {
          state.token = token;
          localStorage.setItem('jwt_token', token);
          console.log('✅ Token stored successfully:', token.substring(0, 20) + '...');
          console.log('LocalStorage verification:', localStorage.getItem('jwt_token')?.substring(0, 20) + '...');
        } else {
          console.warn('❌ No token found in login response:', action.payload);
          console.warn('Available fields:', Object.keys(action.payload || {}));
        }
        
        // Store refresh token if available
        if (refreshToken) {
          localStorage.setItem('refresh_token', refreshToken);
          console.log('✅ Refresh token stored');
        }
        
        if (userData) {
          state.userDetail = userData;
          if (userData.customer_id) {
            state.customerId = userData.customer_id;
            localStorage.setItem("customer_id", userData.customer_id);
          }
          localStorage.setItem("userDetail", JSON.stringify(userData));
        }
        
        state.loading = false;
        state.logIn = true;
        state.authError = null;
        console.log('Auth state after login:', { logIn: state.logIn, hasToken: !!state.token, customerId: state.customerId });
      })
      .addCase(signIn.rejected, (state, action) => {
        state.loading = false;
        // Handle both error formats: action.error.message or action.payload.message
        state.authError = action.payload?.message || action.error?.message || "Login failed. Please try again.";
        state.logIn = false;
      })
      .addCase(logOut.fulfilled, (state, action) => {
        state.authMessage = action.payload.response;
        // For JWT-based auth, clear token and localStorage data
        state.loading = false;
        state.userInfo = null;
        state.logIn = false;
        state.userDetail = null;
        state.customerId = null;
        state.token = null;
        localStorage.removeItem('jwt_token');
        localStorage.removeItem('refresh_token');
        localStorage.removeItem("customer_id");
        localStorage.removeItem("userDetail");
      })
      .addCase(logOut.rejected, (state, action) => {
        state.authError = action.error.message;
      })
      .addCase(signUp.fulfilled, (state, action) => {
        state.authMessage = action.payload.response;
        state.authError = null;
      })
      .addCase(signUp.rejected, (state, action) => {
        state.authError = action.error.message;
      })
      .addCase(forgotPassword.fulfilled, (state, action) => {
        state.authMessage = action.payload.response;
      })
      .addCase(forgotPassword.rejected, (state, action) => {
        state.authError = action.error.message;
      })
      .addCase(checkAuth.fulfilled, (state, action) => {
        console.log('checkAuth fulfilled:', action.payload);
        state.logIn = true;
        state.authError = null;
        // Store user data if available in checkAuth response
        if (action.payload?.data) {
          state.userDetail = action.payload.data;
          if (action.payload.data.customer_id) {
            state.customerId = action.payload.data.customer_id;
            localStorage.setItem("customer_id", action.payload.data.customer_id);
          }
          localStorage.setItem("userDetail", JSON.stringify(action.payload.data));
        }
      })
      .addCase(checkAuth.rejected, (state, action) => {
        console.log('checkAuth rejected:', action.payload);
        // Enhanced error handling for checkAuth - preserve auth state for non-definite failures
        const errorMessage = action.payload?.message || '';
        
        if (errorMessage.includes('Unauthenticated') || 
            errorMessage.includes('Invalid token') ||
            errorMessage.includes('Token expired') ||
            errorMessage.includes('Authentication failed')) {
          console.warn('Definite auth failure in checkAuth - clearing auth state');
          state.logIn = false;
          state.userDetail = null;
          state.customerId = null;
          state.token = null;
          localStorage.removeItem('jwt_token');
          localStorage.removeItem("customer_id");
          localStorage.removeItem("userDetail");
        } else {
          console.warn('Non-definite error in checkAuth - preserving auth state');
          // Don't clear auth state for server/network issues
        }
        state.authError = action.payload?.message || "Authentication check failed";
      })
      .addCase(getUserDetails.fulfilled, (state, action) => {
        state.userDetail = action.payload;
        state.logIn = true; // Set logIn to true when user details are successfully fetched
        if (action.payload?.data?.customer_id) {
          state.customerId = action.payload.data.customer_id;
          localStorage.setItem("customer_id", action.payload.data.customer_id);
        }
        localStorage.setItem("userDetail", JSON.stringify(action.payload));
        // state.loading = false;
      })
      .addCase(getUserDetails.rejected, (state, action) => {
        console.error('getUserDetails rejected:', action.payload || action.error);
        // Enhanced error handling for getUserDetails - preserve auth state for non-definite failures
        const errorMessage = action.payload?.message || action.error?.message || '';
        
        if (errorMessage.includes('Unauthenticated') || 
            errorMessage.includes('Invalid token') ||
            errorMessage.includes('Token expired') ||
            errorMessage.includes('Authentication failed')) {
          console.warn('Definite auth failure in getUserDetails - clearing auth state');
          state.logIn = false;
          state.userDetail = null;
          state.customerId = null;
          state.token = null;
          localStorage.removeItem('jwt_token');
          localStorage.removeItem("customer_id");
          localStorage.removeItem("userDetail");
        } else {
          console.warn('Non-definite error in getUserDetails - preserving auth state');
          // Don't clear auth state for server/network issues
        }
        state.authError = action.payload?.message || action.error?.message || "Failed to load user profile";
      })
      .addCase(updateUserDetails.pending, (state) => {
        state.loading = true;
      })
      .addCase(updateUserDetails.fulfilled, (state, action) => {
        state.loading = false;
        // state.loading = false;
      })
      .addCase(updateUserDetails.rejected, handleError)
      .addCase(updateUserAvatar.pending, (state) => {
        state.loading = true;
      })
      .addCase(updateUserAvatar.fulfilled, (state, action) => {
        state.loading = false;
      })
      .addCase(updateUserAvatar.rejected, handleError)
      .addCase(resetPassword.pending, (state) => {
        state.loading = true;
      })
      .addCase(resetPassword.fulfilled, (state) => {
        state.loading = false;
      })
      .addCase(resetPassword.rejected, handleError);
  },
});

// export actions
export const { clearAuthErrorAndMessage, setRehydrated, clearToken } = authSlice.actions;
const { reducer } = authSlice;
export default reducer;
