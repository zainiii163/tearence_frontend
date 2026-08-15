import React from 'react';
import BrowseMarketplaceHero from '../shared/BrowseMarketplaceHero';
import { getCategoryTheme } from '../../constants/categoryThemes';

const HERO_BG =
  'https://images.unsplash.com/photo-1522071820081-009f0129c71c?auto=format&fit=crop&w=1920&q=80';

const ServicesSectionHero = (props) => (
  <BrowseMarketplaceHero
    title="Online Services"
    eyebrow=""
    imageUrl={HERO_BG}
    theme={getCategoryTheme('services').heroTheme}
    searchPlaceholder="Search services…"
    templatesHref="/services/templates"
    calculatorsHref="/services/calculators"
    {...props}
  />
);

export default ServicesSectionHero;
