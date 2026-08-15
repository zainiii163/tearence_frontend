import React, { useCallback } from 'react';
import { Briefcase } from 'lucide-react';
import { formatCountry } from '../../utils/apiResponseHelpers';
import { getStorageAssetUrl } from '../../utils/jobsHelpers';
import { BrowseListingCard, BrowseListingGrid } from '../shared/BrowseListingCard';

/** Service cards — CarServices size/layout shared across category pages. */
const ServicesGrid = ({ services, loading, compact = true }) => {
  const resolveMediaUrl = useCallback((mediaOrPath) => {
    if (!mediaOrPath) return null;
    if (typeof mediaOrPath === 'string') return getStorageAssetUrl(mediaOrPath) || mediaOrPath;
    return (
      getStorageAssetUrl(mediaOrPath.full_url || mediaOrPath.file_path || mediaOrPath.url || mediaOrPath.path) ||
      mediaOrPath.full_url ||
      mediaOrPath.file_path ||
      mediaOrPath.url ||
      mediaOrPath.path ||
      null
    );
  }, []);

  if (loading) {
    return <BrowseListingGrid loading compact={compact} columns={3} />;
  }

  if (!services || services.length === 0) {
    return (
      <BrowseListingGrid
        emptyMessage="No services found. Try adjusting filters."
        compact={compact}
      />
    );
  }

  return (
    <BrowseListingGrid compact={compact} columns={3}>
      {services.map((service) => {
        const thumb = service.media?.find((m) => m.is_thumbnail || m.isThumbnail) || service.media?.[0];
        const thumbUrl = resolveMediaUrl(thumb);
        const provider =
          service.service_provider?.business_name ||
          service.serviceProvider?.business_name ||
          service.user?.name ||
          '';
        const location = [service.city, formatCountry(service.country)].filter(Boolean).join(', ');
        const price = service.starting_price ?? service.price;
        const promo =
          service.promotion_type && service.promotion_type !== 'standard'
            ? service.promotion_type === 'network_boost'
              ? 'Network'
              : service.promotion_type
            : null;
        const category =
          service.category?.name ||
          service.category_name ||
          service.subcategory?.name ||
          '';
        const subtitle = [category, provider].filter(Boolean).join(' · ');

        return (
          <BrowseListingCard
            key={service.id}
            href={`/services/${service.id}`}
            title={service.title}
            subtitle={subtitle}
            priceLabel={
              price != null && price !== ''
                ? `$${Number(price).toLocaleString()}`
                : '0'
            }
            location={location}
            imageUrl={thumbUrl}
            badge={promo}
            ctaLabel="View"
            compact={compact}
            fallbackGradient="from-[#1e3a5f] to-teal-500"
            FallbackIcon={Briefcase}
          />
        );
      })}
    </BrowseListingGrid>
  );
};

export default ServicesGrid;
