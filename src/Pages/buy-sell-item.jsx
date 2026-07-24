import React, { useState, useEffect } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  FiHeart, FiShare2, FiMapPin, FiEye, FiMessageCircle, 
  FiStar, FiDollarSign, FiTag, FiCalendar, FiUser,
  FiCheckCircle, FiTrendingUp, FiZap, FiArrowLeft,
  FiShield, FiPhone, FiMail, FiExternalLink, FiEdit,
  FiTrash2, FiMoreVertical, FiX, FiSend
} from 'react-icons/fi';
import { buysellAPI } from '../api/buysell';
import { useAuthRedirect } from '../hooks/useAuthRedirect';
import ErrorBoundary from '../Component/ErrorBoundary/ErrorBoundary';
import toast from 'react-hot-toast';

const BuySellItemDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { requireAuth } = useAuthRedirect();
  const [item, setItem] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [saved, setSaved] = useState(false);
  const [showContact, setShowContact] = useState(false);
  const [activeImage, setActiveImage] = useState(0);
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
  const [contactForm, setContactForm] = useState({
    name: '',
    email: '',
    phone: '',
    message: ''
  });
  const [sendingMessage, setSendingMessage] = useState(false);

  useEffect(() => {
    const fetchItem = async () => {
      try {
        setLoading(true);
        console.log('Fetching item with ID:', id);
        const data = await buysellAPI.getAdvert(id);
        console.log('Item data received:', data);
        // API returns { advert: {...}, seller_profile: {...}, related_adverts: [...] }
        // We need to set item to the advert object
        setItem(data.advert || data);
        
        // Track view - but don't let tracking errors break the page
        try {
          await buysellAPI.trackView(id);
        } catch (trackingError) {
          console.warn('View tracking failed:', trackingError);
          // Continue even if tracking fails
        }
        
        setLoading(false);
      } catch (err) {
        console.error('Error fetching item:', err);
        setError('Item not found');
        setLoading(false);
      }
    };

    if (id) {
      fetchItem();
    }
  }, [id]);

  const handleSaveItem = async () => {
    if (!requireAuth()) return;
    
    try {
      if (saved) {
        await buysellAPI.unsaveAdvert(id);
      } else {
        await buysellAPI.saveAdvert(id);
      }
      setSaved(!saved);
    } catch (error) {
      console.error('Error toggling save status:', error);
    }
  };

  const handleShareItem = () => {
    if (navigator.share) {
      navigator.share({
        title: item?.title,
        text: item?.description,
        url: window.location.href
      });
    } else {
      navigator.clipboard.writeText(window.location.href);
    }
  };

  const handleContactSeller = () => {
    if (!requireAuth()) return;
    setShowContact(true);
  };

  const handleSendMessage = async (e) => {
    e.preventDefault();
    
    if (!contactForm.message.trim()) {
      toast.error('Please enter a message');
      return;
    }
    
    setSendingMessage(true);
    try {
      await buysellAPI.contactSeller(id, contactForm);
      toast.success('Message sent to seller successfully!');
      setShowContact(false);
      setContactForm({ name: '', email: '', phone: '', message: '' });
    } catch (error) {
      console.error('Error sending message:', error);
      toast.error(error.response?.data?.error?.message || 'Failed to send message. Please try again.');
    } finally {
      setSendingMessage(false);
    }
  };

  const handleContactFormChange = (field, value) => {
    setContactForm(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const formatPrice = (price, currency = 'USD') => {
    if (price === 0) return 'FREE';
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: currency
    }).format(price);
  };

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };

  const getFirstImage = (item) => {
    if (!item?.images) {
      console.log('[BuySellItemDetail] No images field, using fallback');
      return null;
    }

    console.log('[BuySellItemDetail] Images data structure:', typeof item.images, Array.isArray(item.images), item.images);

    let imageUrl = null;

    // If images is an object, get the first value that looks like a URL
    if (typeof item.images === 'object' && !Array.isArray(item.images)) {
      const imageKeys = Object.keys(item.images);
      console.log('[BuySellItemDetail] Image object keys:', imageKeys);
      for (const key of imageKeys) {
        const value = item.images[key];
        console.log('[BuySellItemDetail] Checking image value:', key, '=', value);
        // Check if value is a valid URL (starts with http/https or is a valid path)
        if (value && (typeof value === 'string') && (value.startsWith('http') || value.startsWith('/'))) {
          imageUrl = value;
          console.log('[BuySellItemDetail] Valid image URL from object:', imageUrl);
          break;
        }
      }
    }
    // If images is an array, get the first item that looks like a URL
    else if (Array.isArray(item.images) && item.images.length > 0) {
      console.log('[BuySellItemDetail] Image array length:', item.images.length);
      for (const img of item.images) {
        // Handle both string URLs and objects with url property
        const url = typeof img === 'string' ? img : img?.url;
        console.log('[BuySellItemDetail] Checking array item:', img, '-> url:', url);
        if (url && (url.startsWith('http') || url.startsWith('/'))) {
          imageUrl = url;
          console.log('[BuySellItemDetail] Valid image URL from array:', imageUrl);
          break;
        }
      }
    }

    if (!imageUrl) {
      console.log('[BuySellItemDetail] No valid image URL found, using fallback image');
    }

    return imageUrl;
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="animate-pulse text-center">
          <div className="w-32 h-32 bg-gray-200 rounded-full mx-auto mb-4"></div>
          <div className="h-4 bg-gray-200 rounded w-64 mx-auto mb-2"></div>
          <div className="h-3 bg-gray-200 rounded w-48 mx-auto"></div>
        </div>
      </div>
    );
  }

  if (error || !item) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="text-6xl mb-4">😔</div>
          <h1 className="text-2xl font-bold text-gray-900 mb-2">Item Not Found</h1>
          <p className="text-gray-600 mb-6">This item doesn't exist or has been removed.</p>
          <Link
            to="/buy-sell"
            className="inline-flex items-center gap-2 px-6 py-3 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors"
          >
            <FiArrowLeft className="h-4 w-4" />
            Back to Buy & Sell
          </Link>
        </div>
      </div>
    );
  }

  return (
    <ErrorBoundary>
      <div className="min-h-screen bg-gray-50">
        {/* Header */}
        <div className="bg-white border-b border-gray-200 sticky top-0 z-40">
          <div className="page-container py-4">
            <div className="flex items-center justify-between">
              <button
                onClick={() => navigate(-1)}
                className="flex items-center gap-2 text-gray-600 hover:text-gray-900 transition-colors"
              >
                <FiArrowLeft className="h-5 w-5" />
                Back
              </button>
              
              <div className="flex items-center gap-2">
                <button
                  onClick={handleSaveItem}
                  className={`p-2 rounded-lg transition-colors ${
                    saved ? 'bg-red-50 text-red-600' : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                  }`}
                >
                  <FiHeart className="h-5 w-5" fill={saved ? 'currentColor' : 'none'} />
                </button>
                <button
                  onClick={handleShareItem}
                  className="p-2 bg-gray-100 text-gray-600 rounded-lg hover:bg-gray-200 transition-colors"
                >
                  <FiShare2 className="h-5 w-5" />
                </button>
              </div>
            </div>
          </div>
        </div>

        <div className="page-container py-8">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Main Content */}
            <div className="lg:col-span-2">
              {/* Images */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden mb-6"
              >
                <div className="relative">
                  <img
                    src={getFirstImage(item) || 'https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=800'}
                    alt={item.title}
                    className="w-full h-96 object-cover"
                  />
                  
                  {/* Badges */}
                  <div className="absolute top-4 left-4 flex gap-2">
                    {item.featured && (
                      <span className="bg-purple-500 text-white px-3 py-1 rounded-full text-sm font-semibold">
                        Featured
                      </span>
                    )}
                    {item.promoted && (
                      <span className="bg-blue-500 text-white px-3 py-1 rounded-full text-sm font-semibold">
                        Promoted
                      </span>
                    )}
                    {item.sponsored && (
                      <span className="bg-orange-500 text-white px-3 py-1 rounded-full text-sm font-semibold">
                        Sponsored
                      </span>
                    )}
                    {item.price === 0 && (
                      <span className="bg-green-500 text-white px-3 py-1 rounded-full text-sm font-semibold flex items-center gap-1">
                        <FiZap className="h-3 w-3" />
                        FREE
                      </span>
                    )}
                  </div>
                </div>
              </motion.div>

              {/* Title and Price */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.1 }}
                className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 mb-6"
              >
                <h1 className="text-3xl font-bold text-gray-900 mb-4">{item.title}</h1>
                
                <div className="flex items-center justify-between mb-4">
                  <div className="flex items-center gap-3">
                    <span className="text-3xl font-bold text-green-600">
                      {formatPrice(item.price, item.currency)}
                    </span>
                    {item.negotiable && (
                      <span className="bg-green-100 text-green-700 px-2 py-1 rounded-lg text-sm font-medium">
                        Negotiable
                      </span>
                    )}
                  </div>
                  
                  <div className="flex items-center gap-4 text-sm text-gray-500">
                    <div className="flex items-center gap-1">
                      <FiEye className="h-4 w-4" />
                      <span>{item.views_count || 0} views</span>
                    </div>
                    <div className="flex items-center gap-1">
                      <FiCalendar className="h-4 w-4" />
                      <span>{formatDate(item.created_at)}</span>
                    </div>
                  </div>
                </div>

                {/* Meta Info */}
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
                  <div className="flex items-center gap-2">
                    <FiTag className="h-4 w-4 text-gray-400" />
                    <span className="capitalize">{item.condition?.replace('_', ' ') || 'Not specified'}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <FiMapPin className="h-4 w-4 text-gray-400" />
                    <span>{item.city}</span>
                  </div>
                  {item.brand && (
                    <div className="flex items-center gap-2">
                      <span className="font-medium">{item.brand}</span>
                      {item.model && <span>• {item.model}</span>}
                    </div>
                  )}
                  {item.category && (
                    <div className="flex items-center gap-2">
                      <span className="bg-gray-100 px-2 py-1 rounded text-xs">
                        {item.category.name}
                      </span>
                    </div>
                  )}
                </div>
              </motion.div>

              {/* Description */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.2 }}
                className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 mb-6"
              >
                <h2 className="text-xl font-bold text-gray-900 mb-4">Description</h2>
                <div
                  className="text-gray-700 leading-relaxed prose prose-sm max-w-none"
                  dangerouslySetInnerHTML={{ __html: item.description }}
                />
              </motion.div>

              {/* Additional Details */}
              {(item.dimensions || item.weight || item.material || item.usage_duration) && (
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.3 }}
                  className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 mb-6"
                >
                  <h2 className="text-xl font-bold text-gray-900 mb-4">Additional Details</h2>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {item.dimensions && (
                      <div>
                        <span className="text-sm text-gray-500">Dimensions</span>
                        <p className="font-medium">{item.dimensions}</p>
                      </div>
                    )}
                    {item.weight && (
                      <div>
                        <span className="text-sm text-gray-500">Weight</span>
                        <p className="font-medium">{item.weight} kg</p>
                      </div>
                    )}
                    {item.material && (
                      <div>
                        <span className="text-sm text-gray-500">Material</span>
                        <p className="font-medium">{item.material}</p>
                      </div>
                    )}
                    {item.usage_duration && (
                      <div>
                        <span className="text-sm text-gray-500">Usage Duration</span>
                        <p className="font-medium">{item.usage_duration}</p>
                      </div>
                    )}
                  </div>
                </motion.div>
              )}
            </div>

            {/* Sidebar */}
            <div className="lg:col-span-1">
              {/* Seller Info */}
              <motion.div
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.4 }}
                className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 mb-6 sticky top-24"
              >
                <h3 className="text-lg font-bold text-gray-900 mb-4">Seller Information</h3>

                <div className="flex items-center gap-3 mb-4">
                  <img
                    src='https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=100'
                    alt={item.seller_name}
                    className="w-12 h-12 rounded-full object-cover"
                  />
                  <div className="flex-1">
                    <div className="font-medium text-gray-900">{item.seller_name}</div>
                    <div className="flex items-center gap-1">
                      <FiStar className="h-3 w-3 text-yellow-500 fill-current" />
                      <span className="text-xs text-gray-600">4.5</span>
                      {(item.verified_seller || item.seller_profile?.verified) && (
                        <FiCheckCircle className="h-3 w-3 text-green-500" />
                      )}
                    </div>
                  </div>
                </div>

                <div className="space-y-3 text-sm">
                  <div className="flex items-center gap-2">
                    <FiMail className="h-4 w-4 text-gray-400" />
                    <span>{item.seller_email || item.seller_profile?.email}</span>
                  </div>
                  {(item.show_phone && item.seller_phone) || item.seller_profile?.phone ? (
                    <div className="flex items-center gap-2">
                      <FiPhone className="h-4 w-4 text-gray-400" />
                      <span>{item.seller_phone || item.seller_profile?.phone}</span>
                    </div>
                  ) : null}
                  {item.seller_website || item.seller_profile?.website ? (
                    <div className="flex items-center gap-2">
                      <FiExternalLink className="h-4 w-4 text-gray-400" />
                      <a
                        href={item.seller_website || item.seller_profile?.website}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-green-600 hover:underline"
                      >
                        Website
                      </a>
                    </div>
                  ) : null}
                </div>

                <button
                  onClick={handleContactSeller}
                  className="w-full mt-6 px-4 py-3 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors font-medium"
                >
                  Contact Seller
                </button>

                <div className="mt-4 p-3 bg-gray-50 rounded-lg">
                  <div className="flex items-center gap-2 text-xs text-gray-600">
                    <FiShield className="h-4 w-4" />
                    <span>Protected by WWA's secure messaging system</span>
                  </div>
                </div>
              </motion.div>
            </div>
          </div>
        </div>
      </div>

      {/* Contact Modal */}
      <AnimatePresence>
        {showContact && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4 sm:p-6"
            onClick={() => setShowContact(false)}
          >
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              className="bg-white rounded-xl shadow-2xl w-full max-w-md max-h-[90vh] overflow-hidden flex flex-col mx-4"
              onClick={(e) => e.stopPropagation()}
            >
              {/* Modal Header */}
              <div className="flex items-center justify-between p-4 sm:p-6 border-b border-gray-200 flex-shrink-0">
                <h3 className="text-lg sm:text-xl font-bold text-gray-900">Contact Seller</h3>
                <button
                  onClick={() => setShowContact(false)}
                  className="text-gray-400 hover:text-gray-600 transition-colors p-1"
                >
                  <FiX className="h-5 w-5 sm:h-6 sm:w-6" />
                </button>
              </div>

              {/* Modal Body - Scrollable */}
              <div className="flex-1 overflow-y-auto">
                <form onSubmit={handleSendMessage} className="p-4 sm:p-6 space-y-4">
                  {/* Name */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Your Name
                    </label>
                    <input
                      type="text"
                      value={contactForm.name}
                      onChange={(e) => handleContactFormChange('name', e.target.value)}
                      className="w-full px-3 sm:px-4 py-2 sm:py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent text-sm"
                      placeholder="Enter your name"
                      required
                    />
                  </div>

                  {/* Email */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Your Email
                    </label>
                    <input
                      type="email"
                      value={contactForm.email}
                      onChange={(e) => handleContactFormChange('email', e.target.value)}
                      className="w-full px-3 sm:px-4 py-2 sm:py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent text-sm"
                      placeholder="your.email@example.com"
                      required
                    />
                  </div>

                  {/* Phone */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Phone Number (Optional)
                    </label>
                    <input
                      type="tel"
                      value={contactForm.phone}
                      onChange={(e) => handleContactFormChange('phone', e.target.value)}
                      className="w-full px-3 sm:px-4 py-2 sm:py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent text-sm"
                      placeholder="+1 (555) 123-4567"
                    />
                  </div>

                  {/* Message */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Message
                    </label>
                    <textarea
                      value={contactForm.message}
                      onChange={(e) => handleContactFormChange('message', e.target.value)}
                      className="w-full px-3 sm:px-4 py-2 sm:py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent resize-none text-sm"
                      rows={4}
                      placeholder="Hi, I'm interested in this item. Is it still available?"
                      required
                    />
                  </div>

                  {/* Item Info */}
                  <div className="bg-gray-50 p-3 sm:p-4 rounded-lg">
                    <p className="text-xs sm:text-sm text-gray-600 mb-1 sm:mb-2">
                      <strong>Item:</strong> {item?.title}
                    </p>
                    <p className="text-xs sm:text-sm text-gray-600">
                      <strong>Price:</strong> {formatPrice(item?.price, item?.currency)}
                    </p>
                  </div>

                  {/* Modal Footer */}
                  <div className="flex gap-2 sm:gap-3 pt-4 border-t border-gray-200">
                    <button
                      type="button"
                      onClick={() => setShowContact(false)}
                      className="flex-1 px-3 sm:px-4 py-2 sm:py-2.5 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors text-sm font-medium"
                    >
                      Cancel
                    </button>
                    <button
                      type="submit"
                      disabled={sendingMessage}
                      className="flex-1 px-3 sm:px-4 py-2 sm:py-2.5 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed font-medium text-sm"
                    >
                      {sendingMessage ? (
                        <div className="flex items-center justify-center gap-2">
                          <div className="w-4 h-4 border-2 border-white border-t-transparent border-r-transparent animate-spin rounded-full"></div>
                          Sending...
                        </div>
                      ) : (
                        <div className="flex items-center justify-center gap-2">
                          <FiSend className="h-4 w-4" />
                          Send Message
                        </div>
                      )}
                    </button>
                  </div>
                </form>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </ErrorBoundary>
  );
};

export default BuySellItemDetail;
