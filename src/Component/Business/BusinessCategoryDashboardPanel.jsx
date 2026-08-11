import React, { useEffect, useMemo, useState } from 'react';
import { Link, useSearchParams } from 'react-router-dom';
import { useSelector } from 'react-redux';
import {
  FiPlus,
  FiExternalLink,
  FiUsers,
  FiMessageSquare,
  FiTool,
  FiCheckCircle,
  FiList,
} from 'react-icons/fi';
import AffiliateManagement from '../dashboard/AffiliateManagement';
import BusinessMembersManager from '../BusinessMembersManager';
import {
  BUSINESS_DASHBOARD_CATEGORIES,
  getDashboardCategory,
  resolveBusinessDashboardCategory,
} from './businessCategoryDashboardConfig';
import businessService from '../../services/BusinessService';

const formatStat = (value) => {
  if (value === null || value === undefined || value === '') return '—';
  if (typeof value === 'number' && Number.isFinite(value)) {
    return value.toLocaleString();
  }
  return String(value);
};

/**
 * Category business dashboard body — lives INSIDE UserDashboard sidebar shell.
 * No UnifiedNavbar / Footer / full-page mint chrome.
 */
const BusinessCategoryDashboardPanel = ({
  categoryId: categoryIdProp = null,
  embedded = true,
}) => {
  const [searchParams, setSearchParams] = useSearchParams();
  const { userDetail, customerId } = useSelector((store) => store.auth);

  const draftHint = useMemo(() => {
    try {
      return JSON.parse(localStorage.getItem('wwa_business_profile_draft') || 'null');
    } catch {
      return null;
    }
  }, []);

  const resolvedId = useMemo(() => {
    const fromProp = categoryIdProp || searchParams.get('category');
    if (fromProp && getDashboardCategory(fromProp)) return fromProp;
    return (
      resolveBusinessDashboardCategory({
        ...draftHint,
        business_category: userDetail?.business_category || draftHint?.business_category,
        business_category_slug:
          userDetail?.business_category_slug || draftHint?.business_category_slug,
      }) || 'business'
    );
  }, [categoryIdProp, searchParams, draftHint, userDetail]);

  const category = getDashboardCategory(resolvedId);
  const [businessId, setBusinessId] = useState(null);
  const [showAffiliates, setShowAffiliates] = useState(false);
  const [openCreateAffiliate, setOpenCreateAffiliate] = useState(false);
  const [statValues, setStatValues] = useState({});
  const [statsLoading, setStatsLoading] = useState(true);

  useEffect(() => {
    let cancelled = false;
    (async () => {
      try {
        const data = await businessService.getMyBusiness();
        const biz = data?.data || data;
        const id = biz?.id || biz?.business_id;
        if (!cancelled && id) setBusinessId(id);
      } catch {
        /* optional */
      }
    })();
    return () => {
      cancelled = true;
    };
  }, []);

  useEffect(() => {
    if (!category?.id) return undefined;
    let cancelled = false;
    (async () => {
      setStatsLoading(true);
      try {
        const res = await businessService.getDashboardStats(category.id);
        const stats = res?.data?.stats || res?.stats || {};
        if (!cancelled) setStatValues(stats);
      } catch {
        if (!cancelled) setStatValues({});
      } finally {
        if (!cancelled) setStatsLoading(false);
      }
    })();
    return () => {
      cancelled = true;
    };
  }, [category?.id]);

  const selectCategory = (id) => {
    const next = new URLSearchParams(searchParams);
    next.set('tab', 'category-dash');
    next.set('mode', 'selling');
    next.set('category', id);
    setSearchParams(next);
  };

  if (!category) {
    return (
      <div className="rounded-lg border border-amber-200 bg-amber-50 p-6 text-sm text-amber-900">
        Category not found. Pick one below.
      </div>
    );
  }

  const Icon = category.icon;

  return (
    <div className="space-y-6">
      {/* Category switcher — proper dashboard control */}
      <div className="bg-white rounded-lg shadow p-4">
        <p className="text-xs font-semibold uppercase tracking-wide text-gray-500 mb-3">
          Your category dashboard
        </p>
        <div className="flex flex-wrap gap-2">
          {BUSINESS_DASHBOARD_CATEGORIES.map((c) => {
            const active = c.id === category.id;
            return (
              <button
                key={c.id}
                type="button"
                onClick={() => selectCategory(c.id)}
                className={`inline-flex items-center gap-1.5 rounded-lg px-3 py-1.5 text-xs font-semibold border transition ${
                  active
                    ? 'bg-gray-900 text-white border-gray-900'
                    : 'bg-white text-gray-700 border-gray-200 hover:border-gray-400'
                }`}
              >
                <span>{c.emoji}</span>
                {c.name}
              </button>
            );
          })}
        </div>
      </div>

      {/* Compact header (dashboard card, not full-bleed landing) */}
      <div className="bg-white rounded-lg shadow overflow-hidden">
        <div className={`bg-gradient-to-r ${category.color} px-5 py-4 text-white`}>
          <div className="flex items-center gap-3">
            <div className="w-11 h-11 rounded-lg bg-white/20 flex items-center justify-center shrink-0">
              <Icon className="h-5 w-5" />
            </div>
            <div className="min-w-0">
              <p className="text-[10px] uppercase tracking-wide text-white/80 font-semibold">
                {category.emoji} Category workspace
              </p>
              <h2 className="text-xl font-bold truncate">{category.name}</h2>
              <p className="text-xs text-white/90 mt-0.5 line-clamp-2">{category.description}</p>
            </div>
          </div>
        </div>

        {(category.highlights || []).length > 0 && (
          <div className="px-5 py-3 border-b border-gray-100 bg-gray-50">
            <p className="text-[10px] font-bold uppercase tracking-wide text-gray-500 mb-2 flex items-center gap-1">
              <FiList className="h-3 w-3" /> Focus
            </p>
            <ul className="flex flex-wrap gap-2">
              {category.highlights.map((h) => (
                <li
                  key={h}
                  className="rounded-md bg-white border border-gray-200 px-2.5 py-1 text-xs text-gray-700"
                >
                  {h}
                </li>
              ))}
            </ul>
          </div>
        )}
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {category.stats.map((stat) => (
          <div key={stat.key} className="bg-white rounded-lg shadow p-5">
            <p className="text-sm font-medium text-gray-600">{stat.label}</p>
            <p className="text-2xl font-semibold text-gray-900 mt-1">
              {statsLoading ? '…' : formatStat(statValues[stat.key])}
            </p>
            <p className="text-xs text-gray-500 mt-1">{stat.hint}</p>
          </div>
        ))}
      </div>

      {/* Actions */}
      <div className="bg-white rounded-lg shadow p-5">
        <h3 className="text-base font-semibold text-gray-900 mb-1">Post from this dashboard</h3>
        <p className="text-sm text-gray-600 mb-4">
          List in {category.name}, or post products/services for Affiliates to promote.
        </p>
        <div className="flex flex-col sm:flex-row flex-wrap gap-2">
          <Link
            to={category.postPath}
            className={`inline-flex items-center justify-center gap-2 px-4 py-2 rounded-lg text-white text-sm font-semibold ${category.accentButton}`}
          >
            <FiPlus className="h-4 w-4" /> Post to {category.name}
          </Link>
          <button
            type="button"
            onClick={() => {
              setShowAffiliates(true);
              setOpenCreateAffiliate(true);
            }}
            className="inline-flex items-center justify-center gap-2 px-4 py-2 rounded-lg bg-violet-700 text-white text-sm font-semibold hover:bg-violet-800"
          >
            <FiPlus className="h-4 w-4" /> Post to Affiliates
          </button>
          <Link
            to={category.browsePath}
            className="inline-flex items-center justify-center gap-2 px-4 py-2 rounded-lg border border-gray-300 text-gray-800 text-sm font-semibold hover:bg-gray-50"
          >
            <FiExternalLink className="h-4 w-4" /> View public category
          </Link>
          <Link
            to="/messages"
            className="inline-flex items-center justify-center gap-2 px-4 py-2 rounded-lg border border-sky-300 text-sky-900 text-sm font-semibold hover:bg-sky-50"
          >
            <FiMessageSquare className="h-4 w-4" /> Messages
          </Link>
          <Link
            to="/dashboard?tab=affiliates&mode=selling"
            className="inline-flex items-center justify-center gap-2 px-4 py-2 rounded-lg border border-violet-300 text-violet-900 text-sm font-semibold hover:bg-violet-50"
          >
            Affiliates tab
          </Link>
        </div>
      </div>

      {/* Affiliates */}
      <div className="bg-white rounded-lg shadow p-5">
        <div className="flex flex-wrap items-center justify-between gap-3 mb-3">
          <div>
            <h3 className="text-base font-semibold text-gray-900 flex items-center gap-2">
              <FiCheckCircle className="text-violet-700" /> Affiliates — promote &amp; approve
            </h3>
            <p className="text-sm text-gray-600 mt-1">
              Influencers apply with socials / blogs / websites. Approve to mint hop links.
            </p>
          </div>
          <button
            type="button"
            onClick={() => setShowAffiliates((v) => !v)}
            className="text-sm font-semibold text-violet-800 underline"
          >
            {showAffiliates ? 'Hide panel' : 'Open affiliate panel'}
          </button>
        </div>
        {showAffiliates && (
          <div className="border-t border-gray-100 pt-4">
            <AffiliateManagement
              openCreateOnMount={openCreateAffiliate}
              onCreateOpened={() => setOpenCreateAffiliate(false)}
            />
          </div>
        )}
      </div>

      {/* Tools */}
      <div className="bg-white rounded-lg shadow p-5">
        <h3 className="text-base font-semibold text-gray-900 flex items-center gap-2 mb-2">
          <FiTool className="text-emerald-700" /> {category.name} tools
        </h3>
        <p className="text-sm text-gray-600 mb-3">
          Marketing and advertising tools for this category (plus templates).
        </p>
        <ul className="flex flex-wrap gap-2 mb-4">
          {(category.tools || []).map((t) => (
            <li
              key={t}
              className="rounded-full border border-emerald-200 bg-emerald-50 px-3 py-1 text-xs font-semibold text-emerald-900"
            >
              {t}
            </li>
          ))}
        </ul>
        <div className="flex flex-wrap gap-2">
          <Link
            to={`/business/tools?category=${category.id}`}
            className="inline-flex items-center rounded-lg bg-emerald-700 px-4 py-2 text-sm font-semibold text-white hover:bg-emerald-800"
          >
            Browse business tools
          </Link>
          <Link
            to="/dashboard?tab=templates&mode=selling"
            className="inline-flex items-center rounded-lg border border-gray-300 px-4 py-2 text-sm font-semibold text-gray-800 hover:bg-gray-50"
          >
            Templates
          </Link>
        </div>
      </div>

      {/* Team */}
      <div className="bg-white rounded-lg shadow p-5">
        <h3 className="text-base font-semibold text-gray-900 flex items-center gap-2 mb-1">
          <FiUsers /> Team &amp; roles
        </h3>
        <p className="text-sm text-gray-600 mb-4">
          Invite staff to manage this business page (admin, manager, editor, viewer).
        </p>
        {businessId ? (
          <BusinessMembersManager businessId={businessId} isOwner />
        ) : (
          <div className="rounded-lg border border-amber-200 bg-amber-50 p-4 text-sm text-amber-900">
            Create or open your{' '}
            <Link to="/my-business" className="font-semibold underline">
              business store
            </Link>{' '}
            first, then invite team members from here.
          </div>
        )}
      </div>

      {embedded && customerId && (
        <p className="text-xs text-gray-500">
          Public visitors can message your business pages via the Message / Live Chat button.
        </p>
      )}
    </div>
  );
};

export default BusinessCategoryDashboardPanel;
