import React from 'react';
import { Link } from 'react-router-dom';
import BrowseMarketplaceHero from '../shared/BrowseMarketplaceHero';
import { getCategoryTheme } from '../../constants/categoryThemes';

const HERO_BG =
  'https://images.unsplash.com/photo-1460925895917-afdab827c52f?auto=format&fit=crop&w=1920&q=80';

/**
 * Marketplace hero — programs (join) vs affiliate link ads (view promoted hops).
 */
const AffiliateHero = ({ hubMode = 'programs', ...props }) => {
  const isPrograms = hubMode !== 'links';

  return (
    <div>
      <BrowseMarketplaceHero
        title={isPrograms ? 'Affiliate Programs' : 'Affiliate Link Ads'}
        titlePrefix={isPrograms ? 'Affiliate Programs' : 'Affiliate Link Ads'}
        eyebrow="Affiliates"
        subtitle={
          isPrograms
            ? 'Browse merchant programs, apply to promote, and earn commission with your own hop link'
            : 'View affiliate posts already being marketed — open the ClickBank hop URL as posted'
        }
        imageUrl={HERO_BG}
        theme={getCategoryTheme('affiliate').heroTheme}
        searchPlaceholder={
          isPrograms ? 'Search affiliate programs…' : 'Search affiliate link ads…'
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
            Link ads
          </Link>
        </div>
      </div>
    </div>
  );
};

export default AffiliateHero;
