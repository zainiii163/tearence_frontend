import React, { useState } from 'react';
import { 
  FaTimes, 
  FaHeart, 
  FaShare, 
  FaPhone, 
  FaEnvelope, 
  FaGlobe,
  FaMapMarkerAlt,
  FaTag,
  FaEye,
  FaStar,
  FaCheckCircle,
  FaShieldAlt,
  FaCalendarAlt,
  FaCamera,
  FaChevronLeft,
  FaChevronRight
} from 'react-icons/fa';

const QuickViewModal = ({ advert, isOpen, onClose, onSave, onShare }) => {
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const [isSaved, setIsSaved] = useState(false);

  if (!isOpen || !advert) return null;

  const images = advert.images || [advert.image];
  const currentImage = images[currentImageIndex];

  const handleSave = () => {
    setIsSaved(!isSaved);
    if (onSave) onSave(advert);
  };

  const handleShare = () => {
    if (onShare) onShare(advert);
  };

  const handlePreviousImage = () => {
    setCurrentImageIndex(currentImageIndex === 0 ? images.length - 1 : currentImageIndex - 1);
  };

  const handleNextImage = () => {
    setCurrentImageIndex(currentImageIndex === images.length - 1 ? 0 : currentImageIndex + 1);
  };

  const getBadgeColor = (badge) => {
    switch (badge) {
      case 'Sponsored':
        return 'from-yellow-400 to-orange-500';
      case 'Featured':
        return 'from-purple-500 to-pink-500';
      case 'Promoted':
        return 'from-blue-500 to-cyan-500';
      default:
        return 'from-gray-500 to-gray-600';
    }
  };

  const renderRating = (rating) => {
    return (
      <div className="flex items-center space-x-1">
        {[...Array(5)].map((_, i) => (
          <FaStar
            key={i}
            className={`h-4 w-4 ${
              i < Math.floor(rating) 
                ? 'text-yellow-400' 
                : i < rating 
                ? 'text-yellow-200' 
                : 'text-gray-300'
            }`}
          />
        ))}
        <span className="text-sm text-gray-600 ml-1">({rating})</span>
      </div>
    );
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      {/* Backdrop */}
      <div 
        className="absolute inset-0 bg-black/60 backdrop-blur-sm"
        onClick={onClose}
      />

      {/* Modal Content */}
      <div className="relative bg-white rounded-3xl shadow-2xl max-w-6xl w-full max-h-[90vh] overflow-hidden">
        {/* Header */}
        <div className="bg-gradient-to-r from-purple-600 to-blue-600 text-white p-6">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <div className={`px-4 py-2 rounded-full text-sm font-bold bg-gradient-to-r ${getBadgeColor(advert.badge)} text-white`}>
                {advert.badge}
              </div>
              <div>
                <h2 className="text-2xl font-bold">{advert.title}</h2>
                <p className="text-purple-100">Quick View - Premium Listing</p>
              </div>
            </div>
            <button
              onClick={onClose}
              className="p-3 bg-white/20 rounded-full hover:bg-white/30 transition-colors"
            >
              <FaTimes className="h-6 w-6" />
            </button>
          </div>
        </div>

        <div className="flex flex-col lg:flex-row max-h-[calc(90vh-120px)] overflow-y-auto">
          {/* Image Section */}
          <div className="lg:w-1/2 bg-gray-50">
            <div className="relative">
              {/* Main Image */}
              <div className="relative h-96 lg:h-full overflow-hidden">
                <img
                  src={currentImage}
                  alt={advert.title}
                  className="w-full h-full object-cover"
                />

                {/* Image Navigation */}
                {images.length > 1 && (
                  <>
                    <button
                      onClick={handlePreviousImage}
                      className="absolute left-4 top-1/2 transform -translate-y-1/2 p-2 bg-white/80 backdrop-blur-sm rounded-full hover:bg-white transition-all shadow-lg"
                    >
                      <FaChevronLeft className="h-5 w-5 text-gray-700" />
                    </button>
                    <button
                      onClick={handleNextImage}
                      className="absolute right-4 top-1/2 transform -translate-y-1/2 p-2 bg-white/80 backdrop-blur-sm rounded-full hover:bg-white transition-all shadow-lg"
                    >
                      <FaChevronRight className="h-5 w-5 text-gray-700" />
                    </button>
                  </>
                )}

                {/* Image Counter */}
                {images.length > 1 && (
                  <div className="absolute top-4 right-4 bg-black/70 text-white px-3 py-1 rounded-full text-sm">
                    {currentImageIndex + 1} / {images.length}
                  </div>
                )}

                {/* Quick Actions */}
                <div className="absolute top-4 left-4 flex space-x-2">
                  <button
                    onClick={handleSave}
                    className={`p-3 backdrop-blur-sm rounded-full transition-all shadow-lg ${
                      isSaved 
                        ? 'bg-red-500 text-white hover:bg-red-600' 
                        : 'bg-white/80 text-gray-700 hover:bg-white'
                    }`}
                  >
                    <FaHeart className="h-5 w-5" />
                  </button>
                  <button
                    onClick={handleShare}
                    className="p-3 bg-white/80 backdrop-blur-sm rounded-full hover:bg-white transition-all shadow-lg"
                  >
                    <FaShare className="h-5 w-5 text-gray-700" />
                  </button>
                </div>
              </div>

              {/* Image Thumbnails */}
              {images.length > 1 && (
                <div className="p-4 bg-white border-t">
                  <div className="flex space-x-2 overflow-x-auto">
                    {images.map((image, index) => (
                      <button
                        key={index}
                        onClick={() => setCurrentImageIndex(index)}
                        className={`flex-shrink-0 w-20 h-20 rounded-lg overflow-hidden border-2 transition-all ${
                          index === currentImageIndex 
                            ? 'border-purple-500 scale-105' 
                            : 'border-gray-300 hover:border-gray-400'
                        }`}
                      >
                        <img
                          src={image}
                          alt={`${advert.title} ${index + 1}`}
                          className="w-full h-full object-cover"
                        />
                      </button>
                    ))}
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* Details Section */}
          <div className="lg:w-1/2 p-6 space-y-6">
            {/* Price and Category */}
            <div className="flex items-start justify-between">
              <div>
                <div className="text-3xl font-bold text-purple-600 mb-2">
                  {advert.price}
                </div>
                {advert.originalPrice && (
                  <div className="text-lg text-gray-500 line-through">
                    {advert.originalPrice}
                  </div>
                )}
              </div>
              <div className="flex items-center space-x-2 bg-purple-100 text-purple-700 px-3 py-2 rounded-full">
                <FaTag className="h-4 w-4" />
                <span className="font-medium">{advert.category}</span>
              </div>
            </div>

            {/* Location */}
            <div className="flex items-center space-x-3 text-gray-700">
              <span className="text-2xl">{advert.flag}</span>
              <div>
                <div className="font-medium">{advert.location}</div>
                <div className="text-sm text-gray-500">Posted {advert.postedDate || '2 days ago'}</div>
              </div>
            </div>

            {/* Description */}
            <div>
              <h3 className="text-lg font-bold text-gray-900 mb-2">Description</h3>
              <p className="text-gray-600 leading-relaxed">
                {advert.description || 'Premium featured listing with exceptional visibility and reach. This advert has been carefully selected and promoted to ensure maximum exposure to potential buyers worldwide.'}
              </p>
            </div>

            {/* Seller Information */}
            <div className="bg-gray-50 rounded-xl p-4">
              <h3 className="text-lg font-bold text-gray-900 mb-3">Seller Information</h3>
              <div className="flex items-start space-x-4">
                <img
                  src={advert.sellerAvatar || `https://ui-avatars.com/api/?name=${advert.seller}&background=random`}
                  alt={advert.seller}
                  className="h-16 w-16 rounded-full border-3 border-white shadow-lg"
                />
                <div className="flex-1">
                  <div className="flex items-center space-x-2 mb-1">
                    <h4 className="font-bold text-gray-900">{advert.seller}</h4>
                    {advert.verified && (
                      <div className="flex items-center space-x-1 bg-green-100 text-green-700 px-2 py-1 rounded-full text-xs font-medium">
                        <FaCheckCircle className="h-3 w-3" />
                        <span>Verified</span>
                      </div>
                    )}
                  </div>
                  {advert.rating && renderRating(advert.rating)}
                  <div className="text-sm text-gray-600 mt-1">
                    Member since {advert.memberSince || '2020'}
                  </div>
                </div>
              </div>
            </div>

            {/* Features */}
            <div>
              <h3 className="text-lg font-bold text-gray-900 mb-3">Features</h3>
              <div className="grid grid-cols-2 gap-3">
                <div className="flex items-center space-x-2 text-sm text-gray-600">
                  <FaEye className="h-4 w-4 text-purple-500" />
                  <span>{advert.views?.toLocaleString() || '0'} views</span>
                </div>
                <div className="flex items-center space-x-2 text-sm text-gray-600">
                  <FaCalendarAlt className="h-4 w-4 text-blue-500" />
                  <span>Posted {advert.postedDate || '2 days ago'}</span>
                </div>
                <div className="flex items-center space-x-2 text-sm text-gray-600">
                  <FaCamera className="h-4 w-4 text-green-500" />
                  <span>{images.length} photos</span>
                </div>
                <div className="flex items-center space-x-2 text-sm text-gray-600">
                  <FaShieldAlt className="h-4 w-4 text-orange-500" />
                  <span>Premium Listing</span>
                </div>
              </div>
            </div>

            {/* Contact Options */}
            <div>
              <h3 className="text-lg font-bold text-gray-900 mb-3">Contact Options</h3>
              <div className="space-y-3">
                {advert.phone && (
                  <button className="w-full flex items-center justify-center space-x-2 p-3 bg-green-500 text-white rounded-xl hover:bg-green-600 transition-colors">
                    <FaPhone className="h-5 w-5" />
                    <span className="font-medium">Call Seller</span>
                  </button>
                )}
                <button className="w-full flex items-center justify-center space-x-2 p-3 bg-blue-500 text-white rounded-xl hover:bg-blue-600 transition-colors">
                  <FaEnvelope className="h-5 w-5" />
                  <span className="font-medium">Send Message</span>
                </button>
                {advert.website && (
                  <button className="w-full flex items-center justify-center space-x-2 p-3 border border-gray-300 text-gray-700 rounded-xl hover:bg-gray-50 transition-colors">
                    <FaGlobe className="h-5 w-5" />
                    <span className="font-medium">Visit Website</span>
                  </button>
                )}
              </div>
            </div>

            {/* Stats */}
            <div className="bg-gradient-to-r from-purple-50 to-blue-50 rounded-xl p-4">
              <div className="grid grid-cols-3 gap-4 text-center">
                <div>
                  <div className="text-2xl font-bold text-purple-600">
                    {advert.views?.toLocaleString() || '0'}
                  </div>
                  <div className="text-xs text-gray-600">Views</div>
                </div>
                <div>
                  <div className="text-2xl font-bold text-blue-600">
                    {advert.responses || 24}
                  </div>
                  <div className="text-xs text-gray-600">Responses</div>
                </div>
                <div>
                  <div className="text-2xl font-bold text-green-600">
                    {advert.responseRate || '95%'}
                  </div>
                  <div className="text-xs text-gray-600">Response Rate</div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default QuickViewModal;
