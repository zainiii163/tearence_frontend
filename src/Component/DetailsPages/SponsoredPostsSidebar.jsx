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
 * Sponsored adverts on the viewed advert detail page — card grid (not a dense list).
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
    <aside className="bg-white rounded-2xl border border-gray-200/90 p-4 sm:p-5 shadow-sm">
      <h3 className="flex items-center gap-2 text-sm font-bold mb-4 text-orange-700">
        <FaGem className="text-orange-500 shrink-0" />
        {title}
      </h3>

      {loading ? (
        <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
          {[1, 2, 3, 4, 5, 6].map((i) => (
            <div key={i} className="rounded-xl overflow-hidden border border-gray-100">
              <div className="aspect-[4/3] bg-gray-100 animate-pulse" />
              <div className="p-2.5 space-y-2">
                <div className="h-3 bg-gray-100 rounded animate-pulse w-4/5" />
                <div className="h-2.5 bg-gray-50 rounded animate-pulse w-1/2" />
              </div>
            </div>
          ))}
        </div>
      ) : sponsoredPosts.length === 0 ? (
        <p className="text-xs text-gray-500 py-6 text-center">No sponsored listings yet</p>
      ) : (
        <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
          {sponsoredPosts.map((post) => (
            <Link
              key={post.id}
              to={post.href}
              className="group flex flex-col rounded-xl border border-slate-200/90 bg-white overflow-hidden hover:border-orange-200 hover:shadow-md transition-all"
            >
              <div className="relative aspect-[4/3] bg-slate-100 overflow-hidden">
                <img
                  src={post.image}
                  alt=""
                  className="absolute inset-0 w-full h-full object-cover transition-transform duration-300 group-hover:scale-[1.03]"
                  onError={(e) => {
                    e.currentTarget.src = '/img/no-image.png';
                  }}
                />
                <span className="absolute top-2 left-2 rounded-md bg-orange-500/95 px-1.5 py-0.5 text-[10px] font-bold uppercase tracking-wide text-white shadow-sm">
                  Sponsored
                </span>
              </div>
              <div className="p-2.5 flex flex-col gap-1 min-h-[4.5rem]">
                <p className="text-[13px] font-semibold text-slate-900 leading-snug line-clamp-2 group-hover:text-orange-800">
                  {post.title}
                </p>
                {post.location ? (
                  <p className="text-[11px] text-slate-500 flex items-center gap-1 mt-auto">
                    <FaMapMarkerAlt className="shrink-0 text-slate-400" />
                    <span className="truncate">{post.location}</span>
                  </p>
                ) : (
                  <p className="text-[11px] text-slate-400 truncate mt-auto">{post.category}</p>
                )}
              </div>
            </Link>
          ))}
        </div>
      )}

      <div className="pt-4 mt-4 border-t border-gray-100">
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
