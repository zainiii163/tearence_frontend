import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { FaPlus, FaTrash, FaEye, FaHome, FaEdit } from 'react-icons/fa';
import propertyApi from '../../services/propertyApi';
import PropertyPostForm from '../property/PropertyPostForm';
import { extractListItems, formatCityCountry } from '../../utils/apiResponseHelpers';
import DashboardListThumbnail from './DashboardListThumbnail';

const PropertiesManagement = ({ openCreateOnMount = false, onCreateOpened }) => {
  const [properties, setProperties] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [showForm, setShowForm] = useState(false);
  const [editingProperty, setEditingProperty] = useState(null);

  const loadProperties = async () => {
    try {
      setLoading(true);
      setError(null);
      const response = await propertyApi.getMyProperties();
      const list = response?.data ?? extractListItems(response);
      setProperties(Array.isArray(list) ? list : []);
    } catch (err) {
      setError('Failed to load properties');
      setProperties([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadProperties();
  }, []);

  useEffect(() => {
    if (openCreateOnMount) {
      setEditingProperty(null);
      setShowForm(true);
      onCreateOpened?.();
    }
  }, [openCreateOnMount, onCreateOpened]);

  const handleCreate = () => {
    setEditingProperty(null);
    setShowForm(true);
  };

  const handleEdit = (property) => {
    setEditingProperty(property);
    setShowForm(true);
  };

  const handleFormClose = () => {
    setShowForm(false);
    setEditingProperty(null);
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Are you sure you want to delete this property?')) return;
    try {
      await propertyApi.deleteProperty(id);
      await loadProperties();
    } catch (err) {
      setError('Failed to delete property');
    }
  };

  const handleFormSubmit = async () => {
    handleFormClose();
    await loadProperties();
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
        <h2 className="text-2xl font-bold text-gray-900">My Properties</h2>
        <button
          type="button"
          onClick={handleCreate}
          className="flex items-center px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
        >
          <FaPlus className="mr-2" />
          Post Property
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
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Image</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Title</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Type</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Location</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Price</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Status</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Actions</th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {properties.length === 0 ? (
                <tr>
                  <td colSpan="7" className="px-6 py-12 text-center text-gray-500">
                    <FaHome className="h-12 w-12 mx-auto mb-4 text-gray-300" />
                    No properties posted yet. Post your first property to get started.
                  </td>
                </tr>
              ) : (
                properties.map((property) => (
                  <tr key={property.id} className="hover:bg-gray-50">
                    <td className="px-6 py-4">
                      <DashboardListThumbnail item={property} fallback={FaHome} className="h-12 w-12" />
                    </td>
                    <td className="px-6 py-4 text-sm font-medium text-gray-900">{property.title}</td>
                    <td className="px-6 py-4 text-sm text-gray-500">{property.property_type || property.category || '—'}</td>
                    <td className="px-6 py-4 text-sm text-gray-500">
                      {formatCityCountry(property.city, property.country) || '—'}
                    </td>
                    <td className="px-6 py-4 text-sm text-gray-900">
                      {property.currency || 'USD'} {property.price ?? '—'}
                    </td>
                    <td className="px-6 py-4">
                      <span className={`px-2 text-xs font-semibold rounded-full ${
                        property.status === 'active' || property.active ? 'bg-green-100 text-green-800' : 'bg-gray-100 text-gray-800'
                      }`}>
                        {property.status || (property.active ? 'active' : 'inactive')}
                      </span>
                    </td>
                    <td className="px-6 py-4 text-sm font-medium">
                      <div className="flex space-x-2">
                        <Link to={`/property/${property.id}`} className="text-gray-600 hover:text-gray-900" title="View">
                          <FaEye className="h-5 w-5" />
                        </Link>
                        <button
                          type="button"
                          onClick={() => handleEdit(property)}
                          className="text-blue-600 hover:text-blue-900"
                          title="Edit"
                        >
                          <FaEdit className="h-5 w-5" />
                        </button>
                        <button
                          type="button"
                          onClick={() => handleDelete(property.id)}
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
        <PropertyPostForm
          onClose={handleFormClose}
          onSubmit={handleFormSubmit}
          editProperty={editingProperty}
        />
      )}
    </div>
  );
};

export default PropertiesManagement;
