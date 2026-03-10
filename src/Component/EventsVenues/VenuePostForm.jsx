import React, { useState } from 'react';
import { X, Upload, MapPin, Users, DollarSign, Wifi, Car, Utensils, Shield, Clock, Check, ChevronRight } from 'lucide-react';

const VenuePostForm = ({ isOpen, onClose }) => {
  const [formData, setFormData] = useState({
    name: '',
    venueType: '',
    country: '',
    city: '',
    capacity: '',
    priceRange: '',
    description: '',
    amenities: [],
    indoorOutdoor: '',
    accessibility: [],
    openingHours: {
      monday: '',
      tuesday: '',
      wednesday: '',
      thursday: '',
      friday: '',
      saturday: '',
      sunday: ''
    },
    contactEmail: '',
    bookingLink: '',
    socialLinks: {
      facebook: '',
      twitter: '',
      instagram: '',
      website: ''
    }
  });

  const [selectedPromotion, setSelectedPromotion] = useState('');
  const [uploadedFiles, setUploadedFiles] = useState({
    images: [],
    floorPlan: null,
    videoTour: null
  });

  const [currentStep, setCurrentStep] = useState(1);
  const totalSteps = 4;

  const promotionTiers = [
    {
      id: 'basic',
      name: 'Basic Listing',
      price: 'Free',
      duration: '30 days',
      features: [
        'Standard placement in search results',
        'Basic venue information display',
        'Contact form access',
        '7-day customer support'
      ],
      badge: 'Standard',
      color: 'from-gray-500 to-gray-600'
    },
    {
      id: 'promoted',
      name: 'Promoted Listing',
      price: '$39',
      duration: '30 days',
      features: [
        'Enhanced visibility in search results',
        'Promoted badge on listing',
        'Priority placement for 7 days',
        'Social media promotion',
        'Detailed analytics dashboard',
        '24/7 customer support'
      ],
      badge: 'Promoted',
      color: 'from-teal-500 to-teal-600',
      popular: false
    },
    {
      id: 'featured',
      name: 'Featured Listing',
      price: '$69',
      duration: '30 days',
      features: [
        'Top placement in search results',
        'Featured badge on listing',
        'Homepage showcase for 14 days',
        'Email newsletter promotion',
        'Advanced analytics & insights',
        'Priority customer support',
        'Booking management tools'
      ],
      badge: 'Featured',
      color: 'from-blue-500 to-blue-600',
      popular: true
    },
    {
      id: 'sponsored',
      name: 'Sponsored Listing',
      price: '$129',
      duration: '30 days',
      features: [
        'Premium placement across platform',
        'Sponsored badge on listing',
        'Homepage banner for 30 days',
        'Social media campaign',
        'Email blast to subscribers',
        'Premium analytics suite',
        'Dedicated account manager',
        'Full marketing package',
        'Priority booking support'
      ],
      badge: 'Sponsored',
      color: 'from-amber-500 to-amber-600',
      popular: false
    }
  ];

  const amenityOptions = [
    'WiFi Available',
    'Parking Available',
    'Catering Service',
    'AV Equipment',
    'Air Conditioning',
    'Outdoor Space',
    'Indoor Space',
    'Wheelchair Accessible',
    'Public Transport',
    'Security',
    'Bar Service',
    'Stage',
    'Sound System',
    'Lighting Equipment'
  ];

  const accessibilityOptions = [
    'Wheelchair Accessible',
    'Elevator Access',
    'Accessible Restrooms',
    'Parking Access',
    'Assistance Available',
    'Braille Signage',
    'Hearing Loop System'
  ];

  const handleInputChange = (field, value) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const handleAmenityToggle = (amenity) => {
    setFormData(prev => ({
      ...prev,
      amenities: prev.amenities.includes(amenity)
        ? prev.amenities.filter(a => a !== amenity)
        : [...prev.amenities, amenity]
    }));
  };

  const handleAccessibilityToggle = (accessibility) => {
    setFormData(prev => ({
      ...prev,
      accessibility: prev.accessibility.includes(accessibility)
        ? prev.accessibility.filter(a => a !== accessibility)
        : [...prev.accessibility, accessibility]
    }));
  };

  const handleOpeningHoursChange = (day, value) => {
    setFormData(prev => ({
      ...prev,
      openingHours: {
        ...prev.openingHours,
        [day]: value
      }
    }));
  };

  const handleFileUpload = (type, files) => {
    if (type === 'images') {
      setUploadedFiles(prev => ({ ...prev, images: [...prev.images, ...files] }));
    } else if (type === 'floorPlan') {
      setUploadedFiles(prev => ({ ...prev, floorPlan: files[0] }));
    } else if (type === 'videoTour') {
      setUploadedFiles(prev => ({ ...prev, videoTour: files[0] }));
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    // Handle form submission
    console.log('Form submitted:', { formData, selectedPromotion, uploadedFiles });
    alert('Venue posted successfully!');
    onClose();
  };

  const nextStep = () => {
    if (currentStep < totalSteps) {
      setCurrentStep(currentStep + 1);
    }
  };

  const prevStep = () => {
    if (currentStep > 1) {
      setCurrentStep(currentStep - 1);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 z-50 overflow-y-auto">
      <div className="min-h-screen px-4 text-center">
        <div className="inline-block w-full max-w-4xl my-8 text-left align-middle transition-all transform bg-white shadow-xl rounded-2xl">
          
          {/* Header */}
          <div className="bg-gradient-to-r from-teal-600 to-teal-700 px-6 py-4 rounded-t-2xl">
            <div className="flex items-center justify-between">
              <h2 className="text-2xl font-bold text-white">Post Your Venue</h2>
              <button
                onClick={onClose}
                className="text-white hover:text-gray-200 transition-colors"
              >
                <X className="w-6 h-6" />
              </button>
            </div>
            
            {/* Progress Bar */}
            <div className="mt-4">
              <div className="flex items-center justify-between mb-2">
                <span className="text-sm text-teal-200">Step {currentStep} of {totalSteps}</span>
                <span className="text-sm text-teal-200">
                  {currentStep === 1 && 'Basic Information'}
                  {currentStep === 2 && 'Venue Details'}
                  {currentStep === 3 && 'Media & Features'}
                  {currentStep === 3 && 'Promotion'}
                  {currentStep === 4 && 'Confirmation'}
                </span>
              </div>
              <div className="w-full bg-teal-800 rounded-full h-2">
                <div 
                  className="bg-white h-2 rounded-full transition-all duration-300"
                  style={{ width: `${(currentStep / totalSteps) * 100}%` }}
                ></div>
              </div>
            </div>
          </div>

          {/* Form Content */}
          <form onSubmit={handleSubmit} className="p-6">
            {/* Step 1: Basic Information */}
            {currentStep === 1 && (
              <div className="space-y-6">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Venue Name *
                  </label>
                  <input
                    type="text"
                    value={formData.name}
                    onChange={(e) => handleInputChange('name', e.target.value)}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-teal-500 focus:border-transparent"
                    placeholder="Enter your venue name"
                    required
                  />
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Venue Type *
                    </label>
                    <select
                      value={formData.venueType}
                      onChange={(e) => handleInputChange('venueType', e.target.value)}
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-teal-500 focus:border-transparent"
                      required
                    >
                      <option value="">Select a venue type</option>
                      <option value="wedding-venues">Wedding Venues</option>
                      <option value="conference-centres">Conference Centres</option>
                      <option value="party-halls">Party Halls</option>
                      <option value="outdoor-spaces">Outdoor Spaces</option>
                      <option value="hotels-banquet">Hotels & Banquet Rooms</option>
                      <option value="bars-restaurants">Bars & Restaurants</option>
                      <option value="meeting-rooms">Meeting Rooms</option>
                      <option value="exhibition-spaces">Exhibition Spaces</option>
                      <option value="sports-venues">Sports Venues</option>
                    </select>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Capacity *
                    </label>
                    <input
                      type="number"
                      value={formData.capacity}
                      onChange={(e) => handleInputChange('capacity', e.target.value)}
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-teal-500 focus:border-transparent"
                      placeholder="Maximum number of guests"
                      required
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Country *
                    </label>
                    <input
                      type="text"
                      value={formData.country}
                      onChange={(e) => handleInputChange('country', e.target.value)}
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-teal-500 focus:border-transparent"
                      placeholder="Country"
                      required
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      City *
                    </label>
                    <input
                      type="text"
                      value={formData.city}
                      onChange={(e) => handleInputChange('city', e.target.value)}
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-teal-500 focus:border-transparent"
                      placeholder="City"
                      required
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Price Range *
                  </label>
                  <input
                    type="text"
                    value={formData.priceRange}
                    onChange={(e) => handleInputChange('priceRange', e.target.value)}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-teal-500 focus:border-transparent"
                    placeholder="e.g., $1,000 - $5,000 per event"
                    required
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Venue Description *
                  </label>
                  <textarea
                    value={formData.description}
                    onChange={(e) => handleInputChange('description', e.target.value)}
                    rows={6}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-teal-500 focus:border-transparent"
                    placeholder="Describe your venue in detail..."
                    required
                  />
                </div>
              </div>
            )}

            {/* Step 2: Venue Details */}
            {currentStep === 2 && (
              <div className="space-y-6">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Indoor / Outdoor
                  </label>
                  <div className="grid grid-cols-3 gap-4">
                    <label className="flex items-center cursor-pointer">
                      <input
                        type="radio"
                        value="indoor"
                        checked={formData.indoorOutdoor === 'indoor'}
                        onChange={(e) => handleInputChange('indoorOutdoor', e.target.value)}
                        className="mr-2"
                      />
                      <span>Indoor Only</span>
                    </label>
                    <label className="flex items-center cursor-pointer">
                      <input
                        type="radio"
                        value="outdoor"
                        checked={formData.indoorOutdoor === 'outdoor'}
                        onChange={(e) => handleInputChange('indoorOutdoor', e.target.value)}
                        className="mr-2"
                      />
                      <span>Outdoor Only</span>
                    </label>
                    <label className="flex items-center cursor-pointer">
                      <input
                        type="radio"
                        value="both"
                        checked={formData.indoorOutdoor === 'both'}
                        onChange={(e) => handleInputChange('indoorOutdoor', e.target.value)}
                        className="mr-2"
                      />
                      <span>Both</span>
                    </label>
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Amenities
                  </label>
                  <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
                    {amenityOptions.map((amenity) => (
                      <label key={amenity} className="flex items-center cursor-pointer">
                        <input
                          type="checkbox"
                          checked={formData.amenities.includes(amenity)}
                          onChange={() => handleAmenityToggle(amenity)}
                          className="mr-2"
                        />
                        <span className="text-sm text-gray-700">{amenity}</span>
                      </label>
                    ))}
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Accessibility Features
                  </label>
                  <div className="grid grid-cols-2 gap-3">
                    {accessibilityOptions.map((accessibility) => (
                      <label key={accessibility} className="flex items-center cursor-pointer">
                        <input
                          type="checkbox"
                          checked={formData.accessibility.includes(accessibility)}
                          onChange={() => handleAccessibilityToggle(accessibility)}
                          className="mr-2"
                        />
                        <span className="text-sm text-gray-700">{accessibility}</span>
                      </label>
                    ))}
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Opening Hours
                  </label>
                  <div className="space-y-2">
                    {Object.keys(formData.openingHours).map((day) => (
                      <div key={day} className="flex items-center space-x-4">
                        <label className="w-24 text-sm font-medium text-gray-700 capitalize">
                          {day}:
                        </label>
                        <input
                          type="text"
                          value={formData.openingHours[day]}
                          onChange={(e) => handleOpeningHoursChange(day, e.target.value)}
                          className="flex-1 px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-teal-500 focus:border-transparent"
                          placeholder="e.g., 9:00 AM - 10:00 PM"
                        />
                      </div>
                    ))}
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Contact Email *
                    </label>
                    <input
                      type="email"
                      value={formData.contactEmail}
                      onChange={(e) => handleInputChange('contactEmail', e.target.value)}
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-teal-500 focus:border-transparent"
                      placeholder="contact@venue.com"
                      required
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Booking Link
                    </label>
                    <input
                      type="url"
                      value={formData.bookingLink}
                      onChange={(e) => handleInputChange('bookingLink', e.target.value)}
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-teal-500 focus:border-transparent"
                      placeholder="https://booking-venue.com"
                    />
                  </div>
                </div>
              </div>
            )}

            {/* Step 3: Media & Features */}
            {currentStep === 3 && (
              <div className="space-y-6">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Upload Venue Images
                  </label>
                  <div className="border-2 border-dashed border-gray-300 rounded-lg p-6 text-center hover:border-teal-500 transition-colors">
                    <Upload className="w-12 h-12 text-gray-400 mx-auto mb-4" />
                    <p className="text-sm text-gray-600 mb-2">Click to upload or drag and drop</p>
                    <p className="text-xs text-gray-500">PNG, JPG up to 10MB (Multiple files allowed)</p>
                    <input
                      type="file"
                      accept="image/*"
                      multiple
                      onChange={(e) => handleFileUpload('images', e.target.files)}
                      className="hidden"
                    />
                  </div>
                  {uploadedFiles.images.length > 0 && (
                    <div className="mt-4">
                      <p className="text-sm text-gray-600 mb-2">
                        {uploadedFiles.images.length} image(s) selected
                      </p>
                    </div>
                  )}
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Upload Floor Plan
                  </label>
                  <div className="border-2 border-dashed border-gray-300 rounded-lg p-6 text-center hover:border-teal-500 transition-colors">
                    <Upload className="w-12 h-12 text-gray-400 mx-auto mb-4" />
                    <p className="text-sm text-gray-600 mb-2">Click to upload floor plan</p>
                    <p className="text-xs text-gray-500">PDF, PNG, JPG up to 5MB</p>
                    <input
                      type="file"
                      accept=".pdf,image/*"
                      onChange={(e) => handleFileUpload('floorPlan', e.target.files)}
                      className="hidden"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Upload Video Tour
                  </label>
                  <div className="border-2 border-dashed border-gray-300 rounded-lg p-6 text-center hover:border-teal-500 transition-colors">
                    <Upload className="w-12 h-12 text-gray-400 mx-auto mb-4" />
                    <p className="text-sm text-gray-600 mb-2">Click to upload video tour</p>
                    <p className="text-xs text-gray-500">MP4, MOV up to 100MB</p>
                    <input
                      type="file"
                      accept="video/*"
                      onChange={(e) => handleFileUpload('videoTour', e.target.files)}
                      className="hidden"
                    />
                  </div>
                </div>
              </div>
            )}

            {/* Step 4: Promotion */}
            {currentStep === 3 && (
              <div className="space-y-6">
                <div className="text-center mb-8">
                  <h3 className="text-2xl font-bold text-gray-900 mb-2">Choose Your Promotion Package</h3>
                  <p className="text-gray-600">Boost your venue visibility and attract more bookings</p>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {promotionTiers.map((tier) => (
                    <div
                      key={tier.id}
                      className={`relative bg-white border-2 rounded-2xl p-6 cursor-pointer transition-all duration-300 ${
                        selectedPromotion === tier.id
                          ? 'border-teal-500 shadow-lg scale-105'
                          : 'border-gray-200 hover:border-gray-300'
                      }`}
                      onClick={() => setSelectedPromotion(tier.id)}
                    >
                      {tier.popular && (
                        <div className="absolute -top-3 left-1/2 transform -translate-x-1/2">
                          <span className="bg-teal-600 text-white px-3 py-1 rounded-full text-xs font-semibold">
                            Most Popular
                          </span>
                        </div>
                      )}

                      <div className="text-center mb-6">
                        <h4 className="text-xl font-bold text-gray-900 mb-2">{tier.name}</h4>
                        <div className="flex items-baseline justify-center space-x-1">
                          <span className="text-3xl font-bold text-gray-900">{tier.price}</span>
                          <span className="text-gray-600">/{tier.duration}</span>
                        </div>
                      </div>

                      <div className="space-y-3 mb-6">
                        {tier.features.map((feature, index) => (
                          <div key={index} className="flex items-start space-x-2">
                            <Check className="w-5 h-5 text-green-500 flex-shrink-0 mt-0.5" />
                            <span className="text-sm text-gray-700">{feature}</span>
                          </div>
                        ))}
                      </div>

                      <div className={`w-full py-2 rounded-lg text-center font-medium transition-colors ${
                        selectedPromotion === tier.id
                          ? 'bg-teal-600 text-white'
                          : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                      }`}>
                        {selectedPromotion === tier.id ? 'Selected' : 'Select Package'}
                      </div>
                    </div>
                  ))}
                </div>

                {/* Comparison Table */}
                <div className="mt-8 overflow-x-auto">
                  <table className="w-full border-collapse">
                    <thead>
                      <tr className="border-b">
                        <th className="text-left py-3 px-4 text-sm font-medium text-gray-700">Features</th>
                        <th className="text-center py-3 px-4 text-sm font-medium text-gray-700">Basic</th>
                        <th className="text-center py-3 px-4 text-sm font-medium text-gray-700">Promoted</th>
                        <th className="text-center py-3 px-4 text-sm font-medium text-teal-600">Featured</th>
                        <th className="text-center py-3 px-4 text-sm font-medium text-gray-700">Sponsored</th>
                      </tr>
                    </thead>
                    <tbody>
                      <tr className="border-b">
                        <td className="py-3 px-4 text-sm text-gray-700">Search Placement</td>
                        <td className="py-3 px-4 text-center text-sm">Standard</td>
                        <td className="py-3 px-4 text-center text-sm">Enhanced</td>
                        <td className="py-3 px-4 text-center text-sm font-medium">Top Priority</td>
                        <td className="py-3 px-4 text-center text-sm font-medium">Premium</td>
                      </tr>
                      <tr className="border-b">
                        <td className="py-3 px-4 text-sm text-gray-700">Homepage Showcase</td>
                        <td className="py-3 px-4 text-center text-sm">-</td>
                        <td className="py-3 px-4 text-center text-sm">-</td>
                        <td className="py-3 px-4 text-center text-sm font-medium">14 days</td>
                        <td className="py-3 px-4 text-center text-sm font-medium">30 days</td>
                      </tr>
                      <tr className="border-b">
                        <td className="py-3 px-4 text-sm text-gray-700">Social Media Promotion</td>
                        <td className="py-3 px-4 text-center text-sm">-</td>
                        <td className="py-3 px-4 text-center text-sm">Basic</td>
                        <td className="py-3 px-4 text-center text-sm font-medium">Advanced</td>
                        <td className="py-3 px-4 text-center text-sm font-medium">Campaign</td>
                      </tr>
                    </tbody>
                  </table>
                </div>
              </div>
            )}

            {/* Step 4: Confirmation */}
            {currentStep === 4 && (
              <div className="space-y-6">
                <div className="text-center">
                  <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
                    <Check className="w-8 h-8 text-green-600" />
                  </div>
                  <h3 className="text-2xl font-bold text-gray-900 mb-2">Review Your Venue</h3>
                  <p className="text-gray-600">Please review your venue details before submission</p>
                </div>

                <div className="bg-gray-50 rounded-lg p-6 space-y-4">
                  <div>
                    <h4 className="font-medium text-gray-900 mb-2">Venue Details</h4>
                    <div className="grid grid-cols-2 gap-4 text-sm">
                      <div>
                        <span className="text-gray-600">Name:</span>
                        <span className="ml-2 text-gray-900">{formData.name}</span>
                      </div>
                      <div>
                        <span className="text-gray-600">Type:</span>
                        <span className="ml-2 text-gray-900">{formData.venueType}</span>
                      </div>
                      <div>
                        <span className="text-gray-600">Capacity:</span>
                        <span className="ml-2 text-gray-900">{formData.capacity} guests</span>
                      </div>
                      <div>
                        <span className="text-gray-600">Price Range:</span>
                        <span className="ml-2 text-gray-900">{formData.priceRange}</span>
                      </div>
                      <div>
                        <span className="text-gray-600">Location:</span>
                        <span className="ml-2 text-gray-900">{formData.city}, {formData.country}</span>
                      </div>
                      <div>
                        <span className="text-gray-600">Type:</span>
                        <span className="ml-2 text-gray-900 capitalize">{formData.indoorOutdoor}</span>
                      </div>
                    </div>
                  </div>

                  {formData.amenities.length > 0 && (
                    <div>
                      <h4 className="font-medium text-gray-900 mb-2">Amenities</h4>
                      <div className="flex flex-wrap gap-2">
                        {formData.amenities.map((amenity) => (
                          <span key={amenity} className="px-2 py-1 bg-teal-100 text-teal-700 rounded-full text-xs">
                            {amenity}
                          </span>
                        ))}
                      </div>
                    </div>
                  )}

                  {selectedPromotion && (
                    <div>
                      <h4 className="font-medium text-gray-900 mb-2">Promotion Package</h4>
                      <div className="text-sm">
                        <span className="text-gray-600">Package:</span>
                        <span className="ml-2 text-gray-900">
                          {promotionTiers.find(t => t.id === selectedPromotion)?.name}
                        </span>
                        <span className="ml-2 text-teal-600 font-medium">
                          ({promotionTiers.find(t => t.id === selectedPromotion)?.price})
                        </span>
                      </div>
                    </div>
                  )}
                </div>

                <div className="space-y-4">
                  <label className="flex items-start space-x-3 cursor-pointer">
                    <input
                      type="checkbox"
                      className="mt-1 w-4 h-4 text-teal-600 border-gray-300 rounded focus:ring-teal-500"
                      required
                    />
                    <span className="text-sm text-gray-700">
                      I confirm that all information provided is accurate and truthful
                    </span>
                  </label>

                  <label className="flex items-start space-x-3 cursor-pointer">
                    <input
                      type="checkbox"
                      className="mt-1 w-4 h-4 text-teal-600 border-gray-300 rounded focus:ring-teal-500"
                      required
                    />
                    <span className="text-sm text-gray-700">
                      I agree to the Terms of Service and Community Guidelines
                    </span>
                  </label>
                </div>
              </div>
            )}

            {/* Navigation Buttons */}
            <div className="flex justify-between mt-8">
              <button
                type="button"
                onClick={prevStep}
                disabled={currentStep === 1}
                className="px-6 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
              >
                Previous
              </button>

              {currentStep < totalSteps ? (
                <button
                  type="button"
                  onClick={nextStep}
                  className="px-6 py-2 bg-teal-600 text-white rounded-lg hover:bg-teal-700 transition-colors flex items-center space-x-2"
                >
                  <span>Next</span>
                  <ChevronRight className="w-4 h-4" />
                </button>
              ) : (
                <button
                  type="submit"
                  className="px-6 py-2 bg-teal-600 text-white rounded-lg hover:bg-teal-700 transition-colors"
                >
                  Submit Venue
                </button>
              )}
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default VenuePostForm;
