import React from "react";
import Navbar from "../Component/Navbar";
import Footer from "../Component/Footer";
import PostAffiliateProgram from "../Component/Affiliate/PostAffiliateProgram";

const PostAffiliateProgramPage = () => {
  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar />
      <div className="py-8">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-8">
            <h1 className="text-3xl font-bold text-gray-900 mb-4">
              Post Your Affiliate Program
            </h1>
            <p className="text-lg text-gray-600">
              Create and publish your affiliate program to reach thousands of potential promoters
            </p>
          </div>
          <PostAffiliateProgram />
        </div>
      </div>
      <Footer />
    </div>
  );
};

export default PostAffiliateProgramPage;
