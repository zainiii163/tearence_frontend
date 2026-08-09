import React, { useState, useEffect, useCallback, useMemo } from 'react';
import { AnimatePresence } from 'framer-motion';
import { useNavigate, useSearchParams } from 'react-router-dom';
import useAuthRedirect from '../hooks/useAuthRedirect';
import SponsoredHero from '../Component/sponsored/SponsoredHero';
import SponsoredCategoryGrid from '../Component/sponsored/SponsoredCategoryGrid';
import SponsoredAdvertCard from '../Component/sponsored/SponsoredAdvertCard';
import SponsoredPostForm from '../Component/sponsored/SponsoredPostForm';
import StandardListingFilters from '../Component/shared/StandardListingFilters';
import CategoryPageShell from '../Component/shared/CategoryPageShell';
import CompactPremiumReel from '../Component/shared/CompactPremiumReel';
import { getCategoryTheme } from '../constants/categoryThemes';
import sponsoredAdvertsAPI from '../api/sponsoredAdvertsAPI';
import { pickPremiumForReel } from '../utils/listingPromotionSort';

const hasActiveFilters = (activeFilters = {}) =>
  Object.entries(activeFilters).some(([, value]) => {
    if (typeof value === 'boolean') return value;
    return value !== '' && value != null;
  });

/**
 * Same browse pattern as Buy & Sell / Vehicles:
 * marketplace hero → category chips → left filters → listings → List CTA.
 */
const SponsoredAdvertsPage = ({ initialCategoryId = null }) => {
  const { requireAuth, isAuthenticated } = useAuthRedirect();
  const [searchParams, setSearchParams] = useSearchParams();
  const navigate = useNavigate();

  const [adverts, setAdverts] = useState([]);
  const [categories, setCategories] = useState([]);
  const [categoriesLoading, setCategoriesLoading] = useState(true);
  const [selectedCategoryId, setSelectedCategoryId] = useState(initialCategoryId);
  const [categoryName, setCategoryName] = useState('');
  const [filters, setFilters] = useState({});
  const [pendingFilters, setPendingFilters] = useState({});
  const [showFilters, setShowFilters] = useState(true);
  const [showPostForm, setShowPostForm] = useState(false);
  const [savedAdverts, setSavedAdverts] = useState([]);
  const [topSearch, setTopSearch] = useState('');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

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

  const handleCloseModal = () => {
    setShowPostForm(false);
    setSearchParams({});
  };

  const handlePostSponsored = () => {
    const path = selectedCategoryId
      ? `/sponsored-adverts/category/${selectedCategoryId}?postForm=true`
      : '/sponsored-adverts?postForm=true';
    if (requireAuth(path, 'You must be logged in to post a sponsored advert.')) {
      setShowPostForm(true);
      setSearchParams({ postForm: 'true' });
    }
  };

  const handleFormSubmit = async (formData) => {
    try {
      setError(null);
      const response = await sponsoredAdvertsAPI.createSponsoredAdvert(formData);
      if (response.success) {
        handleCloseModal();
        await fetchAdverts();
      } else {
        setError(response.message || 'Failed to create sponsored advert');
      }
    } catch (err) {
      setError(err.message || 'Failed to create sponsored advert');
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
        const catRes = await sponsoredAdvertsAPI.getCategories();
        if (catRes?.success) {
          const categoriesData = Array.isArray(catRes.data)
            ? catRes.data
            : catRes.data?.data || [];
          setCategories(Array.isArray(categoriesData) ? categoriesData : []);
        } else {
          setCategories([]);
        }
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

  const fetchAdverts = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const params = {
        per_page: selectedCategoryId ? 50 : 48,
        page: 1,
        search: filters.search || undefined,
        country: filters.country || undefined,
        city: filters.city || undefined,
        category_id: selectedCategoryId || undefined,
      };
      if (filters.priceMin) params.price_min = filters.priceMin;
      if (filters.priceMax) params.price_max = filters.priceMax;

      let rows = [];
      try {
        const feed = await sponsoredAdvertsAPI.getSiteFeed(params);
        rows = normalizeList(feed);
      } catch {
        rows = [];
      }

      if (!rows.length) {
        const fallback = await sponsoredAdvertsAPI.getSponsoredAdverts(params);
        rows = normalizeList(fallback);
      }

      if (selectedCategoryId && rows.length) {
        const catName =
          categories.find((c) => String(c.id ?? c.category_id) === String(selectedCategoryId))
            ?.name ||
          categories.find((c) => String(c.id ?? c.category_id) === String(selectedCategoryId))
            ?.category_name ||
          String(selectedCategoryId);
        rows = rows.filter((ad) => {
          const hay = `${ad.category_name || ''} ${ad.source_label || ''} ${ad.source || ''}`.toLowerCase();
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

      setAdverts(rows);
    } catch (err) {
      console.error(err);
      setError(err?.message || 'Failed to load sponsored adverts');
      setAdverts([]);
    } finally {
      setLoading(false);
    }
  }, [filters, selectedCategoryId, categories]);

  useEffect(() => {
    fetchAdverts();
  }, [fetchAdverts]);

  const featuredRow = useMemo(
    () => pickPremiumForReel(adverts, { limit: 12, allowFallback: true }),
    [adverts]
  );
  const mainListings = useMemo(() => {
    if (filters.featured || filters.promoted || filters.sponsored) return adverts;
    const featuredIds = new Set(featuredRow.map((ad) => ad.id || ad.sponsored_advert_id));
    return adverts.filter((ad) => !featuredIds.has(ad.id || ad.sponsored_advert_id));
  }, [adverts, filters, featuredRow]);

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
      navigate('/sponsored-adverts');
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
    navigate(`/sponsored-adverts/category/${categoryId}`);
  };

  const handleSaveAdvert = async (advertId) => {
    if (!requireAuth('/sponsored-adverts', 'You must be logged in to save adverts.')) return;
    try {
      await sponsoredAdvertsAPI.saveAdvert?.(advertId);
      setSavedAdverts((prev) =>
        prev.includes(advertId) ? prev.filter((id) => id !== advertId) : [...prev, advertId]
      );
    } catch (err) {
      console.error('Save advert failed:', err);
    }
  };

  const handleViewAdvert = (advert) => {
    const href = advert.href || `/sponsored-adverts/${advert.slug || advert.id}`;
    navigate(href);
  };

  const theme = getCategoryTheme('sponsored');

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

  /** Attach rotating post images from loaded sponsored ads onto each category card. */
  const categoriesWithImages = useMemo(() => {
    const byId = new Map();
    const byName = new Map();
    const push = (map, key, img) => {
      if (!key || !img) return;
      const k = String(key).toLowerCase();
      const list = map.get(k) || [];
      if (list.includes(img) || list.length >= 8) return;
      list.push(img);
      map.set(k, list);
    };
    const adImage = (ad) =>
      ad?.image_url ||
      ad?.cover_image ||
      ad?.thumbnail ||
      ad?.banner_image ||
      ad?.photo ||
      (Array.isArray(ad?.images) ? ad.images[0] : null) ||
      null;

    for (const ad of adverts || []) {
      const img = adImage(ad);
      if (!img) continue;
      push(byId, ad.category_id, img);
      push(byName, ad.category_name || ad.category, img);
    }

    return (categories || []).map((c) => {
      const id = c.id ?? c.category_id;
      const name = c.name || c.category_name || '';
      const gallery =
        byId.get(String(id).toLowerCase()) ||
        byName.get(String(name).toLowerCase()) ||
        [];
      return {
        ...c,
        images: gallery,
        post_images: gallery,
        image: gallery[0] || c.image || c.image_url || null,
        image_url: gallery[0] || c.image_url || c.image || null,
      };
    });
  }, [categories, adverts]);

  const renderGrid = (items) => (
    <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-4">
      {items.map((advert) => (
        <SponsoredAdvertCard
          key={advert.id || advert.sponsored_advert_id}
          advert={advert}
          viewMode="grid"
          isSaved={savedAdverts.includes(advert.sponsored_advert_id || advert.id)}
          onSave={() => handleSaveAdvert(advert.sponsored_advert_id || advert.id)}
          onView={() => handleViewAdvert(advert)}
        />
      ))}
    </div>
  );

  return (
    <CategoryPageShell
      categoryId="sponsored"
      backHref={isCategoryView ? '/sponsored-adverts' : '/adverts'}
      showBackBar
      backBarTo={isCategoryView ? '/sponsored-adverts' : '/adverts'}
      backBarLabel={isCategoryView ? 'Back to Sponsored' : 'Back to Adverts'}
      hero={
        <SponsoredHero
          categoryLabel={isCategoryView ? categoryName : null}
          searchValue={topSearch}
          onSearchChange={(e) => setTopSearch(e.target.value)}
          onSearchSubmit={applyTopSearch}
        />
      }
      categoryGrid={
        !isCategoryView ? (
          <SponsoredCategoryGrid
            categories={categoriesWithImages}
            selectedCategoryId={selectedCategoryId}
            onSelectCategory={handleCategorySelect}
            loading={categoriesLoading}
          />
        ) : null
      }
      premiumReel={
        featuredRow.length > 0 ? (
          <CompactPremiumReel
            items={featuredRow}
            title="Featured"
            getHref={(item) => item.href || `/sponsored-adverts/${item.slug || item.id}`}
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
        homeHref: '/sponsored-adverts',
        filterFields,
        activeCount: activeFilterCount,
      }}
      bottomCta={{
        buttonLabel: 'List your sponsored ads',
        onPostClick: handlePostSponsored,
        theme: theme.ctaTheme,
        buttonOnly: true,
      }}
      afterContent={
        <AnimatePresence>
          {showPostForm && (
            <SponsoredPostForm onClose={handleCloseModal} onSubmit={handleFormSubmit} />
          )}
        </AnimatePresence>
      }
    >
          {error && (
            <div className="mb-4 rounded-lg border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-800">
              {error}
              <button
                type="button"
                onClick={() => fetchAdverts()}
                className="ml-3 font-semibold underline"
              >
                Retry
              </button>
            </div>
          )}

          {hasActiveFilters(filters) && !loading && adverts.length === 0 && (
            <div className="mb-4">
              <button
                type="button"
                onClick={clearExtraFilters}
                className="text-xs font-medium text-amber-700 hover:text-amber-900"
              >
                Clear and show all
              </button>
            </div>
          )}

          {loading ? (
            <div className="text-center py-12">
              <div className="inline-block h-10 w-10 animate-spin rounded-full border-4 border-amber-600 border-r-transparent" />
            </div>
          ) : adverts.length === 0 ? (
            <div className="text-center py-10 bg-white rounded-xl border border-gray-200">
              <h3 className="text-base font-semibold text-gray-900 mb-2">No sponsored adverts found</h3>
              <p className="text-sm text-gray-600 mb-4">Try changing your selection</p>
              <button
                type="button"
                onClick={clearExtraFilters}
                className="px-4 py-2 text-sm bg-amber-600 text-white rounded-lg hover:bg-amber-700"
              >
                Reset
              </button>
            </div>
          ) : (
            <section>
              {renderGrid(
                filters.featured || filters.promoted || filters.sponsored
                  ? adverts
                  : mainListings.length
                    ? mainListings
                    : adverts
              )}
            </section>
          )}
    </CategoryPageShell>
  );
};

export default SponsoredAdvertsPage;
