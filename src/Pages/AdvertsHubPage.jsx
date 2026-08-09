import React, { useEffect, useMemo, useState } from 'react';
import { Link } from 'react-router-dom';
import { FaBullhorn, FaStar, FaRocket, FaImage, FaArrowRight } from 'react-icons/fa';
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

const ADVERT_TILES = [
  {
    id: 'sponsored',
    name: 'Sponsored',
    description: 'Premium placements with maximum visibility across Worldwide Adverts.',
    to: '/sponsored-adverts',
    icon: FaBullhorn,
    accent: 'from-violet-600 to-indigo-600',
    border: 'border-violet-200',
  },
  {
    id: 'featured',
    name: 'Featured',
    description: 'Highlighted listings that stay at the top of category results.',
    to: '/featured-adverts',
    icon: FaStar,
    accent: 'from-amber-500 to-orange-500',
    border: 'border-amber-200',
  },
  {
    id: 'promoted',
    name: 'Promoted',
    description: 'Boost campaigns that push your offer ahead of standard posts.',
    to: '/promoted-adverts',
    icon: FaRocket,
    accent: 'from-rose-500 to-pink-500',
    border: 'border-rose-200',
  },
  {
    id: 'banners',
    name: 'Banners',
    description: 'Display banner inventory for site-wide brand campaigns.',
    to: '/banner-adverts',
    icon: FaImage,
    accent: 'from-sky-500 to-blue-600',
    border: 'border-sky-200',
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
  if (lane === 'banners') return `/banner-adverts`;
  return '/adverts';
};

/**
 * Combined Adverts hub — four lanes + promotional posts below.
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

        // Interleave so each lane gets visibility in the promo strip
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
        <div className="relative overflow-hidden h-24 sm:h-28 md:h-32" aria-hidden="true">
          <div
            className="absolute inset-0 bg-cover bg-center"
            style={{ backgroundImage: heroSrc ? `url('${heroSrc}')` : undefined }}
          />
          <div
            className="absolute inset-0"
            style={{
              background:
                'linear-gradient(125deg, rgba(76, 29, 149, 0.75) 0%, rgba(109, 40, 217, 0.55) 50%, rgba(67, 56, 202, 0.65) 100%)',
            }}
          />
        </div>
      }
    >
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4">
        {ADVERT_TILES.map((tile) => {
          const Icon = tile.icon;
          return (
            <Link
              key={tile.id}
              to={tile.to}
              className={`group rounded-2xl border ${tile.border} bg-white p-4 sm:p-5 shadow-sm hover:shadow-md transition-all hover:-translate-y-0.5`}
            >
              <span
                className={`inline-flex h-11 w-11 items-center justify-center rounded-xl bg-gradient-to-br ${tile.accent} text-white shadow`}
              >
                <Icon className="h-5 w-5" />
              </span>
              <h3 className="mt-3 text-base sm:text-lg font-semibold text-slate-900">{tile.name}</h3>
              <p className="mt-1 text-xs sm:text-sm text-slate-500 leading-relaxed line-clamp-3">
                {tile.description}
              </p>
              <span className="mt-3 inline-flex items-center gap-1.5 text-sm font-semibold text-slate-800 group-hover:gap-2 transition-all">
                Open
                <FaArrowRight className="h-3 w-3" />
              </span>
            </Link>
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
            title="Promoted on Worldwide Adverts"
            getHref={hrefForPost}
            accentClass={theme.accentText || 'text-violet-700'}
            borderAccent="hover:border-violet-300"
          />
        ) : (
          <div className="rounded-xl border border-dashed border-slate-200 bg-slate-50 px-4 py-8 text-center">
            <p className="text-sm font-medium text-slate-700">No promo posts yet</p>
            <p className="mt-1 text-xs text-slate-500">
              Featured and sponsored listings will appear here to promote platform content.
            </p>
          </div>
        )}
      </section>
    </CategoryPageShell>
  );
};

export default AdvertsHubPage;
