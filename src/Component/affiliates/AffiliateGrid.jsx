import React, { useMemo, useState } from 'react';
import { FiBriefcase, FiExternalLink } from 'react-icons/fi';
import { BrowseListingCard, BrowseListingGrid } from '../shared/BrowseListingCard';
import { getStorageAssetUrl } from '../../utils/jobsHelpers';

/** Resolve a clickable destination for an affiliate post/link. */
export function resolveAffiliateHref(offer = {}) {
  const raw =
    offer.tracking_link ||
    offer.affiliate_link ||
    offer.link ||
    offer.url ||
    '';
  const href = String(raw || '').trim();
  if (!href || href === '#') return null;

  if (/^https?:\/\//i.test(href)) return href;
  if (href.startsWith('//')) return `https:${href}`;
  if (href.startsWith('/')) {
    // Site-relative hop (e.g. /go/aff/…) — open on current origin / API host as absolute
    if (typeof window !== 'undefined') {
      return `${window.location.origin}${href}`;
    }
    return href;
  }
  // Bare domain
  if (/^[a-z0-9.-]+\.[a-z]{2,}/i.test(href)) {
    return `https://${href}`;
  }
  return null;
}

/**
 * Clive: affiliate ads = clickable image (+ optional link under it). No long description.
 */
function AffiliateAdCard({ offer, onOpen }) {
  const [imgFailed, setImgFailed] = useState(false);
  const href = resolveAffiliateHref(offer);
  const title =
    offer.product_service_title ||
    offer.title ||
    offer.business_name ||
    'Affiliate offer';
  const image =
    getStorageAssetUrl(offer.image || offer.image_url || offer.logo_url || offer.banner_url) ||
    offer.image ||
    offer.image_url ||
    null;
  const showImage = Boolean(image) && !imgFailed;

  const handleOpen = async (e) => {
    e?.preventDefault?.();
    if (!href) return;
    await onOpen?.(offer, href);
  };

  const displayLink = href
    ? href.replace(/^https?:\/\//i, '').replace(/\/$/, '').slice(0, 48) +
      (href.length > 56 ? '…' : '')
    : null;

  return (
    <article className="group flex flex-col overflow-hidden rounded-xl border border-slate-200 bg-white shadow-sm hover:shadow-md transition-shadow">
      <button
        type="button"
        onClick={handleOpen}
        disabled={!href}
        className="relative block w-full aspect-[16/10] overflow-hidden bg-slate-100 text-left disabled:cursor-not-allowed"
        aria-label={href ? `Open ${title}` : title}
      >
        {showImage ? (
          <img
            src={image}
            alt=""
            className="h-full w-full object-cover transition-transform duration-300 group-hover:scale-[1.03]"
            loading="lazy"
            decoding="async"
            onError={() => setImgFailed(true)}
          />
        ) : (
          <div className="flex h-full w-full items-center justify-center bg-gradient-to-br from-rose-500 to-violet-600">
            <FiExternalLink className="h-8 w-8 text-white/80" />
          </div>
        )}
        <span className="absolute inset-0 bg-black/0 group-hover:bg-black/10 transition-colors" />
        {href && (
          <span className="absolute bottom-2 right-2 inline-flex items-center gap-1 rounded-full bg-black/70 px-2.5 py-1 text-[10px] font-semibold text-white">
            <FiExternalLink className="h-3 w-3" />
            Visit
          </span>
        )}
      </button>

      <div className="flex flex-1 flex-col gap-1.5 p-3">
        <h3 className="text-sm font-semibold text-slate-900 line-clamp-2 leading-snug">
          {title}
        </h3>
        {href ? (
          <a
            href={href}
            target="_blank"
            rel="noopener noreferrer"
            onClick={async (e) => {
              e.preventDefault();
              await onOpen?.(offer, href);
            }}
            className="inline-flex items-center gap-1.5 text-xs font-medium text-primary hover:underline break-all"
          >
            <FiExternalLink className="h-3 w-3 shrink-0" />
            {displayLink || 'Open affiliate link'}
          </a>
        ) : (
          <p className="text-xs text-amber-700">No affiliate link on this post</p>
        )}
      </div>
    </article>
  );
}

/**
 * Affiliate marketplace / ads cards.
 * - Ads hub: image + title + link (Clive)
 * - Marketplace: program cards → offer detail
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
  const isAdsHub = hubMode === 'links' || hubMode === 'ads';

  const openExternal = async (offer, href) => {
    const isBusiness = offer.contentType === 'business' || offer.type === 'business';
    const isLink = offer.contentType === 'link' || String(offer.id || '').startsWith('link-');
    const type = isBusiness ? 'business' : isLink ? 'link' : 'user';
    const rawId = String(offer.id || '')
      .replace(/^business-/, '')
      .replace(/^user-/, '')
      .replace(/^link-/, '');

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
    return <BrowseListingGrid loading compact columns={isAdsHub ? 3 : 3} />;
  }

  if (!list.length) {
    return (
      <BrowseListingGrid
        emptyMessage={
          isAdsHub
            ? 'No affiliate posts found. Try different filters.'
            : 'No affiliate programs found. Publish a program or try different filters.'
        }
        compact
      />
    );
  }

  if (isAdsHub) {
    return (
      <div className={embedInBrowse ? '' : 'space-y-3'}>
        {!embedInBrowse && (
          <p className="text-sm text-gray-600">
            Click the image (or the link under it) to open the affiliate offer.
          </p>
        )}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3 sm:gap-4">
          {list.map((offer) => (
            <AffiliateAdCard key={offer.id} offer={offer} onOpen={openExternal} />
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className={embedInBrowse ? '' : 'space-y-3'}>
      {!embedInBrowse && (
        <p className="text-sm text-gray-600">
          Browse programs to promote, then open an offer to apply and get your unique tracking hop link.
        </p>
      )}
      <BrowseListingGrid compact columns={3}>
        {list.map((offer) => {
          const isBusiness = offer.contentType === 'business' || offer.type === 'business';
          const rawId = String(offer.id || '')
            .replace(/^business-/, '')
            .replace(/^user-/, '')
            .replace(/^link-/, '');

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
            cookieDays != null && cookieDays !== '' ? `${cookieDays}-day cookie` : null;

          const locationBits = [
            [offer.city, offer.country].filter(Boolean).join(', '),
            cookieLabel,
          ].filter(Boolean);

          const image =
            getStorageAssetUrl(offer.image || offer.image_url || offer.logo_url || offer.banner_url) ||
            offer.image ||
            offer.image_url ||
            null;

          const badge =
            offer.is_featured || offer.featured
              ? 'Featured'
              : offer.is_sponsored || offer.sponsored
                ? 'Sponsored'
                : offer.is_promoted || offer.promoted
                  ? 'Promoted'
                  : 'Program';

          return (
            <BrowseListingCard
              key={offer.id}
              href={isBusiness ? `/affiliates/offer/${rawId}` : undefined}
              title={title}
              subtitle={
                offer.business_name ||
                offer.category ||
                offer.category_name ||
                'Business program'
              }
              priceLabel={
                commission
                  ? cookieLabel
                    ? `${commission} · ${cookieLabel}`
                    : commission
                  : 'Join to promote'
              }
              location={locationBits.join(' · ')}
              imageUrl={image}
              badge={badge}
              ctaLabel="View"
              compact
              fallbackGradient="from-violet-600 to-indigo-500"
              FallbackIcon={FiBriefcase}
            />
          );
        })}
      </BrowseListingGrid>
    </div>
  );
};

export default AffiliateGrid;
