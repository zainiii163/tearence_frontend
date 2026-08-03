import React from 'react';
import BrowseMarketplaceHero from '../shared/BrowseMarketplaceHero';

const HERO_BG =
  'https://images.unsplash.com/photo-1492144534655-ae79c964c9d7?auto=format&fit=crop&w=1920&q=80';

const VehicleHero = (props) => (
  <BrowseMarketplaceHero
    title="Vehicles"
    titlePrefix="Vehicles"
    eyebrow="Vehicles"
    subtitle="Cars, bikes and commercial vehicles worldwide"
    imageUrl={HERO_BG}
    theme="red"
    searchPlaceholder="Search by make, model or vehicle name…"
    templatesHref="/vehicles/templates"
    calculatorsHref="/vehicles/calculators"
    templatesLabel="Templates"
    {...props}
  />
);

export default VehicleHero;
