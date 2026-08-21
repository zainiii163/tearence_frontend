import React, { useCallback, useEffect, useMemo, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import CategoryPageShell from '../Component/shared/CategoryPageShell';
import CompactPremiumReel from '../Component/shared/CompactPremiumReel';
import BrowseMarketplaceHero from '../Component/shared/BrowseMarketplaceHero';
import StandardListingFilters from '../Component/shared/StandardListingFilters';
import { getCategoryTheme } from '../constants/categoryThemes';
import { extractListItems } from '../utils/apiResponseHelpers';
import { featuredAdvertsAPI } from '../api/featuredAdverts';
import sponsoredAdvertsAPI from '../api/sponsoredAdvertsAPI';
import { promotedAdvertsAPI } from '../services/promotedAdvertsAPI';
import { getResponsiveImageProps } from '../utils/responsiveImage';
import { resolveListingImage } from '../utils/resolveImageUrl';
import { FEATURED_DEMO_ADVERTS, FEATURED_DEMO_CATEGORIES } from '../data/featuredDemo';
import { SPONSORED_DEMO_ADVERTS } from '../data/sponsoredDemo';
import { PROMOTED_DEMO_ADVERTS } from '../data/promotedDemo';

const HERO_BG =
  'https://images.unsplash.com/photo-1557804506-669a67965ba0?auto=format&fit=crop&w=1920&q=80';

const FALLBACK_CATEGORIES = FEATURED_DEMO_CATEGORIES.map((c) => ({
  id: c.id || c.category_id,
  name: c.name || c.category_name,
}));

const normalizePost = (item, lane) => {
  if (!item || typeof item !== 'object') return null;
  const id = item.id || item.slug || item.uuid || item.sponsored_advert_id;
  if (!id) return null;
  return {
    ...item,
    id,
    _lane: lane,
    title: item.title || item.name || item.headline || 'Advert',
    slug: item.slug || item.id,
  };
};

const hrefForPost = (item) => {
  const lane = item._lane;
  const slug = item.slug || item.id;
  if (lane === 'sponsored') return `/sponsored-adverts/${slug}`;
  if (lane === 'featured') return `/featured-adverts/${slug}`;
  if (lane === 'promoted') return `/promoted-adverts/${slug}`;
  return `/paid-adverts`;
};

const itemPrice = (item) => {
  const raw = item?.price ?? item?.amount ?? item?.min_price ?? item?.sale_price;
  const n = Number(raw);
  return Number.isFinite(n) ? n : null;
};

const itemMatchesFilters = (item, filters = {}) => {
  if (!item) return false;

  if (filters.search) {
    const q = String(filters.search).toLowerCase().trim();
    const hay = `${item.title || ''} ${item.description || ''} ${item.category_name || ''}`.toLowerCase();
    if (q && !hay.includes(q)) return false;
  }

  if (filters.category) {
    const want = String(filters.category).toLowerCase();
    const id = String(item.category_id || item.category?.id || '').toLowerCase();
    const name = String(
      item.category_name || item.category?.name || item.category || item.source_label || ''
    ).toLowerCase();
    if (id !== want && !name.includes(want) && !id.includes(want)) return false;
  }

  const price = itemPrice(item);
  if (filters.priceMin && price != null && price < Number(filters.priceMin)) return false;
  if (filters.priceMax && price != null && price > Number(filters.priceMax)) return false;
  // If price filter set but item has no price, keep it only when no min/max numeric match needed
  if ((filters.priceMin || filters.priceMax) && price == null) return false;

  if (filters.country) {
    const q = String(filters.country).toLowerCase().trim();
    if (q && !String(item.country || item.location_country || '').toLowerCase().includes(q)) {
      return false;
    }
  }

  if (filters.city) {
    const q = String(filters.city).toLowerCase().trim();
    if (q && !String(item.city || item.town || item.location_city || '').toLowerCase().includes(q)) {
      return false;
    }
  }

  return true;
};

const AdvertCard = ({ item, size = 'md' }) => {
  const image =
    resolveListingImage(item) ||
    item.image_url ||
    item.thumbnail_url ||
    item.cover_image ||
    null;
  const tall = size === 'lg';
  return (
    <Link
      to={hrefForPost(item)}
      className="group flex flex-col overflow-hidden rounded-lg border border-slate-200 bg-white hover:border-violet-300 hover:shadow-md transition-all"
    >
      <div className={`bg-slate-100 overflow-hidden ${tall ? 'h-36 sm:h-44' : 'h-24 sm:h-28'}`}>
        {image ? (
          <img
            {...getResponsiveImageProps(image, { variant: 'thumb' })}
            alt=""
            className="h-full w-full object-cover group-hover:scale-105 transition-transform duration-300"
            loading="lazy"
          />
        ) : (
          <div className="h-full w-full bg-gradient-to-br from-violet-700 to-slate-800" />
        )}
      </div>
      <div className="p-2.5 min-w-0">
        <p className="text-[10px] font-semibold uppercase tracking-wide text-violet-700 truncate">
          {item._lane}
        </p>
        <p className={`font-semibold text-slate-900 line-clamp-2 ${tall ? 'text-sm' : 'text-xs'}`}>
          {item.title}
        </p>
        {(item.city || item.country) && (
          <p className="text-[10px] text-slate-500 mt-0.5 truncate">
            {[item.city, item.country].filter(Boolean).join(', ')}
          </p>
        )}
      </div>
    </Link>
  );
};

/**
 * Clive: dedicated page for paid longer placements.
 * Filters: Category → Price → Location → Type of advert (featured / promoted / sponsored).
 */
const AdvertsHubPage = () => {
  const theme = getCategoryTheme('adverts') || getCategoryTheme('sponsored');
  const navigate = useNavigate();

  const [featured, setFeatured] = useState([]);
  const [sponsored, setSponsored] = useState([]);
  const [promoted, setPromoted] = useState([]);
  const [categories, setCategories] = useState(FALLBACK_CATEGORIES);
  const [loading, setLoading] = useState(true);

  const [filters, setFilters] = useState({});
  const [pendingFilters, setPendingFilters] = useState({});
  const [showFilters, setShowFilters] = useState(true);
  const [topSearch, setTopSearch] = useState('');

  useEffect(() => {
    let cancelled = false;
    const load = async () => {
      setLoading(true);
      try {
        const [featuredRes, sponsoredRes, promotedRes, catRes] = await Promise.all([
          featuredAdvertsAPI.getSiteFeed({ per_page: 24 }).catch(() =>
            featuredAdvertsAPI.getFeaturedAdverts({ per_page: 24 }).catch(() => null)
          ),
          sponsoredAdvertsAPI.getSiteFeed({ per_page: 16 }).catch(() =>
            sponsoredAdvertsAPI.getSponsoredAdverts({ per_page: 16 }).catch(() => null)
          ),
          promotedAdvertsAPI.getAdverts({ per_page: 24 }).catch(() => null),
          featuredAdvertsAPI.getCategoryGrid().catch(() => null),
        ]);

        if (cancelled) return;

        const featuredLive = extractListItems(featuredRes)
          .map((i) => normalizePost(i, 'featured'))
          .filter(Boolean);
        const sponsoredLive = extractListItems(sponsoredRes)
          .map((i) => normalizePost(i, 'sponsored'))
          .filter(Boolean);
        const promotedLive = extractListItems(promotedRes)
          .map((i) => normalizePost(i, 'promoted'))
          .filter(Boolean);

        setFeatured(
          featuredLive.length
            ? featuredLive
            : FEATURED_DEMO_ADVERTS.map((i) => normalizePost(i, 'featured')).filter(Boolean)
        );
        setSponsored(
          sponsoredLive.length
            ? sponsoredLive
            : SPONSORED_DEMO_ADVERTS.map((i) => normalizePost(i, 'sponsored')).filter(Boolean)
        );
        setPromoted(
          promotedLive.length
            ? promotedLive
            : PROMOTED_DEMO_ADVERTS.map((i) => normalizePost(i, 'promoted')).filter(Boolean)
        );

        const catRows = catRes?.data || catRes || [];
        const liveCats = (Array.isArray(catRows) ? catRows : [])
          .map((c) => ({
            id: c.id ?? c.category_id ?? c.slug,
            name: c.name || c.category_name || c.label,
          }))
          .filter((c) => c.id && c.name);
        setCategories(liveCats.length ? liveCats : FALLBACK_CATEGORIES);
      } catch {
        if (!cancelled) {
          setFeatured(FEATURED_DEMO_ADVERTS.map((i) => normalizePost(i, 'featured')).filter(Boolean));
          setSponsored(SPONSORED_DEMO_ADVERTS.map((i) => normalizePost(i, 'sponsored')).filter(Boolean));
          setPromoted(PROMOTED_DEMO_ADVERTS.map((i) => normalizePost(i, 'promoted')).filter(Boolean));
          setCategories(FALLBACK_CATEGORIES);
        }
      } finally {
        if (!cancelled) setLoading(false);
      }
    };
    load();
    return () => {
      cancelled = true;
    };
  }, []);

  const handleFilterChange = useCallback((key, value) => {
    setPendingFilters((prev) => {
      const next = { ...prev, [key]: value };
      if (value === '' || value === false || value == null) delete next[key];
      return next;
    });
  }, []);

  const applyFilters = useCallback(() => {
    setFilters({ ...pendingFilters });
  }, [pendingFilters]);

  const clearFilters = useCallback(() => {
    setFilters({});
    setPendingFilters({});
    setTopSearch('');
  }, []);

  const applyTopSearch = useCallback(() => {
    const next = { ...pendingFilters };
    if (topSearch.trim()) next.search = topSearch.trim();
    else delete next.search;
    setPendingFilters(next);
    setFilters(next);
  }, [pendingFilters, topSearch]);

  const activeFilterCount = useMemo(
    () =>
      Object.entries(filters).filter(([, v]) => {
        if (typeof v === 'boolean') return v;
        return v !== '' && v != null;
      }).length,
    [filters]
  );

  const typeFilterActive = Boolean(filters.featured || filters.promoted || filters.sponsored);

  const filteredFeatured = useMemo(() => {
    if (typeFilterActive && !filters.featured) return [];
    return featured.filter((item) => itemMatchesFilters(item, filters));
  }, [featured, filters, typeFilterActive]);

  const filteredPromoted = useMemo(() => {
    if (typeFilterActive && !filters.promoted) return [];
    return promoted.filter((item) => itemMatchesFilters(item, filters));
  }, [promoted, filters, typeFilterActive]);

  const filteredSponsored = useMemo(() => {
    if (typeFilterActive && !filters.sponsored) return [];
    return sponsored.filter((item) => itemMatchesFilters(item, filters));
  }, [sponsored, filters, typeFilterActive]);

  const promotedRows = filteredPromoted.slice(0, 12);
  const listingPool = useMemo(() => {
    // When filtering by type, surface matching items in the listings grid too
    const pool = [];
    if (!typeFilterActive || filters.featured) pool.push(...filteredFeatured);
    if (!typeFilterActive || filters.promoted) pool.push(...filteredPromoted);
    if (!typeFilterActive || filters.sponsored) pool.push(...filteredSponsored);
    // Dedupe by id
    const seen = new Set();
    return pool.filter((item) => {
      const key = String(item.id);
      if (seen.has(key)) return false;
      seen.add(key);
      return true;
    });
  }, [
    filteredFeatured,
    filteredPromoted,
    filteredSponsored,
    filters.featured,
    filters.promoted,
    filters.sponsored,
    typeFilterActive,
  ]);

  const filterFields = (
    <StandardListingFilters
      filters={pendingFilters}
      onFilterChange={handleFilterChange}
      onApply={applyFilters}
      onClear={clearFilters}
      theme={theme.filterTheme || 'purple'}
      categoryOptions={categories}
      asPanel={false}
      showActions={false}
      showTitle={false}
    />
  );

  const emptyAfterFilter =
    !loading &&
    activeFilterCount > 0 &&
    filteredFeatured.length === 0 &&
    filteredPromoted.length === 0 &&
    filteredSponsored.length === 0;

  return (
    <CategoryPageShell
      categoryId="adverts"
      backHref="/"
      showBackBar
      backBarTo="/"
      backBarLabel="Back Home"
      hero={
        <BrowseMarketplaceHero
          title="Adverts"
          eyebrow=""
          imageUrl={HERO_BG}
          theme={theme.heroTheme || 'violet'}
          searchPlaceholder="Search paid adverts…"
          searchValue={topSearch}
          onSearchChange={(e) => setTopSearch(e.target.value)}
          onSearchSubmit={applyTopSearch}
          templatesHref="/adverts/templates"
          calculatorsHref="/adverts/calculators"
        />
      }
      filterLayoutProps={{
        open: showFilters,
        onOpenChange: setShowFilters,
        onApply: applyFilters,
        onClear: clearFilters,
        theme: theme.filterTheme || 'purple',
        homeHref: '/adverts',
        filterFields,
        activeCount: activeFilterCount,
      }}
      bottomCta={{
        buttonLabel: 'Post an advert',
        onPostClick: () => navigate('/post-ad'),
        theme: theme.ctaTheme || 'purple',
        buttonOnly: true,
      }}
    >
      {loading ? (
        <div className="space-y-4">
          <div className="h-28 rounded-xl bg-slate-100 animate-pulse" />
          <div className="grid grid-cols-3 gap-3">
            {[1, 2, 3, 4, 5, 6].map((i) => (
              <div key={i} className="h-36 rounded-xl bg-slate-100 animate-pulse" />
            ))}
          </div>
        </div>
      ) : emptyAfterFilter ? (
        <div className="rounded-xl border border-dashed border-slate-200 bg-slate-50 px-4 py-10 text-center">
          <p className="text-sm font-semibold text-slate-800">No adverts match these filters</p>
          <p className="text-xs text-slate-500 mt-1">Try another category, price, location, or advert type.</p>
          <button
            type="button"
            onClick={clearFilters}
            className="mt-4 text-sm font-semibold text-violet-700 hover:underline"
          >
            Clear filters
          </button>
        </div>
      ) : (
        <div className="space-y-8">
          {filteredFeatured.length > 0 && (
            <CompactPremiumReel
              items={filteredFeatured}
              title="Featured"
              getHref={hrefForPost}
              accentClass={theme.accentText || 'text-amber-700'}
              borderAccent="hover:border-amber-300"
            />
          )}

          {promotedRows.length > 0 && (
            <section>
              <div className="flex flex-col sm:flex-row sm:items-center justify-center sm:justify-between gap-1 mb-2 text-center sm:text-left">
                <h2 className="text-sm font-bold text-slate-900 w-full text-center">Promoted</h2>
                <Link
                  to="/promoted-adverts"
                  className="text-xs font-semibold text-violet-700 hover:underline text-center sm:text-right shrink-0"
                >
                  View all
                </Link>
              </div>
              <div className="grid grid-cols-2 sm:grid-cols-3 xl:grid-cols-4 gap-2.5">
                {promotedRows.map((item) => (
                  <AdvertCard key={item.id} item={item} size="lg" />
                ))}
              </div>
            </section>
          )}

          {filteredSponsored.length > 0 && (
            <section>
              <div className="flex flex-col sm:flex-row sm:items-center justify-center sm:justify-between gap-1 mb-2">
                <h2 className="text-sm font-bold text-slate-900 w-full text-center">Sponsored</h2>
                <Link
                  to="/sponsored-adverts"
                  className="text-xs font-semibold text-violet-700 hover:underline text-center sm:text-right shrink-0"
                >
                  View all
                </Link>
              </div>
              <div className="grid grid-cols-2 sm:grid-cols-3 xl:grid-cols-4 gap-2.5">
                {filteredSponsored.slice(0, 8).map((item) => (
                  <AdvertCard key={`sp-${item.id}`} item={item} size="lg" />
                ))}
              </div>
            </section>
          )}

          <section>
            <h2 className="text-sm font-bold text-slate-900 mb-2 text-center">
              {activeFilterCount > 0 ? 'Matching adverts' : 'Listings'}
            </h2>
            <p className="text-xs text-slate-500 mb-3 text-center">
              Filter by category, price, location, and type (featured, promoted, or sponsored).
            </p>
            {listingPool.length ? (
              <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-2">
                {listingPool.map((item) => (
                  <AdvertCard key={`list-${item._lane}-${item.id}`} item={item} size="sm" />
                ))}
              </div>
            ) : (
              <div className="rounded-xl border border-dashed border-slate-200 bg-slate-50 px-4 py-8 text-center text-sm text-slate-600">
                Standard listings will appear here.
              </div>
            )}
          </section>
        </div>
      )}
    </CategoryPageShell>
  );
};

export default AdvertsHubPage;
