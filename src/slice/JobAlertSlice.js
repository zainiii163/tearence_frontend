import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import jobAlertService from "../services/JobAlertService";

// Async thunks for job alert operations
export const getJobAlerts = createAsyncThunk(
  "jobAlerts/getJobAlerts",
  async (params, { rejectWithValue }) => {
    try {
      const response = await jobAlertService.getJobAlerts(params);
      return response.data;
    } catch (error) {
      const errorData = error.response?.data || error;
      const status = error.response?.status || error?.status || 0;
      return rejectWithValue({ ...errorData, status });
    }
  }
);

export const getJobAlert = createAsyncThunk(
  "jobAlerts/getJobAlert",
  async (alertId, { rejectWithValue }) => {
    try {
      const response = await jobAlertService.getJobAlert(alertId);
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response?.data || error.message);
    }
  }
);

export const createJobAlert = createAsyncThunk(
  "jobAlerts/createJobAlert",
  async (alertData, { rejectWithValue }) => {
    try {
      const response = await jobAlertService.createJobAlert(alertData);
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response?.data || error.message);
    }
  }
);

export const updateJobAlert = createAsyncThunk(
  "jobAlerts/updateJobAlert",
  async ({ alertId, alertData }, { rejectWithValue }) => {
    try {
      const response = await jobAlertService.updateJobAlert(alertId, alertData);
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response?.data || error.message);
    }
  }
);

export const deleteJobAlert = createAsyncThunk(
  "jobAlerts/deleteJobAlert",
  async (alertId, { rejectWithValue }) => {
    try {
      const response = await jobAlertService.deleteJobAlert(alertId);
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response?.data || error.message);
    }
  }
);

export const getMatchingJobs = createAsyncThunk(
  "jobAlerts/getMatchingJobs",
  async ({ alertId, params }, { rejectWithValue }) => {
    try {
      const response = await jobAlertService.getMatchingJobs(alertId, params);
      return { alertId, data: response.data };
    } catch (error) {
      return rejectWithValue(error.response?.data || error.message);
    }
  }
);

export const toggleJobAlertActive = createAsyncThunk(
  "jobAlerts/toggleJobAlertActive",
  async (alertId, { rejectWithValue }) => {
    try {
      const response = await jobAlertService.toggleJobAlertActive(alertId);
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response?.data || error.message);
    }
  }
);

const initialState = {
  jobAlerts: [],
  jobAlert: null,
  matchingJobs: {},
  loading: false,
  error: null,
  message: null,
};

const jobAlertSlice = createSlice({
  name: "jobAlerts",
  initialState,
  reducers: {
    clearError: (state) => {
      state.error = null;
      state.message = null;
    },
    clearMatchingJobs: (state, action) => {
      if (action.payload) {
        delete state.matchingJobs[action.payload];
      } else {
        state.matchingJobs = {};
      }
    },
  },
  extraReducers: (builder) => {
    builder
      // Get Job Alerts
      .addCase(getJobAlerts.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(getJobAlerts.fulfilled, (state, action) => {
        state.loading = false;
        state.jobAlerts = action.payload?.data || action.payload?.items || [];
      })
      .addCase(getJobAlerts.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
        // Reset alerts array on error
        state.jobAlerts = [];
      })
      // Get Job Alert
      .addCase(getJobAlert.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(getJobAlert.fulfilled, (state, action) => {
        state.loading = false;
        state.jobAlert = action.payload?.data || action.payload;
      })
      .addCase(getJobAlert.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      // Create Job Alert
      .addCase(createJobAlert.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(createJobAlert.fulfilled, (state, action) => {
        state.loading = false;
        state.message = action.payload?.message || "Job alert created successfully";
        const newAlert = action.payload?.data || action.payload;
        if (newAlert) {
          state.jobAlerts = [...state.jobAlerts, newAlert];
        }
      })
      .addCase(createJobAlert.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      // Update Job Alert
      .addCase(updateJobAlert.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(updateJobAlert.fulfilled, (state, action) => {
        state.loading = false;
        state.message = action.payload?.message || "Job alert updated successfully";
        const updatedAlert = action.payload?.data || action.payload;
        if (updatedAlert) {
          state.jobAlerts = state.jobAlerts.map((alert) =>
            alert.job_alert_id === updatedAlert.job_alert_id ? updatedAlert : alert
          );
        }
      })
      .addCase(updateJobAlert.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      // Delete Job Alert
      .addCase(deleteJobAlert.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(deleteJobAlert.fulfilled, (state, action) => {
        state.loading = false;
        state.message = action.payload?.message || "Job alert deleted successfully";
        const deletedId = action.payload?.data?.job_alert_id || action.payload?.job_alert_id;
        if (deletedId) {
          state.jobAlerts = state.jobAlerts.filter((alert) => alert.job_alert_id !== deletedId);
        }
      })
      .addCase(deleteJobAlert.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      // Get Matching Jobs
      .addCase(getMatchingJobs.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(getMatchingJobs.fulfilled, (state, action) => {
        state.loading = false;
        const { alertId, data } = action.payload;
        state.matchingJobs[alertId] = data?.data || data?.items || [];
      })
      .addCase(getMatchingJobs.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      // Toggle Job Alert Active
      .addCase(toggleJobAlertActive.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(toggleJobAlertActive.fulfilled, (state, action) => {
        state.loading = false;
        state.message = action.payload?.message || "Job alert status updated";
        const updatedAlert = action.payload?.data || action.payload;
        if (updatedAlert) {
          state.jobAlerts = state.jobAlerts.map((alert) =>
            alert.job_alert_id === updatedAlert.job_alert_id ? updatedAlert : alert
          );
        }
      })
      .addCase(toggleJobAlertActive.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      });
  },
});

export const { clearError, clearMatchingJobs } = jobAlertSlice.actions;
export default jobAlertSlice.reducer;


