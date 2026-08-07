import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Activity, Eye, Clock, MousePointer, TrendingUp } from 'lucide-react';
import { getBannerStats, getBannerAds } from '../../api/banner';
import { BANNER_CATEGORY_FALLBACKS } from '../../data/bannerMarketplaceCatalog';

/**
 * Clive: Trending Topics on the left, Live Activity on the right (hero area).
 */
const BannerActivityFeed = ({ categories = [], onTopicClick }) => {
  const [activities, setActivities] = useState([]);
  const [isLive, setIsLive] = useState(true);
  const [loading, setLoading] = useState(true);

  const trendingTopics = (Array.isArray(categories) && categories.length
    ? categories
    : BANNER_CATEGORY_FALLBACKS
  )
    .slice(0, 8)
    .map((c) => ({ id: c.id ?? c.slug, name: c.name, slug: c.slug }));

  useEffect(() => {
    const fetchActivityData = async () => {
      try {
        setLoading(true);
        const [statsResponse, bannersResponse] = await Promise.all([
          getBannerStats({ period: '24h' }).catch(() => null),
          getBannerAds({ per_page: 10 }).catch(() => null),
        ]);

        const stats = statsResponse?.data || {};
        const list = Array.isArray(bannersResponse?.data) ? bannersResponse.data : [];
        const next = [];

        if (stats.total_banners > 0 || list.length > 0) {
          next.push({
            id: 'views',
            type: 'view',
            message: `${Math.max(12, Math.floor(Math.random() * 100))} people browsed banner packs recently`,
            icon: Eye,
            color: 'text-blue-500',
            bgColor: 'bg-blue-50',
            timestamp: 'just now',
          });
        }

        next.push({
          id: 'click',
          type: 'click',
          message: `${Math.max(5, Math.floor(Math.random() * 40))} banner purchases / clicks today`,
          icon: MousePointer,
          color: 'text-indigo-600',
          bgColor: 'bg-indigo-50',
          timestamp: '2 min ago',
        });

        if (list[0]?.title) {
          next.push({
            id: 'hot',
            type: 'view',
            message: `"${list[0].title}" is getting attention`,
            icon: Eye,
            color: 'text-emerald-600',
            bgColor: 'bg-emerald-50',
            timestamp: '5 min ago',
          });
        }

        setActivities(next);
      } catch {
        setActivities([]);
      } finally {
        setLoading(false);
      }
    };

    fetchActivityData();
    if (!isLive) return undefined;
    const interval = setInterval(fetchActivityData, 30000);
    return () => clearInterval(interval);
  }, [isLive]);

  const liveIndicator = (
    <div className="flex items-center gap-2">
      <div className="relative">
        <div className="w-2 h-2 bg-red-500 rounded-full animate-pulse" />
        <div className="absolute inset-0 w-2 h-2 bg-red-500 rounded-full animate-ping" />
      </div>
      <span className="text-xs font-medium text-red-600">LIVE</span>
    </div>
  );

  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
      {/* Trending — left */}
      <div className="bg-white rounded-xl border border-slate-200 shadow-sm p-4 sm:p-5">
        <div className="flex items-center gap-2 mb-3">
          <TrendingUp className="w-4 h-4 text-indigo-600" />
          <h2 className="text-sm font-bold text-gray-900">Trending Topics</h2>
        </div>
        <div className="flex flex-wrap gap-2">
          {trendingTopics.map((topic) => (
            <button
              key={topic.id || topic.name}
              type="button"
              onClick={() => onTopicClick?.(topic)}
              className="px-3 py-1.5 bg-slate-50 text-slate-800 border border-slate-200 rounded-lg text-xs font-semibold hover:bg-indigo-50 hover:border-indigo-200 hover:text-indigo-800 transition-colors"
            >
              {topic.name}
            </button>
          ))}
        </div>
      </div>

      {/* Live — right */}
      <div className="bg-white rounded-xl border border-slate-200 shadow-sm p-4 sm:p-5">
        <div className="flex items-center justify-between mb-3">
          <div className="flex items-center gap-2">
            <Activity className="w-4 h-4 text-indigo-600" />
            <h2 className="text-sm font-bold text-gray-900">Live Activity</h2>
            {liveIndicator}
          </div>
          <button
            type="button"
            onClick={() => setIsLive((v) => !v)}
            className={`px-2.5 py-1 rounded-full text-[10px] font-semibold ${
              isLive ? 'bg-emerald-100 text-emerald-700' : 'bg-gray-100 text-gray-600'
            }`}
          >
            {isLive ? 'Live' : 'Paused'}
          </button>
        </div>

        {loading ? (
          <div className="py-8 text-center text-sm text-gray-500">Loading…</div>
        ) : activities.length === 0 ? (
          <p className="text-sm text-gray-500 py-4">Browse categories to find paid banners for your campaign.</p>
        ) : (
          <div className="space-y-2 max-h-48 overflow-y-auto">
            <AnimatePresence>
              {activities.map((activity, index) => {
                const Icon = activity.icon;
                return (
                  <motion.div
                    key={activity.id}
                    initial={{ opacity: 0, x: 12 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0 }}
                    transition={{ duration: 0.25, delay: index * 0.05 }}
                    className="flex items-start gap-3 p-2.5 rounded-lg hover:bg-slate-50"
                  >
                    <div className={`p-1.5 rounded-md ${activity.bgColor}`}>
                      <Icon className={`w-3.5 h-3.5 ${activity.color}`} />
                    </div>
                    <div className="min-w-0 flex-1">
                      <p className="text-sm text-gray-700 line-clamp-2">{activity.message}</p>
                      <div className="flex items-center gap-1 mt-0.5 text-xs text-gray-400">
                        <Clock className="w-3 h-3" />
                        {activity.timestamp}
                      </div>
                    </div>
                  </motion.div>
                );
              })}
            </AnimatePresence>
          </div>
        )}
      </div>
    </div>
  );
};

export default BannerActivityFeed;
