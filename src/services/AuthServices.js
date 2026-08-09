import Api from "../api";
import { validateToken } from "../utils/tokenValidator";

export default false
  ? {
      message: "You are Offline. Please! turn on the internet",
    }
  : {
      signIn: (formdata) => {
        return Api.post("/auth/web-login", formdata);
      },
      signInAdmin: (formdata) => {
        return Api.post("auth/login-admin", formdata);
      },
      signUp: (formdata) => {
        return Api.post("/auth/register", formdata);
      },
      logOut: () => {
        return Api.post("/auth/web-logout");
      },
      forgotPassword: (payload) => {
        return Api.post("/auth/forgot-password", payload);
      },
      resetPassword: (formdata) => {
        return Api.post("/auth/reset-password", formdata);
      },
      refreshToken: () => {
        return Api.post("/auth/refresh");
      },
      getUserDetails: () => {
        return Api.get("/auth/user-profile");
      },
      checkAuth: () => {
        // First validate token format before making API call
        const validation = validateToken();
        if (!validation.valid) {
          console.warn('Token validation failed in checkAuth:', validation);
          return Promise.reject({ 
            response: { 
              status: 401, 
              data: { message: validation.reason } 
            } 
          });
        }
        
        console.log('✅ Token validation passed, making checkAuth API call');
        return Api.get("/auth/web-check");
      },
      // updateUserDetails: (id, payload) => {
      //   return Api.put("v1/auth/user-profile", payload);
      // },
      updateUserDetails: (id, payload) => {
        return Api.put(`customer/${id}`, payload);
      },
      updateUserAvatar: (id, payload) => {
        return Api.post(`customer/upload-avatar/${id}`, payload);
      },
      changePassword: (payload) => {
        return Api.post("auth/change-password", payload);
      },
    };
