import React, { useState, useEffect } from 'react';
import { FaTimes, FaCalendar, FaMapMarkerAlt, FaTag, FaImage, FaLink, FaClock, FaUsers, FaGlobe, FaVideo } from 'react-icons/fa';
import { eventsAPI } from '../../api/events';
import { useAuth } from '../../context/AuthContext';

const CreateEventForm = ({ isOpen, onClose, onSuccess, event = null }) => {
  const { user } = useAuth();
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    category_id: '',
    start_date: '',
    end_date: '',
    location: '',
    max_attendees: '',
    is_virtual: false,
    meeting_link: '',
    cover_image: null,
    tags: '',
  });
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState({});

  useEffect(() => {
    if (isOpen) {
      loadCategories();
      if (event) {
        setFormData({
          title: event.title || '',
          description: event.description || '',
          category_id: event.category_id || '',
          start_date: event.start_date ? new Date(event.start_date).toISOString().slice(0, 16) : '',
          end_date: event.end_date ? new Date(event.end_date).toISOString().slice(0, 16) : '',
          location: event.location || '',
          max_attendees: event.max_attendees || '',
          is_virtual: event.is_virtual || false,
          meeting_link: event.meeting_link || '',
          cover_image: null,
          tags: event.tags ? event.tags.join(', ') : '',
        });
      }
    }
  }, [isOpen, event]);

  const loadCategories = async () => {
    try {
      const response = await eventsAPI.getCategories();
      const list = response?.data || [];
      setCategories(Array.isArray(list) ? list : []);
    } catch (error) {
      console.error('Error loading categories:', error);
      setCategories([]);
    }
  };

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value
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

      const response = await eventsAPI.createEvent(submitData);
      
      if (response.success) {
        onSuccess?.(response.data);
        onClose();
        setFormData({
          title: '',
          description: '',
          category_id: '',
          start_date: '',
          end_date: '',
          location: '',
          max_attendees: '',
          is_virtual: false,
          meeting_link: '',
          cover_image: null,
          tags: '',
        });
      } else {
        setErrors(response.errors || { general: 'Failed to create event' });
      }
    } catch (error) {
      const apiErrors = error?.response?.data?.errors;
      setErrors(
        apiErrors || {
          general:
            error?.response?.data?.message ||
            error.message ||
            'Failed to create event',
        }
      );
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

      const response = await eventsAPI.updateEvent(event.id, submitData);
      
      if (response.success) {
        onSuccess?.(response.data);
        onClose();
      } else {
        setErrors(response.errors || { general: 'Failed to update event' });
      }
    } catch (error) {
      setErrors({ general: error.message || 'Failed to update event' });
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
            {event ? 'Edit Event' : 'Create Event'}
          </h2>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-gray-600 transition-colors"
          >
            <FaTimes className="h-6 w-6" />
          </button>
        </div>

        {/* Form */}
        <form onSubmit={event ? handleUpdate : handleSubmit} className="p-6 space-y-6">
          {/* Basic Information */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Event Title *
              </label>
              <input
                type="text"
                name="title"
                value={formData.title}
                onChange={handleChange}
                required
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                placeholder="Enter event title"
              />
              {errors.title && (
                <p className="text-red-500 text-sm mt-1">{errors.title}</p>
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
                {categories.map((cat) => {
                  const id = cat.category_id ?? cat.id;
                  return (
                    <option key={id} value={id}>
                      {cat.name || cat.label || id}
                    </option>
                  );
                })}
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
              placeholder="Describe your event in detail"
            />
            {errors.description && (
              <p className="text-red-500 text-sm mt-1">{errors.description}</p>
              )}
          </div>

          {/* Date and Time */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                <FaClock className="inline mr-2" />
                Start Date & Time *
              </label>
              <input
                type="datetime-local"
                name="start_date"
                value={formData.start_date}
                onChange={handleChange}
                required
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              />
              {errors.start_date && (
                <p className="text-red-500 text-sm mt-1">{errors.start_date}</p>
              )}
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                <FaClock className="inline mr-2" />
                End Date & Time *
              </label>
              <input
                type="datetime-local"
                name="end_date"
                value={formData.end_date}
                onChange={handleChange}
                required
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              />
              {errors.end_date && (
                <p className="text-red-500 text-sm mt-1">{errors.end_date}</p>
              )}
            </div>
          </div>

          {/* Location and Virtual Settings */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                <FaMapMarkerAlt className="inline mr-2" />
                Location *
              </label>
              <input
                type="text"
                name="location"
                value={formData.location}
                onChange={handleChange}
                required={!formData.is_virtual}
                disabled={formData.is_virtual}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500 disabled:bg-gray-100"
                placeholder="Event venue or address"
              />
              {errors.location && (
                <p className="text-red-500 text-sm mt-1">{errors.location}</p>
              )}
            </div>

            <div>
              <label className="flex items-center mb-4">
                <input
                  type="checkbox"
                  name="is_virtual"
                  checked={formData.is_virtual}
                  onChange={handleChange}
                  className="mr-2"
                />
                <span className="text-sm font-medium text-gray-700">
                  <FaVideo className="inline mr-2" />
                  Virtual Event
                </span>
              </label>
              
              {formData.is_virtual && (
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    <FaLink className="inline mr-2" />
                    Meeting Link
                  </label>
                  <input
                    type="url"
                    name="meeting_link"
                    value={formData.meeting_link}
                    onChange={handleChange}
                    required={formData.is_virtual}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    placeholder="https://zoom.us/meeting/..."
                  />
                  {errors.meeting_link && (
                    <p className="text-red-500 text-sm mt-1">{errors.meeting_link}</p>
                  )}
                </div>
              )}
            </div>
          </div>

          {/* Max Attendees */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              <FaUsers className="inline mr-2" />
              Maximum Attendees
            </label>
            <input
              type="number"
              name="max_attendees"
              value={formData.max_attendees}
              onChange={handleChange}
              min="1"
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              placeholder="Leave blank for unlimited"
            />
            {errors.max_attendees && (
              <p className="text-red-500 text-sm mt-1">{errors.max_attendees}</p>
            )}
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
                accept="image/*,video/mp4,video/webm,video/quicktime"
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
              placeholder="business, technology, networking, etc."
            />
            <p className="text-xs text-gray-500 mt-1">Separate tags with commas</p>
            {errors.tags && (
              <p className="text-red-500 text-sm mt-1">{errors.tags}</p>
            )}
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
              {loading ? 'Saving...' : (event ? 'Update Event' : 'Create Event')}
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

export default CreateEventForm;
