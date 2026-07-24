import React from 'react';
import { Link } from 'react-router-dom';
import { FiFileText } from 'react-icons/fi';
import { Calculator } from 'lucide-react';

const THEMES = {
  green: {
    templates: 'border-emerald-200 bg-emerald-50 text-emerald-800 hover:bg-emerald-100',
    calculators: 'border-teal-200 bg-teal-50 text-teal-800 hover:bg-teal-100',
  },
  purple: {
    templates: 'border-violet-200 bg-violet-50 text-violet-800 hover:bg-violet-100',
    calculators: 'border-fuchsia-200 bg-fuchsia-50 text-fuchsia-800 hover:bg-fuchsia-100',
  },
  emerald: {
    templates: 'border-emerald-200 bg-emerald-50 text-emerald-800 hover:bg-emerald-100',
    calculators: 'border-teal-200 bg-teal-50 text-teal-800 hover:bg-teal-100',
  },
  orange: {
    templates: 'border-orange-200 bg-orange-50 text-orange-800 hover:bg-orange-100',
    calculators: 'border-amber-200 bg-amber-50 text-amber-800 hover:bg-amber-100',
  },
  blue: {
    templates: 'border-sky-200 bg-sky-50 text-sky-800 hover:bg-sky-100',
    calculators: 'border-blue-200 bg-blue-50 text-blue-800 hover:bg-blue-100',
  },
  slate: {
    templates: 'property-resource-link',
    calculators: 'property-resource-link',
  },
};

/**
 * Links to dedicated Templates and Calculators pages (Clive: separate pages, not inline blocks).
 */
const BrowseResourceLinks = ({
  templatesHref,
  calculatorsHref,
  theme = 'green',
  templatesLabel = 'Business Templates',
  calculatorsLabel = 'Calculators',
  showTemplates = true,
  showCalculators = true,
}) => {
  const t = THEMES[theme] || THEMES.green;

  if (!showTemplates && !showCalculators) return null;

  const isSlate = theme === 'slate';
  const linkBase = isSlate
    ? ''
    : 'inline-flex items-center gap-1.5 px-3.5 py-2 text-xs sm:text-sm font-semibold rounded-lg border transition-colors';

  return (
    <div className={`flex flex-wrap gap-2 mb-4 sm:mb-5 ${isSlate ? 'mb-6 sm:mb-8' : ''}`}>
      {showTemplates && templatesHref && (
        <Link
          to={templatesHref}
          className={`${linkBase} ${t.templates}`}
        >
          <FiFileText className="h-3.5 w-3.5 shrink-0" />
          {templatesLabel}
        </Link>
      )}
      {showCalculators && calculatorsHref && (
        <Link
          to={calculatorsHref}
          className={`${linkBase} ${t.calculators}`}
        >
          <Calculator className="h-3.5 w-3.5 shrink-0" />
          {calculatorsLabel}
        </Link>
      )}
    </div>
  );
};

export default BrowseResourceLinks;
