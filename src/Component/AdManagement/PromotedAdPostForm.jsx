import React, { useState, useEffect } from 'react';
import { 
  FaShoppingBag, 
  FaBriefcase, 
  FaHome, 
  FaCar, 
  FaUserTie, 
  FaCalendarAlt, 
  FaHandshake, 
  FaEllipsisH,
  FaArrowRight,
  FaArrowLeft,
  FaCamera,
  FaVideo,
  FaMagic,
  FaCrop,
  FaStar,
  FaMapMarkerAlt,
  FaTag,
  FaDollarSign,
  FaCheckCircle,
  FaExclamationTriangle,
  FaUser,
  FaBuilding,
  FaPhone,
  FaEnvelope,
  FaGlobe,
  FaFacebook,
  FaTwitter,
  FaInstagram,
  FaLinkedin,
  FaMapPin,
  FaShieldAlt,
  FaCrown,
  FaGem,
  FaRocket,
  FaBolt,
  FaFire,
  FaInfinity,
  FaTrophy,
  FaChartLine,
  FaUsers,
  FaEye,
  FaThumbsUp,
  FaShare,
  FaBell,
  FaLock,
  FaUnlock,
  FaInfoCircle
} from 'react-icons/fa';
import { MdClose, MdUpload, MdImage, MdEdit, MdLocationOn, MdMyLocation, MdPublic, MdLockOutline } from 'react-icons/md';

const PromotedAdPostForm = () => {
  const [currentStep, setCurrentStep] = useState(1);
  const [selectedAdType, setSelectedAdType] = useState('');
  const [formData, setFormData] = useState({
    title: '',
    tagline: '',
    category: '',
    country: '',
    city: '',
    price: '',
    condition: '',
    mainImage: null,
    additionalImages: [],
    videoLink: '',
    // Step 3 - Description
    overview: '',
    keyFeatures: '',
    specialAdvert: '',
    additionalNotes: '',
    // Step 4 - Seller Information
    sellerName: '',
    businessName: '',
    phoneNumber: '',
    email: '',
    website: '',
    socialLinks: {
      facebook: '',
      twitter: '',
      instagram: '',
      linkedin: ''
    },
    sellerLogo: null,
    verifiedBadge: false,
    // Step 5 - Location
    locationLat: null,
    locationLng: null,
    locationPrivacy: 'exact', // 'exact' or 'approximate'
    // Step 6 - Upsale Options
    selectedPackage: 'basic',
    promotionDuration: '7'
  });
  const [errors, setErrors] = useState({});
  const [isUploading, setIsUploading] = useState(false);
  const [aiSuggestions, setAiSuggestions] = useState([]);
  const [showAiSuggestions, setShowAiSuggestions] = useState(false);
  const [mapCenter, setMapCenter] = useState({ lat: 40.7128, lng: -74.0060 });
  const [mapMarker, setMapMarker] = useState(null);
  const [showMapPreview, setShowMapPreview] = useState(false);
  const [termsAccepted, setTermsAccepted] = useState(false);
  const [accurateConfirmed, setAccurateConfirmed] = useState(false);
  const [showStickySummary, setShowStickySummary] = useState(false);

  const adTypes = [
    {
      id: 'product',
      name: 'Product / Item for Sale',
      icon: FaShoppingBag,
      description: 'Sell physical products, electronics, furniture, and more',
      color: 'blue'
    },
    {
      id: 'service',
      name: 'Service / Business Offer',
      icon: FaBriefcase,
      description: 'Offer professional services, consulting, repairs, etc.',
      color: 'green'
    },
    {
      id: 'property',
      name: 'Property / Real Estate',
      icon: FaHome,
      description: 'Rent, sell, or lease residential and commercial properties',
      color: 'purple'
    },
    {
      id: 'vehicle',
      name: 'Vehicle / Motors',
      icon: FaCar,
      description: 'Cars, motorcycles, boats, and other vehicles',
      color: 'red'
    },
    {
      id: 'job',
      name: 'Job / Vacancy',
      icon: FaUserTie,
      description: 'Post job openings and career opportunities',
      color: 'indigo'
    },
    {
      id: 'event',
      name: 'Event / Experience',
      icon: FaCalendarAlt,
      description: 'Promote events, workshops, and experiences',
      color: 'yellow'
    },
    {
      id: 'business',
      name: 'Business Opportunity',
      icon: FaHandshake,
      description: 'Franchise opportunities, partnerships, investments',
      color: 'pink'
    },
    {
      id: 'misc',
      name: 'Miscellaneous / Other',
      icon: FaEllipsisH,
      description: 'Everything else that doesn\'t fit above',
      color: 'gray'
    }
  ];

  const conditions = ['New', 'Used', 'Not Applicable'];
  const countries = ['United States', 'United Kingdom', 'Canada', 'Australia', 'Germany', 'France', 'Other'];
  
  const categories = {
    product: ['Electronics', 'Furniture', 'Clothing', 'Books', 'Sports & Outdoors', 'Home & Garden', 'Toys & Games', 'Health & Beauty'],
    service: ['Business Services', 'Education & Training', 'Health & Wellness', 'Home Services', 'Professional Services', 'Creative Services', 'Technology', 'Consulting'],
    property: ['Apartments', 'Houses', 'Commercial', 'Land', 'Vacation Rentals', 'Office Space', 'Storage', 'Parking'],
    vehicle: ['Cars', 'Motorcycles', 'Trucks', 'Boats', 'RVs', 'Parts & Accessories', 'ATVs', 'Aircraft'],
    job: ['Full-time', 'Part-time', 'Contract', 'Freelance', 'Internship', 'Remote', 'Executive', 'Entry Level'],
    event: ['Concerts', 'Workshops', 'Conferences', 'Sports', 'Community', 'Networking', 'Entertainment', 'Educational'],
    business: ['Franchise', 'Investment', 'Partnership', 'Startup', 'License', 'Distribution', 'Joint Venture', 'Acquisition'],
    misc: ['Other', 'General', 'Uncategorized']
  };

  const upsalePackages = [
    {
      id: 'basic',
      name: 'Promoted Basic',
      subtitle: 'Entry Tier',
      price: '£9.99',
      duration: '7 days',
      icon: FaBolt,
      color: 'blue',
      features: [
        'Highlighted listing',
        'Appears above standard ads',
        '"Promoted" badge',
        '2× more visibility'
      ],
      popular: false
    },
    {
      id: 'plus',
      name: 'Promoted Plus',
      subtitle: 'Most Popular',
      price: '£24.99',
      duration: '14 days',
      icon: FaStar,
      color: 'purple',
      features: [
        'All Basic features',
        'Top of category placement',
        'Larger advert card',
        'Priority in search results',
        'Included in weekly "Promoted Highlights" email'
      ],
      popular: true
    },
    {
      id: 'premium',
      name: 'Promoted Premium',
      subtitle: 'High Tier',
      price: '£49.99',
      duration: '30 days',
      icon: FaCrown,
      color: 'yellow',
      features: [
        'Homepage placement',
        'Category top placement',
        'Included in homepage slider',
        '"Premium Promoted" badge',
        'Maximum visibility'
      ],
      popular: false
    },
    {
      id: 'network',
      name: 'Network‑Wide Boost',
      subtitle: 'Ultimate Tier',
      price: '£99.99',
      duration: '60 days',
      icon: FaGem,
      color: 'red',
      features: [
        'Appears across multiple pages',
        'Promoted Adverts Page',
        'Homepage',
        'Category pages',
        'Related search pages',
        'Included in email newsletters',
        'Included in push notifications (if enabled)',
        '"Top Spotlight" badge'
      ],
      popular: false
    }
  ];

  useEffect(() => {
    if (selectedAdType) {
      generateAiSuggestions();
    }
  }, [selectedAdType, formData.title]);

  const generateAiSuggestions = () => {
    const suggestions = [
      `${formData.title} - Premium Quality`,
      `Best ${selectedAdType} Deal - ${formData.title}`,
      `Limited Offer: ${formData.title}`,
      `${formData.title} - Top Rated`,
      `Professional ${selectedAdType}: ${formData.title}`
    ];
    setAiSuggestions(suggestions);
  };

  const handleAdTypeSelect = (typeId) => {
    setSelectedAdType(typeId);
    setFormData(prev => ({ ...prev, category: '' }));
    setErrors({});
  };

  const handleInputChange = (field, value) => {
    setFormData(prev => ({ ...prev, [field]: value }));
    if (errors[field]) {
      setErrors(prev => ({ ...prev, [field]: '' }));
    }
  };

  const handleImageUpload = (e, isMain = true) => {
    const files = Array.from(e.target.files);
    
    if (isMain) {
      if (files.length > 0) {
        setFormData(prev => ({ ...prev, mainImage: files[0] }));
      }
    } else {
      const remainingSlots = 10 - formData.additionalImages.length;
      const filesToAdd = files.slice(0, remainingSlots);
      setFormData(prev => ({
        ...prev,
        additionalImages: [...prev.additionalImages, ...filesToAdd]
      }));
    }
  };

  const removeAdditionalImage = (index) => {
    setFormData(prev => ({
      ...prev,
      additionalImages: prev.additionalImages.filter((_, i) => i !== index)
    }));
  };

  const handleSocialLinkChange = (platform, value) => {
    setFormData(prev => ({
      ...prev,
      socialLinks: {
        ...prev.socialLinks,
        [platform]: value
      }
    }));
  };

  const handleMapClick = (lat, lng) => {
    setFormData(prev => ({
      ...prev,
      locationLat: lat,
      locationLng: lng
    }));
    setMapMarker({ lat, lng });
  };

  const handleLocationPrivacyChange = (privacy) => {
    setFormData(prev => ({
      ...prev,
      locationPrivacy: privacy
    }));
  };

  const handlePackageSelect = (packageId) => {
    setFormData(prev => ({
      ...prev,
      selectedPackage: packageId
    }));
  };

  const validateStep3 = () => {
    const newErrors = {};
    if (!formData.overview.trim()) newErrors.overview = 'Overview is required';
    if (!formData.keyFeatures.trim()) newErrors.keyFeatures = 'Key features are required';
    if (!formData.specialAdvert.trim()) newErrors.specialAdvert = 'Special advert description is required';
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const validateStep4 = () => {
    const newErrors = {};
    if (!formData.sellerName.trim()) newErrors.sellerName = 'Name is required';
    if (!formData.phoneNumber.trim()) newErrors.phoneNumber = 'Phone number is required';
    if (!formData.email.trim()) newErrors.email = 'Email is required';
    else if (!/\S+@\S+\.\S+/.test(formData.email)) newErrors.email = 'Email is invalid';
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const validateStep6 = () => {
    const newErrors = {};
    if (!formData.selectedPackage) newErrors.selectedPackage = 'Please select a promotion package';
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const validateStep2 = () => {
    const newErrors = {};
    
    if (!formData.title.trim()) newErrors.title = 'Title is required';
    if (!formData.tagline.trim()) newErrors.tagline = 'Tagline is required';
    if (formData.tagline.length > 80) newErrors.tagline = 'Tagline must be 80 characters or less';
    if (!formData.category) newErrors.category = 'Category is required';
    if (!formData.country) newErrors.country = 'Country is required';
    if (!formData.city.trim()) newErrors.city = 'City is required';
    if (!formData.mainImage) newErrors.mainImage = 'Main image is required';
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async () => {
    // Validate all steps
    if (!validateStep2() || !validateStep3() || !validateStep4() || !validateStep6()) {
      setCurrentStep(2); // Go back to first step with errors
      return;
    }
    
    setIsUploading(true);
    
    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 2000));
      
      // Here you would normally send data to your backend
      console.log('Form submitted:', { selectedAdType, formData });
      
      alert('Promoted ad posted successfully!');
      // Reset form or redirect as needed
    } catch (error) {
      console.error('Error submitting form:', error);
      alert('Error submitting form. Please try again.');
    } finally {
      setIsUploading(false);
    }
  };

  const Step1 = () => (
    <div className="space-y-6">
      <div className="text-center mb-8">
        <h2 className="text-3xl font-bold text-gray-900 mb-3">Choose Your Advert Type</h2>
        <p className="text-gray-600 text-lg">Select the category that best describes your promoted advert</p>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {adTypes.map((type) => {
          const Icon = type.icon;
          const isSelected = selectedAdType === type.id;
          
          return (
            <button
              key={type.id}
              onClick={() => handleAdTypeSelect(type.id)}
              className={`p-6 rounded-xl border-2 transition-all duration-300 hover:scale-105 ${
                isSelected 
                  ? `border-${type.color}-500 bg-${type.color}-50 shadow-lg` 
                  : 'border-gray-200 hover:border-gray-300 bg-white'
              }`}
            >
              <div className={`w-16 h-16 rounded-full bg-${type.color}-100 flex items-center justify-center mx-auto mb-4`}>
                <Icon className={`text-2xl text-${type.color}-600`} />
              </div>
              <h3 className="font-semibold text-gray-900 mb-2">{type.name}</h3>
              <p className="text-sm text-gray-600">{type.description}</p>
              {isSelected && (
                <div className="mt-3 flex items-center justify-center text-green-600">
                  <FaCheckCircle className="mr-2" />
                  <span className="text-sm font-medium">Selected</span>
                </div>
              )}
            </button>
          );
        })}
      </div>
      
      {selectedAdType && (
        <div className="flex justify-center mt-8">
          <button
            onClick={() => setCurrentStep(2)}
            className="inline-flex items-center px-8 py-3 bg-gradient-to-r from-blue-600 to-purple-600 text-white font-semibold rounded-lg hover:from-blue-700 hover:to-purple-700 transition-all duration-300"
          >
            Continue to Details
            <FaArrowRight className="ml-2" />
          </button>
        </div>
      )}
    </div>
  );

  const Step2 = () => (
    <div className="space-y-6">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h2 className="text-3xl font-bold text-gray-900">Advert Information</h2>
          <p className="text-gray-600 mt-1">Provide details about your promoted advert</p>
        </div>
        <button
          onClick={() => setCurrentStep(1)}
          className="text-blue-600 hover:text-blue-700 font-medium"
        >
          ← Back to Type Selection
        </button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Left Column */}
        <div className="space-y-6">
          {/* Title */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Advert Title <span className="text-red-500">*</span>
            </label>
            <input
              type="text"
              value={formData.title}
              onChange={(e) => handleInputChange('title', e.target.value)}
              className={`w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent ${
                errors.title ? 'border-red-500' : 'border-gray-300'
              }`}
              placeholder="Enter your advert title"
            />
            {errors.title && (
              <p className="mt-1 text-sm text-red-600">{errors.title}</p>
            )}
            
            {/* AI Suggestions */}
            {formData.title && (
              <div className="mt-2">
                <button
                  type="button"
                  onClick={() => setShowAiSuggestions(!showAiSuggestions)}
                  className="inline-flex items-center text-sm text-blue-600 hover:text-blue-700"
                >
                  <FaMagic className="mr-1" />
                  AI Title Suggestions
                </button>
                {showAiSuggestions && (
                  <div className="mt-2 p-3 bg-blue-50 rounded-lg">
                    <p className="text-xs font-medium text-blue-900 mb-2">Suggested titles:</p>
                    <div className="space-y-1">
                      {aiSuggestions.map((suggestion, index) => (
                        <button
                          key={index}
                          type="button"
                          onClick={() => handleInputChange('title', suggestion)}
                          className="block w-full text-left text-sm text-blue-700 hover:bg-blue-100 px-2 py-1 rounded"
                        >
                          {suggestion}
                        </button>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            )}
          </div>

          {/* Tagline */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Short Tagline <span className="text-red-500">*</span>
              <span className="text-gray-500 ml-2">({formData.tagline.length}/80 chars)</span>
            </label>
            <input
              type="text"
              value={formData.tagline}
              onChange={(e) => handleInputChange('tagline', e.target.value)}
              className={`w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent ${
                errors.tagline ? 'border-red-500' : 'border-gray-300'
              }`}
              placeholder="Brief, catchy description (max 80 chars)"
              maxLength={80}
            />
            {errors.tagline && (
              <p className="mt-1 text-sm text-red-600">{errors.tagline}</p>
            )}
          </div>

          {/* Category */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Category <span className="text-red-500">*</span>
            </label>
            <select
              value={formData.category}
              onChange={(e) => handleInputChange('category', e.target.value)}
              className={`w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent ${
                errors.category ? 'border-red-500' : 'border-gray-300'
              }`}
            >
              <option value="">Select a category</option>
              {categories[selectedAdType]?.map((cat) => (
                <option key={cat} value={cat}>{cat}</option>
              ))}
            </select>
            {errors.category && (
              <p className="mt-1 text-sm text-red-600">{errors.category}</p>
            )}
          </div>

          {/* Location */}
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Country <span className="text-red-500">*</span>
              </label>
              <select
                value={formData.country}
                onChange={(e) => handleInputChange('country', e.target.value)}
                className={`w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent ${
                  errors.country ? 'border-red-500' : 'border-gray-300'
                }`}
              >
                <option value="">Select country</option>
                {countries.map((country) => (
                  <option key={country} value={country}>{country}</option>
                ))}
              </select>
              {errors.country && (
                <p className="mt-1 text-sm text-red-600">{errors.country}</p>
              )}
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                City / Region <span className="text-red-500">*</span>
              </label>
              <input
                type="text"
                value={formData.city}
                onChange={(e) => handleInputChange('city', e.target.value)}
                className={`w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent ${
                  errors.city ? 'border-red-500' : 'border-gray-300'
                }`}
                placeholder="Enter city or region"
              />
              {errors.city && (
                <p className="mt-1 text-sm text-red-600">{errors.city}</p>
              )}
            </div>
          </div>

          {/* Price and Condition */}
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Price {selectedAdType === 'service' && <span className="text-gray-500">(optional)</span>}
              </label>
              <div className="relative">
                <span className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-500">
                  <FaDollarSign />
                </span>
                <input
                  type="number"
                  value={formData.price}
                  onChange={(e) => handleInputChange('price', e.target.value)}
                  className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  placeholder="0.00"
                />
              </div>
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Condition <span className="text-red-500">*</span>
              </label>
              <select
                value={formData.condition}
                onChange={(e) => handleInputChange('condition', e.target.value)}
                className={`w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent ${
                  errors.condition ? 'border-red-500' : 'border-gray-300'
                }`}
              >
                <option value="">Select condition</option>
                {conditions.map((condition) => (
                  <option key={condition} value={condition}>{condition}</option>
                ))}
              </select>
              {errors.condition && (
                <p className="mt-1 text-sm text-red-600">{errors.condition}</p>
              )}
            </div>
          </div>
        </div>

        {/* Right Column - Media Upload */}
        <div className="space-y-6">
          {/* Main Image */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Main Image <span className="text-red-500">*</span>
            </label>
            <div className="border-2 border-dashed border-gray-300 rounded-lg p-6 text-center hover:border-gray-400 transition-colors">
              {formData.mainImage ? (
                <div className="relative">
                  <img
                    src={URL.createObjectURL(formData.mainImage)}
                    alt="Main preview"
                    className="w-full h-48 object-cover rounded-lg"
                  />
                  <button
                    type="button"
                    onClick={() => handleInputChange('mainImage', null)}
                    className="absolute top-2 right-2 bg-red-500 text-white rounded-full p-2 hover:bg-red-600"
                  >
                    <MdClose />
                  </button>
                  <div className="mt-2 flex justify-center gap-2">
                    <button className="text-sm text-blue-600 hover:text-blue-700">
                      <FaCrop className="inline mr-1" /> Auto-crop
                    </button>
                    <button className="text-sm text-blue-600 hover:text-blue-700">
                      <FaMagic className="inline mr-1" /> Enhance
                    </button>
                  </div>
                </div>
              ) : (
                <div>
                  <FaCamera className="mx-auto text-4xl text-gray-400 mb-3" />
                  <label className="cursor-pointer">
                    <span className="text-blue-600 hover:text-blue-700 font-medium">Choose main image</span>
                    <input
                      type="file"
                      accept="image/*"
                      onChange={(e) => handleImageUpload(e, true)}
                      className="hidden"
                    />
                  </label>
                  <p className="text-sm text-gray-500 mt-2">PNG, JPG, GIF up to 10MB</p>
                </div>
              )}
            </div>
            {errors.mainImage && (
              <p className="mt-1 text-sm text-red-600">{errors.mainImage}</p>
            )}
          </div>

          {/* Additional Images */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Additional Images <span className="text-gray-500">({formData.additionalImages.length}/10)</span>
            </label>
            <div className="border-2 border-dashed border-gray-300 rounded-lg p-4 text-center hover:border-gray-400 transition-colors">
              <label className="cursor-pointer">
                <MdUpload className="mx-auto text-3xl text-gray-400 mb-2" />
                <span className="text-blue-600 hover:text-blue-700 font-medium">Add more images</span>
                <input
                  type="file"
                  accept="image/*"
                  multiple
                  onChange={(e) => handleImageUpload(e, false)}
                  className="hidden"
                />
              </label>
              <p className="text-sm text-gray-500 mt-1">Up to 10 additional images</p>
            </div>
            
            {/* Preview additional images */}
            {formData.additionalImages.length > 0 && (
              <div className="mt-3 grid grid-cols-3 gap-2">
                {formData.additionalImages.map((image, index) => (
                  <div key={index} className="relative">
                    <img
                      src={URL.createObjectURL(image)}
                      alt={`Additional ${index + 1}`}
                      className="w-full h-20 object-cover rounded"
                    />
                    <button
                      type="button"
                      onClick={() => removeAdditionalImage(index)}
                      className="absolute top-1 right-1 bg-red-500 text-white rounded-full p-1 text-xs hover:bg-red-600"
                    >
                      <MdClose />
                    </button>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Video Link */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Video Link <span className="text-gray-500">(optional)</span>
            </label>
            <div className="relative">
              <span className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-500">
                <FaVideo />
              </span>
              <input
                type="url"
                value={formData.videoLink}
                onChange={(e) => handleInputChange('videoLink', e.target.value)}
                className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                placeholder="https://youtube.com/watch?v=..."
              />
            </div>
            <p className="text-xs text-gray-500 mt-1">YouTube, Vimeo, or other video platform links</p>
          </div>
        </div>
      </div>

      {/* Navigation Buttons */}
      <div className="flex justify-between mt-8">
        <button
          onClick={() => setCurrentStep(1)}
          className="inline-flex items-center px-6 py-2 border border-gray-300 text-gray-700 font-medium rounded-lg hover:bg-gray-50 transition-all duration-300"
        >
          <FaArrowLeft className="mr-2" />
          Previous
        </button>
        <button
          onClick={() => setCurrentStep(3)}
          className="inline-flex items-center px-6 py-2 bg-blue-600 text-white font-medium rounded-lg hover:bg-blue-700 transition-all duration-300"
        >
          Next
          <FaArrowRight className="ml-2" />
        </button>
      </div>
    </div>
  );

  const Step3 = () => (
    <div className="space-y-6">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h2 className="text-3xl font-bold text-gray-900">Description Section</h2>
          <p className="text-gray-600 mt-1">Provide detailed information to create high-conversion listings</p>
        </div>
        <button
          onClick={() => setCurrentStep(2)}
          className="text-blue-600 hover:text-blue-700 font-medium"
        >
          ← Back
        </button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Overview */}
        <div className="lg:col-span-2">
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Overview <span className="text-red-500">*</span>
          </label>
          <textarea
            value={formData.overview}
            onChange={(e) => handleInputChange('overview', e.target.value)}
            className={`w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent h-32 resize-none ${
              errors.overview ? 'border-red-500' : 'border-gray-300'
            }`}
            placeholder="Provide a comprehensive overview of your advert. What are you offering? What problem does it solve?"
          />
          {errors.overview && (
            <p className="mt-1 text-sm text-red-600">{errors.overview}</p>
          )}
        </div>

        {/* Key Features */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Key Features <span className="text-red-500">*</span>
          </label>
          <textarea
            value={formData.keyFeatures}
            onChange={(e) => handleInputChange('keyFeatures', e.target.value)}
            className={`w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent h-40 resize-none ${
              errors.keyFeatures ? 'border-red-500' : 'border-gray-300'
            }`}
            placeholder="List the main features and benefits. Use bullet points for better readability.&#10;• Feature 1&#10;• Feature 2&#10;• Feature 3"
          />
          {errors.keyFeatures && (
            <p className="mt-1 text-sm text-red-600">{errors.keyFeatures}</p>
          )}
        </div>

        {/* What Makes This Advert Special */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            What Makes This Advert Special <span className="text-red-500">*</span>
          </label>
          <textarea
            value={formData.specialAdvert}
            onChange={(e) => handleInputChange('specialAdvert', e.target.value)}
            className={`w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent h-40 resize-none ${
              errors.specialAdvert ? 'border-red-500' : 'border-gray-300'
            }`}
            placeholder="What makes your offer unique? Why should customers choose you? What's your competitive advantage?"
          />
          {errors.specialAdvert && (
            <p className="mt-1 text-sm text-red-600">{errors.specialAdvert}</p>
          )}
        </div>

        {/* Additional Notes */}
        <div className="lg:col-span-2">
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Additional Notes
          </label>
          <textarea
            value={formData.additionalNotes}
            onChange={(e) => handleInputChange('additionalNotes', e.target.value)}
            className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent h-24 resize-none"
            placeholder="Any additional information that might be helpful for potential customers"
          />
        </div>
      </div>

      {/* Navigation Buttons */}
      <div className="flex justify-between mt-8">
        <button
          onClick={() => setCurrentStep(2)}
          className="inline-flex items-center px-6 py-2 border border-gray-300 text-gray-700 font-medium rounded-lg hover:bg-gray-50 transition-all duration-300"
        >
          <FaArrowLeft className="mr-2" />
          Previous
        </button>
        <button
          onClick={() => {
            if (validateStep3()) setCurrentStep(4);
          }}
          className="inline-flex items-center px-6 py-2 bg-blue-600 text-white font-medium rounded-lg hover:bg-blue-700 transition-all duration-300"
        >
          Next
          <FaArrowRight className="ml-2" />
        </button>
      </div>
    </div>
  );

  const Step4 = () => (
    <div className="space-y-6">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h2 className="text-3xl font-bold text-gray-900">Seller Information</h2>
          <p className="text-gray-600 mt-1">Build trust and credibility with your details</p>
        </div>
        <button
          onClick={() => setCurrentStep(3)}
          className="text-blue-600 hover:text-blue-700 font-medium"
        >
          ← Back
        </button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Personal Information */}
        <div className="space-y-6">
          <h3 className="text-lg font-semibold text-gray-800 flex items-center">
            <FaUser className="mr-2 text-blue-600" />
            Personal Information
          </h3>
          
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Name <span className="text-red-500">*</span>
            </label>
            <input
              type="text"
              value={formData.sellerName}
              onChange={(e) => handleInputChange('sellerName', e.target.value)}
              className={`w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent ${
                errors.sellerName ? 'border-red-500' : 'border-gray-300'
              }`}
              placeholder="Your full name"
            />
            {errors.sellerName && (
              <p className="mt-1 text-sm text-red-600">{errors.sellerName}</p>
            )}
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Business Name <span className="text-gray-500">(optional)</span>
            </label>
            <input
              type="text"
              value={formData.businessName}
              onChange={(e) => handleInputChange('businessName', e.target.value)}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              placeholder="Your business name"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Phone Number <span className="text-red-500">*</span>
            </label>
            <div className="relative">
              <span className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-500">
                <FaPhone />
              </span>
              <input
                type="tel"
                value={formData.phoneNumber}
                onChange={(e) => handleInputChange('phoneNumber', e.target.value)}
                className={`w-full pl-10 pr-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent ${
                  errors.phoneNumber ? 'border-red-500' : 'border-gray-300'
                }`}
                placeholder="+1 (555) 123-4567"
              />
            </div>
            {errors.phoneNumber && (
              <p className="mt-1 text-sm text-red-600">{errors.phoneNumber}</p>
            )}
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Email <span className="text-red-500">*</span>
            </label>
            <div className="relative">
              <span className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-500">
                <FaEnvelope />
              </span>
              <input
                type="email"
                value={formData.email}
                onChange={(e) => handleInputChange('email', e.target.value)}
                className={`w-full pl-10 pr-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent ${
                  errors.email ? 'border-red-500' : 'border-gray-300'
                }`}
                placeholder="your@email.com"
              />
            </div>
            {errors.email && (
              <p className="mt-1 text-sm text-red-600">{errors.email}</p>
            )}
          </div>
        </div>

        {/* Business Information */}
        <div className="space-y-6">
          <h3 className="text-lg font-semibold text-gray-800 flex items-center">
            <FaBuilding className="mr-2 text-blue-600" />
            Business Information
          </h3>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Website / Social Links
            </label>
            <div className="relative">
              <span className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-500">
                <FaGlobe />
              </span>
              <input
                type="url"
                value={formData.website}
                onChange={(e) => handleInputChange('website', e.target.value)}
                className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                placeholder="https://yourwebsite.com"
              />
            </div>
          </div>

          {/* Social Media Links */}
          <div className="space-y-3">
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Social Media Profiles
            </label>
            
            <div className="relative">
              <span className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-500">
                <FaFacebook />
              </span>
              <input
                type="url"
                value={formData.socialLinks.facebook}
                onChange={(e) => handleSocialLinkChange('facebook', e.target.value)}
                className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                placeholder="Facebook profile URL"
              />
            </div>

            <div className="relative">
              <span className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-500">
                <FaTwitter />
              </span>
              <input
                type="url"
                value={formData.socialLinks.twitter}
                onChange={(e) => handleSocialLinkChange('twitter', e.target.value)}
                className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                placeholder="Twitter profile URL"
              />
            </div>

            <div className="relative">
              <span className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-500">
                <FaInstagram />
              </span>
              <input
                type="url"
                value={formData.socialLinks.instagram}
                onChange={(e) => handleSocialLinkChange('instagram', e.target.value)}
                className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                placeholder="Instagram profile URL"
              />
            </div>

            <div className="relative">
              <span className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-500">
                <FaLinkedin />
              </span>
              <input
                type="url"
                value={formData.socialLinks.linkedin}
                onChange={(e) => handleSocialLinkChange('linkedin', e.target.value)}
                className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                placeholder="LinkedIn profile URL"
              />
            </div>
          </div>

          {/* Logo Upload */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Upload Logo <span className="text-gray-500">(optional)</span>
            </label>
            <div className="border-2 border-dashed border-gray-300 rounded-lg p-4 text-center hover:border-gray-400 transition-colors">
              {formData.sellerLogo ? (
                <div className="relative">
                  <img
                    src={URL.createObjectURL(formData.sellerLogo)}
                    alt="Logo preview"
                    className="w-24 h-24 object-cover rounded-lg mx-auto"
                  />
                  <button
                    type="button"
                    onClick={() => handleInputChange('sellerLogo', null)}
                    className="absolute top-0 right-0 bg-red-500 text-white rounded-full p-1 text-xs hover:bg-red-600"
                  >
                    <MdClose />
                  </button>
                </div>
              ) : (
                <div>
                  <FaBuilding className="mx-auto text-3xl text-gray-400 mb-2" />
                  <label className="cursor-pointer">
                    <span className="text-blue-600 hover:text-blue-700 font-medium">Choose logo</span>
                    <input
                      type="file"
                      accept="image/*"
                      onChange={(e) => handleInputChange('sellerLogo', e.target.files[0])}
                      className="hidden"
                    />
                  </label>
                  <p className="text-sm text-gray-500 mt-1">PNG, JPG up to 5MB</p>
                </div>
              )}
            </div>
          </div>

          {/* Verified Seller Badge */}
          <div className="bg-gradient-to-r from-yellow-50 to-orange-50 border border-yellow-200 rounded-lg p-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center">
                <FaShieldAlt className="text-yellow-600 text-xl mr-3" />
                <div>
                  <h4 className="font-semibold text-gray-800">Verified Seller Badge</h4>
                  <p className="text-sm text-gray-600">Build trust with verified status</p>
                </div>
              </div>
              <label className="relative inline-flex items-center cursor-pointer">
                <input
                  type="checkbox"
                  checked={formData.verifiedBadge}
                  onChange={(e) => handleInputChange('verifiedBadge', e.target.checked)}
                  className="sr-only peer"
                />
                <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-600"></div>
              </label>
            </div>
            <p className="text-xs text-yellow-700 mt-2">
              <FaStar className="inline mr-1" />
              Optional upsell - Add $4.99 for verification
            </p>
          </div>
        </div>
      </div>

      {/* Navigation Buttons */}
      <div className="flex justify-between mt-8">
        <button
          onClick={() => setCurrentStep(3)}
          className="inline-flex items-center px-6 py-2 border border-gray-300 text-gray-700 font-medium rounded-lg hover:bg-gray-50 transition-all duration-300"
        >
          <FaArrowLeft className="mr-2" />
          Previous
        </button>
        <button
          onClick={() => {
            if (validateStep4()) setCurrentStep(5);
          }}
          className="inline-flex items-center px-6 py-2 bg-blue-600 text-white font-medium rounded-lg hover:bg-blue-700 transition-all duration-300"
        >
          Next
          <FaArrowRight className="ml-2" />
        </button>
      </div>
    </div>
  );

  const Step5 = () => (
    <div className="space-y-6">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h2 className="text-3xl font-bold text-gray-900">Location Map</h2>
          <p className="text-gray-600 mt-1">Add location to make your advert feel global and real</p>
        </div>
        <button
          onClick={() => setCurrentStep(4)}
          className="text-blue-600 hover:text-blue-700 font-medium"
        >
          ← Back
        </button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Map Area */}
        <div className="lg:col-span-2">
          <div className="bg-white border border-gray-300 rounded-lg overflow-hidden" style={{ height: '400px' }}>
            {/* Map Placeholder - In production, integrate with Google Maps or similar */}
            <div className="w-full h-full bg-gradient-to-br from-blue-50 to-green-50 relative">
              <div className="absolute inset-0 flex items-center justify-center">
                <div className="text-center">
                  <MdLocationOn className="text-6xl text-blue-500 mx-auto mb-4" />
                  <h3 className="text-xl font-semibold text-gray-700 mb-2">Interactive Map</h3>
                  <p className="text-gray-600 mb-4">Click to set your location</p>
                  <button
                    onClick={() => setShowMapPreview(!showMapPreview)}
                    className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
                  >
                    {showMapPreview ? 'Hide' : 'Show'} Map Preview
                  </button>
                </div>
              </div>
              
              {/* Simulated Map Marker */}
              {mapMarker && (
                <div 
                  className="absolute w-8 h-8 bg-red-500 rounded-full border-4 border-white shadow-lg transform -translate-x-1/2 -translate-y-1/2"
                  style={{ 
                    left: `${50 + (mapMarker.lng + 74) * 2}%`, 
                    top: `${50 - (mapMarker.lat - 40) * 2}%` 
                  }}
                >
                  <FaMapMarkerAlt className="text-white text-xs absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2" />
                </div>
              )}
            </div>
          </div>
          
          <div className="mt-4 flex justify-center space-x-4">
            <button
              onClick={() => handleMapClick(40.7128, -74.0060)}
              className="px-4 py-2 bg-gray-200 text-gray-700 rounded-lg hover:bg-gray-300 transition-colors"
            >
              <MdMyLocation className="inline mr-2" />
              Use Current Location
            </button>
            <button
              onClick={() => {
                setMapMarker(null);
                setFormData(prev => ({ ...prev, locationLat: null, locationLng: null }));
              }}
              className="px-4 py-2 bg-red-100 text-red-700 rounded-lg hover:bg-red-200 transition-colors"
            >
              <MdClose className="inline mr-2" />
              Clear Location
            </button>
          </div>
        </div>

        {/* Location Settings */}
        <div className="space-y-6">
          <div>
            <h3 className="text-lg font-semibold text-gray-800 mb-4">Location Settings</h3>
            
            {/* Privacy Options */}
            <div className="space-y-3">
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Location Privacy
              </label>
              
              <button
                onClick={() => handleLocationPrivacyChange('exact')}
                className={`w-full p-4 border rounded-lg text-left transition-all ${
                  formData.locationPrivacy === 'exact' 
                    ? 'border-blue-500 bg-blue-50' 
                    : 'border-gray-300 hover:border-gray-400'
                }`}
              >
                <div className="flex items-center">
                  <MdPublic className="text-blue-600 mr-3" />
                  <div>
                    <h4 className="font-semibold text-gray-800">Exact Location</h4>
                    <p className="text-sm text-gray-600">Show precise location on map</p>
                  </div>
                </div>
              </button>

              <button
                onClick={() => handleLocationPrivacyChange('approximate')}
                className={`w-full p-4 border rounded-lg text-left transition-all ${
                  formData.locationPrivacy === 'approximate' 
                    ? 'border-blue-500 bg-blue-50' 
                    : 'border-gray-300 hover:border-gray-400'
                }`}
              >
                <div className="flex items-center">
                  <MdLockOutline className="text-blue-600 mr-3" />
                  <div>
                    <h4 className="font-semibold text-gray-800">Approximate Location</h4>
                    <p className="text-sm text-gray-600">Show general area only</p>
                  </div>
                </div>
              </button>
            </div>
          </div>

          {/* Location Info */}
          {mapMarker && (
            <div className="bg-green-50 border border-green-200 rounded-lg p-4">
              <h4 className="font-semibold text-green-800 mb-2">Location Set</h4>
              <p className="text-sm text-green-700">
                <FaMapPin className="inline mr-1" />
                Lat: {mapMarker.lat.toFixed(4)}, Lng: {mapMarker.lng.toFixed(4)}
              </p>
              <p className="text-sm text-green-600 mt-1">
                {formData.locationPrivacy === 'exact' ? 'Exact location will be shown' : 'Approximate area will be shown'}
              </p>
            </div>
          )}

          <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
            <h4 className="font-semibold text-blue-800 mb-2">
              <FaInfoCircle className="inline mr-1" />
              Why Add Location?
            </h4>
            <ul className="text-sm text-blue-700 space-y-1">
              <li>• Increases trust and credibility</li>
              <li>• Helps local customers find you</li>
              <li>• Improves search ranking</li>
              <li>• Shows you're a real seller</li>
            </ul>
          </div>
        </div>
      </div>

      {/* Navigation Buttons */}
      <div className="flex justify-between mt-8">
        <button
          onClick={() => setCurrentStep(4)}
          className="inline-flex items-center px-6 py-2 border border-gray-300 text-gray-700 font-medium rounded-lg hover:bg-gray-50 transition-all duration-300"
        >
          <FaArrowLeft className="mr-2" />
          Previous
        </button>
        <button
          onClick={() => setCurrentStep(6)}
          className="inline-flex items-center px-6 py-2 bg-blue-600 text-white font-medium rounded-lg hover:bg-blue-700 transition-all duration-300"
        >
          Next
          <FaArrowRight className="ml-2" />
        </button>
      </div>
    </div>
  );

  const Step6 = () => {
    const selectedPackageData = upsalePackages.find(pkg => pkg.id === formData.selectedPackage);
    
    return (
      <div className="space-y-6 relative">
        {/* Smart Recommendation Banner */}
        <div className="bg-gradient-to-r from-blue-600 to-purple-600 text-white rounded-xl p-6 shadow-lg">
          <div className="flex items-center justify-between">
            <div className="flex items-center">
              <div className="w-12 h-12 bg-white/20 rounded-full flex items-center justify-center mr-4">
                <FaChartLine className="text-2xl" />
              </div>
              <div>
                <h3 className="text-xl font-bold mb-1">Smart Recommendation</h3>
                <p className="text-blue-100">Promoted Plus adverts get 4× more views on average.</p>
              </div>
            </div>
            <button
              onClick={() => handlePackageSelect('plus')}
              className="bg-white text-blue-600 px-4 py-2 rounded-lg font-semibold hover:bg-blue-50 transition-colors"
            >
              Upgrade to Plus
            </button>
          </div>
        </div>

        <div className="flex items-center justify-between mb-6">
          <div>
            <h2 className="text-3xl font-bold text-gray-900">Promoted Upsale Options</h2>
            <p className="text-gray-600 mt-1">Choose your promotion package to maximize visibility</p>
          </div>
          <button
            onClick={() => setCurrentStep(5)}
            className="text-blue-600 hover:text-blue-700 font-medium"
          >
            ← Back
          </button>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
          {upsalePackages.map((pkg) => {
            const Icon = pkg.icon;
            const isSelected = formData.selectedPackage === pkg.id;
            
            return (
              <div
                key={pkg.id}
                className={`relative rounded-2xl border-2 p-6 transition-all duration-300 hover:scale-105 cursor-pointer ${
                  isSelected 
                    ? 'border-blue-500 bg-gradient-to-br from-blue-50 to-indigo-50 shadow-2xl' 
                    : 'border-gray-200 bg-white hover:border-gray-300 hover:shadow-lg'
                }`}
                onClick={() => handlePackageSelect(pkg.id)}
              >
                {pkg.popular && (
                  <div className="absolute -top-3 left-1/2 transform -translate-x-1/2 z-10">
                    <span className="bg-gradient-to-r from-amber-500 to-orange-500 text-white text-xs font-bold px-4 py-2 rounded-full shadow-lg">
                      MOST POPULAR
                    </span>
                  </div>
                )}
                
                {/* Radio Button */}
                <div className="absolute top-4 right-4">
                  <div className={`w-6 h-6 rounded-full border-2 flex items-center justify-center transition-all ${
                    isSelected 
                      ? 'border-blue-500 bg-blue-500' 
                      : 'border-gray-300 bg-white'
                  }`}>
                    {isSelected && (
                      <div className="w-3 h-3 bg-white rounded-full"></div>
                    )}
                  </div>
                </div>
                
                <div className={`w-16 h-16 rounded-2xl bg-gradient-to-br from-${pkg.color}-100 to-${pkg.color}-50 flex items-center justify-center mx-auto mb-6 shadow-md`}>
                  <Icon className={`text-3xl text-${pkg.color}-600`} />
                </div>
                
                <div className="text-center mb-6">
                  <h3 className="font-bold text-xl text-gray-900 mb-2">{pkg.name}</h3>
                  <p className={`text-sm font-semibold text-${pkg.color}-600 mb-4`}>{pkg.subtitle}</p>
                  <div className="flex items-baseline justify-center">
                    <span className="text-4xl font-bold text-gray-900">{pkg.price}</span>
                    <span className="text-gray-600 text-sm ml-2">/{pkg.duration}</span>
                  </div>
                </div>
                
                <ul className="space-y-3 mb-8">
                  {pkg.features.map((feature, index) => (
                    <li key={index} className="flex items-start">
                      <FaCheckCircle className="text-green-500 mt-1 mr-3 flex-shrink-0" />
                      <span className="text-sm text-gray-700 leading-relaxed">{feature}</span>
                    </li>
                  ))}
                </ul>
              </div>
            );
          })}
        </div>

        {/* Enhanced Comparison Table */}
        <div className="bg-gradient-to-br from-gray-50 to-blue-50 rounded-2xl border border-gray-200 p-8 mt-8 shadow-lg">
          <h3 className="text-2xl font-bold text-gray-900 mb-6 text-center">Package Comparison</h3>
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b border-gray-200">
                  <th className="text-left py-4 px-4 font-semibold text-gray-700">Feature</th>
                  <th className="text-center py-4 px-4 font-semibold text-blue-600">Basic</th>
                  <th className="text-center py-4 px-4 font-semibold text-purple-600">Plus</th>
                  <th className="text-center py-4 px-4 font-semibold text-amber-600">Premium</th>
                  <th className="text-center py-4 px-4 font-semibold text-red-600">Network‑Wide</th>
                </tr>
              </thead>
              <tbody>
                <tr className="border-b border-gray-100 hover:bg-white transition-colors">
                  <td className="py-4 px-4 font-medium text-gray-700">Visibility</td>
                  <td className="text-center py-4 px-4">2× More</td>
                  <td className="text-center py-4 px-4">4× More</td>
                  <td className="text-center py-4 px-4">Maximum</td>
                  <td className="text-center py-4 px-4">Network‑Wide</td>
                </tr>
                <tr className="border-b border-gray-100 hover:bg-white transition-colors">
                  <td className="py-4 px-4 font-medium text-gray-700">Placement</td>
                  <td className="text-center py-4 px-4">Above Standard</td>
                  <td className="text-center py-4 px-4">Top Category</td>
                  <td className="text-center py-4 px-4">Homepage</td>
                  <td className="text-center py-4 px-4">Multi‑Page</td>
                </tr>
                <tr className="border-b border-gray-100 hover:bg-white transition-colors">
                  <td className="py-4 px-4 font-medium text-gray-700">Email Inclusion</td>
                  <td className="text-center py-4 px-4">❌</td>
                  <td className="text-center py-4 px-4">✅ Weekly</td>
                  <td className="text-center py-4 px-4">✅ Weekly</td>
                  <td className="text-center py-4 px-4">✅ Newsletter</td>
                </tr>
                <tr className="border-b border-gray-100 hover:bg-white transition-colors">
                  <td className="py-4 px-4 font-medium text-gray-700">Social Boost</td>
                  <td className="text-center py-4 px-4">❌</td>
                  <td className="text-center py-4 px-4">✅</td>
                  <td className="text-center py-4 px-4">✅</td>
                  <td className="text-center py-4 px-4">✅ Push</td>
                </tr>
                <tr className="border-b border-gray-100 hover:bg-white transition-colors">
                  <td className="py-4 px-4 font-medium text-gray-700">Badge Type</td>
                  <td className="text-center py-4 px-4">
                    <span className="inline-flex items-center px-2 py-1 bg-gray-100 text-gray-700 rounded-full text-xs">Promoted</span>
                  </td>
                  <td className="text-center py-4 px-4">
                    <span className="inline-flex items-center px-2 py-1 bg-purple-100 text-purple-700 rounded-full text-xs">Promoted</span>
                  </td>
                  <td className="text-center py-4 px-4">
                    <span className="inline-flex items-center px-2 py-1 bg-amber-100 text-amber-700 rounded-full text-xs">Premium</span>
                  </td>
                  <td className="text-center py-4 px-4">
                    <span className="inline-flex items-center px-2 py-1 bg-red-100 text-red-700 rounded-full text-xs">Top Spotlight</span>
                  </td>
                </tr>
                <tr className="hover:bg-white transition-colors">
                  <td className="py-4 px-4 font-medium text-gray-700">Duration</td>
                  <td className="text-center py-4 px-4 font-semibold">7 days</td>
                  <td className="text-center py-4 px-4 font-semibold">14 days</td>
                  <td className="text-center py-4 px-4 font-semibold">30 days</td>
                  <td className="text-center py-4 px-4 font-semibold">60 days</td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>

        {/* Revenue Stats */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-8">
          <div className="bg-gradient-to-br from-green-50 to-emerald-50 border border-green-200 rounded-2xl p-6 text-center shadow-lg hover:shadow-xl transition-shadow">
            <FaChartLine className="text-4xl text-green-600 mx-auto mb-3" />
            <h4 className="font-bold text-green-800 text-lg mb-2">3x More Views</h4>
            <p className="text-green-600">On average with promoted ads</p>
          </div>
          <div className="bg-gradient-to-br from-blue-50 to-indigo-50 border border-blue-200 rounded-2xl p-6 text-center shadow-lg hover:shadow-xl transition-shadow">
            <FaUsers className="text-4xl text-blue-600 mx-auto mb-3" />
            <h4 className="font-bold text-blue-800 text-lg mb-2">2x More Leads</h4>
            <p className="text-blue-600">Higher conversion rates</p>
          </div>
          <div className="bg-gradient-to-br from-purple-50 to-pink-50 border border-purple-200 rounded-2xl p-6 text-center shadow-lg hover:shadow-xl transition-shadow">
            <FaTrophy className="text-4xl text-purple-600 mx-auto mb-3" />
            <h4 className="font-bold text-purple-800 text-lg mb-2">Top Placement</h4>
            <p className="text-purple-600">Above regular ads</p>
          </div>
        </div>

        {/* Sticky Summary Box */}
        {selectedPackageData && (
          <div className={`fixed bottom-6 right-6 bg-white rounded-2xl shadow-2xl border border-gray-200 p-6 w-80 z-50 transition-all duration-300 ${
            showStickySummary ? 'translate-y-0 opacity-100' : 'translate-y-full opacity-0'
          }`}>
            <div className="flex items-center justify-between mb-4">
              <h4 className="font-bold text-gray-900">Order Summary</h4>
              <button
                onClick={() => setShowStickySummary(!showStickySummary)}
                className="text-gray-400 hover:text-gray-600"
              >
                <MdClose />
              </button>
            </div>
            
            <div className="space-y-3 mb-6">
              <div className="flex justify-between items-center">
                <span className="text-gray-600">Selected Tier:</span>
                <span className="font-semibold text-gray-900">{selectedPackageData.name}</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-gray-600">Duration:</span>
                <span className="font-semibold text-gray-900">{selectedPackageData.duration}</span>
              </div>
              <div className="border-t pt-3">
                <div className="flex justify-between items-center">
                  <span className="text-lg font-bold text-gray-900">Total Cost:</span>
                  <span className="text-2xl font-bold text-blue-600">{selectedPackageData.price}</span>
                </div>
              </div>
            </div>
            
            <button
              onClick={() => setCurrentStep(7)}
              className="w-full bg-gradient-to-r from-blue-600 to-purple-600 text-white font-bold py-3 rounded-xl hover:from-blue-700 hover:to-purple-700 transition-all duration-300 shadow-lg hover:shadow-xl"
            >
              Proceed to Payment
            </button>
          </div>
        )}

        {/* Toggle Sticky Summary Button */}
        <button
          onClick={() => setShowStickySummary(!showStickySummary)}
          className="fixed bottom-6 right-6 bg-blue-600 text-white p-4 rounded-full shadow-lg hover:bg-blue-700 transition-all duration-300 z-40 hover:scale-110"
        >
          <FaEye />
        </button>

        {/* Navigation Buttons */}
        <div className="flex justify-between mt-8">
          <button
            onClick={() => setCurrentStep(5)}
            className="inline-flex items-center px-6 py-3 border border-gray-300 text-gray-700 font-medium rounded-xl hover:bg-gray-50 transition-all duration-300"
          >
            <FaArrowLeft className="mr-2" />
            Previous
          </button>
          <button
            onClick={() => setCurrentStep(7)}
            className="inline-flex items-center px-6 py-3 bg-gradient-to-r from-blue-600 to-purple-600 text-white font-medium rounded-xl hover:from-blue-700 hover:to-purple-700 transition-all duration-300"
          >
            Continue
            <FaArrowRight className="ml-2" />
          </button>
        </div>
      </div>
    );
  };

  const Step7 = () => {
    const selectedPackageData = upsalePackages.find(pkg => pkg.id === formData.selectedPackage);
    
    const handleFinalSubmit = async () => {
      if (!termsAccepted || !accurateConfirmed) {
        alert('Please accept the terms and confirm accuracy before submitting.');
        return;
      }
      
      await handleSubmit();
    };

    return (
      <div className="space-y-6">
        <div className="flex items-center justify-between mb-6">
          <div>
            <h2 className="text-3xl font-bold text-gray-900">Final Submission</h2>
            <p className="text-gray-600 mt-1">Review and submit your promoted advert</p>
          </div>
          <button
            onClick={() => setCurrentStep(6)}
            className="text-blue-600 hover:text-blue-700 font-medium"
          >
            ← Back
          </button>
        </div>

        {/* Order Summary */}
        <div className="bg-gradient-to-br from-blue-50 to-indigo-50 rounded-2xl border border-blue-200 p-8 shadow-lg">
          <h3 className="text-2xl font-bold text-gray-900 mb-6">Order Summary</h3>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <div className="space-y-4">
              <h4 className="font-semibold text-gray-800 mb-3">Advert Details</h4>
              <div className="space-y-2">
                <div className="flex justify-between">
                  <span className="text-gray-600">Title:</span>
                  <span className="font-medium text-gray-900">{formData.title}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Category:</span>
                  <span className="font-medium text-gray-900">{formData.category}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Location:</span>
                  <span className="font-medium text-gray-900">{formData.city}, {formData.country}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Duration:</span>
                  <span className="font-medium text-gray-900">{selectedPackageData?.duration}</span>
                </div>
              </div>
            </div>
            
            <div className="space-y-4">
              <h4 className="font-semibold text-gray-800 mb-3">Payment Details</h4>
              <div className="space-y-2">
                <div className="flex justify-between">
                  <span className="text-gray-600">Package:</span>
                  <span className="font-medium text-gray-900">{selectedPackageData?.name}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Base Price:</span>
                  <span className="font-medium text-gray-900">{selectedPackageData?.price}</span>
                </div>
                {formData.verifiedBadge && (
                  <div className="flex justify-between">
                    <span className="text-gray-600">Verified Badge:</span>
                    <span className="font-medium text-gray-900">£4.99</span>
                  </div>
                )}
                <div className="border-t pt-2 mt-4">
                  <div className="flex justify-between items-center">
                    <span className="text-lg font-bold text-gray-900">Total:</span>
                    <span className="text-2xl font-bold text-blue-600">
                      £{(parseFloat(selectedPackageData?.price?.replace('£', '') || 0) + (formData.verifiedBadge ? 4.99 : 0)).toFixed(2)}
                    </span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Terms and Conditions */}
        <div className="bg-white rounded-2xl border border-gray-200 p-8 shadow-lg">
          <h3 className="text-xl font-bold text-gray-900 mb-6">Terms & Conditions</h3>
          
          <div className="space-y-4">
            <label className="flex items-start space-x-3 cursor-pointer hover:bg-gray-50 p-3 rounded-lg transition-colors">
              <input
                type="checkbox"
                checked={accurateConfirmed}
                onChange={(e) => setAccurateConfirmed(e.target.checked)}
                className="mt-1 w-5 h-5 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
              />
              <div className="flex-1">
                <span className="text-gray-700 font-medium">I confirm this advert is accurate</span>
                <p className="text-sm text-gray-500 mt-1">
                  By checking this box, you confirm that all information provided is true and accurate to the best of your knowledge.
                </p>
              </div>
            </label>

            <label className="flex items-start space-x-3 cursor-pointer hover:bg-gray-50 p-3 rounded-lg transition-colors">
              <input
                type="checkbox"
                checked={termsAccepted}
                onChange={(e) => setTermsAccepted(e.target.checked)}
                className="mt-1 w-5 h-5 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
              />
              <div className="flex-1">
                <span className="text-gray-700 font-medium">I agree to the terms</span>
                <p className="text-sm text-gray-500 mt-1">
                  You agree to our Terms of Service, Privacy Policy, and Advertising Guidelines. 
                  <a href="/help/terms-and-condition" className="text-blue-600 hover:text-blue-700 underline ml-1">View Terms</a>
                </p>
              </div>
            </label>
          </div>
        </div>

        {/* Submit Button */}
        <div className="flex justify-center mt-8">
          <button
            onClick={handleFinalSubmit}
            disabled={isUploading || !termsAccepted || !accurateConfirmed}
            className="inline-flex items-center px-12 py-4 bg-gradient-to-r from-green-600 to-blue-600 text-white font-bold text-lg rounded-2xl hover:from-green-700 hover:to-blue-700 transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed shadow-xl hover:shadow-2xl transform hover:scale-105"
          >
            {isUploading ? (
              <>
                <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-white mr-3"></div>
                Processing...
              </>
            ) : (
              <>
                <FaRocket className="mr-3" />
                {selectedPackageData ? 'Proceed to Payment' : 'Submit Promoted Advert'}
              </>
            )}
          </button>
        </div>

        {/* Security Badge */}
        <div className="text-center mt-6">
          <div className="inline-flex items-center text-sm text-gray-500">
            <FaLock className="mr-2" />
            Secure payment processing • 256-bit SSL encryption
          </div>
        </div>
      </div>
    );
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 py-12">
      <div className="page-container">
        {/* Header */}
        <div className="text-center mb-10">
          <h1 className="text-4xl font-bold text-gray-900 mb-3">
            <span className="text-blue-600">Promoted</span> Advert Posting
          </h1>
          <p className="text-xl text-gray-600">Create premium, global, and upsale-driven adverts</p>
        </div>

        {/* Progress Bar */}
        <div className="mb-8">
          <div className="flex items-center justify-center space-x-1 sm:space-x-2 lg:space-x-4 overflow-x-auto">
            <div className={`flex items-center ${currentStep >= 1 ? 'text-blue-600' : 'text-gray-400'}`}>
              <div className={`w-5 h-5 sm:w-6 sm:h-6 lg:w-8 lg:h-8 rounded-full flex items-center justify-center text-xs sm:text-xs lg:text-sm ${
                currentStep >= 1 ? 'bg-blue-600 text-white' : 'bg-gray-300'
              }`}>
                1
              </div>
              <span className="ml-1 sm:ml-2 font-medium text-xs hidden lg:inline">Type</span>
            </div>
            <div className={`w-2 sm:w-3 lg:w-16 h-1 ${currentStep >= 2 ? 'bg-blue-600' : 'bg-gray-300'}`}></div>
            <div className={`flex items-center ${currentStep >= 2 ? 'text-blue-600' : 'text-gray-400'}`}>
              <div className={`w-5 h-5 sm:w-6 sm:h-6 lg:w-8 lg:h-8 rounded-full flex items-center justify-center text-xs sm:text-xs lg:text-sm ${
                currentStep >= 2 ? 'bg-blue-600 text-white' : 'bg-gray-300'
              }`}>
                2
              </div>
              <span className="ml-1 sm:ml-2 font-medium text-xs hidden lg:inline">Details</span>
            </div>
            <div className={`w-2 sm:w-3 lg:w-16 h-1 ${currentStep >= 3 ? 'bg-blue-600' : 'bg-gray-300'}`}></div>
            <div className={`flex items-center ${currentStep >= 3 ? 'text-blue-600' : 'text-gray-400'}`}>
              <div className={`w-5 h-5 sm:w-6 sm:h-6 lg:w-8 lg:h-8 rounded-full flex items-center justify-center text-xs sm:text-xs lg:text-sm ${
                currentStep >= 3 ? 'bg-blue-600 text-white' : 'bg-gray-300'
              }`}>
                3
              </div>
              <span className="ml-1 sm:ml-2 font-medium text-xs hidden lg:inline">Description</span>
            </div>
            <div className={`w-2 sm:w-3 lg:w-16 h-1 ${currentStep >= 4 ? 'bg-blue-600' : 'bg-gray-300'}`}></div>
            <div className={`flex items-center ${currentStep >= 4 ? 'text-blue-600' : 'text-gray-400'}`}>
              <div className={`w-5 h-5 sm:w-6 sm:h-6 lg:w-8 lg:h-8 rounded-full flex items-center justify-center text-xs sm:text-xs lg:text-sm ${
                currentStep >= 4 ? 'bg-blue-600 text-white' : 'bg-gray-300'
              }`}>
                4
              </div>
              <span className="ml-1 sm:ml-2 font-medium text-xs hidden lg:inline">Seller</span>
            </div>
            <div className={`w-2 sm:w-3 lg:w-16 h-1 ${currentStep >= 5 ? 'bg-blue-600' : 'bg-gray-300'}`}></div>
            <div className={`flex items-center ${currentStep >= 5 ? 'text-blue-600' : 'text-gray-400'}`}>
              <div className={`w-5 h-5 sm:w-6 sm:h-6 lg:w-8 lg:h-8 rounded-full flex items-center justify-center text-xs sm:text-xs lg:text-sm ${
                currentStep >= 5 ? 'bg-blue-600 text-white' : 'bg-gray-300'
              }`}>
                5
              </div>
              <span className="ml-1 sm:ml-2 font-medium text-xs hidden lg:inline">Location</span>
            </div>
            <div className={`w-2 sm:w-3 lg:w-16 h-1 ${currentStep >= 6 ? 'bg-blue-600' : 'bg-gray-300'}`}></div>
            <div className={`flex items-center ${currentStep >= 6 ? 'text-blue-600' : 'text-gray-400'}`}>
              <div className={`w-5 h-5 sm:w-6 sm:h-6 lg:w-8 lg:h-8 rounded-full flex items-center justify-center text-xs sm:text-xs lg:text-sm ${
                currentStep >= 6 ? 'bg-blue-600 text-white' : 'bg-gray-300'
              }`}>
                6
              </div>
              <span className="ml-1 sm:ml-2 font-medium text-xs hidden lg:inline">Promote</span>
            </div>
            <div className={`w-2 sm:w-3 lg:w-16 h-1 ${currentStep >= 7 ? 'bg-blue-600' : 'bg-gray-300'}`}></div>
            <div className={`flex items-center ${currentStep >= 7 ? 'text-blue-600' : 'text-gray-400'}`}>
              <div className={`w-5 h-5 sm:w-6 sm:h-6 lg:w-8 lg:h-8 rounded-full flex items-center justify-center text-xs sm:text-xs lg:text-sm ${
                currentStep >= 7 ? 'bg-blue-600 text-white' : 'bg-gray-300'
              }`}>
                7
              </div>
              <span className="ml-1 sm:ml-2 font-medium text-xs hidden lg:inline">Submit</span>
            </div>
          </div>
        </div>

        {/* Form Content */}
        <div className="bg-white rounded-2xl shadow-xl p-4 sm:p-6 lg:p-8">
          {currentStep === 1 && <Step1 />}
          {currentStep === 2 && <Step2 />}
          {currentStep === 3 && <Step3 />}
          {currentStep === 4 && <Step4 />}
          {currentStep === 5 && <Step5 />}
          {currentStep === 6 && <Step6 />}
          {currentStep === 7 && <Step7 />}
        </div>
      </div>
    </div>
  );
};

export default PromotedAdPostForm;
