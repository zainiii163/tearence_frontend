import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  fundingProjects: [],
  loading: false,
  error: null,
  categories: [],
  featuredProjects: [],
  popularProjects: [],
  projectDetails: null,
  myProjects: [],
  drafts: []
};

const fundingSlice = createSlice({
  name: "funding",
  initialState,
  reducers: {
    setLoading: (state, action) => {
      state.loading = action.payload;
    },
    setFundingProjects: (state, action) => {
      state.fundingProjects = action.payload;
      state.loading = false;
    },
    setCategories: (state, action) => {
      state.categories = action.payload;
    },
    setFeaturedProjects: (state, action) => {
      state.featuredProjects = action.payload;
    },
    setPopularProjects: (state, action) => {
      state.popularProjects = action.payload;
    },
    setProjectDetails: (state, action) => {
      state.projectDetails = action.payload;
    },
    setMyProjects: (state, action) => {
      state.myProjects = action.payload;
    },
    setDrafts: (state, action) => {
      state.drafts = action.payload;
    },
    addProject: (state, action) => {
      state.fundingProjects.unshift(action.payload);
    },
    updateProject: (state, action) => {
      const index = state.fundingProjects.findIndex(project => project.id === action.payload.id);
      if (index !== -1) {
        state.fundingProjects[index] = action.payload;
      }
    },
    removeProject: (state, action) => {
      state.fundingProjects = state.fundingProjects.filter(project => project.id !== action.payload);
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
  setFundingProjects,
  setCategories,
  setFeaturedProjects,
  setPopularProjects,
  setProjectDetails,
  setMyProjects,
  setDrafts,
  addProject,
  updateProject,
  removeProject,
  setError,
  clearError
} = fundingSlice.actions;

export default fundingSlice.reducer;
