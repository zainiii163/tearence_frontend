import React, { useState, useEffect, useCallback, useMemo } from 'react';
import { AnimatePresence } from 'framer-motion';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { Crown } from 'lucide-react';
import useAuthRedirect from '../hooks/useAuthRedirect';
import UnifiedNavbar from '../Component/UnifiedNavbar';
import Footer from '../Component/Footer';
import PromotedHero from '../Component/promoted-new/PromotedHero';
import PromotedCategoryGrid from '../Component/promoted-new/PromotedCategoryGrid';
import PromotedCarousel from '../Component/promoted-new/PromotedCarousel';
import PromotedGrid from '../Component/promoted-new/PromotedGrid';
import PromotedActivityFeed from '../Component/promoted-new/PromotedActivityFeed';
import PromotedSellerProfile from '../Component/promoted-new/PromotedSellerProfile';
import PromotedPostForm from '../Component/promoted-new/PromotedPostForm';
import BrowseBottomPostCta from '../Component/shared/BrowseBottomPostCta';
import StandardListingFilters from '../Component/shared/StandardListingFilters';
import { BrowseFilterLayout } from '../Component/shared/BrowseFilterLayout';
import { promotedAdvertsAPI, categoriesAPI } from '../services/promotedAdvertsAPI';
import { PROMOTED_DEMO_ADVERTS, PROMOTED_DEMO_CATEGORIES } from '../data/promotedDemo';

const hasActiveFilters = (activeFilters = {}) =>
  Object.entries(activeFilters).some(([, value]) => {
    if (typeof value === 'boolean') return value;
    return value !== '' && value != null;
  });

/**
 * Same browse pattern as Sponsored / Buy & Sell, keeping carousel, activity & sellers.
 */
const PromotedAdvertsPage = ({ initialCategoryId = null }) => {
  const { requireAuth, isAuthenticated } = useAuthRedirect();
  const [searchParams, setSearchParams] = useSearchParams();
  const navigate = useNavigate();

  const [adverts, setAdverts] = useState([]);
  const [carouselAdverts, setCarouselAdverts] = useState([]);
  const [categories, setCategories] = useState([]);
  const [categoriesLoading, setCategoriesLoading] = useState(true);
  const [selectedCategoryId, setSelectedCategoryId] = useState(initialCategoryId);
  const [categoryName, setCategoryName] = useState('');
  const [filters, setFilters] = useState({});
  const [pendingFilters, setPendingFilters] = useState({});
  const [showFilters, setShowFilters] = useState(true);
  const [showPostForm, setShowPostForm] = useState(false);
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
      (c) => String(c.id ?? c.category_id ?? c.slug) === String(selectedCategoryId)
    );
    setCategoryName(match?.name || match?.category_name || 'Category');
  }, [selectedCategoryId, categories]);

  const handlePostPromoted = () => {
    const path = selectedCategoryId
      ? `/promoted-adverts/category/${selectedCategoryId}?postForm=true`
      : '/promoted-adverts?postForm=true';
    if (requireAuth(path, 'You must be logged in to post a promoted advert.')) {
      setShowPostForm(true);
      setSearchParams({ postForm: 'true' });
    }
  };

  useEffect(() => {
    if (searchParams.get('postForm') === 'true' && isAuthenticated) {
      setShowPostForm(true);
    }
  }, [searchParams, isAuthenticated]);

  useEffect(() => {
    (async () => {
      setCategoriesLoading(true);
      try {
        const [catRes, featuredRes] = await Promise.allSettled([
          categoriesAPI.getCategories(),
          promotedAdvertsAPI.getFeatured(),
        ]);
        if (catRes.status === 'fulfilled' && catRes.value?.success) {
          const rows = Array.isArray(catRes.value.data)
            ? catRes.value.data
            : catRes.value.data?.data || [];
          setCategories(rows.length ? rows : PROMOTED_DEMO_CATEGORIES);
        } else {
          setCategories(PROMOTED_DEMO_CATEGORIES);
        }
        if (featuredRes.status === 'fulfilled' && featuredRes.value?.success) {
          const rows = Array.isArray(featuredRes.value.data)
            ? featuredRes.value.data
            : featuredRes.value.data?.data || [];
          setCarouselAdverts(rows.length ? rows : PROMOTED_DEMO_ADVERTS.slice(0, 4));
        } else {
          setCarouselAdverts(PROMOTED_DEMO_ADVERTS.slice(0, 4));
        }
      } catch {
        setCategories(PROMOTED_DEMO_CATEGORIES);
        setCarouselAdverts(PROMOTED_DEMO_ADVERTS.slice(0, 4));
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

  const fetchAdverts = useCallback(async () => {
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
        const feed = await promotedAdvertsAPI.getSiteFeed(params);
        rows = normalizeList(feed);
      } catch {
        rows = [];
      }

      if (!rows.length) {
        const legacy = {
          per_page: 48,
          page: 1,
          search: filters.search || undefined,
          country: filters.country || undefined,
          category: selectedCategoryId || undefined,
          min_price: filters.priceMin || undefined,
          max_price: filters.priceMax || undefined,
        };
        const res = await promotedAdvertsAPI.getAdverts(legacy);
        rows = normalizeList(res);
      }

      if (selectedCategoryId && rows.length) {
        const catName =
          categories.find((c) => String(c.id ?? c.category_id ?? c.slug) === String(selectedCategoryId))
            ?.name || String(selectedCategoryId);
        rows = rows.filter((ad) => {
          const hay = `${ad.category_name || ''} ${ad.category?.name || ''} ${ad.source_label || ''}`.toLowerCase();
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
        let demo = [...PROMOTED_DEMO_ADVERTS];
        if (selectedCategoryId) {
          demo = demo.filter(
            (ad) =>
              String(ad.category_id) === String(selectedCategoryId) ||
              String(ad.category_name).toLowerCase() === String(categoryName || '').toLowerCase()
          );
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
      setAdverts(PROMOTED_DEMO_ADVERTS);
    } finally {
      setLoading(false);
    }
  }, [filters, selectedCategoryId, categories, categoryName]);

  useEffect(() => {
    fetchAdverts();
  }, [fetchAdverts]);

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
      navigate('/promoted-adverts');
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
    navigate(`/promoted-adverts/category/${categoryId}`);
  };

  const handleAdvertClick = async (advert) => {
    try {
      if (advert.slug) await promotedAdvertsAPI.trackClick(advert.slug);
    } catch {
      /* ignore */
    }
    navigate(advert.href || `/promoted-adverts/${advert.slug || advert.id}`);
  };

  const filterFields = (
    <StandardListingFilters
      filters={pendingFilters}
      onFilterChange={handleFilterChange}
      onApply={applyFilters}
      onClear={isCategoryView ? clearExtraFilters : clearFilters}
      theme="orange"
      asPanel={false}
      showActions={false}
      showTitle={false}
    />
  );

  const activeFilterCount = Object.entries(filters).filter(([, v]) => {
    if (typeof v === 'boolean') return v;
    return v !== '' && v != null;
  }).length;

  const listingCount = useMemo(() => adverts.length, [adverts]);

  return (
    <div className="min-h-screen bg-gray-50 overflow-x-hidden">
      <UnifiedNavbar showBackButton backHref={isCategoryView ? '/promoted-adverts' : '/'} />

      <PromotedHero
        categoryLabel={isCategoryView ? categoryName : null}
        searchValue={topSearch}
        onSearchChange={(e) => setTopSearch(e.target.value)}
        onSearchSubmit={applyTopSearch}
      />

      <div className="page-container py-4 sm:py-6">
        {!isCategoryView && (
          <PromotedCategoryGrid
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
          theme="orange"
          homeHref="/promoted-adverts"
          filterFields={filterFields}
          activeCount={activeFilterCount}
          toolbarLeft={
            <p className="text-sm text-gray-600">
              {loading ? 'Loading…' : `${listingCount} listings`}
            </p>
          }
        >
          {!isCategoryView && carouselAdverts.length > 0 && (
            <div className="mb-5">
              <PromotedCarousel adverts={carouselAdverts} onAdvertClick={handleAdvertClick} />
            </div>
          )}

          {hasActiveFilters(filters) && !loading && adverts.length === 0 && (
            <div className="mb-4">
              <button
                type="button"
                onClick={clearExtraFilters}
                className="text-xs font-medium text-orange-700 hover:text-orange-900"
              >
                Clear and show all
              </button>
            </div>
          )}

          {loading ? (
            <div className="text-center py-12">
              <div className="inline-block h-10 w-10 animate-spin rounded-full border-4 border-orange-600 border-r-transparent" />
            </div>
          ) : adverts.length === 0 ? (
            <div className="text-center py-10 bg-white rounded-xl border border-gray-200">
              <h3 className="text-base font-semibold text-gray-900 mb-2">No promoted adverts found</h3>
              <p className="text-sm text-gray-600 mb-4">Try changing your selection</p>
              <button
                type="button"
                onClick={clearExtraFilters}
                className="px-4 py-2 text-sm bg-orange-600 text-white rounded-lg hover:bg-orange-700"
              >
                Reset
              </button>
            </div>
          ) : (
            <PromotedGrid
              adverts={adverts}
              loading={false}
              onAdvertClick={handleAdvertClick}
            />
          )}

          <BrowseBottomPostCta
            buttonLabel="List your promoted ads"
            onPostClick={handlePostPromoted}
            theme="orange"
            buttonOnly
          />
        </BrowseFilterLayout>

        {/* Kept extras — arranged below the main browse layout */}
        <div className="mt-8 grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="lg:col-span-2 space-y-6">
            <div className="bg-white rounded-xl border border-gray-200 p-5">
              <h2 className="text-sm font-bold text-gray-900 mb-4 flex items-center gap-2">
                <Crown className="h-4 w-4 text-orange-500" />
                Promoted sellers
              </h2>
              <PromotedSellerProfile />
            </div>
          </div>
          <aside>
            <div className="lg:sticky lg:top-24">
              <PromotedActivityFeed />
            </div>
          </aside>
        </div>
      </div>

      <AnimatePresence>
        {showPostForm && (
          <PromotedPostForm
            onClose={() => {
              setShowPostForm(false);
              setSearchParams({});
            }}
          />
        )}
      </AnimatePresence>

      <Footer />
    </div>
  );
};

export default PromotedAdvertsPage;
