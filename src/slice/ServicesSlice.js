import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import servicesService from "../services/ServicesServices";

// Async thunks for services operations
export const getServicesList = createAsyncThunk(
  "services/getServicesList",
  async (params, { rejectWithValue }) => {
    try {
      const response = await servicesService.getServicesList(params);
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response?.data || error.message);
    }
  }
);

export const getServiceDetail = createAsyncThunk(
  "services/getServiceDetail",
  async (serviceId, { rejectWithValue }) => {
    try {
      const response = await servicesService.getServiceDetail(serviceId);
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response?.data || error.message);
    }
  }
);

export const createService = createAsyncThunk(
  "services/createService",
  async (serviceData, { rejectWithValue }) => {
    try {
      const response = await servicesService.createService(serviceData);
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response?.data || error.message);
    }
  }
);

export const updateService = createAsyncThunk(
  "services/updateService",
  async ({ serviceId, serviceData }, { rejectWithValue }) => {
    try {
      const response = await servicesService.updateService(serviceId, serviceData);
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response?.data || error.message);
    }
  }
);

export const deleteService = createAsyncThunk(
  "services/deleteService",
  async (serviceId, { rejectWithValue }) => {
    try {
      const response = await servicesService.deleteService(serviceId);
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response?.data || error.message);
    }
  }
);

const initialState = {
  servicesList: null,
  serviceDetail: null,
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

const servicesSlice = createSlice({
  name: "services",
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
        // Handle both direct data and nested data structure
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
      });
  },
});

export const { setFilters, resetFilters, setPagination, clearError } = servicesSlice.actions;
export default servicesSlice.reducer;

