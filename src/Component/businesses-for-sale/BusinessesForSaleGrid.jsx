import React from 'react';
import { FiBriefcase } from 'react-icons/fi';
import { resolveStorageUrl } from '../../utils/dashboardEditMappers';
import { BrowseListingCard, BrowseListingGrid } from '../shared/BrowseListingCard';

import { getCategoryById } from './businessesForSaleCategories';

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
        const saleCat = getCategoryById(item.business_sale_category);
        const subtitle =
          saleCat?.name ||
          (item.business_sale_type === 'online'
            ? 'Online business'
            : item.business_sale_type === 'physical'
              ? 'Physical business'
              : null) ||
          (typeof item.category === 'object' ? item.category?.name : item.category) ||
          item.business_type ||
          'Business for sale';

        return (
          <BrowseListingCard
            key={item.id || slug}
            href={`/businesses-for-sale/${slug}`}
            title={item.title}
            subtitle={subtitle}
            priceLabel={
              price != null && price !== ''
                ? `${item.currency || 'GBP'} ${Number(String(price).replace(/,/g, '')).toLocaleString()}`
                : 'POA'
            }
            location={location}
            imageUrl={image}
            badge="Sale"
            ctaLabel="Enquire"
            fallbackGradient="from-[#1e3a5f] to-amber-500"
            FallbackIcon={FiBriefcase}
          />
        );
      })}
    </BrowseListingGrid>
  );
};

export default BusinessesForSaleGrid;
