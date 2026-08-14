import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Link } from "react-router-dom";
import affiliateService from "../services/AffiliateService";
import {
  FaBriefcase,
  FaBell,
  FaStar,
  FaUser,
  FaFileAlt,
  FaPlus,
  FaSearch,
  FaEdit,
  FaTrash,
  FaArrowUp,
  FaArrowDown,
  FaEye,
  FaChartLine,
  FaShoppingCart,
  FaDollarSign,
  FaTags,
  FaCalendarAlt,
  FaClock,
  FaCheckCircle,
  FaTimesCircle,
  FaExternalLinkAlt,
  FaHeart,
  FaCog,
  FaSignOutAlt,
  FaUsers,
  FaChartBar,
  FaDownload,
  FaTrophy,
  FaFire,
  FaGlobe,
  FaRocket,
  FaReceipt,
  FaCreditCard,
} from "react-icons/fa";
import { 
  FiDollarSign, 
  FiShoppingBag,
  FiPackage,
  FiFilter,
  FiTrendingUp,
  FiTrendingUp as HiOutlineOfficeBuilding
} from "react-icons/fi";

const UnifiedDashboard = () => {
  const dispatch = useDispatch();
  const { logIn, userDetail } = useSelector((store) => store.auth);
  const { dashboardData, loading } = useSelector((store) => store.dashboard);
  const { categories } = useSelector((store) => store.categories);
  const { storeData, businessStoreData } = useSelector((store) => store.store);
  
  const [activeTab, setActiveTab] = useState("overview");
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("all");
  const [dashboardType, setDashboardType] = useState("user"); // "user" or "affiliate"

  // Load dashboard data from backend
  useEffect(() => {
    if (logIn) {
      loadDashboardData();
    }
  }, [logIn, dashboardType]);

  const loadDashboardData = async () => {
    try {
      if (dashboardType === "affiliate") {
        // Load affiliate data
        const [businessOffers, userPosts, applications, notifications] = await Promise.all([
          affiliateService.getMyBusinessOffers({ per_page: 5 }),
          affiliateService.getMyUserPosts({ per_page: 5 }),
          affiliateService.getMyApplications({ per_page: 5 }),
          affiliateService.getNotifications({ per_page: 10 })
        ]);

        // Load analytics summary
        const analytics = await affiliateService.getAnalyticsSummary('all', '30days');

        // Load platform stats
        const platformStats = await affiliateService.getPlatformStats();

        setDashboardData({
          stats: {
            totalBusinessOffers: businessOffers.data?.total || 0,
            activeBusinessOffers: businessOffers.data?.data?.filter(offer => offer.status === 'approved').length || 0,
            totalUserPosts: userPosts.data?.total || 0,
            activeUserPosts: userPosts.data?.data?.filter(post => post.status === 'approved').length || 0,
            totalApplications: applications.data?.total || 0,
            pendingApplications: applications.data?.data?.filter(app => app.status === 'pending').length || 0,
            totalViews: (businessOffers.data?.data?.reduce((sum, offer) => sum + (offer.views || 0), 0) || 0) +
                      (userPosts.data?.data?.reduce((sum, post) => sum + (post.views || 0), 0) || 0),
            totalClicks: (businessOffers.data?.data?.reduce((sum, offer) => sum + (offer.clicks || 0), 0) || 0) +
                      (userPosts.data?.data?.reduce((sum, post) => sum + (post.clicks || 0), 0) || 0),
            totalRevenue: analytics.data?.totalRevenue || 0,
            unreadNotifications: notifications.data?.data?.filter(notif => !notif.read_at).length || 0
          },
          recentOffers: businessOffers.data?.data || [],
          recentPosts: userPosts.data?.data || [],
          applications: applications.data?.data || [],
          notifications: notifications.data?.data || [],
          analytics: analytics.data || {},
          platformStats: platformStats.data || {}
        });
      } else if (dashboardType === "user") {
        // Load user dashboard data (existing functionality)
        // Keep existing user dashboard logic
        setDashboardData({
          stats: {
            totalPosts: dashboardData?.stats?.totalPosts || 0,
            activePosts: dashboardData?.stats?.activePosts || 0,
            totalViews: dashboardData?.stats?.totalViews || 0,
            totalClicks: dashboardData?.stats?.totalClicks || 0,
            totalRevenue: dashboardData?.stats?.totalRevenue || 0,
          },
          recentPosts: dashboardData?.recentPosts || [],
          // ... other user dashboard data
        });
      }
    } catch (error) {
      console.error('Failed to load dashboard data:', error);
    }
  };

  const setDashboardData = (data) => {
    // This would typically dispatch to Redux, but for now we'll use local state
    // In a real implementation, this would be: dispatch(setDashboardData(data));
  };

  const stats = dashboardType === "affiliate" ? [
    { 
      label: "Business Offers", 
      value: dashboardData.stats?.totalBusinessOffers || 0, 
      icon: FaBriefcase, 
      color: "bg-blue-500",
      change: dashboardData.stats?.activeBusinessOffers || 0,
      changeType: "active"
    },
    { 
      label: "User Posts", 
      value: dashboardData.stats?.totalUserPosts || 0, 
      icon: FaFileAlt, 
      color: "bg-green-500",
      change: dashboardData.stats?.activeUserPosts || 0,
      changeType: "active"
    },
    { 
      label: "Applications", 
      value: dashboardData.stats?.totalApplications || 0, 
      icon: FaUsers, 
      color: "bg-purple-500",
      change: dashboardData.stats?.pendingApplications || 0,
      changeType: "pending"
    },
    { 
      label: "Total Views", 
      value: dashboardData.stats?.totalViews || 0, 
      icon: FaEye, 
      color: "bg-orange-500",
      change: "+12%",
      changeType: "increase"
    },
    { 
      label: "Total Clicks", 
      value: dashboardData.stats?.totalClicks || 0, 
      icon: FaExternalLinkAlt, 
      color: "bg-pink-500",
      change: "+8%",
      changeType: "increase"
    },
    { 
      label: "Revenue", 
      value: `$${(dashboardData.stats?.totalRevenue || 0).toFixed(2)}`, 
      icon: FaDollarSign, 
      color: "bg-emerald-500",
      change: "+15%",
      changeType: "increase"
    }
  ] : [
    // User dashboard stats
    { 
      label: "Total Posts", 
      value: dashboardData.stats?.totalPosts || 0, 
      icon: FaFileAlt, 
      color: "bg-blue-500"
    },
    { 
      label: "Active Posts", 
      value: dashboardData.stats?.activePosts || 0, 
      icon: FaCheckCircle, 
      color: "bg-green-500",
      change: dashboardData.stats?.activePosts || 0,
      changeType: "active"
    },
    { 
      label: "Total Views", 
      value: dashboardData.stats?.totalViews || 0,
      icon: FaEye,
      color: "bg-orange-500",
      change: "+12%",
      changeType: "increase"
    },
    {
      label: "Total Clicks",
      value: dashboardData.stats?.totalClicks || 0,
      icon: FaExternalLinkAlt,
      color: "bg-pink-500",
      change: "+8%",
      changeType: "increase"
    },
    {
      label: "Revenue",
      value: `$${(dashboardData.stats?.totalRevenue || 0).toFixed(2)}`,
      icon: FaDollarSign,
      color: "bg-emerald-500",
      change: "+15%",
      changeType: "increase"
    }
  ];

  const quickActions = dashboardType === "affiliate" ? [
    { 
      label: "Post Business Offer", 
      icon: FaBriefcase, 
      route: "/affiliates?postForm=true&mode=business", 
      color: "bg-blue-500" 
    },
    { 
      label: "Post User Content", 
      icon: FaFileAlt, 
      route: "/affiliates/links?postForm=true&mode=user", 
      color: "bg-green-500" 
    },
    { 
      label: "View Applications", 
      icon: FaUsers, 
      route: "/dashboard?tab=affiliates&sub=selling", 
      color: "bg-purple-500" 
    },
    { 
      label: "Analytics", 
      icon: FaChartBar, 
      route: "/dashboard?tab=affiliates&sub=earnings", 
      color: "bg-orange-500" 
    },
    { 
      label: "Settings", 
      icon: FaCog, 
      route: "/account", 
      color: "bg-gray-500" 
    }
  ] : [
    // User dashboard quick actions
    { 
      label: "Create New Post", 
      icon: FaPlus, 
      route: "/post-ad", 
      color: "bg-blue-500" 
    },
    { 
      label: "My Store", 
      icon: FiShoppingBag, 
      route: "/my-store", 
      color: "bg-green-500" 
    },
    { 
      label: "My Business", 
      icon: HiOutlineOfficeBuilding, 
      route: "/my-business", 
      color: "bg-purple-500" 
    },
    { 
      label: "Account Settings", 
      icon: FaCog, 
      route: "/account", 
      color: "bg-gray-500" 
    }
  ];

  const markNotificationRead = async (notificationId) => {
    try {
      await affiliateService.markNotificationRead(notificationId);
      setDashboardData(prev => ({
        ...prev,
        notifications: prev.notifications.map(notif => 
          notif.id === notificationId ? { ...notif, read_at: new Date().toISOString() } : notif
        )
      }));
    } catch (error) {
      console.error('Failed to mark notification as read:', error);
    }
  };

  const deleteBusinessOffer = async (offerId) => {
    try {
      await affiliateService.deleteBusinessOffer(offerId);
      setDashboardData(prev => ({
        ...prev,
        recentOffers: prev.recentOffers.filter(offer => offer.id !== offerId)
      }));
    } catch (error) {
      console.error('Failed to delete business offer:', error);
    }
  };

  const deleteUserPost = async (postId) => {
    try {
      await affiliateService.deleteUserPost(postId);
      setDashboardData(prev => ({
        ...prev,
        recentPosts: prev.recentPosts.filter(post => post.id !== postId)
      }));
    } catch (error) {
      console.error('Failed to delete user post:', error);
    }
  };

  const exportAnalytics = async () => {
    try {
      const data = await affiliateService.exportAnalytics('all', 'summary', 'csv');
      // Create download link
      const url = window.URL.createObjectURL(new Blob([data]));
      const link = document.createElement('a');
      link.href = url;
      link.download = `dashboard-analytics-${new Date().toISOString().split('T')[0]}.csv`;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      window.URL.revokeObjectURL(url);
    } catch (error) {
      console.error('Failed to export analytics:', error);
    }
  };

  if (!logIn) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <FaSignOutAlt className="h-16 w-16 text-gray-300 mx-auto mb-4" />
          <h2 className="text-2xl font-bold text-gray-900 mb-2">Please Login</h2>
          <p className="text-gray-600 mb-4">You need to be logged in to access dashboard.</p>
          <Link 
            to="/login" 
            className="inline-flex items-center px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
          >
            Go to Login
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white shadow-sm border-b">
        <div className="page-container">
          <div className="flex justify-between items-center py-4">
            <div className="flex items-center space-x-4">
              <div className="flex items-center space-x-3">
                <div className="w-10 h-10 bg-gradient-to-r from-blue-500 to-purple-600 rounded-full flex items-center justify-center">
                  <FaUser className="text-white" />
                </div>
                <div>
                  <h1 className="text-xl font-semibold text-gray-900">
                    {dashboardType === "affiliate" ? "Affiliate Dashboard" : "User Dashboard"}
                  </h1>
                  <p className="text-sm text-gray-500">{userDetail?.name || "User"}</p>
                </div>
              </div>
            </div>
            <div className="flex items-center space-x-4">
              <div className="relative">
                <button className="p-2 text-gray-400 hover:text-gray-600">
                  <FaBell className="h-5 w-5" />
                </button>
                {dashboardData.stats?.unreadNotifications > 0 && (
                  <span className="absolute -top-1 -right-1 h-5 w-5 bg-red-500 text-white text-xs rounded-full flex items-center justify-center">
                    {dashboardData.stats.unreadNotifications}
                  </span>
                )}
              </div>
              <Link to="/account" className="p-2 text-gray-400 hover:text-gray-600">
                <FaCog className="h-5 w-5" />
              </Link>
            </div>
          </div>
        </div>
      </div>

      {/* Dashboard Type Toggle */}
      <div className="page-container py-8">
        <div className="bg-white rounded-lg shadow p-6 mb-8">
          <div className="flex items-center justify-between">
            <h2 className="text-lg font-semibold text-gray-900">Dashboard Type</h2>
            <div className="flex space-x-4">
              <button
                onClick={() => setDashboardType("user")}
                className={`px-4 py-2 rounded-lg font-medium transition-colors ${
                  dashboardType === "user" 
                    ? "bg-blue-600 text-white" 
                    : "bg-gray-200 text-gray-700"
                }`}
              >
                <FiShoppingBag className="mr-2" />
                User Dashboard
              </button>
              <button
                onClick={() => setDashboardType("affiliate")}
                className={`px-4 py-2 rounded-lg font-medium transition-colors ${
                  dashboardType === "affiliate" 
                    ? "bg-blue-600 text-white" 
                    : "bg-gray-200 text-gray-700"
                }`}
              >
                <FaBriefcase className="mr-2" />
                Affiliate Dashboard
              </button>
            </div>
          </div>
        </div>

      {/* Welcome Section */}
      <div className="bg-gradient-to-r from-blue-600 to-purple-600 rounded-lg shadow-lg p-6 mb-8 text-white">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-2xl font-bold mb-2">Welcome back, {userDetail?.name || 'User'}!</h2>
            <p className="opacity-90">Here's what's happening with your {dashboardType === "affiliate" ? "affiliate business" : "user"} business today.</p>
          </div>
          <div className="flex items-center space-x-4">
            <div className="text-center">
              <FaRocket className="h-8 w-8 mb-2" />
              <p className="text-sm">Level {Math.floor(((dashboardData.stats?.totalBusinessOffers || 0) + (dashboardData.stats?.totalUserPosts || 0)) / 5) + 1}</p>
            </div>
            <div className="text-center">
              <FaTrophy className="h-8 w-8 mb-2" />
              <p className="text-sm">{dashboardData.stats?.totalRevenue > 0 ? 'Top Performer' : 'Rising Star'}</p>
            </div>
          </div>
        </div>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-6 gap-6 mb-8">
        {stats.map((stat, index) => (
          <div key={index} className="bg-white rounded-lg shadow p-6 hover:shadow-lg transition-shadow">
            <div className="flex items-center justify-between mb-4">
              <div className={`p-3 rounded-full ${stat.color} text-white`}>
                <stat.icon className="h-6 w-6" />
              </div>
              <div className="flex items-center text-sm">
                {stat.changeType === 'increase' && <FaArrowUp className="text-green-500 mr-1" />}
                {stat.changeType === 'decrease' && <FaArrowDown className="text-red-500 mr-1" />}
                <span className={stat.changeType === 'increase' ? 'text-green-500' : stat.changeType === 'decrease' ? 'text-red-500' : 'text-gray-500'}>
                  {stat.change}
                </span>
              </div>
            </div>
            <div>
              <p className="text-sm font-medium text-gray-600">{stat.label}</p>
              <p className="text-2xl font-semibold text-gray-900">{stat.value}</p>
            </div>
          </div>
        ))}
      </div>

      {/* Quick Actions */}
      <div className="bg-white rounded-lg shadow mb-8">
        <div className="px-6 py-4 border-b border-gray-200">
          <h2 className="text-lg font-semibold text-gray-900">Quick Actions</h2>
        </div>
        <div className="p-6">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4">
            {quickActions.map((action, index) => (
              <Link
                key={index}
                to={action.route}
                className={`flex items-center p-4 rounded-lg ${action.color} text-white hover:opacity-90 transition-opacity`}
              >
                <action.icon className="h-5 w-5 mr-3" />
                <span className="font-medium">{action.label}</span>
              </Link>
            ))}
          </div>
        </div>
      </div>

      {/* Recent Content Tabs */}
      <div className="bg-white rounded-lg shadow">
        <div className="border-b border-gray-200">
          <nav className="flex space-x-8 px-6" aria-label="Tabs">
            {['overview', 'offers', 'posts', 'applications', 'analytics'].map((tab) => (
              <button
                key={tab}
                onClick={() => setActiveTab(tab)}
                className={`py-4 px-1 border-b-2 font-medium text-sm capitalize ${
                  activeTab === tab
                    ? 'border-blue-500 text-blue-600'
                    : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                }`}
              >
                {tab === 'overview' && 'Overview'}
                {tab === 'offers' && 'Business Offers'}
                {tab === 'posts' && 'User Posts'}
                {tab === 'applications' && 'Applications'}
                {tab === 'analytics' && 'Analytics'}
              </button>
            ))}
          </nav>
        </div>

        <div className="p-6">
          {loading ? (
            <div className="text-center py-12">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto"></div>
              <p className="text-gray-500 mt-4">Loading dashboard data...</p>
            </div>
          ) : (
            <>
              {/* Overview Tab */}
              {activeTab === 'overview' && (
                <div className="space-y-6">
                  <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                    {/* Recent Business Offers */}
                    <div>
                      <h3 className="text-lg font-semibold text-gray-900 mb-4">Recent Business Offers</h3>
                      <div className="space-y-3">
                        {dashboardData.recentOffers?.slice(0, 3).map((offer, index) => (
                          <div key={index} className="border rounded-lg p-4 hover:bg-gray-50">
                            <div className="flex items-center justify-between">
                              <div className="flex-1">
                                <h4 className="font-medium text-gray-900">{offer.product_service_title}</h4>
                                <p className="text-sm text-gray-500">{offer.business_name}</p>
                                <div className="flex items-center space-x-4 mt-2 text-xs text-gray-500">
                                  <span className="flex items-center">
                                    <FaEye className="mr-1" /> {offer.views || 0}
                                  </span>
                                  <span className="flex items-center">
                                    <FaExternalLinkAlt className="mr-1" /> {offer.clicks || 0}
                                  </span>
                                  <span className="flex items-center">
                                    <FaCalendarAlt className="mr-1" /> {new Date(offer.created_at).toLocaleDateString()}
                                  </span>
                                </div>
                              </div>
                              <div className="flex items-center space-x-2">
                                <Link to={`/affiliates/offer/${offer.id}/edit`} className="p-2 text-gray-400 hover:text-blue-600">
                                  <FaEdit className="h-4 w-4" />
                                </Link>
                                <button 
                                  onClick={() => deleteBusinessOffer(offer.id)}
                                  className="p-2 text-gray-400 hover:text-red-600"
                                >
                                  <FaTrash className="h-4 w-4" />
                                </button>
                              </div>
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                    {/* Recent User Posts */}
                    <div>
                      <h3 className="text-lg font-semibold text-gray-900 mb-4">Recent User Posts</h3>
                      <div className="space-y-3">
                        {dashboardData.recentPosts?.slice(0, 3).map((post, index) => (
                          <div key={index} className="border rounded-lg p-4 hover:bg-gray-50">
                            <div className="flex items-center justify-between">
                              <div className="flex-1">
                                <h4 className="font-medium text-gray-900">{post.title}</h4>
                                <div className="flex items-center space-x-4 mt-2 text-xs text-gray-500">
                                  <span className="flex items-center">
                                    <FaEye className="mr-1" /> {post.views || 0}
                                  </span>
                                  <span className="flex items-center">
                                    <FaExternalLinkAlt className="mr-1" /> {post.clicks || 0}
                                  </span>
                                  <span className="flex items-center">
                                    <FaCalendarAlt className="mr-1" /> {new Date(post.created_at).toLocaleDateString()}
                                  </span>
                                </div>
                              </div>
                              <div className="flex items-center space-x-2">
                                <Link to={`/affiliates/post/${post.id}/edit`} className="p-2 text-gray-400 hover:text-blue-600">
                                  <FaEdit className="h-4 w-4" />
                                </Link>
                                <button 
                                  onClick={() => deleteUserPost(post.id)}
                                  className="p-2 text-gray-400 hover:text-red-600"
                                >
                                  <FaTrash className="h-4 w-4" />
                                </button>
                              </div>
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>
                </div>
              )}

              {/* Business Offers Tab */}
              {activeTab === 'offers' && (
                <div className="text-center py-12">
                  <FaBriefcase className="h-12 w-12 text-gray-300 mx-auto mb-4" />
                  <h3 className="text-lg font-medium text-gray-900 mb-2">Business Offers Management</h3>
                  <p className="text-gray-500 mb-4">View and manage all your business affiliate offers</p>
                  <Link 
                    to="/affiliates/my-offers" 
                    className="inline-flex items-center px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
                  >
                    Manage Offers
                  </Link>
                </div>
              )}

              {/* User Posts Tab */}
              {activeTab === 'posts' && (
                <div className="text-center py-12">
                  <FaFileAlt className="h-12 w-12 text-gray-300 mx-auto mb-4" />
                  <h3 className="text-lg font-medium text-gray-900 mb-2">User Posts Management</h3>
                  <p className="text-gray-500 mb-4">View and manage all your user affiliate posts</p>
                  <Link 
                    to="/affiliates/my-posts" 
                    className="inline-flex items-center px-6 py-3 bg-green-600 text-white rounded-lg hover:bg-green-700"
                  >
                    Manage Posts
                  </Link>
                </div>
              )}

              {/* Applications Tab */}
              {activeTab === 'applications' && (
                <div className="space-y-4">
                  <div className="flex justify-between items-center mb-4">
                    <h3 className="text-lg font-semibold text-gray-900">Recent Applications</h3>
                    <Link 
                      to="/affiliates/applications" 
                      className="text-blue-600 hover:text-blue-800 text-sm font-medium"
                    >
                      View All
                    </Link>
                  </div>
                  <div className="space-y-3">
                    {dashboardData.applications?.map((app, index) => (
                      <div key={index} className="border rounded-lg p-4 hover:bg-gray-50">
                        <div className="flex items-center justify-between">
                          <div className="flex-1">
                            <h4 className="font-medium text-gray-900">
                              Application for {app.business_affiliate_offer?.product_service_title}
                            </h4>
                            <p className="text-sm text-gray-500">{app.business_affiliate_offer?.business_name}</p>
                            <div className="flex items-center space-x-4 mt-2 text-xs text-gray-500">
                              <span className={`px-2 py-1 rounded-full ${
                                app.status === 'approved' ? 'bg-green-100 text-green-800' :
                                app.status === 'pending' ? 'bg-yellow-100 text-yellow-800' :
                                app.status === 'rejected' ? 'bg-red-100 text-red-800' :
                                'bg-gray-100 text-gray-800'
                              }`}>
                                {app.status}
                              </span>
                              <span className="flex items-center">
                                <FaCalendarAlt className="mr-1" /> {new Date(app.created_at).toLocaleDateString()}
                              </span>
                            </div>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Analytics Tab */}
              {activeTab === 'analytics' && (
                <div className="space-y-6">
                  <div className="flex justify-between items-center mb-6">
                    <h3 className="text-lg font-semibold text-gray-900">Analytics Overview</h3>
                    <button 
                      onClick={exportAnalytics}
                      className="flex items-center px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700"
                    >
                      <FaDownload className="mr-2" />
                      Export CSV
                    </button>
                  </div>
                  
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                    <div className="text-center p-6 bg-blue-50 rounded-lg">
                      <FaEye className="h-8 w-8 text-blue-600 mx-auto mb-2" />
                      <p className="text-2xl font-bold text-blue-900">{dashboardData.stats?.totalViews}</p>
                      <p className="text-sm text-blue-600">Total Views</p>
                    </div>
                    <div className="text-center p-6 bg-green-50 rounded-lg">
                      <FaExternalLinkAlt className="h-8 w-8 text-green-600 mx-auto mb-2" />
                      <p className="text-2xl font-bold text-green-900">{dashboardData.stats?.totalClicks}</p>
                      <p className="text-sm text-green-600">Total Clicks</p>
                    </div>
                    <div className="text-center p-6 bg-purple-50 rounded-lg">
                      <FaChartBar className="h-8 w-8 text-purple-600 mx-auto mb-2" />
                      <p className="text-2xl font-bold text-purple-900">
                        {dashboardData.stats?.totalViews > 0 ? 
                          ((dashboardData.stats?.totalClicks / dashboardData.stats?.totalViews) * 100).toFixed(1) : 0
                        }%
                      </p>
                      <p className="text-sm text-purple-600">Click Rate</p>
                    </div>
                    <div className="text-center p-6 bg-emerald-50 rounded-lg">
                      <FaDollarSign className="h-8 w-8 text-emerald-600 mx-auto mb-2" />
                      <p className="text-2xl font-bold text-emerald-900">${(dashboardData.stats?.totalRevenue || 0).toFixed(2)}</p>
                      <p className="text-sm text-emerald-600">Total Revenue</p>
                    </div>
                  </div>
                </div>
              )}
            </>
          )}
        </div>
      </div>
      </div>
    </div>
  );
}

export default UnifiedDashboard;
