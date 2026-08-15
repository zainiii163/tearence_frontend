import React, { useState, useEffect, useCallback, useMemo } from 'react';
import { AnimatePresence } from 'framer-motion';
import { useNavigate, useSearchParams, useParams } from 'react-router-dom';
import { useSelector } from 'react-redux';
import { FiPlus } from 'react-icons/fi';
import toast from 'react-hot-toast';
import { useAuthRedirect } from '../../hooks/useAuthRedirect';
import propertyApi from '../../services/propertyApi';
import PropertyHero from './PropertyHero';
import BrowsePageBackBar from '../shared/BrowsePageBackBar';
import PropertyWorldMap from './PropertyWorldMap';
import PropertyRegionBrowse from './PropertyRegionBrowse';
import PropertyListingsGrid from './PropertyListingsGrid';
import PropertyPostForm from './PropertyPostForm';
import StandardListingFilters from '../shared/StandardListingFilters';
import CategoryPageShell from '../shared/CategoryPageShell';
import CompactPremiumReel from '../shared/CompactPremiumReel';
import { getCategoryTheme } from '../../constants/categoryThemes';
import { splitListingsByPromotion } from '../../utils/listingPromotionSort';
import ErrorBoundary from '../ErrorBoundary/ErrorBoundary';
import { isBusinessAccount } from '../../utils/accountType';
import {
  getContinentById,
  countryToSlug,
  findCountryBySlug,
} from '../../data/propertyContinents';
import { PROPERTY_DEMO_LISTINGS } from '../../data/propertyDemo';
import '../../styles/property.css';

const FALLBACK_PROPERTY_TYPES = [
  { id: 'residential', name: 'Residential' },
  { id: 'commercial', name: 'Commercial' },
  { id: 'industrial', name: 'Industrial' },
  { id: 'land', name: 'Land & Plots' },
  { id: 'agricultural', name: 'Agricultural' },
  { id: 'luxury', name: 'Luxury' },
  { id: 'rental', name: 'Short-term' },
  { id: 'investment', name: 'Investment' },
];

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

  if (activeFilters.propertyType) {
    const q = String(activeFilters.propertyType).toLowerCase();
    result = result.filter((ad) =>
      String(ad.property_type || ad.type || '').toLowerCase().includes(q)
    );
  }

  return result;
};

const PropertyBrowsePage = ({
  initialContinentId = null,
  initialCountrySlug = null,
  initialCategoryId = null,
}) => {
  const navigate = useNavigate();
  const { requireAuth, isAuthenticated } = useAuthRedirect();
  const { userDetail } = useSelector((store) => store.auth);
  const [searchParams, setSearchParams] = useSearchParams();
  const params = useParams();

  const typeCategoryId =
    initialCategoryId ||
    (params.categoryId && !params.continentId && !params.countrySlug
      ? params.categoryId
      : null);

  const continentId =
    initialContinentId ||
    params.continentId ||
    searchParams.get('continent') ||
    null;
  const countrySlug =
    initialCountrySlug ||
    params.countrySlug ||
    searchParams.get('country') ||
    null;

  const countryMatch = countrySlug ? findCountryBySlug(countrySlug) : null;
  const selectedCountry = countryMatch?.country || null;
  const selectedContinentId =
    continentId || countryMatch?.continent?.id || null;
  const selectedContinent = getContinentById(selectedContinentId);

  const [filters, setFilters] = useState(() =>
    typeCategoryId ? { propertyType: typeCategoryId } : {}
  );
  const [pendingFilters, setPendingFilters] = useState(() =>
    typeCategoryId ? { propertyType: typeCategoryId } : {}
  );
  const [showPostForm, setShowPostForm] = useState(false);
  // Desktop filters always visible (forceOpen); mobile drawer starts closed
  const [showFilters, setShowFilters] = useState(false);
  const [properties, setProperties] = useState([]);
  const [localFeatured, setLocalFeatured] = useState([]);
  const [userCountry, setUserCountry] = useState(null);
  const [loading, setLoading] = useState(true);
  const [topSearch, setTopSearch] = useState('');

  const isCountryView = Boolean(selectedCountry);
  const isRegionView = Boolean(selectedContinentId) && !isCountryView;
  const isTypeCategoryView = Boolean(typeCategoryId) && !isCountryView && !isRegionView;
  const showMapAndRegions = !isTypeCategoryView;

  const typeLabel = typeCategoryId
    ? FALLBACK_PROPERTY_TYPES.find((t) => t.id === typeCategoryId)?.name ||
      String(typeCategoryId).replace(/-/g, ' ').replace(/\b\w/g, (c) => c.toUpperCase())
    : null;

  const heroLabel = isCountryView
    ? `Property ${selectedCountry}`
    : isRegionView
      ? `Property ${selectedContinent?.name || ''}`.trim()
      : isTypeCategoryView
        ? `Property ${typeLabel}`
        : 'Property';

  const postTypeFilterActive = !!(filters.featured || filters.promoted || filters.sponsored);

  const openPostForm = useCallback(() => {
    setShowPostForm(true);
    setSearchParams((prev) => {
      const next = new URLSearchParams(prev);
      next.set('postForm', 'true');
      return next;
    });
  }, [setSearchParams]);

  const handlePostClick = () => {
    const path = isCountryView
      ? `/property/country/${countryToSlug(selectedCountry)}?postForm=true`
      : selectedContinentId
        ? `/property/region/${selectedContinentId}?postForm=true`
        : typeCategoryId
          ? `/property/category/${typeCategoryId}?postForm=true`
          : '/property?postForm=true';

    if (!requireAuth(path, 'You must be logged in to list your property.')) {
      return;
    }

    // Business accounts post; basic users browse/buy
    if (!isBusinessAccount(userDetail)) {
      toast.error('Property listings are for business accounts. Sign in as Business to post.');
      navigate('/Login?type=business');
      return;
    }

    openPostForm();
  };

  useEffect(() => {
    if (searchParams.get('postForm') === 'true' && isAuthenticated) {
      if (isBusinessAccount(userDetail)) {
        setShowPostForm(true);
      } else if (userDetail || localStorage.getItem('wwa_login_account_type')) {
        toast.error('Property listings are for business accounts.');
        setSearchParams((prev) => {
          const next = new URLSearchParams(prev);
          next.delete('postForm');
          return next;
        });
      }
    }
  }, [searchParams, isAuthenticated, userDetail, setSearchParams]);

  useEffect(() => {
    let cancelled = false;
    (async () => {
      let country = null;
      try {
        const geo = await propertyApi.getGeoLocation();
        if (!cancelled) {
          country = geo?.country || geo?.country_name || null;
          setUserCountry(country);
        }
      } catch (err) {
        console.warn('Property geo unavailable:', err);
      }

      try {
        const featuredRes = await propertyApi.getFeaturedProperties({
          country: country || undefined,
          local: true,
          per_page: 12,
        });
        if (cancelled) return;
        const list = Array.isArray(featuredRes?.data)
          ? featuredRes.data
          : Array.isArray(featuredRes?.data?.data)
            ? featuredRes.data.data
            : [];
        setLocalFeatured(list);
      } catch (err) {
        console.warn('Local featured unavailable:', err);
        if (!cancelled) setLocalFeatured([]);
      }
    })();
    return () => {
      cancelled = true;
    };
  }, []);

  const fetchProperties = useCallback(async () => {
    setLoading(true);
    try {
      const params = propertyApi.buildSearchParams({
        search: filters.search || '',
        propertyTypes: filters.propertyType
          ? [filters.propertyType]
          : typeCategoryId
            ? [typeCategoryId]
            : [],
        minPrice: filters.priceMin || undefined,
        maxPrice: filters.priceMax || undefined,
        country: selectedCountry || filters.country || undefined,
        location: filters.city || undefined,
        continent: !selectedCountry && selectedContinentId ? selectedContinentId : undefined,
        bedrooms: filters.bedrooms || undefined,
        bathrooms: filters.bathrooms || undefined,
        category: filters.purpose || undefined,
        sort: 'newest',
        perPage: selectedCountry || selectedContinentId || typeCategoryId ? 50 : 48,
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
      const filtered = applyClientFilters(list, filters);
      setProperties(filtered.length ? filtered : applyClientFilters(PROPERTY_DEMO_LISTINGS, filters));
    } catch (error) {
      console.error('Error fetching properties:', error);
      setProperties(applyClientFilters(PROPERTY_DEMO_LISTINGS, filters));
    } finally {
      setLoading(false);
    }
  }, [selectedCountry, selectedContinentId, typeCategoryId, filters]);

  useEffect(() => {
    fetchProperties();
  }, [fetchProperties]);

  const { featured, sponsored, regular } = useMemo(
    () => splitListingsByPromotion(properties),
    [properties]
  );

  const displayFeatured = useMemo(() => {
    if (isCountryView || isRegionView) return featured;
    if (localFeatured.length > 0) return localFeatured;
    return featured;
  }, [isCountryView, isRegionView, featured, localFeatured]);

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
    if (isCountryView || isRegionView || isTypeCategoryView) {
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
    setSearchParams((prev) => {
      const next = new URLSearchParams(prev);
      next.delete('postForm');
      return next;
    });
    fetchProperties();
  };

  const handlePostSuccess = () => {
    toast.success('Property listed successfully!');
    handleClosePostForm();
  };

  const handleSelectContinent = (region) => {
    const id = region?.id || region;
    if (!id) return;
    navigate(`/property/region/${id}`);
  };

  const handleSelectCountry = (country) => {
    if (!country) return;
    navigate(`/property/country/${countryToSlug(country)}`);
  };

  const handleBackToRegions = () => navigate('/property');

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
          <option value="sell">Sell</option>
          <option value="rent">Rent</option>
          <option value="lease">Lease</option>
          <option value="invest">Invest</option>
        </select>

        <label className="block text-xs font-medium text-gray-500">Property type</label>
        <select
          value={pendingFilters.propertyType || ''}
          onChange={(e) => handleFilterChange('propertyType', e.target.value)}
          className="w-full px-3 py-2 text-sm border border-gray-300 rounded-lg bg-white focus:ring-2 focus:ring-[#b8895a]"
        >
          <option value="">Any</option>
          {FALLBACK_PROPERTY_TYPES.map((t) => (
            <option key={t.id} value={t.id}>
              {t.name}
            </option>
          ))}
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
      onClear={
        isCountryView || isRegionView || isTypeCategoryView
          ? clearExtraFilters
          : clearFilters
      }
      theme={getCategoryTheme('property').filterTheme}
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

  const listingsTitle = isCountryView
    ? `Properties in ${selectedCountry}`
    : isRegionView
      ? `Properties in ${selectedContinent?.name || 'region'}`
      : isTypeCategoryView
        ? typeLabel
        : 'Available properties';

  const backHref = isCountryView
    ? selectedContinentId
      ? `/property/region/${selectedContinentId}`
      : '/property'
    : isRegionView || isTypeCategoryView
      ? '/property'
      : '/';

  const renderGrid = (items, isLoading = false, options = {}) => (
    <PropertyListingsGrid
      properties={items}
      loading={isLoading}
      compact={Boolean(options.compact)}
      singleRow={Boolean(options.singleRow)}
    />
  );

  const isGlobalView = !isCountryView && !isRegionView && !isTypeCategoryView;
  const featuredRow = displayFeatured.slice(0, 5);
  const theme = getCategoryTheme('property');

  return (
    <ErrorBoundary>
      <CategoryPageShell
        categoryId="property"
        backHref={backHref}
        className="property-marketplace"
        contentClassName="page-container py-2 sm:py-3"
        hero={
          <PropertyHero
            categoryLabel={heroLabel}
            searchValue={topSearch}
            onSearchChange={(e) => setTopSearch(e.target.value)}
            onSearchSubmit={applyTopSearch}
          />
        }
        backBar={
          <BrowsePageBackBar
            to={backHref}
            label={
              isCountryView || isRegionView || isTypeCategoryView
                ? 'Back to Properties'
                : 'Back Home'
            }
          />
        }
        categoryGrid={
          showMapAndRegions ? (
            <PropertyWorldMap
              onRegionSelect={handleSelectContinent}
              selectedContinentId={selectedContinentId}
              selectedCountry={selectedCountry}
              compact
            >
              {isRegionView || isCountryView ? (
                <PropertyRegionBrowse
                  selectedContinentId={selectedContinentId}
                  selectedCountry={selectedCountry}
                  onSelectCountry={handleSelectCountry}
                  onBack={handleBackToRegions}
                  embedded
                />
              ) : null}
            </PropertyWorldMap>
          ) : null
        }
        premiumReel={
          featuredRow.length > 0 ? (
            <CompactPremiumReel
              items={featuredRow}
              title="Featured properties"
              getHref={(item) => `/property/${item.id || item.slug}`}
              accentClass={theme.accentText}
              borderAccent="hover:border-violet-300"
            />
          ) : null
        }
        beforeFilters={
          <>
            {isCountryView && (
            <div className="mb-3">
              <button
                type="button"
                onClick={() =>
                  navigate(
                    selectedContinentId
                      ? `/property/region/${selectedContinentId}`
                      : '/property'
                  )
                }
                className="text-xs font-semibold text-[var(--prop-copper-deep)] hover:underline"
              >
                ← Back to {selectedContinent?.name || 'regions'}
              </button>
            </div>
            )}

            <div className="mb-1.5 flex flex-wrap items-center justify-between gap-3">
              <h2 className="prop-display text-base sm:text-lg text-[var(--prop-ink)] leading-tight">
                {isGlobalView ? 'Latest properties' : listingsTitle}
              </h2>
              <button
                type="button"
                onClick={handlePostClick}
                className="inline-flex items-center gap-2 rounded-lg bg-[var(--prop-ink)] px-3.5 py-2 text-sm font-semibold text-white hover:bg-[var(--prop-ink-soft)]"
              >
                <FiPlus className="h-4 w-4" />
                List your property
              </button>
            </div>
          </>
        }
        filterLayoutProps={{
          open: showFilters,
          onOpenChange: setShowFilters,
          hideToggle: true,
          forceOpen: true,
          onApply: applyFilters,
          onClear:
            isCountryView || isRegionView || isTypeCategoryView
              ? clearExtraFilters
              : clearFilters,
          theme: theme.filterTheme,
          homeHref: theme.route,
          filterFields,
          activeCount: activeFilterCount,
        }}
        bottomCta={{
          buttonLabel: 'List your property',
          onPostClick: handlePostClick,
          theme: theme.ctaTheme || 'slate',
        }}
        afterContent={
          <AnimatePresence>
            {showPostForm && (
              <PropertyPostForm
                onClose={handleClosePostForm}
                onSubmit={handlePostSuccess}
                initialContinentId={selectedContinentId || ''}
                initialCountry={selectedCountry || ''}
              />
            )}
          </AnimatePresence>
        }
      >
            {hasActiveFilters(filters) && !loading && properties.length === 0 && (
              <div className="mb-3">
                <button
                  type="button"
                  onClick={clearExtraFilters}
                  className="text-xs font-medium text-[var(--prop-copper-deep)] hover:underline"
                >
                  Clear and show all
                </button>
              </div>
            )}

            {!loading &&
            ((isGlobalView && featuredRow.length === 0 && properties.length === 0) ||
              (!isGlobalView && properties.length === 0 && displayFeatured.length === 0)) ? (
              <div className="text-center py-10 border border-[var(--prop-ink)]/10 bg-white/70 rounded-xl px-4">
                <h3 className="prop-display text-xl text-[var(--prop-ink)] mb-2">No properties found</h3>
                <p className="text-sm text-[var(--prop-ink)]/55 mb-4 max-w-md mx-auto">
                  Be the first to list — post a property with your business account, or try another region.
                </p>
                <div className="flex flex-wrap items-center justify-center gap-2">
                  <button
                    type="button"
                    onClick={handlePostClick}
                    className="inline-flex items-center gap-2 px-4 py-2 text-sm font-semibold bg-[var(--prop-ink)] text-white hover:bg-[var(--prop-ink-soft)] rounded-lg"
                  >
                    <FiPlus className="h-4 w-4" />
                    List your property
                  </button>
                  <button
                    type="button"
                    onClick={clearExtraFilters}
                    className="px-4 py-2 text-sm font-semibold border border-[var(--prop-ink)]/20 text-[var(--prop-ink)] hover:bg-white rounded-lg"
                  >
                    Reset filters
                  </button>
                </div>
              </div>
            ) : (
              <>
                {/* Featured / trending row */}
                {(featuredRow.length > 0 || loading) && (
                  <section className="mb-4">
                    <div className="flex items-end justify-between gap-2 mb-2">
                      <div>
                        <p className="prop-label text-[var(--prop-copper)] mb-0.5">Featured</p>
                        <h3 className="prop-display text-base sm:text-lg text-[var(--prop-ink)] leading-tight">
                          {isCountryView
                            ? `Featured in ${selectedCountry}`
                            : isRegionView
                              ? `Featured in ${selectedContinent?.name || 'region'}`
                              : userCountry
                                ? `Trending in ${userCountry}`
                                : 'Trending & highly sought-after'}
                        </h3>
                      </div>
                    </div>
                    {renderGrid(featuredRow, loading && featuredRow.length === 0, {
                      compact: true,
                      singleRow: true,
                    })}
                  </section>
                )}

                {/* Full listings — global + region/country/type */}
                {postTypeFilterActive ? (
                  renderGrid(properties, loading, { compact: true })
                ) : (
                  <>
                    <section className={featuredRow.length > 0 ? 'mt-2' : ''}>
                      {isGlobalView && properties.length > 0 && (
                        <div className="mb-2">
                          <p className="prop-label text-[var(--prop-copper)] mb-0.5">Browse</p>
                          <h3 className="prop-display text-base sm:text-lg text-[var(--prop-ink)] leading-tight">
                            All listings
                          </h3>
                        </div>
                      )}
                      {renderGrid(
                        isCountryView || isRegionView || isGlobalView
                          ? regular.length > 0
                            ? regular
                            : properties
                          : regular.filter(
                              (p) =>
                                !localFeatured.some(
                                  (f) => String(f.id) === String(p.id)
                                )
                            ),
                        loading,
                        { compact: true }
                      )}
                    </section>
                    {sponsored.length > 0 && (
                      <section className="mt-6">
                        <p className="prop-label text-[var(--prop-copper)] mb-0.5">Sponsored</p>
                        <h3 className="prop-display text-lg sm:text-xl text-[var(--prop-ink)] mb-2.5">
                          Sponsored
                        </h3>
                        {renderGrid(sponsored, false, { compact: true })}
                      </section>
                    )}
                  </>
                )}
              </>
            )}

      </CategoryPageShell>
    </ErrorBoundary>
  );
};

export default PropertyBrowsePage;
