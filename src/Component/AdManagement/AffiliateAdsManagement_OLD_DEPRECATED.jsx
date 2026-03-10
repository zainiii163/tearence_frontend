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
  FaExternalLinkAlt,
  FaDollarSign,
  FaCalendarAlt,
  FaPlus,
  FaSearch,
  FaSync,
  FaChartLine,
} from 'react-icons/fa';
import { getMyAffiliate } from '../../slice/AffiliateSLice';
import { deleteAffiliate } from '../../slice/AffiliateSLice';
import PaymentService from '../../services/PaymentService';
import toast from 'react-hot-toast';

const AffiliateAdsManagement = () => {
  const dispatch = useDispatch();
  const { myAffiliateList, loading } = useSelector((store) => store.aff);
  const [searchQuery, setSearchQuery] = useState('');
  const [filterStatus, setFilterStatus] = useState('all');
  const [showDeleteModal, setShowDeleteModal] = useState(null);
  const [renewModal, setRenewModal] = useState(null);
  const [pricingPlans, setPricingPlans] = useState([]);
  const [showAnalytics, setShowAnalytics] = useState(null);

  useEffect(() => {
    dispatch(getMyAffiliate());
    fetchPricingPlans();
  }, [dispatch]);

  const fetchPricingPlans = async () => {
    try {
      const plans = await PaymentService.getAffiliatePricingPlans();
      setPricingPlans(plans.data || []);
    } catch (error) {
      console.error('Failed to fetch pricing plans:', error);
    }
  };

  const handleDelete = async (affiliateId) => {
    try {
      await dispatch(deleteAffiliate(affiliateId)).unwrap();
      toast.success('Affiliate ad deleted successfully');
      setShowDeleteModal(null);
      dispatch(getMyAffiliate());
    } catch (error) {
      toast.error('Failed to delete affiliate ad');
    }
  };

  const handleRenew = async (affiliateId, planId) => {
    try {
      const paymentData = {
        pricing_plan_id: planId,
        payment_method: 'paypal',
        transaction_id: `RENEW_AFF_${Date.now()}`,
        affiliate_id: affiliateId
      };
      
      await PaymentService.processAffiliatePayment(paymentData);
      toast.success('Payment processed successfully');
      setRenewModal(null);
      dispatch(getMyAffiliate());
    } catch (error) {
      toast.error('Failed to process renewal payment');
    }
  };

  const getStatusBadge = (affiliate) => {
    const isExpired = affiliate.expires_at && new Date(affiliate.expires_at) < new Date();

    if (isExpired) {
      return (
        <span className="inline-flex items-center rounded-full bg-purple-100 px-2.5 py-0.5 text-xs font-medium text-purple-800">
          <FaTimesCircle className="mr-1 h-3 w-3" />
          Expired
        </span>
      );
    }

    if (affiliate.payment_status === 'pending') {
      return (
        <span className="inline-flex items-center rounded-full bg-blue-100 px-2.5 py-0.5 text-xs font-medium text-blue-800">
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

  const getExpiryStatus = (affiliate) => {
    if (!affiliate.expires_at) return null;
    
    const expiryDate = new Date(affiliate.expires_at);
    const now = new Date();
    const daysUntilExpiry = Math.ceil((expiryDate - now) / (1000 * 60 * 60 * 24));
    
    if (daysUntilExpiry <= 7 && daysUntilExpiry > 0) {
      return (
        <span className="inline-flex items-center rounded-full bg-blue-100 px-2.5 py-0.5 text-xs font-medium text-blue-800">
          <FaClock className="mr-1 h-3 w-3" />
          Expires in {daysUntilExpiry} days
        </span>
      );
    }
    
    return null;
  };

  const filteredAffiliates = (myAffiliateList || []).filter((affiliate) => {
    const matchesSearch = searchQuery
      ? affiliate.title?.toLowerCase().includes(searchQuery.toLowerCase()) ||
        affiliate.link?.toLowerCase().includes(searchQuery.toLowerCase())
      : true;
    
    const matchesStatus = filterStatus === 'all' ? true :
      filterStatus === 'active' ? affiliate.is_active && affiliate.payment_status === 'paid' :
      filterStatus === 'expired' ? new Date(affiliate.expires_at) < new Date() :
      filterStatus === 'pending' ? affiliate.payment_status === 'pending' :
      true;
    
    return matchesSearch && matchesStatus;
  });

  const mockAnalytics = {
    clicks: Math.floor(Math.random() * 1000) + 100,
    impressions: Math.floor(Math.random() * 10000) + 1000,
    ctr: ((Math.random() * 5) + 0.5).toFixed(2),
    earnings: (Math.random() * 500 + 50).toFixed(2)
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h2 className="text-xl font-semibold">Affiliate Ads Management</h2>
          <p className="text-sm text-muted-foreground">
            Manage your affiliate advertisements and track performance
          </p>
        </div>
        <Link
          to="/postaffiliate"
          className="inline-flex items-center justify-center whitespace-nowrap rounded-md bg-primary text-primary-foreground hover:bg-primary/90 h-10 px-6 text-sm font-medium"
        >
          <FaPlus className="mr-2 h-4 w-4" />
          Create New Affiliate Ad
        </Link>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="rounded-lg border bg-card p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-muted-foreground">Total Affiliate Ads</p>
              <p className="text-2xl font-bold">{myAffiliateList?.length || 0}</p>
            </div>
            <div className="bg-purple-500 text-white p-3 rounded-lg">
              <FaExternalLinkAlt className="h-6 w-6" />
            </div>
          </div>
        </div>
        <div className="rounded-lg border bg-card p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-muted-foreground">Active</p>
              <p className="text-2xl font-bold text-green-600">
                {myAffiliateList?.filter(a => a.is_active && a.payment_status === 'paid').length || 0}
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
              <p className="text-2xl font-bold text-blue-600">
                {myAffiliateList?.filter(a => a.payment_status === 'pending').length || 0}
              </p>
            </div>
            <div className="bg-blue-500 text-white p-3 rounded-lg">
              <FaClock className="h-6 w-6" />
            </div>
          </div>
        </div>
        <div className="rounded-lg border bg-card p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-muted-foreground">Expired</p>
              <p className="text-2xl font-bold text-purple-600">
                {myAffiliateList?.filter(a => a.expires_at && new Date(a.expires_at) < new Date()).length || 0}
              </p>
            </div>
            <div className="bg-purple-500 text-white p-3 rounded-lg">
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
            placeholder="Search affiliate ads..."
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
          onClick={() => dispatch(getMyAffiliate())}
          className="inline-flex items-center justify-center whitespace-nowrap rounded-md border border-input bg-background hover:bg-accent hover:text-accent-foreground h-10 px-6 text-sm font-medium"
        >
          <FaSync className="mr-2 h-4 w-4" />
          Refresh
        </button>
      </div>

      {/* Affiliate Ads List */}
      {loading ? (
        <div className="flex justify-center py-12">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
        </div>
      ) : filteredAffiliates.length > 0 ? (
        <div className="space-y-4">
          {filteredAffiliates.map((affiliate) => (
            <div
              key={affiliate.id}
              className="rounded-lg border bg-card p-6 hover:shadow-md transition-shadow"
            >
              <div className="flex flex-col lg:flex-row gap-6">
                {/* Affiliate Image */}
                <div className="lg:w-48 flex-shrink-0">
                  <img
                    src={affiliate.image_url || '/img/no-image-affiliate.jpg'}
                    alt={affiliate.title}
                    className="w-full h-32 object-cover rounded-lg"
                    onError={(e) => {
                      e.target.src = '/img/no-image-affiliate.jpg';
                    }}
                  />
                </div>

                {/* Affiliate Details */}
                <div className="flex-1 space-y-3">
                  <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-3">
                    <div>
                      <h3 className="text-lg font-semibold">{affiliate.title}</h3>
                      <a
                        href={affiliate.link}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-sm text-primary hover:underline flex items-center gap-1"
                      >
                        <FaExternalLinkAlt className="h-3 w-3" />
                        {affiliate.link}
                      </a>
                    </div>
                    <div className="flex items-center gap-2">
                      {getStatusBadge(affiliate)}
                      {getExpiryStatus(affiliate)}
                    </div>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 text-sm">
                    <div className="flex items-center gap-2">
                      <FaDollarSign className="h-4 w-4 text-muted-foreground" />
                      <span>Price: ${affiliate.price || '0.00'}</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <FaCalendarAlt className="h-4 w-4 text-muted-foreground" />
                      <span>
                        {affiliate.expires_at 
                          ? `Expires: ${new Date(affiliate.expires_at).toLocaleDateString()}`
                          : 'No expiry'
                        }
                      </span>
                    </div>
                    <div className="flex items-center gap-2">
                      <span className="font-medium">Position:</span>
                      <span>{affiliate.position || 'Top'}</span>
                    </div>
                  </div>

                  {/* Performance Stats */}
                  <div className="bg-muted/30 rounded-lg p-3">
                    <div className="flex items-center justify-between mb-2">
                      <span className="text-sm font-medium">Performance</span>
                      <button
                        onClick={() => setShowAnalytics(showAnalytics === affiliate.id ? null : affiliate.id)}
                        className="text-primary hover:underline text-sm flex items-center gap-1"
                      >
                        <FaChartLine className="h-3 w-3" />
                        {showAnalytics === affiliate.id ? 'Hide' : 'Show'} Analytics
                      </button>
                    </div>
                    {showAnalytics === affiliate.id && (
                      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 text-sm">
                        <div>
                          <span className="text-muted-foreground">Clicks</span>
                          <div className="font-semibold">{mockAnalytics.clicks}</div>
                        </div>
                        <div>
                          <span className="text-muted-foreground">Impressions</span>
                          <div className="font-semibold">{mockAnalytics.impressions}</div>
                        </div>
                        <div>
                          <span className="text-muted-foreground">CTR</span>
                          <div className="font-semibold">{mockAnalytics.ctr}%</div>
                        </div>
                        <div>
                          <span className="text-muted-foreground">Earnings</span>
                          <div className="font-semibold">${mockAnalytics.earnings}</div>
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
                      to={`/postaffiliate/${affiliate.id}`}
                      className="inline-flex items-center justify-center whitespace-nowrap rounded-md border border-input bg-background hover:bg-accent hover:text-accent-foreground h-9 px-4 text-sm"
                    >
                      <FaEdit className="mr-2 h-4 w-4" />
                      Edit
                    </Link>
                    {affiliate.expires_at && new Date(affiliate.expires_at) < new Date() && (
                      <button
                        onClick={() => setRenewModal(affiliate.id)}
                        className="inline-flex items-center justify-center whitespace-nowrap rounded-md bg-green-600 text-white hover:bg-green-700 h-9 px-4 text-sm"
                      >
                        <FaSync className="mr-2 h-4 w-4" />
                        Renew
                      </button>
                    )}
                    <button
                      onClick={() => setShowDeleteModal(affiliate.id)}
                      className="inline-flex items-center justify-center whitespace-nowrap rounded-md bg-purple-600 text-white hover:bg-purple-700 h-9 px-4 text-sm"
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
            <FaExternalLinkAlt className="h-12 w-12 text-muted-foreground" />
          </div>
          <h3 className="text-lg font-semibold mb-2">No Affiliate Ads Found</h3>
          <p className="text-muted-foreground mb-4">
            {searchQuery || filterStatus !== 'all'
              ? 'Try adjusting your search or filters'
              : 'Get started by creating your first affiliate ad'
            }
          </p>
          {(!searchQuery && filterStatus === 'all') && (
            <Link
              to="/postaffiliate"
              className="inline-flex items-center justify-center whitespace-nowrap rounded-md bg-primary text-primary-foreground hover:bg-primary/90 h-10 px-6 text-sm font-medium"
            >
              <FaPlus className="mr-2 h-4 w-4" />
              Create Your First Affiliate Ad
            </Link>
          )}
        </div>
      )}

      {/* Delete Confirmation Modal */}
      {showDeleteModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 max-w-md w-full mx-4">
            <h3 className="text-lg font-semibold mb-4">Delete Affiliate Ad</h3>
            <p className="text-muted-foreground mb-6">
              Are you sure you want to delete this affiliate ad? This action cannot be undone.
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
                className="inline-flex items-center justify-center whitespace-nowrap rounded-md bg-purple-600 text-white hover:bg-purple-700 h-10 px-6 text-sm font-medium"
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
            <h3 className="text-lg font-semibold mb-4">Renew Affiliate Ad</h3>
            <p className="text-muted-foreground mb-6">
              Select a pricing plan to renew your affiliate ad.
            </p>
            <div className="space-y-3 mb-6">
              {pricingPlans.map((plan) => (
                <label key={plan.id} className="flex items-center gap-3 p-3 border rounded-lg cursor-pointer hover:bg-accent">
                  <input
                    type="radio"
                    name="renewal-plan"
                    value={plan.id}
                    className="w-4 h-4"
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
                onClick={() => handleRenew(renewModal, document.querySelector('input[name="renewal-plan"]:checked')?.value)}
                className="inline-flex items-center justify-center whitespace-nowrap rounded-md bg-primary text-primary-foreground hover:bg-primary/90 h-10 px-6 text-sm font-medium"
              >
                Process Payment
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default AffiliateAdsManagement;
