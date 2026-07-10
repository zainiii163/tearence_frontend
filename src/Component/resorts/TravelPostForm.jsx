import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  X, 
  ArrowLeft, 
  ArrowRight, 
  Check, 
  Star, 
  Plane,
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
  Rocket,
  Camera,
  User,
  MapPin,
  Calendar,
  Clock,
  Users,
  Car,
  Home,
  Mountain,
  Building2,
  CheckCircle,
  Plus,
  Trash2
} from 'lucide-react';
import ResortsTravelApi from '../../services/resortsTravelAPI';
import { extractListItems } from '../../utils/apiResponseHelpers';
import { groupTravelCategories, parseOperatingHoursInput } from '../../utils/travelFormHelpers';

const TravelPostForm = ({ onClose, initialData = null }) => {
  const [currentStep, setCurrentStep] = useState(1);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [advertTypes, setAdvertTypes] = useState({});
  const [categories, setCategories] = useState([]);
  const [amenities, setAmenities] = useState([]);
  const [promotionTiers, setPromotionTiers] = useState([]);
  const [formData, setFormData] = useState({
    // Step 1: Basic Information
    title: '',
    tagline: '',
    advert_type: '',
    category_id: '',
    country: '',
    city: '',
    address: '',
    latitude: null,
    longitude: null,
    is_approximate_location: false,
    
    // Step 2: Accommodation Details
    accommodation_type: '',
    price_per_night: '',
    room_types: [],
    guest_capacity: '',
    check_in_time: '',
    check_out_time: '',
    distance_to_city_centre: '',
    amenities: [],
    
    // Step 3: Transport Details
    transport_type: '',
    price_per_trip: '',
    vehicle_type: '',
    passenger_capacity: '',
    luggage_capacity: '',
    service_area: '',
    operating_hours: '',
    airport_pickup: false,
    
    // Step 4: Experience Details
    experience_type: '',
    price_per_service: '',
    duration: '',
    group_size: '',
    whats_included: '',
    what_to_bring: '',
    
    // Step 5: Availability & Pricing
    currency: 'USD',
    availability_start: '',
    availability_end: '',
    
    // Step 6: Description
    description: '',
    overview: '',
    key_features: '',
    why_travellers_love_this: '',
    nearby_attractions: '',
    additional_notes: '',
    
    // Step 7: Contact Information
    contact_name: '',
    business_name: '',
    phone_number: '',
    email: '',
    website: '',
    social_links: {
      facebook: '',
      twitter: '',
      instagram: '',
      linkedin: ''
    },
    logo: null,
    verified_business: false,
    
    // Step 8: Media Upload
    main_image: null,
    images: [],
    video_link: '',
    
    // Step 9: Promotion
    promotion_tier: '1',
    
    // Step 10: Review
    agreed_to_terms: false
  });

  const totalSteps = 10;

  const steps = [
    {
      id: 1,
      title: 'Basic Information',
      description: 'Add the essential details about your travel listing',
      icon: <Plane className="w-5 h-5" />
    },
    {
      id: 2,
      title: 'Accommodation',
      description: 'Specify accommodation details (if applicable)',
      icon: <Home className="w-5 h-5" />
    },
    {
      id: 3,
      title: 'Transport',
      description: 'Add transport information (if applicable)',
      icon: <Car className="w-5 h-5" />
    },
    {
      id: 4,
      title: 'Experience',
      description: 'Describe the travel experience (if applicable)',
      icon: <Mountain className="w-5 h-5" />
    },
    {
      id: 5,
      title: 'Availability',
      description: 'Set availability dates and pricing',
      icon: <Calendar className="w-5 h-5" />
    },
    {
      id: 6,
      title: 'Description',
      description: 'Provide detailed descriptions',
      icon: <FileText className="w-5 h-5" />
    },
    {
      id: 7,
      title: 'Contact',
      description: 'Add your contact information',
      icon: <Phone className="w-5 h-5" />
    },
    {
      id: 8,
      title: 'Media',
      description: 'Upload images and videos',
      icon: <Camera className="w-5 h-5" />
    },
    {
      id: 9,
      title: 'Promotion',
      description: 'Choose promotion options',
      icon: <Rocket className="w-5 h-5" />
    },
    {
      id: 10,
      title: 'Review',
      description: 'Review and submit your listing',
      icon: <CheckCircle className="w-5 h-5" />
    }
  ];

  useEffect(() => {
    loadFormData();
  }, []);

  const loadCategories = async () => {
    try {
      const categoriesData = await ResortsTravelApi.getCategories({ per_page: 100 });
      setCategories(extractListItems(categoriesData));
    } catch (err) {
      console.error('Error loading categories:', err);
      setCategories([]);
    }
  };

  const categoryGroups = groupTravelCategories(categories);

  const loadFormData = async () => {
    try {
      setLoading(true);
      const [typesData, amenitiesData, tiersData] = await Promise.all([
        ResortsTravelApi.getAdvertTypes(),
        ResortsTravelApi.getAmenities(),
        ResortsTravelApi.getPromotionTiers()
      ]);

      setAdvertTypes(typesData?.data || {});
      setAmenities(Array.isArray(amenitiesData?.data) ? amenitiesData.data : Array.isArray(amenitiesData) ? amenitiesData : amenitiesData?.data || {});
      setPromotionTiers(Array.isArray(tiersData?.data) ? tiersData.data : Array.isArray(tiersData) ? tiersData : tiersData?.data || []);
      await loadCategories();
    } catch (err) {
      console.error('Error loading form data:', err);
      setError('Failed to load form data. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const handleInputChange = (field, value) => {
    setFormData(prev => ({
      ...prev,
      [field]: value,
    }));
  };

  const handleNestedChange = (parent, field, value) => {
    setFormData(prev => ({
      ...prev,
      [parent]: {
        ...prev[parent],
        [field]: value
      }
    }));
  };

  const handleArrayToggle = (field, value) => {
    setFormData(prev => ({
      ...prev,
      [field]: prev[field].includes(value)
        ? prev[field].filter(item => item !== value)
        : [...prev[field], value]
    }));
  };

  const handleFileUpload = (field, file) => {
    setFormData(prev => ({
      ...prev,
      [field]: file
    }));
  };

  const handleMultipleFileUpload = (field, files) => {
    setFormData(prev => ({
      ...prev,
      [field]: [...prev[field], ...files]
    }));
  };

  const handleRemoveFile = (field, index) => {
    setFormData(prev => ({
      ...prev,
      [field]: prev[field].filter((_, i) => i !== index)
    }));
  };

  const handleSubmit = async () => {
    try {
      setLoading(true);
      setError('');

      const submitData = new FormData();

      // Basic Info
      Object.keys(formData).forEach(key => {
        if (key === 'operating_hours') {
          return;
        }
        if (key === 'social_links') {
          submitData.append('social_links', JSON.stringify(formData[key]));
        } else if (key === 'amenities' || key === 'room_types' || key === 'images') {
          submitData.append(key, JSON.stringify(formData[key]));
        } else if (formData[key] !== null && formData[key] !== '') {
          submitData.append(key, formData[key]);
        }
      });

      const operatingHours = parseOperatingHoursInput(formData.operating_hours);
      if (operatingHours) {
        operatingHours.forEach((hours, index) => {
          submitData.append(`operating_hours[${index}]`, hours);
        });
      }

      // Handle file uploads
      if (formData.main_image) {
        submitData.append('main_image', formData.main_image);
      }
      if (formData.logo) {
        submitData.append('logo', formData.logo);
      }
      formData.images.forEach((image, index) => {
        submitData.append(`images_${index}`, image);
      });

      await ResortsTravelApi.createTravelAdvert(submitData);
      onClose();
    } catch (err) {
      console.error('Error creating travel advert:', err);
      setError(err.response?.data?.message || 'Failed to create listing. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const nextStep = () => {
    if (currentStep < totalSteps) {
      setCurrentStep(prev => prev + 1);
    }
  };

  const prevStep = () => {
    if (currentStep > 1) {
      setCurrentStep(prev => prev - 1);
    }
  };

  const renderStep = () => {
    switch (currentStep) {
      case 1:
        return (
          <div className="space-y-6">
            <h3 className="text-xl font-semibold text-gray-900">Basic Information</h3>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Advert Type *</label>
              <select
                value={formData.advert_type}
                onChange={(e) => handleInputChange('advert_type', e.target.value)}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                required
              >
                <option value="">Select type</option>
                {Object.entries(advertTypes).map(([key, type]) => (
                  <option key={key} value={key}>{type.name}</option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Title *</label>
              <input
                type="text"
                value={formData.title}
                onChange={(e) => handleInputChange('title', e.target.value)}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                required
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Tagline</label>
              <input
                type="text"
                value={formData.tagline}
                onChange={(e) => handleInputChange('tagline', e.target.value)}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Category *</label>
              <select
                value={formData.category_id}
                onChange={(e) => handleInputChange('category_id', e.target.value)}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                required
              >
                <option value="">Select category</option>
                {categoryGroups.map((group) => (
                  <optgroup key={group.type} label={group.label}>
                    {group.items.map((cat) => (
                      <option key={cat.id} value={cat.id}>{cat.name}</option>
                    ))}
                  </optgroup>
                ))}
              </select>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Country *</label>
                <input
                  type="text"
                  value={formData.country}
                  onChange={(e) => handleInputChange('country', e.target.value)}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  required
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">City *</label>
                <input
                  type="text"
                  value={formData.city}
                  onChange={(e) => handleInputChange('city', e.target.value)}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  required
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Address</label>
              <input
                type="text"
                value={formData.address}
                onChange={(e) => handleInputChange('address', e.target.value)}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
            </div>

            <div className="flex items-center gap-2">
              <input
                type="checkbox"
                checked={formData.is_approximate_location}
                onChange={(e) => handleInputChange('is_approximate_location', e.target.checked)}
                className="w-4 h-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
              />
              <label className="text-sm text-gray-700">Show approximate location only</label>
            </div>
          </div>
        );

      case 2:
        return (
          <div className="space-y-6">
            <h3 className="text-xl font-semibold text-gray-900">Accommodation Details</h3>
            <p className="text-sm text-gray-500">Fill this section if your listing is accommodation-based</p>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Accommodation Type</label>
              <select
                value={formData.accommodation_type}
                onChange={(e) => handleInputChange('accommodation_type', e.target.value)}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              >
                <option value="">Select type</option>
                <option value="hotel">Hotel</option>
                <option value="resort">Resort</option>
                <option value="villa">Villa</option>
                <option value="apartment">Apartment</option>
                <option value="hostel">Hostel</option>
                <option value="camping">Camping</option>
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Price Per Night</label>
              <div className="relative">
                <span className="absolute left-3 top-2 text-gray-500">$</span>
                <input
                  type="number"
                  value={formData.price_per_night}
                  onChange={(e) => handleInputChange('price_per_night', e.target.value)}
                  className="w-full pl-8 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Room Types</label>
              <div className="flex flex-wrap gap-2">
                {['Single', 'Double', 'Suite', 'Family', 'Dorm'].map(type => (
                  <button
                    key={type}
                    type="button"
                    onClick={() => handleArrayToggle('room_types', type)}
                    className={`px-4 py-2 rounded-lg border ${
                      formData.room_types.includes(type)
                        ? 'bg-blue-500 text-white border-blue-500'
                        : 'bg-white text-gray-700 border-gray-300'
                    }`}
                  >
                    {type}
                  </button>
                ))}
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Guest Capacity</label>
              <input
                type="number"
                value={formData.guest_capacity}
                onChange={(e) => handleInputChange('guest_capacity', e.target.value)}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Check-in Time</label>
                <input
                  type="time"
                  value={formData.check_in_time}
                  onChange={(e) => handleInputChange('check_in_time', e.target.value)}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Check-out Time</label>
                <input
                  type="time"
                  value={formData.check_out_time}
                  onChange={(e) => handleInputChange('check_out_time', e.target.value)}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Distance to City Centre (km)</label>
              <input
                type="text"
                value={formData.distance_to_city_centre}
                onChange={(e) => handleInputChange('distance_to_city_centre', e.target.value)}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Amenities</label>
              <div className="grid grid-cols-3 gap-2">
                {Array.isArray(amenities) && amenities.map(amenity => (
                  <button
                    key={amenity.id}
                    type="button"
                    onClick={() => handleArrayToggle('amenities', amenity.name)}
                    className={`px-3 py-2 text-sm rounded-lg border ${
                      formData.amenities.includes(amenity.name)
                        ? 'bg-blue-500 text-white border-blue-500'
                        : 'bg-white text-gray-700 border-gray-300'
                    }`}
                  >
                    {amenity.name}
                  </button>
                ))}
              </div>
            </div>
          </div>
        );

      case 3:
        return (
          <div className="space-y-6">
            <h3 className="text-xl font-semibold text-gray-900">Transport Details</h3>
            <p className="text-sm text-gray-500">Fill this section if your listing is transport-based</p>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Transport Type</label>
              <select
                value={formData.transport_type}
                onChange={(e) => handleInputChange('transport_type', e.target.value)}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              >
                <option value="">Select type</option>
                <option value="car_rental">Car Rental</option>
                <option value="shuttle">Shuttle Service</option>
                <option value="taxi">Taxi</option>
                <option value="bus">Bus</option>
                <option value="train">Train</option>
                <option value="boat">Boat</option>
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Price Per Trip</label>
              <div className="relative">
                <span className="absolute left-3 top-2 text-gray-500">$</span>
                <input
                  type="number"
                  value={formData.price_per_trip}
                  onChange={(e) => handleInputChange('price_per_trip', e.target.value)}
                  className="w-full pl-8 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Vehicle Type</label>
              <input
                type="text"
                value={formData.vehicle_type}
                onChange={(e) => handleInputChange('vehicle_type', e.target.value)}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                placeholder="e.g., SUV, Sedan, Van"
              />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Passenger Capacity</label>
                <input
                  type="number"
                  value={formData.passenger_capacity}
                  onChange={(e) => handleInputChange('passenger_capacity', e.target.value)}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Luggage Capacity</label>
                <input
                  type="text"
                  value={formData.luggage_capacity}
                  onChange={(e) => handleInputChange('luggage_capacity', e.target.value)}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  placeholder="e.g., 2 large, 2 small"
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Service Area</label>
              <input
                type="text"
                value={formData.service_area}
                onChange={(e) => handleInputChange('service_area', e.target.value)}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                placeholder="e.g., City-wide, Airport transfers"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Operating Hours</label>
              <input
                type="text"
                value={formData.operating_hours}
                onChange={(e) => handleInputChange('operating_hours', e.target.value)}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                placeholder="e.g., 24/7, 8AM-8PM"
              />
            </div>

            <div className="flex items-center gap-2">
              <input
                type="checkbox"
                checked={formData.airport_pickup}
                onChange={(e) => handleInputChange('airport_pickup', e.target.checked)}
                className="w-4 h-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
              />
              <label className="text-sm text-gray-700">Airport Pickup Available</label>
            </div>
          </div>
        );

      case 4:
        return (
          <div className="space-y-6">
            <h3 className="text-xl font-semibold text-gray-900">Experience Details</h3>
            <p className="text-sm text-gray-500">Fill this section if your listing is an experience/activity</p>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Experience Type</label>
              <select
                value={formData.experience_type}
                onChange={(e) => handleInputChange('experience_type', e.target.value)}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              >
                <option value="">Select type</option>
                <option value="tour">Tour</option>
                <option value="activity">Activity</option>
                <option value="adventure">Adventure</option>
                <option value="cultural">Cultural</option>
                <option value="wellness">Wellness</option>
                <option value="food">Food & Drink</option>
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Price Per Service</label>
              <div className="relative">
                <span className="absolute left-3 top-2 text-gray-500">$</span>
                <input
                  type="number"
                  value={formData.price_per_service}
                  onChange={(e) => handleInputChange('price_per_service', e.target.value)}
                  className="w-full pl-8 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Duration</label>
              <input
                type="text"
                value={formData.duration}
                onChange={(e) => handleInputChange('duration', e.target.value)}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                placeholder="e.g., 2 hours, 1 day, 3 days"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Group Size</label>
              <input
                type="text"
                value={formData.group_size}
                onChange={(e) => handleInputChange('group_size', e.target.value)}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                placeholder="e.g., Max 10 people, 2-6 people"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">What's Included</label>
              <textarea
                value={formData.whats_included}
                onChange={(e) => handleInputChange('whats_included', e.target.value)}
                rows={4}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                placeholder="List what's included in the experience"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">What to Bring</label>
              <textarea
                value={formData.what_to_bring}
                onChange={(e) => handleInputChange('what_to_bring', e.target.value)}
                rows={4}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                placeholder="List what participants should bring"
              />
            </div>
          </div>
        );

      case 5:
        return (
          <div className="space-y-6">
            <h3 className="text-xl font-semibold text-gray-900">Availability & Pricing</h3>
            
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Currency</label>
                <select
                  value={formData.currency}
                  onChange={(e) => handleInputChange('currency', e.target.value)}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                >
                  <option value="USD">USD ($)</option>
                  <option value="EUR">EUR (€)</option>
                  <option value="GBP">GBP (£)</option>
                  <option value="AED">AED (د.إ)</option>
                </select>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Availability Start</label>
                <input
                  type="date"
                  value={formData.availability_start}
                  onChange={(e) => handleInputChange('availability_start', e.target.value)}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Availability End</label>
                <input
                  type="date"
                  value={formData.availability_end}
                  onChange={(e) => handleInputChange('availability_end', e.target.value)}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
              </div>
            </div>
          </div>
        );

      case 6:
        return (
          <div className="space-y-6">
            <h3 className="text-xl font-semibold text-gray-900">Description</h3>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Overview *</label>
              <textarea
                value={formData.overview}
                onChange={(e) => handleInputChange('overview', e.target.value)}
                rows={3}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                placeholder="Brief overview of your listing"
                required
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Full Description *</label>
              <textarea
                value={formData.description}
                onChange={(e) => handleInputChange('description', e.target.value)}
                rows={6}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                placeholder="Detailed description of your travel listing"
                required
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Key Features</label>
              <textarea
                value={formData.key_features}
                onChange={(e) => handleInputChange('key_features', e.target.value)}
                rows={3}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                placeholder="List key features (one per line)"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Why Travellers Love This</label>
              <textarea
                value={formData.why_travellers_love_this}
                onChange={(e) => handleInputChange('why_travellers_love_this', e.target.value)}
                rows={3}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                placeholder="What makes your listing special"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Nearby Attractions</label>
              <textarea
                value={formData.nearby_attractions}
                onChange={(e) => handleInputChange('nearby_attractions', e.target.value)}
                rows={3}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                placeholder="List nearby attractions and points of interest"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Additional Notes</label>
              <textarea
                value={formData.additional_notes}
                onChange={(e) => handleInputChange('additional_notes', e.target.value)}
                rows={3}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                placeholder="Any additional information"
              />
            </div>
          </div>
        );

      case 7:
        return (
          <div className="space-y-6">
            <h3 className="text-xl font-semibold text-gray-900">Contact Information</h3>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Contact Name *</label>
              <input
                type="text"
                value={formData.contact_name}
                onChange={(e) => handleInputChange('contact_name', e.target.value)}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                required
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Business Name</label>
              <input
                type="text"
                value={formData.business_name}
                onChange={(e) => handleInputChange('business_name', e.target.value)}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Phone Number *</label>
              <input
                type="tel"
                value={formData.phone_number}
                onChange={(e) => handleInputChange('phone_number', e.target.value)}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                required
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Email *</label>
              <input
                type="email"
                value={formData.email}
                onChange={(e) => handleInputChange('email', e.target.value)}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                required
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Website</label>
              <input
                type="url"
                value={formData.website}
                onChange={(e) => handleInputChange('website', e.target.value)}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                placeholder="https://"
              />
            </div>

            <div className="space-y-3">
              <label className="block text-sm font-medium text-gray-700">Social Links</label>
              <input
                type="url"
                value={formData.social_links.facebook}
                onChange={(e) => handleNestedChange('social_links', 'facebook', e.target.value)}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                placeholder="Facebook URL"
              />
              <input
                type="url"
                value={formData.social_links.twitter}
                onChange={(e) => handleNestedChange('social_links', 'twitter', e.target.value)}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                placeholder="Twitter URL"
              />
              <input
                type="url"
                value={formData.social_links.instagram}
                onChange={(e) => handleNestedChange('social_links', 'instagram', e.target.value)}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                placeholder="Instagram URL"
              />
              <input
                type="url"
                value={formData.social_links.linkedin}
                onChange={(e) => handleNestedChange('social_links', 'linkedin', e.target.value)}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                placeholder="LinkedIn URL"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Business Logo</label>
              <div className="border-2 border-dashed border-gray-300 rounded-lg p-6 text-center">
                <input
                  type="file"
                  accept="image/*"
                  onChange={(e) => handleFileUpload('logo', e.target.files[0])}
                  className="hidden"
                  id="logo-upload"
                />
                <label htmlFor="logo-upload" className="cursor-pointer">
                  <Upload className="mx-auto h-12 w-12 text-gray-400" />
                  <p className="mt-2 text-sm text-gray-600">Click to upload logo</p>
                </label>
                {formData.logo && (
                  <p className="mt-2 text-sm text-green-600">{formData.logo.name}</p>
                )}
              </div>
            </div>

            <div className="flex items-center gap-2">
              <input
                type="checkbox"
                checked={formData.verified_business}
                onChange={(e) => handleInputChange('verified_business', e.target.checked)}
                className="w-4 h-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
              />
              <label className="text-sm text-gray-700">I am a verified business</label>
            </div>
          </div>
        );

      case 8:
        return (
          <div className="space-y-6">
            <h3 className="text-xl font-semibold text-gray-900">Media Upload</h3>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Main Image *</label>
              <div className="border-2 border-dashed border-gray-300 rounded-lg p-6 text-center">
                <input
                  type="file"
                  accept="image/*"
                  onChange={(e) => handleFileUpload('main_image', e.target.files[0])}
                  className="hidden"
                  id="main-image-upload"
                  required
                />
                <label htmlFor="main-image-upload" className="cursor-pointer">
                  <Camera className="mx-auto h-12 w-12 text-gray-400" />
                  <p className="mt-2 text-sm text-gray-600">Click to upload main image</p>
                </label>
                {formData.main_image && (
                  <p className="mt-2 text-sm text-green-600">{formData.main_image.name}</p>
                )}
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Additional Images</label>
              <div className="border-2 border-dashed border-gray-300 rounded-lg p-6 text-center">
                <input
                  type="file"
                  accept="image/*"
                  multiple
                  onChange={(e) => handleMultipleFileUpload('images', Array.from(e.target.files))}
                  className="hidden"
                  id="additional-images-upload"
                />
                <label htmlFor="additional-images-upload" className="cursor-pointer">
                  <Upload className="mx-auto h-12 w-12 text-gray-400" />
                  <p className="mt-2 text-sm text-gray-600">Click to upload additional images</p>
                </label>
                {formData.images.length > 0 && (
                  <p className="mt-2 text-sm text-green-600">{formData.images.length} images selected</p>
                )}
              </div>
              {formData.images.length > 0 && (
                <div className="mt-4 grid grid-cols-4 gap-2">
                  {formData.images.map((image, index) => (
                    <div key={index} className="relative">
                      <img
                        src={URL.createObjectURL(image)}
                        alt={`Preview ${index + 1}`}
                        className="w-full h-20 object-cover rounded"
                      />
                      <button
                        type="button"
                        onClick={() => handleRemoveFile('images', index)}
                        className="absolute top-1 right-1 bg-red-500 text-white rounded-full p-1"
                      >
                        <Trash2 className="w-3 h-3" />
                      </button>
                    </div>
                  ))}
                </div>
              )}
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Video Link</label>
              <input
                type="url"
                value={formData.video_link}
                onChange={(e) => handleInputChange('video_link', e.target.value)}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                placeholder="YouTube, Vimeo, or other video URL"
              />
            </div>
          </div>
        );

      case 9:
        return (
          <div className="space-y-6">
            <h3 className="text-xl font-semibold text-gray-900">Promotion Options</h3>
            
            <div className="space-y-4">
              {promotionTiers.map(tier => (
                <div
                  key={tier.id}
                  onClick={() => handleInputChange('promotion_tier', tier.id.toString())}
                  className={`p-4 border-2 rounded-lg cursor-pointer transition-all ${
                    formData.promotion_tier === tier.id.toString()
                      ? 'border-blue-500 bg-blue-50'
                      : 'border-gray-200 hover:border-gray-300'
                  }`}
                >
                  <div className="flex items-center justify-between">
                    <div>
                      <h4 className="font-semibold text-gray-900">{tier.name}</h4>
                      <p className="text-sm text-gray-600">{tier.description}</p>
                    </div>
                    <div className="text-right">
                      <p className="text-2xl font-bold text-gray-900">${tier.price}</p>
                      <p className="text-sm text-gray-500">{tier.duration}</p>
                    </div>
                  </div>
                  {tier.features && (
                    <ul className="mt-3 space-y-1">
                      {tier.features.map((feature, index) => (
                        <li key={index} className="text-sm text-gray-600 flex items-center gap-2">
                          <Check className="w-4 h-4 text-green-500" />
                          {feature}
                        </li>
                      ))}
                    </ul>
                  )}
                </div>
              ))}
            </div>
          </div>
        );

      case 10:
        return (
          <div className="space-y-6">
            <h3 className="text-xl font-semibold text-gray-900">Review & Submit</h3>
            
            <div className="bg-gray-50 rounded-lg p-6 space-y-4">
              <div>
                <h4 className="font-semibold text-gray-900">Basic Information</h4>
                <p className="text-sm text-gray-600">{formData.title}</p>
                <p className="text-sm text-gray-600">{formData.country}, {formData.city}</p>
              </div>

              <div>
                <h4 className="font-semibold text-gray-900">Description</h4>
                <p className="text-sm text-gray-600">{formData.overview}</p>
              </div>

              <div>
                <h4 className="font-semibold text-gray-900">Contact</h4>
                <p className="text-sm text-gray-600">{formData.contact_name}</p>
                <p className="text-sm text-gray-600">{formData.email}</p>
                <p className="text-sm text-gray-600">{formData.phone_number}</p>
              </div>

              <div>
                <h4 className="font-semibold text-gray-900">Media</h4>
                <p className="text-sm text-gray-600">
                  Main Image: {formData.main_image ? formData.main_image.name : 'Not uploaded'}
                </p>
                <p className="text-sm text-gray-600">
                  Additional Images: {formData.images.length} uploaded
                </p>
              </div>

              <div>
                <h4 className="font-semibold text-gray-900">Promotion Tier</h4>
                <p className="text-sm text-gray-600">
                  {promotionTiers.find(t => t.id.toString() === formData.promotion_tier)?.name || 'Standard'}
                </p>
              </div>
            </div>

            <div className="flex items-center gap-2">
              <input
                type="checkbox"
                checked={formData.agreed_to_terms}
                onChange={(e) => handleInputChange('agreed_to_terms', e.target.checked)}
                className="w-4 h-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
                required
              />
              <label className="text-sm text-gray-700">
                I agree to the terms and conditions *
              </label>
            </div>
          </div>
        );

      default:
        return null;
    }
  };

  if (loading && currentStep === 1) {
    return (
      <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
        <div className="bg-white rounded-lg p-8 text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
          <p className="mt-4 text-gray-700">Loading form data...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 overflow-y-auto">
      <div className="bg-white rounded-lg shadow-xl w-full max-w-4xl max-h-[90vh] overflow-y-auto my-8">
        {/* Header */}
        <div className="sticky top-0 bg-white border-b border-gray-200 px-6 py-4 flex items-center justify-between">
          <h2 className="text-2xl font-bold text-gray-900">Create Travel Listing</h2>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-gray-600 transition-colors"
          >
            <X className="w-6 h-6" />
          </button>
        </div>

        {/* Progress Steps */}
        <div className="px-6 py-4 border-b border-gray-200">
          <div className="flex items-center justify-between">
            {steps.map((step, index) => (
              <div key={step.id} className="flex items-center">
                <div className={`flex items-center justify-center w-8 h-8 rounded-full ${
                  currentStep > step.id ? 'bg-green-500 text-white' :
                  currentStep === step.id ? 'bg-blue-500 text-white' :
                  'bg-gray-200 text-gray-600'
                }`}>
                  {currentStep > step.id ? <Check className="w-5 h-5" /> : step.id}
                </div>
                {index < steps.length - 1 && (
                  <div className={`w-12 h-1 mx-2 ${
                    currentStep > step.id ? 'bg-green-500' : 'bg-gray-200'
                  }`} />
                )}
              </div>
            ))}
          </div>
          <div className="mt-2 flex justify-between text-xs text-gray-600">
            {steps.map(step => (
              <span key={step.id} className={currentStep === step.id ? 'font-semibold text-blue-600' : ''}>
                {step.title}
              </span>
            ))}
          </div>
        </div>

        {/* Error Message */}
        {error && (
          <div className="mx-6 mt-4 p-4 bg-red-50 border border-red-200 rounded-lg">
            <p className="text-sm text-red-600">{error}</p>
          </div>
        )}

        {/* Form Content */}
        <div className="p-6">
          <AnimatePresence mode="wait">
            <motion.div
              key={currentStep}
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
              transition={{ duration: 0.2 }}
            >
              {renderStep()}
            </motion.div>
          </AnimatePresence>
        </div>

        {/* Footer */}
        <div className="sticky bottom-0 bg-white border-t border-gray-200 px-6 py-4 flex items-center justify-between">
          <button
            onClick={prevStep}
            disabled={currentStep === 1}
            className={`flex items-center gap-2 px-4 py-2 rounded-lg transition-colors ${
              currentStep === 1
                ? 'bg-gray-100 text-gray-400 cursor-not-allowed'
                : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
            }`}
          >
            <ArrowLeft className="w-4 h-4" />
            Previous
          </button>

          {currentStep < totalSteps ? (
            <button
              onClick={nextStep}
              className="flex items-center gap-2 px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
            >
              Next
              <ArrowRight className="w-4 h-4" />
            </button>
          ) : (
            <button
              onClick={handleSubmit}
              disabled={!formData.agreed_to_terms || loading}
              className={`flex items-center gap-2 px-6 py-2 rounded-lg transition-colors ${
                !formData.agreed_to_terms || loading
                  ? 'bg-gray-300 text-gray-500 cursor-not-allowed'
                  : 'bg-green-600 text-white hover:bg-green-700'
              }`}
            >
              {loading ? (
                <>
                  <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
                  Submitting...
                </>
              ) : (
                <>
                  <Check className="w-4 h-4" />
                  Submit Listing
                </>
              )}
            </button>
          )}
        </div>
      </div>
    </div>
  );
};

export default TravelPostForm;
