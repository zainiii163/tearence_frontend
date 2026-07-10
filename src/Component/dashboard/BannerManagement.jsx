import React, { useState, useEffect } from 'react';
import { FaPlus, FaTrash, FaEye, FaEdit } from 'react-icons/fa';
import { PiFlagBanner } from 'react-icons/pi';
import bannerAPI from '../../api/banner';
import BannerPostForm from '../banner/BannerPostForm';
import { extractListItems } from '../../utils/apiResponseHelpers';
import { getStorageAssetUrl } from '../../utils/jobsHelpers';

const BannerManagement = ({ openCreateOnMount = false, onCreateOpened }) => {
  const [banners, setBanners] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [showForm, setShowForm] = useState(false);
  const [editingBanner, setEditingBanner] = useState(null);

  const loadBanners = async () => {
    try {
      setLoading(true);
      setError(null);
      const response = await bannerAPI.getMyBannerAds();
      setBanners(extractListItems(response));
    } catch (err) {
      setError('Failed to load banner ads');
      setBanners([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadBanners();
  }, []);

  useEffect(() => {
    if (openCreateOnMount) {
      setEditingBanner(null);
      setShowForm(true);
      onCreateOpened?.();
    }
  }, [openCreateOnMount, onCreateOpened]);

  const handleCreate = () => {
    setEditingBanner(null);
    setShowForm(true);
  };

  const handleEdit = (banner) => {
    setEditingBanner(banner);
    setShowForm(true);
  };

  const handleFormClose = () => {
    setShowForm(false);
    setEditingBanner(null);
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Are you sure you want to delete this banner?')) return;
    try {
      await bannerAPI.deleteBannerAd(id);
      setBanners((prev) => prev.filter((b) => b.id !== id));
    } catch (err) {
      setError('Failed to delete banner');
    }
  };

  const handleFormSuccess = async () => {
    handleFormClose();
    await loadBanners();
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center py-12">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-600" />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold text-gray-900">Banner Ads Management</h2>
        <button
          type="button"
          onClick={handleCreate}
          className="flex items-center px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700"
        >
          <FaPlus className="mr-2" />
          Create Banner
        </button>
      </div>

      {error && (
        <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg">{error}</div>
      )}

      <div className="bg-white rounded-lg shadow overflow-hidden">
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Banner</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Type</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Status</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Views</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Actions</th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {banners.length === 0 ? (
              <tr>
                <td colSpan="5" className="px-6 py-12 text-center text-gray-500">
                  <PiFlagBanner className="mx-auto h-12 w-12 text-gray-300 mb-4" />
                  No banner ads yet.
                </td>
              </tr>
            ) : (
              banners.map((banner) => {
                const imageUrl = getStorageAssetUrl(banner.banner_image) || banner.banner_image;
                return (
                  <tr key={banner.id} className="hover:bg-gray-50">
                    <td className="px-6 py-4">
                      <div className="flex items-center">
                        {imageUrl && (
                          <img src={imageUrl} alt="" className="h-10 w-16 rounded object-cover mr-3" />
                        )}
                        <div>
                          <div className="text-sm font-medium text-gray-900">{banner.title}</div>
                          <div className="text-xs text-gray-500">{banner.business_name}</div>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4 text-sm capitalize">{banner.banner_type || 'image'}</td>
                    <td className="px-6 py-4 text-sm capitalize">{banner.status}</td>
                    <td className="px-6 py-4 text-sm text-gray-500">{banner.views || 0}</td>
                    <td className="px-6 py-4">
                      <div className="flex space-x-2">
                        <a href={`/banners/${banner.slug || banner.id}`} target="_blank" rel="noopener noreferrer" className="text-blue-600">
                          <FaEye className="h-4 w-4" />
                        </a>
                        <button type="button" onClick={() => handleEdit(banner)} className="text-green-600" title="Edit">
                          <FaEdit className="h-4 w-4" />
                        </button>
                        <button type="button" onClick={() => handleDelete(banner.id)} className="text-red-600">
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

      {showForm && (
        <BannerPostForm
          onClose={handleFormClose}
          onSuccess={handleFormSuccess}
          editBanner={editingBanner}
        />
      )}
    </div>
  );
};

export default BannerManagement;
