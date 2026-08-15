const fs = require('fs');

const countries = [
  ['Afghanistan', 'AF', 'AFG', 'asia'],
  ['Albania', 'AL', 'ALB', 'europe'],
  ['Algeria', 'DZ', 'DZA', 'africa'],
  ['Andorra', 'AD', 'AND', 'europe'],
  ['Angola', 'AO', 'AGO', 'africa'],
  ['Antigua and Barbuda', 'AG', 'ATG', 'north-america'],
  ['Argentina', 'AR', 'ARG', 'south-america'],
  ['Armenia', 'AM', 'ARM', 'asia'],
  ['Australia', 'AU', 'AUS', 'oceania'],
  ['Austria', 'AT', 'AUT', 'europe'],
  ['Azerbaijan', 'AZ', 'AZE', 'asia'],
  ['Bahamas', 'BS', 'BHS', 'north-america'],
  ['Bahrain', 'BH', 'BHR', 'middle-east'],
  ['Bangladesh', 'BD', 'BGD', 'asia'],
  ['Barbados', 'BB', 'BRB', 'north-america'],
  ['Belarus', 'BY', 'BLR', 'europe'],
  ['Belgium', 'BE', 'BEL', 'europe'],
  ['Belize', 'BZ', 'BLZ', 'north-america'],
  ['Benin', 'BJ', 'BEN', 'africa'],
  ['Bhutan', 'BT', 'BTN', 'asia'],
  ['Bolivia', 'BO', 'BOL', 'south-america'],
  ['Bosnia and Herzegovina', 'BA', 'BIH', 'europe'],
  ['Botswana', 'BW', 'BWA', 'africa'],
  ['Brazil', 'BR', 'BRA', 'south-america'],
  ['Brunei', 'BN', 'BRN', 'asia'],
  ['Bulgaria', 'BG', 'BGR', 'europe'],
  ['Burkina Faso', 'BF', 'BFA', 'africa'],
  ['Burundi', 'BI', 'BDI', 'africa'],
  ['Cape Verde', 'CV', 'CPV', 'africa'],
  ['Cambodia', 'KH', 'KHM', 'asia'],
  ['Cameroon', 'CM', 'CMR', 'africa'],
  ['Canada', 'CA', 'CAN', 'north-america'],
  ['Central African Republic', 'CF', 'CAF', 'africa'],
  ['Chad', 'TD', 'TCD', 'africa'],
  ['Chile', 'CL', 'CHL', 'south-america'],
  ['China', 'CN', 'CHN', 'asia'],
  ['Colombia', 'CO', 'COL', 'south-america'],
  ['Comoros', 'KM', 'COM', 'africa'],
  ['Congo', 'CG', 'COG', 'africa'],
  ['Costa Rica', 'CR', 'CRI', 'north-america'],
  ['Croatia', 'HR', 'HRV', 'europe'],
  ['Cuba', 'CU', 'CUB', 'north-america'],
  ['Cyprus', 'CY', 'CYP', 'middle-east'],
  ['Czech Republic', 'CZ', 'CZE', 'europe'],
  ['Denmark', 'DK', 'DNK', 'europe'],
  ['Djibouti', 'DJ', 'DJI', 'africa'],
  ['Dominica', 'DM', 'DMA', 'north-america'],
  ['Dominican Republic', 'DO', 'DOM', 'north-america'],
  ['DR Congo', 'CD', 'COD', 'africa'],
  ['Ecuador', 'EC', 'ECU', 'south-america'],
  ['Egypt', 'EG', 'EGY', 'middle-east'],
  ['El Salvador', 'SV', 'SLV', 'north-america'],
  ['Equatorial Guinea', 'GQ', 'GNQ', 'africa'],
  ['Eritrea', 'ER', 'ERI', 'africa'],
  ['Estonia', 'EE', 'EST', 'europe'],
  ['Eswatini', 'SZ', 'SWZ', 'africa'],
  ['Ethiopia', 'ET', 'ETH', 'africa'],
  ['Fiji', 'FJ', 'FJI', 'oceania'],
  ['Finland', 'FI', 'FIN', 'europe'],
  ['France', 'FR', 'FRA', 'europe'],
  ['Gabon', 'GA', 'GAB', 'africa'],
  ['Gambia', 'GM', 'GMB', 'africa'],
  ['Georgia', 'GE', 'GEO', 'asia'],
  ['Germany', 'DE', 'DEU', 'europe'],
  ['Ghana', 'GH', 'GHA', 'africa'],
  ['Greece', 'GR', 'GRC', 'europe'],
  ['Grenada', 'GD', 'GRD', 'north-america'],
  ['Guatemala', 'GT', 'GTM', 'north-america'],
  ['Guinea', 'GN', 'GIN', 'africa'],
  ['Guinea-Bissau', 'GW', 'GNB', 'africa'],
  ['Guyana', 'GY', 'GUY', 'south-america'],
  ['Haiti', 'HT', 'HTI', 'north-america'],
  ['Honduras', 'HN', 'HND', 'north-america'],
  ['Hungary', 'HU', 'HUN', 'europe'],
  ['Iceland', 'IS', 'ISL', 'europe'],
  ['India', 'IN', 'IND', 'asia'],
  ['Indonesia', 'ID', 'IDN', 'asia'],
  ['Iran', 'IR', 'IRN', 'middle-east'],
  ['Iraq', 'IQ', 'IRQ', 'middle-east'],
  ['Ireland', 'IE', 'IRL', 'europe'],
  ['Israel', 'IL', 'ISR', 'middle-east'],
  ['Italy', 'IT', 'ITA', 'europe'],
  ['Ivory Coast', 'CI', 'CIV', 'africa'],
  ['Jamaica', 'JM', 'JAM', 'north-america'],
  ['Japan', 'JP', 'JPN', 'asia'],
  ['Jordan', 'JO', 'JOR', 'middle-east'],
  ['Kazakhstan', 'KZ', 'KAZ', 'asia'],
  ['Kenya', 'KE', 'KEN', 'africa'],
  ['Kiribati', 'KI', 'KIR', 'oceania'],
  ['Kosovo', 'XK', 'XKX', 'europe'],
  ['Kuwait', 'KW', 'KWT', 'middle-east'],
  ['Kyrgyzstan', 'KG', 'KGZ', 'asia'],
  ['Laos', 'LA', 'LAO', 'asia'],
  ['Latvia', 'LV', 'LVA', 'europe'],
  ['Lebanon', 'LB', 'LBN', 'middle-east'],
  ['Lesotho', 'LS', 'LSO', 'africa'],
  ['Liberia', 'LR', 'LBR', 'africa'],
  ['Libya', 'LY', 'LBY', 'africa'],
  ['Liechtenstein', 'LI', 'LIE', 'europe'],
  ['Lithuania', 'LT', 'LTU', 'europe'],
  ['Luxembourg', 'LU', 'LUX', 'europe'],
  ['Madagascar', 'MG', 'MDG', 'africa'],
  ['Malawi', 'MW', 'MWI', 'africa'],
  ['Malaysia', 'MY', 'MYS', 'asia'],
  ['Maldives', 'MV', 'MDV', 'asia'],
  ['Mali', 'ML', 'MLI', 'africa'],
  ['Malta', 'MT', 'MLT', 'europe'],
  ['Marshall Islands', 'MH', 'MHL', 'oceania'],
  ['Mauritania', 'MR', 'MRT', 'africa'],
  ['Mauritius', 'MU', 'MUS', 'africa'],
  ['Mexico', 'MX', 'MEX', 'north-america'],
  ['Micronesia', 'FM', 'FSM', 'oceania'],
  ['Moldova', 'MD', 'MDA', 'europe'],
  ['Monaco', 'MC', 'MCO', 'europe'],
  ['Mongolia', 'MN', 'MNG', 'asia'],
  ['Montenegro', 'ME', 'MNE', 'europe'],
  ['Morocco', 'MA', 'MAR', 'africa'],
  ['Mozambique', 'MZ', 'MOZ', 'africa'],
  ['Myanmar', 'MM', 'MMR', 'asia'],
  ['Namibia', 'NA', 'NAM', 'africa'],
  ['Nauru', 'NR', 'NRU', 'oceania'],
  ['Nepal', 'NP', 'NPL', 'asia'],
  ['Netherlands', 'NL', 'NLD', 'europe'],
  ['New Zealand', 'NZ', 'NZL', 'oceania'],
  ['Nicaragua', 'NI', 'NIC', 'north-america'],
  ['Niger', 'NE', 'NER', 'africa'],
  ['Nigeria', 'NG', 'NGA', 'africa'],
  ['North Korea', 'KP', 'PRK', 'asia'],
  ['North Macedonia', 'MK', 'MKD', 'europe'],
  ['Norway', 'NO', 'NOR', 'europe'],
  ['Oman', 'OM', 'OMN', 'middle-east'],
  ['Pakistan', 'PK', 'PAK', 'asia'],
  ['Palau', 'PW', 'PLW', 'oceania'],
  ['Palestine', 'PS', 'PSE', 'middle-east'],
  ['Panama', 'PA', 'PAN', 'north-america'],
  ['Papua New Guinea', 'PG', 'PNG', 'oceania'],
  ['Paraguay', 'PY', 'PRY', 'south-america'],
  ['Peru', 'PE', 'PER', 'south-america'],
  ['Philippines', 'PH', 'PHL', 'asia'],
  ['Poland', 'PL', 'POL', 'europe'],
  ['Portugal', 'PT', 'PRT', 'europe'],
  ['Qatar', 'QA', 'QAT', 'middle-east'],
  ['Romania', 'RO', 'ROU', 'europe'],
  ['Russia', 'RU', 'RUS', 'europe'],
  ['Rwanda', 'RW', 'RWA', 'africa'],
  ['Saint Kitts and Nevis', 'KN', 'KNA', 'north-america'],
  ['Saint Lucia', 'LC', 'LCA', 'north-america'],
  ['Saint Vincent and the Grenadines', 'VC', 'VCT', 'north-america'],
  ['Samoa', 'WS', 'WSM', 'oceania'],
  ['San Marino', 'SM', 'SMR', 'europe'],
  ['Sao Tome and Principe', 'ST', 'STP', 'africa'],
  ['Saudi Arabia', 'SA', 'SAU', 'middle-east'],
  ['Senegal', 'SN', 'SEN', 'africa'],
  ['Serbia', 'RS', 'SRB', 'europe'],
  ['Seychelles', 'SC', 'SYC', 'africa'],
  ['Sierra Leone', 'SL', 'SLE', 'africa'],
  ['Singapore', 'SG', 'SGP', 'asia'],
  ['Slovakia', 'SK', 'SVK', 'europe'],
  ['Slovenia', 'SI', 'SVN', 'europe'],
  ['Solomon Islands', 'SB', 'SLB', 'oceania'],
  ['Somalia', 'SO', 'SOM', 'africa'],
  ['South Africa', 'ZA', 'ZAF', 'africa'],
  ['South Korea', 'KR', 'KOR', 'asia'],
  ['South Sudan', 'SS', 'SSD', 'africa'],
  ['Spain', 'ES', 'ESP', 'europe'],
  ['Sri Lanka', 'LK', 'LKA', 'asia'],
  ['Sudan', 'SD', 'SDN', 'africa'],
  ['Suriname', 'SR', 'SUR', 'south-america'],
  ['Sweden', 'SE', 'SWE', 'europe'],
  ['Switzerland', 'CH', 'CHE', 'europe'],
  ['Syria', 'SY', 'SYR', 'middle-east'],
  ['Taiwan', 'TW', 'TWN', 'asia'],
  ['Tajikistan', 'TJ', 'TJK', 'asia'],
  ['Tanzania', 'TZ', 'TZA', 'africa'],
  ['Thailand', 'TH', 'THA', 'asia'],
  ['Timor-Leste', 'TL', 'TLS', 'asia'],
  ['Togo', 'TG', 'TGO', 'africa'],
  ['Tonga', 'TO', 'TON', 'oceania'],
  ['Trinidad and Tobago', 'TT', 'TTO', 'north-america'],
  ['Tunisia', 'TN', 'TUN', 'africa'],
  ['Turkey', 'TR', 'TUR', 'middle-east'],
  ['Turkmenistan', 'TM', 'TKM', 'asia'],
  ['Tuvalu', 'TV', 'TUV', 'oceania'],
  ['Uganda', 'UG', 'UGA', 'africa'],
  ['Ukraine', 'UA', 'UKR', 'europe'],
  ['United Arab Emirates', 'AE', 'ARE', 'middle-east'],
  ['United Kingdom', 'GB', 'GBR', 'europe'],
  ['United States', 'US', 'USA', 'north-america'],
  ['Uruguay', 'UY', 'URY', 'south-america'],
  ['Uzbekistan', 'UZ', 'UZB', 'asia'],
  ['Vanuatu', 'VU', 'VUT', 'oceania'],
  ['Vatican City', 'VA', 'VAT', 'europe'],
  ['Venezuela', 'VE', 'VEN', 'south-america'],
  ['Vietnam', 'VN', 'VNM', 'asia'],
  ['Yemen', 'YE', 'YEM', 'middle-east'],
  ['Zambia', 'ZM', 'ZMB', 'africa'],
  ['Zimbabwe', 'ZW', 'ZWE', 'africa'],
];

console.log('count', countries.length);

const phpPath = 'd:/live/WWA-backend-New_main/app/Support/WorldCountries.php';
let php = `<?php

namespace App\\Support;

/**
 * Canonical worldwide country list (ISO 3166-1) for Filament, API, and seeding.
 */
class WorldCountries
{
    /** @return array<int, array{name:string,iso_code:string,code:string,region:string}> */
    public static function all(): array
    {
        return [
`;
for (const [name, iso, code, region] of countries) {
  php += `            ['name' => '${name.replace(/'/g, "\\'")}', 'iso_code' => '${iso}', 'code' => '${code}', 'region' => '${region}'],\n`;
}
php += `        ];
    }

    public static function names(): array
    {
        return array_column(self::all(), 'name');
    }

    public static function flagEmoji(string $iso): string
    {
        $iso = strtoupper($iso);
        if (strlen($iso) !== 2) {
            return '🏳️';
        }
        $chars = str_split($iso);

        return mb_chr(ord($chars[0]) + 127397) . mb_chr(ord($chars[1]) + 127397);
    }

    public static function flagUrl(?string $iso, int $width = 40): ?string
    {
        $iso = strtolower((string) $iso);
        if (strlen($iso) !== 2) {
            return null;
        }

        return "https://flagcdn.com/w{$width}/{$iso}.png";
    }
}
`;
fs.writeFileSync(phpPath, php);

const jsPath = 'd:/live/WWA-Frontend-New-main/src/data/worldCountries.js';
let js = `/** Canonical worldwide countries (ISO 3166-1) — keep in sync with backend WorldCountries.php */
export const WORLD_COUNTRIES = [
`;
for (const [name, iso, code, region] of countries) {
  js += `  { name: ${JSON.stringify(name)}, iso: ${JSON.stringify(iso)}, code: ${JSON.stringify(code)}, region: ${JSON.stringify(region)} },\n`;
}
js += `];

export function isoToFlagEmoji(iso) {
  const s = String(iso || '').toUpperCase();
  if (s.length !== 2) return '🏳️';
  return [...s].map((c) => String.fromCodePoint(127397 + c.charCodeAt(0))).join('');
}

export function flagCdnUrl(iso, width = 40) {
  const s = String(iso || '').toLowerCase();
  if (s.length !== 2) return null;
  return \`https://flagcdn.com/w\${width}/\${s}.png\`;
}

export function getWorldCountryByName(name) {
  const q = String(name || '').toLowerCase();
  return WORLD_COUNTRIES.find((c) => c.name.toLowerCase() === q) || null;
}

export function getWorldCountriesByRegion(regionId) {
  return WORLD_COUNTRIES.filter((c) => c.region === regionId)
    .map((c) => c.name)
    .sort((a, b) => a.localeCompare(b));
}

export const WORLD_COUNTRY_NAMES = WORLD_COUNTRIES.map((c) => c.name).sort((a, b) =>
  a.localeCompare(b)
);

export const WORLD_COUNTRY_OPTIONS = WORLD_COUNTRIES.map((c) => ({
  value: c.name,
  label: \`\${isoToFlagEmoji(c.iso)} \${c.name}\`,
  iso: c.iso,
  region: c.region,
})).sort((a, b) => a.value.localeCompare(b.value));

export default WORLD_COUNTRIES;
`;
fs.writeFileSync(jsPath, js);
console.log('wrote', phpPath, jsPath);
