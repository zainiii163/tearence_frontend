import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  affiliatePrograms: [],
  loading: false,
  error: null,
  myAffiliatePrograms: [],
  affiliateStats: null,
  commissions: [],
  referralCode: null,
  earnings: 0
};

const affiliateSlice = createSlice({
  name: "affiliate",
  initialState,
  reducers: {
    setLoading: (state, action) => {
      state.loading = action.payload;
    },
    setAffiliatePrograms: (state, action) => {
      state.affiliatePrograms = action.payload;
      state.loading = false;
    },
    setMyAffiliatePrograms: (state, action) => {
      state.myAffiliatePrograms = action.payload;
    },
    setAffiliateStats: (state, action) => {
      state.affiliateStats = action.payload;
    },
    setCommissions: (state, action) => {
      state.commissions = action.payload;
    },
    setReferralCode: (state, action) => {
      state.referralCode = action.payload;
    },
    setEarnings: (state, action) => {
      state.earnings = action.payload;
    },
    addAffiliateProgram: (state, action) => {
      state.affiliatePrograms.unshift(action.payload);
    },
    updateAffiliateProgram: (state, action) => {
      const index = state.affiliatePrograms.findIndex(program => program.id === action.payload.id);
      if (index !== -1) {
        state.affiliatePrograms[index] = action.payload;
      }
    },
    removeAffiliateProgram: (state, action) => {
      state.affiliatePrograms = state.affiliatePrograms.filter(program => program.id !== action.payload);
    },
    setError: (state, action) => {
      state.error = action.payload;
      state.loading = false;
    },
    clearError: (state) => {
      state.error = null;
    }
  }
});

export const {
  setLoading,
  setAffiliatePrograms,
  setMyAffiliatePrograms,
  setAffiliateStats,
  setCommissions,
  setReferralCode,
  setEarnings,
  addAffiliateProgram,
  updateAffiliateProgram,
  removeAffiliateProgram,
  setError,
  clearError
} = affiliateSlice.actions;

export default affiliateSlice.reducer;
