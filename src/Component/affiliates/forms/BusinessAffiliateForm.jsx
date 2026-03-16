import React, { useState } from 'react';
import { Upload, X, Loader2 } from 'lucide-react';
import { apiUtils } from '../../../api/index.js';
import toast from 'react-hot-toast';

const BusinessAffiliateForm = ({ formData, updateFormData, categories, onSubmit, loading }) => {
  const [uploadedImages, setUploadedImages] = useState([]);
  const [uploadedAssets, setUploadedAssets] = useState([]);
  const [uploading, setUploading] = useState(false);

  const countries = [
    'United States', 'United Kingdom', 'Canada', 'Australia', 'Germany',
    'France', 'Spain', 'Italy', 'Netherlands', 'Japan', 'China', 'India',
    'Brazil', 'Mexico', 'Argentina', 'South Africa', 'UAE', 'Singapore',
    'Malaysia', 'Thailand', 'Global'
  ];

  const trafficTypes = [
    'Social Media', 'Email', 'PPC', 'Blogging', 'Influencer', 'Other'
  ];

  const handleImageUpload = async (e) => {
    const files = Array.from(e.target.files);
    setUploading(true);
    
    try {
      const uploadPromises = files.map(async (file) => {
        const response = await apiUtils.uploadFile(file, '/v1/affiliates/upload-image');
        return {
          file,
          preview: URL.createObjectURL(file),
          name: file.name,
          url: response.data.url,
          id: response.data.id
        };
      });
      
      const newImages = await Promise.all(uploadPromises);
      setUploadedImages(prev => [...prev, ...newImages].slice(0, 5));
      
      // Update form data with image URLs
      const imageUrls = newImages.map(img => img.url);
      updateFormData('images', [...(formData.images || []), ...imageUrls]);
      
      toast.success('Images uploaded successfully');
    } catch (error) {
      console.error('Upload error:', error);
      toast.error('Failed to upload images');
    } finally {
      setUploading(false);
    }
  };

  const handleAssetUpload = async (e) => {
    const files = Array.from(e.target.files);
    setUploading(true);
    
    try {
      const uploadPromises = files.map(async (file) => {
        const response = await apiUtils.uploadFile(file, '/v1/affiliates/upload-asset');
        return {
          file,
          name: file.name,
          type: file.type,
          url: response.data.url,
          id: response.data.id
        };
      });
      
      const newAssets = await Promise.all(uploadPromises);
      setUploadedAssets(prev => [...prev, ...newAssets]);
      
      // Update form data with asset URLs
      const assetUrls = newAssets.map(asset => asset.url);
      updateFormData('promotionalAssets', [...(formData.promotionalAssets || []), ...assetUrls]);
      
      toast.success('Assets uploaded successfully');
    } catch (error) {
      console.error('Upload error:', error);
      toast.error('Failed to upload assets');
    } finally {
      setUploading(false);
    }
  };

  const removeImage = (index) => {
    const imageToRemove = uploadedImages[index];
    setUploadedImages(prev => prev.filter((_, i) => i !== index));
    
    // Remove from form data
    if (formData.images) {
      const updatedImages = formData.images.filter(url => url !== imageToRemove.url);
      updateFormData('images', updatedImages);
    }
  };

  const removeAsset = (index) => {
    const assetToRemove = uploadedAssets[index];
    setUploadedAssets(prev => prev.filter((_, i) => i !== index));
    
    // Remove from form data
    if (formData.promotionalAssets) {
      const updatedAssets = formData.promotionalAssets.filter(url => url !== assetToRemove.url);
      updateFormData('promotionalAssets', updatedAssets);
    }
  };

  const toggleTrafficType = (type) => {
    updateFormData('allowedTrafficTypes', 
      formData.allowedTrafficTypes?.includes(type)
        ? formData.allowedTrafficTypes.filter(t => t !== type)
        : [...(formData.allowedTrafficTypes || []), type]
    );
  };

  return (
    <div className="space-y-8">
      {/* Basic Business Information */}
      <div className="bg-gray-50 rounded-xl p-6">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">Business Information</h3>
        
        <div className="grid md:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Business Name *
            </label>
            <input
              type="text"
              value={formData.businessName}
              onChange={(e) => updateFormData('businessName', e.target.value)}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              placeholder="Enter your business name"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Business Email *
            </label>
            <input
              type="email"
              value={formData.businessEmail}
              onChange={(e) => updateFormData('businessEmail', e.target.value)}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              placeholder="business@example.com"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Website URL
            </label>
            <input
              type="url"
              value={formData.website}
              onChange={(e) => updateFormData('website', e.target.value)}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              placeholder="https://yourwebsite.com"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Country/Region *
            </label>
            <select
              value={formData.country}
              onChange={(e) => updateFormData('country', e.target.value)}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            >
              <option value="">Select country</option>
              {countries.map(country => (
                <option key={country} value={country}>{country}</option>
              ))}
            </select>
          </div>
        </div>
      </div>

      {/* Product/Service Information */}
      <div className="bg-gray-50 rounded-xl p-6">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">Product/Service Details</h3>
        
        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Product/Service Title *
            </label>
            <input
              type="text"
              value={formData.productTitle}
              onChange={(e) => updateFormData('productTitle', e.target.value)}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              placeholder="Enter your product or service title"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Short Tagline (max 80 chars) *
            </label>
            <input
              type="text"
              value={formData.tagline}
              onChange={(e) => updateFormData('tagline', e.target.value.slice(0, 80))}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              placeholder="Brief, compelling description"
              maxLength={80}
            />
            <p className="text-xs text-gray-500 mt-1">{formData.tagline.length}/80 characters</p>
          </div>

          <div className="grid md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Category *
              </label>
              <select
                value={formData.affiliateCategoryId}
                onChange={(e) => updateFormData('affiliateCategoryId', e.target.value)}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              >
                <option value="">Select category</option>
                {categories?.map(category => (
                  <option key={category.id} value={category.id}>{category.name}</option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Commission Type
              </label>
              <select
                value={formData.commissionType}
                onChange={(e) => updateFormData('commissionType', e.target.value)}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              >
                <option value="percentage">Percentage (%)</option>
                <option value="fixed">Fixed Amount ($)</option>
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Commission Rate {formData.commissionType === 'percentage' ? '(%)' : '($)'}
              </label>
              <input
                type="number"
                value={formData.commissionRate}
                onChange={(e) => updateFormData('commissionRate', e.target.value)}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                placeholder={formData.commissionType === 'percentage' ? 'e.g., 25' : 'e.g., 50'}
                min="0"
                max={formData.commissionType === 'percentage' ? '100' : ''}
                step={formData.commissionType === 'percentage' ? '1' : '0.01'}
              />
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Description *
            </label>
            <textarea
              value={formData.description}
              onChange={(e) => updateFormData('description', e.target.value)}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              rows={4}
              placeholder="Describe your product/service and what makes it attractive to promoters"
            />
          </div>
        </div>
      </div>

      {/* Media Upload */}
      <div className="bg-gray-50 rounded-xl p-6">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">Product Images</h3>
        
        <div className="space-y-4">
          <div className="border-2 border-dashed border-gray-300 rounded-lg p-6 text-center hover:border-gray-400 transition-colors">
            <Upload className="h-12 w-12 text-gray-400 mx-auto mb-4" />
            <p className="text-gray-600 mb-2">Upload product images (1-5 images)</p>
            <p className="text-sm text-gray-500 mb-4">PNG, JPG up to 10MB each</p>
            <input
              type="file"
              multiple
              accept="image/*"
              onChange={handleImageUpload}
              className="hidden"
              id="image-upload"
            />
            <label
              htmlFor="image-upload"
              className="inline-flex items-center px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {uploading ? (
                <>
                  <Loader2 className="h-4 w-4 animate-spin mr-2" />
                  Uploading...
                </>
              ) : (
                'Choose Images'
              )}
            </label>
          </div>

          {uploadedImages.length > 0 && (
            <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
              {uploadedImages.map((image, index) => (
                <div key={index} className="relative group">
                  <img
                    src={image.preview}
                    alt={image.name}
                    className="w-full h-32 object-cover rounded-lg"
                  />
                  <button
                    onClick={() => removeImage(index)}
                    className="absolute top-2 right-2 bg-red-500 text-white p-1 rounded-full opacity-0 group-hover:opacity-100 transition-opacity"
                  >
                    <X className="h-3 w-3" />
                  </button>
                  <p className="text-xs text-gray-600 mt-1 truncate">{image.name}</p>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* Offer Details */}
      <div className="bg-gray-50 rounded-xl p-6">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">Offer Details</h3>
        
        <div className="space-y-4">
          <div className="grid md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Cookie Duration (days)
              </label>
              <input
                type="number"
                value={formData.cookieDuration}
                onChange={(e) => updateFormData('cookieDuration', e.target.value)}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                placeholder="e.g., 30"
                min="1"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Tracking Link *
              </label>
              <input
                type="url"
                value={formData.trackingLink}
                onChange={(e) => updateFormData('trackingLink', e.target.value)}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                placeholder="https://yourtrackinglink.com"
              />
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Allowed Traffic Types
            </label>
            <div className="grid grid-cols-2 md:grid-cols-3 gap-2">
              {trafficTypes.map(type => (
                <label key={type} className="flex items-center space-x-2 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={formData.allowedTrafficTypes?.includes(type) || false}
                    onChange={() => toggleTrafficType(type)}
                    className="rounded text-blue-600 focus:ring-blue-500"
                  />
                  <span className="text-sm text-gray-700">{type}</span>
                </label>
              ))}
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Optional Restrictions
            </label>
            <textarea
              value={formData.restrictions}
              onChange={(e) => updateFormData('restrictions', e.target.value)}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              rows={3}
              placeholder="Any restrictions or guidelines for promoters (optional)"
            />
          </div>
        </div>
      </div>

      {/* Promotional Assets */}
      <div className="bg-gray-50 rounded-xl p-6">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">Promotional Assets</h3>
        
        <div className="space-y-4">
          <div className="border-2 border-dashed border-gray-300 rounded-lg p-6 text-center hover:border-gray-400 transition-colors">
            <Upload className="h-12 w-12 text-gray-400 mx-auto mb-4" />
            <p className="text-gray-600 mb-2">Upload promotional assets</p>
            <p className="text-sm text-gray-500 mb-4">Banners, logos, videos, product images</p>
            <input
              type="file"
              multiple
              accept="image/*,video/*,.pdf"
              onChange={handleAssetUpload}
              className="hidden"
              id="asset-upload"
            />
            <label
              htmlFor="asset-upload"
              className="inline-flex items-center px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {uploading ? (
                <>
                  <Loader2 className="h-4 w-4 animate-spin mr-2" />
                  Uploading...
                </>
              ) : (
                'Choose Assets'
              )}
            </label>
          </div>

          {uploadedAssets.length > 0 && (
            <div className="space-y-2">
              {uploadedAssets.map((asset, index) => (
                <div key={index} className="flex items-center justify-between bg-white p-3 rounded-lg border">
                  <div className="flex items-center space-x-3">
                    <div className="w-8 h-8 bg-blue-100 rounded flex items-center justify-center">
                      <Upload className="h-4 w-4 text-blue-600" />
                    </div>
                    <div>
                      <p className="text-sm font-medium text-gray-900">{asset.name}</p>
                      <p className="text-xs text-gray-500">{asset.type}</p>
                    </div>
                  </div>
                  <button
                    onClick={() => removeAsset(index)}
                    className="text-red-500 hover:text-red-700"
                  >
                    <X className="h-4 w-4" />
                  </button>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default BusinessAffiliateForm;
