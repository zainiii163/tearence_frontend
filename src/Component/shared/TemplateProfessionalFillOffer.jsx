import React from 'react';
import { FiFileText, FiMessageSquare } from 'react-icons/fi';

/**
 * Clive: offer professional template fill-in service in each template category.
 */
const TemplateProfessionalFillOffer = ({ onRequestQuote, theme = 'emerald' }) => {
  const btn =
    theme === 'slate'
      ? 'bg-[#0c1520] hover:bg-[#1a2838] text-white'
      : theme === 'purple'
        ? 'bg-violet-700 hover:bg-violet-800 text-white'
        : 'bg-teal-700 hover:bg-teal-800 text-white';

  return (
    <aside className="rounded-xl border border-amber-200 bg-gradient-to-br from-amber-50 via-white to-orange-50 p-4 sm:p-5 mb-4">
      <div className="flex flex-col sm:flex-row sm:items-center gap-3 sm:gap-4">
        <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-amber-100 text-amber-800">
          <FiFileText className="h-5 w-5" />
        </div>
        <div className="flex-1 min-w-0">
          <h3 className="text-sm font-bold text-gray-900">Need it filled professionally?</h3>
          <p className="text-xs text-gray-600 mt-0.5 leading-relaxed">
            Buy the fillable template yourself — or request a quote and our business team will prepare the
            contract / paperwork for you.
          </p>
        </div>
        <button
          type="button"
          onClick={onRequestQuote}
          className={`inline-flex items-center justify-center gap-1.5 shrink-0 rounded-lg px-3.5 py-2 text-xs font-bold ${btn}`}
        >
          <FiMessageSquare className="h-3.5 w-3.5" />
          Contact us for a quote
        </button>
      </div>
    </aside>
  );
};

export default TemplateProfessionalFillOffer;
