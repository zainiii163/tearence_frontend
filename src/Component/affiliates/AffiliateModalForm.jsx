import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import affiliateService from '../../services/AffiliateService';
import toast from 'react-hot-toast';
import { 
  X, 
  Briefcase, 
  User, 
  Upload,
  DollarSign,
  Globe,
  Link as LinkIcon,
  Mail,
  Phone,
  MapPin,
  Calendar,
  Loader2,
  Check
} from 'lucide-react';

const TRAFFIC_TYPES = [
  { value: 'social_media', label: 'Social Media' },
  { value: 'email', label: 'Email' },
  { value: 'ppc', label: 'PPC / Ads' },
  { value: 'blogging', label: 'Blogging / SEO' },
  { value: 'influencer', label: 'Influencer' },
  { value: 'other', label: 'Other' },
];

const AffiliateModalForm = ({ onClose, categories, onSubmissionSuccess, editItem = null, editType = null, editId = null, initialMode = 'user' }) => {
  const isEditing = Boolean(editId);
  const [mode, setMode] = useState(editType || initialMode || 'user');
  const [loading, setLoading] = useState(false);
  const [imagePreview, setImagePreview] = useState(null);
  
  const [businessForm, setBusinessForm] = useState({
    business_name: '',
    product_service_title: '',
    tagline: '',
    affiliate_category_id: '',
    country: '',
    region: '',
    description: '',
    commission_type: 'percentage',
    commission_rate: '',
    cookie_duration: '30',
    allowed_traffic_types: [],
    restrictions: '',
    join_instructions: '',
    tracking_link: '',
    promotional_assets: [],
    business_email: '',
    website_url: ''
  });

  const toggleTrafficType = (value) => {
    setBusinessForm((prev) => {
      const current = prev.allowed_traffic_types || [];
      const next = current.includes(value)
        ? current.filter((t) => t !== value)
        : [...current, value];
      return { ...prev, allowed_traffic_types: next };
    });
  };

  const [userForm, setUserForm] = useState({
    title: '',
    description: '',
    affiliate_category_id: '',
    country: '',
    region: '',
    affiliate_link: '',
    image: null,
    hashtags: '',
    target_audience: ''
  });

  useEffect(() => {
    if (!editItem) return;
    if (editType === 'business') {
      setBusinessForm({
        business_name: editItem.business_name || '',
        product_service_title: editItem.product_service_title || '',
        tagline: editItem.tagline || '',
        affiliate_category_id: editItem.affiliate_category_id?.toString() || editItem.affiliate_category?.id?.toString() || '',
        country: editItem.country || '',
        region: editItem.region || '',
        description: editItem.description || '',
        commission_type: editItem.commission_type || 'percentage',
        commission_rate: editItem.commission_rate?.toString() || '',
        cookie_duration: editItem.cookie_duration?.toString() || '30',
        allowed_traffic_types: Array.isArray(editItem.allowed_traffic_types)
          ? editItem.allowed_traffic_types
          : [],
        restrictions: editItem.restrictions || '',
        join_instructions: editItem.join_instructions || '',
        tracking_link: editItem.tracking_link || '',
        promotional_assets: Array.isArray(editItem.promotional_assets)
          ? editItem.promotional_assets
          : [],
        business_email: editItem.business_email || '',
        website_url: editItem.website_url || '',
      });
    } else {
      setUserForm({
        title: editItem.title || '',
        description: editItem.description || '',
        affiliate_category_id: editItem.affiliate_category_id?.toString() || editItem.affiliate_category?.id?.toString() || '',
        country: editItem.country || '',
        region: editItem.region || '',
        affiliate_link: editItem.affiliate_link || '',
        image: editItem.image || null,
        hashtags: Array.isArray(editItem.hashtags) ? editItem.hashtags.join(', ') : (editItem.hashtags || ''),
        target_audience: editItem.target_audience || '',
      });
      if (editItem.image) setImagePreview(editItem.image);
    }
  }, [editItem, editType]);

  useEffect(() => {
    if (editType) setMode(editType);
    else if (initialMode) setMode(initialMode);
  }, [editType, initialMode]);

  const handleImageUpload = async (e) => {
    const file = e.target.files[0];
    if (file) {
      try {
        setLoading(true);
        const response = await affiliateService.uploadImage(file);
        const imageUrl = response.data?.url || response.url;
        
        if (mode === 'user') {
          setUserForm(prev => ({ ...prev, image: imageUrl }));
          setImagePreview(imageUrl);
        } else {
          setBusinessForm(prev => ({ 
            ...prev, 
            promotional_assets: [...prev.promotional_assets, imageUrl]
          }));
        }
        toast.success('Image uploaded successfully');
      } catch (error) {
        toast.error('Failed to upload image');
      } finally {
        setLoading(false);
      }
    }
  };

  const handleBusinessSubmit = async (e) => {
    e.preventDefault();
    try {
      setLoading(true);
      
      const data = {
        business_name: businessForm.business_name,
        product_service_title: businessForm.product_service_title,
        tagline: businessForm.tagline,
        affiliate_category_id: parseInt(businessForm.affiliate_category_id),
        country: businessForm.country,
        region: businessForm.region,
        description: businessForm.description,
        commission_type: businessForm.commission_type,
        commission_rate: parseFloat(businessForm.commission_rate),
        cookie_duration: parseInt(businessForm.cookie_duration),
        allowed_traffic_types: businessForm.allowed_traffic_types,
        restrictions: businessForm.restrictions || null,
        join_instructions: businessForm.join_instructions || null,
        tracking_link: businessForm.tracking_link,
        promotional_assets: businessForm.promotional_assets,
        business_email: businessForm.business_email,
        website_url: businessForm.website_url || null,
        status: 'approved',
        is_active: true,
      };

      if (isEditing) {
        await affiliateService.updateBusinessOffer(editId, data);
        toast.success('Business affiliate offer updated successfully!');
      } else {
        await affiliateService.createBusinessOffer(data);
        toast.success('Business affiliate offer published successfully!');
      }
      onSubmissionSuccess({ type: 'business', data });
      onClose();
    } catch (error) {
      console.error('Error:', error);
      toast.error(error.response?.data?.message || 'Failed to create business offer');
    } finally {
      setLoading(false);
    }
  };

  const handleUserSubmit = async (e) => {
    e.preventDefault();
    try {
      setLoading(true);
      
      const data = {
        title: userForm.title,
        description: userForm.description,
        affiliate_category_id: parseInt(userForm.affiliate_category_id),
        country: userForm.country || null,
        region: userForm.region || null,
        affiliate_link: userForm.affiliate_link,
        hashtags: userForm.hashtags.split(',').map(tag => tag.trim()).filter(tag => tag),
        target_audience: userForm.target_audience || null,
        status: 'approved',
        is_active: true,
      };
      if (userForm.image) {
        data.image = userForm.image;
      }

      if (isEditing) {
        await affiliateService.updateUserPost(editId, data);
        toast.success('Affiliate post updated successfully!');
      } else {
        await affiliateService.createUserPost(data);
        toast.success('Affiliate post published successfully!');
      }
      onSubmissionSuccess({ type: 'user', data });
      onClose();
    } catch (error) {
      console.error('Error:', error);
      const msg = error?.message
        || (error?.errors && Object.values(error.errors).flat().join(' '))
        || error?.response?.data?.message
        || 'Failed to create affiliate post';
      toast.error(typeof msg === 'string' ? msg : 'Failed to create affiliate post');
    } finally {
      setLoading(false);
    }
  };

  return (
    <AnimatePresence>
      <motion.div
        className="fixed inset-0 z-50 flex items-center justify-center p-4"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
      >
        {/* Backdrop */}
        <motion.div
          className="absolute inset-0 bg-black/50 backdrop-blur-sm"
          onClick={onClose}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
        />

        {/* Modal */}
        <motion.div
          className="relative bg-white rounded-2xl shadow-2xl max-w-3xl w-full max-h-[90vh] overflow-y-auto"
          initial={{ scale: 0.9, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          exit={{ scale: 0.9, opacity: 0 }}
          transition={{ type: "spring", damping: 25 }}
        >
          {/* Header */}
          <div className="sticky top-0 bg-white border-b border-gray-200 px-6 py-4 z-10">
            <div className="flex items-center justify-between">
              <h2 className="text-2xl font-bold text-gray-900">
                {isEditing ? 'Edit Affiliate Listing' : 'Post Affiliate Listing'}
              </h2>
              <button
                onClick={onClose}
                className="p-2 hover:bg-gray-100 rounded-full transition-colors"
              >
                <X className="w-5 h-5" />
              </button>
            </div>
            
            {/* Mode Toggle */}
            {!isEditing && (
              <div className="flex gap-2 mt-4 bg-gray-100 p-1 rounded-lg">
                <button
                  type="button"
                  onClick={() => setMode('user')}
                  className={`flex-1 flex items-center justify-center gap-2 py-2 px-4 rounded-md transition-all ${
                    mode === 'user' 
                      ? 'bg-white shadow text-green-600' 
                      : 'text-gray-600 hover:text-gray-900'
                  }`}
                >
                  <User className="w-4 h-4" />
                  Share Affiliate Link
                </button>
                <button
                  type="button"
                  onClick={() => setMode('business')}
                  className={`flex-1 flex items-center justify-center gap-2 py-2 px-4 rounded-md transition-all ${
                    mode === 'business' 
                      ? 'bg-white shadow text-blue-600' 
                      : 'text-gray-600 hover:text-gray-900'
                  }`}
                >
                  <Briefcase className="w-4 h-4" />
                  Publish Program
                </button>
              </div>
            )}
            <p className="mt-3 text-sm text-gray-500">
              {mode === 'user'
                ? 'Share ClickBank, JVZoo, Amazon, or any external affiliate link. This is not a WWA hop link.'
                : 'List your product/program. Affiliates join to get a unique WWA tracking link that hops to your destination URL.'}
            </p>
          </div>

          {/* Form Content */}
          <div className="px-6 py-6">
            {mode === 'business' ? (
              <form onSubmit={handleBusinessSubmit} className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {/* Business Name */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Business Name *
                    </label>
                    <input
                      type="text"
                      required
                      value={businessForm.business_name}
                      onChange={(e) => setBusinessForm(prev => ({ ...prev, business_name: e.target.value }))}
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      placeholder="Your business name"
                    />
                  </div>

                  {/* Product/Service Title */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Product/Service Title *
                    </label>
                    <input
                      type="text"
                      required
                      value={businessForm.product_service_title}
                      onChange={(e) => setBusinessForm(prev => ({ ...prev, product_service_title: e.target.value }))}
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      placeholder="What are you promoting?"
                    />
                  </div>

                  {/* Tagline */}
                  <div className="md:col-span-2">
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Tagline (max 80 chars)
                    </label>
                    <input
                      type="text"
                      maxLength={80}
                      value={businessForm.tagline}
                      onChange={(e) => setBusinessForm(prev => ({ ...prev, tagline: e.target.value }))}
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      placeholder="Short catchy tagline"
                    />
                  </div>

                  {/* Category */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Category *
                    </label>
                    <select
                      required
                      value={businessForm.affiliate_category_id}
                      onChange={(e) => setBusinessForm(prev => ({ ...prev, affiliate_category_id: e.target.value }))}
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    >
                      <option value="">Select category</option>
                      {categories.map(cat => (
                        <option key={cat.id} value={cat.id}>{cat.name}</option>
                      ))}
                    </select>
                  </div>

                  {/* Country */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Country *
                    </label>
                    <input
                      type="text"
                      required
                      value={businessForm.country}
                      onChange={(e) => setBusinessForm(prev => ({ ...prev, country: e.target.value }))}
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      placeholder="Your country"
                    />
                  </div>

                  {/* Region */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Region
                    </label>
                    <input
                      type="text"
                      value={businessForm.region}
                      onChange={(e) => setBusinessForm(prev => ({ ...prev, region: e.target.value }))}
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      placeholder="State/Province"
                    />
                  </div>

                  {/* Commission Type */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Commission Type *
                    </label>
                    <select
                      required
                      value={businessForm.commission_type}
                      onChange={(e) => setBusinessForm(prev => ({ ...prev, commission_type: e.target.value }))}
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    >
                      <option value="percentage">Percentage</option>
                      <option value="fixed">Fixed Amount</option>
                    </select>
                  </div>

                  {/* Commission Rate */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Commission Rate *
                    </label>
                    <div className="relative">
                      <input
                        type="number"
                        required
                        min="0"
                        step="0.01"
                        value={businessForm.commission_rate}
                        onChange={(e) => setBusinessForm(prev => ({ ...prev, commission_rate: e.target.value }))}
                        className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent pl-10"
                        placeholder="Enter rate"
                      />
                      <DollarSign className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
                    </div>
                  </div>

                  {/* Cookie Duration */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Cookie Duration (days) *
                    </label>
                    <input
                      type="number"
                      required
                      min="1"
                      value={businessForm.cookie_duration}
                      onChange={(e) => setBusinessForm(prev => ({ ...prev, cookie_duration: e.target.value }))}
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      placeholder="30"
                    />
                  </div>

                  {/* Business Email */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Business Email *
                    </label>
                    <div className="relative">
                      <input
                        type="email"
                        required
                        value={businessForm.business_email}
                        onChange={(e) => setBusinessForm(prev => ({ ...prev, business_email: e.target.value }))}
                        className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent pl-10"
                        placeholder="contact@business.com"
                      />
                      <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
                    </div>
                  </div>

                  {/* Website URL */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Website URL
                    </label>
                    <div className="relative">
                      <input
                        type="url"
                        value={businessForm.website_url}
                        onChange={(e) => setBusinessForm(prev => ({ ...prev, website_url: e.target.value }))}
                        className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent pl-10"
                        placeholder="https://yourwebsite.com"
                      />
                      <Globe className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
                    </div>
                  </div>

                  {/* Destination / merchant link */}
                  <div className="md:col-span-2">
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Destination URL (where buyers land) *
                    </label>
                    <div className="relative">
                      <input
                        type="url"
                        required
                        value={businessForm.tracking_link}
                        onChange={(e) => setBusinessForm(prev => ({ ...prev, tracking_link: e.target.value }))}
                        className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent pl-10"
                        placeholder="https://yoursite.com/checkout or sales page"
                      />
                      <LinkIcon className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
                    </div>
                    <p className="mt-1 text-xs text-gray-500">
                      Promoters get a unique WWA hop link that redirects here. Do not paste a promoter hop link.
                    </p>
                  </div>

                  {/* Allowed traffic */}
                  <div className="md:col-span-2">
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Allowed traffic types
                    </label>
                    <div className="flex flex-wrap gap-2">
                      {TRAFFIC_TYPES.map((t) => {
                        const selected = (businessForm.allowed_traffic_types || []).includes(t.value);
                        return (
                          <button
                            key={t.value}
                            type="button"
                            onClick={() => toggleTrafficType(t.value)}
                            className={`px-3 py-1.5 text-sm rounded-lg border transition-colors ${
                              selected
                                ? 'bg-blue-600 text-white border-blue-600'
                                : 'bg-white text-gray-700 border-gray-300 hover:border-blue-400'
                            }`}
                          >
                            {selected && <Check className="w-3 h-3 inline mr-1" />}
                            {t.label}
                          </button>
                        );
                      })}
                    </div>
                  </div>

                  {/* Description */}
                  <div className="md:col-span-2">
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Program description *
                    </label>
                    <textarea
                      required
                      rows={4}
                      value={businessForm.description}
                      onChange={(e) => setBusinessForm(prev => ({ ...prev, description: e.target.value }))}
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      placeholder="Describe your offer, payouts, and who should promote it..."
                    />
                  </div>

                  {/* Join instructions */}
                  <div className="md:col-span-2">
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Join / payout instructions (optional)
                    </label>
                    <textarea
                      rows={2}
                      value={businessForm.join_instructions}
                      onChange={(e) => setBusinessForm(prev => ({ ...prev, join_instructions: e.target.value }))}
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      placeholder="e.g. How payouts work, promo codes, or what to do after joining"
                    />
                  </div>

                  {/* Restrictions */}
                  <div className="md:col-span-2">
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Restrictions (optional)
                    </label>
                    <textarea
                      rows={2}
                      value={businessForm.restrictions}
                      onChange={(e) => setBusinessForm(prev => ({ ...prev, restrictions: e.target.value }))}
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      placeholder="Any restrictions on promotion methods..."
                    />
                  </div>

                  {/* Image Upload */}
                  <div className="md:col-span-2">
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Promotional Images
                    </label>
                    <div className="border-2 border-dashed border-gray-300 rounded-lg p-6 text-center hover:border-blue-500 transition-colors">
                      <input
                        type="file"
                        accept="image/*"
                        onChange={handleImageUpload}
                        className="hidden"
                        id="business-image-upload"
                      />
                      <label
                        htmlFor="business-image-upload"
                        className="cursor-pointer flex flex-col items-center"
                      >
                        <Upload className="w-12 h-12 text-gray-400 mb-2" />
                        <span className="text-sm text-gray-600">
                          Click to upload promotional images
                        </span>
                      </label>
                      {businessForm.promotional_assets.length > 0 && (
                        <div className="mt-4 text-sm text-green-600">
                          ✓ {businessForm.promotional_assets.length} image(s) uploaded
                        </div>
                      )}
                    </div>
                  </div>
                </div>

                {/* Submit Button */}
                <div className="flex justify-end gap-3 pt-4 border-t">
                  <button
                    type="button"
                    onClick={onClose}
                    className="px-6 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    disabled={loading}
                    className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
                  >
                    {loading ? (
                      <>
                        <Loader2 className="w-4 h-4 animate-spin" />
                        Submitting...
                      </>
                    ) : (
                      <>
                        <Check className="w-4 h-4" />
                        Submit Offer
                      </>
                    )}
                  </button>
                </div>
              </form>
            ) : (
              <form onSubmit={handleUserSubmit} className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {/* Title */}
                  <div className="md:col-span-2">
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Title *
                    </label>
                    <input
                      type="text"
                      required
                      value={userForm.title}
                      onChange={(e) => setUserForm(prev => ({ ...prev, title: e.target.value }))}
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
                      placeholder="e.g. Find Your Perfect Online Job!"
                    />
                  </div>

                  {/* Category */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Category *
                    </label>
                    <select
                      required
                      value={userForm.affiliate_category_id}
                      onChange={(e) => setUserForm(prev => ({ ...prev, affiliate_category_id: e.target.value }))}
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
                    >
                      <option value="">Select category</option>
                      {categories.map(cat => (
                        <option key={cat.id} value={cat.id}>{cat.name}</option>
                      ))}
                    </select>
                  </div>

                  {/* Country */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Country
                    </label>
                    <input
                      type="text"
                      value={userForm.country}
                      onChange={(e) => setUserForm(prev => ({ ...prev, country: e.target.value }))}
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
                      placeholder="Your country"
                    />
                  </div>

                  {/* Region */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Region
                    </label>
                    <input
                      type="text"
                      value={userForm.region}
                      onChange={(e) => setUserForm(prev => ({ ...prev, region: e.target.value }))}
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
                      placeholder="State/Province"
                    />
                  </div>

                  {/* Affiliate Link */}
                  <div className="md:col-span-2">
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      External affiliate / hop link *
                    </label>
                    <div className="relative">
                      <input
                        type="url"
                        required
                        value={userForm.affiliate_link}
                        onChange={(e) => setUserForm(prev => ({ ...prev, affiliate_link: e.target.value }))}
                        className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent pl-10"
                        placeholder="https://your-hop.clickbank.net or Amazon Associates link"
                      />
                      <LinkIcon className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
                    </div>
                    <p className="text-xs text-gray-500 mt-1">
                      Your ClickBank / JVZoo / Amazon (etc.) tracking link — not a WWA program hop.
                    </p>
                  </div>

                  {/* Description */}
                  <div className="md:col-span-2">
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Description *
                    </label>
                    <textarea
                      required
                      rows={4}
                      value={userForm.description}
                      onChange={(e) => setUserForm(prev => ({ ...prev, description: e.target.value }))}
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
                      placeholder="Looking for a flexible way to work from home? Explore Live Chat Jobs and discover new online earning opportunities. Work from anywhere — flexible schedule."
                    />
                  </div>

                  {/* Hashtags */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Hashtags
                    </label>
                    <input
                      type="text"
                      value={userForm.hashtags}
                      onChange={(e) => setUserForm(prev => ({ ...prev, hashtags: e.target.value }))}
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
                      placeholder="WorkFromHome, OnlineJobs, RemoteWork, EarnOnline"
                    />
                  </div>

                  {/* Target Audience */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Target Audience
                    </label>
                    <input
                      type="text"
                      value={userForm.target_audience}
                      onChange={(e) => setUserForm(prev => ({ ...prev, target_audience: e.target.value }))}
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
                      placeholder="e.g. People looking for remote / work-from-home jobs"
                    />
                  </div>

                  {/* Image Upload */}
                  <div className="md:col-span-2">
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Image <span className="text-gray-400 font-normal">(optional)</span>
                    </label>
                    <div className="border-2 border-dashed border-gray-300 rounded-lg p-6 text-center hover:border-green-500 transition-colors">
                      <input
                        type="file"
                        accept="image/*"
                        onChange={handleImageUpload}
                        className="hidden"
                        id="user-image-upload"
                      />
                      <label
                        htmlFor="user-image-upload"
                        className="cursor-pointer flex flex-col items-center"
                      >
                        {imagePreview ? (
                          <img src={imagePreview} alt="Preview" className="max-h-48 rounded-lg mb-2" />
                        ) : (
                          <>
                            <Upload className="w-12 h-12 text-gray-400 mb-2" />
                            <span className="text-sm text-gray-600">
                              Click to upload a promo image (optional)
                            </span>
                          </>
                        )}
                      </label>
                    </div>
                  </div>
                </div>

                {/* Submit Button */}
                <div className="flex justify-end gap-3 pt-4 border-t">
                  <button
                    type="button"
                    onClick={onClose}
                    className="px-6 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    disabled={loading}
                    className="px-6 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
                  >
                    {loading ? (
                      <>
                        <Loader2 className="w-4 h-4 animate-spin" />
                        Submitting...
                      </>
                    ) : (
                      <>
                        <Check className="w-4 h-4" />
                        Submit Post
                      </>
                    )}
                  </button>
                </div>
              </form>
            )}
          </div>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
};

export default AffiliateModalForm;
