import React from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuthRedirect } from '../hooks/useAuthRedirect';
import UnifiedNavbar from '../Component/UnifiedNavbar';
import ServicesPostForm from '../Component/Services/ServicesPostForm';

const PostServicePage = () => {
  const navigate = useNavigate();
  const { requireAuth } = useAuthRedirect();

  // Check authentication on component mount
  React.useEffect(() => {
    if (!requireAuth('/post-service', 'You must be logged in to post a service.')) {
      return;
    }
  }, [requireAuth]);

  const handleCloseForm = () => {
    navigate('/services');
  };

  const handleSubmit = () => {
    navigate('/services');
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <UnifiedNavbar showBackButton={true} />
      
      <div className="py-8">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-8">
            <h1 className="text-3xl font-bold text-gray-900 mb-2">Post Your Service</h1>
            <p className="text-gray-600">Create a compelling service listing to attract potential clients</p>
          </div>
          
          <ServicesPostForm onClose={handleCloseForm} onSubmit={handleSubmit} />
        </div>
      </div>
    </div>
  );
};

export default PostServicePage;
