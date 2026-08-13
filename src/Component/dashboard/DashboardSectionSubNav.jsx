import React from 'react';
import { FaPlus, FaTable, FaChartPie } from 'react-icons/fa';

const ICONS = {
  overview: FaChartPie,
  table: FaTable,
  create: FaPlus,
  listings: FaTable,
  purchases: FaTable,
  sales: FaChartPie,
  selling: FaTable,
  links: FaTable,
  promoting: FaTable,
  earnings: FaChartPie,
  money: FaChartPie,
  adverts: FaTable,
};

/**
 * In-page sub-nav for a dashboard section (Overview | Table | Create, etc.).
 */
export default function DashboardSectionSubNav({
  title,
  subtitle,
  items = [],
  activeSub,
  onChange,
}) {
  if (!items.length) return null;

  return (
    <div className="mb-5 space-y-3">
      {(title || subtitle) && (
        <div>
          {title ? (
            <h2 className="text-xl sm:text-2xl font-semibold text-slate-900 tracking-tight">
              {title}
            </h2>
          ) : null}
          {subtitle ? <p className="text-sm text-slate-500 mt-0.5">{subtitle}</p> : null}
        </div>
      )}
      <div className="flex flex-wrap gap-1.5 p-1 rounded-xl bg-slate-100/80 border border-slate-200/80">
        {items.map((item) => {
          const Icon = ICONS[item.id] || FaTable;
          const on = activeSub === item.id;
          return (
            <button
              key={item.id}
              type="button"
              onClick={() => onChange?.(item.id)}
              className={`inline-flex items-center gap-2 rounded-lg px-3.5 py-2 text-sm font-semibold transition-colors ${
                on
                  ? 'bg-primary text-white shadow-sm'
                  : 'text-slate-600 hover:bg-white hover:text-slate-900'
              }`}
            >
              <Icon className="h-3.5 w-3.5 opacity-90" />
              {item.label}
            </button>
          );
        })}
      </div>
    </div>
  );
}
