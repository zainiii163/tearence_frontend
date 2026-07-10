import React, { useState, useEffect } from 'react';
import { FaPlus, FaEdit, FaStore } from 'react-icons/fa';
import StoreServices from '../../services/StoreServices';
import toast from 'react-hot-toast';

const emptyForm = {
  store_id: '',
  store_name: '',
  company_name: '',
  company_no: '',
  vat: '',
  status: 'active',
  description: '',
};

const StoreManagement = ({ openCreateOnMount = false, onCreateOpened }) => {
  const [store, setStore] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [showForm, setShowForm] = useState(false);
  const [formData, setFormData] = useState(emptyForm);
  const [saving, setSaving] = useState(false);

  const loadStore = async () => {
    try {
      setLoading(true);
      setError(null);
      const response = await StoreServices.getMyStore();
      const data = response?.data?.data || response?.data || null;
      setStore(data);
      if (data) {
        setFormData({
          store_id: data.store_id || data.id || '',
          store_name: data.store_name || '',
          company_name: data.company_name || '',
          company_no: data.company_no || '',
          vat: data.vat || '',
          status: data.status || 'active',
          description: data.description || '',
        });
      }
    } catch (err) {
      setError('Failed to load store profile');
      setStore(null);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadStore();
  }, []);

  useEffect(() => {
    if (openCreateOnMount && !loading && !store) {
      setShowForm(true);
      onCreateOpened?.();
    }
  }, [openCreateOnMount, loading, store]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSaving(true);
    try {
      if (formData.store_id) {
        await StoreServices.updateStore(formData.store_id, formData);
        toast.success('Store updated successfully');
      } else {
        await StoreServices.createStore(formData);
        toast.success('Store created successfully');
      }
      setShowForm(false);
      await loadStore();
    } catch (err) {
      toast.error(err?.response?.data?.message || 'Failed to save store');
    } finally {
      setSaving(false);
    }
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
        <h2 className="text-2xl font-bold text-gray-900">Store Profile Management</h2>
        <button
          type="button"
          onClick={() => setShowForm(true)}
          className="flex items-center px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
        >
          {store ? <FaEdit className="mr-2" /> : <FaPlus className="mr-2" />}
          {store ? 'Edit Store' : 'Create Store'}
        </button>
      </div>

      {error && (
        <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg">{error}</div>
      )}

      {store ? (
        <div className="bg-white rounded-lg shadow p-6">
          <div className="flex items-start space-x-4">
            <div className="w-16 h-16 bg-green-100 rounded-lg flex items-center justify-center">
              <FaStore className="text-green-600 text-2xl" />
            </div>
            <div className="flex-1">
              <h3 className="text-xl font-semibold text-gray-900">{store.store_name}</h3>
              <p className="text-gray-600 mt-1">{store.description}</p>
              <div className="mt-4 grid grid-cols-2 gap-4 text-sm">
                <div>
                  <p className="text-gray-500">Company</p>
                  <p className="font-medium">{store.company_name || '—'}</p>
                </div>
                <div>
                  <p className="text-gray-500">Company No.</p>
                  <p className="font-medium">{store.company_no || '—'}</p>
                </div>
                <div>
                  <p className="text-gray-500">VAT</p>
                  <p className="font-medium">{store.vat || '—'}</p>
                </div>
                <div>
                  <p className="text-gray-500">Status</p>
                  <p className="font-medium capitalize">{store.status || 'active'}</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      ) : (
        <div className="bg-white rounded-lg shadow p-12 text-center text-gray-500">
          <FaStore className="h-12 w-12 mx-auto mb-4 text-gray-300" />
          No store profile yet. Create your store to get a dedicated store page.
        </div>
      )}

      {showForm && (
        <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-lg w-full max-w-lg p-6 max-h-[90vh] overflow-y-auto">
            <h3 className="text-lg font-semibold mb-4">{store ? 'Edit Store' : 'Create Store'}</h3>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Store Name *</label>
                <input
                  type="text"
                  required
                  value={formData.store_name}
                  onChange={(e) => setFormData({ ...formData, store_name: e.target.value })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Description</label>
                <textarea
                  rows={3}
                  value={formData.description}
                  onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg"
                />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Company Name</label>
                  <input
                    type="text"
                    value={formData.company_name}
                    onChange={(e) => setFormData({ ...formData, company_name: e.target.value })}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Company No.</label>
                  <input
                    type="text"
                    value={formData.company_no}
                    onChange={(e) => setFormData({ ...formData, company_no: e.target.value })}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg"
                  />
                </div>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">VAT</label>
                  <input
                    type="text"
                    value={formData.vat}
                    onChange={(e) => setFormData({ ...formData, vat: e.target.value })}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Status</label>
                  <select
                    value={formData.status}
                    onChange={(e) => setFormData({ ...formData, status: e.target.value })}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg"
                  >
                    <option value="active">Active</option>
                    <option value="inactive">Inactive</option>
                  </select>
                </div>
              </div>
              <div className="flex justify-end space-x-3 pt-2">
                <button type="button" onClick={() => setShowForm(false)} className="px-4 py-2 border rounded-lg">
                  Cancel
                </button>
                <button type="submit" disabled={saving} className="px-4 py-2 bg-blue-600 text-white rounded-lg disabled:opacity-50">
                  {saving ? 'Saving...' : store ? 'Update Store' : 'Create Store'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default StoreManagement;
