import React from 'react';
import BuySellBrowsePage from '../Component/buy-sell/BuySellBrowsePage';

/** Classifieds hub — own URL/branding, live Buy/Sell listings API (no redirect). */
const ClassifiedAdsPage = () => (
  <BuySellBrowsePage hubKey="classifieds" basePath="/classifieds-ads" />
);

export default ClassifiedAdsPage;
