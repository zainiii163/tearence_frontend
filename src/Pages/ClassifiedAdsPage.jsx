import React from "react";
import ModernCategoryPage from "../Component/CategoryPage/ModernCategoryPage";
import CategoryItem from "../Component/CategoryPage/CategoryItem";
import { getClassifiedAdsModern } from "../slice/ListSlice";

const ClassifiedAdsPage = () => {
  return (
    <ModernCategoryPage
      categoryType="classified-ads"
      getDataAction={getClassifiedAdsModern}
      dataSelector={(store) => store.ads.catAdsList || { items: [], total: 0 }}
      itemComponent={CategoryItem}
      filters={[
        { key: "priceRange", label: "Price Range", type: "select" },
        { key: "location", label: "Location", type: "text" },
        { key: "category", label: "Category", type: "select" },
      ]}
      sortOptions={[
        { value: "newest", label: "Newest First" },
        { value: "oldest", label: "Oldest First" },
        { value: "price_low", label: "Price: Low to High" },
        { value: "price_high", label: "Price: High to Low" },
        { value: "relevance", label: "Most Relevant" },
      ]}
    />
  );
};

export default ClassifiedAdsPage;
