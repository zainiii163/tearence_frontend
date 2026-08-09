import React from 'react';
import ImagesPostForm from '../Component/images/ImagesPostForm';
import UnifiedNavbar from '../Component/UnifiedNavbar';
import Footer from '../Component/Footer';

const PostImagesPage = () => {
  return (
    <div className="min-h-screen bg-gray-50">
      {/* Navbar */}
      <UnifiedNavbar showBackButton backHref="/images" />

      <div className="max-w-4xl mx-auto px-4 py-8">
        <div className="mb-6">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Sell Your Images</h1>
        </div>
        
        <ImagesPostForm />
      </div>

      {/* Footer */}
      <Footer />
    </div>
  );
};

export default PostImagesPage;
