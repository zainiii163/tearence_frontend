import React, { useState } from 'react';
import { 
  FaTimes, 
  FaUpload, 
  FaDollarSign, 
  FaStar, 
  FaCrown,
  FaGem,
  FaRocket,
  FaCheck,
  FaArrowRight,
  FaFlag,
  FaMapMarkerAlt,
  FaTag,
  FaVideo,
  FaCamera,
  FaShieldAlt,
  FaTrophy
} from 'react-icons/fa';

const PremiumPostingForm = ({ isOpen, onClose }) => {
  const [formData, setFormData] = useState({
    title: '',
    category: '',
    country: '',
    city: '',
    price: '',
    description: '',
    images: [],
    videoLink: '',
    contactName: '',
    contactEmail: '',
    contactPhone: '',
    website: ''
  });

  const [selectedUpsell, setSelectedUpsell] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [currentStep, setCurrentStep] = useState(1);

  const categories = [
    'Property', 'Cars & Vehicles', 'Jobs & Services', 'Business Opportunities',
    'Electronics', 'Fashion & Beauty', 'Travel & Experiences', 'Events & Tickets',
    'Pets & Animals', 'Home & Garden', 'Health & Wellness', 'Education & Courses'
  ];

  const countries = [
    { value: 'us', label: 'United States', flag: '🇺🇸' },
    { value: 'uk', label: 'United Kingdom', flag: '🇬🇧' },
    { value: 'france', label: 'France', flag: '🇫🇷' },
    { value: 'germany', label: 'Germany', flag: '🇩🇪' },
    { value: 'italy', label: 'Italy', flag: '🇮🇹' },
    { value: 'spain', label: 'Spain', flag: '🇪🇸' },
    { value: 'japan', label: 'Japan', flag: '🇯🇵' },
    { value: 'china', label: 'China', flag: '🇨🇳' },
    { value: 'singapore', label: 'Singapore', flag: '🇸🇬' },
    { value: 'australia', label: 'Australia', flag: '🇦🇺' },
    { value: 'canada', label: 'Canada', flag: '🇨🇦' },
    { value: 'uae', label: 'United Arab Emirates', flag: '🇦🇪' }
  ];

  const upsellOptions = [
    {
      id: 'promoted',
      name: 'Promoted',
      tier: 'Basic',
      price: 29.99,
      priceDisplay: '$29.99',
      icon: FaStar,
      color: 'from-blue-500 to-cyan-500',
      bgColor: 'from-blue-50 to-cyan-50',
      borderColor: 'border-blue-300',
      benefits: [
        'Highlighted card design',
        'Appears above standard listings',
        'Promoted badge on listing',
        '2× more visibility than standard',
        'Enhanced search ranking'
      ],
      features: {
        visibility: '2x Standard',
        placement: 'Above Standard Listings',
        email: false,
        social: false,
        badge: 'Promoted'
      }
    },
    {
      id: 'featured',
      name: 'Featured',
      tier: 'Popular',
      price: 59.99,
      priceDisplay: '$59.99',
      icon: FaGem,
      color: 'from-purple-500 to-pink-500',
      bgColor: 'from-purple-50 to-pink-50',
      borderColor: 'border-purple-300',
      isPopular: true,
      benefits: [
        'Top placement in category pages',
        'Larger, premium advert card',
        'Priority in all search results',
        'Featured in weekly "Top Featured Ads" email',
        'Featured badge with gold accent',
        '4× more visibility on average'
      ],
      features: {
        visibility: '4x Standard',
        placement: 'Top of Category Pages',
        email: true,
        social: false,
        badge: 'Featured'
      }
    },
    {
      id: 'sponsored',
      name: 'Sponsored',
      tier: 'Premium',
      price: 99.99,
      priceDisplay: '$99.99',
      icon: FaRocket,
      color: 'from-yellow-400 to-orange-500',
      bgColor: 'from-yellow-50 to-orange-50',
      borderColor: 'border-orange-300',
      isPremium: true,
      benefits: [
        'Premium homepage placement',
        'Featured in homepage slider carousel',
        'Top placement in all categories',
        'Included in social media promotion',
        'Sponsored badge with premium styling',
        'Maximum platform visibility (10x)',
        'Dedicated account support'
      ],
      features: {
        visibility: '10x Standard',
        placement: 'Homepage & Premium',
        email: true,
        social: true,
        badge: 'Sponsored'
      }
    }
  ];

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleImageUpload = (e) => {
    const files = Array.from(e.target.files);
    setFormData(prev => ({ ...prev, images: [...prev.images, ...files] }));
  };

  const handleNextStep = () => {
    if (currentStep < 3) {
      setCurrentStep(currentStep + 1);
    }
  };

  const handlePrevStep = () => {
    if (currentStep > 1) {
      setCurrentStep(currentStep - 1);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);

    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 2000));
      
      const submissionData = {
        ...formData,
        upsellTier: selectedUpsell,
        submittedAt: new Date().toISOString()
      };

      console.log('Premium advert submission:', submissionData);
      
      // Show success message
      alert(`Your ${selectedUpsell ? selectedUpsell.charAt(0).toUpperCase() + selectedUpsell.slice(1) : 'standard'} advert has been submitted successfully!`);
      
      // Reset form
      setFormData({
        title: '',
        category: '',
        country: '',
        city: '',
        price: '',
        description: '',
        images: [],
        videoLink: '',
        contactName: '',
        contactEmail: '',
        contactPhone: '',
        website: ''
      });
      setSelectedUpsell('');
      setCurrentStep(1);
      onClose();
    } catch (error) {
      alert('Failed to submit advert. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  const getTotalPrice = () => {
    const upsellPrice = selectedUpsell ? upsellOptions.find(option => option.id === selectedUpsell)?.price || 0 : 0;
    return upsellPrice;
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      <div
        className="absolute inset-0 bg-black/60 backdrop-blur-sm"
        onClick={onClose}
      />
      <div className="relative bg-white rounded-3xl shadow-2xl max-w-4xl w-full max-h-[90vh] overflow-y-auto">
        {/* Header */}
        <div className="sticky top-0 bg-gradient-to-r from-purple-600 to-blue-600 text-white px-8 py-6 rounded-t-3xl z-10">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-2xl font-bold">Post Featured Advert</h2>
              <p className="text-purple-100">Reach millions of potential customers worldwide</p>
            </div>
            <button
              onClick={onClose}
              className="p-3 hover:bg-white/20 rounded-full transition-colors"
            >
              <FaTimes className="h-6 w-6" />
            </button>
          </div>

          {/* Progress Indicator */}
          <div className="flex items-center space-x-4 mt-4">
            {[1, 2, 3].map((step) => (
              <div key={step} className="flex items-center">
                <div className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-bold transition-colors ${
                  currentStep >= step 
                    ? 'bg-white text-purple-600' 
                    : 'bg-white/20 text-white'
                }`}>
                  {step}
                </div>
                {step < 3 && (
                  <div className={`w-16 h-1 transition-colors ${
                    currentStep > step ? 'bg-white' : 'bg-white/20'
                  }`} />
                )}
              </div>
            ))}
          </div>
        </div>

        <form onSubmit={handleSubmit} className="p-8">
          {/* Step 1: Basic Information */}
          {currentStep === 1 && (
            <div className="space-y-6">
              <div>
                <h3 className="text-xl font-bold text-gray-900 mb-4">Basic Information</h3>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Advert Title *
                    </label>
                    <input
                      type="text"
                      name="title"
                      value={formData.title}
                      onChange={handleInputChange}
                      required
                      className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                      placeholder="Enter a compelling title for your advert..."
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Category *
                    </label>
                    <select
                      name="category"
                      value={formData.category}
                      onChange={handleInputChange}
                      required
                      className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                    >
                      <option value="">Select a category</option>
                      {categories.map(cat => (
                        <option key={cat} value={cat}>{cat}</option>
                      ))}
                    </select>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Country *
                    </label>
                    <select
                      name="country"
                      value={formData.country}
                      onChange={handleInputChange}
                      required
                      className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                    >
                      <option value="">Select country</option>
                      {countries.map(country => (
                        <option key={country.value} value={country.value}>
                          {country.flag} {country.label}
                        </option>
                      ))}
                    </select>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      City *
                    </label>
                    <input
                      type="text"
                      name="city"
                      value={formData.city}
                      onChange={handleInputChange}
                      required
                      className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                      placeholder="Enter city"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Price *
                    </label>
                    <div className="relative">
                      <FaDollarSign className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400 h-5 w-5" />
                      <input
                        type="text"
                        name="price"
                        value={formData.price}
                        onChange={handleInputChange}
                        required
                        className="w-full pl-12 pr-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                        placeholder="Enter price"
                      />
                    </div>
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Description *
                  </label>
                  <textarea
                    name="description"
                    value={formData.description}
                    onChange={handleInputChange}
                    required
                    rows={6}
                    className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                    placeholder="Describe your advert in detail..."
                  />
                </div>
              </div>
            </div>
          )}

          {/* Step 2: Media */}
          {currentStep === 2 && (
            <div className="space-y-6">
              <div>
                <h3 className="text-xl font-bold text-gray-900 mb-4">Media</h3>
                
                <div className="space-y-6">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Upload Images *
                    </label>
                    <div className="border-2 border-dashed border-gray-300 rounded-xl p-8 text-center hover:border-purple-400 transition-colors">
                      <FaCamera className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                      <p className="text-gray-600 mb-2">Click to upload or drag and drop</p>
                      <p className="text-sm text-gray-500">PNG, JPG, GIF up to 10MB</p>
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
                        className="mt-4 px-6 py-3 bg-purple-600 text-white rounded-xl hover:bg-purple-700 cursor-pointer transition-colors"
                      >
                        Select Images
                      </label>
                    </div>
                    {formData.images.length > 0 && (
                      <div className="mt-4">
                        <p className="text-sm text-gray-600 mb-2">
                          {formData.images.length} image(s) selected
                        </p>
                      </div>
                    )}
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Video Link (Optional)
                    </label>
                    <div className="relative">
                      <FaVideo className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400 h-5 w-5" />
                      <input
                        type="url"
                        name="videoLink"
                        value={formData.videoLink}
                        onChange={handleInputChange}
                        className="w-full pl-12 pr-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                        placeholder="https://youtube.com/watch?v=..."
                      />
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Step 3: Contact & Upsell */}
          {currentStep === 3 && (
            <div className="space-y-6">
              {/* Contact Information */}
              <div>
                <h3 className="text-xl font-bold text-gray-900 mb-4">Contact Information</h3>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Contact Name *
                    </label>
                    <input
                      type="text"
                      name="contactName"
                      value={formData.contactName}
                      onChange={handleInputChange}
                      required
                      className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                      placeholder="Your full name"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Contact Email *
                    </label>
                    <input
                      type="email"
                      name="contactEmail"
                      value={formData.contactEmail}
                      onChange={handleInputChange}
                      required
                      className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                      placeholder="your@email.com"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Contact Phone
                    </label>
                    <input
                      type="tel"
                      name="contactPhone"
                      value={formData.contactPhone}
                      onChange={handleInputChange}
                      className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                      placeholder="+1 (555) 123-4567"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Website
                    </label>
                    <input
                      type="url"
                      name="website"
                      value={formData.website}
                      onChange={handleInputChange}
                      className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                      placeholder="https://yourwebsite.com"
                    />
                  </div>
                </div>
              </div>

              {/* Upsell Options */}
              <div>
                <h3 className="text-xl font-bold text-gray-900 mb-4">Boost Your Visibility</h3>
                <p className="text-gray-600 mb-6">Choose how you want to promote your advert</p>
                
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                  {upsellOptions.map((option) => {
                    const Icon = option.icon;
                    const isSelected = selectedUpsell === option.id;
                    
                    return (
                      <div
                        key={option.id}
                        onClick={() => setSelectedUpsell(option.id)}
                        className={`relative rounded-2xl border-2 p-6 cursor-pointer transition-all duration-300 hover:shadow-xl ${
                          isSelected
                            ? `${option.borderColor} ${option.bgColor} shadow-lg scale-[1.02]`
                            : 'border-gray-200 bg-white hover:border-gray-300'
                        }`}
                      >
                        {/* Popular Badge */}
                        {option.isPopular && (
                          <div className="absolute -top-3 left-1/2 transform -translate-x-1/2">
                            <div className="bg-gradient-to-r from-purple-500 to-pink-500 text-white px-4 py-1 rounded-full text-xs font-bold shadow-lg">
                              MOST POPULAR
                            </div>
                          </div>
                        )}
                        
                        {/* Premium Badge */}
                        {option.isPremium && (
                          <div className="absolute -top-3 left-1/2 transform -translate-x-1/2">
                            <div className="bg-gradient-to-r from-yellow-400 to-orange-500 text-white px-4 py-1 rounded-full text-xs font-bold shadow-lg flex items-center space-x-1">
                              <FaTrophy className="h-3 w-3" />
                              <span>PREMIUM</span>
                            </div>
                          </div>
                        )}

                        {/* Selection Indicator */}
                        {isSelected && (
                          <div className="absolute top-4 right-4 h-8 w-8 rounded-full bg-purple-500 flex items-center justify-center shadow-lg">
                            <FaCheck className="h-4 w-4 text-white" />
                          </div>
                        )}

                        {/* Content */}
                        <div className="text-center space-y-4">
                          {/* Icon */}
                          <div className={`w-16 h-16 rounded-2xl flex items-center justify-center mx-auto ${
                            isSelected 
                              ? `bg-gradient-to-br ${option.color} text-white shadow-lg` 
                              : 'bg-gray-100 text-gray-600'
                          }`}>
                            <Icon className="h-8 w-8" />
                          </div>

                          {/* Name & Price */}
                          <div>
                            <h4 className="text-lg font-bold text-gray-900 mb-2">{option.name}</h4>
                            <div className="text-3xl font-bold text-purple-600 mb-1">{option.priceDisplay}</div>
                            <div className="text-sm text-gray-500">one-time payment</div>
                          </div>

                          {/* Benefits */}
                          <div className="space-y-2 text-left">
                            {option.benefits.map((benefit, index) => (
                              <div key={index} className="flex items-start gap-2 text-sm text-gray-600">
                                <FaCheck className="h-4 w-4 text-green-500 mt-0.5 flex-shrink-0" />
                                <span>{benefit}</span>
                              </div>
                            ))}
                          </div>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>

              {/* Order Summary */}
              <div className="bg-gradient-to-r from-purple-50 to-blue-50 rounded-2xl p-6">
                <h4 className="text-lg font-bold text-gray-900 mb-4">Order Summary</h4>
                <div className="space-y-2">
                  <div className="flex justify-between">
                    <span className="text-gray-600">Standard Listing:</span>
                    <span className="font-medium">Free</span>
                  </div>
                  {selectedUpsell && (
                    <div className="flex justify-between">
                      <span className="text-gray-600">
                        {upsellOptions.find(option => option.id === selectedUpsell)?.name} Upgrade:
                      </span>
                      <span className="font-bold text-purple-600">
                        ${upsellOptions.find(option => option.id === selectedUpsell)?.priceDisplay}
                      </span>
                    </div>
                  )}
                  <div className="border-t border-gray-300 pt-2">
                    <div className="flex justify-between">
                      <span className="text-lg font-bold text-gray-900">Total:</span>
                      <span className="text-2xl font-bold text-purple-600">
                        ${getTotalPrice().toFixed(2)}
                      </span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Navigation Buttons */}
          <div className="flex justify-between items-center pt-8 mt-8 border-t border-gray-200">
            <button
              type="button"
              onClick={currentStep === 1 ? onClose : handlePrevStep}
              className="px-6 py-3 border border-gray-300 rounded-xl text-gray-700 hover:bg-gray-50 transition-colors"
            >
              {currentStep === 1 ? 'Cancel' : 'Previous'}
            </button>
            
            {currentStep < 3 ? (
              <button
                type="button"
                onClick={handleNextStep}
                className="px-6 py-3 bg-gradient-to-r from-purple-600 to-blue-600 text-white rounded-xl hover:from-purple-700 hover:to-blue-700 transition-all shadow-lg"
              >
                Continue
                <FaArrowRight className="h-4 w-4 ml-2 inline" />
              </button>
            ) : (
              <button
                type="submit"
                disabled={isSubmitting}
                className="px-8 py-3 bg-gradient-to-r from-green-600 to-blue-600 text-white font-bold rounded-xl hover:from-green-700 hover:to-blue-700 disabled:opacity-50 disabled:cursor-not-allowed transition-all shadow-lg"
              >
                {isSubmitting ? (
                  <>
                    <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white mr-2"></div>
                    Processing...
                  </>
                ) : (
                  <>
                    Submit Featured Advert
                    <FaRocket className="h-4 w-4 ml-2 inline" />
                  </>
                )}
              </button>
            )}
          </div>
        </form>
      </div>
    </div>
  );
};

export default PremiumPostingForm;
