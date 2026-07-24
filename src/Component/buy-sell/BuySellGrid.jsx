import React, { memo } from 'react';
import { Link } from 'react-router-dom';
import { FiTag } from 'react-icons/fi';
import { getStorageAssetUrl } from '../../utils/jobsHelpers';
import { BrowseListingCard, BrowseListingGrid } from '../shared/BrowseListingCard';

const getFirstImage = (advert) => {
  if (!advert?.images) return null;

  const candidates = [];

  if (typeof advert.images === 'object' && !Array.isArray(advert.images)) {
    for (const value of Object.values(advert.images)) {
      if (typeof value === 'string') candidates.push(value);
    }
  }

  if (Array.isArray(advert.images)) {
    for (const img of advert.images) {
      const url = typeof img === 'string' ? img : img?.url || img?.full_url || img?.path;
      if (url) candidates.push(url);
    }
  }

  for (const raw of candidates) {
    const resolved = getStorageAssetUrl(raw);
    if (resolved) return resolved;
  }

  return null;
};

const formatPrice = (price, currency = 'USD') => {
  if (price === 0 || price === '0') return 'FREE';
  if (price == null || price === '') return '0';
  try {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: currency || 'USD',
      maximumFractionDigits: 0,
    }).format(Number(price));
  } catch {
    return `${currency} ${price}`;
  }
};

const badgeFor = (advert) => {
  if (advert.featured || advert.is_featured) return 'Featured';
  if (advert.sponsored || advert.is_sponsored) return 'Sponsored';
  if (advert.promoted || advert.is_promoted) return 'Promoted';
  return null;
};

const AdvertListCard = memo(function AdvertListCard({ advert }) {
  const imageUrl = getFirstImage(advert);
  const location = advert.location || advert.city || advert.country || '';
  const condition = advert.condition?.replace(/_/g, ' ');

  return (
    <Link
      to={`/item/${advert.id}`}
      className="group flex bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden hover:shadow-md transition-shadow"
    >
      <div className="relative w-28 sm:w-36 h-28 sm:h-36 bg-gray-100 shrink-0 overflow-hidden">
        {imageUrl ? (
          <img
            src={imageUrl}
            alt={advert.title || 'Item'}
            className="w-full h-full object-cover"
            loading="lazy"
          />
        ) : (
          <div className="w-full h-full bg-gradient-to-br from-[#1e3a5f] to-teal-500" />
        )}
      </div>
      <div className="min-w-0 flex-1 p-3 sm:p-4">
        <h3 className="font-bold text-gray-900 line-clamp-2 text-sm group-hover:text-[#1e3a5f]">
          {advert.title}
        </h3>
        <p className="text-lg font-bold text-gray-900 mt-1">
          {formatPrice(advert.price, advert.currency)}
        </p>
        <div className="mt-1 space-y-0.5 text-xs text-gray-500">
          {condition && (
            <p className="flex items-center gap-1 capitalize truncate">
              <FiTag className="h-3 w-3 shrink-0" />
              {condition}
            </p>
          )}
          {location && <p className="truncate">{location}</p>}
        </div>
      </div>
    </Link>
  );
});

const BuySellGrid = ({ adverts, loading, viewMode = 'grid' }) => {
  const advertsArray = Array.isArray(adverts) ? adverts : adverts?.items || [];

  if (loading) {
    return <BrowseListingGrid loading />;
  }

  if (advertsArray.length === 0) {
    return <BrowseListingGrid emptyMessage="No items found. Try adjusting your filters." />;
  }

  if (viewMode === 'list') {
    return (
      <div className="grid grid-cols-1 gap-3">
        {advertsArray.map((advert) => (
          <AdvertListCard key={advert.id ?? advert.slug ?? advert.title} advert={advert} />
        ))}
      </div>
    );
  }

  return (
    <BrowseListingGrid>
      {advertsArray.map((advert) => {
        const condition = advert.condition?.replace(/_/g, ' ');
        return (
          <BrowseListingCard
            key={advert.id ?? advert.slug ?? advert.title}
            href={`/item/${advert.id}`}
            title={advert.title}
            subtitle={condition || advert.category || ''}
            priceLabel={formatPrice(advert.price, advert.currency)}
            location={advert.location || advert.city || advert.country || ''}
            imageUrl={getFirstImage(advert)}
            badge={badgeFor(advert)}
            ctaLabel="View"
            fallbackGradient="from-[#1e3a5f] to-emerald-500"
          />
        );
      })}
    </BrowseListingGrid>
  );
};

export default BuySellGrid;
