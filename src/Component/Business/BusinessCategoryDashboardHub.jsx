import React, { useMemo } from 'react';
import { Navigate, useSearchParams } from 'react-router-dom';
import { useSelector } from 'react-redux';
import { resolveBusinessDashboardCategory } from './businessCategoryDashboardConfig';
import { isBasicAccount, getDashboardHomePath, ACCOUNT_TYPE_BASIC } from '../../utils/accountType';

/**
 * Hub redirect — category dashboards live in /dashboard?tab=category-dash sidebar.
 */
const BusinessCategoryDashboardHub = () => {
  const { userDetail } = useSelector((store) => store.auth);
  const [searchParams] = useSearchParams();

  const profileHint = useMemo(() => {
    try {
      return JSON.parse(localStorage.getItem('wwa_business_profile_draft') || 'null');
    } catch {
      return null;
    }
  }, []);

  if (isBasicAccount(userDetail)) {
    return <Navigate to={getDashboardHomePath(ACCOUNT_TYPE_BASIC)} replace />;
  }

  // Always use registered signup category (ignore ?category= / ?all=)
  const category =
    resolveBusinessDashboardCategory({
      ...profileHint,
      business_category: userDetail?.business_category || profileHint?.business_category,
      business_category_slug:
        userDetail?.business_category_slug || profileHint?.business_category_slug,
      dashboard_category: userDetail?.dashboard_category || profileHint?.dashboard_category,
    }) || 'business';

  const next = new URLSearchParams();
  next.set('tab', 'overview');
  next.set('mode', 'selling');
  next.set('category', category);
  if (searchParams.get('completeProfile') === '1') {
    next.set('completeProfile', '1');
  }

  return <Navigate to={`/dashboard?${next.toString()}`} replace />;
};

export default BusinessCategoryDashboardHub;
