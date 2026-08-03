import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Activity, Eye, TrendingUp, Crown, MapPin, Pause, Play } from 'lucide-react';
import sponsoredAdvertsAPI from '../../api/sponsoredAdvertsAPI';

/**
 * Clive: trending topics + live feed; no platform statistics counters on public page.
 */
const SponsoredActivityFeed = () => {
  const [activities, setActivities] = useState([]);
  const [trendingTopics, setTrendingTopics] = useState([]);
  const [trendingAdverts, setTrendingAdverts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [isPaused, setIsPaused] = useState(false);

  const loadData = async () => {
    try {
      const [feedRes, topicsRes] = await Promise.allSettled([
        sponsoredAdvertsAPI.getSiteFeed({ per_page: 10, page: 1 }),
        sponsoredAdvertsAPI.getTrendingTopics({ limit: 8 }),
      ]);

      if (feedRes.status === 'fulfilled' && feedRes.value?.success) {
        const rows = feedRes.value.data?.data || feedRes.value.data || [];
        const list = Array.isArray(rows) ? rows : [];
        setTrendingAdverts(list.slice(0, 5));
        setActivities(
          list.slice(0, 8).map((ad, i) => ({
            id: ad.id || i,
            title: ad.title,
            source: ad.source_label || 'Sponsored',
            country: ad.country,
            city: ad.city,
            href: ad.href,
            time: 'Recently',
          }))
        );
      }

      if (topicsRes.status === 'fulfilled' && topicsRes.value?.success) {
        setTrendingTopics(topicsRes.value.data || []);
      }
    } catch (err) {
      console.error('Error loading sponsored activity:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadData();
    if (isPaused) return undefined;
    const interval = setInterval(loadData, 30000);
    return () => clearInterval(interval);
  }, [isPaused]);

  if (loading) {
    return (
      <div className="bg-white rounded-xl border border-gray-200 p-6">
        <div className="animate-pulse h-32 bg-gray-100 rounded-lg" />
      </div>
    );
  }

  return (
    <div className="space-y-4">
      <div className="bg-white rounded-xl border border-gray-200 p-5">
        <div className="flex items-center gap-2 mb-3">
          <TrendingUp className="h-5 w-5 text-amber-600" />
          <h3 className="text-base font-semibold text-gray-900">Trending Topics</h3>
        </div>
        {trendingTopics.length > 0 ? (
          <div className="flex flex-wrap gap-2">
            {trendingTopics.map((topic, index) => (
              <span
                key={`${topic.name}-${index}`}
                className="inline-flex items-center gap-1 rounded-full border border-amber-100 bg-amber-50 px-2.5 py-1 text-xs font-medium text-amber-900"
              >
                <TrendingUp className="h-3 w-3" />
                {topic.name}
              </span>
            ))}
          </div>
        ) : (
          <p className="text-sm text-gray-500">Trending topics appear as sponsored posts go live.</p>
        )}

        {trendingAdverts.length > 0 && (
          <div className="mt-4 pt-4 border-t border-gray-100">
            <h4 className="text-sm font-semibold text-gray-900 mb-2">Trending Adverts</h4>
            <ul className="space-y-2">
              {trendingAdverts.map((ad) => (
                <li key={ad.id}>
                  <a
                    href={ad.href || `/sponsored-adverts/${ad.slug || ad.id}`}
                    className="block text-sm text-gray-800 hover:text-amber-700 truncate"
                  >
                    {ad.title}
                    {ad.source_label ? (
                      <span className="ml-1 text-xs text-gray-400">· {ad.source_label}</span>
                    ) : null}
                  </a>
                </li>
              ))}
            </ul>
          </div>
        )}
      </div>

      <div className="bg-white rounded-xl border border-gray-200 overflow-hidden">
        <div className="flex items-center justify-between px-5 py-4 border-b border-gray-100">
          <div className="flex items-center gap-2">
            <Activity className="h-5 w-5 text-amber-600" />
            <h3 className="text-base font-semibold text-gray-900">Live Feed</h3>
            <span className="inline-flex items-center gap-1 text-xs text-gray-500">
              <span className="h-2 w-2 rounded-full bg-green-500 animate-pulse" />
              Live
            </span>
          </div>
          <button
            type="button"
            onClick={() => setIsPaused((p) => !p)}
            className="text-gray-500 hover:text-gray-700"
            aria-label={isPaused ? 'Resume' : 'Pause'}
          >
            {isPaused ? <Play className="h-4 w-4" /> : <Pause className="h-4 w-4" />}
          </button>
        </div>

        <div className="max-h-80 overflow-y-auto p-3 space-y-2">
          <AnimatePresence>
            {activities.map((activity) => (
              <motion.a
                key={activity.id}
                href={activity.href || '#'}
                initial={{ opacity: 0, y: 6 }}
                animate={{ opacity: 1, y: 0 }}
                className="flex items-start gap-3 rounded-lg bg-amber-50/60 p-3 hover:bg-amber-50"
              >
                <div className="rounded-full bg-white p-2 text-amber-600">
                  <Crown className="h-4 w-4" />
                </div>
                <div className="min-w-0 flex-1">
                  <p className="text-sm font-medium text-gray-900 truncate">{activity.title}</p>
                  <p className="text-xs text-gray-500 mt-0.5">{activity.source}</p>
                  {(activity.country || activity.city) && (
                    <p className="text-xs text-gray-400 mt-1 flex items-center gap-1">
                      <MapPin className="h-3 w-3" />
                      {[activity.city, activity.country].filter(Boolean).join(', ')}
                    </p>
                  )}
                </div>
              </motion.a>
            ))}
          </AnimatePresence>
          {activities.length === 0 && (
            <p className="text-center text-sm text-gray-500 py-6">No sponsored activity yet</p>
          )}
        </div>
      </div>
    </div>
  );
};

export default SponsoredActivityFeed;
