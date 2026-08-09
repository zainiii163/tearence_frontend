import React from 'react';
import { Link } from 'react-router-dom';
import { FaBullhorn, FaStar, FaRocket, FaImage, FaArrowRight } from 'react-icons/fa';
import CategoryPageShell from '../Component/shared/CategoryPageShell';
import BrowseMarketplaceHero from '../Component/shared/BrowseMarketplaceHero';
import { getCategoryTheme } from '../constants/categoryThemes';

const HERO_BG =
  'https://images.unsplash.com/photo-1557804506-669a67965ba0?auto=format&fit=crop&w=1920&q=80';

const ADVERT_TILES = [
  {
    id: 'sponsored',
    name: 'Sponsored',
    description: 'Premium placements with maximum visibility across Worldwide Adverts.',
    to: '/sponsored-adverts',
    icon: FaBullhorn,
    accent: 'from-violet-600 to-indigo-600',
    border: 'border-violet-200',
  },
  {
    id: 'featured',
    name: 'Featured',
    description: 'Highlighted listings that stay at the top of category results.',
    to: '/featured-adverts',
    icon: FaStar,
    accent: 'from-amber-500 to-orange-500',
    border: 'border-amber-200',
  },
  {
    id: 'promoted',
    name: 'Promoted',
    description: 'Boost campaigns that push your offer ahead of standard posts.',
    to: '/promoted-adverts',
    icon: FaRocket,
    accent: 'from-rose-500 to-pink-500',
    border: 'border-rose-200',
  },
  {
    id: 'banners',
    name: 'Banners',
    description: 'Display banner inventory for site-wide brand campaigns.',
    to: '/banner-adverts',
    icon: FaImage,
    accent: 'from-sky-500 to-blue-600',
    border: 'border-sky-200',
  },
];

/**
 * Combined Adverts hub — Sponsored, Featured, Promoted, Banners.
 * Layout: Adverts heading, then four lanes in one row on desktop.
 */
const AdvertsHubPage = () => {
  const theme = getCategoryTheme('adverts') || getCategoryTheme('sponsored');

  return (
    <CategoryPageShell
      categoryId="adverts"
      backHref="/"
      showBackBar
      backBarTo="/"
      backBarLabel="Back Home"
      hero={
        <BrowseMarketplaceHero
          title="Adverts"
          eyebrow="All paid posts"
          subtitle="Sponsored · Featured · Promoted · Banners — one hub for marketplace advertising."
          imageUrl={HERO_BG}
          theme={theme.heroTheme || 'violet'}
        />
      }
    >
      <div className="mb-5 text-center sm:text-left">
        <p className="text-[11px] font-semibold uppercase tracking-[0.18em] text-violet-700">
          Adverts
        </p>
        <h2 className="mt-1 text-xl font-bold text-slate-900">
          Sponsored · Featured · Promoted · Banners
        </h2>
        <p className="mt-1 text-sm text-slate-500">
          All paid post formats live under Adverts. Pick a lane to browse or create.
        </p>
      </div>

      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4">
        {ADVERT_TILES.map((tile) => {
          const Icon = tile.icon;
          return (
            <Link
              key={tile.id}
              to={tile.to}
              className={`group rounded-2xl border ${tile.border} bg-white p-4 sm:p-5 shadow-sm hover:shadow-md transition-all hover:-translate-y-0.5`}
            >
              <span
                className={`inline-flex h-11 w-11 items-center justify-center rounded-xl bg-gradient-to-br ${tile.accent} text-white shadow`}
              >
                <Icon className="h-5 w-5" />
              </span>
              <h3 className="mt-3 text-base sm:text-lg font-semibold text-slate-900">{tile.name}</h3>
              <p className="mt-1 text-xs sm:text-sm text-slate-500 leading-relaxed line-clamp-3">
                {tile.description}
              </p>
              <span className="mt-3 inline-flex items-center gap-1.5 text-sm font-semibold text-slate-800 group-hover:gap-2 transition-all">
                Open
                <FaArrowRight className="h-3 w-3" />
              </span>
            </Link>
          );
        })}
      </div>
    </CategoryPageShell>
  );
};

export default AdvertsHubPage;
