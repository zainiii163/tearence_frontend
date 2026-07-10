import React, { useState, useEffect } from 'react';
import { FaPlus, FaEdit, FaTrash, FaCar } from 'react-icons/fa';
import { getMyVehicles, deleteVehicle } from '../../services/vehiclesAPI';
import VehiclePostForm from '../vehicles/VehiclePostForm';
import { extractListItems, formatCityCountry } from '../../utils/apiResponseHelpers';
import { getStorageAssetUrl } from '../../utils/jobsHelpers';

const VehiclesManagement = ({ openCreateOnMount = false, onCreateOpened }) => {
  const [vehicles, setVehicles] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [showForm, setShowForm] = useState(false);
  const [editingVehicle, setEditingVehicle] = useState(null);

  const loadVehicles = async () => {
    try {
      setLoading(true);
      setError(null);
      const response = await getMyVehicles();
      setVehicles(extractListItems(response));
    } catch (err) {
      setError('Failed to load vehicles');
      setVehicles([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadVehicles();
  }, []);

  useEffect(() => {
    if (openCreateOnMount) {
      setEditingVehicle(null);
      setShowForm(true);
      onCreateOpened?.();
    }
  }, [openCreateOnMount, onCreateOpened]);

  const handleCreate = () => {
    setEditingVehicle(null);
    setShowForm(true);
  };

  const handleEdit = (vehicle) => {
    setEditingVehicle(vehicle);
    setShowForm(true);
  };

  const handleFormClose = () => {
    setShowForm(false);
    setEditingVehicle(null);
  };

  const handleDelete = async (vehicleId) => {
    if (!window.confirm('Are you sure you want to delete this vehicle?')) return;
    try {
      await deleteVehicle(vehicleId);
      setVehicles((prev) => prev.filter((v) => v.id !== vehicleId));
    } catch (err) {
      setError('Failed to delete vehicle');
    }
  };

  const handleFormSuccess = async () => {
    handleFormClose();
    await loadVehicles();
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
        <h2 className="text-2xl font-bold text-gray-900">Vehicles Management</h2>
        <button
          type="button"
          onClick={handleCreate}
          className="flex items-center px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
        >
          <FaPlus className="mr-2" />
          Post Vehicle
        </button>
      </div>

      {error && (
        <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg">{error}</div>
      )}

      {vehicles.length === 0 ? (
        <div className="bg-white rounded-lg shadow p-12 text-center text-gray-500">
          <FaCar className="h-12 w-12 mx-auto mb-4 text-gray-300" />
          No vehicles found. Post your first vehicle to get started.
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {vehicles.map((vehicle) => {
            const imageUrl = getStorageAssetUrl(vehicle.main_image) || vehicle.main_image;
            return (
              <div key={vehicle.id} className="bg-white border border-gray-200 rounded-lg overflow-hidden hover:shadow-lg">
                {imageUrl && (
                  <img src={imageUrl} alt={vehicle.title} className="w-full h-48 object-cover" />
                )}
                <div className="p-4">
                  <h3 className="font-semibold text-gray-900">{vehicle.title}</h3>
                  <p className="text-sm text-gray-600">
                    {[vehicle.make?.name || vehicle.make, vehicle.model?.name || vehicle.model, vehicle.year].filter(Boolean).join(' ')}
                  </p>
                  <p className="text-lg font-bold text-blue-600 mt-1">
                    {vehicle.currency || 'USD'} {vehicle.price?.toLocaleString?.() ?? vehicle.price}
                  </p>
                  <p className="text-sm text-gray-500">{formatCityCountry(vehicle.city, vehicle.country)}</p>
                  <div className="flex justify-between items-center mt-4">
                    <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                      vehicle.status === 'active' ? 'bg-green-100 text-green-800' : 'bg-gray-100 text-gray-800'
                    }`}>
                      {vehicle.status || 'draft'}
                    </span>
                    <div className="flex space-x-2">
                      <button
                        type="button"
                        onClick={() => handleEdit(vehicle)}
                        className="p-2 text-blue-600 hover:bg-blue-50 rounded"
                        title="Edit"
                      >
                        <FaEdit className="h-4 w-4" />
                      </button>
                      <button type="button" onClick={() => handleDelete(vehicle.id)} className="p-2 text-red-600 hover:bg-red-50 rounded">
                        <FaTrash className="h-4 w-4" />
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}

      {showForm && (
        <VehiclePostForm
          onClose={handleFormClose}
          onSuccess={handleFormSuccess}
          editVehicle={editingVehicle}
        />
      )}
    </div>
  );
};

export default VehiclesManagement;
