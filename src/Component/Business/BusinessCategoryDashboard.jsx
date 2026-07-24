import React from 'react';
import { Link, useParams } from 'react-router-dom';
import { FiChevronLeft, FiPlus, FiExternalLink } from 'react-icons/fi';
import UnifiedNavbar from '../UnifiedNavbar';
import Footer from '../Footer';
import { getDashboardCategory } from './businessCategoryDashboardConfig';

const BusinessCategoryDashboard = () => {
  const { categoryId } = useParams();
  const category = getDashboardCategory(categoryId);

  if (!category) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center px-4">
          <h1 className="text-xl font-bold text-gray-900 mb-2">Category not found</h1>
          <Link to="/my-business/dashboard" className="text-purple-700 font-semibold underline">
            Back to dashboards
          </Link>
        </div>
      </div>
    );
  }

  const Icon = category.icon;

  return (
    <div className="min-h-screen bg-gray-50">
      <UnifiedNavbar />
      <div className="page-container py-8 sm:py-10">
        <Link
          to="/my-business/dashboard"
          className="inline-flex items-center gap-1 text-sm font-semibold text-purple-700 mb-4"
        >
          <FiChevronLeft className="h-4 w-4" /> All categories
        </Link>

        <div className={`rounded-2xl bg-gradient-to-r ${category.color} p-6 sm:p-8 text-white mb-8`}>
          <div className="flex items-start gap-4">
            <div className="w-14 h-14 rounded-2xl bg-white/20 flex items-center justify-center shrink-0">
              <Icon className="h-7 w-7" />
            </div>
            <div>
              <p className="text-xs uppercase tracking-wide text-white/80 font-semibold">Business dashboard</p>
              <h1 className="text-2xl sm:text-3xl font-extrabold">{category.name}</h1>
              <p className="text-sm text-white/90 mt-2">{category.description}</p>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
          <div className="bg-white rounded-xl border border-gray-200 p-5">
            <p className="text-xs text-gray-500 uppercase font-semibold">Your listings</p>
            <p className="text-2xl font-extrabold text-gray-900 mt-1">0</p>
            <p className="text-xs text-gray-500 mt-1">Post your first listing below</p>
          </div>
          <div className="bg-white rounded-xl border border-gray-200 p-5">
            <p className="text-xs text-gray-500 uppercase font-semibold">Views</p>
            <p className="text-2xl font-extrabold text-gray-900 mt-1">—</p>
          </div>
          <div className="bg-white rounded-xl border border-gray-200 p-5">
            <p className="text-xs text-gray-500 uppercase font-semibold">Verification</p>
            <p className="text-sm font-semibold text-amber-700 mt-2">Complete KYC to boost trust</p>
            <Link to="/kyc-verification" className="text-xs text-purple-700 underline mt-1 inline-block">
              Verify now
            </Link>
          </div>
        </div>

        <section className="bg-white rounded-2xl border border-gray-200 p-6">
          <h2 className="text-lg font-bold text-gray-900 mb-4">Post from this dashboard</h2>
          <div className="flex flex-col sm:flex-row flex-wrap gap-3">
            <Link
              to={category.postPath}
              className="inline-flex items-center justify-center gap-2 px-5 py-3 rounded-xl bg-purple-600 text-white font-semibold text-sm hover:bg-purple-700"
            >
              <FiPlus className="h-4 w-4" /> Post new listing
            </Link>
            <Link
              to={category.browsePath}
              className="inline-flex items-center justify-center gap-2 px-5 py-3 rounded-xl border border-gray-300 text-gray-800 font-semibold text-sm hover:bg-gray-50"
            >
              <FiExternalLink className="h-4 w-4" /> View public category
            </Link>
            <Link
              to="/businesses-for-sale?postForm=true"
              className="inline-flex items-center justify-center gap-2 px-5 py-3 rounded-xl border border-amber-300 text-amber-800 font-semibold text-sm hover:bg-amber-50"
            >
              Post business for sale
            </Link>
            <Link
              to="/funding?postForm=true"
              className="inline-flex items-center justify-center gap-2 px-5 py-3 rounded-xl border border-emerald-300 text-emerald-800 font-semibold text-sm hover:bg-emerald-50"
            >
              Start funding request
            </Link>
          </div>
        </section>
      </div>
      <Footer />
    </div>
  );
};

export default BusinessCategoryDashboard;
