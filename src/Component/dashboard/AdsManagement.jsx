import React, { useState, useEffect, useMemo } from 'react';
import { FaPlus, FaTrash, FaTags, FaEdit } from 'react-icons/fa';
import { buysellAPI } from '../../api/buysell';
import BuySellPostForm from '../buy-sell/BuySellPostForm';
import { extractListItems, formatCityCountry } from '../../utils/apiResponseHelpers';
import DashboardListThumbnail from './DashboardListThumbnail';
import ListingPendingPayAction from './ListingPendingPayAction';
import {
  getListingLifecycleStatus,
  getListingLifecycleClasses,
  formatListingLifecycleLabel,
  isListingAwaitingPayment,
} from '../../utils/dashboardStatsHelpers';

const AdsManagement = ({
  openCreateOnMount = false,
  onCreateOpened,
  hideSectionTitle = false,
}) => {
  const [ads, setAds] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [showForm, setShowForm] = useState(false);
  const [editingAd, setEditingAd] = useState(null);
  const [filterStatus, setFilterStatus] = useState('all');

  const loadAds = async () => {
    try {
      setLoading(true);
      setError(null);
      const response = await buysellAPI.getUserAdverts();
      setAds(extractListItems(response));
    } catch (err) {
      setError('Failed to load ads');
      setAds([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadAds();
  }, []);

  useEffect(() => {
    if (openCreateOnMount) {
      setEditingAd(null);
      setShowForm(true);
      onCreateOpened?.();
    }
  }, [openCreateOnMount, onCreateOpened]);

  const filteredAds = useMemo(() => {
    if (filterStatus === 'all') return ads;
    return ads.filter((ad) => getListingLifecycleStatus(ad) === filterStatus);
  }, [ads, filterStatus]);

  const pendingCount = useMemo(
    () => ads.filter((ad) => isListingAwaitingPayment(ad)).length,
    [ads]
  );

  const handleCreate = () => {
    setEditingAd(null);
    setShowForm(true);
  };

  const handleEdit = (ad) => {
    setEditingAd(ad);
    setShowForm(true);
  };

  const handleFormClose = () => {
    setShowForm(false);
    setEditingAd(null);
  };

  const handleDelete = async (adId) => {
    if (!window.confirm('Are you sure you want to delete this ad?')) return;

    try {
      await buysellAPI.deleteAdvert(adId);
      setAds((prev) => prev.filter((ad) => ad.id !== adId));
    } catch (err) {
      setError('Failed to delete ad');
    }
  };

  const handleFormSuccess = async () => {
    handleFormClose();
    await loadAds();
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center py-12">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600" />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {!hideSectionTitle && (
        <div className="flex justify-between items-center gap-4 flex-wrap">
          <h2 className="text-2xl font-bold text-gray-900">Buy &amp; Sell Ads Management</h2>
          <button
            type="button"
            onClick={handleCreate}
            className="flex items-center px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
          >
            <FaPlus className="mr-2" />
            Post Ad
          </button>
        </div>
      )}
      {hideSectionTitle && (
        <div className="flex justify-end">
          <button
            type="button"
            onClick={handleCreate}
            className="flex items-center px-4 py-2 bg-primary text-white rounded-lg hover:bg-primary/90 text-sm font-semibold"
          >
            <FaPlus className="mr-2" />
            Post Ad
          </button>
        </div>
      )}

      <div className="flex flex-wrap items-center gap-3">
        <label className="text-sm text-gray-600" htmlFor="buysell-status-filter">
          Status
        </label>
        <select
          id="buysell-status-filter"
          value={filterStatus}
          onChange={(e) => setFilterStatus(e.target.value)}
          className="text-sm border border-gray-300 rounded-md px-3 py-1.5 bg-white"
        >
          <option value="all">All</option>
          <option value="active">Active</option>
          <option value="pending">Pending</option>
          <option value="expired">Expired</option>
          <option value="inactive">Inactive</option>
        </select>
        {pendingCount > 0 ? (
          <span className="text-xs font-medium text-amber-700 bg-amber-50 border border-amber-200 rounded-full px-2.5 py-1">
            {pendingCount} awaiting payment
          </span>
        ) : null}
      </div>

      {error && (
        <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg">{error}</div>
      )}

      <div className="bg-white rounded-lg shadow overflow-hidden">
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Image</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Title</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Category</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Price</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Location</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Status</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Actions</th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {filteredAds.length === 0 ? (
              <tr>
                <td colSpan="7" className="px-6 py-12 text-center text-gray-500">
                  <FaTags className="h-12 w-12 mx-auto mb-4 text-gray-300" />
                  {ads.length === 0
                    ? 'No ads found. Post your first buy & sell ad to get started.'
                    : 'No ads match this status filter.'}
                </td>
              </tr>
            ) : (
              filteredAds.map((ad) => {
                const lifecycle = getListingLifecycleStatus(ad);
                const awaiting = isListingAwaitingPayment(ad);
                return (
                  <tr key={ad.id} className="hover:bg-gray-50">
                    <td className="px-6 py-4">
                      <DashboardListThumbnail item={ad} fallback={FaTags} />
                    </td>
                    <td className="px-6 py-4 text-sm font-medium text-gray-900">{ad.title}</td>
                    <td className="px-6 py-4 text-sm text-gray-900">
                      {ad.category?.name || ad.category_name || '—'}
                    </td>
                    <td className="px-6 py-4 text-sm text-gray-900">
                      {ad.currency || 'USD'} {ad.price ?? '—'}
                    </td>
                    <td className="px-6 py-4 text-sm text-gray-900">
                      {formatCityCountry(ad.city, ad.country) || ad.location || '—'}
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex flex-col gap-2">
                        <span
                          className={`inline-flex w-fit px-2 text-xs font-semibold rounded-full ${getListingLifecycleClasses(lifecycle)}`}
                        >
                          {formatListingLifecycleLabel(lifecycle)}
                        </span>
                        {awaiting ? (
                          <ListingPendingPayAction
                            item={ad}
                            upsellType="buysell"
                            onPaid={loadAds}
                          />
                        ) : null}
                      </div>
                    </td>
                    <td className="px-6 py-4 text-sm font-medium">
                      <div className="flex space-x-2">
                        <button
                          type="button"
                          onClick={() => handleEdit(ad)}
                          className="text-blue-600 hover:text-blue-900"
                          title="Edit"
                        >
                          <FaEdit className="h-5 w-5" />
                        </button>
                        <button
                          type="button"
                          onClick={() => handleDelete(ad.id)}
                          className="text-red-600 hover:text-red-900"
                        >
                          <FaTrash className="h-5 w-5" />
                        </button>
                      </div>
                    </td>
                  </tr>
                );
              })
            )}
          </tbody>
        </table>
      </div>

      {showForm && (
        <BuySellPostForm
          onClose={handleFormClose}
          onSuccess={handleFormSuccess}
          editAdvert={editingAd}
        />
      )}
    </div>
  );
};

export default AdsManagement;
