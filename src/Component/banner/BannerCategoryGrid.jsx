import React from 'react';
import { motion } from 'framer-motion';
import { ArrowRight, Loader2 } from 'lucide-react';

const BannerCategoryGrid = ({ categories, selectedCategory, onCategorySelect, loading }) => {
  const getCategoryIcon = (name) => {
    const icons = {
      'Real Estate': '🏢',
      Vehicles: '🚗',
      'Travel & Resorts': '✈️',
      'Jobs & Recruitment': '💼',
      'Books & Authors': '📚',
      Services: '🔧',
      Events: '📅',
      'Food & Hospitality': '🍽',
      'Fashion & Beauty': '👗',
      'Tech & Electronics': '💻',
      'Health & Wellness': '🏥',
      'Business & Finance': '💼',
    };
    return icons[name] || '📋';
  };

  const getCategoryColor = (name) => {
    const colors = {
      'Real Estate': 'from-blue-500 to-cyan-600',
      Vehicles: 'from-red-500 to-orange-600',
      'Travel & Resorts': 'from-teal-500 to-green-600',
      'Jobs & Recruitment': 'from-amber-500 to-orange-600',
      'Books & Authors': 'from-indigo-500 to-blue-600',
      Services: 'from-cyan-500 to-teal-600',
      Events: 'from-pink-500 to-rose-600',
      'Food & Hospitality': 'from-orange-500 to-red-600',
      'Fashion & Beauty': 'from-fuchsia-500 to-purple-600',
      'Tech & Electronics': 'from-slate-600 to-blue-600',
      'Health & Wellness': 'from-green-500 to-emerald-600',
      'Business & Finance': 'from-blue-700 to-indigo-700',
    };
    return colors[name] || 'from-gray-500 to-gray-600';
  };

  const categoryThumb = (category) => {
    const slug = category.slug || String(category.id || '').toLowerCase();
    return `/img/banners/marketplace/banner-${slug}.png`;
  };

  if (loading) {
    return (
      <div className="page-container py-6">
        <div className="text-center py-10">
          <Loader2 className="w-8 h-8 animate-spin text-indigo-600 mx-auto mb-3" />
          <p className="text-gray-600 text-sm">Loading categories…</p>
        </div>
      </div>
    );
  }

  return (
    <div className="page-container py-6">
      <div className="flex items-end justify-between mb-4 gap-3">
        <div>
          <h2 className="text-lg font-bold text-gray-900">Categories</h2>
          <p className="text-sm text-gray-600">Open a category to buy banners for that market.</p>
        </div>
        <span className="text-xs text-gray-500 shrink-0">{categories?.length || 0} categories</span>
      </div>

      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3 sm:gap-4">
        {categories?.map((category, index) => {
          const key = category.slug || category.id;
          const selected =
            selectedCategory != null &&
            String(selectedCategory) !== 'all' &&
            (String(selectedCategory) === String(category.id) ||
              String(selectedCategory) === String(category.slug));

          return (
            <motion.button
              key={key}
              type="button"
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.35, delay: Math.min(index * 0.04, 0.4) }}
              onClick={() => onCategorySelect(category)}
              className={`relative group text-left rounded-xl overflow-hidden border transition-all ${
                selected
                  ? 'ring-2 ring-indigo-500 ring-offset-2 border-indigo-300 shadow-md'
                  : 'border-slate-200 hover:shadow-md hover:border-indigo-200'
              }`}
            >
              <div className={`absolute inset-0 bg-gradient-to-br ${getCategoryColor(category.name)} opacity-90`} />
              <div className="relative h-28 overflow-hidden">
                <img
                  src={categoryThumb(category)}
                  alt=""
                  className="w-full h-full object-cover opacity-45 group-hover:opacity-60 transition-opacity"
                  onError={(e) => {
                    e.currentTarget.style.display = 'none';
                  }}
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/55 to-transparent" />
                <div className="absolute top-3 left-3 w-10 h-10 bg-white/90 rounded-lg flex items-center justify-center text-xl">
                  {getCategoryIcon(category.name)}
                </div>
              </div>
              <div className="relative p-3 bg-white">
                <h3 className="font-semibold text-gray-900 text-sm group-hover:text-indigo-700 transition-colors break-words">
                  {category.name}
                </h3>
                <div className="mt-2 flex items-center justify-between gap-2">
                  <span className="text-[11px] text-gray-500">
                    {category.active_banners_count != null
                      ? `${category.active_banners_count} banners`
                      : 'Paid packs'}
                  </span>
                  <span className="inline-flex items-center justify-center p-1.5 rounded-md bg-slate-100 text-slate-600 group-hover:bg-indigo-100 group-hover:text-indigo-700">
                    <ArrowRight className="w-3.5 h-3.5" />
                  </span>
                </div>
              </div>
            </motion.button>
          );
        })}
      </div>
    </div>
  );
};

export default BannerCategoryGrid;
