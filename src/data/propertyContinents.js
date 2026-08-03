/**
 * Browse-by-region taxonomy for Property.
 * Includes map focus + YoY market stats for the animated map overlays (Clive).
 */
export const PROPERTY_CONTINENTS = [
  {
    id: 'europe',
    name: 'Europe',
    lat: 50.5,
    lng: 10,
    zoom: 4,
    bounds: [[35, -12], [71, 40]],
    marketChange: 2.8,
    avgPriceLabel: '€312k',
    countries: [
      'Albania', 'Andorra', 'Austria', 'Belarus', 'Belgium', 'Bosnia and Herzegovina',
      'Bulgaria', 'Croatia', 'Cyprus', 'Czech Republic', 'Denmark', 'Estonia',
      'Finland', 'France', 'Germany', 'Greece', 'Hungary', 'Iceland', 'Ireland',
      'Italy', 'Kosovo', 'Latvia', 'Liechtenstein', 'Lithuania', 'Luxembourg',
      'Malta', 'Moldova', 'Monaco', 'Montenegro', 'Netherlands', 'North Macedonia',
      'Norway', 'Poland', 'Portugal', 'Romania', 'Russia', 'San Marino', 'Serbia',
      'Slovakia', 'Slovenia', 'Spain', 'Sweden', 'Switzerland', 'Ukraine',
      'United Kingdom', 'Vatican City',
    ],
  },
  {
    id: 'north-america',
    name: 'North America',
    lat: 39.8,
    lng: -98.5,
    zoom: 3.5,
    bounds: [[7, -170], [72, -50]],
    marketChange: -1.4,
    avgPriceLabel: '$385k',
    countries: [
      'Antigua and Barbuda', 'Bahamas', 'Barbados', 'Belize', 'Canada', 'Costa Rica',
      'Cuba', 'Dominica', 'Dominican Republic', 'El Salvador', 'Grenada', 'Guatemala',
      'Haiti', 'Honduras', 'Jamaica', 'Mexico', 'Nicaragua', 'Panama',
      'Saint Kitts and Nevis', 'Saint Lucia', 'Saint Vincent and the Grenadines',
      'Trinidad and Tobago', 'United States',
    ],
  },
  {
    id: 'asia',
    name: 'Asia',
    lat: 34,
    lng: 100,
    zoom: 3.2,
    bounds: [[-10, 60], [55, 145]],
    marketChange: 4.1,
    avgPriceLabel: '$268k',
    countries: [
      'Afghanistan', 'Armenia', 'Azerbaijan', 'Bangladesh', 'Bhutan', 'Brunei',
      'Cambodia', 'China', 'Georgia', 'India', 'Indonesia', 'Japan', 'Kazakhstan',
      'Kyrgyzstan', 'Laos', 'Malaysia', 'Maldives', 'Mongolia', 'Myanmar', 'Nepal',
      'North Korea', 'Pakistan', 'Philippines', 'Singapore', 'South Korea',
      'Sri Lanka', 'Taiwan', 'Tajikistan', 'Thailand', 'Timor-Leste', 'Turkmenistan',
      'Uzbekistan', 'Vietnam',
    ],
  },
  {
    id: 'middle-east',
    name: 'Middle East',
    lat: 25,
    lng: 45,
    zoom: 4,
    bounds: [[12, 32], [42, 60]],
    marketChange: 3.6,
    avgPriceLabel: '$410k',
    countries: [
      'Bahrain', 'Egypt', 'Iran', 'Iraq', 'Israel', 'Jordan', 'Kuwait', 'Lebanon',
      'Oman', 'Palestine', 'Qatar', 'Saudi Arabia', 'Syria', 'Turkey',
      'United Arab Emirates', 'Yemen', 'Cyprus',
    ],
  },
  {
    id: 'africa',
    name: 'Africa',
    lat: 2,
    lng: 20,
    zoom: 3,
    bounds: [[-35, -18], [38, 52]],
    marketChange: 1.9,
    avgPriceLabel: '$145k',
    countries: [
      'Algeria', 'Angola', 'Benin', 'Botswana', 'Burkina Faso', 'Burundi',
      'Cameroon', 'Cape Verde', 'Central African Republic', 'Chad', 'Comoros',
      'Congo', 'Djibouti', 'DR Congo', 'Egypt', 'Equatorial Guinea', 'Eritrea',
      'Eswatini', 'Ethiopia', 'Gabon', 'Gambia', 'Ghana', 'Guinea', 'Guinea-Bissau',
      'Ivory Coast', 'Kenya', 'Lesotho', 'Liberia', 'Libya', 'Madagascar', 'Malawi',
      'Mali', 'Mauritania', 'Mauritius', 'Morocco', 'Mozambique', 'Namibia', 'Niger',
      'Nigeria', 'Rwanda', 'Senegal', 'Seychelles', 'Sierra Leone', 'Somalia',
      'South Africa', 'South Sudan', 'Sudan', 'Tanzania', 'Togo', 'Tunisia',
      'Uganda', 'Zambia', 'Zimbabwe',
    ],
  },
  {
    id: 'south-america',
    name: 'South America',
    lat: -15,
    lng: -58,
    zoom: 3.2,
    bounds: [[-56, -82], [13, -34]],
    marketChange: -0.8,
    avgPriceLabel: '$165k',
    countries: [
      'Argentina', 'Bolivia', 'Brazil', 'Chile', 'Colombia', 'Ecuador', 'Guyana',
      'Paraguay', 'Peru', 'Suriname', 'Uruguay', 'Venezuela',
    ],
  },
  {
    id: 'oceania',
    name: 'Oceania',
    lat: -25,
    lng: 135,
    zoom: 3.5,
    bounds: [[-48, 110], [0, 180]],
    marketChange: 2.2,
    avgPriceLabel: 'A$520k',
    countries: [
      'Australia', 'Fiji', 'Kiribati', 'Marshall Islands', 'Micronesia', 'Nauru',
      'New Zealand', 'Palau', 'Papua New Guinea', 'Samoa', 'Solomon Islands',
      'Tonga', 'Tuvalu', 'Vanuatu',
    ],
  },
];

export const getContinentById = (id) =>
  PROPERTY_CONTINENTS.find((c) => c.id === String(id || '').toLowerCase()) || null;

export const getContinentByName = (name) => {
  const q = String(name || '').toLowerCase();
  return PROPERTY_CONTINENTS.find((c) => c.name.toLowerCase() === q || c.id === q) || null;
};

export const countryToSlug = (country) =>
  String(country || '')
    .trim()
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-|-$/g, '');

export const findCountryBySlug = (slug) => {
  const s = String(slug || '').toLowerCase();
  for (const continent of PROPERTY_CONTINENTS) {
    const match = continent.countries.find((c) => countryToSlug(c) === s);
    if (match) return { country: match, continent };
  }
  return null;
};
