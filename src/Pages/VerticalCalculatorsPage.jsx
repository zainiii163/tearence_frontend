import React from 'react';
import UnifiedNavbar from '../Component/UnifiedNavbar';
import Footer from '../Component/Footer';
import BrowsePageBackBar from '../Component/shared/BrowsePageBackBar';
import BusinessCalculators from '../Component/calculators/BusinessCalculators';
import ServicesCalculators from '../Component/calculators/ServicesCalculators';
import TradingCalculators from '../Component/calculators/TradingCalculators';
import RealEstateCalculators from '../Component/calculators/RealEstateCalculators';
import VehicleCalculators from '../Component/calculators/VehicleCalculators';
import JobsCalculators from '../Component/calculators/JobsCalculators';
import CalculatorFeaturedAds from '../Component/shared/CalculatorFeaturedAds';
import '../styles/property.css';

const PAGE_CONFIG = {
  'buy-sell': {
    title: 'Buy & Sell Calculators',
    subtitle: 'Profit margin, markup, and resale tools for buyers and sellers.',
    backHref: '/buy-sell',
    theme: 'green',
    Calculator: TradingCalculators,
    calculatorProps: { compact: true },
    adsVertical: 'buy-sell',
    heroBg:
      'https://images.unsplash.com/photo-1556742049-0cfed4f6a45d?auto=format&fit=crop&w=1920&q=80',
    overlay:
      'linear-gradient(135deg, rgba(6, 78, 59, 0.88) 0%, rgba(4, 120, 87, 0.78) 45%, rgba(15, 118, 110, 0.85) 100%)',
  },
  classifieds: {
    title: 'Classifieds Calculators',
    subtitle: 'Pricing and resale tools for classified listings.',
    backHref: '/classifieds-ads',
    theme: 'teal',
    Calculator: TradingCalculators,
    calculatorProps: { compact: true },
    adsVertical: 'buy-sell',
    heroBg:
      'https://images.unsplash.com/photo-1556740749-887f6717d7e4?auto=format&fit=crop&w=1920&q=80',
    overlay:
      'linear-gradient(135deg, rgba(13, 148, 136, 0.88) 0%, rgba(15, 118, 110, 0.78) 45%, rgba(4, 120, 87, 0.85) 100%)',
  },
  business: {
    title: 'Business Calculators',
    subtitle: 'ROI, break-even, payroll, and business planning tools.',
    backHref: '/business',
    theme: 'purple',
    Calculator: BusinessCalculators,
    calculatorProps: {},
    adsVertical: 'business',
    heroBg:
      'https://images.unsplash.com/photo-1497366216548-37526070297c?auto=format&fit=crop&w=1920&q=80',
    overlay:
      'linear-gradient(135deg, rgba(67, 56, 202, 0.88) 0%, rgba(126, 34, 206, 0.78) 45%, rgba(157, 23, 77, 0.82) 100%)',
  },
  services: {
    title: 'Services Calculators',
    subtitle: 'Freelance rates, project pricing, and tech service cost tools.',
    backHref: '/services',
    theme: 'emerald',
    Calculator: ServicesCalculators,
    calculatorProps: {},
    adsVertical: 'services',
    heroBg:
      'https://images.unsplash.com/photo-1522071820081-009f0129c71c?auto=format&fit=crop&w=1920&q=80',
    overlay:
      'linear-gradient(135deg, rgba(17, 94, 89, 0.9) 0%, rgba(6, 78, 59, 0.82) 45%, rgba(19, 78, 74, 0.88) 100%)',
  },
  property: {
    title: 'Property Calculators',
    subtitle: 'Mortgage, affordability, ROI, rent vs buy, and closing cost tools.',
    backHref: '/property',
    theme: 'slate',
    Calculator: RealEstateCalculators,
    calculatorProps: {},
    adsVertical: 'property',
    heroBg:
      'https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?auto=format&fit=crop&w=1920&q=80',
    overlay:
      'linear-gradient(135deg, rgba(12, 21, 32, 0.88) 0%, rgba(26, 40, 56, 0.75) 45%, rgba(12, 21, 32, 0.82) 100%)',
  },
  vehicles: {
    title: 'Vehicle Calculators',
    subtitle: 'Loan, lease, fuel and trade-in tools for cars and commercial vehicles.',
    backHref: '/vehicles',
    theme: 'red',
    Calculator: VehicleCalculators,
    calculatorProps: {},
    adsVertical: 'vehicles',
    heroBg:
      'https://images.unsplash.com/photo-1492144534655-ae79c964c9d7?auto=format&fit=crop&w=1920&q=80',
    overlay:
      'linear-gradient(135deg, rgba(17, 24, 39, 0.9) 0%, rgba(127, 29, 29, 0.78) 50%, rgba(17, 24, 39, 0.88) 100%)',
  },
  books: {
    title: 'Books Calculators',
    subtitle: 'Royalty, print-run and pricing tools for authors and sellers.',
    backHref: '/books',
    theme: 'amber',
    Calculator: TradingCalculators,
    calculatorProps: { compact: true },
    adsVertical: 'hub',
    heroBg:
      'https://images.unsplash.com/photo-1481627834876-b7833e8f5040?auto=format&fit=crop&w=1920&q=80',
    overlay:
      'linear-gradient(135deg, rgba(180, 83, 9, 0.9) 0%, rgba(217, 119, 6, 0.82) 45%, rgba(234, 88, 12, 0.88) 100%)',
  },
  'businesses-for-sale': {
    title: 'Business Sale Calculators',
    subtitle: 'Valuation, ROI and deal-structure tools for buyers and sellers.',
    backHref: '/businesses-for-sale',
    theme: 'orange',
    Calculator: BusinessCalculators,
    calculatorProps: {},
    adsVertical: 'business',
    heroBg:
      'https://images.unsplash.com/photo-1454165804606-c3d57bc86b40?auto=format&fit=crop&w=1920&q=80',
    overlay:
      'linear-gradient(135deg, rgba(194, 65, 12, 0.9) 0%, rgba(234, 88, 12, 0.82) 45%, rgba(225, 29, 72, 0.85) 100%)',
  },
  jobs: {
    title: 'Jobs Calculators',
    subtitle: 'Salary, take-home pay, raises, contract day rates and hiring costs.',
    backHref: '/jobs',
    theme: 'blue',
    Calculator: JobsCalculators,
    calculatorProps: {},
    adsVertical: 'hub',
    heroBg:
      'https://images.unsplash.com/photo-1521737711867-e3b97375f902?auto=format&fit=crop&w=1920&q=80',
    overlay:
      'linear-gradient(135deg, rgba(23, 37, 84, 0.9) 0%, rgba(29, 78, 216, 0.8) 45%, rgba(14, 116, 144, 0.85) 100%)',
  },
};

const VerticalCalculatorsPage = ({ vertical = 'business' }) => {
  const config = PAGE_CONFIG[vertical] || PAGE_CONFIG.business;
  const Calculator = config.Calculator;
  const isSlate = config.theme === 'slate';

  return (
    <div className={`min-h-screen ${isSlate ? 'property-marketplace' : 'bg-gray-50'}`}>
      <UnifiedNavbar showBackButton backHref={config.backHref} />

      <div
        className="relative overflow-hidden"
        style={{
          backgroundImage: `${config.overlay}, url('${config.heroBg}')`,
          backgroundSize: 'cover',
          backgroundPosition: 'center',
        }}
      >
        <div className="page-container py-8 sm:py-10 text-center">
          {isSlate && <p className="prop-label text-[#b8895a] mb-2">Tools</p>}
          <h1
            className={`${
              isSlate
                ? 'prop-display text-4xl sm:text-5xl'
                : 'text-2xl sm:text-3xl lg:text-4xl font-bold'
            } text-white drop-shadow-sm`}
          >
            {config.title}
          </h1>
          <p className="mt-2 text-sm text-white/90 max-w-2xl mx-auto">{config.subtitle}</p>
        </div>
      </div>

      <div className="page-container py-4 sm:py-6">
        <BrowsePageBackBar to={config.backHref} label={`Back to ${config.backHref.replace(/^\//, '').replace(/-/g, ' ') || 'Home'}`} />
        <Calculator {...(config.calculatorProps || {})} hideHeader />

        <CalculatorFeaturedAds vertical={config.adsVertical} theme={config.theme} />
      </div>

      <Footer />
    </div>
  );
};

export default VerticalCalculatorsPage;
