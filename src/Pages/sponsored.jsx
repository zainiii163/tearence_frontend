import React, { useState, useEffect, useCallback } from 'react';
import { useSearchParams } from 'react-router-dom';
import { Clock, Crown } from 'lucide-react';
import UnifiedNavbar from '../Component/UnifiedNavbar';
import SponsoredHero from '../Component/sponsored/SponsoredHero';
import SponsoredCategoryGrid from '../Component/sponsored/SponsoredCategoryGrid';
import SponsoredFilters from '../Component/sponsored/SponsoredFilters';
import SponsoredGrid from '../Component/sponsored/SponsoredGrid';
import SponsoredActivityFeed from '../Component/sponsored/SponsoredActivityFeed';
import SponsoredPostForm from '../Component/sponsored/SponsoredPostForm';
import sponsoredAdvertsAPI from '../api/sponsoredAdvertsAPI';

const SponsoredPage = () => {
  const [searchParams, setSearchParams] = useSearchParams();

  const [showPostForm, setShowPostForm] = useState(false);
  const [selectedCategory, setSelectedCategory] = useState(null);
  const [selectedCountry, setSelectedCountry] = useState(null);
  const [selectedTier, setSelectedTier] = useState(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [sortBy, setSortBy] = useState('created_at');
  const [currentPage, setCurrentPage] = useState(1);

  // Real API state
  const [adverts, setAdverts] = useState([]);
  const [advertsMeta, setAdvertsMeta] = useState(null);
  const [categories, setCategories] = useState([]);
  const [trendingCategories, setTrendingCategories] = useState([]);
  const [statistics, setStatistics] = useState(null);
  const [pricingPlans, setPricingPlans] = useState([]);
  const [loading, setLoading] = useState(true);
  const [advertsLoading, setAdvertsLoading] = useState(false);

  const countries = [
    { value: 'all', label: 'All Countries', flag: '🌍' },
    { value: 'United States', label: 'United States', flag: '🇺🇸' },
    { value: 'United Kingdom', label: 'United Kingdom', flag: '🇬🇧' },
    { value: 'France', label: 'France', flag: '🇫🇷' },
    { value: 'Germany', label: 'Germany', flag: '🇩🇪' },
    { value: 'Italy', label: 'Italy', flag: '🇮🇹' },
    { value: 'Spain', label: 'Spain', flag: '🇪🇸' },
    { value: 'Japan', label: 'Japan', flag: '🇯🇵' },
    { value: 'China', label: 'China', flag: '🇨🇳' },
    { value: 'Singapore', label: 'Singapore', flag: '🇸🇬' },
    { value: 'Australia', label: 'Australia', flag: '🇦🇺' },
    { value: 'Canada', label: 'Canada', flag: '🇨🇦' },
    { value: 'UAE', label: 'UAE', flag: '🇦🇪' },
    { value: 'Nigeria', label: 'Nigeria', flag: '🇳🇬' },
  ];

  const tiers = [
    { value: 'all', label: 'All Tiers', icon: Crown },
    { value: 'premium', label: 'Premium', icon: Crown },
    { value: 'plus', label: 'Plus', icon: Crown },
    { value: 'basic', label: 'Basic', icon: Crown },
  ];

  // Auto-show post form if URL parameter is present
  useEffect(() => {
    if (searchParams.get('postForm') === 'true') {
      setShowPostForm(true);
    }
  }, [searchParams]);

  // Load initial data: categories, trending categories, statistics, pricing plans
  useEffect(() => {
    const loadInitialData = async () => {
      setLoading(true);
      try {
        const [catRes, trendCatRes, statsRes, pricingRes] = await Promise.allSettled([
          sponsoredAdvertsAPI.getCategories(),
          sponsoredAdvertsAPI.getTrendingCategories(),
          sponsoredAdvertsAPI.getStatistics(),
          sponsoredAdvertsAPI.getPricingPlans(),
        ]);
        if (catRes.status === 'fulfilled' && catRes.value?.success) {
          setCategories(catRes.value.data || []);
        }
        if (trendCatRes.status === 'fulfilled' && trendCatRes.value?.success) {
          setTrendingCategories(trendCatRes.value.data || []);
        }
        if (statsRes.status === 'fulfilled' && statsRes.value?.success) {
          setStatistics(statsRes.value.data);
        }
        if (pricingRes.status === 'fulfilled' && pricingRes.value?.success) {
          setPricingPlans(pricingRes.value.data || []);
        }
      } catch (err) {
        console.error('Failed to load initial data:', err);
      } finally {
        setLoading(false);
      }
    };
    loadInitialData();
  }, []);

  // Load adverts whenever filters change
  const loadAdverts = useCallback(async () => {
    setAdvertsLoading(true);
    try {
      const params = {
        per_page: 20,
        page: currentPage,
        sort_by: sortBy,
        sort_order: 'desc',
      };
      if (searchQuery) params.search = searchQuery;
      if (selectedCategory) params.category_id = selectedCategory;
      if (selectedCountry) params.country = selectedCountry;
      if (selectedTier) params.sponsorship_tier = selectedTier;

      const response = await sponsoredAdvertsAPI.getSponsoredAdverts(params);
      if (response?.success) {
        setAdverts(response.data?.data || []);
        setAdvertsMeta({
          current_page: response.data?.current_page,
          last_page: response.data?.last_page,
          per_page: response.data?.per_page,
          total: response.data?.total,
        });
      }
    } catch (err) {
      console.error('Failed to load adverts:', err);
    } finally {
      setAdvertsLoading(false);
    }
  }, [searchQuery, selectedCategory, selectedCountry, selectedTier, sortBy, currentPage]);

  useEffect(() => {
    loadAdverts();
  }, [loadAdverts]);

  const handlePostSuccess = () => {
    setShowPostForm(false);
    loadAdverts();
  };

  const handleClearFilters = () => {
    setSelectedCategory(null);
    setSelectedCountry(null);
    setSelectedTier(null);
    setSearchQuery('');
  };

  if (showPostForm) {
    return (
      <div className="sponsored-page">
        <UnifiedNavbar />
        <SponsoredPostForm
          onCancel={() => setShowPostForm(false)}
          onSuccess={handlePostSuccess}
          pricingPlans={pricingPlans}
        />
      </div>
    );
  }

  return (
    <div className="sponsored-page">
      <UnifiedNavbar />
      
      <SponsoredHero
        statistics={statistics}
        onPostAdvert={() => setShowPostForm(true)}
      />

      <SponsoredCategoryGrid
        categories={categories}
        trendingCategories={trendingCategories}
        selectedCategory={selectedCategory}
        onSelectCategory={setSelectedCategory}
      />

      <div className="sponsored-content">
        <div className="container">
          <SponsoredFilters
            categories={categories}
            selectedCategory={selectedCategory}
            setSelectedCategory={setSelectedCategory}
            selectedCountry={selectedCountry}
            setSelectedCountry={setSelectedCountry}
            selectedTier={selectedTier}
            setSelectedTier={setSelectedTier}
            searchQuery={searchQuery}
            setSearchQuery={setSearchQuery}
            onClearFilters={handleClearFilters}
          />

          <SponsoredGrid
            adverts={adverts}
            loading={advertsLoading}
            meta={advertsMeta}
            onPageChange={setCurrentPage}
          />

          <SponsoredActivityFeed />
        </div>
      </div>
    </div>
  );
};

export default SponsoredPage;
