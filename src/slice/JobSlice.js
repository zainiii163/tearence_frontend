import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  jobs: [],
  loading: false,
  error: null,
  categories: [],
  featuredJobs: [],
  popularJobs: [],
  jobDetails: null,
  myJobs: [],
  drafts: [],
  applications: [],
  searchResults: []
};

const jobSlice = createSlice({
  name: "jobs",
  initialState,
  reducers: {
    setLoading: (state, action) => {
      state.loading = action.payload;
    },
    setJobs: (state, action) => {
      state.jobs = action.payload;
      state.loading = false;
    },
    setCategories: (state, action) => {
      state.categories = action.payload;
    },
    setFeaturedJobs: (state, action) => {
      state.featuredJobs = action.payload;
    },
    setPopularJobs: (state, action) => {
      state.popularJobs = action.payload;
    },
    setJobDetails: (state, action) => {
      state.jobDetails = action.payload;
    },
    setMyJobs: (state, action) => {
      state.myJobs = action.payload;
    },
    setDrafts: (state, action) => {
      state.drafts = action.payload;
    },
    setApplications: (state, action) => {
      state.applications = action.payload;
    },
    setSearchResults: (state, action) => {
      state.searchResults = action.payload;
    },
    addJob: (state, action) => {
      state.jobs.unshift(action.payload);
    },
    updateJob: (state, action) => {
      const index = state.jobs.findIndex(job => job.id === action.payload.id);
      if (index !== -1) {
        state.jobs[index] = action.payload;
      }
    },
    removeJob: (state, action) => {
      state.jobs = state.jobs.filter(job => job.id !== action.payload);
    },
    addApplication: (state, action) => {
      state.applications.unshift(action.payload);
    },
    updateApplication: (state, action) => {
      const index = state.applications.findIndex(app => app.id === action.payload.id);
      if (index !== -1) {
        state.applications[index] = action.payload;
      }
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
  setJobs,
  setCategories,
  setFeaturedJobs,
  setPopularJobs,
  setJobDetails,
  setMyJobs,
  setDrafts,
  setApplications,
  setSearchResults,
  addJob,
  updateJob,
  removeJob,
  addApplication,
  updateApplication,
  setError,
  clearError
} = jobSlice.actions;

export default jobSlice.reducer;
