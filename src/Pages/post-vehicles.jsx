import React from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuthRedirect } from '../hooks/useAuthRedirect';
import UnifiedNavbar from '../Component/UnifiedNavbar';
import VehiclePostForm from '../Component/vehicles/VehiclePostForm';

const PostVehiclesPage = () => {
  const navigate = useNavigate();
  const { requireAuth } = useAuthRedirect();

  // Check authentication on component mount
  React.useEffect(() => {
    if (!requireAuth('/post-vehicles', 'You must be logged in to post a vehicle advertisement.')) {
      return;
    }
  }, [requireAuth]);

  const handleCloseForm = () => {
    navigate('/vehicles');
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <UnifiedNavbar showBackButton={true} />
      
      <div className="py-8">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-8">
            <h1 className="text-3xl font-bold text-gray-900 mb-2">Post Your Vehicle</h1>
            <p className="text-gray-600">Create a compelling advertisement to attract potential buyers</p>
          </div>
          
          <VehiclePostForm onClose={handleCloseForm} />
        </div>
      </div>
    </div>
  );
};

export default PostVehiclesPage;
