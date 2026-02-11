import Api from "../api";

export default false
  ? {
      message: "You are Offline. Please! turn on the internet",
    }
  : {
      // Enhanced Categories API - matches new documentation
      getCategories: () => {
        return Api.get(`v1/categories`);
      },
      getCategoryTree: () => {
        return Api.get(`v1/categories/tree`);
      },
      getCategoryById: (id) => {
        return Api.get(`v1/categories/${id}`);
      },
      getCategoryFilters: (id) => {
        return Api.get(`v1/categories/${id}/filters`);
      },
      createCategory: (data) => {
        return Api.post("v1/categories", data);
      },
      updateCategory: (id, data) => {
        return Api.put(`v1/categories/${id}`, data);
      },
      deleteCategory: (id) => {
        return Api.delete(`v1/categories/${id}`);
      },
      
      // Legacy endpoints for backward compatibility
      getCategoriesList: (is_parent) => {
        return Api.get(`v1/category?is_parent=${is_parent}`);
      },
      detailsCategory: (slug) => {
        return Api.get(`v1/category/${slug}`);
      },
      CategoryTreeChild: (id) => {
        return Api.get(`v1/category/tree?id=${id}`);
      },
      getFilterCat: () => {
        return Api.get(`v1/category/tree`);
      },
      
      // Other existing methods
      getEbayAds: () => {
        return Api.post("v1/listing/ebay");
      },
      getCurrency: () => {
        return Api.get(`v1/master/currency`);
      },
      getCountry: () => {
        return Api.get(`v1/master/country`);
      },
      getZone: (payload) => {
        return Api.get(
          `v1/master/zone?country_id=${payload?.country_id ?? ""}`
        );
      },
    };
