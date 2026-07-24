import React from 'react';
import { Link } from 'react-router-dom';
import { FiHome, FiMapPin } from 'react-icons/fi';
import { isFeaturedListing, isSponsoredListing } from '../../utils/listingPromotionSort';
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

/** Stylish property cards — architectural look, not shared BrowseListingCard. */
const PropertyListingsGrid = ({ properties = [], loading = false }) => {
  if (loading) {
    return (
      <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-4">
        {[1, 2, 3, 4, 5, 6].map((i) => (
          <div key={i} className="property-listing-card animate-pulse">
            <div className="prop-media bg-[var(--prop-stone-deep)]" />
            <div className="p-4 space-y-2">
              <div className="h-4 bg-[var(--prop-stone-deep)] w-4/5" />
              <div className="h-3 bg-[var(--prop-stone-deep)] w-1/2" />
              <div className="h-6 bg-[var(--prop-stone-deep)] w-1/3 mt-3" />
            </div>
          </div>
        ))}
      </div>
    );
  }

  if (!properties.length) {
    return (
      <div className="text-center py-14 border border-[var(--prop-ink)]/10 bg-white/60">
        <FiHome className="mx-auto h-8 w-8 text-[var(--prop-copper)] mb-3" />
        <p className="prop-display text-xl text-[var(--prop-ink)]">No properties found</p>
        <p className="text-sm text-[var(--prop-ink)]/55 mt-1">Try adjusting filters or search</p>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-4">
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
          : isSponsoredListing(property)
            ? 'Sponsored'
            : null;

        return (
          <Link key={property.id || property.slug || title} to={href} className="property-listing-card group">
            <div className="prop-media">
              <PropertyImage property={property} alt={title} />
              {badge && (
                <span className="absolute top-3 left-3 px-2 py-0.5 text-[10px] font-bold uppercase tracking-wider bg-[var(--prop-ink)] text-[var(--prop-copper)]">
                  {badge}
                </span>
              )}
            </div>
            <div className="p-4 flex flex-col flex-1">
              <h3 className="prop-display text-xl text-[var(--prop-ink)] leading-snug line-clamp-2 group-hover:text-[var(--prop-copper-deep)] transition-colors">
                {title}
              </h3>
              {location && (
                <p className="mt-1.5 flex items-center gap-1 text-xs text-[var(--prop-ink)]/55 truncate">
                  <FiMapPin className="h-3 w-3 shrink-0 text-[var(--prop-copper)]" />
                  {location}
                </p>
              )}
              {(beds != null || baths != null) && (
                <p className="mt-2 text-[11px] text-[var(--prop-ink)]/45 tracking-wide">
                  {[beds != null && `${beds} bed`, baths != null && `${baths} bath`]
                    .filter(Boolean)
                    .join(' · ')}
                </p>
              )}
              {price && (
                <p className="mt-auto pt-3 text-lg font-semibold text-[var(--prop-ink)] tracking-tight">
                  {price}
                </p>
              )}
              <span className="mt-3 inline-flex justify-center w-full py-2.5 text-xs font-semibold tracking-wide uppercase bg-[var(--prop-ink)] text-[var(--prop-stone)] group-hover:bg-[var(--prop-copper-deep)] transition-colors">
                View property
              </span>
            </div>
          </Link>
        );
      })}
    </div>
  );
};

export default PropertyListingsGrid;
