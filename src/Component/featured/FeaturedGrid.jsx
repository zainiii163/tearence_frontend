import React, { memo } from 'react';
import { Link } from 'react-router-dom';
import { FiStar } from 'react-icons/fi';
import { BrowseListingCard, BrowseListingGrid } from '../shared/BrowseListingCard';
import {
  formatListingPrice,
  pickListingImage,
  normalizeBrowseAdvert,
} from '../../utils/normalizeBrowseAdvert';
import { resolveCrossFeedHref } from '../../utils/resolveCrossFeedHref';

const getFirstImage = (advert) =>
  advert?._resolved_image || pickListingImage(advert, { allowStock: true });

const formatPrice = (advert) =>
  advert?._resolved_price_label || formatListingPrice(advert, 'POA');

const badgeFor = (advert) => {
  const raw =
    advert.badge ||
    advert.badges?.[0] ||
    advert.upsell_tier ||
    (advert.featured || advert.is_featured ? 'Featured' : null) ||
    (advert.sponsored || advert.is_sponsored ? 'Sponsored' : null) ||
    (advert.promoted || advert.is_promoted ? 'Promoted' : null);
  if (!raw) return 'Featured';
  const label = String(raw);
  if (/standard/i.test(label)) return 'Featured';
  return label.charAt(0).toUpperCase() + label.slice(1);
};

const advertHref = (advert) => resolveCrossFeedHref(advert, '/featured-adverts');

const FeaturedListCard = memo(function FeaturedListCard({ advert, onView }) {
  const normalized = normalizeBrowseAdvert(advert);
  const imageUrl = getFirstImage(normalized);
  const location =
    [normalized.city, normalized.country].filter(Boolean).join(', ') ||
    normalized.location ||
    '';
  const href = advertHref(normalized);

  return (
    <Link
      to={href}
      onClick={(e) => {
        if (typeof onView === 'function') {
          e.preventDefault();
          onView(normalized);
        }
      }}
      className="group flex bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden hover:shadow-md transition-shadow"
    >
      <div className="relative w-28 sm:w-36 h-28 sm:h-36 bg-gray-100 shrink-0 overflow-hidden">
        {imageUrl ? (
          <img
            src={imageUrl}
            alt={normalized.title || 'Featured advert'}
            className="w-full h-full object-cover"
            loading="lazy"
            decoding="async"
          />
        ) : (
          <div className="w-full h-full bg-gradient-to-br from-amber-500 to-orange-600 flex items-center justify-center">
            <FiStar className="h-8 w-8 text-white/80" />
          </div>
        )}
      </div>
      <div className="min-w-0 flex-1 p-3 sm:p-4">
        <h3 className="font-bold text-gray-900 line-clamp-2 text-sm group-hover:text-amber-700">
          {normalized.title}
        </h3>
        <p className="text-lg font-bold text-gray-900 mt-1">{formatPrice(normalized)}</p>
        <div className="mt-1 space-y-0.5 text-xs text-gray-500">
          {(normalized.category_name || normalized.source_label || normalized.category?.name) && (
            <p className="truncate">
              {normalized.category_name || normalized.source_label || normalized.category?.name}
            </p>
          )}
          {location && <p className="truncate">{location}</p>}
        </div>
      </div>
    </Link>
  );
});

/**
 * Featured listings — same compact BrowseListingCard layout as Buy & Sell / Jobs / Services.
 */
const FeaturedGrid = ({
  adverts = [],
  loading = false,
  viewMode = 'grid',
  onViewAdvert,
}) => {
  const list = (Array.isArray(adverts) ? adverts : []).map(normalizeBrowseAdvert);

  if (loading) {
    return <BrowseListingGrid loading compact columns={3} />;
  }

  if (!list.length) {
    return (
      <BrowseListingGrid emptyMessage="No featured adverts found. Try adjusting your filters." compact />
    );
  }

  if (viewMode === 'list') {
    return (
      <div className="grid grid-cols-1 gap-3">
        {list.map((advert) => (
          <FeaturedListCard
            key={advert.id ?? advert.slug ?? advert.title}
            advert={advert}
            onView={onViewAdvert}
          />
        ))}
      </div>
    );
  }

  return (
    <BrowseListingGrid compact columns={3}>
      {list.map((advert) => {
        const location =
          [advert.city, advert.country].filter(Boolean).join(', ') || advert.location || '';
        const href = advertHref(advert);
        return (
          <BrowseListingCard
            key={advert.id ?? advert.slug ?? advert.title}
            href={typeof onViewAdvert === 'function' ? undefined : href}
            onClick={
              typeof onViewAdvert === 'function' ? () => onViewAdvert(advert) : undefined
            }
            title={advert.title}
            subtitle={advert.category_name || advert.source_label || advert.category?.name || ''}
            priceLabel={formatPrice(advert)}
            location={location}
            imageUrl={getFirstImage(advert)}
            badge={badgeFor(advert)}
            ctaLabel="View"
            compact
            fallbackGradient="from-amber-500 to-orange-600"
            FallbackIcon={FiStar}
          />
        );
      })}
    </BrowseListingGrid>
  );
};

export default FeaturedGrid;
