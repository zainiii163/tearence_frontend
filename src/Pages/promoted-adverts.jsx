import React, { useState, useEffect, useCallback, useMemo } from 'react';
import { AnimatePresence } from 'framer-motion';
import { useNavigate, useSearchParams } from 'react-router-dom';
import useAuthRedirect from '../hooks/useAuthRedirect';
import PromotedHero from '../Component/promoted-new/PromotedHero';
import PromotedCategoryGrid from '../Component/promoted-new/PromotedCategoryGrid';
import PromotedGrid from '../Component/promoted-new/PromotedGrid';
import PromotedPostForm from '../Component/promoted-new/PromotedPostForm';
import StandardListingFilters from '../Component/shared/StandardListingFilters';
import CategoryPageShell from '../Component/shared/CategoryPageShell';
import CompactPremiumReel from '../Component/shared/CompactPremiumReel';
import { getCategoryTheme } from '../constants/categoryThemes';
import { promotedAdvertsAPI, categoriesAPI } from '../services/promotedAdvertsAPI';
import { pickPremiumForReel } from '../utils/listingPromotionSort';
import {
  normalizeBrowseAdverts,
  isLowQualityBrowseFeed,
} from '../utils/normalizeBrowseAdvert';
import { buildCrossCategoryFeed } from '../utils/buildCrossCategoryFeed';
import { resolveCrossFeedHref } from '../utils/resolveCrossFeedHref';

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
          setCategories(Array.isArray(rows) ? rows : []);
        } else {
          setCategories([]);
        }
        if (featuredRes.status === 'fulfilled' && featuredRes.value?.success) {
          const rows = Array.isArray(featuredRes.value.data)
            ? featuredRes.value.data
            : featuredRes.value.data?.data || [];
          setCarouselAdverts(Array.isArray(rows) ? rows.slice(0, 8) : []);
        } else {
          setCarouselAdverts([]);
        }
        if (
          (featuredRes.status !== 'fulfilled' ||
            !(Array.isArray(featuredRes.value?.data)
              ? featuredRes.value.data
              : featuredRes.value?.data?.data || []
            ).length)
        ) {
          try {
            const real = await buildCrossCategoryFeed('promoted', { per_page: 8 });
            if (real.length) setCarouselAdverts(real.slice(0, 8));
          } catch {
            /* ignore */
          }
        }
      } catch {
        setCategories([]);
        setCarouselAdverts([]);
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
        per_page: 24,
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
          per_page: 24,
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

      if (!rows.length || isLowQualityBrowseFeed(rows)) {
        try {
          const real = await buildCrossCategoryFeed('promoted', {
            per_page: 24,
            search: filters.search,
            country: filters.country,
          });
          if (real.length) rows = real;
        } catch (e) {
          console.warn('Cross-category promoted feed failed', e);
        }
      }

      rows = normalizeBrowseAdverts(rows).map((ad) => ({
        ...ad,
        href: ad.href || resolveCrossFeedHref(ad, '/promoted-adverts'),
        promoted: true,
        is_promoted: true,
      }));

      setAdverts(rows);
    } catch (err) {
      console.error(err);
      setAdverts([]);
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
    navigate(resolveCrossFeedHref(advert, '/promoted-adverts'));
  };

  const theme = getCategoryTheme('promoted');

  const reelItems = useMemo(
    () =>
      pickPremiumForReel(
        carouselAdverts.length ? carouselAdverts : adverts,
        { limit: 12, allowFallback: true }
      ),
    [carouselAdverts, adverts]
  );

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
      categoryId="promoted"
      backHref={isCategoryView ? '/promoted-adverts' : '/adverts'}
      showBackBar
      backBarTo={isCategoryView ? '/promoted-adverts' : '/adverts'}
      backBarLabel={isCategoryView ? 'Back to Promoted' : 'Back to Adverts'}
      hero={
        <PromotedHero
          categoryLabel={isCategoryView ? categoryName : null}
          searchValue={topSearch}
          onSearchChange={(e) => setTopSearch(e.target.value)}
          onSearchSubmit={applyTopSearch}
        />
      }
      categoryGrid={
        !isCategoryView ? (
          <PromotedCategoryGrid
            categories={categories}
            selectedCategoryId={selectedCategoryId}
            onSelectCategory={handleCategorySelect}
            loading={categoriesLoading}
          />
        ) : null
      }
      premiumReel={
        reelItems.length > 0 ? (
          <CompactPremiumReel
            items={reelItems}
            title="Featured"
            getHref={(item) => resolveCrossFeedHref(item, '/promoted-adverts')}
            onItemClick={handleAdvertClick}
            accentClass={theme.accentText || 'text-orange-700'}
            borderAccent="hover:border-orange-300"
          />
        ) : null
      }
      filterLayoutProps={{
        open: showFilters,
        onOpenChange: setShowFilters,
        onApply: applyFilters,
        onClear: isCategoryView ? clearExtraFilters : clearFilters,
        theme: theme.filterTheme,
        homeHref: '/promoted-adverts',
        filterFields,
        activeCount: activeFilterCount,
      }}
      bottomCta={{
        buttonLabel: 'List your promoted ads',
        onPostClick: handlePostPromoted,
        theme: theme.ctaTheme,
        buttonOnly: true,
      }}
      afterContent={
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
      }
    >
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
    </CategoryPageShell>
  );
};

export default PromotedAdvertsPage;
