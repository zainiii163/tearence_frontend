import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useSelector } from 'react-redux';
import { createListingWithPosterName } from '../../utils/posterHelper';
import SponsoredUpsellOptions from './SponsoredUpsellOptions';

const EnhancedPostForm = ({ 
  formTitle, 
  formFields, 
  categoryPath,
  apiEndpoint,
  initialValues = {},
  customStyles = {}
}) => {
  const navigate = useNavigate();
  
  // Get user, business, and store data from Redux
  const auth = useSelector(state => state.auth);
  const store = useSelector(state => state.store);
  
  const user = auth.userDetail?.data || auth.userInfo;
  const businessStore = store.businessStore?.data || store.businessStore;
  const storeDetail = store.storeDetail?.data || store.storeDetail;
  
  // Check if current context is admin dashboard
  const isAdmin = window.location.pathname.includes('/admin') || user?.role === 'admin';
  
  // State for sponsored upsell options
  const [selectedSponsoredTier, setSelectedSponsoredTier] = useState('');
  const [showSponsoredOptions, setShowSponsoredOptions] = useState(false);
  const [currentStep, setCurrentStep] = useState(1);
  const totalSteps = 6; // Including sponsored options as step 6
  
  const [formData, setFormData] = useState({
    ...initialValues
  });

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    // If sponsored options are shown but no tier is selected, show error
    if (showSponsoredOptions && !selectedSponsoredTier) {
      alert('Please select a sponsored tier or skip to continue with standard posting.');
      return;
    }
    
    // If sponsored options are not shown yet, show them instead of submitting
    if (!showSponsoredOptions) {
      setShowSponsoredOptions(true);
      setCurrentStep(6);
      return;
    }
    
    try {
      // Create enhanced listing data with proper poster name and sponsored tier
      const enhancedListingData = await createListingWithPosterName(
        {
          ...formData,
          sponsoredTier: selectedSponsoredTier,
          isSponsored: !!selectedSponsoredTier,
          category: categoryPath
        },
        user,
        businessStore,
        storeDetail,
        isAdmin
      );
      
      console.log('Enhanced posting data with sponsored tier:', enhancedListingData);
      
      // TODO: Submit to API
      // await Api.post(apiEndpoint, enhancedListingData);
      
      // Navigate to success page or category listings
      navigate(`/${categoryPath}`);
    } catch (error) {
      console.error('Error posting listing:', error);
      // Handle error appropriately
    }
  };

  const handleProceedToPayment = () => {
    // Handle payment processing for sponsored tier
    console.log('Proceeding to payment for tier:', selectedSponsoredTier);
    
    // Get tier pricing
    const tierPrices = {
      basic: 29.99,
      plus: 49.99,
      premium: 99.99
    };
    
    const amount = tierPrices[selectedSponsoredTier] || 0;
    
    // Navigate to payment page with sponsored tier info
    navigate(`/payment?sponsored=${selectedSponsoredTier}&amount=${amount}&category=${categoryPath}`);
  };

  const handleSkipSponsored = () => {
    setSelectedSponsoredTier('');
    setShowSponsoredOptions(false);
    // Submit the form without sponsored options
    handleSubmit({ preventDefault: () => {} });
  };

  const renderFormField = (field) => {
    const { name, label, type, required, options, placeholder, rows, className = '' } = field;
    
    const baseInputClass = `w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 ${className}`;
    
    switch (type) {
      case 'select':
        return (
          <select
            name={name}
            value={formData[name] || ''}
            onChange={handleChange}
            required={required}
            className={baseInputClass}
          >
            <option value="">{placeholder || `Select ${label.toLowerCase()}`}</option>
            {options?.map((option) => (
              <option key={option.value} value={option.value}>
                {option.label}
              </option>
            ))}
          </select>
        );
        
      case 'textarea':
        return (
          <textarea
            name={name}
            value={formData[name] || ''}
            onChange={handleChange}
            required={required}
            rows={rows || 4}
            className={baseInputClass}
            placeholder={placeholder}
          />
        );
        
      case 'tel':
        return (
          <input
            type="tel"
            name={name}
            value={formData[name] || ''}
            onChange={handleChange}
            required={required}
            className={baseInputClass}
            placeholder={placeholder}
          />
        );
        
      case 'email':
        return (
          <input
            type="email"
            name={name}
            value={formData[name] || ''}
            onChange={handleChange}
            required={required}
            className={baseInputClass}
            placeholder={placeholder}
          />
        );
        
      case 'url':
        return (
          <input
            type="url"
            name={name}
            value={formData[name] || ''}
            onChange={handleChange}
            required={required}
            className={baseInputClass}
            placeholder={placeholder}
          />
        );
        
      case 'number':
        return (
          <input
            type="number"
            name={name}
            value={formData[name] || ''}
            onChange={handleChange}
            required={required}
            className={baseInputClass}
            placeholder={placeholder}
            min={field.min}
            max={field.max}
          />
        );
        
      default:
        return (
          <input
            type={type || 'text'}
            name={name}
            value={formData[name] || ''}
            onChange={handleChange}
            required={required}
            className={baseInputClass}
            placeholder={placeholder}
          />
        );
    }
  };

  return (
    <div className="max-w-4xl mx-auto p-6 bg-white rounded-lg shadow-md">
      {/* Progress Indicator */}
      <div className="mb-8">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-2xl font-bold text-center flex-1">{formTitle}</h2>
          <div className="text-sm text-gray-500">
            Step {currentStep} of {totalSteps}
          </div>
        </div>
        
        {/* Progress Bar */}
        <div className="w-full bg-gray-200 rounded-full h-2">
          <div 
            className="bg-gradient-to-r from-blue-500 to-purple-600 h-2 rounded-full transition-all duration-300"
            style={{ width: `${(currentStep / totalSteps) * 100}%` }}
          />
        </div>
      </div>
      
      <form onSubmit={handleSubmit} className="space-y-4">
        {/* Render Form Fields */}
        {formFields.map((field) => (
          <div key={field.name} className={field.gridCols ? `grid grid-cols-1 md:grid-cols-${field.gridCols} gap-4` : ''}>
            {field.gridCols ? (
              field.fields?.map((subField) => (
                <div key={subField.name}>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    {subField.label} {subField.required && '*'}
                  </label>
                  {renderFormField(subField)}
                </div>
              ))
            ) : (
              <>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  {field.label} {field.required && '*'}
                </label>
                {renderFormField(field)}
              </>
            )}
          </div>
        ))}

        {/* Step 6 — SPONSORED UPSALE OPTIONS */}
        {showSponsoredOptions && (
          <div className="mt-8 pt-8 border-t border-gray-200">
            <div className="mb-6">
              <h3 className="text-xl font-bold text-gray-900 mb-2">
                Step 6 — SPONSORED UPSALE OPTIONS (Mandatory Tier Selection)
              </h3>
              <p className="text-gray-600">
                This is the heart of the form — the revenue engine. Choose your sponsorship tier to maximize visibility.
              </p>
            </div>
            
            <SponsoredUpsellOptions
              selectedTier={selectedSponsoredTier}
              setSelectedTier={setSelectedSponsoredTier}
              onProceedToPayment={handleProceedToPayment}
            />
          </div>
        )}

        {/* Action Buttons */}
        <div className="flex justify-end space-x-4 pt-6">
          <button
            type="button"
            onClick={() => navigate(-1)}
            className="px-6 py-2 border border-gray-300 rounded-md text-gray-700 hover:bg-gray-50"
          >
            Cancel
          </button>
          
          {!showSponsoredOptions ? (
            <button
              type="submit"
              className="px-6 py-2 bg-gradient-to-r from-blue-600 to-purple-600 text-white rounded-md hover:from-blue-700 hover:to-purple-700 transition-all"
            >
              Continue to Sponsored Options →
            </button>
          ) : (
            <>
              <button
                type="button"
                onClick={handleSkipSponsored}
                className="px-6 py-2 border border-gray-300 rounded-md text-gray-700 hover:bg-gray-50"
              >
                Skip Sponsored
              </button>
              <button
                type="submit"
                className="px-6 py-2 bg-gradient-to-r from-green-600 to-blue-600 text-white rounded-md hover:from-green-700 hover:to-blue-700 transition-all disabled:opacity-50 disabled:cursor-not-allowed"
                disabled={!selectedSponsoredTier}
              >
                Post with Sponsorship →
              </button>
            </>
          )}
        </div>
      </form>
    </div>
  );
};

export default EnhancedPostForm;
