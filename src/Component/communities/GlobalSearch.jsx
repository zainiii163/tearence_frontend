import React, { useState, useEffect, useRef } from 'react';
import { Link } from 'react-router-dom';
import { FaSearch, FaTimes, FaUsers, FaComments } from 'react-icons/fa';
import { communitiesAPI } from '../../api/communities';

const GlobalSearch = ({ onSelectPostSearch, compact = false }) => {
  const [isOpen, setIsOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [communities, setCommunities] = useState([]);
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(false);
  const searchRef = useRef(null);
  const debounceRef = useRef(null);

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (searchRef.current && !searchRef.current.contains(event.target)) {
        setIsOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  useEffect(() => {
    clearTimeout(debounceRef.current);
    if (searchQuery.trim().length < 2) {
      setCommunities([]);
      setPosts([]);
      setLoading(false);
      return undefined;
    }
    setLoading(true);
    debounceRef.current = setTimeout(async () => {
      try {
        const res = await communitiesAPI.searchAll(searchQuery, { limit: 6 });
        setCommunities(res.communities || []);
        setPosts(res.posts || []);
        setIsOpen(true);
      } catch (e) {
        console.error(e);
        setCommunities([]);
        setPosts([]);
      } finally {
        setLoading(false);
      }
    }, 320);
    return () => clearTimeout(debounceRef.current);
  }, [searchQuery]);

  const applyFeedSearch = () => {
    onSelectPostSearch?.(searchQuery.trim());
    setIsOpen(false);
  };

  return (
    <div ref={searchRef} className={`relative w-full ${compact ? '' : ''}`}>
      <div className="relative">
        <FaSearch className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 h-3.5 w-3.5 text-slate-400 communities-search-icon" />
        <input
          type="search"
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          onFocus={() => searchQuery.length >= 2 && setIsOpen(true)}
          onKeyDown={(e) => {
            if (e.key === 'Enter') {
              e.preventDefault();
              applyFeedSearch();
            }
          }}
          placeholder="Search…"
          className="w-full pl-9 pr-9 py-2 text-sm rounded-lg border border-slate-200 bg-white text-slate-900 placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-300"
        />
        {searchQuery && (
          <button
            type="button"
            onClick={() => {
              setSearchQuery('');
              setCommunities([]);
              setPosts([]);
              onSelectPostSearch?.('');
            }}
            className="absolute right-2.5 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600"
            aria-label="Clear"
          >
            <FaTimes className="h-3.5 w-3.5" />
          </button>
        )}
      </div>

      {isOpen && searchQuery.trim().length >= 2 && (
        <div className="absolute z-50 mt-2 w-full rounded-xl border border-slate-200 bg-white shadow-xl overflow-hidden max-h-80 overflow-y-auto">
          {loading ? (
            <p className="px-4 py-3 text-xs text-slate-400">Searching…</p>
          ) : communities.length === 0 && posts.length === 0 ? (
            <div className="px-4 py-3">
              <p className="text-xs text-slate-400 mb-2">No matches</p>
              <button
                type="button"
                onClick={applyFeedSearch}
                className="text-xs font-semibold text-teal-700 hover:underline"
              >
                Search feed for “{searchQuery}”
              </button>
            </div>
          ) : (
            <>
              {communities.length > 0 && (
                <div className="p-2 border-b border-slate-100">
                  <p className="px-2 py-1 text-[10px] font-semibold uppercase tracking-wide text-slate-400">
                    Communities
                  </p>
                  {communities.map((c) => (
                    <Link
                      key={c.community_id || c.id}
                      to={`/community/${c.slug || c.community_id || c.id}`}
                      onClick={() => setIsOpen(false)}
                      className="flex items-center gap-2 px-2 py-2 rounded-lg hover:bg-slate-50"
                    >
                      <FaUsers className="h-3.5 w-3.5 text-teal-600 shrink-0" />
                      <div className="min-w-0">
                        <p className="text-sm font-medium text-slate-800 truncate">{c.name}</p>
                        <p className="text-[11px] text-slate-500">
                          {(c.members_count || 0).toLocaleString?.() || c.members_count} members
                        </p>
                      </div>
                    </Link>
                  ))}
                </div>
              )}
              {posts.length > 0 && (
                <div className="p-2">
                  <p className="px-2 py-1 text-[10px] font-semibold uppercase tracking-wide text-slate-400">
                    Discussions
                  </p>
                  {posts.map((p) => (
                    <button
                      key={p.post_id || p.id}
                      type="button"
                      onClick={() => {
                        onSelectPostSearch?.(p.title || searchQuery);
                        setIsOpen(false);
                      }}
                      className="w-full flex items-start gap-2 px-2 py-2 rounded-lg hover:bg-slate-50 text-left"
                    >
                      <FaComments className="h-3.5 w-3.5 text-cyan-600 shrink-0 mt-0.5" />
                      <div className="min-w-0">
                        <p className="text-sm font-medium text-slate-800 truncate">{p.title}</p>
                        <p className="text-[11px] text-slate-500 line-clamp-1">{p.content}</p>
                      </div>
                    </button>
                  ))}
                </div>
              )}
              <button
                type="button"
                onClick={applyFeedSearch}
                className="w-full px-4 py-2.5 text-xs font-semibold text-teal-700 bg-teal-50/80 hover:bg-teal-50 border-t border-slate-100"
              >
                Show all results in feed
              </button>
            </>
          )}
        </div>
      )}
    </div>
  );
};

export default GlobalSearch;
