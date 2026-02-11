import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import FundingServices from "../services/FundingServices"

const initialState = {
    loading: false,
    message: null,
    error: null,
    campaign:[],
  };

  export const getCampaign = createAsyncThunk(
    "fund/getCampaign",
    async ({skip, limit}) => {
      const res = await FundingServices.getCampaign(skip, limit);
      return res.data;
    }
  );
  export const createCampaign = createAsyncThunk(
    "fund/createCampaign",
    async ({formData}) => {
      const res = await FundingServices.createCampaign(formData);
      return res.data;
    }
  );

  const handleError = (state, action) => {
    console.error(action.error.message, action.error);
    state.error = action.error.message;
  };

  const FundingSlice = createSlice({
    name: "fund",
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
        .addCase(getCampaign.pending, (state) => {
          state.loading = true;
        })
        .addCase(getCampaign.fulfilled, (state, action) => {
          state.campaign = action.payload;
          state.loading = false;
        })
        .addCase(getCampaign.rejected, handleError)
        .addCase(createCampaign.fulfilled, (state, action) => {
          state.campaign = action.payload;
        })
        .addCase(createCampaign.rejected, handleError);
    }
  });

export const { clearAdsErrorAndMessage, redirectFalse } = FundingSlice.actions;
const { reducer } = FundingSlice;
export default reducer;
