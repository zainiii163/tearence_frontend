import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { FaPlus, FaTrash, FaEye, FaHome, FaEdit, FaEnvelope, FaStar } from 'react-icons/fa';
import toast from 'react-hot-toast';
import propertyApi from '../../services/propertyApi';
import PropertyPostForm from '../property/PropertyPostForm';
import { extractListItems, formatCityCountry } from '../../utils/apiResponseHelpers';
import DashboardListThumbnail from './DashboardListThumbnail';
import usePromoPricingPlans from '../../hooks/usePromoPricingPlans';
import AuthenticCheckoutModal from '../Payment/AuthenticCheckoutModal';

const PropertiesManagement = ({ openCreateOnMount = false, onCreateOpened, onPropertiesChange }) => {
  const [properties, setProperties] = useState([]);
  const [enquiries, setEnquiries] = useState([]);
  const [loading, setLoading] = useState(true);
  const [loadingEnquiries, setLoadingEnquiries] = useState(true);
  const [error, setError] = useState(null);
  const [showForm, setShowForm] = useState(false);
  const [editingProperty, setEditingProperty] = useState(null);
  const [checkout, setCheckout] = useState(null);
  const [confirmingPayment, setConfirmingPayment] = useState(false);
  const { plans: promoPlans } = usePromoPricingPlans('property');

  const loadProperties = async () => {
    try {
      setLoading(true);
      setError(null);
      const response = await propertyApi.getMyProperties();
      const list = extractListItems(response);
      setProperties(list);
      onPropertiesChange?.(list);
    } catch (err) {
      setError('Failed to load properties');
      setProperties([]);
      onPropertiesChange?.([]);
    } finally {
      setLoading(false);
    }
  };

  const loadEnquiries = async () => {
    try {
      setLoadingEnquiries(true);
      const response = await propertyApi.getMyEnquiries();
      const list = extractListItems(response);
      setEnquiries(Array.isArray(list) ? list : []);
    } catch {
      setEnquiries([]);
    } finally {
      setLoadingEnquiries(false);
    }
  };

  useEffect(() => {
    loadProperties();
    loadEnquiries();
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
    toast.success(editingProperty ? 'Property updated' : 'Property posted successfully');
    handleFormClose();
    await loadProperties();
  };

  const startPromote = async (property) => {
    const featuredPlan =
      (promoPlans || []).find((p) => p.tier === 'featured' || p.slug === 'featured' || p.id === 'featured') ||
      (promoPlans || []).find((p) => Number(p.price_usd || p.price) > 0) ||
      null;
    const upsellType = featuredPlan?.tier || featuredPlan?.slug || 'featured';
    const price = Number(featuredPlan?.price_usd ?? featuredPlan?.price ?? 79) || 79;

    try {
      const upsellRes = await propertyApi.createUpsell({
        property_id: property.id,
        upsell_type: upsellType,
        duration_days: 30,
        price,
        currency: 'USD',
      });
      const upsell = upsellRes?.upsell?.data || upsellRes?.upsell || upsellRes?.data;
      const upsellId = upsell?.id;
      const amount = Number(upsellRes?.amount ?? upsell?.price ?? price) || price;
      if (!upsellId) {
        throw new Error('Could not create promotion');
      }
      setCheckout({
        propertyId: property.id,
        upsellId,
        amount,
        title: property.title,
        upsellType,
      });
    } catch (err) {
      toast.error(err?.message || 'Could not start promotion checkout');
    }
  };

  const handleCheckoutSuccess = async (payment) => {
    if (!checkout?.upsellId) return;
    setConfirmingPayment(true);
    try {
      await propertyApi.completeUpsellPayment(checkout.upsellId, payment);
      toast.success('Promotion activated');
      setCheckout(null);
      await loadProperties();
    } catch (err) {
      toast.error(err?.message || 'Payment captured but activation failed');
    } finally {
      setConfirmingPayment(false);
    }
  };

  const markRead = async (enquiry) => {
    if (enquiry.status === 'read') return;
    try {
      await propertyApi.markEnquiryRead(enquiry.id);
      setEnquiries((prev) =>
        prev.map((e) => (e.id === enquiry.id ? { ...e, status: 'read' } : e))
      );
    } catch {
      /* ignore */
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
                      {(property.is_featured || property.is_promoted || property.is_sponsored) && (
                        <span className="ml-1 px-2 text-xs font-semibold rounded-full bg-yellow-100 text-yellow-800">
                          {property.is_featured ? 'featured' : property.is_sponsored ? 'sponsored' : 'promoted'}
                        </span>
                      )}
                    </td>
                    <td className="px-6 py-4 text-sm font-medium">
                      <div className="flex space-x-2 items-center">
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
                        {!property.is_featured && !property.is_promoted && !property.is_sponsored && (
                          <button
                            type="button"
                            onClick={() => startPromote(property)}
                            className="text-amber-600 hover:text-amber-800"
                            title="Promote"
                          >
                            <FaStar className="h-5 w-5" />
                          </button>
                        )}
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

      <div className="bg-white rounded-lg shadow overflow-hidden">
        <div className="px-6 py-4 border-b border-gray-200 flex items-center gap-2">
          <FaEnvelope className="text-blue-600" />
          <h3 className="text-lg font-semibold text-gray-900">Inquiries</h3>
          {!loadingEnquiries && (
            <span className="text-sm text-gray-500">({enquiries.length})</span>
          )}
        </div>
        {loadingEnquiries ? (
          <div className="p-8 flex justify-center">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600" />
          </div>
        ) : enquiries.length === 0 ? (
          <p className="px-6 py-10 text-center text-gray-500 text-sm">
            No buyer enquiries yet. They will appear here when someone contacts you from a property page.
          </p>
        ) : (
          <ul className="divide-y divide-gray-100">
            {enquiries.map((enquiry) => (
              <li
                key={enquiry.id}
                className={`px-6 py-4 hover:bg-gray-50 cursor-pointer ${
                  enquiry.status === 'new' ? 'bg-blue-50/40' : ''
                }`}
                onClick={() => markRead(enquiry)}
              >
                <div className="flex flex-wrap items-start justify-between gap-2">
                  <div>
                    <p className="text-sm font-semibold text-gray-900">
                      {enquiry.buyer_name}
                      {enquiry.status === 'new' && (
                        <span className="ml-2 text-[10px] uppercase tracking-wide bg-blue-600 text-white px-1.5 py-0.5 rounded">
                          New
                        </span>
                      )}
                    </p>
                    <p className="text-xs text-gray-500 mt-0.5">
                      Re: {enquiry.property_title || `Property #${enquiry.property_id}`}
                      {enquiry.property_id ? (
                        <>
                          {' · '}
                          <Link
                            to={`/property/${enquiry.property_id}`}
                            className="text-blue-600 hover:underline"
                            onClick={(e) => e.stopPropagation()}
                          >
                            View listing
                          </Link>
                        </>
                      ) : null}
                    </p>
                  </div>
                  <p className="text-xs text-gray-400">
                    {enquiry.created_at
                      ? new Date(enquiry.created_at).toLocaleString()
                      : '—'}
                  </p>
                </div>
                <p className="mt-2 text-sm text-gray-700 whitespace-pre-line">{enquiry.message}</p>
                <p className="mt-2 text-xs text-gray-500">
                  {enquiry.buyer_email}
                  {enquiry.buyer_phone ? ` · ${enquiry.buyer_phone}` : ''}
                  {enquiry.contact_method ? ` · prefers ${enquiry.contact_method}` : ''}
                </p>
              </li>
            ))}
          </ul>
        )}
      </div>

      {showForm && (
        <PropertyPostForm
          onClose={handleFormClose}
          onSubmit={handleFormSubmit}
          editProperty={editingProperty}
        />
      )}

      <AuthenticCheckoutModal
        open={Boolean(checkout)}
        onClose={() => !confirmingPayment && setCheckout(null)}
        title={checkout ? `Promote: ${checkout.title}` : 'Secure checkout'}
        description={
          checkout
            ? `Pay to activate the ${checkout.upsellType} promotion on this listing.`
            : ''
        }
        amount={checkout?.amount || 0}
        upsellType="property"
        upsellId={checkout?.upsellId}
        onSuccess={handleCheckoutSuccess}
        onError={() => toast.error('PayPal payment failed')}
        footerNote="Promotion badges activate after PayPal confirms payment."
      />
    </div>
  );
};

export default PropertiesManagement;
