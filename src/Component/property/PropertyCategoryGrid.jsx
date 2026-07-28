import React, { useState, useEffect } from 'react';
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
import CompactCategoryChips from '../shared/CompactCategoryChips';

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

const PropertyCategoryGrid = ({
  selectedCategoryId,
  onSelectCategory,
  categories: categoriesProp,
  propertyTypes: propertyTypesProp,
}) => {
  const { categories: hookCategories, propertyTypes: hookTypes } = usePropertyData();
  const [categories, setCategories] = useState([]);

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
              meta: fallback?.blurb || 'Browse listings',
            };
          })
        : FALLBACK_TYPES.map((f) => ({ id: f.id, name: f.name, meta: f.blurb }));

    setCategories(mapped.filter((c) => c.id));
  }, [categoriesProp, propertyTypesProp, hookCategories, hookTypes]);

  return (
    <CompactCategoryChips
      items={categories}
      selectedId={selectedCategoryId}
      title="Property types"
      theme="slate"
      initialVisible={16}
      onSelect={(item) => onSelectCategory?.(item.id)}
      renderIcon={(item, { active }) => {
        const Icon = iconFor(item.id || item.name);
        return (
          <span
            className={`inline-flex h-5 w-5 items-center justify-center rounded-md shrink-0 ${
              active ? 'bg-amber-700 text-white' : 'bg-slate-200 text-slate-700'
            }`}
          >
            <Icon className="h-3 w-3" />
          </span>
        );
      }}
    />
  );
};

export const PROPERTY_TYPE_LABELS = Object.fromEntries(
  FALLBACK_TYPES.map((t) => [t.id, t.name])
);

export default PropertyCategoryGrid;
