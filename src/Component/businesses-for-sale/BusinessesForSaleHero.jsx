import React from 'react';
import BrowseMarketplaceHero from '../shared/BrowseMarketplaceHero';
import { getCategoryTheme } from '../../constants/categoryThemes';

const HERO_BG =
  'https://images.unsplash.com/photo-1454165804606-c3d57bc86b40?auto=format&fit=crop&w=1920&q=80';

const BusinessesForSaleHero = (props) => (
  <BrowseMarketplaceHero
    title="Businesses for Sale"
    titlePrefix="Businesses for Sale"
    eyebrow="For sale"
    subtitle="Buy or sell online and physical businesses worldwide"
    imageUrl={HERO_BG}
    theme={getCategoryTheme('investment').heroTheme}
    searchPlaceholder="Search by business name…"
    templatesHref="/businesses-for-sale/templates"
    calculatorsHref="/businesses-for-sale/calculators"
    templatesLabel="Templates"
    {...props}
  />
);

export default BusinessesForSaleHero;
