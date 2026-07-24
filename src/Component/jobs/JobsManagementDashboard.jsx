import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Briefcase,
  Users,
  FileText,
  TrendingUp,
  Bell,
  Star,
  Eye,
  Heart,
  Settings,
  Download,
  Search,
  Filter,
  Calendar,
  DollarSign,
  MapPin,
  ChevronDown,
  ChevronUp,
  Award,
  AlertCircle,
  CheckCircle,
  Clock,
  BarChart3,
  PieChart,
  Activity,
  Target,
  Zap,
  Globe,
  Building,
  User,
  Mail,
  Phone,
  X,
  Plus,
  Edit,
  Trash2,
  ExternalLink,
  RefreshCw
} from 'lucide-react';
import { jobsAPI } from '../../api';

const JobsManagementDashboard = () => {
  const [activeTab, setActiveTab] = useState('overview');
  const [loading, setLoading] = useState(false);
  const [data, setData] = useState({
    stats: {},
    myJobs: [],
    applications: [],
    alerts: [],
    savedJobs: [],
    upsells: []
  });

  // Fetch dashboard data
  const fetchDashboardData = async () => {
    setLoading(true);
    try {
      const [statsRes, jobsRes, applicationsRes, alertsRes, savedRes, upsellsRes] = await Promise.all([
        jobsAPI.getStats(),
        jobsAPI.getMyJobs(),
        jobsAPI.getApplications(),
        jobsAPI.getMyJobAlerts(),
        jobsAPI.getSavedJobs(),
        jobsAPI.getMyUpsells()
      ]);

      setData({
        stats: statsRes.data || {},
        myJobs: jobsRes.data?.data || [],
        applications: applicationsRes.data?.data || [],
        alerts: alertsRes.data?.data || [],
        savedJobs: savedRes.data?.data || [],
        upsells: upsellsRes.data?.data || []
      });
    } catch (error) {
      console.error('Error fetching dashboard data:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchDashboardData();
  }, []);

  // Stat card component
  const StatCard = ({ icon: Icon, title, value, change, color = "blue" }) => (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className={`bg-white rounded-xl shadow-sm border border-gray-200 p-6 hover:shadow-md transition-shadow`}
    >
      <div className="flex items-center justify-between">
        <div>
          <p className="text-sm text-gray-600">{title}</p>
          <p className="text-2xl font-bold text-gray-900 mt-1">{value}</p>
          {change && (
            <p className={`text-sm mt-1 flex items-center ${
              change > 0 ? 'text-green-600' : 'text-red-600'
            }`}>
              {change > 0 ? <TrendingUp className="w-4 h-4 mr-1" /> : <TrendingUp className="w-4 h-4 mr-1 rotate-180" />}
              {Math.abs(change)}%
            </p>
          )}
        </div>
        <div className={`w-12 h-12 bg-${color}-100 rounded-lg flex items-center justify-center`}>
          <Icon className={`w-6 h-6 text-${color}-600`} />
        </div>
      </div>
    </motion.div>
  );

  // Job card component
  const JobCard = ({ job }) => (
    <motion.div
      initial={{ opacity: 0, x: -20 }}
      animate={{ opacity: 1, x: 0 }}
      className="bg-white rounded-lg border border-gray-200 p-4 hover:shadow-md transition-shadow"
    >
      <div className="flex items-start justify-between">
        <div className="flex-1">
          <h3 className="font-semibold text-gray-900">{job.title}</h3>
          <p className="text-sm text-gray-600 mt-1">{job.company_name}</p>
          <div className="flex items-center mt-2 text-sm text-gray-500">
            <MapPin className="w-4 h-4 mr-1" />
            {job.city}, {job.country}
          </div>
          <div className="flex items-center mt-1 text-sm text-gray-500">
            <Briefcase className="w-4 h-4 mr-1" />
            {job.work_type}
          </div>
          <div className="flex items-center mt-1 text-sm text-gray-500">
            <DollarSign className="w-4 h-4 mr-1" />
            {job.salary_range}
          </div>
        </div>
        <div className="flex flex-col items-end ml-4">
          <span className={`px-2 py-1 text-xs rounded-full ${
            job.status === 'active' ? 'bg-green-100 text-green-800' : 'bg-gray-100 text-gray-800'
          }`}>
            {job.status}
          </span>
          {job.is_featured && (
            <Star className="w-4 h-4 text-yellow-500 mt-2" />
          )}
        </div>
      </div>
      <div className="flex items-center justify-between mt-4 pt-4 border-t border-gray-100">
        <div className="flex items-center text-sm text-gray-500">
          <Eye className="w-4 h-4 mr-1" />
          {job.views || 0}
          <Users className="w-4 h-4 ml-3 mr-1" />
          {job.applications_count || 0}
        </div>
        <div className="flex space-x-2">
          <button className="text-blue-600 hover:text-blue-700">
            <Edit className="w-4 h-4" />
          </button>
          <button className="text-red-600 hover:text-red-700">
            <Trash2 className="w-4 h-4" />
          </button>
        </div>
      </div>
    </motion.div>
  );

  // Application card component
  const ApplicationCard = ({ application }) => (
    <motion.div
      initial={{ opacity: 0, x: -20 }}
      animate={{ opacity: 1, x: 0 }}
      className="bg-white rounded-lg border border-gray-200 p-4 hover:shadow-md transition-shadow"
    >
      <div className="flex items-start justify-between">
        <div className="flex-1">
          <h3 className="font-semibold text-gray-900">{application.full_name}</h3>
          <p className="text-sm text-gray-600 mt-1">{application.email}</p>
          <p className="text-sm text-gray-500 mt-1">Applied for: {application.job_title}</p>
          <div className="flex items-center mt-2 text-sm text-gray-500">
            <Calendar className="w-4 h-4 mr-1" />
            {new Date(application.created_at).toLocaleDateString()}
          </div>
        </div>
        <div className="flex flex-col items-end ml-4">
          <span className={`px-2 py-1 text-xs rounded-full ${
            application.status === 'shortlisted' ? 'bg-yellow-100 text-yellow-800' :
            application.status === 'rejected' ? 'bg-red-100 text-red-800' :
            application.status === 'hired' ? 'bg-green-100 text-green-800' :
            'bg-gray-100 text-gray-800'
          }`}>
            {application.status}
          </span>
        </div>
      </div>
      <div className="flex items-center justify-between mt-4 pt-4 border-t border-gray-100">
        <div className="flex items-center text-sm text-gray-500">
          <FileText className="w-4 h-4 mr-1" />
          {application.cover_letter ? 'Has cover letter' : 'No cover letter'}
        </div>
        <div className="flex space-x-2">
          <button className="text-blue-600 hover:text-blue-700">
            <Eye className="w-4 h-4" />
          </button>
          <button className="text-green-600 hover:text-green-700">
            <CheckCircle className="w-4 h-4" />
          </button>
          <button className="text-red-600 hover:text-red-700">
            <X className="w-4 h-4" />
          </button>
        </div>
      </div>
    </motion.div>
  );

  // Alert card component
  const AlertCard = ({ alert }) => (
    <motion.div
      initial={{ opacity: 0, x: -20 }}
      animate={{ opacity: 1, x: 0 }}
      className="bg-white rounded-lg border border-gray-200 p-4 hover:shadow-md transition-shadow"
    >
      <div className="flex items-start justify-between">
        <div className="flex-1">
          <h3 className="font-semibold text-gray-900">{alert.title}</h3>
          <p className="text-sm text-gray-600 mt-1">{alert.keywords}</p>
          <div className="flex items-center mt-2 text-sm text-gray-500">
            <Bell className="w-4 h-4 mr-1" />
            {alert.frequency} • {alert.is_active ? 'Active' : 'Inactive'}
          </div>
        </div>
        <div className="flex flex-col items-end ml-4">
          <span className={`px-2 py-1 text-xs rounded-full ${
            alert.is_active ? 'bg-green-100 text-green-800' : 'bg-gray-100 text-gray-800'
          }`}>
            {alert.is_active ? 'Active' : 'Inactive'}
          </span>
        </div>
      </div>
      <div className="flex items-center justify-between mt-4 pt-4 border-t border-gray-100">
        <div className="flex items-center text-sm text-gray-500">
          <Mail className="w-4 h-4 mr-1" />
          Last sent: {alert.last_sent ? new Date(alert.last_sent).toLocaleDateString() : 'Never'}
        </div>
        <div className="flex space-x-2">
          <button className="text-blue-600 hover:text-blue-700">
            <Edit className="w-4 h-4" />
          </button>
          <button className="text-green-600 hover:text-green-700">
            <RefreshCw className="w-4 h-4" />
          </button>
          <button className="text-red-600 hover:text-red-700">
            <Trash2 className="w-4 h-4" />
          </button>
        </div>
      </div>
    </motion.div>
  );

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white border-b border-gray-200">
        <div className="page-container">
          <div className="flex items-center justify-between h-16">
            <div className="flex items-center">
              <Briefcase className="w-8 h-8 text-blue-600 mr-3" />
              <h1 className="text-xl font-semibold text-gray-900">Jobs Management Dashboard</h1>
            </div>
            <div className="flex items-center space-x-4">
              <button className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 flex items-center">
                <Plus className="w-4 h-4 mr-2" />
                Post New Job
              </button>
              <button className="p-2 text-gray-600 hover:text-gray-900">
                <Settings className="w-5 h-5" />
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Navigation Tabs */}
      <div className="bg-white border-b border-gray-200">
        <div className="page-container">
          <nav className="flex space-x-8">
            {[
              { id: 'overview', label: 'Overview', icon: BarChart3 },
              { id: 'jobs', label: 'My Jobs', icon: Briefcase },
              { id: 'applications', label: 'Applications', icon: FileText },
              { id: 'alerts', label: 'Job Alerts', icon: Bell },
              { id: 'saved', label: 'Saved Jobs', icon: Heart },
              { id: 'upsells', label: 'Premium Upsells', icon: Award },
            ].map(({ id, label, icon: Icon }) => (
              <button
                key={id}
                onClick={() => setActiveTab(id)}
                className={`flex items-center px-1 py-4 border-b-2 text-sm font-medium ${
                  activeTab === id
                    ? 'border-blue-500 text-blue-600'
                    : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                }`}
              >
                <Icon className="w-4 h-4 mr-2" />
                {label}
              </button>
            ))}
          </nav>
        </div>
      </div>

      {/* Content */}
      <div className="page-container py-8">
        {loading ? (
          <div className="flex items-center justify-center py-12">
            <RefreshCw className="w-8 h-8 text-blue-600 animate-spin" />
          </div>
        ) : (
          <AnimatePresence mode="wait">
            {/* Overview Tab */}
            {activeTab === 'overview' && (
              <motion.div
                key="overview"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
              >
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
                  <StatCard
                    icon={Briefcase}
                    title="Total Jobs"
                    value={data.stats.total_jobs || 0}
                    change={12}
                    color="blue"
                  />
                  <StatCard
                    icon={Users}
                    title="Total Applications"
                    value={data.stats.total_applications || 0}
                    change={8}
                    color="green"
                  />
                  <StatCard
                    icon={Eye}
                    title="Total Views"
                    value={data.stats.total_views || 0}
                    change={15}
                    color="purple"
                  />
                  <StatCard
                    icon={TrendingUp}
                    title="Active Upsells"
                    value={data.stats.active_upsells || 0}
                    change={-2}
                    color="yellow"
                  />
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                  <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
                    <h2 className="text-lg font-semibold text-gray-900 mb-4">Recent Jobs</h2>
                    <div className="space-y-4">
                      {data.myJobs.slice(0, 5).map(job => (
                        <JobCard key={job.id} job={job} />
                      ))}
                    </div>
                  </div>

                  <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
                    <h2 className="text-lg font-semibold text-gray-900 mb-4">Recent Applications</h2>
                    <div className="space-y-4">
                      {data.applications.slice(0, 5).map(app => (
                        <ApplicationCard key={app.id} application={app} />
                      ))}
                    </div>
                  </div>
                </div>
              </motion.div>
            )}

            {/* My Jobs Tab */}
            {activeTab === 'jobs' && (
              <motion.div
                key="jobs"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
              >
                <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
                  <div className="flex items-center justify-between mb-6">
                    <h2 className="text-lg font-semibold text-gray-900">My Job Postings</h2>
                    <div className="flex items-center space-x-4">
                      <button className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 flex items-center">
                        <Plus className="w-4 h-4 mr-2" />
                        Post New Job
                      </button>
                    </div>
                  </div>
                  <div className="space-y-4">
                    {data.myJobs.map(job => (
                      <JobCard key={job.id} job={job} />
                    ))}
                  </div>
                </div>
              </motion.div>
            )}

            {/* Applications Tab */}
            {activeTab === 'applications' && (
              <motion.div
                key="applications"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
              >
                <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
                  <div className="flex items-center justify-between mb-6">
                    <h2 className="text-lg font-semibold text-gray-900">Job Applications</h2>
                    <div className="flex items-center space-x-4">
                      <button className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 flex items-center">
                        <Download className="w-4 h-4 mr-2" />
                        Export
                      </button>
                    </div>
                  </div>
                  <div className="space-y-4">
                    {data.applications.map(app => (
                      <ApplicationCard key={app.id} application={app} />
                    ))}
                  </div>
                </div>
              </motion.div>
            )}

            {/* Job Alerts Tab */}
            {activeTab === 'alerts' && (
              <motion.div
                key="alerts"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
              >
                <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
                  <div className="flex items-center justify-between mb-6">
                    <h2 className="text-lg font-semibold text-gray-900">Job Alerts</h2>
                    <div className="flex items-center space-x-4">
                      <button className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 flex items-center">
                        <Plus className="w-4 h-4 mr-2" />
                        Create Alert
                      </button>
                    </div>
                  </div>
                  <div className="space-y-4">
                    {data.alerts.map(alert => (
                      <AlertCard key={alert.id} alert={alert} />
                    ))}
                  </div>
                </div>
              </motion.div>
            )}

            {/* Saved Jobs Tab */}
            {activeTab === 'saved' && (
              <motion.div
                key="saved"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
              >
                <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
                  <div className="flex items-center justify-between mb-6">
                    <h2 className="text-lg font-semibold text-gray-900">Saved Jobs</h2>
                    <div className="flex items-center space-x-4">
                      <button className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 flex items-center">
                        <ExternalLink className="w-4 h-4 mr-2" />
                        Browse Jobs
                      </button>
                    </div>
                  </div>
                  <div className="space-y-4">
                    {data.savedJobs.map(job => (
                      <JobCard key={job.id} job={job} />
                    ))}
                  </div>
                </div>
              </motion.div>
            )}

            {/* Premium Upsells Tab */}
            {activeTab === 'upsells' && (
              <motion.div
                key="upsells"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
              >
                <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
                  <div className="flex items-center justify-between mb-6">
                    <h2 className="text-lg font-semibold text-gray-900">Premium Upsells</h2>
                    <div className="flex items-center space-x-4">
                      <button className="px-4 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 flex items-center">
                        <Award className="w-4 h-4 mr-2" />
                        Upgrade Jobs
                      </button>
                    </div>
                  </div>
                  <div className="space-y-4">
                    {data.upsells.map(upsell => (
                      <motion.div
                        key={upsell.id}
                        initial={{ opacity: 0, x: -20 }}
                        animate={{ opacity: 1, x: 0 }}
                        className="bg-white rounded-lg border border-gray-200 p-4 hover:shadow-md transition-shadow"
                      >
                        <div className="flex items-start justify-between">
                          <div className="flex-1">
                            <h3 className="font-semibold text-gray-900">{upsell.upsell_type}</h3>
                            <p className="text-sm text-gray-600 mt-1">{upsell.upsellable_type}</p>
                            <div className="flex items-center mt-2 text-sm text-gray-500">
                              <DollarSign className="w-4 h-4 mr-1" />
                              {upsell.price} {upsell.currency}
                            </div>
                            <div className="flex items-center mt-1 text-sm text-gray-500">
                              <Calendar className="w-4 h-4 mr-1" />
                              {upsell.status}
                            </div>
                          </div>
                          <div className="flex flex-col items-end ml-4">
                            <span className={`px-2 py-1 text-xs rounded-full ${
                              upsell.status === 'active' ? 'bg-green-100 text-green-800' :
                              upsell.status === 'pending' ? 'bg-yellow-100 text-yellow-800' :
                              'bg-gray-100 text-gray-800'
                            }`}>
                              {upsell.status}
                            </span>
                          </div>
                        </div>
                      </motion.div>
                    ))}
                  </div>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        )}
      </div>
    </div>
  );
};

export default JobsManagementDashboard;
