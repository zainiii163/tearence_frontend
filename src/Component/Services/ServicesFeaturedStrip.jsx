import React from 'react';
import { FiArrowRight } from 'react-icons/fi';
import ServicesGrid from './ServicesGrid';

/**
 * Featured / trending services — Clive: show a few at the bottom of the page.
 */
const ServicesFeaturedStrip = ({ services = [], loading, onViewAll }) => {
  if (!loading && services.length === 0) return null;

  return (
    <section className="mt-6 sm:mt-8 mb-2">
      <div className="flex items-end justify-between gap-3 mb-3">
        <div>
          <h2 className="text-sm sm:text-base font-bold text-gray-900">Featured services</h2>
          <p className="text-xs text-gray-500 mt-0.5">Trending and highly sought-after posts</p>
        </div>
        {typeof onViewAll === 'function' && (
          <button
            type="button"
            onClick={onViewAll}
            className="inline-flex items-center gap-1 text-xs sm:text-sm font-semibold text-emerald-700 hover:text-emerald-900 shrink-0"
          >
            View all
            <FiArrowRight className="h-3.5 w-3.5" />
          </button>
        )}
      </div>
      <ServicesGrid services={services.slice(0, 6)} loading={loading} />
    </section>
  );
};

export default ServicesFeaturedStrip;
