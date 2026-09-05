import React from 'react';
import { FiTruck } from 'react-icons/fi';
import { BrowseListingCard, BrowseListingGrid } from '../shared/BrowseListingCard';
import { resolveStorageUrl } from '../../utils/dashboardEditMappers';
import {
  interleaveSponsored,
  SponsoredFeedCard,
} from '../shared/SponsoredInFeed';

/** Vehicle cards — navigate instantly; detail page already increments views.
 *  Clive: paid sponsored site ads appear between vehicle cards in the hub feed.
 */
const VehicleGrid = ({ vehicles, sponsoredAds = [], injectEvery = 4 }) => {
  const getImageUrl = (imagePath) => {
    if (!imagePath || imagePath === 'null' || imagePath === '') return null;
    if (String(imagePath).startsWith('http')) return imagePath;
    return resolveStorageUrl(imagePath) || imagePath;
  };

  const getPromotionBadge = (vehicle) => {
    if (vehicle.is_featured || vehicle.featured) return 'Featured';
    if (vehicle.is_sponsored || vehicle.sponsored) return 'Sponsored';
    if (vehicle.is_promoted || vehicle.promoted) return 'Promoted';
    return null;
  };

  if (!vehicles || !Array.isArray(vehicles) || vehicles.length === 0) {
    if (sponsoredAds?.length) {
      return (
        <BrowseListingGrid>
          {sponsoredAds.map((ad) => (
            <SponsoredFeedCard key={ad.id} ad={ad} />
          ))}
        </BrowseListingGrid>
      );
    }
    return <BrowseListingGrid emptyMessage="No vehicles found. Try adjusting filters." />;
  }

  const mixed = interleaveSponsored(vehicles, sponsoredAds, injectEvery);

  return (
    <BrowseListingGrid>
      {mixed.map((item) => {
        if (item?.kind === 'sponsored') {
          return <SponsoredFeedCard key={item.id} ad={item} />;
        }
        const vehicle = item;
        return (
          <BrowseListingCard
            key={vehicle.id}
            href={`/vehicles/${vehicle.id}`}
            title={vehicle.title || 'Untitled Vehicle'}
            subtitle={[
              vehicle.year,
              vehicle.make?.name || vehicle.make,
              vehicle.vehicle_model?.name || vehicle.model,
            ]
              .filter(Boolean)
              .join(' · ')}
            priceLabel={`$${vehicle.price ? Number(vehicle.price).toLocaleString() : '0'}`}
            location={[vehicle.city, vehicle.country].filter(Boolean).join(', ')}
            imageUrl={getImageUrl(vehicle.main_image)}
            badge={getPromotionBadge(vehicle)}
            ctaLabel="View"
            fallbackGradient="from-[#1e3a5f] to-red-500"
            FallbackIcon={FiTruck}
          />
        );
      })}
    </BrowseListingGrid>
  );
};

export default VehicleGrid;
