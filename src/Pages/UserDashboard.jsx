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

  useEffect(() => {
    if (logIn) {
      dispatch(getUserDashboard());
      dispatch(getCategoriesList());
      dispatch(getStore());
      dispatch(getBusinessStore());
    }
  }, [dispatch, logIn]);

  const filteredCategories = categories?.filter(
    (cat) => selectedCategory === "all" || cat.categoryName === selectedCategory
  );

  const stats = [
    { label: "Total Posts", value: dashboardData?.totalPosts || 0, icon: FaFileAlt, color: "bg-blue-500" },
    { label: "Active Posts", value: dashboardData?.activePosts || 0, icon: FaCheckCircle, color: "bg-green-500" },
    { label: "Pending Posts", value: dashboardData?.pendingPosts || 0, icon: FaClock, color: "bg-yellow-500" },
    { label: "Total Views", value: dashboardData?.totalViews || 0, icon: FaEye, color: "bg-purple-500" },
  ];

  const quickActions = [
    { label: "Post New Ad", icon: FaPlus, route: "/post-ad", color: "bg-blue-500" },
    { label: "My Store", icon: HiOutlineShoppingBag, route: "/my-store", color: "bg-green-500" },
    { label: "My Business", icon: HiOutlineOfficeBuilding, route: "/my-business", color: "bg-purple-500" },
    { label: "Account Settings", icon: FaCog, route: "/account", color: "bg-gray-500" },
  ];

  const recentPosts = dashboardData?.recentPosts || [];

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
        {/* Stats Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          {stats.map((stat, index) => (
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

        {/* Recent Posts */}
        <div className="bg-white rounded-lg shadow">
          <div className="px-6 py-4 border-b border-gray-200 flex justify-between items-center">
            <h2 className="text-lg font-semibold text-gray-900">Recent Posts</h2>
            <Link to="/my-new-ads" className="text-blue-600 hover:text-blue-800 text-sm font-medium">
              View All
            </Link>
          </div>
          <div className="divide-y divide-gray-200">
            {recentPosts.length > 0 ? (
              recentPosts.map((post, index) => (
                <div key={index} className="p-6 hover:bg-gray-50">
                  <div className="flex items-center justify-between">
                    <div className="flex-1">
                      <div className="flex items-center space-x-3">
                        <h3 className="text-sm font-medium text-gray-900">{post.title}</h3>
                        <span className={`px-2 py-1 text-xs rounded-full ${
                          post.status === 'active' ? 'bg-green-100 text-green-800' :
                          post.status === 'pending' ? 'bg-yellow-100 text-yellow-800' :
                          'bg-gray-100 text-gray-800'
                        }`}>
                          {post.status}
                        </span>
                      </div>
                      <p className="text-sm text-gray-500 mt-1">{post.category}</p>
                      <div className="flex items-center space-x-4 mt-2 text-xs text-gray-500">
                        <span className="flex items-center">
                          <FaEye className="mr-1" /> {post.views || 0}
                        </span>
                        <span className="flex items-center">
                          <FaCalendarAlt className="mr-1" /> {new Date(post.createdAt).toLocaleDateString()}
                        </span>
                      </div>
                    </div>
                    <div className="flex items-center space-x-2">
                      <button className="p-2 text-gray-400 hover:text-gray-600">
                        <FaEdit className="h-4 w-4" />
                      </button>
                      <button className="p-2 text-gray-400 hover:text-red-600">
                        <FaTrash className="h-4 w-4" />
                      </button>
                    </div>
                  </div>
                </div>
              ))
            ) : (
              <div className="p-6 text-center text-gray-500">
                <FaFileAlt className="h-12 w-12 mx-auto mb-4 text-gray-300" />
                <p>No posts yet. Create your first post to get started!</p>
                <Link to="/post-ad" className="mt-4 inline-flex items-center px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700">
                  <FaPlus className="mr-2" />
                  Create Post
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
