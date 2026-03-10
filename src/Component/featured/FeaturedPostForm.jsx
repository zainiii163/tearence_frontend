import React, { useState } from 'react';
import { 
  X, 
  ChevronLeft, 
  ChevronRight, 
  Check, 
  Upload, 
  Camera, 
  Video, 
  FileText, 
  MapPin, 
  CreditCard, 
  Shield, 
  Star, 
  Crown, 
  Zap, 
  Target,
  Package,
  TrendingUp,
  Award,
  Briefcase,
  Calendar,
  Car,
  Users,
  BarChart3,
  Globe,
  Phone,
  Mail,
  User,
  Building,
  Tag,
  DollarSign,
  CheckSquare,
  AlertCircle,
  Info
} from 'lucide-react';

const FeaturedPostForm = ({ onClose }) => {
  const [currentStep, setCurrentStep] = useState(1);
  const [formData, setFormData] = useState({
    // Step 1: Advert Type
    advertType: '',
    
    // Step 2: Basic Information
    title: '',
    tagline: '',
    category: '',
    country: '',
    city: '',
    price: '',
    condition: '',
    
    // Step 3: Media
    mainImage: null,
    additionalImages: [],
    videoLink: '',
    
    // Step 4: Description
    overview: '',
    keyFeatures: '',
    whatMakesItSpecial: '',
    whyFeatured: '',
    
    // Step 5: Seller Info
    sellerName: '',
    businessName: '',
    phone: '',
    email: '',
    website: '',
    socialLinks: '',
    verifiedBadge: false,
    
    // Step 6: Location
    useExactLocation: false,
    address: '',
    coordinates: null,
    
    // Step 7: Premium Upsell
    promotionTier: 'promoted'
  });

  const [errors, setErrors] = useState({});
  const [uploadedImages, setUploadedImages] = useState([]);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const advertTypes = [
    {
      id: 'product',
      name: 'Product',
      description: 'Physical items for sale',
      icon: Package,
      color: 'from-blue-500 to-cyan-500'
    },
    {
      id: 'service',
      name: 'Service',
      description: 'Professional services offered',
      icon: User,
      color: 'from-purple-500 to-pink-500'
    },
    {
      id: 'property',
      name: 'Property',
      description: 'Real estate listings',
      icon: Building,
      color: 'from-green-500 to-emerald-500'
    },
    {
      id: 'job',
      name: 'Job',
      description: 'Employment opportunities',
      icon: Briefcase,
      color: 'from-yellow-500 to-orange-500'
    },
    {
      id: 'event',
      name: 'Event',
      description: 'Events and tickets',
      icon: Calendar,
      color: 'from-red-500 to-pink-500'
    },
    {
      id: 'vehicle',
      name: 'Vehicle',
      description: 'Cars and transportation',
      icon: Car,
      color: 'from-indigo-500 to-purple-500'
    },
    {
      id: 'misc',
      name: 'Miscellaneous',
      description: 'Other listings',
      icon: Tag,
      color: 'from-gray-500 to-gray-700'
    }
  ];

  const categories = [
    { value: 'property', label: 'Property' },
    { value: 'vehicles', label: 'Cars & Vehicles' },
    { value: 'jobs', label: 'Jobs & Services' },
    { value: 'business', label: 'Business Opportunities' },
    { value: 'electronics', label: 'Electronics' },
    { value: 'fashion', label: 'Fashion & Beauty' },
    { value: 'travel', label: 'Travel & Experiences' },
    { value: 'events', label: 'Events & Tickets' },
    { value: 'pets', label: 'Pets & Animals' },
    { value: 'home-garden', label: 'Home & Garden' },
    { value: 'health', label: 'Health & Wellness' },
    { value: 'education', label: 'Education & Courses' }
  ];

  const conditions = ['New', 'Used', 'Refurbished', 'Not Applicable'];

  const promotionTiers = [
    {
      id: 'promoted',
      name: 'Promoted',
      price: '$29',
      period: 'month',
      description: 'Enhanced visibility for your listing',
      features: [
        'Highlighted card design',
        'Appears above standard listings',
        'Promoted badge',
        '2× visibility boost',
        'Basic analytics'
      ],
      icon: Star,
      color: 'from-blue-500 to-cyan-500',
      popular: false
    },
    {
      id: 'featured',
      name: 'Featured',
      price: '$79',
      period: 'month',
      description: 'Premium placement with maximum exposure',
      features: [
        'Top of category pages',
        'Larger card display',
        'Priority search placement',
        'Featured badge',
        'Included in weekly "Top Featured Ads" email',
        '3× visibility boost',
        'Advanced analytics',
        'Click tracking'
      ],
      icon: Crown,
      color: 'from-purple-500 to-pink-500',
      popular: true
    },
    {
      id: 'sponsored',
      name: 'Sponsored',
      price: '$199',
      period: 'month',
      description: 'Maximum visibility across the platform',
      features: [
        'Homepage slider placement',
        'Category top placement',
        'Social media promotion',
        'Sponsored badge',
        '5× visibility boost',
        'Premium analytics',
        'Conversion tracking',
        'Dedicated support',
        'A/B testing tools'
      ],
      icon: Zap,
      color: 'from-yellow-500 to-orange-500',
      popular: false
    }
  ];

  const countries = [
    { value: 'us', label: 'United States', flag: '🇺🇸' },
    { value: 'uk', label: 'United Kingdom', flag: '🇬🇧' },
    { value: 'france', label: 'France', flag: '🇫🇷' },
    { value: 'germany', label: 'Germany', flag: '🇩🇪' },
    { value: 'italy', label: 'Italy', flag: '🇮🇹' },
    { value: 'spain', label: 'Spain', flag: '🇪🇸' },
    { value: 'japan', label: 'Japan', flag: '🇯🇵' },
    { value: 'china', label: 'China', flag: '🇨🇳' },
    { value: 'singapore', label: 'Singapore', flag: '🇸🇬' },
    { value: 'australia', label: 'Australia', flag: '🇦🇺' },
    { value: 'canada', label: 'Canada', flag: '🇨🇦' }
  ];

  const handleInputChange = (field, value) => {
    setFormData(prev => ({ ...prev, [field]: value }));
    if (errors[field]) {
      setErrors(prev => ({ ...prev, [field]: '' }));
    }
  };

  const handleImageUpload = (e, isMain = false) => {
    const files = Array.from(e.target.files);
    if (isMain && files.length > 0) {
      setFormData(prev => ({ ...prev, mainImage: files[0] }));
    } else {
      setFormData(prev => ({ 
        ...prev, 
        additionalImages: [...prev.additionalImages, ...files].slice(0, 10) 
      }));
    }
    
    // Create preview URLs
    const newImages = files.map(file => ({
      file,
      preview: URL.createObjectURL(file),
      isMain
    }));
    setUploadedImages(prev => [...prev, ...newImages]);
  };

  const removeImage = (index) => {
    setUploadedImages(prev => prev.filter((_, i) => i !== index));
  };

  const validateStep = (step) => {
    const newErrors = {};

    switch (step) {
      case 1:
        if (!formData.advertType) {
          newErrors.advertType = 'Please select an advert type';
        }
        break;
      case 2:
        if (!formData.title.trim()) newErrors.title = 'Title is required';
        if (!formData.tagline.trim()) newErrors.tagline = 'Tagline is required';
        if (!formData.category) newErrors.category = 'Category is required';
        if (!formData.country) newErrors.country = 'Country is required';
        if (!formData.city.trim()) newErrors.city = 'City is required';
        if (!formData.condition) newErrors.condition = 'Condition is required';
        break;
      case 3:
        if (!formData.mainImage) newErrors.mainImage = 'Main image is required';
        break;
      case 4:
        if (!formData.overview.trim()) newErrors.overview = 'Overview is required';
        if (!formData.keyFeatures.trim()) newErrors.keyFeatures = 'Key features are required';
        break;
      case 5:
        if (!formData.sellerName.trim()) newErrors.sellerName = 'Seller name is required';
        if (!formData.email.trim()) newErrors.email = 'Email is required';
        if (!formData.phone.trim()) newErrors.phone = 'Phone is required';
        break;
      case 6:
        if (!formData.address.trim()) newErrors.address = 'Address is required';
        break;
      case 7:
        if (!formData.promotionTier) newErrors.promotionTier = 'Please select a promotion tier';
        break;
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleNext = () => {
    if (validateStep(currentStep)) {
      if (currentStep < 7) {
        setCurrentStep(prev => prev + 1);
      }
    }
  };

  const handleBack = () => {
    if (currentStep > 1) {
      setCurrentStep(prev => prev - 1);
    }
  };

  const handleSubmit = async () => {
    if (validateStep(7)) {
      setIsSubmitting(true);
      // Simulate API call
      setTimeout(() => {
        setIsSubmitting(false);
        alert('Featured advert posted successfully!');
        onClose();
      }, 2000);
    }
  };

  const getStepTitle = () => {
    const titles = {
      1: 'Choose Advert Type',
      2: 'Basic Information',
      3: 'Media Upload',
      4: 'Description',
      5: 'Seller Information',
      6: 'Location Map',
      7: 'Premium Upsale Options'
    };
    return titles[currentStep];
  };

  const renderStepContent = () => {
    switch (currentStep) {
      case 1:
        return (
          <div className="space-y-6">
            <h3 className="text-xl font-semibold text-gray-900">What type of advert are you posting?</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {advertTypes.map((type) => {
                const Icon = type.icon;
                return (
                  <div
                    key={type.id}
                    onClick={() => handleInputChange('advertType', type.id)}
                    className={`p-6 border-2 rounded-xl cursor-pointer transition-all ${
                      formData.advertType === type.id
                        ? 'border-purple-500 bg-purple-50'
                        : 'border-gray-200 hover:border-gray-300'
                    }`}
                  >
                    <div className={`h-12 w-12 bg-gradient-to-br ${type.color} rounded-lg flex items-center justify-center mb-4`}>
                      <Icon className="h-6 w-6 text-white" />
                    </div>
                    <h4 className="font-semibold text-gray-900 mb-2">{type.name}</h4>
                    <p className="text-sm text-gray-600">{type.description}</p>
                  </div>
                );
              })}
            </div>
            {errors.advertType && (
              <p className="text-red-500 text-sm flex items-center">
                <AlertCircle className="h-4 w-4 mr-1" />
                {errors.advertType}
              </p>
            )}
          </div>
        );

      case 2:
        return (
          <div className="space-y-6">
            <h3 className="text-xl font-semibold text-gray-900">Basic Information</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Title *</label>
                <input
                  type="text"
                  value={formData.title}
                  onChange={(e) => handleInputChange('title', e.target.value)}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                  placeholder="Enter advert title"
                />
                {errors.title && <p className="text-red-500 text-sm mt-1">{errors.title}</p>}
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Tagline (max 80 chars) *</label>
                <input
                  type="text"
                  value={formData.tagline}
                  onChange={(e) => handleInputChange('tagline', e.target.value.slice(0, 80))}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                  placeholder="Short catchy description"
                  maxLength={80}
                />
                <p className="text-xs text-gray-500 mt-1">{formData.tagline.length}/80 characters</p>
                {errors.tagline && <p className="text-red-500 text-sm mt-1">{errors.tagline}</p>}
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Category *</label>
                <select
                  value={formData.category}
                  onChange={(e) => handleInputChange('category', e.target.value)}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                >
                  <option value="">Select category</option>
                  {categories.map(cat => (
                    <option key={cat.value} value={cat.value}>{cat.label}</option>
                  ))}
                </select>
                {errors.category && <p className="text-red-500 text-sm mt-1">{errors.category}</p>}
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Condition *</label>
                <select
                  value={formData.condition}
                  onChange={(e) => handleInputChange('condition', e.target.value)}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                >
                  <option value="">Select condition</option>
                  {conditions.map(cond => (
                    <option key={cond} value={cond}>{cond}</option>
                  ))}
                </select>
                {errors.condition && <p className="text-red-500 text-sm mt-1">{errors.condition}</p>}
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Country *</label>
                <select
                  value={formData.country}
                  onChange={(e) => handleInputChange('country', e.target.value)}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                >
                  <option value="">Select country</option>
                  {countries.map(country => (
                    <option key={country.value} value={country.value}>
                      {country.flag} {country.label}
                    </option>
                  ))}
                </select>
                {errors.country && <p className="text-red-500 text-sm mt-1">{errors.country}</p>}
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">City *</label>
                <input
                  type="text"
                  value={formData.city}
                  onChange={(e) => handleInputChange('city', e.target.value)}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                  placeholder="Enter city"
                />
                {errors.city && <p className="text-red-500 text-sm mt-1">{errors.city}</p>}
              </div>

              <div className="md:col-span-2">
                <label className="block text-sm font-medium text-gray-700 mb-2">Price</label>
                <input
                  type="text"
                  value={formData.price}
                  onChange={(e) => handleInputChange('price', e.target.value)}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                  placeholder="Enter price (e.g., $1,000, €500, etc.)"
                />
              </div>
            </div>
          </div>
        );

      case 3:
        return (
          <div className="space-y-6">
            <h3 className="text-xl font-semibold text-gray-900">Media Upload</h3>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Main Image *</label>
              <div className="border-2 border-dashed border-gray-300 rounded-lg p-8 text-center hover:border-gray-400 transition-colors">
                <input
                  type="file"
                  accept="image/*"
                  onChange={(e) => handleImageUpload(e, true)}
                  className="hidden"
                  id="main-image-upload"
                />
                <label htmlFor="main-image-upload" className="cursor-pointer">
                  <Camera className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                  <p className="text-gray-600 mb-2">Click to upload main image</p>
                  <p className="text-sm text-gray-500">PNG, JPG, GIF up to 10MB</p>
                </label>
              </div>
              {errors.mainImage && <p className="text-red-500 text-sm mt-1">{errors.mainImage}</p>}
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Additional Images (up to 10)</label>
              <div className="border-2 border-dashed border-gray-300 rounded-lg p-8 text-center hover:border-gray-400 transition-colors">
                <input
                  type="file"
                  accept="image/*"
                  multiple
                  onChange={(e) => handleImageUpload(e, false)}
                  className="hidden"
                  id="additional-images-upload"
                />
                <label htmlFor="additional-images-upload" className="cursor-pointer">
                  <Upload className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                  <p className="text-gray-600 mb-2">Click to upload additional images</p>
                  <p className="text-sm text-gray-500">PNG, JPG, GIF up to 10MB each</p>
                </label>
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Video Link (optional)</label>
              <input
                type="url"
                value={formData.videoLink}
                onChange={(e) => handleInputChange('videoLink', e.target.value)}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                placeholder="https://youtube.com/watch?v=..."
              />
            </div>

            {uploadedImages.length > 0 && (
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Uploaded Images</label>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                  {uploadedImages.map((image, index) => (
                    <div key={index} className="relative group">
                      <img
                        src={image.preview}
                        alt={`Upload ${index + 1}`}
                        className="w-full h-32 object-cover rounded-lg"
                      />
                      <button
                        onClick={() => removeImage(index)}
                        className="absolute top-2 right-2 bg-red-500 text-white p-1 rounded-full opacity-0 group-hover:opacity-100 transition-opacity"
                      >
                        <X className="h-4 w-4" />
                      </button>
                      {image.isMain && (
                        <div className="absolute top-2 left-2 bg-purple-500 text-white px-2 py-1 rounded text-xs">
                          Main
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        );

      case 4:
        return (
          <div className="space-y-6">
            <h3 className="text-xl font-semibold text-gray-900">Description</h3>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Overview *</label>
              <textarea
                value={formData.overview}
                onChange={(e) => handleInputChange('overview', e.target.value)}
                rows={4}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                placeholder="Provide a detailed overview of your advert..."
              />
              {errors.overview && <p className="text-red-500 text-sm mt-1">{errors.overview}</p>}
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Key Features *</label>
              <textarea
                value={formData.keyFeatures}
                onChange={(e) => handleInputChange('keyFeatures', e.target.value)}
                rows={4}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                placeholder="List the main features and benefits..."
              />
              {errors.keyFeatures && <p className="text-red-500 text-sm mt-1">{errors.keyFeatures}</p>}
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">What Makes It Special</label>
              <textarea
                value={formData.whatMakesItSpecial}
                onChange={(e) => handleInputChange('whatMakesItSpecial', e.target.value)}
                rows={3}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                placeholder="Describe unique selling points..."
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Why It Should Be Featured</label>
              <textarea
                value={formData.whyFeatured}
                onChange={(e) => handleInputChange('whyFeatured', e.target.value)}
                rows={3}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                placeholder="Explain why this advert deserves featured status..."
              />
            </div>
          </div>
        );

      case 5:
        return (
          <div className="space-y-6">
            <h3 className="text-xl font-semibold text-gray-900">Seller Information</h3>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Name *</label>
                <input
                  type="text"
                  value={formData.sellerName}
                  onChange={(e) => handleInputChange('sellerName', e.target.value)}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                  placeholder="Your name"
                />
                {errors.sellerName && <p className="text-red-500 text-sm mt-1">{errors.sellerName}</p>}
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Business Name (optional)</label>
                <input
                  type="text"
                  value={formData.businessName}
                  onChange={(e) => handleInputChange('businessName', e.target.value)}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                  placeholder="Business name"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Phone *</label>
                <input
                  type="tel"
                  value={formData.phone}
                  onChange={(e) => handleInputChange('phone', e.target.value)}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                  placeholder="+1 555-0123"
                />
                {errors.phone && <p className="text-red-500 text-sm mt-1">{errors.phone}</p>}
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Email *</label>
                <input
                  type="email"
                  value={formData.email}
                  onChange={(e) => handleInputChange('email', e.target.value)}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                  placeholder="email@example.com"
                />
                {errors.email && <p className="text-red-500 text-sm mt-1">{errors.email}</p>}
              </div>

              <div className="md:col-span-2">
                <label className="block text-sm font-medium text-gray-700 mb-2">Website (optional)</label>
                <input
                  type="url"
                  value={formData.website}
                  onChange={(e) => handleInputChange('website', e.target.value)}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                  placeholder="https://example.com"
                />
              </div>

              <div className="md:col-span-2">
                <label className="block text-sm font-medium text-gray-700 mb-2">Social Links (optional)</label>
                <input
                  type="text"
                  value={formData.socialLinks}
                  onChange={(e) => handleInputChange('socialLinks', e.target.value)}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                  placeholder="Facebook, Twitter, LinkedIn, etc."
                />
              </div>

              <div className="md:col-span-2">
                <label className="flex items-center space-x-3">
                  <input
                    type="checkbox"
                    checked={formData.verifiedBadge}
                    onChange={(e) => handleInputChange('verifiedBadge', e.target.checked)}
                    className="h-4 w-4 text-purple-600 focus:ring-purple-500 border-gray-300 rounded"
                  />
                  <span className="text-sm text-gray-700">
                    Add Verified Badge (+$10/month) 
                    <Info className="h-4 w-4 inline-block ml-1 text-gray-400" />
                  </span>
                </label>
              </div>
            </div>
          </div>
        );

      case 6:
        return (
          <div className="space-y-6">
            <h3 className="text-xl font-semibold text-gray-900">Location Map</h3>
            
            <div>
              <label className="flex items-center space-x-3 mb-4">
                <input
                  type="checkbox"
                  checked={formData.useExactLocation}
                  onChange={(e) => handleInputChange('useExactLocation', e.target.checked)}
                  className="h-4 w-4 text-purple-600 focus:ring-purple-500 border-gray-300 rounded"
                />
                <span className="text-sm text-gray-700">Use exact location (recommended)</span>
              </label>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Address *</label>
              <input
                type="text"
                value={formData.address}
                onChange={(e) => handleInputChange('address', e.target.value)}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                placeholder="Enter full address"
              />
              {errors.address && <p className="text-red-500 text-sm mt-1">{errors.address}</p>}
            </div>

            <div className="bg-gray-100 rounded-lg p-8 text-center">
              <MapPin className="h-12 w-12 text-gray-400 mx-auto mb-4" />
              <p className="text-gray-600">Interactive map will appear here</p>
              <p className="text-sm text-gray-500 mt-2">Users can pin their exact location</p>
            </div>

            <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
              <p className="text-sm text-blue-800">
                <Info className="h-4 w-4 inline-block mr-1" />
                Location helps buyers find your advert easily. You can choose to show exact or approximate location.
              </p>
            </div>
          </div>
        );

      case 7:
        return (
          <div className="space-y-6">
            <h3 className="text-xl font-semibold text-gray-900">Premium Upsale Options</h3>
            
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {promotionTiers.map((tier) => {
                const Icon = tier.icon;
                return (
                  <div
                    key={tier.id}
                    onClick={() => handleInputChange('promotionTier', tier.id)}
                    className={`relative border-2 rounded-xl p-6 cursor-pointer transition-all ${
                      formData.promotionTier === tier.id
                        ? 'border-purple-500 bg-purple-50'
                        : 'border-gray-200 hover:border-gray-300'
                    }`}
                  >
                    {tier.popular && (
                      <div className="absolute -top-3 left-1/2 transform -translate-x-1/2">
                        <span className="bg-purple-500 text-white px-3 py-1 rounded-full text-xs font-semibold">
                          Most Popular
                        </span>
                      </div>
                    )}
                    
                    <div className={`h-12 w-12 bg-gradient-to-br ${tier.color} rounded-lg flex items-center justify-center mb-4`}>
                      <Icon className="h-6 w-6 text-white" />
                    </div>
                    
                    <h4 className="font-semibold text-gray-900 mb-2">{tier.name}</h4>
                    <div className="text-2xl font-bold text-gray-900 mb-2">
                      {tier.price}
                      <span className="text-sm font-normal text-gray-500">/{tier.period}</span>
                    </div>
                    <p className="text-sm text-gray-600 mb-4">{tier.description}</p>
                    
                    <ul className="space-y-2">
                      {tier.features.map((feature, index) => (
                        <li key={index} className="flex items-start">
                          <Check className="h-4 w-4 text-green-500 mr-2 mt-0.5 flex-shrink-0" />
                          <span className="text-sm text-gray-700">{feature}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                );
              })}
            </div>
            
            {errors.promotionTier && (
              <p className="text-red-500 text-sm flex items-center">
                <AlertCircle className="h-4 w-4 mr-1" />
                {errors.promotionTier}
              </p>
            )}

            <div className="bg-gradient-to-r from-purple-50 to-blue-50 border border-purple-200 rounded-lg p-6">
              <h4 className="font-semibold text-gray-900 mb-4 flex items-center">
                <Target className="h-5 w-5 mr-2 text-purple-600" />
                Promotion Benefits
              </h4>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="flex items-center">
                  <TrendingUp className="h-5 w-5 text-green-500 mr-2" />
                  <span className="text-sm text-gray-700">Increased visibility and reach</span>
                </div>
                <div className="flex items-center">
                  <Award className="h-5 w-5 text-yellow-500 mr-2" />
                  <span className="text-sm text-gray-700">Premium badge and placement</span>
                </div>
                <div className="flex items-center">
                  <Users className="h-5 w-5 text-blue-500 mr-2" />
                  <span className="text-sm text-gray-700">More qualified leads</span>
                </div>
                <div className="flex items-center">
                  <BarChart3 className="h-5 w-5 text-purple-500 mr-2" />
                  <span className="text-sm text-gray-700">Advanced analytics</span>
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
    <div className="fixed inset-0 bg-black bg-opacity-50 z-50 overflow-y-auto">
      <div className="min-h-screen px-4 py-8 flex items-center justify-center">
        <div className="bg-white rounded-2xl shadow-2xl w-full max-w-4xl max-h-[90vh] overflow-y-auto">
          {/* Header */}
          <div className="sticky top-0 bg-white border-b border-gray-200 px-6 py-4 z-10">
            <div className="flex items-center justify-between">
              <h2 className="text-2xl font-bold text-gray-900">Post Featured Advert</h2>
              <button
                onClick={onClose}
                className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
              >
                <X className="h-5 w-5 text-gray-500" />
              </button>
            </div>
            
            {/* Progress Bar */}
            <div className="mt-4">
              <div className="flex items-center justify-between mb-2">
                <span className="text-sm text-gray-600">Step {currentStep} of 7</span>
                <span className="text-sm font-medium text-purple-600">{getStepTitle()}</span>
              </div>
              <div className="w-full bg-gray-200 rounded-full h-2">
                <div
                  className="bg-gradient-to-r from-purple-500 to-blue-500 h-2 rounded-full transition-all duration-300"
                  style={{ width: `${(currentStep / 7) * 100}%` }}
                />
              </div>
            </div>
          </div>

          {/* Content */}
          <div className="px-6 py-8">
            {renderStepContent()}
          </div>

          {/* Footer */}
          <div className="sticky bottom-0 bg-white border-t border-gray-200 px-6 py-4">
            <div className="flex items-center justify-between">
              <button
                onClick={handleBack}
                disabled={currentStep === 1}
                className={`flex items-center space-x-2 px-6 py-2 rounded-lg transition-colors ${
                  currentStep === 1
                    ? 'bg-gray-100 text-gray-400 cursor-not-allowed'
                    : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
                }`}
              >
                <ChevronLeft className="h-4 w-4" />
                <span>Back</span>
              </button>

              {currentStep === 7 ? (
                <div className="flex items-center space-x-4">
                  <div className="text-right">
                    <p className="text-sm text-gray-600">Total Cost</p>
                    <p className="text-xl font-bold text-purple-600">
                      {promotionTiers.find(t => t.id === formData.promotionTier)?.price || '$0'}/month
                    </p>
                  </div>
                  <button
                    onClick={handleSubmit}
                    disabled={isSubmitting}
                    className="flex items-center space-x-2 px-8 py-3 bg-gradient-to-r from-purple-500 to-blue-500 text-white font-semibold rounded-lg hover:from-purple-600 hover:to-blue-600 transition-all disabled:opacity-50"
                  >
                    {isSubmitting ? (
                      <>
                        <div className="h-4 w-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                        <span>Submitting...</span>
                      </>
                    ) : (
                      <>
                        <CheckSquare className="h-4 w-4" />
                        <span>Submit Advert</span>
                      </>
                    )}
                  </button>
                </div>
              ) : (
                <button
                  onClick={handleNext}
                  className="flex items-center space-x-2 px-6 py-2 bg-gradient-to-r from-purple-500 to-blue-500 text-white font-semibold rounded-lg hover:from-purple-600 hover:to-blue-600 transition-all"
                >
                  <span>Next</span>
                  <ChevronRight className="h-4 w-4" />
                </button>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default FeaturedPostForm;
