import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Link } from "react-router-dom";
import { getUserDashboard } from "../slice/DashboardSlice";
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
  FaBook,
  FaBookOpen,
} from "react-icons/fa";
import { HiOutlineOfficeBuilding, HiOutlineShoppingBag } from "react-icons/hi";
import { BiDesktop } from "react-icons/bi";
import { PiFlagBanner } from "react-icons/pi";
import UserForm from "../Component/UserForm";

const UserDashboard = () => {
  const dispatch = useDispatch();
  const { logIn, userDetail } = useSelector((store) => store.auth);
  const { dashboardData, loading } = useSelector((store) => store.dashboard);
  const { categories } = useSelector((store) => store.categories);
  const { storeData, businessStoreData } = useSelector((store) => store.store);

  const [activeTab, setActiveTab] = useState("overview");
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("all");
  const [booksData, setBooksData] = useState(null);
  const [jobsData, setJobsData] = useState(null);

  // Load posted jobs from localStorage
  const loadPostedJobs = () => {
    try {
      const postedJobs = JSON.parse(localStorage.getItem('myPostedJobs') || '[]');
      setJobsData({ recentJobs: postedJobs });
    } catch (error) {
      console.error('Error loading posted jobs:', error);
      setJobsData({ recentJobs: [] });
    }
  };
  const [loadingBooks, setLoadingBooks] = useState(false);

  useEffect(() => {
    if (logIn) {
      dispatch(getUserDashboard());
      dispatch(getCategoriesList());
      dispatch(getStore());
      dispatch(getBusinessStore());
      loadBooksData();
      loadPostedJobs();
    }
  }, [dispatch, logIn]);

  const loadBooksData = async () => {
    try {
      setLoadingBooks(true);
      // In a real implementation, this would call the books API
      // For now, we'll use mock data
      setBooksData({
        totalBooks: 12,
        activeBooks: 8,
        totalBookViews: 5420,
        totalBookSaves: 189,
        recentBooks: [
          {
            id: 1,
            title: "The Great Adventure",
            genre: "Fiction",
            status: "active",
            views: 1250,
            saves: 89,
            createdAt: "2024-03-10T10:00:00Z"
          },
          {
            id: 2,
            title: "Business Success Guide",
            genre: "Business",
            status: "pending",
            views: 450,
            saves: 23,
            createdAt: "2024-03-09T15:30:00Z"
          }
        ]
      });
    } catch (error) {
      console.error('Failed to load books data:', error);
    } finally {
      setLoadingBooks(false);
    }
  };

  const filteredCategories = categories?.filter(
    (cat) => selectedCategory === "all" || cat.categoryName === selectedCategory
  );

  const stats = {
    totalPosts: dashboardData?.totalPosts || 0,
    activePosts: dashboardData?.activePosts || 0,
    totalViews: dashboardData?.totalViews || 0,
    totalSaves: dashboardData?.totalSaves || 0,
  };

  const booksStats = {
    totalBooks: booksData?.totalBooks || 0,
    activeBooks: booksData?.activeBooks || 0,
    totalViews: booksData?.totalBookViews || 0,
    totalSaves: booksData?.totalBookSaves || 0,
  };

  const jobsStats = {
    totalJobs: jobsData?.recentJobs?.length || 0,
    activeJobs: jobsData?.recentJobs?.filter(job => job.status === 'active')?.length || 0,
    totalViews: jobsData?.recentJobs?.reduce((sum, job) => sum + (job.views || 0), 0),
    totalApplications: jobsData?.recentJobs?.reduce((sum, job) => sum + (job.applications_count || 0), 0),
  };

  const quickActions = [
    { label: "Post New Ad", icon: FaPlus, route: "/post-ad", color: "bg-blue-500" },
    { label: "Post Job", icon: FaBriefcase, route: "/jobs?postForm=true", color: "bg-green-500" },
    { label: "Post Book", icon: FaBook, route: "/books?postForm=true", color: "bg-indigo-500" },
    { label: "My Store", icon: HiOutlineShoppingBag, route: "/my-store", color: "bg-green-500" },
    { label: "My Business", icon: HiOutlineOfficeBuilding, route: "/my-business", color: "bg-purple-500" },
    { label: "Books Dashboard", icon: FaBookOpen, route: "/books/dashboard", color: "bg-indigo-600" },
    { label: "Account Settings", icon: FaCog, route: "/account", color: "bg-gray-500" },
  ];

  const recentPosts = dashboardData?.recentPosts || [];
  const recentBooks = booksData?.recentBooks || [];

  const dashboardTabs = [
    { id: "overview", label: "Overview", icon: FaChartLine },
    { id: "jobs", label: "Jobs", icon: FaBriefcase },
    { id: "books", label: "Books", icon: FaBook },
    { id: "ads", label: "Ads", icon: FaTags },
    { id: "store", label: "Store", icon: HiOutlineShoppingBag },
    { id: "business", label: "Business", icon: HiOutlineOfficeBuilding },
  ];

  const currentStats = activeTab === "books" ? booksStats : activeTab === "jobs" ? jobsStats : stats;
  const currentItems = activeTab === "books" ? recentBooks : activeTab === "jobs" ? jobsData?.recentJobs || [] : recentPosts;

  if (!logIn) {
    return <UserForm />;
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center py-4">
            <div className="flex items-center space-x-4">
              <div className="flex items-center space-x-3">
                <div className="w-10 h-10 bg-blue-500 rounded-full flex items-center justify-center">
                  <FaUser className="text-white" />
                </div>
                <div>
                  <h1 className="text-xl font-semibold text-gray-900">Welcome back!</h1>
                  <p className="text-sm text-gray-500">{userDetail?.name || "User"}</p>
                </div>
              </div>
            </div>
            <div className="flex items-center space-x-4">
              <button className="p-2 text-gray-400 hover:text-gray-600">
                <FaBell className="h-5 w-5" />
              </button>
              <Link to="/account" className="p-2 text-gray-400 hover:text-gray-600">
                <FaCog className="h-5 w-5" />
              </Link>
            </div>
          </div>
        </div>
      </div>

        {/* Main Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Tab Navigation */}
        <div className="bg-white rounded-lg shadow mb-8">
          <div className="border-b border-gray-200">
            <nav className="flex space-x-8 px-6" aria-label="Tabs">
              {dashboardTabs.map((tab) => (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  className={`py-4 px-1 border-b-2 font-medium text-sm ${
                    activeTab === tab.id
                      ? 'border-blue-500 text-blue-600'
                      : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                  }`}
                >
                  <div className="flex items-center space-x-2">
                    <tab.icon className="h-5 w-5" />
                    <span>{tab.label}</span>
                  </div>
                </button>
              ))}
            </nav>
          </div>
        </div>
        {/* Stats Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          {currentStats.map((stat, index) => (
            <div key={index} className="bg-white rounded-lg shadow p-6">
              <div className="flex items-center">
                <div className={`p-3 rounded-full ${stat.color} text-white mr-4`}>
                  <stat.icon className="h-6 w-6" />
                </div>
                <div>
                  <p className="text-sm font-medium text-gray-600">{stat.label}</p>
                  <p className="text-2xl font-semibold text-gray-900">{stat.value}</p>
                </div>
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
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
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

        {/* Recent Items */}
        <div className="bg-white rounded-lg shadow">
          <div className="px-6 py-4 border-b border-gray-200 flex justify-between items-center">
            <h2 className="text-lg font-semibold text-gray-900">
              {activeTab === "jobs" ? "Posted Jobs" : activeTab === "books" ? "Recent Books" : "Recent Posts"}
            </h2>
            <Link 
              to={activeTab === "jobs" ? "/jobs" : activeTab === "books" ? "/books/my-books" : "/my-new-ads"} 
              className="text-blue-600 hover:text-blue-800 text-sm font-medium"
            >
              View All
            </Link>
          </div>
          <div className="divide-y divide-gray-200">
            {currentItems.length > 0 ? (
              currentItems.map((item, index) => (
                <div key={index} className="p-6 hover:bg-gray-50">
                  <div className="flex items-center justify-between">
                    <div className="flex-1">
                      <div className="flex items-center space-x-3">
                        <h3 className="text-sm font-medium text-gray-900">
                          {activeTab === "jobs" ? item.title : item.title}
                        </h3>
                        <span className={`px-2 py-1 text-xs rounded-full ${
                          item.status === 'active' ? 'bg-green-100 text-green-800' :
                          item.status === 'pending' ? 'bg-yellow-100 text-yellow-800' :
                          'bg-gray-100 text-gray-800'
                        }`}>
                          {item.status}
                        </span>
                      </div>
                      {activeTab === "jobs" ? (
                        <p className="text-sm text-gray-500 mt-1">{item.company_name}</p>
                      ) : activeTab === "books" ? (
                        <p className="text-sm text-gray-500 mt-1">{item.genre}</p>
                      ) : (
                        <p className="text-sm text-gray-500 mt-1">{item.category}</p>
                      )}
                      <div className="flex items-center space-x-4 mt-2 text-xs text-gray-500">
                        <span className="flex items-center">
                          <FaEye className="mr-1" /> {item.views || 0}
                        </span>
                        {activeTab === "jobs" ? (
                          <span className="flex items-center">
                            <FaBriefcase className="mr-1" /> {item.applications_count || 0}
                          </span>
                        ) : (
                          <span className="flex items-center">
                            <FaHeart className="mr-1" /> {item.saves || 0}
                          </span>
                        )}
                        <span className="flex items-center">
                          <FaCalendarAlt className="mr-1" /> {new Date(item.posted_at || item.createdAt).toLocaleDateString()}
                        </span>
                      </div>
                    </div>
                    <div className="flex items-center space-x-2">
                      <button className="p-2 text-gray-400 hover:text-gray-600">
                        <FaEdit className="h-4 w-4" />
                      </button>
                      <button className="p-2 text-gray-400 hover:red-600">
                        <FaTrash className="h-4 w-4" />
                      </button>
                    </div>
                  </div>
                </div>
              ))
            ) : (
              <div className="p-6 text-center text-gray-500">
                {activeTab === "jobs" ? (
                  <FaBriefcase className="h-12 w-12 mx-auto mb-4 text-gray-300" />
                ) : activeTab === "books" ? (
                  <FaBook className="h-12 w-12 mx-auto mb-4 text-gray-300" />
                ) : (
                  <FaFileAlt className="h-12 w-12 mx-auto mb-4 text-gray-300" />
                )}
                <p>
                  {activeTab === "jobs" 
                    ? "No jobs posted yet. Post your first job to get started!" 
                    : activeTab === "books" 
                    ? "No books yet. Create your first book to get started!" 
                    : "No posts yet. Create your first post to get started!"
                  }
                </p>
                <Link 
                  to={activeTab === "jobs" ? "/jobs?postForm=true" : activeTab === "books" ? "/books?postForm=true" : "/post-ad"} 
                  className="mt-4 inline-flex items-center px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700"
                >
                  <FaPlus className="mr-2" />
                  {activeTab === "jobs" ? "Post Job" : activeTab === "books" ? "Create Book" : "Create Post"}
                </Link>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default UserDashboard;
