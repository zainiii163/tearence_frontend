import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { FaStore, FaLink, FaBullhorn, FaDollarSign, FaChevronRight } from 'react-icons/fa';

const STEPS = [
  {
    id: 'join',
    n: 1,
    icon: FaStore,
    label: 'Join',
    title: 'Join a Marketplace offer and get your hop',
    to: '/affiliates/marketplace',
    match: (path) => path.includes('/affiliates/marketplace') || path.includes('/affiliates/offer'),
  },
  {
    id: 'hop',
    n: 2,
    icon: FaLink,
    label: 'Hop',
    title: 'Copy your unique /go/aff/… tracking link',
    to: '/dashboard?tab=affiliates&sub=promoting',
    match: (path, search) =>
      path.includes('/dashboard') && (search.includes('promoting') || search.includes('affiliates')),
  },
  {
    id: 'post',
    n: 3,
    icon: FaBullhorn,
    label: 'Post',
    title: 'Share the hop on Affiliate Ads, social, or email',
    to: '/affiliates',
    match: (path) => path === '/affiliates' || path === '/affiliates/',
  },
  {
    id: 'earn',
    n: 4,
    icon: FaDollarSign,
    label: 'Earn',
    title: 'Get paid if they buy in the cookie window',
    to: '/dashboard?tab=affiliates&sub=earnings',
    match: (path, search) =>
      path.includes('/dashboard') && search.includes('earnings'),
  },
];

/**
 * Compact one-row affiliate path. Replaces the bulky how-it-works cards.
 */
const AffiliateFlowStrip = ({ className = '' }) => {
  const location = useLocation();
  const path = location.pathname || '';
  const search = location.search || '';

  return (
    <nav
      aria-label="Affiliate steps"
      className={`mb-3 ${className}`}
    >
      <ol className="flex items-stretch overflow-x-auto no-scrollbar rounded-full border border-slate-200/80 bg-white shadow-sm px-1.5 py-1 sm:px-2 sm:justify-center">
        {STEPS.map(({ id, n, icon: Icon, label, title, to, match }, i) => {
          const active = match(path, search);
          return (
            <li key={id} className="flex items-center shrink-0">
              {i > 0 && (
                <FaChevronRight
                  className="mx-0.5 sm:mx-1 h-2.5 w-2.5 text-slate-300"
                  aria-hidden
                />
              )}
              <Link
                to={to}
                title={title}
                className={`inline-flex items-center gap-1.5 rounded-full px-2.5 py-1 text-[11px] font-semibold transition-colors ${
                  active
                    ? 'bg-primary text-white shadow-sm'
                    : 'text-slate-600 hover:bg-slate-50 hover:text-slate-900'
                }`}
              >
                <span
                  className={`flex h-4 w-4 items-center justify-center rounded-full text-[9px] font-bold ${
                    active ? 'bg-white/20 text-white' : 'bg-slate-100 text-slate-500'
                  }`}
                >
                  {n}
                </span>
                <Icon className="h-2.5 w-2.5 hidden sm:block" />
                {label}
              </Link>
            </li>
          );
        })}
      </ol>
    </nav>
  );
};

export default AffiliateFlowStrip;
