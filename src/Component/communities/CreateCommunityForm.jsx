import React, { useState, useEffect } from 'react';
import { FaTimes, FaUsers, FaTag, FaImage, FaLock } from 'react-icons/fa';
import { communitiesAPI } from '../../api/communities';
import { useAuth } from '../../context/AuthContext';

const CreateCommunityForm = ({ isOpen, onClose, onSuccess, community = null }) => {
  const { user } = useAuth();
  const [formData, setFormData] = useState({
    name: '',
    description: '',
    category_id: '',
    location: '',
    is_private: false,
    rules: '',
    cover_image: null,
  });
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState({});

  useEffect(() => {
    if (isOpen) {
      loadCategories();
    }
  }, [isOpen]);

  const loadCategories = async () => {
    try {
      const response = await communitiesAPI.getCommunitiesByCategory('all');
      setCategories(response.data || []);
    } catch (error) {
      console.error('Error loading categories:', error);
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setFormData(prev => ({
        ...prev,
        cover_image: file
      }));
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setErrors({});

    try {
      const submitData = new FormData();
      Object.keys(formData).forEach(key => {
        if (key !== 'cover_image') {
          submitData.append(key, formData[key]);
        }
      });

      if (formData.cover_image) {
        submitData.append('cover_image', formData.cover_image);
      }

      const response = await communitiesAPI.createCommunity(submitData);
      
      if (response.success) {
        onSuccess?.(response.data);
        onClose();
        setFormData({
          name: '',
          description: '',
          category_id: '',
          location: '',
          is_private: false,
          rules: '',
          cover_image: null,
        });
      } else {
        setErrors(response.errors || { general: 'Failed to create community' });
      }
    } catch (error) {
      setErrors({ general: error.message || 'Failed to create community' });
    } finally {
      setLoading(false);
    }
  };

  const handleUpdate = async (e) => {
    e.preventDefault();
    setLoading(true);
    setErrors({});

    try {
      const submitData = new FormData();
      Object.keys(formData).forEach(key => {
        if (key !== 'cover_image') {
          submitData.append(key, formData[key]);
        }
      });

      if (formData.cover_image) {
        submitData.append('cover_image', formData.cover_image);
      }

      const response = await communitiesAPI.updateCommunity(community.id, submitData);
      
      if (response.success) {
        onSuccess?.(response.data);
        onClose();
      } else {
        setErrors(response.errors || { general: 'Failed to update community' });
      }
    } catch (error) {
      setErrors({ general: error.message || 'Failed to update community' });
    } finally {
      setLoading(false);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg shadow-xl max-w-2xl w-full mx-4 max-h-[90vh] overflow-y-auto">
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b">
          <h2 className="text-xl font-semibold text-gray-900">
            {community ? 'Edit Community' : 'Create Community'}
          </h2>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-gray-600 transition-colors"
          >
            <FaTimes className="h-6 w-6" />
          </button>
        </div>

        {/* Form */}
        <form onSubmit={community ? handleUpdate : handleSubmit} className="p-6 space-y-6">
          {/* Basic Information */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Community Name *
              </label>
              <input
                type="text"
                name="name"
                value={formData.name}
                onChange={handleChange}
                required
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                placeholder="Enter community name"
              />
              {errors.name && (
                <p className="text-red-500 text-sm mt-1">{errors.name}</p>
              )}
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Category *
              </label>
              <select
                name="category_id"
                value={formData.category_id}
                onChange={handleChange}
                required
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              >
                <option value="">Select a category</option>
                {categories.map(cat => (
                  <option key={cat.id} value={cat.id}>
                    {cat.name}
                  </option>
                ))}
              </select>
              {errors.category_id && (
                <p className="text-red-500 text-sm mt-1">{errors.category_id}</p>
              )}
            </div>
          </div>

          {/* Description */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Description *
            </label>
            <textarea
              name="description"
              value={formData.description}
              onChange={handleChange}
              required
              rows={4}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              placeholder="Describe your community's purpose and guidelines"
            />
            {errors.description && (
              <p className="text-red-500 text-sm mt-1">{errors.description}</p>
              )}
          </div>

          {/* Location */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Location
              </label>
              <input
                type="text"
                name="location"
                value={formData.location}
                onChange={handleChange}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                placeholder="City, Country or Virtual"
              />
              {errors.location && (
                <p className="text-red-500 text-sm mt-1">{errors.location}</p>
              )}
            </div>

            <div>
              <label className="flex items-center">
                <input
                  type="checkbox"
                  name="is_private"
                  checked={formData.is_private}
                  onChange={(e) => handleChange({ target: { name: 'is_private', value: e.target.checked } })}
                  className="mr-2"
                />
                <span className="text-sm font-medium text-gray-700">Private Community</span>
              </label>
            </div>
          </div>

          {/* Cover Image */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              <FaImage className="inline mr-2" />
              Cover Image
            </label>
            <div className="mt-2 flex items-center space-x-4">
              <input
                type="file"
                accept="image/*"
                onChange={handleImageChange}
                className="hidden"
                id="cover-image-input"
              />
              <label
                htmlFor="cover-image-input"
                className="flex-1 cursor-pointer bg-white border-2 border-dashed border-gray-300 rounded-md px-4 py-6 text-center hover:border-gray-400 transition-colors"
              >
                {formData.cover_image ? (
                  <div className="space-y-2">
                    <img
                      src={URL.createObjectURL(formData.cover_image)}
                      alt="Cover preview"
                      className="mx-auto h-32 w-32 object-cover rounded-md"
                    />
                    <p className="text-sm text-gray-600">{formData.cover_image.name}</p>
                  </div>
                ) : (
                  <div className="space-y-2">
                    <FaImage className="mx-auto h-12 w-12 text-gray-400" />
                    <p className="text-sm text-gray-600">Click to upload cover image</p>
                    <p className="text-xs text-gray-500">JPEG, PNG, GIF up to 2MB</p>
                  </div>
                )}
              </label>
            </div>
          </div>

          {/* Rules */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              <FaLock className="inline mr-2" />
              Community Rules & Guidelines
            </label>
            <textarea
              name="rules"
              value={formData.rules}
              onChange={handleChange}
              rows={3}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              placeholder="Set clear rules and guidelines for community members"
            />
            {errors.rules && (
              <p className="text-red-500 text-sm mt-1">{errors.rules}</p>
              )}
          </div>

          {/* Tags */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              <FaTag className="inline mr-2" />
              Tags
            </label>
            <input
              type="text"
              name="tags"
              value={formData.tags}
              onChange={handleChange}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              placeholder="business, technology, marketing, etc."
            />
            <p className="text-xs text-gray-500 mt-1">Separate tags with commas</p>
          </div>

          {/* Form Actions */}
          <div className="flex justify-end space-x-4 pt-6">
            <button
              type="button"
              onClick={onClose}
              className="px-6 py-2 border border-gray-300 rounded-md text-gray-700 hover:bg-gray-50 transition-colors"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={loading}
              className="px-6 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {loading ? 'Creating...' : (community ? 'Update Community' : 'Create Community')}
            </button>
          </div>

          {errors.general && (
            <div className="mt-4 p-4 bg-red-50 border border-red-200 rounded-md">
              <p className="text-red-700">{errors.general}</p>
            </div>
          )}
        </form>
      </div>
    </div>
  );
};

export default CreateCommunityForm;
