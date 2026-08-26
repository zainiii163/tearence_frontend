import React, { useState, useEffect, useCallback } from 'react';
import api from '../../api';
import { WORLD_COUNTRY_OPTIONS } from '../../data/worldCountries';

/**
 * Cascading Country → City/State select for frontend forms.
 * Fetches zones from /v1/zones/by-country?country_id=...
 * 
 * Props:
 *   countryName    - form field name for country (default 'country')
 *   cityName       - form field name for city/state (default 'city')
 *   countryValue   - controlled value for country
 *   cityValue      - controlled value for city
 *   onCountryChange - callback(countryValue)
 *   onCityChange    - callback(cityValue)
 *   required       - whether fields are required
 *   placeholder    - placeholder texts
 */
const CountryCitySelect = ({
    countryName = 'country',
    cityName = 'city',
    countryValue = '',
    cityValue = '',
    onCountryChange,
    onCityChange,
    required = false,
    placeholder = { country: 'Select country…', city: 'Select city…' },
    className = '',
    disabled = false,
    showFlags = true,
}) => {
    const [cities, setCities] = useState([]);
    const [loadingCities, setLoadingCities] = useState(false);

    const fetchCities = useCallback(async (countryId) => {
        if (!countryId) {
            setCities([]);
            return;
        }
        setLoadingCities(true);
        try {
            const res = await api.get(`/v1/zones/by-country?country_id=${encodeURIComponent(countryId)}`);
            const zones = res.data?.data || [];
            setCities(zones);
        } catch (e) {
            console.error('Failed to load cities:', e);
            setCities([]);
        } finally {
            setLoadingCities(false);
        }
    }, []);

    useEffect(() => {
        if (countryValue) {
            fetchCities(countryValue);
        } else {
            setCities([]);
        }
    }, [countryValue, fetchCities]);

    const handleCountryChange = (e) => {
        const val = e.target.value;
        onCountryChange?.(val);
    };

    const handleCityChange = (e) => {
        onCityChange?.(e.target.value);
    };

    return (
        <div className={`grid grid-cols-1 md:grid-cols-2 gap-4 ${className}`}>
            <div>
                <label htmlFor={countryName} className="block text-sm font-medium text-gray-700 mb-1">
                    Country {required && <span className="text-red-500">*</span>}
                </label>
                <select
                    id={countryName}
                    name={countryName}
                    value={countryValue || ''}
                    onChange={handleCountryChange}
                    required={required}
                    disabled={disabled}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                >
                    <option value="">{placeholder.country}</option>
                    {WORLD_COUNTRY_OPTIONS.map((opt) => (
                        <option key={opt.iso || opt.value} value={opt.value}>
                            {showFlags && opt.flag ? `${opt.flag} ` : ''}{opt.label}
                        </option>
                    ))}
                </select>
            </div>

            <div>
                <label htmlFor={cityName} className="block text-sm font-medium text-gray-700 mb-1">
                    City / State {required && <span className="text-red-500">*</span>}
                </label>
                <select
                    id={cityName}
                    name={cityName}
                    value={cityValue || ''}
                    onChange={handleCityChange}
                    required={required}
                    disabled={disabled || cities.length === 0 || loadingCities}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 disabled:bg-gray-100"
                >
                    <option value="">{loadingCities ? 'Loading…' : cities.length === 0 ? 'Select country first…' : placeholder.city}</option>
                    {cities.map((c) => (
                        <option key={c.id} value={c.id}>
                            {c.name}
                        </option>
                    ))}
                </select>
            </div>
        </div>
    );
};

export default CountryCitySelect;