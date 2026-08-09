import React, { useEffect, useMemo, useState } from 'react';
import MarketplaceCategoryCards from '../shared/MarketplaceCategoryCards';
import { getVehicleCategories } from '../../services/vehiclesAPI';
import { resolveStorageUrl } from '../../utils/dashboardEditMappers';

const iconMap = {
  cars: '🚗',
  car: '🚗',
  vans: '🚐',
  van: '🚐',
  motorcycles: '🏍',
  motorbikes: '🏍',
  motorbike: '🏍',
  trucks: '🚚',
  truck: '🚚',
  'trucks-lorries': '🚚',
  'buses-coaches': '🚌',
  bus: '🚌',
  coach: '🚌',
  'electric-vehicles': '⚡',
  electric_vehicle: '⚡',
  'classic-cars': '🚘',
  classic_car: '🚘',
  'luxury-exotic': '✨',
  luxury_vehicle: '✨',
  'caravans-motorhomes': '🚙',
  caravan: '🏠',
  motorhome: '🚙',
  'boats-jet-skis': '🚤',
  boat: '🚤',
  jet_ski: '🌊',
  'agricultural-vehicles': '🚜',
  agricultural: '🚜',
  'construction-vehicles': '🦺',
  construction: '🦺',
  other: '🚗',
};

/** Distinct fallbacks when Filament has no category image yet */
const FALLBACK_BY_SLUG = {
  cars: 'https://images.unsplash.com/photo-1492144534655-ae79c964c9d7?auto=format&fit=crop&w=600&q=80',
  vans: 'https://images.unsplash.com/photo-1527786356703-4b100091cd2c?auto=format&fit=crop&w=600&q=80',
  motorcycles: 'https://images.unsplash.com/photo-1558981806-ec527fa84c39?auto=format&fit=crop&w=600&q=80',
  motorbikes: 'https://images.unsplash.com/photo-1558981806-ec527fa84c39?auto=format&fit=crop&w=600&q=80',
  trucks: 'https://images.unsplash.com/photo-1601584115197-04ecc0da31d7?auto=format&fit=crop&w=600&q=80',
  'buses-coaches': 'https://images.unsplash.com/photo-1544620341-9bbbcb4d3f85?auto=format&fit=crop&w=600&q=80',
  'electric-vehicles': 'https://images.unsplash.com/photo-1593941707882-a5bba14938c7?auto=format&fit=crop&w=600&q=80',
  'classic-cars': 'https://images.unsplash.com/photo-1533473359331-0135ef1b58bf?auto=format&fit=crop&w=600&q=80',
  'luxury-exotic': 'https://images.unsplash.com/photo-1544636331-e26879cd4d9b?auto=format&fit=crop&w=600&q=80',
  'caravans-motorhomes': 'https://images.unsplash.com/photo-1523987355523-c7b5b0dd90a7?auto=format&fit=crop&w=600&q=80',
  'boats-jet-skis': 'https://images.unsplash.com/photo-1544551763-46a013bb70d5?auto=format&fit=crop&w=600&q=80',
  'agricultural-vehicles': 'https://images.unsplash.com/photo-1625246333195-78d9c38ad449?auto=format&fit=crop&w=600&q=80',
  'construction-vehicles': 'https://images.unsplash.com/photo-1581094794329-c8112a89af12?auto=format&fit=crop&w=600&q=80',
};

const vehicleImage = (v) =>
  resolveStorageUrl(v?.main_image) ||
  v?.main_image ||
  v?.primary_image ||
  v?.image_url ||
  v?.cover_image ||
  v?.thumbnail ||
  (Array.isArray(v?.additional_images)
    ? resolveStorageUrl(v.additional_images[0]) || v.additional_images[0]
    : null) ||
  (Array.isArray(v?.images) ? v.images[0]?.url || v.images[0] : null) ||
  null;

const normalizeCategories = (payload) => {
  if (Array.isArray(payload)) return payload;
  if (Array.isArray(payload?.data)) return payload.data;
  if (Array.isArray(payload?.data?.data)) return payload.data.data;
  return [];
};

const VehicleCategoryGrid = ({
  categories: categoriesProp,
  vehicles = [],
  selectedCategoryId,
  onCategorySelect,
}) => {
  const [categories, setCategories] = useState(
    Array.isArray(categoriesProp) ? categoriesProp : []
  );
  const [loading, setLoading] = useState(!Array.isArray(categoriesProp) || !categoriesProp.length);

  useEffect(() => {
    if (Array.isArray(categoriesProp) && categoriesProp.length) {
      setCategories(categoriesProp);
      setLoading(false);
      return undefined;
    }

    // Parent already owns the fetch when categoriesProp is [] during first paint —
    // wait briefly before self-fetching to avoid double request.
    let cancelled = false;
    const timer = setTimeout(async () => {
      if (cancelled) return;
      if (Array.isArray(categoriesProp) && categoriesProp.length) return;
      setLoading(true);
      try {
        const res = await getVehicleCategories();
        if (!cancelled) setCategories(normalizeCategories(res));
      } catch (err) {
        if (!cancelled) {
          console.warn('Failed to load vehicle categories:', err?.message || err);
          setCategories([]);
        }
      } finally {
        if (!cancelled) setLoading(false);
      }
    }, categoriesProp === undefined ? 0 : 400);

    return () => {
      cancelled = true;
      clearTimeout(timer);
    };
  }, [categoriesProp]);

  const items = useMemo(() => {
    const byCategory = new Map();
    for (const v of vehicles || []) {
      const key =
        v.category_id != null
          ? String(v.category_id)
          : String(v.category?.slug || v.category_slug || '').toLowerCase();
      if (!key) continue;
      const img = vehicleImage(v);
      if (!img) continue;
      const list = byCategory.get(key) || [];
      if (!list.includes(img) && list.length < 8) {
        list.push(img);
        byCategory.set(key, list);
      }
    }

    return (categories || []).map((cat) => {
      const slug = String(cat.slug || '').toLowerCase();
      const idKey = String(cat.id);
      const listingImages =
        byCategory.get(idKey) || byCategory.get(slug) || [];
      const categoryImage =
        resolveStorageUrl(cat.image_url || cat.image) ||
        cat.image_url ||
        (cat.image ? `/storage/${cat.image}` : null) ||
        FALLBACK_BY_SLUG[slug] ||
        null;
      const images = listingImages.length
        ? listingImages
        : categoryImage
          ? [categoryImage]
          : [];

      return {
        ...cat,
        id: cat.id ?? slug,
        name: cat.name,
        slug,
        images,
        post_images: images,
        image: images[0] || categoryImage,
        image_url: images[0] || categoryImage,
        count: cat.vehicles_count ?? cat.count ?? null,
      };
    });
  }, [categories, vehicles]);

  return (
    <MarketplaceCategoryCards
      categories={items}
      loading={loading}
      selectedId={selectedCategoryId}
      title="Categories"
      subtitle="Open a category to browse vehicles in that type."
      countLabel="vehicles"
      getId={(c) => c.slug || c.id}
      getLabel={(c) => c.name}
      getSlug={(c) => c.slug || String(c.id)}
      getCount={(c) => c.count}
      getIcon={(c) => iconMap[c.slug] || iconMap[c.id] || '🚗'}
      getImage={(c) => c.image_url || c.image}
      getImages={(c) => c.images || c.post_images || []}
      onSelect={(category, id) =>
        onCategorySelect?.(category?.slug || id || category?.id, category)
      }
      accentRing="ring-red-500"
      accentBorder="border-red-300"
      hoverBorder="hover:border-red-200"
      hoverTitle="group-hover:text-red-700"
      hoverArrow="group-hover:bg-red-100 group-hover:text-red-700"
      initialVisible={16}
      rotateMs={4000}
    />
  );
};

export default VehicleCategoryGrid;
