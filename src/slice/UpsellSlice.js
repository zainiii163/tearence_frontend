import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import upsellService from "../services/UpsellService";

// Job Upsells
export const createJobUpsell = createAsyncThunk(
  "upsells/createJobUpsell",
  async (upsellData, { rejectWithValue }) => {
    try {
      // upsellData should contain: { jobId, upsell_type, price, duration_days, payment_id?, payment_method }
      const response = await upsellService.createJobUpsell(upsellData);
      return response.data || response;
    } catch (error) {
      const errorData = error.response?.data || error;
      return rejectWithValue(errorData);
    }
  }
);

export const completeJobUpsellPayment = createAsyncThunk(
  "upsells/completeJobUpsellPayment",
  async ({ upsellId, paymentData }, { rejectWithValue }) => {
    try {
      const response = await upsellService.completeJobUpsellPayment(upsellId, paymentData);
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response?.data || error.message);
    }
  }
);

// Candidate Upsells
export const createCandidateUpsell = createAsyncThunk(
  "upsells/createCandidateUpsell",
  async (upsellData, { rejectWithValue }) => {
    try {
      // upsellData should contain: { candidateId, upsell_type, price, duration_days, payment_id?, payment_method }
      const response = await upsellService.createCandidateUpsell(upsellData);
      return response.data || response;
    } catch (error) {
      const errorData = error.response?.data || error;
      return rejectWithValue(errorData);
    }
  }
);

export const completeCandidateUpsellPayment = createAsyncThunk(
  "upsells/completeCandidateUpsellPayment",
  async ({ upsellId, paymentData }, { rejectWithValue }) => {
    try {
      const response = await upsellService.completeCandidateUpsellPayment(upsellId, paymentData);
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response?.data || error.message);
    }
  }
);

// Get all job upsells for user
export const getUserJobUpsells = createAsyncThunk(
  "upsells/getUserJobUpsells",
  async (params = {}, { rejectWithValue }) => {
    try {
      // params can include: { status, upsell_type }
      const response = await upsellService.getUserJobUpsells(params);
      return response.data || response;
    } catch (error) {
      return rejectWithValue(error.response?.data || error);
    }
  }
);

// Get all candidate upsells for user
export const getUserCandidateUpsells = createAsyncThunk(
  "upsells/getUserCandidateUpsells",
  async (_, { rejectWithValue }) => {
    try {
      const response = await upsellService.getUserCandidateUpsells();
      return response.data || response;
    } catch (error) {
      return rejectWithValue(error.response?.data || error);
    }
  }
);

const initialState = {
  jobUpsell: null,
  candidateUpsell: null,
  userJobUpsells: [],
  userCandidateUpsells: [],
  paymentUrl: null,
  loading: false,
  error: null,
  message: null,
};

const upsellSlice = createSlice({
  name: "upsells",
  initialState,
  reducers: {
    clearError: (state) => {
      state.error = null;
      state.message = null;
    },
    clearPaymentUrl: (state) => {
      state.paymentUrl = null;
    },
  },
  extraReducers: (builder) => {
    builder
      // Create Job Upsell
      .addCase(createJobUpsell.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(createJobUpsell.fulfilled, (state, action) => {
        state.loading = false;
        state.jobUpsell = action.payload?.data || action.payload;
        state.paymentUrl = action.payload?.data?.payment_url || action.payload?.payment_url;
        state.message = action.payload?.message || "Upsell created successfully";
      })
      .addCase(createJobUpsell.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      // Complete Job Upsell Payment
      .addCase(completeJobUpsellPayment.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(completeJobUpsellPayment.fulfilled, (state, action) => {
        state.loading = false;
        state.message = action.payload?.message || "Payment completed successfully";
        state.paymentUrl = null;
      })
      .addCase(completeJobUpsellPayment.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      // Create Candidate Upsell
      .addCase(createCandidateUpsell.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(createCandidateUpsell.fulfilled, (state, action) => {
        state.loading = false;
        state.candidateUpsell = action.payload?.data || action.payload;
        state.paymentUrl = action.payload?.data?.payment_url || action.payload?.payment_url;
        state.message = action.payload?.message || "Upsell created successfully";
      })
      .addCase(createCandidateUpsell.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      // Complete Candidate Upsell Payment
      .addCase(completeCandidateUpsellPayment.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(completeCandidateUpsellPayment.fulfilled, (state, action) => {
        state.loading = false;
        state.message = action.payload?.message || "Payment completed successfully";
        state.paymentUrl = null;
      })
      .addCase(completeCandidateUpsellPayment.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      // Get User Job Upsells
      .addCase(getUserJobUpsells.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(getUserJobUpsells.fulfilled, (state, action) => {
        state.loading = false;
        state.userJobUpsells = action.payload?.data || action.payload || [];
      })
      .addCase(getUserJobUpsells.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
        state.userJobUpsells = [];
      })
      // Get User Candidate Upsells
      .addCase(getUserCandidateUpsells.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(getUserCandidateUpsells.fulfilled, (state, action) => {
        state.loading = false;
        state.userCandidateUpsells = action.payload?.data || action.payload || [];
      })
      .addCase(getUserCandidateUpsells.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
        state.userCandidateUpsells = [];
      });
  },
});

export const { clearError: clearUpsellError, clearPaymentUrl } = upsellSlice.actions;
export default upsellSlice.reducer;

