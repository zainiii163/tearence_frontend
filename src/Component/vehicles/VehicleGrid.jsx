import React from 'react';
import { useNavigate } from 'react-router-dom';
import { FiTruck } from 'react-icons/fi';
import { incrementVehicleViews } from '../../services/vehiclesAPI';
import { BrowseListingCard, BrowseListingGrid } from '../shared/BrowseListingCard';

/** Vehicle cards — same CarServices card size as other category pages. */
const VehicleGrid = ({ vehicles }) => {
  const navigate = useNavigate();

  const getImageUrl = (imagePath) => {
    if (!imagePath || imagePath === 'null' || imagePath === '') return null;
    if (imagePath.startsWith('http')) return imagePath;
    return `${process.env.REACT_APP_STORAGE_URL || 'https://api.worldwideadverts.info/storage'}/${imagePath}`;
  };

  const handleViewVehicle = async (vehicleId) => {
    try {
      await incrementVehicleViews(vehicleId);
    } catch {
      // ignore view tracking errors
    }
    navigate(`/vehicle/${vehicleId}`);
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
          onClick={() => handleViewVehicle(vehicle.id)}
          title={vehicle.title || 'Untitled Vehicle'}
          subtitle={[vehicle.year, vehicle.make, vehicle.model].filter(Boolean).join(' · ')}
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
