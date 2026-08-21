import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import {
  FaFire,
  FaHashtag,
  FaUserPlus,
  FaComments,
  FaUsers,
  FaEye,
} from 'react-icons/fa';
import { communitiesAPI } from '../../api/communities';
import { useAuthRedirect } from '../../hooks/useAuthRedirect';

const formatCount = (n) => {
  const num = Number(n) || 0;
  if (num >= 1000) return `${(num / 1000).toFixed(1).replace(/\.0$/, '')}k`;
  return String(num);
};

const extractList = (payload) => {
  if (!payload) return [];
  if (Array.isArray(payload)) return payload;
  if (Array.isArray(payload.data)) return payload.data;
  if (Array.isArray(payload?.data?.data)) return payload.data.data;
  return [];
};

/**
 * Right rail: trending posts + communities/groups + topics (X / Reddit / IG blend).
 */
const CommunitiesRightRail = ({ topics = [], onSelectPostSearch }) => {
  const { requireAuthModal } = useAuthRedirect();
  const [trendingCommunities, setTrendingCommunities] = useState([]);
  const [trendingPosts, setTrendingPosts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [joiningId, setJoiningId] = useState(null);
  const [message, setMessage] = useState('');

  useEffect(() => {
    let cancelled = false;
    (async () => {
      setLoading(true);
      try {
        const [commRes, postsRes] = await Promise.all([
          communitiesAPI.getTrendingCommunities(8).catch(() => null),
          communitiesAPI
            .getPosts({ sort: 'trending', per_page: 8 })
            .catch(() => null),
        ]);
        if (cancelled) return;
        const communities = extractList(commRes?.data ?? commRes).slice(0, 6);
        setTrendingCommunities(communities);
        setTrendingPosts(extractList(postsRes?.data ?? postsRes).slice(0, 5));
      } finally {
        if (!cancelled) setLoading(false);
      }
    })();
    return () => {
      cancelled = true;
    };
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
      setTrendingCommunities((prev) =>
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
        setTrendingCommunities((prev) =>
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
  const groups = trendingCommunities.filter(
    (c) =>
      String(c.name || '').toLowerCase().includes('group') ||
      String(c.scope || '').toLowerCase() === 'local' ||
      !c.business_id
  );
  const communitiesList =
    groups.length >= 3 ? groups.slice(0, 5) : trendingCommunities.slice(0, 5);

  if (loading) {
    return (
      <div className="communities-rail communities-rail--fit space-y-2">
        <div className="communities-rail-panel p-3 animate-pulse h-36 shrink-0" />
        <div className="communities-rail-panel p-3 animate-pulse h-40 shrink-0" />
        <div className="communities-rail-panel p-3 animate-pulse h-28 shrink-0" />
      </div>
    );
  }

  return (
    <div className="communities-rail communities-rail--fit social-right-rail">
      {/* Trending posts — Twitter/X + Reddit vibe */}
      <div className="communities-rail-panel p-3 shrink-0">
        <div className="flex items-center gap-1.5 mb-2.5">
          <FaFire className="h-3.5 w-3.5 text-orange-500" />
          <h3 className="text-sm font-bold text-slate-900">Trending posts</h3>
        </div>
        {trendingPosts.length === 0 ? (
          <p className="text-[11px] text-slate-400">No trending posts yet.</p>
        ) : (
          <ul className="space-y-2">
            {trendingPosts.map((post, idx) => {
              const id = post.post_id || post.id;
              const title = post.title || 'Untitled post';
              return (
                <li key={id || idx}>
                  <button
                    type="button"
                    className="social-trend-post w-full text-left"
                    onClick={() => onSelectPostSearch?.(title)}
                  >
                    <span className="social-trend-rank">{idx + 1}</span>
                    <span className="min-w-0 flex-1">
                      <span className="social-trend-post-title">{title}</span>
                      <span className="social-trend-post-meta">
                        <FaComments className="h-2.5 w-2.5" />
                        {formatCount(post.comments_count)}
                        <FaEye className="h-2.5 w-2.5 ml-1.5" />
                        {formatCount(post.views_count || post.reactions_count)}
                      </span>
                    </span>
                  </button>
                </li>
              );
            })}
          </ul>
        )}
      </div>

      {/* Topics */}
      {visibleTopics.length > 0 && (
        <div className="communities-rail-panel p-3 shrink-0">
          <div className="flex items-center gap-1.5 mb-2">
            <FaHashtag className="h-3 w-3 text-sky-600" />
            <h3 className="text-xs font-bold text-slate-900">Trending topics</h3>
          </div>
          <ul className="space-y-1.5">
            {visibleTopics.map((topic) => (
              <li key={topic.id}>
                <button
                  type="button"
                  className="social-trend-row w-full"
                  onClick={() =>
                    onSelectPostSearch?.(String(topic.name || '').replace(/^#/, ''))
                  }
                >
                  <span className="social-trend-hash">
                    <FaHashtag className="h-2.5 w-2.5" />
                    {String(topic.name || '').replace(/^#/, '')}
                  </span>
                  <span className="social-trend-meta">
                    {formatCount(topic.count)} posts
                  </span>
                </button>
              </li>
            ))}
          </ul>
        </div>
      )}

      {/* Communities & groups */}
      <div className="communities-rail-panel p-3">
        <div className="flex items-center gap-1.5 mb-2">
          <FaUsers className="h-3.5 w-3.5 text-teal-600" />
          <h3 className="text-sm font-bold text-slate-900">Groups &amp; communities</h3>
        </div>

        {message && (
          <p className="mb-2 text-[10px] font-medium text-teal-700">{message}</p>
        )}

        <div className="space-y-1">
          {communitiesList.length === 0 ? (
            <p className="text-[11px] text-slate-400 py-1">No communities yet</p>
          ) : (
            communitiesList.map((community) => {
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
                      {formatCount(community.members_count || community.posts_count)}{' '}
                      {community.members_count != null ? 'members' : 'posts'}
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
                      {joiningId === id ? '…' : 'Join'}
                    </button>
                  )}
                </div>
              );
            })
          )}
        </div>

        <div className="flex items-center gap-1.5 mb-1.5 mt-3 pt-2 border-t border-slate-100">
          <FaUserPlus className="h-3 w-3 text-violet-600" />
          <h3 className="text-xs font-bold text-slate-900">Suggested follow</h3>
        </div>
        <div className="space-y-1">
          {trendingCommunities.slice(0, 3).map((community) => {
            const id = community.community_id || community.id;
            return (
              <div key={`sug-${id}`} className="social-suggest-row">
                <Link
                  to={`/community/${community.slug || id}`}
                  className="social-suggest-avatar social-suggest-avatar--violet"
                  aria-hidden="true"
                >
                  {(community.name || 'C').charAt(0).toUpperCase()}
                </Link>
                <Link to={`/community/${community.slug || id}`} className="min-w-0 flex-1">
                  <p className="text-xs font-semibold text-slate-800 truncate leading-tight">
                    {community.name}
                  </p>
                  <p className="text-[10px] text-slate-500">Trending now</p>
                </Link>
              </div>
            );
          })}
        </div>

        <Link
          to="/communities/discover"
          className="mt-2.5 block text-center text-[11px] font-semibold text-teal-700 hover:underline"
        >
          Discover more
        </Link>
      </div>
    </div>
  );
};

export default CommunitiesRightRail;
