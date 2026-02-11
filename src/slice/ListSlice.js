import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import ListServices from "../services/ListServices";

const initialState = {
  loading: false,
  adsList: [],
  adsListSlide: [],
  catAdsList: [],
  detailsAds: [],
  updateAds: [],
  newAds: [],
  newAdsSlide: [],
  promotedAds: [],
  promotedAdsSlide: [],
  favouriteAds: [],
  favouriteAdsSlide: [],
  favouriteAdsDetail: [],
  globalSearch: [],
  myAds: [],
  blog: [],
  blogDetails: [],
  classified: [],
  message: null,
  error: null,
};

export const getAdsList = createAsyncThunk(
  "ads/getAdsList",
  async ({ category, skip, limit }) => {
    const res = await ListServices.getAdsList(category, skip, limit);
    return res.data;
  }
);

export const getAdsListFilter = createAsyncThunk(
  "ads/getAdsListFilter",
  async ({ category, skip, limit, currencies, max_price, min_price }) => {
    const res = await ListServices.getAdsListFilterApi(
      category,
      skip,
      limit,
      currencies,
      max_price,
      min_price
    );
    return res.data;
  }
);

export const createAdsList = createAsyncThunk(
  "ads/createAdsList",
  async ({ formData, user = null, businessStore = null, storeDetail = null, isAdmin = false }) => {
    const res = await ListServices.createAdsList(formData, user, businessStore, storeDetail, isAdmin);
    return res;
  }
);
export const updateAds = createAsyncThunk(
  "ads/updateAds",
  async ({ adsId, formData }) => {
    const res = await ListServices.updateAds(adsId, formData);
    return res;
  }
);
export const deleteAds = createAsyncThunk("ads/deleteAds", async (adsId) => {
  const res = await ListServices.deleteAds(adsId);
  return res;
});

export const detailsAdsList = createAsyncThunk(
  "ads/detailList",
  async ({ slug }) => {
    const res = await ListServices.detailsAdsList(slug);
    return res.data;
  }
);
export const updateFavAdsList = createAsyncThunk(
  "ads/updateFavAdsList",
  async ({ id }) => {
    const res = await ListServices.updateFavAdsList(id);
    return res.data;
  }
);
export const removeFabAds = createAsyncThunk(
  "ads/removeFavAds",
  async ({ id }) => {
    const res = await ListServices.removeFabAds(id);
    return res.data;
  }
);

export const getFeaturedAds = createAsyncThunk(
  "ads/getFeaturedAds",
  async ({ skip, limit }) => {
    const res = await ListServices.getFeaturedAds(skip, limit);
    return res.data;
  }
);
export const getFeaturedAdsSlide = createAsyncThunk(
  "ads/getFeaturedAdsSlide",
  async ({ skip, limit }) => {
    const res = await ListServices.getFeaturedAdsSlide(skip, limit);
    return res.data;
  }
);

export const getNewAds = createAsyncThunk(
  "ads/getNewAds",
  async ({ skip, limit }) => {
    const res = await ListServices.getNewAds(skip, limit);
    return res.data;
  }
);

export const getNewAdsSlide = createAsyncThunk(
  "ads/getNewAdsSlide",
  async ({ skip, limit }) => {
    const res = await ListServices.getNewAdsSlide(skip, limit);
    return res.data;
  }
);

export const getPromotedAds = createAsyncThunk(
  "ads/getPromotedAds",
  async ({ skip, limit }) => {
    const res = await ListServices.getPromotedAds(skip, limit);
    return res.data;
  }
);
export const getPromotedAdsSlide = createAsyncThunk(
  "ads/getPromotedAdsSlide",
  async ({ skip, limit }) => {
    const res = await ListServices.getPromotedAdsSlide(skip, limit);
    return res.data;
  }
);

export const getFavouriteAds = createAsyncThunk(
  "ads/favorite",
  async ({ skip, limit, id } = {}) => {
    // prefer explicit id, fall back to stored customer_id
    const customerId = id || localStorage.getItem('customer_id') || null;
    const res = await ListServices.getFavouriteAds(skip, limit, customerId);
    return res.data;
  }
);
export const getFavouriteAdsDetail = createAsyncThunk(
  "ads/favoriteDetail",
  async ({ id }) => {
    const res = await ListServices.getFavouriteAdsDetail(id);
    return res.data;
  }
);
export const getMyAds = createAsyncThunk(
  "ads/myads",
  async ({ id, skip, limit, status }) => {
    const res = await ListServices.getMyAds(id, skip, limit, status);
    return res.data;
  }
);
export const creatFavouriteAds = createAsyncThunk(
  "ads/createFavouriteAds",
  async ({ data }) => {
    const res = await ListServices.creatFavouriteAds(data);
    return res.data;
  }
);
export const getClassified = createAsyncThunk("ads/getClassified", async () => {
  const res = await ListServices.getClassified();
  return res.data;
});

// Adapter thunks for ModernCategoryPage - normalize params and responses
export const getPromotedAdsModern = createAsyncThunk(
  "ads/getPromotedAdsModern",
  async (params = {}) => {
    const { page = 1, per_page = 20 } = params;
    const skip = (page - 1) * per_page;
    const limit = per_page;
    const res = await ListServices.getPromotedAds(skip, limit);
    // Normalize response format: ensure { items, total }
    const data = res.data?.data || res.data || {};
    return {
      items: data.items || data.data?.items || [],
      total: data.total || data.data?.total || 0,
    };
  }
);

export const getFeaturedAdsModern = createAsyncThunk(
  "ads/getFeaturedAdsModern",
  async (params = {}) => {
    const { page = 1, per_page = 20 } = params;
    const skip = (page - 1) * per_page;
    const limit = per_page;
    const res = await ListServices.getFeaturedAds(skip, limit);
    const data = res.data?.data || res.data || {};
    return {
      items: data.items || data.data?.items || [],
      total: data.total || data.data?.total || 0,
    };
  }
);

export const getNewAdsModern = createAsyncThunk(
  "ads/getNewAdsModern",
  async (params = {}) => {
    const { page = 1, per_page = 20 } = params;
    const skip = (page - 1) * per_page;
    const limit = per_page;
    const res = await ListServices.getNewAds(skip, limit);
    const data = res.data?.data || res.data || {};
    return {
      items: data.items || data.data?.items || [],
      total: data.total || data.data?.total || 0,
    };
  }
);

export const getClassifiedAdsModern = createAsyncThunk(
  "ads/getClassifiedAdsModern",
  async (params = {}) => {
    const { page = 1, per_page = 20, category } = params;
    const skip = (page - 1) * per_page;
    const limit = per_page;
    // Use getAdsList with classified category filter
    const categorySlug = category || "classified";
    const res = await ListServices.getAdsList(categorySlug, skip, limit);
    const data = res.data?.data || res.data || {};
    return {
      items: data.items || [],
      total: data.total || 0,
    };
  }
);

export const getAffiliateAdsModern = createAsyncThunk(
  "ads/getAffiliateAdsModern",
  async (params = {}) => {
    const { page = 1, per_page = 20 } = params;
    const skip = (page - 1) * per_page;
    const limit = per_page;
    const res = await ListServices.getAffiliateAds(skip, limit);
    const data = res.data?.data || res.data || {};
    return {
      items: data.items || data || [],
      total: data.total || 0,
    };
  }
);

export const getPropertyAdsModern = createAsyncThunk(
  "ads/getPropertyAdsModern",
  async (params = {}) => {
    const { page = 1, per_page = 20, category } = params;
    const skip = (page - 1) * per_page;
    const limit = per_page;
    const categorySlug = category || "property";
    const res = await ListServices.getAdsList(categorySlug, skip, limit);
    const data = res.data?.data || res.data || {};
    return {
      items: data.items || [],
      total: data.total || 0,
    };
  }
);

export const getBusinessAdsModern = createAsyncThunk(
  "ads/getBusinessAdsModern",
  async (params = {}) => {
    const { page = 1, per_page = 20, category } = params;
    const skip = (page - 1) * per_page;
    const limit = per_page;
    const categorySlug = category || "business";
    const res = await ListServices.getAdsList(categorySlug, skip, limit);
    const data = res.data?.data || res.data || {};
    return {
      items: data.items || [],
      total: data.total || 0,
    };
  }
);

export const getGlobalSearch = createAsyncThunk(
  "ads/getGlobalSearch",
  async ({ searchData }) => {
    const res = await ListServices.getGlobalSearch(searchData);
    return res.data;
  }
);
export const getBlog = createAsyncThunk(
  "ads/getBlog",
  async ({ skip, limit }) => {
    const res = await ListServices.getBlog(skip, limit);
    return res.data;
  }
);
export const getBlogDetails = createAsyncThunk(
  "ads/getBlogDetails",
  async ({ id }) => {
    const res = await ListServices.getBlogDetails(id);
    return res.data;
  }
);

const handleError = (state, action) => {
  state.error = action.error.message;
  state.loading = false;
};

const ListSlice = createSlice({
  name: "ads",
  initialState,
  reducers: {
    redirectFalse: (state) => {
      state.redirect = false;
    },
    clearAdsErrorAndMessage: (state) => {
      state.error = null;
      state.message = null;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(getAdsList.pending, (state) => {
        state.loading = true;
      })
      .addCase(getAdsList.fulfilled, (state, action) => {
        state.catAdsList = action.payload;
      })
      .addCase(getAdsList.rejected, handleError)
      .addCase(createAdsList.fulfilled, (state, action) => {
        state.message = action.payload.message;
      })
      .addCase(createAdsList.rejected, handleError)
      .addCase(updateAds.fulfilled, (state, action) => {
        state.message = action.payload.message;
      })
      .addCase(updateAds.rejected, handleError)
      .addCase(deleteAds.fulfilled, (state, action) => {
        state.message = action.payload.message;
      })
      .addCase(deleteAds.rejected, handleError)
      .addCase(getFeaturedAds.fulfilled, (state, action) => {
        state.adsList = action.payload;
      })
      .addCase(getFeaturedAds.rejected, handleError)
      .addCase(getFeaturedAdsSlide.fulfilled, (state, action) => {
        state.adsListSlide = action.payload;
      })
      .addCase(getFeaturedAdsSlide.rejected, handleError)
      .addCase(getNewAds.fulfilled, (state, action) => {
        state.newAds = action.payload;
      })
      .addCase(getNewAds.rejected, handleError)
      .addCase(getNewAdsSlide.fulfilled, (state, action) => {
        state.newAdsSlide = action.payload;
      })
      .addCase(getNewAdsSlide.rejected, handleError)
      .addCase(getPromotedAds.fulfilled, (state, action) => {
        state.promotedAds = action.payload;
      })
      .addCase(getPromotedAds.rejected, handleError)
      .addCase(getPromotedAdsSlide.fulfilled, (state, action) => {
        state.promotedAdsSlide = action.payload;
      })
      .addCase(getPromotedAdsSlide.rejected, handleError)
      .addCase(getFavouriteAds.fulfilled, (state, action) => {
        state.favouriteAds = action.payload;
      })
      .addCase(getFavouriteAds.rejected, handleError)
      .addCase(getFavouriteAdsDetail.fulfilled, (state, action) => {
        state.favouriteAdsDetail = action.payload;
      })
      .addCase(getFavouriteAdsDetail.rejected, handleError)
      .addCase(getMyAds.fulfilled, (state, action) => {
        state.myAds = action.payload;
      })
      .addCase(getMyAds.rejected, handleError)
      .addCase(creatFavouriteAds.fulfilled, (state, action) => {
        state.favouriteAds = action.payload;
      })
      .addCase(creatFavouriteAds.rejected, handleError)
      .addCase(updateFavAdsList.fulfilled, (state, action) => {
        state.favouriteAds = action.payload;
      })
      .addCase(updateFavAdsList.rejected, handleError)
      .addCase(detailsAdsList.fulfilled, (state, action) => {
        state.detailsAds = action.payload;
      })
      .addCase(detailsAdsList.rejected, handleError)
      .addCase(removeFabAds.fulfilled, (state, action) => {
        // Keep message for any UI toast
        state.message = action.payload?.message || null;

        // Extract deleted favorite record from response. API may return
        // { message, data: { ... } } or the object directly, so handle both.
        const deleted = (action.payload && (action.payload.data || action.payload)) || null;

        // Helper to get ids in a resilient way
        const getFavId = (obj) => obj?.favorite_id || obj?.id || obj?.favoriteId || null;
        const getListingId = (obj) => obj?.listing_id || obj?.listingId || null;

        // If favouriteAds is present, it may be one of several shapes:
        // 1) { items: [...], total: N }
        // 2) { data: { items: [...], total: N } }
        // 3) an array [...]
        if (state.favouriteAds) {
          const favId = getFavId(deleted);
          const listingId = getListingId(deleted);

          // Helper to test & filter an items array
          const filterItems = (items) =>
            items.filter((item) => {
              const itemFavId = getFavId(item);
              const itemListingId = getListingId(item);
              if (favId && itemFavId) return itemFavId !== favId;
              if (listingId && itemListingId) return itemListingId !== listingId;
              return true; // keep if we can't match
            });

          // Case: top-level items array
          if (Array.isArray(state.favouriteAds.items)) {
            state.favouriteAds.items = filterItems(state.favouriteAds.items);
            if (typeof state.favouriteAds.total === 'number') {
              state.favouriteAds.total = Math.max(0, state.favouriteAds.total - 1);
            }
          }

          // Case: nested under data.items
          else if (state.favouriteAds.data && Array.isArray(state.favouriteAds.data.items)) {
            state.favouriteAds.data.items = filterItems(state.favouriteAds.data.items);
            if (typeof state.favouriteAds.data.total === 'number') {
              state.favouriteAds.data.total = Math.max(0, state.favouriteAds.data.total - 1);
            }
          }

          // Case: favouriteAds itself is an array (legacy)
          else if (Array.isArray(state.favouriteAds)) {
            state.favouriteAds = filterItems(state.favouriteAds);
          }
        }
      })
      .addCase(removeFabAds.rejected, handleError)
      .addCase(getAdsListFilter.pending, (state, action) => {
        state.catAdsList = action.payload;
      })
      .addCase(getAdsListFilter.fulfilled, (state, action) => {
        state.catAdsList = action.payload;
      })
      .addCase(getAdsListFilter.rejected, handleError)
      .addCase(getClassified.fulfilled, (state, action) => {
        state.classified = action.payload;
      })
      .addCase(getClassified.rejected, handleError)
      .addCase(getGlobalSearch.pending, (state, action) => {
        state.loading = true;
      })
      .addCase(getGlobalSearch.fulfilled, (state, action) => {
        state.globalSearch = action.payload;
        state.loading = false;
      })
      .addCase(getGlobalSearch.rejected, handleError)
      .addCase(getBlog.fulfilled, (state, action) => {
        state.blog = action.payload;
      })
      .addCase(getBlog.rejected, handleError)
      .addCase(getBlogDetails.fulfilled, (state, action) => {
        state.blogDetails = action.payload;
      })
      .addCase(getBlogDetails.rejected, handleError)
      .addCase(getPromotedAdsModern.pending, (state) => {
        state.loading = true;
      })
      .addCase(getPromotedAdsModern.fulfilled, (state, action) => {
        state.promotedAds = { data: action.payload };
        state.loading = false;
      })
      .addCase(getPromotedAdsModern.rejected, handleError)
      .addCase(getFeaturedAdsModern.pending, (state) => {
        state.loading = true;
      })
      .addCase(getFeaturedAdsModern.fulfilled, (state, action) => {
        state.adsList = { data: action.payload };
        state.loading = false;
      })
      .addCase(getFeaturedAdsModern.rejected, handleError)
      .addCase(getNewAdsModern.pending, (state) => {
        state.loading = true;
      })
      .addCase(getNewAdsModern.fulfilled, (state, action) => {
        state.newAds = { data: action.payload };
        state.loading = false;
      })
      .addCase(getNewAdsModern.rejected, handleError)
      .addCase(getClassifiedAdsModern.pending, (state) => {
        state.loading = true;
      })
      .addCase(getClassifiedAdsModern.fulfilled, (state, action) => {
        state.catAdsList = action.payload;
        state.loading = false;
      })
      .addCase(getClassifiedAdsModern.rejected, handleError)
      .addCase(getAffiliateAdsModern.pending, (state) => {
        state.loading = true;
      })
      .addCase(getAffiliateAdsModern.fulfilled, (state, action) => {
        state.catAdsList = action.payload;
        state.loading = false;
      })
      .addCase(getAffiliateAdsModern.rejected, handleError)
      .addCase(getPropertyAdsModern.pending, (state) => {
        state.loading = true;
      })
      .addCase(getPropertyAdsModern.fulfilled, (state, action) => {
        state.catAdsList = action.payload;
        state.loading = false;
      })
      .addCase(getPropertyAdsModern.rejected, handleError)
      .addCase(getBusinessAdsModern.pending, (state) => {
        state.loading = true;
      })
      .addCase(getBusinessAdsModern.fulfilled, (state, action) => {
        state.catAdsList = action.payload;
        state.loading = false;
      })
      .addCase(getBusinessAdsModern.rejected, handleError);
  },
});

export const { clearAdsErrorAndMessage, redirectFalse } = ListSlice.actions;
const { reducer } = ListSlice;
export default reducer;
