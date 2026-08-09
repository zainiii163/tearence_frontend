import React from 'react';
import { FaUser, FaBuilding } from 'react-icons/fa';

const HINTS = {
  basic: {
    signin: 'Personal account — browse, buy, and post ads from your dashboard.',
    signup: 'For individuals who browse, buy, and post personal listings.',
  },
  business: {
    signin: 'Business account — category dashboards for tow, mechanics, stores, and more.',
    signup: 'For companies that post and manage listings from a business dashboard.',
  },
};

const AccountTypeSelector = ({ value, onChange, mode = 'signup' }) => {
  const hint = HINTS[value]?.[mode] || HINTS.basic.signin;

  return (
    <div className="space-y-2">
      <div className="grid grid-cols-2 gap-2 p-1 bg-muted rounded-lg">
        <button
          type="button"
          onClick={() => onChange('basic')}
          className={`flex items-center justify-center gap-2 rounded-md px-3 py-2.5 text-sm font-semibold transition-all ${
            value === 'basic'
              ? 'bg-background text-foreground shadow-sm ring-1 ring-border'
              : 'text-muted-foreground hover:text-foreground'
          }`}
        >
          <FaUser className="h-4 w-4 shrink-0" />
          <span>{mode === 'signin' ? 'Basic user' : 'Basic account'}</span>
        </button>
        <button
          type="button"
          onClick={() => onChange('business')}
          className={`flex items-center justify-center gap-2 rounded-md px-3 py-2.5 text-sm font-semibold transition-all ${
            value === 'business'
              ? 'bg-background text-foreground shadow-sm ring-1 ring-border'
              : 'text-muted-foreground hover:text-foreground'
          }`}
        >
          <FaBuilding className="h-4 w-4 shrink-0" />
          <span>{mode === 'signin' ? 'Business' : 'Business account'}</span>
        </button>
      </div>
      <p className="text-xs text-muted-foreground text-center leading-relaxed px-1">{hint}</p>
    </div>
  );
};

export default AccountTypeSelector;
