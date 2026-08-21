import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { FaGem, FaMapMarkerAlt } from 'react-icons/fa';
import sponsoredAdvertsAPI from '../../api/sponsoredAdvertsAPI';
import { resolveStorageUrl } from '../../utils/dashboardEditMappers';

const normalizeRows = (payload) => {
  if (!payload) return [];
  if (Array.isArray(payload)) return payload;
  if (Array.isArray(payload.data?.data)) return payload.data.data;
  if (Array.isArray(payload.data)) return payload.data;
  return [];
};

const mapCard = (ad) => ({
  id: ad.id || ad.sponsored_advert_id,
  title: ad.title || 'Listing',
  slug: ad.slug || ad.id,
  image:
    resolveStorageUrl(ad.main_image || ad.image || ad.thumbnail) ||
    ad.main_image ||
    ad.image ||
    '/img/no-image.png',
  category: ad.category_name || ad.category?.name || 'Sponsored',
  location: [ad.city, ad.country].filter(Boolean).join(', ') || ad.location || '',
  href: `/sponsored-adverts/${ad.slug || ad.id}`,
});

/**
 * Sponsored adverts on the viewed advert detail page (Clive).
 * Promoted belongs above paid listings on browse — not here.
 */
const SponsoredPostsSidebar = ({ currentAdId, title = 'Sponsored adverts' }) => {
  const [sponsoredPosts, setSponsoredPosts] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let cancelled = false;
    const load = async () => {
      setLoading(true);
      try {
        const sponsoredRes = await sponsoredAdvertsAPI.getSponsoredAdverts({
          per_page: 6,
          page: 1,
        });
        if (cancelled) return;
        const sponsored = normalizeRows(sponsoredRes)
          .filter((ad) => String(ad.id) !== String(currentAdId))
          .slice(0, 6)
          .map(mapCard);
        setSponsoredPosts(sponsored);
      } catch (error) {
        console.error('Error fetching sponsored content:', error);
        if (!cancelled) setSponsoredPosts([]);
      } finally {
        if (!cancelled) setLoading(false);
      }
    };
    load();
    return () => {
      cancelled = true;
    };
  }, [currentAdId]);

  return (
    <aside className="bg-white rounded-xl border border-gray-200 p-4 shadow-sm">
      <h3 className="flex items-center gap-2 text-sm font-bold mb-3 text-orange-700">
        <FaGem className="text-orange-500" />
        {title}
      </h3>
      {loading ? (
        <div className="space-y-2">
          {[1, 2, 3].map((i) => (
            <div key={i} className="h-16 rounded-lg bg-gray-100 animate-pulse" />
          ))}
        </div>
      ) : sponsoredPosts.length === 0 ? (
        <p className="text-xs text-gray-500">No sponsored listings yet</p>
      ) : (
        <div className="space-y-3">
          {sponsoredPosts.map((post) => (
            <Link
              key={post.id}
              to={post.href}
              className="flex gap-3 p-2 rounded-lg border border-gray-100 hover:border-gray-200 hover:bg-gray-50 transition-colors"
            >
              <img
                src={post.image}
                alt=""
                className="w-14 h-14 rounded-md object-cover bg-gray-100 shrink-0"
                onError={(e) => {
                  e.currentTarget.src = '/img/no-image.png';
                }}
              />
              <div className="min-w-0 flex-1">
                <p className="text-sm font-semibold text-gray-900 line-clamp-2">{post.title}</p>
                <p className="text-xs text-gray-500 truncate">{post.category}</p>
                {post.location && (
                  <p className="text-[11px] text-gray-400 flex items-center gap-1 mt-0.5">
                    <FaMapMarkerAlt className="shrink-0" />
                    <span className="truncate">{post.location}</span>
                  </p>
                )}
              </div>
            </Link>
          ))}
        </div>
      )}
      <div className="pt-3 mt-2 border-t border-gray-100">
        <Link
          to="/sponsored-adverts"
          className="block text-center text-xs font-semibold text-orange-700 hover:underline"
        >
          Browse sponsored ads
        </Link>
      </div>
    </aside>
  );
};

export default SponsoredPostsSidebar;
