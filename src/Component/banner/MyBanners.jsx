import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { 
  Plus, 
  Edit2, 
  Trash2, 
  Eye, 
  MousePointer, 
  TrendingUp,
  BarChart3,
  Upload,
  ExternalLink,
  Play,
  Star
} from 'lucide-react';
import { 
  getMyBannerAds,
  createBannerAd,
  updateBannerAd,
  deleteBannerAd,
  getBannerCategories,
  getBannerAnalytics
} from '../../api/banner';
import BannerUploadSystem from './BannerUploadSystem';

const MyBanners = () => {
  const [banners, setBanners] = useState([]);
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [showUploadModal, setShowUploadModal] = useState(false);
  const [showCreateForm, setShowCreateForm] = useState(false);
  const [editingBanner, setEditingBanner] = useState(null);
  const [analytics, setAnalytics] = useState({});

  // Form state
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    category_id: '',
    type: 'image',
    size: 'medium_rectangle',
    target_url: '',
    status: 'active',
    start_date: '',
    end_date: '',
    image_url: ''
  });

  // Load user's banners
  useEffect(() => {
    loadMyBanners();
  }, []);

  const loadMyBanners = async () => {
    try {
      setLoading(true);
      setError(null);

      const [bannersResponse, categoriesResponse] = await Promise.all([
        getMyBannerAds(),
        getBannerCategories()
      ]);

      if (bannersResponse && bannersResponse.success) {
        setBanners(Array.isArray(bannersResponse.data) ? bannersResponse.data : []);
      } else {
        setBanners([]);
      }

      if (categoriesResponse && categoriesResponse.success) {
        setCategories(Array.isArray(categoriesResponse.data) ? categoriesResponse.data : []);
      } else {
        setCategories([]);
      }
    } catch (err) {
      console.error('Error loading user banners:', err);
      if (err.response?.status === 401) {
        setError('Please login to view your banners');
        // Optionally redirect to login
        // window.location.href = '/login';
      } else {
        setError(err.message || 'Failed to load your banners');
      }
      // Reset data on error
      setBanners([]);
      setCategories([]);
    } finally {
      setLoading(false);
    }
  };

  // Load analytics for a specific banner
  const loadBannerAnalytics = async (bannerId) => {
    try {
      const response = await getBannerAnalytics({ banner: bannerId });
      if (response && response.success) {
        setAnalytics(prev => ({
          ...prev,
          [bannerId]: response.data
        }));
      }
    } catch (err) {
      console.error('Error loading banner analytics:', err);
    }
  };

  // Handle form submission
  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      setLoading(true);
      
      if (editingBanner) {
        await updateBannerAd(editingBanner.id, formData);
      } else {
        await createBannerAd(formData);
      }

      // Reset form and reload data
      resetForm();
      setShowCreateForm(false);
      setEditingBanner(null);
      await loadMyBanners();
    } catch (err) {
      setError(err.message || 'Failed to save banner');
    } finally {
      setLoading(false);
    }
  };

  // Reset form
  const resetForm = () => {
    setFormData({
      title: '',
      description: '',
      category_id: '',
      type: 'image',
      size: 'medium_rectangle',
      target_url: '',
      status: 'active',
      start_date: '',
      end_date: '',
      image_url: ''
    });
  };

  // Handle edit banner
  const handleEditBanner = (banner) => {
    setEditingBanner(banner);
    setFormData({
      title: banner.title,
      description: banner.description,
      category_id: banner.category_id,
      type: banner.type,
      size: banner.size,
      target_url: banner.target_url,
      status: banner.status,
      start_date: banner.start_date,
      end_date: banner.end_date,
      image_url: banner.image_url
    });
    setShowCreateForm(true);
  };

  // Handle delete banner
  const handleDeleteBanner = async (bannerId) => {
    if (!window.confirm('Are you sure you want to delete this banner?')) return;

    try {
      const response = await deleteBannerAd(bannerId);
      if (response && response.success) {
        // Refresh the banners list
        await loadMyBanners();
      } else {
        setError('Failed to delete banner');
      }
    } catch (err) {
      console.error('Error deleting banner:', err);
      if (err.response?.status === 401) {
        setError('You are not authorized to delete this banner');
      } else if (err.response?.status === 404) {
        setError('Banner not found');
      } else {
        setError(err.message || 'Failed to delete banner');
      }
    }
  };

  // Handle upload complete
  const handleUploadComplete = (files) => {
    setShowUploadModal(false);
    if (files.length > 0) {
      setFormData(prev => ({
        ...prev,
        image_url: files[0].url
      }));
      setShowCreateForm(true);
    }
  };

  // Handle banner click (track analytics)
  const handleBannerClick = async (banner) => {
    try {
      // Load analytics if not already loaded
      if (!analytics[banner.id]) {
        await loadBannerAnalytics(banner.id);
      }
    } catch (err) {
      console.error('Error handling banner click:', err);
    }
  };

  // Get banner type icon
  const getBannerTypeIcon = (type) => {
    switch (type) {
      case 'video':
        return Play;
      case 'animated':
        return Star;
      default:
        return Eye;
    }
  };

  // Calculate performance metrics
  const calculateCTR = (clicks, views) => {
    if (!views || views === 0) return 0;
    return ((clicks / views) * 100).toFixed(2);
  };

  // Format banner size display
  const formatBannerSize = (size) => {
    const sizes = {
      'leaderboard': '728×90',
      'medium_rectangle': '300×250',
      'large_rectangle': '336×280',
      'skyscraper': '120×600',
      'wide_skyscraper': '160×600',
      'square': '250×250',
      'mobile_banner': '320×50'
    };
    return sizes[size] || size;
  };

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1
      }
    }
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        duration: 0.3
      }
    }
  };

  if (loading && banners.length === 0) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="text-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Loading Your Banners...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-2xl font-bold text-gray-900">My Banners</h2>
          <p className="text-gray-600">Manage your banner advertisements</p>
        </div>
        <div className="flex items-center gap-3">
          <button
            onClick={() => setShowUploadModal(true)}
            className="flex items-center gap-2 px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors"
          >
            <Upload className="w-4 h-4" />
            Upload Banner
          </button>
          <button
            onClick={() => {
              resetForm();
              setShowCreateForm(true);
            }}
            className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
          >
            <Plus className="w-4 h-4" />
            Create Banner
          </button>
        </div>
      </div>

      {/* Stats Overview */}
      <motion.div
        variants={containerVariants}
        initial="hidden"
        animate="visible"
        className="grid grid-cols-1 md:grid-cols-4 gap-6"
      >
        <motion.div variants={itemVariants} className="bg-white rounded-lg shadow p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Total Banners</p>
              <p className="text-2xl font-bold text-gray-900">{banners.length}</p>
            </div>
            <div className="p-3 bg-blue-100 rounded-full">
              <Eye className="w-6 h-6 text-blue-600" />
            </div>
          </div>
        </motion.div>

        <motion.div variants={itemVariants} className="bg-white rounded-lg shadow p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Total Views</p>
              <p className="text-2xl font-bold text-gray-900">
                {banners.reduce((sum, banner) => sum + (banner.view_count || 0), 0).toLocaleString()}
              </p>
            </div>
            <div className="p-3 bg-green-100 rounded-full">
              <BarChart3 className="w-6 h-6 text-green-600" />
            </div>
          </div>
        </motion.div>

        <motion.div variants={itemVariants} className="bg-white rounded-lg shadow p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Total Clicks</p>
              <p className="text-2xl font-bold text-gray-900">
                {banners.reduce((sum, banner) => sum + (banner.click_count || 0), 0).toLocaleString()}
              </p>
            </div>
            <div className="p-3 bg-purple-100 rounded-full">
              <MousePointer className="w-6 h-6 text-purple-600" />
            </div>
          </div>
        </motion.div>

        <motion.div variants={itemVariants} className="bg-white rounded-lg shadow p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Avg CTR</p>
              <p className="text-2xl font-bold text-gray-900">
                {banners.length > 0 
                  ? calculateCTR(
                      banners.reduce((sum, banner) => sum + (banner.click_count || 0), 0),
                      banners.reduce((sum, banner) => sum + (banner.view_count || 0), 0)
                    )
                  : '0'
                }%
              </p>
            </div>
            <div className="p-3 bg-yellow-100 rounded-full">
              <TrendingUp className="w-6 h-6 text-yellow-600" />
            </div>
          </div>
        </motion.div>
      </motion.div>

      {/* Banners List */}
      <motion.div
        variants={containerVariants}
        initial="hidden"
        animate="visible"
        className="bg-white rounded-lg shadow overflow-hidden"
      >
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Banner
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Title & Details
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Status
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Performance
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {banners.map((banner) => {
                const TypeIcon = getBannerTypeIcon(banner.type);
                const bannerAnalytics = analytics[banner.id];
                
                return (
                  <motion.tr
                    key={banner.id}
                    variants={itemVariants}
                    className="hover:bg-gray-50"
                  >
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center">
                        <img
                          src={banner.image_url || '/img/banner/default-banner.jpg'}
                          alt={banner.title}
                          className="h-12 w-20 object-cover rounded cursor-pointer hover:opacity-80"
                          onClick={() => handleBannerClick(banner)}
                        />
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <div>
                        <div className="text-sm font-medium text-gray-900">{banner.title}</div>
                        <div className="text-sm text-gray-500">{formatBannerSize(banner.size)}</div>
                        <div className="flex items-center gap-2 mt-1">
                          <span className="inline-flex items-center px-2 py-0.5 rounded text-xs font-medium bg-gray-100 text-gray-800">
                            <TypeIcon className="w-3 h-3 mr-1" />
                            {banner.type}
                          </span>
                          {banner.target_url && (
                            <button
                              onClick={() => window.open(banner.target_url, '_blank')}
                              className="text-blue-600 hover:text-blue-800"
                            >
                              <ExternalLink className="w-3 h-3" />
                            </button>
                          )}
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${
                        banner.status === 'active' 
                          ? 'bg-green-100 text-green-800'
                          : banner.status === 'pending'
                          ? 'bg-yellow-100 text-yellow-800'
                          : 'bg-red-100 text-red-800'
                      }`}>
                        {banner.status}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm text-gray-900">
                        <div>{banner.view_count || 0} views</div>
                        <div>{banner.click_count || 0} clicks</div>
                        <div className="text-xs text-gray-500">
                          CTR: {calculateCTR(banner.click_count, banner.view_count)}%
                        </div>
                        {bannerAnalytics && (
                          <div className="text-xs text-blue-600 mt-1">
                            <BarChart3 className="inline w-3 h-3 mr-1" />
                            Detailed analytics available
                          </div>
                        )}
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                      <div className="flex items-center gap-2">
                        <button
                          onClick={() => handleEditBanner(banner)}
                          className="text-blue-600 hover:text-blue-900"
                        >
                          <Edit2 className="w-4 h-4" />
                        </button>
                        <button
                          onClick={() => handleDeleteBanner(banner.id)}
                          className="text-red-600 hover:text-red-900"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                        <button
                          onClick={() => handleBannerClick(banner)}
                          className="text-gray-600 hover:text-gray-900"
                        >
                          <BarChart3 className="w-4 h-4" />
                        </button>
                      </div>
                    </td>
                  </motion.tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </motion.div>

      {/* Empty State */}
      {banners.length === 0 && !loading && (
        <div className="text-center py-12">
          <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <Eye className="w-8 h-8 text-gray-400" />
          </div>
          <h3 className="text-lg font-medium text-gray-900 mb-2">No banners yet</h3>
          <p className="text-gray-500 mb-6">Create your first banner advertisement to get started.</p>
          <div className="flex items-center justify-center gap-3">
            <button
              onClick={() => setShowUploadModal(true)}
              className="flex items-center gap-2 px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors"
            >
              <Upload className="w-4 h-4" />
              Upload Banner
            </button>
            <button
              onClick={() => {
                resetForm();
                setShowCreateForm(true);
              }}
              className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
            >
              <Plus className="w-4 h-4" />
              Create Banner
            </button>
          </div>
        </div>
      )}

      {/* Create/Edit Form Modal */}
      {showCreateForm && (
        <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
            <div className="p-6">
              <h3 className="text-lg font-semibold mb-4">
                {editingBanner ? 'Edit Banner' : 'Create New Banner'}
              </h3>
              
              <form onSubmit={handleSubmit} className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Title
                  </label>
                  <input
                    type="text"
                    required
                    value={formData.title}
                    onChange={(e) => setFormData(prev => ({ ...prev, title: e.target.value }))}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Description
                  </label>
                  <textarea
                    value={formData.description}
                    onChange={(e) => setFormData(prev => ({ ...prev, description: e.target.value }))}
                    rows={3}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  />
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Category
                    </label>
                    <select
                      required
                      value={formData.category_id}
                      onChange={(e) => setFormData(prev => ({ ...prev, category_id: e.target.value }))}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    >
                      <option value="">Select Category</option>
                      {categories.map(category => (
                        <option key={category.id} value={category.id}>
                          {category.name}
                        </option>
                      ))}
                    </select>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Banner Size
                    </label>
                    <select
                      value={formData.size}
                      onChange={(e) => setFormData(prev => ({ ...prev, size: e.target.value }))}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    >
                      <option value="leaderboard">Leaderboard (728×90)</option>
                      <option value="medium_rectangle">Medium Rectangle (300×250)</option>
                      <option value="large_rectangle">Large Rectangle (336×280)</option>
                      <option value="skyscraper">Skyscraper (120×600)</option>
                      <option value="wide_skyscraper">Wide Skyscraper (160×600)</option>
                      <option value="square">Square (250×250)</option>
                      <option value="mobile_banner">Mobile Banner (320×50)</option>
                    </select>
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Target URL
                  </label>
                  <input
                    type="url"
                    value={formData.target_url}
                    onChange={(e) => setFormData(prev => ({ ...prev, target_url: e.target.value }))}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Banner Image
                  </label>
                  {formData.image_url && (
                    <img
                      src={formData.image_url}
                      alt="Banner preview"
                      className="h-16 w-24 object-cover rounded mb-2"
                    />
                  )}
                  <button
                    type="button"
                    onClick={() => setShowUploadModal(true)}
                    className="px-4 py-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition-colors"
                  >
                    {formData.image_url ? 'Change Image' : 'Upload Image'}
                  </button>
                </div>

                <div className="flex justify-end gap-3 pt-4">
                  <button
                    type="button"
                    onClick={() => {
                      setShowCreateForm(false);
                      setEditingBanner(null);
                      resetForm();
                    }}
                    className="px-4 py-2 text-gray-700 bg-gray-100 rounded-lg hover:bg-gray-200 transition-colors"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    disabled={loading}
                    className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors disabled:opacity-50"
                  >
                    {loading ? 'Saving...' : editingBanner ? 'Update Banner' : 'Create Banner'}
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
      )}

      {/* Upload Modal */}
      {showUploadModal && (
        <BannerUploadSystem
          onUploadComplete={handleUploadComplete}
          onClose={() => setShowUploadModal(false)}
        />
      )}

      {/* Error Alert */}
      {error && (
        <div className="bg-red-50 border border-red-200 rounded-lg p-4">
          <div className="flex">
            <div className="flex-shrink-0">
              <svg className="h-5 w-5 text-red-400" viewBox="0 0 20 20" fill="currentColor">
                <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
              </svg>
            </div>
            <div className="ml-3">
              <p className="text-sm text-red-800">{error}</p>
            </div>
            <div className="ml-auto pl-3">
              <button
                onClick={() => setError(null)}
                className="text-red-400 hover:text-red-600"
              >
                <svg className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                  <path fillRule="evenodd" d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z" clipRule="evenodd" />
                </svg>
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default MyBanners;
