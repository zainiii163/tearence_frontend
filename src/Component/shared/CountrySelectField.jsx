import React from 'react';
import { WORLD_COUNTRY_OPTIONS } from '../../data/worldCountries';

/**
 * Worldwide country <select> with flag emoji labels.
 * value = country name (e.g. "Canada")
 */
const CountrySelectField = ({
  value = '',
  onChange,
  name = 'country',
  id,
  required = false,
  disabled = false,
  className = '',
  placeholder = 'Select country…',
  includeEmpty = true,
}) => {
  return (
    <select
      id={id || name}
      name={name}
      value={value || ''}
      required={required}
      disabled={disabled}
      onChange={(e) => onChange?.(e.target.value, e)}
      className={className}
      aria-label="Country"
    >
      {includeEmpty ? <option value="">{placeholder}</option> : null}
      {WORLD_COUNTRY_OPTIONS.map((opt) => (
        <option key={opt.iso || opt.value} value={opt.value}>
          {opt.label}
        </option>
      ))}
    </select>
  );
};

export default CountrySelectField;
