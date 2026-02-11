import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import candidateService from "../services/CandidateServices";

// Async thunks for candidate operations
export const getCandidatesList = createAsyncThunk(
  "candidates/getCandidatesList",
  async (params, { rejectWithValue }) => {
    try {
      const response = await candidateService.getCandidatesList(params);
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response?.data || error.message);
    }
  }
);

export const getCandidateProfile = createAsyncThunk(
  "candidates/getCandidateProfile",
  async (candidateId, { rejectWithValue }) => {
    try {
      const response = await candidateService.getCandidateProfile(candidateId);
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response?.data || error.message);
    }
  }
);

export const createCandidateProfile = createAsyncThunk(
  "candidates/createCandidateProfile",
  async (profileData, { rejectWithValue }) => {
    try {
      const response = await candidateService.createCandidateProfile(profileData);
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response?.data || error.message);
    }
  }
);

export const updateCandidateProfile = createAsyncThunk(
  "candidates/updateCandidateProfile",
  async ({ candidateId, profileData }, { rejectWithValue }) => {
    try {
      const response = await candidateService.updateCandidateProfile(candidateId, profileData);
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response?.data || error.message);
    }
  }
);

export const getMyProfile = createAsyncThunk(
  "candidates/getMyProfile",
  async (_, { rejectWithValue }) => {
    try {
      const response = await candidateService.getMyProfile();
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response?.data || error.message);
    }
  }
);

export const activateCandidateUpsell = createAsyncThunk(
  "candidates/activateCandidateUpsell",
  async (upsellData, { rejectWithValue }) => {
    try {
      const response = await candidateService.activateCandidateUpsell(upsellData);
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response?.data || error.message);
    }
  }
);

const initialState = {
  candidatesList: null,
  candidateProfile: null,
  loading: false,
  error: null,
  message: null,
  filters: {
    skills: [],
    location: "",
    visibility: "all",
    sortBy: "newest",
  },
  pagination: {
    currentPage: 1,
    itemsPerPage: 20,
    total: 0,
  },
};

const candidateSlice = createSlice({
  name: "candidates",
  initialState,
  reducers: {
    setFilters: (state, action) => {
      state.filters = { ...state.filters, ...action.payload };
    },
    resetFilters: (state) => {
      state.filters = initialState.filters;
    },
    setPagination: (state, action) => {
      state.pagination = { ...state.pagination, ...action.payload };
    },
    clearError: (state) => {
      state.error = null;
      state.message = null;
    },
  },
  extraReducers: (builder) => {
    builder
      // Get Candidates List
      .addCase(getCandidatesList.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(getCandidatesList.fulfilled, (state, action) => {
        state.loading = false;
        state.candidatesList = action.payload;
        state.pagination.total = action.payload?.total || 0;
      })
      .addCase(getCandidatesList.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      // Get Candidate Profile
      .addCase(getCandidateProfile.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(getCandidateProfile.fulfilled, (state, action) => {
        state.loading = false;
        state.candidateProfile = action.payload;
      })
      .addCase(getCandidateProfile.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      // Create Candidate Profile
      .addCase(createCandidateProfile.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(createCandidateProfile.fulfilled, (state, action) => {
        state.loading = false;
        state.message = action.payload?.message || "Profile created successfully";
      })
      .addCase(createCandidateProfile.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      // Update Candidate Profile
      .addCase(updateCandidateProfile.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(updateCandidateProfile.fulfilled, (state, action) => {
        state.loading = false;
        state.message = action.payload?.message || "Profile updated successfully";
      })
      .addCase(updateCandidateProfile.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      // Get My Profile
      .addCase(getMyProfile.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(getMyProfile.fulfilled, (state, action) => {
        state.loading = false;
        state.candidateProfile = action.payload;
      })
      .addCase(getMyProfile.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      // Activate Candidate Upsell
      .addCase(activateCandidateUpsell.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(activateCandidateUpsell.fulfilled, (state, action) => {
        state.loading = false;
        state.message = action.payload?.message || "Upsell activated successfully";
      })
      .addCase(activateCandidateUpsell.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      });
  },
});

export const { setFilters, resetFilters, setPagination, clearError } = candidateSlice.actions;
export default candidateSlice.reducer;

