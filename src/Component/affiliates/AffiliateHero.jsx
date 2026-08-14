import React from 'react';
import { Link } from 'react-router-dom';
import BrowseMarketplaceHero from '../shared/BrowseMarketplaceHero';
import { getCategoryTheme } from '../../constants/categoryThemes';
import AffiliateHubNav from './AffiliateHubNav';
import { FaStore, FaGraduationCap } from 'react-icons/fa';

const HERO_BG =
  'https://images.unsplash.com/photo-1460925895917-afdab827c52f?auto=format&fit=crop&w=1920&q=80';

/**
 * Landing hero for Affiliate Ads (/affiliates).
 * Layout: Affiliates centred → search → Marketplace + Courses CTAs.
 */
const AffiliateHero = ({ showPostCta = false, onPostClick, ...props }) => {
  return (
    <div>
      <BrowseMarketplaceHero
        title="Affiliates"
        titlePrefix="Affiliates"
        eyebrow="Affiliate Ads"
        subtitle="Browse affiliate links being promoted — open the hop URL as posted by marketers"
        imageUrl={HERO_BG}
        theme={getCategoryTheme('affiliate').heroTheme}
        searchPlaceholder="Search affiliate link ads…"
        {...props}
      />
      <div className="relative z-10 -mt-2 mb-3 flex flex-col items-center gap-3 px-4">
        <AffiliateHubNav />

        <div className="flex flex-wrap items-center justify-center gap-2">
          <Link
            to="/affiliates/marketplace"
            className="inline-flex items-center gap-1.5 rounded-full border border-violet-200 bg-white px-4 py-2 text-xs font-semibold text-violet-800 shadow-sm hover:bg-violet-50"
          >
            <FaStore className="h-3 w-3 text-primary" />
            Marketplace
            <span className="hidden sm:inline font-normal text-slate-500">— apply to promote</span>
          </Link>
          <Link
            to="/affiliates/courses"
            className="inline-flex items-center gap-1.5 rounded-full border border-violet-200 bg-white px-4 py-2 text-xs font-semibold text-violet-800 shadow-sm hover:bg-violet-50"
          >
            <FaGraduationCap className="h-3 w-3 text-primary" />
            Courses
            <span className="hidden sm:inline font-normal text-slate-500">— get started guides</span>
          </Link>
          {showPostCta && onPostClick ? (
            <button
              type="button"
              onClick={onPostClick}
              className="rounded-full bg-violet-700 px-4 py-2 text-xs font-semibold text-white shadow-sm hover:bg-violet-800"
            >
              + Post affiliate ad
            </button>
          ) : null}
        </div>
      </div>
    </div>
  );
};

export default AffiliateHero;
