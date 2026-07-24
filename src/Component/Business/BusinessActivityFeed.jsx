import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { FaEye, FaHeart, FaStar, FaMapMarkerAlt, FaClock, FaFire, FaChartLine, FaGlobe } from 'react-icons/fa';

const BusinessActivityFeed = ({ activities }) => {
  const [currentActivities, setCurrentActivities] = useState(activities || []);

  useEffect(() => {
    if (activities) {
      setCurrentActivities(activities);
    }
  }, [activities]);

  const getActivityColor = (type) => {
    switch(type) {
      case 'view': return 'bg-blue-100 text-blue-600';
      case 'favorite': return 'bg-red-100 text-red-600';
      case 'review': return 'bg-yellow-100 text-yellow-600';
      case 'new': return 'bg-green-100 text-green-600';
      case 'enquiry': return 'bg-purple-100 text-purple-600';
      default: return 'bg-gray-100 text-gray-600';
    }
  };

  const getActivityText = (activity) => {
    switch(activity.type) {
      case 'view': return `viewed ${activity.business}`;
      case 'favorite': return `saved ${activity.business}`;
      case 'review': return `reviewed ${activity.business}`;
      case 'new': return `added ${activity.business}`;
      case 'enquiry': return `enquired about ${activity.business}`;
      default: return `interacted with ${activity.business}`;
    }
  };

  return (
    <div className="py-12 bg-gradient-to-br from-gray-50 to-white">
      <div className="page-container">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
        >
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Live Activity Feed */}
            <div className="lg:col-span-2">
              <div className="bg-white rounded-2xl shadow-xl border border-gray-100 p-6">
                <div className="flex items-center justify-between mb-6">
                  <h2 className="text-2xl font-bold text-gray-900 flex items-center">
                    <span className="w-3 h-3 bg-green-500 rounded-full mr-3 animate-pulse"></span>
                    Live Activity
                  </h2>
                  <span className="text-sm text-gray-500">Real-time updates</span>
                </div>

                <div className="space-y-4">
                  <AnimatePresence mode="popLayout">
                    {activities.map((activity, index) => (
                      <motion.div
                        key={activity.id}
                        initial={{ opacity: 0, x: -20 }}
                        animate={{ opacity: 1, x: 0 }}
                        exit={{ opacity: 0, x: 20 }}
                        transition={{ duration: 0.3, delay: index * 0.05 }}
                        className="flex items-start gap-4 p-4 bg-gray-50 rounded-xl hover:bg-gray-100 transition-colors"
                      >
                        <div className={`w-10 h-10 ${getActivityColor(activity.type)} rounded-full flex items-center justify-center flex-shrink-0`}>
                          {activity.icon}
                        </div>
                        <div className="flex-1">
                          <p className="text-gray-900 font-medium">
                            {activity.user} {getActivityText(activity)}
                          </p>
                          <div className="flex items-center gap-2 mt-1 text-sm text-gray-500">
                            <FaMapMarkerAlt className="h-3 w-3" />
                            {activity.location}
                            <span>•</span>
                            <FaClock className="h-3 w-3" />
                            {activity.time}
                          </div>
                        </div>
                      </motion.div>
                    ))}
                  </AnimatePresence>
                </div>
              </div>
            </div>

            {/* Trending Section */}
            <div className="space-y-6">
              {/* Trending Categories */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: 0.2 }}
                className="bg-white rounded-2xl shadow-xl border border-gray-100 p-6"
              >
                <h3 className="text-lg font-bold text-gray-900 mb-4 flex items-center">
                  <FaFire className="h-5 w-5 text-orange-500 mr-2" />
                  Trending Categories
                </h3>
                <div className="space-y-3">
                  {[
                    { name: 'Restaurants & Food', count: 2340, trend: '+15%' },
                    { name: 'Healthcare & Wellness', count: 1890, trend: '+12%' },
                    { name: 'Professional Services', count: 1560, trend: '+8%' },
                    { name: 'Technology & Electronics', count: 1230, trend: '+22%' },
                  ].map((category, index) => (
                    <motion.div
                      key={index}
                      initial={{ opacity: 0, x: 20 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ duration: 0.3, delay: 0.3 + (index * 0.05) }}
                      className="flex items-center justify-between p-3 bg-gray-50 rounded-xl hover:bg-purple-50 transition-colors cursor-pointer group"
                    >
                      <div>
                        <p className="font-medium text-gray-900 group-hover:text-purple-600 transition-colors">
                          {category.name}
                        </p>
                        <p className="text-sm text-gray-500">{category.count} active</p>
                      </div>
                      <div className="flex items-center gap-2">
                        <FaChartLine className="h-4 w-4 text-green-500" />
                        <span className="text-sm font-semibold text-green-600">{category.trend}</span>
                      </div>
                    </motion.div>
                  ))}
                </div>
              </motion.div>

              {/* Trending Locations */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: 0.4 }}
                className="bg-white rounded-2xl shadow-xl border border-gray-100 p-6"
              >
                <h3 className="text-lg font-bold text-gray-900 mb-4 flex items-center">
                  <FaGlobe className="h-5 w-5 text-blue-500 mr-2" />
                  Trending Locations
                </h3>
                <div className="space-y-3">
                  {[
                    { city: 'London', country: 'UK', businesses: 2340 },
                    { city: 'New York', country: 'USA', businesses: 1890 },
                    { city: 'Dubai', country: 'UAE', businesses: 1560 },
                    { city: 'Singapore', country: 'SG', businesses: 1230 },
                  ].map((location, index) => (
                    <motion.div
                      key={index}
                      initial={{ opacity: 0, x: 20 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ duration: 0.3, delay: 0.5 + (index * 0.05) }}
                      className="flex items-center justify-between p-3 bg-gray-50 rounded-xl hover:bg-blue-50 transition-colors cursor-pointer group"
                    >
                      <div>
                        <p className="font-medium text-gray-900 group-hover:text-blue-600 transition-colors">
                          {location.city}
                        </p>
                        <p className="text-sm text-gray-500">{location.country}</p>
                      </div>
                      <span className="text-sm font-semibold text-gray-600">
                        {location.businesses}
                      </span>
                    </motion.div>
                  ))}
                </div>
              </motion.div>
            </div>
          </div>
        </motion.div>
      </div>
    </div>
  );
};

export default BusinessActivityFeed;
