import React from 'react';

const CategoryPerformanceBars = ({ items = [], loading = false }) => {
  if (loading) {
    return (
      <div className="space-y-4">
        {[1, 2, 3, 4].map((i) => (
          <div key={i} className="h-10 rounded-lg bg-slate-100 animate-pulse" />
        ))}
      </div>
    );
  }

  if (!items.length) {
    return <p className="text-sm text-slate-500">Performance metrics will appear as you add listings and activity.</p>;
  }

  return (
    <div className="space-y-4">
      {items.map((item) => {
        const percent = Math.min(100, Math.max(0, Number(item.percent ?? item.value ?? 0)));
        return (
          <div key={item.key || item.label} className="group">
            <div className="mb-1.5 flex items-center justify-between gap-2 text-sm">
              <span className="font-medium text-slate-700">{item.label}</span>
              <span className="tabular-nums text-slate-500">
                {typeof item.value === 'number' && item.max === 100
                  ? `${percent}%`
                  : `${item.value ?? 0}${item.max ? ` / ${item.max}` : ''}`}
              </span>
            </div>
            <div className="h-2.5 overflow-hidden rounded-full bg-slate-100">
              <div
                className="h-full rounded-full bg-gradient-to-r from-indigo-500 to-violet-500 transition-all duration-700 ease-out group-hover:from-indigo-600 group-hover:to-violet-600"
                style={{ width: `${percent}%` }}
              />
            </div>
          </div>
        );
      })}
    </div>
  );
};

export default CategoryPerformanceBars;
