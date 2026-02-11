import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import AdModerationService from "../services/AdModerationService";

// Async thunks
export const deleteOldAds = createAsyncThunk(
  "adModeration/deleteOldAds",
  async (_, { rejectWithValue }) => {
    try {
      const response = await AdModerationService.deleteOldAds();
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response?.data || error.message);
    }
  }
);

export const getPendingAds = createAsyncThunk(
  "adModeration/getPendingAds",
  async ({ page = 1, limit = 20 }, { rejectWithValue }) => {
    try {
      const response = await AdModerationService.getPendingAds(page, limit);
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response?.data || error.message);
    }
  }
);

export const approveAd = createAsyncThunk(
  "adModeration/approveAd",
  async (adId, { rejectWithValue }) => {
    try {
      const response = await AdModerationService.approveAd(adId);
      return { adId, response: response.data };
    } catch (error) {
      return rejectWithValue(error.response?.data || error.message);
    }
  }
);

export const rejectAd = createAsyncThunk(
  "adModeration/rejectAd",
  async ({ adId, reason }, { rejectWithValue }) => {
    try {
      const response = await AdModerationService.rejectAd(adId, reason);
      return { adId, response: response.data };
    } catch (error) {
      return rejectWithValue(error.response?.data || error.message);
    }
  }
);

export const detectHarmfulAds = createAsyncThunk(
  "adModeration/detectHarmfulAds",
  async (_, { rejectWithValue }) => {
    try {
      const response = await AdModerationService.detectHarmfulAds();
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response?.data || error.message);
    }
  }
);

export const deleteHarmfulAds = createAsyncThunk(
  "adModeration/deleteHarmfulAds",
  async (adIds, { rejectWithValue }) => {
    try {
      const response = await AdModerationService.deleteHarmfulAds(adIds);
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response?.data || error.message);
    }
  }
);

export const updateAdPosterRole = createAsyncThunk(
  "adModeration/updateAdPosterRole",
  async ({ adId, posterRole }, { rejectWithValue }) => {
    try {
      const response = await AdModerationService.updateAdPosterRole(adId, posterRole);
      return { adId, posterRole, response: response.data };
    } catch (error) {
      return rejectWithValue(error.response?.data || error.message);
    }
  }
);

export const repostAd = createAsyncThunk(
  "adModeration/repostAd",
  async (adId, { rejectWithValue }) => {
    try {
      const response = await AdModerationService.repostAd(adId);
      return { adId, response: response.data };
    } catch (error) {
      return rejectWithValue(error.response?.data || error.message);
    }
  }
);

export const getModerationStats = createAsyncThunk(
  "adModeration/getModerationStats",
  async (_, { rejectWithValue }) => {
    try {
      const response = await AdModerationService.getModerationStats();
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response?.data || error.message);
    }
  }
);

// Initial state
const initialState = {
  pendingAds: [],
  harmfulAds: [],
  stats: {},
  loading: false,
  error: null,
  lastUpdated: null,
};

// Slice
const adModerationSlice = createSlice({
  name: "adModeration",
  initialState,
  reducers: {
    clearError: (state) => {
      state.error = null;
    },
    clearHarmfulAds: (state) => {
      state.harmfulAds = [];
    },
    updatePendingAd: (state, action) => {
      const { adId, updates } = action.payload;
      const index = state.pendingAds.findIndex(ad => ad.id === adId);
      if (index !== -1) {
        state.pendingAds[index] = { ...state.pendingAds[index], ...updates };
      }
    },
  },
  extraReducers: (builder) => {
    builder
      // Delete old ads
      .addCase(deleteOldAds.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(deleteOldAds.fulfilled, (state, action) => {
        state.loading = false;
        state.lastUpdated = new Date().toISOString();
      })
      .addCase(deleteOldAds.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })

      // Get pending ads
      .addCase(getPendingAds.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(getPendingAds.fulfilled, (state, action) => {
        state.loading = false;
        state.pendingAds = action.payload.ads || [];
        state.lastUpdated = new Date().toISOString();
      })
      .addCase(getPendingAds.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
        state.pendingAds = [];
      })

      // Approve ad
      .addCase(approveAd.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(approveAd.fulfilled, (state, action) => {
        state.loading = false;
        // Remove approved ad from pending list
        state.pendingAds = state.pendingAds.filter(ad => ad.id !== action.payload.adId);
        state.lastUpdated = new Date().toISOString();
      })
      .addCase(approveAd.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })

      // Reject ad
      .addCase(rejectAd.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(rejectAd.fulfilled, (state, action) => {
        state.loading = false;
        // Remove rejected ad from pending list
        state.pendingAds = state.pendingAds.filter(ad => ad.id !== action.payload.adId);
        state.lastUpdated = new Date().toISOString();
      })
      .addCase(rejectAd.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })

      // Detect harmful ads
      .addCase(detectHarmfulAds.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(detectHarmfulAds.fulfilled, (state, action) => {
        state.loading = false;
        state.harmfulAds = action.payload.harmful_ads || [];
        state.lastUpdated = new Date().toISOString();
      })
      .addCase(detectHarmfulAds.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
        state.harmfulAds = [];
      })

      // Delete harmful ads
      .addCase(deleteHarmfulAds.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(deleteHarmfulAds.fulfilled, (state) => {
        state.loading = false;
        state.harmfulAds = [];
        state.lastUpdated = new Date().toISOString();
      })
      .addCase(deleteHarmfulAds.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })

      // Update ad poster role
      .addCase(updateAdPosterRole.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(updateAdPosterRole.fulfilled, (state, action) => {
        state.loading = false;
        const { adId, posterRole } = action.payload;
        const index = state.pendingAds.findIndex(ad => ad.id === adId);
        if (index !== -1) {
          state.pendingAds[index].poster_role = posterRole;
        }
        state.lastUpdated = new Date().toISOString();
      })
      .addCase(updateAdPosterRole.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })

      // Repost ad
      .addCase(repostAd.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(repostAd.fulfilled, (state, action) => {
        state.loading = false;
        const { adId } = action.payload;
        const index = state.pendingAds.findIndex(ad => ad.id === adId);
        if (index !== -1) {
          state.pendingAds[index].created_at = new Date().toISOString();
          state.pendingAds[index].reposted = true;
        }
        state.lastUpdated = new Date().toISOString();
      })
      .addCase(repostAd.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })

      // Get moderation stats
      .addCase(getModerationStats.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(getModerationStats.fulfilled, (state, action) => {
        state.loading = false;
        state.stats = action.payload || {};
        state.lastUpdated = new Date().toISOString();
      })
      .addCase(getModerationStats.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
        state.stats = {};
      });
  },
});

// Export actions
export const { clearError, clearHarmfulAds, updatePendingAd } = adModerationSlice.actions;

// Export reducer
export default adModerationSlice.reducer;
