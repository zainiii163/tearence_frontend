import React from 'react';
import {
  FaLaptop,
  FaMobileAlt,
  FaCar,
  FaCouch,
  FaTshirt,
  FaDumbbell,
  FaBook,
  FaBaby,
  FaTools,
  FaIndustry,
  FaPalette,
  FaPaw,
  FaConciergeBell,
  FaHome,
  FaFutbol,
  FaCamera,
  FaGamepad,
  FaMusic,
  FaUtensils,
  FaGem,
  FaBicycle,
  FaStore,
  FaTv,
  FaHeadphones,
} from 'react-icons/fa';

const ICON_BY_SLUG = {
  electronics: FaLaptop,
  smartphones: FaMobileAlt,
  'mobile-phones': FaMobileAlt,
  vehicles: FaCar,
  cars: FaCar,
  'home-garden': FaHome,
  furniture: FaCouch,
  fashion: FaTshirt,
  'mens-clothing': FaTshirt,
  'womens-clothing': FaTshirt,
  'sports-outdoors': FaFutbol,
  'sports-fitness': FaDumbbell,
  'fitness-equipment': FaDumbbell,
  'books-media': FaBook,
  books: FaBook,
  'baby-kids': FaBaby,
  'tools-hardware': FaTools,
  'business-industrial': FaIndustry,
  'collectibles-art': FaPalette,
  'pets-supplies': FaPaw,
  pets: FaPaw,
  services: FaConciergeBell,
  cameras: FaCamera,
  laptops: FaLaptop,
  'video-games': FaGamepad,
  'audio-video': FaHeadphones,
  'movies-tv': FaTv,
  music: FaMusic,
  kitchen: FaUtensils,
  jewelry: FaGem,
  bicycles: FaBicycle,
  stores: FaStore,
};

const GRADIENT_BY_SLUG = {
  electronics: 'from-blue-500 to-indigo-600',
  smartphones: 'from-sky-500 to-blue-600',
  vehicles: 'from-red-500 to-rose-600',
  'home-garden': 'from-emerald-500 to-green-600',
  furniture: 'from-amber-500 to-orange-600',
  fashion: 'from-pink-500 to-fuchsia-600',
  'sports-outdoors': 'from-lime-500 to-green-600',
  'sports-fitness': 'from-teal-500 to-cyan-600',
  'books-media': 'from-violet-500 to-purple-600',
  'baby-kids': 'from-rose-400 to-pink-500',
  'tools-hardware': 'from-slate-500 to-gray-600',
  'business-industrial': 'from-zinc-600 to-stone-700',
  'collectibles-art': 'from-amber-400 to-yellow-500',
  'pets-supplies': 'from-orange-400 to-amber-500',
  services: 'from-cyan-500 to-blue-500',
};

const SIZE_MAP = {
  xs: { box: 'w-5 h-5', icon: 'h-2.5 w-2.5', emoji: 'text-[10px]' },
  sm: { box: 'w-7 h-7', icon: 'h-3.5 w-3.5', emoji: 'text-sm' },
  md: { box: 'w-11 h-11', icon: 'h-5 w-5', emoji: 'text-xl' },
  lg: { box: 'w-14 h-14', icon: 'h-6 w-6', emoji: 'text-2xl' },
};

const normalizeSlug = (category) =>
  (category?.slug || category?.name || '')
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-|-$/g, '');

export const getBuySellCategoryGradient = (category) => {
  const slug = normalizeSlug(category);
  if (GRADIENT_BY_SLUG[slug]) return GRADIENT_BY_SLUG[slug];
  const partial = Object.keys(GRADIENT_BY_SLUG).find((key) => slug.includes(key));
  return partial ? GRADIENT_BY_SLUG[partial] : 'from-green-500 to-emerald-600';
};

export const getBuySellCategoryIconComponent = (category) => {
  const slug = normalizeSlug(category);
  if (ICON_BY_SLUG[slug]) return ICON_BY_SLUG[slug];
  const partial = Object.keys(ICON_BY_SLUG).find((key) => slug.includes(key));
  return partial ? ICON_BY_SLUG[partial] : FaStore;
};

const BuySellCategoryIcon = ({ category, size = 'md', variant = 'solid', className = '' }) => {
  const sizes = SIZE_MAP[size] || SIZE_MAP.md;
  const gradient = getBuySellCategoryGradient(category);
  const IconComponent = getBuySellCategoryIconComponent(category);
  const imageUrl = category?.image_url || category?.image;

  if (imageUrl) {
    return (
      <div className={`${sizes.box} rounded-md overflow-hidden shrink-0 bg-white ${className}`}>
        <img
          src={imageUrl}
          alt={category?.name || 'Category'}
          className="w-full h-full object-cover"
          loading="lazy"
        />
      </div>
    );
  }

  if (typeof category?.icon === 'string' && category.icon.length <= 4 && !category.icon.startsWith('http')) {
    return (
      <div
        className={`${sizes.box} rounded-md flex items-center justify-center shrink-0 bg-gradient-to-br ${gradient} ${className}`}
      >
        <span className={`${sizes.emoji} leading-none select-none`} role="img" aria-hidden="true">
          {category.icon}
        </span>
      </div>
    );
  }

  const boxClass =
    variant === 'light'
      ? `${sizes.box} rounded-md flex items-center justify-center shrink-0 bg-white/20 backdrop-blur-sm border border-white/30`
      : `${sizes.box} rounded-md flex items-center justify-center shrink-0 bg-gradient-to-br ${gradient}`;

  return (
    <div className={`${boxClass} ${className}`}>
      <IconComponent className={`${sizes.icon} ${variant === 'light' ? 'text-white' : 'text-white'}`} />
    </div>
  );
};

export default BuySellCategoryIcon;
