import React, { useCallback, useEffect, useMemo, useState } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import BusinessesForSaleHero from './BusinessesForSaleHero';
import BusinessesForSaleCategoryGrid from './BusinessesForSaleCategoryGrid';
import BusinessesForSaleGrid from './BusinessesForSaleGrid';
import SponsoredPostForm from '../sponsored/SponsoredPostForm';
import StandardListingFilters from '../shared/StandardListingFilters';
import CategoryPageShell from '../shared/CategoryPageShell';
import { getCategoryTheme } from '../../constants/categoryThemes';
import sponsoredAdvertsAPI from '../../api/sponsoredAdvertsAPI';
import useAuthRedirect from '../../hooks/useAuthRedirect';
import {
  BUSINESS_SALE_CATEGORIES,
  getCategoryById,
  matchListingToCategory,
} from './businessesForSaleCategories';
import {
  getPixmuseBusinessForSalePrefill,
  isPixmuseDemo,
} from '../../data/pixmuseDemoPrefill';

const isBusinessListing = (item) => {
  const type = (item.advert_type || '').toLowerCase();
  if (type === 'business') return true;
  const haystack = [item.title, item.tagline, item.description, item.category?.name]
    .filter(Boolean)
    .join(' ')
    .toLowerCase();
  return (
    haystack.includes('business for sale') ||
    haystack.includes('sell business') ||
    haystack.includes('business sale') ||
    haystack.includes('acquisition') ||
    haystack.includes('franchise')
  );
};

const BusinessesForSaleBrowsePage = ({ initialCategoryId = null }) => {
  const navigate = useNavigate();
  const [searchParams, setSearchParams] = useSearchParams();
  const { requireAuth, isAuthenticated } = useAuthRedirect();

  const [listings, setListings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [topSearch, setTopSearch] = useState('');
  const [filters, setFilters] = useState({});
  const [pendingFilters, setPendingFilters] = useState({});
  const [showFilters, setShowFilters] = useState(true);
  const [selectedCategoryId, setSelectedCategoryId] = useState(initialCategoryId);
  const [showPostForm, setShowPostForm] = useState(false);

  const isCategoryView = Boolean(selectedCategoryId);
  const categoryMeta = selectedCategoryId ? getCategoryById(selectedCategoryId) : null;
  const categoryLabel = categoryMeta?.name || null;

  useEffect(() => {
    setSelectedCategoryId(initialCategoryId);
  }, [initialCategoryId]);

  useEffect(() => {
    const wantsForm = searchParams.get('postForm') === 'true';
    const demo = isPixmuseDemo(searchParams);
    if (wantsForm && (demo || isAuthenticated)) {
      setShowPostForm(true);
    }
  }, [searchParams, isAuthenticated]);

  const demoMode = isPixmuseDemo(searchParams);

  const fetchListings = useCallback(async () => {
    setLoading(true);
    try {
      const response = await sponsoredAdvertsAPI.getSponsoredAdverts({
        per_page: 100,
        page: 1,
        advert_type: 'business',
      });

      let items = [];
      if (response?.success) {
        items = Array.isArray(response.data) ? response.data : response.data?.data || [];
      }

      if (!items.length) {
        const fallback = await sponsoredAdvertsAPI.getSponsoredAdverts({ per_page: 100, page: 1 });
        if (fallback?.success) {
          const all = Array.isArray(fallback.data) ? fallback.data : fallback.data?.data || [];
          items = all.filter(isBusinessListing);
        }
      }

      setListings(Array.isArray(items) ? items : []);
    } catch (error) {
      console.error('Error loading businesses for sale:', error);
      setListings([]);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchListings();
  }, [fetchListings]);

  const listingCounts = useMemo(() => {
    const counts = {};
    BUSINESS_SALE_CATEGORIES.forEach((cat) => {
      counts[cat.id] = listings.filter((item) => matchListingToCategory(item, cat.id)).length;
    });
    return counts;
  }, [listings]);

  const filteredListings = useMemo(() => {
    let result = listings;

    if (selectedCategoryId) {
      result = result.filter((item) => matchListingToCategory(item, selectedCategoryId));
    }

    const search = (filters.search || '').trim().toLowerCase();
    if (search) {
      result = result.filter((item) => {
        const haystack = [item.title, item.tagline, item.description, item.city, item.country, item.business_name]
          .filter(Boolean)
          .join(' ')
          .toLowerCase();
        return haystack.includes(search);
      });
    }

    if (filters.country) {
      const q = filters.country.toLowerCase();
      result = result.filter((item) => (item.country || '').toLowerCase().includes(q));
    }
    if (filters.city) {
      const q = filters.city.toLowerCase();
      result = result.filter((item) => (item.city || '').toLowerCase().includes(q));
    }

    if (filters.priceMin) {
      const min = Number(filters.priceMin);
      result = result.filter((item) => Number(item.price || 0) >= min);
    }
    if (filters.priceMax) {
      const max = Number(filters.priceMax);
      result = result.filter((item) => Number(item.price || 0) <= max);
    }

    if (filters.featured || filters.promoted || filters.sponsored) {
      result = result.filter((item) => {
        const checks = [];
        if (filters.featured) checks.push(!!(item.featured || item.is_featured || item.sponsorship_tier === 'plus'));
        if (filters.promoted) checks.push(!!(item.promoted || item.is_promoted || item.sponsorship_tier === 'plus'));
        if (filters.sponsored) checks.push(!!(item.sponsored || item.is_sponsored || item.sponsorship_tier === 'premium'));
        return checks.some(Boolean);
      });
    }

    return result;
  }, [listings, selectedCategoryId, filters]);

  const handleFilterChange = (key, value) => {
    setPendingFilters((prev) => {
      const next = { ...prev, [key]: value };
      if (typeof value === 'boolean' && !value) delete next[key];
      if ((typeof value === 'string' || typeof value === 'number') && value === '') delete next[key];
      return next;
    });
  };

  const applyFilters = () => setFilters({ ...pendingFilters });

  const clearFilters = () => {
    if (isCategoryView) {
      navigate('/businesses-for-sale');
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
    navigate(`/businesses-for-sale/category/${categoryId}`);
  };

  const handleClosePostForm = () => {
    setShowPostForm(false);
    if (searchParams.get('postForm') || searchParams.get('demo')) {
      setSearchParams({}, { replace: true });
    }
  };

  const handlePostClick = () => {
    if (requireAuth('/businesses-for-sale?postForm=true', 'You must be logged in to post a business for sale.')) {
      setShowPostForm(true);
    }
  };

  const handleFormSuccess = () => {
    handleClosePostForm();
    fetchListings();
  };

  const theme = getCategoryTheme('investment');

  const filterFields = (
    <StandardListingFilters
      filters={pendingFilters}
      onFilterChange={handleFilterChange}
      onApply={applyFilters}
      onClear={isCategoryView ? clearExtraFilters : clearFilters}
      theme={theme.filterTheme}
      searchPlaceholder="Search businesses…"
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
      categoryId="investment"
      backHref={isCategoryView ? '/businesses-for-sale' : '/'}
      hero={
        <BusinessesForSaleHero
          categoryLabel={categoryLabel}
          searchValue={topSearch}
          onSearchChange={(e) => setTopSearch(e.target.value)}
          onSearchSubmit={applyTopSearch}
          templatesHref={
            selectedCategoryId
              ? `/businesses-for-sale/templates?category=${selectedCategoryId}&name=${encodeURIComponent(categoryLabel || '')}`
              : '/businesses-for-sale/templates'
          }
          calculatorsHref="/businesses-for-sale/calculators"
        />
      }
      categoryGrid={
        !isCategoryView ? (
            <div className="mb-6">
              <BusinessesForSaleCategoryGrid
                selectedCategoryId={selectedCategoryId}
                selectedGroupId={null}
                onSelectCategory={handleCategorySelect}
                onSelectGroup={() => {}}
                listingCounts={listingCounts}
              />
            </div>
        ) : null
      }
      filterLayoutProps={{
        open: showFilters,
        onOpenChange: setShowFilters,
        onApply: applyFilters,
        onClear: isCategoryView ? clearExtraFilters : clearFilters,
        theme: theme.filterTheme,
        homeHref: '/businesses-for-sale',
        filterFields,
        activeCount: activeFilterCount,
      }}
      bottomCta={{
        buttonLabel: 'List your business for sale',
        onPostClick: handlePostClick,
        theme: theme.ctaTheme,
      }}
      afterContent={
        showPostForm ? (
          <div className="fixed inset-0 z-50 overflow-y-auto bg-white">
            <SponsoredPostForm
              defaultAdvertType="business"
              demoMode={demoMode}
              prefillData={demoMode ? getPixmuseBusinessForSalePrefill() : null}
              formTitle="Post Business for Sale"
              formSubtitle="List your business for buyers worldwide"
              onCancel={handleClosePostForm}
              onSuccess={handleFormSuccess}
            />
          </div>
        ) : null
      }
    >
      <BusinessesForSaleGrid listings={filteredListings} loading={loading} />
    </CategoryPageShell>
  );
};

export default BusinessesForSaleBrowsePage;
