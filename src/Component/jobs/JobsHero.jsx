import React from 'react';
import { FiFileText, FiUsers, FiBriefcase } from 'react-icons/fi';
import { Calculator } from 'lucide-react';
import BrowseMarketplaceHero from '../shared/BrowseMarketplaceHero';
import { getCategoryTheme } from '../../constants/categoryThemes';

const HERO_BG =
  'https://images.unsplash.com/photo-1521737711867-e3b97375f902?auto=format&fit=crop&w=1920&q=80';

const DEFAULT_JOB_CHIPS = [
  {
    to: '/jobs/seekers',
    label: 'Job Seekers',
    icon: <FiUsers className="h-3 w-3 text-blue-700" />,
  },
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
  {
    to: '/jobs/vacancies',
    label: 'Vacancies',
    icon: <FiBriefcase className="h-3 w-3 text-blue-700" />,
  },
];

const JobsHero = ({
  title = 'Jobs & Vacancies',
  titlePrefix = 'Jobs',
  eyebrow = 'Jobs',
  heroChips = DEFAULT_JOB_CHIPS,
  ...props
}) => (
  <BrowseMarketplaceHero
    title={title}
    titlePrefix={titlePrefix}
    eyebrow={eyebrow}
    imageUrl={HERO_BG}
    theme={getCategoryTheme('jobs').heroTheme}
    searchPlaceholder="Search jobs, companies, skills…"
    heroChips={heroChips}
    {...props}
  />
);

export default JobsHero;
