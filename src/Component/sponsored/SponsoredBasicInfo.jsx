import React, { useState, useRef } from 'react';
import { Upload, X, Camera, Sparkles, MapPin, DollarSign, Tag } from 'lucide-react';

const SponsoredBasicInfo = ({ basicInfo, setBasicInfo, advertType }) => {
  const [dragActive, setDragActive] = useState(false);
  const [aiSuggestions, setAiSuggestions] = useState([]);
  const fileInputRef = useRef(null);

  const categories = {
    product: ['Electronics', 'Fashion', 'Home & Garden', 'Sports', 'Books', 'Toys', 'Health', 'Other'],
    service: ['Business', 'Education', 'Healthcare', 'Technology', 'Creative', 'Consulting', 'Repair', 'Other'],
    property: ['House', 'Apartment', 'Land', 'Commercial', 'Vacation Rental', 'Storage', 'Parking', 'Other'],
    job: ['Full-time', 'Part-time', 'Contract', 'Freelance', 'Internship', 'Remote', 'Executive', 'Other'],
    event: ['Concert', 'Workshop', 'Conference', 'Sports', 'Festival', 'Exhibition', 'Meetup', 'Other'],
    vehicle: ['Car', 'Motorcycle', 'Truck', 'Boat', 'RV', 'Parts', 'Accessories', 'Other'],
    business: ['Franchise', 'Partnership', 'Investment', 'Startup', 'Acquisition', 'License', 'Other'],
    other: ['General', 'Community', 'Announcement', 'Lost & Found', 'Free Items', 'Other']
  };

  const handleDrag = (e) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === "dragenter" || e.type === "dragover") {
      setDragActive(true);
    } else if (e.type === "dragleave") {
      setDragActive(false);
    }
  };

  const handleDrop = (e) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);
    
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      handleFiles(e.dataTransfer.files);
    }
  };

  const handleFileInput = (e) => {
    if (e.target.files && e.target.files[0]) {
      handleFiles(e.target.files);
    }
  };

  const handleFiles = (files) => {
    const newImages = [...(basicInfo.images || [])];
    Array.from(files).forEach(file => {
      if (file.type.startsWith('image/')) {
        const reader = new FileReader();
        reader.onload = (e) => {
          if (newImages.length < 10) {
            newImages.push({
              url: e.target.result,
              name: file.name,
              size: file.size
            });
            setBasicInfo({ ...basicInfo, images: newImages });
          }
        };
        reader.readAsDataURL(file);
      }
    });
  };

  const removeImage = (index) => {
    const newImages = basicInfo.images.filter((_, i) => i !== index);
    setBasicInfo({ ...basicInfo, images: newImages });
  };

  const generateAITitle = () => {
    const suggestions = [
      `Premium ${basicInfo.category || 'Item'} - ${basicInfo.condition || 'Excellent'} Condition`,
      `Exclusive ${basicInfo.category || 'Offer'} - Limited Time Opportunity`,
      `Professional ${basicInfo.category || 'Service'} - Quality Guaranteed`,
      `Top-Rated ${basicInfo.category || 'Product'} - Best Value Deal`
    ];
    setAiSuggestions(suggestions);
  };

  const countries = ['United States', 'United Kingdom', 'Canada', 'Australia', 'Germany', 'France', 'Other'];

  return (
    <div className="space-y-8">
      <div className="text-center">
        <h2 className="text-3xl font-bold text-gray-900 mb-2">Basic Advert Information</h2>
        <p className="text-gray-600">Provide the essential details for your sponsored advertisement</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Left Column - Basic Info */}
        <div className="space-y-6">
          {/* Advert Title */}
          <div>
            <label className="block text-sm font-semibold text-gray-900 mb-2">
              Advert Title <span className="text-red-500">*</span>
            </label>
            <input
              type="text"
              value={basicInfo.title || ''}
              onChange={(e) => setBasicInfo({ ...basicInfo, title: e.target.value })}
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              placeholder="Enter a compelling title for your advert"
              maxLength={100}
            />
            <div className="flex justify-between mt-1">
              <span className="text-xs text-gray-500">Make it attention-grabbing and descriptive</span>
              <span className="text-xs text-gray-500">{basicInfo.title?.length || 0}/100</span>
            </div>
          </div>

          {/* Short Tagline */}
          <div>
            <label className="block text-sm font-semibold text-gray-900 mb-2">
              Short Tagline <span className="text-red-500">*</span>
            </label>
            <div className="relative">
              <input
                type="text"
                value={basicInfo.tagline || ''}
                onChange={(e) => setBasicInfo({ ...basicInfo, tagline: e.target.value })}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent pr-20"
                placeholder="Quick catchy phrase (max 80 chars)"
                maxLength={80}
              />
              <button
                type="button"
                onClick={generateAITitle}
                className="absolute right-2 top-1/2 transform -translate-y-1/2 px-3 py-1 bg-gradient-to-r from-purple-500 to-blue-500 text-white text-xs rounded-md hover:from-purple-600 hover:to-blue-600 transition-colors flex items-center gap-1"
              >
                <Sparkles className="w-3 h-3" />
                AI Suggest
              </button>
            </div>
            <div className="flex justify-between mt-1">
              <span className="text-xs text-gray-500">Brief description that appears in search results</span>
              <span className="text-xs text-gray-500">{basicInfo.tagline?.length || 0}/80</span>
            </div>
            
            {aiSuggestions.length > 0 && (
              <div className="mt-2 p-3 bg-purple-50 rounded-lg border border-purple-200">
                <p className="text-xs font-semibold text-purple-700 mb-2">AI Suggestions:</p>
                <div className="space-y-1">
                  {aiSuggestions.map((suggestion, index) => (
                    <button
                      key={index}
                      onClick={() => {
                        setBasicInfo({ ...basicInfo, tagline: suggestion });
                        setAiSuggestions([]);
                      }}
                      className="block w-full text-left text-xs text-purple-600 hover:text-purple-800 hover:bg-purple-100 px-2 py-1 rounded"
                    >
                      {suggestion}
                    </button>
                  ))}
                </div>
              </div>
            )}
          </div>

          {/* Category */}
          <div>
            <label className="block text-sm font-semibold text-gray-900 mb-2">
              Category <span className="text-red-500">*</span>
            </label>
            <select
              value={basicInfo.category || ''}
              onChange={(e) => setBasicInfo({ ...basicInfo, category: e.target.value })}
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            >
              <option value="">Select a category</option>
              {categories[advertType]?.map(cat => (
                <option key={cat} value={cat}>{cat}</option>
              ))}
            </select>
          </div>

          {/* Location */}
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-semibold text-gray-900 mb-2">
                <MapPin className="w-4 h-4 inline mr-1" />
                Country <span className="text-red-500">*</span>
              </label>
              <select
                value={basicInfo.country || ''}
                onChange={(e) => setBasicInfo({ ...basicInfo, country: e.target.value })}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              >
                <option value="">Select country</option>
                {countries.map(country => (
                  <option key={country} value={country}>{country}</option>
                ))}
              </select>
            </div>
            <div>
              <label className="block text-sm font-semibold text-gray-900 mb-2">
                City / Region <span className="text-red-500">*</span>
              </label>
              <input
                type="text"
                value={basicInfo.city || ''}
                onChange={(e) => setBasicInfo({ ...basicInfo, city: e.target.value })}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                placeholder="Enter city or region"
              />
            </div>
          </div>

          {/* Price and Condition */}
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-semibold text-gray-900 mb-2">
                <DollarSign className="w-4 h-4 inline mr-1" />
                Price (optional)
              </label>
              <input
                type="number"
                value={basicInfo.price || ''}
                onChange={(e) => setBasicInfo({ ...basicInfo, price: e.target.value })}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                placeholder="0.00"
                min="0"
                step="0.01"
              />
            </div>
            <div>
              <label className="block text-sm font-semibold text-gray-900 mb-2">
                <Tag className="w-4 h-4 inline mr-1" />
                Condition <span className="text-red-500">*</span>
              </label>
              <select
                value={basicInfo.condition || ''}
                onChange={(e) => setBasicInfo({ ...basicInfo, condition: e.target.value })}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              >
                <option value="">Select condition</option>
                <option value="new">New</option>
                <option value="used">Used</option>
                <option value="not-applicable">Not Applicable</option>
              </select>
            </div>
          </div>
        </div>

        {/* Right Column - Media Upload */}
        <div className="space-y-6">
          {/* Main Image Upload */}
          <div>
            <label className="block text-sm font-semibold text-gray-900 mb-2">
              Main Image <span className="text-red-500">*</span>
            </label>
            <div
              className={`relative border-2 border-dashed rounded-xl p-8 text-center transition-colors ${
                dragActive ? 'border-blue-500 bg-blue-50' : 'border-gray-300 hover:border-gray-400'
              }`}
              onDragEnter={handleDrag}
              onDragLeave={handleDrag}
              onDragOver={handleDrag}
              onDrop={handleDrop}
            >
              <input
                ref={fileInputRef}
                type="file"
                accept="image/*"
                onChange={handleFileInput}
                className="hidden"
                multiple
              />
              
              <div className="space-y-4">
                <div className="mx-auto w-16 h-16 bg-gradient-to-br from-blue-500 to-purple-500 rounded-full flex items-center justify-center">
                  <Upload className="w-8 h-8 text-white" />
                </div>
                
                <div>
                  <p className="text-lg font-medium text-gray-900">Drop images here or click to upload</p>
                  <p className="text-sm text-gray-500 mt-1">
                    Main image + up to 10 additional images
                  </p>
                  <p className="text-xs text-gray-400 mt-1">
                    JPG, PNG, GIF up to 10MB each
                  </p>
                </div>
                
                <button
                  type="button"
                  onClick={() => fileInputRef.current?.click()}
                  className="px-6 py-2 bg-gradient-to-r from-blue-500 to-purple-500 text-white rounded-lg hover:from-blue-600 hover:to-purple-600 transition-colors"
                >
                  <Camera className="w-4 h-4 inline mr-2" />
                  Choose Images
                </button>
              </div>
            </div>
          </div>

          {/* Video Link */}
          <div>
            <label className="block text-sm font-semibold text-gray-900 mb-2">
              Video Link (optional)
            </label>
            <input
              type="url"
              value={basicInfo.videoLink || ''}
              onChange={(e) => setBasicInfo({ ...basicInfo, videoLink: e.target.value })}
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              placeholder="https://youtube.com/watch?v=..."
            />
            <p className="text-xs text-gray-500 mt-1">YouTube, Vimeo, or other video platform links</p>
          </div>

          {/* Image Preview */}
          {basicInfo.images && basicInfo.images.length > 0 && (
            <div>
              <label className="block text-sm font-semibold text-gray-900 mb-2">
                Uploaded Images ({basicInfo.images.length}/10)
              </label>
              <div className="grid grid-cols-3 gap-3">
                {basicInfo.images.map((image, index) => (
                  <div key={index} className="relative group">
                    <img
                      src={image.url}
                      alt={`Upload ${index + 1}`}
                      className="w-full h-24 object-cover rounded-lg border border-gray-200"
                    />
                    <button
                      type="button"
                      onClick={() => removeImage(index)}
                      className="absolute -top-2 -right-2 w-6 h-6 bg-red-500 text-white rounded-full opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center"
                    >
                      <X className="w-3 h-3" />
                    </button>
                    {index === 0 && (
                      <div className="absolute bottom-0 left-0 right-0 bg-blue-500 text-white text-xs py-1 rounded-b-lg text-center">
                        Main
                      </div>
                    )}
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Enhancement Tools */}
          <div className="bg-gradient-to-r from-blue-50 to-purple-50 rounded-lg p-4 border border-blue-200">
            <h4 className="font-semibold text-gray-900 mb-3 flex items-center">
              <Sparkles className="w-4 h-4 mr-2 text-blue-500" />
              Image Enhancement Tools
            </h4>
            <div className="space-y-2">
              <button className="w-full text-left px-3 py-2 bg-white rounded-lg hover:bg-gray-50 transition-colors text-sm">
                🎨 Auto-crop & Resize
              </button>
              <button className="w-full text-left px-3 py-2 bg-white rounded-lg hover:bg-gray-50 transition-colors text-sm">
                ✨ Enhance Image Quality
              </button>
              <button className="w-full text-left px-3 py-2 bg-white rounded-lg hover:bg-gray-50 transition-colors text-sm">
                🤝 AI Background Removal
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SponsoredBasicInfo;
