import React, { useState } from 'react';
import { Upload, X, Plus, Loader2 } from 'lucide-react';
import affiliateService from '../../../services/AffiliateService';
import toast from 'react-hot-toast';
import { WORLD_COUNTRY_NAMES } from '../../../data/worldCountries';

const PromoterAffiliateForm = ({ formData, updateFormData, categories: categoriesProp, onSubmit, loading }) => {
  // Debug: Log received categories
  console.log('📋 PromoterAffiliateForm received categories:', categoriesProp);
  const [uploadedImage, setUploadedImage] = useState(null);
  const [hashtagInput, setHashtagInput] = useState('');
  const [uploading, setUploading] = useState(false);

  const availableCategories = [
    'Technology & Gadgets',
    'Fashion & Beauty',
    'Travel & Tourism',
    'Finance & Insurance',
    'Health & Wellness',
    'Education & Courses',
    'Home & Garden',
    'Automotive',
    'Real Estate',
    'Software & SaaS',
    'Food & Lifestyle',
    'Business Services',
    'Entertainment & Media'
  ];

  const countries = WORLD_COUNTRY_NAMES;

  const suggestedHashtags = [
    'affiliate', 'marketing', 'ecommerce', 'deals', 'discounts',
    'shopping', 'tech', 'fashion', 'travel', 'health',
    'beauty', 'business', 'online', 'money', 'commission'
  ];

  const handleImageUpload = async (e) => {
    const file = e.target.files[0];
    if (file) {
      setUploading(true);
      
      try {
        const response = await affiliateService.uploadImage(file);
        const imageData = {
          file,
          preview: URL.createObjectURL(file),
          name: file.name,
          url: response.data.url,
          id: response.data.id
        };
        
        setUploadedImage(imageData);
        updateFormData('image', response.data.url);
        
        toast.success('Image uploaded successfully');
      } catch (error) {
        console.error('Upload error:', error);
        toast.error('Failed to upload image');
      } finally {
        setUploading(false);
      }
    }
  };

  const removeImage = () => {
    setUploadedImage(null);
    updateFormData('image', null);
  };

  const addHashtag = (tag) => {
    const cleanTag = tag.startsWith('#') ? tag.slice(1) : tag;
    if (cleanTag && !formData.hashtags.includes(cleanTag)) {
      updateFormData('hashtags', [...formData.hashtags, cleanTag]);
    }
    setHashtagInput('');
  };

  const removeHashtag = (tag) => {
    updateFormData('hashtags', formData.hashtags.filter(t => t !== tag));
  };

  const handleHashtagInputKeyPress = (e) => {
    if (e.key === 'Enter' || e.key === ',') {
      e.preventDefault();
      addHashtag(hashtagInput);
    }
  };

  return (
    <div className="space-y-8">
      {/* Basic Information */}
      <div className="bg-gray-50 rounded-xl p-6">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">Basic Information</h3>
        
        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Affiliate Post Title *
            </label>
            <input
              type="text"
              value={formData.postTitle}
              onChange={(e) => updateFormData('postTitle', e.target.value)}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
              placeholder="Enter an attractive title for your affiliate post"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Short Description *
            </label>
            <textarea
              value={formData.shortDescription}
              onChange={(e) => updateFormData('shortDescription', e.target.value)}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
              rows={3}
              placeholder="Briefly describe what you're promoting and why it's valuable"
            />
          </div>

          <div className="grid md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Category *
              </label>
              <select
                value={formData.promoterCategory}
                onChange={(e) => updateFormData('promoterCategory', e.target.value)}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
              >
                <option value="">Select category</option>
                {categoriesProp && categoriesProp.length > 0 ? categoriesProp.map(category => (
                  <option key={category.id} value={category.id}>{category.name}</option>
                )) : availableCategories.map(category => (
                  <option key={category} value={category}>{category}</option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Country/Region
              </label>
              <select
                value={formData.promoterCountry}
                onChange={(e) => updateFormData('promoterCountry', e.target.value)}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
              >
                <option value="">Select country</option>
                {countries.map(country => (
                  <option key={country} value={country}>{country}</option>
                ))}
              </select>
            </div>
          </div>
        </div>
      </div>

      {/* Image Upload */}
      <div className="bg-gray-50 rounded-xl p-6">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">Promotional Image *</h3>
        
        <div className="space-y-4">
          {!uploadedImage ? (
            <div className="border-2 border-dashed border-gray-300 rounded-lg p-8 text-center hover:border-gray-400 transition-colors">
              <Upload className="h-12 w-12 text-gray-400 mx-auto mb-4" />
              <p className="text-gray-600 mb-2">Upload a promotional image</p>
              <p className="text-sm text-gray-500 mb-4">PNG, JPG up to 10MB</p>
              <input
                type="file"
                accept="image/*"
                onChange={handleImageUpload}
                className="hidden"
                id="promo-image-upload"
              />
              <label
                htmlFor="promo-image-upload"
                className="inline-flex items-center px-4 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {uploading ? (
                  <>
                    <Loader2 className="h-4 w-4 animate-spin mr-2" />
                    Uploading...
                  </>
                ) : (
                  'Choose Image'
                )}
              </label>
            </div>
          ) : (
            <div className="relative">
              <img
                src={uploadedImage.preview}
                alt={uploadedImage.name}
                className="w-full h-64 object-cover rounded-lg"
              />
              <button
                onClick={removeImage}
                className="absolute top-4 right-4 bg-red-500 text-white p-2 rounded-full hover:bg-red-600 transition-colors"
              >
                <X className="h-4 w-4" />
              </button>
              <p className="text-sm text-gray-600 mt-2">{uploadedImage.name}</p>
            </div>
          )}
        </div>
      </div>

      {/* Affiliate Link */}
      <div className="bg-gray-50 rounded-xl p-6">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">Affiliate Link *</h3>
        
        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Your Affiliate Link
            </label>
            <input
              type="url"
              value={formData.affiliateLink}
              onChange={(e) => updateFormData('affiliateLink', e.target.value)}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
              placeholder="https://your-affiliate-link.com"
            />
            <p className="text-xs text-gray-500 mt-1">Make sure this is your unique affiliate tracking link</p>
          </div>
        </div>
      </div>

      {/* Hashtags */}
      <div className="bg-gray-50 rounded-xl p-6">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">Hashtags</h3>
        
        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Add Hashtags
            </label>
            <div className="flex space-x-2">
              <input
                type="text"
                value={hashtagInput}
                onChange={(e) => setHashtagInput(e.target.value)}
                onKeyPress={handleHashtagInputKeyPress}
                className="flex-1 px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                placeholder="Add hashtags (press Enter or comma to add)"
              />
              <button
                onClick={() => addHashtag(hashtagInput)}
                className="px-4 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition-colors"
              >
                <Plus className="h-4 w-4" />
              </button>
            </div>
          </div>

          {formData.hashtags.length > 0 && (
            <div className="flex flex-wrap gap-2">
              {formData.hashtags.map((tag, index) => (
                <span
                  key={index}
                  className="inline-flex items-center px-3 py-1 bg-purple-100 text-purple-700 rounded-full text-sm"
                >
                  #{tag}
                  <button
                    onClick={() => removeHashtag(tag)}
                    className="ml-2 text-purple-500 hover:text-purple-700"
                  >
                    <X className="h-3 w-3" />
                  </button>
                </span>
              ))}
            </div>
          )}

          <div>
            <p className="text-sm font-medium text-gray-700 mb-2">Suggested Hashtags:</p>
            <div className="flex flex-wrap gap-2">
              {suggestedHashtags.map((tag, index) => (
                <button
                  key={index}
                  onClick={() => addHashtag(tag)}
                  className="px-3 py-1 bg-gray-100 text-gray-700 rounded-full text-sm hover:bg-gray-200 transition-colors"
                >
                  #{tag}
                </button>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Target Audience */}
      <div className="bg-gray-50 rounded-xl p-6">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">Target Audience</h3>
        
        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Who is this for?
            </label>
            <textarea
              value={formData.targetAudience}
              onChange={(e) => updateFormData('targetAudience', e.target.value)}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
              rows={3}
              placeholder="Describe your target audience (e.g., 'Young professionals interested in technology', 'Parents looking for educational products')"
            />
            <p className="text-xs text-gray-500 mt-1">This helps promoters understand who to target</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PromoterAffiliateForm;
