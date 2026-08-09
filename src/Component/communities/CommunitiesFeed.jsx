import React, { forwardRef, useState } from 'react';
import { useSelector } from 'react-redux';
import { FaFire, FaClock, FaStar, FaMapMarkerAlt, FaSync, FaPen, FaImage } from 'react-icons/fa';
import AdThreadCard from './AdThreadCard';
import DiscussionThreadCard from './DiscussionThreadCard';

const SORT_OPTIONS = [
  { id: 'trending', label: 'Trending', icon: FaFire },
  { id: 'newest', label: 'Newest', icon: FaClock },
  { id: 'top-rated', label: 'Top', icon: FaStar },
  { id: 'near-me', label: 'Near me', icon: FaMapMarkerAlt },
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
  const { userDetail, logIn } = useSelector((store) => store.auth);
  const user = userDetail?.data || userDetail || {};
  const displayName =
    user.name ||
    [user.first_name, user.last_name].filter(Boolean).join(' ') ||
    user.username ||
    'You';

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
      body: 'Save discussions and listings to find them here later.',
      cta: null,
    },
    following: {
      title: 'Nothing from people you follow',
      body: 'Join communities and follow topics to fill this feed.',
      cta: 'Start a thread',
    },
    local: {
      title: 'No local posts yet',
      body: 'Posts near you will show up here when available.',
      cta: 'Start a thread',
    },
    default: {
      title: 'No posts yet',
      body: 'Share an update, start a discussion, or explore communities.',
      cta: 'Start a thread',
    },
  }[viewMode] || {
    title: 'No posts yet',
    body: 'Share an update, start a discussion, or explore communities.',
    cta: 'Start a thread',
  };

  return (
    <div className="communities-feed-column">
      <div className="communities-feed-sticky">
        <div className="communities-feed-toolbar">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
            <div>
              <h2 className="com-display text-lg text-slate-900">{title}</h2>
              <p className="text-xs text-slate-500">
                {loading ? 'Loading live posts…' : `${posts.length} posts`}
              </p>
            </div>

            {viewMode !== 'saved' && (
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
            )}
          </div>

          {showFilters && viewMode !== 'saved' && (
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

        {viewMode !== 'saved' && !hideComposer && (
          <button type="button" onClick={openCreate} className="communities-composer">
            <span className="communities-composer-avatar overflow-hidden">
              {logIn && user.avatar ? (
                <img src={user.avatar} alt="" className="w-full h-full object-cover" />
              ) : (
                displayName.charAt(0).toUpperCase()
              )}
            </span>
            <span className="communities-composer-placeholder">
              What&apos;s on your mind{logIn ? `, ${displayName.split(' ')[0]}` : ''}?
            </span>
            <span className="hidden sm:inline-flex items-center gap-1 text-xs text-slate-400 mr-1">
              <FaImage className="h-3 w-3" />
            </span>
            <span className="communities-composer-cta">
              <FaPen className="h-3 w-3" />
              Post
            </span>
          </button>
        )}
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
            <h3 className="com-display text-xl text-slate-900 mb-1">{emptyCopy.title}</h3>
            <p className="text-sm text-slate-500 mb-4">{emptyCopy.body}</p>
            {emptyCopy.cta && (
              <button type="button" onClick={openCreate} className="communities-sort-pill is-active">
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
