import React from "react";
import ModernCategoryPage from "../Component/CategoryPage/ModernCategoryPage";
import CategoryItem from "../Component/CategoryPage/CategoryItem";
import { getServicesList } from "../slice/ServicesSlice";

const ServicesPageModern = () => {
  return (
    <ModernCategoryPage
      categoryType="services"
      getDataAction={getServicesList}
      dataSelector={(store) => store.services?.servicesList || { items: [], total: 0 }}
      itemComponent={CategoryItem}
    />
  );
};

export default ServicesPageModern;
