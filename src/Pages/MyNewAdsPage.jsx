import React from "react";
import Navbar from "../Component/Navbar";
import MyNewAds from "../Component/MyNewAds";
import Footer from "../Component/Footer";
import BottomAds from "../Component/BottomAds";
// import TopAds from "../Component/TopAds"; // Commented out as unused

function MyNewAdsPage() {
  return (
    <div className="">
      <Navbar />
      <MyNewAds />
      <BottomAds />
      <Footer />
    </div>
  );
}

export default MyNewAdsPage;
