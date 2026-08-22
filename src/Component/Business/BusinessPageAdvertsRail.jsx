import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { FaMapMarkerAlt } from 'react-icons/fa';
import sponsoredAdvertsAPI from '../../api/sponsoredAdvertsAPI';
import { promotedAdvertsAPI } from '../../services/promotedAdvertsAPI';
import { featuredAdvertsAPI } from '../../api/featuredAdverts';
import { resolveStorageUrl } from '../../utils/dashboardEditMappers';
import { SPONSORED_DEMO_ADVERTS } from '../../data/sponsoredDemo';
import { PROMOTED_DEMO_ADVERTS } from '../../data/promotedDemo';
import { FEATURED_DEMO_ADVERTS } from '../../data/featuredDemo';

const asList = (payload) => {
  if (!payload) return [];
  if (Array.isArray(payload)) return payload;
  if (Array.isArray(payload.data?.data)) return payload.data.data;
  if (Array.isArray(payload.data?.items)) return payload.data.items;
  if (Array.isArray(payload.items)) return payload.items;
  if (Array.isArray(payload.data)) return payload.data;
  return [];
};

const pickImage = (ad) =>
  resolveStorageUrl(
    ad.main_image || ad.image || ad.thumbnail || ad.cover_image || ad.featured_image
  ) ||
  ad.main_image ||
  ad.image ||
  '/img/no-image.png';

const mapSponsored = (ad) => ({
  id: ad.id || ad.sponsored_advert_id,
  title: ad.title || 'Sponsored advert',
  image: pickImage(ad),
  location: [ad.city, ad.country].filter(Boolean).join(', ') || ad.location || '',
  href: `/sponsored-adverts/${ad.slug || ad.id}`,
});

const mapPaid = (ad) => ({
  id: ad.id || ad.promoted_advert_id,
  title: ad.title || 'Paid advert',
  image: pickImage(ad),
  location: [ad.city, ad.country].filter(Boolean).join(', ') || ad.location || '',
  tagline: ad.tagline || ad.category_name || ad.category?.name || '',
  href: `/promoted-adverts/${ad.slug || ad.id}`,
});

const mapFeatured = (ad) => ({
  id: ad.id || ad.featured_advert_id,
  title: ad.title || 'Featured advert',
  image: pickImage(ad),
  href: `/featured-adverts/${ad.slug || ad.id}`,
});

/**
 * Clive: business profile — tiny sponsored on one side, larger paid adverts beside them.
 * Featured sits as a compact strip underneath (or randomly elsewhere later).
 * No "You may also like" / "Sponsored on this page" marketing copy.
 */
const BusinessPageAdvertsRail = ({ excludeId = null }) => {
  const [sponsored, setSponsored] = useState([]);
  const [paid, setPaid] = useState([]);
  const [featured, setFeatured] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let cancelled = false;

    const load = async () => {
      setLoading(true);
      try {
        const [sponsoredRes, paidRes, featuredRes] = await Promise.all([
          sponsoredAdvertsAPI.getSiteFeed({ per_page: 6 }).catch(() =>
            sponsoredAdvertsAPI.getSponsoredAdverts({ per_page: 6 }).catch(() => null)
          ),
          promotedAdvertsAPI.getSiteFeed({ per_page: 6 }).catch(() =>
            promotedAdvertsAPI.getAdverts({ per_page: 6 }).catch(() => null)
          ),
          featuredAdvertsAPI.getSiteFeed({ per_page: 4 }).catch(() =>
            featuredAdvertsAPI.getFeaturedAdverts({ per_page: 4 }).catch(() => null)
          ),
        ]);
        if (cancelled) return;

        const sponsoredLive = asList(sponsoredRes)
          .filter((ad) => String(ad.id) !== String(excludeId))
          .map(mapSponsored)
          .filter((ad) => ad.id);
        const paidLive = asList(paidRes)
          .filter((ad) => String(ad.id) !== String(excludeId))
          .map(mapPaid)
          .filter((ad) => ad.id);
        const featuredLive = asList(featuredRes)
          .filter((ad) => String(ad.id) !== String(excludeId))
          .map(mapFeatured)
          .filter((ad) => ad.id);

        setSponsored(
          sponsoredLive.length
            ? sponsoredLive.slice(0, 6)
            : SPONSORED_DEMO_ADVERTS.slice(0, 6).map(mapSponsored)
        );
        setPaid(
          paidLive.length
            ? paidLive.slice(0, 6)
            : PROMOTED_DEMO_ADVERTS.slice(0, 6).map(mapPaid)
        );
        setFeatured(
          featuredLive.length
            ? featuredLive.slice(0, 4)
            : FEATURED_DEMO_ADVERTS.slice(0, 4).map(mapFeatured)
        );
      } catch {
        if (!cancelled) {
          setSponsored(SPONSORED_DEMO_ADVERTS.slice(0, 6).map(mapSponsored));
          setPaid(PROMOTED_DEMO_ADVERTS.slice(0, 6).map(mapPaid));
          setFeatured(FEATURED_DEMO_ADVERTS.slice(0, 4).map(mapFeatured));
        }
      } finally {
        if (!cancelled) setLoading(false);
      }
    };

    load();
    return () => {
      cancelled = true;
    };
  }, [excludeId]);

  if (loading) {
    return (
      <div className="mt-6 grid grid-cols-1 lg:grid-cols-12 gap-4">
        <div className="lg:col-span-4 space-y-2">
          {[1, 2, 3].map((i) => (
            <div key={i} className="h-16 rounded-lg bg-slate-100 animate-pulse" />
          ))}
        </div>
        <div className="lg:col-span-8 grid grid-cols-1 sm:grid-cols-2 gap-3">
          {[1, 2, 3, 4].map((i) => (
            <div key={i} className="h-36 rounded-xl bg-slate-100 animate-pulse" />
          ))}
        </div>
      </div>
    );
  }

  if (!sponsored.length && !paid.length && !featured.length) return null;

  return (
    <div className="mt-6 space-y-5">
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-4 lg:gap-5 items-start">
        {/* Clive: sponsored — tiny, on the side */}
        <aside className="lg:col-span-4 order-2 lg:order-1">
          <div className="rounded-xl border border-slate-200/90 bg-white p-3 shadow-sm">
            <div className="space-y-2">
              {sponsored.map((ad) => (
                <Link
                  key={ad.id}
                  to={ad.href}
                  className="group flex items-center gap-2.5 rounded-lg border border-slate-100 bg-slate-50/70 p-1.5 hover:border-orange-200 hover:bg-orange-50/40 transition-colors"
                >
                  <div className="relative h-12 w-12 shrink-0 overflow-hidden rounded-md bg-slate-200">
                    <img
                      src={ad.image}
                      alt=""
                      className="h-full w-full object-cover"
                      onError={(e) => {
                        e.currentTarget.src = '/img/no-image.png';
                      }}
                    />
                    <span className="absolute bottom-0 left-0 right-0 bg-orange-500/95 text-[8px] font-bold uppercase tracking-wide text-white text-center leading-4">
                      Sponsored
                    </span>
                  </div>
                  <div className="min-w-0 flex-1 pr-1">
                    <p className="text-[12px] font-semibold text-slate-800 leading-snug line-clamp-2 group-hover:text-orange-800">
                      {ad.title}
                    </p>
                    {ad.location ? (
                      <p className="mt-0.5 text-[10px] text-slate-500 truncate flex items-center gap-1">
                        <FaMapMarkerAlt className="h-2 w-2 shrink-0 opacity-70" />
                        {ad.location}
                      </p>
                    ) : null}
                  </div>
                </Link>
              ))}
            </div>
          </div>
        </aside>

        {/* Clive: paid adverts — slightly bigger */}
        <div className="lg:col-span-8 order-1 lg:order-2">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            {paid.map((ad) => (
              <Link
                key={ad.id}
                to={ad.href}
                className="group flex flex-col rounded-xl border border-slate-200/90 bg-white overflow-hidden shadow-sm hover:border-indigo-200 hover:shadow-md transition-all"
              >
                <div className="relative aspect-[16/10] bg-slate-100 overflow-hidden">
                  <img
                    src={ad.image}
                    alt=""
                    className="absolute inset-0 h-full w-full object-cover transition-transform duration-300 group-hover:scale-[1.03]"
                    onError={(e) => {
                      e.currentTarget.src = '/img/no-image.png';
                    }}
                  />
                  <span className="absolute top-2 left-2 rounded-md bg-indigo-600/95 px-2 py-0.5 text-[10px] font-bold uppercase tracking-wide text-white shadow-sm">
                    Paid
                  </span>
                </div>
                <div className="p-3 flex flex-col gap-1 min-h-[4.25rem]">
                  <p className="text-sm font-semibold text-slate-900 leading-snug line-clamp-2 group-hover:text-indigo-800">
                    {ad.title}
                  </p>
                  {(ad.tagline || ad.location) && (
                    <p className="text-[11px] text-slate-500 truncate mt-auto">
                      {ad.tagline || ad.location}
                    </p>
                  )}
                </div>
              </Link>
            ))}
          </div>
        </div>
      </div>

      {/* Featured — compact strip so they still appear on the profile */}
      {featured.length > 0 ? (
        <div className="rounded-xl border border-slate-200/90 bg-white p-3 shadow-sm">
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5">
            {featured.map((ad) => (
              <Link
                key={ad.id}
                to={ad.href}
                className="group relative overflow-hidden rounded-lg border border-slate-100 bg-slate-50 aspect-[5/3]"
              >
                <img
                  src={ad.image}
                  alt=""
                  className="absolute inset-0 h-full w-full object-cover transition-transform duration-300 group-hover:scale-[1.04]"
                  onError={(e) => {
                    e.currentTarget.src = '/img/no-image.png';
                  }}
                />
                <div className="absolute inset-0 bg-gradient-to-t from-slate-950/75 via-slate-950/10 to-transparent" />
                <span className="absolute top-1.5 left-1.5 rounded bg-amber-500/95 px-1.5 py-0.5 text-[9px] font-bold uppercase tracking-wide text-white">
                  Featured
                </span>
                <p className="absolute bottom-1.5 left-1.5 right-1.5 text-[11px] font-semibold text-white line-clamp-2 drop-shadow">
                  {ad.title}
                </p>
              </Link>
            ))}
          </div>
        </div>
      ) : null}
    </div>
  );
};

export default BusinessPageAdvertsRail;
