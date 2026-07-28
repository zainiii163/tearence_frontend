import React, { forwardRef, useState } from 'react';
import { FaFire, FaClock, FaStar, FaMapMarkerAlt, FaSync, FaPen } from 'react-icons/fa';
import AdThreadCard from './AdThreadCard';
import DiscussionThreadCard from './DiscussionThreadCard';

const SORT_OPTIONS = [
  { id: 'trending', label: 'Trending', icon: FaFire },
  { id: 'newest', label: 'Newest', icon: FaClock },
  { id: 'top-rated', label: 'Top', icon: FaStar },
  { id: 'near-me', label: 'Near me', icon: FaMapMarkerAlt },
];

const CommunitiesFeed = forwardRef(function CommunitiesFeed(
  {
    posts = [],
    loading,
    sortBy,
    onSortChange,
    showAdsOnly,
    onShowAdsOnlyChange,
    onRefresh,
  },
  feedScrollRef
) {
  const [showFilters, setShowFilters] = useState(false);

  const openCreate = () => {
    window.dispatchEvent(
      new CustomEvent('open-creation-modal', {
        detail: { type: 'discussion', data: null },
      })
    );
  };

  return (
    <div className="communities-feed-column">
      <div className="communities-feed-sticky">
        <div className="communities-feed-toolbar">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
            <div>
              <h2 className="com-display text-lg text-slate-900">Feed</h2>
              <p className="text-xs text-slate-500">
                {loading ? 'Loading…' : `${posts.length} live posts`}
              </p>
            </div>

            <div className="flex items-center gap-1.5 flex-wrap min-w-0">
              <div className="communities-sort-pills">
                {SORT_OPTIONS.map((option) => (
                  <button
                    key={option.id}
                    type="button"
                    onClick={() => onSortChange(option.id)}
                    className={`communities-sort-pill ${sortBy === option.id ? 'is-active' : ''}`}
                  >
                    <option.icon className="h-3 w-3" />
                    <span>{option.label}</span>
                  </button>
                ))}
              </div>

              <button
                type="button"
                onClick={() => setShowFilters((v) => !v)}
                className="communities-icon-btn"
              >
                Filter
              </button>
              <button
                type="button"
                onClick={onRefresh}
                className="communities-icon-btn"
                aria-label="Refresh"
              >
                <FaSync className="h-3 w-3" />
              </button>
            </div>
          </div>

          {showFilters && (
            <div className="mt-3 pt-3 border-t border-slate-100/80 flex items-center gap-2">
              <span className="text-xs text-slate-500">Show</span>
              <button
                type="button"
                onClick={() => onShowAdsOnlyChange(false)}
                className={`communities-sort-pill ${!showAdsOnly ? 'is-active' : ''}`}
              >
                All
              </button>
              <button
                type="button"
                onClick={() => onShowAdsOnlyChange(true)}
                className={`communities-sort-pill ${showAdsOnly ? 'is-active' : ''}`}
              >
                Ads only
              </button>
            </div>
          )}
        </div>

        <button type="button" onClick={openCreate} className="communities-composer">
          <span className="communities-composer-avatar">+</span>
          <span className="communities-composer-placeholder">Start a discussion…</span>
          <span className="communities-composer-cta">
            <FaPen className="h-3 w-3" />
            Post
          </span>
        </button>
      </div>

      <div ref={feedScrollRef} className="communities-feed-scroll">
        {loading ? (
          <div className="space-y-3 pb-6">
            {[1, 2, 3].map((i) => (
              <div key={i} className="communities-post-card p-5 animate-pulse">
                <div className="flex gap-3 mb-4">
                  <div className="w-10 h-10 rounded-full bg-slate-200" />
                  <div className="flex-1 space-y-2">
                    <div className="h-3 bg-slate-200 rounded w-1/3" />
                    <div className="h-3 bg-slate-100 rounded w-1/4" />
                  </div>
                </div>
                <div className="h-4 bg-slate-200 rounded w-3/4 mb-2" />
                <div className="h-3 bg-slate-100 rounded w-full mb-1" />
                <div className="h-3 bg-slate-100 rounded w-5/6" />
              </div>
            ))}
          </div>
        ) : posts.length > 0 ? (
          <div className="space-y-3 pb-8">
            {posts.map((item) => {
              const key = item.post_id || item.id;
              if (item.post_type === 'ad_thread' || item.advert_id) {
                return <AdThreadCard key={key} ad={item} />;
              }
              return <DiscussionThreadCard key={key} discussion={item} />;
            })}
          </div>
        ) : (
          <div className="communities-post-card text-center py-14 px-6">
            <h3 className="com-display text-xl text-slate-900 mb-1">No posts yet</h3>
            <p className="text-sm text-slate-500 mb-4">
              Be the first to start a discussion in this community.
            </p>
            <button type="button" onClick={openCreate} className="communities-sort-pill is-active">
              Start a thread
            </button>
          </div>
        )}
      </div>
    </div>
  );
});

export default CommunitiesFeed;
