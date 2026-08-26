import React from 'react';
import { FaUser, FaBuilding } from 'react-icons/fa';

/**
 * Clive: labels only — User account / Business account.
 * No helper text under the buttons.
 */
const AccountTypeSelector = ({ value, onChange }) => {
  return (
    <div className="grid grid-cols-2 gap-2">
      <button
        type="button"
        onClick={() => onChange('basic')}
        className={`flex items-center justify-center gap-2 rounded-xl px-3 py-3 text-sm font-semibold transition-all border ${
          value === 'basic'
            ? 'bg-sky-50 text-primary border-primary/30 shadow-sm'
            : 'bg-white text-slate-500 border-slate-200 hover:border-slate-300 hover:text-slate-700'
        }`}
      >
        <FaUser className="h-4 w-4 shrink-0" />
        <span>User account</span>
      </button>
      <button
        type="button"
        onClick={() => onChange('business')}
        className={`flex items-center justify-center gap-2 rounded-xl px-3 py-3 text-sm font-semibold transition-all border ${
          value === 'business'
            ? 'bg-sky-50 text-primary border-primary/30 shadow-sm'
            : 'bg-white text-slate-500 border-slate-200 hover:border-slate-300 hover:text-slate-700'
        }`}
      >
        <FaBuilding className="h-4 w-4 shrink-0" />
        <span>Business account</span>
      </button>
    </div>
  );
};

export default AccountTypeSelector;
