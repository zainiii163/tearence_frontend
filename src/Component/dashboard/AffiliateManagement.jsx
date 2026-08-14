import React, { useState, useEffect, useMemo } from 'react';
import { useSearchParams, Link } from 'react-router-dom';
import { useSelector } from 'react-redux';
import { motion } from 'framer-motion';
import affiliateService from '../../services/AffiliateService';
import { extractListItems } from '../../utils/apiResponseHelpers';
import AffiliateModalForm from '../affiliates/AffiliateModalForm';
import DurationExtendPanel from '../Promo/DurationExtendPanel';
import toast from 'react-hot-toast';
import DashboardListThumbnail from './DashboardListThumbnail';
import {
  FaBriefcase,
  FaUser,
  FaEye,
  FaExternalLinkAlt,
  FaEdit,
  FaTrash,
  FaPlus,
  FaSearch,
  FaCheckCircle,
  FaTimesCircle,
  FaClock,
  FaCopy,
  FaDollarSign,
  FaWallet,
} from 'react-icons/fa';
import AffiliateEarningsPanel from '../affiliates/AffiliateEarningsPanel';
import AffiliateSellerAttribution from '../affiliates/AffiliateSellerAttribution';
import BusinessAffiliateMoneyPanel from '../affiliates/BusinessAffiliateMoneyPanel';
import BusinessAdvertsInventoryPanel from '../affiliates/BusinessAdvertsInventoryPanel';
import { isBasicAccount } from '../../utils/accountType';

const SELLER_TABS = new Set(['business', 'user', 'business-money', 'adverts']);

const AffiliateManagement = ({ openCreateOnMount = false, onCreateOpened }) => {
  const [searchParams] = useSearchParams();
  const { userDetail } = useSelector((store) => store.auth);
  // Account type is source of truth; mode=buying is a secondary signal
  const isPromoterOnly = useMemo(
    () => isBasicAccount(userDetail) || searchParams.get('mode') === 'buying',
    [userDetail, searchParams]
  );
  const [activeTab, setActiveTab] = useState(() => {
    const mode = searchParams.get('mode'); // account mode: buying | selling (do not confuse)
    const sub = searchParams.get('sub');
    const promoterOnly = isBasicAccount() || mode === 'buying';
    if (sub === 'earnings' || mode === 'earnings') return 'earnings';
    if (!promoterOnly && (sub === 'money' || mode === 'money')) return 'business-money';
    if (!promoterOnly && (sub === 'adverts' || mode === 'adverts')) return 'adverts';
    if (sub === 'promoting' || sub === 'affiliate' || mode === 'promoting' || mode === 'affiliate') {
      return 'promoting';
    }
    if (!promoterOnly && (sub === 'selling' || sub === 'business' || mode === 'selling' || mode === 'business')) {
      return 'business';
    }
    if (!promoterOnly && (sub === 'links' || mode === 'links' || mode === 'user')) return 'user';
    // Basic / buying account → promoter view by default
    if (promoterOnly) return 'promoting';
    return 'business';
  });
  const [businessOffers, setBusinessOffers] = useState([]);
  const [userPosts, setUserPosts] = useState([]);
  const [myPromotions, setMyPromotions] = useState([]);
  const [earnings, setEarnings] = useState(null);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterStatus, setFilterStatus] = useState('all');
  const [showForm, setShowForm] = useState(false);
  const [categories, setCategories] = useState([]);
  const [editItem, setEditItem] = useState(null);
  const [editType, setEditType] = useState(null);
  const [editId, setEditId] = useState(null);
  const [createMode, setCreateMode] = useState('business');
  const [expandedApplicantsOfferId, setExpandedApplicantsOfferId] = useState(null);
  const [offerApplicants, setOfferApplicants] = useState({});
  const [loadingApplicants, setLoadingApplicants] = useState(false);
  const [expandedConversionsOfferId, setExpandedConversionsOfferId] = useState(null);
  const [offerConversions, setOfferConversions] = useState({});
  const [reportSale, setReportSale] = useState(null); // { offerId, trackingCode, amount, orderId }
  const [reportingSale, setReportingSale] = useState(false);

  useEffect(() => {
    loadData();
    affiliateService.getCategories().then((res) => {
      setCategories(res?.data?.data || res?.data || []);
    }).catch(() => setCategories([]));
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isPromoterOnly]);

  // Keep inner affiliate tab in sync when landing from marketplace links (?sub=)
  useEffect(() => {
    const mode = searchParams.get('mode');
    const sub = searchParams.get('sub');
    const promoterOnly = isPromoterOnly;
    if (sub === 'earnings' || mode === 'earnings') setActiveTab('earnings');
    else if (!promoterOnly && (sub === 'money' || mode === 'money')) setActiveTab('business-money');
    else if (!promoterOnly && (sub === 'adverts' || mode === 'adverts')) setActiveTab('adverts');
    else if (sub === 'promoting' || sub === 'affiliate' || mode === 'promoting' || mode === 'affiliate') {
      setActiveTab('promoting');
    } else if (!promoterOnly && (sub === 'selling' || sub === 'business')) setActiveTab('business');
    else if (!promoterOnly && sub === 'links') setActiveTab('user');
    else if (promoterOnly) setActiveTab('promoting');
  }, [searchParams, isPromoterOnly]);

  // Never leave basic users on seller-only tabs
  useEffect(() => {
    if (isPromoterOnly && SELLER_TABS.has(activeTab)) {
      setActiveTab('promoting');
    }
  }, [isPromoterOnly, activeTab]);

  useEffect(() => {
    if (openCreateOnMount && !isPromoterOnly) {
      setEditItem(null);
      setEditId(null);
      setCreateMode('business');
      setShowForm(true);
      onCreateOpened?.();
    }
  }, [openCreateOnMount, onCreateOpened, isPromoterOnly]);

  const loadData = async () => {
    try {
      setLoading(true);
      if (isPromoterOnly) {
        const [appsResponse, earningsResponse] = await Promise.all([
          affiliateService.getMyApplications({ per_page: 50 }).catch(() => ({ data: [] })),
          affiliateService.getMyEarnings().catch(() => null),
        ]);
        setBusinessOffers([]);
        setUserPosts([]);
        setMyPromotions(extractListItems(appsResponse));
        setEarnings(earningsResponse?.data || null);
      } else {
        const [businessResponse, userResponse, appsResponse, earningsResponse] = await Promise.all([
          affiliateService.getMyBusinessOffers({ per_page: 50 }),
          affiliateService.getMyUserPosts({ per_page: 50 }),
          affiliateService.getMyApplications({ per_page: 50 }).catch(() => ({ data: [] })),
          affiliateService.getMyEarnings().catch(() => null),
        ]);

        setBusinessOffers(extractListItems(businessResponse));
        setUserPosts(extractListItems(userResponse));
        setMyPromotions(extractListItems(appsResponse));
        setEarnings(earningsResponse?.data || null);
      }
    } catch (error) {
      console.error('Error loading affiliate data:', error);
      toast.error('Failed to load affiliate data');
    } finally {
      setLoading(false);
    }
  };

  const loadOfferApplicants = async (offerId) => {
    if (expandedApplicantsOfferId === offerId) {
      setExpandedApplicantsOfferId(null);
      return;
    }
    setExpandedApplicantsOfferId(offerId);
    await fetchOfferApplicants(offerId);
  };

  const fetchOfferApplicants = async (offerId) => {
    if (offerApplicants[offerId]) return offerApplicants[offerId];
    try {
      setLoadingApplicants(true);
      const res = await affiliateService.getOfferApplications(offerId, { per_page: 50 });
      const rows = extractListItems(res);
      setOfferApplicants((prev) => ({
        ...prev,
        [offerId]: rows,
      }));
      return rows;
    } catch (error) {
      console.error(error);
      toast.error('Failed to load applicants');
      return [];
    } finally {
      setLoadingApplicants(false);
    }
  };

  const handleApproveApplicant = async (offerId, applicationId) => {
    try {
      await affiliateService.approveApplication(applicationId);
      toast.success('Applicant approved — hop link minted');
      const res = await affiliateService.getOfferApplications(offerId, { per_page: 50 });
      setOfferApplicants((prev) => ({
        ...prev,
        [offerId]: extractListItems(res),
      }));
    } catch (error) {
      toast.error(error?.message || 'Approve failed');
    }
  };

  const handleRejectApplicant = async (offerId, applicationId) => {
    const reason = window.prompt('Rejection reason (optional):') || '';
    try {
      await affiliateService.rejectApplication(applicationId, reason);
      toast.success('Applicant rejected');
      const res = await affiliateService.getOfferApplications(offerId, { per_page: 50 });
      setOfferApplicants((prev) => ({
        ...prev,
        [offerId]: extractListItems(res),
      }));
    } catch (error) {
      toast.error(error?.message || 'Reject failed');
    }
  };

  const loadOfferConversions = async (offerId) => {
    if (expandedConversionsOfferId === offerId) {
      setExpandedConversionsOfferId(null);
      return;
    }
    setExpandedConversionsOfferId(offerId);
    if (offerConversions[offerId]) return;
    try {
      const res = await affiliateService.getOfferConversions(offerId, { per_page: 20 });
      const rows = res?.data?.data || res?.data?.items || extractListItems(res) || [];
      setOfferConversions((prev) => ({ ...prev, [offerId]: rows }));
    } catch (error) {
      toast.error(error?.message || 'Failed to load conversions');
    }
  };

  const openReportSale = async (offer, preferredCode = '') => {
    const rows = await fetchOfferApplicants(offer.id);
    const approved = (rows || []).filter((a) => a.status === 'approved' && a.tracking_code);
    setReportSale({
      offerId: offer.id,
      trackingCode: preferredCode || approved[0]?.tracking_code || '',
      amount: '',
      orderId: '',
      promoters: approved,
    });
  };

  const submitReportSale = async (e) => {
    e.preventDefault();
    if (!reportSale?.trackingCode) {
      toast.error('Select or enter a tracking code');
      return;
    }
    const offerId = reportSale.offerId;
    setReportingSale(true);
    try {
      const res = await affiliateService.recordConversion({
        tracking_code: reportSale.trackingCode,
        amount: parseFloat(reportSale.amount) || 0,
        order_id: reportSale.orderId || undefined,
        offer_id: offerId,
      });
      toast.success(
        `Sale recorded — commission $${Number(res?.data?.commission || 0).toFixed(2)}`
      );
      setReportSale(null);
      setOfferConversions((prev) => {
        const next = { ...prev };
        delete next[offerId];
        return next;
      });
      await loadData();
      if (expandedConversionsOfferId === offerId) {
        setExpandedConversionsOfferId(null);
        await loadOfferConversions(offerId);
      }
    } catch (error) {
      toast.error(error?.message || 'Could not record sale');
    } finally {
      setReportingSale(false);
    }
  };

  const handleDeleteBusinessOffer = async (id) => {
    if (!window.confirm('Are you sure you want to delete this business offer?')) return;

    try {
      await affiliateService.deleteBusinessOffer(id);
      toast.success('Business offer deleted successfully');
      setBusinessOffers(prev => prev.filter(offer => offer.id !== id));
    } catch (error) {
      console.error('Error deleting business offer:', error);
      toast.error('Failed to delete business offer');
    }
  };

  const handleDeleteUserPost = async (id) => {
    if (!window.confirm('Are you sure you want to delete this post?')) return;

    try {
      await affiliateService.deleteUserPost(id);
      toast.success('Post deleted successfully');
      setUserPosts(prev => prev.filter(post => post.id !== id));
    } catch (error) {
      console.error('Error deleting post:', error);
      toast.error('Failed to delete post');
    }
  };

  const getStatusBadge = (status) => {
    switch (status) {
      case 'approved':
        return <span className="px-2 py-1 text-xs font-semibold text-green-700 bg-green-100 rounded-full flex items-center gap-1"><FaCheckCircle /> Approved</span>;
      case 'pending':
        return <span className="px-2 py-1 text-xs font-semibold text-yellow-700 bg-yellow-100 rounded-full flex items-center gap-1"><FaClock /> Pending</span>;
      case 'rejected':
        return <span className="px-2 py-1 text-xs font-semibold text-red-700 bg-red-100 rounded-full flex items-center gap-1"><FaTimesCircle /> Rejected</span>;
      default:
        return <span className="px-2 py-1 text-xs font-semibold text-gray-700 bg-gray-100 rounded-full">{status}</span>;
    }
  };

  const filteredBusinessOffers = businessOffers.filter(offer => {
    const matchesSearch = 
      offer.business_name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      offer.product_service_title?.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus = filterStatus === 'all' || offer.status === filterStatus;
    return matchesSearch && matchesStatus;
  });

  const filteredUserPosts = userPosts.filter(post => {
    const matchesSearch = 
      post.title?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      post.description?.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus = filterStatus === 'all' || post.status === filterStatus;
    return matchesSearch && matchesStatus;
  });

  const stats = {
    business: {
      total: businessOffers.length,
      active: businessOffers.filter(o => o.status === 'approved').length,
      pending: businessOffers.filter(o => o.status === 'pending').length,
      views: businessOffers.reduce((sum, o) => sum + (o.views || 0), 0),
      clicks: businessOffers.reduce((sum, o) => sum + (o.clicks || 0), 0)
    },
    user: {
      total: userPosts.length,
      active: userPosts.filter(p => p.status === 'approved').length,
      pending: userPosts.filter(p => p.status === 'pending').length,
      views: userPosts.reduce((sum, p) => sum + (p.views || 0), 0),
      clicks: userPosts.reduce((sum, p) => sum + (p.clicks || 0), 0)
    },
    promoting: {
      programs: earnings?.totals?.programs ?? myPromotions.filter((a) => a.status === 'approved').length,
      clicks: earnings?.totals?.clicks ?? myPromotions.reduce((s, a) => s + (a.clicks_count || 0), 0),
      conversions:
        earnings?.totals?.conversions ??
        myPromotions.reduce((s, a) => s + (a.conversions_count || 0), 0),
      earnings:
        earnings?.totals?.earnings ??
        myPromotions.reduce((s, a) => s + Number(a.earnings_total || 0), 0),
    },
  };

  return (
    <div className="p-4 md:p-6">
      {/* Header — promoter-only for Basic; seller tools for Business */}
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 mb-6">
        <div>
          <h2 className="font-display text-2xl font-semibold text-slate-900 tracking-tight">
            {isPromoterOnly ? 'My promotions' : 'Affiliate marketplace'}
          </h2>
          <p className="text-slate-600 mt-1 text-sm leading-relaxed max-w-xl">
            {isPromoterOnly
              ? 'Promote approved offers with your hop link and earn commission when buyers convert.'
              : 'Sell products & services as a business, or promote offers with your hop link and earn commission.'}
          </p>
          <div className="mt-2 flex flex-wrap gap-3 text-xs">
            <a href="/affiliates" className="font-semibold text-primary hover:underline">
              Affiliate Ads →
            </a>
            <a href="/affiliates/marketplace" className="font-semibold text-primary hover:underline">
              Marketplace →
            </a>
            <a href="/affiliates/courses" className="font-semibold text-primary hover:underline">
              Courses →
            </a>
          </div>
        </div>
        {!isPromoterOnly && (
          <div className="flex flex-wrap gap-2">
            <button
              type="button"
              onClick={() => {
                setEditItem(null);
                setEditId(null);
                setCreateMode('business');
                setActiveTab('business');
                setShowForm(true);
              }}
              className="inline-flex items-center gap-2 px-4 py-2.5 bg-primary text-white rounded-xl hover:bg-primary/90 transition-colors text-sm font-semibold shadow-sm"
            >
              <FaPlus /> List product / service
            </button>
            <button
              type="button"
              onClick={() => {
                setEditItem(null);
                setEditId(null);
                setCreateMode('user');
                setActiveTab('user');
                setShowForm(true);
              }}
              className="inline-flex items-center gap-2 px-4 py-2.5 border border-slate-200 bg-white text-slate-800 rounded-xl hover:bg-slate-50 transition-colors text-sm font-semibold"
            >
              <FaPlus /> Post link ad
            </button>
          </div>
        )}
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
        <div className="bg-white rounded-xl border border-slate-200 shadow-soft p-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-slate-600">Programs promoting</p>
              <p className="text-2xl font-bold text-slate-900">{stats.promoting.programs}</p>
            </div>
            <FaBriefcase className="text-3xl text-primary/70" />
          </div>
        </div>
        <div className="bg-white rounded-xl border border-slate-200 shadow-soft p-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-slate-600">Hop clicks</p>
              <p className="text-2xl font-bold text-slate-900">{stats.promoting.clicks}</p>
            </div>
            <FaExternalLinkAlt className="text-3xl text-amber-500" />
          </div>
        </div>
        <div className="bg-white rounded-xl border border-slate-200 shadow-soft p-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-slate-600">Conversions</p>
              <p className="text-2xl font-bold text-slate-900">{stats.promoting.conversions}</p>
            </div>
            <FaCheckCircle className="text-3xl text-emerald-500" />
          </div>
        </div>
        <button
          type="button"
          onClick={() => setActiveTab('earnings')}
          className="bg-white rounded-xl border border-slate-200 shadow-soft p-4 text-left hover:border-primary/40 transition-colors"
        >
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-slate-600">Your earnings</p>
              <p className="text-2xl font-bold text-slate-900">
                ${Number(stats.promoting.earnings || 0).toFixed(2)}
              </p>
              <p className="text-[11px] text-primary font-semibold mt-1">View ledger →</p>
            </div>
            <FaDollarSign className="text-3xl text-green-500" />
          </div>
        </button>
      </div>

      {/* Tabs — Basic: Promoting + earnings only */}
      <div className="bg-white rounded-lg shadow mb-6">
        <div className="border-b border-gray-200 overflow-x-auto">
          <nav className="flex -mb-px min-w-max">
            {!isPromoterOnly && (
              <button
                onClick={() => setActiveTab('business')}
                className={`px-5 py-4 font-medium transition-colors ${
                  activeTab === 'business'
                    ? 'border-b-2 border-primary text-primary'
                    : 'text-gray-500 hover:text-gray-700'
                }`}
              >
                <FaBriefcase className="inline mr-2" />
                Seller programs ({stats.business.total})
              </button>
            )}
            {!isPromoterOnly && (
              <button
                onClick={() => setActiveTab('user')}
                className={`px-5 py-4 font-medium transition-colors ${
                  activeTab === 'user'
                    ? 'border-b-2 border-primary text-primary'
                    : 'text-gray-500 hover:text-gray-700'
                }`}
              >
                <FaUser className="inline mr-2" />
                Link ads ({stats.user.total})
              </button>
            )}
            <button
              type="button"
              onClick={() => setActiveTab('promoting')}
              className={`px-5 py-4 font-medium transition-colors ${
                activeTab === 'promoting'
                  ? 'border-b-2 border-primary text-primary'
                  : 'text-gray-500 hover:text-gray-700'
              }`}
            >
              <FaExternalLinkAlt className="inline mr-2" />
              Promoting ({myPromotions.length})
            </button>
            <button
              type="button"
              onClick={() => setActiveTab('earnings')}
              className={`px-5 py-4 font-medium transition-colors ${
                activeTab === 'earnings'
                  ? 'border-b-2 border-primary text-primary'
                  : 'text-gray-500 hover:text-gray-700'
              }`}
            >
              <FaWallet className="inline mr-2" />
              Promoter earnings
            </button>
            {!isPromoterOnly && (
              <button
                type="button"
                onClick={() => setActiveTab('business-money')}
                className={`px-5 py-4 font-medium transition-colors ${
                  activeTab === 'business-money'
                    ? 'border-b-2 border-primary text-primary'
                    : 'text-gray-500 hover:text-gray-700'
                }`}
              >
                <FaDollarSign className="inline mr-2" />
                Business sales &amp; payouts
              </button>
            )}
            {!isPromoterOnly && (
              <button
                type="button"
                onClick={() => setActiveTab('adverts')}
                className={`px-5 py-4 font-medium transition-colors ${
                  activeTab === 'adverts'
                    ? 'border-b-2 border-primary text-primary'
                    : 'text-gray-500 hover:text-gray-700'
                }`}
              >
                <FaBriefcase className="inline mr-2" />
                Adverts &amp; expiry
              </button>
            )}
          </nav>
        </div>

        {/* Filters — hide on ledger-style tabs */}
        {activeTab !== 'earnings' &&
          activeTab !== 'business-money' &&
          activeTab !== 'adverts' && (
        <div className="p-4 border-b border-gray-200">
          <div className="flex flex-col md:flex-row gap-4">
            <div className="flex-1 relative">
              <FaSearch className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
              <input
                type="text"
                placeholder="Search..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary/30 focus:border-transparent"
              />
            </div>
            <select
              value={filterStatus}
              onChange={(e) => setFilterStatus(e.target.value)}
              className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary/30 focus:border-transparent"
            >
              <option value="all">All Status</option>
              <option value="approved">Approved</option>
              <option value="pending">Pending</option>
              <option value="rejected">Rejected</option>
            </select>
          </div>
        </div>
        )}

        {/* Content */}
        <div className="p-4">
          {activeTab === 'earnings' ? (
            <AffiliateEarningsPanel />
          ) : activeTab === 'business-money' ? (
            <BusinessAffiliateMoneyPanel />
          ) : activeTab === 'adverts' ? (
            <BusinessAdvertsInventoryPanel />
          ) : loading ? (
            <div className="text-center py-8">
              <div className="inline-block animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
              <p className="mt-2 text-gray-600">Loading...</p>
            </div>
          ) : activeTab === 'business' ? (
            <div className="space-y-4">
              {filteredBusinessOffers.length === 0 ? (
                <div className="text-center py-8 text-gray-500">
                  <p>No business offers found</p>
                  <a href="/affiliates/marketplace?postForm=true&mode=business" className="text-blue-600 hover:underline">
                    Create your first business offer
                  </a>
                </div>
              ) : (
                filteredBusinessOffers.map(offer => (
                  <motion.div
                    key={offer.id}
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="border border-gray-200 rounded-lg p-4 hover:shadow-md transition-shadow"
                  >
                    <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
                      <DashboardListThumbnail item={offer} fallback={FaBriefcase} className="h-14 w-14" />
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-3 mb-2">
                          <h3 className="font-semibold text-gray-900">{offer.product_service_title}</h3>
                          {getStatusBadge(offer.status)}
                        </div>
                        <p className="text-sm text-gray-600 mb-1">{offer.business_name}</p>
                        <p className="text-sm text-gray-500 line-clamp-2">{offer.description}</p>
                        <div className="flex items-center gap-4 mt-2 text-sm text-gray-500">
                          <span className="flex items-center gap-1">
                            <FaEye /> {offer.views || 0} views
                          </span>
                          <span className="flex items-center gap-1">
                            <FaExternalLinkAlt /> {offer.clicks || 0} clicks
                          </span>
                          <span className="font-semibold text-green-600">
                            {offer.commission_rate}{offer.commission_type === 'percentage' ? '%' : '$'} commission
                          </span>
                          {offer.cookie_duration != null && (
                            <span className="text-violet-700">
                              {offer.cookie_duration}-day cookie
                            </span>
                          )}
                        </div>
                      </div>
                      <div className="flex items-center gap-2 mt-4 md:mt-0 flex-wrap justify-end">
                        <button
                          type="button"
                          onClick={() => loadOfferApplicants(offer.id)}
                          className="px-3 py-2 text-sm text-violet-700 hover:bg-violet-50 rounded-lg transition-colors border border-violet-200"
                          title="Applicants"
                        >
                          Applicants
                        </button>
                        <button
                          type="button"
                          onClick={() => openReportSale(offer)}
                          className="px-3 py-2 text-sm text-emerald-800 hover:bg-emerald-50 rounded-lg border border-emerald-200"
                        >
                          Report sale
                        </button>
                        <button
                          type="button"
                          onClick={() => loadOfferConversions(offer.id)}
                          className="px-3 py-2 text-sm text-slate-700 hover:bg-slate-50 rounded-lg border border-slate-200"
                        >
                          Conversions
                        </button>
                        <a
                          href={offer.tracking_link}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="p-2 text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
                          title="Destination URL"
                        >
                          <FaExternalLinkAlt />
                        </a>
                        <button
                          type="button"
                          onClick={() => {
                            setEditItem(offer);
                            setEditType('business');
                            setEditId(offer.id);
                            setShowForm(true);
                          }}
                          className="p-2 text-gray-600 hover:bg-gray-100 rounded-lg transition-colors"
                          title="Edit"
                        >
                          <FaEdit />
                        </button>
                        <button
                          onClick={() => handleDeleteBusinessOffer(offer.id)}
                          className="p-2 text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                          title="Delete"
                        >
                          <FaTrash />
                        </button>
                      </div>
                    </div>
                    <AffiliateSellerAttribution
                      offer={offer}
                      onTokenRotated={(offerId, next) => {
                        setBusinessOffers((prev) =>
                          prev.map((o) =>
                            o.id === offerId
                              ? {
                                  ...o,
                                  postback_token: next.postback_token || o.postback_token,
                                  postback_url: next.postback_url || o.postback_url,
                                }
                              : o
                          )
                        );
                      }}
                    />
                    {expandedApplicantsOfferId === offer.id && (
                      <div className="mt-3 rounded-lg border border-violet-100 bg-violet-50/40 p-3">
                        <p className="text-sm font-semibold text-violet-900 mb-2">Applicants</p>
                        {loadingApplicants && !offerApplicants[offer.id] ? (
                          <p className="text-sm text-gray-500">Loading…</p>
                        ) : (offerApplicants[offer.id] || []).length === 0 ? (
                          <p className="text-sm text-gray-500">No applicants yet.</p>
                        ) : (
                          <ul className="space-y-2">
                            {(offerApplicants[offer.id] || []).map((app) => {
                              const name =
                                app.user?.name ||
                                [app.user?.first_name, app.user?.last_name].filter(Boolean).join(' ') ||
                                `User #${app.user_id}`;
                              return (
                                <li
                                  key={app.id}
                                  className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2 rounded-md bg-white border border-violet-100 px-3 py-2 text-sm"
                                >
                                  <div>
                                    <span className="font-medium text-gray-900">{name}</span>
                                    <span className="ml-2">{getStatusBadge(app.status)}</span>
                                    {app.website_url && (
                                      <p className="text-xs text-gray-500 mt-1">
                                        Web: {app.website_url}
                                      </p>
                                    )}
                                    {Array.isArray(app.social_media_links) &&
                                      app.social_media_links.length > 0 && (
                                        <p className="text-xs text-gray-500 mt-1">
                                          Socials:{' '}
                                          {app.social_media_links
                                            .map((s) =>
                                              typeof s === 'string'
                                                ? s
                                                : `${s.platform || 'link'}: ${s.url || ''}`
                                            )
                                            .join(' · ')}
                                        </p>
                                      )}
                                    {app.hop_url && (
                                      <p className="text-xs text-gray-500 break-all mt-1">{app.hop_url}</p>
                                    )}
                                  </div>
                                  {app.status === 'pending' && (
                                    <div className="flex gap-2 shrink-0">
                                      <button
                                        type="button"
                                        onClick={() => handleApproveApplicant(offer.id, app.id)}
                                        className="px-2 py-1 text-xs rounded bg-emerald-600 text-white hover:bg-emerald-700"
                                      >
                                        Approve
                                      </button>
                                      <button
                                        type="button"
                                        onClick={() => handleRejectApplicant(offer.id, app.id)}
                                        className="px-2 py-1 text-xs rounded bg-red-600 text-white hover:bg-red-700"
                                      >
                                        Reject
                                      </button>
                                    </div>
                                  )}
                                  {app.status === 'approved' && app.tracking_code && (
                                    <button
                                      type="button"
                                      onClick={() => openReportSale(offer, app.tracking_code)}
                                      className="px-2 py-1 text-xs rounded border border-emerald-200 text-emerald-800"
                                    >
                                      Report sale
                                    </button>
                                  )}
                                </li>
                              );
                            })}
                          </ul>
                        )}
                      </div>
                    )}
                    {expandedConversionsOfferId === offer.id && (
                      <div className="mt-3 rounded-lg border border-emerald-100 bg-emerald-50/40 p-3">
                        <p className="text-sm font-semibold text-emerald-900 mb-2">
                          Recent conversions
                        </p>
                        {(offerConversions[offer.id] || []).length === 0 ? (
                          <p className="text-sm text-gray-500">No conversions recorded yet.</p>
                        ) : (
                          <ul className="space-y-1.5 text-sm">
                            {(offerConversions[offer.id] || []).map((c) => (
                              <li
                                key={c.id}
                                className="flex flex-wrap justify-between gap-2 rounded bg-white border border-emerald-100 px-3 py-2"
                              >
                                <span className="font-mono text-xs text-slate-600">
                                  {c.tracking_code}
                                  {c.order_id ? ` · order ${c.order_id}` : ''}
                                </span>
                                <span className="text-emerald-800 font-medium">
                                  ${Number(c.commission_amount || 0).toFixed(2)} on $
                                  {Number(c.sale_amount || 0).toFixed(2)}
                                </span>
                              </li>
                            ))}
                          </ul>
                        )}
                      </div>
                    )}
                    <div className="mt-3">
                      <DurationExtendPanel
                        type="affiliate_offer"
                        id={offer.id}
                        currentExpiresAt={offer.expires_at}
                        onExtended={(updated) => {
                          setBusinessOffers((prev) =>
                            prev.map((o) => (o.id === offer.id ? { ...o, ...updated } : o))
                          );
                          toast.success('Live duration updated');
                        }}
                      />
                    </div>
                  </motion.div>
                ))
              )}
            </div>
          ) : activeTab === 'promoting' ? (
            <div className="space-y-4">
              <div className="rounded-xl border border-sky-100 bg-sky-50/50 px-4 py-3 text-sm text-slate-700">
                <p className="font-semibold text-slate-900">Promoter dashboard</p>
                <p className="mt-0.5 text-xs sm:text-sm text-slate-600">
                  Share your hop link. When buyers purchase using that link, you earn the % the
                  business offered. See product sales and request payouts under{' '}
                  <button
                    type="button"
                    className="font-semibold text-primary hover:underline"
                    onClick={() => setActiveTab('earnings')}
                  >
                    Promoter earnings
                  </button>
                  .
                </p>
              </div>
              {myPromotions.length === 0 ? (
                <div className="text-center py-8 text-gray-500">
                  <p>You are not promoting any programs yet.</p>
                  <a href="/affiliates/marketplace" className="text-primary hover:underline">
                    Browse Marketplace programs
                  </a>
                </div>
              ) : (
                myPromotions.map((app) => {
                  const offer = app.business_affiliate_offer || app.businessAffiliateOffer || {};
                  const hop =
                    app.hop_url ||
                    app.promoter_link ||
                    (app.tracking_code
                      ? `https://api.worldwideadverts.info/go/aff/${app.tracking_code}`
                      : null);
                  const cookieDays = offer.cookie_duration;
                  const conversions = Number(app.conversions_count || app.conversions || 0);
                  const salesVolume = Number(
                    app.sales_volume ||
                      app.total_sale_amount ||
                      (Array.isArray(app.recent_conversions)
                        ? app.recent_conversions.reduce(
                            (s, r) => s + Number(r.sale_amount || r.amount || 0),
                            0
                          )
                        : 0)
                  );
                  return (
                    <div
                      key={app.id}
                      className="border border-sky-100 rounded-lg p-4 bg-sky-50/40"
                    >
                      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-3">
                        <div className="min-w-0">
                          <h3 className="font-semibold text-gray-900">
                            {offer.product_service_title || offer.business_name || 'Program'}
                          </h3>
                          <p className="text-sm text-gray-600">{offer.business_name}</p>
                          <div className="flex flex-wrap gap-3 mt-2 text-xs text-gray-500">
                            {getStatusBadge(app.status)}
                            <span>Clicks: {app.clicks_count || 0}</span>
                            <span className="font-semibold text-slate-800">
                              Products sold: {conversions}
                            </span>
                            {salesVolume > 0 && (
                              <span>Sales volume: ${salesVolume.toFixed(2)}</span>
                            )}
                            <span className="font-semibold text-emerald-700">
                              Earnings: ${Number(app.earnings_total || 0).toFixed(2)}
                            </span>
                            {cookieDays != null && (
                              <span className="text-primary">{cookieDays}-day cookie</span>
                            )}
                            {offer.commission_rate != null && (
                              <span>
                                You earn {offer.commission_rate}
                                {offer.commission_type === 'percentage' ||
                                offer.commission_type === 'percent'
                                  ? '%'
                                  : '$'}{' '}
                                per sale
                              </span>
                            )}
                          </div>
                          {hop && (
                            <div className="mt-2 flex items-start gap-2">
                              <p className="flex-1 text-xs break-all text-slate-600 bg-white border rounded px-2 py-1.5 font-mono">
                                {hop}
                              </p>
                              <button
                                type="button"
                                className="p-2 text-primary hover:bg-white rounded border border-sky-100"
                                title="Copy hop link"
                                onClick={async () => {
                                  try {
                                    await navigator.clipboard.writeText(hop);
                                    toast.success('Hop link copied');
                                  } catch {
                                    toast.error('Copy failed');
                                  }
                                }}
                              >
                                <FaCopy />
                              </button>
                            </div>
                          )}
                        </div>
                        <div className="flex gap-2 shrink-0">
                          {hop && (
                            <button
                              type="button"
                              onClick={async () => {
                                try {
                                  await navigator.clipboard.writeText(hop);
                                  toast.success('Tracking link copied');
                                } catch {
                                  toast.error('Copy failed');
                                }
                              }}
                              className="px-3 py-2 text-sm rounded-lg bg-primary text-white hover:bg-primary/90"
                            >
                              Copy link
                            </button>
                          )}
                          <button
                            type="button"
                            onClick={() => setActiveTab('earnings')}
                            className="px-3 py-2 text-sm rounded-lg border border-sky-200 text-primary hover:bg-white"
                          >
                            View sales
                          </button>
                          {offer.id && (
                            <a
                              href={`/affiliates/offer/${offer.id}`}
                              className="px-3 py-2 text-sm rounded-lg border border-sky-200 text-primary hover:bg-white"
                            >
                              View offer
                            </a>
                          )}
                        </div>
                      </div>
                    </div>
                  );
                })
              )}
            </div>
          ) : (
            <div className="space-y-4">
              {filteredUserPosts.length === 0 ? (
                <div className="text-center py-8 text-gray-500">
                  <p>No affiliate posts found</p>
                  <Link
                    to="/affiliates?postForm=true&mode=user"
                    className="text-blue-600 hover:underline"
                  >
                    Create your first affiliate post
                  </Link>
                </div>
              ) : (
                filteredUserPosts.map(post => (
                  <motion.div
                    key={post.id}
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="border border-gray-200 rounded-lg p-4 hover:shadow-md transition-shadow"
                  >
                    <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
                      <DashboardListThumbnail item={post} fallback={FaUser} className="h-14 w-14" />
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-3 mb-2">
                          <h3 className="font-semibold text-gray-900">{post.title}</h3>
                          {getStatusBadge(post.status)}
                        </div>
                        <p className="text-sm text-gray-500 line-clamp-2">{post.description}</p>
                        <div className="flex items-center gap-4 mt-2 text-sm text-gray-500">
                          <span className="flex items-center gap-1">
                            <FaEye /> {post.views || 0} views
                          </span>
                          <span className="flex items-center gap-1">
                            <FaExternalLinkAlt /> {post.clicks || 0} clicks
                          </span>
                          {post.affiliate_category && (
                            <span className="text-gray-400">{post.affiliate_category.name}</span>
                          )}
                        </div>
                      </div>
                      <div className="flex items-center gap-2 mt-4 md:mt-0">
                        <a
                          href={post.affiliate_link}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="p-2 text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
                          title="View Link"
                        >
                          <FaExternalLinkAlt />
                        </a>
                        <button
                          type="button"
                          onClick={() => {
                            setEditItem(post);
                            setEditType('user');
                            setEditId(post.id);
                            setShowForm(true);
                          }}
                          className="p-2 text-gray-600 hover:bg-gray-100 rounded-lg transition-colors"
                          title="Edit"
                        >
                          <FaEdit />
                        </button>
                        <button
                          onClick={() => handleDeleteUserPost(post.id)}
                          className="p-2 text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                          title="Delete"
                        >
                          <FaTrash />
                        </button>
                      </div>
                    </div>
                    <div className="mt-3">
                      <DurationExtendPanel
                        type="affiliate_post"
                        id={post.id}
                        currentExpiresAt={post.expires_at}
                        onExtended={(updated) => {
                          setUserPosts((prev) =>
                            prev.map((p) => (p.id === post.id ? { ...p, ...updated } : p))
                          );
                          toast.success('Live duration updated');
                        }}
                      />
                    </div>
                  </motion.div>
                ))
              )}
            </div>
          )}
        </div>
      </div>

      {showForm && (
        <AffiliateModalForm
          categories={categories}
          editItem={editItem}
          editType={editType || createMode}
          editId={editId}
          onClose={() => {
            setShowForm(false);
            setEditItem(null);
            setEditId(null);
          }}
          onSubmissionSuccess={() => {
            setShowForm(false);
            setEditItem(null);
            setEditId(null);
            loadData();
          }}
        />
      )}

      {reportSale && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 p-4">
          <div className="w-full max-w-md rounded-xl bg-white shadow-xl p-5">
            <h3 className="text-lg font-semibold text-slate-900">Report a sale</h3>
            <p className="text-sm text-slate-500 mt-1">
              Attribute a purchase to a promoter hop link within the cookie window.
            </p>
            <form onSubmit={submitReportSale} className="mt-4 space-y-3">
              {reportSale.promoters?.length > 0 ? (
                <label className="block text-sm">
                  <span className="text-slate-700 font-medium">Promoter tracking code</span>
                  <select
                    className="mt-1 w-full rounded-lg border border-slate-200 px-3 py-2"
                    value={reportSale.trackingCode}
                    onChange={(e) =>
                      setReportSale((prev) => ({ ...prev, trackingCode: e.target.value }))
                    }
                    required
                  >
                    <option value="">Select…</option>
                    {reportSale.promoters.map((p) => (
                      <option key={p.id} value={p.tracking_code}>
                        {p.tracking_code}
                        {p.user?.email ? ` · ${p.user.email}` : ''}
                      </option>
                    ))}
                  </select>
                </label>
              ) : (
                <label className="block text-sm">
                  <span className="text-slate-700 font-medium">Tracking code</span>
                  <input
                    className="mt-1 w-full rounded-lg border border-slate-200 px-3 py-2 font-mono text-sm"
                    value={reportSale.trackingCode}
                    onChange={(e) =>
                      setReportSale((prev) => ({ ...prev, trackingCode: e.target.value }))
                    }
                    required
                  />
                </label>
              )}
              <label className="block text-sm">
                <span className="text-slate-700 font-medium">Sale amount</span>
                <input
                  type="number"
                  min="0"
                  step="0.01"
                  className="mt-1 w-full rounded-lg border border-slate-200 px-3 py-2"
                  value={reportSale.amount}
                  onChange={(e) =>
                    setReportSale((prev) => ({ ...prev, amount: e.target.value }))
                  }
                  required
                />
              </label>
              <label className="block text-sm">
                <span className="text-slate-700 font-medium">Order ID (optional, prevents duplicates)</span>
                <input
                  className="mt-1 w-full rounded-lg border border-slate-200 px-3 py-2"
                  value={reportSale.orderId}
                  onChange={(e) =>
                    setReportSale((prev) => ({ ...prev, orderId: e.target.value }))
                  }
                />
              </label>
              <div className="flex justify-end gap-2 pt-2">
                <button
                  type="button"
                  onClick={() => setReportSale(null)}
                  className="px-3 py-2 text-sm rounded-lg border border-slate-200"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={reportingSale}
                  className="px-3 py-2 text-sm rounded-lg bg-emerald-600 text-white hover:bg-emerald-700 disabled:opacity-50"
                >
                  {reportingSale ? 'Saving…' : 'Record conversion'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default AffiliateManagement;
