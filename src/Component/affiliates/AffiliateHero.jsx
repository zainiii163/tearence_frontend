import React from 'react';
import { FaStore, FaGraduationCap } from 'react-icons/fa';
import BrowseMarketplaceHero from '../shared/BrowseMarketplaceHero';
import { getCategoryTheme } from '../../constants/categoryThemes';

const HERO_BG =
  'https://images.unsplash.com/photo-1460925895917-afdab827c52f?auto=format&fit=crop&w=1920&q=80';

/**
 * Affiliates landing — Clive:
 * “Affiliate” centred → search → Marketplace + Courses buttons → promoted ads below.
 */
const AffiliateHero = (props) => {
  return (
    <BrowseMarketplaceHero
      title="Affiliate"
      eyebrow=""
      subtitle="Tag and promote brand products — hop links currently being posted"
      imageUrl={HERO_BG}
      theme={getCategoryTheme('affiliate').heroTheme}
      searchPlaceholder="Search affiliate ads…"
      {...props}
      heroChipSize="lg"
      heroChips={[
        {
          to: '/affiliates/marketplace',
          label: 'Marketplace',
          icon: <FaStore className="h-3.5 w-3.5" />,
        },
        {
          to: '/affiliates/courses',
          label: 'Courses',
          icon: <FaGraduationCap className="h-3.5 w-3.5" />,
        },
      ]}
    />
  );
};

export default AffiliateHero;
