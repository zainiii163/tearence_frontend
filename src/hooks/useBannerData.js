import { useState, useEffect, useCallback } from 'react';
import { bannerAdsApi, bannerCategoriesApi, bannerMarketplaceApi, handleApiError } from '../services/bannerApi';
import { getApiProvider } from '../utils/mockApiProvider';

// Get API provider (mock in development, real in production)
const apiProvider = getApiProvider();

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
      
      // Use mock API in development, real API in production
      let response;
      if (apiProvider) {
        response = await apiProvider.bannerAds.getAll(params);
      } else {
        response = await bannerAdsApi.getAll(params);
      }
      
      setData(response.data);
      setPagination(response.meta);
    } catch (err) {
      setError(handleApiError(err));
    } finally {
      setLoading(false);
    }
  }, [params]);

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
      
      let response;
      if (apiProvider) {
        response = await apiProvider.bannerAds.getFeatured(limit);
      } else {
        response = await bannerAdsApi.getFeatured(limit);
      }
      
      setData(response.data);
    } catch (err) {
      setError(handleApiError(err));
    } finally {
      setLoading(false);
    }
  }, [limit]);

  useEffect(() => {
    fetchFeaturedBanners();
  }, [fetchFeaturedBanners]);

  return { data, loading, error, refetch: fetchFeaturedBanners };
};

// Custom hook for most viewed banners
export const useMostViewedBanners = (limit = 10) => {
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const fetchMostViewedBanners = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);
      
      let response;
      if (apiProvider) {
        response = await apiProvider.bannerAds.getMostViewed(limit);
      } else {
        response = await bannerAdsApi.getMostViewed(limit);
      }
      
      setData(response.data);
    } catch (err) {
      setError(handleApiError(err));
    } finally {
      setLoading(false);
    }
  }, [limit]);

  useEffect(() => {
    fetchMostViewedBanners();
  }, [fetchMostViewedBanners]);

  return { data, loading, error, refetch: fetchMostViewedBanners };
};

// Custom hook for recent banners
export const useRecentBanners = (limit = 10) => {
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const fetchRecentBanners = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);
      
      let response;
      if (apiProvider) {
        response = await apiProvider.bannerAds.getRecent(limit);
      } else {
        response = await bannerAdsApi.getRecent(limit);
      }
      
      setData(response.data);
    } catch (err) {
      setError(handleApiError(err));
    } finally {
      setLoading(false);
    }
  }, [limit]);

  useEffect(() => {
    fetchRecentBanners();
  }, [fetchRecentBanners]);

  return { data, loading, error, refetch: fetchRecentBanners };
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
      
      let response;
      if (apiProvider) {
        response = await apiProvider.bannerCategories.getAll();
      } else {
        response = await bannerCategoriesApi.getAll();
      }
      
      setData(response.data);
    } catch (err) {
      setError(handleApiError(err));
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchCategories();
  }, [fetchCategories]);

  return { data, loading, error, refetch: fetchCategories };
};

// Custom hook for trending categories
export const useTrendingCategories = (limit = 10) => {
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const fetchTrendingCategories = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);
      
      let response;
      if (apiProvider) {
        response = await apiProvider.bannerCategories.getTrending(limit);
      } else {
        response = await bannerCategoriesApi.getTrending(limit);
      }
      
      setData(response.data);
    } catch (err) {
      setError(handleApiError(err));
    } finally {
      setLoading(false);
    }
  }, [limit]);

  useEffect(() => {
    fetchTrendingCategories();
  }, [fetchTrendingCategories]);

  return { data, loading, error, refetch: fetchTrendingCategories };
};

// Custom hook for marketplace homepage data
export const useMarketplaceHomepage = () => {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const fetchHomepageData = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);
      
      let response;
      if (apiProvider) {
        response = await apiProvider.bannerMarketplace.getHomepage();
      } else {
        response = await bannerMarketplaceApi.getHomepage();
      }
      
      setData(response.data);
    } catch (err) {
      setError(handleApiError(err));
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchHomepageData();
  }, [fetchHomepageData]);

  return { data, loading, error, refetch: fetchHomepageData };
};

// Custom hook for marketplace carousel data
export const useMarketplaceCarousel = () => {
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const fetchCarouselData = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);
      
      let response;
      if (apiProvider) {
        response = await apiProvider.bannerMarketplace.getCarousel();
      } else {
        response = await bannerMarketplaceApi.getCarousel();
      }
      
      setData(response.data);
    } catch (err) {
      setError(handleApiError(err));
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchCarouselData();
  }, [fetchCarouselData]);

  return { data, loading, error, refetch: fetchCarouselData };
};

// Custom hook for banner analytics
export const useBannerAnalytics = () => {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const fetchAnalytics = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);
      
      let response;
      if (apiProvider) {
        response = await apiProvider.bannerMarketplace.getAnalytics();
      } else {
        response = await bannerMarketplaceApi.getAnalytics();
      }
      
      setData(response.data);
    } catch (err) {
      setError(handleApiError(err));
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchAnalytics();
  }, [fetchAnalytics]);

  return { data, loading, error, refetch: fetchAnalytics };
};

// Custom hook for user's banner management
export const useMyBanners = (params = {}) => {
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [pagination, setPagination] = useState(null);

  const fetchMyBanners = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);
      
      let response;
      if (apiProvider) {
        response = await apiProvider.bannerAds.getMyBanners(params);
      } else {
        response = await bannerAdsApi.getMyBanners(params);
      }
      
      setData(response.data);
      setPagination(response.meta);
    } catch (err) {
      setError(handleApiError(err));
    } finally {
      setLoading(false);
    }
  }, [params]);

  useEffect(() => {
    fetchMyBanners();
  }, [fetchMyBanners]);

  return { data, loading, error, pagination, refetch: fetchMyBanners };
};

// Custom hook for banner operations (create, update, delete)
export const useBannerOperations = () => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const createBanner = useCallback(async (bannerData) => {
    try {
      setLoading(true);
      setError(null);
      
      let response;
      if (apiProvider) {
        response = await apiProvider.bannerAds.create(bannerData);
      } else {
        response = await bannerAdsApi.create(bannerData);
      }
      
      return response;
    } catch (err) {
      setError(handleApiError(err));
      throw err;
    } finally {
      setLoading(false);
    }
  }, []);

  const updateBanner = useCallback(async (id, bannerData) => {
    try {
      setLoading(true);
      setError(null);
      
      let response;
      if (apiProvider) {
        throw new Error('Update not implemented in mock API');
      } else {
        response = await bannerAdsApi.update(id, bannerData);
      }
      
      return response;
    } catch (err) {
      setError(handleApiError(err));
      throw err;
    } finally {
      setLoading(false);
    }
  }, []);

  const deleteBanner = useCallback(async (id) => {
    try {
      setLoading(true);
      setError(null);
      
      let response;
      if (apiProvider) {
        throw new Error('Delete not implemented in mock API');
      } else {
        response = await bannerAdsApi.delete(id);
      }
      
      return response;
    } catch (err) {
      setError(handleApiError(err));
      throw err;
    } finally {
      setLoading(false);
    }
  }, []);

  const trackClick = useCallback(async (slug) => {
    try {
      setError(null);
      
      let response;
      if (apiProvider) {
        response = await apiProvider.bannerAds.trackClick(slug);
      } else {
        response = await bannerAdsApi.trackClick(slug);
      }
      
      return response;
    } catch (err) {
      setError(handleApiError(err));
      throw err;
    }
  }, []);

  return {
    createBanner,
    updateBanner,
    deleteBanner,
    trackClick,
    loading,
    error
  };
};
