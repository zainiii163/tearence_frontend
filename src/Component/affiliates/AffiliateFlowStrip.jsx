import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { FaStore, FaLink, FaBullhorn, FaDollarSign } from 'react-icons/fa';

const STEPS = [
  {
    id: 'marketplace',
    icon: FaStore,
    title: '1. Join an offer',
    body: 'Open Marketplace, pick a product, Get hop link.',
    to: '/affiliates/marketplace',
    match: (path) => path.includes('/affiliates/marketplace') || path.includes('/affiliates/offer'),
  },
  {
    id: 'hop',
    icon: FaLink,
    title: '2. Copy your hop',
    body: 'Your unique /go/aff/… link tracks you.',
    to: '/dashboard?tab=affiliates&sub=promoting',
    match: (path, search) =>
      path.includes('/dashboard') && (search.includes('promoting') || search.includes('affiliates')),
  },
  {
    id: 'ads',
    icon: FaBullhorn,
    title: '3. Post or share',
    body: 'Paste the hop on Affiliate Ads, social, or email.',
    to: '/affiliates',
    match: (path) => path === '/affiliates' || path === '/affiliates/',
  },
  {
    id: 'earn',
    icon: FaDollarSign,
    title: '4. Earn on sales',
    body: 'If they buy in the cookie window, you get paid.',
    to: '/dashboard?tab=affiliates&sub=earnings',
    match: (path, search) =>
      path.includes('/dashboard') && search.includes('earnings'),
  },
];

/**
 * Always-visible promoter path so the three hubs stay one system.
 */
const AffiliateFlowStrip = ({ className = '' }) => {
  const location = useLocation();
  const path = location.pathname || '';
  const search = location.search || '';

  return (
    <nav
      aria-label="How affiliates work"
      className={`mb-5 rounded-xl border border-slate-200 bg-white px-3 py-3 sm:px-4 ${className}`}
    >
      <ol className="grid grid-cols-2 lg:grid-cols-4 gap-2">
        {STEPS.map(({ id, icon: Icon, title, body, to, match }) => {
          const active = match(path, search);
          return (
            <li key={id}>
              <Link
                to={to}
                className={`block h-full rounded-lg border px-3 py-2.5 transition-colors ${
                  active
                    ? 'border-primary bg-sky-50'
                    : 'border-slate-100 hover:border-slate-200 hover:bg-slate-50'
                }`}
              >
                <p className="flex items-center gap-1.5 text-[11px] font-bold text-slate-900">
                  <Icon className={`h-3 w-3 ${active ? 'text-primary' : 'text-slate-500'}`} />
                  {title}
                </p>
                <p className="mt-0.5 text-[11px] leading-snug text-slate-500">{body}</p>
              </Link>
            </li>
          );
        })}
      </ol>
    </nav>
  );
};

export default AffiliateFlowStrip;
