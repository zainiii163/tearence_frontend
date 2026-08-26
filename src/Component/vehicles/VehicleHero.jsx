import React from 'react';
import BrowseMarketplaceHero from '../shared/BrowseMarketplaceHero';
import { getCategoryTheme } from '../../constants/categoryThemes';

const HERO_BG =
  'https://images.unsplash.com/photo-1492144534655-ae79c964c9d7?auto=format&fit=crop&w=1920&q=80';

/**
 * Clive: vehicle platform messaging + trust indicators.
 */
const VehicleHero = (props) => (
  <div>
    <BrowseMarketplaceHero
      title="Your Vehicle. Your Business. One Platform."
      titlePrefix=""
      eyebrow="Vehicles"
      subtitle="Manage adverts, leads and bookings. Track post performance and visibility. Secure access with protected sessions."
      imageUrl={HERO_BG}
      theme={getCategoryTheme('vehicles').heroTheme}
      searchPlaceholder="Search by make, model or vehicle name…"
      templatesHref="/vehicles/templates"
      calculatorsHref="/vehicles/calculators"
      templatesLabel="Templates"
      {...props}
    />
    <div className="bg-slate-900 text-white">
      <div className="page-container max-w-7xl mx-auto px-4 py-3 flex flex-wrap items-center justify-center gap-x-8 gap-y-2 text-xs sm:text-sm font-semibold tracking-wide">
        <span className="text-emerald-300">Verified Providers</span>
        <span className="text-slate-500">·</span>
        <span className="text-sky-300">Secure Payments</span>
        <span className="text-slate-500">·</span>
        <span className="text-amber-200">24/7 Support</span>
      </div>
    </div>
  </div>
);

export default VehicleHero;
