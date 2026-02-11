import React from "react";
import StoreList from "../Component/StoreList";
import Navbar from "../Component/Navbar";
import Footer from "../Component/Footer";

const StoresPage = () => {
  return (
    <div>
      <Navbar />
      <StoreList />
      <Footer />
    </div>
  );
};

export default StoresPage;