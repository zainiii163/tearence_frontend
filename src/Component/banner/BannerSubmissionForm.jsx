import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Upload, 
  X, 
  Plus, 
  Trash2, 
  Eye, 
  MousePointer,
  Calendar,
  Globe,
  Target,
  DollarSign,
  Check,
  AlertCircle,
  Image as ImageIcon,
  Video,
  FileText,
  Play,
  Star,
  Crown,
  Zap,
  TrendingUp
} from 'lucide-react';
import { 
  createBannerAd,
  uploadBannerImage,
  uploadBusinessLogo,
  getBannerCategories,
  getPromotionOptions
} from '../../api/banner';

const BannerSubmissionForm = ({ onSuccess, onCancel, initialData = null }) => {
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    business_name: '',
    contact_person: '',
    email: '',
    phone: '',
    website_url: '',
    banner_type: 'image',
    banner_size: '728x90',
    banner_image: null,
    business_logo: null,
    destination_link: '',
    call_to_action: '',
    key_selling_points: '',
    offer_details: '',
    validity_start: '',
    validity_end: '',
    banner_category_id: '',
    country: '',
    city: '',
    target_countries: [],
    target_audience: [],
    promotion_tier: 'standard',
    is_verified_business: false
  });

  const [categories, setCategories] = useState([]);
  const [promotionOptions, setPromotionOptions] = useState([]);
  const [loading, setLoading] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [errors, setErrors] = useState({});
  const [uploadedImages, setUploadedImages] = useState({
    banner_image: null,
    business_logo: null
  });
  const [currentStep, setCurrentStep] = useState(1);
  const [showPreview, setShowPreview] = useState(false);

  const bannerSizes = [
    { value: '728x90', label: 'Leaderboard (728×90)', width: 728, height: 90 },
    { value: '300x250', label: 'Medium Rectangle (300×250)', width: 300, height: 250 },
    { value: '160x600', label: 'Skyscraper (160×600)', width: 160, height: 600 },
    { value: '970x250', label: 'Billboard (970×250)', width: 970, height: 250 },
    { value: '468x60', label: 'Classic Banner (468×60)', width: 468, height: 60 },
    { value: '1080x1080', label: 'Square Social (1080×1080)', width: 1080, height: 1080 }
  ];

  const promotionTiers = [
    { 
      value: 'standard', 
      label: 'Standard', 
      icon: Star,
      color: 'gray',
      description: 'Basic banner placement',
      price: 0
    },
    { 
      value: 'promoted', 
      label: 'Promoted', 
      icon: TrendingUp,
      color: 'blue',
      description: 'Enhanced visibility',
      price: 25
    },
    { 
      value: 'featured', 
      label: 'Featured', 
      icon: Crown,
      color: 'yellow',
      description: 'Premium placement',
      price: 50
    },
    { 
      value: 'sponsored', 
      label: 'Sponsored', 
      icon: Zap,
      color: 'purple',
      description: 'Top placement',
      price: 100
    },
    { 
      value: 'network_boost', 
      label: 'Top Spotlight', 
      icon: Crown,
      color: 'red',
      description: 'Maximum exposure',
      price: 200
    }
  ];

  const bannerTypes = [
    { value: 'image', label: 'Image Banner', icon: ImageIcon, accept: 'image/*' },
    { value: 'animated', label: 'Animated Banner', icon: Play, accept: 'image/gif,video/mp4' },
    { value: 'html5', label: 'HTML5 Banner', icon: FileText, accept: '.html,.zip' },
    { value: 'video', label: 'Video Banner', icon: Video, accept: 'video/*' }
  ];

  const countries = [
    'United States', 'United Kingdom', 'Canada', 'Australia', 'Germany', 
    'France', 'Italy', 'Spain', 'Netherlands', 'Sweden', 'Norway', 'Denmark',
    'India', 'Pakistan', 'Bangladesh', 'Sri Lanka', 'China', 'Japan', 'South Korea',
    'Singapore', 'Malaysia', 'Thailand', 'Indonesia', 'Philippines', 'Vietnam'
  ];

  useEffect(() => {
    loadInitialData();
    if (initialData) {
      setFormData(initialData);
    }
  }, [initialData]);

  const loadInitialData = async () => {
    try {
      const [categoriesRes, promotionsRes] = await Promise.all([
        getBannerCategories(),
        getPromotionOptions()
      ]);
      
      if (categoriesRes?.data) {
        setCategories(categoriesRes.data);
      }
      
      if (promotionsRes?.data) {
        setPromotionOptions(promotionsRes.data);
      }
    } catch (error) {
      console.error('Error loading initial data:', error);
    }
  };

  const handleInputChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value
    }));
    
    // Clear error for this field
    if (errors[name]) {
      setErrors(prev => ({ ...prev, [name]: '' }));
    }
  };

  const handleFileUpload = async (file, type) => {
    if (!file) return;

    setUploading(true);
    try {
      let response;
      if (type === 'banner_image') {
        response = await uploadBannerImage(file);
      } else if (type === 'business_logo') {
        response = await uploadBusinessLogo(file);
      }

      if (response?.data) {
        setUploadedImages(prev => ({
          ...prev,
          [type]: response.data
        }));
        setFormData(prev => ({
          ...prev,
          [type]: response.data.filename || response.data.url
        }));
      }
    } catch (error) {
      console.error('Upload error:', error);
      setErrors(prev => ({
        ...prev,
        [type]: 'Failed to upload file. Please try again.'
      }));
    } finally {
      setUploading(false);
    }
  };

  const validateForm = () => {
    const newErrors = {};
    
    if (!formData.title.trim()) newErrors.title = 'Title is required';
    if (!formData.business_name.trim()) newErrors.business_name = 'Business name is required';
    if (!formData.email.trim()) newErrors.email = 'Email is required';
    if (!formData.destination_link.trim()) newErrors.destination_link = 'Destination link is required';
    if (!formData.banner_category_id) newErrors.banner_category_id = 'Category is required';
    if (!formData.country) newErrors.country = 'Country is required';
    if (!formData.banner_image) newErrors.banner_image = 'Banner image is required';
    
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (formData.email && !emailRegex.test(formData.email)) {
      newErrors.email = 'Invalid email format';
    }
    
    const urlRegex = /^https?:\/\/.+/;
    if (formData.destination_link && !urlRegex.test(formData.destination_link)) {
      newErrors.destination_link = 'Please enter a valid URL (http:// or https://)';
    }
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!validateForm()) {
      return;
    }

    setLoading(true);
    try {
      const submissionData = {
        ...formData,
        target_countries: formData.target_countries.join(','),
        target_audience: formData.target_audience.join(',')
      };

      const response = await createBannerAd(submissionData);
      
      if (response?.data) {
        onSuccess?.(response.data);
      } else {
        throw new Error('Failed to create banner ad');
      }
    } catch (error) {
      console.error('Submission error:', error);
      setErrors(prev => ({
        ...prev,
        submit: error.message || 'Failed to submit banner ad. Please try again.'
      }));
    } finally {
      setLoading(false);
    }
  };

  const nextStep = () => {
    if (currentStep < 4) {
      setCurrentStep(currentStep + 1);
    }
  };

  const prevStep = () => {
    if (currentStep > 1) {
      setCurrentStep(currentStep - 1);
    }
  };

  const renderStepContent = () => {
    switch (currentStep) {
      case 1:
        return (
          <div className="space-y-6">
            <h3 className="text-lg font-semibold text-gray-900">Basic Information</h3>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Banner Title *
                </label>
                <input
                  type="text"
                  name="title"
                  value={formData.title}
                  onChange={handleInputChange}
                  className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent ${
                    errors.title ? 'border-red-500' : 'border-gray-300'
                  }`}
                  placeholder="Enter banner title"
                />
                {errors.title && (
                  <p className="mt-1 text-sm text-red-600">{errors.title}</p>
                )}
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Business Name *
                </label>
                <input
                  type="text"
                  name="business_name"
                  value={formData.business_name}
                  onChange={handleInputChange}
                  className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent ${
                    errors.business_name ? 'border-red-500' : 'border-gray-300'
                  }`}
                  placeholder="Enter business name"
                />
                {errors.business_name && (
                  <p className="mt-1 text-sm text-red-600">{errors.business_name}</p>
                )}
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Contact Person
                </label>
                <input
                  type="text"
                  name="contact_person"
                  value={formData.contact_person}
                  onChange={handleInputChange}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  placeholder="Enter contact person name"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Email *
                </label>
                <input
                  type="email"
                  name="email"
                  value={formData.email}
                  onChange={handleInputChange}
                  className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent ${
                    errors.email ? 'border-red-500' : 'border-gray-300'
                  }`}
                  placeholder="Enter email address"
                />
                {errors.email && (
                  <p className="mt-1 text-sm text-red-600">{errors.email}</p>
                )}
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Phone
                </label>
                <input
                  type="tel"
                  name="phone"
                  value={formData.phone}
                  onChange={handleInputChange}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  placeholder="Enter phone number"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Website URL
                </label>
                <input
                  type="url"
                  name="website_url"
                  value={formData.website_url}
                  onChange={handleInputChange}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  placeholder="https://example.com"
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Description
              </label>
              <textarea
                name="description"
                value={formData.description}
                onChange={handleInputChange}
                rows={4}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                placeholder="Describe your banner advertisement"
              />
            </div>
          </div>
        );

      case 2:
        return (
          <div className="space-y-6">
            <h3 className="text-lg font-semibold text-gray-900">Banner Details</h3>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Banner Type
                </label>
                <div className="grid grid-cols-2 gap-3">
                  {bannerTypes.map(type => {
                    const Icon = type.icon;
                    return (
                      <button
                        key={type.value}
                        type="button"
                        onClick={() => setFormData(prev => ({ ...prev, banner_type: type.value }))}
                        className={`p-3 border rounded-lg flex flex-col items-center justify-center gap-2 transition-colors ${
                          formData.banner_type === type.value
                            ? 'border-blue-500 bg-blue-50'
                            : 'border-gray-300 hover:border-gray-400'
                        }`}
                      >
                        <Icon className="w-6 h-6" />
                        <span className="text-sm font-medium">{type.label}</span>
                      </button>
                    );
                  })}
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Banner Size *
                </label>
                <select
                  name="banner_size"
                  value={formData.banner_size}
                  onChange={handleInputChange}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                >
                  {bannerSizes.map(size => (
                    <option key={size.value} value={size.value}>
                      {size.label}
                    </option>
                  ))}
                </select>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Banner Image *
                </label>
                <div className="border-2 border-dashed border-gray-300 rounded-lg p-6 text-center hover:border-gray-400 transition-colors">
                  <input
                    type="file"
                    accept={bannerTypes.find(t => t.value === formData.banner_type)?.accept || 'image/*'}
                    onChange={(e) => handleFileUpload(e.target.files[0], 'banner_image')}
                    className="hidden"
                    id="banner-image-upload"
                  />
                  <label htmlFor="banner-image-upload" className="cursor-pointer">
                    {uploading ? (
                      <div className="flex flex-col items-center">
                        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mb-2"></div>
                        <span className="text-sm text-gray-600">Uploading...</span>
                      </div>
                    ) : uploadedImages.banner_image ? (
                      <div className="flex flex-col items-center">
                        <Check className="w-8 h-8 text-green-500 mb-2" />
                        <span className="text-sm text-gray-600">Image uploaded successfully</span>
                      </div>
                    ) : (
                      <div className="flex flex-col items-center">
                        <Upload className="w-8 h-8 text-gray-400 mb-2" />
                        <span className="text-sm text-gray-600">Click to upload banner image</span>
                        <span className="text-xs text-gray-500 mt-1">
                          {bannerSizes.find(s => s.value === formData.banner_size)?.label} recommended
                        </span>
                      </div>
                    )}
                  </label>
                </div>
                {errors.banner_image && (
                  <p className="mt-1 text-sm text-red-600">{errors.banner_image}</p>
                )}
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Business Logo
                </label>
                <div className="border-2 border-dashed border-gray-300 rounded-lg p-6 text-center hover:border-gray-400 transition-colors">
                  <input
                    type="file"
                    accept="image/*"
                    onChange={(e) => handleFileUpload(e.target.files[0], 'business_logo')}
                    className="hidden"
                    id="business-logo-upload"
                  />
                  <label htmlFor="business-logo-upload" className="cursor-pointer">
                    {uploading ? (
                      <div className="flex flex-col items-center">
                        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mb-2"></div>
                        <span className="text-sm text-gray-600">Uploading...</span>
                      </div>
                    ) : uploadedImages.business_logo ? (
                      <div className="flex flex-col items-center">
                        <Check className="w-8 h-8 text-green-500 mb-2" />
                        <span className="text-sm text-gray-600">Logo uploaded successfully</span>
                      </div>
                    ) : (
                      <div className="flex flex-col items-center">
                        <Upload className="w-8 h-8 text-gray-400 mb-2" />
                        <span className="text-sm text-gray-600">Click to upload business logo</span>
                        <span className="text-xs text-gray-500 mt-1">Optional</span>
                      </div>
                    )}
                  </label>
                </div>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Destination Link *
                </label>
                <input
                  type="url"
                  name="destination_link"
                  value={formData.destination_link}
                  onChange={handleInputChange}
                  className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent ${
                    errors.destination_link ? 'border-red-500' : 'border-gray-300'
                  }`}
                  placeholder="https://your-landing-page.com"
                />
                {errors.destination_link && (
                  <p className="mt-1 text-sm text-red-600">{errors.destination_link}</p>
                )}
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Call to Action
                </label>
                <input
                  type="text"
                  name="call_to_action"
                  value={formData.call_to_action}
                  onChange={handleInputChange}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  placeholder="Shop Now, Learn More, etc."
                />
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Key Selling Points
                </label>
                <textarea
                  name="key_selling_points"
                  value={formData.key_selling_points}
                  onChange={handleInputChange}
                  rows={3}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  placeholder="Enter key selling points (one per line)"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Offer Details
                </label>
                <textarea
                  name="offer_details"
                  value={formData.offer_details}
                  onChange={handleInputChange}
                  rows={3}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  placeholder="Describe special offers or promotions"
                />
              </div>
            </div>
          </div>
        );

      case 3:
        return (
          <div className="space-y-6">
            <h3 className="text-lg font-semibold text-gray-900">Targeting & Promotion</h3>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Banner Category *
                </label>
                <select
                  name="banner_category_id"
                  value={formData.banner_category_id}
                  onChange={handleInputChange}
                  className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent ${
                    errors.banner_category_id ? 'border-red-500' : 'border-gray-300'
                  }`}
                >
                  <option value="">Select a category</option>
                  {categories.map(category => (
                    <option key={category.id} value={category.id}>
                      {category.name}
                    </option>
                  ))}
                </select>
                {errors.banner_category_id && (
                  <p className="mt-1 text-sm text-red-600">{errors.banner_category_id}</p>
                )}
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Country *
                </label>
                <select
                  name="country"
                  value={formData.country}
                  onChange={handleInputChange}
                  className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent ${
                    errors.country ? 'border-red-500' : 'border-gray-300'
                  }`}
                >
                  <option value="">Select country</option>
                  {countries.map(country => (
                    <option key={country} value={country}>
                      {country}
                    </option>
                  ))}
                </select>
                {errors.country && (
                  <p className="mt-1 text-sm text-red-600">{errors.country}</p>
                )}
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  City
                </label>
                <input
                  type="text"
                  name="city"
                  value={formData.city}
                  onChange={handleInputChange}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  placeholder="Enter city name"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Promotion Tier
                </label>
                <div className="space-y-3">
                  {promotionTiers.map(tier => {
                    const Icon = tier.icon;
                    return (
                      <label
                        key={tier.value}
                        className={`flex items-center p-3 border rounded-lg cursor-pointer transition-colors ${
                          formData.promotion_tier === tier.value
                            ? 'border-blue-500 bg-blue-50'
                            : 'border-gray-300 hover:border-gray-400'
                        }`}
                      >
                        <input
                          type="radio"
                          name="promotion_tier"
                          value={tier.value}
                          checked={formData.promotion_tier === tier.value}
                          onChange={handleInputChange}
                          className="sr-only"
                        />
                        <Icon className={`w-5 h-5 mr-3 text-${tier.color}-500`} />
                        <div className="flex-1">
                          <div className="flex items-center justify-between">
                            <span className="font-medium">{tier.label}</span>
                            {tier.price > 0 && (
                              <span className="text-sm font-semibold text-gray-900">
                                ${tier.price}
                              </span>
                            )}
                          </div>
                          <p className="text-sm text-gray-600">{tier.description}</p>
                        </div>
                      </label>
                    );
                  })}
                </div>
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Target Countries
              </label>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-2">
                {countries.slice(0, 12).map(country => (
                  <label key={country} className="flex items-center">
                    <input
                      type="checkbox"
                      checked={formData.target_countries.includes(country)}
                      onChange={(e) => {
                        if (e.target.checked) {
                          setFormData(prev => ({
                            ...prev,
                            target_countries: [...prev.target_countries, country]
                          }));
                        } else {
                          setFormData(prev => ({
                            ...prev,
                            target_countries: prev.target_countries.filter(c => c !== country)
                          }));
                        }
                      }}
                      className="mr-2"
                    />
                    <span className="text-sm">{country}</span>
                  </label>
                ))}
              </div>
            </div>
          </div>
        );

      case 4:
        return (
          <div className="space-y-6">
            <h3 className="text-lg font-semibold text-gray-900">Review & Submit</h3>
            
            <div className="bg-gray-50 rounded-lg p-6">
              <h4 className="font-medium text-gray-900 mb-4">Banner Preview</h4>
              <div className="bg-white border rounded-lg p-4">
                <div className="flex items-center gap-4 mb-4">
                  {uploadedImages.business_logo ? (
                    <img
                      src={uploadedImages.business_logo.url || uploadedImages.business_logo}
                      alt="Business Logo"
                      className="w-12 h-12 object-contain"
                    />
                  ) : (
                    <div className="w-12 h-12 bg-gray-200 rounded flex items-center justify-center">
                      <ImageIcon className="w-6 h-6 text-gray-400" />
                    </div>
                  )}
                  <div>
                    <h5 className="font-semibold">{formData.title || 'Untitled Banner'}</h5>
                    <p className="text-sm text-gray-600">{formData.business_name}</p>
                  </div>
                </div>
                
                {uploadedImages.banner_image ? (
                  <img
                    src={uploadedImages.banner_image.url || uploadedImages.banner_image}
                    alt="Banner"
                    className="w-full h-32 object-cover rounded mb-4"
                  />
                ) : (
                  <div className="w-full h-32 bg-gray-200 rounded flex items-center justify-center mb-4">
                    <ImageIcon className="w-8 h-8 text-gray-400" />
                  </div>
                )}
                
                <p className="text-sm text-gray-600 mb-2">{formData.description}</p>
                {formData.call_to_action && (
                  <button className="bg-blue-600 text-white px-4 py-2 rounded text-sm">
                    {formData.call_to_action}
                  </button>
                )}
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <h4 className="font-medium text-gray-900 mb-2">Campaign Details</h4>
                <dl className="space-y-2 text-sm">
                  <div className="flex justify-between">
                    <dt className="text-gray-600">Banner Type:</dt>
                    <dd className="font-medium">{formData.banner_type}</dd>
                  </div>
                  <div className="flex justify-between">
                    <dt className="text-gray-600">Size:</dt>
                    <dd className="font-medium">{formData.banner_size}</dd>
                  </div>
                  <div className="flex justify-between">
                    <dt className="text-gray-600">Category:</dt>
                    <dd className="font-medium">{categories.find(c => c.id == formData.banner_category_id)?.name || 'Not selected'}</dd>
                  </div>
                  <div className="flex justify-between">
                    <dt className="text-gray-600">Country:</dt>
                    <dd className="font-medium">{formData.country}</dd>
                  </div>
                </dl>
              </div>

              <div>
                <h4 className="font-medium text-gray-900 mb-2">Promotion Details</h4>
                <dl className="space-y-2 text-sm">
                  <div className="flex justify-between">
                    <dt className="text-gray-600">Tier:</dt>
                    <dd className="font-medium">{promotionTiers.find(t => t.value === formData.promotion_tier)?.label}</dd>
                  </div>
                  <div className="flex justify-between">
                    <dt className="text-gray-600">Price:</dt>
                    <dd className="font-medium">
                      ${promotionTiers.find(t => t.value === formData.promotion_tier)?.price || 0}
                    </dd>
                  </div>
                  <div className="flex justify-between">
                    <dt className="text-gray-600">Target Countries:</dt>
                    <dd className="font-medium">{formData.target_countries.length} selected</dd>
                  </div>
                </dl>
              </div>
            </div>

            <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
              <div className="flex items-start">
                <AlertCircle className="w-5 h-5 text-blue-600 mt-0.5 mr-3 flex-shrink-0" />
                <div className="text-sm text-blue-800">
                  <p className="font-medium mb-1">Submission Notice</p>
                  <p>Once submitted, your banner will be reviewed by our team before going live. You'll receive a confirmation email within 24 hours.</p>
                </div>
              </div>
            </div>
          </div>
        );

      default:
        return null;
    }
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        exit={{ opacity: 0, scale: 0.95 }}
        className="bg-white rounded-xl shadow-xl max-w-4xl w-full max-h-[90vh] overflow-y-auto"
      >
        <div className="sticky top-0 bg-white border-b border-gray-200 px-6 py-4">
          <div className="flex items-center justify-between">
            <h2 className="text-xl font-semibold text-gray-900">
              {initialData ? 'Edit Banner Ad' : 'Create Banner Ad'}
            </h2>
            <button
              onClick={onCancel}
              className="text-gray-400 hover:text-gray-600 transition-colors"
            >
              <X className="w-6 h-6" />
            </button>
          </div>
          
          {/* Progress Steps */}
          <div className="flex items-center justify-between mt-4">
            {[1, 2, 3, 4].map(step => (
              <div key={step} className="flex items-center">
                <div
                  className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-medium transition-colors ${
                    currentStep >= step
                      ? 'bg-blue-600 text-white'
                      : 'bg-gray-200 text-gray-600'
                  }`}
                >
                  {step}
                </div>
                {step < 4 && (
                  <div
                    className={`w-12 h-0.5 mx-2 transition-colors ${
                      currentStep > step ? 'bg-blue-600' : 'bg-gray-200'
                    }`}
                  />
                )}
              </div>
            ))}
          </div>
        </div>

        <form onSubmit={handleSubmit} className="p-6">
          <AnimatePresence mode="wait">
            <motion.div
              key={currentStep}
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
              transition={{ duration: 0.2 }}
            >
              {renderStepContent()}
            </motion.div>
          </AnimatePresence>

          {errors.submit && (
            <div className="mt-4 bg-red-50 border border-red-200 rounded-lg p-4">
              <p className="text-sm text-red-800">{errors.submit}</p>
            </div>
          )}

          <div className="flex items-center justify-between mt-8 pt-6 border-t border-gray-200">
            <div className="flex items-center gap-4">
              {currentStep > 1 && (
                <button
                  type="button"
                  onClick={prevStep}
                  className="px-4 py-2 text-gray-700 hover:text-gray-900 transition-colors"
                >
                  Previous
                </button>
              )}
            </div>
            
            <div className="flex items-center gap-4">
              <button
                type="button"
                onClick={onCancel}
                className="px-4 py-2 text-gray-700 hover:text-gray-900 transition-colors"
              >
                Cancel
              </button>
              
              {currentStep < 4 ? (
                <button
                  type="button"
                  onClick={nextStep}
                  className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
                >
                  Next
                </button>
              ) : (
                <button
                  type="submit"
                  disabled={loading}
                  className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {loading ? (
                    <div className="flex items-center">
                      <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                      Submitting...
                    </div>
                  ) : (
                    'Submit Banner Ad'
                  )}
                </button>
              )}
            </div>
          </div>
        </form>
      </motion.div>
    </div>
  );
};

export default BannerSubmissionForm;
