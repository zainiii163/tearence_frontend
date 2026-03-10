import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  X, 
  ArrowLeft, 
  ArrowRight, 
  Check, 
  Star, 
  MapPin, 
  Calendar, 
  Users, 
  Hotel, 
  Car, 
  Camera, 
  Upload,
  DollarSign,
  Globe,
  Phone,
  Mail,
  FileText,
  CreditCard,
  Shield,
  Zap,
  Crown,
  Rocket
} from 'lucide-react';

// API Service
import resortsTravelApi from '../../services/resortsTravelAPI';

const TravelPostForm = ({ onClose }) => {
  const [currentStep, setCurrentStep] = useState(1);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [realData, setRealData] = useState({
    advertTypes: [],
    categories: [],
    amenities: [],
    promotionTiers: []
  });
  
  const [formData, setFormData] = useState({
    // Step 1: Advert Type
    advertType: '', // accommodation, transport, experience
    accommodationType: '', // hotel, resort, apartment, villa, etc.
    transportType: '', // car, bus, boat, plane, etc.
    experienceType: '', // tour, activity, workshop, etc.
    
    // Step 2: Basic Information
    title: '',
    tagline: '',
    category: '', // category_id
    location: '',
    country: '',
    city: '',
    address: '',
    latitude: '',
    longitude: '',
    isApproximateLocation: false,
    
    // Step 3: Pricing
    pricePerNight: '',
    pricePerTrip: '',
    pricePerService: '',
    currency: 'USD',
    additionalFees: [],
    
    // Step 4: Availability
    availabilityStart: '',
    availabilityEnd: '',
    
    // Step 5: Media Upload
    mainImage: null,
    additionalImages: [],
    videoLink: '',
    
    // Step 6: Accommodation Details (if accommodation)
    roomTypes: [],
    amenities: [],
    guestCapacity: '',
    bedrooms: '',
    bathrooms: '',
    size: '',
    
    // Step 7: Transport Details (if transport)
    vehicleType: '',
    passengerCapacity: '',
    luggageCapacity: '',
    serviceArea: '',
    operatingHours: '',
    airportPickup: false,
    
    // Step 8: Experience Details (if experience)
    duration: '',
    groupSize: '',
    whatsIncluded: [],
    whatToBring: [],
    
    // Step 9: Description
    description: '',
    overview: '',
    keyFeatures: [],
    whyTravelersLoveThis: '',
    nearbyAttractions: [],
    additionalNotes: '',
    
    // Step 10: Contact Information
    contactName: '',
    businessName: '',
    phoneNumber: '',
    email: '',
    website: '',
    socialLinks: {
      facebook: '',
      instagram: '',
      twitter: '',
      linkedin: ''
    },
    logo: null,
    verifiedBusiness: false,
    
    // Step 11: Premium Promotion
    promotionTier: 'basic', // basic, promoted, featured, sponsored
  });

  // Load real data from API on component mount
  useEffect(() => {
    loadRealData();
  }, []);

  const loadRealData = async () => {
    setLoading(true);
    setError(null);
    try {
      // Fetch advert types
      const advertTypesResponse = await resortsTravelApi.getAdvertTypes();
      
      // Fetch categories
      const categoriesResponse = await resortsTravelApi.getCategories();
      
      // Fetch amenities
      const amenitiesResponse = await resortsTravelApi.getAmenities();
      
      // Fetch promotion tiers
      const promotionTiersResponse = await resortsTravelApi.getPromotionTiers();
      
      setRealData({
        advertTypes: advertTypesResponse.data || [],
        categories: categoriesResponse.data || [],
        amenities: amenitiesResponse.data || [],
        promotionTiers: promotionTiersResponse.data || []
      });
    } catch (err) {
      setError(err.message || 'Failed to load form data');
      console.error('Error loading real data:', err);
    } finally {
      setLoading(false);
    }
  };

  const totalSteps = 11;

  const steps = [
    {
      id: 1,
      title: 'Advert Type',
      description: 'Choose what type of travel service you\'re offering',
      icon: <Hotel className="w-5 h-5" />
    },
    {
      id: 2,
      title: 'Basic Information',
      description: 'Add the essential details about your listing',
      icon: <FileText className="w-5 h-5" />
    },
    {
      id: 3,
      title: 'Pricing',
      description: 'Set your pricing and currency',
      icon: <DollarSign className="w-5 h-5" />
    },
    {
      id: 4,
      title: 'Availability',
      description: 'Set your availability dates',
      icon: <Calendar className="w-5 h-5" />
    },
    {
      id: 5,
      title: 'Media Upload',
      description: 'Upload photos and videos to showcase your service',
      icon: <Camera className="w-5 h-5" />
    },
    {
      id: 6,
      title: 'Service Details',
      description: 'Describe amenities, capacity, and features',
      icon: <Star className="w-5 h-5" />
    },
    {
      id: 7,
      title: 'Location Details',
      description: 'Provide location and nearby attractions',
      icon: <MapPin className="w-5 h-5" />
    },
    {
      id: 8,
      title: 'Description',
      description: 'Detailed description and highlights',
      icon: <FileText className="w-5 h-5" />
    },
    {
      id: 9,
      title: 'Contact Information',
      description: 'Add your contact details for bookings',
      icon: <Phone className="w-5 h-5" />
    },
    {
      id: 10,
      title: 'Business Verification',
      description: 'Verify your business for trust',
      icon: <Shield className="w-5 h-5" />
    },
    {
      id: 11,
      title: 'Premium Promotion',
      description: 'Boost your listing visibility',
      icon: <Rocket className="w-5 h-5" />
    }
  ];

  // Remove hardcoded arrays - now using real data from API

  const handleNext = () => {
    if (currentStep < totalSteps) {
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
      // Prepare form data for API submission
      const submissionData = new FormData();
      
      // Basic information
      submissionData.append('advert_type', formData.advertType);
      submissionData.append('title', formData.title);
      submissionData.append('tagline', formData.tagline);
      submissionData.append('category_id', formData.category);
      submissionData.append('country', formData.country);
      submissionData.append('city', formData.city);
      submissionData.append('address', formData.address);
      submissionData.append('latitude', formData.latitude);
      submissionData.append('longitude', formData.longitude);
      submissionData.append('is_approximate_location', formData.isApproximateLocation ? '1' : '0');
      
      // Type-specific fields
      if (formData.advertType === 'accommodation') {
        submissionData.append('accommodation_type', formData.accommodationType);
        submissionData.append('price_per_night', formData.pricePerNight);
        submissionData.append('room_types', JSON.stringify(formData.roomTypes));
        submissionData.append('guest_capacity', formData.guestCapacity);
        submissionData.append('bedrooms', formData.bedrooms);
        submissionData.append('bathrooms', formData.bathrooms);
        submissionData.append('size', formData.size);
      } else if (formData.advertType === 'transport') {
        submissionData.append('transport_type', formData.transportType);
        submissionData.append('price_per_trip', formData.pricePerTrip);
        submissionData.append('vehicle_type', formData.vehicleType);
        submissionData.append('passenger_capacity', formData.passengerCapacity);
        submissionData.append('luggage_capacity', formData.luggageCapacity);
        submissionData.append('service_area', formData.serviceArea);
        submissionData.append('operating_hours', formData.operatingHours);
        submissionData.append('airport_pickup', formData.airportPickup ? '1' : '0');
      } else if (formData.advertType === 'experience') {
        submissionData.append('experience_type', formData.experienceType);
        submissionData.append('price_per_service', formData.pricePerService);
        submissionData.append('duration', formData.duration);
        submissionData.append('group_size', formData.groupSize);
        submissionData.append('whats_included', JSON.stringify(formData.whatsIncluded));
        submissionData.append('what_to_bring', JSON.stringify(formData.whatToBring));
      }
      
      submissionData.append('currency', formData.currency);
      
      // Availability
      if (formData.availabilityStart) {
        submissionData.append('availability_start', formData.availabilityStart);
      }
      if (formData.availabilityEnd) {
        submissionData.append('availability_end', formData.availabilityEnd);
      }
      
      // Description fields
      submissionData.append('description', formData.description);
      submissionData.append('overview', formData.overview);
      submissionData.append('key_features', JSON.stringify(formData.keyFeatures));
      submissionData.append('why_travellers_love_this', formData.whyTravelersLoveThis);
      submissionData.append('nearby_attractions', JSON.stringify(formData.nearbyAttractions));
      submissionData.append('additional_notes', formData.additionalNotes);
      
      // Amenities (for accommodation)
      if (formData.amenities && formData.amenities.length > 0) {
        submissionData.append('amenities', JSON.stringify(formData.amenities));
      }
      
      // Contact information
      submissionData.append('contact_name', formData.contactName);
      submissionData.append('business_name', formData.businessName);
      submissionData.append('phone_number', formData.phoneNumber);
      submissionData.append('email', formData.email);
      submissionData.append('website', formData.website);
      
      // Business verification
      submissionData.append('verified_business', formData.verifiedBusiness ? '1' : '0');
      
      // Promotion tier
      if (formData.promotionTier) {
        submissionData.append('promotion_tier', formData.promotionTier);
      }
      
      // Images
      if (formData.mainImage) {
        submissionData.append('main_image', formData.mainImage);
      }
      
      if (formData.additionalImages && formData.additionalImages.length > 0) {
        formData.additionalImages.forEach((image, index) => {
          submissionData.append(`additional_images[${index}]`, image);
        });
      }
      
      if (formData.videoLink) {
        submissionData.append('video_link', formData.videoLink);
      }
      
      // Business logo
      if (formData.logo) {
        submissionData.append('logo', formData.logo);
      }
      
      // Social links
      if (formData.socialLinks) {
        Object.keys(formData.socialLinks).forEach(key => {
          if (formData.socialLinks[key]) {
            submissionData.append(`social_links[${key}]`, formData.socialLinks[key]);
          }
        });
      }
      
      // Additional fees
      if (formData.additionalFees && formData.additionalFees.length > 0) {
        submissionData.append('additional_fees', JSON.stringify(formData.additionalFees));
      }
      
      // Submit to API
      const response = await resortsTravelApi.createTravelAdvert(submissionData);
      
      console.log('Travel advert created successfully:', response);
      
      // Show success message and close form
      alert('Travel advert created successfully!');
      onClose();
      
    } catch (error) {
      console.error('Error creating travel advert:', error);
      alert(`Error: ${error.message || 'Failed to create travel advert'}`);
    }
  };

const updateFormData = (field, value) => {
  setFormData(prev => ({ ...prev, [field]: value }));
};

const renderStepContent = () => {
  // Show loading state while fetching real data
  if (loading && (realData.advertTypes.length === 0 || realData.categories.length === 0)) {
    return (
      <div className="flex flex-col items-center justify-center py-12">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mb-4"></div>
        <p className="text-gray-600">Loading form data...</p>
      </div>
    );
  }

  // Show error state if data fetch fails
  if (error && (realData.advertTypes.length === 0 || realData.categories.length === 0)) {
    return (
      <div className="bg-red-50 border-l-4 border-red-400 p-4">
        <div className="flex">
          <div className="flex-shrink-0">
            <X className="h-5 w-5 text-red-400" />
          </div>
          <div className="ml-3">
            <p className="text-sm text-red-700">{error}</p>
            <button
              onClick={loadRealData}
              className="mt-2 text-sm text-red-600 underline hover:text-red-800"
            >
              Try Again
            </button>
          </div>
        </div>
      </div>
    );
  }

  switch (currentStep) {
      case 1:
        return (
          <div className="space-y-6">
            <h3 className="text-xl font-semibold text-gray-900">What type of travel service are you offering?</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {realData.advertTypes.map((type) => (
                <motion.button
                  key={type.id || type.name}
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  onClick={() => updateFormData('advertType', type.id || type.name)}
                  className={`p-6 rounded-xl border-2 transition-all ${
                    formData.advertType === (type.id || type.name)
                      ? 'border-blue-500 bg-blue-50'
                      : 'border-gray-200 hover:border-gray-300 bg-white'
                  }`}
                >
                  <div className="text-2xl mb-2">{type.icon || '🏨'}</div>
                  <h4 className="font-semibold text-gray-900">{type.name}</h4>
                  <p className="text-sm text-gray-600 mt-1">{type.description}</p>
                </motion.button>
              ))}
            </div>
          </div>
        );

      case 2:
        return (
          <div className="space-y-6">
            <h3 className="text-xl font-semibold text-gray-900">Basic Information</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Title *</label>
                <input
                  type="text"
                  value={formData.title}
                  onChange={(e) => updateFormData('title', e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  placeholder="e.g., Luxury Beach Resort"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Tagline</label>
                <input
                  type="text"
                  value={formData.tagline}
                  onChange={(e) => updateFormData('tagline', e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  placeholder="e.g., Paradise awaits you"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Category *</label>
                <select
                  value={formData.category}
                  onChange={(e) => updateFormData('category', e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                >
                  <option value="">Select a category</option>
                  {realData.categories.map(cat => (
                    <option key={cat.id || cat.slug} value={cat.id || cat.slug}>
                      {cat.name}
                    </option>
                  ))}
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Price *</label>
                <div className="flex space-x-2">
                  <input
                    type="number"
                    value={formData.price}
                    onChange={(e) => updateFormData('price', e.target.value)}
                    className="flex-1 px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    placeholder="0.00"
                  />
                  <select
                    value={formData.priceType}
                    onChange={(e) => updateFormData('priceType', e.target.value)}
                    className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  >
                    <option value="per_night">per night</option>
                    <option value="per_person">per person</option>
                    <option value="per_trip">per trip</option>
                    <option value="per_hour">per hour</option>
                  </select>
                </div>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Country *</label>
                <input
                  type="text"
                  value={formData.country}
                  onChange={(e) => updateFormData('country', e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  placeholder="e.g., United States"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">City *</label>
                <input
                  type="text"
                  value={formData.city}
                  onChange={(e) => updateFormData('city', e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  placeholder="e.g., Miami"
                />
              </div>
            </div>
          </div>
        );

      case 3:
        return (
          <div className="space-y-6">
            <h3 className="text-xl font-semibold text-gray-900">Media Upload</h3>
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Main Image *</label>
                <div className="border-2 border-dashed border-gray-300 rounded-lg p-8 text-center hover:border-gray-400 transition-colors">
                  <Upload className="w-12 h-12 text-gray-400 mx-auto mb-4" />
                  <p className="text-gray-600 mb-2">Click to upload or drag and drop</p>
                  <p className="text-sm text-gray-500">PNG, JPG, GIF up to 10MB</p>
                  <button className="mt-4 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors">
                    Select File
                  </button>
                </div>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Additional Images</label>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                  {[1, 2, 3, 4].map((i) => (
                    <div key={i} className="aspect-square border-2 border-dashed border-gray-300 rounded-lg flex items-center justify-center hover:border-gray-400 transition-colors cursor-pointer">
                      <div className="text-center">
                        <Camera className="w-8 h-8 text-gray-400 mx-auto mb-2" />
                        <p className="text-xs text-gray-500">Image {i}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Video Link (Optional)</label>
                <input
                  type="url"
                  value={formData.videoLink}
                  onChange={(e) => updateFormData('videoLink', e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  placeholder="https://youtube.com/watch?v=..."
                />
              </div>
            </div>
          </div>
        );

      case 4:
        return (
          <div className="space-y-6">
            <h3 className="text-xl font-semibold text-gray-900">Service Details</h3>
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Description</label>
                <textarea
                  value={formData.description}
                  onChange={(e) => updateFormData('description', e.target.value)}
                  rows={4}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  placeholder="Describe your travel service..."
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Amenities</label>
                <div className="grid grid-cols-2 md:grid-cols-3 gap-2">
                  {realData.amenities.map((amenity) => (
                    <label key={amenity.id || amenity.name} className="flex items-center space-x-2 cursor-pointer">
                      <input
                        type="checkbox"
                        checked={formData.amenities.includes(amenity.id || amenity.name)}
                        onChange={(e) => {
                          const amenityValue = amenity.id || amenity.name;
                          if (e.target.checked) {
                            updateFormData('amenities', [...formData.amenities, amenityValue]);
                          } else {
                            updateFormData('amenities', formData.amenities.filter(a => a !== amenityValue));
                          }
                        }}
                        className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                      />
                      <span className="text-sm text-gray-700">{amenity.name}</span>
                    </label>
                  ))}
                </div>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Capacity</label>
                  <input
                    type="text"
                    value={formData.capacity}
                    onChange={(e) => updateFormData('capacity', e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    placeholder="e.g., 2-4 guests"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Bedrooms</label>
                  <input
                    type="number"
                    value={formData.bedrooms}
                    onChange={(e) => updateFormData('bedrooms', e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    placeholder="0"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Bathrooms</label>
                  <input
                    type="number"
                    value={formData.bathrooms}
                    onChange={(e) => updateFormData('bathrooms', e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    placeholder="0"
                  />
                </div>
              </div>
            </div>
          </div>
        );

      case 5:
        return (
          <div className="space-y-6">
            <h3 className="text-xl font-semibold text-gray-900">Location Details</h3>
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Address</label>
                <input
                  type="text"
                  value={formData.address}
                  onChange={(e) => updateFormData('address', e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  placeholder="Full address"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Nearby Attractions</label>
                <div className="space-y-2">
                  <input
                    type="text"
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    placeholder="e.g., Beach - 5 min walk"
                  />
                  <input
                    type="text"
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    placeholder="e.g., Airport - 15 min drive"
                  />
                </div>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Transport Options</label>
                <div className="space-y-2">
                  <label className="flex items-center space-x-2">
                    <input type="checkbox" className="rounded border-gray-300 text-blue-600 focus:ring-blue-500" />
                    <span className="text-sm text-gray-700">Airport pickup available</span>
                  </label>
                  <label className="flex items-center space-x-2">
                    <input type="checkbox" className="rounded border-gray-300 text-blue-600 focus:ring-blue-500" />
                    <span className="text-sm text-gray-700">Public transport nearby</span>
                  </label>
                  <label className="flex items-center space-x-2">
                    <input type="checkbox" className="rounded border-gray-300 text-blue-600 focus:ring-blue-500" />
                    <span className="text-sm text-gray-700">Parking available</span>
                  </label>
                </div>
              </div>
            </div>
          </div>
        );

      case 6:
        return (
          <div className="space-y-6">
            <h3 className="text-xl font-semibold text-gray-900">Contact Information</h3>
            <div className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Contact Name *</label>
                  <input
                    type="text"
                    value={formData.contactName}
                    onChange={(e) => updateFormData('contactName', e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    placeholder="Your name"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Contact Email *</label>
                  <input
                    type="email"
                    value={formData.contactEmail}
                    onChange={(e) => updateFormData('contactEmail', e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    placeholder="your@email.com"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Contact Phone *</label>
                  <input
                    type="tel"
                    value={formData.contactPhone}
                    onChange={(e) => updateFormData('contactPhone', e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    placeholder="+1 (555) 123-4567"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Business Name</label>
                  <input
                    type="text"
                    value={formData.businessName}
                    onChange={(e) => updateFormData('businessName', e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    placeholder="Your business name"
                  />
                </div>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Website</label>
                <input
                  type="url"
                  value={formData.website}
                  onChange={(e) => updateFormData('website', e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  placeholder="https://yourwebsite.com"
                />
              </div>
            </div>
          </div>
        );

      case 7:
        return (
          <div className="space-y-6">
            <h3 className="text-xl font-semibold text-gray-900">Availability & Pricing</h3>
            <div className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Minimum Stay</label>
                  <select
                    value={formData.minStay}
                    onChange={(e) => updateFormData('minStay', e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  >
                    <option value="">Select minimum stay</option>
                    <option value="1_night">1 night</option>
                    <option value="2_nights">2 nights</option>
                    <option value="3_nights">3 nights</option>
                    <option value="1_week">1 week</option>
                    <option value="2_weeks">2 weeks</option>
                    <option value="1_month">1 month</option>
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Cancellation Policy</label>
                  <select
                    value={formData.cancellationPolicy}
                    onChange={(e) => updateFormData('cancellationPolicy', e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  >
                    <option value="">Select policy</option>
                    <option value="flexible">Flexible (24 hours)</option>
                    <option value="moderate">Moderate (48 hours)</option>
                    <option value="strict">Strict (7 days)</option>
                    <option value="super_strict">Super Strict (30 days)</option>
                  </select>
                </div>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Additional Fees (Optional)</label>
                <div className="space-y-2">
                  <input
                    type="text"
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    placeholder="e.g., Cleaning fee - $50"
                  />
                  <input
                    type="text"
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    placeholder="e.g., Resort fee - $25/night"
                  />
                </div>
              </div>
            </div>
          </div>
        );

      case 8:
        return (
          <div className="space-y-6">
            <h3 className="text-xl font-semibold text-gray-900">Premium Promotion</h3>
            <p className="text-gray-600">Choose a promotion tier to increase your listing's visibility</p>
            <div className="space-y-4">
              {realData.promotionTiers.map((tier) => (
                <motion.div
                  key={tier.id || tier.name}
                  whileHover={{ scale: 1.02 }}
                  onClick={() => updateFormData('promotionTier', tier.id || tier.name)}
                  className={`relative rounded-xl border-2 p-6 cursor-pointer transition-all ${
                    formData.promotionTier === (tier.id || tier.name)
                      ? 'border-blue-500 bg-blue-50'
                      : 'border-gray-200 hover:border-gray-300 bg-white'
                  }`}
                >
                  {tier.popular && (
                    <div className="absolute top-4 right-4 bg-orange-500 text-white px-3 py-1 rounded-full text-xs font-semibold">
                      Most Popular
                    </div>
                  )}
                  <div className="flex items-start space-x-4">
                    <div className={`w-16 h-16 rounded-full bg-gradient-to-r ${tier.color || 'from-gray-500 to-gray-600'} flex items-center justify-center text-white`}>
                      {tier.icon || <Star className="w-8 h-8" />}
                    </div>
                    <div className="flex-1">
                      <h4 className="text-lg font-semibold text-gray-900">{tier.name}</h4>
                      <div className="flex items-baseline space-x-1 mb-2">
                        <span className="text-2xl font-bold text-gray-900">{tier.price}</span>
                        <span className="text-gray-600">{tier.period}</span>
                      </div>
                      <ul className="space-y-1">
                        {tier.features.map((feature, idx) => (
                          <li key={idx} className="flex items-center space-x-2 text-sm text-gray-600">
                            <Check className="w-4 h-4 text-green-500" />
                            <span>{feature}</span>
                          </li>
                        ))}
                      </ul>
                    </div>
                  </div>
                </motion.div>
              ))}
            </div>
          </div>
        );

      default:
        return null;
    }
  };

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-50 overflow-y-auto">
        <div className="flex items-center justify-center min-h-screen px-4">
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/50 backdrop-blur-sm"
            onClick={onClose}
          />

          {/* Modal */}
          <motion.div
            initial={{ opacity: 0, scale: 0.95, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: 20 }}
            transition={{ duration: 0.3 }}
            className="relative bg-white rounded-2xl shadow-2xl max-w-4xl w-full max-h-[90vh] overflow-hidden"
          >
            {/* Header */}
            <div className="bg-gradient-to-r from-blue-600 to-teal-600 text-white p-6">
              <div className="flex items-center justify-between mb-4">
                <h2 className="text-2xl font-bold">Post Travel Advert</h2>
                <button
                  onClick={onClose}
                  className="w-10 h-10 bg-white/20 backdrop-blur rounded-full flex items-center justify-center hover:bg-white/30 transition-colors"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              {/* Progress Bar */}
              <div className="flex items-center justify-between mb-4">
                {steps.map((step, index) => (
                  <div key={step.id} className="flex items-center">
                    <div className={`flex items-center justify-center w-8 h-8 rounded-full text-sm font-medium transition-colors ${
                      currentStep >= step.id
                        ? 'bg-white text-blue-600'
                        : 'bg-white/20 text-white/60'
                    }`}>
                      {currentStep > step.id ? <Check className="w-4 h-4" /> : step.id}
                    </div>
                    <div className={`flex-1 h-1 mx-2 transition-colors ${
                      index < steps.length - 1
                        ? currentStep > step.id ? 'bg-white' : 'bg-white/20'
                        : ''
                    }`} />
                  </div>
                ))}
              </div>

              {/* Step Info */}
              <div className="flex items-center space-x-3">
                <div className="w-10 h-10 bg-white/20 backdrop-blur rounded-full flex items-center justify-center">
                  {steps[currentStep - 1].icon}
                </div>
                <div>
                  <h3 className="font-semibold">{steps[currentStep - 1].title}</h3>
                  <p className="text-sm text-blue-100">{steps[currentStep - 1].description}</p>
                </div>
              </div>
            </div>

            {/* Content */}
            <div className="p-6 overflow-y-auto max-h-[60vh]">
              {renderStepContent()}
            </div>

            {/* Footer */}
            <div className="border-t border-gray-200 p-6">
              <div className="flex items-center justify-between">
                <button
                  onClick={handlePrevious}
                  disabled={currentStep === 1}
                  className={`flex items-center space-x-2 px-4 py-2 rounded-lg transition-colors ${
                    currentStep === 1
                      ? 'bg-gray-100 text-gray-400 cursor-not-allowed'
                      : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                  }`}
                >
                  <ArrowLeft className="w-4 h-4" />
                  <span>Previous</span>
                </button>

                {currentStep === totalSteps ? (
                  <button
                    onClick={handleSubmit}
                    className="flex items-center space-x-2 px-6 py-2 bg-gradient-to-r from-blue-600 to-teal-600 text-white rounded-lg hover:from-blue-700 hover:to-teal-700 transition-all"
                  >
                    <Check className="w-4 h-4" />
                    <span>Submit Listing</span>
                  </button>
                ) : (
                  <button
                    onClick={handleNext}
                    className="flex items-center space-x-2 px-6 py-2 bg-gradient-to-r from-blue-600 to-teal-600 text-white rounded-lg hover:from-blue-700 hover:to-teal-700 transition-all"
                  >
                    <span>Next</span>
                    <ArrowRight className="w-4 h-4" />
                  </button>
                )}
              </div>
            </div>
          </motion.div>
        </div>
      </div>
    </AnimatePresence>
  );
};

export default TravelPostForm;
