import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import CategoryServices from "../services/CategoryServices";

const initialState = {
  loading: false,
  categoryList: [],
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
};

export const getCategoriesList = createAsyncThunk(
  "categories/getCategoryList",
  async ({ is_parent = "yes" } = {}) => {
    const res = await CategoryServices.getCategoriesList(is_parent);
    return res.data;
  }
);
export const getEbayAds = createAsyncThunk(
  "categories/getEbayAds",
  async () => {
    const res = await CategoryServices.getEbayAds();
    return res.data;
  }
);

export const createCategoryList = createAsyncThunk(
  "categories/createCategoryList",
  async (data) => {
    const res = await CategoryServices.createCategoryList(data);
    return res.data;
  }
);

export const detailsCategory = createAsyncThunk(
  "categories/detailCategory",
  async ({ slug }) => {
    const res = await CategoryServices.detailsCategory(slug);
    return res.data;
  }
);
export const CategoryTreeChild = createAsyncThunk(
  "categories/tree",
  async ({ id }) => {
    const res = await CategoryServices.CategoryTreeChild(id);
    return res.data;
  }
);
export const getFilterCat = createAsyncThunk(
  "categories/filterCat",
  async () => {
    const res = await CategoryServices.getFilterCat();
    return res.data;
  }
);
export const getCurrency = createAsyncThunk("categories/Currency", async () => {
  const res = await CategoryServices.getCurrency();
  return res.data;
});
export const getCountry = createAsyncThunk("categories/Country", async () => {
  const res = await CategoryServices.getCountry();
  return res.data;
});
export const getZone = createAsyncThunk(
  "categories/getZone",
  async (payload) => {
    const res = await CategoryServices.getZone(payload);
    return res.data;
  }
);

const handleError = (state, action) => {
  console.error(action.error.message, action.error);
  state.error = action.error.message;
  state.loading = false;
};

const CategorySlice = createSlice({
  name: "categories",
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
      .addCase(getCategoriesList.pending, (state) => {
        state.loading = true;
      })
      .addCase(getCategoriesList.fulfilled, (state, action) => {
        state.categoryList = action.payload;
        state.loading = false;
      })
      .addCase(getCategoriesList.rejected, handleError)
      .addCase(getEbayAds.fulfilled, (state, action) => {
        state.ebayAds = action.payload;
        state.loading = false;
      })
      .addCase(getEbayAds.rejected, handleError)
      .addCase(createCategoryList.fulfilled, (state, action) => {
        state.message = action.payload.message;
      })
      .addCase(createCategoryList.rejected, handleError)
      .addCase(detailsCategory.fulfilled, (state, action) => {
        state.detailsAds = action.payload;
      })
      .addCase(detailsCategory.rejected, handleError)
      .addCase(CategoryTreeChild.fulfilled, (state, action) => {
        state.catTreeChild = action.payload;
      })
      .addCase(CategoryTreeChild.rejected, handleError)
      .addCase(getFilterCat.fulfilled, (state, action) => {
        state.catFilter = action.payload;
      })
      .addCase(getFilterCat.rejected, handleError)
      .addCase(getCurrency.fulfilled, (state, action) => {
        state.currency = action.payload;
      })
      .addCase(getCurrency.rejected, handleError)
      .addCase(getCountry.fulfilled, (state, action) => {
        state.country = action.payload;
      })
      .addCase(getCountry.rejected, handleError)
      .addCase(getZone.fulfilled, (state, action) => {
        state.zone = action.payload;
      })
      .addCase(getZone.rejected, handleError);
  },
});

export const { clearAdsErrorAndMessage, redirectFalse } = CategorySlice.actions;
const { reducer } = CategorySlice;
export default reducer;
