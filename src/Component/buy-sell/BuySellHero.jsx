import React from 'react';
import BrowseMarketplaceHero from '../shared/BrowseMarketplaceHero';

const HERO_BG =
  'https://images.unsplash.com/photo-1607082349566-187342175e2f?auto=format&fit=crop&w=1920&q=80';

const BuySellHero = (props) => (
  <BrowseMarketplaceHero
    title="Buy & Sell"
    eyebrow="Marketplace"
    imageUrl={HERO_BG}
    theme="emerald"
    searchPlaceholder="Search by item name…"
    templatesHref="/buy-sell/templates"
    calculatorsHref="/buy-sell/calculators"
    {...props}
  />
);

export default BuySellHero;
