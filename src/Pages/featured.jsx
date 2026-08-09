import React, { useState, useEffect, useCallback } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import useAuthRedirect from '../hooks/useAuthRedirect';
import FeaturedHero from '../Component/featured/FeaturedHero';
import FeaturedCategoryGrid from '../Component/featured/FeaturedCategoryGrid';
import FeaturedGrid from '../Component/featured/FeaturedGrid';
import FeaturedSellerProfile from '../Component/featured/FeaturedSellerProfile';
import FeaturedPostForm from '../Component/featured/FeaturedPostForm';
import StandardListingFilters from '../Component/shared/StandardListingFilters';
import CategoryPageShell from '../Component/shared/CategoryPageShell';
import { getCategoryTheme } from '../constants/categoryThemes';
import { featuredAdvertsAPI } from '../api/featuredAdverts';
import { FEATURED_DEMO_ADVERTS } from '../data/featuredDemo';
import { normalizeBrowseAdverts } from '../utils/normalizeBrowseAdvert';
import { resolveCrossFeedHref } from '../utils/resolveCrossFeedHref';
import '../styles/featured.css';

const hasActiveFilters = (activeFilters = {}) =>
  Object.entries(activeFilters).some(([, value]) => {
    if (typeof value === 'boolean') return value;
    return value !== '' && value != null;
  });

/**
 * Same browse pattern as Sponsored / Promoted, keeping activity + recently viewed + seller modal.
 */
const FeaturedPage = ({ initialCategoryId = null }) => {
  const { requireAuth, isAuthenticated } = useAuthRedirect();
  const navigate = useNavigate();
  const [searchParams, setSearchParams] = useSearchParams();

  const [showPostForm, setShowPostForm] = useState(false);
  const [showSellerProfile, setShowSellerProfile] = useState(null);
  const [savedAdverts, setSavedAdverts] = useState([]);

  const [adverts, setAdverts] = useState([]);
  const [categories, setCategories] = useState([]);
  const [categoriesLoading, setCategoriesLoading] = useState(true);
  const [selectedCategoryId, setSelectedCategoryId] = useState(initialCategoryId);
  const [categoryName, setCategoryName] = useState('');
  const [filters, setFilters] = useState({});
  const [pendingFilters, setPendingFilters] = useState({});
  const [showFilters, setShowFilters] = useState(true);
  const [topSearch, setTopSearch] = useState('');
  const [loading, setLoading] = useState(true);

  const isCategoryView = Boolean(selectedCategoryId);

  useEffect(() => {
    setSelectedCategoryId(initialCategoryId);
  }, [initialCategoryId]);

  useEffect(() => {
    if (!selectedCategoryId) {
      setCategoryName('');
      return;
    }
    const match = categories.find(
      (c) => String(c.id ?? c.category_id) === String(selectedCategoryId)
    );
    setCategoryName(match?.name || match?.category_name || 'Category');
  }, [selectedCategoryId, categories]);

  useEffect(() => {
    if (searchParams.get('postForm') === 'true' && isAuthenticated) {
      setShowPostForm(true);
    }
  }, [searchParams, isAuthenticated]);

  useEffect(() => {
    (async () => {
      setCategoriesLoading(true);
      try {
        const catRes = await featuredAdvertsAPI.getCategoryGrid();
        const rows = catRes?.data || catRes || [];
        setCategories(Array.isArray(rows) ? rows : []);
      } catch {
        setCategories([]);
      } finally {
        setCategoriesLoading(false);
      }
    })();
  }, []);

  const normalizeList = (payload) => {
    if (!payload) return [];
    if (payload.data?.data && Array.isArray(payload.data.data)) return payload.data.data;
    if (Array.isArray(payload.data)) return payload.data;
    if (Array.isArray(payload)) return payload;
    return [];
  };

  const loadAdverts = useCallback(async () => {
    setLoading(true);
    try {
      const params = {
        per_page: 48,
        page: 1,
      };
      if (filters.search) params.search = filters.search;
      if (filters.country) params.country = filters.country;

      let rows = [];
      try {
        const feed = await featuredAdvertsAPI.getSiteFeed(params);
        rows = normalizeList(feed);
      } catch {
        rows = [];
      }

      if (!rows.length) {
        const listParams = { ...params };
        if (filters.city) listParams.city = filters.city;
        if (selectedCategoryId) listParams.category_id = selectedCategoryId;
        if (filters.priceMin) listParams.min_price = filters.priceMin;
        if (filters.priceMax) listParams.max_price = filters.priceMax;
        const res = await featuredAdvertsAPI.getFeaturedAdverts(listParams);
        rows = normalizeList(res);
      }

      if (selectedCategoryId && rows.length) {
        const catName =
          categories.find((c) => String(c.id ?? c.category_id) === String(selectedCategoryId))
            ?.name || String(selectedCategoryId);
        rows = rows.filter((ad) => {
          const hay = `${ad.category_name || ''} ${ad.source_label || ''}`.toLowerCase();
          return (
            hay.includes(String(catName).toLowerCase()) ||
            String(ad.category_id) === String(selectedCategoryId)
          );
        });
      }

      if (filters.city) {
        const q = String(filters.city).toLowerCase();
        rows = rows.filter((ad) => (ad.city || '').toLowerCase().includes(q));
      }
      if (filters.featured || filters.promoted || filters.sponsored) {
        rows = rows.filter((ad) => {
          const checks = [];
          if (filters.featured) checks.push(!!(ad.featured || ad.is_featured));
          if (filters.promoted) checks.push(!!(ad.promoted || ad.is_promoted));
          if (filters.sponsored) checks.push(!!(ad.sponsored || ad.is_sponsored));
          return checks.some(Boolean);
        });
      }

      // Prefer real feed rows — never replace live services with dummy cards that don't open.
      const filtersOn = hasActiveFilters(filters) || Boolean(selectedCategoryId);
      if (!rows.length && !filtersOn) {
        rows = FEATURED_DEMO_ADVERTS.map((ad) => ({
          ...ad,
          href: resolveCrossFeedHref(ad, '/featured-adverts'),
        }));
      } else {
        rows = normalizeBrowseAdverts(rows).map((ad) => ({
          ...ad,
          href: resolveCrossFeedHref(ad, '/featured-adverts'),
        }));
      }

      setAdverts(Array.isArray(rows) ? rows : []);
    } catch (err) {
      console.error(err);
      setAdverts([]);
    } finally {
      setLoading(false);
    }
  }, [filters, selectedCategoryId, categories]);

  useEffect(() => {
    loadAdverts();
  }, [loadAdverts]);

  const handlePostFeatured = () => {
    const path = selectedCategoryId
      ? `/featured-adverts/category/${selectedCategoryId}?postForm=true`
      : '/featured-adverts?postForm=true';
    if (requireAuth(path, 'You must be logged in to post a featured advert.')) {
      setShowPostForm(true);
      setSearchParams({ postForm: 'true' });
    }
  };

  const handleFilterChange = (filterName, value) => {
    setPendingFilters((prev) => {
      const next = { ...prev, [filterName]: value };
      if (typeof value === 'boolean' && !value) delete next[filterName];
      if ((typeof value === 'string' || typeof value === 'number') && value === '') delete next[filterName];
      return next;
    });
  };

  const applyFilters = () => setFilters({ ...pendingFilters });

  const clearFilters = () => {
    if (isCategoryView) {
      navigate('/featured-adverts');
      return;
    }
    setFilters({});
    setPendingFilters({});
    setTopSearch('');
  };

  const clearExtraFilters = () => {
    setFilters({});
    setPendingFilters({});
    setTopSearch('');
  };

  const applyTopSearch = () => {
    const next = { ...pendingFilters, search: topSearch };
    if (!topSearch.trim()) delete next.search;
    setPendingFilters(next);
    setFilters(next);
  };

  const handleCategorySelect = (categoryId) => {
    navigate(`/featured-adverts/category/${categoryId}`);
  };

  const handleSaveAdvert = async (advert) => {
    setSavedAdverts((prev) => {
      const isSaved = prev.some((saved) => saved.id === advert.id);
      if (isSaved) return prev.filter((saved) => saved.id !== advert.id);
      return [...prev, advert];
    });
    try {
      await featuredAdvertsAPI.saveAdvert(advert.id);
    } catch (err) {
      console.error('Failed to save advert:', err);
    }
  };

  const handleClosePostForm = () => {
    setShowPostForm(false);
    setSearchParams({});
    loadAdverts();
  };

  const theme = getCategoryTheme('featured');

  const filterFields = (
    <StandardListingFilters
      filters={pendingFilters}
      onFilterChange={handleFilterChange}
      onApply={applyFilters}
      onClear={isCategoryView ? clearExtraFilters : clearFilters}
      theme={theme.filterTheme}
      asPanel={false}
      showActions={false}
      showTitle={false}
    />
  );

  const activeFilterCount = Object.entries(filters).filter(([, v]) => {
    if (typeof v === 'boolean') return v;
    return v !== '' && v != null;
  }).length;

  return (
    <CategoryPageShell
      categoryId="featured"
      backHref={isCategoryView ? '/featured-adverts' : '/adverts'}
      showBackBar
      backBarTo={isCategoryView ? '/featured-adverts' : '/adverts'}
      backBarLabel={isCategoryView ? 'Back to Featured' : 'Back to Adverts'}
      hero={
        <FeaturedHero
          categoryLabel={isCategoryView ? categoryName : null}
          searchValue={topSearch}
          onSearchChange={(e) => setTopSearch(e.target.value)}
          onSearchSubmit={applyTopSearch}
        />
      }
      categoryGrid={
        !isCategoryView ? (
          <FeaturedCategoryGrid
            categories={categories}
            selectedCategoryId={selectedCategoryId}
            onSelectCategory={handleCategorySelect}
            loading={categoriesLoading}
          />
        ) : null
      }
      filterLayoutProps={{
        open: showFilters,
        onOpenChange: setShowFilters,
        onApply: applyFilters,
        onClear: isCategoryView ? clearExtraFilters : clearFilters,
        theme: theme.filterTheme,
        homeHref: '/featured-adverts',
        filterFields,
        activeCount: activeFilterCount,
      }}
      bottomCta={{
        buttonLabel: 'List your featured ad',
        onPostClick: handlePostFeatured,
        theme: theme.ctaTheme,
        buttonOnly: true,
      }}
      afterContent={
        <>
          {showPostForm && <FeaturedPostForm onClose={handleClosePostForm} />}
          {showSellerProfile && (
            <FeaturedSellerProfile
              seller={showSellerProfile}
              onClose={() => setShowSellerProfile(null)}
            />
          )}
        </>
      }
    >
          {hasActiveFilters(filters) && !loading && adverts.length === 0 && (
            <div className="mb-4">
              <button
                type="button"
                onClick={clearExtraFilters}
                className="text-xs font-medium text-purple-700 hover:text-purple-900"
              >
                Clear and show all
              </button>
            </div>
          )}

          {loading ? (
            <div className="text-center py-12">
              <div className="inline-block h-10 w-10 animate-spin rounded-full border-4 border-purple-600 border-r-transparent" />
            </div>
          ) : adverts.length === 0 ? (
            <div className="text-center py-10 bg-white rounded-xl border border-gray-200">
              <h3 className="text-base font-semibold text-gray-900 mb-2">No featured adverts found</h3>
              <p className="text-sm text-gray-600 mb-4">Try changing your selection</p>
              <button
                type="button"
                onClick={clearExtraFilters}
                className="px-4 py-2 text-sm bg-purple-600 text-white rounded-lg hover:bg-purple-700"
              >
                Reset
              </button>
            </div>
          ) : (
            <FeaturedGrid
              adverts={adverts}
              loading={false}
              viewMode="grid"
            />
          )}
    </CategoryPageShell>
  );
};

export default FeaturedPage;
