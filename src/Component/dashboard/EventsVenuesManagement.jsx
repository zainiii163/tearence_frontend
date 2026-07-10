import React, { useState, useEffect } from 'react';
import { FaPlus, FaEdit, FaTrash, FaEye, FaCalendar, FaBuilding } from 'react-icons/fa';
import eventsVenuesAPI from '../../services/eventsVenuesAPI';
import EventsVenuesPostForm from '../events-venues/EventsVenuesPostForm';
import { extractListItems, formatCityCountry } from '../../utils/apiResponseHelpers';
import DashboardListThumbnail from './DashboardListThumbnail';

const EventsVenuesManagement = ({ openCreateOnMount = false, onCreateOpened }) => {
  const [eventsVenues, setEventsVenues] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [showForm, setShowForm] = useState(false);
  const [formType, setFormType] = useState('event');
  const [editingItem, setEditingItem] = useState(null);

  const loadEventsVenues = async () => {
    try {
      setLoading(true);
      setError(null);
      const response = await eventsVenuesAPI.getMyAdverts();
      setEventsVenues(extractListItems(response));
    } catch (err) {
      setError('Failed to load events and venues');
      setEventsVenues([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadEventsVenues();
  }, []);

  useEffect(() => {
    if (openCreateOnMount) {
      setEditingItem(null);
      setFormType('event');
      setShowForm(true);
      onCreateOpened?.();
    }
  }, [openCreateOnMount]);

  const openCreate = (type) => {
    setEditingItem(null);
    setFormType(type);
    setShowForm(true);
  };

  const openEdit = (item) => {
    setEditingItem(item);
    setFormType(item.advert_type || 'event');
    setShowForm(true);
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Are you sure you want to delete this event/venue?')) return;
    try {
      await eventsVenuesAPI.deleteAdvert(id);
      setEventsVenues((prev) => prev.filter((ev) => ev.id !== id));
    } catch (err) {
      setError('Failed to delete event/venue');
    }
  };

  const handleFormClose = () => {
    setShowForm(false);
    setEditingItem(null);
  };

  const handleFormSuccess = async () => {
    handleFormClose();
    await loadEventsVenues();
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
        <h2 className="text-2xl font-bold text-gray-900">Events &amp; Venues Management</h2>
        <div className="flex gap-3">
          <button type="button" onClick={() => openCreate('event')} className="flex items-center px-4 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700">
            <FaCalendar className="mr-2" />
            Post Event
          </button>
          <button type="button" onClick={() => openCreate('venue')} className="flex items-center px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700">
            <FaBuilding className="mr-2" />
            Post Venue
          </button>
        </div>
      </div>

      {error && (
        <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg">{error}</div>
      )}

      <div className="bg-white rounded-lg shadow overflow-hidden">
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Image</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Type</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Title</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Location</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Status</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Actions</th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {eventsVenues.length === 0 ? (
              <tr>
                <td colSpan="6" className="px-6 py-12 text-center text-gray-500">
                  <FaCalendar className="h-12 w-12 mx-auto mb-4 text-gray-300" />
                  No events or venues found.
                </td>
              </tr>
            ) : (
              eventsVenues.map((item) => (
                <tr key={item.id} className="hover:bg-gray-50">
                  <td className="px-6 py-4">
                    <DashboardListThumbnail item={item} fallback={FaCalendar} />
                  </td>
                  <td className="px-6 py-4 text-sm capitalize">{item.advert_type}</td>
                  <td className="px-6 py-4 text-sm font-medium text-gray-900">{item.title}</td>
                  <td className="px-6 py-4 text-sm text-gray-500">{formatCityCountry(item.city, item.country)}</td>
                  <td className="px-6 py-4 text-sm capitalize">{item.status}</td>
                  <td className="px-6 py-4">
                    <div className="flex space-x-2">
                      <a href={`/events-venues/${item.slug}`} target="_blank" rel="noopener noreferrer" className="text-blue-600">
                        <FaEye className="h-5 w-5" />
                      </a>
                      <button type="button" onClick={() => openEdit(item)} className="text-green-600">
                        <FaEdit className="h-5 w-5" />
                      </button>
                      <button type="button" onClick={() => handleDelete(item.id)} className="text-red-600">
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
        <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center p-4">
          <div className="w-full max-w-4xl max-h-[90vh] overflow-hidden">
            <EventsVenuesPostForm
              embedded
              defaultType={formType}
              editAdvert={editingItem}
              onClose={handleFormClose}
              onSuccess={handleFormSuccess}
            />
          </div>
        </div>
      )}
    </div>
  );
};

export default EventsVenuesManagement;
