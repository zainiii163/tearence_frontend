import React, { useEffect, useMemo, useState } from 'react';
import { Link } from 'react-router-dom';
import { FaBullhorn, FaStar, FaRocket, FaImage, FaArrowRight, FaLayerGroup } from 'react-icons/fa';
import CategoryPageShell from '../Component/shared/CategoryPageShell';
import CompactPremiumReel from '../Component/shared/CompactPremiumReel';
import { getCategoryTheme } from '../constants/categoryThemes';
import { withImageWidth } from '../utils/responsiveImage';
import { extractListItems } from '../utils/apiResponseHelpers';
import { pickPremiumForReel } from '../utils/listingPromotionSort';
import { featuredAdvertsAPI } from '../api/featuredAdverts';
import sponsoredAdvertsAPI from '../api/sponsoredAdvertsAPI';
import { promotedAdvertsAPI } from '../services/promotedAdvertsAPI';

const HERO_BG =
  'https://images.unsplash.com/photo-1557804506-669a67965ba0?auto=format&fit=crop&w=1920&q=80';

/** Clive: Sponsored | Featured | Paid (promoted + banners) — fewer top-level pages */
const ADVERT_GROUPS = [
  {
    id: 'sponsored',
    name: 'Sponsored',
    description: 'Premium placements with maximum visibility across Worldwide Adverts.',
    to: '/sponsored-adverts',
    icon: FaBullhorn,
    accent: 'from-[#036aa1] to-[#075179]',
    border: 'border-sky-200',
    postTo: '/sponsored-adverts?postForm=true',
  },
  {
    id: 'featured',
    name: 'Featured',
    description: 'Highlighted listings that stay at the top of category results.',
    to: '/featured-adverts',
    icon: FaStar,
    accent: 'from-amber-500 to-amber-700',
    border: 'border-amber-200',
    postTo: '/featured-adverts?postForm=true',
  },
  {
    id: 'paid',
    name: 'Paid Adverts',
    description: 'Promoted campaigns and banner inventory — grouped in one paid hub.',
    to: '/paid-adverts',
    icon: FaLayerGroup,
    accent: 'from-rose-600 to-slate-800',
    border: 'border-rose-200',
    postTo: '/paid-adverts?tab=promoted',
    children: [
      { label: 'Promoted', to: '/paid-adverts?tab=promoted', icon: FaRocket },
      { label: 'Banners', to: '/paid-adverts?tab=banners', icon: FaImage },
    ],
  },
];

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
  return '/paid-adverts';
};

/**
 * Adverts hub — Clive grouping: Sponsored, Featured, Paid Adverts.
 */
const AdvertsHubPage = () => {
  const theme = getCategoryTheme('adverts') || getCategoryTheme('sponsored');
  const [posts, setPosts] = useState([]);
  const [loadingPosts, setLoadingPosts] = useState(true);

  useEffect(() => {
    let cancelled = false;

    const load = async () => {
      setLoadingPosts(true);
      try {
        const [featuredRes, sponsoredRes, promotedRes] = await Promise.all([
          featuredAdvertsAPI.getSiteFeed({ per_page: 8 }).catch(() =>
            featuredAdvertsAPI.getFeaturedAdverts({ per_page: 8 }).catch(() => null)
          ),
          sponsoredAdvertsAPI.getSiteFeed({ per_page: 8 }).catch(() =>
            sponsoredAdvertsAPI.getSponsoredAdverts({ per_page: 8 }).catch(() => null)
          ),
          promotedAdvertsAPI.getAdverts({ per_page: 8 }).catch(() => null),
        ]);

        const featured = extractListItems(featuredRes)
          .map((item) => normalizePost(item, 'featured'))
          .filter(Boolean);
        const sponsored = extractListItems(sponsoredRes)
          .map((item) => normalizePost(item, 'sponsored'))
          .filter(Boolean);
        const promoted = extractListItems(promotedRes)
          .map((item) => normalizePost(item, 'promoted'))
          .filter(Boolean);

        const merged = [];
        const max = Math.max(featured.length, sponsored.length, promoted.length);
        for (let i = 0; i < max; i += 1) {
          if (sponsored[i]) merged.push(sponsored[i]);
          if (featured[i]) merged.push(featured[i]);
          if (promoted[i]) merged.push(promoted[i]);
        }

        if (!cancelled) setPosts(merged.slice(0, 12));
      } catch {
        if (!cancelled) setPosts([]);
      } finally {
        if (!cancelled) setLoadingPosts(false);
      }
    };

    load();
    return () => {
      cancelled = true;
    };
  }, []);

  const reelItems = useMemo(
    () => pickPremiumForReel(posts, { limit: 12, allowFallback: true }),
    [posts]
  );

  const heroSrc = withImageWidth(HERO_BG, 1280);

  return (
    <CategoryPageShell
      categoryId="adverts"
      backHref="/"
      showBackBar
      backBarTo="/"
      backBarLabel="Back Home"
      hero={
        <div className="relative overflow-hidden min-h-[9.5rem] sm:min-h-[11rem] md:min-h-[12rem]">
          <div
            className="absolute inset-0 bg-cover bg-center"
            style={{ backgroundImage: heroSrc ? `url('${heroSrc}')` : undefined }}
            aria-hidden="true"
          />
          <div
            className="absolute inset-0"
            style={{
              background:
                'linear-gradient(125deg, rgba(2, 32, 54, 0.88) 0%, rgba(3, 106, 161, 0.72) 48%, rgba(7, 81, 121, 0.8) 100%)',
            }}
            aria-hidden="true"
          />
          <div className="relative z-10 page-container flex h-full min-h-[9.5rem] sm:min-h-[11rem] md:min-h-[12rem] flex-col justify-end pb-5 pt-6">
            <p className="font-display text-2xl sm:text-3xl font-semibold tracking-tight text-white">
              Advertising on World Wide Adverts
            </p>
            <p className="mt-1.5 max-w-xl text-sm text-sky-100/95">
              Sponsored, Featured, and Paid Adverts — each product on its own page, grouped here.
            </p>
          </div>
        </div>
      }
    >
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 sm:gap-4">
        {ADVERT_GROUPS.map((tile) => {
          const Icon = tile.icon;
          return (
            <div
              key={tile.id}
              className={`rounded-xl border ${tile.border} bg-white p-4 sm:p-5 shadow-soft flex flex-col`}
            >
              <Link to={tile.to} className="group flex-1">
                <span
                  className={`inline-flex h-11 w-11 items-center justify-center rounded-lg bg-gradient-to-br ${tile.accent} text-white shadow-sm`}
                >
                  <Icon className="h-5 w-5" />
                </span>
                <h3 className="mt-3 text-base sm:text-lg font-semibold text-slate-900 group-hover:text-primary">
                  {tile.name}
                </h3>
                <p className="mt-1 text-xs sm:text-sm text-slate-500 leading-relaxed">
                  {tile.description}
                </p>
                <span className="mt-3 inline-flex items-center gap-1.5 text-sm font-semibold text-primary group-hover:gap-2 transition-all">
                  Open
                  <FaArrowRight className="h-3 w-3" />
                </span>
              </Link>

              {Array.isArray(tile.children) && tile.children.length > 0 && (
                <div className="mt-4 pt-3 border-t border-slate-100 flex flex-wrap gap-2">
                  {tile.children.map((child) => {
                    const ChildIcon = child.icon;
                    return (
                      <Link
                        key={child.to}
                        to={child.to}
                        className="inline-flex items-center gap-1.5 rounded-full border border-slate-200 bg-slate-50 px-3 py-1.5 text-[11px] font-semibold text-slate-700 hover:bg-white hover:border-primary/30"
                      >
                        <ChildIcon className="h-3 w-3 text-primary" />
                        {child.label}
                      </Link>
                    );
                  })}
                </div>
              )}

              {tile.postTo && (
                <Link
                  to={tile.postTo}
                  className="mt-3 text-xs font-semibold text-slate-500 hover:text-primary"
                >
                  + Create listing
                </Link>
              )}
            </div>
          );
        })}
      </div>

      <section className="mt-8 sm:mt-10">
        {loadingPosts ? (
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-3">
            {[1, 2, 3, 4].map((i) => (
              <div key={i} className="h-36 rounded-xl bg-slate-100 animate-pulse" />
            ))}
          </div>
        ) : reelItems.length > 0 ? (
          <CompactPremiumReel
            items={reelItems}
            title="Live across Sponsored, Featured & Paid"
            getHref={hrefForPost}
            accentClass={theme.accentText || 'text-primary'}
            borderAccent="hover:border-sky-300"
          />
        ) : (
          <div className="rounded-xl border border-dashed border-slate-200 bg-slate-50 px-4 py-8 text-center">
            <p className="text-sm font-medium text-slate-700">No promo posts yet</p>
            <p className="mt-1 text-xs text-slate-500">
              Sponsored, featured, and promoted listings will appear here.
            </p>
          </div>
        )}
      </section>
    </CategoryPageShell>
  );
};

export default AdvertsHubPage;
