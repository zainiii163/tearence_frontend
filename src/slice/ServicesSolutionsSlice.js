import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import { servicesApi } from "../services/servicesSolutionsApi";

// Async thunks for services operations
export const getServicesList = createAsyncThunk(
  "servicesSolutions/getServicesList",
  async (params, { rejectWithValue }) => {
    try {
      const response = await servicesApi.getServices(params);
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response?.data || error.message);
    }
  }
);

export const getServiceDetail = createAsyncThunk(
  "servicesSolutions/getServiceDetail",
  async (serviceId, { rejectWithValue }) => {
    try {
      const response = await servicesApi.getService(serviceId);
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response?.data || error.message);
    }
  }
);

export const createService = createAsyncThunk(
  "servicesSolutions/createService",
  async (serviceData, { rejectWithValue }) => {
    try {
      const response = await servicesApi.createService(serviceData);
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response?.data || error.message);
    }
  }
);

export const updateService = createAsyncThunk(
  "servicesSolutions/updateService",
  async ({ serviceId, serviceData }, { rejectWithValue }) => {
    try {
      const response = await servicesApi.updateService(serviceId, serviceData);
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response?.data || error.message);
    }
  }
);

export const deleteService = createAsyncThunk(
  "servicesSolutions/deleteService",
  async (serviceId, { rejectWithValue }) => {
    try {
      const response = await servicesApi.deleteService(serviceId);
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response?.data || error.message);
    }
  }
);

export const getServicesCategories = createAsyncThunk(
  "servicesSolutions/getServicesCategories",
  async (_, { rejectWithValue }) => {
    try {
      const response = await servicesApi.getCategories();
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response?.data || error.message);
    }
  }
);

export const getFeaturedServices = createAsyncThunk(
  "servicesSolutions/getFeaturedServices",
  async (params, { rejectWithValue }) => {
    try {
      const response = await servicesApi.getFeaturedServices(params);
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response?.data || error.message);
    }
  }
);

export const getTrendingServices = createAsyncThunk(
  "servicesSolutions/getTrendingServices",
  async (params, { rejectWithValue }) => {
    try {
      const response = await servicesApi.getTrendingServices(params);
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response?.data || error.message);
    }
  }
);

export const searchServices = createAsyncThunk(
  "servicesSolutions/searchServices",
  async ({ query, params }, { rejectWithValue }) => {
    try {
      const response = await servicesApi.searchServices(query, params);
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response?.data || error.message);
    }
  }
);

export const getServicesAnalytics = createAsyncThunk(
  "servicesSolutions/getServicesAnalytics",
  async (_, { rejectWithValue }) => {
    try {
      const response = await servicesApi.getServicesAnalytics();
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response?.data || error.message);
    }
  }
);

const initialState = {
  servicesList: null,
  serviceDetail: null,
  categories: [],
  featuredServices: [],
  trendingServices: [],
  searchResults: [],
  analytics: null,
  loading: false,
  error: null,
  message: null,
  filters: {
    priceRange: { min: "", max: "" },
    location: "",
    category: "",
    sortBy: "newest",
  },
  pagination: {
    currentPage: 1,
    itemsPerPage: 20,
    total: 0,
  },
};

const servicesSolutionsSlice = createSlice({
  name: "servicesSolutions",
  initialState,
  reducers: {
    setFilters: (state, action) => {
      state.filters = { ...state.filters, ...action.payload };
    },
    resetFilters: (state) => {
      state.filters = initialState.filters;
    },
    setPagination: (state, action) => {
      state.pagination = { ...state.pagination, ...action.payload };
    },
    clearError: (state) => {
      state.error = null;
      state.message = null;
    },
    clearServiceDetail: (state) => {
      state.serviceDetail = null;
    },
  },
  extraReducers: (builder) => {
    builder
      // Get Services List
      .addCase(getServicesList.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(getServicesList.fulfilled, (state, action) => {
        state.loading = false;
        const payload = action.payload?.data || action.payload;
        state.servicesList = {
          items: payload?.items || payload?.data?.items || [],
          total: payload?.total || payload?.data?.total || 0,
        };
        state.pagination.total = state.servicesList.total;
      })
      .addCase(getServicesList.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      
      // Get Service Detail
      .addCase(getServiceDetail.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(getServiceDetail.fulfilled, (state, action) => {
        state.loading = false;
        state.serviceDetail = action.payload;
      })
      .addCase(getServiceDetail.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      
      // Create Service
      .addCase(createService.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(createService.fulfilled, (state, action) => {
        state.loading = false;
        state.message = action.payload?.message || "Service created successfully";
      })
      .addCase(createService.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      
      // Update Service
      .addCase(updateService.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(updateService.fulfilled, (state, action) => {
        state.loading = false;
        state.message = action.payload?.message || "Service updated successfully";
      })
      .addCase(updateService.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      
      // Delete Service
      .addCase(deleteService.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(deleteService.fulfilled, (state, action) => {
        state.loading = false;
        state.message = action.payload?.message || "Service deleted successfully";
      })
      .addCase(deleteService.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      
      // Get Categories
      .addCase(getServicesCategories.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(getServicesCategories.fulfilled, (state, action) => {
        state.loading = false;
        const p = action.payload;
        if (Array.isArray(p)) {
          state.categories = p;
        } else if (Array.isArray(p?.data?.data)) {
          state.categories = p.data.data;
        } else if (Array.isArray(p?.data)) {
          state.categories = p.data;
        } else {
          state.categories = [];
        }
      })
      .addCase(getServicesCategories.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      
      // Get Featured Services
      .addCase(getFeaturedServices.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(getFeaturedServices.fulfilled, (state, action) => {
        state.loading = false;
        state.featuredServices = action.payload?.data || action.payload || [];
      })
      .addCase(getFeaturedServices.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      
      // Get Trending Services
      .addCase(getTrendingServices.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(getTrendingServices.fulfilled, (state, action) => {
        state.loading = false;
        state.trendingServices = action.payload?.data || action.payload || [];
      })
      .addCase(getTrendingServices.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      
      // Search Services
      .addCase(searchServices.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(searchServices.fulfilled, (state, action) => {
        state.loading = false;
        state.searchResults = action.payload?.data || action.payload || [];
      })
      .addCase(searchServices.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      });
  },
});

export const { setFilters, resetFilters, setPagination, clearError, clearServiceDetail } = servicesSolutionsSlice.actions;
export default servicesSolutionsSlice.reducer;
