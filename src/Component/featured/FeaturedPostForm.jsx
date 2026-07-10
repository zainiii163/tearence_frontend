import React, { useState, useEffect } from 'react';
import { featuredAdvertsAPI } from '../../api/featuredAdverts';
import { 
  X, 
  Check, 
  Upload, 
  Camera, 
  FileText, 
  MapPin, 
  Shield, 
  Star, 
  Crown, 
  Zap, 
  Target,
  Package,
  TrendingUp,
  Award,
  Briefcase,
  Calendar,
  Car,
  Users,
  BarChart3,
  Phone,
  User,
  Building,
  Tag,
  CheckSquare,
  AlertCircle,
  Info
} from 'lucide-react';

const FeaturedPostForm = ({ onClose, editingAdvert = null }) => {
  const isEditing = Boolean(editingAdvert?.id);
  const [formData, setFormData] = useState({
    // Advert Type
    advertType: '',
    
    // Basic Information
    title: '',
    tagline: '',
    category: '',
    country: '',
    city: '',
    price: '',
    condition: '',
    
    // Media
    mainImage: null,
    additionalImages: [],
    videoLink: '',
    
    // Description
    overview: '',
    keyFeatures: '',
    whatMakesItSpecial: '',
    whyFeatured: '',
    
    // Seller Info
    sellerName: '',
    businessName: '',
    phone: '',
    email: '',
    website: '',
    socialLinks: '',
    verifiedBadge: false,
    
    // Location
    useExactLocation: false,
    address: '',
    
    // Premium Upsell
    promotionTier: 'promoted',
    
    // Terms
    termsAccepted: false,
    accurateInfo: false
  });

  const [errors, setErrors] = useState({});
  const [uploadedImages, setUploadedImages] = useState([]);
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    if (!editingAdvert) return;
    setFormData((prev) => ({
      ...prev,
      advertType: editingAdvert.advert_type || '',
      title: editingAdvert.title || '',
      tagline: editingAdvert.tagline || '',
      category: editingAdvert.category_id?.toString() || editingAdvert.category?.id?.toString() || '',
      country: editingAdvert.country || '',
      city: editingAdvert.city || '',
      price: editingAdvert.price?.toString() || '',
      condition: editingAdvert.condition || '',
      videoLink: editingAdvert.video_url || '',
      sellerName: editingAdvert.contact_name || '',
      phone: editingAdvert.contact_phone || '',
      email: editingAdvert.contact_email || '',
      website: editingAdvert.website || '',
      promotionTier: editingAdvert.upsell_tier || 'promoted',
      verifiedBadge: Boolean(editingAdvert.is_verified_seller),
      overview: editingAdvert.description || '',
      termsAccepted: true,
      accurateInfo: true,
    }));
    if (Array.isArray(editingAdvert.images) && editingAdvert.images.length) {
      setUploadedImages(editingAdvert.images);
    }
  }, [editingAdvert]);

  const advertTypes = [
    {
      id: 'product',
      name: 'Product / Item for Sale',
      description: 'Physical items for sale',
      icon: Package,
      color: 'from-blue-500 to-cyan-500'
    },
    {
      id: 'service',
      name: 'Service / Business Offer',
      description: 'Professional services offered',
      icon: User,
      color: 'from-purple-500 to-pink-500'
    },
    {
      id: 'property',
      name: 'Property / Real Estate',
      description: 'Real estate listings',
      icon: Building,
      color: 'from-green-500 to-emerald-500'
    },
    {
      id: 'job',
      name: 'Job / Recruitment',
      description: 'Employment opportunities',
      icon: Briefcase,
      color: 'from-yellow-500 to-orange-500'
    },
    {
      id: 'event',
      name: 'Event / Experience',
      description: 'Events and tickets',
      icon: Calendar,
      color: 'from-red-500 to-pink-500'
    },
    {
      id: 'vehicle',
      name: 'Vehicle / Motors',
      description: 'Cars and transportation',
      icon: Car,
      color: 'from-indigo-500 to-purple-500'
    },
    {
      id: 'business',
      name: 'Business Opportunity',
      description: 'Business opportunities',
      icon: Building,
      color: 'from-teal-500 to-cyan-500'
    },
    {
      id: 'misc',
      name: 'Miscellaneous / Other',
      description: 'Other listings',
      icon: Tag,
      color: 'from-gray-500 to-gray-700'
    }
  ];

  const categories = [
    { value: 'property', label: 'Property' },
    { value: 'vehicles', label: 'Cars & Vehicles' },
    { value: 'jobs', label: 'Jobs & Services' },
    { value: 'business', label: 'Business Opportunities' },
    { value: 'electronics', label: 'Electronics' },
    { value: 'fashion', label: 'Fashion & Beauty' },
    { value: 'travel', label: 'Travel & Experiences' },
    { value: 'events', label: 'Events & Tickets' },
    { value: 'pets', label: 'Pets & Animals' },
    { value: 'home-garden', label: 'Home & Garden' },
    { value: 'health', label: 'Health & Wellness' },
    { value: 'education', label: 'Education & Courses' }
  ];

  const conditions = ['New', 'Used', 'Refurbished', 'Not Applicable'];

  const promotionTiers = [
    {
      id: 'promoted',
      name: 'Promoted Advert',
      price: '£29.99',
      period: 'month',
      description: 'Enhanced visibility for your listing',
      features: [
        'Highlighted card design',
        'Appears above standard listings',
        '"Promoted" badge',
        '2× visibility boost',
        'Basic analytics'
      ],
      icon: Star,
      color: 'from-blue-500 to-cyan-500',
      popular: false
    },
    {
      id: 'featured',
      name: 'Featured Advert',
      price: '£59.99',
      period: 'month',
      description: 'Premium placement with maximum exposure',
      features: [
        'Top of category pages',
        'Larger card display',
        'Priority search placement',
        '"Featured" badge',
        'Included in weekly "Top Featured Ads" email',
        '4× visibility boost',
        'Advanced analytics',
        'Click tracking'
      ],
      icon: Crown,
      color: 'from-purple-500 to-pink-500',
      popular: true
    },
    {
      id: 'sponsored',
      name: 'Sponsored Advert',
      price: '£99.99',
      period: 'month',
      description: 'Maximum visibility across the platform',
      features: [
        'Homepage slider placement',
        'Category top placement',
        'Social media promotion',
        '"Sponsored" badge',
        '6× visibility boost',
        'Premium analytics',
        'Conversion tracking',
        'Dedicated support',
        'A/B testing tools'
      ],
      icon: Zap,
      color: 'from-yellow-500 to-orange-500',
      popular: false
    }
  ];

  const countries = [
    { value: 'United States', label: 'United States', flag: '🇺🇸' },
    { value: 'United Kingdom', label: 'United Kingdom', flag: '🇬🇧' },
    { value: 'France', label: 'France', flag: '🇫🇷' },
    { value: 'Germany', label: 'Germany', flag: '🇩🇪' },
    { value: 'Italy', label: 'Italy', flag: '🇮🇹' },
    { value: 'Spain', label: 'Spain', flag: '🇪🇸' },
    { value: 'Japan', label: 'Japan', flag: '🇯🇵' },
    { value: 'China', label: 'China', flag: '🇨🇳' },
    { value: 'Singapore', label: 'Singapore', flag: '🇸🇬' },
    { value: 'Australia', label: 'Australia', flag: '🇦🇺' },
    { value: 'Canada', label: 'Canada', flag: '🇨🇦' },
    { value: 'UAE', label: 'UAE', flag: '🇦🇪' },
    { value: 'Nigeria', label: 'Nigeria', flag: '🇳🇬' }
  ];

  const handleInputChange = (field, value) => {
    setFormData(prev => ({ ...prev, [field]: value }));
    if (errors[field]) {
      setErrors(prev => ({ ...prev, [field]: '' }));
    }
    // Clear description error when any description field is modified
    if (['overview', 'keyFeatures', 'whatMakesItSpecial', 'whyFeatured'].includes(field)) {
      if (errors.description) {
        setErrors(prev => ({ ...prev, description: '' }));
      }
    }
  };

  const handleImageUpload = (e, isMain = false) => {
    const files = Array.from(e.target.files);
    console.log('Files selected:', files.length, 'isMain:', isMain);
    
    if (isMain && files.length > 0) {
      setFormData(prev => ({ ...prev, mainImage: files[0] }));
    } else {
      setFormData(prev => ({ 
        ...prev, 
        additionalImages: [...prev.additionalImages, ...files].slice(0, 10) 
      }));
    }
    
    const newImages = files.map(file => {
      const previewUrl = URL.createObjectURL(file);
      console.log('Created preview URL for:', file.name, previewUrl);
      return {
        file,
        preview: previewUrl,
        isMain
      };
    });
    setUploadedImages(prev => {
      const updated = [...prev, ...newImages];
      console.log('Total uploaded images:', updated.length);
      return updated;
    });
  };

  const removeImage = (index) => {
    setUploadedImages(prev => prev.filter((_, i) => i !== index));
  };

  const validateForm = () => {
    const newErrors = {};

    if (!formData.advertType) newErrors.advertType = 'Please select an advert type';
    if (!formData.title.trim()) newErrors.title = 'Title is required';
    if (!formData.tagline.trim()) newErrors.tagline = 'Tagline is required';
    if (!formData.category) newErrors.category = 'Category is required';
    if (!formData.country) newErrors.country = 'Country is required';
    if (!formData.city.trim()) newErrors.city = 'City is required';
    if (!formData.condition) newErrors.condition = 'Condition is required';
    if (!formData.mainImage) newErrors.mainImage = 'Main image is required';
    if (!formData.overview.trim()) newErrors.overview = 'Overview is required';
    if (!formData.keyFeatures.trim()) newErrors.keyFeatures = 'Key features are required';
    if (!formData.sellerName.trim()) newErrors.sellerName = 'Seller name is required';
    if (!formData.email.trim()) newErrors.email = 'Email is required';
    if (!formData.phone.trim()) newErrors.phone = 'Phone is required';
    if (!formData.address.trim()) newErrors.address = 'Address is required';
    if (!formData.promotionTier) newErrors.promotionTier = 'Please select a promotion tier';
    if (!formData.termsAccepted) newErrors.termsAccepted = 'You must accept the terms';
    if (!formData.accurateInfo) newErrors.accurateInfo = 'You must confirm the information is accurate';

    // Validate that at least one description field has content
    const hasDescriptionContent = 
      formData.overview.trim() || 
      formData.keyFeatures.trim() || 
      formData.whatMakesItSpecial.trim() || 
      formData.whyFeatured.trim();
    
    if (!hasDescriptionContent) {
      newErrors.description = 'Description is required';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async () => {
    if (!validateForm()) return;

    setIsSubmitting(true);
    const newErrors = {};

    try {
      // 1. Upload all images and collect paths
      const imagePaths = [];

      const allFiles = [
        ...(formData.mainImage ? [formData.mainImage] : []),
        ...formData.additionalImages,
      ];

      for (const file of allFiles) {
        if (file instanceof File) {
          const res = await featuredAdvertsAPI.uploadImage(file);
          if (res?.success && res.data?.path) {
            imagePaths.push(res.data.path);
          }
        }
      }

      // 2. Build description from all text fields
      const descriptionParts = [
        formData.overview,
        formData.keyFeatures ? `Key Features:\n${formData.keyFeatures}` : '',
        formData.whatMakesItSpecial ? `What Makes It Special:\n${formData.whatMakesItSpecial}` : '',
        formData.whyFeatured ? `Why Featured:\n${formData.whyFeatured}` : '',
      ].filter(Boolean);

      // 3. Map form fields to backend field names
      const conditionMap = {
        'New': 'new',
        'Used': 'used',
        'Refurbished': 'refurbished',
        'Not Applicable': 'not_applicable',
      };

      const payload = {
        title: formData.title,
        description: descriptionParts.join('\n\n'),
        advert_type: formData.advertType,
        condition: conditionMap[formData.condition] || undefined,
        price: formData.price ? parseFloat(String(formData.price).replace(/[^0-9.]/g, '')) || undefined : undefined,
        currency: 'GBP',
        country: formData.country,
        city: formData.city,
        category_id: formData.category,
        contact_name: formData.sellerName,
        contact_email: formData.email,
        contact_phone: formData.phone || undefined,
        website: formData.website || undefined,
        video_url: formData.videoLink || undefined,
        images: imagePaths.length > 0 ? imagePaths : undefined,
        upsell_tier: formData.promotionTier,
        is_verified_seller: formData.verifiedBadge,
      };

      // Remove undefined keys
      Object.keys(payload).forEach(key => payload[key] === undefined && delete payload[key]);

      const result = isEditing
        ? await featuredAdvertsAPI.updateFeaturedAdvert(editingAdvert.id, payload)
        : await featuredAdvertsAPI.createFeaturedAdvert(payload);

      if (result?.success) {
        alert(isEditing ? 'Featured advert updated successfully!' : 'Featured advert posted successfully!');
        onClose();
      } else {
        throw new Error(result?.message || 'Submission failed');
      }
    } catch (err) {
      console.error('Submit error:', err);

      if (err.errors) {
        Object.assign(newErrors, err.errors);
        setErrors(newErrors);
      } else {
        alert(`Error: ${err.message || 'Failed to submit. Please check you are logged in and try again.'}`);
      }
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 z-50 overflow-y-auto">
      <div className="min-h-screen px-4 py-8 flex items-start justify-center">
        <div className="bg-white rounded-2xl shadow-2xl w-full max-w-6xl my-8">
          {/* Header */}
          <div className="sticky top-0 bg-white border-b border-gray-200 px-6 py-4 z-10">
            <div className="flex items-center justify-between">
              <h2 className="text-2xl font-bold text-gray-900">Post Featured Advert</h2>
              <button
                onClick={onClose}
                className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
              >
                <X className="h-5 w-5 text-gray-500" />
              </button>
            </div>
          </div>

          {/* Content - Single Page Form */}
          <div className="px-6 py-8 space-y-10">
            
            {/* Section 1: Advert Type */}
            <section>
              <h3 className="text-xl font-semibold text-gray-900 mb-4 flex items-center">
                <Tag className="h-5 w-5 mr-2 text-purple-600" />
                Advert Type
              </h3>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                {advertTypes.map((type) => {
                  const Icon = type.icon;
                  return (
                    <div
                      key={type.id}
                      onClick={() => handleInputChange('advertType', type.id)}
                      className={`p-4 border-2 rounded-xl cursor-pointer transition-all ${
                        formData.advertType === type.id
                          ? 'border-purple-500 bg-purple-50'
                          : 'border-gray-200 hover:border-gray-300'
                      }`}
                    >
                      <div className={`h-10 w-10 bg-gradient-to-br ${type.color} rounded-lg flex items-center justify-center mb-3`}>
                        <Icon className="h-5 w-5 text-white" />
                      </div>
                      <h4 className="font-semibold text-gray-900 text-sm mb-1">{type.name}</h4>
                      <p className="text-xs text-gray-600">{type.description}</p>
                    </div>
                  );
                })}
              </div>
              {errors.advertType && (
                <p className="text-red-500 text-sm mt-2 flex items-center">
                  <AlertCircle className="h-4 w-4 mr-1" />
                  {errors.advertType}
                </p>
              )}
            </section>

            {/* Section 2: Basic Information */}
            <section>
              <h3 className="text-xl font-semibold text-gray-900 mb-4 flex items-center">
                <FileText className="h-5 w-5 mr-2 text-purple-600" />
                Basic Information
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Title *</label>
                  <input
                    type="text"
                    value={formData.title}
                    onChange={(e) => handleInputChange('title', e.target.value)}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                    placeholder="Enter advert title"
                  />
                  {errors.title && <p className="text-red-500 text-sm mt-1">{errors.title}</p>}
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Tagline (max 80 chars) *</label>
                  <input
                    type="text"
                    value={formData.tagline}
                    onChange={(e) => handleInputChange('tagline', e.target.value.slice(0, 80))}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                    placeholder="Short catchy description"
                    maxLength={80}
                  />
                  <p className="text-xs text-gray-500 mt-1">{formData.tagline.length}/80 characters</p>
                  {errors.tagline && <p className="text-red-500 text-sm mt-1">{errors.tagline}</p>}
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Category *</label>
                  <select
                    value={formData.category}
                    onChange={(e) => handleInputChange('category', e.target.value)}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                  >
                    <option value="">Select category</option>
                    {categories.map(cat => (
                      <option key={cat.value} value={cat.value}>{cat.label}</option>
                    ))}
                  </select>
                  {errors.category && <p className="text-red-500 text-sm mt-1">{errors.category}</p>}
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Condition *</label>
                  <select
                    value={formData.condition}
                    onChange={(e) => handleInputChange('condition', e.target.value)}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                  >
                    <option value="">Select condition</option>
                    {conditions.map(cond => (
                      <option key={cond} value={cond}>{cond}</option>
                    ))}
                  </select>
                  {errors.condition && <p className="text-red-500 text-sm mt-1">{errors.condition}</p>}
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Country *</label>
                  <select
                    value={formData.country}
                    onChange={(e) => handleInputChange('country', e.target.value)}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                  >
                    <option value="">Select country</option>
                    {countries.map(country => (
                      <option key={country.value} value={country.value}>
                        {country.flag} {country.label}
                      </option>
                    ))}
                  </select>
                  {errors.country && <p className="text-red-500 text-sm mt-1">{errors.country}</p>}
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">City *</label>
                  <input
                    type="text"
                    value={formData.city}
                    onChange={(e) => handleInputChange('city', e.target.value)}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                    placeholder="Enter city"
                  />
                  {errors.city && <p className="text-red-500 text-sm mt-1">{errors.city}</p>}
                </div>

                <div className="md:col-span-2">
                  <label className="block text-sm font-medium text-gray-700 mb-2">Price</label>
                  <input
                    type="text"
                    value={formData.price}
                    onChange={(e) => handleInputChange('price', e.target.value)}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                    placeholder="Enter price (e.g., £1,000, €500, etc.)"
                  />
                </div>
              </div>
            </section>

            {/* Section 3: Media Upload */}
            <section>
              <h3 className="text-xl font-semibold text-gray-900 mb-4 flex items-center">
                <Camera className="h-5 w-5 mr-2 text-purple-600" />
                Media Upload
              </h3>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Main Image *</label>
                  <div className="border-2 border-dashed border-gray-300 rounded-lg p-6 text-center hover:border-gray-400 transition-colors">
                    <input
                      type="file"
                      accept="image/*"
                      onChange={(e) => handleImageUpload(e, true)}
                      className="hidden"
                      id="main-image-upload"
                    />
                    <label htmlFor="main-image-upload" className="cursor-pointer">
                      <Camera className="h-10 w-10 text-gray-400 mx-auto mb-3" />
                      <p className="text-gray-600 mb-1">Click to upload main image</p>
                      <p className="text-sm text-gray-500">PNG, JPG, GIF up to 10MB</p>
                    </label>
                  </div>
                  {errors.mainImage && <p className="text-red-500 text-sm mt-1">{errors.mainImage}</p>}
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Additional Images (up to 10)</label>
                  <div className="border-2 border-dashed border-gray-300 rounded-lg p-6 text-center hover:border-gray-400 transition-colors">
                    <input
                      type="file"
                      accept="image/*"
                      multiple
                      onChange={(e) => handleImageUpload(e, false)}
                      className="hidden"
                      id="additional-images-upload"
                    />
                    <label htmlFor="additional-images-upload" className="cursor-pointer">
                      <Upload className="h-10 w-10 text-gray-400 mx-auto mb-3" />
                      <p className="text-gray-600 mb-1">Click to upload additional images</p>
                      <p className="text-sm text-gray-500">PNG, JPG, GIF up to 10MB each</p>
                    </label>
                  </div>
                </div>
              </div>

              <div className="mt-4">
                <label className="block text-sm font-medium text-gray-700 mb-2">Video Link (optional)</label>
                <input
                  type="url"
                  value={formData.videoLink}
                  onChange={(e) => handleInputChange('videoLink', e.target.value)}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                  placeholder="https://youtube.com/watch?v=..."
                />
              </div>

              {uploadedImages.length > 0 && (
                <div className="mt-4">
                  <label className="block text-sm font-medium text-gray-700 mb-2">Uploaded Images</label>
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                    {uploadedImages.map((image, index) => (
                      <div key={index} className="relative group">
                        <img
                          src={image.preview}
                          alt={`Upload ${index + 1}`}
                          className="w-full h-32 object-cover rounded-lg"
                        />
                        <button
                          onClick={() => removeImage(index)}
                          className="absolute top-2 right-2 bg-red-500 text-white p-1 rounded-full opacity-0 group-hover:opacity-100 transition-opacity"
                        >
                          <X className="h-4 w-4" />
                        </button>
                        {image.isMain && (
                          <div className="absolute top-2 left-2 bg-purple-500 text-white px-2 py-1 rounded text-xs">
                            Main
                          </div>
                        )}
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </section>

            {/* Section 4: Description */}
            <section>
              <h3 className="text-xl font-semibold text-gray-900 mb-4 flex items-center">
                <FileText className="h-5 w-5 mr-2 text-purple-600" />
                Description
              </h3>
              
              {errors.description && (
                <p className="text-red-500 text-sm mb-4 flex items-center">
                  <AlertCircle className="h-4 w-4 mr-1" />
                  {errors.description}
                </p>
              )}
              
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Overview *</label>
                  <textarea
                    value={formData.overview}
                    onChange={(e) => handleInputChange('overview', e.target.value)}
                    rows={4}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                    placeholder="Provide a detailed overview of your advert..."
                  />
                  {errors.overview && <p className="text-red-500 text-sm mt-1">{errors.overview}</p>}
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Key Features *</label>
                  <textarea
                    value={formData.keyFeatures}
                    onChange={(e) => handleInputChange('keyFeatures', e.target.value)}
                    rows={4}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                    placeholder="List the main features and benefits..."
                  />
                  {errors.keyFeatures && <p className="text-red-500 text-sm mt-1">{errors.keyFeatures}</p>}
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">What Makes It Special</label>
                  <textarea
                    value={formData.whatMakesItSpecial}
                    onChange={(e) => handleInputChange('whatMakesItSpecial', e.target.value)}
                    rows={3}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                    placeholder="Describe unique selling points..."
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Why It Should Be Featured</label>
                  <textarea
                    value={formData.whyFeatured}
                    onChange={(e) => handleInputChange('whyFeatured', e.target.value)}
                    rows={3}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                    placeholder="Explain why this advert deserves featured status..."
                  />
                </div>
              </div>
            </section>

            {/* Section 5: Seller Information */}
            <section>
              <h3 className="text-xl font-semibold text-gray-900 mb-4 flex items-center">
                <User className="h-5 w-5 mr-2 text-purple-600" />
                Seller Information
              </h3>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Name *</label>
                  <input
                    type="text"
                    value={formData.sellerName}
                    onChange={(e) => handleInputChange('sellerName', e.target.value)}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                    placeholder="Your name"
                  />
                  {errors.sellerName && <p className="text-red-500 text-sm mt-1">{errors.sellerName}</p>}
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Business Name (optional)</label>
                  <input
                    type="text"
                    value={formData.businessName}
                    onChange={(e) => handleInputChange('businessName', e.target.value)}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                    placeholder="Business name"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Phone *</label>
                  <input
                    type="tel"
                    value={formData.phone}
                    onChange={(e) => handleInputChange('phone', e.target.value)}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                    placeholder="+1 555-0123"
                  />
                  {errors.phone && <p className="text-red-500 text-sm mt-1">{errors.phone}</p>}
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Email *</label>
                  <input
                    type="email"
                    value={formData.email}
                    onChange={(e) => handleInputChange('email', e.target.value)}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                    placeholder="email@example.com"
                  />
                  {errors.email && <p className="text-red-500 text-sm mt-1">{errors.email}</p>}
                </div>

                <div className="md:col-span-2">
                  <label className="block text-sm font-medium text-gray-700 mb-2">Website (optional)</label>
                  <input
                    type="url"
                    value={formData.website}
                    onChange={(e) => handleInputChange('website', e.target.value)}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                    placeholder="https://example.com"
                  />
                </div>

                <div className="md:col-span-2">
                  <label className="block text-sm font-medium text-gray-700 mb-2">Social Links (optional)</label>
                  <input
                    type="text"
                    value={formData.socialLinks}
                    onChange={(e) => handleInputChange('socialLinks', e.target.value)}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                    placeholder="Facebook, Twitter, LinkedIn, etc."
                  />
                </div>

                <div className="md:col-span-2">
                  <label className="flex items-center space-x-3">
                    <input
                      type="checkbox"
                      checked={formData.verifiedBadge}
                      onChange={(e) => handleInputChange('verifiedBadge', e.target.checked)}
                      className="h-4 w-4 text-purple-600 focus:ring-purple-500 border-gray-300 rounded"
                    />
                    <span className="text-sm text-gray-700">
                      Add Verified Badge (+£10/month) 
                      <Info className="h-4 w-4 inline-block ml-1 text-gray-400" />
                    </span>
                  </label>
                </div>
              </div>
            </section>

            {/* Section 6: Location */}
            <section>
              <h3 className="text-xl font-semibold text-gray-900 mb-4 flex items-center">
                <MapPin className="h-5 w-5 mr-2 text-purple-600" />
                Location
              </h3>
              
              <div>
                <label className="flex items-center space-x-3 mb-4">
                  <input
                    type="checkbox"
                    checked={formData.useExactLocation}
                    onChange={(e) => handleInputChange('useExactLocation', e.target.checked)}
                    className="h-4 w-4 text-purple-600 focus:ring-purple-500 border-gray-300 rounded"
                  />
                  <span className="text-sm text-gray-700">Use exact location (recommended)</span>
                </label>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Address *</label>
                <input
                  type="text"
                  value={formData.address}
                  onChange={(e) => handleInputChange('address', e.target.value)}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                  placeholder="Enter full address"
                />
                {errors.address && <p className="text-red-500 text-sm mt-1">{errors.address}</p>}
              </div>

              <div className="bg-gray-100 rounded-lg p-8 text-center mt-4">
                <MapPin className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                <p className="text-gray-600">Interactive map will appear here</p>
                <p className="text-sm text-gray-500 mt-2">Users can pin their exact location</p>
              </div>
            </section>

            {/* Section 7: Premium Upsell Options */}
            <section>
              <h3 className="text-xl font-semibold text-gray-900 mb-4 flex items-center">
                <Crown className="h-5 w-5 mr-2 text-purple-600" />
                Premium Upsell Options
              </h3>
              
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                {promotionTiers.map((tier) => {
                  const Icon = tier.icon;
                  return (
                    <div
                      key={tier.id}
                      onClick={() => handleInputChange('promotionTier', tier.id)}
                      className={`relative border-2 rounded-xl p-6 cursor-pointer transition-all ${
                        formData.promotionTier === tier.id
                          ? 'border-purple-500 bg-purple-50'
                          : 'border-gray-200 hover:border-gray-300'
                      }`}
                    >
                      {tier.popular && (
                        <div className="absolute -top-3 left-1/2 transform -translate-x-1/2">
                          <span className="bg-purple-500 text-white px-3 py-1 rounded-full text-xs font-semibold">
                            Most Popular
                          </span>
                        </div>
                      )}
                      
                      <div className={`h-12 w-12 bg-gradient-to-br ${tier.color} rounded-lg flex items-center justify-center mb-4`}>
                        <Icon className="h-6 w-6 text-white" />
                      </div>
                      
                      <h4 className="font-semibold text-gray-900 mb-2">{tier.name}</h4>
                      <div className="text-2xl font-bold text-gray-900 mb-2">
                        {tier.price}
                        <span className="text-sm font-normal text-gray-500">/{tier.period}</span>
                      </div>
                      <p className="text-sm text-gray-600 mb-4">{tier.description}</p>
                      
                      <ul className="space-y-2">
                        {tier.features.map((feature, index) => (
                          <li key={index} className="flex items-start">
                            <Check className="h-4 w-4 text-green-500 mr-2 mt-0.5 flex-shrink-0" />
                            <span className="text-sm text-gray-700">{feature}</span>
                          </li>
                        ))}
                      </ul>
                    </div>
                  );
                })}
              </div>
              
              {errors.promotionTier && (
                <p className="text-red-500 text-sm mt-2 flex items-center">
                  <AlertCircle className="h-4 w-4 mr-1" />
                  {errors.promotionTier}
                </p>
              )}

              <div className="bg-gradient-to-r from-purple-50 to-blue-50 border border-purple-200 rounded-lg p-6 mt-6">
                <h4 className="font-semibold text-gray-900 mb-4 flex items-center">
                  <Target className="h-5 w-5 mr-2 text-purple-600" />
                  Promotion Benefits
                </h4>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="flex items-center">
                    <TrendingUp className="h-5 w-5 text-green-500 mr-2" />
                    <span className="text-sm text-gray-700">Increased visibility and reach</span>
                  </div>
                  <div className="flex items-center">
                    <Award className="h-5 w-5 text-yellow-500 mr-2" />
                    <span className="text-sm text-gray-700">Premium badge and placement</span>
                  </div>
                  <div className="flex items-center">
                    <Users className="h-5 w-5 text-blue-500 mr-2" />
                    <span className="text-sm text-gray-700">More qualified leads</span>
                  </div>
                  <div className="flex items-center">
                    <BarChart3 className="h-5 w-5 text-purple-500 mr-2" />
                    <span className="text-sm text-gray-700">Advanced analytics</span>
                  </div>
                </div>
              </div>
            </section>

            {/* Section 8: Terms and Conditions */}
            <section>
              <h3 className="text-xl font-semibold text-gray-900 mb-4 flex items-center">
                <Shield className="h-5 w-5 mr-2 text-purple-600" />
                Terms & Conditions
              </h3>
              
              <div className="space-y-4">
                <label className="flex items-start space-x-3">
                  <input
                    type="checkbox"
                    checked={formData.termsAccepted}
                    onChange={(e) => handleInputChange('termsAccepted', e.target.checked)}
                    className="h-4 w-4 text-purple-600 focus:ring-purple-500 border-gray-300 rounded mt-1"
                  />
                  <span className="text-sm text-gray-700">
                    I agree to the terms and conditions of Worldwide Adverts. I understand that my advert will be displayed according to the selected promotion tier and I will be charged accordingly. *
                  </span>
                </label>
                {errors.termsAccepted && <p className="text-red-500 text-sm">{errors.termsAccepted}</p>}

                <label className="flex items-start space-x-3">
                  <input
                    type="checkbox"
                    checked={formData.accurateInfo}
                    onChange={(e) => handleInputChange('accurateInfo', e.target.checked)}
                    className="h-4 w-4 text-purple-600 focus:ring-purple-500 border-gray-300 rounded mt-1"
                  />
                  <span className="text-sm text-gray-700">
                    I confirm that all information provided in this advert is accurate and true. I understand that false information may result in my advert being removed and my account being suspended. *
                  </span>
                </label>
                {errors.accurateInfo && <p className="text-red-500 text-sm">{errors.accurateInfo}</p>}
              </div>
            </section>

          </div>

          {/* Footer */}
          <div className="sticky bottom-0 bg-white border-t border-gray-200 px-6 py-4">
            <div className="flex items-center justify-between">
              <button
                onClick={onClose}
                className="flex items-center space-x-2 px-6 py-2 bg-gray-200 text-gray-700 rounded-lg hover:bg-gray-300 transition-colors"
              >
                <span>Cancel</span>
              </button>

              <div className="flex items-center space-x-4">
                <div className="text-right">
                  <p className="text-sm text-gray-600">Total Cost</p>
                  <p className="text-xl font-bold text-purple-600">
                    {promotionTiers.find(t => t.id === formData.promotionTier)?.price || '£0'}/month
                  </p>
                </div>
                <button
                  onClick={handleSubmit}
                  disabled={isSubmitting}
                  className="flex items-center space-x-2 px-8 py-3 bg-gradient-to-r from-purple-500 to-blue-500 text-white font-semibold rounded-lg hover:from-purple-600 hover:to-blue-600 transition-all disabled:opacity-50"
                >
                  {isSubmitting ? (
                    <>
                      <div className="h-4 w-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                      <span>Submitting...</span>
                    </>
                  ) : (
                    <>
                      <CheckSquare className="h-4 w-4" />
                      <span>Submit Featured Advert</span>
                    </>
                  )}
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default FeaturedPostForm;
