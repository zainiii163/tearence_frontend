import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { FaBuilding, FaPhone, FaMapMarkerAlt, FaEnvelope, FaGlobe, FaUser, FaFileUpload, FaSave, FaTimes } from 'react-icons/fa';
import businessService from '../../services/BusinessService';
import { useNavigate } from 'react-router-dom';
import Footer from '../Footer';

const BusinessForm = ({ isEdit = false, embedded = false, onClose, onSuccess }) => {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  
  const [formData, setFormData] = useState({
    business_name: '',
    business_description: '',
    business_phone_number: '',
    business_address: '',
    city: '',
    country: '',
    business_email: '',
    business_logo: null,
    business_website: '',
    booking_url: '',
    business_owner: '',
    personal_phone_number: '',
    personal_email: '',
    business_company_registration: '',
    business_company_name: '',
    business_company_no: '',
    category_id: '',
    hours_weekday: '09:00 – 18:00',
    hours_saturday: '10:00 – 16:00',
    hours_sunday: 'Closed',
    booking_slots: '',
    vat_number: '',
    duns_number: '',
    incorporation_date: '',
    postal_code: '',
  });

  const [logoPreview, setLogoPreview] = useState(null);
  const [categories, setCategories] = useState([]);
  const [loadingCategories, setLoadingCategories] = useState(false);

  useEffect(() => {
    if (isEdit) {
      loadMyBusiness();
    }
    loadCategories();
  }, [isEdit]);

  const loadMyBusiness = async () => {
    try {
      setLoading(true);
      const response = await businessService.getMyBusiness();
      if (response.data) {
        const business = response.data;
        setFormData({
          business_name: business.business_name || business.name || '',
          business_description: business.business_description || '',
          business_phone_number: business.business_phone_number || '',
          business_address: business.business_address || '',
          city: business.city || '',
          country: business.country || '',
          business_email: business.business_email || '',
          business_logo: null,
          business_website: business.business_website || '',
          booking_url: business.booking_url || business.profile?.booking_url || '',
          business_owner: business.business_owner || '',
          personal_phone_number: business.personal_phone_number || '',
          personal_email: business.personal_email || '',
          business_company_registration: business.business_company_registration || '',
          business_company_name: business.business_company_name || '',
          business_company_no: business.business_company_no || '',
          category_id: business.category_id || '',
          hours_weekday:
            business.profile?.opening_hours?.monday ||
            business.category_profile?.opening_hours?.monday ||
            '09:00 – 18:00',
          hours_saturday:
            business.profile?.opening_hours?.saturday ||
            business.category_profile?.opening_hours?.saturday ||
            '10:00 – 16:00',
          hours_sunday:
            business.profile?.opening_hours?.sunday ||
            business.category_profile?.opening_hours?.sunday ||
            'Closed',
          booking_slots: Array.isArray(business.profile?.booking_slots)
            ? business.profile.booking_slots.join(', ')
            : Array.isArray(business.category_profile?.booking_slots)
              ? business.category_profile.booking_slots.join(', ')
              : '',
          vat_number: business.vat_number || '',
          duns_number: business.duns_number || '',
          incorporation_date: business.incorporation_date
            ? String(business.incorporation_date).slice(0, 10)
            : '',
          postal_code: business.postal_code || '',
        });
        if (business.business_logo) {
          setLogoPreview(business.business_logo);
        }
      }
    } catch (err) {
      console.error('Error loading business:', err);
      setError('Failed to load business data');
    } finally {
      setLoading(false);
    }
  };

  const loadCategories = async () => {
    try {
      setLoadingCategories(true);
      const { getBusinessCategories } = await import('../../api/business');
      const response = await getBusinessCategories();
      console.log('Categories response:', response);
      
      // The API returns { status, message, data: { items: [...], total: ... } }
      let categoriesData = [];
      if (response.data && response.data.items && Array.isArray(response.data.items)) {
        categoriesData = response.data.items;
      } else if (response.data && Array.isArray(response.data)) {
        categoriesData = response.data;
      } else if (Array.isArray(response)) {
        categoriesData = response;
      }
      
      setCategories(categoriesData);
      console.log('Loaded categories:', categoriesData.length);
    } catch (err) {
      console.error('Error loading categories:', err);
      setError('Failed to load categories. Please refresh the page.');
    } finally {
      setLoadingCategories(false);
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleLogoChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setFormData(prev => ({
        ...prev,
        business_logo: file
      }));
      
      // Create preview
      const reader = new FileReader();
      reader.onloadend = () => {
        setLogoPreview(reader.result);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setSuccess('');
    setLoading(true);

    try {
      // Prepare data for API - use FormData for file upload
      const dataToSend = new FormData();
      dataToSend.append('business_name', formData.business_name);
      dataToSend.append('business_description', formData.business_description);
      dataToSend.append('business_phone_number', formData.business_phone_number);
      dataToSend.append('business_address', formData.business_address);
      dataToSend.append('business_email', formData.business_email);
      dataToSend.append('business_website', formData.business_website);
      dataToSend.append('booking_url', formData.booking_url || '');
      dataToSend.append('city', formData.city || '');
      dataToSend.append('country', formData.country || '');
      dataToSend.append('business_owner', formData.business_owner);
      dataToSend.append('personal_phone_number', formData.personal_phone_number);
      dataToSend.append('personal_email', formData.personal_email);
      dataToSend.append('business_company_registration', formData.business_company_registration);
      dataToSend.append('business_company_name', formData.business_company_name);
      dataToSend.append('business_company_no', formData.business_company_no);
      dataToSend.append('vat_number', formData.vat_number || '');
      dataToSend.append('duns_number', formData.duns_number || '');
      dataToSend.append('incorporation_date', formData.incorporation_date || '');
      dataToSend.append('postal_code', formData.postal_code || '');
      dataToSend.append('category_id', formData.category_id);

      const opening_hours = {
        monday: formData.hours_weekday,
        tuesday: formData.hours_weekday,
        wednesday: formData.hours_weekday,
        thursday: formData.hours_weekday,
        friday: formData.hours_weekday,
        saturday: formData.hours_saturday,
        sunday: formData.hours_sunday,
      };
      const booking_slots = String(formData.booking_slots || '')
        .split(',')
        .map((s) => s.trim())
        .filter(Boolean);
      dataToSend.append(
        'category_profile',
        JSON.stringify({
          opening_hours,
          booking_slots,
          booking_url: formData.booking_url || formData.business_website || null,
          booking_phone: formData.business_phone_number || null,
        })
      );

      // Only include logo if it's a file
      if (formData.business_logo instanceof File) {
        dataToSend.append('business_logo', formData.business_logo);
      }

      console.log('Sending business data:', dataToSend);

      let response;
      if (isEdit) {
        // For edit, we need the business ID - we'll need to get it from myBusiness
        const myBusinessData = await businessService.getMyBusiness();
        if (myBusinessData.data && myBusinessData.data.id) {
          response = await businessService.updateBusiness(myBusinessData.data.id, dataToSend);
        } else {
          throw new Error('Business ID not found');
        }
      } else {
        response = await businessService.createBusiness(dataToSend);
      }

      setSuccess(isEdit ? 'Business updated successfully!' : 'Business created successfully!');
      
      if (embedded) {
        onSuccess?.(response?.data || response);
        onClose?.();
      } else {
        setTimeout(() => {
          navigate('/business');
        }, 2000);
      }
    } catch (err) {
      console.error('Error saving business:', err);
      
      // Extract detailed error message
      let errorMessage = 'Failed to save business';
      
      if (err.response?.data) {
        const errorData = err.response.data;
        
        // Check for validation errors
        if (errorData.errors && typeof errorData.errors === 'object') {
          const errorMessages = Object.values(errorData.errors).flat();
          errorMessage = errorMessages.join(', ');
        } else if (errorData.message) {
          errorMessage = errorData.message;
        } else if (typeof errorData === 'string') {
          errorMessage = errorData;
        }
      } else if (err.message) {
        errorMessage = err.message;
      }
      
      setError(errorMessage);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 via-white to-gray-100 py-12">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="bg-white rounded-2xl shadow-xl overflow-hidden"
        >
          {/* Header */}
          <div className="bg-gradient-to-r from-purple-600 to-indigo-600 px-8 py-6">
            <div className="flex items-center justify-between">
              <div>
                <h1 className="text-3xl font-bold text-white">
                  {isEdit ? 'Edit Business' : 'Create Business'}
                </h1>
                <p className="text-white/90 mt-1">
                  {isEdit ? 'Update your business information' : 'Register your business on our platform'}
                </p>
              </div>
              <button
                onClick={() => (embedded ? onClose?.() : navigate('/business'))}
                className="text-white/80 hover:text-white transition-colors"
              >
                <FaTimes className="h-6 w-6" />
              </button>
            </div>
          </div>

          {/* Form */}
          <div className="p-8">
            {error && (
              <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-xl text-red-700">
                {error}
              </div>
            )}

            {success && (
              <div className="mb-6 p-4 bg-green-50 border border-green-200 rounded-xl text-green-700">
                {success}
              </div>
            )}

            <form onSubmit={handleSubmit} className="space-y-6">
              {/* Logo Upload */}
              <div className="flex items-center gap-6 p-6 bg-gray-50 rounded-xl">
                <div className="w-32 h-32 bg-gray-200 rounded-xl flex items-center justify-center overflow-hidden">
                  {logoPreview ? (
                    <img src={logoPreview} alt="Logo preview" className="w-full h-full object-cover" />
                  ) : (
                    <FaBuilding className="h-12 w-12 text-gray-400" />
                  )}
                </div>
                <div className="flex-1">
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Business Logo
                  </label>
                  <input
                    type="file"
                    name="business_logo"
                    onChange={handleLogoChange}
                    accept="image/*"
                    className="block w-full text-sm text-gray-500
                      file:mr-4 file:py-2 file:px-4
                      file:rounded-full file:border-0
                      file:text-sm file:font-semibold
                      file:bg-purple-50 file:text-purple-700
                      hover:file:bg-purple-100"
                  />
                  <p className="text-xs text-gray-500 mt-1">
                    Recommended size: 200x200px. Max 2MB.
                  </p>
                </div>
              </div>

              {/* Business Description */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Business Description
                </label>
                <textarea
                  name="business_description"
                  value={formData.business_description}
                  onChange={handleChange}
                  rows={4}
                  className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent resize-none"
                  placeholder="Describe your business, products, or services..."
                />
              </div>

              {/* Required Fields */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Business Name <span className="text-red-500">*</span>
                  </label>
                  <div className="relative">
                    <FaBuilding className="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-400" />
                    <input
                      type="text"
                      name="business_name"
                      value={formData.business_name}
                      onChange={handleChange}
                      required
                      className="w-full pl-12 pr-4 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                      placeholder="Enter business name"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Business Category
                  </label>
                  <select
                    name="category_id"
                    value={formData.category_id}
                    onChange={handleChange}
                    disabled={loadingCategories}
                    className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent disabled:bg-gray-100 disabled:cursor-not-allowed"
                  >
                    <option value="">{loadingCategories ? 'Loading categories...' : 'Select a category'}</option>
                    {categories.map((category) => (
                      <option key={category.category_id} value={category.category_id}>
                        {category.name}
                      </option>
                    ))}
                  </select>
                  {categories.length === 0 && !loadingCategories && (
                    <p className="mt-1 text-sm text-red-600">No categories available. Please refresh the page.</p>
                  )}
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Business Phone <span className="text-red-500">*</span>
                  </label>
                  <div className="relative">
                    <FaPhone className="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-400" />
                    <input
                      type="tel"
                      name="business_phone_number"
                      value={formData.business_phone_number}
                      onChange={handleChange}
                      required
                      className="w-full pl-12 pr-4 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                      placeholder="Enter business phone"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Business Email <span className="text-red-500">*</span>
                  </label>
                  <div className="relative">
                    <FaEnvelope className="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-400" />
                    <input
                      type="email"
                      name="business_email"
                      value={formData.business_email}
                      onChange={handleChange}
                      required
                      className="w-full pl-12 pr-4 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                      placeholder="Enter business email"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Business Website
                  </label>
                  <div className="relative">
                    <FaGlobe className="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-400" />
                    <input
                      type="url"
                      name="business_website"
                      value={formData.business_website}
                      onChange={handleChange}
                      className="w-full pl-12 pr-4 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                      placeholder="https://example.com"
                    />
                  </div>
                </div>
              </div>

              {/* Address */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Business Address <span className="text-red-500">*</span>
                </label>
                <div className="relative">
                  <FaMapMarkerAlt className="absolute left-4 top-4 h-5 w-5 text-gray-400" />
                  <textarea
                    name="business_address"
                    value={formData.business_address}
                    onChange={handleChange}
                    required
                    rows={3}
                    className="w-full pl-12 pr-4 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent resize-none"
                    placeholder="Enter full business address"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">City</label>
                  <input
                    type="text"
                    name="city"
                    value={formData.city}
                    onChange={handleChange}
                    className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-purple-500"
                    placeholder="City"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Country</label>
                  <input
                    type="text"
                    name="country"
                    value={formData.country}
                    onChange={handleChange}
                    className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-purple-500"
                    placeholder="Country"
                  />
                </div>
              </div>

              {/* Category profile — hours & booking */}
              <div className="border-t border-gray-200 pt-6">
                <h3 className="text-lg font-semibold text-gray-900 mb-1">Opening times & booking</h3>
                <p className="text-sm text-gray-500 mb-4">
                  Shown on your category profile (restaurants, automotive, clinics, etc.).
                </p>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Mon–Fri</label>
                    <input
                      type="text"
                      name="hours_weekday"
                      value={formData.hours_weekday}
                      onChange={handleChange}
                      className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-purple-500"
                      placeholder="09:00 – 18:00"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Saturday</label>
                    <input
                      type="text"
                      name="hours_saturday"
                      value={formData.hours_saturday}
                      onChange={handleChange}
                      className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-purple-500"
                      placeholder="10:00 – 16:00"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Sunday</label>
                    <input
                      type="text"
                      name="hours_sunday"
                      value={formData.hours_sunday}
                      onChange={handleChange}
                      className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-purple-500"
                      placeholder="Closed"
                    />
                  </div>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Booking URL</label>
                    <input
                      type="url"
                      name="booking_url"
                      value={formData.booking_url}
                      onChange={handleChange}
                      className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-purple-500"
                      placeholder="https://…"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Booking slots (comma-separated)
                    </label>
                    <input
                      type="text"
                      name="booking_slots"
                      value={formData.booking_slots}
                      onChange={handleChange}
                      className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-purple-500"
                      placeholder="Lunch, Dinner, Morning MOT"
                    />
                  </div>
                </div>
              </div>

              {/* Owner Information */}
              <div className="border-t border-gray-200 pt-6">
                <h3 className="text-lg font-semibold text-gray-900 mb-4">Owner Information</h3>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Business Owner
                    </label>
                    <div className="relative">
                      <FaUser className="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-400" />
                      <input
                        type="text"
                        name="business_owner"
                        value={formData.business_owner}
                        onChange={handleChange}
                        className="w-full pl-12 pr-4 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                        placeholder="Owner's full name"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Personal Phone
                    </label>
                    <div className="relative">
                      <FaPhone className="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-400" />
                      <input
                        type="tel"
                        name="personal_phone_number"
                        value={formData.personal_phone_number}
                        onChange={handleChange}
                        className="w-full pl-12 pr-4 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                        placeholder="Owner's phone number"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Personal Email
                    </label>
                    <div className="relative">
                      <FaEnvelope className="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-400" />
                      <input
                        type="email"
                        name="personal_email"
                        value={formData.personal_email}
                        onChange={handleChange}
                        className="w-full pl-12 pr-4 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                        placeholder="Owner's email"
                      />
                    </div>
                  </div>
                </div>
              </div>

              {/* Company Information */}
              <div className="border-t border-gray-200 pt-6">
                <h3 className="text-lg font-semibold text-gray-900 mb-1">Company details</h3>
                <p className="text-sm text-gray-500 mb-4">
                  These fields appear on your public business page (company name, number, incorporation, VAT, DUNS, website, email, phone, address).
                </p>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Company name
                    </label>
                    <input
                      type="text"
                      name="business_company_name"
                      value={formData.business_company_name}
                      onChange={handleChange}
                      className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                      placeholder="Legal company name"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Company number
                    </label>
                    <input
                      type="text"
                      name="business_company_no"
                      value={formData.business_company_no}
                      onChange={handleChange}
                      className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                      placeholder="Companies House / registration number"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Incorporation date
                    </label>
                    <input
                      type="date"
                      name="incorporation_date"
                      value={formData.incorporation_date}
                      onChange={handleChange}
                      className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      VAT number
                    </label>
                    <input
                      type="text"
                      name="vat_number"
                      value={formData.vat_number}
                      onChange={handleChange}
                      className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                      placeholder="VAT / GST number"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      DUNS
                    </label>
                    <input
                      type="text"
                      name="duns_number"
                      value={formData.duns_number}
                      onChange={handleChange}
                      className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                      placeholder="D-U-N-S number"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Company registration number
                    </label>
                    <input
                      type="text"
                      name="business_company_registration"
                      value={formData.business_company_registration}
                      onChange={handleChange}
                      className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                      placeholder="If different from company number"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Postcode
                    </label>
                    <input
                      type="text"
                      name="postal_code"
                      value={formData.postal_code}
                      onChange={handleChange}
                      className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                      placeholder="WS10 0TH"
                    />
                  </div>
                </div>
              </div>

              {/* Submit Button */}
              <div className="flex items-center justify-end gap-4 pt-6">
                <button
                  type="button"
                  onClick={() => (embedded ? onClose?.() : navigate('/business'))}
                  className="px-6 py-3 border border-gray-300 rounded-xl text-gray-700 hover:bg-gray-50 transition-colors font-semibold"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={loading}
                  className="flex items-center gap-2 px-8 py-3 bg-gradient-to-r from-purple-600 to-indigo-600 text-white rounded-xl hover:from-purple-700 hover:to-indigo-700 transition-all duration-300 font-semibold shadow-md hover:shadow-lg disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  <FaSave />
                  {loading ? 'Saving...' : (isEdit ? 'Update Business' : 'Create Business')}
                </button>
              </div>
            </form>
          </div>
        </motion.div>
      </div>
      
      {!embedded && <Footer />}
    </div>
  );
};

export default BusinessForm;
