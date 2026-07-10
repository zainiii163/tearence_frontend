import React from "react";
import UnifiedNavbar from "../Component/UnifiedNavbar";
import MySponsoredAds from "../Component/MySponsoredAds";
import Footer from "../Component/Footer";
import BottomAds from "../Component/BottomAds";
// import TopAds from "../Component/TopAds"; // Commented out as unused

function MyPromotedAdsPage() {
  return (
    <div className="">
      <UnifiedNavbar />
      <MySponsoredAds />
      <BottomAds />
      <Footer />
    </div>
  );
}

export default MyPromotedAdsPage;
