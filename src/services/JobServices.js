import api from "../api";

const jobService = {
  getJobsList: async (params) => {
    const queryParams = new URLSearchParams();
    
    // Pagination - Production API uses page/per_page
    if (params?.page) {
      queryParams.append("page", params.page);
    }
    
    if (params?.per_page) {
      queryParams.append("per_page", params.per_page);
    } else if (params?.limit) {
      queryParams.append("per_page", params.limit);
    }
    
    // Search - Production API uses "keyword" parameter
    if (params?.keyword) {
      queryParams.append("keyword", params.keyword);
    } else if (params?.search) {
      queryParams.append("keyword", params.search);
    }
    
    // Filters
    if (params?.job_type) queryParams.append("job_type", params.job_type);
    if (params?.jobType) queryParams.append("job_type", params.jobType);
    if (params?.salary_min !== undefined) queryParams.append("salary_min", params.salary_min);
    if (params?.salary_max !== undefined) queryParams.append("salary_max", params.salary_max);
    // Filters - Production API uses location_id and category_id
    if (params?.location_id) queryParams.append("location_id", params.location_id);
    if (params?.location) {
      // If location is passed as string/number, try to use it as location_id
      queryParams.append("location_id", params.location);
    }
    if (params?.category_id) queryParams.append("category_id", params.category_id);
    if (params?.category) {
      // If category is passed as string/number, try to use it as category_id
      queryParams.append("category_id", params.category);
    }
    if (params?.featured !== undefined) queryParams.append("featured", params.featured);
    if (params?.suggested !== undefined) queryParams.append("suggested", params.suggested);
    
    // Sorting - Map frontend sort values to backend column names
    if (params?.sort || params?.sortBy || params?.sort_by) {
      const sortValue = params?.sort || params?.sortBy || params?.sort_by;
      
      // Map common sort values to backend column names
      const sortMapping = {
        "newest": "created_at",
        "oldest": "created_at", 
        "salary_low": "salary_min",
        "salary_high": "salary_max",
        "relevance": "created_at",
      };
      
      const mappedSort = sortMapping[sortValue] || sortValue || "created_at";
      
      // Determine sort direction based on sort type
      let sortDirection = "desc";
      if (sortValue === "oldest" || sortValue === "salary_low") {
        sortDirection = "asc";
      }
      
      // Backend expects column name in sort parameter, direction in order parameter
      // But if backend uses different format, we may need to adjust
      queryParams.append("sort", mappedSort);
      if (params?.order) {
        queryParams.append("order", params.order);
      } else {
        queryParams.append("order", sortDirection);
      }
    } else {
      // Default sorting if none specified
      queryParams.append("sort", "created_at");
      queryParams.append("order", "desc");
    }
    
    if (params?.sort_type) {
      queryParams.append("sort_type", params.sort_type);
    }

    // Use production endpoint: /v1/listing
    return await api.get(`/v1/listing?${queryParams.toString()}`);
  },

  getJobDetail: async (jobId) => {
    // Use production endpoint: /v1/listing/:id (supports both ID and slug)
    return await api.get(`/v1/listing/${jobId}`);
  },

  getJobBySlug: async (slug) => {
    // Use production endpoint: /v1/listing/:slug
    return await api.get(`/v1/listing/${slug}`);
  },

  getMyListings: async (params = {}) => {
    // GET /v1/listing/my-listing - Gets all listings for authenticated user automatically
    // Supports: per_page, limit, skip, status, title query parameters
    const queryParams = new URLSearchParams();
    
    // Pagination
    if (params?.per_page) {
      queryParams.append("per_page", params.per_page);
    } else if (params?.limit) {
      queryParams.append("per_page", params.limit);
    }
    if (params?.page) {
      queryParams.append("page", params.page);
    }
    if (params?.skip !== undefined) {
      queryParams.append("skip", params.skip);
    }
    
    // Filters
    if (params?.status) {
      queryParams.append("status", params.status);
    }
    if (params?.title) {
      queryParams.append("title", params.title);
    }
    
    const url = queryParams.toString() 
      ? `/v1/listing/my-listing?${queryParams.toString()}`
      : `/v1/listing/my-listing`;
    
    return await api.get(url);
  },

  getFeaturedListings: async (params = {}) => {
    // POST /v1/listing/featured per API collection
    const payload = {
      limit: params.limit || params.per_page || 10,
    };
    return await api.post("/v1/listing/featured", payload);
  },

  getNewListings: async (params = {}) => {
    // POST /v1/listing/new per API collection
    const payload = {
      limit: params.limit || params.per_page || 10,
    };
    return await api.post("/v1/listing/new", payload);
  },

  getPromotedListings: async (params = {}) => {
    // POST /v1/listing/promoted per API collection
    const payload = {
      limit: params.limit || params.per_page || 10,
    };
    return await api.post("/v1/listing/promoted", payload);
  },

  getEbayListings: async (params = {}) => {
    // GET /v1/listing/ebay per API collection
    const queryParams = new URLSearchParams();
    if (params?.page) queryParams.append("page", params.page);
    if (params?.per_page) queryParams.append("per_page", params.per_page || params.limit);
    
    const url = queryParams.toString() 
      ? `/v1/listing/ebay?${queryParams.toString()}`
      : `/v1/listing/ebay`;
    
    return await api.get(url);
  },

  getClassifiedListing: async (slug) => {
    // GET /v1/listing/:slug/classified per API collection
    return await api.get(`/v1/listing/${slug}/classified`);
  },

  globalListingSearch: async (searchData) => {
    // POST /v1/listing/global per API collection
    const payload = {
      query: searchData.query || searchData.search || "",
      category_id: searchData.category_id || null,
      location_id: searchData.location_id || null,
    };
    return await api.post("/v1/listing/global", payload);
  },

  createJob: async (jobData) => {
    // Format payload according to production API
    // location_id is required - must be a number, not a string
    const locationId = jobData.location_id;
    if (!locationId || locationId === '' || isNaN(Number(locationId))) {
      throw new Error("Location is required. Please select a location from the dropdown.");
    }
    
    // category_id is required - must be a number
    const categoryId = jobData.category_id || jobData.category;
    if (!categoryId || categoryId === '' || isNaN(Number(categoryId))) {
      throw new Error("Category is required. Please select a category from the dropdown.");
    }
    
    // Calculate price - required field
    // For jobs, use salary_min as price, or 0 if not provided
    let price = 0;
    if (jobData.salary_min) {
      price = Number(jobData.salary_min);
    } else if (jobData.price) {
      price = Number(jobData.price);
    }
    // Ensure price is a valid number
    if (isNaN(price) || price < 0) {
      price = 0;
    }
    
    // Build payload according to API collection specification
    const payload = {
      title: jobData.title,
      description: jobData.description,
      category_id: Number(categoryId),
      location_id: Number(locationId),
      price: price, // Required field - cannot be null
      job_type: jobData.job_type || null,
      salary_min: jobData.salary_min ? Number(jobData.salary_min) : null,
      salary_max: jobData.salary_max ? Number(jobData.salary_max) : null,
      currency_id: jobData.currency_id ? Number(jobData.currency_id) : null,
      apply_url: jobData.apply_url || null,
      end_date: jobData.end_date || null,
    };
    
    // Add optional fields from API collection
    if (jobData.company_name) {
      payload.company_name = jobData.company_name.trim();
    }
    if (jobData.company_logo) {
      payload.company_logo = jobData.company_logo;
    }
    
    // Add boolean flags from API collection (default to false)
    payload.is_paid = jobData.is_paid || false;
    payload.is_promoted = jobData.is_promoted || false;
    payload.is_sponsored = jobData.is_sponsored || false;
    payload.is_business = jobData.is_business || false;
    payload.is_store = jobData.is_store || false;
    
    // Add images array if provided
    if (jobData.images && Array.isArray(jobData.images)) {
      payload.images = jobData.images;
    } else if (jobData.images) {
      payload.images = [jobData.images];
    } else {
      payload.images = [];
    }
    
    // Clean up null values for optional fields (but keep price as it's required)
    // Remove null values that might cause issues
    Object.keys(payload).forEach(key => {
      if (payload[key] === null && key !== 'price' && !['is_paid', 'is_promoted', 'is_sponsored', 'is_business', 'is_store'].includes(key)) {
        delete payload[key];
      }
    });
    
    // Use production endpoint: /v1/listing
    return await api.post("/v1/listing", payload);
  },

  updateJob: async (jobId, jobData) => {
    // Format payload same as create
    // Include price if salary_min is provided or if price is explicitly set
    let price = undefined;
    if (jobData.salary_min !== undefined && jobData.salary_min !== null) {
      price = Number(jobData.salary_min);
      if (isNaN(price) || price < 0) {
        price = 0;
      }
    } else if (jobData.price !== undefined) {
      price = Number(jobData.price);
      if (isNaN(price) || price < 0) {
        price = 0;
      }
    }
    
    const payload = {
      ...(jobData.title && { title: jobData.title }),
      ...(jobData.description && { description: jobData.description }),
      ...(jobData.company_name && { company_name: jobData.company_name }),
      ...(jobData.company_logo && { company_logo: jobData.company_logo }),
      ...(jobData.location_id && { location_id: Number(jobData.location_id) }),
      ...(jobData.job_type && { job_type: jobData.job_type }),
      ...(jobData.salary_min !== undefined && { salary_min: jobData.salary_min }),
      ...(jobData.salary_max !== undefined && { salary_max: jobData.salary_max }),
      ...(jobData.currency_id && { currency_id: Number(jobData.currency_id) }),
      ...(jobData.apply_url && { apply_url: jobData.apply_url }),
      ...(jobData.category_id && { category_id: Number(jobData.category_id) }),
      ...(jobData.end_date && { end_date: jobData.end_date }),
      ...(price !== undefined && { price: price }),
    };
    
    // Use production endpoint: /v1/listing/:id
    return await api.put(`/v1/listing/${jobId}`, payload);
  },

  deleteJob: async (jobId) => {
    // Use production endpoint: /v1/listing/:id
    return await api.delete(`/v1/listing/${jobId}`);
  },

  activateJobUpsell: async (jobId, upsellData) => {
    // Use production endpoint: POST /v1/job-upsell
    // Payload uses listing_id per production API
    const payload = {
      listing_id: jobId,
      upsell_type: upsellData.upsell_type,
      duration_days: upsellData.duration_days || 30,
    };
    
    return await api.post("/v1/job-upsell", payload);
  },
};

export default jobService;

