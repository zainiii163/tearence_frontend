import React from 'react';
import { FaUser, FaBuilding } from 'react-icons/fa';

const AccountTypeSelector = ({ value, onChange, mode = 'signup' }) => (
  <div className="grid grid-cols-2 gap-2 p-1 bg-muted rounded-lg">
    <button
      type="button"
      onClick={() => onChange('basic')}
      className={`flex items-center justify-center gap-2 rounded-md px-3 py-2.5 text-sm font-semibold transition-all ${
        value === 'basic'
          ? 'bg-background text-foreground shadow-sm'
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
          ? 'bg-background text-foreground shadow-sm'
          : 'text-muted-foreground hover:text-foreground'
      }`}
    >
      <FaBuilding className="h-4 w-4 shrink-0" />
      <span>{mode === 'signin' ? 'Business' : 'Business account'}</span>
    </button>
  </div>
);

export default AccountTypeSelector;
