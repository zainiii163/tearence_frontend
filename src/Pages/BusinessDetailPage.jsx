import React, { useEffect, useState, useMemo } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { useSelector } from 'react-redux';
import UnifiedNavbar from '../Component/UnifiedNavbar';
import Footer from '../Component/Footer';
import businessService from '../services/BusinessService';
import { FaBuilding, FaArrowLeft, FaEdit } from 'react-icons/fa';
import { motion } from 'framer-motion';
import BusinessListingsGrid from '../Component/Business/BusinessListingsGrid';
import BusinessProfileTabs from '../Component/Business/BusinessProfileTabs';
import SponsoredPostsSidebar from '../Component/DetailsPages/SponsoredPostsSidebar';
import { resolveStorageUrl } from '../utils/dashboardEditMappers';
import { BUSINESS_DIRECTORY_EXAMPLES, getBusinessExampleById } from '../data/businessDirectoryExamples';

const extractItems = (response) => {
  const payload = response?.data || response;
  const items = payload?.items || payload?.data || payload;
  return Array.isArray(items) ? items : [];
};

const resolveBannerUrl = (business) => {
  const raw =
    business?.cover_image ||
    business?.banner_image ||
    business?.business_banner ||
    business?.hero_image ||
    business?.business_logo ||
    null;
  return resolveStorageUrl(raw) || raw || null;
};

const BusinessDetailPage = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { logIn, customerId } = useSelector((store) => store.auth);
  const [business, setBusiness] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [businessListings, setBusinessListings] = useState([]);
  const [relatedBusinesses, setRelatedBusinesses] = useState([]);
  const [relatedLoading, setRelatedLoading] = useState(false);

  const isOwner = useMemo(() => {
    if (!logIn || !business?.customer_id || customerId == null) return false;
    return String(business.customer_id) === String(customerId);
  }, [logIn, business?.customer_id, customerId]);

  useEffect(() => {
    const fetchBusiness = async () => {
      const example = getBusinessExampleById(id);
      if (example) {
        setBusiness(example);
        setLoading(false);
        setError('');
        return;
      }

      try {
        setLoading(true);
        const response = await businessService.getBusinessById(id);
        if (response.data) {
          setBusiness(response.data);
        } else {
          setError('Business not found');
        }
      } catch (err) {
        console.error('Error fetching business:', err);
        setError('Failed to load business details');
      } finally {
        setLoading(false);
      }
    };

    fetchBusiness();
  }, [id]);

  useEffect(() => {
    if (!business) return undefined;

    let cancelled = false;
    const loadSupportingContent = async () => {
      setRelatedLoading(true);
      const currentCategory =
        business.category?.id ||
        business.category?.slug ||
        business.business_category_slug ||
        business.business_type ||
        business.category_name;

      const sameCategory = (candidate) => {
        const candidateCategory =
          candidate.category?.id ||
          candidate.category?.slug ||
          candidate.business_category_slug ||
          candidate.business_type ||
          candidate.category_name;
        return currentCategory && candidateCategory
          ? String(currentCategory).toLowerCase() === String(candidateCategory).toLowerCase()
          : false;
      };

      try {
        const [listingsResponse, businessesResponse] = await Promise.all([
          businessService.getBusinessListings(id, { limit: 6 }).catch(() => null),
          businessService.getAllBusinesses({ limit: 24 }).catch(() => null),
        ]);
        if (cancelled) return;

        setBusinessListings(extractItems(listingsResponse).slice(0, 6));
        const candidates = extractItems(businessesResponse);
        const examples = BUSINESS_DIRECTORY_EXAMPLES.filter((candidate) => candidate.id !== id);
        const allCandidates = [...candidates, ...examples];
        const withoutCurrent = allCandidates.filter(
          (candidate) => String(candidate.id || candidate.slug) !== String(id)
        );
        const matching = withoutCurrent.filter(sameCategory);
        setRelatedBusinesses([...(matching.length ? matching : withoutCurrent)].slice(0, 6));
      } finally {
        if (!cancelled) setRelatedLoading(false);
      }
    };

    loadSupportingContent();
    return () => {
      cancelled = true;
    };
  }, [business, id]);

  if (loading) {
    return (
      <div className="min-h-screen flex flex-col">
        <UnifiedNavbar />
        <div className="flex-1 flex items-center justify-center">
          <div className="inline-block h-12 w-12 animate-spin rounded-full border-4 border-solid border-indigo-600 border-r-transparent" />
        </div>
        <Footer />
      </div>
    );
  }

  if (error || !business) {
    return (
      <div className="min-h-screen flex flex-col">
        <UnifiedNavbar />
        <div className="flex-1 flex items-center justify-center">
          <div className="text-center">
            <p className="text-red-600 text-lg mb-4">{error || 'Business not found'}</p>
            <button
              type="button"
              onClick={() => navigate('/business')}
              className="px-6 py-3 bg-indigo-600 text-white rounded-xl hover:bg-indigo-700 transition-colors"
            >
              Back to Businesses
            </button>
          </div>
        </div>
        <Footer />
      </div>
    );
  }

  const bannerUrl = resolveBannerUrl(business);
  const logoUrl =
    resolveStorageUrl(business.business_logo) || business.business_logo || null;

  return (
    <div className="min-h-screen flex flex-col bg-slate-50 wwa-titles-centered">
      <UnifiedNavbar />

      <div className="page-container max-w-7xl mx-auto px-4 py-4 sm:py-6 flex-1 w-full">
        <motion.div
          initial={{ opacity: 0, x: -12 }}
          animate={{ opacity: 1, x: 0 }}
          className="mb-4"
        >
          <button
            type="button"
            onClick={() => navigate('/business')}
            className="flex items-center gap-2 text-indigo-700 hover:text-indigo-800 font-semibold transition-colors"
          >
            <FaArrowLeft />
            Back to Businesses
          </button>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.45 }}
          className="overflow-hidden"
        >
          {/* 1. Clean banner — image only, no inline text */}
          <div
            className="w-full h-48 sm:h-64 bg-cover bg-center rounded-xl shadow-md relative bg-slate-800"
            style={
              bannerUrl
                ? { backgroundImage: `url(${bannerUrl})` }
                : {
                    backgroundImage:
                      'linear-gradient(125deg, #312e81 0%, #4f46e5 45%, #0f172a 100%)',
                  }
            }
            role="img"
            aria-label={`${business.business_name} banner`}
          />

          {/* Identity row under banner */}
          <div className="relative -mt-10 sm:-mt-12 px-1 sm:px-2 mb-4">
            <div className="flex flex-col sm:flex-row sm:items-end gap-3 sm:gap-4">
              <div className="w-20 h-20 sm:w-24 sm:h-24 rounded-xl border-4 border-white shadow-md bg-white overflow-hidden flex items-center justify-center shrink-0 mx-auto sm:mx-0">
                {logoUrl ? (
                  <img
                    src={logoUrl}
                    alt={business.business_name}
                    className="w-full h-full object-cover"
                  />
                ) : (
                  <FaBuilding className="h-8 w-8 text-indigo-400" />
                )}
              </div>

              <div className="flex-1 min-w-0 text-center sm:text-left pb-1">
                <h1 className="text-xl sm:text-2xl font-bold text-gray-900 leading-tight">
                  {business.business_name}
                </h1>
                <div className="mt-1.5 flex flex-wrap items-center justify-center sm:justify-start gap-2">
                  <span
                    className={`px-2.5 py-0.5 rounded-full text-xs font-bold ${
                      business.status === 'active'
                        ? 'bg-green-100 text-green-800'
                        : 'bg-gray-100 text-gray-700'
                    }`}
                  >
                    {business.status || 'Active'}
                  </span>
                  {business.category && (
                    <span className="px-2.5 py-0.5 rounded-full bg-indigo-50 text-indigo-800 text-xs font-semibold">
                      {business.category.name}
                    </span>
                  )}
                </div>
              </div>

              {isOwner && (
                <Link
                  to="/dashboard?tab=business"
                  className="inline-flex items-center justify-center gap-2 px-4 py-2.5 bg-white border border-indigo-200 text-indigo-700 rounded-lg hover:bg-indigo-50 transition-colors font-semibold text-sm shadow-sm mx-auto sm:mx-0"
                >
                  <FaEdit />
                  Edit Business
                </Link>
              )}
            </div>
          </div>

          <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-4 sm:p-6">
            <BusinessProfileTabs
              business={business}
              listings={businessListings}
              isOwner={isOwner}
            />
          </div>
        </motion.div>

        {(relatedLoading || relatedBusinesses.length > 0) && (
          <section className="mt-6 rounded-xl border border-gray-200 bg-white p-4 sm:p-5">
            <div className="mb-3 text-center">
              <p className="text-xs font-semibold uppercase tracking-wide text-indigo-600">
                You may also like
              </p>
              <h2 className="text-lg font-bold text-gray-900">Similar businesses</h2>
            </div>
            <BusinessListingsGrid businesses={relatedBusinesses} loading={relatedLoading} />
          </section>
        )}

        <section className="mt-6 rounded-xl border border-gray-200 bg-white p-4 sm:p-5">
          <p className="text-xs font-semibold uppercase tracking-wide text-orange-600 mb-1 text-center">
            On this page
          </p>
          <h2 className="text-lg font-bold text-gray-900 mb-3 text-center">Sponsored adverts</h2>
          <SponsoredPostsSidebar currentAdId={business?.id} />
        </section>
      </div>

      <Footer />
    </div>
  );
};

export default BusinessDetailPage;
