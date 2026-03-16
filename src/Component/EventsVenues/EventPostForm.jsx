import React, { useState } from 'react';
import { X, Upload, Calendar, MapPin, DollarSign, FileText, Video, Clock, Users, Star, Check, ChevronRight, ArrowLeft } from 'lucide-react';
import eventsVenuesService from '../../services/EventsVenuesService';

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

  const [selectedPromotion, setSelectedPromotion] = useState('');
  const [uploadedFiles, setUploadedFiles] = useState({
    poster: null,
    gallery: [],
    video: null
  });

  const [currentStep, setCurrentStep] = useState(1);
  const totalSteps = 4;

  const promotionTiers = [
    {
      id: 'basic',
      name: 'Basic Listing',
      price: 'Free',
      duration: '30 days',
      features: [
        'Standard placement in search results',
        'Basic event information display',
        'Contact form access',
        '7-day customer support'
      ],
      badge: 'Standard',
      color: 'from-gray-500 to-gray-600'
    },
    {
      id: 'promoted',
      name: 'Promoted Listing',
      price: '$29',
      duration: '30 days',
      features: [
        'Enhanced visibility in search results',
        'Promoted badge on listing',
        'Priority placement for 7 days',
        'Social media promotion',
        'Detailed analytics dashboard',
        '24/7 customer support'
      ],
      badge: 'Promoted',
      color: 'from-purple-500 to-purple-600',
      popular: false
    },
    {
      id: 'featured',
      name: 'Featured Listing',
      price: '$49',
      duration: '30 days',
      features: [
        'Top placement in search results',
        'Featured badge on listing',
        'Homepage showcase for 14 days',
        'Email newsletter promotion',
        'Advanced analytics & insights',
        'Priority customer support',
        'Event promotion tools'
      ],
      badge: 'Featured',
      color: 'from-blue-500 to-blue-600',
      popular: true
    },
    {
      id: 'sponsored',
      name: 'Sponsored Listing',
      price: '$99',
      duration: '30 days',
      features: [
        'Premium placement across platform',
        'Sponsored badge on listing',
        'Homepage banner for 30 days',
        'Social media campaign',
        'Email blast to subscribers',
        'Premium analytics suite',
        'Dedicated account manager',
        'Full marketing package'
      ],
      badge: 'Sponsored',
      color: 'from-amber-500 to-amber-600',
      popular: false
    }
  ];

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

      console.log('Submitting event:', submissionData);

      // Call API to create event
      const response = await eventsVenuesService.createEventWithImages(submissionData);
      
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
                  title="Back to Events & Venues"
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
                      <option value="concerts-music">Concerts & Music</option>
                      <option value="business-conferences">Business Conferences</option>
                      <option value="workshops">Workshops</option>
                      <option value="festivals">Festivals</option>
                      <option value="parties-nightlife">Parties & Nightlife</option>
                      <option value="sports-events">Sports Events</option>
                      <option value="cultural-events">Cultural Events</option>
                      <option value="food-drink">Food & Drink</option>
                      <option value="charity-events">Charity Events</option>
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
                <div className="text-center mb-8">
                  <h3 className="text-2xl font-bold text-gray-900 mb-2">Choose Your Promotion Package</h3>
                  <p className="text-gray-600">Boost your event visibility and reach more attendees</p>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {promotionTiers.map((tier) => (
                    <div
                      key={tier.id}
                      className={`relative bg-white border-2 rounded-2xl p-6 cursor-pointer transition-all duration-300 ${
                        selectedPromotion === tier.id
                          ? 'border-purple-500 shadow-lg scale-105'
                          : 'border-gray-200 hover:border-gray-300'
                      }`}
                      onClick={() => setSelectedPromotion(tier.id)}
                    >
                      {tier.popular && (
                        <div className="absolute -top-3 left-1/2 transform -translate-x-1/2">
                          <span className="bg-purple-600 text-white px-3 py-1 rounded-full text-xs font-semibold">
                            Most Popular
                          </span>
                        </div>
                      )}

                      <div className="text-center mb-6">
                        <h4 className="text-xl font-bold text-gray-900 mb-2">{tier.name}</h4>
                        <div className="flex items-baseline justify-center space-x-1">
                          <span className="text-3xl font-bold text-gray-900">{tier.price}</span>
                          <span className="text-gray-600">/{tier.duration}</span>
                        </div>
                      </div>

                      <div className="space-y-3 mb-6">
                        {tier.features.map((feature, index) => (
                          <div key={index} className="flex items-start space-x-2">
                            <Check className="w-5 h-5 text-green-500 flex-shrink-0 mt-0.5" />
                            <span className="text-sm text-gray-700">{feature}</span>
                          </div>
                        ))}
                      </div>

                      <div className={`w-full py-2 rounded-lg text-center font-medium transition-colors ${
                        selectedPromotion === tier.id
                          ? 'bg-purple-600 text-white'
                          : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                      }`}>
                        {selectedPromotion === tier.id ? 'Selected' : 'Select Package'}
                      </div>
                    </div>
                  ))}
                </div>

                {/* Comparison Table */}
                <div className="mt-8 overflow-x-auto">
                  <table className="w-full border-collapse">
                    <thead>
                      <tr className="border-b">
                        <th className="text-left py-3 px-4 text-sm font-medium text-gray-700">Features</th>
                        <th className="text-center py-3 px-4 text-sm font-medium text-gray-700">Basic</th>
                        <th className="text-center py-3 px-4 text-sm font-medium text-gray-700">Promoted</th>
                        <th className="text-center py-3 px-4 text-sm font-medium text-purple-600">Featured</th>
                        <th className="text-center py-3 px-4 text-sm font-medium text-gray-700">Sponsored</th>
                      </tr>
                    </thead>
                    <tbody>
                      <tr className="border-b">
                        <td className="py-3 px-4 text-sm text-gray-700">Search Placement</td>
                        <td className="py-3 px-4 text-center text-sm">Standard</td>
                        <td className="py-3 px-4 text-center text-sm">Enhanced</td>
                        <td className="py-3 px-4 text-center text-sm font-medium">Top Priority</td>
                        <td className="py-3 px-4 text-center text-sm font-medium">Premium</td>
                      </tr>
                      <tr className="border-b">
                        <td className="py-3 px-4 text-sm text-gray-700">Homepage Showcase</td>
                        <td className="py-3 px-4 text-center text-sm">-</td>
                        <td className="py-3 px-4 text-center text-sm">-</td>
                        <td className="py-3 px-4 text-center text-sm font-medium">14 days</td>
                        <td className="py-3 px-4 text-center text-sm font-medium">30 days</td>
                      </tr>
                      <tr className="border-b">
                        <td className="py-3 px-4 text-sm text-gray-700">Social Media Promotion</td>
                        <td className="py-3 px-4 text-center text-sm">-</td>
                        <td className="py-3 px-4 text-center text-sm">Basic</td>
                        <td className="py-3 px-4 text-center text-sm font-medium">Advanced</td>
                        <td className="py-3 px-4 text-center text-sm font-medium">Campaign</td>
                      </tr>
                    </tbody>
                  </table>
                </div>
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
                          {promotionTiers.find(t => t.id === selectedPromotion)?.name}
                        </span>
                        <span className="ml-2 text-purple-600 font-medium">
                          ({promotionTiers.find(t => t.id === selectedPromotion)?.price})
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
