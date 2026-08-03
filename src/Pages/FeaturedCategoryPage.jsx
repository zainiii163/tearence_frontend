import React from 'react';
import { useParams } from 'react-router-dom';
import FeaturedPage from './featured';

const FeaturedCategoryPage = () => {
  const { categoryId } = useParams();
  return <FeaturedPage initialCategoryId={categoryId} key={categoryId} />;
};

export default FeaturedCategoryPage;
