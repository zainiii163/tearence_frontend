import React, { useEffect, useState, useMemo } from "react";
import { useDispatch, useSelector } from "react-redux";
import { getUserPostAnalytics } from "../slice/AnalyticsSlice";
import {
  FaChartLine,
  FaEye,
  FaHeart,
  FaDollarSign,
  FaCalendar,
  FaArrowUp,
  FaArrowDown,
  FaAd,
} from "react-icons/fa";

const PostAnalytics = () => {
  const dispatch = useDispatch();
  const customerId = useSelector((store) => 
    store.auth.customerId || 
    store.auth?.userDetail?.data?.customer_id ||
    localStorage.getItem("customer_id")
  );
  
  const [timeRange, setTimeRange] = useState("30d"); // 7d, 30d, 90d, all
  const { userPostAnalytics, loading } = useSelector((store) => store.analytics);

  useEffect(() => {
    if (!customerId) return;

    const fetchAnalytics = async () => {
      try {
        // Calculate date range
        const now = new Date();
        let startDate = null;
        
        if (timeRange === "7d") {
          startDate = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000);
        } else if (timeRange === "30d") {
          startDate = new Date(now.getTime() - 30 * 24 * 60 * 60 * 1000);
        } else if (timeRange === "90d") {
          startDate = new Date(now.getTime() - 90 * 24 * 60 * 60 * 1000);
        }

        const params = {};
        if (startDate) {
          params.start_date = startDate.toISOString().split('T')[0];
        }
        params.end_date = now.toISOString().split('T')[0];

        await dispatch(getUserPostAnalytics(params));
      } catch (error) {
        console.error("Error fetching analytics:", error);
      }
    };

    fetchAnalytics();
  }, [dispatch, customerId, timeRange]);

  // Transform backend analytics data to component format
  const analyticsData = useMemo(() => {
    if (!userPostAnalytics) {
      return {
        totalPosts: 0,
        activePosts: 0,
        paidPosts: 0,
        totalViews: 0,
        totalFavorites: 0,
        totalRevenue: 0,
        expiringSoon: 0,
        viewsThisMonth: 0,
        viewsLastMonth: 0,
        favoritesThisMonth: 0,
        favoritesLastMonth: 0,
      };
    }

    const overview = userPostAnalytics.overview || {};
    const trends = userPostAnalytics.daily_trends || [];
    
    // Calculate monthly views and favorites from trends
    const now = new Date();
    const thirtyDaysAgo = new Date(now.getTime() - 30 * 24 * 60 * 60 * 1000);
    const sixtyDaysAgo = new Date(now.getTime() - 60 * 24 * 60 * 60 * 1000);

    const viewsThisMonth = trends
      .filter(t => new Date(t.date) >= thirtyDaysAgo)
      .reduce((sum, t) => sum + (t.views || 0), 0);
    
    const viewsLastMonth = trends
      .filter(t => {
        const date = new Date(t.date);
        return date >= sixtyDaysAgo && date < thirtyDaysAgo;
      })
      .reduce((sum, t) => sum + (t.views || 0), 0);

    const favoritesThisMonth = trends
      .filter(t => new Date(t.date) >= thirtyDaysAgo)
      .reduce((sum, t) => sum + (t.favorites || 0), 0);
    
    const favoritesLastMonth = trends
      .filter(t => {
        const date = new Date(t.date);
        return date >= sixtyDaysAgo && date < thirtyDaysAgo;
      })
      .reduce((sum, t) => sum + (t.favorites || 0), 0);

    return {
      totalPosts: overview.total_listings || 0,
      activePosts: overview.active_listings || 0,
      paidPosts: overview.paid_listings || 0,
      totalViews: overview.total_views || 0,
      totalFavorites: overview.total_favorites || 0,
      totalRevenue: overview.total_revenue || 0,
      expiringSoon: overview.expiring_soon || 0,
      viewsThisMonth,
      viewsLastMonth,
      favoritesThisMonth,
      favoritesLastMonth,
    };
  }, [userPostAnalytics]);

  const viewsTrend = useMemo(() => {
    if (analyticsData.viewsLastMonth === 0) return { percent: 0, isUp: true };
    const percent = ((analyticsData.viewsThisMonth - analyticsData.viewsLastMonth) / analyticsData.viewsLastMonth) * 100;
    return { percent: Math.abs(percent).toFixed(1), isUp: percent >= 0 };
  }, [analyticsData.viewsThisMonth, analyticsData.viewsLastMonth]);

  const favoritesTrend = useMemo(() => {
    if (analyticsData.favoritesLastMonth === 0) return { percent: 0, isUp: true };
    const percent = ((analyticsData.favoritesThisMonth - analyticsData.favoritesLastMonth) / analyticsData.favoritesLastMonth) * 100;
    return { percent: Math.abs(percent).toFixed(1), isUp: percent >= 0 };
  }, [analyticsData.favoritesThisMonth, analyticsData.favoritesLastMonth]);

  const stats = [
    {
      label: "Total Posts",
      value: analyticsData.totalPosts,
      icon: <FaAd className="h-5 w-5" />,
      color: "bg-blue-500",
      trend: null,
    },
    {
      label: "Active Posts",
      value: analyticsData.activePosts,
      icon: <FaChartLine className="h-5 w-5" />,
      color: "bg-green-500",
      trend: null,
    },
    {
      label: "Total Views",
      value: analyticsData.totalViews.toLocaleString(),
      icon: <FaEye className="h-5 w-5" />,
      color: "bg-purple-500",
      trend: viewsTrend,
    },
    {
      label: "Total Favorites",
      value: analyticsData.totalFavorites.toLocaleString(),
      icon: <FaHeart className="h-5 w-5" />,
      color: "bg-red-500",
      trend: favoritesTrend,
    },
    {
      label: "Paid Posts",
      value: analyticsData.paidPosts,
      icon: <FaDollarSign className="h-5 w-5" />,
      color: "bg-yellow-500",
      trend: null,
    },
    {
      label: "Expiring Soon",
      value: analyticsData.expiringSoon,
      icon: <FaCalendar className="h-5 w-5" />,
      color: "bg-orange-500",
      trend: analyticsData.expiringSoon > 0 ? { percent: analyticsData.expiringSoon, isUp: false } : null,
    },
  ];

  return (
    <div className="rounded-lg border bg-card p-6">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h2 className="text-xl font-semibold">Post Analytics</h2>
          <p className="text-sm text-muted-foreground mt-1">
            Track performance of your posts and ads
          </p>
        </div>
        <select
          value={timeRange}
          onChange={(e) => setTimeRange(e.target.value)}
          className="flex h-9 rounded-md border border-input bg-background px-3 py-1 text-sm ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
        >
          <option value="7d">Last 7 days</option>
          <option value="30d">Last 30 days</option>
          <option value="90d">Last 90 days</option>
          <option value="all">All time</option>
        </select>
      </div>

      {/* Loading State */}
      {loading && (
        <div className="flex justify-center py-12">
          <div className="animate-spin rounded-full h-12 w-12 border-4 border-primary border-t-transparent"></div>
        </div>
      )}

      {/* Stats Grid */}
      {!loading && (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 mb-6">
          {stats.map((stat, index) => (
          <div
            key={index}
            className="rounded-lg border bg-muted/30 p-4 hover:bg-muted/50 transition-colors"
          >
            <div className="flex items-center justify-between">
              <div className="flex-1">
                <p className="text-sm text-muted-foreground mb-1">{stat.label}</p>
                <div className="flex items-baseline gap-2">
                  <p className="text-2xl font-bold">{stat.value}</p>
                  {stat.trend && (
                    <span className={`text-xs font-medium flex items-center gap-1 ${
                      stat.trend.isUp ? "text-green-600" : "text-red-600"
                    }`}>
                      {stat.trend.isUp ? (
                        <FaArrowUp className="h-3 w-3" />
                      ) : (
                        <FaArrowDown className="h-3 w-3" />
                      )}
                      {stat.trend.percent}%
                    </span>
                  )}
                </div>
              </div>
              <div className={`${stat.color} text-white p-3 rounded-lg`}>
                {stat.icon}
              </div>
            </div>
          </div>
        ))}
        </div>
      )}

      {/* Revenue Summary */}
      {!loading && analyticsData.totalRevenue > 0 && (
        <div className="rounded-lg border bg-gradient-to-r from-yellow-50 to-orange-50 p-4 mb-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-muted-foreground mb-1">Total Revenue from Paid Posts</p>
              <p className="text-2xl font-bold text-foreground">
                ${analyticsData.totalRevenue.toFixed(2)}
              </p>
            </div>
            <FaDollarSign className="h-8 w-8 text-yellow-600 opacity-50" />
          </div>
        </div>
      )}

      {/* Performance Summary */}
      {!loading && (
        <div className="rounded-lg border bg-card p-4">
        <h3 className="text-sm font-semibold mb-3">Performance Summary</h3>
        <div className="space-y-3">
          <div className="flex items-center justify-between text-sm">
            <span className="text-muted-foreground">Average Views per Post</span>
            <span className="font-medium">
              {analyticsData.totalPosts > 0 
                ? (analyticsData.totalViews / analyticsData.totalPosts).toFixed(1)
                : 0}
            </span>
          </div>
          <div className="flex items-center justify-between text-sm">
            <span className="text-muted-foreground">Average Favorites per Post</span>
            <span className="font-medium">
              {analyticsData.totalPosts > 0 
                ? (analyticsData.totalFavorites / analyticsData.totalPosts).toFixed(1)
                : 0}
            </span>
          </div>
          <div className="flex items-center justify-between text-sm">
            <span className="text-muted-foreground">Active Post Rate</span>
            <span className="font-medium">
              {analyticsData.totalPosts > 0 
                ? ((analyticsData.activePosts / analyticsData.totalPosts) * 100).toFixed(1)
                : 0}%
            </span>
          </div>
          <div className="flex items-center justify-between text-sm">
            <span className="text-muted-foreground">Paid Post Rate</span>
            <span className="font-medium">
              {analyticsData.totalPosts > 0 
                ? ((analyticsData.paidPosts / analyticsData.totalPosts) * 100).toFixed(1)
                : 0}%
            </span>
          </div>
        </div>
        </div>
      )}
    </div>
  );
};

export default PostAnalytics;
