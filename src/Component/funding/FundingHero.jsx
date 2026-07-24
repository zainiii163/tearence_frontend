import React from 'react';

/** Minimal page title — Clive: title only, no stats below. */
const FundingHero = ({ categoryLabel = null }) => {
  const isCategoryView = Boolean(categoryLabel);

  return (
    <section className="relative bg-[#02a95c] overflow-hidden pt-14 sm:pt-16">
      <div className="relative page-container py-6 sm:py-8">
        <div className="text-center">
          <h1 className="text-xl sm:text-2xl lg:text-3xl font-bold text-white leading-tight">
            {isCategoryView ? categoryLabel : 'Business Funding'}
          </h1>
        </div>
      </div>
    </section>
  );
};

export default FundingHero;
