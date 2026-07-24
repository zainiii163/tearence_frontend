import React, { useState, useEffect, useCallback, useMemo } from 'react';
import { AnimatePresence } from 'framer-motion';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { FiPlus } from 'react-icons/fi';
import { useAuthRedirect } from '../../hooks/useAuthRedirect';
import propertyApi from '../../services/propertyApi';
import UnifiedNavbar from '../UnifiedNavbar';
import Footer from '../Footer';
import PropertyHero from './PropertyHero';
import PropertyWorldMap from './PropertyWorldMap';
import PropertyCategoryGrid, { PROPERTY_TYPE_LABELS } from './PropertyCategoryGrid';
import PropertyListingsGrid from './PropertyListingsGrid';
import PropertyPostForm from './PropertyPostForm';
import BrowseBottomPostCta from '../shared/BrowseBottomPostCta';
import BrowseCategoryTemplates from '../shared/BrowseCategoryTemplates';
import StandardListingFilters from '../shared/StandardListingFilters';
import { BrowseFilterLayout } from '../shared/BrowseFilterLayout';
import { splitListingsByPromotion } from '../../utils/listingPromotionSort';
import ErrorBoundary from '../ErrorBoundary/ErrorBoundary';
import '../../styles/property.css';

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
    result = result.filter(
      (ad) =>
        !ad.featured &&
        !ad.is_featured &&
        !ad.is_promoted &&
        !ad.promoted &&
        !ad.is_sponsored &&
        !ad.sponsored
    );
  }

  if (activeFilters.city) {
    const q = activeFilters.city.toLowerCase();
    result = result.filter((ad) =>
      [ad.city, ad.location, ad.address].some((v) => String(v || '').toLowerCase().includes(q))
    );
  }

  if (activeFilters.country) {
    const q = activeFilters.country.toLowerCase();
    result = result.filter((ad) => String(ad.country || '').toLowerCase().includes(q));
  }

  return result;
};

const PropertyBrowsePage = ({ initialCategoryId = null }) => {
  const navigate = useNavigate();
  const { requireAuth, isAuthenticated } = useAuthRedirect();
  const [searchParams, setSearchParams] = useSearchParams();
  const [selectedCategoryId, setSelectedCategoryId] = useState(initialCategoryId);
  const [filters, setFilters] = useState({});
  const [pendingFilters, setPendingFilters] = useState({});
  const [showPostForm, setShowPostForm] = useState(false);
  const [showFilters, setShowFilters] = useState(true);
  const [properties, setProperties] = useState([]);
  const [loading, setLoading] = useState(true);
  const [topSearch, setTopSearch] = useState('');

  const isCategoryView = Boolean(selectedCategoryId);
  const categoryName =
    PROPERTY_TYPE_LABELS[selectedCategoryId] ||
    (selectedCategoryId
      ? String(selectedCategoryId).replace(/-/g, ' ').replace(/\b\w/g, (c) => c.toUpperCase())
      : '');
  const postTypeFilterActive = !!(filters.featured || filters.promoted || filters.sponsored);

  useEffect(() => {
    setSelectedCategoryId(initialCategoryId);
  }, [initialCategoryId]);

  const handlePostClick = () => {
    const path = selectedCategoryId
      ? `/property/category/${selectedCategoryId}?postForm=true`
      : '/property?postForm=true';
    if (requireAuth(path, 'You must be logged in to list your property.')) {
      setShowPostForm(true);
      setSearchParams({ postForm: 'true' });
    }
  };

  useEffect(() => {
    if (searchParams.get('postForm') === 'true' && isAuthenticated) {
      setShowPostForm(true);
    }
  }, [searchParams, isAuthenticated]);

  const fetchProperties = useCallback(async () => {
    setLoading(true);
    try {
      const params = propertyApi.buildSearchParams({
        search: filters.search || '',
        propertyTypes: selectedCategoryId ? [selectedCategoryId] : [],
        minPrice: filters.priceMin || undefined,
        maxPrice: filters.priceMax || undefined,
        location: filters.city || filters.country || filters.location || undefined,
        bedrooms: filters.bedrooms || undefined,
        bathrooms: filters.bathrooms || undefined,
        category: filters.purpose || undefined,
        sort: 'newest',
        perPage: selectedCategoryId ? 50 : 48,
        page: 1,
      });

      const response = await propertyApi.getProperties(params);
      const list = Array.isArray(response?.data)
        ? response.data
        : Array.isArray(response?.data?.data)
          ? response.data.data
          : Array.isArray(response?.items)
            ? response.items
            : [];
      setProperties(applyClientFilters(list, filters));
    } catch (error) {
      console.error('Error fetching properties:', error);
      setProperties([]);
    } finally {
      setLoading(false);
    }
  }, [selectedCategoryId, filters]);

  useEffect(() => {
    fetchProperties();
  }, [fetchProperties]);

  const { featured, sponsored, regular } = useMemo(
    () => splitListingsByPromotion(properties),
    [properties]
  );

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
    if (isCategoryView) {
      navigate('/property');
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
    fetchProperties();
  };

  const handleCategorySelect = (categoryId) => {
    navigate(`/property/category/${categoryId}`);
  };

  const handleLocationSelect = (region) => {
    const name =
      typeof region === 'string' ? region : region?.name || region?.id || '';
    if (!name) return;
    const next = { ...pendingFilters, location: name, country: name };
    setPendingFilters(next);
    setFilters(next);
  };

  const propertyExtraFields = (
    <div className="border-b border-gray-200 py-3 space-y-3">
      <p className="text-[15px] font-medium text-gray-900 pl-0.5">Property details</p>
      <div className="pl-5 pr-0.5 space-y-2">
        <label className="block text-xs font-medium text-gray-500">Purpose</label>
        <select
          value={pendingFilters.purpose || ''}
          onChange={(e) => handleFilterChange('purpose', e.target.value)}
          className="w-full px-3 py-2 text-sm border border-gray-300 rounded-lg bg-white focus:ring-2 focus:ring-[#b8895a]"
        >
          <option value="">Any</option>
          <option value="buy">Buy</option>
          <option value="rent">Rent</option>
          <option value="lease">Lease</option>
          <option value="invest">Invest</option>
        </select>
        <div className="grid grid-cols-2 gap-2">
          <div>
            <label className="block text-xs font-medium text-gray-500 mb-1">Bedrooms</label>
            <select
              value={pendingFilters.bedrooms || ''}
              onChange={(e) => handleFilterChange('bedrooms', e.target.value)}
              className="w-full px-3 py-2 text-sm border border-gray-300 rounded-lg bg-white focus:ring-2 focus:ring-[#b8895a]"
            >
              <option value="">Any</option>
              {[1, 2, 3, 4, 5].map((n) => (
                <option key={n} value={n}>
                  {n}+
                </option>
              ))}
            </select>
          </div>
          <div>
            <label className="block text-xs font-medium text-gray-500 mb-1">Bathrooms</label>
            <select
              value={pendingFilters.bathrooms || ''}
              onChange={(e) => handleFilterChange('bathrooms', e.target.value)}
              className="w-full px-3 py-2 text-sm border border-gray-300 rounded-lg bg-white focus:ring-2 focus:ring-[#b8895a]"
            >
              <option value="">Any</option>
              {[1, 2, 3, 4].map((n) => (
                <option key={n} value={n}>
                  {n}+
                </option>
              ))}
            </select>
          </div>
        </div>
      </div>
    </div>
  );

  const filterFields = (
    <StandardListingFilters
      filters={pendingFilters}
      onFilterChange={handleFilterChange}
      onApply={applyFilters}
      onClear={isCategoryView ? clearExtraFilters : clearFilters}
      theme="slate"
      searchPlaceholder="Search by property name…"
      asPanel={false}
      showActions={false}
      showTitle={false}
      extraFields={propertyExtraFields}
    />
  );

  const activeFilterCount = Object.entries(filters).filter(([, v]) => {
    if (typeof v === 'boolean') return v;
    return v !== '' && v != null;
  }).length;

  const templatesHref = selectedCategoryId
    ? `/property/templates?category=${selectedCategoryId}&name=${encodeURIComponent(categoryName)}`
    : '/property/templates';

  const renderGrid = (items, isLoading = false) => (
    <PropertyListingsGrid properties={items} loading={isLoading} />
  );

  return (
    <ErrorBoundary>
      <div className="property-marketplace overflow-x-hidden">
        <UnifiedNavbar showBackButton backHref={isCategoryView ? '/property' : '/'} />

        <PropertyHero
          categoryLabel={isCategoryView ? categoryName : null}
          searchValue={topSearch}
          onSearchChange={(e) => setTopSearch(e.target.value)}
          onSearchSubmit={applyTopSearch}
          templatesHref={templatesHref}
          calculatorsHref="/property/calculators"
        />

        <div className="page-container py-6 sm:py-8">
          {!isCategoryView && (
            <PropertyCategoryGrid
              selectedCategoryId={selectedCategoryId}
              onSelectCategory={handleCategorySelect}
            />
          )}

          <div className="mb-4">
            <p className="prop-label text-[var(--prop-copper)] mb-1">Listings</p>
            <h2 className="prop-display text-2xl sm:text-3xl text-[var(--prop-ink)]">
              {isCategoryView ? categoryName : 'Available properties'}
            </h2>
          </div>

          <BrowseFilterLayout
            open={showFilters}
            onOpenChange={setShowFilters}
            onApply={applyFilters}
            onClear={isCategoryView ? clearExtraFilters : clearFilters}
            theme="slate"
            homeHref="/property"
            filterFields={filterFields}
            activeCount={activeFilterCount}
            toolbarLeft={
              <p className="text-sm text-[var(--prop-ink)]/60">
                {loading ? 'Loading…' : `${properties.length} listings`}
              </p>
            }
            toolbarRight={
              <button
                type="button"
                onClick={handlePostClick}
                className="inline-flex items-center gap-1.5 px-4 py-2 text-xs sm:text-sm font-semibold text-white bg-[var(--prop-ink)] hover:bg-[var(--prop-ink-soft)] self-start sm:self-auto transition-colors"
              >
                <FiPlus className="h-3.5 w-3.5" />
                List property
              </button>
            }
          >
            {hasActiveFilters(filters) && !loading && properties.length === 0 && (
              <div className="mb-4">
                <button
                  type="button"
                  onClick={clearExtraFilters}
                  className="text-xs font-medium text-[var(--prop-copper-deep)] hover:underline"
                >
                  Clear filters and show all
                </button>
              </div>
            )}

            {!loading && properties.length === 0 ? (
              <div className="text-center py-12 border border-[var(--prop-ink)]/10 bg-white/70">
                <h3 className="prop-display text-2xl text-[var(--prop-ink)] mb-2">No properties found</h3>
                <p className="text-sm text-[var(--prop-ink)]/55 mb-4">Try changing filters</p>
                <button
                  type="button"
                  onClick={clearExtraFilters}
                  className="px-5 py-2.5 text-sm font-semibold bg-[var(--prop-ink)] text-white hover:bg-[var(--prop-ink-soft)]"
                >
                  Reset
                </button>
              </div>
            ) : (
              <>
                {postTypeFilterActive ? (
                  renderGrid(properties, loading)
                ) : (
                  <>
                    {featured.length > 0 && (
                      <section className="mb-8">
                        <p className="prop-label text-[var(--prop-copper)] mb-1">Spotlight</p>
                        <h3 className="prop-display text-xl sm:text-2xl text-[var(--prop-ink)] mb-4">
                          Featured
                        </h3>
                        {renderGrid(featured)}
                      </section>
                    )}
                    {renderGrid(regular, loading)}
                    {sponsored.length > 0 && (
                      <section className="mt-10">
                        <p className="prop-label text-[var(--prop-copper)] mb-1">Partners</p>
                        <h3 className="prop-display text-xl sm:text-2xl text-[var(--prop-ink)] mb-4">
                          Sponsored
                        </h3>
                        {renderGrid(sponsored)}
                      </section>
                    )}
                  </>
                )}
              </>
            )}

            <BrowseCategoryTemplates
              vertical="property"
              categoryKey={selectedCategoryId || ''}
              categoryName={categoryName || ''}
              theme="slate"
              onBrowseClick={() => navigate(templatesHref)}
              browseLabel="Browse templates"
              sellLabel="Sell a template"
            />

            <BrowseBottomPostCta
              title="List your property"
              description="Reach buyers and renters worldwide — Free, Featured or Sponsored visibility."
              buttonLabel="List your property"
              onPostClick={handlePostClick}
              theme="slate"
            />

            {!isCategoryView && (
              <div className="property-map-frame mt-8 sm:mt-10">
                <PropertyWorldMap onLocationSelect={handleLocationSelect} />
              </div>
            )}
          </BrowseFilterLayout>
        </div>

        <AnimatePresence>
          {showPostForm && (
            <PropertyPostForm
              onClose={handleClosePostForm}
              onSubmit={() => {
                handleClosePostForm();
              }}
            />
          )}
        </AnimatePresence>

        <Footer />
      </div>
    </ErrorBoundary>
  );
};

export default PropertyBrowsePage;
