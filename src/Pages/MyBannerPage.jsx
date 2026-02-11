import React from "react";
import Navbar from "../Component/Navbar";
import Footer from "../Component/Footer";
import MyBannerList from "../Component/MyBannerList";

const MyBannerPage = () => {
  return (
    <div>
      <Navbar />
      <MyBannerList />
      <Footer />
    </div>
  );
};

export default MyBannerPage;
