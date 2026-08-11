import React, { useEffect, useMemo, useState } from 'react';
import { Link, useParams } from 'react-router-dom';
import { useSelector } from 'react-redux';
import {
  FiChevronLeft,
  FiPlus,
  FiExternalLink,
  FiUsers,
  FiMessageSquare,
  FiTool,
  FiCheckCircle,
  FiList,
} from 'react-icons/fi';
import UnifiedNavbar from '../UnifiedNavbar';
import Footer from '../Footer';
import AffiliateManagement from '../dashboard/AffiliateManagement';
import BusinessMembersManager from '../BusinessMembersManager';
import { getDashboardCategory } from './businessCategoryDashboardConfig';
import businessService from '../../services/BusinessService';

const formatStat = (value) => {
  if (value === null || value === undefined || value === '') return '—';
  if (typeof value === 'number' && Number.isFinite(value)) {
    return value.toLocaleString();
  }
  return String(value);
};

const BusinessCategoryDashboard = () => {
  const { categoryId } = useParams();
  const category = getDashboardCategory(categoryId);
  const { userDetail, customerId } = useSelector((store) => store.auth);
  const [businessId, setBusinessId] = useState(null);
  const [showAffiliates, setShowAffiliates] = useState(true);
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
        /* optional until store created */
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

  const ownerName = useMemo(() => {
    const first = userDetail?.first_name || '';
    const last = userDetail?.last_name || '';
    return `${first} ${last}`.trim() || userDetail?.business_name || 'Your business';
  }, [userDetail]);

  if (!category) {
    return (
      <div className="min-h-screen bg-slate-50 flex items-center justify-center">
        <div className="text-center px-4">
          <h1 className="text-xl font-bold text-slate-900 mb-2">Category not found</h1>
          <Link to="/my-business/dashboard?all=1" className="text-indigo-700 font-semibold underline">
            Back to dashboards
          </Link>
        </div>
      </div>
    );
  }

  const Icon = category.icon;

  return (
    <div className={`min-h-screen ${category.bgColor || 'bg-slate-50'}`}>
      <UnifiedNavbar />
      <div className="page-container py-8 sm:py-10">
        <Link
          to="/my-business/dashboard?all=1"
          className={`inline-flex items-center gap-1 text-sm font-semibold mb-4 ${category.accentText}`}
        >
          <FiChevronLeft className="h-4 w-4" /> All category dashboards
        </Link>

        <div className={`rounded-2xl bg-gradient-to-r ${category.color} p-6 sm:p-8 text-white mb-8`}>
          <div className="flex items-start gap-4">
            <div className="w-14 h-14 rounded-2xl bg-white/20 flex items-center justify-center shrink-0">
              <Icon className="h-7 w-7" />
            </div>
            <div className="min-w-0">
              <p className="text-xs uppercase tracking-wide text-white/80 font-semibold">
                {category.emoji} Business dashboard
              </p>
              <h1 className="text-2xl sm:text-3xl font-extrabold">{category.name}</h1>
              <p className="text-sm text-white/90 mt-2 max-w-2xl">{category.description}</p>
              <p className="text-xs text-white/75 mt-2">Signed in as {ownerName}</p>
            </div>
          </div>
        </div>

        {/* Category-specific focus */}
        {(category.highlights || []).length > 0 && (
          <section className={`mb-6 rounded-2xl border ${category.borderColor || 'border-slate-200'} bg-white p-5`}>
            <h2 className="text-sm font-bold uppercase tracking-wide text-slate-500 mb-3 flex items-center gap-2">
              <FiList className="h-4 w-4" /> What this {category.name} dashboard is for
            </h2>
            <ul className="grid grid-cols-1 sm:grid-cols-3 gap-2">
              {category.highlights.map((h) => (
                <li
                  key={h}
                  className={`rounded-xl px-3 py-2 text-sm font-medium text-slate-800 ${category.bgColor || 'bg-slate-50'}`}
                >
                  {h}
                </li>
              ))}
            </ul>
          </section>
        )}

        {/* Category-specific stats */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
          {category.stats.map((stat) => (
            <div
              key={stat.key}
              className={`bg-white rounded-xl border ${category.borderColor || 'border-slate-200'} p-5`}
            >
              <p className="text-xs text-slate-500 uppercase font-semibold">{stat.label}</p>
              <p className="text-2xl font-extrabold text-slate-900 mt-1">
                {statsLoading ? '…' : formatStat(statValues[stat.key])}
              </p>
              <p className="text-xs text-slate-500 mt-1">{stat.hint}</p>
            </div>
          ))}
        </div>

        {/* Post to category + affiliates */}
        <section className="bg-white rounded-2xl border border-slate-200 p-6 mb-6">
          <h2 className="text-lg font-bold text-slate-900 mb-1">Post from this dashboard</h2>
          <p className="text-sm text-slate-600 mb-4">
            List in the {category.name} marketplace, or post products/services you want influencers to
            promote on Affiliates.
          </p>
          <div className="flex flex-col sm:flex-row flex-wrap gap-3">
            <Link
              to={category.postPath}
              className={`inline-flex items-center justify-center gap-2 px-5 py-3 rounded-xl text-white font-semibold text-sm ${category.accentButton}`}
            >
              <FiPlus className="h-4 w-4" /> Post to {category.name}
            </Link>
            <button
              type="button"
              onClick={() => {
                setShowAffiliates(true);
                setOpenCreateAffiliate(true);
              }}
              className="inline-flex items-center justify-center gap-2 px-5 py-3 rounded-xl bg-violet-700 text-white font-semibold text-sm hover:bg-violet-800"
            >
              <FiPlus className="h-4 w-4" /> Post product/service to Affiliates
            </button>
            <Link
              to={category.browsePath}
              className="inline-flex items-center justify-center gap-2 px-5 py-3 rounded-xl border border-slate-300 text-slate-800 font-semibold text-sm hover:bg-slate-50"
            >
              <FiExternalLink className="h-4 w-4" /> View public category
            </Link>
            <Link
              to="/messages"
              className="inline-flex items-center justify-center gap-2 px-5 py-3 rounded-xl border border-sky-300 text-sky-900 font-semibold text-sm hover:bg-sky-50"
            >
              <FiMessageSquare className="h-4 w-4" /> Messages
            </Link>
          </div>
        </section>

        {/* Affiliates manage / approve */}
        <section className="bg-white rounded-2xl border border-violet-200 p-6 mb-6">
          <div className="flex flex-wrap items-center justify-between gap-3 mb-3">
            <div>
              <h2 className="text-lg font-bold text-slate-900 flex items-center gap-2">
                <FiCheckCircle className="text-violet-700" /> Affiliates — promote &amp; approve
              </h2>
              <p className="text-sm text-slate-600 mt-1">
                Influencers apply with socials, blogs or websites. Approve them here to issue a hop link.
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
            <div className="border-t border-violet-100 pt-4">
              <AffiliateManagement
                openCreateOnMount={openCreateAffiliate}
                onCreateOpened={() => setOpenCreateAffiliate(false)}
              />
            </div>
          )}
          {!showAffiliates && (
            <Link
              to="/dashboard?tab=affiliates"
              className="text-sm font-semibold text-violet-700 hover:underline"
            >
              Or open full Affiliates management →
            </Link>
          )}
        </section>

        {/* Tools */}
        <section className="bg-white rounded-2xl border border-emerald-200 p-6 mb-6">
          <h2 className="text-lg font-bold text-slate-900 flex items-center gap-2 mb-2">
            <FiTool className="text-emerald-700" /> {category.name} tools
          </h2>
          <p className="text-sm text-slate-600 mb-3">
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
          <div className="flex flex-wrap gap-3">
            <Link
              to={`/business/tools?category=${category.id}`}
              className="inline-flex items-center rounded-lg bg-emerald-700 px-4 py-2 text-sm font-semibold text-white hover:bg-emerald-800"
            >
              Browse business tools
            </Link>
            <Link
              to="/business/templates"
              className="inline-flex items-center rounded-lg border border-slate-300 px-4 py-2 text-sm font-semibold text-slate-800 hover:bg-slate-50"
            >
              Templates
            </Link>
          </div>
        </section>

        {/* Team / roles */}
        <section className="bg-white rounded-2xl border border-slate-200 p-6 mb-6">
          <h2 className="text-lg font-bold text-slate-900 flex items-center gap-2 mb-1">
            <FiUsers /> Team &amp; roles
          </h2>
          <p className="text-sm text-slate-600 mb-4">
            Invite staff to manage this business page (admin, manager, editor, viewer). Unregistered
            teammates get an email invite.
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
              <div className="mt-2">
                <Link to="/my-business" className="font-semibold text-amber-950 underline">
                  Go to business store →
                </Link>
              </div>
            </div>
          )}
        </section>

        {customerId && (
          <p className="text-xs text-slate-500">
            Public visitors can message your business pages via the Message / Live Chat button.
          </p>
        )}
      </div>
      <Footer />
    </div>
  );
};

export default BusinessCategoryDashboard;
