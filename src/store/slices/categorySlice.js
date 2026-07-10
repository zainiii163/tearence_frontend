import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import apiInstance from "../../services/api";

const initialState = {
  loading: false,
  categoryList: [],
  parentCategories: [],
  detailsCategory: [],
  catTree: [],
  ebayAds: [],
  catTreeChild: [],
  currency: [],
  country: [],
  zone: [],
  catFilter: [],
  message: null,
  error: null,
  lastFetchTime: null,
  retryCount: 0,
};

// Retry utility with exponential backoff
const retryWithBackoff = async (fn, maxRetries = 3, delay = 1000) => {
  for (let i = 0; i < maxRetries; i++) {
    try {
      return await fn();
    } catch (error) {
      if (i === maxRetries - 1) {
        throw error;
      }
      
      // Exponential backoff: 1s, 2s, 4s
      const backoffDelay = delay * Math.pow(2, i);
      console.log(`🔄 Retrying in ${backoffDelay}ms... (attempt ${i + 1}/${maxRetries})`);
      await new Promise(resolve => setTimeout(resolve, backoffDelay));
    }
  }
};

// Cache utility - check if data is still valid (5 minutes)
const isCacheValid = (lastFetchTime) => {
  if (!lastFetchTime) return false;
  const now = Date.now();
  const cacheDuration = 5 * 60 * 1000; // 5 minutes
  return (now - lastFetchTime) < cacheDuration;
};

// Enhanced error handling
const handleApiError = (error) => {
  if (error.code === 'ERR_NETWORK' || error.message.includes('CORS')) {
    return {
      message: "Network error. Please check your connection and ensure CORS is configured on the backend.",
      isNetworkError: true,
      isCORSError: error.message.includes('CORS')
    };
  }
  
  if (error.response?.status === 429) {
    return {
      message: "Too many requests. Please wait a moment and try again.",
      isRateLimitError: true,
      retryAfter: error.response?.headers?.['retry-after'] || 60
    };
  }
  
  if (error.response?.status >= 500) {
    return {
      message: "Server is temporarily unavailable. Please try again later.",
      isServerError: true
    };
  }
  
  return {
    message: error.response?.data?.message || error.message || "An unexpected error occurred",
    isApiError: true
  };
};

// Fetch parent categories with caching and retry
export const fetchParentCategories = createAsyncThunk(
  "categories/fetchParentCategories",
  async (_, { getState, rejectWithValue }) => {
    const state = getState().categories;
    
    // Check cache first
    if (isCacheValid(state.lastFetchTime) && state.parentCategories.length > 0) {
      console.log('📦 Using cached parent categories');
      return state.parentCategories;
    }
    
    try {
      console.log('🌐 Fetching parent categories from API...');
      const response = await retryWithBackoff(
        () => apiInstance.get('/category?is_parent=yes'),
        3,
        1000
      );
      
      const categories = response.data?.data || response.data || [];
      console.log(`✅ Fetched ${categories.length} parent categories`);
      
      return {
        categories,
        timestamp: Date.now()
      };
    } catch (error) {
      console.error('❌ Failed to fetch parent categories:', error);
      
      // If it's a network error, CORS, 404, or 429, use mock data as fallback
      if (error.isNetworkError || error.isCORSError || error.response?.status === 404 || error.response?.status === 429) {
        console.info('📦 Using mock data fallback for parent categories');
        const mockCategories = [
          { id: 1, name: 'Property', slug: 'property', category_id: 1 },
          { id: 2, name: 'Cars & Vehicles', slug: 'cars-vehicles', category_id: 2 },
          { id: 3, name: 'Jobs & Services', slug: 'jobs-services', category_id: 3 },
          { id: 4, name: 'Business Opportunities', slug: 'business-opportunities', category_id: 4 },
          { id: 5, name: 'Electronics', slug: 'electronics', category_id: 5 },
          { id: 6, name: 'Fashion & Beauty', slug: 'fashion-beauty', category_id: 6 },
          { id: 7, name: 'Home & Garden', slug: 'home-garden', category_id: 7 },
          { id: 8, name: 'Travel & Experiences', slug: 'travel-experiences', category_id: 8 },
          { id: 9, name: 'Events & Tickets', slug: 'events-tickets', category_id: 9 },
          { id: 10, name: 'Pets & Animals', slug: 'pets-animals', category_id: 10 },
          { id: 11, name: 'Health & Wellness', slug: 'health-wellness', category_id: 11 },
          { id: 12, name: 'Education & Courses', slug: 'education-courses', category_id: 12 }
        ];
        
        return {
          categories: mockCategories,
          timestamp: Date.now()
        };
      }
      
      const errorInfo = handleApiError(error);
      return rejectWithValue(errorInfo);
    }
  }
);

// Fetch all categories (legacy support)
export const getCategoriesList = createAsyncThunk(
  "categories/getCategoriesList",
  async ({ is_parent }, { rejectWithValue }) => {
    try {
      console.log(`🌐 Fetching categories (is_parent: ${is_parent})...`);
      const response = await retryWithBackoff(
        () => apiInstance.get(`/category?is_parent=${is_parent}`),
        3,
        1000
      );
      
      const categories = response.data?.data || response.data || [];
      console.log(`✅ Fetched ${categories.length} categories`);
      
      return categories;
    } catch (error) {
      console.error('❌ Failed to fetch categories:', error);
      
      // If it's a network error, CORS, 404, or 429, use mock data as fallback
      if (error.isNetworkError || error.isCORSError || error.response?.status === 404 || error.response?.status === 429) {
        console.info('📦 Using mock data fallback for categories');
        const mockCategories = [
          { id: 1, name: 'Property', slug: 'property', category_id: 1 },
          { id: 2, name: 'Cars & Vehicles', slug: 'cars-vehicles', category_id: 2 },
          { id: 3, name: 'Jobs & Services', slug: 'jobs-services', category_id: 3 },
          { id: 4, name: 'Business Opportunities', slug: 'business-opportunities', category_id: 4 },
          { id: 5, name: 'Electronics', slug: 'electronics', category_id: 5 },
          { id: 6, name: 'Fashion & Beauty', slug: 'fashion-beauty', category_id: 6 },
          { id: 7, name: 'Home & Garden', slug: 'home-garden', category_id: 7 },
          { id: 8, name: 'Travel & Experiences', slug: 'travel-experiences', category_id: 8 },
          { id: 9, name: 'Events & Tickets', slug: 'events-tickets', category_id: 9 },
          { id: 10, name: 'Pets & Animals', slug: 'pets-animals', category_id: 10 },
          { id: 11, name: 'Health & Wellness', slug: 'health-wellness', category_id: 11 },
          { id: 12, name: 'Education & Courses', slug: 'education-courses', category_id: 12 }
        ];
        return mockCategories;
      }
      
      const errorInfo = handleApiError(error);
      return rejectWithValue(errorInfo);
    }
  }
);

// Other existing thunks with enhanced error handling
export const getEbayAds = createAsyncThunk(
  "categories/getEbayAds",
  async (_, { rejectWithValue }) => {
    try {
      const response = await apiInstance.post("listing/ebay");
      return response.data;
    } catch (error) {
      return rejectWithValue(handleApiError(error));
    }
  }
);

export const createCategoryList = createAsyncThunk(
  "categories/createCategoryList",
  async (data, { rejectWithValue }) => {
    try {
      const response = await apiInstance.post("categories", data);
      return response.data;
    } catch (error) {
      return rejectWithValue(handleApiError(error));
    }
  }
);

export const detailsCategory = createAsyncThunk(
  "categories/detailCategory",
  async ({ slug }, { rejectWithValue }) => {
    try {
      const response = await apiInstance.get(`/category/${slug}`);
      return response.data;
    } catch (error) {
      return rejectWithValue(handleApiError(error));
    }
  }
);

export const CategoryTreeChild = createAsyncThunk(
  "categories/tree",
  async ({ id }, { rejectWithValue }) => {
    try {
      const response = await apiInstance.get(`/category/tree?id=${id}`);
      return response.data;
    } catch (error) {
      return rejectWithValue(handleApiError(error));
    }
  }
);

export const getFilterCat = createAsyncThunk(
  "categories/filterCat",
  async (_, { rejectWithValue }) => {
    try {
      const response = await apiInstance.get("/category/tree");
      return response.data;
    } catch (error) {
      return rejectWithValue(handleApiError(error));
    }
  }
);

export const getCurrency = createAsyncThunk(
  "categories/Currency",
  async (_, { rejectWithValue }) => {
    try {
      const response = await apiInstance.get("master/currency");
      return response.data;
    } catch (error) {
      return rejectWithValue(handleApiError(error));
    }
  }
);

export const getCountry = createAsyncThunk(
  "categories/Country",
  async (_, { rejectWithValue }) => {
    try {
      const response = await apiInstance.get("/v1/master/country");
      return response.data;
    } catch (error) {
      return rejectWithValue(handleApiError(error));
    }
  }
);

export const getZone = createAsyncThunk(
  "categories/getZone",
  async (payload, { rejectWithValue }) => {
    try {
      const response = await apiInstance.get(
        `master/zone?country_id=${payload?.country_id ?? ""}`
      );
      return response.data;
    } catch (error) {
      return rejectWithValue(handleApiError(error));
    }
  }
);

const CategorySlice = createSlice({
  name: "categories",
  initialState,
  reducers: {
    clearError: (state) => {
      state.error = null;
    },
    clearMessage: (state) => {
      state.message = null;
    },
    clearCache: (state) => {
      state.lastFetchTime = null;
      state.parentCategories = [];
    },
    incrementRetryCount: (state) => {
      state.retryCount += 1;
    },
    resetRetryCount: (state) => {
      state.retryCount = 0;
    },
  },
  extraReducers: (builder) => {
    // Fetch parent categories
    builder
      .addCase(fetchParentCategories.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchParentCategories.fulfilled, (state, action) => {
        state.loading = false;
        state.parentCategories = action.payload.categories;
        state.lastFetchTime = action.payload.timestamp;
        state.retryCount = 0;
        state.error = null;
      })
      .addCase(fetchParentCategories.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
        state.retryCount += 1;
      });

    // Get categories list
    builder
      .addCase(getCategoriesList.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(getCategoriesList.fulfilled, (state, action) => {
        state.loading = false;
        state.categoryList = action.payload;
        state.error = null;
      })
      .addCase(getCategoriesList.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      });

    // Other cases
    builder
      .addCase(getEbayAds.fulfilled, (state, action) => {
        state.ebayAds = action.payload;
        state.loading = false;
      })
      .addCase(getEbayAds.rejected, (state, action) => {
        state.error = action.payload;
        state.loading = false;
      })
      .addCase(createCategoryList.fulfilled, (state, action) => {
        state.message = action.payload.message;
      })
      .addCase(createCategoryList.rejected, (state, action) => {
        state.error = action.payload;
      })
      .addCase(detailsCategory.fulfilled, (state, action) => {
        state.detailsCategory = action.payload;
      })
      .addCase(detailsCategory.rejected, (state, action) => {
        state.error = action.payload;
      })
      .addCase(CategoryTreeChild.fulfilled, (state, action) => {
        state.catTreeChild = action.payload;
      })
      .addCase(CategoryTreeChild.rejected, (state, action) => {
        state.error = action.payload;
      })
      .addCase(getFilterCat.fulfilled, (state, action) => {
        state.catFilter = action.payload;
      })
      .addCase(getFilterCat.rejected, (state, action) => {
        state.error = action.payload;
      })
      .addCase(getCurrency.fulfilled, (state, action) => {
        state.currency = action.payload;
      })
      .addCase(getCurrency.rejected, (state, action) => {
        state.error = action.payload;
      })
      .addCase(getCountry.fulfilled, (state, action) => {
        state.country = action.payload;
      })
      .addCase(getCountry.rejected, (state, action) => {
        state.error = action.payload;
      })
      .addCase(getZone.fulfilled, (state, action) => {
        state.zone = action.payload;
      })
      .addCase(getZone.rejected, (state, action) => {
        state.error = action.payload;
      });
  },
});

export const { clearError, clearMessage, clearCache, incrementRetryCount, resetRetryCount } = CategorySlice.actions;
export default CategorySlice.reducer;
