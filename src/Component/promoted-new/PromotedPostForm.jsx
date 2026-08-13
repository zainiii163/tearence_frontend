import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { X, Upload, Check, Crown, Star, Shield, Rocket, TrendingUp, Image as ImageIcon } from 'lucide-react';
import { promotedAdvertsAPI, categoriesAPI, promotedAdvertsUtils } from '../../services/promotedAdvertsAPI';
import { handleListingCreatePayment, startListingCheckout } from '../../utils/listingPayment';

const PromotedPostForm = ({ onClose }) => {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(false);
  const [apiCategories, setApiCategories] = useState([]);
  const [promotionOptions, setPromotionOptions] = useState([]);
  const [uploadedImages, setUploadedImages] = useState([]);
  const [uploadedLogo, setUploadedLogo] = useState(null);

  const API_BASE_URL = process.env.REACT_APP_API_URL?.replace(/\/v1$/, '') || 'https://api.worldwideadverts.info/api';
  const [formData, setFormData] = useState({
    advertType: '',
    title: '',
    tagline: '',
    category: '',
    country: '',
    city: '',
    price: '',
    condition: '',
    mainImage: null,
    additionalImages: [],
    videoLink: '',
    overview: '',
    keyFeatures: '',
    specialFeatures: '',
    additionalNotes: '',
    sellerName: '',
    businessName: '',
    phone: '',
    email: '',
    website: '',
    socialLinks: '',
    logo: null,
    verifiedSeller: false,
    promotionTier: '',
    termsAccepted: false,
    accuracyConfirmed: false
  });

  useEffect(() => {
    loadInitialData();
  }, []);

  const loadInitialData = async () => {
    try {
      const [categoriesData, promotionData] = await Promise.all([
        categoriesAPI.getCategories(),
        promotedAdvertsAPI.getPromotionOptions(),
      ]);

      if (categoriesData.success && Array.isArray(categoriesData.data)) {
        setApiCategories(categoriesData.data);
      }

      if (promotionData.success && Array.isArray(promotionData.data)) {
        setPromotionOptions(promotionData.data);
      }
    } catch (err) {
      console.error('Failed to load initial data:', err);
    }
  };

  const advertTypes = [
    { value: 'product', label: 'Product / Item for Sale', icon: '📦' },
    { value: 'service', label: 'Service / Business Offer', icon: '💼' },
    { value: 'property', label: 'Property / Real Estate', icon: '🏠' },
    { value: 'vehicle', label: 'Vehicle / Motors', icon: '🚗' },
    { value: 'job', label: 'Job / Vacancy', icon: '💼' },
    { value: 'event', label: 'Event / Experience', icon: '🎫' },
    { value: 'business', label: 'Business Opportunity', icon: '🚀' },
    { value: 'miscellaneous', label: 'Miscellaneous / Other', icon: '📋' }
  ];

  const handleInputChange = (field, value) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const handleImageUpload = async (files) => {
    if (!files || files.length === 0) return;
    
    try {
      setLoading(true);
      const response = await promotedAdvertsAPI.uploadImages(files);
      
      if (response.success && response.data && response.data.images) {
        setUploadedImages(prev => [...prev, ...response.data.images]);
      } else {
        setError('Failed to upload images');
      }
    } catch (err) {
      setError('Error uploading images: ' + err.message);
    } finally {
      setLoading(false);
    }
  };

  const handleLogoUpload = async (file) => {
    if (!file) return;
    
    try {
      setLoading(true);
      const response = await promotedAdvertsAPI.uploadLogo(file);
      
      if (response.success && response.data && response.data.logo) {
        setUploadedLogo(response.data.logo);
      } else {
        setError('Failed to upload logo');
      }
    } catch (err) {
      setError('Error uploading logo: ' + err.message);
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async () => {
    setLoading(true);
    setError(null);
    setSuccess(false);
    
    try {
      const token = localStorage.getItem('token');
      if (!token) {
        setError('You must be logged in to submit a promoted advert. Please login and try again.');
        setLoading(false);
        return;
      }
      
      const validation = promotedAdvertsUtils.validateAdvertData(formData);
      if (!validation.isValid) {
        setError('Please fix the validation errors before submitting: ' + Object.values(validation.errors).join(', '));
        setLoading(false);
        return;
      }

      if (!formData.termsAccepted) {
        setError('You must accept the terms and conditions');
        setLoading(false);
        return;
      }

      if (!formData.accuracyConfirmed) {
        setError('You must confirm that the advert information is accurate');
        setLoading(false);
        return;
      }

      if (uploadedImages.length === 0) {
        setError('Please upload at least one image');
        setLoading(false);
        return;
      }

      const advertData = {
        title: formData.title,
        tagline: formData.tagline,
        description: formData.overview + '\n\nKey Features:\n' + formData.keyFeatures + '\n\nWhat Makes It Special:\n' + formData.specialFeatures + '\n\nAdditional Notes:\n' + formData.additionalNotes,
        key_features: formData.keyFeatures ? formData.keyFeatures.split('\n').filter(f => f.trim()) : [],
        special_notes: formData.additionalNotes,
        advert_type: formData.advertType,
        category_id: formData.category || null,
        country: formData.country,
        city: formData.city,
        price: formData.price ? parseFloat(formData.price) : null,
        currency: 'GBP',
        price_type: 'fixed',
        condition: formData.condition || null,
        main_image: uploadedImages[0],
        additional_images: uploadedImages.slice(1),
        video_link: formData.videoLink,
        seller_name: formData.sellerName,
        business_name: formData.businessName,
        phone: formData.phone,
        email: formData.email,
        website: formData.website,
        social_links: formData.socialLinks ? formData.socialLinks.split(',').map(s => s.trim()) : [],
        logo: uploadedLogo,
        verified_seller: formData.verifiedSeller,
        promotion_tier: formData.promotionTier,
      };

      const response = await promotedAdvertsAPI.createAdvert(advertData);
      
      if (response.success) {
        const payment = handleListingCreatePayment(response, navigate);
        if (payment.redirected) {
          onClose();
          return;
        }
        const created = response.data || response;
        const listingId = created.id || created.advert_id;
        const selectedTier = (promotionOptions || []).find(
          (t) => t.tier === formData.promotionTier || t.id === formData.promotionTier
        );
        const amount = Number(selectedTier?.price || created.promotion_price || 0);
        if (
          startListingCheckout(navigate, {
            amount,
            listingId,
            description: `Promoted advert: ${formData.title || 'Worldwide Adverts'}`,
            upsellType: 'promoted',
            returnTo: '/dashboard?tab=featured',
          })
        ) {
          onClose();
          return;
        }
        setSuccess(true);
        setTimeout(() => {
          onClose();
        }, 2000);
      } else {
        setError(response.message || 'Failed to create advert');
      }
    } catch (err) {
      setError(err.message || 'An error occurred while creating the advert');
    } finally {
      setLoading(false);
    }
  };

  if (success) {
    return (
      <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
        <div className="bg-white rounded-2xl shadow-2xl max-w-md w-full p-8 text-center">
          <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <Check className="h-8 w-8 text-green-600" />
          </div>
          <h3 className="text-2xl font-bold text-gray-900 mb-2">Success!</h3>
          <p className="text-gray-600 mb-4">Your promoted advert has been created successfully.</p>
          <p className="text-sm text-gray-500">Redirecting...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4 overflow-y-auto">
      <div className="bg-white rounded-2xl shadow-2xl max-w-5xl w-full my-8 max-h-[90vh] overflow-y-auto">
        {/* Header */}
        <div className="sticky top-0 bg-white border-b border-gray-200 px-6 py-4 flex items-center justify-between rounded-t-2xl z-10">
          <div>
            <h2 className="text-2xl font-bold text-gray-900">Create Promoted Advert</h2>
            <p className="text-sm text-gray-500 mt-1">Boost your visibility with premium placement</p>
          </div>
          <button
            onClick={onClose}
            className="p-2 hover:bg-gray-100 rounded-full transition-colors"
          >
            <X className="h-6 w-6 text-gray-500" />
          </button>
        </div>

        {/* Form Content */}
        <div className="p-6 space-y-8">
          {error && (
            <div className="bg-red-50 border border-red-200 rounded-lg p-4 text-red-700">
              {error}
            </div>
          )}

          {/* Step 1: Advert Type */}
          <section>
            <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center gap-2">
              <span className="flex items-center justify-center w-8 h-8 bg-orange-500 text-white rounded-full text-sm font-bold">1</span>
              Choose Advert Type
            </h3>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
              {advertTypes.map(type => (
                <button
                  key={type.value}
                  onClick={() => handleInputChange('advertType', type.value)}
                  className={`p-4 rounded-xl border-2 transition-all duration-200 ${
                    formData.advertType === type.value
                      ? 'border-orange-500 bg-orange-50'
                      : 'border-gray-200 hover:border-gray-300'
                  }`}
                >
                  <div className="text-3xl mb-2">{type.icon}</div>
                  <div className="font-medium text-gray-900 text-sm text-center">{type.label}</div>
                </button>
              ))}
            </div>
          </section>

          {/* Step 2: Basic Information */}
          <section>
            <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center gap-2">
              <span className="flex items-center justify-center w-8 h-8 bg-orange-500 text-white rounded-full text-sm font-bold">2</span>
              Basic Information
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="md:col-span-2">
                <label className="block text-sm font-medium text-gray-700 mb-2">Advert Title *</label>
                <input
                  type="text"
                  value={formData.title}
                  onChange={(e) => handleInputChange('title', e.target.value)}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent"
                  placeholder="Enter advert title..."
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Short Tagline (max 80 chars)</label>
                <input
                  type="text"
                  value={formData.tagline}
                  onChange={(e) => handleInputChange('tagline', e.target.value)}
                  maxLength={80}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent"
                  placeholder="Brief description..."
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Category</label>
                <select
                  value={formData.category}
                  onChange={(e) => handleInputChange('category', e.target.value)}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent"
                >
                  <option value="">Select category</option>
                  {apiCategories.map(cat => (
                    <option key={cat.id} value={cat.id}>{cat.name}</option>
                  ))}
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Country *</label>
                <select
                  value={formData.country}
                  onChange={(e) => handleInputChange('country', e.target.value)}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent"
                >
                  <option value="">Select country</option>
                  <option value="United Kingdom">United Kingdom</option>
                  <option value="United States">United States</option>
                  <option value="Canada">Canada</option>
                  <option value="Australia">Australia</option>
                  <option value="Germany">Germany</option>
                  <option value="France">France</option>
                  <option value="Spain">Spain</option>
                  <option value="Italy">Italy</option>
                  <option value="Netherlands">Netherlands</option>
                  <option value="Japan">Japan</option>
                  <option value="China">China</option>
                  <option value="India">India</option>
                  <option value="Brazil">Brazil</option>
                  <option value="UAE">UAE</option>
                  <option value="Singapore">Singapore</option>
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">City / Region</label>
                <input
                  type="text"
                  value={formData.city}
                  onChange={(e) => handleInputChange('city', e.target.value)}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent"
                  placeholder="Enter city or region..."
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Price (optional)</label>
                <input
                  type="number"
                  value={formData.price}
                  onChange={(e) => handleInputChange('price', e.target.value)}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent"
                  placeholder="0.00"
                  step="0.01"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Condition</label>
                <select
                  value={formData.condition}
                  onChange={(e) => handleInputChange('condition', e.target.value)}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent"
                >
                  <option value="">Select condition</option>
                  <option value="new">New</option>
                  <option value="used">Used</option>
                  <option value="not_applicable">Not Applicable</option>
                </select>
              </div>
            </div>
          </section>

          {/* Step 3: Media Uploads */}
          <section>
            <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center gap-2">
              <span className="flex items-center justify-center w-8 h-8 bg-orange-500 text-white rounded-full text-sm font-bold">3</span>
              Media Uploads
            </h3>
            <div className="space-y-4">
              <div className="border-2 border-dashed border-gray-300 rounded-lg p-6 text-center">
                <ImageIcon className="h-8 w-8 text-gray-400 mx-auto mb-2" />
                <p className="text-sm text-gray-600 mb-2">Main Image (required)</p>
                <input
                  type="file"
                  accept="image/*"
                  className="hidden"
                  id="mainImage"
                  onChange={(e) => {
                    const file = e.target.files[0];
                    if (file) {
                      handleImageUpload([file]);
                    }
                  }}
                />
                <label 
                  htmlFor="mainImage" 
                  className="cursor-pointer inline-block bg-orange-500 hover:bg-orange-600 text-white px-4 py-2 rounded-lg transition-colors"
                >
                  Choose File
                </label>
                {uploadedImages.length > 0 && (
                  <div className="mt-4 grid grid-cols-4 gap-2">
                    {uploadedImages.map((img, idx) => (
                      <div key={idx} className="relative">
                        <img src={`${API_BASE_URL}/storage/promoted-adverts/${img}`} alt="Upload" className="w-full h-20 object-cover rounded" />
                      </div>
                    ))}
                  </div>
                )}
              </div>
              <div className="border-2 border-dashed border-gray-300 rounded-lg p-4 text-center">
                <p className="text-sm text-gray-600 mb-2">Additional Images (up to 10)</p>
                <input
                  type="file"
                  accept="image/*"
                  multiple
                  className="hidden"
                  id="additionalImages"
                  onChange={(e) => {
                    const files = Array.from(e.target.files);
                    if (files.length > 0) {
                      handleImageUpload(files);
                    }
                  }}
                />
                <label 
                  htmlFor="additionalImages" 
                  className="cursor-pointer inline-block bg-gray-100 hover:bg-gray-200 text-gray-700 px-4 py-2 rounded-lg transition-colors"
                >
                  Choose Files
                </label>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Video Link (optional)</label>
                <input
                  type="url"
                  value={formData.videoLink}
                  onChange={(e) => handleInputChange('videoLink', e.target.value)}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent"
                  placeholder="https://youtube.com/watch?v=..."
                />
              </div>
            </div>
          </section>

          {/* Step 4: Description */}
          <section>
            <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center gap-2">
              <span className="flex items-center justify-center w-8 h-8 bg-orange-500 text-white rounded-full text-sm font-bold">4</span>
              Description
            </h3>
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Overview *</label>
                <textarea
                  value={formData.overview}
                  onChange={(e) => handleInputChange('overview', e.target.value)}
                  rows={4}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent"
                  placeholder="Provide a detailed overview of your advert..."
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Key Features</label>
                <textarea
                  value={formData.keyFeatures}
                  onChange={(e) => handleInputChange('keyFeatures', e.target.value)}
                  rows={3}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent"
                  placeholder="List the main features and benefits (one per line)..."
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">What Makes This Advert Special</label>
                <textarea
                  value={formData.specialFeatures}
                  onChange={(e) => handleInputChange('specialFeatures', e.target.value)}
                  rows={3}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent"
                  placeholder="Highlight unique selling points..."
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Additional Notes</label>
                <textarea
                  value={formData.additionalNotes}
                  onChange={(e) => handleInputChange('additionalNotes', e.target.value)}
                  rows={2}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent"
                  placeholder="Any additional information..."
                />
              </div>
            </div>
          </section>

          {/* Step 5: Seller Information */}
          <section>
            <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center gap-2">
              <span className="flex items-center justify-center w-8 h-8 bg-orange-500 text-white rounded-full text-sm font-bold">5</span>
              Seller Information
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Name *</label>
                <input
                  type="text"
                  value={formData.sellerName}
                  onChange={(e) => handleInputChange('sellerName', e.target.value)}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent"
                  placeholder="Your name..."
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Business Name (optional)</label>
                <input
                  type="text"
                  value={formData.businessName}
                  onChange={(e) => handleInputChange('businessName', e.target.value)}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent"
                  placeholder="Business name..."
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Phone Number *</label>
                <input
                  type="tel"
                  value={formData.phone}
                  onChange={(e) => handleInputChange('phone', e.target.value)}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent"
                  placeholder="+1-555-0123"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Email *</label>
                <input
                  type="email"
                  value={formData.email}
                  onChange={(e) => handleInputChange('email', e.target.value)}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent"
                  placeholder="email@example.com"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Website</label>
                <input
                  type="url"
                  value={formData.website}
                  onChange={(e) => handleInputChange('website', e.target.value)}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent"
                  placeholder="https://example.com"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Social Links</label>
                <input
                  type="text"
                  value={formData.socialLinks}
                  onChange={(e) => handleInputChange('socialLinks', e.target.value)}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent"
                  placeholder="Facebook, Twitter, LinkedIn (comma separated)"
                />
              </div>
            </div>
            <div className="mt-4">
              <label className="block text-sm font-medium text-gray-700 mb-2">Upload Logo (optional)</label>
              <div className="border-2 border-dashed border-gray-300 rounded-lg p-4 text-center">
                <Upload className="h-8 w-8 text-gray-400 mx-auto mb-2" />
                <p className="text-sm text-gray-600 mb-2">Business logo</p>
                <input
                  type="file"
                  accept="image/*"
                  className="hidden"
                  id="logo"
                  onChange={(e) => {
                    const file = e.target.files[0];
                    if (file) {
                      handleLogoUpload(file);
                    }
                  }}
                />
                <label 
                  htmlFor="logo" 
                  className="cursor-pointer inline-block bg-gray-100 hover:bg-gray-200 text-gray-700 px-4 py-2 rounded-lg transition-colors"
                >
                  Choose File
                </label>
                {uploadedLogo && (
                  <div className="mt-2 text-sm text-green-600">Logo uploaded successfully</div>
                )}
              </div>
            </div>
            <div className="mt-4">
              <label className="flex items-center">
                <input
                  type="checkbox"
                  checked={formData.verifiedSeller}
                  onChange={(e) => handleInputChange('verifiedSeller', e.target.checked)}
                  className="mr-2 text-orange-500 focus:ring-orange-500 rounded"
                />
                <span className="text-gray-700">Get Verified Seller Badge</span>
              </label>
            </div>
          </section>

          {/* Step 6: Promotion Tier */}
          <section>
            <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center gap-2">
              <span className="flex items-center justify-center w-8 h-8 bg-orange-500 text-white rounded-full text-sm font-bold">6</span>
              Promotion Tier
            </h3>
            
            <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 mb-6">
              <div className="flex items-center gap-2 text-blue-800">
                <TrendingUp className="h-5 w-5" />
                <span className="font-medium">Smart Recommendation</span>
              </div>
              <p className="text-blue-700 mt-1">Promoted Plus adverts get 4× more views on average.</p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {promotionOptions.map(tier => {
                const Icon = tier.tier === 'promoted_plus' ? Star : 
                           tier.tier === 'promoted_premium' ? Shield : 
                           tier.tier === 'network_wide_boost' ? Rocket : Crown;
                return (
                  <button
                    key={tier.tier}
                    onClick={() => handleInputChange('promotionTier', tier.tier)}
                    className={`relative p-4 rounded-xl border-2 transition-all duration-200 ${
                      formData.promotionTier === tier.tier
                        ? 'border-orange-500 bg-orange-50'
                        : 'border-gray-200 hover:border-gray-300'
                    }`}
                  >
                    {tier.popular && (
                      <div className="absolute -top-2 -right-2 bg-orange-500 text-white px-2 py-1 rounded-full text-xs font-semibold">
                        Most Popular
                      </div>
                    )}
                    <div className={`w-12 h-12 bg-gradient-to-br ${
                      tier.tier === 'promoted_basic' ? 'from-blue-500 to-blue-600' :
                      tier.tier === 'promoted_plus' ? 'from-orange-500 to-orange-600' :
                      tier.tier === 'promoted_premium' ? 'from-purple-500 to-purple-600' :
                      'from-red-500 to-red-600'
                    } rounded-lg flex items-center justify-center text-white mb-3`}>
                      <Icon className="h-6 w-6" />
                    </div>
                    <h4 className="font-semibold text-gray-900 mb-1">{tier.name}</h4>
                    <div className="text-2xl font-bold text-orange-600 mb-3">£{tier.price}</div>
                    <ul className="text-sm text-gray-600 space-y-1">
                      {tier.features && tier.features.map((feature, idx) => (
                        <li key={idx} className="flex items-start gap-2">
                          <Check className="h-4 w-4 text-green-500 mt-0.5 flex-shrink-0" />
                          <span>{feature}</span>
                        </li>
                      ))}
                    </ul>
                  </button>
                );
              })}
            </div>
          </section>

          {/* Terms and Submit */}
          <section className="border-t border-gray-200 pt-6">
            <div className="space-y-3 mb-6">
              <label className="flex items-start">
                <input
                  type="checkbox"
                  checked={formData.termsAccepted}
                  onChange={(e) => handleInputChange('termsAccepted', e.target.checked)}
                  className="mr-3 mt-1 text-orange-500 focus:ring-orange-500 rounded"
                />
                <span className="text-gray-700 text-sm">I agree to the terms and conditions of the promoted adverts service</span>
              </label>
              <label className="flex items-start">
                <input
                  type="checkbox"
                  checked={formData.accuracyConfirmed}
                  onChange={(e) => handleInputChange('accuracyConfirmed', e.target.checked)}
                  className="mr-3 mt-1 text-orange-500 focus:ring-orange-500 rounded"
                />
                <span className="text-gray-700 text-sm">I confirm that all information provided is accurate and truthful</span>
              </label>
            </div>

            <div className="flex gap-4">
              <button
                onClick={onClose}
                className="flex-1 px-6 py-3 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50 transition-colors"
                disabled={loading}
              >
                Cancel
              </button>
              <button
                onClick={handleSubmit}
                disabled={loading || !formData.termsAccepted || !formData.accuracyConfirmed}
                className="flex-1 px-6 py-3 bg-orange-500 hover:bg-orange-600 text-white rounded-lg transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {loading ? 'Creating...' : 'Create Promoted Advert'}
              </button>
            </div>
          </section>
        </div>
      </div>
    </div>
  );
};

export default PromotedPostForm;
