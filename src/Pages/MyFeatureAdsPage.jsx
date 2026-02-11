import React from "react";
import Navbar from "../Component/Navbar";
import MyFeatureAds from "../Component/MyFeatureAds";
import Footer from "../Component/Footer";
import BottomAds from "../Component/BottomAds";
// import TopAds from "../Component/TopAds"; // Commented out as unused

function MyFeatureAdsPage() {
  return (
    <div>
      <Navbar />
      <MyFeatureAds />
      <BottomAds />
      <Footer />
    </div>
  );
}

export default MyFeatureAdsPage;
