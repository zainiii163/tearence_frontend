import React from "react";
import ModernCategoryPage from "../Component/CategoryPage/ModernCategoryPage";
import CategoryItem from "../Component/CategoryPage/CategoryItem";
import { getFeaturedAdsModern } from "../slice/ListSlice";

const FeatureAdsPage = () => {
  return (
    <ModernCategoryPage
      categoryType="featured-ads"
      getDataAction={getFeaturedAdsModern}
      dataSelector={(store) => store.ads.adsList?.data || { items: [], total: 0 }}
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
  );
};

export default FeatureAdsPage;