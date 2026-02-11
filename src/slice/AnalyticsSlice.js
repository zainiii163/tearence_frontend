import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import analyticsService from "../services/AnalyticsService";

// Analytics thunks
export const getRevenueAnalytics = createAsyncThunk(
  "analytics/getRevenueAnalytics",
  async (params, { rejectWithValue }) => {
    try {
      const response = await analyticsService.getRevenueAnalytics(params);
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response?.data || error.message);
    }
  }
);

export const getJobAnalytics = createAsyncThunk(
  "analytics/getJobAnalytics",
  async (params, { rejectWithValue }) => {
    try {
      const response = await analyticsService.getJobAnalytics(params);
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response?.data || error.message);
    }
  }
);

export const getCandidateAnalytics = createAsyncThunk(
  "analytics/getCandidateAnalytics",
  async (params, { rejectWithValue }) => {
    try {
      const response = await analyticsService.getCandidateAnalytics(params);
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response?.data || error.message);
    }
  }
);

export const getUpsellAnalytics = createAsyncThunk(
  "analytics/getUpsellAnalytics",
  async (params, { rejectWithValue }) => {
    try {
      const response = await analyticsService.getUpsellAnalytics(params);
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response?.data || error.message);
    }
  }
);

export const getOverviewAnalytics = createAsyncThunk(
  "analytics/getOverviewAnalytics",
  async (_, { rejectWithValue }) => {
    try {
      const response = await analyticsService.getOverviewAnalytics();
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response?.data || error.message);
    }
  }
);

// Get user post analytics
export const getUserPostAnalytics = createAsyncThunk(
  "analytics/getUserPostAnalytics",
  async (params, { rejectWithValue }) => {
    try {
      const response = await analyticsService.getUserPostAnalytics(params);
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response?.data || error.message);
    }
  }
);

// Track analytics event
export const trackEvent = createAsyncThunk(
  "analytics/trackEvent",
  async (eventData, { rejectWithValue }) => {
    try {
      const response = await analyticsService.trackEvent(eventData);
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response?.data || error.message);
    }
  }
);

const initialState = {
  revenueAnalytics: null,
  jobAnalytics: null,
  candidateAnalytics: null,
  upsellAnalytics: null,
  overviewAnalytics: null,
  userPostAnalytics: null,
  loading: false,
  error: null,
};

const analyticsSlice = createSlice({
  name: "analytics",
  initialState,
  reducers: {
    clearError: (state) => {
      state.error = null;
    },
    clearAnalytics: (state) => {
      state.revenueAnalytics = null;
      state.jobAnalytics = null;
      state.candidateAnalytics = null;
      state.upsellAnalytics = null;
      state.overviewAnalytics = null;
      state.userPostAnalytics = null;
    },
  },
  extraReducers: (builder) => {
    builder
      // Get Revenue Analytics
      .addCase(getRevenueAnalytics.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(getRevenueAnalytics.fulfilled, (state, action) => {
        state.loading = false;
        state.revenueAnalytics = action.payload?.data || action.payload;
      })
      .addCase(getRevenueAnalytics.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      // Get Job Analytics
      .addCase(getJobAnalytics.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(getJobAnalytics.fulfilled, (state, action) => {
        state.loading = false;
        state.jobAnalytics = action.payload?.data || action.payload;
      })
      .addCase(getJobAnalytics.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      // Get Candidate Analytics
      .addCase(getCandidateAnalytics.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(getCandidateAnalytics.fulfilled, (state, action) => {
        state.loading = false;
        state.candidateAnalytics = action.payload?.data || action.payload;
      })
      .addCase(getCandidateAnalytics.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      // Get Upsell Analytics
      .addCase(getUpsellAnalytics.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(getUpsellAnalytics.fulfilled, (state, action) => {
        state.loading = false;
        state.upsellAnalytics = action.payload?.data || action.payload;
      })
      .addCase(getUpsellAnalytics.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      // Get Overview Analytics
      .addCase(getOverviewAnalytics.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(getOverviewAnalytics.fulfilled, (state, action) => {
        state.loading = false;
        state.overviewAnalytics = action.payload?.data || action.payload;
      })
      .addCase(getOverviewAnalytics.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      // Get User Post Analytics
      .addCase(getUserPostAnalytics.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(getUserPostAnalytics.fulfilled, (state, action) => {
        state.loading = false;
        state.userPostAnalytics = action.payload?.data || action.payload;
      })
      .addCase(getUserPostAnalytics.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      // Track Event
      .addCase(trackEvent.pending, (state) => {
        // Don't set loading for tracking events to avoid UI blocking
      })
      .addCase(trackEvent.fulfilled, (state) => {
        // Event tracked successfully
      })
      .addCase(trackEvent.rejected, (state) => {
        // Silently fail tracking to not disrupt user experience
      });
  },
});

export const { clearError, clearAnalytics } = analyticsSlice.actions;
export default analyticsSlice.reducer;


