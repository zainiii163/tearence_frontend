import { useState, useEffect, useCallback } from 'react';
import fundingService from '../services/FundingService';

// Custom hook for managing funding projects data
export const useFundingData = (filters = {}) => {
  const [projects, setProjects] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [pagination, setPagination] = useState({
    currentPage: 1,
    totalPages: 1,
    totalItems: 0,
    itemsPerPage: 12
  });

  const fetchProjects = useCallback(async (page = 1, newFilters = {}) => {
    setLoading(true);
    setError(null);
    
    try {
      const params = {
        page,
        limit: pagination.itemsPerPage,
        ...filters,
        ...newFilters
      };
      
      const response = await fundingService.getProjects(params);
      
      // Handle different response structures
      const projectsData = Array.isArray(response?.data) ? response.data : 
                          Array.isArray(response) ? response : [];
      
      setProjects(projectsData);
      setPagination(prev => ({
        ...prev,
        currentPage: response?.current_page || page,
        totalPages: response?.total_pages || 1,
        totalItems: response?.total || projectsData.length
      }));
    } catch (err) {
      console.error('Error fetching projects:', err);
      setError(err.response?.data?.message || 'Failed to fetch projects');
      setProjects([]);
    } finally {
      setLoading(false);
    }
  }, [filters, pagination.itemsPerPage]);

  useEffect(() => {
    fetchProjects();
  }, [fetchProjects]);

  const refetch = useCallback((newFilters = {}) => {
    fetchProjects(1, newFilters);
  }, [fetchProjects]);

  const loadMore = useCallback(() => {
    if (pagination.currentPage < pagination.totalPages && !loading) {
      fetchProjects(pagination.currentPage + 1);
    }
  }, [pagination.currentPage, pagination.totalPages, loading, fetchProjects]);

  return {
    projects,
    loading,
    error,
    pagination,
    refetch,
    loadMore,
    fetchProjects
  };
};

// Custom hook for managing a single project
export const useProject = (projectId) => {
  const [project, setProject] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const fetchProject = useCallback(async () => {
    if (!projectId) return;
    
    setLoading(true);
    setError(null);
    
    try {
      const response = await fundingService.getProject(projectId);
      setProject(response.data);
    } catch (err) {
      console.error('Error fetching project:', err);
      setError(err?.message || err?.response?.data?.message || 'Failed to fetch project');
      setProject(null);
    } finally {
      setLoading(false);
    }
  }, [projectId]);

  useEffect(() => {
    fetchProject();
  }, [fetchProject]);

  const updateProject = useCallback(async (projectData) => {
    setLoading(true);
    setError(null);
    
    try {
      const response = await fundingService.updateProject(projectId, projectData);
      setProject(response.data);
      return response.data;
    } catch (err) {
      console.error('Error updating project:', err);
      setError(err.response?.data?.message || 'Failed to update project');
      throw err;
    } finally {
      setLoading(false);
    }
  }, [projectId]);

  return {
    project,
    loading,
    error,
    refetch: fetchProject,
    updateProject
  };
};

// Custom hook for managing user's projects
export const useMyProjects = () => {
  const [projects, setProjects] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const fetchMyProjects = useCallback(async () => {
    setLoading(true);
    setError(null);
    
    try {
      const response = await fundingService.getProjects({ user_projects: true });
      const projectsData = Array.isArray(response?.data) ? response.data : 
                          Array.isArray(response) ? response : [];
      setProjects(projectsData);
    } catch (err) {
      console.error('Error fetching my projects:', err);
      setError(err.response?.data?.message || 'Failed to fetch your projects');
      setProjects([]);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchMyProjects();
  }, [fetchMyProjects]);

  return {
    projects,
    loading,
    error,
    refetch: fetchMyProjects
  };
};

// Custom hook for managing promotion plans
export const usePromotionPlans = () => {
  const [plans, setPlans] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const fetchPlans = useCallback(async () => {
    setLoading(true);
    setError(null);
    
    try {
      const response = await fundingService.getUpsellPlans();
      const plansData = Array.isArray(response?.data) ? response.data : 
                       Array.isArray(response) ? response : [];
      setPlans(plansData);
    } catch (err) {
      console.error('Error fetching promotion plans:', err);
      setError(err.response?.data?.message || 'Failed to fetch promotion plans');
      setPlans([]);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchPlans();
  }, [fetchPlans]);

  return {
    plans,
    loading,
    error,
    refetch: fetchPlans
  };
};

// Custom hook for managing project funding details
export const useProjectFundingDetails = (projectId) => {
  const [fundingDetails, setFundingDetails] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const fetchFundingDetails = useCallback(async () => {
    if (!projectId) return;
    
    setLoading(true);
    setError(null);
    
    try {
      const response = await fundingService.getFundingDetails(projectId);
      setFundingDetails(response.data);
    } catch (err) {
      console.error('Error fetching funding details:', err);
      setError(err.response?.data?.message || 'Failed to fetch funding details');
      setFundingDetails(null);
    } finally {
      setLoading(false);
    }
  }, [projectId]);

  useEffect(() => {
    fetchFundingDetails();
  }, [fetchFundingDetails]);

  const updateFundingDetails = useCallback(async (details) => {
    setLoading(true);
    setError(null);
    
    try {
      const response = await fundingService.updateFundingDetails(projectId, details);
      setFundingDetails(response.data);
      return response.data;
    } catch (err) {
      console.error('Error updating funding details:', err);
      setError(err.response?.data?.message || 'Failed to update funding details');
      throw err;
    } finally {
      setLoading(false);
    }
  }, [projectId]);

  return {
    fundingDetails,
    loading,
    error,
    refetch: fetchFundingDetails,
    updateFundingDetails
  };
};

// Custom hook for managing project rewards
export const useProjectRewards = (projectId) => {
  const [rewards, setRewards] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const fetchRewards = useCallback(async () => {
    if (!projectId) return;
    
    setLoading(true);
    setError(null);
    
    try {
      const response = await fundingService.getRewards(projectId);
      const rewardsData = Array.isArray(response?.data) ? response.data : 
                        Array.isArray(response) ? response : [];
      setRewards(rewardsData);
    } catch (err) {
      console.error('Error fetching rewards:', err);
      setError(err.response?.data?.message || 'Failed to fetch rewards');
      setRewards([]);
    } finally {
      setLoading(false);
    }
  }, [projectId]);

  useEffect(() => {
    fetchRewards();
  }, [fetchRewards]);

  const updateRewards = useCallback(async (rewardsData) => {
    setLoading(true);
    setError(null);
    
    try {
      const response = await fundingService.updateRewards(projectId, rewardsData);
      const updatedRewardsData = Array.isArray(response?.data) ? response.data : 
                                  Array.isArray(response) ? response : [];
      setRewards(updatedRewardsData);
      return response.data;
    } catch (err) {
      console.error('Error updating rewards:', err);
      setError(err.response?.data?.message || 'Failed to update rewards');
      throw err;
    } finally {
      setLoading(false);
    }
  }, [projectId]);

  return {
    rewards,
    loading,
    error,
    refetch: fetchRewards,
    updateRewards
  };
};

// Custom hook for managing project marketing assets
export const useProjectMarketingAssets = (projectId) => {
  const [marketingAssets, setMarketingAssets] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const fetchMarketingAssets = useCallback(async () => {
    if (!projectId) return;
    
    setLoading(true);
    setError(null);
    
    try {
      const response = await fundingService.getMarketingAssets(projectId);
      setMarketingAssets(response.data);
    } catch (err) {
      console.error('Error fetching marketing assets:', err);
      setError(err.response?.data?.message || 'Failed to fetch marketing assets');
      setMarketingAssets(null);
    } finally {
      setLoading(false);
    }
  }, [projectId]);

  useEffect(() => {
    fetchMarketingAssets();
  }, [fetchMarketingAssets]);

  const updateMarketingAssets = useCallback(async (assets) => {
    setLoading(true);
    setError(null);
    
    try {
      const response = await fundingService.updateMarketingAssets(projectId, assets);
      setMarketingAssets(response.data);
      return response.data;
    } catch (err) {
      console.error('Error updating marketing assets:', err);
      setError(err.response?.data?.message || 'Failed to update marketing assets');
      throw err;
    } finally {
      setLoading(false);
    }
  }, [projectId]);

  return {
    marketingAssets,
    loading,
    error,
    refetch: fetchMarketingAssets,
    updateMarketingAssets
  };
};

// Custom hook for managing file uploads
export const useFileUpload = () => {
  const [uploading, setUploading] = useState(false);
  const [progress, setProgress] = useState(0);
  const [error, setError] = useState(null);

  const uploadFile = useCallback(async (projectId, file, documentType) => {
    setUploading(true);
    setProgress(0);
    setError(null);
    
    try {
      const response = await fundingService.uploadDocument(
        projectId, 
        file, 
        documentType,
        file.name
      );
      
      setProgress(100);
      return response.data;
    } catch (err) {
      console.error('Error uploading file:', err);
      setError(err.response?.data?.message || 'Failed to upload file');
      throw err;
    } finally {
      setUploading(false);
      setTimeout(() => setProgress(0), 1000);
    }
  }, []);

  const resetUpload = useCallback(() => {
    setUploading(false);
    setProgress(0);
    setError(null);
  }, []);

  return {
    uploading,
    progress,
    error,
    uploadFile,
    resetUpload
  };
};

// Custom hook for funding statistics
export const useFundingStats = () => {
  const [stats, setStats] = useState({
    totalProjects: 0,
    activeProjects: 0,
    totalFunding: 0,
    successRate: 0,
    featuredProjects: []
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const fetchStats = useCallback(async () => {
    setLoading(true);
    setError(null);
    
    try {
      const [projectsResponse, featuredResponse, upsellsResponse] = await Promise.all([
        fundingService.getProjects({ status: 'active', limit: 1 }),
        fundingService.getFeaturedProjects(),
        fundingService.getPlatformStats()
      ]);
      
      const projectsData = Array.isArray(projectsResponse?.data) ? projectsResponse.data : 
                          Array.isArray(projectsResponse) ? projectsResponse : [];
      const featuredData = Array.isArray(featuredResponse?.data) ? featuredResponse.data : 
                          Array.isArray(featuredResponse) ? featuredResponse : [];
      
      setStats({
        totalProjects: projectsResponse?.total || projectsData.length,
        activeProjects: projectsData.length,
        totalFunding: upsellsResponse?.data?.total_funding || 0,
        successRate: upsellsResponse?.data?.success_rate || 0,
        featuredProjects: featuredData
      });
    } catch (err) {
      console.error('Error fetching funding stats:', err);
      setError(err.response?.data?.message || 'Failed to fetch statistics');
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchStats();
  }, [fetchStats]);

  return {
    stats,
    loading,
    error,
    refetch: fetchStats
  };
};
