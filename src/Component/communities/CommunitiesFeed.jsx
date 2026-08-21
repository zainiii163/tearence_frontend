import React, { forwardRef, useState } from 'react';
import { FaFire, FaClock, FaStar, FaMapMarkerAlt, FaSync } from 'react-icons/fa';
import AdThreadCard from './AdThreadCard';
import DiscussionThreadCard from './DiscussionThreadCard';

const SORT_OPTIONS = [
  { id: 'trending', label: 'Trending', icon: FaFire },
  { id: 'newest', label: 'Latest', icon: FaClock },
  { id: 'top-rated', label: 'Top', icon: FaStar },
  { id: 'near-me', label: 'Near you', icon: FaMapMarkerAlt },
];

const FEED_TITLES = {
  feed: 'Home',
  foryou: 'For You',
  following: 'Following',
  local: 'Local',
  saved: 'Saved',
  discover: 'Discover',
  'my-communities': 'My Groups',
  community: 'Community',
};

const CommunitiesFeed = forwardRef(function CommunitiesFeed(
  {
    posts = [],
    loading,
    sortBy,
    onSortChange,
    showAdsOnly,
    onShowAdsOnlyChange,
    onRefresh,
    viewMode = 'feed',
    communityName = null,
    hideComposer = false,
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

  const title =
    viewMode === 'community' && communityName
      ? communityName
      : FEED_TITLES[viewMode] || 'Feed';

  const emptyCopy = {
    saved: {
      title: 'No saved posts',
      body: 'Bookmark discussions to find them here later.',
      cta: null,
    },
    following: {
      title: 'Your following feed is empty',
      body: 'Join communities and follow topics to fill this stream.',
      cta: 'Start a post',
    },
    local: {
      title: 'No local posts yet',
      body: 'Posts near you will show up here when available.',
      cta: 'Start a post',
    },
    default: {
      title: 'Nothing here yet',
      body: 'Be the first to post a photo, poll, or discussion.',
      cta: 'Create a post',
    },
  }[viewMode] || {
    title: 'Nothing here yet',
    body: 'Be the first to post a photo, poll, or discussion.',
    cta: 'Create a post',
  };

  return (
    <div className="communities-feed-column social-feed">
      <div className="communities-feed-sticky">
        <div className="social-feed-tabs" role="tablist" aria-label="Sort feed">
          {viewMode !== 'saved' &&
            SORT_OPTIONS.map((option) => (
              <button
                key={option.id}
                type="button"
                role="tab"
                aria-selected={sortBy === option.id}
                onClick={() => onSortChange(option.id)}
                className={`social-feed-tab ${sortBy === option.id ? 'is-active' : ''}`}
              >
                <option.icon className="h-3 w-3" />
                {option.label}
              </button>
            ))}
          <div className="social-feed-tabs-actions">
            <button
              type="button"
              onClick={() => setShowFilters((v) => !v)}
              className="social-feed-icon-btn"
            >
              Filter
            </button>
            <button
              type="button"
              onClick={onRefresh}
              className="social-feed-icon-btn"
              aria-label="Refresh"
            >
              <FaSync className="h-3 w-3" />
            </button>
          </div>
        </div>

        {showFilters && viewMode !== 'saved' && (
          <div className="social-feed-filters">
            <button
              type="button"
              onClick={() => onShowAdsOnlyChange(false)}
              className={`social-feed-chip ${!showAdsOnly ? 'is-active' : ''}`}
            >
              All
            </button>
            <button
              type="button"
              onClick={() => onShowAdsOnlyChange(true)}
              className={`social-feed-chip ${showAdsOnly ? 'is-active' : ''}`}
            >
              Ads only
            </button>
            <span className="social-feed-count">
              {loading ? 'Loading…' : `${posts.length} in ${title}`}
            </span>
          </div>
        )}
      </div>

      <div ref={feedScrollRef} className="communities-feed-scroll">
        {loading ? (
          <div className="space-y-3 pb-24 sm:pb-6">
            {[1, 2, 3].map((i) => (
              <div key={i} className="communities-post-card p-5 animate-pulse">
                <div className="flex gap-3 mb-4">
                  <div className="w-11 h-11 rounded-full bg-slate-200" />
                  <div className="flex-1 space-y-2">
                    <div className="h-3 bg-slate-200 rounded w-1/3" />
                    <div className="h-3 bg-slate-100 rounded w-1/4" />
                  </div>
                </div>
                <div className="h-4 bg-slate-200 rounded w-3/4 mb-2" />
                <div className="h-40 bg-slate-100 rounded-xl mb-2" />
                <div className="h-3 bg-slate-100 rounded w-5/6" />
              </div>
            ))}
          </div>
        ) : posts.length > 0 ? (
          <div className="social-feed-list pb-24 sm:pb-8">
            {posts.map((item) => {
              const key = item.post_id || item.id;
              if (item.post_type === 'ad_thread' || item.advert_id) {
                return <AdThreadCard key={key} ad={item} />;
              }
              return <DiscussionThreadCard key={key} discussion={item} />;
            })}
          </div>
        ) : (
          <div className="communities-post-card text-center py-14 px-6 mb-24 sm:mb-0">
            <h3 className="text-xl font-bold text-slate-900 mb-1">{emptyCopy.title}</h3>
            <p className="text-sm text-slate-500 mb-4">{emptyCopy.body}</p>
            {emptyCopy.cta && !hideComposer && (
              <button type="button" onClick={openCreate} className="social-feed-chip is-active">
                {emptyCopy.cta}
              </button>
            )}
          </div>
        )}
      </div>
    </div>
  );
});

export default CommunitiesFeed;
