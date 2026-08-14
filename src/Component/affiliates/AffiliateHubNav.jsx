import React from 'react';
import { Link, useLocation } from 'react-router-dom';

/**
 * Clive’s 3-part Affiliates architecture:
 * 1. Affiliate Ads (landing /affiliates) — promoted link content
 * 2. Marketplace (/affiliates/marketplace) — businesses to promote
 * 3. Courses (/affiliates/courses) — starter guides for sale
 */
export const AFFILIATE_HUBS = [
  { id: 'ads', label: 'Affiliate Ads', to: '/affiliates', match: (p) => p === '/affiliates' || p === '/affiliate' || p === '/affiliates/links' },
  { id: 'marketplace', label: 'Marketplace', to: '/affiliates/marketplace', match: (p) => p.includes('/marketplace') || p.includes('affiliate-marketplace') },
  { id: 'courses', label: 'Courses', to: '/affiliates/courses', match: (p) => p.includes('/courses') },
];

const AffiliateHubNav = ({ variant = 'light', className = '' }) => {
  const { pathname } = useLocation();
  const isDark = variant === 'dark';

  return (
    <div
      className={`inline-flex flex-wrap justify-center rounded-full p-1 ${
        isDark
          ? 'border border-white/25 bg-white/10 backdrop-blur'
          : 'border border-violet-200 bg-white/95 shadow-sm backdrop-blur'
      } ${className}`}
      role="navigation"
      aria-label="Affiliate sections"
    >
      {AFFILIATE_HUBS.map((hub) => {
        const active = hub.match(pathname);
        return (
          <Link
            key={hub.id}
            to={hub.to}
            className={`rounded-full px-3.5 sm:px-4 py-1.5 text-xs font-semibold transition ${
              active
                ? isDark
                  ? 'bg-white text-primary shadow-sm'
                  : 'bg-violet-700 text-white'
                : isDark
                  ? 'text-white hover:bg-white/10'
                  : 'text-violet-800 hover:bg-violet-50'
            }`}
          >
            {hub.label}
          </Link>
        );
      })}
    </div>
  );
};

export default AffiliateHubNav;
