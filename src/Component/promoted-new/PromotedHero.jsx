import React from 'react';
import { FaRocket, FaImage } from 'react-icons/fa';
import BrowseMarketplaceHero from '../shared/BrowseMarketplaceHero';
import { getCategoryTheme } from '../../constants/categoryThemes';

const HERO_BG =
  'https://images.unsplash.com/photo-1557804506-669a67965ba0?auto=format&fit=crop&w=1920&q=80';

export const paidAdvertChips = (active) => [
  {
    to: '/paid-adverts?tab=promoted',
    label: 'Promoted Ads',
    icon: <FaRocket className="h-3.5 w-3.5" />,
    active: active === 'promoted',
  },
  {
    to: '/paid-adverts?tab=banners',
    label: 'Banner Ads',
    icon: <FaImage className="h-3.5 w-3.5" />,
    active: active === 'banners',
  },
];

/** Paid Adverts → Promoted tab */
const PromotedHero = (props) => (
  <BrowseMarketplaceHero
    title="Paid Adverts"
    eyebrow=""
    subtitle="Promoted campaigns that push your offer ahead of standard posts"
    imageUrl={HERO_BG}
    theme={getCategoryTheme('promoted').heroTheme}
    searchPlaceholder="Search promoted adverts…"
    {...props}
    heroChipSize="lg"
    heroChips={paidAdvertChips('promoted')}
  />
);

export default PromotedHero;
