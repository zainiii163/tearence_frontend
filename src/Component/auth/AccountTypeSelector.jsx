import React from 'react';
import { FaUser, FaBuilding } from 'react-icons/fa';

const HINTS = {
  basic: {
    signin: 'Personal account — browse, buy, and post ads from your dashboard.',
    signup: 'For individuals who browse, buy, and post personal listings.',
  },
  business: {
    signin: 'Business account — category dashboards for stores, services, and more.',
    signup: 'For companies that post and manage listings from a business dashboard.',
  },
};

const AccountTypeSelector = ({ value, onChange, mode = 'signup' }) => {
  const hint = HINTS[value]?.[mode] || HINTS.basic.signin;

  return (
    <div className="space-y-2">
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
          <span>{mode === 'signin' ? 'Basic user' : 'Basic'}</span>
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
          <span>{mode === 'signin' ? 'Business' : 'Business'}</span>
        </button>
      </div>
    </div>
  );
};

export default AccountTypeSelector;
