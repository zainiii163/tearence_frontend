import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Image as ImageIcon, Check, X, Building2, CalendarDays } from 'lucide-react';
import eventsVenuesAPI from '../../services/eventsVenuesAPI';
import { compressImageFile, compressImageFiles } from '../../utils/imageCompression';

const EventsVenuesPostForm = ({ onClose, onSuccess, defaultType = 'event', editAdvert = null, embedded = false }) => {
  const navigate = useNavigate();
  const [advertType, setAdvertType] = useState(defaultType);
  const [loading, setLoading] = useState(false);
  const [categories, setCategories] = useState([]);
  const [promotionTiers, setPromotionTiers] = useState([]);
  const [selectedPromotionTier, setSelectedPromotionTier] = useState('basic');
  const [mainImagePreview, setMainImagePreview] = useState(null);
  const [additionalImagePreviews, setAdditionalImagePreviews] = useState([]);
  const [logoPreview, setLogoPreview] = useState(null);
  const [amenities, setAmenities] = useState([]);
  
  // Store actual file objects for submission
  const [mainImageFile, setMainImageFile] = useState(null);
  const [additionalImageFiles, setAdditionalImageFiles] = useState([]);
  const [logoFile, setLogoFile] = useState(null);

  const [formData, setFormData] = useState({
    // Common fields
    title: '',
    description: '',
    short_description: '',
    tagline: '',
    category_id: '',
    country: '',
    city: '',
    state: '',
    address: '',
    postal_code: '',
    latitude: '',
    longitude: '',
    contact_name: '',
    business_name: '',
    email: '',
    phone: '',
    website: '',
    video_url: '',
    key_features: [],
    additional_notes: '',
    indoor_outdoor: true,
    family_friendly: false,
    catering_available: false,
    parking_available: false,
    accessible: false,
    promotion_tier: 'basic',
    terms_accepted: false,
    accurate_info: false,

    // Event-specific fields
    event_date: '',
    event_time: '',
    event_end_date: '',
    event_end_time: '',
    venue_name: '',
    ticket_price: '',
    ticket_currency: 'USD',
    free_event: false,
    event_category: '',

    // Venue-specific fields
    venue_type: '',
    capacity: '',
    price_range: '',
  });

  useEffect(() => {
    loadData();
  }, []);

  useEffect(() => {
    if (!editAdvert) return;
    setAdvertType(editAdvert.advert_type || defaultType);
    setFormData((prev) => ({
      ...prev,
      title: editAdvert.title || '',
      description: editAdvert.description || '',
      short_description: editAdvert.short_description || '',
      tagline: editAdvert.tagline || '',
      category_id: editAdvert.category_id?.toString() || '',
      country: editAdvert.country || '',
      city: editAdvert.city || '',
      state: editAdvert.state || '',
      address: editAdvert.address || '',
      postal_code: editAdvert.postal_code || '',
      contact_name: editAdvert.contact_name || '',
      business_name: editAdvert.business_name || '',
      email: editAdvert.email || '',
      phone: editAdvert.phone || '',
      website: editAdvert.website || '',
      video_url: editAdvert.video_url || '',
      event_date: editAdvert.event_date?.slice?.(0, 10) || editAdvert.event_date || '',
      event_time: editAdvert.event_time || '',
      venue_type: editAdvert.venue_type || '',
      capacity: editAdvert.capacity?.toString() || '',
      terms_accepted: true,
      accurate_info: true,
    }));
  }, [editAdvert, defaultType]);

  const loadData = async () => {
    try {
      const [categoriesRes, tiersRes] = await Promise.all([
        eventsVenuesAPI.getCategories(),
        eventsVenuesAPI.getPromotionTiers(),
      ]);
      setCategories(categoriesRes.data || []);
      setPromotionTiers(tiersRes.data || []);
    } catch (error) {
      console.error('Error loading data:', error);
    }
  };

  const handleInputChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value
    }));
  };

  const MAX_IMAGE_BYTES = 10 * 1024 * 1024; // 10 MB

  const validateImageFile = (file, label = 'Image') => {
    if (!file) return null;
    if (file.size > MAX_IMAGE_BYTES) {
      return `${label} must be 10 MB or smaller.`;
    }
    return null;
  };

  const handleMainImageUpload = (e) => {
    const file = e.target.files[0];
    if (!file) return;

    const sizeError = validateImageFile(file, 'Main image');
    if (sizeError) {
      alert(sizeError);
      e.target.value = '';
      return;
    }

    // Store the file for submission
    setMainImageFile(file);
    
    // Create preview URL
    const previewUrl = URL.createObjectURL(file);
    setMainImagePreview(previewUrl);
  };

  const handleAdditionalImagesUpload = (e) => {
    const files = Array.from(e.target.files);
    if (!files.length) return;

    const tooLarge = files.find((f) => f.size > MAX_IMAGE_BYTES);
    if (tooLarge) {
      alert('Each additional image must be 10 MB or smaller.');
      e.target.value = '';
      return;
    }

    // Store files for submission
    setAdditionalImageFiles(prev => [...prev, ...files]);
    
    // Create preview URLs
    const previewUrls = files.map(file => URL.createObjectURL(file));
    setAdditionalImagePreviews(prev => [...prev, ...previewUrls]);
  };

  const handleLogoUpload = (e) => {
    const file = e.target.files[0];
    if (!file) return;

    const sizeError = validateImageFile(file, 'Logo');
    if (sizeError) {
      alert(sizeError);
      e.target.value = '';
      return;
    }

    // Store file for submission
    setLogoFile(file);
    
    // Create preview URL
    const previewUrl = URL.createObjectURL(file);
    setLogoPreview(previewUrl);
  };

  const handleKeyFeaturesChange = (e) => {
    const features = e.target.value.split('\n').filter(f => f.trim());
    setFormData(prev => ({ ...prev, key_features: features }));
  };

  const handleAmenityToggle = (amenity) => {
    setAmenities(prev => {
      if (prev.includes(amenity)) {
        return prev.filter(a => a !== amenity);
      }
      return [...prev, amenity];
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    // Validation
    if (!formData.title || !formData.description || !formData.country || !formData.city) {
      alert('Please fill in all required fields');
      return;
    }

    if (!mainImageFile) {
      alert('Please upload a main image');
      return;
    }

    if (!formData.terms_accepted || !formData.accurate_info) {
      alert('Please accept the terms and confirm accurate information');
      return;
    }

    if (advertType === 'event' && !formData.event_date) {
      alert('Please provide event date');
      return;
    }

    if (advertType === 'venue' && !formData.venue_type) {
      alert('Please provide venue type');
      return;
    }

    setLoading(true);
    try {
      const fileCount =
        1 + additionalImageFiles.length + (logoFile ? 1 : 0);
      // Stay under typical PHP post_max_size=8M (leave ~1M for form fields)
      const maxSizeBytes = Math.min(
        1.8 * 1024 * 1024,
        Math.floor((7 * 1024 * 1024) / Math.max(fileCount, 1))
      );
      const compressionOptions = { maxSizeBytes };

      const compressedMain = await compressImageFile(mainImageFile, compressionOptions);
      const compressedAdditional = additionalImageFiles.length
        ? await compressImageFiles(additionalImageFiles, compressionOptions)
        : [];
      const compressedLogo = logoFile
        ? await compressImageFile(logoFile, compressionOptions)
        : null;

      const submitData = new FormData();
      
      // Add advert type first
      submitData.append('advert_type', advertType);

      // Add text fields
      Object.keys(formData).forEach(key => {
        const value = formData[key];

        // Handled separately below
        if (['terms_accepted', 'accurate_info', 'promotion_tier'].includes(key)) {
          return;
        }
        
        // Skip empty values and arrays (handled separately)
        if (value === null || value === undefined || value === '' || Array.isArray(value)) {
          return;
        }
        
        // Convert booleans to actual boolean values (not strings)
        if (typeof value === 'boolean') {
          submitData.append(key, value ? '1' : '0');
        } else {
          submitData.append(key, value);
        }
      });

      // Add key_features as array (one item per line)
      if (formData.key_features && formData.key_features.length > 0) {
        formData.key_features.forEach((feature, index) => {
          submitData.append(`key_features[${index}]`, feature);
        });
      }

      // Add amenities if venue
      if (advertType === 'venue' && amenities.length > 0) {
        amenities.forEach((amenity, index) => {
          submitData.append(`amenities[${index}]`, amenity);
        });
      }

      // Required booleans for Laravel validation
      submitData.append('terms_accepted', formData.terms_accepted ? '1' : '0');
      submitData.append('accurate_info', formData.accurate_info ? '1' : '0');
      submitData.append('promotion_tier', selectedPromotionTier || formData.promotion_tier || 'basic');

      // Add main image file (must be a File blob, not a preview URL)
      if (compressedMain instanceof File) {
        submitData.append('main_image', compressedMain, compressedMain.name);
      }

      // Add additional images
      if (compressedAdditional.length > 0) {
        compressedAdditional.forEach((file, index) => {
          if (file instanceof File) {
            submitData.append(`images[${index}]`, file, file.name);
          }
        });
      }

      // Add logo
      if (compressedLogo instanceof File) {
        submitData.append('logo', compressedLogo, compressedLogo.name);
      }

      if (editAdvert?.id) {
        await eventsVenuesAPI.updateAdvert(editAdvert.id, submitData);
        alert('Advert updated successfully!');
      } else {
        await eventsVenuesAPI.createAdvert(submitData);
        alert('Advert created successfully!');
      }
      if (onSuccess) onSuccess();
      else if (onClose) onClose();
      else navigate('/events-venues');
    } catch (error) {
      console.error('Error creating advert:', error);
      if (error.response?.status === 413) {
        alert(
          'Upload too large for the server. Images were compressed automatically, but PHP may still be limiting uploads.\n\n' +
            'Restart the Laravel backend using serve.bat in the backend folder, or use smaller images (under 2 MB each).'
        );
      } else if (error.response?.data?.errors) {
        const errorMessages = Object.values(error.response.data.errors).flat().join('\n');
        alert(`Validation errors:\n${errorMessages}`);
      } else {
        alert('Failed to create advert. Please try again.');
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className={embedded ? 'bg-white rounded-2xl shadow-xl p-8 max-h-[85vh] overflow-y-auto' : 'min-h-screen bg-gradient-to-br from-purple-50 via-white to-blue-50 py-8 px-4'}>
      <div className={embedded ? '' : 'max-w-4xl mx-auto'}>
        <div className={embedded ? '' : 'bg-white rounded-2xl shadow-xl p-8'}>
          <h1 className="text-3xl font-bold text-gray-800 mb-2">
            {advertType === 'event' ? 'Post an Event' : 'Post a Venue'}
          </h1>
          <p className="text-gray-600 mb-8">
            Fill in the details below to {advertType === 'event' ? 'promote your event' : 'list your venue'} worldwide
          </p>

          {/* Toggle between Event and Venue */}
          <div className="flex gap-4 mb-8 p-1 bg-gray-100 rounded-lg">
            <button
              type="button"
              onClick={() => setAdvertType('event')}
              className={`flex-1 py-3 px-6 rounded-lg font-medium transition-all ${
                advertType === 'event'
                  ? 'bg-purple-600 text-white shadow-lg'
                  : 'text-gray-600 hover:bg-gray-200'
              }`}
            >
              <CalendarDays className="inline mr-2 h-5 w-5" />
              Event
            </button>
            <button
              type="button"
              onClick={() => setAdvertType('venue')}
              className={`flex-1 py-3 px-6 rounded-lg font-medium transition-all ${
                advertType === 'venue'
                  ? 'bg-blue-600 text-white shadow-lg'
                  : 'text-gray-600 hover:bg-gray-200'
              }`}
            >
              <Building2 className="inline mr-2 h-5 w-5" />
              Venue
            </button>
          </div>

          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Basic Information */}
            <div className="space-y-4">
              <h2 className="text-xl font-semibold text-gray-800 border-b pb-2">Basic Information</h2>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Title <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  name="title"
                  value={formData.title}
                  onChange={handleInputChange}
                  required
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                  placeholder={advertType === 'event' ? 'Event title' : 'Venue name'}
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Tagline
                </label>
                <input
                  type="text"
                  name="tagline"
                  value={formData.tagline}
                  onChange={handleInputChange}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                  placeholder="Short catchy tagline"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Short Description
                </label>
                <textarea
                  name="short_description"
                  value={formData.short_description}
                  onChange={handleInputChange}
                  rows={2}
                  maxLength={500}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                  placeholder="Brief description (max 500 characters)"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Full Description <span className="text-red-500">*</span>
                </label>
                <textarea
                  name="description"
                  value={formData.description}
                  onChange={handleInputChange}
                  rows={5}
                  required
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                  placeholder="Detailed description"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Category</label>
                <select
                  name="category_id"
                  value={formData.category_id}
                  onChange={handleInputChange}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                >
                  <option value="">Select category</option>
                  {categories.map(cat => (
                    <option key={cat.id} value={cat.id}>{cat.name}</option>
                  ))}
                </select>
              </div>
            </div>

            {/* Event-specific fields */}
            {advertType === 'event' && (
              <div className="space-y-4">
                <h2 className="text-xl font-semibold text-gray-800 border-b pb-2">Event Details</h2>
                
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Event Date <span className="text-red-500">*</span>
                    </label>
                    <input
                      type="date"
                      name="event_date"
                      value={formData.event_date}
                      onChange={handleInputChange}
                      required
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Event Time
                    </label>
                    <input
                      type="time"
                      name="event_time"
                      value={formData.event_time}
                      onChange={handleInputChange}
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      End Date
                    </label>
                    <input
                      type="date"
                      name="event_end_date"
                      value={formData.event_end_date}
                      onChange={handleInputChange}
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      End Time
                    </label>
                    <input
                      type="time"
                      name="event_end_time"
                      value={formData.event_end_time}
                      onChange={handleInputChange}
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Venue Name
                  </label>
                  <input
                    type="text"
                    name="venue_name"
                    value={formData.venue_name}
                    onChange={handleInputChange}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                    placeholder="Where will the event take place?"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Event Category <span className="text-red-500">*</span>
                  </label>
                  <select
                    name="event_category"
                    value={formData.event_category}
                    onChange={handleInputChange}
                    required
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                  >
                    <option value="">Select event category</option>
                    <option value="concerts">Concerts & Music</option>
                    <option value="conferences">Business Conferences</option>
                    <option value="workshops">Workshops</option>
                    <option value="festivals">Festivals</option>
                    <option value="parties">Parties & Nightlife</option>
                    <option value="sports">Sports Events</option>
                    <option value="cultural">Cultural Events</option>
                    <option value="food">Food & Drink</option>
                    <option value="charity">Charity Events</option>
                  </select>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Ticket Price
                    </label>
                    <div className="flex">
                      <input
                        type="number"
                        name="ticket_price"
                        value={formData.ticket_price}
                        onChange={handleInputChange}
                        step="0.01"
                        min="0"
                        className="flex-1 px-4 py-2 border border-gray-300 rounded-l-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                        placeholder="0.00"
                      />
                      <select
                        name="ticket_currency"
                        value={formData.ticket_currency}
                        onChange={handleInputChange}
                        className="px-4 py-2 border border-l-0 border-gray-300 rounded-r-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                      >
                        <option value="USD">USD</option>
                        <option value="EUR">EUR</option>
                        <option value="GBP">GBP</option>
                        <option value="CAD">CAD</option>
                        <option value="AUD">AUD</option>
                      </select>
                    </div>
                  </div>
                  <div className="flex items-center pt-6">
                    <label className="flex items-center cursor-pointer">
                      <input
                        type="checkbox"
                        name="free_event"
                        checked={formData.free_event}
                        onChange={handleInputChange}
                        className="w-5 h-5 text-purple-600 border-gray-300 rounded focus:ring-purple-500"
                      />
                      <span className="ml-2 text-sm text-gray-700">Free Event</span>
                    </label>
                  </div>
                </div>
              </div>
            )}

            {/* Venue-specific fields */}
            {advertType === 'venue' && (
              <div className="space-y-4">
                <h2 className="text-xl font-semibold text-gray-800 border-b pb-2">Venue Details</h2>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Venue Type <span className="text-red-500">*</span>
                  </label>
                  <select
                    name="venue_type"
                    value={formData.venue_type}
                    onChange={handleInputChange}
                    required
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                  >
                    <option value="">Select venue type</option>
                    <option value="wedding_venues">Wedding Venues</option>
                    <option value="conference_centres">Conference Centres</option>
                    <option value="party_halls">Party Halls</option>
                    <option value="outdoor_spaces">Outdoor Spaces</option>
                    <option value="hotels">Hotels & Banquet Rooms</option>
                    <option value="bars_restaurants">Bars & Restaurants</option>
                    <option value="community_halls">Community Halls</option>
                    <option value="exhibition_spaces">Exhibition Spaces</option>
                    <option value="meeting_rooms">Meeting Rooms</option>
                    <option value="sports_venues">Sports Venues</option>
                  </select>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Capacity
                    </label>
                    <input
                      type="number"
                      name="capacity"
                      value={formData.capacity}
                      onChange={handleInputChange}
                      min="1"
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                      placeholder="Number of people"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Price Range
                    </label>
                    <input
                      type="text"
                      name="price_range"
                      value={formData.price_range}
                      onChange={handleInputChange}
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                      placeholder="e.g., $500-$1000"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Amenities</label>
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-2">
                    {['Parking', 'WiFi', 'Catering', 'Audio/Visual', 'Air Conditioning', 'Wheelchair Accessible', 'Outdoor Space', 'Stage'].map(amenity => (
                      <label key={amenity} className="flex items-center p-2 border rounded-lg cursor-pointer hover:bg-gray-50">
                        <input
                          type="checkbox"
                          checked={amenities.includes(amenity)}
                          onChange={() => handleAmenityToggle(amenity)}
                          className="w-4 h-4 text-purple-600 border-gray-300 rounded focus:ring-purple-500"
                        />
                        <span className="ml-2 text-sm text-gray-700">{amenity}</span>
                      </label>
                    ))}
                  </div>
                </div>
              </div>
            )}

            {/* Location */}
            <div className="space-y-4">
              <h2 className="text-xl font-semibold text-gray-800 border-b pb-2">Location</h2>
              
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Country <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="text"
                    name="country"
                    value={formData.country}
                    onChange={handleInputChange}
                    required
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                    placeholder="Country"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    City <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="text"
                    name="city"
                    value={formData.city}
                    onChange={handleInputChange}
                    required
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                    placeholder="City"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">State</label>
                  <input
                    type="text"
                    name="state"
                    value={formData.state}
                    onChange={handleInputChange}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                    placeholder="State/Province"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Postal Code</label>
                  <input
                    type="text"
                    name="postal_code"
                    value={formData.postal_code}
                    onChange={handleInputChange}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                    placeholder="Postal Code"
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Address</label>
                <input
                  type="text"
                  name="address"
                  value={formData.address}
                  onChange={handleInputChange}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                  placeholder="Full address"
                />
              </div>
            </div>

            {/* Contact Information */}
            <div className="space-y-4">
              <h2 className="text-xl font-semibold text-gray-800 border-b pb-2">Contact Information</h2>
              
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Contact Name <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="text"
                    name="contact_name"
                    value={formData.contact_name}
                    onChange={handleInputChange}
                    required
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                    placeholder="Your name"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Email <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="email"
                    name="email"
                    value={formData.email}
                    onChange={handleInputChange}
                    required
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                    placeholder="your@email.com"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Phone</label>
                  <input
                    type="tel"
                    name="phone"
                    value={formData.phone}
                    onChange={handleInputChange}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                    placeholder="+1 234 567 890"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Website</label>
                  <input
                    type="url"
                    name="website"
                    value={formData.website}
                    onChange={handleInputChange}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                    placeholder="https://yourwebsite.com"
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Business Name</label>
                <input
                  type="text"
                  name="business_name"
                  value={formData.business_name}
                  onChange={handleInputChange}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                  placeholder="Your business name"
                />
              </div>
            </div>

            {/* Media */}
            <div className="space-y-4">
              <h2 className="text-xl font-semibold text-gray-800 border-b pb-2">Media</h2>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Main Image <span className="text-red-500">*</span>
                  <span className="text-gray-500 font-normal ml-1">(max 10 MB, JPG/PNG/GIF/WebP)</span>
                </label>
                <div className="border-2 border-dashed border-gray-300 rounded-lg p-6 text-center">
                  {mainImagePreview ? (
                    <div className="relative">
                      <img src={mainImagePreview} alt="Preview" className="max-h-64 mx-auto rounded-lg" />
                      <button
                        type="button"
                        onClick={() => {
                          setMainImagePreview(null);
                          setMainImageFile(null);
                        }}
                        className="absolute top-2 right-2 bg-red-500 text-white p-1 rounded-full"
                      >
                        <X className="h-4 w-4" />
                      </button>
                    </div>
                  ) : (
                    <div>
                      <ImageIcon className="h-12 w-12 text-gray-400 mx-auto mb-2" />
                      <p className="text-gray-600 mb-2">Click or drag to upload main image</p>
                      <p className="text-xs text-gray-500 mb-2">Large photos are compressed automatically before upload</p>
                      <input
                        type="file"
                        onChange={handleMainImageUpload}
                        accept="image/*"
                        className="hidden"
                        id="main-image-input"
                      />
                      <label
                        htmlFor="main-image-input"
                        className="inline-flex items-center px-4 py-2 bg-purple-600 text-white rounded-lg cursor-pointer hover:bg-purple-700"
                      >
                        Choose File
                      </label>
                    </div>
                  )}
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Additional Images</label>
                <div className="border-2 border-dashed border-gray-300 rounded-lg p-6 text-center">
                  <input
                    type="file"
                    onChange={handleAdditionalImagesUpload}
                    accept="image/*"
                    multiple
                    className="hidden"
                    id="additional-images-input"
                  />
                  <label
                    htmlFor="additional-images-input"
                    className="inline-flex items-center px-4 py-2 bg-blue-600 text-white rounded-lg cursor-pointer hover:bg-blue-700"
                  >
                    Add More Images
                  </label>
                  {additionalImagePreviews.length > 0 && (
                    <div className="mt-4 grid grid-cols-4 gap-2">
                      {additionalImagePreviews.map((url, index) => (
                        <div key={index} className="relative">
                          <img src={url} alt={`Preview ${index + 1}`} className="h-20 w-full object-cover rounded" />
                          <button
                            type="button"
                            onClick={() => {
                              const newPreviews = [...additionalImagePreviews];
                              const newFiles = [...additionalImageFiles];
                              newPreviews.splice(index, 1);
                              newFiles.splice(index, 1);
                              setAdditionalImagePreviews(newPreviews);
                              setAdditionalImageFiles(newFiles);
                            }}
                            className="absolute top-0 right-0 bg-red-500 text-white p-1 rounded-full"
                          >
                            <X className="h-3 w-3" />
                          </button>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Logo</label>
                <div className="border-2 border-dashed border-gray-300 rounded-lg p-4 text-center">
                  {logoPreview ? (
                    <div className="relative inline-block">
                      <img src={logoPreview} alt="Logo Preview" className="h-16 w-auto" />
                      <button
                        type="button"
                        onClick={() => {
                          setLogoPreview(null);
                          setLogoFile(null);
                        }}
                        className="absolute -top-2 -right-2 bg-red-500 text-white p-1 rounded-full"
                      >
                        <X className="h-3 w-3" />
                      </button>
                    </div>
                  ) : (
                    <div>
                      <input
                        type="file"
                        onChange={handleLogoUpload}
                        accept="image/*"
                        className="hidden"
                        id="logo-input"
                      />
                      <label
                        htmlFor="logo-input"
                        className="inline-flex items-center px-3 py-1 bg-gray-600 text-white rounded cursor-pointer hover:bg-gray-700 text-sm"
                      >
                        Upload Logo
                      </label>
                    </div>
                  )}
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Video URL</label>
                <input
                  type="url"
                  name="video_url"
                  value={formData.video_url}
                  onChange={handleInputChange}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                  placeholder="https://youtube.com/watch?v=..."
                />
              </div>
            </div>

            {/* Additional Details */}
            <div className="space-y-4">
              <h2 className="text-xl font-semibold text-gray-800 border-b pb-2">Additional Details</h2>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Key Features</label>
                <textarea
                  name="key_features"
                  value={formData.key_features.join('\n')}
                  onChange={handleKeyFeaturesChange}
                  rows={4}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                  placeholder="Enter each feature on a new line"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Additional Notes</label>
                <textarea
                  name="additional_notes"
                  value={formData.additional_notes}
                  onChange={handleInputChange}
                  rows={3}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                  placeholder="Any additional information"
                />
              </div>

              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                <label className="flex items-center cursor-pointer">
                  <input
                    type="checkbox"
                    name="indoor_outdoor"
                    checked={formData.indoor_outdoor}
                    onChange={handleInputChange}
                    className="w-5 h-5 text-purple-600 border-gray-300 rounded focus:ring-purple-500"
                  />
                  <span className="ml-2 text-sm text-gray-700">Indoor</span>
                </label>
                <label className="flex items-center cursor-pointer">
                  <input
                    type="checkbox"
                    name="family_friendly"
                    checked={formData.family_friendly}
                    onChange={handleInputChange}
                    className="w-5 h-5 text-purple-600 border-gray-300 rounded focus:ring-purple-500"
                  />
                  <span className="ml-2 text-sm text-gray-700">Family Friendly</span>
                </label>
                <label className="flex items-center cursor-pointer">
                  <input
                    type="checkbox"
                    name="catering_available"
                    checked={formData.catering_available}
                    onChange={handleInputChange}
                    className="w-5 h-5 text-purple-600 border-gray-300 rounded focus:ring-purple-500"
                  />
                  <span className="ml-2 text-sm text-gray-700">Catering Available</span>
                </label>
                <label className="flex items-center cursor-pointer">
                  <input
                    type="checkbox"
                    name="parking_available"
                    checked={formData.parking_available}
                    onChange={handleInputChange}
                    className="w-5 h-5 text-purple-600 border-gray-300 rounded focus:ring-purple-500"
                  />
                  <span className="ml-2 text-sm text-gray-700">Parking Available</span>
                </label>
              </div>
            </div>

            {/* Promotion Tier */}
            <div className="space-y-4">
              <h2 className="text-xl font-semibold text-gray-800 border-b pb-2">Promotion Tier</h2>
              
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {promotionTiers.map(tier => (
                  <div
                    key={tier.name}
                    onClick={() => {
                      setSelectedPromotionTier(tier.name);
                      setFormData(prev => ({ ...prev, promotion_tier: tier.name }));
                    }}
                    className={`p-4 border-2 rounded-lg cursor-pointer transition-all ${
                      selectedPromotionTier === tier.name
                        ? 'border-purple-500 bg-purple-50'
                        : 'border-gray-200 hover:border-gray-300'
                    }`}
                  >
                    <div className="flex justify-between items-start mb-2">
                      <h3 className="font-semibold text-gray-800">{tier.display_name}</h3>
                      {tier.price > 0 && (
                        <span className="text-purple-600 font-bold">${tier.price}</span>
                      )}
                    </div>
                    <ul className="text-sm text-gray-600 space-y-1">
                      {tier.features.map((feature, index) => (
                        <li key={index} className="flex items-center">
                          <Check className="h-4 w-4 text-green-500 mr-2" />
                          {feature}
                        </li>
                      ))}
                    </ul>
                  </div>
                ))}
              </div>
            </div>

            {/* Terms */}
            <div className="space-y-3">
              <label className="flex items-start cursor-pointer">
                <input
                  type="checkbox"
                  name="terms_accepted"
                  checked={formData.terms_accepted}
                  onChange={handleInputChange}
                  required
                  className="w-5 h-5 mt-0.5 text-purple-600 border-gray-300 rounded focus:ring-purple-500"
                />
                <span className="ml-2 text-sm text-gray-700">
                  I accept the Terms of Service and Privacy Policy <span className="text-red-500">*</span>
                </span>
              </label>
              
              <label className="flex items-start cursor-pointer">
                <input
                  type="checkbox"
                  name="accurate_info"
                  checked={formData.accurate_info}
                  onChange={handleInputChange}
                  required
                  className="w-5 h-5 mt-0.5 text-purple-600 border-gray-300 rounded focus:ring-purple-500"
                />
                <span className="ml-2 text-sm text-gray-700">
                  I confirm that all information provided is accurate <span className="text-red-500">*</span>
                </span>
              </label>
            </div>

            {/* Submit Button */}
            <div className="flex gap-4">
              <button
                type="submit"
                disabled={loading}
                className="flex-1 bg-gradient-to-r from-purple-600 to-blue-600 text-white py-3 px-6 rounded-lg font-semibold hover:from-purple-700 hover:to-blue-700 transition-all disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {loading ? 'Creating...' : `Create ${advertType === 'event' ? 'Event' : 'Venue'}`}
              </button>
              <button
                type="button"
                onClick={() => (onClose ? onClose() : navigate('/events-venues'))}
                className="px-6 py-3 border border-gray-300 rounded-lg font-semibold hover:bg-gray-50 transition-all"
              >
                Cancel
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default EventsVenuesPostForm;
