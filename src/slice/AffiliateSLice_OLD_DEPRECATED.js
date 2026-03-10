import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import AffiliateServices from "../services/AffiliateServices";

const initialState = {
  loading: false,
  affiliateList: [],
  myAffiliateList: [],
  affiliateListTop: [],
  message: null,
  error: null,
};
export const getAffiliateList = createAsyncThunk(
  "aff/getAffiliateList",
  async ({ position, skip, limit }) => {
    const res = await AffiliateServices.getAffiliateList(position, skip, limit);
    return res.data;
  }
);
export const getAffiliateListTop = createAsyncThunk(
  "aff/getAffiliateListTop",
  async () => {
    const res = await AffiliateServices.getAffiliateListTop();
    return res.data;
  }
);
export const createAffiliate = createAsyncThunk(
  "aff/createAffiliate",
  async ({ formData }) => {
    const res = await AffiliateServices.createAffiliate(formData);
    return res.data;
  }
);
export const updateAffiliate = createAsyncThunk(
  "banner/updateAffiliate",
  async ({ Id, formData }) => {
    const res = await AffiliateServices.updateAffiliate(Id, formData);
    return res;
  }
);
export const deleteAffiliate = createAsyncThunk(
  "banner/deleteAffiliate",
  async (Id) => {
    const res = await AffiliateServices.deleteAffiliate(Id);
    return res;
  }
);
export const getMyAffiliate = createAsyncThunk(
  "aff/getMyAffiliate",
  async ({ skip, limit }) => {
    const res = await AffiliateServices.getMyAffiliate(skip, limit);
    return res.data;
  }
);
const handleError = (state, action) => {
  state.error = action.error.message;
};
const AffiliateSlice = createSlice({
  name: "aff",
  initialState,
  reducers: {
    redirectFalse: (state) => {
      state.redirect = false;
    },
    clearAffErrorAndMessage: (state) => {
      state.error = null;
      state.message = null;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(getAffiliateList.pending, (state) => {
        state.loading = true;
      })
      .addCase(getAffiliateList.fulfilled, (state, action) => {
        state.affiliateList = action.payload;
        state.loading = false;
      })
      .addCase(getAffiliateList.rejected, handleError)
      .addCase(getAffiliateListTop.pending, (state) => {
        state.loading = true;
      })
      .addCase(getAffiliateListTop.fulfilled, (state, action) => {
        state.affiliateListTop = action.payload;
        state.loading = false;
      })
      .addCase(getAffiliateListTop.rejected, handleError)
      .addCase(createAffiliate.pending, (state) => {
        state.loading = true;
      })
      .addCase(createAffiliate.fulfilled, (state, action) => {
        state.loading = false;
      })
      .addCase(createAffiliate.rejected, handleError)
      .addCase(updateAffiliate.pending, (state) => {
        state.loading = true;
      })
      .addCase(updateAffiliate.fulfilled, (state, action) => {
        state.loading = false;
      })
      .addCase(updateAffiliate.rejected, handleError)
      .addCase(deleteAffiliate.pending, (state) => {
        state.loading = true;
      })
      .addCase(deleteAffiliate.fulfilled, (state, action) => {
        state.loading = false;
      })
      .addCase(deleteAffiliate.rejected, handleError)
      .addCase(getMyAffiliate.pending, (state) => {
        state.loading = true;
      })
      .addCase(getMyAffiliate.fulfilled, (state, action) => {
        state.myAffiliateList = action.payload;
        state.loading = false;
      })
      .addCase(getMyAffiliate.rejected, handleError);
  },
});
export const { clearAffErrorAndMessage, redirectFalse } =
  AffiliateSlice.actions;
const { reducer } = AffiliateSlice;
export default reducer;
