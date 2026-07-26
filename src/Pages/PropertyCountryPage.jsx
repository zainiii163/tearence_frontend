import React from 'react';
import { Link, useParams } from 'react-router-dom';
import { motion } from 'framer-motion';
import { FaHome, FaArrowLeft } from 'react-icons/fa';
import PropertyBrowsePage from '../Component/property/PropertyBrowsePage';
import { findCountryBySlug } from '../data/propertyContinents';

const PropertyCountryPage = () => {
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
            <FaHome className="h-10 w-10 text-red-500" />
          </div>
          <h1 className="text-2xl font-bold text-gray-900 mb-3">Country Not Found</h1>
          <Link
            to="/property"
            className="inline-flex items-center px-6 py-3 bg-[#0c1520] text-white text-sm font-semibold"
          >
            <FaArrowLeft className="mr-2" />
            Back to Property
          </Link>
        </motion.div>
      </div>
    );
  }

  return (
    <PropertyBrowsePage
      initialCountrySlug={countrySlug}
      initialContinentId={match.continent.id}
      key={countrySlug}
    />
  );
};

export default PropertyCountryPage;
