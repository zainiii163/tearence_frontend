import React, { useState, useEffect } from "react";
import UserFavoriteAds from "./UserFavoriteAds";
import AccountInfo from "./AccountInfo";
import Invoices from "./Invoices";
import MyAds from "./MyAds";
import { FaAd, FaHeart, FaFileInvoice, FaUser } from "react-icons/fa";
import { useLocation, useNavigate } from "react-router-dom";

const UserAccount = () => {
  const location = useLocation();
  const navigate = useNavigate();
  
  // Get component from URL params or default to AccountInfo
  const getComponentFromURL = () => {
    const params = new URLSearchParams(location.search);
    return params.get('component') || 'AccountInfo';
  };

  const [activeComponent, setActiveComponent] = useState(getComponentFromURL());

  // Update active component when URL changes
  useEffect(() => {
    setActiveComponent(getComponentFromURL());
  }, [location.search]);

  const handleTabClick = (componentName) => {
    setActiveComponent(componentName);
    navigate(`/account?component=${componentName}`);
  };

  const renderComponent = () => {
    switch (activeComponent) {
      case "MyAds":
        return <MyAds />;
      case "FavoriteAds":
        return <UserFavoriteAds />;
      case "Invoices":
        return <Invoices />;
      case "AccountInfo":
        return <AccountInfo />;
      default:
        return <AccountInfo />;
    }
  };

  return (
    <div className="min-h-screen bg-background">
      <div className="pt-20">
        {/* Header Section */}
        <div className="bg-gradient-to-r from-blue-600 to-blue-800 py-12">
          <div className="container mx-auto px-4">
            <h1 className="text-4xl font-bold text-white text-center mb-8">MY ACCOUNT</h1>
            
            {/* Navigation Tabs */}
            <div className="flex justify-center">
              <div className="bg-white/10 backdrop-blur-sm rounded-lg p-2">
                <nav className="flex flex-wrap gap-2">
                  <button
                    onClick={() => handleTabClick("MyAds")}
                    className={`inline-flex items-center gap-2 px-4 py-2 text-sm font-medium rounded-md transition-colors ${
                      activeComponent === "MyAds"
                        ? "bg-white text-blue-800 shadow-sm"
                        : "text-white hover:bg-white/20"
                    }`}
                  >
                    <FaAd className="h-4 w-4" />
                    My Ads
                  </button>
                  <button
                    onClick={() => handleTabClick("FavoriteAds")}
                    className={`inline-flex items-center gap-2 px-4 py-2 text-sm font-medium rounded-md transition-colors ${
                      activeComponent === "FavoriteAds"
                        ? "bg-white text-blue-800 shadow-sm"
                        : "text-white hover:bg-white/20"
                    }`}
                  >
                    <FaHeart className="h-4 w-4" />
                    Favorite Ads
                  </button>
                  <button
                    onClick={() => handleTabClick("Invoices")}
                    className={`inline-flex items-center gap-2 px-4 py-2 text-sm font-medium rounded-md transition-colors ${
                      activeComponent === "Invoices"
                        ? "bg-white text-blue-800 shadow-sm"
                        : "text-white hover:bg-white/20"
                    }`}
                  >
                    <FaFileInvoice className="h-4 w-4" />
                    Invoices
                  </button>
                  <button
                    onClick={() => handleTabClick("AccountInfo")}
                    className={`inline-flex items-center gap-2 px-4 py-2 text-sm font-medium rounded-md transition-colors ${
                      activeComponent === "AccountInfo"
                        ? "bg-white text-blue-800 shadow-sm"
                        : "text-white hover:bg-white/20"
                    }`}
                  >
                    <FaUser className="h-4 w-4" />
                    Account Info
                  </button>
                </nav>
              </div>
            </div>
          </div>
        </div>

        {/* Content Area */}
        <div className="container mx-auto px-4 py-8">
          {renderComponent()}
        </div>
      </div>
    </div>
  );
};

export default UserAccount;
