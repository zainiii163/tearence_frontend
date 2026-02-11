import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import staffService from "../services/StaffService";

// Get staff members
export const getStaff = createAsyncThunk(
  "staff/getStaff",
  async (params, { rejectWithValue }) => {
    try {
      const response = await staffService.getStaff(params);
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response?.data || error.message);
    }
  }
);

// Get user's staff memberships
export const getMyMemberships = createAsyncThunk(
  "staff/getMyMemberships",
  async (_, { rejectWithValue }) => {
    try {
      const response = await staffService.getMyMemberships();
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response?.data || error.message);
    }
  }
);

// Add staff member
export const addStaff = createAsyncThunk(
  "staff/addStaff",
  async (staffData, { rejectWithValue }) => {
    try {
      const response = await staffService.addStaff(staffData);
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response?.data || error.message);
    }
  }
);

// Update staff member
export const updateStaff = createAsyncThunk(
  "staff/updateStaff",
  async ({ staffId, staffData }, { rejectWithValue }) => {
    try {
      const response = await staffService.updateStaff(staffId, staffData);
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response?.data || error.message);
    }
  }
);

// Remove staff member
export const removeStaff = createAsyncThunk(
  "staff/removeStaff",
  async (staffId, { rejectWithValue }) => {
    try {
      const response = await staffService.removeStaff(staffId);
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response?.data || error.message);
    }
  }
);

const initialState = {
  staffList: [],
  myMemberships: [],
  loading: false,
  error: null,
  message: null,
};

const staffSlice = createSlice({
  name: "staff",
  initialState,
  reducers: {
    clearError: (state) => {
      state.error = null;
    },
    clearMessage: (state) => {
      state.message = null;
    },
  },
  extraReducers: (builder) => {
    builder
      // Get Staff
      .addCase(getStaff.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(getStaff.fulfilled, (state, action) => {
        state.loading = false;
        state.staffList = action.payload?.data || action.payload || [];
      })
      .addCase(getStaff.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      // Get My Memberships
      .addCase(getMyMemberships.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(getMyMemberships.fulfilled, (state, action) => {
        state.loading = false;
        state.myMemberships = action.payload?.data || action.payload || [];
      })
      .addCase(getMyMemberships.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      // Add Staff
      .addCase(addStaff.pending, (state) => {
        state.loading = true;
        state.error = null;
        state.message = null;
      })
      .addCase(addStaff.fulfilled, (state, action) => {
        state.loading = false;
        state.message = "Staff member added successfully";
        // Add to list if not already present
        const newStaff = action.payload?.data || action.payload;
        if (newStaff && !state.staffList.find(s => s.id === newStaff.id)) {
          state.staffList.push(newStaff);
        }
      })
      .addCase(addStaff.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      // Update Staff
      .addCase(updateStaff.pending, (state) => {
        state.loading = true;
        state.error = null;
        state.message = null;
      })
      .addCase(updateStaff.fulfilled, (state, action) => {
        state.loading = false;
        state.message = "Staff member updated successfully";
        const updatedStaff = action.payload?.data || action.payload;
        if (updatedStaff) {
          const index = state.staffList.findIndex(s => s.id === updatedStaff.id);
          if (index !== -1) {
            state.staffList[index] = updatedStaff;
          }
        }
      })
      .addCase(updateStaff.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      // Remove Staff
      .addCase(removeStaff.pending, (state) => {
        state.loading = true;
        state.error = null;
        state.message = null;
      })
      .addCase(removeStaff.fulfilled, (state, action) => {
        state.loading = false;
        state.message = "Staff member removed successfully";
        const staffId = action.meta.arg;
        state.staffList = state.staffList.filter(s => s.id !== staffId);
      })
      .addCase(removeStaff.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      });
  },
});

export const { clearError, clearMessage } = staffSlice.actions;
export default staffSlice.reducer;
