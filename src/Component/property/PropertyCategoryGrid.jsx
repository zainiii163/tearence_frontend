import React, { useState, useEffect } from 'react';
import { usePropertyData } from '../../hooks/usePropertyData';
import MarketplaceCategoryCards from '../shared/MarketplaceCategoryCards';

const FALLBACK_TYPES = [
  { id: 'residential', name: 'Residential', blurb: 'Homes & apartments', icon: '🏠' },
  { id: 'commercial', name: 'Commercial', blurb: 'Offices & retail', icon: '🏢' },
  { id: 'industrial', name: 'Industrial', blurb: 'Warehouses', icon: '🏭' },
  { id: 'land', name: 'Land & Plots', blurb: 'Development sites', icon: '🌳' },
  { id: 'agricultural', name: 'Agricultural', blurb: 'Farms & estates', icon: '🌾' },
  { id: 'luxury', name: 'Luxury', blurb: 'Premium residences', icon: '✨' },
  { id: 'rental', name: 'Short-term', blurb: 'Holiday stays', icon: '📅' },
  { id: 'investment', name: 'Investment', blurb: 'Yield opportunities', icon: '📈' },
];

const iconFor = (name = '') => {
  const key = String(name).toLowerCase();
  if (key.includes('residential') || key.includes('home')) return '🏠';
  if (key.includes('commercial') || key.includes('office')) return '🏢';
  if (key.includes('industrial') || key.includes('warehouse')) return '🏭';
  if (key.includes('land') || key.includes('plot') || key.includes('agricultur')) return '🌳';
  if (key.includes('luxury')) return '✨';
  if (key.includes('rental') || key.includes('holiday') || key.includes('short')) return '📅';
  if (key.includes('invest')) return '📈';
  if (key.includes('retail') || key.includes('shop')) return '🛍';
  if (key.includes('hotel')) return '🏨';
  return '🏠';
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
              icon: fallback?.icon || iconFor(id),
            };
          })
        : FALLBACK_TYPES.map((f) => ({
            id: f.id,
            name: f.name,
            meta: f.blurb,
            icon: f.icon,
          }));

    setCategories(mapped.filter((c) => c.id));
  }, [categoriesProp, propertyTypesProp, hookCategories, hookTypes]);

  return (
    <MarketplaceCategoryCards
      categories={categories}
      selectedId={selectedCategoryId}
      title="Categories"
      subtitle="Open a property type to browse listings in that market."
      countLabel="listings"
      getId={(c) => c.id}
      getLabel={(c) => c.name}
      getSlug={(c) => c.id}
      getIcon={(c) => c.icon || iconFor(c.id || c.name)}
      onSelect={(category, id) => onSelectCategory?.(id ?? category.id)}
      accentRing="ring-violet-500"
      accentBorder="border-violet-300"
      hoverBorder="hover:border-violet-200"
      hoverTitle="group-hover:text-violet-700"
      hoverArrow="group-hover:bg-violet-100 group-hover:text-violet-700"
    />
  );
};

export default PropertyCategoryGrid;
