import React, { useState, useMemo, useEffect } from 'react';
import { motion } from 'framer-motion';
import {
  X, Check, Upload, Camera, MapPin, Home, Building, Factory, Trees, Star,
  Calendar, DollarSign, BedDouble, Bath, Square, User, FileText, Eye, Crown
} from 'lucide-react';
import { usePropertySubmission, usePropertyData } from '../../hooks/useProperties';
import propertyApi from '../../services/propertyApi';
import { mapPropertyToForm, resolveStorageUrl } from '../../utils/dashboardEditMappers';
import { PROPERTY_CONTINENTS } from '../../data/propertyContinents';

/**
 * Single-page Property Posting Form.
 * All fields are visible in one scrollable modal — no Next/Previous navigation.
 * Sends a multipart/form-data request to POST /api/v1/properties.
 */

const ICON_BY_TYPE = {
  residential: Home,
  commercial: Building,
  industrial: Factory,
  land: Trees,
  agricultural: Trees,
  luxury: Star,
  short_term_rental: Calendar,
  investment: DollarSign,
  new_development: Building,
};

const PROMOTION_TIERS = [
  { id: 'standard',  name: 'Basic Listing',     price: 'Free', icon: Home,  color: 'gray',
    features: ['Standard visibility', '30 days active', 'Standard support'] },
  { id: 'promoted',  name: 'Promoted Listing',  price: '$29',  icon: Eye,   color: 'blue',
    features: ['Enhanced visibility', 'Promoted badge', 'Highlighted card', '60 days active'] },
  { id: 'featured',  name: 'Featured Listing',  price: '$79',  icon: Star,  color: 'purple', popular: true,
    features: ['Top of category', 'Larger display card', '90 days active', 'Weekly email feature'] },
  { id: 'sponsored', name: 'Sponsored Listing', price: '$199', icon: Crown, color: 'yellow',
    features: ['Homepage placement', 'Homepage slider', '180 days active', 'Social media promotion'] },
];

const COUNTRIES = Array.from(
  new Set(PROPERTY_CONTINENTS.flatMap((c) => c.countries))
).sort((a, b) => a.localeCompare(b));

const CURRENCIES = ['USD', 'EUR', 'GBP', 'AED', 'SAR', 'INR', 'AUD', 'CAD', 'JPY', 'CNY'];

const PropertyPostForm = ({ onClose, onSubmit, editProperty = null }) => {
  const isEditing = Boolean(editProperty?.id);
  const { categories, propertyTypes, commercialTypes, landTypes, planningPermissions, viewTypes } = usePropertyData();
  const { submitProperty, loading, error, success } = usePropertySubmission();

  const [errors, setErrors] = useState({});
  const [existingCoverUrl, setExistingCoverUrl] = useState('');
  const [formData, setFormData] = useState({
    // Type & category
    property_type: '',
    category: 'buy',

    // Basic
    title: '',
    tagline: '',
    country: '',
    city: '',
    region: '',
    address: '',
    cover_image: null,
    additional_images: [],
    video_tour_link: '',

    // Residential
    bedrooms: '',
    bathrooms: '',
    property_size: '',
    size_unit: 'sq_ft',
    furnished: false,
    parking_spaces: '',

    // Commercial
    commercial_type: '',
    floor_area: '',
    footfall_rating: '',
    accessibility_features: false,

    // Industrial
    zoning_type: '',
    warehouse_size: '',
    loading_bays: '',
    power_capacity: '',
    ceiling_height: '',

    // Land
    land_size: '',
    land_type: '',
    planning_permission: '',
    soil_quality: '',

    // Luxury
    premium_features: [],
    security_features: [],
    view_type: '',

    // Investment
    rental_yield: '',
    occupancy_rate: '',
    current_rental_income: '',
    roi_percentage: '',

    // Pricing
    price: '',
    currency: 'USD',
    negotiable: false,
    deposit: '',
    service_charges: '',
    maintenance_fees: '',

    // Seller / Agent
    seller_name: '',
    seller_company: '',
    seller_phone: '',
    seller_email: '',
    seller_website: '',
    seller_logo: null,
    verified_agent: false,

    // Description
    overview: '',
    key_features: '',
    location_highlights: '',
    nearby_amenities: '',
    transport_links: '',
    additional_notes: '',
    amenities: [],

    // Map
    latitude: '',
    longitude: '',
    show_exact_location: true,

    // Promotion
    advert_type: 'standard',

    // Final
    terms_accepted: false,
    accuracy_confirmed: false,
  });

  useEffect(() => {
    if (!editProperty?.id) return;
    let cancelled = false;

    const loadProperty = async () => {
      try {
        const response = await propertyApi.getProperty(editProperty.id);
        const property = response?.data ?? response;
        if (cancelled || !property) return;
        setFormData((prev) => ({ ...prev, ...mapPropertyToForm(property) }));
        const cover = property.cover_image || property.main_image || property.image;
        if (cover) setExistingCoverUrl(resolveStorageUrl(cover));
      } catch {
        if (!cancelled) {
          setFormData((prev) => ({ ...prev, ...mapPropertyToForm(editProperty) }));
          const cover = editProperty.cover_image || editProperty.main_image;
          if (cover) setExistingCoverUrl(resolveStorageUrl(cover));
        }
      }
    };

    loadProperty();
    return () => { cancelled = true; };
  }, [editProperty]);

  const displayPropertyTypes = useMemo(() => {
    if (propertyTypes && propertyTypes.length > 0) {
      return propertyTypes.map(t => ({ ...t, icon: ICON_BY_TYPE[t.id] || Home }));
    }
    return [];
  }, [propertyTypes]);

  const displayCategories = categories && categories.length > 0 ? categories : [];

  const update = (field, value) => {
    setFormData(prev => ({ ...prev, [field]: value }));
    if (errors[field]) {
      setErrors(prev => {
        const n = { ...prev };
        delete n[field];
        return n;
      });
    }
  };

  const handleFile = (e, field) => {
    const files = e.target.files;
    if (!files || files.length === 0) return;
    if (field === 'additional_images') {
      setFormData(prev => ({ ...prev, additional_images: [...prev.additional_images, ...Array.from(files)] }));
    } else {
      update(field, files[0]);
    }
  };

  const removeAdditional = (i) => {
    setFormData(prev => ({ ...prev, additional_images: prev.additional_images.filter((_, idx) => idx !== i) }));
  };

  const validate = () => {
    const e = {};
    if (!formData.property_type) e.property_type = 'Select a property type';
    if (!formData.title.trim()) e.title = 'Title is required';
    if (!formData.category) e.category = 'Category is required';
    if (!formData.country) e.country = 'Country is required';
    if (!formData.city.trim()) e.city = 'City is required';
    if (!formData.cover_image && !existingCoverUrl) e.cover_image = 'Cover image is required';
    if (!formData.price || Number(formData.price) <= 0) e.price = 'Valid price required';
    if (!formData.seller_name.trim()) e.seller_name = 'Your name is required';
    if (!formData.seller_phone.trim()) e.seller_phone = 'Phone is required';
    if (!formData.seller_email.trim()) e.seller_email = 'Email is required';
    else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.seller_email)) e.seller_email = 'Invalid email';

    if (formData.property_type === 'residential') {
      if (!formData.bedrooms) e.bedrooms = 'Bedrooms required';
      if (!formData.bathrooms) e.bathrooms = 'Bathrooms required';
      if (!formData.property_size) e.property_size = 'Property size required';
    }
    if (formData.property_type === 'commercial') {
      if (!formData.commercial_type) e.commercial_type = 'Commercial type required';
      if (!formData.floor_area) e.floor_area = 'Floor area required';
    }
    if (formData.property_type === 'industrial') {
      if (!formData.zoning_type) e.zoning_type = 'Zoning type required';
      if (!formData.warehouse_size) e.warehouse_size = 'Warehouse size required';
    }
    if (formData.property_type === 'land' || formData.property_type === 'agricultural') {
      if (!formData.land_size) e.land_size = 'Land size required';
      if (!formData.land_type) e.land_type = 'Land type required';
    }
    if (formData.property_type === 'investment') {
      if (!formData.rental_yield) e.rental_yield = 'Rental yield required';
      if (!formData.roi_percentage) e.roi_percentage = 'ROI required';
    }
    if (!formData.terms_accepted) e.terms_accepted = 'You must accept the terms';
    if (!formData.accuracy_confirmed) e.accuracy_confirmed = 'You must confirm accuracy';

    setErrors(e);
    return Object.keys(e).length === 0;
  };

  const handleSubmit = async (ev) => {
    ev.preventDefault();
    if (!validate()) {
      // Scroll to first error
      const firstKey = Object.keys(errors)[0];
      if (firstKey) {
        const el = document.querySelector(`[data-field="${firstKey}"]`);
        if (el) el.scrollIntoView({ behavior: 'smooth', block: 'center' });
      }
      return;
    }

    const fd = new FormData();

    // Explicitly append all required fields first
    fd.append('title', formData.title || '');
    fd.append('category', formData.category || 'buy');
    fd.append('property_type', formData.property_type || '');
    fd.append('country', formData.country || '');
    fd.append('city', formData.city || '');
    fd.append('price', formData.price || '');
    fd.append('currency', formData.currency || 'USD');
    fd.append('seller_name', formData.seller_name || '');
    fd.append('seller_phone', formData.seller_phone || '');
    fd.append('seller_email', formData.seller_email || '');

    // Append other fields
    const skipKeys = ['title', 'category', 'property_type', 'country', 'city', 'price', 'currency', 'seller_name', 'seller_phone', 'seller_email', 'additional_images', 'cover_image', 'seller_logo', 'premium_features', 'security_features', 'amenities', 'location_highlights', 'transport_links'];
    const jsonKeys = ['premium_features', 'security_features', 'amenities', 'location_highlights', 'transport_links'];

    Object.entries(formData).forEach(([k, v]) => {
      if (skipKeys.includes(k)) return;
      if (v === null || v === undefined || v === '') return;
      if (typeof v === 'boolean') fd.append(k, v ? '1' : '0');
      else fd.append(k, v);
    });

    if (formData.cover_image instanceof File) fd.append('cover_image', formData.cover_image);
    if (formData.seller_logo instanceof File) fd.append('seller_logo', formData.seller_logo);

    formData.additional_images.forEach((file) => {
      if (file instanceof File) fd.append('additional_images[]', file);
    });
    
    // Send JSON fields as JSON strings to match backend migration
    if (formData.premium_features && formData.premium_features.length > 0) {
      fd.append('premium_features', JSON.stringify(formData.premium_features));
    }
    if (formData.security_features && formData.security_features.length > 0) {
      fd.append('security_features', JSON.stringify(formData.security_features));
    }
    if (formData.amenities && formData.amenities.length > 0) {
      fd.append('amenities', JSON.stringify(formData.amenities));
    }
    if (formData.location_highlights) {
      fd.append('location_highlights', formData.location_highlights);
    }
    if (formData.transport_links) {
      fd.append('transport_links', formData.transport_links);
    }

    try {
      // Debug: log FormData contents
      console.log('Submitting property form data:');
      for (let [key, value] of fd.entries()) {
        console.log(`${key}:`, value);
      }
      const result = isEditing
        ? await propertyApi.updatePropertyForm(editProperty.id, fd)
        : await submitProperty(fd);
      if (onSubmit) onSubmit(result?.data ?? result);
      // Let parent handle closing
    } catch (_) {
      // error surfaced in `error` from the hook
    }
  };

  const Err = ({ name }) => errors[name] ? (
    <p className="mt-1 text-xs text-red-600">{errors[name]}</p>
  ) : null;

  const inputCls = (name) =>
    `w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 ${
      errors[name] ? 'border-red-500' : 'border-gray-300'
    }`;

  const isResidential = formData.property_type === 'residential' || formData.property_type === 'luxury'
                     || formData.property_type === 'short_term_rental' || formData.property_type === 'new_development';

  return (
    <motion.div
      initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
      className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-start justify-center p-4 overflow-y-auto"
      onClick={(e) => { if (e.target === e.currentTarget) onClose && onClose(); }}
    >
      <motion.div
        initial={{ scale: 0.97, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} exit={{ scale: 0.97, opacity: 0 }}
        className="bg-white rounded-2xl max-w-5xl w-full my-8 shadow-2xl"
      >
        {/* Header */}
        <div className="sticky top-0 z-10 bg-white border-b border-gray-200 px-6 py-4 flex items-center justify-between rounded-t-2xl">
          <div>
            <h2 className="text-2xl font-bold text-gray-900">Post a Property</h2>
            <p className="text-sm text-gray-500">Fill in all required details — everything on one page.</p>
          </div>
          <button onClick={onClose} type="button" className="p-2 rounded-lg hover:bg-gray-100">
            <X className="w-5 h-5" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-6 space-y-10">
          {/* SECTION: PROPERTY TYPE */}
          <section data-field="property_type">
            <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center gap-2"><Building className="w-5 h-5" /> Property Type</h3>
            <div className="grid sm:grid-cols-2 md:grid-cols-3 gap-3">
              {displayPropertyTypes.map((type) => {
                const Icon = type.icon;
                const active = formData.property_type === type.id;
                return (
                  <button type="button" key={type.id} onClick={() => update('property_type', type.id)}
                    className={`text-left p-4 rounded-xl border-2 transition-all ${active ? 'border-blue-500 bg-blue-50' : 'border-gray-200 hover:border-gray-300'}`}>
                    <Icon className="w-6 h-6 text-blue-600 mb-2" />
                    <div className="font-semibold text-gray-900">{type.name}</div>
                  </button>
                );
              })}
              {displayPropertyTypes.length === 0 && (
                <p className="col-span-full text-sm text-gray-500">Loading property types from server…</p>
              )}
            </div>
            <Err name="property_type" />
          </section>

          {/* SECTION: BASIC INFO */}
          <section className="space-y-4">
            <h3 className="text-lg font-semibold text-gray-900 mb-2 flex items-center gap-2"><FileText className="w-5 h-5" /> Basic Information</h3>
            <div className="grid md:grid-cols-2 gap-4">
              <div data-field="title">
                <label className="block text-sm font-medium text-gray-700 mb-1">Property Title *</label>
                <input type="text" value={formData.title} onChange={(e) => update('title', e.target.value)}
                  className={inputCls('title')} placeholder="e.g. Modern 3BR Apartment Downtown" />
                <Err name="title" />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Tagline</label>
                <input type="text" value={formData.tagline} onChange={(e) => update('tagline', e.target.value)}
                  className={inputCls('tagline')} placeholder="e.g. Perfect family home with skyline views" />
              </div>
            </div>

            <div data-field="category">
              <label className="block text-sm font-medium text-gray-700 mb-1">Category *</label>
              <div className="flex flex-wrap gap-2">
                {(displayCategories.length ? displayCategories : []).map(c => (
                  <button key={c.id} type="button" onClick={() => update('category', c.id)}
                    className={`px-4 py-2 rounded-lg font-medium transition-colors ${formData.category === c.id ? 'bg-blue-600 text-white' : 'bg-gray-100 text-gray-700 hover:bg-gray-200'}`}>
                    {c.name || c.label}
                  </button>
                ))}
              </div>
              <Err name="category" />
            </div>

            <div className="grid md:grid-cols-4 gap-4">
              <div data-field="country">
                <label className="block text-sm font-medium text-gray-700 mb-1">Country *</label>
                <select value={formData.country} onChange={(e) => update('country', e.target.value)} className={inputCls('country')}>
                  <option value="">Select country</option>
                  {COUNTRIES.map(c => <option key={c} value={c}>{c}</option>)}
                </select>
                <Err name="country" />
              </div>
              <div data-field="city">
                <label className="block text-sm font-medium text-gray-700 mb-1">City *</label>
                <input type="text" value={formData.city} onChange={(e) => update('city', e.target.value)} className={inputCls('city')} />
                <Err name="city" />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Region / State</label>
                <input type="text" value={formData.region} onChange={(e) => update('region', e.target.value)} className={inputCls('region')} />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Address</label>
                <input type="text" value={formData.address} onChange={(e) => update('address', e.target.value)} className={inputCls('address')} placeholder="Optional for privacy" />
              </div>
            </div>

            {/* Cover image */}
            <div data-field="cover_image">
              <label className="block text-sm font-medium text-gray-700 mb-1">Cover Image *</label>
              <div className={`border-2 border-dashed rounded-lg p-6 text-center ${errors.cover_image ? 'border-red-400' : 'border-gray-300'}`}>
                <input type="file" accept="image/*" onChange={(e) => handleFile(e, 'cover_image')} className="hidden" id="coverImageUpload" />
                <label htmlFor="coverImageUpload" className="cursor-pointer">
                  {formData.cover_image ? (
                    <div className="space-y-2">
                      <img src={URL.createObjectURL(formData.cover_image)} alt="Cover" className="w-40 h-28 object-cover rounded-lg mx-auto" />
                      <p className="text-sm text-blue-600">Click to change</p>
                    </div>
                  ) : (
                    <div>
                      <Camera className="w-10 h-10 text-gray-400 mx-auto mb-2" />
                      <p className="text-sm text-gray-600">Upload cover image (PNG / JPG, max 5MB)</p>
                    </div>
                  )}
                </label>
              </div>
              <Err name="cover_image" />
            </div>

            {/* Additional images */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Additional Images (up to 10)</label>
              <div className="border-2 border-dashed border-gray-300 rounded-lg p-4 text-center">
                <input type="file" accept="image/*" multiple onChange={(e) => handleFile(e, 'additional_images')} className="hidden" id="additionalImagesUpload" />
                <label htmlFor="additionalImagesUpload" className="cursor-pointer">
                  <Upload className="w-8 h-8 text-gray-400 mx-auto mb-1" />
                  <p className="text-sm text-gray-600">Click to upload more images</p>
                </label>
              </div>
              {formData.additional_images.length > 0 && (
                <div className="mt-3 grid grid-cols-4 gap-3">
                  {formData.additional_images.map((img, i) => (
                    <div key={i} className="relative group">
                      <img src={URL.createObjectURL(img)} alt={`extra-${i}`} className="w-full h-20 object-cover rounded-lg" />
                      <button type="button" onClick={() => removeAdditional(i)}
                        className="absolute top-1 right-1 bg-red-500 text-white rounded-full p-1 opacity-0 group-hover:opacity-100">
                        <X className="w-3 h-3" />
                      </button>
                    </div>
                  ))}
                </div>
              )}
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Video Tour Link</label>
              <input type="url" value={formData.video_tour_link} onChange={(e) => update('video_tour_link', e.target.value)}
                className={inputCls('video_tour_link')} placeholder="YouTube or Vimeo URL" />
            </div>
          </section>

          {/* SECTION: SPECIFICATIONS (dynamic by type) */}
          {formData.property_type && (
            <section className="space-y-4">
              <h3 className="text-lg font-semibold text-gray-900 mb-2 flex items-center gap-2"><Square className="w-5 h-5" /> Specifications</h3>

              {/* Residential / Luxury / Short-term / New Development */}
              {isResidential && (
                <div className="grid md:grid-cols-3 gap-4">
                  <div data-field="bedrooms">
                    <label className="block text-sm font-medium text-gray-700 mb-1"><BedDouble className="w-4 h-4 inline mr-1" /> Bedrooms *</label>
                    <input type="number" min="0" value={formData.bedrooms} onChange={(e) => update('bedrooms', e.target.value)} className={inputCls('bedrooms')} />
                    <Err name="bedrooms" />
                  </div>
                  <div data-field="bathrooms">
                    <label className="block text-sm font-medium text-gray-700 mb-1"><Bath className="w-4 h-4 inline mr-1" /> Bathrooms *</label>
                    <input type="number" min="0" value={formData.bathrooms} onChange={(e) => update('bathrooms', e.target.value)} className={inputCls('bathrooms')} />
                    <Err name="bathrooms" />
                  </div>
                  <div data-field="property_size">
                    <label className="block text-sm font-medium text-gray-700 mb-1">Property Size *</label>
                    <div className="flex gap-2">
                      <input type="number" min="0" step="0.01" value={formData.property_size} onChange={(e) => update('property_size', e.target.value)} className={inputCls('property_size') + ' flex-1'} />
                      <select value={formData.size_unit} onChange={(e) => update('size_unit', e.target.value)} className="px-2 py-2 border border-gray-300 rounded-lg">
                        <option value="sq_ft">sq ft</option>
                        <option value="sq_m">sq m</option>
                      </select>
                    </div>
                    <Err name="property_size" />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Parking Spaces</label>
                    <input type="number" min="0" value={formData.parking_spaces} onChange={(e) => update('parking_spaces', e.target.value)} className={inputCls('parking_spaces')} />
                  </div>
                  <label className="flex items-center gap-2 mt-7">
                    <input type="checkbox" checked={formData.furnished} onChange={(e) => update('furnished', e.target.checked)} />
                    <span className="text-sm">Furnished</span>
                  </label>
                </div>
              )}

              {/* Commercial */}
              {formData.property_type === 'commercial' && (
                <div className="grid md:grid-cols-2 gap-4">
                  <div data-field="commercial_type">
                    <label className="block text-sm font-medium text-gray-700 mb-1">Commercial Type *</label>
                    <select value={formData.commercial_type} onChange={(e) => update('commercial_type', e.target.value)} className={inputCls('commercial_type')}>
                      <option value="">Select type</option>
                      {(commercialTypes || []).map(t => <option key={t.id} value={t.id}>{t.name || t.label}</option>)}
                    </select>
                    <Err name="commercial_type" />
                  </div>
                  <div data-field="floor_area">
                    <label className="block text-sm font-medium text-gray-700 mb-1">Floor Area (sq ft) *</label>
                    <input type="number" min="0" step="0.01" value={formData.floor_area} onChange={(e) => update('floor_area', e.target.value)} className={inputCls('floor_area')} />
                    <Err name="floor_area" />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Footfall Rating</label>
                    <select value={formData.footfall_rating} onChange={(e) => update('footfall_rating', e.target.value)} className={inputCls('footfall_rating')}>
                      <option value="">Select</option>
                      <option value="low">Low</option>
                      <option value="medium">Medium</option>
                      <option value="high">High</option>
                    </select>
                  </div>
                  <label className="flex items-center gap-2 mt-7">
                    <input type="checkbox" checked={formData.accessibility_features} onChange={(e) => update('accessibility_features', e.target.checked)} />
                    <span className="text-sm">Accessibility Features</span>
                  </label>
                </div>
              )}

              {/* Industrial */}
              {formData.property_type === 'industrial' && (
                <div className="grid md:grid-cols-3 gap-4">
                  <div data-field="zoning_type">
                    <label className="block text-sm font-medium text-gray-700 mb-1">Zoning Type *</label>
                    <input type="text" value={formData.zoning_type} onChange={(e) => update('zoning_type', e.target.value)} className={inputCls('zoning_type')} />
                    <Err name="zoning_type" />
                  </div>
                  <div data-field="warehouse_size">
                    <label className="block text-sm font-medium text-gray-700 mb-1">Warehouse Size (sq ft) *</label>
                    <input type="number" min="0" step="0.01" value={formData.warehouse_size} onChange={(e) => update('warehouse_size', e.target.value)} className={inputCls('warehouse_size')} />
                    <Err name="warehouse_size" />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Loading Bays</label>
                    <input type="number" min="0" value={formData.loading_bays} onChange={(e) => update('loading_bays', e.target.value)} className={inputCls('loading_bays')} />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Power Capacity (kW)</label>
                    <input type="number" min="0" step="0.01" value={formData.power_capacity} onChange={(e) => update('power_capacity', e.target.value)} className={inputCls('power_capacity')} />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Ceiling Height (ft)</label>
                    <input type="number" min="0" step="0.01" value={formData.ceiling_height} onChange={(e) => update('ceiling_height', e.target.value)} className={inputCls('ceiling_height')} />
                  </div>
                </div>
              )}

              {/* Land / Agricultural */}
              {(formData.property_type === 'land' || formData.property_type === 'agricultural') && (
                <div className="grid md:grid-cols-2 gap-4">
                  <div data-field="land_size">
                    <label className="block text-sm font-medium text-gray-700 mb-1">Land Size (acres) *</label>
                    <input type="number" min="0" step="0.01" value={formData.land_size} onChange={(e) => update('land_size', e.target.value)} className={inputCls('land_size')} />
                    <Err name="land_size" />
                  </div>
                  <div data-field="land_type">
                    <label className="block text-sm font-medium text-gray-700 mb-1">Land Type *</label>
                    <select value={formData.land_type} onChange={(e) => update('land_type', e.target.value)} className={inputCls('land_type')}>
                      <option value="">Select</option>
                      {(landTypes || []).map(t => <option key={t.id} value={t.id}>{t.name || t.label}</option>)}
                    </select>
                    <Err name="land_type" />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Planning Permission</label>
                    <select value={formData.planning_permission} onChange={(e) => update('planning_permission', e.target.value)} className={inputCls('planning_permission')}>
                      <option value="">Select</option>
                      {(planningPermissions || []).map(t => <option key={t.id} value={t.id}>{t.name || t.label}</option>)}
                    </select>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Soil Quality</label>
                    <input type="text" value={formData.soil_quality} onChange={(e) => update('soil_quality', e.target.value)} className={inputCls('soil_quality')} />
                  </div>
                </div>
              )}

              {/* Luxury extras */}
              {formData.property_type === 'luxury' && (
                <div className="grid md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">View Type</label>
                    <select value={formData.view_type} onChange={(e) => update('view_type', e.target.value)} className={inputCls('view_type')}>
                      <option value="">Select</option>
                      {(viewTypes || []).map(t => <option key={t.id} value={t.id}>{t.name || t.label}</option>)}
                    </select>
                  </div>
                </div>
              )}

              {/* Investment */}
              {formData.property_type === 'investment' && (
                <div className="grid md:grid-cols-2 gap-4">
                  <div data-field="rental_yield">
                    <label className="block text-sm font-medium text-gray-700 mb-1">Rental Yield (%) *</label>
                    <input type="number" min="0" step="0.01" value={formData.rental_yield} onChange={(e) => update('rental_yield', e.target.value)} className={inputCls('rental_yield')} />
                    <Err name="rental_yield" />
                  </div>
                  <div data-field="roi_percentage">
                    <label className="block text-sm font-medium text-gray-700 mb-1">ROI (%) *</label>
                    <input type="number" min="0" step="0.01" value={formData.roi_percentage} onChange={(e) => update('roi_percentage', e.target.value)} className={inputCls('roi_percentage')} />
                    <Err name="roi_percentage" />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Occupancy Rate (%)</label>
                    <input type="number" min="0" step="0.01" value={formData.occupancy_rate} onChange={(e) => update('occupancy_rate', e.target.value)} className={inputCls('occupancy_rate')} />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Current Rental Income</label>
                    <input type="number" min="0" step="0.01" value={formData.current_rental_income} onChange={(e) => update('current_rental_income', e.target.value)} className={inputCls('current_rental_income')} />
                  </div>
                </div>
              )}
            </section>
          )}

          {/* SECTION: PRICING */}
          <section className="space-y-4">
            <h3 className="text-lg font-semibold text-gray-900 mb-2 flex items-center gap-2"><DollarSign className="w-5 h-5" /> Pricing & Financial</h3>
            <div className="grid md:grid-cols-3 gap-4">
              <div data-field="price">
                <label className="block text-sm font-medium text-gray-700 mb-1">Price *</label>
                <div className="flex gap-2">
                  <select value={formData.currency} onChange={(e) => update('currency', e.target.value)} className="px-2 py-2 border border-gray-300 rounded-lg">
                    {CURRENCIES.map(c => <option key={c} value={c}>{c}</option>)}
                  </select>
                  <input type="number" min="0" step="0.01" value={formData.price} onChange={(e) => update('price', e.target.value)} className={inputCls('price') + ' flex-1'} />
                </div>
                <Err name="price" />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Deposit</label>
                <input type="number" min="0" step="0.01" value={formData.deposit} onChange={(e) => update('deposit', e.target.value)} className={inputCls('deposit')} />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Service Charges</label>
                <input type="number" min="0" step="0.01" value={formData.service_charges} onChange={(e) => update('service_charges', e.target.value)} className={inputCls('service_charges')} />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Maintenance Fees</label>
                <input type="number" min="0" step="0.01" value={formData.maintenance_fees} onChange={(e) => update('maintenance_fees', e.target.value)} className={inputCls('maintenance_fees')} />
              </div>
              <label className="flex items-center gap-2 mt-7 col-span-2">
                <input type="checkbox" checked={formData.negotiable} onChange={(e) => update('negotiable', e.target.checked)} />
                <span className="text-sm">Price is negotiable</span>
              </label>
            </div>
          </section>

          {/* SECTION: SELLER */}
          <section className="space-y-4">
            <h3 className="text-lg font-semibold text-gray-900 mb-2 flex items-center gap-2"><User className="w-5 h-5" /> Seller / Agent</h3>
            <div className="grid md:grid-cols-2 gap-4">
              <div data-field="seller_name">
                <label className="block text-sm font-medium text-gray-700 mb-1">Your Name *</label>
                <input type="text" value={formData.seller_name} onChange={(e) => update('seller_name', e.target.value)} className={inputCls('seller_name')} />
                <Err name="seller_name" />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Company</label>
                <input type="text" value={formData.seller_company} onChange={(e) => update('seller_company', e.target.value)} className={inputCls('seller_company')} />
              </div>
              <div data-field="seller_phone">
                <label className="block text-sm font-medium text-gray-700 mb-1">Phone *</label>
                <input type="tel" value={formData.seller_phone} onChange={(e) => update('seller_phone', e.target.value)} className={inputCls('seller_phone')} />
                <Err name="seller_phone" />
              </div>
              <div data-field="seller_email">
                <label className="block text-sm font-medium text-gray-700 mb-1">Email *</label>
                <input type="email" value={formData.seller_email} onChange={(e) => update('seller_email', e.target.value)} className={inputCls('seller_email')} />
                <Err name="seller_email" />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Website</label>
                <input type="url" value={formData.seller_website} onChange={(e) => update('seller_website', e.target.value)} className={inputCls('seller_website')} placeholder="https://" />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Logo</label>
                <input type="file" accept="image/*" onChange={(e) => handleFile(e, 'seller_logo')} className="block text-sm" />
                {formData.seller_logo && <p className="text-xs text-gray-500 mt-1">{formData.seller_logo.name}</p>}
              </div>
            </div>
            <label className="flex items-center gap-2">
              <input type="checkbox" checked={formData.verified_agent} onChange={(e) => update('verified_agent', e.target.checked)} />
              <span className="text-sm">Apply for Verified Agent badge</span>
            </label>
          </section>

          {/* SECTION: DESCRIPTION */}
          <section className="space-y-4">
            <h3 className="text-lg font-semibold text-gray-900 mb-2 flex items-center gap-2"><FileText className="w-5 h-5" /> Description</h3>
            <div className="grid md:grid-cols-2 gap-4">
              <div className="md:col-span-2">
                <label className="block text-sm font-medium text-gray-700 mb-1">Overview</label>
                <textarea rows={3} value={formData.overview} onChange={(e) => update('overview', e.target.value)} className={inputCls('overview')} />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Key Features</label>
                <textarea rows={3} value={formData.key_features} onChange={(e) => update('key_features', e.target.value)} className={inputCls('key_features')} />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Nearby Amenities</label>
                <textarea rows={3} value={formData.nearby_amenities} onChange={(e) => update('nearby_amenities', e.target.value)} className={inputCls('nearby_amenities')} />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Location Highlights</label>
                <textarea rows={3} value={formData.location_highlights} onChange={(e) => update('location_highlights', e.target.value)} className={inputCls('location_highlights')} />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Transport Links</label>
                <textarea rows={3} value={formData.transport_links} onChange={(e) => update('transport_links', e.target.value)} className={inputCls('transport_links')} />
              </div>
              <div className="md:col-span-2">
                <label className="block text-sm font-medium text-gray-700 mb-1">Additional Notes</label>
                <textarea rows={2} value={formData.additional_notes} onChange={(e) => update('additional_notes', e.target.value)} className={inputCls('additional_notes')} />
              </div>
            </div>
          </section>

          {/* SECTION: LOCATION COORDS */}
          <section className="space-y-4">
            <h3 className="text-lg font-semibold text-gray-900 mb-2 flex items-center gap-2"><MapPin className="w-5 h-5" /> Location Coordinates (optional)</h3>
            <div className="grid md:grid-cols-3 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Latitude</label>
                <input type="number" step="any" value={formData.latitude} onChange={(e) => update('latitude', e.target.value)} className={inputCls('latitude')} />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Longitude</label>
                <input type="number" step="any" value={formData.longitude} onChange={(e) => update('longitude', e.target.value)} className={inputCls('longitude')} />
              </div>
              <label className="flex items-center gap-2 mt-7">
                <input type="checkbox" checked={formData.show_exact_location} onChange={(e) => update('show_exact_location', e.target.checked)} />
                <span className="text-sm">Show exact location publicly</span>
              </label>
            </div>
          </section>

          {/* SECTION: PROMOTION TIER */}
          <section className="space-y-4">
            <h3 className="text-lg font-semibold text-gray-900 mb-2 flex items-center gap-2"><Star className="w-5 h-5" /> Promotion Tier</h3>
            <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-4">
              {PROMOTION_TIERS.map(tier => {
                const Icon = tier.icon;
                const active = formData.advert_type === tier.id;
                return (
                  <div key={tier.id} onClick={() => update('advert_type', tier.id)}
                    className={`relative rounded-xl border-2 p-4 cursor-pointer transition-all ${active ? 'border-blue-500 shadow-lg bg-blue-50' : 'border-gray-200 hover:border-gray-300'}`}>
                    {tier.popular && (
                      <span className="absolute -top-3 left-1/2 -translate-x-1/2 bg-blue-600 text-white text-xs px-3 py-1 rounded-full">Most Popular</span>
                    )}
                    <Icon className={`w-6 h-6 text-${tier.color}-600 mb-2`} />
                    <div className="font-semibold text-gray-900">{tier.name}</div>
                    <div className="text-xl font-bold text-gray-900 mt-1">{tier.price}</div>
                    <ul className="mt-3 space-y-1">
                      {tier.features.map((f, i) => (
                        <li key={i} className="flex items-center gap-1 text-xs text-gray-600"><Check className="w-3 h-3 text-green-500" />{f}</li>
                      ))}
                    </ul>
                  </div>
                );
              })}
            </div>
          </section>

          {/* SECTION: TERMS + SUBMIT */}
          <section className="space-y-3 pt-4 border-t border-gray-200">
            <label data-field="terms_accepted" className="flex items-start gap-2">
              <input type="checkbox" checked={formData.terms_accepted} onChange={(e) => update('terms_accepted', e.target.checked)} className="mt-1" />
              <span className="text-sm text-gray-700">I agree to the Terms of Service and Privacy Policy.</span>
            </label>
            <Err name="terms_accepted" />
            <label data-field="accuracy_confirmed" className="flex items-start gap-2">
              <input type="checkbox" checked={formData.accuracy_confirmed} onChange={(e) => update('accuracy_confirmed', e.target.checked)} className="mt-1" />
              <span className="text-sm text-gray-700">I confirm that the information provided is accurate.</span>
            </label>
            <Err name="accuracy_confirmed" />

            {error && (
              <div className="bg-red-50 border border-red-200 text-red-700 rounded-lg p-3 text-sm">{error}</div>
            )}
            {success && (
              <div className="bg-green-50 border border-green-200 text-green-700 rounded-lg p-3 text-sm">Property submitted successfully!</div>
            )}

            <div className="flex justify-end gap-3 pt-2">
              <button type="button" onClick={onClose} className="px-4 py-2 rounded-lg text-gray-700 hover:bg-gray-100">Cancel</button>
              <button type="submit" disabled={loading}
                className={`px-6 py-2 rounded-lg font-medium text-white ${loading ? 'bg-blue-400 cursor-not-allowed' : 'bg-blue-600 hover:bg-blue-700'}`}>
                {loading ? 'Submitting…' : 'Submit Listing'}
              </button>
            </div>
          </section>
        </form>
      </motion.div>
    </motion.div>
  );
};

export default PropertyPostForm;
