import React from 'react';
import { FiTruck } from 'react-icons/fi';
import { BrowseListingCard, BrowseListingGrid } from '../shared/BrowseListingCard';
import { resolveStorageUrl } from '../../utils/dashboardEditMappers';

/** Vehicle cards — navigate instantly; detail page already increments views. */
const VehicleGrid = ({ vehicles }) => {
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
    return <BrowseListingGrid emptyMessage="No vehicles found. Try adjusting filters." />;
  }

  return (
    <BrowseListingGrid>
      {vehicles.map((vehicle) => (
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
      ))}
    </BrowseListingGrid>
  );
};

export default VehicleGrid;
