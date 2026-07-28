import React, { useEffect, useState, useCallback } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { FiPlus } from 'react-icons/fi';
import UnifiedNavbar from '../UnifiedNavbar';
import Footer from '../Footer';
import VehicleHero from './VehicleHero';
import VehicleCategoryGrid from './VehicleCategoryGrid';
import VehicleGrid from './VehicleGrid';
import VehicleActivityFeed from './VehicleActivityFeed';
import BrowseBottomPostCta from '../shared/BrowseBottomPostCta';
import StandardListingFilters from '../shared/StandardListingFilters';
import { BrowseFilterLayout } from '../shared/BrowseFilterLayout';
import { useAuthRedirect } from '../../hooks/useAuthRedirect';
import {
  getVehicles,
  getVehicleStatistics,
  getVehicleCategoriesForFilters,
  getVehicleTypes,
} from '../../services/vehiclesAPI';

const VehiclesBrowsePage = ({ initialCategoryType = null }) => {
  const navigate = useNavigate();
  const { requireAuth, isAuthenticated } = useAuthRedirect();
  const [searchParams] = useSearchParams();
  const [vehicles, setVehicles] = useState([]);
  const [categories, setCategories] = useState([]);
  const [vehicleTypes, setVehicleTypes] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filters, setFilters] = useState({});
  const [pendingFilters, setPendingFilters] = useState({});
  const [topSearch, setTopSearch] = useState('');
  const [showFilters, setShowFilters] = useState(true);

  const selectedType = initialCategoryType;
  const isCategoryView = Boolean(selectedType);
  const categoryLabel = selectedType
    ? vehicleTypes[selectedType] || selectedType.replace(/_/g, ' ')
    : null;

  useEffect(() => {
    if (searchParams.get('postForm') === 'true' && isAuthenticated) {
      navigate('/post-vehicles');
    }
  }, [searchParams, isAuthenticated, navigate]);

  useEffect(() => {
    const loadMeta = async () => {
      try {
        const [categoriesData, typesData] = await Promise.all([
          getVehicleCategoriesForFilters(),
          getVehicleTypes(),
        ]);
        setCategories(categoriesData.data?.data || categoriesData.data || {});
        setVehicleTypes(typesData.data?.data || typesData.data || {});
        await getVehicleStatistics().catch(() => null);
      } catch (error) {
        console.error('Failed to load vehicle meta:', error);
      }
    };
    loadMeta();
  }, []);

  const fetchVehicles = useCallback(async () => {
    try {
      setLoading(true);
      const merged = { ...filters, sort_by: filters.sort_by || 'created_at', sort_order: 'desc' };
      if (selectedType) merged.vehicle_type = selectedType;
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
      console.error('Failed to load vehicles:', error);
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

  const handleCategorySelect = (type) => navigate(`/vehicles/category/${type}`);

  const handlePostClick = () => {
    const path = selectedType
      ? `/vehicles/category/${selectedType}?postForm=true`
      : '/vehicles?postForm=true';
    if (requireAuth(path, 'You must be logged in to post a vehicle.')) {
      navigate('/post-vehicles');
    }
  };

  const filterFields = (
    <StandardListingFilters
      filters={pendingFilters}
      onFilterChange={handleFilterChange}
      onApply={applyFilters}
      onClear={isCategoryView ? clearExtraFilters : clearFilters}
      theme="red"
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
    <div className="min-h-screen bg-gray-50 overflow-x-hidden">
      <UnifiedNavbar showBackButton backHref={isCategoryView ? '/vehicles' : '/'} />
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

      <div className="page-container py-4 sm:py-6">
        <div className="mb-6">
          <VehicleActivityFeed />
        </div>

        <BrowseFilterLayout
          open={showFilters}
          onOpenChange={setShowFilters}
          onApply={applyFilters}
          onClear={isCategoryView ? clearExtraFilters : clearFilters}
          theme="red"
          homeHref="/vehicles"
          filterFields={filterFields}
          activeCount={activeFilterCount}
          toolbarLeft={
            <p className="text-sm text-gray-600">
              {loading ? 'Loading…' : `${vehicles.length} listings`}
            </p>
          }
          toolbarRight={
            <button
              type="button"
              onClick={handlePostClick}
              className="inline-flex items-center gap-1 px-3 py-1.5 text-xs sm:text-sm font-semibold text-white bg-red-600 hover:bg-red-700 rounded-lg"
            >
              <FiPlus className="h-3.5 w-3.5" />
              Post
            </button>
          }
        >
          {!isCategoryView && (
            <div className="mb-6">
              <VehicleCategoryGrid
                categories={categories}
                vehicleTypes={vehicleTypes}
                selectedCategoryId={selectedType}
                onCategorySelect={handleCategorySelect}
              />
            </div>
          )}

          {loading ? (
            <div className="text-center py-12">
              <div className="inline-block h-10 w-10 animate-spin rounded-full border-4 border-red-600 border-r-transparent" />
            </div>
          ) : (
            <VehicleGrid vehicles={vehicles} />
          )}

          <BrowseBottomPostCta
            title="Sell or list a vehicle"
            description="Log in and post — Free, Paid, Featured or Sponsored for higher search placement."
            buttonLabel="Post a vehicle"
            onPostClick={handlePostClick}
            theme="red"
          />
        </BrowseFilterLayout>
      </div>

      <Footer />
    </div>
  );
};

export default VehiclesBrowsePage;
