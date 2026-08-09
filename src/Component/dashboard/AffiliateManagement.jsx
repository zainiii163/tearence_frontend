import React, { useState, useEffect } from 'react';
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
  FaClock
} from 'react-icons/fa';

const AffiliateManagement = ({ openCreateOnMount = false, onCreateOpened }) => {
  const [activeTab, setActiveTab] = useState('business'); // 'business' | 'user' | 'promoting'
  const [businessOffers, setBusinessOffers] = useState([]);
  const [userPosts, setUserPosts] = useState([]);
  const [myPromotions, setMyPromotions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterStatus, setFilterStatus] = useState('all');
  const [showForm, setShowForm] = useState(false);
  const [categories, setCategories] = useState([]);
  const [editItem, setEditItem] = useState(null);
  const [editType, setEditType] = useState(null);
  const [editId, setEditId] = useState(null);
  const [createMode, setCreateMode] = useState('business');

  useEffect(() => {
    loadData();
    affiliateService.getCategories().then((res) => {
      setCategories(res?.data?.data || res?.data || []);
    }).catch(() => setCategories([]));
  }, []);

  useEffect(() => {
    if (openCreateOnMount) {
      setEditItem(null);
      setEditId(null);
      setCreateMode('business');
      setShowForm(true);
      onCreateOpened?.();
    }
  }, [openCreateOnMount, onCreateOpened]);

  const loadData = async () => {
    try {
      setLoading(true);
      const [businessResponse, userResponse, appsResponse] = await Promise.all([
        affiliateService.getMyBusinessOffers({ per_page: 50 }),
        affiliateService.getMyUserPosts({ per_page: 50 }),
        affiliateService.getMyApplications({ per_page: 50 }).catch(() => ({ data: [] })),
      ]);

      setBusinessOffers(extractListItems(businessResponse));
      setUserPosts(extractListItems(userResponse));
      setMyPromotions(extractListItems(appsResponse));
    } catch (error) {
      console.error('Error loading affiliate data:', error);
      toast.error('Failed to load affiliate data');
    } finally {
      setLoading(false);
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
    }
  };

  return (
    <div className="p-6">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center md:justify-between mb-6">
        <div>
          <h2 className="text-2xl font-bold text-gray-900">Affiliate Management</h2>
          <p className="text-gray-600 mt-1">Manage your business offers and affiliate posts</p>
        </div>
        <button
          type="button"
          onClick={() => {
            setEditItem(null);
            setEditId(null);
            setCreateMode(activeTab === 'promoting' ? 'business' : activeTab);
            setShowForm(true);
          }}
          className="mt-4 md:mt-0 inline-flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
        >
          <FaPlus /> Create New
        </button>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
        <div className="bg-white rounded-lg shadow p-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600">Total Offers</p>
              <p className="text-2xl font-bold text-gray-900">{stats.business.total}</p>
            </div>
            <FaBriefcase className="text-3xl text-blue-500" />
          </div>
        </div>
        <div className="bg-white rounded-lg shadow p-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600">Total Posts</p>
              <p className="text-2xl font-bold text-gray-900">{stats.user.total}</p>
            </div>
            <FaUser className="text-3xl text-green-500" />
          </div>
        </div>
        <div className="bg-white rounded-lg shadow p-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600">Total Views</p>
              <p className="text-2xl font-bold text-gray-900">{stats.business.views + stats.user.views}</p>
            </div>
            <FaEye className="text-3xl text-purple-500" />
          </div>
        </div>
        <div className="bg-white rounded-lg shadow p-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600">Total Clicks</p>
              <p className="text-2xl font-bold text-gray-900">{stats.business.clicks + stats.user.clicks}</p>
            </div>
            <FaExternalLinkAlt className="text-3xl text-orange-500" />
          </div>
        </div>
      </div>

      {/* Tabs */}
      <div className="bg-white rounded-lg shadow mb-6">
        <div className="border-b border-gray-200">
          <nav className="flex -mb-px">
            <button
              onClick={() => setActiveTab('business')}
              className={`px-6 py-4 font-medium transition-colors ${
                activeTab === 'business'
                  ? 'border-b-2 border-blue-500 text-blue-600'
                  : 'text-gray-500 hover:text-gray-700'
              }`}
            >
              <FaBriefcase className="inline mr-2" />
              Business Offers ({stats.business.total})
            </button>
            <button
              onClick={() => setActiveTab('user')}
              className={`px-6 py-4 font-medium transition-colors ${
                activeTab === 'user'
                  ? 'border-b-2 border-green-500 text-green-600'
                  : 'text-gray-500 hover:text-gray-700'
              }`}
            >
              <FaUser className="inline mr-2" />
              User Posts ({stats.user.total})
            </button>
            <button
              type="button"
              onClick={() => setActiveTab('promoting')}
              className={`px-6 py-4 font-medium transition-colors ${
                activeTab === 'promoting'
                  ? 'border-b-2 border-violet-500 text-violet-600'
                  : 'text-gray-500 hover:text-gray-700'
              }`}
            >
              <FaExternalLinkAlt className="inline mr-2" />
              My Promotions ({myPromotions.length})
            </button>
          </nav>
        </div>

        {/* Filters */}
        <div className="p-4 border-b border-gray-200">
          <div className="flex flex-col md:flex-row gap-4">
            <div className="flex-1 relative">
              <FaSearch className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
              <input
                type="text"
                placeholder="Search..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
            </div>
            <select
              value={filterStatus}
              onChange={(e) => setFilterStatus(e.target.value)}
              className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            >
              <option value="all">All Status</option>
              <option value="approved">Approved</option>
              <option value="pending">Pending</option>
              <option value="rejected">Rejected</option>
            </select>
          </div>
        </div>

        {/* Content */}
        <div className="p-4">
          {loading ? (
            <div className="text-center py-8">
              <div className="inline-block animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
              <p className="mt-2 text-gray-600">Loading...</p>
            </div>
          ) : activeTab === 'business' ? (
            <div className="space-y-4">
              {filteredBusinessOffers.length === 0 ? (
                <div className="text-center py-8 text-gray-500">
                  <p>No business offers found</p>
                  <a href="/affiliates?postForm=true&mode=business" className="text-blue-600 hover:underline">
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
                        </div>
                      </div>
                      <div className="flex items-center gap-2 mt-4 md:mt-0">
                        <a
                          href={offer.tracking_link}
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
              {myPromotions.length === 0 ? (
                <div className="text-center py-8 text-gray-500">
                  <p>You are not promoting any programs yet.</p>
                  <a href="/affiliates" className="text-violet-600 hover:underline">
                    Browse affiliate programs
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
                  return (
                    <div
                      key={app.id}
                      className="border border-violet-100 rounded-lg p-4 bg-violet-50/40"
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
                            <span>Conversions: {app.conversions_count || 0}</span>
                            <span>Earnings: {app.earnings_total || 0}</span>
                          </div>
                          {hop && (
                            <p className="mt-2 text-xs break-all text-slate-600 bg-white border rounded px-2 py-1">
                              {hop}
                            </p>
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
                              className="px-3 py-2 text-sm rounded-lg bg-violet-600 text-white hover:bg-violet-700"
                            >
                              Copy link
                            </button>
                          )}
                          {offer.id && (
                            <a
                              href={`/affiliates/offer/${offer.id}`}
                              className="px-3 py-2 text-sm rounded-lg border border-violet-200 text-violet-800 hover:bg-white"
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
                  <a href="/affiliates?postForm=true&mode=promoter" className="text-blue-600 hover:underline">
                    Create your first affiliate post
                  </a>
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
    </div>
  );
};

export default AffiliateManagement;
