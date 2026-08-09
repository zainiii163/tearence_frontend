import React from 'react';
import BrowseMarketplaceHero from '../shared/BrowseMarketplaceHero';
import { getCategoryTheme } from '../../constants/categoryThemes';

const HERO_BG =
  'https://images.unsplash.com/photo-1497366216548-37526070297c?auto=format&fit=crop&w=1920&q=80';

const BusinessHero = (props) => (
  <BrowseMarketplaceHero
    title="Businesses"
    titlePrefix="Business"
    eyebrow="Business"
    subtitle="Discover companies and services worldwide"
    imageUrl={HERO_BG}
    theme={getCategoryTheme('business').heroTheme}
    searchPlaceholder="Search businesses…"
    templatesHref="/business/templates"
    calculatorsHref="/business/calculators"
    templatesLabel="Templates"
    {...props}
  />
);

export default BusinessHero;
