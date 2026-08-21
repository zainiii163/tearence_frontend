import React, { useEffect, useMemo, useState } from 'react';
import { Link } from 'react-router-dom';
import CategoryPageShell from '../Component/shared/CategoryPageShell';
import CompactPremiumReel from '../Component/shared/CompactPremiumReel';
import BrowseMarketplaceHero from '../Component/shared/BrowseMarketplaceHero';
import { getCategoryTheme } from '../constants/categoryThemes';
import { extractListItems } from '../utils/apiResponseHelpers';
import { featuredAdvertsAPI } from '../api/featuredAdverts';
import sponsoredAdvertsAPI from '../api/sponsoredAdvertsAPI';
import { promotedAdvertsAPI } from '../services/promotedAdvertsAPI';
import { getResponsiveImageProps } from '../utils/responsiveImage';
import { resolveListingImage } from '../utils/resolveImageUrl';
import { FEATURED_DEMO_ADVERTS } from '../data/featuredDemo';
import { SPONSORED_DEMO_ADVERTS } from '../data/sponsoredDemo';
import { PROMOTED_DEMO_ADVERTS } from '../data/promotedDemo';

const HERO_BG =
  'https://images.unsplash.com/photo-1557804506-669a67965ba0?auto=format&fit=crop&w=1920&q=80';

const normalizePost = (item, lane) => {
  if (!item || typeof item !== 'object') return null;
  const id = item.id || item.slug || item.uuid;
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
      </div>
    </Link>
  );
};

/**
 * Clive: dedicated page for paid longer placements.
 * Featured slider (top) → Sponsored (sides) + Promoted (middle rows) → paid listings below.
 */
const AdvertsHubPage = () => {
  const theme = getCategoryTheme('adverts') || getCategoryTheme('sponsored');
  const [featured, setFeatured] = useState([]);
  const [sponsored, setSponsored] = useState([]);
  const [promoted, setPromoted] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let cancelled = false;
    const load = async () => {
      setLoading(true);
      try {
        const [featuredRes, sponsoredRes, promotedRes] = await Promise.all([
          featuredAdvertsAPI.getSiteFeed({ per_page: 12 }).catch(() =>
            featuredAdvertsAPI.getFeaturedAdverts({ per_page: 12 }).catch(() => null)
          ),
          sponsoredAdvertsAPI.getSiteFeed({ per_page: 8 }).catch(() =>
            sponsoredAdvertsAPI.getSponsoredAdverts({ per_page: 8 }).catch(() => null)
          ),
          promotedAdvertsAPI.getAdverts({ per_page: 12 }).catch(() => null),
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
      } catch {
        if (!cancelled) {
          setFeatured(FEATURED_DEMO_ADVERTS.map((i) => normalizePost(i, 'featured')).filter(Boolean));
          setSponsored(SPONSORED_DEMO_ADVERTS.map((i) => normalizePost(i, 'sponsored')).filter(Boolean));
          setPromoted(PROMOTED_DEMO_ADVERTS.map((i) => normalizePost(i, 'promoted')).filter(Boolean));
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

  const paidBelow = useMemo(() => [], []);

  const promotedRows = promoted.slice(0, 8);
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
          templatesHref="/adverts/templates"
          calculatorsHref="/adverts/calculators"
        />
      }
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
      ) : (
        <div className="space-y-8">
          {featured.length > 0 && (
            <CompactPremiumReel
              items={featured}
              title="Featured"
              getHref={hrefForPost}
              accentClass={theme.accentText || 'text-amber-700'}
              borderAccent="hover:border-amber-300"
            />
          )}

          <section>
            <div className="flex items-center justify-between mb-2">
              <h2 className="text-sm font-bold text-slate-900">Promoted</h2>
              <Link
                to="/promoted-adverts"
                className="text-xs font-semibold text-violet-700 hover:underline"
              >
                View all
              </Link>
            </div>
            {promotedRows.length ? (
              <div className="grid grid-cols-2 sm:grid-cols-3 xl:grid-cols-4 gap-2.5">
                {promotedRows.map((item) => (
                  <AdvertCard key={item.id} item={item} size="lg" />
                ))}
              </div>
            ) : (
              <div className="rounded-xl border border-dashed border-slate-200 bg-slate-50 px-4 py-10 text-center text-sm text-slate-600">
                Promoted listings appear here above standard placements.
              </div>
            )}
          </section>

          <section>
            <h2 className="text-sm font-bold text-slate-900 mb-2">Listings</h2>
            <p className="text-xs text-slate-500 mb-3">
              Standard placements across Worldwide Adverts. Sponsored ads show on the viewed advert page.
            </p>
            {paidBelow.length ? (
              <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-2">
                {paidBelow.map((item) => (
                  <AdvertCard key={`paid-${item.id}`} item={item} size="sm" />
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
