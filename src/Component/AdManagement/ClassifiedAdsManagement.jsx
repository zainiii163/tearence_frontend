import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Link } from 'react-router-dom';
import {
  FaEdit,
  FaTrash,
  FaEye,
  FaClock,
  FaCheckCircle,
  FaTimesCircle,
  FaDollarSign,
  FaPlus,
  FaSearch,
  FaSync,
  FaTag,
  FaMapMarkerAlt,
  FaHandshake,
} from 'react-icons/fa';
import { getMyClassifieds } from '../../slice/ClassifiedSlice';
import { deleteClassified } from '../../slice/ClassifiedSlice';
import PaymentService from '../../services/PaymentService';
import ClassifiedService from '../../services/ClassifiedService';
import toast from 'react-hot-toast';
import AuthenticCheckoutModal from '../Payment/AuthenticCheckoutModal';
import { buildConfirmPaymentPayload } from '../../utils/paymentDefence';
import ListingPendingPayAction from '../dashboard/ListingPendingPayAction';
import { isListingAwaitingPayment } from '../../utils/dashboardStatsHelpers';

const ClassifiedAdsManagement = () => {
  const dispatch = useDispatch();
  const { myClassifieds, loading } = useSelector((store) => store.classified);
  const [searchQuery, setSearchQuery] = useState('');
  const [filterStatus, setFilterStatus] = useState('all');
  const [filterCategory, setFilterCategory] = useState('all');
  const [showDeleteModal, setShowDeleteModal] = useState(null);
  const [renewModal, setRenewModal] = useState(null);
  const [pricingPlans, setPricingPlans] = useState([]);
  const [selectedRenewPlanId, setSelectedRenewPlanId] = useState(null);
  const [checkout, setCheckout] = useState(null);
  const [showAnalytics, setShowAnalytics] = useState(null);
  const [categories, setCategories] = useState([]);

  useEffect(() => {
    dispatch(getMyClassifieds());
    fetchPricingPlans();
    fetchCategories();
  }, [dispatch]);

  const fetchPricingPlans = async () => {
    try {
      const plans = await PaymentService.getAllAdPricingPlans();
      const classifiedPlans = plans.data?.filter(plan => plan.ad_type === 'classified') || [];
      setPricingPlans(classifiedPlans);
    } catch (error) {
      console.error('Failed to fetch pricing plans:', error);
    }
  };

  const fetchCategories = async () => {
    try {
      const response = await fetch('/api/v1/categories');
      const data = await response.json();
      setCategories(data.data?.items || []);
    } catch (error) {
      console.error('Failed to fetch categories:', error);
    }
  };

  const handleDelete = async (classifiedId) => {
    try {
      await dispatch(deleteClassified(classifiedId)).unwrap();
      toast.success('Classified ad deleted successfully');
      setShowDeleteModal(null);
      dispatch(getMyClassifieds());
    } catch (error) {
      toast.error('Failed to delete classified ad');
    }
  };

  const handleRenew = (classifiedId, planId) => {
    const plan = pricingPlans.find((p) => String(p.id) === String(planId));
    if (!plan) {
      toast.error('Select a pricing plan');
      return;
    }
    setRenewModal(null);
    setCheckout({
      classifiedId,
      planId: plan.id,
      amount: Number(plan.price) || 0,
      description: `Renew classified: ${plan.name}`,
    });
  };

  const handleCheckoutSuccess = async (payment) => {
    if (!checkout) return;
    try {
      const payload = buildConfirmPaymentPayload(payment, {
        paymentMethod: payment.paymentMethod || 'paypal',
      });
      await ClassifiedService.processClassifiedPayment({
        pricing_plan_id: checkout.planId,
        classified_id: checkout.classifiedId,
        ...payload,
      });
      toast.success('Payment processed successfully');
      setCheckout(null);
      dispatch(getMyClassifieds());
    } catch (error) {
      toast.error('Failed to process renewal payment');
    }
  };

  const handleMarkAsSold = async (classifiedId) => {
    try {
      // API call to mark as sold
      await fetch(`/api/v1/classified/${classifiedId}/mark-sold`, {
        method: 'PUT',
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('token')}`,
          'Content-Type': 'application/json'
        }
      });
      toast.success('Ad marked as sold');
      dispatch(getMyClassifieds());
    } catch (error) {
      toast.error('Failed to mark as sold');
    }
  };

  const getStatusBadge = (classified) => {
    const isExpired = classified.expires_at && new Date(classified.expires_at) < new Date();
    // const isActive = classified.is_active && !isExpired && !classified.is_sold; // Commented out as unused

    if (classified.is_sold) {
      return (
        <span className="inline-flex items-center rounded-full bg-gray-100 px-2.5 py-0.5 text-xs font-medium text-gray-800">
          <FaCheckCircle className="mr-1 h-3 w-3" />
          Sold
        </span>
      );
    }

    if (isExpired) {
      return (
        <span className="inline-flex items-center rounded-full bg-red-100 px-2.5 py-0.5 text-xs font-medium text-red-800">
          <FaTimesCircle className="mr-1 h-3 w-3" />
          Expired
        </span>
      );
    }

    if (classified.payment_status === 'pending') {
      return (
        <span className="inline-flex items-center rounded-full bg-yellow-100 px-2.5 py-0.5 text-xs font-medium text-yellow-800">
          <FaClock className="mr-1 h-3 w-3" />
          Pending Payment
        </span>
      );
    }

    return (
      <span className="inline-flex items-center rounded-full bg-green-100 px-2.5 py-0.5 text-xs font-medium text-green-800">
        <FaCheckCircle className="mr-1 h-3 w-3" />
        Active
      </span>
    );
  };

  const getExpiryStatus = (classified) => {
    if (!classified.expires_at) return null;
    
    const expiryDate = new Date(classified.expires_at);
    const now = new Date();
    const daysUntilExpiry = Math.ceil((expiryDate - now) / (1000 * 60 * 60 * 24));
    
    if (daysUntilExpiry <= 7 && daysUntilExpiry > 0) {
      return (
        <span className="inline-flex items-center rounded-full bg-orange-100 px-2.5 py-0.5 text-xs font-medium text-orange-800">
          <FaClock className="mr-1 h-3 w-3" />
          Expires in {daysUntilExpiry} days
        </span>
      );
    }
    
    return null;
  };

  const filteredClassifieds = (myClassifieds.data || []).filter((classified) => {
    const matchesSearch = searchQuery
      ? classified.title?.toLowerCase().includes(searchQuery.toLowerCase()) ||
        classified.description?.toLowerCase().includes(searchQuery.toLowerCase())
      : true;
    
    const matchesStatus = filterStatus === 'all' ? true :
      filterStatus === 'active' ? classified.is_active && classified.payment_status === 'paid' && !classified.is_sold :
      filterStatus === 'expired' ? new Date(classified.expires_at) < new Date() :
      filterStatus === 'pending' ? classified.payment_status === 'pending' :
      filterStatus === 'sold' ? classified.is_sold :
      true;
    
    const matchesCategory = filterCategory === 'all' ? true :
      classified.category_id === filterCategory;
    
    return matchesSearch && matchesStatus && matchesCategory;
  });

  const mockAnalytics = {
    views: Math.floor(Math.random() * 5000) + 500,
    contacts: Math.floor(Math.random() * 100) + 10,
    favorites: Math.floor(Math.random() * 50) + 5,
    daysActive: Math.floor(Math.random() * 30) + 1
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h2 className="text-xl font-semibold">Classified Ads Management</h2>
          <p className="text-sm text-muted-foreground">
            Manage your classified advertisements and track performance
          </p>
        </div>
        <Link
          to="/postclassified"
          className="inline-flex items-center justify-center whitespace-nowrap rounded-md bg-primary text-primary-foreground hover:bg-primary/90 h-10 px-6 text-sm font-medium"
        >
          <FaPlus className="mr-2 h-4 w-4" />
          Create New Classified
        </Link>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="rounded-lg border bg-card p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-muted-foreground">Total Classifieds</p>
              <p className="text-2xl font-bold">{myClassifieds.data?.length || 0}</p>
            </div>
            <div className="bg-orange-500 text-white p-3 rounded-lg">
              <FaTag className="h-6 w-6" />
            </div>
          </div>
        </div>
        <div className="rounded-lg border bg-card p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-muted-foreground">Active</p>
              <p className="text-2xl font-bold text-green-600">
                {myClassifieds.data?.filter(c => c.is_active && c.payment_status === 'paid' && !c.is_sold).length || 0}
              </p>
            </div>
            <div className="bg-green-500 text-white p-3 rounded-lg">
              <FaCheckCircle className="h-6 w-6" />
            </div>
          </div>
        </div>
        <div className="rounded-lg border bg-card p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-muted-foreground">Sold</p>
              <p className="text-2xl font-bold text-blue-600">
                {myClassifieds.data?.filter(c => c.is_sold).length || 0}
              </p>
            </div>
            <div className="bg-blue-500 text-white p-3 rounded-lg">
              <FaHandshake className="h-6 w-6" />
            </div>
          </div>
        </div>
        <div className="rounded-lg border bg-card p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-muted-foreground">Expired</p>
              <p className="text-2xl font-bold text-red-600">
                {myClassifieds.data?.filter(c => c.expires_at && new Date(c.expires_at) < new Date()).length || 0}
              </p>
            </div>
            <div className="bg-red-500 text-white p-3 rounded-lg">
              <FaTimesCircle className="h-6 w-6" />
            </div>
          </div>
        </div>
      </div>

      {/* Filters */}
      <div className="flex flex-col sm:flex-row gap-4">
        <div className="relative flex-1 sm:flex-initial">
          <FaSearch className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <input
            type="text"
            placeholder="Search classified ads..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="flex h-10 w-full sm:w-64 rounded-md border border-input bg-background pl-10 pr-3 py-2 text-sm ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
          />
        </div>
        <select
          value={filterStatus}
          onChange={(e) => setFilterStatus(e.target.value)}
          className="flex h-10 rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
        >
          <option value="all">All Status</option>
          <option value="active">Active</option>
          <option value="sold">Sold</option>
          <option value="pending">Pending</option>
          <option value="expired">Expired</option>
        </select>
        <select
          value={filterCategory}
          onChange={(e) => setFilterCategory(e.target.value)}
          className="flex h-10 rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
        >
          <option value="all">All Categories</option>
          {categories.map((category) => (
            <option key={category.category_id} value={category.category_id}>
              {category.name}
            </option>
          ))}
        </select>
        <button
          onClick={() => dispatch(getMyClassifieds())}
          className="inline-flex items-center justify-center whitespace-nowrap rounded-md border border-input bg-background hover:bg-accent hover:text-accent-foreground h-10 px-6 text-sm font-medium"
        >
          <FaSync className="mr-2 h-4 w-4" />
          Refresh
        </button>
      </div>

      {/* Classified Ads List */}
      {loading ? (
        <div className="flex justify-center py-12">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
        </div>
      ) : filteredClassifieds.length > 0 ? (
        <div className="space-y-4">
          {filteredClassifieds.map((classified) => (
            <div
              key={classified.id}
              className="rounded-lg border bg-card p-6 hover:shadow-md transition-shadow"
            >
              <div className="flex flex-col lg:flex-row gap-6">
                {/* Classified Image */}
                <div className="lg:w-48 flex-shrink-0">
                  <img
                    src={classified.images?.[0]?.image_path || '/img/no-image-classified.jpg'}
                    alt={classified.title}
                    className="w-full h-32 object-cover rounded-lg"
                    onError={(e) => {
                      e.target.src = '/img/no-image-classified.jpg';
                    }}
                  />
                </div>

                {/* Classified Details */}
                <div className="flex-1 space-y-3">
                  <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-3">
                    <div>
                      <h3 className="text-lg font-semibold">{classified.title}</h3>
                      <p className="text-sm text-muted-foreground line-clamp-2">
                        {classified.description}
                      </p>
                    </div>
                    <div className="flex flex-col items-end gap-2">
                      <div className="flex items-center gap-2 flex-wrap justify-end">
                        {getStatusBadge(classified)}
                        {getExpiryStatus(classified)}
                      </div>
                      {isListingAwaitingPayment(classified) ? (
                        <ListingPendingPayAction
                          item={classified}
                          upsellType="classified"
                          onPaid={() => dispatch(getMyClassifieds())}
                        />
                      ) : null}
                    </div>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 text-sm">
                    <div className="flex items-center gap-2">
                      <FaDollarSign className="h-4 w-4 text-muted-foreground" />
                      <span>Price: ${classified.price || '0.00'}</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <FaTag className="h-4 w-4 text-muted-foreground" />
                      <span>{classified.category?.name || 'Uncategorized'}</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <FaMapMarkerAlt className="h-4 w-4 text-muted-foreground" />
                      <span>{classified.location || 'No location'}</span>
                    </div>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-sm">
                    <div className="flex items-center gap-2">
                      <span className="font-medium">Condition:</span>
                      <span className="capitalize">{classified.condition || 'New'}</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <span className="font-medium">Negotiable:</span>
                      <span>{classified.is_negotiable ? 'Yes' : 'No'}</span>
                    </div>
                  </div>

                  {/* Performance Stats */}
                  <div className="bg-muted/30 rounded-lg p-3">
                    <div className="flex items-center justify-between mb-2">
                      <span className="text-sm font-medium">Performance</span>
                      <button
                        onClick={() => setShowAnalytics(showAnalytics === classified.id ? null : classified.id)}
                        className="text-primary hover:underline text-sm flex items-center gap-1"
                      >
                        <FaEye className="h-3 w-3" />
                        {showAnalytics === classified.id ? 'Hide' : 'Show'} Stats
                      </button>
                    </div>
                    {showAnalytics === classified.id && (
                      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 text-sm">
                        <div>
                          <span className="text-muted-foreground">Views</span>
                          <div className="font-semibold">{mockAnalytics.views}</div>
                        </div>
                        <div>
                          <span className="text-muted-foreground">Contacts</span>
                          <div className="font-semibold">{mockAnalytics.contacts}</div>
                        </div>
                        <div>
                          <span className="text-muted-foreground">Favorites</span>
                          <div className="font-semibold">{mockAnalytics.favorites}</div>
                        </div>
                        <div>
                          <span className="text-muted-foreground">Days Active</span>
                          <div className="font-semibold">{mockAnalytics.daysActive}</div>
                        </div>
                      </div>
                    )}
                  </div>

                  {/* Actions */}
                  <div className="flex flex-wrap gap-2 pt-3 border-t">
                    <button className="inline-flex items-center justify-center whitespace-nowrap rounded-md border border-input bg-background hover:bg-accent hover:text-accent-foreground h-9 px-4 text-sm">
                      <FaEye className="mr-2 h-4 w-4" />
                      View
                    </button>
                    <Link
                      to={`/postclassified/${classified.id}`}
                      className="inline-flex items-center justify-center whitespace-nowrap rounded-md border border-input bg-background hover:bg-accent hover:text-accent-foreground h-9 px-4 text-sm"
                    >
                      <FaEdit className="mr-2 h-4 w-4" />
                      Edit
                    </Link>
                    {!classified.is_sold && classified.is_active && (
                      <button
                        onClick={() => handleMarkAsSold(classified.id)}
                        className="inline-flex items-center justify-center whitespace-nowrap rounded-md bg-blue-600 text-white hover:bg-blue-700 h-9 px-4 text-sm"
                      >
                        <FaCheckCircle className="mr-2 h-4 w-4" />
                        Mark as Sold
                      </button>
                    )}
                    {classified.expires_at && new Date(classified.expires_at) < new Date() && (
                      <button
                        onClick={() => setRenewModal(classified.id)}
                        className="inline-flex items-center justify-center whitespace-nowrap rounded-md bg-green-600 text-white hover:bg-green-700 h-9 px-4 text-sm"
                      >
                        <FaSync className="mr-2 h-4 w-4" />
                        Renew
                      </button>
                    )}
                    <button
                      onClick={() => setShowDeleteModal(classified.id)}
                      className="inline-flex items-center justify-center whitespace-nowrap rounded-md bg-red-600 text-white hover:bg-red-700 h-9 px-4 text-sm"
                    >
                      <FaTrash className="mr-2 h-4 w-4" />
                      Delete
                    </button>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      ) : (
        <div className="text-center py-12">
          <div className="mx-auto w-24 h-24 bg-muted rounded-full flex items-center justify-center mb-4">
            <FaTag className="h-12 w-12 text-muted-foreground" />
          </div>
          <h3 className="text-lg font-semibold mb-2">No Classified Ads Found</h3>
          <p className="text-muted-foreground mb-4">
            {searchQuery || filterStatus !== 'all' || filterCategory !== 'all'
              ? 'Try adjusting your search or filters'
              : 'Get started by creating your first classified ad'
            }
          </p>
          {(!searchQuery && filterStatus === 'all' && filterCategory === 'all') && (
            <Link
              to="/postclassified"
              className="inline-flex items-center justify-center whitespace-nowrap rounded-md bg-primary text-primary-foreground hover:bg-primary/90 h-10 px-6 text-sm font-medium"
            >
              <FaPlus className="mr-2 h-4 w-4" />
              Create Your First Classified Ad
            </Link>
          )}
        </div>
      )}

      {/* Delete Confirmation Modal */}
      {showDeleteModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 max-w-md w-full mx-4">
            <h3 className="text-lg font-semibold mb-4">Delete Classified Ad</h3>
            <p className="text-muted-foreground mb-6">
              Are you sure you want to delete this classified ad? This action cannot be undone.
            </p>
            <div className="flex gap-3 justify-end">
              <button
                onClick={() => setShowDeleteModal(null)}
                className="inline-flex items-center justify-center whitespace-nowrap rounded-md border border-input bg-background hover:bg-accent hover:text-accent-foreground h-10 px-6 text-sm font-medium"
              >
                Cancel
              </button>
              <button
                onClick={() => handleDelete(showDeleteModal)}
                className="inline-flex items-center justify-center whitespace-nowrap rounded-md bg-red-600 text-white hover:bg-red-700 h-10 px-6 text-sm font-medium"
              >
                Delete
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Renew Modal */}
      {renewModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 max-w-md w-full mx-4">
            <h3 className="text-lg font-semibold mb-4">Renew Classified Ad</h3>
            <p className="text-muted-foreground mb-6">
              Select a pricing plan to renew your classified ad.
            </p>
            <div className="space-y-3 mb-6">
              {pricingPlans.map((plan) => (
                <label key={plan.id} className="flex items-center gap-3 p-3 border rounded-lg cursor-pointer hover:bg-accent">
                  <input
                    type="radio"
                    name="renewal-plan"
                    value={plan.id}
                    className="w-4 h-4"
                    checked={String(selectedRenewPlanId) === String(plan.id)}
                    onChange={() => setSelectedRenewPlanId(plan.id)}
                  />
                  <div className="flex-1">
                    <div className="font-medium">{plan.name}</div>
                    <div className="text-sm text-muted-foreground">
                      ${plan.price} - {plan.duration_days} days
                    </div>
                  </div>
                </label>
              ))}
            </div>
            <div className="flex gap-3 justify-end">
              <button
                onClick={() => setRenewModal(null)}
                className="inline-flex items-center justify-center whitespace-nowrap rounded-md border border-input bg-background hover:bg-accent hover:text-accent-foreground h-10 px-6 text-sm font-medium"
              >
                Cancel
              </button>
              <button
                onClick={() => handleRenew(renewModal, selectedRenewPlanId)}
                className="inline-flex items-center justify-center whitespace-nowrap rounded-md bg-primary text-primary-foreground hover:bg-primary/90 h-10 px-6 text-sm font-medium"
              >
                Continue to checkout
              </button>
            </div>
          </div>
        </div>
      )}

      <AuthenticCheckoutModal
        open={Boolean(checkout)}
        onClose={() => setCheckout(null)}
        title="Renew classified ad"
        description={checkout?.description}
        amount={checkout?.amount || 0}
        upsellType="classified"
        upsellId={checkout?.classifiedId}
        onSuccess={handleCheckoutSuccess}
      />
    </div>
  );
};

export default ClassifiedAdsManagement;
