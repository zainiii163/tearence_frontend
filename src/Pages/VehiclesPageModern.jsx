import React from "react";
import ModernCategoryPage from "../Component/CategoryPage/ModernCategoryPage";
import CategoryItem from "../Component/CategoryPage/CategoryItem";
import { getVehicleAdsModern } from "../slice/ListSlice";

const VehiclesPageModern = () => {
  return (
    <ModernCategoryPage
      categoryType="vehicles"
      getDataAction={getVehicleAdsModern}
      dataSelector={(store) => store.ads.catAdsList || { items: [], total: 0 }}
      itemComponent={CategoryItem}
    />
  );
};

export default VehiclesPageModern;
