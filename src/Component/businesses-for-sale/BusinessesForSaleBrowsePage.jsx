import React, { useCallback, useEffect, useMemo, useState } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { FiPlus } from 'react-icons/fi';
import UnifiedNavbar from '../UnifiedNavbar';
import Footer from '../Footer';
import BusinessesForSaleHero from './BusinessesForSaleHero';
import BusinessesForSaleCategoryGrid from './BusinessesForSaleCategoryGrid';
import BusinessesForSaleGrid from './BusinessesForSaleGrid';
import SponsoredPostForm from '../sponsored/SponsoredPostForm';
import BrowseBottomPostCta from '../shared/BrowseBottomPostCta';
import BrowseCategoryTemplates from '../shared/BrowseCategoryTemplates';
import StandardListingFilters from '../shared/StandardListingFilters';
import { BrowseFilterLayout } from '../shared/BrowseFilterLayout';
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

  const filterFields = (
    <StandardListingFilters
      filters={pendingFilters}
      onFilterChange={handleFilterChange}
      onApply={applyFilters}
      onClear={isCategoryView ? clearExtraFilters : clearFilters}
      theme="orange"
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
    <div className="min-h-screen bg-gray-50">
      <UnifiedNavbar showBackButton backHref={isCategoryView ? '/businesses-for-sale' : '/'} />
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

      <div className="page-container py-4 sm:py-6">
        <BrowseFilterLayout
          open={showFilters}
          onOpenChange={setShowFilters}
          onApply={applyFilters}
          onClear={isCategoryView ? clearExtraFilters : clearFilters}
          theme="orange"
          homeHref="/businesses-for-sale"
          filterFields={filterFields}
          activeCount={activeFilterCount}
          toolbarLeft={
            <p className="text-sm text-gray-600">
              {loading ? 'Loading…' : `${filteredListings.length} listings`}
            </p>
          }
          toolbarRight={
            <button
              type="button"
              onClick={handlePostClick}
              className="inline-flex items-center gap-1 px-3 py-1.5 text-xs sm:text-sm font-semibold text-white bg-amber-600 hover:bg-amber-700 rounded-lg"
            >
              <FiPlus className="h-3.5 w-3.5" />
              Post
            </button>
          }
        >
          {!isCategoryView && (
            <div className="mb-6">
              <BusinessesForSaleCategoryGrid
                selectedCategoryId={selectedCategoryId}
                selectedGroupId={null}
                onSelectCategory={handleCategorySelect}
                onSelectGroup={() => {}}
                listingCounts={listingCounts}
              />
            </div>
          )}

          <BusinessesForSaleGrid listings={filteredListings} loading={loading} />

          <BrowseCategoryTemplates
            vertical="businesses-for-sale"
            categoryKey={selectedCategoryId || ''}
            categoryName={categoryLabel || ''}
            theme="orange"
            onBrowseClick={() =>
              navigate(
                selectedCategoryId
                  ? `/businesses-for-sale/templates?category=${selectedCategoryId}&name=${encodeURIComponent(categoryLabel || '')}`
                  : '/businesses-for-sale/templates'
              )
            }
            browseLabel="Browse templates"
            sellLabel="Sell a template"
          />

          <BrowseBottomPostCta
            title="Sell your business"
            description="List an online or physical business — Free, Paid, Featured or Sponsored."
            buttonLabel="Post business for sale"
            onPostClick={handlePostClick}
            theme="orange"
          />
        </BrowseFilterLayout>
      </div>

      <Footer />

      {showPostForm && (
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
      )}
    </div>
  );
};

export default BusinessesForSaleBrowsePage;
