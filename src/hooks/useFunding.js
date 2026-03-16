import { useState, useEffect, useCallback } from 'react';
import fundingService from '../services/FundingService';

export const useFunding = () => {
  const [projects, setProjects] = useState([]);
  const [featuredProjects, setFeaturedProjects] = useState([]);
  const [trendingProjects, setTrendingProjects] = useState([]);
  const [endingSoonProjects, setEndingSoonProjects] = useState([]);
  const [metadata, setMetadata] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  // Load all projects with filters
  const loadProjects = useCallback(async (filters = {}) => {
    setLoading(true);
    setError(null);
    try {
      const response = await fundingService.getProjects(filters);
      setProjects(response.data || []);
    } catch (err) {
      setError(err.message || 'Failed to load projects');
      console.error('Error loading projects:', err);
    } finally {
      setLoading(false);
    }
  }, []);

  // Load featured projects
  const loadFeaturedProjects = useCallback(async () => {
    try {
      const response = await fundingService.getFeaturedProjects();
      setFeaturedProjects(response.data || []);
    } catch (err) {
      console.error('Error loading featured projects:', err);
    }
  }, []);

  // Load trending projects
  const loadTrendingProjects = useCallback(async () => {
    try {
      const response = await fundingService.getTrendingProjects();
      setTrendingProjects(response.data || []);
    } catch (err) {
      console.error('Error loading trending projects:', err);
    }
  }, []);

  // Load projects ending soon
  const loadEndingSoonProjects = useCallback(async () => {
    try {
      const response = await fundingService.getEndingSoonProjects();
      setEndingSoonProjects(response.data || []);
    } catch (err) {
      console.error('Error loading ending soon projects:', err);
    }
  }, []);

  // Load metadata
  const loadMetadata = useCallback(async () => {
    try {
      const response = await fundingService.getMetadata();
      setMetadata(response.data || {});
    } catch (err) {
      console.error('Error loading metadata:', err);
    }
  }, []);

  // Create new project
  const createProject = useCallback(async (projectData) => {
    setLoading(true);
    setError(null);
    try {
      const response = await fundingService.createProject(projectData);
      // Refresh projects list
      await loadProjects();
      return response.data;
    } catch (err) {
      setError(err.message || 'Failed to create project');
      throw err;
    } finally {
      setLoading(false);
    }
  }, [loadProjects]);

  // Get single project
  const getProject = useCallback(async (id) => {
    setLoading(true);
    setError(null);
    try {
      const response = await fundingService.getProject(id);
      return response.data;
    } catch (err) {
      setError(err.message || 'Failed to load project');
      throw err;
    } finally {
      setLoading(false);
    }
  }, []);

  // Make a pledge
  const makePledge = useCallback(async (projectId, pledgeData) => {
    setLoading(true);
    setError(null);
    try {
      const response = await fundingService.pledges.makePledge(projectId, pledgeData);
      // Refresh project data to show new pledge
      await loadProjects();
      return response.data;
    } catch (err) {
      setError(err.message || 'Failed to make pledge');
      throw err;
    } finally {
      setLoading(false);
    }
  }, [loadProjects]);

  // Purchase upsell
  const purchaseUpsell = useCallback(async (projectId, upsellData) => {
    setLoading(true);
    setError(null);
    try {
      const response = await fundingService.purchases?.purchaseUpsell?.(projectId, upsellData) || 
                      await fundingService.purchaseUpsell(projectId, upsellData);
      // Refresh projects to show new promotion status
      await loadProjects();
      return response.data;
    } catch (err) {
      setError(err.message || 'Failed to purchase upsell');
      throw err;
    } finally {
      setLoading(false);
    }
  }, [loadProjects]);

  // Load initial data
  useEffect(() => {
    loadProjects();
    loadFeaturedProjects();
    loadTrendingProjects();
    loadEndingSoonProjects();
    loadMetadata();
  }, [loadProjects, loadFeaturedProjects, loadTrendingProjects, loadEndingSoonProjects, loadMetadata]);

  return {
    // Data
    projects,
    featuredProjects,
    trendingProjects,
    endingSoonProjects,
    metadata,
    
    // State
    loading,
    error,
    
    // Actions
    loadProjects,
    loadFeaturedProjects,
    loadTrendingProjects,
    loadEndingSoonProjects,
    loadMetadata,
    createProject,
    getProject,
    makePledge,
    purchaseUpsell,
    
    // Clear error
    clearError: () => setError(null)
  };
};

export default useFunding;
