import React, { useState, useEffect } from 'react';
import { FaPlus, FaEdit, FaStore, FaExternalLinkAlt } from 'react-icons/fa';
import { Link } from 'react-router-dom';
import StoreServices from '../../services/StoreServices';
import toast from 'react-hot-toast';
import { getStorageAssetUrl } from '../../utils/jobsHelpers';

const STORE_CATEGORIES = [
  { value: 'fashion', label: 'Fashion' },
  { value: 'electronics', label: 'Electronics' },
  { value: 'home', label: 'Home & Living' },
  { value: 'food', label: 'Food & Grocery' },
  { value: 'beauty', label: 'Beauty' },
  { value: 'sports', label: 'Sports' },
  { value: 'services', label: 'Services' },
  { value: 'other', label: 'Other' },
];

const emptyForm = {
  store_id: '',
  store_name: '',
  company_name: '',
  company_no: '',
  vat: '',
  status: 'active',
  description: '',
  category: 'other',
  store_address: '',
  phone: '',
  email: '',
  website: '',
};

const StoreManagement = ({ openCreateOnMount = false, onCreateOpened }) => {
  const [store, setStore] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [showForm, setShowForm] = useState(false);
  const [formData, setFormData] = useState(emptyForm);
  const [saving, setSaving] = useState(false);
  const [logoFile, setLogoFile] = useState(null);
  const [bannerFile, setBannerFile] = useState(null);
  const [logoPreview, setLogoPreview] = useState('');
  const [bannerPreview, setBannerPreview] = useState('');

  const mapStoreToForm = (data) => ({
    store_id: data.store_id || data.id || '',
    store_name: data.store_name || '',
    company_name: data.company_name || '',
    company_no: data.company_no || '',
    vat: data.vat || '',
    status: data.status || 'active',
    description: data.description || '',
    category: data.category || 'other',
    store_address: data.store_address || '',
    phone: data.phone || '',
    email: data.email || '',
    website: data.website || '',
  });

  const mediaUrl = (path) => (path ? getStorageAssetUrl(path) || path : '');

  const loadStore = async () => {
    try {
      setLoading(true);
      setError(null);
      const response = await StoreServices.getMyStore();
      const data = response?.data?.data || response?.data || null;
      setStore(data);
      if (data) {
        setFormData(mapStoreToForm(data));
        setLogoPreview(mediaUrl(data.store_logo));
        setBannerPreview(mediaUrl(data.store_banner));
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

  const buildPayload = () => {
    const fd = new FormData();
    Object.entries(formData).forEach(([key, value]) => {
      if (key === 'store_id') return;
      if (value !== null && value !== undefined) fd.append(key, value);
    });
    if (logoFile) fd.append('store_logo', logoFile);
    if (bannerFile) fd.append('store_banner', bannerFile);
    return fd;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSaving(true);
    try {
      const payload = buildPayload();
      if (formData.store_id) {
        await StoreServices.updateStore(formData.store_id, payload);
        toast.success('Store updated successfully');
      } else {
        await StoreServices.createStore(payload);
        toast.success('Store created successfully');
      }
      setShowForm(false);
      setLogoFile(null);
      setBannerFile(null);
      await loadStore();
    } catch (err) {
      toast.error(err?.response?.data?.message || err?.message || 'Failed to save store');
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center py-12">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-teal-600" />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center gap-3 flex-wrap">
        <h2 className="text-2xl font-bold text-gray-900">Online Store</h2>
        <div className="flex gap-2">
          {store?.slug && (
            <Link
              to={`/store/${store.slug}`}
              className="inline-flex items-center px-4 py-2 border border-teal-200 text-teal-800 rounded-lg hover:bg-teal-50"
            >
              <FaExternalLinkAlt className="mr-2" /> View public page
            </Link>
          )}
          <button
            type="button"
            onClick={() => {
              if (store) {
                setFormData(mapStoreToForm(store));
                setLogoPreview(mediaUrl(store.store_logo));
                setBannerPreview(mediaUrl(store.store_banner));
              } else {
                setFormData(emptyForm);
                setLogoPreview('');
                setBannerPreview('');
              }
              setLogoFile(null);
              setBannerFile(null);
              setShowForm(true);
            }}
            className="flex items-center px-4 py-2 bg-teal-600 text-white rounded-lg hover:bg-teal-700"
          >
            {store ? <FaEdit className="mr-2" /> : <FaPlus className="mr-2" />}
            {store ? 'Edit Store' : 'Create Store'}
          </button>
        </div>
      </div>

      {error && (
        <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg">{error}</div>
      )}

      {store ? (
        <div className="bg-white rounded-lg shadow p-6">
          <div className="flex items-start space-x-4">
            {mediaUrl(store.store_logo) ? (
              <img
                src={mediaUrl(store.store_logo)}
                alt={store.store_name}
                className="w-16 h-16 rounded-lg object-cover"
              />
            ) : (
              <div className="w-16 h-16 bg-teal-100 rounded-lg flex items-center justify-center">
                <FaStore className="text-teal-700 text-2xl" />
              </div>
            )}
            <div className="flex-1">
              <h3 className="text-xl font-semibold text-gray-900">{store.store_name}</h3>
              <p className="text-gray-600 mt-1">{store.description || 'No description yet.'}</p>
              <div className="mt-4 grid grid-cols-2 gap-4 text-sm">
                <div>
                  <p className="text-gray-500">Category</p>
                  <p className="font-medium capitalize">{store.category || '—'}</p>
                </div>
                <div>
                  <p className="text-gray-500">Company</p>
                  <p className="font-medium">{store.company_name || '—'}</p>
                </div>
                <div>
                  <p className="text-gray-500">Address</p>
                  <p className="font-medium">{store.store_address || '—'}</p>
                </div>
                <div>
                  <p className="text-gray-500">Email</p>
                  <p className="font-medium">{store.email || '—'}</p>
                </div>
                <div>
                  <p className="text-gray-500">Phone</p>
                  <p className="font-medium">{store.phone || '—'}</p>
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
          No store profile yet. Create your store to get a public Online Stores page.
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
                <label className="block text-sm font-medium text-gray-700 mb-1">Category</label>
                <select
                  value={formData.category}
                  onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg"
                >
                  {STORE_CATEGORIES.map((c) => (
                    <option key={c.value} value={c.value}>{c.label}</option>
                  ))}
                </select>
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
                  <label className="block text-sm font-medium text-gray-700 mb-1">Store logo</label>
                  <input
                    type="file"
                    accept="image/*"
                    onChange={(e) => {
                      const file = e.target.files?.[0];
                      if (!file) return;
                      setLogoFile(file);
                      setLogoPreview(URL.createObjectURL(file));
                    }}
                    className="w-full text-sm"
                  />
                  {logoPreview ? (
                    <img src={logoPreview} alt="Logo preview" className="mt-2 h-16 w-16 rounded object-cover" />
                  ) : null}
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Store banner</label>
                  <input
                    type="file"
                    accept="image/*"
                    onChange={(e) => {
                      const file = e.target.files?.[0];
                      if (!file) return;
                      setBannerFile(file);
                      setBannerPreview(URL.createObjectURL(file));
                    }}
                    className="w-full text-sm"
                  />
                  {bannerPreview ? (
                    <img src={bannerPreview} alt="Banner preview" className="mt-2 h-16 w-full rounded object-cover" />
                  ) : null}
                </div>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Address</label>
                <input
                  type="text"
                  value={formData.store_address}
                  onChange={(e) => setFormData({ ...formData, store_address: e.target.value })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg"
                />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Email</label>
                  <input
                    type="email"
                    value={formData.email}
                    onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Phone</label>
                  <input
                    type="text"
                    value={formData.phone}
                    onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg"
                  />
                </div>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Website</label>
                <input
                  type="url"
                  value={formData.website}
                  onChange={(e) => setFormData({ ...formData, website: e.target.value })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg"
                  placeholder="https://"
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
                <button type="submit" disabled={saving} className="px-4 py-2 bg-teal-600 text-white rounded-lg disabled:opacity-50">
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
