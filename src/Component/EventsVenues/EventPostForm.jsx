import React, { useState } from 'react';
import { X, Upload, Calendar, MapPin, DollarSign, FileText, Video, Clock, Users, Star, Check, ChevronRight, ArrowLeft } from 'lucide-react';
import eventsApi from '../../services/eventsApi';
import usePromoPricingPlans from '../../hooks/usePromoPricingPlans';
import PromotionTierPicker from '../shared/PromotionTierPicker';

const EventPostForm = ({ isOpen, onClose }) => {
  const [formData, setFormData] = useState({
    title: '',
    category: '',
    date: '',
    time: '',
    country: '',
    city: '',
    venueName: '',
    ticketPrice: '',
    priceType: 'paid',
    description: '',
    ageRestriction: '',
    expectedAttendance: '',
    contactEmail: '',
    ticketLink: '',
    socialLinks: {
      facebook: '',
      twitter: '',
      instagram: '',
      website: ''
    }
  });

  const [selectedPromotion, setSelectedPromotion] = useState('promoted');
  const { plans: promoPlans, loading: promoLoading } = usePromoPricingPlans('events');
  const [uploadedFiles, setUploadedFiles] = useState({
    poster: null,
    gallery: [],
    video: null
  });

  const [currentStep, setCurrentStep] = useState(1);
  const totalSteps = 4;

  const promotionTiers = promoPlans;

  const handleInputChange = (field, value) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const handleSocialLinkChange = (platform, value) => {
    setFormData(prev => ({
      ...prev,
      socialLinks: {
        ...prev.socialLinks,
        [platform]: value
      }
    }));
  };

  const handleFileUpload = (type, files) => {
    if (type === 'poster') {
      setUploadedFiles(prev => ({ ...prev, poster: files[0] }));
    } else if (type === 'gallery') {
      setUploadedFiles(prev => ({ ...prev, gallery: [...prev.gallery, ...files] }));
    } else if (type === 'video') {
      setUploadedFiles(prev => ({ ...prev, video: files[0] }));
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    try {
      // Prepare data for API submission
      const submissionData = {
        title: formData.title,
        category: formData.category,
        date_time: `${formData.date}T${formData.time}`,
        country: formData.country,
        city: formData.city,
        venue_name: formData.venueName,
        ticket_price: formData.priceType === 'free' ? 0 : parseFloat(formData.ticketPrice),
        price_type: formData.priceType,
        description: formData.description,
        age_restrictions: formData.ageRestriction,
        expected_attendance: parseInt(formData.expectedAttendance),
        contact_email: formData.contactEmail,
        ticket_link: formData.ticketLink,
        social_links: Object.values(formData.socialLinks).filter(link => link.trim() !== ''),
        promotion_tier: selectedPromotion || 'standard'
      };

      // Add images if uploaded
      if (uploadedFiles.poster) {
        submissionData.images = [uploadedFiles.poster];
      }

      // Validate data using API service
      const validation = eventsApi.validateEventData(submissionData);
      if (!validation.isValid) {
        const errorMessages = Object.values(validation.errors).join('\n');
        alert('Please fix the following errors:\n' + errorMessages);
        return;
      }

      // Format data for API
      const formattedData = eventsApi.formatEventData(submissionData);

      console.log('Submitting event:', formattedData);

      // Call API to create event
      const response = await eventsApi.createEvent(formattedData);
      
      console.log('Event created successfully:', response);
      
      // Show success message
      alert('Event posted successfully!');
      
      // Close form and reset
      onClose();
      
      // Optionally refresh the events list or redirect
      window.location.reload();
      
    } catch (error) {
      console.error('Error submitting event:', error);
      alert('Failed to post event. Please try again.');
    }
  };

  const nextStep = () => {
    if (currentStep < totalSteps) {
      setCurrentStep(currentStep + 1);
    }
  };

  const prevStep = () => {
    if (currentStep > 1) {
      setCurrentStep(currentStep - 1);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 z-50 overflow-y-auto">
      <div className="min-h-screen px-4 text-center">
        <div className="inline-block w-full max-w-4xl my-8 text-left align-middle transition-all transform bg-white shadow-xl rounded-2xl">
          
          {/* Header */}
          <div className="bg-gradient-to-r from-purple-600 to-purple-700 px-6 py-4 rounded-t-2xl">
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-3">
                <button
                  onClick={onClose}
                  className="text-white hover:text-gray-200 transition-colors"
                  title="Back to Entertainment"
                >
                  <ArrowLeft className="w-5 h-5" />
                </button>
                <h2 className="text-2xl font-bold text-white">Post Your Event</h2>
              </div>
              <button
                onClick={onClose}
                className="text-white hover:text-gray-200 transition-colors"
              >
                <X className="w-6 h-6" />
              </button>
            </div>
          </div>
            
            {/* Progress Bar */}
            <div className="mt-4">
              <div className="flex items-center justify-between mb-2">
                <span className="text-sm text-purple-200">Step {currentStep} of {totalSteps}</span>
                <span className="text-sm text-purple-200">
                  {currentStep === 1 && 'Basic Information'}
                  {currentStep === 2 && 'Event Details'}
                  {currentStep === 2 && 'Media & Schedule'}
                  {currentStep === 3 && 'Promotion'}
                  {currentStep === 4 && 'Confirmation'}
                </span>
              </div>
              <div className="w-full bg-purple-800 rounded-full h-2">
                <div 
                  className="bg-white h-2 rounded-full transition-all duration-300"
                  style={{ width: `${(currentStep / totalSteps) * 100}%` }}
                ></div>
              </div>
            </div>

          {/* Form Content */}
          <form onSubmit={handleSubmit} className="p-6">
            {/* Step 1: Basic Information */}
            {currentStep === 1 && (
              <div className="space-y-6">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Event Title *
                  </label>
                  <input
                    type="text"
                    value={formData.title}
                    onChange={(e) => handleInputChange('title', e.target.value)}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                    placeholder="Enter your event title"
                    required
                  />
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Category *
                    </label>
                    <select
                      value={formData.category}
                      onChange={(e) => handleInputChange('category', e.target.value)}
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                      required
                    >
                      <option value="">Select a category</option>
                      <option value="concert">Concerts & Music</option>
                      <option value="conference">Business Conferences</option>
                      <option value="workshop">Workshops</option>
                      <option value="festival">Festivals</option>
                      <option value="party">Parties & Nightlife</option>
                      <option value="sports">Sports Events</option>
                      <option value="cultural">Cultural Events</option>
                      <option value="food_drink">Food & Drink</option>
                      <option value="charity">Charity Events</option>
                      <option value="other">Other</option>
                    </select>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Date & Time *
                    </label>
                    <div className="grid grid-cols-2 gap-2">
                      <input
                        type="date"
                        value={formData.date}
                        onChange={(e) => handleInputChange('date', e.target.value)}
                        className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                        required
                      />
                      <input
                        type="time"
                        value={formData.time}
                        onChange={(e) => handleInputChange('time', e.target.value)}
                        className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                        required
                      />
                    </div>
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Country *
                    </label>
                    <input
                      type="text"
                      value={formData.country}
                      onChange={(e) => handleInputChange('country', e.target.value)}
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                      placeholder="Country"
                      required
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      City *
                    </label>
                    <input
                      type="text"
                      value={formData.city}
                      onChange={(e) => handleInputChange('city', e.target.value)}
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                      placeholder="City"
                      required
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Venue Name *
                  </label>
                  <input
                    type="text"
                    value={formData.venueName}
                    onChange={(e) => handleInputChange('venueName', e.target.value)}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                    placeholder="Venue name or address"
                    required
                  />
                </div>
              </div>
            )}

            {/* Step 2: Event Details */}
            {currentStep === 2 && (
              <div className="space-y-6">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Ticket Pricing
                  </label>
                  <div className="space-y-4">
                    <div className="grid grid-cols-3 gap-4">
                      <label className="flex items-center cursor-pointer">
                        <input
                          type="radio"
                          value="free"
                          checked={formData.priceType === 'free'}
                          onChange={(e) => handleInputChange('priceType', e.target.value)}
                          className="mr-2"
                        />
                        <span>Free Event</span>
                      </label>
                      <label className="flex items-center cursor-pointer">
                        <input
                          type="radio"
                          value="paid"
                          checked={formData.priceType === 'paid'}
                          onChange={(e) => handleInputChange('priceType', e.target.value)}
                          className="mr-2"
                        />
                        <span>Paid Event</span>
                      </label>
                      <label className="flex items-center cursor-pointer">
                        <input
                          type="radio"
                          value="donation"
                          checked={formData.priceType === 'donation'}
                          onChange={(e) => handleInputChange('priceType', e.target.value)}
                          className="mr-2"
                        />
                        <span>Donation</span>
                      </label>
                    </div>
                    
                    {formData.priceType === 'paid' && (
                      <input
                        type="text"
                        value={formData.ticketPrice}
                        onChange={(e) => handleInputChange('ticketPrice', e.target.value)}
                        className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                        placeholder="Enter ticket price (e.g., $25, $50-100)"
                      />
                    )}
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Event Description *
                  </label>
                  <textarea
                    value={formData.description}
                    onChange={(e) => handleInputChange('description', e.target.value)}
                    rows={6}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                    placeholder="Describe your event in detail..."
                    required
                  />
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Age Restrictions
                    </label>
                    <select
                      value={formData.ageRestriction}
                      onChange={(e) => handleInputChange('ageRestriction', e.target.value)}
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                    >
                      <option value="">All ages</option>
                      <option value="18+">18+</option>
                      <option value="21+">21+</option>
                    </select>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Expected Attendance
                    </label>
                    <input
                      type="number"
                      value={formData.expectedAttendance}
                      onChange={(e) => handleInputChange('expectedAttendance', e.target.value)}
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                      placeholder="Number of attendees"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Upload Event Poster
                  </label>
                  <div className="border-2 border-dashed border-gray-300 rounded-lg p-6 text-center hover:border-purple-500 transition-colors">
                    <Upload className="w-12 h-12 text-gray-400 mx-auto mb-4" />
                    <p className="text-sm text-gray-600 mb-2">Click to upload or drag and drop</p>
                    <p className="text-xs text-gray-500">PNG, JPG up to 10MB</p>
                    <input
                      type="file"
                      accept="image/*"
                      onChange={(e) => handleFileUpload('poster', e.target.files)}
                      className="hidden"
                    />
                  </div>
                </div>
              </div>
            )}

            {/* Step 3: Promotion */}
            {currentStep === 3 && (
              <div className="space-y-6">
                <div className="text-center mb-4">
                  <h3 className="text-2xl font-bold text-gray-900 mb-2">Choose Your Promotion Package</h3>
                  <p className="text-gray-600">Prices are managed in Admin → Promo Pricing Plans</p>
                </div>
                <PromotionTierPicker
                  plans={promoPlans}
                  loading={promoLoading}
                  value={selectedPromotion}
                  onChange={(id) => setSelectedPromotion(id)}
                  title=""
                />
              </div>
            )}

            {/* Step 4: Confirmation */}
            {currentStep === 4 && (
              <div className="space-y-6">
                <div className="text-center">
                  <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
                    <Check className="w-8 h-8 text-green-600" />
                  </div>
                  <h3 className="text-2xl font-bold text-gray-900 mb-2">Review Your Event</h3>
                  <p className="text-gray-600">Please review your event details before submission</p>
                </div>

                <div className="bg-gray-50 rounded-lg p-6 space-y-4">
                  <div>
                    <h4 className="font-medium text-gray-900 mb-2">Event Details</h4>
                    <div className="grid grid-cols-2 gap-4 text-sm">
                      <div>
                        <span className="text-gray-600">Title:</span>
                        <span className="ml-2 text-gray-900">{formData.title}</span>
                      </div>
                      <div>
                        <span className="text-gray-600">Category:</span>
                        <span className="ml-2 text-gray-900">{formData.category}</span>
                      </div>
                      <div>
                        <span className="text-gray-600">Date:</span>
                        <span className="ml-2 text-gray-900">{formData.date}</span>
                      </div>
                      <div>
                        <span className="text-gray-600">Time:</span>
                        <span className="ml-2 text-gray-900">{formData.time}</span>
                      </div>
                      <div>
                        <span className="text-gray-600">Venue:</span>
                        <span className="ml-2 text-gray-900">{formData.venueName}</span>
                      </div>
                      <div>
                        <span className="text-gray-600">Location:</span>
                        <span className="ml-2 text-gray-900">{formData.city}, {formData.country}</span>
                      </div>
                    </div>
                  </div>

                  <div>
                    <h4 className="font-medium text-gray-900 mb-2">Pricing</h4>
                    <div className="text-sm">
                      <span className="text-gray-600">Type:</span>
                      <span className="ml-2 text-gray-900 capitalize">{formData.priceType}</span>
                      {formData.priceType === 'paid' && formData.ticketPrice && (
                        <>
                          <span className="ml-4 text-gray-600">Price:</span>
                          <span className="ml-2 text-gray-900">{formData.ticketPrice}</span>
                        </>
                      )}
                    </div>
                  </div>

                  {selectedPromotion && (
                    <div>
                      <h4 className="font-medium text-gray-900 mb-2">Promotion Package</h4>
                      <div className="text-sm">
                        <span className="text-gray-600">Package:</span>
                        <span className="ml-2 text-gray-900">
                          {promoPlans.find(t => (t.id || t.tier) === selectedPromotion)?.name}
                        </span>
                        <span className="ml-2 text-purple-600 font-medium">
                          ({promoPlans.find(t => (t.id || t.tier) === selectedPromotion)?.price_label
                            || promoPlans.find(t => (t.id || t.tier) === selectedPromotion)?.price})
                        </span>
                      </div>
                    </div>
                  )}
                </div>

                <div className="space-y-4">
                  <label className="flex items-start space-x-3 cursor-pointer">
                    <input
                      type="checkbox"
                      className="mt-1 w-4 h-4 text-purple-600 border-gray-300 rounded focus:ring-purple-500"
                      required
                    />
                    <span className="text-sm text-gray-700">
                      I confirm that all information provided is accurate and truthful
                    </span>
                  </label>

                  <label className="flex items-start space-x-3 cursor-pointer">
                    <input
                      type="checkbox"
                      className="mt-1 w-4 h-4 text-purple-600 border-gray-300 rounded focus:ring-purple-500"
                      required
                    />
                    <span className="text-sm text-gray-700">
                      I agree to the Terms of Service and Community Guidelines
                    </span>
                  </label>
                </div>
              </div>
            )}

            {/* Navigation Buttons */}
            <div className="flex justify-between mt-8">
              <button
                type="button"
                onClick={prevStep}
                disabled={currentStep === 1}
                className="px-6 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
              >
                Previous
              </button>

              {currentStep < totalSteps ? (
                <button
                  type="button"
                  onClick={nextStep}
                  className="px-6 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition-colors flex items-center space-x-2"
                >
                  <span>Next</span>
                  <ChevronRight className="w-4 h-4" />
                </button>
              ) : (
                <button
                  type="submit"
                  className="px-6 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition-colors"
                >
                  Submit Event
                </button>
              )}
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default EventPostForm;
