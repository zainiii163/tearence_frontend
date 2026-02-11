import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import UserServices from "../services/UserServices";

const initialState = {
  loading: false,
  usersList: { items: [], total: 0 },
  userDetail: null,
  message: null,
  error: null,
};

export const getUsersList = createAsyncThunk(
  "users/getUsersList",
  async (params = {}) => {
    const res = await UserServices.getUsersList(params);
    const data = res.data?.data || res.data || {};
    return {
      items: data.items || [],
      total: data.total || 0,
    };
  }
);

export const getUserDetail = createAsyncThunk(
  "users/getUserDetail",
  async (userId) => {
    const res = await UserServices.getUserDetail(userId);
    return res.data?.data || res.data;
  }
);

export const updateUserRole = createAsyncThunk(
  "users/updateUserRole",
  async ({ userId, role }) => {
    const res = await UserServices.updateUserRole(userId, role);
    return { userId, role, data: res.data?.data || res.data };
  }
);

export const activateUser = createAsyncThunk(
  "users/activateUser",
  async (userId) => {
    const res = await UserServices.activateUser(userId);
    return { userId, data: res.data?.data || res.data };
  }
);

export const deactivateUser = createAsyncThunk(
  "users/deactivateUser",
  async (userId) => {
    const res = await UserServices.deactivateUser(userId);
    return { userId, data: res.data?.data || res.data };
  }
);

export const deleteUser = createAsyncThunk(
  "users/deleteUser",
  async (userId) => {
    await UserServices.deleteUser(userId);
    return userId;
  }
);

const handleError = (state, action) => {
  state.error = action.error.message;
  state.loading = false;
};

const UserSlice = createSlice({
  name: "users",
  initialState,
  reducers: {
    clearUserErrorAndMessage: (state) => {
      state.error = null;
      state.message = null;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(getUsersList.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(getUsersList.fulfilled, (state, action) => {
        state.usersList = action.payload;
        state.loading = false;
      })
      .addCase(getUsersList.rejected, handleError)
      .addCase(getUserDetail.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(getUserDetail.fulfilled, (state, action) => {
        state.userDetail = action.payload;
        state.loading = false;
      })
      .addCase(getUserDetail.rejected, handleError)
      .addCase(updateUserRole.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(updateUserRole.fulfilled, (state, action) => {
        const { userId, role } = action.payload;
        // Update user in list if present
        if (state.usersList.items) {
          const userIndex = state.usersList.items.findIndex(
            (u) => u.id === userId || u.user_id === userId || u.customer_id === userId
          );
          if (userIndex !== -1) {
            state.usersList.items[userIndex] = {
              ...state.usersList.items[userIndex],
              role,
            };
          }
        }
        state.message = "User role updated successfully";
        state.loading = false;
      })
      .addCase(updateUserRole.rejected, handleError)
      .addCase(activateUser.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(activateUser.fulfilled, (state, action) => {
        const { userId } = action.payload;
        if (state.usersList.items) {
          const userIndex = state.usersList.items.findIndex(
            (u) => u.id === userId || u.user_id === userId || u.customer_id === userId
          );
          if (userIndex !== -1) {
            state.usersList.items[userIndex] = {
              ...state.usersList.items[userIndex],
              status: "active",
            };
          }
        }
        state.message = "User activated successfully";
        state.loading = false;
      })
      .addCase(activateUser.rejected, handleError)
      .addCase(deactivateUser.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(deactivateUser.fulfilled, (state, action) => {
        const { userId } = action.payload;
        if (state.usersList.items) {
          const userIndex = state.usersList.items.findIndex(
            (u) => u.id === userId || u.user_id === userId || u.customer_id === userId
          );
          if (userIndex !== -1) {
            state.usersList.items[userIndex] = {
              ...state.usersList.items[userIndex],
              status: "inactive",
            };
          }
        }
        state.message = "User deactivated successfully";
        state.loading = false;
      })
      .addCase(deactivateUser.rejected, handleError)
      .addCase(deleteUser.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(deleteUser.fulfilled, (state, action) => {
        const userId = action.payload;
        if (state.usersList.items) {
          state.usersList.items = state.usersList.items.filter(
            (u) => u.id !== userId && u.user_id !== userId && u.customer_id !== userId
          );
          state.usersList.total = Math.max(0, state.usersList.total - 1);
        }
        state.message = "User deleted successfully";
        state.loading = false;
      })
      .addCase(deleteUser.rejected, handleError);
  },
});

export const { clearUserErrorAndMessage } = UserSlice.actions;
export default UserSlice.reducer;

