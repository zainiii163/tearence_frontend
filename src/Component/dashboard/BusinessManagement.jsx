import React, { useState, useEffect } from 'react';
import { FaPlus, FaEdit, FaBuilding } from 'react-icons/fa';
import businessService from '../../services/BusinessService';
import BusinessForm from '../Business/BusinessForm';
import { getStorageAssetUrl } from '../../utils/jobsHelpers';

const BusinessManagement = ({ openCreateOnMount = false, onCreateOpened }) => {
  const [business, setBusiness] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [showForm, setShowForm] = useState(false);

  const loadBusiness = async () => {
    try {
      setLoading(true);
      setError(null);
      const response = await businessService.getMyBusiness();
      setBusiness(response?.data || null);
    } catch (err) {
      setError('Failed to load business profile');
      setBusiness(null);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadBusiness();
  }, []);

  useEffect(() => {
    if (openCreateOnMount && !loading && !business) {
      setShowForm(true);
      onCreateOpened?.();
    }
  }, [openCreateOnMount, loading, business]);

  if (loading) {
    return (
      <div className="flex justify-center items-center py-12">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600" />
      </div>
    );
  }

  const logoUrl = business?.business_logo ? getStorageAssetUrl(business.business_logo) : null;

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold text-gray-900">Business Profile Management</h2>
        {business ? (
          <button
            type="button"
            onClick={() => setShowForm(true)}
            className="flex items-center px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
          >
            <FaEdit className="mr-2" />
            Edit Business
          </button>
        ) : (
          <button
            type="button"
            onClick={() => setShowForm(true)}
            className="flex items-center px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
          >
            <FaPlus className="mr-2" />
            Create Business
          </button>
        )}
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
              <h3 className="text-xl font-semibold text-gray-900">{business.business_name || business.name}</h3>
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
                  <p className="text-gray-500">Website</p>
                  <p className="font-medium">{business.business_website || '—'}</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      ) : (
        <div className="bg-white rounded-lg shadow p-12 text-center text-gray-500">
          <FaBuilding className="h-12 w-12 mx-auto mb-4 text-gray-300" />
          No business profile yet. Create your business to appear on the Business page.
        </div>
      )}

      {showForm && (
        <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-lg w-full max-w-4xl max-h-[90vh] overflow-y-auto">
            <BusinessForm
              embedded
              isEdit={Boolean(business)}
              onClose={() => setShowForm(false)}
              onSuccess={() => {
                setShowForm(false);
                loadBusiness();
              }}
            />
          </div>
        </div>
      )}
    </div>
  );
};

export default BusinessManagement;
