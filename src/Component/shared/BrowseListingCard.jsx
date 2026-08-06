import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { FiUser } from 'react-icons/fi';
import { getResponsiveImageProps } from '../../utils/responsiveImage';

/**
 * CarServices-style listing card — same size/layout on every category page.
 * Image → title → category → price → location → navy CTA.
 */
export const BrowseListingCard = ({
  title,
  subtitle,
  priceLabel,
  location,
  imageUrl,
  badge,
  ctaLabel = 'View',
  href,
  onClick,
  fallbackGradient = 'from-[#1e3a5f] to-teal-500',
  FallbackIcon = FiUser,
  compact = false,
}) => {
  const [imgFailed, setImgFailed] = useState(false);
  const showImage = imageUrl && !imgFailed;
  const responsive = showImage
    ? getResponsiveImageProps(imageUrl, { variant: compact ? 'thumb' : 'card' })
    : null;

  const media = (
    <div
      className={`relative bg-gray-100 overflow-hidden ${
        compact ? 'h-14 sm:h-16' : 'h-24 sm:h-28'
      }`}
    >
      {showImage ? (
        <img
          src={responsive.src}
          srcSet={responsive.srcSet}
          sizes={responsive.sizes}
          alt={title || 'Listing'}
          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
          loading="lazy"
          decoding="async"
          onError={() => setImgFailed(true)}
        />
      ) : (
        <div
          className={`w-full h-full bg-gradient-to-br ${fallbackGradient} flex items-center justify-center`}
        >
          <FallbackIcon className={`${compact ? 'h-6 w-6' : 'h-8 w-8'} text-white/70`} />
        </div>
      )}
      {badge && (
        <span className="absolute top-1 left-1 px-1 py-0.5 text-[8px] font-bold uppercase tracking-wide bg-black/70 text-white rounded">
          {badge}
        </span>
      )}
    </div>
  );

  const body = (
    <div className={`flex flex-col flex-1 ${compact ? 'p-1.5' : 'p-2.5 sm:p-3'}`}>
      <h3
        className={`font-bold text-gray-900 line-clamp-2 leading-snug ${
          compact ? 'text-[10px] sm:text-[11px]' : 'text-xs sm:text-sm'
        }`}
      >
        {title || 'Untitled'}
      </h3>
      {subtitle && (
        <p className={`text-gray-500 mt-0.5 truncate ${compact ? 'text-[9px]' : 'text-[11px]'}`}>
          {subtitle}
        </p>
      )}
      {priceLabel != null && priceLabel !== '' && (
        <p
          className={`font-bold text-gray-900 mt-0.5 leading-none ${
            compact ? 'text-xs sm:text-sm' : 'text-base sm:text-lg mt-1.5'
          }`}
        >
          {priceLabel}
        </p>
      )}
      {location && (
        <p className={`text-gray-500 mt-0.5 truncate ${compact ? 'text-[9px]' : 'text-[11px] mt-1'}`}>
          {location}
        </p>
      )}
      <span
        className={`mt-auto inline-flex items-center justify-center w-full rounded-full bg-[#1e3a5f] text-white font-bold group-hover:bg-[#162d4a] transition-colors ${
          compact ? 'mt-1 py-0.5 text-[9px]' : 'pt-2 py-1.5 text-xs'
        }`}
      >
        {ctaLabel}
      </span>
    </div>
  );

  const className = compact
    ? 'group flex flex-col h-full bg-white rounded-md shadow-sm border border-gray-100 overflow-hidden hover:shadow-md transition-shadow text-left'
    : 'group flex flex-col h-full bg-white rounded-xl shadow-[0_2px_10px_rgba(0,0,0,0.06)] border border-gray-100 overflow-hidden hover:shadow-[0_4px_14px_rgba(0,0,0,0.1)] transition-shadow text-left';

  if (href) {
    return (
      <Link to={href} className={className}>
        {media}
        {body}
      </Link>
    );
  }

  return (
    <button type="button" onClick={onClick} className={className}>
      {media}
      {body}
    </button>
  );
};

export const BrowseListingGrid = ({
  children,
  loading,
  emptyMessage = 'No listings found.',
  compact = false,
  columns = 'default',
}) => {
  const resolvedGrid =
    columns === 3 || compact
      ? 'grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-1.5 sm:gap-2'
      : 'grid grid-cols-2 sm:grid-cols-3 xl:grid-cols-4 gap-2 sm:gap-3';

  if (loading) {
    return (
      <div className={resolvedGrid}>
        {Array.from({ length: compact ? 9 : 6 }).map((_, i) => (
          <div
            key={i}
            className={`bg-white border border-gray-100 overflow-hidden animate-pulse shadow-sm ${
              compact ? 'rounded-md' : 'rounded-2xl'
            }`}
          >
            <div className={compact ? 'h-14 sm:h-16 bg-gray-200' : 'h-24 sm:h-28 bg-gray-200'} />
            <div className={`space-y-1.5 ${compact ? 'p-1.5' : 'p-2.5'}`}>
              <div className="h-2.5 bg-gray-200 rounded w-4/5" />
              <div className="h-2.5 bg-gray-200 rounded w-1/2" />
              <div className="h-4 bg-gray-200 rounded w-1/3 mt-0.5" />
            </div>
          </div>
        ))}
      </div>
    );
  }

  if (!children || (Array.isArray(children) && children.length === 0)) {
    return (
      <div className="text-center py-12 bg-white rounded-2xl border border-gray-100 shadow-sm">
        <p className="text-sm text-gray-600">{emptyMessage}</p>
      </div>
    );
  }

  return <div className={resolvedGrid}>{children}</div>;
};

export default BrowseListingCard;
