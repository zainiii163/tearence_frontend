import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  jobAlerts: [],
  loading: false,
  error: null,
  alertDetails: null,
  myAlerts: [],
  notifications: []
};

const jobAlertSlice = createSlice({
  name: "jobAlerts",
  initialState,
  reducers: {
    setLoading: (state, action) => {
      state.loading = action.payload;
    },
    setJobAlerts: (state, action) => {
      state.jobAlerts = action.payload;
      state.loading = false;
    },
    setAlertDetails: (state, action) => {
      state.alertDetails = action.payload;
    },
    setMyAlerts: (state, action) => {
      state.myAlerts = action.payload;
    },
    setNotifications: (state, action) => {
      state.notifications = action.payload;
    },
    addJobAlert: (state, action) => {
      state.jobAlerts.unshift(action.payload);
    },
    updateJobAlert: (state, action) => {
      const index = state.jobAlerts.findIndex(alert => alert.id === action.payload.id);
      if (index !== -1) {
        state.jobAlerts[index] = action.payload;
      }
    },
    removeJobAlert: (state, action) => {
      state.jobAlerts = state.jobAlerts.filter(alert => alert.id !== action.payload);
    },
    addMyAlert: (state, action) => {
      state.myAlerts.unshift(action.payload);
    },
    updateMyAlert: (state, action) => {
      const index = state.myAlerts.findIndex(alert => alert.id === action.payload.id);
      if (index !== -1) {
        state.myAlerts[index] = action.payload;
      }
    },
    removeMyAlert: (state, action) => {
      state.myAlerts = state.myAlerts.filter(alert => alert.id !== action.payload);
    },
    addNotification: (state, action) => {
      state.notifications.unshift(action.payload);
    },
    markNotificationAsRead: (state, action) => {
      const notification = state.notifications.find(n => n.id === action.payload);
      if (notification) {
        notification.read = true;
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
  setJobAlerts,
  setAlertDetails,
  setMyAlerts,
  setNotifications,
  addJobAlert,
  updateJobAlert,
  removeJobAlert,
  addMyAlert,
  updateMyAlert,
  removeMyAlert,
  addNotification,
  markNotificationAsRead,
  setError,
  clearError
} = jobAlertSlice.actions;

export default jobAlertSlice.reducer;
