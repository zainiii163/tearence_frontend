import React from 'react';
import { Grid, ArrowRight, TrendingUp, Layers } from 'lucide-react';

const CATEGORY_IMAGES = {
  property: 'https://images.unsplash.com/photo-1560448204-e02f11c3d0e2?w=400&h=300&fit=crop',
  vehicles: 'https://images.unsplash.com/photo-1552519507-da3b142c6e3d?w=400&h=300&fit=crop',
  jobs: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=400&h=300&fit=crop',
  business: 'https://images.unsplash.com/photo-1560472354-b33ff0c44a43?w=400&h=300&fit=crop',
  electronics: 'https://images.unsplash.com/photo-1498049794561-7780e7231661?w=400&h=300&fit=crop',
  fashion: 'https://images.unsplash.com/photo-1441986300917-64674bd600d8?w=400&h=300&fit=crop',
  travel: 'https://images.unsplash.com/photo-1488646953014-85cb44e25828?w=400&h=300&fit=crop',
  events: 'https://images.unsplash.com/photo-1541339907198-e08756dedf3f?w=400&h=300&fit=crop',
  pets: 'https://images.unsplash.com/photo-1450778869180-41d0601e046e?w=400&h=300&fit=crop',
  home: 'https://images.unsplash.com/photo-1586023492125-27b2c045efd7?w=400&h=300&fit=crop',
  health: 'https://images.unsplash.com/photo-1576091160399-112ba8d25d1d?w=400&h=300&fit=crop',
  education: 'https://images.unsplash.com/photo-1524178232363-1fb2b075b655?w=400&h=300&fit=crop',
};

const GRADIENT_COLORS = [
  'from-blue-500 to-cyan-500',
  'from-red-500 to-orange-500',
  'from-purple-500 to-pink-500',
  'from-yellow-500 to-orange-500',
  'from-gray-600 to-gray-800',
  'from-pink-500 to-rose-500',
  'from-teal-500 to-cyan-500',
  'from-indigo-500 to-purple-500',
  'from-green-500 to-emerald-500',
  'from-lime-500 to-green-500',
  'from-red-500 to-pink-500',
  'from-blue-600 to-indigo-600',
];

const getCategoryImage = (cat) => {
  const name = (cat.name || '').toLowerCase();
  for (const [key, img] of Object.entries(CATEGORY_IMAGES)) {
    if (name.includes(key)) return img;
  }
  return 'https://images.unsplash.com/photo-1560472354-b33ff0c44a43?w=400&h=300&fit=crop';
};

const FeaturedCategoryGrid = ({ categories, selectedCategory, onCategorySelect, loading }) => {
  if (loading) {
    return (
      <div className="page-container py-16">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {Array.from({ length: 8 }).map((_, i) => (
            <div key={i} className="bg-white rounded-2xl shadow-lg overflow-hidden animate-pulse">
              <div className="h-48 bg-gray-200" />
              <div className="p-6 space-y-3">
                <div className="h-4 bg-gray-200 rounded w-3/4" />
                <div className="h-4 bg-gray-200 rounded w-1/2" />
              </div>
            </div>
          ))}
        </div>
      </div>
    );
  }

  if (!categories || categories.length === 0) return null;

  const totalFeatured = categories.reduce((sum, cat) => sum + (cat.featured_adverts_count || 0), 0);

  return (
    <div className="page-container py-16">
      <div className="text-center mb-12">
        <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
          Explore Global Categories
        </h2>
        <p className="text-xl text-gray-600 max-w-3xl mx-auto">
          Discover premium listings from every corner of the world, organized by popular categories
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
        {categories.map((category, idx) => {
          const catId = String(category.category_id || category.id);
          const isSelected = selectedCategory === catId;
          const count = category.featured_adverts_count || 0;
          const image = getCategoryImage(category);
          const gradient = GRADIENT_COLORS[idx % GRADIENT_COLORS.length];

          return (
            <div
              key={catId}
              onClick={() => onCategorySelect(catId)}
              className={`group relative bg-white rounded-2xl shadow-lg hover:shadow-2xl transition-all duration-300 overflow-hidden cursor-pointer transform hover:scale-[1.02] ${
                isSelected ? 'ring-2 ring-purple-500' : ''
              }`}
            >
              {isSelected && (
                <div className="absolute top-4 left-4 z-10">
                  <div className="bg-purple-500 text-white px-3 py-1 rounded-full text-xs font-bold flex items-center space-x-1">
                    <TrendingUp className="h-3 w-3" />
                    <span>Selected</span>
                  </div>
                </div>
              )}

              <div className="relative h-48 overflow-hidden">
                <img
                  src={image}
                  alt={category.name}
                  className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />
                <div className="absolute bottom-4 left-4">
                  <div className={`h-12 w-12 bg-gradient-to-br ${gradient} rounded-xl flex items-center justify-center shadow-lg`}>
                    <Grid className="h-6 w-6 text-white" />
                  </div>
                </div>
              </div>

              <div className="p-6">
                <div className="flex items-center justify-between mb-3">
                  <h3 className="text-lg font-bold text-gray-900">{category.name}</h3>
                  <span className={`text-sm font-semibold ${isSelected ? 'text-purple-600' : 'text-gray-600'}`}>
                    {count.toLocaleString()}
                  </span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-sm text-gray-500">Featured Ads</span>
                  <button className="flex items-center space-x-2 font-medium text-sm text-purple-600 hover:text-purple-700 transition-colors">
                    <span>Explore</span>
                    <ArrowRight className="h-3 w-3" />
                  </button>
                </div>
              </div>

              <div className="absolute inset-0 bg-gradient-to-br from-purple-500/5 to-blue-500/5 opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none" />
            </div>
          );
        })}
      </div>

      <div className="mt-12 bg-gradient-to-r from-purple-50 to-blue-50 rounded-2xl p-8">
        <div className="grid grid-cols-2 md:grid-cols-3 gap-6 text-center">
          <div>
            <div className="text-2xl font-bold text-purple-600">{totalFeatured.toLocaleString()}</div>
            <div className="text-sm text-gray-600">Total Featured Ads</div>
          </div>
          <div>
            <div className="text-2xl font-bold text-blue-600">{categories.length}</div>
            <div className="text-sm text-gray-600">Active Categories</div>
          </div>
          <div>
            <div className="text-2xl font-bold text-orange-600">24/7</div>
            <div className="text-sm text-gray-600">Active Support</div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default FeaturedCategoryGrid;
