import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { FaUsers, FaExternalLinkAlt, FaPlus } from 'react-icons/fa';
import toast from 'react-hot-toast';
import {
  ensureBusinessSocialPage,
  getBusinessSocialPage,
  socialHrefForCommunity,
} from '../../utils/businessSocial';
import { communitiesAPI } from '../../api/communities';

/**
 * Business dashboard: view / open Social Hub page for this business.
 */
const BusinessSocialDashboardPanel = ({ business }) => {
  const [social, setSocial] = useState(null);
  const [loading, setLoading] = useState(true);
  const [busy, setBusy] = useState(false);
  const [posts, setPosts] = useState([]);

  const businessId = business?.id;

  const load = async () => {
    if (!businessId) return;
    setLoading(true);
    try {
      const page = await getBusinessSocialPage(businessId);
      setSocial(page);
      if (page?.community_id || page?.slug) {
        try {
          const feed = await communitiesAPI.getPosts({
            community_id: page.community_id || page.slug,
            per_page: 5,
          });
          const rows = feed?.data?.data || feed?.data || feed || [];
          setPosts(Array.isArray(rows) ? rows : []);
        } catch {
          setPosts([]);
        }
      } else {
        setPosts([]);
      }
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    load();
  }, [businessId]);

  const handleEnsure = async () => {
    try {
      setBusy(true);
      const page = await ensureBusinessSocialPage(businessId);
      setSocial(page);
      toast.success(page ? 'Social Hub page ready' : 'Created');
      await load();
    } catch (e) {
      toast.error(e?.response?.data?.message || e?.message || 'Failed');
    } finally {
      setBusy(false);
    }
  };

  if (!businessId) return null;

  return (
    <div className="bg-white rounded-lg shadow p-6 mb-6 border border-violet-100">
      <div className="flex flex-wrap items-start justify-between gap-3 mb-4">
        <div>
          <p className="text-xs font-semibold uppercase tracking-wide text-violet-700">Social Hub</p>
          <h3 className="text-lg font-semibold text-gray-900">Your business social page</h3>
          <p className="text-sm text-gray-600 mt-1">
            Followers see your updates here. Linked from your public business page (Creator Feed &amp;
            Promotions).
          </p>
        </div>
        {!social ? (
          <button
            type="button"
            disabled={busy || loading}
            onClick={handleEnsure}
            className="inline-flex items-center gap-2 px-4 py-2 rounded-lg bg-violet-700 text-white text-sm font-bold hover:bg-violet-800 disabled:opacity-60"
          >
            <FaPlus />
            {busy ? 'Creating…' : 'Create Social Hub page'}
          </button>
        ) : (
          <Link
            to={socialHrefForCommunity(social)}
            className="inline-flex items-center gap-2 px-4 py-2 rounded-lg bg-violet-700 text-white text-sm font-bold hover:bg-violet-800"
          >
            Open page <FaExternalLinkAlt className="h-3 w-3" />
          </Link>
        )}
      </div>

      {loading ? (
        <div className="h-20 rounded-lg bg-gray-100 animate-pulse" />
      ) : !social ? (
        <p className="text-sm text-gray-500">
          No Social Hub page yet. Create one so customers can follow your business updates.
        </p>
      ) : (
        <div className="space-y-4">
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
            <div className="rounded-lg bg-violet-50 p-3">
              <p className="text-xs text-violet-700">Followers</p>
              <p className="text-xl font-bold text-gray-900">{social.followers_count ?? 0}</p>
            </div>
            <div className="rounded-lg bg-violet-50 p-3">
              <p className="text-xs text-violet-700">Members</p>
              <p className="text-xl font-bold text-gray-900">{social.members_count ?? 0}</p>
            </div>
            <div className="rounded-lg bg-violet-50 p-3">
              <p className="text-xs text-violet-700">Posts</p>
              <p className="text-xl font-bold text-gray-900">{social.posts_count ?? posts.length}</p>
            </div>
            <div className="rounded-lg bg-violet-50 p-3">
              <p className="text-xs text-violet-700 flex items-center gap-1">
                <FaUsers className="h-3 w-3" /> Public
              </p>
              <Link to={`/business/${business.slug || business.id}`} className="text-sm font-semibold text-violet-800 hover:underline">
                Business page
              </Link>
            </div>
          </div>
          <div>
            <p className="text-sm font-semibold text-gray-900 mb-2">Recent posts</p>
            {posts.length === 0 ? (
              <p className="text-sm text-gray-500">No posts yet — share an update from Social Hub.</p>
            ) : (
              <ul className="space-y-2">
                {posts.slice(0, 5).map((p) => (
                  <li key={p.post_id || p.id} className="text-sm text-gray-700 border-b border-gray-100 pb-2">
                    {p.title || p.content || p.body || 'Update'}
                  </li>
                ))}
              </ul>
            )}
          </div>
        </div>
      )}
    </div>
  );
};

export default BusinessSocialDashboardPanel;
