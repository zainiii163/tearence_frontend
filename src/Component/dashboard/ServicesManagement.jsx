import React, { useState, useEffect, useCallback, useMemo } from 'react';
import { Link } from 'react-router-dom';
import { FaPlus, FaEdit, FaTrash, FaBriefcase } from 'react-icons/fa';
import { servicesApi } from '../../services/servicesSolutionsApi';
import ServicesPostForm from '../Services/ServicesPostForm';
import { extractListItems, formatCityCountry } from '../../utils/apiResponseHelpers';
import DashboardListThumbnail from './DashboardListThumbnail';
import { ListingStatusFilterBar, ListingStatusCell, filterListingsByLifecycle } from './ListingStatusControls';

const money = (n) => `$${Number(n || 0).toLocaleString()}`;

const ServicesManagement = ({ openCreateOnMount = false, onCreateOpened }) => {
  const [subTab, setSubTab] = useState('listings');
  const [services, setServices] = useState([]);
  const [buyerOrders, setBuyerOrders] = useState([]);
  const [sellerOrders, setSellerOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [filterStatus, setFilterStatus] = useState('all');
  const [showForm, setShowForm] = useState(false);
  const [editingService, setEditingService] = useState(null);

  const loadAll = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);
      const [mine, bought, sold] = await Promise.all([
        servicesApi.getMyServices().catch(() => null),
        servicesApi.getBuyerOrders({ per_page: 40 }).catch(() => null),
        servicesApi.getSellerOrders({ per_page: 40 }).catch(() => null),
      ]);
      setServices(extractListItems(mine));
      setBuyerOrders(extractListItems(bought));
      setSellerOrders(extractListItems(sold));
    } catch (err) {
      setError('Failed to load services');
      setServices([]);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    loadAll();
  }, [loadAll]);

  useEffect(() => {
    if (openCreateOnMount) {
      setEditingService(null);
      setShowForm(true);
      setSubTab('listings');
      onCreateOpened?.();
    }
  }, [openCreateOnMount, onCreateOpened]);

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

  const handleFormSuccess = async () => {
    handleFormClose();
    await loadAll();
  };

  const filteredServices = useMemo(
    () => filterListingsByLifecycle(services, filterStatus),
    [services, filterStatus]
  );

  if (loading) {
    return (
      <div className="flex justify-center items-center py-12">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600" />
      </div>
    );
  }

  const tabs = [
    { id: 'listings', label: `My listings (${services.length})` },
    { id: 'orders-placed', label: `Orders I placed (${buyerOrders.length})` },
    { id: 'orders-received', label: `Orders received (${sellerOrders.length})` },
  ];

  return (
    <div className="space-y-6">
      <div className="flex flex-wrap justify-between items-center gap-3">
        <h2 className="text-2xl font-bold text-gray-900">Services</h2>
        <button
          type="button"
          onClick={handleCreate}
          className="flex items-center px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
        >
          <FaPlus className="mr-2" />
          Create Service
        </button>
      </div>

      <div className="inline-flex rounded-lg border border-gray-200 p-1 bg-gray-50">
        {tabs.map((t) => (
          <button
            key={t.id}
            type="button"
            onClick={() => setSubTab(t.id)}
            className={`px-3 py-1.5 text-sm font-semibold rounded-md ${
              subTab === t.id ? 'bg-white shadow text-gray-900' : 'text-gray-600'
            }`}
          >
            {t.label}
          </button>
        ))}
      </div>

      {error && (
        <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg">{error}</div>
      )}

      {subTab === 'listings' && (
        <>
          <ListingStatusFilterBar
            value={filterStatus}
            onChange={setFilterStatus}
            items={services}
            id="services-status-filter"
          />
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
                {filteredServices.length === 0 ? (
                  <tr>
                    <td colSpan="7" className="px-6 py-12 text-center text-gray-500">
                      <FaBriefcase className="h-12 w-12 mx-auto mb-4 text-gray-300" />
                      {services.length === 0
                        ? 'No services found. Create your first service to get started.'
                        : 'No services match this status filter.'}
                    </td>
                  </tr>
                ) : (
                  filteredServices.map((service) => (
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
                        <ListingStatusCell item={service} upsellType="services" onPaid={loadAll} />
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
        </>
      )}

      {subTab === 'orders-placed' && (
        <OrdersTable
          empty="No service orders placed yet."
          rows={buyerOrders}
          linkBase="/services"
        />
      )}

      {subTab === 'orders-received' && (
        <OrdersTable
          empty="No incoming orders yet."
          rows={sellerOrders}
          linkBase="/services"
          sellerView
        />
      )}

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

const OrdersTable = ({ rows, empty, linkBase, sellerView = false }) => (
  <div className="bg-white rounded-lg shadow overflow-hidden">
    {rows.length === 0 ? (
      <p className="px-6 py-10 text-center text-sm text-gray-500">{empty}</p>
    ) : (
      <ul className="divide-y divide-gray-100">
        {rows.map((order) => (
          <li key={order.id} className="px-4 py-3 flex items-center justify-between gap-3">
            <div className="min-w-0">
              <p className="font-medium text-gray-900 truncate">
                {order.service?.title || `Order #${order.id}`}
              </p>
              <p className="text-xs text-gray-500 mt-0.5">
                {order.payment_status || 'unpaid'} · {order.status || 'pending'}
                {sellerView && order.buyer?.name ? ` · Buyer: ${order.buyer.name}` : ''}
              </p>
            </div>
            <div className="flex items-center gap-3 shrink-0">
              <span className="text-sm font-bold">{money(order.total_price)}</span>
              {order.service_id && (
                <Link to={`${linkBase}/${order.service_id}`} className="text-xs font-semibold text-blue-700 hover:underline">
                  View
                </Link>
              )}
            </div>
          </li>
        ))}
      </ul>
    )}
  </div>
);

export default ServicesManagement;
