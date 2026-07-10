import { useState, useEffect } from 'react';
import propertyApi from '../services/propertyApi';

export const usePropertyData = () => {
  const [categories, setCategories] = useState([]);
  const [propertyTypes, setPropertyTypes] = useState([]);
  const [commercialTypes, setCommercialTypes] = useState([]);
  const [landTypes, setLandTypes] = useState([]);
  const [planningPermissions, setPlanningPermissions] = useState([]);
  const [viewTypes, setViewTypes] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchAllData = async () => {
      try {
        setLoading(true);
        const [categoriesRes, propertyTypesRes, commercialTypesRes, landTypesRes, planningRes, viewTypesRes] = await Promise.all([
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
        console.error('Failed to fetch property data:', err);
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchAllData();
  }, []);

  return {
    categories,
    propertyTypes,
    commercialTypes,
    landTypes,
    planningPermissions,
    viewTypes,
    loading,
    error,
  };
};

export const usePropertySubmission = () => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(false);

  const submitProperty = async (formData) => {
    try {
      setLoading(true);
      setError(null);
      setSuccess(false);
      
      const result = await propertyApi.createProperty(formData);
      setSuccess(true);
      return result;
    } catch (err) {
      console.error('Failed to submit property:', err);
      setError(err.message || 'Failed to submit property');
      throw err;
    } finally {
      setLoading(false);
    }
  };

  return {
    submitProperty,
    loading,
    error,
    success,
  };
};

export const usePropertyList = (params = {}) => {
  const [properties, setProperties] = useState([]);
  const [meta, setMeta] = useState({});
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const fetchProperties = async (searchParams = {}) => {
    try {
      setLoading(true);
      setError(null);
      const response = await propertyApi.getProperties(searchParams);
      setProperties(response.data || []);
      setMeta(response.meta || {});
    } catch (err) {
      console.error('Failed to fetch properties:', err);
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchProperties(params);
  }, [JSON.stringify(params)]);

  return {
    properties,
    meta,
    loading,
    error,
    refetch: fetchProperties,
  };
};

export const useFeaturedProperties = () => {
  const [properties, setProperties] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchFeatured = async () => {
      try {
        setLoading(true);
        const response = await propertyApi.getFeaturedProperties();
        setProperties(response.data || []);
      } catch (err) {
        console.error('Failed to fetch featured properties:', err);
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchFeatured();
  }, []);

  return { properties, loading, error };
};

export const usePropertyStats = () => {
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchStats = async () => {
      try {
        setLoading(true);
        // For now, we'll calculate stats from the properties list
        // Backend can add a dedicated stats endpoint later
        const response = await propertyApi.getProperties({ per_page: 1 });
        setStats({
          total_properties: response.meta?.total || 0,
          active_listings: response.meta?.total || 0,
        });
      } catch (err) {
        console.error('Failed to fetch stats:', err);
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchStats();
  }, []);

  return { stats, loading, error };
};
