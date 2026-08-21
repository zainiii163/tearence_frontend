import React, { useEffect, useMemo, useState } from 'react';
import { Link } from 'react-router-dom';
import {
  FaStar,
  FaBullhorn,
  FaBoxOpen,
  FaBuilding,
  FaArrowRight,
  FaUsers,
} from 'react-icons/fa';
import toast from 'react-hot-toast';
import {
  ensureBusinessSocialPage,
  getBusinessSocialPage,
  socialHrefForCommunity,
} from '../../utils/businessSocial';
import { communitiesAPI } from '../../api/communities';
import { resolveStorageUrl } from '../../utils/dashboardEditMappers';
import BusinessCategoryProfilePanel from './BusinessCategoryProfilePanel';
import ChatButton from '../Chat/ChatButton';
import {
  buildListingChatContext,
  resolveSellerId,
  resolveSellerName,
} from '../../utils/chatHelpers';

const TABS = [
  { id: 'about', label: 'About', icon: FaBuilding },
  { id: 'company-details', label: 'Company Details', icon: FaBuilding },
  { id: 'promotions', label: 'Promotions', icon: FaBullhorn },
  { id: 'packages', label: 'Packages', icon: FaBoxOpen },
  { id: 'reviews', label: 'Reviews', icon: FaStar },
];

const DAY_ORDER = [
  'monday',
  'tuesday',
  'wednesday',
  'thursday',
  'friday',
  'saturday',
  'sunday',
];

const collectTechStack = (business) => {
  const profile = business?.profile || business?.category_profile || {};
  const raw =
    business?.tech_stack ||
    business?.technology_profile ||
    profile.tech_stack ||
    profile.products ||
    profile.services ||
    profile.tools ||
    [];
  if (Array.isArray(raw)) return raw.filter(Boolean).map(String);
  if (typeof raw === 'string') {
    return raw
      .split(/[,|;]/)
      .map((s) => s.trim())
      .filter(Boolean);
  }
  return [];
};

const HoursList = ({ hours }) => {
  if (!hours || typeof hours !== 'object') {
    return <p className="text-xs text-gray-500">Opening hours not listed yet.</p>;
  }
  return (
    <ul className="grid grid-cols-1 sm:grid-cols-2 gap-x-4 gap-y-1 text-xs text-gray-700">
      {DAY_ORDER.map((day) =>
        hours[day] ? (
          <li key={day} className="flex justify-between gap-2 border-b border-gray-100 py-1">
            <span className="font-medium capitalize text-gray-600">{day}</span>
            <span>{hours[day]}</span>
          </li>
        ) : null
      )}
    </ul>
  );
};

/**
 * Clive redesign: About | Company Details tabs, Social Hub CTA in nav,
 * left overview / right contact, Technology Profile under About.
 */
const BusinessProfileTabs = ({
  business,
  listings = [],
  isOwner = false,
  onTabChange,
}) => {
  const [tab, setTab] = useState('about');
  const [social, setSocial] = useState(null);
  const [socialLoading, setSocialLoading] = useState(true);
  const [ensuring, setEnsuring] = useState(false);
  const [following, setFollowing] = useState(false);

  const businessId = business?.id;

  useEffect(() => {
    let cancelled = false;
    (async () => {
      if (!businessId) return;
      setSocialLoading(true);
      const page = await getBusinessSocialPage(businessId);
      if (!cancelled) {
        setSocial(page);
        setSocialLoading(false);
      }
    })();
    return () => {
      cancelled = true;
    };
  }, [businessId]);

  useEffect(() => {
    onTabChange?.(tab);
  }, [tab, onTabChange]);

  const socialUrl = useMemo(() => socialHrefForCommunity(social), [social]);

  const openOrCreateSocial = async () => {
    if (social) {
      window.location.href = socialUrl;
      return;
    }
    if (!isOwner) {
      toast.error('This business has not opened their Social Hub page yet.');
      return;
    }
    try {
      setEnsuring(true);
      const page = await ensureBusinessSocialPage(businessId);
      setSocial(page);
      toast.success('Social Hub page ready');
      window.location.href = socialHrefForCommunity(page);
    } catch (e) {
      toast.error(e?.response?.data?.message || e?.message || 'Could not open Social Hub');
    } finally {
      setEnsuring(false);
    }
  };

  const handleFollow = async () => {
    if (!social?.community_id && !social?.slug) {
      toast.error('Social page not available yet');
      return;
    }
    try {
      setFollowing(true);
      const id = social.community_id || social.slug;
      await communitiesAPI.followCommunity(id);
      toast.success('Following this business');
    } catch (e) {
      toast.error(e?.response?.data?.message || 'Sign in to follow');
    } finally {
      setFollowing(false);
    }
  };

  const packages = Array.isArray(business?.packages)
    ? business.packages
    : Array.isArray(business?.addons)
      ? business.addons
      : [];

  const reviews = Array.isArray(business?.reviews) ? business.reviews : [];
  const rating = Number(business?.rating || business?.average_rating || 0);

  const profile = business?.profile || business?.category_profile || {};
  const hours =
    profile.opening_hours ||
    profile.operating_hours ||
    business?.opening_hours ||
    business?.operating_hours ||
    null;
  const techStack = collectTechStack(business);

  return (
    <div className="mt-2">
      {/* Tabs + Social Hub action */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 border-b border-gray-200 pb-3 mb-5">
        <div className="flex flex-wrap gap-1 sm:gap-2">
          {TABS.map((t) => {
            const Icon = t.icon;
            const active = tab === t.id;
            return (
              <button
                key={t.id}
                type="button"
                onClick={() => setTab(t.id)}
                className={`inline-flex items-center gap-1.5 px-3 py-2 text-sm font-semibold transition-colors border-b-2 -mb-[13px] ${
                  active
                    ? 'border-indigo-600 text-indigo-700'
                    : 'border-transparent text-gray-600 hover:text-gray-900'
                }`}
              >
                <Icon className="h-3.5 w-3.5" />
                {t.label}
              </button>
            );
          })}
        </div>

        <div className="flex flex-wrap items-center gap-2 shrink-0">
          {social && (
            <button
              type="button"
              disabled={following}
              onClick={handleFollow}
              className="inline-flex items-center gap-1.5 px-3 py-2 rounded-lg bg-white border border-indigo-200 text-indigo-800 text-xs font-bold hover:bg-indigo-50"
            >
              <FaUsers className="h-3 w-3" />
              {following ? '…' : 'Follow'}
            </button>
          )}
          <button
            type="button"
            disabled={ensuring || socialLoading}
            onClick={openOrCreateSocial}
            className="inline-flex items-center gap-2 px-4 py-2 rounded-lg bg-indigo-600 text-white text-sm font-medium hover:bg-indigo-700 disabled:opacity-60 transition"
          >
            {ensuring
              ? 'Opening…'
              : social
                ? 'Open Social Hub'
                : isOwner
                  ? 'Open Social Hub'
                  : 'Social Hub'}
            <FaArrowRight className="h-3 w-3" />
          </button>
        </div>
      </div>

      {tab === 'about' && (
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 lg:gap-8">
          {/* Left: overview, hours, tech, category extras, adverts summary */}
          <div className="lg:col-span-8 space-y-4 text-sm text-gray-700">
            <section className="bg-white p-4 sm:p-5 rounded-lg border border-gray-200">
              <h2 className="text-lg font-bold text-gray-900 mb-2 text-left">Business Overview</h2>
              <p className="leading-relaxed text-sm text-gray-700 whitespace-pre-line">
                {business?.business_description || 'No description published yet.'}
              </p>
            </section>

            <section className="bg-white p-4 sm:p-5 rounded-lg border border-gray-200">
              <h3 className="text-base font-bold text-gray-900 mb-2 text-left">Opening Hours</h3>
              <HoursList hours={hours} />
            </section>

            {(techStack.length > 0 ||
              String(business?.business_category_slug || business?.category?.slug || '')
                .toLowerCase()
                .includes('tech')) && (
              <section className="bg-white p-4 sm:p-5 rounded-lg border border-gray-200">
                <h3 className="text-base font-bold text-gray-900 mb-3 text-left">
                  Technology Profile
                </h3>
                {techStack.length ? (
                  <div className="flex flex-wrap gap-2">
                    {techStack.map((tech) => (
                      <span
                        key={tech}
                        className="px-2.5 py-1 bg-gray-100 text-gray-800 text-xs font-medium rounded"
                      >
                        {tech}
                      </span>
                    ))}
                  </div>
                ) : (
                  <p className="text-xs text-gray-500">
                    Technology stack details will appear here when the business adds them.
                  </p>
                )}
              </section>
            )}

            <div className="[&_h3]:text-left [&_h2]:text-left">
              <BusinessCategoryProfilePanel
                business={business}
                excludeSections={['opening_hours', 'support_hours', 'term_hours', 'check_in']}
              />
            </div>

            {listings.length > 0 && (
              <section className="bg-white p-4 sm:p-5 rounded-lg border border-gray-200">
                <h3 className="text-base font-bold text-gray-900 mb-3 text-left">
                  Business adverts
                </h3>
                <ul className="space-y-2">
                  {listings.slice(0, 6).map((item) => (
                    <li
                      key={item.id || item.slug || item.title}
                      className="flex items-center gap-3 p-2 rounded-lg border border-gray-100"
                    >
                      {(item.images?.[0]?.image_path || item.image) && (
                        <img
                          src={
                            resolveStorageUrl(item.images?.[0]?.image_path || item.image) ||
                            item.image
                          }
                          alt=""
                          className="h-10 w-10 rounded object-cover bg-gray-100"
                        />
                      )}
                      <div className="min-w-0">
                        <p className="text-sm font-semibold text-gray-900 truncate">
                          {item.title || item.name || 'Advert'}
                        </p>
                        <p className="text-[11px] text-gray-500">
                          {item.category_name || item.advert_type || 'Listing'}
                        </p>
                      </div>
                    </li>
                  ))}
                </ul>
              </section>
            )}
          </div>

          {/* Right: contact, owner, live chat */}
          <div className="lg:col-span-4 space-y-4">
            <div className="bg-white p-4 sm:p-5 rounded-lg border border-gray-200 space-y-4 sticky top-24">
              <h3 className="text-base font-bold text-gray-900 border-b border-gray-100 pb-2 text-left">
                Contact &amp; Owner Details
              </h3>
              <div className="text-sm space-y-2 text-gray-700">
                {business?.business_owner && (
                  <p>
                    <strong>Owner:</strong> {business.business_owner}
                  </p>
                )}
                {business?.business_email && (
                  <p>
                    <strong>Email:</strong>{' '}
                    <a
                      href={`mailto:${business.business_email}`}
                      className="text-indigo-700 hover:underline break-all"
                    >
                      {business.business_email}
                    </a>
                  </p>
                )}
                {business?.business_phone_number && (
                  <p>
                    <strong>Phone:</strong>{' '}
                    <a
                      href={`tel:${business.business_phone_number}`}
                      className="text-indigo-700 hover:underline"
                    >
                      {business.business_phone_number}
                    </a>
                  </p>
                )}
                {business?.business_website && (
                  <p>
                    <strong>Website:</strong>{' '}
                    <a
                      href={business.business_website}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-indigo-700 hover:underline break-all"
                    >
                      {business.business_website}
                    </a>
                  </p>
                )}
                {business?.business_address && (
                  <p>
                    <strong>Address:</strong> {business.business_address}
                    {[business.city, business.country].filter(Boolean).length
                      ? `, ${[business.city, business.country].filter(Boolean).join(', ')}`
                      : ''}
                  </p>
                )}
                {!business?.business_owner &&
                  !business?.business_email &&
                  !business?.business_phone_number && (
                    <p className="text-xs text-gray-500">Contact details not published yet.</p>
                  )}
              </div>

              {!isOwner && resolveSellerId(business) && (
                <ChatButton
                  sellerId={resolveSellerId(business)}
                  sellerName={resolveSellerName(
                    business,
                    business.business_name || business.business_owner || 'Business'
                  )}
                  listing={buildListingChatContext(business, 'Business')}
                  label="Start Live Chat"
                  className="w-full py-2.5 bg-green-600 hover:bg-green-700 text-white text-sm font-semibold rounded-lg"
                  variant="custom"
                />
              )}
            </div>
          </div>
        </div>
      )}

      {tab === 'company-details' && (
        <div className="bg-white p-5 sm:p-6 rounded-lg border border-gray-200">
          <h2 className="text-xl font-bold mb-4 text-left text-gray-900">Company Details</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
            <div>
              <strong className="text-gray-500 font-medium">Company name</strong>
              <p className="font-semibold text-gray-900">
                {business.business_company_name || business.business_name || '—'}
              </p>
            </div>
            <div>
              <strong className="text-gray-500 font-medium">Registration Number</strong>
              <p className="font-semibold text-gray-900">
                {business.business_company_no || business.business_company_registration || '—'}
              </p>
            </div>
            <div>
              <strong className="text-gray-500 font-medium">Tax / VAT ID</strong>
              <p className="font-semibold text-gray-900">{business.vat_number || '—'}</p>
            </div>
            <div>
              <strong className="text-gray-500 font-medium">DUNS</strong>
              <p className="font-semibold text-gray-900">{business.duns_number || '—'}</p>
            </div>
            <div>
              <strong className="text-gray-500 font-medium">Incorporation Date</strong>
              <p className="font-semibold text-gray-900">
                {business.incorporation_date
                  ? new Date(business.incorporation_date).toLocaleDateString(undefined, {
                      day: 'numeric',
                      month: 'short',
                      year: 'numeric',
                    })
                  : '—'}
              </p>
            </div>
            <div>
              <strong className="text-gray-500 font-medium">Headquarters</strong>
              <p className="font-semibold text-gray-900">
                {[business.business_address, business.city, business.postal_code, business.country]
                  .filter(Boolean)
                  .join(', ') || '—'}
              </p>
            </div>
          </div>
        </div>
      )}

      {tab === 'promotions' && (
        <div className="rounded-xl border border-gray-200 bg-white p-4">
          <h4 className="text-sm font-bold text-gray-900 mb-3 text-left">Promotions &amp; adverts</h4>
          {listings.length === 0 ? (
            <p className="text-sm text-gray-500">No promotions listed yet.</p>
          ) : (
            <ul className="space-y-2">
              {listings.map((item) => (
                <li
                  key={item.id || item.slug || item.title}
                  className="flex items-center gap-3 p-2 rounded-lg border border-gray-100"
                >
                  {(item.images?.[0]?.image_path || item.image) && (
                    <img
                      src={
                        resolveStorageUrl(item.images?.[0]?.image_path || item.image) ||
                        item.image
                      }
                      alt=""
                      className="h-12 w-12 rounded object-cover bg-gray-100"
                    />
                  )}
                  <div className="min-w-0">
                    <p className="text-sm font-semibold text-gray-900 truncate">
                      {item.title || item.name || 'Promotion'}
                    </p>
                    <p className="text-xs text-gray-500">
                      {item.category_name || item.advert_type || 'Advert'}
                    </p>
                  </div>
                </li>
              ))}
            </ul>
          )}
          {social && (
            <Link
              to={socialUrl}
              className="inline-flex mt-4 text-sm font-semibold text-indigo-700 hover:underline"
            >
              See live updates on Social Hub →
            </Link>
          )}
        </div>
      )}

      {tab === 'packages' && (
        <div className="rounded-xl border border-gray-200 bg-white p-4">
          <h4 className="text-sm font-bold text-gray-900 mb-3 text-left">Packages &amp; add-ons</h4>
          {packages.length === 0 ? (
            <p className="text-sm text-gray-500">
              No packages published yet. Businesses can add packages from their dashboard.
            </p>
          ) : (
            <div className="grid sm:grid-cols-2 gap-3">
              {packages.map((pkg, i) => (
                <div key={pkg.id || pkg.name || i} className="border border-gray-100 rounded-lg p-3">
                  <p className="font-semibold text-gray-900">{pkg.name || pkg.title}</p>
                  {pkg.description && (
                    <p className="text-sm text-gray-600 mt-1">{pkg.description}</p>
                  )}
                  {pkg.price != null && (
                    <p className="text-sm font-bold text-indigo-700 mt-2">${pkg.price}</p>
                  )}
                </div>
              ))}
            </div>
          )}
        </div>
      )}

      {tab === 'reviews' && (
        <div className="rounded-xl border border-gray-200 bg-white p-4">
          <div className="flex items-center gap-2 mb-3">
            <FaStar className="text-amber-500" />
            <h4 className="text-sm font-bold text-gray-900 text-left">Reviews &amp; ratings</h4>
            {rating > 0 && (
              <span className="text-sm font-semibold text-gray-700">{rating.toFixed(1)}</span>
            )}
          </div>
          {reviews.length === 0 ? (
            <p className="text-sm text-gray-500">No public reviews yet.</p>
          ) : (
            <ul className="space-y-3">
              {reviews.map((r, i) => (
                <li key={r.id || i} className="border-b border-gray-100 pb-3 last:border-0">
                  <p className="text-sm font-semibold text-gray-900">
                    {r.author_name || r.user_name || 'Customer'}
                  </p>
                  <p className="text-sm text-gray-600 mt-1">{r.comment || r.body || r.review}</p>
                </li>
              ))}
            </ul>
          )}
        </div>
      )}
    </div>
  );
};

export default BusinessProfileTabs;
