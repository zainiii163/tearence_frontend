import React, { useMemo } from 'react';
import { FiBriefcase, FiUser } from 'react-icons/fi';
import { BrowseListingCard, BrowseListingGrid } from '../shared/BrowseListingCard';
import { getStorageAssetUrl } from '../../utils/jobsHelpers';

/**
 * Affiliate marketplace cards — ClickBank-style programs & promoter posts.
 * Business offers open in-hub detail (join + tracking link).
 */
const AffiliateGrid = ({
  offers = [],
  loading = false,
  embedInBrowse = false,
}) => {
  const list = useMemo(() => (Array.isArray(offers) ? offers : []), [offers]);

  if (loading) {
    return <BrowseListingGrid loading compact columns={3} />;
  }

  if (!list.length) {
    return (
      <BrowseListingGrid
        emptyMessage="No affiliate programs found. Post a business offer or try different filters."
        compact
      />
    );
  }

  return (
    <div className={embedInBrowse ? '' : 'space-y-3'}>
      {!embedInBrowse && (
        <p className="text-sm text-gray-600">
          Browse programs to promote, or open an offer to join and get your unique tracking link.
        </p>
      )}
      <BrowseListingGrid compact columns={3}>
        {list.map((offer) => {
          const isBusiness = offer.contentType === 'business' || offer.type === 'business';
          const isLink = offer.contentType === 'link' || String(offer.id || '').startsWith('link-');
          const rawId = String(offer.id || '')
            .replace(/^business-/, '')
            .replace(/^user-/, '')
            .replace(/^link-/, '');

          const href = isBusiness
            ? `/affiliates/offer/${rawId}`
            : isLink
              ? offer.tracking_link || offer.affiliate_link || offer.link || '/affiliates'
              : offer.tracking_link || offer.affiliate_link || `/affiliates/offer/${rawId}`;

          const title =
            offer.product_service_title ||
            offer.title ||
            offer.business_name ||
            'Affiliate offer';

          const commission =
            offer.commission_rate != null
              ? offer.commission_type === 'fixed'
                ? `${offer.currency || '$'}${offer.commission_rate}`
                : `${offer.commission_rate}%`
              : offer.commission || null;

          const image =
            getStorageAssetUrl(offer.image || offer.image_url || offer.logo_url || offer.banner_url) ||
            offer.image ||
            offer.image_url ||
            null;

          const badge = offer.is_featured || offer.featured
            ? 'Featured'
            : offer.is_sponsored || offer.sponsored
              ? 'Sponsored'
              : offer.is_promoted || offer.promoted
                ? 'Promoted'
                : isBusiness
                  ? 'Program'
                  : isLink
                    ? 'Featured'
                    : 'Promoter';

          // External Filament link ads
          if (isLink && href && /^https?:/i.test(href)) {
            return (
              <BrowseListingCard
                key={offer.id}
                title={title}
                subtitle={offer.business_name || offer.category || 'Affiliate link'}
                priceLabel={commission || 'View'}
                location={[offer.city, offer.country].filter(Boolean).join(', ')}
                imageUrl={image}
                badge={badge}
                ctaLabel="Open"
                compact
                fallbackGradient="from-violet-600 to-rose-500"
                FallbackIcon={FiBriefcase}
                onClick={() => window.open(href, '_blank', 'noopener,noreferrer')}
              />
            );
          }

          return (
            <BrowseListingCard
              key={offer.id}
              href={isBusiness ? `/affiliates/offer/${rawId}` : undefined}
              onClick={
                !isBusiness && href
                  ? () => {
                      if (/^https?:/i.test(href)) {
                        window.open(href, '_blank', 'noopener,noreferrer');
                      }
                    }
                  : undefined
              }
              title={title}
              subtitle={
                offer.business_name ||
                offer.category ||
                offer.category_name ||
                (isBusiness ? 'Business program' : 'Promoter post')
              }
              priceLabel={commission || (isBusiness ? 'Join to promote' : 'Promote')}
              location={[offer.city, offer.country].filter(Boolean).join(', ')}
              imageUrl={image}
              badge={badge}
              ctaLabel={isBusiness ? 'View' : 'Open'}
              compact
              fallbackGradient={
                isBusiness ? 'from-violet-600 to-indigo-500' : 'from-rose-500 to-pink-500'
              }
              FallbackIcon={isBusiness ? FiBriefcase : FiUser}
            />
          );
        })}
      </BrowseListingGrid>
    </div>
  );
};

export default AffiliateGrid;
