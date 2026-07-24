import React, { useEffect, useMemo, useState, useCallback } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { FiPlus } from 'react-icons/fi';
import UnifiedNavbar from '../UnifiedNavbar';
import Footer from '../Footer';
import ServicesSectionHero from './ServicesSectionHero';
import ServicesGrid from './ServicesGrid';
import ServicesPostForm from './ServicesPostForm';
import ServicesCategoryGrid from './ServicesCategoryGrid';
import BrowseBottomPostCta from '../shared/BrowseBottomPostCta';
import BrowseCategoryTemplates from '../shared/BrowseCategoryTemplates';
import StandardListingFilters from '../shared/StandardListingFilters';
import { BrowseFilterLayout } from '../shared/BrowseFilterLayout';
import useAuthRedirect from '../../hooks/useAuthRedirect';
import { servicesApi } from '../../services/servicesSolutionsApi';
import { IT_SERVICE_CATEGORY_DEFS } from '../../constants/itServiceCategories';
import {
  TECH_SERVICE_CATEGORIES,
  findTechCategory,
} from '../../constants/serviceCategoryGroups';
import { parseCategoriesResponse } from '../../utils/serviceCategoryUtils';
import { splitListingsByPromotion } from '../../utils/listingPromotionSort';

const normalizeTechCategories = (flat = []) => {
  const allowed = new Set(IT_SERVICE_CATEGORY_DEFS.map((d) => d.slug));
  const fromApi = flat
    .filter((c) => c && c.is_active !== false && allowed.has(c.slug))
    .map((c) => {
      const meta = IT_SERVICE_CATEGORY_DEFS.find((d) => d.slug === c.slug);
      return {
        id: c.id,
        slug: c.slug,
        name: c.label || c.name || meta?.name || c.slug,
        emoji: meta?.emoji || '💻',
        sort_order: c.sort_order ?? 99,
      };
    })
    .sort((a, b) => a.sort_order - b.sort_order);

  if (fromApi.length) return fromApi;

  return TECH_SERVICE_CATEGORIES.map((c, i) => ({
    id: c.slug,
    slug: c.slug,
    name: c.name,
    emoji: c.emoji,
    sort_order: i + 1,
  }));
};

const ServicesBrowsePage = ({ initialCategoryId = null, initialGroupId = null }) => {
  const navigate = useNavigate();
  const { requireAuth, isAuthenticated } = useAuthRedirect();
  const [searchParams, setSearchParams] = useSearchParams();
  const [categories, setCategories] = useState([]);
  const [services, setServices] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showPostForm, setShowPostForm] = useState(false);
  const [showFilters, setShowFilters] = useState(true);
  const [filters, setFilters] = useState({});
  const [pendingFilters, setPendingFilters] = useState({});
  const [topSearch, setTopSearch] = useState('');

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

  const numericFromRoute =
    initialCategoryId && /^[0-9]+$/.test(String(initialCategoryId))
      ? initialCategoryId
      : null;

  const selectedCategory = useMemo(() => {
    if (numericFromRoute) {
      return categories.find((c) => String(c.id) === String(numericFromRoute)) || null;
    }
    if (routeSlug) {
      return (
        categories.find((c) => c.slug === routeSlug) ||
        findTechCategory(routeSlug) ||
        null
      );
    }
    return null;
  }, [categories, routeSlug, numericFromRoute]);

  const activeCategoryId = selectedCategory?.id && /^[0-9]+$/.test(String(selectedCategory.id))
    ? selectedCategory.id
    : numericFromRoute;
  const activeCategorySlug = selectedCategory?.slug || routeSlug;
  const isLanding = !activeCategorySlug && !activeCategoryId;
  const pageTitle = selectedCategory?.name || null;
  const postTypeFilterActive = !!(filters.featured || filters.promoted || filters.sponsored);

  useEffect(() => {
    if (searchParams.get('postForm') === 'true' && isAuthenticated) {
      setShowPostForm(true);
    }
  }, [searchParams, isAuthenticated]);

  useEffect(() => {
    const loadCategories = async () => {
      try {
        const res = await servicesApi.getCategories();
        const parsed = parseCategoriesResponse(res);
        setCategories(normalizeTechCategories(parsed.flat));
      } catch {
        setCategories(normalizeTechCategories([]));
      }
    };
    loadCategories();
  }, []);

  const fetchServices = useCallback(async () => {
    setLoading(true);
    try {
      const params = { page: 1, per_page: 48, sort_by: 'created_at' };
      if (filters.search) params.search = filters.search;
      if (activeCategoryId) params.category_id = activeCategoryId;
      else if (activeCategorySlug) params.category_slug = activeCategorySlug;
      if (filters.country) params.country = filters.country;
      if (filters.city) params.city = filters.city;
      if (filters.priceMin) params.min_price = filters.priceMin;
      if (filters.priceMax) params.max_price = filters.priceMax;

      let promotion = null;
      if (filters.featured) promotion = 'featured';
      else if (filters.promoted) promotion = 'promoted';
      else if (filters.sponsored) promotion = 'sponsored';
      if (promotion) params.promotion_type = promotion;

      if (isLanding && !filters.search) {
        params.group_slug = 'it-computing';
      }

      const response = await servicesApi.getServices(params);
      const data = response?.data || response;
      const list = Array.isArray(data) ? data : data?.data || [];
      setServices(list);
    } catch (error) {
      console.error('Error fetching services:', error);
      setServices([]);
    } finally {
      setLoading(false);
    }
  }, [activeCategoryId, activeCategorySlug, filters, isLanding]);

  useEffect(() => {
    fetchServices();
  }, [fetchServices]);

  const { featured, sponsored, regular } = useMemo(
    () => splitListingsByPromotion(services),
    [services]
  );

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

  const handleTrendingSearch = (term) => {
    setTopSearch(term);
    const next = { search: term };
    setPendingFilters(next);
    setFilters(next);
  };

  const handleCategorySelect = (cat) => {
    setFilters({});
    setPendingFilters({});
    navigate(`/services/category/${cat.slug || cat.id}`);
  };

  const handlePostClick = () => {
    const path = activeCategorySlug
      ? `/services/category/${activeCategorySlug}?postForm=true`
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

  const showListings = !isLanding || Boolean(filters.search);

  return (
    <div className="min-h-screen bg-gray-50 overflow-x-hidden">
      <UnifiedNavbar showBackButton backHref={!isLanding ? '/services' : '/'} />
      <ServicesSectionHero
        categoryLabel={pageTitle}
        searchValue={topSearch}
        onSearchChange={(e) => setTopSearch(e.target.value)}
        onSearchSubmit={applyTopSearch}
        onTrendingClick={handleTrendingSearch}
        templatesHref={
          activeCategorySlug
            ? `/services/templates?category=${activeCategorySlug}&name=${encodeURIComponent(pageTitle || '')}`
            : '/services/templates'
        }
        calculatorsHref="/services/calculators"
      />

      <div className="page-container py-4 sm:py-5">
        {isLanding && (
          <ServicesCategoryGrid
            categories={categories}
            selectedSlug={activeCategorySlug}
            onSelectCategory={handleCategorySelect}
          />
        )}

        {showListings && (
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
                List service
              </button>
            }
          >
            {services.length > 0 || loading ? (
              postTypeFilterActive ? (
                <ServicesGrid services={services} loading={loading} />
              ) : (
                <>
                  {featured.length > 0 && (
                    <section className="mb-6">
                      <h2 className="text-sm sm:text-base font-bold text-gray-900 mb-3">Featured</h2>
                      <ServicesGrid services={featured} loading={false} />
                    </section>
                  )}
                  <ServicesGrid services={regular} loading={loading} />
                  {sponsored.length > 0 && (
                    <section className="mt-8">
                      <h2 className="text-sm sm:text-base font-bold text-gray-900 mb-3">Sponsored</h2>
                      <ServicesGrid services={sponsored} loading={false} />
                    </section>
                  )}
                </>
              )
            ) : (
              <div className="text-center py-8 bg-white rounded-lg border border-gray-200">
                <p className="text-gray-600 text-sm">
                  No services yet. Be the first to list.
                </p>
              </div>
            )}
          </BrowseFilterLayout>
        )}

        <BrowseCategoryTemplates
          vertical="services"
          categoryKey={activeCategorySlug || ''}
          categoryName={pageTitle || ''}
          theme="emerald"
          onBrowseClick={() =>
            navigate(
              activeCategorySlug
                ? `/services/templates?category=${activeCategorySlug}&name=${encodeURIComponent(pageTitle || '')}`
                : '/services/templates'
            )
          }
          browseLabel="Browse templates"
          sellLabel="Sell a template"
        />

        <BrowseBottomPostCta
          title="Offer a tech service"
          description="List your gig free — or upgrade for Featured / Sponsored placement."
          buttonLabel="List your service"
          onPostClick={handlePostClick}
          theme="emerald"
        />
      </div>

      <Footer />

      {showPostForm && (
        <ServicesPostForm
          initialCategoryId={activeCategoryId}
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
