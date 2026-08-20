import React, { useEffect, useState, useMemo } from 'react';
import { useNavigate, useSearchParams, useParams } from 'react-router-dom';
import BusinessHero from './BusinessHero';
import BusinessCategoryGrid from './BusinessCategoryGrid';
import BusinessListingsGrid from './BusinessListingsGrid';
import BusinessForm from './BusinessForm';
import StandardListingFilters from '../shared/StandardListingFilters';
import CategoryPageShell from '../shared/CategoryPageShell';
import CompactPremiumReel from '../shared/CompactPremiumReel';
import PropertyWorldMap from '../property/PropertyWorldMap';
import PropertyRegionBrowse from '../property/PropertyRegionBrowse';
import { getCategoryTheme } from '../../constants/categoryThemes';
import useAuthRedirect from '../../hooks/useAuthRedirect';
import {
  applyBusinessFilters,
  getCategoryLabel,
  hasActiveFilters,
} from './businessFilterUtils';
import { buildApiCategoryLookup } from './businessCategoryMap';
import { getAllBusinesses, getBusinessCategories } from '../../api/business';
import { splitListingsByPromotion } from '../../utils/listingPromotionSort';
import { mergeBusinessExamples } from '../../data/businessDirectoryExamples';
import {
  countryToSlug,
  findCountryBySlug,
  getContinentById,
} from '../../data/propertyContinents';
import '../../styles/property.css';

const BusinessBrowsePage = ({
  initialCategoryId = null,
  initialContinentId = null,
  initialCountrySlug = null,
}) => {
  const navigate = useNavigate();
  const [searchParams, setSearchParams] = useSearchParams();
  const params = useParams();
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

  const continentId =
    initialContinentId ||
    params.continentId ||
    searchParams.get('continent') ||
    null;
  const countrySlug =
    initialCountrySlug || params.countrySlug || searchParams.get('country') || null;
  const countryMatch = countrySlug ? findCountryBySlug(countrySlug) : null;
  const selectedCountry = countryMatch?.country || null;
  const selectedContinentId = continentId || countryMatch?.continent?.id || null;
  const selectedContinent = getContinentById(selectedContinentId);
  const isCountryView = Boolean(selectedCountry);
  const isRegionView = Boolean(selectedContinentId) && !isCountryView;

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
        const apiParams = { limit: 200 };
        if (selectedCountry) apiParams.country = selectedCountry;
        const [businessRes, categoryRes] = await Promise.all([
          getAllBusinesses(apiParams),
          getBusinessCategories().catch(() => null),
        ]);

        const items = businessRes.data?.items || businessRes.data || [];
        const apiList = Array.isArray(items) ? items : [];
        setBusinesses(mergeBusinessExamples(apiList));

        const categoryItems = categoryRes?.data?.items || categoryRes?.data || [];
        const businessApiCategories = Array.isArray(categoryItems)
          ? categoryItems.filter((c) => (c.category_id ?? c.id) >= 51)
          : [];
        setApiCategoryLookup(buildApiCategoryLookup(businessApiCategories));
      } catch (error) {
        console.error('Error fetching businesses:', error);
        setBusinesses(mergeBusinessExamples([]));
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [selectedCountry]);

  const activeFilterSet = useMemo(() => {
    const merged = { ...filters };
    if (selectedCategoryId) merged.category = selectedCategoryId;
    if (selectedCountry) {
      merged.country = selectedCountry;
      delete merged.continentCountries;
    } else if (selectedContinent) {
      merged.continentCountries = selectedContinent.countries;
      delete merged.country;
    }
    return merged;
  }, [filters, selectedCategoryId, selectedCountry, selectedContinent]);

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
    if (isCountryView || isRegionView) {
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

  const handleSelectContinent = (region) => {
    const id = region?.id || region;
    if (!id) return;
    navigate(`/business/region/${id}`);
  };

  const handleSelectCountry = (country) => {
    if (!country) return;
    navigate(`/business/country/${countryToSlug(country)}`);
  };

  const handleBackToRegions = () => navigate('/business');

  const handleBusinessClick = (businessId) => {
    navigate(`/business/${businessId}`);
  };

  const handlePostClick = () => {
    const returnPath = selectedCategoryId
      ? `/business/category/${selectedCategoryId}?postForm=true`
      : selectedCountry
        ? `/business/country/${countryToSlug(selectedCountry)}?postForm=true`
        : selectedContinentId
          ? `/business/region/${selectedContinentId}?postForm=true`
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

  const showListings = true;
  const theme = getCategoryTheme('business');
  const showMapAndRegions = !isCategoryView;

  const listingsTitle = isCountryView
    ? `Businesses in ${selectedCountry}`
    : isRegionView
      ? `Businesses in ${selectedContinent?.name || 'region'}`
      : isCategoryView
        ? categoryLabel
        : 'Business directory';

  const backHref = isCountryView
    ? selectedContinentId
      ? `/business/region/${selectedContinentId}`
      : '/business'
    : isRegionView || isCategoryView
      ? '/business'
      : '/';

  const filterFields = (
    <StandardListingFilters
      filters={pendingFilters}
      onFilterChange={handleFilterChange}
      onApply={applyFilters}
      onClear={isCategoryView || isRegionView || isCountryView ? clearExtraFilters : clearFilters}
      theme={theme.filterTheme}
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
            <h2 className="text-sm sm:text-base font-bold text-gray-900 mb-3 text-center">Featured</h2>
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
    <CategoryPageShell
      categoryId="business"
      backHref={backHref}
      showBackBar
      backBarTo={backHref}
      backBarLabel={
        isCountryView || isRegionView || isCategoryView ? 'Back to Business' : 'Back Home'
      }
      suggestionsCategoryKey={selectedCategoryId || ''}
      suggestionsCategoryName={isCategoryView ? categoryLabel || '' : ''}
      hero={
        <BusinessHero
          categoryLabel={
            isCountryView
              ? selectedCountry
              : isRegionView
                ? selectedContinent?.name
                : isCategoryView
                  ? categoryLabel
                  : null
          }
          searchValue={topSearch}
          onSearchChange={(e) => setTopSearch(e.target.value)}
          onSearchSubmit={applyTopSearch}
          templatesHref={templatesHref}
          calculatorsHref="/business/calculators"
        />
      }
      categoryGrid={
        showMapAndRegions ? (
          <div className="mb-4 space-y-4">
            <PropertyWorldMap
              mode="geo"
              ariaLabel="Browse businesses by continent"
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
                  showMarketStats={false}
                  subtitle="Select a country — the map opens that area"
                />
              ) : null}
            </PropertyWorldMap>
            {!isRegionView ? (
              <BusinessCategoryGrid
                businesses={businesses}
                onSelectCategory={handleCategorySelect}
                apiCategoryLookup={apiCategoryLookup}
              />
            ) : null}
          </div>
        ) : null
      }
      premiumReel={
        featured.length > 0 ? (
          <CompactPremiumReel
            items={featured}
            title="Featured"
            getHref={(item) => `/business/${item.id || item.slug}`}
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
                      ? `/business/region/${selectedContinentId}`
                      : '/business'
                  )
                }
                className="text-xs font-semibold text-purple-700 hover:underline"
              >
                ← Back to {selectedContinent?.name || 'regions'}
              </button>
            </div>
          )}
          {(isCountryView || isRegionView) && (
            <h2 className="text-base sm:text-lg font-bold text-gray-900 mb-3">{listingsTitle}</h2>
          )}
        </>
      }
      filterLayoutProps={{
        open: showFilters,
        onOpenChange: setShowFilters,
        onApply: applyFilters,
        onClear: isCategoryView || isRegionView || isCountryView ? clearExtraFilters : clearFilters,
        theme: theme.filterTheme,
        homeHref: '/business',
        filterFields,
        activeCount: activeFilterCount,
      }}
      bottomCta={{
        buttonLabel: 'List your business',
        onPostClick: handlePostClick,
        theme: theme.ctaTheme,
      }}
      afterContent={
        showPostForm ? (
          <div className="fixed inset-0 z-50 overflow-y-auto bg-white">
            <BusinessForm
              embedded
              onClose={handleClosePostForm}
              onSuccess={() => {
                handleClosePostForm();
                window.location.reload();
              }}
            />
          </div>
        ) : null
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
              <p className="text-sm text-gray-600 mb-4">
                {isCountryView || isRegionView
                  ? 'Try another country or region, or clear the location filter.'
                  : 'Try changing your selection'}
              </p>
              <button
                type="button"
                onClick={
                  isCountryView || isRegionView ? () => navigate('/business') : clearExtraFilters
                }
                className="px-4 py-2 text-sm bg-purple-700 text-white rounded-lg hover:bg-purple-800"
              >
                {isCountryView || isRegionView ? 'All businesses' : 'Reset'}
              </button>
            </div>
          ) : (
            renderListings()
          )}
        </>
      )}
    </CategoryPageShell>
  );
};

export default BusinessBrowsePage;
