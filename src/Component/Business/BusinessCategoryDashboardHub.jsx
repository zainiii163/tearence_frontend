import React, { useMemo, useState } from 'react';
import { Link, Navigate, useSearchParams } from 'react-router-dom';
import { useSelector } from 'react-redux';
import UnifiedNavbar from '../UnifiedNavbar';
import Footer from '../Footer';
import BusinessProfileCompletion from './BusinessProfileCompletion';
import { isBasicAccount, getDashboardHomePath, ACCOUNT_TYPE_BASIC } from '../../utils/accountType';

const BusinessCategoryDashboardHub = () => {
  const { userDetail } = useSelector((store) => store.auth);
  const [searchParams, setSearchParams] = useSearchParams();
  const needsProfile = searchParams.get('completeProfile') === '1';
  const [showProfileForm, setShowProfileForm] = useState(() => {
    if (needsProfile) return true;
    try {
      return !localStorage.getItem('wwa_business_profile_draft');
    } catch {
      return true;
    }
  });

  const handleProfileComplete = () => {
    setShowProfileForm(false);
    if (searchParams.get('completeProfile')) {
      setSearchParams({}, { replace: true });
    }
  };

  const profileHint = useMemo(() => {
    try {
      return JSON.parse(localStorage.getItem('wwa_business_profile_draft') || 'null');
    } catch {
      return null;
    }
  }, [showProfileForm]);

  // Basic users are buyers — send them to the purchase dashboard
  if (isBasicAccount(userDetail)) {
    return <Navigate to={getDashboardHomePath(ACCOUNT_TYPE_BASIC)} replace />;
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <UnifiedNavbar />
      <div className="page-container py-8 sm:py-10">
        <div className="mb-6">
          <h1 className="text-2xl sm:text-3xl font-extrabold text-gray-900">My business dashboard</h1>
        </div>

        {showProfileForm ? (
          <BusinessProfileCompletion onComplete={handleProfileComplete} />
        ) : (
          <div className="mb-6 flex flex-wrap items-center justify-between gap-3 rounded-xl border border-gray-200 bg-white p-4">
            <p className="text-sm text-gray-600">
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

        <div className="rounded-2xl border border-gray-200 bg-white p-6 space-y-4">
          <h2 className="text-lg font-bold text-gray-900">Quick links</h2>
          <div className="flex flex-wrap gap-3">
            <Link
              to="/my-business"
              className="inline-flex items-center rounded-lg bg-indigo-600 px-4 py-2 text-sm font-semibold text-white hover:bg-indigo-700"
            >
              Business store
            </Link>
            <Link
              to="/dashboard?mode=selling"
              className="inline-flex items-center rounded-lg border border-gray-200 px-4 py-2 text-sm font-semibold text-gray-800 hover:bg-gray-50"
            >
              Manage listings
            </Link>
            <Link
              to="/services"
              className="inline-flex items-center rounded-lg border border-gray-200 px-4 py-2 text-sm font-semibold text-gray-800 hover:bg-gray-50"
            >
              Services marketplace
            </Link>
          </div>
        </div>
      </div>
      <Footer />
    </div>
  );
};

export default BusinessCategoryDashboardHub;
