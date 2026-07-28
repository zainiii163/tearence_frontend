import React from 'react';
import { Calculator } from 'lucide-react';
import CalculatorCategoryGrid from './CalculatorCategoryGrid';

/**
 * Clive: category cards at top → selected tool panel → (ads rendered by parent below).
 */
const CalculatorGridLayout = ({
  title,
  subtitle,
  items = [],
  activeId,
  onSelect,
  theme = 'emerald',
  hideHeader = false,
  gridTitle = 'Calculators',
}) => {
  const active = items.find((item) => item.id === activeId);

  const categories = items.map((item) => ({
    id: item.id,
    name: item.name,
    emoji: item.emoji,
    description: item.description || item.blurb,
  }));

  return (
    <div>
      {!hideHeader && title && (
        <div className="text-center mb-5">
          <Calculator className={`w-8 h-8 mx-auto mb-2 ${
            theme === 'purple'
              ? 'text-purple-600'
              : theme === 'red'
                ? 'text-red-600'
                : theme === 'blue'
                  ? 'text-blue-600'
                  : 'text-emerald-700'
          }`} />
          <h2 className="text-xl sm:text-2xl font-extrabold text-gray-900">{title}</h2>
          {subtitle && <p className="text-sm text-gray-500 mt-1 max-w-lg mx-auto">{subtitle}</p>}
        </div>
      )}

      <CalculatorCategoryGrid
        categories={categories}
        selectedId={activeId}
        onSelect={onSelect}
        theme={theme}
        title={gridTitle}
      />

      {active && (
        <div className="mb-6 max-w-3xl mx-auto bg-white rounded-2xl border border-gray-200 shadow-sm overflow-hidden">
          <div className="px-4 py-3 border-b border-gray-100 bg-gray-50/80">
            <p className="text-sm font-bold text-gray-900">{active.name}</p>
            {(active.description || active.blurb) && (
              <p className="text-xs text-gray-500 mt-0.5">{active.description || active.blurb}</p>
            )}
          </div>
          <div className="p-4 space-y-3">
            {active.body}
            {active.component}
            {active.fields && (
              <>
                {active.fields}
                {typeof active.onCalc === 'function' && (
                  <button
                    type="button"
                    onClick={active.onCalc}
                    className={`px-4 py-2 text-sm font-bold text-white rounded-lg ${
                      theme === 'purple'
                        ? 'bg-purple-700 hover:bg-purple-800'
                        : theme === 'red'
                          ? 'bg-red-600 hover:bg-red-700'
                          : theme === 'blue'
                            ? 'bg-blue-700 hover:bg-blue-800'
                            : 'bg-emerald-700 hover:bg-emerald-800'
                    }`}
                  >
                    Calculate
                  </button>
                )}
                {active.result}
              </>
            )}
          </div>
        </div>
      )}

      {!activeId && (
        <p className="text-center text-sm text-gray-500 mb-4">Select a calculator above to get started.</p>
      )}
    </div>
  );
};

export default CalculatorGridLayout;
