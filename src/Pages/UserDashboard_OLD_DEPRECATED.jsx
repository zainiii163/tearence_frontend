import React, { useEffect, useState, useMemo } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Link } from "react-router-dom";
import { getUserDashboard } from "../slice/DashboardSlice";
import { getUserJobUpsells, } from "../slice/UpsellSlice";
import { getMyAffiliate } from "../slice/AffiliateSLice";
import { getCategoriesList } from "../slice/CategorySlice";
import { getStore, getBusinessStore } from "../slice/StoreSlice";
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
  FaMapMarkerAlt,
  FaDollarSign,
  FaIndustry,
  FaShoppingBag,
  FaCreditCard,
  FaBalanceScale,
  FaCalendar,
  FaCalendarAlt,
  FaBuilding,
  FaBus,
  FaLaptop,
  FaTags,
  FaBook,
  FaHandshake,
  FaStore,
  FaExternalLinkAlt,
  FaShareAlt,
} from "react-icons/fa";
import { PiFlagBanner } from "react-icons/pi";
import { BiDesktop } from "react-icons/bi";
import Navbar from "../Component/Navbar";
import Footer from "../Component/Footer";
import JobItem from "../Component/CategoryPage/JobItem";
import UpsellsManagement from "../Component/Upsells/UpsellsManagement";
import AdvertPostsManagement from "../Component/AdvertPostsManagement";
import PostAnalytics from "../Component/PostAnalytics";
import UserAnalyticsAndInvoices from "../Component/Analytics/UserAnalyticsAndInvoices";
import BannerAdsManagement from "../Component/AdManagement/BannerAdsManagement";
import AffiliateAdsManagement from "../Component/AdManagement/AffiliateAdsManagement";
import ClassifiedAdsManagement from "../Component/AdManagement/ClassifiedAdsManagement";
import MyPostsManagement from "../Component/MyPostsManagement";
import toast from "react-hot-toast";
import { handleApiError } from "../helper/errorHandler";

const UserDashboard = () => {
  const dispatch = useDispatch();
  const { userDashboard } = useSelector((store) => store.dashboard);
  const { userJobUpsells } = useSelector((store) => store.upsells);
  const { myAffiliateList } = useSelector((store) => store.aff);
  const userDetails = useSelector((store) => store.auth?.userDetail?.data || {});
  const { logIn, token } = useSelector((store) => store.auth);
  const categoryAdsData = useSelector((store) => store.categories.categoryList);
  const storeDetail = useSelector((store) => store.store?.storeDetail);
  const businessStore = useSelector((store) => store.store?.businessStore);
  const categoryAds = categoryAdsData?.data?.items || [];
  const [activeTab, setActiveTab] = useState("overview");
  const [showAllCategories, setShowAllCategories] = useState(false);

  const userId = userDetails?.customer_id || localStorage.getItem("customer_id");
  
  // Check if user has store or business store
  const hasStore = Boolean(storeDetail?.data?.store_id || userDetails?.is_has_store);
  const hasBusinessStore = Boolean(businessStore?.data?.id || userDetails?.is_business_store);
  
  // Use dashboard data if available, otherwise fall back to jobs list
  const dashboardData = userDashboard?.data || userDashboard;
  
  // Enhanced featured jobs - use dashboard data if available
  const featuredJobs = useMemo(() => {
    if (dashboardData?.featured_jobs) {
      return dashboardData.featured_jobs.slice(0, 6);
    }
    return [];
  }, [dashboardData]);

  // Enhanced recommended jobs - use dashboard data if available
  const recommendedJobs = useMemo(() => {
    if (dashboardData?.recommended_jobs || dashboardData?.personalized_jobs) {
      return (dashboardData.recommended_jobs || dashboardData.personalized_jobs || []).slice(0, 6);
    }
    return [];
  }, [dashboardData]);

  // Fetch my jobs - use API endpoint result or filter from allJobs and enrich with upsell info
  const myJobs = useMemo(() => {
    // For now, return empty array since jobs functionality has been removed
    return [];
  }, []);

  // Fetch data on component mount
  useEffect(() => {
    dispatch(getUserDashboard());
    dispatch(getMyAffiliate());
    dispatch(getCategoriesList());
    dispatch(getStore());
    dispatch(getBusinessStore());
    dispatch(getUserJobUpsells());
  }, [dispatch, logIn, token]);

  // Calculate stats
  const stats = {
    totalAffiliate: Array.isArray(myAffiliateList) ? myAffiliateList.length : (myAffiliateList?.data?.length || 0),
    totalCategories: categoryAds.length,
    hasStore,
    hasBusinessStore,
  };

  // Helper function to get category icon
  const getCategoryIcon = (iconname) => {
    switch (iconname) {
      case "fa-industry":
        return <FaIndustry />;
      case "fa-credit-card":
        return <FaCreditCard />;
      case "fa-fighter-jet":
        return <FaHandshake />;
      case "fa-shopping-bag":
        return <FaShoppingBag />;
      case "fa-calendar":
        return <FaCalendarAlt />;
      case "fa-building":
        return <FaBuilding />;
      case "fa-bus":
        return <FaBus />;
      case "fa-laptop":
        return <FaLaptop />;
      case "fa-tags":
        return <FaTags />;
      default:
        return <FaBriefcase />;
    }
  };

  // Get first 6 categories for initial display
  const initialCategories = categoryAds.slice(0, 6);

  return (
    <div className="min-h-screen bg-background">
      <Navbar />

      <div className="page-container py-8">
        <div className="page-container">
          {/* Header */}
          <div className="mb-8">
            <h1 className="text-3xl font-bold">Dashboard</h1>
            <p className="text-muted-foreground mt-2">
              Welcome back, {userDetails?.name || "User"}!
            </p>
          </div>

          {/* Stats Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
            {stats.map((stat, index) => (
              <div
                key={index}
                className="rounded-lg border bg-card p-6 shadow-sm hover:shadow-md transition-all hover:-translate-y-1"
              >
                <div className="flex items-center justify-between">
                  <div className="flex-1">
                    <p className="text-sm text-muted-foreground">{stat.label}</p>
                    <div className="flex items-baseline gap-2 mt-2">
                      <p className="text-2xl font-bold">{stat.value}</p>
                      {stat.trend && (
                        <span className={`text-xs font-medium flex items-center gap-1 ${
                          stat.trendUp ? "text-green-600" : "text-red-600"
                        }`}>
                          {stat.trendUp ? (
                            <FaArrowUp className="h-3 w-3" />
                          ) : (
                            <FaArrowDown className="h-3 w-3" />
                          )}
                          {stat.trend}
                        </span>
                      )}
                    </div>
                    {stat.subtitle && (
                      <p className="text-xs text-muted-foreground mt-1">{stat.subtitle}</p>
                    )}
                  </div>
                  <div className={`${stat.color} text-white p-3 rounded-lg shadow-sm`}>
                    {stat.icon}
                  </div>
                </div>
              </div>
            ))}
          </div>

          {/* Tabs */}
          <div className="mb-6 border-b">
            <nav className="flex space-x-8 overflow-x-auto">
              {[
                { id: "overview", label: "Overview" },
                { id: "my-posts", label: "My Posts" },
                { id: "my-jobs", label: "My Jobs" },
                { id: "banner-ads", label: "Banner Ads" },
                { id: "affiliate-ads", label: "Affiliate Ads" },
                { id: "classified-ads", label: "Classified Ads" },
                { id: "analytics", label: "Analytics" },
                { id: "upsells", label: "Upsells" },
                { id: "applications", label: "Applications" },
                { id: "profile", label: "Profile" },
              ].map((tab) => (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  className={`py-4 px-1 border-b-2 font-medium text-sm transition-colors ${
                    activeTab === tab.id
                      ? "border-primary text-primary"
                      : "border-transparent text-muted-foreground hover:text-foreground hover:border-gray-300"
                  }`}
                >
                  {tab.label}
                </button>
              ))}
            </nav>
          </div>

          {/* Tab Content */}
          <div className="space-y-8">
            {/* Overview Tab */}
            {activeTab === "overview" && (
              <>
                {/* Quick Actions */}
                <div className="rounded-lg border bg-card p-6">
                  <h2 className="text-xl font-semibold mb-4">Quick Actions</h2>
                  <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 mb-6">
                    <Link
                      to="/jobs/post"
                      className="flex items-center gap-3 p-4 rounded-lg border hover:bg-accent transition-colors"
                    >
                      <div className="p-2 bg-primary/10 rounded-lg">
                        <FaBriefcase className="h-5 w-5 text-primary" />
                      </div>
                      <div>
                        <p className="font-medium">Post a Job</p>
                        <p className="text-sm text-muted-foreground">Create a new job listing</p>
                      </div>
                    </Link>
                    {servicesCategory && (
                      <Link
                        to={`/post/${servicesCategory.slug}/${servicesCategory.category_id}`}
                        className="flex items-center gap-3 p-4 rounded-lg border hover:bg-accent transition-colors"
                      >
                        <div className="p-2 bg-primary/10 rounded-lg">
                          <FaHandshake className="h-5 w-5 text-primary" />
                        </div>
                        <div>
                          <p className="font-medium">Offer a Service</p>
                          <p className="text-sm text-muted-foreground">Post your service listing</p>
                        </div>
                      </Link>
                    )}
                    <Link
                      to="/books/post"
                      className="flex items-center gap-3 p-4 rounded-lg border hover:bg-accent transition-colors"
                    >
                      <div className="p-2 bg-primary/10 rounded-lg">
                        <FaBook className="h-5 w-5 text-primary" />
                      </div>
                      <div>
                        <p className="font-medium">Post a Book</p>
                        <p className="text-sm text-muted-foreground">Create a new book listing</p>
                      </div>
                    </Link>
                    <Link
                      to="/candidates/profile"
                      className="flex items-center gap-3 p-4 rounded-lg border hover:bg-accent transition-colors"
                    >
                      <div className="p-2 bg-primary/10 rounded-lg">
                        <FaUser className="h-5 w-5 text-primary" />
                      </div>
                      <div>
                        <p className="font-medium">Update Profile</p>
                        <p className="text-sm text-muted-foreground">Edit your candidate profile</p>
                      </div>
                    </Link>
                    <Link
                      to="/jobs"
                      className="flex items-center gap-3 p-4 rounded-lg border hover:bg-accent transition-colors"
                    >
                      <div className="p-2 bg-primary/10 rounded-lg">
                        <FaSearch className="h-5 w-5 text-primary" />
                      </div>
                      <div>
                        <p className="font-medium">Browse Jobs</p>
                        <p className="text-sm text-muted-foreground">Find your next opportunity</p>
                      </div>
                    </Link>
                    <Link
                      to="/services"
                      className="flex items-center gap-3 p-4 rounded-lg border hover:bg-accent transition-colors"
                    >
                      <div className="p-2 bg-primary/10 rounded-lg">
                        <FaShoppingBag className="h-5 w-5 text-primary" />
                      </div>
                      <div>
                        <p className="font-medium">Browse Services</p>
                        <p className="text-sm text-muted-foreground">Find services you need</p>
                      </div>
                    </Link>
                    <Link
                      to="/books/post"
                      className="flex items-center gap-3 p-4 rounded-lg border hover:bg-accent transition-colors"
                    >
                      <div className="p-2 bg-primary/10 rounded-lg">
                        <FaBook className="h-5 w-5 text-primary" />
                      </div>
                      <div>
                        <p className="font-medium">Post a Book</p>
                        <p className="text-sm text-muted-foreground">Create a new book listing</p>
                      </div>
                    </Link>
                    <Link
                      to="/my-store"
                      className="flex items-center gap-3 p-4 rounded-lg border hover:bg-accent transition-colors"
                    >
                      <div className="p-2 bg-primary/10 rounded-lg">
                        <FaStore className="h-5 w-5 text-primary" />
                      </div>
                      <div className="flex-1">
                        <p className="font-medium">{hasStore ? "Manage Store" : "Upgrade to Store"}</p>
                        <p className="text-sm text-muted-foreground">
                          {hasStore ? "Manage your store page" : "Create your own store page"}
                        </p>
                      </div>
                      {!hasStore && (
                        <span className="text-xs bg-primary/10 text-primary px-2 py-1 rounded">New</span>
                      )}
                    </Link>
                    <Link
                      to="/referral"
                      className="flex items-center gap-3 p-4 rounded-lg border hover:bg-accent transition-colors"
                    >
                      <div className="p-2 bg-primary/10 rounded-lg">
                        <FaShareAlt className="h-5 w-5 text-primary" />
                      </div>
                      <div>
                        <p className="font-medium">Invite Friends</p>
                        <p className="text-sm text-muted-foreground">Earn discounts by inviting friends</p>
                      </div>
                      <span className="text-xs bg-green-100 text-green-800 px-2 py-1 rounded">Earn</span>
                    </Link>
                    <Link
                      to="/business-store"
                      className="flex items-center gap-3 p-4 rounded-lg border hover:bg-accent transition-colors"
                    >
                      <div className="p-2 bg-primary/10 rounded-lg">
                        <FaBuilding className="h-5 w-5 text-primary" />
                      </div>
                      <div className="flex-1">
                        <p className="font-medium">{hasBusinessStore ? "Manage Business" : "Upgrade to Business"}</p>
                        <p className="text-sm text-muted-foreground">
                          {hasBusinessStore ? "Manage your business profile" : "Create a professional business page"}
                        </p>
                      </div>
                      {!hasBusinessStore && (
                        <span className="text-xs bg-primary/10 text-primary px-2 py-1 rounded">New</span>
                      )}
                    </Link>
                  </div>

                  {/* Post in All Categories Section */}
                  <div className="border-t pt-6">
                    <div className="flex items-center justify-between mb-4">
                      <h3 className="text-lg font-semibold">Post in All Categories</h3>
                      {categoryAds.length > 6 && (
                        <button
                          onClick={() => setShowAllCategories(!showAllCategories)}
                          className="text-sm text-primary hover:underline"
                        >
                          {showAllCategories ? "Show Less" : `Show All (${categoryAds.length})`}
                        </button>
                      )}
                    </div>
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-3">
                      {(showAllCategories ? categoryAds : initialCategories).map((category) => {
                        const IconComponent = getCategoryIcon(category.icon);
                        return (
                          <Link
                            key={category.category_id}
                            to={`/post/${category.slug}/${category.category_id}`}
                            className="flex items-center gap-2 p-3 rounded-lg border hover:bg-accent hover:border-primary/20 transition-all"
                          >
                            <div className="p-1.5 bg-primary/10 rounded text-primary">
                              {IconComponent}
                            </div>
                            <span className="text-sm font-medium">{category.name}</span>
                          </Link>
                        );
                      })}
                      {/* Special Categories */}
                      <Link
                        to="/postbanner"
                        className="flex items-center gap-2 p-3 rounded-lg border hover:bg-accent hover:border-primary/20 transition-all"
                      >
                        <div className="p-1.5 bg-orange-500/10 rounded text-orange-600">
                          <PiFlagBanner />
                        </div>
                        <span className="text-sm font-medium">Banner</span>
                      </Link>
                      <Link
                        to="/postaffiliate"
                        className="flex items-center gap-2 p-3 rounded-lg border hover:bg-accent hover:border-primary/20 transition-all"
                      >
                        <div className="p-1.5 bg-purple-500/10 rounded text-purple-600">
                          <BiDesktop />
                        </div>
                        <span className="text-sm font-medium">Affiliate</span>
                      </Link>
                    </div>
                  </div>
                </div>

                {/* Featured Jobs */}
                {featuredJobs.length > 0 && (
                  <div className="rounded-lg border bg-card p-6">
                    <div className="flex items-center justify-between mb-4">
                      <h2 className="text-xl font-semibold flex items-center gap-2">
                        <FaStar className="h-5 w-5 text-yellow-500" />
                        Featured Jobs
                      </h2>
                      <Link
                        to="/jobs"
                        className="text-sm text-primary hover:underline"
                      >
                        View all
                      </Link>
                    </div>
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                      {featuredJobs.slice(0, 3).map((job) => (
                        <JobItem key={job.id} item={job} />
                      ))}
                    </div>
                  </div>
                )}

                {/* Job Alerts Section */}
                <div className="rounded-lg border bg-card p-6">
                  <div className="flex items-center justify-between mb-4">
                    <h2 className="text-xl font-semibold flex items-center gap-2">
                      <FaBell className="h-5 w-5 text-yellow-500" />
                      Job Alerts
                    </h2>
                    <button
                      onClick={() => {
                        toast.info("Job alerts functionality has been removed");
                      }}
                      className="inline-flex items-center justify-center whitespace-nowrap rounded-md text-sm font-medium bg-primary text-primary-foreground hover:bg-primary/90 h-9 px-4"
                    >
                      <FaPlus className="h-4 w-4 mr-2" />
                      Create Alert
                    </button>
                  </div>

                  {activeAlerts.length > 0 ? (
                    <div className="space-y-3 mb-4">
                      {activeAlerts.map((alert) => {
                        const alertId = alert.job_alert_id || alert.id;
                        const keywords = Array.isArray(alert.keywords) ? alert.keywords : (alert.keywords ? [alert.keywords] : []);
                        const matchesCount = alert.last_matched_count || alert.matches_count || 0;
                        
                        return (
                          <div
                            key={alertId}
                            className="flex items-center justify-between p-4 rounded-lg border bg-muted/30 hover:bg-muted/50 transition-colors"
                          >
                            <div className="flex-1">
                              <div className="flex items-center gap-2 mb-1">
                                <h3 className="font-medium">
                                  {alert.name || keywords.join(", ") || "No keywords"}
                                </h3>
                                {matchesCount > 0 && (
                                  <span className="inline-flex items-center rounded-full bg-green-100 px-2 py-0.5 text-xs font-medium text-green-800">
                                    {matchesCount} new matches
                                  </span>
                                )}
                              </div>
                              <div className="flex flex-wrap items-center gap-3 text-sm text-muted-foreground">
                                {alert.location?.city && (
                                  <span className="flex items-center gap-1">
                                    <FaMapMarkerAlt className="h-3 w-3" />
                                    {alert.location.city}
                                  </span>
                                )}
                                {alert.job_type && Array.isArray(alert.job_type) && alert.job_type.length > 0 && (
                                  <span className="flex items-center gap-1">
                                    <FaBriefcase className="h-3 w-3" />
                                    {alert.job_type.join(", ")}
                                  </span>
                                )}
                                {(alert.salary_min || alert.salary_max) && (
                                  <span className="flex items-center gap-1">
                                    <FaDollarSign className="h-3 w-3" />
                                    {alert.salary_min && alert.salary_max
                                      ? `$${alert.salary_min.toLocaleString()} - $${alert.salary_max.toLocaleString()}`
                                      : alert.salary_min
                                      ? `$${alert.salary_min.toLocaleString()}+`
                                      : `Up to $${alert.salary_max.toLocaleString()}`}
                                  </span>
                                )}
                              </div>
                            </div>
                            <div className="flex items-center gap-2">
                              <button
                                onClick={() => {
                                  toast.info("Job alerts functionality has been removed");
                                }}
                                className="p-2 text-primary hover:bg-primary/10 rounded-md transition-colors"
                                title="Edit alert"
                              >
                                <FaEdit className="h-4 w-4" />
                              </button>
                              <button
                                onClick={() => {
                                  toast.info("Job alerts functionality has been removed");
                                }}
                                className="p-2 text-destructive hover:bg-destructive/10 rounded-md transition-colors"
                                title="Delete alert"
                              >
                                <FaTrash className="h-4 w-4" />
                              </button>
                            </div>
                          </div>
                        );
                      })}
                    </div>
                  ) : (
                    <div className="text-center py-8 mb-4">
                      <FaBell className="h-12 w-12 text-muted-foreground mx-auto mb-4 opacity-50" />
                      <p className="text-muted-foreground mb-4">
                        No active job alerts. Create one to get notified about new opportunities!
                      </p>
                    </div>
                  )}

                  <div className="flex gap-2 pt-4 border-t">
                    <Link
                      to="/jobs"
                      className="inline-flex items-center justify-center whitespace-nowrap rounded-md text-sm font-medium border border-input bg-background hover:bg-accent hover:text-accent-foreground h-9 px-4"
                    >
                      <FaSearch className="h-4 w-4 mr-2" />
                      Browse Jobs
                    </Link>
                  </div>
                </div>

                {/* Recent Posts Section */}
                <div className="rounded-lg border bg-card p-6">
                  <div className="flex items-center justify-between mb-4">
                    <h2 className="text-xl font-semibold flex items-center gap-2">
                      <FaFileAlt className="h-5 w-5 text-indigo-500" />
                      Recent Posts
                      <span className="ml-2 inline-flex items-center rounded-full bg-indigo-100 px-2.5 py-0.5 text-xs font-medium text-indigo-800">
                        {myJobs.length + (Array.isArray(myAffiliateList) ? myAffiliateList.length : 0)} total
                      </span>
                    </h2>
                    <button
                      onClick={() => setActiveTab("my-posts")}
                      className="text-sm text-primary hover:underline font-medium"
                    >
                      View All
                    </button>
                  </div>

                  {/* Combine and sort recent posts */}
                  {(() => {
                    const allRecentPosts = [
                      ...myJobs.slice(0, 3).map(job => ({ ...job, type: 'job', id: job.id || job.listing_id })),
                      ...(Array.isArray(myAffiliateList) ? myAffiliateList.slice(0, 3).map(affiliate => ({ ...affiliate, type: 'affiliate' })) : []),
                    ].sort((a, b) => {
                      const dateA = new Date(a.created_at || a.createdAt || a.posted_at);
                      const dateB = new Date(b.created_at || b.createdAt || b.posted_at);
                      return dateB - dateA;
                    }).slice(0, 5);

                    return allRecentPosts.length > 0 ? (
                      <div className="space-y-3 mb-4">
                        {allRecentPosts.map((post) => {
                          const getPostIcon = (type) => {
                            switch (type) {
                              case 'job':
                                return <FaBriefcase className="h-4 w-4 text-blue-500" />;
                              case 'affiliate':
                                return <BiDesktop className="h-4 w-4 text-purple-500" />;
                              default:
                                return <FaFileAlt className="h-4 w-4 text-gray-500" />;
                            }
                          };

                          const getPostBadge = (type) => {
                            const badges = {
                              job: 'bg-blue-100 text-blue-800',
                              affiliate: 'bg-purple-100 text-purple-800',
                            };
                            return badges[type] || 'bg-gray-100 text-gray-800';
                          };

                          return (
                            <div
                              key={`${post.type}-${post.id}`}
                              className="flex items-center justify-between p-4 rounded-lg border bg-muted/30 hover:bg-muted/50 transition-colors"
                            >
                              <div className="flex-1">
                                <div className="flex items-center gap-2 mb-1">
                                  {getPostIcon(post.type)}
                                  <span className={`inline-flex items-center rounded-full px-2 py-1 text-xs font-medium ${getPostBadge(post.type)}`}>
                                    {post.type.charAt(0).toUpperCase() + post.type.slice(1)}
                                  </span>
                                  <h3 className="font-medium">
                                    {post.title || post.position}
                                  </h3>
                                </div>
                                <div className="flex flex-wrap items-center gap-3 text-sm text-muted-foreground">
                                  <span className="flex items-center gap-1">
                                    <FaCalendarAlt className="h-3 w-3" />
                                    {new Date(post.created_at || post.createdAt || post.posted_at).toLocaleDateString()}
                                  </span>
                                  {post.type === 'job' && post.company && (
                                    <span className="flex items-center gap-1">
                                      <FaBuilding className="h-3 w-3" />
                                      {post.company}
                                    </span>
                                  )}
                                  {post.type === 'affiliate' && post.link && (
                                    <span className="flex items-center gap-1">
                                      <FaExternalLinkAlt className="h-3 w-3" />
                                      <a
                                        href={post.link}
                                        target="_blank"
                                        rel="noopener noreferrer"
                                        className="text-primary hover:underline"
                                      >
                                        View Link
                                      </a>
                                    </span>
                                  )}
                                </div>
                              </div>
                              <div className="flex items-center gap-2">
                                <Link
                                  to={post.type === 'job' ? `/jobs/${post.id}` : `/affiliate/${post.id}`}
                                  className="p-2 text-primary hover:bg-primary/10 rounded-md transition-colors"
                                  title="View"
                                >
                                  <FaEye className="h-4 w-4" />
                                </Link>
                                <Link
                                  to={post.type === 'job' ? `/jobs/post/${post.id}` : `/postaffiliate/${post.id}`}
                                  className="p-2 text-primary hover:bg-primary/10 rounded-md transition-colors"
                                  title="Edit"
                                >
                                  <FaEdit className="h-4 w-4" />
                                </Link>
                              </div>
                            </div>
                          );
                        })}
                      </div>
                    ) : (
                      <div className="text-center py-8 mb-4">
                        <FaFileAlt className="h-12 w-12 text-muted-foreground mx-auto mb-4 opacity-50" />
                        <p className="text-muted-foreground mb-4">
                          No posts yet. Create your first job or affiliate ad to get started!
                        </p>
                        <div className="flex gap-2 justify-center">
                          <Link
                            to="/jobs/post"
                            className="inline-flex items-center justify-center whitespace-nowrap rounded-md bg-primary text-primary-foreground hover:bg-primary/90 h-9 px-4 text-sm font-medium"
                          >
                            <FaBriefcase className="h-4 w-4 mr-2" />
                            Post Job
                          </Link>
                          <Link
                            to="/postaffiliate"
                            className="inline-flex items-center justify-center whitespace-nowrap rounded-md border border-input bg-background hover:bg-accent hover:text-accent-foreground h-9 px-4 text-sm font-medium"
                          >
                            <BiDesktop className="h-4 w-4 mr-2" />
                            Post Affiliate
                          </Link>
                        </div>
                      </div>
                    );
                  })()}

                  <div className="flex gap-2 pt-4 border-t">
                    <button
                      onClick={() => setActiveTab("my-posts")}
                      className="inline-flex items-center justify-center whitespace-nowrap rounded-md text-sm font-medium border border-input bg-background hover:bg-accent hover:text-accent-foreground h-9 px-4"
                    >
                      <FaFileAlt className="h-4 w-4 mr-2" />
                      View All Posts
                    </button>
                    <Link
                      to="/jobs/post"
                      className="inline-flex items-center justify-center whitespace-nowrap rounded-md text-sm font-medium ring-offset-background transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 bg-primary text-primary-foreground hover:bg-primary/90 h-9 px-4"
                    >
                      <FaPlus className="h-4 w-4 mr-2" />
                      Post New
                    </Link>
                  </div>
                </div>

                {/* Recommended Jobs */}
                {recommendedJobs.length > 0 && (
                  <div className="rounded-lg border bg-card p-6">
                    <div className="flex items-center justify-between mb-4">
                      <h2 className="text-xl font-semibold">Recommended for You</h2>
                      <Link
                        to="/jobs"
                        className="text-sm text-primary hover:underline"
                      >
                        View all
                      </Link>
                    </div>
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                      {recommendedJobs.map((job) => (
                        <JobItem key={job.id} item={job} />
                      ))}
                    </div>
                  </div>
                )}
              </>
            )}

            {/* My Posts Tab */}
            {activeTab === "my-posts" && <MyPostsManagement />}

            {/* My Jobs Tab */}
            {activeTab === "my-jobs" && (
              <div className="rounded-lg border bg-card p-6">
                <div className="flex items-center justify-between mb-4">
                  <h2 className="text-xl font-semibold">My Job Postings</h2>
                  <Link
                    to="/jobs/post"
                    className="inline-flex items-center justify-center whitespace-nowrap rounded-md text-sm font-medium ring-offset-background transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 bg-primary text-primary-foreground hover:bg-primary/90 h-9 px-4"
                  >
                    <FaPlus className="h-4 w-4 mr-2" />
                    Post New Job
                  </Link>
                </div>
                {myJobs.length > 0 ? (
                  <div className="space-y-4">
                    {myJobs.map((job) => (
                      <JobItem key={job.id} item={job} viewMode="list" />
                    ))}
                  </div>
                ) : (
                  <div className="text-center py-12">
                    <FaBriefcase className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                    <p className="text-muted-foreground">No jobs posted yet</p>
                    <Link
                      to="/jobs/post"
                      className="inline-flex items-center justify-center whitespace-nowrap rounded-md text-sm font-medium ring-offset-background transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 bg-primary text-primary-foreground hover:bg-primary/90 h-9 px-4 mt-4"
                    >
                      Post Your First Job
                    </Link>
                  </div>
                )}
              </div>
            )}


            {/* Banner Ads Tab */}
            {activeTab === "banner-ads" && <BannerAdsManagement />}

            {/* Affiliate Ads Tab */}
            {activeTab === "affiliate-ads" && <AffiliateAdsManagement />}

            {/* Classified Ads Tab */}
            {activeTab === "classified-ads" && <ClassifiedAdsManagement />}

            {/* Analytics Tab */}
            {activeTab === "analytics" && (
              <div className="space-y-6">
                <PostAnalytics />
                <UserAnalyticsAndInvoices
                  userId={userId}
                  businessId={businessStore?.data?.id}
                />
              </div>
            )}

            {/* Upsells Tab */}
            {activeTab === "upsells" && (
              <div className="rounded-lg border bg-card p-6">
                <div className="mb-6">
                  <h2 className="text-xl font-semibold">My Upsells</h2>
                  <p className="text-sm text-muted-foreground mt-1">
                    Manage your job and candidate upsells to boost visibility
                  </p>
                </div>
                <UpsellsManagement />
              </div>
            )}

            {/* Applications Tab */}
            {activeTab === "applications" && (
              <div className="rounded-lg border bg-card p-6">
                <h2 className="text-xl font-semibold mb-4">My Applications</h2>
                <div className="text-center py-12">
                  <FaFileAlt className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                  <p className="text-muted-foreground">No applications yet</p>
                </div>
              </div>
            )}

            {/* Profile Tab */}
            {activeTab === "profile" && (
              <div className="rounded-lg border bg-card p-6">
                <div className="flex items-center justify-between mb-4">
                  <h2 className="text-xl font-semibold">My Profile</h2>
                  <Link
                    to="/candidates/profile"
                    className="inline-flex items-center justify-center whitespace-nowrap rounded-md text-sm font-medium ring-offset-background transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 border border-input bg-background hover:bg-accent hover:text-accent-foreground h-9 px-4"
                  >
                    Edit Profile
                  </Link>
                </div>
                <div className="text-center py-12">
                  <FaUser className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                  <p className="text-muted-foreground mb-4">Create your candidate profile</p>
                  <Link
                    to="/candidates/profile"
                    className="inline-flex items-center justify-center whitespace-nowrap rounded-md text-sm font-medium ring-offset-background transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 bg-primary text-primary-foreground hover:bg-primary/90 h-9 px-4"
                  >
                    Create Profile
                  </Link>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>

      <Footer />

    </div>
  );
};

export default UserDashboard;
