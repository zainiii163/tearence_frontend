import React from 'react';
import { FaBuilding } from 'react-icons/fa';
import { BrowseListingCard, BrowseListingGrid } from '../shared/BrowseListingCard';

/** Business cards — same CarServices card size as other category pages. */
const BusinessListingsGrid = ({ businesses = [], loading = false, onBusinessClick }) => {
  if (loading) {
    return <BrowseListingGrid loading />;
  }

  if (!businesses.length) {
    return <BrowseListingGrid emptyMessage="No businesses found. Try adjusting filters." />;
  }

  const badgeFor = (business) => {
    if (business.is_featured || business.featured) return 'Featured';
    if (business.is_sponsored || business.sponsored) return 'Sponsored';
    if (business.is_promoted || business.promoted) return 'Promoted';
    return null;
  };

  return (
    <BrowseListingGrid>
      {businesses.map((business, index) => (
        <BrowseListingCard
          key={business.id || business.slug || index}
          onClick={() => onBusinessClick?.(business.id)}
          title={business.business_name}
          subtitle={business.category_name || business.category || business.business_type || ''}
          priceLabel={null}
          location={
            [business.city, business.country].filter(Boolean).join(', ') ||
            business.business_address ||
            ''
          }
          imageUrl={business.business_logo || null}
          badge={badgeFor(business)}
          ctaLabel="View"
          fallbackGradient="from-[#1e3a5f] to-purple-500"
          FallbackIcon={FaBuilding}
        />
      ))}
    </BrowseListingGrid>
  );
};

export default BusinessListingsGrid;
