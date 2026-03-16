import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  X, 
  ArrowLeft, 
  ArrowRight, 
  Check, 
  Upload, 
  Camera, 
  Video, 
  MapPin, 
  Home, 
  Building, 
  Factory, 
  Trees, 
  Hotel, 
  Store, 
  Briefcase, 
  Star, 
  TrendingUp, 
  Calendar, 
  DollarSign, 
  BedDouble, 
  Bath, 
  Square, 
  Car, 
  Wifi, 
  Shield, 
  User, 
  Phone, 
  Mail, 
  Globe, 
  FileText, 
  Eye,
  Heart,
  Award,
  Zap,
  Crown,
  Gem,
  Rocket
} from 'lucide-react';

// Custom Hooks
import { usePropertySubmission, usePropertyData } from '../../hooks/useProperties';
import propertyApi from '../../services/propertyApi';

const PropertyPostForm = ({ onClose, onSubmit }) => {
  const [currentStep, setCurrentStep] = useState(1);
  const [errors, setErrors] = useState({});
  const [uploadProgress, setUploadProgress] = useState({});
  
  // API hooks
  const { categories, propertyTypes, commercialTypes, landTypes, planningPermissions, viewTypes } = usePropertyData();
  const { submitProperty, loading, error, success } = usePropertySubmission();
  const [formData, setFormData] = useState({
    // Step 1: Property Type
    propertyType: '',
    
    // Step 2: Basic Information
    title: '',
    tagline: '',
    category: 'buy',
    country: '',
    city: '',
    address: '',
    coverImage: null,
    additionalImages: [],
    videoTour: '',
    
    // Step 3: Specifications (dynamic based on type)
    specifications: {
      bedrooms: '',
      bathrooms: '',
      size: '',
      furnished: false,
      parking: false,
      // Commercial specific
      floorArea: '',
      footfall: '',
      accessibility: false,
      // Industrial specific
      zoning: '',
      warehouseSize: '',
      loadingBays: '',
      powerCapacity: '',
      ceilingHeight: '',
      // Land specific
      landSize: '',
      landType: '',
      planningPermission: false,
      soilQuality: '',
      // Luxury specific
      premiumFeatures: [],
      security: '',
      viewType: ''
    },
    
    // Step 4: Pricing
    price: '',
    currency: 'USD',
    negotiable: false,
    deposit: '',
    serviceCharges: '',
    maintenanceFees: '',
    investmentYield: '',
    
    // Step 5: Seller Information
    sellerName: '',
    companyName: '',
    phone: '',
    email: '',
    website: '',
    logo: null,
    verifiedAgent: false,
    
    // Step 6: Description
    description: {
      overview: '',
      keyFeatures: '',
      locationHighlights: '',
      nearbyAmenities: '',
      transportLinks: '',
      additionalNotes: ''
    },
    
    // Step 7: Location
    location: {
      coordinates: null,
      exactLocation: false,
      privacyMode: false
    },
    
    // Step 8: Premium Upsell
    promotionTier: 'basic',
    
    // Step 9: Final
    termsAccepted: false,
    accuracyConfirmed: false
  });

  const promotionTiers = [
    {
      id: 'basic',
      name: 'Basic Listing',
      price: 'Free',
      icon: Home,
      features: [
        'Standard visibility',
        'Basic listing details',
        '30 days active',
        'Standard support'
      ],
      color: 'gray'
    },
    {
      id: 'promoted',
      name: 'Promoted Listing',
      price: '$29',
      icon: Eye,
      features: [
        'Enhanced visibility',
        'Promoted badge',
        'Highlighted card',
        '60 days active',
        'Priority support'
      ],
      color: 'blue',
      popular: false
    },
    {
      id: 'featured',
      name: 'Featured Listing',
      price: '$79',
      icon: Star,
      features: [
        'Premium placement',
        'Featured badge',
        'Larger display card',
        '90 days active',
        'Top of category',
        'Weekly email feature',
        'Dedicated support'
      ],
      color: 'purple',
      popular: true
    },
    {
      id: 'sponsored',
      name: 'Sponsored Listing',
      price: '$199',
      icon: Crown,
      features: [
        'Maximum visibility',
        'Sponsored badge',
        'Homepage placement',
        'Category top placement',
        'Homepage slider',
        'Social media promotion',
        '180 days active',
        'VIP support',
        'Performance analytics'
      ],
      color: 'gold',
      popular: false
    }
  ];

  const steps = [
    { id: 1, title: 'Property Type', icon: Building },
    { id: 2, title: 'Basic Info', icon: FileText },
    { id: 3, title: 'Specifications', icon: Square },
    { id: 4, title: 'Pricing', icon: DollarSign },
    { id: 5, title: 'Seller Info', icon: User },
    { id: 6, title: 'Description', icon: FileText },
    { id: 7, title: 'Location', icon: MapPin },
    { id: 8, title: 'Promotion', icon: Star },
    { id: 9, title: 'Final Step', icon: Check }
  ];

  const handleNext = () => {
    if (currentStep < 9) {
      setCurrentStep(currentStep + 1);
    }
  };

  const handlePrevious = () => {
    if (currentStep > 1) {
      setCurrentStep(currentStep - 1);
    }
  };

  const handleSubmit = async () => {
  try {
    // Prepare data for API submission
    const submissionData = new FormData();
    
    // Basic property information
    submissionData.append('property_type', formData.propertyType);
    submissionData.append('category', formData.category);
    submissionData.append('title', formData.title);
    submissionData.append('tagline', formData.tagline);
    submissionData.append('country', formData.country);
    submissionData.append('city', formData.city);
    submissionData.append('address', formData.address);
    submissionData.append('video_tour_link', formData.videoTour);
    
    // Pricing
    submissionData.append('price', formData.price);
    submissionData.append('currency', formData.currency);
    submissionData.append('negotiable', formData.negotiable ? '1' : '0');
    submissionData.append('deposit', formData.deposit);
    submissionData.append('service_charges', formData.serviceCharges);
    submissionData.append('maintenance_fees', formData.maintenanceFees);
    
    // Seller information
    submissionData.append('seller_name', formData.sellerName);
    submissionData.append('seller_company', formData.companyName);
    submissionData.append('seller_phone', formData.phone);
    submissionData.append('seller_email', formData.email);
    submissionData.append('seller_website', formData.website);
    submissionData.append('verified_agent', formData.verifiedAgent ? '1' : '0');
    
    // Description
    submissionData.append('description', formData.description.overview);
    submissionData.append('features', formData.description.keyFeatures);
    submissionData.append('location_highlights', formData.description.locationHighlights);
    submissionData.append('transport_links', formData.description.transportLinks);
    
    // Location
    submissionData.append('exact_location', formData.location.exactLocation ? '1' : '0');
    if (formData.location.coordinates) {
      submissionData.append('latitude', formData.location.coordinates.lat);
      submissionData.append('longitude', formData.location.coordinates.lng);
    }
    
    // Premium options
    submissionData.append('advert_type', formData.promotionTier);
    
    // Specifications (dynamic based on property type)
    Object.entries(formData.specifications).forEach(([key, value]) => {
      if (value !== null && value !== undefined && value !== '') {
        submissionData.append(key, value);
      }
    });
    
    // Files
    if (formData.coverImage) {
      submissionData.append('cover_image', formData.coverImage);
    }
    
    if (formData.additionalImages && formData.additionalImages.length > 0) {
      formData.additionalImages.forEach((image, index) => {
        submissionData.append(`additional_images[${index}]`, image);
      });
    }
    
    if (formData.logo) {
      submissionData.append('seller_logo', formData.logo);
    }
    
    // Submit to API
    const result = await submitProperty(submissionData);
    onSubmit(result);
    
  } catch (err) {
    console.error('Submission error:', err);
    // Error is already handled by the hook
  }
};

  const renderStep = () => {
    switch (currentStep) {
      case 1:
        return (
          <div>
            <h3 className="text-xl font-semibold text-gray-900 mb-6">Select Property Type</h3>
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
              {propertyTypes.map((type) => (
                <button
                  key={type.id}
                  onClick={() => setFormData(prev => ({ ...prev, propertyType: type.id }))}
                  className={`p-4 rounded-xl border-2 transition-all ${
                    formData.propertyType === type.id
                      ? 'border-blue-500 bg-blue-50'
                      : 'border-gray-200 hover:border-gray-300'
                  }`}
                >
                  <type.icon className="w-8 h-8 text-blue-600 mb-3" />
                  <h4 className="font-semibold text-gray-900 mb-1">{type.name}</h4>
                  <p className="text-sm text-gray-600">{type.description}</p>
                </button>
              ))}
            </div>
          </div>
        );

      case 2:
        return (
          <div>
            <h3 className="text-xl font-semibold text-gray-900 mb-6">Basic Property Information</h3>
            <div className="space-y-6">
              <div className="grid md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Property Title</label>
                  <input
                    type="text"
                    value={formData.title}
                    onChange={(e) => setFormData(prev => ({ ...prev, title: e.target.value }))}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                    placeholder="e.g., Modern 3BR Apartment in Downtown"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Tagline</label>
                  <input
                    type="text"
                    value={formData.tagline}
                    onChange={(e) => setFormData(prev => ({ ...prev, tagline: e.target.value }))}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                    placeholder="e.g., Perfect for families"
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Category</label>
                <div className="grid grid-cols-4 gap-2">
                  {categories.map((category) => (
                    <button
                      key={category.id}
                      onClick={() => setFormData(prev => ({ ...prev, category: category.id }))}
                      className={`px-4 py-2 rounded-lg font-medium transition-colors ${
                        formData.category === category.id
                          ? `bg-${category.color}-500 text-white`
                          : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                      }`}
                    >
                      {category.name || category.label}
                    </button>
                  ))}
                </div>
              </div>

              <div className="grid md:grid-cols-3 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Country</label>
                  <select
                    value={formData.country}
                    onChange={(e) => setFormData(prev => ({ ...prev, country: e.target.value }))}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                  >
                    <option value="">Select Country</option>
                    <option value="US">United States</option>
                    <option value="UK">United Kingdom</option>
                    <option value="UAE">United Arab Emirates</option>
                    <option value="SG">Singapore</option>
                    <option value="AU">Australia</option>
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">City</label>
                  <input
                    type="text"
                    value={formData.city}
                    onChange={(e) => setFormData(prev => ({ ...prev, city: e.target.value }))}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                    placeholder="City"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Address (Optional)</label>
                  <input
                    type="text"
                    value={formData.address}
                    onChange={(e) => setFormData(prev => ({ ...prev, address: e.target.value }))}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                    placeholder="Full address"
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Cover Image</label>
                <div className="border-2 border-dashed border-gray-300 rounded-lg p-6 text-center">
                  <Camera className="w-12 h-12 text-gray-400 mx-auto mb-3" />
                  <p className="text-sm text-gray-600 mb-2">Click to upload or drag and drop</p>
                  <p className="text-xs text-gray-500">PNG, JPG up to 10MB</p>
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Video Tour Link (Optional)</label>
                <input
                  type="url"
                  value={formData.videoTour}
                  onChange={(e) => setFormData(prev => ({ ...prev, videoTour: e.target.value }))}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                  placeholder="YouTube or Vimeo link"
                />
              </div>
            </div>
          </div>
        );

      case 3:
        return (
          <div>
            <h3 className="text-xl font-semibold text-gray-900 mb-6">Property Specifications</h3>
            <div className="space-y-6">
              {/* Common specifications */}
              <div className="grid md:grid-cols-3 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    <BedDouble className="w-4 h-4 inline mr-1" />
                    Bedrooms
                  </label>
                  <input
                    type="number"
                    value={formData.specifications.bedrooms}
                    onChange={(e) => setFormData(prev => ({
                      ...prev,
                      specifications: { ...prev.specifications, bedrooms: e.target.value }
                    }))}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                    placeholder="Number of bedrooms"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    <Bath className="w-4 h-4 inline mr-1" />
                    Bathrooms
                  </label>
                  <input
                    type="number"
                    value={formData.specifications.bathrooms}
                    onChange={(e) => setFormData(prev => ({
                      ...prev,
                      specifications: { ...prev.specifications, bathrooms: e.target.value }
                    }))}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                    placeholder="Number of bathrooms"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    <Square className="w-4 h-4 inline mr-1" />
                    Size (sq ft)
                  </label>
                  <input
                    type="number"
                    value={formData.specifications.size}
                    onChange={(e) => setFormData(prev => ({
                      ...prev,
                      specifications: { ...prev.specifications, size: e.target.value }
                    }))}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                    placeholder="Property size"
                  />
                </div>
              </div>

              {/* Dynamic specifications based on property type */}
              {formData.propertyType === 'residential' && (
                <div className="grid md:grid-cols-2 gap-4">
                  <label className="flex items-center gap-3 p-4 border border-gray-200 rounded-lg">
                    <input
                      type="checkbox"
                      checked={formData.specifications.furnished}
                      onChange={(e) => setFormData(prev => ({
                        ...prev,
                        specifications: { ...prev.specifications, furnished: e.target.checked }
                      }))}
                      className="w-4 h-4 text-blue-600"
                    />
                    <span className="text-sm font-medium text-gray-700">Furnished</span>
                  </label>
                  <label className="flex items-center gap-3 p-4 border border-gray-200 rounded-lg">
                    <input
                      type="checkbox"
                      checked={formData.specifications.parking}
                      onChange={(e) => setFormData(prev => ({
                        ...prev,
                        specifications: { ...prev.specifications, parking: e.target.checked }
                      }))}
                      className="w-4 h-4 text-blue-600"
                    />
                    <span className="text-sm font-medium text-gray-700">Parking Available</span>
                  </label>
                </div>
              )}

              {formData.propertyType === 'commercial' && (
                <div className="grid md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Floor Area (sq ft)</label>
                    <input
                      type="number"
                      value={formData.specifications.floorArea}
                      onChange={(e) => setFormData(prev => ({
                        ...prev,
                        specifications: { ...prev.specifications, floorArea: e.target.value }
                      }))}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Footfall Rating</label>
                    <select
                      value={formData.specifications.footfall}
                      onChange={(e) => setFormData(prev => ({
                        ...prev,
                        specifications: { ...prev.specifications, footfall: e.target.value }
                      }))}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                    >
                      <option value="">Select footfall</option>
                      <option value="low">Low</option>
                      <option value="medium">Medium</option>
                      <option value="high">High</option>
                      <option value="premium">Premium</option>
                    </select>
                  </div>
                </div>
              )}

              {formData.propertyType === 'land' && (
                <div className="grid md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Land Size (acres)</label>
                    <input
                      type="number"
                      value={formData.specifications.landSize}
                      onChange={(e) => setFormData(prev => ({
                        ...prev,
                        specifications: { ...prev.specifications, landSize: e.target.value }
                      }))}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Land Type</label>
                    <select
                      value={formData.specifications.landType}
                      onChange={(e) => setFormData(prev => ({
                        ...prev,
                        specifications: { ...prev.specifications, landType: e.target.value }
                      }))}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                    >
                      <option value="">Select type</option>
                      <option value="residential">Residential</option>
                      <option value="commercial">Commercial</option>
                      <option value="agricultural">Agricultural</option>
                      <option value="industrial">Industrial</option>
                    </select>
                  </div>
                </div>
              )}
            </div>
          </div>
        );

      case 4:
        return (
          <div>
            <h3 className="text-xl font-semibold text-gray-900 mb-6">Pricing & Financial Details</h3>
            <div className="space-y-6">
              <div className="grid md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Price</label>
                  <div className="flex gap-2">
                    <select
                      value={formData.currency}
                      onChange={(e) => setFormData(prev => ({ ...prev, currency: e.target.value }))}
                      className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                    >
                      <option value="USD">USD</option>
                      <option value="EUR">EUR</option>
                      <option value="GBP">GBP</option>
                      <option value="AED">AED</option>
                    </select>
                    <input
                      type="number"
                      value={formData.price}
                      onChange={(e) => setFormData(prev => ({ ...prev, price: e.target.value }))}
                      className="flex-1 px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                      placeholder="0.00"
                    />
                  </div>
                </div>
                <div className="flex items-center gap-3 p-4 border border-gray-200 rounded-lg">
                  <input
                    type="checkbox"
                    checked={formData.negotiable}
                    onChange={(e) => setFormData(prev => ({ ...prev, negotiable: e.target.checked }))}
                    className="w-4 h-4 text-blue-600"
                  />
                  <span className="text-sm font-medium text-gray-700">Price is negotiable</span>
                </div>
              </div>

              <div className="grid md:grid-cols-3 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Deposit (if applicable)</label>
                  <input
                    type="number"
                    value={formData.deposit}
                    onChange={(e) => setFormData(prev => ({ ...prev, deposit: e.target.value }))}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                    placeholder="0.00"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Service Charges</label>
                  <input
                    type="number"
                    value={formData.serviceCharges}
                    onChange={(e) => setFormData(prev => ({ ...prev, serviceCharges: e.target.value }))}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                    placeholder="0.00"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Maintenance Fees</label>
                  <input
                    type="number"
                    value={formData.maintenanceFees}
                    onChange={(e) => setFormData(prev => ({ ...prev, maintenanceFees: e.target.value }))}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                    placeholder="0.00"
                  />
                </div>
              </div>

              {formData.category === 'invest' && (
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Investment Yield (%)</label>
                  <input
                    type="number"
                    value={formData.investmentYield}
                    onChange={(e) => setFormData(prev => ({ ...prev, investmentYield: e.target.value }))}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                    placeholder="e.g., 8.5"
                  />
                </div>
              )}
            </div>
          </div>
        );

      case 5:
        return (
          <div>
            <h3 className="text-xl font-semibold text-gray-900 mb-6">Seller / Agent Information</h3>
            <div className="space-y-6">
              <div className="grid md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Your Name</label>
                  <input
                    type="text"
                    value={formData.sellerName}
                    onChange={(e) => setFormData(prev => ({ ...prev, sellerName: e.target.value }))}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                    placeholder="John Doe"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Company Name (Optional)</label>
                  <input
                    type="text"
                    value={formData.companyName}
                    onChange={(e) => setFormData(prev => ({ ...prev, companyName: e.target.value }))}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                    placeholder="Real Estate Co."
                  />
                </div>
              </div>

              <div className="grid md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Phone Number</label>
                  <input
                    type="tel"
                    value={formData.phone}
                    onChange={(e) => setFormData(prev => ({ ...prev, phone: e.target.value }))}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                    placeholder="+1 234 567 8900"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Email Address</label>
                  <input
                    type="email"
                    value={formData.email}
                    onChange={(e) => setFormData(prev => ({ ...prev, email: e.target.value }))}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                    placeholder="john@example.com"
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Website (Optional)</label>
                <input
                  type="url"
                  value={formData.website}
                  onChange={(e) => setFormData(prev => ({ ...prev, website: e.target.value }))}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                  placeholder="https://yourwebsite.com"
                />
              </div>

              <div className="flex items-center gap-3 p-4 border border-gray-200 rounded-lg">
                <input
                  type="checkbox"
                  checked={formData.verifiedAgent}
                  onChange={(e) => setFormData(prev => ({ ...prev, verifiedAgent: e.target.checked }))}
                  className="w-4 h-4 text-blue-600"
                />
                <div>
                  <span className="text-sm font-medium text-gray-700">Get Verified Agent Badge</span>
                  <p className="text-xs text-gray-500">Increase trust and visibility with verification</p>
                </div>
              </div>
            </div>
          </div>
        );

      case 6:
        return (
          <div>
            <h3 className="text-xl font-semibold text-gray-900 mb-6">Property Description</h3>
            <div className="space-y-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Overview</label>
                <textarea
                  value={formData.description.overview}
                  onChange={(e) => setFormData(prev => ({
                    ...prev,
                    description: { ...prev.description, overview: e.target.value }
                  }))}
                  rows={4}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                  placeholder="Provide a general overview of the property..."
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Key Features</label>
                <textarea
                  value={formData.description.keyFeatures}
                  onChange={(e) => setFormData(prev => ({
                    ...prev,
                    description: { ...prev.description, keyFeatures: e.target.value }
                  }))}
                  rows={3}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                  placeholder="List the main features and highlights..."
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Location Highlights</label>
                <textarea
                  value={formData.description.locationHighlights}
                  onChange={(e) => setFormData(prev => ({
                    ...prev,
                    description: { ...prev.description, locationHighlights: e.target.value }
                  }))}
                  rows={3}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                  placeholder="Describe the neighborhood and location benefits..."
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Nearby Amenities</label>
                <textarea
                  value={formData.description.nearbyAmenities}
                  onChange={(e) => setFormData(prev => ({
                    ...prev,
                    description: { ...prev.description, nearbyAmenities: e.target.value }
                  }))}
                  rows={3}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                  placeholder="Schools, hospitals, shopping centers, etc..."
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Transport Links</label>
                <textarea
                  value={formData.description.transportLinks}
                  onChange={(e) => setFormData(prev => ({
                    ...prev,
                    description: { ...prev.description, transportLinks: e.target.value }
                  }))}
                  rows={2}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                  placeholder="Nearby public transport, highways, airports..."
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Additional Notes</label>
                <textarea
                  value={formData.description.additionalNotes}
                  onChange={(e) => setFormData(prev => ({
                    ...prev,
                    description: { ...prev.description, additionalNotes: e.target.value }
                  }))}
                  rows={2}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                  placeholder="Any other important information..."
                />
              </div>
            </div>
          </div>
        );

      case 7:
        return (
          <div>
            <h3 className="text-xl font-semibold text-gray-900 mb-6">Location Map Integration</h3>
            <div className="space-y-6">
              <div className="bg-gray-100 rounded-lg p-8 text-center">
                <MapPin className="w-12 h-12 text-gray-400 mx-auto mb-3" />
                <p className="text-gray-600 mb-2">Interactive map will be displayed here</p>
                <p className="text-sm text-gray-500">Click to place the property pin on the map</p>
              </div>

              <div className="space-y-4">
                <div className="flex items-center gap-3 p-4 border border-gray-200 rounded-lg">
                  <input
                    type="checkbox"
                    checked={formData.location.exactLocation}
                    onChange={(e) => setFormData(prev => ({
                      ...prev,
                      location: { ...prev.location, exactLocation: e.target.checked }
                    }))}
                    className="w-4 h-4 text-blue-600"
                  />
                  <div>
                    <span className="text-sm font-medium text-gray-700">Show Exact Location</span>
                    <p className="text-xs text-gray-500">Display precise property location on map</p>
                  </div>
                </div>

                <div className="flex items-center gap-3 p-4 border border-gray-200 rounded-lg">
                  <input
                    type="checkbox"
                    checked={formData.location.privacyMode}
                    onChange={(e) => setFormData(prev => ({
                      ...prev,
                      location: { ...prev.location, privacyMode: e.target.checked }
                    }))}
                    className="w-4 h-4 text-blue-600"
                  />
                  <div>
                    <span className="text-sm font-medium text-gray-700">Privacy Mode</span>
                    <p className="text-xs text-gray-500">Show approximate location only</p>
                  </div>
                </div>
              </div>

              <div className="grid md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Latitude</label>
                  <input
                    type="number"
                    step="any"
                    value={formData.location.coordinates?.lat || ''}
                    onChange={(e) => setFormData(prev => ({
                      ...prev,
                      location: {
                        ...prev.location,
                        coordinates: {
                          ...prev.location.coordinates,
                          lat: parseFloat(e.target.value)
                        }
                      }
                    }))}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                    placeholder="40.7128"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Longitude</label>
                  <input
                    type="number"
                    step="any"
                    value={formData.location.coordinates?.lng || ''}
                    onChange={(e) => setFormData(prev => ({
                      ...prev,
                      location: {
                        ...prev.location,
                        coordinates: {
                          ...prev.location.coordinates,
                          lng: parseFloat(e.target.value)
                        }
                      }
                    }))}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                    placeholder="-74.0060"
                  />
                </div>
              </div>
            </div>
          </div>
        );

      case 8:
        return (
          <div>
            <h3 className="text-xl font-semibold text-gray-900 mb-6">Premium Upsell Options</h3>
            <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
              {promotionTiers.map((tier) => (
                <div
                  key={tier.id}
                  className={`relative bg-white rounded-xl border-2 p-4 cursor-pointer transition-all ${
                    formData.promotionTier === tier.id
                      ? 'border-blue-500 shadow-lg'
                      : 'border-gray-200 hover:border-gray-300'
                  }`}
                  onClick={() => setFormData(prev => ({ ...prev, promotionTier: tier.id }))}
                >
                  {tier.popular && (
                    <div className="absolute -top-3 left-1/2 transform -translate-x-1/2">
                      <span className="bg-blue-600 text-white text-xs px-3 py-1 rounded-full">
                        Most Popular
                      </span>
                    </div>
                  )}

                  <div className="text-center mb-4">
                    <tier.icon className={`w-8 h-8 text-${tier.color}-600 mx-auto mb-2`} />
                    <h4 className="font-semibold text-gray-900">{tier.name}</h4>
                    <div className="text-2xl font-bold text-gray-900 mt-1">{tier.price}</div>
                  </div>

                  <div className="space-y-2">
                    {tier.features.map((feature, index) => (
                      <div key={index} className="flex items-center gap-2">
                        <Check className="w-4 h-4 text-green-500 flex-shrink-0" />
                        <span className="text-xs text-gray-600">{feature}</span>
                      </div>
                    ))}
                  </div>
                </div>
              ))}
            </div>

            <div className="bg-blue-50 rounded-lg p-4">
              <h4 className="font-semibold text-gray-900 mb-2">Visibility Comparison</h4>
              <div className="grid grid-cols-4 gap-4 text-center">
                <div>
                  <div className="text-2xl font-bold text-gray-900">1x</div>
                  <div className="text-xs text-gray-600">Basic</div>
                </div>
                <div>
                  <div className="text-2xl font-bold text-blue-600">3x</div>
                  <div className="text-xs text-gray-600">Promoted</div>
                </div>
                <div>
                  <div className="text-2xl font-bold text-purple-600">5x</div>
                  <div className="text-xs text-gray-600">Featured</div>
                </div>
                <div>
                  <div className="text-2xl font-bold text-yellow-600">10x</div>
                  <div className="text-xs text-gray-600">Sponsored</div>
                </div>
              </div>
            </div>
          </div>
        );

      case 9:
        return (
          <div>
            <h3 className="text-xl font-semibold text-gray-900 mb-6">Final Submission</h3>
            <div className="space-y-6">
              <div className="bg-gray-50 rounded-lg p-6">
                <h4 className="font-semibold text-gray-900 mb-4">Property Summary</h4>
                <div className="grid md:grid-cols-2 gap-4 text-sm">
                  <div>
                    <span className="text-gray-600">Title:</span>
                    <span className="ml-2 font-medium text-gray-900">{formData.title || 'Not provided'}</span>
                  </div>
                  <div>
                    <span className="text-gray-600">Type:</span>
                    <span className="ml-2 font-medium text-gray-900">
                      {propertyTypes.find(t => t.id === formData.propertyType)?.name || 'Not selected'}
                    </span>
                  </div>
                  <div>
                    <span className="text-gray-600">Category:</span>
                    <span className="ml-2 font-medium text-gray-900">
                      {categories.find(c => c.id === formData.category)?.name || categories.find(c => c.id === formData.category)?.label || 'Not selected'}
                    </span>
                  </div>
                  <div>
                    <span className="text-gray-600">Price:</span>
                    <span className="ml-2 font-medium text-gray-900">
                      {formData.price ? `${formData.currency} ${formData.price}` : 'Not set'}
                    </span>
                  </div>
                  <div>
                    <span className="text-gray-600">Location:</span>
                    <span className="ml-2 font-medium text-gray-900">
                      {formData.city && formData.country ? `${formData.city}, ${formData.country}` : 'Not provided'}
                    </span>
                  </div>
                  <div>
                    <span className="text-gray-600">Promotion:</span>
                    <span className="ml-2 font-medium text-gray-900">
                      {promotionTiers.find(t => t.id === formData.promotionTier)?.name || 'Basic'}
                    </span>
                  </div>
                </div>
              </div>

              <div className="space-y-4">
                <label className="flex items-start gap-3 p-4 border border-gray-200 rounded-lg cursor-pointer">
                  <input
                    type="checkbox"
                    checked={formData.termsAccepted}
                    onChange={(e) => setFormData(prev => ({ ...prev, termsAccepted: e.target.checked }))}
                    className="w-4 h-4 text-blue-600 mt-1"
                  />
                  <div>
                    <span className="text-sm font-medium text-gray-700">I agree to the Terms of Service</span>
                    <p className="text-xs text-gray-500 mt-1">
                      By submitting this listing, you agree to our terms and conditions
                    </p>
                  </div>
                </label>

                <label className="flex items-start gap-3 p-4 border border-gray-200 rounded-lg cursor-pointer">
                  <input
                    type="checkbox"
                    checked={formData.accuracyConfirmed}
                    onChange={(e) => setFormData(prev => ({ ...prev, accuracyConfirmed: e.target.checked }))}
                    className="w-4 h-4 text-blue-600 mt-1"
                  />
                  <div>
                    <span className="text-sm font-medium text-gray-700">I confirm the accuracy of this information</span>
                    <p className="text-xs text-gray-500 mt-1">
                      All details provided are accurate to the best of my knowledge
                    </p>
                  </div>
                </label>
              </div>

              {/* Error and Success Messages */}
              {error && (
                <div className="bg-red-50 border border-red-200 rounded-lg p-4">
                  <div className="flex items-center gap-2">
                    <X className="w-5 h-5 text-red-600" />
                    <p className="text-red-600 font-medium">Submission Error</p>
                  </div>
                  <p className="text-red-600 text-sm mt-1">{error}</p>
                </div>
              )}

              {success && (
                <div className="bg-green-50 border border-green-200 rounded-lg p-4">
                  <div className="flex items-center gap-2">
                    <Check className="w-5 h-5 text-green-600" />
                    <p className="text-green-600 font-medium">Property Submitted Successfully!</p>
                  </div>
                  <p className="text-green-600 text-sm mt-1">
                    Your property listing has been submitted and is under review.
                  </p>
                </div>
              )}

              {formData.promotionTier !== 'basic' && (
                <div className="bg-blue-50 rounded-lg p-4">
                  <h4 className="font-semibold text-gray-900 mb-2">Payment Information</h4>
                  <p className="text-sm text-gray-600 mb-3">
                    You will be redirected to secure payment after submission
                  </p>
                  <div className="flex items-center gap-2">
                    <span className="text-lg font-bold text-blue-600">
                      {promotionTiers.find(t => t.id === formData.promotionTier)?.price}
                    </span>
                    <span className="text-sm text-gray-600">one-time fee</span>
                  </div>
                </div>
              )}
            </div>
          </div>
        );

      default:
        return null;
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center p-4"
    >
      <motion.div
        initial={{ scale: 0.95, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        exit={{ scale: 0.95, opacity: 0 }}
        className="bg-white rounded-xl max-w-4xl w-full max-h-[90vh] overflow-hidden"
      >
        {/* Header */}
        <div className="border-b border-gray-200 p-6">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-2xl font-bold text-gray-900">Post Property</h2>
            <button
              onClick={onClose}
              className="p-2 rounded-lg hover:bg-gray-100 transition-colors"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* Progress Bar */}
          <div className="flex items-center justify-between mb-6">
            {steps.map((step, index) => (
              <div key={step.id} className="flex items-center">
                <div
                  className={`w-10 h-10 rounded-full flex items-center justify-center transition-colors ${
                    currentStep >= step.id
                      ? 'bg-blue-600 text-white'
                      : 'bg-gray-200 text-gray-600'
                  }`}
                >
                  <step.icon className="w-5 h-5" />
                </div>
                <span className={`ml-2 text-sm font-medium ${
                  currentStep >= step.id ? 'text-blue-600' : 'text-gray-600'
                }`}>
                  {step.title}
                </span>
                {index < steps.length - 1 && (
                  <div className={`w-8 h-0.5 mx-4 ${
                    currentStep > step.id ? 'bg-blue-600' : 'bg-gray-200'
                  }`} />
                )}
              </div>
            ))}
          </div>
        </div>

        {/* Form Content */}
        <div className="p-6 overflow-y-auto max-h-[calc(90vh-200px)]">
          {renderStep()}
        </div>

        {/* Footer */}
        <div className="border-t border-gray-200 p-6">
          <div className="flex items-center justify-between">
            <button
              onClick={handlePrevious}
              disabled={currentStep === 1}
              className={`flex items-center gap-2 px-4 py-2 rounded-lg transition-colors ${
                currentStep === 1
                  ? 'text-gray-400 cursor-not-allowed'
                  : 'text-gray-700 hover:bg-gray-100'
              }`}
            >
              <ArrowLeft className="w-4 h-4" />
              Previous
            </button>

            {currentStep === 9 ? (
              <button
                onClick={handleSubmit}
                disabled={!formData.termsAccepted || !formData.accuracyConfirmed || loading}
                className={`px-6 py-2 rounded-lg font-medium transition-colors ${
                  formData.termsAccepted && formData.accuracyConfirmed && !loading
                    ? 'bg-blue-600 text-white hover:bg-blue-700'
                    : 'bg-gray-300 text-gray-500 cursor-not-allowed'
                }`}
              >
                {loading ? (
                  <div className="flex items-center gap-2">
                    <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                    Submitting...
                  </div>
                ) : (
                  'Submit Listing'
                )}
              </button>
            ) : (
              <button
                onClick={handleNext}
                className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
              >
                Next
                <ArrowRight className="w-4 h-4" />
              </button>
            )}
          </div>
        </div>
      </motion.div>
    </motion.div>
  );
};

export default PropertyPostForm;
