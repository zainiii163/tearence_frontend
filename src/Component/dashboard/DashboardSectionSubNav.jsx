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
 * Soft pill sub-nav for a dashboard section (Overview | Table | Create, etc.).
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
            <h2 className="text-xl sm:text-2xl font-bold text-white tracking-tight">
              {title}
            </h2>
          ) : null}
          {subtitle ? (
            <p className="text-sm text-[color:var(--dash-muted)] mt-0.5">{subtitle}</p>
          ) : null}
        </div>
      )}
      <div className="dash-subnav-track">
        {items.map((item) => {
          const Icon = ICONS[item.id] || FaTable;
          const on = activeSub === item.id;
          return (
            <button
              key={item.id}
              type="button"
              onClick={() => onChange?.(item.id)}
              className={`dash-subnav-pill ${on ? 'is-active' : 'hover:bg-white/10 hover:text-white'}`}
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
