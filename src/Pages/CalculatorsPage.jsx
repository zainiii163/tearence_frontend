import React, { useState } from 'react';
import { Calculator } from 'lucide-react';
import UnifiedNavbar from '../Component/UnifiedNavbar';
import Footer from '../Component/Footer';
import BrowsePageBackBar from '../Component/shared/BrowsePageBackBar';
import CalculatorCategoryGrid from '../Component/shared/CalculatorCategoryGrid';
import CalculatorFeaturedAds from '../Component/shared/CalculatorFeaturedAds';
import VehicleCalculators from '../Component/calculators/VehicleCalculators';
import RealEstateCalculators from '../Component/calculators/RealEstateCalculators';
import BusinessCalculators from '../Component/calculators/BusinessCalculators';
import TradingCalculators from '../Component/calculators/TradingCalculators';
import ServicesCalculators from '../Component/calculators/ServicesCalculators';
import JobsCalculators from '../Component/calculators/JobsCalculators';
import { CALCULATOR_HUB_CATEGORIES } from '../constants/calculatorHubCategories';

const TAB_AD_VERTICAL = {
  trading: 'buy-sell',
  vehicles: 'vehicles',
  property: 'property',
  business: 'business',
  services: 'services',
  jobs: 'hub',
};

const CalculatorsPage = () => {
  const [tab, setTab] = useState('trading');

  return (
    <div className="min-h-screen bg-gray-50">
      <UnifiedNavbar showBackButton backHref="/" />

      <div className="bg-gradient-to-br from-teal-800 via-emerald-800 to-teal-900 pt-14 sm:pt-16">
        <div className="page-container py-8 text-center">
          <Calculator className="w-10 h-10 text-emerald-200 mx-auto mb-2" />
          <h1 className="text-2xl sm:text-3xl font-extrabold text-white">Calculators</h1>
          <p className="mt-2 text-sm text-emerald-50/90 max-w-xl mx-auto">
            Free tools for trading, vehicles, property, business, services and jobs.
          </p>
        </div>
      </div>

      <div className="page-container py-4 sm:py-6">
        <BrowsePageBackBar to="/" label="Back to Home" />
        <CalculatorCategoryGrid
          categories={CALCULATOR_HUB_CATEGORIES}
          selectedId={tab}
          onSelect={setTab}
          theme="emerald"
          title="Calculators"
        />

        {tab === 'trading' && <TradingCalculators compact hideHeader />}
        {tab === 'vehicles' && <VehicleCalculators hideHeader />}
        {tab === 'property' && <RealEstateCalculators hideHeader />}
        {tab === 'business' && <BusinessCalculators hideHeader />}
        {tab === 'services' && <ServicesCalculators hideHeader />}
        {tab === 'jobs' && <JobsCalculators hideHeader />}

        <CalculatorFeaturedAds vertical={TAB_AD_VERTICAL[tab] || 'hub'} theme="emerald" />
      </div>

      <Footer />
    </div>
  );
};

export default CalculatorsPage;
