import React, { useEffect, useMemo, useState, lazy, Suspense } from "react";
import { useNavigate } from "react-router-dom";
import Footer from "../Component/Footer";
import UnifiedNavbar from "../Component/UnifiedNavbar";
import {
  FaIndustry,
  FaHome,
  FaCogs,
  FaCar,
  FaBook,
  FaArrowRight,
  FaCalendarAlt,
  FaPlane,
  FaStar,
  FaMedal,
  FaUsers,
  FaBullhorn,
  FaImage,
  FaHeart,
  FaBriefcase,
  FaCode,
} from "react-icons/fa";
import { CATEGORY_THEMES } from "../constants/categoryThemes";
import categoryService from "../services/CategoryService";
import { prefetchHubRoute, warmupPopularHubs } from "../utils/hubRoutePrefetch";
import { getStorageAssetUrl, rewriteLocalStorageUrl } from "../utils/jobsHelpers";
import { isBrokenImagePath } from "../utils/resolveImageUrl";

const Video = lazy(() => import("../Component/Video"));

const CATEGORY_ICONS = {
  "buy-sell": FaUsers,
  business: FaIndustry,
  services: FaCogs,
  property: FaHome,
  jobs: FaBriefcase,
  events: FaCalendarAlt,
  adverts: FaBullhorn,
  sponsored: FaBullhorn,
  promoted: FaBullhorn,
  banner: FaImage,
  featured: FaStar,
  funding: FaHeart,
  stores: FaHome,
  books: FaBook,
  vehicles: FaCar,
  donations: FaHeart,
  images: FaImage,
  classifieds: FaMedal,
  affiliate: FaUsers,
  resorts: FaPlane,
  investment: FaIndustry,
  software: FaCode,
};

const CATEGORY_ORDER = [
  "buy-sell",
  "business",
  "services",
  "property",
  "jobs",
  "software",
  "events",
  "adverts",
  "funding",
  "stores",
  "books",
  "vehicles",
  "donations",
  "images",
  "classifieds",
  "affiliate",
  "resorts",
  "investment",
];

const ROTATE_MS = 4000;

/** When a hub has few/no post images, still rotate real photos so every tile feels alive. */
const HUB_FALLBACK_GALLERIES = {
  "buy-sell": [
    "https://images.unsplash.com/photo-1517336714731-489689fd1ca8?auto=format&fit=crop&w=800&q=80",
    "https://images.unsplash.com/photo-1511707171634-5f897ff02aa9?auto=format&fit=crop&w=800&q=80",
    "https://images.unsplash.com/photo-1555041469-a586c61ea9bc?auto=format&fit=crop&w=800&q=80",
  ],
  business: [
    "https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?auto=format&fit=crop&w=800&q=80",
    "https://images.unsplash.com/photo-1497366216548-37526070297c?auto=format&fit=crop&w=800&q=80",
    "https://images.unsplash.com/photo-1454165804606-c3d57bc86b40?auto=format&fit=crop&w=800&q=80",
  ],
  services: [
    "https://images.unsplash.com/photo-1581578731548-c64695cc6952?auto=format&fit=crop&w=800&q=80",
    "https://images.unsplash.com/photo-1504148455328-c376907d081c?auto=format&fit=crop&w=800&q=80",
    "https://images.unsplash.com/photo-1581094794329-c8112a89af12?auto=format&fit=crop&w=800&q=80",
  ],
  property: [
    "https://images.unsplash.com/photo-1560518883-ce09059eeffa?auto=format&fit=crop&w=800&q=80",
    "https://images.unsplash.com/photo-1564013799919-ab600027ffc6?auto=format&fit=crop&w=800&q=80",
    "https://images.unsplash.com/photo-1512917774080-9991f1c4c750?auto=format&fit=crop&w=800&q=80",
  ],
  jobs: [
    "https://images.unsplash.com/photo-1521737711867-e3b97375f902?auto=format&fit=crop&w=800&q=80",
    "https://images.unsplash.com/photo-1522071820081-009f0129c71c?auto=format&fit=crop&w=800&q=80",
    "https://images.unsplash.com/photo-1454165804606-c3d57bc86b40?auto=format&fit=crop&w=800&q=80",
  ],
  software: [
    "https://images.unsplash.com/photo-1461749280684-dccba630e2f6?auto=format&fit=crop&w=800&q=80",
    "https://images.unsplash.com/photo-1518770660439-4636190af475?auto=format&fit=crop&w=800&q=80",
    "https://images.unsplash.com/photo-1555066931-4365d14bab8c?auto=format&fit=crop&w=800&q=80",
  ],
  events: [
    "https://images.unsplash.com/photo-1492684223066-81342ee5ff30?auto=format&fit=crop&w=800&q=80",
    "https://images.unsplash.com/photo-1540575467063-178a50c2df87?auto=format&fit=crop&w=800&q=80",
    "https://images.unsplash.com/photo-1511578314322-379afb476865?auto=format&fit=crop&w=800&q=80",
  ],
  adverts: [
    "https://images.unsplash.com/photo-1557804506-669a67965ba0?auto=format&fit=crop&w=800&q=80",
    "https://images.unsplash.com/photo-1460925895917-afdab827c52f?auto=format&fit=crop&w=800&q=80",
    "https://images.unsplash.com/photo-1556761175-5973dc0f32e7?auto=format&fit=crop&w=800&q=80",
  ],
  sponsored: [
    "https://images.unsplash.com/photo-1557804506-669a67965ba0?auto=format&fit=crop&w=800&q=80",
    "https://images.unsplash.com/photo-1460925895917-afdab827c52f?auto=format&fit=crop&w=800&q=80",
    "https://images.unsplash.com/photo-1556761175-5973dc0f32e7?auto=format&fit=crop&w=800&q=80",
  ],
  promoted: [
    "https://images.unsplash.com/photo-1533750349088-cd871a92f312?auto=format&fit=crop&w=800&q=80",
    "https://images.unsplash.com/photo-1552664730-d307ca884978?auto=format&fit=crop&w=800&q=80",
    "https://images.unsplash.com/photo-1432888498266-38ffec3eaf0a?auto=format&fit=crop&w=800&q=80",
  ],
  banner: [
    "https://images.unsplash.com/photo-1563986768609-322da13575f3?auto=format&fit=crop&w=800&q=80",
    "https://images.unsplash.com/photo-1611162617474-5b21e879e113?auto=format&fit=crop&w=800&q=80",
    "https://images.unsplash.com/photo-1432888498266-38ffec3eaf0a?auto=format&fit=crop&w=800&q=80",
  ],
  featured: [
    "https://images.unsplash.com/photo-1522202176988-66273c2fd55f?auto=format&fit=crop&w=800&q=80",
    "https://images.unsplash.com/photo-1556761175-b413da4baf72?auto=format&fit=crop&w=800&q=80",
    "https://images.unsplash.com/photo-1497366754035-f200968a6e72?auto=format&fit=crop&w=800&q=80",
  ],
  funding: [
    "https://images.unsplash.com/photo-1579621970563-ebec7560ff3e?auto=format&fit=crop&w=800&q=80",
    "https://images.unsplash.com/photo-1633158829585-23ba8f7d8d0c?auto=format&fit=crop&w=800&q=80",
    "https://images.unsplash.com/photo-1554224155-6726b3ff858f?auto=format&fit=crop&w=800&q=80",
  ],
  stores: [
    "https://images.unsplash.com/photo-1441986300917-64674bd600d8?auto=format&fit=crop&w=800&q=80",
    "https://images.unsplash.com/photo-1472851294608-062f824d29cc?auto=format&fit=crop&w=800&q=80",
    "https://images.unsplash.com/photo-1556742049-0cfed4f6a45d?auto=format&fit=crop&w=800&q=80",
  ],
  books: [
    "https://images.unsplash.com/photo-1512820790803-83ca734da794?auto=format&fit=crop&w=800&q=80",
    "https://images.unsplash.com/photo-1495446815901-a7297e633e8d?auto=format&fit=crop&w=800&q=80",
    "https://images.unsplash.com/photo-1524995997946-a1c2e315a42f?auto=format&fit=crop&w=800&q=80",
  ],
  vehicles: [
    "https://images.unsplash.com/photo-1492144534655-ae79c964c9d7?auto=format&fit=crop&w=800&q=80",
    "https://images.unsplash.com/photo-1558981806-ec527fa84c39?auto=format&fit=crop&w=800&q=80",
    "https://images.unsplash.com/photo-1503376780353-7e6692767b70?auto=format&fit=crop&w=800&q=80",
  ],
  donations: [
    "https://images.unsplash.com/photo-1532629345422-7515f3d16bb6?auto=format&fit=crop&w=800&q=80",
    "https://images.unsplash.com/photo-1469571486292-0ba58a3f068b?auto=format&fit=crop&w=800&q=80",
    "https://images.unsplash.com/photo-1488521787991-ed7bbaae773c?auto=format&fit=crop&w=800&q=80",
  ],
  images: [
    "https://images.unsplash.com/photo-1477959858617-67f85cf4f1df?auto=format&fit=crop&w=800&q=80",
    "https://images.unsplash.com/photo-1506905925346-21bda4d32df4?auto=format&fit=crop&w=800&q=80",
    "https://images.unsplash.com/photo-1516035069371-29a1b244cc32?auto=format&fit=crop&w=800&q=80",
  ],
  classifieds: [
    "https://images.unsplash.com/photo-1607082349566-187342175e2f?auto=format&fit=crop&w=800&q=80",
    "https://images.unsplash.com/photo-1556740749-887f6717d7e4?auto=format&fit=crop&w=800&q=80",
    "https://images.unsplash.com/photo-1472851294608-062f824d29cc?auto=format&fit=crop&w=800&q=80",
  ],
  affiliate: [
    "https://images.unsplash.com/photo-1556761175-5973dc0f32e7?auto=format&fit=crop&w=800&q=80",
    "https://images.unsplash.com/photo-1460925895917-afdab827c52f?auto=format&fit=crop&w=800&q=80",
    "https://images.unsplash.com/photo-1557804506-669a67965ba0?auto=format&fit=crop&w=800&q=80",
  ],
  resorts: [
    "https://images.unsplash.com/photo-1469854523086-cc02fe5d8800?auto=format&fit=crop&w=800&q=80",
    "https://images.unsplash.com/photo-1507525428034-b723cf961d3e?auto=format&fit=crop&w=800&q=80",
    "https://images.unsplash.com/photo-1571896349842-33c89424de2d?auto=format&fit=crop&w=800&q=80",
  ],
  investment: [
    "https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?auto=format&fit=crop&w=800&q=80",
    "https://images.unsplash.com/photo-1497366811353-6870744d04b2?auto=format&fit=crop&w=800&q=80",
    "https://images.unsplash.com/photo-1556761175-b413da4baf72?auto=format&fit=crop&w=800&q=80",
  ],
};

/** Banner-style assets with huge baked-in labels look bad as card media. */
const isMarketingBannerUrl = (url) => {
  if (!url) return false;
  return /banners\/marketplace|categories\/hubs|banner-/i.test(url);
};

const resolveHubImageUrl = (url) => {
  if (!url || typeof url !== "string") return null;
  const trimmed = url.trim();
  if (!trimmed || isBrokenImagePath(trimmed)) return null;
  const resolved =
    getStorageAssetUrl(trimmed) ||
    rewriteLocalStorageUrl(trimmed) ||
    (trimmed.startsWith("http") || trimmed.startsWith("/") ? trimmed : `/${trimmed}`);
  if (!resolved || isBrokenImagePath(resolved)) return null;
  return resolved;
};

const normalizeImageList = (hub, slug) => {
  const rawList = Array.isArray(hub?.images)
    ? hub.images
    : hub?.image_url
      ? [hub.image_url]
      : [];

  const urls = [];
  rawList.forEach((item) => {
    const resolved = resolveHubImageUrl(item);
    if (!resolved || isMarketingBannerUrl(resolved)) return;
    if (!urls.includes(resolved)) urls.push(resolved);
  });

  // Pad with curated photos so every hub card can rotate.
  const fallbacks = HUB_FALLBACK_GALLERIES[slug] || HUB_FALLBACK_GALLERIES["buy-sell"];
  for (const url of fallbacks) {
    if (!urls.includes(url)) urls.push(url);
    if (urls.length >= 6) break;
  }
  return urls;
};

/** Stagger rotation start so cards don't flip in sync. */
const slugOffset = (slug) => {
  let hash = 0;
  for (let i = 0; i < slug.length; i += 1) {
    hash = (hash + slug.charCodeAt(i) * (i + 1)) % ROTATE_MS;
  }
  return hash;
};

function HubCategoryCard({ category, onOpen, onPrefetch }) {
  const images = category.images || [];
  const Icon = category.Icon || FaStar;
  const [index, setIndex] = useState(0);
  const [broken, setBroken] = useState({});

  const visibleImages = useMemo(
    () => images.filter((url) => !broken[url]),
    [images, broken]
  );

  useEffect(() => {
    setIndex(0);
  }, [category.slug, images.join("|")]);

  useEffect(() => {
    if (visibleImages.length < 2) return undefined;

    const delay = slugOffset(category.slug);
    let intervalId;
    const startId = setTimeout(() => {
      intervalId = setInterval(() => {
        setIndex((prev) => (prev + 1) % visibleImages.length);
      }, ROTATE_MS);
    }, delay);

    return () => {
      clearTimeout(startId);
      if (intervalId) clearInterval(intervalId);
    };
  }, [visibleImages.length, category.slug]);

  const activeIndex =
    visibleImages.length > 0 ? index % visibleImages.length : 0;

  const route = category.route || `/${category.slug}`;
  const warm = () => onPrefetch?.(route);

  return (
    <button
      type="button"
      onClick={() => onOpen(category)}
      onMouseEnter={warm}
      onFocus={warm}
      onTouchStart={warm}
      onPointerDown={warm}
      className={`group flex h-full min-h-[148px] w-full flex-col overflow-hidden rounded-xl border ${category.borderColor} bg-white text-left shadow-sm transition duration-200 hover:-translate-y-0.5 hover:shadow-md focus:outline-none focus-visible:ring-2 focus-visible:ring-emerald-500/40`}
    >
      <div className={`relative h-20 w-full shrink-0 overflow-hidden ${category.bgColor}`}>
        {visibleImages.length > 0 ? (
          visibleImages.map((url, i) => (
            <img
              key={url}
              src={url}
              alt=""
              className={`absolute inset-0 h-full w-full object-cover transition-opacity duration-700 ease-out group-hover:scale-[1.03] ${
                i === activeIndex ? "opacity-100" : "opacity-0"
              }`}
              onError={() =>
                setBroken((prev) => ({ ...prev, [url]: true }))
              }
            />
          ))
        ) : (
          <div className="flex h-full w-full items-center justify-center">
            <span
              className={`inline-flex h-10 w-10 items-center justify-center rounded-lg bg-white/85 ${category.iconColor} shadow-sm`}
            >
              <Icon className="h-5 w-5" />
            </span>
          </div>
        )}
        <div className="pointer-events-none absolute inset-x-0 bottom-0 h-8 bg-gradient-to-t from-white to-transparent" />
        {visibleImages.length > 1 && (
          <div className="pointer-events-none absolute bottom-1.5 left-0 right-0 flex justify-center gap-1">
            {visibleImages.slice(0, 5).map((url, i) => (
              <span
                key={url}
                className={`h-1 w-1 rounded-full transition-colors ${
                  i === activeIndex % Math.min(visibleImages.length, 5)
                    ? "bg-white"
                    : "bg-white/50"
                }`}
              />
            ))}
          </div>
        )}
      </div>

      <div className="flex flex-1 flex-col px-3 pb-3 pt-2">
        <div className="mb-1.5 flex items-start gap-2">
          <span
            className={`mt-0.5 inline-flex h-7 w-7 shrink-0 items-center justify-center rounded-md bg-slate-50 ${category.iconColor}`}
          >
            <Icon className="h-3.5 w-3.5" />
          </span>
          <h3 className="text-sm font-semibold leading-snug text-slate-900 line-clamp-2">
            {category.name}
          </h3>
        </div>

        <p className="mb-3 flex-1 text-xs leading-relaxed text-slate-500 line-clamp-2">
          {category.description}
        </p>

        <div className="mt-auto flex items-center text-xs font-medium text-slate-700">
          <span className="inline-flex items-center gap-1 text-emerald-700 transition-all group-hover:gap-1.5">
            Explore
            <FaArrowRight className="h-3 w-3" />
          </span>
        </div>
      </div>
    </button>
  );
}

function Homepage() {
  const [hubs, setHubs] = useState([]);
  const navigate = useNavigate();

  const staticDefinitions = useMemo(
    () =>
      Object.fromEntries(
        Object.entries(CATEGORY_THEMES).map(([slug, theme]) => [
          slug,
          {
            slug,
            name: theme.name,
            description: theme.description,
            Icon: CATEGORY_ICONS[slug] || FaStar,
            color: theme.color,
            bgColor: theme.bgColor,
            iconColor: theme.iconColor,
            borderColor: theme.borderColor,
            route: theme.route,
            images: normalizeImageList({}, slug),
            listing_count: null,
          },
        ])
      ),
    []
  );

  const categories = useMemo(() => {
    const bySlug = { ...staticDefinitions };
    hubs.forEach((hub) => {
      const slug = hub.slug;
      const base = bySlug[slug] || staticDefinitions[slug];
      if (!base && !hub.route) return;

      bySlug[slug] = {
        ...(base || {}),
        slug,
        name:
          slug === 'adverts'
            ? 'Adverts'
            : /all\s*posts/i.test(String(hub.name || ''))
              ? base?.name || 'Adverts'
              : base?.name || hub.name || slug,
        description: base?.description || hub.description || "",
        route: hub.route || base?.route || `/${slug}`,
        Icon: CATEGORY_ICONS[slug] || base?.Icon || FaStar,
        color: base?.color || "from-slate-400 to-slate-500",
        bgColor: base?.bgColor || "bg-slate-50",
        iconColor: base?.iconColor || "text-slate-600",
        borderColor: base?.borderColor || "border-slate-200",
        images: normalizeImageList(hub, slug),
        listing_count: hub.listing_count ?? null,
      };
    });
    return CATEGORY_ORDER.map((slug) => bySlug[slug]).filter(Boolean);
  }, [hubs, staticDefinitions]);

  const handleCategoryClick = (category) => {
    const route = category.route || `/${category.slug}`;
    prefetchHubRoute(route);
    navigate(route);
  };

  useEffect(() => {
    let cancelled = false;

    const load = async () => {
      try {
        const res = await categoryService.getMarketplaceHubs();
        const items = res?.data?.items || res?.items || [];
        if (!cancelled && Array.isArray(items)) {
          setHubs(items);
        }
      } catch (err) {
        console.warn("Marketplace hubs unavailable, using static categories", err);
      }
    };

    load();
    warmupPopularHubs();

    return () => {
      cancelled = true;
    };
  }, []);

  return (
    <div className="min-h-screen w-full overflow-x-hidden bg-gradient-to-br from-green-50 via-emerald-50 to-teal-50">
      <div className="w-full">
        <UnifiedNavbar />
        <Suspense
          fallback={
            <div className="w-full mb-4 sm:mb-5 lg:mb-6">
              <div className="page-container pt-4 sm:pt-5 lg:pt-6">
                <div className="aspect-[16/9] max-h-[160px] sm:max-h-[200px] md:max-h-[230px] rounded-lg bg-gray-100 animate-pulse" />
              </div>
            </div>
          }
        >
          <Video />
        </Suspense>

        <div className="w-full bg-background py-4 sm:py-5 lg:py-6">
          <div className="page-container page-section-y">
            <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 sm:gap-3.5 lg:gap-4">
              {categories.map((category) => (
                <HubCategoryCard
                  key={category.slug}
                  category={category}
                  onOpen={handleCategoryClick}
                  onPrefetch={prefetchHubRoute}
                />
              ))}
            </div>
          </div>
        </div>

        <Footer />
      </div>
    </div>
  );
}

export default Homepage;
