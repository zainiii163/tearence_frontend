import React, { useState, useEffect } from 'react';
import { FaPlus, FaEdit, FaTrash, FaEye, FaTimes, FaSave, FaCrown, FaStar, FaRocket, FaImage, FaMapPin, FaCalendar } from 'react-icons/fa';
import { featuredAdvertsAPI } from '../../api/featuredAdverts';
import FeaturedPostForm from '../featured/FeaturedPostForm';

import { extractListItems, formatCityCountry } from '../../utils/apiResponseHelpers';
import DashboardListThumbnail from './DashboardListThumbnail';

const FeaturedAdvertsManagement = ({ openCreateOnMount = false, onCreateOpened }) => {
  const [adverts, setAdverts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [showPostForm, setShowPostForm] = useState(false);
  const [editingAdvert, setEditingAdvert] = useState(null);
  const [deleteConfirm, setDeleteConfirm] = useState(null);
  const [stats, setStats] = useState({
    total: 0,
    promoted: 0,
    featured: 0,
    sponsored: 0,
    totalViews: 0,
    totalSaves: 0,
  });

  const loadAdverts = async () => {
    try {
      setLoading(true);
      setError(null);
      const response = await featuredAdvertsAPI.getMyFeaturedAdverts();
      const advertsData = extractListItems(response);
      setAdverts(advertsData);
        
        // Calculate stats
        const promoted = advertsData.filter(a => a.upsell_tier === 'promoted').length;
        const featured = advertsData.filter(a => a.upsell_tier === 'featured').length;
        const sponsored = advertsData.filter(a => a.upsell_tier === 'sponsored').length;
        const totalViews = advertsData.reduce((sum, a) => sum + (a.view_count || 0), 0);
        const totalSaves = advertsData.reduce((sum, a) => sum + (a.save_count || 0), 0);
        
      setStats({
        total: advertsData.length,
        promoted,
        featured,
        sponsored,
        totalViews,
        totalSaves,
      });
    } catch (err) {
      console.error('Failed to load featured adverts:', err);
      setError('Failed to load featured adverts');
      setAdverts([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadAdverts();
  }, []);

  useEffect(() => {
    if (openCreateOnMount) {
      setEditingAdvert(null);
      setShowPostForm(true);
      onCreateOpened?.();
    }
  }, [openCreateOnMount]);

  const handleCreate = () => {
    setEditingAdvert(null);
    setShowPostForm(true);
  };

  const handleEdit = (advert) => {
    setEditingAdvert(advert);
    setShowPostForm(true);
  };

  const handleDelete = async (advertId) => {
    if (!deleteConfirm) {
      setDeleteConfirm(advertId);
      return;
    }

    try {
      await featuredAdvertsAPI.deleteFeaturedAdvert(advertId);
      await loadAdverts();
      setDeleteConfirm(null);
      alert('Featured advert deleted successfully!');
    } catch (err) {
      console.error('Failed to delete featured advert:', err);
      alert('Failed to delete featured advert. Please try again.');
    }
  };

  const handleCloseForm = () => {
    setShowPostForm(false);
    setEditingAdvert(null);
    loadAdverts();
  };

  const getTierBadge = (tier) => {
    const badges = {
      promoted: { icon: FaStar, color: 'bg-blue-100 text-blue-800', label: 'Promoted' },
      featured: { icon: FaCrown, color: 'bg-purple-100 text-purple-800', label: 'Featured' },
      sponsored: { icon: FaRocket, color: 'bg-yellow-100 text-yellow-800', label: 'Sponsored' },
    };
    const badge = badges[tier] || badges.promoted;
    const Icon = badge.icon;
    return (
      <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${badge.color}`}>
        <Icon className="mr-1 h-3 w-3" />
        {badge.label}
      </span>
    );
  };

  const getStatusBadge = (advert) => {
    const isActive = advert.is_active && 
                     advert.payment_status === 'paid' && 
                     new Date(advert.starts_at) <= new Date() && 
                     new Date(advert.expires_at) > new Date();
    
    if (isActive) {
      return <span className="px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800">Active</span>;
    }
    
    if (advert.payment_status === 'pending') {
      return <span className="px-2.5 py-0.5 rounded-full text-xs font-medium bg-yellow-100 text-yellow-800">Pending Payment</span>;
    }
    
    if (new Date(advert.expires_at) <= new Date()) {
      return <span className="px-2.5 py-0.5 rounded-full text-xs font-medium bg-gray-100 text-gray-800">Expired</span>;
    }
    
    return <span className="px-2.5 py-0.5 rounded-full text-xs font-medium bg-gray-100 text-gray-800">Inactive</span>;
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-purple-600"></div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-6 gap-4">
        <div className="bg-white rounded-lg shadow p-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600">Total Adverts</p>
              <p className="text-2xl font-bold text-gray-900">{stats.total}</p>
            </div>
            <FaCrown className="h-8 w-8 text-purple-500" />
          </div>
        </div>
        
        <div className="bg-white rounded-lg shadow p-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600">Promoted</p>
              <p className="text-2xl font-bold text-blue-600">{stats.promoted}</p>
            </div>
            <FaStar className="h-8 w-8 text-blue-500" />
          </div>
        </div>
        
        <div className="bg-white rounded-lg shadow p-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600">Featured</p>
              <p className="text-2xl font-bold text-purple-600">{stats.featured}</p>
            </div>
            <FaCrown className="h-8 w-8 text-purple-500" />
          </div>
        </div>
        
        <div className="bg-white rounded-lg shadow p-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600">Sponsored</p>
              <p className="text-2xl font-bold text-yellow-600">{stats.sponsored}</p>
            </div>
            <FaRocket className="h-8 w-8 text-yellow-500" />
          </div>
        </div>
        
        <div className="bg-white rounded-lg shadow p-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600">Total Views</p>
              <p className="text-2xl font-bold text-gray-900">{stats.totalViews}</p>
            </div>
            <FaEye className="h-8 w-8 text-gray-500" />
          </div>
        </div>
        
        <div className="bg-white rounded-lg shadow p-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600">Total Saves</p>
              <p className="text-2xl font-bold text-gray-900">{stats.totalSaves}</p>
            </div>
            <FaSave className="h-8 w-8 text-gray-500" />
          </div>
        </div>
      </div>

      {/* Header with Create Button */}
      <div className="bg-white rounded-lg shadow">
        <div className="px-6 py-4 border-b border-gray-200 flex justify-between items-center">
          <h2 className="text-lg font-semibold text-gray-900">My Featured Adverts</h2>
          <button
            onClick={handleCreate}
            className="inline-flex items-center px-4 py-2 bg-gradient-to-r from-purple-600 to-blue-600 text-white rounded-lg hover:from-purple-700 hover:to-blue-700 transition-all"
          >
            <FaPlus className="mr-2 h-4 w-4" />
            Create Featured Advert
          </button>
        </div>

        {/* Adverts List */}
        <div className="divide-y divide-gray-200">
          {error && (
            <div className="p-6 bg-red-50 border-l-4 border-red-500">
              <p className="text-red-700">{error}</p>
            </div>
          )}

          {adverts.length > 0 ? (
            adverts.map((advert) => {
              return (
                <div key={advert.id} className="p-6 hover:bg-gray-50 transition-colors">
                  <div className="flex items-start space-x-4">
                    <DashboardListThumbnail item={advert} fallback={FaCrown} className="w-24 h-24 rounded-lg" />

                    {/* Content */}
                    <div className="flex-1 min-w-0">
                      <div className="flex items-start justify-between">
                        <div className="flex-1">
                          <div className="flex items-center space-x-2 mb-2">
                            <h3 className="text-lg font-semibold text-gray-900 truncate">
                              {advert.title}
                            </h3>
                            {getTierBadge(advert.upsell_tier)}
                            {getStatusBadge(advert)}
                          </div>
                          
                          <div className="flex items-center space-x-4 text-sm text-gray-600 mb-2">
                            <span className="flex items-center">
                              <FaMapPin className="mr-1 h-3 w-3" />
                              {formatCityCountry(advert.city, advert.country)}
                            </span>
                            <span className="flex items-center">
                              <FaCalendar className="mr-1 h-3 w-3" />
                              Expires: {new Date(advert.expires_at).toLocaleDateString()}
                            </span>
                            {advert.price && (
                              <span className="font-semibold text-purple-600">
                                {advert.formatted_price || `£${advert.price}`}
                              </span>
                            )}
                          </div>

                          <p className="text-sm text-gray-700 line-clamp-2 mb-2">
                            {advert.description}
                          </p>

                          <div className="flex items-center space-x-4 text-xs text-gray-500">
                            <span className="flex items-center">
                              <FaEye className="mr-1" /> {advert.view_count || 0} views
                            </span>
                            <span className="flex items-center">
                              <FaSave className="mr-1" /> {advert.save_count || 0} saves
                            </span>
                            <span className="flex items-center">
                              💬 {advert.contact_count || 0} contacts
                            </span>
                          </div>
                        </div>

                        {/* Actions */}
                        <div className="flex items-center space-x-2 ml-4">
                          <a
                            href={`/featured/${advert.id}`}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="p-2 text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
                            title="View"
                          >
                            <FaEye className="h-4 w-4" />
                          </a>
                          <button
                            onClick={() => handleEdit(advert)}
                            className="p-2 text-gray-600 hover:bg-gray-100 rounded-lg transition-colors"
                            title="Edit"
                          >
                            <FaEdit className="h-4 w-4" />
                          </button>
                          <button
                            onClick={() => handleDelete(advert.id)}
                            className={`p-2 rounded-lg transition-colors ${
                              deleteConfirm === advert.id
                                ? 'bg-red-100 text-red-600'
                                : 'text-red-600 hover:bg-red-50'
                            }`}
                            title={deleteConfirm === advert.id ? 'Click again to confirm' : 'Delete'}
                          >
                            {deleteConfirm === advert.id ? (
                              <FaTimes className="h-4 w-4" />
                            ) : (
                              <FaTrash className="h-4 w-4" />
                            )}
                          </button>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              );
            })
          ) : (
            <div className="p-12 text-center">
              <FaCrown className="h-16 w-16 mx-auto mb-4 text-gray-300" />
              <h3 className="text-lg font-medium text-gray-900 mb-2">No Featured Adverts Yet</h3>
              <p className="text-gray-600 mb-6">
                Create your first featured advert to get maximum visibility and reach more customers!
              </p>
              <button
                onClick={handleCreate}
                className="inline-flex items-center px-6 py-3 bg-gradient-to-r from-purple-600 to-blue-600 text-white rounded-lg hover:from-purple-700 hover:to-blue-700 transition-all"
              >
                <FaPlus className="mr-2 h-4 w-4" />
                Create Your First Featured Advert
              </button>
            </div>
          )}
        </div>
      </div>

      {/* Post Form Modal */}
      {showPostForm && (
        <FeaturedPostForm onClose={handleCloseForm} editingAdvert={editingAdvert} />
      )}
    </div>
  );
};

export default FeaturedAdvertsManagement;
