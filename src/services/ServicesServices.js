import api from "../api";

const servicesService = {
  getServicesList: async (params) => {
    const queryParams = new URLSearchParams();
    if (params?.priceMin) queryParams.append("min_price", params.priceMin);
    if (params?.priceMax) queryParams.append("max_price", params.priceMax);
    if (params?.location) queryParams.append("location", params.location);
    if (params?.category) queryParams.append("category", params.category || "services");
    if (params?.sortBy) queryParams.append("sort_by", params.sortBy);
    if (params?.skip !== undefined) queryParams.append("skip", params.skip);
    if (params?.limit) queryParams.append("limit", params.limit);
    if (params?.search) queryParams.append("search", params.search);

    // Use the listing API with services category
    const category = params?.category || "services";
    return await api.get(`/v1/listing?category=${category}&${queryParams.toString()}`);
  },

  getServiceDetail: async (serviceId) => {
    return await api.get(`/v1/listing/${serviceId}`);
  },

  createService: async (serviceData) => {
    return await api.post("/v1/listing", { ...serviceData, category: "services" });
  },

  updateService: async (serviceId, serviceData) => {
    return await api.put(`/v1/listing/${serviceId}`, serviceData);
  },

  deleteService: async (serviceId) => {
    return await api.delete(`/v1/listing/${serviceId}`);
  },
};

export default servicesService;

