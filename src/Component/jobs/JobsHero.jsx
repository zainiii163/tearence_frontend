import React from 'react';
import { BriefcaseBusiness, Building2, Calculator, FileText } from 'lucide-react';
import BrowseMarketplaceHero from '../shared/BrowseMarketplaceHero';
import { getCategoryTheme } from '../../constants/categoryThemes';

const HERO_BG =
  'https://images.unsplash.com/photo-1521737711867-e3b97375f902?auto=format&fit=crop&w=1920&q=80';

const DEFAULT_JOB_CHIPS = [
  {
    to: '/jobs/seekers',
    label: 'Job Seekers',
    icon: <BriefcaseBusiness className="h-3 w-3 text-blue-700" />,
  },
  {
    to: '/jobs/vacancies',
    label: 'Vacancies',
    icon: <Building2 className="h-3 w-3 text-blue-700" />,
  },
  {
    to: '/jobs/templates',
    label: 'Templates',
    icon: <FileText className="h-3 w-3 text-blue-700" />,
  },
  {
    to: '/jobs/calculators',
    label: 'Calculators',
    icon: <Calculator className="h-3 w-3 text-blue-700" />,
  },
];

const JobsHero = ({
  title = 'Job Seekers & Vacancies',
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
