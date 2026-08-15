import React, { useState, useEffect, useCallback, useMemo } from 'react';
import { AnimatePresence } from 'framer-motion';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { FiPlus } from 'react-icons/fi';
import { useAuthRedirect } from '../../hooks/useAuthRedirect';
import { buysellAPI } from '../../api/buysell';
import BuySellHero from './BuySellHero';
import BuySellGrid from './BuySellGrid';
import BuySellPostForm from './BuySellPostForm';
import StandardListingFilters from '../shared/StandardListingFilters';
import BuySellCategoryGrid from './BuySellCategoryGrid';
import CategoryPageShell from '../shared/CategoryPageShell';
import CompactPremiumReel from '../shared/CompactPremiumReel';
import { getCategoryTheme } from '../../constants/categoryThemes';
import { splitListingsByPromotion } from '../../utils/listingPromotionSort';
import { withoutBrandMisuseListings } from '../../utils/hideBrandMisuseListings';
import { displayMarketplaceCategoryName } from '../../utils/categoryDisplayNames';
import { mockBuySellData } from '../../data/mockBuySellData';
import ErrorBoundary from '../ErrorBoundary/ErrorBoundary';
import EbayAdsDrawer from './EbayAdsDrawer';

const matchesPostTypeFilters = (ad, activeFilters) => {
  const checks = [];
  if (activeFilters.featured) checks.push(!!(ad.featured || ad.is_featured));
  if (activeFilters.promoted) checks.push(!!(ad.is_promoted || ad.promoted));
  if (activeFilters.sponsored) checks.push(!!(ad.is_sponsored || ad.sponsored));
  if (!activeFilters.featured && !activeFilters.promoted && !activeFilters.sponsored) return true;
  return checks.some(Boolean);
};

const hasActiveFilters = (activeFilters = {}) =>
  Object.entries(activeFilters).some(([, value]) => {
    if (typeof value === 'boolean') return value;
    return value !== '' && value != null;
  });

const applyClientFilters = (items, activeFilters) => {
  let result = [...items];

  if (activeFilters.featured || activeFilters.promoted || activeFilters.sponsored) {
    result = result.filter((ad) => matchesPostTypeFilters(ad, activeFilters));
  } else if (activeFilters.other) {
    result = result.filter((ad) => !ad.featured && !ad.is_featured && !ad.is_promoted && !ad.promoted && !ad.is_sponsored && !ad.sponsored);
  }

  if (activeFilters.city) {
    const q = activeFilters.city.toLowerCase();
    result = result.filter((ad) => (ad.city || '').toLowerCase().includes(q));
  }

  return result;
};

const BuySellBrowsePage = ({
  initialCategoryId = null,
  hubKey = 'buy-sell',
  basePath = '/buy-sell',
}) => {
  const navigate = useNavigate();
  const { requireAuth, isAuthenticated } = useAuthRedirect();
  const [searchParams, setSearchParams] = useSearchParams();
  const [selectedCategoryId, setSelectedCategoryId] = useState(initialCategoryId);
  const [categoryName, setCategoryName] = useState('');
  const [filters, setFilters] = useState({});
  const [pendingFilters, setPendingFilters] = useState({});
  const [showPostForm, setShowPostForm] = useState(false);
  const [showFilters, setShowFilters] = useState(true);
  const [adverts, setAdverts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [topSearch, setTopSearch] = useState('');

  const isCategoryView = Boolean(selectedCategoryId);
  const postTypeFilterActive = !!(filters.featured || filters.promoted || filters.sponsored);
  const theme = getCategoryTheme(hubKey);
  const isClassifiedsHub = hubKey === 'classifieds';

  useEffect(() => {
    setSelectedCategoryId(initialCategoryId);
  }, [initialCategoryId]);

  useEffect(() => {
    if (!selectedCategoryId) {
      setCategoryName('');
      return;
    }
    buysellAPI
      .getCategories()
      .then((cats) => {
        const match = cats.find((c) => String(c.id) === String(selectedCategoryId));
        setCategoryName(displayMarketplaceCategoryName(match?.name || 'Category', match?.slug));
      })
      .catch(() => setCategoryName('Category'));
  }, [selectedCategoryId]);

  const handlePostClick = () => {
    const path = selectedCategoryId
      ? `${basePath}/category/${selectedCategoryId}?postForm=true`
      : `${basePath}?postForm=true`;
    if (
      requireAuth(
        path,
        isClassifiedsHub
          ? 'You must be logged in to post a classified advert.'
          : 'You must be logged in to list your item or product for sale.'
      )
    ) {
      setShowPostForm(true);
      setSearchParams({ postForm: 'true' });
    }
  };

  useEffect(() => {
    if (searchParams.get('postForm') === 'true' && isAuthenticated) {
      setShowPostForm(true);
    }
  }, [searchParams, isAuthenticated]);

  const fetchAdverts = useCallback(async () => {
    setLoading(true);
    try {
      const params = {
        page: 1,
        limit: selectedCategoryId ? 50 : 100,
        category: selectedCategoryId || 'all',
        search: filters.search || '',
        sortBy: 'newest',
        sortOrder: 'desc',
        priceMin: filters.priceMin || '',
        priceMax: filters.priceMax || '',
        country: filters.country || '',
        city: filters.city || '',
      };

      const response = await buysellAPI.getAdverts(params);
      const live = withoutBrandMisuseListings(applyClientFilters(response.items || [], filters));
      if (live.length) {
        setAdverts(live);
      } else {
        const demo = withoutBrandMisuseListings(
          applyClientFilters(
            mockBuySellData.map((item) => ({
              ...item,
              location: item.location || item.city,
              city: item.city || String(item.location || '').split(',')[0] || '',
              is_featured: !!(item.featured || item.is_featured),
              featured: !!(item.featured || item.is_featured),
              is_promoted: !!(item.promoted || item.is_promoted),
              promoted: !!(item.promoted || item.is_promoted),
              is_sponsored: !!(item.sponsored || item.is_sponsored),
              sponsored: !!(item.sponsored || item.is_sponsored),
            })),
            filters
          )
        );
        setAdverts(demo);
      }
    } catch (error) {
      console.error('Error fetching adverts:', error);
      setAdverts(
        withoutBrandMisuseListings(
          mockBuySellData.map((item) => ({
            ...item,
            is_featured: !!(item.featured || item.is_featured),
            featured: !!(item.featured || item.is_featured),
            is_promoted: !!(item.promoted || item.is_promoted),
            promoted: !!(item.promoted || item.is_promoted),
          }))
        )
      );
    } finally {
      setLoading(false);
    }
  }, [selectedCategoryId, filters]);

  useEffect(() => {
    fetchAdverts();
  }, [fetchAdverts]);

  /** Clive: never show WWA-branded demo/test listings in Buy & Sell (brand killer). */
  const publicAdverts = useMemo(() => {
    const brandKiller = /world\s*wide\s*adverts|worldwide\s*adverts|\bwwa\b/i;
    return (adverts || []).filter((ad) => {
      const hay = [ad?.title, ad?.description, ad?.seller_name, ad?.brand]
        .filter(Boolean)
        .join(' ');
      return !brandKiller.test(hay);
    });
  }, [adverts]);

  const { featured, sponsored, regular } = useMemo(
    () => splitListingsByPromotion(publicAdverts),
    [publicAdverts]
  );

  const handleFilterChange = (filterName, value) => {
    setPendingFilters((prev) => {
      const next = { ...prev, [filterName]: value };
      if (typeof value === 'boolean' && !value) delete next[filterName];
      if ((typeof value === 'string' || typeof value === 'number') && value === '') delete next[filterName];
      return next;
    });
  };

  const applyFilters = () => {
    setFilters({ ...pendingFilters });
  };

  const clearFilters = () => {
    if (isCategoryView) {
      navigate(basePath);
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

  const handleClosePostForm = () => {
    setShowPostForm(false);
    setSearchParams({});
    fetchAdverts();
  };

  const handleCategorySelect = (categoryId) => {
    navigate(`${basePath}/category/${categoryId}`);
  };

  const filterFields = (
    <StandardListingFilters
      filters={pendingFilters}
      onFilterChange={handleFilterChange}
      onApply={applyFilters}
      onClear={isCategoryView ? clearExtraFilters : clearFilters}
      theme={theme.filterTheme}
      searchPlaceholder="Search by item name…"
      asPanel={false}
      showActions={false}
      showTitle={false}
    />
  );

  const activeFilterCount = Object.entries(filters).filter(([, v]) => {
    if (typeof v === 'boolean') return v;
    return v !== '' && v != null;
  }).length;

  const templatesHref = selectedCategoryId
    ? `${basePath}/templates?category=${selectedCategoryId}&name=${encodeURIComponent(categoryName)}`
    : `${basePath}/templates`;

  return (
    <ErrorBoundary>
      <CategoryPageShell
        categoryId={hubKey}
        backHref={isCategoryView ? basePath : '/'}
        showBackBar
        backBarTo={isCategoryView ? basePath : '/'}
        backBarLabel={
          isCategoryView
            ? hubKey === 'classifieds'
              ? 'Back to Classifieds'
              : 'Back to Buy & Sell'
            : 'Back Home'
        }
        hero={
          <BuySellHero
            hubKey={hubKey}
            categoryLabel={isCategoryView ? categoryName : null}
            searchValue={topSearch}
            onSearchChange={(e) => setTopSearch(e.target.value)}
            onSearchSubmit={applyTopSearch}
            templatesHref={templatesHref}
            calculatorsHref={`${basePath}/calculators`}
          />
        }
        categoryGrid={
          !isCategoryView ? (
            <BuySellCategoryGrid
              selectedCategoryId={selectedCategoryId}
              onSelectCategory={handleCategorySelect}
            />
          ) : null
        }
        premiumReel={
          !postTypeFilterActive && featured.length > 0 ? (
            <CompactPremiumReel
              items={featured}
              title="Featured"
              getHref={(item) => `/item/${item.id}`}
              accentClass={theme.accentText}
              borderAccent="hover:border-emerald-300"
            />
          ) : null
        }
        filterLayoutProps={{
          open: showFilters,
          onOpenChange: setShowFilters,
          onApply: applyFilters,
          onClear: isCategoryView ? clearExtraFilters : clearFilters,
          filterFields,
          activeCount: activeFilterCount,
        }}
        bottomCta={{
          buttonLabel: isClassifiedsHub ? 'Post a classified' : 'Start selling',
          onPostClick: handlePostClick,
        }}
        afterContent={
          <>
            {!isClassifiedsHub && <EbayAdsDrawer />}
            <AnimatePresence>
              {showPostForm && (
                <BuySellPostForm onClose={handleClosePostForm} onSuccess={fetchAdverts} />
              )}
            </AnimatePresence>
          </>
        }
      >
        {hasActiveFilters(filters) && !loading && adverts.length === 0 && (
          <div className="mb-4">
            <button
              type="button"
              onClick={clearExtraFilters}
              className={`text-xs font-medium ${theme.accentText} hover:opacity-80`}
            >
              Clear and show all
            </button>
          </div>
        )}

        {!loading && publicAdverts.length === 0 ? (
          <div className="text-center py-10 bg-white rounded-xl border border-gray-200">
            <h3 className="text-base font-semibold text-gray-900 mb-2">No items found</h3>
            <p className="text-sm text-gray-600 mb-4">Try changing your selection</p>
            <button
              type="button"
              onClick={clearExtraFilters}
              className={`px-4 py-2 text-sm text-white rounded-lg ${theme.accentButton}`}
            >
              Reset
            </button>
          </div>
        ) : (
          <>
            {postTypeFilterActive ? (
              <BuySellGrid adverts={publicAdverts} loading={loading} viewMode="grid" maxItems={9} />
            ) : (
              <>
                <BuySellGrid adverts={regular} loading={loading} viewMode="grid" maxItems={9} />
                <section className="mt-4">
                  <h2 className="text-sm font-bold text-gray-900 mb-2 text-center">Sponsored</h2>
                  {sponsored.length > 0 ? (
                    <BuySellGrid adverts={sponsored} loading={false} viewMode="grid" maxItems={3} />
                  ) : (
                    <div className="rounded-xl border border-dashed border-amber-200 bg-amber-50/60 px-4 py-8 text-center">
                      <p className="text-sm font-semibold text-amber-950">Sponsored adverts</p>
                      <p className="mt-1 text-xs text-amber-900/70">
                        This space is reserved for paid sponsored placements.
                      </p>
                    </div>
                  )}
                </section>
              </>
            )}
          </>
        )}
      </CategoryPageShell>
    </ErrorBoundary>
  );
};

export default BuySellBrowsePage;
