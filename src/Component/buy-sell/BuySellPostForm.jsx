import React, { useState, useEffect, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { FiX, FiCheck, FiUpload, FiDollarSign, FiMapPin, FiUser, FiMail, FiPhone, FiGlobe, FiShield } from 'react-icons/fi';
import ReactQuill from 'react-quill';
import 'react-quill/dist/quill.snow.css';
import { buysellAPI } from '../../api/buysell';
import { mapBuySellAdvertToForm, resolveStorageUrl } from '../../utils/dashboardEditMappers';
import { LISTING_TIERS, DEFAULT_LISTING_TIER_ID } from '../../constants/listingTierOptions';
import { normalizeTierId, assertPaidTierSelection, handleListingCreatePayment } from '../../utils/listingPayment';
import VerificationFields from '../shared/VerificationFields';
import toast from 'react-hot-toast';

const BuySellPostForm = ({ onClose, onSuccess, editAdvert = null }) => {
  const navigate = useNavigate();
  const isEditing = Boolean(editAdvert?.id);
  const [phoneVerification, setPhoneVerification] = useState({ phoneVerified: false });
  const onPhoneVerificationChange = useCallback((v) => setPhoneVerification(v), []);
  const [formData, setFormData] = useState({
    itemType: 'for_sale',
    title: '',
    condition: '',
    brand: '',
    model: '',
    color: '',
    dimensions: '',
    weight: '',
    category_id: '',
    main_image_url: '',
    additional_image_urls: [],
    description: '',
    price: '',
    currency: 'USD',
    negotiable: false,
    sellerName: '',
    seller_email: '',
    preferred_contact: 'email',
    sellerPhone: '',
    sellerCompany: '',
    sellerWebsite: '',
    sellerLogo: null,
    verifiedSeller: false,
    country: '',
    city: '',
    location: '',
    coordinates: null,
    privacyMode: false,
    upsellType: DEFAULT_LISTING_TIER_ID,
    termsAccepted: false,
    accuracyConfirmed: false
  });

  const [errors, setErrors] = useState({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [dragActive, setDragActive] = useState(false);
  const [mainImagePreview, setMainImagePreview] = useState(null);
  const [additionalImagePreviews, setAdditionalImagePreviews] = useState([]);
  const [categories, setCategories] = useState([]);
  const [loadingCategories, setLoadingCategories] = useState(true);

  const itemTypes = [
    { value: 'for_sale', label: 'For Sale', icon: '💰', description: 'Sell your item for money' },
    { value: 'for_swap', label: 'For Swap', icon: '🔄', description: 'Exchange your item for something else' },
    { value: 'give_away', label: 'Give Away', icon: '🎁', description: 'Give your item for free' }
  ];

  const conditions = [
    { value: 'new', label: 'New' },
    { value: 'like_new', label: 'Like New' },
    { value: 'excellent', label: 'Excellent' },
    { value: 'good', label: 'Good' },
    { value: 'fair', label: 'Fair' },
    { value: 'poor', label: 'Poor' }
  ];

  // Load categories from API on mount
  useEffect(() => {
    const loadCategories = async () => {
      try {
        setLoadingCategories(true);
        const categoriesData = await buysellAPI.getCategories();
        setCategories(categoriesData || []);
      } catch (error) {
        console.error('Error loading categories:', error);
        setCategories([]);
      } finally {
        setLoadingCategories(false);
      }
    };
    
    loadCategories();
  }, []);

  useEffect(() => {
    if (!editAdvert) return;
    const mapped = mapBuySellAdvertToForm(editAdvert);
    setFormData(mapped);
    if (mapped.main_image_url) {
      setMainImagePreview(resolveStorageUrl(mapped.main_image_url));
    }
    if (mapped.additional_image_urls?.length) {
      setAdditionalImagePreviews(
        mapped.additional_image_urls.map((url) => resolveStorageUrl(url)).filter(Boolean)
      );
    }
  }, [editAdvert]);

  const currencies = ['USD', 'EUR', 'GBP', 'CAD', 'AUD', 'JPY'];

  const upsellOptions = LISTING_TIERS.map((tier) => ({
    type: tier.id,
    name: tier.name,
    price: tier.price,
    features: tier.benefits,
    recommended: tier.popular || false,
  }));

  const handleDrag = (e) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === "dragenter" || e.type === "dragover") {
      setDragActive(true);
    } else if (e.type === "dragleave") {
      setDragActive(false);
    }
  };

  const handleDrop = (e) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);

    const files = Array.from(e.dataTransfer.files);
    // Treat dropped files as additional images
    const validFiles = files.filter(file => {
      const allowedTypes = ['image/jpeg', 'image/png', 'image/jpg', 'image/gif'];
      if (!allowedTypes.includes(file.type)) {
        return false;
      }
      if (file.size > 10 * 1024 * 1024) {
        return false;
      }
      return true;
    });

    if (validFiles.length > 0) {
      // Create a mock event object
      const mockEvent = { target: { files: validFiles } };
      handleAdditionalImagesChange(mockEvent);
    }
  };

  // Handle main image upload
  const handleMainImageChange = async (e) => {
    const file = e.target.files[0];
    if (file) {
      // Validate file type
      const allowedTypes = ['image/jpeg', 'image/png', 'image/jpg', 'image/gif'];
      if (!allowedTypes.includes(file.type)) {
        setErrors(prev => ({ ...prev, main_image: 'Main image must be a JPEG, PNG, JPG, or GIF file' }));
        return;
      }
      // Validate file size (max 5MB to match backend)
      if (file.size > 5 * 1024 * 1024) {
        setErrors(prev => ({ ...prev, main_image: 'Main image must be less than 5MB' }));
        return;
      }

      // Upload image to get URL
      try {
        const result = await buysellAPI.uploadSingleImage(file);

        if (result.success) {
          setFormData(prev => ({ ...prev, main_image_url: result.data.url }));
          setMainImagePreview(result.data.url);
          setErrors(prev => ({ ...prev, main_image: null }));
        } else {
          setErrors(prev => ({ ...prev, main_image: result.message || 'Failed to upload image' }));
        }
      } catch (error) {
        setErrors(prev => ({ ...prev, main_image: 'Failed to upload image' }));
      }
    }
  };

  // Handle additional images upload
  const handleAdditionalImagesChange = async (e) => {
    const files = Array.from(e.target.files);
    const validFiles = files.filter(file => {
      const allowedTypes = ['image/jpeg', 'image/png', 'image/jpg', 'image/gif'];
      if (!allowedTypes.includes(file.type)) {
        return false;
      }
      if (file.size > 10 * 1024 * 1024) {
        return false;
      }
      return true;
    });

    // Upload images to get URLs
    try {
      const result = await buysellAPI.uploadImages(validFiles);

      if (result.success) {
        const newUrls = result.data.map(img => img.url);
        setFormData(prev => ({
          ...prev,
          additional_image_urls: [...prev.additional_image_urls, ...newUrls].slice(0, 10)
        }));
        const previews = result.data.map(img => img.url);
        setAdditionalImagePreviews(prev => [...prev, ...previews]);
      } else {
        console.error('Failed to upload additional images:', result.message);
      }
    } catch (error) {
      console.error('Failed to upload additional images:', error);
    }
  };

  // Remove main image
  const removeMainImage = () => {
    setFormData(prev => ({ ...prev, main_image_url: '' }));
    setMainImagePreview(null);
  };

  // Remove additional image
  const removeAdditionalImage = (index) => {
    setFormData(prev => ({
      ...prev,
      additional_image_urls: prev.additional_image_urls.filter((_, i) => i !== index)
    }));
    setAdditionalImagePreviews(prev => prev.filter((_, i) => i !== index));
  };

  const validateForm = () => {
    const newErrors = {};

    if (!formData.itemType) newErrors.itemType = 'Please select an item type';
    if (!formData.title.trim()) newErrors.title = 'Title is required';
    if (!formData.condition) newErrors.condition = 'Condition is required';
    if (!formData.category_id) newErrors.category_id = 'Category is required';
    if (!formData.main_image_url) newErrors.main_image = 'Main image is required';
    if (!formData.description.trim()) newErrors.description = 'Description is required';
    if (formData.itemType !== 'give_away' && (!formData.price || formData.price <= 0)) {
      newErrors.price = 'Price is required';
    }
    if (!formData.sellerName.trim()) newErrors.sellerName = 'Name is required';
    if (!formData.seller_email.trim()) newErrors.seller_email = 'Email is required';
    if (!formData.preferred_contact) newErrors.preferred_contact = 'Preferred contact is required';
    if (!formData.country?.trim()) newErrors.country = 'Country is required';
    if (!formData.city?.trim() && !formData.location.trim()) newErrors.location = 'City or location is required';
    if (!formData.termsAccepted) newErrors.termsAccepted = 'You must accept the terms';
    if (!formData.accuracyConfirmed) newErrors.accuracyConfirmed = 'You must confirm accuracy';

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!isEditing && !phoneVerification.phoneVerified) {
      toast.error('Please verify your mobile number before posting.');
      return;
    }
    
    if (!validateForm()) return;
    
    setIsSubmitting(true);
    try {
      const tierId = normalizeTierId(formData.upsellType);
      assertPaidTierSelection(tierId);

      // Prepare image URLs array
      const images = formData.main_image_url ? [formData.main_image_url, ...formData.additional_image_urls] : formData.additional_image_urls;

      // Prepare form data for API
      const locationText = (formData.location || '').trim();
      const advertData = {
        title: formData.title,
        description: formData.description,
        category_id: formData.category_id,
        condition: formData.condition,
        price: formData.itemType === 'give_away' ? 0 : formData.price,
        currency: formData.currency || 'USD',
        negotiable: formData.negotiable || false,
        country: formData.country || '',
        city: formData.city || locationText,
        address: formData.address || locationText,
        postalCode: formData.postalCode || '',
        seller_name: formData.sellerName,
        seller_email: formData.seller_email,
        seller_phone: formData.sellerPhone,
        seller_website: formData.sellerWebsite,
        preferred_contact: formData.preferred_contact || 'email',
        show_phone: formData.showPhone || false,
        brand: formData.brand || '',
        model: formData.model || '',
        color: formData.color || '',
        dimensions: formData.dimensions || '',
        weight: formData.weight || '',
        material: formData.material || '',
        usage_duration: formData.usageDuration || '',
        reason_for_selling: formData.reasonForSelling || '',
        images: images.slice(0, 15),
        video_url: formData.video || null,
        promotion_plan: tierId,
        promotion_duration: '30'
      };

      if (isEditing) {
        await buysellAPI.updateAdvert(editAdvert.id, advertData);
        onClose();
        if (onSuccess) onSuccess();
      } else {
        const response = await buysellAPI.createAdvert(advertData);
        const payment = handleListingCreatePayment(response, navigate);
        if (!payment.redirected) {
          onClose();
          if (onSuccess) onSuccess();
        } else {
          onClose();
        }
      }
    } catch (error) {
      console.error('Error posting item:', error);
      toast.error(error.message || 'Failed to post item');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm"
      >
        <motion.div
          initial={{ scale: 0.9, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          exit={{ scale: 0.9, opacity: 0 }}
          className="bg-white rounded-2xl shadow-2xl max-w-5xl w-full mx-4 max-h-[90vh] overflow-hidden flex flex-col"
        >
          {/* Header */}
          <div className="flex items-center justify-between p-6 border-b border-gray-200">
            <h2 className="text-2xl font-bold text-gray-900">
              {isEditing ? 'Edit Buy & Sell Ad' : 'Post New Item'}
            </h2>
            <button
              onClick={onClose}
              className="text-gray-500 hover:text-gray-700 transition-colors"
            >
              <FiX className="h-6 w-6" />
            </button>
          </div>

          {/* Form Content */}
          <form onSubmit={handleSubmit} className="flex-1 overflow-y-auto p-6 space-y-8">
            {/* Item Type */}
            <div className="bg-gray-50 rounded-xl p-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">What type of listing is this?</h3>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                {itemTypes.map((type) => (
                  <button
                    key={type.value}
                    type="button"
                    onClick={() => setFormData(prev => ({ ...prev, itemType: type.value }))}
                    className={`p-6 rounded-xl border-2 transition-all ${
                      formData.itemType === type.value
                        ? 'border-green-500 bg-green-50'
                        : 'border-gray-200 hover:border-gray-300 bg-white'
                    }`}
                  >
                    <div className="text-4xl mb-3">{type.icon}</div>
                    <h4 className="font-semibold text-gray-900 mb-2">{type.label}</h4>
                    <p className="text-sm text-gray-600">{type.description}</p>
                  </button>
                ))}
              </div>
              {errors.itemType && <p className="text-red-500 text-sm mt-2">{errors.itemType}</p>}
            </div>

            {/* Item Information */}
            <div className="bg-gray-50 rounded-xl p-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Item Information</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Title *</label>
                  <input
                    type="text"
                    value={formData.title}
                    onChange={(e) => setFormData(prev => ({ ...prev, title: e.target.value }))}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
                    placeholder="Enter a descriptive title"
                  />
                  {errors.title && <p className="text-red-500 text-sm mt-1">{errors.title}</p>}
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Condition *</label>
                  <select
                    value={formData.condition}
                    onChange={(e) => setFormData(prev => ({ ...prev, condition: e.target.value }))}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
                  >
                    <option value="">Select condition</option>
                    {conditions.map(cond => (
                      <option key={cond.value} value={cond.value}>{cond.label}</option>
                    ))}
                  </select>
                  {errors.condition && <p className="text-red-500 text-sm mt-1">{errors.condition}</p>}
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Brand</label>
                  <input
                    type="text"
                    value={formData.brand}
                    onChange={(e) => setFormData(prev => ({ ...prev, brand: e.target.value }))}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
                    placeholder="e.g., Apple, Samsung, Nike"
                  />
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Model</label>
                  <input
                    type="text"
                    value={formData.model}
                    onChange={(e) => setFormData(prev => ({ ...prev, model: e.target.value }))}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
                    placeholder="e.g., iPhone 14, Galaxy S23"
                  />
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Category *</label>
                  <select
                    value={formData.category_id}
                    onChange={(e) => setFormData(prev => ({ ...prev, category_id: e.target.value }))}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
                    disabled={loadingCategories}
                  >
                    <option value="">{loadingCategories ? 'Loading categories...' : 'Select category'}</option>
                    {categories.map(cat => (
                      <option key={cat.id} value={cat.id}>{cat.name}</option>
                    ))}
                  </select>
                  {errors.category_id && <p className="text-red-500 text-sm mt-1">{errors.category_id}</p>}
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Color</label>
                  <input
                    type="text"
                    value={formData.color}
                    onChange={(e) => setFormData(prev => ({ ...prev, color: e.target.value }))}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
                    placeholder="e.g., Black, White, Blue"
                  />
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Dimensions</label>
                  <input
                    type="text"
                    value={formData.dimensions}
                    onChange={(e) => setFormData(prev => ({ ...prev, dimensions: e.target.value }))}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
                    placeholder="e.g., 10x5x3 inches"
                  />
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Weight</label>
                  <input
                    type="text"
                    value={formData.weight}
                    onChange={(e) => setFormData(prev => ({ ...prev, weight: e.target.value }))}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
                    placeholder="e.g., 2.5 kg"
                  />
                </div>
              </div>
            </div>

            {/* Media Upload */}
            <div className="bg-gray-50 rounded-xl p-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Upload Images</h3>
              
              {/* Main Image */}
              <div className="mb-6">
                <label className="block text-sm font-medium text-gray-700 mb-2">Main Image *</label>
                <div
                  className={`border-2 border-dashed rounded-xl p-8 text-center transition-all ${
                    dragActive ? 'border-green-500 bg-green-50' : 'border-gray-300 hover:border-gray-400'
                  }`}
                >
                  {mainImagePreview ? (
                    <div className="relative inline-block">
                      <img
                        src={mainImagePreview}
                        alt="Main image preview"
                        className="max-h-64 rounded-lg"
                      />
                      <button
                        type="button"
                        onClick={removeMainImage}
                        className="absolute -top-2 -right-2 bg-red-500 text-white rounded-full w-6 h-6 flex items-center justify-center"
                      >
                        <FiX className="h-3 w-3" />
                      </button>
                    </div>
                  ) : (
                    <div>
                      <FiUpload className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                      <input
                        type="file"
                        accept="image/jpeg,image/png,image/jpg,image/gif"
                        onChange={handleMainImageChange}
                        className="hidden"
                        id="main-image-upload"
                      />
                      <label htmlFor="main-image-upload" className="cursor-pointer">
                        <p className="text-lg font-medium text-gray-700 mb-2">
                          Click to upload main image
                        </p>
                        <p className="text-sm text-gray-500">
                          JPEG, PNG, JPG, GIF up to 10MB
                        </p>
                      </label>
                    </div>
                  )}
                </div>
                {errors.main_image && <p className="text-red-500 text-sm mt-2">{errors.main_image}</p>}
              </div>

              {/* Additional Images */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Additional Images (optional)</label>
                <div
                  className={`border-2 border-dashed rounded-xl p-8 text-center transition-all ${
                    dragActive ? 'border-green-500 bg-green-50' : 'border-gray-300 hover:border-gray-400'
                  }`}
                  onDragEnter={handleDrag}
                  onDragLeave={handleDrag}
                  onDragOver={handleDrag}
                  onDrop={handleDrop}
                >
                  <FiUpload className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                  <input
                    type="file"
                    multiple
                    accept="image/jpeg,image/png,image/jpg,image/gif"
                    onChange={handleAdditionalImagesChange}
                    className="hidden"
                    id="additional-images-upload"
                  />
                  <label htmlFor="additional-images-upload" className="cursor-pointer">
                    <p className="text-lg font-medium text-gray-700 mb-2">
                      Click to upload additional images
                    </p>
                    <p className="text-sm text-gray-500">
                      JPEG, PNG, JPG, GIF up to 10MB each (max 10 images)
                    </p>
                  </label>
                </div>
                
                {/* Additional Images Preview */}
                {additionalImagePreviews.length > 0 && (
                  <div className="mt-6">
                    <h4 className="font-medium text-gray-900 mb-4">
                      Additional Images ({additionalImagePreviews.length}/10)
                    </h4>
                    <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
                      {additionalImagePreviews.map((preview, index) => (
                        <div key={index} className="relative group">
                          <img
                            src={preview}
                            alt={`Additional image ${index + 1}`}
                            className="w-full h-24 object-cover rounded-lg border border-gray-200"
                          />
                          <button
                            type="button"
                            onClick={() => removeAdditionalImage(index)}
                            className="absolute -top-2 -right-2 bg-red-500 text-white rounded-full w-6 h-6 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity"
                          >
                            <FiX className="h-3 w-3" />
                          </button>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            </div>

            {/* Description */}
            <div className="bg-gray-50 rounded-xl p-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Description</h3>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Detailed Description *</label>
                <div className="border border-gray-300 rounded-lg overflow-hidden">
                  <ReactQuill
                    value={formData.description}
                    onChange={(value) => setFormData(prev => ({ ...prev, description: value }))}
                    theme="snow"
                    placeholder="Describe your item in detail including features, condition, usage history, and reason for selling..."
                    style={{ height: '200px' }}
                  />
                </div>
                {errors.description && <p className="text-red-500 text-sm mt-1">{errors.description}</p>}
              </div>
            </div>

            {/* Pricing */}
            <div className="bg-gray-50 rounded-xl p-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Pricing</h3>
              {formData.itemType === 'give_away' ? (
                <div className="bg-green-50 border border-green-200 rounded-xl p-6 text-center">
                  <div className="text-2xl mb-2">🎁</div>
                  <h4 className="text-xl font-semibold text-green-700 mb-2">Give Away</h4>
                  <p className="text-green-600">Item price is free — a paid listing plan still applies</p>
                </div>
              ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Price *</label>
                    <div className="relative">
                      <FiDollarSign className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-5 w-5" />
                      <input
                        type="number"
                        value={formData.price}
                        onChange={(e) => setFormData(prev => ({ ...prev, price: e.target.value }))}
                        className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
                        placeholder="0.00"
                        min="0"
                        step="0.01"
                      />
                    </div>
                    {errors.price && <p className="text-red-500 text-sm mt-1">{errors.price}</p>}
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Currency</label>
                    <select
                      value={formData.currency}
                      onChange={(e) => setFormData(prev => ({ ...prev, currency: e.target.value }))}
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
                    >
                      {currencies.map(curr => (
                        <option key={curr} value={curr}>{curr}</option>
                      ))}
                    </select>
                  </div>
                </div>
              )}
            </div>

            {/* Seller Information */}
            <div className="bg-gray-50 rounded-xl p-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Seller Information</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Name *</label>
                  <input
                    type="text"
                    value={formData.sellerName}
                    onChange={(e) => setFormData(prev => ({ ...prev, sellerName: e.target.value }))}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
                    placeholder="Your name"
                  />
                  {errors.sellerName && <p className="text-red-500 text-sm mt-1">{errors.sellerName}</p>}
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Email *</label>
                  <input
                    type="email"
                    value={formData.seller_email}
                    onChange={(e) => setFormData(prev => ({ ...prev, seller_email: e.target.value }))}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
                    placeholder="your@email.com"
                  />
                  {errors.seller_email && <p className="text-red-500 text-sm mt-1">{errors.seller_email}</p>}
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Preferred Contact *</label>
                  <select
                    value={formData.preferred_contact}
                    onChange={(e) => setFormData(prev => ({ ...prev, preferred_contact: e.target.value }))}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
                  >
                    <option value="email">Email</option>
                    <option value="phone">Phone</option>
                    <option value="both">Both</option>
                  </select>
                  {errors.preferred_contact && <p className="text-red-500 text-sm mt-1">{errors.preferred_contact}</p>}
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Company</label>
                  <input
                    type="text"
                    value={formData.sellerCompany}
                    onChange={(e) => setFormData(prev => ({ ...prev, sellerCompany: e.target.value }))}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
                    placeholder="Company name (optional)"
                  />
                </div>

                {!isEditing && (
                  <div className="md:col-span-2">
                    <VerificationFields
                      mode="phone"
                      phone={formData.sellerPhone}
                      onPhoneChange={(v) => setFormData((prev) => ({ ...prev, sellerPhone: v }))}
                      onVerificationChange={onPhoneVerificationChange}
                      compact
                    />
                  </div>
                )}
              </div>
            </div>

            {/* Location */}
            <div className="bg-gray-50 rounded-xl p-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Location</h3>
              <div className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Country *</label>
                    <input
                      type="text"
                      value={formData.country}
                      onChange={(e) => setFormData(prev => ({ ...prev, country: e.target.value }))}
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
                      placeholder="Country"
                    />
                    {errors.country && <p className="text-red-500 text-sm mt-1">{errors.country}</p>}
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">City *</label>
                    <input
                      type="text"
                      value={formData.city}
                      onChange={(e) => setFormData(prev => ({ ...prev, city: e.target.value }))}
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
                      placeholder="City"
                    />
                  </div>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Address / area</label>
                  <div className="relative">
                    <FiMapPin className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-5 w-5" />
                    <input
                      type="text"
                      value={formData.location}
                      onChange={(e) => setFormData(prev => ({ ...prev, location: e.target.value }))}
                      className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
                      placeholder="Street or area (optional if city set)"
                    />
                  </div>
                  {errors.location && <p className="text-red-500 text-sm mt-1">{errors.location}</p>}
                </div>

                <label className="flex items-center gap-2 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={formData.privacyMode}
                    onChange={(e) => setFormData(prev => ({ ...prev, privacyMode: e.target.checked }))}
                    className="text-green-600 focus:ring-green-500 rounded"
                  />
                  <span className="text-sm font-medium text-gray-700">
                    Show approximate location (privacy mode)
                  </span>
                </label>
              </div>
            </div>

            {/* Visibility Options */}
            <div className="bg-gray-50 rounded-xl p-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Choose Visibility Option</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {upsellOptions.map((option) => (
                  <button
                    key={option.type}
                    type="button"
                    onClick={() => setFormData(prev => ({ ...prev, upsellType: option.type }))}
                    className={`p-6 rounded-xl border-2 transition-all ${
                      formData.upsellType === option.type
                        ? 'border-green-500 bg-green-50'
                        : 'border-gray-200 hover:border-gray-300 bg-white'
                    }`}
                  >
                    {option.recommended && (
                      <div className="bg-green-600 text-white text-xs px-2 py-1 rounded-full font-semibold mb-3 inline-block">
                        RECOMMENDED
                      </div>
                    )}
                    <h4 className="font-semibold text-gray-900 mb-2">{option.name}</h4>
                    <div className="text-2xl font-bold text-green-600 mb-3">
                      ${option.price}
                      <span className="text-sm text-gray-500">/month</span>
                    </div>
                    <ul className="space-y-2 text-sm text-gray-600">
                      {option.features.map((feature, index) => (
                        <li key={index} className="flex items-center gap-2">
                          <FiCheck className="h-4 w-4 text-green-600 flex-shrink-0" />
                          {feature}
                        </li>
                      ))}
                    </ul>
                  </button>
                ))}
              </div>
            </div>

            {/* Terms and Conditions */}
            <div className="bg-gray-50 rounded-xl p-6 space-y-4">
              <label className="flex items-center gap-2 cursor-pointer">
                <input
                  type="checkbox"
                  checked={formData.termsAccepted}
                  onChange={(e) => setFormData(prev => ({ ...prev, termsAccepted: e.target.checked }))}
                  className="text-green-600 focus:ring-green-500 rounded"
                />
                <span className="text-sm text-gray-700">
                  I accept the Terms & Conditions *
                </span>
              </label>
              {errors.termsAccepted && <p className="text-red-500 text-sm">{errors.termsAccepted}</p>}
              
              <label className="flex items-center gap-2 cursor-pointer">
                <input
                  type="checkbox"
                  checked={formData.accuracyConfirmed}
                  onChange={(e) => setFormData(prev => ({ ...prev, accuracyConfirmed: e.target.checked }))}
                  className="text-green-600 focus:ring-green-500 rounded"
                />
                <span className="text-sm text-gray-700">
                  I confirm all information is accurate *
                </span>
              </label>
              {errors.accuracyConfirmed && <p className="text-red-500 text-sm">{errors.accuracyConfirmed}</p>}
            </div>
          </form>

          {/* Footer */}
          <div className="flex items-center justify-end gap-4 p-6 border-t border-gray-200 bg-gray-50">
            <button
              type="button"
              onClick={onClose}
              className="px-6 py-3 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors"
            >
              Cancel
            </button>
            <button
              type="submit"
              onClick={handleSubmit}
              disabled={isSubmitting || !formData.termsAccepted || !formData.accuracyConfirmed}
              className="px-8 py-3 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed font-medium"
            >
              {isSubmitting ? 'Posting...' : 'Post Item'}
            </button>
          </div>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
};

export default BuySellPostForm;
