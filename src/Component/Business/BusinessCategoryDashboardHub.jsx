import React, { useMemo, useState } from 'react';
import { Link, useSearchParams } from 'react-router-dom';
import UnifiedNavbar from '../UnifiedNavbar';
import Footer from '../Footer';
import { BUSINESS_DASHBOARD_CATEGORIES } from './businessCategoryDashboardConfig';
import BusinessProfileCompletion from './BusinessProfileCompletion';

const BusinessCategoryDashboardHub = () => {
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

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {BUSINESS_DASHBOARD_CATEGORIES.map((cat) => {
            const Icon = cat.icon;
            return (
              <Link
                key={cat.id}
                to={`/my-business/dashboard/${cat.id}`}
                className="group bg-white rounded-2xl border border-gray-200 p-5 hover:shadow-lg hover:-translate-y-0.5 transition-all"
              >
                <div className={`w-12 h-12 rounded-xl bg-gradient-to-br ${cat.color} flex items-center justify-center text-white mb-3`}>
                  <Icon className="h-5 w-5" />
                </div>
                <h2 className="font-bold text-gray-900 group-hover:text-purple-700">{cat.name}</h2>
                <p className="text-sm text-gray-600 mt-1 line-clamp-2">{cat.description}</p>
                <span className="inline-block mt-3 text-xs font-semibold text-purple-700">Open dashboard →</span>
              </Link>
            );
          })}
        </div>

        <div className="mt-8 p-4 rounded-xl bg-purple-50 border border-purple-200 text-sm text-purple-900">
          Need a full business store?{' '}
          <Link to="/my-business" className="font-semibold underline">Upgrade to business store</Link>
        </div>
      </div>
      <Footer />
    </div>
  );
};

export default BusinessCategoryDashboardHub;
