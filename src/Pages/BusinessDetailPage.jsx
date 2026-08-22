import React, { useEffect, useState, useMemo } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { useSelector } from 'react-redux';
import UnifiedNavbar from '../Component/UnifiedNavbar';
import Footer from '../Component/Footer';
import businessService from '../services/BusinessService';
import {
  FaBuilding,
  FaArrowLeft,
  FaEdit,
  FaMapMarkerAlt,
  FaGlobe,
  FaExternalLinkAlt,
} from 'react-icons/fa';
import { motion } from 'framer-motion';
import BusinessListingsGrid from '../Component/Business/BusinessListingsGrid';
import BusinessProfileTabs from '../Component/Business/BusinessProfileTabs';
import BusinessPageAdvertsRail from '../Component/Business/BusinessPageAdvertsRail';
import BusinessContactActions from '../Component/Business/BusinessContactActions';
import BusinessSocialLinks from '../Component/Business/BusinessSocialLinks';
import { resolveStorageUrl } from '../utils/dashboardEditMappers';
import { BUSINESS_DIRECTORY_EXAMPLES, getBusinessExampleById } from '../data/businessDirectoryExamples';
import { getBusinessSocialPage } from '../utils/businessSocial';

const extractItems = (response) => {
  const payload = response?.data || response;
  const items = payload?.items || payload?.data || payload;
  return Array.isArray(items) ? items : [];
};

const resolveBannerUrl = (business) => {
  // Cover/banner only — logo must not fill the hero (Clive: solid colour when no image)
  const raw =
    business?.cover_image ||
    business?.banner_image ||
    business?.business_banner ||
    business?.hero_image ||
    null;
  return resolveStorageUrl(raw) || raw || null;
};

const formatCategoryLabel = (business) => {
  const named = business?.category?.name || business?.category_name || business?.business_category;
  if (named) return named;
  const slug = business?.business_category_slug || business?.category?.slug;
  if (!slug) return null;
  return String(slug)
    .replace(/[-_]+/g, ' ')
    .replace(/\b\w/g, (c) => c.toUpperCase());
};

const BANNER_FALLBACK =
  'linear-gradient(125deg, #0f172a 0%, #1e3a8a 38%, #312e81 68%, #0f172a 100%)';

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
  const [hubCommunity, setHubCommunity] = useState(null);

  const isOwner = useMemo(() => {
    if (!logIn || !business?.customer_id || customerId == null) return false;
    return String(business.customer_id) === String(customerId);
  }, [logIn, business?.customer_id, customerId]);

  useEffect(() => {
    let cancelled = false;
    if (!business?.id) {
      setHubCommunity(null);
      return undefined;
    }
    (async () => {
      try {
        const hub = await getBusinessSocialPage(business.id || business);
        if (!cancelled) setHubCommunity(hub);
      } catch {
        if (!cancelled) setHubCommunity(null);
      }
    })();
    return () => {
      cancelled = true;
    };
  }, [business]);

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
        setError('');
        let response = await businessService.getBusinessById(id);
        let data = response?.data ?? response;

        if (data && data.data && (data.data.id || data.data.business_name)) {
          data = data.data;
        }

        if (!data || (!data.id && !data.business_name)) {
          const searchRes = await businessService.getAllBusinesses({
            search: id,
            per_page: 20,
          });
          const items = extractItems(searchRes);
          const needle = String(id).toLowerCase();
          data =
            items.find(
              (b) =>
                String(b.slug || '').toLowerCase() === needle ||
                String(b.id) === String(id)
            ) ||
            items.find((b) =>
              String(b.business_name || '')
                .toLowerCase()
                .includes(needle.replace(/-/g, ' '))
            ) ||
            null;
        }

        if (data?.id || data?.business_name) {
          setBusiness(data);
        } else {
          setError('Business not found');
        }
      } catch (err) {
        console.error('Error fetching business:', err);
        try {
          const searchRes = await businessService.getAllBusinesses({
            search: id,
            per_page: 20,
          });
          const items = extractItems(searchRes);
          const needle = String(id).toLowerCase();
          const match =
            items.find(
              (b) =>
                String(b.slug || '').toLowerCase() === needle ||
                String(b.id) === String(id)
            ) ||
            items.find((b) =>
              String(b.business_name || '')
                .toLowerCase()
                .includes(needle.replace(/-/g, ' '))
            );
          if (match) {
            setBusiness(match);
            setError('');
          } else {
            setError('Failed to load business details');
          }
        } catch {
          setError('Failed to load business details');
        }
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
  const categoryLabel = formatCategoryLabel(business);
  const locationLabel = [business.city, business.country].filter(Boolean).join(', ');
  const websiteHref = business.business_website
    ? /^https?:\/\//i.test(business.business_website)
      ? business.business_website
      : `https://${business.business_website}`
    : null;
  const websiteHost = websiteHref
    ? (() => {
        try {
          return new URL(websiteHref).hostname.replace(/^www\./, '');
        } catch {
          return business.business_website;
        }
      })()
    : null;

  return (
    <div className="min-h-screen flex flex-col bg-[#f4f6f9] wwa-titles-centered">
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
            className="inline-flex items-center gap-2 text-sm font-semibold text-slate-600 hover:text-indigo-700 transition-colors"
          >
            <FaArrowLeft className="h-3.5 w-3.5" />
            Back to Businesses
          </button>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.45 }}
        >
          <div className="rounded-2xl border border-slate-200/80 bg-white shadow-sm overflow-hidden mb-5">
            <div
              className="relative w-full min-h-[12.5rem] sm:min-h-[16rem] md:min-h-[18rem] bg-cover bg-center"
              style={
                bannerUrl
                  ? { backgroundImage: `url(${bannerUrl})` }
                  : { backgroundImage: BANNER_FALLBACK }
              }
              role="img"
              aria-label={`${business.business_name} banner`}
            >
              <div
                className="absolute inset-0 bg-gradient-to-b from-slate-950/50 via-slate-950/25 to-slate-950/70"
                aria-hidden
              />
              <div className="relative z-[1] flex flex-col items-center justify-center text-center px-4 py-10 sm:py-14">
                <p className="text-[10px] sm:text-[11px] font-semibold uppercase tracking-[0.2em] text-white/75 mb-2">
                  Business profile
                </p>
                <h1 className="text-2xl sm:text-3xl md:text-4xl font-bold text-white leading-tight max-w-3xl drop-shadow-md tracking-tight">
                  {business.business_name}
                </h1>
                {locationLabel ? (
                  <p className="mt-2 inline-flex items-center gap-1.5 text-sm text-white/85">
                    <FaMapMarkerAlt className="h-3 w-3 opacity-80" />
                    {locationLabel}
                  </p>
                ) : null}
              </div>
            </div>

            <div className="relative px-4 sm:px-6 pb-5 pt-0">
              <div className="flex flex-col sm:flex-row sm:items-end gap-4 -mt-10 sm:-mt-12">
                <div className="mx-auto sm:mx-0 w-[5.5rem] h-[5.5rem] sm:w-28 sm:h-28 rounded-2xl border-[3px] border-white shadow-lg bg-white overflow-hidden flex items-center justify-center shrink-0 ring-1 ring-slate-200/80">
                  {logoUrl ? (
                    <img
                      src={logoUrl}
                      alt={`${business.business_name} logo`}
                      className="w-full h-full object-contain p-1.5"
                    />
                  ) : (
                    <FaBuilding className="h-9 w-9 text-indigo-400" />
                  )}
                </div>

                <div className="flex-1 min-w-0 text-center sm:text-left sm:pb-1">
                  <div className="flex flex-wrap items-center justify-center sm:justify-start gap-2 mb-2">
                    <span
                      className={`inline-flex items-center px-2.5 py-1 rounded-md text-[11px] font-bold uppercase tracking-wide ${
                        business.status === 'active' || !business.status
                          ? 'bg-emerald-50 text-emerald-800 ring-1 ring-emerald-200/80'
                          : 'bg-slate-100 text-slate-700 ring-1 ring-slate-200'
                      }`}
                    >
                      {business.status || 'Active'}
                    </span>
                    {categoryLabel ? (
                      <span className="inline-flex items-center px-2.5 py-1 rounded-md text-[11px] font-semibold bg-indigo-50 text-indigo-800 ring-1 ring-indigo-100">
                        {categoryLabel}
                      </span>
                    ) : null}
                  </div>

                  <div className="flex flex-wrap items-center justify-center sm:justify-start gap-x-4 gap-y-1.5 text-sm text-slate-600">
                    {websiteHost && websiteHref ? (
                      <a
                        href={websiteHref}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="inline-flex items-center gap-1.5 font-medium text-indigo-700 hover:text-indigo-900"
                      >
                        <FaGlobe className="h-3.5 w-3.5" />
                        {websiteHost}
                        <FaExternalLinkAlt className="h-2.5 w-2.5 opacity-60" />
                      </a>
                    ) : null}
                    {business.business_email ? (
                      <a
                        href={`mailto:${business.business_email}`}
                        className="hover:text-indigo-700 truncate max-w-[220px]"
                      >
                        {business.business_email}
                      </a>
                    ) : null}
                  </div>
                </div>

                {isOwner ? (
                  <div className="flex justify-center sm:justify-end sm:pb-1 shrink-0">
                    <Link
                      to="/dashboard?tab=business"
                      className="inline-flex items-center justify-center gap-2 px-4 py-2.5 bg-slate-900 text-white rounded-lg hover:bg-slate-800 transition-colors font-semibold text-sm shadow-sm"
                    >
                      <FaEdit className="h-3.5 w-3.5" />
                      Edit profile
                    </Link>
                  </div>
                ) : null}
              </div>

              <div className="mt-5 space-y-4 border-t border-slate-100 pt-5">
                <BusinessContactActions
                  business={business}
                  isOwner={isOwner}
                  social={hubCommunity}
                />
                <BusinessSocialLinks business={business} social={hubCommunity} />
              </div>
            </div>
          </div>

          <div className="rounded-2xl border border-slate-200/80 bg-white shadow-sm p-4 sm:p-6">
            <BusinessProfileTabs
              business={business}
              listings={businessListings}
              isOwner={isOwner}
              hubCommunity={hubCommunity}
            />
          </div>
        </motion.div>

        {(relatedLoading || relatedBusinesses.length > 0) && (
          <section className="mt-6">
            <BusinessListingsGrid businesses={relatedBusinesses} loading={relatedLoading} />
          </section>
        )}

        {/* Clive: tiny sponsored (side) + larger paid adverts; featured strip below — no section slogans */}
        <BusinessPageAdvertsRail excludeId={business?.id} />
      </div>

      <Footer />
    </div>
  );
};

export default BusinessDetailPage;
