import React from 'react';
import { Building2, Landmark } from 'lucide-react';
import BrowseMarketplaceHero from '../shared/BrowseMarketplaceHero';
import { getCategoryTheme } from '../../constants/categoryThemes';

const HERO_BG =
  'https://images.unsplash.com/photo-1553729459-efe14ef6055d?auto=format&fit=crop&w=1920&q=80';

const FundingCrowdfundHero = ({
  categoryLabel = null,
  searchValue = '',
  onSearchChange,
  onSearchSubmit,
}) => (
  <BrowseMarketplaceHero
    title="Business Funding"
    eyebrow=""
    imageUrl={HERO_BG}
    theme={getCategoryTheme('funding').heroTheme}
    categoryLabel={categoryLabel}
    searchValue={searchValue}
    onSearchChange={onSearchChange}
    onSearchSubmit={onSearchSubmit}
    searchPlaceholder="Search campaigns…"
    heroChips={[
      {
        to: '/funding/venture-capital',
        label: 'Venture Capital',
        icon: <Building2 className="h-3.5 w-3.5 text-emerald-700" />,
      },
      {
        to: '/funding/loans',
        label: 'Business Loans',
        icon: <Landmark className="h-3.5 w-3.5 text-emerald-700" />,
      },
    ]}
  />
);

export default FundingCrowdfundHero;
