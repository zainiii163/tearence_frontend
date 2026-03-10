import React from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { FaArrowLeft } from 'react-icons/fa'
import Navbar from '../Component/Navbar'
import Footer from '../Component/Footer'
import AllCategory from '../Component/AllCategory'
import EbayAds from "../Component/EbayAds";
import PostNewAds from "../Component/PostNewAds";

const AllCategoryPage = () => {
  const navigate = useNavigate();

  const handleGoBack = () => {
    // Navigate back to previous page or home
    if (window.history.length > 1) {
      navigate(-1);
    } else {
      navigate('/');
    }
  };

  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      
      {/* Header with Back Button */}
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="flex items-center gap-4 mb-8">
          <button
            onClick={handleGoBack}
            className="inline-flex items-center px-4 py-2 text-gray-600 hover:text-gray-900 bg-white/80 backdrop-blur-sm border border-gray-200/50 rounded-lg hover:bg-gray-50/90 transition-all duration-200 shadow-sm hover:shadow-md"
          >
            <FaArrowLeft className="h-4 w-4 mr-2" />
            Back
          </button>
          <div>
            <h1 className="text-3xl font-bold text-foreground mb-2">All Categories</h1>
            <p className="text-muted-foreground">Browse our complete selection of categories</p>
          </div>
        </div>
      </div>

      <AllCategory />
      <EbayAds />
      <PostNewAds />
      <Footer />
    </div>
  )
}

export default AllCategoryPage
