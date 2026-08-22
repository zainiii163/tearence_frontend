import React, { useEffect, useMemo, useState } from 'react';
import { Link } from 'react-router-dom';
import {
  FaStar,
  FaBullhorn,
  FaBriefcase,
  FaBuilding,
  FaArrowRight,
  FaUsers,
  FaMapMarkerAlt,
  FaGlobe,
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
import BusinessContactActions from './BusinessContactActions';
import BusinessSocialLinks from './BusinessSocialLinks';
import ReviewsPanel from '../shared/ReviewsPanel';

const TABS = [
  { id: 'about', label: 'About', icon: FaBuilding },
  { id: 'company-details', label: 'Company Details', icon: FaBuilding },
  { id: 'promotions', label: 'Promotions', icon: FaBullhorn },
  { id: 'careers', label: 'Careers', icon: FaBriefcase },
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

const extractPosts = (payload) => {
  if (!payload) return [];
  if (Array.isArray(payload)) return payload;
  if (Array.isArray(payload.data)) return payload.data;
  if (Array.isArray(payload?.data?.data)) return payload.data.data;
  return [];
};

const HoursList = ({ hours, compact = false }) => {
  if (!hours || typeof hours !== 'object') {
    return <p className="text-xs text-gray-500">Opening hours not listed yet.</p>;
  }
  return (
    <ul className={`space-y-1 ${compact ? 'text-xs' : 'text-sm'} text-gray-700`}>
      {DAY_ORDER.map((day) =>
        hours[day] ? (
          <li key={day} className="flex justify-between gap-2 border-b border-gray-100 py-1">
            <span className="font-medium capitalize text-gray-600">{day}</span>
            <span className="text-right">{hours[day]}</span>
          </li>
        ) : null
      )}
    </ul>
  );
};

/**
 * Clive: left = overview + posts/promos; right = contact, hours, booking actions.
 * Packages tab → Careers for job openings.
 */
const BusinessProfileTabs = ({
  business,
  listings = [],
  isOwner = false,
  onTabChange,
  hubCommunity = null,
}) => {
  const [tab, setTab] = useState('about');
  const [social, setSocial] = useState(hubCommunity || null);
  const [socialLoading, setSocialLoading] = useState(!hubCommunity);
  const [ensuring, setEnsuring] = useState(false);
  const [following, setFollowing] = useState(false);
  const [hubPosts, setHubPosts] = useState([]);

  const businessId = business?.id;

  useEffect(() => {
    if (hubCommunity) {
      setSocial(hubCommunity);
      setSocialLoading(false);
    }
  }, [hubCommunity]);

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
    let cancelled = false;
    (async () => {
      const communityId = social?.community_id || social?.slug;
      if (!communityId) {
        setHubPosts([]);
        return;
      }
      try {
        const res = await communitiesAPI.getPosts({
          community_id: communityId,
          per_page: 8,
          sort: 'newest',
        });
        if (!cancelled) setHubPosts(extractPosts(res?.data ?? res));
      } catch {
        if (!cancelled) setHubPosts([]);
      }
    })();
    return () => {
      cancelled = true;
    };
  }, [social]);

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

  const careers = Array.isArray(business?.careers)
    ? business.careers
    : Array.isArray(business?.jobs)
      ? business.jobs
      : Array.isArray(business?.job_openings)
        ? business.job_openings
        : Array.isArray(business?.vacancies)
          ? business.vacancies
          : Array.isArray(business?.category_profile?.careers)
            ? business.category_profile.careers
            : Array.isArray(business?.profile?.careers)
              ? business.profile.careers
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

  const bookingUrl =
    profile.booking_url || business?.booking_url || null;
  const bookingSlots = profile.booking_slots || business?.booking_slots || [];

  const overviewText = (
    business?.business_description ||
    profile.overview ||
    profile.summary ||
    ''
  ).trim();

  const hasContact =
    business?.business_owner ||
    business?.business_email ||
    business?.business_phone_number ||
    business?.business_website ||
    business?.business_address;

  return (
    <div className="mt-2">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 border-b border-slate-200 pb-3 mb-5">
        <div className="flex flex-wrap gap-1">
          {TABS.map((t) => {
            const Icon = t.icon;
            const active = tab === t.id;
            return (
              <button
                key={t.id}
                type="button"
                onClick={() => setTab(t.id)}
                className={`inline-flex items-center gap-1.5 px-3.5 py-2 text-sm font-semibold transition-colors rounded-lg ${
                  active
                    ? 'bg-indigo-600 text-white shadow-sm'
                    : 'text-slate-600 hover:bg-slate-100 hover:text-slate-900'
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
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 lg:gap-8 items-start">
          {/* Left: brief overview + posts / promotional adverts */}
          <div className="lg:col-span-8 space-y-4 text-sm text-gray-700">
            <section className="rounded-xl bg-slate-50/80 border border-slate-100 p-4 sm:p-5">
              <h2 className="text-lg font-bold text-slate-900 mb-2 text-left">
                Business Overview
              </h2>
              <p className="leading-relaxed text-sm text-slate-700 whitespace-pre-line">
                {overviewText
                  ? overviewText.length > 680
                    ? `${overviewText.slice(0, 680).trim()}…`
                    : overviewText
                  : 'No description published yet.'}
              </p>
            </section>

            <BusinessCategoryProfilePanel
              business={business}
              excludeSections={['opening_hours', 'support_hours', 'booking']}
            />

            {Array.isArray(profile.gallery) && profile.gallery.length > 0 && (
              <section className="rounded-xl bg-slate-50/80 border border-slate-100 p-4 sm:p-5">
                <h3 className="text-base font-bold text-slate-900 mb-3 text-left">Gallery</h3>
                <div className="grid grid-cols-2 sm:grid-cols-3 gap-2.5">
                  {profile.gallery.slice(0, 6).map((src, i) => {
                    const url = resolveStorageUrl(src) || src;
                    if (!url) return null;
                    return (
                      <img
                        key={`${url}-${i}`}
                        src={url}
                        alt=""
                        className="h-32 w-full rounded-xl object-cover bg-slate-200 ring-1 ring-slate-200/80"
                      />
                    );
                  })}
                </div>
              </section>
            )}

            {(hubPosts.length > 0 || listings.length > 0) && (
              <section className="rounded-xl bg-slate-50/80 border border-slate-100 p-4 sm:p-5">
                <h3 className="text-base font-bold text-slate-900 mb-3 text-left">
                  Posts &amp; promotional adverts
                </h3>

                {hubPosts.length > 0 && (
                  <ul className="space-y-2 mb-4">
                    {hubPosts.slice(0, 6).map((post) => (
                      <li
                        key={post.post_id || post.id}
                        className="flex items-start gap-3 p-2.5 rounded-lg border border-gray-100 hover:bg-slate-50"
                      >
                        <div className="min-w-0 flex-1">
                          <p className="text-sm font-semibold text-gray-900 truncate">
                            {post.title || 'Update'}
                          </p>
                          {post.content && (
                            <p className="text-xs text-gray-500 line-clamp-2 mt-0.5">
                              {post.content}
                            </p>
                          )}
                        </div>
                        {socialUrl && (
                          <Link
                            to={socialUrl}
                            className="text-[11px] font-semibold text-indigo-700 shrink-0"
                          >
                            View
                          </Link>
                        )}
                      </li>
                    ))}
                  </ul>
                )}

                {listings.length > 0 && (
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
                )}

                {social && (
                  <Link
                    to={socialUrl}
                    className="inline-flex mt-3 text-sm font-semibold text-indigo-700 hover:underline"
                  >
                    See all updates on Social Hub →
                  </Link>
                )}
              </section>
            )}

            {hubPosts.length === 0 && listings.length === 0 && (
              <section className="bg-white p-4 sm:p-5 rounded-lg border border-dashed border-gray-200">
                <p className="text-sm text-gray-500">
                  No posts or promotional adverts published yet.
                  {social ? (
                    <>
                      {' '}
                      <Link to={socialUrl} className="font-semibold text-indigo-700 hover:underline">
                        Visit Social Hub
                      </Link>
                    </>
                  ) : null}
                </p>
              </section>
            )}
          </div>

          {/* Right: contact + hours (after website, before address) + booking actions */}
          <aside className="lg:col-span-4">
            <div className="bg-slate-50/90 p-4 sm:p-5 rounded-xl border border-slate-200 space-y-4 lg:sticky lg:top-24 shadow-sm">
              <h3 className="text-base font-bold text-slate-900 border-b border-slate-200 pb-2 text-left">
                Contact &amp; details
              </h3>

              <div className="text-sm space-y-3 text-gray-700">
                {business?.business_owner && (
                  <p>
                    <strong className="text-gray-500 font-medium block text-xs uppercase tracking-wide mb-0.5">
                      Owner
                    </strong>
                    {business.business_owner}
                  </p>
                )}
                {business?.business_email && (
                  <p>
                    <strong className="text-gray-500 font-medium block text-xs uppercase tracking-wide mb-0.5">
                      Email
                    </strong>
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
                    <strong className="text-gray-500 font-medium block text-xs uppercase tracking-wide mb-0.5">
                      Phone
                    </strong>
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
                    <strong className="text-gray-500 font-medium block text-xs uppercase tracking-wide mb-0.5">
                      <span className="inline-flex items-center gap-1">
                        <FaGlobe className="h-3 w-3" /> Website
                      </span>
                    </strong>
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

                {/* Hours sit between Website and Address (Clive) */}
                <div className="pt-1">
                  <strong className="text-gray-500 font-medium block text-xs uppercase tracking-wide mb-1.5">
                    Opening hours
                  </strong>
                  <HoursList hours={hours} compact />
                </div>

                {(business?.business_address || business?.city || business?.country) && (
                  <p>
                    <strong className="text-gray-500 font-medium block text-xs uppercase tracking-wide mb-0.5">
                      <span className="inline-flex items-center gap-1">
                        <FaMapMarkerAlt className="h-3 w-3" /> Address
                      </span>
                    </strong>
                    {[business.business_address, business.city, business.country]
                      .filter(Boolean)
                      .join(', ')}
                  </p>
                )}

                {!hasContact && (
                  <p className="text-xs text-gray-500">Contact details not published yet.</p>
                )}
              </div>

              {(bookingSlots.length > 0 || bookingUrl) && (
                <div className="border-t border-gray-100 pt-4 space-y-2">
                  <p className="text-xs font-semibold uppercase tracking-wide text-gray-500">
                    Book with us
                  </p>
                  {bookingSlots.length > 0 && (
                    <div className="flex flex-wrap gap-1.5">
                      {bookingSlots.slice(0, 4).map((slot) => (
                        <span
                          key={slot}
                          className="inline-flex px-2 py-0.5 rounded-full text-[11px] font-medium bg-indigo-50 text-indigo-800 border border-indigo-100"
                        >
                          {slot}
                        </span>
                      ))}
                    </div>
                  )}
                </div>
              )}

              <div className="border-t border-gray-100 pt-4 space-y-3">
                <BusinessContactActions
                  business={business}
                  isOwner={isOwner}
                  social={social}
                  layout="stack"
                />
                <BusinessSocialLinks business={business} social={social} />
              </div>
            </div>
          </aside>
        </div>
      )}

      {tab === 'company-details' && (
        <div className="rounded-xl bg-slate-50/80 border border-slate-100 p-5 sm:p-6">
          <h2 className="text-xl font-bold mb-5 text-left text-slate-900">Company Details</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {[
              {
                label: 'Company name',
                value: business.business_company_name || business.business_name || '—',
              },
              {
                label: 'Registration Number',
                value:
                  business.business_company_no || business.business_company_registration || '—',
              },
              { label: 'Tax / VAT ID', value: business.vat_number || '—' },
              { label: 'DUNS', value: business.duns_number || '—' },
              {
                label: 'Incorporation Date',
                value: business.incorporation_date
                  ? new Date(business.incorporation_date).toLocaleDateString(undefined, {
                      day: 'numeric',
                      month: 'short',
                      year: 'numeric',
                    })
                  : '—',
              },
              {
                label: 'Headquarters',
                value:
                  [business.business_address, business.city, business.postal_code, business.country]
                    .filter(Boolean)
                    .join(', ') || '—',
              },
            ].map((row) => (
              <div
                key={row.label}
                className="rounded-lg bg-white border border-slate-100 px-4 py-3 shadow-sm"
              >
                <strong className="text-slate-500 font-medium text-xs uppercase tracking-wide">
                  {row.label}
                </strong>
                <p className="font-semibold text-slate-900 mt-1 text-sm">{row.value}</p>
              </div>
            ))}
          </div>
        </div>
      )}

      {tab === 'promotions' && (
        <div className="rounded-xl border border-gray-200 bg-white p-4">
          <h4 className="text-sm font-bold text-gray-900 mb-3 text-left">
            Promotions &amp; adverts
          </h4>
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

      {tab === 'careers' && (
        <div className="rounded-xl border border-gray-200 bg-white p-4 sm:p-5">
          <h4 className="text-base font-bold text-gray-900 mb-4 text-left">Careers</h4>
          {careers.length === 0 ? (
            <p className="text-sm text-gray-500">
              No openings listed yet.
              {isOwner
                ? ' Add careers from your business dashboard when ready.'
                : ' Check back later or contact the business directly.'}
            </p>
          ) : (
            <div className="space-y-3">
              {careers.map((job, i) => {
                const title = job.title || job.name || job.role || 'Open role';
                const href =
                  job.apply_url ||
                  job.application_link ||
                  job.url ||
                  job.link ||
                  null;
                return (
                  <div
                    key={job.id || title || i}
                    className="border border-gray-100 rounded-lg p-4 flex flex-col sm:flex-row sm:items-center gap-3 justify-between"
                  >
                    <div className="min-w-0">
                      <p className="font-semibold text-gray-900">{title}</p>
                      {(job.location || job.city || job.type || job.employment_type || job.work_type) && (
                        <p className="text-xs text-gray-500 mt-1">
                          {[
                            job.location ||
                              [job.city, job.country].filter(Boolean).join(', '),
                            job.type || job.employment_type || job.work_type,
                          ]
                            .filter(Boolean)
                            .join(' · ')}
                        </p>
                      )}
                      {job.description && (
                        <p className="text-sm text-gray-600 mt-2 line-clamp-3">{job.description}</p>
                      )}
                    </div>
                    {href ? (
                      <a
                        href={href}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="inline-flex items-center justify-center gap-1.5 px-4 py-2 rounded-lg bg-indigo-600 text-white text-sm font-semibold hover:bg-indigo-700 shrink-0"
                      >
                        Apply
                        <FaArrowRight className="h-3 w-3" />
                      </a>
                    ) : null}
                  </div>
                );
              })}
            </div>
          )}
        </div>
      )}

      {tab === 'reviews' && (
        <ReviewsPanel
          type="business"
          targetId={business?.id || business?.slug}
          title="Ratings & reviews"
          initialReviews={reviews}
          initialAverage={rating}
          initialCount={reviews.length}
        />
      )}
    </div>
  );
};

export default BusinessProfileTabs;
