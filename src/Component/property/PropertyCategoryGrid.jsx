import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import {
  Home,
  Building,
  Factory,
  Trees,
  Star,
  Calendar,
  TrendingUp,
  Store,
  Briefcase,
  Hotel,
} from 'lucide-react';
import { usePropertyData } from '../../hooks/usePropertyData';

const FALLBACK_TYPES = [
  { id: 'residential', name: 'Residential', blurb: 'Homes & apartments' },
  { id: 'commercial', name: 'Commercial', blurb: 'Offices & retail' },
  { id: 'industrial', name: 'Industrial', blurb: 'Warehouses' },
  { id: 'land', name: 'Land & Plots', blurb: 'Development sites' },
  { id: 'agricultural', name: 'Agricultural', blurb: 'Farms & estates' },
  { id: 'luxury', name: 'Luxury', blurb: 'Premium residences' },
  { id: 'rental', name: 'Short-term', blurb: 'Holiday stays' },
  { id: 'investment', name: 'Investment', blurb: 'Yield opportunities' },
];

const iconFor = (name = '') => {
  const key = String(name).toLowerCase();
  if (key.includes('residential') || key.includes('home')) return Home;
  if (key.includes('commercial') || key.includes('office')) return Building;
  if (key.includes('industrial') || key.includes('warehouse')) return Factory;
  if (key.includes('land') || key.includes('plot') || key.includes('agricultur')) return Trees;
  if (key.includes('luxury')) return Star;
  if (key.includes('rental') || key.includes('holiday') || key.includes('short')) return Calendar;
  if (key.includes('invest')) return TrendingUp;
  if (key.includes('retail') || key.includes('shop')) return Store;
  if (key.includes('hotel')) return Hotel;
  if (key.includes('office')) return Briefcase;
  return Home;
};

/** Architectural type tiles — not the chip grid used on Buy & Sell. */
const PropertyCategoryGrid = ({
  selectedCategoryId,
  onSelectCategory,
  categories: categoriesProp,
  propertyTypes: propertyTypesProp,
}) => {
  const { categories: hookCategories, propertyTypes: hookTypes } = usePropertyData();
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fromProp = propertyTypesProp?.length
      ? propertyTypesProp
      : categoriesProp?.length
        ? categoriesProp
        : hookTypes?.length
          ? hookTypes
          : hookCategories?.length
            ? hookCategories
            : [];

    const mapped =
      fromProp.length > 0
        ? fromProp.map((c) => {
            const id = String(c.id || c.slug || c.name || '').toLowerCase();
            const fallback = FALLBACK_TYPES.find((f) => f.id === id);
            return {
              id,
              name: c.name || c.label || String(c.id),
              blurb: fallback?.blurb || 'Browse listings',
            };
          })
        : FALLBACK_TYPES;

    setCategories(mapped.filter((c) => c.id));
    setLoading(false);
  }, [categoriesProp, propertyTypesProp, hookCategories, hookTypes]);

  return (
    <section className="mb-8">
      <div className="flex items-end justify-between gap-3 mb-4">
        <div>
          <p className="prop-label text-[var(--prop-copper)] mb-1">Browse by type</p>
          <h2 className="prop-display text-2xl sm:text-3xl text-[var(--prop-ink)]">Property types</h2>
        </div>
        <span className="text-xs text-[var(--prop-ink)]/50 hidden sm:block">
          {loading ? '…' : `${categories.length} types`}
        </span>
      </div>

      {loading ? (
        <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
          {[...Array(8)].map((_, i) => (
            <div key={i} className="h-28 animate-pulse bg-[var(--prop-stone-deep)]/60" />
          ))}
        </div>
      ) : (
        <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
          {categories.map((category, index) => {
            const active = String(selectedCategoryId) === String(category.id);
            const Icon = iconFor(category.id || category.name);
            return (
              <motion.button
                key={category.id}
                type="button"
                initial={{ opacity: 0, y: 12 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.04, duration: 0.35 }}
                onClick={() => onSelectCategory?.(category.id)}
                className={`property-type-tile ${active ? 'is-active' : ''}`}
              >
                <div
                  className={`prop-tile-icon w-9 h-9 flex items-center justify-center mb-3 ${
                    active ? '' : 'bg-[var(--prop-stone-deep)] text-[var(--prop-ink)]'
                  }`}
                >
                  <Icon className="w-4 h-4" />
                </div>
                <h3 className="prop-display text-lg leading-tight">{category.name}</h3>
                <p
                  className={`mt-1 text-[11px] ${
                    active ? 'text-white/60' : 'text-[var(--prop-ink)]/50'
                  }`}
                >
                  {category.blurb}
                </p>
              </motion.button>
            );
          })}
        </div>
      )}
    </section>
  );
};

export const PROPERTY_TYPE_LABELS = Object.fromEntries(
  FALLBACK_TYPES.map((t) => [t.id, t.name])
);

export default PropertyCategoryGrid;
