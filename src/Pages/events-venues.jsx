import React, { useState, useEffect, useCallback, useMemo } from 'react';
import { Link, useNavigate, useSearchParams } from 'react-router-dom';
import { isAuthenticated as hasToken } from '../utils/auth';
import { useAuthRedirect } from '../hooks/useAuthRedirect';
import EventsVenuesHero from '../Component/events-venues/EventsVenuesHero';
import EventsVenuesCard from '../Component/events-venues/EventsVenuesCard';
import EventsVenuesCategoryGrid from '../Component/events-venues/EventsVenuesCategoryGrid';
import StandardListingFilters from '../Component/shared/StandardListingFilters';
import CategoryPageShell from '../Component/shared/CategoryPageShell';
import CompactPremiumReel from '../Component/shared/CompactPremiumReel';
import BrowsePromotionLanes from '../Component/shared/BrowsePromotionLanes';
import { getCategoryTheme } from '../constants/categoryThemes';
import eventsVenuesAPI from '../services/eventsVenuesAPI';
import { pickPremiumForReel, splitListingsByPromotion } from '../utils/listingPromotionSort';
import { DEMO_EVENTS, DEMO_VENUES } from '../data/eventsVenuesDemo';

const hasActiveFilters = (activeFilters = {}) =>
  Object.entries(activeFilters).some(([, value]) => {
    if (typeof value === 'boolean') return value;
    return value !== '' && value != null;
  });

/**
 * mode: 'home' | 'events' | 'venues'
 * Explore pages match Buy & Sell pattern: hero → chips → filters → grid → List CTA.
 */
const EventsVenuesPage = ({ mode = 'home', initialCategoryId = null }) => {
  const navigate = useNavigate();
  const { requireAuth, isAuthenticated } = useAuthRedirect();
  const [searchParams, setSearchParams] = useSearchParams();
  const viewType = mode === 'venues' ? 'venue' : 'event';
  const isHome = mode === 'home';
  const basePath = mode === 'venues' ? '/events-venues/venues' : '/events-venues/events';

  const [adverts, setAdverts] = useState([]);
  const [homeEvents, setHomeEvents] = useState([]);
  const [homeVenues, setHomeVenues] = useState([]);
  const [categories, setCategories] = useState([]);
  const [categoriesLoading, setCategoriesLoading] = useState(true);
  const [loading, setLoading] = useState(true);
  const [savedAdverts, setSavedAdverts] = useState([]);
  const [selectedCategoryId, setSelectedCategoryId] = useState(
    initialCategoryId || searchParams.get('category_id') || null
  );
  const [categoryName, setCategoryName] = useState('');
  const [filters, setFilters] = useState({});
  const [pendingFilters, setPendingFilters] = useState({});
  const [showFilters, setShowFilters] = useState(true);
  const [topSearch, setTopSearch] = useState(searchParams.get('search') || '');

  const isCategoryView = Boolean(selectedCategoryId);

  useEffect(() => {
    if (initialCategoryId) setSelectedCategoryId(initialCategoryId);
  }, [initialCategoryId]);

  useEffect(() => {
    if (!selectedCategoryId) {
      setCategoryName('');
      return;
    }
    const match = categories.find((c) => String(c.id) === String(selectedCategoryId));
    setCategoryName(match?.name || 'Category');
  }, [selectedCategoryId, categories]);

  const loadCategories = useCallback(async () => {
    setCategoriesLoading(true);
    try {
      const params = isHome ? {} : { type: viewType };
      const categoriesRes = await eventsVenuesAPI.getCategories(params);
      const list = categoriesRes.data || categoriesRes || [];
      setCategories(Array.isArray(list) ? list : []);
    } catch (error) {
      console.error('Error loading categories:', error);
      setCategories([]);
    } finally {
      setCategoriesLoading(false);
    }
  }, [isHome, viewType]);

  const extractRows = (response) => {
    const payload = response?.data || response;
    return payload?.data || (Array.isArray(payload) ? payload : []) || [];
  };

  const applyClientFilters = (rows, activeFilters) => {
    let next = [...rows];
    if (activeFilters.featured || activeFilters.promoted || activeFilters.sponsored) {
      next = next.filter((ad) => {
        const checks = [];
        if (activeFilters.featured) checks.push(!!(ad.featured || ad.is_featured));
        if (activeFilters.promoted) checks.push(!!(ad.promoted || ad.is_promoted));
        if (activeFilters.sponsored) checks.push(!!(ad.sponsored || ad.is_sponsored));
        return checks.some(Boolean);
      });
    }
    if (activeFilters.city) {
      const q = String(activeFilters.city).toLowerCase();
      next = next.filter((ad) => (ad.city || ad.location || '').toLowerCase().includes(q));
    }
    if (activeFilters.country) {
      const q = String(activeFilters.country).toLowerCase();
      next = next.filter((ad) => (ad.country || '').toLowerCase().includes(q));
    }
    if (activeFilters.search) {
      const q = String(activeFilters.search).toLowerCase();
      next = next.filter((ad) =>
        `${ad.title} ${ad.description || ''} ${ad.city || ''}`.toLowerCase().includes(q)
      );
    }
    if (activeFilters.priceMin) {
      const min = Number(activeFilters.priceMin);
      if (!Number.isNaN(min)) next = next.filter((ad) => Number(ad.price || 0) >= min);
    }
    if (activeFilters.priceMax) {
      const max = Number(activeFilters.priceMax);
      if (!Number.isNaN(max)) next = next.filter((ad) => Number(ad.price || 0) <= max);
    }
    return next;
  };

  const loadAdverts = useCallback(async () => {
    setLoading(true);
    try {
      if (isHome) {
        const shared = {
          page: 1,
          per_page: 24,
          search: filters.search || undefined,
          country: filters.country || undefined,
          city: filters.city || undefined,
        };
        if (filters.priceMin) shared.price_min = filters.priceMin;
        if (filters.priceMax) shared.price_max = filters.priceMax;

        const [eventsRes, venuesRes] = await Promise.all([
          eventsVenuesAPI.getAdverts({ ...shared, advert_type: 'event' }).catch(() => null),
          eventsVenuesAPI.getAdverts({ ...shared, advert_type: 'venue' }).catch(() => null),
        ]);
        const eventsRaw = applyClientFilters(extractRows(eventsRes), filters);
        const venuesRaw = applyClientFilters(extractRows(venuesRes), filters);
        setHomeEvents((eventsRaw.length ? eventsRaw : DEMO_EVENTS).slice(0, 6));
        setHomeVenues((venuesRaw.length ? venuesRaw : DEMO_VENUES).slice(0, 6));
        setAdverts([]);
        return;
      }

      const params = {
        advert_type: viewType,
        page: 1,
        per_page: 24,
        search: filters.search || undefined,
        country: filters.country || undefined,
        city: filters.city || undefined,
        category_id: selectedCategoryId || undefined,
      };
      if (filters.priceMin) params.price_min = filters.priceMin;
      if (filters.priceMax) params.price_max = filters.priceMax;

      const response = await eventsVenuesAPI.getAdverts(params);
      const rows = applyClientFilters(extractRows(response), filters);
      const demos = viewType === 'venue' ? DEMO_VENUES : DEMO_EVENTS;
      setAdverts(rows.length ? rows : demos);
    } catch (error) {
      console.error('Error loading adverts:', error);
      if (isHome) {
        setHomeEvents(DEMO_EVENTS.slice(0, 6));
        setHomeVenues(DEMO_VENUES.slice(0, 6));
      } else {
        setAdverts(viewType === 'venue' ? DEMO_VENUES : DEMO_EVENTS);
      }
    } finally {
      setLoading(false);
    }
  }, [isHome, viewType, filters, selectedCategoryId]);

  useEffect(() => {
    loadCategories();
  }, [loadCategories]);

  useEffect(() => {
    loadAdverts();
  }, [loadAdverts]);

  useEffect(() => {
    if (!hasToken()) {
      setSavedAdverts([]);
      return;
    }
    (async () => {
      try {
        const savedRes = await eventsVenuesAPI.getSavedAdverts();
        setSavedAdverts(savedRes.data?.data || savedRes.data || []);
      } catch {
        setSavedAdverts([]);
      }
    })();
  }, [isAuthenticated]);

  const handleFilterChange = (filterName, value) => {
    setPendingFilters((prev) => {
      const next = { ...prev, [filterName]: value };
      if (typeof value === 'boolean' && !value) delete next[filterName];
      if ((typeof value === 'string' || typeof value === 'number') && value === '') delete next[filterName];
      return next;
    });
  };

  const applyFilters = () => setFilters({ ...pendingFilters });

  const clearFilters = () => {
    if (isCategoryView) {
      navigate(basePath);
      setSelectedCategoryId(null);
      setSearchParams({});
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

  const handleCategorySelect = (categoryId) => {
    setSelectedCategoryId(categoryId);
    navigate(`${basePath}/category/${categoryId}`);
  };

  const isSaved = (advertId) =>
    savedAdverts.some((saved) => saved.advert_id === advertId || saved.id === advertId);

  const handlePostClick = (typeOverride) => {
    const type =
      typeOverride === 'venue' || typeOverride === 'event'
        ? typeOverride
        : mode === 'venues'
          ? 'venue'
          : 'event';
    const path = `/events-venues/post?type=${type}`;
    requireAuth(
      path,
      type === 'venue'
        ? 'You must be logged in to post a venue.'
        : 'You must be logged in to post an event.'
    ) && navigate(path);
  };

  const handleSaveAdvert = async (advertId) => {
    const returnPath = isHome
      ? '/events-venues'
      : `/events-venues/${mode === 'venues' ? 'venues' : 'events'}`;
    if (!requireAuth(returnPath, 'You must be logged in to save listings.')) {
      return;
    }
    try {
      await eventsVenuesAPI.saveAdvert(advertId);
      const savedRes = await eventsVenuesAPI.getSavedAdverts();
      setSavedAdverts(savedRes.data?.data || savedRes.data || []);
      loadAdverts();
    } catch (error) {
      console.error('Error saving advert:', error);
    }
  };

  const handleHomeCategorySelect = (categoryId, category) => {
    const isVenue = category?.type === 'venue';
    navigate(
      isVenue
        ? `/events-venues/venues/category/${categoryId}`
        : `/events-venues/events/category/${categoryId}`
    );
  };

  const theme = getCategoryTheme('events');

  const reelItems = useMemo(() => {
    const pool = isHome
      ? [...homeEvents, ...homeVenues]
      : adverts;
    return pickPremiumForReel(pool, { limit: 12, allowFallback: false });
  }, [isHome, homeEvents, homeVenues, adverts]);

  const { promoted, regular } = useMemo(
    () => splitListingsByPromotion(adverts),
    [adverts]
  );

  const paidAdverts = useMemo(() => {
    const featuredIds = new Set(reelItems.map((i) => String(i.id)));
    return regular.filter((a) => !featuredIds.has(String(a.id)));
  }, [regular, reelItems]);

  const renderEventsGrid = (list) => (
    <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
      {list.map((advert) => (
        <EventsVenuesCard
          key={advert.id}
          advert={advert}
          onSave={handleSaveAdvert}
          isSaved={isSaved(advert.id)}
          featured={!!(advert.featured || advert.is_featured)}
        />
      ))}
    </div>
  );

  const filterFields = (
    <StandardListingFilters
      filters={pendingFilters}
      onFilterChange={handleFilterChange}
      onApply={applyFilters}
      onClear={isCategoryView ? clearExtraFilters : clearFilters}
      theme={theme.filterTheme}
      asPanel={false}
      showActions={false}
      showTitle={false}
    />
  );

  const activeFilterCount = Object.entries(filters).filter(([, v]) => {
    if (typeof v === 'boolean') return v;
    return v !== '' && v != null;
  }).length;

  const backHref = isHome ? '/' : isCategoryView ? basePath : '/events-venues';
  const backBarLabel = isHome
    ? 'Back Home'
    : isCategoryView
      ? 'Back to Entertainment'
      : 'Back to Entertainment';

  return (
    <CategoryPageShell
      categoryId="events"
      backHref={backHref}
      showBackBar
      backBarTo={backHref}
      backBarLabel={backBarLabel}
      className="flex flex-col"
      contentClassName="page-container py-4 sm:py-6 flex-1"
      hero={
        <EventsVenuesHero
          mode={mode}
          categoryLabel={isCategoryView ? categoryName : null}
          searchValue={topSearch}
          onSearchChange={(e) => setTopSearch(e.target.value)}
          onSearchSubmit={applyTopSearch}
        />
      }
      categoryGrid={
        isHome ? (
          <EventsVenuesCategoryGrid
            categories={categories}
            showAll
            onSelectCategory={handleHomeCategorySelect}
            loading={categoriesLoading}
            title="Popular categories"
          />
        ) : !isCategoryView ? (
          <EventsVenuesCategoryGrid
            categories={categories}
            viewType={viewType}
            selectedCategoryId={selectedCategoryId}
            onSelectCategory={handleCategorySelect}
            loading={categoriesLoading}
          />
        ) : null
      }
      premiumReel={
        reelItems.length > 0 ? (
          <CompactPremiumReel
            items={reelItems}
            title="Featured"
            getHref={(item) => `/events-venues/${item.slug || item.id}`}
            accentClass={theme.accentText || 'text-purple-700'}
            borderAccent="hover:border-purple-300"
          />
        ) : null
      }
      filterLayoutProps={{
        open: showFilters,
        onOpenChange: setShowFilters,
        onApply: applyFilters,
        onClear: isHome ? clearExtraFilters : isCategoryView ? clearExtraFilters : clearFilters,
        theme: theme.filterTheme,
        homeHref: isHome ? '/events-venues' : basePath,
        filterFields,
        activeCount: activeFilterCount,
      }}
      bottomCta={
        isHome ? null : {
          buttonLabel: mode === 'venues' ? 'List your venues' : 'List your events',
          onPostClick: handlePostClick,
          theme: theme.ctaTheme,
          buttonOnly: true,
        }
      }
    >
      {isHome ? (
        <>
              {hasActiveFilters(filters) &&
                !loading &&
                homeEvents.length === 0 &&
                homeVenues.length === 0 && (
                  <div className="mb-4">
                    <button
                      type="button"
                      onClick={clearExtraFilters}
                      className="text-xs font-medium text-purple-700 hover:text-purple-900"
                    >
                      Clear and show all
                    </button>
                  </div>
                )}

              {loading ? (
                <div className="text-center py-12">
                  <div className="inline-block h-10 w-10 animate-spin rounded-full border-4 border-purple-600 border-r-transparent" />
                </div>
              ) : homeEvents.length === 0 && homeVenues.length === 0 ? (
                <div className="text-center py-10 bg-white rounded-xl border border-gray-200">
                  <h3 className="text-base font-semibold text-gray-900 mb-2">No listings found</h3>
                  <p className="text-sm text-gray-600 mb-4">Try changing your filters</p>
                  <button
                    type="button"
                    onClick={clearExtraFilters}
                    className="px-4 py-2 text-sm bg-purple-600 text-white rounded-lg hover:bg-purple-700"
                  >
                    Reset
                  </button>
                </div>
              ) : (
                <div className="space-y-8">
                  {homeEvents.length > 0 && (
                    <section>
                      <div className="flex flex-col items-center text-center gap-1 mb-3">
                        <div>
                          <p className="text-[10px] font-semibold uppercase tracking-wider text-purple-700">
                            Happening soon
                          </p>
                          <h2 className="text-sm sm:text-base font-bold text-gray-900">
                            Featured events
                          </h2>
                        </div>
                        <Link
                          to="/events-venues/events"
                          className="text-xs font-semibold text-purple-700 hover:underline shrink-0"
                        >
                          View all
                        </Link>
                      </div>
                      <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-4">
                        {homeEvents.map((advert) => (
                          <EventsVenuesCard
                            key={advert.id}
                            advert={advert}
                            onSave={handleSaveAdvert}
                            isSaved={isSaved(advert.id)}
                            featured={!!(advert.featured || advert.is_featured)}
                          />
                        ))}
                      </div>
                    </section>
                  )}

                  {homeVenues.length > 0 && (
                    <section>
                      <div className="flex flex-col items-center text-center gap-1 mb-3">
                        <div>
                          <p className="text-[10px] font-semibold uppercase tracking-wider text-indigo-700">
                            Spaces for hire
                          </p>
                          <h2 className="text-sm sm:text-base font-bold text-gray-900">
                            Featured venues
                          </h2>
                        </div>
                        <Link
                          to="/events-venues/venues"
                          className="text-xs font-semibold text-indigo-700 hover:underline shrink-0"
                        >
                          View all
                        </Link>
                      </div>
                      <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-4">
                        {homeVenues.map((advert) => (
                          <EventsVenuesCard
                            key={advert.id}
                            advert={advert}
                            onSave={handleSaveAdvert}
                            isSaved={isSaved(advert.id)}
                            featured={!!(advert.featured || advert.is_featured)}
                          />
                        ))}
                      </div>
                    </section>
                  )}
                </div>
              )}

              <div className="mt-8 mb-2 flex flex-wrap items-center justify-center gap-3">
                <button
                  type="button"
                  onClick={() => handlePostClick('event')}
                  className="inline-flex items-center justify-center px-6 py-3 text-sm font-bold rounded-xl shadow-md bg-purple-700 hover:bg-purple-800 text-white transition-colors"
                >
                  Post an event
                </button>
                <button
                  type="button"
                  onClick={() => handlePostClick('venue')}
                  className="inline-flex items-center justify-center px-6 py-3 text-sm font-bold rounded-xl shadow-md bg-indigo-700 hover:bg-indigo-800 text-white transition-colors"
                >
                  Post a venue
                </button>
              </div>
          </>
        ) : (
          <>
              {hasActiveFilters(filters) && !loading && adverts.length === 0 && (
                <div className="mb-4">
                  <button
                    type="button"
                    onClick={clearExtraFilters}
                    className="text-xs font-medium text-purple-700 hover:text-purple-900"
                  >
                    Clear and show all
                  </button>
                </div>
              )}

              {loading ? (
                <div className="text-center py-12">
                  <div className="inline-block h-10 w-10 animate-spin rounded-full border-4 border-purple-600 border-r-transparent" />
                </div>
              ) : adverts.length === 0 ? (
                <div className="text-center py-10 bg-white rounded-xl border border-gray-200">
                  <h3 className="text-base font-semibold text-gray-900 mb-2">
                    No {mode === 'venues' ? 'venues' : 'events'} found
                  </h3>
                  <p className="text-sm text-gray-600 mb-4">Try changing your selection</p>
                  <button
                    type="button"
                    onClick={clearExtraFilters}
                    className="px-4 py-2 text-sm bg-purple-600 text-white rounded-lg hover:bg-purple-700"
                  >
                    Reset
                  </button>
                </div>
              ) : (
                <BrowsePromotionLanes
                  promoted={promoted}
                  paid={paidAdverts.length ? paidAdverts : adverts}
                  maxPromoted={9}
                  renderGrid={renderEventsGrid}
                />
              )}
          </>
        )}
    </CategoryPageShell>
  );
};

export default EventsVenuesPage;
