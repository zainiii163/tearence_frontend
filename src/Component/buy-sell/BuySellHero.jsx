import React from 'react';
import BrowseMarketplaceHero from '../shared/BrowseMarketplaceHero';
import { getCategoryTheme } from '../../constants/categoryThemes';

const HERO_BY_HUB = {
  'buy-sell':
    'https://images.unsplash.com/photo-1607082349566-187342175e2f?auto=format&fit=crop&w=1920&q=80',
  classifieds:
    'https://images.unsplash.com/photo-1556740749-887f6717d7e4?auto=format&fit=crop&w=1920&q=80',
};

const BuySellHero = ({ hubKey = 'buy-sell', ...props }) => {
  const theme = getCategoryTheme(hubKey);
  const title = theme?.name || 'Buy & Sell';

  return (
    <BrowseMarketplaceHero
      title={title}
      titlePrefix={title}
      eyebrow={title}
      imageUrl={HERO_BY_HUB[hubKey] || HERO_BY_HUB['buy-sell']}
      theme={theme.heroTheme}
      searchPlaceholder="Search by item name…"
      templatesHref={`${hubKey === 'classifieds' ? '/classifieds-ads' : '/buy-sell'}/templates`}
      calculatorsHref={`${hubKey === 'classifieds' ? '/classifieds-ads' : '/buy-sell'}/calculators`}
      {...props}
    />
  );
};

export default BuySellHero;
