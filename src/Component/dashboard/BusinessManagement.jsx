import React, { useState, useEffect } from 'react';
import { FaPlus, FaEdit, FaTrash, FaBuilding } from 'react-icons/fa';
import businessService from '../../services/BusinessService';
import BusinessForm from '../Business/BusinessForm';
import { getStorageAssetUrl } from '../../utils/jobsHelpers';
import DashboardListThumbnail from './DashboardListThumbnail';

const BusinessManagement = ({ openCreateOnMount = false, onCreateOpened }) => {
  const [business, setBusiness] = useState(null);
  const [listings, setListings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [showProfileForm, setShowProfileForm] = useState(false);
  const [showPostForm, setShowPostForm] = useState(false);
  const [editingListing, setEditingListing] = useState(null);

  const loadBusiness = async () => {
    try {
      const response = await businessService.getMyBusiness();
      const data = response?.data || null;
      // Empty object from API when none exists
      setBusiness(data?.id ? data : null);
      return data?.id ? data : null;
    } catch {
      setBusiness(null);
      return null;
    }
  };

  const loadListings = async (profile) => {
    try {
      const customerId = profile?.customer_id;
      const params = { limit: 100 };
      if (customerId) params.customer_id = customerId;
      const response = await businessService.getAllBusinesses(params);
      const items = response?.data?.items || response?.data || [];
      const list = Array.isArray(items) ? items : [];
      // If API doesn't filter by customer, keep only this customer's rows when known
      const mine = customerId
        ? list.filter((b) => String(b.customer_id) === String(customerId))
        : list;
      setListings(customerId ? mine : list.filter((b) => b.id === profile?.id || b.customer_id));
    } catch {
      setListings([]);
    }
  };

  const loadAll = async () => {
    setLoading(true);
    setError(null);
    const profile = await loadBusiness();
    await loadListings(profile);
    // Fallback: if profile exists but filter emptied list, show profile as listing
    setListings((prev) => {
      if (prev.length === 0 && profile?.id) return [profile];
      return prev;
    });
    setLoading(false);
  };

  useEffect(() => {
    loadAll();
  }, []);

  useEffect(() => {
    if (openCreateOnMount && !loading) {
      setEditingListing(null);
      setShowPostForm(true);
      onCreateOpened?.();
    }
  }, [openCreateOnMount, loading, onCreateOpened]);

  const handlePost = () => {
    setEditingListing(null);
    setShowPostForm(true);
  };

  const handleEditListing = (item) => {
    setEditingListing(item);
    setShowProfileForm(true);
  };

  const handleDeleteListing = async (item) => {
    const id = item?.id;
    if (!id) return;
    if (!window.confirm('Delete this business listing?')) return;
    try {
      await businessService.deleteBusiness(id);
      setListings((prev) => prev.filter((l) => l.id !== id));
      if (business?.id === id) setBusiness(null);
    } catch {
      setError('Failed to delete listing');
    }
  };

  const handlePostClose = () => {
    setShowPostForm(false);
    setEditingListing(null);
  };

  const handlePostSuccess = async () => {
    handlePostClose();
    await loadAll();
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center py-12">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600" />
      </div>
    );
  }

  const logoUrl = business?.business_logo ? getStorageAssetUrl(business.business_logo) : null;
  const categoryProfile = business?.profile || business?.category_profile || {};
  const openingHours = categoryProfile.opening_hours || {};
  const bookingSlots = Array.isArray(categoryProfile.booking_slots)
    ? categoryProfile.booking_slots
    : [];
  const bookingUrl = business?.booking_url || categoryProfile.booking_url || '';

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
        <h2 className="text-2xl font-bold text-gray-900">Business Profile Management</h2>
        <div className="flex flex-wrap gap-2">
          <button
            type="button"
            onClick={handlePost}
            className="inline-flex items-center px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 font-medium"
          >
            <FaPlus className="mr-2" />
            Post Business Listing
          </button>
          {business ? (
            <button
              type="button"
              onClick={() => setShowProfileForm(true)}
              className="inline-flex items-center px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
            >
              <FaEdit className="mr-2" />
              Edit Business
            </button>
          ) : (
            <button
              type="button"
              onClick={() => setShowPostForm(true)}
              className="inline-flex items-center px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
            >
              <FaPlus className="mr-2" />
              Create Business Profile
            </button>
          )}
        </div>
      </div>

      {error && (
        <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg">{error}</div>
      )}

      {business ? (
        <div className="bg-white rounded-lg shadow p-6">
          <div className="flex items-start space-x-4">
            <div className="w-20 h-20 bg-purple-100 rounded-lg flex items-center justify-center overflow-hidden flex-shrink-0">
              {logoUrl ? (
                <img src={logoUrl} alt="" className="w-full h-full object-cover" />
              ) : (
                <FaBuilding className="text-purple-600 text-2xl" />
              )}
            </div>
            <div className="flex-1">
              <h3 className="text-xl font-semibold text-gray-900">
                {business.business_name || business.name}
              </h3>
              <p className="text-gray-600 mt-1">{business.business_description}</p>
              <div className="mt-4 grid grid-cols-2 gap-4 text-sm">
                <div>
                  <p className="text-gray-500">Email</p>
                  <p className="font-medium">{business.business_email || '—'}</p>
                </div>
                <div>
                  <p className="text-gray-500">Phone</p>
                  <p className="font-medium">{business.business_phone_number || '—'}</p>
                </div>
                <div>
                  <p className="text-gray-500">Address</p>
                  <p className="font-medium">{business.business_address || '—'}</p>
                </div>
                <div>
                  <p className="text-gray-500">City / Country</p>
                  <p className="font-medium">
                    {[business.city, business.country].filter(Boolean).join(', ') || '—'}
                  </p>
                </div>
                <div>
                  <p className="text-gray-500">Website</p>
                  <p className="font-medium">{business.business_website || '—'}</p>
                </div>
                <div>
                  <p className="text-gray-500">Booking URL</p>
                  <p className="font-medium break-all">{bookingUrl || '—'}</p>
                </div>
                <div>
                  <p className="text-gray-500">Opening hours</p>
                  <p className="font-medium">
                    {openingHours.monday
                      ? `Mon–Fri ${openingHours.monday}${
                          openingHours.saturday ? ` · Sat ${openingHours.saturday}` : ''
                        }${openingHours.sunday ? ` · Sun ${openingHours.sunday}` : ''}`
                      : '—'}
                  </p>
                </div>
                <div>
                  <p className="text-gray-500">Booking slots</p>
                  <p className="font-medium">{bookingSlots.length ? bookingSlots.join(', ') : '—'}</p>
                </div>
              </div>
              <p className="mt-4 text-xs text-gray-500">
                Edit opening times, booking, and category details with{' '}
                <button
                  type="button"
                  onClick={() => setShowProfileForm(true)}
                  className="text-blue-600 font-semibold underline"
                >
                  Edit Business
                </button>
                .
              </p>
            </div>
          </div>
        </div>
      ) : (
        <div className="bg-white rounded-lg shadow p-12 text-center text-gray-500">
          <FaBuilding className="h-12 w-12 mx-auto mb-4 text-gray-300" />
          No business profile yet. Create a listing to appear on the Businesses page.
        </div>
      )}

      <div className="bg-white rounded-lg shadow overflow-hidden">
        <div className="px-6 py-4 border-b border-gray-200 flex items-center justify-between">
          <h3 className="text-lg font-semibold text-gray-900">Your Business Listings</h3>
          <button
            type="button"
            onClick={handlePost}
            className="inline-flex items-center text-sm font-semibold text-green-700 hover:text-green-800"
          >
            <FaPlus className="mr-1.5 h-3.5 w-3.5" />
            Post
          </button>
        </div>
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Image</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Title</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Status</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Actions</th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {listings.length === 0 ? (
              <tr>
                <td colSpan="4" className="px-6 py-12 text-center text-gray-500">
                  <FaBuilding className="h-10 w-10 mx-auto mb-3 text-gray-300" />
                  No business listings yet.{' '}
                  <button type="button" onClick={handlePost} className="text-green-700 font-semibold underline">
                    Post your first listing
                  </button>
                </td>
              </tr>
            ) : (
              listings.map((item) => (
                <tr key={item.id} className="hover:bg-gray-50">
                  <td className="px-6 py-4">
                    <DashboardListThumbnail
                      item={{
                        ...item,
                        title: item.business_name,
                        image: item.business_logo,
                      }}
                      fallback={FaBuilding}
                    />
                  </td>
                  <td className="px-6 py-4 text-sm font-medium text-gray-900">
                    {item.business_name || '—'}
                  </td>
                  <td className="px-6 py-4">
                    <span
                      className={`px-2 text-xs font-semibold rounded-full ${
                        item.status === 'active'
                          ? 'bg-green-100 text-green-800'
                          : 'bg-gray-100 text-gray-800'
                      }`}
                    >
                      {item.status || 'pending'}
                    </span>
                  </td>
                  <td className="px-6 py-4 text-sm font-medium">
                    <div className="flex space-x-2">
                      <button
                        type="button"
                        onClick={() => handleEditListing(item)}
                        className="text-blue-600 hover:text-blue-900"
                        title="Edit"
                      >
                        <FaEdit className="h-5 w-5" />
                      </button>
                      <button
                        type="button"
                        onClick={() => handleDeleteListing(item)}
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

      {showProfileForm && (
        <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-lg w-full max-w-4xl max-h-[90vh] overflow-y-auto">
            <BusinessForm
              embedded
              isEdit={Boolean(business)}
              onClose={() => {
                setShowProfileForm(false);
                setEditingListing(null);
              }}
              onSuccess={() => {
                setShowProfileForm(false);
                setEditingListing(null);
                loadAll();
              }}
            />
          </div>
        </div>
      )}

      {showPostForm && (
        <div className="fixed inset-0 z-50 overflow-y-auto bg-white">
          <BusinessForm
            embedded
            onClose={handlePostClose}
            onSuccess={handlePostSuccess}
          />
        </div>
      )}
    </div>
  );
};

export default BusinessManagement;
