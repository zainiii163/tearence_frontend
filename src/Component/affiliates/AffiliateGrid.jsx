import React, { useMemo } from 'react';
import { FiBriefcase, FiUser, FiExternalLink } from 'react-icons/fi';
import { BrowseListingCard, BrowseListingGrid } from '../shared/BrowseListingCard';
import { getStorageAssetUrl } from '../../utils/jobsHelpers';

/**
 * Affiliate marketplace cards.
 * - Business offers → program detail (join + WWA hop)
 * - Filament / WWA affiliate links → open ClickBank hop (view-only, already promoting)
 * - User posts → affiliate adverts (open external hop as posted)
 */
const AffiliateGrid = ({
  offers = [],
  loading = false,
  embedInBrowse = false,
  hubMode = 'programs',
  onItemClick,
  trackClick,
}) => {
  const list = useMemo(() => (Array.isArray(offers) ? offers : []), [offers]);
  const isLinksHub = hubMode === 'links';

  const openExternal = async (offer, href, type) => {
    const rawId = String(offer.id || '')
      .replace(/^business-/, '')
      .replace(/^user-/, '')
      .replace(/^link-/, '');
    // API trackClick currently accepts business|user only
    if (type === 'business' || type === 'user') {
      try {
        if (typeof onItemClick === 'function') await onItemClick(type, rawId);
        else if (typeof trackClick === 'function') await trackClick(type, rawId);
      } catch {
        /* tracking must not block open */
      }
    }
    window.open(href, '_blank', 'noopener,noreferrer');
  };

  if (loading) {
    return <BrowseListingGrid loading compact columns={3} />;
  }

  if (!list.length) {
    return (
      <BrowseListingGrid
        emptyMessage={
          isLinksHub
            ? 'No affiliate link ads found. Try different filters.'
            : 'No affiliate programs found. Publish a program or try different filters.'
        }
        compact
      />
    );
  }

  return (
    <div className={embedInBrowse ? '' : 'space-y-3'}>
      {!embedInBrowse && (
        <p className="text-sm text-gray-600">
          {isLinksHub
            ? 'These affiliate posts are already being promoted. Open the hop link to view — they are not joinable programs.'
            : 'Browse programs to promote, then open an offer to apply and get your unique tracking hop link.'}
        </p>
      )}
      <BrowseListingGrid compact={!isLinksHub} dense={isLinksHub} columns={isLinksHub ? 2 : 3}>
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

          const cookieDays = offer.cookie_duration ?? offer.cookieDuration;
          const cookieLabel =
            cookieDays != null && cookieDays !== ''
              ? `${cookieDays}-day cookie`
              : null;

          const locationBits = [
            [offer.city, offer.country].filter(Boolean).join(', '),
            cookieLabel,
          ].filter(Boolean);

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
                    ? 'WWA hop'
                    : 'Affiliate post';

          // Filament / WWA affiliate link ads — open ClickBank hop as posted (view only)
          if (isLink && href && /^https?:/i.test(href)) {
            return (
              <BrowseListingCard
                key={offer.id}
                title={title}
                subtitle={offer.business_name || offer.category || 'Already promoting'}
                priceLabel={
                  commission
                    ? cookieLabel
                      ? `${commission} · ${cookieLabel}`
                      : commission
                    : 'View hop'
                }
                location={locationBits.join(' · ')}
                imageUrl={image}
                badge={badge}
                ctaLabel="Open hop"
                compact
                dense={isLinksHub}
                fallbackGradient="from-violet-600 to-rose-500"
                FallbackIcon={FiExternalLink}
                onClick={() => openExternal(offer, href, 'link')}
              />
            );
          }

          // User promoter posts — affiliate adverts; open hop URL as posted
          if (!isBusiness && href && /^https?:/i.test(href)) {
            return (
              <BrowseListingCard
                key={offer.id}
                title={title}
                subtitle={
                  offer.business_name ||
                  offer.category ||
                  offer.category_name ||
                  'Affiliate advert'
                }
                priceLabel={
                  commission
                    ? cookieLabel
                      ? `${commission} · ${cookieLabel}`
                      : commission
                    : 'View hop'
                }
                location={locationBits.join(' · ')}
                imageUrl={image}
                badge={badge}
                ctaLabel="Open hop"
                compact
                dense={isLinksHub}
                fallbackGradient="from-rose-500 to-pink-500"
                FallbackIcon={FiUser}
                onClick={() => openExternal(offer, href, 'user')}
              />
            );
          }

          return (
            <BrowseListingCard
              key={offer.id}
              href={isBusiness ? `/affiliates/offer/${rawId}` : undefined}
              title={title}
              subtitle={
                offer.business_name ||
                offer.category ||
                offer.category_name ||
                (isBusiness ? 'Business program' : 'Affiliate advert')
              }
              priceLabel={
                commission
                  ? cookieLabel
                    ? `${commission} · ${cookieLabel}`
                    : commission
                  : isBusiness
                    ? 'Join to promote'
                    : 'View'
              }
              location={locationBits.join(' · ')}
              imageUrl={image}
              badge={badge}
              ctaLabel={isBusiness ? 'View' : 'Open'}
              compact
              dense={isLinksHub}
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
