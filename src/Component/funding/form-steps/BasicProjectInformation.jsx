import React, { useState, useEffect } from 'react';
import fundingService from '../../../services/FundingService';
import { motion } from 'framer-motion';
import { 
  X, 
  Plus, 
  Image as ImageIcon,
  Globe,
  FileText,
  Camera
} from 'lucide-react';

const BasicProjectInformation = ({ formData, updateFormData, onNext, onPrev }) => {
  const [dragActive, setDragActive] = useState(false);
  const [additionalImages, setAdditionalImages] = useState(formData.additionalImages || []);
  const [categories, setCategories] = useState([]);
  const [countries, setCountries] = useState([]);
  const [loading, setLoading] = useState(true);

  // Load categories and countries from API
  useEffect(() => {
    const loadMetadata = async () => {
      try {
        const categoriesResponse = await fundingService.getCategories();
        const countriesResponse = await fundingService.getCountries();
        
        setCategories(categoriesResponse.data || []);
        setCountries(countriesResponse.data || []);
        setLoading(false);
      } catch (error) {
        console.error('Error loading metadata:', error);
        // Fallback to mock data
        setCategories([
          'Technology & Innovation',
          'Creative Arts',
          'Community & Social Impact',
          'Startups & Small Business',
          'Health & Wellness',
          'Education',
          'Real Estate & Construction',
          'Environment & Sustainability'
        ]);
        setCountries([
          'United States', 'United Kingdom', 'Canada', 'Australia', 'Germany',
          'France', 'Netherlands', 'Japan', 'South Korea', 'Singapore', 'Other'
        ]);
      } finally {
        setLoading(false);
      }
    };
    loadMetadata();
  }, []);

  const handleCoverImageUpload = (e) => {
    const file = e.target.files[0];
    if (file) {
      updateFormData({ coverImage: file });
    }
  };

  const handleAdditionalImageUpload = (e) => {
    const files = Array.from(e.target.files);
    const newImages = [...additionalImages, ...files].slice(0, 5);
    setAdditionalImages(newImages);
    updateFormData({ additionalImages: newImages });
  };

  const removeAdditionalImage = (index) => {
    const newImages = additionalImages.filter((_, i) => i !== index);
    setAdditionalImages(newImages);
    updateFormData({ additionalImages: newImages });
  };

  const handleDrag = (e) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === 'dragenter' || e.type === 'dragover') {
      setDragActive(true);
    } else if (e.type === 'dragleave') {
      setDragActive(false);
    }
  };

  const handleDrop = (e) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);
    
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      handleAdditionalImageUpload({ target: { files: e.dataTransfer.files } });
    }
  };

  const isFormValid = formData.title && formData.tagline && formData.category && formData.country && formData.coverImage;

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h3 className="text-2xl font-bold text-gray-900 mb-4">Basic Project Information</h3>
        <p className="text-gray-600">
          Provide essential details about your project. This information will help funders understand what you're creating.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Project Title */}
        <div className="md:col-span-2">
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Project Title <span className="text-red-500">*</span>
          </label>
          <input
            type="text"
            value={formData.title || ''}
            onChange={(e) => updateFormData({ title: e.target.value })}
            placeholder="Enter your project title"
            className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            maxLength={100}
          />
          <p className="text-sm text-gray-500 mt-1">
            {formData.title?.length || 0}/100 characters
          </p>
        </div>

        {/* Short Tagline */}
        <div className="md:col-span-2">
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Short Tagline <span className="text-red-500">*</span>
          </label>
          <input
            type="text"
            value={formData.tagline || ''}
            onChange={(e) => updateFormData({ tagline: e.target.value })}
            placeholder="A catchy one-liner that describes your project (max 80 characters)"
            className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            maxLength={80}
          />
          <p className="text-sm text-gray-500 mt-1">
            {formData.tagline?.length || 0}/80 characters
          </p>
        </div>

        {/* Category */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            <FileText className="w-4 h-4 inline mr-1" />
            Category <span className="text-red-500">*</span>
          </label>
          <select
            value={formData.category || ''}
            onChange={(e) => updateFormData({ category: e.target.value })}
            className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          >
            <option value="">Select a category</option>
            {categories.map(category => (
              <option key={category} value={category}>{category}</option>
            ))}
          </select>
        </div>

        {/* Country/Region */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            <Globe className="w-4 h-4 inline mr-1" />
            Country/Region <span className="text-red-500">*</span>
          </label>
          <select
            value={formData.country || ''}
            onChange={(e) => updateFormData({ country: e.target.value })}
            className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          >
            <option value="">Select a country</option>
            {countries.map(country => (
              <option key={country} value={country}>{country}</option>
            ))}
          </select>
        </div>
      </div>

      {/* Cover Image */}
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">
          Cover Image <span className="text-red-500">*</span>
        </label>
        <div className="border-2 border-dashed border-gray-300 rounded-xl p-6 text-center hover:border-gray-400 transition-colors">
          {formData.coverImage ? (
            <div className="space-y-4">
              <div className="relative inline-block">
                <img
                  src={URL.createObjectURL(formData.coverImage)}
                  alt="Cover image preview"
                  className="w-32 h-32 object-cover rounded-lg"
                />
                <button
                  onClick={() => updateFormData({ coverImage: null })}
                  className="absolute -top-2 -right-2 w-6 h-6 bg-red-500 text-white rounded-full flex items-center justify-center hover:bg-red-600 transition-colors"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>
              <p className="text-sm text-gray-600">Cover image uploaded</p>
              <button
                onClick={() => document.getElementById('cover-image-input').click()}
                className="text-blue-600 hover:text-blue-700 text-sm font-medium"
              >
                Change cover image
              </button>
            </div>
          ) : (
            <div className="space-y-4">
              <Camera className="w-12 h-12 text-gray-400 mx-auto" />
              <div>
                <p className="text-gray-600 mb-2">Upload a cover image</p>
                <p className="text-sm text-gray-500">Recommended: 1920x1080px, max 10MB</p>
              </div>
              <button
                onClick={() => document.getElementById('cover-image-input').click()}
                className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
              >
                Choose Image
              </button>
            </div>
          )}
          <input
            id="cover-image-input"
            type="file"
            accept="image/*"
            onChange={handleCoverImageUpload}
            className="hidden"
          />
        </div>
      </div>

      {/* Additional Images */}
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">
          Additional Images (Optional - up to 5)
        </label>
        <div
          className={`border-2 border-dashed rounded-xl p-6 text-center transition-colors ${
            dragActive ? 'border-blue-500 bg-blue-50' : 'border-gray-300 hover:border-gray-400'
          }`}
          onDragEnter={handleDrag}
          onDragLeave={handleDrag}
          onDragOver={handleDrag}
          onDrop={handleDrop}
        >
          {additionalImages.length > 0 ? (
            <div className="space-y-4">
              <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-4">
                {additionalImages.map((image, index) => (
                  <div key={index} className="relative">
                    <img
                      src={URL.createObjectURL(image)}
                      alt={`Additional image ${index + 1}`}
                      className="w-full h-24 object-cover rounded-lg"
                    />
                    <button
                      onClick={() => removeAdditionalImage(index)}
                      className="absolute -top-2 -right-2 w-6 h-6 bg-red-500 text-white rounded-full flex items-center justify-center hover:bg-red-600 transition-colors"
                    >
                      <X className="w-4 h-4" />
                    </button>
                  </div>
                ))}
                {additionalImages.length < 5 && (
                  <button
                    onClick={() => document.getElementById('additional-images-input').click()}
                    className="w-full h-24 border-2 border-dashed border-gray-300 rounded-lg flex items-center justify-center hover:border-gray-400 transition-colors"
                  >
                    <Plus className="w-6 h-6 text-gray-400" />
                  </button>
                )}
              </div>
              <p className="text-sm text-gray-600">
                {additionalImages.length} of 5 images uploaded
              </p>
            </div>
          ) : (
            <div className="space-y-4">
              <ImageIcon className="w-12 h-12 text-gray-400 mx-auto" />
              <div>
                <p className="text-gray-600 mb-2">Drag and drop images here or click to browse</p>
                <p className="text-sm text-gray-500">JPG, PNG, GIF up to 10MB each</p>
              </div>
              <button
                onClick={() => document.getElementById('additional-images-input').click()}
                className="px-4 py-2 bg-gray-600 text-white rounded-lg hover:bg-gray-700 transition-colors"
              >
                Choose Images
              </button>
            </div>
          )}
          <input
            id="additional-images-input"
            type="file"
            accept="image/*"
            multiple
            onChange={handleAdditionalImageUpload}
            className="hidden"
          />
        </div>
      </div>

      {/* Navigation */}
      <div className="flex items-center justify-between pt-6">
        <button
          onClick={onPrev}
          className="flex items-center gap-2 px-6 py-3 text-gray-700 hover:text-gray-900 transition-colors"
        >
          Previous
        </button>
        <button
          onClick={onNext}
          disabled={!isFormValid}
          className="flex items-center gap-2 bg-blue-600 text-white px-6 py-3 rounded-lg font-medium hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
        >
          Next
        </button>
      </div>
    </div>
  );
};

export default BasicProjectInformation;
