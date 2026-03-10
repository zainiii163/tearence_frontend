import React, { useState } from 'react';
import { Briefcase, Clock, DollarSign, Calendar, Globe } from 'lucide-react';

const ServiceDetails = ({ data, onChange, serviceType }) => {
  const categories = [
    { id: '1', name: 'Graphic Design', subcategories: ['Logo Design', 'Brand Identity', 'Web Design', 'Print Design'] },
    { id: '2', name: 'Web Development', subcategories: ['Frontend Development', 'Backend Development', 'Full Stack', 'Mobile Apps'] },
    { id: '3', name: 'Writing & Translation', subcategories: ['Content Writing', 'Copywriting', 'Technical Writing', 'Translation'] },
    { id: '4', name: 'Marketing & SEO', subcategories: ['Digital Marketing', 'SEO', 'Social Media Marketing', 'Email Marketing'] },
    { id: '5', name: 'Business Support', subcategories: ['Business Consulting', 'Project Management', 'Data Analysis', 'Market Research'] },
    { id: '6', name: 'Virtual Assistants', subcategories: ['Administrative Support', 'Customer Service', 'Data Entry', 'Research'] },
    { id: '7', name: 'Photography & Video', subcategories: ['Photography', 'Video Editing', 'Motion Graphics', 'Animation'] },
    { id: '8', name: 'Music & Audio', subcategories: ['Music Production', 'Voice Over', 'Audio Editing', 'Sound Design'] },
    { id: '9', name: 'Lifestyle Services', subcategories: ['Life Coaching', 'Personal Styling', 'Event Planning', 'Travel Planning'] },
    { id: '10', name: 'Fitness & Coaching', subcategories: ['Personal Training', 'Fitness Coaching', 'Nutrition Planning', 'Wellness'] },
    { id: '11', name: 'Trades & Repairs', subcategories: ['Home Repair', 'Plumbing', 'Electrical', 'Carpentry'] },
    { id: '12', name: 'Cleaning & Domestic', subcategories: ['House Cleaning', 'Office Cleaning', 'Deep Cleaning', 'Organizing'] },
    { id: '13', name: 'Event Services', subcategories: ['Event Planning', 'Catering', 'Photography', 'Decoration'] },
    { id: '14', name: 'Transport & Delivery', subcategories: ['Delivery Services', 'Moving Services', 'Transportation', 'Logistics'] }
  ];

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

  const availabilityOptions = [
    { value: 'full-time', label: 'Full Time (40+ hours/week)' },
    { value: 'part-time', label: 'Part Time (20-39 hours/week)' },
    { value: 'flexible', label: 'Flexible Schedule' },
    { value: 'weekends', label: 'Weekends Only' },
    { value: 'evenings', label: 'Evenings Only' },
    { value: 'as-needed', label: 'As Needed' }
  ];

  const deliveryTimes = [
    { value: '1', label: '1 day' },
    { value: '3', label: '3 days' },
    { value: '7', label: '1 week' },
    { value: '14', label: '2 weeks' },
    { value: '30', label: '1 month' },
    { value: 'custom', label: 'Custom timeframe' }
  ];

  const selectedCategory = categories.find(cat => cat.id === data.category);
  const availableSubcategories = selectedCategory?.subcategories || [];

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-bold text-gray-900 mb-2">Service Details</h2>
        <p className="text-gray-600">
          Provide detailed information about your service to attract the right clients.
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Left Column */}
        <div className="space-y-6">
          {/* Service Title */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Service Title
            </label>
            <input
              type="text"
              value={data.title || ''}
              onChange={(e) => onChange('title', e.target.value)}
              placeholder="e.g., Professional Logo Design for Businesses"
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              maxLength={100}
              required
            />
            <p className="text-xs text-gray-500 mt-1">
              {data.title?.length || 0}/100 characters
            </p>
          </div>

          {/* Short Tagline */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Short Tagline
            </label>
            <input
              type="text"
              value={data.tagline || ''}
              onChange={(e) => onChange('tagline', e.target.value)}
              placeholder="e.g., Creative logos that make your brand stand out"
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              maxLength={80}
              required
            />
            <p className="text-xs text-gray-500 mt-1">
              {data.tagline?.length || 0}/80 characters
            </p>
          </div>

          {/* Category */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Category
            </label>
            <div className="relative">
              <select
                value={data.category || ''}
                onChange={(e) => {
                  onChange('category', e.target.value);
                  onChange('subcategory', ''); // Reset subcategory when category changes
                }}
                className="w-full px-4 py-2 pr-10 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent appearance-none bg-white"
                required
              >
                <option value="">Select a category</option>
                {categories.map((category) => (
                  <option key={category.id} value={category.id}>
                    {category.name}
                  </option>
                ))}
              </select>
            </div>
          </div>

          {/* Subcategory */}
          {availableSubcategories.length > 0 && (
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Subcategory
              </label>
              <div className="relative">
                <select
                  value={data.subcategory || ''}
                  onChange={(e) => onChange('subcategory', e.target.value)}
                  className="w-full px-4 py-2 pr-10 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent appearance-none bg-white"
                >
                  <option value="">Select a subcategory</option>
                  {availableSubcategories.map((subcategory) => (
                    <option key={subcategory} value={subcategory}>
                      {subcategory}
                    </option>
                  ))}
                </select>
              </div>
            </div>
          )}

          {/* Country */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Service Country
            </label>
            <div className="relative">
              <Globe className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
              <select
                value={data.serviceCountry || ''}
                onChange={(e) => onChange('serviceCountry', e.target.value)}
                className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent appearance-none bg-white"
                required
              >
                <option value="">Select country</option>
                {countries.map((country) => (
                  <option key={country.value} value={country.value}>
                    {country.label}
                  </option>
                ))}
              </select>
            </div>
          </div>
        </div>

        {/* Right Column */}
        <div className="space-y-6">
          {/* Starting Price */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Starting Price
            </label>
            <div className="relative">
              <DollarSign className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
              <input
                type="number"
                value={data.startingPrice || ''}
                onChange={(e) => onChange('startingPrice', e.target.value)}
                placeholder="99.00"
                min="1"
                step="0.01"
                className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                required
              />
            </div>
            <p className="text-xs text-gray-500 mt-1">
              Set your minimum service price
            </p>
          </div>

          {/* Delivery Time */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Standard Delivery Time
            </label>
            <div className="relative">
              <Clock className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
              <select
                value={data.deliveryTime || ''}
                onChange={(e) => onChange('deliveryTime', e.target.value)}
                className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent appearance-none bg-white"
                required
              >
                <option value="">Select delivery time</option>
                {deliveryTimes.map((time) => (
                  <option key={time.value} value={time.value}>
                    {time.label}
                  </option>
                ))}
              </select>
            </div>
          </div>

          {/* Custom Delivery Time (if selected) */}
          {data.deliveryTime === 'custom' && (
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Custom Delivery Time
              </label>
              <input
                type="text"
                value={data.customDeliveryTime || ''}
                onChange={(e) => onChange('customDeliveryTime', e.target.value)}
                placeholder="e.g., 5-7 business days"
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                required
              />
            </div>
          )}

          {/* Availability */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Availability
            </label>
            <div className="relative">
              <Calendar className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
              <select
                value={data.availability || ''}
                onChange={(e) => onChange('availability', e.target.value)}
                className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent appearance-none bg-white"
                required
              >
                <option value="">Select availability</option>
                {availabilityOptions.map((option) => (
                  <option key={option.value} value={option.value}>
                    {option.label}
                  </option>
                ))}
              </select>
            </div>
          </div>

          {/* Skills/Tags */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Skills & Tags
            </label>
            <input
              type="text"
              value={data.skills || ''}
              onChange={(e) => onChange('skills', e.target.value)}
              placeholder="e.g., Photoshop, Illustrator, Brand Design, Creative"
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
            <p className="text-xs text-gray-500 mt-1">
              Separate multiple skills with commas
            </p>
          </div>
        </div>
      </div>

      {/* Service Type Specific Fields */}
      {serviceType === 'local' && (
        <div className="border border-gray-200 rounded-xl p-6 bg-green-50">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">
            Local Service Specific Information
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Service Area
              </label>
              <input
                type="text"
                value={data.serviceArea || ''}
                onChange={(e) => onChange('serviceArea', e.target.value)}
                placeholder="e.g., Downtown Manhattan, 10-mile radius"
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Travel Radius (miles)
              </label>
              <input
                type="number"
                value={data.travelRadius || ''}
                onChange={(e) => onChange('travelRadius', e.target.value)}
                placeholder="25"
                min="1"
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
            </div>
          </div>
        </div>
      )}

      {serviceType === 'business' && (
        <div className="border border-gray-200 rounded-xl p-6 bg-purple-50">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">
            Business Service Specific Information
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Target Company Size
              </label>
              <select
                value={data.targetCompanySize || ''}
                onChange={(e) => onChange('targetCompanySize', e.target.value)}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent appearance-none bg-white"
              >
                <option value="">Select company size</option>
                <option value="startup">Startup (1-10 employees)</option>
                <option value="small">Small (11-50 employees)</option>
                <option value="medium">Medium (51-200 employees)</option>
                <option value="large">Large (201+ employees)</option>
                <option value="enterprise">Enterprise (1000+ employees)</option>
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Industry Focus
              </label>
              <input
                type="text"
                value={data.industryFocus || ''}
                onChange={(e) => onChange('industryFocus', e.target.value)}
                placeholder="e.g., Technology, Healthcare, Finance"
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default ServiceDetails;
