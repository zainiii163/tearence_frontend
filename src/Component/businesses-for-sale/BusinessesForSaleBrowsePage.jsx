import React, { useCallback, useEffect, useMemo, useState } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import BusinessesForSaleHero from './BusinessesForSaleHero';
import BusinessesForSaleCategoryGrid from './BusinessesForSaleCategoryGrid';
import BusinessesForSaleGrid from './BusinessesForSaleGrid';
import StandardListingFilters from '../shared/StandardListingFilters';
import CategoryPageShell from '../shared/CategoryPageShell';
import { getCategoryTheme } from '../../constants/categoryThemes';
import sponsoredAdvertsAPI from '../../api/sponsoredAdvertsAPI';
import useAuthRedirect from '../../hooks/useAuthRedirect';
import { extractListItems } from '../../utils/apiResponseHelpers';
import {
  BUSINESS_SALE_CATEGORIES,
  BUSINESS_SALE_GROUPS,
  getCategoryById,
  getGroupById,
  matchListingToCategory,
  matchListingToGroup,
} from './businessesForSaleCategories';

const isBusinessListing = (item) => {
  const type = (item.advert_type || '').toLowerCase();
  if (type === 'business') return true;
  const haystack = [item.title, item.tagline, item.description, item.category?.name]
    .filter(Boolean)
    .join(' ')
    .toLowerCase();
  return (
    haystack.includes('business for sale') ||
    haystack.includes('sell business') ||
    haystack.includes('business sale') ||
    haystack.includes('acquisition') ||
    haystack.includes('franchise')
  );
};

const DASHBOARD_POST_URL =
  '/dashboard?tab=sponsored&create=true&advert_type=business';

const BusinessesForSaleBrowsePage = ({ initialCategoryId = null }) => {
  const navigate = useNavigate();
  const [searchParams, setSearchParams] = useSearchParams();
  const { requireAuth } = useAuthRedirect();

  const [listings, setListings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [topSearch, setTopSearch] = useState('');
  const [filters, setFilters] = useState({});
  const [pendingFilters, setPendingFilters] = useState({});
  const [showFilters, setShowFilters] = useState(true);
  const [selectedCategoryId, setSelectedCategoryId] = useState(initialCategoryId);

  const typeFromUrl = searchParams.get('type');
  const selectedGroupId =
    typeFromUrl === 'online' || typeFromUrl === 'physical' ? typeFromUrl : null;

  const isCategoryView = Boolean(selectedCategoryId);
  const categoryMeta = selectedCategoryId ? getCategoryById(selectedCategoryId) : null;
  const groupMeta = selectedGroupId ? getGroupById(selectedGroupId) : null;
  const categoryLabel =
    categoryMeta?.name ||
    (groupMeta ? groupMeta.name : null);

  useEffect(() => {
    setSelectedCategoryId(initialCategoryId);
    // Ensure type URL matches the category's group so back/filter stay consistent
    if (initialCategoryId) {
      const cat = getCategoryById(initialCategoryId);
      if (cat?.group && searchParams.get('type') !== cat.group) {
        const next = new URLSearchParams(searchParams);
        next.set('type', cat.group);
        setSearchParams(next, { replace: true });
      }
    }
  }, [initialCategoryId]); // eslint-disable-line react-hooks/exhaustive-deps

  // Login return / old links: open dashboard sale form instead of page popup
  useEffect(() => {
    if (searchParams.get('postForm') === 'true') {
      navigate(DASHBOARD_POST_URL, { replace: true });
    }
  }, [searchParams, navigate]);

  const fetchListings = useCallback(async () => {
    setLoading(true);
    try {
      const response = await sponsoredAdvertsAPI.getSponsoredAdverts({
        per_page: 100,
        page: 1,
        advert_type: 'business',
      });

      let items = extractListItems(response);

      if (!items.length) {
        const fallback = await sponsoredAdvertsAPI.getSponsoredAdverts({ per_page: 100, page: 1 });
        items = extractListItems(fallback).filter(isBusinessListing);
      }

      setListings(Array.isArray(items) ? items : []);
    } catch (error) {
      console.error('Error loading businesses for sale:', error);
      setListings([]);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchListings();
  }, [fetchListings]);

  const listingCounts = useMemo(() => {
    const scoped = selectedGroupId
      ? listings.filter((item) => matchListingToGroup(item, selectedGroupId))
      : listings;
    const counts = {};
    BUSINESS_SALE_CATEGORIES.forEach((cat) => {
      counts[cat.id] = scoped.filter((item) => matchListingToCategory(item, cat.id)).length;
    });
    return counts;
  }, [listings, selectedGroupId]);

  const groupCounts = useMemo(() => {
    const counts = {};
    BUSINESS_SALE_GROUPS.forEach((g) => {
      counts[g.id] = listings.filter((item) => matchListingToGroup(item, g.id)).length;
    });
    return counts;
  }, [listings]);

  const filteredListings = useMemo(() => {
    let result = listings;

    if (selectedGroupId) {
      result = result.filter((item) => matchListingToGroup(item, selectedGroupId));
    }

    if (selectedCategoryId) {
      result = result.filter((item) => matchListingToCategory(item, selectedCategoryId));
    }

    const search = (filters.search || '').trim().toLowerCase();
    if (search) {
      result = result.filter((item) => {
        const haystack = [item.title, item.tagline, item.description, item.city, item.country, item.business_name]
          .filter(Boolean)
          .join(' ')
          .toLowerCase();
        return haystack.includes(search);
      });
    }

    if (filters.country) {
      const q = filters.country.toLowerCase();
      result = result.filter((item) => (item.country || '').toLowerCase().includes(q));
    }
    if (filters.city) {
      const q = filters.city.toLowerCase();
      result = result.filter((item) => (item.city || '').toLowerCase().includes(q));
    }

    if (filters.priceMin) {
      const min = Number(filters.priceMin);
      result = result.filter(
        (item) => Number(String(item.price || 0).replace(/,/g, '')) >= min
      );
    }
    if (filters.priceMax) {
      const max = Number(filters.priceMax);
      result = result.filter(
        (item) => Number(String(item.price || 0).replace(/,/g, '')) <= max
      );
    }

    if (filters.featured || filters.promoted || filters.sponsored) {
      result = result.filter((item) => {
        const checks = [];
        if (filters.featured) {
          checks.push(!!(item.featured || item.is_featured || item.sponsorship_tier === 'plus'));
        }
        if (filters.promoted) {
          checks.push(!!(item.promoted || item.is_promoted || item.sponsorship_tier === 'plus'));
        }
        if (filters.sponsored) {
          checks.push(
            !!(item.sponsored || item.is_sponsored || item.sponsorship_tier === 'premium')
          );
        }
        return checks.some(Boolean);
      });
    }

    return result;
  }, [listings, selectedCategoryId, selectedGroupId, filters]);

  const handleFilterChange = (key, value) => {
    setPendingFilters((prev) => {
      const next = { ...prev, [key]: value };
      if (typeof value === 'boolean' && !value) delete next[key];
      if ((typeof value === 'string' || typeof value === 'number') && value === '') {
        delete next[key];
      }
      return next;
    });
  };

  const applyFilters = () => setFilters({ ...pendingFilters });

  const clearFilters = () => {
    if (isCategoryView) {
      navigate(selectedGroupId ? `/businesses-for-sale?type=${selectedGroupId}` : '/businesses-for-sale');
      return;
    }
    setFilters({});
    setPendingFilters({});
    setTopSearch('');
    if (selectedGroupId) {
      setSearchParams({}, { replace: true });
    }
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

  const handleGroupSelect = (groupId) => {
    const next = new URLSearchParams(searchParams);
    if (!groupId || groupId === selectedGroupId) {
      next.delete('type');
    } else {
      next.set('type', groupId);
    }
    next.delete('postForm');
    setSearchParams(next, { replace: true });
  };

  const handleCategorySelect = (categoryId) => {
    const cat = getCategoryById(categoryId);
    const qs = cat?.group ? `?type=${cat.group}` : selectedGroupId ? `?type=${selectedGroupId}` : '';
    navigate(`/businesses-for-sale/category/${categoryId}${qs}`);
  };

  const handlePostClick = () => {
    if (
      requireAuth(
        DASHBOARD_POST_URL,
        'You must be logged in to list a business for sale.'
      )
    ) {
      navigate(DASHBOARD_POST_URL);
    }
  };

  const theme = getCategoryTheme('investment');

  const filterFields = (
    <StandardListingFilters
      filters={pendingFilters}
      onFilterChange={handleFilterChange}
      onApply={applyFilters}
      onClear={isCategoryView ? clearExtraFilters : clearFilters}
      theme={theme.filterTheme}
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

  return (
    <CategoryPageShell
      categoryId="investment"
      backHref={
        isCategoryView
          ? selectedGroupId
            ? `/businesses-for-sale?type=${selectedGroupId}`
            : '/businesses-for-sale'
          : '/'
      }
      showBackBar
      backBarTo={
        isCategoryView
          ? selectedGroupId
            ? `/businesses-for-sale?type=${selectedGroupId}`
            : '/businesses-for-sale'
          : '/'
      }
      backBarLabel={isCategoryView ? 'Back to Businesses for Sale' : 'Back Home'}
      hero={
        <BusinessesForSaleHero
          categoryLabel={categoryLabel}
          searchValue={topSearch}
          onSearchChange={(e) => setTopSearch(e.target.value)}
          onSearchSubmit={applyTopSearch}
          templatesHref={
            selectedCategoryId
              ? `/businesses-for-sale/templates?category=${selectedCategoryId}&name=${encodeURIComponent(categoryLabel || '')}`
              : '/businesses-for-sale/templates'
          }
          calculatorsHref="/businesses-for-sale/calculators"
        />
      }
      categoryGrid={
        !isCategoryView ? (
          <div className="mb-6">
            <BusinessesForSaleCategoryGrid
              selectedCategoryId={selectedCategoryId}
              selectedGroupId={selectedGroupId}
              onSelectCategory={handleCategorySelect}
              onSelectGroup={handleGroupSelect}
              listingCounts={listingCounts}
              groupCounts={groupCounts}
            />
          </div>
        ) : null
      }
      filterLayoutProps={{
        open: showFilters,
        onOpenChange: setShowFilters,
        onApply: applyFilters,
        onClear: isCategoryView ? clearExtraFilters : clearFilters,
        theme: theme.filterTheme,
        homeHref: '/businesses-for-sale',
        filterFields,
        activeCount: activeFilterCount,
      }}
      bottomCta={{
        buttonLabel: 'List your business for sale',
        onPostClick: handlePostClick,
        theme: theme.ctaTheme,
      }}
    >
      <BusinessesForSaleGrid listings={filteredListings} loading={loading} />
    </CategoryPageShell>
  );
};

export default BusinessesForSaleBrowsePage;
