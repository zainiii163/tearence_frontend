import React, { useState, useEffect } from 'react';
import { buysellAPI } from '../../api/buysell';
import MarketplaceCategoryCards from '../shared/MarketplaceCategoryCards';
import { displayMarketplaceCategoryName } from '../../utils/categoryDisplayNames';

const BuySellCategoryGrid = ({ selectedCategoryId, onSelectCategory }) => {
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const categoriesData = await buysellAPI.getCategories();
        setCategories(Array.isArray(categoriesData) ? categoriesData : []);
      } catch (error) {
        console.error('Error fetching categories:', error);
        setCategories([]);
      } finally {
        setLoading(false);
      }
    };

    fetchCategories();
  }, []);

  return (
    <MarketplaceCategoryCards
      categories={categories}
      loading={loading}
      selectedId={selectedCategoryId}
      title="Categories"
      subtitle="Open a category to buy or sell in that market."
      countLabel="items"
      getId={(c) => c.id}
      getLabel={(c) => displayMarketplaceCategoryName(c.name, c.slug)}
      getSlug={(c) => c.slug || String(c.id)}
      getCount={(c) => c.listings_count ?? c.count ?? c.adverts_count ?? null}
      getImage={(c) => c.image || c.image_url || c.icon_url}
      getImages={(c) => c.images || c.post_images || c.listing_images || []}
      onSelect={(category, id) => onSelectCategory?.(id ?? category.id)}
      accentRing="ring-emerald-500"
      accentBorder="border-emerald-300"
      hoverBorder="hover:border-emerald-200"
      hoverTitle="group-hover:text-emerald-700"
      hoverArrow="group-hover:bg-emerald-100 group-hover:text-emerald-700"
      rotateMs={4000}
    />
  );
};

export default BuySellCategoryGrid;
