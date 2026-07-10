import React from 'react';
import { ArrowLeft } from 'lucide-react';
import ImagesPostForm from '../Component/images/ImagesPostForm';
import UnifiedNavbar from '../Component/UnifiedNavbar';
import Footer from '../Component/Footer';

const PostImagesPage = () => {
  return (
    <div className="min-h-screen bg-gray-50">
      {/* Navbar */}
      <UnifiedNavbar />

      <div className="max-w-4xl mx-auto px-4 py-8">
        <button
          onClick={() => window.location.href = '/images'}
          className="flex items-center gap-2 text-gray-600 hover:text-gray-900 mb-6"
        >
          <ArrowLeft className="w-4 h-4" />
          Back to Images
        </button>
        
        <div className="mb-6">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Sell Your Images</h1>
          <p className="text-gray-600">
            Upload your images to the World Wide Adverts marketplace. Your images will be reviewed by our admin team before being published.
          </p>
        </div>
        
        <ImagesPostForm />
      </div>

      {/* Footer */}
      <Footer />
    </div>
  );
};

export default PostImagesPage;
