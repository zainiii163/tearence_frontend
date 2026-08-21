import React, { useEffect, useMemo, useState, useCallback } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import ServicesSectionHero from './ServicesSectionHero';
import ServicesGrid from './ServicesGrid';
import ServicesPostForm from './ServicesPostForm';
import ServicesCategoryGrid from './ServicesCategoryGrid';
import StandardListingFilters from '../shared/StandardListingFilters';
import CategoryPageShell from '../shared/CategoryPageShell';
import CompactPremiumReel from '../shared/CompactPremiumReel';
import BrowsePromotionLanes from '../shared/BrowsePromotionLanes';
import { getCategoryTheme } from '../../constants/categoryThemes';
import useAuthRedirect from '../../hooks/useAuthRedirect';
import { servicesApi } from '../../services/servicesSolutionsApi';
import { SERVICE_MAIN_CATEGORIES } from '../../constants/itServiceCategories';
import { findMainInTree, parseCategoriesResponse } from '../../utils/serviceCategoryUtils';
import { splitListingsByPromotion } from '../../utils/listingPromotionSort';
import { SERVICES_DEMO_LISTINGS } from '../../data/servicesDemo';

const extractServiceList = (response) => {
  const body = response?.data ?? response;
  if (Array.isArray(body)) return body;
  if (Array.isArray(body?.data)) return body.data;
  if (Array.isArray(body?.data?.data)) return body.data.data;
  return [];
};

/**
 * Clive Services & Solutions:
 * - Category chips (Logo Design, WordPress, Book Writing…) — not a vertical list
 * - Book Writing → editing / proofreading / etc.
 * - Templates only in hero (proper place)
 * - Left filters + a few featured posts
 * - Bottom CTA: “List your service” only
 */
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
        // Always keep Clive’s main category set (Logo / WP / Book Writing…); merge live ids
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
      const params = { page: 1, per_page: isLanding ? 24 : 48 };
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
      const live = extractServiceList(response);
      setServices(live.length ? live : SERVICES_DEMO_LISTINGS);
    } catch (error) {
      console.error('Error fetching services:', error);
      setServices(SERVICES_DEMO_LISTINGS);
    } finally {
      setLoading(false);
    }
  }, [routeSlug, filters, isLanding]);

  useEffect(() => {
    fetchServices();
  }, [fetchServices]);

  const { featured, sponsored, promoted, regular } = useMemo(
    () => splitListingsByPromotion(services),
    [services]
  );

  /** Featured only — top slider. Never fill with ordinary listings. */
  const featuredRow = useMemo(() => {
    const pool = featured.length ? featured : services.filter((s) => s.is_featured || s.featured);
    return pool.slice(0, 12);
  }, [featured, services]);

  const paidListings = useMemo(() => {
    if (postTypeFilterActive) return services;
    const featuredIds = new Set(featuredRow.map((s) => String(s.id)));
    return regular.filter((s) => !featuredIds.has(String(s.id)));
  }, [postTypeFilterActive, services, regular, featuredRow]);

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

  const theme = getCategoryTheme('services');

  const filterFields = (
    <StandardListingFilters
      filters={pendingFilters}
      onFilterChange={handleFilterChange}
      onApply={applyFilters}
      onClear={!isLanding ? clearExtraFilters : clearFilters}
      theme={theme.filterTheme}
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
    <CategoryPageShell
      categoryId="services"
      backHref={!isLanding ? '/services' : '/'}
      showBackBar
      backBarTo={!isLanding ? '/services' : '/'}
      backBarLabel={!isLanding ? 'Back to Online Services' : 'Back Home'}
      contentClassName="page-container py-4 sm:py-5"
      suggestionsCategoryKey={routeSlug || ''}
      suggestionsCategoryName={!isLanding ? pageTitle || '' : ''}
      hero={
        <ServicesSectionHero
          categoryLabel={pageTitle}
          searchValue={topSearch}
          onSearchChange={(e) => setTopSearch(e.target.value)}
          onSearchSubmit={applyTopSearch}
          templatesHref={templatesHref}
          calculatorsHref="/services/calculators"
        />
      }
      categoryGrid={
        <>
          {displayCategories.length > 0 && (
            <ServicesCategoryGrid
              categories={displayCategories}
              selectedSlug={routeSlug}
              onSelectCategory={handleCategorySelect}
              title={isLanding ? 'Categories' : `${selectedMain?.name || pageTitle} — types`}
              variant={isLanding ? 'groups' : 'chips'}
            />
          )}
          {!isLanding && selectedMain && (
            <button
              type="button"
              onClick={() => navigate('/services')}
              className={`mb-3 text-xs font-semibold ${theme.accentText} hover:underline`}
            >
              ← All categories
            </button>
          )}
        </>
      }
      premiumReel={
        featuredRow.length > 0 ? (
          <CompactPremiumReel
            items={featuredRow}
            title="Featured"
            getHref={(item) => `/services/${item.id || item.slug}`}
            accentClass={theme.accentText}
            borderAccent="hover:border-amber-300"
          />
        ) : null
      }
      filterLayoutProps={{
        open: showFilters,
        onOpenChange: setShowFilters,
        hideToggle: true,
        forceOpen: true,
        onApply: applyFilters,
        onClear: !isLanding ? clearExtraFilters : clearFilters,
        theme: theme.filterTheme,
        homeHref: '/services',
        filterFields,
        activeCount: activeFilterCount,
      }}
      bottomCta={{
        buttonLabel: 'List your service',
        onPostClick: handlePostClick,
        theme: theme.ctaTheme,
      }}
      afterContent={
        showPostForm ? (
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
        ) : null
      }
    >
          {!loading && featuredRow.length === 0 && paidListings.length === 0 && promoted.length === 0 ? (
            <div className="text-center py-8 bg-white rounded-lg border border-gray-200">
              <p className="text-gray-600 text-sm">No services yet. Be the first to list — use List your service below.</p>
            </div>
          ) : postTypeFilterActive ? (
            <ServicesGrid services={services} loading={loading} />
          ) : (
            <BrowsePromotionLanes
              promoted={promoted}
              paid={paidListings}
              maxPromoted={9}
              renderGrid={(items) => (
                <ServicesGrid services={items} loading={loading && items === paidListings} />
              )}
            />
          )}
    </CategoryPageShell>
  );
};

export default ServicesBrowsePage;
