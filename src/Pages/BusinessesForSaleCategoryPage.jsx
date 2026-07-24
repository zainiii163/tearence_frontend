import React from 'react';
import { Link, useParams } from 'react-router-dom';
import { motion } from 'framer-motion';
import { FaStore, FaArrowLeft } from 'react-icons/fa';
import BusinessesForSaleBrowsePage from '../Component/businesses-for-sale/BusinessesForSaleBrowsePage';
import { getCategoryById } from '../Component/businesses-for-sale/businessesForSaleCategories';

const BusinessesForSaleCategoryPage = () => {
  const { categoryId } = useParams();
  const category = getCategoryById(categoryId);

  if (!category) {
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
          <h1 className="text-2xl font-bold text-gray-900 mb-3">Category Not Found</h1>
          <p className="text-gray-600 mb-6 text-sm">
            The category &quot;{categoryId}&quot; doesn&apos;t exist.
          </p>
          <Link
            to="/businesses-for-sale"
            className="inline-flex items-center px-6 py-3 bg-amber-600 text-white rounded-xl hover:bg-amber-700 transition-colors text-sm font-semibold"
          >
            <FaArrowLeft className="mr-2" />
            Back to Businesses for Sale
          </Link>
        </motion.div>
      </div>
    );
  }

  return <BusinessesForSaleBrowsePage initialCategoryId={categoryId} key={categoryId} />;
};

export default BusinessesForSaleCategoryPage;
