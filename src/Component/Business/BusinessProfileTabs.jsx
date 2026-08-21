import React, { useEffect, useMemo, useState } from 'react';
import { Link } from 'react-router-dom';
import {
  FaStar,
  FaBullhorn,
  FaBoxOpen,
  FaUsers,
  FaBuilding,
  FaArrowRight,
} from 'react-icons/fa';
import toast from 'react-hot-toast';
import {
  ensureBusinessSocialPage,
  getBusinessSocialPage,
  socialHrefForCommunity,
} from '../../utils/businessSocial';
import { communitiesAPI } from '../../api/communities';
import { resolveStorageUrl } from '../../utils/dashboardEditMappers';

const TABS = [
  { id: 'overview', label: 'Overview', icon: FaBuilding },
  { id: 'promotions', label: 'Promotions', icon: FaBullhorn },
  { id: 'packages', label: 'Packages', icon: FaBoxOpen },
  { id: 'reviews', label: 'Reviews', icon: FaStar },
];

/**
 * RecipesBible-style business profile tabs + Social Hub connection (Clive).
 */
const BusinessProfileTabs = ({
  business,
  listings = [],
  isOwner = false,
  overviewSlot = null,
  onTabChange,
}) => {
  const [tab, setTab] = useState('overview');
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

  return (
    <div className="mt-6">
      <div className="flex flex-wrap gap-2 border-b border-gray-200 pb-2 mb-4">
        {TABS.map((t) => {
          const Icon = t.icon;
          const active = tab === t.id;
          return (
            <button
              key={t.id}
              type="button"
              onClick={() => setTab(t.id)}
              className={`inline-flex items-center gap-2 px-3 py-2 rounded-lg text-sm font-semibold transition-colors ${
                active
                  ? 'bg-purple-600 text-white'
                  : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
              }`}
            >
              <Icon className="h-3.5 w-3.5" />
              {t.label}
            </button>
          );
        })}
      </div>

      <div className="rounded-xl border border-violet-200 bg-gradient-to-r from-violet-50 to-indigo-50 p-4 sm:p-5 mb-5">
        <div className="flex flex-col sm:flex-row sm:items-center gap-3 justify-between">
          <div>
            <p className="text-xs font-semibold uppercase tracking-wide text-violet-700">
              Social Hub
            </p>
            <h3 className="text-lg font-bold text-gray-900">Creator Feed &amp; Promotions</h3>
            <p className="text-sm text-gray-600 mt-1">
              Follow this business for photos, updates and promotions — same connection as venues on
              RecipesBible.
            </p>
            {!socialLoading && social && (
              <p className="text-xs text-gray-500 mt-1">
                {social.followers_count != null
                  ? `${social.followers_count} followers · `
                  : ''}
                {social.members_count != null ? `${social.members_count} members` : ''}
              </p>
            )}
          </div>
          <div className="flex flex-wrap gap-2 shrink-0">
            {social ? (
              <>
                <button
                  type="button"
                  disabled={following}
                  onClick={handleFollow}
                  className="inline-flex items-center gap-2 px-4 py-2.5 rounded-lg bg-white border border-violet-300 text-violet-800 text-sm font-bold hover:bg-violet-50"
                >
                  <FaUsers />
                  {following ? '…' : 'Follow'}
                </button>
                <Link
                  to={socialUrl}
                  className="inline-flex items-center gap-2 px-4 py-2.5 rounded-lg bg-violet-700 text-white text-sm font-bold hover:bg-violet-800"
                >
                  Open Social Hub
                  <FaArrowRight />
                </Link>
              </>
            ) : (
              <button
                type="button"
                disabled={ensuring || socialLoading}
                onClick={openOrCreateSocial}
                className="inline-flex items-center gap-2 px-4 py-2.5 rounded-lg bg-violet-700 text-white text-sm font-bold hover:bg-violet-800 disabled:opacity-60"
              >
                {ensuring
                  ? 'Opening…'
                  : isOwner
                    ? 'Create Social Hub page'
                    : 'Social Hub (coming soon)'}
              </button>
            )}
          </div>
        </div>
      </div>

      {tab === 'overview' && (
        <div className="space-y-4">
          {overviewSlot}
          {business?.business_description && (
            <div className="rounded-xl border border-gray-200 bg-white p-4">
              <h4 className="text-sm font-bold text-gray-900 mb-2">About</h4>
              <p className="text-sm text-gray-700 whitespace-pre-line">{business.business_description}</p>
            </div>
          )}
        </div>
      )}

      {tab === 'promotions' && (
        <div className="rounded-xl border border-gray-200 bg-white p-4">
          <h4 className="text-sm font-bold text-gray-900 mb-3">Promotions &amp; adverts</h4>
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
              className="inline-flex mt-4 text-sm font-semibold text-violet-700 hover:underline"
            >
              See live updates on Social Hub →
            </Link>
          )}
        </div>
      )}

      {tab === 'packages' && (
        <div className="rounded-xl border border-gray-200 bg-white p-4">
          <h4 className="text-sm font-bold text-gray-900 mb-3">Packages &amp; add-ons</h4>
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
                    <p className="text-sm font-bold text-purple-700 mt-2">${pkg.price}</p>
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
            <h4 className="text-sm font-bold text-gray-900">Reviews &amp; ratings</h4>
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
