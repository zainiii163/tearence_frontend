import React, { useEffect, useState, useMemo } from "react";
import { useDispatch, useSelector } from "react-redux";
import { getJobsList } from "../slice/JobSlice";
import { getCandidatesList } from "../slice/CandidateSlice";
// import { getAdminDashboard } from "../slice/DashboardSlice"; // Commented out as unused
import {
  getUsersList,
  updateUserRole,
  activateUser,
  deactivateUser,
  deleteUser,
} from "../slice/UserSlice";
// import {
//   getRevenueAnalytics,
//   getJobAnalytics,
//   getCandidateAnalytics,
//   getOverviewAnalytics,
// } from "../slice/AnalyticsSlice"; // Commented out as unused
import {
  FaBriefcase,
  FaUsers,
  FaDollarSign,
  FaCheckCircle,
  FaTimesCircle,
  FaClock,
  FaStar,
  FaRocket,
  FaSearch,
  FaDownload,
  FaArrowUp,
  FaArrowDown,
  FaTrash,
  FaExclamationTriangle,
  FaGavel,
} from "react-icons/fa";
import Navbar from "../Component/Navbar";
import Footer from "../Component/Footer";
import { Link } from "react-router-dom";
import toast from "react-hot-toast";

const SuperAdminDashboard = () => {
  const dispatch = useDispatch();
  const { jobsList, loading: jobsLoading } = useSelector((store) => store.jobs);
  const { candidatesList, loading: candidatesLoading } = useSelector((store) => store.candidates);
  const { usersList, loading: usersLoading } = useSelector((store) => store.users);
  const [activeTab, setActiveTab] = useState("overview");
  const [searchQuery, setSearchQuery] = useState("");
  const [filterStatus, setFilterStatus] = useState("all");
  const [revenuePeriod, setRevenuePeriod] = useState("30d"); // 7d, 30d, 90d, all
  // const [dateRange, setDateRange] = useState({ start: null, end: null }); // Commented out as unused
  const [userSearchQuery, setUserSearchQuery] = useState("");
  const [userRoleFilter, setUserRoleFilter] = useState("all");
  // const [currentUserPage, setCurrentUserPage] = useState(1); // Commented out as unused

  // Helper function to format location
  const formatLocation = (location) => {
    if (!location) return "";
    // If location is a string, return it directly
    if (typeof location === "string") return location;
    // If location is an object, format it
    if (typeof location === "object") {
      const parts = [];
      if (location.city) parts.push(location.city);
      if (location.zone_name) parts.push(location.zone_name);
      if (location.country_name) parts.push(location.country_name);
      return parts.length > 0 ? parts.join(", ") : location.city || location.zone_name || location.country_name || "";
    }
    return "";
  };

  useEffect(() => {
    dispatch(getJobsList({ limit: 100 }));
    dispatch(getCandidatesList({ limit: 100 }));
  }, [dispatch]);

  // Fetch users when user management tab is active
  useEffect(() => {
    if (activeTab === "users") {
      dispatch(getUsersList({
        page: 1, // Fixed page since currentUserPage is unused
        per_page: 20,
        search: userSearchQuery || undefined,
        role: userRoleFilter !== "all" ? userRoleFilter : undefined,
      }));
    }
  }, [dispatch, activeTab, userSearchQuery, userRoleFilter]);

  const jobs = useMemo(() => jobsList?.items || [], [jobsList]);
  const candidates = useMemo(() => candidatesList?.items || [], [candidatesList]);
  const users = useMemo(() => usersList?.items || [], [usersList]);

  // Filter users based on search
  const filteredUsers = users.filter((user) => {
    const matchesSearch = userSearchQuery
      ? (user.email?.toLowerCase().includes(userSearchQuery.toLowerCase()) ||
         user.name?.toLowerCase().includes(userSearchQuery.toLowerCase()) ||
         user.first_name?.toLowerCase().includes(userSearchQuery.toLowerCase()) ||
         user.last_name?.toLowerCase().includes(userSearchQuery.toLowerCase()))
      : true;
    const matchesRole = userRoleFilter === "all" ? true : user.role === userRoleFilter;
    return matchesSearch && matchesRole;
  });

  // User stats
  const userStats = {
    total: usersList?.total || users.length,
    active: users.filter((u) => u.status === "active" || u.is_active).length,
    pending: users.filter((u) => u.status === "pending").length,
    suspended: users.filter((u) => u.status === "suspended" || u.status === "inactive").length,
  };

  const handleRoleChange = async (userId, newRole) => {
    try {
      await dispatch(updateUserRole({ userId, role: newRole })).unwrap();
      toast.success("User role updated successfully");
    } catch (error) {
      toast.error(error?.message || "Failed to update user role");
    }
  };

  const handleActivateUser = async (userId) => {
    try {
      await dispatch(activateUser(userId)).unwrap();
      toast.success("User activated successfully");
    } catch (error) {
      toast.error(error?.message || "Failed to activate user");
    }
  };

  const handleDeactivateUser = async (userId) => {
    try {
      await dispatch(deactivateUser(userId)).unwrap();
      toast.success("User deactivated successfully");
    } catch (error) {
      toast.error(error?.message || "Failed to deactivate user");
    }
  };

  const handleDeleteUser = async (userId) => {
    if (window.confirm("Are you sure you want to delete this user? This action cannot be undone.")) {
      try {
        await dispatch(deleteUser(userId)).unwrap();
        toast.success("User deleted successfully");
      } catch (error) {
        toast.error(error?.message || "Failed to delete user");
      }
    }
  };

  // Filter jobs
  const filteredJobs = jobs.filter((job) => {
    const matchesSearch = searchQuery
      ? job.title?.toLowerCase().includes(searchQuery.toLowerCase()) ||
        job.company_name?.toLowerCase().includes(searchQuery.toLowerCase())
      : true;
    const matchesStatus =
      filterStatus === "all" ? true : job.status === filterStatus;
    return matchesSearch && matchesStatus;
  });

  // Enhanced Statistics with time-based calculations
  const stats = useMemo(() => {
    const now = new Date();
    const periodStart = new Date();
    
    switch (revenuePeriod) {
      case "7d":
        periodStart.setDate(now.getDate() - 7);
        break;
      case "30d":
        periodStart.setDate(now.getDate() - 30);
        break;
      case "90d":
        periodStart.setDate(now.getDate() - 90);
        break;
      default:
        periodStart.setFullYear(2000); // All time
    }

    const recentJobs = jobs.filter((j) => new Date(j.created_at) >= periodStart);
    const recentCandidates = candidates.filter((c) => new Date(c.created_at) >= periodStart);

    // Calculate revenue from upsells
    const jobRevenue = jobs.reduce((sum, j) => {
      let revenue = 0;
      if (j.is_featured) revenue += 29.99;
      if (j.upsells?.suggested) revenue += 49.99;
      return sum + revenue;
    }, 0);

    const candidateRevenue = candidates.reduce((sum, c) => {
      let revenue = 0;
      if (c.is_featured) revenue += 19.99;
      if (c.has_job_alerts_boost) revenue += 14.99;
      return sum + revenue;
    }, 0);

    const totalRevenue = jobRevenue + candidateRevenue;

    // Calculate trends (mock data - would come from backend)
    const previousPeriodRevenue = totalRevenue * 0.85; // Simulated
    const revenueTrend = totalRevenue - previousPeriodRevenue;
    const revenueTrendPercent = previousPeriodRevenue > 0 
      ? ((revenueTrend / previousPeriodRevenue) * 100).toFixed(1)
      : 0;

    return {
      totalJobs: jobs.length,
      activeJobs: jobs.filter((j) => j.status === "active").length,
      pendingJobs: jobs.filter((j) => j.status === "pending").length,
      inactiveJobs: jobs.filter((j) => j.status === "inactive").length,
      totalCandidates: candidates.length,
      featuredJobs: jobs.filter((j) => j.is_featured).length,
      featuredCandidates: candidates.filter((c) => c.is_featured).length,
      totalRevenue,
      jobRevenue,
      candidateRevenue,
      revenueTrend,
      revenueTrendPercent,
      recentJobs: recentJobs.length,
      recentCandidates: recentCandidates.length,
      newJobsToday: jobs.filter((j) => {
        const jobDate = new Date(j.created_at);
        return jobDate.toDateString() === now.toDateString();
      }).length,
      newCandidatesToday: candidates.filter((c) => {
        const candidateDate = new Date(c.created_at);
        return candidateDate.toDateString() === now.toDateString();
      }).length,
    };
  }, [jobs, candidates, revenuePeriod]);

  const revenueStats = [
    {
      label: "Job Upsells",
      value: `$${stats.totalRevenue.toFixed(2)}`,
      icon: <FaBriefcase className="h-5 w-5" />,
      color: "bg-blue-500",
    },
    {
      label: "Featured Jobs",
      value: stats.featuredJobs,
      icon: <FaStar className="h-5 w-5" />,
      color: "bg-yellow-500",
    },
    {
      label: "Featured Candidates",
      value: stats.featuredCandidates,
      icon: <FaRocket className="h-5 w-5" />,
      color: "bg-purple-500",
    },
    {
      label: "Total Users",
      value: stats.totalCandidates + stats.totalJobs,
      icon: <FaUsers className="h-5 w-5" />,
      color: "bg-green-500",
    },
  ];

  const getStatusBadge = (status) => {
    const badges = {
      active: (
        <span className="inline-flex items-center rounded-full bg-green-100 px-2.5 py-0.5 text-xs font-medium text-green-800">
          <FaCheckCircle className="mr-1 h-3 w-3" />
          Active
        </span>
      ),
      pending: (
        <span className="inline-flex items-center rounded-full bg-yellow-100 px-2.5 py-0.5 text-xs font-medium text-yellow-800">
          <FaClock className="mr-1 h-3 w-3" />
          Pending
        </span>
      ),
      inactive: (
        <span className="inline-flex items-center rounded-full bg-red-100 px-2.5 py-0.5 text-xs font-medium text-red-800">
          <FaTimesCircle className="mr-1 h-3 w-3" />
          Inactive
        </span>
      ),
    };
    return badges[status] || badges.pending;
  };

  return (
    <div className="min-h-screen bg-background">
      <Navbar />

      <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="max-w-7xl mx-auto">
          {/* Header */}
          <div className="mb-8">
            <h1 className="text-3xl font-bold">Super Admin Dashboard</h1>
            <p className="text-muted-foreground mt-2">
              Manage jobs, candidates, and monitor platform performance
            </p>
          </div>

          {/* Stats Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
            {revenueStats.map((stat, index) => (
              <div
                key={index}
                className="rounded-lg border bg-card p-6 shadow-sm hover:shadow-md transition-shadow"
              >
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-muted-foreground">{stat.label}</p>
                    <p className="text-2xl font-bold mt-2">{stat.value}</p>
                  </div>
                  <div className={`${stat.color} text-white p-3 rounded-lg`}>
                    {stat.icon}
                  </div>
                </div>
              </div>
            ))}
          </div>

          {/* Overview Stats */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
            <div className="rounded-lg border bg-card p-6">
              <div className="flex items-center justify-between mb-2">
                <span className="text-sm text-muted-foreground">Total Jobs</span>
                <FaBriefcase className="h-5 w-5 text-muted-foreground" />
              </div>
              <p className="text-3xl font-bold">{stats.totalJobs}</p>
              <div className="mt-4 flex gap-2 text-sm">
                <span className="text-green-600">{stats.activeJobs} active</span>
                <span className="text-yellow-600">{stats.pendingJobs} pending</span>
              </div>
            </div>
            <div className="rounded-lg border bg-card p-6">
              <div className="flex items-center justify-between mb-2">
                <span className="text-sm text-muted-foreground">Total Candidates</span>
                <FaUsers className="h-5 w-5 text-muted-foreground" />
              </div>
              <p className="text-3xl font-bold">{stats.totalCandidates}</p>
            </div>
            <div className="rounded-lg border bg-card p-6">
              <div className="flex items-center justify-between mb-2">
                <span className="text-sm text-muted-foreground">Total Revenue</span>
                <FaDollarSign className="h-5 w-5 text-muted-foreground" />
              </div>
              <p className="text-3xl font-bold">${stats.totalRevenue.toFixed(2)}</p>
            </div>
          </div>

          {/* Tabs */}
          <div className="mb-6 border-b">
            <nav className="flex space-x-8">
              {[
                { id: "overview", label: "Overview" },
                { id: "jobs", label: "Job Management" },
                { id: "candidates", label: "Candidate Management" },
                { id: "users", label: "User Management" },
                { id: "payments", label: "Payment Systems" },
                { id: "analytics", label: "Analytics" },
                { id: "moderation", label: "Ad Moderation" },
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
              <div className="space-y-6">
                <div className="rounded-lg border bg-card p-6">
                  <h2 className="text-xl font-semibold mb-4">Recent Activity</h2>
                  <div className="space-y-4">
                    {jobs.slice(0, 5).map((job) => (
                      <div
                        key={job.id}
                        className="flex items-center justify-between p-4 rounded-lg border"
                      >
                        <div>
                          <p className="font-medium">{job.title}</p>
                          <p className="text-sm text-muted-foreground">
                            {job.company_name} • {new Date(job.created_at).toLocaleDateString()}
                          </p>
                        </div>
                        {getStatusBadge(job.status)}
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            )}

            {/* Jobs Management Tab */}
            {activeTab === "jobs" && (
              <div className="rounded-lg border bg-card p-6">
                <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-6">
                  <h2 className="text-xl font-semibold">Job Management</h2>
                  <div className="flex gap-2 w-full sm:w-auto">
                    <div className="relative flex-1 sm:flex-initial">
                      <FaSearch className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                      <input
                        type="text"
                        placeholder="Search jobs..."
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                        className="flex h-10 w-full sm:w-64 rounded-md border border-input bg-background pl-10 pr-3 py-2 text-sm ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
                      />
                    </div>
                    <select
                      value={filterStatus}
                      onChange={(e) => setFilterStatus(e.target.value)}
                      className="flex h-10 rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
                    >
                      <option value="all">All Status</option>
                      <option value="active">Active</option>
                      <option value="pending">Pending</option>
                      <option value="inactive">Inactive</option>
                    </select>
                  </div>
                </div>

                {jobsLoading ? (
                  <div className="flex justify-center py-12">
                    <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
                  </div>
                ) : filteredJobs.length > 0 ? (
                  <div className="space-y-4">
                    {filteredJobs.map((job) => (
                      <div
                        key={job.id}
                        className="flex flex-col sm:flex-row items-start sm:items-center justify-between p-4 rounded-lg border hover:bg-accent/50 transition-colors"
                      >
                        <div className="flex-1">
                          <div className="flex items-center gap-3 mb-2">
                            <h3 className="font-semibold">{job.title}</h3>
                            {job.is_featured && (
                              <span className="inline-flex items-center rounded-full bg-yellow-100 px-2 py-0.5 text-xs font-medium text-yellow-800">
                                <FaStar className="mr-1 h-3 w-3" />
                                Featured
                              </span>
                            )}
                            {job.upsells?.suggested && (
                              <span className="inline-flex items-center rounded-full bg-purple-100 px-2 py-0.5 text-xs font-medium text-purple-800">
                                <FaRocket className="mr-1 h-3 w-3" />
                                Suggested
                              </span>
                            )}
                          </div>
                          <p className="text-sm text-muted-foreground">
                            {job.company_name} • {formatLocation(job.location)} • {job.job_type}
                          </p>
                          <p className="text-xs text-muted-foreground mt-1">
                            Posted: {new Date(job.created_at).toLocaleDateString()}
                          </p>
                        </div>
                        <div className="flex items-center gap-2 mt-4 sm:mt-0">
                          {getStatusBadge(job.status)}
                          <button className="text-sm text-primary hover:underline">
                            View Details
                          </button>
                        </div>
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="text-center py-12">
                    <FaBriefcase className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                    <p className="text-muted-foreground">No jobs found</p>
                  </div>
                )}
              </div>
            )}

            {/* Candidates Management Tab */}
            {activeTab === "candidates" && (
              <div className="rounded-lg border bg-card p-6">
                <h2 className="text-xl font-semibold mb-6">Candidate Management</h2>
                {candidatesLoading ? (
                  <div className="flex justify-center py-12">
                    <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
                  </div>
                ) : candidates.length > 0 ? (
                  <div className="space-y-4">
                    {candidates.map((candidate) => (
                      <div
                        key={candidate.id}
                        className="flex flex-col sm:flex-row items-start sm:items-center justify-between p-4 rounded-lg border hover:bg-accent/50 transition-colors"
                      >
                        <div className="flex-1">
                          <div className="flex items-center gap-3 mb-2">
                            <h3 className="font-semibold">{candidate.headline}</h3>
                            {candidate.is_featured && (
                              <span className="inline-flex items-center rounded-full bg-yellow-100 px-2 py-0.5 text-xs font-medium text-yellow-800">
                                <FaStar className="mr-1 h-3 w-3" />
                                Featured
                              </span>
                            )}
                          </div>
                          <p className="text-sm text-muted-foreground">
                            {formatLocation(candidate.location)} • {candidate.skills?.join(", ") || "No skills"}
                          </p>
                          <p className="text-xs text-muted-foreground mt-1">
                            Created: {new Date(candidate.created_at).toLocaleDateString()}
                          </p>
                        </div>
                        <div className="flex items-center gap-2 mt-4 sm:mt-0">
                          <span className="text-sm text-muted-foreground">
                            {candidate.visibility === "public" ? "Public" : "Private"}
                          </span>
                          <button className="text-sm text-primary hover:underline">
                            View Profile
                          </button>
                        </div>
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="text-center py-12">
                    <FaUsers className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                    <p className="text-muted-foreground">No candidates found</p>
                  </div>
                )}
              </div>
            )}

            {/* User Management Tab */}
            {activeTab === "users" && (
              <div className="rounded-lg border bg-card p-6">
                <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-6">
                  <div>
                    <h2 className="text-xl font-semibold">User Management</h2>
                    <p className="text-sm text-muted-foreground mt-1">
                      Manage users, assign roles, and control access permissions
                    </p>
                  </div>
                  <div className="flex gap-2 w-full sm:w-auto">
                    <div className="relative flex-1 sm:flex-initial">
                      <FaSearch className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                      <input
                        type="text"
                        placeholder="Search users by name or email..."
                        value={userSearchQuery}
                        onChange={(e) => setUserSearchQuery(e.target.value)}
                        className="flex h-10 w-full sm:w-64 rounded-md border border-input bg-background pl-10 pr-3 py-2 text-sm ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
                      />
                    </div>
                    <select
                      value={userRoleFilter}
                      onChange={(e) => setUserRoleFilter(e.target.value)}
                      className="flex h-10 rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
                    >
                      <option value="all">All Roles</option>
                      <option value="user">Regular User</option>
                      <option value="admin">Admin</option>
                      <option value="super_admin">Super Admin</option>
                      <option value="moderator">Moderator</option>
                    </select>
                  </div>
                </div>

                {/* User Stats */}
                <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
                  <div className="rounded-lg border bg-muted/30 p-4">
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="text-sm text-muted-foreground">Total Users</p>
                        <p className="text-2xl font-bold mt-1">{stats.totalCandidates + stats.totalJobs}</p>
                      </div>
                      <FaUsers className="h-8 w-8 text-muted-foreground opacity-50" />
                    </div>
                  </div>
                  <div className="rounded-lg border bg-green-50 p-4">
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="text-sm text-muted-foreground">Active Users</p>
                        <p className="text-2xl font-bold mt-1 text-green-600">0</p>
                      </div>
                      <FaCheckCircle className="h-8 w-8 text-green-600 opacity-50" />
                    </div>
                  </div>
                  <div className="rounded-lg border bg-yellow-50 p-4">
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="text-sm text-muted-foreground">Pending</p>
                        <p className="text-2xl font-bold mt-1 text-yellow-600">0</p>
                      </div>
                      <FaClock className="h-8 w-8 text-yellow-600 opacity-50" />
                    </div>
                  </div>
                  <div className="rounded-lg border bg-red-50 p-4">
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="text-sm text-muted-foreground">Suspended</p>
                        <p className="text-2xl font-bold mt-1 text-red-600">0</p>
                      </div>
                      <FaTimesCircle className="h-8 w-8 text-red-600 opacity-50" />
                    </div>
                  </div>
                </div>

                {/* User Stats */}
                <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
                  <div className="rounded-lg border bg-muted/30 p-4">
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="text-sm text-muted-foreground">Total Users</p>
                        <p className="text-2xl font-bold mt-1">{userStats.total}</p>
                      </div>
                      <FaUsers className="h-8 w-8 text-muted-foreground opacity-50" />
                    </div>
                  </div>
                  <div className="rounded-lg border bg-green-50 p-4">
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="text-sm text-muted-foreground">Active Users</p>
                        <p className="text-2xl font-bold mt-1 text-green-600">{userStats.active}</p>
                      </div>
                      <FaCheckCircle className="h-8 w-8 text-green-600 opacity-50" />
                    </div>
                  </div>
                  <div className="rounded-lg border bg-yellow-50 p-4">
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="text-sm text-muted-foreground">Pending</p>
                        <p className="text-2xl font-bold mt-1 text-yellow-600">{userStats.pending}</p>
                      </div>
                      <FaClock className="h-8 w-8 text-yellow-600 opacity-50" />
                    </div>
                  </div>
                  <div className="rounded-lg border bg-red-50 p-4">
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="text-sm text-muted-foreground">Suspended</p>
                        <p className="text-2xl font-bold mt-1 text-red-600">{userStats.suspended}</p>
                      </div>
                      <FaTimesCircle className="h-8 w-8 text-red-600 opacity-50" />
                    </div>
                  </div>
                </div>

                {/* User List */}
                {usersLoading ? (
                  <div className="flex justify-center py-12">
                    <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
                  </div>
                ) : filteredUsers.length > 0 ? (
                  <div className="space-y-4">
                    {filteredUsers.map((user) => {
                      const userId = user.id || user.user_id || user.customer_id;
                      const userRole = user.role || "user";
                      const userStatus = user.status || (user.is_active ? "active" : "inactive");
                      
                      return (
                        <div
                          key={userId}
                          className="flex flex-col sm:flex-row items-start sm:items-center justify-between p-4 rounded-lg border hover:bg-accent/50 transition-colors"
                        >
                          <div className="flex-1 mb-4 sm:mb-0">
                            <div className="flex items-center gap-3 mb-2">
                              <h3 className="font-semibold">
                                {user.name || `${user.first_name || ""} ${user.last_name || ""}`.trim() || "User"}
                              </h3>
                              <span className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium ${
                                userRole === "super_admin" ? "bg-purple-100 text-purple-800" :
                                userRole === "admin" ? "bg-blue-100 text-blue-800" :
                                userRole === "moderator" ? "bg-green-100 text-green-800" :
                                "bg-gray-100 text-gray-800"
                              }`}>
                                {userRole || "user"}
                              </span>
                              {getStatusBadge(userStatus)}
                            </div>
                            <p className="text-sm text-muted-foreground">{user.email}</p>
                            <p className="text-xs text-muted-foreground mt-1">
                              Joined: {user.created_at ? new Date(user.created_at).toLocaleDateString() : "N/A"}
                            </p>
                          </div>
                          <div className="flex items-center gap-2 flex-wrap">
                            <select
                              value={userRole}
                              onChange={(e) => handleRoleChange(userId, e.target.value)}
                              className="flex h-9 rounded-md border border-input bg-background px-2 py-1 text-xs ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
                            >
                              <option value="user">User</option>
                              <option value="moderator">Moderator</option>
                              <option value="admin">Admin</option>
                              <option value="super_admin">Super Admin</option>
                            </select>
                            {userStatus === "active" || user.is_active ? (
                              <button
                                onClick={() => handleDeactivateUser(userId)}
                                className="inline-flex items-center justify-center whitespace-nowrap rounded-md text-xs font-medium border border-input bg-background hover:bg-accent hover:text-accent-foreground h-9 px-3"
                              >
                                Deactivate
                              </button>
                            ) : (
                              <button
                                onClick={() => handleActivateUser(userId)}
                                className="inline-flex items-center justify-center whitespace-nowrap rounded-md text-xs font-medium bg-green-600 text-white hover:bg-green-700 h-9 px-3"
                              >
                                Activate
                              </button>
                            )}
                            <button
                              onClick={() => handleDeleteUser(userId)}
                              className="inline-flex items-center justify-center whitespace-nowrap rounded-md text-xs font-medium border border-red-300 bg-background text-red-600 hover:bg-red-50 h-9 px-3"
                            >
                              <FaTrash className="h-3 w-3 mr-1" />
                              Delete
                            </button>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                ) : (
                  <div className="text-center py-12">
                    <FaUsers className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                    <p className="text-muted-foreground">No users found</p>
                  </div>
                )}
              </div>
            )}

            {/* Payment Systems Tab */}
            {activeTab === "payments" && (
              <div className="space-y-6">
                <div className="flex items-center justify-between">
                  <div>
                    <h2 className="text-2xl font-bold">Payment Systems Management</h2>
                    <p className="text-sm text-muted-foreground mt-1">
                      Monitor and manage payment transactions, refunds, and payment provider settings
                    </p>
                  </div>
                </div>

                {/* Payment Stats */}
                <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                  <div className="rounded-lg border bg-card p-6">
                    <div className="flex items-center justify-between mb-2">
                      <span className="text-sm text-muted-foreground">Total Transactions</span>
                      <FaDollarSign className="h-5 w-5 text-blue-600" />
                    </div>
                    <p className="text-3xl font-bold">{stats.totalJobs + stats.totalCandidates}</p>
                    <p className="text-xs text-muted-foreground mt-2">All time</p>
                  </div>
                  <div className="rounded-lg border bg-card p-6">
                    <div className="flex items-center justify-between mb-2">
                      <span className="text-sm text-muted-foreground">Successful Payments</span>
                      <FaCheckCircle className="h-5 w-5 text-green-600" />
                    </div>
                    <p className="text-3xl font-bold text-green-600">${stats.totalRevenue.toFixed(2)}</p>
                    <p className="text-xs text-muted-foreground mt-2">Completed transactions</p>
                  </div>
                  <div className="rounded-lg border bg-card p-6">
                    <div className="flex items-center justify-between mb-2">
                      <span className="text-sm text-muted-foreground">Pending Payments</span>
                      <FaClock className="h-5 w-5 text-yellow-600" />
                    </div>
                    <p className="text-3xl font-bold text-yellow-600">$0.00</p>
                    <p className="text-xs text-muted-foreground mt-2">Awaiting confirmation</p>
                  </div>
                  <div className="rounded-lg border bg-card p-6">
                    <div className="flex items-center justify-between mb-2">
                      <span className="text-sm text-muted-foreground">Failed Payments</span>
                      <FaTimesCircle className="h-5 w-5 text-red-600" />
                    </div>
                    <p className="text-3xl font-bold text-red-600">$0.00</p>
                    <p className="text-xs text-muted-foreground mt-2">Requires attention</p>
                  </div>
                </div>

                {/* Payment Methods */}
                <div className="rounded-lg border bg-card p-6">
                  <h3 className="text-lg font-semibold mb-4">Payment Methods</h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="p-4 rounded-lg border bg-muted/30">
                      <div className="flex items-center justify-between mb-2">
                        <span className="font-medium">PayPal</span>
                        <FaCheckCircle className="h-5 w-5 text-green-600" />
                      </div>
                      <p className="text-sm text-muted-foreground">Status: Active</p>
                      <p className="text-xs text-muted-foreground mt-1">Configured and operational</p>
                    </div>
                    <div className="p-4 rounded-lg border bg-muted/30">
                      <div className="flex items-center justify-between mb-2">
                        <span className="font-medium">Stripe</span>
                        <FaCheckCircle className="h-5 w-5 text-green-600" />
                      </div>
                      <p className="text-sm text-muted-foreground">Status: Active</p>
                      <p className="text-xs text-muted-foreground mt-1">Configured and operational</p>
                    </div>
                  </div>
                </div>

                {/* Recent Transactions */}
                <div className="rounded-lg border bg-card p-6">
                  <div className="flex items-center justify-between mb-4">
                    <h3 className="text-lg font-semibold">Recent Transactions</h3>
                    <button className="inline-flex items-center justify-center whitespace-nowrap rounded-md text-sm font-medium border border-input bg-background hover:bg-accent hover:text-accent-foreground h-9 px-4">
                      <FaDownload className="h-4 w-4 mr-2" />
                      Export
                    </button>
                  </div>
                  <div className="space-y-3">
                    {/* Mock transaction data - would come from backend */}
                    {[
                      { id: "TXN-001", type: "Job Featured", user: "John Doe", amount: 29.99, status: "completed", date: "2 hours ago" },
                      { id: "TXN-002", type: "Job Suggested", user: "Jane Smith", amount: 49.99, status: "completed", date: "5 hours ago" },
                      { id: "TXN-003", type: "Profile Featured", user: "Bob Johnson", amount: 19.99, status: "pending", date: "1 day ago" },
                      { id: "TXN-004", type: "Job Alerts Boost", user: "Alice Brown", amount: 14.99, status: "completed", date: "2 days ago" },
                    ].map((transaction) => (
                      <div key={transaction.id} className="flex items-center justify-between p-4 rounded-lg border hover:bg-accent/50 transition-colors">
                        <div className="flex-1">
                          <div className="flex items-center gap-3 mb-1">
                            <h4 className="font-medium">{transaction.type}</h4>
                            <span className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium ${
                              transaction.status === "completed" ? "bg-green-100 text-green-800" :
                              transaction.status === "pending" ? "bg-yellow-100 text-yellow-800" :
                              "bg-red-100 text-red-800"
                            }`}>
                              {transaction.status}
                            </span>
                          </div>
                          <p className="text-sm text-muted-foreground">
                            {transaction.user} • {transaction.date}
                          </p>
                        </div>
                        <div className="text-right">
                          <p className="font-bold text-lg">${transaction.amount.toFixed(2)}</p>
                          <p className="text-xs text-muted-foreground">{transaction.id}</p>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Payment Settings */}
                <div className="rounded-lg border bg-card p-6">
                  <h3 className="text-lg font-semibold mb-4">Payment Settings</h3>
                  <div className="space-y-4">
                    <div className="flex items-center justify-between p-4 rounded-lg border">
                      <div>
                        <p className="font-medium">Auto-refund on cancellation</p>
                        <p className="text-sm text-muted-foreground">Automatically process refunds when upsells are cancelled</p>
                      </div>
                      <label className="relative inline-flex items-center cursor-pointer">
                        <input type="checkbox" className="sr-only peer" defaultChecked />
                        <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-primary/20 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-primary"></div>
                      </label>
                    </div>
                    <div className="flex items-center justify-between p-4 rounded-lg border">
                      <div>
                        <p className="font-medium">Email notifications</p>
                        <p className="text-sm text-muted-foreground">Send email notifications for payment events</p>
                      </div>
                      <label className="relative inline-flex items-center cursor-pointer">
                        <input type="checkbox" className="sr-only peer" defaultChecked />
                        <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-primary/20 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-primary"></div>
                      </label>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* Analytics Tab */}
            {activeTab === "analytics" && (
              <div className="space-y-6">
                {/* Revenue Period Selector */}
                <div className="flex items-center justify-between">
                  <h2 className="text-2xl font-bold">Analytics & Revenue</h2>
                  <div className="flex items-center gap-2">
                    <select
                      value={revenuePeriod}
                      onChange={(e) => setRevenuePeriod(e.target.value)}
                      className="flex h-10 rounded-md border border-input bg-background px-3 py-2 text-sm"
                    >
                      <option value="7d">Last 7 days</option>
                      <option value="30d">Last 30 days</option>
                      <option value="90d">Last 90 days</option>
                      <option value="all">All time</option>
                    </select>
                    <button className="inline-flex items-center justify-center whitespace-nowrap rounded-md text-sm font-medium border border-input bg-background hover:bg-accent hover:text-accent-foreground h-10 px-4">
                      <FaDownload className="h-4 w-4 mr-2" />
                      Export
                    </button>
                  </div>
                </div>

                {/* Revenue Overview Cards */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                  <div className="rounded-lg border bg-card p-6">
                    <div className="flex items-center justify-between mb-2">
                      <span className="text-sm text-muted-foreground">Total Revenue</span>
                      <FaDollarSign className="h-5 w-5 text-green-600" />
                    </div>
                    <p className="text-3xl font-bold text-green-600">${stats.totalRevenue.toFixed(2)}</p>
                    <div className="flex items-center gap-2 mt-2">
                      {stats.revenueTrend >= 0 ? (
                        <span className="text-xs font-medium text-green-600 flex items-center gap-1">
                          <FaArrowUp className="h-3 w-3" />
                          +{stats.revenueTrendPercent}%
                        </span>
                      ) : (
                        <span className="text-xs font-medium text-red-600 flex items-center gap-1">
                          <FaArrowDown className="h-3 w-3" />
                          {stats.revenueTrendPercent}%
                        </span>
                      )}
                      <span className="text-xs text-muted-foreground">vs previous period</span>
                    </div>
                  </div>
                  <div className="rounded-lg border bg-card p-6">
                    <div className="flex items-center justify-between mb-2">
                      <span className="text-sm text-muted-foreground">Job Revenue</span>
                      <FaBriefcase className="h-5 w-5 text-blue-600" />
                    </div>
                    <p className="text-3xl font-bold">${stats.jobRevenue.toFixed(2)}</p>
                    <p className="text-xs text-muted-foreground mt-2">
                      {stats.featuredJobs} featured + {jobs.filter((j) => j.upsells?.suggested).length} suggested
                    </p>
                  </div>
                  <div className="rounded-lg border bg-card p-6">
                    <div className="flex items-center justify-between mb-2">
                      <span className="text-sm text-muted-foreground">Candidate Revenue</span>
                      <FaUsers className="h-5 w-5 text-purple-600" />
                    </div>
                    <p className="text-3xl font-bold">${stats.candidateRevenue.toFixed(2)}</p>
                    <p className="text-xs text-muted-foreground mt-2">
                      {stats.featuredCandidates} featured + {candidates.filter((c) => c.has_job_alerts_boost).length} boosts
                    </p>
                  </div>
                  <div className="rounded-lg border bg-card p-6">
                    <div className="flex items-center justify-between mb-2">
                      <span className="text-sm text-muted-foreground">New Today</span>
                      <FaClock className="h-5 w-5 text-yellow-600" />
                    </div>
                    <p className="text-3xl font-bold">{stats.newJobsToday + stats.newCandidatesToday}</p>
                    <p className="text-xs text-muted-foreground mt-2">
                      {stats.newJobsToday} jobs, {stats.newCandidatesToday} candidates
                    </p>
                  </div>
                </div>

                {/* Detailed Analytics */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                  <div className="rounded-lg border bg-card p-6">
                    <h3 className="text-lg font-semibold mb-4 flex items-center gap-2">
                      <FaDollarSign className="h-5 w-5 text-green-600" />
                      Revenue Overview
                    </h3>
                    <div className="space-y-3">
                      <div className="flex justify-between items-center">
                        <span className="text-muted-foreground">Total Revenue</span>
                        <span className="font-bold text-lg text-green-600">${stats.totalRevenue.toFixed(2)}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-muted-foreground">Job Upsells</span>
                        <span className="font-semibold">${stats.jobRevenue.toFixed(2)}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-muted-foreground">Candidate Upsells</span>
                        <span className="font-semibold">${stats.candidateRevenue.toFixed(2)}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-muted-foreground">Period</span>
                        <span className="font-semibold capitalize">{revenuePeriod === "all" ? "All Time" : revenuePeriod}</span>
                      </div>
                    </div>
                  </div>
                  <div className="rounded-lg border bg-card p-6">
                    <h3 className="text-lg font-semibold mb-4 flex items-center gap-2">
                      <FaBriefcase className="h-5 w-5 text-blue-600" />
                      Job Statistics
                    </h3>
                    <div className="space-y-3">
                      <div className="flex justify-between">
                        <span className="text-muted-foreground">Total Jobs</span>
                        <span className="font-semibold">{stats.totalJobs}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-green-600">Active Jobs</span>
                        <span className="font-semibold text-green-600">{stats.activeJobs}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-yellow-600">Pending Jobs</span>
                        <span className="font-semibold text-yellow-600">{stats.pendingJobs}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-muted-foreground">Featured Jobs</span>
                        <span className="font-semibold">{stats.featuredJobs}</span>
                      </div>
                    </div>
                  </div>
                  <div className="rounded-lg border bg-card p-6">
                    <h3 className="text-lg font-semibold mb-4 flex items-center gap-2">
                      <FaUsers className="h-5 w-5 text-purple-600" />
                      Candidate Statistics
                    </h3>
                    <div className="space-y-3">
                      <div className="flex justify-between">
                        <span className="text-muted-foreground">Total Candidates</span>
                        <span className="font-semibold">{stats.totalCandidates}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-muted-foreground">Featured Candidates</span>
                        <span className="font-semibold">{stats.featuredCandidates}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-muted-foreground">Public Profiles</span>
                        <span className="font-semibold">
                          {candidates.filter((c) => c.visibility === "public").length}
                        </span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-muted-foreground">Private Profiles</span>
                        <span className="font-semibold">
                          {candidates.filter((c) => c.visibility === "private").length}
                        </span>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Revenue Breakdown */}
                <div className="rounded-lg border bg-card p-6">
                  <h3 className="text-lg font-semibold mb-4">Revenue Breakdown by Upsell Type</h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="p-4 rounded-lg bg-blue-50 border border-blue-200">
                      <div className="flex items-center justify-between mb-2">
                        <span className="font-medium text-blue-900">Job Featured</span>
                        <FaStar className="h-4 w-4 text-blue-600" />
                      </div>
                      <p className="text-2xl font-bold text-blue-600">
                        ${(jobs.filter((j) => j.is_featured).length * 29.99).toFixed(2)}
                      </p>
                      <p className="text-sm text-blue-700 mt-1">
                        {jobs.filter((j) => j.is_featured).length} active featured jobs
                      </p>
                    </div>
                    <div className="p-4 rounded-lg bg-purple-50 border border-purple-200">
                      <div className="flex items-center justify-between mb-2">
                        <span className="font-medium text-purple-900">Job Suggested</span>
                        <FaRocket className="h-4 w-4 text-purple-600" />
                      </div>
                      <p className="text-2xl font-bold text-purple-600">
                        ${(jobs.filter((j) => j.upsells?.suggested).length * 49.99).toFixed(2)}
                      </p>
                      <p className="text-sm text-purple-700 mt-1">
                        {jobs.filter((j) => j.upsells?.suggested).length} active suggested jobs
                      </p>
                    </div>
                    <div className="p-4 rounded-lg bg-yellow-50 border border-yellow-200">
                      <div className="flex items-center justify-between mb-2">
                        <span className="font-medium text-yellow-900">Candidate Featured</span>
                        <FaStar className="h-4 w-4 text-yellow-600" />
                      </div>
                      <p className="text-2xl font-bold text-yellow-600">
                        ${(candidates.filter((c) => c.is_featured).length * 19.99).toFixed(2)}
                      </p>
                      <p className="text-sm text-yellow-700 mt-1">
                        {candidates.filter((c) => c.is_featured).length} active featured profiles
                      </p>
                    </div>
                    <div className="p-4 rounded-lg bg-green-50 border border-green-200">
                      <div className="flex items-center justify-between mb-2">
                        <span className="font-medium text-green-900">Job Alerts Boost</span>
                        <FaRocket className="h-4 w-4 text-green-600" />
                      </div>
                      <p className="text-2xl font-bold text-green-600">
                        ${(candidates.filter((c) => c.has_job_alerts_boost).length * 14.99).toFixed(2)}
                      </p>
                      <p className="text-sm text-green-700 mt-1">
                        {candidates.filter((c) => c.has_job_alerts_boost).length} active boosts
                      </p>
                    </div>
                  </div>
                </div>

                {/* Activity Timeline */}
                <div className="rounded-lg border bg-card p-6">
                  <div className="flex items-center justify-between mb-4">
                    <h3 className="text-lg font-semibold">Activity Timeline</h3>
                    <select
                      value={revenuePeriod}
                      onChange={(e) => setRevenuePeriod(e.target.value)}
                      className="flex h-9 rounded-md border border-input bg-background px-3 py-1 text-sm"
                    >
                      <option value="7d">Last 7 days</option>
                      <option value="30d">Last 30 days</option>
                      <option value="90d">Last 90 days</option>
                    </select>
                  </div>
                  <div className="space-y-3">
                    {/* Mock activity data - would come from backend */}
                    {[
                      { type: "job", action: "created", title: "Senior Developer", user: "John Doe", time: "2 hours ago" },
                      { type: "candidate", action: "registered", title: "Software Engineer Profile", user: "Jane Smith", time: "5 hours ago" },
                      { type: "upsell", action: "activated", title: "Featured Job", user: "Tech Corp", time: "1 day ago" },
                      { type: "job", action: "created", title: "Marketing Manager", user: "Acme Inc", time: "2 days ago" },
                    ].map((activity, index) => (
                      <div key={index} className="flex items-start gap-3 p-3 rounded-lg border hover:bg-accent/50 transition-colors">
                        <div className={`p-2 rounded-lg ${
                          activity.type === "job" ? "bg-blue-100 text-blue-600" :
                          activity.type === "candidate" ? "bg-purple-100 text-purple-600" :
                          "bg-yellow-100 text-yellow-600"
                        }`}>
                          {activity.type === "job" ? <FaBriefcase className="h-4 w-4" /> :
                           activity.type === "candidate" ? <FaUsers className="h-4 w-4" /> :
                           <FaStar className="h-4 w-4" />}
                        </div>
                        <div className="flex-1">
                          <p className="font-medium">{activity.title}</p>
                          <p className="text-sm text-muted-foreground">
                            {activity.action} by {activity.user} • {activity.time}
                          </p>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Performance Metrics */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="rounded-lg border bg-card p-6">
                    <h3 className="text-lg font-semibold mb-4">Performance Metrics</h3>
                    <div className="space-y-4">
                      <div>
                        <div className="flex justify-between mb-2">
                          <span className="text-sm text-muted-foreground">Job Post Conversion Rate</span>
                          <span className="text-sm font-semibold">12.5%</span>
                        </div>
                        <div className="w-full bg-muted rounded-full h-2">
                          <div className="bg-blue-600 h-2 rounded-full" style={{ width: "12.5%" }}></div>
                        </div>
                      </div>
                      <div>
                        <div className="flex justify-between mb-2">
                          <span className="text-sm text-muted-foreground">Upsell Adoption Rate</span>
                          <span className="text-sm font-semibold">8.3%</span>
                        </div>
                        <div className="w-full bg-muted rounded-full h-2">
                          <div className="bg-green-600 h-2 rounded-full" style={{ width: "8.3%" }}></div>
                        </div>
                      </div>
                      <div>
                        <div className="flex justify-between mb-2">
                          <span className="text-sm text-muted-foreground">Active User Rate</span>
                          <span className="text-sm font-semibold">75%</span>
                        </div>
                        <div className="w-full bg-muted rounded-full h-2">
                          <div className="bg-purple-600 h-2 rounded-full" style={{ width: "75%" }}></div>
                        </div>
                      </div>
                    </div>
                  </div>

                  <div className="rounded-lg border bg-card p-6">
                    <h3 className="text-lg font-semibold mb-4">System Health</h3>
                    <div className="space-y-3">
                      <div className="flex items-center justify-between p-3 rounded-lg bg-green-50 border border-green-200">
                        <div className="flex items-center gap-2">
                          <FaCheckCircle className="h-5 w-5 text-green-600" />
                          <span className="font-medium text-green-900">API Status</span>
                        </div>
                        <span className="text-sm text-green-700">Operational</span>
                      </div>
                      <div className="flex items-center justify-between p-3 rounded-lg bg-green-50 border border-green-200">
                        <div className="flex items-center gap-2">
                          <FaCheckCircle className="h-5 w-5 text-green-600" />
                          <span className="font-medium text-green-900">Database</span>
                        </div>
                        <span className="text-sm text-green-700">Healthy</span>
                      </div>
                      <div className="flex items-center justify-between p-3 rounded-lg bg-yellow-50 border border-yellow-200">
                        <div className="flex items-center gap-2">
                          <FaExclamationTriangle className="h-5 w-5 text-yellow-600" />
                          <span className="font-medium text-yellow-900">Pending Jobs</span>
                        </div>
                        <span className="text-sm text-yellow-700">{stats.pendingJobs} require review</span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* Ad Moderation Tab */}
            {activeTab === "moderation" && (
              <div className="space-y-6">
                <div className="rounded-lg border bg-card p-6">
                  <div className="flex items-center justify-between mb-6">
                    <div>
                      <h2 className="text-xl font-semibold flex items-center gap-2">
                        <FaGavel className="h-5 w-5 text-primary" />
                        Ad Moderation Center
                      </h2>
                      <p className="text-sm text-muted-foreground mt-1">
                        Manage ad approvals, detect harmful content, and maintain platform safety
                      </p>
                    </div>
                    <Link
                      to="/admin/moderation"
                      className="inline-flex items-center gap-2 px-4 py-2 bg-primary text-primary-foreground rounded-md hover:bg-primary/90 transition-colors"
                    >
                      <FaGavel className="h-4 w-4" />
                      Open Moderation Dashboard
                    </Link>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                    <div className="rounded-lg border bg-yellow-50 p-4">
                      <div className="flex items-center gap-3">
                        <div className="p-2 bg-yellow-100 rounded-lg">
                          <FaClock className="h-5 w-5 text-yellow-600" />
                        </div>
                        <div>
                          <p className="text-sm font-medium text-yellow-900">Pending Approval</p>
                          <p className="text-2xl font-bold text-yellow-900">--</p>
                          <p className="text-xs text-yellow-700">Ads awaiting review</p>
                        </div>
                      </div>
                    </div>

                    <div className="rounded-lg border bg-red-50 p-4">
                      <div className="flex items-center gap-3">
                        <div className="p-2 bg-red-100 rounded-lg">
                          <FaExclamationTriangle className="h-5 w-5 text-red-600" />
                        </div>
                        <div>
                          <p className="text-sm font-medium text-red-900">Harmful Content</p>
                          <p className="text-2xl font-bold text-red-900">--</p>
                          <p className="text-xs text-red-700">Flagged for review</p>
                        </div>
                      </div>
                    </div>

                    <div className="rounded-lg border bg-blue-50 p-4">
                      <div className="flex items-center gap-3">
                        <div className="p-2 bg-blue-100 rounded-lg">
                          <FaCheckCircle className="h-5 w-5 text-blue-600" />
                        </div>
                        <div>
                          <p className="text-sm font-medium text-blue-900">Approved Today</p>
                          <p className="text-2xl font-bold text-blue-900">--</p>
                          <p className="text-xs text-blue-700">Ads approved</p>
                        </div>
                      </div>
                    </div>
                  </div>

                  <div className="mt-6 p-4 bg-muted/50 rounded-lg">
                    <p className="text-sm text-muted-foreground text-center">
                      <strong>Quick Access:</strong> Use the "Open Moderation Dashboard" button to access comprehensive moderation tools including bulk approvals, harmful content detection, and automated cleanup features.
                    </p>
                  </div>
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

export default SuperAdminDashboard;

