import React from 'react';
import { Link } from 'react-router-dom';
import BrowseMarketplaceHero from '../shared/BrowseMarketplaceHero';
import { getCategoryTheme } from '../../constants/categoryThemes';

const HERO_BG =
  'https://images.unsplash.com/photo-1460925895917-afdab827c52f?auto=format&fit=crop&w=1920&q=80';

/**
 * Marketplace hero — programs hub vs links-to-promote hub (ClickBank-style split).
 */
const AffiliateHero = ({ hubMode = 'programs', ...props }) => {
  const isPrograms = hubMode !== 'links';

  return (
    <div>
      <BrowseMarketplaceHero
        title={isPrograms ? 'Affiliate Programs' : 'Links to Promote'}
        titlePrefix={isPrograms ? 'Affiliate Programs' : 'Links to Promote'}
        eyebrow="Affiliates"
        subtitle={
          isPrograms
            ? 'Browse merchant programs, join to promote, and earn commission — ClickBank style'
            : 'Discover affiliate tracking links shared by promoters and featured partners'
        }
        imageUrl={HERO_BG}
        theme={getCategoryTheme('affiliate').heroTheme}
        searchPlaceholder={
          isPrograms ? 'Search affiliate programs…' : 'Search links to promote…'
        }
        {...props}
      />
      <div className="relative z-10 -mt-2 mb-2 flex justify-center px-4">
        <div className="inline-flex rounded-full border border-violet-200 bg-white/95 p-1 shadow-sm backdrop-blur">
          <Link
            to="/affiliates"
            className={`rounded-full px-4 py-1.5 text-xs font-semibold transition ${
              isPrograms
                ? 'bg-violet-700 text-white'
                : 'text-violet-800 hover:bg-violet-50'
            }`}
          >
            Programs
          </Link>
          <Link
            to="/affiliates/links"
            className={`rounded-full px-4 py-1.5 text-xs font-semibold transition ${
              !isPrograms
                ? 'bg-violet-700 text-white'
                : 'text-violet-800 hover:bg-violet-50'
            }`}
          >
            Links to promote
          </Link>
        </div>
      </div>
    </div>
  );
};

export default AffiliateHero;
