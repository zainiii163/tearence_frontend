import React from 'react';
import { FaPlus } from 'react-icons/fa';

/**
 * Instagram-style stories / reels strip above the Social Hub feed.
 */
const SocialStoriesStrip = ({ onCreate }) => {
  const stories = [
    { id: 'you', label: 'Your story', create: true },
    { id: 'ads', label: 'Top ads', tone: 'from-amber-400 to-orange-500' },
    { id: 'jobs', label: 'Jobs', tone: 'from-blue-500 to-indigo-600' },
    { id: 'property', label: 'Property', tone: 'from-slate-600 to-amber-700' },
    { id: 'vehicles', label: 'Vehicles', tone: 'from-rose-500 to-red-700' },
    { id: 'local', label: 'Local', tone: 'from-emerald-500 to-teal-600' },
    { id: 'live', label: 'Live now', tone: 'from-fuchsia-500 to-purple-600' },
  ];

  return (
    <div className="social-stories-strip mb-3">
      <div className="flex gap-3 overflow-x-auto hide-scrollbar pb-1 px-0.5">
        {stories.map((s) => (
          <button
            key={s.id}
            type="button"
            onClick={() => s.create && onCreate?.()}
            className="flex flex-col items-center gap-1.5 shrink-0 w-[4.25rem]"
          >
            <span
              className={`w-14 h-14 rounded-full p-[2px] bg-gradient-to-br ${
                s.create
                  ? 'from-slate-200 to-slate-300'
                  : s.tone || 'from-sky-400 to-blue-600'
              }`}
            >
              <span className="w-full h-full rounded-full bg-white flex items-center justify-center text-slate-700 text-sm font-bold">
                {s.create ? <FaPlus className="h-4 w-4 text-blue-600" /> : s.label.charAt(0)}
              </span>
            </span>
            <span className="text-[10px] font-medium text-slate-600 truncate w-full text-center">
              {s.label}
            </span>
          </button>
        ))}
      </div>
    </div>
  );
};

export default SocialStoriesStrip;
