import React, { useMemo, useState } from 'react';
import { Link } from 'react-router-dom';
import { getStorageAssetUrl } from '../../utils/jobsHelpers';
import { getResponsiveImageProps } from '../../utils/responsiveImage';
import { isFeaturedListing, isSponsoredListing } from '../../utils/listingPromotionSort';
import { formatBookPrice, getBookCoverUrl } from '../../utils/bookFormHelpers';

const resolveListingImage = (item) => {
  if (!item) return null;
  const direct =
    item.cover_image_url ||
    item.display_image_url ||
    item.image_url ||
    item.thumbnail_url ||
    item.main_image_url ||
    item.banner_image_url ||
    item.cover_image ||
    item.main_image ||
    item.image ||
    item.business_logo ||
    item.logo;
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

  const images = item.images || item.additional_images || item.gallery;
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

/**
 * Compact full-width horizontal reel for premium / featured adverts.
 * Only marquee-duplicates when there are enough unique cards — never stretch one listing.
 */
const CompactPremiumReel = ({
  items = [],
  title = 'Featured',
  getHref = (item) => (item?.id ? `/item/${item.id}` : '#'),
  onItemClick,
  maxItems = 12,
  accentClass = 'text-emerald-700',
  borderAccent = 'hover:border-emerald-300',
  /** 'books' = portrait covers + price (bookwriting.com style) */
  variant = 'default',
}) => {
  const [paused, setPaused] = useState(false);
  const isBooks = variant === 'books';

  const cards = useMemo(() => {
    const list = (Array.isArray(items) ? items : [])
      .slice(0, maxItems)
      .map((item) => ({
        ...item,
        _image: isBooks
          ? getBookCoverUrl(item) || resolveListingImage(item)
          : resolveListingImage(item),
        _badge: badgeFor(item),
        _title: item.title || item.name || item.business_name || 'Listing',
        _price: isBooks ? formatBookPrice(item) : null,
      }));
    return list;
  }, [items, maxItems, isBooks]);

  // Marquee only when we have enough unique items; otherwise a simple scroll row
  const useMarquee = cards.length >= 4;
  const track = useMemo(() => {
    if (!cards.length) return [];
    if (!useMarquee) return cards;
    return [...cards, ...cards];
  }, [cards, useMarquee]);

  if (!cards.length) return null;

  const durationSec = Math.max(22, Math.min(48, cards.length * 5 + 16));

  const renderCard = (item, index) => {
    const href = getHref(item);
    const priceIsFree = item._price === 'Free';

    const inner = isBooks ? (
      <>
        <div className="aspect-[2/3] w-full bg-slate-100 overflow-hidden">
          {item._image ? (
            <img
              src={item._image}
              alt={item._title}
              className="h-full w-full object-cover object-center"
              loading="lazy"
              onError={(e) => {
                e.currentTarget.style.display = 'none';
              }}
            />
          ) : (
            <div className="h-full w-full bg-gradient-to-br from-slate-200 to-slate-300" />
          )}
        </div>
        <div className="px-1 py-1.5 min-w-0">
          <p className="text-[11px] font-medium text-gray-900 line-clamp-2 leading-snug min-h-[2.2em]">
            {item._title}
          </p>
          <p
            className={`mt-1 text-[11px] font-medium ${
              priceIsFree ? 'text-sky-500' : 'text-slate-700'
            }`}
          >
            {item._price}
          </p>
        </div>
      </>
    ) : (
      <>
        <div className="h-[88px] sm:h-[108px] w-full bg-slate-100 overflow-hidden">
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
          <p className="text-[10px] font-semibold uppercase tracking-wide text-amber-700 truncate">
            {item._badge}
          </p>
          <p className="text-xs sm:text-sm font-semibold text-gray-900 truncate leading-tight">
            {item._title}
          </p>
        </div>
      </>
    );

    const className = isBooks
      ? `group shrink-0 w-[110px] sm:w-[128px] overflow-hidden bg-white ${borderAccent} hover:opacity-95 transition-all text-left`
      : `group shrink-0 w-[168px] sm:w-[196px] rounded-md overflow-hidden border border-slate-100 bg-white ${borderAccent} hover:shadow-sm transition-all text-left`;

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
        className={`relative w-full overflow-x-auto rounded-lg border border-slate-200 bg-white shadow-sm ${
          useMarquee ? 'overflow-hidden' : ''
        }`}
        onMouseEnter={() => setPaused(true)}
        onMouseLeave={() => setPaused(false)}
      >
        <div
          className={`flex gap-2 py-1.5 px-1.5 ${useMarquee ? 'w-max' : 'w-max min-w-full'}`}
          style={
            useMarquee
              ? {
                  animationName: 'premium-reel-marquee',
                  animationDuration: `${durationSec}s`,
                  animationTimingFunction: 'linear',
                  animationIterationCount: 'infinite',
                  animationPlayState: paused ? 'paused' : 'running',
                }
              : undefined
          }
        >
          {track.map(renderCard)}
        </div>
      </div>

      {useMarquee && (
        <style>{`
          @keyframes premium-reel-marquee {
            0% { transform: translateX(0); }
            100% { transform: translateX(-50%); }
          }
        `}</style>
      )}
    </section>
  );
};

export default CompactPremiumReel;
