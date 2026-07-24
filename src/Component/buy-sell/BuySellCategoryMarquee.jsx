import React from 'react';
import { motion } from 'framer-motion';
import BuySellCategoryIcon from './BuySellCategoryIcon';

const BuySellCategoryMarquee = ({
  categories = [],
  onSelectCategory,
  variant = 'hero',
  title = 'Featured Categories',
}) => {
  if (!categories.length) return null;

  const loopItems = [...categories, ...categories];

  const cardClass =
    variant === 'hero'
      ? 'min-w-[108px] sm:min-w-[118px] bg-white/15 backdrop-blur-sm border border-white/25 hover:bg-white/25'
      : 'min-w-[96px] sm:min-w-[104px] bg-white border border-gray-200 hover:border-green-300 hover:shadow-md';

  const textClass = variant === 'hero' ? 'text-white' : 'text-gray-900';
  const subTextClass = variant === 'hero' ? 'text-green-100' : 'text-gray-500';

  return (
    <div className="w-full">
      {title && (
        <h2
          className={`text-sm sm:text-base font-semibold mb-3 ${
            variant === 'hero' ? 'text-white' : 'text-gray-900'
          }`}
        >
          {title}
        </h2>
      )}

      <div className="relative overflow-hidden">
        <div className="pointer-events-none absolute inset-y-0 left-0 w-8 sm:w-12 bg-gradient-to-r from-black/10 to-transparent z-[1]" />
        <div className="pointer-events-none absolute inset-y-0 right-0 w-8 sm:w-12 bg-gradient-to-l from-black/10 to-transparent z-[1]" />

        <div className="buysell-marquee-track flex gap-2 sm:gap-3 py-1">
          {loopItems.map((category, index) => (
            <motion.button
              key={`${category.id}-${index}`}
              type="button"
              whileHover={{ y: -2, scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              onClick={() => onSelectCategory?.(category.id)}
              className={`${cardClass} rounded-xl p-2.5 sm:p-3 transition-all duration-200 text-left shrink-0`}
            >
              <div className="flex flex-col items-center text-center gap-2">
                <BuySellCategoryIcon
                  category={category}
                  size="md"
                  variant={variant === 'hero' ? 'light' : 'solid'}
                />
                <div className="w-full min-w-0">
                  <p className={`text-[11px] sm:text-xs font-semibold line-clamp-2 leading-tight ${textClass}`}>
                    {category.name}
                  </p>
                  <p className={`text-[10px] mt-0.5 ${subTextClass}`}>
                    {(category.count || category.advert_count || 0).toLocaleString()} items
                  </p>
                </div>
              </div>
            </motion.button>
          ))}
        </div>
      </div>
    </div>
  );
};

export default BuySellCategoryMarquee;
