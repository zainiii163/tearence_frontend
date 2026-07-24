import React, { useState } from "react";
import { Link, useLocation } from "react-router-dom";

const BusinessTabs = () => {
  const location = useLocation();
  const [activeTab, setActiveTab] = useState(() => {
    if (location.pathname === "/business") return "business";
    if (location.pathname === "/stores") return "stores";
    return "business";
  });

  const tabs = [
    {
      id: "business",
      label: "Business",
      path: "/business"
    },
    {
      id: "stores", 
      label: "Stores",
      path: "/stores"
    }
  ];

  return (
    <div className="bg-white border-b border-gray-200">
      <div className="page-container">
        <nav className="flex space-x-8 justify-center">
          {tabs.map((tab) => (
            <Link
              key={tab.id}
              to={tab.path}
              className={`py-4 px-1 border-b-2 font-medium text-sm ${
                activeTab === tab.id
                  ? "border-blue-500 text-blue-600"
                  : "border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300"
              }`}
              onClick={() => setActiveTab(tab.id)}
            >
              {tab.label}
            </Link>
          ))}
        </nav>
      </div>
    </div>
  );
};

export default BusinessTabs;