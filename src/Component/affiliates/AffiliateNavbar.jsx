import React from 'react';
import { Link } from 'react-router-dom';
import AffiliateHubNav from './AffiliateHubNav';

/**
 * Compact affiliates sub-nav used on category pages.
 */
const AffiliateNavbar = () => {
  return (
    <nav className="border-b border-slate-200 bg-white">
      <div className="page-container px-4 py-2.5 flex flex-wrap items-center justify-between gap-2">
        <div className="flex flex-wrap items-center gap-3 text-sm">
          <Link to="/affiliates" className="font-semibold text-primary">
            Affiliates
          </Link>
          <AffiliateHubNav />
        </div>
        <div className="flex flex-wrap gap-3 text-xs font-semibold">
          <Link to="/affiliates?postForm=true&mode=user" className="text-violet-700 hover:underline">
            + Post ad
          </Link>
          <Link
            to="/affiliates/marketplace?postForm=true&mode=business"
            className="text-violet-700 hover:underline"
          >
            + List on Marketplace
          </Link>
          <Link to="/dashboard?tab=affiliates" className="text-slate-600 hover:underline">
            My dashboard
          </Link>
        </div>
      </div>
    </nav>
  );
};

export default AffiliateNavbar;
