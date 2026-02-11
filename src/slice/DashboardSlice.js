import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import dashboardService from "../services/DashboardService";

// User Dashboard
export const getUserDashboard = createAsyncThunk(
  "dashboard/getUserDashboard",
  async (_, { rejectWithValue, getState }) => {
    // Check authentication state before making request
    const { auth } = getState();
    if (!auth.logIn || !auth.token) {
      return rejectWithValue({ 
        message: 'Authentication required for dashboard access', 
        status: 401,
        requiresAuth: true 
      });
    }

    try {
      const response = await dashboardService.getUserDashboard();
      return response.data;
    } catch (error) {
      const errorData = error.response?.data || error;
      const status = error.response?.status || error?.status || 0;
      return rejectWithValue({ ...errorData, status });
    }
  }
);

// Admin Dashboard
export const getAdminDashboard = createAsyncThunk(
  "dashboard/getAdminDashboard",
  async (_, { rejectWithValue }) => {
    try {
      const response = await dashboardService.getAdminDashboard();
      return response.data;
    } catch (error) {
      const errorData = error.response?.data || error;
      const status = error.response?.status || error?.status || 0;
      return rejectWithValue({ ...errorData, status });
    }
  }
);

const initialState = {
  userDashboard: null,
  adminDashboard: null,
  loading: false,
  error: null,
};

const dashboardSlice = createSlice({
  name: "dashboard",
  initialState,
  reducers: {
    clearError: (state) => {
      state.error = null;
    },
    clearDashboard: (state) => {
      state.userDashboard = null;
      state.adminDashboard = null;
    },
  },
  extraReducers: (builder) => {
    builder
      // Get User Dashboard
      .addCase(getUserDashboard.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(getUserDashboard.fulfilled, (state, action) => {
        state.loading = false;
        state.userDashboard = action.payload?.data || action.payload;
      })
      .addCase(getUserDashboard.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
        
        // If authentication required, clear dashboard data
        if (action.payload?.requiresAuth || action.payload?.status === 401) {
          console.warn('Dashboard: Authentication required');
          state.userDashboard = null;
        } else {
          console.error('Dashboard: Error loading data:', action.payload?.message);
          // Keep existing dashboard data for server errors to maintain UI stability
        }
      })
      // Get Admin Dashboard
      .addCase(getAdminDashboard.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(getAdminDashboard.fulfilled, (state, action) => {
        state.loading = false;
        state.adminDashboard = action.payload?.data || action.payload;
      })
      .addCase(getAdminDashboard.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
        // Reset dashboard on error
        state.adminDashboard = null;
      });
  },
});

export const { clearError, clearDashboard } = dashboardSlice.actions;
export default dashboardSlice.reducer;


