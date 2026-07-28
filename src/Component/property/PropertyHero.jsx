import React from 'react';
import BrowseMarketplaceHero from '../shared/BrowseMarketplaceHero';

const HERO_BG =
  'https://images.unsplash.com/photo-1560518883-ce09059eeffa?auto=format&fit=crop&w=1920&q=80';

const PropertyHero = (props) => (
  <BrowseMarketplaceHero
    title="Global Property Marketplace"
    eyebrow="Property"
    imageUrl={HERO_BG}
    theme="slate"
    searchPlaceholder="Search city, address or keyword…"
    templatesHref="/property/templates"
    calculatorsHref="/property/calculators"
    {...props}
  />
);

export default PropertyHero;
