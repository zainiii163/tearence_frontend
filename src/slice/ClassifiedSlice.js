import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import classifiedService from '../services/ClassifiedService';

// Async thunks
export const getMyClassifieds = createAsyncThunk(
  'classified/getMyClassifieds',
  async (_, { rejectWithValue }) => {
    try {
      const response = await classifiedService.getMyClassifieds();
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response.data);
    }
  }
);

export const createClassified = createAsyncThunk(
  'classified/createClassified',
  async (formData, { rejectWithValue }) => {
    try {
      const response = await classifiedService.createClassified(formData);
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response.data);
    }
  }
);

export const updateClassified = createAsyncThunk(
  'classified/updateClassified',
  async ({ id, formData }, { rejectWithValue }) => {
    try {
      const response = await classifiedService.updateClassified(id, formData);
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response.data);
    }
  }
);

export const deleteClassified = createAsyncThunk(
  'classified/deleteClassified',
  async (id, { rejectWithValue }) => {
    try {
      const response = await classifiedService.deleteClassified(id);
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response.data);
    }
  }
);

export const markAsSold = createAsyncThunk(
  'classified/markAsSold',
  async (id, { rejectWithValue }) => {
    try {
      const response = await classifiedService.markAsSold(id);
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response.data);
    }
  }
);

// Initial state
const initialState = {
  myClassifieds: [],
  loading: false,
  error: null,
  createLoading: false,
  createError: null,
  updateLoading: false,
  updateError: null,
  deleteLoading: false,
  deleteError: null,
};

// Slice
const classifiedSlice = createSlice({
  name: 'classified',
  initialState,
  reducers: {
    clearErrors: (state) => {
      state.error = null;
      state.createError = null;
      state.updateError = null;
      state.deleteError = null;
    },
    clearCreateError: (state) => {
      state.createError = null;
    },
    clearUpdateError: (state) => {
      state.updateError = null;
    },
    clearDeleteError: (state) => {
      state.deleteError = null;
    },
  },
  extraReducers: (builder) => {
    builder
      // Get my classifieds
      .addCase(getMyClassifieds.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(getMyClassifieds.fulfilled, (state, action) => {
        state.loading = false;
        state.myClassifieds = action.payload;
      })
      .addCase(getMyClassifieds.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })

      // Create classified
      .addCase(createClassified.pending, (state) => {
        state.createLoading = true;
        state.createError = null;
      })
      .addCase(createClassified.fulfilled, (state, action) => {
        state.createLoading = false;
        // Add new classified to the list
        if (action.payload.data) {
          state.myClassifieds = [action.payload.data, ...state.myClassifieds];
        }
      })
      .addCase(createClassified.rejected, (state, action) => {
        state.createLoading = false;
        state.createError = action.payload;
      })

      // Update classified
      .addCase(updateClassified.pending, (state) => {
        state.updateLoading = true;
        state.updateError = null;
      })
      .addCase(updateClassified.fulfilled, (state, action) => {
        state.updateLoading = false;
        // Update classified in the list
        const index = state.myClassifieds.findIndex(c => c.id === action.payload.data.id);
        if (index !== -1) {
          state.myClassifieds[index] = action.payload.data;
        }
      })
      .addCase(updateClassified.rejected, (state, action) => {
        state.updateLoading = false;
        state.updateError = action.payload;
      })

      // Delete classified
      .addCase(deleteClassified.pending, (state) => {
        state.deleteLoading = true;
        state.deleteError = null;
      })
      .addCase(deleteClassified.fulfilled, (state, action) => {
        state.deleteLoading = false;
        // Remove classified from the list
        state.myClassifieds = state.myClassifieds.filter(c => c.id !== action.meta.arg);
      })
      .addCase(deleteClassified.rejected, (state, action) => {
        state.deleteLoading = false;
        state.deleteError = action.payload;
      })

      // Mark as sold
      .addCase(markAsSold.pending, (state) => {
        state.updateLoading = true;
        state.updateError = null;
      })
      .addCase(markAsSold.fulfilled, (state, action) => {
        state.updateLoading = false;
        // Update classified in the list
        const index = state.myClassifieds.findIndex(c => c.id === action.payload.data.id);
        if (index !== -1) {
          state.myClassifieds[index] = action.payload.data;
        }
      })
      .addCase(markAsSold.rejected, (state, action) => {
        state.updateLoading = false;
        state.updateError = action.payload;
      });
  },
});

// Actions
export const { clearErrors, clearCreateError, clearUpdateError, clearDeleteError } = classifiedSlice.actions;

// Selectors
export const selectMyClassifieds = (state) => state.classified.myClassifieds;
export const selectClassifiedLoading = (state) => state.classified.loading;
export const selectClassifiedError = (state) => state.classified.error;
export const selectClassifiedCreateLoading = (state) => state.classified.createLoading;
export const selectClassifiedCreateError = (state) => state.classified.createError;

// Export reducer
export default classifiedSlice.reducer;
