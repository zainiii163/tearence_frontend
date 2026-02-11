import React from 'react'
import Navbar from '../Component/Navbar'
import Footer from '../Component/Footer'
import AllCategory from '../Component/AllCategory'
import EbayAds from "../Component/EbayAds";
import PostNewAds from "../Component/PostNewAds";

const AllCategoryPage = () => {
  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      <AllCategory />
      <EbayAds />
      <PostNewAds />
      <Footer />
    </div>
  )
}

export default AllCategoryPage
