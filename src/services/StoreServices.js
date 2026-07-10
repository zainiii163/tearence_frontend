import Api from "../api";

export default false
  ? {
      message: "You are Offline. Please! turn on the internet",
    }
  : {
      getMyStore: () => {
        return Api.get(`store/my-store`);
      },
      getStoreMembers: (storeId) => {
        return Api.get(`store/${storeId}/members`);
      },
      addStoreMember: (storeId, payload) => {
        return Api.post(`store/${storeId}/members`, payload);
      },
      updateStoreMember: (storeId, memberId, payload) => {
        return Api.put(`store/${storeId}/members/${memberId}`, payload);
      },
      removeStoreMember: (storeId, memberId) => {
        return Api.delete(`store/${storeId}/members/${memberId}`);
      },
      getStore: (customer_id) => {
        return Api.get(`store/${customer_id}/detail`);
      },
      getStoreById: (id) => {
        return Api.get(`store/${id}`);
      },
      getStoreBySlug: (slug) => {
        return Api.get(`store/slug/${slug}`);
      },
      getStoreAds: (customer_id, skip, limit) => {
        return Api.get(
          `store/${customer_id}/my-ads?skip=${skip}&limit=${limit}`
        );
      },
      updateStore: (id, payload) => {
        return Api.put(`store/${id}`, payload);
      },
      createStore: (payload) => {
        return Api.post("store", payload);
      },
      deleteStore: (id) => {
        return Api.delete(`store/${id}`);
      },
      createBusinessStore: (payload) => {
        return Api.post("business", payload);
      },
      updateBusinessStore: (id, payload) => {
        return Api.put(`business/${id}`, payload);
      },
      deleteBusinessStore: (id) => {
        return Api.delete(`business/${id}`);
      },
      getBusinessStoreBySlug: (slug) => {
        return Api.get(`business/${slug}`);
      },
      getBusinessStore: (customer_id) => {
        return Api.get(`business/${customer_id}/detail`);
      },
      getMyBusinessStore: () => {
        return Api.get(`business/my-business`);
      },
      getBusinessMembers: (businessId) => {
        return Api.get(`business/${businessId}/members`);
      },
      addBusinessMember: (businessId, payload) => {
        return Api.post(`business/${businessId}/members`, payload);
      },
      updateBusinessMember: (businessId, memberId, payload) => {
        return Api.put(`business/${businessId}/members/${memberId}`, payload);
      },
      removeBusinessMember: (businessId, memberId) => {
        return Api.delete(`business/${businessId}/members/${memberId}`);
      },
      
      // Business listing with pagination and search filters
      getBusinessList: (params = {}) => {
        const {
          page = 1,
          limit = 10,
          search = '',
          sort = 'id',
          sort_type = 'desc'
        } = params;
        
        const skip = (page - 1) * limit;
        let url = `business?skip=${skip}&limit=${limit}&sort=${sort}&sort_type=${sort_type}`;
        
        if (search) {
          url += `&search=${encodeURIComponent(search)}`;
        }
        
        return Api.get(url);
      },
      
      // Store listing with pagination and search filters
      getStoreList: (params = {}) => {
        const {
          page = 1,
          limit = 10,
          search = '',
          sort = 'store_id',
          sort_type = 'desc'
        } = params;
        
        const skip = (page - 1) * limit;
        let url = `store?skip=${skip}&limit=${limit}&sort=${sort}&sort_type=${sort_type}`;
        
        if (search) {
          url += `&search=${encodeURIComponent(search)}`;
        }
        
        return Api.get(url);
      },
      
      // Get businesses by category with pagination - DISABLED: business_category column does not exist
      // getBusinessesByCategory: (category, page = 1, limit = 10) => {
      //   const skip = (page - 1) * limit;
      //   return Api.get(`v1/business?skip=${skip}&limit=${limit}&category=${encodeURIComponent(category)}`);
      // },
      
      // Search businesses with pagination
      searchBusinesses: (searchTerm, page = 1, limit = 10) => {
        const skip = (page - 1) * limit;
        return Api.get(`business?skip=${skip}&limit=${limit}&search=${encodeURIComponent(searchTerm)}`);
      },
      
      // Search stores with pagination
      searchStores: (searchTerm, page = 1, limit = 10) => {
        const skip = (page - 1) * limit;
        return Api.get(`store?skip=${skip}&limit=${limit}&search=${encodeURIComponent(searchTerm)}`);
      },
      
      // Get featured businesses
      getFeaturedBusinesses: (page = 1, limit = 10) => {
        const skip = (page - 1) * limit;
        return Api.get(`business?skip=${skip}&limit=${limit}&featured=true`);
      },
    };
