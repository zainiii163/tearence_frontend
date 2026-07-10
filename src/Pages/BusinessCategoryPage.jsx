import React, { useEffect, useState } from "react";
import { useParams, Link } from "react-router-dom";
import { useSelector, useDispatch } from "react-redux";
import { motion } from "framer-motion";
import { getBusinessAdsModern } from "../slice/ListSlice";
import UnifiedNavbar from '../Component/UnifiedNavbar';
import BusinessHero from '../Component/Business/BusinessHero';
import BusinessCategoryGrid from '../Component/Business/BusinessCategoryGrid';
import FeaturedBusinessCarousel from '../Component/Business/FeaturedBusinessCarousel';
import BusinessActivityFeed from '../Component/Business/BusinessActivityFeed';
import UpsellSection from '../Component/Business/UpsellSection';
import Footer from '../Component/Footer';
import { FiGrid } from 'react-icons/fi';
import { getAllBusinesses, getBusinessCategories } from '../api/business';
import { 
  FaStore, 
  FaBuilding, 
  FaIndustry, 
  FaShoppingCart, 
  FaDollarSign,
  FaChartLine,
  FaUsers,
  FaHeart,
  FaCar,
  FaHome,
  FaUtensils,
  FaLaptop,
  FaDumbbell,
  FaPlane,
  FaGraduationCap,
  FaStethoscope,
  FaBriefcase,
  FaSeedling,
  FaGamepad,
  FaBook,
  FaMusic,
  FaPalette,
  FaTools,
  FaTruck,
  FaHotel,
  FaCoffee,
  FaDog,
  FaRing,
  FaMobile,
  FaTv,
  FaHeadphones,
  FaFootballBall,
  FaChurch,
  FaLandmark,
  FaWarehouse,
  FaGavel,
  FaStar,
  FaArrowLeft,
  FaFilter,
  FaMapMarkerAlt,
  FaPhone,
  FaEnvelope,
  FaClock
} from "react-icons/fa";

const BusinessCategoryPage = () => {
  const { categoryName } = useParams();
  const dispatch = useDispatch();
  const { catAdsList } = useSelector((store) => store.ads);
  const [loading, setLoading] = useState(true);
  const [filteredBusinesses, setFilteredBusinesses] = useState([]);
  const [businesses, setBusinesses] = useState([]);
  const [categories, setCategories] = useState([]);

  // Fetch real business data from backend
  useEffect(() => {
    const fetchBusinesses = async () => {
      try {
        setLoading(true);
        const response = await getAllBusinesses({ limit: 50 });
        if (response.data && response.data.items) {
          setBusinesses(response.data.items);
          setFilteredBusinesses(response.data.items);
        }
      } catch (error) {
        console.error('Error fetching businesses:', error);
        // Fallback to mock data if API fails
        setBusinesses([]);
      } finally {
        setLoading(false);
      }
    };

    fetchBusinesses();
  }, []);

  // Fetch categories from backend
  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const response = await getBusinessCategories();
        if (response.data && Array.isArray(response.data)) {
          setCategories(response.data);
        }
      } catch (error) {
        console.error('Error fetching categories:', error);
      }
    };

    fetchCategories();
  }, []);

  // Find category from backend data
  const category = categories.find(cat => cat.slug === categoryName);
  
  useEffect(() => {
    if (catAdsList?.items && category) {
      // Filter businesses based on category_id
      const filtered = catAdsList.items.filter(business => {
        return business.category_id === category.category_id;
      });
      setFilteredBusinesses(filtered);
    }
  }, [catAdsList, category]);

  if (!category) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 flex items-center justify-center">
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center"
        >
          <div className="w-24 h-24 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-6">
            <FaStore className="h-12 w-12 text-red-500" />
          </div>
          <h1 className="text-4xl font-bold text-gray-900 mb-4">Category Not Found</h1>
          <p className="text-gray-600 mb-8 text-lg">The business category you're looking for doesn't exist.</p>
          <Link 
            to="/business"
            className="inline-flex items-center px-8 py-4 bg-gradient-to-r from-blue-600 to-indigo-600 text-white rounded-xl hover:from-blue-700 hover:to-indigo-700 transition-all duration-300 shadow-lg hover:shadow-xl transform hover:scale-105"
          >
            <FaArrowLeft className="mr-2" />
            Back to Business Directory
          </Link>
        </motion.div>
      </div>
    );
  }

  // If no category is selected, show premium business directory page
  if (!categoryName) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-50 via-white to-gray-50">
        <UnifiedNavbar />
        <BusinessHero />
        <FeaturedBusinessCarousel businesses={catAdsList?.items || []} />
        <BusinessCategoryGrid />
        <BusinessActivityFeed />
        <UpsellSection />
        <Footer />
      </div>
    );
  }

  // If category is selected, show category-specific view
  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 via-white to-gray-50">
      <UnifiedNavbar showBackButton={true} />
      
      {/* Hero Section with Gradient Banner */}
      <div className="bg-gradient-to-r from-indigo-600 via-purple-600 to-pink-600 py-16 relative overflow-hidden">
        <div className="absolute inset-0 bg-black/10"></div>
        <div className="absolute inset-0">
          <div className="absolute top-0 left-0 w-96 h-96 bg-white/10 rounded-full -translate-x-1/2 -translate-y-1/2 blur-3xl"></div>
          <div className="absolute bottom-0 right-0 w-96 h-96 bg-white/10 rounded-full translate-x-1/2 translate-y-1/2 blur-3xl"></div>
        </div>
        
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <motion.div 
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="flex items-center gap-8"
          >
            <div className="w-24 h-24 bg-white/20 backdrop-blur-sm rounded-2xl flex items-center justify-center border-2 border-white/30 shadow-2xl">
              <FaBuilding className="h-12 w-12 text-white" />
            </div>
            <div className="flex-1">
              <h1 className="text-5xl font-bold text-white mb-3 drop-shadow-lg">
                {category.name}
              </h1>
              <p className="text-xl text-white/90 leading-relaxed">
                {category.description || 'Businesses in this category'}
              </p>
            </div>
          </motion.div>
        </div>
      </div>

      {/* Stats Bar */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 -mt-8 relative z-20">
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.2 }}
          className="bg-white/90 backdrop-blur-lg rounded-2xl border border-gray-200/50 p-8 shadow-xl hover:shadow-2xl transition-all duration-300"
        >
          <div className="flex items-center justify-center gap-12">
            <div className="text-center group">
              <motion.div 
                whileHover={{ scale: 1.1 }}
                className="text-4xl font-bold text-purple-600 mb-2"
              >
                {filteredBusinesses.length}
              </motion.div>
              <div className="text-sm text-gray-600 font-medium uppercase tracking-wide">Businesses</div>
            </div>
            <div className="w-px h-12 bg-gray-300"></div>
            <div className="text-center group">
              <motion.div 
                whileHover={{ scale: 1.1 }}
                className="text-4xl font-bold text-indigo-600 mb-2"
              >
                {categories.filter(cat => cat.parent_id === category.category_id).length}
              </motion.div>
              <div className="text-sm text-gray-600 font-medium uppercase tracking-wide">Subcategories</div>
            </div>
            <div className="w-px h-12 bg-gray-300"></div>
            <div className="text-center group">
              <motion.div 
                whileHover={{ scale: 1.1 }}
                className="text-4xl font-bold text-pink-600 mb-2"
              >
                24/7
              </motion.div>
              <div className="text-sm text-gray-600 font-medium uppercase tracking-wide">Support</div>
            </div>
          </div>
        </motion.div>
      </div>

      {/* Subcategories Section */}
      {categories.filter(cat => cat.parent_id === category.category_id).length > 0 && (
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.3 }}
          >
            <h2 className="text-2xl font-bold text-gray-900 mb-6 flex items-center">
              <FiGrid className="mr-3 h-6 w-6 text-purple-600" />
              Explore Subcategories
            </h2>
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
              {categories.filter(cat => cat.parent_id === category.category_id).map((sub, index) => (
                <motion.div
                  key={sub.category_id}
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ duration: 0.3, delay: 0.4 + (index * 0.05) }}
                >
                  <Link
                    to={`/business/category/${sub.slug}`}
                    className="group flex flex-col items-center p-6 bg-white rounded-2xl border border-gray-200 hover:border-purple-300 hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1"
                  >
                    <div className="w-14 h-14 bg-gradient-to-br from-purple-100 to-indigo-100 rounded-xl flex items-center justify-center mb-3 group-hover:from-purple-200 group-hover:to-indigo-200 transition-all duration-300">
                      <div className="text-purple-600 group-hover:scale-110 transition-transform duration-300">
                        <FaBuilding className="h-6 w-6" />
                      </div>
                    </div>
                    <span className="text-sm text-center font-semibold text-gray-800 group-hover:text-purple-600 transition-colors">
                      {sub.name}
                    </span>
                  </Link>
                </motion.div>
              ))}
            </div>
          </motion.div>
        </div>
      )}

      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pb-16">
        <div className="flex flex-col lg:flex-row gap-8">
          {/* Filters Sidebar */}
          <motion.div 
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6, delay: 0.5 }}
            className="lg:w-72"
          >
            <div className="bg-white rounded-2xl shadow-lg border border-gray-200 p-6 sticky top-24">
              <h3 className="font-bold text-gray-900 mb-6 flex items-center text-lg">
                <FaFilter className="mr-3 h-5 w-5 text-purple-600" />
                Filters
              </h3>
              
              <div className="space-y-6">
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-3">Location</label>
                  <select className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent bg-gray-50 hover:bg-gray-100 transition-colors">
                    <option>All Locations</option>
                    <option>New York</option>
                    <option>Los Angeles</option>
                    <option>Chicago</option>
                    <option>Houston</option>
                  </select>
                </div>
                
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-3">Rating</label>
                  <select className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent bg-gray-50 hover:bg-gray-100 transition-colors">
                    <option>All Ratings</option>
                    <option>4+ Stars</option>
                    <option>3+ Stars</option>
                    <option>2+ Stars</option>
                  </select>
                </div>
                
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-3">Price Range</label>
                  <select className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent bg-gray-50 hover:bg-gray-100 transition-colors">
                    <option>All Prices</option>
                    <option>$</option>
                    <option>$$</option>
                    <option>$$$</option>
                    <option>$$$$</option>
                  </select>
                </div>
              </div>
            </div>
          </motion.div>

          {/* Results */}
          <motion.div 
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6, delay: 0.5 }}
            className="flex-1"
          >
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-8 gap-4">
              <div>
                <h2 className="text-3xl font-bold text-gray-900 mb-2">
                  {loading ? 'Loading...' : `${filteredBusinesses.length} ${category.name}`}
                </h2>
                <p className="text-gray-600">
                  Discover the best businesses in this category
                </p>
              </div>
              
              <select className="px-6 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent bg-white shadow-sm hover:shadow-md transition-shadow">
                <option>Sort by: Relevance</option>
                <option>Sort by: Name</option>
                <option>Sort by: Rating</option>
                <option>Sort by: Distance</option>
              </select>
            </div>

            {loading ? (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {[...Array(6)].map((_, i) => (
                  <div key={i} className="bg-white rounded-2xl shadow-lg border border-gray-200 p-6 animate-pulse">
                    <div className="h-40 bg-gray-200 rounded-xl mb-4"></div>
                    <div className="h-5 bg-gray-200 rounded mb-2"></div>
                    <div className="h-4 bg-gray-200 rounded w-3/4"></div>
                  </div>
                ))}
              </div>
            ) : filteredBusinesses.length > 0 ? (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {filteredBusinesses.map((business, index) => (
                  <motion.div
                    key={business.id}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.4, delay: 0.6 + (index * 0.05) }}
                    className="bg-white rounded-2xl shadow-lg border border-gray-200 overflow-hidden hover:shadow-2xl transition-all duration-300 transform hover:-translate-y-1"
                  >
                    <div className="p-6">
                      <div className="flex items-start mb-4">
                        <img 
                          src={business.image || "/img/NoImage.png"} 
                          alt={business.title}
                          className="w-20 h-20 rounded-xl object-cover mr-4 shadow-md"
                        />
                        <div className="flex-1">
                          <h3 className="font-bold text-gray-900 mb-2 text-lg">{business.title}</h3>
                          <div className="flex items-center text-sm text-gray-600 mb-2">
                            <FaMapMarkerAlt className="mr-2 text-purple-500" />
                            {business.location || 'Location not specified'}
                          </div>
                          <div className="flex items-center">
                            <div className="flex text-yellow-400 mr-2">
                              {[...Array(5)].map((_, i) => (
                                <FaStar key={i} className={`h-4 w-4 ${i < Math.floor(business.rating || 0) ? 'text-yellow-400' : 'text-gray-300'}`} />
                              ))}
                            </div>
                            <span className="text-sm text-gray-600 font-medium">
                              {business.rating || 'No rating'} ({business.reviews || 0} reviews)
                            </span>
                          </div>
                        </div>
                      </div>
                      
                      <p className="text-gray-700 text-sm mb-4 line-clamp-2 leading-relaxed">
                        {business.description || 'No description available'}
                      </p>
                      
                      <div className="flex items-center justify-between text-sm text-gray-600 mb-6 pb-4 border-b border-gray-100">
                        <div className="flex items-center">
                          <FaPhone className="mr-2 text-purple-500" />
                          {business.phone || 'No phone'}
                        </div>
                        <div className="flex items-center">
                          <FaClock className="mr-2 text-purple-500" />
                          {business.hours || 'Hours not specified'}
                        </div>
                      </div>
                      
                      <div className="flex space-x-3">
                        <Link 
                          to={`/business/${business.slug}`}
                          className="flex-1 text-center bg-gradient-to-r from-purple-600 to-indigo-600 text-white px-4 py-3 rounded-xl hover:from-purple-700 hover:to-indigo-700 transition-all duration-300 font-semibold shadow-md hover:shadow-lg"
                        >
                          View Details
                        </Link>
                        <button className="px-4 py-3 border border-gray-300 rounded-xl hover:bg-gray-50 hover:border-purple-300 transition-all duration-300">
                          <FaEnvelope className="text-purple-600" />
                        </button>
                      </div>
                    </div>
                  </motion.div>
                ))}
              </div>
            ) : (
              <motion.div 
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="text-center py-16"
              >
                <div className="w-32 h-32 bg-purple-100 rounded-full flex items-center justify-center mx-auto mb-6">
                  <FaStore className="h-16 w-16 text-purple-500" />
                </div>
                <h3 className="text-2xl font-bold text-gray-900 mb-3">No businesses found</h3>
                <p className="text-gray-600 mb-8 text-lg max-w-md mx-auto">
                  We couldn't find any businesses in the {category.name} category.
                </p>
                <Link 
                  to="/business"
                  className="inline-flex items-center px-8 py-4 bg-gradient-to-r from-purple-600 to-indigo-600 text-white rounded-xl hover:from-purple-700 hover:to-indigo-700 transition-all duration-300 shadow-lg hover:shadow-xl transform hover:scale-105 font-semibold"
                >
                  Browse All Categories
                </Link>
              </motion.div>
            )}
          </motion.div>
        </div>
      </div>
      
      <Footer />
    </div>
  );
};

export default BusinessCategoryPage;
