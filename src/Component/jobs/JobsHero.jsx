import React from 'react';
import { FiFileText } from 'react-icons/fi';
import { Calculator } from 'lucide-react';
import BrowseMarketplaceHero from '../shared/BrowseMarketplaceHero';
import { getCategoryTheme } from '../../constants/categoryThemes';

const HERO_BG =
  'https://images.unsplash.com/photo-1521737711867-e3b97375f902?auto=format&fit=crop&w=1920&q=80';

const DEFAULT_JOB_CHIPS = [
  {
    to: '/jobs/templates',
    label: 'Templates',
    icon: <FiFileText className="h-3 w-3 text-blue-700" />,
  },
  {
    to: '/jobs/calculators',
    label: 'Calculators',
    icon: <Calculator className="h-3 w-3 text-blue-700" />,
  },
];

const JobsHero = ({
  title = 'Jobs',
  heroChips = DEFAULT_JOB_CHIPS,
  ...props
}) => (
  <BrowseMarketplaceHero
    title={title}
    eyebrow=""
    imageUrl={HERO_BG}
    theme={getCategoryTheme('jobs').heroTheme}
    searchPlaceholder="Search jobs, companies, skills…"
    heroChips={heroChips}
    {...props}
  />
);

export default JobsHero;
