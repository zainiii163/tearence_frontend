import React from "react";
import UnifiedNavbar from "../Component/UnifiedNavbar";
import MyClassifiedAds from "../Component/MyClassifiedAds";
import Footer from "../Component/Footer";
import BottomAds from "../Component/BottomAds";
// import TopAds from "../Component/TopAds"; // Commented out as unused

function MyClassifiedAdsPage() {
  return (
    <div className="">
      <UnifiedNavbar />
      <MyClassifiedAds />
      <BottomAds />
      <Footer />
    </div>
  );
}

export default MyClassifiedAdsPage;
