import { useState, useEffect, useCallback } from 'react';
import {
  getBannerAds,
  getFeaturedBannerAds,
  getBannerCategories,
  getBannerAnalytics
} from '../api/banner';

// Custom hook for banner ads data
export const useBannerAds = (params = {}) => {
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [pagination, setPagination] = useState(null);

  const fetchBanners = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);

      const response = await getBannerAds(params);

      // Backend returns data directly, not wrapped in success
      if (response && response.data) {
        setData(Array.isArray(response.data) ? response.data : []);
        setPagination(response.meta || null);
      } else {
        setData([]);
        setPagination(null);
      }
    } catch (err) {
      setError(err.message || 'Failed to load banners');
      setData([]);
      setPagination(null);
    } finally {
      setLoading(false);
    }
  }, [params.category_id, params.country, params.banner_size, params.promotion_tier, params.verified_only, params.search, params.sort_by, params.sort_order, params.page, params.limit]);

  useEffect(() => {
    fetchBanners();
  }, [fetchBanners]);

  return { data, loading, error, pagination, refetch: fetchBanners };
};

// Custom hook for featured banners
export const useFeaturedBanners = (limit = 10) => {
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const fetchFeaturedBanners = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);
      
      const response = await getFeaturedBannerAds({ per_page: limit });
      
      // Backend returns data directly, not wrapped in success
      if (response && response.data) {
        setData(Array.isArray(response.data) ? response.data : []);
      } else {
        setData([]);
      }
    } catch (err) {
      setError(err.message || 'Failed to load featured banners');
      setData([]);
    } finally {
      setLoading(false);
    }
  }, [limit]);

  useEffect(() => {
    fetchFeaturedBanners();
  }, [fetchFeaturedBanners]);

  return { data, loading, error, refetch: fetchFeaturedBanners };
};

// Custom hook for banner categories
export const useBannerCategories = () => {
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const fetchCategories = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);
      
      const response = await getBannerCategories();
      
      // Backend returns data directly, not wrapped in success
      if (response && response.data) {
        setData(Array.isArray(response.data) ? response.data : []);
      } else {
        setData([]);
      }
    } catch (err) {
      setError(err.message || 'Failed to load categories');
      setData([]);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchCategories();
  }, [fetchCategories]);

  return { data, loading, error, refetch: fetchCategories };
};

// Custom hook for marketplace homepage data (simplified)
export const useMarketplaceHomepage = () => {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const fetchHomepageData = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);
      
      // Get featured banners and categories for homepage
      const [featuredResponse, categoriesResponse] = await Promise.all([
        getFeaturedBannerAds({ per_page: 6 }),
        getBannerCategories()
      ]);
      
      const homepageData = {
        featuredBanners: featuredResponse?.data || [],
        categories: categoriesResponse?.data || []
      };
      
      setData(homepageData);
    } catch (err) {
      setError(err.message || 'Failed to load homepage data');
      setData(null);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchHomepageData();
  }, [fetchHomepageData]);

  return { data, loading, error, refetch: fetchHomepageData };
};
