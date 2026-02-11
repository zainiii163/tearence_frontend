import Api from "../api";

export default false
  ? {
      message: "You are Offline. Please! turn on the internet",
    }
  : {
      signIn: (formdata) => {
        return Api.post("v1/auth/web-login", formdata);
      },
      signInAdmin: (formdata) => {
        return Api.post("v1/auth/login-admin", formdata);
      },
      signUp: (formdata) => {
        return Api.post("v1/auth/register", formdata);
      },
      logOut: () => {
        return Api.post("v1/auth/web-logout");
      },
      forgotPassword: (payload) => {
        return Api.post("/v1/auth/forgot-password", payload);
      },
      resetPassword: (formdata) => {
        return Api.post("v1/auth/reset-password", formdata);
      },
      refreshToken: () => {
        return Api.post("v1/auth/refresh");
      },
      getUserDetails: () => {
        return Api.get("v1/auth/user-profile");
      },
      checkAuth: () => {
        return Api.get("v1/auth/web-check");
      },
      // updateUserDetails: (id, payload) => {
      //   return Api.put("v1/auth/user-profile", payload);
      // },
      updateUserDetails: (id, payload) => {
        return Api.put(`v1/customer/${id}`, payload);
      },
      updateUserAvatar: (id, payload) => {
        return Api.post(`v1/customer/upload-avatar/${id}`, payload);
      },
      changePassword: (payload) => {
        return Api.post("v1/auth/change-password", payload);
      },
    };
