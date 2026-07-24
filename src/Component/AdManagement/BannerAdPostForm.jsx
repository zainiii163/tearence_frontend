import React, { useState, useEffect } from 'react';
import { 
  FaAd, FaImage, FaVideo, FaFileCode, FaGlobe, FaCheckCircle, 
  FaStar, FaCrown, FaRocket, FaGem, FaUpload, FaEye, FaTimes,
  FaBusinessTime, FaUser, FaEnvelope, FaPhone, FaLink, FaTag,
  FaMapMarkerAlt, FaBullseye, FaDesktop, FaMobile, FaShieldAlt,
  FaStickyNote, FaCreditCard, FaArrowRight, FaChartLine
} from 'react-icons/fa';
import toast from 'react-hot-toast';

const BannerAdPostForm = ({ onClose }) => {
  const [currentStep, setCurrentStep] = useState(1);
  const [selectedTier, setSelectedTier] = useState('');
  const [formData, setFormData] = useState({
    postType: 'standard',
    businessInfo: {
      businessName: '',
      contactPerson: '',
      email: '',
      phone: '',
      websiteUrl: '',
      businessLogo: null,
      verifiedBadge: false
    },
    bannerDetails: {
      title: '',
      tagline: '',
      category: '',
      country: '',
      city: '',
      targetAudience: ''
    },
    bannerUpload: {
      file: null,
      destinationLink: '',
      callToAction: 'Learn More'
    },
    bannerSize: '728x90',
    description: {
      description: '',
      sellingPoints: '',
      offerDetails: '',
      validityDates: ''
    },
    targeting: {
      targetCountries: [],
      targetCategories: [],
      targetDevices: 'both'
    },
    termsAccepted: false,
    accuracyConfirmed: false
  });

  const [previewImage, setPreviewImage] = useState(null);
  const [loading, setLoading] = useState(false);
  const [showStickySummary, setShowStickySummary] = useState(false);
  const [formProgress, setFormProgress] = useState(25);

  const postTypes = [
    { value: 'standard', label: 'Standard Banner', icon: <FaImage /> },
    { value: 'animated', label: 'Animated Banner (GIF)', icon: <FaImage /> },
    { value: 'html5', label: 'HTML5 Banner', icon: <FaFileCode /> },
    { value: 'video', label: 'Video Banner', icon: <FaVideo /> }
  ];

  const categories = [
    'Real Estate', 'Vehicles', 'Travel', 'Jobs', 'Services', 
    'Events', 'Books', 'Fashion', 'Tech', 'Other'
  ];

  const bannerSizes = [
    { value: '728x90', label: '728×90 (Leaderboard)', width: 728, height: 90 },
    { value: '300x250', label: '300×250 (Medium Rectangle)', width: 300, height: 250 },
    { value: '160x600', label: '160×600 (Skyscraper)', width: 160, height: 600 },
    { value: '970x250', label: '970×250 (Billboard)', width: 970, height: 250 },
    { value: '468x60', label: '468×60 (Classic Banner)', width: 468, height: 60 },
    { value: '1080x1080', label: '1080×1080 (Square Social)', width: 1080, height: 1080 }
  ];

  const premiumTiers = [
    {
      id: 'promoted',
      name: 'Promoted Banner',
      badge: '⭐',
      price: 29,
      benefits: [
        'Highlighted banner',
        'Appears above standard banners',
        '"Promoted" badge',
        '2× more visibility'
      ],
      color: 'from-blue-500 to-blue-600',
      popular: false
    },
    {
      id: 'featured',
      name: 'Featured Banner',
      badge: '🌟',
      price: 79,
      benefits: [
        'Top of category pages',
        'Larger banner preview',
        'Priority in search results',
        'Weekly "Featured Banners" email',
        '"Featured" badge'
      ],
      color: 'from-purple-500 to-purple-600',
      popular: true
    },
    {
      id: 'sponsored',
      name: 'Sponsored Banner',
      badge: '🚀',
      price: 199,
      benefits: [
        'Homepage placement',
        'Category top placement',
        'Homepage slider inclusion',
        'Social media promotion',
        '"Sponsored" badge',
        'Maximum visibility'
      ],
      color: 'from-orange-500 to-orange-600',
      popular: false
    },
    {
      id: 'network',
      name: 'Network-Wide Boost',
      badge: '👑',
      price: 499,
      benefits: [
        'Appears across multiple pages',
        'Banner Ads page',
        'Homepage',
        'Category pages',
        'Related search pages',
        'Email newsletters',
        'Push notifications',
        '"Top Spotlight" badge'
      ],
      color: 'from-yellow-500 to-yellow-600',
      popular: false
    }
  ];

  const handleInputChange = (section, field, value) => {
    setFormData(prev => ({
      ...prev,
      [section]: {
        ...prev[section],
        [field]: value
      }
    }));
  };

  const handleFileUpload = (e) => {
    const file = e.target.files[0];
    if (file) {
      setFormData(prev => ({
        ...prev,
        bannerUpload: {
          ...prev.bannerUpload,
          file: file
        }
      }));
      
      const reader = new FileReader();
      reader.onloadend = () => {
        setPreviewImage(reader.result);
      };
      reader.readAsDataURL(file);
    }
  };

  useEffect(() => {
    const calculateProgress = () => {
      let progress = 25; // Base progress for post type selection
      
      if (formData.businessInfo.businessName && formData.businessInfo.email) progress += 15;
      if (formData.bannerDetails.title && formData.bannerDetails.category) progress += 20;
      if (formData.bannerUpload.file) progress += 15;
      if (formData.description.description) progress += 10;
      if (formData.termsAccepted && formData.accuracyConfirmed) progress += 15;
      
      setFormProgress(Math.min(progress, 100));
    };
    
    calculateProgress();
  }, [formData]);

  useEffect(() => {
    const handleScroll = () => {
      setShowStickySummary(window.scrollY > 400);
    };
    
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!formData.termsAccepted || !formData.accuracyConfirmed) {
      toast.error('Please accept terms and confirm accuracy');
      return;
    }
    
    setLoading(true);
    try {
      // API call would go here
      toast.success('Banner ad submitted successfully!');
      // Reset form or redirect to payment
    } catch (error) {
      toast.error('Failed to submit banner ad');
    } finally {
      setLoading(false);
    }
  };

  const selectedSize = bannerSizes.find(size => size.value === formData.bannerSize);

  return (
    <div className="page-container">
      {/* Header */}
      <div className="text-center mb-8">
        <div className="inline-flex items-center justify-center w-16 h-16 bg-gradient-to-r from-blue-500 to-purple-600 rounded-full mb-4">
          <FaAd className="w-8 h-8 text-white" />
        </div>
        <h1 className="text-4xl font-bold text-gray-900 mb-2">Banner Advertisement Posting</h1>
        <p className="text-lg text-gray-600">Create stunning banner ads that convert</p>
      </div>

      {/* Enhanced Progress Bar */}
        <div className="mb-8">
          <div className="max-w-3xl mx-auto">
            <div className="flex items-center justify-between mb-2">
              <span className="text-sm font-medium text-gray-700">Form Completion</span>
              <span className="text-sm font-medium text-gray-700">{formProgress}%</span>
            </div>
            <div className="w-full bg-gray-200 rounded-full h-3 overflow-hidden">
              <div 
                className="h-full bg-gradient-to-r from-blue-500 to-purple-600 rounded-full transition-all duration-500 ease-out flex items-center justify-end pr-2"
                style={{ width: `${formProgress}%` }}
              >
                {formProgress > 10 && (
                  <div className="w-2 h-2 bg-white rounded-full animate-pulse"></div>
                )}
              </div>
            </div>
            <div className="flex items-center justify-between mt-4">
              {[1, 2, 3, 4].map((step) => (
                <div key={step} className="flex items-center">
                  <div className={`w-10 h-10 rounded-full flex items-center justify-center transition-all duration-300 ${
                    formProgress >= step * 25 ? 'bg-gradient-to-r from-blue-500 to-purple-600 text-white scale-110' : 'bg-gray-200 text-gray-500'
                  }`}>
                    {step}
                  </div>
                  {step < 4 && (
                    <div className={`w-24 h-1 mx-2 transition-all duration-500 ${
                      formProgress > step * 25 ? 'bg-gradient-to-r from-blue-500 to-purple-600' : 'bg-gray-200'
                    }`} />
                  )}
                </div>
              ))}
            </div>
          </div>
        </div>

        <form onSubmit={handleSubmit} className="space-y-8">
          {/* Step 1: Post Type Selection */}
          <div className="bg-white rounded-2xl shadow-lg p-8 border border-gray-100">
            <h2 className="text-2xl font-bold text-gray-900 mb-6 flex items-center">
              <FaTag className="mr-3 text-blue-500" />
              Select Banner Type
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
              {postTypes.map((type) => (
                <label
                  key={type.value}
                  className={`relative cursor-pointer rounded-xl p-6 border-2 transition-all ${
                    formData.postType === type.value
                      ? 'border-blue-500 bg-blue-50 shadow-md'
                      : 'border-gray-200 hover:border-gray-300'
                  }`}
                >
                  <input
                    type="radio"
                    name="postType"
                    value={type.value}
                    checked={formData.postType === type.value}
                    onChange={(e) => setFormData(prev => ({ ...prev, postType: e.target.value }))}
                    className="sr-only"
                  />
                  <div className="text-center">
                    <div className="text-3xl mb-3 text-blue-500">{type.icon}</div>
                    <div className="font-medium text-gray-900">{type.label}</div>
                    {formData.postType === type.value && (
                      <FaCheckCircle className="absolute top-2 right-2 text-blue-500" />
                    )}
                  </div>
                </label>
              ))}
            </div>
          </div>

          {/* Step 2: Business Information */}
          <div className="bg-white rounded-2xl shadow-lg p-8 border border-gray-100">
            <h2 className="text-2xl font-bold text-gray-900 mb-6 flex items-center">
              <FaBusinessTime className="mr-3 text-purple-500" />
              Business Information
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Business Name *</label>
                <input
                  type="text"
                  value={formData.businessInfo.businessName}
                  onChange={(e) => handleInputChange('businessInfo', 'businessName', e.target.value)}
                  className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                  placeholder="Your business name"
                  required
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Contact Person *</label>
                <input
                  type="text"
                  value={formData.businessInfo.contactPerson}
                  onChange={(e) => handleInputChange('businessInfo', 'contactPerson', e.target.value)}
                  className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                  placeholder="Contact person name"
                  required
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Email *</label>
                <input
                  type="email"
                  value={formData.businessInfo.email}
                  onChange={(e) => handleInputChange('businessInfo', 'email', e.target.value)}
                  className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                  placeholder="business@email.com"
                  required
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Phone *</label>
                <input
                  type="tel"
                  value={formData.businessInfo.phone}
                  onChange={(e) => handleInputChange('businessInfo', 'phone', e.target.value)}
                  className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                  placeholder="+1 234 567 8900"
                  required
                />
              </div>
              <div className="md:col-span-2">
                <label className="block text-sm font-medium text-gray-700 mb-2">Website URL</label>
                <input
                  type="url"
                  value={formData.businessInfo.websiteUrl}
                  onChange={(e) => handleInputChange('businessInfo', 'websiteUrl', e.target.value)}
                  className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                  placeholder="https://yourwebsite.com"
                />
              </div>
              <div className="md:col-span-2">
                <label className="block text-sm font-medium text-gray-700 mb-2">Upload Business Logo</label>
                <div className="flex items-center space-x-4">
                  <label className="flex-1">
                    <input
                      type="file"
                      accept="image/*"
                      onChange={(e) => handleInputChange('businessInfo', 'businessLogo', e.target.files[0])}
                      className="hidden"
                    />
                    <div className="border-2 border-dashed border-gray-300 rounded-lg p-4 text-center cursor-pointer hover:border-purple-500 transition-colors">
                      <FaUpload className="mx-auto text-gray-400 mb-2" />
                      <span className="text-sm text-gray-600">Click to upload logo</span>
                    </div>
                  </label>
                </div>
              </div>
              <div className="md:col-span-2">
                <label className="flex items-center space-x-3">
                  <input
                    type="checkbox"
                    checked={formData.businessInfo.verifiedBadge}
                    onChange={(e) => handleInputChange('businessInfo', 'verifiedBadge', e.target.checked)}
                    className="w-4 h-4 text-purple-600 rounded focus:ring-purple-500"
                  />
                  <span className="text-sm text-gray-700">
                    Add Verified Business Badge (+$10/month)
                    <FaShieldAlt className="inline ml-2 text-green-500" />
                  </span>
                </label>
              </div>
            </div>
          </div>

          {/* Step 3: Banner Details & Upload */}
          <div className="bg-white rounded-2xl shadow-lg p-8 border border-gray-100">
            <h2 className="text-2xl font-bold text-gray-900 mb-6 flex items-center">
              <FaImage className="mr-3 text-green-500" />
              Banner Details & Upload
            </h2>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Banner Title *</label>
                <input
                  type="text"
                  value={formData.bannerDetails.title}
                  onChange={(e) => handleInputChange('bannerDetails', 'title', e.target.value)}
                  className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:ring-2 focus:ring-green-500 focus:border-transparent"
                  placeholder="Your banner title"
                  required
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Short Tagline (max 80 chars)</label>
                <input
                  type="text"
                  value={formData.bannerDetails.tagline}
                  onChange={(e) => handleInputChange('bannerDetails', 'tagline', e.target.value.slice(0, 80))}
                  maxLength={80}
                  className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:ring-2 focus:ring-green-500 focus:border-transparent"
                  placeholder="Catchy tagline"
                />
                <span className="text-xs text-gray-500">{formData.bannerDetails.tagline.length}/80</span>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Category *</label>
                <select
                  value={formData.bannerDetails.category}
                  onChange={(e) => handleInputChange('bannerDetails', 'category', e.target.value)}
                  className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:ring-2 focus:ring-green-500 focus:border-transparent"
                  required
                >
                  <option value="">Select category</option>
                  {categories.map(cat => (
                    <option key={cat} value={cat}>{cat}</option>
                  ))}
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Country *</label>
                <input
                  type="text"
                  value={formData.bannerDetails.country}
                  onChange={(e) => handleInputChange('bannerDetails', 'country', e.target.value)}
                  className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:ring-2 focus:ring-green-500 focus:border-transparent"
                  placeholder="Country"
                  required
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">City</label>
                <input
                  type="text"
                  value={formData.bannerDetails.city}
                  onChange={(e) => handleInputChange('bannerDetails', 'city', e.target.value)}
                  className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:ring-2 focus:ring-green-500 focus:border-transparent"
                  placeholder="City (optional)"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Target Audience</label>
                <input
                  type="text"
                  value={formData.bannerDetails.targetAudience}
                  onChange={(e) => handleInputChange('bannerDetails', 'targetAudience', e.target.value)}
                  className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:ring-2 focus:ring-green-500 focus:border-transparent"
                  placeholder="Describe your target audience"
                />
              </div>
            </div>

            {/* Banner Upload */}
            <div className="mb-6">
              <label className="block text-sm font-medium text-gray-700 mb-2">Upload Banner *</label>
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                <div>
                  <label className="block">
                    <input
                      type="file"
                      accept={formData.postType === 'video' ? 'video/*' : formData.postType === 'html5' ? '.zip' : 'image/*'}
                      onChange={handleFileUpload}
                      className="hidden"
                      required
                    />
                    <div className="border-2 border-dashed border-gray-300 rounded-lg p-8 text-center cursor-pointer hover:border-green-500 transition-colors">
                      <FaUpload className="mx-auto text-4xl text-gray-400 mb-4" />
                      <p className="text-lg font-medium text-gray-700 mb-2">
                        {formData.postType === 'video' ? 'Upload Video Banner (MP4)' : 
                         formData.postType === 'html5' ? 'Upload HTML5 ZIP Package' :
                         formData.postType === 'animated' ? 'Upload Animated Banner (GIF)' :
                         'Upload Banner Image (JPG/PNG)'}
                      </p>
                      <p className="text-sm text-gray-500">Click to browse or drag and drop</p>
                    </div>
                  </label>
                </div>
                {previewImage && (
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Preview</label>
                    <div className="border rounded-lg p-4 bg-gray-50">
                      <img 
                        src={previewImage} 
                        alt="Banner preview" 
                        className="w-full h-auto rounded"
                        style={{ maxHeight: '200px', objectFit: 'contain' }}
                      />
                    </div>
                  </div>
                )}
              </div>
            </div>

            {/* Destination Link and CTA */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Destination Link *</label>
                <input
                  type="url"
                  value={formData.bannerUpload.destinationLink}
                  onChange={(e) => handleInputChange('bannerUpload', 'destinationLink', e.target.value)}
                  className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:ring-2 focus:ring-green-500 focus:border-transparent"
                  placeholder="https://your-landing-page.com"
                  required
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Call-to-Action Text</label>
                <select
                  value={formData.bannerUpload.callToAction}
                  onChange={(e) => handleInputChange('bannerUpload', 'callToAction', e.target.value)}
                  className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:ring-2 focus:ring-green-500 focus:border-transparent"
                >
                  <option value="Learn More">Learn More</option>
                  <option value="Shop Now">Shop Now</option>
                  <option value="Book Now">Book Now</option>
                  <option value="Sign Up">Sign Up</option>
                  <option value="Get Started">Get Started</option>
                  <option value="Contact Us">Contact Us</option>
                </select>
              </div>
            </div>

            {/* Banner Size Selection */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Banner Size</label>
              <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-3">
                {bannerSizes.map((size) => (
                  <label
                    key={size.value}
                    className={`relative cursor-pointer rounded-lg p-3 border-2 transition-all ${
                      formData.bannerSize === size.value
                        ? 'border-green-500 bg-green-50'
                        : 'border-gray-200 hover:border-gray-300'
                    }`}
                  >
                    <input
                      type="radio"
                      name="bannerSize"
                      value={size.value}
                      checked={formData.bannerSize === size.value}
                      onChange={(e) => setFormData(prev => ({ ...prev, bannerSize: e.target.value }))}
                      className="sr-only"
                    />
                    <div className="text-center">
                      <div className="text-xs font-medium text-gray-900">{size.label}</div>
                      <div className="text-xs text-gray-500 mt-1">{size.width}×{size.height}</div>
                    </div>
                  </label>
                ))}
              </div>
            </div>
          </div>

          {/* Premium Upsell Tiers */}
          <div className="bg-gradient-to-r from-purple-50 to-blue-50 rounded-2xl shadow-lg p-8 border border-purple-200 relative overflow-hidden">
            {/* Animated background elements */}
            <div className="absolute top-0 left-0 w-full h-full opacity-5">
              <div className="absolute top-10 left-10 w-20 h-20 bg-purple-500 rounded-full animate-pulse"></div>
              <div className="absolute bottom-10 right-10 w-32 h-32 bg-blue-500 rounded-full animate-pulse delay-1000"></div>
              <div className="absolute top-1/2 left-1/4 w-16 h-16 bg-purple-600 rounded-full animate-pulse delay-500"></div>
            </div>
            
            <div className="relative z-10 text-center mb-8">
              <h2 className="text-3xl font-bold text-gray-900 mb-2">Boost Your Banner's Performance</h2>
              <p className="text-lg text-gray-600">Choose a premium tier to maximize your reach and conversions</p>
              <div className="mt-4 inline-flex items-center bg-yellow-100 text-yellow-800 px-4 py-2 rounded-full animate-bounce">
                <FaChartLine className="mr-2" />
                <span className="font-medium">Featured banners get 4× more clicks on average</span>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
              {premiumTiers.map((tier) => (
                <label
                  key={tier.id}
                  className={`relative cursor-pointer rounded-xl overflow-hidden transition-all duration-300 transform hover:scale-105 hover:-translate-y-2 ${
                    selectedTier === tier.id ? 'ring-4 ring-purple-500 shadow-2xl scale-105 -translate-y-2' : 'shadow-lg hover:shadow-xl'
                  }`}
                >
                  <input
                    type="radio"
                    name="premiumTier"
                    value={tier.id}
                    checked={selectedTier === tier.id}
                    onChange={(e) => setSelectedTier(e.target.value)}
                    className="sr-only"
                  />
                  <div className={`bg-gradient-to-br ${tier.color} p-1 relative`}>
                    {/* Shimmer effect on hover */}
                    <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent -translate-x-full hover:translate-x-full transition-transform duration-1000"></div>
                    
                    <div className="bg-white rounded-lg p-6 relative">
                      {tier.popular && (
                        <div className="absolute -top-3 left-1/2 transform -translate-x-1/2 z-20">
                          <span className="bg-gradient-to-r from-orange-500 to-red-500 text-white px-3 py-1 rounded-full text-xs font-bold animate-pulse">
                            MOST POPULAR
                          </span>
                        </div>
                      )}
                      <div className="text-center mb-4">
                        <div className={`text-3xl mb-2 ${selectedTier === tier.id ? 'animate-bounce' : ''}`}>{tier.badge}</div>
                        <h3 className="text-lg font-bold text-gray-900">{tier.name}</h3>
                        <div className="text-2xl font-bold text-gray-900 mt-2">
                          ${tier.price}
                          <span className="text-sm text-gray-500 font-normal">/month</span>
                        </div>
                      </div>
                      <ul className="space-y-2 mb-4">
                        {tier.benefits.map((benefit, index) => (
                          <li key={index} className="flex items-start text-sm text-gray-600">
                            <FaCheckCircle className="text-green-500 mr-2 mt-0.5 flex-shrink-0" />
                            <span>{benefit}</span>
                          </li>
                        ))}
                      </ul>
                      <div className={`text-center py-2 px-4 rounded-lg font-medium transition-all duration-300 ${
                        selectedTier === tier.id
                          ? 'bg-gradient-to-r from-purple-600 to-blue-600 text-white shadow-lg'
                          : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                      }`}>
                        {selectedTier === tier.id ? (
                          <span className="flex items-center justify-center">
                            <FaCheckCircle className="mr-2" />
                            Selected
                          </span>
                        ) : (
                          'Select Tier'
                        )}
                      </div>
                    </div>
                  </div>
                </label>
              ))}
            </div>

            {/* Comparison Table */}
            <div className="bg-white rounded-xl p-6 overflow-x-auto">
              <h3 className="text-lg font-bold text-gray-900 mb-4">Compare Premium Features</h3>
              <table className="w-full text-sm">
                <thead>
                  <tr className="border-b">
                    <th className="text-left py-2">Feature</th>
                    <th className="text-center py-2">Promoted</th>
                    <th className="text-center py-2">Featured</th>
                    <th className="text-center py-2">Sponsored</th>
                    <th className="text-center py-2">Network-Wide</th>
                  </tr>
                </thead>
                <tbody>
                  <tr className="border-b">
                    <td className="py-2">Visibility Boost</td>
                    <td className="text-center">2×</td>
                    <td className="text-center">4×</td>
                    <td className="text-center">8×</td>
                    <td className="text-center">15×</td>
                  </tr>
                  <tr className="border-b">
                    <td className="py-2">Homepage Placement</td>
                    <td className="text-center">❌</td>
                    <td className="text-center">❌</td>
                    <td className="text-center">✅</td>
                    <td className="text-center">✅</td>
                  </tr>
                  <tr className="border-b">
                    <td className="py-2">Email Newsletter</td>
                    <td className="text-center">❌</td>
                    <td className="text-center">✅</td>
                    <td className="text-center">✅</td>
                    <td className="text-center">✅</td>
                  </tr>
                  <tr className="border-b">
                    <td className="py-2">Social Media</td>
                    <td className="text-center">❌</td>
                    <td className="text-center">❌</td>
                    <td className="text-center">✅</td>
                    <td className="text-center">✅</td>
                  </tr>
                  <tr>
                    <td className="py-2">Push Notifications</td>
                    <td className="text-center">❌</td>
                    <td className="text-center">❌</td>
                    <td className="text-center">❌</td>
                    <td className="text-center">✅</td>
                  </tr>
                </tbody>
              </table>
            </div>
          </div>

          {/* Description Section */}
          <div className="bg-white rounded-2xl shadow-lg p-8 border border-gray-100">
            <h2 className="text-2xl font-bold text-gray-900 mb-6 flex items-center">
              <FaFileCode className="mr-3 text-orange-500" />
              Description & Details
            </h2>
            <div className="space-y-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Description</label>
                <textarea
                  value={formData.description.description}
                  onChange={(e) => handleInputChange('description', 'description', e.target.value)}
                  rows={4}
                  className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:ring-2 focus:ring-orange-500 focus:border-transparent"
                  placeholder="Describe your banner advertisement..."
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Key Selling Points</label>
                <textarea
                  value={formData.description.sellingPoints}
                  onChange={(e) => handleInputChange('description', 'sellingPoints', e.target.value)}
                  rows={3}
                  className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:ring-2 focus:ring-orange-500 focus:border-transparent"
                  placeholder="What makes your offer compelling?"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Offer / Promotion Details</label>
                <textarea
                  value={formData.description.offerDetails}
                  onChange={(e) => handleInputChange('description', 'offerDetails', e.target.value)}
                  rows={2}
                  className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:ring-2 focus:ring-orange-500 focus:border-transparent"
                  placeholder="Special offers, discounts, or promotions..."
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Validity Dates</label>
                <input
                  type="text"
                  value={formData.description.validityDates}
                  onChange={(e) => handleInputChange('description', 'validityDates', e.target.value)}
                  className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:ring-2 focus:ring-orange-500 focus:border-transparent"
                  placeholder="e.g., Valid until December 31, 2024"
                />
              </div>
            </div>
          </div>

          {/* Targeting Options */}
          <div className="bg-white rounded-2xl shadow-lg p-8 border border-gray-100">
            <h2 className="text-2xl font-bold text-gray-900 mb-6 flex items-center">
              <FaBullseye className="mr-3 text-red-500" />
              Targeting Options (Optional)
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Target Countries</label>
                <input
                  type="text"
                  value={formData.targeting.targetCountries.join(', ')}
                  onChange={(e) => handleInputChange('targeting', 'targetCountries', e.target.value.split(',').map(s => s.trim()))}
                  className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:ring-2 focus:ring-red-500 focus:border-transparent"
                  placeholder="USA, Canada, UK (comma separated)"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Target Categories</label>
                <input
                  type="text"
                  value={formData.targeting.targetCategories.join(', ')}
                  onChange={(e) => handleInputChange('targeting', 'targetCategories', e.target.value.split(',').map(s => s.trim()))}
                  className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:ring-2 focus:ring-red-500 focus:border-transparent"
                  placeholder="Technology, Business, Marketing (comma separated)"
                />
              </div>
              <div className="md:col-span-2">
                <label className="block text-sm font-medium text-gray-700 mb-2">Target Devices</label>
                <div className="flex space-x-6">
                  {[
                    { value: 'desktop', label: 'Desktop', icon: <FaDesktop /> },
                    { value: 'mobile', label: 'Mobile', icon: <FaMobile /> },
                    { value: 'both', label: 'Both', icon: <FaGlobe /> }
                  ].map((device) => (
                    <label key={device.value} className="flex items-center space-x-2 cursor-pointer">
                      <input
                        type="radio"
                        name="targetDevices"
                        value={device.value}
                        checked={formData.targeting.targetDevices === device.value}
                        onChange={(e) => handleInputChange('targeting', 'targetDevices', e.target.value)}
                        className="w-4 h-4 text-red-600 rounded focus:ring-red-500"
                      />
                      <span className="flex items-center space-x-2">
                        <span className="text-red-500">{device.icon}</span>
                        <span className="text-gray-700">{device.label}</span>
                      </span>
                    </label>
                  ))}
                </div>
              </div>
            </div>
          </div>

          {/* Final Submission */}
          <div className="bg-gradient-to-r from-gray-900 to-gray-800 rounded-2xl shadow-lg p-8 text-white">
            <div className="text-center mb-6">
              <h2 className="text-2xl font-bold mb-2">Ready to Launch Your Banner Ad?</h2>
              <p className="text-gray-300">Review your information and submit to go live</p>
            </div>

            {selectedTier && (
              <div className="bg-white/10 backdrop-blur rounded-lg p-4 mb-6">
                <div className="flex items-center justify-between">
                  <div>
                    <span className="text-sm text-gray-300">Selected Tier:</span>
                    <span className="ml-2 font-bold text-lg">
                      {premiumTiers.find(t => t.id === selectedTier)?.name}
                    </span>
                  </div>
                  <div className="text-right">
                    <span className="text-sm text-gray-300">Total Cost:</span>
                    <span className="ml-2 font-bold text-2xl text-green-400">
                      ${premiumTiers.find(t => t.id === selectedTier)?.price}/month
                    </span>
                  </div>
                </div>
              </div>
            )}

            <div className="space-y-4 mb-6">
              <label className="flex items-start space-x-3 cursor-pointer">
                <input
                  type="checkbox"
                  checked={formData.accuracyConfirmed}
                  onChange={(e) => setFormData(prev => ({ ...prev, accuracyConfirmed: e.target.checked }))}
                  className="w-5 h-5 text-blue-600 rounded focus:ring-blue-500 mt-0.5"
                />
                <span className="text-sm text-gray-200">
                  I confirm this banner advertisement is accurate and complies with all guidelines
                </span>
              </label>
              <label className="flex items-start space-x-3 cursor-pointer">
                <input
                  type="checkbox"
                  checked={formData.termsAccepted}
                  onChange={(e) => setFormData(prev => ({ ...prev, termsAccepted: e.target.checked }))}
                  className="w-5 h-5 text-blue-600 rounded focus:ring-blue-500 mt-0.5"
                />
                <span className="text-sm text-gray-200">
                  I agree to the Terms of Service and Privacy Policy
                </span>
              </label>
            </div>

            <div className="text-center">
              <button
                type="submit"
                disabled={loading || !formData.termsAccepted || !formData.accuracyConfirmed}
                className="inline-flex items-center px-8 py-4 bg-gradient-to-r from-blue-500 to-purple-600 text-white font-bold rounded-lg hover:from-blue-600 hover:to-purple-700 disabled:opacity-50 disabled:cursor-not-allowed transition-all transform hover:scale-105"
              >
                {loading ? (
                  <>
                    <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white mr-3"></div>
                    Processing...
                  </>
                ) : (
                  <>
                    <FaRocket className="mr-3" />
                    {selectedTier ? 'Proceed to Payment' : 'Submit Banner Advert'}
                  </>
                )}
              </button>
            </div>
          </div>
        </form>

      {/* Sticky Summary Box */}
      {showStickySummary && (
        <div className="fixed bottom-4 right-4 bg-white rounded-lg shadow-2xl border border-gray-200 p-4 z-50 max-w-sm animate-in slide-in-from-bottom-5 duration-300">
          <div className="flex items-center justify-between mb-3">
            <h3 className="font-bold text-gray-900 flex items-center">
              <FaStickyNote className="mr-2 text-blue-500" />
              Summary
            </h3>
            <button
              onClick={() => setShowStickySummary(false)}
              className="text-gray-400 hover:text-gray-600"
            >
              <FaTimes className="w-4 h-4" />
            </button>
          </div>
          
          <div className="space-y-2 text-sm">
            <div className="flex justify-between">
              <span className="text-gray-600">Type:</span>
              <span className="font-medium capitalize">{formData.postType}</span>
            </div>
            {formData.businessInfo.businessName && (
              <div className="flex justify-between">
                <span className="text-gray-600">Business:</span>
                <span className="font-medium truncate ml-2">{formData.businessInfo.businessName}</span>
              </div>
            )}
            {formData.bannerDetails.title && (
              <div className="flex justify-between">
                <span className="text-gray-600">Title:</span>
                <span className="font-medium truncate ml-2">{formData.bannerDetails.title}</span>
              </div>
            )}
            {selectedTier && (
              <div className="border-t pt-2 mt-2">
                <div className="flex justify-between items-center">
                  <span className="text-gray-600">Tier:</span>
                  <span className="font-bold text-purple-600">
                    {premiumTiers.find(t => t.id === selectedTier)?.name}
                  </span>
                </div>
                <div className="flex justify-between items-center mt-1">
                  <span className="text-gray-600">Cost:</span>
                  <span className="font-bold text-green-600">
                    ${premiumTiers.find(t => t.id === selectedTier)?.price}/mo
                  </span>
                </div>
              </div>
            )}
          </div>
          
          <div className="mt-4 pt-3 border-t">
            <div className="flex items-center justify-between mb-2">
              <span className="text-sm text-gray-600">Progress:</span>
              <span className="text-sm font-bold text-blue-600">{formProgress}%</span>
            </div>
            <button
              onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
              className="w-full bg-gradient-to-r from-blue-500 to-purple-600 text-white py-2 px-4 rounded-lg font-medium hover:from-blue-600 hover:to-purple-700 transition-all flex items-center justify-center"
            >
              {selectedTier ? (
                <>
                  <FaCreditCard className="mr-2" />
                  Proceed to Payment
                </>
              ) : (
                <>
                  <FaArrowRight className="mr-2" />
                  Complete Form
                </>
              )}
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default BannerAdPostForm;
