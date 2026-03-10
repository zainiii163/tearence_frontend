import React from "react";
import { Link } from 'react-router-dom';
import { FaHandshake, FaPlus } from 'react-icons/fa';
import ModernCategoryPage from "../Component/CategoryPage/ModernCategoryPage";
import CategoryItem from "../Component/CategoryPage/CategoryItem";
import BackButton from "../Component/BackButton";
import { getAffiliateAdsModern } from "../slice/ListSlice";

const AffiliateAdsPage = () => {
  return (
    <div className="relative">
      {/* Back Button - Top Left */}
      <div className="fixed top-20 left-4 z-40">
        <BackButton className="bg-white/90 hover:bg-white shadow-lg border border-gray-200" />
      </div>
      
      {/* Post Affiliate Button - Top Right */}
      <div className="fixed top-20 right-4 z-40">
        <Link
          to="/affiliates/post"
          className="inline-flex items-center justify-center whitespace-nowrap rounded-md text-sm font-medium ring-offset-background transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 bg-blue-600 hover:bg-blue-700 text-white h-10 px-4 gap-2 shadow-lg hover:shadow-xl"
        >
          <FaHandshake className="h-4 w-4" />
          <span className="hidden sm:inline">Post Affiliate</span>
        </Link>
      </div>
      
      <ModernCategoryPage
        categoryType="affiliate-ads"
        getDataAction={getAffiliateAdsModern}
        dataSelector={(store) => store.ads.catAdsList || { items: [], total: 0 }}
        itemComponent={CategoryItem}
        filters={[
          { key: "priceRange", label: "Price Range", type: "select" },
          { key: "location", label: "Location", type: "text" },
        ]}
        sortOptions={[
          { value: "newest", label: "Newest First" },
          { value: "oldest", label: "Oldest First" },
          { value: "price_low", label: "Price: Low to High" },
          { value: "price_high", label: "Price: High to Low" },
          { value: "relevance", label: "Most Relevant" },
        ]}
      />
    </div>
  );
};

export default AffiliateAdsPage;
