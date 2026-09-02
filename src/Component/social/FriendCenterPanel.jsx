import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { friendshipsAPI } from '../../api/friendships';
import { communitiesAPI } from '../../api/communities';

/**
 * Dashboard panel showing:
 *  - the user's business business-social pages (Vehicles Hub social page status)
 *  - incoming friend requests (accept/decline)
 *  - list of friends
 */
const FriendCenterPanel = ({ userId }) => {
  const [incoming, setIncoming] = useState([]);
  const [friends, setFriends] = useState([]);
  const [businesses, setBusinesses] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  const loadSocial = async () => {
    setLoading(true);
    setError('');
    try {
      const [incRes, frRes, communitiesRes] = await Promise.all([
        friendshipsAPI.getIncoming().catch(() => ({ data: [] })),
        friendshipsAPI.getFriends().catch(() => ({ data: [] })),
        communitiesAPI.getUserCommunities().catch(() => ({ data: [] })),
      ]);
      setIncoming(Array.isArray(incRes.data) ? incRes.data : []);
      setFriends(Array.isArray(frRes.data) ? frRes.data : []);

      const myCommunities =
        communitiesRes?.data?.data || communitiesRes?.data || [];
      const ownedBusinessPages = (Array.isArray(myCommunities) ? myCommunities : []).filter(
        (c) => c && (c.business_id || c.is_business || c.type === 'business')
      );
      setBusinesses(ownedBusinessPages);
    } catch (e) {
      setError('Could not load social info.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadSocial();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const handleRespond = async (id, action) => {
    if (action === 'accept') await friendshipsAPI.acceptRequest(id);
    else await friendshipsAPI.declineRequest(id);
    loadSocial();
  };

  const resolveBizHref = (b) => `/community/${b.community_id || b.slug || b.id}`;

  return (
    <div className="bg-white rounded-xl border border-gray-200 shadow-sm overflow-hidden">
      <div className="px-4 py-3 border-b border-gray-100 flex items-center justify-between">
        <h3 className="font-semibold text-gray-900">Friends &amp; Social</h3>
        <Link
          to="/communities"
          className="text-sm text-orange-600 hover:text-orange-700 font-medium"
        >
          Open Social Hub →
        </Link>
      </div>

      {loading ? (
        <div className="p-5 text-sm text-gray-500">Loading…</div>
      ) : (
        <div className="divide-y divide-gray-100">
          {/* My Social Page */}
          <div className="px-4 py-3">
            <p className="text-sm font-medium text-gray-800 mb-2">My Social Page</p>
            {businesses.length === 0 ? (
              <div>
                <p className="text-xs text-gray-500 mb-2">
                  Create a business to get an automatic social page on the Vehicles Hub — friends can follow and
                  get your promotions.
                </p>
                <Link
                  to="/business/create"
                  className="text-xs px-3 py-1.5 rounded-lg bg-orange-500 hover:bg-orange-600 text-white font-medium inline-block"
                >
                  + Create Business &amp; Social Page
                </Link>
              </div>
            ) : (
              businesses.map((b) => (
                <div key={b.community_id || b.slug || b.id} className="flex items-center justify-between py-1.5">
                  <div className="flex items-center gap-2 min-w-0">
                    {b.cover_image || b.image ? (
                      <img
                        src={b.cover_image || b.image}
                        alt=""
                        className="w-8 h-8 rounded-full object-cover"
                        onError={(e) => (e.currentTarget.style.display = 'none')}
                      />
                    ) : (
                      <div className="w-8 h-8 rounded-full bg-orange-100 text-orange-600 flex items-center justify-center text-sm font-bold flex-shrink-0">
                        {(b.name || 'B').charAt(0).toUpperCase()}
                      </div>
                    )}
                    <div className="min-w-0">
                      <p className="text-sm text-gray-800 truncate">{b.name}</p>
                      <p className="text-xs text-green-600">Social page ready</p>
                    </div>
                  </div>
                  <Link
                    to={resolveBizHref(b)}
                    className="text-xs text-orange-600 hover:text-orange-700 font-medium whitespace-nowrap"
                  >
                    View
                  </Link>
                </div>
              ))
            )}
          </div>

          {/* Incoming friend requests */}
          <div className="px-4 py-3">
            <p className="text-sm font-medium text-gray-800 mb-2">
              Friend Requests{' '}
              {incoming.length > 0 && (
                <span className="ml-1 inline-block bg-red-500 text-white text-[10px] px-1.5 py-0.5 rounded-full">
                  {incoming.length}
                </span>
              )}
            </p>
            {incoming.length === 0 ? (
              <p className="text-xs text-gray-500">No pending requests.</p>
            ) : (
              incoming.map((item) => {
                const u = item.user || {};
                return (
                  <div
                    key={item.friendship?.id || item.user?.user_id}
                    className="flex items-center justify-between gap-2 py-2"
                  >
                    <div className="flex items-center gap-2 min-w-0">
                      <div className="w-8 h-8 rounded-full bg-gray-200 flex items-center justify-center text-sm font-semibold text-gray-600 flex-shrink-0">
                        {(u.name || '?').charAt(0).toUpperCase()}
                      </div>
                      <span className="text-sm text-gray-800 truncate">{u.name || 'User'}</span>
                    </div>
                    <div className="flex items-center gap-1.5 flex-shrink-0">
                      <button
                        onClick={() => handleRespond(item.friendship?.id, 'accept')}
                        className="text-xs px-2.5 py-1 rounded-lg bg-green-600 hover:bg-green-700 text-white font-medium"
                      >
                        Accept
                      </button>
                      <button
                        onClick={() => handleRespond(item.friendship?.id, 'decline')}
                        className="text-xs px-2.5 py-1 rounded-lg bg-gray-200 hover:bg-gray-300 text-gray-700 font-medium"
                      >
                        Decline
                      </button>
                    </div>
                  </div>
                );
              })
            )}
          </div>

          {/* Friends list */}
          <div className="px-4 py-3">
            <p className="text-sm font-medium text-gray-800 mb-2">
              Friends ({friends.length})
            </p>
            {friends.length === 0 ? (
              <p className="text-xs text-gray-500">You have no friends yet.</p>
            ) : (
              <div className="flex flex-wrap gap-2">
                {friends.map((item) => {
                  const u = item.user || {};
                  return (
                    <div
                      key={item.user?.user_id}
                      className="flex items-center gap-1.5 bg-gray-100 rounded-full pl-1 pr-3 py-1 text-sm text-gray-700"
                    >
                      <div className="w-6 h-6 rounded-full bg-gray-300 flex items-center justify-center text-xs font-semibold">
                        {(u.name || '?').charAt(0).toUpperCase()}
                      </div>
                      <span className="truncate max-w-[120px]">{u.name || 'User'}</span>
                    </div>
                  );
                })}
              </div>
            )}
          </div>

          {error && <div className="px-4 py-2 text-xs text-red-600">{error}</div>}
        </div>
      )}
    </div>
  );
};

export default FriendCenterPanel;
