import React, { useState, useEffect, useMemo } from 'react';
import { FaPlus, FaEdit, FaTrash, FaEye, FaPlane } from 'react-icons/fa';
import resortsTravelAPI from '../../services/resortsTravelAPI';
import TravelPostFormModal from '../resorts/TravelPostFormModal';
import { getTravelImageUrl } from '../../utils/travelFormHelpers';
import { extractListItems, formatCityCountry } from '../../utils/apiResponseHelpers';
import { ListingStatusFilterBar, ListingStatusCell, filterListingsByLifecycle } from './ListingStatusControls';

const ResortsTravelManagement = ({ openCreateOnMount = false, onCreateOpened }) => {
  const [resortsTravel, setResortsTravel] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [filterStatus, setFilterStatus] = useState('all');
  const [showForm, setShowForm] = useState(false);
  const [editingItem, setEditingItem] = useState(null);

  const loadResortsTravel = async () => {
    try {
      setLoading(true);
      setError(null);
      const response = await resortsTravelAPI.getMyAdverts();
      setResortsTravel(extractListItems(response));
    } catch (err) {
      setError('Failed to load resorts and travel listings');
      setResortsTravel([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadResortsTravel();
  }, []);

  useEffect(() => {
    if (openCreateOnMount) {
      setEditingItem(null);
      setShowForm(true);
      onCreateOpened?.();
    }
  }, [openCreateOnMount]);

  const handleDelete = async (id) => {
    if (!window.confirm('Are you sure you want to delete this listing?')) return;
    try {
      await resortsTravelAPI.deleteTravelAdvert(id);
      setResortsTravel((prev) => prev.filter((rt) => rt.id !== id));
    } catch (err) {
      setError('Failed to delete listing');
    }
  };

  const handleFormClose = () => {
    setShowForm(false);
    setEditingItem(null);
  };

  const handleFormSuccess = async () => {
    handleFormClose();
    await loadResortsTravel();
  };

  const filteredItems = useMemo(
    () => filterListingsByLifecycle(resortsTravel, filterStatus),
    [resortsTravel, filterStatus]
  );

  if (loading) {
    return (
      <div className="flex justify-center items-center py-12">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-teal-600" />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold text-gray-900">Resorts &amp; Travel Management</h2>
        <button
          type="button"
          onClick={() => { setEditingItem(null); setShowForm(true); }}
          className="flex items-center px-4 py-2 bg-teal-600 text-white rounded-lg hover:bg-teal-700"
        >
          <FaPlus className="mr-2" />
          Post Listing
        </button>
      </div>

      {error && (
        <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg">{error}</div>
      )}

      <ListingStatusFilterBar
        value={filterStatus}
        onChange={setFilterStatus}
        items={resortsTravel}
        id="resorts-travel-status-filter"
      />

      <div className="bg-white rounded-lg shadow overflow-hidden">
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Title</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Type</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Location</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Status</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Actions</th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {filteredItems.length === 0 ? (
              <tr>
                <td colSpan="5" className="px-6 py-12 text-center text-gray-500">
                  <FaPlane className="mx-auto h-12 w-12 text-gray-300 mb-4" />
                  {resortsTravel.length === 0
                    ? 'No listings yet.'
                    : 'No listings match this status filter.'}
                </td>
              </tr>
            ) : (
              filteredItems.map((item) => {
                const imageUrl = getTravelImageUrl(item);
                return (
                  <tr key={item.id} className="hover:bg-gray-50">
                    <td className="px-6 py-4">
                      <div className="flex items-center">
                        {imageUrl && (
                          <img src={imageUrl} alt="" className="h-10 w-10 rounded object-cover mr-3" />
                        )}
                        <div>
                          <div className="text-sm font-medium text-gray-900">{item.title}</div>
                          <div className="text-xs text-gray-500">{item.tagline}</div>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4 text-sm capitalize">{item.advert_type || '—'}</td>
                    <td className="px-6 py-4 text-sm text-gray-500">{formatCityCountry(item.city, item.country)}</td>
                    <td className="px-6 py-4">
                      <ListingStatusCell item={item} upsellType="resorts-travel" onPaid={loadResortsTravel} />
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex space-x-2">
                        <a href={`/resorts-travel/${item.slug}`} target="_blank" rel="noopener noreferrer" className="text-blue-600">
                          <FaEye className="h-4 w-4" />
                        </a>
                        <button type="button" onClick={() => { setEditingItem(item); setShowForm(true); }} className="text-yellow-600">
                          <FaEdit className="h-4 w-4" />
                        </button>
                        <button type="button" onClick={() => handleDelete(item.id)} className="text-red-600">
                          <FaTrash className="h-4 w-4" />
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

      <TravelPostFormModal
        isOpen={showForm}
        onClose={handleFormClose}
        onSuccess={handleFormSuccess}
        editAdvert={editingItem}
      />
    </div>
  );
};

export default ResortsTravelManagement;
