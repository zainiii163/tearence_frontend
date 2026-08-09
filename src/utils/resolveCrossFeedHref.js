/**
 * Resolve a clickable detail URL for cross-category feed rows
 * (Featured / Promoted / Sponsored site feeds).
 */
export function resolveCrossFeedHref(advert, fallbackHub = '/featured-adverts') {
  if (!advert || typeof advert !== 'object') return fallbackHub;

  const rawHref = advert.href || advert.detail_url || advert.url || advert.path;
  if (rawHref && typeof rawHref === 'string') {
    const href = rawHref.trim();
    if (href.startsWith('/') && !href.includes('undefined') && !href.includes('null')) {
      // Old feeds used /services/{slug} but the detail route binds by numeric id
      if (href.startsWith('/services/') && advert.source_id != null) {
        return `/services/${advert.source_id}`;
      }
      return href;
    }
  }

  const source = String(advert.source || advert.source_type || '').toLowerCase().replace(/-/g, '_');
  const sourceId = advert.source_id != null ? String(advert.source_id) : null;

  // Composite feed ids look like "services-12"
  let compositeSource = null;
  let compositeId = null;
  const idStr = advert.id != null ? String(advert.id) : '';
  const compositeMatch = idStr.match(
    /^(services|vehicles|property|buy_sell|buy-sell|featured|sponsored|promoted|events_venues|events|resorts_travel|resorts)[_-](.+)$/i
  );
  if (compositeMatch) {
    compositeSource = compositeMatch[1].toLowerCase().replace(/-/g, '_');
    compositeId = compositeMatch[2];
  }

  const resolvedSource = source || compositeSource || 'featured';
  const key = advert.slug || sourceId || compositeId || (compositeMatch ? null : idStr);

  if (!key) return fallbackHub;

  switch (resolvedSource) {
    case 'services':
      return `/services/${sourceId || compositeId || key}`;
    case 'vehicles':
      return `/vehicles/${key}`;
    case 'property':
      return `/property/${key}`;
    case 'buy_sell':
    case 'buysell':
      return `/item/${sourceId || compositeId || key}`;
    case 'events_venues':
    case 'events':
      return `/events-venues/${key}`;
    case 'resorts_travel':
    case 'resorts':
      return `/resorts-travel/${key}`;
    case 'sponsored':
      return `/sponsored-adverts/${key}`;
    case 'promoted':
      return `/promoted-adverts/${key}`;
    case 'featured':
      return `/featured-adverts/${key}`;
    default:
      if (fallbackHub.includes('sponsored')) return `/sponsored-adverts/${key}`;
      if (fallbackHub.includes('promoted')) return `/promoted-adverts/${key}`;
      return `${fallbackHub.replace(/\/$/, '')}/${key}`;
  }
}

export default resolveCrossFeedHref;
