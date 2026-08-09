import React from 'react';
import { Link } from 'react-router-dom';
import { PROPERTY_CONTINENTS } from '../../data/propertyContinents';

/**
 * Continent chips for Jobs — helps job seekers filter by region.
 */
const JobsContinentStrip = ({
  selectedContinentId = null,
  onSelect,
  title = 'Browse jobs by continent',
}) => (
  <section className="mb-5 rounded-xl border border-slate-200 bg-white p-4 shadow-sm">
    <div className="mb-3 flex flex-wrap items-end justify-between gap-2">
      <div>
        <h2 className="text-sm font-bold text-slate-900 uppercase tracking-wide">{title}</h2>
        <p className="text-xs text-slate-500 mt-0.5">
          Narrow vacancies and seekers by world region
        </p>
      </div>
      {selectedContinentId && (
        <button
          type="button"
          onClick={() => onSelect?.(null)}
          className="text-xs font-semibold text-blue-700 hover:underline"
        >
          Clear region
        </button>
      )}
    </div>
    <div className="flex flex-wrap gap-2">
      {PROPERTY_CONTINENTS.map((region) => {
        const active = selectedContinentId === region.id;
        return (
          <button
            key={region.id}
            type="button"
            aria-pressed={active}
            onClick={() => onSelect?.(active ? null : region)}
            className={`px-3 py-1.5 rounded-lg text-xs font-semibold border transition-colors ${
              active
                ? 'bg-blue-600 text-white border-blue-600'
                : 'bg-slate-50 text-slate-700 border-slate-200 hover:border-blue-300 hover:bg-blue-50'
            }`}
          >
            {region.name}
          </button>
        );
      })}
    </div>
    {selectedContinentId && (
      <p className="mt-3 text-xs text-slate-500">
        Showing roles linked to{' '}
        <span className="font-semibold text-slate-800">
          {PROPERTY_CONTINENTS.find((c) => c.id === selectedContinentId)?.name}
        </span>
        .{' '}
        <Link to={`/property/region/${selectedContinentId}`} className="text-blue-700 hover:underline">
          Also browse property in this region
        </Link>
      </p>
    )}
  </section>
);

export default JobsContinentStrip;
