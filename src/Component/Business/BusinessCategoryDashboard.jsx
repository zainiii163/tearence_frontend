import React from 'react';
import { Navigate, useParams, useSearchParams } from 'react-router-dom';
import {
  getDashboardCategory,
  resolveBusinessDashboardCategory,
} from './businessCategoryDashboardConfig';

/**
 * Old full-page category dashboards redirect into the proper /dashboard sidebar shell.
 */
const BusinessCategoryDashboard = () => {
  const { categoryId } = useParams();
  const [searchParams] = useSearchParams();

  let cat = categoryId;
  if (!getDashboardCategory(cat)) {
    try {
      const draft = JSON.parse(localStorage.getItem('wwa_business_profile_draft') || 'null');
      cat = resolveBusinessDashboardCategory(draft || {}) || 'business';
    } catch {
      cat = 'business';
    }
  }

  const next = new URLSearchParams();
  next.set('tab', 'category-dash');
  next.set('mode', 'selling');
  next.set('category', cat);
  if (searchParams.get('completeProfile') === '1') {
    next.set('completeProfile', '1');
  }

  return <Navigate to={`/dashboard?${next.toString()}`} replace />;
};

export default BusinessCategoryDashboard;
