import React, { useEffect, useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import Footer from "../Component/Footer";
import Video from "../Component/Video";
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

const CATEGORY_ICONS = {
  "buy-sell": FaUsers,
  business: FaIndustry,
  services: FaCogs,
  property: FaHome,
  jobs: FaBriefcase,
  events: FaCalendarAlt,
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
  "sponsored",
  "promoted",
  "banner",
  "featured",
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

const ROTATE_MS = 4500;

/** Banner-style assets with huge baked-in labels look bad as card media. */
const isMarketingBannerUrl = (url) => {
  if (!url) return false;
  return /banners\/marketplace|categories\/hubs|banner-/i.test(url);
};

const resolveHubImageUrl = (url) => {
  if (!url) return null;
  if (url.startsWith("http://") || url.startsWith("https://")) return url;
  if (url.startsWith("/")) return url;
  return `/${url}`;
};

const normalizeImageList = (hub) => {
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
      <div className={`relative h-16 w-full shrink-0 overflow-hidden ${category.bgColor}`}>
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
            images: [],
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
        name: base?.name || hub.name || slug,
        description: base?.description || hub.description || "",
        route: hub.route || base?.route || `/${slug}`,
        Icon: CATEGORY_ICONS[slug] || base?.Icon || FaStar,
        color: base?.color || "from-slate-400 to-slate-500",
        bgColor: base?.bgColor || "bg-slate-50",
        iconColor: base?.iconColor || "text-slate-600",
        borderColor: base?.borderColor || "border-slate-200",
        images: normalizeImageList(hub),
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
        <Video />

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
