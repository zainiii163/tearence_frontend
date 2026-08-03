import React from 'react';
import { Link, useParams } from 'react-router-dom';
import SponsoredAdvertsPage from './sponsored-adverts';

const SponsoredCategoryPage = () => {
  const { categoryId } = useParams();

  if (!categoryId) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center px-4">
        <div className="text-center">
          <h1 className="text-xl font-bold text-gray-900 mb-3">Category not found</h1>
          <Link
            to="/sponsored-adverts"
            className="inline-flex items-center px-5 py-2.5 bg-amber-600 text-white rounded-lg text-sm font-semibold hover:bg-amber-700"
          >
            Back to Sponsored Adverts
          </Link>
        </div>
      </div>
    );
  }

  return <SponsoredAdvertsPage initialCategoryId={categoryId} key={categoryId} />;
};

export default SponsoredCategoryPage;
