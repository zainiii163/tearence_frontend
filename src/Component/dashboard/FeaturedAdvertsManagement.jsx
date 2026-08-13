import React, { useState, useEffect, useMemo } from 'react';
import { FaPlus, FaEdit, FaTrash, FaEye, FaTimes, FaSave, FaCrown, FaStar, FaRocket, FaMapPin, FaCalendar } from 'react-icons/fa';
import { featuredAdvertsAPI } from '../../api/featuredAdverts';
import FeaturedPostForm from '../featured/FeaturedPostForm';

import { extractListItems, formatCityCountry } from '../../utils/apiResponseHelpers';
import DashboardListThumbnail from './DashboardListThumbnail';
import ListingPendingPayAction from './ListingPendingPayAction';
import {
  getListingLifecycleStatus,
  getListingLifecycleClasses,
  formatListingLifecycleLabel,
  isListingAwaitingPayment,
} from '../../utils/dashboardStatsHelpers';

const FeaturedAdvertsManagement = ({ openCreateOnMount = false, onCreateOpened }) => {
  const [adverts, setAdverts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [showPostForm, setShowPostForm] = useState(false);
  const [editingAdvert, setEditingAdvert] = useState(null);
  const [deleteConfirm, setDeleteConfirm] = useState(null);
  const [filterStatus, setFilterStatus] = useState('all');
  const [stats, setStats] = useState({
    total: 0,
    pending: 0,
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

      const promoted = advertsData.filter((a) => a.upsell_tier === 'promoted').length;
      const featured = advertsData.filter((a) => a.upsell_tier === 'featured').length;
      const sponsored = advertsData.filter((a) => a.upsell_tier === 'sponsored').length;
      const pending = advertsData.filter((a) => isListingAwaitingPayment(a)).length;
      const totalViews = advertsData.reduce((sum, a) => sum + (a.view_count || 0), 0);
      const totalSaves = advertsData.reduce((sum, a) => sum + (a.save_count || 0), 0);

      setStats({
        total: advertsData.length,
        pending,
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

  const filteredAdverts = useMemo(() => {
    if (filterStatus === 'all') return adverts;
    return adverts.filter((a) => getListingLifecycleStatus(a) === filterStatus);
  }, [adverts, filterStatus]);

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

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-purple-600"></div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-7 gap-4">
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
              <p className="text-sm text-gray-600">Pending</p>
              <p className="text-2xl font-bold text-amber-600">{stats.pending}</p>
            </div>
            <FaCalendar className="h-8 w-8 text-amber-500" />
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

      <div className="bg-white rounded-lg shadow">
        <div className="px-6 py-4 border-b border-gray-200 flex flex-wrap justify-between items-center gap-3">
          <h2 className="text-lg font-semibold text-gray-900">My Featured Adverts</h2>
          <div className="flex items-center gap-3">
            <select
              value={filterStatus}
              onChange={(e) => setFilterStatus(e.target.value)}
              className="text-sm border border-gray-300 rounded-md px-3 py-1.5 bg-white"
              aria-label="Filter by status"
            >
              <option value="all">All statuses</option>
              <option value="active">Active</option>
              <option value="pending">Pending</option>
              <option value="expired">Expired</option>
              <option value="inactive">Inactive</option>
            </select>
            <button
              onClick={handleCreate}
              className="inline-flex items-center px-4 py-2 bg-gradient-to-r from-purple-600 to-blue-600 text-white rounded-lg hover:from-purple-700 hover:to-blue-700 transition-all"
            >
              <FaPlus className="mr-2 h-4 w-4" />
              Create Featured Advert
            </button>
          </div>
        </div>

        <div className="divide-y divide-gray-200">
          {error && (
            <div className="p-6 bg-red-50 border-l-4 border-red-500">
              <p className="text-red-700">{error}</p>
            </div>
          )}

          {filteredAdverts.length > 0 ? (
            filteredAdverts.map((advert) => {
              const lifecycle = getListingLifecycleStatus(advert);
              const awaiting = isListingAwaitingPayment(advert);
              return (
                <div key={advert.id} className="p-6 hover:bg-gray-50 transition-colors">
                  <div className="flex items-start space-x-4">
                    <DashboardListThumbnail item={advert} fallback={FaCrown} className="w-24 h-24 rounded-lg" />

                    <div className="flex-1 min-w-0">
                      <div className="flex items-start justify-between">
                        <div className="flex-1">
                          <div className="flex items-center flex-wrap gap-2 mb-2">
                            <h3 className="text-lg font-semibold text-gray-900 truncate">
                              {advert.title}
                            </h3>
                            {getTierBadge(advert.upsell_tier)}
                            <span
                              className={`px-2.5 py-0.5 rounded-full text-xs font-medium ${getListingLifecycleClasses(lifecycle)}`}
                            >
                              {formatListingLifecycleLabel(lifecycle)}
                            </span>
                          </div>

                          <div className="flex items-center space-x-4 text-sm text-gray-600 mb-2">
                            <span className="flex items-center">
                              <FaMapPin className="mr-1 h-3 w-3" />
                              {formatCityCountry(advert.city, advert.country)}
                            </span>
                            <span className="flex items-center">
                              <FaCalendar className="mr-1 h-3 w-3" />
                              Expires:{' '}
                              {advert.expires_at
                                ? new Date(advert.expires_at).toLocaleDateString()
                                : '—'}
                            </span>
                            {advert.upsell_price ? (
                              <span className="font-semibold text-amber-700">
                                Invoice: ${Number(advert.upsell_price).toFixed(2)}
                              </span>
                            ) : null}
                          </div>

                          <p className="text-sm text-gray-700 line-clamp-2 mb-2">
                            {advert.description}
                          </p>

                          {awaiting ? (
                            <div className="mb-2">
                              <ListingPendingPayAction
                                item={advert}
                                upsellType="featured"
                                amount={advert.upsell_price}
                                onPaid={loadAdverts}
                              />
                            </div>
                          ) : null}

                          <div className="flex items-center space-x-4 text-xs text-gray-500">
                            <span className="flex items-center">
                              <FaEye className="mr-1" /> {advert.view_count || 0} views
                            </span>
                            <span className="flex items-center">
                              <FaSave className="mr-1" /> {advert.save_count || 0} saves
                            </span>
                          </div>
                        </div>

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
              <h3 className="text-lg font-medium text-gray-900 mb-2">
                {adverts.length === 0 ? 'No Featured Adverts Yet' : 'No adverts for this status'}
              </h3>
              <p className="text-gray-600 mb-6">
                {adverts.length === 0
                  ? 'Create your first featured advert to get maximum visibility and reach more customers!'
                  : 'Try another status filter, or clear a pending invoice to go live.'}
              </p>
              {adverts.length === 0 ? (
                <button
                  onClick={handleCreate}
                  className="inline-flex items-center px-6 py-3 bg-gradient-to-r from-purple-600 to-blue-600 text-white rounded-lg hover:from-purple-700 hover:to-blue-700 transition-all"
                >
                  <FaPlus className="mr-2 h-4 w-4" />
                  Create Your First Featured Advert
                </button>
              ) : null}
            </div>
          )}
        </div>
      </div>

      {showPostForm && (
        <FeaturedPostForm onClose={handleCloseForm} editingAdvert={editingAdvert} />
      )}
    </div>
  );
};

export default FeaturedAdvertsManagement;
