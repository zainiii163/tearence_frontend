import React, { useEffect, useMemo, useState } from 'react';
import { Link, Navigate, useSearchParams } from 'react-router-dom';
import { useSelector } from 'react-redux';
import {
  FiChevronRight,
  FiUsers,
  FiTool,
  FiMessageSquare,
  FiBriefcase,
} from 'react-icons/fi';
import UnifiedNavbar from '../UnifiedNavbar';
import Footer from '../Footer';
import BusinessProfileCompletion from './BusinessProfileCompletion';
import {
  BUSINESS_DASHBOARD_CATEGORIES,
  resolveBusinessDashboardCategory,
} from './businessCategoryDashboardConfig';
import { isBasicAccount, getDashboardHomePath, ACCOUNT_TYPE_BASIC } from '../../utils/accountType';

const BusinessCategoryDashboardHub = () => {
  const { userDetail } = useSelector((store) => store.auth);
  const [searchParams, setSearchParams] = useSearchParams();
  const needsProfile = searchParams.get('completeProfile') === '1';
  const skipRedirect = searchParams.get('all') === '1';
  // Category is chosen at signup — do not block the hub with a profile form by default
  const [showProfileForm, setShowProfileForm] = useState(() => needsProfile);

  const profileHint = useMemo(() => {
    try {
      return JSON.parse(localStorage.getItem('wwa_business_profile_draft') || 'null');
    } catch {
      return null;
    }
  }, [showProfileForm]);

  const primaryCategoryId = useMemo(() => {
    return resolveBusinessDashboardCategory({
      ...profileHint,
      business_category: userDetail?.business_category || profileHint?.business_category,
      business_category_slug: userDetail?.business_category_slug,
    });
  }, [profileHint, userDetail]);

  useEffect(() => {
    if (skipRedirect || showProfileForm || !primaryCategoryId) return;
    // Auto-open the category dashboard matching signup / profile category
    if (!searchParams.get('stay')) {
      // only auto-redirect once per session unless ?all=1
      try {
        if (sessionStorage.getItem('wwa_biz_dash_redirected') === '1') return;
        sessionStorage.setItem('wwa_biz_dash_redirected', '1');
      } catch {
        /* ignore */
      }
    }
  }, [primaryCategoryId, showProfileForm, skipRedirect, searchParams]);

  const handleProfileComplete = () => {
    setShowProfileForm(false);
    if (searchParams.get('completeProfile')) {
      setSearchParams({}, { replace: true });
    }
  };

  if (isBasicAccount(userDetail)) {
    return <Navigate to={getDashboardHomePath(ACCOUNT_TYPE_BASIC)} replace />;
  }

  // Prefer landing on the category they chose at signup
  if (
    !skipRedirect &&
    !showProfileForm &&
    primaryCategoryId &&
    !searchParams.get('stay')
  ) {
    try {
      if (sessionStorage.getItem('wwa_biz_dash_redirected') !== '1') {
        sessionStorage.setItem('wwa_biz_dash_redirected', '1');
        return <Navigate to={`/my-business/dashboard/${primaryCategoryId}`} replace />;
      }
    } catch {
      return <Navigate to={`/my-business/dashboard/${primaryCategoryId}`} replace />;
    }
  }

  return (
    <div className="min-h-screen bg-slate-50">
      <UnifiedNavbar />
      <div className="page-container py-8 sm:py-10">
        <div className="mb-6 flex flex-wrap items-end justify-between gap-3">
          <div>
            <p className="text-xs font-semibold uppercase tracking-wide text-slate-500">
              Worldwide Adverts
            </p>
            <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900">
              My business dashboards
            </h1>
            <p className="mt-1 text-sm text-slate-600 max-w-2xl">
              Each homepage category has its own dashboard — post listings, promote affiliates,
              invite staff, and buy marketing tools.
            </p>
          </div>
          {primaryCategoryId && (
            <Link
              to={`/my-business/dashboard/${primaryCategoryId}`}
              className="inline-flex items-center gap-1 rounded-lg bg-slate-900 px-4 py-2 text-sm font-semibold text-white hover:bg-slate-800"
            >
              Open my category
              <FiChevronRight className="h-4 w-4" />
            </Link>
          )}
        </div>

        {showProfileForm ? (
          <BusinessProfileCompletion onComplete={handleProfileComplete} />
        ) : (
          <div className="mb-6 flex flex-wrap items-center justify-between gap-3 rounded-xl border border-slate-200 bg-white p-4">
            <p className="text-sm text-slate-600">
              {profileHint?.company_registration_number || profileHint?.certificate_name
                ? 'Business profile on file. Update company documents anytime.'
                : 'Add company certificate, company number, VAT or tax details.'}
            </p>
            <button
              type="button"
              onClick={() => setShowProfileForm(true)}
              className="text-sm font-semibold text-indigo-700 hover:underline"
            >
              Update business profile
            </button>
          </div>
        )}

        <div className="mb-8 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
          <Link
            to="/affiliates?postForm=true&mode=business"
            className="rounded-xl border border-violet-200 bg-violet-50 p-4 hover:border-violet-400 transition"
          >
            <FiBriefcase className="h-5 w-5 text-violet-700 mb-2" />
            <p className="text-sm font-bold text-violet-950">Post to Affiliates</p>
            <p className="text-xs text-violet-800 mt-1">
              Products &amp; services influencers can promote
            </p>
          </Link>
          <Link
            to="/dashboard?tab=affiliates"
            className="rounded-xl border border-rose-200 bg-rose-50 p-4 hover:border-rose-400 transition"
          >
            <FiUsers className="h-5 w-5 text-rose-700 mb-2" />
            <p className="text-sm font-bold text-rose-950">Approve influencers</p>
            <p className="text-xs text-rose-800 mt-1">Review socials &amp; mint hop links</p>
          </Link>
          <Link
            to="/business/tools"
            className="rounded-xl border border-emerald-200 bg-emerald-50 p-4 hover:border-emerald-400 transition"
          >
            <FiTool className="h-5 w-5 text-emerald-700 mb-2" />
            <p className="text-sm font-bold text-emerald-950">Business tools</p>
            <p className="text-xs text-emerald-800 mt-1">Marketing &amp; advertising tools for sale</p>
          </Link>
          <Link
            to="/messages"
            className="rounded-xl border border-sky-200 bg-sky-50 p-4 hover:border-sky-400 transition"
          >
            <FiMessageSquare className="h-5 w-5 text-sky-700 mb-2" />
            <p className="text-sm font-bold text-sky-950">Messages</p>
            <p className="text-xs text-sky-800 mt-1">Chat with customers &amp; promoters</p>
          </Link>
        </div>

        <h2 className="text-lg font-bold text-slate-900 mb-3">Category dashboards</h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {BUSINESS_DASHBOARD_CATEGORIES.map((cat) => {
            const Icon = cat.icon;
            const isPrimary = cat.id === primaryCategoryId;
            return (
              <Link
                key={cat.id}
                to={`/my-business/dashboard/${cat.id}`}
                className={`group rounded-2xl border bg-white p-5 shadow-sm transition hover:shadow-md ${
                  isPrimary ? 'border-indigo-400 ring-2 ring-indigo-100' : 'border-slate-200'
                }`}
              >
                <div
                  className={`mb-3 inline-flex h-11 w-11 items-center justify-center rounded-xl bg-gradient-to-br ${cat.color} text-white`}
                >
                  <Icon className="h-5 w-5" />
                </div>
                <div className="flex items-start justify-between gap-2">
                  <div>
                    <h3 className="font-bold text-slate-900">
                      {cat.emoji} {cat.name}
                    </h3>
                    {isPrimary && (
                      <span className="text-[10px] font-semibold uppercase tracking-wide text-indigo-600">
                        Your category
                      </span>
                    )}
                  </div>
                  <FiChevronRight className="h-4 w-4 text-slate-400 group-hover:text-slate-700 mt-1" />
                </div>
                <p className="mt-2 text-xs text-slate-600 line-clamp-2">{cat.description}</p>
              </Link>
            );
          })}
        </div>

        <div className="mt-8 flex flex-wrap gap-3">
          <Link
            to="/my-business"
            className="rounded-lg border border-slate-200 bg-white px-4 py-2 text-sm font-semibold text-slate-800 hover:bg-slate-50"
          >
            Business store &amp; team
          </Link>
          <Link
            to="/business/templates"
            className="rounded-lg border border-slate-200 bg-white px-4 py-2 text-sm font-semibold text-slate-800 hover:bg-slate-50"
          >
            Templates
          </Link>
        </div>
      </div>
      <Footer />
    </div>
  );
};

export default BusinessCategoryDashboardHub;
