import React, { useState, useEffect } from 'react';
import { FaPlus, FaEdit, FaTrash, FaBriefcase } from 'react-icons/fa';
import { servicesApi } from '../../services/servicesSolutionsApi';
import ServicesPostForm from '../Services/ServicesPostForm';
import { extractListItems, formatCityCountry } from '../../utils/apiResponseHelpers';
import DashboardListThumbnail from './DashboardListThumbnail';

const ServicesManagement = ({ openCreateOnMount = false, onCreateOpened }) => {
  const [services, setServices] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [showForm, setShowForm] = useState(false);
  const [editingService, setEditingService] = useState(null);

  const loadServices = async () => {
    try {
      setLoading(true);
      setError(null);
      const response = await servicesApi.getMyServices();
      setServices(extractListItems(response));
    } catch (err) {
      setError('Failed to load services');
      setServices([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadServices();
  }, []);

  useEffect(() => {
    if (openCreateOnMount) {
      setEditingService(null);
      setShowForm(true);
      onCreateOpened?.();
    }
  }, [openCreateOnMount]);

  const handleCreate = () => {
    setEditingService(null);
    setShowForm(true);
  };

  const handleEdit = async (service) => {
    try {
      const full = await servicesApi.getService(service.id);
      setEditingService(full?.data || full);
    } catch {
      setEditingService(service);
    }
    setShowForm(true);
  };

  const handleDelete = async (serviceId) => {
    if (!window.confirm('Are you sure you want to delete this service?')) return;
    try {
      await servicesApi.deleteService(serviceId);
      setServices((prev) => prev.filter((s) => s.id !== serviceId));
    } catch (err) {
      setError('Failed to delete service');
    }
  };

  const handleFormClose = () => {
    setShowForm(false);
    setEditingService(null);
  };

  const handleFormSuccess = async (createdOrUpdated) => {
    if (editingService?.id && createdOrUpdated) {
      setServices((prev) => prev.map((s) => (s.id === editingService.id ? { ...s, ...createdOrUpdated } : s)));
    }
    handleFormClose();
    await loadServices();
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
        <h2 className="text-2xl font-bold text-gray-900">Services Management</h2>
        <button
          type="button"
          onClick={handleCreate}
          className="flex items-center px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
        >
          <FaPlus className="mr-2" />
          Create Service
        </button>
      </div>

      {error && (
        <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg">{error}</div>
      )}

      <div className="bg-white rounded-lg shadow overflow-hidden">
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Image</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Title</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Category</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Location</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Price</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Status</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Actions</th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {services.length === 0 ? (
              <tr>
                <td colSpan="7" className="px-6 py-12 text-center text-gray-500">
                  <FaBriefcase className="h-12 w-12 mx-auto mb-4 text-gray-300" />
                  No services found. Create your first service to get started.
                </td>
              </tr>
            ) : (
              services.map((service) => (
                <tr key={service.id} className="hover:bg-gray-50">
                  <td className="px-6 py-4">
                    <DashboardListThumbnail item={service} fallback={FaBriefcase} />
                  </td>
                  <td className="px-6 py-4 text-sm font-medium text-gray-900">{service.title}</td>
                  <td className="px-6 py-4 text-sm text-gray-900">
                    {service.category?.name || service.category_name || '—'}
                  </td>
                  <td className="px-6 py-4 text-sm text-gray-900">
                    {formatCityCountry(service.city, service.country) || '—'}
                  </td>
                  <td className="px-6 py-4 text-sm text-gray-900">
                    {service.currency || 'USD'} {service.starting_price ?? service.price ?? '—'}
                  </td>
                  <td className="px-6 py-4">
                    <span className={`px-2 text-xs font-semibold rounded-full ${
                      service.status === 'active' ? 'bg-green-100 text-green-800' : 'bg-gray-100 text-gray-800'
                    }`}>
                      {service.status || 'draft'}
                    </span>
                  </td>
                  <td className="px-6 py-4 text-sm font-medium">
                    <div className="flex space-x-2">
                      <button type="button" onClick={() => handleEdit(service)} className="text-blue-600 hover:text-blue-900">
                        <FaEdit className="h-5 w-5" />
                      </button>
                      <button type="button" onClick={() => handleDelete(service.id)} className="text-red-600 hover:text-red-900">
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

      {showForm && (
        <ServicesPostForm
          onClose={handleFormClose}
          onSubmit={handleFormSuccess}
          initialService={editingService}
          serviceId={editingService?.id}
        />
      )}
    </div>
  );
};

export default ServicesManagement;
