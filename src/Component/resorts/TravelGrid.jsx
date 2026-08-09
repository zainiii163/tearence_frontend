import React from 'react';
import { FiMapPin } from 'react-icons/fi';
import { BrowseListingCard, BrowseListingGrid } from '../shared/BrowseListingCard';
import { getTravelImageUrl } from '../../utils/travelFormHelpers';

const getDisplayPrice = (advert) => {
  if (advert.price_per_night != null && advert.price_per_night !== '') {
    return { amount: advert.price_per_night, label: '/night' };
  }
  if (advert.price_per_trip != null && advert.price_per_trip !== '') {
    return { amount: advert.price_per_trip, label: '/trip' };
  }
  if (advert.price_per_service != null && advert.price_per_service !== '') {
    return { amount: advert.price_per_service, label: '/service' };
  }
  if (advert.price != null && advert.price !== '') {
    return { amount: advert.price, label: '' };
  }
  return null;
};

const formatPriceLabel = (advert) => {
  const display = getDisplayPrice(advert);
  if (!display) return 'Contact for price';
  const currency = advert.currency || '$';
  const amount = Number(display.amount);
  const formatted = Number.isFinite(amount)
    ? amount.toLocaleString(undefined, { maximumFractionDigits: 0 })
    : display.amount;
  return `${currency}${formatted}${display.label}`;
};

const badgeFor = (advert) => {
  const tier = String(advert.promotion_tier || '').toLowerCase();
  if (advert.featured || advert.is_featured || tier === 'featured') return 'Featured';
  if (advert.sponsored || advert.is_sponsored || tier === 'sponsored') return 'Sponsored';
  if (advert.promoted || advert.is_promoted || tier === 'promoted') return 'Promoted';
  if (tier === 'network_wide') return 'Network';
  return null;
};

/**
 * Travel listing cards — same BrowseListingCard size/layout as Buy & Sell / Vehicles / Services.
 */
const TravelGrid = ({ adverts, loading = false }) => {
  const list = Array.isArray(adverts) ? adverts : [];

  if (loading) {
    return <BrowseListingGrid loading compact columns={3} />;
  }

  if (list.length === 0) {
    return (
      <BrowseListingGrid
        emptyMessage="No travel services found. Try adjusting your filters."
        compact
      />
    );
  }

  return (
    <BrowseListingGrid compact columns={3}>
      {list.map((advert) => {
        const typeLabel = advert.advert_type
          ? String(advert.advert_type).replace(/_/g, ' ')
          : advert.category?.name || '';
        return (
          <BrowseListingCard
            key={advert.id ?? advert.slug ?? advert.title}
            href={`/resorts-travel/${advert.slug || advert.id}`}
            title={advert.title}
            subtitle={advert.business_name || typeLabel}
            priceLabel={formatPriceLabel(advert)}
            location={[advert.city, advert.country].filter(Boolean).join(', ')}
            imageUrl={advert.display_image_url || getTravelImageUrl(advert)}
            badge={badgeFor(advert)}
            ctaLabel="View"
            compact
            fallbackGradient="from-[#1e3a5f] to-cyan-500"
            FallbackIcon={FiMapPin}
          />
        );
      })}
    </BrowseListingGrid>
  );
};

export default TravelGrid;
