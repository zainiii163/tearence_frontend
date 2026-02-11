import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import jobService from "../services/JobServices";

// Async thunks for job operations
export const getJobsList = createAsyncThunk(
  "jobs/getJobsList",
  async (params, { rejectWithValue }) => {
    try {
      const response = await jobService.getJobsList(params);
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response?.data || error.message);
    }
  }
);

export const getJobDetail = createAsyncThunk(
  "jobs/getJobDetail",
  async (jobId, { rejectWithValue }) => {
    try {
      const response = await jobService.getJobDetail(jobId);
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response?.data || error.message);
    }
  }
);

export const createJob = createAsyncThunk(
  "jobs/createJob",
  async (jobData, { rejectWithValue }) => {
    try {
      const response = await jobService.createJob(jobData);
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response?.data || error.message);
    }
  }
);

export const updateJob = createAsyncThunk(
  "jobs/updateJob",
  async ({ jobId, jobData }, { rejectWithValue }) => {
    try {
      const response = await jobService.updateJob(jobId, jobData);
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response?.data || error.message);
    }
  }
);

export const deleteJob = createAsyncThunk(
  "jobs/deleteJob",
  async (jobId, { rejectWithValue }) => {
    try {
      const response = await jobService.deleteJob(jobId);
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response?.data || error.message);
    }
  }
);

export const activateJobUpsell = createAsyncThunk(
  "jobs/activateJobUpsell",
  async ({ jobId, upsellData }, { rejectWithValue }) => {
    try {
      const response = await jobService.activateJobUpsell(jobId, upsellData);
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response?.data || error.message);
    }
  }
);

const initialState = {
  jobsList: null,
  jobDetail: null,
  loading: false,
  error: null,
  message: null,
  filters: {
    jobType: "",
    salaryRange: { min: "", max: "" },
    location: "",
    category: "",
    sortBy: "newest",
  },
  pagination: {
    currentPage: 1,
    itemsPerPage: 20,
    total: 0,
  },
};

const jobSlice = createSlice({
  name: "jobs",
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
      // Get Jobs List
      .addCase(getJobsList.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(getJobsList.fulfilled, (state, action) => {
        state.loading = false;
        state.jobsList = action.payload;
        state.pagination.total = action.payload?.total || 0;
      })
      .addCase(getJobsList.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      // Get Job Detail
      .addCase(getJobDetail.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(getJobDetail.fulfilled, (state, action) => {
        state.loading = false;
        state.jobDetail = action.payload;
      })
      .addCase(getJobDetail.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      // Create Job
      .addCase(createJob.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(createJob.fulfilled, (state, action) => {
        state.loading = false;
        state.message = action.payload?.message || "Job created successfully";
      })
      .addCase(createJob.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      // Update Job
      .addCase(updateJob.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(updateJob.fulfilled, (state, action) => {
        state.loading = false;
        state.message = action.payload?.message || "Job updated successfully";
      })
      .addCase(updateJob.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      // Delete Job
      .addCase(deleteJob.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(deleteJob.fulfilled, (state, action) => {
        state.loading = false;
        state.message = action.payload?.message || "Job deleted successfully";
      })
      .addCase(deleteJob.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      // Activate Job Upsell
      .addCase(activateJobUpsell.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(activateJobUpsell.fulfilled, (state, action) => {
        state.loading = false;
        state.message = action.payload?.message || "Upsell activated successfully";
      })
      .addCase(activateJobUpsell.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      });
  },
});

export const { setFilters, resetFilters, setPagination, clearError } = jobSlice.actions;
export default jobSlice.reducer;

