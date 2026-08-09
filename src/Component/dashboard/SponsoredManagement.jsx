import React, { useState, useEffect } from 'react';
import { FaPlus, FaEdit, FaTrash, FaEye, FaCrown } from 'react-icons/fa';
import sponsoredAdvertsAPI from '../../api/sponsoredAdvertsAPI';
import SponsoredPostForm from '../sponsored/SponsoredPostForm';
import { extractListItems } from '../../utils/apiResponseHelpers';
import {
  getSponsoredAdvertStatus,
  getSponsoredStatusClasses,
} from '../../utils/dashboardStatsHelpers';
import DashboardListThumbnail from './DashboardListThumbnail';

const getSponsoredAdvertId = (advert) =>
  advert?.sponsored_advert_id ?? advert?.id ?? null;

const SponsoredManagement = ({
  openCreateOnMount = false,
  onCreateOpened,
  defaultAdvertType = '',
}) => {
  const [adverts, setAdverts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [showForm, setShowForm] = useState(false);
  const [editingAdvert, setEditingAdvert] = useState(null);
  const [statusUpdatingId, setStatusUpdatingId] = useState(null);

  const isBusinessSaleFlow = defaultAdvertType === 'business';
  const pageTitle = isBusinessSaleFlow
    ? 'Businesses for Sale'
    : 'Sponsored Adverts Management';
  const createLabel = isBusinessSaleFlow
    ? 'List Business for Sale'
    : 'Create Sponsored Ad';
  const formTitle = isBusinessSaleFlow
    ? 'Post Business for Sale'
    : undefined;
  const formSubtitle = isBusinessSaleFlow
    ? 'List your business for buyers worldwide'
    : undefined;

  const loadAdverts = async () => {
    try {
      setLoading(true);
      setError(null);
      const response = await sponsoredAdvertsAPI.getMyAdverts();
      let items = extractListItems(response);
      if (isBusinessSaleFlow) {
        items = items.filter((item) => {
          const type = (item.advert_type || '').toLowerCase();
          if (type === 'business') return true;
          const hay = [item.title, item.tagline, item.description]
            .filter(Boolean)
            .join(' ')
            .toLowerCase();
          return hay.includes('business for sale') || hay.includes('for sale');
        });
      }
      setAdverts(items);
    } catch (err) {
      setError('Failed to load sponsored adverts');
      setAdverts([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadAdverts();
  }, [isBusinessSaleFlow]);

  useEffect(() => {
    if (openCreateOnMount) {
      setEditingAdvert(null);
      setShowForm(true);
      onCreateOpened?.();
    }
  }, [openCreateOnMount]);

  const handleCreate = () => {
    setEditingAdvert(null);
    setShowForm(true);
  };

  const handleEdit = (advert) => {
    setEditingAdvert(advert);
    setShowForm(true);
  };

  const handleDelete = async (advert) => {
    const id = getSponsoredAdvertId(advert);
    if (!id) {
      setError('Cannot delete: advert ID is missing');
      return;
    }
    if (!window.confirm('Are you sure you want to delete this sponsored advert?')) return;
    try {
      await sponsoredAdvertsAPI.deleteSponsoredAdvert(id);
      await loadAdverts();
    } catch (err) {
      setError('Failed to delete advert');
    }
  };

  const handleStatusChange = async (advert, newStatus) => {
    const id = getSponsoredAdvertId(advert);
    if (!id) return;

    setStatusUpdatingId(id);
    setError(null);
    try {
      const response = await sponsoredAdvertsAPI.updateStatus(id, newStatus);
      const updated = response?.data;
      setAdverts((prev) =>
        prev.map((item) =>
          getSponsoredAdvertId(item) === id
            ? { ...item, ...updated, status: updated?.status ?? newStatus }
            : item
        )
      );
    } catch (err) {
      setError('Failed to update advert status');
    } finally {
      setStatusUpdatingId(null);
    }
  };

  const handleFormClose = () => {
    setShowForm(false);
    setEditingAdvert(null);
  };

  const handleFormSuccess = async () => {
    handleFormClose();
    await loadAdverts();
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center py-12">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-yellow-500" />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold text-gray-900">{pageTitle}</h2>
        <button type="button" onClick={handleCreate} className="flex items-center px-4 py-2 bg-yellow-500 text-white rounded-lg hover:bg-yellow-600">
          <FaPlus className="mr-2" />
          {createLabel}
        </button>
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
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Tier</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Status</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Actions</th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {adverts.length === 0 ? (
              <tr>
                <td colSpan="7" className="px-6 py-12 text-center text-gray-500">
                  <FaCrown className="h-12 w-12 mx-auto mb-4 text-gray-300" />
                  No sponsored adverts found. Create your first one to get started.
                </td>
              </tr>
            ) : (
              adverts.map((advert) => {
                const advertId = getSponsoredAdvertId(advert);
                const status = getSponsoredAdvertStatus(advert);
                const statusSelectValue = advert.is_active ? 'active' : 'paused';

                return (
                  <tr key={advertId || advert.slug} className="hover:bg-gray-50">
                    <td className="px-6 py-4">
                      <DashboardListThumbnail item={advert} fallback={FaCrown} />
                    </td>
                    <td className="px-6 py-4 text-sm font-medium text-gray-900">{advert.title}</td>
                    <td className="px-6 py-4 text-sm text-gray-500">{advert.category?.name || '—'}</td>
                    <td className="px-6 py-4 text-sm text-gray-900">{advert.price ? `${advert.currency || 'GBP'} ${advert.price}` : '—'}</td>
                    <td className="px-6 py-4 text-sm capitalize">{advert.sponsorship_tier || 'basic'}</td>
                    <td className="px-6 py-4">
                      <div className="flex flex-col gap-2">
                        <span className={`inline-flex w-fit px-2 text-xs font-semibold rounded-full capitalize ${getSponsoredStatusClasses(status)}`}>
                          {status}
                        </span>
                        <select
                          value={statusSelectValue}
                          disabled={statusUpdatingId === advertId}
                          onChange={(e) => handleStatusChange(advert, e.target.value)}
                          className="text-xs border border-gray-300 rounded-md px-2 py-1 bg-white focus:ring-2 focus:ring-yellow-500 focus:border-transparent disabled:opacity-50"
                          aria-label={`Change status for ${advert.title}`}
                        >
                          <option value="active">Set Active</option>
                          <option value="paused">Set Paused</option>
                        </select>
                        {advert.payment_status === 'pending' && status === 'active' && (
                          <span className="text-xs text-amber-600">Payment pending</span>
                        )}
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex space-x-2">
                        <a href={`/sponsored-adverts/${advert.slug || advert.id}`} target="_blank" rel="noopener noreferrer" className="text-blue-600">
                          <FaEye className="h-5 w-5" />
                        </a>
                        <button type="button" onClick={() => handleEdit(advert)} className="text-yellow-600">
                          <FaEdit className="h-5 w-5" />
                        </button>
                        <button type="button" onClick={() => handleDelete(advert)} className="text-red-600">
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
        <SponsoredPostForm
          onCancel={handleFormClose}
          onSuccess={handleFormSuccess}
          editingAdvert={editingAdvert}
          defaultAdvertType={defaultAdvertType || undefined}
          formTitle={formTitle}
          formSubtitle={formSubtitle}
        />
      )}
    </div>
  );
};

export default SponsoredManagement;
