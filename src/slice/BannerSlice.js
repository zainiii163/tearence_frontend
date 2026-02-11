import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import BannerServices from "../services/BannerServices";

const initialState = {
  loading: false,
  bannerList: [],
  myBannerList: [],
  message: null,
  error: null,
};
export const getBannerList = createAsyncThunk(
  "banner/getBannerList",
  async ({ skip, limit, sort_type, user_id }) => {
    const res = await BannerServices.getBannerList({
      skip,
      limit,
      sort_type,
      user_id,
    });
    return res.data;
  }
);
export const createBanner = createAsyncThunk(
  "banner/createBanner",
  async ({ formData }) => {
    const res = await BannerServices.createBanner(formData);
    return res;
  }
);
export const updateBanner = createAsyncThunk(
  "banner/updateBanner",
  async ({ Id, formData }) => {
    const res = await BannerServices.updateBanner(Id, formData);
    return res;
  }
);
export const deleteBanner = createAsyncThunk(
  "banner/deleteBanner",
  async (Id) => {
    const res = await BannerServices.deleteBanner(Id);
    return res;
  }
);
export const getMyBanner = createAsyncThunk(
  "banner/getMyBanner",
  async ({ skip, limit, sort_type }) => {
    const res = await BannerServices.getMyBanner({ skip, limit, sort_type });
    return res.data;
  }
);

const handleError = (state, action) => {
  state.error = action.error.message;
};
const BannerSlice = createSlice({
  name: "banner",
  initialState,
  reducers: {
    redirectFalse: (state) => {
      state.redirect = false;
    },
    clearBannerErrorAndMessage: (state) => {
      state.error = null;
      state.message = null;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(getBannerList.pending, (state) => {
        state.loading = true;
        state.bannerList = [];
      })
      .addCase(getBannerList.fulfilled, (state, action) => {
        state.bannerList = action.payload;
        state.loading = false;
        state.error = null;
      })
      .addCase(getBannerList.rejected, handleError)
      .addCase(createBanner.fulfilled, (state, action) => {
        state.message = action.payload.message;
      })
      .addCase(createBanner.rejected, handleError)
      .addCase(updateBanner.fulfilled, (state, action) => {
        state.message = action.payload.message;
      })
      .addCase(updateBanner.rejected, handleError)
      .addCase(deleteBanner.fulfilled, (state, action) => {
        state.message = action.payload.message;
      })
      .addCase(deleteBanner.rejected, handleError)
      .addCase(getMyBanner.pending, (state) => {
        state.loading = true;
        state.myBannerList = [];
      })
      .addCase(getMyBanner.fulfilled, (state, action) => {
        state.myBannerList = action.payload;
        state.loading = false;
        state.error = null;
      })
      .addCase(getMyBanner.rejected, handleError);
  },
});
export const { clearBannerErrorAndMessage, redirectFalse } =
  BannerSlice.actions;
const { reducer } = BannerSlice;
export default reducer;
