import { listingPublicKey, publicHref } from './publicListingHref';

/**
 * Resolve a clickable detail URL for cross-category feed rows
 * (Featured / Promoted / Sponsored site feeds).
 * Prefers slug / id-title hybrid over bare numeric ids.
 */
export function resolveCrossFeedHref(advert, fallbackHub = '/featured-adverts') {
  if (!advert || typeof advert !== 'object') return fallbackHub;

  const rawHref = advert.href || advert.detail_url || advert.url || advert.path;
  if (rawHref && typeof rawHref === 'string') {
    const href = rawHref.trim();
    if (href.startsWith('/') && !href.includes('undefined') && !href.includes('null')) {
      // Rewrite bare numeric tails to slug-first when we have a better key
      const numericTail = href.match(
        /^\/(services|vehicles|property|item|jobs|books|business|funding(?:\/project)?)\/(\d+)\/?$/i
      );
      if (numericTail) {
        const key = listingPublicKey(advert);
        if (key && key !== numericTail[2]) {
          return `/${numericTail[1]}/${key}`;
        }
      }
      return href;
    }
  }

  const source = String(advert.source || advert.source_type || '').toLowerCase().replace(/-/g, '_');
  const sourceId = advert.source_id != null ? String(advert.source_id) : null;

  let compositeSource = null;
  let compositeId = null;
  const idStr = advert.id != null ? String(advert.id) : '';
  const compositeMatch = idStr.match(
    /^(services|vehicles|property|buy_sell|buy-sell|featured|sponsored|promoted|events_venues|events|resorts_travel|resorts|jobs|books|business|funding)[_-](.+)$/i
  );
  if (compositeMatch) {
    compositeSource = compositeMatch[1].toLowerCase().replace(/-/g, '_');
    compositeId = compositeMatch[2];
  }

  const resolvedSource = source || compositeSource || 'featured';
  const key = listingPublicKey({
    ...advert,
    id: advert.slug ? advert.id : advert.id ?? sourceId ?? compositeId,
    source_id: sourceId || compositeId,
  });

  if (!key) return fallbackHub;

  switch (resolvedSource) {
    case 'services':
      return publicHref.service({ ...advert, id: advert.id ?? sourceId ?? compositeId, slug: advert.slug });
    case 'vehicles':
      return publicHref.vehicle({ ...advert, id: advert.id ?? sourceId ?? compositeId, slug: advert.slug });
    case 'property':
      return publicHref.property({ ...advert, id: advert.id ?? sourceId ?? compositeId, slug: advert.slug });
    case 'buy_sell':
    case 'buysell':
    case 'buy-sell':
      return publicHref.buySell({ ...advert, id: advert.id ?? sourceId ?? compositeId, slug: advert.slug });
    case 'events_venues':
    case 'events':
      return publicHref.events({ ...advert, id: advert.id ?? sourceId ?? compositeId, slug: advert.slug });
    case 'resorts_travel':
    case 'resorts':
      return publicHref.resorts({ ...advert, id: advert.id ?? sourceId ?? compositeId, slug: advert.slug });
    case 'jobs':
      return publicHref.job({ ...advert, id: advert.id ?? sourceId ?? compositeId, slug: advert.slug });
    case 'books':
      return publicHref.book({ ...advert, id: advert.id ?? sourceId ?? compositeId, slug: advert.slug });
    case 'business':
      return publicHref.business({ ...advert, id: advert.id ?? sourceId ?? compositeId, slug: advert.slug });
    case 'funding':
      return publicHref.funding({ ...advert, id: advert.id ?? sourceId ?? compositeId, slug: advert.slug });
    case 'sponsored':
      return publicHref.sponsored({ ...advert, slug: advert.slug || key });
    case 'promoted':
      return publicHref.promoted({ ...advert, slug: advert.slug || key });
    case 'featured':
      return publicHref.featured({ ...advert, slug: advert.slug || key });
    default:
      if (fallbackHub.includes('sponsored')) return `/sponsored-adverts/${key}`;
      if (fallbackHub.includes('promoted')) return `/promoted-adverts/${key}`;
      return `${fallbackHub.replace(/\/$/, '')}/${key}`;
  }
}

export default resolveCrossFeedHref;
