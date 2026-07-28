import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { FaFire, FaHashtag } from 'react-icons/fa';
import { communitiesAPI } from '../../api/communities';
import { useAuthRedirect } from '../../hooks/useAuthRedirect';

const formatCount = (n) => {
  const num = Number(n) || 0;
  if (num >= 1000) return `${(num / 1000).toFixed(1).replace(/\.0$/, '')}k`;
  return String(num);
};

/**
 * Right rail — fits fully on screen (no internal scroll).
 */
const CommunitiesRightRail = ({ topics = [] }) => {
  const { requireAuth } = useAuthRedirect();
  const [trending, setTrending] = useState([]);
  const [loading, setLoading] = useState(true);
  const [joiningId, setJoiningId] = useState(null);
  const [message, setMessage] = useState('');

  const loadTrending = async () => {
    try {
      const res = await communitiesAPI.getTrendingCommunities(4);
      const list = res?.data?.data || res?.data || [];
      setTrending(Array.isArray(list) ? list.slice(0, 4) : []);
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
    if (
      !requireAuth('/communities', 'You must be logged in to join a community.')
    ) {
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
      setMessage(`Joined ${community.name}`);
    } catch (e) {
      const msg =
        e?.response?.data?.message ||
        e?.message ||
        'Could not join community';
      if (String(msg).toLowerCase().includes('already')) {
        setTrending((prev) =>
          prev.map((c) =>
            (c.community_id || c.id) === id ? { ...c, is_joined: true } : c
          )
        );
        setMessage('Already a member');
      } else {
        setMessage(msg);
      }
    } finally {
      setJoiningId(null);
      setTimeout(() => setMessage(''), 2500);
    }
  };

  if (loading) {
    return (
      <div className="communities-rail communities-rail--fit space-y-2">
        <div className="communities-rail-panel p-3 animate-pulse h-36 shrink-0" />
        <div className="communities-rail-panel p-3 animate-pulse h-24 shrink-0" />
      </div>
    );
  }

  const visibleTopics = topics.slice(0, 8);

  return (
    <div className="communities-rail communities-rail--fit">
      <div className="communities-rail-panel p-2.5 shrink-0">
        <div className="flex items-center gap-1.5 mb-2">
          <FaFire className="h-3 w-3 text-orange-500" />
          <h3 className="text-xs font-semibold text-slate-900">Trending</h3>
        </div>

        {message && (
          <p className="mb-1.5 text-[10px] font-medium text-teal-700">{message}</p>
        )}

        <div className="space-y-0.5">
          {trending.length === 0 ? (
            <p className="text-[11px] text-slate-400 py-1">No communities yet</p>
          ) : (
            trending.map((community) => {
              const id = community.community_id || community.id;
              return (
                <div
                  key={id}
                  className="flex items-center justify-between gap-1.5 px-1.5 py-1.5 rounded-lg hover:bg-slate-50"
                >
                  <Link
                    to={`/community/${community.slug || id}`}
                    className="min-w-0 flex-1"
                  >
                    <p className="text-xs font-medium text-slate-800 truncate leading-tight">
                      {community.name}
                    </p>
                    <p className="text-[10px] text-slate-500 truncate">
                      {formatCount(community.members_count)} members
                      {community.region ? ` · ${community.region}` : ''}
                    </p>
                  </Link>
                  {community.is_joined ? (
                    <span className="shrink-0 text-[10px] font-semibold px-2 py-0.5 rounded-full bg-slate-100 text-slate-600">
                      Joined
                    </span>
                  ) : (
                    <button
                      type="button"
                      disabled={joiningId === id}
                      onClick={() => handleJoin(community)}
                      className="shrink-0 text-[10px] font-semibold px-2 py-0.5 rounded-full bg-gradient-to-r from-teal-500 to-cyan-600 text-white disabled:opacity-60"
                    >
                      {joiningId === id ? '…' : 'Join'}
                    </button>
                  )}
                </div>
              );
            })
          )}
        </div>

        <Link
          to="/communities/discover"
          className="mt-2 block text-center text-[11px] font-medium text-teal-700 hover:underline"
        >
          Browse all
        </Link>
      </div>

      <div className="communities-rail-panel p-2.5 flex-1 min-h-0 overflow-hidden">
        <div className="flex items-center gap-1.5 mb-2">
          <FaHashtag className="h-3 w-3 text-blue-500" />
          <h3 className="text-xs font-semibold text-slate-900">Topics</h3>
        </div>

        {visibleTopics.length === 0 ? (
          <p className="text-[11px] text-slate-400 py-1">Tags appear as posts load</p>
        ) : (
          <div className="flex flex-wrap gap-1">
            {visibleTopics.map((topic) => (
              <span key={topic.id} className="communities-topic-chip">
                {topic.name}
                <span className="opacity-50 ml-1">{topic.count}</span>
              </span>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default CommunitiesRightRail;
