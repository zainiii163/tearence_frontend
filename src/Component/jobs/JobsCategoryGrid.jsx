import React, { useState, useEffect } from 'react';
import jobService from '../../services/JobServices';
import { FALLBACK_JOB_CATEGORIES, mergeJobCategories } from '../../data/jobCategories';
import MarketplaceCategoryCards from '../shared/MarketplaceCategoryCards';

const extractCategories = (response) => {
  if (!response) return [];
  if (Array.isArray(response)) return response;
  if (Array.isArray(response.data)) return response.data;
  if (Array.isArray(response.data?.data)) return response.data.data;
  if (Array.isArray(response.categories)) return response.categories;
  return [];
};

const JobsCategoryGrid = ({ selectedCategorySlug, onSelectCategory }) => {
  const [categories, setCategories] = useState(FALLBACK_JOB_CATEGORIES);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let cancelled = false;
    (async () => {
      try {
        const res = await jobService.getCategories();
        if (!cancelled) setCategories(mergeJobCategories(extractCategories(res)));
      } catch (error) {
        console.error('Error fetching job categories:', error);
        if (!cancelled) setCategories(FALLBACK_JOB_CATEGORIES);
      } finally {
        if (!cancelled) setLoading(false);
      }
    })();
    return () => {
      cancelled = true;
    };
  }, []);

  return (
    <MarketplaceCategoryCards
      categories={categories}
      loading={loading}
      selectedId={selectedCategorySlug}
      title="Categories"
      subtitle="Open a category to browse jobs in that field."
      countLabel="roles"
      getId={(c) => c.slug || String(c.id)}
      getLabel={(c) => c.name}
      getSlug={(c) => c.slug || String(c.id)}
      getCount={(c) => c.jobs_count ?? c.count ?? c.listings_count ?? null}
      getImage={(c) => c.image_url || c.image || c.cover_image}
      getImages={(c) => c.images || c.post_images || []}
      onSelect={(category, id) => onSelectCategory?.(id || category.slug || category.id)}
      accentRing="ring-blue-500"
      accentBorder="border-blue-300"
      hoverBorder="hover:border-blue-200"
      hoverTitle="group-hover:text-blue-700"
      hoverArrow="group-hover:bg-blue-100 group-hover:text-blue-700"
      rotateMs={4000}
    />
  );
};

export default JobsCategoryGrid;
