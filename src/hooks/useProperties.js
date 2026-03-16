// Custom hook for property data management
import { useState, useEffect, useCallback } from 'react';
import propertyApi from '../services/propertyApi';

export const useProperties = (initialFilters = {}) => {
  const [properties, setProperties] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [pagination, setPagination] = useState({
    currentPage: 1,
    totalPages: 1,
    total: 0,
    perPage: 12,
  });
  const [filters, setFilters] = useState(initialFilters);

  // Load properties with filters
  const loadProperties = useCallback(async (newFilters = {}) => {
    setLoading(true);
    setError(null);

    try {
      const searchParams = propertyApi.buildSearchParams({ ...filters, ...newFilters });
      const response = await propertyApi.getProperties(searchParams);
      
      setProperties(response.data || []);
      setPagination({
        currentPage: response.meta?.current_page || 1,
        totalPages: response.meta?.last_page || 1,
        total: response.meta?.total || 0,
        perPage: response.meta?.per_page || 12,
      });
    } catch (err) {
      setError(err.message);
      console.error('Error loading properties:', err);
    } finally {
      setLoading(false);
    }
  }, [filters]);

  // Load properties on component mount and when filters change
  useEffect(() => {
    loadProperties();
  }, [loadProperties]);

  // Update filters and reload
  const updateFilters = useCallback((newFilters) => {
    setFilters(prev => ({ ...prev, ...newFilters }));
  }, []);

  // Reset filters
  const resetFilters = useCallback(() => {
    setFilters(initialFilters);
  }, [initialFilters]);

  // Load more pages
  const loadPage = useCallback((page) => {
    loadProperties({ page });
  }, [loadProperties]);

  return {
    properties,
    loading,
    error,
    pagination,
    filters,
    updateFilters,
    resetFilters,
    loadProperties,
    loadPage,
  };
};

export const useFeaturedProperties = () => {
  const [properties, setProperties] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const loadFeaturedProperties = useCallback(async () => {
    setLoading(true);
    setError(null);

    try {
      const response = await propertyApi.getFeaturedProperties();
      setProperties(response.data || []);
    } catch (err) {
      setError(err.message);
      console.error('Error loading featured properties:', err);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    loadFeaturedProperties();
  }, [loadFeaturedProperties]);

  return {
    properties,
    loading,
    error,
    refetch: loadFeaturedProperties,
  };
};

export const usePromotedProperties = () => {
  const [properties, setProperties] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const loadPromotedProperties = useCallback(async () => {
    setLoading(true);
    setError(null);

    try {
      const response = await propertyApi.getPromotedProperties();
      setProperties(response.data || []);
    } catch (err) {
      setError(err.message);
      console.error('Error loading promoted properties:', err);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    loadPromotedProperties();
  }, [loadPromotedProperties]);

  return {
    properties,
    loading,
    error,
    refetch: loadPromotedProperties,
  };
};

export const useSponsoredProperties = () => {
  const [properties, setProperties] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const loadSponsoredProperties = useCallback(async () => {
    setLoading(true);
    setError(null);

    try {
      const response = await propertyApi.getSponsoredProperties();
      setProperties(response.data || []);
    } catch (err) {
      setError(err.message);
      console.error('Error loading sponsored properties:', err);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    loadSponsoredProperties();
  }, [loadSponsoredProperties]);

  return {
    properties,
    loading,
    error,
    refetch: loadSponsoredProperties,
  };
};

export const useProperty = (id) => {
  const [property, setProperty] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const loadProperty = useCallback(async (propertyId) => {
    setLoading(true);
    setError(null);

    try {
      const response = await propertyApi.getProperty(propertyId);
      setProperty(response.data);
      
      // Track view event
      await propertyApi.trackPropertyEvent(propertyId, 'view', {
        source: 'property_detail_page',
        timestamp: new Date().toISOString(),
      });
    } catch (err) {
      setError(err.message);
      console.error('Error loading property:', err);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    if (id) {
      loadProperty(id);
    }
  }, [id, loadProperty]);

  return {
    property,
    loading,
    error,
    refetch: () => loadProperty(id),
  };
};

export const useMyProperties = () => {
  const [properties, setProperties] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const loadMyProperties = useCallback(async () => {
    setLoading(true);
    setError(null);

    try {
      const response = await propertyApi.getMyProperties();
      setProperties(response.data || []);
    } catch (err) {
      setError(err.message);
      console.error('Error loading my properties:', err);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    loadMyProperties();
  }, [loadMyProperties]);

  return {
    properties,
    loading,
    error,
    refetch: loadMyProperties,
  };
};

export const useSavedProperties = () => {
  const [properties, setProperties] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const loadSavedProperties = useCallback(async () => {
    setLoading(true);
    setError(null);

    try {
      const response = await propertyApi.getSavedProperties();
      setProperties(response.data || []);
    } catch (err) {
      setError(err.message);
      console.error('Error loading saved properties:', err);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    loadSavedProperties();
  }, [loadSavedProperties]);

  const toggleSaveProperty = useCallback(async (propertyId) => {
    try {
      await propertyApi.toggleSaveProperty(propertyId);
      await loadSavedProperties(); // Refresh the list
    } catch (err) {
      console.error('Error toggling saved property:', err);
      throw err;
    }
  }, [loadSavedProperties]);

  return {
    properties,
    loading,
    error,
    refetch: loadSavedProperties,
    toggleSaveProperty,
  };
};

export const usePropertyData = () => {
  const [categories, setCategories] = useState([]);
  const [propertyTypes, setPropertyTypes] = useState([]);
  const [commercialTypes, setCommercialTypes] = useState([]);
  const [landTypes, setLandTypes] = useState([]);
  const [planningPermissions, setPlanningPermissions] = useState([]);
  const [viewTypes, setViewTypes] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const loadData = useCallback(async () => {
    setLoading(true);
    setError(null);

    try {
      const [
        categoriesRes,
        propertyTypesRes,
        commercialTypesRes,
        landTypesRes,
        planningRes,
        viewTypesRes,
      ] = await Promise.all([
        propertyApi.getCategories(),
        propertyApi.getPropertyTypes(),
        propertyApi.getCommercialTypes(),
        propertyApi.getLandTypes(),
        propertyApi.getPlanningPermissions(),
        propertyApi.getViewTypes(),
      ]);

      setCategories(categoriesRes.data || []);
      setPropertyTypes(propertyTypesRes.data || []);
      setCommercialTypes(commercialTypesRes.data || []);
      setLandTypes(landTypesRes.data || []);
      setPlanningPermissions(planningRes.data || []);
      setViewTypes(viewTypesRes.data || []);
    } catch (err) {
      setError(err.message);
      console.error('Error loading property data:', err);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    loadData();
  }, [loadData]);

  return {
    categories,
    propertyTypes,
    commercialTypes,
    landTypes,
    planningPermissions,
    viewTypes,
    loading,
    error,
    refetch: loadData,
  };
};

export const usePropertySubmission = () => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(false);

  const submitProperty = useCallback(async (propertyData) => {
    setLoading(true);
    setError(null);
    setSuccess(false);

    try {
      const response = await propertyApi.createProperty(propertyData);
      setSuccess(true);
      return response.data;
    } catch (err) {
      setError(err.message);
      console.error('Error submitting property:', err);
      throw err;
    } finally {
      setLoading(false);
    }
  }, []);

  const reset = useCallback(() => {
    setError(null);
    setSuccess(false);
    setLoading(false);
  }, []);

  return {
    submitProperty,
    loading,
    error,
    success,
    reset,
  };
};

export const usePropertyContact = () => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(false);

  const contactAgent = useCallback(async (propertyId, contactData) => {
    setLoading(true);
    setError(null);
    setSuccess(false);

    try {
      const response = await propertyApi.contactAgent(propertyId, contactData);
      
      // Track contact event
      await propertyApi.trackPropertyEvent(propertyId, 'contact', {
        type: contactData.type,
        timestamp: new Date().toISOString(),
      });
      
      setSuccess(true);
      return response.data;
    } catch (err) {
      setError(err.message);
      console.error('Error contacting agent:', err);
      throw err;
    } finally {
      setLoading(false);
    }
  }, []);

  const reset = useCallback(() => {
    setError(null);
    setSuccess(false);
    setLoading(false);
  }, []);

  return {
    contactAgent,
    loading,
    error,
    success,
    reset,
  };
};
