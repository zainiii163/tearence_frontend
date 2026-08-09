import React, { useState } from 'react';
import MarketplaceCategoryCards from '../shared/MarketplaceCategoryCards';
import { resolveCategoryEmoji } from '../../utils/serviceCategoryUtils';

/**
 * Services categories — photo cards matching Banner / marketplace structure.
 */
const ServicesCategoryGrid = ({
  categories = [],
  selectedSlug = null,
  onSelectCategory,
  title = 'Categories',
  variant = 'chips',
}) => {
  const [openSlug, setOpenSlug] = useState(null);

  if (!categories.length) return null;

  if (variant !== 'groups') {
    return (
      <MarketplaceCategoryCards
        categories={categories}
        selectedId={selectedSlug}
        title={title}
        subtitle="Open a category to browse services in that field."
        countLabel="services"
        getId={(c) => c.slug || c.id}
        getLabel={(c) => c.name || c.label}
        getSlug={(c) => c.slug || String(c.id || '')}
        getCount={(c) => c.services_count ?? c.count ?? c.listings_count ?? null}
        getIcon={(c) => resolveCategoryEmoji(c?.slug, c?.emoji, c?.icon)}
        getImage={(c) => c.image_url || c.image || c.cover_image}
        getImages={(c) => c.images || c.post_images || c.listing_images || []}
        onSelect={(category) => onSelectCategory?.(category)}
        accentRing="ring-emerald-500"
        accentBorder="border-emerald-300"
        hoverBorder="hover:border-emerald-200"
        hoverTitle="group-hover:text-emerald-700"
        hoverArrow="group-hover:bg-emerald-100 group-hover:text-emerald-700"
        initialVisible={16}
        rotateMs={4000}
      />
    );
  }

  const openCat = categories.find((c) => c.slug === openSlug);
  const kids = openCat?.children || [];

  return (
    <div className="mb-5 space-y-4">
      <MarketplaceCategoryCards
        categories={categories}
        selectedId={openSlug || selectedSlug}
        title={title}
        subtitle="Open a field, then pick a specialty."
        countLabel="services"
        getId={(c) => c.slug || c.id}
        getLabel={(c) => c.name || c.label}
        getSlug={(c) => c.slug || String(c.id || '')}
        getCount={(c) => (c.children || []).length || c.services_count || null}
        getIcon={(c) => resolveCategoryEmoji(c?.slug, c?.emoji, c?.icon)}
        onSelect={(category) => {
          const slug = category.slug || category.id;
          const hasKids = (category.children || []).length > 0;
          if (hasKids) {
            setOpenSlug((prev) => (prev === slug ? null : slug));
            return;
          }
          onSelectCategory?.(category);
        }}
        accentRing="ring-emerald-500"
        accentBorder="border-emerald-300"
        hoverBorder="hover:border-emerald-200"
        hoverTitle="group-hover:text-emerald-700"
        hoverArrow="group-hover:bg-emerald-100 group-hover:text-emerald-700"
      />
      {kids.length > 0 && (
        <MarketplaceCategoryCards
          categories={kids}
          selectedId={selectedSlug}
          title={openCat?.name || 'Specialties'}
          subtitle="Choose a specialty to browse listings."
          countLabel="services"
          getId={(c) => c.slug || c.id}
          getLabel={(c) => c.name || c.label}
          getSlug={(c) => c.slug || String(c.id || '')}
          getIcon={(c) => resolveCategoryEmoji(c?.slug, c?.emoji, c?.icon)}
          onSelect={(category) => onSelectCategory?.(category)}
          accentRing="ring-teal-500"
          accentBorder="border-teal-300"
          hoverBorder="hover:border-teal-200"
          hoverTitle="group-hover:text-teal-700"
          hoverArrow="group-hover:bg-teal-100 group-hover:text-teal-700"
          initialVisible={12}
        />
      )}
    </div>
  );
};

export default ServicesCategoryGrid;
