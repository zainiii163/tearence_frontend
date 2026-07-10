import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  X, 
  Upload,
  DollarSign,
  Globe,
  Phone,
  Mail,
  MapPin,
  Calendar,
  Clock,
  Users,
  Car,
  Home,
  Mountain,
  CheckCircle,
  Plus,
  Trash2,
  Loader,
  AlertCircle
} from 'lucide-react';
import ResortsTravelApi from '../../services/resortsTravelAPI';
import { extractListItems } from '../../utils/apiResponseHelpers';
import { groupTravelCategories, parseOperatingHoursInput, formatOperatingHoursForInput, getTravelMediaUrl } from '../../utils/travelFormHelpers';

const TravelPostFormModal = ({ isOpen, onClose, onSuccess, editAdvert = null }) => {
  const isEditing = Boolean(editAdvert?.id);
  const [loading, setLoading] = useState(false);
  const [submitLoading, setSubmitLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [advertTypes, setAdvertTypes] = useState({});
  const [categories, setCategories] = useState([]);
  const [amenitiesList, setAmenitiesList] = useState({});
  const [promotionTiers, setPromotionTiers] = useState({});
  
  const [formData, setFormData] = useState({
    title: '',
    tagline: '',
    advert_type: 'accommodation',
    category_id: '',
    country: '',
    city: '',
    address: '',
    latitude: '',
    longitude: '',
    is_approximate_location: false,
    
    accommodation_type: '',
    price_per_night: '',
    room_types: '',
    guest_capacity: '',
    check_in_time: '',
    check_out_time: '',
    distance_to_city_centre: '',
    amenities: [],
    
    transport_type: '',
    price_per_trip: '',
    vehicle_type: '',
    passenger_capacity: '',
    luggage_capacity: '',
    service_area: '',
    operating_hours: '',
    airport_pickup: false,
    
    experience_type: '',
    price_per_service: '',
    duration: '',
    group_size: '',
    whats_included: '',
    what_to_bring: '',
    
    currency: 'GBP',
    availability_start: '',
    availability_end: '',
    
    description: '',
    overview: '',
    key_features: '',
    why_travellers_love_this: '',
    nearby_attractions: '',
    additional_notes: '',
    
    contact_name: '',
    business_name: '',
    phone_number: '',
    email: '',
    website: '',
    social_links: [],
    logo: '',
    verified_business: false,
    
    main_image: '',
    images: [],
    video_link: '',
    
    promotion_tier: 'standard'
  });

  const [uploadingImages, setUploadingImages] = useState(false);
  const [uploadingLogo, setUploadingLogo] = useState(false);

  useEffect(() => {
    if (isOpen) {
      loadFormData();
    }
  }, [isOpen]);

  const loadCategories = async () => {
    try {
      const categoriesRes = await ResortsTravelApi.getCategories({ per_page: 100 });
      setCategories(extractListItems(categoriesRes));
    } catch (err) {
      console.error('Error loading categories:', err);
      setCategories([]);
    }
  };

  const categoryGroups = groupTravelCategories(categories);

  useEffect(() => {
    if (!editAdvert) return;
    setFormData((prev) => ({
      ...prev,
      title: editAdvert.title || '',
      tagline: editAdvert.tagline || '',
      advert_type: editAdvert.advert_type || 'accommodation',
      category_id: editAdvert.category_id?.toString() || '',
      country: editAdvert.country || '',
      city: editAdvert.city || '',
      address: editAdvert.address || '',
      description: editAdvert.description || '',
      currency: editAdvert.currency || 'GBP',
      price_per_night: editAdvert.price_per_night?.toString() || '',
      guest_capacity: editAdvert.guest_capacity?.toString() || '',
      contact_name: editAdvert.contact_name || '',
      business_name: editAdvert.business_name || '',
      phone_number: editAdvert.phone_number || editAdvert.phone || '',
      email: editAdvert.email || '',
      website: editAdvert.website || '',
      promotion_tier: editAdvert.promotion_tier || 'standard',
      operating_hours: formatOperatingHoursForInput(editAdvert.operating_hours),
    }));
  }, [editAdvert]);

  const loadFormData = async () => {
    setLoading(true);
    try {
      const [typesRes, amenitiesRes, tiersRes] = await Promise.all([
        ResortsTravelApi.getAdvertTypes(),
        ResortsTravelApi.getAmenities(),
        ResortsTravelApi.getPromotionTiers()
      ]);

      setAdvertTypes(typesRes.data || {});
      setAmenitiesList(amenitiesRes.data || {});
      setPromotionTiers(tiersRes.data || {});
      await loadCategories();
    } catch (err) {
      console.error('Error loading form data:', err);
      setError('Failed to load form data. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const handleInputChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData(prev => {
      const next = {
        ...prev,
        [name]: type === 'checkbox' ? checked : value,
      };

      if (name === 'advert_type' && value !== prev.advert_type) {
        next.accommodation_type = '';
        next.transport_type = '';
        next.experience_type = '';
      }

      return next;
    });
  };

  const handleAmenityToggle = (amenityKey) => {
    setFormData(prev => ({
      ...prev,
      amenities: prev.amenities.includes(amenityKey)
        ? prev.amenities.filter(a => a !== amenityKey)
        : [...prev.amenities, amenityKey]
    }));
  };

  const handleImageUpload = async (e, isMainImage = false) => {
    const files = e.target.files;
    if (!files || files.length === 0) return;

    setUploadingImages(true);
    setError('');

    try {
      const formDataToSend = new FormData();
      
      if (isMainImage) {
        formDataToSend.append('images', files[0]);
        const response = await ResortsTravelApi.uploadImages(formDataToSend);
        if (response.success && response.data && response.data.length > 0) {
          setFormData(prev => ({ ...prev, main_image: response.data[0] }));
          setSuccess('Main image uploaded successfully!');
          setTimeout(() => setSuccess(''), 3000);
        }
      } else {
        Array.from(files).forEach(file => {
          formDataToSend.append('images', file);
        });
        const response = await ResortsTravelApi.uploadImages(formDataToSend);
        if (response.success && response.data) {
          setFormData(prev => ({ 
            ...prev, 
            images: [...prev.images, ...response.data] 
          }));
          setSuccess('Images uploaded successfully!');
          setTimeout(() => setSuccess(''), 3000);
        }
      }
    } catch (err) {
      console.error('Error uploading images:', err);
      setError('Failed to upload images. Please try again.');
    } finally {
      setUploadingImages(false);
    }
  };

  const handleLogoUpload = async (e) => {
    const file = e.target.files[0];
    if (!file) return;

    setUploadingLogo(true);
    setError('');

    try {
      const formDataToSend = new FormData();
      formDataToSend.append('logo', file);
      const response = await ResortsTravelApi.uploadLogo(formDataToSend);
      
      if (response.success && response.data) {
        setFormData(prev => ({ ...prev, logo: response.data }));
        setSuccess('Logo uploaded successfully!');
        setTimeout(() => setSuccess(''), 3000);
      }
    } catch (err) {
      console.error('Error uploading logo:', err);
      setError('Failed to upload logo. Please try again.');
    } finally {
      setUploadingLogo(false);
    }
  };

  const removeImage = (index) => {
    setFormData(prev => ({
      ...prev,
      images: prev.images.filter((_, i) => i !== index)
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSubmitLoading(true);
    setError('');
    setSuccess('');

    if (!formData.main_image) {
      setError('Please upload a main image before submitting.');
      setSubmitLoading(false);
      return;
    }

    try {
      const dataToSubmit = {
        ...formData,
        main_image: formData.main_image || null,
        logo: formData.logo || null,
        images: Array.isArray(formData.images) ? formData.images.filter(Boolean) : [],
        room_types: formData.room_types ? formData.room_types.split(',').map(r => r.trim()) : [],
        social_links: formData.social_links.filter(link => link.trim() !== ''),
        latitude: formData.latitude ? parseFloat(formData.latitude) : null,
        longitude: formData.longitude ? parseFloat(formData.longitude) : null,
        price_per_night: formData.price_per_night ? parseFloat(formData.price_per_night) : null,
        price_per_trip: formData.price_per_trip ? parseFloat(formData.price_per_trip) : null,
        price_per_service: formData.price_per_service ? parseFloat(formData.price_per_service) : null,
        guest_capacity: formData.guest_capacity ? parseInt(formData.guest_capacity) : null,
        passenger_capacity: formData.passenger_capacity ? parseInt(formData.passenger_capacity) : null,
        luggage_capacity: formData.luggage_capacity ? parseInt(formData.luggage_capacity) : null,
        distance_to_city_centre: formData.distance_to_city_centre ? parseInt(formData.distance_to_city_centre) : null,
        group_size: formData.group_size ? parseInt(formData.group_size) : null,
        operating_hours: parseOperatingHoursInput(formData.operating_hours),
      };

      const response = isEditing
        ? await ResortsTravelApi.updateTravelAdvert(editAdvert.id, dataToSubmit)
        : await ResortsTravelApi.createTravelAdvert(dataToSubmit);
      
      if (response.success) {
        setSuccess(isEditing ? 'Travel advert updated successfully!' : 'Travel advert created successfully!');
        setTimeout(() => {
          if (onSuccess) onSuccess(response.data);
          onClose();
        }, 1500);
      }
    } catch (err) {
      console.error('Error creating advert:', err);
      setError(err.message || 'Failed to create advert. Please check all required fields.');
    } finally {
      setSubmitLoading(false);
    }
  };

  if (!isOpen) return null;

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-50 overflow-y-auto">
        <div className="fixed inset-0 bg-black bg-opacity-50" onClick={onClose} />
        
        <div className="relative min-h-screen flex items-center justify-center p-4">
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.95 }}
            className="relative bg-white rounded-2xl shadow-2xl w-full max-w-6xl max-h-[90vh] overflow-hidden"
          >
            {/* Header */}
            <div className="sticky top-0 bg-gradient-to-r from-blue-600 to-teal-600 text-white px-6 py-4 flex justify-between items-center z-10">
              <div>
                <h2 className="text-2xl font-bold">{isEditing ? 'Edit Travel Advert' : 'Post Travel Advert'}</h2>
                <p className="text-blue-100 text-sm">Fill in the details below to create your listing</p>
              </div>
              <button
                onClick={onClose}
                className="p-2 hover:bg-white/20 rounded-full transition-colors"
              >
                <X className="w-6 h-6" />
              </button>
            </div>

            {/* Loading State */}
            {loading && (
              <div className="flex items-center justify-center py-12">
                <Loader className="w-8 h-8 animate-spin text-blue-600" />
                <span className="ml-3 text-gray-600">Loading form data...</span>
              </div>
            )}

            {/* Form Content */}
            {!loading && (
              <form onSubmit={handleSubmit} className="overflow-y-auto max-h-[calc(90vh-80px)]">
                <div className="p-6 space-y-6">
                  {/* Error/Success Messages */}
                  {error && (
                    <div className="bg-red-50 border-l-4 border-red-400 p-4 rounded flex items-start">
                      <AlertCircle className="w-5 h-5 text-red-400 mr-3 flex-shrink-0 mt-0.5" />
                      <p className="text-sm text-red-700">{error}</p>
                    </div>
                  )}
                  
                  {success && (
                    <div className="bg-green-50 border-l-4 border-green-400 p-4 rounded flex items-start">
                      <CheckCircle className="w-5 h-5 text-green-400 mr-3 flex-shrink-0 mt-0.5" />
                      <p className="text-sm text-green-700">{success}</p>
                    </div>
                  )}

                  {/* Basic Information */}
                  <div className="bg-gray-50 rounded-lg p-6">
                    <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
                      <Home className="w-5 h-5 mr-2 text-blue-600" />
                      Basic Information
                    </h3>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div className="md:col-span-2">
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          Title <span className="text-red-500">*</span>
                        </label>
                        <input
                          type="text"
                          name="title"
                          value={formData.title}
                          onChange={handleInputChange}
                          required
                          className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                          placeholder="e.g., Luxury Beachfront Villa with Private Pool"
                        />
                      </div>

                      <div className="md:col-span-2">
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          Tagline
                        </label>
                        <input
                          type="text"
                          name="tagline"
                          value={formData.tagline}
                          onChange={handleInputChange}
                          className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                          placeholder="Short catchy tagline"
                        />
                      </div>

                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          Advert Type <span className="text-red-500">*</span>
                        </label>
                        <select
                          name="advert_type"
                          value={formData.advert_type}
                          onChange={handleInputChange}
                          required
                          className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                        >
                          {Object.keys(advertTypes).map(key => (
                            <option key={key} value={key}>{advertTypes[key]?.name}</option>
                          ))}
                        </select>
                      </div>

                      {formData.advert_type === 'accommodation' && (
                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-2">
                            Accommodation Type <span className="text-red-500">*</span>
                          </label>
                          <select
                            name="accommodation_type"
                            value={formData.accommodation_type}
                            onChange={handleInputChange}
                            required
                            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                          >
                            <option value="">Select type...</option>
                            {advertTypes.accommodation?.subtypes && Object.entries(advertTypes.accommodation.subtypes).map(([key, value]) => (
                              <option key={key} value={key}>{value}</option>
                            ))}
                          </select>
                        </div>
                      )}

                      {formData.advert_type === 'transport' && (
                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-2">
                            Transport Type <span className="text-red-500">*</span>
                          </label>
                          <select
                            name="transport_type"
                            value={formData.transport_type}
                            onChange={handleInputChange}
                            required
                            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                          >
                            <option value="">Select type...</option>
                            {advertTypes.transport?.subtypes && Object.entries(advertTypes.transport.subtypes).map(([key, value]) => (
                              <option key={key} value={key}>{value}</option>
                            ))}
                          </select>
                        </div>
                      )}

                      {formData.advert_type === 'experience' && (
                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-2">
                            Experience Type <span className="text-red-500">*</span>
                          </label>
                          <select
                            name="experience_type"
                            value={formData.experience_type}
                            onChange={handleInputChange}
                            required
                            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                          >
                            <option value="">Select type...</option>
                            {advertTypes.experience?.subtypes && Object.entries(advertTypes.experience.subtypes).map(([key, value]) => (
                              <option key={key} value={key}>{value}</option>
                            ))}
                          </select>
                        </div>
                      )}

                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          Category
                        </label>
                        <select
                          name="category_id"
                          value={formData.category_id}
                          onChange={handleInputChange}
                          className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                        >
                          <option value="">Select category...</option>
                          {categoryGroups.map((group) => (
                            <optgroup key={group.type} label={group.label}>
                              {group.items.map((cat) => (
                                <option key={cat.id} value={cat.id}>{cat.name}</option>
                              ))}
                            </optgroup>
                          ))}
                        </select>
                        {categories.length === 0 && (
                          <p className="mt-1 text-xs text-amber-600">
                            No travel categories found. Add them in Filament under Travel Categories.
                          </p>
                        )}
                      </div>

                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          Country <span className="text-red-500">*</span>
                        </label>
                        <input
                          type="text"
                          name="country"
                          value={formData.country}
                          onChange={handleInputChange}
                          required
                          className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                          placeholder="e.g., United Kingdom"
                        />
                      </div>

                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          City <span className="text-red-500">*</span>
                        </label>
                        <input
                          type="text"
                          name="city"
                          value={formData.city}
                          onChange={handleInputChange}
                          required
                          className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                          placeholder="e.g., London"
                        />
                      </div>

                      <div className="md:col-span-2">
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          Address
                        </label>
                        <input
                          type="text"
                          name="address"
                          value={formData.address}
                          onChange={handleInputChange}
                          className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                          placeholder="Full address"
                        />
                      </div>

                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          Latitude
                        </label>
                        <input
                          type="number"
                          step="any"
                          name="latitude"
                          value={formData.latitude}
                          onChange={handleInputChange}
                          className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                          placeholder="e.g., 51.5074"
                        />
                      </div>

                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          Longitude
                        </label>
                        <input
                          type="number"
                          step="any"
                          name="longitude"
                          value={formData.longitude}
                          onChange={handleInputChange}
                          className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                          placeholder="e.g., -0.1278"
                        />
                      </div>

                      <div className="md:col-span-2">
                        <label className="flex items-center">
                          <input
                            type="checkbox"
                            name="is_approximate_location"
                            checked={formData.is_approximate_location}
                            onChange={handleInputChange}
                            className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                          />
                          <span className="ml-2 text-sm text-gray-700">Use approximate location (for privacy)</span>
                        </label>
                      </div>
                    </div>
                  </div>

                  {/* Accommodation Details */}
                  {formData.advert_type === 'accommodation' && (
                    <div className="bg-blue-50 rounded-lg p-6">
                      <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
                        <Home className="w-5 h-5 mr-2 text-blue-600" />
                        Accommodation Details
                      </h3>
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-2">
                            Price per Night (£)
                          </label>
                          <input
                            type="number"
                            step="0.01"
                            name="price_per_night"
                            value={formData.price_per_night}
                            onChange={handleInputChange}
                            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                            placeholder="e.g., 150.00"
                          />
                        </div>

                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-2">
                            Guest Capacity
                          </label>
                          <input
                            type="number"
                            name="guest_capacity"
                            value={formData.guest_capacity}
                            onChange={handleInputChange}
                            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                            placeholder="e.g., 4"
                          />
                        </div>

                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-2">
                            Check-in Time
                          </label>
                          <input
                            type="time"
                            name="check_in_time"
                            value={formData.check_in_time}
                            onChange={handleInputChange}
                            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                          />
                        </div>

                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-2">
                            Check-out Time
                          </label>
                          <input
                            type="time"
                            name="check_out_time"
                            value={formData.check_out_time}
                            onChange={handleInputChange}
                            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                          />
                        </div>

                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-2">
                            Distance to City Centre (km)
                          </label>
                          <input
                            type="number"
                            name="distance_to_city_centre"
                            value={formData.distance_to_city_centre}
                            onChange={handleInputChange}
                            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                            placeholder="e.g., 5"
                          />
                        </div>

                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-2">
                            Room Types (comma-separated)
                          </label>
                          <input
                            type="text"
                            name="room_types"
                            value={formData.room_types}
                            onChange={handleInputChange}
                            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                            placeholder="e.g., Double, Twin, Suite"
                          />
                        </div>

                        <div className="md:col-span-2">
                          <label className="block text-sm font-medium text-gray-700 mb-2">
                            Amenities
                          </label>
                          <div className="grid grid-cols-2 md:grid-cols-4 gap-2 max-h-48 overflow-y-auto border border-gray-200 rounded-lg p-3">
                            {Object.entries(amenitiesList).map(([key, value]) => (
                              <label key={key} className="flex items-center text-sm">
                                <input
                                  type="checkbox"
                                  checked={formData.amenities.includes(key)}
                                  onChange={() => handleAmenityToggle(key)}
                                  className="rounded border-gray-300 text-blue-600 focus:ring-blue-500 mr-2"
                                />
                                <span className="text-gray-700">{value}</span>
                              </label>
                            ))}
                          </div>
                        </div>
                      </div>
                    </div>
                  )}

                  {/* Transport Details */}
                  {formData.advert_type === 'transport' && (
                    <div className="bg-green-50 rounded-lg p-6">
                      <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
                        <Car className="w-5 h-5 mr-2 text-green-600" />
                        Transport Details
                      </h3>
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-2">
                            Price per Trip (£)
                          </label>
                          <input
                            type="number"
                            step="0.01"
                            name="price_per_trip"
                            value={formData.price_per_trip}
                            onChange={handleInputChange}
                            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                            placeholder="e.g., 50.00"
                          />
                        </div>

                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-2">
                            Vehicle Type
                          </label>
                          <input
                            type="text"
                            name="vehicle_type"
                            value={formData.vehicle_type}
                            onChange={handleInputChange}
                            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                            placeholder="e.g., Sedan, SUV, Van"
                          />
                        </div>

                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-2">
                            Passenger Capacity
                          </label>
                          <input
                            type="number"
                            name="passenger_capacity"
                            value={formData.passenger_capacity}
                            onChange={handleInputChange}
                            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                            placeholder="e.g., 4"
                          />
                        </div>

                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-2">
                            Luggage Capacity
                          </label>
                          <input
                            type="number"
                            name="luggage_capacity"
                            value={formData.luggage_capacity}
                            onChange={handleInputChange}
                            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                            placeholder="e.g., 2"
                          />
                        </div>

                        <div className="md:col-span-2">
                          <label className="block text-sm font-medium text-gray-700 mb-2">
                            Service Area
                          </label>
                          <input
                            type="text"
                            name="service_area"
                            value={formData.service_area}
                            onChange={handleInputChange}
                            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                            placeholder="e.g., London and surrounding areas"
                          />
                        </div>

                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-2">
                            Operating Hours
                          </label>
                          <input
                            type="text"
                            name="operating_hours"
                            value={formData.operating_hours}
                            onChange={handleInputChange}
                            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                            placeholder="e.g., 24/7 or Mon-Fri 9am-5pm, Sat 10am-2pm"
                          />
                        </div>

                        <div>
                          <label className="flex items-center pt-8">
                            <input
                              type="checkbox"
                              name="airport_pickup"
                              checked={formData.airport_pickup}
                              onChange={handleInputChange}
                              className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                            />
                            <span className="ml-2 text-sm text-gray-700">Airport Pickup Available</span>
                          </label>
                        </div>
                      </div>
                    </div>
                  )}

                  {/* Experience Details */}
                  {formData.advert_type === 'experience' && (
                    <div className="bg-purple-50 rounded-lg p-6">
                      <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
                        <Mountain className="w-5 h-5 mr-2 text-purple-600" />
                        Experience Details
                      </h3>
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-2">
                            Price per Service (£)
                          </label>
                          <input
                            type="number"
                            step="0.01"
                            name="price_per_service"
                            value={formData.price_per_service}
                            onChange={handleInputChange}
                            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                            placeholder="e.g., 75.00"
                          />
                        </div>

                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-2">
                            Duration
                          </label>
                          <input
                            type="text"
                            name="duration"
                            value={formData.duration}
                            onChange={handleInputChange}
                            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                            placeholder="e.g., 3 hours, Full day"
                          />
                        </div>

                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-2">
                            Group Size
                          </label>
                          <input
                            type="number"
                            name="group_size"
                            value={formData.group_size}
                            onChange={handleInputChange}
                            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                            placeholder="e.g., 10"
                          />
                        </div>

                        <div className="md:col-span-2">
                          <label className="block text-sm font-medium text-gray-700 mb-2">
                            What's Included
                          </label>
                          <textarea
                            name="whats_included"
                            value={formData.whats_included}
                            onChange={handleInputChange}
                            rows="3"
                            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                            placeholder="List what's included in the experience"
                          />
                        </div>

                        <div className="md:col-span-2">
                          <label className="block text-sm font-medium text-gray-700 mb-2">
                            What to Bring
                          </label>
                          <textarea
                            name="what_to_bring"
                            value={formData.what_to_bring}
                            onChange={handleInputChange}
                            rows="3"
                            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                            placeholder="What participants should bring"
                          />
                        </div>
                      </div>
                    </div>
                  )}

                  {/* Pricing & Availability */}
                  <div className="bg-yellow-50 rounded-lg p-6">
                    <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
                      <DollarSign className="w-5 h-5 mr-2 text-yellow-600" />
                      Pricing & Availability
                    </h3>
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          Currency
                        </label>
                        <select
                          name="currency"
                          value={formData.currency}
                          onChange={handleInputChange}
                          className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                        >
                          <option value="GBP">GBP (£)</option>
                          <option value="USD">USD ($)</option>
                          <option value="EUR">EUR (€)</option>
                        </select>
                      </div>

                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          Available From
                        </label>
                        <input
                          type="date"
                          name="availability_start"
                          value={formData.availability_start}
                          onChange={handleInputChange}
                          className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                        />
                      </div>

                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          Available Until
                        </label>
                        <input
                          type="date"
                          name="availability_end"
                          value={formData.availability_end}
                          onChange={handleInputChange}
                          className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                        />
                      </div>
                    </div>
                  </div>

                  {/* Description */}
                  <div className="bg-gray-50 rounded-lg p-6">
                    <h3 className="text-lg font-semibold text-gray-900 mb-4">
                      Description & Details
                    </h3>
                    <div className="space-y-4">
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          Description <span className="text-red-500">*</span>
                        </label>
                        <textarea
                          name="description"
                          value={formData.description}
                          onChange={handleInputChange}
                          required
                          rows="4"
                          className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                          placeholder="Detailed description of your listing"
                        />
                      </div>

                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          Overview
                        </label>
                        <textarea
                          name="overview"
                          value={formData.overview}
                          onChange={handleInputChange}
                          rows="3"
                          className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                          placeholder="Brief overview"
                        />
                      </div>

                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          Key Features
                        </label>
                        <textarea
                          name="key_features"
                          value={formData.key_features}
                          onChange={handleInputChange}
                          rows="3"
                          className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                          placeholder="List key features"
                        />
                      </div>

                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          Why Travellers Love This
                        </label>
                        <textarea
                          name="why_travellers_love_this"
                          value={formData.why_travellers_love_this}
                          onChange={handleInputChange}
                          rows="3"
                          className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                          placeholder="What makes this special?"
                        />
                      </div>

                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          Nearby Attractions
                        </label>
                        <textarea
                          name="nearby_attractions"
                          value={formData.nearby_attractions}
                          onChange={handleInputChange}
                          rows="3"
                          className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                          placeholder="What's nearby?"
                        />
                      </div>

                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          Additional Notes
                        </label>
                        <textarea
                          name="additional_notes"
                          value={formData.additional_notes}
                          onChange={handleInputChange}
                          rows="3"
                          className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                          placeholder="Any additional information"
                        />
                      </div>
                    </div>
                  </div>

                  {/* Contact Information */}
                  <div className="bg-indigo-50 rounded-lg p-6">
                    <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
                      <Phone className="w-5 h-5 mr-2 text-indigo-600" />
                      Contact Information
                    </h3>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          Contact Name <span className="text-red-500">*</span>
                        </label>
                        <input
                          type="text"
                          name="contact_name"
                          value={formData.contact_name}
                          onChange={handleInputChange}
                          required
                          className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                          placeholder="Your name"
                        />
                      </div>

                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          Business Name
                        </label>
                        <input
                          type="text"
                          name="business_name"
                          value={formData.business_name}
                          onChange={handleInputChange}
                          className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                          placeholder="Business name (optional)"
                        />
                      </div>

                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          Phone Number <span className="text-red-500">*</span>
                        </label>
                        <input
                          type="tel"
                          name="phone_number"
                          value={formData.phone_number}
                          onChange={handleInputChange}
                          required
                          className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                          placeholder="+44 123 456 7890"
                        />
                      </div>

                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          Email <span className="text-red-500">*</span>
                        </label>
                        <input
                          type="email"
                          name="email"
                          value={formData.email}
                          onChange={handleInputChange}
                          required
                          className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                          placeholder="your@email.com"
                        />
                      </div>

                      <div className="md:col-span-2">
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          Website
                        </label>
                        <input
                          type="url"
                          name="website"
                          value={formData.website}
                          onChange={handleInputChange}
                          className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                          placeholder="https://yourwebsite.com"
                        />
                      </div>

                      <div className="md:col-span-2">
                        <label className="flex items-center">
                          <input
                            type="checkbox"
                            name="verified_business"
                            checked={formData.verified_business}
                            onChange={handleInputChange}
                            className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                          />
                          <span className="ml-2 text-sm text-gray-700">Verified Business</span>
                        </label>
                      </div>
                    </div>
                  </div>

                  {/* Media Upload */}
                  <div className="bg-pink-50 rounded-lg p-6">
                    <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
                      <Upload className="w-5 h-5 mr-2 text-pink-600" />
                      Media Upload
                    </h3>
                    <div className="space-y-4">
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          Main Image
                        </label>
                        <input
                          type="file"
                          accept="image/*"
                          onChange={(e) => handleImageUpload(e, true)}
                          disabled={uploadingImages}
                          className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                        />
                        {formData.main_image && (
                          <div className="mt-2">
                            <img 
                              src={getTravelMediaUrl(formData.main_image)} 
                              alt="Main" 
                              className="h-32 w-32 object-cover rounded-lg"
                            />
                          </div>
                        )}
                      </div>

                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          Additional Images
                        </label>
                        <input
                          type="file"
                          accept="image/*"
                          multiple
                          onChange={(e) => handleImageUpload(e, false)}
                          disabled={uploadingImages}
                          className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                        />
                        {formData.images.length > 0 && (
                          <div className="mt-2 grid grid-cols-4 gap-2">
                            {formData.images.map((img, idx) => (
                              <div key={idx} className="relative">
                                <img 
                                  src={getTravelMediaUrl(img)} 
                                  alt={`Additional ${idx + 1}`} 
                                  className="h-24 w-24 object-cover rounded-lg"
                                />
                                <button
                                  type="button"
                                  onClick={() => removeImage(idx)}
                                  className="absolute -top-2 -right-2 bg-red-500 text-white rounded-full p-1 hover:bg-red-600"
                                >
                                  <X className="w-4 h-4" />
                                </button>
                              </div>
                            ))}
                          </div>
                        )}
                      </div>

                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          Business Logo
                        </label>
                        <input
                          type="file"
                          accept="image/*"
                          onChange={handleLogoUpload}
                          disabled={uploadingLogo}
                          className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                        />
                        {formData.logo && (
                          <div className="mt-2">
                            <img 
                              src={getTravelMediaUrl(formData.logo)} 
                              alt="Logo" 
                              className="h-24 w-24 object-cover rounded-lg"
                            />
                          </div>
                        )}
                      </div>

                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          Video Link (YouTube, Vimeo, etc.)
                        </label>
                        <input
                          type="url"
                          name="video_link"
                          value={formData.video_link}
                          onChange={handleInputChange}
                          className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                          placeholder="https://youtube.com/watch?v=..."
                        />
                      </div>
                    </div>
                  </div>

                  {/* Promotion Tier */}
                  <div className="bg-gradient-to-r from-purple-50 to-pink-50 rounded-lg p-6">
                    <h3 className="text-lg font-semibold text-gray-900 mb-4">
                      Promotion Options
                    </h3>
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                      {Object.entries(promotionTiers).map(([key, tier]) => (
                        <div
                          key={key}
                          onClick={() => setFormData(prev => ({ ...prev, promotion_tier: key }))}
                          className={`cursor-pointer border-2 rounded-lg p-4 transition-all ${
                            formData.promotion_tier === key
                              ? 'border-blue-600 bg-blue-50'
                              : 'border-gray-200 hover:border-blue-300'
                          }`}
                        >
                          <div className="flex items-center justify-between mb-2">
                            <h4 className="font-semibold text-gray-900">{tier.name}</h4>
                            {tier.most_popular && (
                              <span className="text-xs bg-yellow-400 text-yellow-900 px-2 py-1 rounded-full">
                                Popular
                              </span>
                            )}
                          </div>
                          <p className="text-2xl font-bold text-blue-600 mb-2">
                            £{tier.price}
                          </p>
                          <p className="text-xs text-gray-600 mb-3">{tier.description}</p>
                          <ul className="text-xs text-gray-700 space-y-1">
                            {tier.features?.slice(0, 3).map((feature, idx) => (
                              <li key={idx} className="flex items-start">
                                <CheckCircle className="w-3 h-3 text-green-500 mr-1 flex-shrink-0 mt-0.5" />
                                <span>{feature}</span>
                              </li>
                            ))}
                          </ul>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>

                {/* Footer */}
                <div className="sticky bottom-0 bg-white border-t border-gray-200 px-6 py-4 flex justify-between items-center">
                  <button
                    type="button"
                    onClick={onClose}
                    className="px-6 py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50 transition-colors"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    disabled={submitLoading || uploadingImages || uploadingLogo}
                    className="px-8 py-2 bg-gradient-to-r from-blue-600 to-teal-600 text-white rounded-lg hover:from-blue-700 hover:to-teal-700 transition-all disabled:opacity-50 disabled:cursor-not-allowed flex items-center"
                  >
                    {submitLoading ? (
                      <>
                        <Loader className="w-5 h-5 animate-spin mr-2" />
                        Creating...
                      </>
                    ) : (
                      <>
                        <CheckCircle className="w-5 h-5 mr-2" />
                        Create Advert
                      </>
                    )}
                  </button>
                </div>
              </form>
            )}
          </motion.div>
        </div>
      </div>
    </AnimatePresence>
  );
};

export default TravelPostFormModal;
