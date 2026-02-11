import Api from "../api";

export default false
  ? {
      message: "You are Offline. Please! turn on the internet",
    }
  : {
      getBannerList: (payload) => {
        if (payload.user_id) {
          return Api.get(
            `v1/banner?skip=${payload.skip}&limit=${
              payload.limit
            }&sort=id&sort_type=${payload.sort_type}&user_id=${
              payload.user_id ?? ""
            }`
          );
        }
        return Api.get(
          `v1/banner?skip=${payload.skip}&limit=${payload.limit}&sort=id&sort_type=${payload.sort_type}`
        );
      },
      createBanner: (data) => {
        return Api.post("v1/banner", data);
      },
      updateBanner: (id, formData) => {
        return Api.put(`v1/banner/${id}`, formData);
      },
      deleteBanner: (id) => {
        return Api.delete(`v1/banner/${id}`);
      },
      getMyBanner: (payload) => {
        return Api.get(
          `v1/banner/my-banner?skip=${payload.skip}&limit=${payload.limit}&sort=id&sort_type=${payload.sort_type}`
        );
      },
      getBannerBySlug: (slug) => {
        return Api.get(`v1/banner/${slug}`);
      },
      uploadBannerImage: async (formData) => {
        // Import server function dynamically to use axios instance directly
        const { server } = await import("../api");
        const axiosInstance = await server();
        return await axiosInstance.post("v1/banner/upload", formData, {
          headers: {
            "Content-Type": "multipart/form-data",
          },
        });
      },
    };
