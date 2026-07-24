import React from 'react';
import { FiArrowRight } from 'react-icons/fi';
import ServicesGrid from './ServicesGrid';

/**
 * Featured gigs row on landing — Fiverr-style popular services preview.
 */
const ServicesFeaturedStrip = ({ services = [], loading, onViewAll }) => {
  if (!loading && services.length === 0) return null;

  return (
    <section className="mt-8 sm:mt-10">
      <div className="flex items-end justify-between gap-3 mb-4">
        <div>
          <h2 className="text-base sm:text-lg font-extrabold text-gray-900">Popular services</h2>
          <p className="text-xs sm:text-sm text-gray-500 mt-0.5">Recently posted gigs you can hire today</p>
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
      <ServicesGrid services={services.slice(0, 8)} loading={loading} />
    </section>
  );
};

export default ServicesFeaturedStrip;
