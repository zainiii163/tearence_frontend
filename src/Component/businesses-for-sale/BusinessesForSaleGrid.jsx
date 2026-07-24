import React from 'react';
import { FiBriefcase } from 'react-icons/fi';
import { resolveStorageUrl } from '../../utils/dashboardEditMappers';
import { BrowseListingCard, BrowseListingGrid } from '../shared/BrowseListingCard';

/** Businesses-for-sale cards — same CarServices card size as other category pages. */
const BusinessesForSaleGrid = ({ listings = [], loading }) => {
  if (loading) {
    return <BrowseListingGrid loading />;
  }

  if (!listings.length) {
    return <BrowseListingGrid emptyMessage="No businesses for sale found yet." />;
  }

  return (
    <BrowseListingGrid>
      {listings.map((item) => {
        const slug = item.slug || item.id;
        const image = resolveStorageUrl(item.main_image || item.image) || null;
        const location = [item.city, item.country].filter(Boolean).join(', ');
        const price = item.price ?? item.asking_price;

        return (
          <BrowseListingCard
            key={item.id || slug}
            href={`/sponsored/${slug}`}
            title={item.title}
            subtitle={item.category || item.business_type || 'Business for sale'}
            priceLabel={
              price != null && price !== ''
                ? `${item.currency || 'GBP'} ${Number(price).toLocaleString()}`
                : 'POA'
            }
            location={location}
            imageUrl={image}
            badge="Sale"
            ctaLabel="View"
            fallbackGradient="from-[#1e3a5f] to-amber-500"
            FallbackIcon={FiBriefcase}
          />
        );
      })}
    </BrowseListingGrid>
  );
};

export default BusinessesForSaleGrid;
