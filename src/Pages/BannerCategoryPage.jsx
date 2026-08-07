import React from 'react';
import { useParams } from 'react-router-dom';
import BannerAdvertsPage from './banner-adverts';

const BannerCategoryPage = () => {
  const { categoryId } = useParams();
  return <BannerAdvertsPage initialCategoryId={categoryId} key={categoryId} />;
};

export default BannerCategoryPage;
