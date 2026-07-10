import React, { useState, useEffect } from 'react';
import { Upload, X, Image as ImageIcon, Check, ChevronRight, ChevronLeft, AlertCircle } from 'lucide-react';
import imagesApi from '../../services/imagesAPI';

const ImagesPostForm = () => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(false);
  
  // Form data
  const [formData, setFormData] = useState({
    // Step 1: Image Upload
    mainImage: null,
    images: [],
    thumbnail: null,
    width: null,
    height: null,
    orientation: 'landscape',
    colorType: 'color',
    dominantColor: '',
    
    // Step 2: Basic Info
    title: '',
    description: '',
    shortDescription: '',
    imageCategory: '',
    tags: [],
    
    // Step 3: Pricing & Licensing
    licenseType: 'royalty_free',
    standardPrice: '',
    extendedPrice: '',
    exclusivePrice: '',
    currency: 'GBP',
    
    // Step 4: Contact Info
    contactName: '',
    contactEmail: '',
    contactPhone: '',
    businessName: '',
    website: '',
    socialLinks: {},
    
    // Step 5: Releases
    hasModelRelease: false,
    modelReleaseDocument: null,
    hasPropertyRelease: false,
    propertyReleaseDocument: null,
    
    // Step 6: Promotion
    promotionTier: 'standard',
    agreedToTerms: false,
  });

  // API data
  const [categories, setCategories] = useState({});
  const [licenseTypes, setLicenseTypes] = useState({});
  const [promotionTiers, setPromotionTiers] = useState({});

  useEffect(() => {
    loadApiData();
  }, []);

  const loadApiData = async () => {
    try {
      const [categoriesRes, licenseTypesRes, promotionTiersRes] = await Promise.all([
        imagesApi.getCategories(),
        imagesApi.getLicenseTypes(),
        imagesApi.getPromotionTiers(),
      ]);
      
      setCategories(categoriesRes.data || {});
      setLicenseTypes(licenseTypesRes.data || {});
      setPromotionTiers(promotionTiersRes.data || {});
    } catch (err) {
      console.error('Failed to load API data:', err);
    }
  };

  const handleImageUpload = async (file) => {
    const formData = new FormData();
    formData.append('image', file);

    try {
      setLoading(true);
      const response = await imagesApi.uploadImage(formData);
      const imageData = response.data;
      
      setFormData(prev => ({
        ...prev,
        mainImage: imageData.path,
        thumbnail: imageData.path,
        width: imageData.width,
        height: imageData.height,
        orientation: imageData.orientation,
      }));
      
      setLoading(false);
      return imageData;
    } catch (err) {
      setError('Failed to upload image: ' + err.message);
      setLoading(false);
      throw err;
    }
  };

  const handleMultipleImageUpload = async (files) => {
    const formData = new FormData();
    Array.from(files).forEach(file => {
      formData.append('images[]', file);
    });

    try {
      setLoading(true);
      const response = await imagesApi.uploadMultipleImages(formData);
      const uploadedImages = response.data;
      
      setFormData(prev => ({
        ...prev,
        images: [...prev.images, ...uploadedImages.map(img => img.path)],
      }));
      
      setLoading(false);
      return uploadedImages;
    } catch (err) {
      setError('Failed to upload images: ' + err.message);
      setLoading(false);
      throw err;
    }
  };

  const handleSubmit = async () => {
    try {
      setLoading(true);
      setError(null);

      const payload = {
        title: formData.title,
        description: formData.description,
        short_description: formData.shortDescription || null,
        main_image: formData.mainImage,
        images: formData.images,
        thumbnail: formData.thumbnail || null,
        width: formData.width || null,
        height: formData.height || null,
        orientation: formData.orientation,
        color_type: formData.colorType,
        dominant_color: formData.dominantColor || null,
        image_category: formData.imageCategory,
        tags: formData.tags,
        license_type: formData.licenseType,
        standard_price: parseFloat(formData.standardPrice) || 0,
        extended_price: formData.extendedPrice ? parseFloat(formData.extendedPrice) : null,
        exclusive_price: formData.exclusivePrice ? parseFloat(formData.exclusivePrice) : null,
        currency: formData.currency,
        contact_name: formData.contactName,
        contact_email: formData.contactEmail,
        contact_phone: formData.contactPhone || null,
        business_name: formData.businessName || null,
        website: formData.website || null,
        social_links: Object.keys(formData.socialLinks).length > 0 ? formData.socialLinks : null,
        has_model_release: formData.hasModelRelease,
        model_release_document: formData.modelReleaseDocument || null,
        has_property_release: formData.hasPropertyRelease,
        property_release_document: formData.propertyReleaseDocument || null,
        promotion_tier: formData.promotionTier,
        agreed_to_terms: formData.agreedToTerms,
      };

      const response = await imagesApi.createImage(payload);
      setSuccess(true);
      setLoading(false);
    } catch (err) {
      setError(err.message);
      setLoading(false);
    }
  };

  
  if (success) {
    return (
      <div className="max-w-2xl mx-auto p-8 bg-white rounded-lg shadow">
        <div className="text-center">
          <div className="mx-auto w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mb-4">
            <Check className="w-8 h-8 text-green-600" />
          </div>
          <h2 className="text-2xl font-bold text-gray-900 mb-2">Image Submitted Successfully!</h2>
          <p className="text-gray-600 mb-6">Your image has been submitted for admin verification. You will be notified once it's approved.</p>
          <button
            onClick={() => window.location.href = '/images'}
            className="px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition"
          >
            Back to Images
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto p-6">
      <div className="bg-white rounded-lg shadow-lg">
        {/* Header */}
        <div className="border-b px-6 py-4">
          <h2 className="text-2xl font-bold text-gray-900">Sell Your Images</h2>
          <p className="text-gray-600 mt-1">Fill in all the details below to submit your image</p>
        </div>

        {/* Error Message */}
        {error && (
          <div className="mx-6 mt-4 p-4 bg-red-50 border border-red-200 rounded-lg flex items-start">
            <AlertCircle className="w-5 h-5 text-red-600 mr-2 flex-shrink-0 mt-0.5" />
            <p className="text-red-800 text-sm">{error}</p>
          </div>
        )}

        {/* Form Content - Single Page */}
        <div className="p-6 space-y-8">
          {/* Section 1: Image Upload */}
          <div className="space-y-6">
            <h3 className="text-xl font-semibold flex items-center">
              <Upload className="w-5 h-5 mr-2 text-blue-600" />
              Upload Your Image
            </h3>
              
              <div className="border-2 border-dashed border-gray-300 rounded-lg p-8 text-center hover:border-blue-500 transition cursor-pointer">
                <Upload className="w-12 h-12 mx-auto text-gray-400 mb-4" />
                <p className="text-gray-600 mb-2">Drag and drop your main image here, or click to browse</p>
                <p className="text-sm text-gray-500">JPG, PNG, GIF, WebP up to 10MB</p>
                <input
                  type="file"
                  accept="image/jpeg,image/png,image/gif,image/webp"
                  onChange={(e) => handleImageUpload(e.target.files[0])}
                  className="hidden"
                  id="mainImageInput"
                />
                <label htmlFor="mainImageInput" className="mt-4 inline-block px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition cursor-pointer">
                  Select Image
                </label>
              </div>

              {formData.mainImage && (
                <div className="relative">
                  <img src={formData.mainImage.startsWith('http') ? formData.mainImage : `${process.env.REACT_APP_API_URL?.replace('/api/v1', '')}/storage/${formData.mainImage}`} 
                       alt="Preview" className="w-full max-h-96 object-contain rounded-lg" />
                  <button
                    onClick={() => setFormData(prev => ({ ...prev, mainImage: null, images: [] }))}
                    className="absolute top-2 right-2 p-2 bg-red-600 text-white rounded-full hover:bg-red-700"
                  >
                    <X className="w-4 h-4" />
                  </button>
                  <div className="mt-2 text-sm text-gray-600">
                    Dimensions: {formData.width} x {formData.height}px • Orientation: {formData.orientation}
                  </div>
                </div>
              )}

              <div className="border-2 border-dashed border-gray-300 rounded-lg p-6 text-center hover:border-blue-500 transition cursor-pointer">
                <Upload className="w-8 h-8 mx-auto text-gray-400 mb-2" />
                <p className="text-gray-600 mb-2">Upload additional images (optional)</p>
                <p className="text-sm text-gray-500">Multiple files supported</p>
                <input
                  type="file"
                  accept="image/jpeg,image/png,image/gif,image/webp"
                  multiple
                  onChange={(e) => handleMultipleImageUpload(e.target.files)}
                  className="hidden"
                  id="additionalImagesInput"
                />
                <label htmlFor="additionalImagesInput" className="mt-4 inline-block px-4 py-2 bg-gray-600 text-white rounded-lg hover:bg-gray-700 transition cursor-pointer">
                  Select Additional Images
                </label>
              </div>

              {formData.images.length > 0 && (
                <div className="grid grid-cols-4 gap-4">
                  {formData.images.map((img, idx) => (
                    <div key={idx} className="relative">
                      <img src={img.startsWith('http') ? img : `${process.env.REACT_APP_API_URL?.replace('/api/v1', '')}/storage/${img}`}
                           alt={`Additional ${idx + 1}`} className="w-full h-24 object-cover rounded" />
                    </div>
                  ))}
                </div>
              )}
          </div>

          {/* Section 2: Basic Info */}
          <div className="space-y-6 border-t pt-8">
            <h3 className="text-xl font-semibold flex items-center">
              <ImageIcon className="w-5 h-5 mr-2 text-blue-600" />
              Basic Information
            </h3>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Title *</label>
                <input
                  type="text"
                  value={formData.title}
                  onChange={(e) => setFormData(prev => ({ ...prev, title: e.target.value }))}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  placeholder="e.g., Modern Office Workspace"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Description *</label>
                <textarea
                  value={formData.description}
                  onChange={(e) => setFormData(prev => ({ ...prev, description: e.target.value }))}
                  rows={4}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  placeholder="Describe your image in detail..."
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Short Description</label>
                <input
                  type="text"
                  value={formData.shortDescription}
                  onChange={(e) => setFormData(prev => ({ ...prev, shortDescription: e.target.value }))}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  placeholder="Brief description for listings"
                  maxLength={500}
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Category *</label>
                <select
                  value={formData.imageCategory}
                  onChange={(e) => setFormData(prev => ({ ...prev, imageCategory: e.target.value }))}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                >
                  <option value="">Select a category</option>
                  {Object.entries(categories).map(([key, value]) => (
                    <option key={key} value={key}>{value.name}</option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Tags (comma separated)</label>
                <input
                  type="text"
                  value={formData.tags.join(', ')}
                  onChange={(e) => setFormData(prev => ({ ...prev, tags: e.target.value.split(',').map(t => t.trim()).filter(Boolean) }))}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  placeholder="e.g., business, office, startup, workspace"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Color Type</label>
                <select
                  value={formData.colorType}
                  onChange={(e) => setFormData(prev => ({ ...prev, colorType: e.target.value }))}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                >
                  <option value="color">Color</option>
                  <option value="black_white">Black & White</option>
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Dominant Color</label>
                <input
                  type="text"
                  value={formData.dominantColor}
                  onChange={(e) => setFormData(prev => ({ ...prev, dominantColor: e.target.value }))}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  placeholder="e.g., #FF0000 or red"
                />
              </div>
          </div>

          {/* Section 3: Pricing & Licensing */}
          <div className="space-y-6 border-t pt-8">
            <h3 className="text-xl font-semibold flex items-center">
              <Check className="w-5 h-5 mr-2 text-blue-600" />
              Pricing & Licensing
            </h3>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">License Type *</label>
                <select
                  value={formData.licenseType}
                  onChange={(e) => setFormData(prev => ({ ...prev, licenseType: e.target.value }))}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                >
                  {Object.entries(licenseTypes).map(([key, value]) => (
                    <option key={key} value={key}>{value.name} - {value.description}</option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Standard Price (GBP) *</label>
                <input
                  type="number"
                  step="0.01"
                  min="0"
                  value={formData.standardPrice}
                  onChange={(e) => setFormData(prev => ({ ...prev, standardPrice: e.target.value }))}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  placeholder="9.99"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Extended Price (GBP)</label>
                <input
                  type="number"
                  step="0.01"
                  min="0"
                  value={formData.extendedPrice}
                  onChange={(e) => setFormData(prev => ({ ...prev, extendedPrice: e.target.value }))}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  placeholder="39.99"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Exclusive Price (GBP)</label>
                <input
                  type="number"
                  step="0.01"
                  min="0"
                  value={formData.exclusivePrice}
                  onChange={(e) => setFormData(prev => ({ ...prev, exclusivePrice: e.target.value }))}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  placeholder="199.99"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Currency</label>
                <select
                  value={formData.currency}
                  onChange={(e) => setFormData(prev => ({ ...prev, currency: e.target.value }))}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                >
                  <option value="GBP">GBP (£)</option>
                  <option value="USD">USD ($)</option>
                  <option value="EUR">EUR (€)</option>
                </select>
              </div>
          </div>

          {/* Section 4: Contact Information */}
          <div className="space-y-6 border-t pt-8">
            <h3 className="text-xl font-semibold flex items-center">
              <Check className="w-5 h-5 mr-2 text-blue-600" />
              Contact Information
            </h3>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Contact Name *</label>
                <input
                  type="text"
                  value={formData.contactName}
                  onChange={(e) => setFormData(prev => ({ ...prev, contactName: e.target.value }))}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  placeholder="John Doe"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Contact Email *</label>
                <input
                  type="email"
                  value={formData.contactEmail}
                  onChange={(e) => setFormData(prev => ({ ...prev, contactEmail: e.target.value }))}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  placeholder="john@example.com"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Contact Phone</label>
                <input
                  type="text"
                  value={formData.contactPhone}
                  onChange={(e) => setFormData(prev => ({ ...prev, contactPhone: e.target.value }))}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  placeholder="+44 123 456 7890"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Business Name</label>
                <input
                  type="text"
                  value={formData.businessName}
                  onChange={(e) => setFormData(prev => ({ ...prev, businessName: e.target.value }))}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  placeholder="Your Business Name"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Website</label>
                <input
                  type="url"
                  value={formData.website}
                  onChange={(e) => setFormData(prev => ({ ...prev, website: e.target.value }))}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  placeholder="https://yourwebsite.com"
                />
              </div>
          </div>

          {/* Section 5: Model & Property Releases */}
          <div className="space-y-6 border-t pt-8">
            <h3 className="text-xl font-semibold flex items-center">
              <Check className="w-5 h-5 mr-2 text-blue-600" />
              Model & Property Releases
            </h3>
              
              <div className="flex items-start">
                <input
                  type="checkbox"
                  id="hasModelRelease"
                  checked={formData.hasModelRelease}
                  onChange={(e) => setFormData(prev => ({ ...prev, hasModelRelease: e.target.checked }))}
                  className="mt-1 w-4 h-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
                />
                <label htmlFor="hasModelRelease" className="ml-2 text-sm text-gray-700">
                  This image contains recognizable people and I have a signed model release
                </label>
              </div>

              {formData.hasModelRelease && (
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Upload Model Release Document</label>
                  <input
                    type="file"
                    accept=".pdf,.jpg,.jpeg,.png"
                    onChange={(e) => setFormData(prev => ({ ...prev, modelReleaseDocument: e.target.files[0]?.name }))}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg"
                  />
                </div>
              )}

              <div className="flex items-start">
                <input
                  type="checkbox"
                  id="hasPropertyRelease"
                  checked={formData.hasPropertyRelease}
                  onChange={(e) => setFormData(prev => ({ ...prev, hasPropertyRelease: e.target.checked }))}
                  className="mt-1 w-4 h-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
                />
                <label htmlFor="hasPropertyRelease" className="ml-2 text-sm text-gray-700">
                  This image contains recognizable private property and I have a signed property release
                </label>
              </div>

              {formData.hasPropertyRelease && (
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Upload Property Release Document</label>
                  <input
                    type="file"
                    accept=".pdf,.jpg,.jpeg,.png"
                    onChange={(e) => setFormData(prev => ({ ...prev, propertyReleaseDocument: e.target.files[0]?.name }))}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg"
                  />
                </div>
              )}
          </div>

          {/* Section 6: Terms & Submit */}
          <div className="space-y-6 border-t pt-8">
            <h3 className="text-xl font-semibold flex items-center">
              <Check className="w-5 h-5 mr-2 text-blue-600" />
              Terms & Submit
            </h3>

            <div>
              <label className="flex items-start">
                <input
                  type="checkbox"
                  checked={formData.agreedToTerms}
                  onChange={(e) => setFormData(prev => ({ ...prev, agreedToTerms: e.target.checked }))}
                  className="mt-1 w-4 h-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
                />
                <span className="ml-2 text-sm text-gray-700">
                  I confirm that I own the rights to this image and agree to the terms and conditions of World Wide Adverts.
                </span>
              </label>
            </div>
          </div>

          {/* Submit Button */}
          <div className="flex justify-end mt-8 pt-6 border-t">
            <button
              onClick={handleSubmit}
              disabled={
                !formData.agreedToTerms ||
                !formData.mainImage ||
                !formData.title ||
                !formData.description ||
                !formData.imageCategory ||
                !formData.standardPrice ||
                !formData.contactName ||
                !formData.contactEmail ||
                loading
              }
              className="px-8 py-3 bg-green-600 text-white rounded-lg hover:bg-green-700 disabled:opacity-50 disabled:cursor-not-allowed flex items-center font-semibold"
            >
              {loading ? 'Submitting...' : 'Submit Image'}
              <Check className="w-5 h-5 ml-2" />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ImagesPostForm;
