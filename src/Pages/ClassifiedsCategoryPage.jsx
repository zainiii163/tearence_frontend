import React from 'react';
import { Link, useParams } from 'react-router-dom';
import { motion } from 'framer-motion';
import { FaTags, FaArrowLeft } from 'react-icons/fa';
import BuySellBrowsePage from '../Component/buy-sell/BuySellBrowsePage';

const ClassifiedsCategoryPage = () => {
  const { categoryId } = useParams();

  if (!categoryId) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="text-center px-4">
          <div className="w-20 h-20 bg-teal-100 rounded-full flex items-center justify-center mx-auto mb-6">
            <FaTags className="h-10 w-10 text-teal-600" />
          </div>
          <h1 className="text-2xl font-bold text-gray-900 mb-3">Category Not Found</h1>
          <Link
            to="/classifieds-ads"
            className="inline-flex items-center px-6 py-3 bg-teal-600 text-white rounded-xl hover:bg-teal-700 text-sm font-semibold"
          >
            <FaArrowLeft className="mr-2" />
            Back to Classifieds
          </Link>
        </motion.div>
      </div>
    );
  }

  return (
    <BuySellBrowsePage
      hubKey="classifieds"
      basePath="/classifieds-ads"
      initialCategoryId={categoryId}
      key={categoryId}
    />
  );
};

export default ClassifiedsCategoryPage;
