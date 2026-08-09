import React, { useEffect, useState, useCallback, useMemo } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import VehicleHero from './VehicleHero';
import VehicleCategoryGrid from './VehicleCategoryGrid';
import VehicleGrid from './VehicleGrid';
import StandardListingFilters from '../shared/StandardListingFilters';
import CategoryPageShell from '../shared/CategoryPageShell';
import CompactPremiumReel from '../shared/CompactPremiumReel';
import { getCategoryTheme } from '../../constants/categoryThemes';
import { useAuthRedirect } from '../../hooks/useAuthRedirect';
import { pickPremiumForReel } from '../../utils/listingPromotionSort';
import {
  getVehicles,
  getVehicleCategories,
} from '../../services/vehiclesAPI';

const VehiclesBrowsePage = ({ initialCategoryType = null }) => {
  const navigate = useNavigate();
  const { requireAuth, isAuthenticated } = useAuthRedirect();
  const [searchParams] = useSearchParams();
  const [vehicles, setVehicles] = useState([]);
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filters, setFilters] = useState({});
  const [pendingFilters, setPendingFilters] = useState({});
  const [topSearch, setTopSearch] = useState('');
  const [showFilters, setShowFilters] = useState(true);

  const selectedType = initialCategoryType;
  const isCategoryView = Boolean(selectedType);
  const categoryLabel = selectedType
    ? categories.find((c) => c.slug === selectedType || String(c.id) === String(selectedType))?.name ||
      selectedType.replace(/[-_]/g, ' ')
    : null;

  useEffect(() => {
    if (searchParams.get('postForm') === 'true' && isAuthenticated) {
      navigate('/post-vehicles');
    }
  }, [searchParams, isAuthenticated, navigate]);

  useEffect(() => {
    let cancelled = false;
    const loadMeta = async () => {
      try {
        const categoriesData = await getVehicleCategories();
        if (cancelled) return;
        const catRows = Array.isArray(categoriesData?.data)
          ? categoriesData.data
          : Array.isArray(categoriesData)
            ? categoriesData
            : [];
        setCategories(catRows);
      } catch (error) {
        if (!cancelled) console.warn('Vehicle categories unavailable:', error?.message || error);
      }
    };
    loadMeta();
    return () => {
      cancelled = true;
    };
  }, []);

  const fetchVehicles = useCallback(async () => {
    try {
      setLoading(true);
      const merged = {
        ...filters,
        sort_by: filters.sort_by || 'created_at',
        sort_order: 'desc',
        per_page: 24,
      };
      if (selectedType) {
        if (/^\d+$/.test(String(selectedType))) {
          merged.category_id = selectedType;
        } else {
          merged.category_slug = selectedType;
        }
      }
      if (filters.priceMin) merged.price_min = filters.priceMin;
      if (filters.priceMax) merged.price_max = filters.priceMax;
      if (filters.country) merged.country = filters.country;
      if (filters.city) merged.city = filters.city;
      if (filters.search) merged.search = filters.search;
      const response = await getVehicles(merged);
      let data = Array.isArray(response.data) ? response.data : response.data?.data || [];

      if (filters.featured || filters.promoted || filters.sponsored) {
        data = data.filter((v) => {
          const checks = [];
          if (filters.featured) checks.push(!!(v.featured || v.is_featured));
          if (filters.promoted) checks.push(!!(v.promoted || v.is_promoted));
          if (filters.sponsored) checks.push(!!(v.sponsored || v.is_sponsored));
          return checks.some(Boolean);
        });
      }

      setVehicles(data);
    } catch (error) {
      console.warn('Failed to load vehicles:', error?.message || error);
      setVehicles([]);
    } finally {
      setLoading(false);
    }
  }, [filters, selectedType]);

  useEffect(() => {
    fetchVehicles();
  }, [fetchVehicles]);

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
      navigate('/vehicles');
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

  const handleCategorySelect = (slug) => {
    if (!slug) return;
    navigate(`/vehicles/category/${slug}`);
  };

  const handlePostClick = () => {
    const path = selectedType
      ? `/vehicles/category/${selectedType}?postForm=true`
      : '/vehicles?postForm=true';
    if (requireAuth(path, 'You must be logged in to post a vehicle.')) {
      navigate('/post-vehicles');
    }
  };

  const theme = getCategoryTheme('vehicles');

  const reelItems = useMemo(
    () =>
      pickPremiumForReel(vehicles, {
        limit: 12,
        allowFallback: false,
      }),
    [vehicles]
  );

  const filterFields = (
    <StandardListingFilters
      filters={pendingFilters}
      onFilterChange={handleFilterChange}
      onApply={applyFilters}
      onClear={isCategoryView ? clearExtraFilters : clearFilters}
      theme={theme.filterTheme}
      searchPlaceholder="Search vehicles…"
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
      categoryId="vehicles"
      backHref={isCategoryView ? '/vehicles' : '/'}
      hero={
        <VehicleHero
          categoryLabel={isCategoryView ? categoryLabel : null}
          searchValue={topSearch}
          onSearchChange={(e) => setTopSearch(e.target.value)}
          onSearchSubmit={applyTopSearch}
          templatesHref={
            selectedType
              ? `/vehicles/templates?category=${selectedType}&name=${encodeURIComponent(categoryLabel || '')}`
              : '/vehicles/templates'
          }
          calculatorsHref="/vehicles/calculators"
        />
      }
      showBackBar
      backBarLabel={isCategoryView ? 'Back to Vehicles' : 'Back Home'}
      categoryGrid={
        !isCategoryView ? (
            <div className="mb-6">
              <VehicleCategoryGrid
                categories={categories}
                vehicles={vehicles}
                selectedCategoryId={selectedType}
                onCategorySelect={handleCategorySelect}
              />
            </div>
        ) : null
      }
      premiumReel={
        reelItems.length > 0 ? (
          <CompactPremiumReel
            items={reelItems}
            title="Featured"
            getHref={(item) => `/vehicles/${item.id}`}
            accentClass={theme.accentText || 'text-blue-700'}
            borderAccent="hover:border-blue-300"
          />
        ) : null
      }
      filterLayoutProps={{
        open: showFilters,
        onOpenChange: setShowFilters,
        onApply: applyFilters,
        onClear: isCategoryView ? clearExtraFilters : clearFilters,
        theme: theme.filterTheme,
        homeHref: '/vehicles',
        filterFields,
        activeCount: activeFilterCount,
      }}
      bottomCta={{
        buttonLabel: 'List your vehicles',
        onPostClick: handlePostClick,
        theme: theme.ctaTheme,
      }}
    >
      {loading ? (
        <div className="text-center py-12">
          <div className={`inline-block h-10 w-10 animate-spin rounded-full border-4 ${theme.spinnerBorder} border-r-transparent`} />
        </div>
      ) : (
        <VehicleGrid vehicles={vehicles} />
      )}
    </CategoryPageShell>
  );
};

export default VehiclesBrowsePage;
