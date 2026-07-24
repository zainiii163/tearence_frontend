/** Country may be a string or a nested master/country object from the API */
export function formatCountry(country) {
  if (country == null || country === '') return '';
  if (typeof country === 'string' || typeof country === 'number') return String(country);
  if (typeof country === 'object') {
    return country.name || country.code || country.iso_code || '';
  }
  return '';
}

export function formatCityCountry(city, country) {
  return [city, formatCountry(country)].filter(Boolean).join(', ');
}

/** Normalize paginated or nested list payloads from Laravel APIs */
export function extractListItems(response) {
  if (!response) return [];
  if (Array.isArray(response)) return response;
  if (Array.isArray(response?.items)) return response.items;
  // Nested pagination mistake: { items: { items: [...] } }
  if (Array.isArray(response?.items?.items)) return response.items.items;

  const data = response.data ?? response;

  if (Array.isArray(data)) return data;
  if (Array.isArray(data?.data)) return data.data;
  if (Array.isArray(data?.items)) return data.items;
  if (Array.isArray(data?.items?.items)) return data.items.items;
  if (Array.isArray(data?.books)) return data.books;
  if (Array.isArray(data?.services)) return data.services;

  return [];
}
