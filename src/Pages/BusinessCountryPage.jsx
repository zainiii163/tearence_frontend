import React from 'react';
import { Link, useParams } from 'react-router-dom';
import { motion } from 'framer-motion';
import { FaStore, FaArrowLeft } from 'react-icons/fa';
import BusinessBrowsePage from '../Component/Business/BusinessBrowsePage';
import { findCountryBySlug } from '../data/propertyContinents';

const BusinessCountryPage = () => {
  const { countrySlug } = useParams();
  const match = findCountryBySlug(countrySlug);

  if (!match) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center px-4"
        >
          <div className="w-20 h-20 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-6">
            <FaStore className="h-10 w-10 text-red-500" />
          </div>
          <h1 className="text-2xl font-bold text-gray-900 mb-3">Country Not Found</h1>
          <Link
            to="/business"
            className="inline-flex items-center px-6 py-3 bg-purple-700 text-white text-sm font-semibold rounded-xl"
          >
            <FaArrowLeft className="mr-2" />
            Back to Business
          </Link>
        </motion.div>
      </div>
    );
  }

  return (
    <BusinessBrowsePage
      initialCountrySlug={countrySlug}
      initialContinentId={match.continent.id}
      key={countrySlug}
    />
  );
};

export default BusinessCountryPage;
