import React from 'react';
import PromotedGrid from './promoted-new/PromotedGrid';

const MySponsoredAds = () => {
  return (
    <div className="min-h-screen bg-gray-50">
      <div className="page-container py-8">
        <h1 className="text-3xl font-bold text-gray-900 mb-8">My Sponsored Ads</h1>
        <PromotedGrid />
      </div>
    </div>
  );
};

export default MySponsoredAds;
