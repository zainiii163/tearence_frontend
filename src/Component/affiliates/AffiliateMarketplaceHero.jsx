import React from 'react';
import { FaStore } from 'react-icons/fa';
import BrowseMarketplaceHero from '../shared/BrowseMarketplaceHero';
import { getCategoryTheme } from '../../constants/categoryThemes';
import AffiliateHubNav from './AffiliateHubNav';

const HERO_BG =
  'https://images.unsplash.com/photo-1460925895917-afdab827c52f?auto=format&fit=crop&w=1600&q=80';

/**
 * Marketplace — businesses offering products/services for affiliates to promote.
 */
const AffiliateMarketplaceHero = ({
  onSellClick,
  showSellCta = true,
  ...props
}) => {
  const chips = showSellCta && onSellClick
    ? [
        {
          label: 'List product / service',
          icon: <FaStore className="h-3.5 w-3.5" />,
          onClick: onSellClick,
        },
      ]
    : [];

  return (
    <div>
      <BrowseMarketplaceHero
        title="Marketplace"
        eyebrow=""
        subtitle="Brands list products and deals. Apply to tag, promote, and earn commission."
        imageUrl={HERO_BG}
        theme={getCategoryTheme('affiliate').heroTheme}
        searchPlaceholder="Search products, services, niches…"
        {...props}
        heroChipSize="lg"
        heroChips={chips}
      />
      <div className="relative z-10 -mt-1 mb-3 flex justify-center px-4">
        <AffiliateHubNav />
      </div>
    </div>
  );
};

export default AffiliateMarketplaceHero;
