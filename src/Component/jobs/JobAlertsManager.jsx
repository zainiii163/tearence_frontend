import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Bell,
  Plus,
  Edit,
  Trash2,
  Search,
  Filter,
  Mail,
  Clock,
  Calendar,
  CheckCircle,
  XCircle,
  AlertCircle,
  RefreshCw,
  TrendingUp,
  Users,
  Briefcase,
  MapPin,
  DollarSign,
  Globe,
  Settings,
  ChevronDown,
  ChevronUp,
  Eye,
  EyeOff,
  Zap,
  Target,
  BarChart3
} from 'lucide-react';
import { jobsAPI } from '../../api';

const JobAlertsManager = () => {
  const [alerts, setAlerts] = useState([]);
  const [loading, setLoading] = useState(false);
  const [showCreateForm, setShowCreateForm] = useState(false);
  const [editingAlert, setEditingAlert] = useState(null);
  const [expandedAlert, setExpandedAlert] = useState(null);
  const [stats, setStats] = useState({});
  const [filterStatus, setFilterStatus] = useState('all');

  // Form state
  const [formData, setFormData] = useState({
    title: '',
    keywords: '',
    job_category_id: '',
    country: '',
    work_type: '',
    salary_range: '',
    frequency: 'weekly',
    is_active: true
  });

  // Fetch alerts
  const fetchAlerts = async () => {
    setLoading(true);
    try {
      const response = await jobsAPI.getMyJobAlerts();
      setAlerts(response.data?.data || []);
    } catch (error) {
      console.error('Error fetching alerts:', error);
    } finally {
      setLoading(false);
    }
  };

  // Fetch stats
  const fetchStats = async () => {
    try {
      const response = await jobsAPI.getAlertStats();
      setStats(response.data || {});
    } catch (error) {
      console.error('Error fetching stats:', error);
    }
  };

  useEffect(() => {
    fetchAlerts();
    fetchStats();
  }, []);

  // Handle form submission
  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      if (editingAlert) {
        await jobsAPI.updateJobAlert(editingAlert.id, formData);
      } else {
        await jobsAPI.createJobAlert(formData);
      }
      fetchAlerts();
      setShowCreateForm(false);
      setEditingAlert(null);
      setFormData({
        title: '',
        keywords: '',
        job_category_id: '',
        country: '',
        work_type: '',
        salary_range: '',
        frequency: 'weekly',
        is_active: true
      });
    } catch (error) {
      console.error('Error saving alert:', error);
    } finally {
      setLoading(false);
    }
  };

  // Handle delete
  const handleDelete = async (alertId) => {
    if (window.confirm('Are you sure you want to delete this alert?')) {
      try {
        await jobsAPI.deleteJobAlert(alertId);
        fetchAlerts();
      } catch (error) {
        console.error('Error deleting alert:', error);
      }
    }
  };

  // Handle test alert
  const handleTestAlert = async (alertId) => {
    try {
      await jobsAPI.testJobAlert(alertId);
      alert('Test alert sent successfully!');
    } catch (error) {
      console.error('Error testing alert:', error);
      alert('Failed to send test alert');
    }
  };

  // Handle toggle active
  const handleToggleActive = async (alert) => {
    try {
      await jobsAPI.updateJobAlert(alert.id, { ...alert, is_active: !alert.is_active });
      fetchAlerts();
    } catch (error) {
      console.error('Error toggling alert:', error);
    }
  };

  // Filter alerts
  const filteredAlerts = alerts.filter(alert => {
    if (filterStatus === 'all') return true;
    if (filterStatus === 'active') return alert.is_active;
    if (filterStatus === 'inactive') return !alert.is_active;
    return true;
  });

  // Alert card component
  const AlertCard = ({ alert }) => {
    const isExpanded = expandedAlert === alert.id;
    
    return (
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="bg-white rounded-lg border border-gray-200 shadow-sm hover:shadow-md transition-shadow"
      >
        <div className="p-6">
          <div className="flex items-start justify-between">
            <div className="flex-1">
              <div className="flex items-center">
                <h3 className="text-lg font-semibold text-gray-900">{alert.title}</h3>
                <span className={`ml-3 px-2 py-1 text-xs rounded-full ${
                  alert.is_active ? 'bg-green-100 text-green-800' : 'bg-gray-100 text-gray-800'
                }`}>
                  {alert.is_active ? 'Active' : 'Inactive'}
                </span>
              </div>
              
              <div className="mt-2 space-y-2">
                <div className="flex items-center text-sm text-gray-600">
                  <Search className="w-4 h-4 mr-2" />
                  <span className="font-medium">Keywords:</span> {alert.keywords}
                </div>
                
                {alert.country && (
                  <div className="flex items-center text-sm text-gray-600">
                    <MapPin className="w-4 h-4 mr-2" />
                    <span className="font-medium">Location:</span> {alert.country}
                  </div>
                )}
                
                {alert.work_type && (
                  <div className="flex items-center text-sm text-gray-600">
                    <Briefcase className="w-4 h-4 mr-2" />
                    <span className="font-medium">Work Type:</span> {alert.work_type}
                  </div>
                )}
                
                {alert.salary_range && (
                  <div className="flex items-center text-sm text-gray-600">
                    <DollarSign className="w-4 h-4 mr-2" />
                    <span className="font-medium">Salary:</span> {alert.salary_range}
                  </div>
                )}
                
                <div className="flex items-center text-sm text-gray-600">
                  <Clock className="w-4 h-4 mr-2" />
                  <span className="font-medium">Frequency:</span> {alert.frequency}
                </div>
                
                <div className="flex items-center text-sm text-gray-600">
                  <Mail className="w-4 h-4 mr-2" />
                  <span className="font-medium">Last Sent:</span> {alert.last_sent ? new Date(alert.last_sent).toLocaleDateString() : 'Never'}
                </div>
                
                <div className="flex items-center text-sm text-gray-600">
                  <TrendingUp className="w-4 h-4 mr-2" />
                  <span className="font-medium">Total Sent:</span> {alert.total_sent || 0}
                </div>
              </div>
            </div>
            
            <div className="flex items-center space-x-2 ml-4">
              <button
                onClick={() => handleToggleActive(alert)}
                className={`p-2 rounded-lg transition-colors ${
                  alert.is_active ? 'bg-green-100 text-green-600 hover:bg-green-200' : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                }`}
              >
                {alert.is_active ? <Eye className="w-4 h-4" /> : <EyeOff className="w-4 h-4" />}
              </button>
              
              <button
                onClick={() => handleTestAlert(alert.id)}
                className="p-2 bg-blue-100 text-blue-600 rounded-lg hover:bg-blue-200 transition-colors"
              >
                <Mail className="w-4 h-4" />
              </button>
              
              <button
                onClick={() => {
                  setEditingAlert(alert);
                  setFormData(alert);
                  setShowCreateForm(true);
                }}
                className="p-2 bg-gray-100 text-gray-600 rounded-lg hover:bg-gray-200 transition-colors"
              >
                <Edit className="w-4 h-4" />
              </button>
              
              <button
                onClick={() => handleDelete(alert.id)}
                className="p-2 bg-red-100 text-red-600 rounded-lg hover:bg-red-200 transition-colors"
              >
                <Trash2 className="w-4 h-4" />
              </button>
              
              <button
                onClick={() => setExpandedAlert(isExpanded ? null : alert.id)}
                className="p-2 bg-gray-100 text-gray-600 rounded-lg hover:bg-gray-200 transition-colors"
              >
                {isExpanded ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
              </button>
            </div>
          </div>
          
          {/* Expanded content */}
          <AnimatePresence>
            {isExpanded && (
              <motion.div
                initial={{ height: 0, opacity: 0 }}
                animate={{ height: 'auto', opacity: 1 }}
                exit={{ height: 0, opacity: 0 }}
                className="mt-4 pt-4 border-t border-gray-200"
              >
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="bg-gray-50 rounded-lg p-4">
                    <h4 className="font-medium text-gray-900 mb-2">Performance</h4>
                    <div className="space-y-2">
                      <div className="flex justify-between text-sm">
                        <span className="text-gray-600">Open Rate:</span>
                        <span className="font-medium">{alert.open_rate || 'N/A'}%</span>
                      </div>
                      <div className="flex justify-between text-sm">
                        <span className="text-gray-600">Click Rate:</span>
                        <span className="font-medium">{alert.click_rate || 'N/A'}%</span>
                      </div>
                      <div className="flex justify-between text-sm">
                        <span className="text-gray-600">Applications:</span>
                        <span className="font-medium">{alert.applications_count || 0}</span>
                      </div>
                    </div>
                  </div>
                  
                  <div className="bg-gray-50 rounded-lg p-4">
                    <h4 className="font-medium text-gray-900 mb-2">Recent Matches</h4>
                    <div className="space-y-2">
                      {alert.recent_matches?.slice(0, 3).map((match, index) => (
                        <div key={index} className="text-sm">
                          <div className="font-medium text-gray-900">{match.title}</div>
                          <div className="text-gray-600">{match.company}</div>
                        </div>
                      )) || <div className="text-sm text-gray-500">No recent matches</div>}
                    </div>
                  </div>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </motion.div>
    );
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white border-b border-gray-200">
        <div className="page-container">
          <div className="flex items-center justify-between h-16">
            <div className="flex items-center">
              <Bell className="w-8 h-8 text-blue-600 mr-3" />
              <h1 className="text-xl font-semibold text-gray-900">Job Alerts Manager</h1>
            </div>
            <div className="flex items-center space-x-4">
              <button
                onClick={() => setShowCreateForm(true)}
                className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 flex items-center"
              >
                <Plus className="w-4 h-4 mr-2" />
                Create Alert
              </button>
              <button className="p-2 text-gray-600 hover:text-gray-900">
                <Settings className="w-5 h-5" />
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="page-container py-8">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
          <div className="bg-white rounded-lg border border-gray-200 p-6">
            <div className="flex items-center">
              <Bell className="w-8 h-8 text-blue-600 mr-3" />
              <div>
                <p className="text-sm text-gray-600">Total Alerts</p>
                <p className="text-2xl font-bold text-gray-900">{stats.total_alerts || 0}</p>
              </div>
            </div>
          </div>
          
          <div className="bg-white rounded-lg border border-gray-200 p-6">
            <div className="flex items-center">
              <Eye className="w-8 h-8 text-green-600 mr-3" />
              <div>
                <p className="text-sm text-gray-600">Active Alerts</p>
                <p className="text-2xl font-bold text-gray-900">{stats.active_alerts || 0}</p>
              </div>
            </div>
          </div>
          
          <div className="bg-white rounded-lg border border-gray-200 p-6">
            <div className="flex items-center">
              <Mail className="w-8 h-8 text-purple-600 mr-3" />
              <div>
                <p className="text-sm text-gray-600">Emails Sent</p>
                <p className="text-2xl font-bold text-gray-900">{stats.total_emails_sent || 0}</p>
              </div>
            </div>
          </div>
          
          <div className="bg-white rounded-lg border border-gray-200 p-6">
            <div className="flex items-center">
              <Target className="w-8 h-8 text-orange-600 mr-3" />
              <div>
                <p className="text-sm text-gray-600">Success Rate</p>
                <p className="text-2xl font-bold text-gray-900">{stats.success_rate || 'N/A'}%</p>
              </div>
            </div>
          </div>
        </div>

        {/* Filters */}
        <div className="bg-white rounded-lg border border-gray-200 p-4 mb-6">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <span className="text-sm font-medium text-gray-700">Filter:</span>
              <button
                onClick={() => setFilterStatus('all')}
                className={`px-3 py-1 text-sm rounded-lg ${
                  filterStatus === 'all' ? 'bg-blue-100 text-blue-700' : 'bg-gray-100 text-gray-700'
                }`}
              >
                All
              </button>
              <button
                onClick={() => setFilterStatus('active')}
                className={`px-3 py-1 text-sm rounded-lg ${
                  filterStatus === 'active' ? 'bg-blue-100 text-blue-700' : 'bg-gray-100 text-gray-700'
                }`}
              >
                Active
              </button>
              <button
                onClick={() => setFilterStatus('inactive')}
                className={`px-3 py-1 text-sm rounded-lg ${
                  filterStatus === 'inactive' ? 'bg-blue-100 text-blue-700' : 'bg-gray-100 text-gray-700'
                }`}
              >
                Inactive
              </button>
            </div>
            
            <div className="flex items-center space-x-2">
              <button
                onClick={fetchAlerts}
                className="p-2 text-gray-600 hover:text-gray-900"
              >
                <RefreshCw className="w-4 h-4" />
              </button>
            </div>
          </div>
        </div>

        {/* Alerts List */}
        <div className="space-y-4">
          {loading ? (
            <div className="flex items-center justify-center py-12">
              <RefreshCw className="w-8 h-8 text-blue-600 animate-spin" />
            </div>
          ) : filteredAlerts.length > 0 ? (
            filteredAlerts.map(alert => (
              <AlertCard key={alert.id} alert={alert} />
            ))
          ) : (
            <div className="bg-white rounded-lg border border-gray-200 p-12 text-center">
              <Bell className="w-12 h-12 text-gray-400 mx-auto mb-4" />
              <h3 className="text-lg font-medium text-gray-900 mb-2">No job alerts found</h3>
              <p className="text-gray-600 mb-4">Create your first job alert to get notified about new opportunities.</p>
              <button
                onClick={() => setShowCreateForm(true)}
                className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
              >
                Create Alert
              </button>
            </div>
          )}
        </div>
      </div>

      {/* Create/Edit Modal */}
      <AnimatePresence>
        {showCreateForm && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50"
          >
            <motion.div
              initial={{ scale: 0.95, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.95, opacity: 0 }}
              className="bg-white rounded-xl shadow-xl max-w-2xl w-full max-h-[90vh] overflow-y-auto"
            >
              <div className="p-6">
                <div className="flex items-center justify-between mb-6">
                  <h2 className="text-xl font-semibold text-gray-900">
                    {editingAlert ? 'Edit Job Alert' : 'Create Job Alert'}
                  </h2>
                  <button
                    onClick={() => {
                      setShowCreateForm(false);
                      setEditingAlert(null);
                      setFormData({
                        title: '',
                        keywords: '',
                        job_category_id: '',
                        country: '',
                        work_type: '',
                        salary_range: '',
                        frequency: 'weekly',
                        is_active: true
                      });
                    }}
                    className="p-2 text-gray-600 hover:text-gray-900"
                  >
                    <X className="w-5 h-5" />
                  </button>
                </div>

                <form onSubmit={handleSubmit} className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Alert Title
                    </label>
                    <input
                      type="text"
                      value={formData.title}
                      onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                      required
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Keywords (comma-separated)
                    </label>
                    <input
                      type="text"
                      value={formData.keywords}
                      onChange={(e) => setFormData({ ...formData, keywords: e.target.value })}
                      placeholder="e.g., developer, javascript, react"
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                      required
                    />
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Country
                      </label>
                      <input
                        type="text"
                        value={formData.country}
                        onChange={(e) => setFormData({ ...formData, country: e.target.value })}
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Work Type
                      </label>
                      <select
                        value={formData.work_type}
                        onChange={(e) => setFormData({ ...formData, work_type: e.target.value })}
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                      >
                        <option value="">Select work type</option>
                        <option value="full_time">Full Time</option>
                        <option value="part_time">Part Time</option>
                        <option value="contract">Contract</option>
                        <option value="remote">Remote</option>
                        <option value="freelance">Freelance</option>
                      </select>
                    </div>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Salary Range
                      </label>
                      <input
                        type="text"
                        value={formData.salary_range}
                        onChange={(e) => setFormData({ ...formData, salary_range: e.target.value })}
                        placeholder="e.g., $50,000 - $80,000"
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Frequency
                      </label>
                      <select
                        value={formData.frequency}
                        onChange={(e) => setFormData({ ...formData, frequency: e.target.value })}
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                      >
                        <option value="daily">Daily</option>
                        <option value="weekly">Weekly</option>
                        <option value="monthly">Monthly</option>
                      </select>
                    </div>
                  </div>

                  <div className="flex items-center">
                    <input
                      type="checkbox"
                      id="is_active"
                      checked={formData.is_active}
                      onChange={(e) => setFormData({ ...formData, is_active: e.target.checked })}
                      className="w-4 h-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
                    />
                    <label htmlFor="is_active" className="ml-2 text-sm text-gray-700">
                      Activate this alert
                    </label>
                  </div>

                  <div className="flex justify-end space-x-4 pt-4">
                    <button
                      type="button"
                      onClick={() => {
                        setShowCreateForm(false);
                        setEditingAlert(null);
                      }}
                      className="px-4 py-2 text-gray-700 bg-gray-100 rounded-lg hover:bg-gray-200"
                    >
                      Cancel
                    </button>
                    <button
                      type="submit"
                      disabled={loading}
                      className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50"
                    >
                      {loading ? (
                        <RefreshCw className="w-4 h-4 animate-spin" />
                      ) : (
                        editingAlert ? 'Update Alert' : 'Create Alert'
                      )}
                    </button>
                  </div>
                </form>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default JobAlertsManager;
