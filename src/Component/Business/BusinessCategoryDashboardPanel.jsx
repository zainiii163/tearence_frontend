import React, { useEffect, useMemo, useState } from 'react';
import { Link, useSearchParams } from 'react-router-dom';
import { useSelector } from 'react-redux';
import { motion } from 'framer-motion';
import {
  FiPlus,
  FiExternalLink,
  FiMessageSquare,
  FiTool,
  FiLock,
  FiTrendingUp,
  FiBarChart2,
} from 'react-icons/fi';
import CategoryTrendChart from '../dashboard/charts/CategoryTrendChart';
import CategoryPerformanceBars from '../dashboard/charts/CategoryPerformanceBars';
import CategoryRecentListings from '../dashboard/charts/CategoryRecentListings';
import {
  categoryFromDemoEmail,
  getDashboardCategory,
  resolveBusinessDashboardCategory,
} from './businessCategoryDashboardConfig';
import businessService from '../../services/BusinessService';
import { resolveStorageUrl } from '../../utils/dashboardEditMappers';

const formatStat = (value) => {
  if (value === null || value === undefined || value === '') return '—';
  if (typeof value === 'number' && Number.isFinite(value)) {
    return value.toLocaleString();
  }
  return String(value);
};

const fadeUp = {
  initial: { opacity: 0, y: 12 },
  animate: { opacity: 1, y: 0 },
  transition: { duration: 0.35, ease: 'easeOut' },
};

/**
 * Category workspace body for the main Dashboard tab.
 * Team / Affiliates live as separate sidebar routes — not embedded here.
 */
const BusinessCategoryDashboardPanel = ({ embedded = true }) => {
  const [searchParams, setSearchParams] = useSearchParams();
  const { userDetail } = useSelector((store) => store.auth);
  const [businessProfile, setBusinessProfile] = useState(null);
  const [statValues, setStatValues] = useState({});
  const [trends, setTrends] = useState([]);
  const [performance, setPerformance] = useState([]);
  const [recentListings, setRecentListings] = useState([]);
  const [affiliateSummary, setAffiliateSummary] = useState(null);
  const [statsLoading, setStatsLoading] = useState(true);

  const lockedId = useMemo(() => {
    const fromEmail = categoryFromDemoEmail(userDetail?.email);
    if (fromEmail) return fromEmail;

    let draft = null;
    try {
      draft = JSON.parse(localStorage.getItem('wwa_business_profile_draft') || 'null');
    } catch {
      draft = null;
    }

    return (
      resolveBusinessDashboardCategory({
        dashboard_category:
          userDetail?.dashboard_category ||
          businessProfile?.dashboard_category ||
          businessProfile?.business_category_slug ||
          draft?.dashboard_category ||
          draft?.business_category_slug,
        business_category_slug:
          userDetail?.business_category_slug ||
          businessProfile?.business_category_slug ||
          draft?.business_category_slug,
        business_category:
          userDetail?.business_category ||
          businessProfile?.business_category ||
          draft?.business_category,
      }) || 'business'
    );
  }, [userDetail, businessProfile]);

  const category = getDashboardCategory(lockedId);
  const logoUrl = resolveStorageUrl(
    businessProfile?.business_logo || businessProfile?.logo || userDetail?.business_logo
  );

  useEffect(() => {
    let cancelled = false;
    (async () => {
      try {
        const data = await businessService.getMyBusiness();
        const biz = data?.data || data;
        if (!cancelled && biz) setBusinessProfile(biz);
      } catch {
        /* optional */
      }
    })();
    return () => {
      cancelled = true;
    };
  }, []);

  useEffect(() => {
    if (!lockedId) return;
    if (searchParams.get('category') === lockedId && searchParams.get('tab') !== 'category-dash') {
      return;
    }
    const next = new URLSearchParams(searchParams);
    // Legacy My category tab redirects into main dashboard
    if (next.get('tab') === 'category-dash') {
      next.set('tab', 'overview');
    }
    next.set('mode', 'selling');
    next.set('category', lockedId);
    setSearchParams(next, { replace: true });
  }, [lockedId, searchParams, setSearchParams]);

  useEffect(() => {
    if (!category?.id) return undefined;
    let cancelled = false;
    (async () => {
      setStatsLoading(true);
      try {
        const res = await businessService.getDashboardStats(category.id);
        const payload = res?.data || res;
        if (!cancelled) {
          setStatValues(payload?.stats || {});
          setTrends(payload?.trends || []);
          setPerformance(payload?.performance || []);
          setRecentListings(payload?.recent_listings || []);
          setAffiliateSummary(payload?.affiliate_summary || null);
        }
      } catch {
        if (!cancelled) {
          setStatValues({});
          setTrends([]);
          setPerformance([]);
          setRecentListings([]);
        }
      } finally {
        if (!cancelled) setStatsLoading(false);
      }
    })();
    return () => {
      cancelled = true;
    };
  }, [category?.id]);

  if (!category) {
    return (
      <div className="rounded-xl border border-amber-200 bg-amber-50 p-6 text-sm text-amber-900">
        No category is set on this business account yet. Complete signup category selection.
      </div>
    );
  }

  const Icon = category.icon;

  return (
    <motion.div className="space-y-6" initial="initial" animate="animate">
      <motion.div
        {...fadeUp}
        className="overflow-hidden rounded-2xl border border-slate-200/80 bg-white shadow-sm"
      >
        <div className={`relative bg-gradient-to-br ${category.color} px-6 py-6 text-white`}>
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_right,rgba(255,255,255,0.18),transparent_55%)]" />
          <div className="relative flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
            <div className="flex items-center gap-4 min-w-0">
              {logoUrl ? (
                <img
                  src={logoUrl}
                  alt=""
                  className="h-14 w-14 rounded-xl border-2 border-white/30 object-cover bg-white/10 shrink-0"
                />
              ) : (
                <div className="flex h-14 w-14 items-center justify-center rounded-xl bg-white/20 shrink-0">
                  <Icon className="h-7 w-7" />
                </div>
              )}
              <div className="min-w-0">
                <p className="text-[10px] font-bold uppercase tracking-widest text-white/75">
                  {category.emoji} Business dashboard
                </p>
                <h1 className="text-2xl font-bold truncate">{category.name}</h1>
                <p className="mt-1 text-sm text-white/90 line-clamp-2 max-w-xl">{category.description}</p>
              </div>
            </div>
            <div className="flex flex-wrap gap-2 shrink-0">
              <Link
                to={category.postPath}
                className="inline-flex items-center gap-2 rounded-xl bg-white px-4 py-2.5 text-sm font-bold text-slate-900 shadow-sm hover:bg-white/95 transition"
              >
                <FiPlus className="h-4 w-4" /> Post to {category.name}
              </Link>
              <Link
                to="/dashboard?tab=affiliates&mode=selling"
                className="inline-flex items-center gap-2 rounded-xl bg-violet-900/40 border border-white/25 px-4 py-2.5 text-sm font-bold text-white hover:bg-violet-900/55 transition"
              >
                <FiPlus className="h-4 w-4" /> Post to Affiliates
              </Link>
            </div>
          </div>
        </div>

        <div className="flex flex-wrap items-center gap-x-4 gap-y-2 border-t border-slate-100 bg-slate-50/80 px-5 py-3 text-xs text-slate-600">
          <span className="inline-flex items-center gap-1.5 font-medium">
            <FiLock className="h-3.5 w-3.5 text-slate-400" />
            Your signup category:{' '}
            <strong className="text-slate-800">
              {category.emoji} {category.name}
            </strong>
          </span>
        </div>
      </motion.div>

      <motion.div {...fadeUp} transition={{ ...fadeUp.transition, delay: 0.05 }} className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        {category.stats.map((stat) => (
          <div
            key={stat.key}
            className="rounded-xl border border-slate-200 bg-white p-5 shadow-sm hover:shadow-md transition-all duration-300"
          >
            <p className="text-xs font-semibold uppercase tracking-wide text-slate-500">{stat.label}</p>
            <p className="mt-2 text-3xl font-bold tabular-nums text-slate-900">
              {statsLoading ? (
                <span className="inline-block h-8 w-16 animate-pulse rounded bg-slate-100" />
              ) : (
                formatStat(statValues[stat.key])
              )}
            </p>
            <p className="mt-1 text-xs text-slate-500">{stat.hint}</p>
          </div>
        ))}
      </motion.div>

      <motion.div
        {...fadeUp}
        transition={{ ...fadeUp.transition, delay: 0.1 }}
        className="grid grid-cols-1 xl:grid-cols-5 gap-4"
      >
        <div className="xl:col-span-3 rounded-xl border border-slate-200 bg-white p-5 shadow-sm">
          <div className="mb-4 flex items-center justify-between gap-2">
            <div className="flex items-center gap-2">
              <FiTrendingUp className="h-4 w-4 text-indigo-600" />
              <h3 className="font-semibold text-slate-900">Listing activity (7 days)</h3>
            </div>
            <span className="text-xs text-slate-500">Live account data</span>
          </div>
          <CategoryTrendChart data={trends} loading={statsLoading} accent="#6366f1" />
        </div>
        <div className="xl:col-span-2 rounded-xl border border-slate-200 bg-white p-5 shadow-sm">
          <div className="mb-4 flex items-center gap-2">
            <FiBarChart2 className="h-4 w-4 text-violet-600" />
            <h3 className="font-semibold text-slate-900">Performance</h3>
          </div>
          <CategoryPerformanceBars items={performance} loading={statsLoading} />
        </div>
      </motion.div>

      {affiliateSummary && (
        <motion.div
          {...fadeUp}
          transition={{ ...fadeUp.transition, delay: 0.12 }}
          className="grid grid-cols-1 sm:grid-cols-3 gap-3"
        >
          {[
            { label: 'Affiliate offers', value: affiliateSummary.offers, href: '/dashboard?tab=affiliates&mode=selling' },
            { label: 'Pending applicants', value: affiliateSummary.pending_applicants, href: '/dashboard?tab=affiliates&mode=selling' },
            { label: 'Sales via promoters', value: affiliateSummary.sales_count, href: '/dashboard?tab=affiliates&sub=money' },
            {
              label: 'Commissions owed',
              value:
                affiliateSummary.commissions_owed_to_promoters != null
                  ? `$${Number(affiliateSummary.commissions_owed_to_promoters).toFixed(2)}`
                  : '—',
              href: '/dashboard?tab=affiliates&sub=money',
            },
            { label: 'Adverts & expiry', value: 'View', href: '/dashboard?tab=affiliates&sub=adverts' },
            { label: 'Total applications', value: affiliateSummary.total_applications, href: '/dashboard?tab=affiliates&mode=selling' },
          ].map((item) => (
            <Link
              key={item.label}
              to={item.href}
              className="rounded-xl border border-violet-100 bg-violet-50/50 px-4 py-3 hover:border-violet-200 transition"
            >
              <p className="text-xs font-medium text-violet-800">{item.label}</p>
              <p className="text-2xl font-bold text-violet-950 tabular-nums">
                {statsLoading ? '…' : (item.value ?? 0).toLocaleString()}
              </p>
            </Link>
          ))}
        </motion.div>
      )}

      <motion.div {...fadeUp} transition={{ ...fadeUp.transition, delay: 0.15 }} className="rounded-xl border border-slate-200 bg-white p-5 shadow-sm">
        <div className="mb-4 flex flex-wrap items-center justify-between gap-2">
          <h3 className="font-semibold text-slate-900">Recent {category.name} listings</h3>
          <Link
            to={category.browsePath}
            className="text-sm font-semibold text-indigo-700 hover:underline inline-flex items-center gap-1"
          >
            View public category <FiExternalLink className="h-3.5 w-3.5" />
          </Link>
        </div>
        <CategoryRecentListings listings={recentListings} loading={statsLoading} postPath={category.postPath} />
      </motion.div>

      <motion.div {...fadeUp} transition={{ ...fadeUp.transition, delay: 0.18 }} className="rounded-xl border border-slate-200 bg-white p-5 shadow-sm">
        <h3 className="font-semibold text-slate-900 mb-3">Quick actions</h3>
        <div className="flex flex-wrap gap-2">
          <Link
            to={category.postPath}
            className={`inline-flex items-center gap-2 rounded-lg px-4 py-2 text-sm font-semibold text-white ${category.accentButton}`}
          >
            <FiPlus className="h-4 w-4" /> Post to {category.name}
          </Link>
          <Link
            to="/dashboard?tab=affiliates&mode=selling"
            className="inline-flex items-center gap-2 rounded-lg bg-violet-700 px-4 py-2 text-sm font-semibold text-white hover:bg-violet-800"
          >
            <FiPlus className="h-4 w-4" /> Affiliates
          </Link>
          <Link
            to="/dashboard?tab=team&mode=selling"
            className="inline-flex items-center gap-2 rounded-lg border border-slate-300 px-4 py-2 text-sm font-semibold text-slate-800 hover:bg-slate-50"
          >
            Invite team
          </Link>
          <Link
            to="/messages"
            className="inline-flex items-center gap-2 rounded-lg border border-sky-200 bg-sky-50 px-4 py-2 text-sm font-semibold text-sky-900 hover:bg-sky-100"
          >
            <FiMessageSquare className="h-4 w-4" /> Messages
          </Link>
          <Link
            to={`/business/tools?category=${category.id}`}
            className="inline-flex items-center gap-2 rounded-lg border border-emerald-200 bg-emerald-50 px-4 py-2 text-sm font-semibold text-emerald-900 hover:bg-emerald-100"
          >
            <FiTool className="h-4 w-4" /> Business tools
          </Link>
        </div>
      </motion.div>

      {embedded && (
        <p className="text-xs text-slate-500 text-center pb-2">
          Use sidebar → Team to invite staff · Affiliates to approve promoters.
        </p>
      )}
    </motion.div>
  );
};

export default BusinessCategoryDashboardPanel;
