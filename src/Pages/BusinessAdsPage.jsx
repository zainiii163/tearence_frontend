import React from "react";
import BusinessAdsPageComponent from "../Component/BusinessAdsPage";
import UnifiedNavbar from "../Component/UnifiedNavbar";
import Footer from "../Component/Footer";

const BusinessAdsPage = () => {
  
  return (
    <div>
      <UnifiedNavbar />
      <BusinessAdsPageComponent />
      <Footer />
    </div>
  );
};

export default BusinessAdsPage;