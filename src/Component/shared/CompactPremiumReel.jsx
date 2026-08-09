import React, { useMemo, useState } from 'react';
import { Link } from 'react-router-dom';
import { getStorageAssetUrl } from '../../utils/jobsHelpers';
import { getResponsiveImageProps } from '../../utils/responsiveImage';
import { isFeaturedListing, isSponsoredListing } from '../../utils/listingPromotionSort';

const resolveListingImage = (item) => {
  if (!item) return null;
  const direct =
    item.image_url ||
    item.thumbnail_url ||
    item.cover_image ||
    item.main_image ||
    item.image;
  if (typeof direct === 'string' && direct.trim()) {
    return getStorageAssetUrl(direct) || (direct.startsWith('http') ? direct : null);
  }

  const mediaList = item.media;
  if (Array.isArray(mediaList) && mediaList.length) {
    const thumb =
      mediaList.find((m) => m?.is_thumbnail || m?.isThumbnail) || mediaList[0];
    const mediaUrl =
      (typeof thumb === 'string' ? thumb : null) ||
      thumb?.full_url ||
      thumb?.file_path ||
      thumb?.url ||
      thumb?.path;
    if (mediaUrl) {
      const resolved = getStorageAssetUrl(mediaUrl);
      if (resolved) return resolved;
      if (typeof mediaUrl === 'string' && mediaUrl.startsWith('http')) return mediaUrl;
    }
  }

  const images = item.images;
  if (!images) return null;

  const candidates = [];
  if (typeof images === 'object' && !Array.isArray(images)) {
    Object.values(images).forEach((v) => {
      if (typeof v === 'string') candidates.push(v);
    });
  }
  if (Array.isArray(images)) {
    images.forEach((img) => {
      const url = typeof img === 'string' ? img : img?.url || img?.full_url || img?.path;
      if (url) candidates.push(url);
    });
  }

  for (const raw of candidates) {
    const resolved = getStorageAssetUrl(raw);
    if (resolved) return resolved;
    if (typeof raw === 'string' && raw.startsWith('http')) return raw;
  }
  return null;
};

const badgeFor = (item) => {
  if (isFeaturedListing(item)) return 'Featured';
  if (isSponsoredListing(item)) return 'Sponsored';
  if (item?.promoted || item?.is_promoted) return 'Promoted';
  const tag = String(item?.tag || '').toLowerCase();
  if (tag === 'live' || item?.isLive || item?.is_live) return 'Live';
  if (tag === 'paid') return 'Paid';
  return 'Premium';
};

/** Repeat items until we have at least `minCount` so the row never shows empty space. */
const fillToCount = (list, minCount) => {
  if (!list.length) return [];
  const out = [];
  while (out.length < minCount) {
    out.push(...list);
  }
  return out;
};

/**
 * Compact full-width horizontal reel for premium / featured adverts.
 * Always fills the row (repeats cards if needed) so scrolling never leaves a blank gap.
 */
const CompactPremiumReel = ({
  items = [],
  title = 'Featured',
  getHref = (item) => (item?.id ? `/item/${item.id}` : '#'),
  onItemClick,
  maxItems = 12,
  accentClass = 'text-emerald-700',
  borderAccent = 'hover:border-emerald-300',
}) => {
  const [paused, setPaused] = useState(false);

  const cards = useMemo(() => {
    const list = (Array.isArray(items) ? items : [])
      .slice(0, maxItems)
      .map((item) => ({
        ...item,
        _image: resolveListingImage(item),
        _badge: badgeFor(item),
        _title: item.title || item.name || item.business_name || 'Listing',
      }));
    return list;
  }, [items, maxItems]);

  // Enough cards to cover a wide desktop row (~8–10 thumbs), then duplicate for seamless loop
  const track = useMemo(() => {
    const filled = fillToCount(cards, 10);
    return [...filled, ...filled];
  }, [cards]);

  if (!cards.length) return null;

  const durationSec = Math.max(20, Math.min(48, cards.length * 5 + 16));

  const renderCard = (item, index) => {
    const href = getHref(item);
    const inner = (
      <>
        <div className="h-[52px] sm:h-[60px] w-full bg-slate-100 overflow-hidden">
          {item._image ? (
            <img
              {...getResponsiveImageProps(item._image, { variant: 'thumb' })}
              alt=""
              className="h-full w-full object-cover"
              loading="lazy"
              onError={(e) => {
                e.currentTarget.style.display = 'none';
              }}
            />
          ) : (
            <div className="h-full w-full bg-gradient-to-br from-slate-200 to-slate-300" />
          )}
        </div>
        <div className="px-1.5 py-1 min-w-0">
          <p className="text-[9px] font-semibold uppercase tracking-wide text-amber-700 truncate">
            {item._badge}
          </p>
          <p className="text-[10px] sm:text-[11px] font-semibold text-gray-900 truncate leading-tight">
            {item._title}
          </p>
        </div>
      </>
    );

    const className = `group shrink-0 w-[118px] sm:w-[132px] rounded-md overflow-hidden border border-slate-100 bg-white ${borderAccent} hover:shadow-sm transition-all text-left`;

    if (typeof onItemClick === 'function') {
      return (
        <button
          key={`${item.id || item.slug || 'p'}-${index}`}
          type="button"
          onClick={() => onItemClick(item)}
          className={className}
        >
          {inner}
        </button>
      );
    }

    return (
      <Link
        key={`${item.id || item.slug || 'p'}-${index}`}
        to={href}
        className={className}
      >
        {inner}
      </Link>
    );
  };

  return (
    <section className="mb-4 sm:mb-5">
      <div className="flex items-center justify-between mb-1.5 px-0.5">
        <h2 className={`text-xs sm:text-sm font-bold ${accentClass}`}>{title}</h2>
        <span className="text-[10px] text-gray-500">{cards.length} premium</span>
      </div>

      <div
        className="relative w-full overflow-hidden rounded-lg border border-slate-200 bg-white shadow-sm"
        onMouseEnter={() => setPaused(true)}
        onMouseLeave={() => setPaused(false)}
      >
        <div
          className="flex w-max gap-2 py-1.5 px-1.5"
          style={{
            animationName: 'premium-reel-marquee',
            animationDuration: `${durationSec}s`,
            animationTimingFunction: 'linear',
            animationIterationCount: 'infinite',
            animationPlayState: paused ? 'paused' : 'running',
          }}
        >
          {track.map(renderCard)}
        </div>
      </div>

      <style>{`
        @keyframes premium-reel-marquee {
          0% { transform: translateX(0); }
          100% { transform: translateX(-50%); }
        }
      `}</style>
    </section>
  );
};

export default CompactPremiumReel;
