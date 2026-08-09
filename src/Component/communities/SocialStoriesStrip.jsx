import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { FaPlus, FaUsers } from 'react-icons/fa';
import { communitiesAPI } from '../../api/communities';

const TONES = [
  'from-teal-400 to-cyan-600',
  'from-sky-400 to-blue-600',
  'from-amber-400 to-orange-500',
  'from-rose-400 to-red-600',
  'from-emerald-400 to-teal-600',
  'from-violet-400 to-indigo-600',
  'from-slate-500 to-slate-700',
];

/**
 * Community highlights strip — real trending communities (not fake stories).
 */
const SocialStoriesStrip = ({ onCreate }) => {
  const [communities, setCommunities] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let cancelled = false;
    (async () => {
      try {
        const res = await communitiesAPI.getTrendingCommunities(10);
        const list = res?.data?.data || res?.data || [];
        if (!cancelled) setCommunities(Array.isArray(list) ? list.slice(0, 10) : []);
      } catch {
        if (!cancelled) setCommunities([]);
      } finally {
        if (!cancelled) setLoading(false);
      }
    })();
    return () => {
      cancelled = true;
    };
  }, []);

  return (
    <div className="social-stories-strip mb-3">
      <div className="flex items-center justify-between px-1 mb-2">
        <p className="text-[11px] font-semibold uppercase tracking-wide text-slate-500">
          Communities
        </p>
        <Link
          to="/communities/discover"
          className="text-[11px] font-semibold text-teal-700 hover:underline"
        >
          See all
        </Link>
      </div>

      <div className="flex gap-3 overflow-x-auto hide-scrollbar pb-1 px-0.5">
        <button
          type="button"
          onClick={() => onCreate?.()}
          className="flex flex-col items-center gap-1.5 shrink-0 w-[4.35rem] group"
        >
          <span className="w-14 h-14 rounded-full p-[2px] bg-gradient-to-br from-slate-200 to-slate-300 group-hover:from-teal-300 group-hover:to-cyan-500 transition-all">
            <span className="w-full h-full rounded-full bg-white flex items-center justify-center text-slate-700">
              <FaPlus className="h-4 w-4 text-teal-600" />
            </span>
          </span>
          <span className="text-[10px] font-medium text-slate-600 truncate w-full text-center">
            Post
          </span>
        </button>

        {loading
          ? Array.from({ length: 6 }).map((_, i) => (
              <div key={i} className="flex flex-col items-center gap-1.5 shrink-0 w-[4.35rem]">
                <span className="w-14 h-14 rounded-full bg-slate-200 animate-pulse" />
                <span className="h-2 w-10 rounded bg-slate-100 animate-pulse" />
              </div>
            ))
          : communities.map((c, i) => {
              const id = c.community_id || c.id;
              const href = `/community/${c.slug || id}`;
              const cover = c.cover_image_url || c.cover_image;
              const tone = TONES[i % TONES.length];
              return (
                <Link
                  key={id}
                  to={href}
                  className="flex flex-col items-center gap-1.5 shrink-0 w-[4.35rem] group"
                  title={c.name}
                >
                  <span
                    className={`w-14 h-14 rounded-full p-[2px] bg-gradient-to-br ${tone} group-hover:scale-105 transition-transform`}
                  >
                    <span className="w-full h-full rounded-full bg-white overflow-hidden flex items-center justify-center text-slate-600 text-xs font-bold">
                      {cover ? (
                        <img src={cover} alt="" className="w-full h-full object-cover" />
                      ) : (
                        <FaUsers className="h-4 w-4 text-teal-600/80" />
                      )}
                    </span>
                  </span>
                  <span className="text-[10px] font-medium text-slate-600 truncate w-full text-center leading-tight">
                    {c.name}
                  </span>
                </Link>
              );
            })}
      </div>
    </div>
  );
};

export default SocialStoriesStrip;
