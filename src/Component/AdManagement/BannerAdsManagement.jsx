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
  FaCalendarAlt,
  FaPlus,
  FaSearch,
  FaSync,
} from 'react-icons/fa';
import { getMyBanner } from '../../slice/BannerSlice';
import { deleteBanner } from '../../slice/BannerSlice';
import PaymentService from '../../services/PaymentService';
import toast from 'react-hot-toast';
import AuthenticCheckoutModal from '../Payment/AuthenticCheckoutModal';
import { buildConfirmPaymentPayload } from '../../utils/paymentDefence';

const BannerAdsManagement = () => {
  const dispatch = useDispatch();
  const { myBannerList, loading } = useSelector((store) => store.banner);
  const [searchQuery, setSearchQuery] = useState('');
  const [filterStatus, setFilterStatus] = useState('all');
  const [showDeleteModal, setShowDeleteModal] = useState(null);
  const [renewModal, setRenewModal] = useState(null);
  const [pricingPlans, setPricingPlans] = useState([]);
  const [selectedRenewPlanId, setSelectedRenewPlanId] = useState(null);
  const [checkout, setCheckout] = useState(null);

  useEffect(() => {
    dispatch(getMyBanner());
    fetchPricingPlans();
  }, [dispatch]);

  const fetchPricingPlans = async () => {
    try {
      const plans = await PaymentService.getBannerPricingPlans();
      setPricingPlans(plans.data || []);
    } catch (error) {
      console.error('Failed to fetch pricing plans:', error);
    }
  };

  const handleDelete = async (bannerId) => {
    try {
      await dispatch(deleteBanner(bannerId)).unwrap();
      toast.success('Banner deleted successfully');
      setShowDeleteModal(null);
      dispatch(getMyBanner());
    } catch (error) {
      toast.error('Failed to delete banner');
    }
  };

  const handleRenew = (bannerId, planId) => {
    const plan = pricingPlans.find((p) => String(p.id) === String(planId));
    if (!plan) {
      toast.error('Select a pricing plan');
      return;
    }
    setRenewModal(null);
    setCheckout({
      bannerId,
      planId: plan.id,
      amount: Number(plan.price) || 0,
      description: `Renew banner: ${plan.name}`,
    });
  };

  const handleCheckoutSuccess = async (payment) => {
    if (!checkout) return;
    try {
      const payload = buildConfirmPaymentPayload(payment, {
        paymentMethod: payment.paymentMethod || 'paypal',
      });
      await PaymentService.processBannerPayment({
        pricing_plan_id: checkout.planId,
        banner_id: checkout.bannerId,
        ...payload,
      });
      toast.success('Payment processed successfully');
      setCheckout(null);
      dispatch(getMyBanner());
    } catch (error) {
      toast.error('Failed to process renewal payment');
    }
  };

  const getStatusBadge = (banner) => {
    const isExpired = banner.expires_at && new Date(banner.expires_at) < new Date();
    // const isActive = banner.is_active && !isExpired; // Commented out as unused

    if (isExpired) {
      return (
        <span className="inline-flex items-center rounded-full bg-red-100 px-2.5 py-0.5 text-xs font-medium text-red-800">
          <FaTimesCircle className="mr-1 h-3 w-3" />
          Expired
        </span>
      );
    }

    if (banner.payment_status === 'pending') {
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

  const getExpiryStatus = (banner) => {
    if (!banner.expires_at) return null;
    
    const expiryDate = new Date(banner.expires_at);
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

  const filteredBanners = (myBannerList || []).filter((banner) => {
    const matchesSearch = searchQuery
      ? banner.title?.toLowerCase().includes(searchQuery.toLowerCase()) ||
        banner.url_link?.toLowerCase().includes(searchQuery.toLowerCase())
      : true;
    
    const matchesStatus = filterStatus === 'all' ? true :
      filterStatus === 'active' ? banner.is_active && banner.payment_status === 'paid' :
      filterStatus === 'expired' ? new Date(banner.expires_at) < new Date() :
      filterStatus === 'pending' ? banner.payment_status === 'pending' :
      true;
    
    return matchesSearch && matchesStatus;
  });

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h2 className="text-xl font-semibold">Banner Ads Management</h2>
          <p className="text-sm text-muted-foreground">
            Manage your banner advertisements and track performance
          </p>
        </div>
        <Link
          to="/postbanner"
          className="inline-flex items-center justify-center whitespace-nowrap rounded-md bg-primary text-primary-foreground hover:bg-primary/90 h-10 px-6 text-sm font-medium"
        >
          <FaPlus className="mr-2 h-4 w-4" />
          Create New Banner
        </Link>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="rounded-lg border bg-card p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-muted-foreground">Total Banners</p>
              <p className="text-2xl font-bold">{myBannerList?.length || 0}</p>
            </div>
            <div className="bg-blue-500 text-white p-3 rounded-lg">
              <FaDollarSign className="h-6 w-6" />
            </div>
          </div>
        </div>
        <div className="rounded-lg border bg-card p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-muted-foreground">Active</p>
              <p className="text-2xl font-bold text-green-600">
                {myBannerList?.filter(b => b.is_active && b.payment_status === 'paid').length || 0}
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
              <p className="text-sm text-muted-foreground">Pending</p>
              <p className="text-2xl font-bold text-yellow-600">
                {myBannerList?.filter(b => b.payment_status === 'pending').length || 0}
              </p>
            </div>
            <div className="bg-yellow-500 text-white p-3 rounded-lg">
              <FaClock className="h-6 w-6" />
            </div>
          </div>
        </div>
        <div className="rounded-lg border bg-card p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-muted-foreground">Expired</p>
              <p className="text-2xl font-bold text-red-600">
                {myBannerList?.filter(b => b.expires_at && new Date(b.expires_at) < new Date()).length || 0}
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
            placeholder="Search banners..."
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
          <option value="pending">Pending</option>
          <option value="expired">Expired</option>
        </select>
        <button
          onClick={() => dispatch(getMyBanner())}
          className="inline-flex items-center justify-center whitespace-nowrap rounded-md border border-input bg-background hover:bg-accent hover:text-accent-foreground h-10 px-6 text-sm font-medium"
        >
          <FaSync className="mr-2 h-4 w-4" />
          Refresh
        </button>
      </div>

      {/* Banners List */}
      {loading ? (
        <div className="flex justify-center py-12">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
        </div>
      ) : filteredBanners.length > 0 ? (
        <div className="space-y-4">
          {filteredBanners.map((banner) => (
            <div
              key={banner.id}
              className="rounded-lg border bg-card p-6 hover:shadow-md transition-shadow"
            >
              <div className="flex flex-col lg:flex-row gap-6">
                {/* Banner Image */}
                <div className="lg:w-48 flex-shrink-0">
                  <img
                    src={banner.img || '/img/no-image-banner.jpg'}
                    alt={banner.title}
                    className="w-full h-32 object-cover rounded-lg"
                    onError={(e) => {
                      e.target.src = '/img/no-image-banner.jpg';
                    }}
                  />
                </div>

                {/* Banner Details */}
                <div className="flex-1 space-y-3">
                  <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-3">
                    <div>
                      <h3 className="text-lg font-semibold">{banner.title}</h3>
                      <p className="text-sm text-muted-foreground">{banner.url_link}</p>
                    </div>
                    <div className="flex items-center gap-2">
                      {getStatusBadge(banner)}
                      {getExpiryStatus(banner)}
                    </div>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 text-sm">
                    <div className="flex items-center gap-2">
                      <FaDollarSign className="h-4 w-4 text-muted-foreground" />
                      <span>Price: ${banner.price || '0.00'}</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <FaCalendarAlt className="h-4 w-4 text-muted-foreground" />
                      <span>
                        {banner.expires_at 
                          ? `Expires: ${new Date(banner.expires_at).toLocaleDateString()}`
                          : 'No expiry'
                        }
                      </span>
                    </div>
                    <div className="flex items-center gap-2">
                      <span className="font-medium">Size:</span>
                      <span>{banner.size_img || 'Standard'}</span>
                    </div>
                  </div>

                  {/* Actions */}
                  <div className="flex flex-wrap gap-2 pt-3 border-t">
                    <button className="inline-flex items-center justify-center whitespace-nowrap rounded-md border border-input bg-background hover:bg-accent hover:text-accent-foreground h-9 px-4 text-sm">
                      <FaEye className="mr-2 h-4 w-4" />
                      View
                    </button>
                    <Link
                      to={`/postbanner/${banner.id}`}
                      className="inline-flex items-center justify-center whitespace-nowrap rounded-md border border-input bg-background hover:bg-accent hover:text-accent-foreground h-9 px-4 text-sm"
                    >
                      <FaEdit className="mr-2 h-4 w-4" />
                      Edit
                    </Link>
                    {banner.expires_at && new Date(banner.expires_at) < new Date() && (
                      <button
                        onClick={() => setRenewModal(banner.id)}
                        className="inline-flex items-center justify-center whitespace-nowrap rounded-md bg-green-600 text-white hover:bg-green-700 h-9 px-4 text-sm"
                      >
                        <FaSync className="mr-2 h-4 w-4" />
                        Renew
                      </button>
                    )}
                    <button
                      onClick={() => setShowDeleteModal(banner.id)}
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
            <FaDollarSign className="h-12 w-12 text-muted-foreground" />
          </div>
          <h3 className="text-lg font-semibold mb-2">No Banner Ads Found</h3>
          <p className="text-muted-foreground mb-4">
            {searchQuery || filterStatus !== 'all'
              ? 'Try adjusting your search or filters'
              : 'Get started by creating your first banner ad'
            }
          </p>
          {(!searchQuery && filterStatus === 'all') && (
            <Link
              to="/postbanner"
              className="inline-flex items-center justify-center whitespace-nowrap rounded-md bg-primary text-primary-foreground hover:bg-primary/90 h-10 px-6 text-sm font-medium"
            >
              <FaPlus className="mr-2 h-4 w-4" />
              Create Your First Banner
            </Link>
          )}
        </div>
      )}

      {/* Delete Confirmation Modal */}
      {showDeleteModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 max-w-md w-full mx-4">
            <h3 className="text-lg font-semibold mb-4">Delete Banner Ad</h3>
            <p className="text-muted-foreground mb-6">
              Are you sure you want to delete this banner ad? This action cannot be undone.
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
            <h3 className="text-lg font-semibold mb-4">Renew Banner Ad</h3>
            <p className="text-muted-foreground mb-6">
              Select a pricing plan to renew your banner ad.
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
        title="Renew banner"
        description={checkout?.description}
        amount={checkout?.amount || 0}
        upsellType="banner"
        upsellId={checkout?.bannerId}
        onSuccess={handleCheckoutSuccess}
      />
    </div>
  );
};

export default BannerAdsManagement;
