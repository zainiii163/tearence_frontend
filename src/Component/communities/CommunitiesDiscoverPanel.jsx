import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { FaUsers, FaCheckCircle } from 'react-icons/fa';
import { communitiesAPI } from '../../api/communities';
import { useAuthRedirect } from '../../hooks/useAuthRedirect';

const formatCount = (n) => {
  const num = Number(n) || 0;
  if (num >= 1000) return `${(num / 1000).toFixed(1).replace(/\.0$/, '')}k`;
  return String(num);
};

/**
 * Discover / My Groups grid — real communities from API.
 */
const CommunitiesDiscoverPanel = ({ mode = 'discover' }) => {
  const { requireAuth } = useAuthRedirect();
  const [communities, setCommunities] = useState([]);
  const [loading, setLoading] = useState(true);
  const [joiningId, setJoiningId] = useState(null);
  const [message, setMessage] = useState('');
  const [search, setSearch] = useState('');

  useEffect(() => {
    let cancelled = false;
    (async () => {
      setLoading(true);
      try {
        let res;
        if (mode === 'my-communities') {
          if (!requireAuth('/communities/my-communities', 'Log in to see your groups.')) {
            if (!cancelled) {
              setCommunities([]);
              setLoading(false);
            }
            return;
          }
          res = await communitiesAPI.getUserCommunities();
        } else {
          res = await communitiesAPI.getCommunities({
            per_page: 24,
            search: search || undefined,
            sort: 'members',
          });
        }
        const list =
          res?.data?.data || (Array.isArray(res?.data) ? res.data : []) || [];
        if (!cancelled) setCommunities(Array.isArray(list) ? list : []);
      } catch (e) {
        console.error(e);
        if (!cancelled) setCommunities([]);
      } finally {
        if (!cancelled) setLoading(false);
      }
    })();
    return () => {
      cancelled = true;
    };
    // requireAuth intentionally omitted — stable enough; avoid re-fetch loops
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [mode, search]);

  const handleJoin = async (community) => {
    const id = community.community_id || community.id;
    if (!requireAuth('/communities/discover', 'You must be logged in to join.')) return;
    setJoiningId(id);
    setMessage('');
    try {
      await communitiesAPI.joinCommunity(id);
      setCommunities((prev) =>
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
      const msg = e?.response?.data?.message || e?.message || 'Could not join';
      if (String(msg).toLowerCase().includes('already')) {
        setCommunities((prev) =>
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

  return (
    <div className="communities-discover">
      <div className="communities-feed-toolbar mb-3">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <div>
            <h2 className="com-display text-lg text-slate-900">
              {mode === 'my-communities' ? 'My Groups' : 'Discover Communities'}
            </h2>
            <p className="text-xs text-slate-500">
              {loading
                ? 'Loading…'
                : `${communities.length} ${mode === 'my-communities' ? 'groups' : 'communities'}`}
            </p>
          </div>
          {mode === 'discover' && (
            <input
              type="search"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search communities…"
              className="w-full sm:w-56 px-3 py-2 text-sm rounded-xl border border-slate-200 bg-white focus:outline-none focus:ring-2 focus:ring-teal-300"
            />
          )}
        </div>
        {message && (
          <p className="mt-2 text-xs font-medium text-teal-700">{message}</p>
        )}
      </div>

      {loading ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          {[1, 2, 3, 4].map((i) => (
            <div key={i} className="communities-post-card h-36 animate-pulse bg-slate-100" />
          ))}
        </div>
      ) : communities.length === 0 ? (
        <div className="communities-post-card text-center py-14 px-6">
          <FaUsers className="mx-auto h-8 w-8 text-slate-300 mb-2" />
          <h3 className="com-display text-xl text-slate-900 mb-1">
            {mode === 'my-communities' ? 'No groups yet' : 'No communities found'}
          </h3>
          <p className="text-sm text-slate-500 mb-4">
            {mode === 'my-communities'
              ? 'Join communities from Discover to see them here.'
              : 'Try a different search.'}
          </p>
          {mode === 'my-communities' && (
            <Link to="/communities/discover" className="communities-sort-pill is-active inline-flex">
              Discover communities
            </Link>
          )}
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pb-8">
          {communities.map((c) => {
            const id = c.community_id || c.id;
            const cover = c.cover_image_url || c.cover_image;
            return (
              <article key={id} className="communities-post-card overflow-hidden">
                <div className="h-20 bg-gradient-to-br from-teal-500/20 via-sky-400/15 to-slate-200 relative">
                  {cover && (
                    <img src={cover} alt="" className="absolute inset-0 w-full h-full object-cover" />
                  )}
                </div>
                <div className="p-4">
                  <div className="flex items-start justify-between gap-2 mb-2">
                    <div className="min-w-0">
                      <Link
                        to={`/community/${c.slug || id}`}
                        className="com-display text-base text-slate-900 hover:text-teal-800 line-clamp-1"
                      >
                        {c.name}
                      </Link>
                      <p className="text-xs text-slate-500 mt-0.5">
                        {formatCount(c.members_count)} members
                        {c.region ? ` · ${c.region}` : ''}
                        {c.is_verified ? (
                          <FaCheckCircle className="inline ml-1 h-2.5 w-2.5 text-teal-500" />
                        ) : null}
                      </p>
                    </div>
                    {c.is_joined || mode === 'my-communities' ? (
                      <span className="shrink-0 text-[10px] font-semibold px-2 py-1 rounded-full bg-slate-100 text-slate-600">
                        Joined
                      </span>
                    ) : (
                      <button
                        type="button"
                        disabled={joiningId === id}
                        onClick={() => handleJoin(c)}
                        className="shrink-0 text-[11px] font-semibold px-2.5 py-1 rounded-full bg-gradient-to-r from-teal-500 to-cyan-600 text-white disabled:opacity-60"
                      >
                        {joiningId === id ? '…' : 'Join'}
                      </button>
                    )}
                  </div>
                  {c.description && (
                    <p className="text-xs text-slate-600 line-clamp-2">{c.description}</p>
                  )}
                </div>
              </article>
            );
          })}
        </div>
      )}
    </div>
  );
};

export default CommunitiesDiscoverPanel;
