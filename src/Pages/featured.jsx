import React, { useState, useEffect, useCallback } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { Clock } from 'lucide-react';
import useAuthRedirect from '../hooks/useAuthRedirect';
import UnifiedNavbar from '../Component/UnifiedNavbar';
import Footer from '../Component/Footer';
import FeaturedHero from '../Component/featured/FeaturedHero';
import FeaturedCategoryGrid from '../Component/featured/FeaturedCategoryGrid';
import FeaturedGrid from '../Component/featured/FeaturedGrid';
import FeaturedActivityFeed from '../Component/featured/FeaturedActivityFeed';
import FeaturedSellerProfile from '../Component/featured/FeaturedSellerProfile';
import FeaturedPostForm from '../Component/featured/FeaturedPostForm';
import BrowseBottomPostCta from '../Component/shared/BrowseBottomPostCta';
import StandardListingFilters from '../Component/shared/StandardListingFilters';
import { BrowseFilterLayout } from '../Component/shared/BrowseFilterLayout';
import { featuredAdvertsAPI } from '../api/featuredAdverts';
import { FEATURED_DEMO_ADVERTS, FEATURED_DEMO_CATEGORIES } from '../data/featuredDemo';
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
  const [recentlyViewed, setRecentlyViewed] = useState([]);

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
        if (catRes?.success) {
          const rows = catRes.data || [];
          setCategories(Array.isArray(rows) && rows.length ? rows : FEATURED_DEMO_CATEGORIES);
        } else {
          setCategories(FEATURED_DEMO_CATEGORIES);
        }
      } catch {
        setCategories(FEATURED_DEMO_CATEGORIES);
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
        search: filters.search || undefined,
        country: filters.country || undefined,
      };

      let rows = [];
      try {
        const feed = await featuredAdvertsAPI.getSiteFeed(params);
        rows = normalizeList(feed);
      } catch {
        rows = [];
      }

      if (!rows.length) {
        const listParams = {
          per_page: 48,
          page: 1,
          search: filters.search || undefined,
          country: filters.country || undefined,
          city: filters.city || undefined,
          category_id: selectedCategoryId || undefined,
          min_price: filters.priceMin || undefined,
          max_price: filters.priceMax || undefined,
        };
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

      if (!rows.length) {
        let demo = [...FEATURED_DEMO_ADVERTS];
        if (selectedCategoryId) {
          demo = demo.filter((ad) => String(ad.category_id) === String(selectedCategoryId));
        }
        if (filters.search) {
          const q = String(filters.search).toLowerCase();
          demo = demo.filter((ad) =>
            `${ad.title} ${ad.description} ${ad.city}`.toLowerCase().includes(q)
          );
        }
        rows = demo;
      }

      setAdverts(rows);
    } catch (err) {
      console.error(err);
      setAdverts(FEATURED_DEMO_ADVERTS);
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

  const handleViewAdvert = (advert) => {
    setRecentlyViewed((prev) => {
      const filtered = prev.filter((item) => item.id !== advert.id);
      return [advert, ...filtered].slice(0, 10);
    });
  };

  const handleClosePostForm = () => {
    setShowPostForm(false);
    setSearchParams({});
    loadAdverts();
  };

  const filterFields = (
    <StandardListingFilters
      filters={pendingFilters}
      onFilterChange={handleFilterChange}
      onApply={applyFilters}
      onClear={isCategoryView ? clearExtraFilters : clearFilters}
      theme="purple"
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
    <div className="min-h-screen bg-gray-50 overflow-x-hidden">
      <UnifiedNavbar showBackButton backHref={isCategoryView ? '/featured-adverts' : '/'} />

      <FeaturedHero
        categoryLabel={isCategoryView ? categoryName : null}
        searchValue={topSearch}
        onSearchChange={(e) => setTopSearch(e.target.value)}
        onSearchSubmit={applyTopSearch}
      />

      <div className="page-container py-4 sm:py-6">
        {!isCategoryView && (
          <FeaturedCategoryGrid
            categories={categories}
            selectedCategoryId={selectedCategoryId}
            onSelectCategory={handleCategorySelect}
            loading={categoriesLoading}
          />
        )}

        <BrowseFilterLayout
          open={showFilters}
          onOpenChange={setShowFilters}
          onApply={applyFilters}
          onClear={isCategoryView ? clearExtraFilters : clearFilters}
          theme="purple"
          homeHref="/featured-adverts"
          filterFields={filterFields}
          activeCount={activeFilterCount}
          toolbarLeft={
            <p className="text-sm text-gray-600">
              {loading ? 'Loading…' : `${adverts.length} listings`}
            </p>
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
              savedAdverts={savedAdverts}
              onSaveAdvert={handleSaveAdvert}
              onViewAdvert={handleViewAdvert}
              onSellerProfileClick={setShowSellerProfile}
            />
          )}

          <BrowseBottomPostCta
            buttonLabel="List your featured ad"
            onPostClick={handlePostFeatured}
            theme="purple"
            buttonOnly
          />
        </BrowseFilterLayout>

        {/* Kept extras — activity + recently viewed */}
        <div className="mt-8 grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="lg:col-span-2">
            <FeaturedActivityFeed />
          </div>
          <div className="bg-white rounded-xl border border-gray-200 p-5">
            <h3 className="text-sm font-bold text-gray-900 mb-4 flex items-center">
              <Clock className="h-4 w-4 mr-2 text-purple-600" />
              Recently viewed
            </h3>
            {recentlyViewed.length > 0 ? (
              <div className="space-y-3">
                {recentlyViewed.slice(0, 5).map((advert) => {
                  const mainImage = advert.main_image
                    || (advert.images?.[0]
                      ? (String(advert.images[0]).startsWith('http')
                          ? advert.images[0]
                          : `${process.env.REACT_APP_STORAGE_URL || 'https://api.worldwideadverts.info/storage'}/${advert.images[0]}`)
                      : 'https://via.placeholder.com/64x64?text=No+Image');
                  return (
                    <div
                      key={advert.id}
                      className="flex items-center space-x-3 p-2 bg-gray-50 rounded-lg"
                    >
                      <img
                        src={mainImage}
                        alt={advert.title}
                        className="w-12 h-12 object-cover rounded-lg"
                      />
                      <div className="flex-1 min-w-0">
                        <p className="text-sm font-medium text-gray-900 truncate">{advert.title}</p>
                        <p className="text-xs text-gray-500">
                          {advert.city}, {advert.country}
                        </p>
                      </div>
                    </div>
                  );
                })}
              </div>
            ) : (
              <p className="text-gray-500 text-sm">No recently viewed adverts</p>
            )}
          </div>
        </div>
      </div>

      <Footer />

      {showPostForm && <FeaturedPostForm onClose={handleClosePostForm} />}

      {showSellerProfile && (
        <FeaturedSellerProfile
          seller={showSellerProfile}
          onClose={() => setShowSellerProfile(null)}
        />
      )}
    </div>
  );
};

export default FeaturedPage;
