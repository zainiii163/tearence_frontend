import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { 
  TrendingUp, 
  TrendingDown, 
  Eye, 
  Heart, 
  Users, 
  Calendar,
  DollarSign,
  BarChart3,
  PieChart,
  Activity,
  MapPin,
  Building,
  Home
} from 'lucide-react';
import propertyApi from '../../services/propertyApi';

const PropertyAnalytics = () => {
  const [analytics, setAnalytics] = useState({
    totalProperties: 0,
    activeProperties: 0,
    pendingApproval: 0,
    totalViews: 0,
    totalEnquiries: 0,
    totalSaves: 0,
    featuredProperties: 0,
    promotedProperties: 0,
    sponsoredProperties: 0
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [timeRange, setTimeRange] = useState('30d');
  const [selectedMetric, setSelectedMetric] = useState('overview');

  // Load analytics data
  const loadAnalytics = async () => {
    setLoading(true);
    setError(null);
    
    try {
      // In a real implementation, this would call analytics endpoints
      // For now, we'll use user's properties to calculate analytics
      const response = await propertyApi.getMyProperties();
      const properties = response.data || [];
      
      const calculatedAnalytics = {
        totalProperties: properties.length,
        activeProperties: properties.filter(p => p.active).length,
        pendingApproval: properties.filter(p => !p.approved).length,
        totalViews: properties.reduce((sum, p) => sum + (p.views || 0), 0),
        totalEnquiries: properties.reduce((sum, p) => sum + (p.enquiries || 0), 0),
        totalSaves: properties.reduce((sum, p) => sum + (p.saves || 0), 0),
        featuredProperties: properties.filter(p => p.advert_type === 'featured').length,
        promotedProperties: properties.filter(p => p.advert_type === 'promoted').length,
        sponsoredProperties: properties.filter(p => p.advert_type === 'sponsored').length,
      };
      
      setAnalytics(calculatedAnalytics);
    } catch (err) {
      setError(err.message);
      console.error('Error loading analytics:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadAnalytics();
  }, []);

  const getPropertyTypeStats = () => {
    // This would typically come from analytics API
    return {
      residential: 45,
      commercial: 25,
      industrial: 15,
      land: 10,
      luxury: 5
    };
  };

  const getPerformanceData = () => {
    // Mock performance data for charts
    return {
      views: [120, 150, 180, 200, 170, 190, 210, 230, 250, 280],
      enquiries: [8, 12, 15, 18, 14, 16, 20, 22, 25, 28],
      saves: [15, 18, 22, 25, 20, 24, 28, 32, 35, 40]
    };
  };

  const getTopPerformingProperties = () => {
    // Mock top performing properties
    return [
      {
        id: 1,
        title: "Modern Downtown Apartment",
        views: 1250,
        enquiries: 23,
        saves: 45,
        performance: 95
      },
      {
        id: 2,
        title: "Suburban Family House",
        views: 890,
        enquiries: 18,
        saves: 32,
        performance: 88
      },
      {
        id: 3,
        title: "Commercial Office Space",
        views: 567,
        enquiries: 12,
        saves: 28,
        performance: 76
      }
    ];
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="w-12 h-12 border-4 border-blue-600 border-t-transparent rounded-full animate-spin mb-4"></div>
          <p className="text-gray-600">Loading analytics...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center bg-red-50 p-6 rounded-lg">
          <p className="text-red-600 font-medium">Error loading analytics</p>
          <p className="text-red-500 text-sm mt-2">{error}</p>
          <button 
            onClick={loadAnalytics}
            className="mt-4 px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700"
          >
            Try Again
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <div className="flex items-center space-x-4">
              <h1 className="text-2xl font-bold text-gray-900">Property Analytics</h1>
              <div className="flex items-center space-x-2">
                <select
                  value={timeRange}
                  onChange={(e) => setTimeRange(e.target.value)}
                  className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                >
                  <option value="7d">Last 7 days</option>
                  <option value="30d">Last 30 days</option>
                  <option value="90d">Last 90 days</option>
                  <option value="1y">Last year</option>
                </select>
              </div>
            </div>
            
            <button
              onClick={loadAnalytics}
              className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
            >
              Refresh
            </button>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Overview Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="bg-white rounded-lg shadow-sm p-6"
          >
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Total Properties</p>
                <p className="text-2xl font-bold text-gray-900">{analytics.totalProperties}</p>
              </div>
              <div className="p-3 bg-blue-100 rounded-full">
                <Building className="w-6 h-6 text-blue-600" />
              </div>
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="bg-white rounded-lg shadow-sm p-6"
          >
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Active Properties</p>
                <p className="text-2xl font-bold text-green-600">{analytics.activeProperties}</p>
              </div>
              <div className="p-3 bg-green-100 rounded-full">
                <Activity className="w-6 h-6 text-green-600" />
              </div>
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="bg-white rounded-lg shadow-sm p-6"
          >
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Total Views</p>
                <p className="text-2xl font-bold text-gray-900">{analytics.totalViews.toLocaleString()}</p>
              </div>
              <div className="p-3 bg-purple-100 rounded-full">
                <Eye className="w-6 h-6 text-purple-600" />
              </div>
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
            className="bg-white rounded-lg shadow-sm p-6"
          >
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Total Enquiries</p>
                <p className="text-2xl font-bold text-orange-600">{analytics.totalEnquiries}</p>
              </div>
              <div className="p-3 bg-orange-100 rounded-full">
                <Users className="w-6 h-6 text-orange-600" />
              </div>
            </div>
          </motion.div>
        </div>

        {/* Secondary Stats */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4 }}
            className="bg-white rounded-lg shadow-sm p-6"
          >
            <div className="flex items-center">
              <div className="p-2 bg-yellow-100 rounded-lg mr-4">
                <Heart className="w-5 h-5 text-yellow-600" />
              </div>
              <div>
                <p className="text-sm font-medium text-gray-600">Total Saves</p>
                <p className="text-xl font-bold text-gray-900">{analytics.totalSaves}</p>
              </div>
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.5 }}
            className="bg-white rounded-lg shadow-sm p-6"
          >
            <div className="flex items-center">
              <div className="p-2 bg-indigo-100 rounded-lg mr-4">
                <TrendingUp className="w-5 h-5 text-indigo-600" />
              </div>
              <div>
                <p className="text-sm font-medium text-gray-600">Featured</p>
                <p className="text-xl font-bold text-gray-900">{analytics.featuredProperties}</p>
              </div>
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.6 }}
            className="bg-white rounded-lg shadow-sm p-6"
          >
            <div className="flex items-center">
              <div className="p-2 bg-green-100 rounded-lg mr-4">
                <DollarSign className="w-5 h-5 text-green-600" />
              </div>
              <div>
                <p className="text-sm font-medium text-gray-600">Promoted</p>
                <p className="text-xl font-bold text-gray-900">{analytics.promotedProperties}</p>
              </div>
            </div>
          </motion.div>
        </div>

        {/* Charts Section */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
          {/* Performance Chart */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.7 }}
            className="bg-white rounded-lg shadow-sm p-6"
          >
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-semibold text-gray-900">Performance Trends</h3>
              <BarChart3 className="w-5 h-5 text-gray-400" />
            </div>
            <div className="h-64 flex items-center justify-center bg-gray-50 rounded-lg">
              <div className="text-center text-gray-500">
                <BarChart3 className="w-8 h-8 mx-auto mb-2" />
                <p className="text-sm">Performance chart visualization</p>
                <p className="text-xs text-gray-400">Views, enquiries, and saves over time</p>
              </div>
            </div>
          </motion.div>

          {/* Property Type Distribution */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.8 }}
            className="bg-white rounded-lg shadow-sm p-6"
          >
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-semibold text-gray-900">Property Types</h3>
              <PieChart className="w-5 h-5 text-gray-400" />
            </div>
            <div className="space-y-3">
              {Object.entries(getPropertyTypeStats()).map(([type, count], index) => (
                <div key={type} className="flex items-center justify-between">
                  <div className="flex items-center">
                    <div className={`w-3 h-3 rounded-full mr-3 ${
                      type === 'residential' ? 'bg-blue-500' :
                      type === 'commercial' ? 'bg-green-500' :
                      type === 'industrial' ? 'bg-orange-500' :
                      type === 'land' ? 'bg-yellow-500' :
                      type === 'luxury' ? 'bg-purple-500' : 'bg-gray-500'
                    }`}></div>
                    <span className="text-sm font-medium text-gray-700 capitalize">{type}</span>
                  </div>
                  <div className="flex items-center">
                    <div className="w-24 bg-gray-200 rounded-full h-2 mr-2">
                      <div 
                        className={`h-2 rounded-full ${
                          type === 'residential' ? 'bg-blue-500' :
                          type === 'commercial' ? 'bg-green-500' :
                          type === 'industrial' ? 'bg-orange-500' :
                          type === 'land' ? 'bg-yellow-500' :
                          type === 'luxury' ? 'bg-purple-500' : 'bg-gray-500'
                        }`}
                        style={{ width: `${(count / 50) * 100}%` }}
                      ></div>
                    </div>
                    <span className="text-sm font-bold text-gray-900">{count}</span>
                  </div>
                </div>
              ))}
            </div>
          </motion.div>
        </div>

        {/* Top Performing Properties */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.9 }}
          className="bg-white rounded-lg shadow-sm p-6"
        >
          <div className="flex items-center justify-between mb-6">
            <h3 className="text-lg font-semibold text-gray-900">Top Performing Properties</h3>
            <TrendingUp className="w-5 h-5 text-gray-400" />
          </div>
          <div className="space-y-4">
            {getTopPerformingProperties().map((property, index) => (
              <div key={property.id} className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
                <div className="flex-1">
                  <h4 className="font-medium text-gray-900 mb-1">{property.title}</h4>
                  <div className="flex items-center space-x-4 text-sm text-gray-600">
                    <span className="flex items-center">
                      <Eye className="w-3 h-3 mr-1" />
                      {property.views}
                    </span>
                    <span className="flex items-center">
                      <Users className="w-3 h-3 mr-1" />
                      {property.enquiries}
                    </span>
                    <span className="flex items-center">
                      <Heart className="w-3 h-3 mr-1" />
                      {property.saves}
                    </span>
                  </div>
                </div>
                <div className="flex items-center">
                  <div className="text-right">
                    <p className="text-sm text-gray-500">Performance Score</p>
                    <p className="text-lg font-bold text-green-600">{property.performance}%</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </motion.div>
      </div>
    </div>
  );
};

export default PropertyAnalytics;
