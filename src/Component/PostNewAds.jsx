import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Link } from "react-router-dom";
import {
  FaIndustry,
  FaShoppingBag,
  FaBullhorn,
  FaFighterJet,
  FaCreditCard,
  FaCalendar,
  FaBuilding,
  FaCar,
  FaLaptop,
  FaTags,
  FaBook,
  FaStar,
  FaPlane,
  FaMedal,
  FaChartLine,
  FaHome,
  FaBriefcase,
  FaUsers,
  FaHeart,
  FaImage,
  FaCogs,
  FaPlus,
  FaTimes,
} from "react-icons/fa";
import { PiFlagBanner } from "react-icons/pi";
import { useAuthRedirect } from "../hooks/useAuthRedirect";

function PostNewAds() {
  const { requireAuth, clearRedirect } = useAuthRedirect();
  const [showModal, setShowModal] = useState(false);

  // Check for localStorage flag to show modal
  useEffect(() => {
    const showPostModal = localStorage.getItem('showPostModal');
    if (showPostModal === 'true') {
      localStorage.removeItem('showPostModal');
      if (requireAuth()) {
        setShowModal(true);
      }
    }
  }, [requireAuth]);

  const postingOptions = [
    {
      name: "Buy & Sell",
      description: "Post items for sale or find items to purchase",
      icon: <FaUsers className="h-6 w-6" />,
      color: "from-green-500 to-emerald-500",
      route: "/buy-sell?postForm=true",
    },
    {
      name: "Vehicles",
      description: "Sell cars, bikes, and other vehicles",
      icon: <FaCar className="h-6 w-6" />,
      color: "from-blue-500 to-cyan-500",
      route: "/post-vehicles",
    },
    {
      name: "Books",
      description: "Post educational books, novels, and publications",
      icon: <FaBook className="h-6 w-6" />,
      color: "from-indigo-500 to-purple-500",
      route: "/post-book",
    },
    {
      name: "Jobs",
      description: "Post job vacancies and career opportunities",
      icon: <FaBriefcase className="h-6 w-6" />,
      color: "from-emerald-500 to-teal-500",
      route: "/post/jobs",
    },
    {
      name: "Property",
      description: "Post real estate and property listings",
      icon: <FaHome className="h-6 w-6" />,
      color: "from-violet-500 to-purple-500",
      route: "/postproperty",
    },
    {
      name: "Business",
      description: "Post business listings and company profiles",
      icon: <FaIndustry className="h-6 w-6" />,
      color: "from-gray-500 to-blue-500",
      route: "/post/business",
    },
    {
      name: "Services",
      description: "Post professional services and solutions",
      icon: <FaCogs className="h-6 w-6" />,
      color: "from-amber-500 to-orange-500",
      route: "/post/services",
    },
    {
      name: "Events & Venues",
      description: "Post events, venues, and activities",
      icon: <FaCalendar className="h-6 w-6" />,
      color: "from-pink-500 to-rose-500",
      route: "/post/events-venues",
    },
    {
      name: "Resorts & Travel",
      description: "Post resorts, vacations, and travel packages",
      icon: <FaPlane className="h-6 w-6" />,
      color: "from-cyan-500 to-blue-500",
      route: "/post/resorts-travel",
    },
    {
      name: "Featured Ads",
      description: "Post premium featured advertisements",
      icon: <FaStar className="h-6 w-6" />,
      color: "from-yellow-500 to-orange-500",
      route: "/post-featured-advert",
    },
    {
      name: "Banner Ads",
      description: "Post banner advertising placements",
      icon: <PiFlagBanner className="h-6 w-6" />,
      color: "from-indigo-500 to-blue-500",
      route: "/postbanner",
    },
    {
      name: "Classifieds",
      description: "Post general classified advertisements",
      icon: <FaMedal className="h-6 w-6" />,
      color: "from-teal-500 to-green-500",
      route: "/postclassified",
    },
    {
      name: "Sponsored Ads",
      description: "Post sponsored advertising content",
      icon: <FaBullhorn className="h-6 w-6" />,
      color: "from-purple-500 to-indigo-500",
      route: "/post-promoted-ad",
    },
    {
      name: "Affiliate",
      description: "Post affiliate marketing programs",
      icon: <FaChartLine className="h-6 w-6" />,
      color: "from-pink-500 to-rose-500",
      route: "/postaffiliate",
    },
    {
      name: "Investment",
      description: "Post investment opportunities",
      icon: <FaChartLine className="h-6 w-6" />,
      color: "from-emerald-500 to-teal-500",
      route: "/post/investment",
    },
    {
      name: "Donations",
      description: "Post charity and donation requests",
      icon: <FaHeart className="h-6 w-6" />,
      color: "from-red-500 to-pink-500",
      route: "/create-donation",
    },
  ];

  const handlePostClick = () => {
    // Clear any stored redirects to prevent automatic redirection
    clearRedirect();
    
    if (requireAuth()) {
      setShowModal(true);
    }
  };

  const handleOptionClick = (route) => {
    setShowModal(false);
    window.location.href = route;
  };

  return (
    <div className="w-full py-8 sm:py-12 lg:py-16 xl:py-20 bg-gradient-to-br from-background via-muted/30 to-background">
      <div className="max-w-7xl mx-auto px-3 sm:px-4 lg:px-6 xl:px-8">
        {/* Post New Ad Section */}
        <div className="text-center mb-8">
          <h2 className="text-2xl sm:text-3xl lg:text-4xl font-bold text-gray-900 mb-3 sm:mb-4">
            Post Your Ad
          </h2>
          <p className="text-sm sm:text-base lg:text-lg text-gray-600 max-w-2xl mx-auto px-4">
            Choose a category to post your advertisement and reach millions of potential buyers
          </p>
        </div>

        <div className="flex justify-center">
          <button
            onClick={handlePostClick}
            className="inline-flex items-center gap-3 px-8 py-4 bg-gradient-to-r from-green-600 to-emerald-600 text-white rounded-xl shadow-lg hover:shadow-xl hover:from-green-700 hover:to-emerald-700 transition-all duration-300 text-lg font-semibold"
          >
            <FaPlus className="h-5 w-5" />
            Post New Ad
          </button>
        </div>

        {/* Category Selection Modal */}
        <AnimatePresence>
          {showModal && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4 sm:p-6"
              onClick={() => setShowModal(false)}
            >
              <motion.div
                initial={{ scale: 0.9, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                exit={{ scale: 0.9, opacity: 0 }}
                className="bg-white rounded-xl shadow-2xl w-full max-w-4xl max-h-[90vh] overflow-hidden flex flex-col"
                onClick={(e) => e.stopPropagation()}
              >
                {/* Modal Header */}
                <div className="flex items-center justify-between p-4 sm:p-6 border-b border-gray-200 flex-shrink-0 bg-gradient-to-r from-green-600 to-emerald-600">
                  <div>
                    <h3 className="text-lg sm:text-xl font-bold text-white">Choose Ad Category</h3>
                    <p className="text-green-100 text-sm">Select the type of advertisement you want to post</p>
                  </div>
                  <button
                    onClick={() => setShowModal(false)}
                    className="text-white hover:text-green-100 transition-colors p-2"
                  >
                    <FaTimes className="h-5 w-5 sm:h-6 sm:w-6" />
                  </button>
                </div>

                {/* Modal Body - Scrollable */}
                <div className="flex-1 overflow-y-auto p-4 sm:p-6">
                  <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                    {postingOptions.map((option, index) => (
                      <motion.button
                        key={index}
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: index * 0.05 }}
                        onClick={() => handleOptionClick(option.route)}
                        className="group relative overflow-hidden rounded-xl border-2 border-gray-200 bg-gradient-to-br hover:shadow-lg transition-all duration-300 hover:-translate-y-1"
                        style={{
                          background: `linear-gradient(to bottom right, ${option.color.replace('from-', '').replace(' to-', ', ')} 0%, white 100%)`,
                        }}
                      >
                        <div className="relative p-4 sm:p-5 text-left">
                          <div className="inline-flex items-center justify-center w-12 h-12 sm:w-14 sm:h-14 rounded-xl bg-white/80 backdrop-blur-sm mb-3 group-hover:scale-110 transition-transform duration-300">
                            <div className="text-gray-700 group-hover:text-gray-900">
                              {option.icon}
                            </div>
                          </div>

                          <h4 className="text-sm sm:text-base font-bold text-gray-800 mb-2">
                            {option.name}
                          </h4>

                          <p className="text-gray-600 text-xs sm:text-sm leading-relaxed line-clamp-2">
                            {option.description}
                          </p>
                        </div>
                      </motion.button>
                    ))}
                  </div>
                </div>

                {/* Modal Footer */}
                <div className="p-4 sm:p-6 border-t border-gray-200 flex-shrink-0">
                  <button
                    onClick={() => setShowModal(false)}
                    className="w-full px-4 py-2.5 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors font-medium"
                  >
                    Cancel
                  </button>
                </div>
              </motion.div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
}

export default PostNewAds;
