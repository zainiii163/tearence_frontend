import React, { useState, useEffect } from 'react';
import { FiGrid } from 'react-icons/fi';
import { buysellAPI } from '../../api/buysell';
import BuySellCategoryIcon from './BuySellCategoryIcon';

/** Clive: tight category chips — icon + label, no oversized outer boxes. */
const GRID_CLASS =
  'grid grid-cols-3 sm:grid-cols-4 md:grid-cols-5 lg:grid-cols-6 xl:grid-cols-8 gap-1.5 sm:gap-2';

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

  const renderCard = (category) => {
    const active = String(selectedCategoryId) === String(category.id);

    return (
      <button
        key={category.id}
        type="button"
        onClick={() => onSelectCategory(category.id)}
        className={`group bg-white rounded-md border px-1.5 py-2 text-center transition-colors ${
          active
            ? 'border-green-500 ring-1 ring-green-200'
            : 'border-gray-200 hover:border-green-400'
        }`}
      >
        <div className="flex flex-col items-center gap-1">
          <BuySellCategoryIcon category={category} size="sm" />
          <h3
            className={`text-[10px] sm:text-[11px] font-semibold line-clamp-2 leading-tight px-0.5 ${
              active ? 'text-green-700' : 'text-gray-800 group-hover:text-green-600'
            }`}
            title={category.name}
          >
            {category.name}
          </h3>
        </div>
      </button>
    );
  };

  return (
    <section className="mb-5">
      <div className="flex items-center gap-2 mb-2">
        <FiGrid className="h-3.5 w-3.5 text-green-600 shrink-0" />
        <h2 className="text-sm sm:text-base font-bold text-gray-900">Categories</h2>
        <span className="text-[10px] text-gray-500">{loading ? '…' : `${categories.length}`}</span>
      </div>

      {loading ? (
        <div className={GRID_CLASS}>
          {[...Array(12)].map((_, index) => (
            <div key={index} className="animate-pulse bg-gray-100 rounded-md h-14" />
          ))}
        </div>
      ) : (
        <div className={GRID_CLASS}>{categories.map((category) => renderCard(category))}</div>
      )}
    </section>
  );
};

export default BuySellCategoryGrid;
