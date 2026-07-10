import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { 
  FaHeart, 
  FaRegHeart, 
  FaEye, 
  FaPhone, 
  FaEnvelope, 
  FaMapMarkerAlt,
  FaCalendarAlt,
  FaTachometerAlt,
  FaGasPump,
  FaCog,
  FaTimes
} from 'react-icons/fa';
import { incrementVehicleViews, incrementVehicleClicks, toggleVehicleFavourite, checkVehicleFavourited } from '../../services/vehiclesAPI';

const VehicleCard = ({ vehicle, featured = false }) => {
  const [isFavourited, setIsFavourited] = useState(false);
  const [imageLoading, setImageLoading] = useState(true);
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const [showContactModal, setShowContactModal] = useState(false);
  const [contactForm, setContactForm] = useState({
    name: '',
    email: '',
    phone: '',
    message: ''
  });
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Check if vehicle is favourited on mount
  React.useEffect(() => {
    const checkFavourite = async () => {
      try {
        const response = await checkVehicleFavourited(vehicle.id);
        if (response.data) {
          setIsFavourited(response.data.is_favourited);
        }
      } catch (error) {
        console.error('Error checking favourite status:', error);
        // Don't set favourite state on error, let user try manually
      }
    };
    checkFavourite();
  }, [vehicle.id]);

  const handleImageClick = async () => {
    try {
      await incrementVehicleViews(vehicle.id);
      // Navigate to vehicle details page
      window.location.href = `/vehicles/${vehicle.id}`;
    } catch (error) {
      console.error('Error incrementing views:', error);
      // Still navigate even if tracking fails
      window.location.href = `/vehicles/${vehicle.id}`;
    }
  };

  const handleContactClick = async () => {
    try {
      await incrementVehicleClicks(vehicle.id);
      setShowContactModal(true);
    } catch (error) {
      console.error('Error incrementing clicks:', error);
      setShowContactModal(true); // Still show modal even if click tracking fails
    }
  };

  const handleContactSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    
    try {
      // Import and use the real API
      const { submitVehicleEnquiry } = await import('../../services/vehiclesAPI');
      await submitVehicleEnquiry(vehicle.id, contactForm);
      
      alert('Message sent successfully! The seller will contact you soon.');
      setShowContactModal(false);
      setContactForm({ name: '', email: '', phone: '', message: '' });
    } catch (error) {
      console.error('Error sending message:', error);
      alert('Failed to send message. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleContactFormChange = (e) => {
    setContactForm({
      ...contactForm,
      [e.target.name]: e.target.value
    });
  };

  const handleFavouriteToggle = async (e) => {
    e.stopPropagation();
    
    // Check if user is logged in
    const token = localStorage.getItem('token');
    if (!token) {
      alert('Please login to save vehicles as favourites');
      return;
    }
    
    try {
      await toggleVehicleFavourite(vehicle.id);
      const newFavState = !isFavourited;
      setIsFavourited(newFavState);
    } catch (error) {
      console.error('Error toggling favourite:', error);
      alert('Failed to update favourite status. Please try again.');
    }
  };

  const handleImageError = (e) => {
    // Try placeholder as fallback
    if (!e.target.src.includes('placeholder.png')) {
      e.target.src = 'https://api.worldwideadverts.info/placeholder.png';
    } else {
      e.target.src = '/img/NoImage.png';
    }
  };

  const allImages = [vehicle.main_image, ...(vehicle.additional_images || [])]
    .filter(Boolean)
    .filter(img => img && img !== 'https://api.worldwideadverts.info/placeholder.png' && img !== '/img/NoImage.png');
  
  const nextImage = () => {
    setCurrentImageIndex((prev) => (prev + 1) % allImages.length);
  };

  const prevImage = () => {
    setCurrentImageIndex((prev) => (prev - 1 + allImages.length) % allImages.length);
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      whileHover={{ y: -5 }}
      className={`bg-white rounded-xl shadow-lg overflow-hidden hover:shadow-xl transition-all duration-300 ${
        featured ? 'ring-2 ring-indigo-500' : ''
      }`}
    >
      {/* Featured Badge */}
      {featured && (
        <div className="absolute top-4 left-4 z-10">
          <span className="bg-indigo-600 text-white px-3 py-1 rounded-full text-xs font-semibold">
            Featured
          </span>
        </div>
      )}

      {/* Favourite Button */}
      <button
        onClick={handleFavouriteToggle}
        className="absolute top-4 right-4 z-10 bg-white rounded-full p-2 shadow-md hover:shadow-lg transition-shadow"
      >
        {isFavourited ? (
          <FaHeart className="text-red-500 text-lg" />
        ) : (
          <FaRegHeart className="text-gray-400 text-lg hover:text-red-500 transition-colors" />
        )}
      </button>

      {/* Image Gallery */}
      <div className="relative h-48 bg-gray-100">
        {allImages.length > 0 ? (
          <>
            <img
              src={allImages[currentImageIndex]}
              alt={vehicle.title}
              onClick={handleImageClick}
              onLoad={() => setImageLoading(false)}
              onError={handleImageError}
              className={`w-full h-full object-cover cursor-pointer transition-opacity duration-300 ${
                imageLoading ? 'opacity-0' : 'opacity-100'
              }`}
            />
            
            {imageLoading && (
              <div className="absolute inset-0 flex items-center justify-center">
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-indigo-600"></div>
              </div>
            )}

            {/* Image Navigation */}
            {allImages.length > 1 && (
              <>
                <button
                  onClick={prevImage}
                  className="absolute left-2 top-1/2 transform -translate-y-1/2 bg-white/80 rounded-full p-1 hover:bg-white transition-colors"
                >
                  <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M12.707 5.293a1 1 0 010 1.414L9.414 10l3.293 3.293a1 1 0 01-1.414 1.414l-4-4a1 1 0 010-1.414l4-4a1 1 0 011.414 0z" clipRule="evenodd" />
                  </svg>
                </button>
                <button
                  onClick={nextImage}
                  className="absolute right-2 top-1/2 transform -translate-y-1/2 bg-white/80 rounded-full p-1 hover:bg-white transition-colors"
                >
                  <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M7.293 14.707a1 1 0 010-1.414L10.586 10 7.293 6.707a1 1 0 011.414-1.414l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414 0z" clipRule="evenodd" />
                  </svg>
                </button>
                
                {/* Image Indicators */}
                <div className="absolute bottom-2 left-1/2 transform -translate-x-1/2 flex space-x-1">
                  {allImages.map((_, index) => (
                    <button
                      key={index}
                      onClick={() => setCurrentImageIndex(index)}
                      className={`w-2 h-2 rounded-full transition-colors ${
                        index === currentImageIndex ? 'bg-white' : 'bg-white/50'
                      }`}
                    />
                  ))}
                </div>
              </>
            )}
          </>
        ) : (
          <div className="w-full h-full flex items-center justify-center bg-gray-200">
            <span className="text-gray-400">No Image</span>
          </div>
        )}

        {/* Views Counter */}
        <div className="absolute bottom-2 left-2 bg-black/50 text-white px-2 py-1 rounded text-xs flex items-center gap-1">
          <FaEye className="w-3 h-3" />
          {vehicle.views || 0}
        </div>
      </div>

      {/* Content */}
      <div className="p-4">
        {/* Title and Price */}
        <div className="mb-3">
          <h3 className="font-semibold text-gray-900 text-lg mb-1 line-clamp-1">
            {vehicle.title}
          </h3>
          {vehicle.tagline && (
            <p className="text-sm text-gray-600 line-clamp-2 mb-2">{vehicle.tagline}</p>
          )}
          <div className="flex items-center justify-between">
            <span className="text-2xl font-bold text-indigo-600">
              ${vehicle.price?.toLocaleString() || '0'}
            </span>
            {vehicle.is_negotiable && (
              <span className="text-sm text-green-600 font-medium">Negotiable</span>
            )}
          </div>
        </div>

        {/* Key Specifications */}
        <div className="grid grid-cols-2 gap-2 mb-3 text-sm">
          <div className="flex items-center text-gray-600">
            <FaCalendarAlt className="w-4 h-4 mr-1" />
            {vehicle.year}
          </div>
          <div className="flex items-center text-gray-600">
            <FaTachometerAlt className="w-4 h-4 mr-1" />
            {vehicle.mileage?.toLocaleString() || '0'} miles
          </div>
          <div className="flex items-center text-gray-600">
            <FaGasPump className="w-4 h-4 mr-1" />
            {vehicle.fuel_type}
          </div>
          <div className="flex items-center text-gray-600">
            <FaCog className="w-4 h-4 mr-1" />
            {vehicle.transmission}
          </div>
        </div>

        {/* Location */}
        <div className="flex items-center text-gray-600 text-sm mb-3">
          <FaMapMarkerAlt className="w-4 h-4 mr-1" />
          {vehicle.city}, {vehicle.country}
        </div>

        {/* Category and Type */}
        <div className="flex items-center justify-between mb-3">
          <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-gray-100 text-gray-800">
            {vehicle.category?.name}
          </span>
          <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
            {vehicle.advert_type?.replace('_', ' ').toUpperCase()}
          </span>
        </div>

        {/* Condition */}
        <div className="mb-3">
          <span className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium ${
            vehicle.condition === 'new' ? 'bg-green-100 text-green-800' :
            vehicle.condition === 'excellent' ? 'bg-blue-100 text-blue-800' :
            vehicle.condition === 'good' ? 'bg-yellow-100 text-yellow-800' :
            'bg-red-100 text-red-800'
          }`}>
            {vehicle.condition?.toUpperCase()}
          </span>
        </div>

        {/* Contact Actions */}
        <div className="flex gap-2 pt-3 border-t">
          <button
            onClick={handleContactClick}
            className="flex-1 bg-indigo-600 text-white py-2 px-3 rounded-lg hover:bg-indigo-700 transition-colors text-sm font-medium flex items-center justify-center gap-1"
          >
            <FaPhone className="w-3 h-3" />
            Contact
          </button>
          <button
            onClick={handleContactClick}
            className="flex-1 bg-gray-100 text-gray-700 py-2 px-3 rounded-lg hover:bg-gray-200 transition-colors text-sm font-medium flex items-center justify-center gap-1"
          >
            <FaEnvelope className="w-3 h-3" />
            Email
          </button>
        </div>

        {/* Stats */}
        <div className="flex items-center justify-between mt-3 pt-3 border-t text-xs text-gray-500">
          <div className="flex items-center gap-3">
            <span className="flex items-center gap-1">
              <FaHeart className="w-3 h-3" />
              {vehicle.saves || 0}
            </span>
            <span className="flex items-center gap-1">
              <FaEye className="w-3 h-3" />
              {vehicle.views || 0}
            </span>
          </div>
          <span>
            Posted {new Date(vehicle.created_at).toLocaleDateString()}
          </span>
        </div>
      </div>

      {/* Contact Modal */}
      {showContactModal && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4"
          onClick={() => setShowContactModal(false)}
        >
          <motion.div
            initial={{ scale: 0.9, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0.9, opacity: 0 }}
            className="bg-white rounded-xl max-w-md w-full p-6"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-xl font-bold text-gray-900">Contact Seller</h3>
              <button
                onClick={() => setShowContactModal(false)}
                className="text-gray-400 hover:text-gray-600 transition-colors"
              >
                <FaTimes className="w-5 h-5" />
              </button>
            </div>

            <div className="mb-4">
              <p className="text-sm text-gray-600 mb-2">Vehicle: {vehicle.title}</p>
              <p className="text-sm text-gray-600">Price: {vehicle.display_price}</p>
            </div>

            <form onSubmit={handleContactSubmit} className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Your Name *
                </label>
                <input
                  type="text"
                  name="name"
                  value={contactForm.name}
                  onChange={handleContactFormChange}
                  required
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                  placeholder="Enter your name"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Email Address *
                </label>
                <input
                  type="email"
                  name="email"
                  value={contactForm.email}
                  onChange={handleContactFormChange}
                  required
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                  placeholder="your@email.com"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Phone Number
                </label>
                <input
                  type="tel"
                  name="phone"
                  value={contactForm.phone}
                  onChange={handleContactFormChange}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                  placeholder="+1 (555) 123-4567"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Message *
                </label>
                <textarea
                  name="message"
                  value={contactForm.message}
                  onChange={handleContactFormChange}
                  required
                  rows={4}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                  placeholder="I'm interested in this vehicle. Please provide more information..."
                />
              </div>

              <div className="flex gap-3 pt-2">
                <button
                  type="button"
                  onClick={() => setShowContactModal(false)}
                  className="flex-1 px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="flex-1 px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {isSubmitting ? 'Sending...' : 'Send Message'}
                </button>
              </div>
            </form>
          </motion.div>
        </motion.div>
      )}
    </motion.div>
  );
};

export default VehicleCard;
