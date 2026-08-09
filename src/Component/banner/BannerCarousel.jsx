import React, { useMemo, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ExternalLink, Eye, X } from 'lucide-react';
import { trackBannerClick } from '../../api/banner';
import { getStorageAssetUrl, rewriteLocalStorageUrl } from '../../utils/jobsHelpers';
import ProtectedBannerImage from './ProtectedBannerImage';
import { getSafeBannerVisitUrl } from '../../data/bannerMarketplaceCatalog';

/** Resolve a usable public image URL; skip broken catalog /img placeholders. */
export const resolveBannerImageUrl = (banner) => {
  if (!banner || banner.is_catalog) return null;
  const raw =
    banner.banner_image_url ||
    banner.banner_image ||
    banner.image_url ||
    banner.bannerImage ||
    banner.image;
  if (!raw || typeof raw !== 'string') return null;
  const v = raw.trim();
  if (!v) return null;
  // Local marketplace catalog paths are missing on disk → broken icons
  if (v.includes('/img/banners/marketplace')) return null;
  if (v.startsWith('http://') || v.startsWith('https://')) {
    return rewriteLocalStorageUrl(v);
  }
  return getStorageAssetUrl(v);
};

/**
 * Compact featured strip — continuously scrolling real banner images.
 */
const BannerCarousel = ({ banners, loading, onBannerClick }) => {
  const [expandedBanner, setExpandedBanner] = useState(null);
  const [paused, setPaused] = useState(false);

  const items = useMemo(() => {
    const list = Array.isArray(banners) ? banners : [];
    return list
      .map((b) => ({ ...b, _image: resolveBannerImageUrl(b) }))
      .filter((b) => Boolean(b._image));
  }, [banners]);

  // Duplicate for seamless loop
  const loop = items.length > 1 ? [...items, ...items] : items;

  const handleBannerClick = async (banner) => {
    try {
      if (banner.slug && !banner.is_catalog) await trackBannerClick(banner.slug);
    } catch {
      /* non-blocking */
    }
    setExpandedBanner(banner);
    onBannerClick?.(banner);
  };

  if (loading) {
    return (
      <div className="page-container mb-4">
        <div className="h-28 sm:h-32 rounded-xl bg-slate-100 animate-pulse" />
      </div>
    );
  }

  if (!items.length) {
    return null;
  }

  const durationSec = Math.max(18, items.length * 4);

  return (
    <>
      <section className="page-container mb-5">
        <div className="flex items-center justify-between mb-2">
          <h2 className="text-sm sm:text-base font-bold text-gray-900">
            Featured Banner Adverts
          </h2>
          <span className="text-[10px] text-gray-500">{items.length} live</span>
        </div>

        <div
          className="relative overflow-hidden rounded-xl border border-slate-200 bg-white shadow-sm"
          onMouseEnter={() => setPaused(true)}
          onMouseLeave={() => setPaused(false)}
        >
          <div
            className="flex w-max gap-3 py-2.5 px-2.5"
            style={
              items.length > 1
                ? {
                    animationName: 'banner-marquee',
                    animationDuration: `${durationSec}s`,
                    animationTimingFunction: 'linear',
                    animationIterationCount: 'infinite',
                    animationPlayState: paused ? 'paused' : 'running',
                  }
                : undefined
            }
          >
            {loop.map((banner, index) => (
              <button
                key={`${banner.id || banner.slug || 'b'}-${index}`}
                type="button"
                onClick={() => handleBannerClick(banner)}
                className="group relative shrink-0 w-[220px] sm:w-[280px] h-[72px] sm:h-[88px] rounded-lg overflow-hidden border border-slate-100 hover:border-indigo-300 hover:shadow-md transition-all bg-slate-100"
              >
                <img
                  src={banner._image}
                  alt={banner.title || 'Banner'}
                  className="h-full w-full object-cover"
                  loading="lazy"
                  onError={(e) => {
                    e.currentTarget.style.display = 'none';
                  }}
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/65 via-black/10 to-transparent opacity-90 group-hover:opacity-100" />
                <div className="absolute bottom-1 left-1.5 right-1.5 text-left">
                  <p className="text-[10px] sm:text-xs font-semibold text-white truncate drop-shadow">
                    {banner.title || 'Banner'}
                  </p>
                  <p className="text-[9px] text-white/80 truncate">
                    {banner.business_name || banner.businessName || ''}
                  </p>
                </div>
              </button>
            ))}
          </div>
        </div>

        <style>{`
          @keyframes banner-marquee {
            0% { transform: translateX(0); }
            100% { transform: translateX(-50%); }
          }
        `}</style>
      </section>

      <AnimatePresence>
        {expandedBanner && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/80 flex items-center justify-center z-50 p-4"
            onClick={() => setExpandedBanner(null)}
          >
            <motion.div
              initial={{ scale: 0.95, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.95, opacity: 0 }}
              className="bg-white rounded-2xl max-w-3xl w-full overflow-hidden shadow-2xl"
              onClick={(e) => e.stopPropagation()}
            >
              <div className="relative">
                <button
                  type="button"
                  onClick={() => setExpandedBanner(null)}
                  className="absolute top-3 right-3 z-10 p-2 rounded-full bg-black/50 text-white hover:bg-black/70"
                  aria-label="Close"
                >
                  <X className="w-4 h-4" />
                </button>
                <ProtectedBannerImage
                  src={resolveBannerImageUrl(expandedBanner)}
                  alt={expandedBanner.title || 'Banner'}
                  className="w-full max-h-[50vh] bg-slate-100"
                />
              </div>
              <div className="p-4 sm:p-5">
                <h3 className="text-lg font-bold text-gray-900 mb-1">
                  {expandedBanner.title}
                </h3>
                <p className="text-sm text-gray-600 mb-3">
                  {expandedBanner.business_name || expandedBanner.businessName}
                </p>
                <div className="flex items-center gap-3 text-xs text-gray-500 mb-4">
                  <span className="inline-flex items-center gap-1">
                    <Eye className="w-3.5 h-3.5" />
                    {(expandedBanner.views_count || expandedBanner.views || 0).toLocaleString()}{' '}
                    views
                  </span>
                </div>
                {getSafeBannerVisitUrl(expandedBanner) && (
                  <a
                    href={getSafeBannerVisitUrl(expandedBanner)}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-2 px-4 py-2 rounded-lg bg-indigo-700 text-white text-sm font-semibold hover:bg-indigo-800"
                  >
                    <ExternalLink className="w-4 h-4" />
                    Visit site
                  </a>
                )}
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
};

export default BannerCarousel;
