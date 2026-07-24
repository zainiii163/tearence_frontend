import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { FiUser } from 'react-icons/fi';

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
}) => {
  const [imgFailed, setImgFailed] = useState(false);
  const showImage = imageUrl && !imgFailed;

  const media = (
    <div className="relative h-28 sm:h-32 bg-gray-100 overflow-hidden">
      {showImage ? (
        <img
          src={imageUrl}
          alt={title || 'Listing'}
          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
          loading="lazy"
          onError={() => setImgFailed(true)}
        />
      ) : (
        <div
          className={`w-full h-full bg-gradient-to-br ${fallbackGradient} flex items-center justify-center`}
        >
          <FallbackIcon className="h-8 w-8 text-white/70" />
        </div>
      )}
      {badge && (
        <span className="absolute top-1.5 left-1.5 px-1.5 py-0.5 text-[9px] font-bold uppercase tracking-wide bg-black/70 text-white rounded">
          {badge}
        </span>
      )}
    </div>
  );

  const body = (
    <div className="p-2.5 sm:p-3 flex flex-col flex-1">
      <h3 className="text-xs sm:text-sm font-bold text-gray-900 line-clamp-2 leading-snug">
        {title || 'Untitled'}
      </h3>
      {subtitle && (
        <p className="text-[11px] text-gray-500 mt-0.5 truncate">{subtitle}</p>
      )}
      {priceLabel != null && priceLabel !== '' && (
        <p className="text-base sm:text-lg font-bold text-gray-900 mt-1.5 leading-none">
          {priceLabel}
        </p>
      )}
      {location && (
        <p className="text-[11px] text-gray-500 mt-1 truncate">{location}</p>
      )}
      <span className="mt-auto pt-2 inline-flex items-center justify-center w-full py-1.5 rounded-full bg-[#1e3a5f] text-white text-xs font-bold group-hover:bg-[#162d4a] transition-colors">
        {ctaLabel}
      </span>
    </div>
  );

  const className =
    'group flex flex-col h-full bg-white rounded-xl shadow-[0_2px_10px_rgba(0,0,0,0.06)] border border-gray-100 overflow-hidden hover:shadow-[0_4px_14px_rgba(0,0,0,0.1)] transition-shadow text-left';

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

export const BrowseListingGrid = ({ children, loading, emptyMessage = 'No listings found.' }) => {
  if (loading) {
    return (
      <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-4">
        {Array.from({ length: 6 }).map((_, i) => (
          <div
            key={i}
            className="bg-white rounded-2xl border border-gray-100 overflow-hidden animate-pulse shadow-sm"
          >
            <div className="h-40 bg-gray-200" />
            <div className="p-4 space-y-2">
              <div className="h-4 bg-gray-200 rounded w-4/5" />
              <div className="h-3 bg-gray-200 rounded w-1/2" />
              <div className="h-7 bg-gray-200 rounded w-1/3 mt-2" />
              <div className="h-9 bg-gray-200 rounded-full mt-3" />
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

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-4">{children}</div>
  );
};

export default BrowseListingCard;
