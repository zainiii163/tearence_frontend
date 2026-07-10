import React from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuthRedirect } from '../hooks/useAuthRedirect';
import UnifiedNavbar from '../Component/UnifiedNavbar';
import BannerPostForm from '../Component/banner/BannerPostForm';

const PostBannerPage = () => {
  const navigate = useNavigate();
  const { requireAuth } = useAuthRedirect();

  // Check authentication on component mount
  React.useEffect(() => {
    if (!requireAuth('/postbanner', 'You must be logged in to post a banner advertisement.')) {
      return;
    }
  }, [requireAuth]);

  const handleCloseForm = () => {
    navigate('/banner-adverts');
  };

  const handleSuccess = (data) => {
    // Navigate to banner-adverts page after successful submission
    navigate('/banner-adverts');
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-purple-50">
      <UnifiedNavbar showBackButton={true} />
      
      <div className="py-8">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-8">
            <h1 className="text-3xl font-bold text-gray-900 mb-2">Post Your Banner Advertisement</h1>
            <p className="text-gray-600">Create stunning banner ads that convert</p>
          </div>
          
          <BannerPostForm onClose={handleCloseForm} onSuccess={handleSuccess} />
        </div>
      </div>
    </div>
  );
};

export default PostBannerPage;
