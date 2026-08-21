import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import api from '../../api';
import { extractListItems } from '../../utils/apiResponseHelpers';
import { pickListingImage, formatListingPrice } from '../../utils/normalizeBrowseAdvert';
import { BrowseListingCard, BrowseListingGrid } from './BrowseListingCard';
import SponsoredPostsSidebar from '../DetailsPages/SponsoredPostsSidebar';

const ENDPOINTS = {
  'buy-sell': '/buy-sell',
  classifieds: '/buy-sell',
  vehicles: '/vehicles-adverts',
  property: '/properties',
  services: '/services',
  jobs: '/jobs',
  seekers: '/public/jobs/seekers',
  books: '/books-adverts',
  business: '/business',
  events: '/events-venues',
  donations: '/donations',
  software: '/business-templates',
  stores: '/stores',
  funding: '/funding-projects',
  affiliates: '/affiliates/business-offers',
  sponsored: '/sponsored-adverts',
  promoted: '/promoted-adverts',
  featured: '/featured-adverts',
  images: '/images-adverts',
};

const HREF = {
  'buy-sell': (item) => `/item/${item.slug || item.id}`,
  classifieds: (item) => `/item/${item.slug || item.id}`,
  vehicles: (item) => `/vehicles/${item.slug || item.id}`,
  property: (item) => `/property/${item.slug || item.id}`,
  services: (item) => `/services/${item.slug || item.id}`,
  jobs: (item) => `/jobs/${item.slug || item.id}`,
  seekers: (item) => `/jobs/seekers/${item.slug || item.id}`,
  books: (item) => `/books/${item.slug || item.id}`,
  business: (item) => `/business/${item.slug || item.id}`,
  events: (item) => `/events-venues/${item.slug || item.id}`,
  donations: (item) => `/donations/${item.slug || item.id}`,
  software: (item) => `/software/${item.slug || item.id}`,
  stores: (item) => `/store/${item.slug || item.id}`,
  funding: (item) => `/funding/${item.slug || item.id}`,
  affiliates: (item) => `/affiliates/offers/${item.slug || item.id}`,
  sponsored: (item) => `/sponsored-adverts/${item.slug || item.id}`,
  promoted: (item) => `/promoted-adverts/${item.slug || item.id}`,
  featured: (item) => `/featured-adverts/${item.slug || item.id}`,
  images: (item) => `/images/${item.slug || item.id}`,
};

const BROWSE_MORE = {
  events: '/events-venues',
  seekers: '/jobs/seekers',
  jobs: '/jobs/vacancies',
  'buy-sell': '/buy-sell',
  classifieds: '/buy-sell',
  property: '/property',
  vehicles: '/vehicles',
  services: '/services',
  books: '/books',
  business: '/business',
  donations: '/donations',
  software: '/software',
  stores: '/stores',
  funding: '/funding',
  affiliates: '/affiliates',
  sponsored: '/sponsored-adverts',
  promoted: '/promoted-adverts',
  featured: '/featured-adverts',
  images: '/images',
};

const itemId = (item) => item?.id ?? item?.uuid ?? item?.slug;

/**
 * Related listings under any post detail page,
 * plus related sponsored/promoted adverts.
 */
const RelatedListingsSection = ({
  source = 'buy-sell',
  currentId,
  categoryKey = '',
  categoryName = '',
  title = 'Related listings',
  subtitle = 'You may also like',
  limit = 6,
  items: itemsProp = null,
  getHref: getHrefProp = null,
  className = '',
  /** Show sponsored + promoted adverts block under related listings */
  showRelatedAdverts = true,
}) => {
  const [items, setItems] = useState(Array.isArray(itemsProp) ? itemsProp : []);
  const [loading, setLoading] = useState(!Array.isArray(itemsProp));

  useEffect(() => {
    if (Array.isArray(itemsProp)) {
      setItems(itemsProp);
      setLoading(false);
      return undefined;
    }

    let cancelled = false;
    const endpoint = ENDPOINTS[source] || ENDPOINTS['buy-sell'];

    (async () => {
      setLoading(true);
      try {
        const fetchRows = async (withCategory) => {
          const params = { per_page: Math.max(limit * 2, 12), page: 1 };
          if (withCategory && categoryKey) {
            params.category = categoryKey;
            params.category_slug = categoryKey;
          }
          if (withCategory && categoryName) params.category_name = categoryName;
          const res = await api.get(endpoint, { params, timeout: 12000 });
          return extractListItems(res?.data ?? res);
        };

        let rows = await fetchRows(true);
        if ((!rows || rows.length <= 1) && (categoryKey || categoryName)) {
          rows = await fetchRows(false);
        }

        const filtered = (rows || [])
          .filter((row) => String(itemId(row)) !== String(currentId))
          .slice(0, limit);
        if (!cancelled) setItems(filtered);
      } catch {
        if (!cancelled) setItems([]);
      } finally {
        if (!cancelled) setLoading(false);
      }
    })();

    return () => {
      cancelled = true;
    };
  }, [source, currentId, categoryKey, categoryName, limit, itemsProp]);

  const hrefFor = getHrefProp || HREF[source] || HREF['buy-sell'];
  const hasRelated = loading || items.length > 0;

  return (
    <div className={className}>
      {hasRelated && (
        <section className="mt-8 sm:mt-10">
          <div className="mb-4 text-center">
            <p className="text-xs font-semibold uppercase tracking-wide text-slate-500">{subtitle}</p>
            <h2 className="text-xl font-bold text-gray-900">{title}</h2>
          </div>

          {loading ? (
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3">
              {Array.from({ length: 4 }).map((_, i) => (
                <div key={i} className="h-44 rounded-xl bg-slate-100 animate-pulse" />
              ))}
            </div>
          ) : (
            <BrowseListingGrid>
              {items.map((item) => {
                const id = itemId(item);
                const image = pickListingImage(item, { allowStock: true });
                const href = hrefFor(item);
                return (
                  <BrowseListingCard
                    key={id || item.title}
                    href={href}
                    title={item.title || item.name || item.headline || 'Listing'}
                    subtitle={item.category_name || item.category?.name || categoryName || ''}
                    location={[item.city, item.country].filter(Boolean).join(', ') || item.location || ''}
                    imageUrl={image}
                    priceLabel={formatListingPrice(item) || item.price_label || item.price || null}
                    badge={
                      item.is_featured || item.featured
                        ? 'Featured'
                        : item.is_sponsored || item.sponsored
                          ? 'Sponsored'
                          : item.is_promoted || item.promoted
                            ? 'Promoted'
                            : null
                    }
                    ctaLabel="View"
                  />
                );
              })}
            </BrowseListingGrid>
          )}

          {!loading && items.length > 0 && (
            <div className="mt-4 text-center">
              <Link
                to={BROWSE_MORE[source] || `/${source}`}
                className="text-sm font-semibold text-blue-700 hover:underline"
              >
                Browse more
              </Link>
            </div>
          )}
        </section>
      )}

      {showRelatedAdverts && (
        <section className="mt-10 border-t border-gray-200 pt-8">
          <p className="text-xs font-semibold uppercase tracking-wide text-slate-500 mb-1">
            On this advert
          </p>
          <h2 className="text-xl font-bold text-gray-900 mb-4">Sponsored adverts</h2>
          <SponsoredPostsSidebar currentAdId={currentId} />
        </section>
      )}
    </div>
  );
};

export default RelatedListingsSection;
