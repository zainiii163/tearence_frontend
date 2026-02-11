import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import PackageService from "../services/PackageServices";

const initialState = {
  loading: false,
  packageList: [],
  message: null,
  error: null,
};

export const getPackageList = createAsyncThunk(
  "package/list",
  async () => {
    const res = await PackageService.getPackageList();
    return res.data;
  }
);


const handleError = (state, action) => {
  console.error(action.error.message, action.error);
  state.error = action.error.message;
};

const PackageSlice = createSlice({
  name: "package",
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
      .addCase(getPackageList.pending, (state) => {
        state.loading = true;
      })
      .addCase(getPackageList.fulfilled, (state, action) => {
        state.packageList = action.payload;
        // state.loading = false;
      })
      .addCase(getPackageList.rejected, handleError);
  },
});

export const { clearAdsErrorAndMessage, redirectFalse } = PackageSlice.actions;
const { reducer } = PackageSlice;
export default reducer;
