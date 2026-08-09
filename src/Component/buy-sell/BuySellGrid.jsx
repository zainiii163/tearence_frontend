import React, { memo } from 'react';
import { Link } from 'react-router-dom';
import { FiTag } from 'react-icons/fi';
import { getResponsiveImageProps } from '../../utils/responsiveImage';
import { BrowseListingCard, BrowseListingGrid } from '../shared/BrowseListingCard';
import { resolveListingImage, resolveImageUrl } from '../../utils/resolveImageUrl';

/** Real photo fallbacks when DB still has fake example.com seed URLs */
const TITLE_IMAGE_FALLBACKS = [
  [/iphone|smartphone|phone/i, 'https://images.unsplash.com/photo-1511707171634-5f897ff02aa9?auto=format&fit=crop&w=800&q=80'],
  [/camry|toyota|car|vehicle/i, 'https://images.unsplash.com/photo-1621007947382-bb3c3994e3fb?auto=format&fit=crop&w=800&q=80'],
  [/rolex|watch/i, 'https://images.unsplash.com/photo-1523170335258-f5ed11844a49?auto=format&fit=crop&w=800&q=80'],
  [/macbook|laptop/i, 'https://images.unsplash.com/photo-1517336714731-489689fd1ca8?auto=format&fit=crop&w=800&q=80'],
  [/sofa|couch|leather/i, 'https://images.unsplash.com/photo-1555041469-a586c61ea9bc?auto=format&fit=crop&w=800&q=80'],
  [/jordan|nike|shoe|sneaker/i, 'https://images.unsplash.com/photo-1542291026-7eec264c27ff?auto=format&fit=crop&w=800&q=80'],
  [/peloton|bike|fitness/i, 'https://images.unsplash.com/photo-1534438327276-14e5300c3a48?auto=format&fit=crop&w=800&q=80'],
  [/canon|camera|dslr/i, 'https://images.unsplash.com/photo-1516035069371-29a1b244cc32?auto=format&fit=crop&w=800&q=80'],
  [/dining|table|furniture/i, 'https://images.unsplash.com/photo-1617806118233-18e1de247200?auto=format&fit=crop&w=800&q=80'],
];

const fallbackImageForTitle = (title = '') => {
  for (const [re, url] of TITLE_IMAGE_FALLBACKS) {
    if (re.test(title)) return url;
  }
  return 'https://images.unsplash.com/photo-1557804506-669a67965ba0?auto=format&fit=crop&w=800&q=80';
};

const getFirstImage = (advert) =>
  resolveListingImage(advert) ||
  resolveImageUrl(advert?.images) ||
  resolveImageUrl(advert?.main_image) ||
  fallbackImageForTitle(advert?.title);

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
            {...getResponsiveImageProps(imageUrl, { variant: 'thumb' })}
            alt={advert.title || 'Item'}
            className="w-full h-full object-cover"
            loading="lazy"
            decoding="async"
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

const BuySellGrid = ({ adverts, loading, viewMode = 'grid', maxItems = null }) => {
  const advertsArray = Array.isArray(adverts) ? adverts : adverts?.items || [];
  const visible =
    maxItems != null && Number(maxItems) > 0
      ? advertsArray.slice(0, Number(maxItems))
      : advertsArray;

  if (loading) {
    return <BrowseListingGrid loading compact columns={3} />;
  }

  if (visible.length === 0) {
    return <BrowseListingGrid emptyMessage="No items found. Try adjusting your filters." compact />;
  }

  if (viewMode === 'list') {
    return (
      <div className="grid grid-cols-1 gap-3">
        {visible.map((advert) => (
          <AdvertListCard key={advert.id ?? advert.slug ?? advert.title} advert={advert} />
        ))}
      </div>
    );
  }

  return (
    <BrowseListingGrid compact columns={3}>
      {visible.map((advert) => {
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
            compact
            fallbackGradient="from-[#1e3a5f] to-emerald-500"
          />
        );
      })}
    </BrowseListingGrid>
  );
};

export default BuySellGrid;
