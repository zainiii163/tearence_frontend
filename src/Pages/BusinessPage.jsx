import React from "react";
import ModernCategoryPage from "../Component/CategoryPage/ModernCategoryPage";
import CategoryItem from "../Component/CategoryPage/CategoryItem";
import BusinessCategoryGrid from "../Component/Business/BusinessCategoryGrid";
import { getBusinessAdsModern } from "../slice/ListSlice";

const BusinessPage = () => {
  return (
    <div>
      <BusinessCategoryGrid />
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <ModernCategoryPage
          categoryType="business"
          getDataAction={getBusinessAdsModern}
          dataSelector={(store) => store.ads.catAdsList || { items: [], total: 0 }}
          itemComponent={CategoryItem}
        />
      </div>
    </div>
  );
};

export default BusinessPage;