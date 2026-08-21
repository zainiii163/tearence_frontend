import React, { useEffect, useMemo, useState } from 'react';
import { ArrowRight } from 'lucide-react';

const GRADIENTS = [
  'from-blue-500 to-cyan-600',
  'from-red-500 to-orange-600',
  'from-teal-500 to-green-600',
  'from-amber-500 to-orange-600',
  'from-indigo-500 to-blue-600',
  'from-cyan-500 to-teal-600',
  'from-pink-500 to-rose-600',
  'from-orange-500 to-red-600',
  'from-fuchsia-500 to-purple-600',
  'from-slate-600 to-blue-600',
  'from-green-500 to-emerald-600',
  'from-blue-700 to-indigo-700',
  'from-violet-500 to-purple-600',
  'from-emerald-500 to-teal-600',
];

const EMOJI_BY_KEYWORD = [
  [/job|recruit|vacanc|career/i, '💼'],
  [/vehicle|car|auto|motor|bike/i, '🚗'],
  [/property|real.?estate|home|house|furniture/i, '🏠'],
  [/travel|resort|hotel|flight/i, '✈️'],
  [/book|author|read/i, '📚'],
  [/service|consult|repair|tool/i, '🔧'],
  [/event|venue|ticket/i, '📅'],
  [/food|restaurant|hospitality|cafe/i, '🍽'],
  [/fashion|beauty|style|cloth|apparel/i, '👗'],
  [/phone|mobile|smartphone/i, '📱'],
  [/laptop|computer|pc/i, '💻'],
  [/tech|software|code|electron|digital/i, '💻'],
  [/health|wellness|medical|fitness/i, '💪'],
  [/business|finance|company|invest|office/i, '💼'],
  [/banner|ad|promo|sponsor/i, '📣'],
  [/pet|animal|dog|cat/i, '🐾'],
  [/sport|fitness|gym/i, '⚽'],
  [/music|audio/i, '🎵'],
  [/game|toy|baby/i, '🎮'],
  [/art|craft/i, '🎨'],
];

const IMAGE_BY_KEYWORD = [
  [/smartphone|mobile.?phone|iphone/i, 'https://images.unsplash.com/photo-1511707171634-5f897ff02aa9?auto=format&fit=crop&w=600&q=80'],
  [/laptop|notebook.?computer/i, 'https://images.unsplash.com/photo-1496181133206-80ce9b88a853?auto=format&fit=crop&w=600&q=80'],
  [/electron|gadget|tech|digital/i, 'https://images.unsplash.com/photo-1518770660439-4636190af475?auto=format&fit=crop&w=600&q=80'],
  [/motor|bike|scooter/i, 'https://images.unsplash.com/photo-1558981806-ec527fa84c39?auto=format&fit=crop&w=600&q=80'],
  [/vehicle|car|auto/i, 'https://images.unsplash.com/photo-1492144534655-ae79c964c9d7?auto=format&fit=crop&w=600&q=80'],
  [/furniture|sofa|chair|table/i, 'https://images.unsplash.com/photo-1555041469-a586c61ea9bc?auto=format&fit=crop&w=600&q=80'],
  [/cloth|apparel|fashion|men.?s|women.?s/i, 'https://images.unsplash.com/photo-1445205170230-447f0c3c8bf1?auto=format&fit=crop&w=600&q=80'],
  [/fitness|gym|sport|exercise/i, 'https://images.unsplash.com/photo-1517836357463-d25dfeac3438?auto=format&fit=crop&w=600&q=80'],
  [/book|author|read/i, 'https://images.unsplash.com/photo-1512820790803-83ca734da794?auto=format&fit=crop&w=600&q=80'],
  [/baby|infant|kids|child/i, 'https://images.unsplash.com/photo-1515488042361-ee00e0ddd4e4?auto=format&fit=crop&w=600&q=80'],
  [/tool|power.?tool|hardware|diy/i, 'https://images.unsplash.com/photo-1504148455328-c376907d081c?auto=format&fit=crop&w=600&q=80'],
  [/office|desk|stationery/i, 'https://images.unsplash.com/photo-1497366216548-37526070297c?auto=format&fit=crop&w=600&q=80'],
  [/art|paint|craft|gallery/i, 'https://images.unsplash.com/photo-1460661419201-fd4cecdf8a8b?auto=format&fit=crop&w=600&q=80'],
  [/dog|pet|animal|cat/i, 'https://images.unsplash.com/photo-1587300003388-59208cc962f0?auto=format&fit=crop&w=600&q=80'],
  [/home.?service|cleaning|repair|plumb/i, 'https://images.unsplash.com/photo-1581578731548-c64695cc6952?auto=format&fit=crop&w=600&q=80'],
  [/job|recruit|vacanc|career/i, 'https://images.unsplash.com/photo-1521737711867-e3b97375f902?auto=format&fit=crop&w=600&q=80'],
  [/property|real.?estate|home|house/i, 'https://images.unsplash.com/photo-1560518883-ce09059eeffa?auto=format&fit=crop&w=600&q=80'],
  [/travel|resort|hotel|flight/i, 'https://images.unsplash.com/photo-1469854523086-cc02fe5d8800?auto=format&fit=crop&w=600&q=80'],
  [/service|consult/i, 'https://images.unsplash.com/photo-1581578731548-c64695cc6952?auto=format&fit=crop&w=600&q=80'],
  [/event|venue|ticket/i, 'https://images.unsplash.com/photo-1492684223066-81342ee5ff30?auto=format&fit=crop&w=600&q=80'],
  [/food|restaurant|hospitality|cafe/i, 'https://images.unsplash.com/photo-1414235077428-338989a2e8c0?auto=format&fit=crop&w=600&q=80'],
  [/beauty|style/i, 'https://images.unsplash.com/photo-1445205170230-447f0c3c8bf1?auto=format&fit=crop&w=600&q=80'],
  [/software|code|php|javascript/i, 'https://images.unsplash.com/photo-1461749280684-dccba630e2f6?auto=format&fit=crop&w=600&q=80'],
  [/health|wellness|medical/i, 'https://images.unsplash.com/photo-1576091160399-112ba8d25d1d?auto=format&fit=crop&w=600&q=80'],
  [/business|finance|company|invest/i, 'https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?auto=format&fit=crop&w=600&q=80'],
  [/banner|ad|promo|sponsor/i, 'https://images.unsplash.com/photo-1557804506-669a67965ba0?auto=format&fit=crop&w=600&q=80'],
];

/** Packs that exist under public/img/banners/marketplace/ */
const KNOWN_BANNER_PACKS = new Set([
  'books-authors',
  'business-finance',
  'events',
  'fashion-beauty',
  'food-hospitality',
  'health-wellness',
  'jobs-recruitment',
  'real-estate',
  'services',
  'tech-electronics',
  'travel-resorts',
  'vehicles',
]);

const BANNER_SLUG_ALIASES = {
  'fashion-style': 'fashion-beauty',
  fashion: 'fashion-beauty',
  beauty: 'fashion-beauty',
  technology: 'tech-electronics',
  tech: 'tech-electronics',
  electronics: 'tech-electronics',
  smartphones: 'tech-electronics',
  smartphone: 'tech-electronics',
  phones: 'tech-electronics',
  mobile: 'tech-electronics',
  laptops: 'tech-electronics',
  laptop: 'tech-electronics',
  computers: 'tech-electronics',
  travel: 'travel-resorts',
  resorts: 'travel-resorts',
  jobs: 'jobs-recruitment',
  recruitment: 'jobs-recruitment',
  books: 'books-authors',
  authors: 'books-authors',
  food: 'food-hospitality',
  hospitality: 'food-hospitality',
  restaurant: 'food-hospitality',
  'restaurant-equipment': 'food-hospitality',
  health: 'health-wellness',
  wellness: 'health-wellness',
  fitness: 'health-wellness',
  'fitness-equipment': 'health-wellness',
  business: 'business-finance',
  finance: 'business-finance',
  'office-equipment': 'business-finance',
  'real-estate': 'real-estate',
  furniture: 'real-estate',
  appliances: 'real-estate',
  vehicles: 'vehicles',
  cars: 'vehicles',
  car: 'vehicles',
  motorcycles: 'vehicles',
  motorcycle: 'vehicles',
  services: 'services',
  'home-services': 'services',
  'power-tools': 'services',
  'hand-tools': 'services',
  tools: 'services',
  events: 'events',
  'mens-clothing': 'fashion-beauty',
  'womens-clothing': 'fashion-beauty',
  clothing: 'fashion-beauty',
  art: 'services',
  antiques: 'services',
  'outdoor-gear': 'travel-resorts',
  'movies-tv': 'tech-electronics',
  'toys-games': 'events',
  'baby-gear': 'events',
  dogs: 'services',
  pets: 'services',
};

const PLACEHOLDER_RE =
  /default-category|default-icon|placeholder|via\.placeholder|unsplash\.com\/photo-1497366754035/i;

const hashIndex = (str, mod) => {
  let h = 0;
  const s = String(str || '');
  for (let i = 0; i < s.length; i += 1) h = (h * 31 + s.charCodeAt(i)) >>> 0;
  return h % mod;
};

const matchKeyword = (hay, pairs, fallback) => {
  for (const [re, value] of pairs) {
    if (re.test(hay)) return value;
  }
  return fallback;
};

const resolveLocalBannerThumb = (slug) => {
  if (!slug) return [];
  const mapped = BANNER_SLUG_ALIASES[String(slug).toLowerCase()] || String(slug).toLowerCase();
  if (!KNOWN_BANNER_PACKS.has(mapped)) return [];
  return [
    `/img/banners/marketplace/banner-${mapped}.png`,
    `/img/banners/marketplace/${mapped}-rectangle.svg`,
    `/img/banners/marketplace/${mapped}-billboard.svg`,
    `/img/banners/marketplace/${mapped}-leaderboard.svg`,
  ];
};

const isUsableImage = (url) =>
  typeof url === 'string' && url.trim() !== '' && !PLACEHOLDER_RE.test(url);

const uniqueImages = (urls = [], max = 8) => {
  const out = [];
  const seen = new Set();
  for (const raw of urls) {
    if (!isUsableImage(raw)) continue;
    const url = String(raw).trim();
    if (seen.has(url)) continue;
    seen.add(url);
    out.push(url);
    if (out.length >= max) break;
  }
  return out;
};

/** Collect rotating gallery: post images first, then cover / keyword fallbacks. */
const buildImageGallery = ({ category, getImages, getImage, hay, slug }) => {
  const fromGetter = typeof getImages === 'function' ? getImages(category) : null;
  const fromFields = [
    ...(Array.isArray(fromGetter) ? fromGetter : []),
    ...(Array.isArray(category?.images) ? category.images : []),
    ...(Array.isArray(category?.post_images) ? category.post_images : []),
    ...(Array.isArray(category?.sample_images) ? category.sample_images : []),
    ...(Array.isArray(category?.listing_images) ? category.listing_images : []),
  ];

  const single =
    (typeof getImage === 'function' && getImage(category)) ||
    category?.image_url ||
    category?.image ||
    category?.cover_image ||
    category?.thumbnail ||
    null;

  const gallery = uniqueImages([...fromFields, single]);
  const localCandidates = resolveLocalBannerThumb(slug) || [];
  const fallbackImage = matchKeyword(
    hay,
    IMAGE_BY_KEYWORD,
    'https://images.unsplash.com/photo-1557804506-669a67965ba0?auto=format&fit=crop&w=600&q=80'
  );
  const keywordFallbacks = [
    fallbackImage,
    'https://images.unsplash.com/photo-1557804506-669a67965ba0?auto=format&fit=crop&w=600&q=80',
    'https://images.unsplash.com/photo-1497366216548-37526070297c?auto=format&fit=crop&w=600&q=80',
    'https://images.unsplash.com/photo-1469854523086-cc02fe5d8800?auto=format&fit=crop&w=600&q=80',
  ].filter((url, i, arr) => url && arr.indexOf(url) === i);

  if (gallery.length >= 2) return { gallery, localCandidates, fallbackImage };
  const padded = uniqueImages([
    ...gallery,
    ...localCandidates,
    ...keywordFallbacks,
  ]);
  return {
    gallery: padded.length ? padded : [fallbackImage].filter(Boolean),
    localCandidates,
    fallbackImage,
  };
};

const CategoryTile = ({
  category,
  index,
  id,
  name,
  slug,
  count,
  countLabel,
  selected,
  onSelect,
  getImages,
  getImage,
  getIcon,
  accentRing,
  accentBorder,
  hoverBorder,
  hoverArrow,
  rotateMs = 4000,
}) => {
  const hay = `${name} ${slug}`;
  const gradient = GRADIENTS[hashIndex(hay, GRADIENTS.length)];
  const icon =
    (typeof getIcon === 'function' && getIcon(category)) ||
    matchKeyword(hay, EMOJI_BY_KEYWORD, '📋');

  const { gallery, localCandidates, fallbackImage } = useMemo(
    () => buildImageGallery({ category, getImages, getImage, hay, slug }),
    // category object identity changes when parents enrich thumbs
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [category, getImages, getImage, name, slug]
  );

  const [frame, setFrame] = useState(0);

  useEffect(() => {
    setFrame(0);
  }, [gallery.join('|')]);

  useEffect(() => {
    if (gallery.length < 2) return undefined;
    const startDelay = hashIndex(`${id}-${slug}`, 7) * 350 + (index % 5) * 180;
    let intervalId;
    const timeoutId = setTimeout(() => {
      intervalId = setInterval(() => {
        setFrame((n) => (n + 1) % gallery.length);
      }, rotateMs);
    }, startDelay);
    return () => {
      clearTimeout(timeoutId);
      if (intervalId) clearInterval(intervalId);
    };
  }, [gallery.length, id, slug, index, rotateMs]);

  const activeSrc = gallery[frame % gallery.length] || fallbackImage;

  return (
    <button
      type="button"
      onClick={() => onSelect?.(category, id)}
      className={`relative group text-left rounded-md overflow-hidden border transition-all aspect-[2/1] sm:aspect-[5/2] ${
        selected
          ? `ring-2 ${accentRing} ring-offset-1 ${accentBorder} shadow-md`
          : `border-slate-200/80 hover:shadow-md hover:scale-[1.02] ${hoverBorder}`
      }`}
    >
      <div className={`absolute inset-0 bg-gradient-to-br ${gradient}`} />

      <img
        key={activeSrc}
        src={activeSrc}
        alt=""
        className="absolute inset-0 w-full h-full object-cover opacity-[0.62] group-hover:opacity-75 group-hover:scale-105 transition-transform duration-500"
        loading="lazy"
        decoding="async"
        onError={(e) => {
          const img = e.currentTarget;
          const tried = Number(img.dataset.try || 0);
          const nextLocal = localCandidates?.[tried + 1];
          if (nextLocal) {
            img.dataset.try = String(tried + 1);
            img.src = nextLocal;
            return;
          }
          if (img.src !== fallbackImage) {
            img.src = fallbackImage;
            return;
          }
          img.style.display = 'none';
        }}
      />

      <div className="absolute inset-0 bg-gradient-to-t from-black/85 via-black/35 to-black/5" />

      {gallery.length > 1 ? (
        <div className="absolute top-1 right-1 flex gap-0.5 z-[1]">
          {gallery.slice(0, 5).map((_, i) => (
            <span
              key={i}
              className={`h-1 rounded-full transition-all ${
                i === frame % gallery.length ? 'w-2.5 bg-white' : 'w-1 bg-white/45'
              }`}
            />
          ))}
        </div>
      ) : null}

      {/* Icon + label share one bottom row so the emoji never covers the name */}
      <div className="absolute inset-x-0 bottom-0 p-1.5 sm:p-2 z-[1]">
        <div className="flex items-center gap-1.5 min-w-0">
          <span className="shrink-0 w-5 h-5 sm:w-6 sm:h-6 bg-white/95 rounded flex items-center justify-center text-[10px] sm:text-xs shadow-sm">
            {icon}
          </span>
          <div className="min-w-0 flex-1">
            <h3 className="font-semibold text-white text-[10px] sm:text-[11px] leading-tight line-clamp-1 drop-shadow-sm">
              {name}
            </h3>
            <p className="text-[9px] text-white/80 truncate leading-tight">
              {count != null ? `${Number(count).toLocaleString()} ${countLabel}` : 'Browse'}
            </p>
          </div>
          <span
            className={`shrink-0 w-5 h-5 rounded-full bg-white/90 text-slate-600 hidden sm:flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity ${hoverArrow}`}
          >
            <ArrowRight className="w-2.5 h-2.5" />
          </span>
        </div>
      </div>
    </button>
  );
};

/**
 * Compact photo category tiles — dense grid, post images rotate when available.
 */
const MarketplaceCategoryCards = ({
  categories = [],
  selectedId = null,
  onSelect,
  loading = false,
  title = 'Categories',
  subtitle = 'Open a category to browse listings in that market.',
  countLabel = 'listings',
  getId = (c) => c.id ?? c.category_id ?? c.slug,
  getLabel = (c) => c.name || c.category_name || c.label || 'Category',
  getSlug = (c) => c.slug || String(c.id || '').toLowerCase(),
  getCount = (c) =>
    c.active_banners_count ??
    c.listings_count ??
    c.jobs_count ??
    c.adverts_count ??
    c.count ??
    c.items_count ??
    null,
  getImage = null,
  /** Return string[] of post/listing image URLs for this category (rotated on the card). */
  getImages = null,
  getIcon = null,
  accentRing = 'ring-indigo-500',
  accentBorder = 'border-indigo-300',
  hoverBorder = 'hover:border-indigo-200',
  hoverTitle = 'group-hover:text-indigo-700',
  hoverArrow = 'group-hover:bg-indigo-100 group-hover:text-indigo-700',
  initialVisible = 24,
  rotateMs = 4000,
  className = '',
}) => {
  const [expanded, setExpanded] = useState(false);
  const list = Array.isArray(categories) ? categories : [];

  const visible = useMemo(() => {
    if (expanded || list.length <= initialVisible) return list;
    return list.slice(0, initialVisible);
  }, [list, expanded, initialVisible]);

  const hiddenCount = Math.max(0, list.length - initialVisible);

  if (loading) {
    return (
      <div className={`mb-3 ${className}`}>
        <div className="flex flex-col items-center text-center mb-2 gap-1">
          <div>
            <h2 className="text-sm sm:text-base font-bold text-gray-900">{title}</h2>
            {subtitle ? <p className="text-[11px] text-gray-500 mt-0.5">{subtitle}</p> : null}
          </div>
        </div>
        <div className="grid grid-cols-3 sm:grid-cols-4 md:grid-cols-5 lg:grid-cols-6 xl:grid-cols-8 gap-1.5 sm:gap-2">
          {Array.from({ length: 8 }).map((_, i) => (
            <div
              key={i}
              className="rounded-md aspect-[2/1] sm:aspect-[5/2] bg-slate-200/80 animate-pulse"
            />
          ))}
        </div>
      </div>
    );
  }

  if (!list.length) return null;

  return (
    <div className={`mb-3 ${className}`}>
      <div className="flex flex-col items-center text-center mb-2 gap-1">
        <div>
          <h2 className="text-sm sm:text-base font-bold text-gray-900">{title}</h2>
          {subtitle ? <p className="text-[11px] text-gray-500 mt-0.5">{subtitle}</p> : null}
        </div>
        <span className="text-[10px] text-gray-400 shrink-0">{list.length} categories</span>
      </div>

      <div className="grid grid-cols-3 sm:grid-cols-4 md:grid-cols-5 lg:grid-cols-6 xl:grid-cols-8 gap-1.5 sm:gap-2">
        {visible.map((category, index) => {
          const id = getId(category);
          const name = getLabel(category);
          const slug = String(getSlug(category) || '')
            .toLowerCase()
            .replace(/[^a-z0-9]+/g, '-')
            .replace(/^-|-$/g, '');
          const count = getCount(category);
          const selected =
            selectedId != null &&
            String(selectedId) !== 'all' &&
            (String(selectedId) === String(id) || String(selectedId) === String(slug));

          return (
            <CategoryTile
              key={`${id}-${slug}-${index}`}
              category={category}
              index={index}
              id={id}
              name={name}
              slug={slug}
              count={count}
              countLabel={countLabel}
              selected={selected}
              onSelect={onSelect}
              getImages={getImages}
              getImage={getImage}
              getIcon={getIcon}
              accentRing={accentRing}
              accentBorder={accentBorder}
              hoverBorder={hoverBorder}
              hoverArrow={hoverArrow}
              rotateMs={rotateMs}
            />
          );
        })}
      </div>

      {hiddenCount > 0 && (
        <button
          type="button"
          onClick={() => setExpanded((v) => !v)}
          className="mt-2 text-[11px] font-semibold text-indigo-700 hover:text-indigo-900"
        >
          {expanded ? 'Show less' : `Show all ${list.length} categories`}
        </button>
      )}
    </div>
  );
};

export default MarketplaceCategoryCards;
