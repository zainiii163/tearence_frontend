import React from "react";
import ModernCategoryPage from "../Component/CategoryPage/ModernCategoryPage";
import CategoryItem from "../Component/CategoryPage/CategoryItem";
import { getPropertyAdsModern } from "../slice/ListSlice";

const PropertyPageModern = () => {
  return (
    <ModernCategoryPage
      categoryType="property"
      getDataAction={getPropertyAdsModern}
      dataSelector={(store) => store.ads.catAdsList || { items: [], total: 0 }}
      itemComponent={CategoryItem}
    />
  );
};

export default PropertyPageModern;
