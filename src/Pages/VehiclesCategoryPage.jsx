import React from 'react';
import { Link, useParams } from 'react-router-dom';
import { FaCar, FaArrowLeft } from 'react-icons/fa';
import VehiclesBrowsePage from '../Component/vehicles/VehiclesBrowsePage';

const VehiclesCategoryPage = () => {
  const { categoryType } = useParams();

  if (!categoryType) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center px-4">
          <FaCar className="h-12 w-12 text-red-500 mx-auto mb-4" />
          <h1 className="text-xl font-bold mb-4">Category Not Found</h1>
          <Link to="/vehicles" className="inline-flex items-center text-red-600 font-semibold">
            <FaArrowLeft className="mr-2" /> Back to Vehicles
          </Link>
        </div>
      </div>
    );
  }

  return <VehiclesBrowsePage initialCategoryType={categoryType} key={categoryType} />;
};

export default VehiclesCategoryPage;
