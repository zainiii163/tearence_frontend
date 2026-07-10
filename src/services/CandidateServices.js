import api from "../api";

const candidateService = {
  getCandidatesList: async (params) => {
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
    
    // Search - Production API uses "search" parameter for candidates
    if (params?.search) {
      queryParams.append("search", params.search);
    } else if (params?.keyword) {
      queryParams.append("search", params.keyword);
    }
    
    // Filters - Production API format
    if (params?.location_id) queryParams.append("location_id", params.location_id);
    if (params?.location) {
      queryParams.append("location_id", params.location);
    }
    if (params?.skills) {
      // API expects array - join if array, otherwise use as is
      if (Array.isArray(params.skills)) {
        queryParams.append("skills", params.skills.join(","));
      } else {
        queryParams.append("skills", params.skills);
      }
    }
    if (params?.visibility) queryParams.append("visibility", params.visibility);
    if (params?.is_featured !== undefined) queryParams.append("is_featured", params.is_featured);
    
    // Sorting - API docs use "sort_by"
    if (params?.sort_by) {
      queryParams.append("sort_by", params.sort_by);
    } else if (params?.sort) {
      queryParams.append("sort_by", params.sort);
    } else if (params?.sortBy) {
      queryParams.append("sort_by", params.sortBy);
    }

    // Use production endpoint: /v1/candidate-profile
    return await api.get(`/candidate-profile?${queryParams.toString()}`);
  },

  getMyProfile: async () => {
    // Use production endpoint: /v1/candidate-profile/my-profile
    return await api.get("/candidate-profile/my-profile");
  },

  getCandidateProfile: async (candidateId) => {
    // Use production endpoint: /v1/candidate-profile/:id
    return await api.get(`/candidate-profile/${candidateId}`);
  },

  createCandidateProfile: async (profileData) => {
    // Validate location_id is a number
    const locationId = profileData.location_id;
    if (!locationId || locationId === '' || isNaN(Number(locationId))) {
      throw new Error("Location is required. Please select a location from the dropdown.");
    }
    
    // Format payload according to production API
    const payload = {
      headline: profileData.headline.trim(),
      summary: profileData.summary.trim(),
      skills: Array.isArray(profileData.skills) ? profileData.skills : (profileData.skills ? [profileData.skills] : []),
      cv_url: profileData.cv_url?.trim() || null,
      location_id: Number(locationId),
      visibility: profileData.visibility || "public",
    };
    
    // Add country_id if provided
    if (profileData.country_id) {
      payload.country_id = Number(profileData.country_id);
    }
    
    // Use production endpoint: /v1/candidate-profile
    return await api.post("/candidate-profile", payload);
  },

  updateCandidateProfile: async (candidateId, profileData) => {
    // Format payload same as create (all fields optional)
    const payload = {};
    
    if (profileData.headline) payload.headline = profileData.headline;
    if (profileData.summary) payload.summary = profileData.summary;
    if (profileData.skills) {
      payload.skills = Array.isArray(profileData.skills) ? profileData.skills : [profileData.skills];
    }
    if (profileData.cv_url) payload.cv_url = profileData.cv_url;
    if (profileData.location_id) payload.location_id = profileData.location_id;
    if (profileData.location) payload.location_id = profileData.location;
    if (profileData.visibility) payload.visibility = profileData.visibility;
    
    // Use production endpoint: /v1/candidate-profile/:id
    return await api.put(`/candidate-profile/${candidateId}`, payload);
  },

  activateCandidateUpsell: async (candidateId, upsellData) => {
    // Use production endpoint: POST /v1/candidate-upsell
    // Payload uses candidate_profile_id per production API
    const payload = {
      candidate_profile_id: candidateId,
      upsell_type: upsellData.upsell_type, // "featured_profile" or "job_alerts_boost"
      duration_days: upsellData.duration_days || 30,
    };
    
    return await api.post("/candidate-upsell", payload);
  },

  deleteCandidateProfile: async (candidateId) => {
    // Use production endpoint: DELETE /v1/candidate-profile/:id
    return await api.delete(`/candidate-profile/${candidateId}`);
  },
};

export default candidateService;

