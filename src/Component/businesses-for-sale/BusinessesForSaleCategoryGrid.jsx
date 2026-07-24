import React from 'react';
import { motion } from 'framer-motion';
import { FiGrid } from 'react-icons/fi';
import { BUSINESS_SALE_CATEGORIES, BUSINESS_SALE_GROUPS } from './businessesForSaleCategories';

const GROUP_STYLES = {
  online: 'from-sky-500 to-blue-600',
  physical: 'from-amber-500 to-orange-600',
};

const BusinessesForSaleCategoryGrid = ({
  selectedCategoryId,
  selectedGroupId,
  onSelectCategory,
  onSelectGroup,
  listingCounts = {},
}) => (
  <section className="mb-8">
    <div className="flex items-center gap-2 mb-4">
      <FiGrid className="h-4 w-4 text-amber-600" />
      <h2 className="text-base sm:text-lg font-bold text-gray-900">Browse by category</h2>
    </div>

    {BUSINESS_SALE_GROUPS.map((group) => (
      <div key={group.id} className="mb-6">
        <button
          type="button"
          onClick={() => onSelectGroup(group.id)}
          className={`w-full text-left mb-3 p-4 rounded-2xl bg-gradient-to-r ${GROUP_STYLES[group.id]} text-white shadow-md hover:shadow-lg transition-shadow`}
        >
          <div className="flex items-center gap-3">
            <span className="text-2xl">{group.emoji}</span>
            <div>
              <h3 className="font-extrabold text-base sm:text-lg">{group.name}</h3>
              <p className="text-xs sm:text-sm text-white/90">{group.subtitle}</p>
            </div>
          </div>
        </button>

        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-2 sm:gap-3"
        >
          {BUSINESS_SALE_CATEGORIES.filter((c) => c.group === group.id).map((cat) => {
            const active = selectedCategoryId === cat.id;
            const count = listingCounts[cat.id] || 0;
            return (
              <button
                key={cat.id}
                type="button"
                onClick={() => onSelectCategory(cat.id)}
                className={`rounded-xl border p-3 text-left transition-all ${
                  active
                    ? 'border-amber-500 ring-2 ring-amber-100 bg-amber-50 shadow-md'
                    : 'border-gray-200 bg-white hover:border-amber-300 hover:shadow-sm'
                }`}
              >
                <h4 className={`text-xs sm:text-sm font-bold line-clamp-2 ${active ? 'text-amber-800' : 'text-gray-900'}`}>
                  {cat.name}
                </h4>
                <p className="text-[10px] text-gray-500 mt-1">{count} listings</p>
              </button>
            );
          })}
        </motion.div>
      </div>
    ))}
  </section>
);

export default BusinessesForSaleCategoryGrid;
