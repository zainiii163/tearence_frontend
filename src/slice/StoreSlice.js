import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import StoreServices from "../services/StoreServices";

const initialState = {
  loading: false,
  storeAds: [],
  storeDetail: {},
  businessStore: {},
  businessList: {},
  storeMembers: {},
  businessMembers: {},
  message: null,
  error: null,
};

export const getStore = createAsyncThunk(
  "store/getStore",
  async ({ customer_id }) => {
    if (customer_id) {
      const res = await StoreServices.getStore(customer_id);
      return res.data;
    } else {
      const res = await StoreServices.getMyStore();
      return res.data;
    }
  }
);

export const getStoreMembers = createAsyncThunk(
  "store/getStoreMembers",
  async (storeId) => {
    const res = await StoreServices.getStoreMembers(storeId);
    return res.data;
  }
);

export const addStoreMember = createAsyncThunk(
  "store/addStoreMember",
  async ({ storeId, payload }) => {
    const res = await StoreServices.addStoreMember(storeId, payload);
    return res.data;
  }
);

export const updateStoreMember = createAsyncThunk(
  "store/updateStoreMember",
  async ({ storeId, memberId, payload }) => {
    const res = await StoreServices.updateStoreMember(storeId, memberId, payload);
    return res.data;
  }
);

export const removeStoreMember = createAsyncThunk(
  "store/removeStoreMember",
  async ({ storeId, memberId }) => {
    const res = await StoreServices.removeStoreMember(storeId, memberId);
    return res.data;
  }
);

export const getStoreBySlug = createAsyncThunk(
  "store/getStoreBySlug",
  async ({ slug }) => {
    const res = await StoreServices.getStoreBySlug(slug);
    return res.data;
  }
);

export const getStoreAds = createAsyncThunk(
  "store/getStoreAds",
  async ({ customer_id, skip, limit }) => {
    const res = await StoreServices.getStoreAds(customer_id, skip, limit);
    return res.data;
  }
);

export const updateStore = createAsyncThunk(
  "store/updateStore",
  async ({ store_id, payload }) => {
    const res = await StoreServices.updateStore(store_id, payload);
    return res.data;
  }
);
export const createStore = createAsyncThunk(
  "store/createStore",
  async (payload) => {
    const res = await StoreServices.createStore(payload);
    return res.data;
  }
);
export const getBusinessStore = createAsyncThunk(
  "store/getBusinessStore",
  async ({ customer_id }, { rejectWithValue }) => {
    try {
      if (customer_id) {
        const res = await StoreServices.getBusinessStore(customer_id);
        return res.data;
      }
      const res = await StoreServices.getMyBusinessStore();
      return res.data;
    } catch (error) {
      // Handle 404 as valid state (no business exists yet)
      if (error?.response?.status === 404) {
        return rejectWithValue({ status: 404, message: "Business not found", isNotFound: true });
      }
      return rejectWithValue(error?.response?.data || { message: error?.message || "Failed to fetch business" });
    }
  }
);
export const getBusinessStoreBySlug = createAsyncThunk(
  "store/getBusinessStoreBySlug",
  async ({ slug }, { rejectWithValue }) => {
    try {
      const res = await StoreServices.getBusinessStoreBySlug(slug);
      return res.data;
    } catch (error) {
      // Handle 404 as valid state (business doesn't exist)
      if (error?.response?.status === 404) {
        return rejectWithValue({ status: 404, message: "Business not found", isNotFound: true });
      }
      return rejectWithValue(error?.response?.data || { message: error?.message || "Failed to fetch business" });
    }
  }
);
export const updateBusinessStore = createAsyncThunk(
  "store/updateBusinessStore",
  async ({ business_id, payload }) => {
    const res = await StoreServices.updateBusinessStore(business_id, payload);
    return res.data;
  }
);
export const createBusinessStore = createAsyncThunk(
  "store/createBusinessStore",
  async (payload) => {
    const res = await StoreServices.createBusinessStore(payload);
    return res.data;
  }
);

export const getBusinessMembers = createAsyncThunk(
  "store/getBusinessMembers",
  async (businessId, { rejectWithValue }) => {
    // Don't make API call if businessId is invalid
    if (!businessId || businessId === 1) {
      return rejectWithValue({ status: 404, message: "Invalid business ID", isNotFound: true });
    }
    try {
      const res = await StoreServices.getBusinessMembers(businessId);
      return res.data;
    } catch (error) {
      // Handle 404 as valid state (members not found or business doesn't exist)
      if (error?.response?.status === 404) {
        return rejectWithValue({ status: 404, message: "Business members not found", isNotFound: true });
      }
      return rejectWithValue(error?.response?.data || { message: error?.message || "Failed to fetch business members" });
    }
  }
);

export const addBusinessMember = createAsyncThunk(
  "store/addBusinessMember",
  async ({ businessId, payload }) => {
    const res = await StoreServices.addBusinessMember(businessId, payload);
    return res.data;
  }
);

export const updateBusinessMember = createAsyncThunk(
  "store/updateBusinessMember",
  async ({ businessId, memberId, payload }) => {
    const res = await StoreServices.updateBusinessMember(businessId, memberId, payload);
    return res.data;
  }
);

export const removeBusinessMember = createAsyncThunk(
  "store/removeBusinessMember",
  async ({ businessId, memberId }) => {
    const res = await StoreServices.removeBusinessMember(businessId, memberId);
    return res.data;
  }
);

export const getBusinessList = createAsyncThunk(
  "store/getBusinessList",
  async (params = {}) => {
    const res = await StoreServices.getBusinessList(params);
    return res.data;
  }
);

export const getStoreList = createAsyncThunk(
  "store/getStoreList",
  async (params = {}) => {
    const res = await StoreServices.getStoreList(params);
    return res.data;
  }
);
const handleError = (state, action) => {
  const errorData = action.payload || {};
  const isNotFound = errorData.isNotFound || errorData.status === 404;
  
  // Only log errors that are not "not found" scenarios (which are valid states)
  if (!isNotFound) {
    console.error(action.error?.message || errorData?.message, action.error || errorData);
  }
  
  // Only set error state for actual errors, not "not found" scenarios
  if (!isNotFound) {
    state.error = action.error?.message || errorData?.message;
  } else {
    // Clear error for not found scenarios
    state.error = null;
  }
  
  state.loading = false;

  if (action.type?.startsWith("store/getStore/") && !action.type.includes("Members")) {
    state.storeDetail = {};
  }

  if (action.type?.startsWith("store/getBusinessStore/")) {
    state.businessStore = {};
  }
  
  if (action.type?.startsWith("store/getBusinessMembers/")) {
    // Clear business members on error (including not found)
    state.businessMembers = {};
  }
};

const PackageSlice = createSlice({
  name: "store",
  initialState,
  reducers: {
    redirectFalse: (state) => {
      state.loading = false;
      state.redirect = false;
    },
    clearAdsErrorAndMessage: (state) => {
      state.error = null;
      state.message = null;
    },
  },
  extraReducers: (builder) => {
    builder
      // Get Store
      .addCase(getStore.pending, (state) => {
        state.loading = true;
      })
      .addCase(getStore.fulfilled, (state, action) => {
        state.storeDetail = action.payload;
        state.loading = false;
      })
      .addCase(getStore.rejected, handleError)

      // Get Store Members
      .addCase(getStoreMembers.fulfilled, (state, action) => {
        state.storeMembers = action.payload;
      })
      .addCase(getStoreMembers.rejected, handleError)

      // Add Store Member
      .addCase(addStoreMember.fulfilled, (state, action) => {
        state.message = action.payload.message;
      })
      .addCase(addStoreMember.rejected, handleError)

      // Update Store Member
      .addCase(updateStoreMember.fulfilled, (state, action) => {
        state.message = action.payload.message;
      })
      .addCase(updateStoreMember.rejected, handleError)

      // Remove Store Member
      .addCase(removeStoreMember.fulfilled, (state, action) => {
        state.message = action.payload.message;
      })
      .addCase(removeStoreMember.rejected, handleError)

      // Get Store By Slug
      .addCase(getStoreBySlug.pending, (state) => {
        state.loading = true;
      })
      .addCase(getStoreBySlug.fulfilled, (state, action) => {
        state.storeDetail = action.payload;
        state.loading = false;
      })
      .addCase(getStoreBySlug.rejected, handleError)

      // Get Store Ads
      .addCase(getStoreAds.pending, (state) => {
        state.loading = true;
      })
      .addCase(getStoreAds.fulfilled, (state, action) => {
        state.storeAds = action.payload;
        state.loading = false;
      })
      .addCase(getStoreAds.rejected, handleError)

      // Update Store
      .addCase(updateStore.fulfilled, (state, action) => {
        state.message = action.payload.message;
        state.loading = false;
      })
      .addCase(updateStore.rejected, handleError)

      // Create Store
      .addCase(createStore.pending, (state) => {
        state.loading = true;
      })
      .addCase(createStore.fulfilled, (state) => {
        state.loading = false;
      })
      .addCase(createStore.rejected, handleError)

      // Get Business Store
      .addCase(getBusinessStore.pending, (state) => {
        state.loading = true;
      })
      .addCase(getBusinessStore.fulfilled, (state, action) => {
        state.loading = false;
        state.businessStore = action.payload;
      })
      .addCase(getBusinessStore.rejected, handleError)

      // Get Business Store By Slug
      .addCase(getBusinessStoreBySlug.pending, (state) => {
        state.loading = true;
      })
      .addCase(getBusinessStoreBySlug.fulfilled, (state, action) => {
        state.loading = false;
        state.businessStore = action.payload;
      })
      .addCase(getBusinessStoreBySlug.rejected, handleError)

      // Update Business Store
      .addCase(updateBusinessStore.pending, (state) => {
        state.loading = true;
      })
      .addCase(updateBusinessStore.fulfilled, (state) => {
        state.loading = false;
      })
      .addCase(updateBusinessStore.rejected, handleError)

      // Create Business Store
      .addCase(createBusinessStore.pending, (state) => {
        state.loading = true;
      })
      .addCase(createBusinessStore.fulfilled, (state) => {
        state.loading = false;
      })
      .addCase(createBusinessStore.rejected, handleError)

      // Get Business Members
      .addCase(getBusinessMembers.fulfilled, (state, action) => {
        state.businessMembers = action.payload;
      })
      .addCase(getBusinessMembers.rejected, handleError)

      // Add Business Member
      .addCase(addBusinessMember.fulfilled, (state, action) => {
        state.message = action.payload.message;
      })
      .addCase(addBusinessMember.rejected, handleError)

      // Update Business Member
      .addCase(updateBusinessMember.fulfilled, (state, action) => {
        state.message = action.payload.message;
      })
      .addCase(updateBusinessMember.rejected, handleError)

      // Remove Business Member
      .addCase(removeBusinessMember.fulfilled, (state, action) => {
        state.message = action.payload.message;
      })
      .addCase(removeBusinessMember.rejected, handleError)

      // Get Business List
      .addCase(getBusinessList.pending, (state) => {
        state.loading = true;
      })
      .addCase(getBusinessList.fulfilled, (state, action) => {
        state.businessList = action.payload;
        state.loading = false;
      })
      .addCase(getBusinessList.rejected, handleError)

      // Get Store List
      .addCase(getStoreList.pending, (state) => {
        state.loading = true;
      })
      .addCase(getStoreList.fulfilled, (state, action) => {
        state.businessList = action.payload;
        state.loading = false;
      })
      .addCase(getStoreList.rejected, handleError);
  },
});

export const { clearAdsErrorAndMessage, redirectFalse } = PackageSlice.actions;

const { reducer } = PackageSlice;
export default reducer;
