import React, { useEffect, useMemo, useState } from 'react';
import MarketplaceCategoryCards from '../shared/MarketplaceCategoryCards';
import { getVehicleCategories } from '../../services/vehiclesAPI';
import { resolveStorageUrl } from '../../utils/dashboardEditMappers';

const iconMap = {
  'cars-for-sale': '🚗',
  'cars-for-hire': '🔑',
  'car-share': '🤝',
  'chauffeur-drivers': '🤵',
  'tow-services': '🚛',
  mechanics: '🔧',
  parts: '⚙️',
  'farm-equipment': '🚜',
  'commercial-vehicles': '🚚',
  motorbikes: '🏍',
  motorcycles: '🏍',
  'construction-vehicles': '🦺',
  'other-services': '🛠️',
  cars: '🚗',
  car: '🚗',
  vans: '🚐',
  van: '🚐',
  trucks: '🚚',
  truck: '🚚',
  'agricultural-vehicles': '🚜',
  other: '🚗',
};

/** Distinct fallbacks when Filament has no category image yet */
const FALLBACK_BY_SLUG = {
  'cars-for-sale':
    'https://images.unsplash.com/photo-1492144534655-ae79c964c9d7?auto=format&fit=crop&w=600&q=80',
  'cars-for-hire':
    'https://images.unsplash.com/photo-1449965408869-eaa3f722e40d?auto=format&fit=crop&w=600&q=80',
  'car-share':
    'https://images.unsplash.com/photo-1449965408869-eaa3f722e40d?auto=format&fit=crop&w=600&q=80',
  'chauffeur-drivers':
    'https://images.unsplash.com/photo-1549317661-bd32c8ce0db2?auto=format&fit=crop&w=600&q=80',
  'tow-services':
    'https://images.unsplash.com/photo-1601584115197-04ecc0da31d7?auto=format&fit=crop&w=600&q=80',
  mechanics:
    'https://images.unsplash.com/photo-1486262715619-67b85e0b08d3?auto=format&fit=crop&w=600&q=80',
  parts:
    'https://images.unsplash.com/photo-1486262715619-67b85e0b08d3?auto=format&fit=crop&w=600&q=80',
  'farm-equipment':
    'https://images.unsplash.com/photo-1625246333195-78d9c38ad449?auto=format&fit=crop&w=600&q=80',
  'commercial-vehicles':
    'https://images.unsplash.com/photo-1527786356703-4b100091cd2c?auto=format&fit=crop&w=600&q=80',
  motorbikes:
    'https://images.unsplash.com/photo-1558981806-ec527fa84c39?auto=format&fit=crop&w=600&q=80',
  motorcycles:
    'https://images.unsplash.com/photo-1558981806-ec527fa84c39?auto=format&fit=crop&w=600&q=80',
  'construction-vehicles':
    'https://images.unsplash.com/photo-1581094794329-c8112a89af12?auto=format&fit=crop&w=600&q=80',
  'other-services':
    'https://images.unsplash.com/photo-1503376780353-7e6692767b70?auto=format&fit=crop&w=600&q=80',
  cars: 'https://images.unsplash.com/photo-1492144534655-ae79c964c9d7?auto=format&fit=crop&w=600&q=80',
  vans: 'https://images.unsplash.com/photo-1527786356703-4b100091cd2c?auto=format&fit=crop&w=600&q=80',
  trucks: 'https://images.unsplash.com/photo-1601584115197-04ecc0da31d7?auto=format&fit=crop&w=600&q=80',
  'agricultural-vehicles':
    'https://images.unsplash.com/photo-1625246333195-78d9c38ad449?auto=format&fit=crop&w=600&q=80',
};

/** CarServicesLtd-aligned fallbacks if API has no categories yet */
export const CSL_VEHICLE_CATEGORY_FALLBACKS = [
  { id: 'cars-for-sale', name: 'Cars for Sale', slug: 'cars-for-sale' },
  { id: 'cars-for-hire', name: 'Cars for Hire', slug: 'cars-for-hire' },
  { id: 'car-share', name: 'Car Share', slug: 'car-share' },
  { id: 'chauffeur-drivers', name: 'Chauffeur / Drivers for Hire', slug: 'chauffeur-drivers' },
  { id: 'tow-services', name: 'Tow Services', slug: 'tow-services' },
  { id: 'mechanics', name: 'Car / Truck Mechanics', slug: 'mechanics' },
  { id: 'parts', name: 'Car & Truck Parts', slug: 'parts' },
  { id: 'farm-equipment', name: 'Farm Equipment Hire & Sale', slug: 'farm-equipment' },
  { id: 'commercial-vehicles', name: 'Commercial Vehicles Hire & Sale', slug: 'commercial-vehicles' },
  { id: 'motorbikes', name: 'Motorbikes', slug: 'motorbikes' },
  { id: 'construction-vehicles', name: 'Construction Vehicles', slug: 'construction-vehicles' },
  { id: 'other-services', name: 'Other Services', slug: 'other-services' },
];


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
          setCategories(CSL_VEHICLE_CATEGORY_FALLBACKS);
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
    const source =
      categories && categories.length ? categories : CSL_VEHICLE_CATEGORY_FALLBACKS;
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

    return source.map((cat) => {
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
