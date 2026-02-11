import React, { useEffect, useState, useMemo } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Link } from "react-router-dom";
import { getJobsList } from "../slice/JobSlice";
import jobService from "../services/JobServices";
import {
  getJobAlerts,
  createJobAlert,
  updateJobAlert,
  deleteJobAlert,
} from "../slice/JobAlertSlice";
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
import JobAlertForm from "../Component/JobAlerts/JobAlertForm";
import UpsellsManagement from "../Component/Upsells/UpsellsManagement";
import AdvertPostsManagement from "../Component/AdvertPostsManagement";
import PostAnalytics from "../Component/PostAnalytics";
import BannerAdsManagement from "../Component/AdManagement/BannerAdsManagement";
import AffiliateAdsManagement from "../Component/AdManagement/AffiliateAdsManagement";
import ClassifiedAdsManagement from "../Component/AdManagement/ClassifiedAdsManagement";
import MyPostsManagement from "../Component/MyPostsManagement";
import toast from "react-hot-toast";
import { handleApiError } from "../helper/errorHandler";

const UserDashboard = () => {
  const dispatch = useDispatch();
  const { jobsList } = useSelector((store) => store.jobs);
  const { jobAlerts: alertsList } = useSelector((store) => store.jobAlerts);
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
  const [showAlertForm, setShowAlertForm] = useState(false);
  const [editingAlert, setEditingAlert] = useState(null);
  const [myJobsList, setMyJobsList] = useState([]);
  const [showAllCategories, setShowAllCategories] = useState(false);

  const userId = userDetails?.customer_id || localStorage.getItem("customer_id");
  
  // Check if user has store or business store
  const hasStore = Boolean(storeDetail?.data?.store_id || userDetails?.is_has_store);
  const hasBusinessStore = Boolean(businessStore?.data?.id || userDetails?.is_business_store);
  
  // Use dashboard data if available, otherwise fall back to jobs list
  const dashboardData = userDashboard?.data || userDashboard;
  
  // Ensure allJobs is always an array
  const allJobs = useMemo(() => {
    // Try dashboard arrays first
    if (Array.isArray(dashboardData?.featured_jobs)) {
      return dashboardData.featured_jobs;
    }
    if (Array.isArray(dashboardData?.recommended_jobs)) {
      return dashboardData.recommended_jobs;
    }
    if (Array.isArray(dashboardData?.personalized_jobs)) {
      return dashboardData.personalized_jobs;
    }
    // Fall back to jobsList
    if (Array.isArray(jobsList?.items)) {
      return jobsList.items;
    }
    if (Array.isArray(jobsList?.data)) {
      return jobsList.data;
    }
    if (Array.isArray(jobsList)) {
      return jobsList;
    }
    // Default to empty array
    return [];
  }, [dashboardData, jobsList]);
  
  const jobAlerts = Array.isArray(alertsList) ? alertsList : [];
  
  // Enhanced featured jobs - use dashboard data if available
  const featuredJobs = useMemo(() => {
    if (dashboardData?.featured_jobs) {
      return dashboardData.featured_jobs.slice(0, 6);
    }
    if (!Array.isArray(allJobs)) return [];
    return allJobs
      .filter((job) => job.is_featured)
      .sort((a, b) => new Date(b.created_at || b.createdAt) - new Date(a.created_at || a.createdAt))
      .slice(0, 6);
  }, [allJobs, dashboardData]);

  // Enhanced recommended jobs - use dashboard data if available
  const recommendedJobs = useMemo(() => {
    if (dashboardData?.recommended_jobs || dashboardData?.personalized_jobs) {
      return (dashboardData.recommended_jobs || dashboardData.personalized_jobs || []).slice(0, 6);
    }
    if (!Array.isArray(allJobs)) return [];
    return allJobs
      .filter((job) => (job.customer_id !== userId && job.user_id !== userId) && (job.status === "active" || !job.status))
      .sort((a, b) => {
        // Prioritize featured jobs
        if (a.is_featured && !b.is_featured) return -1;
        if (!a.is_featured && b.is_featured) return 1;
        // Then by recency
        return new Date(b.created_at || b.createdAt) - new Date(a.created_at || a.createdAt);
      })
      .slice(0, 6);
  }, [allJobs, userId, dashboardData]);

  // Fetch my jobs from API endpoint
  useEffect(() => {
    const fetchMyJobs = async () => {
      if (!userId) return;
      try {
        const response = await jobService.getMyListings({ per_page: 100 });
        const jobs = response?.data?.items || response?.data?.data?.items || [];
        setMyJobsList(Array.isArray(jobs) ? jobs : []);
      } catch (error) {
        // If endpoint doesn't exist, myJobsList will stay empty and we'll use fallback
        if (error?.status !== 404 && process.env.NODE_ENV === 'development') {
          console.debug("Error fetching my jobs:", error);
        }
      }
    };
    
    fetchMyJobs();
  }, [userId]);
  
  // Get my jobs - use API endpoint result or filter from allJobs and enrich with upsell info
  const myJobs = useMemo(() => {
    // Use myJobsList if available (from API), otherwise filter allJobs
    let jobs = [];
    if (myJobsList.length > 0) {
      jobs = myJobsList;
    } else if (Array.isArray(allJobs) && userId) {
      jobs = allJobs.filter((job) => job.customer_id === userId || job.user_id === userId);
    }
    
    // Enrich jobs with upsell information
    if (Array.isArray(userJobUpsells) && userJobUpsells.length > 0 && jobs.length > 0) {
      return jobs.map((job) => {
        const jobId = job.id || job.listing_id;
        const jobUpsells = userJobUpsells.filter(
          (upsell) => upsell.listing_id === jobId || upsell.job_id === jobId
        );
        const hasFeatured = jobUpsells.some(
          (u) => (u.upsell_type === "featured" || u.upsell_type === "featured_job") && 
                 (u.status === "active" || u.is_active)
        );
        const hasSuggested = jobUpsells.some(
          (u) => (u.upsell_type === "suggested" || u.upsell_type === "suggested_job") && 
                 (u.status === "active" || u.is_active)
        );
        
        return {
          ...job,
          upsells: {
            featured: hasFeatured || job.is_featured,
            suggested: hasSuggested || job.is_suggested,
            list: jobUpsells,
          },
        };
      });
    }
    
    return jobs;
  }, [myJobsList, allJobs, userId, userJobUpsells]);
  
  const jobAlertsCount = jobAlerts.filter((alert) => alert.is_active).length;
  const activeAlerts = jobAlerts.filter((alert) => alert.is_active);

  // Fetch dashboard data and job alerts
  useEffect(() => {
    // Only fetch if user is authenticated
    if (!logIn || !token) {
      console.warn('User not authenticated - skipping dashboard data fetch');
      return;
    }

    // Fetch dashboard data
    dispatch(getUserDashboard()).catch((error) => {
      // Dashboard will use fallback data if endpoint fails
      if (process.env.NODE_ENV === 'development') {
        console.debug("Dashboard endpoint error:", error);
      }
    });
    
    // Fetch job alerts
    dispatch(getJobAlerts({ is_active: true })).catch((error) => {
      // Error handling is done in the slice
      if (process.env.NODE_ENV === 'development') {
        console.debug("Job alerts fetch error:", error);
      }
    });
    
    // Always fetch jobs for fallback - use proper sort format
    dispatch(getJobsList({ limit: 50, sort: "created_at", order: "desc" }));
    
    // Fetch job upsells
    dispatch(getUserJobUpsells()).catch((error) => {
      if (process.env.NODE_ENV === "development") {
        console.debug("Error fetching job upsells:", error);
      }
    });

    // Fetch affiliate ads
    dispatch(getMyAffiliate({ skip: 0, limit: 100 })).catch((error) => {
      if (process.env.NODE_ENV === "development") {
        console.debug("Error fetching affiliate ads:", error);
      }
    });

    // Fetch categories for posting options
    dispatch(getCategoriesList({ is_parent: "yes" })).catch((error) => {
      if (process.env.NODE_ENV === 'development') {
        console.debug("Error fetching categories:", error);
      }
    });

    // Fetch store and business store data
    // Use async/await with try-catch to handle errors gracefully
    const fetchStoreData = async () => {
      try {
        if (userId) {
          // Fetch store data - 404 is expected if no store exists
          await dispatch(getStore({ customer_id: userId })).unwrap();
        } else {
          // Try without customer_id (uses getMyStore)
          await dispatch(getStore({})).unwrap();
        }
      } catch (error) {
        // Silently handle - 404 means no store exists, which is fine
        if (process.env.NODE_ENV === "development" && error?.status !== 404 && error?.isNotFound !== true) {
          console.debug("Error fetching store:", error);
        }
      }
    };

    const fetchBusinessStoreData = async () => {
      try {
        if (userId) {
          // Fetch business store data - 404 is expected if no business exists
          await dispatch(getBusinessStore({ customer_id: userId })).unwrap();
        } else {
          // Try without customer_id (uses getMyBusinessStore)
          await dispatch(getBusinessStore({})).unwrap();
        }
      } catch (error) {
        // Silently handle - 404 means no business exists, which is fine
        if (process.env.NODE_ENV === "development" && error?.status !== 404 && error?.isNotFound !== true) {
          console.debug("Error fetching business store:", error);
        }
      }
    };

    fetchStoreData();
    fetchBusinessStoreData();
  }, [dispatch, userId, logIn, token]);

  const handleSaveAlert = async (alertData) => {
    try {
      if (editingAlert) {
        await dispatch(updateJobAlert({
          alertId: editingAlert.job_alert_id || editingAlert.id,
          alertData: {
            name: alertData.name || alertData.keywords?.join(", "),
            keywords: Array.isArray(alertData.keywords) ? alertData.keywords : (alertData.keywords ? [alertData.keywords] : []),
            location_id: alertData.location_id,
            category_id: alertData.category_id,
            job_type: Array.isArray(alertData.job_type) ? alertData.job_type : (alertData.job_type ? [alertData.job_type] : []),
            salary_min: alertData.salary_min,
            salary_max: alertData.salary_max,
            frequency: alertData.frequency || "daily",
            is_active: alertData.is_active !== undefined ? alertData.is_active : true,
            notification_email: alertData.notification_email,
          },
        })).unwrap();
        toast.success("Job alert updated successfully");
      } else {
        await dispatch(createJobAlert({
          name: alertData.name || alertData.keywords?.join(", "),
          keywords: Array.isArray(alertData.keywords) ? alertData.keywords : (alertData.keywords ? [alertData.keywords] : []),
          location_id: alertData.location_id,
          category_id: alertData.category_id,
          job_type: Array.isArray(alertData.job_type) ? alertData.job_type : (alertData.job_type ? [alertData.job_type] : []),
          salary_min: alertData.salary_min,
          salary_max: alertData.salary_max,
          frequency: alertData.frequency || "daily",
          is_active: true,
          notification_email: alertData.notification_email,
        })).unwrap();
        toast.success("Job alert created successfully");
        // Refresh alerts list
        dispatch(getJobAlerts({ is_active: true }));
      }
      setShowAlertForm(false);
      setEditingAlert(null);
    } catch (error) {
      const errorMessage = handleApiError(error);
      toast.error(errorMessage || "Failed to save job alert");
    }
  };

  const handleDeleteAlert = async (alertId) => {
    if (window.confirm("Are you sure you want to delete this job alert?")) {
      try {
        await dispatch(deleteJobAlert(alertId)).unwrap();
        toast.success("Job alert deleted successfully");
        // Refresh alerts list
        dispatch(getJobAlerts({ is_active: true }));
      } catch (error) {
        const errorMessage = handleApiError(error);
        toast.error(errorMessage || "Failed to delete job alert");
      }
    }
  };

  // Use dashboard stats if available
  const stats = useMemo(() => {
    const dashboardStats = dashboardData?.statistics || {};
    const totalMatches = activeAlerts.reduce((sum, alert) => sum + (alert.last_matched_count || alert.matches_count || 0), 0);
    const activeUpsells = Array.isArray(userJobUpsells) 
      ? userJobUpsells.filter(u => u.status === "active" || u.is_active).length 
      : 0;
    
    // Calculate total posts across all categories
    const totalJobs = myJobs.length;
    const totalAffiliate = Array.isArray(myAffiliateList) ? myAffiliateList.length : 0;
    const totalPosts = totalJobs + totalAffiliate; // Add banner and classified when available
    
    return [
      {
        label: "Total Posts",
        value: dashboardStats.total_posts || totalPosts,
        icon: <FaFileAlt className="h-6 w-6" />,
        color: "bg-indigo-500",
        trend: totalPosts > 0 ? totalPosts : null,
        trendUp: true,
        subtitle: `${totalJobs} jobs, ${totalAffiliate} affiliate`,
      },
      {
        label: "Active Jobs",
        value: dashboardStats.active_jobs || myJobs.length,
        icon: <FaBriefcase className="h-6 w-6" />,
        color: "bg-blue-500",
        trend: dashboardStats.active_jobs_trend || null,
        trendUp: true,
      },
      {
        label: "Job Alerts",
        value: dashboardStats.job_alerts_count || jobAlertsCount,
        icon: <FaBell className="h-6 w-6" />,
        color: "bg-yellow-500",
        trend: totalMatches > 0 ? totalMatches : null,
        trendUp: true,
        subtitle: totalMatches > 0 ? `${totalMatches} new matches` : null,
      },
      {
        label: "Active Upsells",
        value: dashboardStats.active_upsells || activeUpsells,
        icon: <FaStar className="h-6 w-6" />,
        color: "bg-purple-500",
        trend: null,
        trendUp: true,
        subtitle: activeUpsells > 0 ? `${activeUpsells} active upgrades` : "Boost your visibility",
      },
    ];
  }, [dashboardData, myJobs.length, jobAlertsCount, activeAlerts, userJobUpsells, myAffiliateList]);

  // Helper function to get icon for category
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
      case "fa-balance-scale":
        return <FaBalanceScale />;
      case "fa-calendar":
        return <FaCalendar />;
      case "fa-building":
        return <FaBuilding />;
      case "fa-bus":
        return <FaBus />;
      case "fa-laptop":
        return <FaLaptop />;
      case "fa-tags":
        return <FaTags />;
      case "fa-book":
        return <FaBook />;
      case "banner":
        return <PiFlagBanner />;
      case "affiliate":
        return <BiDesktop />;
      default:
        return <FaTags />;
    }
  };

  // Find services category
  const servicesCategory = categoryAds.find(cat => 
    cat.slug?.toLowerCase() === "services" || 
    cat.name?.toLowerCase() === "services"
  );

  // Get first 6 categories for initial display
  const initialCategories = categoryAds.slice(0, 6);

  return (
    <div className="min-h-screen bg-background">
      <Navbar />

      <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="max-w-7xl mx-auto">
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
                        <FaHandshake className="h-5 w-5 text-primary" />
                      </div>
                      <div>
                        <p className="font-medium">Browse Services</p>
                        <p className="text-sm text-muted-foreground">Find services you need</p>
                      </div>
                    </Link>
                    <button
                      onClick={() => setActiveTab("upsells")}
                      className="flex items-center gap-3 p-4 rounded-lg border hover:bg-accent transition-colors"
                    >
                      <div className="p-2 bg-primary/10 rounded-lg">
                        <FaStar className="h-5 w-5 text-primary" />
                      </div>
                      <div>
                        <p className="font-medium">Manage Upsells</p>
                        <p className="text-sm text-muted-foreground">Boost your visibility</p>
                      </div>
                    </button>
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
                      {jobAlertsCount > 0 && (
                        <span className="ml-2 inline-flex items-center rounded-full bg-yellow-100 px-2.5 py-0.5 text-xs font-medium text-yellow-800">
                          {jobAlertsCount} active
                        </span>
                      )}
                    </h2>
                    <button
                      onClick={() => {
                        setEditingAlert(null);
                        setShowAlertForm(true);
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
                                  setEditingAlert(alert);
                                  setShowAlertForm(true);
                                }}
                                className="p-2 text-primary hover:bg-primary/10 rounded-md transition-colors"
                                title="Edit alert"
                              >
                                <FaEdit className="h-4 w-4" />
                              </button>
                              <button
                                onClick={() => handleDeleteAlert(alertId)}
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

            {/* Advert Posts Tab */}
            {activeTab === "advert-posts" && (
              <AdvertPostsManagement />
            )}

            {/* Banner Ads Tab */}
            {activeTab === "banner-ads" && <BannerAdsManagement />}

            {/* Affiliate Ads Tab */}
            {activeTab === "affiliate-ads" && <AffiliateAdsManagement />}

            {/* Classified Ads Tab */}
            {activeTab === "classified-ads" && <ClassifiedAdsManagement />}

            {/* Analytics Tab */}
            {activeTab === "analytics" && <PostAnalytics />}

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

      {/* Job Alert Form Modal */}
      {showAlertForm && (
        <JobAlertForm
          onClose={() => {
            setShowAlertForm(false);
            setEditingAlert(null);
          }}
          onSave={handleSaveAlert}
          initialData={editingAlert}
        />
      )}
    </div>
  );
};

export default UserDashboard;

