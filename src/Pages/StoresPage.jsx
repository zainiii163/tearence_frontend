import React from "react";
import StoreList from "../Component/StoreList";
import UnifiedNavbar from "../Component/UnifiedNavbar";
import Footer from "../Component/Footer";

const StoresPage = () => {
  return (
    <div>
      <UnifiedNavbar />
      <StoreList />
      <Footer />
    </div>
  );
};

export default StoresPage;