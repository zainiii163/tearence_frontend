import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { FiX, FiArrowLeft, FiArrowRight, FiCheck, FiUpload, FiDollarSign, FiMapPin, FiUser, FiMail, FiPhone, FiGlobe, FiShield, FiStar } from 'react-icons/fi';
import ReactQuill from 'react-quill';
import 'react-quill/dist/quill.snow.css';
import { buysellAPI } from '../../api/buysell';

const BuySellPostForm = ({ onClose, onSuccess }) => {
  const [currentStep, setCurrentStep] = useState(1);
  const [formData, setFormData] = useState({
    // Step 1
    itemType: 'for_sale',
    // Step 2
    title: '',
    condition: '',
    brand: '',
    model: '',
    color: '',
    dimensions: '',
    weight: '',
    category: '',
    // Step 3
    images: [],
    // Step 4
    description: '',
    // Step 5
    price: '',
    currency: 'USD',
    // Step 6
    sellerName: '',
    sellerEmail: '',
    sellerPhone: '',
    sellerCompany: '',
    sellerWebsite: '',
    sellerLogo: null,
    verifiedSeller: false,
    // Step 7
    location: '',
    coordinates: null,
    privacyMode: false,
    // Step 8
    upsellType: 'basic',
    // Step 9
    termsAccepted: false,
    accuracyConfirmed: false
  });

  const [errors, setErrors] = useState({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [dragActive, setDragActive] = useState(false);

  const totalSteps = 8;
  const stepTitles = [
    'Item Type',
    'Item Information',
    'Media Upload',
    'Description',
    'Pricing',
    'Seller Information',
    'Location',
    'Review & Submit'
  ];

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

  const categories = [
    'Electronics', 'Vehicles', 'Fashion', 'Books', 'Gaming', 'Sports', 'Baby', 'Home', 'Tools', 'Music', 'Cameras', 'Pets', 'Other'
  ];

  const currencies = ['USD', 'EUR', 'GBP', 'CAD', 'AUD', 'JPY'];

  const upsellOptions = [
    {
      type: 'basic',
      name: 'Basic Listing',
      price: 0,
      features: ['Standard visibility', '30 days listing', 'Basic support'],
      recommended: false
    },
    {
      type: 'promoted',
      name: 'Promoted Listing',
      price: 29,
      features: ['Enhanced visibility', '60 days listing', 'Priority support', 'Promoted badge'],
      recommended: false
    },
    {
      type: 'featured',
      name: 'Featured Item',
      price: 49,
      features: ['Top placement', '90 days listing', 'Premium support', 'Featured badge'],
      recommended: true
    },
    {
      type: 'sponsored',
      name: 'Sponsored Post',
      price: 99,
      features: ['Homepage placement', '180 days listing', 'Dedicated support', 'Sponsored badge', 'Analytics dashboard'],
      recommended: false
    }
  ];

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
    handleFileUpload(files);
  };

  const handleFileUpload = (files) => {
    const validFiles = files.filter(file => {
      if (!file.type.startsWith('image/')) {
        return false;
      }
      if (file.size > 10 * 1024 * 1024) { // 10MB
        return false;
      }
      return true;
    });

    const newImages = validFiles.map(file => ({
      file,
      preview: URL.createObjectURL(file),
      name: file.name
    }));

    setFormData(prev => ({
      ...prev,
      images: [...prev.images, ...newImages].slice(0, 10) // Max 10 images
    }));
  };

  const removeImage = (index) => {
    setFormData(prev => ({
      ...prev,
      images: prev.images.filter((_, i) => i !== index)
    }));
  };

  const validateStep = (step) => {
    const newErrors = {};
    
    switch (step) {
      case 1:
        if (!formData.itemType) newErrors.itemType = 'Please select an item type';
        break;
      case 2:
        if (!formData.title.trim()) newErrors.title = 'Title is required';
        if (!formData.condition) newErrors.condition = 'Condition is required';
        if (!formData.category) newErrors.category = 'Category is required';
        break;
      case 3:
        if (formData.images.length === 0) newErrors.images = 'At least one image is required';
        break;
      case 4:
        if (!formData.description.trim()) newErrors.description = 'Description is required';
        break;
      case 5:
        if (formData.itemType !== 'give_away' && (!formData.price || formData.price <= 0)) {
          newErrors.price = 'Price is required';
        }
        break;
      case 6:
        if (!formData.sellerName.trim()) newErrors.sellerName = 'Name is required';
        if (!formData.sellerEmail.trim()) newErrors.sellerEmail = 'Email is required';
        break;
      case 7:
        if (!formData.location.trim()) newErrors.location = 'Location is required';
        break;
      case 8:
        if (!formData.termsAccepted) newErrors.termsAccepted = 'You must accept the terms';
        if (!formData.accuracyConfirmed) newErrors.accuracyConfirmed = 'You must confirm accuracy';
        break;
    }
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleNext = () => {
    if (validateStep(currentStep)) {
      if (currentStep < totalSteps) {
        setCurrentStep(currentStep + 1);
      }
    }
  };

  const handlePrevious = () => {
    if (currentStep > 1) {
      setCurrentStep(currentStep - 1);
    }
  };

  const handleSubmit = async () => {
    if (!validateStep(currentStep)) return;
    
    setIsSubmitting(true);
    try {
      // Prepare form data for API
      const advertData = {
        title: formData.title,
        description: formData.description,
        category: formData.category,
        condition: formData.condition,
        price: formData.price,
        negotiable: formData.negotiable || false,
        country: formData.country || 'United States',
        city: formData.city || '',
        address: formData.address || '',
        postalCode: formData.postalCode || '',
        contactName: formData.sellerName,
        contactEmail: formData.sellerEmail,
        contactPhone: formData.sellerPhone,
        preferredContact: formData.preferredContact || 'email',
        showPhone: formData.showPhone || false,
        brand: formData.brand || '',
        model: formData.model || '',
        color: formData.color || '',
        dimensions: formData.dimensions || '',
        weight: formData.weight || '',
        material: formData.material || '',
        usageDuration: formData.usageDuration || '',
        reasonForSelling: formData.reasonForSelling || '',
        deliveryAvailable: formData.deliveryAvailable || false,
        deliveryCost: formData.deliveryCost || '',
        warranty: formData.warranty || false,
        warrantyPeriod: formData.warrantyPeriod || '',
        images: formData.images || [],
        video: formData.video || null,
        promotionPlan: formData.upsellType === 'basic' ? null : formData.upsellType,
        promotionDuration: '30'
      };

      await buysellAPI.createAdvert(advertData);
      
      // Success - close form and trigger success callback
      onClose();
      if (onSuccess) {
        onSuccess();
      }
    } catch (error) {
      console.error('Error posting item:', error);
      // Error is already handled by the API service with toast notifications
    } finally {
      setIsSubmitting(false);
    }
  };

  const renderStep = () => {
    switch (currentStep) {
      case 1:
        return (
          <motion.div
            initial={{ opacity: 0, x: 50 }}
            animate={{ opacity: 1, x: 0 }}
            className="space-y-6"
          >
            <h3 className="text-xl font-semibold text-gray-900 mb-6">What type of listing is this?</h3>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              {itemTypes.map((type) => (
                <button
                  key={type.value}
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
          </motion.div>
        );

      case 2:
        return (
          <motion.div
            initial={{ opacity: 0, x: 50 }}
            animate={{ opacity: 1, x: 0 }}
            className="space-y-6"
          >
            <h3 className="text-xl font-semibold text-gray-900 mb-6">Item Information</h3>
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
                  value={formData.category}
                  onChange={(e) => setFormData(prev => ({ ...prev, category: e.target.value }))}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
                >
                  <option value="">Select category</option>
                  {categories.map(cat => (
                    <option key={cat} value={cat.toLowerCase()}>{cat}</option>
                  ))}
                </select>
                {errors.category && <p className="text-red-500 text-sm mt-1">{errors.category}</p>}
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
          </motion.div>
        );

      case 3:
        return (
          <motion.div
            initial={{ opacity: 0, x: 50 }}
            animate={{ opacity: 1, x: 0 }}
            className="space-y-6"
          >
            <h3 className="text-xl font-semibold text-gray-900 mb-6">Upload Images</h3>
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
                accept="image/*"
                onChange={(e) => handleFileUpload(Array.from(e.target.files))}
                className="hidden"
                id="file-upload"
              />
              <label htmlFor="file-upload" className="cursor-pointer">
                <p className="text-lg font-medium text-gray-700 mb-2">
                  {dragActive ? 'Drop images here' : 'Click to upload or drag and drop'}
                </p>
                <p className="text-sm text-gray-500">
                  PNG, JPG, GIF up to 10MB each (max 10 images)
                </p>
              </label>
            </div>
            
            {errors.images && <p className="text-red-500 text-sm mt-2">{errors.images}</p>}
            
            {/* Image Preview */}
            {formData.images.length > 0 && (
              <div className="mt-6">
                <h4 className="font-medium text-gray-900 mb-4">
                  Uploaded Images ({formData.images.length}/10)
                </h4>
                <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
                  {formData.images.map((image, index) => (
                    <div key={index} className="relative group">
                      <img
                        src={image.preview}
                        alt={image.name}
                        className="w-full h-24 object-cover rounded-lg border border-gray-200"
                      />
                      <button
                        onClick={() => removeImage(index)}
                        className="absolute -top-2 -right-2 bg-red-500 text-white rounded-full w-6 h-6 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity"
                      >
                        <FiX className="h-3 w-3" />
                      </button>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </motion.div>
        );

      case 4:
        return (
          <motion.div
            initial={{ opacity: 0, x: 50 }}
            animate={{ opacity: 1, x: 0 }}
            className="space-y-6"
          >
            <h3 className="text-xl font-semibold text-gray-900 mb-6">Description</h3>
            <div className="space-y-4">
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
          </motion.div>
        );

      case 5:
        return (
          <motion.div
            initial={{ opacity: 0, x: 50 }}
            animate={{ opacity: 1, x: 0 }}
            className="space-y-6"
          >
            <h3 className="text-xl font-semibold text-gray-900 mb-6">Pricing</h3>
            {formData.itemType === 'give_away' ? (
              <div className="bg-green-50 border border-green-200 rounded-xl p-6 text-center">
                <div className="text-2xl mb-2">🎁</div>
                <h4 className="text-xl font-semibold text-green-700 mb-2">Give Away</h4>
                <p className="text-green-600">This item will be listed for free</p>
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
          </motion.div>
        );

      case 6:
        return (
          <motion.div
            initial={{ opacity: 0, x: 50 }}
            animate={{ opacity: 1, x: 0 }}
            className="space-y-6"
          >
            <h3 className="text-xl font-semibold text-gray-900 mb-6">Seller Information</h3>
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
                  value={formData.sellerEmail}
                  onChange={(e) => setFormData(prev => ({ ...prev, sellerEmail: e.target.value }))}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
                  placeholder="your@email.com"
                />
                {errors.sellerEmail && <p className="text-red-500 text-sm mt-1">{errors.sellerEmail}</p>}
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Phone</label>
                <input
                  type="tel"
                  value={formData.sellerPhone}
                  onChange={(e) => setFormData(prev => ({ ...prev, sellerPhone: e.target.value }))}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
                  placeholder="+1 (555) 123-4567"
                />
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
              
              <div className="md:col-span-2">
                <label className="flex items-center gap-2 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={formData.verifiedSeller}
                    onChange={(e) => setFormData(prev => ({ ...prev, verifiedSeller: e.target.checked }))}
                    className="text-green-600 focus:ring-green-500 rounded"
                  />
                  <span className="text-sm font-medium text-gray-700">
                    Get verified badge for $5/month
                  </span>
                  <FiShield className="h-4 w-4 text-green-600" />
                </label>
              </div>
            </div>
          </motion.div>
        );

      case 7:
        return (
          <motion.div
            initial={{ opacity: 0, x: 50 }}
            animate={{ opacity: 1, x: 0 }}
            className="space-y-6"
          >
            <h3 className="text-xl font-semibold text-gray-900 mb-6">Location</h3>
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Location *</label>
                <div className="relative">
                  <FiMapPin className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-5 w-5" />
                  <input
                    type="text"
                    value={formData.location}
                    onChange={(e) => setFormData(prev => ({ ...prev, location: e.target.value }))}
                    className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
                    placeholder="Enter city or address"
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
          </motion.div>
        );

      case 8:
        return (
          <motion.div
            initial={{ opacity: 0, x: 50 }}
            animate={{ opacity: 1, x: 0 }}
            className="space-y-6"
          >
            <h3 className="text-xl font-semibold text-gray-900 mb-6">Choose Visibility Option</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {upsellOptions.map((option) => (
                <button
                  key={option.type}
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
                    {option.price > 0 && <span className="text-sm text-gray-500">/month</span>}
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
          </motion.div>
        );
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
          className="bg-white rounded-2xl shadow-2xl max-w-4xl w-full mx-4 max-h-[90vh] overflow-hidden flex flex-col"
        >
          {/* Header */}
          <div className="flex items-center justify-between p-6 border-b border-gray-200">
            <h2 className="text-2xl font-bold text-gray-900">Post New Item</h2>
            <button
              onClick={onClose}
              className="text-gray-500 hover:text-gray-700 transition-colors"
            >
              <FiX className="h-6 w-6" />
            </button>
          </div>

          {/* Progress Bar */}
          <div className="px-6 py-4 bg-gray-50 border-b border-gray-200">
            <div className="flex items-center justify-between mb-2">
              <span className="text-sm font-medium text-gray-600">Step {currentStep} of {totalSteps}</span>
              <span className="text-sm font-medium text-gray-900">{stepTitles[currentStep - 1]}</span>
            </div>
            <div className="w-full bg-gray-200 rounded-full h-2">
              <motion.div
                className="bg-green-600 h-2 rounded-full"
                initial={{ width: `${((currentStep - 1) / totalSteps) * 100}%` }}
                animate={{ width: `${(currentStep / totalSteps) * 100}%` }}
                transition={{ duration: 0.3 }}
              />
            </div>
          </div>

          {/* Form Content */}
          <div className="flex-1 overflow-y-auto p-6">
            {renderStep()}
          </div>

          {/* Footer */}
          <div className="flex items-center justify-between p-6 border-t border-gray-200 bg-gray-50">
            <button
              onClick={handlePrevious}
              disabled={currentStep === 1}
              className="flex items-center gap-2 px-6 py-3 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
            >
              <FiArrowLeft className="h-4 w-4" />
              Previous
            </button>

            {currentStep === totalSteps ? (
              <div className="space-y-4">
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
                
                <button
                  onClick={handleSubmit}
                  disabled={isSubmitting || !formData.termsAccepted || !formData.accuracyConfirmed}
                  className="flex items-center gap-2 px-8 py-3 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed font-medium"
                >
                  {isSubmitting ? 'Posting...' : 'Post Item'}
                  <FiArrowRight className="h-4 w-4" />
                </button>
              </div>
            ) : (
              <button
                onClick={handleNext}
                className="flex items-center gap-2 px-8 py-3 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors font-medium"
              >
                Next
                <FiArrowRight className="h-4 w-4" />
              </button>
            )}
          </div>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
};

export default BuySellPostForm;
