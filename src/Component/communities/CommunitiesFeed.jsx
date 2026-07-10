import React, { useState } from 'react';
import { FaFire, FaClock, FaStar, FaMapMarkerAlt, FaFilter, FaSync } from 'react-icons/fa';
import AdThreadCard from './AdThreadCard';
import DiscussionThreadCard from './DiscussionThreadCard';

const CommunitiesFeed = ({ feedData, loading, sortBy, onSortChange, showAdsOnly, onShowAdsOnlyChange, onRefresh }) => {
  const [showFilters, setShowFilters] = useState(false);

  const sortOptions = [
    { id: 'trending', label: 'Trending', icon: FaFire },
    { id: 'newest', label: 'Newest', icon: FaClock },
    { id: 'top-rated', label: 'Top Rated', icon: FaStar },
    { id: 'near-me', label: 'Near Me', icon: FaMapMarkerAlt },
  ];

  if (loading) {
    return (
      <div className="space-y-4">
        {[1, 2, 3].map((i) => (
          <div key={i} className="rounded-lg border bg-card p-6 animate-pulse">
            <div className="h-4 bg-muted rounded w-3/4 mb-4"></div>
            <div className="h-3 bg-muted rounded w-1/2 mb-3"></div>
            <div className="h-32 bg-muted rounded mb-4"></div>
            <div className="h-3 bg-muted rounded w-1/3"></div>
          </div>
        ))}
      </div>
    );
  }

  return (
    <div className="space-y-4">
      
      {/* Feed Header */}
      <div className="rounded-lg border bg-card text-card-foreground shadow-sm p-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <h2 className="text-lg font-semibold">Community Feed</h2>
          
          <div className="flex items-center gap-2 flex-wrap">
            {/* Sort */}
            <div className="flex items-center gap-1 border rounded-md p-1">
              {sortOptions.map((option) => (
                <button
                  key={option.id}
                  onClick={() => onSortChange(option.id)}
                  className={`flex items-center gap-2 px-3 py-1.5 rounded-md text-sm font-medium transition-colors ${
                    sortBy === option.id
                      ? 'bg-primary text-primary-foreground'
                      : 'hover:bg-accent'
                  }`}
                >
                  <option.icon className="h-3 w-3" />
                  <span className="hidden sm:inline">{option.label}</span>
                </button>
              ))}
            </div>

            {/* Filter Toggle */}
            <button
              onClick={() => setShowFilters(!showFilters)}
              className="inline-flex items-center gap-2 px-3 py-1.5 rounded-md text-sm font-medium border hover:bg-accent transition-colors"
            >
              <FaFilter className="h-3 w-3" />
              <span className="hidden sm:inline">Filter</span>
            </button>

            {/* Refresh */}
            <button
              onClick={onRefresh}
              className="inline-flex items-center gap-2 px-3 py-1.5 rounded-md text-sm font-medium border hover:bg-accent transition-colors"
            >
              <FaSync className="h-3 w-3" />
            </button>
          </div>
        </div>

        {/* Additional Filters */}
        {showFilters && (
          <div className="mt-4 pt-4 border-t space-y-3">
            <div className="flex items-center gap-2">
              <label className="text-sm font-medium">Show:</label>
              <div className="flex items-center gap-2">
                <button
                  onClick={() => onShowAdsOnlyChange(false)}
                  className={`px-3 py-1 rounded-md text-sm font-medium transition-colors ${
                    !showAdsOnly
                      ? 'bg-primary text-primary-foreground'
                      : 'hover:bg-accent'
                  }`}
                >
                  All
                </button>
                <button
                  onClick={() => onShowAdsOnlyChange(true)}
                  className={`px-3 py-1 rounded-md text-sm font-medium transition-colors ${
                    showAdsOnly
                      ? 'bg-primary text-primary-foreground'
                      : 'hover:bg-accent'
                  }`}
                >
                  Ads Only
                </button>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Feed Items */}
      {feedData?.data && feedData.data.length > 0 ? (
        <div className="space-y-4">
          {feedData.data.map((item) => {
            if (item.post_type === 'ad_thread' || item.advert_id) {
              return <AdThreadCard key={item.post_id} ad={item} />;
            } else {
              return <DiscussionThreadCard key={item.post_id} discussion={item} />;
            }
          })}
        </div>
      ) : (
        <div className="rounded-lg border bg-card text-card-foreground shadow-sm p-8 text-center">
          <div className="flex flex-col items-center gap-4">
            <div className="w-16 h-16 rounded-full bg-muted flex items-center justify-center">
              <FaFilter className="h-8 w-8 text-muted-foreground" />
            </div>
            <div>
              <h3 className="font-semibold mb-1">No posts yet</h3>
              <p className="text-sm text-muted-foreground">
                Be the first to start a discussion in this community!
              </p>
            </div>
          </div>
        </div>
      )}

    </div>
  );
};

export default CommunitiesFeed;
