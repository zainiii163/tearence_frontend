import React, { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import UnifiedNavbar from '../Component/UnifiedNavbar';
import BusinessCategoryGrid from "../Component/Business/BusinessCategoryGrid";
import Footer from '../Component/Footer';
import BusinessCalculators from '../Component/calculators/BusinessCalculators';
import { getAllBusinesses } from '../api/business';
import { FaBuilding, FaMapMarkerAlt, FaPhone, FaEnvelope, FaPlus, FaEdit, FaTrash, FaSearch, FaStar, FaClock, FaArrowRight } from 'react-icons/fa';
import { motion } from 'framer-motion';

const BusinessPage = () => {
  const navigate = useNavigate();
  const [businesses, setBusinesses] = useState([]);
  const [filteredBusinesses, setFilteredBusinesses] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedCategory, setSelectedCategory] = useState(null);
  const [searchQuery, setSearchQuery] = useState('');

  useEffect(() => {
    const fetchBusinesses = async () => {
      try {
        setLoading(true);
        const response = await getAllBusinesses({ limit: 100 });
        if (response.data && response.data.items) {
          setBusinesses(response.data.items);
          setFilteredBusinesses(response.data.items);
        }
      } catch (error) {
        console.error('Error fetching businesses:', error);
        setBusinesses([]);
        setFilteredBusinesses([]);
      } finally {
        setLoading(false);
      }
    };

    fetchBusinesses();
  }, []);

  // Filter businesses based on category and search query
  useEffect(() => {
    let filtered = businesses;

    if (selectedCategory) {
      filtered = filtered.filter(b => b.category === selectedCategory);
    }

    if (searchQuery) {
      const query = searchQuery.toLowerCase();
      filtered = filtered.filter(b => 
        b.business_name?.toLowerCase().includes(query) ||
        b.business_address?.toLowerCase().includes(query) ||
        b.business_description?.toLowerCase().includes(query)
      );
    }

    setFilteredBusinesses(filtered);
  }, [selectedCategory, searchQuery, businesses]);

  const handleCategoryClick = (categoryId) => {
    setSelectedCategory(categoryId === selectedCategory ? null : categoryId);
  };

  const handleBusinessClick = (businessId) => {
    navigate(`/business/${businessId}`);
  };

  return (
    <div>
      <UnifiedNavbar />
      <BusinessCategoryGrid selectedCategory={selectedCategory} onCategoryClick={handleCategoryClick} businesses={businesses} />
      
      <div className="max-w-7xl mx-auto px-3 sm:px-4 md:px-6 lg:px-8 py-6 md:py-12">
        {/* Header Section */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-8"
        >
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
            <div>
              <h1 className="text-2xl md:text-4xl font-bold text-gray-900 mb-1 md:mb-2">All Businesses</h1>
              <p className="text-sm md:text-base text-gray-600">Discover and connect with businesses worldwide</p>
            </div>
            <Link
              to="/business/create"
              className="inline-flex items-center gap-2 px-4 md:px-6 py-2 md:py-3 bg-gradient-to-r from-purple-600 to-indigo-600 text-white rounded-xl hover:from-purple-700 hover:to-indigo-700 transition-all duration-300 font-semibold shadow-lg hover:shadow-xl transform hover:scale-105 text-sm md:text-base"
            >
              <FaPlus className="text-sm md:text-base" />
              <span className="hidden sm:inline">Add Business</span>
              <span className="sm:hidden">Add</span>
            </Link>
          </div>

          {/* Search Bar */}
          <div className="mt-4 md:mt-6 relative">
            <FaSearch className="absolute left-3 md:left-4 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4 md:h-5 md:w-5" />
            <input
              type="text"
              placeholder="Search businesses by name, location, or description..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-10 md:pl-12 pr-3 md:pr-4 py-2.5 md:py-4 border-2 border-gray-200 rounded-xl md:rounded-2xl focus:border-purple-500 focus:ring-2 md:focus:ring-4 focus:ring-purple-100 transition-all duration-300 text-sm md:text-lg"
            />
          </div>

          {/* Active Filters */}
          {(selectedCategory || searchQuery) && (
            <div className="mt-3 md:mt-4 flex flex-wrap gap-2">
              {selectedCategory && (
                <button
                  onClick={() => setSelectedCategory(null)}
                  className="inline-flex items-center gap-1 md:gap-2 px-2 md:px-4 py-1.5 md:py-2 bg-purple-100 text-purple-700 rounded-full hover:bg-purple-200 transition-colors text-xs md:text-sm"
                >
                  <span className="hidden sm:inline">Category:</span>{selectedCategory}
                  <span className="text-purple-500 text-sm md:text-base">×</span>
                </button>
              )}
              {searchQuery && (
                <button
                  onClick={() => setSearchQuery('')}
                  className="inline-flex items-center gap-1 md:gap-2 px-2 md:px-4 py-1.5 md:py-2 bg-gray-100 text-gray-700 rounded-full hover:bg-gray-200 transition-colors text-xs md:text-sm"
                >
                  <span className="hidden sm:inline">Search:</span>{searchQuery}
                  <span className="text-gray-500 text-sm md:text-base">×</span>
                </button>
              )}
              <button
                onClick={() => {
                  setSelectedCategory(null);
                  setSearchQuery('');
                }}
                className="inline-flex items-center gap-1 md:gap-2 px-2 md:px-4 py-1.5 md:py-2 text-red-600 hover:text-red-700 font-medium text-xs md:text-sm"
              >
                Clear All
              </button>
            </div>
          )}
        </motion.div>

        {loading ? (
          <div className="text-center py-16">
            <div className="inline-block h-12 w-12 animate-spin rounded-full border-4 border-solid border-purple-600 border-r-transparent"></div>
            <p className="mt-4 text-gray-600 text-lg">Loading businesses...</p>
          </div>
        ) : filteredBusinesses.length === 0 ? (
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            className="text-center py-16 bg-white rounded-3xl shadow-xl border border-gray-100"
          >
            <FaBuilding className="h-24 w-24 text-gray-300 mx-auto mb-6" />
            <h3 className="text-2xl font-bold text-gray-900 mb-3">No businesses found</h3>
            <p className="text-gray-600 mb-8 text-lg">
              {selectedCategory || searchQuery
                ? 'Try adjusting your filters or search query'
                : 'Be the first to add a business to our platform!'
              }
            </p>
          </motion.div>
        ) : (
          <>
            {/* Results Count */}
            <div className="mb-6 text-gray-600">
              Showing <span className="font-semibold text-purple-600">{filteredBusinesses.length}</span> businesses
              {selectedCategory && <span> in <span className="font-semibold">{selectedCategory}</span></span>}
              {searchQuery && <span> matching <span className="font-semibold">"{searchQuery}"</span></span>}
            </div>

            {/* Business Cards Grid */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 md:gap-6">
              {filteredBusinesses.map((business, index) => (
                <motion.div
                  key={business.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.3, delay: index * 0.05 }}
                  whileHover={{ y: -4, scale: 1.02 }}
                  onClick={() => handleBusinessClick(business.id)}
                  className="bg-white rounded-xl shadow-md overflow-hidden border border-gray-200 hover:shadow-xl transition-all duration-300 cursor-pointer group"
                >
                  {/* Card Header Image */}
                  <div className="relative h-36 bg-gradient-to-br from-purple-500 to-indigo-600 overflow-hidden">
                    {business.business_logo ? (
                      <img
                        src={business.business_logo}
                        alt={business.business_name}
                        className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                      />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center">
                        <FaBuilding className="h-12 w-12 text-white/30" />
                      </div>
                    )}
                    
                    {/* Status Badge */}
                    <div className="absolute top-2 right-2">
                      <span className={`px-2 py-1 rounded-full text-xs font-bold shadow-md ${
                        business.status === 'active' ? 'bg-green-500 text-white' : 'bg-gray-500 text-white'
                      }`}>
                        {business.status || 'Active'}
                      </span>
                    </div>
                  </div>
                  
                  {/* Card Content */}
                  <div className="p-4">
                    <h3 className="text-base font-bold text-gray-900 mb-1 group-hover:text-purple-600 transition-colors line-clamp-1">
                      {business.business_name}
                    </h3>
                    
                    {business.business_description && (
                      <p className="text-gray-600 text-xs mb-3 line-clamp-2">
                        {business.business_description}
                      </p>
                    )}
                    
                    <div className="space-y-2 text-xs text-gray-600">
                      {business.business_address && (
                        <div className="flex items-center gap-2">
                          <FaMapMarkerAlt className="h-3 w-3 text-purple-500 flex-shrink-0" />
                          <span className="line-clamp-1">{business.business_address}</span>
                        </div>
                      )}
                      
                      {business.business_phone_number && (
                        <div className="flex items-center gap-2">
                          <FaPhone className="h-3 w-3 text-purple-500 flex-shrink-0" />
                          <span className="truncate">{business.business_phone_number}</span>
                        </div>
                      )}
                      
                      {business.business_email && (
                        <div className="flex items-center gap-2">
                          <FaEnvelope className="h-3 w-3 text-purple-500 flex-shrink-0" />
                          <span className="truncate">{business.business_email}</span>
                        </div>
                      )}
                    </div>

                    {/* Card Footer */}
                    <div className="flex items-center justify-between mt-3 pt-3 border-t border-gray-100">
                      <div className="flex items-center gap-1 text-gray-400 text-xs">
                        <FaClock className="h-3 w-3" />
                        <span className="hidden sm:inline">Updated {business.updated_at ? new Date(business.updated_at).toLocaleDateString() : 'Recently'}</span>
                        <span className="sm:hidden">Recently</span>
                      </div>
                      <div className="flex items-center gap-1">
                        <Link
                          to={`/business/${business.id}/edit`}
                          className="p-1.5 text-purple-600 hover:bg-purple-50 rounded-md transition-colors"
                          title="Edit"
                          onClick={(e) => e.stopPropagation()}
                        >
                          <FaEdit className="h-3 w-3" />
                        </Link>
                        <button
                          className="p-1.5 text-red-600 hover:bg-red-50 rounded-md transition-colors"
                          title="Delete"
                          onClick={(e) => {
                            e.stopPropagation();
                            // Handle delete
                          }}
                        >
                          <FaTrash className="h-3 w-3" />
                        </button>
                      </div>
                    </div>
                  </div>
                </motion.div>
              ))}
            </div>
          </>
        )}
      </div>

      <BusinessCalculators />
      
      <Footer />
    </div>
  );
};

export default BusinessPage;