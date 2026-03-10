import React, { useState } from 'react';
import { AlertCircle, Eye, Save, ChevronLeft, ChevronRight, CheckCircle, X, Briefcase, User, Clock } from 'lucide-react';
import { servicesApi } from '../../../services/servicesApi';

// Import all form sections
import ServiceTypeSelector from './ServiceTypeSelector';
import ProviderInformation from './ProviderInformation';
import ServiceDetails from './ServiceDetails';

const ServicePostForm = ({ onClose, onSubmit }) => {
  const [currentStep, setCurrentStep] = useState(1);
  const [formData, setFormData] = useState({
    // Service Type
    serviceType: '',
    
    // Provider Information
    profilePhoto: '',
    name: '',
    email: '',
    phone: '',
    country: '',
    city: '',
    website: '',
    linkedin: '',
    twitter: '',
    instagram: '',
    verifiedBadge: false,
    
    // Service Details
    title: '',
    tagline: '',
    category: '',
    subcategory: '',
    startingPrice: '',
    deliveryTime: '',
    availability: '',
    skills: [],
    
    // Service Media
    thumbnailImage: '',
    portfolioImages: [],
    videoLink: '',
    
    // Service Description (will be added in next steps)
    fullDescription: '',
    whatsIncluded: '',
    whatsNotIncluded: '',
    
    // Service Packages (will be added in next steps)
    packages: {
      basic: { enabled: true, price: '', deliveryTime: '', revisions: 1, features: [] },
      standard: { enabled: true, price: '', deliveryTime: '', revisions: 2, features: [] },
      premium: { enabled: true, price: '', deliveryTime: '', revisions: 3, features: [] }
    },
    
    // Add-ons (will be added in next steps)
    addons: [],
    
    // Location (for local services)
    location: {
      address: '',
      radius: '',
      coordinates: { lat: '', lng: '' }
    },
    
    // Promotion
    promotionTier: 'free',
    
    // Agreement
    termsAccepted: false,
    accurateInfo: false
  });

  const [errors, setErrors] = useState({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [showPreview, setShowPreview] = useState(false);

  const totalSteps = 10;
  const progressPercentage = (currentStep / totalSteps) * 100;

  const handleFieldChange = (field, value) => {
    setFormData(prev => ({ ...prev, [field]: value }));
    // Clear error for this field when user starts typing
    if (errors[field]) {
      setErrors(prev => ({ ...prev, [field]: '' }));
    }
  };

  // Save Draft functionality
  const handleSaveDraft = async () => {
    try {
      const draftData = {
        ...formData,
        isDraft: true,
        savedAt: new Date().toISOString()
      };
      
      // Save draft to backend
      const response = await servicesApi.saveDraft(draftData);
      
      // Show success message
      alert('Draft saved successfully! You can continue editing later.');
      
    } catch (error) {
      console.error('Save draft error:', error);
      alert('Failed to save draft. Please try again.');
    }
  };

  // Preview functionality
  const handlePreview = () => {
    setShowPreview(true);
  };

  // Terms and Conditions functionality
  const handleTermsAndConditions = () => {
    // Open terms and conditions in a new tab or modal
    const termsUrl = '/help/terms-and-condition';
    window.open(termsUrl, '_blank', 'width=800,height=600,scrollbars=yes');
  };

  // Contact Seller functionality (for existing services)
  const handleContactSeller = () => {
    // This would typically open a contact form or chat
    alert('Contact seller feature will be available once your service is published.');
  };

  // Helper function to get country flag
  const getCountryFlag = (country) => {
    // Simple flag mapping - you'd want to use a proper flag library
    const flagMap = {
      'US': '🇺🇸',
      'GB': '🇬🇧',
      'CA': '🇨🇦',
      'AU': '🇦🇺',
      'DE': '🇩🇪',
      'FR': '🇫🇷',
      'IT': '🇮🇹',
      'ES': '🇪🇸',
      'JP': '🇯🇵',
      'IN': '🇮🇳',
      'BR': '🇧🇷',
      'MX': '🇲🇽',
      'CN': '🇨🇳',
      'RU': '🇷🇺',
      'ZA': '🇿🇦',
      'NL': '🇳🇱',
      'SE': '🇸🇪',
      'NO': '🇳🇴',
      'DK': '🇩🇰',
      'FI': '🇫🇮',
      'CH': '🇨🇭',
      'AT': '🇦🇹',
      'BE': '🇧🇪',
      'IE': '🇮🇪',
      'NZ': '🇳🇿',
      'SG': '🇸🇬',
      'MY': '🇲🇾',
      'TH': '🇹🇭',
      'PH': '🇵🇭',
      'ID': '🇮🇩',
      'VN': '🇻🇳',
      'KR': '🇰🇷',
      'HK': '🇭🇰',
      'TW': '🇹🇼',
      'AE': '🇦🇪',
      'SA': '🇸🇦',
      'EG': '🇪🇬',
      'IL': '🇮🇱',
      'TR': '🇹🇷',
      'PL': '🇵🇱',
      'CZ': '🇨🇿',
      'GR': '🇬🇷',
      'PT': '🇵🇹',
      'AR': '🇦🇷',
      'CL': '🇨🇱',
      'CO': '🇨🇴',
      'PE': '🇵🇪',
      'UY': '🇺🇾',
      'NG': '🇳🇬',
      'KE': '🇰🇪',
      'GH': '🇬🇭',
      'ZA': '🇿🇦'
    };
    return flagMap[country] || '🌍';
  };

  const validateCurrentStep = () => {
    const newErrors = {};

    switch (currentStep) {
      case 1:
        if (!formData.serviceType) {
          newErrors.serviceType = 'Please select a service type';
        }
        break;
        
      case 2:
        if (!formData.name) newErrors.name = 'Name is required';
        if (!formData.email) newErrors.email = 'Email is required';
        if (!formData.country) newErrors.country = 'Country is required';
        break;
        
      case 3:
        if (!formData.title) newErrors.title = 'Service title is required';
        if (!formData.tagline) newErrors.tagline = 'Tagline is required';
        if (!formData.category) newErrors.category = 'Category is required';
        if (!formData.startingPrice) newErrors.startingPrice = 'Starting price is required';
        if (!formData.deliveryTime) newErrors.deliveryTime = 'Delivery time is required';
        if (!formData.availability) newErrors.availability = 'Availability is required';
        break;
        
      // Add validation for other steps as we implement them
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleNext = () => {
    if (validateCurrentStep()) {
      if (currentStep < totalSteps) {
        setCurrentStep(currentStep + 1);
      }
    }
  };

  const handlePrevious = () => {
    if (currentStep > 1) {
      setCurrentStep(currentStep - 1);
    }
  };

  const handleSubmit = async () => {
    if (!validateCurrentStep()) return;
    
    if (!formData.termsAccepted) {
      setErrors({ terms: 'You must accept the terms and conditions' });
      return;
    }
    
    if (!formData.accurateInfo) {
      setErrors({ terms: 'You must confirm that the information is accurate' });
      return;
    }

    setIsSubmitting(true);
    
    try {
      // Save service to backend
      const response = await servicesApi.createService(formData);
      
      // Show success message
      alert('Service submitted successfully! Your service is now pending review.');
      
      // Close form and notify parent
      if (onClose) onClose();
      if (onSubmit) onSubmit(response);
      
    } catch (error) {
      console.error('Submit error:', error);
      setErrors({ submit: error.message || 'Failed to submit. Please try again.' });
    } finally {
      setIsSubmitting(false);
    }
  };

  const renderStepContent = () => {
    switch (currentStep) {
      case 1:
        return (
          <ServiceTypeSelector
            selectedType={formData.serviceType}
            onTypeSelect={(type) => handleFieldChange('serviceType', type)}
          />
        );
        
      case 2:
        return (
          <ProviderInformation
            data={formData}
            onChange={handleFieldChange}
            serviceType={formData.serviceType}
          />
        );
        
      case 3:
        return (
          <ServiceDetails
            data={formData}
            onChange={handleFieldChange}
            serviceType={formData.serviceType}
          />
        );
        
      case 4:
        return (
          <div className="space-y-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Service Media</h3>
            
            {/* Service Thumbnail */}
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Service Thumbnail Image <span className="text-red-500">*</span>
                </label>
                <div className="border-2 border-dashed border-gray-300 rounded-lg p-6 text-center hover:border-gray-400 transition-colors">
                  <div className="space-y-4">
                    <div className="w-16 h-16 bg-gray-200 rounded-full flex items-center justify-center mx-auto">
                      <svg className="w-8 h-8 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12" />
                      </svg>
                    </div>
                    <div className="text-sm text-gray-600">
                      <p className="font-medium">Click to upload or drag and drop</p>
                      <p className="text-xs">PNG, JPG, GIF up to 10MB</p>
                    </div>
                  </div>
                  <input type="file" className="hidden" accept="image/*" />
                </div>
              </div>
              
              {/* Portfolio Images */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Portfolio Images (up to 10)
                </label>
                <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-4">
                  {[1, 2, 3, 4, 5].map((num) => (
                    <div key={num} className="border-2 border-dashed border-gray-300 rounded-lg p-4 text-center hover:border-gray-400 transition-colors">
                      <div className="w-12 h-12 bg-gray-200 rounded-full flex items-center justify-center mx-auto mb-2">
                        <svg className="w-6 h-6 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
                        </svg>
                      </div>
                      <p className="text-xs text-gray-500">Image {num}</p>
                    </div>
                  ))}
                </div>
              </div>
              
              {/* Video Link */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Video Link (Optional)
                </label>
                <input
                  type="url"
                  value={formData.videoLink || ''}
                  onChange={(e) => handleFieldChange('videoLink', e.target.value)}
                  placeholder="https://youtube.com/watch?v=..."
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
              </div>
            </div>
          </div>
        );
        
      case 5:
        return (
          <div className="space-y-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Service Description</h3>
            
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Full Description <span className="text-red-500">*</span>
                </label>
                <textarea
                  value={formData.fullDescription || ''}
                  onChange={(e) => handleFieldChange('fullDescription', e.target.value)}
                  rows={6}
                  placeholder="Describe your service in detail..."
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  What's Included
                </label>
                <textarea
                  value={formData.whatsIncluded || ''}
                  onChange={(e) => handleFieldChange('whatsIncluded', e.target.value)}
                  rows={4}
                  placeholder="List what buyers will get..."
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  What's Not Included
                </label>
                <textarea
                  value={formData.whatsNotIncluded || ''}
                  onChange={(e) => handleFieldChange('whatsNotIncluded', e.target.value)}
                  rows={3}
                  placeholder="List what's not included..."
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Requirements From Buyer
                </label>
                <textarea
                  value={formData.requirements || ''}
                  onChange={(e) => handleFieldChange('requirements', e.target.value)}
                  rows={3}
                  placeholder="What do you need from the buyer..."
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
              </div>
            </div>
          </div>
        );
        
      case 6:
        return (
          <div className="space-y-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Service Packages</h3>
            
            <div className="space-y-6">
              {['basic', 'standard', 'premium'].map((packageType) => (
                <div key={packageType} className="border border-gray-200 rounded-lg p-4">
                  <div className="flex items-center justify-between mb-4">
                    <h4 className="text-lg font-medium text-gray-900 capitalize">{packageType} Package</h4>
                    <label className="flex items-center">
                      <input
                        type="checkbox"
                        checked={formData.packages[packageType]?.enabled || false}
                        onChange={(e) => handleFieldChange(`packages.${packageType}.enabled`, e.target.checked)}
                        className="mr-2"
                      />
                      <span className="text-sm text-gray-600">Enable this package</span>
                    </label>
                  </div>
                  
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">Price ($)</label>
                      <input
                        type="number"
                        value={formData.packages[packageType]?.price || ''}
                        onChange={(e) => handleFieldChange(`packages.${packageType}.price`, e.target.value)}
                        placeholder="0"
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">Delivery Time</label>
                      <select
                        value={formData.packages[packageType]?.deliveryTime || ''}
                        onChange={(e) => handleFieldChange(`packages.${packageType}.deliveryTime`, e.target.value)}
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      >
                        <option value="">Select time</option>
                        <option value="1 day">1 day</option>
                        <option value="2 days">2 days</option>
                        <option value="3 days">3 days</option>
                        <option value="5 days">5 days</option>
                        <option value="7 days">7 days</option>
                        <option value="14 days">14 days</option>
                      </select>
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">Revisions</label>
                      <input
                        type="number"
                        value={formData.packages[packageType]?.revisions || 1}
                        onChange={(e) => handleFieldChange(`packages.${packageType}.revisions`, e.target.value)}
                        min="0"
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      />
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        );
        
      case 7:
        return (
          <div className="space-y-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Add-on Services</h3>
            
            <div className="space-y-4">
              <div className="border border-gray-200 rounded-lg p-4">
                <h4 className="font-medium text-gray-900 mb-4">Available Add-ons</h4>
                <div className="space-y-3">
                  {[
                    { name: 'Extra Fast Delivery', price: 10, description: 'Deliver in 24 hours' },
                    { name: 'Additional Revisions', price: 5, description: 'Extra revision rounds' },
                    { name: 'Source Files', price: 15, description: 'Get original source files' },
                    { name: 'Commercial Use', price: 25, description: 'Commercial license included' }
                  ].map((addon, index) => (
                    <div key={index} className="flex items-center justify-between p-3 border border-gray-100 rounded-lg">
                      <div className="flex-1">
                        <h5 className="font-medium text-gray-900">{addon.name}</h5>
                        <p className="text-sm text-gray-600">{addon.description}</p>
                      </div>
                      <div className="flex items-center space-x-2">
                        <span className="text-lg font-bold text-gray-900">${addon.price}</span>
                        <button
                          type="button"
                          className="px-3 py-1 bg-blue-600 text-white text-sm rounded-lg hover:bg-blue-700 transition-colors"
                        >
                          Add
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        );
        
      case 8:
        return (
          <div className="space-y-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Location Settings</h3>
            
            {formData.serviceType === 'local' ? (
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Service Area
                  </label>
                  <input
                    type="text"
                    value={formData.location?.address || ''}
                    onChange={(e) => handleFieldChange('location.address', e.target.value)}
                    placeholder="Enter your service area"
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  />
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Travel Radius (miles)
                  </label>
                  <input
                    type="number"
                    value={formData.location?.radius || ''}
                    onChange={(e) => handleFieldChange('location.radius', e.target.value)}
                    placeholder="25"
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  />
                </div>
              </div>
            ) : (
              <div className="text-center py-8">
                <p className="text-gray-500">Location settings are only available for local services</p>
              </div>
            )}
          </div>
        );
        
      case 9:
        return (
          <div className="space-y-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Premium Listing Options</h3>
            
            <div className="space-y-4">
              {[
                { tier: 'free', name: 'Free Listing', price: 0, features: ['Basic listing', 'Standard visibility', '30 days active'] },
                { tier: 'promoted', name: 'Promoted Listing', price: 29, features: ['Highlighted in search', 'Top placement', '90 days active', 'Basic analytics'], popular: true },
                { tier: 'featured', name: 'Featured Listing', price: 49, features: ['Front page placement', 'Priority support', '180 days active', 'Advanced analytics'] },
                { tier: 'sponsored', name: 'Sponsored Listing', price: 99, features: ['Homepage banner', 'Social media promotion', '365 days active', 'Premium support'] }
              ].map((option) => (
                <div key={option.tier} className={`border rounded-lg p-4 ${option.popular ? 'border-blue-500 bg-blue-50' : 'border-gray-200'}`}>
                  <div className="flex items-center justify-between mb-2">
                    <div>
                      <h4 className="font-medium text-gray-900">{option.name}</h4>
                      <p className="text-2xl font-bold text-gray-900">${option.price}</p>
                    </div>
                    <input
                      type="radio"
                      name="promotionTier"
                      value={option.tier}
                      checked={formData.promotionTier === option.tier}
                      onChange={(e) => handleFieldChange('promotionTier', e.target.value)}
                      className="w-4 h-4 text-blue-600"
                    />
                  </div>
                  <ul className="space-y-1 text-sm text-gray-600">
                    {option.features.map((feature, index) => (
                      <li key={index} className="flex items-center">
                        <svg className="w-4 h-4 text-green-500 mr-2" fill="currentColor" viewBox="0 0 20 20">
                          <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                        </svg>
                        {feature}
                      </li>
                    ))}
                  </ul>
                </div>
              ))}
            </div>
          </div>
        );
        
      case 10:
        return (
          <div className="space-y-6">
            <div className="bg-gray-50 p-6 rounded-lg">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Review & Submit</h3>
              
              {/* Service Summary */}
              <div className="space-y-4 mb-6">
                <div>
                  <h4 className="font-medium text-gray-700">Service Type:</h4>
                  <p className="text-gray-900">{formData.serviceType || 'Not selected'}</p>
                </div>
                <div>
                  <h4 className="font-medium text-gray-700">Service Title:</h4>
                  <p className="text-gray-900">{formData.title || 'Not provided'}</p>
                </div>
                <div>
                  <h4 className="font-medium text-gray-700">Category:</h4>
                  <p className="text-gray-900">{formData.category || 'Not selected'}</p>
                </div>
                <div>
                  <h4 className="font-medium text-gray-700">Starting Price:</h4>
                  <p className="text-gray-900">${formData.startingPrice || 'Not set'}</p>
                </div>
              </div>
              
              {/* Terms and Conditions */}
              <div className="space-y-4">
                <div className="flex items-start space-x-3">
                  <input
                    type="checkbox"
                    id="termsAccepted"
                    checked={formData.termsAccepted}
                    onChange={(e) => handleFieldChange('termsAccepted', e.target.checked)}
                    className="mt-1 w-4 h-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
                  />
                  <div className="flex-1">
                    <label htmlFor="termsAccepted" className="text-sm text-gray-700">
                      I agree to the{' '}
                      <button
                        type="button"
                        onClick={handleTermsAndConditions}
                        className="text-blue-600 hover:text-blue-800 underline"
                      >
                        Terms and Conditions
                      </button>
                    </label>
                  </div>
                </div>
                
                <div className="flex items-start space-x-3">
                  <input
                    type="checkbox"
                    id="accurateInfo"
                    checked={formData.accurateInfo}
                    onChange={(e) => handleFieldChange('accurateInfo', e.target.checked)}
                    className="mt-1 w-4 h-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
                  />
                  <label htmlFor="accurateInfo" className="text-sm text-gray-700">
                    I confirm that all information provided is accurate and complete
                  </label>
                </div>
              </div>
              
              {/* Error Messages */}
              {errors.terms && (
                <div className="p-3 bg-red-50 border border-red-200 rounded-lg">
                  <p className="text-red-800 text-sm">{errors.terms}</p>
                </div>
              )}
            </div>
          </div>
        );
        
      // Add other steps here as we implement them
      default:
        return (
          <div className="text-center py-12">
            <h3 className="text-lg font-medium text-gray-900 mb-2">Step {currentStep}</h3>
            <p className="text-gray-500">This step is under development</p>
          </div>
        );
    }
  };

  const getStepTitle = () => {
    const titles = {
      1: 'Service Type',
      2: 'Provider Information',
      3: 'Service Details',
      4: 'Service Media',
      5: 'Service Description',
      6: 'Service Packages',
      7: 'Add-on Services',
      8: 'Location Settings',
      9: 'Premium Listing',
      10: 'Review & Submit'
    };
    return titles[currentStep] || 'Step ' + currentStep;
  };

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto">
      <div className="flex items-center justify-center min-h-screen px-4 pt-4 pb-20 text-center sm:block sm:p-0">
        {/* Background overlay */}
        <div className="fixed inset-0 transition-opacity bg-gray-900 bg-opacity-75" onClick={onClose} />

        {/* Form Panel */}
        <div className="inline-block w-full max-w-5xl my-8 overflow-hidden text-left align-middle transition-all transform bg-white shadow-2xl rounded-2xl">
          {/* Header */}
          <div className="sticky top-0 z-10 bg-white border-b border-gray-200 px-6 py-4">
            <div className="flex items-center justify-between">
              <div>
                <h2 className="text-2xl font-bold text-gray-900">Post Your Service</h2>
                <p className="text-gray-600">{getStepTitle()}</p>
              </div>
              <button
                onClick={onClose}
                className="p-2 rounded-lg text-gray-400 hover:text-gray-600 hover:bg-gray-100 transition-colors"
              >
                <X className="w-6 h-6" />
              </button>
            </div>

            {/* Progress Bar */}
            <div className="mt-4">
              <div className="flex items-center justify-between mb-2">
                <span className="text-sm font-medium text-gray-700">
                  Step {currentStep} of {totalSteps}
                </span>
                <span className="text-sm font-medium text-gray-700">
                  {Math.round(progressPercentage)}%
                </span>
              </div>
              <div className="w-full bg-gray-200 rounded-full h-2">
                <div
                  className="bg-blue-600 h-2 rounded-full transition-all duration-300"
                  style={{ width: `${progressPercentage}%` }}
                ></div>
              </div>
            </div>
          </div>

          {/* Form Content */}
          <div className="px-6 py-6 max-h-[70vh] overflow-y-auto">
            {errors.submit && (
              <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-lg">
                <div className="flex items-center space-x-2">
                  <AlertCircle className="w-5 h-5 text-red-600" />
                  <span className="text-red-800">{errors.submit}</span>
                </div>
              </div>
            )}

            {renderStepContent()}

            {/* Error Messages */}
            {Object.entries(errors).map(([field, error]) => (
              field !== 'submit' && (
                <div key={field} className="mt-4 p-3 bg-red-50 border border-red-200 rounded-lg">
                  <p className="text-red-800 text-sm">{error}</p>
                </div>
              )
            ))}
          </div>

          {/* Footer */}
          <div className="sticky bottom-0 bg-white border-t border-gray-200 px-6 py-4">
            <div className="flex items-center justify-between">
              <button
                onClick={handlePrevious}
                disabled={currentStep === 1}
                className={`flex items-center space-x-2 px-4 py-2 rounded-lg font-medium transition-colors ${
                  currentStep === 1
                    ? 'bg-gray-100 text-gray-400 cursor-not-allowed'
                    : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                }`}
              >
                <ChevronLeft className="w-4 h-4" />
                <span>Previous</span>
              </button>

              <div className="flex items-center space-x-3">
                {/* Preview Button */}
                <button
                  type="button"
                  onClick={handlePreview}
                  className="flex items-center space-x-2 px-4 py-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition-colors"
                >
                  <Eye className="w-4 h-4" />
                  <span>Preview</span>
                </button>

                {/* Save Draft Button */}
                <button
                  type="button"
                  onClick={handleSaveDraft}
                  className="flex items-center space-x-2 px-4 py-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition-colors"
                >
                  <Save className="w-4 h-4" />
                  <span>Save Draft</span>
                </button>

                {/* Next/Submit Button */}
                {currentStep === totalSteps ? (
                  <button
                    onClick={handleSubmit}
                    disabled={isSubmitting}
                    className="flex items-center space-x-2 px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    {isSubmitting ? (
                      <>
                        <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                        <span>Submitting...</span>
                      </>
                    ) : (
                      <>
                        <CheckCircle className="w-4 h-4" />
                        <span>Submit Service</span>
                      </>
                    )}
                  </button>
                ) : (
                  <button
                    onClick={handleNext}
                    className="flex items-center space-x-2 px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
                  >
                    <span>Next</span>
                    <ChevronRight className="w-4 h-4" />
                  </button>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Preview Modal */}
      {showPreview && (
        <div className="fixed inset-0 z-50 overflow-y-auto">
          <div className="flex items-center justify-center min-h-screen px-4 pt-4 pb-20 text-center sm:block sm:p-0">
            {/* Background overlay */}
            <div className="fixed inset-0 transition-opacity bg-gray-900 bg-opacity-75" onClick={() => setShowPreview(false)} />

            {/* Preview Panel */}
            <div className="inline-block w-full max-w-4xl my-8 overflow-hidden text-left align-middle transition-all transform bg-white shadow-2xl rounded-2xl">
              {/* Preview Header */}
              <div className="sticky top-0 z-10 bg-white border-b border-gray-200 px-6 py-4">
                <div className="flex items-center justify-between">
                  <div>
                    <h2 className="text-2xl font-bold text-gray-900">Service Preview</h2>
                    <p className="text-gray-600">This is how your service will appear to buyers</p>
                  </div>
                  <button
                    onClick={() => setShowPreview(false)}
                    className="p-2 rounded-lg text-gray-400 hover:text-gray-600 hover:bg-gray-100 transition-colors"
                  >
                    <X className="w-6 h-6" />
                  </button>
                </div>
              </div>

              {/* Preview Content */}
              <div className="max-h-[70vh] overflow-y-auto">
                {/* Service Card Preview */}
                <div className="p-6">
                  <div className="bg-white border border-gray-200 rounded-2xl overflow-hidden hover:shadow-xl transition-all duration-300">
                    {/* Image Section */}
                    <div className="relative h-64 bg-gradient-to-br from-gray-100 to-gray-200 overflow-hidden">
                      <div className="absolute inset-0 flex items-center justify-center">
                        <div className="w-20 h-20 bg-gray-300 rounded-full flex items-center justify-center">
                          <Briefcase className="w-10 h-10 text-gray-500" />
                        </div>
                      </div>
                      
                      {/* Preview Badge */}
                      <div className="absolute top-4 left-4">
                        <span className="px-3 py-1 bg-blue-500 text-white text-xs font-semibold rounded-full">
                          PREVIEW
                        </span>
                      </div>
                    </div>

                    {/* Content Section */}
                    <div className="p-6">
                      {/* Provider Info */}
                      <div className="flex items-center space-x-3 mb-4">
                        <div className="w-12 h-12 bg-gray-200 rounded-full flex items-center justify-center">
                          <User className="w-6 h-6 text-gray-500" />
                        </div>
                        <div className="flex-1">
                          <p className="text-sm font-medium text-gray-900">
                            {formData.providerName || 'Your Name'}
                          </p>
                          <div className="flex items-center space-x-2 text-xs text-gray-500">
                            <span>{getCountryFlag(formData.country || 'US')}</span>
                            <span>{formData.country || 'United States'}</span>
                          </div>
                        </div>
                      </div>

                      {/* Service Title */}
                      <h3 className="text-xl font-semibold text-gray-900 mb-3">
                        {formData.title || 'Your Service Title'}
                      </h3>

                      {/* Category */}
                      <div className="flex items-center space-x-2 mb-4">
                        <span className="px-3 py-1 bg-gray-100 text-gray-600 text-sm font-medium rounded-md">
                          {formData.category || 'Category'}
                        </span>
                        {formData.deliveryTime && (
                          <div className="flex items-center space-x-1 text-sm text-gray-500">
                            <Clock className="w-4 h-4" />
                            <span>{formData.deliveryTime}</span>
                          </div>
                        )}
                      </div>

                      {/* Description */}
                      <div className="mb-4">
                        <h4 className="font-medium text-gray-700 mb-2">Description</h4>
                        <p className="text-gray-600 text-sm line-clamp-3">
                          {formData.fullDescription || 'Your service description will appear here...'}
                        </p>
                      </div>

                      {/* Price */}
                      <div className="flex items-center justify-between mb-4">
                        <div>
                          <span className="text-3xl font-bold text-gray-900">
                            ${formData.startingPrice || '0'}
                          </span>
                          <span className="text-sm text-gray-500 ml-1">Starting from</span>
                        </div>
                      </div>

                      {/* Skills */}
                      {formData.skills && formData.skills.length > 0 && (
                        <div className="mb-4">
                          <h4 className="font-medium text-gray-700 mb-2">Skills</h4>
                          <div className="flex flex-wrap gap-2">
                            {formData.skills.slice(0, 5).map((skill, index) => (
                              <span key={index} className="px-2 py-1 bg-blue-50 text-blue-600 text-xs font-medium rounded-md">
                                {skill}
                              </span>
                            ))}
                          </div>
                        </div>
                      )}

                      {/* Action Buttons */}
                      <div className="flex space-x-3">
                        <button className="flex-1 px-4 py-3 bg-blue-600 text-white font-medium rounded-lg hover:bg-blue-700 transition-colors">
                          Contact Seller
                        </button>
                        <button className="px-4 py-3 border border-gray-300 text-gray-700 font-medium rounded-lg hover:bg-gray-50 transition-colors">
                          Save
                        </button>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Service Details Preview */}
                <div className="px-6 pb-6">
                  <div className="bg-gray-50 p-6 rounded-lg">
                    <h3 className="text-lg font-semibold text-gray-900 mb-4">Service Details</h3>
                    <div className="grid grid-cols-2 gap-4 text-sm">
                      <div>
                        <span className="font-medium text-gray-700">Service Type:</span>
                        <p className="text-gray-900 capitalize">{formData.serviceType || 'Not selected'}</p>
                      </div>
                      <div>
                        <span className="font-medium text-gray-700">Category:</span>
                        <p className="text-gray-900">{formData.category || 'Not selected'}</p>
                      </div>
                      <div>
                        <span className="font-medium text-gray-700">Location:</span>
                        <p className="text-gray-900">{formData.country || 'Not specified'}</p>
                      </div>
                      <div>
                        <span className="font-medium text-gray-700">Response Time:</span>
                        <p className="text-gray-900">{formData.responseTime || 'Not specified'}</p>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              {/* Preview Footer */}
              <div className="sticky bottom-0 bg-white border-t border-gray-200 px-6 py-4">
                <div className="flex items-center justify-between">
                  <p className="text-sm text-gray-500">
                    This is a preview. Your service is not yet published.
                  </p>
                  <div className="flex space-x-3">
                    <button
                      onClick={() => setShowPreview(false)}
                      className="px-4 py-2 bg-gray-100 text-gray-700 font-medium rounded-lg hover:bg-gray-200 transition-colors"
                    >
                      Close Preview
                    </button>
                    <button
                      onClick={() => setShowPreview(false)}
                      className="px-4 py-2 bg-blue-600 text-white font-medium rounded-lg hover:bg-blue-700 transition-colors"
                    >
                      Continue Editing
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default ServicePostForm;
