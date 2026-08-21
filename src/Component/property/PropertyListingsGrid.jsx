import React from 'react';
import { Link } from 'react-router-dom';
import { FiHome, FiMapPin } from 'react-icons/fi';
import {
  isFeaturedListing,
  isPromotedListing,
  isSponsoredListing,
} from '../../utils/listingPromotionSort';
import PropertyImage from './PropertyImage';

const formatPrice = (price, currency = 'USD') => {
  if (price == null || price === '') return null;
  try {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: currency || 'USD',
      maximumFractionDigits: 0,
    }).format(Number(price));
  } catch {
    return `$${Number(price).toLocaleString()}`;
  }
};

/**
 * Property cards.
 * - compact: smaller cards in a 3-col grid
 * - singleRow: one horizontal row of featured cards (Clive)
 */
const PropertyListingsGrid = ({
  properties = [],
  loading = false,
  compact = false,
  singleRow = false,
}) => {
  const gridClass = singleRow
    ? 'property-featured-row'
    : compact
      ? 'grid grid-cols-2 sm:grid-cols-3 gap-2 sm:gap-2.5'
      : 'grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-4';

  if (loading) {
    return (
      <div className={gridClass}>
        {(singleRow ? [1, 2, 3, 4, 5] : [1, 2, 3, 4, 5, 6]).map((i) => (
          <div
            key={i}
            className={`property-listing-card animate-pulse ${singleRow ? 'is-row-card' : ''} ${
              compact || singleRow ? 'is-compact' : ''
            }`}
          >
            <div className={`prop-media bg-[var(--prop-stone-deep)] ${compact || singleRow ? 'is-compact' : ''}`} />
            <div className={`space-y-2 ${compact || singleRow ? 'p-2' : 'p-4'}`}>
              <div className="h-3 bg-[var(--prop-stone-deep)] w-4/5" />
              <div className="h-3 bg-[var(--prop-stone-deep)] w-1/2" />
            </div>
          </div>
        ))}
      </div>
    );
  }

  if (!properties.length) {
    return (
      <div className="text-center py-10 border border-[var(--prop-ink)]/10 bg-white/60">
        <FiHome className="mx-auto h-7 w-7 text-[var(--prop-copper)] mb-2" />
        <p className="prop-display text-lg text-[var(--prop-ink)]">No properties found</p>
        <p className="text-xs text-[var(--prop-ink)]/55 mt-1">Try adjusting your search or selection</p>
      </div>
    );
  }

  return (
    <div className={gridClass}>
      {properties.map((property) => {
        const title = property.title || property.name || 'Property';
        const href = `/property/${property.id}`;
        const price = formatPrice(
          property.price ?? property.asking_price ?? property.monthly_rent,
          property.currency
        );
        const location = [property.city, property.country || property.location]
          .filter(Boolean)
          .join(', ');
        const beds = property.bedrooms ?? property.specifications?.bedrooms;
        const baths = property.bathrooms ?? property.specifications?.bathrooms;
        const badge = isFeaturedListing(property)
          ? 'Featured'
          : isPromotedListing(property)
            ? 'Promoted'
          : isSponsoredListing(property)
            ? 'Sponsored'
            : null;
        const dense = compact || singleRow;

        return (
          <Link
            key={property.id || property.slug || title}
            to={href}
            className={`property-listing-card group ${dense ? 'is-compact' : ''} ${
              singleRow ? 'is-row-card' : ''
            }`}
          >
            <div className={`prop-media ${dense ? 'is-compact' : ''}`}>
              <PropertyImage property={property} alt={title} />
              {badge && (
                <span className="absolute top-1.5 left-1.5 px-1.5 py-0.5 text-[9px] font-bold uppercase tracking-wider bg-[var(--prop-ink)] text-[var(--prop-copper)]">
                  {badge}
                </span>
              )}
            </div>
            <div className={`flex flex-col flex-1 ${dense ? 'p-2' : 'p-4'}`}>
              <h3
                className={`prop-display text-[var(--prop-ink)] leading-snug line-clamp-2 group-hover:text-[var(--prop-copper-deep)] transition-colors ${
                  dense ? 'text-sm sm:text-base' : 'text-xl'
                }`}
              >
                {title}
              </h3>
              {location && (
                <p
                  className={`mt-1 flex items-center gap-1 text-[var(--prop-ink)]/55 truncate ${
                    dense ? 'text-[10px]' : 'text-xs'
                  }`}
                >
                  <FiMapPin className="h-3 w-3 shrink-0 text-[var(--prop-copper)]" />
                  {location}
                </p>
              )}
              {!dense && (beds != null || baths != null) && (
                <p className="mt-2 text-[11px] text-[var(--prop-ink)]/45 tracking-wide">
                  {[beds != null && `${beds} bed`, baths != null && `${baths} bath`]
                    .filter(Boolean)
                    .join(' · ')}
                </p>
              )}
              {price && (
                <p
                  className={`mt-auto font-semibold text-[var(--prop-ink)] tracking-tight ${
                    dense ? 'pt-1.5 text-sm' : 'pt-3 text-lg'
                  }`}
                >
                  {price}
                </p>
              )}
              <span
                className={`mt-2 inline-flex justify-center w-full font-semibold tracking-wide uppercase bg-[var(--prop-ink)] text-[var(--prop-stone)] group-hover:bg-[var(--prop-copper-deep)] transition-colors ${
                  dense ? 'py-1.5 text-[10px]' : 'py-2.5 text-xs'
                }`}
              >
                View & enquire
              </span>
            </div>
          </Link>
        );
      })}
    </div>
  );
};

export default PropertyListingsGrid;
