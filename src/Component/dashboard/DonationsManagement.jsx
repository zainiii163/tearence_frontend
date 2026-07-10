import React, { useState, useEffect } from 'react';
import { FaPlus, FaTrash, FaHandHoldingHeart, FaEdit } from 'react-icons/fa';
import donationAPI from '../../api/donationAPI';
import DonationPostFormModal from '../donation/DonationPostFormModal';
import { extractListItems } from '../../utils/apiResponseHelpers';
import DashboardListThumbnail from './DashboardListThumbnail';

const DonationsManagement = ({ openCreateOnMount = false, onCreateOpened }) => {
  const [donations, setDonations] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [showForm, setShowForm] = useState(false);
  const [editingDonation, setEditingDonation] = useState(null);

  const loadDonations = async () => {
    try {
      setLoading(true);
      setError(null);
      const response = await donationAPI.getMyDonations();
      setDonations(extractListItems(response));
    } catch (err) {
      setError('Failed to load donation campaigns');
      setDonations([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadDonations();
  }, []);

  useEffect(() => {
    if (openCreateOnMount) {
      setEditingDonation(null);
      setShowForm(true);
      onCreateOpened?.();
    }
  }, [openCreateOnMount, onCreateOpened]);

  const handleCreate = () => {
    setEditingDonation(null);
    setShowForm(true);
  };

  const handleEdit = (donation) => {
    setEditingDonation(donation);
    setShowForm(true);
  };

  const handleFormClose = () => {
    setShowForm(false);
    setEditingDonation(null);
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Are you sure you want to delete this donation campaign?')) return;
    try {
      await donationAPI.deleteDonation(id);
      await loadDonations();
    } catch (err) {
      setError('Failed to delete donation campaign');
    }
  };

  const handleFormSuccess = () => {
    handleFormClose();
    loadDonations();
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
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold text-gray-900">My Donation Campaigns</h2>
        <button
          type="button"
          onClick={handleCreate}
          className="flex items-center px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
        >
          <FaPlus className="mr-2" />
          Create Campaign
        </button>
      </div>

      {error && (
        <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg">{error}</div>
      )}

      <div className="bg-white rounded-lg shadow overflow-hidden">
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Cover</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Title</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Category</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Goal</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Raised</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Status</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Actions</th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {donations.length === 0 ? (
                <tr>
                  <td colSpan="7" className="px-6 py-12 text-center text-gray-500">
                    <FaHandHoldingHeart className="h-12 w-12 mx-auto mb-4 text-gray-300" />
                    No donation campaigns yet. Create your first campaign to get started.
                  </td>
                </tr>
              ) : (
                donations.map((donation) => (
                  <tr key={donation.id} className="hover:bg-gray-50">
                    <td className="px-6 py-4">
                      <DashboardListThumbnail item={donation} fallback={FaHandHoldingHeart} className="h-12 w-12" />
                    </td>
                    <td className="px-6 py-4 text-sm font-medium text-gray-900">{donation.title}</td>
                    <td className="px-6 py-4 text-sm text-gray-500">{donation.category || donation.cause_type || '—'}</td>
                    <td className="px-6 py-4 text-sm text-gray-900">
                      {donation.currency || 'USD'} {donation.goal_amount ?? donation.target_amount ?? '—'}
                    </td>
                    <td className="px-6 py-4 text-sm text-gray-900">
                      {donation.currency || 'USD'} {donation.raised_amount ?? donation.amount_raised ?? 0}
                    </td>
                    <td className="px-6 py-4">
                      <span className={`px-2 text-xs font-semibold rounded-full ${
                        donation.status === 'active' ? 'bg-green-100 text-green-800' : 'bg-gray-100 text-gray-800'
                      }`}>
                        {donation.status || 'pending'}
                      </span>
                    </td>
                    <td className="px-6 py-4 text-sm font-medium">
                      <div className="flex space-x-2">
                        <button
                          type="button"
                          onClick={() => handleEdit(donation)}
                          className="text-blue-600 hover:text-blue-900"
                          title="Edit"
                        >
                          <FaEdit className="h-5 w-5" />
                        </button>
                        <button
                          type="button"
                          onClick={() => handleDelete(donation.id)}
                          className="text-red-600 hover:text-red-900"
                          title="Delete"
                        >
                          <FaTrash className="h-5 w-5" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      {showForm && (
        <DonationPostFormModal
          onClose={handleFormClose}
          onSuccess={handleFormSuccess}
          editDonation={editingDonation}
        />
      )}
    </div>
  );
};

export default DonationsManagement;
