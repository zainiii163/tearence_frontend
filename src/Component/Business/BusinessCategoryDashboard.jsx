import React, { useMemo } from 'react';
import { Navigate, useSearchParams } from 'react-router-dom';
import { useSelector } from 'react-redux';
import { resolveBusinessDashboardCategory } from './businessCategoryDashboardConfig';

/**
 * Old full-page category dashboards redirect into /dashboard.
 * Always lands on the locked signup category (path category is ignored).
 */
const BusinessCategoryDashboard = () => {
  const [searchParams] = useSearchParams();
  const { userDetail } = useSelector((store) => store.auth);

  const cat = useMemo(() => {
    try {
      const draft = JSON.parse(localStorage.getItem('wwa_business_profile_draft') || 'null');
      return (
        resolveBusinessDashboardCategory({
          ...draft,
          business_category: userDetail?.business_category || draft?.business_category,
          business_category_slug:
            userDetail?.business_category_slug || draft?.business_category_slug,
          dashboard_category: userDetail?.dashboard_category || draft?.dashboard_category,
        }) || 'business'
      );
    } catch {
      return (
        resolveBusinessDashboardCategory({
          business_category: userDetail?.business_category,
          business_category_slug: userDetail?.business_category_slug,
          dashboard_category: userDetail?.dashboard_category,
        }) || 'business'
      );
    }
  }, [userDetail]);

  const next = new URLSearchParams();
  next.set('tab', 'overview');
  next.set('mode', 'selling');
  next.set('category', cat);
  if (searchParams.get('completeProfile') === '1') {
    next.set('completeProfile', '1');
  }

  return <Navigate to={`/dashboard?${next.toString()}`} replace />;
};

export default BusinessCategoryDashboard;
