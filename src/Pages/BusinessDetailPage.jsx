import React, { useEffect, useState, useMemo } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { useSelector } from 'react-redux';
import UnifiedNavbar from '../Component/UnifiedNavbar';
import Footer from '../Component/Footer';
import businessService from '../services/BusinessService';
import { FaBuilding, FaMapMarkerAlt, FaPhone, FaEnvelope, FaGlobe, FaUser, FaArrowLeft, FaEdit, FaStar, FaClock } from 'react-icons/fa';
import { motion } from 'framer-motion';
import ChatButton from '../Component/Chat/ChatButton';
import {
  buildListingChatContext,
  resolveSellerId,
  resolveSellerName,
} from '../utils/chatHelpers';
import { resolveStorageUrl } from '../utils/dashboardEditMappers';

const BusinessDetailPage = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { logIn, customerId } = useSelector((store) => store.auth);
  const [business, setBusiness] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  const isOwner = useMemo(() => {
    if (!logIn || !business?.customer_id || customerId == null) return false;
    return String(business.customer_id) === String(customerId);
  }, [logIn, business?.customer_id, customerId]);

  useEffect(() => {
    const fetchBusiness = async () => {
      try {
        setLoading(true);
        console.log('Fetching business with ID:', id);
        const response = await businessService.getBusinessById(id);
        console.log('Business response:', response);
        if (response.data) {
          setBusiness(response.data);
        } else {
          setError('Business not found');
        }
      } catch (err) {
        console.error('Error fetching business:', err);
        console.error('Error response:', err.response?.data);
        setError('Failed to load business details');
      } finally {
        setLoading(false);
      }
    };

    fetchBusiness();
  }, [id]);

  if (loading) {
    return (
      <div>
        <UnifiedNavbar />
        <div className="min-h-screen flex items-center justify-center">
          <div className="inline-block h-12 w-12 animate-spin rounded-full border-4 border-solid border-purple-600 border-r-transparent"></div>
        </div>
        <Footer />
      </div>
    );
  }

  if (error || !business) {
    return (
      <div>
        <UnifiedNavbar />
        <div className="min-h-screen flex items-center justify-center">
          <div className="text-center">
            <p className="text-red-600 text-lg mb-4">{error || 'Business not found'}</p>
            <button
              onClick={() => navigate('/business')}
              className="px-6 py-3 bg-purple-600 text-white rounded-xl hover:bg-purple-700 transition-colors"
            >
              Back to Businesses
            </button>
          </div>
        </div>
        <Footer />
      </div>
    );
  }

  return (
    <div>
      <UnifiedNavbar />
      
      <div className="page-container py-8 sm:py-12">
        {/* Back Button */}
        <motion.div
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          className="mb-8"
        >
          <button
            onClick={() => navigate('/business')}
            className="flex items-center gap-2 text-purple-600 hover:text-purple-700 font-semibold transition-colors"
          >
            <FaArrowLeft />
            Back to Businesses
          </button>
        </motion.div>

        {/* Business Detail Card */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="bg-white rounded-3xl shadow-xl overflow-hidden"
        >
          {/* Header with Logo */}
          <div className="bg-gradient-to-r from-purple-600 to-indigo-600 px-8 py-12">
            <div className="flex flex-col md:flex-row items-start gap-8">
              <div className="w-32 h-32 bg-white rounded-2xl shadow-lg flex items-center justify-center overflow-hidden flex-shrink-0">
                {business.business_logo ? (
                  <img
                    src={resolveStorageUrl(business.business_logo) || business.business_logo}
                    alt={business.business_name}
                    className="w-full h-full object-cover"
                  />
                ) : (
                  <FaBuilding className="h-16 w-16 text-purple-300" />
                )}
              </div>
              
              <div className="flex-1">
                <h1 className="text-4xl font-bold text-white mb-2">{business.business_name}</h1>
                {business.business_description && (
                  <p className="text-white/90 text-lg mb-4">{business.business_description}</p>
                )}
                <div className="flex items-center gap-4">
                  <span className={`px-4 py-2 rounded-full text-sm font-bold ${
                    business.status === 'active' ? 'bg-green-500 text-white' : 'bg-gray-500 text-white'
                  }`}>
                    {business.status || 'Active'}
                  </span>
                  {business.category && (
                    <span className="px-4 py-2 rounded-full bg-white/20 text-white text-sm font-semibold">
                      {business.category.name}
                    </span>
                  )}
                </div>
              </div>

              {isOwner && (
                <Link
                  to={`/dashboard?tab=business`}
                  className="flex items-center gap-2 px-6 py-3 bg-white text-purple-600 rounded-xl hover:bg-gray-100 transition-colors font-semibold shadow-lg"
                >
                  <FaEdit />
                  Edit Business
                </Link>
              )}
            </div>
          </div>

          {/* Content */}
          <div className="p-8">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              {/* Contact Information */}
              <div>
                <h2 className="text-2xl font-bold text-gray-900 mb-6 flex items-center gap-3">
                  <FaEnvelope className="text-purple-600" />
                  Contact Information
                </h2>
                
                <div className="space-y-4">
                  {business.business_phone_number && (
                    <div className="flex items-start gap-4 p-4 bg-gray-50 rounded-xl">
                      <FaPhone className="h-5 w-5 text-purple-500 flex-shrink-0 mt-1" />
                      <div>
                        <p className="text-sm text-gray-500 mb-1">Phone</p>
                        <p className="font-semibold text-gray-900">{business.business_phone_number}</p>
                      </div>
                    </div>
                  )}
                  
                  {business.business_email && (
                    <div className="flex items-start gap-4 p-4 bg-gray-50 rounded-xl">
                      <FaEnvelope className="h-5 w-5 text-purple-500 flex-shrink-0 mt-1" />
                      <div>
                        <p className="text-sm text-gray-500 mb-1">Email</p>
                        <p className="font-semibold text-gray-900">{business.business_email}</p>
                      </div>
                    </div>
                  )}
                  
                  {business.business_website && (
                    <div className="flex items-start gap-4 p-4 bg-gray-50 rounded-xl">
                      <FaGlobe className="h-5 w-5 text-purple-500 flex-shrink-0 mt-1" />
                      <div>
                        <p className="text-sm text-gray-500 mb-1">Website</p>
                        <a
                          href={business.business_website}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="font-semibold text-purple-600 hover:text-purple-700"
                        >
                          {business.business_website}
                        </a>
                      </div>
                    </div>
                  )}
                  
                  {business.business_address && (
                    <div className="flex items-start gap-4 p-4 bg-gray-50 rounded-xl">
                      <FaMapMarkerAlt className="h-5 w-5 text-purple-500 flex-shrink-0 mt-1" />
                      <div>
                        <p className="text-sm text-gray-500 mb-1">Address</p>
                        <p className="font-semibold text-gray-900">{business.business_address}</p>
                      </div>
                    </div>
                  )}
                </div>
              </div>

              {/* Owner Information */}
              <div>
                <h2 className="text-2xl font-bold text-gray-900 mb-6 flex items-center gap-3">
                  <FaUser className="text-purple-600" />
                  Owner Information
                </h2>
                
                <div className="space-y-4">
                  {business.business_owner && (
                    <div className="flex items-start gap-4 p-4 bg-gray-50 rounded-xl">
                      <FaUser className="h-5 w-5 text-purple-500 flex-shrink-0 mt-1" />
                      <div>
                        <p className="text-sm text-gray-500 mb-1">Owner Name</p>
                        <p className="font-semibold text-gray-900">{business.business_owner}</p>
                      </div>
                    </div>
                  )}
                  
                  {business.personal_phone_number && (
                    <div className="flex items-start gap-4 p-4 bg-gray-50 rounded-xl">
                      <FaPhone className="h-5 w-5 text-purple-500 flex-shrink-0 mt-1" />
                      <div>
                        <p className="text-sm text-gray-500 mb-1">Personal Phone</p>
                        <p className="font-semibold text-gray-900">{business.personal_phone_number}</p>
                      </div>
                    </div>
                  )}
                  
                  {business.personal_email && (
                    <div className="flex items-start gap-4 p-4 bg-gray-50 rounded-xl">
                      <FaEnvelope className="h-5 w-5 text-purple-500 flex-shrink-0 mt-1" />
                      <div>
                        <p className="text-sm text-gray-500 mb-1">Personal Email</p>
                        <p className="font-semibold text-gray-900">{business.personal_email}</p>
                      </div>
                    </div>
                  )}

                  {!isOwner && resolveSellerId(business) && (
                    <ChatButton
                      sellerId={resolveSellerId(business)}
                      sellerName={resolveSellerName(
                        business,
                        business.business_name || business.business_owner || 'Business'
                      )}
                      listing={buildListingChatContext(business, 'Business')}
                      label="Live Chat with Owner"
                      className="w-full h-11 px-4 text-sm font-semibold bg-purple-600 hover:bg-purple-700 text-white rounded-xl"
                      variant="custom"
                    />
                  )}
                </div>
              </div>
            </div>

            {/* Company Registration Information */}
            {(business.business_company_name || business.business_company_registration || business.business_company_no) && (
              <div className="mt-8 pt-8 border-t border-gray-200">
                <h2 className="text-2xl font-bold text-gray-900 mb-6">Company Registration</h2>
                
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  {business.business_company_name && (
                    <div className="p-4 bg-gray-50 rounded-xl">
                      <p className="text-sm text-gray-500 mb-1">Company Name</p>
                      <p className="font-semibold text-gray-900">{business.business_company_name}</p>
                    </div>
                  )}
                  
                  {business.business_company_registration && (
                    <div className="p-4 bg-gray-50 rounded-xl">
                      <p className="text-sm text-gray-500 mb-1">Registration Number</p>
                      <p className="font-semibold text-gray-900">{business.business_company_registration}</p>
                    </div>
                  )}
                  
                  {business.business_company_no && (
                    <div className="p-4 bg-gray-50 rounded-xl">
                      <p className="text-sm text-gray-500 mb-1">Company Number</p>
                      <p className="font-semibold text-gray-900">{business.business_company_no}</p>
                    </div>
                  )}
                </div>
              </div>
            )}

            {/* Last Updated */}
            <div className="mt-8 pt-8 border-t border-gray-200">
              <div className="flex items-center gap-2 text-gray-500 text-sm">
                <FaClock className="h-4 w-4" />
                <span>
                  Last updated: {business.updated_at ? new Date(business.updated_at).toLocaleString() : 'Recently'}
                </span>
              </div>
            </div>
          </div>
        </motion.div>
      </div>
      
      <Footer />
    </div>
  );
};

export default BusinessDetailPage;
