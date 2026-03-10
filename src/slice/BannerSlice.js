import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';

// Async thunks for banner operations
export const fetchBanners = createAsyncThunk(
  'banner/fetchBanners',
  async (_, { rejectWithValue }) => {
    try {
      const response = await fetch('/api/banners');
      if (!response.ok) {
        throw new Error('Failed to fetch banners');
      }
      const data = await response.json();
      return data;
    } catch (error) {
      return rejectWithValue(error.message);
    }
  }
);

export const createBanner = createAsyncThunk(
  'banner/createBanner',
  async (bannerData, { rejectWithValue }) => {
    try {
      const response = await fetch('/api/banners', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(bannerData),
      });
      if (!response.ok) {
        throw new Error('Failed to create banner');
      }
      const data = await response.json();
      return data;
    } catch (error) {
      return rejectWithValue(error.message);
    }
  }
);

export const deleteBanner = createAsyncThunk(
  'banner/deleteBanner',
  async (bannerId, { rejectWithValue }) => {
    try {
      const response = await fetch(`/api/banners/${bannerId}`, {
        method: 'DELETE',
      });
      if (!response.ok) {
        throw new Error('Failed to delete banner');
      }
      const data = await response.json();
      return data;
    } catch (error) {
      return rejectWithValue(error.message);
    }
  }
);

export const getBannerList = createAsyncThunk(
  'banner/getBannerList',
  async ({ skip, limit, sort_type, user_id }, { rejectWithValue }) => {
    try {
      const response = await fetch(`/api/banners?skip=${skip}&limit=${limit}&sort=${sort_type}&user_id=${user_id}`);
      if (!response.ok) {
        throw new Error('Failed to fetch banner list');
      }
      const data = await response.json();
      return data;
    } catch (error) {
      return rejectWithValue(error.message);
    }
  }
);

export const getMyBanner = createAsyncThunk(
  'banner/getMyBanner',
  async ({ skip, limit, sort_type }, { rejectWithValue }) => {
    try {
      const response = await fetch(`/api/my-banners?skip=${skip}&limit=${limit}&sort=${sort_type}`);
      if (!response.ok) {
        throw new Error('Failed to fetch my banners');
      }
      const data = await response.json();
      return data;
    } catch (error) {
      return rejectWithValue(error.message);
    }
  }
);

// Initial state
const initialState = {
  banners: [],
  userBanners: [],
  currentBanner: null,
  bannerList: null,
  myBannerList: null,
  loading: false,
  error: null,
  success: false,
  pagination: {
    currentPage: 1,
    totalPages: 1,
    totalBanners: 0,
    limit: 10,
  },
  filters: {
    status: 'all',
    category: 'all',
    dateRange: 'all',
    search: '',
  },
  stats: {
    totalBanners: 0,
    activeBanners: 0,
    pendingBanners: 0,
    totalViews: 0,
    totalClicks: 0,
    averageCTR: 0,
  },
};

// Banner slice
const bannerSlice = createSlice({
  name: 'banner',
  initialState,
  reducers: {
    clearError: (state) => {
      state.error = null;
    },
    clearSuccess: (state) => {
      state.success = false;
    },
    setCurrentBanner: (state, action) => {
      state.currentBanner = action.payload;
    },
    setFilters: (state, action) => {
      state.filters = { ...state.filters, ...action.payload };
    },
    resetFilters: (state) => {
      state.filters = initialState.filters;
    },
    setPagination: (state, action) => {
      state.pagination = { ...state.pagination, ...action.payload };
    },
    updateBannerStats: (state, action) => {
      state.stats = { ...state.stats, ...action.payload };
    },
  },
  extraReducers: (builder) => {
    builder
      // Fetch Banners
      .addCase(fetchBanners.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchBanners.fulfilled, (state, action) => {
        state.loading = false;
        state.banners = action.payload.banners || [];
        state.pagination = action.payload.pagination || state.pagination;
        state.stats = action.payload.stats || state.stats;
      })
      .addCase(fetchBanners.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      
      // Get Banner List
      .addCase(getBannerList.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(getBannerList.fulfilled, (state, action) => {
        state.loading = false;
        state.bannerList = action.payload;
      })
      .addCase(getBannerList.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      
      // Get My Banner
      .addCase(getMyBanner.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(getMyBanner.fulfilled, (state, action) => {
        state.loading = false;
        state.myBannerList = action.payload;
      })
      .addCase(getMyBanner.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      
      // Create Banner
      .addCase(createBanner.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(createBanner.fulfilled, (state, action) => {
        state.loading = false;
        state.success = true;
        state.banners.unshift(action.payload);
        state.stats.totalBanners += 1;
      })
      .addCase(createBanner.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      
      // Delete Banner
      .addCase(deleteBanner.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(deleteBanner.fulfilled, (state, action) => {
        state.loading = false;
        state.success = true;
        // Remove the deleted banner from the list
        if (state.myBannerList) {
          state.myBannerList = state.myBannerList.filter(banner => banner.id !== action.payload.id);
        }
        state.stats.totalBanners -= 1;
      })
      .addCase(deleteBanner.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      });
  },
});

// Export actions
export const {
  clearError,
  clearSuccess,
  setCurrentBanner,
  setFilters,
  resetFilters,
  setPagination,
  updateBannerStats,
} = bannerSlice.actions;

// Export reducer
export default bannerSlice.reducer;

// Selectors
export const selectBanners = (state) => state.banner.banners;
export const selectUserBanners = (state) => state.banner.userBanners;
export const selectCurrentBanner = (state) => state.banner.currentBanner;
export const selectBannerLoading = (state) => state.banner.loading;
export const selectBannerError = (state) => state.banner.error;
export const selectBannerSuccess = (state) => state.banner.success;
export const selectBannerPagination = (state) => state.banner.pagination;
export const selectBannerFilters = (state) => state.banner.filters;
export const selectBannerStats = (state) => state.banner.stats;
