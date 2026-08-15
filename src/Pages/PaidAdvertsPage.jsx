import React from 'react';
import { useSearchParams } from 'react-router-dom';
import PromotedAdvertsPage from './promoted-adverts';
import BannerAdvertsPage from './banner-adverts';

/**
 * Paid Adverts — Clive: promoted campaigns and banners grouped on one page.
 * Tabs live in the promoted/banner heroes.
 */
const PaidAdvertsPage = () => {
  const [searchParams] = useSearchParams();
  const raw = String(searchParams.get('tab') || 'promoted').toLowerCase();
  const banners = raw === 'banners' || raw === 'banner';

  if (banners) {
    return <BannerAdvertsPage />;
  }
  return <PromotedAdvertsPage />;
};

export default PaidAdvertsPage;
