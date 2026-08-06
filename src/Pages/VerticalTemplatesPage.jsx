import React from 'react';
import { useSearchParams } from 'react-router-dom';
import UnifiedNavbar from '../Component/UnifiedNavbar';
import Footer from '../Component/Footer';
import BrowsePageBackBar from '../Component/shared/BrowsePageBackBar';
import TemplateCatalogShop from '../Component/shared/TemplateCatalogShop';
import '../styles/property.css';

const PAGE_CONFIG = {
  'buy-sell': {
    title: 'Buy & Sell Templates',
    subtitle: 'Sale agreements, listing packs, invoices and trader documents — buy & download.',
    backHref: '/buy-sell',
    vertical: 'buy-sell',
    theme: 'green',
    sellLabel: 'Sell a template',
    heroBg:
      'https://images.unsplash.com/photo-1556742049-0cfed4f6a45d?auto=format&fit=crop&w=1920&q=80',
    overlay:
      'linear-gradient(135deg, rgba(6, 78, 59, 0.88) 0%, rgba(4, 120, 87, 0.78) 45%, rgba(15, 118, 110, 0.85) 100%)',
  },
  business: {
    title: 'Business Templates',
    subtitle: 'Pitch decks, grants, plans and contracts — buy & download from Worldwide Adverts.',
    backHref: '/business',
    vertical: 'business',
    theme: 'purple',
    sellLabel: 'Sell a template',
    heroBg:
      'https://images.unsplash.com/photo-1497366216548-37526070297c?auto=format&fit=crop&w=1920&q=80',
    overlay:
      'linear-gradient(135deg, rgba(67, 56, 202, 0.88) 0%, rgba(126, 34, 206, 0.78) 45%, rgba(157, 23, 77, 0.82) 100%)',
  },
  property: {
    title: 'Property Templates',
    subtitle: 'Agency plans, investment decks and landlord packs — buy & download.',
    backHref: '/property',
    vertical: 'property',
    theme: 'slate',
    sellLabel: 'Sell a template',
    heroBg:
      'https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?auto=format&fit=crop&w=1920&q=80',
    overlay:
      'linear-gradient(135deg, rgba(12, 21, 32, 0.88) 0%, rgba(26, 40, 56, 0.75) 45%, rgba(12, 21, 32, 0.82) 100%)',
  },
  services: {
    title: 'Services Templates',
    subtitle: 'SOWs, proposals, rate cards and freelance contracts — buy & download.',
    backHref: '/services',
    vertical: 'services',
    theme: 'emerald',
    sellLabel: 'Sell a template',
    heroBg:
      'https://images.unsplash.com/photo-1522071820081-009f0129c71c?auto=format&fit=crop&w=1920&q=80',
    overlay:
      'linear-gradient(135deg, rgba(17, 94, 89, 0.9) 0%, rgba(6, 78, 59, 0.82) 45%, rgba(19, 78, 74, 0.88) 100%)',
  },
  vehicles: {
    title: 'Vehicle Templates',
    subtitle: 'Dealer plans, stock finance packs and transport grants — buy & download.',
    backHref: '/vehicles',
    vertical: 'vehicles',
    theme: 'red',
    sellLabel: 'Sell a template',
    heroBg:
      'https://images.unsplash.com/photo-1492144534655-ae79c964c9d7?auto=format&fit=crop&w=1920&q=80',
    overlay:
      'linear-gradient(135deg, rgba(17, 24, 39, 0.9) 0%, rgba(127, 29, 29, 0.78) 50%, rgba(17, 24, 39, 0.88) 100%)',
  },
  books: {
    title: 'Books & Author Templates',
    subtitle: 'Book proposals, author pitches and publishing grants — buy & download.',
    backHref: '/books',
    vertical: 'books',
    theme: 'amber',
    sellLabel: 'Sell a template',
    heroBg:
      'https://images.unsplash.com/photo-1481627834876-b7833e8f5040?auto=format&fit=crop&w=1920&q=80',
    overlay:
      'linear-gradient(135deg, rgba(180, 83, 9, 0.9) 0%, rgba(217, 119, 6, 0.82) 45%, rgba(234, 88, 12, 0.88) 100%)',
  },
  'businesses-for-sale': {
    title: 'Business Sale Templates',
    subtitle: 'Sale prospectus, CIM packs and acquisition checklists — buy & download.',
    backHref: '/businesses-for-sale',
    vertical: 'businesses-for-sale',
    theme: 'orange',
    sellLabel: 'Sell a template',
    heroBg:
      'https://images.unsplash.com/photo-1454165804606-c3d57bc86b40?auto=format&fit=crop&w=1920&q=80',
    overlay:
      'linear-gradient(135deg, rgba(194, 65, 12, 0.9) 0%, rgba(234, 88, 12, 0.82) 45%, rgba(225, 29, 72, 0.85) 100%)',
  },
  jobs: {
    title: 'Jobs Templates',
    subtitle: 'Resume, CV, cover letters, job descriptions and hiring packs — buy & download.',
    backHref: '/jobs',
    vertical: 'jobs',
    theme: 'blue',
    sellLabel: 'Sell a template',
    heroBg:
      'https://images.unsplash.com/photo-1521737711867-e3b97375f902?auto=format&fit=crop&w=1920&q=80',
    overlay:
      'linear-gradient(135deg, rgba(23, 37, 84, 0.9) 0%, rgba(29, 78, 216, 0.8) 45%, rgba(14, 116, 144, 0.85) 100%)',
  },
};

const VerticalTemplatesPage = ({ vertical = 'business' }) => {
  const config = PAGE_CONFIG[vertical] || PAGE_CONFIG.business;
  const [searchParams] = useSearchParams();
  const categoryKey = searchParams.get('category') || '';
  const isSlate = config.theme === 'slate';

  return (
    <div className={`min-h-screen ${isSlate ? 'property-marketplace' : 'bg-gray-50'}`}>
      <UnifiedNavbar showBackButton backHref={config.backHref} />

      <div
        className="relative overflow-hidden pt-14 sm:pt-16"
        style={{
          backgroundImage: `${config.overlay}, url('${config.heroBg}')`,
          backgroundSize: 'cover',
          backgroundPosition: 'center',
        }}
      >
        <div className="page-container py-8 sm:py-10 text-center">
          {isSlate && <p className="prop-label text-[#b8895a] mb-2">Documents</p>}
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
        <BrowsePageBackBar to={config.backHref} label={`Back to ${config.title.replace(/ Templates$/, '')}`} />
        <TemplateCatalogShop
          vertical={config.vertical}
          categoryKey={categoryKey}
          theme={config.theme}
          sellLabel={config.sellLabel}
          backHref={config.backHref}
          backLabel={
            config.vertical === 'buy-sell'
              ? 'Back to Buy & Sell'
              : `Back to ${config.title.replace(/ Templates$/, '')}`
          }
        />
      </div>

      <Footer />
    </div>
  );
};

export default VerticalTemplatesPage;
