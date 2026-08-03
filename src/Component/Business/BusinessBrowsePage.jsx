import React, { useEffect, useState, useMemo } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { FiPlus } from 'react-icons/fi';
import UnifiedNavbar from '../UnifiedNavbar';
import Footer from '../Footer';
import BusinessHero from './BusinessHero';
import BusinessCategoryGrid from './BusinessCategoryGrid';
import BusinessListingsGrid from './BusinessListingsGrid';
import SponsoredPostForm from '../sponsored/SponsoredPostForm';
import BrowseBottomPostCta from '../shared/BrowseBottomPostCta';
import StandardListingFilters from '../shared/StandardListingFilters';
import { BrowseFilterLayout } from '../shared/BrowseFilterLayout';
import useAuthRedirect from '../../hooks/useAuthRedirect';
import {
  applyBusinessFilters,
  getCategoryLabel,
  hasActiveFilters,
} from './businessFilterUtils';
import { buildApiCategoryLookup } from './businessCategoryMap';
import { getAllBusinesses, getBusinessCategories } from '../../api/business';
import { splitListingsByPromotion } from '../../utils/listingPromotionSort';

const BusinessBrowsePage = ({ initialCategoryId = null }) => {
  const navigate = useNavigate();
  const [searchParams, setSearchParams] = useSearchParams();
  const { requireAuth, isAuthenticated } = useAuthRedirect();
  const [businesses, setBusinesses] = useState([]);
  const [loading, setLoading] = useState(true);
  const [apiCategoryLookup, setApiCategoryLookup] = useState({ slugToId: {}, idToLocal: {} });
  const [selectedCategoryId, setSelectedCategoryId] = useState(initialCategoryId);
  const [filters, setFilters] = useState(
    initialCategoryId ? { category: initialCategoryId } : {}
  );
  const [pendingFilters, setPendingFilters] = useState(
    initialCategoryId ? { category: initialCategoryId } : {}
  );
  const [showPostForm, setShowPostForm] = useState(false);
  const [showFilters, setShowFilters] = useState(true);
  const [topSearch, setTopSearch] = useState('');

  const isCategoryView = Boolean(selectedCategoryId);
  const categoryLabel = selectedCategoryId ? getCategoryLabel(selectedCategoryId) : null;
  const postTypeFilterActive = !!(filters.featured || filters.promoted || filters.sponsored);

  useEffect(() => {
    setSelectedCategoryId(initialCategoryId);
    if (initialCategoryId) {
      setFilters((prev) => ({ ...prev, category: initialCategoryId }));
      setPendingFilters((prev) => ({ ...prev, category: initialCategoryId }));
    }
  }, [initialCategoryId]);

  useEffect(() => {
    if (searchParams.get('postForm') === 'true' && isAuthenticated) {
      setShowPostForm(true);
    }
  }, [searchParams, isAuthenticated]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        const [businessRes, categoryRes] = await Promise.all([
          getAllBusinesses({ limit: 200 }),
          getBusinessCategories().catch(() => null),
        ]);

        const items = businessRes.data?.items || businessRes.data || [];
        setBusinesses(Array.isArray(items) ? items : []);

        const categoryItems = categoryRes?.data?.items || categoryRes?.data || [];
        const businessApiCategories = Array.isArray(categoryItems)
          ? categoryItems.filter((c) => (c.category_id ?? c.id) >= 51)
          : [];
        setApiCategoryLookup(buildApiCategoryLookup(businessApiCategories));
      } catch (error) {
        console.error('Error fetching businesses:', error);
        setBusinesses([]);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  const activeFilterSet = useMemo(() => {
    const merged = { ...filters };
    if (selectedCategoryId) merged.category = selectedCategoryId;
    return merged;
  }, [filters, selectedCategoryId]);

  const filteredBusinesses = useMemo(
    () => applyBusinessFilters(businesses, activeFilterSet, apiCategoryLookup),
    [businesses, activeFilterSet, apiCategoryLookup]
  );

  const { featured, sponsored, regular } = useMemo(
    () => splitListingsByPromotion(filteredBusinesses),
    [filteredBusinesses]
  );

  const handleFilterChange = (filterName, value) => {
    setPendingFilters((prev) => {
      const next = { ...prev, [filterName]: value };
      if (typeof value === 'boolean' && !value) delete next[filterName];
      if ((typeof value === 'string' || typeof value === 'number') && value === '') delete next[filterName];
      if (filterName === 'category' && !value) delete next.category;
      return next;
    });
  };

  const applyFilters = () => {
    const next = { ...pendingFilters };
    if (isCategoryView) next.category = selectedCategoryId;
    setFilters(next);
    if (next.category && next.category !== selectedCategoryId) {
      navigate(`/business/category/${next.category}`);
    }
  };

  const clearFilters = () => {
    if (isCategoryView) {
      navigate('/business');
      return;
    }
    setFilters({});
    setPendingFilters({});
    setTopSearch('');
  };

  const clearExtraFilters = () => {
    const category = selectedCategoryId;
    setFilters(category ? { category } : {});
    setPendingFilters(category ? { category } : {});
    setTopSearch('');
  };

  const applyTopSearch = () => {
    const next = { ...pendingFilters, search: topSearch };
    if (!topSearch.trim()) delete next.search;
    if (isCategoryView) next.category = selectedCategoryId;
    setPendingFilters(next);
    setFilters(next);
  };

  const handleCategorySelect = (categoryId) => {
    navigate(`/business/category/${categoryId}`);
  };

  const handleBusinessClick = (businessId) => {
    navigate(`/business/${businessId}`);
  };

  const handlePostClick = () => {
    const returnPath = selectedCategoryId
      ? `/business/category/${selectedCategoryId}?postForm=true`
      : '/business?postForm=true';
    if (requireAuth(returnPath, 'You must be logged in to list your business.')) {
      setShowPostForm(true);
      setSearchParams({ postForm: 'true' });
    }
  };

  const handleClosePostForm = () => {
    setShowPostForm(false);
    setSearchParams({}, { replace: true });
  };

  const showListings = isCategoryView || hasActiveFilters(filters);

  const filterFields = (
    <StandardListingFilters
      filters={pendingFilters}
      onFilterChange={handleFilterChange}
      onApply={applyFilters}
      onClear={isCategoryView ? clearExtraFilters : clearFilters}
      theme="purple"
      showPrice={false}
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

  const templatesHref = selectedCategoryId
    ? `/business/templates?category=${selectedCategoryId}&name=${encodeURIComponent(categoryLabel || '')}`
    : '/business/templates';

  const renderListings = () => {
    if (postTypeFilterActive) {
      return (
        <BusinessListingsGrid
          businesses={filteredBusinesses}
          loading={loading}
          onBusinessClick={handleBusinessClick}
        />
      );
    }

    return (
      <>
        {featured.length > 0 && (
          <section className="mb-6">
            <h2 className="text-sm sm:text-base font-bold text-gray-900 mb-3">Featured</h2>
            <BusinessListingsGrid
              businesses={featured}
              loading={false}
              onBusinessClick={handleBusinessClick}
            />
          </section>
        )}
        <BusinessListingsGrid
          businesses={regular}
          loading={loading}
          onBusinessClick={handleBusinessClick}
        />
        {sponsored.length > 0 && (
          <section className="mt-8">
            <h2 className="text-sm sm:text-base font-bold text-gray-900 mb-3">Sponsored</h2>
            <BusinessListingsGrid
              businesses={sponsored}
              loading={false}
              onBusinessClick={handleBusinessClick}
            />
          </section>
        )}
      </>
    );
  };

  return (
    <div className="min-h-screen bg-gray-50 overflow-x-hidden">
      <UnifiedNavbar showBackButton backHref={isCategoryView ? '/business' : '/'} />

      <BusinessHero
        categoryLabel={isCategoryView ? categoryLabel : null}
        searchValue={topSearch}
        onSearchChange={(e) => setTopSearch(e.target.value)}
        onSearchSubmit={applyTopSearch}
        templatesHref={templatesHref}
        calculatorsHref="/business/calculators"
      />

      <div className="page-container py-4 sm:py-6">
        {!isCategoryView && (
          <div className="mb-4">
            <BusinessCategoryGrid
              businesses={businesses}
              onSelectCategory={handleCategorySelect}
              apiCategoryLookup={apiCategoryLookup}
            />
          </div>
        )}

        <BrowseFilterLayout
          open={showFilters}
          onOpenChange={setShowFilters}
          onApply={applyFilters}
          onClear={isCategoryView ? clearExtraFilters : clearFilters}
          theme="purple"
          homeHref="/business"
          filterFields={filterFields}
          activeCount={activeFilterCount}
          toolbarLeft={
            <p className="text-sm text-gray-600">
              {loading
                ? 'Loading…'
                : showListings
                  ? `${filteredBusinesses.length} listings`
                  : 'Pick a category below'}
            </p>
          }
        >
          {showListings && (
            <>
              {hasActiveFilters(filters) && !loading && filteredBusinesses.length === 0 && (
                <div className="mb-4">
                  <button
                    type="button"
                    onClick={clearExtraFilters}
                    className="text-xs font-medium text-purple-600 hover:text-purple-800"
                  >
                    Clear and show all
                  </button>
                </div>
              )}

              {!loading && filteredBusinesses.length === 0 ? (
                <div className="text-center py-10 bg-white rounded-xl border border-gray-200">
                  <h3 className="text-base font-semibold text-gray-900 mb-2">No businesses found</h3>
                  <p className="text-sm text-gray-600 mb-4">Try changing your selection</p>
                  <button
                    type="button"
                    onClick={clearExtraFilters}
                    className="px-4 py-2 text-sm bg-purple-700 text-white rounded-lg hover:bg-purple-800"
                  >
                    Reset
                  </button>
                </div>
              ) : (
                renderListings()
              )}
            </>
          )}

          {!showListings && featured.length > 0 && (
            <section className="mt-2">
              <h2 className="text-sm sm:text-base font-bold text-gray-900 mb-3">Featured</h2>
              <BusinessListingsGrid
                businesses={featured}
                loading={loading}
                onBusinessClick={handleBusinessClick}
              />
            </section>
          )}

          <BrowseBottomPostCta
            title={isCategoryView ? `List your ${categoryLabel} business` : 'List your business'}
            description="Create a business listing and reach customers worldwide."
            buttonLabel="Start selling"
            onPostClick={handlePostClick}
            theme="purple"
          />
        </BrowseFilterLayout>
      </div>

      <Footer />

      {showPostForm && (
        <div className="fixed inset-0 z-50 overflow-y-auto bg-white">
          <SponsoredPostForm
            defaultAdvertType="service"
            formTitle="List Your Business"
            formSubtitle={
              isCategoryView
                ? `List your ${categoryLabel} business — Free, Paid, Featured or Sponsored`
                : 'List your business — choose Free, Paid, Featured or Sponsored for visibility'
            }
            onCancel={handleClosePostForm}
            onSuccess={handleClosePostForm}
          />
        </div>
      )}
    </div>
  );
};

export default BusinessBrowsePage;
