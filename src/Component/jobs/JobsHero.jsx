import React from 'react';
import BrowseMarketplaceHero from '../shared/BrowseMarketplaceHero';

const HERO_BG =
  'https://images.unsplash.com/photo-1521737711867-e3b97375f902?auto=format&fit=crop&w=1920&q=80';

const JobsHero = (props) => (
  <BrowseMarketplaceHero
    title="Jobs"
    titlePrefix="Jobs"
    eyebrow="Jobs"
    imageUrl={HERO_BG}
    theme="blue"
    searchPlaceholder="Search jobs, companies, skills…"
    templatesHref="/jobs/templates"
    calculatorsHref="/jobs/calculators"
    {...props}
  />
);

export default JobsHero;
