import Api from "../api";

export default false
  ? {
      message: "You are Offline. Please! turn on the internet",
    }
  : {
      // Enhanced Categories API - matches new documentation
      getCategories: () => {
        return Api.get(`categories`);
      },
      getCategoryTree: () => {
        return Api.get(`categories/tree`);
      },
      getCategoryById: (id) => {
        return Api.get(`categories/${id}`);
      },
      getCategoryFilters: (id) => {
        return Api.get(`categories/${id}/filters`);
      },
      createCategory: (data) => {
        return Api.post("categories", data);
      },
      updateCategory: (id, data) => {
        return Api.put(`categories/${id}`, data);
      },
      deleteCategory: (id) => {
        return Api.delete(`categories/${id}`);
      },
      
      // Legacy endpoints for backward compatibility
      getCategoriesList: (is_parent = "yes") => {
        return Api.get(`/category?is_parent=${is_parent}`);
      },
      detailsCategory: (slug) => {
        return Api.get(`/category/${slug}`);
      },
      CategoryTreeChild: (id) => {
        return Api.get(`/category/tree?id=${id}`);
      },
      getFilterCat: () => {
        return Api.get(`/category/tree`);
      },
      
      // Other existing methods
      getEbayAds: () => {
        return Api.post("listing/ebay");
      },
      getCurrency: () => {
        return Api.get(`master/currency`);
      },
      getCountry: () => {
        return Api.get(`/master/country`);
      },
      getZone: (payload) => {
        return Api.get(
          `master/zone?country_id=${payload?.country_id ?? ""}`
        );
      },
    };
