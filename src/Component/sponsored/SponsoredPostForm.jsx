import React, { useState, useEffect } from 'react';
import { X, Crown, Upload, MapPin, Globe, Phone, Mail, CheckCircle, AlertCircle, Sparkles } from 'lucide-react';
import sponsoredAdvertsAPI from '../../api/sponsoredAdvertsAPI';
import { mapSponsoredAdvertToForm, resolveStorageUrl } from '../../utils/dashboardEditMappers';

const SponsoredPostForm = ({ onCancel = () => {}, onSuccess, pricingPlans, editingAdvert = null }) => {
  const isEditing = Boolean(editingAdvert?.sponsored_advert_id ?? editingAdvert?.id);
  const editingId = editingAdvert?.sponsored_advert_id ?? editingAdvert?.id;
  // Form state - single page form
  const [formData, setFormData] = useState({
    advert_type: '',
    title: '',
    tagline: '',
    description: '',
    category_id: '',
    condition: '',
    price: '',
    currency: 'GBP',
    country: '',
    city: '',
    latitude: '',
    longitude: '',
    location_precision: 'approximate',
    main_image: null,
    additional_images: [],
    video_link: '',
    seller_name: '',
    business_name: '',
    phone: '',
    email: '',
    website: '',
    social_links: [],
    logo: null,
    verified_seller: false,
    sponsorship_tier: 'basic',
    sponsorship_price: 0
  });

  // Categories state
  const [categories, setCategories] = useState([]);
  const [loadingCategories, setLoadingCategories] = useState(true);

  // Load categories on mount
  useEffect(() => {
    const loadCategories = async () => {
      try {
        const response = await sponsoredAdvertsAPI.getCategories();
        if (response?.success && response?.data) {
          setCategories(response.data);
        }
      } catch (error) {
        console.error('Error loading categories:', error);
      } finally {
        setLoadingCategories(false);
      }
    };
    loadCategories();
  }, []);

  useEffect(() => {
    if (!editingAdvert) return;
    setFormData(mapSponsoredAdvertToForm(editingAdvert));
    const mainImg = editingAdvert.main_image || editingAdvert.image;
    if (mainImg) setMainImagePreview(resolveStorageUrl(mainImg));
    const logo = editingAdvert.logo || editingAdvert.business_logo;
    if (logo) setLogoPreview(resolveStorageUrl(logo));
    if (Array.isArray(editingAdvert.additional_images)) {
      setAdditionalImagePreviews(
        editingAdvert.additional_images.map((img) => resolveStorageUrl(img)).filter(Boolean)
      );
    }
  }, [editingAdvert]);

  // Form submission state
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submissionError, setSubmissionError] = useState(null);
  const [submissionSuccess, setSubmissionSuccess] = useState(false);
  const [fieldErrors, setFieldErrors] = useState({});

  // Image preview states
  const [mainImagePreview, setMainImagePreview] = useState(null);
  const [additionalImagePreviews, setAdditionalImagePreviews] = useState([]);
  const [logoPreview, setLogoPreview] = useState(null);

  const countries = [
    'United Kingdom', 'United States', 'Canada', 'Australia', 'Germany', 
    'France', 'Italy', 'Spain', 'UAE', 'Singapore', 'Japan', 'China'
  ];

  const conditions = ['new', 'used', 'not_applicable'];
  const advertTypes = ['product', 'service', 'property', 'job', 'event', 'vehicle', 'business', 'other'];

  // Helper function to get field error message
  const getFieldError = (fieldName) => {
    if (fieldErrors[fieldName]) {
      return Array.isArray(fieldErrors[fieldName]) ? fieldErrors[fieldName][0] : fieldErrors[fieldName];
    }
    return null;
  };

  // Helper function to render field error
  const renderFieldError = (fieldName) => {
    const error = getFieldError(fieldName);
    if (error) {
      return (
        <p className="mt-1 text-sm text-red-600">{error}</p>
      );
    }
    return null;
  };

  // Handle input changes
  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : (name === 'social_links' ? value.split(',').map(link => link.trim()).filter(link => link) : value)
    }));

    // Clear field error when user starts typing
    if (fieldErrors[name]) {
      setFieldErrors(prev => {
        const newErrors = { ...prev };
        delete newErrors[name];
        return newErrors;
      });
    }
  };

  // Handle main image upload
  const handleMainImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      console.log('File selected:', file.name, file.type, file.size);

      // Clear main_image error
      setFieldErrors(prev => {
        const newErrors = { ...prev };
        delete newErrors.main_image;
        return newErrors;
      });

      // Validate file type - more lenient
      const allowedTypes = ['image/jpeg', 'image/png', 'image/jpg', 'image/gif', 'image/webp'];
      if (!allowedTypes.includes(file.type)) {
        console.error('Invalid file type:', file.type);
        setSubmissionError(`Main image must be a JPEG, PNG, JPG, GIF, or WebP file. Got: ${file.type}`);
        return;
      }
      // Validate file size (max 5MB for testing)
      const maxSize = 5 * 1024 * 1024; // 5MB in bytes
      if (file.size > maxSize) {
        console.error('File too large:', file.size);
        setSubmissionError('Main image must be less than 5MB');
        return;
      }

      console.log('Setting preview...');
      setFormData(prev => ({ ...prev, main_image: file }));
      setMainImagePreview(URL.createObjectURL(file));
      console.log('Preview set:', URL.createObjectURL(file));
    }
  };

  // Handle additional images upload
  const handleAdditionalImagesChange = (e) => {
    const files = Array.from(e.target.files);
    setFormData(prev => ({ ...prev, additional_images: [...prev.additional_images, ...files] }));
    const previews = files.map(file => URL.createObjectURL(file));
    setAdditionalImagePreviews(prev => [...prev, ...previews]);
  };

  // Remove additional image
  const removeAdditionalImage = (index) => {
    setFormData(prev => ({
      ...prev,
      additional_images: prev.additional_images.filter((_, i) => i !== index)
    }));
    setAdditionalImagePreviews(prev => prev.filter((_, i) => i !== index));
  };

  // Handle logo upload
  const handleLogoChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setFormData(prev => ({ ...prev, logo: file }));
      setLogoPreview(URL.createObjectURL(file));
    }
  };

  // Handle tier selection
  const handleTierChange = (tier) => {
    const plan = pricingPlans?.find(p => p.tier === tier);
    setFormData(prev => ({
      ...prev,
      sponsorship_tier: tier,
      sponsorship_price: plan?.price || ''
    }));
  };

  // Form validation
  const validateForm = () => {
    const required = [
      'advert_type', 'title', 'description', 'country', 'city',
      'seller_name', 'phone', 'email', 'sponsorship_tier'
    ];

    for (const field of required) {
      if (!formData[field]) {
        return false;
      }
    }

    // Email validation
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(formData.email)) {
      return false;
    }

    return true;
  };

  // Form submission
  const handleSubmit = async (e) => {
    e.preventDefault();
    
    console.log('📋 Form data before submission:', formData);
    console.log('📋 category_id:', formData.category_id);
    console.log('📋 email:', formData.email);
    
    if (!validateForm()) {
      setSubmissionError('Please fill in all required fields correctly.');
      return;
    }

    setIsSubmitting(true);
    setSubmissionError(null);

    try {
      // Create FormData for file upload
      const submitData = new FormData();
      
      // Debug: Log what we're about to send
      console.log('📝 Form submission debug:', {
        main_image: formData.main_image,
        main_image_type: formData.main_image?.type,
        main_image_name: formData.main_image?.name,
        main_image_constructor: formData.main_image?.constructor?.name,
        is_file_instance: formData.main_image instanceof File,
        is_blob_instance: formData.main_image instanceof Blob
      });
      
      // Add all form fields with proper type handling
      Object.keys(formData).forEach(key => {
        if (key !== 'main_image' && key !== 'additional_images' && key !== 'logo' && key !== 'social_links' && key !== 'preferred_contact') {
          const value = formData[key];
          // Always send required fields even if empty
          const requiredFields = ['category_id', 'email', 'advert_type', 'title', 'description', 'country', 'city', 'seller_name', 'phone', 'sponsorship_tier'];

          // Handle boolean values
          if (key === 'verified_seller') {
            submitData.append(key, value ? '1' : '0');
          }
          // Handle number values
          else if (key === 'sponsorship_price' || key === 'price') {
            submitData.append(key, String(value || 0));
          }
          // Handle required fields or non-empty fields
          else if (requiredFields.includes(key) || (value !== null && value !== undefined && value !== '')) {
            submitData.append(key, value || '');
          }
        }
      });

      // Handle social_links array - append each item individually for Laravel
      if (Array.isArray(formData.social_links) && formData.social_links.length > 0) {
        formData.social_links.forEach((link, index) => {
          if (link && link.trim() !== '') {
            submitData.append(`social_links[${index}]`, link.trim());
          }
        });
      }

      // Add files - convert Blob to File if needed
      if (formData.main_image) {
        console.log('Main image being sent:', formData.main_image);
        console.log('Main image type:', formData.main_image.type);
        console.log('Main image name:', formData.main_image.name);
        
        // Ensure we have a proper File with name
        let imageFile = formData.main_image;
        if (!(imageFile instanceof File) && imageFile instanceof Blob) {
          // If it's a Blob without name, convert to File
          const fileName = imageFile.name || `image_${Date.now()}.jpg`;
          imageFile = new File([imageFile], fileName, { type: imageFile.type || 'image/jpeg' });
          console.log('Converted Blob to File:', imageFile.name);
        }
        
        submitData.append('main_image', imageFile, imageFile.name);
      } else {
        console.log('No main image provided');
      }

      if (formData.logo) {
        let logoFile = formData.logo;
        if (!(logoFile instanceof File) && logoFile instanceof Blob) {
          const fileName = logoFile.name || `logo_${Date.now()}.jpg`;
          logoFile = new File([logoFile], fileName, { type: logoFile.type || 'image/jpeg' });
        }
        submitData.append('logo', logoFile, logoFile.name);
      }

      if (formData.additional_images.length > 0) {
        formData.additional_images.forEach((file, index) => {
          let imageFile = file;
          if (!(imageFile instanceof File) && imageFile instanceof Blob) {
            const fileName = imageFile.name || `additional_${index}_${Date.now()}.jpg`;
            imageFile = new File([imageFile], fileName, { type: imageFile.type || 'image/jpeg' });
          }
          submitData.append(`additional_images[${index}]`, imageFile, imageFile.name);
        });
      }

      // Debug: log FormData contents
      console.log('FormData entries:');
      for (let [key, value] of submitData.entries()) {
        console.log(key, value);
      }

      // Submit to API
      const response = isEditing
        ? await sponsoredAdvertsAPI.updateSponsoredAdvert(editingId, submitData)
        : await sponsoredAdvertsAPI.createSponsoredAdvert(submitData);
      
      if (response?.success) {
        setSubmissionSuccess(true);
        setTimeout(() => {
          onSuccess();
        }, isEditing ? 500 : 2000);
      } else {
        setSubmissionError(response?.message || `Failed to ${isEditing ? 'update' : 'create'} sponsored advert`);
      }
    } catch (error) {
      console.error('Error submitting form:', error);
      console.error('Error response:', error.response);

      // Extract field-specific validation errors
      if (error.response?.data?.errors) {
        setFieldErrors(error.response.data.errors);
        setSubmissionError('Please fix the validation errors below.');
      } else {
        setSubmissionError(error.message || 'An error occurred while submitting the form');
      }
    } finally {
      setIsSubmitting(false);
    }
  };

  if (submissionSuccess) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-yellow-50 via-orange-50 to-amber-50 flex items-center justify-center">
        <div className="bg-white rounded-2xl shadow-xl p-8 max-w-md mx-4 text-center">
          <div className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-6">
            <CheckCircle className="w-12 h-12 text-green-600" />
          </div>
          <h2 className="text-2xl font-bold text-gray-900 mb-2">Advert Submitted Successfully!</h2>
          <p className="text-gray-600 mb-6">Your sponsored advert has been created and is pending payment activation.</p>
          <div className="animate-pulse text-sm text-gray-500">Redirecting...</div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-yellow-50 via-orange-50 to-amber-50">
      {/* Header */}
      <div className="bg-white border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <div className="w-10 h-10 bg-gradient-to-br from-yellow-500 to-orange-500 rounded-lg flex items-center justify-center">
                <Crown className="w-6 h-6 text-white" />
              </div>
              <div>
                <h1 className="text-2xl font-bold text-gray-900">Post Sponsored Advert</h1>
                <p className="text-sm text-gray-600">Create premium adverts with maximum visibility</p>
              </div>
            </div>
            <button
              type="button"
              onClick={onCancel}
              className="p-2 hover:bg-gray-100 rounded-full transition-colors"
            >
              <X className="w-6 h-6 text-gray-500" />
            </button>
          </div>
        </div>
      </div>

      {/* Main Form */}
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <form onSubmit={handleSubmit} className="space-y-8">
          {/* Error Message */}
          {submissionError && (
            <div className="bg-red-50 border border-red-200 rounded-lg p-4">
              <div className="flex items-start space-x-2">
                <AlertCircle className="w-5 h-5 text-red-600 mt-0.5" />
                <div>
                  <p className="text-sm font-medium text-red-800">Error</p>
                  <p className="text-sm text-red-700">{submissionError}</p>
                </div>
              </div>
            </div>
          )}

          {/* Basic Information */}
          <div className="bg-white rounded-xl shadow-lg p-6 border border-gray-100">
            <h2 className="text-xl font-bold text-gray-900 mb-6 flex items-center">
              <Sparkles className="w-5 h-5 text-yellow-500 mr-2" />
              Basic Information
            </h2>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Advert Type <span className="text-red-500">*</span>
                </label>
                <select
                  name="advert_type"
                  value={formData.advert_type}
                  onChange={handleChange}
                  required
                  className={`w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-yellow-500 focus:border-transparent ${fieldErrors.advert_type ? 'border-red-500' : 'border-gray-300'}`}
                >
                  <option value="">Select Type</option>
                  {advertTypes.map(type => (
                    <option key={type} value={type}>{type.charAt(0).toUpperCase() + type.slice(1)}</option>
                  ))}
                </select>
                {renderFieldError('advert_type')}
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Title <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  name="title"
                  value={formData.title}
                  onChange={handleChange}
                  required
                  placeholder="Enter advert title"
                  className={`w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-yellow-500 focus:border-transparent ${fieldErrors.title ? 'border-red-500' : 'border-gray-300'}`}
                />
                {renderFieldError('title')}
              </div>

              <div className="md:col-span-2">
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Tagline
                </label>
                <input
                  type="text"
                  name="tagline"
                  value={formData.tagline}
                  onChange={handleChange}
                  placeholder="Short catchy tagline (max 80 characters)"
                  maxLength={80}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-yellow-500 focus:border-transparent"
                />
              </div>

              <div className="md:col-span-2">
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Description <span className="text-red-500">*</span>
                </label>
                <textarea
                  name="description"
                  value={formData.description}
                  onChange={handleChange}
                  required
                  rows={4}
                  placeholder="Describe your advert in detail"
                  className={`w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-yellow-500 focus:border-transparent ${fieldErrors.description ? 'border-red-500' : 'border-gray-300'}`}
                />
                {renderFieldError('description')}
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Price
                </label>
                <input
                  type="number"
                  name="price"
                  value={formData.price}
                  onChange={handleChange}
                  placeholder="0.00"
                  step="0.01"
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-yellow-500 focus:border-transparent"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Currency
                </label>
                <select
                  name="currency"
                  value={formData.currency}
                  onChange={handleChange}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-yellow-500 focus:border-transparent"
                >
                  <option value="GBP">GBP (£)</option>
                  <option value="USD">USD ($)</option>
                  <option value="EUR">EUR (€)</option>
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Condition
                </label>
                <select
                  name="condition"
                  value={formData.condition}
                  onChange={handleChange}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-yellow-500 focus:border-transparent"
                >
                  <option value="">Select Condition</option>
                  {conditions.map(cond => (
                    <option key={cond} value={cond}>{cond.charAt(0).toUpperCase() + cond.slice(1)}</option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Category <span className="text-red-500">*</span>
                </label>
                {loadingCategories ? (
                  <div className="w-full px-4 py-3 border border-gray-300 rounded-lg bg-gray-50 text-gray-500">
                    Loading categories...
                  </div>
                ) : (
                  <select
                    name="category_id"
                    value={formData.category_id}
                    onChange={handleChange}
                    required
                    className={`w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-yellow-500 focus:border-transparent ${fieldErrors.category_id ? 'border-red-500' : 'border-gray-300'}`}
                  >
                    <option value="">Select Category</option>
                    {categories.map(category => (
                      <option key={category.id} value={category.id}>
                        {category.name}
                      </option>
                    ))}
                  </select>
                )}
                {renderFieldError('category_id')}
              </div>
            </div>
          </div>

          {/* Location */}
          <div className="bg-white rounded-xl shadow-lg p-6 border border-gray-100">
            <h2 className="text-xl font-bold text-gray-900 mb-6 flex items-center">
              <MapPin className="w-5 h-5 text-yellow-500 mr-2" />
              Location
            </h2>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Country <span className="text-red-500">*</span>
                </label>
                <select
                  name="country"
                  value={formData.country}
                  onChange={handleChange}
                  required
                  className={`w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-yellow-500 focus:border-transparent ${fieldErrors.country ? 'border-red-500' : 'border-gray-300'}`}
                >
                  <option value="">Select Country</option>
                  {countries.map(country => (
                    <option key={country} value={country}>{country}</option>
                  ))}
                </select>
                {renderFieldError('country')}
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  City <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  name="city"
                  value={formData.city}
                  onChange={handleChange}
                  required
                  placeholder="Enter city"
                  className={`w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-yellow-500 focus:border-transparent ${fieldErrors.city ? 'border-red-500' : 'border-gray-300'}`}
                />
                {renderFieldError('city')}
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
                  placeholder="Latitude"
                  step="0.000001"
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-yellow-500 focus:border-transparent"
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
                  placeholder="Longitude"
                  step="0.000001"
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-yellow-500 focus:border-transparent"
                />
              </div>
            </div>
          </div>

          {/* Contact Information */}
          <div className="bg-white rounded-xl shadow-lg p-6 border border-gray-100">
            <h2 className="text-xl font-bold text-gray-900 mb-6 flex items-center">
              <Globe className="w-5 h-5 text-yellow-500 mr-2" />
              Contact Information
            </h2>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Seller Name <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  name="seller_name"
                  value={formData.seller_name}
                  onChange={handleChange}
                  required
                  placeholder="Your name"
                  className={`w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-yellow-500 focus:border-transparent ${fieldErrors.seller_name ? 'border-red-500' : 'border-gray-300'}`}
                />
                {renderFieldError('seller_name')}
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
                  placeholder="Business name (optional)"
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-yellow-500 focus:border-transparent"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Phone <span className="text-red-500">*</span>
                </label>
                <input
                  type="tel"
                  name="phone"
                  value={formData.phone}
                  onChange={handleChange}
                  required
                  placeholder="Phone number"
                  className={`w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-yellow-500 focus:border-transparent ${fieldErrors.phone ? 'border-red-500' : 'border-gray-300'}`}
                />
                {renderFieldError('phone')}
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Email <span className="text-red-500">*</span>
                </label>
                <input
                  type="email"
                  name="email"
                  value={formData.email}
                  onChange={handleChange}
                  required
                  placeholder="Email address"
                  className={`w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-yellow-500 focus:border-transparent ${fieldErrors.email ? 'border-red-500' : 'border-gray-300'}`}
                />
                {renderFieldError('email')}
              </div>

              <div className="md:col-span-2">
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Website
                </label>
                <input
                  type="url"
                  name="website"
                  value={formData.website}
                  onChange={handleChange}
                  placeholder="https://yourwebsite.com"
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-yellow-500 focus:border-transparent"
                />
              </div>

              <div className="md:col-span-2">
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Social Links (comma-separated)
                </label>
                <input
                  type="text"
                  name="social_links"
                  value={Array.isArray(formData.social_links) ? formData.social_links.join(', ') : formData.social_links}
                  onChange={handleChange}
                  placeholder="https://facebook.com/page, https://twitter.com/handle"
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-yellow-500 focus:border-transparent"
                />
              </div>
            </div>
          </div>

          {/* Images */}
          <div className="bg-white rounded-xl shadow-lg p-6 border border-gray-100">
            <h2 className="text-xl font-bold text-gray-900 mb-6 flex items-center">
              <Upload className="w-5 h-5 text-yellow-500 mr-2" />
              Images
            </h2>
            
            <div className="space-y-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Main Image
                </label>
                <div className={`border-2 border-dashed rounded-lg p-6 text-center transition-colors ${fieldErrors.main_image ? 'border-red-500' : 'border-gray-300 hover:border-yellow-500'}`}>
                  <input
                    type="file"
                    accept="image/jpeg,image/png,image/jpg,image/gif"
                    onChange={handleMainImageChange}
                    className="hidden"
                    id="mainImage"
                  />
                  <label htmlFor="mainImage" className="cursor-pointer">
                    {mainImagePreview ? (
                      <img src={mainImagePreview} alt="Preview" className="max-h-48 mx-auto rounded-lg" />
                    ) : (
                      <div>
                        <Upload className="w-12 h-12 text-gray-400 mx-auto mb-2" />
                        <p className="text-sm text-gray-600">Click to upload main image (JPEG, PNG, JPG, GIF)</p>
                      </div>
                    )}
                  </label>
                </div>
                {renderFieldError('main_image')}
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Additional Images
                </label>
                <div className="border-2 border-dashed border-gray-300 rounded-lg p-6 text-center hover:border-yellow-500 transition-colors">
                  <input
                    type="file"
                    accept="image/*"
                    multiple
                    onChange={handleAdditionalImagesChange}
                    className="hidden"
                    id="additionalImages"
                  />
                  <label htmlFor="additionalImages" className="cursor-pointer">
                    <Upload className="w-12 h-12 text-gray-400 mx-auto mb-2" />
                    <p className="text-sm text-gray-600">Click to upload additional images</p>
                  </label>
                </div>
                {additionalImagePreviews.length > 0 && (
                  <div className="grid grid-cols-4 gap-4 mt-4">
                    {additionalImagePreviews.map((preview, index) => (
                      <div key={index} className="relative">
                        <img src={preview} alt={`Preview ${index}`} className="w-full h-24 object-cover rounded-lg" />
                        <button
                          type="button"
                          onClick={() => removeAdditionalImage(index)}
                          className="absolute top-1 right-1 bg-red-500 text-white rounded-full p-1 hover:bg-red-600"
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
                  Logo
                </label>
                <div className="border-2 border-dashed border-gray-300 rounded-lg p-6 text-center hover:border-yellow-500 transition-colors">
                  <input
                    type="file"
                    accept="image/*"
                    onChange={handleLogoChange}
                    className="hidden"
                    id="logo"
                  />
                  <label htmlFor="logo" className="cursor-pointer">
                    {logoPreview ? (
                      <img src={logoPreview} alt="Logo Preview" className="max-h-32 mx-auto rounded-lg" />
                    ) : (
                      <div>
                        <Upload className="w-12 h-12 text-gray-400 mx-auto mb-2" />
                        <p className="text-sm text-gray-600">Click to upload logo</p>
                      </div>
                    )}
                  </label>
                </div>
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
                  placeholder="https://youtube.com/watch?v=..."
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-yellow-500 focus:border-transparent"
                />
              </div>
            </div>
          </div>

          {/* Promotion Tier */}
          <div className="bg-white rounded-xl shadow-lg p-6 border border-gray-100">
            <h2 className="text-xl font-bold text-gray-900 mb-6 flex items-center">
              <Crown className="w-5 h-5 text-yellow-500 mr-2" />
              Promotion Tier <span className="text-red-500">*</span>
            </h2>
            
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              {['basic', 'plus', 'premium'].map(tier => (
                <div
                  key={tier}
                  onClick={() => handleTierChange(tier)}
                  className={`
                    p-4 rounded-lg border-2 cursor-pointer transition-all
                    ${formData.sponsorship_tier === tier
                      ? 'border-yellow-500 bg-yellow-50'
                      : 'border-gray-200 hover:border-gray-300'
                    }
                  `}
                >
                  <div className="flex items-center justify-between mb-2">
                    <span className="font-bold capitalize">{tier}</span>
                    {formData.sponsorship_tier === tier && (
                      <CheckCircle className="w-5 h-5 text-yellow-500" />
                    )}
                  </div>
                  <p className="text-sm text-gray-600">
                    {pricingPlans?.find(p => p.tier === tier)?.price || '$29.99'} / {tier === 'basic' ? '30 days' : tier === 'plus' ? '60 days' : '90 days'}
                  </p>
                </div>
              ))}
            </div>
          </div>

          {/* Submit Button */}
          <div className="flex items-center justify-between">
            <button
              type="button"
              onClick={onCancel}
              className="px-6 py-3 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50 transition-colors"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={isSubmitting}
              className="px-8 py-3 bg-gradient-to-r from-yellow-500 to-orange-500 text-white font-bold rounded-lg hover:from-yellow-600 hover:to-orange-600 transition-all disabled:opacity-50 disabled:cursor-not-allowed flex items-center space-x-2"
            >
              {isSubmitting ? (
                <>
                  <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white"></div>
                  <span>Submitting...</span>
                </>
              ) : (
                <>
                  <Sparkles className="w-5 h-5" />
                  <span>Submit Advert</span>
                </>
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default SponsoredPostForm;
