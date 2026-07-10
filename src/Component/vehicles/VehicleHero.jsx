import React from 'react';
import { motion } from 'framer-motion';
import { Plus } from 'lucide-react';

const VehicleHero = ({ statistics, onPostClick }) => {
  return (
    <div className="relative bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900 text-white overflow-hidden">
      {/* Background Pattern */}
      <div className="absolute inset-0 opacity-10">
        <div 
          className="absolute inset-0" 
          style={{
            backgroundImage: `url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%23ffffff' fill-opacity='0.1'%3E%3Cpath d='M36 34v-4h-2v4h-4v2h4v4h2v-4h4v-2h-4zm0-30V0h-2v4h-4v2h4v4h2V6h4V4h-4zM6 34v-4H4v4H0v2h4v4h2v-4h4v-2H6zM6 4V0H4v4H0v2h4v4h2V6h4V4H6z'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")`
          }}
        ></div>
      </div>

      {/* Floating Elements */}
      <div className="absolute inset-0">
        <motion.div
          animate={{ y: [-20, 20, -20] }}
          transition={{ duration: 6, repeat: Infinity }}
          className="absolute top-20 left-10 w-20 h-20 bg-red-500 rounded-full opacity-20 blur-xl"
        />
        <motion.div
          animate={{ y: [20, -20, 20] }}
          transition={{ duration: 8, repeat: Infinity }}
          className="absolute bottom-20 right-10 w-32 h-32 bg-blue-500 rounded-full opacity-20 blur-xl"
        />
        <motion.div
          animate={{ x: [-20, 20, -20] }}
          transition={{ duration: 7, repeat: Infinity }}
          className="absolute top-1/2 left-1/4 w-24 h-24 bg-purple-500 rounded-full opacity-20 blur-xl"
        />
      </div>

      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-24">
        <div className="text-center">
          {/* Headline */}
          <motion.h1
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="text-4xl md:text-6xl font-bold mb-6"
          >
            Discover Vehicles for Sale, Hire & Lease — Worldwide
          </motion.h1>

          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.1 }}
            className="text-xl md:text-2xl text-gray-300 mb-12 max-w-4xl mx-auto"
          >
            Cars, vans, bikes, trucks, luxury vehicles, and transport services from trusted sellers.
          </motion.p>

          {/* Quick Stats */}
          {statistics && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.3 }}
              className="mt-16 grid grid-cols-2 md:grid-cols-4 gap-8"
            >
              <div className="text-center">
                <div className="text-3xl font-bold text-red-500 mb-2">
                  {statistics.total_vehicles?.toLocaleString() || '0'}
                </div>
                <div className="text-gray-400">Active Vehicles</div>
              </div>
              <div className="text-center">
                <div className="text-3xl font-bold text-blue-500 mb-2">
                  {statistics.total_countries?.toLocaleString() || '0'}
                </div>
                <div className="text-gray-400">Countries</div>
              </div>
              <div className="text-center">
                <div className="text-3xl font-bold text-green-500 mb-2">
                  {statistics.total_views?.toLocaleString() || '0'}
                </div>
                <div className="text-gray-400">Total Views</div>
              </div>
              <div className="text-center">
                <div className="text-3xl font-bold text-purple-500 mb-2">
                  {statistics.featured_vehicles?.toLocaleString() || '0'}
                </div>
                <div className="text-gray-400">Featured Vehicles</div>
              </div>
            </motion.div>
          )}
        </div>
      </div>
    </div>
  );
};

export default VehicleHero;
