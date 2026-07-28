import React, { useEffect, useMemo, useState, useCallback } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { FiPlus } from 'react-icons/fi';
import UnifiedNavbar from '../UnifiedNavbar';
import Footer from '../Footer';
import ServicesSectionHero from './ServicesSectionHero';
import ServicesGrid from './ServicesGrid';
import ServicesPostForm from './ServicesPostForm';
import ServicesCategoryGrid from './ServicesCategoryGrid';
import ServicesFeaturedStrip from './ServicesFeaturedStrip';
import BrowseBottomPostCta from '../shared/BrowseBottomPostCta';
import StandardListingFilters from '../shared/StandardListingFilters';
import { BrowseFilterLayout } from '../shared/BrowseFilterLayout';
import useAuthRedirect from '../../hooks/useAuthRedirect';
import { servicesApi } from '../../services/servicesSolutionsApi';
import { SERVICE_MAIN_CATEGORIES } from '../../constants/itServiceCategories';
import { findMainInTree, parseCategoriesResponse } from '../../utils/serviceCategoryUtils';
import { splitListingsByPromotion } from '../../utils/listingPromotionSort';

const extractServiceList = (response) => {
  const body = response?.data ?? response;
  if (Array.isArray(body)) return body;
  if (Array.isArray(body?.data)) return body.data;
  if (Array.isArray(body?.data?.data)) return body.data.data;
  return [];
};

const ServicesBrowsePage = ({ initialCategoryId = null, initialGroupId = null }) => {
  const navigate = useNavigate();
  const { requireAuth, isAuthenticated } = useAuthRedirect();
  const [searchParams, setSearchParams] = useSearchParams();
  const [services, setServices] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showPostForm, setShowPostForm] = useState(false);
  const [showFilters, setShowFilters] = useState(true);
  const [filters, setFilters] = useState({});
  const [pendingFilters, setPendingFilters] = useState({});
  const [topSearch, setTopSearch] = useState('');
  const [liveMains, setLiveMains] = useState(SERVICE_MAIN_CATEGORIES);

  const routeSlug = (() => {
    if (initialCategoryId && !/^[0-9]+$/.test(String(initialCategoryId))) {
      return initialCategoryId;
    }
    if (initialGroupId && initialGroupId !== 'it-computing') return initialGroupId;
    if (initialGroupId === 'it-computing' && initialCategoryId) {
      return /^[0-9]+$/.test(String(initialCategoryId)) ? null : initialCategoryId;
    }
    return null;
  })();

  useEffect(() => {
    let cancelled = false;
    servicesApi
      .getCategories()
      .then((res) => {
        if (cancelled) return;
        const parsed = parseCategoriesResponse(res);
        if (parsed.mains?.length) setLiveMains(parsed.mains);
      })
      .catch(() => {
        if (!cancelled) setLiveMains(SERVICE_MAIN_CATEGORIES);
      });
    return () => {
      cancelled = true;
    };
  }, []);

  const selectedMain = useMemo(
    () => (routeSlug ? findMainInTree(liveMains, routeSlug) : null),
    [routeSlug, liveMains]
  );

  const selectedDef = useMemo(() => {
    if (!routeSlug) return null;
    if (selectedMain?.slug === routeSlug) return selectedMain;
    const child = (selectedMain?.children || []).find((c) => c.slug === routeSlug);
    if (child) return child;
    return liveMains.find((m) => m.slug === routeSlug) || null;
  }, [routeSlug, selectedMain, liveMains]);

  const isLanding = !routeSlug;
  const pageTitle = selectedDef?.name || selectedMain?.name || null;
  const postTypeFilterActive = !!(filters.featured || filters.promoted || filters.sponsored);

  const displayCategories = useMemo(() => {
    if (isLanding) return liveMains;
    const kids = selectedMain?.children?.length ? selectedMain.children : [];
    return kids;
  }, [isLanding, liveMains, selectedMain]);

  useEffect(() => {
    if (searchParams.get('postForm') === 'true' && isAuthenticated) {
      setShowPostForm(true);
    }
  }, [searchParams, isAuthenticated]);

  const fetchServices = useCallback(async () => {
    setLoading(true);
    try {
      const params = { page: 1, per_page: 48 };
      if (filters.search) params.search = filters.search;
      if (filters.country) params.country = filters.country;
      if (filters.city) params.city = filters.city;
      if (filters.priceMin) params.min_price = filters.priceMin;
      if (filters.priceMax) params.max_price = filters.priceMax;

      let promotion = null;
      if (filters.featured) promotion = 'featured';
      else if (filters.promoted) promotion = 'promoted';
      else if (filters.sponsored) promotion = 'sponsored';
      if (promotion) params.promotion_type = promotion;

      if (routeSlug) {
        params.category_slug = routeSlug;
      }

      const response = await servicesApi.getServices(params);
      setServices(extractServiceList(response));
    } catch (error) {
      console.error('Error fetching services:', error);
      setServices([]);
    } finally {
      setLoading(false);
    }
  }, [routeSlug, filters]);

  useEffect(() => {
    fetchServices();
  }, [fetchServices]);

  const { featured, sponsored, regular } = useMemo(
    () => splitListingsByPromotion(services),
    [services]
  );

  const mainListings = useMemo(() => {
    if (postTypeFilterActive) return services;
    return [...regular, ...sponsored];
  }, [postTypeFilterActive, services, regular, sponsored]);

  const handleFilterChange = (key, value) => {
    setPendingFilters((prev) => {
      const next = { ...prev, [key]: value };
      if (typeof value === 'boolean' && !value) delete next[key];
      if ((typeof value === 'string' || typeof value === 'number') && value === '') delete next[key];
      return next;
    });
  };

  const applyFilters = () => {
    setFilters({ ...pendingFilters });
  };

  const clearFilters = () => {
    if (!isLanding) {
      navigate('/services');
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

  const handleCategorySelect = (cat) => {
    setFilters({});
    setPendingFilters({});
    navigate(`/services/category/${cat.slug || cat.id}`);
  };

  const handlePostClick = () => {
    const path = routeSlug
      ? `/services/category/${routeSlug}?postForm=true`
      : '/services?postForm=true';
    if (requireAuth(path, 'You must be logged in to list your service.')) {
      setShowPostForm(true);
      setSearchParams({ postForm: 'true' });
    }
  };

  const activeFilterCount = Object.entries(filters).filter(([, v]) => {
    if (typeof v === 'boolean') return v;
    return v !== '' && v != null;
  }).length;

  const filterFields = (
    <StandardListingFilters
      filters={pendingFilters}
      onFilterChange={handleFilterChange}
      onApply={applyFilters}
      onClear={!isLanding ? clearExtraFilters : clearFilters}
      theme="emerald"
      searchPlaceholder="Search services…"
      asPanel={false}
      showActions={false}
      showTitle={false}
    />
  );

  const templatesHref = routeSlug
    ? `/services/templates?category=${routeSlug}&name=${encodeURIComponent(pageTitle || '')}`
    : '/services/templates';

  return (
    <div className="min-h-screen bg-gray-50 overflow-x-hidden">
      <UnifiedNavbar showBackButton backHref={!isLanding ? '/services' : '/'} />
      <ServicesSectionHero
        categoryLabel={pageTitle}
        searchValue={topSearch}
        onSearchChange={(e) => setTopSearch(e.target.value)}
        onSearchSubmit={applyTopSearch}
        templatesHref={templatesHref}
        calculatorsHref="/services/calculators"
      />

      <div className="page-container py-4 sm:py-5">
        {displayCategories.length > 0 && (
          <ServicesCategoryGrid
            categories={displayCategories}
            selectedSlug={routeSlug}
            onSelectCategory={handleCategorySelect}
            title={isLanding ? 'Categories' : `${selectedMain?.name || pageTitle} types`}
            variant={isLanding ? 'groups' : 'chips'}
          />
        )}

        {/* Clive: filters on the left; listings; featured at bottom */}
        <BrowseFilterLayout
          open={showFilters}
          onOpenChange={setShowFilters}
          onApply={applyFilters}
          onClear={!isLanding ? clearExtraFilters : clearFilters}
          theme="emerald"
          homeHref="/services"
          filterFields={filterFields}
          activeCount={activeFilterCount}
          toolbarLeft={
            <p className="text-sm text-gray-600">
              {loading ? 'Loading…' : `${services.length} listings`}
            </p>
          }
          toolbarRight={
            <button
              type="button"
              onClick={handlePostClick}
              className="inline-flex items-center gap-1 px-3 py-1.5 text-xs font-semibold text-white bg-emerald-700 hover:bg-emerald-800 rounded-lg"
            >
              <FiPlus className="h-3.5 w-3.5" />
              List your service
            </button>
          }
        >
          {mainListings.length > 0 || loading ? (
            <ServicesGrid services={mainListings} loading={loading} />
          ) : featured.length > 0 ? (
            <div className="text-center py-6 bg-white rounded-lg border border-gray-200 mb-1">
              <p className="text-gray-600 text-sm">Browse featured services below.</p>
            </div>
          ) : (
            <div className="text-center py-8 bg-white rounded-lg border border-gray-200">
              <p className="text-gray-600 text-sm">No services yet. Be the first to list.</p>
            </div>
          )}
        </BrowseFilterLayout>

        {!postTypeFilterActive && (
          <ServicesFeaturedStrip
            services={featured}
            loading={loading && featured.length === 0}
          />
        )}

        <BrowseBottomPostCta
          title="List your service"
          buttonLabel="List your service"
          onPostClick={handlePostClick}
          theme="emerald"
          compact
        />
      </div>

      <Footer />

      {showPostForm && (
        <ServicesPostForm
          initialCategoryId={routeSlug}
          onClose={() => {
            setShowPostForm(false);
            setSearchParams({});
          }}
          onSubmit={() => {
            setShowPostForm(false);
            setSearchParams({});
            fetchServices();
          }}
        />
      )}
    </div>
  );
};

export default ServicesBrowsePage;
