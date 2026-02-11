import React from "react";
import Navbar from "../Component/Navbar";
import Footer from "../Component/Footer";
import BannerList from "../Component/BannerList";

const BannerPage = () => {
  return (
    <div>
      <Navbar />
      <BannerList />
      <Footer />
    </div>
  );
};

export default BannerPage;
