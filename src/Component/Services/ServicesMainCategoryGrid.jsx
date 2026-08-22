import React from 'react';
import { motion } from 'framer-motion';
import {
  Monitor,
  Calculator,
  Scale,
  Cog,
  Compass,
  ArrowRight,
} from 'lucide-react';

const ICON_MAP = {
  Monitor,
  Calculator,
  Scale,
  Cog,
  Compass,
};

const COLOR_STYLES = {
  emerald: {
    iconBg: 'bg-emerald-100 group-hover:bg-emerald-200',
    iconText: 'text-emerald-700',
    border: 'hover:border-emerald-400',
    accent: 'group-hover:text-emerald-700',
    ring: 'group-hover:ring-emerald-100',
  },
  amber: {
    iconBg: 'bg-amber-100 group-hover:bg-amber-200',
    iconText: 'text-amber-700',
    border: 'hover:border-amber-400',
    accent: 'group-hover:text-amber-700',
    ring: 'group-hover:ring-amber-100',
  },
  indigo: {
    iconBg: 'bg-indigo-100 group-hover:bg-indigo-200',
    iconText: 'text-indigo-700',
    border: 'hover:border-indigo-400',
    accent: 'group-hover:text-indigo-700',
    ring: 'group-hover:ring-indigo-100',
  },
  orange: {
    iconBg: 'bg-orange-100 group-hover:bg-orange-200',
    iconText: 'text-orange-700',
    border: 'hover:border-orange-400',
    accent: 'group-hover:text-orange-700',
    ring: 'group-hover:ring-orange-100',
  },
  teal: {
    iconBg: 'bg-teal-100 group-hover:bg-teal-200',
    iconText: 'text-teal-700',
    border: 'hover:border-teal-400',
    accent: 'group-hover:text-teal-700',
    ring: 'group-hover:ring-teal-100',
  },
};

const SLUG_ICON_MAP = {
  'it-computing': Monitor,
  'accounting-finance': Calculator,
  'legal-services': Scale,
  'engineering': Cog,
  'architecture-surveying': Compass,
};

const CategoryCard = ({ group, onSelectGroup, index, isLast }) => {
  const Icon = ICON_MAP[group.icon] || SLUG_ICON_MAP[group.slug] || Monitor;
  const colors = COLOR_STYLES[group.color] || COLOR_STYLES.emerald;
  const subCount = group.subcategories?.length || 0;
  return (
    <motion.button
      type="button"
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: index * 0.06, duration: 0.3 }}
      whileHover={{ y: -3 }}
      onClick={() => onSelectGroup(group)}
      className={`group relative flex items-center gap-4 bg-white border border-gray-200 rounded-2xl px-4 py-4 sm:px-5 sm:py-5 text-left shadow-sm hover:shadow-lg transition-all ring-0 hover:ring-4 ${colors.border} ${colors.ring} ${
        isLast ? 'sm:col-span-2 sm:max-w-[calc(50%-0.5rem)] sm:mx-auto sm:w-full' : ''
      }`}
    >
      <span
        className={`flex h-12 w-12 sm:h-14 sm:w-14 shrink-0 items-center justify-center rounded-xl transition-colors ${colors.iconBg}`}
      >
        <Icon className={`h-6 w-6 sm:h-7 sm:w-7 ${colors.iconText}`} strokeWidth={1.75} />
      </span>

      <span className="flex-1 min-w-0">
        <span className={`block text-sm sm:text-base font-bold text-gray-900 leading-snug ${colors.accent}`}>
          {group.name}
        </span>
        <span className="mt-1.5 inline-flex items-center gap-1 text-[11px] font-semibold text-gray-400 group-hover:text-emerald-600 transition-colors">
          {subCount} subcategories
          <ArrowRight className="h-3 w-3 opacity-0 -translate-x-1 group-hover:opacity-100 group-hover:translate-x-0 transition-all" />
        </span>
      </span>
    </motion.button>
  );
};

/**
 * Top-level category tiles — Clive mockup, enhanced Fiverr-style cards.
 */
const ServicesMainCategoryGrid = ({ groups = [], onSelectGroup }) => (
  <section>
    <div className="text-center mb-5 sm:mb-6">
      <h2 className="text-lg sm:text-xl font-extrabold text-gray-900">Browse by category</h2>
    </div>

    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4 max-w-3xl mx-auto">
      {groups.map((group, index) => (
        <CategoryCard
          key={group.slug}
          group={group}
          onSelectGroup={onSelectGroup}
          index={index}
          isLast={index === groups.length - 1 && groups.length % 2 !== 0}
        />
      ))}
    </div>
  </section>
);

export default ServicesMainCategoryGrid;
