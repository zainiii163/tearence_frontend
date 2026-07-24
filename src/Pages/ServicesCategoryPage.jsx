import React from 'react';
import { Link, useParams } from 'react-router-dom';
import { FaCogs, FaArrowLeft } from 'react-icons/fa';
import ServicesBrowsePage from '../Component/Services/ServicesBrowsePage';

/**
 * /services/category/:categoryId  → tech category slug (e.g. web-development)
 * /services/category/:groupId/:subId → legacy nested route
 */
const ServicesCategoryPage = () => {
  const { categoryId, groupId, subId } = useParams();

  if (!categoryId && !groupId && !subId) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center px-4">
        <div className="text-center">
          <FaCogs className="h-12 w-12 text-emerald-500 mx-auto mb-4" />
          <Link to="/services" className="inline-flex items-center text-emerald-700 font-semibold">
            <FaArrowLeft className="mr-2" /> Back to Services
          </Link>
        </div>
      </div>
    );
  }

  const slug = subId || categoryId || null;

  return (
    <ServicesBrowsePage
      initialGroupId={groupId || null}
      initialCategoryId={slug}
      key={`${groupId || 'none'}-${slug || 'none'}`}
    />
  );
};

export default ServicesCategoryPage;
