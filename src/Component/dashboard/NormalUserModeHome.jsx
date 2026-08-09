import React from 'react';
import { Link } from 'react-router-dom';
import {
  FaPlus,
  FaShoppingBag,
  FaTags,
  FaBriefcase,
  FaFileAlt,
  FaStore,
  FaSearch,
  FaClipboardList,
  FaHome,
} from 'react-icons/fa';
import { ACCOUNT_TYPE_BUSINESS } from '../../utils/accountType';

/**
 * Dashboard home — basic users browse/buy; business users post/manage.
 */
const NormalUserModeHome = ({ mode = 'buying', accountType = 'basic', onOpenTab }) => {
  const isBusiness = accountType === ACCOUNT_TYPE_BUSINESS || mode === 'selling';

  const sellerActions = [
    { label: 'Post Buy & Sell ad', tab: 'buy-sell', create: true, icon: FaTags, color: 'bg-blue-600' },
    { label: 'List a service', tab: 'services', create: true, icon: FaBriefcase, color: 'bg-teal-600' },
    { label: 'Post a property', tab: 'properties', create: true, icon: FaHome, color: 'bg-amber-700' },
    { label: 'Sell a template', tab: 'templates', create: true, icon: FaFileAlt, color: 'bg-violet-600' },
    { label: 'Manage my listings', tab: 'buy-sell', icon: FaClipboardList, color: 'bg-slate-700' },
    { label: 'My store', tab: 'store', icon: FaStore, color: 'bg-emerald-600' },
  ];

  const buyerActions = [
    { label: 'My purchases', tab: 'purchases', icon: FaShoppingBag, color: 'bg-[#1e3a5f]' },
    { label: 'Browse Buy & Sell', href: '/buy-sell', icon: FaTags, color: 'bg-blue-600' },
    { label: 'Browse services', href: '/services', icon: FaBriefcase, color: 'bg-teal-600' },
    { label: 'Browse templates', href: '/business/templates', icon: FaFileAlt, color: 'bg-violet-600' },
    { label: 'Explore marketplace', href: '/', icon: FaSearch, color: 'bg-slate-700' },
  ];

  const actions = isBusiness ? sellerActions : buyerActions;

  return (
    <div className="space-y-6 mb-8">
      <div className="bg-white rounded-2xl border border-gray-200 shadow-sm p-5 sm:p-6">
        <div>
          <p className="text-xs font-bold uppercase tracking-wide text-gray-500">
            {isBusiness ? 'Business dashboard' : 'Buyer dashboard'}
          </p>
          <h2 className="text-xl sm:text-2xl font-bold text-gray-900 mt-1">
            {isBusiness ? 'Post & manage listings' : 'Browse & purchase'}
          </h2>
          <p className="text-sm text-gray-600 mt-1 max-w-xl">
            {isBusiness
              ? 'You signed in as a business — create ads, services, templates, and manage your store.'
              : 'You signed in as a basic user — shop categories and track your purchases here.'}
          </p>
        </div>

        <div className="mt-5 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
          {actions.map((action) => {
            const Icon = action.icon;
            const className =
              'flex items-center gap-3 rounded-xl border border-gray-100 bg-gray-50 hover:bg-white hover:border-gray-200 hover:shadow-sm transition-all p-3 text-left';

            const inner = (
              <>
                <span className={`w-10 h-10 rounded-lg ${action.color} text-white flex items-center justify-center shrink-0`}>
                  <Icon className="h-4 w-4" />
                </span>
                <span className="font-semibold text-gray-900 text-sm">{action.label}</span>
                {action.create && <FaPlus className="ml-auto text-gray-400 h-3 w-3" />}
              </>
            );

            if (action.href) {
              return (
                <Link key={action.label} to={action.href} className={className}>
                  {inner}
                </Link>
              );
            }

            return (
              <button
                key={action.label}
                type="button"
                onClick={() => onOpenTab?.(action.tab, { create: Boolean(action.create) })}
                className={className}
              >
                {inner}
              </button>
            );
          })}
        </div>
      </div>
    </div>
  );
};

export default NormalUserModeHome;
