import React from "react";
import Navbar from "../Component/Navbar";
import MyClassifiedAds from "../Component/MyClassifiedAds";
import Footer from "../Component/Footer";
import BottomAds from "../Component/BottomAds";
// import TopAds from "../Component/TopAds"; // Commented out as unused

function MyClassifiedAdsPage() {
  return (
    <div className="">
      <Navbar />
      <MyClassifiedAds />
      <BottomAds />
      <Footer />
    </div>
  );
}

export default MyClassifiedAdsPage;
