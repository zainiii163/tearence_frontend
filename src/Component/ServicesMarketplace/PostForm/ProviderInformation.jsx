import React, { useState } from 'react';
import { Upload, X, User, Mail, Phone, Globe, CheckCircle, Star } from 'lucide-react';

const ProviderInformation = ({ data, onChange, serviceType }) => {
  const [uploadProgress, setUploadProgress] = useState(0);
  const [isUploading, setIsUploading] = useState(false);

  const handleImageUpload = (e) => {
    const file = e.target.files[0];
    if (file) {
      setIsUploading(true);
      setUploadProgress(0);

      // Simulate upload progress
      const interval = setInterval(() => {
        setUploadProgress(prev => {
          if (prev >= 100) {
            clearInterval(interval);
            setIsUploading(false);
            // Create preview URL
            const reader = new FileReader();
            reader.onload = (event) => {
              onChange('profilePhoto', event.target.result);
            };
            reader.readAsDataURL(file);
            return 100;
          }
          return prev + 10;
        });
      }, 100);
    }
  };

  const removeProfilePhoto = () => {
    onChange('profilePhoto', '');
  };

  const countries = [
    { value: 'US', label: '🇺🇸 United States' },
    { value: 'UK', label: '🇬🇧 United Kingdom' },
    { value: 'CA', label: '🇨🇦 Canada' },
    { value: 'AU', label: '🇦🇺 Australia' },
    { value: 'DE', label: '🇩🇪 Germany' },
    { value: 'FR', label: '🇫🇷 France' },
    { value: 'IN', label: '🇮🇳 India' },
    { value: 'PK', label: '🇵🇰 Pakistan' },
    { value: 'AE', label: '🇦🇪 UAE' },
    { value: 'SA', label: '🇸🇦 Saudi Arabia' }
  ];

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-bold text-gray-900 mb-2">Provider Information</h2>
        <p className="text-gray-600">
          Tell us about yourself or your business. This information will be displayed on your service listing.
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Left Column - Profile Photo and Basic Info */}
        <div className="space-y-6">
          {/* Profile Photo Upload */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Profile Photo / Logo
            </label>
            <div className="flex items-center space-x-6">
              <div className="relative">
                {data.profilePhoto ? (
                  <div className="relative w-24 h-24">
                    <img
                      src={data.profilePhoto}
                      alt="Profile"
                      className="w-full h-full object-cover rounded-full"
                    />
                    <button
                      onClick={removeProfilePhoto}
                      className="absolute -top-2 -right-2 p-1 bg-red-500 text-white rounded-full hover:bg-red-600"
                    >
                      <X className="w-3 h-3" />
                    </button>
                  </div>
                ) : (
                  <div className="w-24 h-24 bg-gray-100 rounded-full flex items-center justify-center border-2 border-dashed border-gray-300">
                    <User className="w-8 h-8 text-gray-400" />
                  </div>
                )}
              </div>

              <div>
                <label className="cursor-pointer">
                  <span className="px-4 py-2 bg-blue-600 text-white text-sm font-medium rounded-lg hover:bg-blue-700 transition-colors inline-flex items-center space-x-2">
                    <Upload className="w-4 h-4" />
                    <span>Upload Photo</span>
                  </span>
                  <input
                    type="file"
                    accept="image/*"
                    onChange={handleImageUpload}
                    className="hidden"
                  />
                </label>
                <p className="text-xs text-gray-500 mt-1">
                  JPG, PNG up to 5MB
                </p>
              </div>
            </div>

            {isUploading && (
              <div className="mt-2">
                <div className="w-full bg-gray-200 rounded-full h-2">
                  <div
                    className="bg-blue-600 h-2 rounded-full transition-all duration-300"
                    style={{ width: `${uploadProgress}%` }}
                  ></div>
                </div>
                <p className="text-xs text-gray-500 mt-1">Uploading... {uploadProgress}%</p>
              </div>
            )}
          </div>

          {/* Name / Business Name */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              {serviceType === 'business' ? 'Business Name' : 'Full Name'}
            </label>
            <input
              type="text"
              value={data.name || ''}
              onChange={(e) => onChange('name', e.target.value)}
              placeholder={serviceType === 'business' ? 'Enter your business name' : 'Enter your full name'}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              required
            />
          </div>

          {/* Email */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Email Address
            </label>
            <div className="relative">
              <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
              <input
                type="email"
                value={data.email || ''}
                onChange={(e) => onChange('email', e.target.value)}
                placeholder="your@email.com"
                className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                required
              />
            </div>
          </div>

          {/* Phone */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Phone Number
            </label>
            <div className="relative">
              <Phone className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
              <input
                type="tel"
                value={data.phone || ''}
                onChange={(e) => onChange('phone', e.target.value)}
                placeholder="+1 (555) 123-4567"
                className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
            </div>
          </div>
        </div>

        {/* Right Column - Location and Links */}
        <div className="space-y-6">
          {/* Country */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Country
            </label>
            <div className="relative">
              <select
                value={data.country || ''}
                onChange={(e) => onChange('country', e.target.value)}
                className="w-full px-4 py-2 pr-10 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent appearance-none bg-white"
                required
              >
                <option value="">Select your country</option>
                {countries.map((country) => (
                  <option key={country.value} value={country.value}>
                    {country.label}
                  </option>
                ))}
              </select>
            </div>
          </div>

          {/* City */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              City
            </label>
            <input
              type="text"
              value={data.city || ''}
              onChange={(e) => onChange('city', e.target.value)}
              placeholder="Enter your city"
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
          </div>

          {/* Website */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Website
            </label>
            <div className="relative">
              <Globe className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
              <input
                type="url"
                value={data.website || ''}
                onChange={(e) => onChange('website', e.target.value)}
                placeholder="https://yourwebsite.com"
                className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
            </div>
          </div>

          {/* Social Links */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Social Media Links
            </label>
            <div className="space-y-3">
              <input
                type="url"
                value={data.linkedin || ''}
                onChange={(e) => onChange('linkedin', e.target.value)}
                placeholder="LinkedIn profile URL"
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
              <input
                type="url"
                value={data.twitter || ''}
                onChange={(e) => onChange('twitter', e.target.value)}
                placeholder="Twitter profile URL"
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
              <input
                type="url"
                value={data.instagram || ''}
                onChange={(e) => onChange('instagram', e.target.value)}
                placeholder="Instagram profile URL"
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
            </div>
          </div>
        </div>
      </div>

      {/* Verification Badge Upsell */}
      <div className="border border-gray-200 rounded-xl p-6 bg-gradient-to-r from-blue-50 to-indigo-50">
        <div className="flex items-start space-x-4">
          <div className="flex-shrink-0">
            <CheckCircle className="w-8 h-8 text-blue-600" />
          </div>
          <div className="flex-1">
            <h3 className="text-lg font-semibold text-gray-900 mb-2">
              Get Verified Badge
            </h3>
            <p className="text-gray-600 mb-4">
              Increase trust and attract more clients with a verified provider badge. 
              Verified providers receive 3x more inquiries on average.
            </p>
            <div className="flex items-center space-x-4">
              <div className="flex items-center space-x-2">
                <Star className="w-5 h-5 text-yellow-500" />
                <span className="text-sm font-medium text-gray-900">3x more inquiries</span>
              </div>
              <div className="flex items-center space-x-2">
                <CheckCircle className="w-5 h-5 text-green-500" />
                <span className="text-sm font-medium text-gray-900">Build trust</span>
              </div>
              <div className="flex items-center space-x-2">
                <span className="text-sm font-medium text-gray-900">$9.99/month</span>
              </div>
            </div>
            <button
              type="button"
              onClick={() => onChange('verifiedBadge', !data.verifiedBadge)}
              className={`mt-4 px-4 py-2 rounded-lg font-medium transition-colors ${
                data.verifiedBadge
                  ? 'bg-blue-600 text-white'
                  : 'bg-white border border-blue-600 text-blue-600 hover:bg-blue-50'
              }`}
            >
              {data.verifiedBadge ? 'Remove Verification' : 'Add Verification Badge'}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProviderInformation;
