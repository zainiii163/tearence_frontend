import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { FaBolt, FaGem, FaMapMarkerAlt } from 'react-icons/fa';
import sponsoredAdvertsAPI from '../../api/sponsoredAdvertsAPI';
import { promotedAdvertsAPI } from '../../services/promotedAdvertsAPI';
import { resolveStorageUrl } from '../../utils/dashboardEditMappers';

const normalizeRows = (payload) => {
  if (!payload) return [];
  if (Array.isArray(payload)) return payload;
  if (Array.isArray(payload.data?.data)) return payload.data.data;
  if (Array.isArray(payload.data)) return payload.data;
  return [];
};

const mapCard = (ad, kind) => ({
  id: ad.id || ad.sponsored_advert_id || ad.promoted_advert_id,
  title: ad.title || 'Listing',
  slug: ad.slug || ad.id,
  price: ad.price,
  currency: ad.currency || 'GBP',
  image:
    resolveStorageUrl(ad.main_image || ad.image || ad.thumbnail) ||
    ad.main_image ||
    ad.image ||
    '/img/no-image.png',
  category: ad.category_name || ad.category?.name || kind,
  location: [ad.city, ad.country].filter(Boolean).join(', ') || ad.location || '',
  views: ad.views_count || ad.views || 0,
  href:
    kind === 'sponsored'
      ? `/sponsored-adverts/${ad.slug || ad.id}`
      : `/promoted-adverts/${ad.slug || ad.id}`,
});

const SponsoredPostsSidebar = ({ currentAdId }) => {
  const [sponsoredPosts, setSponsoredPosts] = useState([]);
  const [promotedPosts, setPromotedPosts] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let cancelled = false;
    const load = async () => {
      setLoading(true);
      try {
        const [sponsoredRes, promotedRes] = await Promise.allSettled([
          sponsoredAdvertsAPI.getSponsoredAdverts({ per_page: 4, page: 1 }),
          promotedAdvertsAPI.getAdverts({ per_page: 4, page: 1 }),
        ]);

        if (cancelled) return;

        const sponsored =
          sponsoredRes.status === 'fulfilled'
            ? normalizeRows(sponsoredRes.value)
                .filter((ad) => String(ad.id) !== String(currentAdId))
                .slice(0, 4)
                .map((ad) => mapCard(ad, 'sponsored'))
            : [];
        const promoted =
          promotedRes.status === 'fulfilled'
            ? normalizeRows(promotedRes.value)
                .filter((ad) => String(ad.id) !== String(currentAdId))
                .slice(0, 4)
                .map((ad) => mapCard(ad, 'promoted'))
            : [];

        setSponsoredPosts(sponsored);
        setPromotedPosts(promoted);
      } catch (error) {
        console.error('Error fetching sponsored content:', error);
        if (!cancelled) {
          setSponsoredPosts([]);
          setPromotedPosts([]);
        }
      } finally {
        if (!cancelled) setLoading(false);
      }
    };
    load();
    return () => {
      cancelled = true;
    };
  }, [currentAdId]);

  const renderSection = (title, icon, posts, emptyLabel, accent) => (
    <section className="mb-6">
      <h3 className={`flex items-center gap-2 text-sm font-bold mb-3 ${accent}`}>
        {icon}
        {title}
      </h3>
      {loading ? (
        <div className="space-y-2">
          {[1, 2].map((i) => (
            <div key={i} className="h-16 rounded-lg bg-gray-100 animate-pulse" />
          ))}
        </div>
      ) : posts.length === 0 ? (
        <p className="text-xs text-gray-500">{emptyLabel}</p>
      ) : (
        <div className="space-y-3">
          {posts.map((post) => (
            <Link
              key={`${title}-${post.id}`}
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
    </section>
  );

  return (
    <aside className="bg-white rounded-xl border border-gray-200 p-4 shadow-sm">
      {renderSection(
        'Sponsored',
        <FaGem className="text-orange-500" />,
        sponsoredPosts,
        'No sponsored listings yet',
        'text-orange-700'
      )}
      {renderSection(
        'Promoted',
        <FaBolt className="text-red-500" />,
        promotedPosts,
        'No promoted listings yet',
        'text-red-700'
      )}
      <div className="pt-2 border-t border-gray-100 space-y-2">
        <Link
          to="/sponsored-adverts"
          className="block text-center text-xs font-semibold text-orange-700 hover:underline"
        >
          Browse sponsored ads
        </Link>
        <Link
          to="/promoted-adverts"
          className="block text-center text-xs font-semibold text-red-700 hover:underline"
        >
          Browse promoted ads
        </Link>
      </div>
    </aside>
  );
};

export default SponsoredPostsSidebar;
