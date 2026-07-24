import React from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { FaArrowLeft } from 'react-icons/fa'
import UnifiedNavbar from '../Component/UnifiedNavbar'
import Footer from '../Component/Footer'
import AllCategory from '../Component/AllCategory'
import EbayAds from "../Component/EbayAds";

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
      <UnifiedNavbar showBackButton={true} />
      
      {/* Header */}
      <div className="page-container py-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-foreground mb-2">All Categories</h1>
          <p className="text-muted-foreground">Browse our complete selection of categories</p>
        </div>
      </div>

      <AllCategory />
      <EbayAds />
      <Footer />
    </div>
  )
}

export default AllCategoryPage
