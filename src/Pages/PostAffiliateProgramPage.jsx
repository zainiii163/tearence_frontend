import React from "react";
import UnifiedNavbar from "../Component/UnifiedNavbar";
import Footer from "../Component/Footer";
import { useNavigate } from "react-router-dom";

const PostAffiliateProgramPage = () => {
  const navigate = useNavigate();

  // Redirect to affiliates hub with promoter (affiliate link) form open
  React.useEffect(() => {
    navigate('/affiliates?postForm=true&mode=user', { replace: true });
  }, [navigate]);

  return (
    <div className="min-h-screen bg-gray-50">
      <UnifiedNavbar />
      <div className="py-8">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-8">
            <h1 className="text-3xl font-bold text-gray-900 mb-4">
              Opening Affiliate Post Form...
            </h1>
            <p className="text-lg text-gray-600">
              Taking you to post your affiliate link on the Affiliates Hub.
            </p>
          </div>
        </div>
      </div>
      <Footer />
    </div>
  );
};

export default PostAffiliateProgramPage;
