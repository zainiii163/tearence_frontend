import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import Api from '../api';

// KYC verification types
export const VERIFICATION_TYPES = {
  ID_CARD: 'id_card',
  DRIVERS_LICENSE: 'drivers_license', 
  PASSPORT: 'passport',
  EMAIL_MOBILE: 'email_mobile',
  ADDRESS: 'address'
};

// KYC status
export const KYC_STATUS = {
  NOT_VERIFIED: 'not_verified',
  PENDING: 'pending',
  VERIFIED: 'verified',
  REJECTED: 'rejected'
};

const initialState = {
  loading: false,
  kycStatus: KYC_STATUS.NOT_VERIFIED,
  verificationType: null,
  verificationData: null,
  message: null,
  error: null,
  postCount: 0,
  kycRequired: false
};

// Check if KYC is required based on post count (Clive: after first post)
export const checkKycRequirement = createAsyncThunk(
  "kyc/checkRequirement",
  async (_, { getState }) => {
    const response = await Api.get('/user/post-count');
    const postCount = response.data?.data?.post_count || 0;
    const kycRequired = postCount >= 1;
    
    // Get current KYC status
    const kycResponse = await Api.get('/user/kyc-status');
    const kycStatus = kycResponse.data?.data?.status || KYC_STATUS.NOT_VERIFIED;
    
    return {
      postCount,
      kycRequired,
      kycStatus
    };
  }
);

// Submit KYC verification
export const submitKycVerification = createAsyncThunk(
  "kyc/submitVerification",
  async (verificationData) => {
    const { verificationType, documents, ...otherData } = verificationData;
    
    const formData = new FormData();
    formData.append('verification_type', verificationType);
    
    // Add documents based on verification type
    if (documents) {
      Object.keys(documents).forEach(key => {
        if (documents[key]) {
          formData.append(key, documents[key]);
        }
      });
    }
    
    // Add other data
    Object.keys(otherData).forEach(key => {
      if (otherData[key]) {
        formData.append(key, otherData[key]);
      }
    });
    
    const response = await Api.post('/user/kyc-verify', formData, {
      headers: {
        'Content-Type': 'multipart/form-data'
      }
    });
    
    return response.data;
  }
);

// Get KYC status
export const getKycStatus = createAsyncThunk(
  "kyc/getStatus",
  async () => {
    const response = await Api.get('/user/kyc-status');
    return response.data;
  }
);

// Update KYC status (for admin)
export const updateKycStatus = createAsyncThunk(
  "kyc/updateStatus",
  async ({ userId, status, rejectionReason }) => {
    const payload = { status };
    if (rejectionReason) {
      payload.rejection_reason = rejectionReason;
    }
    
    const response = await Api.put(`/v1/admin/kyc/${userId}`, payload);
    return response.data;
  }
);

const KycSlice = createSlice({
  name: "kyc",
  initialState,
  reducers: {
    clearKycErrorAndMessage: (state) => {
      state.error = null;
      state.message = null;
    },
    resetKycState: (state) => {
      state.loading = false;
      state.kycStatus = KYC_STATUS.NOT_VERIFIED;
      state.verificationType = null;
      state.verificationData = null;
      state.message = null;
      state.error = null;
    }
  },
  extraReducers: (builder) => {
    builder
      // Check KYC requirement
      .addCase(checkKycRequirement.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(checkKycRequirement.fulfilled, (state, action) => {
        state.loading = false;
        state.postCount = action.payload.postCount;
        state.kycRequired = action.payload.kycRequired;
        state.kycStatus = action.payload.kycStatus;
      })
      .addCase(checkKycRequirement.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message;
      })
      
      // Submit KYC verification
      .addCase(submitKycVerification.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(submitKycVerification.fulfilled, (state, action) => {
        state.loading = false;
        state.kycStatus = KYC_STATUS.PENDING;
        state.verificationType = action.payload.data?.verification_type;
        state.message = "KYC verification submitted successfully";
      })
      .addCase(submitKycVerification.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message;
      })
      
      // Get KYC status
      .addCase(getKycStatus.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(getKycStatus.fulfilled, (state, action) => {
        state.loading = false;
        state.kycStatus = action.payload.data?.status || KYC_STATUS.NOT_VERIFIED;
        state.verificationType = action.payload.data?.verification_type;
        state.verificationData = action.payload.data;
      })
      .addCase(getKycStatus.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message;
      })
      
      // Update KYC status (admin)
      .addCase(updateKycStatus.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(updateKycStatus.fulfilled, (state, action) => {
        state.loading = false;
        state.message = "KYC status updated successfully";
      })
      .addCase(updateKycStatus.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message;
      });
  }
});

export const { clearKycErrorAndMessage, resetKycState } = KycSlice.actions;
export default KycSlice.reducer;
