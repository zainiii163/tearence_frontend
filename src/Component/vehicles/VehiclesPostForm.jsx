import React, { useState, useEffect } from 'react';
import { Upload, X, MapPin, Check, Crown, ArrowLeft, DollarSign, Star, Car, Save } from 'lucide-react';
import { createVehicle, uploadImage, getVehicleTypes, getVehicleCategories, getPromotionTiers } from '../../services/vehiclesAPI';

const VehiclesPostForm = ({ onClose }) => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [validationErrors, setValidationErrors] = useState({});
  const [vehicleTypes, setVehicleTypes] = useState([]);
  const [categories, setCategories] = useState([]);
  const [promotionTiers, setPromotionTiers] = useState([]);
  const [loadingData, setLoadingData] = useState(true);
  const [uploadingImage, setUploadingImage] = useState(false);
  const [mainImagePreview, setMainImagePreview] = useState(null);
  const [additionalImagePreviews, setAdditionalImagePreviews] = useState([]);
  const [submissionSuccess, setSubmissionSuccess] = useState(false);
  const [submittedVehicle, setSubmittedVehicle] = useState(null);

  const [formData, setFormData] = useState({
    // Vehicle Type & Category
    vehicle_type: '',
    category: 'sale',
    
    // Basic Vehicle Information
    make: '',
    model: '',
    year: '',
    registration_number: '',
    vin: '',
    condition: 'used',
    fuel_type: '',
    transmission: '',
    body_type: '',
    mileage: '',
    engine_size: '',
    horsepower: '',
    number_of_doors: '',
    number_of_seats: '',
    colour: '',
    
    // Pricing
    price: '',
    currency: 'GBP',
    price_negotiable: false,
    deposit_amount: '',
    payment_frequency: '',
    
    // Hire/Lease Specific
    insurance_included: false,
    maintenance_included: false,
    minimum_hire_period: '',
    maximum_hire_period: '',
    hire_terms: '',
    lease_terms: '',
    
    // Description
    title: '',
    description: '',
    overview: '',
    key_features: '',
    specifications: '',
    modifications: '',
    service_history: '',
    mot_details: '',
    
    // Location
    country: '',
    city: '',
    state: '',
    address: '',
    latitude: '',
    longitude: '',
    is_approximate_location: false,
    delivery_radius: '',
    delivery_available: false,
    
    // Media
    main_image: '',
    images: [],
    video_link: '',
    
    // Contact Information
    contact_name: '',
    business_name: '',
    phone_number: '',
    email: '',
    website: '',
    social_links: {},
    logo: '',
    verified_seller: false,
    dealership: false,
    seller_description: '',
    
    // Additional Information
    additional_features: [],
    why_buy_this_vehicle: '',
    additional_notes: '',
    
    // Promotion
    promotion_tier: 'standard',
    
    // Terms
    terms_accepted: false,
    accurate_info: false,
  });

  // Load data from API on mount
  useEffect(() => {
    const loadData = async () => {
      try {
        setLoadingData(true);
        const [typesData, categoriesData, tiersData] = await Promise.all([
          getVehicleTypes(),
          getVehicleCategories(),
          getPromotionTiers(),
        ]);
        
        setVehicleTypes(typesData.data || typesData);
        setCategories(categoriesData.data || categoriesData);
        setPromotionTiers(tiersData.data || tiersData);
      } catch (error) {
        console.error('Failed to load form data:', error);
        setError('Failed to load form data. Please refresh the page.');
      } finally {
        setLoadingData(false);
      }
    };

    loadData();
  }, []);

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value
    }));
    
    // Clear validation error for this field
    if (validationErrors[name]) {
      setValidationErrors(prev => {
        const newErrors = { ...prev };
        delete newErrors[name];
        return newErrors;
      });
    }
  };

  const handleArrayChange = (e) => {
    const { name, value } = e.target;
    const array = value.split(',').map(item => item.trim()).filter(item => item);
    setFormData(prev => ({ ...prev, [name]: array }));
  };

  const handleMainImageUpload = async (e) => {
    const file = e.target.files[0];
    if (!file) return;

    try {
      setUploadingImage(true);
      const response = await uploadImage(file);
      setFormData(prev => ({ ...prev, main_image: response.data.url }));
      setMainImagePreview(response.data.url);
    } catch (error) {
      console.error('Failed to upload image:', error);
      setError('Failed to upload image. Please try again.');
    } finally {
      setUploadingImage(false);
    }
  };

  const handleAdditionalImagesUpload = async (e) => {
    const files = Array.from(e.target.files);
    if (!files.length) return;

    try {
      setUploadingImage(true);
      const uploadPromises = files.map(file => uploadImage(file));
      const responses = await Promise.all(uploadPromises);
      const imageUrls = responses.map(r => r.data.url);
      
      setFormData(prev => ({
        ...prev,
        images: [...prev.images, ...imageUrls]
      }));
      setAdditionalImagePreviews(prev => [...prev, ...imageUrls]);
    } catch (error) {
      console.error('Failed to upload images:', error);
      setError('Failed to upload images. Please try again.');
    } finally {
      setUploadingImage(false);
    }
  };

  const removeAdditionalImage = (index) => {
    setFormData(prev => ({
      ...prev,
      images: prev.images.filter((_, i) => i !== index)
    }));
    setAdditionalImagePreviews(prev => prev.filter((_, i) => i !== index));
  };

  const validateForm = () => {
    const errors = {};

    if (!formData.vehicle_type) errors.vehicle_type = 'Vehicle type is required';
    if (!formData.category) errors.category = 'Category is required';
    if (!formData.make) errors.make = 'Make is required';
    if (!formData.model) errors.model = 'Model is required';
    if (!formData.year) errors.year = 'Year is required';
    if (!formData.condition) errors.condition = 'Condition is required';
    if (!formData.fuel_type) errors.fuel_type = 'Fuel type is required';
    if (!formData.transmission) errors.transmission = 'Transmission is required';
    if (!formData.body_type) errors.body_type = 'Body type is required';
    if (!formData.price) errors.price = 'Price is required';
    if (!formData.title) errors.title = 'Title is required';
    if (!formData.description) errors.description = 'Description is required';
    if (!formData.country) errors.country = 'Country is required';
    if (!formData.city) errors.city = 'City is required';
    if (!formData.main_image) errors.main_image = 'Main image is required';
    if (!formData.contact_name) errors.contact_name = 'Contact name is required';
    if (!formData.phone_number) errors.phone_number = 'Phone number is required';
    if (!formData.email) errors.email = 'Email is required';
    if (!formData.terms_accepted) errors.terms_accepted = 'You must accept the terms';
    if (!formData.accurate_info) errors.accurate_info = 'You must confirm the information is accurate';

    setValidationErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!validateForm()) {
      setError('Please fix the validation errors before submitting.');
      return;
    }

    try {
      setLoading(true);
      setError('');

      const submissionData = {
        ...formData,
        price: parseFloat(formData.price),
        year: parseInt(formData.year),
        mileage: formData.mileage ? parseInt(formData.mileage) : null,
        engine_size: formData.engine_size ? parseInt(formData.engine_size) : null,
        horsepower: formData.horsepower ? parseInt(formData.horsepower) : null,
        number_of_doors: formData.number_of_doors ? parseInt(formData.number_of_doors) : null,
        number_of_seats: formData.number_of_seats ? parseInt(formData.number_of_seats) : null,
        deposit_amount: formData.deposit_amount ? parseFloat(formData.deposit_amount) : null,
        minimum_hire_period: formData.minimum_hire_period ? parseInt(formData.minimum_hire_period) : null,
        maximum_hire_period: formData.maximum_hire_period ? parseInt(formData.maximum_hire_period) : null,
        latitude: formData.latitude ? parseFloat(formData.latitude) : null,
        longitude: formData.longitude ? parseFloat(formData.longitude) : null,
        additional_features: formData.additional_features.length > 0 ? formData.additional_features : null,
      };

      const response = await createVehicle(submissionData);
      setSubmittedVehicle(response.data);
      setSubmissionSuccess(true);
    } catch (error) {
      console.error('Failed to create vehicle advert:', error);
      if (error.response?.data?.errors) {
        setValidationErrors(error.response.data.errors);
        setError('Validation failed. Please check the form.');
      } else {
        setError(error.message || 'Failed to create vehicle advert. Please try again.');
      }
    } finally {
      setLoading(false);
    }
  };

  if (loadingData) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-gray-100">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
          <p className="mt-4 text-gray-600">Loading form...</p>
        </div>
      </div>
    );
  }

  if (submissionSuccess) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 flex items-center justify-center p-4">
        <div className="bg-white rounded-2xl shadow-2xl p-8 max-w-md w-full text-center">
          <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <Check className="w-8 h-8 text-green-600" />
          </div>
          <h2 className="text-2xl font-bold text-gray-800 mb-2">Vehicle Advert Created!</h2>
          <p className="text-gray-600 mb-6">Your vehicle advert has been successfully submitted and is pending approval.</p>
          <div className="space-y-3">
            <button
              onClick={() => window.location.href = '/vehicles'}
              className="w-full bg-blue-600 text-white py-3 rounded-lg hover:bg-blue-700 transition font-medium"
            >
              View Vehicle Adverts
            </button>
            <button
              onClick={onClose}
              className="w-full bg-gray-200 text-gray-800 py-3 rounded-lg hover:bg-gray-300 transition font-medium"
            >
              Close
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 p-4">
      <div className="page-container">
        {/* Header */}
        <div className="bg-white rounded-t-2xl shadow-lg p-6 border-b border-gray-200">
          <div className="flex items-center justify-between mb-4">
            <button
              onClick={onClose}
              className="flex items-center text-gray-600 hover:text-gray-800 transition"
            >
              <ArrowLeft className="w-5 h-5 mr-2" />
              Back
            </button>
            <h1 className="text-3xl font-bold text-gray-800">Post Vehicle Advert</h1>
            <div className="w-20"></div>
          </div>
          <p className="text-gray-600">Create your vehicle advert with premium upsell options for maximum visibility.</p>
        </div>

        {/* Form */}
        <div className="bg-white rounded-b-2xl shadow-lg p-6">
          {error && (
            <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg mb-6">
              {error}
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-8">
            {/* Vehicle Type & Category */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Vehicle Type *
                </label>
                <select
                  name="vehicle_type"
                  value={formData.vehicle_type}
                  onChange={handleChange}
                  className={`w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent ${
                    validationErrors.vehicle_type ? 'border-red-500' : 'border-gray-300'
                  }`}
                  required
                >
                  <option value="">Select vehicle type</option>
                  {Object.entries(vehicleTypes).map(([key, label]) => (
                    <option key={key} value={key}>{label}</option>
                  ))}
                </select>
                {validationErrors.vehicle_type && (
                  <p className="text-red-500 text-sm mt-1">{validationErrors.vehicle_type}</p>
                )}
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Category *
                </label>
                <select
                  name="category"
                  value={formData.category}
                  onChange={handleChange}
                  className={`w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent ${
                    validationErrors.category ? 'border-red-500' : 'border-gray-300'
                  }`}
                  required
                >
                  {Object.entries(categories).map(([key, label]) => (
                    <option key={key} value={key}>{label}</option>
                  ))}
                </select>
                {validationErrors.category && (
                  <p className="text-red-500 text-sm mt-1">{validationErrors.category}</p>
                )}
              </div>
            </div>

            {/* Basic Vehicle Information */}
            <div>
              <h3 className="text-xl font-semibold text-gray-800 mb-4 flex items-center">
                <Car className="w-5 h-5 mr-2 text-blue-600" />
                Basic Vehicle Information
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div className="md:col-span-3">
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Make *
                  </label>
                  <input
                    type="text"
                    name="make"
                    value={formData.make}
                    onChange={handleChange}
                    placeholder="e.g., Toyota, BMW, Ford"
                    className={`w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent ${
                      validationErrors.make ? 'border-red-500' : 'border-gray-300'
                    }`}
                    required
                  />
                  {validationErrors.make && (
                    <p className="text-red-500 text-sm mt-1">{validationErrors.make}</p>
                  )}
                </div>

                <div className="md:col-span-3">
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Model *
                  </label>
                  <input
                    type="text"
                    name="model"
                    value={formData.model}
                    onChange={handleChange}
                    placeholder="e.g., Camry, X5, Mustang"
                    className={`w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent ${
                      validationErrors.model ? 'border-red-500' : 'border-gray-300'
                    }`}
                    required
                  />
                  {validationErrors.model && (
                    <p className="text-red-500 text-sm mt-1">{validationErrors.model}</p>
                  )}
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Year *
                  </label>
                  <input
                    type="number"
                    name="year"
                    value={formData.year}
                    onChange={handleChange}
                    placeholder="e.g., 2020"
                    min="1900"
                    max={new Date().getFullYear() + 1}
                    className={`w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent ${
                      validationErrors.year ? 'border-red-500' : 'border-gray-300'
                    }`}
                    required
                  />
                  {validationErrors.year && (
                    <p className="text-red-500 text-sm mt-1">{validationErrors.year}</p>
                  )}
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Mileage
                  </label>
                  <input
                    type="number"
                    name="mileage"
                    value={formData.mileage}
                    onChange={handleChange}
                    placeholder="e.g., 50000"
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Condition *
                  </label>
                  <select
                    name="condition"
                    value={formData.condition}
                    onChange={handleChange}
                    className={`w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent ${
                      validationErrors.condition ? 'border-red-500' : 'border-gray-300'
                    }`}
                    required
                  >
                    <option value="new">New</option>
                    <option value="used">Used</option>
                    <option value="certified_pre_owned">Certified Pre-Owned</option>
                    <option value="refurbished">Refurbished</option>
                  </select>
                  {validationErrors.condition && (
                    <p className="text-red-500 text-sm mt-1">{validationErrors.condition}</p>
                  )}
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Fuel Type *
                  </label>
                  <select
                    name="fuel_type"
                    value={formData.fuel_type}
                    onChange={handleChange}
                    className={`w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent ${
                      validationErrors.fuel_type ? 'border-red-500' : 'border-gray-300'
                    }`}
                    required
                  >
                    <option value="">Select fuel type</option>
                    <option value="petrol">Petrol</option>
                    <option value="diesel">Diesel</option>
                    <option value="electric">Electric</option>
                    <option value="hybrid">Hybrid</option>
                    <option value="lpg">LPG</option>
                    <option value="other">Other</option>
                  </select>
                  {validationErrors.fuel_type && (
                    <p className="text-red-500 text-sm mt-1">{validationErrors.fuel_type}</p>
                  )}
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Transmission *
                  </label>
                  <select
                    name="transmission"
                    value={formData.transmission}
                    onChange={handleChange}
                    className={`w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent ${
                      validationErrors.transmission ? 'border-red-500' : 'border-gray-300'
                    }`}
                    required
                  >
                    <option value="">Select transmission</option>
                    <option value="automatic">Automatic</option>
                    <option value="manual">Manual</option>
                    <option value="cvt">CVT</option>
                    <option value="dual_clutch">Dual Clutch</option>
                    <option value="other">Other</option>
                  </select>
                  {validationErrors.transmission && (
                    <p className="text-red-500 text-sm mt-1">{validationErrors.transmission}</p>
                  )}
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Body Type *
                  </label>
                  <select
                    name="body_type"
                    value={formData.body_type}
                    onChange={handleChange}
                    className={`w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent ${
                      validationErrors.body_type ? 'border-red-500' : 'border-gray-300'
                    }`}
                    required
                  >
                    <option value="">Select body type</option>
                    <option value="sedan">Sedan</option>
                    <option value="hatchback">Hatchback</option>
                    <option value="suv">SUV</option>
                    <option value="coupe">Coupe</option>
                    <option value="convertible">Convertible</option>
                    <option value="wagon">Wagon</option>
                    <option value="pickup">Pickup</option>
                    <option value="van">Van</option>
                    <option value="truck">Truck</option>
                    <option value="bus">Bus</option>
                    <option value="motorbike">Motorbike</option>
                    <option value="other">Other</option>
                  </select>
                  {validationErrors.body_type && (
                    <p className="text-red-500 text-sm mt-1">{validationErrors.body_type}</p>
                  )}
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Colour
                  </label>
                  <input
                    type="text"
                    name="colour"
                    value={formData.colour}
                    onChange={handleChange}
                    placeholder="e.g., Black, White, Red"
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    VIN
                  </label>
                  <input
                    type="text"
                    name="vin"
                    value={formData.vin}
                    onChange={handleChange}
                    placeholder="Vehicle Identification Number"
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Registration Number
                  </label>
                  <input
                    type="text"
                    name="registration_number"
                    value={formData.registration_number}
                    onChange={handleChange}
                    placeholder="e.g., ABC123"
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  />
                </div>
              </div>
            </div>

            {/* Pricing */}
            <div>
              <h3 className="text-xl font-semibold text-gray-800 mb-4 flex items-center">
                <DollarSign className="w-5 h-5 mr-2 text-blue-600" />
                Pricing
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Price *
                  </label>
                  <input
                    type="number"
                    name="price"
                    value={formData.price}
                    onChange={handleChange}
                    placeholder="e.g., 15000"
                    step="0.01"
                    min="0"
                    className={`w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent ${
                      validationErrors.price ? 'border-red-500' : 'border-gray-300'
                    }`}
                    required
                  />
                  {validationErrors.price && (
                    <p className="text-red-500 text-sm mt-1">{validationErrors.price}</p>
                  )}
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Currency
                  </label>
                  <select
                    name="currency"
                    value={formData.currency}
                    onChange={handleChange}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  >
                    <option value="GBP">GBP (£)</option>
                    <option value="USD">USD ($)</option>
                    <option value="EUR">EUR (€)</option>
                    <option value="AED">AED (د.إ)</option>
                  </select>
                </div>

                <div className="flex items-center pt-6">
                  <label className="flex items-center cursor-pointer">
                    <input
                      type="checkbox"
                      name="price_negotiable"
                      checked={formData.price_negotiable}
                      onChange={handleChange}
                      className="w-5 h-5 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
                    />
                    <span className="ml-2 text-sm text-gray-700">Price is negotiable</span>
                  </label>
                </div>

                {formData.category === 'hire' || formData.category === 'lease' ? (
                  <>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Deposit Amount
                      </label>
                      <input
                        type="number"
                        name="deposit_amount"
                        value={formData.deposit_amount}
                        onChange={handleChange}
                        placeholder="e.g., 500"
                        step="0.01"
                        min="0"
                        className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Payment Frequency
                      </label>
                      <select
                        name="payment_frequency"
                        value={formData.payment_frequency}
                        onChange={handleChange}
                        className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      >
                        <option value="">Select frequency</option>
                        <option value="daily">Daily</option>
                        <option value="weekly">Weekly</option>
                        <option value="monthly">Monthly</option>
                      </select>
                    </div>
                  </>
                ) : null}
              </div>
            </div>

            {/* Hire/Lease Specific */}
            {formData.category === 'hire' || formData.category === 'lease' ? (
              <div>
                <h3 className="text-xl font-semibold text-gray-800 mb-4">
                  Hire/Lease Details
                </h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="flex items-center">
                    <label className="flex items-center cursor-pointer">
                      <input
                        type="checkbox"
                        name="insurance_included"
                        checked={formData.insurance_included}
                        onChange={handleChange}
                        className="w-5 h-5 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
                      />
                      <span className="ml-2 text-sm text-gray-700">Insurance included</span>
                    </label>
                  </div>

                  <div className="flex items-center">
                    <label className="flex items-center cursor-pointer">
                      <input
                        type="checkbox"
                        name="maintenance_included"
                        checked={formData.maintenance_included}
                        onChange={handleChange}
                        className="w-5 h-5 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
                      />
                      <span className="ml-2 text-sm text-gray-700">Maintenance included</span>
                    </label>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Minimum Hire Period (days)
                    </label>
                    <input
                      type="number"
                      name="minimum_hire_period"
                      value={formData.minimum_hire_period}
                      onChange={handleChange}
                      placeholder="e.g., 1"
                      min="1"
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Maximum Hire Period (days)
                    </label>
                    <input
                      type="number"
                      name="maximum_hire_period"
                      value={formData.maximum_hire_period}
                      onChange={handleChange}
                      placeholder="e.g., 30"
                      min="1"
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    />
                  </div>

                  <div className="md:col-span-2">
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Hire Terms
                    </label>
                    <textarea
                      name="hire_terms"
                      value={formData.hire_terms}
                      onChange={handleChange}
                      placeholder="Describe hire terms and conditions..."
                      rows={3}
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    />
                  </div>
                </div>
              </div>
            ) : null}

            {/* Description */}
            <div>
              <h3 className="text-xl font-semibold text-gray-800 mb-4">Description</h3>
              <div className="space-y-6">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Title *
                  </label>
                  <input
                    type="text"
                    name="title"
                    value={formData.title}
                    onChange={handleChange}
                    placeholder="e.g., 2020 Toyota Camry - Excellent Condition"
                    className={`w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent ${
                      validationErrors.title ? 'border-red-500' : 'border-gray-300'
                    }`}
                    required
                  />
                  {validationErrors.title && (
                    <p className="text-red-500 text-sm mt-1">{validationErrors.title}</p>
                  )}
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Description *
                  </label>
                  <textarea
                    name="description"
                    value={formData.description}
                    onChange={handleChange}
                    placeholder="Provide a detailed description of the vehicle..."
                    rows={6}
                    className={`w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent ${
                      validationErrors.description ? 'border-red-500' : 'border-gray-300'
                    }`}
                    required
                  />
                  {validationErrors.description && (
                    <p className="text-red-500 text-sm mt-1">{validationErrors.description}</p>
                  )}
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Overview
                  </label>
                  <textarea
                    name="overview"
                    value={formData.overview}
                    onChange={handleChange}
                    placeholder="Brief overview of the vehicle..."
                    rows={3}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Key Features
                  </label>
                  <textarea
                    name="key_features"
                    value={formData.key_features}
                    onChange={handleChange}
                    placeholder="List key features (one per line or comma-separated)..."
                    rows={3}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Specifications
                  </label>
                  <textarea
                    name="specifications"
                    value={formData.specifications}
                    onChange={handleChange}
                    placeholder="Detailed specifications..."
                    rows={3}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Service History
                  </label>
                  <textarea
                    name="service_history"
                    value={formData.service_history}
                    onChange={handleChange}
                    placeholder="Describe the service history..."
                    rows={3}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  />
                </div>
              </div>
            </div>

            {/* Location */}
            <div>
              <h3 className="text-xl font-semibold text-gray-800 mb-4 flex items-center">
                <MapPin className="w-5 h-5 mr-2 text-blue-600" />
                Location
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Country *
                  </label>
                  <input
                    type="text"
                    name="country"
                    value={formData.country}
                    onChange={handleChange}
                    placeholder="e.g., United Kingdom"
                    className={`w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent ${
                      validationErrors.country ? 'border-red-500' : 'border-gray-300'
                    }`}
                    required
                  />
                  {validationErrors.country && (
                    <p className="text-red-500 text-sm mt-1">{validationErrors.country}</p>
                  )}
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    City *
                  </label>
                  <input
                    type="text"
                    name="city"
                    value={formData.city}
                    onChange={handleChange}
                    placeholder="e.g., London"
                    className={`w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent ${
                      validationErrors.city ? 'border-red-500' : 'border-gray-300'
                    }`}
                    required
                  />
                  {validationErrors.city && (
                    <p className="text-red-500 text-sm mt-1">{validationErrors.city}</p>
                  )}
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    State/Region
                  </label>
                  <input
                    type="text"
                    name="state"
                    value={formData.state}
                    onChange={handleChange}
                    placeholder="e.g., England"
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  />
                </div>

                <div className="md:col-span-3">
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Address
                  </label>
                  <input
                    type="text"
                    name="address"
                    value={formData.address}
                    onChange={handleChange}
                    placeholder="Full address"
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Latitude
                  </label>
                  <input
                    type="number"
                    name="latitude"
                    value={formData.latitude}
                    onChange={handleChange}
                    placeholder="e.g., 51.5074"
                    step="any"
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Longitude
                  </label>
                  <input
                    type="number"
                    name="longitude"
                    value={formData.longitude}
                    onChange={handleChange}
                    placeholder="e.g., -0.1278"
                    step="any"
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  />
                </div>

                <div className="flex items-center pt-6">
                  <label className="flex items-center cursor-pointer">
                    <input
                      type="checkbox"
                      name="is_approximate_location"
                      checked={formData.is_approximate_location}
                      onChange={handleChange}
                      className="w-5 h-5 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
                    />
                    <span className="ml-2 text-sm text-gray-700">Show approximate location only</span>
                  </label>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Delivery Radius
                  </label>
                  <input
                    type="text"
                    name="delivery_radius"
                    value={formData.delivery_radius}
                    onChange={handleChange}
                    placeholder="e.g., 50 miles"
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  />
                </div>

                <div className="flex items-center pt-6">
                  <label className="flex items-center cursor-pointer">
                    <input
                      type="checkbox"
                      name="delivery_available"
                      checked={formData.delivery_available}
                      onChange={handleChange}
                      className="w-5 h-5 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
                    />
                    <span className="ml-2 text-sm text-gray-700">Delivery available</span>
                  </label>
                </div>
              </div>
            </div>

            {/* Media */}
            <div>
              <h3 className="text-xl font-semibold text-gray-800 mb-4">Media</h3>
              <div className="space-y-6">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Main Image *
                  </label>
                  <div className="border-2 border-dashed border-gray-300 rounded-lg p-6 text-center hover:border-blue-500 transition">
                    {mainImagePreview ? (
                      <div className="relative">
                        <img
                          src={mainImagePreview}
                          alt="Main preview"
                          className="max-h-64 mx-auto rounded-lg"
                        />
                        <button
                          type="button"
                          onClick={() => {
                            setFormData(prev => ({ ...prev, main_image: '' }));
                            setMainImagePreview(null);
                          }}
                          className="absolute top-2 right-2 bg-red-500 text-white rounded-full p-1 hover:bg-red-600 transition"
                        >
                          <X className="w-4 h-4" />
                        </button>
                      </div>
                    ) : (
                      <div>
                        <Upload className="w-12 h-12 text-gray-400 mx-auto mb-2" />
                        <p className="text-gray-600 mb-2">Click to upload main image</p>
                        <input
                          type="file"
                          accept="image/*"
                          onChange={handleMainImageUpload}
                          disabled={uploadingImage}
                          className="hidden"
                          id="mainImageUpload"
                        />
                        <label
                          htmlFor="mainImageUpload"
                          className="cursor-pointer bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition inline-block"
                        >
                          {uploadingImage ? 'Uploading...' : 'Choose File'}
                        </label>
                      </div>
                    )}
                  </div>
                  {validationErrors.main_image && (
                    <p className="text-red-500 text-sm mt-1">{validationErrors.main_image}</p>
                  )}
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Additional Images
                  </label>
                  <div className="border-2 border-dashed border-gray-300 rounded-lg p-6 text-center hover:border-blue-500 transition">
                    <Upload className="w-12 h-12 text-gray-400 mx-auto mb-2" />
                    <p className="text-gray-600 mb-2">Click to upload additional images</p>
                    <input
                      type="file"
                      accept="image/*"
                      multiple
                      onChange={handleAdditionalImagesUpload}
                      disabled={uploadingImage}
                      className="hidden"
                      id="additionalImagesUpload"
                    />
                    <label
                      htmlFor="additionalImagesUpload"
                      className="cursor-pointer bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition inline-block"
                    >
                      {uploadingImage ? 'Uploading...' : 'Choose Files'}
                    </label>
                  </div>
                  {additionalImagePreviews.length > 0 && (
                    <div className="grid grid-cols-4 gap-4 mt-4">
                      {additionalImagePreviews.map((preview, index) => (
                        <div key={index} className="relative">
                          <img
                            src={preview}
                            alt={`Additional ${index + 1}`}
                            className="w-full h-24 object-cover rounded-lg"
                          />
                          <button
                            type="button"
                            onClick={() => removeAdditionalImage(index)}
                            className="absolute top-1 right-1 bg-red-500 text-white rounded-full p-1 hover:bg-red-600 transition"
                          >
                            <X className="w-3 h-3" />
                          </button>
                        </div>
                      ))}
                    </div>
                  )}
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Video Link
                  </label>
                  <input
                    type="url"
                    name="video_link"
                    value={formData.video_link}
                    onChange={handleChange}
                    placeholder="e.g., https://youtube.com/watch?v=..."
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  />
                </div>
              </div>
            </div>

            {/* Contact Information */}
            <div>
              <h3 className="text-xl font-semibold text-gray-800 mb-4">Contact Information</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Contact Name *
                  </label>
                  <input
                    type="text"
                    name="contact_name"
                    value={formData.contact_name}
                    onChange={handleChange}
                    placeholder="Your name"
                    className={`w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent ${
                      validationErrors.contact_name ? 'border-red-500' : 'border-gray-300'
                    }`}
                    required
                  />
                  {validationErrors.contact_name && (
                    <p className="text-red-500 text-sm mt-1">{validationErrors.contact_name}</p>
                  )}
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Business Name
                  </label>
                  <input
                    type="text"
                    name="business_name"
                    value={formData.business_name}
                    onChange={handleChange}
                    placeholder="Business name (if applicable)"
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Phone Number *
                  </label>
                  <input
                    type="tel"
                    name="phone_number"
                    value={formData.phone_number}
                    onChange={handleChange}
                    placeholder="e.g., +44 20 1234 5678"
                    className={`w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent ${
                      validationErrors.phone_number ? 'border-red-500' : 'border-gray-300'
                    }`}
                    required
                  />
                  {validationErrors.phone_number && (
                    <p className="text-red-500 text-sm mt-1">{validationErrors.phone_number}</p>
                  )}
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Email *
                  </label>
                  <input
                    type="email"
                    name="email"
                    value={formData.email}
                    onChange={handleChange}
                    placeholder="your@email.com"
                    className={`w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent ${
                      validationErrors.email ? 'border-red-500' : 'border-gray-300'
                    }`}
                    required
                  />
                  {validationErrors.email && (
                    <p className="text-red-500 text-sm mt-1">{validationErrors.email}</p>
                  )}
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Website
                  </label>
                  <input
                    type="url"
                    name="website"
                    value={formData.website}
                    onChange={handleChange}
                    placeholder="https://yourwebsite.com"
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  />
                </div>

                <div className="flex items-center pt-6">
                  <label className="flex items-center cursor-pointer">
                    <input
                      type="checkbox"
                      name="verified_seller"
                      checked={formData.verified_seller}
                      onChange={handleChange}
                      className="w-5 h-5 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
                    />
                    <span className="ml-2 text-sm text-gray-700">Verified seller</span>
                  </label>
                </div>

                <div className="flex items-center">
                  <label className="flex items-center cursor-pointer">
                    <input
                      type="checkbox"
                      name="dealership"
                      checked={formData.dealership}
                      onChange={handleChange}
                      className="w-5 h-5 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
                    />
                    <span className="ml-2 text-sm text-gray-700">This is a dealership</span>
                  </label>
                </div>

                <div className="md:col-span-2">
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Seller Description
                  </label>
                  <textarea
                    name="seller_description"
                    value={formData.seller_description}
                    onChange={handleChange}
                    placeholder="Describe yourself or your business..."
                    rows={3}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  />
                </div>
              </div>
            </div>

            {/* Promotion Tiers */}
            <div>
              <h3 className="text-xl font-semibold text-gray-800 mb-4 flex items-center">
                <Star className="w-5 h-5 mr-2 text-blue-600" />
                Promotion Options
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {Object.entries(promotionTiers).map(([key, tier]) => (
                  <div
                    key={key}
                    className={`border-2 rounded-lg p-4 cursor-pointer transition ${
                      formData.promotion_tier === key
                        ? 'border-blue-500 bg-blue-50'
                        : 'border-gray-300 hover:border-blue-300'
                    }`}
                    onClick={() => setFormData(prev => ({ ...prev, promotion_tier: key }))}
                  >
                    <div className="flex items-center justify-between mb-2">
                      <h4 className="font-semibold text-gray-800">{tier.name}</h4>
                      {tier.name === 'Featured' && (
                        <span className="bg-orange-500 text-white text-xs px-2 py-1 rounded-full">Most Popular</span>
                      )}
                      {key === 'top_of_category' && (
                        <Crown className="w-5 h-5 text-yellow-500" />
                      )}
                    </div>
                    <p className="text-2xl font-bold text-blue-600 mb-2">
                      £{tier.price}
                      {tier.price === 0 && <span className="text-sm text-gray-500"> (Free)</span>}
                    </p>
                    <ul className="text-sm text-gray-600 space-y-1">
                      {tier.benefits.map((benefit, index) => (
                        <li key={index} className="flex items-start">
                          <Check className="w-4 h-4 mr-1 text-green-500 flex-shrink-0 mt-0.5" />
                          {benefit}
                        </li>
                      ))}
                    </ul>
                  </div>
                ))}
              </div>
            </div>

            {/* Terms */}
            <div className="border-t border-gray-200 pt-6">
              <div className="space-y-4">
                <label className="flex items-start cursor-pointer">
                  <input
                    type="checkbox"
                    name="terms_accepted"
                    checked={formData.terms_accepted}
                    onChange={handleChange}
                    className={`w-5 h-5 text-blue-600 border-gray-300 rounded focus:ring-blue-500 mt-0.5 ${
                      validationErrors.terms_accepted ? 'border-red-500' : ''
                    }`}
                  />
                  <span className="ml-3 text-sm text-gray-700">
                    I agree to the terms and conditions of posting a vehicle advert on Worldwide Adverts *
                  </span>
                </label>
                {validationErrors.terms_accepted && (
                  <p className="text-red-500 text-sm">{validationErrors.terms_accepted}</p>
                )}

                <label className="flex items-start cursor-pointer">
                  <input
                    type="checkbox"
                    name="accurate_info"
                    checked={formData.accurate_info}
                    onChange={handleChange}
                    className={`w-5 h-5 text-blue-600 border-gray-300 rounded focus:ring-blue-500 mt-0.5 ${
                      validationErrors.accurate_info ? 'border-red-500' : ''
                    }`}
                  />
                  <span className="ml-3 text-sm text-gray-700">
                    I confirm that all information provided is accurate and truthful *
                  </span>
                </label>
                {validationErrors.accurate_info && (
                  <p className="text-red-500 text-sm">{validationErrors.accurate_info}</p>
                )}
              </div>
            </div>

            {/* Submit Button */}
            <div className="flex gap-4">
              <button
                type="submit"
                disabled={loading}
                className="flex-1 bg-blue-600 text-white py-4 rounded-lg hover:bg-blue-700 transition font-semibold text-lg flex items-center justify-center"
              >
                {loading ? (
                  <span className="flex items-center">
                    <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white mr-2"></div>
                    Submitting...
                  </span>
                ) : (
                  <span className="flex items-center">
                    <Save className="w-5 h-5 mr-2" />
                    Submit Vehicle Advert
                  </span>
                )}
              </button>
              <button
                type="button"
                onClick={onClose}
                className="px-8 py-4 bg-gray-200 text-gray-800 rounded-lg hover:bg-gray-300 transition font-semibold"
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

export default VehiclesPostForm;
