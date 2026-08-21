import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { FaFire, FaHashtag, FaUserPlus } from 'react-icons/fa';
import { communitiesAPI } from '../../api/communities';
import { useAuthRedirect } from '../../hooks/useAuthRedirect';

const formatCount = (n) => {
  const num = Number(n) || 0;
  if (num >= 1000) return `${(num / 1000).toFixed(1).replace(/\.0$/, '')}k`;
  return String(num);
};

/**
 * Vehicle Hub right rail — Trending Now + Suggested people/communities.
 */
const CommunitiesRightRail = ({ topics = [] }) => {
  const { requireAuthModal } = useAuthRedirect();
  const [trending, setTrending] = useState([]);
  const [loading, setLoading] = useState(true);
  const [joiningId, setJoiningId] = useState(null);
  const [message, setMessage] = useState('');

  const loadTrending = async () => {
    try {
      const res = await communitiesAPI.getTrendingCommunities(6);
      const list = res?.data?.data || res?.data || [];
      setTrending(Array.isArray(list) ? list.slice(0, 5) : []);
    } catch {
      setTrending([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadTrending();
  }, []);

  const handleJoin = async (community) => {
    const id = community.community_id || community.id;
    if (!requireAuthModal('/communities', 'You must be logged in to follow communities.')) {
      return;
    }
    setJoiningId(id);
    setMessage('');
    try {
      await communitiesAPI.joinCommunity(id);
      setTrending((prev) =>
        prev.map((c) =>
          (c.community_id || c.id) === id
            ? {
                ...c,
                is_joined: true,
                members_count: (Number(c.members_count) || 0) + 1,
              }
            : c
        )
      );
      setMessage(`Following ${community.name}`);
    } catch (e) {
      const msg = e?.response?.data?.message || e?.message || 'Could not follow';
      if (String(msg).toLowerCase().includes('already')) {
        setTrending((prev) =>
          prev.map((c) =>
            (c.community_id || c.id) === id ? { ...c, is_joined: true } : c
          )
        );
        setMessage('Already following');
      } else {
        setMessage(msg);
      }
    } finally {
      setJoiningId(null);
      setTimeout(() => setMessage(''), 2500);
    }
  };

  const visibleTopics = topics.slice(0, 6);

  if (loading) {
    return (
      <div className="communities-rail communities-rail--fit space-y-2">
        <div className="communities-rail-panel p-3 animate-pulse h-40 shrink-0" />
        <div className="communities-rail-panel p-3 animate-pulse h-28 shrink-0" />
      </div>
    );
  }

  return (
    <div className="communities-rail communities-rail--fit social-right-rail">
      <div className="communities-rail-panel p-3 shrink-0">
        <div className="flex items-center gap-1.5 mb-2.5">
          <FaFire className="h-3.5 w-3.5 text-orange-500" />
          <h3 className="text-sm font-bold text-slate-900">Trending Now</h3>
        </div>

        {message && (
          <p className="mb-2 text-[10px] font-medium text-teal-700">{message}</p>
        )}

        {visibleTopics.length > 0 ? (
          <ul className="space-y-2 mb-3">
            {visibleTopics.map((topic) => (
              <li key={topic.id} className="social-trend-row">
                <span className="social-trend-hash">
                  <FaHashtag className="h-2.5 w-2.5" />
                  {String(topic.name || '').replace(/^#/, '')}
                </span>
                <span className="social-trend-meta">
                  {formatCount(topic.count)} posts today
                </span>
              </li>
            ))}
          </ul>
        ) : (
          <p className="text-[11px] text-slate-400 mb-3">
            Tags appear as the feed fills up.
          </p>
        )}

        <div className="flex items-center gap-1.5 mb-2 pt-2 border-t border-slate-100">
          <FaUserPlus className="h-3 w-3 text-teal-600" />
          <h3 className="text-xs font-bold text-slate-900">Suggested Follow</h3>
        </div>

        <div className="space-y-1">
          {trending.length === 0 ? (
            <p className="text-[11px] text-slate-400 py-1">No suggestions yet</p>
          ) : (
            trending.map((community) => {
              const id = community.community_id || community.id;
              return (
                <div key={id} className="social-suggest-row">
                  <Link
                    to={`/community/${community.slug || id}`}
                    className="social-suggest-avatar"
                    aria-hidden="true"
                  >
                    {(community.name || 'C').charAt(0).toUpperCase()}
                  </Link>
                  <Link
                    to={`/community/${community.slug || id}`}
                    className="min-w-0 flex-1"
                  >
                    <p className="text-xs font-semibold text-slate-800 truncate leading-tight">
                      {community.name}
                    </p>
                    <p className="text-[10px] text-slate-500 truncate">
                      {formatCount(community.members_count)} members
                      {community.region ? ` · ${community.region}` : ''}
                    </p>
                  </Link>
                  {community.is_joined ? (
                    <span className="social-follow-btn is-joined">Joined</span>
                  ) : (
                    <button
                      type="button"
                      disabled={joiningId === id}
                      onClick={() => handleJoin(community)}
                      className="social-follow-btn"
                    >
                      {joiningId === id ? '…' : 'Follow'}
                    </button>
                  )}
                </div>
              );
            })
          )}
        </div>

        <Link
          to="/communities/discover"
          className="mt-2.5 block text-center text-[11px] font-semibold text-teal-700 hover:underline"
        >
          View all recommendations
        </Link>
      </div>
    </div>
  );
};

export default CommunitiesRightRail;
