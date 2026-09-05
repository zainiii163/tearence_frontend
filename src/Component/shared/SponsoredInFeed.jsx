import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { FaGem } from 'react-icons/fa';
import sponsoredAdvertsAPI from '../../api/sponsoredAdvertsAPI';
import { resolveStorageUrl } from '../../utils/dashboardEditMappers';

const normalizeRows = (payload) => {
  if (!payload) return [];
  if (Array.isArray(payload)) return payload;
  if (Array.isArray(payload.data?.data)) return payload.data.data;
  if (Array.isArray(payload.data)) return payload.data;
  return [];
};

const mapSponsored = (ad) => {
  const id = ad.id || ad.sponsored_advert_id;
  const slug = ad.slug || id;
  const image =
    resolveStorageUrl(ad.main_image || ad.image || ad.thumbnail || ad.badges?.[0]) ||
    ad.main_image ||
    ad.image ||
    null;
  return {
    id: `sponsored-${id}`,
    kind: 'sponsored',
    title: ad.title || 'Sponsored offer',
    href: `/sponsored-adverts/${slug}`,
    image,
    location: [ad.city, ad.country].filter(Boolean).join(', ') || ad.location || '',
  };
};

/**
 * Clive: promote paying sponsors between hub feeds (e.g. vehicles).
 * Fetches site-wide sponsored feed and exposes cards for interleaving.
 */
export function useSponsoredInFeed({ hub = 'vehicles', limit = 8, enabled = true } = {}) {
  const [ads, setAds] = useState([]);

  useEffect(() => {
    if (!enabled) return undefined;
    let cancelled = false;
    (async () => {
      try {
        const res = await sponsoredAdvertsAPI.getSiteFeed({
          per_page: limit,
          page: 1,
          hub,
        }).catch(() => sponsoredAdvertsAPI.getSponsoredAdverts({ per_page: limit, page: 1 }));
        if (cancelled) return;
        setAds(normalizeRows(res).slice(0, limit).map(mapSponsored));
      } catch {
        if (!cancelled) setAds([]);
      }
    })();
    return () => {
      cancelled = true;
    };
  }, [hub, limit, enabled]);

  return ads;
}

/**
 * Merge listing cards with sponsored cards every `every` items.
 */
export function interleaveSponsored(listings = [], sponsored = [], every = 4) {
  if (!Array.isArray(listings) || !listings.length) return listings || [];
  if (!Array.isArray(sponsored) || !sponsored.length) return listings;
  const out = [];
  let s = 0;
  listings.forEach((item, idx) => {
    out.push(item);
    if ((idx + 1) % every === 0 && s < sponsored.length) {
      out.push(sponsored[s]);
      s += 1;
    }
  });
  // leftover sponsors after the list
  while (s < sponsored.length) {
    out.push(sponsored[s]);
    s += 1;
  }
  return out;
}

export function SponsoredFeedCard({ ad }) {
  if (!ad) return null;
  return (
    <Link
      to={ad.href}
      className="group flex flex-col h-full bg-white rounded-xl border border-orange-200/80 overflow-hidden shadow-sm hover:shadow-md hover:border-orange-300 transition-all text-left"
    >
      <div className="relative h-24 sm:h-28 w-full bg-orange-50 overflow-hidden">
        {ad.image ? (
          <img
            src={ad.image}
            alt=""
            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
            loading="lazy"
            onError={(e) => {
              e.currentTarget.style.display = 'none';
            }}
          />
        ) : (
          <div className="w-full h-full bg-gradient-to-br from-orange-400 to-amber-600 flex items-center justify-center">
            <FaGem className="h-8 w-8 text-white/80" />
          </div>
        )}
        <span className="absolute top-1.5 left-1.5 rounded bg-orange-500 px-1.5 py-0.5 text-[9px] font-bold uppercase tracking-wide text-white">
          Sponsored
        </span>
      </div>
      <div className="p-2.5 flex flex-col flex-1">
        <h3 className="text-xs sm:text-sm font-bold text-slate-900 line-clamp-2 leading-snug group-hover:text-orange-800">
          {ad.title}
        </h3>
        {ad.location ? (
          <p className="text-[11px] text-slate-500 mt-1 truncate">{ad.location}</p>
        ) : null}
        <span className="mt-auto pt-2 inline-flex items-center justify-center w-full rounded-full bg-orange-600 text-white text-[10px] font-bold py-1.5 group-hover:bg-orange-700">
          View offer
        </span>
      </div>
    </Link>
  );
}

export default function SponsoredInFeedNote() {
  return null;
}
