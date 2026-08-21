import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { buysellAPI } from '../../api/buysell';
import { getAllBusinesses } from '../../api/business';
import { servicesApi } from '../../services/servicesSolutionsApi';
import { getVehicles } from '../../services/vehiclesAPI';
import propertyApi from '../../services/propertyApi';
import { splitListingsByPromotion } from '../../utils/listingPromotionSort';
import { BrowseListingGrid } from './BrowseListingCard';
import BuySellGrid from '../buy-sell/BuySellGrid';
import BusinessListingsGrid from '../Business/BusinessListingsGrid';
import ServicesGrid from '../Services/ServicesGrid';
import VehicleGrid from '../vehicles/VehicleGrid';
import PropertyListingsGrid from '../property/PropertyListingsGrid';

const LIMIT = 12;

const normalizeList = (res) => {
  if (!res) return [];
  if (Array.isArray(res)) return res;
  if (Array.isArray(res.items)) return res.items;
  if (Array.isArray(res.data?.items)) return res.data.items;
  if (Array.isArray(res.data?.data)) return res.data.data;
  if (Array.isArray(res.data)) return res.data;
  return [];
};

const dedupeById = (items = []) => {
  const seen = new Set();
  return items.filter((item) => {
    const key = String(item?.id ?? item?.slug ?? '');
    if (!key || seen.has(key)) return false;
    seen.add(key);
    return true;
  });
};

const pickAds = (items = []) => {
  const { featured, sponsored, regular } = splitListingsByPromotion(dedupeById(items));
  return [...featured, ...sponsored, ...regular].slice(0, LIMIT);
};

const SECTION_COPY = {
  'buy-sell': 'Buy & Sell adverts',
  business: 'Business adverts',
  services: 'Service adverts',
  vehicles: 'Vehicle adverts',
  property: 'Property adverts',
  hub: 'Featured adverts',
};

const accentClass = (theme) => {
  if (theme === 'purple') return 'text-purple-700';
  if (theme === 'green') return 'text-green-700';
  if (theme === 'red') return 'text-red-700';
  if (theme === 'blue') return 'text-blue-700';
  if (theme === 'slate') return 'text-[#b8895a]';
  if (theme === 'amber') return 'text-amber-700';
  if (theme === 'orange') return 'text-orange-700';
  return 'text-emerald-700';
};

/**
 * Live API adverts under calculators — Clive: include a filter on advert grids.
 */
const CalculatorFeaturedAds = ({ vertical = 'hub', theme = 'emerald', className = '' }) => {
  const navigate = useNavigate();
  const [ads, setAds] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filterQuery, setFilterQuery] = useState('');

  useEffect(() => {
    let cancelled = false;

    const load = async () => {
      setLoading(true);
      try {
        let items = [];

        if (vertical === 'buy-sell') {
          const res = await buysellAPI
            .getAdverts({
              page: 1,
              limit: 48,
              category: 'all',
              sortBy: 'newest',
              sortOrder: 'desc',
            })
            .catch(() => null);
          items = normalizeList(res);
        } else if (vertical === 'business') {
          const res = await getAllBusinesses({ limit: 60 }).catch(() => null);
          items = normalizeList(res);
        } else if (vertical === 'services') {
          const res = await servicesApi
            .getServices({ page: 1, per_page: 48 })
            .catch(() => null);
          items = normalizeList(res);
        } else if (vertical === 'vehicles') {
          const res = await getVehicles({ page: 1, per_page: 48 }).catch(() => null);
          items = normalizeList(res);
        } else if (vertical === 'property') {
          const [featured, all] = await Promise.all([
            propertyApi.getFeaturedProperties().catch(() => null),
            propertyApi.getProperties({ per_page: 24 }).catch(() => null),
          ]);
          items = [...normalizeList(featured), ...normalizeList(all)];
        } else {
          const res = await buysellAPI
            .getAdverts({
              page: 1,
              limit: 48,
              category: 'all',
              sortBy: 'newest',
              sortOrder: 'desc',
            })
            .catch(() => null);
          items = normalizeList(res);
        }

        if (!cancelled) setAds(pickAds(items));
      } catch {
        if (!cancelled) setAds([]);
      } finally {
        if (!cancelled) setLoading(false);
      }
    };

    load();
    return () => {
      cancelled = true;
    };
  }, [vertical]);

  const title = SECTION_COPY[vertical] || SECTION_COPY.hub;
  const accent = accentClass(theme);

  const visibleAds = (() => {
    const q = filterQuery.trim().toLowerCase();
    if (!q) return ads;
    return ads.filter((ad) =>
      [ad.title, ad.name, ad.description, ad.category, ad.city, ad.location, ad.country]
        .filter(Boolean)
        .join(' ')
        .toLowerCase()
        .includes(q)
    );
  })();

  const renderAds = () => {
    if (vertical === 'buy-sell' || vertical === 'hub') {
      return <BuySellGrid adverts={visibleAds} loading={loading} viewMode="grid" />;
    }
    if (vertical === 'business') {
      return (
        <BusinessListingsGrid
          businesses={visibleAds}
          loading={loading}
          onBusinessClick={(id) => navigate(`/business/${id}`)}
        />
      );
    }
    if (vertical === 'services') {
      return <ServicesGrid services={visibleAds} loading={loading} />;
    }
    if (vertical === 'vehicles') {
      if (loading) return <BrowseListingGrid loading />;
      return <VehicleGrid vehicles={visibleAds} />;
    }
    if (vertical === 'property') {
      if (loading) return <BrowseListingGrid loading />;
      return <PropertyListingsGrid properties={visibleAds} loading={loading} />;
    }
    return <BuySellGrid adverts={visibleAds} loading={loading} viewMode="grid" />;
  };

  return (
    <section className={`mt-8 pt-6 border-t border-gray-200 ${className}`}>
      <div className="flex flex-col items-center text-center gap-3 mb-3">
        <h2 className={`text-sm sm:text-base font-bold text-gray-900 ${accent}`}>{title}</h2>
        <input
          type="search"
          value={filterQuery}
          onChange={(e) => setFilterQuery(e.target.value)}
          placeholder="Filter these adverts…"
          className="w-full sm:w-64 px-3 py-2 text-xs sm:text-sm rounded-lg border border-gray-200 bg-white focus:ring-2 focus:ring-blue-300 outline-none"
        />
      </div>
      {renderAds()}
    </section>
  );
};

export default CalculatorFeaturedAds;
