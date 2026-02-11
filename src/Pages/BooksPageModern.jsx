import React from "react";
import ModernCategoryPage from "../Component/CategoryPage/ModernCategoryPage";
import CategoryItem from "../Component/CategoryPage/CategoryItem";
import { getBooksListModern } from "../slice/ListSlice";

const BooksPageModern = () => {
  return (
    <ModernCategoryPage
      categoryType="books"
      getDataAction={getBooksListModern}
      dataSelector={(store) => store.ads.catAdsList || { items: [], total: 0 }}
      itemComponent={CategoryItem}
    />
  );
};

export default BooksPageModern;
