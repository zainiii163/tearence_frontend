import React from 'react';
import { Link } from 'react-router-dom';
import { FiFileText } from 'react-icons/fi';
import { Calculator } from 'lucide-react';
import BrowseHeroSearch from './BrowseHeroSearch';
import { withImageWidth } from '../../utils/responsiveImage';

/**
 * Shared polished marketplace hero (Buy & Sell style).
 * Clear photo + layered wash + grid texture + brand-matched search CTA.
 */
export const HERO_THEMES = {
  emerald: {
    eyebrow: 'Buy & Sell',
    wash: `
      linear-gradient(125deg, rgba(4, 47, 36, 0.78) 0%, rgba(6, 78, 59, 0.65) 42%, rgba(15, 118, 110, 0.58) 100%),
      linear-gradient(to top, rgba(2, 44, 34, 0.4) 0%, transparent 55%)
    `,
    bloom: 'bg-emerald-300/20',
    eyebrowClass: 'text-emerald-200/90',
    chipIcon: 'text-emerald-700',
    chipText: 'text-emerald-950',
    accentClass: 'text-emerald-700',
    ringClass: 'focus:ring-emerald-400/80',
    buttonClass: 'bg-emerald-700 hover:bg-emerald-800',
  },
  teal: {
    eyebrow: 'Services',
    wash: `
      linear-gradient(125deg, rgba(19, 78, 74, 0.93) 0%, rgba(15, 118, 110, 0.8) 45%, rgba(6, 95, 70, 0.75) 100%),
      linear-gradient(to top, rgba(17, 94, 89, 0.55) 0%, transparent 55%)
    `,
    bloom: 'bg-teal-300/20',
    eyebrowClass: 'text-teal-100/90',
    chipIcon: 'text-teal-700',
    chipText: 'text-teal-950',
    accentClass: 'text-teal-700',
    ringClass: 'focus:ring-teal-400/80',
    buttonClass: 'bg-teal-700 hover:bg-teal-800',
  },
  slate: {
    eyebrow: 'Property',
    wash: `
      linear-gradient(125deg, rgba(12, 21, 32, 0.94) 0%, rgba(26, 40, 56, 0.82) 48%, rgba(42, 58, 46, 0.78) 100%),
      linear-gradient(to top, rgba(12, 21, 32, 0.6) 0%, transparent 55%)
    `,
    bloom: 'bg-amber-400/15',
    eyebrowClass: 'text-amber-200/85',
    chipIcon: 'text-amber-700',
    chipText: 'text-slate-900',
    accentClass: 'text-amber-700',
    ringClass: 'focus:ring-amber-400/70',
    buttonClass: 'bg-amber-700 hover:bg-amber-800',
  },
  // Property homepage accent — violet wash aligned with category cards
  propertyViolet: {
    eyebrow: 'Property',
    wash: `
      linear-gradient(125deg, rgba(76, 29, 149, 0.9) 0%, rgba(109, 40, 217, 0.78) 45%, rgba(91, 33, 182, 0.72) 100%),
      linear-gradient(to top, rgba(76, 29, 149, 0.5) 0%, transparent 55%)
    `,
    bloom: 'bg-violet-300/20',
    eyebrowClass: 'text-violet-100/90',
    chipIcon: 'text-violet-700',
    chipText: 'text-violet-950',
    accentClass: 'text-violet-700',
    ringClass: 'focus:ring-violet-400/70',
    buttonClass: 'bg-violet-700 hover:bg-violet-800',
  },
  red: {
    eyebrow: 'Vehicles',
    wash: `
      linear-gradient(125deg, rgba(69, 10, 10, 0.8) 0%, rgba(127, 29, 29, 0.68) 42%, rgba(30, 41, 59, 0.65) 100%),
      linear-gradient(to top, rgba(27, 10, 10, 0.4) 0%, transparent 55%)
    `,
    bloom: 'bg-rose-300/15',
    eyebrowClass: 'text-rose-100/90',
    chipIcon: 'text-red-700',
    chipText: 'text-slate-900',
    accentClass: 'text-red-700',
    ringClass: 'focus:ring-red-400/70',
    buttonClass: 'bg-red-700 hover:bg-red-800',
  },
  violet: {
    eyebrow: 'Business',
    wash: `
      linear-gradient(125deg, rgba(49, 46, 129, 0.93) 0%, rgba(91, 33, 182, 0.8) 45%, rgba(112, 26, 117, 0.78) 100%),
      linear-gradient(to top, rgba(49, 46, 129, 0.55) 0%, transparent 55%)
    `,
    bloom: 'bg-violet-300/20',
    eyebrowClass: 'text-violet-100/90',
    chipIcon: 'text-violet-700',
    chipText: 'text-violet-950',
    accentClass: 'text-violet-700',
    ringClass: 'focus:ring-violet-400/70',
    buttonClass: 'bg-violet-700 hover:bg-violet-800',
  },
  amber: {
    eyebrow: 'Books',
    wash: `
      linear-gradient(125deg, rgba(120, 53, 15, 0.93) 0%, rgba(180, 83, 9, 0.8) 45%, rgba(154, 52, 18, 0.78) 100%),
      linear-gradient(to top, rgba(120, 53, 15, 0.55) 0%, transparent 55%)
    `,
    bloom: 'bg-amber-300/20',
    eyebrowClass: 'text-amber-100/90',
    chipIcon: 'text-amber-800',
    chipText: 'text-amber-950',
    accentClass: 'text-amber-800',
    ringClass: 'focus:ring-amber-400/70',
    buttonClass: 'bg-amber-700 hover:bg-amber-800',
  },
  orange: {
    eyebrow: 'For sale',
    wash: `
      linear-gradient(125deg, rgba(124, 45, 18, 0.93) 0%, rgba(194, 65, 12, 0.8) 42%, rgba(190, 24, 93, 0.75) 100%),
      linear-gradient(to top, rgba(124, 45, 18, 0.55) 0%, transparent 55%)
    `,
    bloom: 'bg-orange-300/20',
    eyebrowClass: 'text-orange-100/90',
    chipIcon: 'text-orange-700',
    chipText: 'text-orange-950',
    accentClass: 'text-orange-700',
    ringClass: 'focus:ring-orange-400/70',
    buttonClass: 'bg-orange-700 hover:bg-orange-800',
  },
  blue: {
    eyebrow: 'Jobs',
    wash: `
      linear-gradient(125deg, rgba(23, 37, 84, 0.8) 0%, rgba(29, 78, 216, 0.68) 45%, rgba(14, 116, 144, 0.62) 100%),
      linear-gradient(to top, rgba(23, 37, 84, 0.4) 0%, transparent 55%)
    `,
    bloom: 'bg-sky-300/20',
    eyebrowClass: 'text-sky-100/90',
    chipIcon: 'text-blue-700',
    chipText: 'text-blue-950',
    accentClass: 'text-blue-700',
    ringClass: 'focus:ring-blue-400/70',
    buttonClass: 'bg-blue-700 hover:bg-blue-800',
  },
  purple: {
    eyebrow: 'Entertainment',
    wash: `
      linear-gradient(125deg, rgba(76, 29, 149, 0.93) 0%, rgba(91, 33, 182, 0.82) 45%, rgba(49, 46, 129, 0.78) 100%),
      linear-gradient(to top, rgba(76, 29, 149, 0.55) 0%, transparent 55%)
    `,
    bloom: 'bg-violet-300/20',
    eyebrowClass: 'text-violet-100/90',
    chipIcon: 'text-purple-700',
    chipText: 'text-purple-950',
    accentClass: 'text-purple-700',
    ringClass: 'focus:ring-purple-400/70',
    buttonClass: 'bg-purple-700 hover:bg-purple-800',
  },
  gold: {
    eyebrow: 'Sponsored',
    wash: `
      linear-gradient(125deg, rgba(120, 53, 15, 0.82) 0%, rgba(180, 83, 9, 0.7) 42%, rgba(161, 98, 7, 0.68) 100%),
      linear-gradient(to top, rgba(120, 53, 15, 0.4) 0%, transparent 55%)
    `,
    bloom: 'bg-amber-300/25',
    eyebrowClass: 'text-amber-100/90',
    chipIcon: 'text-amber-800',
    chipText: 'text-amber-950',
    accentClass: 'text-amber-800',
    ringClass: 'focus:ring-amber-400/70',
    buttonClass: 'bg-amber-700 hover:bg-amber-800',
  },
  social: {
    eyebrow: 'Social Hub',
    wash: `
      linear-gradient(125deg, rgba(30, 58, 138, 0.78) 0%, rgba(37, 99, 235, 0.68) 45%, rgba(79, 70, 229, 0.65) 100%),
      linear-gradient(to top, rgba(30, 58, 138, 0.4) 0%, transparent 55%)
    `,
    bloom: 'bg-sky-300/25',
    eyebrowClass: 'text-sky-100/90',
    chipIcon: 'text-blue-700',
    chipText: 'text-blue-950',
    accentClass: 'text-blue-700',
    ringClass: 'focus:ring-blue-400/70',
    buttonClass: 'bg-blue-600 hover:bg-blue-700',
  },
  indigo: {
    eyebrow: 'Banner Ads',
    wash: `
      linear-gradient(125deg, rgba(49, 46, 129, 0.9) 0%, rgba(67, 56, 202, 0.78) 45%, rgba(29, 78, 216, 0.72) 100%),
      linear-gradient(to top, rgba(49, 46, 129, 0.5) 0%, transparent 55%)
    `,
    bloom: 'bg-indigo-300/20',
    eyebrowClass: 'text-indigo-100/90',
    chipIcon: 'text-indigo-700',
    chipText: 'text-indigo-950',
    accentClass: 'text-indigo-700',
    ringClass: 'focus:ring-indigo-400/70',
    buttonClass: 'bg-indigo-700 hover:bg-indigo-800',
  },
  cyan: {
    eyebrow: 'Travel',
    wash: `
      linear-gradient(125deg, rgba(22, 78, 99, 0.9) 0%, rgba(8, 145, 178, 0.78) 45%, rgba(14, 116, 144, 0.72) 100%),
      linear-gradient(to top, rgba(22, 78, 99, 0.5) 0%, transparent 55%)
    `,
    bloom: 'bg-cyan-300/20',
    eyebrowClass: 'text-cyan-100/90',
    chipIcon: 'text-cyan-700',
    chipText: 'text-cyan-950',
    accentClass: 'text-cyan-700',
    ringClass: 'focus:ring-cyan-400/70',
    buttonClass: 'bg-cyan-700 hover:bg-cyan-800',
  },
  rose: {
    eyebrow: 'Affiliates',
    wash: `
      linear-gradient(125deg, rgba(136, 19, 55, 0.9) 0%, rgba(190, 24, 93, 0.78) 45%, rgba(225, 29, 72, 0.72) 100%),
      linear-gradient(to top, rgba(136, 19, 55, 0.5) 0%, transparent 55%)
    `,
    bloom: 'bg-rose-300/20',
    eyebrowClass: 'text-rose-100/90',
    chipIcon: 'text-rose-700',
    chipText: 'text-rose-950',
    accentClass: 'text-rose-700',
    ringClass: 'focus:ring-rose-400/70',
    buttonClass: 'bg-rose-700 hover:bg-rose-800',
  },
};

const BrowseMarketplaceHero = ({
  title,
  titlePrefix = null,
  eyebrow = null,
  subtitle = null,
  imageUrl,
  theme = 'emerald',
  categoryLabel = null,
  searchValue = '',
  onSearchChange,
  onSearchSubmit,
  searchPlaceholder = 'Search…',
  templatesHref,
  calculatorsHref,
  templatesLabel = 'Templates',
  calculatorsLabel = 'Calculators',
  /** Full chip row override: [{ to, label, icon?, onClick?, active? }] */
  heroChips = null,
  /** Larger CTAs under search (Affiliate Marketplace / Courses) */
  heroChipSize = 'sm',
  trending = null,
  onTrendingClick,
  compact = true,
  /** Extra-short hero (property / Clive) */
  dense = false,
}) => {
  const t = HERO_THEMES[theme] || HERO_THEMES.emerald;
  // Pass eyebrow="" to hide the small brand line (title-only heroes).
  const hideEyebrow = eyebrow === '';
  const resolvedEyebrow = hideEyebrow ? null : (eyebrow || t.eyebrow);
  const brand = (titlePrefix || resolvedEyebrow || title || '').trim();
  // Category pages: keep brand in the eyebrow, show the category name as the main title
  const heading = categoryLabel
    ? String(categoryLabel).trim()
    : title;
  const showEyebrow = Boolean(resolvedEyebrow || (categoryLabel && brand));
  const eyebrowText = categoryLabel
    ? (resolvedEyebrow || brand)
    : resolvedEyebrow;
  const showTrending =
    !categoryLabel && Array.isArray(trending) && trending.length > 0 && typeof onTrendingClick === 'function';
  const heroSrc = withImageWidth(imageUrl, 1280);
  const searchSize = dense ? 'xs' : compact ? 'sm' : 'md';
  const padClass = dense
    ? 'py-3 sm:py-4'
    : compact
      ? 'py-6 sm:py-8'
      : 'py-8 sm:py-10';

  // UnifiedNavbar renders its own spacer for the fixed bar — no extra hero offset.
  const navClearClass = '';

  return (
    <header className={`relative overflow-hidden ${navClearClass}`}>
      <div
        className="absolute inset-0 bg-cover bg-center"
        style={{ backgroundImage: heroSrc ? `url('${heroSrc}')` : undefined }}
        aria-hidden="true"
      />
      <div className="absolute inset-0" style={{ background: t.wash }} aria-hidden="true" />
      <div
        className={`pointer-events-none absolute -top-16 left-1/2 h-40 w-[28rem] -translate-x-1/2 rounded-full blur-3xl ${t.bloom}`}
        aria-hidden="true"
      />
      <div
        className="pointer-events-none absolute inset-0 opacity-[0.07]"
        style={{
          backgroundImage:
            'linear-gradient(rgba(255,255,255,.9) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,.9) 1px, transparent 1px)',
          backgroundSize: '28px 28px',
        }}
        aria-hidden="true"
      />

      <div className={`relative page-container ${padClass}`}>
        <div className={`mx-auto text-center ${dense ? 'max-w-sm' : 'max-w-lg'}`}>
          {showEyebrow && eyebrowText && (
            <p className={`mb-1 text-[9px] sm:text-[10px] font-semibold uppercase tracking-[0.2em] ${t.eyebrowClass}`}>
              {eyebrowText}
            </p>
          )}
          <h1
            className={`font-semibold tracking-tight text-white drop-shadow-sm text-center ${
              dense ? 'text-lg sm:text-xl' : 'text-2xl sm:text-3xl'
            }`}
          >
            {heading}
          </h1>

          {typeof onSearchChange === 'function' && (
            <div className={dense ? 'mt-2 space-y-1.5' : 'mt-3 space-y-2.5'}>
              <BrowseHeroSearch
                value={searchValue}
                onChange={onSearchChange}
                onSubmit={onSearchSubmit}
                placeholder={searchPlaceholder}
                size={searchSize}
                accentClass={t.accentClass}
                ringClass={t.ringClass}
                buttonClass={t.buttonClass}
              />

              {((Array.isArray(heroChips) && heroChips.length > 0) ||
                templatesHref ||
                calculatorsHref) && (
                <div className="flex flex-wrap items-center justify-center gap-1.5">
                  {Array.isArray(heroChips) && heroChips.length > 0 ? (
                    heroChips.map((chip) => {
                      const large = heroChipSize === 'lg';
                      const chipClass = `inline-flex items-center justify-center font-semibold shadow-sm transition hover:bg-white ${t.chipText} ${
                        large
                          ? `gap-2 rounded-lg px-5 py-2.5 text-sm border ${
                              chip.active
                                ? 'border-white bg-white'
                                : 'border-white/40 bg-white/95'
                            }`
                          : `gap-1 rounded-md border border-white/30 bg-white/95 ${
                              dense ? 'px-2 py-1 text-[10px]' : 'gap-1.5 px-3 py-1.5 text-[11px]'
                            }`
                      }`;
                      if (typeof chip.onClick === 'function') {
                        return (
                          <button
                            key={chip.label}
                            type="button"
                            onClick={chip.onClick}
                            className={chipClass}
                          >
                            {chip.icon || null}
                            {chip.label}
                          </button>
                        );
                      }
                      return (
                        <Link
                          key={chip.to || chip.label}
                          to={chip.to}
                          className={chipClass}
                        >
                          {chip.icon || null}
                          {chip.label}
                        </Link>
                      );
                    })
                  ) : (
                    <>
                      {templatesHref && (
                        <Link
                          to={templatesHref}
                          className={`inline-flex items-center gap-1 rounded-md border border-white/30 bg-white/95 font-semibold shadow-sm transition hover:bg-white ${t.chipText} ${
                            dense ? 'px-2 py-1 text-[10px]' : 'gap-1.5 px-3 py-1.5 text-[11px]'
                          }`}
                        >
                          <FiFileText className={`h-3 w-3 ${t.chipIcon}`} />
                          {templatesLabel}
                        </Link>
                      )}
                      {calculatorsHref && (
                        <Link
                          to={calculatorsHref}
                          className={`inline-flex items-center gap-1 rounded-md border border-white/30 bg-white/95 font-semibold shadow-sm transition hover:bg-white ${t.chipText} ${
                            dense ? 'px-2 py-1 text-[10px]' : 'gap-1.5 px-3 py-1.5 text-[11px]'
                          }`}
                        >
                          <Calculator className={`h-3 w-3 ${t.chipIcon}`} />
                          {calculatorsLabel}
                        </Link>
                      )}
                    </>
                  )}
                </div>
              )}

              {showTrending && (
                <div className="flex flex-wrap justify-center gap-1.5 pt-0.5">
                  {trending.map((term) => (
                    <button
                      key={term}
                      type="button"
                      onClick={() => onTrendingClick(term)}
                      className="px-2 py-0.5 text-[10px] font-medium rounded-md bg-white/15 hover:bg-white/25 text-white border border-white/10"
                    >
                      {term}
                    </button>
                  ))}
                </div>
              )}
            </div>
          )}
        </div>
      </div>
    </header>
  );
};

export default BrowseMarketplaceHero;
