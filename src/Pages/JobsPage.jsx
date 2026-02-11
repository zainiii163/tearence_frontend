import React from "react";
import Navbar from "../Component/Navbar";
import Footer from "../Component/Footer";
import SubcategoryNavigation from "../Component/SubcategoryNavigation";
import JobsSection from "../Component/JobsSection/JobsSection";

const JobsPage = () => {
  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar />
      <SubcategoryNavigation pageType="jobs" />
      <JobsSection />
      <Footer />
    </div>
  );
};

export default JobsPage;

