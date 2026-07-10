import React from "react";
import UnifiedNavbar from "../Component/UnifiedNavbar";
import MyNewAds from "../Component/MyNewAds";
import Footer from "../Component/Footer";
import BottomAds from "../Component/BottomAds";
// import TopAds from "../Component/TopAds"; // Commented out as unused

function MyNewAdsPage() {
  return (
    <div className="">
      <UnifiedNavbar />
      <MyNewAds />
      <BottomAds />
      <Footer />
    </div>
  );
}

export default MyNewAdsPage;
