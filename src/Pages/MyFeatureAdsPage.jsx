import React from "react";
import UnifiedNavbar from "../Component/UnifiedNavbar";
import MyFeatureAds from "../Component/MyFeatureAds";
import Footer from "../Component/Footer";
import BottomAds from "../Component/BottomAds";
// import TopAds from "../Component/TopAds"; // Commented out as unused

function MyFeatureAdsPage() {
  return (
    <div>
      <UnifiedNavbar />
      <MyFeatureAds />
      <BottomAds />
      <Footer />
    </div>
  );
}

export default MyFeatureAdsPage;
