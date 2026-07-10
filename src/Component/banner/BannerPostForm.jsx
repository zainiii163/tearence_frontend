import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { toast } from 'react-toastify';
import { 
  ArrowLeft, 
  Upload, 
  Image, 
  FileText, 
  Video, 
  Globe,
  Star,
  CheckCircle,
  AlertCircle,
  Eye,
  Zap,
  Crown,
  Sparkles,
  CreditCard,
  Loader2
} from 'lucide-react';

// Import API services
import {
  createBannerAd,
  updateBannerAd,
  getBannerCategories,
  getPromotionOptions,
  uploadBannerImage,
  uploadBusinessLogo,
  uploadAnimatedBanner,
  uploadHTML5Banner,
  uploadVideoBanner
} from '../../api/banner';
import { mapBannerToForm, resolveStorageUrl } from '../../utils/dashboardEditMappers';

const BannerPostForm = ({ onClose, onSuccess, editBanner = null }) => {
  const isEditing = Boolean(editBanner?.id);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [categories, setCategories] = useState([]);
  const [categoriesLoading, setCategoriesLoading] = useState(false);
  const [promotionOptions, setPromotionOptions] = useState([]);
  const [promotionOptionsLoading, setPromotionOptionsLoading] = useState(false);
  const [errors, setErrors] = useState({});
  const [previewUrl, setPreviewUrl] = useState('');

  // Load categories and promotion options on component mount
  useEffect(() => {
    const loadData = async () => {
      try {
        setCategoriesLoading(true);
        setPromotionOptionsLoading(true);
        
        const [categoriesResponse, promotionResponse] = await Promise.all([
          getBannerCategories(),
          getPromotionOptions()
        ]);
        
        if (categoriesResponse) {
          const catsData = categoriesResponse.data;
          if (Array.isArray(catsData)) {
            setCategories(catsData);
          } else if (catsData && typeof catsData === 'object') {
            setCategories(Array.isArray(catsData.items) ? catsData.items : []);
          } else {
            setCategories([]);
          }
        } else {
          setCategories([]);
        }
        
        if (promotionResponse) {
          const promoData = promotionResponse.data;
          if (Array.isArray(promoData)) {
            setPromotionOptions(promoData);
          } else if (promoData && typeof promoData === 'object') {
            setPromotionOptions(Array.isArray(promoData.items) ? promoData.items : []);
          } else {
            setPromotionOptions([]);
          }
        } else {
          setPromotionOptions([]);
          // Add standard tier if no options returned
          setPromotionOptions([{
            tier: 'standard',
            name: 'Standard Banner',
            price: 0,
            currency: 'GBP',
            duration: 30,
            benefits: [
              'Standard visibility',
              'Basic analytics',
              'Email support'
            ]
          }]);
        }
      } catch (error) {
        console.error('Error loading form data:', error);
        setCategories([]);
        setPromotionOptions([{
          tier: 'standard',
          name: 'Standard Banner',
          price: 0,
          currency: 'GBP',
          duration: 30,
          benefits: [
            'Standard visibility',
            'Basic analytics',
            'Email support'
          ]
        }]);
      } finally {
        setCategoriesLoading(false);
        setPromotionOptionsLoading(false);
      }
    };
    loadData();
  }, []);

  const [formData, setFormData] = useState({
    // Banner Type
    bannerType: 'image',
    
    // Business Information
    businessName: '',
    contactPerson: '',
    email: '',
    phone: '',
    website: '',
    businessLogo: null,
    verifiedBadge: false,
    
    // Banner Details
    bannerTitle: '',
    tagline: '',
    category: '',
    country: '',
    city: '',
    targetAudience: '',
    
    // Banner Upload
    bannerFile: null,
    destinationLink: '',
    callToAction: '',
    
    // Banner Size
    bannerSize: '728x90',
    
    // Description
    description: '',
    keySellingPoints: '',
    offerDetails: '',
    validityStart: '',
    validityEnd: '',
    
    // Targeting
    targetCountries: [],
    targetCategories: [],
    targetDevices: 'both',
    
    // Premium Upsell
    selectedTier: 'standard',
    
    // Terms
    termsAccepted: false,
    privacyAccepted: false
  });

  useEffect(() => {
    if (!editBanner) return;
    setFormData((prev) => ({ ...prev, ...mapBannerToForm(editBanner) }));
    const imagePath = editBanner.banner_image || editBanner.image_url;
    if (imagePath) setPreviewUrl(resolveStorageUrl(imagePath));
  }, [editBanner]);

  const bannerTypes = [
    {
      value: 'image',
      label: 'Image Banner',
      icon: Image,
      description: 'Static image banner (JPG/PNG)',
      color: 'from-blue-500 to-blue-600'
    },
    {
      value: 'animated',
      label: 'Animated Banner',
      icon: Sparkles,
      description: 'Animated GIF banner',
      color: 'from-purple-500 to-purple-600'
    },
    {
      value: 'html5',
      label: 'HTML5 Banner',
      icon: FileText,
      description: 'Interactive HTML5 banner (ZIP)',
      color: 'from-green-500 to-green-600'
    },
    {
      value: 'video',
      label: 'Video Banner',
      icon: Video,
      description: 'Video banner (MP4)',
      color: 'from-red-500 to-red-600'
    }
  ];

  const bannerSizes = [
    { value: '728x90', label: '728x90 (Leaderboard)', description: 'Standard horizontal banner' },
    { value: '300x250', label: '300x250 (Medium Rectangle)', description: 'Common square banner' },
    { value: '160x600', label: '160x600 (Skyscraper)', description: 'Vertical banner' },
    { value: '970x250', label: '970x250 (Billboard)', description: 'Large horizontal banner' },
    { value: '468x60', label: '468x60 (Classic Banner)', description: 'Traditional banner size' },
    { value: '1080x1080', label: '1080x1080 (Square Banner)', description: 'Social media square' }
  ];

  const apiCategories = Array.isArray(categories) ? categories : [];
  const categoryOptions = apiCategories.map(cat => ({
    id: cat.id,
    name: cat.name,
    slug: cat.slug
  }));

  const countries = [
    'USA', 'UK', 'UAE', 'Canada', 'Australia', 'Germany',
    'France', 'Italy', 'Spain', 'Japan', 'China', 'India',
    'Brazil', 'Mexico', 'South Africa', 'Singapore', 'Netherlands', 'Sweden'
  ];

  const getTierColor = (tier) => {
    switch(tier) {
      case 'promoted': return 'from-blue-500 to-blue-600';
      case 'featured': return 'from-purple-500 to-purple-600';
      case 'sponsored': return 'from-yellow-500 to-orange-600';
      case 'network_boost': return 'from-red-500 to-pink-600';
      default: return 'from-gray-500 to-gray-600';
    }
  };

  const promotionTiers = promotionOptions.length > 0 ? promotionOptions.map(option => ({
    id: option.tier,
    name: option.name,
    price: option.price,
    duration: `${option.duration} days`,
    features: option.benefits || [],
    badge: option.name,
    color: getTierColor(option.tier),
    popular: option.is_popular || false
  })) : [
    {
      id: 'standard',
      name: 'Standard Banner',
      price: 0,
      duration: '30 days',
      features: [
        'Standard visibility',
        'Basic analytics',
        'Email support'
      ],
      badge: 'None',
      color: 'from-gray-500 to-gray-600',
      popular: false
    }
  ];

  const handleInputChange = (field, value) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }));
    
    if (errors[field]) {
      setErrors(prev => ({
        ...prev,
        [field]: ''
      }));
    }
  };

  const handleFileUpload = (field, file) => {
    setFormData(prev => ({
      ...prev,
      [field]: file
    }));

    if (field === 'bannerFile' && file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setPreviewUrl(reader.result);
      };
      reader.readAsDataURL(file);
    }
  };

  const validateForm = () => {
    const newErrors = {};

    if (!formData.bannerType) {
      newErrors.bannerType = 'Please select a banner type';
    }
    
    if (!formData.businessName.trim()) {
      newErrors.businessName = 'Business name is required';
    }
    
    if (!formData.email.trim()) {
      newErrors.email = 'Email is required';
    } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
      newErrors.email = 'Please enter a valid email';
    }
    
    if (!formData.bannerTitle.trim()) {
      newErrors.bannerTitle = 'Banner title is required';
    }
    
    if (!formData.category) {
      newErrors.category = 'Please select a category';
    }
    
    if (!formData.country) {
      newErrors.country = 'Please select a country';
    }
    
    if (!formData.bannerFile && !(isEditing && previewUrl)) {
      newErrors.bannerFile = 'Please upload a banner file';
    }
    
    if (!formData.destinationLink.trim()) {
      newErrors.destinationLink = 'Destination link is required';
    } else if (!/^https?:\/\/.+/.test(formData.destinationLink)) {
      newErrors.destinationLink = 'Please enter a valid URL';
    }
    
    if (!formData.termsAccepted) {
      newErrors.termsAccepted = 'You must accept the terms';
    }
    
    if (!formData.privacyAccepted) {
      newErrors.privacyAccepted = 'You must accept the privacy policy';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async () => {
    if (!validateForm()) {
      return;
    }

    setIsSubmitting(true);
    
    try {
      // Upload banner file first if provided
      let bannerImageUrl = '';
      if (formData.bannerFile) {
        try {
          let uploadResponse;
          switch (formData.bannerType) {
            case 'animated':
              uploadResponse = await uploadAnimatedBanner(formData.bannerFile, formData.bannerSize || '728x90');
              break;
            case 'html5':
              uploadResponse = await uploadHTML5Banner(formData.bannerFile, formData.bannerSize || '728x90');
              break;
            case 'video':
              uploadResponse = await uploadVideoBanner(formData.bannerFile, formData.bannerSize || '728x90');
              break;
            default:
              uploadResponse = await uploadBannerImage(formData.bannerFile, formData.bannerSize || '728x90');
          }
          
          if (uploadResponse) {
            const uploadData = uploadResponse.data || uploadResponse;
            bannerImageUrl = uploadData.url || uploadData.file_url || uploadData.path || '';
          }
        } catch (uploadError) {
          console.error('Banner file upload failed:', uploadError);
          const apiMessage = uploadError.response?.data?.message;
          const fieldErrors = uploadError.response?.data?.errors;
          const detail = apiMessage
            || (fieldErrors && Object.values(fieldErrors).flat().join(', '))
            || 'Failed to upload banner file. Ensure the image matches the selected banner size exactly.';
          toast.error(detail);
          return;
        }
      }

      // Upload business logo if provided
      let businessLogoUrl = '';
      if (formData.businessLogo && typeof formData.businessLogo === 'object') {
        try {
          const logoResponse = await uploadBusinessLogo(formData.businessLogo);
          if (logoResponse) {
            const logoData = logoResponse.data || logoResponse;
            businessLogoUrl = logoData.url || logoData.file_url || logoData.path || '';
          }
        } catch (uploadError) {
          console.warn('Logo upload failed:', uploadError);
        }
      }

      // Prepare banner data for API matching backend field names exactly
      const bannerData = {
        title: formData.bannerTitle,
        description: formData.description,
        business_name: formData.businessName,
        contact_person: formData.contactPerson,
        email: formData.email,
        phone: formData.phone,
        website_url: formData.website,
        banner_type: formData.bannerType,
        banner_size: formData.bannerSize || '728x90',
        destination_link: formData.destinationLink,
        call_to_action: formData.callToAction,
        key_selling_points: formData.keySellingPoints,
        offer_details: formData.offerDetails,
        validity_start: formData.validityStart || null,
        validity_end: formData.validityEnd || null,
        banner_category_id: formData.category,
        country: formData.country,
        city: formData.city || null,
        target_countries: formData.targetCountries || [],
        target_audience: formData.targetAudience ? (Array.isArray(formData.targetAudience) ? formData.targetAudience : [formData.targetAudience]) : [],
        promotion_tier: formData.selectedTier,
        promotion_price: calculateTotal(),
        is_verified_business: formData.verifiedBadge
      };

      // Only send banner_image or video based on banner_type (backend validation requires this)
      if (formData.bannerType === 'video') {
        bannerData.video = bannerImageUrl || editBanner?.video || '';
      } else {
        bannerData.banner_image = bannerImageUrl || editBanner?.banner_image || editBanner?.image_url || '';
      }

      const response = isEditing
        ? await updateBannerAd(editBanner.id, bannerData)
        : await createBannerAd(bannerData);

      toast.success(isEditing ? 'Banner advert updated successfully!' : 'Banner advert submitted successfully! It will be reviewed shortly.');
      
      if (onSuccess) {
        onSuccess(response.data);
      }
      
      onClose();
      
    } catch (error) {
      console.error('Banner submission error:', error);
      const errorMessage = error.response?.data?.message || error.message || 'Failed to submit banner advert';
      toast.error(errorMessage);
    } finally {
      setIsSubmitting(false);
    }
  };

  const calculateTotal = () => {
    const tier = promotionTiers.find(t => t.id === formData.selectedTier);
    return tier ? tier.price : 0;
  };

  return (
    <div className="bg-white rounded-2xl shadow-xl max-w-5xl mx-auto max-h-[90vh] overflow-y-auto">
      {/* Header */}
      <div className="sticky top-0 bg-white border-b border-gray-200 p-6 z-10">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-4">
            <button
              onClick={onClose}
              className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
            >
              <ArrowLeft className="w-5 h-5" />
            </button>
            <div>
              <h2 className="text-2xl font-bold text-gray-900">Post Banner Advert</h2>
              <p className="text-gray-600">Fill in all details to create your banner advert</p>
            </div>
          </div>
        </div>
      </div>

      {/* Form Content - Single Page */}
      <div className="p-6 space-y-8">
        
        {/* Section 1: Banner Type */}
        <div className="space-y-4">
          <div>
            <h3 className="text-lg font-semibold text-gray-900 mb-2">Select Banner Type</h3>
            <p className="text-gray-600">Choose the type of banner you want to create</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            {bannerTypes.map((type) => {
              const Icon = type.icon;
              return (
                <button
                  key={type.value}
                  onClick={() => handleInputChange('bannerType', type.value)}
                  className={`p-4 rounded-xl border-2 transition-all ${
                    formData.bannerType === type.value
                      ? 'border-blue-500 bg-blue-50'
                      : 'border-gray-200 hover:border-gray-300'
                  }`}
                >
                  <div className={`w-12 h-12 rounded-lg bg-gradient-to-r ${type.color} flex items-center justify-center text-white mb-3`}>
                    <Icon className="w-6 h-6" />
                  </div>
                  <h4 className="font-semibold text-gray-900 mb-1">{type.label}</h4>
                  <p className="text-sm text-gray-600">{type.description}</p>
                  {formData.bannerType === type.value && (
                    <div className="mt-2 text-blue-600 text-sm font-medium">
                      <CheckCircle className="w-4 h-4 inline mr-1" />
                      Selected
                    </div>
                  )}
                </button>
              );
            })}
          </div>

          {errors.bannerType && (
            <div className="flex items-center gap-2 text-red-600 text-sm">
              <AlertCircle className="w-4 h-4" />
              {errors.bannerType}
            </div>
          )}
        </div>

        {/* Section 2: Business Information */}
        <div className="space-y-4">
          <div>
            <h3 className="text-lg font-semibold text-gray-900 mb-2">Business Information</h3>
            <p className="text-gray-600">Tell us about your business</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Business Name *
              </label>
              <input
                type="text"
                value={formData.businessName}
                onChange={(e) => handleInputChange('businessName', e.target.value)}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                placeholder="Enter your business name"
              />
              {errors.businessName && (
                <div className="flex items-center gap-2 text-red-600 text-sm mt-1">
                  <AlertCircle className="w-4 h-4" />
                  {errors.businessName}
                </div>
              )}
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Contact Person
              </label>
              <input
                type="text"
                value={formData.contactPerson}
                onChange={(e) => handleInputChange('contactPerson', e.target.value)}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                placeholder="Contact person name"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Email Address *
              </label>
              <input
                type="email"
                value={formData.email}
                onChange={(e) => handleInputChange('email', e.target.value)}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                placeholder="business@example.com"
              />
              {errors.email && (
                <div className="flex items-center gap-2 text-red-600 text-sm mt-1">
                  <AlertCircle className="w-4 h-4" />
                  {errors.email}
                </div>
              )}
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Phone Number
              </label>
              <input
                type="tel"
                value={formData.phone}
                onChange={(e) => handleInputChange('phone', e.target.value)}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                placeholder="+1 (555) 123-4567"
              />
            </div>

            <div className="md:col-span-2">
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Website URL
              </label>
              <input
                type="url"
                value={formData.website}
                onChange={(e) => handleInputChange('website', e.target.value)}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                placeholder="https://www.example.com"
              />
            </div>

            <div className="md:col-span-2">
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Business Logo
              </label>
              <div className="border-2 border-dashed border-gray-300 rounded-lg p-6 text-center hover:border-gray-400 transition-colors">
                <input
                  type="file"
                  accept="image/*"
                  onChange={(e) => handleFileUpload('businessLogo', e.target.files[0])}
                  className="hidden"
                  id="business-logo"
                />
                <label htmlFor="business-logo" className="cursor-pointer">
                  <Upload className="w-8 h-8 text-gray-400 mx-auto mb-2" />
                  <p className="text-sm text-gray-600">
                    {formData.businessLogo ? formData.businessLogo.name : 'Click to upload business logo'}
                  </p>
                  <p className="text-xs text-gray-500 mt-1">PNG, JPG up to 5MB</p>
                </label>
              </div>
            </div>

            <div className="md:col-span-2">
              <label className="flex items-center gap-3 cursor-pointer">
                <input
                  type="checkbox"
                  checked={formData.verifiedBadge}
                  onChange={(e) => handleInputChange('verifiedBadge', e.target.checked)}
                  className="w-4 h-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
                />
                <div>
                  <span className="text-gray-700 font-medium">Verified Business Badge</span>
                  <p className="text-sm text-gray-500">Add a verified badge to build trust (additional fee applies)</p>
                </div>
              </label>
            </div>
          </div>
        </div>

        {/* Section 3: Banner Details */}
        <div className="space-y-4">
          <div>
            <h3 className="text-lg font-semibold text-gray-900 mb-2">Banner Details</h3>
            <p className="text-gray-600">Provide details about your banner advert</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="md:col-span-2">
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Banner Title *
              </label>
              <input
                type="text"
                value={formData.bannerTitle}
                onChange={(e) => handleInputChange('bannerTitle', e.target.value)}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                placeholder="Enter an attractive title for your banner"
              />
              {errors.bannerTitle && (
                <div className="flex items-center gap-2 text-red-600 text-sm mt-1">
                  <AlertCircle className="w-4 h-4" />
                  {errors.bannerTitle}
                </div>
              )}
            </div>

            <div className="md:col-span-2">
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Short Tagline (max 80 characters)
              </label>
              <input
                type="text"
                value={formData.tagline}
                onChange={(e) => handleInputChange('tagline', e.target.value.slice(0, 80))}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                placeholder="Brief tagline for your banner"
              />
              <div className="text-xs text-gray-500 mt-1">
                {formData.tagline.length}/80 characters
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Category *
              </label>
              <select
                value={formData.category}
                onChange={(e) => handleInputChange('category', e.target.value)}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                disabled={categoriesLoading}
              >
                <option value="">{categoriesLoading ? 'Loading categories...' : 'Select a category'}</option>
                {categoryOptions.map((cat) => (
                  <option key={cat.id} value={cat.id}>{cat.name}</option>
                ))}
              </select>
              {errors.category && (
                <div className="flex items-center gap-2 text-red-600 text-sm mt-1">
                  <AlertCircle className="w-4 h-4" />
                  {errors.category}
                </div>
              )}
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Country *
              </label>
              <select
                value={formData.country}
                onChange={(e) => handleInputChange('country', e.target.value)}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              >
                <option value="">Select a country</option>
                {countries.map((country) => (
                  <option key={country} value={country}>{country}</option>
                ))}
              </select>
              {errors.country && (
                <div className="flex items-center gap-2 text-red-600 text-sm mt-1">
                  <AlertCircle className="w-4 h-4" />
                  {errors.country}
                </div>
              )}
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                City (Optional)
              </label>
              <input
                type="text"
                value={formData.city}
                onChange={(e) => handleInputChange('city', e.target.value)}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                placeholder="City name"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Target Audience (Optional)
              </label>
              <input
                type="text"
                value={formData.targetAudience}
                onChange={(e) => handleInputChange('targetAudience', e.target.value)}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                placeholder="Describe your target audience"
              />
            </div>
          </div>
        </div>

        {/* Section 4: Banner Upload & Size */}
        <div className="space-y-4">
          <div>
            <h3 className="text-lg font-semibold text-gray-900 mb-2">Banner Upload & Size</h3>
            <p className="text-gray-600">Upload your banner file and choose its size</p>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* File Upload */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Banner File *
              </label>
              <div className="border-2 border-dashed border-gray-300 rounded-lg p-6 text-center hover:border-gray-400 transition-colors">
                <input
                  type="file"
                  accept={
                    formData.bannerType === 'image' ? 'image/*' :
                    formData.bannerType === 'animated' ? 'image/gif' :
                    formData.bannerType === 'html5' ? '.zip' :
                    formData.bannerType === 'video' ? 'video/*' : '*'
                  }
                  onChange={(e) => handleFileUpload('bannerFile', e.target.files[0])}
                  className="hidden"
                  id="banner-file"
                />
                <label htmlFor="banner-file" className="cursor-pointer">
                  <Upload className="w-8 h-8 text-gray-400 mx-auto mb-2" />
                  <p className="text-sm text-gray-600">
                    {formData.bannerFile ? formData.bannerFile.name : 'Click to upload banner'}
                  </p>
                  <p className="text-xs text-gray-500 mt-1">
                    {formData.bannerType === 'image' ? 'PNG, JPG up to 5MB' :
                     formData.bannerType === 'animated' ? 'GIF up to 10MB' :
                     formData.bannerType === 'html5' ? 'ZIP file up to 20MB' :
                     formData.bannerType === 'video' ? 'MP4 up to 50MB' : ''}
                  </p>
                </label>
              </div>
              {errors.bannerFile && (
                <div className="flex items-center gap-2 text-red-600 text-sm mt-1">
                  <AlertCircle className="w-4 h-4" />
                  {errors.bannerFile}
                </div>
              )}
            </div>

            {/* Preview */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Live Preview
              </label>
              <div className="border border-gray-300 rounded-lg p-4 bg-gray-50 min-h-[200px] flex items-center justify-center">
                {previewUrl ? (
                  <img
                    src={previewUrl}
                    alt="Banner preview"
                    className="max-w-full max-h-[150px] object-contain"
                  />
                ) : (
                  <div className="text-center text-gray-500">
                    <Eye className="w-8 h-8 mx-auto mb-2" />
                    <p className="text-sm">Banner preview will appear here</p>
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* Banner Size Selection */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Banner Size *
            </label>
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
              {bannerSizes.map((size) => (
                <button
                  key={size.value}
                  onClick={() => handleInputChange('bannerSize', size.value)}
                  className={`p-3 rounded-xl border-2 transition-all ${
                    formData.bannerSize === size.value
                      ? 'border-blue-500 bg-blue-50'
                      : 'border-gray-200 hover:border-gray-300'
                  }`}
                >
                  <div className="aspect-video bg-gray-200 rounded mb-2 flex items-center justify-center text-xs text-gray-500">
                    {size.value}
                  </div>
                  <p className="text-xs font-medium text-gray-900">{size.label}</p>
                  {formData.bannerSize === size.value && (
                    <CheckCircle className="w-4 h-4 text-blue-600 mx-auto mt-1" />
                  )}
                </button>
              ))}
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="md:col-span-2">
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Destination Link *
              </label>
              <input
                type="url"
                value={formData.destinationLink}
                onChange={(e) => handleInputChange('destinationLink', e.target.value)}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                placeholder="https://www.example.com/destination"
              />
              {errors.destinationLink && (
                <div className="flex items-center gap-2 text-red-600 text-sm mt-1">
                  <AlertCircle className="w-4 h-4" />
                  {errors.destinationLink}
                </div>
              )}
            </div>

            <div className="md:col-span-2">
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Call-to-Action Text
              </label>
              <input
                type="text"
                value={formData.callToAction}
                onChange={(e) => handleInputChange('callToAction', e.target.value)}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                placeholder="Click Here, Learn More, Shop Now, etc."
              />
            </div>
          </div>
        </div>

        {/* Section 5: Description & Details */}
        <div className="space-y-4">
          <div>
            <h3 className="text-lg font-semibold text-gray-900 mb-2">Description & Details</h3>
            <p className="text-gray-600">Provide comprehensive information about your banner</p>
          </div>

          <div className="space-y-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Description
              </label>
              <textarea
                value={formData.description}
                onChange={(e) => handleInputChange('description', e.target.value)}
                rows={4}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                placeholder="Describe your banner advert in detail..."
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Key Selling Points
              </label>
              <textarea
                value={formData.keySellingPoints}
                onChange={(e) => handleInputChange('keySellingPoints', e.target.value)}
                rows={3}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                placeholder="List the key benefits and selling points..."
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Offer Details
              </label>
              <textarea
                value={formData.offerDetails}
                onChange={(e) => handleInputChange('offerDetails', e.target.value)}
                rows={3}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                placeholder="Describe any special offers or promotions..."
              />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Validity Start Date (Optional)
                </label>
                <input
                  type="date"
                  value={formData.validityStart}
                  onChange={(e) => handleInputChange('validityStart', e.target.value)}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Validity End Date (Optional)
                </label>
                <input
                  type="date"
                  value={formData.validityEnd}
                  onChange={(e) => handleInputChange('validityEnd', e.target.value)}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
              </div>
            </div>
          </div>
        </div>

        {/* Section 6: Targeting Options */}
        <div className="space-y-4">
          <div>
            <h3 className="text-lg font-semibold text-gray-900 mb-2">Targeting Options (Optional)</h3>
            <p className="text-gray-600">Define your target audience and reach</p>
          </div>

          <div className="space-y-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Target Countries
              </label>
              <div className="grid grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-3">
                {countries.map((country) => (
                  <label key={country} className="flex items-center gap-2 cursor-pointer">
                    <input
                      type="checkbox"
                      checked={formData.targetCountries.includes(country)}
                      onChange={(e) => {
                        if (e.target.checked) {
                          handleInputChange('targetCountries', [...formData.targetCountries, country]);
                        } else {
                          handleInputChange('targetCountries', formData.targetCountries.filter(c => c !== country));
                        }
                      }}
                      className="w-4 h-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
                    />
                    <span className="text-sm text-gray-700">{country}</span>
                  </label>
                ))}
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Target Devices
              </label>
              <div className="flex gap-4">
                {[
                  { value: 'desktop', label: 'Desktop Only' },
                  { value: 'mobile', label: 'Mobile Only' },
                  { value: 'both', label: 'Both Desktop & Mobile' }
                ].map((device) => (
                  <label key={device.value} className="flex items-center gap-2 cursor-pointer">
                    <input
                      type="radio"
                      name="targetDevices"
                      value={device.value}
                      checked={formData.targetDevices === device.value}
                      onChange={(e) => handleInputChange('targetDevices', e.target.value)}
                      className="w-4 h-4 text-blue-600 border-gray-300 focus:ring-blue-500"
                    />
                    <span className="text-sm text-gray-700">{device.label}</span>
                  </label>
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* Section 7: Premium Upsell Options */}
        <div className="space-y-4">
          <div>
            <h3 className="text-lg font-semibold text-gray-900 mb-2">Premium Upsell Options</h3>
            <p className="text-gray-600">Choose your promotion tier for enhanced visibility</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            {promotionTiers.map((tier) => (
              <button
                key={tier.id}
                onClick={() => handleInputChange('selectedTier', tier.id)}
                className={`relative p-4 rounded-xl border-2 transition-all ${
                  formData.selectedTier === tier.id
                    ? 'border-blue-500 bg-blue-50'
                    : 'border-gray-200 hover:border-gray-300'
                }`}
              >
                {tier.popular && (
                  <div className="absolute -top-2 -right-2 px-2 py-1 bg-gradient-to-r from-orange-500 to-red-500 text-white text-xs font-semibold rounded-full">
                    Most Popular
                  </div>
                )}
                
                <div className={`w-12 h-12 rounded-lg bg-gradient-to-r ${tier.color} flex items-center justify-center text-white mb-3`}>
                  {tier.id === 'standard' && <Globe className="w-6 h-6" />}
                  {tier.id === 'promoted' && <Star className="w-6 h-6" />}
                  {tier.id === 'featured' && <Crown className="w-6 h-6" />}
                  {tier.id === 'sponsored' && <Zap className="w-6 h-6" />}
                  {tier.id === 'network_boost' && <Sparkles className="w-6 h-6" />}
                </div>
                
                <h4 className="font-semibold text-gray-900 mb-1">{tier.name}</h4>
                <div className="text-2xl font-bold text-gray-900 mb-2">
                  £{tier.price}
                  <span className="text-sm font-normal text-gray-600">/{tier.duration}</span>
                </div>
                
                <ul className="space-y-2 mb-4">
                  {tier.features.slice(0, 4).map((feature, index) => (
                    <li key={index} className="flex items-start gap-2 text-sm text-gray-600">
                      <CheckCircle className="w-3 h-3 text-green-500 mt-0.5 flex-shrink-0" />
                      {feature}
                    </li>
                  ))}
                </ul>
                
                {formData.selectedTier === tier.id && (
                  <div className="mt-2 text-blue-600 text-sm font-medium">
                    <CheckCircle className="w-4 h-4 inline mr-1" />
                    Selected
                  </div>
                )}
              </button>
            ))}
          </div>
        </div>

        {/* Section 8: Terms & Submit */}
        <div className="space-y-4">
          <div>
            <h3 className="text-lg font-semibold text-gray-900 mb-2">Final Submission</h3>
            <p className="text-gray-600">Review and submit your banner advert</p>
          </div>

          {/* Order Summary */}
          <div className="bg-gray-50 rounded-lg p-6">
            <h4 className="font-semibold text-gray-900 mb-4">Order Summary</h4>
            <div className="space-y-3">
              <div className="flex justify-between">
                <span className="text-gray-600">Banner Type:</span>
                <span className="font-medium text-gray-900">
                  {bannerTypes.find(t => t.value === formData.bannerType)?.label}
                </span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600">Business Name:</span>
                <span className="font-medium text-gray-900">{formData.businessName}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600">Banner Title:</span>
                <span className="font-medium text-gray-900">{formData.bannerTitle}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600">Category:</span>
                <span className="font-medium text-gray-900">
                  {categoryOptions.find(c => c.id === formData.category)?.name || formData.category}
                </span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600">Banner Size:</span>
                <span className="font-medium text-gray-900">{formData.bannerSize}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600">Promotion Tier:</span>
                <span className="font-medium text-gray-900">
                  {promotionTiers.find(t => t.id === formData.selectedTier)?.name}
                </span>
              </div>
              <div className="border-t pt-3 mt-3">
                <div className="flex justify-between">
                  <span className="text-lg font-semibold text-gray-900">Total Cost:</span>
                  <span className="text-lg font-bold text-blue-600">£{calculateTotal()}</span>
                </div>
              </div>
            </div>
          </div>

          {/* Terms and Conditions */}
          <div className="space-y-4">
            <label className="flex items-start gap-3 cursor-pointer">
              <input
                type="checkbox"
                checked={formData.termsAccepted}
                onChange={(e) => handleInputChange('termsAccepted', e.target.checked)}
                className="w-4 h-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500 mt-1"
              />
              <span className="text-sm text-gray-700">
                I confirm this banner information is accurate and complies with all applicable laws and regulations
              </span>
            </label>
            {errors.termsAccepted && (
              <div className="flex items-center gap-2 text-red-600 text-sm">
                <AlertCircle className="w-4 h-4" />
                {errors.termsAccepted}
              </div>
            )}

            <label className="flex items-start gap-3 cursor-pointer">
              <input
                type="checkbox"
                checked={formData.privacyAccepted}
                onChange={(e) => handleInputChange('privacyAccepted', e.target.checked)}
                className="w-4 h-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500 mt-1"
              />
              <span className="text-sm text-gray-700">
                I agree to the terms of service and privacy policy
              </span>
            </label>
            {errors.privacyAccepted && (
              <div className="flex items-center gap-2 text-red-600 text-sm">
                <AlertCircle className="w-4 h-4" />
                {errors.privacyAccepted}
              </div>
            )}
          </div>

          {/* Payment Info */}
          {calculateTotal() > 0 && (
            <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
              <div className="flex items-center gap-2 text-blue-900">
                <CreditCard className="w-5 h-5" />
                <span className="font-medium">Payment Information</span>
              </div>
              <p className="text-sm text-blue-800 mt-2">
                After submission, you will be redirected to our secure payment gateway to complete your purchase.
              </p>
            </div>
          )}
        </div>

      </div>

      {/* Submit Button */}
      <div className="sticky bottom-0 bg-white border-t border-gray-200 p-6">
        <button
          onClick={handleSubmit}
          disabled={isSubmitting || categoriesLoading}
          className="w-full px-6 py-3 bg-gradient-to-r from-blue-600 to-purple-600 text-white rounded-lg hover:from-blue-700 hover:to-purple-700 transition-all disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2 text-lg font-semibold"
        >
          {isSubmitting || categoriesLoading ? (
            <>
              <Loader2 className="w-5 h-5 animate-spin" />
              Submitting Banner Advert...
            </>
          ) : (
            'Submit Banner Advert'
          )}
        </button>
      </div>
    </div>
  );
};

export default BannerPostForm;
