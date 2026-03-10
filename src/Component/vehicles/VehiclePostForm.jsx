import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ArrowLeft, ArrowRight, Check, X, Upload, MapPin, DollarSign, Star, Shield, Zap, Crown, Gem, Clock, Calendar } from 'lucide-react';

const VehiclePostForm = ({ onClose }) => {
  const [currentStep, setCurrentStep] = useState(1);
  const [formData, setFormData] = useState({
    // Section 1: Advert Type
    advertType: '',
    
    // Section 2: Basic Information
    title: '',
    tagline: '',
    vehicleType: '',
    make: '',
    model: '',
    year: '',
    mileage: '',
    fuelType: '',
    transmission: '',
    condition: '',
    category: 'sale',
    price: '',
    
    // Section 3: Media
    mainImage: null,
    additionalImages: [],
    videoUrl: '',
    
    // Section 4: Specifications
    specifications: {
      engineSize: '',
      doors: '',
      seats: '',
      colour: '',
      roadTax: '',
      motExpiry: '',
      serviceHistory: '',
      previousOwners: '',
      payload: '',
      axles: '',
      bodyType: '',
      emissionClass: '',
      engineType: '',
      length: '',
      capacity: '',
      trailerIncluded: '',
      serviceArea: '',
      operatingHours: '',
      passengerCapacity: '',
      luggageCapacity: '',
      airportPickup: false
    },
    
    // Section 5: Description
    overview: '',
    keyFeatures: '',
    vehicleCondition: '',
    additionalNotes: '',
    
    // Section 6: Seller Information
    sellerName: '',
    businessName: '',
    phone: '',
    email: '',
    website: '',
    socialLinks: '',
    logo: null,
    verifiedSeller: false,
    
    // Section 7: Location
    location: {
      address: '',
      city: '',
      country: '',
      coordinates: { lat: '', lng: '' },
      privacyMode: false
    },
    
    // Section 8: Premium Upsell
    promotionTier: 'basic',
    
    // Section 9: Final Submission
    termsAccepted: false,
    accuracyConfirmed: false
  });

  const totalSteps = 9;
  const progressPercentage = (currentStep / totalSteps) * 100;

  const advertTypes = [
    { value: 'sale', label: 'Vehicle for Sale', icon: DollarSign, description: 'Sell your vehicle to interested buyers' },
    { value: 'hire', label: 'Vehicle for Hire', icon: Clock, description: 'Rent out your vehicle for short term use' },
    { value: 'lease', label: 'Vehicle for Lease', icon: Calendar, description: 'Long term leasing options available' },
    { value: 'transport', label: 'Transport Service', icon: MapPin, description: 'Offer taxi, chauffeur, or shuttle services' }
  ];

  const vehicleTypes = [
    'Cars', 'Vans', 'Motorbikes', 'Trucks & Lorries', 'Buses & Coaches', 'Electric Vehicles',
    'Classic Cars', 'Luxury & Exotic Cars', 'Caravans & Motorhomes', 'Boats & Jet Skis',
    'Agricultural Vehicles', 'Construction Vehicles'
  ];

  const makes = ['Toyota', 'Honda', 'Ford', 'BMW', 'Mercedes-Benz', 'Audi', 'Volkswagen', 'Nissan', 'Hyundai', 'Kia'];
  const fuelTypes = ['Petrol', 'Diesel', 'Electric', 'Hybrid', 'LPG', 'Hydrogen'];
  const transmissions = ['Manual', 'Automatic', 'Semi-Automatic', 'CVT'];
  const conditions = ['New', 'Excellent', 'Very Good', 'Good', 'Fair'];

  const promotionTiers = [
    {
      id: 'basic',
      name: 'Basic Listing',
      price: 0,
      duration: '30 days',
      features: ['Standard visibility', 'Basic listing details', 'Contact seller option'],
      badge: null,
      popular: false
    },
    {
      id: 'promoted',
      name: 'Promoted',
      price: 29,
      duration: '30 days',
      features: ['Enhanced visibility', 'Promoted badge', 'Priority placement', 'Basic analytics'],
      badge: { icon: Star, color: 'text-amber-600', bg: 'bg-amber-100' },
      popular: false
    },
    {
      id: 'featured',
      name: 'Featured',
      price: 79,
      duration: '30 days',
      features: ['Premium visibility', 'Featured badge', 'Top placement', 'Advanced analytics', 'Social media promotion'],
      badge: { icon: Zap, color: 'text-red-600', bg: 'bg-red-100' },
      popular: true
    },
    {
      id: 'sponsored',
      name: 'Sponsored',
      price: 199,
      duration: '30 days',
      features: ['Maximum visibility', 'Sponsored badge', 'Top of category', 'Premium analytics', 'Full promotion package', 'Dedicated support'],
      badge: { icon: Crown, color: 'text-purple-600', bg: 'bg-purple-100' },
      popular: false
    }
  ];

  const handleInputChange = (field, value) => {
    if (field.includes('.')) {
      const [parent, child] = field.split('.');
      setFormData(prev => ({
        ...prev,
        [parent]: {
          ...prev[parent],
          [child]: value
        }
      }));
    } else {
      setFormData(prev => ({ ...prev, [field]: value }));
    }
  };

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

  const handleSubmit = () => {
    console.log('Form submitted:', formData);
    // Handle form submission here
    alert('Vehicle advert submitted successfully!');
    onClose();
  };

  const renderStepContent = () => {
    switch (currentStep) {
      case 1:
        return (
          <div className="space-y-6">
            <h3 className="text-xl font-semibold text-gray-900">Select Advert Type</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {advertTypes.map((type) => (
                <button
                  key={type.value}
                  onClick={() => handleInputChange('advertType', type.value)}
                  className={`p-4 rounded-xl border-2 text-left transition-all ${
                    formData.advertType === type.value
                      ? 'border-red-500 bg-red-50'
                      : 'border-gray-200 hover:border-gray-300'
                  }`}
                >
                  <div className="flex items-center space-x-3 mb-2">
                    <type.icon className={`w-6 h-6 ${formData.advertType === type.value ? 'text-red-600' : 'text-gray-600'}`} />
                    <h4 className="font-semibold">{type.label}</h4>
                  </div>
                  <p className="text-sm text-gray-600">{type.description}</p>
                </button>
              ))}
            </div>
          </div>
        );

      case 2:
        return (
          <div className="space-y-6">
            <h3 className="text-xl font-semibold text-gray-900">Basic Vehicle Information</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Advert Title *</label>
                <input
                  type="text"
                  value={formData.title}
                  onChange={(e) => handleInputChange('title', e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-transparent"
                  placeholder="e.g., 2020 BMW 3 Series 330i M Sport"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Short Tagline</label>
                <input
                  type="text"
                  value={formData.tagline}
                  onChange={(e) => handleInputChange('tagline', e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-transparent"
                  placeholder="e.g., Immaculate condition, one owner"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Vehicle Type *</label>
                <select
                  value={formData.vehicleType}
                  onChange={(e) => handleInputChange('vehicleType', e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-transparent"
                >
                  <option value="">Select vehicle type</option>
                  {vehicleTypes.map(type => (
                    <option key={type} value={type}>{type}</option>
                  ))}
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Make *</label>
                <select
                  value={formData.make}
                  onChange={(e) => handleInputChange('make', e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-transparent"
                >
                  <option value="">Select make</option>
                  {makes.map(make => (
                    <option key={make} value={make}>{make}</option>
                  ))}
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Model *</label>
                <input
                  type="text"
                  value={formData.model}
                  onChange={(e) => handleInputChange('model', e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-transparent"
                  placeholder="e.g., 3 Series"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Year *</label>
                <input
                  type="number"
                  value={formData.year}
                  onChange={(e) => handleInputChange('year', e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-transparent"
                  placeholder="e.g., 2020"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Mileage</label>
                <input
                  type="number"
                  value={formData.mileage}
                  onChange={(e) => handleInputChange('mileage', e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-transparent"
                  placeholder="e.g., 15000"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Fuel Type *</label>
                <select
                  value={formData.fuelType}
                  onChange={(e) => handleInputChange('fuelType', e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-transparent"
                >
                  <option value="">Select fuel type</option>
                  {fuelTypes.map(type => (
                    <option key={type} value={type}>{type}</option>
                  ))}
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Transmission *</label>
                <select
                  value={formData.transmission}
                  onChange={(e) => handleInputChange('transmission', e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-transparent"
                >
                  <option value="">Select transmission</option>
                  {transmissions.map(type => (
                    <option key={type} value={type}>{type}</option>
                  ))}
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Condition *</label>
                <select
                  value={formData.condition}
                  onChange={(e) => handleInputChange('condition', e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-transparent"
                >
                  <option value="">Select condition</option>
                  {conditions.map(condition => (
                    <option key={condition} value={condition}>{condition}</option>
                  ))}
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Category *</label>
                <select
                  value={formData.category}
                  onChange={(e) => handleInputChange('category', e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-transparent"
                >
                  <option value="sale">For Sale</option>
                  <option value="hire">For Hire</option>
                  <option value="lease">For Lease</option>
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Price *</label>
                <input
                  type="number"
                  value={formData.price}
                  onChange={(e) => handleInputChange('price', e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-transparent"
                  placeholder="e.g., 25000"
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
              <div className="border-2 border-dashed border-gray-300 rounded-lg p-6 text-center hover:border-red-500 transition-colors cursor-pointer">
                <Upload className="w-12 h-12 text-gray-400 mx-auto mb-4" />
                <p className="text-gray-600 mb-2">Click to upload or drag and drop</p>
                <p className="text-sm text-gray-500">PNG, JPG, GIF up to 10MB</p>
              </div>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Additional Images (up to 15)</label>
              <div className="grid grid-cols-3 md:grid-cols-5 gap-4">
                {[1, 2, 3, 4, 5].map((index) => (
                  <div key={index} className="aspect-square border-2 border-dashed border-gray-300 rounded-lg flex items-center justify-center hover:border-red-500 transition-colors cursor-pointer">
                    <Upload className="w-8 h-8 text-gray-400" />
                  </div>
                ))}
              </div>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Video Link (optional)</label>
              <input
                type="url"
                value={formData.videoUrl}
                onChange={(e) => handleInputChange('videoUrl', e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-transparent"
                placeholder="https://youtube.com/watch?v=..."
              />
            </div>
          </div>
        );

      case 4:
        return (
          <div className="space-y-6">
            <h3 className="text-xl font-semibold text-gray-900">Vehicle Specifications</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Engine Size</label>
                <input
                  type="text"
                  value={formData.specifications.engineSize}
                  onChange={(e) => handleInputChange('specifications.engineSize', e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-transparent"
                  placeholder="e.g., 2.0L"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Doors</label>
                <input
                  type="number"
                  value={formData.specifications.doors}
                  onChange={(e) => handleInputChange('specifications.doors', e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-transparent"
                  placeholder="e.g., 4"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Seats</label>
                <input
                  type="number"
                  value={formData.specifications.seats}
                  onChange={(e) => handleInputChange('specifications.seats', e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-transparent"
                  placeholder="e.g., 5"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Colour</label>
                <input
                  type="text"
                  value={formData.specifications.colour}
                  onChange={(e) => handleInputChange('specifications.colour', e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-transparent"
                  placeholder="e.g., Metallic Grey"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Road Tax Status</label>
                <input
                  type="text"
                  value={formData.specifications.roadTax}
                  onChange={(e) => handleInputChange('specifications.roadTax', e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-transparent"
                  placeholder="e.g., Taxed until Dec 2024"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">MOT Expiry</label>
                <input
                  type="date"
                  value={formData.specifications.motExpiry}
                  onChange={(e) => handleInputChange('specifications.motExpiry', e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-transparent"
                />
              </div>
            </div>
          </div>
        );

      case 5:
        return (
          <div className="space-y-6">
            <h3 className="text-xl font-semibold text-gray-900">Description</h3>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Overview</label>
              <textarea
                value={formData.overview}
                onChange={(e) => handleInputChange('overview', e.target.value)}
                rows={4}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-transparent"
                placeholder="Provide a detailed overview of your vehicle..."
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Key Features</label>
              <textarea
                value={formData.keyFeatures}
                onChange={(e) => handleInputChange('keyFeatures', e.target.value)}
                rows={3}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-transparent"
                placeholder="List the key features and highlights..."
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Vehicle Condition</label>
              <textarea
                value={formData.vehicleCondition}
                onChange={(e) => handleInputChange('vehicleCondition', e.target.value)}
                rows={3}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-transparent"
                placeholder="Describe the current condition of the vehicle..."
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Additional Notes</label>
              <textarea
                value={formData.additionalNotes}
                onChange={(e) => handleInputChange('additionalNotes', e.target.value)}
                rows={3}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-transparent"
                placeholder="Any additional information buyers should know..."
              />
            </div>
          </div>
        );

      case 6:
        return (
          <div className="space-y-6">
            <h3 className="text-xl font-semibold text-gray-900">Seller Information</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Name *</label>
                <input
                  type="text"
                  value={formData.sellerName}
                  onChange={(e) => handleInputChange('sellerName', e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-transparent"
                  placeholder="Your name"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Business Name (optional)</label>
                <input
                  type="text"
                  value={formData.businessName}
                  onChange={(e) => handleInputChange('businessName', e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-transparent"
                  placeholder="Business name"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Phone Number *</label>
                <input
                  type="tel"
                  value={formData.phone}
                  onChange={(e) => handleInputChange('phone', e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-transparent"
                  placeholder="+44 20 7123 4567"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Email *</label>
                <input
                  type="email"
                  value={formData.email}
                  onChange={(e) => handleInputChange('email', e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-transparent"
                  placeholder="email@example.com"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Website or Social Links</label>
                <input
                  type="url"
                  value={formData.website}
                  onChange={(e) => handleInputChange('website', e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-transparent"
                  placeholder="https://yourwebsite.com"
                />
              </div>
            </div>
            <div className="flex items-center space-x-3">
              <input
                type="checkbox"
                checked={formData.verifiedSeller}
                onChange={(e) => handleInputChange('verifiedSeller', e.target.checked)}
                className="w-4 h-4 text-red-600 border-gray-300 rounded focus:ring-red-500"
              />
              <label className="text-sm font-medium text-gray-700 flex items-center space-x-2">
                <span>Get Verified Seller Badge</span>
                <Shield className="w-4 h-4 text-blue-500" />
                <span className="text-xs text-gray-500">($9.99/month)</span>
              </label>
            </div>
          </div>
        );

      case 7:
        return (
          <div className="space-y-6">
            <h3 className="text-xl font-semibold text-gray-900">Location</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Address</label>
                <input
                  type="text"
                  value={formData.location.address}
                  onChange={(e) => handleInputChange('location.address', e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-transparent"
                  placeholder="123 Main Street"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">City</label>
                <input
                  type="text"
                  value={formData.location.city}
                  onChange={(e) => handleInputChange('location.city', e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-transparent"
                  placeholder="London"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Country</label>
                <input
                  type="text"
                  value={formData.location.country}
                  onChange={(e) => handleInputChange('location.country', e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-transparent"
                  placeholder="United Kingdom"
                />
              </div>
            </div>
            <div className="bg-gray-100 rounded-lg p-6 text-center">
              <MapPin className="w-12 h-12 text-gray-400 mx-auto mb-4" />
              <p className="text-gray-600 mb-2">Interactive map will be displayed here</p>
              <p className="text-sm text-gray-500">Click to set your vehicle location</p>
            </div>
            <div className="flex items-center space-x-3">
              <input
                type="checkbox"
                checked={formData.location.privacyMode}
                onChange={(e) => handleInputChange('location.privacyMode', e.target.checked)}
                className="w-4 h-4 text-red-600 border-gray-300 rounded focus:ring-red-500"
              />
              <label className="text-sm font-medium text-gray-700">
                Show approximate location only (privacy mode)
              </label>
            </div>
          </div>
        );

      case 8:
        return (
          <div className="space-y-6">
            <h3 className="text-xl font-semibold text-gray-900">Premium Upsell Options</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {promotionTiers.map((tier) => (
                <button
                  key={tier.id}
                  onClick={() => handleInputChange('promotionTier', tier.id)}
                  className={`p-4 rounded-xl border-2 text-left transition-all ${
                    formData.promotionTier === tier.id
                      ? 'border-red-500 bg-red-50'
                      : 'border-gray-200 hover:border-gray-300'
                  }`}
                >
                  {tier.popular && (
                    <div className="inline-block px-2 py-1 bg-red-600 text-white text-xs font-semibold rounded-full mb-2">
                      Most Popular
                    </div>
                  )}
                  <div className="flex items-center justify-between mb-2">
                    <h4 className="font-semibold text-lg">{tier.name}</h4>
                    {tier.badge && <tier.badge.icon className={`w-6 h-6 ${tier.badge.color}`} />}
                  </div>
                  <div className="text-2xl font-bold text-gray-900 mb-2">
                    ${tier.price}
                    <span className="text-sm font-normal text-gray-600">/{tier.duration}</span>
                  </div>
                  <ul className="space-y-1 mb-3">
                    {tier.features.map((feature, index) => (
                      <li key={index} className="flex items-center space-x-2 text-sm text-gray-600">
                        <Check className="w-4 h-4 text-green-500" />
                        <span>{feature}</span>
                      </li>
                    ))}
                  </ul>
                </button>
              ))}
            </div>
          </div>
        );

      case 9:
        return (
          <div className="space-y-6">
            <h3 className="text-xl font-semibold text-gray-900">Final Submission</h3>
            <div className="bg-gray-50 rounded-lg p-6">
              <h4 className="font-semibold mb-4">Summary</h4>
              <div className="space-y-2 text-sm">
                <div className="flex justify-between">
                  <span className="text-gray-600">Advert Type:</span>
                  <span className="font-medium">{formData.advertType}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Vehicle:</span>
                  <span className="font-medium">{formData.year} {formData.make} {formData.model}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Price:</span>
                  <span className="font-medium">${formData.price}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Promotion:</span>
                  <span className="font-medium">{promotionTiers.find(t => t.id === formData.promotionTier)?.name}</span>
                </div>
                <div className="border-t pt-2 mt-2">
                  <div className="flex justify-between font-semibold">
                    <span>Total:</span>
                    <span>${promotionTiers.find(t => t.id === formData.promotionTier)?.price || 0}</span>
                  </div>
                </div>
              </div>
            </div>
            <div className="space-y-4">
              <label className="flex items-center space-x-3 cursor-pointer">
                <input
                  type="checkbox"
                  checked={formData.accuracyConfirmed}
                  onChange={(e) => handleInputChange('accuracyConfirmed', e.target.checked)}
                  className="w-4 h-4 text-red-600 border-gray-300 rounded focus:ring-red-500"
                />
                <span className="text-sm font-medium text-gray-700">
                  I confirm this vehicle advert is accurate and truthful
                </span>
              </label>
              <label className="flex items-center space-x-3 cursor-pointer">
                <input
                  type="checkbox"
                  checked={formData.termsAccepted}
                  onChange={(e) => handleInputChange('termsAccepted', e.target.checked)}
                  className="w-4 h-4 text-red-600 border-gray-300 rounded focus:ring-red-500"
                />
                <span className="text-sm font-medium text-gray-700">
                  I agree to the Terms of Service and Privacy Policy
                </span>
              </label>
            </div>
          </div>
        );

      default:
        return null;
    }
  };

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-black bg-opacity-50">
      <div className="flex items-center justify-center min-h-screen px-4">
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          exit={{ opacity: 0, scale: 0.95 }}
          className="relative bg-white rounded-xl max-w-4xl w-full max-h-[90vh] overflow-hidden"
        >
          {/* Header */}
          <div className="bg-white border-b border-gray-200 px-6 py-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-3">
                <button
                  onClick={onClose}
                  className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
                >
                  <ArrowLeft className="w-5 h-5 text-gray-600" />
                </button>
                <h2 className="text-xl font-semibold text-gray-900">Post Vehicle Advert</h2>
              </div>
              <button
                onClick={onClose}
                className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
              >
                <X className="w-5 h-5 text-gray-600" />
              </button>
            </div>
            
            {/* Progress Bar */}
            <div className="mt-4">
              <div className="flex items-center justify-between mb-2">
                <span className="text-sm font-medium text-gray-700">Step {currentStep} of {totalSteps}</span>
                <span className="text-sm font-medium text-gray-700">{Math.round(progressPercentage)}%</span>
              </div>
              <div className="w-full bg-gray-200 rounded-full h-2">
                <div
                  className="bg-red-600 h-2 rounded-full transition-all duration-300"
                  style={{ width: `${progressPercentage}%` }}
                />
              </div>
            </div>
          </div>

          {/* Form Content */}
          <div className="px-6 py-6 overflow-y-auto" style={{ maxHeight: 'calc(90vh - 200px)' }}>
            <AnimatePresence mode="wait">
              <motion.div
                key={currentStep}
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
                transition={{ duration: 0.3 }}
              >
                {renderStepContent()}
              </motion.div>
            </AnimatePresence>
          </div>

          {/* Footer */}
          <div className="bg-gray-50 border-t border-gray-200 px-6 py-4">
            <div className="flex items-center justify-between">
              <button
                onClick={handlePrevious}
                disabled={currentStep === 1}
                className={`px-4 py-2 rounded-lg font-medium transition-colors ${
                  currentStep === 1
                    ? 'bg-gray-200 text-gray-400 cursor-not-allowed'
                    : 'bg-white border border-gray-300 text-gray-700 hover:bg-gray-50'
                }`}
              >
                Previous
              </button>
              
              <div className="text-sm text-gray-600">
                {currentStep === 9 && (
                  <span className="text-red-600 font-semibold">
                    Total: ${promotionTiers.find(t => t.id === formData.promotionTier)?.price || 0}
                  </span>
                )}
              </div>

              {currentStep === 9 ? (
                <button
                  onClick={handleSubmit}
                  disabled={!formData.termsAccepted || !formData.accuracyConfirmed}
                  className={`px-6 py-2 rounded-lg font-medium transition-colors ${
                    formData.termsAccepted && formData.accuracyConfirmed
                      ? 'bg-red-600 text-white hover:bg-red-700'
                      : 'bg-gray-300 text-gray-500 cursor-not-allowed'
                  }`}
                >
                  Submit Vehicle Advert
                </button>
              ) : (
                <button
                  onClick={handleNext}
                  className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors font-medium flex items-center space-x-2"
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
  );
};

export default VehiclePostForm;
