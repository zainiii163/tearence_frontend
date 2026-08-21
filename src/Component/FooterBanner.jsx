import React from 'react'

/**
 * Full-bleed page hero for help / about footer pages.
 * Pass `image` for a custom background; Ads Policies gets a dedicated creative.
 */
function FooterBanner({ title = '', image, subtitle }) {
  const capitalizedTitle = String(title || '').toUpperCase();
  const isAdsPolicy = /ads\s*polic/i.test(String(title || ''));
  const bg =
    image ||
    (isAdsPolicy ? '/img/ads-policy-hero.svg' : '/img/footer-banner-4.jpg');

  return (
    <div
      className="relative h-64 sm:h-80 w-full bg-cover bg-center text-center overflow-hidden"
      style={{ backgroundImage: `url(${bg})` }}
      role="img"
      aria-label={capitalizedTitle || 'Page banner'}
    >
      <div className="absolute inset-0 bg-gradient-to-b from-slate-950/55 via-slate-900/50 to-slate-950/70" />
      <div className="relative z-10 flex h-full flex-col items-center justify-center px-4 pt-8">
        <p className="mb-2 text-xs font-semibold tracking-[0.2em] text-sky-200/90 uppercase">
          World Wide Adverts
        </p>
        <h1 className="text-3xl sm:text-5xl md:text-6xl text-white font-bold tracking-tight drop-shadow-sm text-center">
          {capitalizedTitle}
        </h1>
        {subtitle ? (
          <p className="mt-3 max-w-xl text-sm sm:text-base text-slate-200/90 text-center">{subtitle}</p>
        ) : isAdsPolicy ? (
          <p className="mt-3 max-w-xl text-sm sm:text-base text-slate-200/90 text-center">
            Clear rules for honest advertising — so buyers and sellers stay protected.
          </p>
        ) : null}
      </div>
    </div>
  );
}

export default FooterBanner
