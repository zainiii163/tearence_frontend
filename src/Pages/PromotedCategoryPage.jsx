import React from 'react';
import { useParams } from 'react-router-dom';
import PromotedAdvertsPage from './promoted-adverts';

const PromotedCategoryPage = () => {
  const { categoryId } = useParams();
  return <PromotedAdvertsPage initialCategoryId={categoryId} key={categoryId} />;
};

export default PromotedCategoryPage;
