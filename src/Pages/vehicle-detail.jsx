import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { ArrowLeft, Heart, MapPin, Phone, Mail, Calendar, Fuel, Settings, Users, X } from 'lucide-react';
import UnifiedNavbar from '../Component/UnifiedNavbar';
import { getVehicle, contactSeller } from '../services/vehiclesAPI';

const VehicleDetailPage = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [vehicle, setVehicle] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [showContactModal, setShowContactModal] = useState(false);
  const [contactForm, setContactForm] = useState({
    name: '',
    email: '',
    phone: '',
    message: ''
  });
  const [contactError, setContactError] = useState('');
  const [contactSuccess, setContactSuccess] = useState(false);

  useEffect(() => {
    const loadVehicle = async () => {
      try {
        const response = await getVehicle(id);
        const vehicleData = response.data?.data || response.data;
        setVehicle(vehicleData);
      } catch (err) {
        setError('Failed to load vehicle details');
      } finally {
        setLoading(false);
      }
    };
    loadVehicle();
  }, [id]);

  const handleContactSubmit = async (e) => {
    e.preventDefault();
    setContactError('');
    setContactSuccess(false);

    if (!contactForm.name || !contactForm.email || !contactForm.message) {
      setContactError('Please fill in all required fields');
      return;
    }

    try {
      await contactSeller(id, contactForm);
      setContactSuccess(true);
      setTimeout(() => {
        setShowContactModal(false);
        setContactSuccess(false);
        setContactForm({ name: '', email: '', phone: '', message: '' });
      }, 2000);
    } catch (err) {
      setContactError('Failed to send message. Please try again.');
    }
  };

  const getImageUrl = (imagePath) => {
    if (!imagePath || imagePath === 'null' || imagePath === '') return '/img/NoImage.png';
    if (imagePath.startsWith('http')) return imagePath;
    return `${process.env.REACT_APP_STORAGE_URL || 'https://api.worldwideadverts.info/storage'}/${imagePath}`;
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50">
        <UnifiedNavbar />
        <div className="flex items-center justify-center h-screen">
          <div className="text-gray-600">Loading...</div>
        </div>
      </div>
    );
  }

  if (error || !vehicle) {
    return (
      <div className="min-h-screen bg-gray-50">
        <UnifiedNavbar />
        <div className="flex items-center justify-center h-screen">
          <div className="text-red-600">{error || 'Vehicle not found'}</div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <UnifiedNavbar />
      <div className="page-container py-8">
        <button
          onClick={() => navigate('/vehicles')}
          className="flex items-center text-gray-600 hover:text-gray-900 mb-6"
        >
          <ArrowLeft className="w-5 h-5 mr-2" />
          Back to Vehicles
        </button>

        <div className="bg-white rounded-xl shadow-lg overflow-hidden">
          <div className="flex flex-col md:flex-row">
            {/* Image */}
            <div className="md:w-1/2">
              <img
                src={getImageUrl(vehicle.main_image)}
                alt={vehicle.title}
                className="w-full h-96 object-cover"
                onError={(e) => {
                  if (!e.target.src.includes('NoImage.png')) {
                    e.target.src = '/img/NoImage.png';
                  }
                }}
              />
            </div>

            {/* Details */}
            <div className="md:w-1/2 p-8">
              <h1 className="text-3xl font-bold text-gray-900 mb-4">{vehicle.title}</h1>
              <div className="text-3xl font-bold text-red-600 mb-6">
                ${vehicle.price ? vehicle.price.toLocaleString() : '0'}
              </div>

              <div className="grid grid-cols-2 gap-4 mb-6">
                {vehicle.year && (
                  <div className="flex items-center text-gray-600">
                    <Calendar className="w-5 h-5 mr-2" />
                    {vehicle.year}
                  </div>
                )}
                {vehicle.mileage && (
                  <div className="flex items-center text-gray-600">
                    <Settings className="w-5 h-5 mr-2" />
                    {vehicle.mileage.toLocaleString()} km
                  </div>
                )}
                {vehicle.fuel_type && (
                  <div className="flex items-center text-gray-600">
                    <Fuel className="w-5 h-5 mr-2" />
                    {vehicle.fuel_type}
                  </div>
                )}
                {vehicle.transmission && (
                  <div className="flex items-center text-gray-600">
                    <Settings className="w-5 h-5 mr-2" />
                    {vehicle.transmission}
                  </div>
                )}
                {vehicle.doors && (
                  <div className="flex items-center text-gray-600">
                    <Users className="w-5 h-5 mr-2" />
                    {vehicle.doors} doors
                  </div>
                )}
              </div>

              {vehicle.description && (
                <div className="mb-6">
                  <h2 className="text-lg font-semibold text-gray-900 mb-2">Description</h2>
                  <p className="text-gray-600">{vehicle.description}</p>
                </div>
              )}

              {vehicle.country && vehicle.city && (
                <div className="flex items-center text-gray-600 mb-6">
                  <MapPin className="w-5 h-5 mr-2" />
                  {vehicle.city}, {vehicle.country}
                </div>
              )}

              <div className="flex gap-4">
                <button
                  onClick={() => setShowContactModal(true)}
                  className="flex-1 bg-red-600 text-white py-3 px-6 rounded-lg hover:bg-red-700 transition-colors"
                >
                  Contact Seller
                </button>
                <button className="p-3 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors">
                  <Heart className="w-5 h-5 text-gray-600" />
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* Contact Modal */}
        {showContactModal && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
            <div className="bg-white rounded-xl shadow-lg max-w-md w-full mx-4">
              <div className="flex items-center justify-between p-6 border-b">
                <h2 className="text-xl font-bold text-gray-900">Contact Seller</h2>
                <button
                  onClick={() => {
                    setShowContactModal(false);
                    setContactError('');
                    setContactSuccess(false);
                  }}
                  className="text-gray-400 hover:text-gray-600"
                >
                  <X className="w-6 h-6" />
                </button>
              </div>

              <form onSubmit={handleContactSubmit} className="p-6">
                {contactError && (
                  <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg mb-4">
                    {contactError}
                  </div>
                )}

                {contactSuccess && (
                  <div className="bg-green-50 border border-green-200 text-green-700 px-4 py-3 rounded-lg mb-4">
                    Message sent successfully!
                  </div>
                )}

                <div className="mb-4">
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Name *
                  </label>
                  <input
                    type="text"
                    value={contactForm.name}
                    onChange={(e) => setContactForm({ ...contactForm, name: e.target.value })}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-transparent"
                    required
                  />
                </div>

                <div className="mb-4">
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Email *
                  </label>
                  <input
                    type="email"
                    value={contactForm.email}
                    onChange={(e) => setContactForm({ ...contactForm, email: e.target.value })}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-transparent"
                    required
                  />
                </div>

                <div className="mb-4">
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Phone
                  </label>
                  <input
                    type="tel"
                    value={contactForm.phone}
                    onChange={(e) => setContactForm({ ...contactForm, phone: e.target.value })}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-transparent"
                  />
                </div>

                <div className="mb-6">
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Message *
                  </label>
                  <textarea
                    value={contactForm.message}
                    onChange={(e) => setContactForm({ ...contactForm, message: e.target.value })}
                    rows="4"
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-transparent"
                    required
                  />
                </div>

                <div className="flex gap-4">
                  <button
                    type="button"
                    onClick={() => {
                      setShowContactModal(false);
                      setContactError('');
                      setContactSuccess(false);
                    }}
                    className="flex-1 px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="flex-1 bg-red-600 text-white px-4 py-2 rounded-lg hover:bg-red-700 transition-colors"
                  >
                    Send Message
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default VehicleDetailPage;
