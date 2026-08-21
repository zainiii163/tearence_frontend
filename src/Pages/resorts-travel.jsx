import React, { useState, useEffect, useCallback, useMemo } from 'react';
import { useParams } from 'react-router-dom';
import { X } from 'lucide-react';

import TravelHero from '../Component/resorts/TravelHero';
import CategoryPageShell from '../Component/shared/CategoryPageShell';
import CompactPremiumReel from '../Component/shared/CompactPremiumReel';
import StandardListingFilters from '../Component/shared/StandardListingFilters';
import TravelWorldMap from '../Component/resorts/TravelWorldMap';
import TravelCategoryGrid from '../Component/resorts/TravelCategoryGrid';
import TravelGrid from '../Component/resorts/TravelGrid';
import TravelPostFormModal from '../Component/resorts/TravelPostFormModal';
import TravelDetails from '../Component/resorts/TravelDetails';
import UnifiedNavbar from '../Component/UnifiedNavbar';
import Footer from '../Component/Footer';
import { getCategoryTheme } from '../constants/categoryThemes';
import { getTravelContinentById } from '../data/travelContinents';
import resortsTravelApi from '../services/resortsTravelAPI';

const ResortsTravelPage = () => {
  const { slug } = useParams();
  const theme = getCategoryTheme('resorts');

  const [selectedCategory, setSelectedCategory] = useState(null);
  const [selectedRegion, setSelectedRegion] = useState(null);
  const [filteredAdverts, setFilteredAdverts] = useState([]);
  const [showPostFormModal, setShowPostFormModal] = useState(false);
  const [showFilters, setShowFilters] = useState(true);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [featuredDestinations, setFeaturedDestinations] = useState([]);
  const [travelCategories, setTravelCategories] = useState([]);
  const [filters, setFilters] = useState({});
  const [pendingFilters, setPendingFilters] = useState({});
  const [topSearch, setTopSearch] = useState('');

  useEffect(() => {
    const urlParams = new URLSearchParams(window.location.search);
    if (urlParams.get('postForm') === 'true') {
      setShowPostFormModal(true);
      const url = new URL(window.location.href);
      url.searchParams.delete('postForm');
      window.history.replaceState({}, '', url);
    }
  }, []);

  const loadFeaturedAndCategories = useCallback(async () => {
    try {
      const [featuredResponse, categoriesResponse] = await Promise.all([
        resortsTravelApi.getFeaturedAdverts({ per_page: 6 }),
        resortsTravelApi.getCategories(),
      ]);
      setFeaturedDestinations(featuredResponse.data || []);
      setTravelCategories(categoriesResponse.data || []);
    } catch (err) {
      console.error('Error loading travel meta:', err);
    }
  }, []);

  const loadFilteredAdverts = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const params = {
        per_page: 20,
        sort_by: 'created_at',
        sort_order: 'desc',
      };

      if (selectedCategory?.id) params.category_id = selectedCategory.id;

      if (filters.country) {
        params.country = filters.country;
      }

      if (filters.city) params.city = filters.city;
      if (filters.search || topSearch) params.search = filters.search || topSearch;
      if (filters.priceMin) params.price_min = filters.priceMin;
      if (filters.priceMax) params.price_max = filters.priceMax;
      if (filters.advertType) params.advert_type = filters.advertType;
      if (filters.featured) params.featured = 1;
      if (filters.promoted) params.promoted = 1;
      if (filters.sponsored) params.sponsored = 1;

      const response = await resortsTravelApi.getTravelAdverts(params);
      let advertsList = Array.isArray(response.data)
        ? response.data
        : response.data?.data || [];

      // Continent map focus — filter by countries in that region (API has no continent param)
      if (selectedRegion && !filters.country) {
        const continent = getTravelContinentById(selectedRegion);
        const names = (continent?.countries || []).map((c) => String(c).toLowerCase());
        if (names.length > 0) {
          advertsList = advertsList.filter((ad) => {
            const country = String(ad.country || '').toLowerCase();
            if (!country) return false;
            return names.some(
              (n) => country === n || country.includes(n) || n.includes(country)
            );
          });
        }
      }

      if (filters.featured || filters.promoted || filters.sponsored) {
        advertsList = advertsList.filter((ad) => {
          const checks = [];
          if (filters.featured) {
            checks.push(!!(ad.featured || ad.is_featured || ad.promotion_tier === 'featured'));
          }
          if (filters.promoted) {
            checks.push(!!(ad.promoted || ad.is_promoted || ad.promotion_tier === 'promoted'));
          }
          if (filters.sponsored) {
            checks.push(!!(ad.sponsored || ad.is_sponsored || ad.promotion_tier === 'sponsored'));
          }
          return checks.some(Boolean);
        });
      }

      setFilteredAdverts(advertsList);
    } catch (err) {
      setError(err.message || 'Failed to load travel adverts');
      console.error('Error loading filtered adverts:', err);
      setFilteredAdverts([]);
    } finally {
      setLoading(false);
    }
  }, [selectedCategory, selectedRegion, filters, topSearch]);

  useEffect(() => {
    loadFeaturedAndCategories();
  }, [loadFeaturedAndCategories]);

  useEffect(() => {
    loadFilteredAdverts();
  }, [loadFilteredAdverts]);

  const handleFilterChange = (filterName, value) => {
    setPendingFilters((prev) => {
      const next = { ...prev, [filterName]: value };
      if (typeof value === 'boolean' && !value) delete next[filterName];
      if ((typeof value === 'string' || typeof value === 'number') && value === '') {
        delete next[filterName];
      }
      return next;
    });
  };

  const applyFilters = () => setFilters({ ...pendingFilters });

  const clearFilters = () => {
    setFilters({});
    setPendingFilters({});
    setTopSearch('');
    setSelectedRegion(null);
    setSelectedCategory(null);
  };

  const handleSearch = (searchData = {}) => {
    const next = { ...pendingFilters };
    if (searchData.destination) {
      next.search = searchData.destination;
      setTopSearch(searchData.destination);
    }
    if (searchData.priceRange) {
      const [min, max] = String(searchData.priceRange).split('-');
      if (min) next.priceMin = min;
      if (max) next.priceMax = max;
    }
    if (searchData.advertType) next.advertType = searchData.advertType;
    setPendingFilters(next);
    setFilters(next);
  };

  const handleCategorySelect = (category) => {
    setSelectedCategory((prev) =>
      prev?.id && category?.id && String(prev.id) === String(category.id) ? null : category
    );
  };

  const handleRegionSelect = (regionId) => {
    setSelectedRegion(regionId || null);
  };

  const handleFormSuccess = () => {
    loadFeaturedAndCategories();
    loadFilteredAdverts();
  };

  const activeFilterCount = useMemo(
    () =>
      Object.entries(filters).filter(([, v]) => {
        if (typeof v === 'boolean') return v;
        return v !== '' && v != null;
      }).length + (selectedRegion ? 1 : 0) + (selectedCategory ? 1 : 0),
    [filters, selectedRegion, selectedCategory]
  );

  const travelExtraFields = (
    <div className="border-b border-gray-200">
      <div className="py-3.5 pl-5 pr-0.5 space-y-2">
        <label className="block text-xs font-medium text-gray-500">Service type</label>
        <select
          value={pendingFilters.advertType || ''}
          onChange={(e) => handleFilterChange('advertType', e.target.value)}
          className="w-full px-3 py-2 text-sm border border-gray-300 rounded-lg bg-white text-gray-900 focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
        >
          <option value="">All types</option>
          <option value="accommodation">Accommodation</option>
          <option value="transport">Transport</option>
          <option value="experience">Experience</option>
        </select>
      </div>
    </div>
  );

  const filterFields = (
    <StandardListingFilters
      filters={pendingFilters}
      onFilterChange={handleFilterChange}
      onApply={applyFilters}
      onClear={clearFilters}
      theme={theme.filterTheme}
      asPanel={false}
      showActions={false}
      showTitle={false}
      extraFields={travelExtraFields}
    />
  );

  if (slug) {
    return (
      <div className="min-h-screen bg-gray-50">
        <UnifiedNavbar showBackButton />
        <div className="pt-16">
          <TravelDetails />
        </div>
        <Footer />
      </div>
    );
  }

  return (
    <CategoryPageShell
      categoryId="resorts"
      backHref="/"
      showBackBar
      backBarTo="/"
      backBarLabel="Back Home"
      contentClassName="page-container py-4"
      hero={<TravelHero onSearch={handleSearch} />}
      categoryGrid={
        <>
          {error && !loading && (
            <div className="bg-red-50 border-l-4 border-red-400 p-4 mb-6">
              <div className="flex">
                <div className="flex-shrink-0">
                  <X className="h-5 w-5 text-red-400" />
                </div>
                <div className="ml-3">
                  <p className="text-sm text-red-700">{error}</p>
                  <button
                    type="button"
                    onClick={loadFilteredAdverts}
                    className="mt-2 text-sm text-red-600 underline hover:text-red-800"
                  >
                    Try Again
                  </button>
                </div>
              </div>
            </div>
          )}
          <TravelWorldMap
            onRegionSelect={handleRegionSelect}
            selectedRegion={selectedRegion}
          />
          <TravelCategoryGrid
            categories={travelCategories}
            onCategorySelect={handleCategorySelect}
            selectedCategory={selectedCategory}
          />
        </>
      }
      premiumReel={
        featuredDestinations.length > 0 ? (
          <CompactPremiumReel
            items={featuredDestinations.map((d) => ({
              ...d,
              featured: true,
              image_url: d.image || d.main_image || d.cover_image,
            }))}
            title="Featured"
            getHref={(item) => `/resorts-travel/${item.slug || item.id}`}
            accentClass={theme.accentText || 'text-cyan-700'}
            borderAccent="hover:border-cyan-300"
          />
        ) : null
      }
      filterLayoutProps={{
        open: showFilters,
        onOpenChange: setShowFilters,
        onApply: applyFilters,
        onClear: clearFilters,
        theme: theme.filterTheme,
        homeHref: '/resorts-travel',
        filterFields,
        activeCount: activeFilterCount,
      }}
      bottomCta={{
        buttonLabel: 'List your service',
        onPostClick: () => setShowPostFormModal(true),
        theme: theme.ctaTheme,
      }}
      afterContent={
        <TravelPostFormModal
          isOpen={showPostFormModal}
          onClose={() => setShowPostFormModal(false)}
          onSuccess={handleFormSuccess}
        />
      }
    >
      <div className="mb-3 text-center">
        <h2 className="text-lg font-bold text-gray-900">
          {selectedCategory ? selectedCategory.name : 'All Travel Services'}
          {selectedRegion
            ? ` · ${getTravelContinentById(selectedRegion)?.name || selectedRegion}`
            : ''}
        </h2>
        <p className="text-sm text-gray-600 mt-0.5">
          {loading ? 'Loading…' : `${filteredAdverts.length} results`}
        </p>
      </div>
      <TravelGrid adverts={filteredAdverts} loading={loading} />
    </CategoryPageShell>
  );
};

export default ResortsTravelPage;
